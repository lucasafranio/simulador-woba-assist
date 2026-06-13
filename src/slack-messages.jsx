(function () {
// slack-messages.jsx — Block Kit-style message components for the Slack simulator
// Exposes: SlackMessage, SlackUserMessage, SlackSlashCmd, SlackActionsBlock,
//          SlackDivider, SlackTyping, SlackModal, SlackInfoBlock, SlackRoomBlock,
//          SlackRSVPBlock, SlackTicketBlock, SlackGiftBlock, SlackFlowReply,
//          SlackAppScreenBlock, SlackLocationBlock, SlackVoiceBlock

/* ─── Text renderer — **bold** and `code` ─── */
function renderSlackText(s) {
  if (typeof s !== 'string') return s;
  const parts = s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p))
      return <b key={i} style={{ fontWeight: 700, color: '#ffffff' }}>{p.slice(2, -2)}</b>;
    if (/^`[^`]+`$/.test(p))
      return <code key={i} style={{
        background: 'rgba(255,255,255,0.1)', padding: '1px 5px',
        borderRadius: 3, fontSize: '0.92em', fontFamily: 'ui-monospace,monospace',
        color: '#e8912d',
      }}>{p.slice(1, -1)}</code>;
    return <span key={i}>{p}</span>;
  });
}

/* ─── Bot / App message ─── */
function SlackMessage({ children, time }) {
  return (
    <div style={{
      display: 'flex', gap: 10, padding: '4px 16px',
      fontFamily: 'var(--font-ui)', lineHeight: 1.5,
    }}>
      {/* App avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: 'linear-gradient(135deg,#4a154b 0%,#7c3aed 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19,
      }}>🤖</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontWeight: 700, fontSize: 14.5, color: '#ffffff' }}>Woba Assist</span>
          <span style={{
            background: 'rgba(74,21,75,0.55)', color: '#d4a8d4',
            fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 3, lineHeight: 1.4,
          }}>APP</span>
          <span style={{ fontSize: 11.5, color: '#616061' }}>{time}</span>
        </div>
        <div style={{ color: '#d1d2d3', fontSize: 14.5, whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── User message ─── */
function SlackUserMessage({ children, time }) {
  return (
    <div style={{
      display: 'flex', gap: 10, padding: '4px 16px',
      fontFamily: 'var(--font-ui)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: '#1264a3',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 15, color: '#fff',
        fontFamily: 'var(--font-display)',
      }}>M</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
          <span style={{ fontWeight: 700, fontSize: 14.5, color: '#ffffff' }}>Marina</span>
          <span style={{ fontSize: 11.5, color: '#616061' }}>{time}</span>
        </div>
        <div style={{ color: '#d1d2d3', fontSize: 14.5, whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Slash command ─── */
function SlackSlashCmd({ text, time }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '4px 16px', fontFamily: 'var(--font-ui)' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: '#1264a3',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 15, color: '#fff', fontFamily: 'var(--font-display)',
      }}>M</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 14.5, color: '#ffffff' }}>Marina</span>
          <span style={{ fontSize: 11.5, color: '#616061' }}>{time}</span>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(78,191,136,0.1)', border: '1px solid rgba(78,191,136,0.25)',
          borderRadius: 4, padding: '4px 10px',
        }}>
          <span style={{ color: '#4ebf88', fontWeight: 700, fontSize: 12 }}>/</span>
          <code style={{ color: '#4ebf88', fontSize: 14, fontFamily: 'ui-monospace,monospace' }}>
            {text.startsWith('/') ? text.slice(1) : text}
          </code>
        </div>
        <div style={{ fontSize: 11.5, color: '#616061', marginTop: 3 }}>
          enviou o comando <code style={{ background: 'rgba(255,255,255,0.07)', padding: '0 4px', borderRadius: 3, color: '#ababad' }}>{text}</code>
        </div>
      </div>
    </div>
  );
}

/* ─── Typing indicator ─── */
function SlackTyping() {
  return (
    <div style={{
      padding: '4px 16px 4px 62px',
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 12.5, color: '#616061', fontFamily: 'var(--font-ui)',
    }}>
      <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width: 5, height: 5, borderRadius: '50%', background: '#ababad', display: 'inline-block',
            animation: `slk-dot 1.1s ${i * 0.18}s infinite ease-in-out`,
          }}/>
        ))}
      </div>
      Woba Assist está digitando…
      <style>{`@keyframes slk-dot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-3px);opacity:1}}`}</style>
    </div>
  );
}

/* ─── Date/section divider ─── */
function SlackDivider({ label = 'Hoje' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '16px 16px 8px',
      fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700,
      color: '#616061', letterSpacing: '0.02em',
    }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }}/>
      <span style={{ flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }}/>
    </div>
  );
}

/* ─── Action buttons (quick-replies equivalent) ─── */
function SlackActionsBlock({ items, onPick }) {
  if (!items || !items.length) return null;
  return (
    <div style={{
      padding: '4px 16px 8px 62px',
      display: 'flex', flexWrap: 'wrap', gap: 6,
    }}>
      {items.map((item, i) => (
        <button key={i} onClick={() => onPick?.(item)} style={{
          background: 'transparent',
          border: '1px solid rgba(209,210,211,0.3)',
          color: '#d1d2d3', padding: '5px 14px',
          borderRadius: 4, fontSize: 13.5, fontWeight: 500,
          fontFamily: 'var(--font-ui)', cursor: 'pointer',
          transition: 'border-color 0.12s, background 0.12s',
        }}
        onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.borderColor = 'rgba(209,210,211,0.55)'; }}
        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(209,210,211,0.3)'; }}
        >{item}</button>
      ))}
    </div>
  );
}

/* ─── Info / attachment block ─── */
function SlackInfoBlock({ title, lines = [], action, accent, time }) {
  const borderColor = accent && accent.startsWith('var') ? '#4a154b' : (accent || '#4a154b');
  return (
    <div style={{ padding: '2px 16px 2px 62px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: '0 6px 6px 0',
        padding: '10px 14px', maxWidth: 480,
      }}>
        {title && (
          <div style={{ fontWeight: 700, fontSize: 14, color: '#ffffff', marginBottom: 4 }}>{title}</div>
        )}
        {lines.map((l, i) => (
          <div key={i} style={{ fontSize: 13.5, color: '#ababad', lineHeight: 1.45, marginTop: 2 }}>
            {renderSlackText(l)}
          </div>
        ))}
        {time && <div style={{ fontSize: 11, color: '#616061', marginTop: 6 }}>{time}</div>}
      </div>
      {action && (
        <button style={{
          marginTop: 6, background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#d1d2d3', padding: '6px 12px',
          borderRadius: 4, fontSize: 13, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>{action}</button>
      )}
    </div>
  );
}

/* ─── Room block ─── */
function SlackRoomBlock({ room, pill, action = 'Reservar', time, onAction }) {
  const pillDark = pill?.dark;
  return (
    <div style={{ padding: '2px 16px 2px 62px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8, maxWidth: 460, overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', padding: 12, gap: 12, alignItems: 'flex-start' }}>
          <img src={room.image} alt="" style={{
            width: 84, height: 64, objectFit: 'cover', borderRadius: 6, flexShrink: 0,
          }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
              <span style={{ fontWeight: 700, fontSize: 14.5, color: '#ffffff' }}>{room.coworking}</span>
              {pill && (
                <span style={{
                  background: pillDark ? 'rgba(255,255,255,0.07)' : 'rgba(249,225,13,0.14)',
                  color: pillDark ? '#ababad' : '#f0d80d',
                  border: pillDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(249,225,13,0.3)',
                  fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 3,
                }}>{pill.text}</span>
              )}
            </div>
            <div style={{ fontSize: 13, color: '#ababad' }}>
              {room.name} · {room.capacity} pessoas · {room.credits} créd./h
            </div>
            {time && <div style={{ fontSize: 11, color: '#616061', marginTop: 4 }}>{time}</div>}
          </div>
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '8px 12px', display: 'flex', gap: 8,
        }}>
          <button onClick={onAction} style={{
            background: '#007a5a', border: 0, color: '#fff',
            padding: '7px 14px', borderRadius: 4, fontSize: 13.5, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{action}</button>
          <button style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#d1d2d3', padding: '7px 12px',
            borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}>Detalhes</button>
        </div>
      </div>
    </div>
  );
}

/* ─── RSVP block ─── */
function SlackRSVPBlock({ items, time }) {
  const STATUS = {
    yes:     { icon: '✅', label: 'Confirmado', color: '#2faa4a' },
    pending: { icon: '⏳', label: 'Pendente',   color: '#e8b030' },
    no:      { icon: '❌', label: 'Recusou',    color: '#e01e5a' },
  };
  return (
    <div style={{ padding: '2px 16px 2px 62px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, maxWidth: 340, overflow: 'hidden',
      }}>
        <div style={{
          padding: '8px 12px 6px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontSize: 12.5, fontWeight: 600, color: '#ababad',
        }}>Confirmações de presença</div>
        {items.map((item, i) => {
          const s = STATUS[item.s] || STATUS.pending;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 12px',
              borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 0,
              fontSize: 14,
            }}>
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              <span style={{ color: '#d1d2d3', flex: 1 }}>{item.name}</span>
              <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.label}</span>
            </div>
          );
        })}
        {time && <div style={{ padding: '4px 12px 8px', fontSize: 11, color: '#616061' }}>{time}</div>}
      </div>
    </div>
  );
}

/* ─── Ticket block ─── */
function SlackTicketBlock({ id, severity, eta, status, time }) {
  const COLOR = { aberto: '#e8b030', andamento: '#1264a3', resolvido: '#2faa4a' };
  const c = COLOR[status] || COLOR.aberto;
  return (
    <div style={{ padding: '2px 16px 2px 62px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderLeft: `4px solid ${c}`,
        borderRadius: '0 6px 6px 0',
        padding: '10px 14px', maxWidth: 380,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <span style={{ fontWeight: 700, fontSize: 14.5, color: '#ffffff' }}>Chamado {id}</span>
          <span style={{
            background: c + '22', color: c,
            fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 3,
          }}>{(status || 'aberto').toUpperCase()}</span>
        </div>
        <div style={{ fontSize: 13, color: '#ababad' }}>
          🔥 Severidade: <b style={{ color: '#d1d2d3' }}>{severity}</b>
          {'  ·  '}⏱️ SLA: <b style={{ color: '#d1d2d3' }}>{eta}</b>
        </div>
        {time && <div style={{ fontSize: 11, color: '#616061', marginTop: 6 }}>{time}</div>}
      </div>
    </div>
  );
}

/* ─── Gift / onboarding block ─── */
function SlackGiftBlock({ emoji = '🎁', big, small, time }) {
  return (
    <div style={{ padding: '2px 16px 2px 62px' }}>
      <div style={{
        background: 'rgba(249,225,13,0.07)',
        border: '1px solid rgba(249,225,13,0.28)',
        borderRadius: 8, padding: '12px 16px',
        maxWidth: 360, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8, flexShrink: 0,
          background: 'var(--w-yellow)', color: 'var(--w-yellow-fg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>{emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--w-yellow)', fontFamily: 'var(--font-display)' }}>{big}</div>
          <div style={{ fontSize: 13, color: '#ababad', marginTop: 2 }}>{small}</div>
        </div>
        {time && <div style={{ fontSize: 11, color: '#616061', alignSelf: 'flex-end' }}>{time}</div>}
      </div>
    </div>
  );
}

/* ─── Flow reply (form submitted) ─── */
function SlackFlowReply({ label, time }) {
  return (
    <div style={{ padding: '4px 16px 6px 62px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: 'rgba(0,122,90,0.12)',
        border: '1px solid rgba(0,122,90,0.3)',
        borderRadius: 4, padding: '6px 12px',
        fontSize: 13, color: '#2faa4a', fontWeight: 600, fontFamily: 'var(--font-ui)',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
        {label}
        <span style={{ color: '#616061', fontWeight: 400, fontSize: 11.5 }}>{time}</span>
      </div>
    </div>
  );
}

/* ─── App screen block (deeplink equivalent) ─── */
function SlackAppScreenBlock({ title, lines, success, time }) {
  return (
    <div style={{ padding: '2px 16px 2px 62px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: '4px solid #4ebf88',
        borderRadius: '0 6px 6px 0',
        padding: '10px 14px', maxWidth: 400,
      }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#4ebf88', marginBottom: 4 }}>App Woba</div>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: '#fff', marginBottom: 6 }}>{title}</div>
        {(lines || []).map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: '#ababad', marginTop: 4 }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
              border: '2px solid #4ebf88', borderTopColor: 'transparent',
              animation: 'slk-dot 1s linear infinite',
            }}/>
            {l}
          </div>
        ))}
        {success && (
          <div style={{
            marginTop: 10, background: 'rgba(0,122,90,0.18)',
            border: '1px solid rgba(0,122,90,0.3)',
            color: '#2faa4a', fontWeight: 700, fontSize: 13.5,
            padding: '6px 10px', borderRadius: 4, display: 'inline-block',
          }}>{success}</div>
        )}
        {time && <div style={{ fontSize: 11, color: '#616061', marginTop: 6 }}>{time}</div>}
      </div>
    </div>
  );
}

/* ─── Location block ─── */
function SlackLocationBlock({ title, address, mapImage, time }) {
  return (
    <div style={{ padding: '2px 16px 2px 62px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, maxWidth: 360, overflow: 'hidden',
      }}>
        <div style={{
          width: '100%', height: 120,
          background: `url("${mapImage}") center/cover, #1a3a5e`,
        }}/>
        <div style={{ padding: '10px 12px' }}>
          <div style={{ fontWeight: 700, fontSize: 14.5, color: '#ffffff', marginBottom: 3 }}>{title}</div>
          <div style={{ fontSize: 13, color: '#ababad' }}>{address}</div>
          {time && <div style={{ fontSize: 11, color: '#616061', marginTop: 6 }}>{time}</div>}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '8px 12px' }}>
          <button style={{
            background: '#007a5a', border: 0, color: '#fff',
            padding: '6px 12px', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}>Como chegar ↗</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Voice message block ─── */
function SlackVoiceBlock({ side = 'user', duration, time }) {
  const isUser = side === 'user';
  return (
    <div style={{ padding: '2px 16px 2px 62px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8, padding: '10px 14px',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: isUser ? '#1264a3' : 'linear-gradient(135deg,#4a154b,#7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>🎙️</div>
        <div style={{ width: 120, height: 20, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}/>
        <span style={{ fontSize: 12.5, color: '#ababad', fontFamily: 'ui-monospace,monospace' }}>{duration}</span>
        {time && <span style={{ fontSize: 11, color: '#616061' }}>{time}</span>}
      </div>
    </div>
  );
}

/* ─── Modal overlay (Slack modal — replaces bottom sheet) ─── */
function SlackModal({ open, sheet, onClose, onConfirm }) {
  if (!sheet) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: open ? 'auto' : 'none',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        opacity: open ? 1 : 0,
        transition: 'opacity 180ms ease',
      }}/>
      <div style={{
        position: 'relative', zIndex: 1,
        width: 440, maxWidth: '90%',
        maxHeight: '80%',
        background: '#1e2022',
        borderRadius: 12,
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column',
        transform: open ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(8px)',
        opacity: open ? 1 : 0,
        transition: 'transform 180ms ease, opacity 180ms ease',
        color: '#d1d2d3', fontFamily: 'var(--font-ui)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '20px 20px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#ffffff', lineHeight: 1.2 }}>{sheet.title || 'Confirmar'}</div>
            {sheet.intro && <div style={{ fontSize: 14, color: '#ababad', marginTop: 4 }}>{sheet.intro}</div>}
            {sheet.subtitle && <div style={{ fontSize: 13, color: '#616061', marginTop: 2 }}>{sheet.subtitle}</div>}
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 0, color: '#ababad',
            width: 32, height: 32, borderRadius: 6, fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            flexShrink: 0, marginLeft: 12,
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
          {(sheet.rows || []).map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              fontSize: 14,
            }}>
              <span style={{ color: '#d1d2d3', flex: 1 }}>{r.label}</span>
              {r.value && (
                <span style={{
                  color: r.accent || '#ababad', fontWeight: r.bold ? 600 : 400,
                  background: r.value ? 'rgba(255,255,255,0.05)' : undefined,
                  padding: '3px 8px', borderRadius: 4, fontSize: 13.5,
                }}>{r.value}</span>
              )}
              {r.cta && (
                <button style={{
                  background: 'rgba(0,122,90,0.15)', border: '1px solid rgba(0,122,90,0.3)',
                  color: '#2faa4a', fontWeight: 600, padding: '4px 10px',
                  borderRadius: 4, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
                }}>{r.cta}</button>
              )}
            </div>
          ))}

          {sheet.offer && (
            <div style={{
              marginTop: 14,
              background: 'rgba(249,225,13,0.07)',
              border: '1px solid rgba(249,225,13,0.25)',
              borderRadius: 8, padding: '14px',
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                  background: 'var(--w-yellow)', color: 'var(--w-yellow-fg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>{sheet.offer.emoji || '✨'}</div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--w-yellow)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{sheet.offer.label}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#ffffff', marginTop: 3 }}>{sheet.offer.title}</div>
                  <div style={{ fontSize: 13, color: '#ababad', marginTop: 4, lineHeight: 1.4 }}>{sheet.offer.subtitle}</div>
                  {sheet.offer.action && (
                    <button style={{
                      marginTop: 10, background: 'transparent',
                      border: '1px solid rgba(249,225,13,0.5)',
                      color: 'var(--w-yellow)', padding: '5px 11px',
                      borderRadius: 4, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    }}>{sheet.offer.action}</button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 8,
          padding: '14px 20px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
            color: '#d1d2d3', padding: '9px 18px',
            borderRadius: 4, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
          }}>Cancelar</button>
          <button onClick={onConfirm} style={{
            background: '#007a5a', border: 0, color: '#fff',
            padding: '9px 18px', borderRadius: 4, fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{sheet.cta || 'Confirmar'}</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Space Days block ─── */
function SlackSpaceDaysBlock({ days = [], time, onAction }) {
  const PALETTE = ['#a768ff', '#3a80ce', '#fe8c14', '#25c265', '#ec4899', '#de6530', '#81c42b'];
  function inits(name) {
    const p = String(name).trim().split(/\s+/);
    return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase();
  }
  function nameList(people) {
    const first = people.map(p => p.name.split(' ')[0]);
    if (first.length <= 2) return first.join(' e ');
    return first.slice(0, -1).join(', ') + ' e ' + first[first.length - 1];
  }
  return (
    <div style={{ padding: '2px 16px 2px 62px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {days.map((d, di) => (
        <div key={di} style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderLeft: '4px solid #f9e10d',
          borderRadius: '0 8px 8px 0', maxWidth: 460, overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px 8px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              width: 34, height: 38, borderRadius: 6, flexShrink: 0,
              background: '#f9e10d', color: '#1a1810',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.07em' }}>{d.dow}</span>
              <span style={{ fontSize: 15, fontWeight: 800, lineHeight: 1 }}>{d.dateNum}</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: '#fff' }}>{d.label}</div>
              <div style={{ fontSize: 12, color: '#ababad', marginTop: 1 }}>{d.note}</div>
            </div>
          </div>

          {(d.spaces || []).map((s, si) => (
            <div key={si}>
              {si > 0 && <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 14px' }}/>}
              <div style={{ padding: '10px 14px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{s.coworking}</span>
                  {s.recommended && (
                    <span style={{
                      background: 'rgba(249,225,13,0.14)', color: '#f0d80d',
                      border: '1px solid rgba(249,225,13,0.3)',
                      fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 3,
                    }}>★ Mais gente</span>
                  )}
                </div>
                <div style={{ fontSize: 12.5, color: '#ababad', marginBottom: 8 }}>
                  {[s.area, s.time, s.credits != null ? s.credits + ' créd.' : null].filter(Boolean).join(' · ')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {s.people.slice(0, 4).map((p, i) => (
                      <div key={i} style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: p.color || PALETTE[i % PALETTE.length],
                        color: '#fff', fontSize: 9.5, fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1.5px solid #1a1d21', marginLeft: i > 0 ? -7 : 0,
                        fontFamily: 'var(--font-display)',
                      }}>{inits(p.name)}</div>
                    ))}
                    {s.people.length > 4 && (
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)', color: '#ababad',
                        border: '1.5px solid #1a1d21', marginLeft: -7,
                        fontSize: 9.5, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>+{s.people.length - 4}</div>
                    )}
                  </div>
                  <span style={{ fontSize: 12.5, color: '#d1d2d3' }}>{nameList(s.people)}</span>
                </div>
              </div>
              <div style={{ padding: '0 14px 10px' }}>
                <button onClick={() => onAction?.(s, d)} style={{
                  background: '#007a5a', border: 0, color: '#fff',
                  padding: '7px 16px', borderRadius: 4, fontSize: 13.5, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>{s.action || 'Ir junto'}</button>
              </div>
            </div>
          ))}
          {di === days.length - 1 && time && (
            <div style={{ textAlign: 'right', fontSize: 11, color: '#616061', padding: '0 14px 8px' }}>{time}</div>
          )}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  renderSlackText,
  SlackMessage, SlackUserMessage, SlackSlashCmd,
  SlackTyping, SlackDivider, SlackActionsBlock,
  SlackInfoBlock, SlackRoomBlock, SlackRSVPBlock,
  SlackTicketBlock, SlackGiftBlock, SlackFlowReply,
  SlackAppScreenBlock, SlackLocationBlock, SlackVoiceBlock,
  SlackModal, SlackSpaceDaysBlock,
});

})();
