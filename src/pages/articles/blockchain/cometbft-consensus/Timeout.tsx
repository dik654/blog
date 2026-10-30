import ExplainedFormula from "@/components/ui/explained-formula";
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
      <h2 className="mb-6 text-2xl font-bold">Timeout은 block 결정이 아니라 기다림의 상한을 정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Round 0의 proposer A가 늦으면 Propose timeout이 Prevote 진입을 유발합니다. 그러나 timer가 B41을 선택하거나 Commit을 만드는 것은
          아닙니다. 이후 어떤 block에 signed power가 모이는지는 VoteSet이 결정합니다. Timer에는 H/R/S가 들어가며, 처리 시점에 node가 이미 앞선
          좌표라면 버립니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="handleTimeout()" onClick={() => onCodeRef("handle-timeout", codeRefs["handle-timeout"])} />
      </div>
      <ExplainedFormula
        question="Round가 반복될수록 정상 message를 기다릴 예산을 어떻게 늘릴까요?"
        idea={<>초기 timeout에 round별 delta를 더하는 단순 schedule은 network delay가 안정된 뒤 언젠가 기다림이 실제 delay를 넘도록 만듭니다. Step별 base와 delta는 따로 둡니다.</>}
        formula={String.raw`T_s(r)=T_{s,0}+r\,\Delta_s`}
        annotatedFormula={String.raw`T_s(r)=\underbrace{T_{s,0}}_{\text{step의 첫 대기 예산}}+\underbrace{r\,\Delta_s}_{\text{round마다 늘린 예산}}`}
        operations={[
          { expression: String.raw`T_{s,0}`, annotation: ["Propose·Prevote·Precommit마다","따로 둔 round 0의 대기 예산"] },
          { expression: String.raw`r\,\Delta_s`, annotation: ["round가 하나 오를 때마다 Δ_s를 더 기다려","GST 뒤 안정된 delay를 결국 넘고","honest proposer와 vote가 한 round에 모임"] },
        ]}
        terms={[
          { symbol: "s", name: "Consensus step", description: "Propose·Prevote·Precommit 중 timer step입니다." },
          { symbol: "r", name: "Round", description: "현재 round 번호입니다." },
          { symbol: "T_{s,0}", name: "Base timeout", description: "Step s의 초기 waiting budget입니다." },
          { symbol: String.raw`\Delta_s`, name: "Round delta", description: "Round가 하나 늘 때 추가하는 waiting budget입니다." },
        ]}
        assumptions={["Event는 예약한 height·round·step과 처리 시 current state를 다시 대조합니다.", "Partial synchrony에서 GST 이후 message·processing delay에 상한이 생긴다고 가정합니다.", "실제 config 함수와 단위는 배포한 release·configuration에서 확인합니다."]}
        interpretation="T가 결국 안정된 delay보다 커지면 honest proposer와 vote가 같은 round에 모일 기회가 생깁니다. 이 식은 liveness를 위한 대기 정책이지 block safety나 특정 p95 latency를 단독으로 보장하는 식이 아닙니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>이 글에서는 식의 의미까지만 확인합니다</h3>
        <p>
          Timeout이 짧으면 정상 message도 늦었다고 보고 round가 자주 바뀌고, 너무 길면 faulty proposer를 오래 기다립니다. 실제 배포값을
          선택하려면 network delay와 round churn을 측정해야 하지만, 그 비교와 운영 기준은 별도 실무 글에서 다룹니다.
        </p>
      </div>
    </section>
  );
}
