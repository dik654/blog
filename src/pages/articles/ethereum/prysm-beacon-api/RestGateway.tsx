import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function RestGateway({ onCodeRef }: Props) {
  return (
    <section id="rest-gateway" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">REST Gateway</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">gRPC-gateway 변환</h3>
        <p>
          Prysm의 gRPC gateway는 protobuf service definition의 <code>google.api.http</code> annotation을 읽어 HTTP path·query·body를 gRPC request로 변환합니다. Core handler를 공유할 수 있지만 표준 Beacon API의 JSON·SSZ representation과 error semantics까지 자동으로 같아지는 것은 아니므로 compatibility layer의 test가 필요합니다.
        </p>

        {/* ── proto 매핑 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          proto 매핑 — google.api.http 어노테이션
        </h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">proto 매핑 예시</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-medium shrink-0 text-blue-500">GET</span>
                <div>
                  <code>GetBlockV2</code> →{" "}
                  <code>/eth/v2/beacon/blocks/{"{block_id}"}</code>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-medium shrink-0 text-green-500">
                  POST
                </span>
                <div>
                  <code>SubmitBlock</code> → <code>/eth/v1/beacon/blocks</code>{" "}
                  (body: "*")
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-medium shrink-0 text-blue-500">GET</span>
                <div>
                  <code>GetStateV2</code> →{" "}
                  <code>/eth/v2/debug/beacon/states/{"{state_id}"}</code>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              grpc-gateway 자동 생성 흐름
            </h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  1
                </span>
                <div>HTTP handler 함수 생성</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  2
                </span>
                <div>
                  URL path param 추출 (<code>mux.Vars(r)</code> →{" "}
                  <code>block_id</code>, <code>state_id</code>)
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  3
                </span>
                <div>
                  query string → gRPC request 변환 / POST body JSON → protobuf
                  변환
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  4
                </span>
                <div>
                  <code>grpcClient.GetBlockV2(ctx, req)</code> — gRPC 호출
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  5
                </span>
                <div>
                  gRPC response → HTTP JSON 변환 (
                  <code>json.NewEncoder(w).Encode(resp)</code>)
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Content Negotiation</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span>
                <code>Accept: application/json</code> → JSON response
              </span>
              <span>
                <code>Accept: application/octet-stream</code> → SSZ binary
                response
              </span>
            </div>
          </div>
        </div>
        <p>
          <code>grpc-gateway</code>는 annotation에서 HTTP handler와 path·query·body mapping code를 생성하므로 gRPC implementation을 REST entry point에서도 재사용할 수 있습니다. Prysm-specific gRPC method와 표준 endpoint의 versioning이 다를 수 있어 generated mapping 위에 별도 adapter가 필요한 경로도 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Beacon API 스펙</h3>
        <ul>
          <li><code>GET /eth/v2/beacon/blocks/{"{block_id}"}</code>는 versioned beacon block을 조회합니다.</li>
          <li><code>GET /eth/v2/debug/beacon/states/{"{state_id}"}</code>는 debug state representation을 조회합니다.</li>
          <li>Signed block publish endpoint의 version은 object fork와 현재 Beacon API specification을 기준으로 선택해야 합니다.</li>
        </ul>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() => onCodeRef("get-block-v2", codeRefs["get-block-v2"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            GetBlockV2()
          </span>
          <CodeViewButton
            onClick={() => onCodeRef("get-state-v2", codeRefs["get-state-v2"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            GetStateV2()
          </span>
        </div>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 응답 포맷 자동 전환</strong> — Accept:
          <code>application/octet-stream</code>을 요청하면 지원 endpoint에서 SSZ response를 받을 수 있고 JSON은 schema-aware representation을 사용합니다. Fork version은 response의 <code>Eth-Consensus-Version</code> 같은 protocol header와 object schema로 확인해야 하며 client가 임의로 fork를 지정하는 값으로 이해하면 안 됩니다.
        </p>
      </div>
    </section>
  );
}
