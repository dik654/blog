import Overview from "./lstm/Overview";
import Gates from "./lstm/Gates";
import CellState from "./lstm/CellState";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./lstm/codeRefs";
import { lstmTree } from "./lstm/fileTree";

export default function LSTMArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <Gates onCodeRef={sidebar.open} />
      <CellState />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torch: lstmTree }}
        projectMetas={{
          torch: {
            id: "torch",
            label: "PyTorch · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </>
  );
}
