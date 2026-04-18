import { motion } from 'framer-motion';
import { C } from './FFTAIVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ── Step 0: 스펙트로그램 ── */
export function Spectrogram() {
  /* 파형 포인트 (간략 사인파) */
  const wave = Array.from({ length: 40 }, (_, i) => {
    const x = 10 + i * 2.2;
    const y = 50 + Math.sin(i * 0.5) * 12 + Math.sin(i * 1.3) * 6;
    return `${x},${y}`;
  }).join(' ');

  /* Mel 스펙트로그램 그리드 (8행 × 12열) */
  const melRows = 8;
  const melCols = 12;

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">파형 → STFT → Mel-Spectrogram</text>

      {/* 원시 파형 */}
      <motion.polyline points={wave} fill="none"
        stroke={C.wave} strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0 }} />
      <text x={50} y={30} textAnchor="middle" fontSize={8}
        fill={C.wave} fontWeight={600}>파형</text>

      {/* 슬라이딩 윈도우 표시 */}
      {[0, 1, 2].map((i) => (
        <motion.rect key={i} x={18 + i * 22} y={36} width={20} height={28} rx={2}
          fill={C.fft} fillOpacity={0.1} stroke={C.fft} strokeWidth={0.6}
          strokeDasharray="2,1"
          initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
          transition={{ ...sp, delay: 0.3 + i * 0.12 }} />
      ))}
      <text x={50} y={75} textAnchor="middle" fontSize={7}
        fill={C.fft}>STFT 윈도우</text>

      {/* 화살표: 파형 → 스펙트로그램 */}
      <motion.line x1={100} y1={50} x2={135} y2={50}
        stroke="#888" strokeWidth={1}
        markerEnd="url(#fftai-arr)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.4 }} />
      <text x={118} y={44} textAnchor="middle" fontSize={7}
        fill={C.fft} fontWeight={600}>FFT</text>

      {/* 시간×주파수 그리드 (STFT 결과) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={140} y={26} width={72} height={48} rx={3}
          fill={C.fft} fillOpacity={0.06} stroke={C.fft} strokeWidth={0.8} />
        {Array.from({ length: 6 }, (_, r) =>
          Array.from({ length: 8 }, (__, c) => {
            const intensity = Math.random() * 0.6 + 0.1;
            return (
              <rect key={`g-${r}-${c}`}
                x={142 + c * 8.5} y={28 + r * 7.5} width={7} height={6} rx={1}
                fill={C.fft} fillOpacity={intensity} />
            );
          })
        )}
        <text x={176} y={22} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">시간 →</text>
        <text x={136} y={50} textAnchor="end" fontSize={7}
          fill="var(--muted-foreground)" transform="rotate(-90, 136, 50)">주파수</text>
      </motion.g>

      {/* 화살표: STFT → Mel */}
      <motion.line x1={216} y1={50} x2={248} y2={50}
        stroke="#888" strokeWidth={1}
        markerEnd="url(#fftai-arr)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.6 }} />
      <text x={232} y={44} textAnchor="middle" fontSize={7}
        fill={C.noise} fontWeight={600}>Mel</text>

      {/* Mel-Spectrogram */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.7 }}>
        <rect x={252} y={22} width={96} height={56} rx={4}
          fill={C.wave} fillOpacity={0.05} stroke={C.wave} strokeWidth={1} />
        {Array.from({ length: melRows }, (_, r) =>
          Array.from({ length: melCols }, (__, c) => {
            const freq = 1 - r / melRows;
            const intensity = Math.max(0.05, freq * 0.5 + Math.random() * 0.3 - 0.1);
            return (
              <rect key={`m-${r}-${c}`}
                x={254 + c * 7.5} y={24 + r * 6.5} width={6.5} height={5.5} rx={1}
                fill={C.wave} fillOpacity={intensity} />
            );
          })
        )}
        <text x={300} y={18} textAnchor="middle" fontSize={8}
          fill={C.wave} fontWeight={600}>Mel-Spectrogram</text>
      </motion.g>

      {/* 화살표: Mel → 모델 */}
      <motion.line x1={352} y1={50} x2={380} y2={50}
        stroke="#888" strokeWidth={1}
        markerEnd="url(#fftai-arr)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.8 }} />

      {/* Whisper 모델 */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.85 }}>
        <rect x={384} y={30} width={86} height={40} rx={6}
          fill={C.conv} fillOpacity={0.1} stroke={C.conv} strokeWidth={1.2} />
        <text x={427} y={46} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={C.conv}>Whisper</text>
        <text x={427} y={58} textAnchor="middle" fontSize={7}
          fill={C.conv}>80 x 3000</text>
      </motion.g>

      {/* 하단 범례 */}
      <text x={240} y={92} textAnchor="middle" fontSize={7.5}
        fill="var(--muted-foreground)">
        저주파(아래)는 밝게, 고주파(위)는 어둡게 — 인간 청각 특성 반영
      </text>

      {/* 화살표 마커 */}
      <defs>
        <marker id="fftai-arr" markerWidth="6" markerHeight="6"
          refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#888" />
        </marker>
      </defs>
    </g>
  );
}

