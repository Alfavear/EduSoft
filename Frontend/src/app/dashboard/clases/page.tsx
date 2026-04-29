import { getTeacherAssignments } from "./actions";
import { TeacherClassList } from "./TeacherClassList";

export default async function ClasesPage() {
  const assignments = await getTeacherAssignments();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Mis Clases Asignadas</h1>
        <p style={{ color: 'var(--text-muted)' }}>Selecciona una materia para ingresar calificaciones</p>
      </div>

      <TeacherClassList assignments={assignments} />
    </div>
  );
}
