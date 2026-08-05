import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  cpu: '#ef4444',
  gpu: '#10b981',
  hash: '#0ea5e9',
  tree: '#a855f7',
  speed: '#f59e0b',
};

const STEPS = [
  {
    label: '32 GiB 섹터 — 3단계 해시 작업',
    body: '실링 = 데이터를 PoRep으로 봉인.\n1) Column hashing (11-ary), 2) Tree-R 생성 (8-ary), 3) Tree-C 생성 (8-ary).\n총 ~8.5억 회 Poseidon 해시.',
  },
  {
    label: 'Column hashing 비교 — CPU vs GPU',
    body: 'CPU 32코어: ~4시간 (지배적 비용).\nGPU RTX 3090: ~25분 — 약 10배 가속.\n해시 인스턴스가 모두 독립이라 GPU 매핑이 자연스럽다.',
  },
  {
    label: '병렬성 — embarrassingly parallel',
    body: '각 해시는 입력만 다르고 라운드 구조는 동일.\nGPU의 수만 스레드에 1:1 매핑 가능.\nblock = 해시 인스턴스, thread = lane(상태 원소).',
  },
];

export default function FilecoinSealingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            Filecoin 실링과 Poseidon GPU 가속
          </text>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={36} w={440} h={32} label="32 GiB 섹터 (PoRep 봉인)" color={C.tree} outlined />

              <ActionBox x={20} y={86} w={140} h={42} label="Column Hashing" sub="11-ary × 8.5억" color={C.hash} />
              <ActionBox x={170} y={86} w={140} h={42} label="Tree-R" sub="8-ary Merkle" color={C.hash} />
              <ActionBox x={320} y={86} w={140} h={42} label="Tree-C" sub="8-ary Merkle" color={C.hash} />

              <StatusBox x={20} y={144} w={440} h={36} label="Poseidon 호출 ≈ 8.5억 회" sub="실링 시간의 약 80%" color={C.speed} progress={0.8} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={20} y={36} w={210} h={20} label="CPU (32코어)" color={C.cpu} />
              <StatusBox x={30} y={64} w={190} h={56} label="Column hashing" sub="≈ 4 시간" color={C.cpu} progress={1} />

              <ModuleBox x={250} y={36} w={210} h={20} label="GPU (RTX 3090)" color={C.gpu} />
              <StatusBox x={260} y={64} w={190} h={56} label="Column hashing" sub="≈ 25 분" color={C.gpu} progress={0.1} />

              <DataBox x={20} y={140} w={440} h={36} label="가속비 ≈ 10×" sub="Filecoin sealing 처리량의 핵심" color={C.speed} outlined />
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                해시 인스턴스가 독립 → GPU 활용도 거의 100%
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={42} fontSize={9} fontWeight={700} fill={C.gpu}>GPU mapping</text>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <g key={i}>
                  <DataBox x={20 + i * 56} y={56} w={48} h={26} label={`H${i}`} sub="block" color={C.hash} outlined />
                  {[0, 1, 2].map((j) => (
                    <DataBox key={j} x={20 + i * 56} y={86 + j * 22} w={48} h={18}
                      label={`l${j}`} color={C.gpu} outlined />
                  ))}
                </g>
              ))}
              <StatusBox x={20} y={170} w={440} h={36} label="block = 해시 인스턴스, thread = lane(state[0..t-1])" sub="공유 메모리 = 인스턴스별 상태" color={C.gpu} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
