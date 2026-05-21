(function () {
// app-frame.jsx — Woba Clara App phone frame components for the simulator

// ── Inline icon helper ──────────────────────────────────────────────────────
function AppI({ n, size = 16, c = 'currentColor', sw = 1.9 }) {
  const p = {
    sparkle:      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>,
    send:         <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill={c} stroke="none"/></>,
    mic:          <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0014 0"/><line x1="12" y1="21" x2="12" y2="17"/></>,
    'chevron-l':  <polyline points="15 18 9 12 15 6"/>,
    edit:         <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    clock:        <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    calendar:     <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    check:        <polyline points="20 6 9 17 4 12"/>,
    info:         <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    'map-pin':    <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
    gift:         <><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></>,
    rsvp:         <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
    location:     <><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></>,
    voice:        <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {p[n] || null}
    </svg>
  );
}

// ── iOS phone shell ─────────────────────────────────────────────────────────
function AppPhone({ children }) {
  return (
    <div style={{
      width: 393, height: 852,
      borderRadius: 54, overflow: 'hidden',
      background: '#fff',
      border: '10px solid #1c1c1e',
      boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3), inset 0 0 0 1px #3a3a3c',
      position: 'relative',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* glass sheen */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 46,
        pointerEvents: 'none', zIndex: 60,
        boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.10)',
      }}/>
      {/* Dynamic Island */}
      <div style={{
        position: 'absolute', top: 12, left: '50%',
        transform: 'translateX(-50%)',
        width: 126, height: 37,
        background: '#000', borderRadius: 999,
        zIndex: 65,
      }}/>
      {children}
    </div>
  );
}

