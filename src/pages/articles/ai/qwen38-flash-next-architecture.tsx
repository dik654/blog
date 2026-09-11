import { CodeSidebar, useCodeSidebar } from "@/components/code";
import Overview from "./qwen38-flash-next-architecture/Overview";
import QsaIndex from "./qwen38-flash-next-architecture/QsaIndex";
import GatedResidual from "./qwen38-flash-next-architecture/GatedResidual";
import PleNgram from "./qwen38-flash-next-architecture/PleNgram";
import ParamClasses from "./qwen38-flash-next-architecture/ParamClasses";
import RequestState from "./qwen38-flash-next-architecture/RequestState";
import { codeRefs } from "./qwen38-flash-next-architecture/codeRefs";
import { transformersTree } from "./qwen38-flash-next-architecture/fileTree";

const PROJECT_META = {
  transformers: {
    id: "transformers",
    label: "Transformers · qwen4_exp",
    badgeClass: "bg-amber-500/10 border-amber-500 text-amber-700",
  },
};

/**
 * Qwen3.8-Flash-Next는 선형과 희소 attention을 층마다 나눠 씁니다
 *
 * 코드 인용은 huggingface/transformers @ f62dc9bf2c90 (2026-09-04) 의
 * qwen4_exp reference 구현 스냅샷을 가리킨다. 스냅샷은 codebase/ 아래에 pin 돼 있다.
 */
export default function Qwen38FlashNextArchitectureArticle() {
  const sidebar = useCodeSidebar();
  return (
    <div className="space-y-16">
      <Overview onCodeRef={sidebar.open} />
      <QsaIndex onCodeRef={sidebar.open} />
      <GatedResidual onCodeRef={sidebar.open} />
      <PleNgram onCodeRef={sidebar.open} />
      <ParamClasses />
      <RequestState />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ transformers: transformersTree }}
        projectMetas={PROJECT_META}
      />
    </div>
  );
}
