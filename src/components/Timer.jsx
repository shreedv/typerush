export default function Timer({ timeLeft, mode, started }) {
  const pct = timeLeft / mode;
  const urgent = timeLeft <= 5;

  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{
        fontSize: '52px',
        fontWeight: '700',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1,
        letterSpacing: '-2px',
        color: urgent ? '#FF4500' : '#FFB000',
        textShadow: urgent ? '0 0 24px #FF450099' : '0 0 24px #FFB00070',
        transition: 'color 0.3s ease, text-shadow 0.3s ease',
      }}>
        {timeLeft}
      </div>
      <div style={{
        marginTop: '8px',
        height: '2px',
        width: '72px',
        background: '#3a2e22',
        borderRadius: '1px',
      }}>
        <div style={{
          height: '100%',
          borderRadius: '1px',
          width: `${pct * 100}%`,
          background: urgent ? '#FF4500' : '#FFB000',
          boxShadow: urgent ? '0 0 8px #FF450099' : '0 0 8px #FFB00070',
          transition: 'width 0.9s linear, background 0.3s ease',
        }} />
      </div>
    </div>
  );
}
