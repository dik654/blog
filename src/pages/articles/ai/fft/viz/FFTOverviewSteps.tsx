import { motion } from 'framer-motion';
import { C } from './FFTOverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ── Step 0: 시간 영역 vs 주파수 영역 ── */
export function TimeDomain() {
  /* 합성 파형: sin(x) + 0.5*sin(3x) 를 시간축에 그리기 */
  const wave = Array.from({ length: 60 }, (_, i) => {
    const t = (i / 59) * Math.PI * 4;
    const y = Math.sin(t) + 0.5 * Math.sin(3 * t);
    return { x: 20 + i * 2.8, y: 70 - y * 22 };
  });
  const wavePath = wave.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  /* 주파수 막대 */
  const bars = [
    { f: '1', h: 35, color: C.time },
    { f: '2', h: 8, color: '#94a3b8' },
    { f: '3', h: 18, color: C.freq },
    { f: '4', h: 4, color: '#94a3b8' },
    { f: '5', h: 3, color: '#94a3b8' },
  ];

  return (
    <g>
      <text x={100} y={12} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="var(--foreground)">시간 영역</text>

      {/* 파형 */}
      <rect x={15} y={30} width={175} height={80} rx={6}
        fill={`${C.time}08`} stroke={C.time} strokeWidth={0.8} />
      <motion.path d={wavePath} fill="none" stroke={C.time} strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, duration: 0.8 }} />
      {/* 시간축 */}
      <line x1={20} y1={110} x2={185} y2={110} stroke="#888" strokeWidth={0.4} />
      <text x={180} y={120} fontSize={7} fill="#888">t (시간)</text>
      <text x={15} y={40} fontSize={7} fill={C.time}>진폭</text>

      {/* FFT 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <line x1={200} y1={70} x2={260} y2={70}
          stroke={C.fft} strokeWidth={1.5} markerEnd="url(#fft-arr)" />
        <rect x={210} y={56} width={40} height={16} rx={4}
          fill={`${C.fft}18`} stroke={C.fft} strokeWidth={0.8} />
        <text x={230} y={67} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={C.fft}>FFT</text>
      </motion.g>

      {/* 주파수 영역 */}
      <text x={370} y={12} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="var(--foreground)">주파수 영역</text>
      <rect x={275} y={30} width={190} height={80} rx={6}
        fill={`${C.freq}08`} stroke={C.freq} strokeWidth={0.8} />

      {bars.map((b, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ ...sp, delay: 0.6 + i * 0.08 }}
          style={{ originY: 1 }}>
          <rect x={295 + i * 32} y={105 - b.h} width={18} height={b.h} rx={2}
            fill={b.color} fillOpacity={0.7} />
          <text x={304 + i * 32} y={118} textAnchor="middle" fontSize={7}
            fill="#888">{b.f}Hz</text>
        </motion.g>
      ))}
      <text x={280} y={45} fontSize={7} fill={C.freq}>크기</text>

      {/* 범례 */}
      <text x={240} y={148} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        복잡한 파형 → FFT → 깔끔한 주파수 성분별 크기
      </text>

      <defs>
        <marker id="fft-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.fft} />
        </marker>
      </defs>
    </g>
  );
}

