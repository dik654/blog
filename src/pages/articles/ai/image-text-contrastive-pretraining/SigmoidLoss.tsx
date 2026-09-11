import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import SigmoidViz from "./viz/SigmoidViz";

export default function SigmoidLoss({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="sigmoid-loss" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">정규화를 없애면 쌍마다 독립이 됩니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          같은 N×N 유사도 행렬을 놓고 다르게 물을 수 있습니다. "이 행에서 어느 칸이 정답인가" 대신 "이 칸은
          짝인가 아닌가"를 칸마다 따로 묻는 것입니다. 그러면 각 칸이 독립적인 이진 분류가 되고 행 전체를 더하는
          정규화 상수가 사라집니다.
        </p>

        <p className="leading-7">
          구현은 부호 행렬 하나로 끝납니다. 대각선은 +1, 나머지는 -1인 행렬을 유사도에 곱한 뒤 로그 시그모이드를
          취하면, 양성 칸은 로짓이 클수록 손실이 줄고 음성 칸은 작을수록 줄어듭니다. 소프트맥스가 없으므로 한
          칸의 손실이 같은 행의 다른 칸에 의존하지 않습니다.
        </p>

        <p className="leading-7">
          이 독립성이 분산 학습에서 차이를 만듭니다. 정규화 상수를 구하려면 모든 장치의 유사도를 한곳에 모아야
          하지만, 칸마다 독립이면 자기 장치가 가진 조각에서 손실을 계산해 더하기만 하면 됩니다. 장치마다
          유지해야 하는 행렬 조각도 배치 전체가 아니라 조각 크기의 제곱으로 줄어듭니다.
        </p>
      </div>

      <ExplainedFormula
        question="정규화 없이 각 칸을 어떻게 학습시킵니까"
        idea="대각선은 양성, 나머지는 음성인 이진 라벨을 만들고 칸마다 로지스틱 손실을 겁니다."
        formula={String.raw`\mathcal{L} = -\frac{1}{N}\sum_{i=1}^{N}\sum_{j=1}^{N}\log\sigma\left(z_{ij}\left(t\,s_{ij} + b\right)\right)`}
        annotatedFormula={String.raw`\mathcal{L} = -\frac{1}{N}\sum_{i}\sum_{j}\log\sigma\Big(\underbrace{z_{ij}}_{\text{대각 }+1,\ \text{그 외 }-1}\big(\underbrace{t\,s_{ij}}_{\text{온도 적용}} + \underbrace{b}_{\text{편향}}\big)\Big)`}
        operations={[
          {
            expression: String.raw`z_{ij}`,
            annotation: [
              "대각선만 +1이고 나머지는 -1인 부호 행렬입니다",
              "구현은 -ones + 2·eye 로 한 줄에 만듭니다",
            ],
          },
          {
            expression: String.raw`t\,s_{ij} + b`,
            annotation: "유사도에 온도를 곱하고 편향을 더한 값이 그 칸의 로짓입니다. 정규화 상수가 없습니다",
          },
          {
            expression: String.raw`\log\sigma\left(z_{ij}(t\,s_{ij}+b)\right)`,
            annotation: "양성 칸은 로짓이 클수록, 음성 칸은 작을수록 손실이 줄어듭니다",
          },
          {
            expression: String.raw`\sum_{j}`,
            annotation: "행 안의 모든 칸을 그냥 더합니다. 확률의 합을 1로 맞추는 제약이 없습니다",
          },
        ]}
        terms={[
          { symbol: String.raw`z_{ij}`, name: "부호 라벨", description: "짝이면 +1, 아니면 -1입니다." },
          { symbol: "b", name: "학습되는 편향", description: "음성 쌍이 압도적으로 많은 초기 상태를 보정하는 값입니다." },
          { symbol: String.raw`\sigma`, name: "시그모이드", description: "로짓을 0과 1 사이 확률로 바꿉니다." },
          { symbol: "t", name: "학습되는 온도 계수", description: "소프트맥스 쪽과 같은 역할이며 여기서도 함께 학습됩니다." },
        ]}
        assumptions={[
          "비대각 쌍이 모두 진짜 음성이라는 가정은 여기서도 그대로입니다.",
          "편향과 온도는 모두 학습 파라미터이며 초기값 선택이 학습 초반 안정성에 영향을 줍니다.",
        ]}
        interpretation="정규화가 사라지면 손실이 배치 구성에 덜 묶입니다. 다만 음성 칸이 N배 많아 그대로 두면 손실이 음성 쪽으로 기울기 때문에 편향 항이 필요합니다."
      />

      <SigmoidViz />

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("siglip-loss", codeRefs["siglip-loss"])} />
        <span className="text-xs text-muted-foreground">부호 행렬과 로그 시그모이드, 그리고 학습되는 편향</span>
      </div>

      <h3 id="logit-bias" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        음성 쌍이 N배 많다는 사실을 편향이 흡수합니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          배치가 1,024면 한 행에 양성이 하나, 음성이 1,023개입니다. 칸마다 독립으로 학습하면 초반 기울기가
          거의 전부 음성에서 옵니다. 모델은 일단 모든 쌍을 "아니다"라고 답하는 쪽으로 빠르게 이동하고, 그
          상태에서 양성 신호를 다시 끌어올리는 데 시간이 걸립니다.
        </p>

        <p className="leading-7">
          편향 항은 이 불균형을 상수 하나로 흡수합니다. 모든 로짓에 같은 값을 더하므로 유사도의 상대 관계는
          바꾸지 않으면서 전체 판정선을 옮깁니다. 초기에 음수로 시작하면 "웬만하면 아니다"가 기본값이 되어,
          모델이 그 사실을 표현으로 학습하지 않아도 됩니다.
        </p>

        <p className="leading-7">
          소프트맥스 쪽에는 이 항이 없습니다. 행 안에서 확률을 나눠 갖는 구조라 불균형이 정규화에 이미 반영돼
          있기 때문입니다. 같은 문제를 한쪽은 정규화로, 다른 쪽은 학습되는 상수로 처리한다는 점이 두 손실의
          설계 차이를 잘 보여 줍니다.
        </p>
      </div>
    </section>
  );
}
