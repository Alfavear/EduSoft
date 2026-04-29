"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";

export function UserFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [role, setRole] = useState(searchParams.get("role") || "ALL");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");
      
      params.set("page", "1"); // Reset to page 1 on search
      router.push(`/dashboard/usuarios?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    const params = new URLSearchParams(searchParams.toString());
    if (newRole !== "ALL") params.set("role", newRole);
    else params.delete("role");
    
    params.set("page", "1");
    router.push(`/dashboard/usuarios?${params.toString()}`);
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
        <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Buscar por nombre o usuario..." 
          className="input-field" 
          style={{ paddingLeft: '2.5rem' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Filter size={18} color="var(--text-muted)" />
        <select 
          className="input-field" 
          style={{ width: 'auto', minWidth: '150px' }}
          value={role}
          onChange={(e) => handleRoleChange(e.target.value)}
        >
          <option value="ALL">Todos los roles</option>
          <option value="ADMIN">Administradores</option>
          <option value="TEACHER">Docentes</option>
          <option value="STUDENT">Estudiantes</option>
        </select>
      </div>
    </div>
  );
}
