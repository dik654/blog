import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import PrysmStorageViz from "../prysm-storage-viz";

export default function Overview({
  onCodeRef: _,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Block이 없는 slot도 건너뛰지 않고 같은 순서로 state를 전진시킨다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Ethereum의 slot은 block 번호가 아니라 protocol clock의 한 칸입니다.
          Slot에 block이 없더라도 recent root 기록과 epoch 경계가 달라질 수
          있으므로, Prysm은 target slot까지 <code>process_slot</code>을 반복하고
          경계에서는 <code>process_epoch</code>을 호출한 뒤에야 target block을
          처리합니다.
        </p>
        <p>
          이 글은{" "}
          <strong>
            pre-state→empty-slot replay→root history→epoch trigger→block-ready
            state
          </strong>
          를 한 고정 사례로 추적합니다.{" "}
          <Link to="/blockchain/prysm-beacon-state">
            BeaconState value·Merkle cache
          </Link>
          와{" "}
          <Link to="/blockchain/prysm-epoch-processing">epoch processing</Link>
          은 기존 정본을 재사용합니다.
        </p>
      </div>
      <ContentBoundary article="prysm-slot-processing" />
      <PrysmStorageViz mode="slot" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Slot 30 state를 slot 33 block 앞까지 옮깁니다</h3>
        <p>
          <code>SLOTS_PER_EPOCH=32</code>인 예에서 state.slot=30,
          target=33이라면 slot 30의 root receipt를 기록하고 31로 증가합니다.
          다음 반복은 slot 31을 처리한 뒤 <code>(31+1) mod 32=0</code>이므로
          epoch transition을 실행하고 32로 증가합니다. 마지막으로 slot 32를
          처리해 33으로 만든 뒤 block 33의 operations를 적용할 준비가 끝납니다.
        </p>
        <p>
          Target이 현재 slot 이하이면 과거로 되감거나 같은 slot을 두 번 적용하지 않고 reject합니다. Cancellation이나 error가 중간에 발생하면 마지막으로
          검증된 slot·pre/post root·epoch phase를 남기며 부분 state를 target 도달로 표시하지 않습니다.
        </p>
      </div>
      <div id="paper-slot-processing-spec" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Consensus Specifications v1.6.1 — slot processing"
          href="https://github.com/ethereum/consensus-specs/blob/v1.6.1/specs/phase0/beacon-chain.md"
          citeKey={1}
        >
          고정한 v1.6.1 consensus specs의 <code>process_slots</code>·
          <code>process_slot</code>·fork별 <code>process_epoch</code>가 protocol
          순서의 정본입니다. Fork·preset을 함께 고정하며 Prysm cache 성능을
          규정하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-slot-source" className="scroll-mt-24">
        <CitationBlock
          source="OffchainLabs Prysm v7.1.5 — transition source"
          href="https://github.com/OffchainLabs/prysm/tree/v7.1.5/beacon-chain/core/transition"
          citeKey={2}
          type="code"
        >
          Prysm v7.1.5 source는 loop·error·cache 호출의 구현 snapshot입니다.
          Moving branch의 함수 배치나 benchmark를 모든 release에 일반화하지
          않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
