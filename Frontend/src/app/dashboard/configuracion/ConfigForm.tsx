"use client";

import { useState } from "react";
import { createAcademicYear } from "./actions";
import { Plus, Trash2, Save, CalendarDays, Percent } from "lucide-react";

export function ConfigForm() {
  const [yearName, setYearName] = useState("");
  const [periods, setPeriods] = useState([{ name: "Periodo 1", weight: 0 }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addPeriod = () => {
    setPeriods([...periods, { name: `Periodo ${periods.length + 1}`, weight: 0 }]);
  };

  const removePeriod = (index: number) => {
    setPeriods(periods.filter((_, i) => i !== index));
  };

  const updatePeriod = (index: number, field: "name" | "weight", value: string | number) => {
    const newPeriods = [...periods];
    newPeriods[index] = { ...newPeriods[index], [field]: value };
    setPeriods(newPeriods);
  };

  const totalWeight = periods.reduce((acc, p) => acc + (Number(p.weight) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!yearName) return setError("El nombre del año lectivo es requerido.");
    if (totalWeight !== 100) return setError(`La suma de porcentajes es ${totalWeight}%. Debe ser exactamente 100%.`);

    setIsLoading(true);
    
    // Parse weights to floats
    const parsedPeriods = periods.map(p => ({ ...p, weight: Number(p.weight) }));
    
    const res = await createAcademicYear({ name: yearName, periods: parsedPeriods });
    
    if (res.success) {
      setSuccess("Año lectivo creado correctamente.");
      setYearName("");
      setPeriods([{ name: "Periodo 1", weight: 0 }]);
    } else {
      setError(res.error || "Error desconocido");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CalendarDays color="var(--color-primary)" />
        Nuevo Año Lectivo
      </h2>

      {error && (
        <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1rem', border: '1px solid rgba(239,68,68,0.3)' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1rem', border: '1px solid rgba(16,185,129,0.3)' }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nombre del Año (Ej: 2026-2027)</label>
          <input 
            type="text" 
            value={yearName} 
            onChange={(e) => setYearName(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}
            placeholder="2026-2027"
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <label style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Percent size={18} color="var(--text-muted)" />
              Periodos y Ponderación
            </label>
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: totalWeight === 100 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              Total: {totalWeight}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {periods.map((period, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={period.name}
                  onChange={(e) => updatePeriod(index, "name", e.target.value)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}
                  placeholder="Nombre del Periodo"
                />
                <div style={{ position: 'relative', width: '120px' }}>
                  <input 
                    type="number" 
                    value={period.weight}
                    onChange={(e) => updatePeriod(index, "weight", e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', paddingRight: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}
                    placeholder="0"
                  />
                  <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>%</span>
                </div>
                
                {periods.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removePeriod(index)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '0.5rem' }}
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={addPeriod}
            style={{ marginTop: '1rem', background: 'transparent', border: '1px dashed var(--color-primary)', color: 'var(--color-primary)', padding: '0.75rem', borderRadius: 'var(--radius)', width: '100%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}
          >
            <Plus size={20} /> Añadir Periodo
          </button>
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isLoading || totalWeight !== 100}
          style={{ padding: '1rem', opacity: (isLoading || totalWeight !== 100) ? 0.5 : 1 }}
        >
          <Save size={20} />
          {isLoading ? "Guardando..." : "Guardar Estructura Académica"}
        </button>
      </form>
    </div>
  );
}
