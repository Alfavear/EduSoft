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
      gap: '1.5rem', 
      marginLeft: 'auto', 
      marginRight: '1rem',
      fontSize: '0.8125rem',
    }}>
      {/* Red Banner - Institutional Info */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.25rem',
        backgroundColor: 'rgba(239, 68, 68, 0.08)', 
        padding: '0.4rem 1.25rem', 
        borderRadius: '12px', 
        border: '1px solid rgba(239, 68, 68, 0.15)',
        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.05)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderRight: '1px solid rgba(239, 68, 68, 0.2)', paddingRight: '1rem' }}>
          <Landmark size={15} color="#dc2626" style={{ filter: 'drop-shadow(0 0 2px rgba(220, 38, 38, 0.2))' }} />
          <span style={{ fontWeight: '700', color: '#991b1b', letterSpacing: '0.01em' }}>{schoolName}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderRight: '1px solid rgba(239, 68, 68, 0.2)', paddingRight: '1rem' }}>
          <CalendarDays size={15} color="#dc2626" />
          <span style={{ fontWeight: '600', color: '#b91c1c' }}>{periodName}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: '150px' }}>
          <Clock size={15} color="#dc2626" />
          <span style={{ fontVariantNumeric: 'tabular-nums', color: '#b91c1c', fontWeight: '500' }}>
            {formatDate(time)} • <strong style={{ color: '#991b1b', fontWeight: '700' }}>{formatTime(time)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
