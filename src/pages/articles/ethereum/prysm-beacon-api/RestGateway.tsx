import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function RestGateway({ onCodeRef }: Props) {
  return (
    <section id="rest-gateway" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">REST Gateway</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">gRPC-gateway 변환</h3>
        <p className="leading-7">
          HTTP 요청을 gRPC 호출로 자동 변환한다.<br />
          protobuf 정의에서 <code>google.api.http</code> 어노테이션으로 매핑 규칙을 선언.
        </p>

        {/* ── proto 매핑 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">proto 매핑 — google.api.http 어노테이션</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// proto 정의에서 REST endpoint 매핑
service BeaconChain {
    rpc GetBlockV2(BlockRequestV2) returns (BlockResponseV2) {
        option (google.api.http) = {
            get: "/eth/v2/beacon/blocks/{block_id}"
        };
    }

    rpc SubmitBlock(SubmitBlockRequest) returns (SubmitBlockResponse) {
        option (google.api.http) = {
            post: "/eth/v1/beacon/blocks"
            body: "*"
        };
    }

    rpc GetStateV2(StateRequestV2) returns (StateResponseV2) {
        option (google.api.http) = {
            get: "/eth/v2/debug/beacon/states/{state_id}"
        };
    }
}

// grpc-gateway가 자동 생성:
// 1. HTTP handler 함수
// 2. URL path param 추출 (block_id, state_id)
// 3. query string → gRPC request 변환
// 4. POST body JSON → protobuf 변환
// 5. gRPC response → HTTP JSON 변환

// 생성된 Go 코드:
func (h *httpHandler) getBlockV2(w http.ResponseWriter, r *http.Request) {
    // 1. path param 추출
    vars := mux.Vars(r)
    blockID := vars["block_id"]

    // 2. gRPC 호출
    resp, err := h.grpcClient.GetBlockV2(r.Context(), &BlockRequestV2{
        BlockId: blockID,
    })

    // 3. JSON 응답 직렬화
    json.NewEncoder(w).Encode(resp)
}

// Accept 헤더에 따른 content negotiation:
// Accept: application/json → JSON response
// Accept: application/octet-stream → SSZ binary response`}
        </pre>
        <p className="leading-7">
          <code>grpc-gateway</code>가 <strong>proto 어노테이션 → HTTP handler 자동 생성</strong>.<br />
          path/query/body 파라미터 모두 자동 매핑.<br />
          단일 구현(gRPC) → REST + gRPC 양쪽 제공.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Beacon API 스펙</h3>
        <p className="leading-7">
          <code>GET /eth/v2/beacon/blocks/{'{block_id}'}</code> — 블록 조회<br />
          <code>GET /eth/v2/debug/beacon/states/{'{state_id}'}</code> — 상태 조회<br />
          <code>POST /eth/v1/beacon/blocks</code> — 블록 제출
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('get-block-v2', codeRefs['get-block-v2'])} />
          <span className="text-[10px] text-muted-foreground self-center">GetBlockV2()</span>
          <CodeViewButton onClick={() => onCodeRef('get-state-v2', codeRefs['get-state-v2'])} />
          <span className="text-[10px] text-muted-foreground self-center">GetStateV2()</span>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 응답 포맷 자동 전환</strong> — Accept: application/octet-stream → SSZ 바이너리 응답.<br />
          기본값은 JSON, 포크 버전에 따라 응답 구조체가 자동 변경.<br />
          클라이언트가 원하는 포맷과 포크를 헤더로 지정.
        </p>
      </div>
    </section>
  );
}
