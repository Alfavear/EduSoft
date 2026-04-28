import { getAssignmentDetails, getActivePeriods } from "../actions";
import { GradeTable } from "./GradeTable";
import Link from "next/link";
import { ChevronLeft, BookOpen, School } from "lucide-react";

export default async function DetalleClasePage({ params }: { params: { id: string } }) {
  const [assignment, periods] = await Promise.all([
    getAssignmentDetails(params.id),
    getActivePeriods()
  ]);

  if (!assignment) return <div>Asignación no encontrada.</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/clases" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> Volver a mis clases
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{assignment.subject.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              <School size={18} /> {assignment.course.name}
            </div>
          </div>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', fontSize: '0.875rem', fontWeight: 'bold' }}>
            {assignment.subject.gradingConfig.name}
          </div>
        </div>
      </div>

      {periods.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>No hay un Año Lectivo activo.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>El administrador debe activar un año lectivo en Configuración.</p>
        </div>
      ) : (
        <GradeTable assignment={assignment} periods={periods} />
      )}
    </div>
  );
}
