// app.jsx — Woba Assist chat simulator (WhatsApp + Slack)

const { useState, useEffect, useRef, useMemo, useCallback } = React;
const {
  Phone, StatusBar, ChatHeader,
  Icons: AI,
  DayDivider, TextMsg, Typing, RoomCard, RoomCarousel,
  InlineActionCard, FlowReply, QuickReplies, InlineChoicesCard,
  FlowSheet,
  InfoCard, PillRoomCard, GiftCard, AppScreenCard, TicketStatusCard, RSVPCard,
  LocationCard, VoiceMessage, ScenarioSheet,
  ScenarioSidebar, ScenarioTrigger,
  TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakSelect, TweakButton,
  // Slack components
  SlackWorkspace, SlackSidebar, SlackChannelHeader, SlackInputBar, SlackEmptyState,
  SlackMessage, SlackUserMessage, SlackSlashCmd,
  SlackTyping, SlackDivider, SlackActionsBlock,
  SlackInfoBlock, SlackRoomBlock, SlackRSVPBlock,
  SlackTicketBlock, SlackGiftBlock, SlackFlowReply,
  SlackAppScreenBlock, SlackLocationBlock, SlackVoiceBlock,
  SlackModal,
  renderSlackText,
} = window;

const SCENARIOS = window.ALL_SCENARIOS || window.SCENARIOS;

/* ─────────── Default reservation rooms ─────────── */
const ROOMS = [
  {
    id: 'r1', coworking: 'Tribbos Coworking', name: 'sala de reunião 02',
    capacity: 5, credits: 7.0,
    date: '16/05/2026', start: '10:00', end: '17:00',
    address: 'Avenida Marechal Floriano Peixoto, 720 — Centro',
    amenities: 'Wi-Fi, Café, Ar condicionado',
    image: 'assets/room-1.svg',
  },
  {
    id: 'r2', coworking: 'Vila Olímpia Hub', name: 'sala criativa 04',
    capacity: 6, credits: 8.5,
    date: '16/05/2026', start: '10:00', end: '17:00',
    address: 'R. Gomes de Carvalho, 1510 — Vila Olímpia, SP',
    amenities: 'Wi-Fi, Café, TV, Ar condicionado',
    image: 'assets/room-2.svg',
  },
  {
    id: 'r3', coworking: 'WorkBricks Itaim', name: 'sala executiva',
    capacity: 8, credits: 9.0,
    date: '16/05/2026', start: '10:00', end: '17:00',
    address: 'R. Joaquim Floriano, 466 — Itaim Bibi, SP',
    amenities: 'Wi-Fi, Café, Tela 75", Ar condicionado',
    image: 'assets/room-3.svg',
  },
];

/* ─────────── Tweak defaults ─────────── */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "agent": "Sofia",
  "tone": "casual",
  "cardStyle": "rich",
  "flowMode": "sheet",
  "quickReplies": true,
  "avatar": "logo",
  "showTyping": true,
  "platform": "whatsapp",
  "autoplay": true
}/*EDITMODE-END*/;

/* ─────────── Scripts per tone (default conversation flow) ─────────── */
const SCRIPTS = {
  casual: {
    greeting: (a) => `Oi! Tudo bem? 😊 Eu sou a ${a}, assistente da Woba — ajudo a encontrar salas de reunião pra você reservar com facilidade.\n\nPra começar, me conta o que você precisa:\n📍 Onde (cidade, bairro ou coworking)\n👥 Pra quantas pessoas\n📅 Qual dia\n⏰ Horário de início e fim`,
    acknowledge: (cw) => `Anotado! Deixa eu dar uma olhada no que tem disponível${cw ? ' no ' + cw : ''} pra você 🙂`,
    presentRooms: 'Encontrei algumas opções pra você. Dá uma olhada e me diz se alguma serve! Se tiver dúvida, é só chamar 😊',
    bookingSubmitted: 'Solicitação da Reserva enviada!\n\n**Você receberá a confirmação por e-mail, app e por aqui em breve.**',
  },
  formal: {
    greeting: (a) => `Olá. Sou ${a}, assistente virtual da Woba. Estou aqui para ajudá-lo a localizar e reservar salas de reunião.\n\nPara iniciarmos, por favor me informe:\n• Localidade (cidade, bairro ou coworking)\n• Número de participantes\n• Data desejada\n• Horários de início e fim`,
    acknowledge: (cw) => `Informações registradas. Vou consultar a disponibilidade${cw ? ' em ' + cw : ''}.`,
    presentRooms: 'Encontrei as seguintes opções disponíveis. Selecione a que melhor atender suas necessidades.',
    bookingSubmitted: 'Solicitação de reserva registrada.\n\n**A confirmação será enviada por e-mail, aplicativo e por esta conversa.**',
  },
  objetivo: {
    greeting: () => `Pra achar a sala certa, me passa:\n📍 Local · 👥 Pessoas · 📅 Dia · ⏰ Horário`,
    acknowledge: (cw) => `Buscando${cw ? ' em ' + cw : ''}...`,
    presentRooms: 'Opções encontradas:',
    bookingSubmitted: 'Reserva enviada. Confirmação no e-mail e app.',
  },
};

