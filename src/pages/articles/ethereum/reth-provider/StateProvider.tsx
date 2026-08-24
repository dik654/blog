import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function StateProvider({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="state-provider" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">StateProvider는 account·storage·bytecode를 같은 view identity 아래에서 읽는다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("provider-trait", codeRefs["provider-trait"])} />
      </div>
      <ExplainedFormula
        question="Execution overlay가 있는 query는 key k를 어느 source에서 읽어야 할까요?"
        idea="이번 실행에서 k가 변경됐다면 overlay 값을 우선하고, 변경 기록이 없을 때만 pinned base snapshot으로 내려갑니다. 삭제 tombstone도 ‘없음’과 구분된 overlay 값입니다."
        formula={String.raw`R_V(k)=\begin{cases}O_V(k),&k\in\operatorname{dom}(O_V)\\B_V(k),&\text{otherwise}\end{cases}`}
        annotatedFormula={String.raw`\underbrace{R_V(k)}_{\text{view read 결과 계산}}=\begin{cases}O_V(k),&k\in\operatorname{dom}(O_V)\\B_V(k),&\text{otherwise}\end{cases}`}
        operations={[
          { expression: String.raw`R_V(k)`, annotation: ["view read 결과이(가) 식의 결과에 기여하는 방식을","계산합니다.","이번 실행에서 k가 변경됐다면 overlay 값을 우선하고,","변경 기록이 없을 때만 pinned base"] },
        ]}
        terms={[
          { symbol: "R_V(k)", name: "view read 결과", description: "view V에서 key k를 조회한 value 또는 typed absence" },
          { symbol: "O_V", name: "overlay", description: "view V의 미커밋·실행 중 변경과 tombstone" },
          { symbol: "B_V", name: "base snapshot", description: "같은 block/root/generation에 고정한 DB·history view" },
          { symbol: "\\operatorname{dom}(O_V)", name: "overlay key 집합", description: "값 변경 또는 삭제가 명시된 key들" },
        ]}
        assumptions={["Overlay와 base가 같은 parent/block context에 속합니다.", "Tombstone·not-found·pruned·I/O error를 서로 다른 outcome으로 보존합니다.", "View V가 stale해지면 다른 generation을 조용히 섞지 않고 retryable error를 반환합니다."]}
        interpretation="Base balance가 10이고 overlay가 7이면 7을 읽습니다. Overlay tombstone이면 base의 10으로 fallback하지 않고 삭제된 account로 읽어야 합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Provider factory는 latest·pending·historical 요청을 canonical hash와 state root로 resolve한 뒤 view handle을 만듭니다. Account와
          storage slot 두 번의 호출 사이에도 같은 handle을 써야 하며, latest를 매 method에서 다시 resolve하면 reorg 중 mixed state가 됩니다.
        </p>
        <p>
          `None`은 존재하지 않음일 수 있지만 pruned history, unknown block, corrupt segment와 backend error는 별도입니다. Caller가
          archive query 실패를 zero balance로 바꾸지 않도록 typed outcome과 source tier·coverage를 반환합니다.
        </p>
      </div>
    </section>
  );
}
