import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { SgdUpdateViz } from "./viz/ModernOptimizerViz";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { transformersTree } from "./fileTree";

export default function OptimizersArticle() {
  const sidebar = useCodeSidebar();
  return (
    <>
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Optimizer는 gradient를 계산하는 장치가 아니라 parameter를 움직이는
          규칙입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Backpropagation은 현재 batch에서 loss가 커지는 방향인{" "}
            <strong>gradient</strong>를 만듭니다.
            <strong> Optimizer update</strong>는 그 gradient와 learning state를
            읽어 다음 parameter를 결정합니다.
          </p>
          <p>
            이 글은 state가 없는 기준 update인 SGD와 여러 micro-batch를 한
            update로 묶는 경계까지만 설명합니다. 과거 방향을 기억하는 방법은{" "}
            <a href="/ai/momentum-optimizer">Momentum</a>, coordinate별 scale은
            <a href="/ai/adam-optimizer"> Adam</a>, direct shrinkage는{" "}
            <a href="/ai/weight-decay">Weight decay</a>에서 이어집니다.
          </p>
        </div>
        <TermBreakdown
          title="한 update를 이루는 네 물체"
          items={[
            {
              term: "Parameter",
              description: "Model이 학습 중 바꾸는 수치 tensor입니다.",
              example: "Scalar θ=3에서 시작합니다.",
              boundary: "Activation이나 gradient와 같은 값이 아닙니다.",
            },
            {
              term: "Gradient estimate",
              description:
                "현재 mini-batch loss의 parameter별 local sensitivity입니다.",
              example: "g=4면 θ를 늘릴 때 loss가 local하게 증가합니다.",
              boundary:
                "전체 dataset gradient나 미래 loss를 정확히 아는 값은 아닙니다.",
            },
            {
              term: "Learning rate",
              description:
                "Direction을 실제 displacement 크기로 바꾸는 global scale입니다.",
              example: "η=.1이면 g=4에서 이동량은 .4입니다.",
              boundary: "작을수록 항상 좋거나 안정적인 것은 아닙니다.",
            },
            {
              term: "Update clock",
              description: "Parameter가 실제로 한 번 바뀐 사건의 index입니다.",
              example:
                "8 micro-batch 뒤 optimizer.step 한 번이 update 1회입니다.",
              boundary: "Forward·backward 호출 수와 혼동하지 않습니다.",
            },
          ]}
        />
        <SgdUpdateViz />
        <ContentBoundary article="optimizers" />
      </section>

      <section id="update-contract" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Gradient와 update의 소유자를 먼저 분리합니다
        </h2>
        <ExplainedFormula
          question="Training step에서 gradient가 어떻게 next parameter가 되나요?"
          idea={
            <p>
              Backward가 gradient를 만들고 optimizer가 update rule U를 적용한
              뒤, 그 결과를 현재 parameter에서 빼거나 더합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}g_t&=\nabla_\theta L_t(\theta_t)\\\Delta_t&=U(g_t,s_t)\\\theta_{t+1}&=\theta_t+\Delta_t\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}g_t&=\underbrace{\nabla_\theta L_t(\theta_t)}_{\substack{\text{현재 batch loss를}\\\text{parameter로 미분}}}\\\Delta_t&=\underbrace{U(g_t,s_t)}_{\substack{\text{gradient와 optimizer state를}\\\text{displacement로 변환}}}\\\theta_{t+1}&=\underbrace{\theta_t+\Delta_t}_{\text{현재 parameter에 이동량 적용}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\nabla_\theta L_t`,
              annotation: [
                "loss를 parameter로 미분해",
                "local gradient estimate 생성",
              ],
            },
            {
              expression: String.raw`U(g_t,s_t)`,
              annotation: [
                "gradient와 optimizer state를 규칙에 넣어",
                "실제 이동량을 계산",
              ],
            },
            {
              expression: String.raw`\theta_t+\Delta_t`,
              annotation: [
                "현재 parameter에 displacement를 더해",
                "다음 model state 확정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\theta_t`,
              name: "Parameter state",
              description: "Update t 직전 model parameter입니다.",
            },
            {
              symbol: String.raw`g_t`,
              name: "Gradient estimate",
              description: "현재 batch objective의 local derivative입니다.",
            },
            {
              symbol: String.raw`s_t`,
              name: "Optimizer state",
              description: "Momentum·moment 같은 선택적 history입니다.",
            },
            {
              symbol: String.raw`\Delta_t`,
              name: "Displacement",
              description: "이번 update가 parameter를 움직이는 양입니다.",
            },
          ]}
          assumptions={[
            "Loss reduction과 gradient sign convention이 명시되어 있습니다.",
            "Update 중간에 parameter를 다른 owner가 바꾸지 않습니다.",
            "Optimizer state와 parameter identity가 맞습니다.",
          ]}
          interpretation="Backward와 optimizer를 분리하면 clipping·weight decay·AMP skip이 gradient 전후 어느 지점에 개입하는지 추적할 수 있습니다."
        />
      </section>

      <section id="gradient-estimate" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Mini-batch gradient는 full gradient의 noisy estimate입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Dataset 전체를 매번 읽는 대신 현재 batch의 sample loss를 평균해
            gradient를 계산합니다. Batch sampler·loss reducer·augmentation
            seed가 바뀌면 같은 parameter에서도 다른 g가 나옵니다.
          </p>
          <p>
            따라서 optimizer 비교에서는 epoch 이름보다 processed
            sample·optimizer update·effective batch를 함께 기록합니다.
          </p>
        </div>
      </section>

      <section id="sgd-update" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          SGD는 현재 estimate의 반대 방향으로 한 보폭 이동합니다
        </h2>
        <ExplainedFormula
          question="θ=3, g=4, η=.1이면 왜 다음 parameter가 2.6인가요?"
          idea={
            <p>
              Gradient가 loss 증가 방향이므로 부호를 뒤집고 learning rate를 곱해
              이동량을 만든 뒤 현재 parameter에 더합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}\Delta_t&=-\eta g_t\\\theta_{t+1}&=\theta_t+\Delta_t\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}d_t&=\underbrace{-g_t}_{\text{loss 증가 방향을 descent 방향으로 반전}}\\\Delta_t&=\underbrace{\eta d_t}_{\text{descent 방향에 learning rate를 곱함}}\\\theta_{t+1}&=\underbrace{\theta_t+\Delta_t}_{\text{현재 parameter에 이동량 적용}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`-g_t`,
              annotation: [
                "gradient의 부호를 뒤집어",
                "loss를 낮추는 local direction 생성",
              ],
            },
            {
              expression: String.raw`\eta d_t`,
              annotation: [
                "direction에 learning rate를 곱해",
                "실제 displacement 크기 결정",
              ],
            },
            {
              expression: String.raw`\theta_t+\Delta_t`,
              annotation: [
                "현재 값과 displacement를 합쳐",
                "다음 parameter 저장",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`g_t`,
              name: "Mini-batch gradient",
              description: "현재 batch가 추정한 derivative입니다.",
            },
            {
              symbol: String.raw`\eta`,
              name: "Learning rate",
              description: "Global step-size scale입니다.",
            },
            {
              symbol: String.raw`\Delta_t`,
              name: "SGD displacement",
              description: "Parameter에 더할 signed movement입니다.",
            },
          ]}
          assumptions={[
            "η는 현재 update에 사용할 양수입니다.",
            "Gradient는 descent convention의 loss derivative입니다.",
            "Momentum·decay·clipping은 포함하지 않은 기준 SGD입니다.",
          ]}
          interpretation="−g=−4, η(−g)=−.4이고 3+(−.4)=2.6입니다. 한 step loss 감소나 global convergence는 별도 전제가 필요합니다."
        />
      </section>

      <section id="effective-batch" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Gradient accumulation은 여러 backward를 한 update로 묶습니다
        </h2>
        <ExplainedFormula
          question="Micro-batch 4를 8번 처리하면 effective batch 32가 되는 경계는 무엇인가요?"
          idea={
            <p>
              각 micro-batch gradient를 같은 parameter snapshot에서 계산하고
              평균한 뒤, parameter update를 정확히 한 번 실행합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}\bar g_t&=\frac1K\sum_{k=1}^{K}g_{t,k}\\B_{\rm eff}&=K B_{\rm micro}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}G_t&=\underbrace{\sum_{k=1}^{K}g_{t,k}}_{\text{K개 micro gradient를 같은 장부에 합산}}\\\bar g_t&=\underbrace{G_t/K}_{\text{합을 micro-batch 수로 나눠 평균}}\\B_{\rm eff}&=\underbrace{K B_{\rm micro}}_{\text{update 하나가 본 sample 수 계산}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\sum_{k=1}^{K}g_{t,k}`,
              annotation: [
                "parameter를 움직이지 않은 채 K개 gradient를 더해",
                "한 update의 누적 gradient 생성",
              ],
            },
            {
              expression: String.raw`G_t/K`,
              annotation: [
                "누적합을 K로 나눠",
                "mean-loss convention과 scale 정렬",
              ],
            },
            {
              expression: String.raw`K B_{\rm micro}`,
              annotation: [
                "micro-batch 크기와 누적 횟수를 곱해",
                "update당 sample 수 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`K`,
              name: "Accumulation count",
              description: "Update 전 backward 횟수입니다.",
            },
            {
              symbol: String.raw`B_{\rm micro}`,
              name: "Micro-batch size",
              description: "한 forward/backward가 처리한 sample 수입니다.",
            },
            {
              symbol: String.raw`B_{\rm eff}`,
              name: "Effective batch",
              description: "한 update가 합친 sample 수입니다.",
            },
          ]}
          assumptions={[
            "각 micro loss의 reduction scale이 같습니다.",
            "K회 사이에 optimizer.step을 호출하지 않습니다.",
            "Data-parallel world size가 있으면 별도 곱으로 포함합니다.",
          ]}
          interpretation="4×8=32이지만 BatchNorm state·dropout mask·data order까지 한 번에 32개를 처리한 실행과 완전히 같다는 뜻은 아닙니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            "각 micro loss의 reduction scale이 같습니다"라는 가정은 실전에서
            자주 깨집니다. 2024년 Unsloth가 보고한 gradient accumulation
            버그가 정확히 이 지점입니다. sequence 길이가 micro-batch마다
            다르면(padding 없는 packed batch, variable-length data) 각
            micro-batch가 <strong>자기 자신의 유효 토큰 수로만</strong>{" "}
            나누는 mean reduction과, K개 micro-batch 전체를 한 번에 처리했을
            때의 loss가 서로 달라집니다. Loss curve는 정상처럼 보이지만
            실제로는 짧은 시퀀스가 긴 시퀀스보다 과대평가된 gradient를 받는
            식으로 조용히 편향됩니다.
          </p>
          <p>
            HuggingFace transformers는 이를{" "}
            <code>fixed_cross_entropy</code>라는, 이름 자체가 수정 이력을
            가리키는 함수로 고쳤습니다. K개 micro-batch를 backward 없이 먼저
            모아 accumulation window 전체의 유효 토큰 수(<code>
              num_items_in_batch
            </code>
            )를 미리 계산해 두고, 각 micro loss는 자기 토큰 수가 아니라 이
            공유된 분모로 나눕니다.
          </p>
          <div className="flex flex-wrap gap-2 not-prose">
            <CodeViewButton
              label="fixed_cross_entropy — 실제 버그/수정 지점"
              onClick={() => sidebar.open("ga-fixed-cross-entropy", codeRefs["ga-fixed-cross-entropy"])}
            />
            <CodeViewButton
              label="get_batch_samples — 분모를 먼저 구하는 위치"
              onClick={() => sidebar.open("ga-num-items-in-batch", codeRefs["ga-num-items-in-batch"])}
            />
          </div>
        </div>
      </section>

      <section id="release-boundary" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Update receipt는 숫자 하나보다 실행 경계를 보존합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Parameter revision·gradient reduction·micro-batch·accumulation·world
            size·learning rate·update index·AMP skipped-step을 한 receipt에
            남깁니다.
          </p>
          <p>
            그다음 Momentum·Adam 같은 stateful optimizer를 비교할 때 동일한
            update clock과 budget을 재사용합니다.
          </p>
        </div>
        <div id="paper-robbins-monro" className="scroll-mt-24">
          <CitationBlock
            source="A Stochastic Approximation Method"
            citeKey={1}
            href="https://doi.org/10.1214/aoms/1177729586"
          >
            <strong>문제:</strong> noisy observation으로 미지의 root를 반복
            추정함. <strong>기여:</strong> 감소하는 step을 쓰는 stochastic
            approximation의 출발점을 제시. <strong>전제:</strong> 논문의
            regression function·noise·step 조건. <strong>근거 범위:</strong> 원
            논문의 scalar stochastic approximation 이론.{" "}
            <strong>과장 금지:</strong> 현대 mini-batch SGD의 모든 nonconvex
            convergence나 generalization을 자동 보장하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
    <CodeSidebar
      codeRefKey={sidebar.codeRefKey}
      codeRef={sidebar.codeRef}
      onClose={sidebar.close}
      onNavigate={sidebar.navigate}
      codeRefs={codeRefs}
      fileTrees={{ transformers: transformersTree }}
      projectMetas={{
        transformers: {
          id: "transformers",
          label: "transformers · Python",
          badgeClass: "bg-yellow-500/10 border-yellow-500 text-yellow-700",
        },
      }}
    />
    </>
  );
}
