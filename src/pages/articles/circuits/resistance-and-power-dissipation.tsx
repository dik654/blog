import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ResistancePowerViz from "./resistance-and-power-dissipation/viz/ResistancePowerViz";

/** Invented 12 V network carried forward from the first circuit article. */
export default function ResistanceAndPowerDissipationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">전원에서 나온 72 mW는 어디서 열이 될까요?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">앞 글의 12 V 회로는 1 kΩ을 지난 뒤 두 개의 2 kΩ 길로 갈라졌습니다. 전원에서 6 mA가 나와 첫 부품에서 36 mW, 두 갈래에서 각각 18 mW가 쓰였습니다. 전원 72 mW와 세 부품의 합이 맞는다는 데서 멈추면, 부품 하나가 뜨거워지는지와 다른 값으로 바꿀 때 무엇이 달라지는지는 아직 알 수 없습니다.</p>
          <p className="leading-7">같은 <strong>가상 회로</strong>에서 오른쪽 2 kΩ을 1 kΩ으로 바꿔 보겠습니다. 전원 전류는 6→7.2 mA로 늘지만, 왼쪽의 그대로인 2 kΩ 전류는 3→2.4 mA로 오히려 줄어듭니다. 첫 부품의 열은 36→51.84 mW가 됩니다. 왜 한쪽 길을 쉽게 만들었는데 다른 쪽 전류는 줄어드는지, 전력 숫자를 실제 부품 정격과 어떻게 비교하는지 따라갑니다.</p>
          <p className="leading-7"><em>이 글의 질문은 저항을 합쳐 계산한 전류가 각 부품의 열과 정격 판단까지 어떻게 이어지는가입니다.</em></p>
        </div>
      </section>

      <section id="one-path" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 길에서는 같은 전류를 나눠 받습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">첫 1 kΩ 뒤에 갈림길이 없다고 상상해 보세요. 1 kΩ 두 개를 연달아 이으면 두 부품에 같은 전류가 흐르고, 전압은 각 부품의 저항에 비례해 나뉩니다. 12 V가 두 1 kΩ에 6 V씩 걸리므로 전류는 6 mA입니다. 전원에서는 두 부품을 2 kΩ 하나로 바꾼 것과 같은 전류가 보입니다. 이것이 <strong>직렬 합성</strong>입니다.</p>
          <p className="leading-7">두 저항이 같은 전류 I를 공유할 때 전압 강하는 IR<sub>1</sub>과 IR<sub>2</sub>입니다. 둘을 더하면 I(R<sub>1</sub>+R<sub>2</sub>)이므로, 전원에서 본 <strong>등가저항</strong>은 두 값을 더한 것입니다. ‘등가’는 전원 단자에서 보이는 전압·전류가 같다는 뜻입니다. 내부 부품의 온도까지 하나의 값이 대신해 주지는 않습니다.</p>
          <p className="leading-7"><em>직렬로 줄인 2 kΩ은 전원 전류를 구해 주지만 어느 저항이 몇 mW를 내는지는 다시 펼쳐야 알 수 있습니다.</em></p>
        </div>
      </section>

      <section id="two-paths" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">두 길에서는 같은 전압을 나눠 흘립니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">원래 회로의 두 2 kΩ은 같은 갈림길과 접지에 닿으므로 각자 6 V를 받습니다. 각각 3 mA가 흘러 합 6 mA입니다. 두 길을 전원 쪽에서 하나로 줄이면 6 V에 6 mA가 흐르는 1 kΩ과 같습니다. 이 <strong>병렬 합성</strong>은 전압이 같고 전류가 더해진다는 사실에서 나옵니다. 1/R<sub>eq</sub>=1/R<sub>2</sub>+1/R<sub>3</sub>라는 역수식은 그 문장을 기호로 적은 것입니다.</p>
          <p className="leading-7">따라서 원래 회로는 첫 1 kΩ과 두 갈래의 등가 1 kΩ이 직렬로 놓인 2 kΩ입니다. 12 V÷2 kΩ=6 mA, 첫 저항의 6 V를 빼면 갈림길도 6 V입니다. 이제 오른쪽을 1 kΩ으로 바꾸면 두 갈래의 등가는 2/3 kΩ, 전체는 5/3 kΩ입니다. 전원에서 7.2 mA가 흐르고 첫 1 kΩ에 7.2 V가 걸리므로 갈림길은 4.8 V입니다. 왼쪽은 4.8 V÷2 kΩ=2.4 mA, 오른쪽은 4.8 V÷1 kΩ=4.8 mA입니다.</p>
          <p className="leading-7"><em>오른쪽 길이 쉬워진 만큼 첫 부품의 전압 강하가 커져, 왼쪽에 남는 전압은 6 V에서 4.8 V로 줄었습니다.</em></p>
        </div>
        <ResistancePowerViz />
        <ExplainedFormula
          question="오른쪽을 1 kΩ으로 바꿨을 때 전원에서 본 저항과 전류는?"
          idea="같은 전압을 받는 두 갈래를 먼저 합친 뒤 첫 1 kΩ을 직렬로 더합니다."
          formula={String.raw`R_{eq}=R_1+\frac{R_2R_3}{R_2+R_3}`}
          annotatedFormula={String.raw`R_{eq}=\underbrace{R_1}_{\text{공통 길}}+\underbrace{\frac{R_2R_3}{R_2+R_3}}_{\text{두 갈래}}`}
          operations={[
            { expression: String.raw`R_{parallel}=\frac{2\times1}{2+1}=\frac23\,\mathrm{k\Omega}`, annotation: "kΩ 단위의 두 갈래를 합칩니다." },
            { expression: String.raw`R_{eq}=\frac53\,\mathrm{k\Omega}`, annotation: "첫 1 kΩ을 더합니다." },
            { expression: String.raw`I_s=7.2\,\mathrm{mA}`, annotation: "12 V를 전체 5/3 kΩ으로 나눕니다." },
          ]}
          terms={[
            { symbol: "R_{eq}", name: "전체 등가저항", description: "전원 단자에서 같은 전압·전류를 보이는 하나의 저항입니다." },
            { symbol: "R_1", name: "첫 저항", description: "갈림길 전에 있는 1 kΩ입니다." },
            { symbol: "R_2,R_3", name: "두 갈래", description: "왼쪽 2 kΩ과 바꾼 오른쪽 1 kΩ입니다." },
          ]}
          assumptions={["도선과 전원 내부 저항을 무시하고 각 저항값이 일정한 직류 정상 상태를 둡니다.", "kΩ 단위로 계산할 때 전류는 mA가 됩니다."]}
          interpretation="전체 전류가 늘어도 왼쪽 전류는 줄 수 있습니다. 전류 분배는 갈림길의 새 전압 4.8 V로 다시 계산해야 합니다."
        />
      </section>

      <section id="heat" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">각 길의 전압과 전류로 열을 다시 셉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">저항에 걸린 전압 V에서 전하 I가 초당 지나가면 V×I만큼 에너지가 매초 열로 바뀝니다. 같은 동작 범위에서 V=IR이므로 P=I²R 또는 V²/R로도 쓸 수 있습니다. 전류가 두 배가 되면 같은 저항의 열은 네 배입니다. 단, 이 식을 사용할 때의 I와 V는 반드시 <strong>그 부품</strong>의 값입니다. 전원 전류 7.2 mA를 왼쪽 갈래의 전류로 넣으면 틀립니다.</p>
          <p className="leading-7">바꾼 회로에서 첫 1 kΩ은 7.2 mA가 지나 51.84 mW, 왼쪽 2 kΩ은 2.4 mA가 지나 11.52 mW, 오른쪽 1 kΩ은 4.8 mA가 지나 23.04 mW입니다. 합 86.4 mW는 전원이 낸 12 V×7.2 mA와 같습니다. 이 검산은 등가저항 5/3 kΩ으로 구한 전체 전력도 86.4 mW인지 확인해 줍니다.</p>
          <p className="leading-7"><em>전체 열은 등가저항으로 구할 수 있지만, 가장 뜨거운 자리는 각 부품을 펼친 뒤 비교해야 합니다.</em></p>
        </div>
        <ExplainedFormula
          question="값을 바꾼 회로에서 첫 1 kΩ은 몇 mW를 냅니까?"
          idea="첫 부품을 통과하는 전체 전류 7.2 mA를 그 부품의 저항에 넣습니다."
          formula={String.raw`P_1=I_s^2R_1`}
          annotatedFormula={String.raw`\underbrace{P_1}_{\text{첫 부품 열}}=I_s^2R_1`}
          operations={[
            { expression: String.raw`P_1=51.84\,\mathrm{mW}`, annotation: "(7.2 mA)²×1 kΩ입니다." },
            { expression: String.raw`P_{sum}=86.4\,\mathrm{mW}`, annotation: "51.84+11.52+23.04 mW로 검산합니다." },
          ]}
          terms={[
            { symbol: "P_1", name: "첫 부품의 소비 전력", description: "열로 내보내야 하는 에너지의 초당 양입니다." },
            { symbol: "I_s", name: "전원 전류", description: "갈림길 전 첫 부품을 지나므로 7.2 mA입니다." },
          ]}
          assumptions={["저항이 일정하고 전력은 시간 평균의 직류 정상 상태 값입니다.", "부품의 온도 상승은 이 전력만으로 결정되지 않고 실장·주변 온도도 필요합니다."]}
          interpretation="오른쪽을 1 kΩ으로 바꾸자 첫 부품의 열은 36에서 51.84 mW로 커졌습니다."
        />
      </section>

      <section id="rating" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 1 kΩ이라도 얼마나 견디는지는 따로 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">계산으로 51.84 mW를 알았다면 실제 부품표의 허용 전력과 비교합니다. 예를 들어 Vishay의 D11/CRCW0603 e3 두꺼운 막 저항은 1 kΩ을 만들 수 있는 저항 범위를 포함합니다. 2026년 4월 개정 데이터시트 2쪽은 이 크기의 <strong>표준 동작</strong>에 70 °C 기준 전력 0.10 W, 확장 동작에 0.125 W를 따로 표시합니다. 본문 회로의 첫 부품 51.84 mW는 표준 0.10 W보다 낮습니다. 그러나 그 사실만으로 어떤 기판·주변 온도에서도 안전하다고 결론낼 수는 없습니다.</p>
          <p className="leading-7">같은 가상 1 kΩ을 갈림길 없이 12 V에 직접 연결하면 12²/1000=0.144 W, 즉 144 mW입니다. 표준 0.10 W를 넘고 확장 0.125 W도 넘습니다. 제품의 전압 한계와 저항 허용차도 따로 확인해야 합니다. 1쪽의 설명은 부품 표면 온도가 허용치를 넘지 않아야 정격 전력을 쓸 수 있고, 온도 상승은 기판을 포함한 열저항에 달렸다고 밝힙니다. 이처럼 저항값 1 kΩ과 전력 정격 0.10 W는 서로 다른 질문에 답합니다.</p>
          <p className="leading-7"><em>첫 부품의 51.84 mW는 이 데이터시트의 표준 정격보다 낮지만, 12 V 직결의 144 mW는 그 정격을 넘습니다.</em></p>
        </div>
        <CitationBlock source="Vishay, D/CRCW e3 Standard Thick Film Chip Resistors, document 20035, revision 14-Apr-2026, 1–2쪽" citeKey={1} href="https://www.vishay.com/docs/20035/dcrcwe3.pdf">
          공식 데이터시트 1쪽의 D11/CRCW0603 e3 저항 범위·전압·열 조건과 2쪽의 표준 0.10 W·확장 0.125 W 구분을 확인했습니다. 12 V 회로와 51.84·144 mW는 제품 시험 결과가 아니라 이 글의 가상 회로 계산값입니다.
        </CitationBlock>
      </section>

      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">값과 열이 바뀌면 처음의 전류도 다시 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">부품의 1 kΩ은 보통 한 온도에서의 공칭값이고 허용차가 있습니다. Vishay 표에는 ±1%와 ±5% 선택지가 있으며, 온도계수도 별도입니다. 저항값이 달라지면 등가저항과 갈림길 전압이 함께 바뀝니다. 열 때문에 값이 다시 달라질 수 있으므로 정밀 회로에서는 공칭값만으로 끝내지 않습니다. 전력 정격을 비교할 때는 부품의 실제 장착 조건과 주변 온도, 허용차를 포함해 가장 불리한 조합을 봅니다.</p>
          <p className="leading-7">지금까지는 시간에 따라 바뀌지 않는 직류 상태였습니다. 전원을 막 연결하면 축전기나 코일에 에너지가 쌓이거나 빠져 전류가 한동안 변합니다. 다음 글에서는 같은 전압·전류 언어로 그 잠깐의 변화를 계산합니다.</p>
          <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 오른쪽 저항을 낮췄는데 왼쪽 전류가 줄어든 이유는 무엇입니까? (답: 3절) 첫 부품의 열을 구할 때 왜 7.2 mA를 씁니까? (답: 4절) 1 kΩ이라는 값만으로 12 V 직결 가능 여부를 정할 수 있습니까? (답: 5절)</p>
          <p className="leading-7"><Link to="/electronics/circuits/lumped-circuit-and-conservation#power">앞 글의 72 mW 전력 검산</Link>으로 돌아가 세 부품의 숫자를 다시 확인해도 좋습니다.</p>
        </div>
      </section>
    </div>
  );
}
