import { motion } from 'framer-motion';
import { CA, CE, CV } from './NormVizData';

const spring = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

function Arrow({ x1, y1, x2, y2, delay = 0 }: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay?: number;
}) {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--muted-foreground)"
      strokeWidth={1.2}
      markerEnd="url(#normMobileArrow)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ ...spring, delay }}
    />
  );
}

function Cell({ x, y, width = 48, label, color, delay = 0 }: {
  x: number;
  y: number;
  width?: number;
  label: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay }}
    >
      <rect x={x} y={y} width={width} height={30} rx={5}
        fill={`${color}12`} stroke={color} strokeWidth={1} />
      <text x={x + width / 2} y={y + 20} textAnchor="middle"
        fontSize={11.5} fontWeight={700} fill={color}>
        {label}
      </text>
    </motion.g>
  );
}

function FeatureNormalization() {
  const raw = ['3.2', '1.1', '4.7', '2.5', '0.8'];
  const normalized = ['+0.52', '-0.95', '+1.57', '+0.03', '-1.16'];
  return (
    <>
      <text x={12} y={16} fontSize={11.5} fontWeight={700} fill={CA}>입력 feature 5개</text>
      {raw.map((value, index) => (
        <Cell key={value} x={12 + index * 60} y={25} label={value} color={CA} delay={index * 0.04} />
      ))}
      <Arrow x1={160} y1={58} x2={160} y2={76} delay={0.2} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <rect x={40} y={80} width={240} height={48} rx={7}
          fill={`${CV}0d`} stroke={CV} strokeWidth={1} />
        <text x={160} y={99} textAnchor="middle" fontSize={12} fontWeight={700} fill={CV}>
          평균 2.46을 먼저 뺀다
        </text>
        <text x={160} y={117} textAnchor="middle" fontSize={11.5} fill="var(--foreground)">
          표준편차 1.43으로 나눠 크기를 맞춘다
        </text>
      </motion.g>
      <Arrow x1={160} y1={130} x2={160} y2={148} delay={0.35} />
      <text x={12} y={159} fontSize={11.5} fontWeight={700} fill={CE}>정규화 결과</text>
      {normalized.map((value, index) => (
        <Cell key={value} x={12 + index * 60} y={167} label={value} color={CE} delay={0.4 + index * 0.04} />
      ))}
      <text x={160} y={218} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
        각 샘플의 feature 축을 따로 정규화한다
      </text>
    </>
  );
}

function ScaleAndShift() {
  const stages = [
    { x: 10, label: 'x̂ 1.57', color: CV },
    { x: 88, label: '× γ 0.8', color: CE },
    { x: 166, label: '+ β -0.1', color: CE },
    { x: 244, label: 'y 1.16', color: CA },
  ];
  return (
    <>
      <text x={12} y={18} fontSize={12} fontWeight={700} fill={CV}>정규화 뒤에도 표현력을 되돌린다</text>
      {stages.map((stage, index) => (
        <Cell key={stage.label} x={stage.x} y={38} width={66}
          label={stage.label} color={stage.color} delay={index * 0.08} />
      ))}
      {stages.slice(0, -1).map((stage, index) => (
        <Arrow key={stage.label} x1={stage.x + 66} y1={53}
          x2={stages[index + 1].x - 4} y2={53} delay={0.2 + index * 0.06} />
      ))}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <rect x={12} y={91} width={142} height={64} rx={7}
          fill={`${CE}0d`} stroke={CE} strokeWidth={1} />
        <text x={24} y={112} fontSize={12} fontWeight={700} fill={CE}>γ: 크기 조절</text>
        <text x={24} y={133} fontSize={11.5} fill="var(--foreground)">특징을 키우거나 줄인다</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <rect x={166} y={91} width={142} height={64} rx={7}
          fill={`${CA}0d`} stroke={CA} strokeWidth={1} />
        <text x={178} y={112} fontSize={12} fontWeight={700} fill={CA}>β: 위치 이동</text>
        <text x={178} y={133} fontSize={11.5} fill="var(--foreground)">기준점을 앞뒤로 옮긴다</text>
      </motion.g>
      <text x={160} y={186} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--foreground)">
        γ=1, β=0이면 x̂를 그대로 통과시킨다
      </text>
      <text x={160} y={207} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
        학습하면서 필요한 크기와 위치를 되찾는다
      </text>
    </>
  );
}

