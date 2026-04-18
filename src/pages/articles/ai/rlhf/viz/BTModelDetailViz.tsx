import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const B = '#3b82f6', G = '#10b981', W = '#f59e0b', P = '#6366f1', E = '#ef4444';

/* ── 화살표 ── */
function Arrow({ x1, y1, x2, y2, color, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; delay?: number;
}) {
  const id = `bta-${x1}-${y1}-${x2}-${y2}`;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay }}>
      <defs>
        <marker id={id} viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <polygon points="0,0 6,3 0,6" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd={`url(#${id})`} />
    </motion.g>
  );
}

const STEPS = [
  { label: '1. Bradley-Terry 모델 원리', body: '1952년 선수 실력 추정 모델 → RLHF에서 응답 품질 학습에 적용\nP(i beats j) = sigmoid(r_i - r_j)' },
  { label: '2. RLHF 적용과 Loss', body: 'P(y_w > y_l | x) = σ(r_θ(x,y_w) - r_θ(x,y_l))\nBCE와 동일 — 이진 분류 문제로 변환' },
  { label: '3. RM 아키텍처', body: 'Base LLM + 마지막 토큰에 scalar head\nr(x,y) = Linear(hidden_dim, 1)(model(x+y)[last])' },
  { label: '4. RM 평가와 문제점', body: 'Accuracy 75~85% 좋음, Reward Hacking이 최대 약점\n분포 이동, 라벨러 편향도 주요 문제' },
];

