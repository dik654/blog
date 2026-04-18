import { motion } from 'framer-motion';
import { C } from './FFNDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

export function Step0() {
  const dims = [
    { label: 'd_model=512', w: 80, color: C.ffn },
    { label: 'd_ff=2048', w: 240, color: C.relu },
    { label: 'd_model=512', w: 80, color: C.ffn },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.ffn}>Position-wise FFN 구조</text>
      {/* Dimension bars */}
      {dims.map((d, i) => {
        const y = 34 + i * 36;
        const labels = ['입력 x', 'W1 확장 (4배)', 'W2 복원'];
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.2 }}>
            <text x={20} y={y + 14} fontSize={8} fill={C.muted}>{labels[i]}</text>
            <motion.rect x={100} y={y} width={d.w} height={22} rx={4}
              fill={`${d.color}12`} stroke={d.color} strokeWidth={1}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: '100px center' }}
              transition={{ ...sp, delay: 0.1 + i * 0.2 }} />
            <text x={105 + d.w} y={y + 14} fontSize={8} fontWeight={600}
              fontFamily={MF} fill={d.color}>{d.label}</text>
            {/* Arrow between */}
            {i < 2 && (
              <line x1={140} y1={y + 22} x2={140} y2={y + 34}
                stroke={C.muted} strokeWidth={0.6} strokeDasharray="2 2" />
            )}
          </motion.g>
        );
      })}
      {/* Formula */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={280} y={34} width={180} height={50} rx={5}
          fill={`${C.ffn}08`} stroke={C.ffn} strokeWidth={1} />
        <text x={370} y={52} textAnchor="middle" fontSize={8} fontFamily={MF} fill={C.ffn}>
          FFN(x) = ReLU(xW1+b1)W2+b2
        </text>
        <text x={370} y={68} textAnchor="middle" fontSize={8} fill={C.muted}>
          각 토큰 독립 처리 (position-wise)
        </text>
        <text x={370} y={82} textAnchor="middle" fontSize={8} fill={C.muted}>
          병렬 처리 극대화
        </text>
      </motion.g>
      {/* Why expand */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.9 }}>
        <rect x={280} y={96} width={180} height={46} rx={5}
          fill={`${C.relu}08`} stroke={C.relu} strokeWidth={0.8} strokeDasharray="4 2" />
        <text x={370} y={112} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.relu}>
          왜 4배 확장?
        </text>
        <text x={290} y={126} fontSize={8} fill={C.muted}>비선형 표현력 증가 + 지식 저장</text>
        <text x={290} y={138} fontSize={8} fill={C.muted}>Compute → Compress 전략</text>
      </motion.g>
    </g>
  );
}

export function Step1() {
  const funcs = [
    { name: 'ReLU', formula: 'max(0, x)', year: '2017', color: C.relu,
      desc: '음수 완전 차단' },
    { name: 'GELU', formula: 'x · Φ(x)', year: '2018', color: C.gelu,
      desc: '작은 음수 일부 통과' },
    { name: 'SwiGLU', formula: 'Swish(xW) ⊙ (xV)', year: '2020', color: C.swi,
      desc: '게이트 메커니즘' },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.gelu}>활성화 함수 진화</text>
      {funcs.map((f, i) => {
        const y = 30 + i * 42;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.15 }}>
            {/* Name badge */}
            <rect x={20} y={y} width={60} height={22} rx={4}
              fill={`${f.color}15`} stroke={f.color} strokeWidth={1.2} />
            <text x={50} y={y + 14} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={f.color}>{f.name}</text>
            {/* Formula */}
            <text x={90} y={y + 14} fontSize={8} fontFamily={MF} fill={f.color}>
              {f.formula}
            </text>
            {/* Year */}
            <text x={220} y={y + 14} fontSize={7} fill={C.muted}>{f.year}</text>
            {/* Desc */}
            <text x={260} y={y + 14} fontSize={8} fill={C.muted}>{f.desc}</text>
          </motion.g>
        );
      })}
      {/* SwiGLU detail */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={20} y={120} width={440} height={30} rx={4}
          fill={`${C.swi}08`} stroke={C.swi} strokeWidth={0.8} />
        <text x={30} y={134} fontSize={8} fontFamily={MF} fill={C.swi}>
          Swish(x) = x · sigmoid(x)
        </text>
        <text x={240} y={134} fontSize={8} fill={C.muted}>
          gate × content 구조 — LLaMA, Mistral 기본
        </text>
        <text x={30} y={146} fontSize={7} fill={C.muted}>
          GELU 근사: 0.5x(1 + tanh(√(2/π)(x + 0.044715x³)))
        </text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  const params = [
    { label: 'FFN', formula: '2 × 512 × 2048', value: '2.1M', color: C.ffn, barW: 200 },
    { label: 'Attention', formula: '4 × 512²', value: '1.05M', color: C.param, barW: 100 },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.param}>파라미터 비중 비교</text>
      <text x={20} y={30} fontSize={8} fill={C.muted}>d_model=512, d_ff=2048 기준</text>
      {params.map((p, i) => {
        const y = 42 + i * 36;
        return (
          <motion.g key={i} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ ...sp, delay: i * 0.2 }}>
            <text x={20} y={y + 14} fontSize={9} fontWeight={600} fill={p.color}>{p.label}</text>
            <text x={90} y={y + 14} fontSize={8} fontFamily={MF} fill={C.muted}>{p.formula}</text>
            <motion.rect x={200} y={y} width={p.barW} height={22} rx={4}
              fill={`${p.color}15`} stroke={p.color} strokeWidth={1}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: '200px center' }}
              transition={{ ...sp, delay: 0.2 + i * 0.15 }} />
            <text x={205 + p.barW} y={y + 14} fontSize={9} fontWeight={700} fill={p.color}>
              {p.value}
            </text>
          </motion.g>
        );
      })}
      {/* LLaMA breakdown */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={20} y={128} fontSize={9} fontWeight={600} fill={C.swi}>LLaMA-7B 분포</text>
        {[
          { label: 'FFN (SwiGLU)', pct: '66%', w: 200, color: C.swi },
          { label: 'Attention', pct: '33%', w: 100, color: C.param },
          { label: '기타', pct: '1%', w: 4, color: C.muted },
        ].map((s, i) => {
          const x = 110 + (i === 0 ? 0 : i === 1 ? 204 : 308);
          return (
            <g key={i}>
              <rect x={x} y={134} width={s.w} height={16} rx={2}
                fill={`${s.color}20`} stroke={s.color} strokeWidth={0.6} />
              <text x={x + s.w / 2} y={145} textAnchor="middle" fontSize={7}
                fontWeight={600} fill={s.color}>{s.label} {s.pct}</text>
            </g>
          );
        })}
      </motion.g>
    </g>
  );
}
