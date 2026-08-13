import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import LstmViz from "./viz/LstmViz";

export default function LstmCell({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="lstm" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">LSTM cell은 네 projection과 두 상태 업데이트로 구성됩니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          현재 입력과 이전 hidden state는 forget, input, output gate와 candidate를 위한 네 개의 projection으로 들어갑니다. 세 gate에는 sigmoid를 적용해 0과 1 사이의 비율을 만들고, candidate에는 tanh를 적용해 새로 기록할 내용을 만듭니다.
        </p>
        <p>
          먼저 <code>c = f*c_prev + i*g</code>로 cell state를 갱신한 뒤 <code>h = o*tanh(c)</code>로 hidden state를 만듭니다. 첫 시점에는 이전 상태가 없으므로 0으로 초기화하거나 별도 분기로 처리할 수 있지만, 두 방식이 batch size와 device·dtype을 일관되게 유지하는지 확인해야 합니다.
        </p>
      </div>
      <div className="not-prose my-8"><LstmViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>한 번의 큰 projection으로 합칠 수도 있습니다</h3>
        <p>
          교육용 구현은 gate별 Linear를 나누면 흐름을 읽기 쉽지만, 실제 프레임워크는 보통 네 projection을 하나의 큰 행렬곱으로 합친 뒤 결과를 분할합니다. 이렇게 하면 kernel launch와 메모리 접근을 줄일 수 있습니다. 먼저 분리 구현으로 수치가 맞는지 검증한 다음 fused 형태와 결과를 비교하는 순서가 안전합니다.
        </p>
      </div>
    </section>
  );
}
