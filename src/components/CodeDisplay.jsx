import { useMemo, useEffect, useRef, useState, useLayoutEffect } from 'react';

const C = {
  untyped:   '#78716c', // muted gray-beige, no glow
  correct:   '#FFB000', // bright amber
  incorrect: '#ef4444', // bright red
  skipped:   '#5a4020', // auto-indented: dim amber-brown
  cursorBg:  '#FFB000',
  cursorFg:  '#1c1917',
};

function BlockChar({ ch, state, isCursor }) {
  const isCorrect = state === 'correct';
  const isWrong   = state === 'incorrect';

  const color =
    isCorrect             ? C.correct :
    isWrong               ? C.incorrect :
    state === 'skipped'   ? C.skipped :
    C.untyped;

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {isCursor && (
        <span
          className="cursor-blink"
          style={{
            position: 'absolute',
            inset: '1px 0 1px',
            background: C.cursorBg,
            zIndex: 1,
            minWidth: '0.55em',
          }}
        />
      )}
      <span style={{
        position: 'relative',
        zIndex: 2,
        color: isCursor ? C.cursorFg : color,
        textShadow: (isCorrect && !isCursor) ? '0 0 8px #FFB00050' : 'none',
        textDecoration: (isWrong && !isCursor) ? 'underline' : 'none',
        textDecorationColor: '#ef4444',
        textDecorationThickness: '2px',
        transition: 'color 0.07s',
      }}>
        {ch === ' ' ? ' ' : ch}
      </span>
    </span>
  );
}

export default function CodeDisplay({ snippetChars, charIndex, codeCharStates }) {
  const lineRefs   = useRef({});
  const scrollYRef = useRef(0);
  const [scrollY,  setScrollY]  = useState(0);
  const [animated, setAnimated] = useState(false);
  const [lineH,    setLineH]    = useState(36); // refined after first render

  // Split flat char array into lines with metadata
  const { lines, currentLineIdx } = useMemo(() => {
    const ls = [{ chars: [], newlineIdx: null }];
    const nlIdxs = [];

    snippetChars.forEach((ch, i) => {
      if (ch === '\n') {
        ls[ls.length - 1].newlineIdx = i;
        nlIdxs.push(i);
        ls.push({ chars: [], newlineIdx: null });
      } else {
        ls[ls.length - 1].chars.push({ ch, globalIdx: i });
      }
    });

    let cur = 0;
    for (let i = 0; i < nlIdxs.length; i++) {
      if (charIndex > nlIdxs[i]) cur = i + 1;
      else break;
    }

    return { lines: ls, currentLineIdx: cur };
  }, [snippetChars, charIndex]);

  // Reset scroll and re-measure line height when a new snippet loads
  useLayoutEffect(() => {
    scrollYRef.current = 0;
    setScrollY(0);
    setAnimated(false);

    const el = lineRefs.current[0];
    if (el && el.offsetHeight > 0) setLineH(el.offsetHeight);
  }, [snippetChars]);

  // Scroll current line to the top of the visible area
  useEffect(() => {
    const el = lineRefs.current[currentLineIdx];
    if (!el) return;
    const target = el.offsetTop;
    if (target !== scrollYRef.current) {
      scrollYRef.current = target;
      setScrollY(target);
      setAnimated(true);
    }
  }, [currentLineIdx]);

  if (snippetChars.length === 0) return null;

  const containerH = lineH * 3;

  return (
    <div style={{
      height: `${containerH}px`,
      overflow: 'hidden',
      userSelect: 'none',
      position: 'relative',
    }}>
      {/*
        position:relative → inner div is offsetParent for line divs,
        so offsetTop values are relative to this div (stable across scrolls).
        transform:translateY drives the scroll without native scrollTo.
      */}
      <div style={{
        fontSize: '17px',
        lineHeight: '2',
        fontFamily: 'inherit',
        position: 'relative',
        transform: `translateY(-${scrollY}px)`,
        transition: animated ? 'transform 0.18s ease' : 'none',
      }}>
        {lines.map((line, li) => {
          const isEnterCursor = line.newlineIdx !== null && charIndex === line.newlineIdx;
          return (
            <div
              key={li}
              ref={el => { lineRefs.current[li] = el; }}
              style={{ display: 'flex', flexWrap: 'nowrap', minHeight: '2em' }}
            >
              {line.chars.map(({ ch, globalIdx }) => (
                <BlockChar
                  key={globalIdx}
                  ch={ch}
                  state={codeCharStates[globalIdx]}
                  isCursor={globalIdx === charIndex}
                />
              ))}

              {/* Enter-key cursor: shown at end of line when \n is next */}
              {isEnterCursor && (
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <span
                    className="cursor-blink"
                    style={{
                      position: 'absolute',
                      inset: '1px 0 1px',
                      background: C.cursorBg,
                      zIndex: 1,
                      minWidth: '0.55em',
                    }}
                  />
                  <span style={{ position: 'relative', zIndex: 2, color: C.cursorFg, opacity: 0.7 }}>↵</span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
