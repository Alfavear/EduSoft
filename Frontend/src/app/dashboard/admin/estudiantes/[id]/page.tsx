import { getStudentReport } from "../../actions";
import { Award, ChevronLeft, BookOpen, School } from "lucide-react";
import Link from "next/link";

export default async function StudentReportPage({ params }: { params: { id: string } }) {
  const data = await getStudentReport(params.id);

  if (!data) return <div style={{ padding: '2rem' }}>Estudiante no encontrado.</div>;

  const { student, assignments, periods } = data;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/usuarios" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> Volver a Usuarios
        </Link>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Reporte de Calificaciones</h1>
        <p style={{ color: 'var(--text-muted)' }}>Consulta el rendimiento académico del estudiante</p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius)' }}>
           <div style={{ backgroundColor: 'var(--color-purple)', color: 'white', padding: '1rem', borderRadius: '50%' }}>
              <Award size={32} />
           </div>
           <div>
              <h2 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{student.firstName} {student.lastName}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Curso: <strong>{student.course.name}</strong></p>
           </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-light)' }}>
                <th style={{ padding: '1rem' }}>Materia</th>
                {periods.map(p => (
                  <th key={p.id} style={{ padding: '1rem', textAlign: 'center' }}>
                    {p.name}
                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({p.weight}%)</div>
                  </th>
                ))}
                <th style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'rgba(59, 130, 246, 0.05)', color: 'var(--color-primary)' }}>Promedio Final</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((as: any) => {
                let finalAverage = 0;
                let hasGrades = false;

                return (
                  <tr key={as.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>{as.subject.name}</td>
                    {periods.map(p => {
                      const grade = as.grades.find((g: any) => g.periodId === p.id);
                      const val = grade ? Number(grade.value) : 0;
                      if (grade) {
                        hasGrades = true;
                        finalAverage += (val * (p.weight / 100));
                      }
                      return (
                        <td key={p.id} style={{ padding: '1rem', textAlign: 'center' }}>
                          {grade ? (
                            <span style={{ fontWeight: '500' }}>{grade.value}</span>
                          ) : (
                            <span style={{ color: 'var(--border-light)' }}>-</span>
                          )}
                        </td>
                      );
                    })}
                    <td style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'rgba(59, 130, 246, 0.05)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                      {hasGrades ? finalAverage.toFixed(1) : "-"}
                    </td>
                  </tr>
                );
              })}
              {assignments.length === 0 && (
                <tr>
                  <td colSpan={periods.length + 2} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    El curso del estudiante no tiene materias asignadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
