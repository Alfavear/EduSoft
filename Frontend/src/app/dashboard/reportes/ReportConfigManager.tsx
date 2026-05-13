"use client";

import { useState } from "react";
import { Settings, FileText, TrendingUp, Book, Clock, Save, Eye, Printer, ChevronLeft } from "lucide-react";
import { upsertIndicator, getStudentReportData, getInstitutionalInfo } from "./actions";
import { StudentBoletin } from "./StudentBoletin";

export function ReportConfigManager({ subjects, periods, courses }: any) {
  const [activeTab, setActiveTab] = useState("indicators");
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [schoolInfo, setSchoolInfo] = useState<any>(null);
  
  // States for indicators
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]?.id || "");
  const [indicatorTexts, setIndicatorTexts] = useState({
    Superior: "",
    Alto: "",
    Básico: "",
    Bajo: ""
  });

  const handleSaveIndicators = async () => {
    if (!selectedSubject || !selectedPeriod) return;
    setLoading(true);
    try {
      await Promise.all(
        Object.entries(indicatorTexts).map(([level, text]) => 
          upsertIndicator({
            subjectId: selectedSubject,
            periodId: selectedPeriod,
            performanceLevel: level,
            description: text
          })
        )
      );
      alert("Indicadores guardados correctamente");
    } catch (error) {
      alert("Error al guardar indicadores");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    // Para la demo, tomamos el primer estudiante de un curso (esto se puede mejorar con un buscador)
    setLoading(true);
    try {
      const info = await getInstitutionalInfo();
      setSchoolInfo(info);
      
      // Buscamos un estudiante cualquiera para la previsualización
      // En una implementación real, esto vendría de un selector de estudiante
      const data = await getStudentReportData("cm1student", selectedPeriod); // ID de prueba o real
      if (data) {
        setPreviewData(data);
        setActiveTab("preview");
      } else {
        alert("No se encontraron datos para este estudiante/periodo.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al generar previsualización");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab("indicators")}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === "indicators" ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === "indicators" ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === "indicators" ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Book size={18} /> Juicios Valorativos
        </button>
        <button 
          onClick={() => setActiveTab("print")}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === "print" ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === "print" ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === "print" ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Printer size={18} /> Generar Boletines
        </button>
      </div>

      {activeTab === "indicators" && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
          {/* Selectors */}
          <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={18} /> Selección
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label">Asignatura</label>
                <select 
                  className="input-field"
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                >
                  <option value="">Seleccione...</option>
                  {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Periodo</label>
                <select 
                  className="input-field"
                  value={selectedPeriod}
                  onChange={e => setSelectedPeriod(e.target.value)}
                >
                  {periods.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Texts */}
          <div className="card" style={{ padding: '2rem' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '2rem' }}>Descripción de Juicios por Nivel de Desempeño</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(['Superior', 'Alto', 'Básico', 'Bajo'] as const).map(level => (
                <div key={level}>
                  <label className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Desempeño {level}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mapeo Decreto 1290</span>
                  </label>
                  <textarea 
                    className="input-field" 
                    rows={3} 
                    placeholder={`Escriba el juicio valorativo para nivel ${level}...`}
                    value={indicatorTexts[level]}
                    onChange={e => setIndicatorTexts({...indicatorTexts, [level]: e.target.value})}
                  />
                </div>
              ))}
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  className="btn-primary" 
                  onClick={handleSaveIndicators}
                  disabled={loading || !selectedSubject}
                  style={{ padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Save size={18} /> {loading ? 'Guardando...' : 'Guardar Indicadores'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "print" && (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <FileText size={32} color="var(--color-primary)" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Impresión de Boletines por Curso</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Seleccione el curso y el periodo para generar los informes individuales con escalafón (puestos) incluido.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <select className="input-field" style={{ width: '250px' }}>
              <option value="">Seleccione Curso...</option>
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="input-field" style={{ width: '200px' }}>
              {periods.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={handlePreview}
              disabled={loading || !selectedPeriod}
            >
              <Eye size={18} /> {loading ? 'Cargando...' : 'Previsualizar Ejemplo'}
            </button>
          </div>
        </div>
      )}

      {activeTab === "preview" && (
        <div>
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" onClick={() => setActiveTab("print")} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ChevronLeft size={18} /> Volver
            </button>
            <button className="btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Printer size={18} /> Imprimir Boletín
            </button>
          </div>
          <StudentBoletin 
            data={previewData} 
            schoolInfo={schoolInfo} 
            periodName={periods.find((p: any) => p.id === selectedPeriod)?.name || "Periodo"} 
          />
        </div>
      )}

    </div>
  );
}
