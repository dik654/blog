import { CodeSidebar, useCodeSidebar } from "@/components/code";
import Foundations from "./llama-cpp-local-inference/Foundations";
import SourceTrace from "./llama-cpp-local-inference/SourceTrace";
import Streams from "./llama-cpp-local-inference/Streams";
import Weights from "./llama-cpp-local-inference/Weights";
import Offload from "./llama-cpp-local-inference/Offload";
import { codeRefs } from "./llama-cpp-local-inference/codeRefs";
import { llamaCppTrees } from "./llama-cpp-local-inference/fileTree";
import {
  InferenceRuntimeMapReturn,
  InferenceRuntimeSeriesLocator,
} from "./shared/InferenceRuntimeSeriesLocator";

export default function LlamaCppLocalInferenceArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string) => sidebar.open(key, codeRefs[key]);

  return (
    <>
      <InferenceRuntimeSeriesLocator current="local" />
      <div className="space-y-16">
        <Foundations />
        <SourceTrace code={code} />
        <Streams code={code} />
        <Weights code={code} />
        <Offload code={code} />
      </div>
      <InferenceRuntimeMapReturn current="local" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={llamaCppTrees}
        projectMetas={{
          "llama.cpp": {
            id: "llama.cpp",
            label: "llama.cpp 091b6a7 원문",
            badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
          },
        }}
      />
    </>
  );
}
