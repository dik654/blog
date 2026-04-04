import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MIDDLEWARE_STACK, GETH_VS_RETH_RPC } from './MiddlewareData';

export default function Middleware() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const sel = MIDDLEWARE_STACK.find(m => m.id === activeLayer);

  return (
    <section id="middleware" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">미들웨어 & Rate Limiting</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          Reth RPC 서버는 <strong>tower 미들웨어</strong> 스택으로 요청을 처리한다.
          tower는 <code>Service</code> trait을 중심으로 미들웨어를 체인하는 Rust 표준 패턴이다.
          hyper, axum, tonic 등 Rust 웹 생태계 전반에서 동일한 패턴을 사용한다.
        </p>
        <p>
          각 미들웨어는 독립적인 레이어로 동작하며, 요청이 바깥 → 안쪽 순서로 통과한다.<br />
          아래 카드를 클릭하면 각 미들웨어의 역할을 확인할 수 있다.
        </p>
      </div>

      {/* Middleware stack cards */}
      <div className="not-prose space-y-2 mb-4">
        {MIDDLEWARE_STACK.map(m => (
          <button key={m.id}
            onClick={() => setActiveLayer(activeLayer === m.id ? null : m.id)}
            className="w-full text-left rounded-lg border p-3 transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeLayer === m.id ? m.color : 'var(--color-border)',
              background: activeLayer === m.id ? `${m.color}10` : undefined,
            }}>
            <div className="flex gap-3 items-center">
              <span className="font-mono text-xs font-bold shrink-0" style={{ color: m.color }}>{m.name}</span>
              <span className="text-xs text-foreground/50">{m.target}</span>
            </div>
            <AnimatePresence>
              {activeLayer === m.id && sel && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}
                  className="text-sm text-foreground/70 mt-2">{sel.desc}</motion.p>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      {/* Geth vs Reth comparison */}
      <h3 className="text-lg font-semibold mb-3">Geth vs Reth RPC 비교</h3>
      <div className="not-prose overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-border">
          <thead><tr className="bg-muted">
            <th className="border border-border px-4 py-2 text-left">항목</th>
            <th className="border border-border px-4 py-2 text-left">Geth</th>
            <th className="border border-border px-4 py-2 text-left">Reth</th>
          </tr></thead>
          <tbody>
            {GETH_VS_RETH_RPC.map(r => (
              <tr key={r.aspect}>
                <td className="border border-border px-4 py-2 font-medium">{r.aspect}</td>
                <td className="border border-border px-4 py-2">{r.geth}</td>
                <td className="border border-border px-4 py-2">{r.reth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>tower 미들웨어 = 조합 가능한 빌딩 블록</strong> — 새 미들웨어 추가는 <code>.layer()</code> 한 줄.
          운영 환경에서는 Rate Limiting 임계값을 조정하거나, 커스텀 인증 레이어를 추가할 수 있다.
        </p>
      </div>
    </section>
  );
}
