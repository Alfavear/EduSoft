"use client";

export default function HorarioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <h2 style={{ color: "var(--color-danger)", marginBottom: "1rem" }}>
        Error cargando el horario
      </h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
        {error.message || "Error de servidor desconocido"}
      </p>
      {error.digest && (
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
          Digest: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        style={{
          marginTop: "1.5rem",
          padding: "0.5rem 1.5rem",
          backgroundColor: "var(--color-primary)",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
        }}
      >
        Reintentar
      </button>
    </div>
  );
}
