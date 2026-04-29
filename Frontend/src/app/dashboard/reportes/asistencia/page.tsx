import { getAttendanceWarningReport } from "../actions";
import { AlertCircle, UserX } from "lucide-react";

export default async function AttendanceReportPage() {
  const report = await getAttendanceWarningReport();

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <UserX size={32} color="var(--color-danger)" />
          Alerta de Inasistencia
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Estudiantes con más del 15% de inasistencia acumulada. ¡Requiere intervención!</p>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#fff5f5', borderBottom: '2px solid #fee2e2' }}>
            <tr>
              <th style={{ padding: '1.25rem', textAlign: 'left' }}>Estudiante</th>
              <th style={{ padding: '1.25rem', textAlign: 'left' }}>Curso</th>
              <th style={{ padding: '1.25rem', textAlign: 'center' }}>Días Ausente</th>
              <th style={{ padding: '1.25rem', textAlign: 'center' }}>% Inasistencia</th>
              <th style={{ padding: '1.25rem', textAlign: 'center' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {report.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1.25rem', fontWeight: '600' }}>{s.name}</td>
                <td style={{ padding: '1.25rem', color: 'var(--text-muted)' }}>{s.course}</td>
                <td style={{ padding: '1.25rem', textAlign: 'center', fontWeight: 'bold' }}>{s.absenceCount}</td>
                <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <div style={{ width: '100px', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(s.absenceRate, 100)}%`, height: '100%', backgroundColor: s.absenceRate > 30 ? 'var(--color-danger)' : 'var(--color-warning)' }}></div>
                    </div>
                    <span style={{ fontWeight: 'bold', minWidth: '40px' }}>{s.absenceRate.toFixed(1)}%</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '2rem', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    backgroundColor: s.absenceRate > 30 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: s.absenceRate > 30 ? 'var(--color-danger)' : 'var(--color-warning)'
                  }}>
                    {s.absenceRate > 30 ? 'CRÍTICO' : 'ALERTA'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {report.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            No hay estudiantes con alertas de inasistencia en este momento.
          </div>
        )}
      </div>
    </div>
  );
}
