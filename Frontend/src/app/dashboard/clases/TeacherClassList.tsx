"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Users, ChevronRight, School, Search } from "lucide-react";

export function TeacherClassList({ assignments }: { assignments: any[] }) {
  const [filter, setFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  const courses = Array.from(new Set(assignments.map(a => a.course.name))).sort();

  const filtered = assignments.filter(as => {
    const matchesSearch = as.subject.name.toLowerCase().includes(filter.toLowerCase());
    const matchesCourse = courseFilter === "" || as.course.name === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar por materia..." 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
        </div>
        
        <select 
          value={courseFilter} 
          onChange={e => setCourseFilter(e.target.value)}
          className="input-field"
          style={{ width: '200px' }}
        >
          <option value="">Todos los Cursos</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid-cards">
        {filtered.map((as) => (
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

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', backgroundColor: 'var(--bg-app)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius)' }}>
             <p style={{ color: 'var(--text-muted)' }}>No se encontraron materias con los filtros aplicados.</p>
          </div>
        )}
      </div>
    </>
  );
}
