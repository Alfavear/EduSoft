import { getAssignmentDetails } from "../../../clases/actions";
import { getSchoolInfo } from "../../../configuracion/schoolActions";
import { PrintButton } from "../../PrintButton";

export default async function PlanillaPage({ params }: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = await params;
  const assignment = await getAssignmentDetails(assignmentId);
  const school = await getSchoolInfo();

  if (!assignment) return <div style={{ padding: '2rem' }}>Asignación no encontrada.</div>;

  const students = assignment.course.students;

  return (
    <div className="report-container">
      <div className="no-print" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
         <PrintButton label="Imprimir Planilla" />
      </div>

      <div className="printable-report" style={{ backgroundColor: 'white', padding: '3rem', minHeight: '297mm', width: '210mm', margin: '0 auto', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
           {school.logo && (
             <img src={school.logo} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', marginRight: '2rem' }} />
           )}
           <div style={{ flex: 1, textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{school.name}</h1>
              <p style={{ fontSize: '1.125rem', marginTop: '0.5rem', fontWeight: '600' }}>PLANILLA DE CONTROL DE NOTAS</p>
              <p style={{ fontSize: '1rem' }}>{assignment.subject.name} - {assignment.course.name}</p>
           </div>
        </div>

        <div style={{ marginBottom: '2rem', fontSize: '0.875rem' }}>
           <p><strong>DOCENTE:</strong> {assignment.teacher.firstName} {assignment.teacher.lastName}</p>
           <p><strong>FECHA GENERACIÓN:</strong> {new Date().toLocaleDateString()}</p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
           <thead>
              <tr style={{ backgroundColor: '#f3f4f6', border: '1px solid #333' }}>
                 <th style={{ padding: '0.5rem', border: '1px solid #333', textAlign: 'left', width: '40px' }}>#</th>
                 <th style={{ padding: '0.5rem', border: '1px solid #333', textAlign: 'left' }}>ESTUDIANTE</th>
                 <th style={{ padding: '0.5rem', border: '1px solid #333', textAlign: 'center', width: '80px' }}>NOTA</th>
                 <th style={{ padding: '0.5rem', border: '1px solid #333', textAlign: 'center', width: '200px' }}>OBSERVACIONES</th>
              </tr>
           </thead>
           <tbody>
              {students.map((student: any, index: number) => (
                 <tr key={student.id}>
                    <td style={{ padding: '0.5rem', border: '1px solid #333', textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #333' }}>{student.firstName} {student.lastName}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #333' }}></td>
                    <td style={{ padding: '0.5rem', border: '1px solid #333' }}></td>
                 </tr>
              ))}
           </tbody>
        </table>

        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
           <div style={{ width: '300px', textAlign: 'center', borderTop: '1px solid #333', paddingTop: '0.5rem' }}>
              <p style={{ fontWeight: 'bold' }}>{assignment.teacher.firstName} {assignment.teacher.lastName}</p>
              <p style={{ fontSize: '0.75rem' }}>Firma del Docente</p>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          .printable-report { border: none !important; box-shadow: none !important; padding: 0 !important; width: 100% !important; }
          .app-sidebar, .app-topbar { display: none !important; }
        }
      `}} />
    </div>
  );
}
