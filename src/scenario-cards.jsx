// scenario-cards.jsx — Extra message-card primitives used by scenarios
// Adds: InfoCard (title + lines + action), PillRoomCard (room + colored pill),
// GiftCard (P-11), AppScreenCard (P-01), TicketStatusCard (P-14), RSVPCard (P-04).

(function () {

const { Icons: ICX } = window;

function BubbleShell({ side = 'bot', children, maxWidth = '82%' }) {
  const isBot = side === 'bot';
  const radius = isBot ? '0 12px 12px 12px' : '12px 0 12px 12px';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isBot ? 'flex-start' : 'flex-end',
      padding: '1.5px 8px',
    }}>
      <div style={{
        maxWidth,
        background: isBot ? 'var(--chat-bubble-bot)' : 'var(--chat-bubble-user)',
        borderRadius: radius,
        boxShadow: 'var(--chat-shadow)',
        color: 'var(--chat-text)',
        overflow: 'hidden',
        fontFamily: 'var(--font-chat)',
      }}>
        {children}
      </div>
    </div>
  );
}

/* ─────────── InfoCard ─────────── */
function InfoCard({ title, lines = [], time, action, onAction, accent }) {
  return (
    <BubbleShell>
      <div style={{ padding: '10px 12px 6px', minWidth: 220 }}>
        {title && (
          <div style={{
            fontWeight: 600, fontSize: 14.5, marginBottom: 4,
            color: accent || 'var(--chat-text)',
          }}>{title}</div>
        )}
        {lines.map((l, i) => (
          <div key={i} style={{ fontSize: 13.5, color: 'var(--chat-text)', lineHeight: 1.45, marginTop: 2 }}>
            {renderLine(l)}
          </div>
        ))}
        <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--chat-text-3)', marginTop: 4 }}>{time}</div>
      </div>
      {action && (
        <button onClick={onAction} style={{
          width: '100%', background: 'transparent',
          border: 0, borderTop: '1px solid var(--chat-divider)',
          color: 'var(--chat-link)', fontWeight: 600,
          padding: '11px 0', fontSize: 14.5, fontFamily: 'inherit',
        }}>{action}</button>
      )}
    </BubbleShell>
  );
}

/* ─────────── PillRoomCard ─────────── */
function PillRoomCard({ room, pill, time, action = 'Reservar', onAction }) {
  const pillStyle = pill?.dark ? {
    background: 'rgba(20,30,25,0.85)', color: 'var(--chat-link)',
  } : {
    background: 'var(--w-yellow)', color: 'var(--w-yellow-fg)',
  };
  return (
    <BubbleShell>
      <div style={{ width: 300 }}>
        <div style={{
          position: 'relative',
          width: '100%', height: 160,
          background: `url("${room.image}") center/cover, #2a3a32`,
          borderRadius: '0 12px 0 0',
        }}>
          {pill && (
            <div style={{
              position: 'absolute', top: 10, left: 10,
              padding: '4px 9px', borderRadius: 999,
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.01em',
              ...pillStyle,
            }}>{pill.text}</div>
          )}
        </div>
        <div style={{ padding: '10px 12px 4px' }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{room.coworking}</div>
          <div style={{ fontSize: 13, color: 'var(--chat-text-2)', marginTop: 2 }}>
            {room.name} · {room.capacity}p · {room.credits} créd.
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--chat-text-3)', marginTop: 4 }}>{time}</div>
        </div>
        <button onClick={onAction} style={{
          width: '100%', background: 'transparent',
          border: 0, borderTop: '1px solid var(--chat-divider)',
          color: 'var(--chat-link)', fontWeight: 500,
          padding: '11px 0', fontSize: 15, fontFamily: 'inherit',
        }}>{action}</button>
      </div>
    </BubbleShell>
  );
}

