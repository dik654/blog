import { CodeSidebar, useCodeSidebar } from "@/components/code";
import Overview from "./dinov3-self-supervised-backbone/Overview";
import TwoObjectives from "./dinov3-self-supervised-backbone/TwoObjectives";
import DenseCollapse from "./dinov3-self-supervised-backbone/DenseCollapse";
import GramAnchoring from "./dinov3-self-supervised-backbone/GramAnchoring";
import PostHoc from "./dinov3-self-supervised-backbone/PostHoc";
import UseBoundary from "./dinov3-self-supervised-backbone/UseBoundary";
import { codeRefs } from "./dinov3-self-supervised-backbone/codeRefs";
import { dinov3Tree } from "./dinov3-self-supervised-backbone/fileTree";

const PROJECT_META = {
  dinov3: {
    id: "dinov3",
    label: "DINOv3 · PyTorch",
    badgeClass: "bg-indigo-500/10 border-indigo-500 text-indigo-700",
  },
};

/**
 * DINOv3는 dense feature 붕괴를 Gram anchoring으로 막습니다
 *
 * 코드 인용은 facebookresearch/dinov3 @ 11c58638 스냅샷을 가리킨다.
 * 스냅샷은 codebase/dinov3 아래에 pin 돼 있다.
 */
export default function Dinov3SelfSupervisedBackboneArticle() {
  const sidebar = useCodeSidebar();
  return (
    <div className="space-y-16">
      <Overview />
      <TwoObjectives onCodeRef={sidebar.open} />
      <DenseCollapse />
      <GramAnchoring onCodeRef={sidebar.open} />
      <PostHoc />
      <UseBoundary />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ dinov3: dinov3Tree }}
        projectMetas={PROJECT_META}
      />
    </div>
  );
}
