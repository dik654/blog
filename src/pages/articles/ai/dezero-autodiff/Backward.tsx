import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import BackwardViz from "./viz/BackwardViz";

export default function Backward({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="backward" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">역전파에서는 순서와 gradient 누적이 정확해야 합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          출력 Variable의 gradient를 1로 초기화한 뒤 creator를 따라가면 각 Function의 <code>backward()</code>가 출력 gradient를 입력 gradient로 바꿉니다. 처리할 Function은 generation 기준으로 꺼내므로, 아직 필요한 gradient가 계산되지 않은 연산을 먼저 실행하는 일을 피할 수 있습니다.
        </p>
        <p>
          같은 Variable이 여러 연산에 쓰였다면 역전파 경로도 여러 개로 갈라졌다가 다시 합쳐집니다. 이때 새 gradient로 기존 값을 덮어쓰면 한 경로의 기여가 사라지므로 <code>prev + gx</code>로 합산해야 합니다. gradient accumulation은 부가 기능이 아니라 올바른 chain rule을 위한 필수 조건입니다.
        </p>
      </div>
      <div className="not-prose my-8"><BackwardViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>중간 gradient의 수명도 정책으로 정합니다</h3>
        <p>
          메모리를 줄이려면 역전파가 끝난 중간 출력의 gradient를 비울 수 있지만, 사용자가 gradient를 검사하거나 고차 미분을 수행할 때는 남겨야 합니다. 따라서 <code>retain_grad</code> 같은 옵션으로 수명 정책을 분리하면 기본 학습은 가볍게 유지하면서 디버깅과 연구 기능도 지원할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