/* ─────────── GiftCard (P-11) ─────────── */
function GiftCard({ emoji = '🎁', big, small, time }) {
  return (
    <BubbleShell maxWidth="84%">
      <div style={{
        background: 'rgba(249,225,13,0.12)',
        border: '1px solid rgba(249,225,13,0.35)',
        margin: 0,
        padding: '12px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'var(--w-yellow)', color: 'var(--w-yellow-fg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>{emoji}</div>
        <div>
          <div style={{
            fontWeight: 700, fontSize: 16,
            color: 'var(--w-yellow)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.01em',
          }}>{big}</div>
          <div style={{ fontSize: 12.5, color: 'var(--chat-text-2)', marginTop: 1 }}>{small}</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--chat-text-3)' }}>{time}</div>
      </div>
    </BubbleShell>
  );
}

/* ─────────── AppScreenCard (P-01 deeplink) ─────────── */
function AppScreenCard({ title, lines, success, time }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '4px 8px' }}>
      <div style={{
        maxWidth: '86%', minWidth: 240,
        background: 'var(--bg-canvas, #f1f1ed)',
        color: '#1a1810',
        borderRadius: '0 12px 12px 12px',
        boxShadow: 'var(--chat-shadow)',
        overflow: 'hidden',
        fontFamily: 'var(--font-chat)',
      }}>
        <div style={{ padding: '12px 14px' }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
            color: '#71716a', textTransform: 'uppercase',
          }}>App Woba</div>
          <div style={{
            fontWeight: 700, fontSize: 15.5, marginTop: 4,
            fontFamily: 'var(--font-display)',
            color: '#1a1810',
          }}>{title}</div>
          {lines.map((l, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 13.5, color: '#3e3e37', marginTop: 8,
            }}>
              <span style={{
                display: 'inline-block', width: 12, height: 12,
                borderRadius: '50%',
                border: '2px solid #f9e10d', borderTopColor: 'transparent',
                animation: 'wb-spin 1s linear infinite',
              }}/>
              {l}
            </div>
          ))}
          {success && (
            <div style={{
              marginTop: 12,
              background: 'var(--w-yellow)', color: 'var(--w-yellow-fg)',
              textAlign: 'center', padding: '8px 0',
              borderRadius: 8, fontWeight: 700, fontSize: 13.5,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.005em',
            }}>{success}</div>
          )}
          <div style={{ textAlign: 'right', fontSize: 11, color: '#95948f', marginTop: 6 }}>{time}</div>
        </div>
      </div>
      <style>{`@keyframes wb-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ─────────── TicketStatusCard (P-14) ─────────── */
function TicketStatusCard({ id, severity = 'Alto', eta = '2h', status = 'aberto', time }) {
  const statusMap = {
    aberto:    { c: '#fe8c14', label: 'Aberto' },
    andamento: { c: '#3a80ce', label: 'Em andamento' },
    resolvido: { c: '#81c42b', label: 'Resolvido' },
  };
  const s = statusMap[status] || statusMap.aberto;
  return (
    <BubbleShell>
      <div style={{ padding: '10px 12px', minWidth: 250 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: s.c, boxShadow: `0 0 0 3px ${s.c}33`,
          }}/>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Chamado {id}</span>
          <span style={{
            marginLeft: 'auto', fontSize: 11, fontWeight: 600,
            color: s.c, textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>{s.label}</span>
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--chat-text)', lineHeight: 1.5 }}>
          ⚡ Severidade: <b>{severity}</b><br/>
          ⏱️ Tempo médio: <b>{eta}</b>
        </div>
        <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--chat-text-3)', marginTop: 6 }}>{time}</div>
      </div>
    </BubbleShell>
  );
}

/* ─────────── RSVPCard (P-04) ─────────── */
function RSVPCard({ title = 'Convidados', items = [], time }) {
  return (
    <BubbleShell>
      <div style={{ padding: '10px 12px', minWidth: 230 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{title}</div>
        {items.map((it, i) => {
          const color = it.s === 'yes' ? '#cde7aa' : it.s === 'no' ? '#f2c1ac' : '#ffd49a';
          const dot   = it.s === 'yes' ? '🟢' : it.s === 'no' ? '🔴' : '🟡';
          const txt   = it.s === 'yes' ? 'confirmou' : it.s === 'no' ? 'não vai' : 'aguardando';
          return (
            <div key={i} style={{ fontSize: 13.5, color, marginTop: 3 }}>
              {dot} {it.name} — {txt}
            </div>
          );
        })}
        <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--chat-text-3)', marginTop: 6 }}>{time}</div>
      </div>
    </BubbleShell>
  );
}

/* ─────────── VoiceMessage (I-04 — reservar por voz) ─────────── */
function VoiceMessage({ side = 'user', duration = '0:08', time, status }) {
  const isBot = side === 'bot';
  const bg = isBot ? 'var(--chat-bubble-bot)' : 'var(--chat-bubble-user)';
  const accent = isBot ? 'var(--chat-text-2)' : 'rgba(220,240,225,0.7)';
  // Pseudo waveform — 32 bars with varying heights
  const bars = [3,5,8,11,14,17,18,20,22,19,15,12,10,13,16,20,23,21,18,14,11,8,12,15,18,16,12,9,7,5,4,3];
  return (
    <div style={{
      display: 'flex',
      justifyContent: isBot ? 'flex-start' : 'flex-end',
      padding: '1.5px 8px',
    }}>
      <div style={{
        maxWidth: '78%',
        background: bg,
        borderRadius: isBot ? '0 12px 12px 12px' : '12px 0 12px 12px',
        boxShadow: 'var(--chat-shadow)',
        padding: '8px 12px 6px',
        display: 'flex', alignItems: 'center', gap: 10,
        minWidth: 220,
        fontFamily: 'var(--font-chat)',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'var(--chat-accent)', color: '#06150e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 24, flex: 1 }}>
          {bars.map((h, i) => (
            <span key={i} style={{
              width: 2, height: h, borderRadius: 1,
              background: i < bars.length * 0.35 ? 'var(--chat-accent)' : accent,
            }}/>
          ))}
        </div>
        <div style={{
          fontSize: 11.5, color: accent, fontVariantNumeric: 'tabular-nums',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1,
        }}>
          <span>{duration}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            {time}
            {status === 'read' && (
              <svg width="14" height="9" viewBox="0 0 20 12" fill="none">
                <path d="M1 6.5l4 4 9-9 M6 10.5l9-9" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────── LocationCard (P-16 — local da reserva) ─────────── */
function LocationCard({ title, address, mapImage = 'assets/map-1.svg', time, action = 'Como chegar', onAction }) {
  return (
    <BubbleShell>
      <div style={{ width: 290 }}>
        <div style={{
          width: '100%', height: 150,
          background: `url("${mapImage}") center/cover, #1a3a5e`,
          borderRadius: '0 12px 0 0',
        }}/>
        <div style={{ padding: '10px 12px 4px' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--chat-text)' }}>{title}</div>
          <div style={{ fontSize: 13, color: 'var(--chat-text-2)', marginTop: 3, lineHeight: 1.4 }}>{address}</div>
          <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--chat-text-3)', marginTop: 4 }}>{time}</div>
        </div>
        <button onClick={onAction} style={{
          width: '100%', background: 'transparent',
          border: 0, borderTop: '1px solid var(--chat-divider)',
          color: 'var(--chat-link)', fontWeight: 600,
          padding: '11px 0', fontSize: 14.5, fontFamily: 'inherit',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          {action}
        </button>
      </div>
    </BubbleShell>
  );
}

