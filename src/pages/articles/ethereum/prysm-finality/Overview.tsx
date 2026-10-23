import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";
import PrysmConsensusViz from "../prysm-consensus-viz";
import ConsensusClientLocator from "../shared/ConsensusClientLocator";

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">현재 기록이 바뀌어도 되돌리기 어려운 지점은 어떻게 남을까요?</h2>
      <p className="mb-5 text-lg leading-8">
        <Link to="/cs/blockchain/node-architecture#case">전체 지도의 A→B 10 ETH 후보</Link>가 현재 기록으로 선택됐다고 하겠습니다. 뒤에서 더 무거운 가지가 나타나면 현재 기록은 바뀔 수 있으므로, 선택과 되돌리기 어려운 확정 지점을 따로 관리해야 합니다.
      </p>
      <ConsensusClientLocator current="finality" path={["finality", "consensus-store"]} question="투표가 어느 경계를 넘을 때 justified와 finalized 체크포인트가 바뀔까요?" />
      <p className="mb-5 text-sm leading-7 text-muted-foreground">아래의 checkpoint는 이 후보가 놓인 가지의 epoch 경계입니다. 현재 head가 되는 순간과 그 조상 checkpoint가 finalized가 되는 순간을 분리해 봅니다.</p>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Fork choice의 head는 새 attestation에 따라 바뀔 수 있습니다. Casper FFG는 validator가 epoch 경계의 checkpoint 사이에 남긴
          source→target vote를 모아 justified checkpoint를 만들고 이어진 supermajority link가 생기면 더 오래된 checkpoint를
          finalized로 올립니다. Finalized는 오래된 head를 가리키는 말로 읽히기 쉽지만 실제로는 conflicting finality를 만들 때 최소 1/3의 stake가
          slashable 행동을 남기는 안전성 경계입니다.
        </p>
        <p>
          이 글은 <strong>checkpoint→vote link→2/3 threshold→justification→finalization→prune→weak-subjectivity
          sync</strong> 순서로 설명합니다. 현재 head를 고르는 계산은 <Link to="/cs/blockchain/prysm-forkchoice">fork-choice
          글</Link>이 소유하고, 여기서는 epoch-level evidence가 언제 되돌리기 어려운 경계가 되는지만 다룹니다.
        </p>
      </div>

      <ContentBoundary article="prysm-finality" />
      <PrysmConsensusViz mode="finality" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Checkpoint는 epoch 번호와 그 경계 block root의 쌍입니다</h3>
        <p>
          Epoch은 여러 slot을 묶은 protocol 시간 단위이고 checkpoint는 <code>(epoch, root)</code>로 식별합니다. Validator의
          attestation은 현재 보이는 head뿐 아니라 FFG source와 target checkpoint를 함께 담습니다. 같은 target epoch라도 root가
          다르면 다른 checkpoint이며, 참여율을 셀 때는 attestation 개수가 아니라 해당 validator들의 effective balance를 합합니다.
        </p>
        <p>
          예를 들어 active unslashed balance가 96 ETH라면 2/3 threshold는 64 ETH입니다. Justified checkpoint C2를 source로
          C3를 target으로 한 valid vote가 68 ETH면 C2→C3가 supermajority link가 되어 C3를 justify할 수 있습니다. 이어지는 규격의
          finalization pattern까지 만족해야 C2가 finalized가 됩니다. 68 ETH라는 수치만으로 C3 자체가 즉시 finalized되지는 않습니다.
        </p>

        <h3>Finality와 availability는 다른 질문입니다</h3>
        <p>
          Finalized root가 있다는 사실은 그 root와 충돌하는 다른 finalized history를 honest assumptions 아래 만들기 어렵다는 뜻입니다. 모든
          node가 block body와 historical state를 영구 보관한다거나 application response가 성공했다는 뜻은 아닙니다. 반대로
          participation이 2/3 아래로 떨어졌을 때 chain이 즉시 잘못되지는 않고 새 finality가 멈출 수 있습니다. Safety와 liveness를 분리해 읽어야 하는
          대표적인 상황입니다.
        </p>
      </div>

      <div id="paper-ethereum-finality-spec" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Consensus Specifications — Phase 0 Beacon Chain"
          href="https://github.com/ethereum/consensus-specs/blob/master/specs/phase0/beacon-chain.md"
          citeKey={1}
        >
          이 규격은 checkpoint·attestation data·justification bits와 justification/finalization processing을 정의합니다.
          안전성 주장을 current fork의 전체 규칙과 slashing conditions에서 읽어야 하며 한 threshold 문장만으로 구현을 대체하지
          않습니다.
        </CitationBlock>
      </div>
      <div id="paper-ethereum-weak-subjectivity-spec" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Consensus Specifications — Weak Subjectivity"
          href="https://github.com/ethereum/consensus-specs/blob/master/specs/phase0/weak-subjectivity.md"
          citeKey={2}
        >
          이 문서는 오래 offline이던 node가 recent trusted checkpoint를 필요로 하는 이유와 weak-subjectivity period 계산 경계를
          설명합니다. 임의의 오래된 checkpoint가 안전하다는 보장이 아니며 network·validator-set 조건과 확인 시점을 함께 봅니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-finality-source" className="scroll-mt-24">
        <CitationBlock {...OFFICIAL_SOURCES.prysm.repository} citeKey={3} type="code">
          Prysm source는 epoch processing 결과가 fork-choice store와 pruning에 반영되는 implementation 경로를 확인하는
          근거입니다. Package layout과 cache 전략은 분석한 release·SHA 범위에만 귀속합니다.
        </CitationBlock>
      </div>
    </section>
  );
}
