import "server-only";

/**
 * Envoi d'email transactionnel via l'API Resend (aucune dépendance : fetch REST).
 * Nécessite RESEND_API_KEY. L'adresse d'expédition (EMAIL_FROM) doit provenir
 * d'un domaine vérifié dans Resend ; par défaut on retombe sur le domaine de
 * test `onboarding@resend.dev` (n'envoie qu'au propriétaire du compte Resend).
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquant (email non configuré).");
  }
  const from =
    process.env.EMAIL_FROM || "Sirius Assurances <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: params.to, subject: params.subject, html: params.html }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Envoi email échoué (Resend ${res.status}): ${detail}`);
  }
}

/** Gabarit HTML de l'email d'invitation à rejoindre le backoffice. */
export function inviteEmailHtml(params: {
  inviteUrl: string;
  roleLabel: string;
  inviterName?: string | null;
}): string {
  const { inviteUrl, roleLabel } = params;
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#0B1B2E">
    <div style="background:#0B1B2E;padding:28px;text-align:center;border-radius:12px 12px 0 0">
      <span style="color:#fff;font-size:20px;font-weight:800;letter-spacing:1px">SIRIUS</span>
      <span style="color:#17A2DC;font-size:20px;font-weight:800;letter-spacing:3px"> ASSURANCES</span>
    </div>
    <div style="border:1px solid #DDE6EF;border-top:none;padding:32px;border-radius:0 0 12px 12px">
      <h1 style="font-size:20px;margin:0 0 16px">Vous êtes invité au backoffice</h1>
      <p style="font-size:14px;line-height:1.6;color:#5A6B7B;margin:0 0 8px">
        Un accès <b>${roleLabel}</b> vient d'être créé pour vous sur l'espace
        d'administration de Sirius Assurances.
      </p>
      <p style="font-size:14px;line-height:1.6;color:#5A6B7B;margin:0 0 24px">
        Cliquez ci-dessous pour définir votre mot de passe et activer votre compte :
      </p>
      <p style="text-align:center;margin:0 0 24px">
        <a href="${inviteUrl}" style="display:inline-block;background:#17A2DC;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:999px">
          Définir mon mot de passe
        </a>
      </p>
      <p style="font-size:12px;line-height:1.6;color:#8A98A6;margin:0">
        Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br />
        <a href="${inviteUrl}" style="color:#17A2DC;word-break:break-all">${inviteUrl}</a>
      </p>
      <p style="font-size:12px;color:#8A98A6;margin:24px 0 0">
        Ce lien est personnel et à usage unique. Si vous n'attendiez pas cette
        invitation, ignorez cet email.
      </p>
    </div>
  </div>`;
}
