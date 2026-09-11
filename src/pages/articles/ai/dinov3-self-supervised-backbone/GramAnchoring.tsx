import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import TermBreakdown from "@/components/articles/term-breakdown";
import { codeRefs } from "./codeRefs";
import GramViz from "./viz/GramViz";

export default function GramAnchoring({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="gram-anchoring" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">값을 베끼지 않고 패치 사이 관계만 붙잡습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Gram anchoring은 학습 도중의 한 시점을 기준으로 삼아, 그 시점의 패치 유사도 구조를 지금 모델이 유지하게
          만드는 손실입니다. 특징 벡터 자체를 따라가게 하면 학습이 거기서 멈춥니다. 대신 패치들끼리의 유사도
          행렬만 맞추면 값은 계속 움직이면서 관계 구조만 보존됩니다.
        </p>

        <p className="leading-7">
          유사도 행렬을 만드는 방법은 단순합니다. 한 이미지의 패치 특징을 길이 1로 정규화하면 두 패치의 내적이
          코사인 유사도가 됩니다. 패치가 P개면 P×P 행렬 하나가 나오고, 이 행렬이 "어느 패치가 어느 패치와 닮았는가"
          를 통째로 담습니다. 학습 대상은 이 행렬입니다.
        </p>

        <p className="leading-7">
          이 선택이 중요한 이유는 행렬이 특징 공간의 회전에 영향을 받지 않는다는 데 있습니다. 모델이 표현 전체를
          돌려놓아도 패치 쌍의 각도는 그대로라 손실이 커지지 않습니다. 학습은 계속 자유롭게 움직일 수 있고,
          잃으면 안 되는 구조만 고정됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="관계를 맞춘다는 것을 손실로 어떻게 씁니까"
        idea="student와 기준 teacher가 각각 자기 패치들끼리의 유사도 행렬을 만들고, 두 행렬의 차이를 재서 줄입니다."
        formula={String.raw`\mathcal{L}_{\text{Gram}} = \left\| \mathbf{X}_S \mathbf{X}_S^{\top} - \mathbf{X}_G \mathbf{X}_G^{\top} \right\|_F^2`}
        annotatedFormula={String.raw`\mathcal{L}_{\text{Gram}} = \Big\| \underbrace{\mathbf{X}_S \mathbf{X}_S^{\top}}_{\text{student 패치 유사도}} - \underbrace{\mathbf{X}_G \mathbf{X}_G^{\top}}_{\text{기준 teacher 유사도}} \Big\|_F^2`}
        operations={[
          {
            expression: String.raw`\mathbf{X}_S`,
            annotation: [
              "student가 낸 패치 특징을 행마다 하나씩 쌓은 P×d 행렬입니다",
              "각 행을 L2 정규화해 내적이 코사인 유사도가 되게 만듭니다",
            ],
          },
          {
            expression: String.raw`\mathbf{X}_S \mathbf{X}_S^{\top}`,
            annotation: "P×P 유사도 행렬입니다. (i, j) 성분이 패치 i와 패치 j의 닮은 정도입니다",
          },
          {
            expression: String.raw`\mathbf{X}_S \mathbf{X}_S^{\top} - \mathbf{X}_G \mathbf{X}_G^{\top}`,
            annotation: "두 관계 구조의 차이입니다. 특징값이 아니라 쌍의 각도만 비교합니다",
          },
          {
            expression: String.raw`\left\| \cdot \right\|_F^2`,
            annotation: "성분별 제곱합입니다. 공개 구현은 같은 값을 원소 수로 나눈 평균제곱오차로 계산합니다",
          },
        ]}
        terms={[
          { symbol: String.raw`\mathbf{X}_S`, name: "student 패치 행렬", description: "지금 학습 중인 모델의 정규화된 패치 특징 P×d입니다." },
          { symbol: String.raw`\mathbf{X}_G`, name: "Gram teacher 패치 행렬", description: "기준으로 삼은 이전 시점 모델의 정규화된 패치 특징입니다." },
          { symbol: "P", name: "패치 수", description: "이미지 하나에서 나온 패치 토큰 개수입니다. 유사도 행렬의 한 변입니다." },
          { symbol: "d", name: "특징 차원", description: "패치 하나를 나타내는 벡터 길이이며 손실에는 정규화된 방향만 들어갑니다." },
        ]}
        assumptions={[
          "행렬은 기본적으로 이미지 한 장 안의 패치들로만 만듭니다. 배치 전체 패치를 한 행렬로 묶는 선택지도 구현에 있습니다.",
          "정규화를 끄면 내적이 코사인 유사도가 아니게 되므로 크기 차이가 손실에 섞여 들어갑니다.",
        ]}
        interpretation="이 손실은 student가 teacher와 같은 특징을 내도록 만들지 않습니다. 같은 패치들끼리 같은 정도로 닮아 있기만 하면 값은 달라도 됩니다. 반대로 기준 teacher의 관계 구조가 이미 나쁘면 그 나쁜 구조를 그대로 유지시키는 손실이 됩니다."
      />

      <GramViz />

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("gram-loss", codeRefs["gram-loss"])} />
        <span className="text-xs text-muted-foreground">정규화·유사도·음수 절단·MSE의 실제 순서</span>
      </div>

      <h3 id="gram-teacher" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        기준 teacher는 언제 세우고 언제 갱신합니까
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          기준을 처음부터 세우면 아직 나쁜 구조를 붙잡게 됩니다. 그래서 사전학습 100만 스텝이 끝난 뒤에야 이 항을
          켭니다. 그 시점의 teacher를 복사해 Gram teacher로 세우고, 이후 1만 스텝마다 현재 teacher와 같은 값으로
          다시 맞춥니다. 기준이 아주 느리게 따라오는 두 번째 teacher가 하나 더 생기는 셈입니다.
        </p>

        <p className="leading-7">
          갱신 주기가 규제 강도를 정합니다. 자주 갱신하면 기준이 현재 모델을 따라가 버려 붙잡는 힘이 약해지고,
          아예 갱신하지 않으면 낡은 구조에 묶여 나머지 목표의 개선까지 막습니다. 1만 스텝은 그 사이에서 고른 공개
          설정값입니다.
        </p>

        <p className="leading-7">
          한 가지 장치가 더 있습니다. 기준 특징을 만들 때 Gram teacher에는 두 배 해상도의 이미지를 넣고, 나온 특징
          맵을 2×2로 묶어 원래 크기로 줄입니다. 같은 패치 격자에 대해 더 촘촘히 본 결과를 평균한 값이 기준이 되므로,
          붙잡는 관계 구조 자체가 더 정밀해집니다.
        </p>
      </div>

      <TermBreakdown
        title="이 절에 나온 세 teacher를 구분합니다"
        description="모두 student에서 파생되지만 갱신 속도와 역할이 다릅니다."
        items={[
          {
            term: "EMA teacher",
            description: "매 스텝 student 가중치를 조금씩 섞어 받는 기본 teacher입니다. 이미지·패치 수준 목표의 정답을 만듭니다.",
            example: "student가 한 스텝 움직이면 teacher도 같은 방향으로 아주 조금 움직입니다.",
            boundary: "따로 학습되지 않습니다. gradient가 teacher로 흐르지 않습니다.",
          },
          {
            term: "Gram teacher",
            description: "관계 구조의 기준으로 삼는 복사본입니다. 1만 스텝마다 EMA teacher 값으로 다시 맞춥니다.",
            example: "100만 스텝 이후에 처음 세우고, 이후 계단식으로 갱신합니다.",
            boundary: "갱신 사이에는 완전히 고정입니다. EMA처럼 매 스텝 따라오지 않습니다.",
          },
          {
            term: "고해상도 Gram teacher",
            description: "두 배 해상도 입력을 받아 특징 맵을 2×2로 줄여 기준을 만드는 변형입니다.",
            example: "해상도 적응 단계에서는 가장 큰 7B 모델이 이 역할을 맡습니다.",
            boundary: "계산량이 늘어나므로 상시가 아니라 해당 단계에서만 씁니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          정리 단계의 손실은 사전학습 세 항에 이 항을 더한 형태입니다. 각 항에 가중치가 붙어 이미지 수준 목표와
          관계 보존 사이의 균형을 조절합니다. 구현에는 음수 유사도를 0으로 자르는 선택지도 있는데, 서로 무관한
          패치 쌍의 미세한 음수 차이가 손실을 지배하지 않게 하는 장치입니다.
        </p>
      </div>
    </section>
  );
}
