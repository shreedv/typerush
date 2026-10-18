import StatsChart from './StatsChart';
import KeyboardHeatmap from './KeyboardHeatmap';

function Stat({ label, value, sub, accent }) {
  return (
    <div style={{
      background: '#241f1b',
      border: '1px solid #4a3828',
      borderRadius: '8px',
      padding: '16px 20px',
      minWidth: '100px',
      textAlign: 'center',
      boxShadow: accent ? '0 0 20px #FFB00015' : 'none',
    }}>
      <div style={{
        fontSize: '36px',
        fontWeight: '700',
        letterSpacing: '-1px',
        lineHeight: 1,
        color: accent ? '#FFB000' : '#cc8800',
        textShadow: accent ? '0 0 16px #FFB00060' : 'none',
      }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '11px', color: '#7a5828', marginTop: '2px' }}>{sub}</div>}
      <div style={{
        fontSize: '11px', color: '#7a5828', marginTop: '6px',
        textTransform: 'uppercase', letterSpacing: '0.1em',
      }}>
        {label}
      </div>
    </div>
  );
}

export default function Results({
  wpm, accuracy, correctChars, incorrectChars,
  wpmHistory, timeMode, testType, bestScore,
  mistypeMap, onRestart,
}) {
  const isNewBest = wpm > 0 && wpm >= (bestScore || 0);

  return (
    <div className="fade-in" style={{ width: '100%' }}>
      {isNewBest && wpm > 0 && (
        <div style={{
          marginBottom: '20px',
          padding: '8px 20px',
          border: '1px solid #FFB00055',
          borderRadius: '6px',
          color: '#FFB000',
          fontSize: '13px',
          fontWeight: '600',
          textAlign: 'center',
          textShadow: '0 0 12px #FFB00070',
          boxShadow: '0 0 16px #FFB00015',
        }}>
          &gt; new best for {timeMode}s {testType} mode
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
        <Stat label="WPM" value={wpm} accent />
        <Stat label="Accuracy" value={`${accuracy}%`} />
        <Stat label="Correct" value={correctChars} sub="chars" />
        <Stat label="Incorrect" value={incorrectChars} sub="chars" />
        <Stat label="Best" value={bestScore || '—'} sub={`${timeMode}s`} />
      </div>

      {/* WPM chart */}
      <div style={{
        background: '#241f1b',
        border: '1px solid #4a3828',
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '20px',
      }}>
        <div style={{ fontSize: '11px', color: '#9a7040', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          wpm / time
        </div>
        <StatsChart data={wpmHistory} />
      </div>

      {/* Keyboard heatmap */}
      <div style={{
        background: '#241f1b',
        border: '1px solid #4a3828',
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '24px',
      }}>
        <div style={{ fontSize: '11px', color: '#9a7040', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          error heatmap
        </div>
        <KeyboardHeatmap mistypeMap={mistypeMap} />
      </div>

      {/* Restart */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onRestart}
          style={{
            padding: '10px 36px',
            background: 'transparent',
            color: '#FFB000',
            border: '1px solid #FFB000',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            fontWeight: '600',
            cursor: 'pointer',
            letterSpacing: '0.05em',
            textShadow: '0 0 10px #FFB00060',
            boxShadow: '0 0 12px #FFB00025',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#FFB00018';
            e.currentTarget.style.boxShadow = '0 0 24px #FFB00050';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.boxShadow = '0 0 12px #FFB00025';
          }}
        >
          restart
        </button>
        <div style={{ marginTop: '10px', fontSize: '11px', color: '#5a4020' }}>
          or press{' '}
          <kbd style={{ background: '#241f1b', border: '1px solid #4a3828', padding: '1px 5px', borderRadius: '3px', fontSize: '10px', color: '#9a7040' }}>
            Tab
          </kbd>
        </div>
      </div>
    </div>
  );
}
