import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MosfetRegionsViz from "./mosfet-regions-and-transfer/viz/MosfetRegionsViz";

import NumericPath from "../world-systems/NumericPath";

export default function MosfetRegionsAndTransferArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 같은 전극 전압에서 흐름이 왜 더는 늘지 않을까요?</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            앞 글에서 절연된 전극은 아래 표면에 모이는 전자 수를 조절했습니다. 이번에는 그 표면의 양끝을 연결해 전자를 흘립니다. 양끝 전압을 올리면 처음에는 전류가 늘지만 어느
            지점부터는 증가가 작아집니다. 전자가 지나가는 길의 끝에서 무엇이 달라지는지 살펴보겠습니다.
          </p><p className="leading-7">
            전하를 조절하는 위 전극과 전자를 이동시키는 양끝의 역할을 먼저 나눕니다. 그다음 같은 길의 입구와 출구에서 전하량이 달라지는 이유를 보겠습니다. 한 소자의 세 전압을 따라
            계산하고 원문 식이 맞는 범위까지 확인하겠습니다.
          </p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 두 전압을 정하고 하나의 전류를 읽습니다</h2>
<NumericPath title="바깥 단자에서 하는 실험" steps={[{"label": "제어 전압", "value": "위 전극 1.5 V", "detail": "아래 표면에 모이는 전하를 조절합니다."}, {"label": "양끝 전압", "value": "0.2→1.0→1.5 V", "detail": "한쪽 끝을 0 V로 고정하고 다른 끝을 올립니다."}, {"label": "관찰", "value": "0.18→0.5→0.5 mA", "detail": "이상 모델이 주는 양끝 전류입니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">온도와 소자의 치수·재료는 바꾸지 않습니다. 아래 실리콘 바탕도 0 V에 둡니다. 위 전극 전압 하나로 전류가 모두 결정되는 것은 아닙니다. 같은 전극 전압에서도 길 양끝의 전압 차이가 흐름을 바꾸기 때문입니다.</p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 한 소자에서 세 전압을 비교합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">모든 수치는 <strong>가정</strong>입니다. 위 전극은 1.5 V, 표면에 전자가 충분히 모이는 기준은 0.5 V입니다. 두 값의 차이 1.0 V가 길을 만드는 여유입니다. 치수와 재료가 전류에 미치는 영향은 1 mA/V²라는 비례값 하나로 묶겠습니다.</p><p className="leading-7">한쪽 끝과 바탕은 0 V입니다. 다른 끝이 0.2 V이면 0.18 mA, 1.0 V이면 0.5 mA입니다. 1.5 V로 더 올려도 긴 소자의 이상 모델에서는 0.5 mA입니다. 마지막 두 값이 같은 이유를 출구 쪽 전하에서 찾겠습니다.</p><p className="leading-7">이 숫자는 실제 미세 공정 제품의 측정값이 아닙니다. 길이가 충분히 길고 이동하기 쉬운 정도가 일정한 첫 모델을 골랐습니다. 뒤에서 어느 조건부터 이 그림을 고쳐야 하는지도 보겠습니다.</p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 출구 쪽 표면에는 전자가 덜 모입니다</h2>
<NumericPath title="0.2 V를 건 길에서 보는 전압 여유" steps={[{"label": "입구", "value": "1.5−0.5−0=1.0 V", "detail": "표면 전자를 모으는 여유가 큽니다."}, {"label": "길 중간", "value": "입구보다 높은 전위", "detail": "위 전극과의 전압 차이가 작아집니다."}, {"label": "출구", "value": "1.5−0.5−0.2=0.8 V", "detail": "입구보다 전자가 덜 모입니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">위 전극은 어디서나 같은 1.5 V여도 아래 길의 전위는 같지 않습니다. 출구 쪽으로 갈수록 길의 전위가 높아지므로 위 전극이 표면을 당기는 전압 여유가 줄어듭니다. 이 때문에 길을 균일한 고정 저항 하나로만 볼 수 없습니다.</p><p className="leading-7">
            출구를 1.0 V까지 올리면 그 끝의 여유는 0 V가 됩니다. 출구를 더 높였다고 해서 길 전체의 전자가 한꺼번에 사라지는 것은 아닙니다. 입구 쪽에서는 전자가 계속
            공급됩니다.
          </p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 전하를 모으는 역할과 이동시키는 역할이 모두 필요합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">위 전극만 올려 전자를 모아도 양끝 전압 차이가 없으면 이 정적 모델의 순전류는 0입니다. 반대로 양끝 전압만 준다고 원하는 표면 전자 층이 자동으로 생기지는 않습니다. 길의 전하와 길을 따라 작용하는 전기장을 함께 알아야 합니다.</p><p className="leading-7">양끝 전압을 올리면 이동시키는 힘은 커지지만 출구 쪽 전하량은 줄어듭니다. 이 두 변화가 전류의 증가를 둔화시킵니다. 아래 바탕의 전위도 표면 조건에 관여하므로 이번 계산에서는 한쪽 끝과 묶어 고정했습니다. 이제 각 단자의 이름을 붙이겠습니다.</p></div>
</section>

<section id="terminals" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 조절·공급·수집·바탕의 역할에 이름을 붙입니다</h2>
<div className="overflow-x-auto"><table className="w-full min-w-[320px] text-left text-sm"><thead><tr><th className="p-3">먼저 본 역할</th><th className="p-3">이름</th><th className="p-3">이 사례의 연결</th></tr></thead><tbody><tr><td className="p-3">절연층 너머 표면 전하를 조절</td><td className="p-3">게이트</td><td className="p-3">1.5 V</td></tr><tr><td className="p-3">전자를 공급하는 끝</td><td className="p-3">소스</td><td className="p-3">0 V</td></tr><tr><td className="p-3">전자를 받아들이는 끝</td><td className="p-3">드레인</td><td className="p-3">0.2→1.0→1.5 V</td></tr><tr><td className="p-3">표면 아래의 실리콘 바탕</td><td className="p-3">바디</td><td className="p-3">소스와 같은 0 V</td></tr></tbody></table></div><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">p형 실리콘 표면의 양쪽에 전자가 많은 n형 영역을 만듭니다. 표의 소스와 드레인이 그 영역에 연결됩니다. 위쪽 게이트는 절연층을 사이에 두므로 전자를 직접 통과시키는 공급 단자가 아닙니다.</p><p className="leading-7">이 조건에서 전자는 소스에서 드레인으로 이동합니다. 양의 관습 전류는 그 반대 방향인 드레인에서 소스로 셉니다. 이 글의 양수 드레인 전류는 그 관습을 따릅니다. 바디가 다른 전위에 있으면 표면 전하가 생기는 기준도 바뀔 수 있으므로 연결 조건을 명시했습니다.</p></div>
</section>

<section id="channel" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 같은 길에서 위치에 따른 전하량을 읽습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
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

<section id="states" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 0.2·1.0·1.5 V에서 길의 끝을 비교합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
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

<section id="current" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 원문의 국소 전하를 적분해 0.18 mA를 얻습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
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
        <div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
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
        <div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7"><em>0.2 V에서 0.18 mA, 경계인 1.0 V부터 이상 포화값 0.5 mA가 한 전류식에서 이어집니다.</em></p>
        </div>
</section>

<section id="source-limit" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 원문이 경계 부근에서 근사를 경고하는 이유입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">MIT 강의안 25의 10쪽은 <code>Qi(y)=−Cox[VGS−V(y)−VT]</code>로 위치별 표면 전하를 적습니다. 원문의 Cox는 면적당 용량입니다. 13쪽에서 이를 길 방향으로 적분한 식에 k=1 mA/V²와 여분 전압 1.0 V를 넣으면 <code>ID=k(1.0×VDS−VDS²/2)</code>가 됩니다. 여기의 수치는 본문 가정입니다.</p><p className="leading-7">같은 소자에서 VDS를 0.8 V로 두면 1×(0.8−0.8²/2)=0.48 mA입니다. 이상 포화값 0.5 mA의 96%입니다. 강의안 26의 4쪽도 여분 전압의 80% 지점에서 이 96% 관계를 보여 줍니다. 전류가 경계에 오기 전부터 평평해지는 모습입니다.</p><p className="leading-7">그러나 강의안 26의 3쪽은 경계에 가까워질수록 전기장이 커져 완만한 채널 변화와 일정 이동도의 근사가 나빠진다고 지적합니다. 앞 절에서 1.0 V를 넣어 0.5 mA로 잇는 계산은 첫 모델의 연결법입니다. 경계의 실제 전기장까지 정확히 푼 결과가 아닙니다.</p><p className="leading-7">또 끝이 잘록해졌다고 전자 흐름이 끊기는 것은 아닙니다. 강의안 26의 5쪽처럼 전자는 그 부분의 전기장에 의해 드레인으로 이동할 수 있습니다. 이 점을 놓치면 포화 전류를 0으로 잘못 예측하게 됩니다.</p></div>
</section>

<section id="limits" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 실제 소자에서 다시 확인할 조건입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
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

<section id="handoff" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">12. 영역과 전류를 예측하고 에너지로 넘어갑니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            <Link to="/electronics/devices/mos-capacitor-and-inversion#numbers">앞 글의 전극 전하 계산</Link>과
            이번 글의 양단자 전류를 합치면 스위치를 한 번 뒤집을 때
            충전해야 할 전하와, 꺼졌을 때도 남는 누설을 따질 수 있습니다.
            다음 글은 그 에너지 장부를 셉니다.
          </p>
          <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 게이트 1.5 V에서 양끝 0.2 V와 1.0 V는 왜 서로 다른 영역입니까? (답: 8절) 이상 모형에서 양끝 1.0 V와 1.5 V의 전류는 왜 같습니까? (답: 9·10절) 실제 소자에서도 정확히 같을까요? (답: 11절)</p>
        </div>
</section>
</div>;
}
