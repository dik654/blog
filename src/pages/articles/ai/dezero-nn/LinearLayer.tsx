import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import LinearViz from "./viz/LinearViz";

export default function LinearLayer({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="linear" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Linear layer는 shape와 초기화까지 포함한 affine transform입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Linear layer의 순전파는 <code>y = xW + b</code>로 짧지만, 구현에서는 입력과 weight의 차원, 배치 축, bias broadcasting을 먼저 고정해야 합니다. 이 계약이 모호하면 forward는 우연히 동작해도 backward에서 잘못된 축으로 gradient가 합산될 수 있습니다.
        </p>
        <p>
          weight는 입력 차원에 따라 분산을 조절하는 Xavier 계열 초기화로 시작합니다. 예제 구현은 seed를 가진 LCG로 균등 난수를 만들고 Box–Muller transform으로 정규분포를 생성하므로 외부 RNG 없이 결과를 재현할 수 있습니다. 다만 실제 학습 라이브러리라면 검증된 RNG와 초기화 구현을 사용하는 편이 안전합니다.
        </p>
      </div>
      <div className="not-prose my-8"><LinearViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>backward는 두 개의 행렬곱으로 돌아갑니다</h3>
        <p>
          출력 gradient가 <code>gy</code>일 때 입력 쪽은 <code>gyWᵀ</code>, weight 쪽은 <code>xᵀgy</code>로 계산합니다. bias gradient는 배치 축을 합산해야 합니다. 이 세 결과의 shape를 수치 gradient와 비교하면 행렬곱과 broadcasting 구현을 함께 검증할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
