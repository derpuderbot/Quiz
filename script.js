/**
 * WER WIRD MILLIONÄR - Debug Version
 * Mit ausführlichem Logging zum Debuggen
 */

// ========================================
// CONFIGURATION & CONSTANTS
// ========================================

const DEFAULT_CONFIG = {
  MONEY_LEVELS: [500, 1000, 2000, 3000, 5000, 10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000, 750000, 1000000],
  MILESTONES: [4, 9, 14],
  QUESTIONS_PER_GAME: 15,
  LIFELINES: ['fifty', 'phone', 'audience'],
  CURRENCY_SYMBOL: '€',
  CURRENCY_POSITION: 'after',
  THOUSANDS_SEPARATOR: '.',
  DECIMAL_SEPARATOR: ',',
  STORAGE_KEY: 'wwm_questions',
  SETTINGS_KEY: 'wwm_settings'
};

let CONFIG = { ...DEFAULT_CONFIG };

const DEFAULT_QUESTIONS = [
  { "question": "Wie viele Bundesländer hat die Bundesrepublik Deutschland?", "answers": ["14", "15", "16", "17"], "correct": 2, "category": "Geografie" },
  { "question": "Welches Element hat das chemische Symbol 'Au'?", "answers": ["Silber", "Gold", "Kupfer", "Quecksilber"], "correct": 1, "category": "Chemie" },
  { "question": "In welchem Jahr fiel die Berliner Mauer?", "answers": ["1987", "1989", "1991", "1993"], "correct": 1, "category": "Geschichte" },
  { "question": "Wer schrieb den Roman 'Der Vorleser'?", "answers": ["Günter Grass", "Bernhard Schlink", "Patrick Süskind", "Daniel Kehlmann"], "correct": 1, "category": "Literatur" },
  { "question": "Welcher Planet ist der größte in unserem Sonnensystem?", "answers": ["Saturn", "Jupiter", "Neptun", "Uranus"], "correct": 1, "category": "Astronomie" },
  { "question": "Wie heißt der längste Fluss der Welt?", "answers": ["Amazonas", "Nil", "Jangtsekiang", "Mississippi"], "correct": 1, "category": "Geografie" },
  { "question": "Wer malte das Gemälde 'Die Sternennacht'?", "answers": ["Claude Monet", "Vincent van Gogh", "Pablo Picasso", "Salvador Dalí"], "correct": 1, "category": "Kunst" },
  { "question": "Wie viele Saiten hat eine klassische Gitarre?", "answers": ["4", "5", "6", "7"], "correct": 2, "category": "Musik" },
  { "question": "Welches Land hat die meisten Einwohner?", "answers": ["Indien", "China", "USA", "Indonesien"], "correct": 0, "category": "Geografie" },
  { "question": "Wer entwickelte die Relativitätstheorie?", "answers": ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Max Planck"], "correct": 1, "category": "Physik" },
  { "question": "Wie heißt die Hauptstadt von Australien?", "answers": ["Sydney", "Melbourne", "Canberra", "Brisbane"], "correct": 2, "category": "Geografie" },
  { "question": "Welches Tier ist das Wappentier von Bayern?", "answers": ["Löwe", "Bär", "Adler", "Pferd"], "correct": 0, "category": "Allgemeinwissen" },
  { "question": "In welchem Jahr wurde die EU gegründet (Maastricht-Vertrag)?", "answers": ["1991", "1992", "1993", "1994"], "correct": 1, "category": "Politik" },
  { "question": "Wie viele Spieler hat eine Fußballmannschaft auf dem Platz?", "answers": ["10", "11", "12", "9"], "correct": 1, "category": "Sport" },
  { "question": "Wer war der erste Bundeskanzler der BRD?", "answers": ["Ludwig Erhard", "Konrad Adenauer", "Kurt Georg Kiesinger", "Willy Brandt"], "correct": 1, "category": "Geschichte" }
];

const state = {
  questions: [], currentQuestionIndex: 0, currentQuestion: null, selectedAnswer: null,
  usedLifelines: { fifty: false, phone: false, audience: false },
  lifelineResults: { fifty: null, phone: null, audience: null },
  guaranteedWinnings: 0, gameStatus: 'playing', isAnimating: false, soundEnabled: true
};

const els = {};

function log(...args) { console.log('[WWM]', new Date().toLocaleTimeString(), ...args); }
function logError(...args) { console.error('[WWM ERROR]', new Date().toLocaleTimeString(), ...args); }

async function init() {
  log('🚀 init() gestartet');
  try {
    await loadConfig();
    log('✅ loadConfig() fertig');
    cacheElements();
    log('✅ cacheElements() fertig');
    createParticles();
    log('✅ createParticles() fertig');
    loadQuestions();
    log('✅ loadQuestions() fertig');
    buildMoneyTree();
    log('✅ buildMoneyTree() fertig');
    bindEvents();
    log('✅ bindEvents() fertig');
    startNewGame();
    log('✅ startNewGame() fertig - SPIEL BEREIT');
  } catch (e) {
    logError('❌ INIT FEHLGESCHLAGEN:', e);
    document.body.innerHTML = `<pre style="color:#ff3366;padding:2rem;font-family:monospace;background:#0a1226">INIT FEHLER:${e.message}\n\nStack:\n${e.stack}</pre>`;
  }
}

async function loadConfig() {
  log('📥 Lade config.json...');
  try {
    const response = await fetch('config.json', { cache: 'no-cache' });
    log('📡 Fetch response:', response.status, response.statusText);
    if (response.ok) {
      const userConfig = await response.json();
      CONFIG = { ...DEFAULT_CONFIG, ...userConfig };
      log('✅ config.json geladen:', CONFIG);
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (e) {
    logError('⚠️ config.json Fehler, nutze Defaults:', e.message);
    CONFIG = { ...DEFAULT_CONFIG };
  }
  if (!Array.isArray(CONFIG.MILESTONES) || CONFIG.MILESTONES.some(m => m < 0 || m >= CONFIG.MONEY_LEVELS.length)) {
    CONFIG.MILESTONES = DEFAULT_CONFIG.MILESTONES;
  }
  if (!Array.isArray(CONFIG.MONEY_LEVELS) || CONFIG.MONEY_LEVELS.length === 0) {
    CONFIG.MONEY_LEVELS = DEFAULT_CONFIG.MONEY_LEVELS;
  }
  log('🔧 CONFIG final:', JSON.stringify(CONFIG));
}

function cacheElements() {
  log('🔍 cacheElements()...');
  const ids = [
    'currentQuestionNum','totalQuestions','questionText','currentValue','answersGrid',
    'lifeline50','lifelinePhone','lifelineAudience','confirmBtn','walkAwayBtn',
    'modalOverlay','modal','modalTitle','modalBody','modalFooter','modalClose',
    'audienceModalOverlay','audienceChart','closeAudienceModal',
    'phoneModalOverlay','phoneText','phoneResult','phoneAdvice','phoneConfidence','closePhoneModal',
    'endModalOverlay','endModalTitle','endModalBody','restartBtn','editQuestionsBtn',
    'editorModalOverlay','editorModal','editorClose','jsonEditor','validateJson','saveJson','addQuestion','saveVisual','visualEditor'
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) logError(`❌ Element nicht gefunden: #${id}`);
    else log(`✅ #${id} gefunden`);
    els[id] = el;
  });
  // QuerySelectors
  els.editorTabs = document.querySelectorAll('.editor-tab');
  els.editorPanels = document.querySelectorAll('.editor-panel');
  log('🔍 cacheElements() fertig');
}

function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return logError('❌ #particles Container fehlt');
  const particleCount = 30;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDelay = `${Math.random() * 10}s`;
    p.style.animationDuration = `${8 + Math.random() * 8}s`;
    p.style.opacity = `${0.3 + Math.random() * 0.5}`;
    const size = 2 + Math.random() * 4;
    p.style.width = `${size}px`; p.style.height = `${size}px`;
    container.appendChild(p);
  }
  log('✨ Particles erstellt');
}

