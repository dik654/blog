import Overview from "./resnet/Overview";
import SkipConnection from "./resnet/SkipConnection";
import Architecture from "./resnet/Architecture";
import Impact from "./resnet/Impact";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./resnet/codeRefs";
import { resnetTree } from "./resnet/fileTree";
import {
  VisionFoundationLocator,
  VisionMapReturn,
} from "./shared/VisionFoundationLocator";

export default function ResNetArticle() {
  const sidebar = useCodeSidebar();

  return (
    <div className="space-y-12">
      <VisionFoundationLocator
        current="resnet"
        question="깊은 CNN이 얕은 CNN보다 학습 오차까지 나빠질 때 입력을 보존하는 길은 무엇을 바꾸나요?"
        fixture="scalar x=5와 residual F(x)=−1을 더해 y=4를 만들고, upstream gradient 2가 shortcut과 residual Jacobian 0.25를 거쳐 2.5가 되는 과정을 추적합니다."
        parentHref="/cs/ai/cnn"
        parentLabel="CNN의 지역 계산과 feature map"
      />
      <Overview />
      <SkipConnection />
      <Architecture onCodeRef={sidebar.open} />
      <Impact />
      <VisionMapReturn
        title="ResNet은 새 정보를 계산하는 branch와 기존 state를 운반하는 path를 분리합니다."
        detail="이제 backbone이 만든 feature를 사진 하나, 물체 하나, pixel 하나 중 어떤 답 단위로 바꿀지 결정할 수 있습니다."
        nextHref="/cs/ai/vision-task-spatial-contracts"
        nextLabel="Vision task의 출력 좌표로 이동"
      />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torchvision: resnetTree }}
        projectMetas={{
          torchvision: {
            id: "torchvision",
            label: "torchvision · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </div>
  );
}
