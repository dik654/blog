import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

export function GradientVanishStep() {
  const vals = [1.0, 0.7, 0.49, 0.34, 0.24, 0.17, 0.12, 0.08];
  const bw = 36, gap = 50;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600}
        fill="var(--muted-foreground)">
        tanh 기울기 전파: 매 스텝 x0.7
      </text>
      {vals.map((v, i) => {
        const x = 18 + i * gap;
        const barH = v * 95;
        const color = v > 0.3 ? CE : CA;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={x} y={135 - barH} width={bw} height={barH}
              rx={3} fill={`${color}30`} stroke={color} strokeWidth={1} />
            <text x={x + bw / 2} y={135 - barH - 5} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={color}>
              {(v * 100).toFixed(0)}%
            </text>
            <text x={x + bw / 2} y={150} textAnchor="middle"
              fontSize={8} fill="var(--muted-foreground)">t={i}</text>
          </motion.g>
        );
      })}
      {/* arrow between bars */}
      {vals.slice(0, -1).map((_, i) => (
        <motion.line key={`a${i}`}
          x1={18 + i * gap + bw + 2} y1={110}
          x2={18 + (i + 1) * gap - 2} y2={110}
          stroke="var(--muted-foreground)" strokeWidth={0.6}
          markerEnd="url(#arrowG)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.1 + i * 0.08 }} />
      ))}
      <defs>
        <marker id="arrowG" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={4} markerHeight={4} orient="auto-start-reverse">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" />
        </marker>
      </defs>
    </g>
  );
}

export function LstmGateStep() {
  const gates = [
    { label: 'f = sigma(-1.4) = 0.20', sub: 'forget: 기억 20% 유지', c: CV, y: 8 },
    { label: 'i = sigma(1.4) = 0.80', sub: 'input: 새 정보 80% 수용', c: CV, y: 38 },
    { label: 'g = tanh(0.69) = 0.60', sub: 'candidate: 후보 기억', c: CE, y: 68 },
    { label: 'o = sigma(2.2) = 0.90', sub: 'output: 출력 90% 통과', c: CE, y: 98 },
  ] as const;
  return (
    <g>
      <VizBox x={8} y={28} w={85} h={26} label="x=[0.5, 0.3]" sub="입력 (D=2)" c={CA} />
      <VizBox x={8} y={80} w={85} h={26} label="h=[0.2, 0.1]" sub="이전 은닉" c={CA} delay={0.05} />
      {gates.map((g, i) => (
        <VizBox key={i} x={120} y={g.y} w={165} h={25}
          label={g.label} sub={g.sub} c={g.c} delay={0.1 + i * 0.08} />
      ))}
      {/* connecting lines from inputs to gates */}
      <motion.line x1={93} y1={41} x2={120} y2={20}
        stroke={CA} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15 }} />
      <motion.line x1={93} y1={93} x2={120} y2={80}
        stroke={CA} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      {/* results */}
      <VizBox x={310} y={18} w={155} h={30}
        label="c = 0.2*1.5 + 0.8*0.6 = 0.78"
        sub="f*c_prev + i*g (덧셈 경로)" c={CV} delay={0.5} />
      <VizBox x={310} y={60} w={155} h={30}
        label="h = 0.9 * tanh(0.78) = 0.55"
        sub="o * tanh(c) (출력)" c={CE} delay={0.6} />
      <motion.line x1={285} y1={50} x2={310} y2={33}
        stroke={CV} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
      <motion.line x1={285} y1={80} x2={310} y2={75}
        stroke={CE} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.55 }} />
      <motion.text x={310} y={108} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        덧셈 경로(c) → 기울기 dc/dc_prev = f (직접 전달)
      </motion.text>
    </g>
  );
}

