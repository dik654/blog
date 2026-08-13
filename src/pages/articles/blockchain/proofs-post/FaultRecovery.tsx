import FaultViz from "./viz/FaultViz";
import type { CodeRef } from "@/components/code/types";

export default function FaultRecovery({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="fault-recovery" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Fault와 recovery는 proof 실패를 actor state와 경제 상태로 반영한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          WindowPoSt를 제출하지 못하거나 sector를 사용할 수 없게 되면 해당
          sector는 fault 상태로 들어갈 수 있습니다. Provider가 미리 fault를
          선언한 경우와 protocol이 누락을 감지한 경우는 처리 경로와 비용이
          다를 수 있으므로 같은 장애로 묶어 설명하면 안 됩니다.
        </p>
        <p>
          Data를 다시 사용할 수 있게 만든 뒤에는 recovery declaration과 다음
          proving 결과가 actor state에 반영되어야 power가 회복됩니다. 파일을
          복사해 둔 것만으로 on-chain recovery가 끝나는 것은 아닙니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <FaultViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Penalty와 유예 기간은 현재 actor code에서 읽는다</h3>
        <p>
          Fault fee, continued-fault penalty, termination condition과 recovery
          timing은 actor version과 sector 상태에 따라 계산됩니다. 과거의 고정
          FIL 금액이나 “N일이면 모두 복구” 같은 문구 대신 event별 state
          transition, power delta와 실제 charge를 기록해야 합니다.
        </p>
      </div>
    </section>
  );
}