function loadQuestions() {
  try {
    const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.questions?.length) {
        state.questions = validateQuestions(data.questions);
        log('📚 Fragen aus localStorage geladen:', state.questions.length);
        return;
      }
    }
  } catch (e) { logError('localStorage Fehler:', e); }
  state.questions = [...DEFAULT_QUESTIONS];
  saveQuestions();
  log('📚 Default-Fragen geladen:', state.questions.length);
}

function validateQuestions(questions) {
  return questions.filter(q => q && q.question && q.answers?.length === 4 && typeof q.correct === 'number' && q.correct >= 0 && q.correct <= 3)
    .map(q => ({ question: String(q.question).trim(), answers: q.answers.map(a => String(a).trim()), correct: Math.floor(q.correct), category: q.category ? String(q.category).trim() : 'Allgemein' }));
}

function saveQuestions() {
  try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ questions: state.questions })); }
  catch (e) { logError('Save Fehler:', e); }
}

function getRandomQuestions(count) { return [...state.questions].sort(() => Math.random() - 0.5).slice(0, Math.min(count, state.questions.length)); }

function buildMoneyTree() {
  const container = document.getElementById('moneyTree');
  if (!container) return logError('❌ #moneyTree Container fehlt');
  container.innerHTML = '';
  [...CONFIG.MONEY_LEVELS].reverse().forEach((amount, index) => {
    const levelIndex = CONFIG.MONEY_LEVELS.length - 1 - index;
    const isMilestone = CONFIG.MILESTONES.includes(levelIndex);
    const level = document.createElement('div');
    level.className = `money-tree-level ${isMilestone ? 'milestone' : ''}`;
    level.dataset.level = levelIndex;
    level.innerHTML = `<span class="level-number">${levelIndex + 1}.</span><span class="level-amount">${formatCurrency(amount)}</span>`;
    container.appendChild(level);
  });
  log('💰 Money Tree gebaut:', CONFIG.MONEY_LEVELS.length, 'Stufen');
}

