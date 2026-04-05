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
        <p className="leading-7">
          Reth RPC 서버는 <strong>tower 미들웨어</strong> 스택으로 요청을 처리한다.<br />
          tower는 <code>Service</code> trait을 중심으로 미들웨어를 체인하는 Rust 표준 패턴이다.<br />
          hyper, axum, tonic 등 Rust 웹 생태계 전반에서 동일한 패턴을 사용한다.
        </p>
        <p className="leading-7">
          각 미들웨어는 독립적인 레이어로 동작하며, 요청이 바깥 → 안쪽 순서로 통과한다.<br />
          아래 카드를 클릭하면 각 미들웨어의 역할을 확인할 수 있다.
        </p>

        {/* ── Service trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">tower::Service trait — 조합 가능한 비동기 서비스</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// tower::Service — 모든 미들웨어의 공통 인터페이스
pub trait Service<Request> {
    type Response;
    type Error;
    type Future: Future<Output = Result<Self::Response, Self::Error>>;

    /// 서비스가 요청 처리 준비됐는지 확인 (backpressure)
    fn poll_ready(&mut self, cx: &mut Context<'_>)
        -> Poll<Result<(), Self::Error>>;

    /// 요청 처리 시작 → Future 반환
    fn call(&mut self, req: Request) -> Self::Future;
}

// Layer trait — Service를 감싸는 미들웨어
pub trait Layer<S> {
    type Service;
    fn layer(&self, inner: S) -> Self::Service;
}

// 조합 패턴:
let stack = ServiceBuilder::new()
    .layer(OuterLayer)
    .layer(MiddleLayer)
    .layer(InnerLayer)
    .service(handler);
//
// 호출 흐름:
// Request → OuterLayer → MiddleLayer → InnerLayer → handler
// Response ← OuterLayer ← MiddleLayer ← InnerLayer ← handler

// 각 Layer는 독립적:
// - RPC 프로토콜 알 필요 없음 (HTTP 레벨에서 동작)
// - 다른 프로젝트(hyper, axum)와 호환`}
        </pre>
        <p className="leading-7">
          <code>tower::Service</code>가 <strong>Rust 비동기 웹 생태계의 공통 토대</strong>.<br />
          모든 요청 처리기가 이 trait 구현 → 미들웨어 조합 자유.<br />
          <code>poll_ready</code>로 backpressure 지원 — 과부하 시 요청 거부 가능.
        </p>

        {/* ── Rate Limiting ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Rate Limiting — per-IP 요청 제한</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// tower::limit::RateLimitLayer
pub struct RateLimitLayer {
    num: u64,          // 허용 요청 수
    per: Duration,     // 시간 단위
}

// 사용:
let rate_limit = RateLimitLayer::new(100, Duration::from_secs(1));
// → 100 req/s per connection

// 구현 (토큰 버킷 알고리즘):
impl<S, Req> Service<Req> for RateLimit<S> {
    fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), _>> {
        // 1. 현재 버킷에 토큰 있는지 확인
        let now = Instant::now();
        self.refill_tokens(now);

        if self.tokens > 0 {
            self.tokens -= 1;
            Poll::Ready(Ok(()))
        } else {
            // 토큰 없음 → 다음 refill까지 대기
            cx.waker().wake_by_ref();
            Poll::Pending
        }
    }
}

// per-IP 제한 (더 정교한 구현):
pub struct IpBasedRateLimit {
    buckets: DashMap<IpAddr, TokenBucket>,
}

// IP당 100 req/s
// DashMap으로 lock-free 접근
// 오래된 IP는 주기적으로 제거 (메모리 관리)

// 운영 시나리오:
// - 공개 RPC: 100 req/s per IP
// - 인증된 클라이언트: 1000 req/s
// - 내부 모니터링: 무제한`}
        </pre>
        <p className="leading-7">
          Rate Limiting이 <strong>공개 RPC 보호</strong>의 첫 방어선.<br />
          IP 기반 token bucket으로 스팸/DoS 방지.<br />
          DashMap 덕분에 수천 IP 동시 관리 가능 (lock-free).
        </p>

        {/* ── JWT 인증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">JWT 인증 — Engine API 전용</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// JWT 미들웨어 (Engine API 포트에만 적용)
pub struct JwtAuthLayer {
    secret: [u8; 32],  // CL과 공유하는 비밀
}

impl<S> Service<Request<Body>> for JwtAuth<S> {
    fn call(&mut self, req: Request<Body>) -> Self::Future {
        // 1. Authorization 헤더 추출
        let auth_header = req.headers()
            .get("Authorization")
            .and_then(|v| v.to_str().ok());

        // 2. "Bearer <token>" 파싱
        let token = auth_header
            .and_then(|h| h.strip_prefix("Bearer "))
            .ok_or_else(|| Unauthorized)?;

        // 3. JWT 검증 (HS256)
        let claims = jsonwebtoken::decode::<Claims>(
            token,
            &DecodingKey::from_secret(&self.secret),
            &Validation::new(Algorithm::HS256),
        )?;

        // 4. iat(issued at) 검증 (최근 60초 이내)
        let now = SystemTime::now().duration_since(UNIX_EPOCH)?.as_secs();
        if now - claims.iat > 60 {
            return Err(TokenExpired);
        }

        // 5. 통과 → 내부 서비스로 위임
        self.inner.call(req)
    }
}

// JWT secret 관리:
// - 노드 시작 시 32바이트 랜덤 생성
// - jwtsecret 파일에 저장 (0600 권한)
// - CL과 이 파일 공유 (같은 머신이면 파일, 원격이면 설정)

// 공격 벡터 방어:
// - replay attack: iat 만료 (60초)
// - brute force: HS256 + 256비트 secret
// - MITM: HTTPS 권장 (추가 계층)`}
        </pre>
        <p className="leading-7">
          JWT 인증이 <strong>Engine API 전용 방어선</strong>.<br />
          CL과 공유하는 32바이트 secret으로 HS256 서명 검증.<br />
          iat 만료(60초)로 replay 공격 방어 + 매 요청 fresh token 사용.
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
