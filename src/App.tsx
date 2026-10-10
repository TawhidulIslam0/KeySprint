import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity, ArrowRight, BarChart3, Check, ChevronDown, Clock3, Command,
  Keyboard, Moon, RotateCcw, Sun, Target, Trophy, Zap
} from "lucide-react";

type Difficulty = "Easy" | "Medium" | "Hard";
type Topic = "Mixed" | "Technology" | "Nature" | "Work";
type Result = {
  date: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  duration: number;
};

const wordPools: Record<Topic, Record<Difficulty, string[]>> = {
  Mixed: {
    Easy: [
      "small", "steps", "lead", "to", "big", "changes", "over", "time", "take", "your", 
      "stay", "curious", "and", "keep", "moving", "forward", "even", "when", "progress", 
      "feels", "slow", "consistency", "is", "the", "secret", "ingredient", "mastering", 
      "any", "craft", "whether", "you", "are", "writing", "code", "playing", "an", "instrument", 
      "or", "learning", "a", "new", "language", "good", "day", "starts", "clear", "plan", 
      "little", "patience", "courage", "begin", "before", "feel", "entirely", "ready", "stop", 
      "worrying", "about", "making", "mistakes", "start", "focusing", "on", "next", "single", 
      "word", "everything", "becomes", "much", "easier", "habits", "formed", "through", "repetition", 
      "environmental", "design", "making", "workspace", "inviting", "reducing", "friction", "positive", 
      "tasks", "set", "yourself", "up", "effortless", "daily", "growth", "asking", "simple", "questions"
    ],
    Medium: [
      "learning", "skill", "takes", "more", "than", "blind", "repetition", "focused", "attention", 
      "useful", "feedback", "willingness", "try", "again", "after", "mistake", "reliable", "way", 
      "improve", "build", "routine", "can", "actually", "maintain", "without", "burning", "out", 
      "few", "minutes", "each", "compound", "faster", "sporadic", "marathon", "sessions", "good", 
      "ideas", "often", "appear", "give", "ourselves", "room", "explore", "better", "connect", 
      "details", "once", "seemed", "unrelated", "creativity", "rarely", "sudden", "flash", "lightning", 
      "usually", "result", "gathering", "notes", "testing", "assumptions", "refining", "thoughts", 
      "iteration", "effective", "communication", "relies", "heavily", "empathy", "clarity", "listen", 
      "actively", "present", "simply", "misunderstandings", "drop", "dramatically", "collaboration", "seamless"
    ],
    Hard: [
      "progress", "rarely", "follows", "perfectly", "straight", "line", "emerges", "experimentation", 
      "reflection", "small", "adjustments", "repeated", "strict", "intention", "encounter", "unexpected", 
      "friction", "view", "not", "failure", "valuable", "diagnostic", "data", "pointing", "directly", 
      "flaw", "current", "mental", "model", "precision", "merely", "absence", "mistakes", "disciplined", 
      "habit", "noticing", "subtle", "details", "correcting", "course", "quickly", "maintaining", "absolute", 
      "consistency", "under", "pressure", "true", "mastery", "requires", "balancing", "speed", "deliberate", 
      "control", "execution", "second", "nature", "complex", "systems", "inherently", "resist", "intuitive", 
      "prediction", "nonlinear", "interactions", "amplify", "minor", "initial", "variations", "divergent", "outcomes"
    ]
  },
  Technology: {
    Easy: [
      "code", "gives", "clear", "instructions", "computer", "test", "one", "change", "at", "a", 
      "time", "read", "each", "error", "message", "carefully", "remember", "debugging", "just", 
      "normal", "part", "building", "something", "useful", "modern", "website", "combines", 
      "structure", "style", "interactive", "behavior", "create", "seamless", "experiences", "people", 
      "can", "access", "smoothly", "across", "many", "different", "devices", "screen", "sizes", 
      "version", "control", "systems", "help", "developers", "track", "changes", "collaborate", 
      "safely", "shared", "repositories", "roll", "back", "unintended", "bugs", "without", "losing", 
      "hours", "hard", "work", "web", "browsers", "parse", "html", "execute", "javascript", "scripts"
    ],
    Medium: [
      "reliable", "software", "built", "through", "small", "decoupled", "components", "meaningful", 
      "automated", "tests", "boundaries", "between", "responsibilities", "choosing", "descriptive", 
      "unambiguous", "names", "variables", "functions", "makes", "future", "significantly", "easier", 
      "team", "application", "programming", "interface", "defines", "how", "separate", "exchange", 
      "information", "securely", "thoughtful", "validation", "predictable", "handling", "keep", 
      "network", "exchanges", "robust", "safe", "from", "unexpected", "edge", "cases", "relational", 
      "databases", "use", "structured", "schemas", "foreign", "keys", "indexes", "ensure", "data", 
      "integrity", "fast", "query", "performance", "scale", "increases", "over", "time"
    ],
    Hard: [
      "distributed", "systems", "must", "account", "network", "latency", "partial", "failures", 
      "concurrent", "updates", "stubborn", "possibility", "request", "succeeds", "even", "when", 
      "outgoing", "response", "completely", "lost", "designing", "eventual", "consistency", "requires", 
      "shifting", "think", "state", "readable", "abstractions", "reduce", "cognitive", "load", 
      "developers", "unnecessary", "indirection", "frequently", "conceal", "critical", "underlying", 
      "strongest", "architectural", "makes", "important", "trade", "offs", "explicit", "keeps", 
      "flow", "transparent", "cryptographic", "hashing", "algorithms", "public", "key", "infrastructures", 
      "token", "based", "authentication", "protocols", "form", "foundational", "layers", "modern", "security"
    ]
  },
  Nature: {
    Easy: [
      "rain", "feeds", "quiet", "garden", "warm", "sunlight", "slowly", "wakes", "rich", "soil", 
      "birds", "sing", "high", "leafy", "trees", "early", "morning", "begins", "unfold", "steady", 
      "river", "winds", "way", "around", "smooth", "stones", "carrying", "fallen", "autumn", "leaves", 
      "toward", "distant", "peaceful", "sea", "tall", "mountains", "stand", "against", "clear", 
      "blue", "sky", "casting", "long", "shadows", "across", "green", "valleys", "where", "wildflowers", 
      "bloom", "gentle", "spring", "breeze", "ocean", "waves", "crash", "rhythmically", "sandy", 
      "shores", "shaping", "coastline", "centuries", "while", "marine", "life", "thrives", "beneath"
    ],
    Medium: [
      "at", "dusk", "deep", "forest", "changes", "character", "entirely", "distant", "animal", 
      "calls", "grow", "louder", "stretching", "across", "dirt", "path", "cool", "evening", "air", 
      "settles", "comfortably", "between", "ancient", "healthy", "ecosystems", "depend", "intricate", 
      "relationships", "among", "plants", "animals", "fungi", "fresh", "water", "sudden", "disruption", 
      "one", "single", "part", "can", "ripple", "outward", "affect", "entire", "community", "seasonal", 
      "triggers", "remarkable", "transformations", "wildlife", "migrating", "continents", "shedding", 
      "their", "conserve", "energy", "during", "freezing", "winters", "coral", "reefs", "support"
    ],
    Hard: [
      "biodiversity", "strengthens", "ecological", "resilience", "preserving", "wide", "range", 
      "biological", "interactions", "genetic", "variations", "adaptive", "responses", "sudden", 
      "environmental", "disturbances", "seasonal", "migration", "patterns", "shift", "dramatically", 
      "global", "temperatures", "change", "traditional", "food", "sources", "move", "natural", 
      "habitats", "become", "fragmented", "expanding", "human", "infrastructure", "urban", "sprawl", 
      "atmospheric", "carbon", "sequestration", "relies", "heavily", "vast", "oceanic", "phytoplankton", 
      "blooms", "old", "growth", "forest", "canopies", "absorbing", "greenhouse", "gases", "regulate", 
      "climate", "stability", "geomorphological", "processes", "such", "tectonic", "uplift", "glacial"
    ]
  },
  Work: {
    Easy: [
      "clear", "message", "always", "saves", "time", "share", "core", "goal", "explain", "next", 
      "immediate", "step", "never", "hesitate", "ask", "help", "when", "something", "remains", 
      "unclear", "good", "teamwork", "means", "listening", "carefully", "different", "perspectives", 
      "sharing", "timely", "updates", "making", "safe", "space", "everyone", "contribute", "best", 
      "ideas", "setting", "daily", "priorities", "helps", "keep", "focus", "sharp", "prevents", 
      "small", "distractions", "derailing", "important", "project", "milestones", "celebrating", 
      "wins", "fosters", "positive", "morale", "encourages", "open", "communication", "tasks"
    ],
    Medium: [
      "truly", "useful", "meeting", "strictly", "defined", "purpose", "concise", "agenda", "action", 
      "items", "everyone", "reference", "afterward", "respecting", "colleagues", "builds", "deep", 
      "organizational", "trust", "planning", "works", "best", "fully", "visible", "task", "designated", 
      "owner", "review", "timeline", "regularly", "instead", "blindly", "assuming", "initial", 
      "estimate", "will", "flawless", "constructive", "feedback", "focuses", "specific", "behaviors", 
      "actionable", "improvements", "rather", "general", "criticism", "helping", "members", "grow", 
      "professionally", "managing", "stakeholder", "expectations", "requires", "transparent", "scope"
    ],
    Hard: [
      "effective", "collaboration", "depends", "explicit", "expectations", "timely", "constructive", 
      "professional", "discipline", "resolve", "structural", "ambiguity", "before", "turns", "expensive", 
      "rework", "business", "priorities", "compete", "heavily", "evaluate", "impact", "urgency", 
      "system", "dependencies", "available", "team", "capacity", "allowing", "loudest", "request", 
      "room", "dictate", "entire", "schedule", "organizational", "agility", "decentralizing", 
      "operational", "decision", "making", "maintaining", "strong", "strategic", "alignment", 
      "across", "cross", "functional", "product", "engineering", "teams", "mitigating", "burnout", 
      "involves", "establishing", "sustainable", "boundary", "protocols", "streamlining", "redundant"
    ]
  }
};

