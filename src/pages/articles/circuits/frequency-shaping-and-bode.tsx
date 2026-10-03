import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import BodeViz from "./frequency-shaping-and-bode/viz/BodeViz";

/** Invented unloaded ideal RC: 1 kΩ, 1 µF, 5 V peak sinusoid. */
export default function FrequencyShapingAndBodeArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">느린 신호는 남기고 빠른 신호는 줄일 수 있을까요?</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="text-lg leading-8">앞 글의 가상 1 kΩ·1 µF 회로에 최대 진폭 5 V를 넣었습니다. 초당 약 16번 반복하면 축전기 출력은 4.98 V까지 따라오지만, 약 1590번 반복하면 0.50 V만 남습니다. 부품과 입력 진폭은 그대로인데 반복 속도만 열 배씩 달라졌습니다.</p>
      <p className="leading-7">한 속도의 답만 보면 어느 범위가 잘 지나가는지 알기 어렵습니다. 여러 주파수에서 출력과 입력의 비를 그리면 이 회로가 어떤 신호를 줄이는지 한눈에 보입니다. 이 가상 회로는 축전기에서 출력을 읽는 <strong>저역 통과 필터</strong>입니다. 이번에는 각도와 진폭을 한 장의 지도로 펼칩니다.</p>
      <p className="leading-7"><em>반복 속도를 바꾸는 동안 출력의 크기와 시차가 어디서 바뀌는지가 질문입니다.</em></p>
    </div></section>
    <section id="corner" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1 ms 저장 시간에서 경계 속도가 나옵니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="leading-7">RC=1 ms이므로 입력 각주파수 ω에 대해 ωRC=1이 되는 곳은 ω<sub>c</sub>=1000 rad/s입니다. 보통 쓰는 반복 빈도로 바꾸면 f<sub>c</sub>=ω<sub>c</sub>/(2π)≈159.15 Hz입니다. 이 지점을 <strong>차단 주파수</strong> 또는 경계 주파수라 부릅니다. ‘차단’은 출력이 0이 된다는 뜻이 아닙니다.</p>
      <p className="leading-7">축전기 양단 출력 비는 H=1/(1+jωRC)입니다. 경계에서는 크기가 1/√2≈0.707이므로 5 V 최대 진폭은 약 3.54 V로 남습니다. 출력은 입력보다 45° 늦습니다. 같은 회로를 시간으로 보면 1 ms의 저장 과정이고, 반복 입력으로 보면 약 159 Hz에서 변화가 두드러지는 것입니다.</p>
      <p className="leading-7"><em>경계는 ‘꺼지는 곳’이 아니라 출력 진폭이 저주파 기준의 약 70.7%가 되는 곳입니다.</em></p>
    </div><ExplainedFormula question="1 kΩ·1 µF에서 경계 주파수와 출력 최대 진폭은?" idea="저장 시간 RC의 역수를 각주파수 경계로 바꾸고, 복소 전압 분배의 크기를 읽습니다." formula={String.raw`\omega_c=\frac{1}{RC}`} annotatedFormula={String.raw`\underbrace{\omega_c}_{\text{경계 각주파수}}=\frac{1}{RC}`} operations={[{expression:String.raw`RC=1\,\mathrm{ms}`,annotation:"1 kΩ×1 µF입니다."},{expression:String.raw`f_c=\frac{1000}{2\pi}\approx159.15\,\mathrm{Hz}`,annotation:"각주파수 1000 rad/s를 Hz로 바꿉니다."},{expression:String.raw`5/\sqrt2\approx3.54\,\mathrm V`,annotation:"5 V 최대 진폭의 약 70.7%가 남습니다."}]} terms={[{symbol:"R,C",name:"저항·용량",description:"이 글의 가상값 1 kΩ·1 µF입니다."},{symbol:String.raw`\omega_c`,name:"경계 각주파수",description:"ωRC=1이 되는 속도, 단위 rad/s입니다."},{symbol:"f_c",name:"경계 빈도",description:"1초에 반복하는 횟수, 단위 Hz입니다."}]} assumptions={["5 V는 최대 진폭이고 출력은 무부하 축전기 양단에서 읽습니다.","이상적인 일정한 R·C와 정현파 정상 상태를 가정합니다."]} interpretation="159 Hz 부근에서 출력은 0이 아니라 약 3.54 V 최대 진폭입니다." /><CitationBlock source="MIT OpenCourseWare 6.002, Lecture 18, ‘Filters’ (Fall 2000 자료), 2–3쪽" citeKey={1} href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/d4e136975654a01f7fc2c9b49196d376_6002_l18.pdf">원본 2–3쪽은 저항·축전기 분배식과 축전기 출력의 저역 통과 회로를 제시합니다. 1 kΩ·1 µF·5 V와 159.15 Hz는 강의 자료의 실험값이 아니라 이 글의 가정 계산입니다.</CitationBlock></section>
    <section id="db" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">비율을 dB로 바꾸면 큰 범위를 함께 볼 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="leading-7">저주파에서 출력÷입력은 거의 1입니다. 경계에서는 약 0.707, 경계의 열 배에서는 약 0.0995입니다. 0에서 1 사이의 비를 긴 주파수 범위에 표시하려고 <strong>데시벨 dB</strong>을 씁니다. 전압 진폭 비 A의 값은 20 log<sub>10</sub>(A) dB입니다. 같은 기준과 임피던스 조건에서 전력비로 바꿀 때의 10 log와 섞지 않아야 합니다.</p>
      <p className="leading-7">A=1이면 0 dB, 0.707이면 약 −3.01 dB, 0.1이면 −20 dB입니다. 음수 dB는 출력 진폭이 입력보다 작다는 뜻이지 음수 전압이라는 뜻이 아닙니다. 이번 회로에서 경계의 열 배인 약 1591.5 Hz는 −20.043 dB, 출력 최대 진폭 약 0.50 V입니다.</p>
      <p className="leading-7"><em>dB 눈금은 비율을 읽는 다른 자입니다. 부호는 진폭 자체의 방향을 나타내지 않습니다.</em></p>
    </div><ExplainedFormula question="경계에서 0.707배인 출력을 dB로 쓰면?" idea="같은 전압 기준의 최대 진폭 비에 20 log₁₀을 적용합니다." formula={String.raw`G_{\mathrm{dB}}=20\log_{10}|H|`} annotatedFormula={String.raw`\underbrace{G_{\mathrm{dB}}}_{\text{진폭비의 dB}}=20\log_{10}|H|`} operations={[{expression:String.raw`|H(\omega_c)|=1/\sqrt2`,annotation:"경계의 진폭 비입니다."},{expression:String.raw`20\log_{10}(1/\sqrt2)\approx-3.01\,\mathrm{dB}`,annotation:"출력이 사라지는 것이 아닙니다."},{expression:String.raw`20\log_{10}(0.1)=-20\,\mathrm{dB}`,annotation:"전압 진폭이 10분의 1이면 −20 dB입니다."}]} terms={[{symbol:"H",name:"출력÷입력",description:"무차원 복소 비의 크기를 씁니다."},{symbol:"G",name:"진폭비 dB",description:"두 최대 진폭을 같은 방식으로 잰 비입니다."}]} assumptions={["입력과 출력은 같은 주파수의 정현파 최대 진폭입니다.","전압 진폭 비를 표시합니다. 전력비의 기준은 별도입니다."]} interpretation="경계의 −3.01 dB는 5 V 최대 입력에서 출력 약 3.54 V에 해당합니다." /></section>
    <section id="plot" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">한 칸에 열 배씩 놓으면 기울기가 드러납니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="leading-7">가로축의 한 칸을 주파수 열 배인 <strong>한 decade</strong>로 놓고, 세로축에 dB와 위상을 각각 표시한 그림이 <strong>보드 선도</strong>입니다. 이 회로에서 0.1f<sub>c</sub>는 약 −0.043 dB·−5.7°, f<sub>c</sub>는 −3.01 dB·−45°, 10f<sub>c</sub>는 −20.043 dB·−84.3°입니다. 열 배씩 오른쪽으로 갈수록 축전기 출력이 작아지고 더 늦습니다.</p>
      <p className="leading-7">경계보다 훨씬 위에서는 |H|≈1/(ωRC)라서 주파수를 열 배 올리면 출력 비가 거의 10분의 1, 약 −20 dB가 됩니다. 하지만 f<sub>c</sub>에서 10f<sub>c</sub>까지는 −3.01에서 −20.043 dB로 약 −17.03 dB 차이입니다. <strong>−20 dB/dec는 높은 주파수의 근사 기울기</strong>입니다. 10f<sub>c</sub>에서 100f<sub>c</sub>로 가면 약 −19.96 dB만큼 바뀌어 근사치에 가까워집니다.</p>
      <p className="leading-7"><em>기울기를 쓸 때는 정확한 곡선과 멀리서 그은 근사선을 구분합니다.</em></p>
    </div><BodeViz /><CitationBlock source="MIT OpenCourseWare 6.002, Lecture 17, ‘The Impedance Model’ (Fall 2000 자료), 4쪽" citeKey={2} href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/66adf4d4611a57b949efa1b00a842a46_6002_l17.pdf">공식 강의안 4쪽의 RC 전달 함수와 진폭·위상 식을 주파수별로 계산했습니다. dB 수치와 −17.03 dB 비교는 그 식에 본문 가정값을 대입한 결과입니다.</CitationBlock></section>
    <section id="other-output" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">출력 위치를 바꾸면 통과하는 쪽도 바뀝니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="leading-7">같은 1 kΩ과 1 µF라도 입력에서 축전기를 먼저 지나 저항을 접지에 잇고, 저항 양단에서 출력을 읽으면 <strong>고역 통과 필터</strong>가 됩니다. 전류가 아주 천천히 바뀌면 축전기 임피던스의 크기가 커서 저항에 전압이 거의 남지 않습니다. 빨라지면 저항 출력이 입력에 가까워집니다. 새로운 출력 비는 jωRC/(1+jωRC)입니다.</p>
      <p className="leading-7">0.1f<sub>c</sub>, f<sub>c</sub>, 10f<sub>c</sub>에서 저항 출력의 진폭 비는 각각 약 0.0995, 0.707, 0.995입니다. 경계는 여전히 약 159 Hz이며, 어느 쪽을 출력으로 삼는지가 통과 방향을 결정합니다. 실제 측정에는 부하와 신호원의 저항이 붙을 수 있어 이 단순 수치가 변합니다.</p>
      <p className="leading-7"><em>필터 이름은 R·C만 보고 정할 수 없고, 어디에 입력을 걸어 어디서 출력을 읽는지까지 필요합니다.</em></p>
    </div><CitationBlock source="MIT OpenCourseWare 6.002, Lecture 18, ‘Filters’ (Fall 2000 자료), 7쪽" citeKey={3} href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/d4e136975654a01f7fc2c9b49196d376_6002_l18.pdf">원본 7쪽은 저역·고역 통과의 서로 다른 연결과 주파수 응답 모양을 나란히 보입니다. 본문의 고역 통과 수치는 같은 이상 부품을 재배치해 저항 양단을 읽는 별도의 가정입니다.</CitationBlock></section>
    <section id="limits" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">실제 필터의 경계는 연결된 회로가 다시 정합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="leading-7">이 그림은 무부하·이상 소자·한 주파수 정현파가 충분히 오래 유지되는 경우입니다. 축전기에 부하를 달면 전류가 갈라져 분배식이 달라지고, 실제 축전기의 누설·직렬 저항·기생 성분은 높은 주파수의 모습까지 바꿉니다. 경계 주파수 하나가 모든 신호의 품질을 보장하지는 않습니다.</p>
      <p className="leading-7">센서의 느린 온도 변화와 빠른 전기 잡음처럼 무엇을 통과시킬지 정할 때, 관심 신호와 잡음의 주파수 범위를 먼저 측정합니다. 펄스에는 여러 주파수가 섞이고 시작 과도도 있으므로, 보드 선도의 한 점만으로 시간 파형 전체를 알 수 없습니다. 다음 글은 이 필터를 증폭기 뒤에 되돌려 연결할 때 안정성이 어떻게 달라지는지 봅니다.</p>
      <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 159 Hz에서 5 V가 0 V가 됩니까? (답: 2절) f<sub>c</sub>→10f<sub>c</sub>가 정확히 −20 dB입니까? (답: 4절) 출력 위치를 바꾸면 느린 신호는 어느 쪽에서 작아집니까? (답: 5절)</p>
      <p className="leading-7"><Link to="/electronics/circuits/steady-state-and-impedance#divider">앞 글의 한 주파수 분배 계산</Link>으로 돌아가면 선도의 모든 점을 따로 검산할 수 있습니다.</p>
    </div></section>
  </div>;
}
