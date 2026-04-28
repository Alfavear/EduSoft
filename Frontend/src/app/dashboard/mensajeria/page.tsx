import { getMessages } from "./actions";
import { MessageCenter } from "./MessageCenter";

export default async function MensajeriaPage() {
  const [inbox, sent] = await Promise.all([
    getMessages('inbox'),
    getMessages('sent')
  ]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Centro de Mensajería</h1>
        <p style={{ color: 'var(--text-muted)' }}>Comunícate con docentes, estudiantes y administración</p>
      </div>

      <MessageCenter initialInbox={inbox} initialSent={sent} />
    </div>
  );
}
