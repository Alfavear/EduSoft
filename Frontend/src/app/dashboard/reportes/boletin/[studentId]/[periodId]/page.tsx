import { getStudentReport } from "../../../../usuarios/actions";
import { getSchoolInfo } from "../../../../configuracion/schoolActions";
import { PrintButton } from "../../../PrintButton";

export default async function BoletinPage({ params }: { params: Promise<{ studentId: string, periodId: string }> }) {
  const { studentId, periodId } = await params;

  const data = await getStudentReport(studentId);
  const school = await getSchoolInfo();

  if (!data) return <div style={{ padding: '2rem' }}>No se encontró la información del estudiante.</div>;

  const { student, assignments, periods } = data;
  const currentPeriod = periods.find(p => p.id === periodId);

  if (!currentPeriod) return <div style={{ padding: '2rem' }}>Periodo no válido.</div>;

  return (
    <div className="report-container" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="no-print" style={{ 
        maxWidth: '210mm', 
        margin: '0 auto', 
        padding: '2rem 0',
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
         <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Vista Previa de Boletín</h1>
         <PrintButton label="Imprimir Boletín" />
      </div>

      <div className="printable-report" style={{ 
        backgroundColor: 'white', 
        padding: '2.5rem', 
        minHeight: '297mm', 
        width: '210mm', 
        margin: '0 auto', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        color: '#111827',
        fontFamily: "'Inter', sans-serif"
      }}>
        {/* Header con Identidad Institucional */}
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2.5px solid #1f2937', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
           {school.logo ? (
             <img src={school.logo} alt="Logo" style={{ width: '90px', height: '90px', objectFit: 'contain', marginRight: '2rem' }} />
           ) : (
             <div style={{ width: '90px', height: '90px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>LOGO</span>
             </div>
           )}
           <div style={{ flex: 1, textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#111827', letterSpacing: '0.05em' }}>{school.name}</h1>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', color: '#374151' }}>
                <strong>NIT:</strong> {school.nit || "N/A"} | <strong>REGISTRO DANE:</strong> {school.dane || "N/A"}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#374151' }}>{school.address || ""} | Tel: {school.phone || "N/A"}</p>
              <div style={{ 
                marginTop: '1.25rem', 
                backgroundColor: '#1f2937', 
                color: 'white', 
                padding: '0.5rem',
                fontWeight: '700',
                fontSize: '1rem',
                letterSpacing: '0.1em'
              }}>
                INFORME PERIÓDICO DE VALORACIÓN ACADÉMICA - {currentPeriod.name.toUpperCase()}
              </div>
           </div>
        </div>

        {/* Información del Estudiante */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '2rem', 
          marginBottom: '2.5rem', 
          padding: '1.25rem',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '4px'
        }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem' }}><strong style={{ color: '#4b5563' }}>ESTUDIANTE:</strong> <span style={{ fontWeight: '700', fontSize: '1rem' }}>{student.lastName} {student.firstName}</span></p>
              <p style={{ fontSize: '0.875rem' }}><strong style={{ color: '#4b5563' }}>IDENTIFICACIÓN:</strong> {student.documentId || "N/A"}</p>
              <p style={{ fontSize: '0.875rem' }}><strong style={{ color: '#4b5563' }}>CURSO:</strong> {student.course.name}</p>
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'right' }}>
              <p style={{ fontSize: '0.875rem' }}><strong style={{ color: '#4b5563' }}>FECHA DE EMISIÓN:</strong> {new Date().toLocaleDateString()}</p>
              <p style={{ fontSize: '0.875rem' }}><strong style={{ color: '#4b5563' }}>AÑO LECTIVO:</strong> 2026</p>
              <p style={{ fontSize: '0.875rem' }}><strong style={{ color: '#4b5563' }}>JORNADA:</strong> Mañana</p>
           </div>
        </div>

        {/* Tabla de Calificaciones */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2.5rem', border: '1px solid #1f2937' }}>
           <thead>
              <tr style={{ backgroundColor: '#1f2937', color: 'white' }}>
                 <th style={{ padding: '0.875rem', border: '1px solid #1f2937', textAlign: 'left', fontSize: '0.875rem' }}>ÁREAS / ASIGNATURAS</th>
                 <th style={{ padding: '0.875rem', border: '1px solid #1f2937', textAlign: 'center', width: '80px', fontSize: '0.875rem' }}>FALTAS</th>
                 <th style={{ padding: '0.875rem', border: '1px solid #1f2937', textAlign: 'center', width: '80px', fontSize: '0.875rem' }}>NOTA</th>
                 <th style={{ padding: '0.875rem', border: '1px solid #1f2937', textAlign: 'center', width: '140px', fontSize: '0.875rem' }}>DESEMPEÑO</th>
              </tr>
           </thead>
           <tbody>
              {assignments.map((as: any) => {
                 const grade = as.grades.find((g: any) => g.periodId === currentPeriod.id);
                 const val = grade ? Number(grade.value) : 0;
                 
                 return (
                    <tr key={as.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                       <td style={{ padding: '0.875rem', border: '1px solid #d1d5db', fontWeight: '600', fontSize: '0.9rem' }}>
                         {as.subject.name.toUpperCase()}
                       </td>
                       <td style={{ padding: '0.875rem', border: '1px solid #d1d5db', textAlign: 'center', fontSize: '0.875rem' }}>
                         0
                       </td>
                       <td style={{ padding: '0.875rem', border: '1px solid #d1d5db', textAlign: 'center', fontWeight: '800', fontSize: '1rem' }}>
                          {grade ? grade.value : "-"}
                       </td>
                       <td style={{ padding: '0.875rem', border: '1px solid #d1d5db', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700' }}>
                          {grade ? (val >= 4.6 ? "SUPERIOR" : val >= 4.0 ? "ALTO" : val >= 3.0 ? "BÁSICO" : "BAJO") : "-"}
                       </td>
                    </tr>
                 );
              })}
           </tbody>
        </table>

        {/* Sección de Observaciones */}
        <div style={{ marginBottom: '4rem' }}>
           <h3 style={{ fontSize: '0.875rem', fontWeight: '800', marginBottom: '0.75rem', color: '#374151', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem' }}>
             OBSERVACIONES Y RECOMENDACIONES DEL DOCENTE
           </h3>
           <div style={{ 
             minHeight: '100px', 
             border: '1px solid #e5e7eb', 
             padding: '1rem', 
             fontSize: '0.875rem', 
             color: '#4b5563',
             lineHeight: '1.6',
             backgroundColor: '#fff'
           }}>
             {(student as any).observations || "No se registran observaciones adicionales para este periodo académico."}
           </div>
        </div>

        {/* Firmas */}
        <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', padding: '0 2rem' }}>
           <div style={{ textAlign: 'center', borderTop: '1.5px solid #1f2937', paddingTop: '0.75rem' }}>
              <p style={{ fontWeight: '800', fontSize: '0.9rem' }}>{school.rectorName || "RECTOR(A) GENERAL"}</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Rectoría y Representación Legal</p>
           </div>
           <div style={{ textAlign: 'center', borderTop: '1.5px solid #1f2937', paddingTop: '0.75rem' }}>
              <p style={{ fontWeight: '800', fontSize: '0.9rem' }}>SECRETARÍA ACADÉMICA</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Certificación y Registro de Control</p>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        
        @media print {
          @page { size: portrait; margin: 0; }
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          .report-container { background: white !important; padding: 0 !important; }
          .printable-report { 
            border: none !important; 
            box-shadow: none !important; 
            padding: 2cm !important; 
            width: 100% !important; 
            min-height: 100vh !important;
            margin: 0 !important;
          }
          .app-sidebar, .app-topbar { display: none !important; }
          .app-main { padding: 0 !important; margin: 0 !important; }
        }
      `}} />
    </div>
  );
}
