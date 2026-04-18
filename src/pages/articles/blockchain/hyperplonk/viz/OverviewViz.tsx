import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const CI = '#6366f1', CG = '#10b981', CW = '#f59e0b', CR = '#ef4444', CP = '#8b5cf6';

const STEPS = [
  {
    label: 'PLONK vs HyperPLONK 아키텍처',
    body: 'PLONK: 단변수 다항식 + FFT + KZG → O(n log n) prover.\nHyperPLONK: 다중선형 + sumcheck + 다중선형 PCS → O(n) prover.',
  },
  {
    label: '불리언 하이퍼큐브 {0,1}^log n',
    body: 'n개 게이트를 log n비트 인덱스로 표현.\n각 꼭짓점이 게이트 witness 값에 1:1 대응 — 다중선형 표현의 자연스러운 도메인.',
  },
  {
    label: 'Sumcheck 차원 축소',
    body: 'k개 변수를 1개씩 랜덤값으로 고정 — 매 라운드 합산 공간 절반.\nk라운드 후 단일 점 평가(오라클 질의)로 검증 완료.',
  },
  {
    label: '다중선형 PCS 선택지',
    body: 'Dory: 투명 셋업 + 로그 증명. Zeromorph: KZG 기반 + 상수 증명.\nBasefold: Merkle 기반 투명 + 빠른 prover.',
  },
];

/* ── Step 0: PLONK vs HyperPLONK parallel pipeline ── */
function ArchCompare() {
  const leftX = 20, rightX = 250, arrowC = 'var(--muted-foreground)';
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {/* PLONK pipeline (top) */}
      <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.1 }}>
        <text x={leftX} y={14} fontSize={10} fontWeight={700} fill={CR}>PLONK</text>
        <text x={leftX + 44} y={14} fontSize={8} fill="var(--muted-foreground)">O(n log n)</text>
        <ModuleBox x={leftX} y={22} w={72} h={36} label="단변수" sub="w(X), 차수 n" color={CR} />
        <line x1={leftX + 72} y1={40} x2={leftX + 82} y2={40} stroke={arrowC} strokeWidth={0.7} markerEnd="url(#arrowR)" />
        <AlertBox x={leftX + 84} y={22} w={60} h={36} label="FFT" sub="O(n log n)" color={CR} />
        <line x1={leftX + 144} y1={40} x2={leftX + 154} y2={40} stroke={arrowC} strokeWidth={0.7} markerEnd="url(#arrowR)" />
        <ModuleBox x={leftX + 156} y={22} w={56} h={36} label="KZG" sub="PCS" color={CR} />
      </motion.g>

      {/* vs divider */}
      <line x1={10} y1={72} x2={460} y2={72} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 2" />
      <text x={240} y={80} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--muted-foreground)">vs</text>

      {/* HyperPLONK pipeline (bottom) */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.25 }}>
        <text x={leftX} y={98} fontSize={10} fontWeight={700} fill={CG}>HyperPLONK</text>
        <text x={leftX + 84} y={98} fontSize={8} fill="var(--muted-foreground)">O(n)</text>
        <ModuleBox x={leftX} y={106} w={72} h={36} label="다중선형" sub="f(x₁..xₖ), 차수 1" color={CG} />
        <line x1={leftX + 72} y1={124} x2={leftX + 82} y2={124} stroke={arrowC} strokeWidth={0.7} markerEnd="url(#arrowG)" />
        <ActionBox x={leftX + 84} y={106} w={68} h={36} label="Sumcheck" sub="O(n) 선형" color={CG} />
        <line x1={leftX + 152} y1={124} x2={leftX + 162} y2={124} stroke={arrowC} strokeWidth={0.7} markerEnd="url(#arrowG)" />
        <ModuleBox x={leftX + 164} y={106} w={72} h={36} label="ML-PCS" sub="Dory/Zeromorph" color={CG} />
      </motion.g>

      {/* result badges */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.45 }}>
        <DataBox x={rightX + 50} y={24} w={110} h={28} label="FFT 병목 제거" color={CG} />
        <DataBox x={rightX + 50} y={112} w={110} h={28} label="GPU 병렬화 적합" color={CG} />
      </motion.g>

      {/* arrow markers */}
      <defs>
        <marker id="arrowR" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <polygon points="0,0 6,3 0,6" fill={arrowC} />
        </marker>
        <marker id="arrowG" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <polygon points="0,0 6,3 0,6" fill={CG} />
        </marker>
      </defs>
    </motion.g>
  );
}

