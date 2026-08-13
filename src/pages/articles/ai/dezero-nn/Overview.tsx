import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import OverviewViz from "./viz/OverviewViz";

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">자동 미분 다음에는 파라미터와 학습 상태를 관리해야 합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          앞 글의 자동 미분 엔진만으로도 개별 함수의 gradient는 구할 수 있습니다. 그러나 신경망을 학습하려면 모델에 속한 파라미터를 빠짐없이 찾고, 예측과 loss를 계산한 뒤, optimizer가 같은 파라미터를 반복해서 갱신하도록 공통 구조를 만들어야 합니다.
        </p>
        <p>
          이 글에서는 <code>Layer</code>와 <code>Model</code>의 역할을 먼저 정한 뒤 Linear, activation, SGD·Adam, 전체 학습 루프 순서로 확장합니다. PyTorch API를 그대로 복제하기보다 각 상태가 어느 객체에 속해야 하는지와, 다음 단계가 이전 단계의 어떤 계약에 의존하는지를 중심으로 봅니다.
        </p>
      </div>
      <div className="not-prose my-8"><OverviewViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          구현을 따라갈 때는 매 단계마다 shape test와 수치 gradient check를 유지하는 편이 좋습니다. forward 값이 맞아도 broadcasting이나 gradient 누적이 틀릴 수 있기 때문입니다. 이 기본 학습 루프가 안정적으로 동작한 다음에야 시퀀스 상태, normalization, dropout 같은 기능을 추가할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
