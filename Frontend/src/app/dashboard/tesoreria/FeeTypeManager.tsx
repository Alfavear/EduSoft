"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X, DollarSign } from "lucide-react";
import { createFeeType, updateFeeType, deleteFeeType } from "./actions";

export function FeeTypeManager({ feeTypes }: { feeTypes: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", amount: 0, description: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updateFeeType(editingId, formData);
      } else {
        await createFeeType(formData);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: "", amount: 0, description: "" });
    } catch (error) {
      alert("Error al guardar el concepto");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (ft: any) => {
    setEditingId(ft.id);
    setFormData({ name: ft.name, amount: ft.amount, description: ft.description || "" });
    setIsAdding(true);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isAdding ? '400px 1fr' : '1fr', gap: '2rem' }}>
      {/* Form Section */}
      {isAdding && (
        <div className="card" style={{ padding: '2rem', animation: 'slideIn 0.3s ease-out' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={20} color="var(--color-primary)" />
            {editingId ? 'Editar Concepto' : 'Nuevo Concepto de Cobro'}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label">Nombre del Concepto</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ej: Pensión Mensual Mayo"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="label">Valor ($)</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder="0.00"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                required
              />
            </div>
            <div>
              <label className="label">Descripción (Opcional)</label>
              <textarea 
                className="input-field" 
                rows={3}
                placeholder="Detalles adicionales..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear Concepto')}
              </button>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Section */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Conceptos Definidos</h3>
          {!isAdding && (
            <button className="btn-primary" onClick={() => setIsAdding(true)}>
              <Plus size={18} /> Nuevo Concepto
            </button>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Nombre</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Valor</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Descripción</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {feeTypes.map((ft) => (
                <tr key={ft.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{ft.name}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    ${ft.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {ft.description || "—"}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn-secondary" style={{ padding: '0.4rem' }} onClick={() => startEdit(ft)}>
                        <Edit2 size={14} />
                      </button>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '0.4rem', color: 'var(--color-danger)' }}
                        onClick={async () => {
                          if (confirm("¿Eliminar este concepto?")) {
                            await deleteFeeType(ft.id);
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {feeTypes.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No hay conceptos de cobro definidos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
