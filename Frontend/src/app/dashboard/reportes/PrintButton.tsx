"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Imprimir" }: { label?: string }) {
  return (
    <button 
      onClick={() => window.print()} 
      className="btn-primary" 
      style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
    >
      <Printer size={20} /> {label}
    </button>
  );
}
