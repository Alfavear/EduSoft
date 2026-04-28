"use client";

import { useState } from "react";
import { createUser } from "./actions";
import { UserPlus, Save, User as UserIcon, Shield, GraduationCap, Briefcase } from "lucide-react";

export function UserForm({ courses }: { courses: any[] }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "STUDENT" as "ADMIN" | "TEACHER" | "STUDENT",
    firstName: "",
    lastName: "",
    courseId: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (formData.role === "STUDENT" && !formData.courseId) {
      setError("Los estudiantes deben estar asignados a un curso.");
      setIsLoading(false);
      return;
    }

    const res = await createUser(formData);
    
    if (res.success) {
      setSuccess("Usuario creado exitosamente.");
      setFormData({
        username: "",
        password: "",
        role: "STUDENT",
        firstName: "",
        lastName: "",
        courseId: ""
      });
    } else {
      setError(res.error || "Ocurrió un error.");
    }
    setIsLoading(false);
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <UserPlus color="var(--color-primary)" />
        Nuevo Usuario
      </h2>

      {error && <div style={{ color: 'var(--color-danger)', backgroundColor: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'var(--color-success)', backgroundColor: 'rgba(16,185,129,0.1)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Nombre</label>
            <input 
              type="text" 
              value={formData.firstName} 
              onChange={e => setFormData({...formData, firstName: e.target.value})} 
              style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Apellido</label>
            <input 
              type="text" 
              value={formData.lastName} 
              onChange={e => setFormData({...formData, lastName: e.target.value})} 
              style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
              required 
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Nombre de Usuario (nombre.apellido)</label>
          <input 
            type="text" 
            value={formData.username} 
            onChange={e => setFormData({...formData, username: e.target.value})} 
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
            placeholder="juan.perez"
            required 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Contraseña</label>
          <input 
            type="password" 
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})} 
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
            required 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Rol del Sistema</label>
          <select 
            value={formData.role} 
            onChange={e => setFormData({...formData, role: e.target.value as any})}
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', backgroundColor: 'white' }}
          >
            <option value="STUDENT">Estudiante</option>
            <option value="TEACHER">Docente</option>
            <option value="ADMIN">Administrativo</option>
          </select>
        </div>

        {formData.role === "STUDENT" && (
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Asignar a Curso</label>
            <select 
              value={formData.courseId} 
              onChange={e => setFormData({...formData, courseId: e.target.value})}
              style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', backgroundColor: 'white' }}
              required
            >
              <option value="">Seleccionar curso...</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {courses.length === 0 && <p style={{ fontSize: '0.75rem', color: 'var(--color-warning)', marginTop: '0.25rem' }}>* Debes crear cursos primero en el catálogo académico.</p>}
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
          <Save size={20} />
          {isLoading ? "Creando..." : "Crear Usuario"}
        </button>
      </form>
    </div>
  );
}
