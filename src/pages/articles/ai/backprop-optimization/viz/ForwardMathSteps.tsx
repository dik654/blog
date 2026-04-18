import { motion } from 'framer-motion';
import { C } from './ForwardMathVizData';

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
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} />
      <polygon points={`${x2},${y2} ${ax + px},${ay + py} ${ax - px},${ay - py}`} fill={color} />
    </g>
  );
}

/* ── Step 0: 단일 뉴런 ── */
export function ForwardMathStep0() {
  const inputs = [
    { label: 'x₁', y: 30 },
    { label: 'x₂', y: 60 },
    { label: 'xₙ', y: 110 },
  ];
  const neuronX = 160, neuronY = 70;

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">뉴런 = 학습 가능한 직선 (z = w·x + b)</text>

      {/* inputs */}
      {inputs.map((inp, i) => (
        <motion.g key={i} {...slideR(i * 0.1)}>
          <circle cx={40} cy={inp.y} r={14} fill={`${C.input}15`} stroke={C.input} strokeWidth={1} />
          <text x={40} y={inp.y + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.input}>{inp.label}</text>
          <line x1={54} y1={inp.y} x2={neuronX - 22} y2={neuronY} stroke={C.weight} strokeWidth={0.8} />
          <text x={80 + i * 10} y={inp.y + (neuronY - inp.y) * 0.4 - 4}
            fontSize={7} fill={C.weight} fontWeight={600}>w{i === 2 ? 'ₙ' : String(i + 1)}</text>
        </motion.g>
      ))}
      {/* dots between x2 and xn */}
      <motion.text x={40} y={88} textAnchor="middle" fontSize={10} fill={C.dim} {...fade(0.2)}>⋮</motion.text>

      {/* neuron circle */}
      <motion.g {...fade(0.3)}>
        <circle cx={neuronX} cy={neuronY} r={22} fill={`${C.act}12`} stroke={C.act} strokeWidth={1.5} />
        <text x={neuronX} y={66} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.act}>Σ + b</text>
        <text x={neuronX} y={79} textAnchor="middle" fontSize={8} fill={C.act}>f(z)</text>
      </motion.g>

      {/* output */}
      <motion.g {...fade(0.4)}>
        <Arr x1={neuronX + 24} y1={neuronY} x2={230} y2={neuronY} color={C.output} />
        <text x={240} y={neuronY + 4} fontSize={10} fontWeight={700} fill={C.output}>a</text>
      </motion.g>

      {/* formula box */}
      <motion.g {...fade(0.5)}>
        <rect x={270} y={22} width={190} height={100} rx={7}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={282} y={40} fontSize={9} fontWeight={700} fill="var(--foreground)">직선 방정식 해석</text>
        <text x={282} y={56} fontSize={9} fontFamily="monospace" fill={C.weight}>z = w·x + b</text>
        <text x={282} y={72} fontSize={8} fill="var(--muted-foreground)">w = 기울기(slope)</text>
        <text x={282} y={86} fontSize={8} fill="var(--muted-foreground)">b = 절편(intercept)</text>
        <text x={282} y={104} fontSize={9} fontFamily="monospace" fill={C.act}>a = f(z)  ← 비선형성</text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: 다층 신경망 ── */
