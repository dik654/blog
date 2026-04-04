import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MECHS = [
  {
    id: 'mdns', name: 'mDNS', color: '#10b981', scope: 'LAN',
    steps: ['멀티캐스트 질의 전송', 'LAN 피어 응답', 'PeerId + Multiaddr 수신'],
  },
  {
    id: 'kad', name: 'Kademlia DHT', color: '#6366f1', scope: 'WAN',
    steps: ['부트스트랩 노드 연결', 'FIND_NODE(self)', '라우팅 테이블 채우기', '주기적 랜덤 조회'],
  },
  {
    id: 'rendezvous', name: 'Rendezvous', color: '#f59e0b', scope: 'WAN',
    steps: ['서버에 네임스페이스 등록', '네임스페이스 질의', '피어 목록 수신'],
  },
  {
    id: 'bootstrap', name: 'Bootstrap', color: '#8b5cf6', scope: 'Init',
    steps: ['하드코딩 노드 목록', '초기 연결 수립', 'DHT로 전환'],
  },
];

export default function DiscoveryMechanismViz() {
  const [active, setActive] = useState<string | null>(null);
  const sel = MECHS.find(m => m.id === active);

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <p className="text-xs font-mono text-foreground/50">피어 발견 메커니즘 비교</p>

      <div className="grid grid-cols-2 gap-2">
        {MECHS.map(m => (
          <motion.button key={m.id} whileHover={{ scale: 1.02 }}
            onClick={() => setActive(active === m.id ? null : m.id)}
            className="rounded-lg border px-3 py-2.5 text-left transition-all cursor-pointer"
            style={{
              borderColor: active === m.id ? m.color : m.color + '25',
              background: active === m.id ? m.color + '12' : m.color + '04',
            }}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold" style={{ color: m.color }}>
                {m.name}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded border ml-auto"
                style={{ borderColor: m.color + '40', color: m.color }}>
                {m.scope}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-lg border p-3 space-y-1.5"
            style={{ borderColor: sel.color + '30', background: sel.color + '06' }}>
            {sel.steps.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2 text-xs">
                <span className="text-[10px] font-mono text-foreground/30 w-3">{i + 1}</span>
                <span className="text-foreground/70">{s}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
