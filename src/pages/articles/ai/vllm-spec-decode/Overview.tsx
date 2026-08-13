import ExplainedFormula from "@/components/ui/explained-formula";
import Math from "@/components/ui/math";
import SpecCycleViz from "./viz/SpecCycleViz";
import MtpAmortizationViz from "./viz/MtpAmortizationViz";

const ACCEPTANCE_TERMS = [
  {
    symbol: "K",
    name: "Speculation depth",
    description: "Proposer가 한 cycle에 미리 만든 draft token의 최대 개수입니다.",
  },
  {
    symbol: "A_c",
    name: "수락된 draft prefix 길이",
    description:
      "Cycle c에서 첫 거부 전까지 연속으로 수락된 draft token 수이며 0부터 K까지입니다.",
  },
  {
    symbol: "Y_c",
    name: "실제로 확정한 token 수",
    description:
      "수락된 draft와 correction 또는 bonus token을 합쳐 사용자 sequence에 반영한 수입니다.",
  },
  {
    symbol: "C",
    name: "측정한 cycle 수",
    description: "같은 workload 조건에서 집계한 verification cycle의 개수입니다.",
  },
] as const;

const BANDWIDTH_TERMS = [
  {
    symbol: "B_W",
    name: "Target weight read",
    description:
      "낮은 batch의 target verify 한 번에서 HBM으로부터 읽는 model weight byte의 근사입니다.",
  },
  {
    symbol: "Y",
    name: "Cycle당 확정 token",
    description: "한 target verify 결과로 sequence에 반영되는 token 수입니다.",
  },
  {
    symbol: "\\mathbb{E}[Y]",
    name: "평균 확정 길이",
    description: "같은 workload에서 cycle당 확정 token 수의 기댓값입니다.",
  },
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        다음 token을 맞히는 기법이 아니라, 비싼 target 실행을 나눠 쓰는 기법입니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          일반적인 autoregressive decoding은 지금까지 확정한 prefix를 조건으로
          다음 token 하나를 만들고, 그 token을 다시 입력에 붙여 같은 과정을
          반복합니다. 낮은 batch에서 큰 LLM을 실행하면 계산 장치가 쉬고 있어도
          매 step마다 model weight를 HBM에서 읽는 시간이 길 수 있습니다. 이때
          병목은 “계산을 더 못 해서”가 아니라 <strong>같은 weight를 token마다
          다시 읽어야 해서</strong> 생깁니다.
        </p>
        <p className="leading-8">
          Speculative decoding은 빠른 <em>proposer</em>가 미래 token 후보를 먼저
          만들고, 원래 답을 결정하는 <em>target model</em>이 여러 후보 위치를 한
          번에 검증합니다. 후보가 연속으로 맞으면 target 실행 한 번으로 여러
          token을 확정할 수 있습니다. 따라서 핵심 질문은 proposer가 얼마나
          똑똑한지가 아니라, <strong>target만 사용했을 때의 출력 규칙을 유지한
          채 한 verify cycle이 몇 token을 확정했는가</strong>입니다.
        </p>
      </div>

      <SpecCycleViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="acceptance-length" className="scroll-mt-20">
          Acceptance length를 먼저 정의해야 숫자를 비교할 수 있습니다
        </h3>
        <p className="leading-8">
          문서와 profiler마다 <em>acceptance length</em>가 수락된 draft 수
          <Math>{"A"}</Math>만 뜻하기도 하고, correction·bonus token까지 포함한
          실제 확정 수 <Math>{"Y"}</Math>를 뜻하기도 합니다. 예를 들어 draft 세
          개를 수락하고 target이 다음 token 하나까지 확정했다면
          <Math>{"A=3"}</Math>, <Math>{"Y=4"}</Math>입니다. 숫자를 기록할 때 이
          정의를 함께 고정하지 않으면 서로 다른 구현을 잘못 비교하게 됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="한 target verification이 실제로 몇 token을 확정했는지 어떻게 측정할까요?"
        idea={
          <>
            첫 거부 전까지 수락된 draft 수와 실제 sequence에 반영된 token 수를
            나누어 셉니다. Rejection sampling 구현이 거부 지점에서 correction
            token 하나를 내고, 전부 수락했을 때 bonus token 하나를 낸다면 보통
            <Math>{"Y_c=A_c+1"}</Math>이지만 runtime 계약에 따라 별도로 확인해야
            합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
0 \le A_c &\le K \\
\bar A &= \frac{1}{C}\sum_{c=1}^{C}A_c \\
\bar Y &= \frac{1}{C}\sum_{c=1}^{C}Y_c
\end{aligned}`}
        terms={ACCEPTANCE_TERMS}
        assumptions={[
          "같은 model·sampler·prompt/output distribution에서 cycle을 집계합니다.",
          "A는 연속 prefix만 세며 첫 거부 이후의 draft 후보는 포함하지 않습니다.",
          "Y가 correction·bonus token을 포함하는지는 runtime metric 정의를 함께 기록합니다.",
        ]}
        interpretation="K를 늘려도 \bar A와 \bar Y가 함께 늘어난다는 보장은 없습니다. 먼 미래 후보일수록 조건부 오차가 누적되고 draft·verify 비용도 커지므로, 운영에서는 \bar Y와 cycle latency를 함께 봅니다."
        title="Acceptance length와 committed length"
      />

      <MtpAmortizationViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>왜 batch 1에서 특히 유리할 수 있을까요?</h3>
        <p className="leading-8">
          큰 batch는 같은 weight read를 여러 요청이 나누어 쓰게 합니다.
          Speculative decoding은 한 요청의 여러 미래 위치를 함께 검증해 비슷한
          효과를 만듭니다. Native MTP를 이용하든 별도 draft model을 이용하든,
          평균 확정 길이가 3.5라면 이상적인 memory-bound 근사에서는 target
          weight read가 token당 약 3.5분의 1로 나뉩니다. 다만 verify가 여러
          위치의 activation·attention을 계산하고 proposer와 runtime overhead도
          추가되므로 이것이 곧 3.5배 속도를 뜻하지는 않습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Acceptance length가 늘면 token당 HBM weight traffic은 왜 줄어들까요?"
        idea={
          <>
            Target weight를 verify 한 번에 한 차례 읽었다고 근사하고, 그 결과로
            확정한 token 수에 비용을 나눕니다. 한 token씩 생성하면 한 번의
            weight read를 한 token이 부담하지만, 여러 token을 확정하면 같은
            비용을 함께 부담합니다.
          </>
        }
        formula={String.raw`B_{W,\,\mathrm{per\ token}}
\;\approx\; \frac{B_W}{\mathbb{E}[Y]}`}
        terms={BANDWIDTH_TERMS}
        assumptions={[
          "Target 실행이 weight-bandwidth bound이고 batch가 작아 weight reuse가 제한된 구간입니다.",
          "Verify depth가 늘어날 때의 activation·KV·attention compute와 proposer 비용은 이 근사식 밖에서 따로 계산합니다.",
          "Weight가 cache에 계속 남거나 높은 QPS로 이미 큰 batch를 구성하면 B_W의 의미와 이득이 달라집니다.",
        ]}
        interpretation="이 식은 MTP가 HBM 대역폭 자체를 높인다는 뜻이 아닙니다. 반드시 읽어야 하는 target weight를 여러 확정 token이 함께 사용해 token당 부담을 낮춘다는 뜻입니다."
        title="Target weight read의 token당 상각"
      />
    </section>
  );
}