export function ForwardMathStep1() {
  const layers = [
    { label: 'x', eq: '입력', color: C.input },
    { label: 'Layer 1', eq: 'z⁽¹⁾= W⁽¹⁾·x + b⁽¹⁾', act: 'a⁽¹⁾= f(z⁽¹⁾)', color: C.weight },
    { label: 'Layer 2', eq: 'z⁽²⁾= W⁽²⁾·a⁽¹⁾+ b⁽²⁾', act: 'a⁽²⁾= f(z⁽²⁾)', color: C.act },
    { label: 'Output', eq: 'ŷ = softmax(z⁽ᴸ⁾)', act: '또는 ŷ = z⁽ᴸ⁾', color: C.output },
  ];

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">각 층: 선형변환 → 활성화 반복</text>

      {layers.map((l, i) => {
        const x = 10 + i * 118;
        const w = i === 0 ? 70 : 105;
        const h = i === 0 ? 40 : 65;
        return (
          <motion.g key={i} {...slideR(i * 0.12)}>
            <rect x={x} y={30} width={w} height={h} rx={7}
              fill={`${l.color}10`} stroke={l.color} strokeWidth={1.2} />
            <text x={x + w / 2} y={46} textAnchor="middle"
              fontSize={10} fontWeight={700} fill={l.color}>{l.label}</text>
            {i > 0 && (
              <>
                <text x={x + w / 2} y={62} textAnchor="middle"
                  fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">{l.eq}</text>
                <text x={x + w / 2} y={78} textAnchor="middle"
                  fontSize={8} fontFamily="monospace" fill={l.color}>{l.act}</text>
              </>
            )}
            {i < layers.length - 1 && (
              <Arr x1={x + w + 2} y1={50} x2={10 + (i + 1) * 118 - 2} y2={50} color={C.dim} />
            )}
          </motion.g>
        );
      })}

      {/* pattern highlight */}
      <motion.g {...fade(0.5)}>
        <rect x={10} y={105} width={460} height={28} rx={5}
          fill={`${C.act}08`} stroke={C.act} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={240} y={123} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.act}>
          패턴: 선형변환(W·a + b) → 활성화(f) → 다음 층 입력 — 이 반복이 "깊은" 학습
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: 행렬 크기 추적 ── */
export function ForwardMathStep2() {
  const dims = [
    { label: 'x', shape: '784', desc: 'MNIST 28×28', color: C.input, x: 10 },
    { label: 'W⁽¹⁾', shape: '128×784', desc: '100,352 params', color: C.weight, x: 100 },
    { label: 'a⁽¹⁾', shape: '128', desc: '은닉 표현', color: C.act, x: 210 },
    { label: 'W⁽²⁾', shape: '10×128', desc: '1,280 params', color: C.weight, x: 295 },
    { label: 'ŷ', shape: '10', desc: '클래스 확률', color: C.output, x: 395 },
  ];

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">MNIST 2층 MLP — 차원이 흐르는 과정</text>

      {dims.map((d, i) => {
        const w = i === 1 || i === 3 ? 95 : 75;
        return (
          <motion.g key={i} {...slideR(i * 0.1)}>
            <rect x={d.x} y={26} width={w} height={52} rx={7}
              fill={`${d.color}10`} stroke={d.color} strokeWidth={1.2} />
            <text x={d.x + w / 2} y={42} textAnchor="middle"
              fontSize={10} fontWeight={700} fill={d.color}>{d.label}</text>
            <text x={d.x + w / 2} y={56} textAnchor="middle"
              fontSize={9} fontFamily="monospace" fontWeight={600} fill="var(--foreground)">{d.shape}</text>
            <text x={d.x + w / 2} y={70} textAnchor="middle"
              fontSize={7} fill="var(--muted-foreground)">{d.desc}</text>
            {i < dims.length - 1 && (
              <Arr x1={d.x + w + 2} y1={52} x2={dims[i + 1].x - 2} y2={52} color={C.dim} />
            )}
          </motion.g>
        );
      })}

      {/* total params */}
      <motion.g {...fade(0.5)}>
        <rect x={10} y={90} width={460} height={44} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={20} y={106} fontSize={9} fontWeight={600} fill="var(--foreground)">파라미터 합산:</text>
        <text x={20} y={122} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          W⁽¹⁾: 128×784 = 100,352   b⁽¹⁾: 128   W⁽²⁾: 10×128 = 1,280   b⁽²⁾: 10
        </text>
        <text x={420} y={106} fontSize={10} fontWeight={700} fill={C.output}>총 101,770</text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: 배치 처리 ── */
export function ForwardMathStep3() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">B개 입력을 행렬곱 한 줄로 동시 계산</text>

      {/* single vs batch comparison */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={24} width={210} height={48} rx={7}
          fill={`${C.input}10`} stroke={C.input} strokeWidth={1} />
        <text x={115} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.input}>단일 입력</text>
        <text x={115} y={56} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          x ∈ R^d → z ∈ R^h → a ∈ R^h
        </text>
      </motion.g>

      <motion.g {...slideR(0.15)}>
        <rect x={240} y={24} width={230} height={48} rx={7}
          fill={`${C.batch}10`} stroke={C.batch} strokeWidth={1.2} />
        <text x={355} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.batch}>배치 입력 (B개 동시)</text>
        <text x={355} y={56} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          X(B×d) @ W.T(d×h) + b = Z(B×h)
        </text>
      </motion.g>

      {/* matrix shape visualization */}
      <motion.g {...fade(0.3)}>
        <rect x={10} y={84} width={460} height={54} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={20} y={100} fontSize={9} fontWeight={700} fill="var(--foreground)">MNIST batch=32 예시:</text>

        {/* X */}
        <rect x={20} y={106} width={50} height={24} rx={4}
          fill={`${C.input}15`} stroke={C.input} strokeWidth={0.8} />
        <text x={45} y={121} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.input}>32×784</text>

        <text x={78} y={121} fontSize={9} fill={C.dim}>@</text>

        {/* W.T */}
        <rect x={90} y={106} width={55} height={24} rx={4}
          fill={`${C.weight}15`} stroke={C.weight} strokeWidth={0.8} />
        <text x={117} y={121} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.weight}>784×128</text>

        <text x={153} y={121} fontSize={9} fill={C.dim}>+b =</text>

        {/* Z */}
        <rect x={182} y={106} width={50} height={24} rx={4}
          fill={`${C.act}15`} stroke={C.act} strokeWidth={0.8} />
        <text x={207} y={121} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.act}>32×128</text>

        <Arr x1={240} y1={118} x2={258} y2={118} color={C.dim} />
        <text x={262} y={121} fontSize={8} fontFamily="monospace" fill={C.act}>relu()</text>

        <Arr x1={298} y1={118} x2={316} y2={118} color={C.dim} />

        <rect x={320} y={106} width={46} height={24} rx={4}
          fill={`${C.output}15`} stroke={C.output} strokeWidth={0.8} />
        <text x={343} y={121} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.output}>32×10</text>

        <text x={380} y={121} fontSize={8} fontWeight={600} fill="var(--muted-foreground)">← 32개 동시 예측</text>
      </motion.g>
    </g>
  );
}

