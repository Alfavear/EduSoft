"use client";

import { useState } from "react";
import { addFollowUp } from "../observadorActions";
import { Send, Loader2 } from "lucide-react";

export function FollowUpForm({ observationId }: { observationId: string }) {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      await addFollowUp({
        observationId,
        description
      });
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("Error al añadir el seguimiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
      <input 
        type="text" 
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Añadir seguimiento..."
        style={{ 
          flex: 1, 
          padding: '0.5rem 0.75rem', 
          borderRadius: '0.4rem', 
          border: '1px solid var(--color-border)', 
          fontSize: '0.85rem' 
        }}
      />
      <button 
        type="submit" 
        disabled={loading}
        className="btn-primary" 
        style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
      </button>
    </form>
  );
}
