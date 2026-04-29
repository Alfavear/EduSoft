import { getConsolidatedCourseReport } from "../actions";
import { prisma } from "@/lib/prisma";
import { FileText, TrendingUp, AlertCircle, BarChart3 } from "lucide-react";
import PrintButton from "@/app/components/PrintButton";
import CourseSelector from "./CourseSelector";

export default async function DynamicConsolidatedPage({ searchParams }: { searchParams: Promise<{ courseId?: string }> }) {
  const { courseId } = await searchParams;
  const courses = await prisma.course.findMany({ orderBy: { name: 'asc' } });
  
  let report = null;
  if (courseId) {
    report = await getConsolidatedCourseReport(courseId);
  }

  return (
    <div className="container" style={{ maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BarChart3 size={28} color="var(--color-primary)" />
            Planillas Consolidadas Dinámicas
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Selecciona un curso para ver el rendimiento académico detallado.</p>
        </div>
        {report && <PrintButton label="Imprimir Sábana" />}
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <CourseSelector courses={courses} />
      </div>

      {!report && (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FileText size={48} opacity={0.2} style={{ margin: '0 auto 1rem' }} />
          <p>Por favor, selecciona un curso para generar el informe consolidado.</p>
        </div>
      )}

      {report && (
        <>
          {/* Dashboard de Rendimiento del Curso */}
          <div className="grid-stats" style={{ marginBottom: '2rem' }}>
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-primary)' }}>
              <span className="number">{report.data.length}</span>
              <span className="label">Estudiantes Evaluados</span>
            </div>
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-success)' }}>
              <span className="number">
                {(report.data.filter(s => parseFloat(s.average) >= 3.0).length / report.data.length * 100).toFixed(1)}%
              </span>
              <span className="label">Tasa de Aprobación</span>
            </div>
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-danger)' }}>
              <span className="number">
                {report.data.filter(s => parseFloat(s.average) < 3.0).length}
              </span>
              <span className="label">Estudiantes en Riesgo</span>
            </div>
          </div>

          <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-light)' }}>
                <tr>
                  <th style={{ padding: '0.75rem', textAlign: 'left', minWidth: '200px', borderRight: '1px solid var(--border-light)' }}>Estudiante</th>
                  {report.subjects.map(sub => (
                    <th key={sub.id} style={{ padding: '0.75rem', textAlign: 'center', writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: '120px' }}>
                      {sub.name}
                    </th>
                  ))}
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>PROMEDIO</th>
                </tr>
              </thead>
              <tbody>
                {report.data.map(student => (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '600', borderRight: '1px solid var(--border-light)' }}>{student.name}</td>
                    {report.subjects.map(sub => (
                      <td key={sub.id} style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <span style={{ 
                          color: student.grades[sub.id] !== "-" && parseFloat(student.grades[sub.id]) < 3.0 ? 'var(--color-danger)' : 'inherit',
                          fontWeight: student.grades[sub.id] !== "-" && parseFloat(student.grades[sub.id]) < 3.0 ? 'bold' : 'normal'
                        }}>
                          {student.grades[sub.id]}
                        </span>
                      </td>
                    ))}
                    <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
                      <span style={{ color: parseFloat(student.average) < 3.0 ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                        {student.average}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .btn-primary, .app-sidebar, .app-topbar, .card:has(select) { display: none !important; }
          .app-main { padding: 0 !important; }
          .container { max-width: 100% !important; padding: 0 !important; }
          .card { border: none !important; box-shadow: none !important; overflow: visible !important; }
          table { font-size: 0.7rem !important; }
          th { height: 100px !important; }
        }
      `}} />
    </div>
  );
}
