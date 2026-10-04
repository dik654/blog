import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import JunctionBiasViz from "./pn-junction-and-rectification/viz/JunctionBiasViz";

import NumericPath from "../world-systems/NumericPath";

export default function PnJunctionAndRectificationArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 방향을 바꾸면 흐르는 양이 왜 달라질까요?</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">두 영역을 이은 작은 소자에 0.5 V를 걸면 약 0.251 mA가 흐릅니다. 방향을 거꾸로 해 −0.5 V를 걸면 약 −1 pA만 흐릅니다(가정). 앞 글의 저항처럼 전압의 부호만 바뀌고 크기는 같아지는 결과가 아닙니다. 두 영역이 만나는 경계 안에서 무엇이 달라지는지 봐야 합니다.</p><p className="leading-7">
            먼저 전하가 많은 곳에서 적은 곳으로 퍼지는 장면을 보겠습니다. 전하가 이동한 뒤 경계에 남은 전하를 보겠습니다. 그 전하는 처음 이동에 맞서는 전기장을 만듭니다. 바깥 전압이
            이 장벽을 높이거나 낮추는 과정을 알면 한 소자의 큰 방향 차이를 같은 그림으로 설명할 수 있습니다.
          </p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 양끝 전압을 바꾸고 단자 전류를 읽습니다</h2>
