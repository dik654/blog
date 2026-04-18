import { motion } from 'framer-motion';
import { C } from './SelfAttnImplDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function InitStep() {
  const layers = [
    { name: 'W_Q', dim: '(512, 64)', desc: 'Q 투영', color: C.q },
    { name: 'W_K', dim: '(512, 64)', desc: 'K 투영', color: C.k },
    { name: 'W_V', dim: '(512, 64)', desc: 'V 투영', color: C.v },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        __init__: 세 가중치 행렬 생성
      </text>
      {/* Input */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={160} y={22} width={160} height={22} rx={5}
          fill={C.muted + '10'} stroke={C.muted} strokeWidth={0.8} />
        <text x={240} y={36} textAnchor="middle" fontSize={8} fill={C.muted}>
          d_model=512, d_k=64
        </text>
      </motion.g>
      {/* Three linear layers */}
      {layers.map((l, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.1, ...sp }}>
          <line x1={240} y1={44} x2={80 + i * 160} y2={58} stroke={l.color} strokeWidth={0.8} />
          <rect x={30 + i * 160} y={58} width={100} height={36} rx={6}
            fill={l.color + '12'} stroke={l.color} strokeWidth={1.2} />
          <text x={80 + i * 160} y={72} textAnchor="middle" fontSize={9}
            fontWeight={700} fill={l.color}>{l.name}</text>
          <text x={80 + i * 160} y={84} textAnchor="middle" fontSize={7}
            fill={l.color} opacity={0.7}>{l.dim} {l.desc}</text>
        </motion.g>
      ))}
      {/* Param count */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={120} y={108} width={240} height={18} rx={4}
          fill={C.out + '10'} stroke={C.out} strokeWidth={0.6} />
        <text x={240} y={120} textAnchor="middle" fontSize={8} fill={C.out}>
          파라미터: 3 × 512 × 64 = 98,304
        </text>
      </motion.g>
      <motion.text x={240} y={148} textAnchor="middle" fontSize={7} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        nn.Linear(d_model, d_k) — bias 포함
      </motion.text>
    </g>
  );
}

function ForwardStep() {
  const steps = [
    { step: '1', text: 'Q = W_Q(x)', shape: '(2, 10, 64)', color: C.q },
    { step: '2', text: 'scores = Q @ K^T / √64', shape: '(2, 10, 10)', color: C.k },
    { step: '3', text: 'attn = softmax(scores)', shape: '(2, 10, 10)', color: C.v },
    { step: '4', text: 'output = attn @ V', shape: '(2, 10, 64)', color: C.out },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        forward: 3단계 파이프라인
      </text>
      {/* Input spec */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={100} y={20} width={280} height={16} rx={4}
          fill={C.muted + '08'} stroke={C.muted} strokeWidth={0.5} />
        <text x={240} y={31} textAnchor="middle" fontSize={7} fill={C.muted}>
          입력 x: (batch=2, seq=10, d=512)
        </text>
      </motion.g>
      {/* Pipeline steps */}
      {steps.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.1, ...sp }}>
          {i > 0 && (
            <line x1={240} y1={38 + i * 26} x2={240} y2={42 + i * 26}
              stroke={C.muted} strokeWidth={0.6} />
          )}
          <rect x={60} y={42 + i * 26} width={360} height={20} rx={5}
            fill={s.color + '10'} stroke={s.color} strokeWidth={0.8} />
          <text x={80} y={55 + i * 26} fontSize={8} fontWeight={600} fill={s.color}>
            {s.step}
          </text>
          <text x={200} y={55 + i * 26} textAnchor="middle" fontSize={8} fill={s.color}>
            {s.text}
          </text>
          <text x={390} y={55 + i * 26} textAnchor="end" fontSize={7} fill={C.muted}>
            {s.shape}
          </text>
        </motion.g>
      ))}
      <motion.text x={240} y={155} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        전부 행렬 연산 → GPU 완전 병렬 처리
      </motion.text>
    </g>
  );
}

function ComplexityStep() {
  const ops = [
    { op: 'Q·K^T', cmplx: 'O(n²·d)', note: '주 병목', color: C.q },
    { op: 'softmax', cmplx: 'O(n²)', note: '행 정규화', color: C.k },
    { op: '·V', cmplx: 'O(n²·d)', note: '가중 합산', color: C.v },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        복잡도: O(n²·d)
      </text>
      {ops.map((o, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.1, ...sp }}>
          <rect x={60} y={24 + i * 28} width={360} height={22} rx={5}
            fill={o.color + '10'} stroke={o.color} strokeWidth={0.8} />
          <text x={120} y={38 + i * 28} textAnchor="middle" fontSize={9}
            fontWeight={600} fill={o.color}>{o.op}</text>
          <text x={240} y={38 + i * 28} textAnchor="middle" fontSize={9} fill={o.color}>
            {o.cmplx}
          </text>
          <text x={380} y={38 + i * 28} textAnchor="end" fontSize={7} fill={C.muted}>
            {o.note}
          </text>
        </motion.g>
      ))}
      {/* Scale comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={80} y={108} width={150} height={20} rx={4}
          fill={C.out + '10'} stroke={C.out} strokeWidth={0.6} />
        <text x={155} y={121} textAnchor="middle" fontSize={7} fill={C.out}>
          n=1024: 5.3×10⁸
        </text>
        <rect x={250} y={108} width={150} height={20} rx={4}
          fill={'#ef4444' + '10'} stroke={'#ef4444'} strokeWidth={0.6} />
        <text x={325} y={121} textAnchor="middle" fontSize={7} fill={'#ef4444'}>
          n=4096: 8.6×10⁹ (16×)
        </text>
      </motion.g>
      <motion.text x={240} y={148} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        메모리 O(n²): attention 행렬 저장이 치명적
      </motion.text>
    </g>
  );
}

function OptimizationsStep() {
  const solutions = [
    { name: 'Flash Attention', desc: 'IO-aware 타일링, 메모리 O(n)', color: C.q },
    { name: 'Sparse Attention', desc: '지역 + 전역 패턴', color: C.k },
    { name: 'Linear Attention', desc: '커널 근사 O(n)', color: C.v },
    { name: 'Ring Attention', desc: '장문맥 분산 처리', color: C.out },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        최적화: Flash / Sparse / Linear
      </text>
      {solutions.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08, ...sp }}>
          <rect x={60} y={24 + i * 26} width={360} height={20} rx={5}
            fill={s.color + '10'} stroke={s.color} strokeWidth={0.8} />
          <text x={140} y={37 + i * 26} textAnchor="middle" fontSize={9}
            fontWeight={600} fill={s.color}>{s.name}</text>
          <text x={320} y={37 + i * 26} textAnchor="middle" fontSize={8} fill={C.muted}>
            {s.desc}
          </text>
        </motion.g>
      ))}
      {/* Advantages */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={60} y={130} width={360} height={18} rx={4}
          fill={C.out + '08'} stroke={C.out} strokeWidth={0.5} />
        <text x={240} y={142} textAnchor="middle" fontSize={7} fill={C.out}>
          장점: O(1) 경로 길이 │ 완전 병렬 │ 해석 가능 (attention matrix)
        </text>
      </motion.g>
    </g>
  );
}

export default function SelfAttnImplDetailSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <InitStep />;
    case 1: return <ForwardStep />;
    case 2: return <ComplexityStep />;
    case 3: return <OptimizationsStep />;
    default: return <g />;
  }
}
