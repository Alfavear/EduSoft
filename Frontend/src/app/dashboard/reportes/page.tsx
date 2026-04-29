import { FileText, Printer, FileSpreadsheet, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ReportesPage() {
  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.025em" }}>
          Centro de Reportes
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "1.125rem" }}>
          Genera, consulta y descarga los documentos oficiales de la institución.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "2rem" }}>
        
        {/* Card: Boletines */}
        <div className="card interactive-card" style={{ 
          display: "flex", 
          flexDirection: "column", 
          padding: "2rem",
          cursor: "pointer"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", padding: "1.25rem", borderRadius: "1rem", color: "var(--color-primary)" }}>
              <FileText size={32} strokeWidth={1.5} />
            </div>
            <span style={{ 
              backgroundColor: "rgba(59, 130, 246, 0.1)", 
              color: "var(--color-primary)", 
              padding: "0.25rem 0.75rem", 
              borderRadius: "2rem", 
              fontSize: "0.75rem", 
              fontWeight: "bold",
              border: "1px solid rgba(59, 130, 246, 0.2)"
            }}>
              Documento Oficial
            </span>
          </div>
          
          <h3 style={{ fontWeight: "700", fontSize: "1.5rem", marginBottom: "0.75rem", color: "var(--text-main)" }}>
            Boletines de Estudiantes
          </h3>
          <p style={{ color: "var(--text-muted)", flexGrow: 1, marginBottom: "2rem", lineHeight: "1.6" }}>
            Genera los boletines de calificaciones por periodo. Optimizados para impresión con firmas de rectoría y escala de valoración.
          </p>
          
          <Link href="/dashboard/reportes/boletin" style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: "var(--color-primary)",
            color: "white",
            padding: "0.875rem 1.25rem",
            borderRadius: "0.75rem",
            fontWeight: "600",
            textDecoration: "none",
            transition: "opacity 0.2s"
          }}>
            <span>Ir a generar Boletín</span>
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Card: Planilla Consolidada */}
        <div className="card interactive-card" style={{ 
          display: "flex", 
          flexDirection: "column", 
          padding: "2rem",
          cursor: "pointer"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "1.25rem", borderRadius: "1rem", color: "var(--color-success)" }}>
              <FileSpreadsheet size={32} strokeWidth={1.5} />
            </div>
            <span style={{ 
              backgroundColor: "rgba(16, 185, 129, 0.1)", 
              color: "var(--color-success)", 
              padding: "0.25rem 0.75rem", 
              borderRadius: "2rem", 
              fontSize: "0.75rem", 
              fontWeight: "bold",
              border: "1px solid rgba(16, 185, 129, 0.2)"
            }}>
              Consolidado
            </span>
          </div>
          
          <h3 style={{ fontWeight: "700", fontSize: "1.5rem", marginBottom: "0.75rem", color: "var(--text-main)" }}>
            Planillas de Docentes
          </h3>
          <p style={{ color: "var(--text-muted)", flexGrow: 1, marginBottom: "2rem", lineHeight: "1.6" }}>
            Visualiza e imprime las planillas completas de notas de las clases y materias. Ideal para el control académico al cierre de periodo.
          </p>
          
          <Link href="/dashboard/reportes/planilla" style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: "var(--color-success)",
            color: "white",
            padding: "0.875rem 1.25rem",
            borderRadius: "0.75rem",
            fontWeight: "600",
            textDecoration: "none",
            transition: "opacity 0.2s"
          }}>
            <span>Ir a generar Planilla</span>
            <ArrowRight size={20} />
          </Link>
        </div>

      </div>
    </div>
  );
}
