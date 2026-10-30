import Overview from "./cometbft-types/Overview";
import BlockHeader from "./cometbft-types/BlockHeader";
import VoteCommit from "./cometbft-types/VoteCommit";
import ValidatorSet from "./cometbft-types/ValidatorSet";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./cometbft-types/codeRefs";
import { cometbftTypesTree } from "./cometbft-types/fileTrees";
import { CosmosCoreMapReturn } from "./CosmosCoreLocator";

export default function CometBFTTypesArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article>
      <Overview />
      <BlockHeader onCodeRef={sidebar.open} />
      <VoteCommit onCodeRef={sidebar.open} />
      <ValidatorSet onCodeRef={sidebar.open} />
      <CosmosCoreMapReturn
        currentSlug="cometbft-types"
        closure="CometBFT의 결정 증거는 Header hash 하나로 끝나지 않습니다. 같은 chain·height·round·type·BlockID에 묶인 서명과 그 높이의 historical ValidatorSet을 함께 검증해야 Commit을 재현할 수 있으며, 상충 서명은 별도 Evidence 경로로 분리됩니다."
      />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftTypesTree }}
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
