import { motion } from 'framer-motion';
import { C } from './CooleyTukeyVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slideR = (d: number) => ({ initial: { opacity: 0, x: -6 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

function Arr({ x1, y1, x2, y2, color = C.dim }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 5, ay = y2 - uy * 5;
  const px = -uy * 3, py = ux * 3;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
      <polygon points={`${x2},${y2} ${ax + px},${ay + py} ${ax - px},${ay - py}`} fill={color} />
    </g>
  );
}

/* ── Step 0: 홀짝 분할 ── */
export function CooleyTukeyStep0() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">N-point DFT → 짝수(E) + 홀수(O) N/2-point DFT</text>

      {/* 좌측: N-point DFT 큰 박스 */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={28} width={90} height={110} rx={7}
          fill="#64748b0a" stroke={C.dim} strokeWidth={1.2} />
        <text x={55} y={46} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">N-point DFT</text>
        {/* 인덱스 나열 */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <text key={i} x={55} y={60 + i * 10} textAnchor="middle" fontSize={7}
            fill={i % 2 === 0 ? C.even : C.odd} fontWeight={600}>
            x[{i}] {i % 2 === 0 ? '짝' : '홀'}
          </text>
        ))}
      </motion.g>

      {/* 분할 화살표 */}
      <motion.g {...fade(0.2)}>
        <Arr x1={105} y1={58} x2={145} y2={44} color={C.even} />
        <Arr x1={105} y1={108} x2={145} y2={114} color={C.odd} />
      </motion.g>

      {/* 우측 상단: Even (짝수) */}
      <motion.g {...slideR(0.25)}>
        <rect x={150} y={24} width={130} height={56} rx={7}
          fill={`${C.even}0a`} stroke={C.even} strokeWidth={1.2} />
        <rect x={150} y={24} width={130} height={18} rx={7} fill={C.even} />
        <rect x={150} y={35} width={130} height={7} fill={C.even} />
        <text x={215} y={37} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">E_k (짝수 DFT)</text>
        <text x={160} y={55} fontSize={8} fill="var(--muted-foreground)">x[0], x[2], x[4], x[6]</text>
        <text x={160} y={68} fontSize={8} fontFamily="monospace" fill={C.even}>N/2-point DFT</text>
      </motion.g>

      {/* 우측 하단: Odd (홀수) */}
      <motion.g {...slideR(0.35)}>
        <rect x={150} y={90} width={130} height={56} rx={7}
          fill={`${C.odd}0a`} stroke={C.odd} strokeWidth={1.2} />
        <rect x={150} y={90} width={130} height={18} rx={7} fill={C.odd} />
        <rect x={150} y={101} width={130} height={7} fill={C.odd} />
        <text x={215} y={103} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">O_k (홀수 DFT)</text>
        <text x={160} y={121} fontSize={8} fill="var(--muted-foreground)">x[1], x[3], x[5], x[7]</text>
        <text x={160} y={134} fontSize={8} fontFamily="monospace" fill={C.odd}>N/2-point DFT</text>
      </motion.g>

      {/* 합산 화살표 → 출력 */}
      <motion.g {...fade(0.45)}>
        <Arr x1={284} y1={50} x2={320} y2={66} color={C.even} />
        <Arr x1={284} y1={118} x2={320} y2={100} color={C.odd} />
      </motion.g>

      {/* 출력 박스 */}
      <motion.g {...fade(0.5)}>
        <rect x={325} y={56} width={145} height={56} rx={7}
          fill={`${C.out}0a`} stroke={C.out} strokeWidth={1.2} />
        <text x={397} y={74} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.out}>
          X_k = E_k + ω^k · O_k
        </text>
        <text x={397} y={90} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          k = 0, 1, ..., N/2 - 1
        </text>
        <text x={397} y={104} textAnchor="middle" fontSize={8} fill={C.twiddle}>
          ω^k = twiddle factor
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: Butterfly 연산 ── */
export function CooleyTukeyStep1() {
  const topY = 42;
  const botY = 120;
  const leftX = 50;
  const midX = 240;
  const rightX = 410;

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">Butterfly: 한 쌍의 입력 → 두 개의 출력 (+ / -)</text>

      {/* 입력 노드: E_k */}
      <motion.g {...slideR(0)}>
        <circle cx={leftX} cy={topY} r={16} fill={`${C.even}15`} stroke={C.even} strokeWidth={1.5} />
        <text x={leftX} y={topY + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.even}>E_k</text>
      </motion.g>

      {/* 입력 노드: O_k */}
      <motion.g {...slideR(0.1)}>
        <circle cx={leftX} cy={botY} r={16} fill={`${C.odd}15`} stroke={C.odd} strokeWidth={1.5} />
        <text x={leftX} y={botY + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.odd}>O_k</text>
      </motion.g>

      {/* twiddle factor 곱셈 (O_k → ω^k·O_k) */}
      <motion.g {...fade(0.15)}>
        <line x1={leftX + 18} y1={botY} x2={midX - 16} y2={botY} stroke={C.odd} strokeWidth={1} />
        <rect x={130} y={botY - 12} width={50} height={24} rx={5}
          fill={`${C.twiddle}15`} stroke={C.twiddle} strokeWidth={1} />
        <text x={155} y={botY + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.twiddle}>×ω^k</text>
      </motion.g>

      {/* 중간 합산 노드: + */}
      <motion.g {...fade(0.25)}>
        <circle cx={midX} cy={topY} r={14} fill={`${C.out}15`} stroke={C.out} strokeWidth={1.5} />
        <text x={midX} y={topY + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.out}>+</text>
      </motion.g>

      {/* 중간 합산 노드: - */}
      <motion.g {...fade(0.3)}>
        <circle cx={midX} cy={botY} r={14} fill={`${C.dft}15`} stroke={C.dft} strokeWidth={1.5} />
        <text x={midX} y={botY + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.dft}>-</text>
      </motion.g>

      {/* 연결선: E_k → + */}
      <motion.g {...fade(0.2)}>
        <line x1={leftX + 18} y1={topY} x2={midX - 16} y2={topY} stroke={C.even} strokeWidth={1.2} />
      </motion.g>

      {/* 연결선: E_k → - (대각선) */}
      <motion.g {...fade(0.25)}>
        <line x1={leftX + 14} y1={topY + 12} x2={midX - 12} y2={botY - 10} stroke={C.even} strokeWidth={0.8} strokeDasharray="3 2" />
      </motion.g>

      {/* 연결선: ω^k·O_k → + (대각선) */}
      <motion.g {...fade(0.3)}>
        <line x1={midX - 1} y1={botY - 2} x2={midX - 1} y2={topY + 16} stroke={C.twiddle} strokeWidth={0.8} strokeDasharray="3 2" />
      </motion.g>

      {/* 연결선: ω^k·O_k → - */}
      <motion.g {...fade(0.3)}>
        <line x1={midX + 1} y1={botY} x2={midX + 1} y2={botY} stroke={C.twiddle} strokeWidth={0} />
      </motion.g>

      {/* 출력: X_k */}
      <motion.g {...fade(0.35)}>
        <line x1={midX + 16} y1={topY} x2={rightX - 50} y2={topY} stroke={C.out} strokeWidth={1.2} />
        <rect x={rightX - 50} y={topY - 14} width={90} height={28} rx={6}
          fill={`${C.out}10`} stroke={C.out} strokeWidth={1.2} />
        <text x={rightX - 5} y={topY + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.out}>
          X_k
        </text>
      </motion.g>

      {/* 출력: X_{k+N/2} */}
      <motion.g {...fade(0.4)}>
        <line x1={midX + 16} y1={botY} x2={rightX - 50} y2={botY} stroke={C.dft} strokeWidth={1.2} />
        <rect x={rightX - 50} y={botY - 14} width={90} height={28} rx={6}
          fill={`${C.dft}10`} stroke={C.dft} strokeWidth={1.2} />
        <text x={rightX - 5} y={botY + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.dft}>
          X_{'{'}k+N/2{'}'}
        </text>
      </motion.g>

      {/* 수식 요약 */}
      <motion.g {...fade(0.5)}>
        <rect x={300} y={64} width={170} height={42} rx={6}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.6} />
        <text x={385} y={78} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={C.out}>X_k = E_k + ω^k · O_k</text>
        <text x={385} y={96} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={C.dft}>X_{'{'}k+N/2{'}'} = E_k - ω^k · O_k</text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: Twiddle Factor — 단위원 ── */
