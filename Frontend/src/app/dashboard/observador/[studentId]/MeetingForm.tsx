"use client";

import { useState } from "react";
import { scheduleParentMeeting } from "../observadorActions";
import { Calendar, Loader2, X } from "lucide-react";

export function MeetingForm({ studentId, teacherId }: { studentId: string, teacherId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    setLoading(true);
    try {
      const dateTime = new Date(`${date}T${time}`);
      await scheduleParentMeeting({
        studentId,
        teacherId,
        date: dateTime,
        notes: notes || undefined
      });
      setDate("");
      setTime("");
      setNotes("");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error al programar la reunión");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className="btn-secondary" 
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
      >
        <Calendar size={18} />
        Programar Reunión
      </button>
    );
  }

  return (
    <div style={{ 
      backgroundColor: 'var(--color-bg-alt)', 
      padding: '1.25rem', 
      borderRadius: '0.75rem', 
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ fontWeight: 'bold', fontSize: '0.95rem', margin: 0 }}>Programar Reunión</h4>
        <button onClick={() => setIsOpen(false)} style={{ color: 'var(--color-text-muted)' }}>
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Fecha</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Hora</label>
            <input 
              type="time" 
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Notas iniciales</label>
          <textarea 
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Motivo de la reunión..."
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              borderRadius: '0.4rem', 
              border: '1px solid var(--color-border)', 
              fontSize: '0.85rem',
              resize: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary" 
          style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Programar"}
        </button>
      </form>
    </div>
  );
}
