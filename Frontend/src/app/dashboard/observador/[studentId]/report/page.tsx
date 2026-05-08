import { getStudentObserverData } from "../../observadorActions";
import { notFound } from "next/navigation";
import { 
  User, 
  Calendar, 
  Clock, 
  ShieldAlert,
  FileText,
  Printer,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import PrintButton from "./PrintButton";

export default async function StudentReportPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const studentData = await getStudentObserverData(studentId);
  const student = studentData as any;

  if (!student) notFound();

  const totalObservations = (student as any).observations.length;
  const totalMeetings = (student as any).parentMeetings.length;
  const totalAgreements = (student as any).observations.reduce((acc: number, obs: any) => acc + (obs.agreements?.length || 0), 0) + 
                          (student as any).parentMeetings.reduce((acc: number, mtg: any) => acc + (mtg.agreements?.length || 0), 0);

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Navigation and Print - Hidden on Print */}
      <div className="no-print" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <Link href={`/dashboard/observador/${student.id}`} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          color: 'var(--color-text-muted)',
          textDecoration: 'none'
        }}>
          <ChevronLeft size={16} />
          Volver al perfil
        </Link>
        <PrintButton />
      </div>

      {/* Report Header */}
      <div style={{ 
        border: '2px solid var(--color-border)', 
        padding: '2.5rem', 
        borderRadius: '1rem',
        backgroundColor: '#fff',
        color: '#000',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
            Expediente del Estudiante - Observador Escolar
          </h1>
          <div style={{ width: '100px', height: '3px', backgroundColor: 'var(--color-primary)', margin: '0 auto' }}></div>
        </div>

        {/* Student Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Información Personal</h3>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{student.firstName} {student.lastName}</div>
            <div style={{ color: '#444' }}>Grado: {(student as any).course?.name || 'N/A'}</div>
            <div style={{ color: '#444' }}>Documento: {student.documentId || 'N/A'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Resumen de Seguimiento</h3>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalObservations}</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>OBSERVACIONES</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalMeetings}</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>REUNIONES</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalAgreements}</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>COMPROMISOS</div>
              </div>
            </div>
          </div>
        </div>

        {student.isConditional && (
          <div style={{ 
            backgroundColor: '#fff1f2', 
            border: '2px solid #fda4af', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            color: '#9f1239'
          }}>
            <ShieldAlert size={32} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>ESTADO DE MATRÍCULA: CONDICIONAL</div>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Este estudiante se encuentra bajo seguimiento intensivo debido a reiteradas faltas disciplinarias o académicas.</p>
            </div>
          </div>
        )}

        {/* Main Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* History Section */}
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', borderBottom: '2px solid #eee', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              Historial de Observaciones y Seguimientos
            </h2>

            {(student as any).observations.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#666' }}>No se registran observaciones disciplinarias.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {student.observations.map((obs: any, idx: number) => (
                  <div key={obs.id} className="card-premium" style={{ padding: '1.5rem', breakInside: 'avoid' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>
                        #{totalObservations - idx} | {obs.type}
                        <span style={{ 
                          marginLeft: '1rem', 
                          fontSize: '0.75rem', 
                          padding: '0.1rem 0.5rem', 
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          backgroundColor: '#f9f9f9'
                        }}>
                          SEVERIDAD: {obs.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        {new Date(obs.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    
                    <div style={{ padding: '1rem', backgroundColor: '#fcfcfc', border: '1px solid #eee', borderRadius: '4px', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{obs.description}</div>
                      <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#888' }}>
                        Docente: Prof. {obs.teacher.firstName} {obs.teacher.lastName}
                      </div>
                    </div>

                    {/* Follow ups for this observation */}
                    {obs.followUps.length > 0 && (
                      <div style={{ marginLeft: '1.5rem', borderLeft: '2px solid #eee', paddingLeft: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555', marginBottom: '0.75rem' }}>Acciones de Seguimiento:</h4>
                        {obs.followUps.map((fu: any) => (
                          <div key={fu.id} style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                            <span style={{ fontWeight: 'bold' }}>{new Date(fu.date).toLocaleDateString()}:</span> {fu.description}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Agreements for this observation */}
                    {obs.agreements.length > 0 && (
                      <div style={{ marginLeft: '1.5rem', borderLeft: '2px solid #eee', paddingLeft: '1.5rem', marginTop: '1rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555', marginBottom: '0.75rem' }}>Compromisos Generados:</h4>
                        {obs.agreements.map((ag: any) => (
                          <div key={ag.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                            <div style={{ color: 'var(--color-primary)' }}>•</div>
                            <div>{ag.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Meetings Section */}
          <section style={{ breakBefore: 'page' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', borderBottom: '2px solid #eee', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              Actas de Reuniones con Acudientes
            </h2>

            {student.parentMeetings.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#666' }}>No se registran reuniones con acudientes.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {student.parentMeetings.map((meeting: any) => (
                  <div key={meeting.id} style={{ border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden', breakInside: 'avoid' }}>
                    <div style={{ backgroundColor: '#f9f9f9', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                      <span style={{ fontWeight: 'bold' }}>Reunión del {new Date(meeting.date).toLocaleDateString()}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: (meeting as any).status === 'COMPLETED' ? '#065f46' : '#666' }}>
                        ESTADO: {(meeting as any).status}
                      </span>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      {meeting.observation && (
                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.75rem' }}>
                          Referencia: Observación de tipo "{meeting.observation.type}" ({new Date(meeting.observation.date).toLocaleDateString()})
                        </div>
                      )}
                      <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                        <strong>Notas de la reunión:</strong><br />
                        {meeting.notes || 'Sin notas registradas.'}
                      </div>

                      {meeting.agreements.length > 0 && (
                        <div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555', marginBottom: '0.5rem' }}>Compromisos Establecidos:</h4>
                          {meeting.agreements.map((ag: any) => (
                            <div key={ag.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                              <div style={{ color: 'var(--color-primary)' }}>•</div>
                              <div>{ag.description}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Signatures */}
          <section style={{ marginTop: '5rem', breakInside: 'avoid' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem', fontSize: '0.85rem' }}>
                  Firma del Estudiante
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem', fontSize: '0.85rem' }}>
                  Firma del Acudiente
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem', fontSize: '0.85rem' }}>
                  Firma del Rector/Coordinador
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '4rem', fontSize: '0.7rem', color: '#999', textAlign: 'center' }}>
          Documento generado automáticamente por EduSoft - {new Date().toLocaleString()}<br />
          Este expediente es de carácter confidencial y uso exclusivo institucional.
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background-color: #fff !important; }
          .container { padding: 0 !important; max-width: 100% !important; margin: 0 !important; }
          div { box-shadow: none !important; border-radius: 0 !important; }
        }
      `}} />
    </div>
  );
}
