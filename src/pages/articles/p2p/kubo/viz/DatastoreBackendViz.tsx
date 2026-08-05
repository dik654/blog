import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Flatfs: 파일시스템 직접 사용 (block당 1 file)' },
  { label: 'Badger: LSM-tree key-value (GC 필요)' },
  { label: 'LevelDB: Google LSM-tree (검증된 안정성)' },
  { label: 'Mount: 여러 backend 조합 (/blocks /pins /datastore)' },
  { label: 'Profile 시스템 5종' },
  { label: '실무 권장: 노드 크기별 backend 선택' },
];

const FLATFS_PROS = [
  { label: 'OS FS 직접', sub: '간단, 이식성', color: '#10b981' },
  { label: '1:1 매핑', sub: '디버깅 쉬움', color: '#3b82f6' },
];
const FLATFS_CONS = [
  { label: 'inode 소비', sub: '작은 파일 多', color: '#ef4444' },
  { label: '디스크 오버헤드', sub: 'block size', color: '#f59e0b' },
];

const BADGER = [
  { label: 'Fast write', sub: 'LSM 구조', color: '#10b981' },
  { label: 'Compression', sub: '내장', color: '#3b82f6' },
  { label: 'Small metadata', sub: '효율', color: '#6366f1' },
  { label: 'GC 필요', sub: '주기적', color: '#f59e0b' },
  { label: 'Corruption 위험', sub: '잦은 crash', color: '#ef4444' },
];

const LEVELDB = [
  { label: '검증된 안정성', sub: 'Google 검증', color: '#10b981' },
  { label: '예측 가능 성능', sub: 'consistent', color: '#3b82f6' },
  { label: 'Badger보다 느림', sub: 'tradeoff', color: '#f59e0b' },
  { label: 'Write amplification', sub: '단점', color: '#ef4444' },
];

const MOUNT = [
  { label: '/blocks → Flatfs', color: '#10b981' },
  { label: '/pins → LevelDB', color: '#3b82f6' },
  { label: '/datastore → Badger', color: '#6366f1' },
];

const PROFILES = [
  { label: 'server', sub: '고가용 서버', color: '#6366f1' },
  { label: 'lowpower', sub: 'IoT/모바일', color: '#10b981' },
  { label: 'local-discovery', sub: 'mDNS 활성', color: '#3b82f6' },
  { label: 'flatfs', sub: 'Flatfs backend', color: '#f59e0b' },
  { label: 'badgerds', sub: 'Badger backend', color: '#ec4899' },
];

const RECOMMEND = [
  { label: 'Small (<10GB)', sub: 'Flatfs + local-discovery', color: '#10b981' },
  { label: 'Medium (10-100GB)', sub: 'Badger + server', color: '#3b82f6' },
  { label: 'Large (>100GB)', sub: 'Custom Mount: SSD hot / HDD cold', color: '#f59e0b' },
];

export default function DatastoreBackendViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
                Flatfs (flat filesystem)
              </text>
              <text x={240} y={32} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                /datastore/AB/CDEF.data (hash-sharded)
              </text>
              <text x={120} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">장점</text>
              <text x={360} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">단점</text>
              {FLATFS_PROS.map((p, i) => (
                <motion.g key={p.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <DataBox x={20} y={60 + i * 60} w={200} h={50} label={p.label} sub={p.sub} color={p.color} outlined />
                </motion.g>
              ))}
              {FLATFS_CONS.map((c, i) => (
                <motion.g key={c.label} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}>
                  <DataBox x={260} y={60 + i * 60} w={200} h={50} label={c.label} sub={c.sub} color={c.color} outlined />
                </motion.g>
              ))}
            </>
          )}

          {step === 1 && BADGER.map((b, i) => (
            <motion.g key={b.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}>
              <DataBox x={20 + (i % 3) * 150} y={30 + Math.floor(i / 3) * 90}
                w={140} h={70} label={b.label} sub={b.sub} color={b.color} outlined />
            </motion.g>
          ))}

          {step === 2 && LEVELDB.map((l, i) => (
            <motion.g key={l.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}>
              <DataBox x={30 + (i % 2) * 220} y={40 + Math.floor(i / 2) * 80}
                w={200} h={60} label={l.label} sub={l.sub} color={l.color} outlined />
            </motion.g>
          ))}

          {step === 3 && (
            <>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                Mount = path별 backend 조합
              </text>
              {MOUNT.map((m, i) => (
                <motion.g key={m.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <ActionBox x={50} y={50 + i * 50} w={380} h={40} label={m.label} color={m.color} />
                </motion.g>
              ))}
            </>
          )}

          {step === 4 && PROFILES.map((p, i) => (
            <motion.g key={p.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>
              <DataBox x={20 + (i % 3) * 150} y={30 + Math.floor(i / 3) * 90}
                w={140} h={70} label={p.label} sub={p.sub} color={p.color} outlined />
            </motion.g>
          ))}

          {step === 5 && RECOMMEND.map((r, i) => (
            <motion.g key={r.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}>
              <ModuleBox x={50} y={20 + i * 65} w={380} h={55} label={r.label} sub={r.sub} color={r.color} />
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
