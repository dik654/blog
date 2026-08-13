import ContextViz from "./viz/ContextViz";
import EngineAPIFlowViz from "./viz/EngineAPIFlowViz";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Engine API는 consensus client와 execution client의 상태를 맞춘다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          PoS Ethereum에서는 합의 계층(CL)이 정한 체인 선택과 실행 계층(EL)의
          상태 전이가 분리되어 있다. Engine API는 두 계층이 서로의 내부 구현에
          의존하지 않고 블록을 검증하고 제안하도록 만드는 인증된 JSON-RPC
          경계다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          문제 — 체인 선택과 실행 유효성은 같은 판단이 아니다
        </h3>
        <p className="leading-7">
          CL은 head·safe·finalized 지점을 알고 있지만 EVM 실행 결과는 계산하지
          않는다. 반대로 EL은 트랜잭션을 실행할 수 있지만 어떤 포크를 합의
          체인으로 선택할지는 결정하지 않는다. 따라서 호출 하나의 성공 여부가
          아니라 <strong>포크별 메서드 버전, payload 상태, 빌드 작업</strong>을
          나눠 추적해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          아이디어 — 세 메서드 계열로 검증·선택·생성을 연결
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              <code>engine_newPayloadVn</code>
            </h4>
            <p className="text-xs text-muted-foreground">
              수신한 실행 페이로드와 포크별 부가 입력을 EL에서 검증하고{" "}
              <code>PayloadStatus</code>를 돌려준다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              <code>engine_forkchoiceUpdatedVn</code>
            </h4>
            <p className="text-xs text-muted-foreground">
              head·safe·finalized를 갱신하고 attributes가 있을 때만 payload 빌드
              작업과 id를 만든다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              <code>engine_getPayloadVn</code>
            </h4>
            <p className="text-xs text-muted-foreground">
              앞서 받은 payload id로 현재 준비된 후보와 포크별 부가 결과를
              회수한다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          여기서 <code>Vn</code>은 고정된 하나의 버전이 아니다. 포크가 추가되면
          요청·응답 필드가 바뀌므로 CL은 활성 포크에 맞는 메서드 버전을 선택해야
          한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          구현 경계 — JWT 인증과 상태 응답
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">인증 채널</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>CL과 EL이 256-bit JWT secret을 공유</li>
              <li>
                <code>HS256</code> 서명과 필수 <code>iat</code> claim 검증
              </li>
              <li>
                EL은 현재 시각 기준 ±60초 범위의 <code>iat</code>를 수용하도록
                권고
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">응답 해석</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>
                <code>VALID</code>·<code>INVALID</code>·<code>SYNCING</code>{" "}
                등을 구분
              </li>
              <li>
                <code>latestValidHash</code>와 validation error를 함께 처리
              </li>
              <li>
                transport 오류, 인증 실패, 실행 상태를 같은 retry로 뭉치지 않음
              </li>
            </ul>
          </div>
        </div>

        <CitationBlock {...OFFICIAL_SOURCES.ethereum.engineApi} citeKey={1}>
          Engine API 사양은 메서드를 포크별 버전으로 정의한다. 이 글도 특정 V3
          호출을 전체 API로 일반화하지 않고 메서드 계열의 역할을 기준으로
          설명한다.
        </CitationBlock>
        <CitationBlock
          {...OFFICIAL_SOURCES.ethereum.engineAuthentication}
          citeKey={2}
        >
          인증 사양은 256-bit secret과 HS256, 필수 iat를 정의하며 EL이 ±60초
          범위를 허용하도록 권고한다. 고정 5초 만료 규칙은 사양이 아니다.
        </CitationBlock>
      </div>
      <div className="not-prose mt-6">
        <EngineAPIFlowViz />
      </div>
    </section>
  );
}
