import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };
const C = { ok: '#10b981', fail: '#ef4444', base: '#6366f1', muted: 'var(--muted-foreground)' };

type Row = { x: number; result: number; isZero: boolean };

interface Props {
  rows: Row[];
  isIrreducible: boolean;
  polyLabel: string;
  highlight: number | null;
  onHighlight: (i: number | null) => void;
}

export default function IrreducibilitySvg({ rows, isIrreducible, polyLabel, highlight, onHighlight }: Props) {
  return (
    <svg viewBox="0 0 500 185" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={600}
        fill={C.base}>F₇ 에서 {polyLabel} = 0 검사</text>

      {/* Header */}
      <text x={50} y={40} textAnchor="middle" fontSize={9} fontWeight={500} fill={C.base}>x</text>
      <text x={140} y={40} textAnchor="middle" fontSize={9} fontWeight={500}
        fill={C.base}>{polyLabel} mod 7</text>
      <text x={230} y={40} textAnchor="middle" fontSize={9} fontWeight={500} fill={C.base}>= 0?</text>
      <line x1={20} y1={46} x2={275} y2={46} stroke={`${C.base}25`} strokeWidth={0.5} />

      {/* Rows */}
      {rows.map((r, i) => {
        const y = 62 + i * 16;
        return (
          <motion.g key={i}
            onMouseEnter={() => onHighlight(i)} onMouseLeave={() => onHighlight(null)}
            style={{ cursor: 'pointer' }}
            initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.04 }}>
            {highlight === i && (
              <rect x={18} y={y - 12} width={260} height={17} rx={3}
                fill={r.isZero ? `${C.ok}20` : `${C.base}12`} />
            )}
            <text x={50} y={y} textAnchor="middle" fontSize={9} fill={C.base}>{r.x}</text>
            <text x={140} y={y} textAnchor="middle" fontSize={9}
              fill={r.isZero ? C.ok : C.base}>{r.result}</text>
            <text x={230} y={y} textAnchor="middle" fontSize={9}
              fill={r.isZero ? C.ok : C.fail}>{r.isZero ? '✓ 근!' : '✗'}</text>
          </motion.g>
        );
      })}

      {/* Verdict */}
      <rect x={305} y={50} width={175} height={70} rx={6}
        fill={isIrreducible ? `${C.fail}12` : `${C.ok}12`}
        stroke={isIrreducible ? `${C.fail}35` : `${C.ok}35`} strokeWidth={0.8} />
      <text x={392} y={74} textAnchor="middle" fontSize={10} fontWeight={600}
        fill={isIrreducible ? C.fail : C.ok}>
        {isIrreducible ? '해 없음 → 기약!' : '해 있음 → 가약'}
      </text>
      <text x={392} y={92} textAnchor="middle" fontSize={9} fill={C.muted}>
        {isIrreducible ? 'F₇에 근이 없으므로' : 'x=3, x=4가 근이므로'}
      </text>
      <text x={392} y={108} textAnchor="middle" fontSize={9} fill={C.muted}>
        {isIrreducible ? '확장에 사용 가능 ✓' : '확장에 사용 불가 ✗'}
      </text>

      <text x={250} y={176} textAnchor="middle" fontSize={9} fill={C.muted}>
        {isIrreducible
          ? '기약 → 근 u를 추가하면 F₇²로 확장됨 (진짜 새 원소)'
          : '가약 → 근이 이미 F₇ 안에 있으므로 확장 안 됨'}
      </text>
    </svg>
  );
}
