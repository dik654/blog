import ExplainedFormula from "@/components/ui/explained-formula";
import CometBFTCoreViz from "../cometbft-core-viz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Timeout({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="timeout" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Timeout은 실패 판결이 아니라 더 높은 round로 넘어갈 조건이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Proposal이나 quorum이 제때 도착하지 않으면 node는 해당 step의 timeout event를 예약합니다. Event에는 H/R/S가
          들어 있어야 하며, 처리 시점의 current state와 맞지 않는 오래된 timer는 무시합니다. 그렇지 않으면 이미
          precommit이나 다음 round에 간 node가 늦은 timer 때문에 뒤로 이동할 수 있습니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="handleTimeout()" onClick={() => onCodeRef("handle-timeout", codeRefs["handle-timeout"])} />
      </div>
      <CometBFTCoreViz mode="timeout" />
      <ExplainedFormula
        question="Round가 반복될수록 정상 message를 기다릴 예산을 어떻게 늘릴까요?"
        idea={<>초기 timeout에 round별 delta를 더하는 단순 schedule은 network delay가 안정된 뒤 언젠가 기다림이 실제 delay를 넘도록 만듭니다. Step별 base와 delta는 따로 둡니다.</>}
        formula={String.raw`T_s(r)=T_{s,0}+r\,\Delta_s`}
        annotatedFormula={String.raw`T_s(r)=\underbrace{T_{s,0}+r\,\Delta_s}_{\text{변화량 계산}}`}
        operations={[
          { expression: String.raw`T_{s,0}+r\,\Delta_s`, annotation: ["인접한 level의 차이를 남겨 변화량을 계산합니다.","초기 timeout에 round별 delta를 더하는 단순","schedule은 network delay가 안정된 뒤 언젠가","기다림이 실제 delay를 넘도록 만듭니다."] },
        ]}
        terms={[
          { symbol: "s", name: "Consensus step", description: "Propose·Prevote·Precommit 중 timer step입니다." },
          { symbol: "r", name: "Round", description: "현재 round 번호입니다." },
          { symbol: "T_{s,0}", name: "Base timeout", description: "Step s의 초기 waiting budget입니다." },
          { symbol: String.raw`\Delta_s`, name: "Round delta", description: "Round가 하나 늘 때 추가하는 waiting budget입니다." },
        ]}
        assumptions={["Event는 예약한 height·round·step과 처리 시 current state를 다시 대조합니다.", "Partial synchrony에서 GST 이후 message·processing delay에 상한이 생긴다고 가정합니다.", "실제 config 함수와 단위는 배포한 release·configuration에서 확인합니다."]}
        interpretation="T가 결국 안정된 delay보다 커지면 honest proposer와 vote가 같은 round에 모일 기회가 생깁니다. GST 이전 halt나 특정 p95 latency를 이 식만으로 실패·성능 보장이라 판단할 수는 없습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>운영에서는 너무 짧음과 너무 김을 같은 실험에서 봅니다</h3>
        <p>
          Timeout이 너무 짧으면 정상 message도 놓쳐 round churn과 vote traffic이 늘고, 너무 길면 faulty proposer를 오래
          기다립니다. 같은 validator set·latency/loss schedule에서 commit latency, rounds per height, nil vote power,
          stale timeout count, message bytes를 paired 측정하고 safety hard gate를 먼저 통과시킵니다.
        </p>
      </div>
    </section>
  );
}
