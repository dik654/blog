import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { PruningMaskViz } from "./viz/ModernPruningViz";

export default function PruningArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          먼저 weight 하나를 “남길지” 표시하는 물체부터 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Pruning</strong>은 모델의 일부 연결이나 계산 단위를 제거
            대상으로 확정하는 압축 절차입니다. 숫자 0을 쓰는 것과 실제 계산을
            없애는 것은 다릅니다.
          </p>
          <p>
            이 글은 mask와 sparsity까지만 다룹니다. 불규칙한 weight 제거는{" "}
            <a href="/ai/unstructured-pruning">unstructured pruning</a>, shape
            축소는 <a href="/ai/structured-pruning">structured pruning</a>, LLM
            one-shot 방법은 <a href="/ai/one-shot-llm-pruning">별도 글</a>,
            복구와 배포는{" "}
            <a href="/ai/pruning-recovery-deployment">release 글</a>에서
            이어집니다.
          </p>
        </div>
        <TermBreakdown
          title="Pruning의 첫 네 용어"
          items={[
            {
              term: "Weight",
              description: "입력에 곱해지는 학습된 숫자입니다.",
              example: "Linear layer의 W[i,j]입니다.",
              boundary:
                "값이 0이어도 dense kernel은 그 자리를 계산할 수 있습니다.",
            },
            {
              term: "Mask M",
              description: "각 제거 후보를 남길지 표시하는 0/1 tensor입니다.",
              example: "M[i,j]=0이면 해당 연결을 제거합니다.",
              boundary:
                "Mask가 어떤 tensor와 generation에 속하는지 함께 기록합니다.",
            },
            {
              term: "Density ρ",
              description: "대상 자리 중 남긴 비율입니다.",
              example: "10개 중 4개를 남기면 ρ=.4입니다.",
              boundary: "대상 layer를 바꾸면 같은 count도 비율이 달라집니다.",
            },
            {
              term: "Sparsity s",
              description: "대상 자리 중 제거한 비율입니다.",
              example: "ρ=.4이면 s=.6입니다.",
              boundary: "파일·FLOPs·latency 감소율과 같은 숫자가 아닙니다.",
            },
          ]}
        />
        <PruningMaskViz />
        <ContentBoundary article="pruning" />
      </section>

      <section id="mask-shape" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Mask를 weight 위에 올려 실제 남은 연결을 만듭니다
        </h2>
        <ExplainedFormula
          question="Weight 10개 중 4개를 남겼다는 말을 식으로 어떻게 고정하나요?"
          idea={
            <p>
              같은 shape의 binary mask를 원소별로 곱하고, mask의 1 개수를 전체
              대상 수로 나눕니다.
            </p>
          }
          formula={String.raw`W'=M\odot W,\quad \rho=\lVert M\rVert_0/N,\quad s=1-\rho`}
          annotatedFormula={String.raw`\begin{aligned}W'&=\underbrace{M\odot W}_{\text{제거할 연결을 0으로 봉인}}\\K&=\underbrace{\lVert M\rVert_0}_{\text{mask의 1을 세어 남은 수 계산}}\\\rho&=\underbrace{K/N}_{\text{전체 대상 수로 나눠 density 계산}}\\s&=\underbrace{1-\rho}_{\text{남은 비율을 전체에서 빼 제거 비율 계산}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`M\odot W`,
              annotation: [
                "mask와 weight를 자리별로 곱해",
                "제거한 연결을 0으로 봉인",
              ],
            },
            {
              expression: String.raw`\lVert M\rVert_0`,
              annotation: ["mask의 1만 세어", "남은 연결 수 계산"],
            },
            {
              expression: String.raw`K/N`,
              annotation: [
                "남은 수를 전체 수로 나눠",
                "규모와 무관한 density 계산",
              ],
            },
            {
              expression: String.raw`1-\rho`,
              annotation: ["전체 비율에서 density를 빼", "제거 비율 계산"],
            },
          ]}
          terms={[
            {
              symbol: "W",
              name: "원래 weights",
              description: "Pruning 전 tensor입니다.",
            },
            {
              symbol: "M",
              name: "Binary mask",
              description: "W와 같은 shape의 0/1 표시입니다.",
            },
            {
              symbol: String.raw`W'`,
              name: "Masked weights",
              description: "Mask 적용 뒤 사용하는 tensor입니다.",
            },
            {
              symbol: "N",
              name: "대상 수",
              description: "Pruning 분모에 포함한 전체 자리 수입니다.",
            },
            {
              symbol: String.raw`\rho,s`,
              name: "Density·sparsity",
              description: "남긴 비율과 제거한 비율입니다.",
            },
          ]}
          assumptions={[
            "M은 0 또는 1이며 W와 shape가 같습니다.",
            "대상 tensor와 분모 N을 먼저 고정합니다.",
            "Dense zero를 runtime 제거로 간주하지 않습니다.",
          ]}
          interpretation="K=4,N=10이면 density=.4, sparsity=.6입니다. 하지만 W′를 dense format과 dense GEMM으로 실행하면 계산 shape는 그대로입니다."
        />
      </section>

      <section id="removal-unit" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          그다음 “무엇을 한 단위로 지우는가”를 선택합니다
        </h2>
        <TermBreakdown
          title="제거 단위가 바꾸는 실행 형태"
          items={[
            {
              term: "Individual weight",
              description: "행렬의 임의 원소를 하나씩 제거합니다.",
              example: "좌표마다 불규칙한 mask가 생깁니다.",
              boundary: "Value뿐 아니라 index와 sparse kernel이 필요합니다.",
            },
            {
              term: "N:M group",
              description: "작은 local group마다 정해진 수만 남깁니다.",
              example: "2:4는 네 자리마다 두 자리를 남깁니다.",
              boundary: "전체 50%만 맞춘 arbitrary mask와 다릅니다.",
            },
            {
              term: "Channel·head",
              description: "연결된 dimension 전체를 제거합니다.",
              example: "현재 output과 다음 input width가 함께 줄어듭니다.",
              boundary: "Residual·projection 경로의 shape도 맞춰야 합니다.",
            },
          ]}
        />
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Mask 숫자에서 끝내지 않고 다음 소비자를 적습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pruning receipt에는 base checkpoint, 대상 tensor, removal unit, mask
            generation, density 분모, export format과 예상 consumer를 남깁니다.
            이 handoff가 없으면 “60% sparse”는 저장·실행 의미가 없는 통계일 수
            있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