function updateMoneyTree() {
  document.querySelectorAll('.money-tree-level').forEach(level => {
    const idx = parseInt(level.dataset.level);
    level.classList.remove('active', 'correct', 'current');
    if (idx < state.currentQuestionIndex) level.classList.add('correct');
    else if (idx === state.currentQuestionIndex) level.classList.add('current', 'active');
  });
}

function formatCurrency(amount) {
  const symbol = CONFIG.CURRENCY_SYMBOL || '€';
  const position = CONFIG.CURRENCY_POSITION || 'after';
  const thousandsSep = CONFIG.THOUSANDS_SEPARATOR || '.';
  const decimalSep = CONFIG.DECIMAL_SEPARATOR || ',';
  let formatted = amount.toString();
  const parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
  formatted = parts.join(decimalSep);
  return position === 'before' ? `${symbol} ${formatted}` : `${formatted} ${symbol}`;
}

function startNewGame() {
  log('🎮 Neues Spiel startet...');
  state.currentQuestionIndex = 0;
  state.usedLifelines = { fifty: false, phone: false, audience: false };
  state.lifelineResults = { fifty: null, phone: null, audience: null };
  state.guaranteedWinnings = 0;
  state.gameStatus = 'playing';
  state.isAnimating = false;
  const gameQuestions = getRandomQuestions(CONFIG.QUESTIONS_PER_GAME);
  if (gameQuestions.length < CONFIG.QUESTIONS_PER_GAME) {
    showModal('Nicht genug Fragen', `Nur ${gameQuestions.length} Fragen verfügbar.`, [{ text: 'OK', primary: true, action: () => hideModal() }]);
    return;
  }
  state.gameQuestions = gameQuestions;
  resetLifelineButtons();
  updateMoneyTree();
  loadQuestion(0);
  log('🎮 Spiel bereit');
}

