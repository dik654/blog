import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import ActivationViz from "./viz/ActivationViz";

export default function Activation({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="activation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Activation은 출력 범위와 gradient 흐름을 바꿉니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Linear layer만 여러 번 연결하면 전체 모델도 하나의 선형 변환으로 합쳐집니다. ReLU, sigmoid, tanh, GELU 같은 activation을 사이에 넣어야 입력에 따라 다른 비선형 경계를 학습할 수 있습니다. 따라서 선택 기준은 단순한 함수 모양이 아니라 사용 위치와 gradient 특성입니다.
        </p>
        <p>
          Sigmoid와 tanh는 forward 출력으로 각각 <code>y(1-y)</code>, <code>1-y²</code>을 계산할 수 있어 지수함수나 tanh를 다시 호출하지 않아도 됩니다. GELU의 tanh 근사를 사용한다면 forward 근사식과 정확히 대응하는 derivative를 구현해야 하며, 서로 다른 근사식을 섞지 않도록 테스트해야 합니다.
        </p>
      </div>
      <div className="not-prose my-8"><ActivationViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>표준 용어와 사용 위치를 구분합니다</h3>
        <p>
          Sigmoid는 이진 분류의 확률 출력이나 gate에 쓰이지만, 다중 클래스 분류의 마지막 층은 보통 softmax와 cross-entropy를 결합합니다. GELU 역시 Transformer에서 널리 쓰인다는 사실과 모든 모델에서 항상 최선이라는 주장은 다릅니다. 프레임워크 구현에서는 여러 함수를 제공하고 모델과 실험이 선택하도록 두는 편이 좋습니다.
        </p>
      </div>
    </section>
  );
}
