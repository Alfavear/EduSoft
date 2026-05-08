import { getStudentObserverData, getCurrentTeacher } from "../observadorActions";
import { notFound, redirect } from "next/navigation";
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

export default async function StudentObserverPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const student = await getStudentObserverData(studentId);
  const teacher = await getCurrentTeacher();

  if (!student) notFound();
  if (!teacher) redirect("/login");

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Link href="/dashboard/observador" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        color: 'var(--color-text-muted)',
        textDecoration: 'none',
        marginBottom: '1.5rem',
        fontSize: '0.9rem'
      }}>
        <ChevronLeft size={16} />
        Volver al listado
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--color-bg-alt)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--color-primary)',
            border: '3px solid var(--color-border)'
          }}>
            <User size={40} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
              {student.firstName} {student.lastName}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
              Grado: {(student as any).course?.name || 'N/A'} | Expediente: {student.id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        {student.isConditional && (
          <div style={{ 
            backgroundColor: '#fef2f2', 
            color: '#991b1b', 
            padding: '0.75rem 1.25rem', 
            borderRadius: '0.75rem', 
            border: '1px solid #fecaca',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 'bold'
          }}>
            <ShieldAlert size={24} />
            <div>
              <div style={{ fontSize: '0.9rem' }}>Estado: MATRÍCULA CONDICIONAL</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 'normal' }}>Requiere seguimiento prioritario</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Timeline of Observations */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={24} />
                Historial de Observaciones
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(student as any).observations.map((obs: any) => (
                <div key={obs.id} className="card-premium" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold',
                        backgroundColor: (obs as any).severity === 'GRAVE' ? '#fee2e2' : (obs as any).severity === 'MODERADA' ? '#fef3c7' : '#ecfdf5',
                        color: (obs as any).severity === 'GRAVE' ? '#991b1b' : (obs as any).severity === 'MODERADA' ? '#92400e' : '#065f46'
                      }}>
                        {(obs as any).severity}
                      </span>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        {(obs as any).type}
                      </span>
                    </div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      {new Date((obs as any).date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>{(obs as any).description}</p>
                  
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                    Registrado por: <strong>Prof. {obs.teacher.firstName} {obs.teacher.lastName}</strong>
                  </div>

                  {/* Follow ups */}
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MessageSquare size={16} />
                      Seguimientos ({obs.followUps.length})
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                      {obs.followUps.map((fu: any) => (
                        <div key={fu.id} style={{ 
                          backgroundColor: 'var(--color-bg-alt)', 
                          padding: '0.75rem', 
                          borderRadius: '0.5rem',
                          fontSize: '0.85rem',
                          borderLeft: '3px solid var(--color-primary)'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                            {new Date(fu.date).toLocaleDateString()}
                          </div>
                          <div>{fu.description}</div>
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
                  padding: '3rem', 
                  backgroundColor: 'var(--color-bg-alt)', 
                  borderRadius: '1rem',
                  color: 'var(--color-text-muted)'
                }}>
                  <Clock size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p>No hay observaciones registradas para este estudiante.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Actions */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card-premium" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={20} />
              Acciones Rápidas
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <ObservationForm studentId={student.id} teacherId={teacher.id} />
              <MeetingForm studentId={student.id} teacherId={teacher.id} />
            </div>
          </div>

          <div className="card-premium" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} />
              Reuniones Programadas
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(student as any).parentMeetings.map((meeting: any) => (
                <div key={meeting.id} style={{ fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong>{new Date(meeting.date).toLocaleDateString()}</strong>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '0.1rem 0.5rem', 
                      borderRadius: '1rem',
                      backgroundColor: (meeting as any).status === 'COMPLETED' ? '#ecfdf5' : (meeting as any).status === 'CANCELLED' ? '#fee2e2' : '#eff6ff',
                      color: (meeting as any).status === 'COMPLETED' ? '#065f46' : (meeting as any).status === 'CANCELLED' ? '#991b1b' : '#1e40af'
                    }}>
                      {(meeting as any).status}
                    </span>
                  </div>
                  {meeting.notes && <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{meeting.notes}</p>}
                </div>
              ))}

              {(student as any).parentMeetings.length === 0 && (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', margin: 0 }}>
                  No hay reuniones programadas.
                </p>
              )}
            </div>
          </div>

          <Link 
            href={`/dashboard/observador/${student.id}/report`} 
            className="btn-secondary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem',
              padding: '1rem',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            <FileText size={20} />
            Generar Expediente PDF
          </Link>
        </aside>
      </div>
    </div>
  );
}
