(function () {
// slack-scenarios.jsx — Derives all 21 scenarios from SCENARIOS, adapts them for Slack.
// Adds slash-command steps for P-02, P-06, P-14, P-15.
// Patches P-11 text to mention "Slack" instead of "WhatsApp".
// Exposes: window.SLACK_SCENARIOS, window.ALL_SCENARIOS

const SLASH_PREFIX = {
  'p02': { kind: 'slash-command', text: '/reservar-agora' },
  'p06': { kind: 'slash-command', text: '/problema sala' },
  'p14': { kind: 'slash-command', text: '/chamado' },
  'p15': { kind: 'slash-command', text: '/ajuda creditos' },
};

const TEXT_FIX = {
  'p11': s => s.replace('pelo WhatsApp', 'no Slack'),
};

function patchSteps(id, steps) {
  let out = steps.map(step => {
    if (TEXT_FIX[id] && step.kind === 'bot' && step.text) {
      return { ...step, text: TEXT_FIX[id](step.text) };
    }
    return step;
  });
  if (SLASH_PREFIX[id]) {
    out = [{ ...SLASH_PREFIX[id], delay: 0 }, ...out];
  }
  return out;
}

const SLACK_SCENARIOS = window.SCENARIOS.map(s => ({
  ...s,
  id: 'slack-' + s.id,
  platform: 'slack',
  steps: patchSteps(s.id, s.steps),
}));

window.SLACK_SCENARIOS = SLACK_SCENARIOS;
window.ALL_SCENARIOS = [...window.SCENARIOS, ...SLACK_SCENARIOS];

})();