/* ── Step 4: GPU 벡터화 + 메모리 ── */
export function ForwardMathStep4() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">동일 문법, 수천 배 속도 차이 — 중간값은 backward용으로 보관</text>

      {/* CPU vs GPU */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={24} width={215} height={58} rx={7}
          fill={`${C.dim}10`} stroke={C.dim} strokeWidth={1} />
        <text x={117} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.dim}>NumPy (CPU)</text>
        <text x={20} y={56} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">X = np.random.randn(32, 784)</text>
        <text x={20} y={70} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">Z = X @ W.T + b</text>
      </motion.g>

      <motion.g {...slideR(0.15)}>
        <rect x={245} y={24} width={225} height={58} rx={7}
          fill={`${C.batch}10`} stroke={C.batch} strokeWidth={1.2} />
        <text x={357} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.batch}>PyTorch (GPU)</text>
        <text x={255} y={56} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">X = torch.randn(32,784,device='cuda')</text>
        <text x={255} y={70} fontSize={8} fontFamily="monospace" fill={C.batch}>Z = X @ W.T + b  # 동일 문법!</text>
      </motion.g>

      {/* speed comparison bar */}
      <motion.g {...fade(0.3)}>
        <text x={10} y={102} fontSize={9} fontWeight={600} fill="var(--foreground)">속도 비교:</text>
        <rect x={80} y={92} width={30} height={14} rx={3} fill={C.dim} fillOpacity={0.4} />
        <text x={116} y={103} fontSize={8} fill={C.dim}>CPU ×1</text>

        <rect x={80} y={110} width={300} height={14} rx={3} fill={C.batch} fillOpacity={0.4} />
        <text x={386} y={121} fontSize={8} fontWeight={700} fill={C.batch}>GPU ×1000+</text>
      </motion.g>

      {/* memory note */}
      <motion.g {...fade(0.45)}>
        <rect x={10} y={130} width={460} height={18} rx={4}
          fill={`${C.act}08`} stroke={C.act} strokeWidth={0.6} strokeDasharray="4 3" />
        <text x={240} y={143} textAnchor="middle" fontSize={8} fill={C.act}>
          Forward 중간값(a⁽¹⁾, a⁽²⁾...) 저장 → backward에서 ∂L/∂W 계산에 재사용 → GPU 메모리 병목 주원인
        </text>
      </motion.g>
    </g>
  );
}
