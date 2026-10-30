import Overview from "./cometbft-consensus/Overview";
import ReceiveRoutine from "./cometbft-consensus/ReceiveRoutine";
import RoundState from "./cometbft-consensus/RoundState";
import VoteHandling from "./cometbft-consensus/VoteHandling";
import Timeout from "./cometbft-consensus/Timeout";
import Byzantine from "./cometbft-consensus/Byzantine";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./cometbft-consensus/codeRefs";
import { cometbftConsensusTree } from "./cometbft-consensus/fileTrees";
import { CosmosCoreMapReturn } from "./CosmosCoreLocator";

export default function CometBFTConsensusArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article>
      <Overview />
      <ReceiveRoutine onCodeRef={sidebar.open} />
      <RoundState onCodeRef={sidebar.open} />
      <VoteHandling onCodeRef={sidebar.open} />
      <Timeout onCodeRef={sidebar.open} />
      <Byzantine onCodeRef={sidebar.open} />
      <CosmosCoreMapReturn
        currentSlug="cometbft-consensus"
        closure="CometBFT 합의는 timeout 하나가 block을 고르는 구조가 아닙니다. 한 receive loop가 H/R/S 순서를 지키며 입력을 적용하고, 같은 좌표와 BlockID에 모인 +2/3 prevote가 lock을, +2/3 precommit이 Commit을 만듭니다. 상충 서명은 기존 결정을 덮어쓰지 않고 Evidence 경로로 분리됩니다."
      />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftConsensusTree }}
        projectMetas={{
          cometbft: {
            id: "cometbft",
            label: "CometBFT · Go",
            badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
          },
        }}
      />
    </article>
  );
}
