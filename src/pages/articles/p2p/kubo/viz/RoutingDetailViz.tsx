import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '3가지 라우터: DHT / HTTP delegated / Bitswap opportunistic' },
  { label: 'Composer 병렬 전략: 동시 query, 첫 응답 채택' },
  { label: 'DHT operations: ADD_PROVIDER + FIND_PROVIDERS' },
  { label: 'Provider Records: (CID, PeerID, expiration), 12h republish' },
  { label: 'IPNI: cid.contact 중앙화 인덱서, AWS Neptune' },
  { label: 'Latency 비교 + Reprovide 전략 + Routing.Type 옵션' },
];

const ROUTERS = [
  { label: 'DHT (Kademlia)', sub: '분산, 수십초, scalable', color: '#6366f1' },
  { label: 'HTTP Delegated', sub: '중앙화, 수ms, IPNI', color: '#3b82f6' },
  { label: 'Bitswap opportunistic', sub: '연결 peer만, 50-200ms', color: '#10b981' },
];

const DHT_OPS = [
  { label: 'ADD_PROVIDER', sub: '12h마다 republish', color: '#10b981' },
  { label: 'FIND_PROVIDERS', sub: 'iterative Kademlia lookup', color: '#3b82f6' },
];

const PR_FIELDS = [
  { label: 'CID', sub: 'content identifier', color: '#6366f1' },
  { label: 'PeerID', sub: '제공자 ID', color: '#3b82f6' },
  { label: 'Expiration', sub: 'TTL 24h', color: '#f59e0b' },
  { label: 'Signed', sub: '제공자 서명', color: '#10b981' },
];

const LATENCY = [
  { label: 'DHT', sub: '5-30초', color: '#ef4444', progress: 1 },
  { label: 'HTTP delegated', sub: '50-500ms', color: '#10b981', progress: 0.05 },
  { label: 'Bitswap', sub: '50-200ms', color: '#3b82f6', progress: 0.02 },
];

const REPROVIDE = [
  { label: 'all', sub: '모든 CID', color: '#ef4444' },
  { label: 'pinned', sub: 'pinned만', color: '#3b82f6' },
  { label: 'roots', sub: 'root만 (fast)', color: '#10b981' },
];

const ROUTING_TYPES = [
  'dht', 'dhtclient', 'dhtserver', 'delegated', 'auto', 'autoclient',
];

export default function RoutingDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && ROUTERS.map((r, i) => (
            <motion.g key={r.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}>
              <ModuleBox x={50} y={30 + i * 60} w={380} h={48} label={r.label} sub={r.sub} color={r.color} />
            </motion.g>
          ))}

          {step === 1 && (
            <>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DataBox x={180} y={20} w={120} h={36} label="Composer" sub="parallel" color="#6366f1" outlined />
              </motion.g>
              {[
                { label: 'DHT', color: '#6366f1', x: 30 },
                { label: 'HTTP', color: '#3b82f6', x: 180 },
                { label: 'Bitswap', color: '#10b981', x: 330 },
              ].map((r, i) => (
                <motion.g key={r.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}>
                  <line x1={240} y1={56} x2={r.x + 60} y2={100} stroke={r.color} strokeWidth={1}
                    strokeDasharray="3 2" opacity={0.5} />
                  <ActionBox x={r.x} y={100} w={120} h={50} label={r.label} sub="동시 query" color={r.color} />
                </motion.g>
              ))}
              <motion.text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                첫 응답 → 사용 / 최소 latency
              </motion.text>
            </>
          )}

          {step === 2 && DHT_OPS.map((d, i) => (
            <motion.g key={d.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}>
              <ModuleBox x={50} y={50 + i * 80} w={380} h={60} label={d.label} sub={d.sub} color={d.color} />
            </motion.g>
          ))}

          {step === 3 && PR_FIELDS.map((f, i) => (
            <motion.g key={f.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}>
              <DataBox x={30 + (i % 2) * 220} y={40 + Math.floor(i / 2) * 80}
                w={200} h={60} label={f.label} sub={f.sub} color={f.color} outlined />
            </motion.g>
          ))}

          {step === 4 && (
            <>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                IPNI (InterPlanetary Network Indexer)
              </text>
              {[
                { label: 'cid.contact', sub: '가장 큰 인덱서', color: '#6366f1' },
                { label: 'AWS Neptune', sub: 'graph DB 기반', color: '#f59e0b' },
                { label: 'Filecoin 통합', sub: '대규모 dataset', color: '#10b981' },
                { label: '/routing/v1/providers/{cid}', sub: 'RFC 9 draft', color: '#3b82f6' },
              ].map((b, i) => (
                <motion.g key={b.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <DataBox x={30 + (i % 2) * 220} y={40 + Math.floor(i / 2) * 80}
                    w={200} h={60} label={b.label} sub={b.sub} color={b.color} outlined />
                </motion.g>
              ))}
            </>
          )}

          {step === 5 && (
            <>
              {LATENCY.map((l, i) => (
                <motion.g key={l.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <text x={20} y={28 + i * 18} fontSize={9} fontWeight={600} fill={l.color}>{l.label}</text>
                  <text x={140} y={28 + i * 18} fontSize={8} fill="var(--muted-foreground)">{l.sub}</text>
                </motion.g>
              ))}
              <motion.text x={240} y={95} textAnchor="middle" fontSize={9} fontWeight={700} fill="#6366f1"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                Reprovide strategy
              </motion.text>
              {REPROVIDE.map((r, i) => (
                <motion.g key={r.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}>
                  <DataBox x={20 + i * 155} y={105} w={140} h={50} label={r.label} sub={r.sub} color={r.color} outlined />
                </motion.g>
              ))}
              <motion.text x={240} y={175} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                Routing.Type:
              </motion.text>
              <motion.text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
                {ROUTING_TYPES.join(' | ')}
              </motion.text>
              <motion.text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                권장 default: "auto" (DHT + HTTP delegated)
              </motion.text>
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
