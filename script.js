/**
 * WER WIRD MILLIONÄR - Main Game Logic
 * Vollständig anpassbares Quiz-System für GitHub Pages
 */

// ========================================
// CONFIGURATION & CONSTANTS
// ========================================

// Default Config (Fallback falls config.json nicht lädt)
const DEFAULT_CONFIG = {
  MONEY_LEVELS: [
    500, 1000, 2000, 3000, 5000,
    10000, 20000, 30000, 50000, 100000,
    200000, 300000, 500000, 750000, 1000000
  ],
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

// Wird nach Laden von config.json befüllt
let CONFIG = { ...DEFAULT_CONFIG };

// ========================================
// DEFAULT QUESTIONS (Beispiel-Fragen)
// ========================================

const DEFAULT_QUESTIONS = [
  {
    "question": "Wie viele Bundesländer hat die Bundesrepublik Deutschland?",
    "answers": ["14", "15", "16", "17"],
    "correct": 2,
    "category": "Geografie"
  },
  {
    "question": "Welches Element hat das chemische Symbol 'Au'?",
    "answers": ["Silber", "Gold", "Kupfer", "Quecksilber"],
    "correct": 1,
    "category": "Chemie"
  },
  {
    "question": "In welchem Jahr fiel die Berliner Mauer?",
    "answers": ["1987", "1989", "1991", "1993"],
    "correct": 1,
    "category": "Geschichte"
  },
  {
    "question": "Wer schrieb den Roman 'Der Vorleser'?",
    "answers": ["Günter Grass", "Bernhard Schlink", "Patrick Süskind", "Daniel Kehlmann"],
    "correct": 1,
    "category": "Literatur"
  },
  {
    "question": "Welcher Planet ist der größte in unserem Sonnensystem?",
    "answers": ["Saturn", "Jupiter", "Neptun", "Uranus"],
    "correct": 1,
    "category": "Astronomie"
  },
  {
    "question": "Wie heißt der längste Fluss der Welt?",
    "answers": ["Amazonas", "Nil", "Jangtsekiang", "Mississippi"],
    "correct": 1,
    "category": "Geografie"
  },
  {
    "question": "Wer malte das Gemälde 'Die Sternennacht'?",
    "answers": ["Claude Monet", "Vincent van Gogh", "Pablo Picasso", "Salvador Dalí"],
    "correct": 1,
    "category": "Kunst"
  },
  {
    "question": "Wie viele Saiten hat eine klassische Gitarre?",
    "answers": ["4", "5", "6", "7"],
    "correct": 2,
    "category": "Musik"
  },
  {
    "question": "Welches Land hat die meisten Einwohner?",
    "answers": ["Indien", "China", "USA", "Indonesien"],
    "correct": 0,
    "category": "Geografie"
  },
  {
    "question": "Wer entwickelte die Relativitätstheorie?",
    "answers": ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Max Planck"],
    "correct": 1,
    "category": "Physik"
  },
  {
    "question": "Wie heißt die Hauptstadt von Australien?",
    "answers": ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    "correct": 2,
    "category": "Geografie"
  },
  {
    "question": "Welches Tier ist das Wappentier von Bayern?",
    "answers": ["Löwe", "Bär", "Adler", "Pferd"],
    "correct": 0,
    "category": "Allgemeinwissen"
  },
  {
    "question": "In welchem Jahr wurde die EU gegründet (Maastricht-Vertrag)?",
    "answers": ["1991", "1992", "1993", "1994"],
    "correct": 1,
    "category": "Politik"
  },
  {
    "question": "Wie viele Spieler hat eine Fußballmannschaft auf dem Platz?",
    "answers": ["10", "11", "12", "9"],
    "correct": 1,
    "category": "Sport"
  },
  {
    "question": "Wer war der erste Bundeskanzler der BRD?",
    "answers": ["Ludwig Erhard", "Konrad Adenauer", "Kurt Georg Kiesinger", "Willy Brandt"],
    "correct": 1,
    "category": "Geschichte"
  }
];

// ========================================
// GAME STATE
// ========================================

const state = {
  questions: [],
  currentQuestionIndex: 0,
  currentQuestion: null,
  selectedAnswer: null,
  usedLifelines: { fifty: false, phone: false, audience: false },
  lifelineResults: { fifty: null, phone: null, audience: null },
  guaranteedWinnings: 0,
  gameStatus: 'playing', // playing, won, lost, walked
  isAnimating: false,
  soundEnabled: true
};

// ========================================
// DOM ELEMENTS CACHE
// ========================================

const els = {};

// ========================================
// INITIALIZATION
// ========================================

async function init() {
  await loadConfig();
  cacheElements();
  createParticles();
  loadQuestions();
  buildMoneyTree();
  bindEvents();
  startNewGame();
}

async function loadConfig() {
  try {
    const response = await fetch('config.json', { cache: 'no-cache' });
    if (response.ok) {
      const userConfig = await response.json();
      CONFIG = { ...DEFAULT_CONFIG, ...userConfig };
      console.log('✅ config.json geladen:', CONFIG);
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (e) {
    console.warn('⚠️ config.json nicht geladen, nutze Defaults:', e.message);
    CONFIG = { ...DEFAULT_CONFIG };
  }
  // Milestones validieren
  if (!Array.isArray(CONFIG.MILESTONES) || CONFIG.MILESTONES.some(m => m < 0 || m >= CONFIG.MONEY_LEVELS.length)) {
    CONFIG.MILESTONES = DEFAULT_CONFIG.MILESTONES;
  }
  // Garantieren dass MONEY_LEVELS existiert
  if (!Array.isArray(CONFIG.MONEY_LEVELS) || CONFIG.MONEY_LEVELS.length === 0) {
    CONFIG.MONEY_LEVELS = DEFAULT_CONFIG.MONEY_LEVELS;
  }
}

function cacheElements() {
  // Question area
  els.questionNumber = document.getElementById('currentQuestionNum');
  els.totalQuestions = document.getElementById('totalQuestions');
  els.questionText = document.getElementById('questionText');
  els.questionValue = document.getElementById('currentValue');
  els.answersGrid = document.getElementById('answersGrid');

  // Lifelines
  els.lifeline50 = document.getElementById('lifeline50');
  els.lifelinePhone = document.getElementById('lifelinePhone');
  els.lifelineAudience = document.getElementById('lifelineAudience');

  // Actions
  els.confirmBtn = document.getElementById('confirmBtn');
  els.walkAwayBtn = document.getElementById('walkAwayBtn');

  // Modals
  els.modalOverlay = document.getElementById('modalOverlay');
  els.modal = document.getElementById('modal');
  els.modalTitle = document.getElementById('modalTitle');
  els.modalBody = document.getElementById('modalBody');
  els.modalFooter = document.getElementById('modalFooter');
  els.modalClose = document.getElementById('modalClose');

  els.audienceModalOverlay = document.getElementById('audienceModalOverlay');
  els.audienceChart = document.getElementById('audienceChart');
  els.closeAudienceModal = document.getElementById('closeAudienceModal');

  els.phoneModalOverlay = document.getElementById('phoneModalOverlay');
  els.phoneText = document.getElementById('phoneText');
  els.phoneResult = document.getElementById('phoneResult');
  els.phoneAdvice = document.getElementById('phoneAdvice');
  els.phoneConfidence = document.getElementById('phoneConfidence');
  els.closePhoneModal = document.getElementById('closePhoneModal');

  els.endModalOverlay = document.getElementById('endModalOverlay');
  els.endModalTitle = document.getElementById('endModalTitle');
  els.endModalBody = document.getElementById('endModalBody');
  els.restartBtn = document.getElementById('restartBtn');
  els.editQuestionsBtn = document.getElementById('editQuestionsBtn');

  els.editorModalOverlay = document.getElementById('editorModalOverlay');
  els.editorModal = document.getElementById('editorModal');
  els.editorClose = document.getElementById('editorClose');
  els.jsonEditor = document.getElementById('jsonEditor');
  els.validateJson = document.getElementById('validateJson');
  els.saveJson = document.getElementById('saveJson');
  els.addQuestion = document.getElementById('addQuestion');
  els.saveVisual = document.getElementById('saveVisual');
  els.visualEditor = document.getElementById('visualEditor');
  els.editorTabs = document.querySelectorAll('.editor-tab');
  els.editorPanels = document.querySelectorAll('.editor-panel');

  // Set total questions
  els.totalQuestions.textContent = CONFIG.QUESTIONS_PER_GAME;
}

// ========================================
// PARTICLES BACKGROUND
// ========================================

function createParticles() {
  const container = document.getElementById('particles');
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    particle.style.animationDuration = `${8 + Math.random() * 8}s`;
    particle.style.opacity = `${0.3 + Math.random() * 0.5}`;
    const size = 2 + Math.random() * 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    container.appendChild(particle);
  }
}

// ========================================
// QUESTIONS MANAGEMENT
// ========================================

function loadQuestions() {
  try {
    const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        state.questions = validateQuestions(data.questions);
        return;
      }
    }
  } catch (e) {
    console.warn('Fehler beim Laden der Fragen, verwende Standard:', e);
  }
  // Fallback zu Standardfragen
  state.questions = [...DEFAULT_QUESTIONS];
  saveQuestions();
}

