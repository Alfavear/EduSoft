import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PasswordForm } from "./PasswordForm";
import { redirect } from "next/navigation";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Mi Perfil</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gestiona tu cuenta y configuración de seguridad</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Información de la Cuenta</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <span style={{ fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Nombre Completo</span>
              <p style={{ fontSize: '1rem', fontWeight: '500' }}>{user.name}</p>
            </div>
            <div>
              <span style={{ fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Usuario</span>
              <p style={{ fontSize: '1rem', fontWeight: '500' }}>{user.username}</p>
            </div>
            <div>
              <span style={{ fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Rol en el Sistema</span>
              <p style={{ fontSize: '1rem', fontWeight: '500' }}>{user.role}</p>
            </div>
          </div>
        </div>

        <PasswordForm userId={user.id} />
      </div>
    </div>
  );
}
