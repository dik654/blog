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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Engine API (EIP-3675)
// PoS 이후 CL(Prysm) ↔ EL(Reth/Geth) 유일한 통신 경로

// 접속 정보:
// URL: http://localhost:8551 (기본)
// Auth: JWT (shared secret 32 bytes)
// Protocol: JSON-RPC 2.0

// 3대 메서드 (Deneb 기준):
// 1. engine_newPayloadV3
//    - CL이 EL에 새 payload 검증 요청
//    - 응답: VALID / INVALID / SYNCING

// 2. engine_forkchoiceUpdatedV3
//    - CL이 EL에 head/safe/finalized 통지
//    - payload_attributes 포함 시 → 새 블록 빌드 시작
//    - 응답: payload_status + payload_id

// 3. engine_getPayloadV3
//    - CL이 EL에서 빌드된 payload 회수
//    - payload_id로 식별
//    - validator가 블록 제안 시 사용

// JWT 인증:
// - 32 bytes hex secret
// - CL과 EL이 공유 (jwt.hex 파일)
// - 매 요청에 Authorization: Bearer {jwt_token} 헤더
// - iat (issued at) claim으로 replay 방어 (5초 window)

// 왜 JWT?
// - TLS 대비 경량
// - 신뢰 제3자 없이 상호 인증
// - localhost 통신이 일반적 → TLS 과잉
// - 간단한 shared secret으로 충분

// 실패 시나리오:
// - JWT mismatch → 401 Unauthorized
// - EL 응답 없음 → CL 타임아웃 → retry
// - EL VALID but CL disagree → critical bug`}
        </pre>
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
