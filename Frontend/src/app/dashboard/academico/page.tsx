import { getAcademicData } from "./actions";
import { AcademicTabs } from "./AcademicTabs";

export default async function AcademicoPage() {
  const initialData = await getAcademicData();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Catálogo Académico</h1>
        <p style={{ color: 'var(--text-muted)' }}>Configura los salones, materias y esquemas de calificación dinámica</p>
      </div>

      <AcademicTabs initialData={initialData} />
    </div>
  );
}
