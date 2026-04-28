"use client";

import { useState } from "react";
import { createAssignment } from "./actions";
import { Link as LinkIcon, Plus, Save } from "lucide-react";

export function AssignmentForm({ data }: { data: any }) {
  const { teachers, courses, subjects } = data;
  const [formData, setFormData] = useState({ teacherId: "", courseId: "", subjectId: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teacherId || !formData.courseId || !formData.subjectId) return;
    
    setError("");
    setSuccess("");
    setIsLoading(true);

    const res = await createAssignment(formData);
    if (res.success) {
      setSuccess("Asignación vinculada exitosamente.");
      setFormData({ teacherId: "", courseId: "", subjectId: "" });
    } else {
      setError(res.error || "Ocurrió un error.");
    }
    setIsLoading(false);
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <LinkIcon color="var(--color-primary)" />
        Nueva Asignación
      </h2>

      {error && <div style={{ color: 'var(--color-danger)', backgroundColor: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'var(--color-success)', backgroundColor: 'rgba(16,185,129,0.1)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Seleccionar Docente</label>
          <select 
            value={formData.teacherId} 
            onChange={e => setFormData({...formData, teacherId: e.target.value})}
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', backgroundColor: 'white' }}
            required
          >
            <option value="">Docente...</option>
            {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Seleccionar Curso/Salón</label>
          <select 
            value={formData.courseId} 
            onChange={e => setFormData({...formData, courseId: e.target.value})}
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', backgroundColor: 'white' }}
            required
          >
            <option value="">Curso...</option>
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Seleccionar Materia</label>
          <select 
            value={formData.subjectId} 
            onChange={e => setFormData({...formData, subjectId: e.target.value})}
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', backgroundColor: 'white' }}
            required
          >
            <option value="">Materia...</option>
            {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
          <Plus size={20} />
          {isLoading ? "Asignando..." : "Vincular Docente"}
        </button>
      </form>
    </div>
  );
}
