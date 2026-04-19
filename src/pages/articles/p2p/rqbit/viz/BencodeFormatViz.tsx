import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Bencode 4가지 타입: i/string/l/d' },
  { label: '.torrent 구조: announce + info dict' },
  { label: 'InfoHash 계산: SHA-1 of info dict' },
  { label: 'Magnet Link: InfoHash 만으로 metadata 획득' },
];

const TYPES = [
  { label: 'Integer', sub: 'i42e', color: '#6366f1' },
  { label: 'String', sub: '4:spam', color: '#3b82f6' },
  { label: 'List', sub: 'l...e', color: '#10b981' },
  { label: 'Dict', sub: 'd...e', color: '#f59e0b' },
];

const TORRENT_FIELDS = [
  { label: 'announce', sub: 'tracker URL', color: '#6366f1' },
  { label: 'announce-list', sub: 'multi tracker', color: '#3b82f6' },
  { label: 'created by', sub: 'client name', color: '#10b981' },
  { label: 'creation date', sub: 'timestamp', color: '#14b8a6' },
];

const INFO_FIELDS = [
  { label: 'name', sub: 'torrent name', color: '#f59e0b' },
  { label: 'piece length', sub: 'chunk size', color: '#ec4899' },
  { label: 'pieces', sub: 'SHA-1 hashes', color: '#8b5cf6' },
  { label: 'files', sub: 'multi-file list', color: '#f97316' },
];

export default function BencodeFormatViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && TYPES.map((t, i) => (
            <motion.g key={t.label} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}>
              <DataBox x={30 + i * 110} y={70} w={100} h={70} label={t.label} sub={t.sub}
                color={t.color} outlined />
            </motion.g>
          ))}

          {step === 1 && (
            <>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                  .torrent (top-level dict)
                </text>
              </motion.g>
              {TORRENT_FIELDS.map((f, i) => (
                <motion.g key={f.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <ActionBox x={20} y={32 + i * 38} w={200} h={32} label={f.label} sub={f.sub} color={f.color} />
                </motion.g>
              ))}
              <motion.text x={350} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                info dict
              </motion.text>
              {INFO_FIELDS.map((f, i) => (
                <motion.g key={f.label} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}>
                  <ActionBox x={250} y={32 + i * 38} w={200} h={32} label={f.label} sub={f.sub} color={f.color} />
                </motion.g>
              ))}
            </>
          )}

          {step === 2 && (
            <>
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                <DataBox x={20} y={80} w={120} h={50} label="info dict" sub="bencoded bytes" color="#f59e0b" outlined />
              </motion.g>
              <motion.line x1={145} y1={105} x2={195} y2={105} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#arr)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
              <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}>
                <ActionBox x={200} y={80} w={100} h={50} label="SHA-1" sub="hash function" color="#10b981" />
              </motion.g>
              <motion.line x1={305} y1={105} x2={355} y2={105} stroke="#6366f1" strokeWidth={1.5} markerEnd="url(#arr)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
              <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}>
                <DataBox x={360} y={80} w={100} h={50} label="InfoHash" sub="20 bytes" color="#6366f1" outlined />
              </motion.g>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                토렌트 고유 ID, magnet link의 btih 파라미터
              </text>
              <defs>
                <marker id="arr" markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="var(--muted-foreground)" />
                </marker>
              </defs>
            </>
          )}

          {step === 3 && (
            <>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DataBox x={150} y={20} w={180} h={36} label="magnet:?xt=urn:btih:..." color="#6366f1" outlined />
              </motion.g>
              {[
                { label: 'DHT lookup', sub: 'find peers', color: '#3b82f6', y: 80 },
                { label: 'BEP-9 fetch', sub: 'metadata from peer', color: '#10b981', y: 122 },
                { label: 'Download', sub: 'pieces by infohash', color: '#f59e0b', y: 164 },
              ].map((s, i) => (
                <motion.g key={s.label} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}>
                  <line x1={240} y1={56} x2={240} y2={s.y} stroke={s.color} strokeWidth={0.6}
                    strokeDasharray="3 2" opacity={0.5} />
                  <ActionBox x={140} y={s.y} w={200} h={32} label={s.label} sub={s.sub} color={s.color} />
                </motion.g>
              ))}
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
