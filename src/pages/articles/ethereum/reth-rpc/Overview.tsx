import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import RPCFlowViz from './viz/RPCFlowViz';
import type { CodeRef } from '@/components/code/types';
import { RPC_LAYERS } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = RPC_LAYERS.find(l => l.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RPC 서버 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          이더리움 노드의 RPC 서버는 두 가지 역할을 수행한다.<br />
          첫째, 외부 클라이언트(지갑, DApp)에 JSON-RPC API를 제공한다.<br />
          둘째, CL(Consensus Layer)과 Engine API로 통신하여 블록을 주고받는다.
        </p>
        <p className="leading-7">
          Reth는 이 두 API를 같은 서버 프레임워크(jsonrpsee + hyper)에서 처리하되, 포트와 인증을 분리한다.<br />
          tower 미들웨어 스택으로 요청을 계층적으로 처리하며, 각 계층은 독립적으로 교체 가능하다.
        </p>

        {/* ── RPC 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">RPC 서버 이중 구조 — 공개 API vs Engine API</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="text-xs font-bold text-blue-500 mb-2">Public RPC (사용자/DApp용)</p>
              <p className="text-sm text-foreground/80">포트: 8545(HTTP), 8546(WS), IPC. 인증 없음(공개).</p>
              <p className="text-sm text-foreground/70 mt-1">모듈: <code>eth</code>, <code>web3</code>, <code>net</code>, <code>debug</code>, <code>trace</code>, <code>txpool</code>, <code>admin</code></p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-xs font-bold text-red-400 mb-2">Engine API (CL용)</p>
              <p className="text-sm text-foreground/80">포트: 8551(HTTP, 고정). JWT 인증(32바이트 secret, HS256).</p>
              <p className="text-sm text-foreground/70 mt-1">모듈: <code>engine</code> — <code>newPayloadV3</code>, <code>forkchoiceUpdatedV3</code>, <code>getPayloadV3</code></p>
            </div>
          </div>
          <div className="rounded border border-border/40 bg-muted/20 p-3 text-sm text-foreground/60">
            분리 이유: 보안(Engine API = EL 제어 권한), 네트워크(별도 인터페이스 가능), rate limiting(공개 RPC는 엄격, Engine API는 무제한).
          </div>
        </div>
        <p className="leading-7">
          공개 RPC와 Engine API의 <strong>엄격한 분리</strong>.<br />
          Engine API는 EL 완전 제어 가능 → CL만 JWT 인증으로 접근.<br />
          공개 RPC 포트 노출과 Engine API 포트 격리 → 보안 계층화.
        </p>

        {/* ── jsonrpsee 프레임워크 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">jsonrpsee — Rust JSON-RPC 프레임워크</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">EthApi trait <span className="font-normal text-foreground/50">#[rpc(server, namespace = "eth")]</span></p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p><code>balance(address: Address, block: BlockId) -&gt; U256</code></p>
              <p><code>transaction_count(address: Address, block: BlockId) -&gt; U256</code></p>
              <p><code>call(req: CallRequest, block: BlockId) -&gt; Bytes</code></p>
              <p><code>new_heads() -&gt; SubscriptionResult</code> (WS subscription)</p>
              <p className="text-foreground/50">... 40+ 메서드</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="rounded border border-border/40 p-2 text-center text-xs"><p className="text-foreground/60">HTTP 핸들러</p></div>
            <div className="rounded border border-border/40 p-2 text-center text-xs"><p className="text-foreground/60">WS 핸들러</p></div>
            <div className="rounded border border-border/40 p-2 text-center text-xs"><p className="text-foreground/60">IPC 핸들러</p></div>
            <div className="rounded border border-border/40 p-2 text-center text-xs"><p className="text-foreground/60">OpenRPC 스키마</p></div>
            <div className="rounded border border-border/40 p-2 text-center text-xs"><p className="text-foreground/60">Client SDK</p></div>
          </div>
          <p className="text-sm text-foreground/60">매크로가 trait 정의에서 위 5가지를 자동 생성. 구현체는 <code>StateProvider</code> trait을 통해 상태 조회.</p>
        </div>
        <p className="leading-7">
          <code>jsonrpsee</code>의 <code>#[rpc]</code> 매크로가 <strong>trait → 서버 자동 생성</strong>.<br />
          메서드 시그니처만 정의하면 HTTP/WS/IPC 핸들러 모두 자동 구현.<br />
          타입 안전 JSON-RPC — 파라미터/반환 타입이 Rust 타입으로 컴파일 시 검증.
        </p>

        {/* ── tower 미들웨어 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">tower 미들웨어 스택 — 계층적 요청 처리</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">tower 미들웨어 스택 (요청 흐름 순서)</p>
          <div className="space-y-1 text-sm">
            <div className="flex gap-3 items-center border-l-2 border-blue-500/50 pl-3"><span className="font-mono text-xs text-blue-500 shrink-0 w-6">1</span><span className="text-foreground/80"><code>CorsLayer::permissive()</code> — CORS 검사</span></div>
            <div className="flex gap-3 items-center border-l-2 border-blue-500/50 pl-3"><span className="font-mono text-xs text-blue-500 shrink-0 w-6">2</span><span className="text-foreground/80"><code>RequestBodyLimitLayer</code> — 요청 크기 제한(5MB)</span></div>
            <div className="flex gap-3 items-center border-l-2 border-green-500/50 pl-3"><span className="font-mono text-xs text-green-500 shrink-0 w-6">3</span><span className="text-foreground/80"><code>RateLimitLayer</code> — per-IP 100 req/s</span></div>
            <div className="flex gap-3 items-center border-l-2 border-red-500/50 pl-3"><span className="font-mono text-xs text-red-400 shrink-0 w-6">4</span><span className="text-foreground/80"><code>AuthLayer</code> — JWT 검증(Engine API만)</span></div>
            <div className="flex gap-3 items-center border-l-2 border-purple-500/50 pl-3"><span className="font-mono text-xs text-purple-500 shrink-0 w-6">5</span><span className="text-foreground/80"><code>MetricsLayer</code> — 메트릭 수집</span></div>
            <div className="flex gap-3 items-center border-l-2 border-foreground/20 pl-3"><span className="font-mono text-xs text-foreground/50 shrink-0 w-6">6</span><span className="text-foreground/80"><code>TraceLayer</code> — 요청 로깅</span></div>
          </div>
          <p className="text-sm text-foreground/60 mt-2">각 layer는 독립적 <code>Service</code> trait 구현 → 순서 변경/추가/제거 자유.</p>
        </div>
        <p className="leading-7">
          <strong>tower Service 생태계</strong>를 그대로 활용 — hyper 기반 Rust 서버의 공통 패턴.<br />
          각 middleware가 <code>Service</code> trait만 구현 → 합성 자유.<br />
          CORS, rate limit, 인증, 메트릭, 로깅 등이 모두 독립 계층.
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {RPC_LAYERS.map(l => (
          <button key={l.id}
            onClick={() => setSelected(selected === l.id ? null : l.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === l.id ? l.color : 'var(--color-border)',
              background: selected === l.id ? `${l.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: l.color }}>{l.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{l.role}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{sel.details}</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">{sel.why}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-6"><RPCFlowViz /></div>
    </section>
  );
}
