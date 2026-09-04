import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ScheduleClockViz } from "./viz/ModernLrScheduleViz";

export default function LrSchedulingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Scheduler를 배우기 전에 무엇을 세는지부터 고정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Learning-rate schedule</strong>은 몇 번째 optimizer
            update인지 읽고 그 update에 사용할 learning rate를 반환하는 함수이자
            state machine입니다.
          </p>
          <p>
            이 글은 곡선 종류보다 먼저 update clock·total budget·call
            event·resume state를 정의합니다. 고정된 clock 위에서 LR를 낮추는
            법은
            <a href="/ai/lr-decay-policies"> decay policy</a>, cosine은
            <a href="/ai/cosine-restart-scheduling"> cosine/restart</a>, 한 번
            올렸다 내리는 정책은 <a href="/ai/one-cycle-scheduling">OneCycle</a>
            , 시작 구간은 <a href="/ai/warmup-scheduling">warmup</a>에서
            이어집니다.
          </p>
        </div>
        <TermBreakdown
          title="Schedule contract의 네 물체"
          items={[
            {
              term: "Optimizer update",
              description: "Parameter가 실제로 한 번 바뀐 사건입니다.",
              example:
                "Gradient를 8회 누적한 뒤 optimizer.step 한 번이 update 1회입니다.",
              boundary: "Micro-batch·backward·epoch와 같은 단위가 아닙니다.",
            },
            {
              term: "Update index t",
              description:
                "완료했거나 곧 실행할 update를 세는 integer cursor입니다.",
              example: "t=240에서 schedule이 η₂₄₀을 반환합니다.",
              boundary:
                "Framework의 step-before/after convention을 기록해야 합니다.",
            },
            {
              term: "Total budget T",
              description: "이번 run에 허용된 optimizer update의 총수입니다.",
              example: "100 updates/epoch × 10 epochs면 T=1000입니다.",
              boundary:
                "Dataset size만으로 정해지지 않고 drop-last·accumulation에도 의존합니다.",
            },
            {
              term: "Scheduler state",
              description:
                "Cursor·phase·best metric처럼 다음 LR를 결정하는 저장값입니다.",
              example:
                "Resume checkpoint에 last_epoch와 param-group LR를 저장합니다.",
              boundary:
                "Optimizer moments만 복원해도 같은 trajectory가 된다는 뜻은 아닙니다.",
            },
          ]}
        />
        <ScheduleClockViz />
        <ContentBoundary article="lr-scheduling" />
      </section>

      <section id="update-clock" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Effective batch를 update budget으로 바꿉니다
        </h2>
        <ExplainedFormula
          question="Dataset 51,200개를 batch 512로 10 epoch 학습하면 왜 T=1,000인가요?"
          idea={
            <p>
              한 update가 소비하는 sample 수를 먼저 계산하고 dataset sample 수를
              그 값으로 나눈 뒤 epoch 수를 곱합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}B_{\rm eff}&=B_\mu A W\\U&=\left\lceil N/B_{\rm eff}\right\rceil\\T&=EU\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}B_{\rm eff}&=\underbrace{B_\mu A W}_{\substack{\text{micro batch·accumulation·rank를 곱해}\\\text{update당 sample 수 계산}}}\\U&=\underbrace{\left\lceil N/B_{\rm eff}\right\rceil}_{\substack{\text{dataset을 update당 sample로 나눠}\\\text{epoch당 update 수 계산}}}\\T&=\underbrace{EU}_{\text{epoch 수를 곱해 total budget 확정}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`B_\mu A W`,
              annotation: [
                "micro-batch·누적·rank를 곱해",
                "update당 sample 수 계산",
              ],
            },
            {
              expression: String.raw`\lceil N/B_{\rm eff}\rceil`,
              annotation: [
                "dataset 크기를 effective batch로 나눠",
                "epoch당 update 수 계산",
              ],
            },
            {
              expression: String.raw`EU`,
              annotation: [
                "epoch 수와 update/epoch를 곱해",
                "total update budget 확정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`B_\mu`,
              name: "Per-rank micro-batch",
              description: "Rank 하나의 forward/backward sample 수입니다.",
            },
            {
              symbol: "A",
              name: "Accumulation count",
              description: "Parameter update 전 gradient를 모으는 횟수입니다.",
            },
            {
              symbol: "W",
              name: "World size",
              description:
                "서로 다른 data shard를 동시에 처리하는 rank 수입니다.",
            },
            {
              symbol: "N,E,T",
              name: "Data·epochs·updates",
              description:
                "Dataset sample 수, epoch 수, total optimizer updates입니다.",
            },
          ]}
          assumptions={[
            "모든 rank가 같은 수의 sample을 처리합니다.",
            "마지막 incomplete batch를 ceil로 포함하는 실행입니다.",
            "AMP overflow로 skip된 optimizer.step은 별도 사건으로 기록합니다.",
          ]}
          interpretation="16×4×8=512, 51,200/512=100, 10×100=1,000입니다. Batch topology가 바뀌면 같은 epoch 수라도 schedule budget은 다시 계산합니다."
        />
      </section>

      <section id="schedule-function" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Scheduler는 direction이 아니라 scale을 바꿉니다
        </h2>
        <ExplainedFormula
          question="Schedule이 반환한 ηₜ는 optimizer update에 어디서 쓰이나요?"
          idea={
            <p>
              Optimizer가 gradient와 state로 direction을 만들면 scheduler의
              learning rate가 그 방향 전체의 이동 크기를 조절합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}\eta_t&=S(t,s_t;c)\\\Delta_t&=-\eta_tu_t\\\theta_{t+1}&=\theta_t+\Delta_t\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}\eta_t&=\underbrace{S(t,s_t;c)}_{\substack{\text{clock·state·config를 읽어}\\\text{현재 learning rate 반환}}}\\\Delta_t&=\underbrace{-\eta_tu_t}_{\substack{\text{optimizer direction의 부호를 뒤집고}\\\text{LR로 displacement 크기 조절}}}\\\theta_{t+1}&=\underbrace{\theta_t+\Delta_t}_{\text{parameter에 displacement 적용}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`S(t,s_t;c)`,
              annotation: [
                "update index·state·config를 읽어",
                "현재 param-group LR 반환",
              ],
            },
            {
              expression: String.raw`-\eta_tu_t`,
              annotation: [
                "optimizer direction에 LR를 곱해",
                "signed displacement 계산",
              ],
            },
            {
              expression: String.raw`\theta_t+\Delta_t`,
              annotation: [
                "현재 parameter에 이동량을 더해",
                "next parameter state 확정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`S`,
              name: "Schedule function",
              description: "Clock·state·configuration에서 LR를 반환합니다.",
            },
            {
              symbol: String.raw`s_t`,
              name: "Scheduler state",
              description:
                "Phase·metric best·bad-count 같은 선택적 state입니다.",
            },
            {
              symbol: String.raw`u_t`,
              name: "Optimizer direction",
              description:
                "SGD gradient나 Adam preconditioned direction입니다.",
            },
            {
              symbol: String.raw`\Delta_t`,
              name: "Parameter displacement",
              description: "Update 전후 parameter 차이입니다.",
            },
          ]}
          assumptions={[
            "Parameter group마다 다른 base LR가 있을 수 있습니다.",
            "Weight decay 등 별도 update 항은 분리해 기록합니다.",
            "S의 call order가 training loop에서 고정되어 있습니다.",
          ]}
          interpretation="같은 ηₜ라도 uₜ가 다르면 실제 이동량은 다릅니다. Schedule 비교에는 LR trace와 displacement trace가 함께 필요합니다."
        />
      </section>

      <section id="resume-boundary" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Resume는 LR 숫자 하나가 아니라 trajectory를 복원합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Checkpoint에는 global update와 total budget, scheduler class와 version을 저장합니다. 여기에 state
            dict·optimizer state·현재 param-group LR·step 호출 순서까지 함께 넣습니다. 연속 1000 updates와 600+resume+400
            updates의 LR trace와 parameter를 비교해야 off-by-one이 드러납니다.
          </p>
        </div>
        <div id="docs-pytorch-scheduler" className="scroll-mt-24">
          <CitationBlock
            source="PyTorch · How to adjust learning rate"
            citeKey={1}
            href="https://docs.pytorch.org/docs/stable/optim.html#how-to-adjust-learning-rate"
          >
            <strong>문제:</strong> optimizer와 scheduler의 호출 순서·state를
            일관되게 사용함. <strong>기여:</strong> 현재 LRScheduler 종류와
            optimizer.step 뒤 scheduler.step 호출 semantics를 문서화.{" "}
            <strong>전제:</strong> 사용하는 PyTorch version·scheduler
            class·parameter groups. <strong>근거 범위:</strong> PyTorch API
            동작과 예제. <strong>과장 금지:</strong> 특정 곡선이 모든 model에서
            가장 정확하다는 추천은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
