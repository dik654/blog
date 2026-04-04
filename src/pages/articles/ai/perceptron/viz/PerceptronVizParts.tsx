import { motion } from 'framer-motion';
import { C } from '../PerceptronVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const d = (i: number) => ({ ...sp, delay: i * 0.12 });

/** Step 0: 생물학적 뉴런 이미지 + 매핑 */
export function Step0() {
  const maps = [
    { bio: '수상돌기', ai: '입력 (x₁, x₂)', c: C.input },
    { bio: '신경세포체', ai: '가중합 + 편향', c: C.sum },
    { bio: '축삭 + 말단', ai: '활성화 → 출력', c: C.output },
  ];
  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src="https://i.namu.wiki/i/3reaTfhg3ot4hd8m1Ne0MHz718HpK_ZL6nnu8eFPRPUIAHGr0BeWnxvNNCBIAs-9ef4uDS6DzI9jkw_pwzprJQ.svg"
        alt="생물학적 뉴런 구조" className="w-full max-w-2xl rounded-lg border border-border/40" />
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
