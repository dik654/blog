import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '설계 목표 4가지: 성능·메모리·모듈성·이식성' },
  { label: '14개 크레이트 워크스페이스 분류' },
  { label: '핵심 기술 스택: tokio + DashMap + serde + axum' },
  { label: '지원 BEP: DHT, 메타데이터, PEX, LSD, WebSeeds' },
];

const GOALS = [
  { label: 'High perf', sub: 'async Rust', color: '#6366f1' },
  { label: 'Memory eff', sub: 'zero-copy', color: '#10b981' },
  { label: 'Modular', sub: '14 crates', color: '#3b82f6' },
  { label: 'Cross-plat', sub: 'CLI/UI/Srv', color: '#f59e0b' },
];

const CRATES = [
  { group: 'Core', items: ['librqbit', 'librqbit_core', 'buffers'], color: '#6366f1' },
  { group: 'Network', items: ['dht', 'peer_proto', 'tracker', 'upnp'], color: '#3b82f6' },
  { group: 'Protocol', items: ['bencode', 'sha1w'], color: '#10b981' },
  { group: 'UI/API', items: ['rqbit', 'desktop', 'upnp-serve', 'editor-webui'], color: '#f59e0b' },
];

const STACK = [
  { label: 'tokio', sub: 'async runtime', color: '#6366f1' },
  { label: 'DashMap', sub: 'lock-free map', color: '#10b981' },
  { label: 'serde', sub: 'serialization', color: '#3b82f6' },
  { label: 'axum', sub: 'HTTP API', color: '#f59e0b' },
  { label: 'tauri', sub: 'desktop', color: '#ec4899' },
  { label: 'anyhow', sub: 'errors', color: '#8b5cf6' },
];

const BEPS = [
  { label: 'BEP-3', sub: 'Core', color: '#6366f1' },
  { label: 'BEP-5', sub: 'DHT', color: '#3b82f6' },
  { label: 'BEP-9', sub: 'Metadata', color: '#10b981' },
  { label: 'BEP-10', sub: 'Extension', color: '#f59e0b' },
  { label: 'BEP-11', sub: 'PEX', color: '#ec4899' },
  { label: 'BEP-14', sub: 'LSD', color: '#8b5cf6' },
  { label: 'BEP-15', sub: 'UDP track', color: '#14b8a6' },
  { label: 'BEP-19', sub: 'WebSeeds', color: '#f97316' },
];

export default function RqbitArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && GOALS.map((g, i) => (
            <motion.g key={g.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>
              <ModuleBox x={30 + (i % 2) * 220} y={40 + Math.floor(i / 2) * 80}
                w={200} h={60} label={g.label} sub={g.sub} color={g.color} />
            </motion.g>
          ))}

          {step === 1 && CRATES.map((c, gi) => (
            <motion.g key={c.group} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: gi * 0.08 }}>
              <text x={20} y={30 + gi * 48} fontSize={10} fontWeight={700} fill={c.color}>{c.group}</text>
              {c.items.map((it, i) => (
                <DataBox key={it} x={80 + i * 95} y={20 + gi * 48} w={88} h={26}
                  label={it} color={c.color} outlined />
              ))}
            </motion.g>
          ))}

          {step === 2 && STACK.map((s, i) => (
            <motion.g key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}>
              <ActionBox x={20 + (i % 3) * 150} y={30 + Math.floor(i / 3) * 80}
                w={140} h={60} label={s.label} sub={s.sub} color={s.color} />
            </motion.g>
          ))}

          {step === 3 && BEPS.map((b, i) => (
            <motion.g key={b.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <DataBox x={20 + (i % 4) * 110} y={30 + Math.floor(i / 4) * 80}
                w={100} h={56} label={b.label} sub={b.sub} color={b.color} outlined />
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
