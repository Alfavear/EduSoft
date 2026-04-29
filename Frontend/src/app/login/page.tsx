"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, User, AlertCircle, Info, X } from "lucide-react";
import { createResetRequest } from "./actions";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales inválidas. Por favor intente de nuevo.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f8fafc',
      padding: '1rem'
    }}>
      <div className="card" style={{ 
        display: 'flex', 
        width: '100%', 
        maxWidth: '1000px', 
        padding: '0', 
        overflow: 'hidden',
        minHeight: '600px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Left Side: Form */}
        <div style={{ 
          flex: '1', 
          padding: '3rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '0.75rem', borderRadius: '1rem' }}>
              <GraduationCap size={32} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--color-primary)', letterSpacing: '-1px' }}>EduSoft</h1>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Bienvenido de nuevo</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Por favor, ingrese sus credenciales para acceder.</p>

          {error && (
            <div style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: 'var(--color-danger)', 
              padding: '1rem', 
              borderRadius: '0.75rem', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.875rem'
            }}>
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Usuario o Correo"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '3rem' }}
                required
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="Contraseña"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '3rem' }}
                required
              />
            </div>

            <button 
              type="button" 
              onClick={() => setIsResetModalOpen(true)}
              style={{ 
                alignSelf: 'flex-start', 
                background: 'none', 
                border: 'none', 
                color: 'var(--color-primary)', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                cursor: 'pointer' 
              }}
            >
              ¿Olvidó su contraseña?
            </button>

            <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1rem', fontWeight: 'bold', marginTop: '1rem' }}>
              Iniciar Sesión
            </button>
          </form>

          <p style={{ marginTop: '3rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            EduSoft v2.0 - Sistema de Gestión Escolar Integral
          </p>
        </div>

        {/* Right Side: Illustration */}
        <div style={{ 
          flex: '1.2', 
          backgroundColor: 'rgba(59, 130, 246, 0.05)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute', 
            width: '140%', 
            height: '140%', 
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            top: '-20%',
            right: '-20%'
          }}></div>
          
          <img 
            src="/school_login_illustration.png" 
            alt="EduSoft Illustration" 
            style={{ width: '90%', height: 'auto', zIndex: 1, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }} 
          />
        </div>
      </div>

      {/* Reset Password Modal */}
      {isResetModalOpen && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000, 
          backdropFilter: 'blur(8px)',
          padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', position: 'relative' }}>
            <button 
              onClick={() => { setIsResetModalOpen(false); setResetSuccess(false); }} 
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={24} />
            </button>

            {!resetSuccess ? (
              <>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Restablecer Contraseña</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                  Ingrese sus datos de identificación para solicitar el restablecimiento de su cuenta.
                </p>

                <form action={async (formData) => {
                  await createResetRequest(formData);
                  setResetSuccess(true);
                }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Tipo de Identificación</label>
                    <select name="documentType" className="input-field" required>
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="TI">Tarjeta de Identidad</option>
                      <option value="RC">Registro Civil</option>
                      <option value="CE">Cédula de Extranjería</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Número de Identificación</label>
                    <input name="documentId" type="text" required className="input-field" placeholder="Ingrese su documento" />
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
                    Enviar Solicitud
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  color: 'var(--color-success)', 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1.5rem' 
                }}>
                  <Info size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Solicitud Enviada</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
                  Su solicitud ha sido enviada al área administrativa. Una vez aprobada, su usuario se restablecerá a <strong>nombre.apellido</strong> y su contraseña será su <strong>número de identificación</strong>.
                </p>
                <button 
                  onClick={() => setIsResetModalOpen(false)} 
                  className="btn-primary" 
                  style={{ width: '100%' }}
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
