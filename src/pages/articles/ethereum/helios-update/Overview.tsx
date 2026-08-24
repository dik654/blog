import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import HeliosTrustFlowViz from "../helios-trust-flow-viz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Light client update는 하나의 head가 아니라 속도와 확정성을 함께 관리한다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Helios는 모든 BeaconState를 재실행하지 않으므로, 처음 받은 trusted
          checkpoint만으로는 시간이 흐른 뒤의 execution block을 신뢰할 수
          없습니다. 대신 sync committee가 서명한 light-client update를 계속
          검증하면서 빠르게 움직이는 <strong>optimistic header</strong>와 더
          늦지만 강한 근거를 가진 <strong>finalized header</strong>를 별도로
          갱신합니다.
        </p>
        <p>
          이 글은 finalized slot 100, optimistic slot 104인 store에 attested
          slot 105, finalized slot 102, signature slot 106, 참여 350/512인
          update가 도착한 사례를 끝까지 따라갑니다. 핵심 질문은 “서명이 맞는가?”
          하나가 아니라, 어느 network·fork·period의 누가 어떤 header에 서명했고
          그 결과 어느 pointer까지 움직여도 되는가입니다.
        </p>
      </div>

      <ContentBoundary article="helios-update" />
      <HeliosTrustFlowViz mode="update" />

      <div
        id="update-types"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>OptimisticUpdate와 FinalityUpdate가 답하는 질문은 다릅니다</h3>
        <p>
          OptimisticUpdate는 최근 attested header와 SyncAggregate를 전달해 빠른
          읽기 기준을 갱신합니다. FinalityUpdate는 여기에 finalized header와 그
          header가 attested state에 들어 있다는 Merkle branch를 더합니다. 일반
          LightClientUpdate는 next sync committee와 branch까지 실어 period
          handoff를 준비할 수 있습니다. 이름이 다르더라도 slot·period·Merkle
          branch·BLS 검증을 통과하기 전에는 모두 신뢰하지 않는 network
          input입니다.
        </p>
      </div>

      <ExplainedFormula
        question="512명 sync committee에서 350명이 참여했다면 2/3 supermajority일까요?"
        idea={
          <>
            부동소수점 비율 대신 정수끼리 교차 곱하면 client마다 같은 경계값을
            얻습니다. 참여자 수를 세 배 한 값이 전체 position 수를 두 배 한 값
            이상인지 확인합니다.
          </>
        }
        formula={"3p\\ge 2N"}
        annotatedFormula={String.raw`3p\ge \underbrace{2N}_{\text{Participating positions 계산}}`}
        operations={[
          { expression: String.raw`2N`, annotation: ["Participating positions이(가) 식의 결과에","기여하는 방식을 계산합니다.","부동소수점 비율 대신 정수끼리 교차 곱하면 client마다"] },
        ]}
        terms={[
          {
            symbol: "p",
            name: "Participating positions",
            description:
              "SyncAggregate bitvector에서 1인 committee position 수입니다.",
          },
          {
            symbol: "N",
            name: "Committee positions",
            description: "해당 preset의 전체 sync-committee position 수입니다.",
          },
        ]}
        assumptions={[
          "각 bit는 검증한 current 또는 next committee의 같은 position에 결합됩니다.",
          "Aggregate BLS signature와 fork domain이 별도로 유효해야 합니다.",
          "2/3는 finalized update 적용 조건이지 full BeaconState transition을 실행했다는 뜻이 아닙니다.",
        ]}
        interpretation="p=350,N=512이면 1,050≥1,024이므로 supermajority입니다. 다만 이 계산만으로 update를 적용하지 않고 slot·period·branch·signature 검증을 모두 먼저 통과해야 합니다."
      />

      <div id="paper-consensus-light-client-update" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum consensus-specs v1.6.1 — Light client sync protocol"
          href="https://github.com/ethereum/consensus-specs/tree/5fa6edcca8ab4cf548653e6680b17b9d3e04d225/specs/altair/light-client"
          citeKey={1}
        >
          <p>
            <strong>문제:</strong> full state 없이 recent head·finality·next
            sync committee를 갱신해야 합니다. <strong>기여:</strong> update
            field, Merkle branch, signature, period와 best-update ordering을
            실행 가능한 규칙으로 정의합니다. <strong>전제:</strong> trusted
            checkpoint, network preset, genesis validators root와 fork
            schedule을 고정합니다.
            <strong>근거 범위:</strong> light-client protocol semantics입니다.
            <strong>과장하면 안 되는 결론:</strong> update 검증을 full-node
            block processing이나 execution validity 전체와 같다고 볼 수
            없습니다.
          </p>
        </CitationBlock>
      </div>

      <div id="paper-helios-update-source" className="scroll-mt-24">
        <CitationBlock
          source="Helios 0.11.1 — consensus-core update implementation"
          href="https://github.com/a16z/helios/blob/0.11.1/ethereum/consensus-core/src/consensus_core.rs"
          citeKey={2}
          type="code"
        >
          <p>
            <strong>문제:</strong> specification rule을 작은 Rust store에
            적용해야 합니다. <strong>기여:</strong> 검증, optimistic/finalized
            갱신, committee rotation과 best_valid_update 처리 경계를 보여
            줍니다. <strong>전제:</strong> Helios 0.11.1 tag, chain config와
            consensus-spec fork를 함께 고정합니다. <strong>근거 범위:</strong>이
            release의 구현 snapshot입니다.{" "}
            <strong>과장하면 안 되는 결론:</strong> moving main의 함수·default나
            특정 polling latency를 영구 동작으로 일반화하지 않습니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
