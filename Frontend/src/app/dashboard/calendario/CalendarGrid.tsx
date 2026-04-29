"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { EventType } from "@prisma/client";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  type: EventType;
  isGlobal: boolean;
}

export default function CalendarGrid({ initialEvents }: { initialEvents: CalendarEvent[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const eventTypeColors: Record<EventType, string> = {
    MEETING: "#3b82f6",
    BULLETIN_DELIVERY: "#10b981",
    PEDAGOGICAL_DAY: "#f59e0b",
    HOLIDAY: "#ef4444",
    OTHER: "#64748b"
  };

  const renderDays = () => {
    const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '1rem', border: '1px solid var(--border-light)', backgroundColor: '#f9fafb' }}></div>);
    }

    // Actual days
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = initialEvents.filter(e => {
        const eDate = new Date(e.startDate);
        return eDate.getDate() === day && eDate.getMonth() === currentDate.getMonth() && eDate.getFullYear() === currentDate.getFullYear();
      });

      days.push(
        <div key={day} style={{ 
          padding: '0.5rem', 
          border: '1px solid var(--border-light)', 
          minHeight: '120px', 
          backgroundColor: '#fff',
          position: 'relative'
        }}>
          <span style={{ fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{day}</span>
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {dayEvents.map(event => (
              <div 
                key={event.id} 
                onClick={() => setSelectedEvent(event)}
                style={{ 
                  backgroundColor: `${eventTypeColors[event.type]}`, 
                  color: '#fff', 
                  fontSize: '0.7rem', 
                  padding: '0.2rem 0.4rem', 
                  borderRadius: '0.25rem', 
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="card" style={{ padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={prevMonth} className="btn-secondary" style={{ padding: '0.5rem' }}><ChevronLeft size={20} /></button>
          <button onClick={nextMonth} className="btn-secondary" style={{ padding: '0.5rem' }}><ChevronRight size={20} /></button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderCollapse: 'collapse' }}>
        {dayNames.map(day => (
          <div key={day} style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#f3f4f6', border: '1px solid var(--border-light)' }}>
            {day}
          </div>
        ))}
        {renderDays()}
      </div>

      {selectedEvent && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setSelectedEvent(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>{selectedEvent.title}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{selectedEvent.description || "Sin descripción adicional."}</p>
            <div style={{ fontSize: '0.875rem' }}>
              <strong>Fecha:</strong> {new Date(selectedEvent.startDate).toLocaleDateString('es-CO')}
              <br />
              <strong>Tipo:</strong> {selectedEvent.type}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
