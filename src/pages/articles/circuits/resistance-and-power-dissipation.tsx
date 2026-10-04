import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ResistancePowerViz from "./resistance-and-power-dissipation/viz/ResistancePowerViz";

import NumericPath from "../world-systems/NumericPath";

export default function ResistanceAndPowerDissipationArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 바꾸지 않은 부품이 더 뜨거워질 수 있습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">첫 부품 하나를 지난 뒤 두 길로 갈라지는 회로에서 오른쪽 부품만 바꿉니다. 그러자 첫 부품이 내는 열은 36에서 51.84 mW로 커집니다(가정). 교체한 곳만 살펴서는 이 변화를 놓칩니다. 한쪽 길이 바뀌면 공통으로 지나는 첫 길의 흐름도 바뀌기 때문입니다.</p><p className="leading-7">
            전원에서 본 전체 연결을 먼저 하나로 줄여 흐름을 구하고 그다음 각 길로 다시 펼쳐 열을 셉니다. 마지막에는 실제 제조사 표의 허용값과 대조합니다. 회로 계산에서 부품 선택으로
            넘어갈 때 필요한 순서입니다.
          </p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 세 부품을 상자 하나로 보고 다시 엽니다</h2>
<NumericPath title="전체 흐름을 구한 뒤 부품마다 열을 나눕니다" steps={[{"label": "전원에서 보기", "value": "전체 연결 하나", "detail": "공급할 때 얼마나 흐르는지 구합니다."}, {"label": "각 길로 펼치기", "value": "세 부품의 몫", "detail": "각자 받은 차이와 흐름을 구합니다."}, {"label": "실제 표와 비교", "value": "부품별 허용값", "detail": "온도·장착 조건도 함께 확인합니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">상자로 줄이는 동안에는 입구에서 보이는 관계만 남깁니다. 내부에서 36·18·18 mW가 생기는지, 한 부품에 72 mW가 몰리는지는 이 상자만으로 알 수 없습니다. 그래서 전체 계산을 마친 뒤 반드시 세 부품을 다시 펼칩니다.</p><p className="leading-7">공급하는 양과 쓰는 양의 합이 맞아도 한 부품의 허용값은 넘을 수 있습니다. 합계 검산과 개별 부품 판단이 어느 단계에서 갈라지는지 구체적인 연결로 보겠습니다.</p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 오른쪽의 2를 1로 바꿉니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">숫자는 모두 설명을 위한 <strong>가정</strong>입니다. 공급하는 양끝 차이는 12 V, 첫 부품은 1 kΩ, 뒤의 두 갈래는 2 kΩ씩입니다. 처음에는 첫 길에 6 mA, 두 갈래에 3 mA씩 흐릅니다. 이는 <Link to="/electronics/circuits/lumped-circuit-and-conservation#solve">앞 글에서 계산한 같은 회로</Link>입니다.</p><p className="leading-7">
            연결은 그대로 두고 오른쪽 부품만 1 kΩ으로 바꿉니다. 첫 길은 7.2 mA로 늘고 왼쪽은 2.4 mA로 줄고 오른쪽은 4.8 mA가 됩니다. 각 부품의 열은
            51.84·11.52·23.04 mW입니다. 이 세 숫자를 전체 계산부터 차례로 다시 얻겠습니다.
          </p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 함께 지나는 길과 나눠 지나는 길을 구분합니다</h2>
<NumericPath title="바꾼 회로의 연결" steps={[{"label": "주는 쪽", "value": "12 V", "detail": "전체 연결 양끝에 걸립니다."}, {"label": "공통 길", "value": "첫 1 kΩ", "detail": "갈림길 이전에 모두 지납니다."}, {"label": "두 갈래", "value": "2 kΩ ∥ 1 kΩ", "detail": "두 길의 위·아래 점이 같습니다."}, {"label": "돌아오는 쪽", "value": "기준 0 V", "detail": "두 흐름이 다시 합쳐집니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            첫 부품 뒤의 두 갈래는 같은 두 점을 공유합니다. 따라서 그 두 점 사이 차이는 같고 지나가는 양은 두 갈래를 합칩니다. 첫 부품과 갈림길 전체는 차례로 지나므로 같은 총량이
            통과하고 양끝 차이를 더합니다.
          </p><p className="leading-7">이 두 가지 연결을 구분하면 어떤 값을 더해야 하는지가 보입니다. 다음 절에서는 왜 저항값을 모든 자리에서 그냥 더할 수 없는지 확인합니다.</p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 입구에서 같다는 조건을 먼저 정합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            두 2 kΩ 갈래에 6 V가 걸리면 각각 3 mA, 합해서 6 mA가 흐릅니다. 두 갈래를 1 kΩ 하나로 바꿔도 입구에서 같은 6 V에 같은 6 mA가 흐릅니다. 4 kΩ으로
            더하면 1.5 mA가 되어 원래 연결과 달라집니다.
          </p><p className="leading-7">반대로 갈림길 없는 두 부품은 같은 양이 차례로 지나갑니다. 각 부품에서 생긴 전압 차이를 더해야 전체 차이가 맞습니다. 서로 다른 조건을 같은 덧셈으로 처리하면 회로 모양이 계산에서 사라집니다.</p><p className="leading-7">
            입구에서 같은 관계를 보이는 대체값을 구하겠습니다. 내부의 열을 구할 때는 원래 연결을 다시 펼칩니다. 이제 이 관계들의 이름을 붙입니다.
          </p></div>
</section>

<section id="names" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 역할에 맞춰 직렬·병렬·등가라는 이름을 씁니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">같은 흐름이 차례로 지나는 연결은 <strong>직렬</strong>, 같은 두 점에 갈래들이 붙는 연결은 <strong>병렬</strong>입니다. 입구에서 같은 전압·전류 관계를 보이는 대체값은 <strong>등가저항</strong>입니다. 세 용어 모두 연결과 관측 위치를 먼저 정해야 의미가 있습니다.</p><p className="leading-7">직렬 두 부품은 전압이 더해져 R₁+R₂가 됩니다. 병렬 두 갈래는 전류가 더해져 역수를 합칩니다. 이 차이를 원래 두 2 kΩ 갈래에서 확인한 뒤 바꾼 회로를 계산하겠습니다.</p></div><h3 id="one-path" className="mt-8 text-xl font-semibold">한 길을 하나의 값으로 줄이기</h3><div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">첫 1 kΩ 뒤에 갈림길이 없다고 상상해 보세요. 1 kΩ 두 개를 연달아 이으면 두 부품에 같은 전류가 흐르고, 전압은 각 부품의 저항에 비례해 나뉩니다. 12 V가 두 1 kΩ에 6 V씩 걸리므로 전류는 6 mA입니다. 전원에서는 두 부품을 2 kΩ 하나로 바꾼 것과 같은 전류가 보입니다. 이것이 <strong>직렬 합성</strong>입니다.</p>
          <p className="leading-7">두 저항이 같은 전류 I를 공유할 때 전압 강하는 IR<sub>1</sub>과 IR<sub>2</sub>입니다. 둘을 더하면 I(R<sub>1</sub>+R<sub>2</sub>)이므로, 전원에서 본 <strong>등가저항</strong>은 두 값을 더한 것입니다. ‘등가’는 전원 단자에서 보이는 전압·전류가 같다는 뜻입니다. 내부 부품의 온도까지 하나의 값이 대신해 주지는 않습니다.</p>
          <p className="leading-7"><em>직렬로 줄인 2 kΩ은 전원 전류를 구해 주지만 어느 저항이 몇 mW를 내는지는 다시 펼쳐야 알 수 있습니다.</em></p>
        </div>
</section>

<section id="two-paths" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 두 갈래를 줄이고 다시 펼쳐 7.2·2.4·4.8을 얻습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
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

<section id="heat" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 원문의 전력식에 각 부품의 숫자를 따로 넣습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">MIT 6.002 Lecture 22의 첫 저항 예제에 적힌 식은 <code>P=VI=V²/R</code>입니다. V와 I는 그 저항의 양끝 차이와 통과 전류입니다. <a href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/62cc78db14ad37dede55c361711ba2ae_6002_l22.pdf" target="_blank" rel="noopener noreferrer">공식 강의안의 Example 1</a>에서 두 측정 위치를 함께 볼 수 있습니다. 아래에서는 V=IR을 대입한 I²R도 사용합니다.</p><p className="leading-7">원래 회로는 첫 부품 6 V×6 mA=36 mW, 두 갈래는 각각 6 V×3 mA=18 mW입니다. 합계 72 mW가 전원의 12 V×6 mA와 같습니다. 이제 오른쪽을 바꾼 숫자를 같은 식에 넣겠습니다.</p></div><div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
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

<section id="rating" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 실제 표의 두 허용값을 같은 단위로 비교합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">Vishay 공식 데이터시트 2쪽의 D11/CRCW0603 e3 열은 <code>P70: 0.10 W / 0.125 W</code>로 표준·확장 동작을 구분합니다. 두 값을 mW로 바꾸면 100과 125입니다. 표의 열 제목과 동작 조건까지 읽어야 어떤 값을 적용하는지 결정할 수 있습니다.</p></div><div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">계산으로 51.84 mW를 알았다면 실제 부품표의 허용 전력과 비교합니다. 예를 들어 Vishay의 D11/CRCW0603 e3 두꺼운 막 저항은 1 kΩ을 만들 수 있는 저항 범위를 포함합니다. 2026년 4월 개정 데이터시트 2쪽은 이 크기의 <strong>표준 동작</strong>에 70 °C 기준 전력 0.10 W, 확장 동작에 0.125 W를 따로 표시합니다. 본문 회로의 첫 부품 51.84 mW는 표준 0.10 W보다 낮습니다. 그러나 그 사실만으로 어떤 기판·주변 온도에서도 안전하다고 결론낼 수는 없습니다.</p>
          <p className="leading-7">같은 가상 1 kΩ을 갈림길 없이 12 V에 직접 연결하면 12²/1000=0.144 W, 즉 144 mW입니다. 표준 0.10 W를 넘고 확장 0.125 W도 넘습니다. 제품의 전압 한계와 저항 허용차도 따로 확인해야 합니다. 1쪽의 설명은 부품 표면 온도가 허용치를 넘지 않아야 정격 전력을 쓸 수 있고, 온도 상승은 기판을 포함한 열저항에 달렸다고 밝힙니다. 이처럼 저항값 1 kΩ과 전력 정격 0.10 W는 서로 다른 질문에 답합니다.</p>
          <p className="leading-7"><em>첫 부품의 51.84 mW는 이 데이터시트의 표준 정격보다 낮지만, 12 V 직결의 144 mW는 그 정격을 넘습니다.</em></p>
        </div>
        <CitationBlock source="Vishay, D/CRCW e3 Standard Thick Film Chip Resistors, document 20035, revision 14-Apr-2026, 1–2쪽" citeKey={1} href="https://www.vishay.com/docs/20035/dcrcwe3.pdf">
          공식 데이터시트 1쪽의 D11/CRCW0603 e3 저항 범위·전압·열 조건과 2쪽의 표준 0.10 W·확장 0.125 W 구분을 확인했습니다. 12 V 회로와 51.84·144 mW는 제품 시험 결과가 아니라 이 글의 가상 회로 계산값입니다.
        </CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">표준 0.10 W만 전력식에 넣어 이상적인 1 kΩ의 양끝 차이를 역산하면 √(0.10 W×1000 Ω)=10 V입니다. 이것은 해당 전력 조건으로 구한 계산 경계입니다. 실제 사용 전압을 정할 때는 표의 전압 한계, 주변 온도, 기판의 열 방출 조건도 함께 만족해야 합니다.</p></div>
</section>

<section id="limits" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 허용차와 장착 조건을 바꿔 다시 판단합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            부품의 1 kΩ은 보통 한 온도에서의 공칭값이고 허용차가 있습니다. Vishay 표에는 ±1%와 ±5% 선택지가 있으며 온도계수도 별도입니다. 저항값이 달라지면 등가저항과
            갈림길 전압이 함께 바뀝니다. 열 때문에 값이 다시 달라질 수 있으므로 정밀 회로에서는 공칭값만으로 끝내지 않습니다. 전력 정격을 비교할 때는 부품의 실제 장착 조건과 주변
            온도, 허용차를 포함해 가장 불리한 조합을 봅니다.
          </p>
          <p className="leading-7">지금까지는 시간에 따라 바뀌지 않는 직류 상태였습니다. 전원을 막 연결하면 축전기나 코일에 에너지가 쌓이거나 빠져 전류가 한동안 변합니다. 다음 글에서는 같은 전압·전류 언어로 그 잠깐의 변화를 계산합니다.</p>
          <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 오른쪽 저항을 낮췄는데 왼쪽 전류가 줄어든 이유는 무엇입니까? (답: 7절) 첫 부품의 열을 구할 때 왜 7.2 mA를 씁니까? (답: 8절) 1 kΩ이라는 값만으로 12 V 직결 가능 여부를 정할 수 있습니까? (답: 9절)</p>
          <p className="leading-7"><Link to="/electronics/circuits/lumped-circuit-and-conservation#power">앞 글의 72 mW 전력 검산</Link>으로 돌아가 세 부품의 숫자를 다시 확인해도 좋습니다.</p>
        </div>
</section>
</div>;
}
