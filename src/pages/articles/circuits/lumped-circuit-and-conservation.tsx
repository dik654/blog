import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import CircuitWalkViz from "./lumped-circuit-and-conservation/viz/CircuitWalkViz";

import NumericPath from "../world-systems/NumericPath";
import AlgorithmBlock from "@/components/ui/algorithm-block";

export default function LumpedCircuitAndConservationArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 갈라지는 길의 숫자를 어떻게 함께 정할까요?</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">전기를 공급하는 장치 뒤에 길 하나가 있고, 중간에서 두 길로 갈라집니다. 오른쪽 길을 더 쉽게 통하게 바꾸면 그쪽으로 더 많이 흐를 듯합니다. 그런데 손대지 않은 왼쪽의 흐름도 줄어듭니다. 왼쪽 부품이 그대로인데 왜 숫자가 달라질까요?</p><p className="leading-7">이 글에서는 세 부품을 각각 따로 계산하려는 대신, <strong>갈림길에서 들어온 양과 나간 양을 맞추고, 출발점으로 돌아오는 동안 에너지의 차이도 맞춥니다.</strong> 두 조건으로 세 흐름이 함께 정해지는 과정을 보겠습니다. 마지막에는 공급된 에너지까지 세어 계산을 검산합니다.</p><p className="leading-7">어느 한 길을 바꿨을 때 나머지 길까지 다시 계산해야 하는 이유를 설명하고, 실제 숫자로 그 변화를 예측해 보겠습니다. 먼저 내부를 열지 않고 회로가 하는 일을 한 덩어리로 보겠습니다.</p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 넣는 조건과 얻을 답부터 나눕니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            지금은 연결된 장치 전체를 상자 하나로 둡니다. 우리가 정하는 것은 공급하는 쪽의 세기, 세 부품의 성질, 길이 연결된 모양입니다. 알아낼 것은 첫 길과 두 갈래를 지나는
            양입니다. 같은 부품도 연결을 바꾸면 답이 달라집니다.
          </p><p className="leading-7">
            상자 밖에서 확인할 수 있는 조건은 단순합니다. 들어간 것이 계속 안에 쌓이지 않는다면, 갈라진 두 길로 나간 양을 합쳐 입구와 맞아야 합니다. 이 조건만으로는 두 출구가
            얼마씩 나누는지 정할 수 없습니다. 연결 안쪽을 살펴보겠습니다.
          </p></div><NumericPath title="밖에서 보는 회로의 일" steps={[{"label": "주어진 조건", "value": "공급·부품·연결", "detail": "숫자와 연결을 함께 입력합니다."}, {"label": "연결된 장치", "value": "아직 열지 않은 상자", "detail": "세 흐름이 함께 정해집니다."}, {"label": "확인할 결과", "value": "첫 길·왼쪽·오른쪽", "detail": "입구와 두 출구의 합도 대조합니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">상자 밖에서는 답의 종류와 검산 조건만 정했습니다. 이제 한 가지 작은 연결로 입력을 고정하겠습니다.</p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 12에서 시작하는 세 부품만 놓습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">다음 숫자는 모두 <strong>설명을 위한 가정</strong>입니다. 공급 장치의 양끝 차이는 12 V, 첫 부품의 값은 1 kΩ, 갈라진 두 부품은 각각 2 kΩ입니다. V와 kΩ은 우선 장치에 적힌 단위로 읽어도 됩니다. 뜻과 계산법은 6절에서 붙입니다.</p><p className="leading-7">두 갈래는 위쪽에서 같은 갈림길에, 아래쪽에서 같은 되돌아오는 길에 붙어 있습니다. 아래쪽 점을 비교 기준 0으로 둡니다. 우리가 아직 모르는 것은 위 갈림길의 숫자입니다. 그 값 하나를 정하면 세 부품의 양끝 차이를 모두 알 수 있습니다.</p><p className="leading-7">처음 회로의 답은 첫 길 6 mA, 왼쪽 3 mA, 오른쪽 3 mA입니다. 이 답을 암기하지 않고 어떻게 나왔는지 따라갈 것입니다. 오른쪽만 1 kΩ으로 바꿨을 때 왼쪽이 2.4 mA로 줄어드는 이유까지 같은 그림으로 설명하겠습니다.</p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 갈림길과 되돌아오는 길을 그립니다</h2>
<NumericPath title="한 길이 둘로 갈라졌다가 다시 만납니다" steps={[{"label": "주는 쪽", "value": "아래 0 → 위 12", "detail": "양끝의 차이를 유지합니다."}, {"label": "첫 부품", "value": "12 → 아직 모르는 값", "detail": "모든 흐름이 여기를 지납니다."}, {"label": "두 갈래", "value": "같은 위·아래 점", "detail": "두 부품이 나눠 흐르게 합니다."}, {"label": "되돌아오는 길", "value": "기준 0", "detail": "두 흐름이 다시 합쳐집니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">그림의 세 번째 칸에는 옆으로 나란한 두 길이 들어 있습니다. 두 부품을 차례로 지나는 한 길이라는 뜻이 아닙니다. 어느 갈래를 택하든 위와 아래의 출발점·도착점이 같다는 것이 핵심입니다.</p><p className="leading-7">아래쪽을 0이라 부르는 것은 비교 기준을 고른 것입니다. 모든 점에 같은 수를 더해 적어도 두 점 사이의 차이는 그대로입니다. 계산에 필요한 것은 이 차이이므로, 기준점을 하나 정하면 같은 값을 중복해서 찾지 않아도 됩니다.</p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 갈림길 조건 하나로는 답이 정해지지 않습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">입구의 6이 두 출구로 나뉜다는 사실만 알면 3과 3도, 2와 4도 합은 같습니다. 어떤 분배가 가능한지는 두 출구의 부품 성질을 함께 봐야 합니다. 같은 양끝 차이에서 같은 부품 두 개라면 흐름도 같아야 합니다.</p><p className="leading-7">
            그렇다고 출구만 보고 전체를 정할 수는 없습니다. 첫 부품을 지나는 양이 늘면 거기서 쓰는 차이도 커져 뒤의 갈림길에 남는 차이가 줄어듭니다. 오른쪽을 바꿨는데 왼쪽까지 바뀌는
            연결이 여기 있습니다.
          </p><p className="leading-7">그래서 세 가지를 함께 씁니다. 부품 하나에서 차이와 흐름을 잇는 관계, 갈림길에서 양을 맞추는 조건, 한 바퀴에서 차이를 맞추는 조건입니다. 각각의 역할이 보였으니 이제 실제 측정량의 이름과 단위를 붙일 수 있습니다.</p></div>
</section>

<section id="small-circuit" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 흐름·차이·부품에 이름과 단위를 붙입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            전류는 도선 한 단면을 <strong>1초에 지나간 전하량</strong>입니다.
            0.006 C가 1초에 지나면 0.006 A, 곧 6 mA입니다. 양전하가 움직인다고
            약속한 방향을 화살표로 정합니다. 금속 안의 전자는 반대쪽으로 움직일
            수 있지만, 이 계산에서는 약속한 전류 방향만 일관되게 쓰면 됩니다.
          </p>
          <p className="leading-7">
            전압은 한 점이 혼자 갖는 숫자가 아닙니다. <strong>두 점 사이에서
            전하 1 C가 주고받는 에너지의 차이</strong>입니다. 아래 도선을 기준
            0 V로 택하고 갈림길을 6 V라고 부르면 두 갈래의 위와 아래에는 모두
            6 V가 걸립니다. 두 갈래가 같은 두 점에 닿아 있기 때문입니다. 기준점을
            바꾸면 각 점의 숫자는 바뀌어도 두 점의 차이는 같습니다.
          </p>
          <p className="leading-7">
            저항은 그 차이를 전류로 바꾸는 부품 모델입니다. 같은 온도와 동작
            범위에서 전압을 두 배로 하면 전류도 두 배로 되는 선형 저항을 둡니다.
            2 kΩ에 6 V가 걸리면 6 V를 2000 Ω으로 나눈 0.003 A, 곧 3 mA가
            흐릅니다. 다이오드나 뜨거워지며 값이 달라지는 저항에는 일정한 값
            하나로 이 계산을 그대로 적용할 수 없습니다.
          </p>
        </div>
        <ExplainedFormula
          question="한 부품에 걸린 전압을 알면 전류는 얼마입니까?"
          idea="선형 저항에서는 전압과 전류의 비가 일정하다고 가정합니다."
          formula={String.raw`I=\frac{V}{R}=\frac{6\,\mathrm V}{2{,}000\,\Omega}=3\,\mathrm{mA}`}
          annotatedFormula={String.raw`I=\underbrace{\frac{V}{R}}_{\text{전압에서 전류로}}`}
          operations={[{ expression: String.raw`\frac{V}{R}`, annotation: "전압을 저항으로 나누어 해당 갈래의 흐름을 구합니다." }]}
          terms={[
            { symbol: "I", name: "전류", description: "정한 방향으로 초당 지나가는 전하량. 단위는 A입니다." },
            { symbol: "V", name: "전압", description: "부품 양끝의 전위차. 단위는 V=J/C입니다." },
            { symbol: "R", name: "저항", description: "이 동작 범위에서 일정하다고 둔 비례값. 단위는 Ω=V/A입니다." },
          ]}
          assumptions={["도선과 전원은 이상적입니다.", "저항값이 온도와 전류에 따라 바뀌지 않는 범위입니다."]}
          interpretation="같은 두 점에 닿은 두 2 kΩ 갈래에는 각각 3 mA가 흐릅니다."
        />
        <CitationBlock
          source="MIT OpenCourseWare 6.002, Lecture 1 (Fall 2000 자료, Spring 2007 공개 강좌)"
          citeKey={1}
          href="https://live.ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/f6ad70417c73f585b7ca065153d25d25_6002_l1.pdf"
        >
          강의안은 공간에 퍼진 전자기 현상을 부품의 전압과 전류로 줄이는 집중 회로
          가정부터 시작해, 전하 보존과 패러데이 법칙에서 두 회로 조건이 나오는
          범위를 설명합니다. 이 글의 12 V 수치는 강의안의 실험값이 아닙니다.
        </CitationBlock>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">두 갈래에는 같은 6 V가 걸리지만 전류는 각 저항값으로 따로 정해집니다.</p>
</section>

<section id="solve" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 갈림길 하나를 구해 세 흐름을 끝까지 따라갑니다</h2>
<CircuitWalkViz /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            6절에서는 갈림길이 6 V일 때 한 부품의 전류를 확인했습니다. 이번에는 모르는
            값으로 두고 직접 구해 봅니다. 갈림길 전압을 V라고 하면 첫 저항에는
            12−V 볼트가 걸립니다. 두 갈래에는 각각 V 볼트가 걸립니다. 각
            저항에서 전압을 저항으로 나누어 전류를 만든 다음, 들어온 전류와
            나간 전류를 맞춥니다.
          </p>
        </div>
        <ExplainedFormula
          question="갈림길 전압 V를 아직 모를 때 어떻게 구합니까?"
          idea="각 전류를 전압과 저항으로 바꾸고, 갈림길의 유입과 유출을 같게 둡니다."
          formula={String.raw`\frac{12-V}{1{,}000}=\frac{V}{2{,}000}+\frac{V}{2{,}000}\quad\Rightarrow\quad V=6\,\mathrm V`}
          annotatedFormula={String.raw`\frac{12-V}{1{,}000}=\frac{2V}{2{,}000}`}
          operations={[
            { expression: String.raw`\frac{12-V}{1{,}000}`, annotation: "전원에서 갈림길까지 1 kΩ을 지나는 전류입니다." },
            { expression: String.raw`\frac{V}{2{,}000}+\frac{V}{2{,}000}`, annotation: "같은 전압 V를 마주한 두 출구의 전류를 합칩니다." },
          ]}
          terms={[
            { symbol: "V", name: "갈림길 전압", description: "아래 도선을 0 V로 택했을 때의 전압입니다." },
            { symbol: "12-V", name: "첫 저항의 전압", description: "전원의 12 V에서 갈림길에 남은 전압을 뺍니다." },
          ]}
          assumptions={["세 저항은 선형이고 값이 일정합니다.", "갈림길에 따로 축적되는 전하가 없습니다."]}
          interpretation="V=6 V이므로 첫 저항에는 6 mA, 두 갈래에는 각각 3 mA가 흐릅니다."
        />
        <div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            그림에서 오른쪽 2 kΩ을 1 kΩ으로 바꿔 보세요. 같은 식의 오른쪽
            마지막 분모만 1000으로 바뀝니다. 그러면 갈림길은 4.8 V, 첫 저항
            전류는 7.2 mA, 두 출구는 2.4 mA와 4.8 mA입니다. 왼쪽 부품을
            건드리지 않았어도 그 전류가 바뀝니다. 갈림길 전압을 회로 전체가
            함께 결정하기 때문입니다.
          </p>
          <p className="leading-7">
            여기서 멈춰 직접 풀어 보세요. <strong>왜 오른쪽 저항을 줄였는데
            왼쪽 전류까지 줄어들었을까요?</strong> 갈림길 전압을 구한 뒤 왼쪽
            2 kΩ에 다시 적용하면 답이 나옵니다.
          </p>
          <p className="leading-7"><em>한 갈래의 저항을 바꾸자 갈림길 전압도 움직였고, 다른 갈래의 전류까지 바뀌었습니다.</em></p>
        </div><AlgorithmBlock title="갈림길 전압 계산 (의사코드)" input={["전원 Vs=12 V, 첫 저항 Rs=1000 Ω", "갈래 R1=R2=2000 Ω; 아래 기준점 0 V"]} steps={[
{code:"g = 1/Rs + 1/R1 + 1/R2",note:"전압 V에 곱해지는 세 계수를 모읍니다. 이 예에서는 0.002 A/V입니다."},
{code:"V = (Vs/Rs) / g",note:"0.012 A를 0.002 A/V로 나누어 6 V를 얻습니다."},
{code:"Is=(Vs-V)/Rs; I1=V/R1; I2=V/R2",note:"6 mA, 3 mA, 3 mA를 같은 V로 계산합니다."},
{code:"check Is-I1-I2",note:"0 mA인지 확인합니다. 반올림한 값은 작은 잔차가 남을 수 있습니다."}
]} output="갈림길 6 V, 전류 6·3·3 mA. R2만 1000 Ω으로 바꾸면 4.8 V, 7.2·2.4·4.8 mA." />
</section>

<section id="junction" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 원문의 전하 보존 조건에 6·3·3을 넣습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            첫 저항에서 6 mA가 들어온다면, 갈림길에 전하가 계속 쌓이지 않는
            동안 두 출구의 전류를 합친 값도 6 mA여야 합니다. 각 갈래에 3 mA가
            흐르므로 6−3−3=0 mA입니다. 이 갈림길 조건을 키르히호프의 전류
            법칙이라고 부릅니다.
          </p>
          <p className="leading-7">
            전류가 갈라진다는 말은 전자 하나가 둘로 쪼개진다는 뜻이 아닙니다.
            일정 시간 동안 경계 안으로 들어온 전하의 총량이 두 출구로 나간
            총량과 같다는 뜻입니다. 1초에 0.006 C가 들어오면 각 출구로 0.003 C씩
            나가는 식입니다.
          </p>
        </div>
        <ExplainedFormula
          question="한 점으로 들어온 전류와 나간 전류는 어떻게 연결됩니까?"
          idea="갈림길 주변에 작은 경계를 그리고, 그 안에 전하가 쌓이지 않는 상태를 셉니다."
          formula={String.raw`I_{\mathrm{in}}-I_1-I_2=0\quad\Rightarrow\quad 6-3-3=0\;\mathrm{mA}`}
          annotatedFormula={String.raw`\underbrace{I_{\mathrm{in}}-I_1-I_2}_{\text{갈림길 순유입}}=0`}
          operations={[{ expression: String.raw`I_{\mathrm{in}}-I_1-I_2`, annotation: "들어온 흐름은 양수, 나간 흐름은 음수로 세어 경계의 순유입을 구합니다." }]}
          terms={[
            { symbol: String.raw`I_{\mathrm{in}}`, name: "들어오는 전류", description: "첫 1 kΩ 저항을 지나 갈림길로 들어옵니다." },
            { symbol: "I_1,I_2", name: "나가는 전류", description: "두 갈래의 저항을 각각 지납니다." },
          ]}
          assumptions={["갈림길에 따로 모델링하지 않은 전하 축적이 없습니다.", "모든 갈래를 빠짐없이 경계에 포함합니다."]}
          interpretation="두 출구 중 하나가 3 mA라면 나머지도 3 mA여야 합니다."
        />
        <div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            Kirchhoff가 1845년에 다룬 대상은 이 세 저항이 아닙니다. 정상 상태의
            얇은 금속판에서 닫힌 곡선을 그린 뒤, 곡선 안에 전류를 따로 넣지
            않으면 경계로 드나드는 흐름의 합이 0이라고 적었습니다. 금속판의
            연속적인 흐름을 여기서는 갈림길의 세 도선으로 줄여 같은 보존
            조건을 씁니다.
          </p>
          <p className="leading-7"><em>갈림길을 떠날 때는 6 mA가 3 mA씩 나뉩니다. 이제 한 바퀴의 전압도 맞춰 보겠습니다.</em></p>
        </div>
        <CitationBlock
          source="G. Kirchhoff, ‘Ueber den Durchgang eines elektrischen Stromes durch eine Ebene, insbesondere durch eine kreisförmige,’ Annalen der Physik und Chemie 64 (1845), 497–514, 특히 499쪽"
          citeKey={2}
          href="https://zenodo.org/records/2422851"
        >
          원문 499쪽은 닫힌 곡선 전체에 대해 <span className="font-mono">∫ ds · du/dN = 0</span>을 적습니다.
          u는 금속판의 전위, N은 경계의 수직 방향, ds는 경계의 작은 길이입니다.
          12 V 저항망에는 금속판의 공간 좌표나 전도율을 주지 않았으므로 이
          적분식에 숫자를 직접 대입할 수 없습니다. 경계의 순유입이 0이라는
          원문의 보존 조건을 세 도선의 6−3−3=0 mA로 옮겼습니다.
        </CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">MIT 6.002 강의안 23쪽의 원문은 “The sum of the currents into a node is 0.”입니다. 여기서 into를 부호에 반영하면 들어오는 6 mA는 양수, 나가는 두 3 mA는 음수입니다. 원문 문장이 이 회로에서 6−3−3=0으로 바뀌는 지점입니다. <a href="https://live.ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/f6ad70417c73f585b7ca065153d25d25_6002_l1.pdf#page=23" target="_blank" rel="noopener noreferrer">강의안 23쪽</a>에서 부호가 붙은 합을 대조할 수 있습니다.</p></div>
</section>

<section id="loop" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 원문의 한 바퀴 조건에 12·6·6을 넣습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            아래 기준점에서 전원을 지나면 12 V 올라갑니다. 첫 저항을 지날 때
            6 V 내려가 갈림길은 6 V입니다. 왼쪽 갈래의 2 kΩ 저항을 지나면 다시
            6 V 내려가 기준점으로 돌아옵니다. 오른쪽으로 돌아도 같습니다.
            출발한 바로 그 점으로 돌아왔는데 전압 차이가 남을 수는 없습니다.
          </p>
          <p className="leading-7">
            이렇게 경로를 한 바퀴 따라가며 전압의 오르내림을 더한 값을 0으로
            두는 것이 키르히호프의 전압 법칙입니다. 단, 회로 바깥에서 시간에
            따라 변하는 자기 선속이 이 고리를 관통한다면 유도 효과를 빼놓고
            단순히 0이라고 놓을 수 없습니다. 여기서는 그 효과가 무시할 만큼
            작다고 가정합니다.
          </p>
        </div>
        <ExplainedFormula
          question="전원이 준 12 V는 어디로 갔습니까?"
          idea="정한 방향으로 고리를 따라가며 상승은 양수, 하강은 음수로 셉니다."
          formula={String.raw`+V_s-V_{R_s}-V_{R_1}=12-6-6=0\;\mathrm V`}
          annotatedFormula={String.raw`+V_s-(V_{R_s}+V_{R_1})=0`}
          operations={[{ expression: String.raw`+V_s-V_{R_s}-V_{R_1}`, annotation: "전원의 전압 상승에서 직렬 저항과 선택한 갈래의 전압강하를 뺍니다." }]}
          terms={[
            { symbol: "V_s", name: "전원", description: "기준점에서 올라가며 얻는 12 V입니다." },
            { symbol: "V_{R_s}", name: "첫 저항", description: "갈림길까지 가는 동안 내려가는 6 V입니다." },
            { symbol: "V_{R_1}", name: "선택한 갈래", description: "갈림길에서 기준점까지 내려가는 6 V입니다." },
          ]}
          assumptions={["고리 방향과 각 전압의 측정 방향을 고정합니다.", "회로 모델 밖의 시간에 따른 자기 선속 변화가 무시 가능합니다."]}
          interpretation="한 바퀴의 합이 0이면 같은 기준점에 일관된 전압을 붙일 수 있습니다."
        />
        <p className="mt-5 text-sm leading-6 text-muted-foreground">한 바퀴를 돌면 얻은 12 V와 두 번 잃은 6 V가 서로 지워집니다.</p><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">같은 강의안 21쪽은 “The sum of the voltages in a loop is 0.”이라고 씁니다. 이 문장의 loop에 아래 기준점→전원→첫 저항→왼쪽 저항→기준점 경로를 넣으면 +12−6−6=0 V입니다. 오른쪽으로 돌아도 같은 0이어야 합니다. 두 경로가 다른 답을 낸다면 부호나 빠뜨린 유도 효과부터 확인합니다. <a href="https://live.ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/f6ad70417c73f585b7ca065153d25d25_6002_l1.pdf#page=21" target="_blank" rel="noopener noreferrer">강의안 21쪽</a>의 식은 이 경로 검산의 원문입니다.</p></div>
</section>

<section id="power" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 에너지의 합으로 별도 검산합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">MIT 6.002 Lecture 2의 9쪽은 전류가 전압의 양의 단자로 들어가는 방향을 택한 뒤 <code>power consumed by element e = vi</code>라고 적습니다. 같은 방향으로 읽은 저항의 v·i는 소비 전력이 양수입니다. 전원은 에너지를 내보내므로 소비 전력 규칙으로 세면 음수가 됩니다. <a href="https://live.ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/99b2a662083d1b1f487c55ea0f0d0220_6002_l2.pdf#page=9" target="_blank" rel="noopener noreferrer">원문 9쪽의 방향 약속</a>을 먼저 정하고, 아래에서는 공급량과 소비량을 각각 양수의 크기로 비교하겠습니다.</p></div>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            전압은 전하 1 C당 에너지이고 전류는 1초당 전하입니다. 둘을 곱하면
            1초당 에너지, 곧 전력입니다. 처음의 두 2 kΩ 갈래를 기준으로 전원은
            12 V에서 6 mA를 내보내므로 72 mW를 공급합니다. 첫 저항은
            6 V×6 mA=36 mW, 두 갈래는 각각 6 V×3 mA=18 mW를 씁니다.
          </p>
          <p className="leading-7">
            36+18+18=72 mW가 맞습니다. 이 검산은 세 저항의 전류 방향이나 전압을 잘못 계산했는지 잡아 줍니다. 축전기나 코일이 있는 회로에서는 순간적으로 저장 에너지가 늘거나
            줄 수도 있으므로 공급과 소모만 비교하면 검산이 어긋납니다. 저장량의 변화도 세어야 합니다.
          </p>
        </div>
        <ExplainedFormula
          question="전원이 준 에너지가 회로 안에서 모두 설명됩니까?"
          idea="각 부품의 전압과 그 부품을 통과하는 전류를 곱해 초당 에너지로 바꿉니다."
          formula={String.raw`P_s=V_sI_s=72\,\mathrm{mW}=36+18+18\,\mathrm{mW}`}
          annotatedFormula={String.raw`P_s=36+18+18=72\,\mathrm{mW}`}
          operations={[{ expression: String.raw`V_sI_s`, annotation: "전하 한 단위당 에너지에 초당 전하량을 곱해 초당 에너지를 구합니다." }]}
          terms={[
            { symbol: "P_s", name: "공급 전력", description: "12 V 전원이 6 mA를 내보내며 공급하는 72 mW입니다." },
            { symbol: String.raw`\mathrm{mW}`, name: "밀리와트", description: "1 mW는 0.001 J/s입니다." },
          ]}
          assumptions={["전원과 세 저항을 빠짐없이 셉니다.", "저장 소자가 없는 정상 상태입니다."]}
          interpretation="전원의 72 mW와 세 저항의 72 mW가 일치합니다."
        />
        <p className="mt-5 text-sm leading-6 text-muted-foreground">전원에서 나온 전력과 저항에서 쓴 전력이 맞으므로 앞의 전압·전류 계산도 한 번 더 확인됐습니다.</p>
</section>

<section id="limits" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 점과 선으로 줄일 수 없는 순간을 구분합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            실제 전압과 전류는 공간에 퍼진 전기장과 자기장의 결과입니다. 이
            글은 그 현상을 점의 전압, 선의 전류, 부품 양끝의 관계로 줄였습니다.
            이것을 <strong>집중 회로 근사</strong>라고 합니다. 부품과 배선에서
            일어나는 전파 지연이 관심 시간에 비해 작고, 회로 밖 유도 효과나
            빠뜨린 전하 축적도 작을 때 이 그림이 잘 맞습니다.
          </p>
          <p className="leading-7">
            길게 뻗은 전송선에 빠른 신호를 보내면 선의 한쪽과 다른 쪽이 같은
            순간에 같은 상태가 아닙니다. 그때 선을 저항 없는 한 줄로 접으면
            전파 시간을 잃습니다. 고리를 관통하는 자기 선속이 빠르게 바뀌면
            유도 전압을 별도 부품이나 식에 넣어야 합니다. 축전기에 전하가
            쌓이는 순간에는 그 갈래의 전류를 빠뜨린 채 나머지 둘만 더해서
            0이라고 할 수 없습니다.
          </p>
          <p className="leading-7">
            이럴 때는 무엇을 경계 안의 요소로 넣었는지, 어떤 공간 효과를
            버렸는지부터 확인합니다. MIT 6.002 강의안도 집중 회로 모델의 조건으로 부품 안의
            전하 축적과 회로 밖의 시간에 따른 자기 선속 변화를 명시합니다.
          </p>
          <p className="leading-7"><em>빠른 변화나 긴 배선처럼 공간 효과가 커지면 이 점과 선의 회로 그림을 다시 펼쳐야 합니다.</em></p>
        </div>
</section>

<section id="handoff" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">12. 하나를 바꾼 결과를 먼저 예측해 봅니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            한 갈래의 저항을 바꾸면 다른 갈래의 전류도 바뀝니다. 이 글은 바뀐
            뒤의 안정된 숫자와 전력의 합을 구했습니다. 다음 글에서는
            <Link to="/electronics/circuits/resistance-and-power-dissipation#rating">각 부품의 열과 실제 저항의 전력 정격</Link>을
            비교합니다. 그다음에 축전기를 넣어 바뀌는 동안의 전압과 전류를
            시간에 따라 따라갈 차례입니다.
          </p>
          <ol className="space-y-2 leading-7">
            <li>6 mA가 갈림길로 들어와 한쪽으로 3 mA가 나갈 때 나머지 쪽은 몇 mA일까요? (답: 8절)</li>
            <li>오른쪽 저항을 1 kΩ으로 낮추면 왼쪽 전류가 왜 줄어들까요? (답: 7절)</li>
            <li>유도 전압이 있는 고리를 계산할 때 회로 모델에 무엇을 더해야 할까요? (답: 11절)</li>
          </ol>
        </div>
</section>
</div>;
}
