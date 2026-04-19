import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  cpu: '#f59e0b',
  ntt: '#6366f1',
  intt: '#8b5cf6',
  msm: '#ec4899',
  d2h: '#10b981',
  bg: '#94a3b8',
  h2d: '#f97316',
};

const STEPS = [
  { label: '단계 ① Witness: CPU에서 R1CS 제약을 풀어 와이어 벡터 w를 만든다 — GPU 불가' },
  { label: '단계 ② NTT x3: A(x), B(x), C(x) 다항식을 ω 점에서 평가한다 — GPU 커널 1~3' },
  { label: '단계 ③ Pointwise + INTT: H(x) = (A·B - C) / Z 몫 다항식 — GPU 커널 4' },
  { label: '단계 ④ MSM x3: CRS와 함께 [A]₁, [B]₂, [C]₁ 증명 원소를 만든다 — GPU 커널 5~7 (병목)' },
  { label: '단계 ⑤ 결과 조합: π = (A, B, C) 256 bytes를 GPU에서 Host로 복사한다' },
  { label: 'Host↔Device 전송 패턴: H2D는 witness + CRS bases, D2H는 192 bytes proof — CRS 상주가 핵심 최적화' },
];

interface Kernel {
  id: string;
  label: string;
  sub: string;
  color: string;
  device: string;
}

const KERNELS: Kernel[] = [
  { id: '①', label: 'solve(R1CS)', sub: 'witness w', color: C.cpu, device: 'CPU' },
  { id: '②', label: 'gpu_ntt × 3', sub: 'A(x), B(x), C(x)', color: C.ntt, device: 'GPU K1-K3' },
  { id: '③', label: 'gpu_intt', sub: 'H(x) 몫', color: C.intt, device: 'GPU K4' },
  { id: '④', label: 'gpu_msm × 3', sub: '[A]₁, [B]₂, [C]₁', color: C.msm, device: 'GPU K5-K7' },
  { id: '⑤', label: 'cudaMemcpy', sub: 'π = (A,B,C)', color: C.d2h, device: 'D2H' },
];

function KernelView({ active }: { active: number }) {
  return (
    <g>
      {KERNELS.map((k, i) => {
        const y = 18 + i * 26;
        const isActive = i === active;
        const done = i < active;
        const opacity = isActive ? 1 : done ? 0.55 : 0.22;
        return (
          <g key={k.id}>
            <motion.g initial={{ opacity: 0, x: -6 }}
              animate={{ opacity, x: 0 }}
              transition={{ duration: 0.25, delay: isActive ? 0.05 : 0 }}>
              <text x={20} y={y + 13} fontSize={11} fontWeight={700} fill={k.color}>{k.id}</text>
              <ActionBox x={42} y={y} w={150} h={20} label={k.label} color={k.color} />
              <DataBox x={206} y={y} w={170} h={20} label={k.sub} color={k.color} />
              <text x={384} y={y + 13} fontSize={8} fill={C.bg}>{k.device}</text>
            </motion.g>
          </g>
        );
      })}
    </g>
  );
}

interface Transfer {
  dir: string;
  desc: string;
  size: string;
  color: string;
  optim?: string;
}

const TRANSFERS: Transfer[] = [
  { dir: 'H2D', desc: 'witness scalars', size: 'n × 32B', color: C.h2d },
  { dir: 'H2D', desc: 'CRS bases', size: 'n × 64B', color: C.h2d, optim: 'GPU 상주로 제거 가능' },
  { dir: 'D2H', desc: 'proof elements', size: '3 × 64B = 192B', color: C.d2h },
];

function TransferView() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
        Host ↔ Device 전송 패턴
      </text>
      {TRANSFERS.map((t, i) => {
        const y = 36 + i * 36;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}>
            <rect x={30} y={y} width={50} height={20} rx={4}
              fill={t.color + '22'} stroke={t.color} strokeWidth={0.8} />
            <text x={55} y={y + 13} textAnchor="middle"
              fontSize={9} fontWeight={700} fill={t.color}>{t.dir}</text>
            <text x={92} y={y + 13} fontSize={9} fontWeight={600} fill="var(--foreground)">
              {t.desc}
            </text>
            <text x={250} y={y + 13} fontSize={8.5} fill="var(--muted-foreground)">{t.size}</text>
            {t.optim && (
              <text x={250} y={y + 28} fontSize={7.5} fill={C.intt}>→ {t.optim}</text>
            )}
          </motion.g>
        );
      })}
    </g>
  );
}

export default function Groth16KernelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 5 ? <KernelView active={step} /> : <TransferView />}
        </svg>
      )}
    </StepViz>
  );
}
