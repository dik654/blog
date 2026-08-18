import KVFundamentals from "./hybrid-attention-serving/KVFundamentals";
import Overview from "./hybrid-attention-serving/Overview";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./kv-cache-fundamentals/codeRefs";
import { kvCacheFundamentalsTree } from "./kv-cache-fundamentals/fileTree";

export default function KVCacheFundamentalsArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <KVFundamentals onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ transformers: kvCacheFundamentalsTree }}
        projectMetas={{
          transformers: {
            id: "transformers",
            label: "HuggingFace transformers · Python",
            badgeClass: "bg-yellow-500/10 border-yellow-500 text-yellow-700",
          },
        }}
      />
    </>
  );
}
