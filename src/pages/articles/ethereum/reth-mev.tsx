import Overview from "./reth-mev/Overview";
import BuilderApi from "./reth-mev/BuilderApi";
import Flashbots from "./reth-mev/Flashbots";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./reth-mev/codeRefs";
import { rethMevTree, rbuilderTree } from "./reth-mev/fileTree";

export default function RethMev() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <BuilderApi onCodeRef={sidebar.open} />
      <Flashbots onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ "mev-boost": rethMevTree, rbuilder: rbuilderTree }}
        projectMetas={{
          "mev-boost": {
            id: "mev-boost",
            label: "mev-boost · Go",
            badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
          },
          rbuilder: {
            id: "rbuilder",
            label: "rbuilder · Rust",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </>
  );
}
