import { motion } from 'framer-motion';
import { C } from './ChainRuleMathVizData';

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

/* ── Step 0: 핵심 공식 ── */
export function ChainMathStep0() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">합성 함수를 쪼개서 각 단계별 미분을 곱한다</text>

      {/* composition diagram */}
      <motion.g {...slideR(0)}>
        <circle cx={60} cy={60} r={22} fill={`${C.layer}12`} stroke={C.layer} strokeWidth={1.2} />
        <text x={60} y={56} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.layer}>x</text>
        <text x={60} y={70} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">입력</text>
      </motion.g>

      <motion.g {...fade(0.1)}>
        <Arr x1={84} y1={60} x2={118} y2={60} color={C.dim} />
        <text x={101} y={52} textAnchor="middle" fontSize={7} fill={C.act}>g</text>
      </motion.g>

      <motion.g {...slideR(0.15)}>
        <circle cx={142} cy={60} r={22} fill={`${C.act}12`} stroke={C.act} strokeWidth={1.2} />
        <text x={142} y={56} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.act}>g(x)</text>
        <text x={142} y={70} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">중간</text>
      </motion.g>

      <motion.g {...fade(0.2)}>
        <Arr x1={166} y1={60} x2={200} y2={60} color={C.dim} />
        <text x={183} y={52} textAnchor="middle" fontSize={7} fill={C.loss}>f</text>
      </motion.g>

      <motion.g {...slideR(0.25)}>
        <circle cx={224} cy={60} r={22} fill={`${C.loss}12`} stroke={C.loss} strokeWidth={1.2} />
        <text x={224} y={56} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.loss}>f(g(x))</text>
        <text x={224} y={70} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">출력</text>
      </motion.g>

      {/* formula */}
      <motion.g {...fade(0.35)}>
        <rect x={275} y={32} width={195} height={56} rx={7}
          fill={`${C.grad}08`} stroke={C.grad} strokeWidth={1.2} />
        <text x={372} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.grad}>연쇄 법칙</text>
        <text x={372} y={70} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--foreground)">
          df/dx = (df/dg) · (dg/dx)
        </text>
      </motion.g>

      {/* NN generalization */}
      <motion.g {...fade(0.45)}>
        <rect x={10} y={100} width={460} height={46} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={20} y={116} fontSize={9} fontWeight={600} fill="var(--foreground)">다층 신경망 일반화:</text>
        <text x={20} y={134} fontSize={9} fontFamily="monospace" fill={C.grad}>
          dL/dw = dL/dy · dy/dx · dx/dw  ← local gradient들의 곱
        </text>
        <text x={380} y={116} fontSize={8} fill="var(--muted-foreground)">
          O(층수) 시간 복잡도
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: 2층 네트워크 예시 ── */
export function ChainMathStep1() {
  const steps = [
    { label: 'h = W₁x + b₁', desc: 'Linear', color: C.layer },
    { label: 'y = relu(h)', desc: 'Activation', color: C.act },
    { label: 'L = MSE(y, t)', desc: 'Loss', color: C.loss },
  ];

  const grads = [
    { deriv: 'dL/dy', value: '2(y − target)', desc: 'MSE 도함수', color: C.loss },
    { deriv: 'dy/dh', value: "relu'(h)", desc: 'ReLU 도함수', color: C.act },
    { deriv: 'dh/dW₁', value: 'xᵀ', desc: 'Linear 도함수', color: C.layer },
  ];

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">Forward 3단계 → Backward에서 역순으로 미분 곱하기</text>

      {/* forward path */}
      {steps.map((s, i) => (
        <motion.g key={i} {...slideR(i * 0.1)}>
          <rect x={10 + i * 150} y={26} width={135} height={36} rx={7}
            fill={`${s.color}10`} stroke={s.color} strokeWidth={1.2} />
          <text x={77 + i * 150} y={42} textAnchor="middle"
            fontSize={9} fontWeight={700} fill={s.color}>{s.label}</text>
          <text x={77 + i * 150} y={56} textAnchor="middle"
            fontSize={8} fill="var(--muted-foreground)">{s.desc}</text>
          {i < 2 && <Arr x1={148 + i * 150} y1={44} x2={160 + i * 150} y2={44} color={C.dim} />}
        </motion.g>
      ))}

      {/* backward gradient chain */}
      <motion.g {...fade(0.3)}>
        <text x={10} y={82} fontSize={9} fontWeight={600} fill={C.grad}>Backward (역방향):</text>
        <text x={10} y={96} fontSize={9} fontFamily="monospace" fill={C.grad}>
          dL/dW₁ = dL/dy · dy/dh · dh/dW₁
        </text>
      </motion.g>

      {grads.map((g, i) => (
        <motion.g key={i} {...slideR(0.4 + i * 0.1)}>
          <rect x={10 + i * 155} y={104} width={145} height={42} rx={6}
            fill={`${g.color}08`} stroke={g.color} strokeWidth={0.8} />
          <text x={20 + i * 155} y={120} fontSize={9} fontWeight={700} fill={g.color}>{g.deriv}</text>
          <text x={20 + i * 155} y={134} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
            = {g.value}
          </text>
          <text x={135 + i * 155} y={120} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">{g.desc}</text>
          {i < 2 && <text x={158 + i * 155} y={125} fontSize={12} fill={C.grad}>×</text>}
        </motion.g>
      ))}
    </g>
  );
}

