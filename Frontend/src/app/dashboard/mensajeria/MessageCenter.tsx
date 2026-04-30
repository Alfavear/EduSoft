"use client";

import { useState, useEffect } from "react";
import { 
  Mail, 
  Send, 
  Inbox, 
  Paperclip, 
  Search, 
  User as UserIcon,
  ChevronRight,
  Plus,
  Trash2,
  X,
  CheckCircle,
  Users
} from "lucide-react";
import { getMessages, sendMessage, markAsRead, getRecipientsByContext } from "./actions";

export function MessageCenter({ initialInbox, initialSent }: { initialInbox: any[], initialSent: any[] }) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [inbox, setInbox] = useState(initialInbox);
  const [sent, setSent] = useState(initialSent);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Compose State
  const [targetIds, setTargetIds] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<{ name: string, type: string, data: string }[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    getRecipientsByContext().then(setRecipients);
  }, []);

  const handleSelectMessage = async (msg: any) => {
    setSelectedMessage(msg);
    if (!msg.isRead && activeTab === 'inbox') {
      await markAsRead(msg.id);
      setInbox(inbox.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachments(prev => [...prev, {
          name: file.name,
          type: file.type,
          data: reader.result as string
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSend = async () => {
    if (targetIds.length === 0 || !subject || !content) return;
    setIsSending(true);
    const result = await sendMessage({
      receiverIds: targetIds,
      subject,
      content,
      attachments
    });

    if (result.success) {
      alert(`Mensaje enviado con éxito a ${result.count} destinatario(s)`);
      setIsComposing(false);
      setTargetIds([]);
      setSubject("");
      setContent("");
      setAttachments([]);
      // Refresh sent messages
      const newSent = await getMessages('sent');
      setSent(newSent);
    } else {
      alert("Error al enviar el mensaje");
    }
    setIsSending(false);
  };

  const filteredRecipients = recipients.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = activeTab === 'inbox' ? inbox : sent;

  return (
    <div className="message-center-layout" style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '1rem', height: 'calc(100vh - 180px)' }}>
      {/* Sidebar List */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('inbox')}
            className={`btn-tab ${activeTab === 'inbox' ? 'active' : ''}`}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Inbox size={18} /> Entrada
          </button>
          <button 
            onClick={() => setActiveTab('sent')}
            className={`btn-tab ${activeTab === 'sent' ? 'active' : ''}`}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Send size={18} /> Enviados
          </button>
        </div>

        <div style={{ padding: '1rem' }}>
           <button onClick={() => setIsComposing(true)} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
             <Plus size={18} /> Nuevo Mensaje
           </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {currentMessages.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No hay mensajes
            </div>
          ) : (
            currentMessages.map(msg => (
              <div 
                key={msg.id} 
                onClick={() => handleSelectMessage(msg)}
                style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid var(--border-light)', 
                  cursor: 'pointer',
                  backgroundColor: selectedMessage?.id === msg.id ? 'var(--bg-app)' : (msg.isRead || activeTab === 'sent' ? 'transparent' : 'rgba(59, 130, 246, 0.05)'),
                  borderLeft: (!msg.isRead && activeTab === 'inbox') ? '4px solid var(--color-primary)' : 'none',
                  display: 'flex',
                  gap: '0.75rem'
                }}
              >
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--border-light)', 
                  flexShrink: 0, 
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {(activeTab === 'inbox' ? msg.sender.image : msg.receiver.image) ? (
                    <img src={activeTab === 'inbox' ? msg.sender.image : msg.receiver.image} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <UserIcon size={20} color="var(--text-muted)" />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', gap: '0.5rem' }}>
                     <span style={{ fontWeight: 'bold', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                       {activeTab === 'inbox' ? `${msg.sender.teacherProfile?.firstName || msg.sender.studentProfile?.firstName || msg.sender.username} ${msg.sender.teacherProfile?.lastName || msg.sender.studentProfile?.lastName || ""}` : `Para: ${msg.receiver.teacherProfile?.firstName || msg.receiver.studentProfile?.firstName || msg.receiver.username}`}
                     </span>
                     <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                       {new Date(msg.createdAt).toLocaleDateString()}
                     </span>
                  </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: selectedMessage?.id === msg.id ? '700' : '600', 
                  color: 'var(--text-main)',
                  marginBottom: '0.25rem'
                }}>
                  {msg.subject}
                </div>
                <div style={{ 
                  fontSize: '0.8125rem', 
                  color: 'var(--text-muted)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: '1.4'
                }}>
                  {msg.content}
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>


      {/* Message Content */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedMessage ? (
          <>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>{selectedMessage.subject}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ 
                     width: '40px', 
                     height: '40px', 
                     borderRadius: '50%', 
                     backgroundColor: 'var(--color-primary)', 
                     display: 'flex', 
                     alignItems: 'center', 
                     justifyContent: 'center', 
                     color: 'white',
                     overflow: 'hidden'
                   }}>
                     {selectedMessage.sender.image ? (
                       <img src={selectedMessage.sender.image} alt="Sender" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     ) : (
                       <UserIcon size={20} />
                     )}
                   </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>
                      {selectedMessage.sender.teacherProfile?.firstName || selectedMessage.sender.studentProfile?.firstName || selectedMessage.sender.username} {selectedMessage.sender.teacherProfile?.lastName || selectedMessage.sender.studentProfile?.lastName || ""}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </div>
                  </div>
               </div>
            </div>
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {selectedMessage.content}

              {selectedMessage.attachments.length > 0 && (
                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                   <p style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '1rem' }}>Adjuntos ({selectedMessage.attachments.length})</p>
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                      {selectedMessage.attachments.map((att: any) => (
                        <a 
                          key={att.id} 
                          href={att.data} 
                          download={att.name}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            padding: '0.5rem 1rem', 
                            backgroundColor: 'var(--bg-app)', 
                            borderRadius: 'var(--radius)',
                            fontSize: '0.875rem',
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            border: '1px solid var(--border-light)'
                          }}
                        >
                          <Paperclip size={14} /> {att.name}
                        </a>
                      ))}
                   </div>
                </div>
              )}
            </div>
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '1rem' }}>
               <button className="btn-secondary" style={{ flex: 1 }}>Responder</button>
               <button className="btn-secondary" style={{ flex: 1 }}>Reenviar</button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <Mail size={64} opacity={0.1} />
            <p>Selecciona un mensaje para leerlo</p>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {isComposing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '800px', maxHeight: '90vh', display: 'grid', gridTemplateColumns: '300px 1fr', overflow: 'hidden' }}>
            {/* Recipient Selector */}
            <div style={{ borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
               <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Destinatarios</h3>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      className="input-field" 
                      placeholder="Buscar..." 
                      style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }} 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                     <button onClick={() => setTargetIds(recipients.filter(r => r.type === 'STUDENT').map(r => r.id))} className="btn-secondary" style={{ fontSize: '0.625rem', padding: '0.25rem 0.5rem' }}>Todos Estudiantes</button>
                     <button onClick={() => setTargetIds(recipients.filter(r => r.type === 'TEACHER').map(r => r.id))} className="btn-secondary" style={{ fontSize: '0.625rem', padding: '0.25rem 0.5rem' }}>Todos Docentes</button>
                  </div>
               </div>
               <div style={{ flex: 1, overflowY: 'auto' }}>
                  {filteredRecipients.map(r => (
                    <div 
                      key={r.id} 
                      onClick={() => setTargetIds(prev => prev.includes(r.id) ? prev.filter(id => id !== r.id) : [...prev, r.id])}
                      style={{ 
                        padding: '0.75rem 1rem', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem',
                        backgroundColor: targetIds.includes(r.id) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        borderBottom: '1px solid var(--border-light)',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        backgroundColor: r.type === 'ADMIN' ? 'var(--color-purple)' : r.type === 'TEACHER' ? 'var(--color-teal)' : 'var(--color-primary)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'white',
                        overflow: 'hidden',
                        flexShrink: 0,
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {r.image ? (
                          <img src={r.image} alt="Recipient" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          r.name.charAt(r.name.indexOf(':') + 2).toUpperCase()
                        )}
                      </div>
                      <div style={{ fontSize: '0.875rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                      {targetIds.includes(r.id) && <CheckCircle size={16} color="var(--color-primary)" />}
                    </div>
                  ))}
               </div>
            </div>

            {/* Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontWeight: 'bold' }}>Nuevo Mensaje</h3>
                  <button onClick={() => setIsComposing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
               </div>
               <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>ASUNTO</label>
                    <input className="input-field" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="¿De qué trata este mensaje?" />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>CONTENIDO</label>
                    <textarea 
                      className="input-field" 
                      style={{ flex: 1, resize: 'none', paddingTop: '1rem' }} 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Escribe tu mensaje aquí..."
                    ></textarea>
                  </div>

                  {/* Attachments List */}
                  {attachments.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {attachments.map((att, i) => (
                        <div key={i} style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                           <Paperclip size={12} /> {att.name}
                           <button onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
               <div style={{ padding: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <Paperclip size={18} /> Adjuntar
                      <input type="file" multiple style={{ display: 'none' }} onChange={handleFileChange} />
                    </label>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {targetIds.length} destinatarios seleccionados
                    </div>
                  </div>
                  <button 
                    onClick={handleSend} 
                    className="btn-primary" 
                    disabled={isSending || targetIds.length === 0}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem' }}
                  >
                    {isSending ? "Enviando..." : <><Send size={18} /> Enviar</>}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .btn-tab {
          background: none;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          color: var(--text-muted);
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .btn-tab.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}