/* ── Step 1: Boolean Hypercube ── */
function HypercubeStep() {
  /* 8 gates → {0,1}^3 */
  const bits = [
    [0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1],
    [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1],
  ];
  const cubeX = 280, cubeY = 20;
  /* cube vertex positions (isometric-ish) */
  const vx = (b: number[]) => cubeX + b[2] * 50 + b[1] * 30;
  const vy = (b: number[]) => cubeY + b[0] * 60 + b[1] * 24 + 20;
  /* cube edges: connect vertices differing by 1 bit */
  const edges: [number, number][] = [];
  for (let i = 0; i < 8; i++)
    for (let j = i + 1; j < 8; j++) {
      const diff = bits[i].reduce((s, v, k) => s + Math.abs(v - bits[j][k]), 0);
      if (diff === 1) edges.push([i, j]);
    }

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {/* gate index table */}
      <text x={20} y={16} fontSize={10} fontWeight={700} fill={CI}>게이트 인덱스 → 비트 분해</text>
      <text x={20} y={30} fontSize={8} fill="var(--muted-foreground)">n=8 게이트, log n = 3비트</text>
      {bits.map((b, i) => {
        const ty = 44 + i * 14;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.05 * i }}>
            <text x={28} y={ty} fontSize={8} fontWeight={600} fill="var(--foreground)">
              w[{i}]
            </text>
            <text x={58} y={ty} fontSize={8} fill="var(--muted-foreground)">→</text>
            <text x={70} y={ty} fontSize={8} fontWeight={600} fill={CI}>
              ({b[0]},{b[1]},{b[2]})
            </text>
            <text x={115} y={ty} fontSize={7} fill="var(--muted-foreground)">
              f({b.join(',')})
            </text>
          </motion.g>
        );
      })}

      {/* 3D cube */}
      <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <text x={cubeX + 40} y={14} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={CP}>{'{0,1}'}&#xB3; 하이퍼큐브</text>
        {/* edges */}
        {edges.map(([a, b], i) => (
          <line key={`e${i}`}
            x1={vx(bits[a])} y1={vy(bits[a])}
            x2={vx(bits[b])} y2={vy(bits[b])}
            stroke="var(--border)" strokeWidth={0.7} />
        ))}
        {/* vertices */}
        {bits.map((b, i) => (
          <g key={`v${i}`}>
            <circle cx={vx(b)} cy={vy(b)} r={10}
              fill="var(--card)" stroke={CI} strokeWidth={1} />
            <text x={vx(b)} y={vy(b) + 3} textAnchor="middle"
              fontSize={7} fontWeight={600} fill={CI}>{b.join('')}</text>
          </g>
        ))}
      </motion.g>
    </motion.g>
  );
}

