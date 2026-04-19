import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const FILE = '#6366f1';
const CHUNK = '#0ea5e9';
const ROOT = '#10b981';
const HL = '#a855f7';
const MOD = '#f59e0b';

const STEPS = [
  { label: 'Chunking 전략', body: 'Fixed-size (256KB/1MB) · Rabin fingerprint (CDC) · Buzhash (rolling hash). 전략에 따라 dedup 효율이 다르다.' },
  { label: 'Small file 표현', body: '< 256KB는 단일 노드에 raw content. DAG 구조 불필요.' },
  { label: 'Large file → balanced tree', body: '루트가 sub-DAG를 가지고 leaf에 chunk. parallel fetch + integrity 검증.' },
  { label: 'Directory 노드', body: 'UnixFS directory = dag-pb 노드. 각 link = (name, CID, size).' },
  { label: '변경 전파', body: '한 leaf 변경 → 부모 chain의 모든 CID 갱신. 변경된 path만 새 CID, 나머지는 dedup.' },
  { label: 'iroh BLAKE3 Bao vs Git', body: 'iroh: 4KB chunks + BLAKE3 parallel + streaming verify. Git도 Merkle DAG (blob/tree/commit).' },
];

const STRATS = [
  { name: 'Fixed-size', sub: '256KB / 1MB · 단순' },
  { name: 'Rabin fingerprint', sub: 'CDC · 중간 삽입에 강함' },
  { name: 'Buzhash', sub: 'faster rolling hash' },
];

const COMPARE = [
  { sys: 'IPFS UnixFS', hash: 'sha2-256', chunk: '256KB fixed', extra: 'dag-pb' },
  { sys: 'iroh Bao', hash: 'BLAKE3', chunk: '4KB', extra: 'parallel + streaming' },
  { sys: 'Git', hash: 'sha-1 (sha-256)', chunk: 'whole blob', extra: 'tree + commit' },
];

export default function UnixFSChunkingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                파일 청킹 전략 3가지
              </text>
              {STRATS.map((s, i) => (
                <motion.g key={s.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <ActionBox x={70} y={48 + i * 50} w={340} h={36}
                    label={s.name} sub={s.sub} color={CHUNK} />
                </motion.g>
              ))}
              <text x={240} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                CDC = Content-Defined Chunking
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={ROOT}>
                Small file (&lt; 256 KB)
              </text>
              <ModuleBox x={170} y={70} w={140} h={70}
                label="single node" sub="raw content + CID" color={ROOT} />
              <text x={240} y={170} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                DAG 구조 없이 1개 블록으로 충분
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={ROOT}>
                Large file → balanced DAG
              </text>
              {/* Root */}
              <ModuleBox x={205} y={36} w={70} h={28} label="Root" sub="" color={ROOT} />
              {/* Sub */}
              {[0, 1].map((i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}>
                  <ModuleBox x={120 + i * 170} y={92} w={70} h={28}
                    label={`Sub${i + 1}`} sub="" color={CHUNK} />
                  <line x1={240} y1={64} x2={155 + i * 170} y2={92}
                    stroke={CHUNK} strokeWidth={1} />
                </motion.g>
              ))}
              {/* Leaves */}
              {[0, 1, 2, 3].map((i) => {
                const cx = 70 + i * 110;
                const subX = i < 2 ? 155 : 325;
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.04 }}>
                    <DataBox x={cx} y={150} w={64} h={28}
                      label={`C${i + 1}`} color={CHUNK} outlined />
                    <line x1={subX} y1={120} x2={cx + 32} y2={150}
                      stroke={CHUNK} strokeWidth={1} />
                  </motion.g>
                );
              })}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                루트 CID 하나로 전체 파일 검증 + parallel fetch
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={MOD}>
                Directory = dag-pb node (links 배열)
              </text>
              <ModuleBox x={180} y={36} w={120} h={32} label="/docs" sub="dag-pb dir" color={MOD} />
              {[
                { name: 'readme.md', cid: 'bafkXXX' },
                { name: 'tutorial', cid: 'bafkAAA' },
              ].map((d, i) => (
                <motion.g key={d.name}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}>
                  <ActionBox x={70} y={86 + i * 40} w={150} h={30}
                    label={d.name} sub={d.cid} color={CHUNK} />
                  <line x1={220} y1={101 + i * 40} x2={240} y2={68}
                    stroke={CHUNK} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
                </motion.g>
              ))}
              {[
                { name: 'intro.md', cid: 'bafkYYY' },
                { name: 'advanced.md', cid: 'bafkZZZ' },
              ].map((d, i) => (
                <motion.g key={d.name}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}>
                  <ActionBox x={260} y={86 + i * 40} w={150} h={30}
                    label={d.name} sub={d.cid} color={CHUNK} />
                  <line x1={260} y1={101 + i * 40} x2={240} y2={68}
                    stroke={CHUNK} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
                </motion.g>
              ))}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                각 link = (name, CID, size) — Filesystem 표현
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={HL}>
                advanced.md 변경 → 부모 chain CID 연쇄 갱신
              </text>
              {[
                { lvl: 1, label: 'advanced.md', sub: '새 CID' },
                { lvl: 2, label: 'tutorial/', sub: '새 CID' },
                { lvl: 3, label: '/docs (root)', sub: '새 CID' },
              ].map((s, i) => (
                <motion.g key={s.label}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}>
                  <ActionBox x={120} y={48 + i * 50} w={240} h={36}
                    label={s.label} sub={s.sub} color={HL} />
                  {i > 0 && (
                    <motion.path
                      d={`M 240 ${44 + i * 50} L 240 ${48 + i * 50}`}
                      stroke={HL} strokeWidth={1.5}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.15 - 0.05 }} />
                  )}
                </motion.g>
              ))}
              <text x={240} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                다른 파일 CID는 그대로 → 자동 dedup
              </text>
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Merkle DAG 시스템 비교
              </text>
              {/* Header */}
              <text x={70} y={50} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">시스템</text>
              <text x={185} y={50} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">해시</text>
              <text x={285} y={50} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">청크</text>
              <text x={380} y={50} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">특징</text>
              <line x1={60} y1={56} x2={460} y2={56} stroke="var(--border)" strokeWidth={0.5} />
              {COMPARE.map((c, i) => (
                <motion.g key={c.sys}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <text x={70} y={78 + i * 32} fontSize={9} fontWeight={600} fill={FILE}>{c.sys}</text>
                  <text x={185} y={78 + i * 32} fontSize={9} fill="var(--foreground)">{c.hash}</text>
                  <text x={285} y={78 + i * 32} fontSize={9} fill="var(--foreground)">{c.chunk}</text>
                  <text x={380} y={78 + i * 32} fontSize={9} fill="var(--muted-foreground)">{c.extra}</text>
                </motion.g>
              ))}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Git은 Merkle DAG의 초기 실용 사례 (blob / tree / commit)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
