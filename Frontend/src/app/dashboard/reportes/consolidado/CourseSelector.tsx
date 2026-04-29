"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CourseSelector({ courses }: { courses: { id: string, name: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCourseId = searchParams.get("courseId") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = e.target.value;
    if (courseId) {
      router.push(`/dashboard/reportes/consolidado?courseId=${courseId}`);
    } else {
      router.push(`/dashboard/reportes/consolidado`);
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <label htmlFor="course-select" style={{ fontWeight: '600', color: 'var(--text-main)' }}>Seleccionar Curso:</label>
      <select 
        id="course-select"
        value={currentCourseId}
        onChange={handleChange}
        className="input-field"
        style={{ minWidth: '200px' }}
      >
        <option value="">-- Elija un curso --</option>
        {courses.map(course => (
          <option key={course.id} value={course.id}>{course.name}</option>
        ))}
      </select>
    </div>
  );
}
