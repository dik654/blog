import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const B = '#3b82f6', G = '#10b981', W = '#f59e0b', P = '#6366f1', E = '#ef4444';

function Defs() {
  return (
    <defs>
      <marker id="dpoArr" viewBox="0 0 6 6" refX={5} refY={3}
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

function Arrow({ x1, y1, x2, y2, delay = 0, color }: {
  x1: number; y1: number; x2: number; y2: number; delay?: number; color?: string;
}) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color || 'var(--border)'} strokeWidth={1}
      markerEnd="url(#dpoArr)"
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
  { label: '1. DPO 핵심 아이디어', body: 'RLHF 최적 정책에서 r(x,y) 역산 후 BT loss에 대입\nZ(x)가 상쇄되어 Reward Model 없이 직접 정책 최적화' },
  { label: '2. DPO 손실 함수', body: 'L = -E[log sigma(beta * (log_ratio_w - log_ratio_l))]\n모델 2개(policy + reference)만 필요 --- RLHF의 4개 대비 절반' },
  { label: '3. DPO 장단점', body: '장점: 구현 20줄, 학습 안정, 비용 적음\n단점: Offline only, 분포 이동 대응 어려움' },
  { label: '4. Constitutional AI (CAI)', body: 'AI 자체가 헌법(원칙)에 따라 응답 평가\nStage 1: self-critique -> revision -> SFT\nStage 2: AI 비교 라벨링 -> RM -> PPO' },
  { label: '5. 2024 정렬의 주요 방향', body: 'DPO, CAI, RLAIF가 핵심 3축\nIPO, ORPO, KTO, SimPO 등 파생 기법도 활발' },
];

