import ContextViz from './viz/ContextViz';
import EngineAPIFlowViz from './viz/EngineAPIFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Engine API 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 Engine API의 JWT 인증, 3대 메서드 호출 흐름, 에러 처리 전략을 코드 수준으로 추적한다.
        </p>

        {/* ── Engine API 개요 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Engine API — CL ↔ EL 통신 표준</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Engine API (EIP-3675) 접속 정보</h4>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <span>URL: <code>http://localhost:8551</code></span>
              <span>Auth: JWT (shared secret 32B)</span>
              <span>Protocol: JSON-RPC 2.0</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2"><code>engine_newPayloadV3</code></h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>CL이 EL에 새 payload 검증 요청</li>
                <li>응답: VALID / INVALID / SYNCING</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2"><code>engine_forkchoiceUpdatedV3</code></h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>CL이 EL에 head/safe/finalized 통지</li>
                <li>payload_attributes 시 블록 빌드 시작</li>
                <li>응답: payload_status + payload_id</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2"><code>engine_getPayloadV3</code></h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>CL이 EL에서 빌드된 payload 회수</li>
                <li>payload_id로 식별</li>
                <li>validator 블록 제안 시 사용</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">JWT 인증</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>32 bytes hex secret (<code>jwt.hex</code> 파일 공유)</li>
                <li>매 요청에 <code>Authorization: Bearer {'{jwt_token}'}</code></li>
                <li><code>iat</code> claim으로 replay 방어 (5초 window)</li>
                <li>TLS 대비 경량 / localhost 통신에 적합</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">실패 시나리오</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>JWT mismatch → 401 Unauthorized</li>
                <li>EL 응답 없음 → CL 타임아웃 → retry</li>
                <li>EL VALID but CL disagree → critical bug</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Engine API는 <strong>CL ↔ EL 유일한 통신 경로</strong>.<br />
          3대 메서드(newPayload, forkchoiceUpdated, getPayload)로 완전한 통신.<br />
          JWT shared secret으로 localhost 상호 인증.
        </p>
      </div>
      <div className="not-prose mt-6"><EngineAPIFlowViz /></div>
    </section>
  );
}
