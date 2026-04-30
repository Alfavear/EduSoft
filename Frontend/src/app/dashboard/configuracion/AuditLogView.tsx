"use client";

import { useEffect, useState } from "react";
import { getAuditLogs } from "./schoolActions";
import { Clock, Search, User, Activity, Database } from "lucide-react";

export function AuditLogView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async (query?: string) => {
    setLoading(true);
    const data = await getAuditLogs(query);
    setLogs(data);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadLogs(search);
  };

  return (
    <div className="card" style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '10px' }}>
            <Activity size={20} color="var(--color-primary)" />
          </div>
          Registro de Operaciones (Logs)
        </h2>

        <form onSubmit={handleSearch} style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            className="input-field" 
            placeholder="Buscar por usuario o acción..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '3rem', width: '100%' }}
          />
        </form>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Fecha y Hora</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Usuario</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Operación</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Entidad</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando registros...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No se encontraron registros de operaciones.</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem', transition: 'background 0.2s ease' }} className="hover-row">
                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} color="var(--text-muted)" />
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                      <User size={14} />
                      {log.user.username}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '1rem', 
                      backgroundColor: log.action.includes('DELETE') ? 'rgba(239, 68, 68, 0.1)' : log.action.includes('CREATE') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: log.action.includes('DELETE') ? 'var(--color-danger)' : log.action.includes('CREATE') ? 'var(--color-success)' : 'var(--color-primary)',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                      <Database size={14} />
                      {log.entity}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8125rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.details || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .hover-row:hover {
          background-color: rgba(59, 130, 246, 0.02);
        }
      `}</style>
    </div>
  );
}
