"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStudentsForReports, getActivePeriodsForReports } from "../actions";
import { FileText, ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function BoletinSelectionPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [periods, setPeriods] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [stData, prData] = await Promise.all([
        getStudentsForReports(),
        getActivePeriodsForReports()
      ]);
      setStudents(stData);
      setPeriods(prData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleGenerate = () => {
    if (selectedStudent && selectedPeriod) {
      router.push(`/dashboard/reportes/boletin/${selectedStudent}/${selectedPeriod}`);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/reportes" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> Volver a Reportes
        </Link>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "800", color: "var(--text-main)", display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", padding: "0.5rem", borderRadius: "0.5rem", color: "var(--color-primary)" }}>
             <FileText size={24} />
          </div>
          Generar Boletín
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Selecciona un estudiante y un periodo académico para generar su boletín oficial.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Cargando datos...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.875rem' }}>Estudiante</label>
              <select 
                className="input-field" 
                value={selectedStudent} 
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">-- Seleccionar Estudiante --</option>
                {students.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.lastName} {st.firstName} ({st.course.name})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.875rem' }}>Periodo Académico</label>
              <select 
                className="input-field" 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="">-- Seleccionar Periodo --</option>
                {periods.map(pr => (
                  <option key={pr.id} value={pr.id}>
                    {pr.name}
                  </option>
                ))}
              </select>
              {periods.length === 0 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>No hay periodos activos configurados.</span>
              )}
            </div>

            <button 
              className="btn-primary" 
              style={{ marginTop: '1rem', padding: '0.75rem', fontSize: '1rem' }}
              onClick={handleGenerate}
              disabled={!selectedStudent || !selectedPeriod}
            >
              Generar Boletín <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
