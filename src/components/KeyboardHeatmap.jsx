const ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m'],
];

const ROW_OFFSETS = ['0px', '18px', '36px'];

function keyColor(count, max) {
  if (!count || max === 0) {
    return { bg: '#1e1a17', border: '#3a2e22', text: '#6a5030' };
  }
  const t = Math.min(count / max, 1);
  if (t < 0.34) {
    return { bg: '#2a1e0e', border: '#FFB00055', text: '#FFB000aa' };
  }
  if (t < 0.67) {
    return { bg: '#3a2200', border: '#FFB000cc', text: '#FFB000' };
  }
  return { bg: '#4a1000', border: '#FF4500', text: '#FF4500' };
}

export default function KeyboardHeatmap({ mistypeMap }) {
  const values = Object.values(mistypeMap);
  const max = values.length ? Math.max(...values) : 1;

  const weakest = Object.entries(mistypeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div>
      {weakest.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: '#9a7040', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Weakest:
          </span>
          {weakest.map(([key, count]) => (
            <span key={key} style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              background: '#3a1000', border: '1px solid #FF4500',
              color: '#FF4500', padding: '2px 8px',
              borderRadius: '3px', fontSize: '13px',
              fontFamily: 'inherit', fontWeight: '600',
            }}>
              {key.toUpperCase()}
              <span style={{ color: '#8a4020', fontSize: '11px' }}>×{count}</span>
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
        {ROWS.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: '5px', marginLeft: ROW_OFFSETS[ri] }}>
            {row.map(key => {
              const count = mistypeMap[key] || 0;
              const { bg, border, text } = keyColor(count, max);
              return (
                <div
                  key={key}
                  title={count ? `${key}: ${count} error${count > 1 ? 's' : ''}` : key}
                  style={{
                    width: '34px', height: '34px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: '3px',
                    color: text,
                    fontSize: '12px',
                    fontFamily: 'inherit',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                >
                  {key}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