// ── iOS status bar ──────────────────────────────────────────────────────────
function AppStatusBar() {
  return (
    <div style={{
      flexShrink: 0, height: 54,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 28px 0',
      background: '#fff', position: 'relative', zIndex: 10,
    }}>
      <span style={{
        fontFamily: '-apple-system,"SF Pro Text",system-ui',
        fontWeight: 590, fontSize: 15, color: '#000',
      }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 1 }}>
        {/* signal */}
        <svg width="17" height="12" viewBox="0 0 17 12">
          <rect x="0" y="8" width="3" height="4" rx="0.7" fill="#000"/>
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.7" fill="#000"/>
          <rect x="9" y="3" width="3" height="9" rx="0.7" fill="#000"/>
          <rect x="13.5" y="0" width="3" height="12" rx="0.7" fill="#000"/>
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12">
          <path d="M8 4C10 4 11.8 4.8 13.1 6.1L14 5.2C12.5 3.7 10.4 2.8 8 2.8S3.5 3.7 2 5.2L2.9 6.1C4.2 4.8 6 4 8 4Z" fill="#000"/>
          <path d="M8 7.2C9.2 7.2 10.2 7.6 11 8.4L11.9 7.5C10.8 6.5 9.5 5.9 8 5.9S5.2 6.5 4.1 7.5L5 8.4C5.8 7.6 6.8 7.2 8 7.2Z" fill="#000"/>
          <circle cx="8" cy="11" r="1.5" fill="#000"/>
        </svg>
        {/* battery */}
        <svg width="25" height="12" viewBox="0 0 25 12">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.2" stroke="#000" strokeOpacity="0.35" fill="none"/>
          <rect x="2" y="2" width="17" height="8" rx="2" fill="#000"/>
          <path d="M23 4V8C23.8 7.6 24.4 6.9 24.4 6C24.4 5.1 23.8 4.4 23 4Z" fill="#000" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ── Clara agent header ──────────────────────────────────────────────────────
function AppClaraHeader({ onNew }) {
  return (
    <div style={{
      flexShrink: 0, padding: '4px 12px 8px',
      display: 'flex', alignItems: 'center', gap: 8,
      background: '#fff',
    }}>
      <div style={{ flex: 1 }}/>
      <button onClick={onNew} title="Nova conversa" style={{
        width: 36, height: 36, borderRadius: 999, border: 0,
        background: 'rgba(0,0,0,.06)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <AppI n="edit" size={16} c="#000"/>
      </button>
      <button title="Histórico" style={{
        width: 36, height: 36, borderRadius: 999, border: 0,
        background: 'rgba(0,0,0,.06)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <AppI n="clock" size={16} c="#000"/>
      </button>
    </div>
  );
}

// ── Empty / greeting state ──────────────────────────────────────────────────
const APP_CHIPS = [
  'Onde trabalhar hoje?', 'Checar minha reserva',
  'Sala para reunião', 'Estender minha reserva',
  'Lugar calmo e focado', 'Preciso de suporte',
];

const APP_REC = [
  { tag: 'Perto de você', tc: '#16704a', title: 'Urbano 146 disponível', desc: '1,5 km · 3 cadeiras · dentro da política', action: 'Onde trabalhar hoje?' },
  { tag: 'Amanhã, 9h',   tc: '#1a5fbd', title: 'Praça Offices — amanhã', desc: 'Link de acesso e QR code prontos', action: 'Checar minha reserva' },
  { tag: 'Esta semana',  tc: '#7c3aed', title: 'Sala para reunião de produto', desc: 'Time de 5 · sala livre na quinta', action: 'Sala para reunião' },
  { tag: 'Hoje, 14h',    tc: '#b45309', title: 'Reserva termina em breve', desc: 'Disponibilidade até 16h · +2 créditos', action: 'Estender minha reserva' },
];

function AppClaraEmpty({ onChip }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ padding: '20px 22px 16px' }}>
        <div style={{
          fontFamily: '"DM Sans",sans-serif', fontWeight: 800,
          fontSize: 26, letterSpacing: '-0.05em', lineHeight: 1.1,
          color: '#000', marginBottom: 8,
        }}>Olá, Sara. Em que posso te ajudar?</div>
        <div style={{
          fontFamily: '"Host Grotesk",sans-serif', fontSize: 14,
          color: '#5c5c5c', lineHeight: 1.45, marginBottom: 20,
        }}>Posso reservar espaços, checar reservas, organizar reuniões e muito mais.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {APP_CHIPS.map((lbl, i) => (
            <button key={i} onClick={() => onChip?.(lbl)} style={{
              border: '1px solid #dedad4', background: '#fff', borderRadius: 999,
              padding: '8px 14px', cursor: 'pointer',
              fontFamily: '"DM Sans",sans-serif', fontWeight: 600,
              fontSize: 13, color: '#111', letterSpacing: '-0.1px',
              boxShadow: '0 2px 6px -2px rgba(0,0,0,.06)',
            }}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* Recommendation cards */}
      <div style={{ flexShrink: 0, paddingBottom: 8 }}>
        <div style={{
          fontFamily: '"DM Sans",sans-serif', fontWeight: 600,
          fontSize: 10.5, letterSpacing: '.5px', textTransform: 'uppercase',
          color: '#9a9490', padding: '0 22px 8px',
        }}>Clara pode te ajudar com</div>
        <div style={{
          display: 'flex', gap: 10, overflowX: 'auto',
          padding: '2px 22px 12px',
          scrollSnapType: 'x proximity',
          WebkitOverflowScrolling: 'touch',
        }}>
          {APP_REC.map((r, i) => (
            <button key={i} onClick={() => onChip?.(r.action)} style={{
              flex: '0 0 auto', scrollSnapAlign: 'start',
              width: 182, textAlign: 'left',
              background: '#fff', border: '1px solid #e8e3db',
              borderRadius: 20, padding: '12px',
              boxShadow: '0 4px 14px -4px rgba(0,0,0,.07)',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                display: 'inline-flex', padding: '3px 8px', borderRadius: 999,
                background: r.tc + '18', marginBottom: 8, alignSelf: 'flex-start',
              }}>
                <span style={{
                  fontFamily: '"DM Sans",sans-serif', fontWeight: 700,
                  fontSize: 10, color: r.tc,
                }}>{r.tag}</span>
              </div>
              <div style={{
                fontFamily: '"DM Sans",sans-serif', fontWeight: 700,
                fontSize: 12.5, color: '#000', marginBottom: 4,
              }}>{r.title}</div>
              <div style={{
                fontFamily: '"Host Grotesk",sans-serif', fontSize: 11.5,
                color: '#5c5c5c', lineHeight: 1.4, flex: 1,
              }}>{r.desc}</div>
              <div style={{
                marginTop: 10, background: '#111', borderRadius: 999,
                padding: '6px 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                fontFamily: '"DM Sans",sans-serif', fontWeight: 700,
                fontSize: 11.5, color: '#fff',
              }}>
                <AppI n="sparkle" size={10} c="#f9e10d" sw={2.2}/>
                Pedir à Clara
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Message bubbles ─────────────────────────────────────────────────────────
function ClaraBotMsg({ children }) {
  return (
    <div style={{ maxWidth: '86%', alignSelf: 'flex-start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <div style={{
          width: 20, height: 20, borderRadius: 7, background: '#111',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <AppI n="sparkle" size={10} c="#f9e10d" sw={2.2}/>
        </div>
        <span style={{
          fontFamily: '"DM Sans",sans-serif', fontWeight: 700,
          fontSize: 11, color: '#5c5c5c',
        }}>Clara</span>
      </div>
      <div style={{
        padding: '10px 14px',
        borderRadius: '4px 16px 16px 16px',
        background: '#fff', color: '#000',
        border: '1px solid #e0dbd3',
        fontFamily: '"Host Grotesk",sans-serif', fontSize: 14, lineHeight: 1.48,
        boxShadow: '0 2px 8px -2px rgba(0,0,0,.06)',
        display: 'inline-block',
      }}>{children}</div>
    </div>
  );
}

function ClaraUserMsg({ children }) {
  return (
    <div style={{ maxWidth: '84%', alignSelf: 'flex-end' }}>
      <div style={{
        padding: '10px 14px',
        borderRadius: '16px 16px 4px 16px',
        background: '#111', color: '#fff',
        fontFamily: '"Host Grotesk",sans-serif', fontSize: 14, lineHeight: 1.48,
        boxShadow: '0 2px 8px -2px rgba(0,0,0,.06)',
      }}>{children}</div>
    </div>
  );
}

// ── Space / room card ───────────────────────────────────────────────────────
function ClaraSpaceCard({ room }) {
  return (
    <div style={{
      flex: '0 0 auto', width: 195,
      background: '#fff', border: '1px solid #e8e3db',
      borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 2px 10px -2px rgba(0,0,0,.08)',
    }}>
      <div style={{ height: 86, overflow: 'hidden', background: '#f0eeea' }}>
        <img src={room.image} alt={room.name || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none'; }}/>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{
          fontFamily: '"DM Sans",sans-serif', fontWeight: 700,
          fontSize: 13.5, color: '#000', letterSpacing: '-0.1px', marginBottom: 1,
        }}>{room.name || room.coworking}</div>
        <div style={{
          fontFamily: '"Host Grotesk",sans-serif', fontSize: 11.5, color: '#5c5c5c',
        }}>{room.coworking}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
          <AppI n="calendar" size={11} c="#888"/>
          <span style={{ fontFamily: '"Host Grotesk",sans-serif', fontSize: 11, color: '#888' }}>
            {room.date} · {room.inicio || room.start} – {room.fim || room.end}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontFamily: '"Host Grotesk",sans-serif', fontSize: 12, color: '#888' }}>
            {room.credits} créditos
          </span>
          <button style={{
            background: '#111', color: '#fff', border: 0, borderRadius: 999,
            padding: '5px 12px', cursor: 'pointer',
            fontFamily: '"DM Sans",sans-serif', fontWeight: 700, fontSize: 11.5,
          }}>Reservar</button>
        </div>
      </div>
    </div>
  );
}

function ClaraRoomGroup({ rooms }) {
  return (
    <div style={{ alignSelf: 'flex-start', width: '100%', maxWidth: '100%' }}>
      <div style={{
        display: 'flex', gap: 10, overflowX: 'auto',
        padding: '4px 0 6px',
        WebkitOverflowScrolling: 'touch',
        scrollSnapType: 'x proximity',
      }}>
        {(rooms || []).map((r, i) => <ClaraSpaceCard key={r.id || i} room={r}/>)}
      </div>
    </div>
  );
}

// ── Quick replies / chips ───────────────────────────────────────────────────
function ClaraChips({ items, onPick }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '4px 0 6px', alignSelf: 'flex-start' }}>
      {(items || []).map((item, i) => (
        <button key={i} onClick={() => onPick?.(item)} style={{
          border: '1px solid #dedad4', background: '#fff', borderRadius: 999,
          padding: '8px 14px', cursor: 'pointer',
          fontFamily: '"DM Sans",sans-serif', fontWeight: 600,
          fontSize: 13, color: '#111', letterSpacing: '-0.1px',
          boxShadow: '0 2px 6px -2px rgba(0,0,0,.06)',
        }}>{item}</button>
      ))}
    </div>
  );
}

// ── Info card ───────────────────────────────────────────────────────────────
function ClaraInfoCard({ title, lines, action, accent }) {
  const col = accent || '#1a5fbd';
  return (
    <div style={{
      background: '#fff', border: '1px solid #e0dbd3',
      borderLeft: `3px solid ${col}`,
      borderRadius: '4px 16px 16px 16px',
      padding: '12px 14px',
      alignSelf: 'flex-start', maxWidth: '88%',
      fontFamily: '"Host Grotesk",sans-serif',
      boxShadow: '0 2px 8px -2px rgba(0,0,0,.06)',
    }}>
      {title && (
        <div style={{
          fontFamily: '"DM Sans",sans-serif', fontWeight: 700,
          fontSize: 13, color: '#000', marginBottom: 6,
        }}>{title}</div>
      )}
      {(lines || []).map((l, i) => (
        <div key={i} style={{ fontSize: 12.5, color: '#4b5563', marginBottom: 2 }}>{l}</div>
      ))}
      {action && (
        <div style={{ marginTop: 8, fontSize: 12.5, fontWeight: 700, color: col }}>{action}</div>
      )}
    </div>
  );
}

// ── App-screen / success card ───────────────────────────────────────────────
function ClaraSuccessCard({ title, lines, success }) {
  return (
    <div style={{
      background: success ? '#f0fdf4' : '#fff',
      border: `1px solid ${success ? '#86efac' : '#e0dbd3'}`,
      borderRadius: '4px 16px 16px 16px',
      padding: '12px 14px',
      alignSelf: 'flex-start', maxWidth: '88%',
      fontFamily: '"Host Grotesk",sans-serif',
      boxShadow: '0 2px 8px -2px rgba(0,0,0,.06)',
    }}>
      {success && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%', background: '#16a34a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AppI n="check" size={10} c="#fff" sw={2.5}/>
          </div>
          <span style={{
            fontFamily: '"DM Sans",sans-serif', fontWeight: 700,
            fontSize: 12, color: '#16a34a',
          }}>Confirmado</span>
        </div>
      )}
      {title && (
        <div style={{
          fontFamily: '"DM Sans",sans-serif', fontWeight: 700,
          fontSize: 13, color: '#000', marginBottom: 4,
        }}>{title}</div>
      )}
      {(lines || []).map((l, i) => (
        <div key={i} style={{ fontSize: 12.5, color: '#4b5563', marginBottom: 2 }}>{l}</div>
      ))}
    </div>
  );
}

// ── Ticket card ─────────────────────────────────────────────────────────────
function ClaraTicketCard({ id, severity, eta, status }) {
  const sevCol = { alta: '#dc2626', media: '#ea580c', baixa: '#16a34a' };
  const col = sevCol[severity] || '#6b7280';
  return (
    <div style={{
      background: '#fff', border: '1px solid #e0dbd3',
      borderRadius: '4px 16px 16px 16px',
      padding: '12px 14px',
      alignSelf: 'flex-start', maxWidth: '88%',
      fontFamily: '"Host Grotesk",sans-serif',
      boxShadow: '0 2px 8px -2px rgba(0,0,0,.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280' }}>{id}</span>
        {severity && (
          <span style={{
            fontSize: 11, fontWeight: 700, color: col,
            background: col + '18', padding: '2px 7px', borderRadius: 999,
          }}>{severity}</span>
        )}
      </div>
      {eta && <div style={{ fontSize: 12.5, color: '#4b5563', marginBottom: 2 }}>Previsão: {eta}</div>}
      {status && <div style={{ fontSize: 12.5, color: '#6b7280' }}>{status}</div>}
    </div>
  );
}

// ── Gift card ───────────────────────────────────────────────────────────────
function ClaraGiftCard({ emoji, big, small }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg,#fffbeb,#fef9c3)',
      border: '1px solid #fde68a',
      borderRadius: '4px 16px 16px 16px',
      padding: '14px 16px',
      alignSelf: 'flex-start', maxWidth: '88%',
      fontFamily: '"Host Grotesk",sans-serif',
      boxShadow: '0 2px 8px -2px rgba(0,0,0,.06)',
    }}>
      {emoji && <div style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</div>}
      {big && (
        <div style={{
          fontFamily: '"DM Sans",sans-serif', fontWeight: 800,
          fontSize: 15, color: '#000', marginBottom: 4,
        }}>{big}</div>
      )}
      {small && <div style={{ fontSize: 13, color: '#5c5c5c' }}>{small}</div>}
    </div>
  );
}

// ── RSVP card ───────────────────────────────────────────────────────────────
function ClaraRSVPCard({ items }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e0dbd3',
      borderRadius: '4px 16px 16px 16px',
      padding: '12px 14px',
      alignSelf: 'flex-start', maxWidth: '88%',
      fontFamily: '"Host Grotesk",sans-serif',
      boxShadow: '0 2px 8px -2px rgba(0,0,0,.06)',
    }}>
      <div style={{
        fontFamily: '"DM Sans",sans-serif', fontWeight: 700,
        fontSize: 12, color: '#9a9490', marginBottom: 8,
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>Confirmações</div>
      {(items || []).map((it, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 0',
          borderBottom: i < items.length - 1 ? '1px solid #f0eeea' : 'none',
        }}>
          <span style={{ fontSize: 13, color: '#000' }}>{it.name}</span>
          <span style={{
            fontSize: 11.5, fontWeight: 600,
            color: it.status === 'confirmado' ? '#16a34a' : it.status === 'recusado' ? '#dc2626' : '#9a9490',
          }}>{it.status}</span>
        </div>
      ))}
    </div>
  );
}