export default function BTModelDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 135" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Bradley-Terry 모델 원리 */}
          {step === 0 && (
            <g>
              {/* 선수 비교 다이어그램 */}
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0 }}>
                <circle cx={60} cy={35} r={22} fill={`${B}15`} stroke={B} strokeWidth={1} />
                <text x={60} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={B}>i</text>
                <text x={60} y={44} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">r_i</text>
              </motion.g>

              <motion.text x={120} y={38} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
                vs
              </motion.text>

              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.05 }}>
                <circle cx={180} cy={35} r={22} fill={`${E}15`} stroke={E} strokeWidth={1} />
                <text x={180} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={E}>j</text>
                <text x={180} y={44} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">r_j</text>
              </motion.g>

              <Arrow x1={204} y1={35} x2={240} y2={35} color={P} delay={0.15} />

              {/* 수식 박스 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={244} y={12} width={226} height={48} rx={8} fill="var(--card)" stroke={P} strokeWidth={1} />
                <text x={357} y={30} textAnchor="middle" fontSize={9} fontWeight={700} fill={P}>P(i beats j)</text>
                <text x={357} y={46} textAnchor="middle" fontSize={10} fontWeight={600} fill={P}>= sigmoid( r_i - r_j )</text>
              </motion.g>

              {/* 설명 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <rect x={10} y={72} width={460} height={54} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={24} y={90} fontSize={8.5} fill="var(--foreground)">
                  <tspan fontWeight={600} fill={W}>r_i</tspan>
                  <tspan> = 선수 i의 잠재 실력 (latent score)</tspan>
                </text>
                <text x={24} y={105} fontSize={8} fill="var(--muted-foreground)">실력 차이가 클수록 이길 확률 높음 — 절대 점수 불필요, 상대 비교만으로 추정</text>
                <text x={24} y={118} fontSize={8} fill={G}>1952년 체스 랭킹 → RLHF 응답 품질 비교에 적용</text>
              </motion.g>
            </g>
          )}

          {/* Step 1: RLHF 적용과 Loss */}
          {step === 1 && (
            <g>
              {/* 입력: prompt + responses */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0 }}>
                <rect x={10} y={6} width={65} height={26} rx={5} fill={`${B}15`} stroke={B} strokeWidth={0.7} />
                <text x={42} y={23} textAnchor="middle" fontSize={8} fontWeight={600} fill={B}>prompt x</text>
              </motion.g>

              {/* winner */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.05 }}>
                <rect x={85} y={6} width={70} height={26} rx={5} fill={`${G}15`} stroke={G} strokeWidth={0.7} />
                <text x={120} y={23} textAnchor="middle" fontSize={8} fontWeight={600} fill={G}>y_w (선호)</text>
              </motion.g>

              {/* loser */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={165} y={6} width={70} height={26} rx={5} fill={`${E}15`} stroke={E} strokeWidth={0.7} />
                <text x={200} y={23} textAnchor="middle" fontSize={8} fontWeight={600} fill={E}>y_l (거절)</text>
              </motion.g>

              <Arrow x1={237} y1={19} x2={258} y2={19} color={P} delay={0.15} />

              {/* 확률 수식 */}
              <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={262} y={4} width={208} height={30} rx={6} fill="var(--card)" stroke={P} strokeWidth={1} />
                <text x={366} y={24} textAnchor="middle" fontSize={9} fontWeight={600} fill={P}>
                  P(y_w ≻ y_l | x) = σ(r_w - r_l)
                </text>
              </motion.g>

              {/* Loss 수식 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <rect x={10} y={44} width={460} height={38} rx={8} fill="var(--card)" stroke={W} strokeWidth={1} />
                <text x={24} y={59} fontSize={8} fontWeight={700} fill={W}>MLE Loss (= BCE)</text>
                <text x={240} y={74} textAnchor="middle" fontSize={10} fontWeight={600} fill={P}>
                  L = -E[ log σ( r_θ(x, y_w) - r_θ(x, y_l) ) ]
                </text>
              </motion.g>

              {/* 해석 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.4 }}>
                <rect x={10} y={92} width={460} height={36} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={108} textAnchor="middle" fontSize={8.5} fill="var(--foreground)">
                  chosen의 보상을 높이고 rejected의 보상을 낮추는 이진 분류 문제
                </text>
                <text x={240} y={121} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  r_w - r_l 차이가 클수록 loss 감소 → RM이 선호 구별력 학습
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 2: RM 아키텍처 */}
          {step === 2 && (
            <g>
              {/* 입력 */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0 }}>
                <rect x={10} y={25} width={70} height={38} rx={6} fill={`${B}12`} stroke={B} strokeWidth={0.7} />
                <text x={45} y={41} textAnchor="middle" fontSize={8} fontWeight={600} fill={B}>x + y</text>
                <text x={45} y={53} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">prompt+응답</text>
              </motion.g>

              <Arrow x1={82} y1={44} x2={108} y2={44} color={B} delay={0.1} />

              {/* Base LLM */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={112} y={12} width={120} height={65} rx={8} fill="var(--card)" stroke={P} strokeWidth={1} />
                <rect x={112} y={12} width={120} height={20} rx={8} fill={`${P}15`} />
                <rect x={112} y={26} width={120} height={6} fill="var(--card)" />
                <text x={172} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill={P}>Base LLM</text>
                <text x={172} y={44} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">사전학습 or SFT</text>
                {/* hidden states 표현 */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <rect key={i} x={122 + i * 20} y={54} width={14} height={14} rx={2}
                    fill={i === 4 ? `${W}30` : `${P}10`} stroke={i === 4 ? W : 'var(--border)'} strokeWidth={0.5} />
                ))}
                <text x={172} y={79} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">hidden states</text>
              </motion.g>

              {/* last token 화살표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.25 }}>
                <line x1={216} y1={61} x2={252} y2={61} stroke={W} strokeWidth={1.2} />
                <polygon points="250,57 258,61 250,65" fill={W} />
                <text x={237} y={53} textAnchor="middle" fontSize={7} fontWeight={600} fill={W}>[last]</text>
              </motion.g>

              {/* Scalar Head */}
              <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <rect x={262} y={38} width={100} height={46} rx={6} fill="var(--card)" stroke={G} strokeWidth={1} />
                <text x={312} y={55} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={G}>Scalar Head</text>
                <text x={312} y={69} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">Linear(dim, 1)</text>
              </motion.g>

              <Arrow x1={364} y1={61} x2={395} y2={61} color={G} delay={0.35} />

              {/* 최종 출력 */}
              <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <circle cx={425} cy={61} r={22} fill={`${W}15`} stroke={W} strokeWidth={1.2} />
                <text x={425} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={W}>r(x,y)</text>
                <text x={425} y={70} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">scalar</text>
              </motion.g>

              {/* Loss 수식 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.45 }}>
                <rect x={10} y={98} width={460} height={30} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={24} y={117} fontSize={8} fontWeight={600} fill={W}>reward_loss</text>
                <text x={100} y={117} fontSize={8.5} fill={P}>= -log σ( r_chosen - r_rejected ).mean()</text>
              </motion.g>
            </g>
          )}

          {/* Step 3: RM 평가와 문제점 */}
          {step === 3 && (
            <g>
              {/* 정확도 바 차트 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0 }}>
                <rect x={10} y={4} width={220} height={56} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={24} y={20} fontSize={9} fontWeight={700} fill={B}>RM 정확도 (r_w {'>'} r_l 비율)</text>
              </motion.g>
              {/* 바 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={22} y={28} width={196} height={10} rx={3} fill="var(--border)" opacity={0.2} />
                <rect x={22} y={28} width={130} height={10} rx={3} fill={`${W}50`} />
                <rect x={22} y={28} width={98} height={10} rx={3} fill={`${G}50`} />
                {/* tick marks */}
                <line x1={150} y1={28} x2={150} y2={38} stroke={G} strokeWidth={0.7} />
                <line x1={170} y1={28} x2={170} y2={38} stroke={B} strokeWidth={0.7} />
                <text x={75} y={52} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">65-75% 보통</text>
                <text x={150} y={52} textAnchor="middle" fontSize={7} fontWeight={600} fill={G}>75-85% 좋음</text>
                <text x={204} y={52} textAnchor="middle" fontSize={7} fill={B}>85%+</text>
              </motion.g>

              {/* 문제점 3가지 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={242} y={4} width={228} height={56} rx={8} fill="var(--card)" stroke={E} strokeWidth={0.7} strokeDasharray="4 3" />
                <text x={356} y={20} textAnchor="middle" fontSize={9} fontWeight={700} fill={E}>주요 문제점</text>
              </motion.g>

              {/* 문제 1: Reward Hacking */}
              <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={252} y={26} width={68} height={28} rx={4} fill={`${E}12`} stroke={E} strokeWidth={0.6} />
                <text x={286} y={38} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={E}>Reward</text>
                <text x={286} y={49} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={E}>Hacking</text>
              </motion.g>
              <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.25 }}>
                <rect x={328} y={26} width={62} height={28} rx={4} fill={`${E}12`} stroke={E} strokeWidth={0.6} />
                <text x={359} y={38} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={E}>Distribution</text>
                <text x={359} y={49} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={E}>Shift</text>
              </motion.g>
              <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <rect x={398} y={26} width={62} height={28} rx={4} fill={`${E}12`} stroke={E} strokeWidth={0.6} />
                <text x={429} y={38} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={E}>Labeler</text>
                <text x={429} y={49} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={E}>편향</text>
              </motion.g>

              {/* Reward Hacking 상세 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.35 }}>
                <rect x={10} y={70} width={460} height={56} rx={8} fill="var(--card)" stroke={W} strokeWidth={0.7} />
                <text x={24} y={86} fontSize={8.5} fontWeight={700} fill={E}>Reward Hacking 예시</text>
                <text x={24} y={100} fontSize={8} fill="var(--muted-foreground)">
                  길이만 긴 응답, 특정 패턴 반복 → RM 취약점 악용하여 높은 점수 획득
                </text>
                <text x={24} y={118} fontSize={8.5} fontWeight={600} fill={G}>해결:</text>
                <text x={55} y={118} fontSize={8} fill="var(--muted-foreground)">KL 제약 (SFT와의 거리 제한)</text>
                <text x={210} y={118} fontSize={8} fill="var(--muted-foreground)">| Iterative RM 업데이트</text>
                <text x={370} y={118} fontSize={8} fill="var(--muted-foreground)">| Majority vote</text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
