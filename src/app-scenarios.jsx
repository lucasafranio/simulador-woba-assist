(function () {
// app-scenarios.jsx — Clona todos os cenários WhatsApp com platform 'app'

const APP_SCENARIOS = (window.SCENARIOS || []).map(s => ({
  ...s,
  id: 'app-' + s.id,
  platform: 'app',
}));

window.ALL_SCENARIOS = [
  ...(window.ALL_SCENARIOS || window.SCENARIOS || []),
  ...APP_SCENARIOS,
];

})();