function validateQuestions(questions) {
  return questions
    .filter(q => q && q.question && q.answers && Array.isArray(q.answers) && q.answers.length === 4 &&
      typeof q.correct === 'number' && q.correct >= 0 && q.correct <= 3)
    .map(q => ({
      question: String(q.question).trim(),
      answers: q.answers.map(a => String(a).trim()),
      correct: Math.floor(q.correct),
      category: q.category ? String(q.category).trim() : 'Allgemein'
    }));
}

function saveQuestions() {
  try {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ questions: state.questions }));
  } catch (e) {
    console.error('Fehler beim Speichern der Fragen:', e);
  }
}

function getRandomQuestions(count) {
  const shuffled = [...state.questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ========================================
// MONEY TREE
// ========================================

function buildMoneyTree() {
  const container = document.getElementById('moneyTree');
  container.innerHTML = '';

  // Umgekehrt anzeigen (höchster Gewinn oben)
  [...CONFIG.MONEY_LEVELS].reverse().forEach((amount, index) => {
    const levelIndex = CONFIG.MONEY_LEVELS.length - 1 - index;
    const isMilestone = CONFIG.MILESTONES.includes(levelIndex);

    const level = document.createElement('div');
    level.className = `money-tree-level ${isMilestone ? 'milestone' : ''}`;
    level.dataset.level = levelIndex;
    level.innerHTML = `
      <span class="level-number">${levelIndex + 1}.</span>
      <span class="level-amount">${formatCurrency(amount)}</span>
    `;
    container.appendChild(level);
  });
}

function updateMoneyTree() {
  const levels = document.querySelectorAll('.money-tree-level');
  levels.forEach((level, i) => {
    const levelIndex = parseInt(level.dataset.level);
    level.classList.remove('active', 'correct', 'current');

    if (levelIndex < state.currentQuestionIndex) {
      level.classList.add('correct');
    } else if (levelIndex === state.currentQuestionIndex) {
      level.classList.add('current', 'active');
    } else if (levelIndex === state.currentQuestionIndex - 1 && state.gameStatus !== 'playing') {
      level.classList.add('active');
    }
  });
}

function formatCurrency(amount) {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1).replace('.', ',') + ' Mio €';
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1).replace('.', ',') + ' Tsd €';
  }
  return amount + ' €';
}

