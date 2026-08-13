import ContextViz from "./viz/ContextViz";
import BeaconAPIViz from "./viz/BeaconAPIViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Beacon API는 validator duty와 beacon node state를 연결한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          validator client는 매 epoch의 duty를 알아야 하고, dashboard와 explorer는 같은 beacon node에서
          상태·블록·이벤트를 읽어야 합니다. Prysm은 이런 호출자를 하나의 protocol에 묶지 않고 내부 통신용 gRPC와
          생태계 호환을 위한 표준 Beacon REST API를 함께 제공합니다.
        </p>
        <p className="leading-7">
          그렇다고 service logic을 두 벌로 구현하는 것은 아닙니다. 전송 경계에서 요청 형식과 오류를 정리한 뒤 공통
          BeaconChain·Validator·Node service로 넘기는 구조이므로, 먼저 전체 경계를 보고 나서 서버 초기화와
          interceptor, handler 순서로 내려가면 코드가 훨씬 쉽게 읽힙니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Prysm API 계층 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Prysm API 계층 — gRPC + REST Gateway
        </h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">
                Layer 1: gRPC Server{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  :4000
                </span>
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>Prysm 고유 API (proto 정의)</li>
                <li>Validator - Beacon-chain 통신</li>
                <li>내부 도구 (prysmctl)</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">
                Layer 2: REST Gateway{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  :3500
                </span>
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>Ethereum Beacon APIs 표준 endpoint</li>
                <li>다른 CL 클라이언트와 호환</li>
                <li>외부 도구 (dashboard, explorer)</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">
                Layer 3: gRPC-gateway{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  :3500
                </span>
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>REST 요청을 gRPC로 자동 변환</li>
                <li>
                  <code>google.api.http</code> 어노테이션 사용
                </li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              주요 Beacon API endpoints (50+)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span>
                <code>GET /eth/v1/beacon/states/{"{state_id}"}/validators</code>
              </span>
              <span>
                <code>GET /eth/v2/beacon/blocks/{"{block_id}"}</code>
              </span>
              <span>
                <code>GET /eth/v1/validator/duties/attester/{"{epoch}"}</code>
              </span>
              <span>
                <code>POST /eth/v1/beacon/blocks</code>
              </span>
              <span>
                <code>GET /eth/v1/beacon/light_client/updates</code>
              </span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">인증</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
              <span>gRPC: TLS optional, JWT optional</span>
              <span>REST: 공개 (인증 없음)</span>
              <span>
                <code>/eth/v1/admin/*</code> 등 민감 endpoint는 제한
              </span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          정리하면 gRPC와 REST는 서로 다른 사용자를 위한 두 입구이고, 핵심 beacon node logic은 그 뒤에서
          공유됩니다. 이 분리 덕분에 Prysm validator와 내부 도구는 typed gRPC 호출을 사용할 수 있고, 외부 도구는
          클라이언트 종류와 관계없이 같은 Ethereum Beacon APIs 규격으로 상태를 조회할 수 있습니다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <BeaconAPIViz />
      </div>
    </section>
  );
}