export function CooleyTukeyStep2() {
  const cx = 110, cy = 84, r = 48;
  const N = 8;
  const points = Array.from({ length: N }, (_, k) => {
    const angle = (-2 * Math.PI * k) / N;
    return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle), k };
  });

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">ω_N^k = e^(-2πik/N) — 단위원 위 N등분 점</text>

      {/* 단위원 */}
      <motion.g {...fade(0)}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={0.8} />
        <line x1={cx - r - 8} y1={cy} x2={cx + r + 8} y2={cy} stroke="var(--border)" strokeWidth={0.5} />
        <line x1={cx} y1={cy - r - 8} x2={cx} y2={cy + r + 8} stroke="var(--border)" strokeWidth={0.5} />
        <text x={cx + r + 10} y={cy + 3} fontSize={7} fill="var(--muted-foreground)">Re</text>
        <text x={cx + 3} y={cy - r - 10} fontSize={7} fill="var(--muted-foreground)">Im</text>
      </motion.g>

      {/* N등분 점 */}
      {points.map((p, i) => (
        <motion.g key={i} {...fade(0.05 * i + 0.1)}>
          <circle cx={p.x} cy={p.y} r={4}
            fill={i < N / 2 ? C.twiddle : C.dft}
            stroke={i < N / 2 ? C.twiddle : C.dft} strokeWidth={1} />
          <text x={p.x + (p.x > cx ? 8 : -8)} y={p.y + (p.y > cy ? 12 : -6)}
            textAnchor={p.x > cx ? 'start' : 'end'}
            fontSize={8} fontWeight={600} fill={i < N / 2 ? C.twiddle : C.dft}>
            ω^{i}
          </text>
        </motion.g>
      ))}

      {/* 대칭 관계 표시 */}
      <motion.g {...fade(0.5)}>
        {/* k=1 과 k=5 연결 (대칭 예시) */}
        <line x1={points[1].x} y1={points[1].y} x2={points[5].x} y2={points[5].y}
          stroke={C.twiddle} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={7} fontWeight={600}
          fill={C.twiddle}>대칭</text>
      </motion.g>

      {/* 우측 설명 패널 */}
      <motion.g {...fade(0.3)}>
        <rect x={210} y={20} width={258} height={125} rx={7}
          fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.8} />
        <text x={222} y={38} fontSize={9} fontWeight={700} fill="var(--foreground)">핵심 대칭성</text>
        <text x={222} y={56} fontSize={9} fontFamily="monospace" fill={C.twiddle}>ω^(k+N/2) = -ω^k</text>
        <text x={222} y={72} fontSize={8} fill="var(--muted-foreground)">
          반바퀴(180°) 돌면 부호만 반전
        </text>

        <line x1={222} y1={80} x2={456} y2={80} stroke="var(--border)" strokeWidth={0.5} />

        <text x={222} y={96} fontSize={9} fontWeight={700} fill="var(--foreground)">의미</text>
        <text x={222} y={112} fontSize={8} fill="var(--muted-foreground)">
          ω^k 한 번 계산 → ω^(k+N/2)는 부호 반전
        </text>
        <text x={222} y={128} fontSize={8} fill={C.out}>→ butterfly: 곱셈 절반 감소</text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: 4-point FFT 트레이스 (간소화) ── */
