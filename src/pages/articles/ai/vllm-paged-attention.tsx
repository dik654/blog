import Overview from "./vllm-paged-attention/Overview";
import BlockPoolSection from "./vllm-paged-attention/BlockPoolSection";
import KVCacheManagerSection from "./vllm-paged-attention/KVCacheManagerSection";
import PrefixCaching from "./vllm-paged-attention/PrefixCaching";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./vllm-paged-attention/codeRefs";
import { vllmPagedAttentionTree } from "./vllm-paged-attention/fileTree";
import {
  ServingEngineMapReturn,
  ServingEngineSeriesLocator,
} from "./shared/ServingEngineSeriesLocator";

export default function VLLMPagedAttentionArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <ServingEngineSeriesLocator current="allocation" />
      <Overview />
      <BlockPoolSection onCodeRef={sidebar.open} />
      <KVCacheManagerSection onCodeRef={sidebar.open} />
      <PrefixCaching onCodeRef={sidebar.open} />
      <ServingEngineMapReturn current="allocation" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ vllm: vllmPagedAttentionTree }}
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
