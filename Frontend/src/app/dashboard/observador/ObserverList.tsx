"use client";

import { useState } from "react";
import Link from "next/link";
import { User, ClipboardList, AlertCircle, FileText, Search, Filter, ShieldAlert } from "lucide-react";

export function ObserverList({ initialStudents, courses, threshold }: { initialStudents: any[], courses: any[], threshold: number }) {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  const filteredStudents = initialStudents.filter(s => {
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase());
    const matchesCourse = courseFilter === "" || s.courseId === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem', 
        backgroundColor: 'white', 
        padding: '1rem', 
        borderRadius: 'var(--radius)', 
        boxShadow: 'var(--shadow-sm)',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar estudiante..." 
            className="input-field" 
            style={{ paddingLeft: '2.5rem' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="input-field" 
          style={{ width: '200px' }}
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
        >
          <option value="">Todos los Cursos</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', borderLeft: '1px solid var(--border-light)', paddingLeft: '1rem' }}>
          <AlertCircle size={14} /> Umbral Condicional: <strong>{threshold} faltas</strong>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {filteredStudents.map((student) => {
          const graveCount = student.observations.filter((o: any) => o.severity === 'GRAVE').length;
          const isAtRisk = graveCount >= threshold;
          
          return (
            <div key={student.id} className="card-premium" style={{ 
              padding: '1.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.25rem',
              position: 'relative',
              overflow: 'hidden',
              border: (student.isConditional || isAtRisk) ? '1px solid var(--color-danger)' : '1px solid var(--border-light)',
              backgroundColor: student.isConditional ? 'rgba(239, 68, 68, 0.02)' : 'white'
            }}>
              {(student.isConditional || isAtRisk) && (
                <div style={{ 
                  position: 'absolute', 
                  top: '0', 
                  right: '0', 
                  backgroundColor: student.isConditional ? '#ef4444' : '#f59e0b', 
                  color: 'white', 
                  padding: '0.25rem 0.75rem', 
                  fontSize: '0.65rem', 
                  fontWeight: 'bold',
                  borderBottomLeftRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  textTransform: 'uppercase',
                  zIndex: 1
                }}>
                  <ShieldAlert size={12} />
                  {student.isConditional ? "Matrícula Condicional" : "Riesgo de Sanción"}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--color-primary)'
                }}>
                  <User size={24} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-main)' }}>
                    {student.lastName}, {student.firstName}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {student.course.name} • {student.documentId}
                  </p>
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{ backgroundColor: 'var(--bg-app)', padding: '0.5rem', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{student.observations.length}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', padding: '0.5rem', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-danger)', textTransform: 'uppercase' }}>Graves</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--color-danger)' }}>{graveCount}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', padding: '0.5rem', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-primary)', textTransform: 'uppercase' }}>Citas</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--color-primary)' }}>{student.parentMeetings.length}</div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                <Link 
                  href={`/dashboard/observador/${student.id}`} 
                  className="btn-primary" 
                  style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem', padding: '0.5rem' }}
                >
                  Abrir Observador
                </Link>
                <Link 
                  href={`/dashboard/observador/${student.id}/report`} 
                  className="btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', width: '40px' }}
                  title="Descargar Carpeta Digital"
                >
                  <FileText size={18} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p>No se encontraron estudiantes para los criterios seleccionados.</p>
        </div>
      )}
    </div>
  );
}
