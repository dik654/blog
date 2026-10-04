import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import BodeViz from "./frequency-shaping-and-bode/viz/BodeViz";

import NumericPath from "../world-systems/NumericPath";

export default function FrequencyShapingAndBodeArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 느린 변화와 빠른 변화에 다른 크기로 답하는 회로를 읽습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            같은 5 V 크기의 반복 입력을 넣습니다. 초당 약 16번 오르내릴 때 출력은 약 4.98 V지만 약 1590번 오르내리면 약 0.50 V입니다(가정). 이 회로는 느린 변화를
            크게 남기고 빠른 변화를 작게 남깁니다.
          </p><p className="leading-7">
            앞 글에서 구한 답을 다른 반복 속도에서도 계산해 이어 붙이겠습니다. 출력의 크기와 늦는 정도를 나란히 그리면 어느 범위를 남길 수 있는지 읽을 수 있습니다. 그 그림의 경계와
            기울기가 어디서 나오는지도 같은 숫자로 확인합니다.
          </p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 상자를 통과하기 전후의 비를 잽니다</h2>
<NumericPath title="속도별로 같은 실험을 반복합니다" steps={[{"label": "입력", "value": "최대 크기 5 V 고정", "detail": "반복 속도만 바꿉니다."}, {"label": "회로", "value": "부품과 출력점 고정", "detail": "충분히 반복한 상태를 비교합니다."}, {"label": "출력", "value": "입력에 대한 크기 비", "detail": "봉우리의 시차도 함께 기록합니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">이 상자를 비교하는 값은 출력 자체만이 아닙니다. 입력이 5 V일 때 0.50 V인지, 입력이 0.5 V일 때 0.50 V인지에 따라 줄어든 정도가 다릅니다. 같은 방식으로 잰 출력과 입력을 나눈 비를 씁니다.</p><p className="leading-7">주파수를 바꿀 때마다 출력을 같은 위치에서 읽어야 합니다. 다른 부품 양끝을 읽으면 같은 회로라도 관측 결과가 바뀝니다. 먼저 한 연결과 세 속도를 고정하겠습니다.</p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 같은 부품에 세 가지 반복 속도를 넣습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            가정한 연결은 저항 1 kΩ을 먼저 지나 축전기 1 µF를 접지에 잇는 회로입니다. 축전기 양끝을 출력으로 읽고 출력에서 따로 전류를 끌어가는 장치는 없다고 둡니다. 입력 5
            V는 최대 진폭이며 실효값이 아닙니다.
          </p><p className="leading-7">비교할 속도는 약 15.915 Hz, 159.15 Hz, 1591.5 Hz입니다. 차례로 열 배씩 빨라집니다. 각 출력 최대 진폭은 약 4.98 V, 3.54 V, 0.50 V입니다. 가운데에서 출력이 갑자기 끊기는 일은 없습니다.</p><p className="leading-7">
            처음에는 이 세 숫자가 이어지는 곡선을 그립니다. 그 뒤에 곡선에 붙는 이름과 눈금을 읽고 오른쪽의 기울기가 어느 범위에서 맞는지 확인하겠습니다.
          </p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 속도를 바꿔도 출력점은 같은 자리에 둡니다</h2>
<NumericPath title="같은 연결에서 세 번 읽기" steps={[{"label": "느리게", "value": "15.915 Hz → 4.98 V", "detail": "입력을 거의 따라옵니다."}, {"label": "가운데", "value": "159.15 Hz → 3.54 V", "detail": "출력은 입력의 약 0.707배입니다."}, {"label": "빠르게", "value": "1591.5 Hz → 0.50 V", "detail": "출력은 입력의 약 0.0995배입니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">느리게 오르내리면 전하를 채우고 빼는 시간이 길어 축전기 전압이 입력을 거의 따라갑니다. 빠르게 방향을 바꾸면 충분히 채우기 전에 다시 빼야 하므로 변화 폭이 작아집니다.</p><p className="leading-7">이 그림은 서로 다른 세 필터를 뜻하지 않습니다. 같은 회로에 입력의 속도를 하나씩 바꿔 준 세 관측입니다. 입력과 출력의 최대 크기를 비교하고 있다는 조건도 세 경우 모두 같습니다.</p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 열 배 간격을 같은 거리로 그리는 이유가 있습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">15.915에서 159.15까지와 159.15에서 1591.5까지는 모두 열 배 증가입니다. 단순한 Hz 차이로 가로 거리를 정하면 두 번째 구간이 열 배 길어져 느린 쪽 변화가 좁은 곳에 몰립니다. 같은 배수를 같은 거리에 놓으면 여러 속도 범위를 함께 읽기 쉽습니다.</p><p className="leading-7">출력 비도 1, 0.1, 0.01처럼 넓어질 수 있습니다. 같은 배율의 감소를 같은 세로 간격으로 놓으면 작은 값의 변화도 보입니다. 그래서 가로와 세로의 눈금을 바꿉니다. 눈금이 바뀌어도 원래 출력 전압은 그대로입니다.</p><p className="leading-7">이제 통과하는 방향과 두 눈금의 이름을 붙이겠습니다. 이름을 읽은 뒤에는 언제든 원래 4.98·3.54·0.50 V로 되돌아올 수 있어야 합니다.</p></div>
</section>

<section id="names" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 통과 방향과 눈금에 이름을 붙입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">느린 성분을 크게 남기고 빠른 성분을 줄이는 이 연결은 <strong>저역 통과 필터</strong>입니다. 한 번 왕복하는 빈도를 열 배씩 일정 거리로 놓는 것은 <strong>로그 주파수 축</strong>입니다. 그 축에 출력 크기 비와 입력 대비 각도를 나란히 그린 그림을 <strong>보드 선도</strong>라고 부릅니다.</p><p className="leading-7">출력 크기 비를 표시할 때 쓰는 데시벨 계산은 아래에서 따로 열어 보겠습니다. 먼저 경계를 계산하고, 세 속도의 값을 같은 식으로 추적합니다.</p></div>
</section>

<section id="corner" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 1 ms에서 159.15 Hz를 구해 세 출력을 잇습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">RC=1 ms이므로 입력 각주파수 ω에 대해 ωRC=1이 되는 곳은 ω<sub>c</sub>=1000 rad/s입니다. 보통 쓰는 반복 빈도로 바꾸면 f<sub>c</sub>=ω<sub>c</sub>/(2π)≈159.15 Hz입니다. 이 지점을 <strong>차단 주파수</strong> 또는 경계 주파수라 부릅니다. ‘차단’은 출력이 0이 된다는 뜻이 아닙니다.</p>
      <p className="leading-7">축전기 양단 출력 비는 H=1/(1+jωRC)입니다. 경계에서는 크기가 1/√2≈0.707이므로 5 V 최대 진폭은 약 3.54 V로 남습니다. 출력은 입력보다 45° 늦습니다. 같은 회로를 시간으로 보면 1 ms의 저장 과정이고, 반복 입력으로 보면 약 159 Hz에서 변화가 두드러지는 것입니다.</p>
      <p className="leading-7"><em>경계는 ‘꺼지는 곳’이 아니라 출력 진폭이 저주파 기준의 약 70.7%가 되는 곳입니다.</em></p>
    </div><ExplainedFormula question="1 kΩ·1 µF에서 경계 주파수와 출력 최대 진폭은?" idea="저장 시간 RC의 역수를 각주파수 경계로 바꾸고, 복소 전압 분배의 크기를 읽습니다." formula={String.raw`\omega_c=\frac{1}{RC}`} annotatedFormula={String.raw`\underbrace{\omega_c}_{\text{경계 각주파수}}=\frac{1}{RC}`} operations={[{expression:String.raw`RC=1\,\mathrm{ms}`,annotation:"1 kΩ×1 µF입니다."},{expression:String.raw`f_c=\frac{1000}{2\pi}\approx159.15\,\mathrm{Hz}`,annotation:"각주파수 1000 rad/s를 Hz로 바꿉니다."},{expression:String.raw`5/\sqrt2\approx3.54\,\mathrm V`,annotation:"5 V 최대 진폭의 약 70.7%가 남습니다."}]} terms={[{symbol:"R,C",name:"저항·용량",description:"이 글의 가상값 1 kΩ·1 µF입니다."},{symbol:String.raw`\omega_c`,name:"경계 각주파수",description:"ωRC=1이 되는 속도, 단위 rad/s입니다."},{symbol:"f_c",name:"경계 빈도",description:"1초에 반복하는 횟수, 단위 Hz입니다."}]} assumptions={["5 V는 최대 진폭이고 출력은 무부하 축전기 양단에서 읽습니다.","이상적인 일정한 R·C와 정현파 정상 상태를 가정합니다."]} interpretation="159 Hz 부근에서 출력은 0이 아니라 약 3.54 V 최대 진폭입니다." /><CitationBlock source="MIT OpenCourseWare 6.002, Lecture 18, ‘Filters’ (Fall 2000 자료), 2–3쪽" citeKey={1} href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/d4e136975654a01f7fc2c9b49196d376_6002_l18.pdf">원본 2–3쪽은 저항·축전기 분배식과 축전기 출력의 저역 통과 회로를 제시합니다. 1 kΩ·1 µF·5 V와 159.15 Hz는 강의 자료의 실험값이 아니라 이 글의 가정 계산입니다.</CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">세 속도에서 ωRC는 0.1, 1, 10입니다. 따라서 출력 비 1/√(1+(ωRC)²)는 각각 약 0.9950, 0.7071, 0.09950입니다. 5 V를 곱하면 처음의 4.98·3.54·0.50 V를 얻습니다. 입력보다 늦는 각도는 −arctan(ωRC)이므로 −5.7°·−45°·−84.3°입니다.</p></div>
</section>

<section id="db" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 전압비를 로그 눈금으로 옮긴 뒤 원래 값으로 돌립니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">저주파에서 출력÷입력은 거의 1입니다. 경계에서는 약 0.707, 경계의 열 배에서는 약 0.0995입니다. 0에서 1 사이의 비를 긴 주파수 범위에 표시하려고 <strong>데시벨 dB</strong>을 씁니다. 전압 진폭 비 A의 값은 20 log<sub>10</sub>(A) dB입니다. 같은 기준과 임피던스 조건에서 전력비로 바꿀 때의 10 log와 섞지 않아야 합니다.</p>
      <p className="leading-7">A=1이면 0 dB, 0.707이면 약 −3.01 dB, 0.1이면 −20 dB입니다. 음수 dB는 출력 진폭이 입력보다 작다는 뜻이지 음수 전압이라는 뜻이 아닙니다. 이번 회로에서 경계의 열 배인 약 1591.5 Hz는 −20.043 dB, 출력 최대 진폭 약 0.50 V입니다.</p>
      <p className="leading-7"><em>dB 눈금은 비율을 읽는 다른 자입니다. 부호는 진폭 자체의 방향을 나타내지 않습니다.</em></p>
    </div><ExplainedFormula question="경계에서 0.707배인 출력을 dB로 쓰면?" idea="같은 전압 기준의 최대 진폭 비에 20 log₁₀을 적용합니다." formula={String.raw`G_{\mathrm{dB}}=20\log_{10}|H|`} annotatedFormula={String.raw`\underbrace{G_{\mathrm{dB}}}_{\text{진폭비의 dB}}=20\log_{10}|H|`} operations={[{expression:String.raw`|H(\omega_c)|=1/\sqrt2`,annotation:"경계의 진폭 비입니다."},{expression:String.raw`20\log_{10}(1/\sqrt2)\approx-3.01\,\mathrm{dB}`,annotation:"출력이 사라지는 것이 아닙니다."},{expression:String.raw`20\log_{10}(0.1)=-20\,\mathrm{dB}`,annotation:"전압 진폭이 10분의 1이면 −20 dB입니다."}]} terms={[{symbol:"H",name:"출력÷입력",description:"무차원 복소 비의 크기를 씁니다."},{symbol:"G",name:"진폭비 dB",description:"두 최대 진폭을 같은 방식으로 잰 비입니다."}]} assumptions={["입력과 출력은 같은 주파수의 정현파 최대 진폭입니다.","전압 진폭 비를 표시합니다. 전력비의 기준은 별도입니다."]} interpretation="경계의 −3.01 dB는 5 V 최대 입력에서 출력 약 3.54 V에 해당합니다." /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">앞 절에서 쓴 MIT Lecture 17의 4쪽 원문 크기식은 <code>1/√(1+ω²R²C²)</code>입니다. ωRC=1을 넣어 1/√2를 얻고, 그 비에 20log₁₀을 적용하면 −3.0103 dB입니다. 반대로 10^(−3.0103/20)을 계산하면 약 0.7071로 돌아갑니다. 원문 응답식 위에 전압비의 로그 눈금을 적용한 것이므로 출력이 새로 달라진 것은 아닙니다.</p><p className="leading-7">20이라는 계수는 같은 저항 조건에서 전력비가 전압비의 제곱이어서 10log₁₀(A²)=20log₁₀(A)가 되는 관계와 이어집니다. 이 글의 그래프는 전압 진폭비를 표시합니다. 입력·출력 저항이 다른 회로의 전력 이득까지 같다고 읽으면 안 됩니다.</p></div>
</section>

<section id="plot" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 원문 식으로 정확한 곡선과 근사 기울기를 대조합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">가로축의 한 칸을 주파수 열 배인 <strong>한 decade</strong>로 놓고, 세로축에 dB와 위상을 각각 표시한 그림이 <strong>보드 선도</strong>입니다. 이 회로에서 0.1f<sub>c</sub>는 약 −0.043 dB·−5.7°, f<sub>c</sub>는 −3.01 dB·−45°, 10f<sub>c</sub>는 −20.043 dB·−84.3°입니다. 열 배씩 오른쪽으로 갈수록 축전기 출력이 작아지고 더 늦습니다.</p>
      <p className="leading-7">경계보다 훨씬 위에서는 |H|≈1/(ωRC)라서 주파수를 열 배 올리면 출력 비가 거의 10분의 1, 약 −20 dB가 됩니다. 하지만 f<sub>c</sub>에서 10f<sub>c</sub>까지는 −3.01에서 −20.043 dB로 약 −17.03 dB 차이입니다. <strong>−20 dB/dec는 높은 주파수의 근사 기울기</strong>입니다. 10f<sub>c</sub>에서 100f<sub>c</sub>로 가면 약 −19.96 dB만큼 바뀌어 근사치에 가까워집니다.</p>
      <p className="leading-7"><em>기울기를 쓸 때는 정확한 곡선과 멀리서 그은 근사선을 구분합니다.</em></p>
    </div><BodeViz /><CitationBlock source="MIT OpenCourseWare 6.002, Lecture 17, ‘The Impedance Model’ (Fall 2000 자료), 4쪽" citeKey={2} href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/66adf4d4611a57b949efa1b00a842a46_6002_l17.pdf">공식 강의안 4쪽의 RC 전달 함수와 진폭·위상 식을 주파수별로 계산했습니다. dB 수치와 −17.03 dB 비교는 그 식에 본문 가정값을 대입한 결과입니다.</CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            위 원문 식에 ωRC=1과 10을 넣어 20log₁₀을 취한 값이 각각 −3.0103과 −20.0432 dB입니다. 둘을 빼면 −17.0329 dB입니다. ωRC가 충분히 클
            때만 분모의 1을 버려 1/(ωRC)로 근사하므로 경계에서 출발한 한 구간에 바로 −20 dB를 적용할 수 없습니다.
          </p></div>
</section>

<section id="other-output" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 원문의 연결 그림에서 출력 부품을 바꿔 봅니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">같은 1 kΩ과 1 µF라도 입력에서 축전기를 먼저 지나 저항을 접지에 잇고, 저항 양단에서 출력을 읽으면 <strong>고역 통과 필터</strong>가 됩니다. 전류가 아주 천천히 바뀌면 축전기 임피던스의 크기가 커서 저항에 전압이 거의 남지 않습니다. 빨라지면 저항 출력이 입력에 가까워집니다. 새로운 출력 비는 jωRC/(1+jωRC)입니다.</p>
      <p className="leading-7">0.1f<sub>c</sub>, f<sub>c</sub>, 10f<sub>c</sub>에서 저항 출력의 진폭 비는 각각 약 0.0995, 0.707, 0.995입니다. 경계는 여전히 약 159 Hz이며, 어느 쪽을 출력으로 삼는지가 통과 방향을 결정합니다. 실제 측정에는 부하와 신호원의 저항이 붙을 수 있어 이 단순 수치가 변합니다.</p>
      <p className="leading-7"><em>필터 이름은 R·C만 보고 정할 수 없고, 어디에 입력을 걸어 어디서 출력을 읽는지까지 필요합니다.</em></p>
    </div><CitationBlock source="MIT OpenCourseWare 6.002, Lecture 18, ‘Filters’ (Fall 2000 자료), 7쪽" citeKey={3} href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/d4e136975654a01f7fc2c9b49196d376_6002_l18.pdf">원본 7쪽은 저역·고역 통과의 서로 다른 연결과 주파수 응답 모양을 나란히 보입니다. 본문의 고역 통과 수치는 같은 이상 부품을 재배치해 저항 양단을 읽는 별도의 가정입니다.</CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">MIT Lecture 18의 7쪽 원문 그림에서 고역 통과 회로는 입력 뒤에 C, 아래 접지 쪽에 R을 두고 R 양끝을 출력으로 읽습니다. 이를 앞 글의 같은 분배 규칙에 넣으면 <code>R/(R+1/(jωC))=jωRC/(1+jωRC)</code>입니다. 이 식은 그 그림을 이 글에서 대수식으로 옮긴 것입니다. 원문의 저역·고역 연결을 바꿔 읽지 않도록 출력점까지 함께 대조합니다.</p><p className="leading-7">ωRC=0.1·1·10을 넣은 크기식 ωRC/√(1+(ωRC)²)가 0.0995·0.707·0.995를 냅니다. 첫 회로와 반대 방향으로 변하는 원인은 부품값이 아니라 어느 부품의 전압을 출력으로 삼았는지에 있습니다.</p></div>
</section>

<section id="limits" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 연결한 부하까지 포함해 통과 범위를 판단합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">
            이 그림은 무부하·이상 소자·한 주파수 정현파가 충분히 오래 유지되는 경우입니다. 축전기에 부하를 달면 전류가 갈라져 분배식이 달라지고 실제 축전기의 누설·직렬 저항·기생
            성분은 높은 주파수의 모습까지 바꿉니다. 경계 주파수 하나가 모든 신호의 품질을 보장하지는 않습니다.
          </p>
      <p className="leading-7">
            센서의 느린 온도 변화와 빠른 전기 잡음처럼 무엇을 통과시킬지 정할 때 관심 신호와 잡음의 주파수 범위를 먼저 측정합니다. 펄스에는 여러 주파수가 섞이고 시작 과도도 있으므로
            보드 선도의 한 점만으로 시간 파형 전체를 알 수 없습니다. 다음 글은 이 필터를 증폭기 뒤에 되돌려 연결할 때 안정성이 어떻게 달라지는지 봅니다.
          </p>
      <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 159 Hz에서 5 V가 0 V가 됩니까? (답: 7절) f<sub>c</sub>→10f<sub>c</sub>가 정확히 −20 dB입니까? (답: 9절) 출력 위치를 바꾸면 느린 신호는 어느 쪽에서 작아집니까? (답: 10절)</p>
      <p className="leading-7"><Link to="/electronics/circuits/steady-state-and-impedance#divider">앞 글의 한 주파수 분배 계산</Link>으로 돌아가면 선도의 모든 점을 따로 검산할 수 있습니다.</p>
    </div>
</section>
</div>;
}
