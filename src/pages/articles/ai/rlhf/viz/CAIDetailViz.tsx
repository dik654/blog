import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const B = '#3b82f6', G = '#10b981', W = '#f59e0b', P = '#6366f1', E = '#ef4444';

function Defs() {
  return (
    <defs>
      <marker id="caiArr" viewBox="0 0 6 6" refX={5} refY={3}
        markerWidth={5} markerHeight={5} orient="auto">
        <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--border)" />
      </marker>
    </defs>
  );
}

function Box({ x, y, w, h, label, sub, color, delay = 0 }: {
  x: number; y: number; w: number; h: number;
  label: string; sub?: string; color: string; delay?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ ...sp, delay }}>
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill={`${color}12`} stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 1 : h / 2 + 4)} textAnchor="middle"
        fontSize={9} fontWeight={600} fill={color}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 11} textAnchor="middle"
        fontSize={7.5} fill="var(--muted-foreground)">{sub}</text>}
    </motion.g>
  );
}

function Arrow({ x1, y1, x2, y2, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; delay?: number;
}) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="var(--border)" strokeWidth={1}
      markerEnd="url(#caiArr)"
      initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
      transition={{ ...sp, delay }} />
  );
}

function Badge({ x, y, text, color, delay = 0 }: {
  x: number; y: number; text: string; color: string; delay?: number;
}) {
  const w = text.length * 5.2 + 16;
  return (
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ ...sp, delay }}>
      <rect x={x - w / 2} y={y - 9} width={w} height={18} rx={9}
        fill={`${color}15`} stroke={color} strokeWidth={0.8} />
      <text x={x} y={y + 4} textAnchor="middle"
        fontSize={8} fontWeight={600} fill={color}>{text}</text>
    </motion.g>
  );
}

const STEPS = [
  { label: '1. CAI Stage 1 --- 자기 비평 + 수정 + SFT', body: 'Helpful-only 모델의 위험한 응답을 원칙에 따라 자기 비평(critique)\n수정(revision)한 뒤 (prompt, revised) 쌍으로 SFT 학습' },
  { label: '2. CAI Stage 2 --- AI 비교 라벨링', body: '두 응답 비교 시 AI가 원칙 기반으로 선호 라벨링\npreference dataset으로 RM 학습 후 PPO 정책 최적화' },
  { label: '3. 헌법과 장단점', body: '~50개 원칙으로 명시적 제어, 라벨 비용 0\nAI 편향 증폭과 원칙 간 충돌, 인간 감독 여전히 필요' },
  { label: '4. RLAIF 비용 vs 품질', body: 'GPT-4 judge: 인간 대비 ~85% agreement, 비용 1/10\n일관적이지만 같은 편향 공유하는 한계' },
];