function BackwardFlow() {
  const outputs = [
    { x: 8, label: 'gβ', body: '평행 이동의\n기울기', color: CE },
    { x: 110, label: 'gγ', body: '크기 조절의\n기울기', color: CE },
    { x: 212, label: 'gx', body: '입력으로 보낼\n기울기', color: CV },
  ];
  return (
    <>
      <Cell x={72} y={15} width={176} label="상위 기울기 gy 도착" color={CA} />
      {outputs.map((output, index) => (
        <motion.g key={output.label}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 + index * 0.08 }}>
          <rect x={output.x} y={88} width={100} height={62} rx={7}
            fill={`${output.color}0d`} stroke={output.color} strokeWidth={1} />
          <text x={output.x + 50} y={110} textAnchor="middle"
            fontSize={13} fontWeight={800} fill={output.color}>{output.label}</text>
          {output.body.split('\n').map((line, lineIndex) => (
            <text key={line} x={output.x + 50} y={126 + lineIndex * 20} textAnchor="middle"
              fontSize={11} fill="var(--foreground)">{line}</text>
          ))}
          <Arrow x1={160} y1={47} x2={output.x + 50} y2={84} delay={0.12 + index * 0.06} />
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={12} y={170} width={296} height={48} rx={7}
          fill="var(--muted)" fillOpacity={0.5} />
        <text x={160} y={190} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--foreground)">
          같은 gy에서 세 기울기를 함께 계산한다
        </text>
        <text x={160} y={208} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
          그래서 γ·β와 앞 층을 한 번에 업데이트할 수 있다
        </text>
      </motion.g>
    </>
  );
}

function CacheFlow() {
  return (
    <>
      <Cell x={12} y={14} width={116} label="forward()" color={CE} />
      <Arrow x1={70} y1={47} x2={70} y2={78} delay={0.1} />
      <Cell x={12} y={82} width={116} label="RefCell 저장" color={CA} delay={0.15} />
      <Arrow x1={70} y1={115} x2={70} y2={146} delay={0.25} />
      <Cell x={12} y={150} width={116} label="backward()" color={CV} delay={0.3} />
      <motion.g initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
        <rect x={168} y={32} width={140} height={132} rx={8}
          fill={`${CV}0d`} stroke={CV} strokeWidth={1} />
        <text x={238} y={54} textAnchor="middle" fontSize={12} fontWeight={800} fill={CV}>중간값 캐시</text>
        <rect x={180} y={68} width={116} height={34} rx={5}
          fill="var(--background)" stroke={CV} strokeWidth={0.8} />
        <text x={238} y={89} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--foreground)">x̂</text>
        <rect x={180} y={112} width={116} height={34} rx={5}
          fill="var(--background)" stroke={CV} strokeWidth={0.8} />
        <text x={238} y={133} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--foreground)">1 / std</text>
      </motion.g>
      <Arrow x1={128} y1={97} x2={164} y2={97} delay={0.38} />
      <Arrow x1={168} y1={148} x2={130} y2={166} delay={0.45} />
      <text x={160} y={211} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--foreground)">
        저장 비용을 내고 backward의 재계산을 없앤다
      </text>
    </>
  );
}

export default function NormVizMobile({ step }: { step: number }) {
  return (
    <svg data-dezero-norm-viz data-dezero-norm-mobile viewBox="0 0 320 230"
      className="mx-auto w-full max-w-[30rem]" style={{ height: 'auto' }}>
      <defs>
        <marker id="normMobileArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7" fill="var(--muted-foreground)" />
        </marker>
      </defs>
      {step === 0 && <FeatureNormalization />}
      {step === 1 && <ScaleAndShift />}
      {step === 2 && <BackwardFlow />}
      {step === 3 && <CacheFlow />}
    </svg>
  );
}
