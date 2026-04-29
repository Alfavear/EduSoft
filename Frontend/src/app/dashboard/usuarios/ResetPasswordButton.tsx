"use client";

import { useState } from "react";
import { Key } from "lucide-react";
import { resetPassword } from "./actions";

export function ResetPasswordButton({ userId }: { userId: string }) {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (!confirm("¿Estás seguro de que deseas restablecer la contraseña de este usuario? Volverá a ser su documento de identidad.")) {
      return;
    }

    setIsResetting(true);
    const res = await resetPassword(userId);
    
    if (res.success) {
      alert("Contraseña restablecida exitosamente.");
    } else {
      alert(res.error || "Error al restablecer la contraseña.");
    }
    setIsResetting(false);
  };

  return (
    <button 
      onClick={handleReset} 
      disabled={isResetting}
      title="Restablecer Contraseña"
      style={{ 
        color: 'var(--color-warning)', 
        background: 'none', 
        border: 'none', 
        cursor: isResetting ? 'not-allowed' : 'pointer',
        opacity: isResetting ? 0.5 : 1
      }}
    >
      <Key size={18} />
    </button>
  );
}
