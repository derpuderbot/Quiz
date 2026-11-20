# 🎮 Wer wird Millionär? – Quiz für GitHub Pages

Eine vollständige, anpassbare „Wer wird Millionär?“-Quiz-Implementation als statische Webseite für GitHub Pages. Keine Build-Schritte, keine Abhängigkeiten – einfach hochladen und spielen.

## ✨ Features

- **Authentisches WWM-Erlebnis**: Original-Geldstufen, 3 Joker (50:50, Telefonjoker, Publikumsjoker), Meilensteine
- **Vollständig anpassbare Fragen**: Über JSON-Datei oder integrierten visuellen Editor
- **GitHub Pages bereit**: Pure HTML/CSS/JS – keine Build-Tools nötig
- **Responsive Design**: Funktioniert auf Desktop, Tablet und Mobile
- **Barrierefrei**: ARIA-Labels, Tastaturnavigation, Reduced-Motion-Support
- **Offline-fähig**: Service Worker für Caching (optional)
- **Lokaler Speicher**: Fragen und Einstellungen bleiben im Browser erhalten

## 🚀 Schnellstart (GitHub Pages)

### Option 1: Repository erstellen & deployen (Empfohlen)

1. **Neues Repository auf GitHub erstellen**
   - Name: z. B. `wwm-quiz` (öffentlich oder privat)
   - Keine README, .gitignore oder License nötig

2. **Dateien hochladen**
   ```bash
   git clone https://github.com/DEIN-USERNAME/wwm-quiz.git
   cd wwm-quiz
   # Alle Dateien aus diesem Ordner hineinkopieren:
   # index.html, styles.css, script.js, questions.json, README.md
   git add .
   git commit -m "Initial commit: WWM Quiz"
   git push origin main
   ```

3. **GitHub Pages aktivieren**
   - Repository → **Settings** → **Pages** (linke Sidebar)
   - Source: **Deploy from a branch**
   - Branch: **main** / **root** (oder `/docs` falls du einen Unterordner nutzt)
   - **Save** klicken

4. **Warten & Aufrufen**
   - Nach 1–2 Minuten ist die Seite live unter:
   - `https://DEIN-USERNAME.github.io/wwm-quiz/`

### Option 2: GitHub Web-Upload (ohne Git)

1. Repository auf GitHub erstellen
2. **Add file** → **Upload files** → Alle 5 Dateien ziehen
3. Committen
4. Pages aktivieren (wie oben)

### Option 3: Fork dieses Template

Falls du dieses Repo als Template nutzt: **Use this template** → Eigenes Repo erstellen → Pages aktivieren.

## 📝 Fragen anpassen

### Methode A: JSON-Datei direkt bearbeiten (einfach)

Die Datei `questions.json` enthält alle Fragen. Format:

```json
{
  "questions": [
    {
      "question": "Deine Frage hier?",
      "answers": ["Antwort A", "Antwort B", "Antwort C", "Antwort D"],
      "correct": 0,  // 0=A, 1=B, 2=C, 3=D
      "category": "Kategorie-Name"
    }
  ]
}
```

**Wichtig:**
- Mindestens 15 Fragen für ein vollständiges Spiel
- `correct` ist 0-basiert (0 = erste Antwort)
- Alle 4 Antworten müssen vorhanden sein
- Nach Änderung: Committen & pushen → Seite aktualisiert sich automatisch

### Methode B: Integrierter Editor (im Browser)

1. Quiz starten → Am Ende auf **„FRAGEN BEARBEITEN“** klicken
2. Oder direkt: `?editor=1` an die URL hängen
3. Zwei Modi:
   - **JSON Import/Export**: Rohes JSON bearbeiten, validieren, speichern
   - **Visueller Editor**: Fragen per Formular hinzufügen/bearbeiten/löschen
4. Änderungen werden im `localStorage` des Browsers gespeichert
5. Zum dauerhaften Speichern: JSON exportieren & in `questions.json` committen

### Beispiel-Fragen-Struktur

```json
{
  "question": "Wie heißt der höchste Berg der Welt?",
  "answers": ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
  "correct": 1,
  "category": "Geografie"
}
```

Kategorien sind frei wählbar (Geografie, Geschichte, Sport, Wissenschaft, Popkultur, …).

## ⌨️ Tastatursteuerung

| Taste | Aktion |
|-------|--------|
| `1`–`4` | Antwort A–D auswählen |
| `Enter` | Antwort bestätigen |
| `F` | Joker 50:50 |
| `T` | Telefonjoker |
| `P` | Publikumsjoker |
| `Esc` | Modals schließen |

## 🎨 Anpassung (Design & Logik)

