export const clientScript = String.raw`(() => {
'use strict';
const $ = id => document.getElementById(id);
const catalogue = typeof browserModels === 'undefined' ? null : browserModels;
const state = { tone: 'green', mode: 'demo', aiReady: false, localAI: Boolean(catalogue), providerName: '', busy: false, result: null, statement: '', material: '', nextVariation: { green: 0, yellow: 0, red: 0 }, consent: false, micConsent: false, recognition: null, recording: false, shake: false, motionSeen: false, lastMotion: null, lastShake: 0, peaks: [], details: false, requestId: 0 };
const localConsent = new Set();
let models = [], model, graphics = 'idle';
const currentModel = () => models.find(item => item.id === model);
function resetVariants() { state.nextVariation = { green: 0, yellow: 0, red: 0 }; }
const toneLabels = { green: 'Gespräch öffnen', yellow: 'Freches Statement', red: 'Klare Grenze · Gespräch beenden' };
let toastTimer, sensorTimer, localRequest, preloadRequest;
function toast(text) { $('toast').textContent = text; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').textContent = ''; }, 4200); }
function message(text = '') { $('form-message').textContent = text; }
function hasDialog() { return Boolean(document.querySelector('dialog[open]')); }
function openDialog(id) {
  const dialog = $(id);
  if (!dialog || dialog.open) return;
  if (state.recording) state.recognition?.stop();
  dialog.showModal();
  if (id === 'mode-dialog') {
    modeMessage();
    if (state.localAI && graphics === 'idle') void checkGraphics();
  }
}
document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => { if (b.dataset.open === 'studio-dialog') { $('material').value = state.material; $('material-message').textContent = ''; } openDialog(b.dataset.open); }));
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) { const r = d.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close(); } }));
function setBusy(value) { state.busy = value; document.querySelectorAll('[data-tone]').forEach(button => { button.disabled = value || state.recording; }); $('another-button').disabled = value; $('mic-button').disabled = value;  $('result-card').classList.toggle('loading', value); $('result-card').setAttribute('aria-busy', String(value)); }
function modeMessage(text = '') { $('mode-message').textContent = text; }
function renderMode() {
  if (!state.result) $('mode-badge').textContent = state.mode === 'ai' ? 'KI · individuelle Antwort' : 'Demo · vorbereitete Antworten';
  $('choose-demo').setAttribute('aria-pressed', String(state.mode === 'demo')); $('choose-ai').setAttribute('aria-pressed', String(state.mode === 'ai'));
  $('mode-description').textContent = state.mode === 'demo' ? 'Die Demo wählt aus vorbereiteten Antworten und allgemeinen Gesprächshilfen. Sie erzeugt keine individuelle KI Antwort.' : 'Die KI formuliert zu deiner Aussage drei Antwortstile. Prüfe selbst, welche Antwort zur Situation passt.';
  $('ai-status').textContent = state.aiReady ? 'KI Zugang verbunden' + (state.providerName ? ' · ' + state.providerName : '') + '. Du kannst individuelle Antworten ausprobieren.' : 'Der KI Zugang ist noch nicht eingerichtet. Die Demo ist bereits nutzbar.';
  if (!state.localAI) return;
  $('mode-open').textContent = state.mode === 'ai' ? currentModel().name + ' · Wechseln' : 'KI auswählen';
  $('choose-ai').hidden = true;
  $('mode-description').textContent = 'Die KI wählt aus vorbereiteten Sätzen den passenden zur Aussage und zur Ampelfarbe.';
  $('ai-status').textContent = {
    idle: 'Die Grafikprüfung startet beim Öffnen dieses Menüs.',
    checking: 'Grafikunterstützung wird geprüft …',
    ready: 'Das ausgewählte Modell lädt beim ersten Einsatz. Deine Eingabe bleibt auf dem Gerät.',
    'timed-out': 'Der Browser hat auf die Grafikprüfung nicht geantwortet. Du kannst erneut prüfen oder die Demo nutzen.',
    unavailable: 'Dieser Browser stellt auf dem Gerät kein nutzbares WebGPU bereit. Die Demo ist verfügbar.',
    error: 'Die Grafikprüfung ist fehlgeschlagen. Du kannst erneut prüfen oder die Demo nutzen.',
  }[graphics];
  $('retry-graphics').hidden = graphics === 'idle' || graphics === 'checking' || graphics === 'ready';
  for (const button of $('local-model-options').children) {
    button.setAttribute('aria-pressed', String(state.mode === 'ai' && model === button.dataset.model));
  }
}
function showModelOptions() {
  const options = $('local-model-options');
  options.replaceChildren();
  for (const item of models) {
    const button = document.createElement('button');
    const size = document.createElement('span');
    button.type = 'button';
    button.dataset.model = item.id;
    button.disabled = !item.supported;
    size.textContent = item.supported || !state.aiReady ? 'ca. ' + item.downloadMB + ' MB' : 'Grafikfunktion fehlt';
    button.append(item.name, size);
    button.addEventListener('click', () => chooseMode('ai', item.id));
    options.append(button);
  }
  options.hidden = false;
  const supported = models.filter(item => item.supported);
  $('preload-option').hidden = supported.length === 0;
  $('preload-toggle').textContent = supported.length === 3 ? 'Alle drei Modelle vorladen' : 'Verfügbare Modelle vorladen';
  const mb = supported.reduce((sum, item) => sum + item.downloadMB, 0);
  const size = mb >= 1000 ? (mb / 1000).toLocaleString('de-DE', { maximumFractionDigits: 2 }) + ' GB' : mb + ' MB';
  $('preload-description').textContent = 'Der Download benötigt bis zu ' + size + '. Bereits gespeicherte Modelle werden übersprungen.';
}
async function checkGraphics() {
  if (graphics === 'checking') return;
  graphics = 'checking';
  modeMessage();
  renderMode();
  try {
    const response = await fetch('/api/status', { cache: 'no-store' });
    if (!response.ok) throw new Error();
    const data = await response.json();
    models = data.models;
    graphics = data.graphics;
    state.aiReady = graphics === 'ready';
    showModelOptions();
  } catch {
    graphics = 'error';
  }
  renderMode();
}
function invalidate() {
  if (!state.result) return;
  state.result = null; $('result-card').hidden = true; state.details = false; $('result-extra').hidden = true; $('result-tools').hidden = true; $('detail-button').setAttribute('aria-expanded', 'false');
  $('result-card').classList.remove('has-result'); $('result-card').classList.add('stale'); $('result-tip').textContent = 'Eingabe geändert. Finde eine neue Antwort.'; $('result-topic').hidden = true;
}
function inputChanged() { $('char-count').textContent = $('statement').value.length.toLocaleString('de-DE') + ' / 1.200'; invalidate(); message(); }
$('statement').addEventListener('input', inputChanged);
$('statement').addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); requestAnswer(); } });
document.querySelectorAll('[data-example]').forEach(b => b.addEventListener('click', () => { $('statement').value = b.dataset.example; inputChanged(); $('statement').focus(); }));
function setTone(tone) {
  state.tone = tone;
  document.querySelectorAll('[data-tone]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.tone === tone));
  });
}
document.querySelectorAll('[data-tone]').forEach(button => button.addEventListener('click', () => {
  setTone(button.dataset.tone);
  requestAnswer();
}));
function renderResult() {
  const r = state.result; if (!r) return; const selected = r[state.tone];
  $('result-card').hidden = false; $('result-card').dataset.tone = state.tone;
  $('bridge-section').hidden = state.tone !== 'green' || !selected.bridge || Boolean(r.safety);
  $('result-card').classList.remove('stale'); $('result-card').classList.add('has-result'); $('answer-text').classList.remove('empty'); $('answer-text').textContent = selected.answer;
  $('empty-detail').hidden = true; $('result-topic').hidden = false; $('result-topic').textContent = toneLabels[state.tone];
  $('mode-badge').textContent = r.localSelection ? (models.find(item => item.id === r.model)?.name || 'Lokale KI') : r.mode === 'ai' ? 'KI · individuelle Antwort' : 'Vorbereitete Antwort';
  $('result-tip').textContent = r.localUnavailable ? 'Die lokale KI ist gerade nicht verfügbar.' : r.localFallback ? 'Vorbereiteter Vorschlag ohne KI Auswahl.' : r.localSelection || r.mode === 'demo' ? (r.matched ? r.topic : 'Allgemeiner Antwortvorschlag') : r.care;
  $('result-tools').hidden = false; $('bridge-text').textContent = selected.bridge; $('why-text').textContent = selected.why; $('safety-text').textContent = r.safety || ''; $('safety-text').hidden = !r.safety;
  if (r.safety) state.details = true; $('result-extra').hidden = !state.details; $('detail-button').setAttribute('aria-expanded', String(state.details));
}
async function requestAnswer() {
  if (preloadRequest) { message('Die Modelle werden gerade vorgeladen. Du kannst den Download im Menü abbrechen.'); return; }
  if (state.busy || state.recording) return; const statement = $('statement').value.trim();
  if (!statement) { message('Schreib oder sprich zuerst die Aussage ein.'); $('statement').focus(); return; }
  if (statement.length > 1200) { message('Bitte kürze die Aussage auf höchstens 1.200 Zeichen.'); return; }
  if (state.mode === 'ai' && !state.aiReady) { message('Die KI ist noch nicht verbunden. Du kannst in der Zwischenzeit die Demo nutzen.'); return; }
  const local = state.mode === 'ai' && state.localAI;
  const consent = local ? localConsent.has(model) : state.consent;
  if (state.mode === 'ai' && !consent) {
    if (local) {
      const selected = currentModel();
      $('ai-consent-text').textContent = 'Dein Browser lädt ' + selected.name + ' beim ersten Einsatz (ca. ' + selected.downloadMB + ' MB). Deine Aussage bleibt auf deinem Gerät.';
      $('ai-confirm').textContent = 'Modell laden und antworten';
    } else {
      $('ai-consent-text').textContent = 'Für die Antwort werden deine Aussage und deine optionalen Werkstatthinweise an ' + (state.providerName || 'den verbundenen KI Dienst') + ' gesendet. Bitte verzichte auf Namen und persönliche Daten.';
    }
    openDialog('ai-dialog');
    return;
  }
  if (state.statement !== statement) resetVariants();
  const tone = state.tone;
  const variation = state.nextVariation[tone];
  state.statement = statement; const id = ++state.requestId; const mode = state.mode; const material = state.material;
  const controller = new AbortController();
  if (local) {
    localRequest = controller;
    $('cancel-local-ai').hidden = false;
  }
  const timeout = setTimeout(() => controller.abort(), local ? 600000 : 30000);
  message(); setBusy(true); if (state.mode === 'ai') message('Worte werden gesucht …');
  try {
    const response = await fetch('/api/answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ statement, mode, consent, material, tone, variation, model: local ? model : undefined }), signal: controller.signal }, text => { if (id === state.requestId && $('form-message').textContent !== text) message(text); });
    const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Die Antwort konnte gerade nicht gefunden werden.');
    if (!data[tone]?.answer) throw new Error('Es kam keine vollständige Antwort an. Bitte versuche es erneut.');
    if (id !== state.requestId || $('statement').value.trim() !== statement || state.mode !== mode || state.material !== material) { message('Deine Eingabe wurde geändert. Finde dazu bitte eine neue Antwort.'); return; }
    state.nextVariation[tone] = variation + 1;
    message(); state.result = data; renderResult();
    if (window.matchMedia('(max-width: 720px)').matches) $('result-card').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  } catch (error) { if (id === state.requestId) message(error.name === 'AbortError' ? 'Der Vorgang wurde abgebrochen. Du kannst es erneut versuchen oder zur Demo wechseln.' : error.message); }
  finally {
    clearTimeout(timeout);
    if (local) {
      localRequest = undefined;
      $('cancel-local-ai').hidden = true;
    }
    if (id === state.requestId) setBusy(false);
  }
}
$('cancel-local-ai')?.addEventListener('click', () => localRequest?.abort());
$('answer-form').addEventListener('submit', e => { e.preventDefault(); requestAnswer(); }); $('another-button').addEventListener('click', () => requestAnswer());
$('detail-button').addEventListener('click', () => { state.details = !state.details; $('result-extra').hidden = !state.details; $('detail-button').setAttribute('aria-expanded', String(state.details)); });
$('copy-button').addEventListener('click', async () => { const answer = $('answer-text').textContent; if (!state.result || !answer) return; try { await navigator.clipboard.writeText(answer); toast('Antwort kopiert.'); } catch { toast('Kopieren ist hier nicht verfügbar. Markiere den Antworttext zum Kopieren.'); } });
function chooseMode(mode, nextModel = model) {
  if (preloadRequest) { modeMessage('Warte auf den Download oder brich ihn ab.'); return; }
  if (state.busy) { modeMessage('Bitte warte auf die laufende Antwort oder brich sie ab.'); return; }
  if (mode === 'ai' && !state.aiReady) { modeMessage('Die KI ist derzeit nicht verfügbar. Du kannst die Demo nutzen.'); return; }
  if (mode !== state.mode || nextModel !== model) {
    if (state.localAI && state.mode === 'ai') void fetch('/api/release');
    state.mode = mode;
    model = nextModel;
    resetVariants();
    invalidate();
    renderMode();
    message();
  }
  $('mode-dialog').close();
}
$('choose-demo').addEventListener('click', () => chooseMode('demo')); $('choose-ai').addEventListener('click', () => chooseMode('ai'));
$('retry-graphics').addEventListener('click', () => void checkGraphics());
$('preload-toggle').addEventListener('click', () => {
  const panel = $('preload-panel');
  panel.hidden = !panel.hidden;
  $('preload-toggle').setAttribute('aria-expanded', String(!panel.hidden));
  if (!panel.hidden) $('preload-start').focus();
});
$('preload-cancel').addEventListener('click', () => preloadRequest?.abort());
$('preload-start').addEventListener('click', async () => {
  if (!state.localAI || preloadRequest) return;
  if (state.busy) { modeMessage('Bitte warte auf die laufende Antwort oder brich sie ab.'); return; }
  modeMessage();
  const controller = new AbortController();
  preloadRequest = controller;
  const meter = $('preload-meter');
  const bar = $('preload-progress');
  const percent = $('preload-percent');
  const label = $('preload-status');
  const start = $('preload-start');
  const cancel = $('preload-cancel');
  start.hidden = true;
  cancel.hidden = false;
  cancel.focus();
  $('preload-toggle').disabled = true;
  label.textContent = 'Download wird vorbereitet …';
  let currentIndex = -1;
  bar.value = 0;
  percent.textContent = '0 %';
  meter.hidden = false;
  try {
    const response = await fetch('/api/preload', { signal: controller.signal }, ({ id, name, index, total, fraction, ready }) => {
      if (index !== currentIndex) {
        currentIndex = index;
        bar.value = 0;
      }
      bar.value = Math.max(bar.value, Math.round(fraction * 100));
      percent.textContent = bar.value + ' %';
      const step = 'Modell ' + (index + 1) + ' von ' + total + ' · ' + name;
      if (label.textContent !== step) label.textContent = step;
      if (ready) localConsent.add(id);
    });
    const { failed, total } = await response.json();
    label.textContent = failed.length
      ? (total - failed.length) + ' von ' + total + ' Modellen bereit. Fehler bei ' + failed.join(', ') + '. Du kannst den Download erneut starten.'
      : total + ' von ' + total + ' Modellen sind auf diesem Gerät bereit.';
  } catch {
    label.textContent = controller.signal.aborted
      ? 'Download abgebrochen. Fertig geladene Modelle bleiben gespeichert.'
      : 'Der Download konnte nicht gestartet werden. Prüfe deine Verbindung und versuche es erneut.';
  } finally {
    preloadRequest = undefined;
    meter.hidden = true;
    cancel.hidden = true;
    start.hidden = false;
    $('preload-toggle').disabled = false;
    if ($('mode-dialog').open) start.focus();
  }
});
$('ai-confirm').addEventListener('click', () => {
  if (state.localAI) localConsent.add(model); else state.consent = true;
  $('ai-dialog').close();
  requestAnswer();
});
$('ai-use-demo').addEventListener('click', () => { $('ai-dialog').close(); chooseMode('demo'); requestAnswer(); });
const storageKey = 'geile-antwort-material-v1';
try { const saved = localStorage.getItem(storageKey); if (saved) { const parsed = JSON.parse(saved); if (typeof parsed.material === 'string' && parsed.material.length <= 12000) { state.material = parsed.material; $('remember-material').checked = true; } } } catch {}
$('material-apply').addEventListener('click', () => { const text = $('material').value.trim(); if (text !== state.material) { state.material = text; state.consent = false; invalidate(); } try { if ($('remember-material').checked) localStorage.setItem(storageKey, JSON.stringify({ material: text })); else localStorage.removeItem(storageKey); } catch { $('material-message').textContent = 'Das Speichern auf diesem Gerät ist nicht möglich. Deine Hinweise bleiben für diese Sitzung übernommen.'; return; } $('studio-dialog').close(); toast(text ? 'Hinweise übernommen. Sie werden im KI Modus berücksichtigt.' : 'Die Werkstatt ist jetzt leer.'); });
$('material-clear').addEventListener('click', () => { state.material = ''; $('material').value = ''; $('remember-material').checked = false; state.consent = false; try { localStorage.removeItem(storageKey); } catch {} invalidate(); $('material-message').textContent = 'Hinweise aus der Sitzung und dem Gerätespeicher gelöscht.'; });
$('material-file').addEventListener('change', async e => { const file = e.target.files?.[0]; if (!file) return; try { if (!/\.(txt|md)$/i.test(file.name) || file.size > 100000) throw new Error('Bitte wähle eine .txt oder .md Datei mit höchstens 100 KB.'); const text = await file.text(); if (text.length > 12000) throw new Error('Die Datei enthält mehr als 12.000 Zeichen. Bitte kürze sie vor dem Einlesen.'); $('material').value = text; $('material-message').textContent = 'Datei eingelesen. Mit „Hinweise übernehmen“ bestätigen.'; } catch (error) { $('material-message').textContent = error.message; } e.target.value = ''; });
function listening(active) { state.recording = active; $('mic-button').setAttribute('aria-pressed', String(active)); $('mic-label').textContent = active ? 'Stoppen' : 'Einsprechen'; document.querySelectorAll('[data-tone]').forEach(button => { button.disabled = active || state.busy; }); }
function startMic() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) { message('Dieser Browser unterstützt die Spracheingabe nicht. Du kannst die Aussage eintippen oder die Diktierfunktion deiner Handytastatur nutzen.'); return; }
  if (state.busy || state.recording) return;
  const recognition = new Recognition(); state.recognition = recognition; recognition.lang = 'de-DE'; recognition.continuous = false; recognition.interimResults = false; recognition.maxAlternatives = 1;
  const before = $('statement').value.trim(); message();
  recognition.onstart = () => listening(true);
  recognition.onresult = event => { const text = Array.from(event.results).filter(r => r.isFinal).map(r => r[0].transcript).join(' '); if (text) { const combined = (before ? before + ' ' : '') + text; $('statement').value = combined.slice(0, 1200); inputChanged(); if (combined.length > 1200) message('Die Spracheingabe wurde auf 1.200 Zeichen gekürzt. Bitte prüfe den Text.'); else toast('Text erkannt. Prüfe ihn und wähle „Antwort finden“.'); } };
  recognition.onerror = event => { const errors = { 'not-allowed': 'Der Mikrofonzugriff wurde nicht erlaubt. Du kannst die Aussage weiterhin eintippen.', 'service-not-allowed': 'Die Spracherkennung ist in diesem Browser nicht erlaubt.', 'audio-capture': 'Es wurde kein Mikrofon gefunden.', 'no-speech': 'Es wurde keine Sprache erkannt. Versuche es noch einmal.', 'network': 'Die Spracherkennung konnte ihren Dienst nicht erreichen.' }; if (event.error !== 'aborted') message(errors[event.error] || 'Die Spracherkennung wurde unterbrochen. Bitte versuche es erneut.'); };
  recognition.onend = () => { listening(false); state.recognition = null; };
  try { listening(true); recognition.start(); } catch { listening(false); message('Die Spracherkennung konnte nicht gestartet werden. Du kannst den Satz eintippen.'); }
}
$('mic-button').addEventListener('click', () => { if (state.recording) { state.recognition?.stop(); return; } if (!(window.SpeechRecognition || window.webkitSpeechRecognition)) { startMic(); return; } if (state.micConsent) startMic(); else openDialog('mic-dialog'); });
$('mic-confirm').addEventListener('click', () => { state.micConsent = true; $('mic-dialog').close(); startMic(); });
function disableShake() { state.shake = false; window.removeEventListener('devicemotion', motion); state.lastMotion = null; state.peaks = []; clearTimeout(sensorTimer); $('shake-button').setAttribute('aria-pressed', 'false'); $('shake-button').setAttribute('aria-label', 'Schütteln zum Antworten aktivieren'); $('shake-note').textContent = 'Schütteln: Antwort in der zuletzt gewählten Farbe.'; }
function motion(event) {
  if (!state.shake) return; const a = event.accelerationIncludingGravity; if (!a || [a.x,a.y,a.z].some(v => typeof v !== 'number')) return;
  state.motionSeen = true; const now = Date.now(); const current = { x: a.x, y: a.y, z: a.z, time: now }; const old = state.lastMotion; state.lastMotion = current;
  if (!old || now - old.time > 500 || state.busy || state.recording || hasDialog() || document.hidden || now - state.lastShake < 3500) return;
  const delta = Math.hypot(current.x - old.x, current.y - old.y, current.z - old.z);
  if (delta < 17) return; state.peaks = state.peaks.filter(t => now - t < 800); if (!state.peaks.length || now - state.peaks[state.peaks.length - 1] > 80) state.peaks.push(now);
  if (state.peaks.length < 3) return; state.peaks = []; state.lastShake = now;
  if (!$('statement').value.trim()) { message('Schreib oder sprich zuerst die Aussage ein.'); return; }
  requestAnswer();
}
$('shake-button').addEventListener('click', async () => {
  if (state.shake) { disableShake(); toast('Schütteln ausgeschaltet.'); return; }
  if (typeof DeviceMotionEvent === 'undefined' || !window.isSecureContext) { toast('Schütteln ist hier nicht verfügbar. Tippe stattdessen auf eine Ampelfarbe.'); return; }
  try { if (typeof DeviceMotionEvent.requestPermission === 'function') { const permission = await DeviceMotionEvent.requestPermission(); if (permission !== 'granted') { toast('Der Bewegungssensor wurde nicht freigegeben. Nutze den Knopf.'); return; } } }
  catch { toast('Der Bewegungssensor ist hier nicht verfügbar. Nutze den Knopf.'); return; }
  state.shake = true; state.motionSeen = false; window.addEventListener('devicemotion', motion, { passive: true }); $('shake-button').setAttribute('aria-pressed', 'true'); $('shake-button').setAttribute('aria-label', 'Schütteln zum Antworten ausschalten'); $('shake-note').textContent = 'Schütteln ist aktiv. Zum Antworten das Handy kurz schütteln.'; toast('Schütteln aktiviert. Du kannst es mit demselben Knopf ausschalten.');
  sensorTimer = setTimeout(() => { if (state.shake && !state.motionSeen) $('shake-note').textContent = 'Noch keine Sensordaten. Öffne die App direkt auf deinem Handy oder tippe auf eine Ampelfarbe.'; }, 4000);
});
document.addEventListener('visibilitychange', () => { state.peaks = []; state.lastMotion = null; if (document.hidden && state.recording) state.recognition?.stop(); });
if (state.localAI) {
  models = Object.entries(catalogue).map(([id, item]) => ({ id, name: item.name, downloadMB: item.downloadMB, supported: false }));
  showModelOptions();
  renderMode();
} else fetch('/api/status', { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(data => {
  state.aiReady = data.aiReady === true;
  state.providerName = typeof data.providerName === 'string' ? data.providerName : '';
  state.mode = state.aiReady ? 'ai' : 'demo';
  renderMode();
}).catch(() => { renderMode(); $('ai-status').textContent = 'Der Verbindungsstatus konnte nicht geprüft werden. Versuche es nach dem Neuladen erneut.'; });
})();`;
