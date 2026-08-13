import WeightDetailViz from "./viz/WeightDetailViz";
import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}

export default function WeightCalculation({ onCodeRef }: Props) {
  return (
    <section id="weight" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Chain weight는 유효한 후보 중 EC head를 고르는 비교값이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Filecoin node는 단순히 block 수가 많은 branch를 따르지 않습니다.
          Parent weight에 network power와 tipset의 win count를 반영한 증가분을
          더하고, 더 큰 누적 weight를 가진 유효한 chain을 local head로
          선택합니다.
        </p>
        <p>
          정확한 scale factor와 산술 순서는 consensus-critical code입니다.
          설명용 식을 protocol 상수처럼 복사하기보다 현재 Lotus의
          <code> Weight</code> 구현, actor에서 읽은 power와 network version을
          한 fixture에 고정해 계산 결과를 비교해야 합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <WeightDetailViz onOpenCode={onCodeRef} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Weight와 finality는 해결하는 문제가 다르다</h3>
        <p>
          Weight는 경쟁하는 EC branch 사이의 head를 고르지만 그 자체로
          irreversible finality를 만들지는 않습니다. F3 certificate를 적용한
          뒤에는 finalized checkpoint와 충돌하는 후보를 별도 규칙으로 다루며,
          “weight가 크면 언제나 되돌릴 수 있다”는 해석도 성립하지 않습니다.
        </p>
        <h3>공격 비용은 고정 비율이나 달러 금액으로 쓰지 않는다</h3>
        <p>
          실제 안전성은 power distribution, collateral, proof availability,
          network synchrony와 F3 quorum assumption에 함께 의존합니다. 특정
          power 비율이나 장비 비용 하나로 공격 가능성을 단정하지 말고,
          관찰하려는 failure mode별 전제를 명시해야 합니다.
        </p>
      </div>
    </section>
  );
}