<NumericPath title="상자 밖에서 비교할 조건" steps={[{"label": "정하는 것", "value": "전압·온도", "detail": "같은 소자에서 방향과 크기를 바꿉니다."}, {"label": "두 영역의 경계", "value": "아직 열지 않은 내부", "detail": "전압 방향에 따라 흐름이 달라집니다."}, {"label": "읽는 것", "value": "단자 전류", "detail": "양수 방향을 정하고 크기를 비교합니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            전류를 정하는 조건은 양끝 전압 외에도 있습니다. 온도와 소자의 구조도 전류를 바꿉니다. 이번에는 같은 온도와 같은 소자를 유지해 전압의 영향만 보겠습니다.
          </p><p className="leading-7">전류의 양수 방향은 정공이 많은 쪽에서 전자가 많은 쪽으로 정합니다. 음수는 반대 방향입니다. 같은 비교 기준으로 +0.5 V, +0.6 V, −0.5 V를 차례로 넣겠습니다.</p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 300 K의 한 소자에서 세 전압만 바꿉니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">수치는 모두 <strong>가정</strong>입니다. 온도는 300 K이고, 정공이 많은 왼쪽 영역과 전자가 많은 오른쪽 영역의 도핑 농도는 각각 10¹⁶ cm⁻³입니다. 역방향의 작은 전류를 정하는 기준값은 별도로 1 pA라고 둡니다. 농도만으로 이 기준값을 계산한 것은 아닙니다.</p><p className="leading-7">왼쪽을 오른쪽보다 0.5 V 높이면 약 0.251 mA, 0.6 V 높이면 약 12.03 mA입니다. 왼쪽을 0.5 V 낮추면 약 −1 pA입니다. 전압을 주지 않은 열평형 상태에서는 단자 순전류가 0입니다.</p><p className="leading-7">
            0.1 V를 더한 것만으로 전류가 약 48배가 되는 이유와 내부에 전기장이 생겨도 바깥에서 전력을 꺼낼 수 없는 이유를 이 한 소자에서 확인하겠습니다.
          </p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 퍼지는 전하와 제자리에 남는 전하를 나눕니다</h2>
<NumericPath title="붙인 뒤 생기는 경계의 변화" steps={[{"label": "붙이기 전", "value": "왼쪽 정공 · 오른쪽 전자", "detail": "각 영역에서 많은 이동 전하가 다릅니다."}, {"label": "서로 건너기", "value": "전자 ← · 정공 →", "detail": "농도가 높은 쪽에서 낮은 쪽으로 퍼집니다."}, {"label": "경계에 남기", "value": "왼쪽 − · 오른쪽 +", "detail": "원자 자리에 고정된 전하가 드러납니다."}, {"label": "이동을 되돌리기", "value": "오른쪽 → 왼쪽 전기장", "detail": "처음 퍼지는 흐름에 맞서는 효과가 생깁니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">전자와 정공이 만날 때 없어지는 것은 이동 가능한 전자·정공 쌍입니다. 전체 전하가 사라지는 것은 아닙니다. 결정 속에 고정된 이온은 함께 건너가지 않으므로 경계 양쪽의 전하 분포가 바뀝니다.</p><p className="leading-7">
            오른쪽의 양전하와 왼쪽의 음전하가 만드는 전기장은 정공을 왼쪽으로, 전자를 오른쪽으로 움직이게 합니다. 앞서 농도 차이 때문에 퍼지던 방향과 반대입니다. 두 움직임이 어떻게
            맞서는지 보면 평형을 설명할 수 있습니다.
          </p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 한쪽으로 퍼지는 설명만으로는 평형이 나오지 않습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">농도 차이로 퍼지는 흐름만 세면 전하는 계속 건너가기만 합니다. 그러나 건너간 결과로 남은 고정 전하가 전기장을 만들고 반대 흐름도 생깁니다. 두 효과가 맞는 곳에서 바깥 단자의 순전류가 0이 됩니다.</p><p className="leading-7">따라서 순전류 0을 내부 전기장 0과 같은 뜻으로 읽을 수 없습니다. 내부의 두 흐름이 상쇄될 수 있기 때문입니다. 접합의 장벽만 따로 떼어 작은 전지처럼 쓰려 해도 접촉 부분까지 포함한 열평형 회로에는 지속적인 전류가 생기지 않습니다.</p><p className="leading-7">이제 두 흐름과 경계에 이름을 붙이겠습니다. 그 뒤 바깥 전압을 걸어 이 균형을 바꾸는 장면으로 넘어갑니다.</p></div>
</section>

<section id="diffusion" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 퍼짐·빈 경계·내부 전위차에 이름을 붙입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            두 영역을 붙이기 전에는 왼쪽에 정공, 오른쪽에 전자가 훨씬 많다고 둡니다. 앞 글의 가정인 각 영역 10¹⁶ cm⁻³ 도핑과 300 K의 평형 농도를 다시 씁니다. 오른쪽
            전자는 왼쪽으로, 왼쪽 정공은 오른쪽으로 퍼집니다. 사람이 붐비는 공간에서 빈 공간 쪽으로 이동하는 것과 비슷하지만 여기서는 전하를 띤 입자의 농도 차이입니다.
          </p>
          <p className="leading-7">
            이 움직임을 <strong>확산</strong>이라고 부릅니다. 경계로 건너간
            전자와 정공은 서로 만나 사라질 수 있습니다. 그 결과 경계 근처에는
            움직이는 전하가 벌크보다 적어집니다. 앞 글에서 도핑한 영역이
            거의 중성이라고 한 것은 접합에서 멀리 떨어진 자리의 말이었습니다.
            경계에서도 늘 중성이라고 놓으면 다음에 생길 전기장을 설명할 수 없습니다.
          </p>
          <p className="leading-7"><em>처음에는 전자가 n형에서 p형으로, 정공은 p형에서 n형으로 퍼집니다.</em></p>
        </div><h3 id="depletion" className="mt-8 text-xl font-semibold">이동 전하가 줄어든 경계와 그 장벽</h3><div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            오른쪽에서 전자가 빠져나가면 그 자리에 움직이지 못하는 양전하
            도너 이온이 남습니다. 왼쪽에서 정공이 빠져나가면 음전하 억셉터
            이온이 남습니다. 두 고정 전하가 마주 보는 좁은 영역에는 전기장이
            생깁니다. 전기장의 방향은 양전하가 남은 오른쪽에서 음전하가 남은
            왼쪽입니다.
          </p>
          <p className="leading-7">
            이처럼 움직이는 전하가 줄고 고정 이온이 남은 자리를
            <strong>공핍 영역</strong>이라고 부릅니다. 이 영역의 전기장은 더
            많은 전자와 정공이 확산으로 넘어가는 데 맞서므로, 붙인 순간의
            이동이 무한히 계속되지 않습니다. 농도 차이가 밀어내는 흐름과
            전기장이 되돌리는 흐름이 열평형에서 서로 맞습니다. 이때 두
            방향의 미시적인 움직임은 있어도 바깥 단자로 나오는 순전류는 0입니다.
          </p>
          <p className="leading-7">
            경계의 전위 차이를 <strong>내장 전위</strong>라고 합니다. 접합
            안에 전위 차이가 있다는 사실만으로 외부 저항에서 전력을 꺼낼
            수는 없습니다. 닫힌 열평형 회로에서는 접촉 부분까지 포함한
            전기화학적 균형이 맞아 순환 전류가 생기지 않습니다. 전류를
            얻으려면 바깥에서 전압을 걸거나 빛처럼 에너지를 공급해야 합니다.
          </p>
          <p className="leading-7"><em>경계에 남은 고정 이온의 전기장이 확산을 막아, 접합은 스스로 평형을 이룹니다.</em></p>
        </div>
</section>

<section id="bias" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 같은 경계에 +0.5·+0.6·−0.5 V를 차례로 겁니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            정공이 많은 왼쪽 단자를 전원에서 더 높은 전위에 놓으면, 바깥
            전기장이 앞서 생긴 장벽을 낮춥니다. 더 많은 전자와 정공이 경계를
            넘어 반대편으로 들어가고, 그곳에서는 각각 소수 캐리어가 됩니다.
            이 방향을 <strong>순방향 바이어스</strong>라고 부릅니다.
          </p>
          <p className="leading-7">
            전원을 반대로 걸면 장벽과 공핍 영역은 커집니다. 다수 캐리어가
            건너기 어려워집니다. 이 방향은 <strong>역방향 바이어스</strong>
            입니다. 역방향 전류가 반드시 0이라는 뜻은 아닙니다. 열로 생긴
            소수 캐리어도 움직이며, 큰 역전압에서는 항복도 일어날 수 있습니다.
            그래서 앞의 가상 예에서 역방향 전류를 0이 아닌 거의 −1 pA로
            적었습니다.
          </p>
          <p className="leading-7"><em>왼쪽 단자를 높이면 장벽이 낮아지고, 낮추면 장벽이 높아집니다. 전류의 차이를 이제 식으로 세겠습니다.</em></p>
        </div>
        <JunctionBiasViz /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">0 V 열평형에서 출발해 왼쪽을 +0.5 V로 높이면 장벽이 낮아져 약 0.251 mA가 흐릅니다. +0.6 V로 더 높이면 건너가는 전하가 크게 늘어 약 12.03 mA가 됩니다. 반대로 −0.5 V에서는 장벽이 높아지고 작은 반대 전류 약 −1 pA가 남습니다. 이 수치는 다음 절의 이상식을 같은 조건에 적용한 결과입니다.</p><p className="leading-7">전압을 바꾼 뒤 안정된 전류를 비교하고 있습니다. 바꾸는 순간 경계의 전하를 충전하는 시간 변화와 실제 소자의 항복은 아직 이 세 숫자에 넣지 않았습니다.</p></div>
</section>

<section id="calculation" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 원문의 두 전류 성분을 합쳐 같은 사례에 넣습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            이제 첫 사례의 0.5 V와 0.6 V로 돌아갑니다. 300 K에서 전하량으로 나눈 열에너지 kT/q는 약 25.85 mV입니다. 이 숫자를 전압의 비교 눈금으로 씁니다. 가상
            접합의 역방향 기준 전류는 1 pA라고 가정합니다. 농도 10¹⁶ cm⁻³ 하나만으로 1 pA를 유도한 것은 아닙니다. 면적, 확산 길이, 소수 캐리어 수명 같은 소자 조건이
            더 필요합니다.
          </p>
          <p className="leading-7">
            Shockley의 1949년 원문 461쪽 식 (4.22)는 두 캐리어의 역방향 포화 성분을 더하고 그 합에 지수 항을 곱합니다. 원문의 단위 면적 기준을 전체 전류로 옮길
            때는 접합 면적도 곱합니다. 당시 원문은 접합의 전류 성분을 분석한 것이며 아래의 현대식 기호와 실리콘 가상 수치는 교육용으로 다시 적은 것입니다.
          </p>
        </div>
        <ExplainedFormula
          question="전압을 0.5 V에서 0.6 V로 올리면 이상 접합의 전류는 얼마가 됩니까?"
          idea="열전압 25.85 mV마다 지수의 입력이 1씩 늘어납니다. 포화 전류를 곱한 뒤 역방향 기준 항을 뺍니다."
          formula={String.raw`I=I_s\left(e^{V/V_T}-1\right),\qquad V_T=\frac{kT}{q}`}
          annotatedFormula={String.raw`\underbrace{I}_{\text{접합 전류}}=\underbrace{I_s}_{\text{포화 전류}}\left(e^{\overbrace{V/V_T}^{\text{전압÷열전압}}}-1\right)`}
          operations={[
            { expression: String.raw`0.5/0.02585\approx19.34`, annotation: "0.5 V를 열전압으로 나눈 지수의 입력입니다." },
            { expression: String.raw`I(0.5\,\mathrm V)\approx0.251\,\mathrm{mA}`, annotation: "지수식에 가정한 1 pA를 곱하고 1을 뺍니다." },
            { expression: String.raw`0.6/0.02585\approx23.21`, annotation: "0.1 V 증가가 지수 입력을 약 3.87 키웁니다." },
            { expression: String.raw`I(0.6\,\mathrm V)\approx12.03\,\mathrm{mA}`, annotation: "같은 가정에서 전류는 약 47.9배가 됩니다." },
          ]}
          terms={[
            { symbol: "I", name: "단자 전류", description: "순방향을 양수로 잡은 암페어 단위의 전류입니다." },
            { symbol: "I_s", name: "포화 전류", description: "이 글에서 1 pA로 둔 가정값이며 실제 소자마다 다릅니다." },
            { symbol: "V", name: "단자 전압", description: "왼쪽 p형 쪽 전위에서 오른쪽 n형 쪽 전위를 뺀 값입니다." },
            { symbol: "V_T", name: "열전압", description: "300 K에서 약 25.85 mV입니다. k는 볼츠만 상수, T는 절대온도, q는 기본 전하량입니다." },
          ]}
          assumptions={["일정한 300 K, 이상 계수 1의 접합입니다.", "직렬 저항·재결합·고전류 주입·항복의 영향을 무시합니다.", "1 pA는 논문 측정값이 아니라 이 글의 가정입니다."]}
          interpretation="0.5 V에서 약 0.251 mA, 0.6 V에서 약 12.03 mA입니다. 역방향 −0.5 V에서는 지수 항이 거의 0이므로 약 −1 pA, 0 V에서는 0 A입니다."
        />
        <CitationBlock
          source="W. Shockley, ‘The Theory of p-n Junctions in Semiconductors and p-n Junction Transistors,’ Bell System Technical Journal 28 (1949), 461쪽 식 (4.18)–(4.22)"
          citeKey={1}
          href="https://vtda.org/pubs/BSTJ/vol28-1949/articles/bstj28-3-435.pdf"
        >
          원문 461쪽 스캔에서 정공·전자 성분 각각의 전압 의존성 식 (4.18),
          (4.19)와 두 성분을 합친 식 (4.22)를 확인했습니다. 원문의 마지막 줄은
          I<sub>ps</sub>와 I<sub>ns</sub>의 합에 (e<sup>qv₀/kT</sup>−1)을
          곱합니다. 여기서는 균일한 접합의 면적까지 곱한 합을 I<sub>s</sub>로 두고, qv₀/kT를 V/V<sub>T</sub>로
          썼습니다. 1 pA와 0.5·0.6 V는 원문의 측정값이 아닙니다.
        </CitationBlock>
        <div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            MIT 6.720J의 접합 강의도 같은 이상 전류식을 쓰면서 순방향에서
            장벽이 낮아지고 역방향에서는 높아진다는 물리적 설명을 함께 둡니다.
            앞 절의 전하 그림과 식이 서로 다른 이야기가 아니라는 점을 확인할
            수 있습니다. 같은 가상 사례에서 0.1 V를 올릴 때 전류비가 큰 것은
            지수의 입력이 약 3.87 늘기 때문입니다.
          </p>
          <p className="leading-7"><em>1 pA와 300 K를 같은 식에 넣자 0.5 V와 0.6 V는 약 48배 차이가 나고, −0.5 V는 약 −1 pA가 됩니다.</em></p>
        </div>
        <CitationBlock
          source="MIT OpenCourseWare 6.720J, Lecture 14, p-n Junction Diode I–V Characteristics (2007), 강의안 17쪽"
          citeKey={2}
          href="https://ocw.mit.edu/courses/6-720j-integrated-microelectronic-devices-spring-2007/369ddf4748729cfe5fe48c7528fd1d42_lecture14.pdf"
        >
          강의안의 이상 접합 I–V 식과 순방향·역방향 장벽 변화를 확인했습니다.
          이 자료는 원전의 대체 근거가 아니라 현대 표기와 작동 조건을
          대조하는 교육용 자료입니다.
        </CitationBlock>
</section>

<section id="ratio" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 같은 원문의 지수 항으로 약 48배를 검산합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">Shockley 원문 461쪽 식 (4.22)의 마지막 줄은 <code>I₀(v₀)=(Ips+Ins)[e^(qv₀/kT)−1]</code>입니다. 원문은 단위 면적을 기준으로 전류를 다룹니다. 예를 들어 앞선 454쪽 식 (3.12)는 이를 전류 밀도라고 명시합니다. 전체 단자 전류로 바꾸려면 균일한 접합 면적을 곱해야 합니다. 본문의 Is는 그 면적까지 포함한 총 포화 전류를 1 pA로 가정한 값입니다.</p><p className="leading-7">두 순방향 전압의 비를 쓰면 같은 Is는 약분됩니다. 정확한 비는 [e^(0.6/0.02585)−1]/[e^(0.5/0.02585)−1]입니다. 두 지수 항이 1보다 매우 커서 −1을 무시하면 e^((0.6−0.5)/0.02585)=e^3.8685≈47.87입니다. 본문에서 약 47.9배 또는 약 48배라 쓴 값입니다.</p><p className="leading-7">이 근사는 두 순방향 전류가 기준 전류보다 충분히 클 때 맞습니다. 0 V 근처에서 −1을 버리면 전류가 0이 되어야 하는 조건을 잃습니다. −0.5 V에서는 반대로 지수 항이 매우 작아 I≈−Is가 됩니다. 원문의 같은 식에서 서로 다른 항이 남는 결과입니다.</p></div>
</section>

<section id="limits" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 켜짐의 기준과 이상식의 범위를 분리합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            흔히 ‘0.6 V가 되면 켜진다’고 외우지만 0.5 V에서도 이 가상
            접합은 0.251 mA를 흘립니다. 전류가 어느 값 이상일 때 켜졌다고
            부를지는 회로가 정합니다. 1 pA라는 기준 전류가 달라지거나 온도가
            바뀌면 같은 전류에 필요한 전압도 달라집니다. 실제 접합에는 재결합,
            직렬 저항, 높은 주입 수준, 표면 누설이 더해집니다. 0.6 V에서
            12.03 mA라는 결과는 이상 모델의 계산이지 제품 보증값이 아닙니다.
          </p>
          <p className="leading-7">
            역방향도 마찬가지입니다. 작고 안전한 역전압에서 −I<sub>s</sub>에
            가까워진다는 모형을 정격 이상으로 연장하면 안 됩니다. 큰 역전압에서
            항복이 시작될 수 있으며, 실제 누설 전류는 온도와 결함에 민감합니다.
            회로를 설계할 때는 해당 소자의 데이터시트 전류·전압·온도 조건을
            확인해야 합니다.
          </p>
          <p className="leading-7"><em>이상식의 전류는 계산값입니다. 실제 소자에서는 온도와 정격, 누설과 항복 조건을 따로 확인해야 합니다.</em></p>
        </div>
</section>

<section id="handoff" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 방향과 전압을 바꾼 결과를 예측해 봅니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글에서는 두 영역을 직접 붙여 바깥 전압이 경계의 장벽을 바꾸게 했습니다. 다음에는 전극을 절연층 너머에 놓고 직접 전류를 넣지 않으면서 표면에 모이는 전하를 바꾸겠습니다.
            이 표면 제어가 뒤에서 다룰 스위치 소자의 바탕입니다.
          </p>
          <p className="leading-7">
            먼저 <Link to="/electronics/semiconductors/bands-and-doping#count">도핑 글의 전자·정공 농도 계산</Link>을
            돌아보면, 왜 접합 건너편의 소수 캐리어가 전류식에 들어가는지
            더 선명해집니다.
          </p>
          <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 바깥 전압이 0 V인데도 접합 안에 전기장이 있는 이유는 무엇입니까? (답: 5·6절) 0.5 V에서 0.6 V로 바꾸면 왜 0.1 V만큼 전류가 선형으로 늘지 않습니까? (답: 8·9절) 역방향 전압을 계속 높여도 −1 pA가 유지될까요? (답: 10절)</p>
        </div>
</section>
</div>;
}
