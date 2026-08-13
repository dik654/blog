import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import RethStateFlowViz from "../reth-state-flow-viz";

export default function Overview({
  onCodeRef: _,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Pipeline은 오래된 block 구간을 검증 가능한 stage와 checkpoint로 나눈다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Genesis부터 head까지 수백만 block을 한 transaction에서 처리하면 중간
          실패 뒤 처음부터 다시 시작해야 하고, header·body·sender·state가 서로
          다른 높이에 멈춘 이유도 알기 어렵습니다. Reth pipeline은 의존 관계가
          있는 stage가 bounded range를 처리하고 durable checkpoint를 남기게 해
          historical sync를 재시작 가능한 작업으로 만듭니다.
        </p>
        <p>
          이 글은 checkpoint 99, target 250, batch limit 64인 고정 사례로{" "}
          <strong>
            Headers→Bodies→Senders→Execution→Merkle→checkpoint/unwind
          </strong>
          를 추적합니다. EVM transition은{" "}
          <Link to="/blockchain/reth-block-execution">block execution</Link>,
          state root는 <Link to="/blockchain/reth-trie">Reth Trie</Link> 정본을
          재사용합니다.
        </p>
      </div>
      <ContentBoundary article="reth-pipeline" />
      <RethStateFlowViz mode="pipeline" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Stage는 data owner가 아니라 progress owner입니다</h3>
        <p>
          Headers가 163까지 갔더라도 Bodies가 120이면 execution은 121 이후
          input을 갖지 못합니다. 각 stage checkpoint는 “이 높이까지 필요한
          output을 검증하고 commit했다”는 뜻이며 node 전체 sync 완료나 canonical
          finality를 뜻하지 않습니다. Pipeline은 dependency의 최소 안전
          높이까지만 다음 stage를 진행시킵니다.
        </p>
        <h3>Reorg는 뒤에서 앞으로 unwind합니다</h3>
        <p>
          Common ancestor가 140이면 derived output을 만드는
          Merkle·Execution·Senders 등이 먼저 140으로 되돌아가고, body/header
          canonical view를 조정한 뒤 새 branch를 순서대로 실행합니다. Unwind
          checkpoint와 forward checkpoint를 한 필드로 덮어쓰지 않아야 crash 뒤
          현재 phase를 판단할 수 있습니다.
        </p>
      </div>
      <div id="paper-eels-pipeline" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Execution Layer Specifications — pinned snapshot"
          href="https://github.com/ethereum/execution-specs/tree/56e8617b619c0ab22284b140b49cc5501e5e6227"
          citeKey={1}
        >
          EELS snapshot은 fork별 block transition과 fixture oracle의 protocol
          근거입니다. Reth의 stage 분할·batch size·checkpoint schema를 규정하지
          않습니다.
        </CitationBlock>
      </div>
      <div id="paper-reth-pipeline-source" className="scroll-mt-24">
        <CitationBlock
          source="Reth v2.2.0 — stages source"
          href="https://github.com/paradigmxyz/reth/tree/v2.2.0/crates/stages"
          citeKey={2}
          type="code"
        >
          Reth v2.2.0의 stage API와 구현을 확인하는 source snapshot입니다. 이
          글의 crash receipt와 paired release matrix는 운영 hardening 제안이며
          source가 자동으로 보장한다고 해석하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
