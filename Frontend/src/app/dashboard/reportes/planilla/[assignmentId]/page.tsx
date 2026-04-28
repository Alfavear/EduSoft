import { getAssignmentDetails, getActivePeriods } from "../../../clases/actions";
import { getSchoolInfo } from "../../../configuracion/schoolActions";
import { PrintButton } from "../../PrintButton";

export default async function PlanillaPage({ params }: { params: { assignmentId: string } }) {

  const assignment = await getAssignmentDetails(params.assignmentId);
  const periods = await getActivePeriods();
  const school = await getSchoolInfo();

  if (!assignment) return <div>No se encontró la información de la asignatura.</div>;

  const students = assignment.course.students;

  return (
    <div className="report-container">
      <div className="no-print" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
         <PrintButton label="Imprimir Planilla" />
      </div>

      <div className="printable-report" style={{ backgroundColor: 'white', padding: '2rem', minHeight: '297mm', width: '210mm', margin: '0 auto', border: '1px solid #eee' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
           {school.logo && (
             <img src={school.logo} alt="Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', marginRight: '1.5rem' }} />
           )}
           <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{school.name}</h1>
              <p style={{ fontSize: '0.75rem' }}>INFORME CONSOLIDADO DE CALIFICACIONES</p>
           </div>
           <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
              <p><strong>ASIGNATURA:</strong> {assignment.subject.name}</p>
              <p><strong>CURSO:</strong> {assignment.course.name}</p>
           </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
           <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                 <th style={{ border: '1px solid #ddd', padding: '0.5rem', textAlign: 'left' }}>ESTUDIANTE</th>
                 {periods.map(p => (
                   <th key={p.id} style={{ border: '1px solid #ddd', padding: '0.5rem', textAlign: 'center' }}>
                     {p.name.substring(0, 3)}.
                     <div style={{ fontSize: '0.625rem' }}>({p.weight}%)</div>
                   </th>
                 ))}
                 <th style={{ border: '1px solid #ddd', padding: '0.5rem', textAlign: 'center', backgroundColor: '#f3f4f6' }}>DEF.</th>
              </tr>
           </thead>
           <tbody>
              {students.map((student: any) => {
                 let finalAvg = 0;
                 let hasNotes = false;
                 return (
                   <tr key={student.id}>
                      <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{student.firstName} {student.lastName}</td>
                      {periods.map(p => {
                        const grade = assignment.grades.find((g: any) => g.studentId === student.id && g.periodId === p.id);
                        if (grade) {
                          hasNotes = true;
                          finalAvg += (Number(grade.value) * (p.weight / 100));
                        }
                        return (
                          <td key={p.id} style={{ border: '1px solid #ddd', padding: '0.5rem', textAlign: 'center' }}>
                            {grade ? grade.value : "-"}
                          </td>
                        );
                      })}
                      <td style={{ border: '1px solid #ddd', padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#f3f4f6' }}>
                        {hasNotes ? finalAvg.toFixed(1) : "-"}
                      </td>
                   </tr>
                 );
              })}

           </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          .app-sidebar, .app-topbar { display: none !important; }
          .app-main { padding: 0 !important; margin: 0 !important; }
          .printable-report { border: none !important; width: 100% !important; padding: 0 !important; }
        }
      `}} />
    </div>
  );
}
