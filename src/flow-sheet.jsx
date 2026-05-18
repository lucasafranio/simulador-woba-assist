(function(){
// FlowSheet.jsx — Bottom-sheet "Confirmar" flow that appears
// when the user taps Reservar on a room card.

const { Icons: FI } = window;

function FlowSheet({ open, room, onClose, onConfirm, mode = 'sheet' }) {
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    if (open) setClosing(false);
  }, [open]);

  if (!open && !closing) return null;

  const close = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose?.(); }, 200);
  };
  const confirm = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onConfirm?.(room); }, 200);
  };

  const isFull = mode === 'full';

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 40,
      display: 'flex', flexDirection: 'column',
      pointerEvents: open && !closing ? 'auto' : 'none',
    }}>
      {/* Backdrop */}
      <div onClick={close} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        opacity: open && !closing ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}/>

      <div style={{
        marginTop: isFull ? 0 : 90,
        background: '#1a2520',
        borderRadius: isFull ? 0 : '16px 16px 0 0',
        flex: 1, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        transform: open && !closing ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 240ms cubic-bezier(0.2, 0, 0, 1)',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.4)',
        color: 'var(--chat-text)',
        fontFamily: 'var(--font-chat)',
      }}>
        {/* drag handle */}
        {!isFull && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
            <div style={{ width: 38, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }}/>
          </div>
        )}
        {/* header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px 4px',
        }}>
          <button onClick={close} style={iconBtn} aria-label="close">
            <FI.Close/>
          </button>
          <div style={{ fontWeight: 600, fontSize: 17 }}>Confirmar</div>
          <button style={iconBtn} aria-label="more">
            <FI.More/>
          </button>
        </div>

        {/* progress */}
        <div style={{ padding: '8px 16px 4px', display: 'flex', gap: 6 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--chat-accent)' }}/>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }}/>
        </div>

        {/* scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 16px' }}>
          {room && (
            <>
              <img src={room.image} alt="" style={{
                width: '100%', height: 200, objectFit: 'cover', borderRadius: 10, display: 'block',
              }}/>
              <h2 style={{
                fontSize: 22, fontWeight: 700, margin: '14px 0 10px',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.01em',
              }}>
                {room.coworking}
              </h2>
              <FlowRow>Sala: {room.name} - {room.capacity} pessoas</FlowRow>
              <FlowRow>Créditos: {room.credits}</FlowRow>
              <FlowRow>Quando:&nbsp; {room.date} - {room.start}-{room.end}</FlowRow>
              <FlowRow>Endereço: {room.address}</FlowRow>

              <button style={{
                marginTop: 14,
                background: 'transparent', border: 0,
                color: 'var(--chat-link)', fontWeight: 600, fontSize: 15,
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <FI.External/> Ver mapa
              </button>
            </>
          )}
        </div>

        {/* footer CTA */}
        <div style={{ padding: '8px 16px 12px' }}>
          <button onClick={confirm} style={{
            width: '100%', background: 'var(--chat-accent)',
            color: '#0a1d12', fontWeight: 700, fontSize: 16,
            border: 0, borderRadius: 999, padding: '14px 0',
            fontFamily: 'var(--font-chat)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}>
            Solicitar Reserva
          </button>
        </div>

        {/* gerenciada by */}
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
          <div style={{ flex: 1 }}>Gerenciada por Woba Assist - HML.</div>
          <span style={{ color: 'var(--chat-link)', fontWeight: 600 }}>Saiba mais</span>
        </div>
      </div>
    </div>
  );
}

function FlowRow({ children }) {
  return (
    <div style={{
      padding: '10px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      fontSize: 15, lineHeight: 1.5,
    }}>{children}</div>
  );
}

const iconBtn = {
  width: 34, height: 34, padding: 0,
  background: 'transparent', border: 0,
  color: 'var(--chat-text)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

window.FlowSheet = FlowSheet;

})();
