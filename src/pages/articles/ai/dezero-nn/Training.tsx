import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import TrainingViz from "./viz/TrainingViz";

export default function Training({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">학습 루프는 loss를 계산하고 상태를 한 번만 갱신합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          한 스텝은 batch forward, loss 계산, gradient 초기화, backward, optimizer update로 이어집니다. gradient를 누적해 큰 effective batch를 만들 의도가 없다면 이전 스텝의 gradient를 반드시 비워야 하며, 평가 구간에서는 그래프 기록과 dropout을 끄고 파라미터 update를 실행하지 않습니다.
        </p>
        <p>
          Mean squared error는 기존 Sub, Pow, Sum, Div 연산을 조합해 구현할 수 있어 자동 미분의 composability를 보여 줍니다. 반면 softmax cross-entropy는 logits에서 행별 최댓값을 빼는 log-sum-exp trick을 적용하고, forward와 backward를 한 Function으로 묶으면 수치 안정성과 메모리 사용을 함께 관리하기 쉽습니다.
        </p>
      </div>
      <div className="not-prose my-8"><TrainingViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>loss 값만 보지 말고 단계별 검증을 둡니다</h3>
        <p>
          작은 고정 batch에서 loss가 감소하는지 확인하고, 각 연산의 analytic gradient를 finite difference와 비교합니다. 이어서 seed, optimizer step, train/eval mode를 저장해 같은 조건에서 결과가 재현되는지 확인하면, 학습 실패가 데이터 문제인지 자동 미분이나 상태 관리 문제인지 빠르게 분리할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
