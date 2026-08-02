import { motion } from 'framer-motion';
import { C } from '../PerceptronVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const d = (i: number) => ({ ...sp, delay: i * 0.12 });

function BiologicalNeuronGraphic() {
  const dendrites = [
    'M132 126 C91 112 79 75 46 58 M91 105 C72 91 60 89 34 96',
    'M135 116 C112 82 119 50 91 28 M113 82 C92 72 83 57 72 43',
    'M132 139 C92 151 76 188 43 205 M91 160 C71 171 55 170 28 160',
  ];
  return (
    <svg viewBox="0 0 600 250" className="h-auto w-full max-w-3xl" role="img"
      aria-label="수상돌기에서 세포체와 축삭을 거쳐 출력으로 전달되는 생물학적 뉴런">
      <defs>
        <marker id="neuron-flow-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill={C.output} />
        </marker>
      </defs>
      <rect x="1" y="1" width="598" height="248" rx="8" fill="var(--card)" stroke="var(--border)" />

      {dendrites.map((path, index) => (
        <motion.path key={path} d={path} fill="none" stroke={C.input} strokeWidth="5" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.82 }} transition={{ duration: 0.55, delay: index * 0.08 }} />
      ))}
      <motion.ellipse cx="157" cy="130" rx="48" ry="42" fill={`${C.input}18`} stroke={C.input} strokeWidth="2"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={d(2)} />
      <circle cx="154" cy="130" r="14" fill={C.sum} opacity="0.82" />

      <motion.path d="M202 130 C275 117 342 143 420 127 C460 119 486 117 520 125" fill="none"
        stroke={C.sum} strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.28 }} />
      {[232, 286, 340, 394, 448].map((x, index) => (
        <motion.rect key={x} x={x} y={112 + (index % 2) * 8} width="38" height="24" rx="12"
          fill="#f5cf65" stroke="#a16207" strokeWidth="1.3"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.38 + index * 0.08 }} />
      ))}

      <motion.path d="M520 125 C545 105 555 82 575 69 M531 117 C556 119 570 110 588 101 M526 134 C552 148 559 169 580 181"
        fill="none" stroke={C.output} strokeWidth="4" strokeLinecap="round" markerEnd="url(#neuron-flow-arrow)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.65, delay: 0.65 }} />

      <g fontSize="17" fontWeight="700">
        <text x="48" y="232" fill={C.input}>1 입력</text>
        <text x="139" y="73" fill={C.sum}>2 합산</text>
        <text x="500" y="220" fill={C.output}>3 출력</text>
      </g>
      <motion.circle r="6" fill={C.output} initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: '100%' }}
        style={{ offsetPath: 'path("M 205 130 C 300 118 405 142 520 125")' }} transition={{ duration: 1.6, delay: 0.8 }} />
    </svg>
  );
}

/** Step 0: 생물학적 뉴런 이미지 + 매핑 */
export function Step0() {
  const maps = [
    { bio: '수상돌기', ai: '입력 (x₁, x₂)', c: C.input },
    { bio: '신경세포체', ai: '가중합 + 편향', c: C.sum },
    { bio: '축삭 + 말단', ai: '활성화 → 출력', c: C.output },
  ];
  return (
    <div className="flex flex-col items-center gap-4">
      <BiologicalNeuronGraphic />
      <div className="flex gap-3 flex-wrap justify-center">
        {maps.map((m, i) => (
          <motion.div key={i} className="flex items-center gap-2 rounded-lg border px-3 py-2"
            style={{ borderColor: m.c + '40' }}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={d(i)}>
            <span className="text-sm font-medium" style={{ color: m.c }}>{m.bio}</span>
            <span className="text-xs text-muted-foreground">→</span>
            <span className="text-sm text-foreground">{m.ai}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Step 1: 퍼셉트론 연산 — 뉴런 다이어그램 스타일 */
export function Step1() {
  return (
    <svg viewBox="0 0 420 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* 입력 원 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={d(0)}>
        <circle cx={40} cy={45} r={18} fill={`${C.input}12`} stroke={C.input} strokeWidth={1.2} />
        <text x={40} y={42} textAnchor="middle" fontSize={10} fontWeight={500} fill={C.input}>x₁</text>
        <text x={40} y={55} textAnchor="middle" fontSize={9} fill={C.input} opacity={0.6}>입력</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={d(1)}>
        <circle cx={40} cy={115} r={18} fill={`${C.input}12`} stroke={C.input} strokeWidth={1.2} />
        <text x={40} y={112} textAnchor="middle" fontSize={10} fontWeight={500} fill={C.input}>x₂</text>
        <text x={40} y={125} textAnchor="middle" fontSize={9} fill={C.input} opacity={0.6}>입력</text>
      </motion.g>

      {/* 가중치 곡선 */}
      <motion.path d="M58,45 C90,45 100,65 130,72" fill="none" stroke={C.input} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.2 }} />
      <motion.path d="M58,115 C90,115 100,95 130,88" fill="none" stroke={C.input} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.25 }} />
      <text x={82} y={42} fontSize={9} fill={C.input} fontWeight={500}>×w₁</text>
      <text x={82} y={118} fontSize={9} fill={C.input} fontWeight={500}>×w₂</text>

      {/* Σ 합산 원 */}
      <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={d(3)}>
        <circle cx={150} cy={80} r={22} fill={`${C.sum}10`} stroke={C.sum} strokeWidth={1.2} />
        <text x={150} y={78} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.sum}>Σ</text>
        <text x={150} y={92} textAnchor="middle" fontSize={9} fill={C.sum} opacity={0.6}>합산</text>
      </motion.g>

      {/* → +b */}
      <motion.path d="M172,80 C188,80 192,80 208,80" fill="none" stroke={C.sum} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.4 }} />
      <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={d(4)}>
        <circle cx={228} cy={80} r={18} fill={`${C.sum}10`} stroke={C.sum} strokeWidth={1.2} />
        <text x={228} y={78} textAnchor="middle" fontSize={10} fontWeight={500} fill={C.sum}>+b</text>
        <text x={228} y={92} textAnchor="middle" fontSize={9} fill={C.sum} opacity={0.6}>편향</text>
      </motion.g>

      {/* → 판단 */}
      <motion.path d="M246,80 C262,80 268,80 282,80" fill="none" stroke={C.output} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.55 }} />
      <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={d(5)}>
        <rect x={284} y={62} width={48} height={36} rx={10} fill={`${C.output}10`} stroke={C.output} strokeWidth={1.2} />
        <text x={308} y={78} textAnchor="middle" fontSize={9} fontWeight={500} fill={C.output}>z{'>'}0?</text>
        <text x={308} y={92} textAnchor="middle" fontSize={9} fill={C.output} opacity={0.6}>판단</text>
      </motion.g>

      {/* → 출력 */}
      <motion.path d="M332,80 C348,80 352,80 362,80" fill="none" stroke={C.output} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.7 }} />
      <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={d(6)}>
        <circle cx={382} cy={80} r={18} fill={`${C.output}12`} stroke={C.output} strokeWidth={1.2} />
        <text x={382} y={78} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.output}>0/1</text>
        <text x={382} y={92} textAnchor="middle" fontSize={9} fill={C.output} opacity={0.6}>출력</text>
      </motion.g>
    </svg>
  );
}

export { Step2Calc, Step3Calc } from './PerceptronCalcParts';
