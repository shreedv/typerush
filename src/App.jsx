import { useTypingTest } from './hooks/useTypingTest';
import ModeSelector from './components/ModeSelector';
import Timer from './components/Timer';
import WordDisplay from './components/WordDisplay';
import CodeDisplay from './components/CodeDisplay';
import Results from './components/Results';
import LiveStats from './components/LiveStats';
import LiveKeyboard from './components/LiveKeyboard';

// Animated dot grid background
function BackgroundGrid() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,176,0,0.08) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        animation: 'grid-drift 20s linear infinite',
      }}
    />
  );
}

// CRT scanline overlay
function Scanlines() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        background:
          'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)',
      }}
    />
  );
}

// Terminal prompt title with blinking block cursor
function TerminalTitle() {
  return (
    <span style={{
      fontSize: '20px',
      fontWeight: '700',
      fontFamily: 'inherit',
      color: '#FFB000',
      textShadow: '0 0 18px #FFB00070',
      letterSpacing: '0.02em',
      flexShrink: 0,
    }}>
      &gt;{' '}
      <span>typerush</span>
      <span
        className="cursor-blink"
        style={{
          display: 'inline-block',
          width: '0.6em',
          background: '#FFB000',
          height: '1.1em',
          verticalAlign: 'text-bottom',
          marginLeft: '1px',
        }}
      />
    </span>
  );
}

export default function App() {
  const {
    timeMode, changeTimeMode,
    testType, changeTestType,
    language, changeLanguage,
    words, typed, wordIndex, charStates,
    snippetChars, charIndex, codeCharStates,
    timeLeft, started, finished,
    wpmHistory, correctChars, incorrectChars,
    accuracy, currentWPM, bestScores, mistypeMap,
    streak, perfectWordIdx, lastKey, nextKey,
    handleWordInput, reset, inputRef,
  } = useTypingTest();

  const finalWPM = finished
    ? Math.round((correctChars / 5) / (timeMode / 60))
    : currentWPM;

  return (
    <>
      <BackgroundGrid />
      <Scanlines />

      <div style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Header */}
        <header style={{
          width: '100%',
          maxWidth: '900px',
          padding: '24px 24px 0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <TerminalTitle />
          <ModeSelector
            testType={testType} onChangeTestType={changeTestType}
            timeMode={timeMode} onChangeTimeMode={changeTimeMode}
            language={language} onChangeLanguage={changeLanguage}
            disabled={started && !finished}
          />
        </header>

        {/* Divider */}
        <div style={{
          width: '100%', maxWidth: '900px',
          height: '1px', background: '#3a2e22',
          margin: '20px 0 0',
        }} />

        {/* Main */}
        <main style={{
          flex: 1,
          width: '100%',
          maxWidth: '900px',
          padding: '28px 24px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {!finished ? (
            <>
              {/* Timer row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Timer timeLeft={timeLeft} mode={timeMode} started={started} />
              </div>

              {/* Live stats — visible once typing starts */}
              {started && (
                <LiveStats wpm={currentWPM} accuracy={accuracy} streak={streak} />
              )}

              {/* Typing area card */}
              <div
                style={{
                  background: '#241f1b',
                  border: '1px solid #4a3828',
                  borderRadius: '10px',
                  padding: '24px 28px',
                  cursor: 'text',
                  position: 'relative',
                  boxShadow: '0 0 32px #FFB00012, inset 0 1px 0 rgba(255,176,0,0.06)',
                }}
                onClick={() => {
                  if (testType === 'words') inputRef.current?.focus();
                }}
              >
                {/* Language badge */}
                {testType === 'code' && (
                  <div style={{
                    position: 'absolute', top: '10px', right: '14px',
                    fontSize: '10px', color: '#7a5828',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>
                    {{ javascript: 'JS', python: 'Python', cpp: 'C++' }[language]}
                  </div>
                )}

                {testType === 'words' ? (
                  <WordDisplay
                    words={words}
                    wordIndex={wordIndex}
                    charStates={charStates}
                    typed={typed}
                    perfectWordIdx={perfectWordIdx}
                  />
                ) : (
                  <CodeDisplay
                    snippetChars={snippetChars}
                    charIndex={charIndex}
                    codeCharStates={codeCharStates}
                  />
                )}
              </div>

              {/* Hidden input for words mode */}
              {testType === 'words' && (
                <input
                  ref={inputRef}
                  value={typed}
                  onChange={e => handleWordInput(e.target.value)}
                  disabled={finished}
                  autoFocus
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  spellCheck="false"
                  style={{
                    position: 'absolute', opacity: 0,
                    pointerEvents: 'none', width: '1px', height: '1px',
                  }}
                />
              )}

              {/* Live keyboard */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <LiveKeyboard lastKey={lastKey} nextKey={nextKey} />
              </div>

              {/* Start hint */}
              {!started && (
                <div className="fade-in" style={{
                  textAlign: 'center', fontSize: '12px', color: '#6a4e28',
                  letterSpacing: '0.05em',
                }}>
                  {testType === 'code'
                    ? 'type to begin · Enter for newlines · indentation auto-skipped · Tab to restart'
                    : 'type to begin · Space to advance words · Tab to restart'}
                </div>
              )}
            </>
          ) : (
            <Results
              wpm={finalWPM}
              accuracy={accuracy}
              correctChars={correctChars}
              incorrectChars={incorrectChars}
              wpmHistory={wpmHistory}
              timeMode={timeMode}
              testType={testType}
              bestScore={bestScores[`${testType}_${timeMode}`]}
              mistypeMap={mistypeMap}
              onRestart={() => reset()}
            />
          )}
        </main>

        {/* Footer: best scores card */}
        <footer style={{ width: '100%', maxWidth: '900px', padding: '0 24px 32px' }}>
          <div style={{
            background: '#241f1b',
            border: '1px solid #3a2e22',
            borderRadius: '8px',
            padding: '14px 24px',
            display: 'flex',
            gap: '8px 20px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '10px', color: '#6a4e28', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              best scores
            </span>
            {['words', 'code'].flatMap(tt =>
              [15, 30, 60].map(m => (
                <div key={`${tt}_${m}`} style={{ textAlign: 'center', padding: '2px 0' }}>
                  <div style={{ fontSize: '17px', fontWeight: '700', color: '#FFB000', lineHeight: 1, textShadow: '0 0 8px #FFB00040' }}>
                    {bestScores[`${tt}_${m}`] || '—'}
                  </div>
                  <div style={{ fontSize: '9px', color: '#5a4020', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>
                    {tt}/{m}s
                  </div>
                </div>
              ))
            )}
          </div>
        </footer>
      </div>
    </>
  );
}
