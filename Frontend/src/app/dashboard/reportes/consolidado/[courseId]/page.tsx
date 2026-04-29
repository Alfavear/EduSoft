import { getConsolidatedCourseReport } from "../../actions";
import { FileText } from "lucide-react";
import PrintButton from "@/app/components/PrintButton";

export default async function ConsolidatedReportPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const report = await getConsolidatedCourseReport(courseId);

  return (
    <div className="container" style={{ maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={28} color="var(--color-primary)" />
            Planilla Consolidada: {report.courseName}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Resumen de todas las materias y promedios finales del curso.</p>
        </div>
        <PrintButton label="Imprimir Sábana" />
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

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .btn-primary, .app-sidebar, .app-topbar { display: none !important; }
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
