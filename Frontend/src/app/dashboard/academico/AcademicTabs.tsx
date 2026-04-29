"use client";

import { useState } from "react";
import { createCourse, createSubject, createGradingConfig } from "./actions";
import { BookOpen, School, Settings, Plus, Save, Trash2, CheckCircle } from "lucide-react";

export function AcademicTabs({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState("cursos");
  const { courses, subjects, gradingConfigs, teachers } = initialData;

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-app)' }}>
        <button 
          onClick={() => setActiveTab("cursos")}
          style={{ 
            flex: 1, padding: '1rem', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: '600', borderBottom: activeTab === 'cursos' ? '3px solid var(--color-primary)' : 'none',
            color: activeTab === 'cursos' ? 'var(--color-primary)' : 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <School size={18} /> Salones / Cursos
          </div>
        </button>
        <button 
          onClick={() => setActiveTab("materias")}
          style={{ 
            flex: 1, padding: '1rem', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: '600', borderBottom: activeTab === 'materias' ? '3px solid var(--color-purple)' : 'none',
            color: activeTab === 'materias' ? 'var(--color-purple)' : 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} /> Materias
          </div>
        </button>
        <button 
          onClick={() => setActiveTab("esquemas")}
          style={{ 
            flex: 1, padding: '1rem', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: '600', borderBottom: activeTab === 'esquemas' ? '3px solid var(--color-teal)' : 'none',
            color: activeTab === 'esquemas' ? 'var(--color-teal)' : 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Settings size={18} /> Esquemas de Notas
          </div>
        </button>
      </div>

      <div style={{ padding: '2rem' }}>
        {activeTab === "cursos" && <CoursesTab courses={courses} teachers={teachers} />}
        {activeTab === "materias" && <SubjectsTab subjects={subjects} gradingConfigs={gradingConfigs} />}
        {activeTab === "esquemas" && <GradingTab gradingConfigs={gradingConfigs} />}
      </div>
    </div>
  );
}

function CoursesTab({ courses, teachers }: { courses: any[], teachers: any[] }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [directorId, setDirectorId] = useState("");

  const handleAdd = async () => {
    if (!name) return;
    await createCourse({ name, description: desc, directorId });
    setName(""); setDesc(""); setDirectorId("");
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Salones Registrados</h3>
          <div className="grid-cards">
            {courses.map(c => (
              <div key={c.id} className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--color-primary)' }}>
                <h4 style={{ fontWeight: 'bold' }}>{c.name}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{c.description || "Sin descripción"}</p>
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                    {c._count.students} Alumnos
                  </div>
                  {c.director && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Dir: {c.director.firstName} {c.director.lastName}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h4 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Añadir Salón</h4>
          <input 
            type="text" placeholder="Ej: Décimo A" value={name} onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', marginBottom: '0.5rem' }} 
          />
          <textarea 
            placeholder="Descripción..." value={desc} onChange={e => setDesc(e.target.value)}
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', marginBottom: '0.5rem', height: '80px' }} 
          />
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>Director de Grupo</label>
          <select 
            value={directorId} onChange={e => setDirectorId(e.target.value)}
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', marginBottom: '1rem', backgroundColor: 'white' }}
          >
            <option value="">Seleccionar director...</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
            ))}
          </select>
          <button className="btn-primary" style={{ width: '100%' }} onClick={handleAdd}><Plus size={18}/> Crear Salón</button>
        </div>
      </div>
    </div>
  );
}

function SubjectsTab({ subjects, gradingConfigs }: { subjects: any[], gradingConfigs: any[] }) {
  const [name, setName] = useState("");
  const [configId, setConfigId] = useState("");

  const handleAdd = async () => {
    if (!name || !configId) return;
    await createSubject({ name, gradingConfigId: configId });
    setName(""); setConfigId("");
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Materias Registradas</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '0.75rem' }}>Materia</th>
                <th style={{ padding: '0.75rem' }}>Esquema de Notas</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{s.name}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(20, 184, 166, 0.1)', color: 'var(--color-teal)', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontWeight: 'bold' }}>
                      {s.gradingConfig.name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h4 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Añadir Materia</h4>
          <input 
            type="text" placeholder="Ej: Matemáticas" value={name} onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', marginBottom: '0.5rem' }} 
          />
          <select 
            value={configId} onChange={e => setConfigId(e.target.value)}
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', marginBottom: '1rem' }}
          >
            <option value="">Esquema de notas...</option>
            {gradingConfigs.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <button className="btn-primary" style={{ width: '100%', backgroundColor: 'var(--color-purple)' }} onClick={handleAdd}><Plus size={18}/> Crear Materia</button>
        </div>
      </div>
    </div>
  );
}

function GradingTab({ gradingConfigs }: { gradingConfigs: any[] }) {
  const [formData, setFormData] = useState({ name: "", type: "NUMERIC", minValue: 0, maxValue: 5, allowedValues: "" });

  const handleAdd = async () => {
    if (!formData.name) return;
    await createGradingConfig(formData);
    setFormData({ name: "", type: "NUMERIC", minValue: 0, maxValue: 5, allowedValues: "" });
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Esquemas de Calificación</h3>
          <div className="grid-cards">
            {gradingConfigs.map(g => (
              <div key={g.id} className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--color-teal)' }}>
                <h4 style={{ fontWeight: 'bold' }}>{g.name}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Tipo: {g.type} {g.type === 'NUMERIC' ? `(${g.minValue} - ${g.maxValue})` : `[${g.allowedValues}]`}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h4 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Añadir Esquema</h4>
          <input 
            type="text" placeholder="Ej: Escala 1 a 5" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', marginBottom: '0.5rem' }} 
          />
          <select 
            value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', marginBottom: '0.5rem' }}
          >
            <option value="NUMERIC">Numérica</option>
            <option value="LETTER">Cualitativa (Letras)</option>
          </select>
          {formData.type === "NUMERIC" ? (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input type="number" placeholder="Min" value={formData.minValue} onChange={e => setFormData({...formData, minValue: Number(e.target.value)})} style={{ width: '50%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} />
              <input type="number" placeholder="Max" value={formData.maxValue} onChange={e => setFormData({...formData, maxValue: Number(e.target.value)})} style={{ width: '50%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} />
            </div>
          ) : (
            <input 
              type="text" placeholder="A,B,C,D,F" value={formData.allowedValues} onChange={e => setFormData({...formData, allowedValues: e.target.value})}
              style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', marginBottom: '1rem' }} 
            />
          )}
          <button className="btn-primary" style={{ width: '100%', backgroundColor: 'var(--color-teal)' }} onClick={handleAdd}><Plus size={18}/> Crear Esquema</button>
        </div>
      </div>
    </div>
  );
}