function loadQuestion(index) {
  if (index >= state.gameQuestions.length) return endGame(true);
  state.currentQuestionIndex = index;
  state.currentQuestion = state.gameQuestions[index];
  state.selectedAnswer = null; state.isAnimating = false;
  els.currentQuestionNum.textContent = index + 1;
  els.questionText.textContent = state.currentQuestion.question;
  els.currentValue.textContent = formatCurrency(CONFIG.MONEY_LEVELS[index]);
  renderAnswers();
  els.confirmBtn.disabled = true;
  els.confirmBtn.querySelector('.btn-text').textContent = 'ANTWORT BESTÄTIGEN';
  updateMoneyTree();
  els.questionText.style.animation = 'none'; els.questionText.offsetHeight; els.questionText.style.animation = 'questionReveal 0.6s var(--transition-bounce)';
}

function renderAnswers() {
  els.answersGrid.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  state.currentQuestion.answers.forEach((answer, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.dataset.index = i;
    btn.setAttribute('role', 'listitem');
    btn.innerHTML = `<span class="answer-letter">${letters[i]}</span><span class="answer-text">${answer}</span>`;
    btn.addEventListener('click', () => selectAnswer(i, btn));
    els.answersGrid.appendChild(btn);
  });
}

function selectAnswer(index, button) {
  if (state.isAnimating || state.gameStatus !== 'playing') return;
  document.querySelectorAll('.answer-btn').forEach(b => b.classList.remove('selected'));
  button.classList.add('selected');
  state.selectedAnswer = index;
  els.confirmBtn.disabled = false;
  els.confirmBtn.querySelector('.btn-text').textContent = 'JETZT BESTÄTIGEN';
}

async function confirmAnswer() {
  if (state.selectedAnswer === null || state.isAnimating) return;
  state.isAnimating = true; els.confirmBtn.disabled = true;
  const correctIndex = state.currentQuestion.correct;
  const isCorrect = state.selectedAnswer === correctIndex;
  document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
  if (isCorrect) await handleCorrectAnswer(correctIndex);
  else await handleWrongAnswer(state.selectedAnswer, correctIndex);
}

async function handleCorrectAnswer(correctIndex) {
  els.answersGrid.children[correctIndex].classList.add('correct');
  await sleep(1000);
  if (CONFIG.MILESTONES.includes(state.currentQuestionIndex)) {
    state.guaranteedWinnings = CONFIG.MONEY_LEVELS[state.currentQuestionIndex];
    showMilestoneModal(); return;
  }
  if (state.currentQuestionIndex === CONFIG.QUESTIONS_PER_GAME - 1) { await sleep(500); endGame(true); return; }
  loadQuestion(state.currentQuestionIndex + 1);
}

async function handleWrongAnswer(selectedIndex, correctIndex) {
  els.answersGrid.children[selectedIndex].classList.add('wrong');
  await sleep(500);
  els.answersGrid.children[correctIndex].classList.add('correct');
  await sleep(1500); endGame(false);
}

function showMilestoneModal() {
  const amount = formatCurrency(state.guaranteedWinnings);
  showModal('MEILENSTEIN ERREICHT!', `Herzlichen Glückwunsch! ${amount} sind sicher!`, [
    { text: 'WEITERSPIELEN', primary: true, action: () => { hideModal(); loadQuestion(state.currentQuestionIndex + 1); } },
    { text: 'AUSSTEIGEN', primary: false, action: () => { hideModal(); walkAway(); } }
  ]);
}

function walkAway() {
  if (state.gameStatus !== 'playing') return;
  const won = state.currentQuestionIndex > 0 ? CONFIG.MONEY_LEVELS[state.currentQuestionIndex - 1] : 0;
  endGame(true, Math.max(won, state.guaranteedWinnings), true);
}

