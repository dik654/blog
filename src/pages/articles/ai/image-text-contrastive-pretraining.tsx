import { CodeSidebar, useCodeSidebar } from "@/components/code";
import Overview from "./image-text-contrastive-pretraining/Overview";
import SoftmaxLoss from "./image-text-contrastive-pretraining/SoftmaxLoss";
import SigmoidLoss from "./image-text-contrastive-pretraining/SigmoidLoss";
import BatchAndNegatives from "./image-text-contrastive-pretraining/BatchAndNegatives";
import ZeroShot from "./image-text-contrastive-pretraining/ZeroShot";
import Boundary from "./image-text-contrastive-pretraining/Boundary";
import { codeRefs } from "./image-text-contrastive-pretraining/codeRefs";
import { transformersTree } from "./image-text-contrastive-pretraining/fileTree";

const PROJECT_META = {
  transformers: {
    id: "transformers",
    label: "Transformers · CLIP · SigLIP",
    badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700",
  },
};

/**
 * 이미지와 문장을 같은 공간에 맞추는 두 가지 손실
 *
 * 코드 인용은 huggingface/transformers @ f62dc9bf2c90 스냅샷을 가리킨다.
 */
export default function ImageTextContrastivePretrainingArticle() {
  const sidebar = useCodeSidebar();
  return (
    <div className="space-y-16">
      <Overview />
      <SoftmaxLoss onCodeRef={sidebar.open} />
      <SigmoidLoss onCodeRef={sidebar.open} />
      <BatchAndNegatives />
      <ZeroShot />
      <Boundary />
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
