import { motion } from 'framer-motion';
import { C } from './OverviewDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ---- Step 0: FC vs CNN 파라미터 비교 ---- */
export function ParamCompare() {
  const fcW = 180;
  const cnnW = 180 * (896 / 19267584);
  return (
    <g>
      {/* Title */}
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">224x224x3 이미지 → 파라미터 수 비교</text>

      {/* FC bar */}
      <motion.rect x={130} y={30} width={fcW} height={22} rx={4}
        fill={C.fc} fillOpacity={0.7}
        initial={{ width: 0 }} animate={{ width: fcW }}
        transition={{ ...sp, duration: 0.6 }} />
      <text x={20} y={44} fontSize={10} fontWeight={600} fill={C.fc}>FC 128뉴런</text>
      <text x={320} y={44} fontSize={10} fontWeight={700} fill={C.fc}>19,267,584</text>

      {/* CNN bar */}
      <motion.rect x={130} y={58} width={cnnW < 2 ? 2 : cnnW} height={22} rx={4}
        fill={C.cnn} fillOpacity={0.7}
        initial={{ width: 0 }} animate={{ width: cnnW < 2 ? 2 : cnnW }}
        transition={{ ...sp, duration: 0.6, delay: 0.2 }} />
      <text x={20} y={72} fontSize={10} fontWeight={600} fill={C.cnn}>CNN 32필터</text>
      <text x={140} y={72} fontSize={10} fontWeight={700} fill={C.cnn}>896</text>

      {/* Ratio */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <rect x={315} y={56} width={145} height={26} rx={6}
          fill={C.cnn} fillOpacity={0.08} stroke={C.cnn} strokeWidth={1} />
        <text x={388} y={73} textAnchor="middle" fontSize={12} fontWeight={700}
          fill={C.cnn}>21,428배 감소</text>
      </motion.g>

      {/* Breakdown */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={20} y={90} width={200} height={56} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <rect x={20} y={90} width={200} height={5} rx={0}
          fill={C.fc} fillOpacity={0.6} />
        <text x={30} y={110} fontSize={9} fontWeight={600} fill={C.fc}>FC 계산</text>
        <text x={30} y={124} fontSize={8} fill="var(--muted-foreground)">
          150,528 입력 x 128 뉴런 = 19.2M
        </text>
        <text x={30} y={138} fontSize={8} fill="var(--muted-foreground)">
          각 연결마다 별도 가중치 필요
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.55 }}>
        <rect x={240} y={90} width={220} height={56} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <rect x={240} y={90} width={220} height={5} rx={0}
          fill={C.cnn} fillOpacity={0.6} />
        <text x={250} y={110} fontSize={9} fontWeight={600} fill={C.cnn}>CNN 계산</text>
        <text x={250} y={124} fontSize={8} fill="var(--muted-foreground)">
          3x3x3 = 27/필터 x 32 = 864 + 편향32
        </text>
        <text x={250} y={138} fontSize={8} fill="var(--muted-foreground)">
          동일 필터를 전체에 슬라이딩(공유)
        </text>
      </motion.g>
    </g>
  );
}

/* ---- Step 1: CNN 연산 흐름 표준 ---- */
export function PipelineFlow() {
  const stages = [
    { label: 'Input', size: '224x224', ch: '3', color: C.dim },
    { label: 'Block1', size: '112x112', ch: '64', color: C.flow },
    { label: 'Block2', size: '56x56', ch: '128', color: C.flow },
    { label: 'Block3', size: '28x28', ch: '256', color: C.flow },
    { label: 'GAP', size: '1x1', ch: '256', color: C.ch },
    { label: 'FC', size: '', ch: 'classes', color: C.cnn },
  ];
  const sx = 15;
  const gap = 76;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">CNN 파이프라인: 해상도↓ 채널수↑</text>

      {stages.map((s, i) => {
        const x = sx + i * gap;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            {/* box */}
            <rect x={x} y={30} width={66} height={44} rx={7}
              fill={`${s.color}10`} stroke={s.color} strokeWidth={1} />
            <text x={x + 33} y={48} textAnchor="middle" fontSize={10}
              fontWeight={700} fill={s.color}>{s.label}</text>
            <text x={x + 33} y={62} textAnchor="middle" fontSize={8}
              fill="var(--muted-foreground)">{s.size}</text>
            {/* channel badge */}
            <rect x={x + 12} y={78} width={42} height={16} rx={8}
              fill={s.color} fillOpacity={0.12} stroke={s.color} strokeWidth={0.6} />
            <text x={x + 33} y={90} textAnchor="middle" fontSize={8}
              fontWeight={600} fill={s.color}>{s.ch}</text>
            {/* arrow */}
            {i < stages.length - 1 && (
              <line x1={x + 68} y1={52} x2={x + gap - 2} y2={52}
                stroke={C.dim} strokeWidth={0.8} markerEnd="url(#ovArrow)" />
            )}
          </motion.g>
        );
      })}

      {/* Resolution bar */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <text x={20} y={118} fontSize={9} fontWeight={600} fill={C.fc}>해상도</text>
        <rect x={80} y={110} width={320} height={8} rx={4}
          fill={C.fc} fillOpacity={0.08} />
        <motion.rect x={80} y={110} width={320} height={8} rx={4}
          fill={C.fc} fillOpacity={0.3}
          initial={{ width: 320 }} animate={{ width: 10 }}
          transition={{ duration: 1.5, delay: 0.8 }} />
        <text x={410} y={118} fontSize={8} fill={C.fc}>감소</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}>
        <text x={20} y={140} fontSize={9} fontWeight={600} fill={C.ch}>채널 수</text>
        <rect x={80} y={132} width={320} height={8} rx={4}
          fill={C.ch} fillOpacity={0.08} />
        <motion.rect x={80} y={132} width={10} height={8} rx={4}
          fill={C.ch} fillOpacity={0.4}
          initial={{ width: 10 }} animate={{ width: 320 }}
          transition={{ duration: 1.5, delay: 1.0 }} />
        <text x={410} y={140} fontSize={8} fill={C.ch}>증가</text>
      </motion.g>

      <defs>
        <marker id="ovArrow" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.dim} />
        </marker>
      </defs>
    </g>
  );
}
