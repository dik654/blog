import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox } from '@/components/viz/boxes';

const C = {
  cpu: '#f59e0b',
  ntt: '#6366f1',
  msm: '#8b5cf6',
  proof: '#10b981',
  bg: '#94a3b8',
};

const STEPS = [
  { label: 'Stage 1: Witness 계산은 CPU에서 제약을 순차적으로 풀어 와이어 벡터 w를 만든다' },
  { label: 'Stage 2: NTT는 다항식을 ω^i 점에서 평가한다 — O(n log n), GPU 시간 ~25%' },
  { label: 'Stage 3: MSM은 타원곡선 위의 스칼라 곱을 모두 더한다 — O(n), GPU 시간 ~65%' },
  { label: 'Stage 4: 결과 Proof는 (A, B, C) 256 bytes로 GPU에서 Host로 복사된다' },
  { label: '시간 비중: 전체 증명 시간의 65%가 MSM, 25%가 NTT, 10%가 기타에서 발생한다' },
];

interface Stage {
  key: string;
  label: string;
  sub: string;
  color: string;
  detail: string;
  device: string;
}

const STAGES: Stage[] = [
  { key: 'wit', label: 'Witness', sub: '제약 풀이', color: C.cpu, detail: 'CPU 순차 — GPU 불가', device: 'CPU' },
  { key: 'ntt', label: 'NTT', sub: '평가', color: C.ntt, detail: 'O(n log n) — GPU', device: 'GPU' },
  { key: 'msm', label: 'MSM', sub: '커밋', color: C.msm, detail: 'O(n) — GPU 병목', device: 'GPU' },
  { key: 'proof', label: 'Proof', sub: 'π=(A,B,C)', color: C.proof, detail: '256 bytes', device: 'D2H' },
];

function StageView({ active }: { active: number }) {
  const cur = STAGES[active];
  return (
    <g>
      <motion.text key={`title-${active}`} x={240} y={14} textAnchor="middle"
        fontSize={10} fontWeight={700} fill={cur.color}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {cur.label} — {cur.detail}
      </motion.text>
      {STAGES.map((s, i) => {
        const x = 30 + i * 110;
        const isActive = i === active;
        const done = i < active;
        const opacity = isActive ? 1 : done ? 0.55 : 0.22;
        return (
          <g key={s.key}>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity }} transition={{ duration: 0.25 }}>
              <ModuleBox x={x} y={50} w={92} h={48} label={s.label} sub={s.sub} color={s.color} />
            </motion.g>
            {i < STAGES.length - 1 && (
              <motion.line x1={x + 92} y1={74} x2={x + 110} y2={74}
                stroke="#888" strokeWidth={1.2} markerEnd="url(#pp-arr)"
                initial={{ opacity: 0 }}
                animate={{ opacity: i < active ? 0.7 : 0.25 }} />
            )}
            <text x={x + 46} y={120} textAnchor="middle"
              fontSize={8} fill={C.bg}>{s.device}</text>
          </g>
        );
      })}
    </g>
  );
}

interface Bar {
  label: string;
  value: number;
  color: string;
  note: string;
}

const BARS: Bar[] = [
  { label: 'MSM', value: 65, color: C.msm, note: '타원곡선 스칼라 곱 합산' },
  { label: 'NTT', value: 25, color: C.ntt, note: '다항식 평가 / 보간' },
  { label: '기타', value: 10, color: C.bg, note: 'Witness, 메모리 전송, 조합' },
];

function BreakdownView() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
        2^20 constraints 기준 시간 비중
      </text>
      {BARS.map((b, i) => {
        const y = 38 + i * 32;
        const w = (b.value / 100) * 320;
        return (
          <motion.g key={b.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}>
            <text x={30} y={y + 12} fontSize={9} fontWeight={700} fill={b.color}>{b.label}</text>
            <rect x={75} y={y} width={320} height={18} rx={4}
              fill="var(--border)" opacity={0.18} />
            <motion.rect x={75} y={y} width={w} height={18} rx={4} fill={b.color}
              initial={{ width: 0 }}
              animate={{ width: w }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.55 }} />
            <text x={75 + w + 6} y={y + 12} fontSize={8.5} fontWeight={600} fill={b.color}>
              {b.value}%
            </text>
            <text x={75} y={y + 30} fontSize={7.5} fill="var(--muted-foreground)">{b.note}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export default function PipelineCodeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pp-arr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#888" />
            </marker>
          </defs>
          {step < 4 ? <StageView active={step} /> : <BreakdownView />}
        </svg>
      )}
    </StepViz>
  );
}
