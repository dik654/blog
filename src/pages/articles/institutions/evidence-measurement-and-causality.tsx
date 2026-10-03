import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10이 8이 되었다는 관찰과 원인을 안다는 말은 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            전기를 덜 쓰게 해 준다는 장치를 달았더니 사용량이 10에서 8로 줄었습니다. 장치가 도움이 됐을 수 있습니다. 날씨가 바뀌었거나 집을 비운 시간이 늘었을 수도 있습니다.
            관측된 변화는 시작점이고 그 이유를 판단하려면 비교가 필요합니다.
          </p>
          <p className="leading-8">이 글은 숫자를 읽을 때 거치는 세 질문을 설명합니다. 제대로 재었는지, 적절한 대상과 비교했는지, 그 결과를 어디까지 적용할 수 있는지입니다. 과학 논문과 정책 통계, 상품의 성능 주장을 읽을 때 같은 순서로 물을 수 있습니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">변화와 원인의 차이를 잡았습니다. 측정에서 주장까지 어떤 단계를 지나는지 먼저 봅니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">대상을 고르고 재고 비교한 뒤 주장을 만듭니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">현실의 집과 사용 행동을 관찰해 수치로 기록합니다. 그중 비교할 집과 기간을 정하고 차이를 계산합니다. 마지막에 그 차이가 장치 때문에 생겼는지, 다른 집에도 적용할 수 있는지 판단합니다.</p>
          <p className="leading-8">대상을 고르는 단계에서 특정 집만 모이면 처음부터 범위가 좁아집니다. 재는 방법이 달라져도 차이가 생깁니다. 계산식이 맞다는 이유만으로 앞 단계의 문제가 사라지지는 않습니다.</p>
        </div>

        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">대상·측정·비교·해석이 다른 일을 한다는 점이 보입니다.20가구의 가정 숫자로 좁혀 봅니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">A와 B는 각 10가구이며 처음에는 모두 평균 10입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">(가정) A와 B에 각각 10가구가 있습니다. 같은 기간의 하루 평균 전력 사용량은 두 집단 모두 가구당 10kWh입니다. A에만 장치를 설치한 뒤 A는 8kWh, B는 9kWh가 됩니다. 계절과 계기, 관측 기간을 기록하며 이 값은 실제 연구 결과가 아닙니다.</p>
          <p className="leading-8">A의 감소는 2kWh, B의 감소는 1kWh입니다. A의 20% 감소를 모두 장치 덕분이라고 쓰기 전에 장치가 없었던 B에서도 1kWh가 줄었다는 사실을 설명해야 합니다. 각 집의 개별 값과 변동성은 아직 주어지지 않았습니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">동일한 단위의 두 변화를 얻었습니다. 비교가 어떤 차이를 빼는지 그림으로 확인합니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">A의 변화에서 B의 변화를 한 번 더 뺍니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">A는 8−10=−2이고 B는 9−10=−1입니다. 두 변화의 차이는−2−(−1)=−1kWh/가구·일입니다. 음수는 이 계산에서 사용량이 추가로 줄었다는 방향입니다.</p>
          <p className="leading-8">이 1을 장치 효과로 읽으려면 A도 장치가 없었다면 B와 같은 1만큼 줄었을 것이라는 조건이 필요합니다. 그림의 마지막 값은 산술 결과를 보여줍니다. 그 조건이 현실에서 맞는지는 별도 증거가 필요합니다.</p>
        </div>
        <NumericPath title="(가정) 두 집단의 변화 차이" steps={[{"label": "A의 변화", "value": "−2kWh", "detail": "8−10"}, {"label": "B의 변화", "value": "−1kWh", "detail": "9−10"}, {"label": "두 변화의 차이", "value": "−1kWh", "detail": "동일 추세 가정은 별도"}]} />

        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">차이의 계산은 완성됐습니다. 비교의 조건이 왜 필요한지 살펴봅니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">계기·대상·동시 변화가 각각 비교를 흔듭니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            같은 물건을 반복해서 재도 계기가 항상 높게 표시하면 잘못된 값이 반복됩니다. 계기가 정확해도 다른 기간을 비교하면 날씨나 재실시간의 차이가 섞입니다. 무엇을 같은 조건으로
            유지했는지 먼저 적어야 합니다.
          </p>
          <p className="leading-8">장치를 원하는 집만 A에 모였다면 원래부터 절약에 적극적일 수 있습니다. 장치와 함께 실내온도도 바꾸었다면 두 원인이 겹칩니다. 관측된 1을 한 원인에 주려면 이런 차이를 줄이거나 설명해야 합니다.</p>
          <p className="leading-8">비교 집단을 두는 이유는 개입 없이도 생기는 변화를 살피기 위해서입니다. 그러나 두 집단에 서로 다르게 작용한 일이 있으면 같은 1을 빼는 것으로 충분하지 않습니다. 비용이 싸고 계산이 쉽다는 것과 좋은 비교라는 것은 다른 조건입니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">여러 오류가 같은 숫자에 섞일 수 있음을 확인했습니다. 이제 각 문제에 쓰는 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">반복성·반사실·교란을 구분합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">같은 조건에서 반복한 값이 서로 가까운 성질을 반복성이라고 부릅니다. 측정결과에 남은 불확실성은 반복 변동뿐 아니라 교정·환경·방법의 정보도 포함합니다. 화면이 0.1kWh 단위로 표시된다고 전체 불확실성이±0.1kWh라고 결론 낼 수 없습니다.</p>
          <p className="leading-8">A가 장치를 설치하지 않았다면 어떤 결과를 얻었을지를 반사실이라고 부릅니다. 같은 집의 같은 시각에 설치와 미설치를 모두 관찰할 수 없으므로 다른 집단이나 설계로 이 값을 추정합니다.</p>
          <p className="leading-8">장치 선택과 사용량에 함께 영향을 주는 절약 성향처럼 원인을 뒤섞는 요인을 교란이라고 부릅니다. 측정 오류, 교란, 우연한 표본 차이는 서로 다른 문제입니다. 한 가지 절차로 모두 해결되지 않습니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">세 이름이 맡는 질문을 나눴습니다. 처음의 A10→8·B10→9를 해석 조건까지 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">추가감소 1을 원인으로 읽을 수 있는 조건을 적습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">먼저 A의 단순 감소 2와 B의 감소 1을 같은 단위로 계산합니다. 이어 A도 개입 없이 B와 같은 추세를 따랐을 것이라고 가정해 추가감소 1을 얻습니다. 이전 여러 기간의 움직임과 측정 조건을 보는 것이 이 가정을 검토하는 데 도움을 줍니다. 과거가 비슷했다고 미래 가정까지 증명되는 것은 아닙니다.</p>
          <p className="leading-8">A만 집을 비우는 시간이 늘었다면 추가감소에는 그 변화가 섞입니다. 이 경우 B의 1을 빼는 계산은 맞아도 장치 효과라는 해석은 흔들립니다. 재실시간을 관측하고 더 적절한 비교 또는 새 실험을 설계해야 합니다.</p>
          <p className="leading-8">
            두 집단 사이에 장치 사용법이 퍼지거나 B도 다른 절약 장치를 달았다면 비교 조건이 다시 바뀝니다. 누가 어떤 개입을 받았는지 기록해야 하는 이유입니다. 계산은 같은 사례를
            재현하고 원인 해석은 별도 가정을 공개합니다.
          </p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">산술 1과 원인효과 1은 같은 근거 수준이 아닙니다. 실제 측정 문서에서 조건을 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">NIST의 반복 조건을 계기 기록에 적용합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">(가정) 같은 대상을 같은 조건에서 재어 8.0·8.1·7.9kWh를 얻었다면 평균은 8.0kWh입니다. 값이 가까워 보인다는 것만으로 실제 사용량이 정확히 8.0이라고 확정할 수 없습니다. 기준 계기와의 비교와 측정 절차가 필요합니다.</p>
          <p className="leading-8">NIST TN1297의 반복성 설명은 방법·관찰자·계기·장소·짧은 반복 기간 같은 조건을 명시합니다. 이 조건은 원인 비교에 들어가는 숫자가 어떻게 만들어졌는지 확인하게 합니다. 여러 날 실제 사용량이 다른 값을 동일 대상을 반복 측정한 값과 혼동하지 않습니다.</p>
          <p className="leading-8">(가정) A에서만 계기를 교체해 이후 값이 0.5kWh 낮게 기록되었다면 관측된 추가감소 1 중 0.5가 측정 변화일 수 있습니다. 교정정보로 그 영향을 확인한 뒤 계산해야 합니다. 나머지 0.5도 동시 변화가 없다는 조건을 따로 검토해야 장치와 연결할 수 있습니다.</p>
        </div>

        <SourceApplication source="NIST · TN1297 Appendix D1, §D.1.1.2" excerpt="the same measuring instrument, used under the same conditions" application="A의 8.0·8.1·7.9를 비교하려면 같은 대상·시간창·계기·방법인지 확인합니다. 이후에 계기를 바꿔 0.5 낮게 기록되었다면 장치 효과를 계산하기 전에 그 변화를 따로 확인해야 합니다." />
        <CitationBlock source="NIST · TN1297 Appendix D1, §D.1.1.2" citeKey={1} href="https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-appendix-d1-terminology">반복성의 측정 조건과 정확도·오차·불확실성을 구분합니다. 계기교체 사례는 설명용 가정입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">반복 측정이 통제한 조건과 못 한 조건이 드러났습니다. 비교 대상을 나누는 원문 원칙도 살펴봅니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">무작위 배정은 참여한 사람들의 개입을 정하는 절차입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">ICH E9의 무작위 배정 설명은 원래 임상시험 설계에 관한 것입니다. 여기서는 그 비교 원리를 전력 장치의 가정 실험에 적용합니다.20가구가 모인 뒤 A와 B에 10가구씩 나눌 때 사전에 정한 무작위 절차를 쓰면 개인의 선택과 담당자의 선호가 배정을 정하지 않게 할 수 있습니다.</p>
          <p className="leading-8">배정은 이미 모인 20가구를 어떻게 나누는지에 관한 절차입니다. 전국에서 누가 이 20가구에 들어오는지를 정하는 표본 추출과 다릅니다. 무작위 배정만으로 전국의 모든 가구를 대표하지는 않습니다.</p>
          <p className="leading-8">작은 집단은 우연히 다를 수 있고 배정 뒤 탈락과 측정 누락도 생깁니다. 누가 빠졌는지와 어떤 결과를 분석할지 미리 정해 기록해야 합니다. 이후 잘 나온 가구만 골라 평균을 다시 내면 처음의 비교 근거가 달라집니다.</p>
        </div>

        <SourceApplication source="ICH · E9 Statistical Principles, §2.3.2 Randomisation" excerpt="Randomisation introduces a deliberate element of chance" application="이미 모집한 20가구를 10가구씩 나눌 때 원하는 사람이 A를 고르게 두는 대신 사전에 정한 무작위 절차를 씁니다. 집단의 차이를 줄일 근거가 되지만 모든 배정에서 완벽히 같은 집단이나 전국 대표성을 보장하지 않습니다." />
        <CitationBlock source="ICH · E9 Statistical Principles, §2.3.2 Randomisation" citeKey={2} href="https://database.ich.org/sites/default/files/E9_Guideline.pdf">임상시험 설계의 무작위 배정 원칙. 여기서는 비교 설계의 아이디어를 전력 실험에 적용하며 의학적 효과를 주장하지 않습니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">배정이 줄이는 문제와 대표성·탈락의 문제를 구분했습니다. 결과를 공개할 때의 주장 범위를 정리합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">효과의 크기·불확실성·적용 범위를 함께 보고합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">현재 사례로 확실히 계산한 것은 두 평균 변화의 차이−1kWh/가구·일입니다. 개별 관측값과 변동성, 표본의 의존 구조가 없으므로 이 차이의 통계적 불확실성을 계산할 수 없습니다. 평균이 다르다는 사실만으로 우연을 배제했다고 말하지 않습니다.</p>
          <p className="leading-8">20가구의 짧은 기간 결과는 공장·다른 계절·다른 요금 체계에서 같을지 별도 확인해야 합니다. 개입 비용과 유지, 행동 변화까지 비교하면 실용적인 선택이 가능합니다. 효과가 조금 있어도 비용을 넘는지는 또 다른 질문입니다.</p>
          <p className="leading-8">
            질문·주요 지표·관측 기간·분석 계획을 먼저 정하고 탈락과 불리한 결과도 함께 공개합니다. 다른 데이터와 연구자가 같은 방법으로 확인할 수 있어야 합니다. 새로운 결과가 다르게
            나오면 대상과 조건의 차이가 이유인지 살펴봅니다.
          </p>
        </div>

        <CitationBlock source="ICH · E8(R1), §5.3 및 §6" citeKey={3} href="https://database.ich.org/sites/default/files/E8-R1_Guideline_Step4_2022_0204%20%281%29.pdf">배정 이후 탈락·측정·분석의 차이도 결과 해석에 영향을 준다는 설계 원칙.</CitationBlock>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">좋은 근거는 강한 단정이 아니라 측정·비교·범위의 조건이 드러나는 설명입니다. 세 질문에 답하며 각각을 확인합니다.</p>
        <ReviewPrompts questions={["A만 계기를 바꿨다면 추가감소 1을 그대로 장치 효과라고 말할 수 있을까요? (답: 8절)", "참가자를 무작위로 두 집단에 배정하면 전국의 모든 집을 대표하게 될까요? (답: 9절)", "표본 평균만 있고 개별 관측값이 없다면 무엇을 아직 계산할 수 없을까요? (답: 10절)"]} />
      </section>
    </div>
  );
}
