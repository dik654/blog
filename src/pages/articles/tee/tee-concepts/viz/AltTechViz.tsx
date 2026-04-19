import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'TEE vs FHE — TEE는 native 90% 성능, FHE는 10⁴~10⁶× 느림' },
  { label: 'TEE vs MPC — TEE는 단일 CPU/HW TCB, MPC는 분산 노드/암호 기반' },
  { label: 'TEE vs ZKP — TEE는 confidential exec, ZKP는 correctness proof' },
  { label: 'TEE + 다른 기술 조합 — HE/MPC/ZK 보강 트렌드' },
];

const FHE_COMPARE = [
  { name: 'TEE', perf: '0.9×', tcb: 'HW 신뢰 필요', c: '#10b981' },
  { name: 'FHE', perf: '10⁻⁵×', tcb: '수학적 보안만', c: '#ef4444' },
];

const MPC_COMPARE = [
  { name: 'TEE', latency: '낮음', collusion: '단일 CPU TCB', c: '#10b981' },
  { name: 'MPC', latency: '높음', collusion: 'Collusion-resistant', c: '#0ea5e9' },
];

const ZKP_COMPARE = [
  { name: 'TEE', what: 'Confidential execution', c: '#10b981' },
  { name: 'ZKP', what: 'Correctness proof, input 공개 X', c: '#a855f7' },
];

const HYBRIDS = [
  { name: 'TEE + HE', sub: 'SGX 안에서 HE → 성능 10×', c: '#6366f1' },
  { name: 'TEE + MPC', sub: '각 MPC 노드가 TEE → threshold 완화', c: '#10b981' },
  { name: 'TEE + ZK', sub: '측정값 + ZK proof → 검증 단순화', c: '#f59e0b' },
];

export default function AltTechViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              TEE vs FHE 성능 비교
            </text>
            {FHE_COMPARE.map((c, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}>
                <ModuleBox x={50 + i * 235} y={50} w={220} h={70}
                  label={c.name} sub={c.tcb} color={c.c} />
                <text x={160 + i * 235} y={140} textAnchor="middle"
                  fontSize={20} fontWeight={700} fill={c.c}
                  style={{ fontFamily: 'monospace' }}>{c.perf}</text>
                <text x={160 + i * 235} y={158} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)">native 대비</text>
              </motion.g>
            ))}
            <text x={260} y={195} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              대부분 사용 사례에서 TEE가 현실적 — FHE는 specialized 용도
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              TEE vs MPC 트레이드오프
            </text>
            {MPC_COMPARE.map((c, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}>
                <ModuleBox x={50 + i * 235} y={50} w={220} h={62}
                  label={c.name} sub={`Latency: ${c.latency}`} color={c.c} />
                <rect x={50 + i * 235} y={130} width={220} height={32} rx={4}
                  fill={`${c.c}12`} stroke={`${c.c}50`} strokeWidth={0.8} />
                <text x={160 + i * 235} y={150} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={c.c}>{c.collusion}</text>
              </motion.g>
            ))}
            <text x={260} y={195} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              TEE는 빠르지만 single point of trust, MPC는 느리지만 분산 신뢰
            </text>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#a855f7">
              TEE vs ZKP — 보완적 관계
            </text>
            {ZKP_COMPARE.map((c, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={40} y={50 + i * 60} width={440} height={50} rx={6}
                  fill={`${c.c}10`} stroke={`${c.c}50`} strokeWidth={0.8} />
                <text x={75} y={80 + i * 60} textAnchor="middle"
                  fontSize={14} fontWeight={700} fill={c.c}>{c.name}</text>
                <text x={150} y={80 + i * 60}
                  fontSize={11} fill="var(--foreground)">{c.what}</text>
              </motion.g>
            ))}
            <text x={260} y={195} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              TEE + ZKP 하이브리드 증가 (Phala, RISC-Zero, Aleo)
            </text>
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              TEE 보강 — 하이브리드 패턴
            </text>
            {HYBRIDS.map((h, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <ModuleBox x={50} y={50 + i * 56} w={420} h={44}
                  label={h.name} sub={h.sub} color={h.c} />
              </motion.g>
            ))}
            <text x={260} y={210} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              "TEE는 만능이 아니지만 다른 기술과 조합하면 실용적"
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
