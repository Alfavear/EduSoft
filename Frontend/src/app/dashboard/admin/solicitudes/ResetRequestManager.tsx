"use client";

import { useState } from "react";
import { Check, X, User } from "lucide-react";
import { approveResetRequest } from "../../../login/actions";

interface ResetRequest {
  id: string;
  documentType: string;
  documentId: string;
  status: string;
  createdAt: Date;
}

export function ResetRequestManager({ initialRequests }: { initialRequests: ResetRequest[] }) {
  const [requests, setRequests] = useState(initialRequests);

  const handleApprove = async (id: string) => {
    await approveResetRequest(id);
    setRequests(requests.filter(r => r.id !== id));
  };

  if (requests.length === 0) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No hay solicitudes de restablecimiento pendientes.
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
          <tr>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Identificación</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Fecha Solicitud</th>
            <th style={{ padding: '1rem', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 'bold' }}>{request.documentId}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tipo: {request.documentType}</div>
              </td>
              <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {new Date(request.createdAt).toLocaleString()}
              </td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button 
                    onClick={() => handleApprove(request.id)}
                    className="btn-primary" 
                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}
                  >
                    <Check size={16} /> Aprobar y Restablecer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
