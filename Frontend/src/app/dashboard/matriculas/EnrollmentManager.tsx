"use client";

import { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  FileCheck, 
  AlertTriangle, 
  ArrowRightCircle, 
  ClipboardList,
  GraduationCap
} from "lucide-react";
import { EnrollmentList } from "./EnrollmentList";
import { PromotionManager } from "./PromotionManager";
import { RemedialManager } from "./RemedialManager";

export function EnrollmentManager({ 
  initialEnrollments, 
  courses, 
  academicYears, 
  activeYearId 
}: { 
  initialEnrollments: any[], 
  courses: any[], 
  academicYears: any[],
  activeYearId?: string
}) {
  const [activeTab, setActiveTab] = useState("list");
  const [filters, setFilters] = useState({
    academicYearId: activeYearId || "",
    courseId: "",
    status: ""
  });

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab("list")}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === "list" ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === "list" ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === "list" ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Users size={18} /> Registro de Matrículas
        </button>
        <button 
          onClick={() => setActiveTab("promotion")}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === "promotion" ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === "promotion" ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === "promotion" ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <GraduationCap size={18} /> Promoción y Cierre
        </button>
        <button 
          onClick={() => setActiveTab("remedial")}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === "remedial" ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === "remedial" ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === "remedial" ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <AlertTriangle size={18} /> Nivelatorios (Habilitaciones)
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
        {activeTab === "list" && (
          <EnrollmentList 
            initialEnrollments={initialEnrollments} 
            courses={courses} 
            academicYears={academicYears}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        
        {activeTab === "promotion" && (
          <PromotionManager 
            academicYears={academicYears} 
            courses={courses} 
            activeYearId={activeYearId} 
          />
        )}

        {activeTab === "remedial" && (
          <RemedialManager />
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
