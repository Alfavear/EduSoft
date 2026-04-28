export default function Home() {
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <main className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>EduSoft</h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--primary)', marginBottom: '2rem' }}>
          Sistema de Gestión Escolar
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn-primary">Ingresar al Sistema</button>
        </div>
      </main>
    </div>
  );
}