function endGame(won, finalAmount = null, walked = false) {
  state.gameStatus = won ? 'won' : 'lost';
  const amount = finalAmount ?? (won ? CONFIG.MONEY_LEVELS[CONFIG.QUESTIONS_PER_GAME - 1] : state.guaranteedWinnings);
  const isMillionaire = won && state.currentQuestionIndex === CONFIG.QUESTIONS_PER_GAME - 1;
  let title, body;
  if (isMillionaire) {
    title = '🎉 SIE SIND MILLIONÄR! 🎉';
    body = `<div class="win-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div><h3 class="end-title">${formatCurrency(amount)}</h3><p class="end-subtitle">Alle 15 Fragen richtig!</p><div class="end-stats"><div class="stat"><span class="stat-value">${formatCurrency(amount)}</span><span class="stat-label">Gewinn</span></div><div class="stat"><span class="stat-value">15/15</span><span class="stat-label">Fragen</span></div></div>`;
  } else if (won) {
    title = walked ? 'AUSGESTIEGEN' : 'GEWONNEN!';
    body = `<h3 class="end-title">${formatCurrency(amount)}</h3><p class="end-subtitle">${walked ? 'Ausgestiegen mit Gewinn.' : 'Spiel beendet.'}</p><div class="end-stats"><div class="stat"><span class="stat-value">${formatCurrency(amount)}</span><span class="stat-label">Gewinn</span></div><div class="stat"><span class="stat-value">${state.currentQuestionIndex}/${CONFIG.QUESTIONS_PER_GAME}</span><span class="stat-label">Fragen</span></div><div class="stat"><span class="stat-value">${formatCurrency(state.guaranteedWinnings)}</span><span class="stat-label">Sicher</span></div></div>`;
  } else {
    title = '😔 LEIDER FALSCH';
    body = `<h3 class="end-title" style="color:var(--wrong-red)">${formatCurrency(amount)}</h3><p class="end-subtitle">Richtig war: <strong>${state.currentQuestion.answers[state.currentQuestion.correct]}</strong></p><div class="end-stats"><div class="stat"><span class="stat-value">${formatCurrency(amount)}</span><span class="stat-label">Gewinn</span></div><div class="stat"><span class="stat-value">${state.currentQuestionIndex}/${CONFIG.QUESTIONS_PER_GAME}</span><span class="stat-label">Frage</span></div><div class="stat"><span class="stat-value">${formatCurrency(state.guaranteedWinnings)}</span><span class="stat-label">Sicher</span></div></div>`;
  }
  els.endModalTitle.textContent = title; els.endModalBody.innerHTML = body; showEndModal();
}

function resetLifelineButtons() {
  CONFIG.LIFELINES.forEach(l => { const b = document.getElementById(`lifeline${l.charAt(0).toUpperCase()+l.slice(1)}`); if (b) { b.disabled = false; b.setAttribute('aria-pressed', 'false'); } });
  state.usedLifelines = { fifty: false, phone: false, audience: false };
  state.lifelineResults = { fifty: null, phone: null, audience: null };
}

async function useLifeline(lifeline) {
  if (state.usedLifelines[lifeline] || state.isAnimating || state.gameStatus !== 'playing') return;
  state.usedLifelines[lifeline] = true;
  const b = document.getElementById(`lifeline${lifeline.charAt(0).toUpperCase()+lifeline.slice(1)}`); if (b) { b.disabled = true; b.setAttribute('aria-pressed', 'true'); }
  if (lifeline === 'fifty') await useFiftyFifty();
  else if (lifeline === 'phone') await usePhoneJoker();
  else if (lifeline === 'audience') await useAudienceJoker();
}

async function useFiftyFifty() {
  const correct = state.currentQuestion.correct;
  const wrong = [0,1,2,3].filter(i => i !== correct).sort(() => Math.random() - 0.5).slice(0, 2);
  wrong.forEach((idx, i) => setTimeout(() => { const b = els.answersGrid.children[idx]; if (b) { b.classList.add('eliminated'); b.disabled = true; } }, i * 300));
  state.lifelineResults.fifty = { eliminated: wrong }; await sleep(800);
}