// ========================================
// GAME FLOW
// ========================================

function startNewGame() {
  state.currentQuestionIndex = 0;
  state.usedLifelines = { fifty: false, phone: false, audience: false };
  state.lifelineResults = { fifty: null, phone: null, audience: null };
  state.guaranteedWinnings = 0;
  state.gameStatus = 'playing';
  state.isAnimating = false;

  // Fragen für dieses Spiel auswählen
  const gameQuestions = getRandomQuestions(CONFIG.QUESTIONS_PER_GAME);
  if (gameQuestions.length < CONFIG.QUESTIONS_PER_GAME) {
    showModal('Nicht genug Fragen', `Es sind nur ${gameQuestions.length} Fragen verfügbar. Bitte fügen Sie mehr Fragen im Editor hinzu.`, [{ text: 'OK', primary: true, action: () => hideModal() }]);
    return;
  }

  // Fragen in den State kopieren
  state.gameQuestions = gameQuestions;

  resetLifelineButtons();
  updateMoneyTree();
  loadQuestion(0);
}

function loadQuestion(index) {
  if (index >= state.gameQuestions.length) {
    endGame(true);
    return;
  }

  state.currentQuestionIndex = index;
  state.currentQuestion = state.gameQuestions[index];
  state.selectedAnswer = null;
  state.isAnimating = false;

  // UI aktualisieren
  els.questionNumber.textContent = index + 1;
  els.questionText.textContent = state.currentQuestion.question;
  // FIX: els.questionValue IST bereits das .value-amount Element
  els.questionValue.textContent = formatCurrency(CONFIG.MONEY_LEVELS[index]);

  // Antworten rendern
  renderAnswers();

  // Buttons aktualisieren
  els.confirmBtn.disabled = true;
  els.confirmBtn.querySelector('.btn-text').textContent = 'ANTWORT BESTÄTIGEN';

  updateMoneyTree();

  // Frage-Reveal Animation
  els.questionText.style.animation = 'none';
  els.questionText.offsetHeight; // Force reflow
  els.questionText.style.animation = 'questionReveal 0.6s var(--transition-bounce)';
}

function renderAnswers() {
  els.answersGrid.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  state.currentQuestion.answers.forEach((answer, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.dataset.index = i;
    btn.setAttribute('role', 'listitem');
    btn.innerHTML = `
      <span class="answer-letter">${letters[i]}</span>
      <span class="answer-text">${answer}</span>
    `;
    btn.addEventListener('click', () => selectAnswer(i, btn));
    els.answersGrid.appendChild(btn);
  });
}

function selectAnswer(index, button) {
  if (state.isAnimating || state.gameStatus !== 'playing') return;

  // Alle Buttons deselektieren
  document.querySelectorAll('.answer-btn').forEach(btn => {
    btn.classList.remove('selected');
  });

  // Ausgewählten Button markieren
  button.classList.add('selected');
  state.selectedAnswer = index;

  // Bestätigen-Button aktivieren
  els.confirmBtn.disabled = false;
  els.confirmBtn.querySelector('.btn-text').textContent = 'JETZT BESTÄTIGEN';
}

async function confirmAnswer() {
  if (state.selectedAnswer === null || state.isAnimating) return;

  state.isAnimating = true;
  els.confirmBtn.disabled = true;

  const correctIndex = state.currentQuestion.correct;
  const isCorrect = state.selectedAnswer === correctIndex;

  // Alle Buttons deaktivieren
  document.querySelectorAll('.answer-btn').forEach(btn => {
    btn.disabled = true;
  });

  if (isCorrect) {
    await handleCorrectAnswer(correctIndex);
  } else {
    await handleWrongAnswer(state.selectedAnswer, correctIndex);
  }
}

