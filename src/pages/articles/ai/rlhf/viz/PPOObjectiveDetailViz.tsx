import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const B = '#3b82f6', G = '#10b981', W = '#f59e0b', P = '#6366f1', E = '#ef4444';

/* ── 화살표 ── */
function Arrow({ x1, y1, x2, y2, color, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; delay?: number;
}) {
  const id = `pa-${x1}-${y1}-${x2}-${y2}`;
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
  { label: '1. PPO 목적 함수', body: 'L(θ) = E[min(r·A, clip(r)·A)] — 정책 비율을 클리핑하여 한 번에 큰 업데이트를 방지' },
  { label: '2. 전체 RLHF Objective', body: 'L(θ) = E[r_φ(x,y)] - β·KL(π_θ ∥ π_ref)\n보상 최대화 + 참조 모델과의 거리 제약' },
  { label: '3. 4-Model System', body: 'Actor(응답 생성) + Critic(가치 추정) + Reference(기준) + Reward(평가)\nLLaMA-7B 기준 28B 파라미터 상주 → GPU 80GB×4~8' },
  { label: '4. Token-level Reward & GAE', body: 'r_t = RM점수 - β·log(π_θ/π_ref), 토큰별 KL 페널티\nGAE로 Advantage 계산: A_t = Σ (γλ)^l · δ_{t+l}' },
];

