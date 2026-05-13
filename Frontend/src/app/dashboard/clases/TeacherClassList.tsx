"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Users, ChevronRight, School, Search, LayoutGrid } from "lucide-react";

export function TeacherClassList({ assignments }: { assignments: any[] }) {
  const [filter, setFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("Todos");

  const courses = ["Todos", ...Array.from(new Set(assignments.map(a => a.course.name))).sort()];

  const filtered = assignments.filter(as => {
    const matchesSearch = as.subject.name.toLowerCase().includes(filter.toLowerCase());
    const matchesCourse = courseFilter === "Todos" || as.course.name === courseFilter;
    return matchesSearch && matchesCourse;
  });

  // Colores para alternar en las tarjetas y darles variedad sin saturar
  const accents = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899"];

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar materia..." 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              style={{ 
                width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', 
                borderRadius: '2rem', border: '1px solid var(--border-light)', 
                backgroundColor: 'var(--bg-app)', fontSize: '0.95rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)', outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Filtros de Píldora (Pills) */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', WebkitOverflowScrolling: 'touch' }}>
          {courses.map(c => (
            <button
              key={c}
              onClick={() => setCourseFilter(c)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '2rem',
                fontSize: '0.875rem',
                fontWeight: courseFilter === c ? '600' : '500',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                backgroundColor: courseFilter === c ? 'var(--color-primary)' : 'var(--bg-app)',
                color: courseFilter === c ? 'white' : 'var(--text-main)',
                border: `1px solid ${courseFilter === c ? 'var(--color-primary)' : 'var(--border-light)'}`,
                cursor: 'pointer',
                boxShadow: courseFilter === c ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filtered.map((as, idx) => {
          const accentColor = accents[idx % accents.length];
          return (
            <Link 
              key={as.id} 
              href={`/dashboard/clases/${as.id}`} 
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderRadius: '1rem', 
                padding: '1.5rem',
                border: '1px solid var(--border-light)',
                borderTop: `4px solid ${accentColor}`,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.02)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.025)';
                e.currentTarget.style.borderColor = `${accentColor}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.02)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
            >
              {/* Fondo sutil degradado */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: `radial-gradient(circle at top right, ${accentColor}15, transparent 70%)`, pointerEvents: 'none' }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {as.subject.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <School size={14} color={accentColor} />
                    <span style={{ fontWeight: '500' }}>{as.course.name}</span>
                  </div>
                </div>
                <div style={{ backgroundColor: `${accentColor}15`, padding: '0.75rem', borderRadius: '0.75rem', color: accentColor }}>
                  <BookOpen size={24} strokeWidth={1.5} />
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px dashed var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  <Users size={16} /> Ver Alumnos
                </div>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor }}>
                  <ChevronRight size={16} strokeWidth={2.5} />
                </div>
              </div>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', backgroundColor: 'var(--bg-app)', border: '1px dashed var(--border-light)', borderRadius: '1rem' }}>
             <LayoutGrid size={48} color="var(--border-light)" style={{ margin: '0 auto 1rem auto' }} />
             <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No se encontraron materias con los filtros aplicados.</p>
          </div>
        )}
      </div>
    </>
  );
}