// ── Location card ───────────────────────────────────────────────────────────
function ClaraLocationCard({ title, address }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e0dbd3',
      borderLeft: '3px solid #16704a',
      borderRadius: '4px 16px 16px 16px',
      padding: '12px 14px',
      alignSelf: 'flex-start', maxWidth: '88%',
      fontFamily: '"Host Grotesk",sans-serif',
      boxShadow: '0 2px 8px -2px rgba(0,0,0,.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <AppI n="map-pin" size={13} c="#16704a"/>
        {title && (
          <span style={{
            fontFamily: '"DM Sans",sans-serif', fontWeight: 700,
            fontSize: 13, color: '#000',
          }}>{title}</span>
        )}
      </div>
      {address && <div style={{ fontSize: 12.5, color: '#4b5563' }}>{address}</div>}
    </div>
  );
}

// ── Voice message ────────────────────────────────────────────────────────────
function ClaraVoiceMsg({ side, duration }) {
  const isUser = side === 'user';
  return (
    <div style={{ maxWidth: '72%', alignSelf: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={{
        padding: '10px 14px',
        borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
        background: isUser ? '#111' : '#fff',
        border: isUser ? 'none' : '1px solid #e0dbd3',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 2px 8px -2px rgba(0,0,0,.06)',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: isUser ? 'rgba(255,255,255,.15)' : '#f5f4f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AppI n="voice" size={14} c={isUser ? '#fff' : '#111'} sw={1.7}/>
        </div>
        <div style={{ flex: 1, height: 2, background: isUser ? 'rgba(255,255,255,.3)' : '#dedad4', borderRadius: 999 }}>
          <div style={{ width: '55%', height: '100%', background: isUser ? '#fff' : '#111', borderRadius: 999 }}/>
        </div>
        <span style={{
          fontFamily: '"Host Grotesk",sans-serif', fontSize: 12,
          color: isUser ? 'rgba(255,255,255,.7)' : '#9a9490',
        }}>{duration}</span>
      </div>
    </div>
  );
}

// ── Day divider ──────────────────────────────────────────────────────────────
function ClaraDivider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', margin: '4px 0' }}>
      <div style={{ flex: 1, height: 1, background: '#ede9e2' }}/>
      <span style={{
        fontFamily: '"Host Grotesk",sans-serif',
        fontSize: 11.5, color: '#9a9490', fontWeight: 500,
      }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: '#ede9e2' }}/>
    </div>
  );
}

// ── Flow reply ───────────────────────────────────────────────────────────────
function ClaraFlowReply({ label }) {
  return (
    <div style={{ alignSelf: 'flex-end', maxWidth: '84%' }}>
      <div style={{
        padding: '8px 14px',
        borderRadius: '16px 16px 4px 16px',
        background: '#111', color: '#fff',
        fontFamily: '"Host Grotesk",sans-serif', fontSize: 13.5, lineHeight: 1.4,
        display: 'flex', alignItems: 'center', gap: 7,
      }}>
        <AppI n="check" size={12} c="#5fd07a" sw={2.5}/>
        {label}
      </div>
    </div>
  );
}

// ── Typing indicator ─────────────────────────────────────────────────────────
function ClaraTyping() {
  return (
    <div style={{ alignSelf: 'flex-start', maxWidth: '84%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <div style={{
          width: 20, height: 20, borderRadius: 7, background: '#111',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AppI n="sparkle" size={10} c="#f9e10d" sw={2.2}/>
        </div>
        <span style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 700, fontSize: 11, color: '#5c5c5c' }}>Clara</span>
      </div>
      <div style={{
        padding: '12px 16px',
        borderRadius: '4px 16px 16px 16px',
        background: '#fff', border: '1px solid #e0dbd3',
        display: 'flex', gap: 5, alignItems: 'center',
      }}>
        <style>{`@keyframes cdot{0%,80%,100%{transform:scale(.7);opacity:.45}40%{transform:scale(1.1);opacity:1}}`}</style>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%', background: '#bab6af',
            animation: `cdot 1.2s ${i * 0.2}s ease-in-out infinite`,
          }}/>
        ))}
      </div>
    </div>
  );
}

