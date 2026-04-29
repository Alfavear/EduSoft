"use client";

import { useState } from "react";
import { Link as LinkIcon, Trash2, User, BookOpen, School, Search, Filter } from "lucide-react";

export function AssignmentList({ assignments }: { assignments: any[] }) {
  const [filter, setFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  const courses = Array.from(new Set(assignments.map(a => a.course.name))).sort();

  const filtered = assignments.filter(as => {
    const searchStr = `${as.teacher.firstName} ${as.teacher.lastName} ${as.subject.name}`.toLowerCase();
    const matchesSearch = searchStr.includes(filter.toLowerCase());
    const matchesCourse = courseFilter === "" || as.course.name === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LinkIcon color="var(--color-success)" />
          Cargas Académicas ({filtered.length})
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar docente o materia..." 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.5rem', width: '250px' }}
            />
          </div>
          
          <select 
            value={courseFilter} 
            onChange={e => setCourseFilter(e.target.value)}
            className="input-field"
            style={{ width: '180px' }}
          >
            <option value="">Todos los Cursos</option>
            {courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map((as: any) => (
          <div key={as.id} className="card" style={{ padding: '1.25rem', borderTop: '4px solid var(--color-success)', position: 'relative', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-main)', fontWeight: 'bold' }}>
              <User size={16} color="var(--color-primary)" />
              {as.teacher.firstName} {as.teacher.lastName}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <BookOpen size={14} /> {as.subject.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <School size={14} /> {as.course.name}
              </div>
            </div>
            <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.3, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.3'}>
                <Trash2 size={16} color="var(--color-danger)" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius)', border: '1px dashed var(--border-light)' }}>
            No hay asignaciones que coincidan con los filtros.
          </div>
        )}
      </div>
    </div>
  );
}
