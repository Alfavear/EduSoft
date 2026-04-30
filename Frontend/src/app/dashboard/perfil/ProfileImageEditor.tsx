"use client";

import { useState } from "react";
import { Camera, Upload, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProfileImage } from "./actions";
import { useSession } from "next-auth/react";

export function ProfileImageEditor({ userId, initialImage }: { userId: string, initialImage: string | null }) {
  const [image, setImage] = useState<string | null>(initialImage);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { update } = useSession();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        setMessage({ type: "error", text: "La imagen es demasiado grande. Máximo 1MB." });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        saveImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveImage = async (data: string | null) => {
    setLoading(true);
    const res = await updateProfileImage(userId, data);
    if (res.success) {
      await update({ image: data });
      setMessage({ type: "success", text: "Foto de perfil actualizada." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } else {
      setMessage({ type: "error", text: "Error al guardar la imagen." });
    }
    setLoading(false);
  };

  const removeImage = () => {
    setImage(null);
    saveImage(null);
  };

  return (
    <div className="card" style={{ padding: '2rem', maxWidth: '500px', display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--bg-app)', 
          border: '3px solid var(--color-primary)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-md)'
        }}>
          {image ? (
            <img src={image} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Camera size={48} color="var(--border-light)" />
          )}
        </div>
        
        <label style={{ 
          position: 'absolute', 
          bottom: '0', 
          right: '0', 
          backgroundColor: 'var(--color-primary)', 
          color: 'white', 
          width: '36px', 
          height: '36px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          cursor: 'pointer',
          border: '3px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          <Upload size={18} />
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </label>
      </div>

      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Foto de Perfil</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Sube una fotografía cuadrada para que otros puedan reconocerte fácilmente.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
            className="btn-secondary" 
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Cambiar Foto"}
          </button>
          
          {image && (
            <button 
              onClick={removeImage}
              style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}
              disabled={loading}
            >
              <Trash2 size={16} /> Eliminar
            </button>
          )}
        </div>

        {message.text && (
          <div style={{ 
            marginTop: '1rem', 
            fontSize: '0.875rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: message.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'
          }}>
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
