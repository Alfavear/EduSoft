"use client";

import { useEffect, useState } from "react";
import { Clock, Landmark, CalendarDays } from "lucide-react";

export function TopBarInfo({ schoolName, periodName }: { schoolName: string, periodName: string }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CO', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    }).replace('.', '');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="desktop-only" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '2rem', 
      marginRight: 'auto', 
      marginLeft: '2rem',
      fontSize: '0.8125rem',
      color: 'var(--text-muted)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Landmark size={14} color="var(--color-primary)" />
        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{schoolName}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', padding: '0.25rem 0.75rem', borderRadius: '1rem', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
        <CalendarDays size={14} color="var(--color-primary)" />
        <span style={{ fontWeight: '500' }}>{periodName}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '140px' }}>
        <Clock size={14} />
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatDate(time)} • <strong style={{ color: 'var(--text-main)' }}>{formatTime(time)}</strong>
        </span>
      </div>
    </div>
  );
}