/* ─────────── Time + id helpers ─────────── */
const fmt = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
let _t = { h: 14, m: 28 };
const setTime = (h, m) => { _t = { h, m }; };
const nextTime = () => { _t = { ..._t }; _t.m += 1; if (_t.m > 59) { _t.m = 0; _t.h++; } return fmt(_t.h, _t.m); };
const resetTime = () => { _t = { h: 14, m: 28 }; };
const rid = () => Math.random().toString(36).slice(2);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ─────────── App ─────────── */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const tone = t.tone in SCRIPTS ? t.tone : 'casual';
  const script = SCRIPTS[tone];
  const platform = t.platform || 'whatsapp';

  // Chat state
  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);
  const [stage, setStage] = useState('start');
  const [flowOpen, setFlowOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [input, setInput] = useState('');

  // Scenario player state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [scenarioSheet, setScenarioSheet] = useState(null);  // { sheet, resolve }
  const playTokenRef = useRef(0);  // increments to cancel previous playback

  const scrollRef = useRef(null);
  const autoplayRef = useRef(true);
  const nextResolveRef = useRef(null);
  const [waitingKind, setWaitingKind] = useState(null); // null = not paused; string = step kind currently paused

  // Kinds where the component's own click advances the scenario — hide "Próximo" for these
  const INTERACTIVE_PAUSE_KINDS = new Set(['quick-replies', 'open-sheet']);

  // Keep autoplay ref in sync with tweak
  useEffect(() => { autoplayRef.current = t.autoplay !== false; }, [t.autoplay]);

  const advanceNext = () => {
    const resolve = nextResolveRef.current;
    if (resolve) { nextResolveRef.current = null; setWaitingKind(null); resolve(); }
  };

  // Auto-scroll on every change
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing]);

  // Read URL params on mount and auto-play scenario
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('s');
    const urlPlatform = params.get('platform');
    if (urlPlatform === 'whatsapp' || urlPlatform === 'slack') setTweak('platform', urlPlatform);
    if (sid) {
      const scenario = SCENARIOS.find(s => s.id === sid);
      if (scenario) {
        const sp = scenario.platform || 'whatsapp';
        setTweak('platform', sp);
        setTimeout(() => playScenario(scenario), 80);
      }
    }
  }, []); // eslint-disable-line

  // Sync URL whenever active scenario or platform changes (skip first render)
  const _urlSyncMounted = useRef(false);
  useEffect(() => {
    if (!_urlSyncMounted.current) { _urlSyncMounted.current = true; return; }
    const params = new URLSearchParams();
    if (activeScenarioId) params.set('s', activeScenarioId);
    params.set('platform', platform);
    history.replaceState(null, '', window.location.pathname + '?' + params.toString());
  }, [activeScenarioId, platform]);

  // Push helper
  const push = (m) => setMsgs(prev => [...prev, m]);

  /* ─── Free-form chat orchestration (default mode) ─── */
  const reset = () => {
    playTokenRef.current++;
    resetTime();
    setMsgs([]);
    setStage('start');
    setFlowOpen(false);
    setActiveRoom(null);
    setInput('');
    setActiveScenarioId(null);
    setScenarioSheet(null);
    const resolve = nextResolveRef.current;
    nextResolveRef.current = null;
    setWaitingKind(null);
    resolve?.();
    history.replaceState(null, '', window.location.pathname);
  };

  const sendUser = (text) => {
    if (!text.trim()) return;
    setInput('');
    const time = nextTime();
    push({ kind: 'user-text', text, time, status: 'read', id: rid() });
    if (activeScenarioId) return;  // chat input is decorative during scenario playback
    advance(text, time);
  };

  const submitReserva = (room) => {
    setFlowOpen(false);
    const time = nextTime();
    push({ kind: 'day-divider', id: rid(), label: 'Hoje' });
    push({ kind: 'flow-reply', label: 'Reservar', time, id: rid() });
    if (t.showTyping) setTyping(true);
    setTimeout(() => {
      setTyping(false);
      push({ kind: 'bot-text', text: script.bookingSubmitted, time, id: rid() });
      setStage('confirmed');
    }, t.showTyping ? 1000 : 0);
  };

  const advance = (userText, userTime) => {
    if (stage === 'start') {
      botSay(() => script.greeting(t.agent), userTime, () => setStage('greeted'));
      return;
    }
    if (stage === 'greeted') {
      const cw = detectCoworking(userText);
      botSay(() => script.acknowledge(cw), userTime, () => {
        if (t.showTyping) setTyping(true);
        setTimeout(() => {
          setTyping(false);
          presentRooms(nextTime());
        }, 1400);
        setStage('browsing');
      }, 700);
      return;
    }
    botSay(() => 'Posso te ajudar a buscar outras salas, alterar a reserva ou cancelar. O que prefere?', userTime);
  };

  const detectCoworking = (s) => {
    const l = s.toLowerCase();
    if (l.includes('tribbo')) return 'Tribbos';
    if (l.includes('vila olímpia') || l.includes('vila olimpia')) return 'Vila Olímpia';
    if (l.includes('itaim')) return 'Itaim';
    return null;
  };

  const botSay = (textFn, _userTime, after, delay = 1000) => {
    if (t.showTyping) setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const time = nextTime();
      push({ kind: 'bot-text', text: textFn(), time, id: rid() });
      after?.();
    }, t.showTyping ? delay : 0);
  };

  const presentRooms = (time) => {
    const rooms = ROOMS.slice(0, t.cardStyle === 'carousel' ? 3 : 2);
    if (t.cardStyle === 'carousel') {
      push({ kind: 'carousel', rooms, time, id: rid() });
    } else {
      rooms.forEach((r, i) => {
        push({ kind: t.cardStyle === 'compact' ? 'room-compact' : 'room', room: r, time: i === 0 ? time : nextTime(), id: rid() });
      });
    }
    push({ kind: 'bot-text', text: script.presentRooms, time: nextTime(), id: rid() });
  };

  const onReservar = (room) => {
    setActiveRoom(room);
    if (t.flowMode === 'inline') { submitReserva(room); return; }
    setFlowOpen(true);
    setStage('reserving');
  };

  /* ─── Scenario player ─── */
  const PAUSE_AFTER_KINDS = new Set([
    'bot', 'room', 'pill-room', 'carousel', 'quick-replies',
    'info-card', 'gift-card', 'app-screen', 'ticket-card', 'rsvp-card',
    'location-card', 'voice-message', 'open-sheet', 'flow-submitted', 'slash-command',
  ]);

  const playScenario = useCallback(async (scenario) => {
    playTokenRef.current++;
    const myToken = playTokenRef.current;
    setMsgs([]);
    setTyping(false);
    setFlowOpen(false);
    setScenarioSheet(null);
    setWaitingKind(null);
    nextResolveRef.current = null;
    setActiveScenarioId(scenario.id);
    setStage('scenario');
    if (scenario.startTime) setTime(scenario.startTime.h, scenario.startTime.m);
    else resetTime();

    const alive = () => playTokenRef.current === myToken;

    const waitIfManual = (kind) => {
      if (autoplayRef.current || !PAUSE_AFTER_KINDS.has(kind)) return Promise.resolve();
      return new Promise(resolve => {
        nextResolveRef.current = resolve;
        setWaitingKind(kind);
      });
    };

    for (const step of scenario.steps) {
      if (!alive()) return;

      // In autoplay mode respect delays; in manual mode skip them
      if (autoplayRef.current && step.delay) {
        await sleep(step.delay); if (!alive()) return;
      }

      switch (step.kind) {
        case 'bot': {
          const typingMs = autoplayRef.current ? (step.typing || 0) : Math.min(step.typing || 0, 500);
          if (typingMs) {
            setTyping(true);
            await sleep(typingMs);
            if (!alive()) return;
            setTyping(false);
          }
          push({ kind: 'bot-text', text: step.text, time: nextTime(), id: rid() });
          break;
        }
        case 'user': {
          push({ kind: 'user-text', text: step.text, time: nextTime(), status: 'read', id: rid() });
          break;
        }
        case 'divider': {
          push({ kind: 'day-divider', label: step.label, color: step.color, id: rid() });
          break;
        }
        case 'room': {
          push({ kind: 'room', room: step.room, time: nextTime(), id: rid() });
          break;
        }
        case 'pill-room': {
          push({ kind: 'pill-room', room: step.room, pill: step.pill, action: step.action, time: nextTime(), id: rid() });
          break;
        }
        case 'carousel': {
          push({ kind: 'carousel', rooms: step.rooms, time: nextTime(), id: rid() });
          break;
        }
        case 'quick-replies': {
          push({ kind: 'inline-quick-replies', items: step.items, id: rid() });
          break;
        }
        case 'info-card': {
          push({
            kind: 'info-card',
            title: step.title, lines: step.lines, action: step.action, accent: step.accent,
            time: nextTime(), id: rid(),
          });
          break;
        }
        case 'gift-card': {
          push({ kind: 'gift-card', emoji: step.emoji, big: step.big, small: step.small, time: nextTime(), id: rid() });
          break;
        }
        case 'app-screen': {
          push({ kind: 'app-screen', title: step.title, lines: step.lines, success: step.success, time: nextTime(), id: rid() });
          break;
        }
        case 'ticket-card': {
          push({
            kind: 'ticket-card',
            ticketId: step.id,
            severity: step.severity,
            eta: step.eta,
            status: step.status,
            time: nextTime(), id: rid(),
          });
          break;
        }
        case 'rsvp-card': {
          push({ kind: 'rsvp-card', items: step.items, time: nextTime(), id: rid() });
          break;
        }
        case 'location-card': {
          push({ kind: 'location-card', title: step.title, address: step.address, mapImage: step.mapImage, time: nextTime(), id: rid() });
          break;
        }
        case 'voice-message': {
          push({ kind: 'voice-message', side: step.side || 'user', duration: step.duration || '0:08', time: nextTime(), status: step.status || 'read', id: rid() });
          break;
        }
        case 'slash-command': {
          push({ kind: 'slash-command', text: step.text, time: nextTime(), id: rid() });
          break;
        }
        case 'open-sheet': {
          setScenarioSheet(step.sheet);
          break;
        }
        case 'close-sheet': {
          setScenarioSheet(null);
          break;
        }
        case 'flow-submitted': {
          setScenarioSheet(null);
          push({ kind: 'flow-reply', label: step.label, time: nextTime(), id: rid() });
          break;
        }
        default: break;
      }

      await waitIfManual(step.kind);
      if (!alive()) return;
    }
    setWaitingKind(null);
  }, []);

  const pickScenario = (s) => {
    const scenarioPlatform = s.platform || 'whatsapp';
    if (scenarioPlatform !== platform) setTweak('platform', scenarioPlatform);
    setActiveScenarioId(s.id);
    setSidebarOpen(false);
    playScenario(s);
  };

  /* ─── Quick replies (free-form mode only) ─── */
  const freeFormQuickReplies = useMemo(() => {
    if (!t.quickReplies || activeScenarioId) return null;
    if (stage === 'start') return ['Oi', 'Quero reservar uma sala', 'Ver minhas reservas'];
    if (stage === 'greeted') return [
      'Tribbos, 5p, amanhã, 10:00 às 17:00',
      'Itaim, 8p, sexta, 14h às 16h',
      'Vila Olímpia, 4p, hoje à tarde',
    ];
    if (stage === 'browsing' || stage === 'confirmed') return ['Ver outras opções', 'Trocar horário', 'Falar com humano'];
    return null;
  }, [stage, t.quickReplies, activeScenarioId]);

  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId);
  const platformScenarios = SCENARIOS.filter(s => (s.platform || 'whatsapp') === platform);
  const [scenarioInfoOpen, setScenarioInfoOpen] = useState(false);

  useEffect(() => {
    setScenarioInfoOpen(false);
  }, [activeScenarioId]);

  /* ─── WhatsApp message renderer ─── */
  const renderWAMsg = (m) => {
    switch (m.kind) {
      case 'bot-text':
        return <TextMsg key={m.id} side="bot" time={m.time}>{renderText(m.text)}</TextMsg>;
      case 'user-text':
        return <TextMsg key={m.id} side="user" time={m.time} status={m.status}>{m.text}</TextMsg>;
      case 'day-divider':
        return <DayDivider key={m.id} label={m.label}/>;
      case 'room':
        return t.flowMode === 'inline'
          ? <InlineActionCard key={m.id} room={m.room} time={m.time} onReservar={onReservar}/>
          : <RoomCard key={m.id} room={m.room} time={m.time} onReservar={onReservar}/>;
      case 'room-compact':
        return <RoomCard key={m.id} room={m.room} time={m.time} onReservar={onReservar} compact/>;
      case 'carousel':
        return <RoomCarousel key={m.id} rooms={m.rooms} time={m.time} onReservar={onReservar}/>;
      case 'flow-reply':
        return <FlowReply key={m.id} time={m.time} label={m.label}/>;
      case 'pill-room':
        return <PillRoomCard key={m.id} room={m.room} pill={m.pill} action={m.action} time={m.time} onAction={() => onReservar(m.room)}/>;
      case 'info-card':
        return <InfoCard key={m.id} title={m.title} lines={m.lines || []} action={m.action} accent={m.accent} time={m.time}/>;
      case 'gift-card':
        return <GiftCard key={m.id} emoji={m.emoji} big={m.big} small={m.small} time={m.time}/>;
      case 'app-screen':
        return <AppScreenCard key={m.id} title={m.title} lines={m.lines || []} success={m.success} time={m.time}/>;
      case 'ticket-card':
        return <TicketStatusCard key={m.id} id={m.ticketId} severity={m.severity} eta={m.eta} status={m.status} time={m.time}/>;
      case 'rsvp-card':
        return <RSVPCard key={m.id} items={m.items} time={m.time}/>;
      case 'location-card':
        return <LocationCard key={m.id} title={m.title} address={m.address} mapImage={m.mapImage} time={m.time}/>;
      case 'voice-message':
        return <VoiceMessage key={m.id} side={m.side} duration={m.duration} time={m.time} status={m.status}/>;
      case 'inline-quick-replies':
        return <QuickReplies key={m.id} items={m.items} onPick={(text) => {
          push({ kind: 'user-text', text, time: nextTime(), status: 'read', id: rid() });
          advanceNext();
        }}/>;
      case 'slash-command':
        return <TextMsg key={m.id} side="user" time={m.time} status="read">{m.text}</TextMsg>;
      default: return null;
    }
  };

  /* ─── Slack message renderer ─── */
  const renderSlackMsg = (m) => {
    switch (m.kind) {
      case 'bot-text':
        return <SlackMessage key={m.id} time={m.time}>{renderSlackText(m.text)}</SlackMessage>;
      case 'user-text':
        return <SlackUserMessage key={m.id} time={m.time}>{m.text}</SlackUserMessage>;
      case 'slash-command':
        return <SlackSlashCmd key={m.id} text={m.text} time={m.time}/>;
      case 'day-divider':
        return <SlackDivider key={m.id} label={m.label}/>;
      case 'room':
        return <SlackRoomBlock key={m.id} room={m.room} time={m.time} onAction={() => onReservar(m.room)}/>;
      case 'room-compact':
        return <SlackRoomBlock key={m.id} room={m.room} time={m.time} onAction={() => onReservar(m.room)}/>;
      case 'carousel':
        return <React.Fragment key={m.id}>{m.rooms.map((r, i) =>
          <SlackRoomBlock key={m.id + i} room={r} time={m.time} onAction={() => onReservar(r)}/>
        )}</React.Fragment>;
      case 'pill-room':
        return <SlackRoomBlock key={m.id} room={m.room} pill={m.pill} action={m.action} time={m.time} onAction={() => onReservar(m.room)}/>;
      case 'flow-reply':
        return <SlackFlowReply key={m.id} label={m.label} time={m.time}/>;
      case 'info-card':
        return <SlackInfoBlock key={m.id} title={m.title} lines={m.lines || []} action={m.action} accent={m.accent} time={m.time}/>;
      case 'gift-card':
        return <SlackGiftBlock key={m.id} emoji={m.emoji} big={m.big} small={m.small} time={m.time}/>;
      case 'app-screen':
        return <SlackAppScreenBlock key={m.id} title={m.title} lines={m.lines || []} success={m.success} time={m.time}/>;
      case 'ticket-card':
        return <SlackTicketBlock key={m.id} id={m.ticketId} severity={m.severity} eta={m.eta} status={m.status} time={m.time}/>;
      case 'rsvp-card':
        return <SlackRSVPBlock key={m.id} items={m.items} time={m.time}/>;
      case 'location-card':
        return <SlackLocationBlock key={m.id} title={m.title} address={m.address} mapImage={m.mapImage} time={m.time}/>;
      case 'voice-message':
        return <SlackVoiceBlock key={m.id} side={m.side} duration={m.duration} time={m.time}/>;
      case 'inline-quick-replies':
        return <SlackActionsBlock key={m.id} items={m.items} onPick={(text) => {
          push({ kind: 'user-text', text, time: nextTime(), status: 'read', id: rid() });
          advanceNext();
        }}/>;
      default: return null;
    }
  };

  /* ─── Slack UI ─── */
  const renderSlackUI = () => (
    <>
      <div className="cap">
        Simulador · <b>Slack</b> · {t.agent}
        {activeScenario && <> · <span style={{ color: '#fff' }}>{activeScenario.p} {activeScenario.title}</span></>}
      </div>
      <SlackWorkspace>
        <SlackSidebar/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <SlackChannelHeader channelName="woba-assist"/>
          <div ref={scrollRef} style={{
            flex: 1, minHeight: 0, overflowY: 'auto',
            background: '#1a1d21',
            paddingTop: 8, paddingBottom: 4,
          }}>
            {msgs.length === 0 && (
              <SlackEmptyState agent={t.agent} onPickScenario={() => setSidebarOpen(true)}/>
            )}
            {msgs.map(renderSlackMsg)}
            {typing && <SlackTyping/>}
            {!typing && freeFormQuickReplies && (
              <SlackActionsBlock items={freeFormQuickReplies} onPick={sendUser}/>
            )}
            <div style={{ height: 8 }}/>
          </div>
          <SlackInputBar value={input} onChange={setInput} onSend={() => sendUser(input)}/>
          <SlackModal
            open={!!scenarioSheet}
            sheet={scenarioSheet}
            onClose={() => setScenarioSheet(null)}
            onConfirm={() => { setScenarioSheet(null); advanceNext(); }}
          />
        </div>
      </SlackWorkspace>
    </>
  );

  /* ─── WhatsApp UI ─── */
  const renderWAUI = () => (
    <>
      <div className="cap">
        Simulador · Woba Assist · <b>{t.agent}</b>
        {activeScenario && <> · <span style={{ color: '#fff' }}>{activeScenario.p} {activeScenario.title}</span></>}
      </div>
      <Phone>
        <StatusBar/>
        <ChatHeader agentName={t.agent} avatarStyle={t.avatar}/>
        <div ref={scrollRef} style={{
          flex: 1, minHeight: 0, overflow: 'auto',
          background: "linear-gradient(rgba(13,22,17,0.93), rgba(13,22,17,0.93)), url('assets/chat-bg.svg')",
          backgroundSize: '220px 220px',
          paddingTop: 8, paddingBottom: 4,
          position: 'relative',
        }}>
          {msgs.length === 0 && (
            <EmptyState agent={t.agent} onPickScenario={() => setSidebarOpen(true)}/>
          )}
          {msgs.map(renderWAMsg)}
          {typing && <Typing/>}
          {!typing && freeFormQuickReplies && (
            <QuickReplies items={freeFormQuickReplies} onPick={sendUser}/>
          )}
          <div style={{ height: 8 }}/>
        </div>
        <InputBar value={input} onChange={setInput} onSend={() => sendUser(input)}/>
        <FlowSheet
          open={flowOpen}
          mode={t.flowMode === 'full' ? 'full' : 'sheet'}
          room={activeRoom}
          onClose={() => setFlowOpen(false)}
          onConfirm={submitReserva}
        />
        <ScenarioSheet
          open={!!scenarioSheet}
          sheet={scenarioSheet}
          onClose={() => setScenarioSheet(null)}
          onConfirm={() => { setScenarioSheet(null); advanceNext(); }}
        />
      </Phone>
    </>
  );

  return (
    <>
      {platform === 'slack' ? renderSlackUI() : renderWAUI()}

      {/* Scenario trigger + drawer */}
      <ScenarioTrigger count={platformScenarios.length} onClick={() => setSidebarOpen(true)} platform={platform}/>
      <ScenarioInfoTrigger
        scenario={activeScenario}
        platform={platform}
        onClick={() => setScenarioInfoOpen(true)}
      />
      <ScenarioSidebar
        open={sidebarOpen}
        scenarios={SCENARIOS}
        activeId={activeScenarioId}
        platform={platform}
        onPlatformChange={p => setTweak('platform', p)}
        onPick={pickScenario}
        onPlay={(id) => { const s = SCENARIOS.find(x => x.id === id); if (s) playScenario(s); }}
        onClose={() => setSidebarOpen(false)}
        onReset={() => { reset(); setSidebarOpen(false); }}
        autoplay={t.autoplay !== false}
        onAutoplayChange={v => setTweak('autoplay', v)}
      />
      <ScenarioInfoPanel
        open={scenarioInfoOpen}
        scenario={activeScenario}
        platform={platform}
        onClose={() => setScenarioInfoOpen(false)}
      />

      {/* Manual-mode advance button — only for non-interactive steps */}
      {waitingKind && t.autoplay === false && !INTERACTIVE_PAUSE_KINDS.has(waitingKind) && (
        <button onClick={advanceNext} style={{
          position: 'fixed', bottom: 24, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 90,
          background: '#1a1810', color: '#fff',
          border: 0, borderRadius: 999,
          padding: '12px 22px',
          fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 700,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
          letterSpacing: '-0.01em',
        }}>
          Próximo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        </button>
      )}

      {/* Tweaks panel */}
      <TweaksPanel>
        <TweakSection label="Plataforma"/>
        <TweakRadio label="Canal" value={platform} onChange={v => setTweak('platform', v)}
          options={[
            { value: 'whatsapp', label: 'WhatsApp' },
            { value: 'slack', label: 'Slack' },
          ]}/>

        <TweakSection label="Agente"/>
        <TweakSelect label="Nome" value={t.agent} onChange={v => setTweak('agent', v)}
          options={['Sofia', 'Aurora', 'Bia', 'Luna', 'Cora']}/>
        <TweakRadio label="Tom" value={t.tone} onChange={v => setTweak('tone', v)}
          options={[
            { value: 'casual', label: 'Casual' },
            { value: 'formal', label: 'Formal' },
            { value: 'objetivo', label: 'Objetivo' },
          ]}/>
        <TweakRadio label="Avatar" value={t.avatar} onChange={v => setTweak('avatar', v)}
          options={[
            { value: 'logo', label: 'Logo' },
            { value: 'initials', label: 'Iniciais' },
            { value: 'ai', label: 'IA' },
          ]}/>

        <TweakSection label="Salas"/>
        <TweakSelect label="Estilo do card" value={t.cardStyle} onChange={v => setTweak('cardStyle', v)}
          options={[
            { value: 'rich',    label: 'Card rico' },
            { value: 'compact', label: 'Lista compacta' },
            { value: 'carousel',label: 'Carrossel' },
          ]}/>

        <TweakSection label="Reserva (Flow)"/>
        <TweakRadio label="Modo" value={t.flowMode} onChange={v => setTweak('flowMode', v)}
          options={[
            { value: 'sheet',  label: 'Sheet' },
            { value: 'full',   label: 'Full' },
            { value: 'inline', label: 'Inline' },
          ]}/>

        <TweakSection label="Experiência"/>
        <TweakToggle label="Sugestões rápidas" value={t.quickReplies} onChange={v => setTweak('quickReplies', v)}/>
        <TweakToggle label="Indicador 'digitando'" value={t.showTyping} onChange={v => setTweak('showTyping', v)}/>

        <TweakSection label="Conversa"/>
        <TweakButton label="Reiniciar conversa" onClick={reset}/>
      </TweaksPanel>
    </>
  );
}