async function usePhoneJoker() {
  showPhoneModal(); await sleep(2000 + Math.random() * 2000);
  const correct = state.currentQuestion.correct;
  const helpful = Math.random() < 0.75;
  let advice, conf;
  if (helpful) { const c = 70 + Math.random() * 25; advice = `Ich bin zu ${Math.round(c)}% sicher: Antwort ${String.fromCharCode(65+correct)} - "${state.currentQuestion.answers[correct]}".`; conf = `Experte: ${Math.round(c)}%`; }
  else { const wrong = [0,1,2,3].filter(i => i !== correct)[Math.floor(Math.random() * 3)]; const c = 50 + Math.random() * 30; advice = `Hmm, vielleicht ${String.fromCharCode(65+wrong)}? Nicht sicher...`; conf = `Experte: ${Math.round(c)}% (falsch)`; }
  document.getElementById('phoneText').hidden = true;
  document.getElementById('phoneResult').hidden = false;
  document.getElementById('phoneAdvice').textContent = advice;
  document.getElementById('phoneConfidence').textContent = conf;
  document.getElementById('closePhoneModal').hidden = false;
  state.lifelineResults.phone = { advice, conf, correct: helpful };
}

async function useAudienceJoker() {
  showAudienceModal(); await sleep(500);
  const correct = state.currentQuestion.correct;
  const base = 45 + Math.random() * 35; const rem = 100 - base; const others = [0,1,2,3].filter(i => i !== correct);
  const dist = {}; dist[correct] = base; others.forEach((o, i) => dist[o] = i === others.length - 1 ? rem - Object.values(dist).reduce((a,b)=>a+b,0) : Math.random() * rem * 0.7);
  Object.keys(dist).forEach(k => { let s = 0; Object.keys(dist).forEach(x => s += Math.round(dist[x])); dist[correct] += 100 - s; Object.keys(dist).forEach(x => dist[x] = Math.round(dist[x])); });
  animateAudienceBars(dist); state.lifelineResults.audience = { distribution: dist };
}

function animateAudienceBars(dist) {
  const c = document.getElementById('audienceChart'); c.innerHTML = '';
  ['A','B','C','D'].forEach((l, i) => {
    const p = dist[i] || 0; const corr = i === state.currentQuestion.correct;
    const w = document.createElement('div'); w.className = 'audience-bar-container';
    w.innerHTML = `<div class="audience-bar-wrapper"><div class="audience-bar ${corr?'correct':''}" data-percent="${p}%" style="height:0%"></div></div><span class="audience-label">${l}</span>`;
    c.appendChild(w);
  });
  requestAnimationFrame(() => c.querySelectorAll('.audience-bar').forEach(b => b.style.height = `${parseInt(b.dataset.percent)}%`));
}

function showModal(title, body, buttons = []) {
  els.modalTitle.textContent = title; els.modalBody.innerHTML = body; els.modalFooter.innerHTML = '';
  buttons.forEach(({text, primary, action}) => { const b = document.createElement('button'); b.className = `action-btn ${primary?'primary':'secondary'}`; b.textContent = text; b.onclick = () => { hideModal(); if (action) action(); }; els.modalFooter.appendChild(b); });
  els.modalOverlay.hidden = false; els.modalClose.focus();
}
function hideModal() { els.modalOverlay.hidden = true; }
function showAudienceModal() { els.audienceModalOverlay.hidden = false; }
function hideAudienceModal() { els.audienceModalOverlay.hidden = true; }
function showPhoneModal() { document.getElementById('phoneText').hidden = false; document.getElementById('phoneResult').hidden = true; document.getElementById('closePhoneModal').hidden = true; els.phoneModalOverlay.hidden = false; }
function hidePhoneModal() { els.phoneModalOverlay.hidden = true; }
function showEndModal() { els.endModalOverlay.hidden = false; els.restartBtn.focus(); }
function hideEndModal() { els.endModalOverlay.hidden = true; }
function showEditorModal(tab = 'json') { els.jsonEditor.value = JSON.stringify({ questions: state.questions }, null, 2); renderVisualEditor(); switchEditorTab(tab); els.editorModalOverlay.hidden = false; }
function hideEditorModal() { els.editorModalOverlay.hidden = true; }
function switchEditorTab(tab) { els.editorTabs.forEach(t => { const a = t.dataset.tab === tab; t.classList.toggle('active', a); t.setAttribute('aria-selected', a); }); els.editorPanels.forEach(p => p.hidden = p.id !== `${tab}Panel`); }

