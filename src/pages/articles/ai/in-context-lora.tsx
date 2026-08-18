import Overview from "./in-context-lora/Overview";
import Training from "./in-context-lora/Training";
import Applications from "./in-context-lora/Applications";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./in-context-lora/codeRefs";
import { inContextLoraTree } from "./in-context-lora/fileTree";

export default function InContextLoraArticle() {
  const sidebar = useCodeSidebar();

  return (
    <div className="space-y-12">
      <Overview onCodeRef={sidebar.open} />
      <Training onCodeRef={sidebar.open} />
      <Applications onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ "id-lora": inContextLoraTree }}
        projectMetas={{
          "id-lora": {
            id: "id-lora",
            label: "ID-LoRA · Python/YAML",
            badgeClass: "bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-700",
          },
        }}
      />
    </div>
  );
}
