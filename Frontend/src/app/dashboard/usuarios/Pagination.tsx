"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/dashboard/usuarios?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
      <button 
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        className="btn-secondary"
        style={{ padding: '0.5rem', borderRadius: '0.5rem' }}
      >
        <ChevronLeft size={20} />
      </button>

      <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
        Página {currentPage} de {totalPages}
      </span>

      <button 
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="btn-secondary"
        style={{ padding: '0.5rem', borderRadius: '0.5rem' }}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
