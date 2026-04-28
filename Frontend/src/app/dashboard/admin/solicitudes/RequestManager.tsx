"use client";

import { respondToRequest } from "../../clases/actions";
import { Check, X, Clock, User, BookOpen, AlertCircle } from "lucide-react";
import { useState } from "react";

export function RequestManager({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);

  const handleResponse = async (id: string, status: "APPROVED" | "REJECTED") => {
    const hours = status === 'APPROVED' ? 24 : undefined; // Habilitar por 24 horas por defecto
    const res = await respondToRequest(id, status, hours);
    if (res.success) {
      setRequests(requests.map(r => r.id === id ? { ...r, status, expiresAt: hours ? new Date(Date.now() + hours * 3600000).toISOString() : null } : r));
    }
  };

  return (
    <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
      {requests.map(req => (
        <div key={req.id} className="card" style={{ padding: '1.5rem', borderLeft: `5px solid ${req.status === 'PENDING' ? 'var(--color-warning)' : req.status === 'APPROVED' ? 'var(--color-success)' : 'var(--color-danger)'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
              <User size={18} color="var(--color-primary)" />
              {req.assignment.teacher.firstName} {req.assignment.teacher.lastName}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '1rem', backgroundColor: 'var(--bg-app)' }}>
              {req.status}
            </span>
          </div>

          <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <BookOpen size={16} /> {req.assignment.subject.name} - {req.assignment.course.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)', fontWeight: '500', marginTop: '0.25rem' }}>
              <AlertCircle size={16} /> Periodo: {req.period.name}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-app)', padding: '0.75rem', borderRadius: 'var(--radius)', fontSize: '0.875rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            "{req.reason}"
          </div>

          {req.status === 'PENDING' ? (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => handleResponse(req.id, 'APPROVED')} className="btn-primary" style={{ flex: 1, backgroundColor: 'var(--color-success)' }}>
                <Check size={18} /> Aprobar (24h)
              </button>
              <button onClick={() => handleResponse(req.id, 'REJECTED')} className="btn-secondary" style={{ flex: 1, color: 'var(--color-danger)' }}>
                <X size={18} /> Rechazar
              </button>
            </div>
          ) : req.status === 'APPROVED' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: 'bold' }}>
               <Clock size={16} /> Expira: {new Date(req.expiresAt).toLocaleString()}
            </div>
          )}
        </div>
      ))}
      {requests.length === 0 && (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          No hay solicitudes pendientes.
        </div>
      )}
    </div>
  );
}
