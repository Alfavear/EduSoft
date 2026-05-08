"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="btn-primary"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        padding: '0.5rem 1rem'
      }}
    >
      <Printer size={18} />
      Imprimir Reporte
    </button>
  );
}
