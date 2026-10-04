import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MosSurfaceViz from "./mos-capacitor-and-inversion/viz/MosSurfaceViz";

import NumericPath from "../world-systems/NumericPath";

export default function MosCapacitorAndInversionArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 전하가 건너는 길을 막아도 표면을 조절할 수 있습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            실리콘 위에 얇은 절연층을 두고 그 위에 전극을 놓습니다. 전극에서 실리콘으로 직류가 직접 흐르지 않아도 전극 전압을 바꾸면 아래 표면의 전하가 달라집니다. 전하가 직접
            건너가는지 전기장만 영향을 주는지 나누어 보겠습니다.
          </p><p className="leading-7">
            먼저 세 층의 역할을 보고 전압을 낮추거나 높일 때 표면에 무엇이 남는지 따라가겠습니다. 그다음 같은 면적·두께·전압으로 표면의 전자 수를 계산합니다. 전하를 얻은 경로와
            계산이 맞는 시간 조건도 함께 확인합니다.
          </p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 전극 전압을 입력으로, 표면 전하를 결과로 읽습니다</h2>
<NumericPath title="절연된 전극이 표면을 바꾸는 일" steps={[{"label": "입력", "value": "전극과 바탕의 전압 차이", "detail": "표면을 제어할 전기장을 바꿉니다."}, {"label": "사이의 층", "value": "직류 통로를 차단", "detail": "전기장은 아래 표면에 작용합니다."}, {"label": "결과", "value": "표면의 이동 전하", "detail": "어떤 전하가 얼마나 모였는지 읽습니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">위에서 전하를 바로 넣지 않는다고 해서 아래쪽 전하가 무에서 생기는 것은 아닙니다. 아래 실리콘에는 이동 전하가 드나들거나 공급되는 경로가 필요합니다. 이 글은 그 경로가 있고 충분히 기다려 표면 전하가 새 전압을 따라온 경우를 계산합니다.</p><p className="leading-7">따라서 같은 전압이라도 전하를 공급받기 전에 너무 빨리 읽은 결과까지 보장하지 않습니다. 전극은 제어를 맡고 실리콘 쪽의 공급 경로는 필요한 전하를 제공합니다. 두 역할을 구별한 채 치수를 정하겠습니다.</p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 10 nm와 100 µm²의 작은 면을 고릅니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">모든 치수와 전압은 <strong>가정</strong>입니다. 면적 100 µm²의 전극 아래에 두께 10 nm의 산화실리콘 절연층과 p형 실리콘을 둡니다. 바탕을 0 V로 놓고 전극에 1.0 V를 겁니다. 전자가 충분히 모이는 기준 전압은 별도로 0.5 V라고 둡니다.</p><p className="leading-7">
            기준을 넘은 전압은 1.0−0.5=0.5 V입니다. 이때 간단한 표면 전하 모델은 약 −0.173 pC, 전자 수로 약 108만 개를 줍니다. 면적과 두께가 이 숫자에 어떻게
            들어가는지 차례로 계산할 것입니다.
          </p><p className="leading-7">전자 공급 영역은 실리콘 바탕과 같은 전위에 연결하고 충분히 기다렸다고 가정합니다. 뒤에서 비교할 MIT 강의안도 별도의 전자 공급 영역을 포함합니다. 아래 그림은 표면을 제어하는 수직 방향만 줄여 그린 것입니다.</p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 제어하는 전극과 전하가 모이는 자리는 떨어져 있습니다</h2>
<NumericPath title="위에서 아래로 읽는 세 층" steps={[{"label": "위 전극", "value": "전압 1.0 V", "detail": "아래쪽에 작용하는 전기장을 바꿉니다."}, {"label": "절연층", "value": "두께 10 nm", "detail": "전극의 직류가 바로 건너지 못합니다."}, {"label": "실리콘 표면", "value": "면적 100 µm²", "detail": "전기장에 따라 이동 전하가 재배치됩니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">전극 전압을 높이면 p형 표면의 양전하 정공이 밀려납니다. 더 높인 상태에서 필요한 전자가 공급되면 표면에 전자가 많아집니다. 깊은 바탕 전체를 다른 종류의 실리콘으로 바꾸는 일이 아니라 얇은 표면의 이동 전하를 바꾸는 일입니다.</p><p className="leading-7">그림에 수직 화살표를 그렸다고 해서 전자가 위 전극에서 아래로 절연층을 통과한다는 뜻은 아닙니다. 화살표는 전기장의 제어가 닿는 방향입니다. 전자의 공급 경로는 실리콘 쪽에 따로 있습니다.</p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 두께만으로 전자 수를 정할 수 없습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">절연층이 얇을수록 같은 전압 차이로 더 많은 전하를 마주 모을 수 있습니다. 면적을 넓혀도 총 전하가 늘어납니다. 그러나 전극 전압 전부가 곧바로 표면 전자를 늘리는 데 쓰이지는 않습니다. 재료의 차이와 표면에서 정공을 밀어내는 과정도 전압에 영향을 줍니다.</p><p className="leading-7">
            그래서 치수에서 전하를 모으는 비례값을 구합니다. 그다음 전극 전압 중 얼마가 추가 전자를 모으는 데 쓰이는지 정합니다. 이번에는 뒤의 기준을 0.5 V로 가정했습니다. 두께
            10 nm만 보고 그 문턱이 자동으로 나온 것은 아닙니다.
          </p><p className="leading-7">또 전극 전압을 바꾸려면 위쪽 전극의 전하도 다시 채워야 합니다. 안정된 뒤 직류가 작다는 사실만으로 바꿀 때 드는 전류와 에너지가 0이 되지는 않습니다. 이제 세 층과 표면 상태의 이름을 붙이겠습니다.</p></div>
</section>

<section id="stack" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 세 층의 구조에 MOS라는 이름을 붙입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            위에서 아래로 금속 전극, 산화실리콘 절연층, p형 실리콘을 놓습니다.
            전극과 실리콘에 반대 부호의 전하가 모이면 둘 사이에 전기장이
            생깁니다. 절연층은 정상 상태의 직류가 전극에서 실리콘으로 바로
            넘어가는 것을 막지만 전기장은 전달합니다. 그래서 전극에 전압을
            걸어 표면을 조절할 수 있습니다.
          </p>
          <p className="leading-7">
            이 구조를 <strong>금속–산화막–반도체(MOS) 축전기</strong>라고
            부릅니다. 축전기는 두 쪽에 전하를 따로 모아 놓는 구조입니다.
            전압을 바꾸는 순간에는 두 쪽의 전하량이 변하므로 입력 전류가
            잠깐 흐릅니다. 절연막이 있다는 말을 ‘전원에서 언제나 전류를
            전혀 쓰지 않는다’는 뜻으로 읽으면 스위칭 비용을 놓칩니다.
          </p>
          <p className="leading-7">
            Kahng이 1960년에 출원한 미국 특허 3,102,230은 산화실리콘으로 덮은 실리콘 위의 전극에 전압을 가해 산화막을 가로지르는 전기장을 바꾸는 장치를 기술합니다. 원문의
            장치는 여러 접합과 부하를 포함한 회로입니다. 이 글에서 그린 표면의 수직 단면이나 10 nm·100 µm² 수치와 같은 장치라고 주장하지 않습니다.
          </p>
          <p className="leading-7"><em>구조의 핵심은 절연층이 전극의 직류 통로를 끊으면서도 전기장은 실리콘에 닿게 한다는 점입니다.</em></p>
        </div>
        <CitationBlock
          source="D. Kahng, US Patent 3,102,230, ‘Electric Field Controlled Semiconductor Device,’ 1960년 출원·1963년 등록, 명세서 1–2쪽과 도 1A"
          citeKey={1}
          href="https://patents.google.com/patent/US3102230A/en"
        >
          특허 명세서는 실리콘 표면의 산화막, 그 위의 전극, 산화막을 가로지르는
          전기장을 만드는 별도 전압원을 명시합니다. 도 1A의 여러 접합과
          회로까지 이 글의 표면의 수직 단면 모델에 그대로 옮기지는 않습니다. 특허
          예시의 산화막은 약 1000 Å이며, 본문의 10 nm는 별도 가정입니다.
        </CitationBlock>
</section>

<section id="states" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 같은 표면을 낮은 전압에서 높은 전압으로 따라갑니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            p형 실리콘에는 정공이 많습니다. 전극을 실리콘보다 충분히 낮은
            전위에 두면 양전하 정공이 표면으로 끌려옵니다. 표면의 원래
            다수 전하가 더 많아진 상태를 <strong>축적</strong>이라고 합니다.
            반대로 전극 전위를 올리면 정공이 표면에서 밀려나고 음전하
            억셉터 이온이 드러납니다. 움직이는 전하가 줄어든 층이
            <strong>공핍</strong>입니다.
          </p>
          <p className="leading-7">
            전위를 더 올리면 소수였던 전자가 표면에 모입니다. 표면에서
            전자가 정공보다 많아지는 상태를 <strong>반전</strong>이라고
            부릅니다. 실리콘 전체가 n형으로 바뀌는 것은 아닙니다. 전극
            바로 아래 얇은 표면의 이동 전하가 바뀌는 것입니다. 앞 글의
            p–n 접합에서는 농도 차이로 경계를 건너는 확산을 보았습니다.
            여기서는 절연층 너머의 전기장이 한쪽 표면의 전하를 재배치합니다.
          </p>
          <p className="leading-7"><em>전극을 낮추면 정공 축적, 조금 높이면 공핍, 더 높이면 표면 전자의 반전으로 이어집니다.</em></p>
        </div>
        <MosSurfaceViz /><h3 id="threshold" className="mt-8 text-xl font-semibold">0.5 V 기준을 넘긴 1.0 V를 읽기</h3><div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            전극 전압 0 V가 모든 소자에서 표면 전기장 0을 뜻하지는 않습니다.
            전극과 실리콘의 일함수 차이, 산화막과 경계의 전하 때문에
            띠가 평평해지는 전압이 따로 있습니다. 이를 <strong>평탄띠 전압</strong>
            이라고 합니다. 그 기준을 지나도 공핍층을 만들기 위해 전압의
            일부가 쓰입니다.
          </p>
          <p className="leading-7">
            표면 전자가 충분히 많아져 강한 반전에 들어가는 기준을
            <strong>문턱 전압</strong>이라고 부릅니다. 예제에서는 이 값을
            0.5 V, 평탄띠 전압을 0 V로 <strong>가정</strong>합니다.
            이는 10 nm 두께만으로 정해지는 값이 아닙니다. 도핑 농도와
            전극 재료, 산화막과 계면 전하가 바뀌면 문턱도 달라집니다.
            1.0 V의 전극 전압은 이 가정한 문턱보다 0.5 V 높은 상태입니다.
          </p>
          <p className="leading-7"><em>이제 예제의 1.0 V 가운데 0.5 V를 표면 반전 전하를 늘리는 여분의 전압으로 읽을 수 있습니다.</em></p>
        </div>
</section>

<section id="numbers" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 원문의 면적당 식에 면적과 여분 전압을 넣습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">MIT 강의안 30쪽의 <code>Cox*=εox/tox</code>는 면적당 용량입니다. 3.9×8.854×10⁻¹² F/m를 10⁻⁸ m로 나누면 3.453×10⁻³ F/m²입니다. 100 µm²는 10⁻¹⁰ m²이므로 면적을 곱하면 약 3.453×10⁻¹³ F, 곧 0.3453 pF입니다. 면적당 값과 전체 값을 구별해야 단위가 맞습니다.</p></div><div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            산화실리콘의 유전율은 진공 유전율의 약 3.9배입니다. 이 글의 10 nm 두께와 100 µm² 면적을 넣으면 절연층을 사이에 둔 두 면이 전하를 모으는 능력은 약 0.345
            pF입니다. 문턱보다 0.5 V 높은 만큼의 추가 표면 전하를 이 용량에 곱하면 약 0.173 pC가 됩니다. 전자의 기본 전하량으로 나누면 약 108만 개입니다. 음수 부호는
            모인 전하가 전자라는 뜻입니다.
          </p>
        </div>
        <ExplainedFormula
          question="가정한 1.0 V에서 표면에 추가로 모이는 전자는 몇 개입니까?"
          idea="먼저 산화막의 면적당 전하 저장량을 두께에서 구하고, 면적과 문턱을 넘은 전압을 곱합니다."
          formula={String.raw`Q_{inv}\approx-C_{ox}(V_G-V_{th})`}
          annotatedFormula={String.raw`\underbrace{Q_{inv}}_{\text{전자 전하}}\approx-C_{ox}\Delta V`}
          operations={[
            { expression: String.raw`C_{ox}=\epsilon_{ox}A/t_{ox}`, annotation: "먼저 유전율·면적·두께에서 절연층 용량을 구합니다." },
            { expression: String.raw`C_{ox}\approx0.345\,\mathrm{pF}`, annotation: "3.9×8.854×10⁻¹² F/m, 100 µm², 10 nm를 대입합니다." },
            { expression: String.raw`V_G-V_{th}=0.5\,\mathrm V`, annotation: "가정한 1.0 V와 문턱 0.5 V의 차이입니다." },
            { expression: String.raw`|Q_{inv}|\approx0.173\,\mathrm{pC}`, annotation: "용량과 문턱을 넘은 전압을 곱합니다." },
            { expression: String.raw`N\approx1.08\times10^6`, annotation: "전자 한 개의 전하량 1.602×10⁻¹⁹ C로 나눈 약 108만 개입니다." },
          ]}
          terms={[
            { symbol: "C_{ox}", name: "절연층 용량", description: "이 글의 면적 100 µm² 전체에서 약 0.345 pF입니다." },
            { symbol: "ε_{ox}", name: "산화막 유전율", description: "진공 유전율 약 8.854×10⁻¹² F/m에 상대 유전율 3.9를 곱합니다." },
            { symbol: "A,t_{ox}", name: "전극 면적과 산화막 두께", description: "각각 100 µm²와 10 nm로 둔 가정입니다." },
            { symbol: "V_G,V_{th}", name: "전극 전압과 문턱", description: "각각 1.0 V와 0.5 V로 둔 가정입니다." },
            { symbol: "ΔV", name: "문턱을 넘은 전압", description: "전극 전압에서 문턱을 뺀 0.5 V입니다." },
            { symbol: "Q_{inv}", name: "추가 반전 전하", description: "음수는 전자가 모였다는 부호입니다. 공핍층 전하와 구분합니다." },
          ]}
          assumptions={["평탄띠 전압 0 V·문턱 0.5 V를 별도로 가정합니다.", "강한 반전의 간단한 전하 시트 모델이며 가장자리와 계면 결함을 무시합니다.", "바탕과 같은 전위의 전자 공급 영역이 있고 충분히 기다린 정적 상태입니다.", "숫자는 실제 소자나 1960년 특허의 측정값이 아닙니다."]}
          interpretation="면적 100 µm²의 표면에 추가로 약 −0.173 pC, 즉 전자 약 108만 개가 모입니다. 면적당 약 1.08×10¹²개/cm²입니다."
        />
        <CitationBlock
          source="MIT OpenCourseWare 6.012, Lecture 9, ‘MOS Capacitors I’ (2009), 23·30쪽"
          citeKey={2}
          href="https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/42c863e2e1e9744ce6b797646a30e463_MIT6_012F09_lec09.pdf"
        >
          강의안 23쪽의 반전 표면 전하 식 q<sub>N</sub>* = −C<sub>ox</sub>*(v<sub>GB</sub>−V<sub>T</sub>)와
          30쪽의 C<sub>ox</sub>* = ε<sub>ox</sub>/t<sub>ox</sub>를 직접 대조했습니다.
          별표는 면적당 값입니다. 이 글은 여기에 가정한 면적을 곱해 총 전하로
          바꿨습니다. 문턱 전압은 두께만으로 유도한 값이 아닙니다.
        </CitationBlock>
        <div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7"><em>같은 예제의 10 nm·100 µm²·0.5 V를 따라가면 0.345 pF에서 0.173 pC, 다시 전자 약 108만 개로 이어집니다.</em></p>
        </div>
</section>

<section id="source-supply" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 원문이 둔 전자 공급 조건까지 같이 가져옵니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">MIT 강의안 23쪽의 <code>qN*=−Cox*(vGB−VT)</code>에 앞서 구한 3.453×10⁻³ F/m²와 여분 전압 0.5 V를 넣으면 −1.7265×10⁻³ C/m²입니다. 면적 10⁻¹⁰ m²를 곱해 −0.17265 pC를 얻고, 전자 한 개의 전하량으로 나누면 약 1.078×10⁶개입니다. 별표가 있는 면적당 식을 총 전하로 바꾼 경로입니다.</p><p className="leading-7">같은 자료 4쪽은 그림의 n+ 영역을 잊으면 안 된다고 하면서 “we will need electrons, and they will come from there”라고 적습니다. 이 글도 전자 공급 영역을 바탕과 같은 전위에 둔 조건을 가정했습니다. 절연층 위 전극은 전기장으로 제어하고, 전자는 이 공급 경로를 통해 표면에 모입니다. <a href="https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/42c863e2e1e9744ce6b797646a30e463_MIT6_012F09_lec09.pdf#page=4" target="_blank" rel="noopener noreferrer">원문 4쪽의 구조와 주석</a>을 식의 조건과 함께 읽어야 합니다.</p><p className="leading-7">
            위의 약 108만 개는 새 전압에서 충분히 전하를 공급받은 정적 계산입니다. 공급이 늦거나 전압을 너무 빨리 바꾼 실제 구조라면 같은 시간에 이 숫자에 도달했다고 할 수
            없습니다. 전하 수를 계산한 뒤에는 그 전하가 도착하는 시간도 확인해야 합니다.
          </p></div>
</section>

<section id="limits" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 치수와 전압을 바꾸면 무엇을 다시 확인해야 할까요?</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            절연층을 절반인 5 nm로 줄이고 문턱을 같은 값으로 고정한다고 가정하면 용량과 같은 여분 전압에서의 전하는 두 배가 됩니다. 실제 소자에서는 두께를 바꾸면 문턱과 누설도 함께
            바뀔 수 있어 이 두 배를 제품 예측으로 쓰면 안 됩니다. 아주 얇은 절연층에는 터널링 누설이 생기며 두꺼우면 같은 전압으로 전하를 모으기 어려워집니다.
          </p>
          <p className="leading-7">
            정지한 상태의 이상 절연층은 직류를 막지만 전극 전압을 바꾸는 동안에는 전하를 충전해야 합니다. 108만 전자를 한 번 옮기는 데도 시간과 에너지가 듭니다. 또 실제 계면에는
            붙잡힌 전하가 있어 같은 전극 전압이 같은 표면 전하를 늘 만들지는 않습니다. 절연층 재료와 두께, 온도, 동작 속도를 함께 봐야 합니다.
          </p>
          <p className="leading-7"><em>0.173 pC는 강한 반전의 정적 근삿값입니다. 충전 시간·누설·계면 전하를 따지면 실제 스위치 판단으로 넘어갈 수 있습니다.</em></p>
        </div><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">다른 가정을 고정하고 두께만 5 nm로 줄인 이상 용량은 약 0.691 pF입니다. 같은 0.5 V 여분 전압의 전하도 두 배가 됩니다. 실제 소자에서는 문턱과 누설·공급 속도가 함께 바뀔 수 있어 이 값은 조건부 비교입니다.</p><p className="leading-7">
            또 문턱은 전자가 하나도 없다가 갑자기 생기는 선이 아닙니다. 약한 반전에서 강한 반전으로 넘어가는 기준이며 여기의 선형 전하식은 강한 반전에서 추가 전하를 근사합니다. 그
            범위를 벗어나면 표면 전하를 더 자세한 모델로 구해야 합니다.
          </p></div>
</section>

<section id="handoff" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 그림과 단위를 써서 다음 결과를 예측합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            지금까지는 전극 아래의 표면만 보았습니다. 다음 글에서는 그 표면 양쪽에 전자가 들어오고 나가는 단자를 붙입니다. 전극 전압으로 만든 전자 층이 두 단자를 이어 줄 때 표면
            전하의 변화가 회로의 전류 변화로 바뀝니다.
          </p>
          <p className="leading-7">
            <Link to="/electronics/devices/pn-junction-and-rectification#bias">앞 글의 접합</Link>에서는
            직접 맞닿은 두 영역의 장벽을 조절했습니다. 여기서는 절연층
            너머 전기장으로 표면을 조절했습니다. 두 구조가 같은
            ‘전압으로 전류를 바꾸기’라는 결과에 도달하는 경로는 다릅니다.
          </p>
          <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> p형 실리콘의 전극 전위를 낮추면 표면에 어느 전하가 모일까요? (답: 7절) 10 nm를 5 nm로 줄이면 같은 가정 아래 용량은 어떻게 달라질까요? (답: 10절) 절연층이 직류를 막는데 왜 전극 전압을 바꿀 때 입력 전류가 필요할까요? (답: 5·6절)</p>
        </div>
</section>
</div>;
}
