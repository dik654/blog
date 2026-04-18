import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './RnnLstmVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

export function RnnStructStep() {
  return (
    <g>
      {/* inputs */}
      <VizBox x={8} y={10} w={85} h={26} label="x_t=[0.5, 0.3]" sub="현재 입력 (D=2)" c={CA} />
      <VizBox x={8} y={55} w={85} h={26} label="h=[0.2, 0.1]" sub="이전 은닉 (H=2)" c={CA} delay={0.08} />

      {/* weight matrices */}
      <VizBox x={120} y={10} w={115} h={26}
        label="x @ W_x" sub="[0.5,0.3]@[[.4,-.2],[.3,.5]]" c={CE} delay={0.15} />
      <VizBox x={120} y={55} w={115} h={26}
        label="h @ W_h" sub="[0.2,0.1]@[[.6,.1],[-.3,.8]]" c={CE} delay={0.2} />

      {/* connecting lines */}
      <motion.line x1={93} y1={23} x2={120} y2={23}
        stroke={CA} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.12 }} />
      <motion.line x1={93} y1={68} x2={120} y2={68}
        stroke={CA} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.17 }} />

      {/* sum */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.28 }}>
        <circle cx={270} cy={45} r={12} fill={`${CV}15`} stroke={CV} strokeWidth={1} />
        <text x={270} y={48} textAnchor="middle" fontSize={12} fontWeight={600} fill={CV}>+</text>
      </motion.g>
      <motion.line x1={235} y1={23} x2={258} y2={40}
        stroke={CE} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 }} />
      <motion.line x1={235} y1={68} x2={258} y2={50}
        stroke={CE} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.27 }} />

      {/* intermediate */}
      <VizBox x={300} y={32} w={85} h={26}
        label="z = [0.48, 0.25]" sub="+ bias [0.1, 0.1]" c={CV} delay={0.35} />
      <motion.line x1={282} y1={45} x2={300} y2={45}
        stroke={CV} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.32 }} />

      {/* tanh activation */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.42 }}>
        <rect x={400} y={25} width={70} height={40} rx={15}
          fill={`${CV}15`} stroke={CV} strokeWidth={1.2} />
        <text x={435} y={41} textAnchor="middle" fontSize={9} fontWeight={600} fill={CV}>tanh</text>
        <text x={435} y={55} textAnchor="middle" fontSize={8} fill={CV}>= [0.45, 0.24]</text>
      </motion.g>
      <motion.line x1={385} y1={45} x2={400} y2={45}
        stroke={CV} strokeWidth={0.7} markerEnd="url(#arrowR)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />

      {/* label: single gate */}
      <motion.text x={120} y={105} fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        단일 tanh 게이트 -- h에 모든 시간 정보 압축
      </motion.text>
      <motion.text x={120} y={118} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        역전파: dh/dz = 1 - tanh(z)², 매 스텝 0.x 곱 → 기울기 소실
      </motion.text>

      <defs>
        <marker id="arrowR" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={4} markerHeight={4} orient="auto-start-reverse">
          <path d="M0,0 L6,3 L0,6 Z" fill={CV} />
        </marker>
      </defs>
    </g>
  );
}

export function LstmStructStep() {
  const gates = [
    { label: 'f = sigma(-1.4) = 0.20', sub: 'forget: 기억 20% 유지', c: CV, y: 8 },
    { label: 'i = sigma(1.4) = 0.80', sub: 'input: 새 정보 80% 수용', c: CV, y: 38 },
    { label: 'g = tanh(0.69) = 0.60', sub: 'candidate: 후보 기억', c: CE, y: 68 },
    { label: 'o = sigma(2.2) = 0.90', sub: 'output: 출력 90% 통과', c: CE, y: 98 },
  ] as const;
  return (
    <g>
      {/* inputs */}
      <VizBox x={5} y={28} w={78} h={26} label="x=[0.5, 0.3]" sub="입력" c={CA} />
      <VizBox x={5} y={78} w={78} h={26} label="h=[0.2, 0.1]" sub="이전 은닉" c={CA} delay={0.05} />

      {/* 4 gates */}
      {gates.map((g, i) => (
        <VizBox key={i} x={110} y={g.y} w={160} h={25}
          label={g.label} sub={g.sub} c={g.c} delay={0.1 + i * 0.08} />
      ))}

      {/* input connections */}
      <motion.line x1={83} y1={41} x2={110} y2={20}
        stroke={CA} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.12 }} />
      <motion.line x1={83} y1={91} x2={110} y2={80}
        stroke={CA} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15 }} />

      {/* cell state computation */}
      <VizBox x={300} y={15} w={165} h={30}
        label="c = f*c_prev + i*g = 0.78"
        sub="0.2*1.5 + 0.8*0.6 (덧셈 경로)" c={CV} delay={0.5} />
      <VizBox x={300} y={60} w={165} h={30}
        label="h = o*tanh(c) = 0.588"
        sub="0.9 * tanh(0.78) = 0.9*0.653" c={CE} delay={0.6} />

      <motion.line x1={270} y1={50} x2={300} y2={30}
        stroke={CV} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
      <motion.line x1={270} y1={80} x2={300} y2={75}
        stroke={CE} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.55 }} />

      {/* note */}
      <motion.text x={300} y={110} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        4개 독립 게이트 -- 각각 별도 W_x, W_h 파라미터
      </motion.text>
    </g>
  );
}
