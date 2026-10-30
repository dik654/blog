import Overview from "./cometbft-abci/Overview";
import ABCIClient from "./cometbft-abci/ABCIClient";
import PrepareProcess from "./cometbft-abci/PrepareProcess";
import FinalizeCommit from "./cometbft-abci/FinalizeCommit";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./cometbft-abci/codeRefs";
import { cometbftAbciTree } from "./cometbft-abci/fileTrees";
import { CosmosCoreMapReturn } from "./CosmosCoreLocator";

export default function CometBFTAbciArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article>
      <Overview />
      <ABCIClient onCodeRef={sidebar.open} />
      <PrepareProcess onCodeRef={sidebar.open} />
      <FinalizeCommit onCodeRef={sidebar.open} />
      <CosmosCoreMapReturn
        currentSlug="cometbft-abci"
        closure="ABCI++는 한 번의 성공 호출이 아니라 상태 소유권의 연속입니다. Prepare·Process는 candidate를 durable state와 격리하고, FinalizeBlock은 결정된 B41의 S41·A41을 계산하며, Commit만 application state를 영속화합니다. 재시작은 block·response·application height 중 마지막으로 남은 receipt에서 이어집니다."
      />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftAbciTree }}
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
