"use client";

import { AlertTriangle, ClipboardList, Clock, CheckCircle2 } from "lucide-react";

export function RemedialManager() {
  return (
    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
      <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <AlertTriangle size={32} color="var(--color-warning)" />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Gestión de Nivelatorios y Habilitaciones</h3>
      <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
        Aquí se listarán los estudiantes con desempeño **BAJO** que requieren actividades de superación. Podrá programar fechas y registrar el resultado final para que el sistema re-evalúe su promoción.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius)' }}>
          <Clock size={20} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
          <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Pendientes de Programar</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>0</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius)' }}>
          <ClipboardList size={20} color="var(--color-warning)" style={{ marginBottom: '1rem' }} />
          <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>En Proceso</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>0</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius)' }}>
          <CheckCircle2 size={20} color="var(--color-success)" style={{ marginBottom: '1rem' }} />
          <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Superados</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>0</p>
        </div>
      </div>

      <div style={{ marginTop: '3rem', opacity: 0.5 }}>
        <p style={{ fontSize: '0.875rem' }}>Listado de nivelatorios aparecerá aquí una vez se procese el Cierre de Año.</p>
      </div>
    </div>
  );
}
