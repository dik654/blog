import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox } from '@/components/viz/boxes';

const C = {
  app: '#10b981',
  bind: '#6366f1',
  api: '#f59e0b',
  disp: '#8b5cf6',
  cuda: '#ec4899',
  bg: '#94a3b8',
};

const STEPS = [
  { label: 'Application Layer: gnark, Polygon zkEVM, Scroll prover, custom ZK 앱이 ICICLE을 호출' },
  { label: 'Language Bindings: Rust(icicle-rs), Go(icicle-go), Python — 동일 C API를 각 언어에서 감쌈' },
  { label: 'C API Layer: icicle_msm(), icicle_ntt(), icicle_poseidon_hash() — 안정 ABI' },
  { label: 'Backend Dispatcher: 런타임에 CUDA / CPU 선택 — 향후 Metal, Vulkan 추가 예정' },
  { label: 'CUDA Core: msm_kernel<bn254_scalar, bn254_affine>, ntt_kernel<bls12_381_scalar> 등 C++ 템플릿' },
];

interface Layer {
  key: string;
  name: string;
  members: string[];
  color: string;
}

const LAYERS: Layer[] = [
  { key: 'app', name: 'Application', members: ['gnark', 'Polygon zkEVM', 'Scroll', 'custom ZK app'], color: C.app },
  { key: 'bind', name: 'Language Bindings', members: ['Rust (icicle-rs)', 'Go (icicle-go)', 'Python'], color: C.bind },
  { key: 'api', name: 'C API', members: ['icicle_msm', 'icicle_ntt', 'icicle_poseidon_hash'], color: C.api },
  { key: 'disp', name: 'Backend Dispatcher', members: ['CUDA backend', 'CPU backend', '(future: Metal, Vulkan)'], color: C.disp },
  { key: 'cuda', name: 'CUDA Core (C++ templates)', members: ['msm_kernel<bn254_*>', 'ntt_kernel<bls12_381_*>'], color: C.cuda },
];

export default function IcicleArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
            ICICLE 아키텍처 5계층
          </text>
          {LAYERS.map((l, i) => {
            const y = 28 + i * 38;
            const isActive = i === step;
            const done = i < step;
            const opacity = isActive ? 1 : done ? 0.55 : 0.22;
            return (
              <g key={l.key}>
                <motion.g initial={{ opacity: 0 }} animate={{ opacity }} transition={{ duration: 0.25 }}>
                  <ModuleBox x={20} y={y} w={130} h={32} label={l.name} color={l.color} />
                  {/* member badges */}
                  {l.members.map((m, idx) => {
                    const total = l.members.length;
                    const slot = (440 - 160) / total;
                    const x = 160 + idx * slot;
                    return (
                      <g key={`${l.key}-${idx}`}>
                        <rect x={x} y={y + 6} width={slot - 6} height={20} rx={4}
                          fill={l.color + '14'} stroke={l.color + '50'} strokeWidth={0.6} />
                        <text x={x + (slot - 6) / 2} y={y + 19} textAnchor="middle"
                          fontSize={7.5} fontWeight={500} fill={l.color}>{m}</text>
                      </g>
                    );
                  })}
                </motion.g>
                {/* connector line */}
                {i < LAYERS.length - 1 && (
                  <motion.line
                    x1={85} y1={y + 32}
                    x2={85} y2={y + 38}
                    stroke={C.bg} strokeWidth={1}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: i < step ? 0.7 : 0.25 }} />
                )}
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