/* ── Step 1: DFT 수식 시각화 ── */
export function DFTFormula() {
  /* 입력 샘플 */
  const samples = [0.8, 0.3, -0.5, 0.9, -0.2, 0.6, -0.7, 0.1];
  /* 회전 인자: 단위원 위의 점 */
  const rotAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <g>
      {/* 수식 배경 */}
      <motion.rect x={80} y={4} width={320} height={24} rx={5}
        fill={`${C.accent}10`} stroke={C.accent} strokeWidth={0.8}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
      <text x={240} y={20} textAnchor="middle" fontSize={10}
        fontWeight={700} fontFamily="monospace" fill={C.accent}>
        X_k = Sum( x_n * e^(-2pi*i*k*n/N) )
      </text>

      {/* 좌측: 입력 샘플 */}
      <text x={60} y={44} textAnchor="middle" fontSize={8} fontWeight={600}
        fill="var(--foreground)">입력 샘플 x_n</text>
      {samples.map((v, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.05 }}>
          <rect x={20} y={50 + i * 12} width={80} height={10} rx={2}
            fill={`${C.time}12`} stroke={C.time} strokeWidth={0.5} />
          <rect x={20} y={50 + i * 12}
            width={Math.abs(v) * 80} height={10} rx={2}
            fill={v >= 0 ? C.time : C.alert} fillOpacity={0.3} />
          <text x={105} y={58 + i * 12} fontSize={7}
            fill="var(--muted-foreground)">{v.toFixed(1)}</text>
        </motion.g>
      ))}

      {/* 중앙: 회전 인자 (단위원) */}
      <text x={240} y={44} textAnchor="middle" fontSize={8} fontWeight={600}
        fill="var(--foreground)">회전 인자 (twiddle)</text>
      <circle cx={240} cy={95} r={38} fill="none" stroke="#888" strokeWidth={0.5} />
      {rotAngles.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const px = 240 + Math.cos(rad) * 38;
        const py = 95 - Math.sin(rad) * 38;
        return (
          <motion.circle key={i} cx={px} cy={py} r={3}
            fill={C.accent} fillOpacity={0.8}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ ...sp, delay: 0.3 + i * 0.05 }} />
        );
      })}
      <motion.line x1={240} y1={95} x2={240 + 38} y2={95}
        stroke={C.accent} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.3 }} />
      <text x={240} y={142} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)">e^(-2pi*i*kn/N)</text>

      {/* 우측: 출력 스펙트럼 */}
      <text x={400} y={44} textAnchor="middle" fontSize={8} fontWeight={600}
        fill="var(--foreground)">출력 X_k</text>
      {[35, 12, 22, 8, 5, 18, 10, 6].map((h, i) => (
        <motion.rect key={i} x={370 + i * 10} y={130 - h} width={7} height={h} rx={1}
          fill={C.freq} fillOpacity={0.7}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ ...sp, delay: 0.5 + i * 0.04 }}
          style={{ originY: 1 }} />
      ))}
      <text x={400} y={142} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)">주파수 k = 0..N-1</text>

      {/* 화살표 연결 */}
      <motion.line x1={120} y1={90} x2={198} y2={90}
        stroke="#888" strokeWidth={0.8} markerEnd="url(#dft-arr)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.25 }} />
      <text x={158} y={86} textAnchor="middle" fontSize={7} fill="#888">x 곱셈</text>
      <motion.line x1={282} y1={90} x2={365} y2={90}
        stroke="#888" strokeWidth={0.8} markerEnd="url(#dft-arr)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.45 }} />
      <text x={320} y={86} textAnchor="middle" fontSize={7} fill="#888">합산 Sigma</text>

      <defs>
        <marker id="dft-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#888" />
        </marker>
      </defs>
    </g>
  );
}

