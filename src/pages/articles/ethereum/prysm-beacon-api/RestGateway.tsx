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
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">proto 매핑 예시</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-medium shrink-0 text-blue-500">GET</span>
                <div><code>GetBlockV2</code> → <code>/eth/v2/beacon/blocks/{'{block_id}'}</code></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-medium shrink-0 text-green-500">POST</span>
                <div><code>SubmitBlock</code> → <code>/eth/v1/beacon/blocks</code> (body: "*")</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-medium shrink-0 text-blue-500">GET</span>
                <div><code>GetStateV2</code> → <code>/eth/v2/debug/beacon/states/{'{state_id}'}</code></div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">grpc-gateway 자동 생성 흐름</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">1</span>
                <div>HTTP handler 함수 생성</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">2</span>
                <div>URL path param 추출 (<code>mux.Vars(r)</code> → <code>block_id</code>, <code>state_id</code>)</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">3</span>
                <div>query string → gRPC request 변환 / POST body JSON → protobuf 변환</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">4</span>
                <div><code>grpcClient.GetBlockV2(ctx, req)</code> — gRPC 호출</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">5</span>
                <div>gRPC response → HTTP JSON 변환 (<code>json.NewEncoder(w).Encode(resp)</code>)</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Content Negotiation</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span><code>Accept: application/json</code> → JSON response</span>
              <span><code>Accept: application/octet-stream</code> → SSZ binary response</span>
            </div>
          </div>
        </div>
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
