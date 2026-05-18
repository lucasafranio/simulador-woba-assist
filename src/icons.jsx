(function(){
// Icons.jsx — minimal SVG icons used throughout the chat UI
// Inline strokes only; no asset deps.

const Icons = {
  Back: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  More: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <circle cx="12" cy="5"  r="1.8"/>
      <circle cx="12" cy="12" r="1.8"/>
      <circle cx="12" cy="19" r="1.8"/>
    </svg>
  ),
  Camera: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 8h3l1.6-2h6.8L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="12" cy="13" r="3.4" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  Clip: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M14 7l-7 7a3 3 0 104.24 4.24L19 9.5A5 5 0 1011.95 2.4L5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  Sticker: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="9" cy="10" r="1" fill="currentColor"/>
      <circle cx="15" cy="10" r="1" fill="currentColor"/>
      <path d="M8.5 14.5q3.5 3 7 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  Mic: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <rect x="9" y="3" width="6" height="12" rx="3"/>
      <path d="M6 11a6 6 0 0012 0M12 17v4M9 21h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  Send: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M3 12l18-8-4 18-4-7-7-3z"/>
    </svg>
  ),
  Check1: (p) => (
    <svg width="16" height="11" viewBox="0 0 18 12" fill="none" {...p}>
      <path d="M1 6.5l4 4 9-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Check2: (p) => (
    <svg width="18" height="11" viewBox="0 0 20 12" fill="none" {...p}>
      <path d="M1 6.5l4 4 9-9 M6 10.5l9-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Down: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Volume: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 9v6h4l5 4V5L8 9H4z M16 8a5 5 0 010 8 M19 5a9 9 0 010 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  Wifi: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M1 9c6.6-6 15.4-6 22 0l-2.5 2.5C16 7 8 7 3.5 11.5L1 9zm5 5c3.6-3.2 8.4-3.2 12 0l-2.5 2.5c-2.2-1.8-4.8-1.8-7 0L6 14zm5 5c1-0.9 2-0.9 3 0l-1.5 1.5L11 19z"/>
    </svg>
  ),
  Cell: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M2 20h4v-6H2v6zm7 0h4V10H9v10zm7 0h4V4h-4v16z"/>
    </svg>
  ),
  Battery: (p) => (
    <svg width="26" height="14" viewBox="0 0 28 14" {...p}>
      <rect x="0.5" y="1.5" width="22" height="11" rx="2.5" stroke="currentColor" fill="none" strokeWidth="1"/>
      <rect x="2.5" y="3.5" width="18" height="7" rx="1" fill="currentColor"/>
      <rect x="23" y="4.5" width="2" height="5" rx="0.5" fill="currentColor"/>
    </svg>
  ),
  Clipboard: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M9 4v-1a2 2 0 012-2h2a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M8 10h8M8 14h8M8 18h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  Building: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M3 21V8l5-3v3l5-3v16h-2v-4h-2v4H3zm12 0V11l6 3v7h-6zm-9-9h2v-2H6v2zm0 4h2v-2H6v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2z"/>
    </svg>
  ),
  External: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M14 4h6v6M20 4l-9 9M5 6v13h13V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Close: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

window.Icons = Icons;

})();
