import { getAssignmentData, deleteAssignment } from "./actions";
import { AssignmentForm } from "./AssignmentForm";
import { AssignmentList } from "./AssignmentList";

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
        <AssignmentList assignments={data.assignments} />
      </div>
    </div>
  );
}
