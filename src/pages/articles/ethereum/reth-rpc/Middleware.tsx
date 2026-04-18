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
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">Service trait</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p><code>type Response</code>, <code>type Error</code>, <code>type Future</code></p>
                <p><code>poll_ready(cx)</code> — backpressure 확인</p>
                <p><code>call(req) -&gt; Future</code> — 요청 처리 시작</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">Layer trait</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p><code>layer(inner: S) -&gt; Self::Service</code></p>
                <p className="text-foreground/60 mt-1">Service를 감싸는 미들웨어. 호출: Request → Outer → Middle → Inner → handler → 역순 Response.</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-foreground/60">각 Layer는 RPC 프로토콜과 독립 — HTTP 레벨에서 동작. hyper, axum과 호환.</p>
        </div>
        <p className="leading-7">
          <code>tower::Service</code>가 <strong>Rust 비동기 웹 생태계의 공통 토대</strong>.<br />
          모든 요청 처리기가 이 trait 구현 → 미들웨어 조합 자유.<br />
          <code>poll_ready</code>로 backpressure 지원 — 과부하 시 요청 거부 가능.
        </p>

        {/* ── Rate Limiting ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Rate Limiting — per-IP 요청 제한</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">RateLimitLayer — 토큰 버킷 알고리즘</p>
            <p className="text-sm text-foreground/80 mb-2">
              <code>{'RateLimitLayer { num: u64, per: Duration }'}</code> — 예: <code>new(100, 1s)</code> = 100 req/s.
            </p>
            <p className="text-sm text-foreground/70">
              <code>poll_ready()</code>에서 토큰 확인 → 있으면 소비(<code>Poll::Ready</code>), 없으면 대기(<code>Poll::Pending</code>). <code>refill_tokens(now)</code>로 시간 경과 시 보충.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">IpBasedRateLimit</p>
            <p className="text-sm text-foreground/80 mb-2"><code>buckets: DashMap&lt;IpAddr, TokenBucket&gt;</code> — IP별 lock-free 관리. 오래된 IP 주기적 제거.</p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center">
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">공개 RPC</p><p className="text-xs text-foreground/40">100 req/s per IP</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">인증 클라이언트</p><p className="text-xs text-foreground/40">1000 req/s</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">내부 모니터링</p><p className="text-xs text-foreground/40">무제한</p></div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Rate Limiting이 <strong>공개 RPC 보호</strong>의 첫 방어선.<br />
          IP 기반 token bucket으로 스팸/DoS 방지.<br />
          DashMap 덕분에 수천 IP 동시 관리 가능 (lock-free).
        </p>

        {/* ── JWT 인증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">JWT 인증 — Engine API 전용</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">JwtAuthLayer — Engine API 전용</p>
            <p className="text-sm text-foreground/80 mb-2"><code>secret: [u8; 32]</code> — CL과 공유하는 비밀. 노드 시작 시 랜덤 생성 → jwtsecret 파일 저장(0600 권한).</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. <code>Authorization</code> 헤더에서 "Bearer &lt;token&gt;" 추출</p>
              <p>2. <code>jsonwebtoken::decode</code>로 HS256 검증</p>
              <p>3. <code>iat</code>(issued at) 최근 60초 이내 확인 → 만료 시 <code>TokenExpired</code></p>
              <p>4. 통과 → 내부 서비스로 위임</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm text-center">
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">replay 방어</p><p className="text-xs text-foreground/40">iat 만료(60초)</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">brute force 방어</p><p className="text-xs text-foreground/40">HS256 + 256비트</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">MITM 방어</p><p className="text-xs text-foreground/40">HTTPS 권장</p></div>
          </div>
        </div>
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
