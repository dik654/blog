import { motion } from 'framer-motion';

const C = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';
const MUT = 'var(--muted-foreground)';

export default function CompressionStep0() {
  const cy = 200;

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hash input */}
      <rect x={60} y={cy - 70} width={220} height={54} rx={10}
        fill={`${C}08`} stroke={C} strokeWidth={1} />
      <text x={170} y={cy - 48} textAnchor="middle" fontSize={15} fontWeight={600} fill={C}>
        이전 해시
      </text>
      <text x={170} y={cy - 30} textAnchor="middle" fontSize={13} fill={C}>256-bit</text>

      {/* Message input */}
      <rect x={60} y={cy + 16} width={220} height={54} rx={10}
        fill={`${C2}08`} stroke={C2} strokeWidth={1} />
      <text x={170} y={cy + 38} textAnchor="middle" fontSize={15} fontWeight={600} fill={C2}>
        메시지 블록
      </text>
      <text x={170} y={cy + 56} textAnchor="middle" fontSize={13} fill={C2}>512-bit</text>

      {/* Arrows to f */}
      <line x1={280} y1={cy - 43} x2={370} y2={cy - 12} stroke={C} strokeWidth={1} />
      <line x1={280} y1={cy + 43} x2={370} y2={cy + 12} stroke={C2} strokeWidth={1} />

      {/* f box */}
      <rect x={370} y={cy - 60} width={280} height={120} rx={14}
        fill={`${C3}08`} stroke={C3} strokeWidth={1.4} />
      <text x={510} y={cy - 18} textAnchor="middle" fontSize={22} fontWeight={700} fill={C3}>
        압축함수 f
      </text>
      <text x={510} y={cy + 10} textAnchor="middle" fontSize={15} fill={C3}>64 라운드 반복</text>
      <text x={510} y={cy + 36} textAnchor="middle" fontSize={12} fill={MUT}>
        매 라운드: 비트 혼합 + 워드 + 상수
      </text>

      {/* Arrow to output */}
      <line x1={650} y1={cy} x2={720} y2={cy} stroke={C3} strokeWidth={1.4} />

      {/* Output */}
      <rect x={720} y={cy - 34} width={180} height={68} rx={10}
        fill={`${C}08`} stroke={C} strokeWidth={1} />
      <text x={810} y={cy - 8} textAnchor="middle" fontSize={15} fontWeight={600} fill={C}>
        새 해시 h
        <tspan baselineShift="sub" fontSize="75%">i</tspan>
      </text>
      <text x={810} y={cy + 16} textAnchor="middle" fontSize={13} fill={C}>256-bit</text>
    </motion.g>
  );
}
