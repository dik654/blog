import ForwardPass from "./backprop-optimization/ForwardPass";
import ChainRule from "./backprop-optimization/ChainRule";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./reverse-mode-autodiff/codeRefs";
import { reverseModeAutodiffTree } from "./reverse-mode-autodiff/fileTree";

export default function ReverseModeAutodiffArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article>
      <ForwardPass onCodeRef={sidebar.open} />
      <ChainRule onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ "pytorch-docs": reverseModeAutodiffTree }}
        projectMetas={{
          "pytorch-docs": {
            id: "pytorch-docs",
            label: "PyTorch docs · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </article>
  );
}
