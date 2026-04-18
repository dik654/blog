import { motion } from 'framer-motion';
import { C } from './GradientDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ---- Step 0: 기울기 소실 수치 분석 ---- */
export function GradientNumerics() {
  const layers = [
    { name: 'Layer 3', grad: 0.02498, barW: 150 },
    { name: 'Layer 2', grad: 0.000624, barW: 3.75 },
    { name: 'Layer 1', grad: 0.0000780, barW: 0.47 },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">3층 신경망 기울기 소실 (x=0.5, w=0.1, sigmoid)</text>

      {/* Forward pass mini */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp }}>
        <rect x={10} y={24} width={460} height={28} rx={6}
          fill={C.layer} fillOpacity={0.05} stroke={C.layer} strokeWidth={0.6} />
        <text x={20} y={42} fontSize={8} fill={C.layer} fontWeight={600}>순전파:</text>
        <text x={70} y={42} fontSize={8} fill="var(--muted-foreground)">
          x=0.5 → h1=0.5125 → h2=0.5128 → y=0.5128
        </text>
        <text x={330} y={42} fontSize={8} fill={C.dim}>
          sigmoid(0.05)=0.5125
        </text>
      </motion.g>

      {/* Gradient bars */}
      <text x={20} y={70} fontSize={9} fontWeight={700} fill={C.gradient}>
        역전파 기울기
      </text>

      {layers.map((l, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.2 + i * 0.15 }}>
          <text x={20} y={88 + i * 22} fontSize={9} fontWeight={600}
            fill="var(--foreground)">{l.name}</text>
          <motion.rect x={90} y={80 + i * 22} width={l.barW < 2 ? 2 : l.barW}
            height={12} rx={3}
            fill={C.gradient} fillOpacity={0.5}
            initial={{ width: 0 }}
            animate={{ width: l.barW < 2 ? 2 : l.barW }}
            transition={{ ...sp, delay: 0.3 + i * 0.15 }} />
          <text x={96 + (l.barW < 2 ? 4 : l.barW)} y={90 + i * 22}
            fontSize={9} fontWeight={600} fill={C.gradient}>
            {l.grad.toExponential(2)}
          </text>
        </motion.g>
      ))}

      {/* Ratio */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        <rect x={300} y={76} width={170} height={26} rx={7}
          fill={C.gradient} fillOpacity={0.08} stroke={C.gradient} strokeWidth={1} />
        <text x={385} y={93} textAnchor="middle" fontSize={10} fontWeight={700}
          fill={C.gradient}>3층만에 320배 감소</text>
      </motion.g>

      {/* chain rule explanation */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={10} y={152} width={460} height={18} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={165} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          체인룰: 매 층마다 sigmoid'(max 0.25) × w(0.1) = 0.025 곱해짐
        </text>
      </motion.g>
    </g>
  );
}

/* ---- Step 1: 깊이별 기울기 감쇠 ---- */
export function DepthDecay() {
  const depths = [
    { n: 10, exp: '-17', barW: 120 },
    { n: 50, exp: '-81', barW: 40 },
    { n: 100, exp: '-161', barW: 8 },
  ];

  const fixes = [
    { label: 'ReLU', desc: '기울기 0 or 1', color: C.fix },
    { label: 'Xavier/He', desc: '분산 유지', color: C.layer },
    { label: 'BatchNorm', desc: '활성화 정규화', color: '#8b5cf6' },
    { label: 'Skip Conn', desc: '근본 해결', color: C.fix },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">층당 감쇠율 r = 0.025, 기울기 = r^L</text>

      {/* formula */}
      <rect x={10} y={22} width={200} height={22} rx={6}
        fill={C.gradient} fillOpacity={0.06} stroke={C.gradient} strokeWidth={0.6} />
      <text x={110} y={37} textAnchor="middle" fontSize={9} fontWeight={600}
        fill={C.gradient}>r = sigmoid' x w = 0.25 x 0.1</text>

      {/* depth bars */}
      {depths.map((d, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.12 }}>
          <text x={20} y={64 + i * 24} fontSize={9} fontWeight={600}
            fill="var(--foreground)">{d.n}층</text>
          <motion.rect x={60} y={54 + i * 24} width={d.barW} height={14} rx={4}
            fill={C.gradient} fillOpacity={0.4 + i * 0.15}
            initial={{ width: 0 }} animate={{ width: d.barW }}
            transition={{ ...sp, delay: 0.15 + i * 0.12 }} />
          <text x={64 + d.barW} y={65 + i * 24} fontSize={9} fontWeight={700}
            fill={C.gradient}>10^{d.exp}</text>
        </motion.g>
      ))}

      {/* zero note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <text x={20} y={128} fontSize={9} fontWeight={600} fill={C.gradient}>
          100층: 수치적으로 완전 0 → 학습 불가
        </text>
      </motion.g>

      {/* fixes */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <text x={360} y={34} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="var(--foreground)">완화 기법</text>
        {fixes.map((f, i) => (
          <g key={i}>
            <rect x={270} y={40 + i * 28} width={180} height={22} rx={6}
              fill={`${f.color}08`} stroke={f.color}
              strokeWidth={i === 3 ? 1.5 : 0.6} />
            <text x={285} y={55 + i * 28} fontSize={9} fontWeight={600}
              fill={f.color}>{f.label}</text>
            <text x={360} y={55 + i * 28} fontSize={8}
              fill="var(--muted-foreground)">{f.desc}</text>
            {i === 3 && (
              <text x={454} y={55 + i * 28} fontSize={8} fontWeight={700}
                fill={f.color}>*</text>
            )}
          </g>
        ))}
      </motion.g>

      {/* bottom note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        <rect x={10} y={160} width={460} height={14} rx={7}
          fill={C.fix} fillOpacity={0.1} />
        <text x={240} y={170} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.fix}>100층+ 에서는 ReLU/BN으로 부족 → Skip connection이 근본 해결</text>
      </motion.g>
    </g>
  );
}