async function handleCorrectAnswer(correctIndex) {
  // Richtige Antwort grün markieren
  const correctBtn = els.answersGrid.children[correctIndex];
  correctBtn.classList.add('correct');

  // Kurze Pause für Animation
  await sleep(1000);

  // Prüfen ob Meilenstein erreicht
  if (CONFIG.MILESTONES.includes(state.currentQuestionIndex)) {
    state.guaranteedWinnings = CONFIG.MONEY_LEVELS[state.currentQuestionIndex];
    showMilestoneModal();
    return;
  }

  // Prüfen ob gewonnen (letzte Frage richtig)
  if (state.currentQuestionIndex === CONFIG.QUESTIONS_PER_GAME - 1) {
    await sleep(500);
    endGame(true);
    return;
  }

  // Nächste Frage
  loadQuestion(state.currentQuestionIndex + 1);
}

async function handleWrongAnswer(selectedIndex, correctIndex) {
  // Falsche Antwort rot, richtige grün
  const wrongBtn = els.answersGrid.children[selectedIndex];
  const correctBtn = els.answersGrid.children[correctIndex];

  wrongBtn.classList.add('wrong');
  await sleep(500);
  correctBtn.classList.add('correct');

  await sleep(1500);
  endGame(false);
}

function showMilestoneModal() {
  const amount = formatCurrency(state.guaranteedWinnings);
  const messages = [
    `Herzlichen Glückwunsch! Sie haben die ${amount}-Hürde genommen!`,
    `Das sind ${amount} - sicher! Egal wie es weitergeht, das Geld ist Ihres.`,
    `Ein wichtiger Meilenstein! Sie können jetzt nicht mehr unter ${amount} fallen.`
  ];

  const message = messages[Math.floor(Math.random() * messages.length)];

  showModal(
    'MEILENSTEIN ERREICHT!',
    message,
    [
      { text: 'WEITERSPIELEN', primary: true, action: () => {
          hideModal();
          loadQuestion(state.currentQuestionIndex + 1);
        }
      },
      { text: 'AUSSTEIGEN', primary: false, action: () => {
          hideModal();
          walkAway();
        }
      }
    ]
  );
}

function walkAway() {
  if (state.gameStatus !== 'playing') return;
  const wonAmount = state.currentQuestionIndex > 0 ? CONFIG.MONEY_LEVELS[state.currentQuestionIndex - 1] : 0;
  const finalAmount = Math.max(wonAmount, state.guaranteedWinnings);
  endGame(true, finalAmount, true);
}

function endGame(won, finalAmount = null, walked = false) {
  state.gameStatus = won ? 'won' : 'lost';

  const amount = finalAmount !== null ? finalAmount :
    (won ? CONFIG.MONEY_LEVELS[CONFIG.QUESTIONS_PER_GAME - 1] : state.guaranteedWinnings);

  const isMillionaire = won && state.currentQuestionIndex === CONFIG.QUESTIONS_PER_GAME - 1;

  let title, body;

  if (isMillionaire) {
    title = '🎉 SIE SIND MILLIONÄR! 🎉';
    body = `
      <div class="win-icon">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      </div>
      <h3 class="end-title">${formatCurrency(CONFIG.MONEY_LEVELS[CONFIG.MONEY_LEVELS.length - 1])}</h3>
      <p class="end-subtitle">Sie haben alle 15 Fragen richtig beantwortet!</p>
      <div class="end-stats">
        <div class="stat">
          <span class="stat-value">${formatCurrency(amount)}</span>
          <span class="stat-label">Gewinn</span>
        </div>
        <div class="stat">
          <span class="stat-value">15/15</span>
          <span class="stat-label">Fragen</span>
        </div>
      </div>
    `;
  } else if (won) {
    title = walked ? 'AUSGESTIEGEN' : 'GEWONNEN!';
    body = `
      <h3 class="end-title">${formatCurrency(amount)}</h3>
      <p class="end-subtitle">${walked ? 'Sie haben sich entschieden, mit dem Gewinn auszusteigen.' : 'Spiel beendet.'}</p>
      <div class="end-stats">
        <div class="stat">
          <span class="stat-value">${formatCurrency(amount)}</span>
          <span class="stat-label">Ihr Gewinn</span>
        </div>
        <div class="stat">
          <span class="stat-value">${state.currentQuestionIndex}/${CONFIG.QUESTIONS_PER_GAME}</span>
          <span class="stat-label">Fragen</span>
        </div>
        <div class="stat">
          <span class="stat-value">${formatCurrency(state.guaranteedWinnings)}</span>
          <span class="stat-label">Sicherer Betrag</span>
        </div>
      </div>
    `;
  } else {
    title = '😔 LEIDER FALSCH';
    body = `
      <h3 class="end-title" style="color: var(--wrong-red);">${formatCurrency(amount)}</h3>
      <p class="end-subtitle">Die richtige Antwort wäre gewesen: <strong>${state.currentQuestion.answers[state.currentQuestion.correct]}</strong></p>
      <div class="end-stats">
        <div class="stat">
          <span class="stat-value">${formatCurrency(amount)}</span>
          <span class="stat-label">Ihr Gewinn</span>
        </div>
        <div class="stat">
          <span class="stat-value">${state.currentQuestionIndex}/${CONFIG.QUESTIONS_PER_GAME}</span>
          <span class="stat-label">Erreichte Frage</span>
        </div>
        <div class="stat">
          <span class="stat-value">${formatCurrency(state.guaranteedWinnings)}</span>
          <span class="stat-label">Sicherer Betrag</span>
        </div>
      </div>
    `;
  }

  els.endModalTitle.textContent = title;
  els.endModalBody.innerHTML = body;
  showEndModal();
}

