import { motion } from 'framer-motion';
import { C } from './OverviewVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slideR = (d: number) => ({ initial: { opacity: 0, x: -6 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

/* ── Step 0: 학습률이란 ── */
export function OverviewStep0() {
  return (
    <g>
      <text x={10} y={16} fontSize={10} fontWeight={700} fill="var(--foreground)">
        경사 하강법 업데이트 규칙
      </text>

      {/* formula */}
      <motion.g {...fade(0)}>
        <rect x={10} y={28} width={460} height={36} rx={6}
          fill={`${C.blue}08`} stroke={C.blue} strokeWidth={1} />
        <text x={240} y={50} textAnchor="middle" fontSize={13} fontFamily="monospace"
          fontWeight={700} fill={C.blue}>
          θ_new = θ_old − η × ∇L(θ)
        </text>
      </motion.g>

      {/* eta explanation */}
      <motion.g {...slideR(0.15)}>
        <rect x={10} y={76} width={140} height={50} rx={7}
          fill={`${C.green}08`} stroke={C.green} strokeWidth={1} />
        <text x={80} y={93} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>η (학습률)</text>
        <text x={80} y={108} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">이동 보폭 크기 제어</text>
        <text x={80} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">가장 중요한 하이퍼파라미터</text>
      </motion.g>

      {/* gradient */}
      <motion.g {...slideR(0.25)}>
        <rect x={170} y={76} width={140} height={50} rx={7}
          fill={`${C.purple}08`} stroke={C.purple} strokeWidth={1} />
        <text x={240} y={93} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.purple}>∇L(θ)</text>
        <text x={240} y={108} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Loss의 기울기</text>
        <text x={240} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">이동 방향 결정</text>
      </motion.g>

      {/* theta */}
      <motion.g {...slideR(0.35)}>
        <rect x={330} y={76} width={140} height={50} rx={7}
          fill={`${C.amber}08`} stroke={C.amber} strokeWidth={1} />
        <text x={400} y={93} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>θ (파라미터)</text>
        <text x={400} y={108} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">모델의 가중치</text>
        <text x={400} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">매 step 업데이트</text>
      </motion.g>

      {/* bottom note */}
      <motion.g {...fade(0.5)}>
        <rect x={10} y={140} width={460} height={22} rx={4}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={240} y={155} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">
          η가 크면 보폭 넓어 빠르지만 불안정 · η가 작으면 안정적이지만 느림
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: 너무 큰 LR — 발산 ── */
export function OverviewStep1() {
  /* loss surface 시각화 — 포물선 + 튕겨나가는 점 */
  const surfaceY = (x: number) => 130 - 80 * Math.exp(-((x - 240) ** 2) / 8000) + 10;
  const surfacePts = Array.from({ length: 46 }, (_, i) => {
    const x = 20 + i * 10;
    return `${x},${surfaceY(x)}`;
  }).join(' ');

  /* diverging path — 최솟값 주변에서 좌우로 튕김 */
  const divPath = [
    { x: 140, delay: 0 },
    { x: 320, delay: 0.15 },
    { x: 80, delay: 0.3 },
    { x: 380, delay: 0.45 },
  ];

  return (
    <g>
      <text x={10} y={16} fontSize={10} fontWeight={700} fill={C.red}>
        η이 너무 크면 — 발산 (Divergence)
      </text>

      {/* loss surface */}
      <motion.g {...fade(0)}>
        <polyline points={surfacePts} fill="none" stroke="var(--border)" strokeWidth={1.5} />
        <text x={240} y={65} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Loss Surface</text>
        <circle cx={240} cy={surfaceY(240)} r={3} fill={C.green} />
        <text x={240} y={surfaceY(240) - 8} textAnchor="middle" fontSize={7} fill={C.green}>최솟값</text>
      </motion.g>

      {/* bouncing ball */}
      {divPath.map((p, i) => (
        <motion.g key={i} {...fade(p.delay)}>
          <circle cx={p.x} cy={surfaceY(p.x)} r={5}
            fill={C.red} fillOpacity={0.6 - i * 0.1} stroke={C.red} strokeWidth={1} />
          {i > 0 && (
            <line x1={divPath[i - 1].x} y1={surfaceY(divPath[i - 1].x)}
              x2={p.x} y2={surfaceY(p.x)}
              stroke={C.red} strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
          )}
        </motion.g>
      ))}

      {/* NaN indicator */}
      <motion.g {...fade(0.6)}>
        <rect x={350} y={20} width={120} height={30} rx={6}
          fill={`${C.red}10`} stroke={C.red} strokeWidth={1.2} strokeDasharray="4 3" />
        <text x={410} y={38} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>
          loss → NaN
        </text>
      </motion.g>

      {/* bottom annotation */}
      <motion.g {...fade(0.7)}>
        <rect x={10} y={140} width={460} height={22} rx={4}
          fill={`${C.red}08`} stroke={C.red} strokeWidth={0.8} />
        <text x={240} y={155} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.red}>
          최솟값을 넘어 반대편으로 튕겨나감 → 진동 확대 → 발산
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: 너무 작은 LR — 느린 수렴 ── */
export function OverviewStep2() {
  const surfaceY = (x: number) => 130 - 80 * Math.exp(-((x - 240) ** 2) / 8000) + 10;
  const surfacePts = Array.from({ length: 46 }, (_, i) => {
    const x = 20 + i * 10;
    return `${x},${surfaceY(x)}`;
  }).join(' ');

  /* slow path — barely moving */
  const slowPath = [
    { x: 120, delay: 0 },
    { x: 128, delay: 0.15 },
    { x: 135, delay: 0.3 },
    { x: 141, delay: 0.45 },
    { x: 146, delay: 0.6 },
  ];

  return (
    <g>
      <text x={10} y={16} fontSize={10} fontWeight={700} fill={C.amber}>
        η이 너무 작으면 — 느린 수렴
      </text>

      {/* loss surface */}
      <motion.g {...fade(0)}>
        <polyline points={surfacePts} fill="none" stroke="var(--border)" strokeWidth={1.5} />
        <circle cx={240} cy={surfaceY(240)} r={3} fill={C.green} />
        <text x={240} y={surfaceY(240) - 8} textAnchor="middle" fontSize={7} fill={C.green}>최솟값</text>
      </motion.g>

      {/* tiny steps */}
      {slowPath.map((p, i) => (
        <motion.g key={i} {...fade(p.delay)}>
          <circle cx={p.x} cy={surfaceY(p.x)} r={4}
            fill={C.amber} fillOpacity={0.8} stroke={C.amber} strokeWidth={1} />
          {i > 0 && (
            <line x1={slowPath[i - 1].x} y1={surfaceY(slowPath[i - 1].x)}
              x2={p.x} y2={surfaceY(p.x)}
              stroke={C.amber} strokeWidth={1.2} />
          )}
        </motion.g>
      ))}

      {/* distance indicator */}
      <motion.g {...fade(0.7)}>
        <line x1={146} y1={surfaceY(146) + 15} x2={240} y2={surfaceY(240) + 15}
          stroke={C.dim} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={193} y={surfaceY(193) + 28} textAnchor="middle" fontSize={8} fill={C.dim}>
          아직 한참 남음...
        </text>
      </motion.g>

      {/* epoch counter */}
      <motion.g {...fade(0.5)}>
        <rect x={340} y={20} width={130} height={40} rx={6}
          fill={`${C.amber}08`} stroke={C.amber} strokeWidth={1} />
        <text x={405} y={38} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.amber}>100 epoch 경과</text>
        <text x={405} y={52} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">loss 거의 변화 없음</text>
      </motion.g>

      <motion.g {...fade(0.8)}>
        <rect x={10} y={140} width={460} height={22} rx={4}
          fill={`${C.amber}08`} stroke={C.amber} strokeWidth={0.8} />
        <text x={240} y={155} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.amber}>
          보폭이 너무 작아 최솟값까지 도달 불가 · saddle point에 갇힐 위험
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: 고정 LR vs 스케줄링 비교 ── */
export function OverviewStep3() {
  const totalSteps = 100;
  const steps = Array.from({ length: totalSteps + 1 }, (_, i) => i);

  const constant = steps.map(() => 0.8);
  const scheduled = steps.map((t) => {
    const warmup = 10;
    if (t < warmup) return 0.8 * (t / warmup);
    return 0.05 + 0.5 * (0.8 - 0.05) * (1 + Math.cos(Math.PI * (t - warmup) / (totalSteps - warmup)));
  });

  const px = (t: number) => 30 + (t / totalSteps) * 420;
  const py = (lr: number) => 125 - lr * 100;

  const pathOf = (arr: number[]) =>
    arr.map((lr, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${py(lr).toFixed(1)}`).join(' ');

  return (
    <g>
      <text x={10} y={16} fontSize={10} fontWeight={700} fill="var(--foreground)">
        고정 LR vs Warmup + Cosine Decay
      </text>

      {/* axes */}
      <motion.g {...fade(0)}>
        <line x1={30} y1={125} x2={455} y2={125} stroke="var(--border)" strokeWidth={1} />
        <line x1={30} y1={28} x2={30} y2={125} stroke="var(--border)" strokeWidth={1} />
        <text x={455} y={140} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">epoch</text>
        <text x={24} y={30} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">η</text>
        {[0, 50, 100].map((t) => (
          <text key={t} x={px(t)} y={138} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{t}</text>
        ))}
      </motion.g>

      {/* constant line */}
      <motion.g {...fade(0.1)}>
        <path d={pathOf(constant)} fill="none" stroke={C.dim} strokeWidth={2} strokeDasharray="6 3" />
        <text x={px(50)} y={py(0.8) - 6} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.dim}>
          고정 LR
        </text>
      </motion.g>

      {/* scheduled line */}
      <motion.g {...fade(0.25)}>
        <path d={pathOf(scheduled)} fill="none" stroke={C.blue} strokeWidth={2.5} />
      </motion.g>

      {/* warmup label */}
      <motion.g {...slideR(0.35)}>
        <rect x={30} y={28} width={44} height={14} rx={3}
          fill={`${C.red}12`} stroke={C.red} strokeWidth={0.8} />
        <text x={52} y={38} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.red}>Warmup</text>
      </motion.g>

      {/* decay label */}
      <motion.g {...slideR(0.45)}>
        <rect x={200} y={52} width={80} height={14} rx={3}
          fill={`${C.blue}12`} stroke={C.blue} strokeWidth={0.8} />
        <text x={240} y={62} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.blue}>Cosine Decay</text>
      </motion.g>

      {/* bottom summary */}
      <motion.g {...fade(0.55)}>
        <rect x={10} y={145} width={460} height={20} rx={4}
          fill={`${C.green}08`} stroke={C.green} strokeWidth={0.8} />
        <text x={240} y={159} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>
          2024 표준: Warmup(0→η) + Cosine Decay(η→0) — LLM 훈련 기본
        </text>
      </motion.g>
    </g>
  );
}
