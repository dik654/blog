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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// RPC 이중 서버 구성
//
// Public RPC (사용자/DApp용):
// - 포트: 8545 (HTTP), 8546 (WebSocket), /var/reth.ipc (IPC)
// - 인증: 없음 (공개)
// - 모듈: eth, web3, net, debug, trace, txpool, admin
// - 요청: eth_getBalance, eth_call, eth_sendTransaction 등

// Engine API (CL용):
// - 포트: 8551 (HTTP) — 고정
// - 인증: JWT (공유 비밀 기반, 32바이트)
// - 모듈: engine
// - 요청: engine_newPayloadV3, engine_forkchoiceUpdatedV3, engine_getPayloadV3

// 왜 분리?
// 1. 보안: Engine API는 EL 제어 권한 → CL만 접근 가능
// 2. 네트워크: 다른 네트워크 인터페이스로 노출 가능
// 3. Rate limiting: 공개 RPC는 엄격, Engine API는 제한 없음

// JWT 인증 (RFC 7519):
// - CL과 EL이 공유하는 32바이트 secret
// - 매 요청마다 HS256 서명된 JWT 토큰 포함
// - 서명 검증 실패 시 401 반환`}
        </pre>
        <p className="leading-7">
          공개 RPC와 Engine API의 <strong>엄격한 분리</strong>.<br />
          Engine API는 EL 완전 제어 가능 → CL만 JWT 인증으로 접근.<br />
          공개 RPC 포트 노출과 Engine API 포트 격리 → 보안 계층화.
        </p>

        {/* ── jsonrpsee 프레임워크 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">jsonrpsee — Rust JSON-RPC 프레임워크</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// RPC trait 정의 (jsonrpsee 매크로)
#[rpc(server, namespace = "eth")]
pub trait EthApi {
    #[method(name = "getBalance")]
    async fn balance(&self, address: Address, block: BlockId) -> RpcResult<U256>;

    #[method(name = "getTransactionCount")]
    async fn transaction_count(&self, address: Address, block: BlockId) -> RpcResult<U256>;

    #[method(name = "call")]
    async fn call(&self, req: CallRequest, block: BlockId) -> RpcResult<Bytes>;

    #[subscription(name = "newHeads", item = Header)]
    async fn new_heads(&self) -> SubscriptionResult;

    // ... 40+ 메서드
}

// 구현체:
impl<P: StateProvider> EthApiServer for EthApi<P> {
    async fn balance(&self, addr: Address, block: BlockId) -> RpcResult<U256> {
        let provider = self.state_at(block)?;
        let account = provider.account(&addr)?.unwrap_or_default();
        Ok(account.balance)
    }
    // ...
}

// 자동 생성되는 것:
// - HTTP 핸들러 (JSON-RPC 파싱)
// - WebSocket 핸들러 (subscription 지원)
// - IPC 핸들러 (Unix socket)
// - OpenRPC 스키마
// - 클라이언트 SDK (별도 crate)`}
        </pre>
        <p className="leading-7">
          <code>jsonrpsee</code>의 <code>#[rpc]</code> 매크로가 <strong>trait → 서버 자동 생성</strong>.<br />
          메서드 시그니처만 정의하면 HTTP/WS/IPC 핸들러 모두 자동 구현.<br />
          타입 안전 JSON-RPC — 파라미터/반환 타입이 Rust 타입으로 컴파일 시 검증.
        </p>

        {/* ── tower 미들웨어 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">tower 미들웨어 스택 — 계층적 요청 처리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// tower Service trait 기반 미들웨어
let server = ServerBuilder::default()
    .set_http_middleware(
        tower::ServiceBuilder::new()
            // 1. CORS (가장 바깥)
            .layer(CorsLayer::permissive())
            // 2. 요청 크기 제한 (5MB)
            .layer(RequestBodyLimitLayer::new(5 * 1024 * 1024))
            // 3. Rate limiting (per-IP)
            .layer(RateLimitLayer::new(100, Duration::from_secs(1)))
            // 4. 인증 (JWT for Engine API)
            .layer(AuthLayer::new(jwt_secret))
            // 5. 메트릭 수집
            .layer(MetricsLayer::new(registry))
            // 6. 요청 로깅
            .layer(TraceLayer::new_for_http())
    )
    .build(addr)
    .await?;

// 요청 흐름:
// HTTP Request
//   → CORS 검사
//   → 크기 제한 검사
//   → Rate limit (거부 or 통과)
//   → JWT 검증 (Engine API만)
//   → 메트릭 시작
//   → 로깅 시작
//   → JSON-RPC 파싱
//   → handler 실행 (예: eth_getBalance)
//   → 응답 생성
//   → 로깅 종료
//   → 메트릭 종료
//   → 응답 반환

// 각 layer는 독립적 → 순서 변경/추가/제거 자유`}
        </pre>
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
