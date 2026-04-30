"use client";

import { useState } from "react";
import { addScheduleItem, deleteScheduleItem } from "./actions";
import { Plus, Trash2, AlertCircle, Clock, BookOpen, User } from "lucide-react";

export default function ScheduleManager({ assignments }: { assignments: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    assignmentId: "",
    dayOfWeek: "1",
    startTime: "07:00",
    endTime: "07:50"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addScheduleItem({
        ...formData,
        dayOfWeek: parseInt(formData.dayOfWeek)
      });
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const days = [
    { v: "1", l: "Lunes" },
    { v: "2", l: "Martes" },
    { v: "3", l: "Miércoles" },
    { v: "4", l: "Jueves" },
    { v: "5", l: "Viernes" },
  ];

  const timeSlots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

  return (
    <div style={{ marginBottom: '2rem' }}>
      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Programar Nueva Clase
        </button>
      ) : (
        <div className="card" style={{ padding: '2rem', border: '2px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock color="var(--color-primary)" /> Nueva Programación
            </h3>
            <button onClick={() => setShowForm(false)} className="btn-secondary" style={{ padding: '0.25rem 0.75rem' }}>Cancelar</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>1. Seleccionar Carga Académica:</label>
              <select 
                required
                value={formData.assignmentId}
                onChange={e => setFormData({...formData, assignmentId: e.target.value})}
                className="input-field"
              >
                <option value="">-- Seleccionar Docente / Materia / Curso --</option>
                {assignments.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.course.name} - {a.subject.name} ({a.teacher.firstName} {a.teacher.lastName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>2. Día:</label>
              <select 
                value={formData.dayOfWeek}
                onChange={e => setFormData({...formData, dayOfWeek: e.target.value})}
                className="input-field"
              >
                {days.map(d => <option key={d.v} value={d.v}>{d.l}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>3. Hora de Inicio:</label>
              <select 
                value={formData.startTime}
                onChange={e => {
                   const h = e.target.value.split(':')[0];
                   setFormData({...formData, startTime: e.target.value, endTime: `${h}:50`});
                }}
                className="input-field"
              >
                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', height: '42px' }}
                disabled={loading}
              >
                {loading ? "Validando..." : "Guardar Programación"}
              </button>
            </div>
          </form>

          {error && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: 'var(--color-danger)', 
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.9rem',
              border: '1px solid var(--color-danger)'
            }}>
              <AlertCircle size={20} />
              <strong>{error}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
