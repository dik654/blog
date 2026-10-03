import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SwitchingEnergyViz from "./switching-energy-and-leakage/viz/SwitchingEnergyViz";

/** All numerical values below describe an invented CMOS inverter, not a product. */
export default function SwitchingEnergyAndLeakageArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">가만히 있을 때와 뒤집을 때를 따로 셉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">앞 글에서는 전극이 만든 전자 길의 전류를 계산했습니다. 이제 그 소자로 만든 디지털 출력 하나를 봅니다. 값이 바뀔 때는 다음 회로의 전극과 배선을 충전해야 합니다. 값이 그대로여도 실제 칩에서는 작은 전류가 남습니다. 둘을 한데 묶어 ‘전력’이라고 부르면 어느 부분을 줄여야 할지 알기 어렵습니다.</p>
          <p className="leading-7">출력이 0 V와 3.3 V 사이를 오가는 작은 회로를 <strong>가정</strong>합니다. 충전할 용량은 10 pF, 기준 주기는 초당 100만 번입니다. 그중 열 번에 한 번만 출력이 올라갔다 내려온다면 초당 10만 번 충전·방전합니다. 0 V에서 3.3 V로 올렸다 다시 0 V로 내리는 한 쌍에 108.9 pJ가 듭니다. 꺼져 있을 때 공급선에서 1 µA가 샌다는 가정도 더하면 평균 전력은 14.19 µW입니다. 이 숫자가 어디서 나오는지 에너지의 행방을 따라가겠습니다.</p>
          <p className="leading-7"><em>핵심 질문은 한 번 바꾸는 비용과 바꾸지 않을 때의 비용을 어떻게 분리하는가입니다.</em></p>
        </div>
      </section>

      <section id="two-paths" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">위쪽 길이 채우고 아래쪽 길이 비웁니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">두 스위치를 위아래로 잇고 그 사이에 출력을 둡니다. 위쪽은 3.3 V 공급선, 아래쪽은 0 V에 닿습니다. 입력이 낮으면 위쪽 길이 열려 출력 쪽 용량이 충전됩니다. 입력이 높으면 위쪽이 닫히고 아래쪽 길이 열려 축적된 전하가 빠져나갑니다. 두 길이 안정된 상태에서 동시에 열리지 않는 구조를 <strong>상보형 CMOS 인버터</strong>라고 합니다. 위쪽은 pMOS, 아래쪽은 nMOS이며, 출력은 입력을 뒤집습니다.</p>
          <p className="leading-7">여기서 부하 용량 10 pF는 다음 게이트의 입력, 출력 배선, 이 회로의 접합이 합쳐진 <strong>가상값</strong>입니다. 앞 글의 100 µm² 절연층 용량 0.345 pF를 그대로 옮긴 숫자가 아닙니다. 둘은 다른 회로 사례입니다. 출력을 3.3 V로 올리는 전하는 C×V=33 pC이고, 그때 용량에 남은 에너지는 ½CV²=54.45 pJ입니다.</p>
          <p className="leading-7"><em>출력이 높아졌을 때 남은 54.45 pJ만 보면, 공급원이 실제로 낸 에너지의 절반을 놓칩니다.</em></p>
        </div>
      </section>

      <section id="energy-ledger" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">33 pC가 움직인 동안 108.9 pJ를 냅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
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

      <section id="activity" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">매 기준 주기마다 바뀌지는 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
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
        />
      </section>

      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">전압을 낮출 때는 속도와 누설도 바뀝니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">위 식에서 다른 값을 수학적으로 고정하고 공급 전압만 3.3 V에서 1.8 V로 낮추면 동적 전력은 10.89 µW에서 3.24 µW로 줄어듭니다. 제곱으로 줄기 때문입니다. 그러나 실제 칩에서는 구동 전류와 지연, 잡음 여유, 누설도 함께 변합니다. 따라서 3.24 µW에 기존 대기 전력 3.3 µW를 기계적으로 더해 새 총 전력을 예측할 수 없습니다. 전압을 낮춰도 요구된 동작 속도를 지키는지 확인해야 합니다.</p>
          <p className="leading-7">실제 전력에는 두 소자가 전환 중 잠깐 함께 켜지는 전류, 내부 노드 충전, 입력 신호의 완만한 경계, 온도에 따라 달라지는 누설도 있습니다. 회로 전체로 확장할 때는 각 노드의 용량과 실제 상승 횟수를 세고, 데이터시트나 측정으로 대기 전류와 전환 손실을 확인합니다. 이 글의 14.19 µW는 그 절차를 보여 주는 한 출력의 가상 계산값입니다.</p>
          <p className="leading-7"><em>용량·전압·움직이는 횟수는 전환 비용을, 실제 누설 전류는 멈춘 상태의 비용을 정합니다.</em></p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">소자의 전력에서 실리콘의 제작으로 갑니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7"><Link to="/electronics/devices/mosfet-regions-and-transfer#limits">앞 글의 이상 MOSFET과 실제 누설의 차이</Link>는 이 글의 대기 전력 항으로 들어왔습니다. 이제 이 소자들을 같은 실리콘에 반복해서 만드는 공정으로 넘어갑니다. 층을 쌓고 패턴을 남기는 방식이 왜 필요한지부터 보겠습니다.</p>
          <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 충전 뒤 54.45 pJ만 남는데 공급원은 왜 108.9 pJ를 냅니까? (답: 3절) 출력이 전혀 안 바뀌면 가정한 전력은 얼마입니까? (답: 4절) 전압을 낮춘 뒤 왜 총 전력을 곧바로 계산할 수 없습니까? (답: 5절)</p>
        </div>
      </section>
    </div>
  );
}
