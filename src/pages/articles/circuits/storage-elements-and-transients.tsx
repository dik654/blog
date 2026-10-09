import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import StorageTransientViz from "./storage-elements-and-transients/viz/StorageTransientViz";

import NumericPath from "../world-systems/NumericPath";

export default function StorageElementsAndTransientsArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 켠 직후와 오래 뒤를 이어 계산합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">5 V를 연결했는데 출력은 곧바로 5 V가 되지 않습니다. 1 ms 뒤에는 약 3.16 V, 3 ms 뒤에는 약 4.75 V입니다(가정). 입력이 같은데 시간이 지난 만큼 답이 달라지는 것은 회로 안에 직전의 상태가 남기 때문입니다.</p><p className="leading-7">
            따라서 최종값을 구한 뒤 그 값을 처음부터 대입하면 중간 과정을 잃습니다. 먼저 무엇이 저장되어 있는지 정하고 들어오는 양이 그 저장 상태를 얼마나 빨리 바꾸는지
            계산하겠습니다. 마지막에는 저장 방식 하나를 바꿔 같은 저항 변화가 왜 반대 결과를 내는지도 보겠습니다.
          </p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 상자에는 입력뿐 아니라 이전 상태도 필요합니다</h2>
<NumericPath title="이전 상태에서 다음 순간으로" steps={[{"label": "주어진 것", "value": "전원·연결·처음 상태", "detail": "처음 비어 있는지 이미 차 있는지 정합니다."}, {"label": "저장하는 장치", "value": "들어오는 만큼 변화", "detail": "직전 상태가 다음 순간에 이어집니다."}, {"label": "관측할 것", "value": "시간에 따른 출력", "detail": "직후·1 ms·오래 뒤를 따로 읽습니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            같은 5 V를 걸어도 이미 5 V가 남아 있던 장치와 처음 0 V인 장치는 출발점이 다릅니다. 입력만으로 현재 출력을 정하는 앞 글의 저항 회로에 과거를 담는 상태 하나가
            추가된 셈입니다.
          </p><p className="leading-7">이 상자에서는 시작 상태와 경과 시간을 빠뜨릴 수 없습니다. 이제 시작 상태를 0으로 고정해 작은 회로를 하나 열겠습니다.</p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 처음 0 V인 두 판에 5 V를 연결합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">다음은 모두 <strong>가정</strong>입니다. 5 V 전원 뒤에 1 kΩ 저항을 잇고, 그 뒤에 서로 닿지 않는 두 도체 판을 연결합니다. 두 판 사이 전압을 출력으로 읽습니다. 이 부품에는 전압 1 V를 올리는 데 전하 1 µC가 필요하며, 처음 전압은 0 V입니다.</p><p className="leading-7">스위치를 닫은 순간을 0으로 둡니다. 처음에는 저항에 5 V가 모두 걸려 5 mA가 들어옵니다. 출력이 올라갈수록 저항에 남는 전압 차이가 작아져 들어오는 속도가 느려집니다. 1 ms 뒤 3.16 V라는 답은 이 변화까지 센 결과입니다.</p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 공급·통로·저장·관측 위치를 따로 봅니다</h2>
<NumericPath title="같은 전류가 저장 상태를 바꿉니다" steps={[{"label": "공급", "value": "5 V 유지", "detail": "목표가 되는 양끝 차이입니다."}, {"label": "통로", "value": "1 kΩ", "detail": "5 V에서 현재 출력값을 뺀 차이가 걸립니다."}, {"label": "두 판에 저장", "value": "처음 0 V", "detail": "들어온 전하만큼 판 사이 차이가 커집니다."}, {"label": "관측", "value": "두 판 사이 전압", "detail": "1 ms 뒤 값을 읽습니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            통로를 지난 전하가 쌓이므로 통로의 흐름과 저장량의 변화는 같은 사건입니다. 저장량이 늘면 출력이 올라가고 출력이 올라가면 통로의 차이가 줄어듭니다. 이 되풀이가 상승 속도를
            점점 늦춥니다.
          </p><p className="leading-7">
            그림의 화살표를 신호가 한 번씩 처리되는 순서로 읽지는 않습니다. 전류와 전압은 같은 순간에 서로를 만족해야 합니다. 다음에는 왜 출력이 즉시 5 V로 뛸 수 없는지
            보겠습니다.
          </p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 유한한 속도로 채우므로 시간이 듭니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">0에서 5 V로 올리려면 전하 5 µC를 옮겨야 합니다. 시간이 아주 짧을수록 같은 양을 옮길 전류는 커져야 합니다. 그러나 이 회로의 첫 순간 전류는 5 mA이고 그 뒤에는 더 작아집니다. 시간이 0인 동안 유한한 전하를 한꺼번에 옮길 수 없습니다.</p><p className="leading-7">계속 5 mA로 채운다고 가정하면 1 ms에 5 µC가 들어갈 것입니다. 실제로는 채워지는 동안 전류가 줄기 때문에 1 ms에 5 V에 도착하지 않습니다. 이전 값과 남은 차이를 매 순간 함께 계산해야 하는 이유입니다.</p><p className="leading-7">
            이제 저장 부품과 그 성질에 이름을 붙이고 같은 1 ms를 식으로 얻겠습니다.
          </p></div>
</section>

<section id="capacitor" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 두 판의 저장 성질을 축전기와 정전용량으로 부릅니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">서로 닿지 않는 두 도체 판에 전하를 모으면 두 판 사이 전압이 생깁니다. 이 부품을 <strong>축전기</strong>라고 합니다. 저장 전하 q와 전압 v의 비례값인 <strong>정전용량 C</strong>가 1 µF라면 전압을 1 V 올릴 때 1 µC의 전하가 필요합니다. 전류는 초당 이동한 전하이므로 i=C·dv/dt입니다. 처음 0 V였던 전압을 단 한순간에 5 V로 올리려면 이 이상 모형에서는 무한히 큰 순간 전류가 필요합니다. 유한한 전원과 저항에서는 전압이 이어져 변합니다.</p>
          <p className="leading-7">전압 5 V까지 채워졌을 때는 5 µC가 남고 저장 에너지는 ½Cv²=12.5 µJ입니다. 전원이 끊겨도 전하가 빠질 길이 없으면 그 전압이 한동안 남습니다. 다만 실제 축전기에는 누설이 있어 영원히 유지되지는 않습니다. 여기서는 이상적인 축전기로 시간 변화를 먼저 계산합니다.</p>
          <p className="leading-7"><em>축전기의 직전 전압이 다음 순간의 출발점입니다.</em></p>
        </div>
</section>

<section id="trace" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 0 V에서 1 ms와 3 ms까지 같은 회로를 따라갑니다</h2>
<NumericPath title="충전 중의 전압과 전류 (가정)" steps={[{"label": "닫은 직후", "value": "0 V · 5 mA", "detail": "저항에 5 V가 남습니다."}, {"label": "1 ms 뒤", "value": "3.16 V · 1.84 mA", "detail": "저항에 약 1.84 V가 남습니다."}, {"label": "3 ms 뒤", "value": "4.75 V · 0.25 mA", "detail": "저항에 약 0.25 V가 남습니다."}, {"label": "아주 오래 뒤", "value": "5 V에 접근 · 0 mA에 접근", "detail": "같은 상태를 향해 점점 느려집니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">가운데 숫자들은 서로 따로 고른 값이 아닙니다. 매 순간 출력 v를 알면 전류는 (5−v)/1000 A이고, 그 전류가 다음 순간 출력의 변화를 정합니다. 같은 계산을 시간 전체에 적용한 식을 다음 절에서 유도합니다.</p><p className="leading-7">1 ms에서 3 ms로 시간이 세 배가 되어도 전압은 세 배가 되지 않습니다. 남은 차이 자체가 줄어들므로 상승 폭도 작아집니다. 그림의 상태를 직접 바꿔 보고 그 관계를 확인할 수 있습니다.</p></div><StorageTransientViz />
</section>

<section id="rc" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 원문의 변화식을 적분해 3.16 V와 1% 시간을 얻습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">MIT 6.002 Lecture 12의 6–7쪽 원문 식은 <code>RC·dvC/dt + vC = vI</code>입니다. 전류 (vI−vC)/R과 C·dvC/dt를 같게 두어 얻습니다. 이 회로에서는 vI=5 V, RC=0.001 s, vC(0)=0 V를 넣습니다.</p><p className="leading-7">남은 차이를 u=5−vC로 두면 du/dt=−u/(RC)입니다. 양변을 u로 나누고 0부터 t까지 적분하면 ln(u/5)=−t/(RC), 따라서 u=5e^(−t/RC)입니다. 출력은 5에서 이 남은 차이를 뺀 값입니다. <a href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/84f4b553fc6a1ddd7007465041c4e213_6002_l12.pdf#page=6" target="_blank" rel="noopener noreferrer">원문 6–7쪽의 방정식과 10–11쪽의 해</a>에 같은 초기 조건을 적용한 계산입니다.</p></div><div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            스위치를 닫은 뒤 전원 5 V에서 축전기 전압 v를 빼면 저항에 걸리는 전압입니다. 따라서 저항 전류는 (5−v)/1 kΩ입니다. 그 전류가 축전기를 채우므로 동시에
            C·dv/dt이기도 합니다. 처음에는 v=0이라 5 mA가 흐르고 v가 커질수록 남은 전압 차이와 전류가 줄어듭니다. 전류가 줄어들수록 전압의 상승 속도도 느려져 마지막 5
            V에 점점 가까워집니다.
          </p>
          <p className="leading-7">1 kΩ×1 µF=1 ms를 <strong>시간 상수 τ</strong>라고 합니다. 1 ms 뒤 남은 차이는 처음 5 V의 e<sup>−1</sup>, 약 36.8%입니다. 그래서 도착한 전압은 5×(1−e<sup>−1</sup>)≈3.16 V이고 저항 전류는 약 1.84 mA입니다. 3 ms 뒤에는 약 4.75 V이고 약 0.25 mA가 남습니다. ‘3τ면 완전히 충전’이라는 뜻은 아니며 아직 약 5%가 남습니다.</p>
          <p className="leading-7"><em>시간 상수 하나는 변화가 끝나는 시각이 아니라 남은 차이가 약 36.8%가 되는 시각입니다.</em></p>
        </div>

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
        </CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">최종값에서 1% 이내라는 조건은 남은 비율 e^(−t/τ)가 0.01 이하라는 뜻입니다. 로그를 취하면 t≥τ ln100≈4.605τ입니다. 이 회로에서는 약 4.605 ms 뒤부터 4.95 V 이상이 됩니다. 3τ에서 약 5%가 남는다는 설명과도 일치합니다.</p></div>
</section>

<section id="inductor" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 저장 방식을 바꾸면 원문에서 이어지는 변수도 바뀝니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">이번에는 5 V 전원과 1 kΩ에 감은 선 하나를 직렬로 놓습니다. 전류가 지나면 자기장이 생기고 에너지가 쌓입니다. 이를 <strong>인덕터</strong>라고 하며, 자기장과 전류를 잇는 값이 <strong>인덕턴스 L</strong>입니다. 전류를 바꿀 때 양끝에 필요한 전압은 v<sub>L</sub>=L·di/dt입니다. 유한한 5 V로 0에서 5 mA까지 전류를 한순간에 뛰게 할 수 없으므로, 처음 전류 0에서 이어져 증가합니다.</p>
          <p className="leading-7">
            가정한 L=1 H와 R=1 kΩ이면 L/R=1 ms입니다. 처음에는 전류가 0이라 저항의 전압 강하도 0이고 5 V가 인덕터에 걸립니다. 시간이 지나 전류가 커지면 저항 강하가
            늘고 인덕터를 바꿀 전압은 줄어듭니다. 1 ms 뒤 전류는 최종 5 mA의 약 63.2%인 3.16 mA입니다. 오래 지나면 전류 5 mA, 이상 인덕터 양끝 전압 0 V이며
            자기장 저장 에너지는 ½Li²=12.5 µJ입니다.
          </p>
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
        </CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">MIT 8.02 자료의 식 (11.4.7)은 <code>I(t)=(ε/R)(1−e^(−t/τ))</code>이며, 식 (11.4.8)은 τ=L/R입니다. ε에 5 V, R에 1000 Ω, L에 1 H, t에 0.001 s를 넣으면 (5 mA)(1−e^−1)=3.16 mA입니다. 앞 절의 3.16 V와 수의 모양은 같아도, 여기서 이어지는 상태와 출력의 단위는 전류입니다.</p><p className="leading-7">유도도 같은 남은 차이로 할 수 있습니다. 최종 전류 5 mA에서 현재 전류를 뺀 값을 u로 두면 du/dt=−(R/L)u입니다. 그 해 u=(5 mA)e^(−Rt/L)을 최종값에서 빼면 원문 식을 얻습니다. 이 과정에서 시간 상수가 RC에서 L/R로 바뀝니다.</p></div>
</section>

<section id="boundary" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 저항을 늘렸을 때 두 시간이 반대로 바뀌는 이유를 봅니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">두 회로의 1 ms는 우연히 같게 고른 가정입니다. 저항을 2 kΩ으로 늘리고 저장 부품을 그대로 두면 축전기 회로의 τ=RC는 2 ms로 길어집니다. 전하가 들어오는 길이 더 막히기 때문입니다. 인덕터 회로의 τ=L/R은 0.5 ms로 짧아집니다. 이 회로는 저항이 더 클수록 최종 전류도 5 V/2 kΩ=2.5 mA로 작아집니다. 같은 ‘저항 증가’라도 무엇을 저장해 어떤 상태를 보는지에 따라 시간의 방향이 다릅니다.</p>
          <p className="leading-7">실제 축전기는 누설과 직렬 저항, 인덕터는 권선 저항과 코어 포화가 있습니다. 스위치를 매우 빠르게 바꾸거나 배선이 길면 기생 성분도 보입니다. 여기의 지수식은 저장 부품 하나와 일정한 저항·전원을 둔 첫 차수 회로에서 출발한 값입니다. 저장 요소가 둘이면 서로 에너지를 주고받아 흔들리기도 하므로 지수 하나로 충분하지 않습니다.</p>
          <p className="leading-7"><em>시간 상수는 부품 이름의 속성이 아니라, 저장된 상태가 빠져나가거나 채워지는 회로 전체 경로의 값입니다.</em></p>
        </div>
</section>

<section id="handoff" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 다음 상태를 식 없이 먼저 예측해 봅니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7"><Link to="/electronics/circuits/resistance-and-power-dissipation#heat">앞 글의 저항 열</Link>은 이번에도 에너지가 빠져나가는 길이었습니다. 이제 한 번의 스위치 대신 입력을 계속 흔들면 저장 부품의 전압·전류가 얼마나 늦고 얼마나 작아지는지 살펴볼 수 있습니다. 다음 글은 그 반복 응답을 주파수와 임피던스로 표현합니다.</p>
          <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 축전기의 1 ms 뒤 전압이 왜 최종값의 63.2%입니까? (답: 8절) 인덕터가 스위치 직후 이어 가는 것은 전압과 전류 중 무엇입니까? (답: 9절) 저항을 두 배로 하면 두 회로의 시간 상수는 각각 어떻게 됩니까? (답: 10절)</p>
        </div>
</section>
</div>;
}
