import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import StorageTransientViz from "./storage-elements-and-transients/viz/StorageTransientViz";

/** Invented paired 5 V examples: RC=1 kΩ×1 µF, L/R=1 H/1 kΩ, both 1 ms. */
export default function StorageElementsAndTransientsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">스위치를 닫아도 출력은 한순간에 도착하지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">앞의 저항 회로에서는 값이 바뀐 뒤 전압과 전류가 어느 숫자에 멈추는지 계산했습니다. 그런데 전하를 담는 두 판이나 자기장을 만드는 감은 선을 추가하면, 스위치를 닫은 <em>직후</em>와 오래 지난 뒤의 상태가 다릅니다. 지금 가진 에너지가 다음 순간의 전압이나 전류를 제한하기 때문입니다.</p>
          <p className="leading-7">두 <strong>가상 회로</strong>에 5 V 전원과 1 kΩ을 공통으로 놓습니다. 첫 회로의 저장 부품은 1 µF이며 처음 전압이 0 V입니다. 스위치를 닫아도 그 부품의 전압은 즉시 5 V가 되지 않고 1 ms 뒤 약 3.16 V입니다. 두 번째 회로에는 다른 저장 부품 1 H를 넣고 처음 전류를 0으로 둡니다. 전류는 즉시 최종 5 mA가 되지 않고 똑같이 1 ms 뒤 약 3.16 mA입니다. 무엇이 이어져야 하고 그 1 ms가 어디서 나오는지 살펴봅니다.</p>
          <p className="leading-7"><em>이 글의 질문은 스위치를 바꾼 뒤 이전 상태가 얼마나 오래 남는가입니다.</em></p>
        </div>
      </section>

      <section id="capacitor" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">두 판 사이에는 전하가 쌓인 만큼 전압이 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">서로 닿지 않는 두 도체 판에 전하를 모으면 두 판 사이 전압이 생깁니다. 이 부품을 <strong>축전기</strong>라고 합니다. 저장 전하 q와 전압 v의 비례값인 <strong>정전용량 C</strong>가 1 µF라면 전압을 1 V 올릴 때 1 µC의 전하가 필요합니다. 전류는 초당 이동한 전하이므로 i=C·dv/dt입니다. 처음 0 V였던 전압을 단 한순간에 5 V로 올리려면 이 이상 모형에서는 무한히 큰 순간 전류가 필요합니다. 유한한 전원과 저항에서는 전압이 이어져 변합니다.</p>
          <p className="leading-7">전압 5 V까지 채워졌을 때는 5 µC가 남고 저장 에너지는 ½Cv²=12.5 µJ입니다. 전원이 끊겨도 전하가 빠질 길이 없으면 그 전압이 한동안 남습니다. 다만 실제 축전기에는 누설이 있어 영원히 유지되지는 않습니다. 여기서는 이상적인 축전기로 시간 변화를 먼저 계산합니다.</p>
          <p className="leading-7"><em>축전기의 직전 전압이 다음 순간의 출발점입니다.</em></p>
        </div>
      </section>

      <section id="rc" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 V까지 남은 차이가 충전 속도를 정합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">스위치를 닫은 뒤 전원 5 V에서 축전기 전압 v를 빼면 저항에 걸리는 전압입니다. 따라서 저항 전류는 (5−v)/1 kΩ입니다. 그 전류가 축전기를 채우므로 동시에 C·dv/dt이기도 합니다. 처음에는 v=0이라 5 mA가 흐르고, v가 커질수록 남은 전압 차이와 전류가 줄어듭니다. 이 감소 때문에 직선으로 올라가는 대신 마지막 5 V에 점점 가까워집니다.</p>
          <p className="leading-7">1 kΩ×1 µF=1 ms를 <strong>시간 상수 τ</strong>라고 합니다. 1 ms 뒤 남은 차이는 처음 5 V의 e<sup>−1</sup>, 약 36.8%입니다. 그래서 도착한 전압은 5×(1−e<sup>−1</sup>)≈3.16 V이고 저항 전류는 약 1.84 mA입니다. 3 ms 뒤에는 약 4.75 V이고 약 0.25 mA가 남습니다. ‘3τ면 완전히 충전’이라는 뜻은 아니며 아직 약 5%가 남습니다.</p>
          <p className="leading-7"><em>시간 상수 하나는 변화가 끝나는 시각이 아니라 남은 차이가 약 36.8%가 되는 시각입니다.</em></p>
        </div>
        <StorageTransientViz />
        <ExplainedFormula
          question="처음 0 V인 1 µF가 1 ms 뒤 몇 V까지 올라갑니까?"
          idea="남은 전압 차이가 현재 차이에 비례해 줄어들므로 5 V를 향하는 지수 응답입니다."
          formula={String.raw`v_C(t)=V_s\left(1-e^{-t/(RC)}\right)`}
          annotatedFormula={String.raw`\underbrace{v_C(t)}_{\text{축전기 전압}}=V_s\left(1-e^{-t/(RC)}\right)`}
          operations={[
            { expression: String.raw`\tau=RC=1\,\mathrm{ms}`, annotation: "1 kΩ×1 µF입니다." },
            { expression: String.raw`v_C(\tau)\approx3.16\,\mathrm V`, annotation: "5 V의 약 63.2%입니다." },
            { expression: String.raw`i(\tau)\approx1.84\,\mathrm{mA}`, annotation: "남은 1.84 V를 1 kΩ으로 나눕니다." },
          ]}
          terms={[
            { symbol: "v_C", name: "축전기 전압", description: "스위치를 닫은 뒤 두 판 사이에 쌓이는 전압입니다." },
            { symbol: "R,C", name: "저항과 용량", description: "이 사례에서 각각 1 kΩ과 1 µF입니다." },
            { symbol: "V_s", name: "전원 전압", description: "스위치를 닫으면 걸리는 가정한 5 V입니다." },
            { symbol: "t", name: "닫은 뒤 시간", description: "스위치를 닫은 순간을 0으로 둡니다." },
          ]}
          assumptions={["처음 축전기 전압은 0 V이고 전원은 이상적인 5 V 계단입니다.", "저항·용량은 일정하며 배선 지연과 축전기 누설을 무시합니다."]}
          interpretation="1 ms는 완성 시각이 아닙니다. 이때 전압은 약 3.16 V이고 남은 차이는 1.84 V입니다."
        />
        <CitationBlock source="MIT OpenCourseWare 6.002, Lecture 12, ‘Capacitors and First-Order Systems’ (Fall 2000 자료), 4–5·10–11쪽" citeKey={1} href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/84f4b553fc6a1ddd7007465041c4e213_6002_l12.pdf">
          원본 강의안 4–5쪽의 q=Cv·i=C dv/dt·저장 에너지, 10–11쪽의 RC 시간 상수와 초기 조건을 확인했습니다. 이 글의 5 V·1 kΩ·1 µF는 강의안 실험값이 아니라 같은 원리를 따라 계산한 가정입니다.
        </CitationBlock>
      </section>

      <section id="inductor" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">감은 선에는 전류가 만든 자기장 에너지가 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">이번에는 5 V 전원과 1 kΩ에 감은 선 하나를 직렬로 놓습니다. 전류가 지나면 자기장이 생기고 에너지가 쌓입니다. 이를 <strong>인덕터</strong>라고 하며, 자기장과 전류를 잇는 값이 <strong>인덕턴스 L</strong>입니다. 전류를 바꿀 때 양끝에 필요한 전압은 v<sub>L</sub>=L·di/dt입니다. 유한한 5 V로 0에서 5 mA까지 전류를 한순간에 뛰게 할 수 없으므로, 처음 전류 0에서 이어져 증가합니다.</p>
          <p className="leading-7">가정한 L=1 H와 R=1 kΩ이면 L/R=1 ms입니다. 처음에는 전류가 0이라 저항의 전압 강하도 0이고 5 V가 인덕터에 걸립니다. 시간이 지나 전류가 커지면 저항 강하가 늘고 인덕터를 바꿀 전압은 줄어듭니다. 1 ms 뒤 전류는 최종 5 mA의 약 63.2%인 3.16 mA입니다. 오래 지나면 전류 5 mA, 이상 인덕터 양끝 전압 0 V이며, 자기장 저장 에너지는 ½Li²=12.5 µJ입니다.</p>
          <p className="leading-7"><em>축전기는 전압을, 인덕터는 전류를 스위치 직후에도 이어 가는 상태로 가집니다.</em></p>
        </div>
        <ExplainedFormula
          question="같은 5 V·1 kΩ에 1 H를 잇고 1 ms가 지나면 전류는?"
          idea="전원 5 V는 저항 강하 Ri와 인덕터 변화 전압 L·di/dt로 나뉩니다."
          formula={String.raw`i_L(t)=\frac{V_s}{R}\left(1-e^{-Rt/L}\right)`}
          annotatedFormula={String.raw`\underbrace{i_L(t)}_{\text{인덕터 전류}}=\frac{V_s}{R}\left(1-e^{-Rt/L}\right)`}
          operations={[
            { expression: String.raw`\tau_L=L/R=1\,\mathrm{ms}`, annotation: "1 H÷1 kΩ입니다." },
            { expression: String.raw`i_L(\tau_L)\approx3.16\,\mathrm{mA}`, annotation: "최종 5 mA의 약 63.2%입니다." },
            { expression: String.raw`E_L(\infty)=12.5\,\mathrm{\mu J}`, annotation: "½×1 H×(5 mA)²입니다." },
          ]}
          terms={[
            { symbol: "i_L", name: "인덕터 전류", description: "감은 선을 지나며 자기장을 만드는 전류입니다." },
            { symbol: "L", name: "인덕턴스", description: "가정한 1 H이며 전류 변화에 필요한 전압을 정합니다." },
            { symbol: "R", name: "직렬 저항", description: "가정한 1 kΩ이고 최종 전류는 5 V/R입니다." },
            { symbol: "V_s", name: "전원 전압", description: "스위치를 닫으면 걸리는 가정한 5 V입니다." },
          ]}
          assumptions={["처음 인덕터 전류 0, 이상적인 5 V 계단·1 H·1 kΩ을 둡니다.", "감은 선 자체의 저항·포화·기생 용량은 뺍니다."]}
          interpretation="1 ms 뒤 전류는 약 3.16 mA입니다. 축전기 전압과 같은 63.2%가 나오지만 이어지는 물리량은 전류입니다."
        />
        <CitationBlock source="MIT OpenCourseWare 8.02, Chapter 11, ‘Inductance’ (Spring 2007), 10·17–19쪽" citeKey={2} href="https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2007/f5c35823a7faac0d893754ab42804e7e_chap11inductance.pdf">
          공식 강의 자료 10쪽 식 (11.3.4)의 자기장 저장 에너지 ½Li², 17–18쪽의 RL 상승식과 τ=L/R, 19쪽의 저항 열과 저장 에너지 장부를 확인했습니다. 강의 자료의 회로 수치와 본문의 1 H·1 kΩ·5 V 가상 사례를 구분합니다.
        </CitationBlock>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 1 ms라도 저항을 바꾸면 반대로 움직입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">두 회로의 1 ms는 우연히 같게 고른 가정입니다. 저항을 2 kΩ으로 늘리고 저장 부품을 그대로 두면 축전기 회로의 τ=RC는 2 ms로 길어집니다. 전하가 들어오는 길이 더 막히기 때문입니다. 인덕터 회로의 τ=L/R은 0.5 ms로 짧아집니다. 이 회로는 저항이 더 클수록 최종 전류도 5 V/2 kΩ=2.5 mA로 작아집니다. 같은 ‘저항 증가’라도 무엇을 저장해 어떤 상태를 보는지에 따라 시간의 방향이 다릅니다.</p>
          <p className="leading-7">실제 축전기는 누설과 직렬 저항, 인덕터는 권선 저항과 코어 포화가 있습니다. 스위치를 매우 빠르게 바꾸거나 배선이 길면 기생 성분도 보입니다. 여기의 지수식은 저장 부품 하나와 일정한 저항·전원을 둔 첫 차수 회로에서 출발한 값입니다. 저장 요소가 둘이면 서로 에너지를 주고받아 흔들리기도 하므로 지수 하나로 충분하지 않습니다.</p>
          <p className="leading-7"><em>시간 상수는 부품 이름의 속성이 아니라, 저장된 상태가 빠져나가거나 채워지는 회로 전체 경로의 값입니다.</em></p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">주기적으로 흔들면 지연을 다른 언어로 읽습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7"><Link to="/electronics/circuits/resistance-and-power-dissipation#heat">앞 글의 저항 열</Link>은 이번에도 에너지가 빠져나가는 길이었습니다. 이제 한 번의 스위치 대신 입력을 계속 흔들면 저장 부품의 전압·전류가 얼마나 늦고 얼마나 작아지는지 살펴볼 수 있습니다. 다음 글은 그 반복 응답을 주파수와 임피던스로 표현합니다.</p>
          <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 축전기의 1 ms 뒤 전압이 왜 최종값의 63.2%입니까? (답: 3절) 인덕터가 스위치 직후 이어 가는 것은 전압과 전류 중 무엇입니까? (답: 4절) 저항을 두 배로 하면 두 회로의 시간 상수는 각각 어떻게 됩니까? (답: 5절)</p>
        </div>
      </section>
    </div>
  );
}