function renderVisualEditor() {
  const c = els.visualEditor; c.innerHTML = '';
  state.questions.forEach((q, idx) => {
    const d = document.createElement('div'); d.className = 'visual-question';
    d.innerHTML = `<div class="visual-question-header"><span class="visual-question-num">Frage ${idx+1}</span><button class="visual-question-delete" data-index="${idx}">×</button></div><div class="visual-question-fields"><div class="visual-field"><label>Kategorie</label><input data-field="category" value="${q.category||'Allgemein'}"></div><div class="visual-field"><label>Frage</label><input data-field="question" value="${q.question}"></div><div class="visual-field"><label>Antworten</label><div class="answers-list">${q.answers.map((a,i)=>`<div class="answer-row"><input data-field="answers" data-index="${i}" value="${a}"><button type="button" class="correct-toggle ${i===q.correct?'active':''}" data-correct="${i}" aria-pressed="${i===q.correct}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg><span>Richtig</span></button></div>`).join('')}</div></div></div>`;
    c.appendChild(d);
  });
  c.querySelectorAll('.visual-question-delete').forEach(b => b.onclick = () => { state.questions.splice(parseInt(b.dataset.index),1); saveQuestions(); renderVisualEditor(); els.jsonEditor.value = JSON.stringify({ questions: state.questions }, null, 2); });
  c.querySelectorAll('.correct-toggle').forEach(b => b.onclick = () => { const q = b.closest('.visual-question'); const qi = parseInt(q.querySelector('.visual-question-delete').dataset.index); const ai = parseInt(b.dataset.correct); state.questions[qi].correct = ai; q.querySelectorAll('.correct-toggle').forEach((x,i)=>{x.classList.toggle('active',i===ai);x.setAttribute('aria-pressed',i===ai);}); q.querySelectorAll('input[data-field="answers"]').forEach((x,i)=>x.classList.toggle('correct-answer',i===ai)); });
  c.querySelectorAll('input[data-field]').forEach(inp => inp.onchange = () => { const q = inp.closest('.visual-question'); const qi = parseInt(q.querySelector('.visual-question-delete').dataset.index); const f = inp.dataset.field; const ai = inp.dataset.index !== undefined ? parseInt(inp.dataset.index) : null; if (ai !== null) state.questions[qi].answers[ai] = inp.value; else state.questions[qi][f] = inp.value; els.jsonEditor.value = JSON.stringify({ questions: state.questions }, null, 2); });
}

function deleteQuestion(i) { if (state.questions.length <= 1) return showModal('Nein','Mindestens 1 Frage nötig.',[{text:'OK',primary:true,action:hideModal}]); state.questions.splice(i,1); saveQuestions(); renderVisualEditor(); els.jsonEditor.value = JSON.stringify({ questions: state.questions }, null, 2); }

function validateJsonInput() { try { const v = JSON.parse(els.jsonEditor.value); if (!v.questions || !Array.isArray(v.questions)) throw new Error('Format: { "questions": [...] }'); const valid = validateQuestions(v.questions); if (!valid.length) throw new Error('Keine gültigen Fragen'); if (valid.length < v.questions.length) showModal('Warnung',`${v.questions.length - valid.length} ungültig entfernt.`,[{text:'OK',primary:true,action:hideModal}]); return valid; } catch (e) { showModal('JSON Fehler', e.message, [{text:'OK',primary:true,action:hideModal}]); return null; } }

function saveQuestionsFromEditor() { const v = validateJsonInput(); if (!v) return; state.questions = v; saveQuestions(); hideEditorModal(); showModal('Gespeichert!', `${v.length} Fragen gespeichert.`, [{text:'OK',primary:true,action:hideModal}]); }

function addQuestion() { state.questions.push({question:'Neue Frage',answers:['A','B','C','D'],correct:0,category:'Allgemein'}); renderVisualEditor(); els.jsonEditor.value = JSON.stringify({ questions: state.questions }, null, 2); }

