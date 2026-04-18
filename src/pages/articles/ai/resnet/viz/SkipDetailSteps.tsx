import { motion } from 'framer-motion';
import { C } from './SkipDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ---- Step 0: Skip Connection 수학적 원리 ---- */
export function SkipMath() {
  return (
    <g>
      {/* Main formula */}
      <rect x={120} y={4} width={240} height={30} rx={8}
        fill={C.skip} fillOpacity={0.08} stroke={C.skip} strokeWidth={1.2} />
      <text x={240} y={24} textAnchor="middle" fontSize={14} fontWeight={700}
        fill={C.skip}>y = F(x) + x</text>

      {/* Gradient flow diagram — shifted down for spacing */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.2 }}>
        {/* input */}
        <rect x={20} y={58} width={50} height={26} rx={6}
          fill={C.main} fillOpacity={0.1} stroke={C.main} strokeWidth={0.8} />
        <text x={45} y={75} textAnchor="middle" fontSize={10} fontWeight={600}
          fill={C.main}>x</text>

        {/* F(x) path */}
        <line x1={70} y1={71} x2={120} y2={71}
          stroke={C.main} strokeWidth={1} markerEnd="url(#skipArr)" />
        <rect x={120} y={58} width={80} height={26} rx={6}
          fill={C.main} fillOpacity={0.1} stroke={C.main} strokeWidth={0.8} />
        <text x={160} y={75} textAnchor="middle" fontSize={10} fontWeight={600}
          fill={C.main}>F(x)</text>

        {/* skip path (curved) */}
        <motion.path d="M45,58 Q45,48 120,48 L250,48 Q260,48 260,58"
          fill="none" stroke={C.skip} strokeWidth={1.5} strokeDasharray="4 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.4, duration: 0.8 }} />
        <text x={170} y={46} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.skip}>identity 경로 (+1)</text>

        {/* addition */}
        <line x1={200} y1={71} x2={240} y2={71}
          stroke={C.main} strokeWidth={1} markerEnd="url(#skipArr)" />
        <circle cx={260} cy={71} r={12} fill="var(--card)"
          stroke={C.skip} strokeWidth={1.5} />
        <text x={260} y={75} textAnchor="middle" fontSize={14} fontWeight={700}
          fill={C.skip}>+</text>

        {/* output */}
        <line x1={272} y1={71} x2={310} y2={71}
          stroke={C.skip} strokeWidth={1} markerEnd="url(#skipArr)" />
        <rect x={310} y={58} width={50} height={26} rx={6}
          fill={C.skip} fillOpacity={0.1} stroke={C.skip} strokeWidth={0.8} />
        <text x={335} y={75} textAnchor="middle" fontSize={10} fontWeight={600}
          fill={C.skip}>y</text>
      </motion.g>

      {/* Gradient formula */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={10} y={86} width={280} height={28} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={150} y={104} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="var(--foreground)">dL/dx = dL/dy x (dF/dx + 1)</text>
      </motion.g>

      {/* Two cases */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={10} y={120} width={220} height={34} rx={6}
          fill={C.skip} fillOpacity={0.06} stroke={C.skip} strokeWidth={0.6} />
        <text x={20} y={136} fontSize={9} fontWeight={600} fill={C.skip}>
          F(x)=0 → y=x (항등)
        </text>
        <text x={20} y={148} fontSize={8} fill="var(--muted-foreground)">
          최소한 이전 층 성능 보장
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.7 }}>
        <rect x={250} y={120} width={220} height={34} rx={6}
          fill={C.main} fillOpacity={0.06} stroke={C.main} strokeWidth={0.6} />
        <text x={260} y={136} fontSize={9} fontWeight={600} fill={C.main}>
          F(x) 유의미 → y=F(x)+x
        </text>
        <text x={260} y={148} fontSize={8} fill="var(--muted-foreground)">
          기존 x에 작은 조정값 누적
        </text>
      </motion.g>

      {/* gradient note on right */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <rect x={380} y={48} width={90} height={28} rx={6}
          fill={C.warn} fillOpacity={0.08} stroke={C.warn} strokeWidth={0.6} />
        <text x={425} y={60} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.warn}>"+1" 보장</text>
        <text x={425} y={72} textAnchor="middle" fontSize={7}
          fill={C.warn}>기울기 소실 방지</text>
      </motion.g>

      <defs>
        <marker id="skipArr" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.dim} />
        </marker>
      </defs>
    </g>
  );
}

