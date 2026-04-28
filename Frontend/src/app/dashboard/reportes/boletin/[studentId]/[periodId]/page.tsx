import { getStudentReport } from "../../../../usuarios/actions";
import { getSchoolInfo } from "../../../../configuracion/schoolActions";
import { PrintButton } from "../../../PrintButton";

export default async function BoletinPage({ params }: { params: { studentId: string, periodId: string } }) {

  const data = await getStudentReport(params.studentId);
  const school = await getSchoolInfo();

  if (!data) return <div>No se encontró la información del estudiante.</div>;

  const { student, assignments, periods } = data;
  const currentPeriod = periods.find(p => p.id === params.periodId);

  if (!currentPeriod) return <div>Periodo no válido.</div>;

  return (
    <div className="report-container">
      {/* Print Button - Hidden on print */}
      <div className="no-print" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
         <PrintButton label="Imprimir Boletín" />
      </div>

      <div className="printable-report" style={{ backgroundColor: 'white', padding: '3rem', minHeight: '297mm', width: '210mm', margin: '0 auto', border: '1px solid #eee' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
           {school.logo && (
             <img src={school.logo} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', marginRight: '2rem' }} />
           )}
           <div style={{ flex: 1, textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{school.name}</h1>
              <p style={{ fontSize: '0.875rem' }}>NIT: {school.nit || "N/A"} | Tel: {school.phone || "N/A"}</p>
              <p style={{ fontSize: '0.875rem' }}>{school.address || ""}</p>
              <h2 style={{ fontSize: '1.125rem', marginTop: '1rem', fontWeight: '600', backgroundColor: '#f3f4f6', padding: '0.25rem' }}>BOLETÍN DE CALIFICACIONES - {currentPeriod.name}</h2>
           </div>
        </div>

        {/* Student Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', fontSize: '0.875rem' }}>
           <div>
              <p><strong>ESTUDIANTE:</strong> {student.firstName} {student.lastName}</p>
              <p><strong>CURSO:</strong> {student.course.name}</p>
           </div>
           <div style={{ textAlign: 'right' }}>
              <p><strong>FECHA:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>AÑO LECTIVO:</strong> 2026</p>
           </div>
        </div>

        {/* Grades Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3rem' }}>
           <thead>
              <tr style={{ backgroundColor: '#f3f4f6', border: '1px solid #333' }}>
                 <th style={{ padding: '0.75rem', border: '1px solid #333', textAlign: 'left' }}>ASIGNATURA</th>
                 <th style={{ padding: '0.75rem', border: '1px solid #333', textAlign: 'center', width: '100px' }}>NOTA</th>
                 <th style={{ padding: '0.75rem', border: '1px solid #333', textAlign: 'center', width: '150px' }}>VALORACIÓN</th>
              </tr>
           </thead>
           <tbody>
              {assignments.map((as: any) => {
                 const grade = as.grades.find((g: any) => g.periodId === currentPeriod.id);
                 const val = grade ? Number(grade.value) : 0;
                 
                 return (
                    <tr key={as.id}>
                       <td style={{ padding: '0.75rem', border: '1px solid #333', fontWeight: '500' }}>{as.subject.name}</td>
                       <td style={{ padding: '0.75rem', border: '1px solid #333', textAlign: 'center', fontWeight: 'bold' }}>
                          {grade ? grade.value : "-"}
                       </td>
                       <td style={{ padding: '0.75rem', border: '1px solid #333', textAlign: 'center', fontSize: '0.75rem' }}>
                          {grade ? (val >= 4.5 ? "EXCELENTE" : val >= 4.0 ? "SOBRESALIENTE" : val >= 3.0 ? "ACEPTABLE" : "INSUFICIENTE") : "-"}
                       </td>
                    </tr>
                 );
              })}
           </tbody>
        </table>

        {/* Footer / Signatures */}
        <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', paddingTop: '4rem' }}>
           <div style={{ textAlign: 'center', borderTop: '1px solid #333', paddingTop: '0.5rem' }}>
              <p style={{ fontWeight: 'bold' }}>{school.rectorName || "RECTOR(A)"}</p>
              <p style={{ fontSize: '0.75rem' }}>Rectoría</p>
           </div>
           <div style={{ textAlign: 'center', borderTop: '1px solid #333', paddingTop: '0.5rem' }}>
              <p style={{ fontWeight: 'bold' }}>SECRETARÍA ACADÉMICA</p>
              <p style={{ fontSize: '0.75rem' }}>Registro y Control</p>
           </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .printable-report { border: none !important; box-shadow: none !important; padding: 0 !important; width: 100% !important; }
          .app-sidebar, .app-topbar { display: none !important; }
          .app-main { padding: 0 !important; margin: 0 !important; }
        }
      `}} />
    </div>
  );
}
