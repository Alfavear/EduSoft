"use client";

import { useState } from "react";
import { GraduationCap, AlertTriangle, CheckCircle2, ArrowRightCircle, Info } from "lucide-react";
import { closeAcademicYear, promoteStudents } from "./actions";

export function PromotionManager({ academicYears, courses, activeYearId }: any) {
  const [loading, setLoading] = useState(false);
  const [selectedYearId, setSelectedYearId] = useState(activeYearId || "");
  const [targetYearId, setTargetYearId] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [promotionResult, setPromotionResult] = useState<number | null>(null);

  const activeYearName = academicYears.find((y: any) => y.id === selectedYearId)?.name || "...";

  const handleCloseYear = async () => {
    if (!selectedYearId) return;
    if (!confirm(`¿Está seguro de cerrar el año académico ${activeYearName}? Esto calculará los promedios finales y definirá quiénes aprueban, reprueban o habilitan según el Decreto 1290.`)) return;

    setLoading(true);
    try {
      const count = await closeAcademicYear(selectedYearId);
      setResult(count);
    } catch (error) {
      alert("Error al procesar el cierre de año");
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async () => {
    if (!selectedYearId || !targetYearId) return;
    if (!confirm(`¿Desea realizar la matrícula masiva de los estudiantes aprobados del año ${activeYearName} al año siguiente?`)) return;

    setLoading(true);
    setPromotionResult(null);
    try {
      const count = await promoteStudents(selectedYearId, targetYearId);
      setPromotionResult(count);
    } catch (error) {
      alert("Error al realizar la promoción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '1rem' }}>
            <GraduationCap size={28} color="var(--color-primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Cierre y Promoción Académica</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Procesamiento masivo de resultados finales (Decreto 1290)</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <AlertTriangle color="var(--color-warning)" size={24} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Antes de Cerrar el Año</h4>
                <ul style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1.25rem' }}>
                  <li>Asegúrese de que todos los docentes hayan subido las notas de todos los periodos.</li>
                  <li>Verifique que las ponderaciones de los periodos sumen el 100%.</li>
                  <li>El sistema usará el **SIEE** (Sistema Institucional de Evaluación) para determinar el éxito académico.</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <label className="label">Seleccione Año Lectivo para Procesar</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <select 
                className="input-field" 
                style={{ flex: 1 }}
                value={selectedYearId}
                onChange={e => setSelectedYearId(e.target.value)}
              >
                <option value="">Seleccione un año...</option>
                {academicYears.map((y: any) => <option key={y.id} value={y.id}>{y.name}</option>)}
              </select>
              <button 
                className="btn-primary" 
                onClick={handleCloseYear}
                disabled={loading || !selectedYearId}
              >
                {loading ? 'Procesando...' : 'Ejecutar Cierre y Promoción'}
              </button>
            </div>
          </div>

          {result !== null && (
            <div style={{ 
              padding: '1.5rem', 
              borderRadius: 'var(--radius)', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <CheckCircle2 size={24} color="var(--color-success)" />
              <div>
                <p style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>Proceso completado satisfactoriamente</p>
                <p style={{ fontSize: '0.875rem' }}>Se han procesado **{result}** registros de matrícula para el año {activeYearName}.</p>
              </div>
            </div>
          )}

          {promotionResult !== null && (
            <div style={{ 
              padding: '1.5rem', 
              borderRadius: 'var(--radius)', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <CheckCircle2 size={24} color="var(--color-success)" />
              <div>
                <p style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>Promoción Completada</p>
                <p style={{ fontSize: '0.875rem' }}>Se han matriculado **{promotionResult}** estudiantes en el nuevo año lectivo.</p>
              </div>
            </div>
          )}


          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowRightCircle size={20} color="var(--color-primary)" />
              Siguiente Paso: Matrícula Masiva Año Siguiente
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Una vez cerrado el año, puede realizar la matrícula masiva de los estudiantes aprobados al grado siguiente para el nuevo periodo académico seleccionado.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <select 
                className="input-field" 
                style={{ flex: 1 }}
                value={targetYearId}
                onChange={e => setTargetYearId(e.target.value)}
              >
                <option value="">Seleccione Año Destino...</option>
                {academicYears.filter((y: any) => y.id !== selectedYearId).map((y: any) => (
                  <option key={y.id} value={y.id}>{y.name}</option>
                ))}
              </select>
              <button 
                className="btn-secondary" 
                onClick={handlePromote}
                disabled={loading || !selectedYearId || !targetYearId}
                style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none' }}
              >
                {loading ? 'Promoviendo...' : 'Ejecutar Matrícula Masiva'}
              </button>
            </div>
          </div>

        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius)' }}>
          <Info size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            <strong>Criterio Normativo (Colombia):</strong> Según el Decreto 1290, los resultados se expresan en la escala nacional: Superior, Alto, Básico o Bajo. El estudiante que obtenga "Bajo" en una o más áreas tiene derecho a actividades de nivelación antes de la decisión final.
          </p>
        </div>
      </div>
    </div>
  );
}