// ========================================
// LIFELINES (JOKER)
// ========================================

function resetLifelineButtons() {
  CONFIG.LIFELINES.forEach(lifeline => {
    const btn = document.getElementById(`lifeline${capitalize(lifeline)}`);
    if (btn) {
      btn.disabled = false;
      btn.setAttribute('aria-pressed', 'false');
    }
  });
  state.usedLifelines = { fifty: false, phone: false, audience: false };
  state.lifelineResults = { fifty: null, phone: null, audience: null };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function useLifeline(lifeline) {
  if (state.usedLifelines[lifeline] || state.isAnimating || state.gameStatus !== 'playing') return;

  state.usedLifelines[lifeline] = true;
  const btn = document.getElementById(`lifeline${capitalize(lifeline)}`);
  btn.disabled = true;
  btn.setAttribute('aria-pressed', 'true');

  switch (lifeline) {
    case 'fifty':
      await useFiftyFifty();
      break;
    case 'phone':
      await usePhoneJoker();
      break;
    case 'audience':
      await useAudienceJoker();
      break;
  }
}

async function useFiftyFifty() {
  const correctIndex = state.currentQuestion.correct;
  const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIndex);
  const toEliminate = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);

  // Animation: Buttons ausgehen lassen
  toEliminate.forEach((index, i) => {
    setTimeout(() => {
      const btn = els.answersGrid.children[index];
      btn.classList.add('eliminated');
      btn.disabled = true;
    }, i * 300);
  });

  state.lifelineResults.fifty = { eliminated: toEliminate };
  await sleep(800);
}

async function usePhoneJoker() {
  showPhoneModal();

  // Simuliere Wartezeit
  await sleep(2000 + Math.random() * 2000);

  const correctIndex = state.currentQuestion.correct;
  const isHelpful = Math.random() < 0.75; // 75% Chance auf hilfreichen Tipp

  let advice, confidence;

  if (isHelpful) {
    // Experte kennt die richtige Antwort (mit leichter Unsicherheit)
    const certainty = 70 + Math.random() * 25; // 70-95%
    advice = `Ich bin zu ${Math.round(certainty)}% sicher: Es ist Antwort ${String.fromCharCode(65 + correctIndex)} - "${state.currentQuestion.answers[correctIndex]}".`;
    confidence = `Experte: ${Math.round(certainty)}% sicher`;
  } else {
    // Experte tippt falsch
    const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIndex);
    const wrongGuess = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
    const certainty = 50 + Math.random() * 30; // 50-80%
    advice = `Hmm, ich denke es könnte Antwort ${String.fromCharCode(65 + wrongGuess)} sein - "${state.currentQuestion.answers[wrongGuess]}". Aber ich bin mir nicht ganz sicher...`;
    confidence = `Experte: ${Math.round(certainty)}% sicher (aber falsch)`;
  }

  document.getElementById('phoneText').hidden = true;
  document.getElementById('phoneResult').hidden = false;
  document.getElementById('phoneAdvice').textContent = advice;
  document.getElementById('phoneConfidence').textContent = confidence;
  document.getElementById('closePhoneModal').hidden = false;

  state.lifelineResults.phone = { advice, confidence, correct: isHelpful };
}

async function useAudienceJoker() {
  showAudienceModal();

  const correctIndex = state.currentQuestion.correct;
  // Publikum stimmt meist richtig, aber nicht immer
  const distribution = generateAudienceDistribution(correctIndex);

  await sleep(500);
  animateAudienceBars(distribution);

  state.lifelineResults.audience = { distribution };
}

