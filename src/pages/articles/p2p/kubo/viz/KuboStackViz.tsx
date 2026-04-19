import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '7계층 스택: Application → Network' },
  { label: '예시 흐름: ipfs add file.txt' },
  { label: '예시 흐름: ipfs cat <CID>' },
  { label: '버전 변천: go-ipfs → Kubo → Helia' },
  { label: '경쟁 구현 비교: Helia / iroh / rust-ipfs / IPFS Cluster' },
];

const LAYERS = [
  { label: 'Application', sub: 'Gateway / CLI / gRPC', color: '#ec4899', y: 18 },
  { label: 'Coordination', sub: 'PubSub / Bitswap / Graphsync', color: '#f59e0b', y: 48 },
  { label: 'Content', sub: 'UnixFS / IPLD / CID / DAG', color: '#10b981', y: 78 },
  { label: 'Storage', sub: 'Blockstore / Datastore / Flatfs+Badger', color: '#3b82f6', y: 108 },
  { label: 'Routing', sub: 'Kademlia DHT / DNS / mDNS', color: '#6366f1', y: 138 },
  { label: 'Network', sub: 'libp2p / TCP+QUIC / Noise+TLS', color: '#8b5cf6', y: 168 },
];

const ADD_FLOW = [
  { label: 'UnixFS', sub: 'file → chunks → DAG', color: '#10b981' },
  { label: 'IPLD', sub: 'chunks → CID tree', color: '#3b82f6' },
  { label: 'Blockstore', sub: 'persist blocks', color: '#6366f1' },
  { label: 'DHT', sub: 'announce providers', color: '#f59e0b' },
];

const CAT_FLOW = [
  { label: 'DHT lookup', sub: 'find providers', color: '#f59e0b' },
  { label: 'Bitswap', sub: 'fetch blocks', color: '#ec4899' },
  { label: 'Blockstore', sub: 'cache + verify', color: '#6366f1' },
  { label: 'UnixFS', sub: 'reconstruct', color: '#10b981' },
];

const VERSIONS = [
  { label: 'go-ipfs', sub: 'original (~2014)', color: '#94a3b8' },
  { label: 'Kubo', sub: '0.14+ rename (2022)', color: '#10b981' },
  { label: 'Helia', sub: 'JS replacement (2023+)', color: '#3b82f6' },
];

const COMPETITORS = [
  { label: 'Helia', sub: 'JavaScript', color: '#3b82f6' },
  { label: 'iroh', sub: 'Rust, simpler', color: '#f59e0b' },
  { label: 'rust-ipfs', sub: 'legacy', color: '#94a3b8' },
  { label: 'java-ipfs', sub: 'HTTP client', color: '#ec4899' },
  { label: 'IPFS Cluster', sub: 'orchestration', color: '#8b5cf6' },
];

export default function KuboStackViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && LAYERS.map((l, i) => (
            <motion.g key={l.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}>
              <ModuleBox x={50} y={l.y} w={380} h={26} label={l.label} sub={l.sub} color={l.color} />
            </motion.g>
          ))}

          {step === 1 && (
            <>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DataBox x={140} y={15} w={200} h={30} label='User: ipfs add file.txt' color="#6366f1" outlined />
              </motion.g>
              {ADD_FLOW.map((f, i) => (
                <motion.g key={f.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}>
                  <ActionBox x={40} y={60 + i * 38} w={400} h={32} label={f.label} sub={f.sub} color={f.color} />
                </motion.g>
              ))}
            </>
          )}

          {step === 2 && (
            <>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DataBox x={140} y={15} w={200} h={30} label='User: ipfs cat <CID>' color="#6366f1" outlined />
              </motion.g>
              {CAT_FLOW.map((f, i) => (
                <motion.g key={f.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}>
                  <ActionBox x={40} y={60 + i * 38} w={400} h={32} label={f.label} sub={f.sub} color={f.color} />
                </motion.g>
              ))}
            </>
          )}

          {step === 3 && VERSIONS.map((v, i) => (
            <motion.g key={v.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12 }}>
              <ModuleBox x={20 + i * 155} y={70} w={140} h={80} label={v.label} sub={v.sub} color={v.color} />
            </motion.g>
          ))}

          {step === 4 && COMPETITORS.map((c, i) => (
            <motion.g key={c.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>
              <DataBox x={20 + (i % 3) * 150} y={30 + Math.floor(i / 3) * 90}
                w={140} h={70} label={c.label} sub={c.sub} color={c.color} outlined />
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
