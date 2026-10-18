import { useEffect, useRef, useState } from 'react';

function StatItem({ label, value, valueColor }) {
  return (
    <div style={{ textAlign: 'center', minWidth: '80px' }}>
      <div style={{
        fontSize: '28px',
        fontWeight: '700',
        letterSpacing: '-1px',
        lineHeight: 1,
        color: valueColor || '#FFB000',
        textShadow: `0 0 14px ${valueColor || '#FFB000'}55`,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '10px',
        color: '#7a5828',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginTop: '4px',
      }}>
        {label}
      </div>
    </div>
  );
}

export default function LiveStats({ wpm, accuracy, streak }) {
  const prevStreakRef = useRef(streak);
  const [popKey, setPopKey] = useState(0);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    const prev = prevStreakRef.current;
    prevStreakRef.current = streak;
    if (streak > 0 && streak % 10 === 0 && streak > prev) {
      setPopKey(k => k + 1);
      setPopping(true);
      const t = setTimeout(() => setPopping(false), 500);
      return () => clearTimeout(t);
    }
  }, [streak]);

  const streakColor = streak >= 20 ? '#FF6B00' : streak >= 10 ? '#FFB000' : '#c08030';

  const divider = (
    <div style={{ width: '1px', height: '32px', background: '#3a2a18', alignSelf: 'center' }} />
  );

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      padding: '12px 28px',
      background: '#241f1b',
      border: '1px solid #4a3828',
      borderRadius: '8px',
      boxShadow: '0 0 20px #FFB00010',
    }}>
      <StatItem label="wpm" value={wpm} />
      {divider}
      <StatItem label="acc" value={`${accuracy}%`} valueColor={accuracy >= 95 ? '#FFB000' : accuracy >= 80 ? '#cc8800' : '#FF4500'} />
      {divider}
      <div style={{ textAlign: 'center', minWidth: '80px' }}>
        <div
          key={popKey}
          className={popping ? 'streak-pop' : ''}
          style={{
            fontSize: '28px',
            fontWeight: '700',
            letterSpacing: '-1px',
            lineHeight: 1,
            color: streakColor,
            textShadow: `0 0 14px ${streakColor}66`,
          }}
        >
          {streak}
        </div>
        <div style={{
          fontSize: '10px',
          color: '#7a5828',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginTop: '4px',
        }}>
          streak
        </div>
      </div>
    </div>
  );
}