/* ─────────── Empty state ─────────── */
function EmptyState({ agent, onPickScenario }) {
  return (
    <div style={{
      textAlign: 'center', color: 'var(--chat-text-3)',
      padding: '50px 30px 30px',
      fontFamily: 'var(--font-chat)', fontSize: 13.5, lineHeight: 1.6,
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(249,225,13,0.12)', margin: '0 auto 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        color: 'var(--w-yellow)', fontSize: 18, letterSpacing: '-0.02em',
      }}>woba</div>
      <div style={{ color: 'var(--chat-text-2)', fontWeight: 500 }}>
        {agent} · Assistente Woba
      </div>
      <div style={{ marginTop: 6, maxWidth: 240, margin: '6px auto 14px' }}>
        Diga "Oi" para começar — ou escolha um dos <b>14 cenários</b> pra ver propostas em ação.
      </div>
      <button onClick={onPickScenario} style={{
        background: 'rgba(95,208,122,0.15)',
        border: '1px solid rgba(95,208,122,0.4)',
        color: 'var(--chat-link)', padding: '7px 14px',
        fontSize: 13, fontWeight: 600, borderRadius: 999,
        cursor: 'pointer', fontFamily: 'inherit',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z"/></svg>
        Ver cenários
      </button>
    </div>
  );
}

/* Render text with **bold** support and newlines */
function renderText(s) {
  const parts = String(s).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return <b key={i} style={{ fontWeight: 700 }}>{p.slice(2, -2)}</b>;
    }
    return <span key={i}>{p}</span>;
  });
}