/* ── Step 2: O(N^2) vs O(NlogN) 비교 ── */
export function ComplexityCompare() {
  const N = 1000;
  const n2 = N * N;           // 1,000,000
  const nlogn = N * Math.log2(N); // ~9,966
  const maxH = 100;
  const barW = 60;
  /* 스케일: n2를 maxH로 */
  const h1 = maxH;
  const h2 = (nlogn / n2) * maxH; // ~1px — 그래서 최소 3px 보장
  const h2Vis = Math.max(h2, 3);

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">N=1,000일 때 연산 횟수 비교</text>

      {/* 좌측 바: DFT O(N^2) */}
      <motion.rect x={100} y={130 - h1} width={barW} height={h1} rx={4}
        fill={C.alert} fillOpacity={0.6}
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ ...sp, duration: 0.6 }}
        style={{ originY: 1 }} />
      <text x={130} y={140} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={C.alert}>DFT</text>
      <text x={130} y={24} textAnchor="middle" fontSize={8}
        fontWeight={700} fill={C.alert}>1,000,000</text>
      <text x={130} y={34} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)">O(N^2)</text>

      {/* 우측 바: FFT O(NlogN) */}
      <motion.rect x={220} y={130 - h2Vis} width={barW} height={h2Vis} rx={4}
        fill={C.fft} fillOpacity={0.7}
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ ...sp, delay: 0.3, duration: 0.6 }}
        style={{ originY: 1 }} />
      <text x={250} y={140} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={C.fft}>FFT</text>
      <text x={250} y={130 - h2Vis - 6} textAnchor="middle" fontSize={8}
        fontWeight={700} fill={C.fft}>~10,000</text>
      <text x={250} y={130 - h2Vis + 4} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)">O(N log N)</text>

      {/* 베이스라인 */}
      <line x1={80} y1={130} x2={300} y2={130} stroke="#888" strokeWidth={0.5} />

      {/* 속도 향상 callout */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={320} y={45} width={140} height={60} rx={8}
          fill={`${C.fft}10`} stroke={C.fft} strokeWidth={1.2} />
        <text x={390} y={65} textAnchor="middle" fontSize={12}
          fontWeight={800} fill={C.fft}>~100x</text>
        <text x={390} y={80} textAnchor="middle" fontSize={9}
          fontWeight={600} fill="var(--foreground)">속도 향상</text>
        <text x={390} y={95} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">N이 클수록 격차 증가</text>
      </motion.g>

      {/* 비교 화살표 */}
      <motion.line x1={165} y1={70} x2={215} y2={70}
        stroke="#888" strokeWidth={0.8} strokeDasharray="3,2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.4 }} />

      <text x={190} y={148} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        Cooley-Tukey(1965): 분할 정복으로 중복 계산 제거
      </text>
    </g>
  );
}

/* ── Step 3: AI 활용 4가지 ── */
export function AIUseCases() {
  const cases = [
    {
      title: '스펙트로그램',
      sub: '오디오 입력',
      icon: 'M8,18 Q12,4 16,14 Q20,24 24,8',
      color: C.time,
      x: 16,
    },
    {
      title: 'FFT 합성곱',
      sub: '이미지 처리',
      icon: 'M8,14 L16,8 L24,14 L16,20 Z',
      color: C.freq,
      x: 132,
    },
    {
      title: '효율적 어텐션',
      sub: '긴 시퀀스',
      icon: 'M8,10 L24,10 M8,16 L24,16 M8,22 L20,22',
      color: C.accent,
      x: 248,
    },
    {
      title: '노이즈 제거',
      sub: '주파수 필터링',
      icon: 'M8,16 Q16,6 24,16',
      color: C.fft,
      x: 364,
    },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">AI에서 FFT가 활용되는 4가지 영역</text>

      {cases.map((c, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.15 + i * 0.12 }}>
          {/* 카드 배경 */}
          <rect x={c.x} y={26} width={100} height={108} rx={8}
            fill={`${c.color}08`} stroke={c.color} strokeWidth={1} />
          {/* 상단 색상 바 */}
          <rect x={c.x} y={26} width={100} height={5} rx={8}
            fill={c.color} fillOpacity={0.5} />
          <rect x={c.x} y={28} width={100} height={3}
            fill={c.color} fillOpacity={0.5} />

          {/* 아이콘 영역 */}
          <rect x={c.x + 30} y={40} width={40} height={32} rx={6}
            fill={`${c.color}15`} />
          <path d={c.icon} fill="none" stroke={c.color} strokeWidth={1.5}
            transform={`translate(${c.x + 38}, ${c.y || 42})`} />

          {/* 텍스트 */}
          <text x={c.x + 50} y={88} textAnchor="middle" fontSize={9}
            fontWeight={700} fill={c.color}>{c.title}</text>
          <text x={c.x + 50} y={102} textAnchor="middle" fontSize={8}
            fill="var(--foreground)">{c.sub}</text>

          {/* 세부 설명 */}
          <text x={c.x + 50} y={124} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">
            {i === 0 && '파형 \u2192 주파수 변환'}
            {i === 1 && '공간 \u2192 주파수 곱셈'}
            {i === 2 && 'O(N\u00B2) \u2192 O(NlogN)'}
            {i === 3 && '고주파 성분 제거'}
          </text>
        </motion.g>
      ))}

      <text x={240} y={148} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        {'공통 원리: 주파수 영역 변환 → 더 빠르거나 더 깔끔한 처리'}
      </text>
    </g>
  );
}
