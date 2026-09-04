import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";
import PrysmConsensusViz from "../prysm-consensus-viz";

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Fork choice는 가장 긴 체인이 아니라 최신 attestation이 지지하는 head를 고른다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Beacon node는 동시에 여러 valid block branch를 볼 수 있습니다. State transition은 각 branch가 규칙에 맞는지만
          판단할 뿐 어느 branch를 현재 head로 내보낼지는 정하지 않습니다. Prysm의 fork-choice store는 검증된 block,
          validator별 최신 attestation, justified·finalized checkpoint와 시간을 모아 <strong>지금 따라갈 한 root</strong>를
          계산합니다.
        </p>
        <p>
          이 글은 Ethereum client를 처음 보는 독자를 위해 <strong>event 수신→latest message 갱신→branch weight
          계산→checkpoint로 branch 필터링→greedy head walk→reorg·prune</strong> 순서로 내려갑니다. SSZ decode와 BLS
          검증은 선행 단계이며 여기서는 <Link to="/blockchain/prysm">Prysm 전체 lifecycle</Link>을 받은 뒤 head 판단만
          소유합니다.
        </p>
      </div>

      <ContentBoundary article="prysm-forkchoice" />
      <PrysmConsensusViz mode="forkchoice" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>핵심 아이디어: validator마다 가장 최근 vote 하나만 셉니다</h3>
        <p>
          LMD는 Latest Message Driven의 약자로 validator 한 명의 과거 attestation을 모두 누적하지 않고 관찰한 최신 message만 사용한다는
          뜻입니다. GHOST는 Greedy Heaviest Observed SubTree의 약자로 justified checkpoint에서 시작해 현재 node의 자식 중 subtree
          weight가 가장 큰 자식을 반복 선택합니다. 판단 기준은 최다 block 수도, 마지막에 도착한 block도 아닙니다. Active unslashed balance가 어느
          subtree를 지지하는지를 봅니다.
        </p>
        <p>
          이 계산에는 신뢰 경계가 있습니다. Block과 attestation은 먼저 해당 fork의 validation을 통과해야 하고 equivocation이 확인된 validator는
          weight에서 제외됩니다. 또한 finalized checkpoint와 충돌하는 branch는 아무리 무거워도 후보에 들지 못합니다. Network에서 보이는 모든 branch를
          무조건 비교하는 알고리즘으로 이해하면 안 됩니다.
        </p>

        <h3>숫자로 먼저 보는 head 선택</h3>
        <p>
          Justified root J의 자식이 A와 B라고 합시다. 최신 vote의 effective balance가 A subtree에 64 ETH, B subtree에 48 ETH를
          지지하면 첫 단계에서 A를 고릅니다. A의 자식 A1과 A2가 각각 24 ETH와 40 ETH라면 A2로 내려가고 더 이상 eligible child가 없으면 A2가
          head입니다. 이후 32 ETH validator의 최신 message가 A2에서 B1으로 이동하면 예전 32 ETH를 A2 ancestor에서 빼고 B1 ancestor에
          더해야 하므로 head가 B1로 바뀔 수 있습니다.
        </p>
        <p>
          동률은 root의 사전식 순서 같은 protocol tie-break로 결정합니다. Tie-break가 하는 일은 모든 honest node가 같은 store에서 같은 결과를 내게
          만드는 것이고 더 안전한 branch를 알아내는 별도 판단은 여기에 없습니다.
        </p>
      </div>

      <div id="paper-ethereum-forkchoice-spec" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Consensus Specifications — Phase 0 Fork Choice"
          href="https://github.com/ethereum/consensus-specs/blob/master/specs/phase0/fork-choice.md"
          citeKey={1}
        >
          이 규격은 Store, on_tick·on_block·on_attestation handler, latest message weight, proposer boost와 get_head를
          정의합니다. Protocol 정본이지만 Prysm의 자료구조·cache 비용을 정하지 않으며, 실제 분석에서는 spec commit과
          active fork를 고정해야 합니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-forkchoice-source" className="scroll-mt-24">
        <CitationBlock {...OFFICIAL_SOURCES.prysm.repository} citeKey={2} type="code">
          Prysm repository는 fork-choice store와 doubly-linked-tree 최적화의 implementation 근거입니다. Moving branch의
          package 이름이나 성능을 모든 release의 사실로 일반화하지 않고 release 또는 git SHA를 함께 기록합니다.
        </CitationBlock>
      </div>
    </section>
  );
}