/* ─────────── Input bar ─────────── */
function InputBar({ value, onChange, onSend }) {
  const ref = useRef(null);
  const hasText = value.trim().length > 0;
  return (
    <div style={{
      flexShrink: 0,
      background: 'var(--chat-header)',
      padding: '7px 8px 9px',
      display: 'flex', alignItems: 'flex-end', gap: 7,
    }}>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        background: 'var(--chat-input)',
        borderRadius: 26,
        padding: '4px 6px 4px 10px',
        minHeight: 44,
        color: 'var(--chat-text-2)',
      }}>
        <button style={iconButton} aria-label="emoji"><AI.Sticker/></button>
        <input
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onSend(); }}
          placeholder="Mensagem"
          style={{
            flex: 1, background: 'transparent', border: 0, outline: 0,
            color: 'var(--chat-text)', fontFamily: 'var(--font-chat)',
            fontSize: 16, padding: '8px 6px',
            caretColor: 'var(--chat-accent)',
          }}/>
        <button style={iconButton} aria-label="attach"><AI.Clip/></button>
        <button style={iconButton} aria-label="camera"><AI.Camera/></button>
      </div>
      <button onClick={onSend} aria-label="send" style={{
        width: 46, height: 46, borderRadius: '50%',
        background: 'var(--chat-accent)', border: 0,
        color: '#06150e',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
      }}>
        {hasText ? <AI.Send/> : <AI.Mic/>}
      </button>
    </div>
  );
}