function generateParagraph(topic: Topic, difficulty: Difficulty): string[] {
  const pool = wordPools[topic][difficulty];
  const lines: string[] = [];
  for (let i = 0; i < 50; i++) {
    const lineWords: string[] = [];
    for (let w = 0; w < 7; w++) {
      lineWords.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    lines.push(lineWords.join(" "));
  }
  return lines;
}

const durations = [
  { label: "1m", value: 60 },
  { label: "2m", value: 120 },
  { label: "5m", value: 300 },
  { label: "15m", value: 900 },
  { label: "30m", value: 1800 },
];

const historyKey = "keysprint-results-v1";

function readHistory(): Result[] {
  try {
    return JSON.parse(localStorage.getItem(historyKey) || "[]") as Result[];
  } catch {
    return [];
  }
}

export function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    localStorage.getItem("keysprint-theme") === "light" ? "light" : "dark"
  );
  const [duration, setDuration] = useState(60);
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [topic, setTopic] = useState<Topic>("Mixed");
  
  const [lines, setLines] = useState<string[]>(() => generateParagraph("Mixed", "Medium"));
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [typed, setTyped] = useState("");
  
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(60);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<Result[]>(readHistory);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [totalTypedLen, setTotalTypedLen] = useState(0);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);

  const activeLine = lines[currentLineIndex] || "";

  useEffect(() => {
    setLines(generateParagraph(topic, difficulty));
    setCurrentLineIndex(0);
    setTyped("");
    setStartedAt(null);
    setFinished(false);
    setTotalTypedLen(0);
    setTotalCorrectChars(0);
    setTotalErrors(0);
  }, [topic, difficulty]);

  const elapsed = startedAt === null ? 0 : Math.min(duration, Math.max(0, duration - remaining));
  const currentCorrect = typed.split("").filter((char, i) => char === activeLine[i]).length;
  const currentWrong = typed.split("").filter((char, i) => char !== activeLine[i]).length;
  
  const combinedTypedLen = totalTypedLen + typed.length;
  const combinedCorrect = totalCorrectChars + currentCorrect;
  const combinedErrors = totalErrors + currentWrong;

  const rawWpm = elapsed > 0 ? Math.round((combinedTypedLen / 5) / (elapsed / 60)) : 0;
  const wpm = elapsed > 0 ? Math.max(0, Math.round((combinedCorrect / 5) / (elapsed / 60))) : 0;
  const accuracy = combinedTypedLen ? Math.round((combinedCorrect / combinedTypedLen) * 100) : 100;

  const resetTest = useCallback(() => {
    setLines(generateParagraph(topic, difficulty));
    setCurrentLineIndex(0);
    setTyped("");
    setStartedAt(null);
    setFinished(false);
    setRemaining(duration);
    setTotalTypedLen(0);
    setTotalCorrectChars(0);
    setTotalErrors(0);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [topic, difficulty, duration]);

  const finishTest = useCallback(() => {
    if (finished) return;
    setFinished(true);
    const nowElapsed = startedAt === null ? 0 : Math.max(1, Math.min(duration, Math.round((Date.now() - startedAt) / 1000)));
    const result: Result = {
      date: new Date().toISOString(),
      wpm: nowElapsed ? Math.round((combinedCorrect / 5) / (nowElapsed / 60)) : 0,
      rawWpm: nowElapsed ? Math.round((combinedTypedLen / 5) / (nowElapsed / 60)) : 0,
      accuracy: combinedTypedLen ? Math.round((combinedCorrect / combinedTypedLen) * 100) : 100,
      errors: combinedErrors,
      duration
    };
    const next = [result, ...history].slice(0, 10);
    setHistory(next);
    localStorage.setItem(historyKey, JSON.stringify(next));
  }, [combinedCorrect, combinedErrors, combinedTypedLen, duration, finished, history, startedAt]);

  useEffect(() => {
    if (startedAt === null || finished) return;
    const timer = window.setInterval(() => {
      const left = Math.max(0, duration - Math.floor((Date.now() - startedAt) / 1000));
      setRemaining(left);
      if (left <= 0) finishTest();
    }, 200);
    return () => window.clearInterval(timer);
  }, [duration, finishTest, finished, startedAt]);

  useEffect(() => {
    localStorage.setItem("keysprint-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  const handleTyping = (value: string) => {
    if (finished) return;
    if (startedAt === null && value.length > 0) setStartedAt(Date.now());

    if (value.length >= activeLine.length) {
      setTotalTypedLen((prev) => prev + value.length);
      setTotalCorrectChars((prev) => prev + currentCorrect);
      setTotalErrors((prev) => prev + currentWrong);
      setTyped("");
      setCurrentLineIndex((prev) => prev + 1);
      return;
    }

    setTyped(value);
  };

  const chooseDuration = (value: number) => {
    setDuration(value);
    setRemaining(value);
    setTyped("");
    setStartedAt(null);
    setFinished(false);
    setCurrentLineIndex(0);
    setTotalTypedLen(0);
    setTotalCorrectChars(0);
    setTotalErrors(0);
  };

  const best = history.reduce((max, item) => Math.max(max, item.wpm), 0);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const prevLine = currentLineIndex > 0 ? lines[currentLineIndex - 1] : "";
  const nextLine = lines[currentLineIndex + 1] || "";

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="KeySprint home" onClick={(e) => { e.preventDefault(); resetTest(); }}>
          <span className="brand-mark"><Keyboard size={20} strokeWidth={2.4} /></span>
          <span>key<span className="brand-accent">sprint</span><small>TYPE WITH INTENTION</small></span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a className="nav-active" href="#test">Typing test</a>
          <a href="#progress">Your progress</a>
          <a href="#tips">Typing tips</a>
        </nav>
        <div className="top-actions">
          <span className="local-badge"><span /> Free practice</span>
          <button className="icon-button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR DAILY SKILL CHECK</div>
          <h1>Find your <em>flow.</em><br />One keystroke at a time.</h1>
          <p className="hero-copy">A calmer space to measure your speed, sharpen your accuracy, and build a typing rhythm that lasts.</p>
          <div className="hero-stats">
            <div><span className="stat-icon"><Zap size={16} /></span><strong>Instant</strong><small>live feedback</small></div>
            <div><span className="stat-icon"><Target size={16} /></span><strong>Focused</strong><small>practice sessions</small></div>
            <div><span className="stat-icon"><BarChart3 size={16} /></span><strong>Private</strong><small>local progress</small></div>
          </div>
        </section>

        <section className="workspace" id="test">
          <div className="section-heading">
            <div><span className="section-kicker">THE WORKSPACE</span><h2>Typing speed test</h2></div>
            <div className="session-pill"><span className={startedAt !== null && !finished ? "pulse-dot live" : "pulse-dot"} />{finished ? "Session complete" : startedAt !== null ? "Session in progress" : "Ready when you are"}</div>
          </div>

          <div className="settings-row">
            <div className="setting-group duration-group">
              <span className="setting-label"><Clock3 size={14} /> DURATION</span>
              <div className="segmented">
                {durations.map((item) => (
                  <button
                    key={item.value}
                    className={duration === item.value ? "segment selected" : "segment"}
                    onClick={() => chooseDuration(item.value)}
                    disabled={startedAt !== null && !finished}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="setting-group">
              <label className="setting-label" htmlFor="difficulty"><Activity size={14} /> DIFFICULTY</label>
              <div className="select-wrap"><select id="difficulty" value={difficulty} onChange={(e) => { setDifficulty(e.target.value as Difficulty); }} disabled={startedAt !== null && !finished}><option>Easy</option><option>Medium</option><option>Hard</option></select><ChevronDown size={15} /></div>
            </div>
            <div className="setting-group">
              <label className="setting-label" htmlFor="topic"><Command size={14} /> TEXT CATEGORY</label>
              <div className="select-wrap"><select id="topic" value={topic} onChange={(e) => { setTopic(e.target.value as Topic); }} disabled={startedAt !== null && !finished}><option>Mixed</option><option>Technology</option><option>Nature</option><option>Work</option></select><ChevronDown size={15} /></div>
            </div>
          </div>

          <div className="test-card">
            <div className="test-card-top">
              <div><span className="micro-label">LIVE STREAM</span><span className="passage-meta">{difficulty} · {topic}</span></div>
              <div className="timer"><span>TIME LEFT</span><strong className={remaining <= 10 && !finished ? "timer-low" : ""}>{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</strong></div>
            </div>
            {finished ? (
              <div className="results-panel">
                <div className="result-icon"><Trophy size={25} /></div>
                <span className="micro-label">SESSION COMPLETE</span>
                <h3>Nice work. Keep that momentum.</h3>
                <div className="result-grid">
                  <div><small>NET WPM</small><strong>{wpm}</strong></div>
                  <div><small>ACCURACY</small><strong>{accuracy}%</strong></div>
                  <div><small>RAW WPM</small><strong>{rawWpm}</strong></div>
                  <div><small>ERRORS</small><strong>{combinedErrors}</strong></div>
                </div>
                <button className="primary-button" onClick={resetTest}><RotateCcw size={16} /> Try another test <ArrowRight size={16} /></button>
              </div>
            ) : (
              <>
                <div className="passage-display-monkeytype" onClick={() => inputRef.current?.focus()}>
                  {prevLine && <div className="monkey-line prev-line">{prevLine}</div>}
                  
                  <div className="monkey-line active-line">
                    {activeLine.split("").map((char, index) => {
                      let className = "char";
                      if (index < typed.length) className += typed[index] === char ? " correct" : " incorrect";
                      if (index === typed.length) className += " current";
                      return <span className={className} key={index}>{char}</span>;
                    })}
                    {typed.length === 0 && <span className="start-hint">Start typing <span>↵</span></span>}
                  </div>

                  {nextLine && <div className="monkey-line next-line">{nextLine}</div>}
                </div>

                <textarea
                  ref={inputRef}
                  className="typing-input"
                  aria-label="Type the passage here"
                  placeholder="Click here and type the active line above…"
                  value={typed}
                  onChange={(e) => handleTyping(e.target.value)}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  disabled={finished}
                />
                <div className="test-card-footer">
                  <span><Keyboard size={14} /> Focus on accuracy first</span>
                  <div className="test-controls">
                    <span className="chars-count">{combinedTypedLen + typed.length} <small>chars typed</small></span>
                    <button className="text-button" onClick={resetTest}><RotateCcw size={14} /> Restart</button>
                    <button className="finish-button" onClick={finishTest} disabled={combinedTypedLen === 0 && typed.length === 0}>Finish test <ArrowRight size={14} /></button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="live-metrics">
            <div className="metric-main"><div className="metric-icon green"><Zap size={17} /></div><div><span>NET SPEED</span><strong>{wpm}<small> WPM</small></strong></div><div className="metric-trend"><span>LIVE</span><Activity size={15} /></div></div>
            <div className="metric"><span>ACCURACY</span><strong>{accuracy}<small>%</small></strong><div className="mini-progress"><span style={{ width: `${accuracy}%` }} /></div></div>
            <div className="metric"><span>RAW SPEED</span><strong>{rawWpm}<small> WPM</small></strong><p>Before errors</p></div>
            <div className="metric"><span>ERRORS</span><strong>{combinedErrors.toString().padStart(2, "0")}</strong><p>Characters mistyped</p></div>
          </div>
          <p className="privacy-note"><span className="privacy-dot" /> Your typing and results stay in this browser. No account required.</p>
        </section>

        <section className="bottom-grid" id="progress">
          <div className="progress-card">
            <div className="card-title-row"><div><span className="section-kicker">YOUR JOURNEY</span><h2>Progress, at a glance</h2></div><span className="outline-icon"><BarChart3 size={18} /></span></div>
            <div className="progress-numbers">
              <div><span>TESTS TAKEN</span><strong>{history.length}</strong></div>
              <div><span>PERSONAL BEST</span><strong>{best}<small> WPM</small></strong></div>
              <div><span>LAST RESULT</span><strong>{history[0] ? `${history[0].wpm}` : "—"}<small>{history[0] ? " WPM" : ""}</small></strong></div>
            </div>
            {history.length > 0 ? (
              <div className="history-list">
                {history.slice(0, 4).map((item, index) => <div className="history-row" key={item.date}><span className="history-index">{String(index + 1).padStart(2, "0")}</span><span className="history-date">{new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span><span className="history-accuracy">{item.accuracy}% acc.</span><strong>{item.wpm} <small>WPM</small></strong></div>)}
              </div>
            ) : <div className="empty-history"><span className="empty-history-icon"><BarChart3 size={20} /></span><p>Your first test is the start of your progress story.</p><small>Complete a session and your result will appear here.</small></div>}
          </div>
          <aside className="tip-card" id="tips">
            <div className="tip-top"><span className="tip-icon"><Target size={18} /></span><span className="section-kicker">A SMALL REMINDER</span></div>
            <h2>Accuracy builds speed.</h2>
            <p>It is tempting to race the clock. Instead, find a steady rhythm and aim for clean keystrokes. Speed follows consistency.</p>
            <div className="tip-rule" />
            <div className="tip-bottom"><span><Check size={15} /> Relax your hands</span><span><Check size={15} /> Look ahead, not down</span><span><Check size={15} /> Practice a little daily</span></div>
          </aside>
        </section>

        <section className="cta-strip">
          <div className="cta-symbol"><Keyboard size={23} /></div>
          <div><h3>Ready for one more round?</h3><p>Every session is a chance to get a little better.</p></div>
          <button onClick={() => { resetTest(); document.getElementById("test")?.scrollIntoView({ behavior: "smooth" }); }}>Start a fresh test <ArrowRight size={16} /></button>
        </section>
      </main>
      <footer><a className="footer-brand" href="#top">keysprint<span>.</span></a><span>Built for focus. Made for progress.</span><span>© {new Date().getFullYear()} KeySprint</span></footer>
    </div>
  );
}

export default App;