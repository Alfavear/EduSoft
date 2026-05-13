import { getStudentObserverData, getCurrentTeacher } from "../observadorActions";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  User, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  MessageSquare, 
  PlusCircle,
  ChevronLeft,
  ShieldAlert,
  FileText
} from "lucide-react";
import Link from "next/link";
import { ObservationForm } from "./ObservationForm";
import { FollowUpForm } from "./FollowUpForm";
import { MeetingForm } from "./MeetingForm";
import { ConditionalToggle } from "./ConditionalToggle";
import { DocumentRepository } from "../../matriculas/DocumentRepository";

export default async function StudentObserverPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const student = await getStudentObserverData(studentId);
  const teacher = await getCurrentTeacher();
  const session = await getServerSession(authOptions);

  if (!student) notFound();
  if (!teacher && session?.user?.role !== "ADMIN") redirect("/login");

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <Link href="/dashboard/observador" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        color: 'var(--text-muted)',
        textDecoration: 'none',
        marginBottom: '1.5rem',
        fontSize: '0.9rem'
      }}>
        <ChevronLeft size={16} />
        Volver al listado del observador
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '20px', 
            backgroundColor: 'rgba(59, 130, 246, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--color-primary)',
            border: '2px solid rgba(59, 130, 246, 0.2)'
          }}>
            <User size={40} />
          </div>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0, letterSpacing: '-0.025em' }}>
              {student.firstName} {student.lastName}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Grado: {(student as any).course?.name || 'N/A'} | Documento: {student.documentId}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {student.isConditional && (
            <div style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: 'var(--color-danger)', 
              padding: '0.75rem 1.25rem', 
              borderRadius: '1rem', 
              border: '1px solid var(--color-danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontWeight: 'bold'
            }}>
              <ShieldAlert size={24} />
              <div>
                <div style={{ fontSize: '0.9rem' }}>MATRÍCULA CONDICIONAL</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 'normal' }}>Seguimiento Prioritario Activo</div>
              </div>
            </div>
          )}
          <Link 
            href={`/dashboard/observador/${student.id}/report`} 
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
          >
            <FileText size={20} />
            Expediente PDF
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Timeline of Observations */}
          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Clock size={24} color="var(--color-primary)" />
              Historial de Novedades y Observaciones
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(student as any).observations.map((obs: any) => (
                <div key={obs.id} className="card-premium" style={{ padding: '1.5rem', borderLeft: (obs as any).severity === 'GRAVE' ? '4px solid var(--color-danger)' : '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        padding: '0.3rem 0.8rem', 
                        borderRadius: '0.5rem', 
                        fontSize: '0.7rem', 
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        backgroundColor: (obs as any).severity === 'GRAVE' ? 'rgba(239, 68, 68, 0.1)' : (obs as any).severity === 'MODERADA' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: (obs as any).severity === 'GRAVE' ? 'var(--color-danger)' : (obs as any).severity === 'MODERADA' ? 'var(--color-warning)' : 'var(--color-success)'
                      }}>
                        {(obs as any).severity}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
                        {(obs as any).type}
                      </span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      {new Date((obs as any).date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  <p style={{ marginBottom: '1.5rem', lineHeight: '1.7', color: 'var(--text-main)', fontSize: '0.95rem' }}>{(obs as any).description}</p>
                  
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', backgroundColor: 'var(--bg-app)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', display: 'inline-block' }}>
                    Registrado por: <strong style={{ color: 'var(--text-main)' }}>Prof. {obs.teacher.firstName} {obs.teacher.lastName}</strong>
                  </div>

                  {/* Follow ups */}
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                      <MessageSquare size={16} />
                      SEGUIMIENTOS Y EVOLUCIÓN ({(obs as any).followUps?.length || 0})
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                      {(obs as any).followUps?.map((fu: any) => (
                        <div key={fu.id} style={{ 
                          backgroundColor: 'var(--bg-app)', 
                          padding: '0.75rem', 
                          borderRadius: '0.5rem',
                          fontSize: '0.85rem',
                          borderLeft: '3px solid var(--color-primary)'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '0.75rem' }}>
                            {new Date(fu.date).toLocaleDateString()}
                          </div>
                          <div style={{ color: 'var(--text-main)' }}>{fu.description}</div>
                        </div>
                      ))}
                    </div>

                    <FollowUpForm observationId={obs.id} />
                  </div>
                </div>
              ))}

              {(student as any).observations.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '4rem 2rem', 
                  backgroundColor: 'var(--bg-app)', 
                  borderRadius: '1rem',
                  color: 'var(--text-muted)',
                  border: '2px dashed var(--border-light)'
                }}>
                  <Clock size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                  <p>No se han registrado incidentes ni observaciones preventivas.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Actions */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card-premium" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <PlusCircle size={20} color="var(--color-primary)" />
              Gestión Disciplinaria
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {teacher ? (
                <>
                  <ObservationForm studentId={student.id} teacherId={teacher.id} />
                  <MeetingForm studentId={student.id} teacherId={teacher.id} />
                </>
              ) : (
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', border: '1px dashed var(--border-light)' }}>
                  Visualizando como Administrador. Sólo los docentes pueden registrar observaciones directas.
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <ConditionalToggle studentId={student.id} initialStatus={student.isConditional} />
              </div>
            </div>
          </div>

          <div className="card-premium" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <Users size={20} color="var(--color-primary)" />
              Citaciones y Comités
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(student as any).parentMeetings.map((meeting: any) => (
                <div key={meeting.id} style={{ fontSize: '0.85rem', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-app)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      {new Date(meeting.date).toLocaleDateString()}
                    </strong>
                    <span style={{ 
                      fontSize: '0.65rem', 
                      padding: '0.15rem 0.5rem', 
                      borderRadius: '0.4rem',
                      fontWeight: 'bold',
                      backgroundColor: (meeting as any).status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : (meeting as any).status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: (meeting as any).status === 'COMPLETED' ? 'var(--color-success)' : (meeting as any).status === 'CANCELLED' ? 'var(--color-danger)' : 'var(--color-primary)'
                    }}>
                      {(meeting as any).status}
                    </span>
                  </div>
                  {meeting.notes && <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8rem', fontStyle: 'italic' }}>"{meeting.notes}"</p>}
                </div>
              ))}

              {(student as any).parentMeetings.length === 0 && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: 0, fontSize: '0.85rem' }}>
                  Sin reuniones programadas.
                </p>
              )}
            </div>
          </div>

          <div className="card-premium" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <FileText size={20} color="var(--color-primary)" />
              Expediente Digital
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Soportes físicos, memorandos y compromisos firmados.
            </p>
            <DocumentRepository studentId={student.id} />
          </div>
        </aside>
      </div>
    </div>
  );
}
