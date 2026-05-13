"use client";

import { useState } from "react";
import { toggleConditionalEnrollment } from "../observadorActions";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";

export function ConditionalToggle({ studentId, initialStatus }: { studentId: string, initialStatus: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!confirm(`¿Estás seguro de que deseas ${initialStatus ? 'REMOVER' : 'ACTIVAR'} la matrícula condicional para este estudiante?`)) return;
    
    setLoading(true);
    const res = await toggleConditionalEnrollment(studentId, !initialStatus);
    if (!res.success) {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={initialStatus ? "btn-secondary" : "btn-primary"}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        padding: '0.75rem 1.25rem', 
        width: '100%', 
        justifyContent: 'center',
        backgroundColor: initialStatus ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        color: initialStatus ? 'var(--color-success)' : 'var(--color-danger)',
        border: initialStatus ? '1px solid var(--color-success)' : '1px solid var(--color-danger)',
        fontWeight: 'bold'
      }}
    >
      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : initialStatus ? (
        <>
          <ShieldCheck size={20} />
          Remover Condicional
        </>
      ) : (
        <>
          <ShieldAlert size={20} />
          Activar Matrícula Condicional
        </>
      )}
    </button>
  );
}
