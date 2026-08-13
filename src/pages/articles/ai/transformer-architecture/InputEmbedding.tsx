import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import PositionSignalViz from "./viz/PositionSignalViz";

export default function InputEmbedding() {
  return (
    <section id="position-information" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        위치 신호는 embedding·Q/K rotation·attention bias 중 어디에 개입할지
        고르는 설계다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Position 정보가 없는 self-attention은 입력 token을 함께 순열해도 같은
          규칙으로 출력 순서만 함께 바뀌는 permutation-equivariant 연산입니다.
          문장에서 순서와 거리를 구분하려면 별도 신호가 필요합니다. 원 논문의
          sinusoidal encoding은 embedding에 더했고, learned absolute embedding도
          같은 위치에 들어갑니다. RoPE는 Q·K를 회전시키며, ALiBi 계열은 score에
          거리 bias를 더합니다.
        </p>
        <p>
          예를 들어 <code>개가 사람을 문다</code>와 <code>사람이 개를 문다</code>는
          비슷한 token 집합을 갖지만 역할은 반대다. Position 신호가 없다면
          self-attention은 입력 token과 출력을 함께 재배열하는 데 그쳐, 어느
          token이 먼저 왔는지를 별도로 표시하지 못한다. Position 신호는 token의
          의미를 대신하는 것이 아니라 이 순서 구분에 필요한 좌표를 추가한다.
        </p>
      </div>

      <PositionSignalViz />

      <ExplainedFormula
        question="Sinusoidal encoding은 하나의 position을 여러 시간 척도로 어떻게 표현하는가?"
        idea={
          <>
            Feature 차원을 두 개씩 묶어 같은 주파수의 sin과 cos를 배치합니다.
            차원 index가 커질수록 파장이 길어져 가까운 순서와 먼 순서를 서로
            다른 척도로 표시합니다.
          </>
        }
        formula={String.raw`\begin{aligned}PE(pos,2i)&=\sin(pos/10000^{2i/d})\\PE(pos,2i+1)&=\cos(pos/10000^{2i/d})\end{aligned}`}
        terms={[
          {
            symbol: "pos",
            name: "token position",
            description: "Sequence 안에서 현재 token이 놓인 정수 위치입니다.",
          },
          {
            symbol: "i",
            name: "frequency pair index",
            description:
              "2i와 2i+1 두 feature가 같은 주파수의 sin·cos pair를 이룹니다.",
          },
          {
            symbol: "d",
            name: "model dimension",
            description:
              "Position vector가 token embedding과 더해질 수 있도록 맞춘 폭입니다.",
          },
          {
            symbol: "10000^{2i/d}",
            name: "wavelength scale",
            description:
              "Dimension에 따라 변화 속도를 기하급수적으로 다르게 만듭니다.",
          },
        ]}
        assumptions={[
          "원 논문의 fixed absolute sinusoidal encoding을 설명한 식입니다.",
          "계산 가능한 position 범위와 model이 학습 길이 밖에서 일반화하는 범위는 같지 않습니다.",
        ]}
        interpretation="Sin·cos pair는 relative offset을 선형 결합으로 표현할 단서를 줍니다. 그러나 긴 context 성능은 position formula 하나가 아니라 attention pattern·training length·scaling recipe가 함께 결정합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          따라서 “context window 128k”라는 설정값만 보고 128k 전체에서 retrieval
          품질이 유지된다고 결론 내리지 않습니다. 학습 길이, position scaling,
          attention layer 구성과 lost in the middle 평가를 함께 봐야 합니다.
          RoPE의 relative phase와 YaRN 확장 수식은{" "}
          <Link to="/ai/yarn-rope-extension">RoPE·YaRN 정본 글</Link>
          에서 이어집니다.
        </p>
      </div>
    </section>
  );
}