function generateAudienceDistribution(correctIndex) {
  // Basis-Verteilung: Publikum tendiert zur richtigen Antwort
  const baseCorrect = 45 + Math.random() * 35; // 45-80%
  const remaining = 100 - baseCorrect;
  const others = [0, 1, 2, 3].filter(i => i !== correctIndex);

  // Manchmal ist das Publikum falsch (bei schweren Fragen)
  const isMisled = Math.random() < 0.15; // 15% Chance

  let distribution = {};
  if (isMisled) {
    // Publikum tippt auf eine falsche Antwort
    const wrongLead = others[Math.floor(Math.random() * others.length)];
    const leadPercent = 35 + Math.random() * 25; // 35-60%
    distribution[wrongLead] = leadPercent;
    distribution[correctIndex] = 15 + Math.random() * 20; // 15-35%
    const remaining2 = 100 - distribution[wrongLead] - distribution[correctIndex];
    const otherTwo = others.filter(i => i !== wrongLead);
    distribution[otherTwo[0]] = remaining2 * (0.3 + Math.random() * 0.4);
    distribution[otherTwo[1]] = remaining2 - distribution[otherTwo[0]];
  } else {
    // Publikum tendiert zur richtigen Antwort
    distribution[correctIndex] = baseCorrect;
    others.forEach((idx, i) => {
      if (i === others.length - 1) {
        distribution[idx] = 100 - Object.values(distribution).reduce((a, b) => a + b, 0);
      } else {
        const max = (remaining - Object.values(distribution).reduce((a, b) => a + b, 0)) * 0.7;
        distribution[idx] = Math.random() * max;
      }
    });
  }

  // Auf ganze Zahlen runden und sicherstellen, dass Summe 100 ist
  const keys = Object.keys(distribution);
  let sum = 0;
  keys.forEach(k => { sum += Math.round(distribution[k]); });
  const diff = 100 - sum;
  if (diff !== 0) {
    distribution[correctIndex] = Math.round(distribution[correctIndex]) + diff;
  }
  keys.forEach(k => { distribution[k] = Math.round(distribution[k]); });

  return distribution;
}

function animateAudienceBars(distribution) {
  const letters = ['A', 'B', 'C', 'D'];
  const container = els.audienceChart;
  container.innerHTML = '';

  letters.forEach((letter, i) => {
    const percent = distribution[i] || 0;
    const isCorrect = i === state.currentQuestion.correct;

    const wrapper = document.createElement('div');
    wrapper.className = 'audience-bar-container';
    wrapper.innerHTML = `
      <div class="audience-bar-wrapper">
        <div class="audience-bar ${isCorrect ? 'correct' : ''}" data-percent="${percent}%" style="height: 0%"></div>
      </div>
      <span class="audience-label">${letter}</span>
    `;
    container.appendChild(wrapper);
  });

  // Animieren
  requestAnimationFrame(() => {
    container.querySelectorAll('.audience-bar').forEach(bar => {
      const targetHeight = parseInt(bar.dataset.percent);
      bar.style.height = `${targetHeight}%`;
    });
  });
}

// ========================================
// MODAL MANAGEMENT
// ========================================

function showModal(title, body, buttons = []) {
  els.modalTitle.textContent = title;
  els.modalBody.innerHTML = body;
  els.modalFooter.innerHTML = '';

  buttons.forEach(({ text, primary, action }) => {
    const btn = document.createElement('button');
    btn.className = `action-btn ${primary ? 'primary' : 'secondary'}`;
    btn.textContent = text;
    btn.addEventListener('click', () => {
      hideModal();
      if (action) action();
    });
    els.modalFooter.appendChild(btn);
  });

  els.modalOverlay.hidden = false;
  els.modalClose.focus();
}

function hideModal() {
  els.modalOverlay.hidden = true;
}

function showAudienceModal() {
  els.audienceModalOverlay.hidden = false;
}

function hideAudienceModal() {
  els.audienceModalOverlay.hidden = true;
}

function showPhoneModal() {
  document.getElementById('phoneText').hidden = false;
  document.getElementById('phoneResult').hidden = true;
  document.getElementById('closePhoneModal').hidden = true;
  els.phoneModalOverlay.hidden = false;
}

function hidePhoneModal() {
  els.phoneModalOverlay.hidden = true;
}

function showEndModal() {
  els.endModalOverlay.hidden = false;
  els.restartBtn.focus();
}

function hideEndModal() {
  els.endModalOverlay.hidden = true;
}

function showEditorModal(tab = 'json') {
  // JSON Editor befüllen
  els.jsonEditor.value = JSON.stringify({ questions: state.questions }, null, 2);

  // Visual Editor rendern
  renderVisualEditor();

  // Tab aktivieren
  switchEditorTab(tab);

  els.editorModalOverlay.hidden = false;
}

function hideEditorModal() {
  els.editorModalOverlay.hidden = true;
}

function switchEditorTab(tab) {
  els.editorTabs.forEach(t => {
    const isActive = t.dataset.tab === tab;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive);
  });
  els.editorPanels.forEach(p => {
    p.hidden = p.id !== `${tab}Panel`;
  });
}