function ScenarioInfoTrigger({ scenario, platform = 'whatsapp', onClick }) {
  if (!scenario) return null;

  const isSlack = platform === 'slack';
  return (
    <button onClick={onClick} style={{
      position: 'fixed', right: 16, bottom: 16,
      zIndex: 50,
      background: '#fff', color: '#1a1810',
      border: '1px solid rgba(0,0,0,0.1)', borderRadius: 999,
      padding: '11px 16px',
      fontFamily: 'var(--font-ui)', fontSize: 13.5, fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 9,
      boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: '50%',
        background: isSlack ? '#4a154b' : '#111827',
        color: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800,
        flexShrink: 0,
      }}>i</span>
      Info do cenário
      <span style={{
        background: '#f3f4f6',
        color: '#374151',
        fontSize: 11, fontWeight: 700,
        padding: '2px 7px', borderRadius: 999,
        letterSpacing: '0.02em',
      }}>{scenario.p}</span>
    </button>
  );
}

function ScenarioInfoPanel({ open, scenario, platform = 'whatsapp', onClose }) {
  if (!scenario) return null;

  const spec = buildScenarioSpec(scenario, platform);

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: open ? 'rgba(0,0,0,0.52)' : 'rgba(0,0,0,0)',
        pointerEvents: open ? 'auto' : 'none',
        transition: 'background 220ms ease',
        zIndex: 110,
      }}/>
      <aside style={{
        position: 'fixed', top: 16, right: 16, bottom: 16,
        width: 420, maxWidth: 'calc(100vw - 32px)',
        zIndex: 111,
        background: '#fffdf8',
        color: '#1f2937',
        borderRadius: 18,
        boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
        transform: open ? 'translateX(0)' : 'translateX(calc(100% + 24px))',
        transition: 'transform 240ms cubic-bezier(0.2, 0, 0, 1)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'var(--font-ui)',
      }}>
        <div style={{
          padding: '18px 18px 14px',
          borderBottom: '1px solid #ece7dc',
          background: 'linear-gradient(180deg, rgba(249,225,13,0.12), rgba(249,225,13,0))',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              width: 12, height: 12, borderRadius: '50%',
              background: scenario.color || '#111827',
              marginTop: 6, flexShrink: 0,
            }}/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: 11, color: '#6b7280', letterSpacing: '0.04em',
                }}>{scenario.p}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: '#374151',
                  background: '#f3f4f6', padding: '3px 8px', borderRadius: 999,
                }}>{spec.platformLabel}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: '#6b7280',
                  background: '#f9fafb', padding: '3px 8px', borderRadius: 999,
                }}>{scenario.category}</span>
              </div>
              <div style={{
                marginTop: 8,
                fontFamily: 'var(--font-display)',
                fontSize: 24, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.03em',
                color: '#111827',
              }}>{scenario.title}</div>
              <div style={{
                marginTop: 8, fontSize: 13.5, lineHeight: 1.5, color: '#4b5563',
              }}>{scenario.summary}</div>
            </div>
            <button onClick={onClose} style={{
              background: 'transparent', border: 0, color: '#6b7280',
              cursor: 'pointer', width: 28, height: 28, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 5l14 14M19 5L5 19"/>
              </svg>
            </button>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18 }}>
          <InfoSection title="Finalidade" text={spec.purpose}/>
          <InfoSection title="Quando usar" text={spec.whenToUse}/>
          <InfoSection title="Gatilho" text={spec.trigger}/>
          <InfoSection title="Como funciona" text={spec.flow}/>
          <InfoSection title="Dados e contexto" text={spec.inputs}/>
          <InfoSection title="Resultado esperado" text={spec.outcome}/>
          <InfoSection title="Critério de sucesso" text={spec.success}/>
        </div>
      </aside>
    </>
  );
}

