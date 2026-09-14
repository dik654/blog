import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import FloorViz from "./viz/FloorViz";

export default function FloorLoad() {
  return (
    <section id="floor-load" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">가속기 랙은 바닥 허용치를 먼저 넘습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          가속기를 가득 채운 랙은 1톤을 훌쩍 넘습니다. 랙 자체 무게에 섀시와 전원 모듈, 케이블이 더해지고,
          액체 냉각 구성이면 배관과 냉각수 무게도 포함됩니다. 이 무게가 좁은 바닥 면적에 집중되기 때문에
          일반 사무실 기준으로는 들일 수 없는 경우가 생깁니다.
        </p>

        <p className="leading-7">
          바닥 허용치는 두 가지로 주어집니다. 단위 면적당 고르게 퍼진 하중을 견디는 값과, 한 점에 집중된
          하중을 견디는 값입니다. 랙은 보통 네 개의 레벨러나 캐스터로 바닥에 닿기 때문에 집중 하중 쪽이 먼저
          문제가 됩니다.
        </p>

        <p className="leading-7">
          그래서 계산은 두 번 합니다. 랙 전체 무게를 바닥 투영 면적으로 나눠 면하중을 구하고, 같은 무게를
          접지점 수로 나눠 점하중을 구합니다. 둘 다 건물 도면의 허용치와 비교해야 하고, 하나라도 넘으면 하중
          분산판을 쓰거나 위치를 바꿔야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="이 랙이 이 바닥에 들어가는지 어떻게 계산합니까"
        idea="같은 무게를 면적으로 한 번, 접지점 수로 한 번 나눠 두 가지 허용치와 각각 비교합니다."
        formula={String.raw`q = \frac{W}{A},\qquad F = \frac{W}{n}`}
        annotatedFormula={String.raw`\underbrace{q = \frac{W}{A}}_{\text{면하중}},\qquad \underbrace{F = \frac{W}{n}}_{\text{접지점당 점하중}}`}
        operations={[
          {
            expression: "W",
            annotation: [
              "랙 자체 무게에 섀시·전원 모듈·케이블을 더한 총 무게입니다",
              "액체 냉각 구성이면 배관과 냉각수 무게도 포함합니다",
            ],
          },
          {
            expression: String.raw`q = \frac{W}{A}`,
            annotation: "바닥 투영 면적으로 나눠 단위 면적당 하중을 구합니다. 폭 0.6 m · 깊이 1.2 m면 0.72 m²입니다",
          },
          {
            expression: String.raw`F = \frac{W}{n}`,
            annotation: "접지점 수로 나눠 한 점이 받는 힘을 구합니다. 레벨러 네 개면 n은 4입니다",
          },
        ]}
        terms={[
          { symbol: "W", name: "랙 총 무게", description: "장비와 부속을 모두 포함한 값입니다." },
          { symbol: "A", name: "바닥 투영 면적", description: "랙 외형 치수로 계산한 면적입니다." },
          { symbol: "n", name: "접지점 수", description: "레벨러나 캐스터의 개수입니다." },
          { symbol: "q", name: "면하중", description: "단위 면적당 하중이며 건물의 분포 하중 허용치와 비교합니다." },
          { symbol: "F", name: "점하중", description: "한 접지점이 받는 힘이며 집중 하중 허용치와 비교합니다." },
        ]}
        assumptions={[
          "무게가 접지점에 고르게 분배된다고 가정합니다. 실제로는 장비 배치에 따라 한쪽으로 치우칩니다.",
          "이동 중에는 캐스터에 하중이 실려 접지 면적이 더 작아지므로 운반 경로도 따로 확인해야 합니다.",
        ]}
        interpretation="두 값 중 하나만 넘어도 그대로 들일 수 없습니다. 면하중이 문제면 랙을 띄엄띄엄 배치해 평균을 낮추고, 점하중이 문제면 하중 분산판으로 접지 면적을 넓힙니다."
      />

      <FloorViz />

      <h3 id="load-arithmetic" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        숫자를 한 번 넣어 봅니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          가속기를 가득 채운 랙의 총 무게를 1,400 kg으로 잡아 보겠습니다. 폭 0.6 m, 깊이 1.2 m인 랙이면 바닥
          투영 면적은 0.72 m²이고, 면하중은 1,400을 0.72로 나눠 약 1,944 kg/m²입니다. 일반 사무실 설계 기준으로
          흔히 쓰이는 300 kg/m² 수준과는 자릿수가 다릅니다.
        </p>

        <p className="leading-7">
          점하중은 더 극적입니다. 같은 무게를 레벨러 네 개로 나누면 한 점이 350 kg을 받습니다. 레벨러 접지면이
          작으면 그 좁은 면적에 이 힘이 모두 실립니다. 이 값이 이중 바닥 패널이나 슬래브의 집중 하중 허용치를
          넘는지가 실제 판정 기준이 됩니다.
        </p>

        <p className="leading-7">
          그래서 현실적인 대응은 셋입니다. 랙 사이를 띄워 평균 면하중을 낮추거나, 하중 분산판을 깔아 접지
          면적을 넓히거나, 구조가 보강된 구역에 배치하는 것입니다. 어느 쪽이든 건물 도면과 구조 담당의 확인이
          필요하며 IT 조직이 단독으로 결정할 수 없습니다.
        </p>

        <p className="leading-7">
          숫자는 구성마다 다릅니다. 여기 쓴 값은 계산 방법을 보여 주기 위한 예시이고, 실제로는 랙 제조사가
          제공하는 무게와 장비별 실측 무게를 합해 구해야 합니다. 랙에 무엇을 넣을지의 기구 점검 항목은{" "}
          <Link to="/cs/gpu/hw-power-cooling#rack">전력과 냉각</Link>의 체크리스트와 함께 봅니다.
        </p>
      </div>
    </section>
  );
}
