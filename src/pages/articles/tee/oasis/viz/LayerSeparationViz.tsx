import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '합의 계층 — 보안·안정성 우선', body: 'CometBFT BFT 합의로 검증인 관리·스테이킹·거버넌스 처리.\nParaTime의 루트 해시만 커밋 — 자체 트랜잭션 실행 없음.\n수십~수백 TPS, 즉시 확정.' },
  { label: '런타임 계층 — 성능·유연성 우선', body: 'ParaTime이 독립된 실행 환경, 고유 VM·정책·TEE 설정 보유.\n컴퓨트 노드가 병렬 실행 후 Consensus에 batch commit.\n각 ParaTime별 수천 TPS 가능.' },
  { label: '주요 ParaTime 3종 비교', body: 'Sapphire: 기밀 EVM (TEE 필수).\nEmerald: 일반 EVM (TEE 선택).\nCipher: Wasm 기반 기밀 (experimental).' },
  { label: 'Cosmos Zone과의 차이', body: 'Oasis ParaTime ≈ Cosmos Zone — 독립 실행 + shared security.\n차이: TEE 기밀성을 1차 요건으로, Consensus가 명시적 shared security 제공.' },
];

export default function LayerSeparationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Consensus Layer */}
          <motion.g animate={{ opacity: step === 0 || step === 3 ? 1 : 0.35 }}>
            <ModuleBox x={130} y={20} w={220} h={50} label="Consensus Layer"
              sub="CometBFT · Validators · Staking" color="#6366f1" />
            <DataBox x={75} y={32} w={50} h={26} label="≤300 TPS" color="#6366f1" />
            <DataBox x={355} y={32} w={50} h={26} label="instant" color="#6366f1" />
          </motion.g>

          {/* arrows: state root commits up */}
          {(step === 1 || step === 2 || step === 3) && (
            <>
              <motion.line x1={180} y1={130} x2={180} y2={75}
                stroke="#10b981" strokeWidth={1.2} strokeDasharray="4,3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
              <motion.line x1={240} y1={130} x2={240} y2={75}
                stroke="#10b981" strokeWidth={1.2} strokeDasharray="4,3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1, duration: 0.4 }} />
              <motion.line x1={300} y1={130} x2={300} y2={75}
                stroke="#10b981" strokeWidth={1.2} strokeDasharray="4,3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.4 }} />
              <text x={355} y={105} fontSize={8} fill="#10b981">root hash commits</text>
            </>
          )}

          {/* Runtime layer — three paratimes */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.3 }}>
            <ModuleBox x={140} y={130} w={80} h={48}
              label="Sapphire" sub="EVM + TEE" color="#10b981" />
            <ModuleBox x={230} y={130} w={80} h={48}
              label="Emerald" sub="EVM" color="#3b82f6" />
            <ModuleBox x={320} y={130} w={80} h={48}
              label="Cipher" sub="Wasm + TEE" color="#a855f7" />
          </motion.g>

          {/* paratime descriptors */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={130} y={188} w={100} h={22} label="TEE 필수" color="#10b981" outlined />
              <DataBox x={235} y={188} w={70} h={22} label="optional" color="#3b82f6" outlined />
              <DataBox x={310} y={188} w={100} h={22} label="experimental" color="#a855f7" outlined />
            </motion.g>
          )}

          {/* TPS callout for runtime */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={180} y={205} w={180} h={22} label="각 ParaTime 수천 TPS 병렬"
                color="#10b981" outlined />
            </motion.g>
          )}

          {/* Cosmos comparison */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={50} y={100} fontSize={10} fill="#6366f1" fontWeight={600}>shared</text>
              <text x={50} y={112} fontSize={10} fill="#6366f1" fontWeight={600}>security</text>
              <text x={420} y={100} fontSize={10} fill="#10b981" fontWeight={600}>per-zone</text>
              <text x={420} y={112} fontSize={10} fill="#10b981" fontWeight={600}>VM</text>
            </motion.g>
          )}

          {/* labels */}
          <text x={50} y={50} fontSize={9} fill="var(--muted-foreground)">L1</text>
          <text x={50} y={155} fontSize={9} fill="var(--muted-foreground)">L2</text>
        </svg>
      )}
    </StepViz>
  );
}