export default function DPOAlternativeDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 135" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <Defs />

          {/* Step 0: DPO derivation flow */}
          {step === 0 && (
            <g>
              {/* derivation chain */}
              <Box x={10} y={8} w={130} h={34} label="RLHF 최적 정책" sub="pi* proportional to pi_ref * exp(r/beta)" color={P} delay={0} />
              <Arrow x1={142} y1={25} x2={160} y2={25} delay={0.08} />

              <Box x={162} y={8} w={110} h={34} label="r(x,y) 역산" sub="beta*log(pi*/pi_ref)+C" color={W} delay={0.1} />
              <Arrow x1={274} y1={25} x2={292} y2={25} delay={0.16} />

              <Box x={294} y={8} w={88} h={34} label="BT Loss 대입" sub="Z(x) 상쇄!" color={B} delay={0.18} />

              {/* result */}
              <Arrow x1={338} y1={44} x2={338} y2={58} delay={0.24} />
              <Box x={240} y={60} w={190} h={34} label="RM 불필요" sub="classification loss로 변환" color={G} delay={0.26} />

              {/* crossed out RM */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                transition={{ ...sp, delay: 0.32 }}>
                <rect x={22} y={60} width={90} height={34} rx={6}
                  fill={`${E}08`} stroke={E} strokeWidth={0.8} strokeDasharray="3 2" />
                <text x={67} y={80} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={E}>Reward Model</text>
                <line x1={24} y1={62} x2={110} y2={92} stroke={E} strokeWidth={1.5} opacity={0.6} />
              </motion.g>

              {/* badge */}
              <Badge x={240} y={112} text="Rafailov et al. 2023" color={P} delay={0.36} />
            </g>
          )}

          {/* Step 1: DPO loss formula with model count comparison */}
          {step === 1 && (
            <g>
              {/* DPO loss as visual formula */}
              <motion.text x={240} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill={B}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp }}>DPO Loss</motion.text>

              <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.06 }}>
                <rect x={40} y={22} width={400} height={28} rx={6}
                  fill={`${P}08`} stroke={P} strokeWidth={0.8} />
                <text x={240} y={40} textAnchor="middle" fontSize={8.5} fontWeight={500} fill={P}>
                  L = -E[ log sigma( beta * (log(pi_theta(yw)/pi_ref(yw)) - log(pi_theta(yl)/pi_ref(yl))) ) ]
                </text>
              </motion.g>

              {/* Model comparison: DPO vs RLHF */}
              <motion.text x={130} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={G}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.14 }}>DPO: 2개 모델</motion.text>

              <Box x={50} y={76} w={70} h={24} label="pi_theta" sub="학습 대상" color={B} delay={0.18} />
              <Box x={135} y={76} w={70} h={24} label="pi_ref" sub="고정 참조" color={W} delay={0.2} />

              <motion.text x={350} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={E}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.24 }}>RLHF: 4개 모델</motion.text>

              {[
                { label: 'Actor', x: 268 },
                { label: 'Critic', x: 322 },
                { label: 'RM', x: 376 },
                { label: 'Ref', x: 430 },
              ].map((m, i) => (
                <motion.g key={m.label}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 0.5, y: 0 }}
                  transition={{ ...sp, delay: 0.26 + i * 0.04 }}>
                  <rect x={m.x} y={76} width={44} height={24} rx={4}
                    fill={`${E}08`} stroke={E} strokeWidth={0.6} />
                  <text x={m.x + 22} y={92} textAnchor="middle"
                    fontSize={8} fill={E}>{m.label}</text>
                </motion.g>
              ))}

              <Badge x={240} y={120} text="beta = 0.1 (0.01~0.5)" color={W} delay={0.4} />
            </g>
          )}

          {/* Step 2: Pros vs Cons */}
          {step === 2 && (
            <g>
              {/* Pros */}
              <motion.text x={120} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={G}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp }}>DPO 장점</motion.text>
              {[
                { text: '구현 단순 (~20줄)', icon: '' },
                { text: '학습 안정 (PPO 불안정 없음)', icon: '' },
                { text: '계산 비용 적음 (RM 불필요)', icon: '' },
              ].map((item, i) => (
                <motion.g key={item.text}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.04 + i * 0.06 }}>
                  <rect x={20} y={22 + i * 28} width={200} height={22} rx={5}
                    fill={`${G}10`} stroke={G} strokeWidth={0.8} />
                  <text x={120} y={37 + i * 28} textAnchor="middle"
                    fontSize={8.5} fontWeight={500} fill={G}>{item.text}</text>
                </motion.g>
              ))}

              {/* Cons */}
              <motion.text x={370} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={E}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>DPO 단점</motion.text>
              {[
                'Offline (수집 데이터만)',
                '분포 이동 대응 어려움',
                '일부 태스크에서 PPO 이하',
              ].map((t, i) => (
                <motion.g key={t}
                  initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.24 + i * 0.06 }}>
                  <rect x={268} y={22 + i * 28} width={200} height={22} rx={5}
                    fill={`${E}08`} stroke={E} strokeWidth={0.8} strokeDasharray="3 2" />
                  <text x={368} y={37 + i * 28} textAnchor="middle"
                    fontSize={8.5} fontWeight={500} fill={E}>{t}</text>
                </motion.g>
              ))}

              {/* vs divider */}
              <motion.text x={244} y={60} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                transition={{ ...sp, delay: 0.15 }}>vs</motion.text>
            </g>
          )}

          {/* Step 3: CAI two stages */}
          {step === 3 && (
            <g>
              <motion.text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={B}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp }}>Constitutional AI (Anthropic 2022)</motion.text>

              {/* Stage 1 */}
              <motion.rect x={10} y={22} width={225} height={48} rx={6}
                fill={`${P}06`} stroke={P} strokeWidth={0.7}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.04 }} />
              <motion.text x={122} y={34} textAnchor="middle" fontSize={8} fontWeight={700} fill={P}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.06 }}>Stage 1 (CAI-SL)</motion.text>

              {/* Stage 1 inner flow */}
              <Box x={18} y={40} w={58} h={22} label="응답" color={E} delay={0.08} />
              <Arrow x1={78} y1={51} x2={88} y2={51} delay={0.1} />
              <Box x={90} y={40} w={65} h={22} label="Critique" color={P} delay={0.12} />
              <Arrow x1={157} y1={51} x2={167} y2={51} delay={0.14} />
              <Box x={169} y={40} w={58} h={22} label="SFT" color={G} delay={0.16} />

              {/* Stage 2 */}
              <motion.rect x={245} y={22} width={225} height={48} rx={6}
                fill={`${W}06`} stroke={W} strokeWidth={0.7}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.18 }} />
              <motion.text x={357} y={34} textAnchor="middle" fontSize={8} fontWeight={700} fill={W}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>Stage 2 (RLAIF)</motion.text>

              {/* Stage 2 inner flow */}
              <Box x={253} y={40} w={55} h={22} label="비교" color={B} delay={0.22} />
              <Arrow x1={310} y1={51} x2={318} y2={51} delay={0.24} />
              <Box x={320} y={40} w={45} h={22} label="RM" color={W} delay={0.26} />
              <Arrow x1={367} y1={51} x2={375} y2={51} delay={0.28} />
              <Box x={377} y={40} w={50} h={22} label="PPO" color={G} delay={0.3} />

              {/* connecting arrow between stages */}
              <Arrow x1={237} y1={46} x2={243} y2={46} delay={0.19} />

              {/* Constitution badge */}
              <Badge x={120} y={90} text="~50개 원칙 기반" color={W} delay={0.34} />
              <Badge x={340} y={90} text="인간 라벨 0" color={G} delay={0.36} />
            </g>
          )}

          {/* Step 4: 2024 landscape */}
          {step === 4 && (
            <g>
              {/* Three main pillars */}
              <motion.text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700}
                fill="var(--foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp }}>2024 정렬 기법 지형</motion.text>

              {/* Main three pillars */}
              {[
                { label: 'DPO', sub: '실무 표준', x: 30, color: B },
                { label: 'CAI', sub: '원칙 기반', x: 175, color: P },
                { label: 'RLAIF', sub: '비용 혁신', x: 320, color: G },
              ].map((p, i) => (
                <motion.g key={p.label}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.06 + i * 0.06 }}>
                  <rect x={p.x} y={22} width={130} height={40} rx={8}
                    fill={`${p.color}14`} stroke={p.color} strokeWidth={1.5} />
                  <text x={p.x + 65} y={40} textAnchor="middle"
                    fontSize={11} fontWeight={700} fill={p.color}>{p.label}</text>
                  <text x={p.x + 65} y={54} textAnchor="middle"
                    fontSize={8} fill="var(--muted-foreground)">{p.sub}</text>
                </motion.g>
              ))}

              {/* Derived methods below */}
              <motion.text x={240} y={82} textAnchor="middle" fontSize={8} fontWeight={600}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                transition={{ ...sp, delay: 0.28 }}>파생 기법</motion.text>

              {[
                { label: 'IPO', sub: 'DPO+정규화', x: 30, color: B },
                { label: 'ORPO', sub: 'SFT+DPO 통합', x: 130, color: B },
                { label: 'KTO', sub: '이진 피드백', x: 240, color: W },
                { label: 'SimPO', sub: 'ref-free', x: 345, color: W },
              ].map((m, i) => (
                <motion.g key={m.label}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.05 }}>
                  <rect x={m.x} y={90} width={90} height={30} rx={6}
                    fill={`${m.color}08`} stroke={m.color} strokeWidth={0.7} />
                  <text x={m.x + 45} y={103} textAnchor="middle"
                    fontSize={8.5} fontWeight={600} fill={m.color}>{m.label}</text>
                  <text x={m.x + 45} y={114} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">{m.sub}</text>
                </motion.g>
              ))}

              {/* connection lines from pillars to derived */}
              <Arrow x1={95} y1={64} x2={75} y2={88} delay={0.34} />
              <Arrow x1={95} y1={64} x2={175} y2={88} delay={0.36} />
              <Arrow x1={385} y1={64} x2={285} y2={88} delay={0.38} />
              <Arrow x1={385} y1={64} x2={390} y2={88} delay={0.4} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
