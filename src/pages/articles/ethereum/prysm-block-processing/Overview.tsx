import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import BlockProcessingViz from "./viz/BlockProcessingViz";

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Block processing은 signed block을 parent state에 적용해 하나의 post-state를 만드는 함수다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">Beacon block은 transaction 묶음만이 아니라 consensus state를 바꾸는 입력입니다. 같은 parent state와 같은 fork 규칙에 같은 block을 적용한 정상 client는 같은 post-state root를 만들어야 하며, 중간 검증 하나라도 실패하면 그 block transition 전체가 invalid입니다.</p>
        <p>이 글은 network gossip·SSZ decode를 이미 통과한 signed block이 <strong>slot 정렬 → proposer signature → fork별 process_block → post-state root 확인</strong>으로 내려가는 경로를 추적합니다. SSZ·BLS·BeaconState의 긴 정의는 각 정본 글에 두되, 현재 단계에서 필요한 직관과 실패 경계는 여기에도 남깁니다.</p>
      </div>
      <ContentBoundary article="prysm-block-processing" />
      <ContextViz />
      <ExplainedFormula
        question="Block transition이 무엇을 입력받아 어떤 identity를 만들어야 할까요?"
        idea={<>Parent의 <strong>pre-state</strong>, fork가 정한 block handler와 signed block을 하나의 결정적 함수로 보고, 마지막 SSZ hash-tree-root가 block header의 약속과 같은지 확인합니다.</>}
        formula={String.raw`\begin{aligned}
S_{t+1}&=T_f(S_t,B_t)\\
\operatorname{HTR}(S_{t+1})&=B_t.\mathrm{state\_root}
\end{aligned}`}
        terms={[
          { symbol: "S_t", name: "pre-state", description: "Block parent와 정렬된 fork-specific BeaconState입니다." },
          { symbol: "B_t", name: "signed block message", description: "Slot·parent·proposer·body와 별도 proposer signature를 가진 입력입니다." },
          { symbol: "T_f", name: "fork transition", description: "활성 fork f가 정한 ordered block-processing 함수입니다." },
          { symbol: "HTR", name: "hash-tree-root", description: "Post-state를 식별하는 32-byte SSZ Merkle root입니다." },
        ]}
        assumptions={["같은 consensus-spec release/commit, fork, network preset과 arithmetic semantics를 사용합니다.", "Unhandled exception·overflow·assert failure는 invalid transition이며 부분 mutation을 publish하지 않습니다."]}
        interpretation="식의 등호는 두 client가 같은 state root를 재현해야 한다는 correctness oracle입니다. 이 block이 fork-choice head나 finalized라는 결론까지 주지는 않습니다."
      />
      <BlockProcessingViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>호출 순서는 포크가 정의하는 data dependency입니다</h3>
        <p>Phase 0의 <code>process_block</code>은 header, RANDAO, Eth1 data, operations를 처리했습니다. Fulu 계열 규격은 withdrawals와 execution payload를 앞쪽에 두고 sync aggregate까지 이어집니다. 새 fork가 handler를 추가·교체하면 이전 글의 고정 목록을 재사용하지 않고 활성 fork 함수와 reference test를 기준으로 읽습니다.</p>
        <p>자세한 wire identity는 <Link to="/blockchain/prysm-ssz">SSZ</Link>, proposer·RANDAO signature는 <Link to="/blockchain/prysm-bls">BLS</Link>, mutable state와 root cache는 <Link to="/blockchain/prysm-beacon-state">BeaconState</Link>, execution 판단은 <Link to="/blockchain/prysm-engine-api">Engine API</Link>가 소유합니다.</p>
      </div>
      <div id="paper-consensus-block-transition" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 읽기 · block transition</p>
        <p className="mt-2 text-sm font-semibold">Ethereum Consensus Specifications v1.6.1 · Phase 0 and Fulu beacon chain</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">문제는 fork별 block body가 BeaconState에 적용되는 정확한 순서와 post-state root를 모든 client가 재현하는 것입니다. Executable Python spec과 reference test가 protocol transition을 정의하지만 Prysm의 cache·package·latency는 정하지 않습니다. 이 글은 v1.6.1 tag와 stable Fulu를 고정하고 unstable future fork를 현재 규칙으로 섞지 않습니다.</p>
        <a href="https://github.com/ethereum/consensus-specs/tree/v1.6.1/specs" target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">고정한 consensus specs 보기</a>
      </div>
    </section>
  );
}