function renderVisualEditor() {
  const container = els.visualEditor;
  container.innerHTML = '';

  state.questions.forEach((q, index) => {
    const div = document.createElement('div');
    div.className = 'visual-question';
    div.innerHTML = `
      <div class="visual-question-header">
        <span class="visual-question-num">Frage ${index + 1}</span>
        <button class="visual-question-delete" data-index="${index}" aria-label="Frage ${index + 1} löschen">&times;</button>
      </div>
      <div class="visual-question-fields">
        <div class="visual-field">
          <label>Kategorie</label>
          <input type="text" data-field="category" value="${escapeHtml(q.category || 'Allgemein')}" placeholder="Kategorie">
        </div>
        <div class="visual-field">
          <label>Frage</label>
          <input type="text" data-field="question" value="${escapeHtml(q.question)}" placeholder="Frage text">
        </div>
        <div class="visual-field">
          <label>Antworten (Richtige markieren)</label>
          <div class="answers-list" data-answers>
            ${q.answers.map((a, i) => `
              <div class="answer-row">
                <input type="text" data-field="answers" data-index="${i}" value="${escapeHtml(a)}" placeholder="Antwort ${String.fromCharCode(65 + i)}">
                <button type="button" class="correct-toggle ${i === q.correct ? 'active' : ''}" data-correct="${i}" aria-pressed="${i === q.correct}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Richtig</span>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    container.appendChild(div);
  });

  // Event Listener für visual editor
  container.querySelectorAll('.visual-question-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      deleteQuestion(index);
    });
  });

  container.querySelectorAll('.correct-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const questionEl = btn.closest('.visual-question');
      const qIndex = parseInt(questionEl.querySelector('.visual-question-delete').dataset.index);
      const aIndex = parseInt(btn.dataset.correct);
      setCorrectAnswer(qIndex, aIndex);
    });
  });

  container.querySelectorAll('input[data-field]').forEach(input => {
    input.addEventListener('change', () => {
      const questionEl = input.closest('.visual-question');
      const qIndex = parseInt(questionEl.querySelector('.visual-question-delete').dataset.index);
      const field = input.dataset.field;
      const aIndex = input.dataset.index !== undefined ? parseInt(input.dataset.index) : null;
      updateQuestionField(qIndex, field, input.value, aIndex);
    });
  });
}

// ========================================
// QUESTION EDITOR FUNCTIONS
// ========================================

function deleteQuestion(index) {
  if (state.questions.length <= 1) {
    showModal('Nicht möglich', 'Sie müssen mindestens eine Frage behalten.', [{ text: 'OK', primary: true, action: hideModal }]);
    return;
  }
  state.questions.splice(index, 1);
  saveQuestions();
  renderVisualEditor();
  els.jsonEditor.value = JSON.stringify({ questions: state.questions }, null, 2);
}

function setCorrectAnswer(qIndex, aIndex) {
  state.questions[qIndex].correct = aIndex;
  // UI aktualisieren
  const questionEl = els.visualEditor.children[qIndex];
  questionEl.querySelectorAll('.correct-toggle').forEach((btn, i) => {
    btn.classList.toggle('active', i === aIndex);
    btn.setAttribute('aria-pressed', i === aIndex);
  });
  questionEl.querySelectorAll('input[data-field="answers"]').forEach((input, i) => {
    input.classList.toggle('correct-answer', i === aIndex);
  });
}

function updateQuestionField(qIndex, field, value, aIndex) {
  if (aIndex !== null) {
    state.questions[qIndex].answers[aIndex] = value;
  } else {
    state.questions[qIndex][field] = value;
  }
  // JSON Editor synchron halten
  els.jsonEditor.value = JSON.stringify({ questions: state.questions }, null, 2);
}

function addQuestion() {
  const newQuestion = {
    question: 'Neue Frage',
    answers: ['Antwort A', 'Antwort B', 'Antwort C', 'Antwort D'],
    correct: 0,
    category: 'Allgemein'
  };
  state.questions.push(newQuestion);
  renderVisualEditor();
  els.jsonEditor.value = JSON.stringify({ questions: state.questions }, null, 2);
}

function validateJsonInput() {
  try {
    const value = els.jsonEditor.value;
    const data = JSON.parse(value);
    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error('Format: { "questions": [...] }');
    }
    const valid = validateQuestions(data.questions);
    if (valid.length === 0) {
      throw new Error('Keine gültigen Fragen gefunden');
    }
    if (valid.length < data.questions.length) {
      showModal('Warnung', `${data.questions.length - valid.length} ungültige Fragen wurden entfernt.`, [{ text: 'OK', primary: true, action: hideModal }]);
    }
    return valid;
  } catch (e) {
    showModal('JSON Fehler', `Ungültiges JSON: ${e.message}`, [{ text: 'OK', primary: true, action: hideModal }]);
    return null;
  }
}

function saveQuestionsFromEditor() {
  const valid = validateJsonInput();
  if (!valid) return;

  state.questions = valid;
  saveQuestions();
  hideEditorModal();
  showModal('Gespeichert!', `Die ${valid.length} Fragen wurden gespeichert und stehen für das nächste Spiel bereit.`, [{ text: 'OK', primary: true, action: hideModal }]);
}

// ========================================
// EVENT BINDING
// ========================================

