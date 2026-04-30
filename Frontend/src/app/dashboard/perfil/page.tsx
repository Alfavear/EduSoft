import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PasswordForm } from "./PasswordForm";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileImageEditor } from "./ProfileImageEditor";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id }
  });

  if (!dbUser) redirect("/login");

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Mi Perfil</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gestiona tu cuenta y configuración de seguridad</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <ProfileImageEditor userId={dbUser.id} initialImage={dbUser.image} />
        
        <div className="card" style={{ padding: '2rem', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Información de la Cuenta</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <span style={{ fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Nombre Completo</span>
              <p style={{ fontSize: '1rem', fontWeight: '500' }}>{session.user.name}</p>
            </div>
            <div>
              <span style={{ fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Usuario</span>
              <p style={{ fontSize: '1rem', fontWeight: '500' }}>{dbUser.username}</p>
            </div>
            <div>
              <span style={{ fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Rol en el Sistema</span>
              <p style={{ fontSize: '1rem', fontWeight: '500' }}>{dbUser.role}</p>
            </div>
          </div>
        </div>

        <PasswordForm userId={dbUser.id} />
      </div>
    </div>
  );
}
