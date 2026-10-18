const TIME_MODES = [15, 30, 60];
const LANGUAGES = ['javascript', 'python', 'cpp'];
const LANG_LABEL = { javascript: 'JS', python: 'Python', cpp: 'C++' };

function Pill({ active, onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '5px 14px',
        borderRadius: '4px',
        fontSize: '13px',
        fontFamily: 'inherit',
        fontWeight: active ? '600' : '400',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        border: active ? '1px solid #FFB000' : '1px solid #4a3828',
        background: active ? '#FFB00018' : 'transparent',
        color: active ? '#FFB000' : '#9a7040',
        opacity: disabled ? 0.4 : 1,
        letterSpacing: '0.02em',
        textShadow: active ? '0 0 8px #FFB00040' : 'none',
      }}
    >
      {children}
    </button>
  );
}

export default function ModeSelector({
  testType, onChangeTestType,
  timeMode, onChangeTimeMode,
  language, onChangeLanguage,
  disabled,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '4px', marginRight: '8px' }}>
          <Pill active={testType === 'words'} onClick={() => onChangeTestType('words')} disabled={disabled}>
            Words
          </Pill>
          <Pill active={testType === 'code'} onClick={() => onChangeTestType('code')} disabled={disabled}>
            Code
          </Pill>
        </div>
        <div style={{ width: '1px', height: '16px', background: '#4a3828' }} />
        <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
          {TIME_MODES.map(m => (
            <Pill key={m} active={m === timeMode} onClick={() => onChangeTimeMode(m)} disabled={disabled}>
              {m}s
            </Pill>
          ))}
        </div>
      </div>

      {testType === 'code' && (
        <div style={{ display: 'flex', gap: '4px' }}>
          {LANGUAGES.map(lang => (
            <Pill key={lang} active={lang === language} onClick={() => onChangeLanguage(lang)} disabled={disabled}>
              {LANG_LABEL[lang]}
            </Pill>
          ))}
        </div>
      )}
    </div>
  );
}
