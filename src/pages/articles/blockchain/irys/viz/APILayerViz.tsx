import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ENDPOINTS = [
  { method: 'GET', path: '/info', color: '#6366f1', desc: '노드 상태: 버전, 블록 높이, 피어 수, 동기화 상태' },
  { method: 'POST', path: '/tx', color: '#10b981', desc: '데이터 트랜잭션 제출. 서명 검증 + 멤풀 추가' },
  { method: 'POST', path: '/chunk', color: '#f59e0b', desc: '데이터 청크 제출. Merkle 증명 검증' },
  { method: 'GET', path: '/block/{tag}', color: '#8b5cf6', desc: '블록 조회. latest, 높이, 해시로 검색' },
  { method: 'GET', path: '/price/{l}/{s}', color: '#ec4899', desc: '데이터 저장 가격. permFee + termFee' },
];

export default function APILayerViz() {
  const [active, setActive] = useState<number | null>(null);
  const sel = active !== null ? ENDPOINTS[active] : null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-mono text-foreground/50">Irys REST API 엔드포인트</p>
      <div className="flex flex-wrap gap-2">
        {ENDPOINTS.map((ep, i) => (
          <motion.button key={i} whileHover={{ scale: 1.04 }}
            onClick={() => setActive(active === i ? null : i)}
            className="rounded-lg border px-3 py-2 text-xs font-mono font-bold transition-all"
            style={{ borderColor: active===i ? ep.color : ep.color+'30',
              background: active===i ? ep.color+'18' : ep.color+'06', color: ep.color }}>
            <span className="opacity-60">{ep.method}</span> {ep.path}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={active} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-4 }} className="rounded-lg border p-3 text-sm text-foreground/80"
            style={{ borderColor: sel.color+'30', background: sel.color+'08' }}>
            {sel.desc}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