### Farben anpassen (CSS Custom Properties)

In `styles.css` ganz oben die `:root` Variablen ändern:

```css
:root {
  --bg-deep: #030712;        /* Hintergrund */
  --gold-bright: #FFD700;    /* Hauptgold */
  --gold-medium: #FFA500;    /* Mittleres Gold */
  --gold-dark: #FF8C00;      /* Dunkles Gold */
  --blue-neon: #00BFFF;      /* Akzentblau (Auswahl) */
  --correct-green: #00FF7F;  /* Richtig-Grün */
  --wrong-red: #FF3366;      /* Falsch-Rot */
  /* ... weitere Variablen ... */
}
```

### Geldstufen ändern

In `script.js` im `CONFIG` Objekt:

```javascript
const CONFIG = {
  MONEY_LEVELS: [
    100, 200, 300, 500, 1000,  // Eigene Stufen
    2000, 4000, 8000, 16000, 32000,
    64000, 125000, 250000, 500000, 1000000
  ],
  MILESTONES: [4, 9, 14],  // Indizes (0-basiert) für sichere Stufen
  QUESTIONS_PER_GAME: 15,
  // ...
};
```

### Schriftarten ändern

In `index.html` die Google Fonts Imports anpassen, in `styles.css` die Variablen:

```css
--font-display: 'Deine Display Font', sans-serif;
--font-ui: 'Deine UI Font', sans-serif;
```

## 📁 Projektstruktur

```
wwm-quiz/
├── index.html        # Haupt-HTML (Semantic HTML5, ARIA)
├── styles.css        # Vollständiges Styling (Custom Properties, Animations)
├── script.js         # Game Logic (ES Modules, State Management)
├── questions.json    # Fragen-Datenbank (bearbeitbar)
├── README.md         # Diese Datei
└── sw.js             # (Optional) Service Worker für Offline
```

## 🔧 Technische Details

- **Keine Build-Schritte**: Vanilla ES6+ JavaScript, native CSS Custom Properties
- **Browser-Support**: Chrome 60+, Firefox 55+, Safari 11+, Edge 79+
- **Module**: `script.js` nutzt `<script type="module">` → lokaler Server oder HTTPS nötig (GitHub Pages ✓)
- **Storage**: Fragen & Settings im `localStorage` (pro Browser/Gerät)
- **Performance**: ~50 KB gzipped, keine externen Abhängigkeiten außer Google Fonts

## 🌐 Deployment-Alternativen

| Plattform | Anleitung |
|-----------|-----------|
| **Netlify** | `netlify deploy --dir .` oder Drag & Drop im Dashboard |
| **Vercel** | `vercel` im Ordner oder GitHub Import |
| **Cloudflare Pages** | GitHub Repo verbinden, Build: `none`, Output: `/` |
| **Firebase Hosting** | `firebase init hosting` → public: `.` |
| **Surge.sh** | `surge .` |
| **Lokal testen** | `npx serve .` oder `python -m http.server 8000` |

## 🐛 Troubleshooting

| Problem | Lösung |
|---------|--------|
| Weiße Seite / JS Fehler | Browser-Konsole prüfen (F12). Meist: `questions.json` ungültiges JSON |
| Fragen laden nicht | `questions.json` muss im selben Ordner wie `index.html` liegen |
| Schriftarten laden nicht | CSP blockiert Google Fonts? In `index.html` `fonts.googleapis.com` erlauben |
| Service Worker Fehler | `sw.js` ist optional – einfach löschen falls Probleme |
| Mobile: Buttons zu klein | CSS `--space-*` Variablen für Touch-Targets erhöhen |

## 📄 Lizenz

MIT License – frei nutzbar, veränderbar, teilbar. Attribution erwünscht aber nicht Pflicht.

## 🤝 Beitragen

PRs willkommen! Ideen:
- Sound-Effekte (Buzzer, Applaus, Herzschlag)
- Highscore-Liste (localStorage)
- Mehr Joker (Zusatzjoker, Wechseln)
- Mehrspieler-Modus (Hotseat)
- Frage-Import aus CSV/Excel
- Dunkel/Licht-Modus Toggle

## 🙏 Credits

- Inspiration: „Wer wird Millionär?“ (RTL / EndemolShine)
- Fonts: [Orbitron](https://fonts.google.com/specimen/Orbitron) & [Rajdhani](https://fonts.google.com/specimen/Rajdhani) via Google Fonts
- Icons: Inline SVGs (keine externen Icon-Fonts)

---

**Viel Spaß beim Quizzen!** 🎉

*Fragen? Issues auf GitHub eröffnen oder die `script.js` anpassen – der Code ist modular und kommentiert.*