/* ── Step 2: Jacobian 일반화 ── */
export function ChainMathStep2() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">스칼라 연쇄 법칙을 벡터/행렬로 일반화 → Jacobian 행렬</text>

      {/* scalar vs vector */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={170} height={52} rx={7}
          fill={`${C.dim}08`} stroke={C.dim} strokeWidth={1} />
        <text x={95} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">스칼라</text>
        <text x={95} y={60} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          df/dx = (df/dg) · (dg/dx)
        </text>
      </motion.g>

      <motion.g {...fade(0.1)}>
        <Arr x1={188} y1={52} x2={208} y2={52} color={C.jac} />
        <text x={198} y={44} textAnchor="middle" fontSize={7} fill={C.jac}>일반화</text>
      </motion.g>

      <motion.g {...slideR(0.15)}>
        <rect x={215} y={26} width={255} height={52} rx={7}
          fill={`${C.jac}08`} stroke={C.jac} strokeWidth={1.2} />
        <text x={342} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.jac}>벡터/행렬</text>
        <text x={342} y={60} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--foreground)">
          ∂z/∂x = (∂z/∂y) · J   where J = ∂y/∂x ∈ R^(m×n)
        </text>
      </motion.g>

      {/* Jacobian meaning */}
      <motion.g {...fade(0.3)}>
        <rect x={10} y={90} width={460} height={56} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={20} y={106} fontSize={9} fontWeight={600} fill="var(--foreground)">Backprop에서의 흐름:</text>

        {[
          { x: 20, label: 'upstream', sub: '∂z/∂y', desc: '다음 층에서 옴', color: C.loss },
          { x: 160, label: 'local Jacobian', sub: '∂y/∂x', desc: '이 층의 미분', color: C.jac },
          { x: 320, label: 'downstream', sub: '∂z/∂x', desc: '이전 층으로 전달', color: C.grad },
        ].map((item, i) => (
          <motion.g key={i} {...slideR(0.35 + i * 0.08)}>
            <text x={item.x} y={120} fontSize={9} fontWeight={700} fill={item.color}>{item.label}</text>
            <text x={item.x} y={134} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">{item.sub}</text>
            {i < 2 && <text x={item.x + 130} y={127} fontSize={12} fill={C.grad}>{i === 0 ? '×' : '='}</text>}
          </motion.g>
        ))}
      </motion.g>
    </g>
  );
}

/* ── Step 3: VJP ── */
export function ChainMathStep3() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">Jacobian 전체 계산 대신 VJP만 → autograd의 핵심 최적화</text>

      {/* problem */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={200} height={52} rx={7}
          fill={`${C.loss}08`} stroke={C.loss} strokeWidth={1} />
        <text x={110} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.loss}>명시적 Jacobian</text>
        <text x={20} y={58} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">J ∈ R^(m×n)</text>
        <text x={20} y={72} fontSize={8} fill={C.loss}>→ O(mn) 메모리 낭비</text>
      </motion.g>

      <motion.g {...fade(0.1)}>
        <Arr x1={218} y1={52} x2={238} y2={52} color={C.act} />
      </motion.g>

      {/* solution */}
      <motion.g {...slideR(0.15)}>
        <rect x={245} y={26} width={225} height={52} rx={7}
          fill={`${C.act}08`} stroke={C.act} strokeWidth={1.2} />
        <text x={357} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.act}>VJP (Vector-Jacobian Product)</text>
        <text x={255} y={58} fontSize={9} fontFamily="monospace" fill={C.act}>
          downstream = upstream · W
        </text>
        <text x={255} y={72} fontSize={8} fill="var(--muted-foreground)">
          행렬곱 한 번 → O(n) 메모리
        </text>
      </motion.g>

      {/* Linear layer example */}
      <motion.g {...fade(0.3)}>
        <rect x={10} y={90} width={460} height={56} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={20} y={106} fontSize={9} fontWeight={600} fill="var(--foreground)">예: Linear layer y = Wx</text>
        <text x={20} y={122} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          Jacobian ∂y/∂x = W
        </text>
        <text x={20} y={138} fontSize={9} fontFamily="monospace" fill={C.act}>
          VJP: downstream = upstream · W  ← 이것만 계산하면 됨
        </text>

        <rect x={340} y={100} width={120} height={38} rx={5}
          fill={`${C.grad}08`} stroke={C.grad} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={400} y={116} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.grad}>autograd</text>
        <text x={400} y={132} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          PyTorch 자동화
        </text>
      </motion.g>
    </g>
  );
}
