import Overview from "./llm-serving-ops/Overview";
import LiteLLMGateway from "./llm-serving-ops/LiteLLMGateway";
import KubernetesFleet from "./llm-serving-ops/KubernetesFleet";
import ServingDeployment from "./llm-serving-ops/ServingDeployment";
import Observability from "./llm-serving-ops/Observability";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./llm-serving-ops/codeRefs";
import { litellmTree } from "./llm-serving-ops/fileTree";

export default function LLMServingOpsArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <LiteLLMGateway onCodeRef={sidebar.open} />
      <KubernetesFleet />
      <ServingDeployment />
      <Observability />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ litellm: litellmTree }}
        projectMetas={{
          litellm: {
            id: "litellm",
            label: "LiteLLM · Python",
            badgeClass: "bg-yellow-500/10 border-yellow-500 text-yellow-700",
          },
        }}
      />
    </>
  );
}
