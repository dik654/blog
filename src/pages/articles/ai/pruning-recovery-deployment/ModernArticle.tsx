import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { PruningRecoveryViz } from "../pruning/viz/ModernPruningViz";

export default function PruningRecoveryDeploymentArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Recovery는 제거한 연결을 되살리지 않고 남은 연결을 다시 적응시킵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Pruning 뒤 fine-tuning이나 distillation을 할 수 있지만 fixed-mask recovery라면 제거한 위치는 parameter와 optimizer
            state에서 계속 0이어야 합니다. 그 다음 같은 generation에서 실제 artifact와 quality, target kernel을 함께 검증합니다.
          </p>
        </div>
        <TermBreakdown
          title="복구와 배포를 잇는 네 ledger"
          items={[
            {
              term: "Fixed mask",
              description: "Recovery 중 바꾸지 않는 제거 결정입니다.",
              example: "M[i]=0인 위치는 매 step 다시 0으로 만듭니다.",
              boundary: "Dynamic sparse training은 다른 계약입니다.",
            },
            {
              term: "Optimizer state",
              description:
                "Momentum·Adam moment처럼 다음 update에 영향을 주는 상태입니다.",
              example: "Weight와 같은 mask로 제거 위치를 비웁니다.",
              boundary:
                "Gradient만 0으로 만들면 과거 state가 weight를 되살릴 수 있습니다.",
            },
            {
              term: "Runtime receipt",
              description:
                "Packing·eligible op·chosen tactic·fallback의 기록입니다.",
              example: "2:4 적격 20개 중 sparse tactic 선택 12개를 남깁니다.",
              boundary: "Sparsity 수치만으로 대체하지 않습니다.",
            },
            {
              term: "Release frontier",
              description:
                "Quality gate를 지키며 byte·memory·latency를 개선한 후보 집합입니다.",
              example:
                "60% irregular보다 50% 2:4가 p95 목표에 유리할 수 있습니다.",
              boundary: "서로 다른 workload의 숫자를 직접 비교하지 않습니다.",
            },
          ]}
        />
        <PruningRecoveryViz />
        <ContentBoundary article="pruning-recovery-deployment" />
      </section>
      <section id="mask-invariant" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Update가 끝난 뒤 같은 mask를 weight와 state에 다시 적용합니다
        </h2>
        <ExplainedFormula
          question="Momentum이 제거한 weight를 되살리지 못하게 하려면 어떤 순서가 필요한가요?"
          idea={
            <p>
              일반 optimizer 후보를 계산한 다음 parameter와 optimizer state
              모두에 fixed mask를 projection처럼 적용합니다.
            </p>
          }
          formula={String.raw`\widetilde W_{t+1}=W_t-\eta g_t,\quad W_{t+1}=M\odot\widetilde W_{t+1},\quad U_{t+1}=M\odot\widetilde U_{t+1}`}
          annotatedFormula={String.raw`\begin{aligned}\widetilde W_{t+1}&=\underbrace{W_t-\eta g_t}_{\text{일반 optimizer 후보 weight 계산}}\\W_{t+1}&=\underbrace{M\odot\widetilde W_{t+1}}_{\text{제거 위치를 다시 0으로 projection}}\\\widetilde U_{t+1}&=\underbrace{\operatorname{OptUpdate}(U_t,g_t)}_{\text{momentum·moment 후보 갱신}}\\U_{t+1}&=\underbrace{M\odot\widetilde U_{t+1}}_{\text{state의 제거 위치도 0으로 봉인}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`W_t-\eta g_t`,
              annotation: [
                "gradient에 learning rate를 곱해",
                "일반 weight 후보 계산",
              ],
            },
            {
              expression: String.raw`M\odot\widetilde W`,
              annotation: [
                "후보 weight에 fixed mask를 곱해",
                "제거 연결 재생성 차단",
              ],
            },
            {
              expression: String.raw`M\odot\widetilde U`,
              annotation: [
                "optimizer state에도 같은 mask를 곱해",
                "다음 step의 관성 유입 차단",
              ],
            },
          ]}
          terms={[
            {
              symbol: "M",
              name: "Fixed mask",
              description: "Recovery 동안 유지하는 0/1 tensor입니다.",
            },
            {
              symbol: "U",
              name: "Optimizer state",
              description: "Momentum·Adam moments입니다.",
            },
            {
              symbol: String.raw`\eta`,
              name: "Learning rate",
              description: "Weight update 크기입니다.",
            },
          ]}
          assumptions={[
            "Fixed-mask recovery를 설명합니다.",
            "Structured pruning은 새 shape에 맞춰 state를 다시 구성합니다.",
            "Checkpoint export에서도 mask invariant를 test합니다.",
          ]}
          interpretation="M[i]=0이면 update 전 W·gradient·momentum 값과 무관하게 다음 W[i]와 U[i]는 모두 0입니다."
        />
      </section>
      <section id="runtime-receipt" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          적격 operator와 실제 선택된 sparse tactic을 분리해서 셉니다
        </h2>
        <ExplainedFormula
          question="일부 operator만 빨라질 때 전체 latency 상한은 어떻게 읽나요?"
          idea={
            <p>
              여기서는 Amdahl 경계를 씁니다. 전체 시간 중 sparse tactic이 적용되는 비율만 속도가 바뀌고 나머지는 그대로 남는다는 뜻입니다.
            </p>
          }
          formula={String.raw`S_{end}\le[(1-f)+f/S_{sparse}]^{-1}`}
          annotatedFormula={String.raw`\begin{aligned}T_{fixed}&=\underbrace{1-f}_{\text{sparse tactic 밖의 변하지 않는 시간}}\\T_{sparse}'&=\underbrace{f/S_{sparse}}_{\text{적용 구간만 kernel speedup으로 단축}}\\S_{end}&=\underbrace{1/(T_{fixed}+T_{sparse}')}_{\text{두 실행 시간을 합친 전체 speedup}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`1-f`,
              annotation: [
                "전체 비율에서 적용 구간을 빼",
                "변하지 않는 시간 계산",
              ],
            },
            {
              expression: String.raw`f/S_{sparse}`,
              annotation: [
                "적용 시간만 kernel speedup으로 나눠",
                "단축된 구간 계산",
              ],
            },
            {
              expression: String.raw`1/(T_{fixed}+T_{sparse}')`,
              annotation: [
                "전체 새 시간을 더한 뒤 역수로",
                "end-to-end speedup 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "f",
              name: "Sparse-tactic time fraction",
              description:
                "Dense baseline 시간 중 실제 적용 가능한 비율입니다.",
            },
            {
              symbol: String.raw`S_{sparse}`,
              name: "Kernel speedup",
              description: "적용된 operator 구간의 속도 향상입니다.",
            },
            {
              symbol: String.raw`S_{end}`,
              name: "End-to-end speedup",
              description: "전체 workload의 상한입니다.",
            },
          ]}
          assumptions={[
            "같은 workload의 dense baseline 비율을 씁니다.",
            "Build log의 eligible과 chosen을 구분합니다.",
            "Quality gate를 통과한 artifact끼리 비교합니다.",
          ]}
          interpretation="f=.4이고 적용 구간이 2배 빨라도 전체 상한은 1/(.6+.2)=1.25배입니다. 나머지 60%가 그대로 남기 때문입니다."
        />
      </section>
      <section id="release" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          더 sparse한 후보가 아니라 목표를 실제로 개선한 후보를 배포합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            base와 batch, sequence, concurrency를 똑같이 맞춘 뒤 한 표로 비교합니다. 표에 들어가는 축은 artifact byte,
            language·domain·long-context worst quality, peak memory, prefill/decode p50·p95, throughput, 그리고
            fallback입니다. 어느 축에서도 더 나쁘고 어떤 축에서도 낫지 않은 후보는 frontier에서 뺍니다.
          </p>
        </div>
      </section>
    </div>
  );
}
