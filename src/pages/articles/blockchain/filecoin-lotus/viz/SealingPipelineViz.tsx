import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const STEPS = [
  { label: 'AddPiece: 데이터를 섹터에 패킹', body: '클라이언트 데이터를 섹터 크기(32GiB/64GiB)에 맞게 패킹합니다. CPU 바운드이며 I/O 중심 작업입니다.' },
  { label: 'PreCommit1 (PC1): SDR 인코딩 (CPU, 3-5시간)', body: 'Stacked DRG 그래프를 11개 레이어로 인코딩합니다. SHA-256 해시 체인의 순차 의존성으로 GPU 가속이 불가능합니다.' },
  { label: 'PreCommit2 (PC2): Merkle Tree 생성 (GPU, 10-20분)', body: 'Poseidon 해시로 Column Hash Tree와 Replica Tree를 구축합니다. GPU 가속 시 pc2_cuda로 약 2.5분까지 단축 가능합니다.' },
  { label: 'WaitSeed: 체인에서 랜덤 시드 대기 (150 에폭)', body: '인터랙티브 PoRep의 보안을 위해 체인에서 랜덤 시드를 대기합니다. 약 75분 소요됩니다.' },
  { label: 'Commit (C1+C2): zk-SNARK 증명 생성 (GPU, 20-30분)', body: 'C1에서 Merkle 포함 증명 경로를 추출하고, C2에서 Groth16 zk-SNARK 증명을 생성합니다. bellperson + sppark로 GPU 가속됩니다.' },
  { label: 'FinalizeSector: 증명 온체인 제출', body: '생성된 Groth16 증명을 Filecoin 체인에 제출합니다. 온체인 Verifier가 증명을 검증하면 섹터가 활성화됩니다.' },
];

const COLORS = { CPU: '#f59e0b', GPU: '#6366f1', Chain: '#10b981' };

const PIPELINE = [
  { label: 'AddPiece',   type: 'CPU' as const },
  { label: 'PC1 (SDR)',  type: 'CPU' as const },
  { label: 'PC2 (Tree)', type: 'GPU' as const },
  { label: 'WaitSeed',   type: 'Chain' as const },
  { label: 'C1+C2',      type: 'GPU' as const },
  { label: 'Finalize',   type: 'Chain' as const },
];

export default function SealingPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 600 80" className="w-full max-w-xl">
          {PIPELINE.map((s, i) => {
            const x = i * 100;
            const active = i === step;
            const done = i < step;
            const color = COLORS[s.type];
            const opacity = active ? 1 : done ? 0.45 : 0.2;

            return (
              <g key={s.label}>
                {i > 0 && (
                  <motion.line
                    x1={x - 8} y1={40} x2={x + 2} y2={40}
                    stroke={done || active ? color : '#666'}
                    strokeWidth={2}
                    animate={{ opacity: done || active ? 0.8 : 0.2 }}
                    transition={{ duration: 0.3 }}
                    markerEnd="url(#arrow)"
                  />
                )}
                <motion.rect
                  x={x + 4} y={16} width={88} height={48} rx={8}
                  fill={color}
                  animate={{ opacity, scale: active ? 1 : 0.98 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: `${x + 48}px 40px` }}
                />
                <text
                  x={x + 48} y={36}
                  textAnchor="middle"
                  className="fill-white text-[9px] font-bold"
                  style={{ opacity: Math.max(opacity, 0.5) }}
                >
                  {s.label}
                </text>
                <text
                  x={x + 48} y={52}
                  textAnchor="middle"
                  className="fill-white/70 text-[8px]"
                  style={{ opacity: Math.max(opacity, 0.4) }}
                >
                  {s.type}
                </text>
              </g>
            );
          })}
          <defs>
            <marker id="arrow" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#888" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