function InfoSection({ title, text }) {
  return (
    <section style={{ marginBottom: 18 }}>
      <div style={{
        fontSize: 11, fontWeight: 800, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: '#6b7280', marginBottom: 7,
      }}>{title}</div>
      <div style={{
        fontSize: 13.5, lineHeight: 1.6, color: '#1f2937',
      }}>{text}</div>
    </section>
  );
}

function buildScenarioSpec(scenario, platform) {
  const firstUser = scenario.steps.find(step => step.kind === 'user');
  const firstBot = scenario.steps.find(step => step.kind === 'bot');
  const hasForm = scenario.steps.some(step => step.kind === 'open-sheet');
  const hasChoice = scenario.steps.some(step => step.kind === 'quick-replies');
  const hasReservationAsset = scenario.steps.some(step => ['room', 'pill-room', 'carousel'].includes(step.kind));
  const hasConfirmation = scenario.steps.some(step => ['flow-submitted', 'app-screen', 'rsvp-card', 'ticket-card'].includes(step.kind));

  const flowParts = [];
  if (firstBot) flowParts.push('inicia com uma mensagem contextual da Sofia');
  if (hasReservationAsset) flowParts.push('apresenta a opção principal de ação ou reserva');
  if (hasChoice) flowParts.push('reduz a decisão com atalhos de resposta rápida');
  if (hasForm) flowParts.push('coleta ou confirma dados em uma camada transacional');
  if (hasConfirmation) flowParts.push('encerra com confirmação visível do próximo estado');

  const contextParts = [];
  if (scenario.startTime) contextParts.push(`janela sugerida de execução às ${fmt(scenario.startTime.h, scenario.startTime.m)}`);
  if (firstUser?.text) contextParts.push(`entrada representativa do usuário: "${sanitizeScenarioText(firstUser.text)}"`);
  if (scenario.summary) contextParts.push(`promessa central: ${scenario.summary}`);

  return {
    platformLabel: platform === 'slack' ? 'Slack' : 'WhatsApp',
    purpose: `Este cenário existe para demonstrar ${normalizeScenarioLead(scenario.summary)}. Ele comunica qual proposta de produto a Woba Assist entrega nesse momento da jornada e como a conversa reduz atrito para o usuário.`,
    whenToUse: `Use este fluxo quando o contexto do usuário combinar com ${scenario.category.toLowerCase()} e a intenção principal for "${scenario.title}". A ideia aqui não é abrir uma conversa genérica, e sim conduzir uma tarefa específica com o mínimo de fricção.`,
    trigger: firstUser
      ? `O cenário pode ser disparado a partir de uma fala do usuário ou de um evento contextual equivalente. No protótipo, a referência mais próxima é "${sanitizeScenarioText(firstUser.text)}".`
      : `O cenário é disparado por contexto proativo do assistente, sem depender de um pedido livre do usuário naquele momento.`,
    flow: flowParts.length
      ? `O fluxo ${flowParts.join(', ')}. Em termos de PRD, isso representa a sequência ideal entre descoberta do contexto, proposta de ação e fechamento com evidência de sucesso.`
      : `O fluxo foi desenhado para sair de contexto inicial e chegar a um desfecho claro, mantendo a conversa curta e orientada à decisão.`,
    inputs: contextParts.length
      ? `Para funcionar bem, este cenário depende de ${contextParts.join('; ')}. Em produção, isso normalmente viria de agenda, reserva ativa, disponibilidade de sala, status operacional ou ações anteriores do usuário.`
      : `Para funcionar bem, este cenário depende de contexto operacional suficiente para personalizar a mensagem, decidir a melhor próxima ação e evitar perguntas desnecessárias.`,
    outcome: hasConfirmation
      ? `O resultado esperado é que o usuário veja um estado final inequívoco no próprio canal, como confirmação, painel de status, resumo de envio ou conclusão de etapa.`
      : `O resultado esperado é que o usuário entenda a proposta, tome uma decisão e siga para a próxima etapa sem precisar sair do fluxo atual.`,
    success: `Consideramos este cenário bem-sucedido quando o usuário entende a proposta sem ambiguidade, conclui a ação principal em poucos passos e termina a interação com clareza sobre o que aconteceu depois. ${firstBot ? `A primeira mensagem precisa deixar isso evidente desde o início.` : ''}`,
  };
}

function normalizeScenarioLead(summary) {
  const clean = sanitizeScenarioText(summary || '').replace(/\.$/, '');
  if (!clean) return 'uma proposta contextual de assistência';
  return clean.charAt(0).toLowerCase() + clean.slice(1);
}

function sanitizeScenarioText(text) {
  return String(text || '')
    .replace(/^\[|\]$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const iconButton = {
  width: 36, height: 36, padding: 0,
  background: 'transparent', border: 0,
  color: 'var(--chat-text-3)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
