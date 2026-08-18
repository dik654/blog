import Overview from "./attention-theory/Overview";
import Additive from "./attention-theory/Additive";
import Multiplicative from "./attention-theory/Multiplicative";
import SelfAttention from "./attention-theory/SelfAttention";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./attention-theory/codeRefs";
import { attentionTheoryTree } from "./attention-theory/fileTree";

export default function AttentionTheoryArticle() {
  const sidebar = useCodeSidebar();

  return (
    <div>
      <Overview />
      <Additive />
      <Multiplicative />
      <SelfAttention onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torch: attentionTheoryTree }}
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