function bindEvents() {
  log('🔗 bindEvents()...');
  els.confirmBtn.onclick = confirmAnswer;
  els.walkAwayBtn.onclick = () => { if (state.gameStatus === 'playing') showModal('Aussteigen?', `Sicher? Sie nehmen ${formatCurrency(Math.max(state.currentQuestionIndex>0?CONFIG.MONEY_LEVELS[state.currentQuestionIndex-1]:0, state.guaranteedWinnings))} mit.`, [{text:'JA',primary:false,action:walkAway},{text:'NEIN',primary:true,action:hideModal}]); };
  CONFIG.LIFELINES.forEach(l => { const b = document.getElementById(`lifeline${l.charAt(0).toUpperCase()+l.slice(1)}`); if (b) b.onclick = () => useLifeline(l); });
  els.modalClose.onclick = hideModal; els.modalOverlay.onclick = e => { if (e.target === els.modalOverlay) hideModal(); };
  document.getElementById('closeAudienceModal').onclick = hideAudienceModal; els.audienceModalOverlay.onclick = e => { if (e.target === els.audienceModalOverlay) hideAudienceModal(); };
  document.getElementById('closePhoneModal').onclick = hidePhoneModal; els.phoneModalOverlay.onclick = e => { if (e.target === els.phoneModalOverlay) hidePhoneModal(); };
  els.restartBtn.onclick = () => { hideEndModal(); startNewGame(); };
  els.editQuestionsBtn.onclick = () => { hideEndModal(); showEditorModal(); };
  els.endModalOverlay.onclick = e => { if (e.target === els.endModalOverlay) hideEndModal(); };
  els.editorClose.onclick = hideEditorModal; els.editorModalOverlay.onclick = e => { if (e.target === els.editorModalOverlay) hideEditorModal(); };
  els.editorTabs.forEach(t => t.onclick = () => switchEditorTab(t.dataset.tab));
  document.getElementById('validateJson').onclick = () => { const v = validateJsonInput(); if (v) showModal('OK', `${v.length} Fragen gültig.`, [{text:'OK',primary:true,action:hideModal}]); };
  els.saveJson.onclick = saveQuestionsFromEditor; document.getElementById('addQuestion').onclick = addQuestion; document.getElementById('saveVisual').onclick = saveQuestionsFromEditor;
  document.addEventListener('keydown', e => { if (state.gameStatus !== 'playing' || state.isAnimating) return; if (e.key >= '1' && e.key <= '4') { const i = parseInt(e.key)-1; const b = els.answersGrid.children[i]; if (b && !b.disabled && !b.classList.contains('eliminated')) selectAnswer(i, b); } if (e.key === 'Enter' && !els.confirmBtn.disabled) confirmAnswer(); if (e.key === 'Escape') { if (!els.modalOverlay.hidden) hideModal(); else if (!els.audienceModalOverlay.hidden) hideAudienceModal(); else if (!els.phoneModalOverlay.hidden) hidePhoneModal(); else if (!els.endModalOverlay.hidden) hideEndModal(); else if (!els.editorModalOverlay.hidden) hideEditorModal(); } if (e.key==='f'||e.key==='F') useLifeline('fifty'); if (e.key==='t'||e.key==='T') useLifeline('phone'); if (e.key==='p'||e.key==='P') useLifeline('audience'); });
  els.answersGrid.addEventListener('touchstart', e => { const b = e.target.closest('.answer-btn'); if (b && !b.disabled && !state.isAnimating) b.classList.add('touch-active'); }, {passive:true});
  els.answersGrid.addEventListener('touchend', e => { const b = e.target.closest('.answer-btn'); if (b) b.classList.remove('touch-active'); });
  log('🔗 bindEvents() fertig');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function escapeHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

window.WWM = { state, CONFIG, startNewGame, showEditorModal, saveQuestions, loadQuestions, DEFAULT_QUESTIONS };

document.addEventListener('DOMContentLoaded', init);
if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {})); }
