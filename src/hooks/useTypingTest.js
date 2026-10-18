import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { generateWords } from '../words';
import { generateCodeChars } from '../snippets';

function calcWPM(correctChars, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0;
  return Math.round((correctChars / 5) / (elapsedSeconds / 60));
}

function getBestKey(testType, timeMode) {
  return `typerush_best_${testType}_${timeMode}`;
}

function loadBestScores() {
  const out = {};
  for (const tt of ['words', 'code']) {
    for (const m of [15, 30, 60]) {
      const v = localStorage.getItem(getBestKey(tt, m));
      out[`${tt}_${m}`] = v ? parseInt(v, 10) : 0;
    }
  }
  return out;
}

export function useTypingTest() {
  // ── Refs (declared before state to allow sync in lazy initializers) ─────
  const wordsRef = useRef([]);
  const typedRef = useRef('');
  const wordIndexRef = useRef(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const wpmTickRef = useRef(null);
  const inputRef = useRef(null);
  const correctCharsRef = useRef(0);
  const charIndexRef = useRef(0);
  const snippetCharsRef = useRef([]);
  const codeCharStatesRef = useRef([]);
  const finishedRef = useRef(false);
  const startedRef = useRef(false);
  const timeModeRef = useRef(30);
  const testTypeRef = useRef('words');
  const languageRef = useRef('javascript');
  const lastKeyTimerRef = useRef(null);

  // ── Config ───────────────────────────────────────────────────────────────
  const [timeMode, setTimeMode] = useState(30);
  const [testType, setTestType] = useState('words');
  const [language, setLanguage] = useState('javascript');

  // ── Words mode ────────────────────────────────────────────────────────────
  const [words, setWords] = useState(() => {
    const w = generateWords(80);
    wordsRef.current = w;
    return w;
  });
  const [typed, setTyped] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charStates, setCharStates] = useState([]);

  // ── Code mode ─────────────────────────────────────────────────────────────
  const [snippetChars, setSnippetChars] = useState([]);
  const [charIndex, setCharIndex] = useState(0);
  const [codeCharStates, setCodeCharStates] = useState([]);

  // ── Shared ────────────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [wpmHistory, setWpmHistory] = useState([]);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [mistypeMap, setMistypeMap] = useState({});
  const [bestScores, setBestScores] = useState(loadBestScores);

  // ── Liveness: streak, particles, keyboard ────────────────────────────────
  const [streak, setStreak] = useState(0);
  const [perfectWordIdx, setPerfectWordIdx] = useState(null);
  const [lastKey, setLastKey] = useState(null); // { key: string, correct: bool }

  // ── Auto-clear perfectWordIdx after particle burst ────────────────────────
  useEffect(() => {
    if (perfectWordIdx === null) return;
    const t = setTimeout(() => setPerfectWordIdx(null), 700);
    return () => clearTimeout(t);
  }, [perfectWordIdx]);

  // ── Timer ─────────────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(wpmTickRef.current);
          finishedRef.current = true;
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    wpmTickRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setWpmHistory(prev => [
        ...prev,
        { time: Math.round(elapsed), wpm: calcWPM(correctCharsRef.current, elapsed) },
      ]);
    }, 1000);
  }, []);

  // ── Mistype tracking ───────────────────────────────────────────────────────
  const recordMistype = useCallback((ch) => {
    const k = (ch || '').toLowerCase();
    if (/[a-z]/.test(k)) {
      setMistypeMap(prev => ({ ...prev, [k]: (prev[k] || 0) + 1 }));
    }
  }, []);

  // ── Last-key flash (auto-clears after 400ms) ──────────────────────────────
  const updateLastKey = useCallback((key, correct) => {
    clearTimeout(lastKeyTimerRef.current);
    setLastKey({ key, correct });
    lastKeyTimerRef.current = setTimeout(() => setLastKey(null), 400);
  }, []);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const reset = useCallback((opts = {}) => {
    const m = opts.timeMode !== undefined ? opts.timeMode : timeModeRef.current;
    const tt = opts.testType !== undefined ? opts.testType : testTypeRef.current;
    const lang = opts.language !== undefined ? opts.language : languageRef.current;

    clearInterval(timerRef.current);
    clearInterval(wpmTickRef.current);
    clearTimeout(lastKeyTimerRef.current);

    setTimeLeft(m);
    setStarted(false);
    setFinished(false);
    setWpmHistory([]);
    setCorrectChars(0);
    setIncorrectChars(0);
    setMistypeMap({});
    setStreak(0);
    setPerfectWordIdx(null);
    setLastKey(null);
    correctCharsRef.current = 0;
    startTimeRef.current = null;
    startedRef.current = false;
    finishedRef.current = false;
    typedRef.current = '';
    wordIndexRef.current = 0;

    if (tt === 'words') {
      const w = generateWords(80);
      wordsRef.current = w;
      setWords(w);
      setTyped('');
      setWordIndex(0);
      setCharStates([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      const chars = generateCodeChars(lang);
      snippetCharsRef.current = chars;
      codeCharStatesRef.current = new Array(chars.length).fill(null);
      charIndexRef.current = 0;
      setSnippetChars(chars);
      setCodeCharStates(new Array(chars.length).fill(null));
      setCharIndex(0);
    }
  }, []);

  // ── Config changers ────────────────────────────────────────────────────────
  const changeTimeMode = useCallback((m) => {
    timeModeRef.current = m;
    setTimeMode(m);
    reset({ timeMode: m });
  }, [reset]);

  const changeTestType = useCallback((tt) => {
    testTypeRef.current = tt;
    setTestType(tt);
    reset({ testType: tt });
  }, [reset]);

  const changeLanguage = useCallback((lang) => {
    languageRef.current = lang;
    setLanguage(lang);
    reset({ language: lang });
  }, [reset]);

  // ── Words mode input handler ──────────────────────────────────────────────
  const handleWordInput = useCallback((value) => {
    if (finishedRef.current) return;
    if (!startedRef.current && value.length > 0) startTimer();

    if (value.endsWith(' ')) {
      const attempt = value.trimEnd();
      const target = words[wordIndex];

      const states = Array.from(target).map((ch, i) => ({
        char: ch,
        state: attempt[i] === ch ? 'correct' : 'incorrect',
      }));

      let cc = 0;
      let ic = 0;
      states.forEach((s, i) => {
        if (s.state === 'correct') cc++;
        else { ic++; recordMistype(target[i]); }
      });
      if (attempt.length > target.length) ic += attempt.length - target.length;

      const allCorrect = states.every(s => s.state === 'correct') && attempt.length === target.length;
      if (allCorrect) {
        setStreak(prev => prev + 1);
        setPerfectWordIdx(wordIndex);
      } else {
        setStreak(0);
      }

      setCharStates(prev => { const n = [...prev]; n[wordIndex] = states; return n; });
      correctCharsRef.current += cc;
      setCorrectChars(prev => prev + cc);
      setIncorrectChars(prev => prev + ic);
      setWordIndex(prev => {
        const next = prev + 1;
        wordIndexRef.current = next;
        return next;
      });
      typedRef.current = '';
      setTyped('');
    } else {
      typedRef.current = value;
      setTyped(value);
    }
  }, [words, wordIndex, startTimer, recordMistype]);

  // ── Code mode key handler ─────────────────────────────────────────────────
  const handleCodeKey = useCallback((e) => {
    if (finishedRef.current) return;

    const chars = snippetCharsRef.current;
    const idx = charIndexRef.current;
    if (idx >= chars.length) return;

    const expected = chars[idx];

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (idx === 0) return;
      let newIdx = idx - 1;
      while (newIdx > 0 && codeCharStatesRef.current[newIdx] === 'skipped') {
        codeCharStatesRef.current[newIdx] = null;
        newIdx--;
      }
      if (codeCharStatesRef.current[newIdx] === 'skipped') {
        codeCharStatesRef.current[newIdx] = null;
        newIdx = Math.max(0, newIdx - 1);
      }
      codeCharStatesRef.current[newIdx] = null;
      charIndexRef.current = newIdx;
      setCharIndex(newIdx);
      setCodeCharStates([...codeCharStatesRef.current]);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (!startedRef.current) startTimer();
      updateLastKey('enter', expected === '\n');
      if (expected === '\n') {
        codeCharStatesRef.current[idx] = 'correct';
        let newIdx = idx + 1;
        let skipped = 0;
        while (newIdx < chars.length && (chars[newIdx] === ' ' || chars[newIdx] === '\t')) {
          codeCharStatesRef.current[newIdx] = 'skipped';
          skipped++;
          newIdx++;
        }
        correctCharsRef.current += 1 + skipped;
        setCorrectChars(prev => prev + 1 + skipped);
        charIndexRef.current = newIdx;
        setCharIndex(newIdx);
      } else {
        codeCharStatesRef.current[idx] = 'incorrect';
        recordMistype(expected);
        setIncorrectChars(prev => prev + 1);
        charIndexRef.current = idx + 1;
        setCharIndex(idx + 1);
      }
      setCodeCharStates([...codeCharStatesRef.current]);
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      if (!startedRef.current) startTimer();
      const correct = e.key === expected;
      updateLastKey(e.key.toLowerCase(), correct);
      if (correct) {
        codeCharStatesRef.current[idx] = 'correct';
        correctCharsRef.current++;
        setCorrectChars(prev => prev + 1);
      } else {
        codeCharStatesRef.current[idx] = 'incorrect';
        recordMistype(expected);
        setIncorrectChars(prev => prev + 1);
      }
      charIndexRef.current = idx + 1;
      setCharIndex(idx + 1);
      setCodeCharStates([...codeCharStatesRef.current]);
    }
  }, [startTimer, recordMistype, updateLastKey]);

  // ── Global keydown (Tab = restart; words key tracking; code routing) ──────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Tab') { e.preventDefault(); reset(); return; }

      if (testTypeRef.current === 'code') {
        handleCodeKey(e);
      } else if (!finishedRef.current && e.key.length === 1) {
        // Flash keyboard for words mode on keydown (before onChange fires)
        if (e.key === ' ') {
          updateLastKey(' ', true);
        } else {
          const word = wordsRef.current[wordIndexRef.current] || '';
          const pos = typedRef.current.length;
          updateLastKey(e.key.toLowerCase(), e.key === word[pos]);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reset, handleCodeKey, updateLastKey]);

  // ── Save best score on finish ──────────────────────────────────────────────
  useEffect(() => {
    if (!finished) return;
    const elapsed = timeModeRef.current - timeLeft;
    const wpm = calcWPM(correctChars, elapsed > 0 ? elapsed : timeModeRef.current);
    const key = getBestKey(testTypeRef.current, timeModeRef.current);
    const prev = parseInt(localStorage.getItem(key) || '0', 10);
    if (wpm > prev) {
      localStorage.setItem(key, wpm);
      const scoreKey = `${testTypeRef.current}_${timeModeRef.current}`;
      setBestScores(s => ({ ...s, [scoreKey]: wpm }));
    }
  }, [finished]);

  // ── Cleanup ────────────────────────────────────────────────────────────────
  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearInterval(wpmTickRef.current);
    clearTimeout(lastKeyTimerRef.current);
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const elapsed = started ? timeMode - timeLeft : 0;
  const totalTyped = correctChars + incorrectChars;
  const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
  const currentWPM = started && elapsed > 0 ? calcWPM(correctChars, elapsed) : 0;

  const nextKey = useMemo(() => {
    if (finished || !started) return null;
    if (testType === 'words') {
      const word = words[wordIndex] || '';
      if (typed.length >= word.length) return ' ';
      const ch = word[typed.length];
      return ch ? ch.toLowerCase() : null;
    }
    const ch = snippetChars[charIndex];
    if (!ch || ch === '\n' || ch === '\t') return null;
    return ch === ' ' ? ' ' : ch.toLowerCase();
  }, [finished, started, testType, words, wordIndex, typed, snippetChars, charIndex]);

  return {
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
  };
}
