import { getAcademicRiskReport } from "../../actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, User, BookOpen, AlertCircle, ArrowRight } from "lucide-react";
import PrintButton from "@/app/components/PrintButton";

export default async function AcademicRiskReportPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const report = await getAcademicRiskReport(studentId);

  if (!report) notFound();

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1rem', textDecoration: 'none' }}>
            <ChevronLeft size={16} /> Volver al Tablero
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={32} color="var(--color-danger)" />
            Informe de Riesgo Académico
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Análisis detallado del desempeño del estudiante para toma de decisiones.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <PrintButton label="Imprimir Informe" />
          <Link 
            href={`/dashboard/observador/${report.id}`} 
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
          >
            Ir al Observador <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Info Estudiante */}
        <div className="card-premium" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            <User size={32} />
          </div>
          <div>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.25rem' }}>{report.firstName} {report.lastName}</h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Documento: {report.documentId}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Curso: <strong>{report.course}</strong></div>
          </div>
        </div>

        {/* Resumen Indicadores */}
        <div className="card-premium" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ backgroundColor: parseFloat(report.average) < 3.0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '1rem', border: `1px solid ${parseFloat(report.average) < 3.0 ? 'var(--color-danger)' : 'var(--color-success)'}` }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Promedio General</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: parseFloat(report.average) < 3.0 ? 'var(--color-danger)' : 'var(--color-success)' }}>{report.average}</div>
          </div>
          
          <div style={{ backgroundColor: report.absenceRate > 15 ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-app)', padding: '1rem', borderRadius: '1rem', border: `1px solid ${report.absenceRate > 15 ? 'var(--color-warning)' : 'var(--border-light)'}` }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Ausentismo</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: report.absenceRate > 15 ? 'var(--color-warning)' : 'var(--text-main)' }}>{report.absenceRate.toFixed(1)}%</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({report.absenceCount} faltas)</div>
          </div>
        </div>
      </div>

      <div className="card-premium" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-app)' }}>
          <h3 style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle color="var(--color-danger)" size={20} />
            Materias Pérdidas o en Riesgo Crítico (&lt;3.0)
          </h3>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#fff5f5' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', borderBottom: '1px solid #fee2e2' }}>Materia</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', borderBottom: '1px solid #fee2e2' }}>Docente a Cargo</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'center', borderBottom: '1px solid #fee2e2' }}>Periodo</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'center', borderBottom: '1px solid #fee2e2' }}>Calificación</th>
            </tr>
          </thead>
          <tbody>
            {report.failingGrades.map((g: any, idx: number) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={16} color="var(--color-primary)" />
                    {g.subject}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{g.teacher}</td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                  <span style={{ backgroundColor: 'var(--bg-app)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem' }}>{g.period}</span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                  <span style={{ color: 'var(--color-danger)', fontWeight: 'bold', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem' }}>
                    {g.value.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {report.failingGrades.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No se registran materias reprobadas.
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .btn-primary, .app-sidebar, .app-topbar { display: none !important; }
          .app-main { padding: 0 !important; }
          .container { max-width: 100% !important; padding: 0 !important; }
          .card-premium { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
        }
      `}} />
    </div>
  );
}
