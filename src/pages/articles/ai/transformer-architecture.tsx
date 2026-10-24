import Overview from "./transformer-architecture/Overview";
import DataPrep from "./transformer-architecture/DataPrep";
import InputEmbedding from "./transformer-architecture/InputEmbedding";
import QKVComputation from "./transformer-architecture/QKVComputation";
import FeedForward from "./transformer-architecture/FeedForward";
import LinearSoftmax from "./transformer-architecture/LinearSoftmax";
import Training from "./transformer-architecture/Training";
import ScalingLaws from "./transformer-architecture/ScalingLaws";
import Summary from "./transformer-architecture/Summary";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./transformer-architecture/codeRefs";
import { transformerArchitectureTree } from "./transformer-architecture/fileTree";
import { NlpFoundationLocator, NlpMapReturn } from "./shared/NlpFoundationLocator";

export default function TransformerArchitecture() {
  const sidebar = useCodeSidebar();

  return (
    <div className="space-y-12">
      <NlpFoundationLocator
        current="transformer"
        question="순차 recurrent state 없이도 모든 token 위치가 필요한 정보를 읽고, 각 위치의 feature를 바꿀 수 있을까요?"
        fixture="[BOS, 나는, 밥을] 세 token을 ID·position·causal mask에서 시작해 attention → residual → FFN → vocabulary logits까지 추적합니다."
        parentHref="/cs/ai/attention-theory#self-attention"
        parentLabel="Q·K·V로 필요한 위치를 읽는 self-attention"
        secondaryHref="/cs/ai/tokenizer#token-id-embedding-matrix"
        secondaryLabel="Token ID와 embedding row의 계약"
      />
      <Overview />
      <DataPrep />
      <InputEmbedding />
      <QKVComputation onCodeRef={sidebar.open} />
      <FeedForward />
      <LinearSoftmax />
      <Training />
      <ScalingLaws />
      <Summary onCodeRef={sidebar.open} />
      <NlpMapReturn
        title="Transformer block은 attention만이 아니라 token mixer·feature mixer·residual transport가 함께 만드는 반복 계산입니다."
        detail="BERT는 이 계산을 버리지 않고, 입력 전체를 볼 수 있는 encoder visibility와 masked-token pretraining을 선택합니다."
        nextHref="/cs/ai/bert"
        nextLabel="BERT encoder로 이어가기"
      />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torch: transformerArchitectureTree }}
        projectMetas={{
          torch: {
            id: "torch",
            label: "PyTorch · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </div>
  );
}
