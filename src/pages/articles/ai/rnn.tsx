import Overview from "./rnn/Overview";
import Architecture from "./rnn/Architecture";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./rnn/codeRefs";
import { rnnTree } from "./rnn/fileTree";

export default function RNNArticle() {
  const sidebar = useCodeSidebar();

  return (
    <div className="[&_svg_text]:text-[11px]">
      <Overview onCodeRef={sidebar.open} />
      <Architecture />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torch: rnnTree }}
        projectMetas={{
          torch: {
            id: "torch",
            label: "PyTorch · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </div>
  );
}
