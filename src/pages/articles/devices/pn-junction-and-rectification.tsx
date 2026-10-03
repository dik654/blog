import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import JunctionBiasViz from "./pn-junction-and-rectification/viz/JunctionBiasViz";

/**
 * 300 K, Is=1 pA, ideality factor 1 are educational assumptions. They are not
 * experimental measurements from Shockley's 1949 germanium junction paper.
 */
export default function PnJunctionAndRectificationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 접합에 전압의 방향만 바꿉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서 전자가 많은 실리콘과 빈자리인 정공이 많은 실리콘을 각각
            만들었습니다. 두 영역을 하나로 이어 붙이면 전압 방향에 따라 전류가
            크게 달라집니다. 기기의 전원 방향을 거꾸로 연결했을 때 흐름이
            같지 않은 이유를 이해하는 첫 장면입니다.
          </p>
          <p className="leading-7">
            숫자부터 보겠습니다. 온도 300 K, 뒤에서 설명할 전류 기준값 1 pA를
            둔 <strong>이상적인 가상 접합</strong>을 생각합니다(모두 이 글의 가정).
            한쪽 방향으로 0.5 V를 걸면 약 0.251 mA, 0.6 V를 걸면 약 12.03 mA가
            나옵니다. 반대 방향으로 0.5 V를 걸면 거의 −1 pA입니다. 0.1 V의
            차이가 왜 약 48배의 차이가 되는지를 한 접합만 따라가며 풀겠습니다.
          </p>
          <p className="leading-7">
            여기서 전류의 양수 방향은 정공이 많은 쪽에서 전자가 많은 쪽으로
            외부 전류가 흐르는 방향으로 잡습니다. 음수는 그 반대입니다. 이
            가상 숫자는 실제 제품의 정격이나 Shockley 논문의 측정값이 아닙니다.
          </p>
          <p className="leading-7"><em>이 가상 접합에서 0.1 V만 바꿔도 전류가 크게 달라집니다. 이제 두 영역을 붙인 직후부터 살펴보겠습니다.</em></p>
        </div>
      </section>

      <section id="diffusion" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">붙인 직후에는 양쪽 전하가 건너갑니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            두 영역을 붙이기 전에는 왼쪽에 정공, 오른쪽에 전자가 훨씬 많다고
            둡니다. 앞 글의 가정인 각 영역 10¹⁶ cm⁻³ 도핑과 300 K의 평형
            농도를 다시 씁니다. 오른쪽 전자는 왼쪽으로, 왼쪽 정공은 오른쪽으로
            퍼집니다. 사람이 붐비는 공간에서 빈 공간 쪽으로 이동하는 것과
            비슷하지만, 여기서는 전하를 띤 입자의 농도 차이입니다.
          </p>
          <p className="leading-7">
            이 움직임을 <strong>확산</strong>이라고 부릅니다. 경계로 건너간
            전자와 정공은 서로 만나 사라질 수 있습니다. 그 결과 경계 근처에는
            움직이는 전하가 벌크보다 적어집니다. 앞 글에서 도핑한 영역이
            거의 중성이라고 한 것은 접합에서 멀리 떨어진 자리의 말이었습니다.
            경계에서도 늘 중성이라고 놓으면 다음에 생길 전기장을 설명할 수 없습니다.
          </p>
          <p className="leading-7"><em>처음에는 전자가 n형에서 p형으로, 정공은 p형에서 n형으로 퍼집니다.</em></p>
        </div>
      </section>

      <section id="depletion" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">떠난 자리의 전하가 건넘을 막습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
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

      <section id="bias" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">바깥 전압이 그 장벽을 바꿉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
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
        <JunctionBiasViz />
      </section>

      <section id="calculation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">0.1 V 차이를 전류로 계산합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이제 첫 사례의 0.5 V와 0.6 V로 돌아갑니다. 300 K에서 전하량으로
            나눈 열에너지 kT/q는 약 25.85 mV입니다. 이 숫자를 전압의 비교
            눈금으로 쓰고, 가상 접합의 역방향 기준 전류를 1 pA라고 가정합니다.
            농도 10¹⁶ cm⁻³ 하나만으로 1 pA를 유도한 것은 아닙니다. 면적,
            확산 길이, 소수 캐리어 수명 같은 소자 조건이 더 필요합니다.
          </p>
          <p className="leading-7">
            Shockley의 1949년 원문 461쪽 식 (4.22)는 두 캐리어의 역방향
            포화 전류 성분을 더하고, 그 합에 지수 항을 곱합니다. 당시 원문은
            접합의 전류 성분을 분석한 것이며, 아래의 현대식 기호와 실리콘
            가상 수치는 교육용으로 다시 적은 것입니다.
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
          곱합니다. 여기서는 그 합을 I<sub>s</sub>, qv₀/kT를 V/V<sub>T</sub>로
          묶었습니다. 1 pA와 0.5·0.6 V는 원문의 측정값이 아닙니다.
        </CitationBlock>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
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

      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">정해진 문턱 전압은 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
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

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">전류를 여닫는 면으로 넘어갑니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글에서는 두 영역을 직접 붙여 바깥 전압이 경계의 장벽을 바꾸게
            했습니다. 다음에는 전극을 절연층 너머에 놓고, 직접 전류를 넣지
            않으면서 표면에 모이는 전하를 바꾸겠습니다. 이것이 뒤의 스위치
            소자를 이해하는 다음 단계입니다.
          </p>
          <p className="leading-7">
            먼저 <Link to="/electronics/semiconductors/bands-and-doping#count">도핑 글의 전자·정공 농도 계산</Link>을
            돌아보면, 왜 접합 건너편의 소수 캐리어가 전류식에 들어가는지
            더 선명해집니다.
          </p>
          <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 바깥 전압이 0 V인데도 접합 안에 전기장이 있는 이유는 무엇입니까? (답: 3절) 0.5 V에서 0.6 V로 바꾸면 왜 0.1 V만큼 전류가 선형으로 늘지 않습니까? (답: 5절) 역방향 전압을 계속 높여도 −1 pA가 유지될까요? (답: 6절)</p>
        </div>
      </section>
    </div>
  );
}