// ── Input bar ────────────────────────────────────────────────────────────────
function AppClaraInput({ value, onChange, onSend }) {
  const hasText = value.trim().length > 0;
  return (
    <div style={{
      flexShrink: 0,
      padding: '8px 12px 22px',
      background: '#fff', borderTop: '1px solid #f0eeea',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#fff', border: '1px solid #dedad4', borderRadius: 999,
        padding: '10px 10px 10px 18px',
        boxShadow: '0 6px 20px -6px rgba(0,0,0,.12)',
      }}>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onSend(); } }}
          placeholder="Conta o que você precisa…"
          style={{
            flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent',
            fontFamily: '"Host Grotesk",sans-serif', fontSize: 14, color: '#000',
          }}
        />
        <button onClick={onSend} style={{
          width: 40, height: 40, borderRadius: 999, border: 0,
          background: hasText ? '#f9e10d' : 'rgba(0,0,0,.06)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'background .18s',
        }}>
          {hasText
            ? <AppI n="send" size={16} c="#000" sw={2.2}/>
            : <AppI n="mic" size={17} c="#9a9490" sw={1.8}/>
          }
        </button>
      </div>
    </div>
  );
}

// ── Exports ───────────────────────────────────────────────────────────────────
window.AppPhone       = AppPhone;
window.AppStatusBar   = AppStatusBar;
window.AppClaraHeader = AppClaraHeader;
window.AppClaraEmpty  = AppClaraEmpty;
window.AppClaraInput  = AppClaraInput;
window.ClaraBotMsg    = ClaraBotMsg;
window.ClaraUserMsg   = ClaraUserMsg;
window.ClaraSpaceCard = ClaraSpaceCard;
window.ClaraRoomGroup = ClaraRoomGroup;
window.ClaraChips     = ClaraChips;
window.ClaraInfoCard  = ClaraInfoCard;
window.ClaraSuccessCard = ClaraSuccessCard;
window.ClaraTicketCard  = ClaraTicketCard;
window.ClaraGiftCard    = ClaraGiftCard;
window.ClaraRSVPCard    = ClaraRSVPCard;
window.ClaraLocationCard = ClaraLocationCard;
window.ClaraVoiceMsg    = ClaraVoiceMsg;
window.ClaraDivider   = ClaraDivider;
window.ClaraFlowReply = ClaraFlowReply;
window.ClaraTyping    = ClaraTyping;

})();
