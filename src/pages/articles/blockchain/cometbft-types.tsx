import Overview from "./cometbft-types/Overview";
import BlockHeader from "./cometbft-types/BlockHeader";
import VoteCommit from "./cometbft-types/VoteCommit";
import ValidatorSet from "./cometbft-types/ValidatorSet";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./cometbft-types/codeRefs";
import { cometbftTypesTree } from "./cometbft-types/fileTrees";

export default function CometBFTTypesArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <BlockHeader onCodeRef={sidebar.open} />
      <VoteCommit onCodeRef={sidebar.open} />
      <ValidatorSet onCodeRef={sidebar.open} />
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
    </>
  );
}
