"use client";

import { useState } from "react";
import { changePassword } from "./actions";
import { KeyRound, Save } from "lucide-react";

export function PasswordForm({ userId }: { userId: string }) {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPass !== confirmPass) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    if (newPass.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    const res = await changePassword(userId, currentPass, newPass);

    if (res.success) {
      setSuccess("Contraseña actualizada exitosamente.");
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } else {
      setError(res.error || "Ocurrió un error.");
    }
    setIsLoading(false);
  };

  return (
    <div id="password-form" className="card" style={{ padding: '2rem', maxWidth: '500px' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
        <KeyRound color="var(--color-primary)" />
        Cambiar Contraseña
      </h2>

      {error && <div style={{ color: 'var(--color-danger)', backgroundColor: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'var(--color-success)', backgroundColor: 'rgba(16,185,129,0.1)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Contraseña Actual</label>
          <input 
            type="password" 
            value={currentPass} 
            onChange={e => setCurrentPass(e.target.value)} 
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
            required 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Nueva Contraseña</label>
          <input 
            type="password" 
            value={newPass} 
            onChange={e => setNewPass(e.target.value)} 
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
            required 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Confirmar Nueva Contraseña</label>
          <input 
            type="password" 
            value={confirmPass} 
            onChange={e => setConfirmPass(e.target.value)} 
            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }} 
            required 
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
          <Save size={20} />
          {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
        </button>
      </form>
    </div>
  );
}
