import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import PowerViz from "./viz/PowerViz";

export default function PowerSizing() {
  return (
    <section id="power-sizing" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">명판 전력과 실제 전력은 다른 숫자입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          서버에 적힌 전원 용량은 그 섀시가 최대로 끌 수 있는 값이고, 회로를 설계할 때 쓰는 값은 그 부하가
          실제로 지속해서 끄는 값입니다. 둘을 혼동하면 회로를 지나치게 크게 잡아 비용을 낭비하거나, 반대로
          피크에서 차단기가 내려가는 상황을 만듭니다.
        </p>

        <p className="leading-7">
          가속기 서버의 특징은 이 두 값의 간격이 크다는 점입니다. 유휴 상태에서는 전원 모듈 용량의 일부만
          쓰지만, 여러 장이 동시에 최대 부하로 올라가면 순간적으로 명판에 가까워집니다. 학습 작업은 이 전환이
          매우 빠르게 일어납니다.
        </p>

        <p className="leading-7">
          그래서 회로는 지속 부하 기준으로 잡되 피크를 감당할 여유를 둡니다. 전기 설계에서는 지속 부하에
          여유율을 곱한 값을 회로 용량으로 삼는 관행이 있고, 이 여유율이 곧 피크와 안전율을 함께 흡수합니다.
        </p>
      </div>

      <ExplainedFormula
        question="회로 용량을 어떤 값으로 잡아야 합니까"
        idea="섀시별 지속 부하를 더한 뒤 여유율을 곱하고, 이중화 구성이면 한 경로가 감당해야 할 몫으로 다시 나눕니다."
        formula={String.raw`P_{\text{circuit}} \ge \frac{k \sum_{i} P_i}{r}`}
        annotatedFormula={String.raw`P_{\text{circuit}} \ge \frac{\overbrace{k}^{\text{여유율}} \sum_{i} \overbrace{P_i}^{\text{섀시 지속 부하}}}{\underbrace{r}_{\text{정상 시 경로 분담}}}`}
        operations={[
          {
            expression: String.raw`\sum_{i} P_i`,
            annotation: [
              "랙에 들어가는 섀시의 지속 부하를 더합니다",
              "명판 용량이 아니라 실제 관측하거나 벤더가 제시한 지속값을 씁니다",
            ],
          },
          {
            expression: String.raw`k \sum_{i} P_i`,
            annotation: "여유율을 곱해 피크와 안전율을 흡수합니다. 값은 지역 전기 기준과 사내 규정을 따릅니다",
          },
          {
            expression: String.raw`\frac{\cdot}{r}`,
            annotation: "두 경로가 정상 시 절반씩 나눠 지면 r은 0.5이며, 한 경로가 끊겼을 때 나머지가 전부를 받습니다",
          },
        ]}
        terms={[
          { symbol: String.raw`P_{\text{circuit}}`, name: "회로 용량", description: "한 급전 경로가 제공해야 하는 용량입니다." },
          { symbol: String.raw`P_i`, name: "섀시 지속 부하", description: "명판이 아니라 실제 지속 소비 전력입니다." },
          { symbol: "k", name: "여유율", description: "피크와 안전율을 흡수하는 계수이며 규정에서 정해집니다." },
          { symbol: "r", name: "정상 시 경로 분담률", description: "이중 급전에서 한 경로가 평소 지는 비율입니다." },
        ]}
        assumptions={[
          "지속 부하 값이 실제 워크로드에서 측정됐다고 가정합니다. 유휴 상태에서 잰 값을 쓰면 과소 산정됩니다.",
          "여유율과 회로 산정 기준은 지역 전기 규정에 따르며 이 식은 구조만 보여 줍니다.",
        ]}
        interpretation="이중화 구성에서 각 경로를 절반 용량으로 잡으면 한 경로가 끊겼을 때 남은 경로가 두 배를 받아 차단됩니다. 이중화는 용량을 나누는 것이 아니라 각 경로가 전부를 감당할 수 있어야 성립합니다."
      />

      <PowerViz />

      <h3 id="redundancy" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        이중화 표기는 감당 범위를 말합니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          전원 모듈이 넷이라고 적혀 있어도 그 넷이 모두 필요한 구성인지, 하나가 예비인지에 따라 의미가 완전히
          다릅니다. 필요한 수에 하나를 더한 구성은 모듈 하나가 고장 나도 계속 돕니다. 필요한 수만큼만 있으면
          하나가 빠지는 순간 용량이 모자랍니다.
        </p>

        <p className="leading-7">
          건물 쪽 급전이 둘인 구성은 또 다른 층위입니다. 각 경로가 전체 부하를 혼자 감당할 수 있어야 한쪽
          정전에서 살아남습니다. 두 경로에 절반씩 나눠 설계하면 평소에는 여유로워 보이지만 한쪽이 끊기는 순간
          남은 쪽이 두 배를 받아 차단됩니다.
        </p>

        <p className="leading-7">
          그래서 확인 순서는 모듈 수준과 급전 수준을 나눠 보는 것입니다. 모듈 이중화는 섀시 사양에서, 급전
          이중화는 랙과 건물 배전에서 정해집니다. 두 층이 모두 갖춰져야 한 지점 고장으로 랙이 죽지 않습니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="지속 부하를 어떻게 재나요"
          preview="대표 워크로드를 돌리면서 랙 전원 분배 장치의 계측값을 일정 기간 기록하는 것이 가장 정확합니다."
        >
          <p className="leading-7">
            벤더가 제시하는 구성별 소비 전력은 기준 구성에서의 값이라 실제 장착한 카드와 저장장치 조합과 다를
            수 있습니다. 그래서 도입 초기에 대표 워크로드를 돌리며 실제 값을 기록해 두는 편이 낫습니다.
          </p>
          <p className="leading-7">
            기록할 것은 평균만이 아니라 분포입니다. 짧고 높은 피크가 반복되면 평균은 낮아도 차단기 특성에 따라
            트립이 일어날 수 있습니다. 랙 전원 분배 장치의 계측 기능과 경보 기준은{" "}
            <Link to="/cs/gpu/hw-power-cooling#rack">전력과 냉각</Link>에서 다룹니다.
          </p>
          <p className="leading-7">
            측정 없이 설계해야 한다면 명판 대비 보수적인 비율을 가정하고, 도입 후 실측으로 다시 조정하는 절차를
            미리 계획에 넣어 둡니다. 이 조정이 없으면 과잉 설계가 그대로 고정 비용이 됩니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
