import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";
import PrysmFoundationViz from "../prysm-foundation-viz";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        BeaconState는 다음 block을 계산하는 protocol snapshot이고 state root는
        그 값의 identity다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Consensus client는 현재 validator·balance·checkpoint와 recent root를
          알아야 다음 slot·epoch·block의 유효성을 결정할 수 있습니다. Ethereum은
          이 입력을 fork별 SSZ <code>BeaconState</code>로 정의하며 state
          transition은 parent state와 block을 받아 새 state를 만듭니다. Prysm의
          in-memory object와 cache는 이 protocol value를 빠르게 계산하기 위한
          구현이지 별도의 consensus 진실이 아닙니다.
        </p>
        <p>
          이 글은{" "}
          <strong>
            protocol schema→immutable state view→copy-on-write mutation→dirty
            path→state root→fork upgrade
          </strong>{" "}
          순서로 내려갑니다. <Link to="/blockchain/prysm-ssz">SSZ 글</Link>이
          root 계산 규칙을,
          <Link to="/blockchain/prysm"> Prysm 개요</Link>가 head·finality와의
          차이를 소유하므로 여기서는 state value와 cache identity를 연결합니다.
        </p>
      </div>

      <ContentBoundary article="prysm-beacon-state" />
      <PrysmFoundationViz mode="state" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>
          State는 서로 다른 lifetime의 field를 한 transition input으로 묶습니다
        </h3>
        <p>
          <code>slot</code>과 fork version은 현재 protocol 위치를, block/state
          roots는 최근 history를, validators와 balances는 registry와 stake를,
          justified/finalized checkpoints는 finality evidence를 나타냅니다. 이후
          fork는 participation, sync committee, execution payload header,
          withdrawal·deposit queue 같은 field를 추가하거나 nested type을
          바꿉니다. 정확한 field set은 “BeaconState”라는 이름이 아니라 fork
          schema로 식별합니다.
        </p>
        <h3>작은 transition example</h3>
        <p>
          Parent state가 slot 100이고 block이 slot 102라면 먼저 빈 slot 101과
          slot 102 경계까지 per-slot processing을 수행한 뒤 block operations를
          적용합니다. 결과에는 pre-state root, target slot, fork, block root,
          post-state root가 함께 있어야 합니다. Post-state가 계산됐다는
          사실만으로 그 branch가 fork-choice head이거나 finalized라는 뜻은
          아닙니다.
        </p>
        <h3>Prysm이 최적화해도 보존해야 할 invariant</h3>
        <p>
          Full deep copy, copy-on-write와 incremental FieldTrie 중 어느 경로를
          사용해도 같은 fork·pre-state·block이면 같은 post-state root가 나와야
          합니다. Cache hit는 결과를 바꾸는 protocol input이 아니며 cache
          generation이나 dirty marker가 불확실하면 느린 full recomputation으로
          확인하거나 fail-closed합니다.
        </p>
      </div>

      <div id="paper-beacon-state-spec" className="scroll-mt-24">
        <CitationBlock
          {...OFFICIAL_SOURCES.ethereum.consensusSpecs}
          citeKey={1}
        >
          Ethereum consensus specs는 fork별 BeaconState schema와 transition을
          정의합니다. 2026-08 확인 시 stable fork와 unstable future fork가 함께
          있으므로 release·commit·fork·preset을 고정하고 미래 schema를 현재
          production state로 읽지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-state-source" className="scroll-mt-24">
        <CitationBlock
          {...OFFICIAL_SOURCES.prysm.repository}
          citeKey={2}
          type="code"
        >
          Prysm source는 state interface, copy-on-write와 root cache의 실제
          implementation 근거입니다. Package·field·optimization은 release마다
          달라질 수 있으며 protocol schema의 정본을 대신하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
