(function () {
  // Messages.jsx — bubble + card components for the chat
  // Renders bot text, user text, day divider, system row, room card, flow attachment, typing indicator.

  const { Icons: MI } = window;

  /* ─────────── Day divider chip ─────────── */
  function DayDivider({ label = 'Hoje' }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
      <div style={{
          background: 'rgba(20,30,25,0.85)',
          color: 'var(--chat-text-2)',
          padding: '5px 14px',
          borderRadius: 8,
          fontSize: 12.5, fontWeight: 500,
          boxShadow: 'var(--chat-shadow)'
        }}>{label}</div>
    </div>);

  }

  /* ─────────── Timestamp + checks (status) ─────────── */
  function MetaRow({ time, status, light }) {
    const color = light ? 'rgba(220,240,225,0.7)' : 'var(--chat-text-3)';
    return (
      <span style={{
        fontSize: 11, color, marginLeft: 8,
        display: 'inline-flex', alignItems: 'center', gap: 4, verticalAlign: 'baseline',
        whiteSpace: 'nowrap',
        float: 'right',
        marginTop: 4
      }}>
      {time}
      {status === 'sent' && <MI.Check1 style={{ color }} />}
      {status === 'delivered' && <MI.Check2 style={{ color }} />}
      {status === 'read' && <MI.Check2 style={{ color: '#53bdeb' }} />}
    </span>);

  }

  /* ─────────── Bubble wrappers ─────────── */
  function BubbleWrap({ side = 'bot', children, tail = true, padded = true, color }) {
    const isBot = side === 'bot';
    const bg = color || (isBot ? 'var(--chat-bubble-bot)' : 'var(--chat-bubble-user)');
    const radius = isBot ?
    tail ? '0 12px 12px 12px' : '12px' :
    tail ? '12px 0 12px 12px' : '12px';
    return (
      <div style={{
        display: 'flex',
        justifyContent: isBot ? 'flex-start' : 'flex-end',
        padding: '1.5px 8px'
      }}>
      <div style={{
          maxWidth: '78%',
          background: bg,
          borderRadius: radius,
          boxShadow: 'var(--chat-shadow)',
          color: 'var(--chat-text)',
          padding: padded ? '7px 9px 6px 11px' : 0,
          fontFamily: 'var(--font-chat)',
          fontSize: 14.5,
          lineHeight: 1.42,
          position: 'relative',
          wordBreak: 'break-word'
        }}>
        {children}
      </div>
    </div>);

  }

  /* ─────────── Text message ─────────── */
  function TextMsg({ side = 'bot', children, time, status, tail = true }) {
    return (
      <BubbleWrap side={side} tail={tail}>
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {children}
        <MetaRow time={time} status={status} />
        <div style={{ clear: 'both' }} />
      </div>
    </BubbleWrap>);

  }

  /* ─────────── Typing indicator ─────────── */
  function Typing() {
    return (
      <BubbleWrap side="bot" padded={false}>
      <div style={{
          padding: '10px 14px',
          display: 'flex', gap: 4
        }}>
        {[0, 1, 2].map((i) =>
          <span key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#9ab19f',
            animation: `typing 1.1s ${i * 0.18}s infinite ease-in-out`
          }} />
          )}
      </div>
      <style>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </BubbleWrap>);

  }

  /* ─────────── Room card (rich) ─────────── */
  function RoomCard({ room, time, onReservar, compact = false }) {
    const [expanded, setExpanded] = React.useState(false);

    if (compact) {
      return (
        <BubbleWrap side="bot" padded={false}>
        <div style={{ display: 'flex', gap: 10, padding: 6, alignItems: 'center', minWidth: 260 }}>
          <img src={room.image} alt="" style={{
              width: 64, height: 64, borderRadius: 6, objectFit: 'cover', flexShrink: 0
            }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--chat-text)', lineHeight: 1.2 }}>
              {room.coworking}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--chat-text-2)', marginTop: 2 }}>
              {room.name} · {room.capacity}p · {room.credits} créd.
            </div>
            <button onClick={() => onReservar?.(room)} style={cardActionBtn}>
              <MI.Clipboard /> Reservar
            </button>
          </div>
          <span style={{ fontSize: 11, color: 'var(--chat-text-3)', alignSelf: 'flex-end' }}>{time}</span>
        </div>
      </BubbleWrap>);
    }

    const row = (emoji, label, value) => (
      <div style={{ display: 'flex', gap: 6, marginTop: 7, fontSize: 14, color: 'var(--chat-text)', lineHeight: 1.4 }}>
        <span style={{ flexShrink: 0 }}>{emoji}</span>
        <span><b style={{ fontWeight: 600 }}>{label}:</b>{' '}<span style={{ color: 'var(--chat-text-2)' }}>{value}</span></span>
      </div>
    );

    return (
      <BubbleWrap side="bot" padded={false}>
      <div style={{ width: 300 }}>
        <img src={room.image} alt="" style={{
            width: '100%', height: 200, objectFit: 'cover',
            borderRadius: '0 12px 0 0',
            display: 'block'
          }} />
        <div style={{ padding: '10px 12px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 15.5 }}>
            <span style={{ fontSize: 16 }}>🏢</span>
            <span>{room.coworking}</span>
          </div>

          {!expanded ? (
            <div style={{ marginTop: 8, fontSize: 14, color: 'var(--chat-text)', lineHeight: 1.45 }}>
              <span>🏷️ </span>
              <b style={{ fontWeight: 600 }}>Nome da Sala:</b>{' '}
              <span style={{ color: 'var(--chat-text-2)' }}>{room.name.slice(0, 11)}...</span>{' '}
              <span
                onClick={() => setExpanded(true)}
                style={{ color: 'var(--chat-link)', fontWeight: 600, cursor: 'pointer' }}
              >Ler mais</span>
            </div>
          ) : (
            <div style={{ marginTop: 6 }}>
              {row('🏷️', 'Nome da Sala', room.name)}
              {row('👥', 'Capacidade', `${room.capacity} pessoas`)}
              {row('💰', 'Créditos', String(room.credits))}
              {room.date && row('📅', 'Data', room.date)}
              {room.inicio && row('⏰', 'Início', `${room.inicio} - Fim: ${room.fim}`)}
              {room.address && row('📍', 'Endereço', room.address)}
              {room.amenities && row('✨', 'Amenidades', room.amenities)}
            </div>
          )}

          <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--chat-text-3)', marginTop: 6 }}>{time}</div>
        </div>
        <div style={{
            borderTop: '1px solid var(--chat-divider)',
            padding: '11px 10px',
            textAlign: 'center'
          }}>
          <button onClick={() => onReservar?.(room)} style={{
              background: 'transparent', border: 0,
              color: 'var(--chat-link)', fontSize: 15, fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: 0
            }}>
            <MI.Clipboard /> Reservar
          </button>
        </div>
      </div>
    </BubbleWrap>);
  }

  /* ─────────── Carousel — horizontal scroll of mini cards inside one bubble ─────────── */
  function RoomCarousel({ rooms, time, onReservar }) {
    return (
      <BubbleWrap side="bot" padded={false}>
      <div style={{ padding: 8 }}>
        <div style={{
            display: 'flex', gap: 8, overflowX: 'auto',
            paddingBottom: 4,
            scrollSnapType: 'x mandatory'
          }}>
          {rooms.map((r) =>
            <div key={r.id} style={{
              width: 200, flexShrink: 0,
              background: 'var(--chat-bubble-bot-2)',
              borderRadius: 8, overflow: 'hidden',
              scrollSnapAlign: 'start'
            }}>
              <img src={r.image} alt="" style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.coworking}</div>
                <div style={{ fontSize: 12, color: 'var(--chat-text-2)', marginTop: 2 }}>
                  {r.capacity}p · {r.credits} créd.
                </div>
                <button onClick={() => onReservar?.(r)} style={{
                  marginTop: 8, width: '100%',
                  background: '#0e2418', color: 'var(--chat-link)',
                  border: 0, padding: '7px 0',
                  borderRadius: 6, fontWeight: 600, fontSize: 13
                }}>Reservar</button>
              </div>
            </div>
            )}
        </div>
        <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--chat-text-3)', padding: '2px 4px 0' }}>{time}</div>
      </div>
    </BubbleWrap>);

  }

  /* ─────────── Inline-buttons card (alternate flow style) ─────────── */
  function InlineActionCard({ room, time, onReservar, onDetalhes }) {
    return (
      <BubbleWrap side="bot" padded={false}>
      <div style={{ width: 290 }}>
        <img src={room.image} alt="" style={{
            width: '100%', height: 160, objectFit: 'cover',
            borderRadius: '0 12px 0 0', display: 'block'
          }} />
        <div style={{ padding: '10px 12px 4px' }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{room.coworking}</div>
          <div style={{ fontSize: 13, color: 'var(--chat-text-2)', marginTop: 2 }}>
            {room.name} · {room.capacity}p · {room.credits} créd.
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--chat-text-3)', marginTop: 4 }}>{time}</div>
        </div>
        <div style={{ display: 'flex', borderTop: '1px solid var(--chat-divider)' }}>
          <button onClick={() => onDetalhes?.(room)} style={inlineBtnLeft}>Detalhes</button>
          <button onClick={() => onReservar?.(room)} style={inlineBtnRight}>Reservar</button>
        </div>
      </div>
    </BubbleWrap>);

  }

  /* ─────────── Flow-reply chip in chat (user response to Flow) ─────────── */
  function FlowReply({ time, label = 'Reservar' }) {
    return (
      <BubbleWrap side="user" padded={false}>
      <div style={{
          padding: '8px 10px',
          display: 'flex', alignItems: 'center', gap: 10,
          minWidth: 230
        }}>
        <div style={{
            width: 36, height: 36, background: '#0b3327', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--chat-link)'
          }}>
          <MI.Clipboard />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.95)' }}>{label}</div>
          <div style={{ fontSize: 12.5, color: 'rgba(220,240,225,0.65)' }}>Resposta enviada</div>
        </div>
        <span style={{
            fontSize: 11, color: 'rgba(220,240,225,0.7)',
            display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-end'
          }}>
          {time} <MI.Check2 style={{ color: 'rgba(220,240,225,0.7)' }} />
        </span>
      </div>
    </BubbleWrap>);

  }

  /* ─────────── Quick reply chips below latest bot message ─────────── */
  function QuickReplies({ items, onPick }) {
    if (!items || !items.length) return null;
    return (
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 6,
        padding: '4px 12px 6px 12px',
        justifyContent: 'flex-end'
      }}>
      {items.map((t, i) =>
        <button key={i} onClick={() => onPick(t)} style={{
          background: 'rgba(95,208,122,0.12)',
          border: '1px solid rgba(95,208,122,0.55)',
          color: 'var(--chat-link)',
          padding: '6px 12px',
          borderRadius: 999,
          fontSize: 13, fontWeight: 500
        }}>{t}</button>
        )}
    </div>);

  }

  /* ─────────── Inline quick-actions card (alt flow mode) ─────────── */
  function InlineChoicesCard({ title, options, time, onPick }) {
    return (
      <BubbleWrap side="bot" padded={false}>
      <div style={{ padding: '10px 12px', width: 260 }}>
        <div style={{ fontWeight: 500, fontSize: 14.5 }}>{title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
          {options.map((o, i) =>
            <button key={i} onClick={() => onPick(o)} style={{
              background: 'transparent', border: 0,
              color: 'var(--chat-link)', fontWeight: 600, fontSize: 14.5,
              textAlign: 'left',
              padding: '8px 6px', borderTop: i > 0 ? '1px solid var(--chat-divider)' : 0,
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <MI.Clipboard /> {o.label}
            </button>
            )}
        </div>
        <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--chat-text-3)', marginTop: 4 }}>{time}</div>
      </div>
    </BubbleWrap>);

  }

  /* ─────────── Sticky shared button styles ─────────── */
  const cardActionBtn = {
    marginTop: 6,
    background: 'transparent', border: 0,
    color: 'var(--chat-link)', fontWeight: 600, fontSize: 13.5,
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: 0
  };
  const inlineBtnLeft = {
    flex: 1, background: 'transparent', border: 0,
    color: 'var(--chat-link)', padding: '11px 0',
    fontWeight: 500, fontSize: 14.5,
    borderRight: '1px solid var(--chat-divider)'
  };
  const inlineBtnRight = {
    flex: 1, background: 'transparent', border: 0,
    color: 'var(--chat-link)', padding: '11px 0',
    fontWeight: 500, fontSize: 14.5
  };

  Object.assign(window, {
    DayDivider, TextMsg, Typing, RoomCard, RoomCarousel,
    InlineActionCard, FlowReply, QuickReplies, InlineChoicesCard
  });

})();