import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  fwd: '#0ea5e9',     // sky — Forward
  scale: '#10b981',   // emerald — Scale calc
  bwd: '#a855f7',     // violet — Backward
  fb: '#f59e0b',      // amber — Fallback
  warn: '#ef4444',    // red
};

const STEPS = [
  { label: '1. Forward (FP8 E4M3) — amax 기록', body: '각 텐서마다 절대 최대값(amax)을 추적.\n최근 N step 이력을 윈도우로 유지 (delayed scaling).' },
  { label: '2. Scale factor 계산', body: 'scale = FP8_MAX / amax_history.max().\n오버플로 방지 + 정밀도 최대화.\n현재 step 이 아닌 과거 이력 사용 → 오버헤드 ~0.' },
  { label: '3. Backward (FP8 E5M2) — gradient', body: '그래디언트는 동적 범위가 넓은 E5M2 사용.\nweight/activation 와 별도 scale 적용.' },
  { label: '4. 정밀도 판단 → FP16 fallback', body: 'amax 가 FP8 표현 범위 초과 시 자동 FP16 전환.\n수렴성 보호.' },
  { label: '전체 흐름: forward + scale + backward + 판단', body: 'TransformerEngine 이 per-tensor 단위로 자동 관리.\n사용자는 fp8_autocast 만 감싸면 됨.' },
];

function ForwardStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fwd}>
        1. Forward pass (FP8 E4M3) — amax 기록
      </text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <ActionBox x={30} y={32} w={120} h={36} label="GEMM (E4M3)" sub="weight × act" color={C.fwd} />
        <line x1={152} y1={50} x2={188} y2={50} stroke={C.fwd} strokeWidth={1} markerEnd="url(#arrSc)" />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <ActionBox x={190} y={32} w={120} h={36} label="amax 추적" sub="abs(tensor).max()" color={C.fwd} />
        <line x1={312} y1={50} x2={348} y2={50} stroke={C.fwd} strokeWidth={1} markerEnd="url(#arrSc)" />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <DataBox x={350} y={32} w={120} h={36} label="amax history" sub="N step window" color={C.fwd} outlined />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <text x={240} y={94} textAnchor="middle" fontSize={9} fill={C.fwd}>
          매 텐서마다 amax 1 회 측정 — 비용 거의 무시 가능
        </text>
        <text x={240} y={108} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          history 윈도우 = 학습 안정성 ↑
        </text>
      </motion.g>
      <defs>
        <marker id="arrSc" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill={C.fwd} />
        </marker>
      </defs>
    </g>
  );
}

function ScaleCalcStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.scale}>
        2. Scale factor = FP8_MAX / amax_history.max()
      </text>
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <DataBox x={30} y={36} w={130} h={36} label="amax_history" sub="max of N steps" color={C.fwd} outlined />
      </motion.g>
      <motion.text x={172} y={56} fontSize={11} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>÷</motion.text>
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <DataBox x={185} y={36} w={120} h={36} label="FP8_MAX" sub="448 (E4M3)" color={C.scale} outlined />
      </motion.g>
      <motion.text x={317} y={56} fontSize={11} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>=</motion.text>
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
        <rect x={330} y={36} width={130} height={36} rx={6} fill={C.scale + '20'} stroke={C.scale} strokeWidth={1} />
        <text x={395} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.scale}>scale</text>
        <text x={395} y={66} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">per-tensor</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        <rect x={40} y={86} width={400} height={42} rx={6} fill={C.scale + '08'} stroke={C.scale} strokeWidth={0.5} />
        <text x={240} y={102} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.scale}>delayed scaling</text>
        <text x={240} y={117} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          현재 step 의 amax 가 아닌 과거 이력 사용 → GPU 동기화 비용 0
        </text>
      </motion.g>
    </g>
  );
}

function BackwardStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bwd}>
        3. Backward pass (FP8 E5M2) — gradient
      </text>
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <ActionBox x={350} y={32} w={120} h={36} label="∇ Loss" sub="output gradient" color={C.bwd} />
      </motion.g>
      <motion.line x1={350} y1={50} x2={314} y2={50} stroke={C.bwd} strokeWidth={1} markerEnd="url(#arrBw)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <ActionBox x={190} y={32} w={120} h={36} label="GEMM (E5M2)" sub="grad ∂L/∂W" color={C.bwd} />
      </motion.g>
      <motion.line x1={190} y1={50} x2={154} y2={50} stroke={C.bwd} strokeWidth={1} markerEnd="url(#arrBw)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <DataBox x={30} y={32} w={120} h={36} label="grad scale" sub="별도 history" color={C.bwd} outlined />
      </motion.g>
      <motion.text x={240} y={94} textAnchor="middle" fontSize={9} fill={C.bwd}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        그래디언트는 동적 범위가 매우 넓어 E5M2 (5-bit exponent) 사용
      </motion.text>
      <motion.text x={240} y={110} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        forward 와 별도 scale (입력 분포가 완전히 다름)
      </motion.text>
      <defs>
        <marker id="arrBw" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill={C.bwd} />
        </marker>
      </defs>
    </g>
  );
}

function FallbackStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fb}>
        4. amax 가 FP8 범위 초과 → FP16 fallback
      </text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DataBox x={30} y={32} w={130} h={36} label="amax check" sub="vs FP8_MAX" color={C.fb} outlined />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <line x1={162} y1={50} x2={198} y2={50} stroke={C.fb} strokeWidth={1} markerEnd="url(#arrFb)" />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <ActionBox x={200} y={20} w={130} h={28} label="FP8 OK" sub="정상 학습" color={C.scale} />
        <ActionBox x={200} y={56} w={130} h={28} label="amax > FP8_MAX" sub="overflow risk" color={C.warn} />
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
        <line x1={332} y1={70} x2={368} y2={70} stroke={C.warn} strokeWidth={1} markerEnd="url(#arrFb)" />
        <ActionBox x={370} y={56} w={100} h={28} label="FP16 fallback" color={C.warn} />
      </motion.g>
      <motion.text x={240} y={108} textAnchor="middle" fontSize={9} fill={C.fb}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        수렴성 보호 — 정확도 손실 0.1% 미만 유지
      </motion.text>
      <defs>
        <marker id="arrFb" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill={C.fb} />
        </marker>
      </defs>
    </g>
  );
}

function FullFlowStep() {
  const stages = [
    { label: 'Forward', sub: 'E4M3 + amax', color: C.fwd },
    { label: 'Scale calc', sub: 'FP8_MAX / amax', color: C.scale },
    { label: 'Backward', sub: 'E5M2', color: C.bwd },
    { label: '판단', sub: 'OK / fallback', color: C.fb },
  ];
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
        Per-tensor 자동 스케일링 (Transformer Engine)
      </text>
      {stages.map((s, i) => {
        const x = 20 + i * 115;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
            <rect x={x} y={32} width={100} height={50} rx={6} fill={s.color + '12'} stroke={s.color} strokeWidth={0.8} />
            <text x={x + 50} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill={s.color}>{s.label}</text>
            <text x={x + 50} y={66} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{s.sub}</text>
            {i < stages.length - 1 && (
              <line x1={x + 102} y1={57} x2={x + 113} y2={57}
                stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrFlowFinal)" />
            )}
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={40} y={94} width={400} height={32} rx={6} fill="#8b5cf608" stroke="#8b5cf6" strokeWidth={0.5} />
        <text x={240} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">
          사용자 코드: with te.fp8_autocast(): ... 한 줄
        </text>
        <text x={240} y={120} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          위 4단계는 텐서마다 자동 실행 (delayed scaling)
        </text>
      </motion.g>
      <defs>
        <marker id="arrFlowFinal" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
        </marker>
      </defs>
    </g>
  );
}

const R = [ForwardStep, ScaleCalcStep, BackwardStep, FallbackStep, FullFlowStep];

export default function ScalingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 140" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
