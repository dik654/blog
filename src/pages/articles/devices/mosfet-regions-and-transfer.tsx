import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MosfetRegionsViz from "./mosfet-regions-and-transfer/viz/MosfetRegionsViz";

/** Ideal long-channel educational case: Vth=.5 V, k=1 mA/V², VGS=1.5 V. */
export default function MosfetRegionsAndTransferArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">길을 만들고 양끝에 전압을 겁니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서는 절연된 전극 아래 실리콘 표면에 전자가 모일 수
            있다는 것을 보았습니다. 그 전자 층의 양끝을 회로에 연결하면
            어떤 일이 생길까요? 한쪽에서 전자를 공급하고 다른 쪽에서
            받아, 전극 전압 하나로 흐름을 조절할 수 있습니다. 디지털
            스위치의 ‘열기·닫기’와 아날로그 전류 조절이 여기서 갈라집니다.
          </p>
          <p className="leading-7">
            작은 이상 소자를 <strong>가정</strong>합니다. 전극 전압 1.5 V,
            전자 길이 생기는 기준 0.5 V, 전류를 정하는 비례값
            1 mA/V²입니다. 양끝 전압을 0.2 V로 두면 0.18 mA, 1.0 V로
            올리면 0.5 mA가 됩니다. 1.5 V로 더 올려도 이 이상 모델에서는
            0.5 mA 그대로입니다. 처음에는 양끝 전압이 흐름을 키우다가
            왜 더는 크게 키우지 못하는지 한 길을 따라 설명하겠습니다.
          </p>
          <p className="leading-7"><em>이 글의 질문은 같은 전극 전압에서 양끝 전압을 올릴 때 전류가 언제까지 커지는가입니다.</em></p>
        </div>
      </section>

      <section id="terminals" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">전극과 두 통로 끝의 역할을 나눕니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            p형 실리콘 표면의 양쪽에 전자가 많은 n형 영역을 만듭니다.
            왼쪽은 전자를 공급하는 <strong>소스</strong>, 오른쪽은 받아들이는
            <strong>드레인</strong>이라고 부릅니다. 위쪽의 절연된 전극은
            <strong>게이트</strong>입니다. p형 바탕은 몸체인 바디이며,
            이 예제에서는 소스와 같은 전위에 묶습니다.
          </p>
          <p className="leading-7">
            게이트는 절연층 너머 전기장으로 표면 전자 수를 조절합니다.
            소스와 드레인 사이에 전압을 주면 전자는 소스에서 드레인으로
            이동합니다. 회로에서 쓰는 양의 관습 전류는 그 반대 방향,
            드레인에서 소스로 셉니다. 두 방향을 섞으면 전류 부호가
            뒤집히므로 이 글의 계산에서는 드레인 전류를 양수로 둡니다.
          </p>
          <p className="leading-7"><em>게이트는 길의 전하 수를, 소스와 드레인의 전압은 그 길을 따라 움직이는 힘을 정합니다.</em></p>
        </div>
      </section>

      <section id="channel" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">표면 전하가 양끝을 잇는 길이 됩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            게이트 전압이 앞 글의 문턱보다 높으면 전자가 절연층 바로 아래
            표면에 모입니다. 전극 아래의 이 얇은 전자 층이 소스와 드레인을
            잇는 <strong>채널</strong>입니다. 전극 전압이 문턱보다 얼마나
            높은지를 <strong>여분 전압</strong>으로 부르겠습니다. 예제의
            1.5 V에서 0.5 V를 빼면 여분 전압은 1.0 V입니다.
          </p>
          <p className="leading-7">
            채널은 어디서나 같은 두께의 전자 층이 아닙니다. 소스 쪽을
            0 V로 두면 그곳에는 여분 전압 1.0 V가 온전히 걸립니다.
            드레인으로 갈수록 채널의 전위가 올라가므로 게이트와
            채널 사이의 전압은 줄어듭니다. 드레인 쪽의 전자 층이
            더 얇아지는 이유입니다.
          </p>
          <p className="leading-7"><em>채널이 생겼다는 사실만으로 전류는 정해지지 않습니다. 길을 따라 바뀌는 국소 전압도 세어야 합니다.</em></p>
        </div>
      </section>

      <section id="states" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">닫힘·완만한 증가·거의 일정한 전류</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            게이트가 문턱 아래인 0.4 V라면 이상 모델에서는 강한 전자
            채널이 없고 드레인 전류를 0으로 놓습니다. 이를 <strong>차단</strong>
            이라고 부릅니다. 실제 소자는 문턱 아래에서도 조금 흐릅니다.
            문턱을 완전히 끊어지는 문이라고 생각하면 누설을 놓칩니다.
          </p>
          <p className="leading-7">
            게이트가 1.5 V이고 양끝 전압이 0.2 V라면 드레인 쪽에서도
            여분 전압 1.0−0.2=0.8 V가 남습니다. 전자 길이 끝까지 이어져
            있고 양끝 전압을 올리면 전류도 커지는 <strong>선형 영역</strong>
            입니다. ‘선형’이라고 해도 0.2 V 범위 밖에서 전류가 모든
            전압에 정확히 비례한다는 뜻은 아닙니다.
          </p>
          <p className="leading-7">
            양끝 전압을 여분 전압 1.0 V까지 올리면 드레인 끝의
            국소 여분 전압이 거의 0이 됩니다. 채널 끝이 잘록해지는
            상태입니다. 그보다 높은 양끝 전압은
            잘록해진 부분에 주로 걸리고, 긴 채널의 이상 모델에서는
            흐름이 거의 일정해집니다. 이 영역을 <strong>포화</strong>라고
            부릅니다. 포화는 ‘전류가 최대한 많이 흐른다’는 스위치
            표현과 같지 않고, 드레인 전압을 더 올려도 전류가 더는
            크게 늘지 않는다는 I–V 곡선의 성질입니다.
          </p>
          <p className="leading-7"><em>여분 전압 1.0 V는 드레인 쪽 채널이 잘록해지는 양끝 전압의 기준입니다.</em></p>
        </div>
        <MosfetRegionsViz />
      </section>

      <section id="current" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 소자를 세 전압에서 계산합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            앞 절에서 드레인 끝의 전자 층이 잘록해지는 상태를
            <strong>핀치오프</strong>라고 부릅니다. 이름 그대로 채널 끝이
            좁아지지만 전자가 드레인에 닿는 길이 완전히 막힌 것은 아닙니다.
          </p>
          <p className="leading-7">
            소스에서 드레인으로 갈수록 채널의 국소 전압이 0에서
            양끝 전압까지 올라갑니다. 해당 지점의 전자 전하는
            절연층 용량에 ‘게이트 여분 전압−그 지점 전압’을 곱한 값으로
            근사합니다. 길을 따라 이 전하와 전기장으로 생기는 전류를
            합치면, 양끝 전압에 비례하는 항에서 양끝 전압의 제곱 항을
            빼는 식이 됩니다. 비례값 k에는 전자 이동도, 산화막의
            <strong>면적당</strong> 용량 C′<sub>ox</sub>, 채널 폭과 길이의 비가
            들어갑니다. 앞 글의 0.345 pF는 면적 100 µm² 전체의 용량이므로
            여기의 C′<sub>ox</sub>와 단위가 다릅니다. 이 글은 k 전체를
            1 mA/V²로 <strong>가정</strong>합니다.
          </p>
          <p className="leading-7">
            조금 더 펼치면, 소스에서 거리 y만큼 간 자리의 전위 V(y)는
            0에서 시작해 드레인에서 V<sub>DS</sub>가 됩니다. 그 자리의
            면적당 전자 전하는 대략 −C′<sub>ox</sub>[V<sub>ov</sub>−V(y)]입니다.
            일정한 이동도에서 이 전하에 길 방향 전기장을 곱한 전류가
            모든 y에서 같아야 합니다. V(y)를 0부터 V<sub>DS</sub>까지
            더하면 첫 항은 V<sub>ov</sub>V<sub>DS</sub>, 줄어드는 전하의
            몫은 V<sub>DS</sub>²/2가 됩니다. 이 적분은 채널이 끝까지
            이어지는 경우에만 유효합니다.
          </p>
        </div>
        <ExplainedFormula
          question="게이트 1.5 V, 양끝 0.2 V에서 흐르는 전류는 얼마입니까?"
          idea="채널 끝까지 강한 반전이 남으면 국소 전하가 길을 따라 줄어드는 양을 적분합니다."
          formula={String.raw`I_D=k\left(V_{ov}V_{DS}-\frac{V_{DS}^2}{2}\right)`}
          annotatedFormula={String.raw`\underbrace{I_D}_{\text{드레인 전류}}=k\left(V_{ov}V_{DS}-\frac{V_{DS}^2}{2}\right)`}
          operations={[
            { expression: String.raw`V_{ov}=1.5-0.5=1.0\,\mathrm V`, annotation: "게이트 전압에서 문턱을 뺍니다." },
            { expression: String.raw`I_D(0.2\,\mathrm V)=0.18\,\mathrm{mA}`, annotation: "1 mA/V²×(1.0×0.2−0.2²/2)입니다." },
          ]}
          terms={[
            { symbol: "I_D", name: "드레인 전류", description: "드레인에서 소스로 흐르는 관습 전류를 양수로 셉니다." },
            { symbol: "k", name: "전류 비례값", description: "μnC′ox(W/L)을 묶은 값이며 C′ox는 면적당 용량입니다. 이 글에서는 1 mA/V²로 가정합니다." },
            { symbol: "Vov", name: "여분 전압", description: "VGS−Vth이며 이 글에서는 1.0 V입니다." },
            { symbol: "VDS", name: "양끝 전압", description: "드레인 전위에서 소스 전위를 뺀 값입니다." },
          ]}
          assumptions={["길고 균일한 채널, 낮은 횡방향 전기장의 일정 이동도를 둡니다.", "바디와 소스를 같은 전위에 두고 문턱·k가 일정하다고 둡니다.", "0≤VDS<Vov의 선형 영역에만 이 식을 적용합니다."]}
          interpretation="0.2 V에서는 0.18 mA입니다. 양끝 전압이 1.0 V에 가까워질수록 드레인 끝의 전자 층이 약해지므로 단순 비례 증가가 둔화됩니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            경계인 1.0 V를 위 식에 넣으면 0.5 mA가 나옵니다. 드레인 쪽
            채널이 잘록해진 뒤에는 이상적인 긴 채널 모형에서 그 값이
            유지됩니다. 양끝 전압을 1.5 V로 올려도 0.5 mA입니다.
            같은 k·문턱을 유지한 채 게이트만 2.0 V로 높이면 여분 전압은
            1.5 V, 포화 시작 양끝 전압도 1.5 V, 포화 전류는 1.125 mA로
            바뀝니다(가정).
          </p>
        </div>
        <ExplainedFormula
          question="드레인 쪽 채널이 잘록해진 뒤 이상 전류는 얼마입니까?"
          idea="선형 영역 식의 경계 VDS=Vov를 대입해 두 영역이 만나는 값을 구합니다."
          formula={String.raw`I_{D,sat}=\frac{kV_{ov}^2}{2}`}
          annotatedFormula={String.raw`\underbrace{I_{D,sat}}_{\text{포화 전류}}=\frac{kV_{ov}^2}{2}`}
          operations={[
            { expression: String.raw`V_{DS,sat}=V_{ov}=1.0\,\mathrm V`, annotation: "이상 모형의 선형·포화 경계입니다." },
            { expression: String.raw`I_{D,sat}=0.5\,\mathrm{mA}`, annotation: "1 mA/V²×(1.0 V)²/2입니다." },
          ]}
          terms={[
            { symbol: "I_{D,sat}", name: "포화 전류", description: "드레인 전압을 더 올려도 이상 모형에서는 거의 일정한 전류입니다." },
            { symbol: "V_{DS,sat}", name: "포화 시작 전압", description: "이 예제에서는 여분 전압 1.0 V와 같습니다." },
          ]}
          assumptions={["앞의 긴 채널·일정 이동도·고정 k 가정을 유지합니다.", "채널 길이 변조와 속도 포화를 빼므로 실제 소자의 일정 전류와 다를 수 있습니다."]}
          interpretation="가정한 게이트 1.5 V에서 양끝 1.0 V와 1.5 V는 모두 이상 모형의 0.5 mA입니다."
        />
        <CitationBlock
          source="MIT OpenCourseWare 6.720J, Lecture 25 (2007), 10–13쪽; Lecture 26 (2007), 5–8쪽"
          citeKey={1}
          href="https://ocw.mit.edu/courses/6-720j-integrated-microelectronic-devices-spring-2007/8ad0e553fbdaed10f6102b04451e547e_lecture25.pdf"
        >
          강의안 25의 10쪽은 국소 반전 전하 Q<sub>i</sub>(y)가 위치에 따라
          달라지는 식, 13쪽은 그 값을 적분한 선형 영역 전류식을 제시합니다.
          강의안 26의 7쪽은 드레인 끝의 핀치오프와 포화 전류식을 제시합니다.
          두 원본 PDF의 해당 쪽을 확인했습니다. 1 mA/V²·0.5/1.5 V는 강의안의
          실험 결과가 아니라 이 글의 계산 가정입니다.
        </CitationBlock>
        <CitationBlock
          source="MIT OpenCourseWare 6.720J, Lecture 26, ‘Long MOSFET’ (2007), 5·7·8쪽"
          citeKey={2}
          href="https://ocw.mit.edu/courses/6-720j-integrated-microelectronic-devices-spring-2007/59850a07f95e9f50d32185eb46503460_lecture26.pdf"
        >
          원본 7쪽의 포화 경계 V<sub>DS,sat</sub>=V<sub>GS</sub>−V<sub>T</sub>와
          포화식 I<sub>D,sat</sub>=(W/2L)µ<sub>e</sub>C<sub>ox</sub>(V<sub>GS</sub>−V<sub>T</sub>)²을
          확인했습니다. 원문의 C<sub>ox</sub>는 면적당 용량이며, 본문은
          이를 C′<sub>ox</sub>로 구분해 k=µ<sub>e</sub>C′<sub>ox</sub>W/L로 묶었습니다.
        </CitationBlock>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7"><em>0.2 V에서 0.18 mA, 경계인 1.0 V부터 이상 포화값 0.5 mA가 한 전류식에서 이어집니다.</em></p>
        </div>
      </section>

      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">평평한 전류도 실제로는 기울어집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            실제 소자에서 드레인 전압을 더 올리면 잘록해진 부분이 소스
            쪽으로 조금 밀려 유효 채널 길이가 줄어듭니다. 이
            <strong>채널 길이 변조</strong> 때문에 포화 전류는 완전히
            평평하지 않습니다. 채널이 짧거나 전기장이 매우 강하면
            이동도가 일정하다는 전제도 깨집니다. 문턱 아래에서는
            약한 반전 전류가 흐르고, 바디 전위가 달라지면 문턱도
            움직입니다. 따라서 0.5 mA와 제곱식은 긴 채널의 이상
            계산값입니다.
          </p>
          <p className="leading-7">
            디지털 회로에서는 꺼질 때의 작은 누설과 켜질 때의 낮은
            저항이 중요합니다. 증폭 회로에서는 게이트 변화에 따른
            전류 변화와 드레인 전압에 따른 전류 변화를 함께 봅니다.
            같은 소자를 어느 영역에서 쓸지는 회로의 목적과 전압
            여유가 정합니다. ‘포화’라는 이름만으로 디지털의 켜짐
            상태를 결정하지 않습니다.
          </p>
          <p className="leading-7"><em>이상식은 영역을 나누는 출발점이고, 실제 설계에서는 데이터시트의 전압·전류·온도 곡선으로 경계를 다시 확인합니다.</em></p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 번 바꿀 때 드는 에너지를 셉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            <Link to="/electronics/devices/mos-capacitor-and-inversion#numbers">앞 글의 전극 전하 계산</Link>과
            이번 글의 양단자 전류를 합치면 스위치를 한 번 뒤집을 때
            충전해야 할 전하와, 꺼졌을 때도 남는 누설을 따질 수 있습니다.
            다음 글은 그 에너지 장부를 셉니다.
          </p>
          <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 게이트 1.5 V에서 양끝 0.2 V와 1.0 V는 왜 서로 다른 영역입니까? (답: 4절) 이상 모형에서 양끝 1.0 V와 1.5 V의 전류는 왜 같습니까? (답: 5절) 실제 소자에서도 정확히 같을까요? (답: 6절)</p>
        </div>
      </section>
    </div>
  );
}
