import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SwitchingEnergyViz from "./switching-energy-and-leakage/viz/SwitchingEnergyViz";

import NumericPath from "../world-systems/NumericPath";

export default function SwitchingEnergyAndLeakageArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 한 번 뒤집는 비용과 가만히 두는 비용을 따로 셉니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">디지털 출력 하나가 낮은 전압에서 높은 전압으로 바뀌면 다음 회로와 배선을 충전해야 합니다. 값이 그대로인 동안에도 실제 소자에는 작은 전류가 흐릅니다. 두 비용의 원인이 다르므로 무엇을 줄일지도 따로 판단해야 합니다.</p><p className="leading-7">먼저 위쪽 길로 출력을 채우고 아래쪽 길로 비우는 한 회로를 보겠습니다. 한 번 왕복하는 동안 공급원이 낸 에너지가 어디로 가는지 추적합니다. 그 비용에 실제 왕복 횟수를 곱한 뒤 가만히 있을 때의 전력을 더하겠습니다.</p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 출력의 변화 횟수와 공급선의 전력을 비교합니다</h2>
<NumericPath title="같은 출력 하나를 관찰하기" steps={[{"label": "입력", "value": "낮음 ↔ 높음", "detail": "어느 길을 열지 바꿉니다."}, {"label": "회로", "value": "전하를 채우고 비우기", "detail": "출력과 연결된 용량에 전하를 옮깁니다."}, {"label": "결과", "value": "출력 전압·공급 에너지", "detail": "전압 변화와 비용을 함께 읽습니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">논리값이 정상적으로 뒤집혀도 공급선에서는 에너지가 소비됩니다. 출력 전압을 한 번 측정하는 것만으로는 그 비용을 알 수 없습니다. 이번에는 출력이 완전히 올라갔다 내려오는 횟수와 그때 공급선에서 이동한 전하를 세겠습니다.</p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 3.3 V 출력 하나가 초당 10만 번 왕복합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">모든 수치는 <strong>가정</strong>입니다. 공급 전압은 3.3 V이고 충전할 용량은 10 pF입니다. 초당 100만 번의 기준 주기 중 열 번에 한 번만 출력이 0 V에서 3.3 V로 올라갔다 다시 0 V로 내려옵니다. 따라서 완전한 왕복은 초당 10만 번입니다.</p><p className="leading-7">한 왕복에 공급원이 내는 에너지는 108.9 pJ입니다. 계속 바뀌는 비용을 초당으로 세면 10.89 µW입니다. 가만히 있을 때 공급선에 흐르는 1 µA도 가정하면 3.3 µW가 더해져 총 14.19 µW가 됩니다. 이 세 숫자를 같은 회로의 에너지 장부에서 얻겠습니다.</p><p className="leading-7">10 pF는 이 출력에 연결된 전체 용량을 새로 가정한 값입니다. 앞 글의 면적 100 µm²가 만든 절연층 용량 0.345 pF와 같은 부품을 가리키지 않습니다.</p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 위쪽 길은 채우고 아래쪽 길은 비웁니다</h2>
<NumericPath title="출력 전압 한 왕복" steps={[{"label": "출력 낮음", "value": "0 V", "detail": "아래쪽 길이 열려 있습니다."}, {"label": "채우기", "value": "위쪽 길 열기", "detail": "공급선에서 전하를 받아 출력이 3.3 V가 됩니다."}, {"label": "출력 높음", "value": "3.3 V", "detail": "전하가 용량에 저장되어 있습니다."}, {"label": "비우기", "value": "아래쪽 길 열기", "detail": "저장된 전하가 빠져 출력이 0 V로 돌아갑니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">각각 안정된 상태에서는 두 길 중 한쪽이 닫혀 있다고 단순화합니다. 전환 순간 두 길이 잠깐 함께 열릴 수 있다는 실제 효과는 뒤에서 더합니다. 지금은 출력의 충전과 방전만 따로 세는 첫 계산입니다.</p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 저장된 에너지와 공급한 에너지를 구별해야 합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            출력은 충전하는 동안 0 V에서 3.3 V로 올라가지만 공급선은 내내 3.3 V입니다. 공급선의 전하가 용량에 쌓이는 동안 용량의 전압은 계속 높아집니다. 그래서 공급 에너지
            전부가 용량에 남지 않습니다.
          </p><p className="leading-7">저항이 있는 위쪽 경로에서 나머지가 열로 바뀝니다. 아래쪽으로 방전할 때는 저장했던 에너지도 열이 됩니다. 충전 직후의 저장량만 보고 한 왕복의 비용이라고 하면 이미 위쪽에서 소비한 몫을 빠뜨립니다. 이 경로에 소자의 이름을 붙인 뒤 숫자로 검산하겠습니다.</p></div>
</section>

<section id="two-paths" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 두 길과 출력 반전에 이름을 붙입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">두 스위치를 위아래로 잇고 그 사이에 출력을 둡니다. 위쪽은 3.3 V 공급선, 아래쪽은 0 V에 닿습니다. 입력이 낮으면 위쪽 길이 열려 출력 쪽 용량이 충전됩니다. 입력이 높으면 위쪽이 닫히고 아래쪽 길이 열려 축적된 전하가 빠져나갑니다. 두 길이 안정된 상태에서 동시에 열리지 않는 구조를 <strong>상보형 CMOS 인버터</strong>라고 합니다. 위쪽은 pMOS, 아래쪽은 nMOS이며, 출력은 입력을 뒤집습니다.</p>
          <p className="leading-7">여기서 부하 용량 10 pF는 다음 게이트의 입력, 출력 배선, 이 회로의 접합이 합쳐진 <strong>가상값</strong>입니다. 앞 글의 100 µm² 절연층 용량 0.345 pF를 그대로 옮긴 숫자가 아닙니다. 둘은 다른 회로 사례입니다. 출력을 3.3 V로 올리는 전하는 C×V=33 pC이고, 그때 용량에 남은 에너지는 ½CV²=54.45 pJ입니다.</p>
          <p className="leading-7"><em>출력이 높아졌을 때 남은 54.45 pJ만 보면, 공급원이 실제로 낸 에너지의 절반을 놓칩니다.</em></p>
        </div>
</section>

<section id="energy-ledger" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 33 pC와 108.9 pJ의 행방을 끝까지 좇습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">충전하는 내내 공급 전압은 3.3 V이므로 공급원이 내는 에너지는 3.3 V×33 pC=108.9 pJ입니다. 그중 54.45 pJ가 용량에 저장되고, 나머지 54.45 pJ는 위쪽 소자의 저항성 경로에서 열로 사라집니다. 출력이 내려갈 때 공급원은 이 이상 모형에서 새 에너지를 내지 않습니다. 저장된 54.45 pJ가 아래쪽 소자에서 열이 됩니다. 따라서 출력의 0→1→0 <strong>완전한 한 주기</strong>에는 공급원에서 108.9 pJ가 나오고, 결국 모두 열이 됩니다.</p>
          <p className="leading-7">이 장부는 ‘충전 때 공급한 에너지’와 ‘순간에 용량에 저장된 에너지’를 구분합니다. 충전의 마지막만 찍어 저장 에너지 ½CV²를 스위칭 에너지로 쓰면 한 주기 비용을 절반으로 계산하게 됩니다. 여기서 출력 1은 3.3 V, 0은 0 V입니다.</p>
        </div>
        <ExplainedFormula
          question="가정한 출력이 한 번 올라갔다 내려오면 공급원은 얼마를 냅니까?"
          idea="충전 전하 CV가 일정한 공급 전압 V를 지나므로 공급 에너지는 CV²입니다. 방전에는 같은 양의 저장 에너지가 아래쪽 소자에서 사라집니다."
          formula={String.raw`E_{cycle}=C_L V_{DD}^{2}`}
          annotatedFormula={String.raw`\underbrace{E_{cycle}}_{\text{한 완전 주기}}=C_L V_{DD}^{2}`}
          operations={[
            { expression: String.raw`Q=C_LV_{DD}=33\,\mathrm{pC}`, annotation: "10 pF×3.3 V입니다." },
            { expression: String.raw`E_{cycle}=108.9\,\mathrm{pJ}`, annotation: "10 pF×(3.3 V)²입니다." },
          ]}
          terms={[
            { symbol: "E_{cycle}", name: "완전 출력 주기 에너지", description: "출력 0→1→0 한 쌍에 공급원이 낸 에너지입니다." },
            { symbol: "C_L", name: "부하 용량", description: "다음 입력과 배선·출력 접합을 합친 가정값 10 pF입니다." },
            { symbol: "V_{DD}", name: "공급 전압", description: "가정한 3.3 V입니다." },
          ]}
          assumptions={["이상적으로 0 V와 VDD 사이를 완전히 충전·방전합니다.", "전환 중 두 소자가 동시에 켜져 흐르는 단락 전류와 내부 노드 손실은 뺍니다."]}
          interpretation="한 번의 상승에 공급원에서 108.9 pJ가 나오고 그 절반은 잠시 저장됩니다. 하강까지 끝나면 108.9 pJ가 모두 소자에서 열이 됩니다."
        />
        <CitationBlock source="MIT OpenCourseWare 6.012, Lecture 14, ‘Digital Circuits (III): CMOS’ (2005), 22–24쪽" citeKey={1} href="https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2005/6bec6dd1b07b02a1a84098b78f068cc3_lec14.pdf">
          공식 강의안의 22쪽은 충전 때 공급 에너지 C<sub>L</sub>V<sub>DD</sub>²와 저장 에너지 ½C<sub>L</sub>V<sub>DD</sub>²를 구분합니다. 23쪽은 방전 때 저장 에너지가 아래쪽 소자에서 사라짐을, 24쪽은 완전한 주기당 C<sub>L</sub>V<sub>DD</sub>²와 평균 전력식을 적습니다. 10 pF·3.3 V는 강의안의 측정치가 아닌 본문 가정입니다.
        </CitationBlock>
</section>

<section id="source-integral" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 원문의 충전·방전 식에 같은 숫자를 넣습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">MIT 강의안 14의 22쪽에서 충전 중 공급 에너지는 <code>ES=CLVDD²</code>, 용량에 저장된 에너지는 <code>EC=½CLVDD²</code>입니다. 공급선은 일정하므로 ∫VDD·CL dv=CLVDD²입니다. 반면 용량의 순간 전압은 v이므로 ∫v·CL dv=½CLVDD²입니다. 두 적분의 범위는 모두 출력 전압 0에서 VDD까지입니다.</p><p className="leading-7">여기에 가정한 10 pF와 3.3 V를 넣으면 ES=108.9 pJ, EC=54.45 pJ입니다. 차이 54.45 pJ가 위쪽 소자에서 열이 됩니다. 원문 23쪽의 방전 단계에서는 공급 에너지가 0이고 저장했던 54.45 pJ가 아래쪽 소자에서 열이 됩니다.</p><p className="leading-7">24쪽의 완전 주기 식은 <code>ED=EP+EN=ΣES=CLVDD²</code>입니다. 본문에서는 위쪽 열 54.45와 아래쪽 열 54.45를 더해 108.9 pJ가 됩니다. 같은 왕복의 시작과 끝에서 저장량은 모두 0이므로 공급한 에너지와 총 열이 맞습니다.</p><p className="leading-7">이 결론은 일정한 전압 공급원에서 저항성 경로로 완전 충전·방전하는 가정에 해당합니다. 에너지를 공급원으로 돌려주는 별도 회로까지 모두 같은 소비량을 갖는다는 뜻은 아닙니다.</p></div>
</section>

<section id="activity" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 원문의 주기당 비용을 초당 횟수로 바꿉니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">기준 주기 1 MHz라고 해서 출력도 매번 0→1→0을 마치지는 않습니다. 여기서는 <strong>활동률 α</strong>를 ‘기준 주기 중 완전한 출력 한 쌍이 일어나는 비율’로 정의합니다. α=0.1이면 초당 100만 기준 주기 중 10만 번만 완전한 출력 주기가 생깁니다. 그래서 평균 동적 전력은 108.9 pJ×10만/s=10.89 µW입니다. 문헌에 따라 α를 0→1 전환 횟수/클록 주기로 정의하기도 합니다. 두 정의 모두 이 사례에서는 10만 번의 충전을 세지만, α를 토글 총수로 바꾸고 같은 식을 쓰면 두 배 오류가 납니다.</p>
          <p className="leading-7">한쪽 상태에서 멈춘 이상적인 상보형 회로는 직접적인 공급선 길이 끊어져 정적 전력이 0입니다. 실제 소자는 문턱 아래 전류와 접합·절연층을 통한 누설이 남습니다. 이 글의 대기 공급 전류 1 µA는 <strong>가정</strong>이며 온도, 공정, 전압, 입력 상태가 바뀌면 달라집니다. 3.3 V×1 µA=3.3 µW이므로 단순 합은 10.89+3.3=14.19 µW입니다.</p>
          <p className="leading-7"><em>활동률을 0으로 내려도 이 가정의 대기 전력 3.3 µW는 남습니다.</em></p>
        </div>
        <SwitchingEnergyViz />
        <ExplainedFormula
          question="활동률 10%와 가정한 누설을 합치면 평균 전력은 얼마입니까?"
          idea="초당 완전 출력 주기 수에 주기당 에너지를 곱하고, 대기 공급 전류가 만드는 전력을 따로 더합니다."
          formula={String.raw`P=\alpha f C_LV_{DD}^{2}+V_{DD}I_{leak}`}
          annotatedFormula={String.raw`P=\underbrace{\alpha f C_LV_{DD}^{2}}_{\text{바뀔 때}}+\underbrace{V_{DD}I_{leak}}_{\text{가만히 있을 때}}`}
          operations={[
            { expression: String.raw`P_{dyn}=10.89\,\mathrm{\mu W}`, annotation: "0.1×10⁶/s×108.9 pJ입니다." },
            { expression: String.raw`P_{idle}=3.3\,\mathrm{\mu W}`, annotation: "3.3 V×1 µA입니다." },
            { expression: String.raw`P=14.19\,\mathrm{\mu W}`, annotation: "두 가정값의 합입니다." },
          ]}
          terms={[
            { symbol: String.raw`\alpha`, name: "활동률", description: "이 글에서는 기준 주기당 완전 0→1→0 출력 주기의 비율 0.1입니다." },
            { symbol: "f", name: "기준 주기 빈도", description: "가정한 1 MHz입니다." },
            { symbol: "I_{leak}", name: "대기 공급 누설", description: "실측값이 아니라 이 사례에서 둔 1 µA입니다." },
          ]}
          assumptions={["대기 전류를 상태와 시간에 무관한 1 µA로 단순화합니다.", "전환 중 단락 전류와 내부 노드, 전압에 따른 지연·누설 변화는 제외합니다."]}
          interpretation="이 사례에서는 바뀌는 비용 10.89 µW와 가만히 있는 비용 3.3 µW를 별도로 줄여야 합니다."
        /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">가정한 용량만 절반인 5 pF로 바꾸고 전압·활동률·기준 주기를 유지하면 동적 전력은 5.445 µW입니다. 용량에 비례하기 때문입니다. 대기 전류까지 그대로 1 µA라고 추가로 가정하면 합은 8.745 µW입니다. 용량만 바꾼 사실로 누설이 같다고 보장할 수는 없습니다. 실제로 용량을 줄일 때는 다음 입력의 크기와 배선 조건, 신호가 도착하는 지연도 함께 확인해야 합니다.</p></div>
</section>

<section id="limits" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 전압을 바꾼 뒤에는 속도와 누설을 다시 확인합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">위 식에서 다른 값을 수학적으로 고정하고 공급 전압만 3.3 V에서 1.8 V로 낮추면 동적 전력은 10.89 µW에서 3.24 µW로 줄어듭니다. 제곱으로 줄기 때문입니다. 그러나 실제 칩에서는 구동 전류와 지연, 잡음 여유, 누설도 함께 변합니다. 따라서 3.24 µW에 기존 대기 전력 3.3 µW를 기계적으로 더해 새 총 전력을 예측할 수 없습니다. 전압을 낮춰도 요구된 동작 속도를 지키는지 확인해야 합니다.</p>
          <p className="leading-7">실제 전력에는 두 소자가 전환 중 잠깐 함께 켜지는 전류, 내부 노드 충전, 원하지 않은 짧은 출력 변화인 글리치, 입력 신호의 완만한 경계, 온도에 따라 달라지는 누설도 있습니다. 회로 전체로 확장할 때는 각 노드의 용량과 실제 상승 횟수를 세고, 데이터시트나 측정으로 대기 전류와 전환 손실을 확인합니다. 이 글의 14.19 µW는 그 절차를 보여 주는 한 출력의 가상 계산값입니다.</p>
          <p className="leading-7"><em>용량·전압·움직이는 횟수는 전환 비용을, 실제 누설 전류는 멈춘 상태의 비용을 정합니다.</em></p>
        </div>
</section>

<section id="handoff" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 같은 장부로 다음 결과를 예측합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7"><Link to="/electronics/devices/mosfet-regions-and-transfer#limits">앞 글의 이상 MOSFET과 실제 누설의 차이</Link>는 이 글의 대기 전력 항으로 들어왔습니다. 이제 이 소자들을 같은 실리콘에 반복해서 만드는 공정으로 넘어갑니다. 층을 쌓고 패턴을 남기는 방식이 왜 필요한지부터 보겠습니다.</p>
          <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 충전 뒤 54.45 pJ만 남는데 공급원은 왜 108.9 pJ를 냅니까? (답: 7·8절) 출력이 전혀 안 바뀌면 가정한 전력은 얼마입니까? (답: 9절) 전압을 낮춘 뒤 왜 총 전력을 곧바로 계산할 수 없습니까? (답: 10절)</p>
        </div>
</section>
</div>;
}