export function LayerNormStep() {
  const vals = [3.2, 1.1, 4.7, 2.5, 0.8];
  const normed = [0.50, -0.92, 1.51, 0.03, -1.12];
  const mean = 2.46;
  const cw = 60, startX = 30;
  return (
    <g>
      {/* raw input bars */}
      <text x={15} y={12} fontSize={8} fontWeight={600} fill={CA}>
        입력 x (feature D=5)
      </text>
      {vals.map((v, i) => {
        const x = startX + i * cw;
        const barH = v * 14;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: i * 0.06 }}>
            <rect x={x} y={60 - barH} width={40} height={barH}
              rx={2} fill={`${CA}30`} stroke={CA} strokeWidth={0.8} />
            <text x={x + 20} y={60 - barH - 4} textAnchor="middle"
              fontSize={8} fontWeight={600} fill={CA}>{v}</text>
          </motion.g>
        );
      })}
      {/* mean line */}
      <motion.line x1={startX} y1={60 - mean * 14} x2={startX + 5 * cw - 20} y2={60 - mean * 14}
        stroke={CV} strokeWidth={1} strokeDasharray="4 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <motion.text x={startX + 5 * cw - 15} y={60 - mean * 14 + 3} fontSize={7} fill={CV}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        mean={mean}
      </motion.text>
      {/* arrow down */}
      <motion.text x={240} y={78} textAnchor="middle" fontSize={9} fill={CV}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        (x - mean) / std
      </motion.text>
      {/* normalized bars */}
      <text x={15} y={95} fontSize={8} fontWeight={600} fill={CE}>
        정규화 x_hat
      </text>
      {normed.map((v, i) => {
        const x = startX + i * cw;
        const baseline = 130;
        const barH = Math.abs(v) * 18;
        const top = v >= 0 ? baseline - barH : baseline;
        return (
          <motion.g key={`n${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.55 + i * 0.06 }}>
            <rect x={x} y={top} width={40} height={barH}
              rx={2} fill={`${CE}30`} stroke={CE} strokeWidth={0.8} />
            <text x={x + 20} y={v >= 0 ? top - 4 : top + barH + 10}
              textAnchor="middle" fontSize={8} fontWeight={600} fill={CE}>
              {v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
            </text>
          </motion.g>
        );
      })}
      {/* zero line */}
      <motion.line x1={startX} y1={130} x2={startX + 5 * cw - 20} y2={130}
        stroke="var(--muted-foreground)" strokeWidth={0.5} strokeDasharray="2 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
      <text x={startX + 5 * cw - 15} y={133} fontSize={7} fill="var(--muted-foreground)">0</text>
      <motion.text x={15} y={158} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        BatchNorm과 달리 배치 크기와 무관 -- 추론 시 동일
      </motion.text>
    </g>
  );
}

export function DropEmbedStep() {
  const xVals = [0.8, 1.2, 0.5, 0.9, 1.1, 0.3];
  const mask = [1, 0, 1, 1, 0, 1];
  const cw = 58, startX = 50;
  return (
    <g>
      {/* Dropout section */}
      <text x={15} y={12} fontSize={8} fontWeight={600} fill="var(--muted-foreground)">
        Dropout p=0.5
      </text>
      {/* input + mask + output grid */}
      {['x', 'mask', 'out'].map((label, row) => {
        const y = 22 + row * 26;
        const color = row === 0 ? CA : row === 1 ? CE : CV;
        return (
          <motion.g key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: row * 0.12 }}>
            <text x={15} y={y + 14} fontSize={8} fontWeight={600} fill={color}>{label}</text>
            {xVals.map((v, i) => {
              const val = row === 0 ? v : row === 1 ? mask[i] : (v * mask[i] * 2).toFixed(1);
              const active = row === 1 ? mask[i] === 1 : row === 2 ? mask[i] === 1 : true;
              return (
                <g key={i}>
                  <rect x={startX + i * cw} y={y} width={48} height={22} rx={3}
                    fill={active ? `${color}15` : '#88888815'}
                    stroke={active ? color : '#888888'} strokeWidth={0.6} />
                  <text x={startX + i * cw + 24} y={y + 14} textAnchor="middle"
                    fontSize={8} fontWeight={row === 2 ? 600 : 400}
                    fill={active ? color : '#888888'}>{val}</text>
                </g>
              );
            })}
          </motion.g>
        );
      })}
      <motion.text x={startX + 6 * cw + 5} y={62} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        scale = 1/(1-p) = 2
      </motion.text>

      {/* Embedding section */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={15} y={110} fontSize={8} fontWeight={600} fill="var(--muted-foreground)">
          Embedding: 정수 ID → 벡터 룩업
        </text>
        <VizBox x={15} y={120} w={90} h={25}
          label='["the","cat","sat"]' sub="idx=[4,12,8]" c={CA} delay={0.55} />
        <VizBox x={135} y={118} w={90} h={28}
          label="W (100x4)" sub="임베딩 테이블" c={CV} delay={0.6} />
        <VizBox x={260} y={118} w={110} h={28}
          label="out = W[idx]" sub="(3,4) 행 복사" c={CE} delay={0.65} />
        <motion.line x1={105} y1={132} x2={135} y2={132}
          stroke={CA} strokeWidth={0.7} markerEnd="url(#arrowG)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
        <motion.line x1={225} y1={132} x2={260} y2={132}
          stroke={CV} strokeWidth={0.7} markerEnd="url(#arrowG)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }} />
      </motion.g>
      <defs>
        <marker id="arrowG" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={4} markerHeight={4} orient="auto-start-reverse">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" />
        </marker>
      </defs>
    </g>
  );
}
