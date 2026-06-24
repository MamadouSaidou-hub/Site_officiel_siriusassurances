// ============================================================================
// cleanup-orphans.mjs — one-shot reconciliation of orphaned Storage files
// ----------------------------------------------------------------------------
// Lists every object in the article-covers / article-videos buckets, compares
// it against the cover_url / video_url referenced by news_articles, and reports
// (or deletes) the files no row points to anymore.
//
// Usage (from project root):
//   node scripts/cleanup-orphans.mjs            # DRY RUN — lists orphans only
//   node scripts/cleanup-orphans.mjs --delete   # actually deletes the orphans
//
// Talks to the Supabase REST + Storage HTTP APIs with `fetch` (no supabase-js,
// which pulls in a Realtime/WebSocket client that breaks on Node < 22).
// Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (process.env,
// falling back to .env / .env.local). Service-role bypasses RLS.
// ============================================================================

import { readFileSync } from "node:fs";

const BUCKETS = ["article-covers", "article-videos"];
const DELETE = process.argv.includes("--delete");

// --- Minimal .env loader (no dotenv dependency) -----------------------------
function loadEnvFile(path) {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return;
  }
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = val;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_BASE || !KEY) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

/** Extract the in-bucket object path from a Supabase public URL, or null. */
function storagePathFromPublicUrl(value, bucket) {
  if (!value) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = value.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(value.slice(idx + marker.length));
}

/** List every object name in a (flat) bucket, paginating. */
async function listAllObjects(bucket) {
  const names = [];
  const limit = 1000;
  let offset = 0;
  for (;;) {
    const res = await fetch(`${URL_BASE}/storage/v1/object/list/${bucket}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        prefix: "",
        limit,
        offset,
        sortBy: { column: "name", order: "asc" },
      }),
    });
    if (!res.ok) {
      throw new Error(`list(${bucket}) → ${res.status} ${await res.text()}`);
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    // Skip placeholder folder rows (id === null).
    for (const o of data) if (o.id) names.push(o.name);
    if (data.length < limit) break;
    offset += limit;
  }
  return names;
}

async function deleteObjects(bucket, names) {
  const res = await fetch(`${URL_BASE}/storage/v1/object/${bucket}`, {
    method: "DELETE",
    headers,
    body: JSON.stringify({ prefixes: names }),
  });
  if (!res.ok) {
    throw new Error(`delete(${bucket}) → ${res.status} ${await res.text()}`);
  }
}

async function fetchReferenced() {
  const res = await fetch(
    `${URL_BASE}/rest/v1/news_articles?select=cover_url,video_url`,
    { headers }
  );
  if (!res.ok) {
    throw new Error(`select news_articles → ${res.status} ${await res.text()}`);
  }
  const rows = await res.json();
  const referenced = {
    "article-covers": new Set(),
    "article-videos": new Set(),
  };
  for (const a of rows ?? []) {
    const c = storagePathFromPublicUrl(a.cover_url, "article-covers");
    if (c) referenced["article-covers"].add(c);
    const v = storagePathFromPublicUrl(a.video_url, "article-videos");
    if (v) referenced["article-videos"].add(v);
  }
  return referenced;
}

async function main() {
  console.log(
    `\n🧹 Réconciliation Storage — mode ${DELETE ? "🔴 DELETE" : "🧪 DRY RUN"}\n`
  );

  const referenced = await fetchReferenced();

  let totalOrphans = 0;
  for (const bucket of BUCKETS) {
    const all = await listAllObjects(bucket);
    const orphans = all.filter((p) => !referenced[bucket].has(p));
    totalOrphans += orphans.length;

    console.log(
      `📦 ${bucket}: ${all.length} fichier(s) | ${referenced[bucket].size} référencé(s) | ${orphans.length} orphelin(s)`
    );
    for (const p of orphans) console.log(`   - ${p}`);

    if (DELETE && orphans.length > 0) {
      for (let i = 0; i < orphans.length; i += 1000) {
        const batch = orphans.slice(i, i + 1000);
        await deleteObjects(bucket, batch);
        console.log(`   ✅ ${batch.length} supprimé(s)`);
      }
    }
    console.log("");
  }

  if (!DELETE && totalOrphans > 0) {
    console.log(
      `ℹ️  ${totalOrphans} orphelin(s) au total. Relance avec --delete pour les supprimer.\n`
    );
  } else if (totalOrphans === 0) {
    console.log("✨ Aucun orphelin. Les buckets sont propres.\n");
  }
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
