"use client";

import { useState } from "react";
import { Plus, CreditCard, Calendar, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { generateInvoices } from "./actions";

export function InvoiceGenerator({ feeTypes, courses }: { feeTypes: any[], courses: any[] }) {
  const [formData, setFormData] = useState({
    feeTypeId: "",
    courseId: "", // Empty means all courses
    dueDate: new Date().toISOString().split('T')[0],
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count: number } | null>(null);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.feeTypeId) return alert("Selecciona un concepto de cobro");

    setLoading(true);
    setResult(null);
    try {
      const count = await generateInvoices({
        ...formData,
        dueDate: new Date(formData.dueDate)
      });
      setResult({ success: true, count });
    } catch (error) {
      console.error(error);
      alert("Error al generar facturas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '1rem' }}>
            <CreditCard size={28} color="var(--color-primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Generación Masiva de Cobros</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Crea deudas para múltiples estudiantes en un solo paso</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="label">Concepto de Cobro</label>
            <select 
              className="input-field"
              value={formData.feeTypeId}
              onChange={e => setFormData({...formData, feeTypeId: e.target.value})}
              required
            >
              <option value="">Seleccione un concepto...</option>
              {feeTypes.map(ft => (
                <option key={ft.id} value={ft.id}>{ft.name} - ${ft.amount.toLocaleString()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Curso (Opcional)</label>
            <select 
              className="input-field"
              value={formData.courseId}
              onChange={e => setFormData({...formData, courseId: e.target.value})}
            >
              <option value="">Todos los Cursos</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Fecha de Vencimiento</label>
            <input 
              type="date" 
              className="input-field"
              value={formData.dueDate}
              onChange={e => setFormData({...formData, dueDate: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="label">Mes correspondiente</label>
            <select 
              className="input-field"
              value={formData.month}
              onChange={e => setFormData({...formData, month: parseInt(e.target.value)})}
            >
              {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Año</label>
            <input 
              type="number" 
              className="input-field"
              value={formData.year}
              onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="label">Notas adicionales</label>
            <input 
              type="text" 
              className="input-field"
              placeholder="Ej: Pensura mensual grado primero"
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Generando...' : 'Generar Facturas Masivamente'}
            </button>
          </div>
        </form>

        {result && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            borderRadius: '1rem', 
            backgroundColor: result.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            border: `1px solid ${result.success ? 'var(--color-success)' : 'var(--color-danger)'}`,
            animation: 'bounceIn 0.5s ease-out'
          }}>
            {result.success ? (
              <CheckCircle2 size={24} color="var(--color-success)" />
            ) : (
              <AlertCircle size={24} color="var(--color-danger)" />
            )}
            <div>
              <h4 style={{ fontWeight: 'bold', color: result.success ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {result.success ? '¡Proceso Exitoso!' : 'Error en el proceso'}
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Se han generado/actualizado <strong>{result.count}</strong> facturas satisfactoriamente.
              </p>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius)', display: 'flex', gap: '0.75rem' }}>
          <AlertCircle size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            <strong>Nota importante:</strong> Si ya existen facturas para el mismo estudiante, concepto, mes y año, el sistema actualizará el valor y la fecha de vencimiento en lugar de duplicarlas.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounceIn {
          0% { transform: scale(0.9); opacity: 0; }
          70% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
