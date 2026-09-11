import { CodeSidebar, useCodeSidebar } from "@/components/code";
import Overview from "./sam3-promptable-concept-segmentation/Overview";
import PcsTask from "./sam3-promptable-concept-segmentation/PcsTask";
import Detector from "./sam3-promptable-concept-segmentation/Detector";
import PresenceHead from "./sam3-promptable-concept-segmentation/PresenceHead";
import VideoTracker from "./sam3-promptable-concept-segmentation/VideoTracker";
import DataEngine from "./sam3-promptable-concept-segmentation/DataEngine";
import { codeRefs } from "./sam3-promptable-concept-segmentation/codeRefs";
import { sam3Tree } from "./sam3-promptable-concept-segmentation/fileTree";

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
      <Overview />
      <PcsTask />
      <Detector onCodeRef={sidebar.open} />
      <PresenceHead onCodeRef={sidebar.open} />
      <VideoTracker />
      <DataEngine />
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
