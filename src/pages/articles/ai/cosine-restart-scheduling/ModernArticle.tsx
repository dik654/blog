import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CosineRestartViz } from "../lr-scheduling/viz/ModernLrScheduleViz";

export default function CosineRestartSchedulingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Cosine은 progress를 LR scale로 바꾸는 보간입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Cosine annealing</strong>은 현재 cycle의 진행률을 peak와
            minimum 사이의 learning rate로 바꿉니다.{" "}
            <strong>Warm restart</strong>는 cycle 끝에서 LR phase만 다시
            시작하고 학습 state는 이어가는 별도 transition입니다.
          </p>
        </div>
        <TermBreakdown
          title="Cosine cycle을 이루는 네 용어"
          items={[
            {
              term: "Local progress r",
              description:
                "현재 cycle 안에서 0부터 1까지 움직이는 무차원 위치입니다.",
              example: "t=450, T=900이면 r=.5입니다.",
              boundary:
                "Global update를 total run budget으로 나눈 값과 항상 같지 않습니다.",
            },
            {
              term: "Peak LR",
              description: "Cycle이 시작할 때의 learning rate입니다.",
              example: "ηmax=.1입니다.",
              boundary: "Warmup이 있으면 warmup 끝값과 연결합니다.",
            },
            {
              term: "Minimum LR",
              description: "Cycle 끝에서 도달할 learning-rate 하한입니다.",
              example: "ηmin=.001입니다.",
              boundary:
                "0이어야 하는 것은 아니며 convergence 보장을 뜻하지 않습니다.",
            },
            {
              term: "Warm restart",
              description:
                "다음 cycle의 cursor와 LR phase를 되돌리는 transition입니다.",
              example: "r=1 뒤 r=0, ηmin 뒤 ηmax로 갑니다.",
              boundary:
                "Model parameter와 optimizer state를 초기화하는 cold restart가 아닙니다.",
            },
          ]}
        />
        <CosineRestartViz />
        <ContentBoundary article="cosine-restart-scheduling" />
      </section>

      <section id="cosine-progress" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          반 주기의 시작·중간·끝을 계산합니다
        </h2>
        <ExplainedFormula
          question="ηmax=.1, ηmin=.001에서 cycle 중간 LR가 왜 .0505인가요?"
          idea={
            <p>
              Local progress를 π배해 cosine에 넣고, 1+cos를 2로 나눠 1→0 scale로
              바꾼 뒤 LR range에 적용합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}r_t&=t/T\\a_t&=\tfrac12[1+\cos(\pi r_t)]\\\eta_t&=\eta_{\min}+(\eta_{\max}-\eta_{\min})a_t\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}r_t&=\underbrace{t/T}_{\text{local step을 cycle length로 나눔}}\\a_t&=\underbrace{\tfrac12[1+\cos(\pi r_t)]}_{\substack{\text{반 주기 cosine을}\\\text{1에서 0인 scale로 변환}}}\\\eta_t&=\underbrace{\eta_{\min}+(\eta_{\max}-\eta_{\min})a_t}_{\text{LR range를 scale만큼 보간}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`t/T`,
              annotation: [
                "local step을 cycle length로 나눠",
                "0–1 progress 생성",
              ],
            },
            {
              expression: String.raw`\tfrac12[1+\cos(\pi r_t)]`,
              annotation: [
                "progress를 반 주기 각도로 바꿔",
                "peak→minimum scale 생성",
              ],
            },
            {
              expression: String.raw`\eta_{\min}+(\eta_{\max}-\eta_{\min})a_t`,
              annotation: [
                "LR 폭에 scale을 곱하고 minimum을 더해",
                "현재 learning rate 반환",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`r_t`,
              name: "Cycle progress",
              description: "0–1 사이 local progress입니다.",
            },
            {
              symbol: String.raw`a_t`,
              name: "Cosine scale",
              description: "Peak에서 1, end에서 0인 multiplier입니다.",
            },
            {
              symbol: String.raw`\eta_{\max}`,
              name: "Peak LR",
              description: "Cycle 첫 learning rate입니다.",
            },
            {
              symbol: String.raw`\eta_{\min}`,
              name: "Minimum LR",
              description: "Cycle 끝 learning rate입니다.",
            },
          ]}
          assumptions={[
            "0≤t≤T이고 t는 cycle-local update입니다.",
            "Endpoint 포함 convention을 framework와 맞춥니다.",
            "Warmup은 cycle length 밖에서 별도 구성합니다.",
          ]}
          interpretation="r=.5이면 cos(π/2)=0, a=.5이므로 .001+(.099×.5)=.0505입니다."
        />
      </section>

      <section id="restart-state" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Restart되는 state와 보존되는 state를 나눕니다
        </h2>
        <ExplainedFormula
          question="Cycle 길이가 Tᵢ이고 다음 cycle이 m배 길어질 때 무엇을 갱신하나요?"
          idea={
            <p>
              Cycle이 끝나면 local cursor를 0으로 되돌리고 다음 길이를 곱으로
              늘립니다. Parameter와 optimizer memory는 같은 run의 학습 state로
              남깁니다.
            </p>
          }
          formula={String.raw`\begin{aligned}t_i=T_i&\Rightarrow t_{i+1}=0\\T_{i+1}&=mT_i\\\theta_{i+1}&=\theta_i\\s^{\rm opt}_{i+1}&=s^{\rm opt}_i\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}t_i=T_i&\Rightarrow\underbrace{t_{i+1}=0}_{\text{cycle cursor 초기화}}\\T_{i+1}&=\underbrace{mT_i}_{\text{다음 cycle 길이}}\\\theta_{i+1}&=\underbrace{\theta_i}_{\text{model 위치 보존}}\\s^{\rm opt}_{i+1}&=\underbrace{s^{\rm opt}_i}_{\text{optimizer memory 보존}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`t_{i+1}=0`,
              annotation: [
                "끝난 local cursor를 0으로 바꿔",
                "새 LR phase 시작",
              ],
            },
            {
              expression: String.raw`mT_i`,
              annotation: [
                "현재 cycle 길이에 multiplier를 곱해",
                "다음 cycle budget 결정",
              ],
            },
            {
              expression: String.raw`(\theta,s^{\rm opt})_{i+1}=(\theta,s^{\rm opt})_i`,
              annotation: ["학습 state를 그대로 넘겨", "cold restart와 구분"],
            },
          ]}
          terms={[
            {
              symbol: String.raw`T_i`,
              name: "Cycle length",
              description: "Cycle i의 update 수입니다.",
            },
            {
              symbol: "m",
              name: "Cycle multiplier",
              description: "다음 cycle 길이를 늘리는 비율입니다.",
            },
            {
              symbol: String.raw`\theta`,
              name: "Model parameters",
              description: "Restart 뒤에도 이어지는 learned state입니다.",
            },
            {
              symbol: String.raw`s^{\rm opt}`,
              name: "Optimizer state",
              description:
                "Momentum·moments 등 보존 여부를 명시할 state입니다.",
            },
          ]}
          assumptions={[
            "Warm restart semantics를 사용합니다.",
            "Optimizer state 보존 정책을 명시합니다.",
            "Data order와 random state도 resume receipt에 포함합니다.",
          ]}
          interpretation="LR가 .001에서 .1로 뛰더라도 model을 처음부터 학습하는 것이 아닙니다. Cursor·LR phase만 restart하는 것이 핵심입니다."
        />
      </section>

      <section id="comparison-boundary" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Single cosine과 restart를 같은 compute로 비교합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            동일 initialization·optimizer·data order·total updates에서 single
            cosine과 cycle schedule을 비교합니다. Anytime checkpoint를
            보고했다면 최종 checkpoint와 같은 의미로 섞지 않고 evaluation
            cadence와 selection rule도 고정합니다.
          </p>
        </div>
        <div id="paper-sgdr" className="scroll-mt-24">
          <CitationBlock
            source="SGDR: Stochastic Gradient Descent with Warm Restarts"
            citeKey={1}
            href="https://arxiv.org/abs/1608.03983"
          >
            <strong>문제:</strong> SGD training의 anytime performance와 decay
            schedule. <strong>기여:</strong> Cosine annealing과 partial warm
            restart·cycle 확장을 제안. <strong>전제:</strong> 논문의 SGD
            계열·architecture·dataset·budget. <strong>근거 범위:</strong>{" "}
            CIFAR·EEG·downsampled ImageNet 실험. <strong>과장 금지:</strong>{" "}
            모든 optimizer와 task에서 restart가 single cosine보다 우월하다는
            보장은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
