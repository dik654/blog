import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox } from '@/components/viz/boxes';

const C = {
  r1: '#6366f1',
  r2: '#10b981',
  r3: '#f59e0b',
  r4: '#8b5cf6',
  r5: '#ec4899',
  bg: '#94a3b8',
  ntt: '#0ea5e9',
  msm: '#f43f5e',
};

const STEPS = [
  { label: 'Round 1: Wire 다항식 a(X), b(X), c(X)를 INTT로 만들고 SRS에 커밋한다 — 3 NTT + 3 MSM' },
  { label: 'Round 2: 순열 다항식 z(X)를 누적 곱으로 만들고 커밋한다 — 1 NTT + 1 MSM' },
  { label: 'Round 3: 몫 다항식 t(X)를 차수 3n에서 구해 t_lo, t_mid, t_hi 3등분 후 각각 커밋한다' },
  { label: 'Round 4: 챌린지 ζ에서 다항식 값을 평가한다 — 모두 CPU 스칼라 연산' },
  { label: 'Round 5: KZG 오프닝 W_ζ(X), W_ζω(X)를 각각 MSM으로 커밋한다' },
  { label: '총합: NTT 11회 이상 + MSM 10회 — Groth16의 burst 패턴과 달리 균일한 stream 패턴이 특징' },
];

interface Round {
  id: string;
  label: string;
  sub: string;
  ntt: number;
  msm: number;
  color: string;
  detail: string;
}

const ROUNDS: Round[] = [
  { id: 'R1', label: 'Wire 커밋', sub: 'a, b, c', ntt: 3, msm: 3, color: C.r1, detail: '회로 와이어 → SRS' },
  { id: 'R2', label: '순열', sub: 'z(X)', ntt: 1, msm: 1, color: C.r2, detail: 'grand product' },
  { id: 'R3', label: '몫 다항식', sub: 't_lo / t_mid / t_hi', ntt: 7, msm: 3, color: C.r3, detail: '차수 3n → 3등분' },
  { id: 'R4', label: '평가', sub: 'ā, b̄, c̄ ...', ntt: 0, msm: 0, color: C.r4, detail: 'CPU 스칼라' },
  { id: 'R5', label: 'KZG 오프닝', sub: 'W_ζ, W_ζω', ntt: 0, msm: 2, color: C.r5, detail: '오프닝 증명' },
];

function RoundView({ active }: { active: number }) {
  const r = ROUNDS[active];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={r.color}>
        {r.id} — {r.label}: {r.detail}
      </text>
      {/* All rounds row */}
      {ROUNDS.map((rr, i) => {
        const x = 18 + i * 90;
        const isActive = i === active;
        const done = i < active;
        const opacity = isActive ? 1 : done ? 0.5 : 0.2;
        return (
          <motion.g key={rr.id}
            initial={{ opacity: 0 }}
            animate={{ opacity }}
            transition={{ duration: 0.25 }}>
            <ModuleBox x={x} y={32} w={80} h={42} label={rr.id} sub={rr.label} color={rr.color} />
          </motion.g>
        );
      })}
      {/* Active round detail */}
      <motion.g key={`detail-${active}`}
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}>
        <rect x={30} y={92} width={420} height={48} rx={6}
          fill={r.color + '08'} stroke={r.color + '60'} strokeWidth={0.8} />
        <text x={48} y={108} fontSize={9} fontWeight={700} fill={r.color}>{r.sub}</text>
        {/* NTT/MSM badges */}
        <g transform="translate(48, 116)">
          {r.ntt > 0 && (
            <g>
              <rect x={0} y={0} width={64} height={16} rx={3}
                fill={C.ntt + '22'} stroke={C.ntt} strokeWidth={0.6} />
              <text x={32} y={11} textAnchor="middle"
                fontSize={8.5} fontWeight={700} fill={C.ntt}>
                NTT × {r.ntt}
              </text>
            </g>
          )}
          {r.msm > 0 && (
            <g transform={`translate(${r.ntt > 0 ? 72 : 0}, 0)`}>
              <rect x={0} y={0} width={64} height={16} rx={3}
                fill={C.msm + '22'} stroke={C.msm} strokeWidth={0.6} />
              <text x={32} y={11} textAnchor="middle"
                fontSize={8.5} fontWeight={700} fill={C.msm}>
                MSM × {r.msm}
              </text>
            </g>
          )}
          {r.ntt === 0 && r.msm === 0 && (
            <text x={0} y={11} fontSize={8.5} fill={C.bg}>스칼라 평가 (GPU 미사용)</text>
          )}
        </g>
      </motion.g>
    </g>
  );
}

const TOTAL_BARS = [
  { label: 'NTT', value: 11, max: 12, color: C.ntt, note: 'Round 1, 2, 3 — 균일 분포' },
  { label: 'MSM', value: 10, max: 12, color: C.msm, note: 'Round 1, 2, 3, 5 — 소규모 반복' },
];

function TotalView() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
        PLONK 5 라운드 GPU 호출 합계 (Stream형)
      </text>
      {TOTAL_BARS.map((b, i) => {
        const y = 42 + i * 40;
        const w = (b.value / b.max) * 320;
        return (
          <motion.g key={b.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}>
            <text x={30} y={y + 12} fontSize={10} fontWeight={700} fill={b.color}>{b.label}</text>
            <rect x={75} y={y} width={320} height={20} rx={4}
              fill="var(--border)" opacity={0.18} />
            <motion.rect x={75} y={y} width={w} height={20} rx={4} fill={b.color}
              initial={{ width: 0 }}
              animate={{ width: w }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.55 }} />
            <text x={75 + w + 6} y={y + 13} fontSize={9} fontWeight={700} fill={b.color}>
              {b.value}+
            </text>
            <text x={75} y={y + 32} fontSize={7.5} fill="var(--muted-foreground)">{b.note}</text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={142} textAnchor="middle"
        fontSize={8} fill={C.bg}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        burst (Groth16: 3개 대형 MSM) ↔ stream (PLONK: 균일한 NTT + MSM)
      </motion.text>
    </g>
  );
}

export default function PlonkRoundViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 5 ? <RoundView active={step} /> : <TotalView />}
        </svg>
      )}
    </StepViz>
  );
}
