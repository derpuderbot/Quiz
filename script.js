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
  { "question": "Wer war der erste Bundeskanzler der BRD?", "answers": ["Ludwig Erhard", "Konrad Adenauer", "Kurt Georg Kiesinger", "Willy Brandt"], "correct": 1, "category": "Geschichte" },
  { "question": "Wie viele Bundesländer hat Deutschland?", "answers": ["14", "15", "16", "17"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Was ist die Hauptstadt von Australien?", "answers": ["Sydney", "Melbourne", "Canberra", "Perth"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welches chemische Symbol hat Gold?", "answers": ["Ag", "Au", "Fe", "Cu"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "In welchem Jahr fiel die Berliner Mauer?", "answers": ["1987", "1988", "1989", "1990"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welcher Planet ist der größte unseres Sonnensystems?", "answers": ["Saturn", "Jupiter", "Neptun", "Uranus"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wie viele Kontinente gibt es nach der üblichen Sieben-Kontinente-Einteilung?", "answers": ["5", "6", "7", "8"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Wer schrieb Faust?", "answers": ["Friedrich Schiller", "Johann Wolfgang von Goethe", "Heinrich Heine", "Thomas Mann"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Welches Tier ist das größte Landsäugetier?", "answers": ["Nashorn", "Giraffe", "Afrikanischer Elefant", "Flusspferd"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Wie viele Zähne hat ein erwachsener Mensch normalerweise einschließlich Weisheitszähnen?", "answers": ["28", "30", "32", "36"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welche Farbe entsteht durch die Mischung von Blau und Gelb?", "answers": ["Orange", "Grün", "Violett", "Braun"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Welches Land hat die Form eines Stiefels?", "answers": ["Spanien", "Griechenland", "Italien", "Portugal"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Wie heißt die Hauptstadt von Kanada?", "answers": ["Toronto", "Vancouver", "Ottawa", "Montreal"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welches Organ produziert Insulin?", "answers": ["Leber", "Bauchspeicheldrüse", "Niere", "Milz"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wie viele Herzen hat ein Oktopus?", "answers": ["1", "2", "3", "4"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welcher Ozean ist der größte?", "answers": ["Atlantischer Ozean", "Indischer Ozean", "Arktischer Ozean", "Pazifischer Ozean"], "correct": 3, "category": "Allgemeinwissen" },
  { "question": "Wer entwickelte die Relativitätstheorie?", "answers": ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Galileo Galilei"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wie viele Beine hat eine Spinne?", "answers": ["6", "8", "10", "12"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Welches ist das größte Organ des menschlichen Körpers?", "answers": ["Leber", "Gehirn", "Haut", "Lunge"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "In welchem Land stehen die Pyramiden von Gizeh?", "answers": ["Mexiko", "Ägypten", "Marokko", "Jordanien"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wie heißt die Hauptstadt von Japan?", "answers": ["Kyoto", "Osaka", "Tokio", "Hiroshima"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welches Gas nehmen Pflanzen bei der Fotosynthese auf?", "answers": ["Sauerstoff", "Stickstoff", "Kohlendioxid", "Wasserstoff"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Wie viele Saiten hat eine klassische Gitarre?", "answers": ["4", "5", "6", "7"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welches Land gewann die Fußball-Weltmeisterschaft 2014?", "answers": ["Argentinien", "Brasilien", "Deutschland", "Spanien"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Wie heißt der längste Knochen im menschlichen Körper?", "answers": ["Schienbein", "Oberarmknochen", "Oberschenkelknochen", "Wadenbein"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welcher Planet wird auch der Rote Planet genannt?", "answers": ["Venus", "Mars", "Merkur", "Saturn"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wie viele Minuten hat eine Stunde?", "answers": ["50", "60", "70", "100"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wer malte die Mona Lisa?", "answers": ["Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Claude Monet"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welches Tier ist für seine schwarz-weißen Streifen bekannt?", "answers": ["Panda", "Zebra", "Stinktier", "Dachs"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wie viele Spieler stehen bei einer Fußballmannschaft regulär gleichzeitig auf dem Platz?", "answers": ["9", "10", "11", "12"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welches Land hat die meisten Einwohner (Stand 2026)?", "answers": ["China", "Indien", "USA", "Indonesien"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Welcher ist der höchste Berg der Erde über dem Meeresspiegel?", "answers": ["K2", "Mount Everest", "Kilimandscharo", "Mont Blanc"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wie nennt man die Angst vor engen Räumen?", "answers": ["Arachnophobie", "Klaustrophobie", "Akrophobie", "Agoraphobie"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Welche Währung wird in Japan verwendet?", "answers": ["Won", "Yuan", "Yen", "Baht"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welches Tier ist ein Säugetier und kann fliegen?", "answers": ["Pinguin", "Fledermaus", "Adler", "Papagei"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wie viele Farben hat ein klassischer Regenbogen?", "answers": ["5", "6", "7", "8"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welcher Fluss fließt durch Paris?", "answers": ["Themse", "Rhein", "Seine", "Donau"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welches Metall ist bei Raumtemperatur flüssig?", "answers": ["Eisen", "Quecksilber", "Aluminium", "Kupfer"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wie heißt die Hauptstadt von Norwegen?", "answers": ["Stockholm", "Helsinki", "Oslo", "Kopenhagen"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welcher Vogel kann rückwärts fliegen?", "answers": ["Adler", "Kolibri", "Falke", "Storch"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wie viele Kammern hat das menschliche Herz?", "answers": ["2", "3", "4", "5"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welches Land ist für die Stadt Rio de Janeiro bekannt?", "answers": ["Argentinien", "Brasilien", "Chile", "Peru"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wie heißt die Wissenschaft von den Sternen und Planeten?", "answers": ["Geologie", "Astronomie", "Biologie", "Meteorologie"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Welcher Komponist schrieb die 9. Sinfonie mit der Ode an die Freude?", "answers": ["Mozart", "Bach", "Beethoven", "Vivaldi"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welches Tier ist das schnellste Landtier?", "answers": ["Löwe", "Gepard", "Pferd", "Antilope"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wie viele Tage hat ein Schaltjahr?", "answers": ["364", "365", "366", "367"], "correct": 2, "category": "Allgemeinwissen" },
  { "question": "Welche Sprache wird hauptsächlich in Brasilien gesprochen?", "answers": ["Spanisch", "Portugiesisch", "Französisch", "Englisch"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Welches ist das größte Säugetier der Welt?", "answers": ["Afrikanischer Elefant", "Blauwal", "Walhai", "Pottwal"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wie heißt die Hauptstadt von Island?", "answers": ["Reykjavík", "Oslo", "Tallinn", "Dublin"], "correct": 0, "category": "Allgemeinwissen" },
  { "question": "Welcher Stoff gibt dem Blut seine rote Farbe?", "answers": ["Insulin", "Hämoglobin", "Melanin", "Keratin"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "Wie viele Seiten hat ein Würfel?", "answers": ["4", "6", "8", "12"], "correct": 1, "category": "Allgemeinwissen" },
  { "question": "In welchem Jahr erschien GTA V ursprünglich?", "answers": ["2011", "2012", "2013", "2014"], "correct": 2, "category": "Gaming/PC" },
  { "question": "Wie heißt der Standardcharakter in Minecraft?", "answers": ["Alex", "Steve", "Notch", "Herobrine"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Welches Unternehmen entwickelt die PlayStation?", "answers": ["Microsoft", "Nintendo", "Sony", "Sega"], "correct": 2, "category": "Gaming/PC" },
  { "question": "Wofür steht die Abkürzung NPC?", "answers": ["New Player Control", "Non-Player Character", "Network PC", "Next Play Command"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Wie heißt die Spielwährung in GTA Online?", "answers": ["V-Bucks", "GTA-Dollar", "Simoleons", "Credits"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Welches Unternehmen entwickelt Fortnite?", "answers": ["Valve", "Epic Games", "Ubisoft", "Activision"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Was bedeutet AFK?", "answers": ["Away From Keyboard", "Always For Kills", "All Friends Known", "Away From Game"], "correct": 0, "category": "Gaming/PC" },
  { "question": "Welches Spiel ist für den Charakter Lara Croft bekannt?", "answers": ["Uncharted", "Tomb Raider", "Resident Evil", "Far Cry"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Wie heißt der Hauptgegner von Mario in vielen Nintendo-Spielen?", "answers": ["Sonic", "Bowser", "Wario", "Donkey Kong"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Was bedeutet die Abkürzung CPU?", "answers": ["Central Processing Unit", "Computer Power Utility", "Core Performance Unit", "Central Program User"], "correct": 0, "category": "Gaming/PC" },
  { "question": "Welcher Hersteller produziert die GeForce-Grafikkarten?", "answers": ["AMD", "Intel", "NVIDIA", "ASUS"], "correct": 2, "category": "Gaming/PC" },
  { "question": "Was bedeutet RAM?", "answers": ["Random Access Memory", "Read And Modify", "Rapid Active Module", "Remote Access Machine"], "correct": 0, "category": "Gaming/PC" },
  { "question": "Welches Spiel spielt in der fiktiven Welt Azeroth?", "answers": ["Guild Wars 2", "World of Warcraft", "Final Fantasy XIV", "Elder Scrolls Online"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Wie heißt der Hauptcharakter der Halo-Reihe?", "answers": ["Marcus Fenix", "Master Chief", "Solid Snake", "Doom Slayer"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Welches Spiel ist für seine Creeper bekannt?", "answers": ["Terraria", "Minecraft", "Rust", "Valheim"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Was ist Steam?", "answers": ["Eine Grafikkarte", "Eine Spieleplattform", "Ein Betriebssystem", "Ein Prozessor"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Wie viele Bits hat ein Byte?", "answers": ["4", "8", "16", "32"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Welches Unternehmen steckt hinter der Xbox?", "answers": ["Sony", "Microsoft", "Nintendo", "Apple"], "correct": 1, "category": "Gaming/PC" },
  { "question": "In welchem Spiel baut man mit Blöcken und überlebt gegen Monster?", "answers": ["Farming Simulator", "Minecraft", "Euro Truck Simulator", "The Sims"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Was bedeutet FPS im Gaming-Kontext meistens?", "answers": ["Frames Per Second", "Fast Player System", "First Program Setup", "Full Power Settings"], "correct": 0, "category": "Gaming/PC" },
  { "question": "Welches Spiel spielt in der Stadt Los Santos?", "answers": ["GTA V", "Watch Dogs 2", "Mafia III", "Sleeping Dogs"], "correct": 0, "category": "Gaming/PC" },
  { "question": "Wie heißt die Spielfigur aus der The-Legend-of-Zelda-Reihe?", "answers": ["Zelda", "Link", "Ganondorf", "Epona"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Was ist ein Headset?", "answers": ["Eine Tastatur", "Kopfhörer mit Mikrofon", "Eine Grafikkarte", "Ein Controller"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Welche Taste öffnet unter Windows normalerweise den Task-Manager direkt?", "answers": ["Strg + Alt + Entf", "Strg + Umschalt + Esc", "Alt + F4", "Windows + E"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Welches Spiel stammt von Mojang?", "answers": ["Fortnite", "Minecraft", "Roblox", "Rust"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Wie heißt die Spielfigur aus der Assassin's-Creed-Reihe im ersten Teil?", "answers": ["Ezio Auditore", "Altaïr Ibn-La'Ahad", "Bayek", "Connor Kenway"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Was ist ein SSD-Laufwerk?", "answers": ["Ein Arbeitsspeicher", "Ein schneller Datenspeicher", "Eine Soundkarte", "Ein Netzteil"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Welches Spiel ist für den Battle-Royale-Modus bekannt und wurde von Respawn entwickelt?", "answers": ["PUBG", "Apex Legends", "Warzone", "Fortnite"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Wie heißt der blaue Igel von Sega?", "answers": ["Tails", "Knuckles", "Sonic", "Shadow"], "correct": 2, "category": "Gaming/PC" },
  { "question": "Was bedeutet die Abkürzung GPU?", "answers": ["Graphics Processing Unit", "General Power Unit", "Gaming Program Utility", "Global Processing User"], "correct": 0, "category": "Gaming/PC" },
  { "question": "Welches Spiel ist für den Charakter Geralt von Riva bekannt?", "answers": ["Skyrim", "The Witcher", "Dragon Age", "Dark Souls"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Was ist ein Ping im Online-Gaming?", "answers": ["Die Bildschirmauflösung", "Die Netzwerkverzögerung", "Die Bildrate", "Der Speicherplatz"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Welches Unternehmen entwickelt die Grand-Theft-Auto-Reihe?", "answers": ["Rockstar Games", "Electronic Arts", "Ubisoft", "Bethesda"], "correct": 0, "category": "Gaming/PC" },
  { "question": "Wie heißt die virtuelle Währung in Fortnite?", "answers": ["Robux", "V-Bucks", "GTA-Dollar", "Gold"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Welches Spiel ist für den Modus Dust II bekannt?", "answers": ["Valorant", "Counter-Strike", "Overwatch", "Rainbow Six Siege"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Was bedeutet WLAN?", "answers": ["Wireless Local Area Network", "Wide Link Access Node", "Web Local Access Network", "Wireless Login Area"], "correct": 0, "category": "Gaming/PC" },
  { "question": "Welche Firma entwickelt die Unreal Engine?", "answers": ["Unity Technologies", "Epic Games", "Valve", "NVIDIA"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Wie heißt die Spielfigur aus Doom?", "answers": ["Doom Slayer", "Master Chief", "Gordon Freeman", "Sam Fisher"], "correct": 0, "category": "Gaming/PC" },
  { "question": "Was ist ein Betriebssystem?", "answers": ["Ein Computerspiel", "Software zur Verwaltung eines Computers", "Ein Internetbrowser", "Ein Grafikkartentreiber"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Welches Spiel wird mit dem Begriff Chicken Dinner verbunden?", "answers": ["Fortnite", "PUBG", "Apex Legends", "Warzone"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Welche Taste wird in vielen PC-Spielen zum Springen verwendet?", "answers": ["Strg", "Leertaste", "Tab", "Esc"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Was bedeutet die Abkürzung MMO?", "answers": ["Massively Multiplayer Online", "Main Memory Output", "Multi Mode Operation", "Maximum Multiplayer Option"], "correct": 0, "category": "Gaming/PC" },
  { "question": "Welches Spiel spielt in der postapokalyptischen Welt Appalachia?", "answers": ["Fallout 4", "Fallout 76", "The Division 2", "Days Gone"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Wie heißt der Standardbrowser von Microsoft in aktuellen Windows-Versionen?", "answers": ["Firefox", "Chrome", "Edge", "Opera"], "correct": 2, "category": "Gaming/PC" },
  { "question": "Was ist Discord hauptsächlich?", "answers": ["Ein Bildbearbeitungsprogramm", "Eine Kommunikationsplattform", "Ein Betriebssystem", "Ein Antivirenprogramm"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Welches Spiel wurde von Facepunch Studios entwickelt?", "answers": ["DayZ", "Rust", "ARK", "Conan Exiles"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Welche Komponente versorgt einen PC mit elektrischer Energie?", "answers": ["Mainboard", "Netzteil", "RAM", "SSD"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Was bedeutet die Abkürzung LAN?", "answers": ["Local Area Network", "Large Access Node", "Live Action Network", "Linked Application Name"], "correct": 0, "category": "Gaming/PC" },
  { "question": "Welches Spiel ist für seine Portal-Waffe bekannt?", "answers": ["Half-Life", "Portal", "Prey", "Control"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Welche Firma stellt Ryzen-Prozessoren her?", "answers": ["Intel", "AMD", "NVIDIA", "Qualcomm"], "correct": 1, "category": "Gaming/PC" },
  { "question": "Wie weit ist der Mond durchschnittlich von der Erde entfernt?", "answers": ["38.400 km", "384.400 km", "3.844.000 km", "38.440.000 km"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Wasser passen ungefähr in eine durchschnittliche Badewanne?", "answers": ["50 Liter", "150 Liter", "300 Liter", "600 Liter"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie viele Kilometer beträgt der Erdumfang am Äquator ungefähr?", "answers": ["20.000 km", "30.000 km", "40.075 km", "50.000 km"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie lange braucht das Licht der Sonne ungefähr bis zur Erde?", "answers": ["8 Minuten 20 Sekunden", "2 Minuten", "15 Minuten", "30 Minuten"], "correct": 0, "category": "Schätzfragen" },
  { "question": "Wie viele Haare hat ein Mensch durchschnittlich auf dem Kopf?", "answers": ["10.000", "50.000", "100.000", "500.000"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Blut hat ein erwachsener Mensch ungefähr?", "answers": ["2 Liter", "5 Liter", "10 Liter", "15 Liter"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie hoch ist der Eiffelturm einschließlich Antenne ungefähr?", "answers": ["180 Meter", "250 Meter", "330 Meter", "450 Meter"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Sekunden hat eine Woche?", "answers": ["604.800", "504.800", "704.800", "804.800"], "correct": 0, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Wasser fasst ein olympisches Schwimmbecken mit 50 × 25 × 2 Metern?", "answers": ["1.250.000", "2.500.000", "5.000.000", "10.000.000"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie schwer ist ein ausgewachsener afrikanischer Elefant ungefähr?", "answers": ["500 kg", "2.000 kg", "6.000 kg", "15.000 kg"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Kilometer legt die Erde ungefähr pro Sekunde auf ihrer Umlaufbahn zurück?", "answers": ["3 km", "30 km", "300 km", "3.000 km"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Wasser enthält ein Kubikmeter?", "answers": ["100", "500", "1.000", "10.000"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Tage dauert eine Umrundung der Erde durch den Mond ungefähr?", "answers": ["7 Tage", "14 Tage", "27,3 Tage", "365 Tage"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Knochen hat ein erwachsener Mensch ungefähr?", "answers": ["106", "206", "306", "406"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie hoch ist der Mount Everest ungefähr?", "answers": ["6.848 Meter", "7.848 Meter", "8.849 Meter", "9.849 Meter"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Zähne hat ein Hai im Laufe seines Lebens ungefähr? (Einzelne Arten können mehrere zehntausend Zähne entwickeln.)", "answers": ["100", "500", "1.000", "Mehrere zehntausend"], "correct": 3, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Luft atmet ein Erwachsener in Ruhe ungefähr pro Minute ein?", "answers": ["0,5 Liter", "6 Liter", "20 Liter", "50 Liter"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie viele Kilometer ist der Nil ungefähr lang?", "answers": ["1.000 km", "3.000 km", "6.650 km", "10.000 km"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Tage braucht die Erde ungefähr für eine Umrundung der Sonne?", "answers": ["30 Tage", "180 Tage", "365,25 Tage", "500 Tage"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Wasser kann ein Kamel auf einmal ungefähr trinken, wenn es stark durstig ist?", "answers": ["5 Liter", "20 Liter", "100 Liter", "200 Liter"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Kilometer pro Stunde erreicht ein Gepard ungefähr bei einem Sprint?", "answers": ["30 km/h", "60 km/h", "100–120 km/h", "200 km/h"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Zellen hat ein erwachsener Mensch ungefähr?", "answers": ["1 Billion", "10 Billionen", "30 Billionen", "300 Billionen"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Wasser passen ungefähr in einen handelsüblichen 10-Liter-Eimer?", "answers": ["5 Liter", "8 Liter", "10 Liter", "15 Liter"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Stunden hat ein Jahr mit 365 Tagen?", "answers": ["8.000", "8.760", "9.000", "10.000"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie viele Kilometer legt ein Auto bei 100 km/h in 30 Minuten zurück?", "answers": ["25 km", "50 km", "75 km", "100 km"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Wasser enthält ein durchschnittlicher menschlicher Körper mit 70 kg ungefähr?", "answers": ["7 Liter", "21 Liter", "42 Liter", "63 Liter"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Meter hoch ist ein typisches zehnstöckiges Wohnhaus ungefähr?", "answers": ["10 Meter", "30 Meter", "60 Meter", "100 Meter"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie viele Kilometer legt ein Lichtstrahl in einer Sekunde ungefähr zurück?", "answers": ["30.000 km", "150.000 km", "300.000 km", "1.000.000 km"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Wasser passen ungefähr in einen durchschnittlichen Putzeimer?", "answers": ["2 Liter", "5 Liter", "10 Liter", "30 Liter"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Minuten dauert ein durchschnittlicher Spielfilm ungefähr?", "answers": ["30 Minuten", "60 Minuten", "100 Minuten", "240 Minuten"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Kilometer liegen ungefähr zwischen Berlin und München auf direktem Luftweg?", "answers": ["300 km", "500 km", "800 km", "1.200 km"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Milch gibt eine Hochleistungskuh an einem guten Tag ungefähr?", "answers": ["5 Liter", "15 Liter", "30 Liter", "80 Liter"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Sekunden dauert es ungefähr, bis ein Stein aus 20 Metern Höhe ohne Luftwiderstand den Boden erreicht?", "answers": ["1 Sekunde", "2 Sekunden", "5 Sekunden", "10 Sekunden"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie viele Kilometer ist der Durchmesser der Erde ungefähr?", "answers": ["1.270 km", "6.371 km", "12.742 km", "40.075 km"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Gramm wiegt ein Liter Wasser bei ungefähr 4 °C?", "answers": ["100 g", "500 g", "1.000 g", "2.000 g"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Kilometer pro Stunde fährt ein ICE im regulären Hochgeschwindigkeitsbetrieb maximal ungefähr?", "answers": ["100 km/h", "200 km/h", "300 km/h", "500 km/h"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Blut pumpt das Herz eines Erwachsenen ungefähr pro Minute in Ruhe?", "answers": ["0,5 Liter", "5 Liter", "15 Liter", "30 Liter"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie viele Tage dauert eine Schwangerschaft beim Menschen ab dem ersten Tag der letzten Periode ungefähr?", "answers": ["180 Tage", "240 Tage", "280 Tage", "365 Tage"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Kilometer ist die ISS ungefähr von der Erdoberfläche entfernt?", "answers": ["40 km", "400 km", "4.000 km", "40.000 km"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Wasser verbraucht eine Person in Deutschland durchschnittlich pro Tag im Haushalt ungefähr?", "answers": ["10 Liter", "50 Liter", "120 Liter", "400 Liter"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Kilometer ist der Amazonas ungefähr lang?", "answers": ["1.000 km", "3.000 km", "6.400 km", "12.000 km"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Gramm wiegt ein durchschnittliches Hühnerei ungefähr?", "answers": ["10 g", "30 g", "60 g", "150 g"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Wasser kann ein großer Regentropfen ungefähr enthalten?", "answers": ["1 Liter", "100 Milliliter", "0,05 Milliliter", "10 Milliliter"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Kilometer fährt ein Auto bei 50 km/h in zwei Stunden?", "answers": ["50 km", "75 km", "100 km", "150 km"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Kilogramm wiegt ein durchschnittlicher ausgewachsener Blauwal ungefähr?", "answers": ["1.000 kg", "10.000 kg", "100.000 kg", "500.000 kg"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Wasser passen in einen Würfel mit einer Kantenlänge von einem Meter?", "answers": ["100 Liter", "500 Liter", "1.000 Liter", "10.000 Liter"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Minuten hat eine Woche?", "answers": ["7.200", "10.080", "12.000", "14.400"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie viele Kilometer pro Stunde erreicht ein Passagierflugzeug im Reiseflug ungefähr?", "answers": ["250 km/h", "500 km/h", "900 km/h", "1.500 km/h"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Wie viele Jahre dauert es ungefähr, bis eine Million Sekunden vergangen sind?", "answers": ["1 Jahr", "11,6 Tage", "30 Tage", "100 Tage"], "correct": 1, "category": "Schätzfragen" },
  { "question": "Wie viele Liter Wasser passen ungefähr in einen großen 200-Liter-Regentank?", "answers": ["20 Liter", "100 Liter", "200 Liter", "500 Liter"], "correct": 2, "category": "Schätzfragen" },
  { "question": "Was wird nass, während es trocknet?", "answers": ["Ein Schwamm", "Ein Handtuch", "Ein Föhn", "Ein Heizkörper"], "correct": 1, "category": "Fangfragen" },
  { "question": "Wie viele Monate haben mindestens 28 Tage?", "answers": ["1", "2", "6", "12"], "correct": 3, "category": "Fangfragen" },
  { "question": "Was gehört dir, wird aber häufiger von anderen benutzt?", "answers": ["Dein Geld", "Dein Auto", "Dein Name", "Dein Handy"], "correct": 2, "category": "Fangfragen" },
  { "question": "Was ist schwerer: ein Kilogramm Federn oder ein Kilogramm Eisen?", "answers": ["Federn", "Eisen", "Beides gleich schwer", "Kommt auf die Größe an"], "correct": 2, "category": "Fangfragen" },
  { "question": "Ein Hahn legt ein Ei auf ein Dach. Auf welche Seite rollt es herunter?", "answers": ["Nach links", "Nach rechts", "Nach vorne", "Gar nicht, Hähne legen keine Eier"], "correct": 3, "category": "Fangfragen" },
  { "question": "Du überholst bei einem Rennen den Zweitplatzierten. Auf welchem Platz bist du jetzt?", "answers": ["Erster", "Zweiter", "Dritter", "Letzter"], "correct": 1, "category": "Fangfragen" },
  { "question": "Ein Flugzeug stürzt an der Grenze zwischen Deutschland und Frankreich ab. Wo werden die Überlebenden begraben?", "answers": ["Deutschland", "Frankreich", "An der Grenze", "Gar nicht"], "correct": 3, "category": "Fangfragen" },
  { "question": "Wie viele Tiere jeder Art nahm Moses mit auf die Arche?", "answers": ["2", "7", "14", "Keine, das war Noah"], "correct": 3, "category": "Fangfragen" },
  { "question": "Was hat einen Hals, aber keinen Kopf?", "answers": ["Eine Giraffe", "Eine Flasche", "Ein Mensch", "Ein Vogel"], "correct": 1, "category": "Fangfragen" },
  { "question": "Was kann um die ganze Welt reisen, ohne seinen Platz zu verlassen?", "answers": ["Ein Flugzeug", "Ein Satellit", "Eine Briefmarke", "Ein Zug"], "correct": 2, "category": "Fangfragen" },
  { "question": "Ein Bauer hat 17 Schafe. Alle bis auf 9 laufen weg. Wie viele bleiben übrig?", "answers": ["8", "9", "17", "0"], "correct": 1, "category": "Fangfragen" },
  { "question": "Du hast drei Äpfel und nimmst zwei davon. Wie viele Äpfel hast du?", "answers": ["1", "2", "3", "5"], "correct": 1, "category": "Fangfragen" },
  { "question": "Was hat vier Beine, kann aber nicht laufen?", "answers": ["Ein Hund", "Ein Pferd", "Ein Tisch", "Eine Katze"], "correct": 2, "category": "Fangfragen" },
  { "question": "Wie oft kannst du 10 von 100 abziehen?", "answers": ["Einmal", "Zweimal", "Zehnmal", "Unendlich oft"], "correct": 0, "category": "Fangfragen" },
  { "question": "Ein elektrischer Zug fährt nach Norden. Der Wind weht nach Süden. Wohin zieht der Rauch?", "answers": ["Nach Norden", "Nach Süden", "Nach Westen", "Es entsteht kein Rauch"], "correct": 3, "category": "Fangfragen" },
  { "question": "Was hat viele Schlüssel, kann aber keine Tür öffnen?", "answers": ["Ein Schlüsselbund", "Ein Klavier", "Ein Safe", "Ein Türschloss"], "correct": 1, "category": "Fangfragen" },
  { "question": "Was wird größer, je mehr man davon wegnimmt?", "answers": ["Ein Berg", "Ein Loch", "Ein Baum", "Ein Haus"], "correct": 1, "category": "Fangfragen" },
  { "question": "Ein Arzt gibt dir drei Tabletten und sagt, du sollst alle 30 Minuten eine nehmen. Wie lange dauert es, bis du alle genommen hast?", "answers": ["30 Minuten", "60 Minuten", "90 Minuten", "120 Minuten"], "correct": 1, "category": "Fangfragen" },
  { "question": "Was hat ein Auge, kann aber nicht sehen?", "answers": ["Ein Adler", "Eine Nadel", "Ein Zyklop", "Ein Fisch"], "correct": 1, "category": "Fangfragen" },
  { "question": "Welche Frage kannst du niemals ehrlich mit Ja beantworten, wenn du gerade schläfst?", "answers": ["Bist du müde?", "Schläfst du gerade?", "Bist du wach?", "Hast du Hunger?"], "correct": 1, "category": "Fangfragen" },
  { "question": "Was hat Städte, aber keine Häuser, Wälder, aber keine Bäume und Flüsse, aber kein Wasser?", "answers": ["Ein Märchenbuch", "Eine Landkarte", "Ein Fotoalbum", "Ein Globus"], "correct": 1, "category": "Fangfragen" },
  { "question": "Wie viele Geburtstage hat ein Mensch?", "answers": ["Einen", "Zehn", "Jeden Monat einen", "So viele wie Lebensjahre"], "correct": 0, "category": "Fangfragen" },
  { "question": "Ein Vater und sein Sohn haben zusammen 36 Jahre. Der Vater ist 30 Jahre älter. Wie alt ist der Sohn?", "answers": ["3 Jahre", "6 Jahre", "8 Jahre", "18 Jahre"], "correct": 0, "category": "Fangfragen" },
  { "question": "Was steht immer vor dir, kann aber niemals erreicht werden?", "answers": ["Die Vergangenheit", "Die Zukunft", "Die Gegenwart", "Dein Schatten"], "correct": 1, "category": "Fangfragen" },
  { "question": "Was hat Zähne, kann aber nicht beißen?", "answers": ["Ein Hund", "Ein Kamm", "Ein Löwe", "Ein Hai"], "correct": 1, "category": "Fangfragen" },
  { "question": "Ein Mann geht im strömenden Regen ohne Schirm und ohne Hut. Kein einziges Haar wird nass. Warum?", "answers": ["Er ist unsichtbar", "Er hat keine Haare", "Er steht unter Wasser", "Es regnet nur neben ihm"], "correct": 1, "category": "Fangfragen" },
  { "question": "Was kann man brechen, ohne es jemals anzufassen?", "answers": ["Ein Glas", "Ein Versprechen", "Einen Stock", "Einen Stein"], "correct": 1, "category": "Fangfragen" },
  { "question": "Ein Korb enthält fünf Äpfel. Fünf Kinder bekommen jeweils einen Apfel. Trotzdem bleibt ein Apfel im Korb. Wie geht das?", "answers": ["Ein Apfel ist faul", "Das letzte Kind bekommt den Korb mit dem Apfel", "Ein Kind bekommt zwei Äpfel", "Der Korb ist leer"], "correct": 1, "category": "Fangfragen" },
  { "question": "Was hat Hände, kann aber nicht klatschen?", "answers": ["Ein Mensch", "Eine Uhr", "Ein Affe", "Ein Roboter"], "correct": 1, "category": "Fangfragen" },
  { "question": "Wenn du einen Stein ins Wasser wirfst, was passiert mit ihm?", "answers": ["Er schwimmt", "Er wird leichter", "Er sinkt normalerweise", "Er verschwindet"], "correct": 2, "category": "Fangfragen" },
  { "question": "Was ist am Ende eines Regenbogens?", "answers": ["Gold", "Ein Schatz", "Der Buchstabe N", "Ein Topf"], "correct": 2, "category": "Fangfragen" },
  { "question": "Was hat einen Kopf und einen Schwanz, aber keinen Körper?", "answers": ["Eine Schlange", "Eine Münze", "Eine Eidechse", "Ein Fisch"], "correct": 1, "category": "Fangfragen" },
  { "question": "Ein Mann baut ein Haus mit vier Wänden. Jede Wand zeigt nach Süden. Ein Bär läuft vorbei. Welche Farbe hat der Bär?", "answers": ["Braun", "Schwarz", "Weiß", "Grau"], "correct": 2, "category": "Fangfragen" },
  { "question": "Was kann man fangen, aber nicht werfen?", "answers": ["Einen Ball", "Eine Erkältung", "Einen Stein", "Einen Schlüssel"], "correct": 1, "category": "Fangfragen" },
  { "question": "Welche Zahl wird größer, wenn man sie auf den Kopf stellt?", "answers": ["6", "8", "3", "5"], "correct": 0, "category": "Fangfragen" },
  { "question": "Wie weit kann ein Hund in den Wald hineinlaufen?", "answers": ["Bis zur Mitte", "Bis zum Ende", "Bis zum nächsten Baum", "So weit er möchte"], "correct": 0, "category": "Fangfragen" },
  { "question": "Was hat Blätter, aber ist kein Baum?", "answers": ["Ein Buch", "Eine Blume", "Ein Busch", "Ein Farn"], "correct": 0, "category": "Fangfragen" },
  { "question": "Ein Zimmer hat vier Ecken. In jeder Ecke sitzt eine Katze. Jede Katze sieht drei andere Katzen. Wie viele Katzen sind im Zimmer?", "answers": ["4", "8", "12", "16"], "correct": 0, "category": "Fangfragen" },
  { "question": "Was läuft, hat aber keine Beine?", "answers": ["Ein Hund", "Eine Uhr", "Ein Vogel", "Ein Auto"], "correct": 1, "category": "Fangfragen" },
  { "question": "Was wird kürzer, wenn man es verlängert?", "answers": ["Ein Seil", "Ein Bleistift", "Das Wort kurz", "Ein Stock"], "correct": 2, "category": "Fangfragen" },
  { "question": "Wie viele Tiere nahm Adam mit auf die Arche?", "answers": ["2", "4", "7", "Keine, Noah baute die Arche"], "correct": 3, "category": "Fangfragen" },
  { "question": "Ein Mann hat 10 Kerzen. Zwei davon bläst er aus. Wie viele Kerzen bleiben nach dem vollständigen Abbrennen der übrigen Kerzen übrig?", "answers": ["0", "2", "8", "10"], "correct": 1, "category": "Fangfragen" },
  { "question": "Was ist voller Löcher und hält trotzdem Wasser?", "answers": ["Ein Sieb", "Ein Schwamm", "Ein Netz", "Ein Korb"], "correct": 1, "category": "Fangfragen" },
  { "question": "Was kann man hören, aber nicht sehen oder anfassen?", "answers": ["Einen Schatten", "Ein Geräusch", "Einen Stein", "Eine Farbe"], "correct": 1, "category": "Fangfragen" },
  { "question": "Ein Schiff liegt im Hafen. Eine Leiter hängt über der Bordwand. Die unterste Sprosse berührt das Wasser. Bei steigender Flut steigt das Wasser um einen Meter. Wie viele Sprossen werden zusätzlich überspült?", "answers": ["Eine", "Zwei", "Fünf", "Keine, das Schiff steigt mit dem Wasser"], "correct": 3, "category": "Fangfragen" },
  { "question": "Was ist immer unterwegs, kommt aber niemals an?", "answers": ["Ein Zug", "Die Zeit", "Ein Flugzeug", "Ein Paket"], "correct": 1, "category": "Fangfragen" },
  { "question": "Wie viele Tiere sind mindestens notwendig, damit zwei Tiere derselben Art in einem Raum sind?", "answers": ["1", "2", "3", "4"], "correct": 1, "category": "Fangfragen" },
  { "question": "Was hat ein Bett, schläft aber nie?", "answers": ["Ein Mensch", "Ein Flussbett", "Ein Hund", "Ein Baby"], "correct": 1, "category": "Fangfragen" },
  { "question": "Wenn du eine Kerze anzündest, was wird zuerst kürzer?", "answers": ["Der Docht", "Die Flamme", "Der Schatten", "Das Licht"], "correct": 0, "category": "Fangfragen" },
  { "question": "Was ist am Anfang der Ewigkeit, am Ende der Zeit und am Anfang jedes Endes?", "answers": ["Der Buchstabe E", "Der Buchstabe T", "Der Buchstabe Z", "Der Buchstabe A"], "correct": 0, "category": "Fangfragen" }



]

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
  const indices = [0, 1, 2, 3].filter(i => i !== correct);
  
  // Fisher-Yates shuffle (unbiased)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const eliminated = indices.slice(0, 2);

  // Animate sequentially and await each
  for (const [i, idx] of eliminated.entries()) {
    await new Promise(r => setTimeout(r, i * 300));
    const btn = els.answersGrid.children[idx];
    if (btn) {
      btn.classList.add('eliminated');
      btn.disabled = true;
    }
  }

  state.lifelineResults.fifty = { eliminated };
  return eliminated; // useful for callers
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
