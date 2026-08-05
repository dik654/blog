import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Layer 1: On-chain — Substrate Parachain이 워커 등록·스테이킹·거버넌스 관리' },
  { label: 'Layer 2: Off-chain — SGX TEE Worker가 pRuntime + WASM Phat Contract 실행' },
  { label: '역할 분담 — On-chain은 "어디서 실행", Off-chain은 "무엇을 실행" 결정' },
  { label: '경쟁군 비교 — Chainlink는 oracle, Oasis는 자체 L1, Phala는 Polkadot 기반 워커' },
];

const ON_ITEMS = [
  { label: 'Parachain', sub: 'Polkadot/Kusama', color: '#6366f1' },
  { label: 'Worker Registry', sub: 'register/stake', color: '#6366f1' },
  { label: 'Phat Registry', sub: 'contract deploy', color: '#10b981' },
  { label: 'Governance', sub: 'PHA token vote', color: '#f59e0b' },
];

const OFF_ITEMS = [
  { label: 'Intel SGX', sub: 'Enclave HW', color: '#10b981' },
  { label: 'pRuntime', sub: 'Rust runtime', color: '#10b981' },
  { label: 'Phat Contract', sub: 'WASM bytecode', color: '#6366f1' },
  { label: 'gRPC API', sub: 'External I/O', color: '#f59e0b' },
];

const ROLE_ROWS = [
  { l: 'On-chain', r: 'Consensus, 최종 결과 commit', c: '#6366f1' },
  { l: 'Off-chain', r: 'Heavy compute, external API', c: '#10b981' },
  { l: 'On-chain', r: '워커 선택 (어디서 실행)', c: '#6366f1' },
  { l: 'Off-chain', r: '실제 계산 (무엇을 실행)', c: '#10b981' },
];

const COMPARE = [
  { name: 'Chainlink', sub: 'oracle 중심', color: '#f59e0b' },
  { name: 'Oasis', sub: '자체 L1 + TEE VM', color: '#ef4444' },
  { name: 'Phala', sub: 'Polkadot + 워커망', color: '#10b981' },
];

export default function ArchLayersViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              Layer 1: On-chain (Substrate)
            </text>
            {ON_ITEMS.map((it, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}>
                <ModuleBox x={30 + i * 120} y={50} w={108} h={56} label={it.label} sub={it.sub} color={it.color} />
              </motion.g>
            ))}
            <text x={260} y={142} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              Substrate framework — pallet 단위 모듈 / WASM Runtime 업그레이드 가능
            </text>
            <text x={260} y={160} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              경제적 인센티브: PHA 토큰 stake → 워커 정직성 보장
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              Layer 2: Off-chain (TEE Workers)
            </text>
            {OFF_ITEMS.map((it, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}>
                <ModuleBox x={30 + i * 120} y={50} w={108} h={56} label={it.label} sub={it.sub} color={it.color} />
              </motion.g>
            ))}
            <text x={260} y={142} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              SGX Enclave 내부 격리 / pRuntime이 contract 인스턴스 유지
            </text>
            <text x={260} y={160} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              gRPC로 외부 통신 — host proxy가 plaintext 전달, 민감 데이터는 envelope 암호화
            </text>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
              On-chain ↔ Off-chain 역할 분리
            </text>
            {ROLE_ROWS.map((r, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={40} y={42 + i * 32} width={440} height={26} rx={4}
                  fill={`${r.c}10`} stroke={`${r.c}40`} strokeWidth={0.8} />
                <rect x={40} y={42 + i * 32} width={70} height={26} rx={4} fill={`${r.c}25`} />
                <text x={75} y={59 + i * 32} textAnchor="middle"
                  fontSize={9.5} fontWeight={700} fill={r.c}>{r.l}</text>
                <text x={120} y={59 + i * 32}
                  fontSize={9.5} fill="var(--foreground)">{r.r}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              유사 프로젝트와 비교
            </text>
            {COMPARE.map((c, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}>
                <DataBox x={50 + i * 145} y={70} w={130} h={50} label={c.name} sub={c.sub} color={c.color} outlined />
              </motion.g>
            ))}
            <text x={260} y={150} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              Phala 차별점: Substrate 친화 + 워커 분산 + Off-chain compute 중심
            </text>
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              AI agent 실행 레이어로 포지셔닝 (2024 Eliza, Redpill 통합)
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
