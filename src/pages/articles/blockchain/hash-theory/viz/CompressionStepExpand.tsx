import { motion } from 'framer-motion';

const C2 = '#10b981', C3 = '#f59e0b', C4 = '#6366f1';
const MUT = 'var(--muted-foreground)';

/* shared round layout */
function Round({ x, t, subs, outSub, color, label }: {
  x: number; t: number; subs: string[]; outSub: string;
  color: string; label?: string;
}) {
  const bW = 62, bH = 30, gap = 52;
  const σX = x + bW + 6, σW = 46;
  const mergeX = x + 188;
  const plusR = 18, plusCX = mergeX + 22;
  const outX = plusCX + plusR + 10, outW = 72, outH = 36;
  const rows = [
    { sub: subs[0], idx: 't−16', y: 0, hasσ: false },
    { sub: subs[1], idx: 't−15', y: gap, hasσ: true, σ: 'σ₀' },
    { sub: subs[2], idx: 't−7', y: gap * 2, hasσ: false },
    { sub: subs[3], idx: 't−2', y: gap * 3, hasσ: true, σ: 'σ₁' },
  ];
  const baseY = 100;
  const plusCY = baseY + gap * 1.5 + bH / 2;

  return (
    <g>
      {/* Title */}
      <text x={x + 100} y={78} textAnchor="middle" fontSize={14} fontWeight={700} fill={color}>
        t = {t}
      </text>
      {label && <text x={x + 100} y={64} textAnchor="middle" fontSize={11} fill={MUT}>{label}</text>}

      {rows.map(({ sub, idx, y: dy, hasσ, σ }) => {
        const y = baseY + dy;
        const cy = y + bH / 2;
        const endX = hasσ ? σX + σW : x + bW;
        return (
          <g key={`${t}-${sub}`}>
            <text x={x - 6} y={cy + 4} textAnchor="end" fontSize={10} fill={MUT}>{idx}</text>
            <rect x={x} y={y} width={bW} height={bH} rx={5}
              fill={`${C2}10`} stroke={C2} strokeWidth={.7} />
            <text x={x + bW / 2} y={cy + 6} textAnchor="middle"
              fontSize={14} fontWeight={700} fill={C2}>
              W<tspan baselineShift="sub" fontSize="75%">{sub}</tspan>
            </text>
            {hasσ && (<>
              <line x1={x + bW} y1={cy} x2={σX} y2={cy} stroke={C3} strokeWidth={.8} />
              <rect x={σX} y={y} width={σW} height={bH} rx={5}
                fill={`${C3}14`} stroke={C3} strokeWidth={.7} />
              <text x={σX + σW / 2} y={cy + 6} textAnchor="middle"
                fontSize={13} fontWeight={700} fill={C3}>{σ}</text>
            </>)}
            <line x1={endX + 2} y1={cy} x2={mergeX} y2={cy} stroke={C2} strokeWidth={.5} />
            <line x1={mergeX} y1={cy} x2={mergeX} y2={plusCY}
              stroke={C2} strokeWidth={.5} />
          </g>
        );
      })}

      <line x1={mergeX} y1={plusCY} x2={plusCX - plusR} y2={plusCY}
        stroke={C2} strokeWidth={.7} />
      <circle cx={plusCX} cy={plusCY} r={plusR}
        fill={`${C3}14`} stroke={C3} strokeWidth={1} />
      <text x={plusCX} y={plusCY + 6} textAnchor="middle"
        fontSize={16} fontWeight={700} fill={C3}>+</text>

      <line x1={plusCX + plusR} y1={plusCY} x2={outX} y2={plusCY}
        stroke={C3} strokeWidth={1} />
      <rect x={outX} y={plusCY - outH / 2} width={outW} height={outH} rx={7}
        fill={`${color}14`} stroke={color} strokeWidth={1} />
      <text x={outX + outW / 2} y={plusCY + 7} textAnchor="middle"
        fontSize={16} fontWeight={700} fill={color}>
        W<tspan baselineShift="sub" fontSize="75%">{outSub}</tspan>
      </text>
    </g>
  );
}

export default function CompressionStepExpand() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={480} y={28} textAnchor="middle" fontSize={16} fontWeight={700} fill={C3}>
        워드 확장 — 이전 워드 4개 → 새 워드 1개
      </text>
      <text x={480} y={48} textAnchor="middle" fontSize={12} fill={MUT}>
        같은 공식, 인덱스만 1씩 밀림. 방금 만든 워드도 다음 계산의 재료가 된다.
      </text>

      {/* t=16 (left) */}
      <Round x={60} t={16} subs={['0', '1', '9', '14']} outSub="16"
        color={C3} label="첫 번째" />

      {/* divider */}
      <line x1={478} y1={80} x2={478} y2={330} stroke="var(--border)"
        strokeWidth={.5} strokeDasharray="6 4" />
      <text x={480} y={344} textAnchor="middle" fontSize={13} fontWeight={600} fill={MUT}>
        → 다음
      </text>

      {/* t=17 (right) */}
      <Round x={520} t={17} subs={['1', '2', '10', '15']} outSub="17"
        color={C4} label="두 번째" />

      {/* Bottom note */}
      <text x={480} y={374} textAnchor="middle" fontSize={13} fill={MUT}>
        {'t = 18부터 W'}
        <tspan baselineShift="sub" fontSize="75%">16</tspan>
        {'(좌측 결과)도 재료로 사용 → t = 63까지 반복하면 총 64개 워드 완성'}
      </text>
      <text x={480} y={398} textAnchor="middle" fontSize={12} fill={MUT}>
        σ₀, σ₁ = 32-bit 워드의 비트를 회전·시프트한 뒤 XOR로 섞는 함수 (값을 흩뜨리는 역할)
      </text>
    </motion.g>
  );
}
