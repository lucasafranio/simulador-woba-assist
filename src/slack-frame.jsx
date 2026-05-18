(function () {
// slack-frame.jsx — Desktop Slack window shell
// Exposes: SlackWorkspace, SlackSidebar, SlackChannelHeader, SlackInputBar, SlackEmptyState

/* ─── Workspace window ─── */
function SlackWorkspace({ children }) {
  return (
    <div style={{
      width: 920, height: 640,
      borderRadius: 12,
      overflow: 'hidden',
      background: '#1a1d21',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
    }}>
      {children}
    </div>
  );
}

/* ─── Left sidebar ─── */
function SlackSidebar() {
  const txt  = '#ababad';
  const act  = '#ffffff';
  const bg   = '#19171d';
  const abg  = 'rgba(255,255,255,0.09)';

  const Ch = ({ name, active, badge }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7,
      padding: '3px 10px 3px 16px', borderRadius: 6, margin: '1px 8px',
      background: active ? abg : 'transparent',
      color: active ? act : txt,
      fontSize: 14, fontWeight: active ? 600 : 400, cursor: 'pointer',
    }}>
      <span style={{ color: active ? '#d1d2d3' : 'rgba(171,171,173,0.6)', fontSize: 15, lineHeight: 1 }}>#</span>
      <span style={{ flex: 1 }}>{name}</span>
      {badge && (
        <span style={{
          background: '#de1b53', color: '#fff',
          fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 10, minWidth: 16, textAlign: 'center',
        }}>{badge}</span>
      )}
    </div>
  );

  const Dm = ({ name, emoji = '👤', active, online }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '3px 10px 3px 16px', borderRadius: 6, margin: '1px 8px',
      background: active ? abg : 'transparent',
      color: active ? act : txt,
      fontSize: 14, fontWeight: active ? 600 : 400, cursor: 'pointer',
    }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 18, height: 18, borderRadius: 4,
          background: active ? 'linear-gradient(135deg,#4a154b,#7c3aed)' : 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
        }}>{emoji}</div>
        {online && (
          <span style={{
            position: 'absolute', bottom: -1, right: -1,
            width: 7, height: 7, borderRadius: '50%',
            background: '#2faa4a', border: '1.5px solid ' + bg,
          }}/>
        )}
      </div>
      <span style={{ flex: 1 }}>{name}</span>
    </div>
  );

  const Label = ({ t }) => (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
      textTransform: 'uppercase', color: 'rgba(171,171,173,0.5)',
      padding: '10px 16px 4px',
    }}>{t}</div>
  );

  return (
    <div style={{
      width: 220, flexShrink: 0,
      background: bg,
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      fontFamily: 'var(--font-ui)',
    }}>
      {/* Workspace header */}
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
            Woba Workspace
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(171,171,173,0.7)" strokeWidth="2.4">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
          <div style={{ fontSize: 12, color: txt, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2faa4a', display: 'inline-block', flexShrink: 0 }}/>
            Marina
          </div>
        </div>
        <button style={{
          background: 'rgba(255,255,255,0.07)', border: 0, color: txt,
          width: 28, height: 28, borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 12 }}>
        <Label t="Canais"/>
        <Ch name="geral"/>
        <Ch name="woba-assist" active/>
        <Ch name="suporte" badge={2}/>
        <Ch name="reservas"/>
        <div style={{ padding: '4px 16px', margin: '2px 8px', fontSize: 13.5, color: 'rgba(171,171,173,0.55)', cursor: 'pointer' }}>
          + Adicionar canais
        </div>

        <Label t="Mensagens diretas"/>
        <Dm name="Woba Assist" emoji="🤖" online/>
        <Dm name="Joana Maciel" emoji="👩" online/>
        <Dm name="Pedro Silva" emoji="👨"/>

        <Label t="Apps"/>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '3px 10px 3px 16px', borderRadius: 6, margin: '1px 8px',
          color: 'rgba(171,171,173,0.55)', fontSize: 14, cursor: 'pointer',
        }}>
          <span style={{ fontSize: 15 }}>⊕</span>
          <span>Adicionar apps</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Channel header ─── */
function SlackChannelHeader({ channelName = 'woba-assist' }) {
  return (
    <div style={{
      flexShrink: 0, height: 49,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center',
      padding: '0 16px', gap: 10,
      background: '#1a1d21',
    }}>
      <span style={{ color: '#ababad', fontSize: 20, fontWeight: 300, lineHeight: 1 }}>#</span>
      <div>
        <span style={{ fontWeight: 700, fontSize: 14.5, color: '#ffffff' }}>{channelName}</span>
        <span style={{ fontSize: 12, color: '#ababad', marginLeft: 10 }}>
          Assistente de reservas e suporte · 12 membros
        </span>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
        {[
          <svg key="s" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></svg>,
          <svg key="p" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
        ].map((ico, i) => (
          <button key={i} style={{
            background: 'transparent', border: 0, color: '#ababad',
            width: 30, height: 30, borderRadius: 6, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{ico}</button>
        ))}
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', alignSelf: 'center', margin: '0 4px' }}/>
        <button style={{
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
          color: '#d1d2d3', padding: '5px 10px', borderRadius: 4,
          fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span>ℹ️</span> Detalhes
        </button>
      </div>
    </div>
  );
}

/* ─── Input bar ─── */
function SlackInputBar({ value, onChange, onSend, channelName = 'woba-assist' }) {
  const hasText = (value || '').trim().length > 0;
  const isSlash = (value || '').startsWith('/');

  return (
    <div style={{ flexShrink: 0, padding: '8px 16px 14px', background: '#1a1d21' }}>
      <div style={{
        background: '#222529',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: 8, overflow: 'visible', position: 'relative',
      }}>
        {/* Slash command hint */}
        {isSlash && (
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: '100%', marginBottom: 4,
            background: '#2a2d31', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '6px 12px',
            fontSize: 12.5, color: '#ababad',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              padding: '1px 5px', borderRadius: 3, fontWeight: 700, fontSize: 12,
            }}>/</span>
            Comandos disponíveis: <code style={{ color: '#4fc1e9' }}>/reservar</code>
            <code style={{ color: '#4fc1e9', marginLeft: 8 }}>/ajuda</code>
            <code style={{ color: '#4fc1e9', marginLeft: 8 }}>/chamado</code>
            <code style={{ color: '#4fc1e9', marginLeft: 8 }}>/status</code>
          </div>
        )}

        {/* Formatting toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 1,
          padding: '5px 8px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {[['B','bold',700,'normal','none'],['I','italic',400,'italic','none'],['S','strike',400,'normal','line-through']].map(([l,k,w,fs,td]) => (
            <button key={k} style={{
              background: 'transparent', border: 0, color: '#ababad',
              fontWeight: w, fontStyle: fs, textDecoration: td,
              width: 24, height: 24, borderRadius: 4, fontSize: 12.5, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{l}</button>
          ))}
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)', margin: '0 3px' }}/>
          {['🔗','•','≡'].map((t, i) => (
            <button key={i} style={{
              background: 'transparent', border: 0, color: '#ababad',
              width: 24, height: 24, borderRadius: 4, fontSize: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{t}</button>
          ))}
        </div>

        {/* Input row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, padding: '6px 8px 6px' }}>
          <input
            value={value || ''}
            onChange={e => onChange?.(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend?.(); } }}
            placeholder={`Mensagem #${channelName}`}
            style={{
              flex: 1, background: 'transparent', border: 0, outline: 0,
              color: '#d1d2d3', fontFamily: 'var(--font-ui)',
              fontSize: 14.5, padding: '4px 0', lineHeight: 1.5,
              caretColor: '#d1d2d3',
            }}
          />
          <div style={{ display: 'flex', gap: 2, paddingBottom: 2, flexShrink: 0 }}>
            {['+','😊','📎'].map((t, i) => (
              <button key={i} style={{
                background: 'transparent', border: 0, color: '#ababad',
                width: 28, height: 28, borderRadius: 4, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{t}</button>
            ))}
            <button onClick={onSend} style={{
              background: hasText ? '#007a5a' : 'rgba(255,255,255,0.05)',
              border: 0, width: 28, height: 28, borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: hasText ? '#fff' : '#616061',
              transition: 'all 0.12s', cursor: hasText ? 'pointer' : 'default',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Empty state ─── */
function SlackEmptyState({ agent, onPickScenario }) {
  return (
    <div style={{
      padding: '48px 24px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', fontFamily: 'var(--font-ui)',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 16, marginBottom: 16,
        background: 'linear-gradient(135deg, #4a154b 0%, #7c3aed 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
      }}>🤖</div>
      <div style={{ fontWeight: 700, fontSize: 18, color: '#ffffff', marginBottom: 6 }}>
        {agent} · Woba Assist
      </div>
      <div style={{ fontSize: 14, color: '#ababad', maxWidth: 300, lineHeight: 1.5, marginBottom: 16 }}>
        Use{' '}
        <code style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 3, color: '#4fc1e9' }}>/ajuda</code>
        {' '}para ver os comandos, ou escolha um dos{' '}
        <b style={{ color: '#ffffff' }}>21 cenários</b> para ver as propostas em ação.
      </div>
      <button onClick={onPickScenario} style={{
        background: '#007a5a', border: 0, color: '#fff',
        padding: '9px 18px', borderRadius: 4,
        fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z"/>
        </svg>
        Ver cenários
      </button>
    </div>
  );
}

Object.assign(window, {
  SlackWorkspace, SlackSidebar, SlackChannelHeader, SlackInputBar, SlackEmptyState,
});

})();
