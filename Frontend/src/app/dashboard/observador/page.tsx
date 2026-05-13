import { getStudentsForObserver, getObserverConfig, getCourses } from "./observadorActions";
import { ClipboardList } from "lucide-react";
import { ObserverList } from "./ObserverList";

export default async function ObservadorPage() {
  const students = await getStudentsForObserver();
  const config = await getObserverConfig();
  const courses = await getCourses();

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.025em' }}>
            <ClipboardList size={36} />
            Observador del Estudiante
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            Seguimiento integral, compromisos y expedientes disciplinarios.
          </p>
        </div>
      </header>

      <ObserverList 
        initialStudents={students} 
        courses={courses} 
        threshold={config?.conditionalThreshold || 3} 
      />
    </div>
  );
}
