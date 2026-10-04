import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import FeedbackViz from "./feedback-gain-and-stability/viz/FeedbackViz";

import NumericPath from "../world-systems/NumericPath";

export default function FeedbackGainAndStabilityArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 크게 키우는 장치로 원하는 배율을 만듭니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            신호를 100배 키우는 장치가 있는데, 우리가 원하는 출력은 입력의 약 10배입니다. 장치를 새로 만드는 대신 출력의 일부를 되돌려 입력에서 빼면 1 V를 넣었을 때 약
            9.09 V에 머물게 할 수 있습니다(가정). 왜 100 V도 정확한 10 V도 아닌지 확인하겠습니다.
          </p><p className="leading-7">먼저 시간이 충분히 지난 뒤 서로 맞아야 하는 숫자를 구합니다. 그다음 입력이 빠르게 변할 때 되돌아오는 신호가 얼마나 늦는지 봅니다. 같은 연결이 배율을 잘 맞추면서도 변화 뒤 흔들릴 수 있으므로 두 계산이 모두 필요합니다.</p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 결과를 다시 읽어 남은 차이만 키웁니다</h2>
<NumericPath title="출력 일부가 비교하는 곳으로 되돌아옵니다" steps={[{"label": "원하는 입력", "value": "1 V", "detail": "돌아온 값과 비교합니다."}, {"label": "차이를 키우기", "value": "남은 값 × 100", "detail": "장치가 보는 것은 비교 뒤의 차이입니다."}, {"label": "결과", "value": "약 9.09 V", "detail": "일부를 다시 읽어 앞의 비교에 보냅니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">마지막 상자에서 읽은 값의 10%를 첫 상자로 되돌려 뺍니다. 출력이 커지면 빼는 값도 커져 키울 차이가 줄어듭니다. 출력이 작아지면 빼는 값이 줄어 차이가 늘어납니다. 이 연결이 어느 숫자에서 서로 맞는지가 첫 질문입니다.</p><p className="leading-7">그림은 신호가 도는 관계를 나타냅니다. 각 상자를 한 번씩 방문할 때마다 출력이 즉시 100배 바뀐다는 시간 알고리즘은 아닙니다. 지금은 충분히 안정된 뒤의 값들이 동시에 만족할 조건을 찾습니다.</p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 출력의 10%를 돌려보내는 1 V 입력을 고릅니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">모든 수치는 교육용 <strong>가정</strong>입니다. 장치는 들어온 차이를 100배 키우고, 돌아오는 몫은 출력의 10%입니다. 1 V 입력에 출력이 9.0909 V라면 되돌아오는 값은 0.90909 V, 남은 차이는 0.090909 V입니다. 이 차이를 100배 하면 다시 9.0909 V가 됩니다.</p><p className="leading-7">정확히 10 V라고 두면 돌아온 값이 1 V여서 차이가 0 V가 됩니다. 이 장치는 차이가 0이면 출력도 0으로 계산하므로 10 V라는 가정과 맞지 않습니다. 유한한 100배 장치에는 출력을 유지할 작은 차이가 남아야 합니다.</p><p className="leading-7">다음에는 같은 장치에서 돌아오는 몫만 50%로 바꿉니다. 출력은 약 1.96 V로 낮아집니다. 되돌리는 양을 늘리면 무조건 더 큰 출력을 얻는다는 추측을 같은 식으로 확인하겠습니다.</p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 비교하는 곳과 되돌리는 길을 나눠 봅니다</h2>
<NumericPath title="안정된 값의 검산 (가정)" steps={[{"label": "비교", "value": "1−0.90909 V", "detail": "약 0.090909 V가 남습니다."}, {"label": "키우기", "value": "0.090909×100", "detail": "약 9.0909 V를 냅니다."}, {"label": "되돌리기", "value": "9.0909×0.1", "detail": "약 0.90909 V가 비교로 돌아옵니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            세 칸의 숫자를 연결하면 처음 비교에서 뺀 값과 마지막에 되돌려 얻은 값이 같습니다. 이 두 값이 일치해야 처음 정한 출력이 회로의 조건을 만족합니다. 반올림한 소수에서는 작은
            차이가 남으므로 유도는 분수로 하고 마지막에 반올림합니다.
          </p><p className="leading-7">출력을 결정하는 것은 키우는 장치의 100만이 아닙니다. 돌아오는 비율과 비교의 빼기 부호까지 함께 정해야 합니다. 다음에는 각 역할을 빠뜨렸을 때 계산이 어떻게 달라지는지 봅니다.</p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 배율을 정하는 조건과 늦는 정도를 함께 봐야 합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            돌아오는 길이 없으면 장치는 입력 1 V를 그대로 100배 키우려 합니다. 비교에서 돌아온 값을 빼지 않고 더하면 출력이 커질수록 입력 차이도 커져 지금 구한 자기 조절 관계가
            사라집니다. 돌아오는 경로와 비교 부호는 별개의 설계 선택입니다.
          </p><p className="leading-7">빼는 연결이라도 실제 장치가 변화를 늦게 전달할 수 있습니다. 출력이 이미 반대 방향으로 움직이는데 이전 상태를 보고 고치면 흔들림을 키울 수 있습니다. 일정한 입력에서 얻은 9.09라는 숫자만으로 이 지연을 판단할 수 없습니다.</p><p className="leading-7">
            그래서 먼저 안정된 상태의 배율을 구하고 이어서 반복 입력의 한 바퀴 크기와 지연을 구합니다. 이 두 질문을 구분한 뒤 용어를 붙이겠습니다.
          </p></div>
</section>

<section id="names" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 되먹임의 경로와 배율에 이름을 붙입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">출력 일부를 입력에서 빼도록 연결하는 것을 <strong>음의 되먹임</strong>이라고 합니다. 연결을 닫은 전체 회로의 출력÷입력은 <strong>폐루프 이득</strong>, 증폭기와 되돌리는 길을 한 바퀴 지난 비율은 <strong>루프 이득</strong>입니다.</p><p className="leading-7">입력 r, 출력 y, 비교 뒤 차이 e, 증폭기 배율 A, 되돌리는 비율 β로 적겠습니다. 이번 사례는 r=1 V, A=100, β=0.1입니다. 앞에서 한 번씩 검산한 세 역할을 이제 같은 식으로 묶을 수 있습니다.</p></div>
</section>

<section id="loop" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 같은 1 V가 9.09 V에 머무는 경로를 풉니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">입력 r, 출력 y, 되돌리는 비율 β를 둡니다. 증폭기에 들어가는 오차는 e=r−βy이고, 증폭기는 y=Ae를 만듭니다. 둘을 합쳐 y=A(r−βy)를 정리하면 출력÷입력인 <strong>폐루프 이득</strong>은 A/(1+Aβ)입니다. Aβ는 한 바퀴 돌아온 비율인 <strong>루프 이득</strong>입니다. 직류에서 A=100·β=0.1이면 루프 이득은 10이고 폐루프 이득은 100/11≈9.09입니다.</p>
      <p className="leading-7">루프 이득이 아주 클 때만 폐루프 이득은 1/β=10에 가까워집니다. 여기서는 9.09이므로 목표 10과 약 9.1% 다릅니다. β를 0.5로 바꾸면 목표는 2, 실제는 100/51≈1.96입니다. 루프 이득이 50이라 오차 비율은 줄지만 얻는 출력 배율도 낮아집니다. 돌아오는 비율이 커지면서 목표 배율도 10에서 2로 바뀐 결과입니다.</p>
      <p className="leading-7"><em>출력을 되돌리는 길은 목표 배율을 만들면서 증폭기가 바로잡을 오차도 정합니다.</em></p>
    </div><ExplainedFormula question="1 V를 넣고 출력의 10%를 되돌리면 몇 V가 나옵니까?" idea="출력에서 돌아온 몫을 입력에서 빼고, 남은 오차에 증폭기 이득을 곱한 값이 다시 출력이어야 합니다." formula={String.raw`\frac{y}{r}=\frac{A}{1+A\beta}`} annotatedFormula={String.raw`\underbrace{\frac{y}{r}}_{\text{폐루프 이득}}=\frac{A}{1+A\beta}`} operations={[{expression:String.raw`A\beta=100\times0.1=10`,annotation:"직류 루프 이득입니다."},{expression:String.raw`y/r=100/11\approx9.09`,annotation:"목표 10배에 가깝지만 정확히 10은 아닙니다."},{expression:String.raw`e=1-0.1(9.09)\approx0.091\,\mathrm V`,annotation:"100배 하면 다시 약 9.09 V입니다."}]} terms={[{symbol:"A",name:"증폭기 자체 이득",description:"가정한 직류 100배입니다."},{symbol:String.raw`\beta`,name:"되돌림 비율",description:"출력에서 입력의 빼는 단자로 돌아오는 몫입니다."},{symbol:"e",name:"오차 전압",description:"입력 r에서 돌아온 βy를 뺀 값입니다."}]} assumptions={["증폭기는 1 V 입력에 필요한 출력 전압을 공급 전원 범위에서 낼 수 있습니다.","직류 이득 100배와 β=0.1인 선형 음의 되먹임입니다."]} interpretation="입력 1 V의 출력은 9.09 V입니다. 무한한 루프 이득일 때의 10 V와 구분합니다." /><CitationBlock source="Texas Instruments / Burr-Brown, Jerald G. Graeme, ‘Feedback Plots Define Op Amp AC Performance’ (1991 발행), 1쪽" citeKey={1} href="https://www.ti.com/lit/an/sboa015/sboa015.pdf">원본 첫 쪽은 β를 출력에서 되돌아오는 비율로 두고 폐루프 이득 A/(1+Aβ), 루프 이득 Aβ와 큰 루프 이득의 1/β 근사를 제시합니다. 이 글의 A=100·1 V·β=0.1은 해당 문서의 제품 수치가 아닌 가정입니다.</CitationBlock>
</section>

<section id="source-gain" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 실제 자료의 식에서 유한한 배율의 오차를 읽습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">TI/Burr-Brown의 Graeme 자료 1쪽에 적힌 식은 <code>ACL=A/(1+Aβ)</code>입니다. 그 아래에는 같은 식을 <code>(1/β)/(1+1/(Aβ))</code>로도 씁니다. 분자의 1/β가 목표 배율, 분모의 추가 항 1/(Aβ)가 유한한 장치 때문에 남는 차이를 보여 줍니다. <a href="https://www.ti.com/lit/an/sboa015/sboa015.pdf#page=1" target="_blank" rel="noopener noreferrer">원문 1쪽</a>의 기호 ACL은 여기의 y/r입니다.</p><p className="leading-7">
            A=100, β=0.1을 넣으면 10/(1+0.1)=100/11입니다. 목표에서 모자란 비율은 (10−100/11)/10=1/11≈9.09%입니다. β=0.5일 때는
            2/(1+0.02)=100/51이고 목표와의 차이는 1/51≈1.96%입니다. 두 계산을 비교할 때는 목표 배율도 바뀌었다는 점을 함께 봐야 합니다.
          </p><p className="leading-7">여기까지는 일정한 입력의 배율입니다. 실제 자료도 이어서 주파수에 따라 증폭기의 크기와 각도가 바뀔 때를 다룹니다. 다음 절에서는 그 차이를 가상 두 지연으로 계산하겠습니다.</p></div>
</section>

<section id="delay" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 두 지연을 식에 넣고 원문의 교차 조건을 적용합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">실제 증폭기의 이득은 빠른 신호에서 줄고, 출력 변화도 늦습니다. 이를 살피려고 직류 이득 100에 두 개의 속도 경계, 10 rad/s와 100 rad/s를 넣은 <strong>가상 선형 증폭기</strong>를 씁니다. A(s)=100/[(1+s/10)(1+s/100)]입니다. 여기서 s=jω를 대입하면 앞 글처럼 각 주파수에서 이득의 크기와 각도 지연을 구할 수 있습니다. 이 두 경계는 특정 소자 모델에서 가져온 값이 아닙니다.</p>
      <p className="leading-7">
            첫 경계보다 빠르면 한 번 늦고, 두 번째 경계보다도 빠르면 더 늦습니다. 되돌리는 신호가 처음에는 출력 오류를 줄이지만 지연이 커져 출력과 거의 반대 각도로 돌아오면 빼려고
            한 연결이 오히려 흔들림을 키울 수 있습니다. ‘음의’는 배선의 빼기 부호이며 모든 주파수에서 항상 안정이라는 보증은 아닙니다.
          </p>
      <p className="leading-7"><em>증폭기의 이득뿐 아니라 돌아오는 데 걸리는 각도도 한 바퀴 계산해야 합니다.</em></p>
    </div><CitationBlock source="Texas Instruments / Burr-Brown, Graeme, ‘Feedback Plots Define Op Amp AC Performance’, 1–2쪽" citeKey={2} href="https://www.ti.com/lit/an/sboa015/sboa015.pdf">공식 자료는 열린 증폭기 이득과 1/β 곡선의 만나는 위치, 추가 극이 더하는 위상 지연, 루프 이득이 −1에 가까울 때의 발진 조건을 설명합니다. 본문의 10·100 rad/s 두 극은 설명을 위해 만든 모델입니다.</CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">원문 1쪽의 두 곡선은 |A|와 1/β입니다. 두 값이 같다는 조건은 |Aβ|=1과 같습니다. 가정한 두 극 모델의 크기를 넣으면 (1+(ω/10)²)(1+(ω/100)²)=(100β)²입니다. 이 식에서 ω를 구하면 두 곡선이 만나는 속도를 얻습니다.</p><p className="leading-7">ω²을 x로 두어 전개하면 x²+10100x+1000000[1−(100β)²]=0입니다. 양의 해를 택하고 제곱근을 취합니다. β=0.1에서는 x≈6108.07, 따라서 ω≈78.15 rad/s입니다. β=0.5에서는 x≈45194.4, 따라서 ω≈212.59 rad/s입니다. 표시 자리수에 따라 아래의 반올림은 약간 달라질 수 있습니다.</p></div>
</section>

<section id="margin" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 원문의 위상 여유에 두 지연 각도를 대입합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">루프 이득 L=Aβ의 크기가 1, 즉 0 dB가 되는 속도를 <strong>교차 각주파수</strong>라 합니다. 이때 L의 각도가 −180°이면 한 바퀴 뒤 원래 빼야 할 신호가 같은 방향으로 보태지는 셈입니다. 각도 −180°까지 얼마나 남았는지를 <strong>위상 여유</strong>라고 부릅니다. 한 교차점의 선형 모델에서 β=0.1은 약 78.2 rad/s에 크기 1, 위상 약 −120.7°이므로 여유가 약 59.3°입니다.</p>
      <p className="leading-7">
            β를 0.5로 높이면 루프 이득이 더 커져 교차점이 약 212.6 rad/s로 오른쪽으로 갑니다. 그곳에서는 두 번째 지연까지 더 많이 쌓여 위상은 약 −152.1°, 남은
            여유는 약 27.9°입니다. 같은 증폭기라도 되먹임 비율 때문에 교차 속도와 지연이 함께 바뀝니다. 두 경우 모두 이 가상 2극 선형 모델에서는 안정한 극을 갖지만 여유가 작은
            쪽은 변화 뒤 더 오래 흔들릴 수 있습니다.
          </p>
      <p className="leading-7"><em>‘되먹임이 더 세다’는 정적 이득의 이야기이고, ‘얼마나 흔들리나’는 교차점의 위상까지 본 이야기입니다.</em></p>
    </div><FeedbackViz /><ExplainedFormula question="β=0.1인 가상 2극 회로의 위상 여유는?" idea="|Aβ|=1인 속도를 찾고, 그때 두 지연 각도를 더해 −180°까지의 차이를 셉니다." formula={String.raw`\mathrm{PM}=180^\circ+\angle L(j\omega_x)`} annotatedFormula={String.raw`\underbrace{\mathrm{PM}}_{\text{위상 여유}}=180^\circ+\angle L(j\omega_x)`} operations={[{expression:String.raw`|L(j\omega_x)|=1`,annotation:"β=0.1이면 ωx≈78.2 rad/s입니다."},{expression:String.raw`\angle L(j\omega_x)\approx-120.7^\circ`,annotation:"10·100 rad/s 두 경계의 지연을 합합니다."},{expression:String.raw`\mathrm{PM}\approx59.3^\circ`,annotation:"−180°까지 약 59.3° 남았습니다."}]} terms={[{symbol:"L",name:"루프 이득",description:"복소 증폭기 이득 A(jω)에 β를 곱합니다."},{symbol:String.raw`\omega_x`,name:"크기 1 교차 속도",description:"|L|=1 또는 0 dB인 각주파수입니다."},{symbol:"PM",name:"위상 여유",description:"교차점에서 −180°까지 남은 각도입니다."}]} assumptions={["β는 주파수와 무관한 양수이고 한 번의 교차점을 갖는 가상 선형 2극 모델입니다.","공급 전압·포화·부하·추가 지연은 모델에 넣지 않았습니다."]} interpretation="β=0.1의 약 59.3°와 β=0.5의 약 27.9°는 가상 모델의 계산 결과이며 실제 증폭기의 안정성 등급은 아닙니다." /><CitationBlock source="Texas Instruments / Burr-Brown, Graeme, ‘Feedback Plots Define Op Amp AC Performance’, 2쪽" citeKey={3} href="https://www.ti.com/lit/an/sboa015/sboa015.pdf">원본 2쪽은 열린 이득·1/β의 교차와 −180°에 대한 위상 여유를 설명하고, 극이 추가되면 여유가 달라진다고 밝힙니다. 78.2·212.6 rad/s와 59.3°·27.9°는 본문 모델에서 직접 계산한 값입니다.</CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">이 모델의 루프 위상은 −arctan(ω/10)−arctan(ω/100)입니다. 각 교차 속도를 넣어 −120.7°와 −152.1°를 얻고, 원문이 정의한 −180°까지의 차이를 구하면 약 59.3°와 27.9°가 됩니다. 크기를 먼저 1로 맞춘 뒤 그 자리의 각도를 읽는 순서입니다.</p><p className="leading-7">두 번째 극을 없애 A(s)=100/(1+s/10)로 바꾸면 β=0.1에서 100/√(1+(ω/10)²)×0.1=1입니다. 따라서 ω=10√99≈99.5 rad/s, 위상은 −arctan(√99)≈−84.3°, 여유는 약 95.7°입니다. 같은 직류 배율이어도 두 번째 지연이 있느냐에 따라 동적 결과가 달라집니다.</p></div>
</section>

<section id="limits" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 모델의 여유와 실제 부하의 안정성을 구분합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">위상 여유는 선형 모델의 교차점 근처에서 흔들림을 가늠하는 수치입니다. 공급 전압이 모자라 출력이 포화되거나, 부하의 축전기가 새 지연을 만들거나, 측정에서 여러 교차점이 나타나면 이 두 숫자만으로 안정성을 선언할 수 없습니다. 실제 회로에서는 증폭기 데이터시트의 허용 부하·이득 조건과 연결한 회로의 루프 응답, 계단 입력 뒤의 흔들림을 함께 확인합니다.</p>
      <p className="leading-7">앞 글에서 저역 통과 RC의 −20 dB/dec를 그릴 때는 축전기 출력 자체를 봤습니다. 여기서는 <strong>출력에서 입력으로 다시 돌아온 한 바퀴</strong>의 크기와 위상을 봅니다. 둘 다 보드 선도를 쓰지만 측정하는 경로가 다릅니다. 증폭기·되먹임망·부하를 바꾸면 루프도 다시 그려야 합니다.</p>
      <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> β=0.1의 목표 10배가 왜 실제 9.09배입니까? (답: 7·8절) β를 0.5로 올리면 교차점은 어느 쪽으로 갑니까? (답: 9·10절) 위상 여유 27.9°만으로 실제 제품이 반드시 발진한다고 말할 수 있습니까? (답: 10·11절)</p>
      <p className="leading-7"><Link to="/electronics/circuits/frequency-shaping-and-bode#plot">앞 글의 보드 눈금</Link>을 알고 나면 같은 가로축에서 이번에는 루프가 0 dB를 지나는 위치를 읽을 수 있습니다.</p>
    </div>
</section>
</div>;
}
