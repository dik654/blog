import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import CircuitWalkViz from "./lumped-circuit-and-conservation/viz/CircuitWalkViz";

/**
 * 전자공학 입문 1편. 전부 가정한 12 V 저항망 하나를 끝까지 따라간다.
 * 역사 자료는 Kirchhoff 1845 원문 p.499, 회로 근사 조건은 MIT 6.002 강의안.
 */
export default function LumpedCircuitAndConservationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">도선을 따라갔는데 갈림길에서 막혔습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            12 V 전원에 저항 하나를 잇고, 그 뒤에서 길을 둘로 나눕니다. 두 길에는
            저항을 하나씩 둡니다. 첫 저항을 지나는 전류는 얼마이고, 갈라진 두
            길에는 각각 얼마가 흐를까요? 부품의 저항값만 나열해서는 바로 답할 수
            없습니다. 세 전류가 서로 묶여 있기 때문입니다.
          </p>
          <p className="leading-7">
            이 글의 숫자는 모두 설명을 위해 정한 <strong>가정</strong>입니다. 전원
            12 V, 첫 저항 1 kΩ, 두 갈래의 저항은 각각 2 kΩ입니다. 전원과 도선은
            이상적이고 저항값은 변하지 않는다고 둡니다. 먼저 이 회로에서 실제로
            무엇을 세는지 보고, 갈림길과 한 바퀴에 조건 하나씩을 놓겠습니다.
          </p>
        </div>
        <CircuitWalkViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            그림에서 먼저 볼 것은 두 가지입니다. 갈림길로 들어온 흐름은 두
            출구로 나누어져야 합니다. 또 전원에서 얻은 전압은 첫 저항과 선택한
            갈래의 저항에서 모두 쓰여야 합니다. 두 조건을 함께 쓰면 갈림길의
            전압이 하나로 정해집니다.
          </p>
          <p className="leading-7"><em>이제 이 회로에서는 갈림길의 전하 장부와 한 바퀴의 에너지 장부를 함께 맞춰야 한다는 점이 보입니다.</em></p>
        </div>
      </section>

      <section id="small-circuit" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">흐르는 양과 두 점 사이의 차이를 따로 셉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            전류는 도선 한 단면을 <strong>1초에 지나간 전하량</strong>입니다.
            0.006 C가 1초에 지나면 0.006 A, 곧 6 mA입니다. 양전하가 움직인다고
            약속한 방향을 화살표로 정합니다. 금속 안의 전자는 반대쪽으로 움직일
            수 있지만, 이 계산에서는 약속한 전류 방향만 일관되게 쓰면 됩니다.
          </p>
          <p className="leading-7">
            전압은 한 점이 혼자 갖는 숫자가 아닙니다. <strong>두 점 사이에서
            전하 1 C가 주고받는 에너지의 차이</strong>입니다. 아래 도선을 기준
            0 V로 택하고 갈림길을 6 V라고 부르면 두 갈래의 위와 아래에는 모두
            6 V가 걸립니다. 두 갈래가 같은 두 점에 닿아 있기 때문입니다. 기준점을
            바꾸면 각 점의 숫자는 바뀌어도 두 점의 차이는 같습니다.
          </p>
          <p className="leading-7">
            저항은 그 차이를 전류로 바꾸는 부품 모델입니다. 같은 온도와 동작
            범위에서 전압을 두 배로 하면 전류도 두 배로 되는 선형 저항을 둡니다.
            2 kΩ에 6 V가 걸리면 6 V를 2000 Ω으로 나눈 0.003 A, 곧 3 mA가
            흐릅니다. 다이오드나 뜨거워지며 값이 달라지는 저항에는 일정한 값
            하나로 이 계산을 그대로 적용할 수 없습니다.
          </p>
        </div>
        <ExplainedFormula
          question="한 부품에 걸린 전압을 알면 전류는 얼마입니까?"
          idea="선형 저항에서는 전압과 전류의 비가 일정하다고 가정합니다."
          formula={String.raw`I=\frac{V}{R}=\frac{6\,\mathrm V}{2{,}000\,\Omega}=3\,\mathrm{mA}`}
          annotatedFormula={String.raw`I=\underbrace{\frac{V}{R}}_{\text{전압에서 전류로}}=\frac{6\,\mathrm V}{2{,}000\,\Omega}=3\,\mathrm{mA}`}
          operations={[{ expression: String.raw`\frac{V}{R}`, annotation: "전압을 저항으로 나누어 해당 갈래의 흐름을 구합니다." }]}
          terms={[
            { symbol: "I", name: "전류", description: "정한 방향으로 초당 지나가는 전하량. 단위는 A입니다." },
            { symbol: "V", name: "전압", description: "부품 양끝의 전위차. 단위는 V=J/C입니다." },
            { symbol: "R", name: "저항", description: "이 동작 범위에서 일정하다고 둔 비례값. 단위는 Ω=V/A입니다." },
          ]}
          assumptions={["도선과 전원은 이상적입니다.", "저항값이 온도와 전류에 따라 바뀌지 않는 범위입니다."]}
          interpretation="같은 두 점에 닿은 두 2 kΩ 갈래에는 각각 3 mA가 흐릅니다."
        />
        <CitationBlock
          source="MIT OpenCourseWare 6.002, Circuits and Electronics, Lecture 1 (2007)"
          citeKey={1}
          href="https://live.ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/f6ad70417c73f585b7ca065153d25d25_6002_l1.pdf"
        >
          강의안은 공간에 퍼진 전자기 현상을 부품의 전압과 전류로 줄이는 집중 회로
          가정부터 시작해, 전하 보존과 패러데이 법칙에서 두 회로 조건이 나오는
          범위를 설명합니다. 이 글의 12 V 수치는 강의안의 실험값이 아닙니다.
        </CitationBlock>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">두 갈래에는 같은 6 V가 걸리지만 전류는 각 저항값으로 따로 정해집니다.</p>
      </section>

      <section id="junction" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">갈림길에서 전하가 사라지지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            첫 저항에서 6 mA가 들어온다면, 갈림길에 전하가 계속 쌓이지 않는
            동안 두 출구의 전류를 합친 값도 6 mA여야 합니다. 각 갈래에 3 mA가
            흐르므로 6−3−3=0 mA입니다. 이 갈림길 조건을 키르히호프의 전류
            법칙이라고 부릅니다.
          </p>
          <p className="leading-7">
            전류가 갈라진다는 말은 전자 하나가 둘로 쪼개진다는 뜻이 아닙니다.
            일정 시간 동안 경계 안으로 들어온 전하의 총량이 두 출구로 나간
            총량과 같다는 뜻입니다. 1초에 0.006 C가 들어오면 각 출구로 0.003 C씩
            나가는 식입니다.
          </p>
        </div>
        <ExplainedFormula
          question="한 점으로 들어온 전류와 나간 전류는 어떻게 연결됩니까?"
          idea="갈림길 주변에 작은 경계를 그리고, 그 안에 전하가 쌓이지 않는 상태를 셉니다."
          formula={String.raw`I_{\mathrm{in}}-I_1-I_2=0\quad\Rightarrow\quad 6-3-3=0\;\mathrm{mA}`}
          annotatedFormula={String.raw`\underbrace{I_{\mathrm{in}}-I_1-I_2}_{\text{갈림길 순유입}}=0\quad\Rightarrow\quad 6-3-3=0\;\mathrm{mA}`}
          operations={[{ expression: String.raw`I_{\mathrm{in}}-I_1-I_2`, annotation: "들어온 흐름은 양수, 나간 흐름은 음수로 세어 경계의 순유입을 구합니다." }]}
          terms={[
            { symbol: String.raw`I_{\mathrm{in}}`, name: "들어오는 전류", description: "첫 1 kΩ 저항을 지나 갈림길로 들어옵니다." },
            { symbol: "I_1,I_2", name: "나가는 전류", description: "두 갈래의 저항을 각각 지납니다." },
          ]}
          assumptions={["갈림길에 따로 모델링하지 않은 전하 축적이 없습니다.", "모든 갈래를 빠짐없이 경계에 포함합니다."]}
          interpretation="두 출구 중 하나가 3 mA라면 나머지도 3 mA여야 합니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            Kirchhoff가 1845년에 다룬 대상은 이 세 저항이 아닙니다. 정상 상태의
            얇은 금속판에서 닫힌 곡선을 그린 뒤, 곡선 안에 전류를 따로 넣지
            않으면 경계로 드나드는 흐름의 합이 0이라고 적었습니다. 금속판의
            연속적인 흐름을 여기서는 갈림길의 세 도선으로 줄여 같은 보존
            조건을 씁니다.
          </p>
          <p className="leading-7"><em>갈림길을 떠날 때는 6 mA가 3 mA씩 나뉩니다. 이제 한 바퀴의 전압도 맞춰 보겠습니다.</em></p>
        </div>
        <CitationBlock
          source="G. Kirchhoff, ‘Ueber den Durchgang eines elektrischen Stromes durch eine Ebene, insbesondere durch eine kreisförmige,’ Annalen der Physik und Chemie 64 (1845), 497–514, 특히 499쪽"
          citeKey={2}
          href="https://zenodo.org/records/2422851"
        >
          원문 499쪽은 닫힌 곡선 전체에 대해 <span className="font-mono">∫ ds · du/dN = 0</span>을 적습니다.
          u는 금속판의 전위, N은 경계의 수직 방향, ds는 경계의 작은 길이입니다.
          12 V 저항망에는 금속판의 공간 좌표나 전도율을 주지 않았으므로 이
          적분식에 숫자를 직접 대입할 수 없습니다. 경계의 순유입이 0이라는
          원문의 보존 조건을 세 도선의 6−3−3=0 mA로 옮겼습니다.
        </CitationBlock>
      </section>

      <section id="loop" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 바퀴를 돌면 전압 변화가 맞아야 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            아래 기준점에서 전원을 지나면 12 V 올라갑니다. 첫 저항을 지날 때
            6 V 내려가 갈림길은 6 V입니다. 왼쪽 갈래의 2 kΩ 저항을 지나면 다시
            6 V 내려가 기준점으로 돌아옵니다. 오른쪽으로 돌아도 같습니다.
            출발한 바로 그 점으로 돌아왔는데 전압 차이가 남을 수는 없습니다.
          </p>
          <p className="leading-7">
            이렇게 경로를 한 바퀴 따라가며 전압의 오르내림을 더한 값을 0으로
            두는 것이 키르히호프의 전압 법칙입니다. 단, 회로 바깥에서 시간에
            따라 변하는 자기 선속이 이 고리를 관통한다면 유도 효과를 빼놓고
            단순히 0이라고 놓을 수 없습니다. 여기서는 그 효과가 무시할 만큼
            작다고 가정합니다.
          </p>
        </div>
        <ExplainedFormula
          question="전원이 준 12 V는 어디로 갔습니까?"
          idea="정한 방향으로 고리를 따라가며 상승은 양수, 하강은 음수로 셉니다."
          formula={String.raw`+V_s-V_{R_s}-V_{R_1}=12-6-6=0\;\mathrm V`}
          annotatedFormula={String.raw`\underbrace{+V_s}_{\text{전원 상승}}-\underbrace{V_{R_s}+V_{R_1}}_{\text{두 저항 하강}}=12-6-6=0\;\mathrm V`}
          operations={[{ expression: String.raw`+V_s-V_{R_s}-V_{R_1}`, annotation: "전원의 전압 상승에서 직렬 저항과 선택한 갈래의 전압강하를 뺍니다." }]}
          terms={[
            { symbol: "V_s", name: "전원", description: "기준점에서 올라가며 얻는 12 V입니다." },
            { symbol: "V_{R_s}", name: "첫 저항", description: "갈림길까지 가는 동안 내려가는 6 V입니다." },
            { symbol: "V_{R_1}", name: "선택한 갈래", description: "갈림길에서 기준점까지 내려가는 6 V입니다." },
          ]}
          assumptions={["고리 방향과 각 전압의 측정 방향을 고정합니다.", "회로 모델 밖의 시간에 따른 자기 선속 변화가 무시 가능합니다."]}
          interpretation="한 바퀴의 합이 0이면 같은 기준점에 일관된 전압을 붙일 수 있습니다."
        />
        <p className="mt-5 text-sm leading-6 text-muted-foreground">한 바퀴를 돌면 얻은 12 V와 두 번 잃은 6 V가 서로 지워집니다.</p>
      </section>

      <section id="solve" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">두 조건을 합치면 갈림길의 숫자가 정해집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            지금까지는 갈림길이 6 V라고 먼저 두고 검산했습니다. 이번에는 모르는
            값으로 두고 직접 구해 봅니다. 갈림길 전압을 V라고 하면 첫 저항에는
            12−V 볼트가 걸립니다. 두 갈래에는 각각 V 볼트가 걸립니다. 각
            저항에서 전압을 저항으로 나누어 전류를 만든 다음, 들어온 전류와
            나간 전류를 맞춥니다.
          </p>
        </div>
        <ExplainedFormula
          question="갈림길 전압 V를 아직 모를 때 어떻게 구합니까?"
          idea="각 전류를 전압과 저항으로 바꾸고, 갈림길의 유입과 유출을 같게 둡니다."
          formula={String.raw`\frac{12-V}{1{,}000}=\frac{V}{2{,}000}+\frac{V}{2{,}000}\quad\Rightarrow\quad V=6\,\mathrm V`}
          annotatedFormula={String.raw`\underbrace{\frac{12-V}{1{,}000}}_{\text{들어온 전류}}=\underbrace{\frac{V}{2{,}000}+\frac{V}{2{,}000}}_{\text{나간 전류}}\quad\Rightarrow\quad V=6\,\mathrm V`}
          operations={[
            { expression: String.raw`\frac{12-V}{1{,}000}`, annotation: "전원에서 갈림길까지 1 kΩ을 지나는 전류입니다." },
            { expression: String.raw`\frac{V}{2{,}000}+\frac{V}{2{,}000}`, annotation: "같은 전압 V를 마주한 두 출구의 전류를 합칩니다." },
          ]}
          terms={[
            { symbol: "V", name: "갈림길 전압", description: "아래 도선을 0 V로 택했을 때의 전압입니다." },
            { symbol: "12-V", name: "첫 저항의 전압", description: "전원의 12 V에서 갈림길에 남은 전압을 뺍니다." },
          ]}
          assumptions={["세 저항은 선형이고 값이 일정합니다.", "갈림길에 따로 축적되는 전하가 없습니다."]}
          interpretation="V=6 V이므로 첫 저항에는 6 mA, 두 갈래에는 각각 3 mA가 흐릅니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            그림에서 오른쪽 2 kΩ을 1 kΩ으로 바꿔 보세요. 같은 식의 오른쪽
            마지막 분모만 1000으로 바뀝니다. 그러면 갈림길은 4.8 V, 첫 저항
            전류는 7.2 mA, 두 출구는 2.4 mA와 4.8 mA입니다. 왼쪽 부품을
            건드리지 않았어도 그 전류가 바뀝니다. 갈림길 전압을 회로 전체가
            함께 결정하기 때문입니다.
          </p>
          <p className="leading-7">
            여기서 멈춰 직접 풀어 보세요. <strong>왜 오른쪽 저항을 줄였는데
            왼쪽 전류까지 줄어들었을까요?</strong> 갈림길 전압을 구한 뒤 왼쪽
            2 kΩ에 다시 적용하면 답이 나옵니다.
          </p>
          <p className="leading-7"><em>한 갈래의 저항을 바꾸자 갈림길 전압도 움직였고, 다른 갈래의 전류까지 바뀌었습니다.</em></p>
        </div>
      </section>

      <section id="power" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">전력의 합으로 계산을 한 번 더 검산합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            전압은 전하 1 C당 에너지이고 전류는 1초당 전하입니다. 둘을 곱하면
            1초당 에너지, 곧 전력입니다. 처음의 두 2 kΩ 갈래를 기준으로 전원은
            12 V에서 6 mA를 내보내므로 72 mW를 공급합니다. 첫 저항은
            6 V×6 mA=36 mW, 두 갈래는 각각 6 V×3 mA=18 mW를 씁니다.
          </p>
          <p className="leading-7">
            36+18+18=72 mW가 맞습니다. 이 검산은 세 저항의 전류 방향이나
            전압을 잘못 계산했는지 잡아 줍니다. 축전기나 코일이 있는 회로에서는
            순간적으로 저장 에너지가 늘거나 줄 수도 있으므로, 공급과 소모만
            비교하면 검산이 어긋납니다. 저장량의 변화도 세어야 합니다.
          </p>
        </div>
        <ExplainedFormula
          question="전원이 준 에너지가 회로 안에서 모두 설명됩니까?"
          idea="각 부품의 전압과 그 부품을 통과하는 전류를 곱해 초당 에너지로 바꿉니다."
          formula={String.raw`P_s=V_sI_s=72\,\mathrm{mW}=36+18+18\,\mathrm{mW}`}
          annotatedFormula={String.raw`P_s=\underbrace{V_sI_s}_{\text{전원 공급}}=72\,\mathrm{mW}=\underbrace{36+18+18}_{\text{저항 소비}}\,\mathrm{mW}`}
          operations={[{ expression: String.raw`V_sI_s`, annotation: "전하 한 단위당 에너지에 초당 전하량을 곱해 초당 에너지를 구합니다." }]}
          terms={[
            { symbol: "P_s", name: "공급 전력", description: "12 V 전원이 6 mA를 내보내며 공급하는 72 mW입니다." },
            { symbol: String.raw`\mathrm{mW}`, name: "밀리와트", description: "1 mW는 0.001 J/s입니다." },
          ]}
          assumptions={["전원과 세 저항을 빠짐없이 셉니다.", "저장 소자가 없는 정상 상태입니다."]}
          interpretation="전원의 72 mW와 세 저항의 72 mW가 일치합니다."
        />
        <p className="mt-5 text-sm leading-6 text-muted-foreground">전원에서 나온 전력과 저항에서 쓴 전력이 맞으므로 앞의 전압·전류 계산도 한 번 더 확인됐습니다.</p>
      </section>

      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">점과 선으로 줄일 수 없는 순간이 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            실제 전압과 전류는 공간에 퍼진 전기장과 자기장의 결과입니다. 이
            글은 그 현상을 점의 전압, 선의 전류, 부품 양끝의 관계로 줄였습니다.
            이것을 <strong>집중 회로 근사</strong>라고 합니다. 부품과 배선에서
            일어나는 전파 지연이 관심 시간에 비해 작고, 회로 밖 유도 효과나
            빠뜨린 전하 축적도 작을 때 이 그림이 잘 맞습니다.
          </p>
          <p className="leading-7">
            길게 뻗은 전송선에 빠른 신호를 보내면 선의 한쪽과 다른 쪽이 같은
            순간에 같은 상태가 아닙니다. 그때 선을 저항 없는 한 줄로 접으면
            전파 시간을 잃습니다. 고리를 관통하는 자기 선속이 빠르게 바뀌면
            유도 전압을 별도 부품이나 식에 넣어야 합니다. 축전기에 전하가
            쌓이는 순간에는 그 갈래의 전류를 빠뜨린 채 나머지 둘만 더해서
            0이라고 할 수 없습니다.
          </p>
          <p className="leading-7">
            이럴 때는 무엇을 경계 안의 요소로 넣었는지, 어떤 공간 효과를
            버렸는지부터 확인합니다. MIT 6.002 강의안도 집중 회로 모델의 조건으로 부품 안의
            전하 축적과 회로 밖의 시간에 따른 자기 선속 변화를 명시합니다.
          </p>
          <p className="leading-7"><em>빠른 변화나 긴 배선처럼 공간 효과가 커지면 이 점과 선의 회로 그림을 다시 펼쳐야 합니다.</em></p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">이제 각 부품이 내는 열을 묻습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            한 갈래의 저항을 바꾸면 다른 갈래의 전류도 바뀝니다. 이 글은 바뀐
            뒤의 안정된 숫자와 전력의 합을 구했습니다. 다음 글에서는
            <Link to="/electronics/circuits/resistance-and-power-dissipation#rating">각 부품의 열과 실제 저항의 전력 정격</Link>을
            비교합니다. 그다음에 축전기를 넣어 바뀌는 동안의 전압과 전류를
            시간에 따라 따라갈 차례입니다.
          </p>
          <ol className="space-y-2 leading-7">
            <li>6 mA가 갈림길로 들어와 한쪽으로 3 mA가 나갈 때 나머지 쪽은 몇 mA일까요? (답: 갈림길 절)</li>
            <li>오른쪽 저항을 1 kΩ으로 낮추면 왼쪽 전류가 왜 줄어들까요? (답: 풀이 절)</li>
            <li>유도 전압이 있는 고리를 계산할 때 회로 모델에 무엇을 더해야 할까요? (답: 적용 범위 절)</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