/* ── Step 1: 합성곱 정리 ── */
export function ConvTheorem() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">합성곱 정리: f*g = F⁻¹[F(f)·F(g)]</text>

      {/* 좌측: 공간 영역 직접 합성곱 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={15} y={26} width={200} height={54} rx={6}
          fill={C.attn} fillOpacity={0.06} stroke={C.attn} strokeWidth={0.8} />
        <rect x={15} y={26} width={200} height={14} rx={6}
          fill={C.attn} fillOpacity={0.15} />
        <rect x={15} y={36} width={200} height={4}
          fill={C.attn} fillOpacity={0.15} />
        <text x={115} y={37} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={C.attn}>공간 합성곱 (직접)</text>

        {/* 입력 × 커널 슬라이딩 */}
        <rect x={25} y={48} width={60} height={20} rx={3}
          fill={C.wave} fillOpacity={0.15} stroke={C.wave} strokeWidth={0.6} />
        <text x={55} y={61} textAnchor="middle" fontSize={8}
          fill={C.wave}>입력 N</text>

        <text x={95} y={61} textAnchor="middle" fontSize={10}
          fill="#888">*</text>

        <rect x={105} y={48} width={40} height={20} rx={3}
          fill={C.conv} fillOpacity={0.15} stroke={C.conv} strokeWidth={0.6} />
        <text x={125} y={61} textAnchor="middle" fontSize={8}
          fill={C.conv}>커널 K</text>

        <text x={155} y={61} textAnchor="middle" fontSize={8}
          fill="#888">=</text>

        <text x={190} y={56} textAnchor="middle" fontSize={9}
          fontWeight={700} fontFamily="monospace" fill={C.attn}>O(NK)</text>
        <text x={190} y={68} textAnchor="middle" fontSize={7}
          fill={C.attn}>슬라이딩 곱</text>
      </motion.g>

      {/* 우측: FFT 합성곱 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={235} y={26} width={235} height={54} rx={6}
          fill={C.fft} fillOpacity={0.06} stroke={C.fft} strokeWidth={0.8} />
        <rect x={235} y={26} width={235} height={14} rx={6}
          fill={C.fft} fillOpacity={0.15} />
        <rect x={235} y={36} width={235} height={4}
          fill={C.fft} fillOpacity={0.15} />
        <text x={352} y={37} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={C.fft}>FFT 합성곱</text>

        {/* F(f) · F(g) → F⁻¹ */}
        <rect x={245} y={48} width={38} height={20} rx={3}
          fill={C.fft} fillOpacity={0.15} stroke={C.fft} strokeWidth={0.6} />
        <text x={264} y={61} textAnchor="middle" fontSize={8}
          fill={C.fft}>F(f)</text>

        <text x={291} y={61} textAnchor="middle" fontSize={10}
          fill="#888">.</text>

        <rect x={299} y={48} width={38} height={20} rx={3}
          fill={C.fft} fillOpacity={0.15} stroke={C.fft} strokeWidth={0.6} />
        <text x={318} y={61} textAnchor="middle" fontSize={8}
          fill={C.fft}>F(g)</text>

        <motion.line x1={340} y1={58} x2={360} y2={58}
          stroke={C.fft} strokeWidth={0.8}
          markerEnd="url(#fftai-arr2)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.5 }} />

        <rect x={364} y={48} width={30} height={20} rx={3}
          fill={C.fft} fillOpacity={0.25} stroke={C.fft} strokeWidth={0.8} />
        <text x={379} y={61} textAnchor="middle" fontSize={7}
          fontWeight={600} fill={C.fft}>F⁻¹</text>

        <text x={418} y={56} textAnchor="middle" fontSize={9}
          fontWeight={700} fontFamily="monospace" fill={C.fft}>O(NlogN)</text>
        <text x={418} y={68} textAnchor="middle" fontSize={7}
          fill={C.fft}>점별 곱셈</text>
      </motion.g>

      {/* 하단: 교차점 비교 바 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        {/* 축 */}
        <line x1={60} y1={118} x2={420} y2={118}
          stroke="#888" strokeWidth={0.5} />
        <text x={58} y={130} textAnchor="end" fontSize={7}
          fill="var(--muted-foreground)">K=1</text>
        <text x={422} y={130} fontSize={7}
          fill="var(--muted-foreground)">K=512</text>
        <text x={240} y={130} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">커널 크기 →</text>

        {/* 직접 합성곱 바 (좌측에서 유리) */}
        <rect x={60} y={100} width={140} height={14} rx={3}
          fill={C.attn} fillOpacity={0.2} stroke={C.attn} strokeWidth={0.6} />
        <text x={130} y={110} textAnchor="middle" fontSize={7}
          fontWeight={600} fill={C.attn}>직접 합성곱 유리</text>

        {/* FFT 바 (우측에서 유리) */}
        <rect x={220} y={100} width={200} height={14} rx={3}
          fill={C.fft} fillOpacity={0.2} stroke={C.fft} strokeWidth={0.6} />
        <text x={320} y={110} textAnchor="middle" fontSize={7}
          fontWeight={600} fill={C.fft}>FFT 합성곱 유리</text>

        {/* 교차점 */}
        <line x1={200} y1={94} x2={200} y2={124}
          stroke={C.noise} strokeWidth={1.5} strokeDasharray="3,2" />
        <text x={200} y={92} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={C.noise}>K ≈ 64</text>
        <text x={200} y={140} textAnchor="middle" fontSize={7}
          fill={C.noise}>교차점</text>
      </motion.g>

      <defs>
        <marker id="fftai-arr2" markerWidth="5" markerHeight="5"
          refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.fft} />
        </marker>
      </defs>
    </g>
  );
}

