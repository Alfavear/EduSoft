"use client";

import { useState } from "react";
import { createObservation } from "../observadorActions";
import { ObservationType, Severity } from "@prisma/client";
import { PlusCircle, Loader2 } from "lucide-react";

export function ObservationForm({ studentId, teacherId }: { studentId: string, teacherId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<ObservationType>("CONDUCTUAL");
  const [severity, setSeverity] = useState<Severity>("LEVE");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      await createObservation({
        studentId,
        teacherId,
        type,
        severity,
        description
      });
      setDescription("");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error al crear la observación");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className="btn-primary" 
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
      >
        <PlusCircle size={18} />
        Nueva Observación
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
      <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', fontSize: '0.95rem' }}>Registrar Observación</h4>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Tipo</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value as ObservationType)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
            >
              <option value="CONDUCTUAL">Conductual</option>
              <option value="ACADEMICA">Académica</option>
              <option value="OTRA">Otra</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Gravedad</label>
            <select 
              value={severity} 
              onChange={(e) => setSeverity(e.target.value as Severity)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
            >
              <option value="LEVE">Leve</option>
              <option value="MODERADA">Moderada</option>
              <option value="GRAVE">Grave</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Descripción</label>
          <textarea 
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalle los hechos observados..."
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '0.4rem', 
              border: '1px solid var(--color-border)', 
              fontSize: '0.85rem',
              resize: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Guardar"}
          </button>
          <button 
            type="button" 
            onClick={() => setIsOpen(false)} 
            className="btn-secondary" 
            style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
