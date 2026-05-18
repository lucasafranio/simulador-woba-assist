// scenario-sidebar.jsx — Slide-out drawer to browse and play all 14 scenarios.
// Anchored bottom-left of the stage. Has search, grouped list, and Reset action.

(function () {

const { useState, useMemo } = React;

function ScenarioSidebar({ open, scenarios, activeId, onPick, onClose, onReset, onPlay, platform = 'whatsapp', onPlatformChange, autoplay = true, onAutoplayChange }) {
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState(false);

  const copyLink = () => {
    const url = window.location.href;
    // Show toast immediately (synchronous)
    setToast(true);
    setTimeout(() => setToast(false), 1800);
    // Best-effort copy
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {
        try {
          const ta = document.createElement('textarea');
          ta.value = url; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
          document.body.appendChild(ta); ta.focus(); ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        } catch (_) {}
      });
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byPlatform = scenarios.filter(s => (s.platform || 'whatsapp') === platform);
    if (!q) return byPlatform;
    return byPlatform.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.p.toLowerCase().includes(q)
    );
  }, [scenarios, query, platform]);

  // Group by category
  const groups = useMemo(() => {
    const map = new Map();
    filtered.forEach(s => {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category).push(s);
    });
    return [...map.entries()];
  }, [filtered]);

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: open ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0)',
        pointerEvents: open ? 'auto' : 'none',
        transition: 'background 220ms ease',
        zIndex: 100,
      }}/>

      {/* Drawer */}
      <aside style={{
        position: 'fixed', top: 16, left: 16, bottom: 16,
        width: 340, maxWidth: 'calc(100vw - 32px)',
        zIndex: 101,
        background: '#fafaf7',
        color: '#1a1810',
        borderRadius: 16,
        boxShadow: '0 30px 80px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.4) inset',
        transform: open ? 'translateX(0)' : 'translateX(calc(-100% - 24px))',
        transition: 'transform 240ms cubic-bezier(0.2, 0, 0, 1)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'var(--font-ui)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 18px 12px',
          borderBottom: '1px solid #e3e2dc',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 22, letterSpacing: '-0.02em', color: '#000',
              lineHeight: 1,
            }}>Cenários</span>
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#71716a',
              background: '#f1f1ed', padding: '3px 8px', borderRadius: 999,
              letterSpacing: '0.04em',
            }}>{filtered.length}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              <button onClick={copyLink} title="Copiar link para este cenário" style={{
                background: 'transparent', border: 0,
                color: '#71716a', cursor: 'pointer', padding: 4,
                width: 28, height: 28, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
              </button>
              <button onClick={onClose} style={{
                background: 'transparent', border: 0,
                color: '#71716a', cursor: 'pointer', padding: 4,
                width: 28, height: 28, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }} aria-label="close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 5l14 14M19 5L5 19"/></svg>
              </button>
            </div>
          </div>

          {/* Platform toggle */}
          <div style={{ display: 'flex', gap: 5 }}>
            {[['whatsapp','💬 WhatsApp'],['slack','⚡ Slack']].map(([p, label]) => (
              <button key={p} onClick={() => onPlatformChange?.(p)} style={{
                flex: 1, padding: '7px 8px',
                background: platform === p ? '#1a1810' : '#fff',
                color: platform === p ? '#fff' : '#71716a',
                border: '1px solid ' + (platform === p ? '#1a1810' : '#e3e2dc'),
                borderRadius: 8, fontSize: 12.5, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}>{label}</button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#95948f" strokeWidth="2"
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar cenário…"
              style={{
                width: '100%', background: '#fff',
                border: '1px solid #e3e2dc', borderRadius: 8,
                fontSize: 14, padding: '9px 10px 9px 32px',
                fontFamily: 'inherit', color: '#1a1810',
                outline: 'none',
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{
                position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: 0, color: '#95948f',
                width: 22, height: 22, borderRadius: 4, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l14 14M19 5L5 19"/></svg>
              </button>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div style={{
          padding: '10px 14px',
          background: '#f8f8f6',
          borderBottom: '1px solid #e3e2dc',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onReset} style={{
              flex: 1, background: '#fff',
              border: '1px solid #e3e2dc',
              color: '#1a1810', fontSize: 12.5, fontWeight: 600,
              padding: '7px 10px', borderRadius: 7,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.3L3 9"/><path d="M3 4v5h5"/></svg>
              Conversa livre
            </button>
            {activeId && (
              <button onClick={() => onPlay(activeId)} style={{
                flex: 1, background: '#000', color: '#fff',
                border: '1px solid #000', fontSize: 12.5, fontWeight: 600,
                padding: '7px 10px', borderRadius: 7,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center',
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l16 9-16 9z"/></svg>
                Repetir
              </button>
            )}
          </div>

          {/* Autoplay toggle */}
          <button onClick={() => onAutoplayChange?.(!autoplay)} style={{
            width: '100%', background: 'transparent',
            border: '1px solid #e3e2dc', borderRadius: 7,
            padding: '7px 10px', cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {autoplay
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a1810" strokeWidth="2.2" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a1810" strokeWidth="2.2" strokeLinecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              }
              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1810' }}>
                {autoplay ? 'Autoplay ativado' : 'Manual — clique Próximo'}
              </span>
            </div>
            {/* pill indicator */}
            <div style={{
              width: 32, height: 18, borderRadius: 999,
              background: autoplay ? '#1a1810' : '#e3e2dc',
              position: 'relative', flexShrink: 0,
              transition: 'background 180ms',
            }}>
              <div style={{
                position: 'absolute', top: 3,
                left: autoplay ? 'calc(100% - 15px)' : 3,
                width: 12, height: 12, borderRadius: '50%',
                background: '#fff',
                transition: 'left 180ms',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}/>
            </div>
          </button>
        </div>

        {/* List */}
        <div style={{
          flex: 1, minHeight: 0, overflowY: 'auto',
          padding: '6px 8px 16px',
        }}>
          {filtered.length === 0 && (
            <div style={{ padding: 24, color: '#95948f', textAlign: 'center', fontSize: 13 }}>
              Nenhum cenário encontrado.
            </div>
          )}
          {groups.map(([cat, items], gi) => (
            <div key={cat} style={{ marginTop: gi === 0 ? 6 : 14 }}>
              <div style={{
                fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
                color: '#95948f', textTransform: 'uppercase',
                padding: '6px 10px',
              }}>{cat}</div>
              {items.map(s => (
                <button key={s.id} onClick={() => onPick(s)} style={{
                  width: '100%', background: 'transparent',
                  border: 0, padding: 0, cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'left',
                }}>
                  <div style={{
                    padding: '11px 10px',
                    background: s.id === activeId ? '#fff' : 'transparent',
                    border: '1px solid ' + (s.id === activeId ? '#1a1810' : 'transparent'),
                    borderRadius: 10,
                    margin: '2px 0',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: s.color,
                      }}/>
                      <span style={{
                        fontFamily: 'ui-monospace, Menlo, monospace',
                        fontSize: 10.5, color: '#95948f',
                        letterSpacing: '0.04em',
                      }}>{s.p}</span>
                      <span style={{
                        fontWeight: 600, fontSize: 14, color: '#1a1810',
                      }}>{s.title}</span>
                    </div>
                    <div style={{
                      fontSize: 12.5, color: '#4e4d45', lineHeight: 1.4,
                      paddingLeft: 16,
                    }}>{s.summary}</div>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid #e3e2dc',
          fontSize: 11.5, color: '#71716a',
          background: '#f8f8f6',
        }}>
          Toque num cenário pra reproduzir no simulador.
        </div>
      </aside>

      {/* Toast */}
      <div style={{
        position: 'fixed', bottom: 24, left: '50%',
        transform: `translateX(-50%) translateY(${toast ? 0 : 12}px)`,
        opacity: toast ? 1 : 0,
        pointerEvents: 'none',
        zIndex: 200,
        transition: 'opacity 200ms ease, transform 200ms ease',
      }}>
        <div style={{
          background: '#1a1810',
          color: '#fff',
          fontSize: 13.5, fontWeight: 600,
          padding: '10px 18px',
          borderRadius: 999,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-ui)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5fd07a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7"/>
          </svg>
          Copiado com sucesso
        </div>
      </div>
    </>
  );
}

/* ─────────── Trigger button — bottom-left of viewport ─────────── */
function ScenarioTrigger({ onClick, count, platform = 'whatsapp' }) {
  const isSlack = platform === 'slack';
  return (
    <button onClick={onClick} style={{
      position: 'fixed', left: 16, bottom: 16,
      zIndex: 50,
      background: isSlack ? '#4a154b' : '#000', color: '#fff',
      border: 0, borderRadius: 999,
      padding: '11px 16px',
      fontFamily: 'var(--font-ui)', fontSize: 13.5, fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 9,
      boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
      transition: 'background 0.2s',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z"/>
      </svg>
      {isSlack ? '⚡' : '💬'} Cenários
      <span style={{
        background: isSlack ? '#e8b0e8' : '#f9e10d',
        color: isSlack ? '#4a154b' : '#1a1810',
        fontSize: 11, fontWeight: 700,
        padding: '2px 7px', borderRadius: 999,
        letterSpacing: '0.02em',
      }}>{count}</span>
    </button>
  );
}

window.ScenarioSidebar = ScenarioSidebar;
window.ScenarioTrigger = ScenarioTrigger;

})();
