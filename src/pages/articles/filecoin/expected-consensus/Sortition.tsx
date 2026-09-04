import PoissonSortitionViz from "./viz/PoissonSortitionViz";
import SortitionDetailViz from "./viz/SortitionDetailViz";
import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}

export default function Sortition({ onCodeRef }: Props) {
  return (
    <section id="sortition" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Sortition은 storage power를 epoch별 win count로 바꾼다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Expected Consensus에서 각 provider는 chain randomness와 자신의 election proof를 사용해 독립적으로 win count를 계산하며
          quality-adjusted power가 클수록 하나 이상의 win을 얻을 확률이 높아집니다. 모든 provider가 서로 통신한 뒤 leader를 한 명 고르는 방식이
          아닙니다.
        </p>
        <p>
          여기서 Poisson이 뜻하는 것은 전체 당선 수와 provider별 당선 수가 확률 분포를 따른다는 것입니다. 특정 provider가 반드시 한 번 당선된다는 뜻은 아닙니다.
          Expected leader 수와 proof domain 같은 값은 protocol version의 parameter이므로 현재 Lotus code와 network 설정에서
          확인합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <PoissonSortitionViz />
      </div>
      <div className="not-prose mb-8">
        <SortitionDetailViz onOpenCode={onCodeRef} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Randomness와 election proof를 구분한다</h3>
        <p>
          Drand beacon은 여러 참여자가 만든 외부 randomness를 제공하고 provider의 election proof는 그 값을 특정 epoch와 provider
          identity에 결합합니다. Drand를 단순히 “조작 불가능”하다고 표현하기보다 threshold assumption, beacon availability와 chain의
          domain separation을 함께 확인합니다.
        </p>
        <h3>Win count는 reward의 고정 금액이 아니다</h3>
        <p>
          Win count는 block header와 chain weight 계산에 들어가는 protocol input입니다. 실제 reward와 pledge는 emission, actor
          state, sector quality와 network version에 따라 변합니다. 과거의 FIL 금액이나 고정 multiplier를 현재 규칙처럼 쓰면 값이 어긋납니다.
        </p>
      </div>
    </section>
  );
}
