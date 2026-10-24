import { CodeSidebar, useCodeSidebar } from "@/components/code";
import Overview from "./sam3-promptable-concept-segmentation/Overview";
import PcsTask from "./sam3-promptable-concept-segmentation/PcsTask";
import Detector from "./sam3-promptable-concept-segmentation/Detector";
import PresenceHead from "./sam3-promptable-concept-segmentation/PresenceHead";
import VideoTracker from "./sam3-promptable-concept-segmentation/VideoTracker";
import DataEngine from "./sam3-promptable-concept-segmentation/DataEngine";
import { codeRefs } from "./sam3-promptable-concept-segmentation/codeRefs";
import { sam3Tree } from "./sam3-promptable-concept-segmentation/fileTree";
import { EmbodiedVisionLocator, EmbodiedVisionMapReturn } from "./shared/EmbodiedVisionLocator";

const PROJECT_META = {
  sam3: {
    id: "sam3",
    label: "SAM 3 · PyTorch",
    badgeClass: "bg-emerald-500/10 border-emerald-500 text-emerald-700",
  },
};

/**
 * SAM 3는 이름으로 개념을 받아 모든 인스턴스를 분할합니다
 *
 * 코드 인용은 facebookresearch/sam3 @ 660a5e9e 스냅샷을 가리킨다.
 */
export default function Sam3PromptableConceptSegmentationArticle() {
  const sidebar = useCodeSidebar();
  return (
    <div className="space-y-16">
      <EmbodiedVisionLocator
        current="sam3"
        question="위치를 찍지 않고 이름만 주었을 때, 같은 개념의 모든 개체와 ‘없음’을 어떻게 함께 답할까요?"
        fixture="버스 네 대가 있는 한 이미지에 점·‘버스’·‘소방차’ 프롬프트를 차례로 넣어 출력이 어떻게 달라지는지 추적합니다."
        parentHref="/cs/ai/multimodal-retrieval-and-visual-grounding#grounding"
        parentLabel="문장과 이미지 영역을 연결하는 grounding"
      />
      <Overview />
      <PcsTask />
      <Detector onCodeRef={sidebar.open} />
      <PresenceHead onCodeRef={sidebar.open} />
      <VideoTracker />
      <DataEngine />
      <EmbodiedVisionMapReturn
        title="개념 분할은 grounding에 존재 판단·개체 수·프레임 간 정체성 계약을 더합니다."
        detail="‘어디인가’만 답하던 지도를 ‘있는가, 몇 개인가, 다음 프레임에서도 같은 개인가’까지 확장했습니다. 다음 글은 이 의미 출력을 물리 행동으로 바꾸는 경계를 추적합니다."
        nextHref="/cs/ai/vla-embodiment-gap"
        nextLabel="의미와 행동 사이의 실행 경계"
      />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ sam3: sam3Tree }}
        projectMetas={PROJECT_META}
      />
    </div>
  );
}
