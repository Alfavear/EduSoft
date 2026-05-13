"use client";

import { useState, useEffect } from "react";
import { Search, Filter, DollarSign, Calendar, User, School, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { getInvoices, registerPayment } from "./actions";

export function InvoiceList({ courses }: { courses: any[] }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    courseId: "",
    status: "",
    search: ""
  });
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    method: "CASH",
    reference: "",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [filters.courseId, filters.status]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await getInvoices({
        courseId: filters.courseId || undefined,
        status: filters.status || undefined
      });
      setInvoices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const studentName = `${inv.student.firstName} ${inv.student.lastName}`.toLowerCase();
    const searchMatch = studentName.includes(filters.search.toLowerCase());
    return searchMatch;
  });

  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    
    setSubmitting(true);
    try {
      await registerPayment({
        invoiceId: selectedInvoice.id,
        ...paymentData,
        date: new Date(paymentData.date)
      });
      setSelectedInvoice(null);
      setPaymentData({ amount: 0, method: "CASH", reference: "", date: new Date().toISOString().split('T')[0], notes: "" });
      fetchInvoices();
    } catch (error) {
      alert("Error al registrar el pago");
    } finally {
      setSubmitting(true);
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = status !== 'PAID' && new Date(dueDate) < new Date();
    
    if (isOverdue) {
      return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', fontWeight: 'bold' }}>VENCIDA</span>;
    }

    switch (status) {
      case 'PAID': return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', fontWeight: 'bold' }}>PAGADA</span>;
      case 'PARTIAL': return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', fontWeight: 'bold' }}>ABONADA</span>;
      default: return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)', fontWeight: 'bold', border: '1px solid var(--border-light)' }}>PENDIENTE</span>;
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selectedInvoice ? '1fr 400px' : '1fr', gap: '2rem' }}>
      <div className="card" style={{ padding: '2rem' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar estudiante..." 
              className="input-field"
              style={{ paddingLeft: '2.5rem' }}
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <select 
            className="input-field" 
            style={{ width: '180px' }}
            value={filters.courseId}
            onChange={e => setFilters({...filters, courseId: e.target.value})}
          >
            <option value="">Todos los Cursos</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select 
            className="input-field" 
            style={{ width: '180px' }}
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value})}
          >
            <option value="">Todos los Estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="PARTIAL">Abonadas</option>
            <option value="PAID">Pagadas</option>
            <option value="OVERDUE">Vencidas</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Estudiante / Curso</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Concepto</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Valor</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Pagado</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Vencimiento</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Estado</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center' }}>Cargando facturas...</td></tr>
              ) : filteredInvoices.map((inv) => {
                const totalPaid = inv.payments.reduce((sum: number, p: any) => sum + p.amount, 0);
                return (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: selectedInvoice?.id === inv.id ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600' }}>{inv.student.firstName} {inv.student.lastName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inv.student.course.name}</div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{inv.feeType.name}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>${inv.amount.toLocaleString()}</td>
                    <td style={{ padding: '1rem', color: 'var(--color-success)', fontWeight: '500' }}>
                      ${totalPaid.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                      {new Date(inv.dueDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {getStatusBadge(inv.status, inv.dueDate)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setPaymentData({ ...paymentData, amount: inv.amount - totalPaid });
                        }}
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!loading && filteredInvoices.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No se encontraron facturas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Side Panel */}
      {selectedInvoice && (
        <div className="card" style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '2rem', animation: 'slideInRight 0.3s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Registrar Pago</h3>
            <button onClick={() => setSelectedInvoice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Clock size={20} />
            </button>
          </div>

          <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Factura de:</p>
            <p style={{ fontWeight: 'bold' }}>{selectedInvoice.student.firstName} {selectedInvoice.student.lastName}</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>{selectedInvoice.feeType.name}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <span>Total:</span>
              <span style={{ fontWeight: 'bold' }}>${selectedInvoice.amount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: 'var(--color-danger)' }}>
              <span>Pendiente:</span>
              <span style={{ fontWeight: 'bold' }}>
                ${(selectedInvoice.amount - selectedInvoice.payments.reduce((sum: number, p: any) => sum + p.amount, 0)).toLocaleString()}
              </span>
            </div>
          </div>

          <form onSubmit={handleRegisterPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label">Monto del Abono</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold', color: 'var(--text-muted)' }}>$</span>
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ paddingLeft: '2rem' }}
                  value={paymentData.amount}
                  onChange={e => setPaymentData({...paymentData, amount: parseFloat(e.target.value)})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Método de Pago</label>
              <select 
                className="input-field"
                value={paymentData.method}
                onChange={e => setPaymentData({...paymentData, method: e.target.value})}
              >
                <option value="CASH">Efectivo</option>
                <option value="TRANSFER">Transferencia Bancaria</option>
                <option value="CARD">Tarjeta</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>
            <div>
              <label className="label">Referencia / Comprobante</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="N° de transacción o recibo"
                value={paymentData.reference}
                onChange={e => setPaymentData({...paymentData, reference: e.target.value})}
              />
            </div>
            <div>
              <label className="label">Fecha del Pago</label>
              <input 
                type="date" 
                className="input-field"
                value={paymentData.date}
                onChange={e => setPaymentData({...paymentData, date: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={submitting}>
              {submitting ? 'Registrando...' : 'Registrar Pago'}
            </button>
          </form>

          {selectedInvoice.payments.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-muted)' }}>Historial de Abonos</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedInvoice.payments.map((p: any) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>${p.amount.toLocaleString()}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(p.date).toLocaleDateString()} - {p.method}</div>
                    </div>
                    <CheckCircle2 size={16} color="var(--color-success)" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
