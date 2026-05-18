(function(){
// ChatFrame.jsx — Android-style phone shell, status bar and chat header
// Original frame; not branded as any specific messaging app.

const { Icons: I } = window;

/* ─────────── Phone shell ─────────── */
function Phone({ children }) {
  return (
    <div style={{
      width: 412, height: 892,
      borderRadius: 44, overflow: 'hidden',
      background: '#000',
      border: '8px solid #1c1c1c',
      boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.35), inset 0 0 0 1px #2b2b2b',
      position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 38, pointerEvents: 'none',
        boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.06)',
        zIndex: 50,
      }}/>
      {children}
    </div>
  );
}

/* ─────────── Status bar ─────────── */
function StatusBar() {
  return (
    <div style={{
      flexShrink: 0,
      height: 36, paddingTop: 6,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '6px 20px 0',
      background: 'var(--chat-header)',
      color: '#e9efe9',
      fontFamily: 'var(--font-chat)',
      fontSize: 14, fontWeight: 600,
      position: 'relative',
      letterSpacing: '0.01em',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>11:19</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: '#0f3a23', color: '#5fd07a',
          padding: '2px 8px', borderRadius: 8,
          fontSize: 11, fontWeight: 600,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 19l8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Default Me
        </span>
      </div>
      {/* camera punch hole */}
      <div style={{
        position: 'absolute', left: '50%', top: 12, transform: 'translateX(-50%)',
        width: 11, height: 11, borderRadius: '50%', background: '#000',
      }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#dde3dd' }}>
        <I.Volume/>
        <I.Wifi/>
        <I.Cell/>
        <I.Battery/>
      </div>
    </div>
  );
}

/* ─────────── Conversation header ─────────── */
function ChatHeader({ agentName = 'Sofia', subtitle = 'Woba Assist - HML', avatarStyle = 'logo' }) {
  return (
    <div style={{
      flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '6px 8px 10px 4px',
      background: 'var(--chat-header)',
      color: 'var(--chat-text)',
      borderBottom: '1px solid #0007',
      fontFamily: 'var(--font-chat)',
    }}>
      <button aria-label="back" style={{
        width: 36, height: 36, background: 'transparent', border: 0, color: 'var(--chat-text)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 0, margin: '0 2px 0 4px',
      }}>
        <I.Back/>
      </button>
      <Avatar style={avatarStyle}/>
      <div style={{ flex: 1, minWidth: 0, marginLeft: 4 }}>
        <div style={{
          fontSize: 16.5, fontWeight: 600, lineHeight: 1.15,
          color: 'var(--chat-text)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>Woba Staging</div>
        <div style={{
          fontSize: 12.5, color: 'var(--chat-text-3)',
          marginTop: 2,
        }}>{subtitle}</div>
      </div>
      <button aria-label="more" style={{
        width: 40, height: 40, background: 'transparent', border: 0, color: 'var(--chat-text)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I.More/>
      </button>
    </div>
  );
}

function Avatar({ style }) {
  const size = 40;
  if (style === 'initials') {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: '#2b3a2f', color: '#cbe5cf',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 15,
        letterSpacing: '0.02em',
      }}>SO</div>
    );
  }
  if (style === 'ai') {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #a768ff 0%, #5d16c2 70%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M12 2l2.2 5.3L20 9l-4.5 3.5L17 19l-5-3-5 3 1.5-6.5L4 9l5.8-1.7L12 2z"/>
        </svg>
      </div>
    );
  }
  // logo (Woba yellow)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--w-yellow)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 800,
      color: 'var(--w-yellow-fg)',
      fontSize: 13, letterSpacing: '-0.02em',
    }}>
      <span style={{ transform: 'translateY(0.5px)' }}>woba</span>
    </div>
  );
}

window.Phone = Phone;
window.StatusBar = StatusBar;
window.ChatHeader = ChatHeader;
window.Avatar = Avatar;

})();
