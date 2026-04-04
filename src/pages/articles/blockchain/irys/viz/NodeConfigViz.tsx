import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = [
  { name: 'mode', color: '#6366f1', desc: 'Genesis(새 네트워크), PeerSync(일반), TrustedPeerSync(신뢰 피어)' },
  { name: 'gossip', color: '#10b981', desc: 'P2P 가십 네트워크. public_ip, public_port, bind 설정' },
  { name: 'http', color: '#f59e0b', desc: 'REST API 서버. 기본 포트 8080. CORS 설정 지원' },
  { name: 'packing', color: '#8b5cf6', desc: 'CPU/GPU 패킹. 동시성, 배치 크기 튜닝' },
  { name: 'storage', color: '#ec4899', desc: '디스크 동기화 & 서브모듈 경로 (최소 3개)' },
  { name: 'consensus', color: '#14b8a6', desc: 'Testnet/Testing/Custom. chain_id, chunk_size 등' },
];

export default function NodeConfigViz() {
  const [active, setActive] = useState<string | null>(null);
  const sel = SECTIONS.find(s => s.name === active);

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-mono text-foreground/50">config.toml 주요 섹션</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {SECTIONS.map(s => (
          <motion.button key={s.name} whileHover={{ scale: 1.03 }}
            onClick={() => setActive(active === s.name ? null : s.name)}
            className="rounded-lg border px-3 py-2 text-xs font-mono font-bold transition-all text-left"
            style={{ borderColor: active===s.name ? s.color : s.color+'30',
              background: active===s.name ? s.color+'18' : s.color+'06', color: s.color }}>
            [{s.name}]
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.name} initial={{ opacity:0,y:4 }} animate={{ opacity:1,y:0 }}
            exit={{ opacity:0,y:-4 }} className="rounded-lg border p-3 text-sm text-foreground/80"
            style={{ borderColor: sel.color+'30', background: sel.color+'08' }}>
            <span className="font-mono text-xs font-bold mr-2" style={{ color: sel.color }}>
              [{sel.name}]
            </span>
            {sel.desc}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