/* ---- Step 1: Residual Block 종류 ---- */
export function BlockTypes() {
  return (
    <g>
      {/* Basic Block */}
      <text x={115} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.main}>Basic Block (18, 34)</text>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp }}>
        {/* flow */}
        <rect x={30} y={24} width={60} height={20} rx={5}
          fill={C.main} fillOpacity={0.1} stroke={C.main} strokeWidth={0.6} />
        <text x={60} y={37} textAnchor="middle" fontSize={8} fill={C.main}>Conv 3x3</text>
        <text x={96} y={37} fontSize={7} fill="var(--muted-foreground)">특징 추출</text>

        <line x1={60} y1={44} x2={60} y2={50} stroke={C.dim} strokeWidth={0.6} />

        <rect x={30} y={50} width={60} height={20} rx={5}
          fill={C.main} fillOpacity={0.1} stroke={C.main} strokeWidth={0.6} />
        <text x={60} y={63} textAnchor="middle" fontSize={8} fill={C.main}>BN+ReLU</text>
        <text x={96} y={63} fontSize={7} fill="var(--muted-foreground)">정규화+활성화</text>

        <line x1={60} y1={70} x2={60} y2={76} stroke={C.dim} strokeWidth={0.6} />

        <rect x={30} y={76} width={60} height={20} rx={5}
          fill={C.main} fillOpacity={0.1} stroke={C.main} strokeWidth={0.6} />
        <text x={60} y={89} textAnchor="middle" fontSize={8} fill={C.main}>Conv 3x3</text>
        <text x={96} y={89} fontSize={7} fill="var(--muted-foreground)">특징 정제</text>

        <line x1={60} y1={96} x2={60} y2={102} stroke={C.dim} strokeWidth={0.6} />

        <rect x={30} y={102} width={60} height={20} rx={5}
          fill={C.main} fillOpacity={0.1} stroke={C.main} strokeWidth={0.6} />
        <text x={60} y={115} textAnchor="middle" fontSize={8} fill={C.main}>BN</text>
        <text x={96} y={126} fontSize={7} fill="var(--muted-foreground)">출력 정규화</text>

        {/* skip */}
        <motion.path d="M30,34 Q10,34 10,70 L10,112 Q10,118 30,118"
          fill="none" stroke={C.skip} strokeWidth={1.5} strokeDasharray="4 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.3, duration: 0.6 }} />
        <text x={6} y={75} fontSize={7} fill={C.skip} textAnchor="middle"
          transform="rotate(-90, 6, 75)">skip (x)</text>

        {/* addition */}
        <circle cx={170} cy={112} r={8} fill="var(--card)"
          stroke={C.skip} strokeWidth={1} />
        <text x={170} y={116} textAnchor="middle" fontSize={12} fontWeight={700}
          fill={C.skip}>+</text>
        <line x1={90} y1={112} x2={162} y2={112} stroke={C.dim} strokeWidth={0.6} />
        <text x={126} y={108} textAnchor="middle" fontSize={7} fontWeight={600}
          fill={C.main}>F(x)</text>

        <text x={185} y={108} fontSize={7} fontWeight={600}
          fill="var(--muted-foreground)">F(x) + x</text>
        <text x={185} y={118} fontSize={8} fill={C.main}>→ ReLU → y</text>
      </motion.g>

      {/* Bottleneck Block */}
      <text x={340} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.bottleneck}>Bottleneck (50, 101, 152)</text>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={270} y={24} width={80} height={18} rx={5}
          fill={C.bottleneck} fillOpacity={0.1} stroke={C.bottleneck} strokeWidth={0.6} />
        <text x={310} y={36} textAnchor="middle" fontSize={8} fill={C.bottleneck}>1x1 Conv</text>
        <text x={356} y={36} fontSize={7} fill="var(--muted-foreground)">256→64 축소</text>

        <line x1={310} y1={42} x2={310} y2={48} stroke={C.dim} strokeWidth={0.6} />

        <rect x={270} y={48} width={80} height={18} rx={5}
          fill={C.bottleneck} fillOpacity={0.1} stroke={C.bottleneck} strokeWidth={0.6} />
        <text x={310} y={60} textAnchor="middle" fontSize={8} fill={C.bottleneck}>3x3 Conv</text>
        <text x={356} y={60} fontSize={7} fill="var(--muted-foreground)">특징 추출</text>

        <line x1={310} y1={66} x2={310} y2={72} stroke={C.dim} strokeWidth={0.6} />

        <rect x={270} y={72} width={80} height={18} rx={5}
          fill={C.bottleneck} fillOpacity={0.1} stroke={C.bottleneck} strokeWidth={0.6} />
        <text x={310} y={84} textAnchor="middle" fontSize={8} fill={C.bottleneck}>1x1 Conv</text>
        <text x={356} y={96} fontSize={7} fill="var(--muted-foreground)">64→256 복원</text>

        {/* skip */}
        <motion.path d="M270,34 Q255,34 255,60 L255,84 Q255,90 270,90"
          fill="none" stroke={C.skip} strokeWidth={1.5} strokeDasharray="4 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.5, duration: 0.6 }} />
        <text x={251} y={62} fontSize={7} fill={C.skip} textAnchor="middle"
          transform="rotate(-90, 251, 62)">skip (x)</text>

        <circle cx={440} cy={84} r={8} fill="var(--card)"
          stroke={C.skip} strokeWidth={1} />
        <text x={440} y={88} textAnchor="middle" fontSize={12} fontWeight={700}
          fill={C.skip}>+</text>
        <line x1={350} y1={84} x2={432} y2={84} stroke={C.dim} strokeWidth={0.6} />
        <text x={390} y={80} textAnchor="middle" fontSize={7} fontWeight={600}
          fill={C.bottleneck}>F(x)</text>
        <text x={455} y={80} fontSize={7} fontWeight={600}
          fill="var(--muted-foreground)">F(x)+x</text>
        <text x={455} y={92} fontSize={7}
          fill={C.skip}>→ ReLU → y</text>
      </motion.g>

      {/* Efficiency comparison */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={270} y={116} width={200} height={44} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={130} fontSize={9} fontWeight={600} fill="var(--foreground)">
          256ch 기준
        </text>
        <text x={280} y={142} fontSize={8} fill={C.main}>Basic: 1.18M params</text>
        <text x={280} y={154} fontSize={8} fill={C.bottleneck}>Bottleneck: 70K params</text>
        <rect x={410} y={140} width={50} height={16} rx={8}
          fill={C.skip} fillOpacity={0.12} stroke={C.skip} strokeWidth={0.6} />
        <text x={435} y={151} textAnchor="middle" fontSize={8} fontWeight={700}
          fill={C.skip}>17배</text>
      </motion.g>
    </g>
  );
}
