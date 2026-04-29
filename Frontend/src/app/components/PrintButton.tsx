"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ label = "Imprimir", className = "btn-primary" }: { label?: string, className?: string }) {
  return (
    <button 
      onClick={() => window.print()} 
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
    >
      <Printer size={18} /> {label}
    </button>
  );
}
