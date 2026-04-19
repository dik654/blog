import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = {
  pub: '#10b981',
  priv: '#f59e0b',
  mid: '#6366f1',
  out: '#ec4899',
  bg: '#94a3b8',
};

const STEPS = [
  { label: '회로 예시: x^3 + x + 5 = 35 — 입력 x=3을 알면 출력이 35임을 증명한다' },
  { label: 'Public input: x=3, out=35 — 검증자도 아는 값이며 회로 입출력에 해당한다' },
  { label: '제약 시스템(R1CS)을 순서대로 풀어 중간 와이어 w2=9, w3=27, w4=30을 채운다' },
  { label: 'Witness = 모든 와이어 값의 할당 — w0..w5 전체가 증명자만 아는 값이 된다' },
  { label: '대규모 회로(수백만 제약)에서는 수백만 와이어를 순서대로 계산해야 한다' },
];

interface Wire {
  id: string;
  expr: string;
  value: string;
  kind: 'const' | 'pub' | 'mid' | 'out';
  derivedAt: number;
}

const WIRES: Wire[] = [
  { id: 'w0', expr: '1 (상수)', value: '1', kind: 'const', derivedAt: 1 },
  { id: 'w1', expr: 'x (input)', value: '3', kind: 'pub', derivedAt: 1 },
  { id: 'w2', expr: 'x · x', value: '9', kind: 'mid', derivedAt: 2 },
  { id: 'w3', expr: 'w2 · x', value: '27', kind: 'mid', derivedAt: 2 },
  { id: 'w4', expr: 'w3 + x + 5', value: '35', kind: 'mid', derivedAt: 2 },
  { id: 'w5', expr: 'out', value: '35', kind: 'out', derivedAt: 1 },
];

const KIND_COLOR: Record<Wire['kind'], string> = {
  const: C.bg, pub: C.pub, mid: C.mid, out: C.out,
};

function CircuitView({ activeStep }: { activeStep: number }) {
  // step 0: show all empty / context
  // step 1: highlight pub (w1, w5)
  // step 2: highlight mid being filled
  // step 3: all filled
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
        x^3 + x + 5 = 35 — Witness 와이어 할당
      </text>
      {WIRES.map((w, i) => {
        const x = 18 + i * 75;
        const visible =
          activeStep === 0 ||
          (activeStep === 1 && (w.kind === 'pub' || w.kind === 'out')) ||
          (activeStep >= 2);
        const color = KIND_COLOR[w.kind];
        return (
          <g key={w.id}>
            <motion.g
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: visible ? 1 : 0.18, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}>
              <DataBox x={x} y={36} w={68} h={28} label={w.id}
                sub={w.kind === 'const' ? '상수' : w.kind === 'pub' ? 'public' : w.kind === 'out' ? 'public out' : '중간'}
                color={color} outlined />
              <text x={x + 34} y={80} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">{w.expr}</text>
              {/* value badge: only after step 2 (or for pub/const at step 1) */}
              {visible && (w.kind !== 'mid' || activeStep >= 2) && (
                <motion.g
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.04 }}>
                  <circle cx={x + 60} cy={42} r={9} fill={color} />
                  <text x={x + 60} y={45} textAnchor="middle"
                    fontSize={8.5} fontWeight={700} fill="white">{w.value}</text>
                </motion.g>
              )}
            </motion.g>
          </g>
        );
      })}
      {/* legend */}
      <g transform="translate(20, 100)">
        {([
          { c: C.pub, l: 'public' },
          { c: C.mid, l: 'private 중간' },
          { c: C.out, l: 'public out' },
        ] as const).map((it, i) => (
          <g key={i} transform={`translate(${i * 110}, 0)`}>
            <rect x={0} y={0} width={10} height={10} rx={2} fill={it.c} />
            <text x={14} y={9} fontSize={8} fill="var(--muted-foreground)">{it.l}</text>
          </g>
        ))}
      </g>
    </g>
  );
}

const SCALE_BARS = [
  { label: '소형 (2^10)', value: 1024, color: '#10b981' },
  { label: '중형 (2^16)', value: 65536, color: '#f59e0b' },
  { label: '대형 (2^20)', value: 1048576, color: '#ec4899' },
];

function ScaleView() {
  const max = SCALE_BARS[SCALE_BARS.length - 1].value;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
        대규모 회로 = 수백만 와이어 (순차 계산)
      </text>
      {SCALE_BARS.map((b, i) => {
        const y = 38 + i * 32;
        const w = (b.value / max) * 320;
        return (
          <motion.g key={b.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}>
            <text x={30} y={y + 12} fontSize={9} fontWeight={700} fill={b.color}>{b.label}</text>
            <rect x={130} y={y} width={320} height={18} rx={4}
              fill="var(--border)" opacity={0.18} />
            <motion.rect x={130} y={y} width={w} height={18} rx={4} fill={b.color}
              initial={{ width: 0 }}
              animate={{ width: w }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.55 }} />
            <text x={130 + Math.min(w, 280) + 6} y={y + 12} fontSize={8.5} fontWeight={600} fill={b.color}>
              {b.value.toLocaleString()} 와이어
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

export default function WitnessConceptViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 4 ? <CircuitView activeStep={step} /> : <ScaleView />}
        </svg>
      )}
    </StepViz>
  );
}
