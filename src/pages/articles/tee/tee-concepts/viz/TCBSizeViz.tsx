import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'TCB 크기 = 신뢰해야 하는 LoC, 버그 밀도 ~15/1000 LoC' },
  { label: '일반 Linux: 30M+ LoC 커널 + libc + systemd → 수천~수만 버그' },
  { label: 'TEE (SGX): CPU HW + enclave 코드 + SDK ~50K → 수십~수백 버그' },
  { label: '보안 원칙 — Never trust what you don\'t need to trust' },
];

const LINUX_PARTS = [
  { name: 'Linux kernel', loc: '30M+', c: '#ef4444' },
  { name: 'glibc', loc: '1M+', c: '#ef4444' },
  { name: 'systemd', loc: '1M+', c: '#ef4444' },
  { name: 'userspace libs', loc: '수십M', c: '#ef4444' },
];

const SGX_PARTS = [
  { name: 'CPU hardware', loc: 'immutable', c: '#10b981' },
  { name: 'Enclave code', loc: '수천~수만', c: '#10b981' },
  { name: 'SGX SDK runtime', loc: '~50K', c: '#10b981' },
];

const PRINCIPLES = [
  { line: '최소한의 코드만 TCB에 포함', c: '#6366f1' },
  { line: '각 라인이 보안 리뷰됨', c: '#10b981' },
  { line: '가능하면 formal verification', c: '#f59e0b' },
];

export default function TCBSizeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              TCB 크기 ↔ 버그 노출
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={50} y={50} width={420} height={50} rx={6}
                fill="#6366f110" stroke="#6366f150" strokeWidth={0.8} />
              <text x={260} y={75} textAnchor="middle"
                fontSize={11} fontWeight={700} fill="#6366f1">
                예상 버그 수 ≈ LoC × 0.015
              </text>
              <text x={260} y={92} textAnchor="middle"
                fontSize={9.5} fill="var(--muted-foreground)">
                (1000 LoC당 평균 ~15 bugs, 1~25 범위)
              </text>
            </motion.g>
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <DataBox x={50} y={130} w={200} h={50}
                label="100K LoC" sub="≈ 1500 bugs 예상" color="#10b981" outlined />
              <DataBox x={270} y={130} w={200} h={50}
                label="30M LoC" sub="≈ 450,000 bugs 예상" color="#ef4444" outlined />
            </motion.g>
            <text x={260} y={205} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              TCB 작을수록 공격 표면 작음 + 검증 가능성 높음
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              일반 Linux 시스템 TCB
            </text>
            {LINUX_PARTS.map((p, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <AlertBox x={20 + (i % 2) * 245} y={45 + Math.floor(i / 2) * 65}
                  w={235} h={52} label={p.name} sub={`${p.loc} LoC`} color={p.c} />
              </motion.g>
            ))}
            <text x={260} y={195} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
              → 수천~수만 버그 잠재 + 한 줄 침해로 전체 무너짐
            </text>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              TEE (SGX) TCB — 최소화
            </text>
            {SGX_PARTS.map((p, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <ModuleBox x={50} y={50 + i * 50} w={420} h={42}
                  label={p.name} sub={p.loc} color={p.c} />
              </motion.g>
            ))}
            <text x={260} y={205} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
              → 수십~수백 버그 (formal verification 가능 범위)
            </text>
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              "Never trust what you don't need to trust"
            </text>
            {PRINCIPLES.map((p, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 50} width={420} height={36} rx={5}
                  fill={`${p.c}10`} stroke={`${p.c}50`} strokeWidth={0.8} />
                <rect x={50} y={50 + i * 50} width={4} height={36} fill={p.c} />
                <text x={70} y={72 + i * 50} fontSize={11} fontWeight={600} fill={p.c}>{p.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