/* ─────────── RecurrenceSheet — rich recurrence picker ─────────── */
function RecurrenceSheet({ sheet, onClose, onConfirm }) {
  const [freq, setFreq] = React.useState(sheet.defaultFreq || 'weekly');
  const [count, setCount] = React.useState(sheet.repeatCount || 3);
  const frequencies = sheet.frequencies || [];
  const selectedFreq = frequencies.find(f => f.id === freq) || frequencies[0];

  return (
    <>
      {/* Drag handle */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }}/>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', padding: '14px 16px 4px', gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
          background: 'var(--w-yellow)', color: 'var(--w-yellow-fg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19,
        }}>🔄</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{sheet.title}</div>
          <div style={{ fontSize: 13, color: 'var(--chat-text-2)', marginTop: 2 }}>{sheet.subtitle}</div>
        </div>
        <button onClick={onClose} style={{
          background: 'transparent', border: 0, color: 'var(--chat-text-2)',
          padding: 6, cursor: 'pointer', lineHeight: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 8px' }}>

        {/* Data de origem */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 12, padding: '12px 14px',
          display: 'flex', alignItems: 'center', marginBottom: 20,
        }}>
          <div>
            <div style={{ fontSize: 11.5, color: 'var(--chat-text-2)', marginBottom: 2 }}>Data de origem</div>
            <div style={{ fontWeight: 700, fontSize: 15.5 }}>{sheet.origin}</div>
          </div>
          <button style={{
            marginLeft: 'auto', background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.14)', borderRadius: 20,
            color: 'var(--chat-text)', fontSize: 13, fontWeight: 500,
            padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar
          </button>
        </div>

        {/* Frequência */}
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Frequência</div>
        {frequencies.map(f => (
          <div key={f.id} onClick={() => setFreq(f.id)} style={{
            background: freq === f.id ? 'rgba(249,225,13,0.09)' : 'rgba(255,255,255,0.04)',
            border: '1px solid ' + (freq === f.id ? 'var(--w-yellow)' : 'rgba(255,255,255,0.1)'),
            borderRadius: 12, padding: '12px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 8, cursor: 'pointer',
            transition: 'background 140ms, border-color 140ms',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--chat-text)' }}>{f.label}</div>
              <div style={{ fontSize: 12.5, color: 'var(--chat-text-2)', marginTop: 2 }}>{f.desc}</div>
            </div>
            {freq === f.id && (
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: 'var(--w-yellow)', color: 'var(--w-yellow-fg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path d="M1 4L4.5 7.5L11 1" stroke="#0a1d12" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        ))}

        {/* Quantas vezes repetir */}
        <div style={{ fontWeight: 700, fontSize: 15, margin: '16px 0 10px' }}>Quantas vezes repetir?</div>
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12, padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ flex: 1, fontSize: 14, color: 'var(--chat-text)', lineHeight: 1.35 }}>
            {count} repetição{count !== 1 ? 'ões' : ''} após a data de origem
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <button onClick={() => setCount(c => Math.max(1, c - 1))} style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
              color: 'var(--chat-text)', fontSize: 18, fontWeight: 400,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1,
            }}>−</button>
            <span style={{ fontWeight: 700, fontSize: 17, minWidth: 20, textAlign: 'center' }}>{count}</span>
            <button onClick={() => setCount(c => c + 1)} style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
              color: 'var(--chat-text)', fontSize: 18, fontWeight: 400,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1,
            }}>+</button>
          </div>
        </div>

        {/* Preview */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '18px 0 10px' }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Preview — {count + 1} reservas</div>
          <div style={{ fontSize: 12.5, color: 'var(--chat-text-2)' }}>{selectedFreq?.label}</div>
        </div>
        {(sheet.preview || []).map((p, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '9px 12px',
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6,
            opacity: p.unavailable ? 0.7 : 1,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 8, flexShrink: 0,
              background: p.origin ? 'var(--w-yellow)' : 'rgba(255,255,255,0.1)',
              color: p.origin ? 'var(--w-yellow-fg)' : 'var(--chat-text)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 0,
            }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', lineHeight: 1.4 }}>{p.day}</span>
              <span style={{ fontSize: 19, fontWeight: 800, lineHeight: 1 }}>{p.dateNum}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{p.date} — {p.month}</div>
              <div style={{
                fontSize: 12.5, marginTop: 2,
                color: p.unavailable ? '#f2a090' : 'var(--chat-text-2)',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: p.unavailable ? '#f2a090' : 'var(--chat-accent)',
                  display: 'inline-block',
                }}/>
                {p.unavailable ? 'Indisponível' : p.time}
              </div>
            </div>
            {p.origin && (
              <span style={{
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: 'var(--w-yellow)', color: 'var(--w-yellow-fg)',
                padding: '3px 8px', borderRadius: 6,
              }}>Origem</span>
            )}
            {p.unavailable && (
              <span style={{
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: 'rgba(242,160,144,0.15)', color: '#f2a090',
                padding: '3px 8px', borderRadius: 6,
              }}>Sem vagas</span>
            )}
          </div>
        ))}
        <div style={{ height: 8 }}/>
      </div>

      {/* CTA */}
      <div style={{ padding: '8px 16px 14px' }}>
        <button onClick={onConfirm} style={{
          width: '100%', background: 'var(--w-yellow)',
          color: 'var(--w-yellow-fg)', fontWeight: 700, fontSize: 16,
          border: 0, borderRadius: 999, padding: '14px 0',
          fontFamily: 'var(--font-chat)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 2px 8px rgba(249,225,13,0.25)',
        }}>
          🔄 {sheet.cta || `Confirmar ${count + 1} reservas`}
        </button>
      </div>

      {/* Woba footer */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 14px 14px',
        background: 'rgba(0,0,0,0.18)',
        fontSize: 12.5, color: 'var(--chat-text-2)',
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%', background: 'var(--w-yellow)',
          color: 'var(--w-yellow-fg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 9,
        }}>woba</div>
        <div style={{ flex: 1 }}>Gerenciada por Woba Assist.</div>
      </div>
    </>
  );
}

