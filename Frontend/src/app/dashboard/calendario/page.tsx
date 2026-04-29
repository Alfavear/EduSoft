import { Calendar as CalendarIcon, Clock } from "lucide-react";

export default function CalendarioPage() {
  return (
    <div className="container">
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "var(--text-dark)" }}>
          Calendario Institucional
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Cronograma de actividades y eventos académicos.
        </p>
      </header>

      <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", textAlign: "center", gap: "1.5rem" }}>
        <div style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", padding: "1.5rem", borderRadius: "50%", color: "var(--color-warning)" }}>
          <Clock size={48} />
        </div>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Módulo en Construcción</h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto" }}>
            Estamos trabajando para integrar un calendario interactivo que permitirá gestionar eventos, reuniones, entregas de notas y feriados escolares.
          </p>
        </div>
        <button className="btn btn-primary" style={{ opacity: 0.5, cursor: "not-allowed" }}>
          Próximamente
        </button>
      </div>
    </div>
  );
}
