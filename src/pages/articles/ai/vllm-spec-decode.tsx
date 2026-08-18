import Overview from "./vllm-spec-decode/Overview";
import DraftVerify from "./vllm-spec-decode/DraftVerify";
import EagleMtp from "./vllm-spec-decode/EagleMtp";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./vllm-spec-decode/codeRefs";
import { vllmSpecDecodeTree } from "./vllm-spec-decode/fileTree";

export default function VLLMSpecDecodeArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <DraftVerify onCodeRef={sidebar.open} />
      <EagleMtp />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ vllm: vllmSpecDecodeTree }}
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
