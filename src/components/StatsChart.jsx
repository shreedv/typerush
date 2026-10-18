import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: '#231f1b',
        border: '1px solid #4a3828',
        borderRadius: '4px',
        padding: '8px 12px',
        fontSize: '13px',
        fontFamily: 'inherit',
      }}>
        <div style={{ color: '#FFB000' }}>{payload[0].value} wpm</div>
        <div style={{ color: '#7a5828' }}>{payload[0].payload.time}s</div>
      </div>
    );
  }
  return null;
};

export default function StatsChart({ data }) {
  if (!data || data.length < 2) return null;

  return (
    <div style={{ width: '100%', height: '160px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3a2e22" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#7a5828', fontSize: 11, fontFamily: 'inherit' }}
            tickLine={false}
            axisLine={{ stroke: '#4a3828' }}
            label={{ value: 'seconds', position: 'insideBottomRight', offset: -5, fill: '#7a5828', fontSize: 10 }}
          />
          <YAxis
            tick={{ fill: '#7a5828', fontSize: 11, fontFamily: 'inherit' }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="wpm"
            stroke="#FFB000"
            strokeWidth={2}
            dot={{ fill: '#FFB000', r: 3, strokeWidth: 0 }}
            activeDot={{ fill: '#FFD060', r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
