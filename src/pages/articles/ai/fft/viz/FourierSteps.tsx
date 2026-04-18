import { motion } from 'framer-motion';
import { C } from './FourierVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ── Step 0: 사인파의 합 ── */
export function SineSum() {
  const N = 80;
  /* 3개 사인파 + 합성 */
  const pts = Array.from({ length: N }, (_, i) => {
    const t = (i / (N - 1)) * Math.PI * 4;
    const y1 = Math.sin(t);            // 기본 주파수
    const y2 = 0.5 * Math.sin(2.5 * t); // 2.5배 주파수
    const y3 = 0.3 * Math.sin(4 * t);   // 4배 주파수
    return {
      x: 20 + i * 5.5,
      s1: 42 - y1 * 16,
      s2: 42 - y2 * 16,
      s3: 42 - y3 * 16,
      sum: 110 - (y1 + y2 + y3) * 16,
    };
  });

  const makePath = (key: 's1' | 's2' | 's3' | 'sum') =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p[key]}`).join(' ');

  const waves = [
    { key: 's1' as const, label: 'f1 (기본)', color: C.wave1, delay: 0 },
    { key: 's2' as const, label: 'f2 (x2.5)', color: C.wave2, delay: 0.15 },
    { key: 's3' as const, label: 'f3 (x4)', color: C.sample, delay: 0.3 },
  ];

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="var(--foreground)">개별 사인파 (위) + 합성 결과 (아래)</text>

      {/* 상단: 개별 사인파 영역 */}
      <rect x={15} y={18} width={450} height={50} rx={5}
        fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />

      {waves.map((w) => (
        <motion.path key={w.key} d={makePath(w.key)} fill="none"
          stroke={w.color} strokeWidth={1.2} strokeOpacity={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: w.delay, duration: 0.7 }} />
      ))}

      {/* 범례 (상단 우측) */}
      {waves.map((w, i) => (
        <g key={`legend-${i}`}>
          <line x1={16} y1={24 + i * 12} x2={30} y2={24 + i * 12}
            stroke={w.color} strokeWidth={1.5} />
          <text x={33} y={27 + i * 12} fontSize={7} fill={w.color}>{w.label}</text>
        </g>
      ))}

      {/* 더하기 기호 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.45 }}>
        <text x={240} y={80} textAnchor="middle" fontSize={12}
          fontWeight={700} fill="var(--muted-foreground)">+  +  =</text>
      </motion.g>

      {/* 하단: 합성 파형 */}
      <rect x={15} y={86} width={450} height={50} rx={5}
        fill={`${C.combined}06`} stroke={C.combined} strokeWidth={0.5} />
      <motion.path d={makePath('sum')} fill="none"
        stroke={C.combined} strokeWidth={1.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.5, duration: 0.8 }} />
      <text x={20} y={96} fontSize={7} fill={C.combined} fontWeight={600}>합성파</text>

      <text x={240} y={148} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        서로 다른 주파수의 사인파를 더하면 복잡한 파형이 된다
      </text>
    </g>
  );
}

/* ── Step 1: 오일러 공식 ── */
export function EulerFormula() {
  const cx = 160;
  const cy = 80;
  const r = 52;
  const theta = Math.PI / 4; // 45도
  const px = cx + r * Math.cos(theta);
  const py = cy - r * Math.sin(theta);
  const cosX = cx + r * Math.cos(theta);
  const sinY = cy - r * Math.sin(theta);

  /* 단위원 위의 이동 점 궤적 */
  const arcPts = Array.from({ length: 30 }, (_, i) => {
    const a = (i / 29) * theta;
    return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
  });
  const arcPath = arcPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <g>
      {/* 수식 */}
      <motion.rect x={30} y={2} width={200} height={20} rx={4}
        fill={`${C.euler}10`} stroke={C.euler} strokeWidth={0.8}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
      <text x={130} y={16} textAnchor="middle" fontSize={10}
        fontWeight={700} fontFamily="monospace" fill={C.euler}>
        e^(i*theta) = cos(theta) + i*sin(theta)
      </text>

      {/* 단위원 */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#888" strokeWidth={0.6} />
      {/* 축 */}
      <line x1={cx - r - 15} y1={cy} x2={cx + r + 15} y2={cy}
        stroke="#888" strokeWidth={0.4} />
      <line x1={cx} y1={cy - r - 15} x2={cx} y2={cy + r + 15}
        stroke="#888" strokeWidth={0.4} />
      <text x={cx + r + 10} y={cy - 4} fontSize={7} fill="#888">Re</text>
      <text x={cx + 6} y={cy - r - 8} fontSize={7} fill="#888">Im</text>

      {/* 원점 -> 점 벡터 */}
      <motion.line x1={cx} y1={cy} x2={px} y2={py}
        stroke={C.euler} strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.2 }} />

      {/* 점 */}
      <motion.circle cx={px} cy={py} r={4}
        fill={C.euler}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ ...sp, delay: 0.35 }} />
      <text x={px + 8} y={py - 6} fontSize={8} fontWeight={600}
        fill={C.euler}>e^(i*theta)</text>

      {/* cos 투영 */}
      <motion.line x1={px} y1={py} x2={cosX} y2={cy}
        stroke={C.wave1} strokeWidth={1} strokeDasharray="3,2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.4 }} />
      <text x={cosX + 2} y={cy + 12} fontSize={8} fontWeight={600}
        fill={C.wave1}>cos(theta)</text>

      {/* sin 투영 */}
      <motion.line x1={cx} y1={sinY} x2={cx} y2={cy}
        stroke={C.wave2} strokeWidth={1} strokeDasharray="3,2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.45 }} />
      <text x={cx - 38} y={(sinY + cy) / 2 + 3} fontSize={8} fontWeight={600}
        fill={C.wave2}>sin(theta)</text>

      {/* 호 (theta 각도 표시) */}
      <motion.path d={arcPath} fill="none" stroke={C.euler}
        strokeWidth={1} strokeDasharray="2,1"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.3 }} />
      <text x={cx + 22} y={cy - 16} fontSize={8} fill={C.euler}>theta</text>

      {/* 우측 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={280} y={28} width={180} height={98} rx={6}
          fill="var(--muted)" fillOpacity={0.5} stroke="var(--border)" strokeWidth={0.5} />
        <text x={370} y={44} textAnchor="middle" fontSize={9}
          fontWeight={600} fill="var(--foreground)">핵심 의미</text>
        <text x={290} y={60} fontSize={8}
          fill="var(--muted-foreground)">실수부 = cos(theta) (수평)</text>
        <text x={290} y={74} fontSize={8}
          fill="var(--muted-foreground)">허수부 = sin(theta) (수직)</text>
        <line x1={290} y1={80} x2={450} y2={80}
          stroke="var(--border)" strokeWidth={0.4} />
        <text x={290} y={94} fontSize={8}
          fill={C.euler} fontWeight={600}>theta가 증가하면 점이</text>
        <text x={290} y={108} fontSize={8}
          fill={C.euler} fontWeight={600}>단위원을 따라 회전</text>
        <text x={290} y={120} fontSize={7}
          fill="var(--muted-foreground)">{'→ 진폭 + 위상 = 하나의 복소수'}</text>
      </motion.g>

      <text x={240} y={148} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        복소 지수 = 단위원 위의 회전 — 코사인(실수부) + 사인(허수부)
      </text>
    </g>
  );
}

/* ── Step 2: 연속 -> 이산 ── */
export function ContinuousToDiscrete() {
  /* 연속 곡선 */
  const N = 100;
  const curvePts = Array.from({ length: N }, (_, i) => {
    const t = (i / (N - 1)) * Math.PI * 3;
    return {
      x: 30 + i * 2,
      y: 60 - Math.sin(t) * 25 - 5 * Math.sin(2.3 * t),
    };
  });
  const curvePath = curvePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  /* 샘플링 점 (16개) */
  const sampleN = 16;
  const samples = Array.from({ length: sampleN }, (_, i) => {
    const idx = Math.round((i / (sampleN - 1)) * (N - 1));
    return curvePts[idx];
  });

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">{'연속 신호 → 샘플링 → 이산 데이터'}</text>

      {/* 연속 곡선 (좌측 상단) */}
      <text x={30} y={28} fontSize={8} fontWeight={600} fill={C.wave1}>f(t) 연속</text>
      <motion.path d={curvePath} fill="none" stroke={C.wave1}
        strokeWidth={1.5} strokeOpacity={0.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, duration: 0.8 }} />

      {/* 샘플링 점 */}
      {samples.map((s, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: 0.4 + i * 0.03 }}>
          {/* 수직 점선 */}
          <line x1={s.x} y1={s.y} x2={s.x} y2={90}
            stroke={C.sample} strokeWidth={0.5} strokeDasharray="2,2" />
          {/* 점 */}
          <circle cx={s.x} cy={s.y} r={3}
            fill={C.sample} stroke="var(--card)" strokeWidth={1} />
        </motion.g>
      ))}

      {/* 시간축 */}
      <line x1={25} y1={90} x2={235} y2={90} stroke="#888" strokeWidth={0.4} />
      <text x={230} y={100} fontSize={7} fill="#888">t</text>

      {/* 변환 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.7 }}>
        <rect x={250} y={24} width={60} height={42} rx={6}
          fill={`${C.euler}10`} stroke={C.euler} strokeWidth={1} />
        <text x={280} y={42} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={C.euler}>변환</text>
        <text x={280} y={56} textAnchor="middle" fontSize={8}
          fontFamily="monospace" fill={C.euler}>{'integral → Sum'}</text>
      </motion.g>

      {/* 수식 비교 (우측) */}
      <motion.g initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.8 }}>
        {/* 연속 FT */}
        <rect x={325} y={18} width={145} height={28} rx={5}
          fill={`${C.wave1}10`} stroke={C.wave1} strokeWidth={0.8} />
        <text x={397} y={30} textAnchor="middle" fontSize={7}
          fontWeight={600} fill={C.wave1}>연속 푸리에 변환</text>
        <text x={397} y={42} textAnchor="middle" fontSize={8}
          fontFamily="monospace" fill={C.wave1}>F(w) = integral f(t)e^(-iwt)dt</text>

        {/* 화살표 */}
        <line x1={397} y1={48} x2={397} y2={60}
          stroke={C.euler} strokeWidth={1} markerEnd="url(#ctd-arr)" />

        {/* DFT */}
        <rect x={325} y={62} width={145} height={28} rx={5}
          fill={`${C.sample}10`} stroke={C.sample} strokeWidth={0.8} />
        <text x={397} y={74} textAnchor="middle" fontSize={7}
          fontWeight={600} fill={C.sample}>이산 푸리에 변환 (DFT)</text>
        <text x={397} y={86} textAnchor="middle" fontSize={8}
          fontFamily="monospace" fill={C.sample}>X_k = Sum x_n*e^(-2pi*ikn/N)</text>
      </motion.g>

      {/* 변환 대응 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.9 }}>
        <rect x={325} y={96} width={145} height={40} rx={5}
          fill="var(--muted)" fillOpacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
        <text x={340} y={110} fontSize={8} fill="var(--muted-foreground)">
          {'integral → Sum (적분 → 합)'}
        </text>
        <text x={340} y={124} fontSize={8} fill="var(--muted-foreground)">
          {'w (연속) → k (이산 인덱스)'}
        </text>
      </motion.g>

      <text x={240} y={148} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        컴퓨터는 연속 신호 처리 불가 — 샘플링 후 이산 데이터로 변환
      </text>

      <defs>
        <marker id="ctd-arr" markerWidth="5" markerHeight="5" refX="2.5" refY="5" orient="auto">
          <path d="M0,0 L2.5,5 L5,0 Z" fill={C.euler} />
        </marker>
      </defs>
    </g>
  );
}

/* ── Step 3: 스펙트럼 예시 ── */
export function SpectrumExample() {
  /* 합성 신호: 3*sin(2pi*5t) + 1.5*sin(2pi*12t) */
  const N = 120;
  const timePts = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const y = 3 * Math.sin(2 * Math.PI * 5 * t) + 1.5 * Math.sin(2 * Math.PI * 12 * t);
    return { x: 20 + i * 1.8, y: 65 - y * 8 };
  });
  const timePath = timePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  /* 스펙트럼: 20개 주파수 빈 */
  const spectrum = Array.from({ length: 20 }, (_, k) => {
    let mag = 2; // 기저 노이즈
    if (k === 5) mag = 45;   // 5Hz 피크
    if (k === 12) mag = 22;  // 12Hz 피크
    return { f: k, h: mag };
  });

  return (
    <g>
      {/* 좌측: 시간 영역 */}
      <text x={120} y={12} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="var(--foreground)">시간 영역: 3sin(5t) + 1.5sin(12t)</text>

      <rect x={15} y={20} width={225} height={82} rx={5}
        fill={`${C.combined}05`} stroke={C.combined} strokeWidth={0.6} />
      <motion.path d={timePath} fill="none" stroke={C.combined}
        strokeWidth={1.3}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, duration: 0.8 }} />
      <line x1={20} y1={100} x2={235} y2={100} stroke="#888" strokeWidth={0.3} />
      <text x={230} y={110} fontSize={7} fill="#888">t</text>

      {/* FFT 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <line x1={245} y1={60} x2={275} y2={60}
          stroke={C.sample} strokeWidth={1.2} markerEnd="url(#spec-arr)" />
        <text x={260} y={54} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={C.sample}>FFT</text>
      </motion.g>

      {/* 우측: 주파수 영역 */}
      <text x={380} y={12} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="var(--foreground)">주파수 스펙트럼</text>

      <rect x={280} y={20} width={190} height={82} rx={5}
        fill={`${C.peak}05`} stroke={C.peak} strokeWidth={0.6} />

      {spectrum.map((s, i) => (
        <motion.g key={i}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ ...sp, delay: 0.6 + i * 0.02 }}
          style={{ originY: 1 }}>
          <rect x={288 + i * 9} y={96 - s.h} width={6} height={s.h} rx={1}
            fill={s.f === 5 || s.f === 12 ? C.peak : '#94a3b8'}
            fillOpacity={s.f === 5 || s.f === 12 ? 0.8 : 0.3} />
        </motion.g>
      ))}

      {/* 피크 라벨 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.9 }}>
        {/* 5Hz 피크 */}
        <line x1={291 + 5 * 9} y1={96 - 45 - 3} x2={291 + 5 * 9} y2={96 - 45 - 12}
          stroke={C.peak} strokeWidth={0.6} />
        <text x={291 + 5 * 9} y={96 - 45 - 14} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.peak}>5Hz</text>

        {/* 12Hz 피크 */}
        <line x1={291 + 12 * 9} y1={96 - 22 - 3} x2={291 + 12 * 9} y2={96 - 22 - 12}
          stroke={C.peak} strokeWidth={0.6} />
        <text x={291 + 12 * 9} y={96 - 22 - 14} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.peak}>12Hz</text>
      </motion.g>

      {/* 축 라벨 */}
      <line x1={286} y1={98} x2={466} y2={98} stroke="#888" strokeWidth={0.3} />
      <text x={460} y={108} fontSize={7} fill="#888">Hz</text>

      {/* 진폭 비교 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 1.0 }}>
        <rect x={310} y={110} width={140} height={28} rx={5}
          fill="var(--muted)" fillOpacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
        <text x={380} y={123} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">5Hz 피크: 진폭 3 | 12Hz 피크: 진폭 1.5</text>
        <text x={380} y={133} textAnchor="middle" fontSize={7}
          fill={C.peak} fontWeight={600}>피크 높이 = 원래 성분의 진폭에 비례</text>
      </motion.g>

      <defs>
        <marker id="spec-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.sample} />
        </marker>
      </defs>
    </g>
  );
}
