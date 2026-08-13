import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import OverviewViz from "./viz/OverviewViz";

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">상태가 있는 레이어는 시간과 실행 모드까지 계약에 포함합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          일반적인 feed-forward layer는 현재 입력만으로 출력을 만들지만 RNN과 LSTM은 이전 시점의 상태도 함께 사용합니다. 그래서 forward 식만 구현해서는 부족하며, 시퀀스 시작 시 상태를 초기화하는 시점과 truncated BPTT에서 그래프를 끊는 경계까지 명시해야 합니다.
        </p>
        <p>
          이 글은 RNN과 LSTM의 상태 경로를 비교한 뒤 LayerNorm, dropout, embedding으로 범위를 넓힙니다. 서로 다른 기능처럼 보이지만, 모두 forward에서 만든 정보나 실행 모드를 backward 및 다음 호출에 안전하게 전달해야 한다는 공통 과제를 갖습니다.
        </p>
      </div>
      <div className="not-prose my-8"><OverviewViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          시퀀스 모델의 gradient 경로를 먼저 이해하고 LSTM cell을 구현한 다음, feature 축 정규화와 train/eval 분기를 추가합니다. 각 기능은 앞 글에서 만든 파라미터 순회와 자동 미분 계약을 그대로 재사용하므로, 세 글을 순서대로 읽으면 미니 프레임워크가 단계적으로 확장되는 구조를 확인할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