export function CooleyTukeyStep3() {
  /* 4-point: x=[1,1,0,0], bit-rev=[x0,x2,x1,x3]=[1,0,1,0] */
  const nW = 32, nH = 18, gY = 30;
  const sY = 22;
  const col = [20, 155, 310]; // 입력, Stage1, Stage2
  const ny = (i: number) => sY + i * gY;

  const inp = ['1', '0', '1', '0'];
  const s1  = ['1', '1', '-1', '-1']; // [a+b, a-b] pairs
  const out = ['2', '-2', '0', '0'];  // simplified

  const nodeBox = (x: number, y: number, val: string, color: string) => (
    <g>
      <rect x={x} y={y - nH / 2} width={nW} height={nH} rx={4}
        fill={`${color}12`} stroke={color} strokeWidth={1} />
      <text x={x + nW / 2} y={y + 4} textAnchor="middle"
        fontSize={9} fontWeight={700} fill={color}>{val}</text>
    </g>
  );

  return (
    <g>
      {/* 라벨 */}
      <motion.g {...fade(0)}>
        <text x={col[0] + nW / 2} y={sY - 10} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">입력 (bit-rev)</text>
        <text x={col[1] + nW / 2} y={sY - 10} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.even}>Stage 1</text>
        <text x={col[2] + nW / 2} y={sY - 10} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.out}>Stage 2 (출력)</text>
      </motion.g>

      {/* 입력 노드 */}
      {inp.map((v, i) => (
        <motion.g key={`i${i}`} {...slideR(0.05 * i)}>
          {nodeBox(col[0], ny(i), v, '#94a3b8')}
        </motion.g>
      ))}

      {/* Stage 1: 길이 2 butterfly — (0,1), (2,3) */}
      <motion.g {...fade(0.2)}>
        {[[0, 1], [2, 3]].map(([a, b]) => (
          <g key={`s1-${a}`}>
            <line x1={col[0] + nW} y1={ny(a)} x2={col[1]} y2={ny(a)} stroke={C.even} strokeWidth={1} />
            <line x1={col[0] + nW} y1={ny(b)} x2={col[1]} y2={ny(a)} stroke={C.even} strokeWidth={0.6} strokeDasharray="3 2" />
            <line x1={col[0] + nW} y1={ny(a)} x2={col[1]} y2={ny(b)} stroke={C.even} strokeWidth={0.6} strokeDasharray="3 2" />
            <line x1={col[0] + nW} y1={ny(b)} x2={col[1]} y2={ny(b)} stroke={C.even} strokeWidth={1} />
            {/* +/- 라벨 */}
            <rect x={col[1] - 18} y={ny(a) - 6} width={14} height={12} rx={3} fill="var(--card)" stroke={C.even} strokeWidth={0.5} />
            <text x={col[1] - 11} y={ny(a) + 3} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.even}>+</text>
            <rect x={col[1] - 18} y={ny(b) - 6} width={14} height={12} rx={3} fill="var(--card)" stroke={C.even} strokeWidth={0.5} />
            <text x={col[1] - 11} y={ny(b) + 3} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.even}>−</text>
            {nodeBox(col[1], ny(a), s1[a], C.even)}
            {nodeBox(col[1], ny(b), s1[b], C.even)}
          </g>
        ))}
      </motion.g>

      {/* Stage 2: 길이 4 butterfly — (0,2), (1,3) */}
      <motion.g {...fade(0.4)}>
        {[[0, 2], [1, 3]].map(([a, b]) => (
          <g key={`s2-${a}`}>
            <line x1={col[1] + nW} y1={ny(a)} x2={col[2]} y2={ny(a)} stroke={C.out} strokeWidth={1} />
            <line x1={col[1] + nW} y1={ny(b)} x2={col[2]} y2={ny(a)} stroke={C.out} strokeWidth={0.6} strokeDasharray="3 2" />
            <line x1={col[1] + nW} y1={ny(a)} x2={col[2]} y2={ny(b)} stroke={C.out} strokeWidth={0.6} strokeDasharray="3 2" />
            <line x1={col[1] + nW} y1={ny(b)} x2={col[2]} y2={ny(b)} stroke={C.out} strokeWidth={1} />
            {/* twiddle factor 라벨 */}
            <rect x={(col[1] + nW + col[2]) / 2 - 14} y={ny(a) - 14} width={28} height={12} rx={3}
              fill="var(--card)" stroke={C.twiddle} strokeWidth={0.5} />
            <text x={(col[1] + nW + col[2]) / 2} y={ny(a) - 5} textAnchor="middle"
              fontSize={7} fontWeight={600} fill={C.twiddle}>×ω^{a}</text>
            {nodeBox(col[2], ny(a), out[a], C.out)}
            {nodeBox(col[2], ny(b), out[b], C.out)}
          </g>
        ))}
      </motion.g>

      {/* 하단 요약 */}
      <motion.g {...fade(0.6)}>
        <rect x={20} y={138} width={440} height={14} rx={4}
          fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={148} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          log₂(4)=2단계 × 2 butterfly = 4회 (vs DFT 16회) — 8-point는 3단계 12회 (vs 64회)
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 4: 복잡도 비교 ── */
export function CooleyTukeyStep4() {
  const data = [
    { n: '8', dft: 64, fft: 24, ratio: '2.7×' },
    { n: '64', dft: 4096, fft: 384, ratio: '10.7×' },
    { n: '1024', dft: 1048576, fft: 10240, ratio: '102×' },
    { n: '1M', dft: 1e12, fft: 2e7, ratio: '50,000×' },
  ];

  const barMaxW = 200;
  const barH = 14;
  const startX = 160;

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">N² (DFT) vs N·log₂N (FFT) — N이 클수록 차이 폭발</text>

      {/* 테이블 헤더 */}
      <motion.g {...fade(0)}>
        <text x={20} y={32} fontSize={8} fontWeight={700} fill="var(--foreground)">N</text>
        <text x={60} y={32} fontSize={8} fontWeight={700} fill={C.dft}>N² (DFT)</text>
        <text x={130} y={32} fontSize={8} fontWeight={700} fill={C.fft}>N·logN (FFT)</text>
        <text x={370} y={32} fontSize={8} fontWeight={700} fill="var(--foreground)">절감</text>
        <line x1={10} y1={36} x2={460} y2={36} stroke="var(--border)" strokeWidth={0.5} />
      </motion.g>

      {data.map((d, i) => {
        const y = 44 + i * 24;
        const dftLog = Math.log10(d.dft);
        const fftLog = Math.log10(d.fft);
        const maxLog = Math.log10(1e12);
        const dftW = Math.max(8, (dftLog / maxLog) * barMaxW);
        const fftW = Math.max(8, (fftLog / maxLog) * barMaxW);

        return (
          <motion.g key={i} {...slideR(0.08 * i + 0.1)}>
            <text x={20} y={y + 4} fontSize={9} fontWeight={700} fill="var(--foreground)">{d.n}</text>

            {/* DFT bar */}
            <rect x={startX} y={y - 6} width={dftW} height={11} rx={2}
              fill={`${C.dft}30`} stroke={C.dft} strokeWidth={0.8} />
            <text x={startX + dftW + 4} y={y + 3} fontSize={7} fill={C.dft}>
              {d.dft >= 1e6 ? d.dft.toExponential(0) : d.dft.toLocaleString()}
            </text>

            {/* FFT bar */}
            <rect x={startX} y={y + 7} width={fftW} height={11} rx={2}
              fill={`${C.fft}30`} stroke={C.fft} strokeWidth={0.8} />
            <text x={startX + fftW + 4} y={y + 16} fontSize={7} fill={C.fft}>
              {d.fft >= 1e6 ? d.fft.toExponential(0) : d.fft.toLocaleString()}
            </text>

            {/* 절감 비율 */}
            <text x={420} y={y + 8} fontSize={10} fontWeight={700}
              fill={i === data.length - 1 ? C.out : 'var(--foreground)'}>{d.ratio}</text>
          </motion.g>
        );
      })}

      {/* 결론 */}
      <motion.g {...fade(0.5)}>
        <rect x={10} y={138} width={460} height={14} rx={4}
          fill={`${C.out}08`} stroke={C.out} strokeWidth={0.6} strokeDasharray="4 3" />
        <text x={240} y={148} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.out}>
          N=1M → DFT 10¹² vs FFT 2×10⁷ ≈ 50,000배 — 실시간 처리의 핵심
        </text>
      </motion.g>
    </g>
  );
}
