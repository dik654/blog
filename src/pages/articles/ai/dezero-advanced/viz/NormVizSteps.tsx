import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './NormVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

export function FeatureNormStep() {
  const vals = [3.2, 1.1, 4.7, 2.5, 0.8];
  const normed = [0.52, -0.95, 1.57, 0.03, -1.16];
  const mean = 2.46;
  const cw = 62, startX = 35;
  return (
    <g>
      {/* title */}
      <text x={15} y={12} fontSize={8} fontWeight={600} fill={CA}>
        입력 x (feature D=5)
      </text>

      {/* raw input bars */}
      {vals.map((v, i) => {
        const x = startX + i * cw;
        const barH = v * 12;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.06 }}>
            <rect x={x} y={55 - barH} width={42} height={barH}
              rx={2} fill={`${CA}25`} stroke={CA} strokeWidth={0.8} />
            <text x={x + 21} y={55 - barH - 4} textAnchor="middle"
              fontSize={8} fontWeight={600} fill={CA}>{v}</text>
          </motion.g>
        );
      })}

      {/* mean dashed line */}
      <motion.line x1={startX} y1={55 - mean * 12}
        x2={startX + 5 * cw - 18} y2={55 - mean * 12}
        stroke={CV} strokeWidth={0.8} strokeDasharray="4 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
      <motion.text x={startX + 5 * cw - 12} y={55 - mean * 12 + 3}
        fontSize={7} fill={CV}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        mean=2.46
      </motion.text>

      {/* computation */}
      <VizBox x={350} y={8} w={120} h={22}
        label="var = 2.034" sub="sum((x-mean)^2)/5" c={CV} delay={0.4} />
      <VizBox x={350} y={36} w={120} h={22}
        label="std = 1.426" sub="sqrt(var + 1e-5)" c={CV} delay={0.48} />

      {/* arrow: transform */}
      <motion.text x={200} y={72} textAnchor="middle" fontSize={8} fill={CV} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        x_hat = (x - mean) / std
      </motion.text>

      {/* normalized bars */}
      <text x={15} y={88} fontSize={8} fontWeight={600} fill={CE}>정규화 x_hat</text>
      {normed.map((v, i) => {
        const x = startX + i * cw;
        const baseline = 128;
        const barH = Math.abs(v) * 16;
        const top = v >= 0 ? baseline - barH : baseline;
        return (
          <motion.g key={`n${i}`} initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.55 + i * 0.06 }}>
            <rect x={x} y={top} width={42} height={barH}
              rx={2} fill={`${CE}25`} stroke={CE} strokeWidth={0.8} />
            <text x={x + 21} y={v >= 0 ? top - 4 : top + barH + 10}
              textAnchor="middle" fontSize={8} fontWeight={600} fill={CE}>
              {v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
            </text>
          </motion.g>
        );
      })}

      {/* zero line */}
      <motion.line x1={startX} y1={128} x2={startX + 5 * cw - 18} y2={128}
        stroke="var(--muted-foreground)" strokeWidth={0.5} strokeDasharray="2 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.65 }} />
      <text x={startX + 5 * cw - 12} y={131} fontSize={7} fill="var(--muted-foreground)">0</text>

      <motion.text x={15} y={155} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        feature 축 정규화 -- 배치 크기 무관, 추론 시 동일 동작
      </motion.text>
    </g>
  );
}

export function GammaBetaStep() {
  const xhat = [0.52, -0.95, 1.57, 0.03, -1.16];
  const cw = 60, startX = 50;
  return (
    <g>
      {/* Phase labels */}
      <text x={15} y={14} fontSize={9} fontWeight={600} fill={CV}>
        gamma / beta 스케일-시프트
      </text>

      {/* x_hat input row */}
      <text x={15} y={32} fontSize={8} fill={CV}>x_hat</text>
      {xhat.map((v, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: i * 0.05 }}>
          <rect x={startX + i * cw} y={22} width={48} height={20} rx={3}
            fill={`${CV}12`} stroke={CV} strokeWidth={0.6} />
          <text x={startX + i * cw + 24} y={35} textAnchor="middle"
            fontSize={8} fill={CV}>{v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}</text>
        </motion.g>
      ))}

      {/* gamma row */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <text x={15} y={60} fontSize={8} fill={CE}>gamma</text>
        {xhat.map((_, i) => (
          <g key={i}>
            <rect x={startX + i * cw} y={50} width={48} height={20} rx={3}
              fill={`${CE}12`} stroke={CE} strokeWidth={0.6} />
            <text x={startX + i * cw + 24} y={63} textAnchor="middle"
              fontSize={8} fill={CE}>1.0</text>
          </g>
        ))}
      </motion.g>

      {/* beta row */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <text x={15} y={88} fontSize={8} fill={CE}>beta</text>
        {xhat.map((_, i) => (
          <g key={i}>
            <rect x={startX + i * cw} y={78} width={48} height={20} rx={3}
              fill={`${CE}12`} stroke={CE} strokeWidth={0.6} />
            <text x={startX + i * cw + 24} y={91} textAnchor="middle"
              fontSize={8} fill={CE}>0.0</text>
          </g>
        ))}
      </motion.g>

      {/* arrow */}
      <motion.text x={200} y={112} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        y = gamma * x_hat + beta
      </motion.text>

      {/* output row */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
        <text x={15} y={132} fontSize={8} fontWeight={600} fill={CA}>y</text>
        {xhat.map((v, i) => (
          <g key={i}>
            <rect x={startX + i * cw} y={122} width={48} height={20} rx={3}
              fill={`${CA}15`} stroke={CA} strokeWidth={0.8} />
            <text x={startX + i * cw + 24} y={135} textAnchor="middle"
              fontSize={8} fontWeight={600} fill={CA}>
              {v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
            </text>
          </g>
        ))}
      </motion.g>

      <motion.text x={15} y={158} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        초기: gamma=1, beta=0 → y = x_hat (항등), 학습 후 최적값으로 조정
      </motion.text>
    </g>
  );
}
