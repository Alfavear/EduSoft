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
    documentId: "",
    courseId: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    address: "",
    bloodType: "",
    birthDate: "",
    phone: "",
    specialization: ""
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
        documentId: "",
        courseId: "",
        guardianName: "",
        guardianPhone: "",
        guardianEmail: "",
        address: "",
        bloodType: "",
        birthDate: "",
        phone: "",
        specialization: ""
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '1rem' }}>Datos Básicos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
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

            {formData.role === "ADMIN" ? (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Usuario</label>
                  <input 
                    type="text" 
                    value={formData.username} 
                    onChange={e => setFormData({...formData, username: e.target.value})} 
                    style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
                    placeholder="admin.usuario"
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
              </>
            ) : (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Usuario Generado</label>
                  <input 
                    type="text" 
                    value={`${formData.firstName.trim().toLowerCase()}.${formData.lastName.trim().toLowerCase()}`.replace(/\s+/g, '')} 
                    readOnly
                    style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Contraseña Inicial</label>
                  <input 
                    type="text" 
                    value="Su documento de identidad" 
                    readOnly
                    style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)' }} 
                  />
                </div>
              </>
            )}

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

            {formData.role !== "ADMIN" && (
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Documento Identidad</label>
                <input 
                  type="text" 
                  value={formData.documentId} 
                  onChange={e => setFormData({...formData, documentId: e.target.value})} 
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
                />
              </div>
            )}
          </div>
        </div>

        {formData.role === "STUDENT" && (
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '1rem' }}>Datos de Matrícula y Acudiente</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Asignar a Curso *</label>
                <select 
                  value={formData.courseId} 
                  onChange={e => setFormData({...formData, courseId: e.target.value})}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', backgroundColor: 'white' }}
                  required
                >
                  <option value="">Seleccionar curso...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Fecha Nacimiento</label>
                <input 
                  type="date" 
                  value={formData.birthDate} 
                  onChange={e => setFormData({...formData, birthDate: e.target.value})} 
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Tipo Sangre/EPS</label>
                <input 
                  type="text" 
                  value={formData.bloodType} 
                  onChange={e => setFormData({...formData, bloodType: e.target.value})} 
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Nombre Acudiente *</label>
                <input 
                  type="text" 
                  value={formData.guardianName} 
                  onChange={e => setFormData({...formData, guardianName: e.target.value})} 
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Teléfono Acudiente *</label>
                <input 
                  type="tel" 
                  value={formData.guardianPhone} 
                  onChange={e => setFormData({...formData, guardianPhone: e.target.value})} 
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Correo Acudiente</label>
                <input 
                  type="email" 
                  value={formData.guardianEmail} 
                  onChange={e => setFormData({...formData, guardianEmail: e.target.value})} 
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Dirección Residencia</label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
                />
              </div>
            </div>
          </div>
        )}

        {formData.role === "TEACHER" && (
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(20, 184, 166, 0.05)', borderRadius: 'var(--radius)', border: '1px solid rgba(20, 184, 166, 0.1)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-teal)', marginBottom: '1rem' }}>Datos Profesionales</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Especialidad</label>
                <input 
                  type="text" 
                  value={formData.specialization} 
                  onChange={e => setFormData({...formData, specialization: e.target.value})} 
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Teléfono Contacto</label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Dirección Residencia</label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
                />
              </div>
            </div>
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
