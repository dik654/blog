import ContentBoundary from "@/components/articles/content-boundary";
import RethRuntimeViz from "../reth-runtime-viz";
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
      <h2 className="text-2xl font-bold mb-6">Payload builder는 forkchoice 요청을 block candidate로 바꾼다</h2>
      <ContentBoundary article="reth-payload-builder" />
      <RethRuntimeViz mode="payload-flow" />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          합의 계층은 다음 block의 timestamp, fee recipient, prevRandao와 포크별
          attributes를 정하지만 transaction을 선택하고 EVM으로 실행해 state
          root와 receipt를 만드는 일은 실행 계층에 맡긴다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          문제 — 요청과 완성 payload 사이에는 수명주기가 있다
        </h3>
        <p className="leading-7">
          <code>forkchoiceUpdatedVn</code> 응답 안에서 block을 모두 만들어
          돌려주는 것이 아니다. EL은 attributes를 검증하고 payload id를 발급한
          뒤 background job을 추적하며, 이후 <code>getPayloadVn</code>이 같은
          id로 현재의 최선 후보를 조회한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">세 책임을 분리</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Service</strong>
            <p className="text-xs text-muted-foreground mt-1">
              job 등록, payload id lookup, resolve와 만료 관리
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Job generator</strong>
            <p className="text-xs text-muted-foreground mt-1">
              parent·attributes에서 fork-aware build context 생성
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Builder</strong>
            <p className="text-xs text-muted-foreground mt-1">
              transaction을 선택·실행하고 완성 가능한 후보를 평가
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          후보의 유효성이 가치보다 먼저다
        </h3>
        <p className="leading-7">
          txpool 순서는 탐색 순서일 뿐 block 포함을 보장하지 않는다. nonce,
          balance, base fee, gas·blob limit, EVM 결과와 포크별 필드를 만족하는
          후보만 비교할 수 있다. <code>block_value</code>도 이 유효한 후보를
          평가하는 한 입력이지 외부 builder 선택 정책 전체가 아니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          포크별 getPayload 응답
        </h3>
        <p className="leading-7">
          Engine API 버전이 바뀌면 execution payload 외의 부가 필드도 달라질 수
          있다. service는 payload id를 job에 연결하고 활성 포크에 맞는 response
          형태로 결과를 반환한다.
        </p>
        <div id="paper-reth-payload-builder-source" className="scroll-mt-24">
          <CitationBlock {...OFFICIAL_SOURCES.reth.payloadBuilder} citeKey={1} type="code">
            Reth의 basic payload builder 문서는 service, job generator와 builder의 책임을 분리합니다. 외부 MEV builder나 proposer 정책을 이 내부 trait 하나와 동일시하지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-engine-api-payload" className="scroll-mt-24">
          <CitationBlock {...OFFICIAL_SOURCES.ethereum.engineApi} citeKey={2}>
            Engine API의 forkchoiceUpdated/getPayload 메서드는 포크별 버전과 조건을 가집니다. 특정 초 단위 timeline이나 payload 수익을 protocol 보장으로 사용하지 않습니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