export default function CAIDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 135" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <Defs />

          {/* Step 0: Self-critique -> revision -> SFT pipeline */}
          {step === 0 && (
            <g>
              {/* top: Constitution badge */}
              <Badge x={240} y={12} text="원칙: 위험한 지시 금지" color={W} delay={0} />

              {/* flow boxes */}
              <Box x={10} y={30} w={88} h={34} label="위험 응답" sub="helpful-only" color={E} delay={0.05} />
              <Arrow x1={100} y1={47} x2={118} y2={47} delay={0.1} />
              <Box x={120} y={30} w={88} h={34} label="Self-Critique" sub="원칙 위반 검출" color={P} delay={0.12} />
              <Arrow x1={210} y1={47} x2={228} y2={47} delay={0.18} />
              <Box x={230} y={30} w={88} h={34} label="Revision" sub="안전하게 수정" color={B} delay={0.2} />
              <Arrow x1={320} y1={47} x2={338} y2={47} delay={0.26} />
              <Box x={340} y={30} w={120} h={34} label="SFT 학습" sub="(prompt, revised) 쌍" color={G} delay={0.28} />

              {/* bottom badge */}
              <Badge x={240} y={90} text="인간 라벨 0 --- 모델이 스스로 개선" color={G} delay={0.35} />

              {/* cycle arrow from revision back to critique */}
              <motion.path d="M 274 66 Q 274 80 170 80 Q 140 80 140 66"
                fill="none" stroke={P} strokeWidth={0.8} strokeDasharray="3 2"
                markerEnd="url(#caiArr)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.35 }}
                transition={{ ...sp, delay: 0.32 }} />
              <motion.text x={210} y={78} fontSize={7} fill={P}
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                transition={{ ...sp, delay: 0.34 }}>반복 가능</motion.text>
            </g>
          )}

          {/* Step 1: Stage 2 - AI labeling -> RM -> PPO */}
          {step === 1 && (
            <g>
              {/* Two responses */}
              <Box x={10} y={10} w={75} h={28} label="응답 A" color={B} delay={0} />
              <Box x={10} y={44} w={75} h={28} label="응답 B" color={B} delay={0.04} />

              <Arrow x1={87} y1={24} x2={108} y2={38} delay={0.08} />
              <Arrow x1={87} y1={58} x2={108} y2={44} delay={0.08} />

              {/* AI judge */}
              <Box x={110} y={22} w={100} h={38} label="AI Judge" sub="원칙 기반 비교" color={P} delay={0.1} />
              <Arrow x1={212} y1={41} x2={232} y2={41} delay={0.16} />

              {/* Preference dataset */}
              <Box x={234} y={22} w={85} h={38} label="Preference" sub="A > B 라벨" color={W} delay={0.18} />
              <Arrow x1={321} y1={41} x2={340} y2={41} delay={0.22} />

              {/* RM */}
              <Box x={342} y={15} w={60} h={24} label="RM" color={W} delay={0.24} />
              <Arrow x1={372} y1={41} x2={372} y2={54} delay={0.28} />

              {/* PPO */}
              <Box x={342} y={56} w={60} h={24} label="PPO" color={G} delay={0.26} />

              {/* Result arrow */}
              <Arrow x1={404} y1={68} x2={440} y2={68} delay={0.32} />
              <motion.text x={458} y={72} textAnchor="end" fontSize={8} fontWeight={600} fill={G}
                initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                transition={{ ...sp, delay: 0.34 }}>정렬 LLM</motion.text>

              {/* bottom note */}
              <Badge x={150} y={95} text="RLAIF: 전체 루프 자동화" color={G} delay={0.36} />
            </g>
          )}

          {/* Step 2: Constitution pros/cons */}
          {step === 2 && (
            <g>
              {/* Constitution pills */}
              <motion.text x={130} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={W}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp }}>헌법 원칙 (~50개)</motion.text>
              {[
                '가장 무해한 응답 선택',
                '인종/성별 편견 피하기',
                '의료 조언 신중히',
                '사용자 자율성 존중',
              ].map((t, i) => (
                <motion.g key={t}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.04 + i * 0.05 }}>
                  <rect x={30} y={22 + i * 22} width={200} height={17} rx={8.5}
                    fill={`${W}10`} stroke={W} strokeWidth={0.7} />
                  <text x={130} y={34 + i * 22} textAnchor="middle"
                    fontSize={8} fill={W}>{t}</text>
                </motion.g>
              ))}

              {/* Pros */}
              <motion.text x={370} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={G}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>장점</motion.text>
              {['라벨 비용 0', '확장성 무제한', '원칙 변경 가능'].map((t, i) => (
                <motion.g key={t}
                  initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.24 + i * 0.05 }}>
                  <rect x={295} y={22 + i * 20} width={150} height={16} rx={4}
                    fill={`${G}10`} stroke={G} strokeWidth={0.7} />
                  <text x={370} y={34 + i * 20} textAnchor="middle"
                    fontSize={8} fill={G}>{t}</text>
                </motion.g>
              ))}

              {/* Cons */}
              <motion.text x={370} y={88} textAnchor="middle" fontSize={9} fontWeight={700} fill={E}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.38 }}>단점</motion.text>
              {['AI 편향 증폭', '원칙 간 충돌', 'Bootstrap 문제'].map((t, i) => (
                <motion.g key={t}
                  initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.42 + i * 0.05 }}>
                  <rect x={295} y={95 + i * 20} width={150} height={16} rx={4}
                    fill={`${E}08`} stroke={E} strokeWidth={0.7} strokeDasharray="3 2" />
                  <text x={370} y={107 + i * 20} textAnchor="middle"
                    fontSize={8} fill={E}>{t}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 3: RLAIF cost vs quality */}
          {step === 3 && (
            <g>
              {/* Agreement bars */}
              <motion.text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={B}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp }}>RLAIF 품질 (인간 일치율)</motion.text>

              {/* GPT-4 bar */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.06 }}>
                <text x={80} y={36} textAnchor="end" fontSize={8.5} fontWeight={500}
                  fill="var(--foreground)">GPT-4 judge</text>
                <rect x={85} y={26} width={300} height={14} rx={3}
                  fill="var(--border)" opacity={0.15} />
                <motion.rect x={85} y={26} width={0} height={14} rx={3}
                  fill={P} opacity={0.5}
                  animate={{ width: 300 * 0.85 }}
                  transition={{ ...sp, delay: 0.15 }} />
                <text x={85 + 300 * 0.85 + 6} y={37} fontSize={8} fontWeight={700} fill={P}>~85%</text>
              </motion.g>

              {/* Claude bar */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.12 }}>
                <text x={80} y={58} textAnchor="end" fontSize={8.5} fontWeight={500}
                  fill="var(--foreground)">Claude 3.5</text>
                <rect x={85} y={48} width={300} height={14} rx={3}
                  fill="var(--border)" opacity={0.15} />
                <motion.rect x={85} y={48} width={0} height={14} rx={3}
                  fill={B} opacity={0.5}
                  animate={{ width: 300 * 0.90 }}
                  transition={{ ...sp, delay: 0.2 }} />
                <text x={85 + 300 * 0.90 + 6} y={59} fontSize={8} fontWeight={700} fill={B}>~90%</text>
              </motion.g>

              {/* Cost comparison */}
              <motion.text x={240} y={82} textAnchor="middle" fontSize={9} fontWeight={700} fill={G}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.25 }}>비용: 인간 대비 1/10 ~ 1/1000</motion.text>

              {/* Limitations */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={60} y={92} width={155} height={20} rx={5}
                  fill={`${E}08`} stroke={E} strokeWidth={0.7} strokeDasharray="3 2" />
                <text x={137} y={106} textAnchor="middle"
                  fontSize={8} fill={E}>같은 편향 공유 (self-reinforcing)</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.35 }}>
                <rect x={230} y={92} width={130} height={20} rx={5}
                  fill={`${E}08`} stroke={E} strokeWidth={0.7} strokeDasharray="3 2" />
                <text x={295} y={106} textAnchor="middle"
                  fontSize={8} fill={E}>OOD 취약</text>
              </motion.g>

              {/* Best practice badge */}
              <Badge x={240} y={126} text="실무: 인간 seed -> AI bulk -> 인간 QC" color={W} delay={0.4} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