/* ── Step 2: Sumcheck dimension reduction ── */
function SumcheckReduction() {
  const k = 4;
  const rounds = Array.from({ length: k }, (_, i) => i);
  const bw = 58, gap = 10, startX = 30, startY = 50;

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={CW}>
        Sumcheck: k={k} 라운드 차원 축소
      </text>
      <text x={240} y={30} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
        합산 공간 2&#x207F; → 2&#x207F;&#x207B;&#xB9; → ... → 1 → 오라클 질의
      </text>

      {/* dimension boxes */}
      {rounds.map((r) => {
        const x = startX + r * (bw + gap + 20);
        const freeVars = k - r;
        const barH = 8 + freeVars * 12;
        return (
          <motion.g key={r} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.12 * r }}>
            {/* round label */}
            <text x={x + bw / 2} y={startY - 4} textAnchor="middle"
              fontSize={8} fontWeight={600} fill={CW}>R{r + 1}</text>
            {/* box representing remaining vars */}
            <rect x={x} y={startY} width={bw} height={barH} rx={5}
              fill={`${CW}10`} stroke={CW} strokeWidth={0.8} />
            {/* free var indicators */}
            {Array.from({ length: freeVars }, (_, vi) => (
              <g key={vi}>
                <circle cx={x + 14} cy={startY + 10 + vi * 12} r={3.5}
                  fill={vi === 0 ? CW : `${CI}40`} stroke={vi === 0 ? CW : CI} strokeWidth={0.5} />
                <text x={x + 22} y={startY + 13 + vi * 12}
                  fontSize={7} fill={vi === 0 ? CW : 'var(--muted-foreground)'}>
                  {vi === 0 ? `X${r + 1} → r${r + 1}` : `x${r + 1 + vi + 1}`}
                </text>
              </g>
            ))}
            {/* arrow to next */}
            {r < k - 1 && (
              <g>
                <line x1={x + bw + 2} y1={startY + barH / 2}
                  x2={x + bw + 16} y2={startY + barH / 2}
                  stroke="var(--muted-foreground)" strokeWidth={0.6} markerEnd="url(#arwS)" />
                <text x={x + bw + 9} y={startY + barH / 2 - 5} textAnchor="middle"
                  fontSize={7} fill="var(--muted-foreground)">고정</text>
              </g>
            )}
          </motion.g>
        );
      })}

      {/* final oracle query */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.6 }}>
        {(() => {
          const fx = startX + k * (bw + gap + 20) - 12;
          return (
            <g>
              <line x1={fx - 10} y1={startY + 16} x2={fx} y2={startY + 16}
                stroke={CG} strokeWidth={0.7} markerEnd="url(#arwSg)" />
              <rect x={fx + 2} y={startY - 2} width={72} height={36} rx={18}
                fill={`${CG}12`} stroke={CG} strokeWidth={1} />
              <text x={fx + 38} y={startY + 14} textAnchor="middle"
                fontSize={8} fontWeight={700} fill={CG}>오라클 질의</text>
              <text x={fx + 38} y={startY + 26} textAnchor="middle"
                fontSize={7} fill="var(--muted-foreground)">f(r₁,...,rₖ)</text>
            </g>
          );
        })()}
      </motion.g>

      {/* bottom note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.75 }}>
        <rect x={100} y={128} width={260} height={22} rx={11}
          fill={`${CI}10`} stroke={CI} strokeWidth={0.6} />
        <text x={230} y={143} textAnchor="middle" fontSize={8} fontWeight={600} fill={CI}>
          통신량: O(k) 필드 원소 — 다중선형(d=1)이면 O(log n)
        </text>
      </motion.g>

      <defs>
        <marker id="arwS" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto">
          <polygon points="0,0 6,3 0,6" fill="var(--muted-foreground)" />
        </marker>
        <marker id="arwSg" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto">
          <polygon points="0,0 6,3 0,6" fill={CG} />
        </marker>
      </defs>
    </motion.g>
  );
}

/* ── Step 3: Multilinear PCS landscape ── */
function PCSLandscape() {
  const schemes = [
    { name: 'Dory', setup: '투명', proof: 'O(log n)', prover: '느림', color: CI, x: 16 },
    { name: 'Zeromorph', setup: 'Trusted', proof: 'O(1)', prover: '중간', color: CW, x: 132 },
    { name: 'Basefold', setup: '투명', proof: 'O(log²n)', prover: '빠름', color: CG, x: 248 },
  ];
  const cardW = 108, cardH = 100;

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={CP}>
        다중선형 PCS 선택지
      </text>
      {schemes.map((s, i) => (
        <motion.g key={s.name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.12 * i }}>
          {/* card */}
          <rect x={s.x} y={28} width={cardW} height={cardH} rx={8}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <rect x={s.x} y={28} width={cardW} height={6} rx={3}
            fill={s.color} opacity={0.8} />
          {/* title */}
          <text x={s.x + cardW / 2} y={50} textAnchor="middle"
            fontSize={11} fontWeight={700} fill={s.color}>{s.name}</text>
          {/* metrics */}
          {[
            { label: '셋업', value: s.setup },
            { label: '증명', value: s.proof },
            { label: 'Prover', value: s.prover },
          ].map((m, mi) => (
            <g key={mi}>
              <text x={s.x + 10} y={68 + mi * 16} fontSize={8}
                fill="var(--muted-foreground)">{m.label}</text>
              <text x={s.x + cardW - 10} y={68 + mi * 16} textAnchor="end"
                fontSize={8} fontWeight={600} fill="var(--foreground)">{m.value}</text>
            </g>
          ))}
          {/* divider line between metrics */}
          <line x1={s.x + 8} y1={56} x2={s.x + cardW - 8} y2={56}
            stroke="var(--border)" strokeWidth={0.4} />
        </motion.g>
      ))}

      {/* bottom comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={60} y={136} width={340} height={20} rx={10}
          fill={`${CP}10`} stroke={CP} strokeWidth={0.6} />
        <text x={230} y={150} textAnchor="middle" fontSize={8} fontWeight={600} fill={CP}>
          트레이드오프: 증명 크기 ↔ prover 속도 ↔ 셋업 신뢰 모델
        </text>
      </motion.g>
    </motion.g>
  );
}

const RENDERERS = [ArchCompare, HypercubeStep, SumcheckReduction, PCSLandscape];

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const R = RENDERERS[step];
        return (
          <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <R />
          </svg>
        );
      }}
    </StepViz>
  );
}