/* ─────────── ScenarioSheet — generic bottom-sheet ─────────── */
function ScenarioSheet({ open, sheet, onClose, onConfirm }) {
  const [offerChecked, setOfferChecked] = React.useState(false);
  React.useEffect(() => { setOfferChecked(false); }, [sheet]);
  if (!sheet) return null;

  const isRecurrence = sheet.kind === 'recurrence';

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 40,
      display: 'flex', flexDirection: 'column',
      pointerEvents: open ? 'auto' : 'none',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        opacity: open ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}/>
      <div style={{
        marginTop: isRecurrence ? 48 : 90,
        background: '#1a2520',
        borderRadius: '16px 16px 0 0',
        flex: 1, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 240ms cubic-bezier(0.2, 0, 0, 1)',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.4)',
        color: 'var(--chat-text)',
        fontFamily: 'var(--font-chat)',
      }}>
        {isRecurrence ? (
          <RecurrenceSheet sheet={sheet} onClose={onClose} onConfirm={onConfirm}/>
        ) : (<>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <div style={{ width: 38, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }}/>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px 4px',
        }}>
          <button onClick={onClose} style={sheetIco} aria-label="close"><ICX.Close/></button>
          <div style={{ fontWeight: 600, fontSize: 17 }}>{sheet.title || 'Confirmar'}</div>
          <button style={sheetIco} aria-label="more"><ICX.More/></button>
        </div>
        {sheet.progress && (
          <div style={{ padding: '8px 16px 4px', display: 'flex', gap: 6 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--chat-accent)' }}/>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }}/>
          </div>
        )}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 16px' }}>
          {sheet.intro && (
            <h2 style={{
              fontSize: 22, fontWeight: 700, margin: '4px 0 12px',
              fontFamily: 'var(--font-display)', letterSpacing: '-0.01em',
            }}>{sheet.intro}</h2>
          )}
          {sheet.subtitle && (
            <div style={{ fontSize: 13.5, color: 'var(--chat-text-2)', marginBottom: 10 }}>{sheet.subtitle}</div>
          )}
          {(sheet.rows || []).map((r, i) => {
            const displayValue = r.isTotal && offerChecked && sheet.offer?.totalWithOffer
              ? sheet.offer.totalWithOffer
              : r.value;
            return (
              <div key={i} style={{
                padding: '11px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontSize: 14.5, lineHeight: 1.5,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ flex: 1 }}>{r.label}</span>
                {displayValue && <span style={{ color: r.accent || 'var(--chat-text-2)', fontWeight: r.bold ? 600 : 400 }}>{displayValue}</span>}
                {r.cta && <span style={{ color: 'var(--chat-link)', fontWeight: 600 }}>{r.cta}</span>}
              </div>
            );
          })}
          {sheet.offer && (
            <div
              onClick={sheet.offer.checkbox ? () => setOfferChecked(c => !c) : undefined}
              style={{
                marginTop: 16,
                background: offerChecked ? 'rgba(95,208,122,0.10)' : 'rgba(249,225,13,0.08)',
                border: '1px solid ' + (offerChecked ? 'rgba(95,208,122,0.5)' : 'rgba(249,225,13,0.35)'),
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex', alignItems: 'flex-start', gap: 12,
                cursor: sheet.offer.checkbox ? 'pointer' : 'default',
                transition: 'background 180ms, border-color 180ms',
              }}>
              {sheet.offer.checkbox ? (
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 2,
                  background: offerChecked ? 'var(--chat-link)' : 'transparent',
                  border: '2px solid ' + (offerChecked ? 'var(--chat-link)' : 'rgba(255,255,255,0.3)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 150ms, border-color 150ms',
                }}>
                  {offerChecked && (
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                      <path d="M1 4L4.5 7.5L11 1" stroke="#0a1d12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              ) : (
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'var(--w-yellow)', color: 'var(--w-yellow-fg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0,
                }}>{sheet.offer.emoji || '✨'}</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: offerChecked ? 'var(--chat-link)' : 'var(--w-yellow)',
                  marginBottom: 2,
                }}>{sheet.offer.label || 'Sugestão'}</div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15.5,
                  letterSpacing: '-0.005em', color: 'var(--chat-text)',
                  lineHeight: 1.2,
                }}>{sheet.offer.title}</div>
                <div style={{
                  fontSize: 13, color: 'var(--chat-text-2)',
                  marginTop: 4, lineHeight: 1.4,
                }}>{sheet.offer.subtitle}</div>
                {sheet.offer.extraLabel && (
                  <div style={{
                    marginTop: 6,
                    display: 'inline-block',
                    background: 'rgba(95,208,122,0.15)',
                    color: 'var(--chat-link)',
                    fontSize: 12.5, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 999,
                  }}>{sheet.offer.extraLabel}</div>
                )}
                {!sheet.offer.checkbox && sheet.offer.action && (
                  <button style={{
                    marginTop: 10,
                    background: 'transparent',
                    border: '1px solid var(--w-yellow)',
                    color: 'var(--w-yellow)',
                    padding: '6px 12px',
                    borderRadius: 999,
                    fontSize: 12.5, fontWeight: 600,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}>{sheet.offer.action}</button>
                )}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: '8px 16px 14px' }}>
          <button onClick={onConfirm} style={{
            width: '100%', background: 'var(--chat-accent)',
            color: '#0a1d12', fontWeight: 700, fontSize: 16,
            border: 0, borderRadius: 999, padding: '14px 0',
            fontFamily: 'var(--font-chat)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}>{sheet.cta || 'Confirmar'}</button>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 14px 14px',
          background: 'rgba(0,0,0,0.18)',
          fontSize: 12.5, color: 'var(--chat-text-2)',
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%', background: 'var(--w-yellow)',
            color: 'var(--w-yellow-fg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 9,
          }}>woba</div>
          <div style={{ flex: 1 }}>Gerenciada por Woba Assist.</div>
        </div>
        </>)}
      </div>
    </div>
  );
}

const sheetIco = {
  width: 34, height: 34, padding: 0,
  background: 'transparent', border: 0,
  color: 'var(--chat-text)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

function renderLine(s) {
  if (typeof s !== 'string') return s;
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) return <b key={i} style={{ fontWeight: 700 }}>{p.slice(2, -2)}</b>;
    return <span key={i}>{p}</span>;
  });
}

Object.assign(window, {
  InfoCard, PillRoomCard, GiftCard, AppScreenCard, TicketStatusCard, RSVPCard,
  LocationCard, VoiceMessage, ScenarioSheet,
});

})();
