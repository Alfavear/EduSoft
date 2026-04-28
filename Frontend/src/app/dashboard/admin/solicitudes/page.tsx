import { getAllAccessRequests } from "../../clases/actions";
import { RequestManager } from "./RequestManager";

export default async function SolicitudesPage() {
  const requests = await getAllAccessRequests();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Solicitudes de Desbloqueo</h1>
        <p style={{ color: 'var(--text-muted)' }}>Autoriza a docentes para subir notas fuera de tiempo en periodos cerrados</p>
      </div>

      <RequestManager initialRequests={requests} />
    </div>
  );
}