function bindEvents() {
  // Confirm Button
  els.confirmBtn.addEventListener('click', confirmAnswer);

  // Walk Away Button
  els.walkAwayBtn.addEventListener('click', () => {
    if (state.gameStatus === 'playing') {
      showModal('Aussteigen?', `Sind Sie sicher? Sie nehmen ${formatCurrency(Math.max(
        state.currentQuestionIndex > 0 ? CONFIG.MONEY_LEVELS[state.currentQuestionIndex - 1] : 0,
        state.guaranteedWinnings
      ))} mit nach Hause.`,
      [
        { text: 'JA, AUSSTEIGEN', primary: false, action: walkAway },
        { text: 'WEITERSPIELEN', primary: true, action: hideModal }
      ]);
    }
  });

  // Lifelines
  els.lifeline50.addEventListener('click', () => useLifeline('fifty'));
  els.lifelinePhone.addEventListener('click', () => useLifeline('phone'));
  els.lifelineAudience.addEventListener('click', () => useLifeline('audience'));

  // Modal Close Buttons
  els.modalClose.addEventListener('click', hideModal);
  els.modalOverlay.addEventListener('click', (e) => { if (e.target === els.modalOverlay) hideModal(); });

  els.closeAudienceModal.addEventListener('click', hideAudienceModal);
  els.audienceModalOverlay.addEventListener('click', (e) => { if (e.target === els.audienceModalOverlay) hideAudienceModal(); });

  els.closePhoneModal.addEventListener('click', hidePhoneModal);
  els.phoneModalOverlay.addEventListener('click', (e) => { if (e.target === els.phoneModalOverlay) hidePhoneModal(); });

  // End Modal
  els.restartBtn.addEventListener('click', () => {
    hideEndModal();
    startNewGame();
  });
  els.editQuestionsBtn.addEventListener('click', () => {
    hideEndModal();
    showEditorModal();
  });
  els.endModalOverlay.addEventListener('click', (e) => { if (e.target === els.endModalOverlay) hideEndModal(); });

  // Editor Modal
  els.editorClose.addEventListener('click', hideEditorModal);
  els.editorModalOverlay.addEventListener('click', (e) => { if (e.target === els.editorModalOverlay) hideEditorModal(); });

  els.editorTabs.forEach(tab => {
    tab.addEventListener('click', () => switchEditorTab(tab.dataset.tab));
  });

  els.validateJson.addEventListener('click', () => {
    const valid = validateJsonInput();
    if (valid) {
      showModal('Validierung erfolgreich', `JSON ist gültig. ${valid.length} Fragen gefunden.`, [{ text: 'OK', primary: true, action: hideModal }]);
    }
  });

  els.saveJson.addEventListener('click', saveQuestionsFromEditor);
  els.addQuestion.addEventListener('click', addQuestion);
  els.saveVisual.addEventListener('click', saveQuestionsFromEditor);

  // Keyboard Shortcuts
  document.addEventListener('keydown', handleKeydown);

  // Touch Support für Answer Buttons
  els.answersGrid.addEventListener('touchstart', (e) => {
    const btn = e.target.closest('.answer-btn');
    if (btn && !btn.disabled && !state.isAnimating) {
      btn.classList.add('touch-active');
    }
  }, { passive: true });

  els.answersGrid.addEventListener('touchend', (e) => {
    const btn = e.target.closest('.answer-btn');
    if (btn) btn.classList.remove('touch-active');
  });
}

function handleKeydown(e) {
  if (state.gameStatus !== 'playing' || state.isAnimating) return;

  // Zahlen 1-4 für Antworten
  if (e.key >= '1' && e.key <= '4') {
    const index = parseInt(e.key) - 1;
    const btn = els.answersGrid.children[index];
    if (btn && !btn.disabled && !btn.classList.contains('eliminated')) {
      selectAnswer(index, btn);
    }
  }

  // Enter für Bestätigen
  if (e.key === 'Enter' && !els.confirmBtn.disabled) {
    confirmAnswer();
  }

  // Escape für Modals schließen
  if (e.key === 'Escape') {
    if (!els.modalOverlay.hidden) hideModal();
    else if (!els.audienceModalOverlay.hidden) hideAudienceModal();
    else if (!els.phoneModalOverlay.hidden) hidePhoneModal();
    else if (!els.endModalOverlay.hidden) hideEndModal();
    else if (!els.editorModalOverlay.hidden) hideEditorModal();
  }

  // Joker Tasten: F, T, P
  if (e.key === 'f' || e.key === 'F') useLifeline('fifty');
  if (e.key === 't' || e.key === 'T') useLifeline('phone');
  if (e.key === 'p' || e.key === 'P') useLifeline('audience');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatCurrency(amount) {
  const symbol = CONFIG.CURRENCY_SYMBOL || '€';
  const position = CONFIG.CURRENCY_POSITION || 'after';
  const thousandsSep = CONFIG.THOUSANDS_SEPARATOR || '.';
  const decimalSep = CONFIG.DECIMAL_SEPARATOR || ',';

  // Voll ausgeschrieben mit Tausendertrennzeichen
  let formatted = amount.toString();

  // Tausendertrennzeichen hinzufügen
  const parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
  formatted = parts.join(decimalSep);

  return position === 'before' ? `${symbol} ${formatted}` : `${formatted} ${symbol}`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========================================
// EXPORT FOR GLOBAL ACCESS (Debugging)
// ========================================

window.WWM = {
  state,
  CONFIG,
  startNewGame,
  showEditorModal,
  saveQuestions,
  loadQuestions,
  DEFAULT_QUESTIONS
};

// ========================================
// START
// ========================================

document.addEventListener('DOMContentLoaded', init);

// Service Worker Registration für Offline-Support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW optional, ignorieren falls nicht vorhanden
    });
  });
}
