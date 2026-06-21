"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/data";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-sirius-border bg-sirius-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-container items-center justify-between px-6 py-5 lg:px-10">
        <a href="#" className="text-lg font-extrabold tracking-tight text-sirius-text">
          Sirius Assurances
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`relative pb-1 text-sm font-semibold transition-colors ${
                item.active ? "text-sirius-gold" : "text-white/55 hover:text-white"
              }`}
            >
              {item.label}
              {item.active && (
                <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] rounded-full bg-sirius-gold" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full bg-sirius-gold px-5 py-2.5 text-sm font-bold text-sirius-bg sm:inline-flex"
          >
            Devis gratuit
          </a>
          <button
            className="text-sirius-text lg:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-sirius-border lg:hidden">
          <div className="mx-auto flex max-w-container flex-col gap-1 px-6 py-4">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                  item.active ? "text-sirius-gold" : "text-white/70"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
