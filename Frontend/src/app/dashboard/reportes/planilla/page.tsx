"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAssignmentsForReports } from "../actions";
import { FileSpreadsheet, ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PlanillaSelectionPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getAssignmentsForReports();
      setAssignments(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleGenerate = () => {
    if (selectedAssignment) {
      router.push(`/dashboard/reportes/planilla/${selectedAssignment}`);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/reportes" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> Volver a Reportes
        </Link>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "800", color: "var(--text-main)", display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "0.5rem", borderRadius: "0.5rem", color: "var(--color-success)" }}>
             <FileSpreadsheet size={24} />
          </div>
          Generar Planilla
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Selecciona una clase/asignación para imprimir la planilla consolidada de notas.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Cargando datos...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.875rem' }}>Clase Asignada</label>
              <select 
                className="input-field" 
                value={selectedAssignment} 
                onChange={(e) => setSelectedAssignment(e.target.value)}
              >
                <option value="">-- Seleccionar Asignación --</option>
                {assignments.map(as => (
                  <option key={as.id} value={as.id}>
                    {as.course.name} - {as.subject.name} (Docente: {as.teacher.firstName} {as.teacher.lastName})
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="btn-primary" 
              style={{ marginTop: '1rem', padding: '0.75rem', fontSize: '1rem', backgroundColor: 'var(--color-success)' }}
              onClick={handleGenerate}
              disabled={!selectedAssignment}
            >
              Generar Planilla <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
