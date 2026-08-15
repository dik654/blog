import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { OneCyclePolicyViz } from "../lr-scheduling/viz/ModernLrScheduleViz";

export default function OneCycleSchedulingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          OneCycle 전에 maximum LR 후보를 진단합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Learning-rate range test</strong>는 짧은 별도 run에서 LR를
            올리며 loss가 좋아지는 범위와 instability 시작점을 찾습니다.{" "}
            <strong>One-cycle policy</strong>는 선택한 maximum을 실제 total
            budget의 상승·하강 phase에 배치합니다.
          </p>
        </div>
        <TermBreakdown
          title="진단과 실행을 이루는 네 용어"
          items={[
            {
              term: "Range-test trace",
              description:
                "LR와 smoothed loss를 update 순서대로 묶은 진단 기록입니다.",
              example: "1e−6에서 1까지 LR를 올립니다.",
              boundary: "한 noisy trace를 optimum 증명으로 사용하지 않습니다.",
            },
            {
              term: "Instability boundary",
              description:
                "Loss 급증·nonfinite·gradient overflow가 시작되는 구간입니다.",
              example: "η=.2 부근에서 loss가 급증합니다.",
              boundary: "정확히 .2를 max LR로 선택한다는 뜻이 아닙니다.",
            },
            {
              term: "Rise fraction p",
              description: "Total updates 중 max LR까지 올리는 비율입니다.",
              example: "T=1000, p=.3이면 rise 300 updates입니다.",
              boundary:
                "Epoch fraction이 아니라 optimizer-update fraction입니다.",
            },
            {
              term: "Inverse momentum",
              description:
                "LR가 오를 때 momentum은 낮추고 LR가 내릴 때 높이는 선택적 phase입니다.",
              example: "η high ↔ β low입니다.",
              boundary: "Optimizer가 momentum 또는 β₁ 변경을 지원해야 합니다.",
            },
          ]}
        />
        <OneCyclePolicyViz />
        <ContentBoundary article="one-cycle-scheduling" />
      </section>

      <section id="range-test" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Range test는 LR를 log scale로 올리는 진단 run입니다
        </h2>
        <ExplainedFormula
          question="ηstart에서 ηend까지 R updates 동안 같은 비율로 올리려면 각 LR를 어떻게 계산하나요?"
          idea={
            <p>
              End/start 비율의 R제곱근을 한-step multiplier로 만들고 시작 LR에
              t번 곱합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}\gamma&=(\eta_{\rm end}/\eta_{\rm start})^{1/R}\\\eta_t&=\eta_{\rm start}\gamma^t\\t_*&=\min\{t:\operatorname{unstable}(t)\}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}\gamma&=\underbrace{(\eta_{\rm end}/\eta_{\rm start})^{1/R}}_{\substack{\text{전체 LR 비율의 R제곱근으로}\\\text{한-step multiplier 계산}}}\\\eta_t&=\underbrace{\eta_{\rm start}\gamma^t}_{\text{t번 multiplier를 적용해 현재 LR 생성}}\\t_*&=\underbrace{\min\{t:\operatorname{unstable}(t)\}}_{\text{첫 instability event 위치 기록}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`(\eta_{\rm end}/\eta_{\rm start})^{1/R}`,
              annotation: [
                "전체 LR 배율을 R개 동일 ratio로 나눠",
                "update당 multiplier 계산",
              ],
            },
            {
              expression: String.raw`\eta_{\rm start}\gamma^t`,
              annotation: [
                "시작 LR에 multiplier를 t번 곱해",
                "log-scale current LR 생성",
              ],
            },
            {
              expression: String.raw`\min\{t:\operatorname{unstable}(t)\}`,
              annotation: [
                "instability가 참인 update 중 최소를 골라",
                "첫 실패 경계 기록",
              ],
            },
          ]}
          terms={[
            {
              symbol: "R",
              name: "Range-test updates",
              description: "진단 run 길이입니다.",
            },
            {
              symbol: String.raw`\gamma`,
              name: "Per-update multiplier",
              description: "LR를 매 update 늘리는 고정 비율입니다.",
            },
            {
              symbol: String.raw`t_*`,
              name: "Instability index",
              description: "정의한 failure signal이 처음 발생한 update입니다.",
            },
          ]}
          assumptions={[
            "Optimizer·batch·augmentation·initialization을 실제 run과 맞춥니다.",
            "Loss smoothing과 divergence rule을 사전에 고정합니다.",
            "Range test 뒤 model·optimizer state를 버리거나 초기 checkpoint로 rollback합니다.",
          ]}
          interpretation="Range test는 candidate generator입니다. Instability LR보다 낮은 여러 max 후보를 독립 validation run에서 비교합니다."
        />
      </section>

      <section id="one-cycle" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Total budget 안에 rise와 decay local clock을 만듭니다
        </h2>
        <ExplainedFormula
          question="T=1000, p=.3인 OneCycle에서 두 phase의 길이와 local progress는 무엇인가요?"
          idea={
            <p>
              먼저 rise 길이를 floor(pT)로 고정하고, 현재 update를 해당 phase
              시작점과 길이로 정규화합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}T_\uparrow&=\lfloor pT\rfloor\\r_\uparrow&=t/T_\uparrow\\r_\downarrow&=(t-T_\uparrow)/(T-T_\uparrow)\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}T_\uparrow&=\underbrace{\lfloor pT\rfloor}_{\text{total budget의 p만큼 rise에 배정}}\\r_\uparrow&=\underbrace{t/T_\uparrow}_{\text{rise 안의 0–1 progress 계산}}\\r_\downarrow&=\underbrace{(t-T_\uparrow)/(T-T_\uparrow)}_{\substack{\text{rise 이후 local step을}\\\text{남은 decay length로 나눔}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\lfloor pT\rfloor`,
              annotation: [
                "total updates에 rise fraction을 곱해",
                "상승 phase 길이 확정",
              ],
            },
            {
              expression: String.raw`t/T_\uparrow`,
              annotation: [
                "현재 rise step을 phase 길이로 나눠",
                "상승 progress 생성",
              ],
            },
            {
              expression: String.raw`(t-T_\uparrow)/(T-T_\uparrow)`,
              annotation: [
                "rise offset을 빼고 남은 길이로 나눠",
                "하강 progress 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: "T",
              name: "Total updates",
              description: "OneCycle 전체 optimizer-update budget입니다.",
            },
            {
              symbol: "p",
              name: "Rise fraction",
              description: "Max LR까지 올리는 budget 비율입니다.",
            },
            {
              symbol: String.raw`r_\uparrow`,
              name: "Rise progress",
              description: "Initial→max 보간에 쓰는 local progress입니다.",
            },
            {
              symbol: String.raw`r_\downarrow`,
              name: "Decay progress",
              description: "Max→final 보간에 쓰는 local progress입니다.",
            },
          ]}
          assumptions={[
            "Run 시작 전에 T를 압니다.",
            "Scheduler를 optimizer update마다 정확히 한 번 호출합니다.",
            "Linear·cosine interpolation과 two/three phase 설정을 별도로 기록합니다.",
          ]}
          interpretation="Rise는 300 updates, decay는 700 updates입니다. 같은 OneCycle 이름이라도 p·max/final LR·interpolation·momentum이 다르면 다른 policy입니다."
        />
      </section>

      <section id="release-boundary" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          큰 LR는 regularization 보장이 아니라 failure budget입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Nonfinite loss·gradient overflow·loss ratio·update norm 상한을
            정하고 마지막 healthy checkpoint로 rollback합니다. Range-test model
            state는 실제 run에 이어 쓰지 않으며, max
            LR·batch·optimizer·regularization 중 하나가 바뀌면 진단도 다시
            수행합니다.
          </p>
        </div>
        <div id="paper-super-convergence" className="scroll-mt-24">
          <CitationBlock
            source="Super-Convergence: Very Fast Training of Neural Networks Using Large Learning Rates"
            citeKey={1}
            href="https://arxiv.org/abs/1708.07120"
          >
            <strong>문제:</strong> 적은 iteration으로 deep network를 학습하면서
            generalization을 유지할 조건 탐색. <strong>기여:</strong> 큰 maximum
            LR를 포함한 one-cycle policy와 range-test 관찰.{" "}
            <strong>전제:</strong> 논문의 vision
            architectures·datasets·optimizer·regularization 조합.{" "}
            <strong>근거 범위:</strong> 보고된 실험. <strong>과장 금지:</strong>{" "}
            같은 speedup이나 큰 LR의 이점이 임의의 LLM·optimizer에서 재현된다는
            결론은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
