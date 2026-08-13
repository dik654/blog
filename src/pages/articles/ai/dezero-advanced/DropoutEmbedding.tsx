import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import DropEmbedViz from "./viz/DropEmbedViz";

export default function DropoutEmbedding({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="dropout-embedding" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Dropout과 Embedding은 forward의 선택 정보를 backward에 재사용합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Inverted dropout은 학습 중 확률 <code>p</code>로 원소를 0으로 만들고, 남은 값에 <code>1/(1-p)</code>를 곱해 출력의 기댓값을 유지합니다. backward에서도 같은 mask를 사용해야 하므로 forward에서 생성한 mask를 저장합니다. 평가 모드에서는 무작위성을 제거하고 입력을 그대로 반환합니다.
        </p>
        <p>
          Embedding은 정수 ID에 해당하는 weight 행을 선택하는 lookup입니다. one-hot vector와 전체 행렬을 곱하는 대신 필요한 행만 읽기 때문에 계산량을 줄일 수 있습니다. backward는 forward에서 사용한 ID를 기억했다가 해당 행에 gradient를 scatter-add하며, 같은 ID가 여러 번 나오면 기여를 합산합니다.
        </p>
      </div>
      <div className="not-prose my-8"><DropEmbedViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>실행 모드와 랜덤 상태도 재현 대상입니다</h3>
        <p>
          Dropout의 train/eval 전환을 전역 boolean 하나로만 관리하면 중첩 평가나 병렬 실행에서 상태가 새기 쉽습니다. 가능하면 모델 또는 execution context에 모드를 명시하고, RNG seed와 state도 checkpoint에 포함합니다. Embedding은 음수·범위 밖 ID를 명확히 거부하고 padding index의 gradient 처리 정책도 별도로 정해야 합니다.
        </p>
      </div>
    </section>
  );
}
