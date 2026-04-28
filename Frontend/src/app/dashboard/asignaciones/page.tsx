import { getAssignmentData, deleteAssignment } from "./actions";
import { AssignmentForm } from "./AssignmentForm";
import { Link as LinkIcon, Trash2, User, BookOpen, School } from "lucide-react";

export default async function AsignacionesPage() {
  const data = await getAssignmentData();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Asignaciones Académicas</h1>
        <p style={{ color: 'var(--text-muted)' }}>Vincula docentes con materias y cursos específicos</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', alignItems: 'start' }}>
        <AssignmentForm data={data} />

        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LinkIcon color="var(--color-success)" />
            Cargas Académicas Activas
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {data.assignments.map((as: any) => (
              <div key={as.id} className="card" style={{ padding: '1.25rem', borderTop: '4px solid var(--color-success)', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-main)', fontWeight: 'bold' }}>
                  <User size={16} color="var(--color-primary)" />
                  {as.teacher.firstName} {as.teacher.lastName}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <BookOpen size={14} /> {as.subject.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <School size={14} /> {as.course.name}
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                  {/* Delete functionality can be added here */}
                  <Trash2 size={16} color="var(--color-danger)" style={{ cursor: 'pointer', opacity: 0.5 }} />
                </div>
              </div>
            ))}
            {data.assignments.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius)', border: '1px dashed var(--border-light)' }}>
                No hay asignaciones creadas todavía.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
