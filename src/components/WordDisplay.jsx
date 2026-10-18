import { useEffect, useRef, useState, useLayoutEffect } from 'react';

const DIRS = [
  [-20, -24], [0, -30], [20, -24],
  [-28, -6],  [28, -6],
  [-20,  20], [0,  28], [20,  20],
];

function ParticleBurst() {
  return (
    <>
      {DIRS.map(([dx, dy], i) => (
        <span
          key={i}
          className="particle"
          style={{
            '--dx': `${dx}px`,
            '--dy': `${dy}px`,
            background: i % 3 === 0 ? '#FFB000' : i % 3 === 1 ? '#FFD060' : '#FF8800',
          }}
        />
      ))}
    </>
  );
}

function CharSpan({ ch, state, isCursor }) {
  const isCorrect = state === 'correct';
  const isWrong   = state === 'incorrect';

  let color      = '#78716c'; // untyped: muted gray-beige
  if (isCorrect) color = '#FFB000';
  if (isWrong)   color = '#ef4444';

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {isCursor && (
        <span
          className="cursor-blink"
          style={{
            position: 'absolute',
            inset: '2px 0',
            background: '#FFB000',
            zIndex: 1,
            minWidth: '0.55em',
          }}
        />
      )}
      <span style={{
        position: 'relative',
        zIndex: 2,
        color: isCursor ? '#1c1917' : color,
        textShadow: (isCorrect && !isCursor) ? '0 0 8px #FFB00050' : 'none',
        textDecoration: (isWrong && !isCursor) ? 'underline' : 'none',
        textDecorationColor: '#ef4444',
        textDecorationThickness: '2px',
        transition: 'color 0.07s',
      }}>
        {ch}
      </span>
    </span>
  );
}

export default function WordDisplay({ words, wordIndex, charStates, typed, perfectWordIdx }) {
  const wordRefs   = useRef({});
  const scrollYRef = useRef(0);
  const [scrollY,  setScrollY]  = useState(0);
  const [animated, setAnimated] = useState(false);
  const [lineH,    setLineH]    = useState(52); // fallback; refined below

  // Measure real line-height and reset scroll whenever words change (on every reset)
  useLayoutEffect(() => {
    scrollYRef.current = 0;
    setScrollY(0);
    setAnimated(false);

    const firstEl = wordRefs.current[0];
    if (!firstEl) return;
    for (let i = 1; i < Math.min(words.length, 40); i++) {
      const el = wordRefs.current[i];
      if (el && el.offsetTop > firstEl.offsetTop) {
        setLineH(el.offsetTop - firstEl.offsetTop);
        break;
      }
    }
  }, [words]);

  // Scroll to keep active word on the first visible line, snapping by full lines
  useEffect(() => {
    const activeEl = wordRefs.current[wordIndex];
    if (!activeEl) return;
    const target = activeEl.offsetTop; // relative to the inner positioned div
    if (target !== scrollYRef.current) {
      scrollYRef.current = target;
      setScrollY(target);
      setAnimated(true);
    }
  }, [wordIndex]);

  // Container shows exactly 3 full lines
  const containerH = lineH * 3;

  return (
    <div style={{
      height: `${containerH}px`,
      overflow: 'hidden',
      userSelect: 'none',
    }}>
      {/*
        position:relative makes this the offsetParent for word spans,
        so offsetTop values are relative to this div (not the window).
        transform:translateY scrolls the lines vertically.
      */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        rowGap: '10px',
        columnGap: '14px',
        fontSize: '22px',
        lineHeight: 1.65,
        position: 'relative',
        transform: `translateY(-${scrollY}px)`,
        transition: animated ? 'transform 0.18s ease' : 'none',
      }}>
        {words.map((word, wi) => {
          const isActive = wi === wordIndex;
          const isDone   = wi < wordIndex;
          const states   = charStates[wi];
          const isBurst  = perfectWordIdx === wi;

          return (
            <span
              key={wi}
              ref={el => { wordRefs.current[wi] = el; }}
              style={{
                display: 'inline-flex',
                position: 'relative',
                borderRadius: '3px',
                padding: '1px 3px',
                // Subtle amber highlight behind the current word
                background: isActive ? 'rgba(255, 176, 0, 0.07)' : 'transparent',
                transition: 'background 0.12s',
              }}
            >
              {isBurst && <ParticleBurst />}

              {Array.from(word).map((ch, ci) => {
                let state = null;
                if (isDone && states)   state = states[ci]?.state ?? 'incorrect';
                if (isActive && ci < typed.length)
                  state = typed[ci] === ch ? 'correct' : 'incorrect';
                return (
                  <CharSpan
                    key={ci}
                    ch={ch}
                    state={state}
                    isCursor={isActive && ci === typed.length}
                  />
                );
              })}

              {/* End-of-word cursor */}
              {isActive && typed.length >= word.length && (
                <span style={{ position: 'relative', display: 'inline-block', minWidth: '0.55em' }}>
                  <span className="cursor-blink" style={{
                    position: 'absolute', inset: '2px 0',
                    background: '#FFB000', zIndex: 1,
                  }} />
                </span>
              )}

              {/* Overflow chars: typed past word length */}
              {isActive && typed.length > word.length &&
                Array.from(typed.slice(word.length)).map((ch, ei) => (
                  <span key={`x${ei}`} style={{
                    color: '#7f1d1d',
                    textDecoration: 'underline',
                    textDecorationColor: '#ef4444',
                    textDecorationThickness: '2px',
                  }}>
                    {ch}
                  </span>
                ))}
            </span>
          );
        })}
      </div>
    </div>
  );
}
