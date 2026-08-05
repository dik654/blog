import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '주기적 스냅샷 — 10000 라운드마다', body: 'checkpointInterval = 10000.\nMetadata{Root, ChunkSize=16MB, ChunkHashes} 생성.' },
  { label: '1) Tree → 16MB 청크로 직렬화', body: 'serializeTree(root, ChunkSize) — 트리를 fixed-size 청크로 분할.\n각 청크 독립적으로 검증 가능.' },
  { label: '2) Chunk 해시 + Metadata 저장', body: '각 chunk hash 계산 → ChunkHashes 배열.\nMetadata 가 무결성 보장.' },
  { label: '3) P2P 배포 — 새 노드 빠른 sync', body: '신규 노드: metadata 다운 → chunks 병렬 수집 (hash 검증) → tree 재구성.\n블록별 replay 불필요 → sync 시간 대폭 단축.' },
];

export default function CheckpointSystemViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Block timeline */}
          <line x1={20} y1={30} x2={460} y2={30} stroke="var(--border)" strokeWidth={1} />
          {[0, 10, 20, 30, 40].map((kr) => {
            const x = 20 + kr * 11;
            const isCheckpoint = kr % 10 === 0 && kr > 0;
            return (
              <g key={kr}>
                <circle cx={x} cy={30} r={isCheckpoint ? 5 : 2}
                  fill={isCheckpoint ? '#a855f7' : 'var(--border)'} />
                {isCheckpoint && (
                  <text x={x} y={20} textAnchor="middle" fontSize={8}
                    fill="#a855f7" fontWeight={600}>
                    cp@{kr * 1000}
                  </text>
                )}
              </g>
            );
          })}
          <text x={240} y={50} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            interval = 10000 rounds
          </text>

          {/* Step 1: tree split */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20} y={80} w={130} h={50} label="MKVS Tree" sub="state root" color="#6366f1" />
              <ActionBox x={170} y={85} w={120} h={42} label="serializeTree" sub="ChunkSize=16MB" color="#f59e0b" />
              {[0, 1, 2, 3].map((ci) => (
                <motion.g key={ci} initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: ci * 0.1 }}>
                  <DataBox x={310} y={70 + ci * 30} w={130} h={24}
                    label={`chunk[${ci}] 16MB`} color="#f59e0b" outlined />
                </motion.g>
              ))}
            </motion.g>
          )}

          {/* Step 2: hashes + metadata */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20} y={75} w={140} h={150} label="Metadata" color="#a855f7" />
              <text x={35} y={105} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
                Root = ...
              </text>
              <text x={35} y={123} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
                NumChunks = 4
              </text>
              <text x={35} y={141} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
                ChunkSize = 16MB
              </text>
              <text x={35} y={163} fontSize={10} fontFamily="monospace" fill="#f59e0b" fontWeight={600}>
                ChunkHashes:
              </text>
              <text x={35} y={181} fontSize={10} fontFamily="monospace" fill="#f59e0b">
                [h0, h1, h2, h3]
              </text>
              {[0, 1, 2, 3].map((ci) => (
                <motion.g key={ci} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: ci * 0.1 }}>
                  <DataBox x={210} y={80 + ci * 32} w={120} h={24}
                    label={`chunk[${ci}]`} color="#f59e0b" outlined />
                  <ActionBox x={345} y={80 + ci * 32} w={100} h={24}
                    label={`hash → h${ci}`} color="#10b981" />
                </motion.g>
              ))}
            </motion.g>
          )}

          {/* Step 3: P2P sync */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20}  y={90} w={120} h={50} label="seed nodes" sub="have cp" color="#3b82f6" />
              <ModuleBox x={340} y={90} w={120} h={50} label="new node" sub="syncing" color="#10b981" />
              <motion.g>
                {[0, 1, 2, 3].map((ci) => (
                  <motion.circle key={ci} cx={155 + ci * 50} cy={115} r={6}
                    fill="#f59e0b"
                    initial={{ x: 0 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1.2, delay: ci * 0.15, repeat: Infinity, repeatType: 'mirror' }} />
                ))}
              </motion.g>
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={600}>
                parallel chunk fetch + verify(hash)
              </text>
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>
                tree 재구성 — replay 없이 즉시 latest state
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
