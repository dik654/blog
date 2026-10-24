import Overview from "./vllm-serving/Overview";
import EngineLoop from "./vllm-serving/EngineLoop";
import ServingArchitecture from "./vllm-serving/ServingArchitecture";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./vllm-serving/codeRefs";
import { vllmServingTree } from "./vllm-serving/fileTree";
import {
  ServingEngineMapReturn,
  ServingEngineSeriesLocator,
} from "./shared/ServingEngineSeriesLocator";

export default function VLLMServingArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <ServingEngineSeriesLocator current="lifecycle" />
      <Overview />
      <EngineLoop onCodeRef={sidebar.open} />
      <ServingArchitecture />
      <ServingEngineMapReturn current="lifecycle" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ vllm: vllmServingTree }}
        projectMetas={{
          vllm: {
            id: "vllm",
            label: "vLLM · Python",
            badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
          },
        }}
      />
    </>
  );
}
