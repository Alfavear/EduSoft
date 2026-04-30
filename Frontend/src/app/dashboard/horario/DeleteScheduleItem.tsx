"use client";

import { deleteScheduleItem } from "./actions";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteScheduleItem({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este bloque de horario?")) return;
    setLoading(true);
    try {
      await deleteScheduleItem(id);
    } catch (err) {
      alert("Error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      style={{ 
        position: 'absolute', 
        top: '2px', 
        right: '2px', 
        background: 'rgba(239, 68, 68, 0.1)', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer',
        padding: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: loading ? 0.5 : 1
      }}
      title="Eliminar bloque"
    >
      <Trash2 size={12} color="var(--color-danger)" />
    </button>
  );
}