/* ── Step 2: FNet ── */
export function FNetAttention() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">Self-Attention vs FNet (FFT 혼합)</text>

      {/* 좌측: 표준 Attention */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={24} width={190} height={80} rx={6}
          fill={C.attn} fillOpacity={0.05} stroke={C.attn} strokeWidth={0.8} />
        <rect x={20} y={24} width={190} height={14} rx={6}
          fill={C.attn} fillOpacity={0.15} />
        <rect x={20} y={34} width={190} height={4}
          fill={C.attn} fillOpacity={0.15} />
        <text x={115} y={35} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={C.attn}>Standard Attention</text>

        {/* QKV 박스 */}
        {[
          { label: 'Q', x: 35 },
          { label: 'K', x: 80 },
          { label: 'V', x: 125 },
        ].map((q, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.2 + i * 0.08 }}>
            <rect x={q.x} y={46} width={30} height={18} rx={3}
              fill={C.attn} fillOpacity={0.15} stroke={C.attn} strokeWidth={0.6} />
            <text x={q.x + 15} y={58} textAnchor="middle" fontSize={9}
              fontWeight={600} fill={C.attn}>{q.label}</text>
          </motion.g>
        ))}

        {/* Softmax(QK^T)V */}
        <motion.text x={115} y={80} textAnchor="middle" fontSize={8}
          fontFamily="monospace" fill={C.attn}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.4 }}>
          Softmax(QK&#x1D40;)V
        </motion.text>

        {/* 복잡도 */}
        <rect x={155} y={86} width={48} height={14} rx={3}
          fill={C.attn} fillOpacity={0.2} />
        <text x={179} y={96} textAnchor="middle" fontSize={9}
          fontWeight={700} fontFamily="monospace" fill={C.attn}>O(N&#xB2;)</text>
      </motion.g>

      {/* 우측: FNet */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={240} y={24} width={220} height={80} rx={6}
          fill={C.fft} fillOpacity={0.05} stroke={C.fft} strokeWidth={0.8} />
        <rect x={240} y={24} width={220} height={14} rx={6}
          fill={C.fft} fillOpacity={0.15} />
        <rect x={240} y={34} width={220} height={4}
          fill={C.fft} fillOpacity={0.15} />
        <text x={350} y={35} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={C.fft}>FNet (Google, 2021)</text>

        {/* 토큰 입력 → FFT */}
        <rect x={255} y={46} width={50} height={18} rx={3}
          fill={C.wave} fillOpacity={0.15} stroke={C.wave} strokeWidth={0.6} />
        <text x={280} y={58} textAnchor="middle" fontSize={8}
          fill={C.wave}>토큰들</text>

        <motion.line x1={308} y1={55} x2={328} y2={55}
          stroke={C.fft} strokeWidth={0.8}
          markerEnd="url(#fftai-arr3)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.45 }} />

        <rect x={332} y={46} width={50} height={18} rx={3}
          fill={C.fft} fillOpacity={0.2} stroke={C.fft} strokeWidth={0.8} />
        <text x={357} y={58} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.fft}>1D FFT</text>

        <motion.line x1={385} y1={55} x2={405} y2={55}
          stroke={C.fft} strokeWidth={0.8}
          markerEnd="url(#fftai-arr3)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.5 }} />

        <rect x={408} y={46} width={42} height={18} rx={3}
          fill={C.conv} fillOpacity={0.15} stroke={C.conv} strokeWidth={0.6} />
        <text x={429} y={58} textAnchor="middle" fontSize={7}
          fill={C.conv}>혼합됨</text>

        {/* 설명 */}
        <text x={350} y={80} textAnchor="middle" fontSize={8}
          fill={C.fft}>QKV 없이 전역 혼합(global mixing)</text>

        {/* 복잡도 */}
        <rect x={395} y={86} width={58} height={14} rx={3}
          fill={C.fft} fillOpacity={0.2} />
        <text x={424} y={96} textAnchor="middle" fontSize={9}
          fontWeight={700} fontFamily="monospace" fill={C.fft}>O(NlogN)</text>
      </motion.g>

      {/* 하단: 트레이드오프 비교 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={80} y={112} width={320} height={30} rx={5}
          fill="var(--muted)" fillOpacity={0.5} stroke="var(--border)" strokeWidth={0.6} />
        <text x={160} y={125} textAnchor="middle" fontSize={8}
          fill={C.conv} fontWeight={600}>정확도: BERT의 92~97%</text>
        <text x={160} y={136} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">약간의 정확도 손실</text>
        <line x1={240} y1={116} x2={240} y2={138}
          stroke="var(--border)" strokeWidth={0.5} />
        <text x={320} y={125} textAnchor="middle" fontSize={8}
          fill={C.fft} fontWeight={600}>학습 속도: 80% 향상</text>
        <text x={320} y={136} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">O(N&#xB2;) → O(NlogN)</text>
      </motion.g>

      <defs>
        <marker id="fftai-arr3" markerWidth="5" markerHeight="5"
          refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.fft} />
        </marker>
      </defs>
    </g>
  );
}

/* ── Step 3: 노이즈 제거 ── */
export function NoiseRemoval() {
  /* 원본 신호(사인) + 노이즈 */
  const signalPts = Array.from({ length: 50 }, (_, i) => {
    const x = 10 + i * 1.7;
    const clean = 42 + Math.sin(i * 0.3) * 14;
    const noisy = clean + (Math.random() - 0.5) * 12;
    return { x, clean, noisy };
  });
  const noisyPath = signalPts.map(p => `${p.x},${p.noisy}`).join(' ');
  const cleanPath = signalPts.map(p => `${p.x},${p.clean}`).join(' ');

  /* 스펙트럼 바 (좌: 신호 주파수, 우: 노이즈) */
  const specBars = [
    { h: 28, c: C.wave },
    { h: 22, c: C.wave },
    { h: 14, c: C.wave },
    { h: 8, c: C.noise },
    { h: 16, c: C.noise },
    { h: 12, c: C.noise },
    { h: 10, c: C.noise },
    { h: 6, c: C.noise },
  ];

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">FFT 노이즈 제거 파이프라인</text>

      {/* 1. 오염된 신호 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.1 }}>
        <text x={50} y={24} textAnchor="middle" fontSize={8}
          fill={C.noise} fontWeight={600}>신호 + 노이즈</text>
        <polyline points={noisyPath} fill="none"
          stroke={C.noise} strokeWidth={0.8} />
      </motion.g>

      {/* 화살표 1 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.25 }}>
        <line x1={96} y1={42} x2={110} y2={42}
          stroke="#888" strokeWidth={0.8} markerEnd="url(#fftai-arr4)" />
        <text x={103} y={37} textAnchor="middle" fontSize={7}
          fill={C.fft} fontWeight={600}>FFT</text>
      </motion.g>

      {/* 2. 스펙트럼 (주파수 영역) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.35 }}>
        <text x={165} y={24} textAnchor="middle" fontSize={8}
          fill={C.fft} fontWeight={600}>주파수 스펙트럼</text>
        <rect x={118} y={28} width={95} height={40} rx={3}
          fill={C.fft} fillOpacity={0.04} stroke={C.fft} strokeWidth={0.5} />
        {specBars.map((bar, i) => (
          <motion.rect key={i}
            x={123 + i * 11} y={66 - bar.h} width={8} height={bar.h} rx={1}
            fill={bar.c} fillOpacity={0.6}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
            style={{ transformOrigin: `${127 + i * 11}px 66px` }}
            transition={{ ...sp, delay: 0.4 + i * 0.04 }} />
        ))}
        {/* 노이즈 영역 표시 */}
        <rect x={153} y={30} width={56} height={36} rx={2}
          fill="none" stroke={C.attn} strokeWidth={0.8}
          strokeDasharray="3,2" />
        <text x={181} y={74} textAnchor="middle" fontSize={7}
          fill={C.attn}>노이즈 대역</text>
      </motion.g>

      {/* 화살표 2 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.55 }}>
        <line x1={218} y1={42} x2={238} y2={42}
          stroke="#888" strokeWidth={0.8} markerEnd="url(#fftai-arr4)" />
        <text x={228} y={37} textAnchor="middle" fontSize={6.5}
          fill={C.attn} fontWeight={600}>제거</text>
      </motion.g>

      {/* 3. 필터링된 스펙트럼 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.6 }}>
        <text x={290} y={24} textAnchor="middle" fontSize={8}
          fill={C.clean} fontWeight={600}>필터링 후</text>
        <rect x={248} y={28} width={85} height={40} rx={3}
          fill={C.clean} fillOpacity={0.04} stroke={C.clean} strokeWidth={0.5} />
        {specBars.slice(0, 3).map((bar, i) => (
          <motion.rect key={i}
            x={258 + i * 11} y={66 - bar.h} width={8} height={bar.h} rx={1}
            fill={C.wave} fillOpacity={0.6}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.65 + i * 0.04 }} />
        ))}
        {/* 제거된 영역 X 표시 */}
        {specBars.slice(3).map((_, i) => (
          <text key={i}
            x={295 + i * 11} y={58} textAnchor="middle" fontSize={8}
            fill={C.attn} fillOpacity={0.4}>0</text>
        ))}
      </motion.g>

      {/* 화살표 3 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.75 }}>
        <line x1={338} y1={42} x2={358} y2={42}
          stroke="#888" strokeWidth={0.8} markerEnd="url(#fftai-arr4)" />
        <text x={348} y={37} textAnchor="middle" fontSize={6.5}
          fill={C.fft} fontWeight={600}>IFFT</text>
      </motion.g>

      {/* 4. 복원된 깨끗한 신호 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.8 }}>
        <text x={420} y={24} textAnchor="middle" fontSize={8}
          fill={C.clean} fontWeight={600}>깨끗한 신호</text>
        {/* 깨끗한 사인파 */}
        <polyline
          points={signalPts.map(p => `${p.x + 355},${p.clean}`).join(' ')}
          fill="none" stroke={C.clean} strokeWidth={1.2} />
      </motion.g>

      {/* 하단: 파이프라인 요약 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.9 }}>
        <text x={240} y={88} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">
          신호+노이즈 → FFT → 고주파 제거(low-pass filter) → IFFT → 깨끗한 신호
        </text>
      </motion.g>

      <defs>
        <marker id="fftai-arr4" markerWidth="5" markerHeight="5"
          refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#888" />
        </marker>
      </defs>
    </g>
  );
}

/* ── Step 4: Diffusion 주파수 ── */
export function DiffusionFreq() {
  const stages = [
    { label: '순수 노이즈', color: '#94a3b8', desc: 't=T' },
    { label: '저주파 복원', color: C.lowf, desc: '윤곽' },
    { label: '중주파 복원', color: C.fft, desc: '구조' },
    { label: '고주파 복원', color: C.highf, desc: '텍스처' },
    { label: '완성 이미지', color: C.conv, desc: 't=0' },
  ];

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">Diffusion: 저주파 → 고주파 순서로 복원</text>

      {/* 디노이징 단계 */}
      {stages.map((s, i) => {
        const x = 18 + i * 92;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.1 + i * 0.12 }}>
            {/* 이미지 프레임 */}
            <rect x={x} y={28} width={78} height={52} rx={5}
              fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={1} />

            {/* 내부 시각화 — 단계별로 다르게 */}
            {i === 0 && (
              /* 순수 노이즈: 랜덤 점 */
              <>
                {Array.from({ length: 20 }, (_, j) => (
                  <circle key={j}
                    cx={x + 8 + Math.random() * 62}
                    cy={34 + Math.random() * 40}
                    r={1.5} fill={s.color} fillOpacity={0.4} />
                ))}
              </>
            )}
            {i === 1 && (
              /* 저주파: 큰 윤곽 블롭 */
              <>
                <ellipse cx={x + 39} cy={54} rx={22} ry={16}
                  fill={s.color} fillOpacity={0.2} stroke={s.color}
                  strokeWidth={0.8} />
              </>
            )}
            {i === 2 && (
              /* 중주파: 윤곽 + 내부 구조 */
              <>
                <ellipse cx={x + 39} cy={54} rx={22} ry={16}
                  fill={s.color} fillOpacity={0.15} stroke={s.color}
                  strokeWidth={0.8} />
                <line x1={x + 25} y1={54} x2={x + 53} y2={54}
                  stroke={s.color} strokeWidth={0.5} />
                <circle cx={x + 32} cy={48} r={4} fill="none"
                  stroke={s.color} strokeWidth={0.5} />
                <circle cx={x + 46} cy={48} r={4} fill="none"
                  stroke={s.color} strokeWidth={0.5} />
              </>
            )}
            {i === 3 && (
              /* 고주파: 윤곽 + 구조 + 디테일 */
              <>
                <ellipse cx={x + 39} cy={54} rx={22} ry={16}
                  fill={s.color} fillOpacity={0.12} stroke={s.color}
                  strokeWidth={0.8} />
                <circle cx={x + 32} cy={48} r={4} fill={s.color}
                  fillOpacity={0.3} stroke={s.color} strokeWidth={0.5} />
                <circle cx={x + 46} cy={48} r={4} fill={s.color}
                  fillOpacity={0.3} stroke={s.color} strokeWidth={0.5} />
                {/* 텍스처 해칭 */}
                {Array.from({ length: 6 }, (_, j) => (
                  <line key={j}
                    x1={x + 24 + j * 5} y1={58}
                    x2={x + 26 + j * 5} y2={64}
                    stroke={s.color} strokeWidth={0.4} />
                ))}
              </>
            )}
            {i === 4 && (
              /* 완성: 색상 채워진 형태 */
              <>
                <ellipse cx={x + 39} cy={54} rx={22} ry={16}
                  fill={s.color} fillOpacity={0.25} stroke={s.color}
                  strokeWidth={1} />
                <circle cx={x + 32} cy={48} r={4} fill={s.color}
                  fillOpacity={0.5} />
                <circle cx={x + 46} cy={48} r={4} fill={s.color}
                  fillOpacity={0.5} />
                <path d={`M${x + 33},${58} Q${x + 39},${64} ${x + 45},${58}`}
                  fill="none" stroke={s.color} strokeWidth={0.8} />
              </>
            )}

            {/* 라벨 */}
            <text x={x + 39} y={90} textAnchor="middle" fontSize={7.5}
              fontWeight={600} fill={s.color}>{s.label}</text>
            <text x={x + 39} y={100} textAnchor="middle" fontSize={7}
              fill="var(--muted-foreground)">{s.desc}</text>

            {/* 화살표 (마지막 제외) */}
            {i < 4 && (
              <motion.line x1={x + 80} y1={54} x2={x + 90} y2={54}
                stroke="#888" strokeWidth={0.6}
                markerEnd="url(#fftai-arr5)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.3 + i * 0.1 }} />
            )}
          </motion.g>
        );
      })}

      {/* 하단: 주파수 스케줄링 바 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.8 }}>
        {/* 그라데이션 바 (저주파 → 고주파) */}
        <rect x={60} y={110} width={360} height={10} rx={4}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)"
          strokeWidth={0.4} />
        <rect x={60} y={110} width={130} height={10} rx={4}
          fill={C.lowf} fillOpacity={0.3} />
        <rect x={190} y={110} width={100} height={10}
          fill={C.fft} fillOpacity={0.2} />
        <rect x={290} y={110} width={130} height={10} rx={4}
          fill={C.highf} fillOpacity={0.3} />
        <text x={125} y={133} textAnchor="middle" fontSize={7}
          fill={C.lowf}>저주파 (윤곽)</text>
        <text x={240} y={133} textAnchor="middle" fontSize={7}
          fill={C.fft}>중주파 (구조)</text>
        <text x={355} y={133} textAnchor="middle" fontSize={7}
          fill={C.highf}>고주파 (텍스처)</text>
        <text x={240} y={146} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">
          주파수 인지 스케줄링 — 각 단계에 맞는 주파수 대역 집중
        </text>
      </motion.g>

      <defs>
        <marker id="fftai-arr5" markerWidth="5" markerHeight="5"
          refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#888" />
        </marker>
      </defs>
    </g>
  );
}
