import { getStudentsForObserver } from "./observadorActions";
import Link from "next/link";
import { User, ClipboardList, AlertCircle, FileText } from "lucide-react";

export default async function ObservadorPage() {
  const students = await getStudentsForObserver();

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ClipboardList size={32} />
          Observador del Estudiante
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          Gestión de seguimiento conductual y expedientes estudiantiles.
        </p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {students.map((student) => (
          <div key={student.id} className="card-premium" style={{ 
            padding: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {student.isConditional && (
              <div style={{ 
                position: 'absolute', 
                top: '0', 
                right: '0', 
                backgroundColor: '#ef4444', 
                color: 'white', 
                padding: '0.25rem 1rem', 
                fontSize: '0.75rem', 
                fontWeight: 'bold',
                borderBottomLeftRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <AlertCircle size={14} />
                Matrícula Condicional
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--color-bg-alt)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--color-primary)'
              }}>
                <User size={24} />
              </div>
              <div>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {student.firstName} {student.lastName}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Grado: {student.course.name}
                </p>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem', 
              fontSize: '0.85rem',
              backgroundColor: 'var(--color-bg-alt)',
              padding: '0.75rem',
              borderRadius: '0.5rem'
            }}>
              <div>
                <span style={{ display: 'block', color: 'var(--color-text-muted)' }}>Observaciones</span>
                <strong>{(student as any)._count.observations}</strong>
              </div>
              <div>
                <span style={{ display: 'block', color: 'var(--color-text-muted)' }}>Reuniones</span>
                <strong>{(student as any)._count.parentMeetings}</strong>
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
              <Link 
                href={`/dashboard/observador/${student.id}`} 
                className="btn-primary" 
                style={{ flex: 1, textAlign: 'center', fontSize: '0.9rem', padding: '0.6rem' }}
              >
                Ver Historial
              </Link>
              <Link 
                href={`/dashboard/observador/${student.id}/report`} 
                className="btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem' }}
                title="Generar Expediente"
              >
                <FileText size={20} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {students.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          backgroundColor: 'var(--color-bg-alt)', 
          borderRadius: '1rem',
          border: '2px dashed var(--color-border)'
        }}>
          <AlertCircle size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
          <h3>No se encontraron estudiantes</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>No hay estudiantes registrados en el sistema.</p>
        </div>
      )}
    </div>
  );
}