export default function PPOObjectiveDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 135" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: PPO 클리핑 목적 함수 */}
          {step === 0 && (
            <g>
              {/* 메인 수식 박스 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0 }}>
                <rect x={10} y={4} width={460} height={34} rx={8} fill="var(--card)" stroke={P} strokeWidth={1} />
                <text x={240} y={26} textAnchor="middle" fontSize={10} fontWeight={700} fill={P}>
                  L = E[ min( r_t · A_t , clip(r_t, 1-ε, 1+ε) · A_t ) ]
                </text>
              </motion.g>

              {/* 변수 설명 카드 3개 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={10} y={48} width={145} height={38} rx={6} fill={`${B}10`} stroke={B} strokeWidth={0.7} />
                <text x={82} y={64} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={B}>r_t(θ) = π_θ / π_old</text>
                <text x={82} y={78} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">정책 비율</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={168} y={48} width={145} height={38} rx={6} fill={`${G}10`} stroke={G} strokeWidth={0.7} />
                <text x={240} y={64} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={G}>A_t = Advantage</text>
                <text x={240} y={78} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">GAE로 추정</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.25 }}>
                <rect x={326} y={48} width={144} height={38} rx={6} fill={`${W}10`} stroke={W} strokeWidth={0.7} />
                <text x={398} y={64} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={W}>ε = 0.2</text>
                <text x={398} y={78} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">클리핑 범위</text>
              </motion.g>

              {/* 클리핑 시각화 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
                <rect x={10} y={96} width={460} height={32} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                {/* 클리핑 범위 바 */}
                <text x={22} y={113} fontSize={8} fill="var(--muted-foreground)">r_t 허용:</text>
                <rect x={80} y={104} width={300} height={14} rx={3} fill="var(--border)" opacity={0.15} />
                {/* 클리핑 안 되는 구간 (빨간 양 끝) */}
                <rect x={80} y={104} width={60} height={14} rx={3} fill={`${E}15`} />
                <rect x={320} y={104} width={60} height={14} rx={3} fill={`${E}15`} />
                {/* 허용 구간 (녹색 가운데) */}
                <rect x={140} y={104} width={180} height={14} rx={0} fill={`${G}20`} />
                {/* 경계선 */}
                <line x1={140} y1={102} x2={140} y2={120} stroke={W} strokeWidth={1} />
                <line x1={320} y1={102} x2={320} y2={120} stroke={W} strokeWidth={1} />
                <text x={140} y={100} textAnchor="middle" fontSize={7} fontWeight={600} fill={W}>0.8</text>
                <text x={320} y={100} textAnchor="middle" fontSize={7} fontWeight={600} fill={W}>1.2</text>
                <text x={230} y={114} textAnchor="middle" fontSize={8} fontWeight={600} fill={G}>허용</text>
                <text x={105} y={114} textAnchor="middle" fontSize={7} fill={E}>clip</text>
                <text x={345} y={114} textAnchor="middle" fontSize={7} fill={E}>clip</text>
                {/* 1.0 중심 */}
                <line x1={230} y1={104} x2={230} y2={118} stroke="var(--foreground)" strokeWidth={0.5} strokeDasharray="2 2" />
                <text x={230} y={126} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">1.0</text>
                {/* min 설명 */}
                <text x={400} y={114} fontSize={7.5} fill="var(--muted-foreground)">min → 보수적</text>
              </motion.g>
            </g>
          )}

          {/* Step 1: 전체 RLHF Objective */}
          {step === 1 && (
            <g>
              {/* 메인 수식 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0 }}>
                <rect x={10} y={4} width={460} height={34} rx={8} fill="var(--card)" stroke={P} strokeWidth={1} />
                <text x={240} y={26} textAnchor="middle" fontSize={10} fontWeight={700} fill={P}>
                  L(θ) = E[ r_φ(x, y) ] - β · KL( π_θ ∥ π_ref )
                </text>
              </motion.g>

              {/* 보상 최대화 (왼쪽) */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={10} y={48} width={220} height={44} rx={8} fill="var(--card)" stroke={G} strokeWidth={0.7} />
                <text x={120} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={G}>E[ r_φ(x, y) ]</text>
                <text x={120} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">보상 점수 최대화 (높을수록 좋음)</text>
              </motion.g>

              {/* 마이너스 기호 */}
              <motion.text x={240} y={74} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
                -
              </motion.text>

              {/* KL 제약 (오른쪽) */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.25 }}>
                <rect x={252} y={48} width={218} height={44} rx={8} fill="var(--card)" stroke={E} strokeWidth={0.7} />
                <text x={361} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={E}>β · KL( π_θ ∥ π_ref )</text>
                <text x={361} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">참조 모델과 거리 제약 (작아야 함)</text>
              </motion.g>

              {/* β 조절 시각화 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.35 }}>
                <rect x={10} y={102} width={460} height={28} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={22} y={120} fontSize={8} fontWeight={600} fill={W}>β 조절:</text>
                {/* β 스펙트럼 바 */}
                <rect x={80} y={110} width={280} height={10} rx={5} fill="var(--border)" opacity={0.15} />
                {/* 그라디언트 대신 두 색으로 */}
                <rect x={80} y={110} width={140} height={10} rx={5} fill={`${G}30`} />
                <rect x={220} y={110} width={140} height={10} rx={5} fill={`${E}30`} />
                <text x={110} y={119} fontSize={7} fontWeight={600} fill={G}>작음</text>
                <text x={155} y={119} fontSize={7} fill="var(--muted-foreground)">공격적</text>
                <text x={300} y={119} fontSize={7} fontWeight={600} fill={E}>큼</text>
                <text x={330} y={119} fontSize={7} fill="var(--muted-foreground)">보수적</text>
                <text x={400} y={120} fontSize={7.5} fill={W}>adaptive β 가능</text>
              </motion.g>
            </g>
          )}

          {/* Step 2: 4-Model System */}
          {step === 2 && (
            <g>
              {/* Actor */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0 }}>
                <rect x={10} y={6} width={105} height={50} rx={8} fill="var(--card)" stroke={B} strokeWidth={1} />
                <rect x={10} y={6} width={105} height={16} rx={8} fill={`${B}15`} />
                <rect x={10} y={18} width={105} height={4} fill="var(--card)" />
                <text x={62} y={18} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={B}>Actor π_θ</text>
                <text x={62} y={36} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">응답 생성</text>
                <text x={62} y={48} textAnchor="middle" fontSize={7} fontWeight={600} fill={B}>PPO 업데이트</text>
              </motion.g>

              {/* Reference */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.08 }}>
                <rect x={128} y={6} width={105} height={50} rx={8} fill="var(--card)" stroke={P} strokeWidth={1} />
                <rect x={128} y={6} width={105} height={16} rx={8} fill={`${P}15`} />
                <rect x={128} y={18} width={105} height={4} fill="var(--card)" />
                <text x={180} y={18} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={P}>Reference π_ref</text>
                <text x={180} y={36} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">KL 기준선</text>
                <text x={180} y={48} textAnchor="middle" fontSize={7} fontWeight={600} fill={P}>고정 (frozen)</text>
              </motion.g>

              {/* Critic */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.16 }}>
                <rect x={246} y={6} width={105} height={50} rx={8} fill="var(--card)" stroke={W} strokeWidth={1} />
                <rect x={246} y={6} width={105} height={16} rx={8} fill={`${W}15`} />
                <rect x={246} y={18} width={105} height={4} fill="var(--card)" />
                <text x={298} y={18} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={W}>Critic V_φ</text>
                <text x={298} y={36} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">가치 V(s) 추정</text>
                <text x={298} y={48} textAnchor="middle" fontSize={7} fontWeight={600} fill={W}>Advantage용</text>
              </motion.g>

              {/* Reward */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.24 }}>
                <rect x={364} y={6} width={105} height={50} rx={8} fill="var(--card)" stroke={G} strokeWidth={1} />
                <rect x={364} y={6} width={105} height={16} rx={8} fill={`${G}15`} />
                <rect x={364} y={18} width={105} height={4} fill="var(--card)" />
                <text x={416} y={18} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={G}>Reward r_ψ</text>
                <text x={416} y={36} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">응답 품질 평가</text>
                <text x={416} y={48} textAnchor="middle" fontSize={7} fontWeight={600} fill={G}>고정 (frozen)</text>
              </motion.g>

              {/* 흐름 화살표 */}
              <Arrow x1={62} y1={58} x2={62} y2={72} color={B} delay={0.3} />
              <Arrow x1={416} y1={58} x2={416} y2={72} color={G} delay={0.32} />

              {/* 메모리 부담 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.35 }}>
                <rect x={10} y={74} width={460} height={52} rx={8} fill="var(--card)" stroke={E} strokeWidth={0.7} strokeDasharray="4 3" />
                <text x={24} y={92} fontSize={9} fontWeight={700} fill={E}>메모리 부담</text>

                {/* 모델 크기 바 */}
                <rect x={120} y={83} width={60} height={14} rx={3} fill={`${B}20`} stroke={B} strokeWidth={0.5} />
                <text x={150} y={94} textAnchor="middle" fontSize={7.5} fill={B}>7B</text>
                <text x={187} y={94} fontSize={7} fill="var(--muted-foreground)">+</text>
                <rect x={195} y={83} width={60} height={14} rx={3} fill={`${P}20`} stroke={P} strokeWidth={0.5} />
                <text x={225} y={94} textAnchor="middle" fontSize={7.5} fill={P}>7B</text>
                <text x={262} y={94} fontSize={7} fill="var(--muted-foreground)">+</text>
                <rect x={270} y={83} width={60} height={14} rx={3} fill={`${W}20`} stroke={W} strokeWidth={0.5} />
                <text x={300} y={94} textAnchor="middle" fontSize={7.5} fill={W}>7B</text>
                <text x={337} y={94} fontSize={7} fill="var(--muted-foreground)">+</text>
                <rect x={345} y={83} width={60} height={14} rx={3} fill={`${G}20`} stroke={G} strokeWidth={0.5} />
                <text x={375} y={94} textAnchor="middle" fontSize={7.5} fill={G}>7B</text>
                <text x={420} y={94} fontSize={8} fontWeight={700} fill={E}>= 28B</text>

                <text x={24} y={118} fontSize={8} fill="var(--muted-foreground)">GPU 80GB x 4~8 필요</text>
                <text x={240} y={118} fontSize={8} fontWeight={600} fill={E}>RLHF가 비싼 이유</text>
              </motion.g>
            </g>
          )}

          {/* Step 3: Token-level Reward & GAE */}
          {step === 3 && (
            <g>
              {/* Token-level Reward 수식 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0 }}>
                <rect x={10} y={4} width={460} height={34} rx={8} fill="var(--card)" stroke={P} strokeWidth={1} />
                <text x={240} y={18} textAnchor="middle" fontSize={8} fontWeight={700} fill={B}>Token-level Reward</text>
                <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={600} fill={P}>
                  r_t = r_φ(x, y) - β · log( π_θ / π_ref )
                </text>
              </motion.g>

              {/* 분해 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={10} y={46} width={220} height={28} rx={6} fill={`${G}10`} stroke={G} strokeWidth={0.7} />
                <text x={120} y={64} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={G}>r_φ(x, y) = RM 점수</text>
              </motion.g>
              <motion.text x={240} y={64} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
                -
              </motion.text>
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={252} y={46} width={218} height={28} rx={6} fill={`${E}10`} stroke={E} strokeWidth={0.7} />
                <text x={361} y={64} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={E}>β · log(π_θ/π_ref) = KL 페널티</text>
              </motion.g>

              {/* GAE 수식 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <rect x={10} y={82} width={460} height={46} rx={8} fill="var(--card)" stroke={W} strokeWidth={0.7} />
                <text x={24} y={98} fontSize={8.5} fontWeight={700} fill={W}>GAE (Generalized Advantage Estimation)</text>

                {/* 수식 두 줄 */}
                <text x={24} y={114} fontSize={9} fontWeight={600} fill={P}>
                  A_t = Σ (γλ)^l · δ_t+l
                </text>
                <text x={240} y={114} fontSize={9} fontWeight={600} fill={P}>
                  δ_t = r_t + γ·V(s_t+1) - V(s_t)
                </text>

                {/* 파라미터 뱃지 */}
                <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.4 }}>
                  <rect x={360} y={94} width={48} height={16} rx={8} fill={`${W}15`} stroke={W} strokeWidth={0.5} />
                  <text x={384} y={106} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={W}>γ = 1.0</text>
                </motion.g>
                <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.45 }}>
                  <rect x={414} y={94} width={48} height={16} rx={8} fill={`${W}15`} stroke={W} strokeWidth={0.5} />
                  <text x={438} y={106} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={W}>λ = 0.95</text>
                </motion.g>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
