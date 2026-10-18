const ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m'],
];

const ROW_OFFSETS = ['0px', '22px', '44px'];

function Key({ k, lastKey, nextKey }) {
  const isActive = lastKey && lastKey.key === k;
  const isNext = !isActive && nextKey === k;

  let bg = '#231f1b';
  let border = '#3d3028';
  let color = '#9a7040';
  let shadow = 'none';

  if (isActive) {
    if (lastKey.correct) {
      bg = '#5a3a00';
      border = '#FFB000';
      color = '#FFB000';
      shadow = '0 0 14px #FFB00066';
    } else {
      bg = '#4a1400';
      border = '#FF4500';
      color = '#FF4500';
      shadow = '0 0 14px #FF450066';
    }
  }

  return (
    <div
      className={isNext ? 'key-next' : ''}
      style={{
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        border: `1px solid ${isNext ? '#FFB000aa' : border}`,
        borderRadius: '4px',
        color: isNext ? '#FFB000cc' : color,
        fontSize: '12px',
        fontFamily: 'inherit',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        flexShrink: 0,
        boxShadow: isActive ? shadow : isNext ? '0 0 6px #FFB00030' : 'none',
        transition: 'background 0.08s, border-color 0.08s, color 0.08s, box-shadow 0.08s',
        userSelect: 'none',
      }}
    >
      {k}
    </div>
  );
}

export default function LiveKeyboard({ lastKey, nextKey }) {
  const isSpaceActive = lastKey && lastKey.key === ' ';
  const isSpaceNext = !isSpaceActive && nextKey === ' ';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      padding: '16px 20px',
      background: '#1e1a17',
      border: '1px solid #3a2e22',
      borderRadius: '10px',
      boxShadow: 'inset 0 1px 0 rgba(255,176,0,0.04)',
    }}>
      {ROWS.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: '5px', marginLeft: ROW_OFFSETS[ri] }}>
          {row.map(k => (
            <Key key={k} k={k} lastKey={lastKey} nextKey={nextKey} />
          ))}
        </div>
      ))}

      {/* Spacebar */}
      <div
        className={isSpaceNext ? 'key-next' : ''}
        style={{
          width: '200px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '2px',
          background: isSpaceActive
            ? (lastKey.correct ? '#5a3a00' : '#4a1400')
            : '#231f1b',
          border: `1px solid ${
            isSpaceActive
              ? (lastKey.correct ? '#FFB000' : '#FF4500')
              : isSpaceNext ? '#FFB000aa' : '#3d3028'
          }`,
          borderRadius: '4px',
          boxShadow: isSpaceActive
            ? (lastKey.correct ? '0 0 14px #FFB00066' : '0 0 14px #FF450066')
            : isSpaceNext ? '0 0 6px #FFB00030' : 'none',
          transition: 'background 0.08s, border-color 0.08s, box-shadow 0.08s',
          userSelect: 'none',
        }}
      />
    </div>
  );
}
