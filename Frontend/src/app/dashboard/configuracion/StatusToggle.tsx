"use client";

import { togglePeriodStatus, toggleYearStatus } from "./actions";
import { Lock, Unlock, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

export function StatusToggle({ yearId, isActive, periodId, status, type = "year" }: any) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    if (type === "year") {
      await toggleYearStatus(yearId, isActive);
    } else {
      await togglePeriodStatus(periodId, status);
    }
    setLoading(false);
  };

  if (type === "year") {
    return (
      <button 
        onClick={handleToggle} 
        disabled={loading}
        style={{ 
          background: 'none', border: '1px solid var(--border-light)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius)', 
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem',
          color: isActive ? 'var(--color-primary)' : 'var(--text-muted)'
        }}
      >
        {isActive ? <CheckCircle2 size={16} /> : <Circle size={16} />}
        {isActive ? "Año Activo" : "Activar Año"}
      </button>
    );
  }

  return (
    <button 
      onClick={handleToggle} 
      disabled={loading}
      style={{ 
        width: '100%', marginTop: '0.5rem', background: 'white', border: `1px solid ${status === 'OPEN' ? 'var(--color-success)' : 'var(--color-danger)'}`, 
        padding: '0.4rem', borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem',
        color: status === 'OPEN' ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 'bold'
      }}
    >
      {status === 'OPEN' ? <Unlock size={14} /> : <Lock size={14} />}
      {status === 'OPEN' ? "ABIERTO" : "CERRADO"}
    </button>
  );
}
