import { getTeacherAssignments } from "./actions";
import Link from "next/link";
import { BookOpen, Users, ChevronRight, School } from "lucide-react";

export default async function ClasesPage() {
  const assignments = await getTeacherAssignments();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Mis Clases Asignadas</h1>
        <p style={{ color: 'var(--text-muted)' }}>Selecciona una materia para ingresar calificaciones</p>
      </div>

      <div className="grid-cards">
        {assignments.map((as) => (
          <Link key={as.id} href={`/dashboard/clases/${as.id}`} className="card course-card" style={{ transition: 'transform 0.2s' }}>
            <div className="course-card-banner" style={{ backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <BookOpen size={48} color="white" opacity={0.3} />
            </div>
            <div className="course-card-content">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{as.subject.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                <School size={16} />
                {as.course.name}
              </div>
            </div>
            <div className="course-card-actions" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <Users size={16} /> Ver Alumnos
              </div>
              <ChevronRight size={20} color="var(--border-light)" />
            </div>
          </Link>
        ))}

        {assignments.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', backgroundColor: 'var(--bg-app)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius)' }}>
             <p style={{ color: 'var(--text-muted)' }}>No tienes materias asignadas todavía. Contacta al administrador.</p>
          </div>
        )}
      </div>
    </div>
  );
}
