import ValidationDetailViz from "./viz/ValidationDetailViz";
import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}

export default function BlockValidation({ onCodeRef }: Props) {
  return (
    <section id="validation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Block validation은 구조·state·proof 검사를 한 결과로 합친다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          수신한 block은 header 형식만 맞는다고 유효해지지 않습니다. Parent와 height·timestamp 관계를 확인하고 해당 시점의 state에서 miner
          identity와 power를 읽습니다. 그다음 election proof, WinningPoSt, signature와 message commitment를 검증합니다.
        </p>
        <p>
          서로 독립적인 검사를 goroutine으로 겹칠 수 있지만 모든 검사가 같은 parent state와 network version을 사용해야 합니다. “몇 개 goroutine,
          몇 초” 같은 값은 protocol이 아니라 구현과 hardware의 결과입니다. 그래서 trace에서 state load, proof verification과 message
          validation 시간을 나눠 측정합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <ValidationDetailViz onOpenCode={onCodeRef} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Lookback state는 finality 숫자의 별칭이 아니다</h3>
        <p>
          Power와 worker key 같은 validation input은 protocol이 지정한 lookback state에서 읽습니다. 이 규칙을 단순히 “오래된 reorg를 막기
          위한 N epoch”로 축약하면 active network version의 randomness와 state lookback 규칙을 놓칩니다.
        </p>
        <h3>성공 결과는 후보 자격을 뜻한다</h3>
        <p>
          Validation을 통과한 block은 tipset과 chain-selection 후보가 됩니다. 다만 곧바로 canonical head나 finalized checkpoint가
          되지는 않습니다. 이후의 선택과 확정 경계는 EC weight와 F3가 각각 결정합니다.
        </p>
      </div>
    </section>
  );
}
