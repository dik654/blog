import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ImpedanceViz from "./steady-state-and-impedance/viz/ImpedanceViz";

/** Invented sinusoidal RC case: 1 kΩ, 1 µF, 5 V peak, ω=1000 rad/s. */
export default function SteadyStateAndImpedanceArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 5 V라도 빠르게 흔들면 덜 따라옵니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">앞 글은 5 V 전원을 한 번 켠 뒤 1 kΩ과 1 µF의 전압이 1 ms에 걸쳐 올라가는 장면이었습니다. 이제 전원을 계속 올렸다 내리면 두 판에 전하가 쌓일 시간과 빠질 시간이 번갈아 생깁니다. 얼마나 크게 따라오는지와 얼마나 늦는지를 매 순간 미분하지 않고 한 번에 계산할 방법이 필요합니다.</p>
          <p className="leading-7">같은 <strong>가상 회로</strong>에 5 V <strong>최대 진폭</strong>의 매끈한 반복 입력을 겁니다. 초당 약 159번 왕복하도록 흔들면 축전기 양단의 최대 진폭은 약 3.54 V이고 입력보다 한 주기의 1/8만큼 늦습니다. 열 배 느리게 흔들면 약 4.98 V까지 따라오고, 열 배 빠르게 흔들면 약 0.50 V만 남습니다. 세 경우를 같은 1 kΩ·1 µF로 설명하겠습니다.</p>
          <p className="leading-7"><em>질문은 부품값이 같아도 반복 속도에 따라 출력 크기와 시각이 달라지는 이유입니다.</em></p>
        </div>
      </section>

      <section id="wave" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">반복 입력에서는 크기와 늦는 각도를 함께 적습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">입력이 5 cos(ωt) V라면 ω는 1초 동안 흔들리는 각도인 <strong>각주파수</strong>이고 단위는 rad/s입니다. ω=1000 rad/s는 ω/(2π)≈159 Hz, 한 왕복에 약 6.28 ms입니다. 출력 3.54 V는 순간 전압이 아니라 위아래로 흔들리는 <strong>최대 진폭</strong>입니다. 출력이 45° 늦으면 한 주기의 45/360=1/8, 약 0.785 ms 늦습니다.</p>
          <p className="leading-7">스위치를 막 켰을 때 남아 있던 초기 전압의 영향은 앞 글의 RC=1 ms에 따라 줄어듭니다. 그 자연스러운 과도 응답이 충분히 사라진 뒤, 입력과 같은 빈도로 계속 흔들리는 부분을 <strong>정현파 정상 상태</strong>라고 부릅니다. 지금부터의 진폭·각도 식은 이 상태를 다룹니다. 켠 직후의 전체 파형을 이 숫자 하나로 대신하지 않습니다.</p>
          <p className="leading-7"><em>반복 입력의 결과를 알려면 ‘얼마나 큰가’와 ‘얼마나 늦는가’ 두 숫자가 필요합니다.</em></p>
        </div>
      </section>

      <section id="complex" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">미분을 곱셈으로 바꿔 두 숫자를 묶습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">축전기는 전압이 바뀌는 빠르기에 따라 전류가 흐릅니다. i=C·dv/dt입니다. 코사인을 미분하면 크기에는 ω가 곱해지고 각도는 90° 앞으로 움직입니다. 크기와 각도를 한 쌍으로 계산하려고 <strong>복소수</strong>의 j를 씁니다. j를 곱하면 평면에서 90° 앞선 방향이 되고 j²=−1입니다. 실제 전압과 전류가 허수라는 뜻은 아닙니다. 계산이 끝나면 다시 실수 파형을 읽습니다.</p>
          <p className="leading-7">이때 전압 진폭을 전류 진폭으로 나눈 값에 각도 차이까지 담으면 <strong>임피던스 Z</strong>입니다. 저항은 Z<sub>R</sub>=R로 크기만 있고, 축전기는 Z<sub>C</sub>=1/(jωC), 인덕터는 Z<sub>L</sub>=jωL입니다. ω=1000 rad/s, C=1 µF이면 축전기는 −j1000 Ω입니다. 같은 ω에서 L=1 H라면 인덕터는 +j1000 Ω입니다. 크기는 같아도 각도 방향이 반대입니다. 앞 글에서 하나는 전압을 이어 가고 다른 하나는 전류를 이어 갔던 차이가 여기에도 나타납니다.</p>
          <p className="leading-7"><em>임피던스는 반복 입력에서 ‘전압÷전류’를 크기와 위상까지 포함해 적은 계산 값입니다.</em></p>
        </div>
        <ExplainedFormula
          question="초당 1000 rad로 흔들 때 1 µF의 임피던스는?"
          idea="i=C dv/dt에서 정현파 미분을 jω 곱셈으로 바꾸고 전압 진폭을 전류 진폭으로 나눕니다."
          formula={String.raw`Z_C=\frac{1}{j\omega C}`}
          annotatedFormula={String.raw`\underbrace{Z_C}_{\text{축전기 임피던스}}=\frac{1}{j\omega C}`}
          operations={[
            { expression: String.raw`\omega C=10^{-3}\,\mathrm{S}`, annotation: "1000 rad/s×1 µF이며 1/Ω 단위입니다." },
            { expression: String.raw`Z_C=-j1000\,\Omega`, annotation: "1/j=−j이므로 각도는 −90°입니다." },
            { expression: String.raw`Z_L=j1000\,\Omega`, annotation: "같은 속도에서 가정한 1 H는 반대 각도입니다." },
          ]}
          terms={[
            { symbol: "Z_C", name: "축전기 임피던스", description: "반복 입력의 전압·전류 크기 비와 각도 차이를 Ω로 나타냅니다." },
            { symbol: "j", name: "허수 단위", description: "j²=−1이며 곱하면 위상을 90° 앞당기는 계산 표시입니다." },
            { symbol: String.raw`\omega`, name: "각주파수", description: "가정한 1000 rad/s입니다." },
          ]}
          assumptions={["전압·전류가 같은 한 주파수의 정현파 정상 상태에 있습니다.", "C와 L은 일정한 이상 소자이며 시작 직후의 과도 응답은 사라졌습니다."]}
          interpretation="축전기의 −j1000 Ω은 1000 Ω의 크기와 −90°의 전압·전류 각도 차이를 함께 뜻합니다."
        />
        <CitationBlock source="MIT OpenCourseWare 6.002, Lecture 17, ‘The Impedance Model’ (Fall 2000 자료), 5–7쪽" citeKey={1} href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/66adf4d4611a57b949efa1b00a842a46_6002_l17.pdf">공식 강의안 5–7쪽은 정현파 정상 상태에서 저항 R, 축전기 1/(jωC), 인덕터 jωL을 전압·전류의 복소 진폭 관계로 묶습니다. −j1000 Ω과 +j1000 Ω은 강의안의 실측이 아니라 본문의 가정값을 대입한 결과입니다.</CitationBlock>
      </section>

      <section id="divider" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">저항과 축전기의 몫으로 출력을 구합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">저항 1 kΩ과 축전기 −j1000 Ω을 직렬로 놓았으므로 전체는 1000−j1000 Ω입니다. 복소평면에서 이 값의 길이는 √(1000²+1000²)≈1414 Ω입니다. 입력 최대 진폭 5 V를 나누면 전류 최대 진폭은 약 3.54 mA입니다. 축전기 양단의 출력은 그 전류에 −j1000 Ω을 곱하므로 최대 진폭이 3.54 V가 됩니다. 저항과 축전기를 각각 별도의 실수 1000 Ω으로 취급하면 각도를 놓칩니다.</p>
          <p className="leading-7">더 짧게는 축전기 몫 Z<sub>C</sub>/(R+Z<sub>C</sub>)=1/(1+jωRC)을 입력에 곱합니다. ωRC=1일 때 분모 1+j의 크기는 √2, 각도는 +45°입니다. 따라서 출력÷입력의 크기는 1/√2≈0.707, 출력 각도는 −45°입니다. 5 V×0.707≈3.54 V가 앞 계산과 맞습니다.</p>
          <p className="leading-7"><em>실수 저항 분배를 복소수로 옮기면 크기와 지연을 같은 계산에서 얻습니다.</em></p>
        </div>
        <ImpedanceViz />
        <ExplainedFormula
          question="ωRC=1에서 축전기 출력은 입력의 몇 배이며 얼마나 늦습니까?"
          idea="두 직렬 임피던스 중 출력에 걸린 축전기의 몫을 구하고 복소수의 길이·각도를 읽습니다."
          formula={String.raw`H(j\omega)=\frac{1}{1+j\omega RC}`}
          annotatedFormula={String.raw`\underbrace{H(j\omega)}_{\text{출력÷입력}}=\frac{1}{1+j\omega RC}`}
          operations={[
            { expression: String.raw`\omega RC=1`, annotation: "1000 rad/s×1 kΩ×1 µF입니다." },
            { expression: String.raw`|H|=1/\sqrt2\approx0.707`, annotation: "5 V 최대 진폭이 약 3.54 V가 됩니다." },
            { expression: String.raw`\angle H=-45^\circ`, annotation: "출력은 입력보다 한 주기의 1/8 늦습니다." },
          ]}
          terms={[
            { symbol: "H", name: "복소 진폭 비", description: "축전기 출력의 진폭과 위상을 입력에 대한 비로 담습니다." },
            { symbol: "R,C", name: "저항·용량", description: "가정한 1 kΩ과 1 µF입니다." },
          ]}
          assumptions={["출력은 축전기 양단에서 읽고, 5 V는 RMS가 아닌 최대 진폭입니다.", "정현파 정상 상태이며 선형·집중 소자 회로를 둡니다."]}
          interpretation="초당 약 159번 반복하면 출력 최대 진폭은 약 3.54 V, 위상은 −45°입니다."
        />
        <CitationBlock source="MIT OpenCourseWare 6.002, Lecture 17, ‘The Impedance Model’ (Fall 2000 자료), 4·7쪽" citeKey={2} href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/66adf4d4611a57b949efa1b00a842a46_6002_l17.pdf">원본 4쪽은 RC의 1/(1+jωRC) 진폭·위상 표현을, 7쪽은 축전기 임피던스를 쓴 전압 분배를 제시합니다. 이 글은 같은 식에 1 kΩ·1 µF·1000 rad/s를 넣어 0.707과 −45°를 계산했습니다.</CitationBlock>
      </section>

      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">정현파 하나일 때 간단해지는 도구입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">ω=100 rad/s라면 ωRC=0.1, 축전기 출력은 입력의 약 0.995배인 4.98 V이고 위상은 약 −5.7°입니다. ω=10000 rad/s라면 비는 약 0.0995, 출력은 약 0.50 V이고 위상은 약 −84.3°입니다. 반복이 느릴 때는 축전기가 거의 따라오고, 빠를 때는 전하를 채우기 전에 방향이 바뀌어 출력이 작아집니다. 이 관계를 여러 속도에 걸쳐 그리는 것이 다음 글의 주제입니다.</p>
          <p className="leading-7">임피던스 계산은 선형 소자에 한 주파수의 정현파를 가하고 과도 응답이 사라졌을 때 깔끔합니다. 한 번의 스위치, 급격한 펄스, 포화되는 인덕터, 전압에 따라 값이 바뀌는 축전기에는 주파수 하나만으로 전체 파형을 정할 수 없습니다. 펄스도 여러 정현파 성분으로 나누어 각 성분을 계산할 수 있지만, 시작 상태와 실제 소자 한계를 함께 봐야 합니다.</p>
          <p className="leading-7"><em>복소수는 실제 파형을 바꾸지 않고, 반복 응답의 크기와 시간을 한 쌍으로 계산해 주는 표현입니다.</em></p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 속도의 답을 여러 속도의 지도로 펼칩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7"><Link to="/electronics/circuits/storage-elements-and-transients#rc">앞 글의 1 ms 충전 시간</Link>은 이번 ωRC=1의 경계 속도와 이어집니다. 다음 글은 반복 속도를 넓게 바꾸며 출력 진폭과 위상을 그려, 어느 신호를 남길지 읽는 방법을 설명합니다.</p>
          <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> −j1000 Ω에서 j가 뜻하는 것은 무엇입니까? (답: 3절) 5 V 최대 진폭의 출력이 왜 약 3.54 V가 됩니까? (답: 4절) 스위치를 막 켠 순간에도 같은 3.54 V가 보장됩니까? (답: 2·5절)</p>
        </div>
      </section>
    </div>
  );
}
