import ContextViz from './viz/ContextViz';
import BeaconAPIViz from './viz/BeaconAPIViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">API 서버 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 gRPC 서버 초기화, REST 게이트웨이 연결, 인터셉터 체인을 코드 수준으로 추적한다.
        </p>

        {/* ── Prysm API 계층 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Prysm API 계층 — gRPC + REST Gateway</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Layer 1: gRPC Server <span className="text-xs text-muted-foreground font-normal">:4000</span></h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>Prysm 고유 API (proto 정의)</li>
                <li>Validator - Beacon-chain 통신</li>
                <li>내부 도구 (prysmctl)</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Layer 2: REST Gateway <span className="text-xs text-muted-foreground font-normal">:3500</span></h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>Ethereum Beacon API 표준 (EIP-3075)</li>
                <li>다른 CL 클라이언트와 호환</li>
                <li>외부 도구 (dashboard, explorer)</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Layer 3: gRPC-gateway <span className="text-xs text-muted-foreground font-normal">:3500</span></h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>REST 요청을 gRPC로 자동 변환</li>
                <li><code>google.api.http</code> 어노테이션 사용</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">주요 Beacon API endpoints (50+)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span><code>GET /eth/v1/beacon/states/{'{state_id}'}/validators</code></span>
              <span><code>GET /eth/v2/beacon/blocks/{'{block_id}'}</code></span>
              <span><code>GET /eth/v1/validator/duties/attester/{'{epoch}'}</code></span>
              <span><code>POST /eth/v1/beacon/blocks</code></span>
              <span><code>GET /eth/v1/beacon/light_client/updates</code></span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">인증</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
              <span>gRPC: TLS optional, JWT optional</span>
              <span>REST: 공개 (인증 없음)</span>
              <span><code>/eth/v1/admin/*</code> 등 민감 endpoint는 제한</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Prysm은 <strong>gRPC + REST 이중 API 제공</strong>.<br />
          gRPC는 내부(validator), REST는 외부(dashboard/explorer).<br />
          grpc-gateway로 단일 구현 → 양쪽 프로토콜 자동 지원.
        </p>
      </div>
      <div className="not-prose mt-6"><BeaconAPIViz /></div>
    </section>
  );
}
