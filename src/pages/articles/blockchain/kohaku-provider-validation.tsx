import { CodeSidebar, useCodeSidebar } from "@/components/code";
import ModernArticle from "./kohaku-provider-validation/ModernArticle";
import { kohakuProviderCodeRefs } from "./kohaku-provider/codeRefsReal";
import { kohakuProviderTree } from "./kohaku-provider/fileTreeReal";

export default function KohakuProviderValidation() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <ModernArticle onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={kohakuProviderCodeRefs}
        fileTrees={{ kohaku: kohakuProviderTree }}
        projectMetas={{
          kohaku: {
            id: "kohaku",
            label: "ethereum/kohaku · provider 0.1.0-alpha.13 · TypeScript",
            badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700",
          },
        }}
      />
    </>
  );
}
