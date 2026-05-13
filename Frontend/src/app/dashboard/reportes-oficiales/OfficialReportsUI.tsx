"use client";

import { useState } from "react";
import { Download, AlertCircle, CheckCircle, FileSpreadsheet, ShieldCheck, Info } from "lucide-react";
import { exportSIMATAnexo6A } from "./actions";

export function OfficialReportsUI({ missingData, academicYears }: any) {
  const [selectedYear, setSelectedYear] = useState(academicYears[0]?.id || "");
  const [loading, setLoading] = useState(false);

  const handleExportSIMAT = async () => {
    if (!selectedYear) return;
    setLoading(true);
    try {
      const data = await exportSIMATAnexo6A(selectedYear);
      
      // Convertir a CSV
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map((obj: any) => Object.values(obj).join(","));
      const csvContent = [headers, ...rows].join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `SIMAT_ANEXO_6A_${new Date().getFullYear()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Error al generar el reporte SIMAT");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* SIMAT EXPORT */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius)', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)' }}>
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Exportar Anexo 6A (SIMAT)</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Genera el archivo CSV con la estructura requerida por el Ministerio de Educación.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select 
              className="input-field" 
              style={{ width: '250px' }}
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
            >
              {academicYears.map((y: any) => <option key={y.id} value={y.id}>{y.name}</option>)}
            </select>
            <button 
              className="btn-primary" 
              onClick={handleExportSIMAT}
              disabled={loading || !selectedYear}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Download size={18} /> {loading ? 'Procesando...' : 'Descargar CSV'}
            </button>
          </div>
          
          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg-app)', fontSize: '0.8rem', display: 'flex', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Info size={16} />
            <span>Este archivo incluye variables de matrícula, caracterización, PAE y transporte según lineamientos 2024.</span>
          </div>
        </div>

        {/* DANE C-600 */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-teal)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Censo Anual DANE (C-600)</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Información consolidada de planta física, docentes y matrícula por niveles.</p>
            </div>
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Generar Reporte Consolidado
          </button>
        </div>
      </div>

      {/* AUDIT SIDEBAR (Control Normativo) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--color-danger)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)' }}>
            <AlertCircle size={18} /> Control de Calidad SIMAT
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Estudiantes con campos obligatorios faltantes para el reporte oficial.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {missingData.length > 0 ? (
              missingData.map((s: any) => (
                <div key={s.id} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{s.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{s.course}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {s.missing.map((m: string) => (
                      <span key={m} style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-danger)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '1rem' }}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-success)' }}>
                <CheckCircle size={32} style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>¡Datos Completos!</div>
                <div style={{ fontSize: '0.75rem' }}>Toda la matrícula cumple con los requisitos SIMAT.</div>
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-app)' }}>
          <h4 style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem' }}>¿Por qué auditar?</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            El Ministerio de Educación rechaza los cargues masivos si falta un solo campo obligatorio como el SISBÉN o el Estrato. EduSoft asegura que su reporte sea exitoso a la primera.
          </p>
        </div>
      </div>
    </div>
  );
}
