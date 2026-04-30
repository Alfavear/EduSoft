import { getUsers, getCourses } from "./actions";
import { UserForm } from "./UserForm";
import { Users as UsersIcon, Shield, GraduationCap, Briefcase, Trash2 } from "lucide-react";
import Link from "next/link";
import { ResetPasswordButton } from "./ResetPasswordButton";
import { UserFilters } from "./UserFilters";
import { Pagination } from "./Pagination";
import { Suspense } from "react";

export default async function UsuariosPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string, role?: string, page?: string }> 
}) {
  const { search, role, page } = await searchParams;
  const currentPage = parseInt(page || "1");
  
  const [{ users, totalCount, totalPages }, courses] = await Promise.all([
    getUsers({ 
      search, 
      role, 
      page: currentPage, 
      pageSize: 15 
    }), 
    getCourses()
  ]);

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Gestión de Usuarios</h1>
        <p style={{ color: 'var(--text-muted)' }}>Crea y administra cuentas de estudiantes, docentes y administrativos</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <UserForm courses={courses} />

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UsersIcon color="var(--color-purple)" />
              Listado de Usuarios ({totalCount})
            </h2>
          </div>

          <Suspense fallback={<div style={{ height: '52px' }} />}>
            <UserFilters />
          </Suspense>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-light)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Usuario</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Nombre Completo</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Rol</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Detalle</th>
                  <th style={{ padding: '1rem' }}></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          backgroundColor: 'var(--bg-app)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          overflow: 'hidden',
                          border: '1px solid var(--border-light)',
                          flexShrink: 0
                        }}>
                          {user.image ? (
                            <img src={user.image} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <UsersIcon size={16} color="var(--text-muted)" />
                          )}
                        </div>
                        <span style={{ fontWeight: '500' }}>{user.username}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {user.role === "STUDENT" ? `${user.studentProfile?.firstName} ${user.studentProfile?.lastName}` : 
                       user.role === "TEACHER" ? `${user.teacherProfile?.firstName} ${user.teacherProfile?.lastName}` : "Administrador"}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '1rem',
                        width: 'fit-content',
                        backgroundColor: user.role === 'ADMIN' ? 'rgba(139, 92, 246, 0.1)' : user.role === 'TEACHER' ? 'rgba(20, 184, 166, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: user.role === 'ADMIN' ? 'var(--color-purple)' : user.role === 'TEACHER' ? 'var(--color-teal)' : 'var(--color-primary)'
                      }}>
                        {user.role === 'ADMIN' && <Shield size={14} />}
                        {user.role === 'TEACHER' && <Briefcase size={14} />}
                        {user.role === 'STUDENT' && <GraduationCap size={14} />}
                        {user.role}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {user.role === "STUDENT" ? user.studentProfile?.course.name : "-"}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {user.role === "STUDENT" && (
                        <Link href={`/dashboard/admin/estudiantes/${user.studentProfile?.id}`} className="btn-secondary" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}>
                          Ver Notas
                        </Link>
                      )}
                      {user.role !== "ADMIN" && (
                        <ResetPasswordButton userId={user.id} />
                      )}
                      <button style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer' }} title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No se encontraron usuarios con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Suspense fallback={null}>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
