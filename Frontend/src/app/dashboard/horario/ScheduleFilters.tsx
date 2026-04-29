"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ScheduleFilters({ 
  courses, 
  teachers 
}: { 
  courses: { id: string, name: string }[],
  teachers: { id: string, firstName: string, lastName: string }[]
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCourseId = searchParams.get("courseId") || "";
  const currentTeacherId = searchParams.get("teacherId") || "";

  const handleCourseChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("teacherId"); // Clear other filter
    if (id) params.set("courseId", id);
    else params.delete("courseId");
    router.push(`/dashboard/horario?${params.toString()}`);
  };

  const handleTeacherChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("courseId"); // Clear other filter
    if (id) params.set("teacherId", id);
    else params.delete("teacherId");
    router.push(`/dashboard/horario?${params.toString()}`);
  };

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-end', backgroundColor: 'rgba(59, 130, 246, 0.02)' }}>
      <div style={{ flex: '1', minWidth: '250px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Consultar por Curso:</label>
        <select 
          value={currentCourseId}
          onChange={(e) => handleCourseChange(e.target.value)}
          className="input-field"
        >
          <option value="">-- Seleccionar Curso --</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div style={{ flex: '1', minWidth: '250px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Consultar por Docente:</label>
        <select 
          value={currentTeacherId}
          onChange={(e) => handleTeacherChange(e.target.value)}
          className="input-field"
        >
          <option value="">-- Seleccionar Docente --</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
        </select>
      </div>

      <button 
        onClick={() => router.push('/dashboard/horario')}
        className="btn-secondary" 
        style={{ height: '42px', padding: '0 1.5rem' }}
      >
        Limpiar Filtros
      </button>
    </div>
  );
}
