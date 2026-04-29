"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { createEvent } from "./actions";
import { Role } from "@prisma/client";

export default function EventManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState<{ id: string, name: string }[]>([]);

  useEffect(() => {
    // Simple fetch for courses if needed, but for now we'll keep it simple
    // In a real app we might fetch these from an action
  }, []);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Plus size={18} /> Nuevo Evento / Actividad
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Programar Actividad</h2>
            
            <form action={async (formData) => {
              await createEvent(formData);
              setIsOpen(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Título de la Actividad</label>
                <input name="title" required className="input-field" placeholder="Ej: Examen de Matemáticas" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Descripción / Detalles</label>
                <textarea name="description" className="input-field" style={{ minHeight: '80px' }} placeholder="Temas a tratar, materiales, etc."></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Fecha</label>
                  <input name="startDate" type="date" required className="input-field" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Tipo</label>
                  <select name="type" className="input-field">
                    <option value="MEETING">Reunión</option>
                    <option value="BULLETIN_DELIVERY">Entrega de Boletines</option>
                    <option value="PEDAGOGICAL_DAY">Jornada Pedagógica</option>
                    <option value="HOLIDAY">Festivo</option>
                    <option value="OTHER">Actividad / Examen</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Dirigido a:</label>
                  <select name="targetRole" className="input-field">
                    <option value="">Todos</option>
                    <option value="STUDENT">Estudiantes</option>
                    <option value="TEACHER">Docentes</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Ámbito:</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '42px' }}>
                    <input name="isGlobal" type="checkbox" id="isGlobal" defaultChecked />
                    <label htmlFor="isGlobal" style={{ fontSize: '0.875rem' }}>Institucional</label>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Publicar en Calendario</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
