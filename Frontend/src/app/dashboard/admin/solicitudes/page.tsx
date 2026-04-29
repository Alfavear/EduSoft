import { getAllAccessRequests } from "../../clases/actions";
import { getResetRequests } from "../../../login/actions";
import { RequestManager } from "./RequestManager";
import { ResetRequestManager } from "./ResetRequestManager";
import { ClipboardList, Key } from "lucide-react";

export default async function SolicitudesPage() {
  const requests = await getAllAccessRequests();
  const resetRequests = await getResetRequests();

  return (
    <div className="container">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ClipboardList size={32} color="var(--color-primary)" />
          Centro de Solicitudes Administrativas
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Gestiona autorizaciones de notas y restablecimiento de credenciales.</p>
      </div>

      <div style={{ display: 'grid', gap: '3rem' }}>
        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList size={20} /> Solicitudes de Desbloqueo (Notas)
          </h2>
          <RequestManager initialRequests={requests} />
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={20} /> Solicitudes de Restablecimiento de Contraseña
          </h2>
          <ResetRequestManager initialRequests={resetRequests} />
        </section>
      </div>
    </div>
  );
}
