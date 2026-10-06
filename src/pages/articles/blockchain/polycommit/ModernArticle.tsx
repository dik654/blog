import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import ZkCaseDiagram from "../ZkCaseDiagram";

/** 원문 확인: 2026-10-04. 작은 수치는 별도 가정입니다. */
export default function Article() { return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">1. 긴 계산표를 고정한 뒤 한 질문에 짧게 답하려면</h2>
<p className="leading-8">계산표 전체를 매번 보내는 대신 먼저 그 표를 바꾸지 않겠다는 짧은 자료를 보내고 싶습니다. 이후 특정 위치의 값만 물었을 때, 처음 정한 표에 들어 있던 값인지 확인할 수 있어야 합니다.</p>
<p className="leading-8">이 글은 다항식 하나의 값을 확인하는 일을 다룹니다. 내용을 나중에 바꾸기 어렵다는 것과 내용을 숨긴다는 것은 다르므로 두 목표를 계산과 보안 조건에서 따로 확인합니다.</p>

<p data-stage-bridge="overview" className="text-sm leading-7 text-muted-foreground">짧은 자료와 부분 검사의 목적을 잡았습니다. 전체 값을 보내지 않는 흐름부터 봅니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">2. 먼저 고정하고 나중에 위치를 정합니다</h2>
<p className="leading-8">만드는 쪽은 함수 전체를 정한 뒤 짧은 고정값을 보냅니다. 확인하는 쪽은 물을 위치를 정합니다. 만드는 쪽은 그 위치의 답과 답이 맞다는 자료를 보냅니다.</p>
<p className="leading-8">답을 본 뒤 함수를 바꾸도록 허용하면 어느 숫자든 맞는 함수 하나를 새로 만들 수 있습니다. 처음과 나중에 같은 함수를 사용했다는 연결이 필요합니다.</p>

<p data-stage-bridge="black-box" className="text-sm leading-7 text-muted-foreground">고정과 질문의 순서를 나눴습니다. 세 계수와 한 위치를 선택합니다.</p>
</section>
<section id="case" data-teach-level="0" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">3. 제곱하고 두 배를 더한 뒤 3을 더하면</h2>
<p className="leading-8">17로 나눈 나머지에서 f(X)=X²+2X+3으로 계산한다고 합시다. 위치 4에서는 16+8+3=27의 나머지 10입니다. 이 숫자들은 설명용 가정입니다. 만드는 쪽은 계수(3,2,1)를 먼저 고정하고 나중에 4에서의 값 10을 엽니다.</p>
<p className="leading-8">답을 11로 바꾸면 처음 함수와 맞지 않습니다. 그 차이를 드러내는 방법은 f(X)−10을 X−4로 나누어보는 것입니다. 실제 곱셈 (X−4)(X+6)은 X²+2X−24로,17에서 X²+2X−7과 같으므로 f(X)−10입니다.</p>

<p data-stage-bridge="case" className="text-sm leading-7 text-muted-foreground">10일 때 나머지가 0이 되는 구조를 확인했습니다. 자료의 각 부분이 맡는 일을 그립니다.</p>
</section>
<section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">4. 함수 고정값과 몫의 고정값을 대조합니다</h2>
<p className="leading-8">처음 자료는 f를 정해 두었다는 흔적입니다. 다음 자료는 몫 X+6을 정해 두었다는 흔적입니다. 확인하는 쪽은 두 자료 사이에 “원래 함수−10=(X−4)×몫”의 관계가 있는지 검사합니다.</p>
<p className="leading-8">전체 계수를 보내지 않고도 이 관계를 검사하려면 값을 숨긴 형태에서 덧셈·곱셈 관계를 확인하는 암호 연산이 필요합니다. 지금 다항식 계산은 그 연산에 넘길 조건입니다.</p>
<ZkCaseDiagram title="정한 함수에서 4의 값만 확인하기" steps={["f=X²+2X+3 · z=4", "f−10=(X−4)(X+6)", "답 10의 일관성 확인"]} arrows={["몫 계산", "고정 자료 대조"]} />
<p data-stage-bridge="picture" className="text-sm leading-7 text-muted-foreground">검사할 항등식을 정했습니다. 차수와 비밀 준비값이 왜 별도 조건인지 봅니다.</p>
</section>
<section id="need" data-teach-level="2" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">5. 작은 고정값만으로 모든 보장이 생기지는 않습니다</h2>
<p className="leading-8">함수의 차수가 2 이하라는 약속도 지켜야 합니다. 위치 4에서만 같은 값을 갖는 고차 함수를 나중에 고를 수 있으면 처음 약속과 다른 함수를 검증할 수 있습니다.</p>
<p className="leading-8">계수가 작은 후보 집합에 있다면 각 후보를 고정해 대조하는 공격도 생각해야 합니다. 자료가 작다는 사실은 후보 검색을 막아 주지 않습니다. 내용 보호가 필요하면 무작위로 가리는 절차가 따로 필요합니다.</p>

<p data-stage-bridge="need" className="text-sm leading-7 text-muted-foreground">변경 방지·차수·비밀 보호가 별개임을 확인했습니다. 각 역할의 이름을 붙입니다.</p>
</section>
<section id="names" data-teach-level="3" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">6. 다항식 커밋먼트의 인터페이스와 세 계열</h2>
<p className="leading-8">함수 전체를 고정하는 작업은 Commit, 특정 위치의 값을 여는 작업은 Open, 이를 확인하는 작업은 Verify입니다. 이 인터페이스를 다항식 커밋먼트, PCS라고 합니다. 고정 이후 답을 바꾸기 어려운 성질은 evaluation binding입니다.</p>
<p className="leading-8">KZG는 준비된 군 원소와 페어링을 사용해 몫 관계를 검사합니다. IPA는 다항식 평가를 벡터 내적으로 바꾸고 양쪽 벡터를 반복해서 접습니다. FRI 계열은 넓은 평가표가 낮은 차수 함수에 가까운지 일부 위치를 읽어 검사합니다.</p>
<p className="leading-8">SRS는 미리 만든 구조화된 공개 자료입니다. KZG의 비밀 지수 τ 자체를 알고 있으면 거짓 답에 맞는 몫 값을 꾸밀 수 있으므로 그 지수가 알려지지 않았다는 조건이 필요합니다. 이 조건은 공개 자료의 크기나 파일 해시와 다른 문제입니다.</p>

<p data-stage-bridge="names" className="text-sm leading-7 text-muted-foreground">세 계열이 검사하는 구조를 연결했습니다. 같은 함수의 몫과 거짓 답을 끝까지 계산합니다.</p>
</section>
<section id="commit-open" data-teach-level="4" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">7. 10을 11로 바꾸면 정확한 나눗셈이 깨집니다</h2>
<p className="leading-8">정상 답 10에서는 몫 q=X+6입니다. 답 11을 주장하면 f(X)−11=X²+2X−8이고 X−4로 나눈 나머지는 f(4)−11=−1≡16입니다. 따라서 다항식 몫만으로 항등식을 만족시킬 수 없습니다.</p>
<p className="leading-8">KZG에서는 C=[f(τ)]₁, π=[q(τ)]₁을 만들고 페어링으로 f(τ)−y=q(τ)(τ−z)를 검사합니다. [a]는 지수 a를 직접 공개하지 않는 군 원소라는 표기입니다. 이 식이 정상 입력을 받아들이는 이유는 앞의 다항식 항등식입니다. 거짓 답을 만들기 어렵다고 말하려면 별도의 암호 가정과 차수 제한이 필요합니다.</p>
<p className="leading-8">τ=7을 모두 알고 있는 장난감 경우를 보겠습니다. f(7)=66≡15입니다. 거짓 답 11에 대해 (15−11)/(7−4)=4/3≡7을 구할 수 있어 π=[7]로 평가점의 등식을 맞춥니다. 이 예는 비밀 준비값 노출의 문제이며 안전한 SRS에서는 τ를 알려 주지 않습니다.</p>
<ExplainedFormula question="몫이 존재하는 조건은 왜 평가값의 정확성을 뜻하나요?" idea="다항식 나눗셈의 나머지는 X=z를 넣었을 때 f(z)−y입니다. 나머지가 0이면 X−z가 인수입니다." formula={String.raw`f(X)-y=(X-z)q(X),\qquad q(X)=X+6`} annotatedFormula={String.raw`f(X)-y=(X-z)q(X),\qquad q(X)=X+6`} operations={[{"expression": "f(X)-y", "annotation": ["같은 함수에서 주장한 답 10을 뺍니다."]}, {"expression": "(X-z)q(X)", "annotation": ["X−4와 X+6의 곱이 그 차이와 같아야 합니다."]}]} terms={[{"symbol": "f", "name": "고정한 다항식", "description": "X²+2X+3입니다."}, {"symbol": "z,y", "name": "질문 위치와 답", "description": "4와 10입니다."}, {"symbol": "q", "name": "몫 다항식", "description": "정확한 나눗셈에서 얻은X+6입니다."}]} interpretation="y=11이면 나머지가 16이므로 같은 조건을 만족하는 다항식 q가 없습니다." assumptions={["차수 제한과 동일한 체를 사용합니다.", "이 항등식은 correctness이며 KZG의 binding 보안 증명 자체가 아닙니다."]} /><AlgorithmBlock title="평가 증명의 몫 계산 (의사코드)" input={["계수 f, 위치 z, 주장 y, 체 연산"]} steps={[{"code": "g ← f; g[0] ← g[0] − y", "note": "상수항에서 주장값을 뺍니다."}, {"code": "(q,remainder) ← divide_polynomial(g, X−z)", "note": "계수별 정확한 나눗셈입니다."}, {"code": "remainder ≠ 0이면 거절; 아니면 q를 증명에 사용", "note": "군 커밋먼트 방식은 별도로 선택합니다."}]} output="y=10이면 q=X+6, y=11이면 나머지 16" />
<p data-stage-bridge="commit-open" className="text-sm leading-7 text-muted-foreground">정상 몫과 준비값 노출 시 위조를 나눴습니다. 원문의 실제 검증 식에 값을 대응합니다.</p>
</section>
<section id="source" data-teach-level="5" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">8. 원문도 인수정리로 짧은 평가 증거를 만듭니다</h2>
<p className="leading-8">KZG 원문의 함수 기호는 φ, 질문 위치는 i, 준비값은 α입니다. 이 글의 f,z,τ에 각각 대응합니다. 원문은 ψᵢ(X)=(φ(X)−φ(i))/(X−i)를 만들고 그 준비점 평가를 군 원소로 보냅니다.</p>
<p className="leading-8">φ=X²+2X+3, i=4, φ(i)=10을 넣으면 ψ₄=X+6입니다. 원문의 검증 관계에서 준비값을 교육용으로 7이라고 두면 지수 수준에서 φ(7)=15, ψ₄(7)=13이고 13×(7−4)+10=49≡15입니다. 실제 검증자가 α=7을 안다는 뜻이 아니라 항등식 검산을 위한 가정입니다.</p>
<div id="source-kzg-quotient"><CitationBlock source="Kate·Zaverucha·Goldberg §3.2, CreateWitness·VerifyEval, PDF p.7" citeKey={1} href="https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf"><p className="leading-8">원문: <q>φ(x) = ψᵢ(x)(x − i) + φ(i)</q></p><p className="leading-8">φ(7)=15와 ψ₄(7)=13을 대입하면 13×3+10≡15입니다.</p></CitationBlock></div><div id="paper-kzg"><CitationBlock source="Constant-Size Commitments to Polynomials and Their Applications (2010)" citeKey={2} href="https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf"><p className="leading-8"><strong>문제:</strong> 함수 전체를 보내지 않고 특정 평가를 짧게 확인합니다.</p><p className="leading-8"><strong>기여:</strong> 인수정리를 군 원소와 페어링 검사로 연결합니다.</p><p className="leading-8"><strong>전제:</strong> 차수가 제한된 준비 자료와 해당 SDH 계열 가정을 사용합니다.</p><p className="leading-8"><strong>근거 범위:</strong> 원문의 CreateWitness·VerifyEval 식과 차수가 제한된 커밋먼트 구성의 분석입니다. 이 글에서는 f(4)=10의 몫 X+6으로 대조합니다.</p><p className="leading-8"><strong>일반화할 수 없는 결론:</strong> 임의 작은 후보 다항식의 은닉이나 양자 내성을 자동 보장하지 않습니다.</p></CitationBlock></div>
<p data-stage-bridge="source" className="text-sm leading-7 text-muted-foreground">원문 기호에서도 같은 13×3+10이 15로 돌아왔습니다. 내적을 접는 방식과 비교합니다.</p>
</section>
<section id="schemes" data-teach-level="6" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">9. 같은 10을 벡터 내적으로 쓰고 절반으로 접습니다</h2>
<p className="leading-8">계수를 a=(3,2,1,0), 질문의 거듭제곱을 b=(1,4,16,0)으로 놓으면 내적은 27≡10입니다. 마지막 0은 길이를 4로 맞추기 위한 패딩입니다. 앞 절의 몫과 같은 평가값을 다른 연산 구조로 썼습니다.</p>
<p className="leading-8">원문의 접기 규칙처럼 a′=x aL+x⁻¹aR, b′=x⁻¹bL+x bR로 둡니다. 가정한 질문 x=2, 역수 9를 넣으면 a′=(15,4), b′=(7,2)입니다. 새 내적은 113≡11로, 원래 10과 같지 않습니다. 교차 내적 L=14,R=1을 함께 반영해야 10+2²×14+2⁻²×1≡11이 됩니다.</p>
<p className="leading-8">이 교차항을 연결하는 군 자료와 최종 내적 검사가 IPA의 일부입니다. 단순히 숫자 벡터를 절반으로 줄였다는 것만으로 증명이 되지는 않습니다. 원소 관계를 모르는 생성자와 올바른 질문 순서도 필요합니다.</p>
<div id="source-ipa"><CitationBlock source="Bulletproofs (2017/1066) · §3, PDF p.13, inner-product argument" citeKey={1} href="https://eprint.iacr.org/2017/1066.pdf"><p className="leading-8">원문: <q>inner product argument</q></p><p className="leading-8">논문의 양쪽 벡터 접기에서 x=2를 넣으면(15,4)와(7,2), 교차항을 포함한 새 내적 11을 얻습니다.</p></CitationBlock></div><div id="paper-bulletproofs-ipa"><CitationBlock source="Bulletproofs · Inner-product argument, §3" citeKey={3} href="https://eprint.iacr.org/2017/1066.pdf"><p className="leading-8"><strong>문제:</strong> 두 긴 벡터의 내적 주장을 짧은 자료로 확인합니다.</p><p className="leading-8"><strong>기여:</strong> 교차항을 공개 자료에 묶고 질문으로 벡터 길이를 절반씩 줄입니다.</p><p className="leading-8"><strong>전제:</strong> 소수 차수 군과 이산로그 가정, 올바른 질문 순서를 사용합니다.</p><p className="leading-8"><strong>근거 범위:</strong> 이 글은 논문의 내적 논증 한 단계를 4개 항에서 2개 항으로 계산했습니다.</p><p className="leading-8"><strong>일반화할 수 없는 결론:</strong> 한 단계의 산술이 전체 범위 증명이나 숨김 성질을 대신하지는 않습니다.</p></CitationBlock></div><div id="paper-halo-ipa"><CitationBlock source="Halo: Recursive Proof Composition without a Trusted Setup" citeKey={2} href="https://eprint.iacr.org/2019/1021.pdf"><p className="leading-8"><strong>문제:</strong> 재귀 검증에서 커밋먼트 검사의 비용과 준비 가정을 다룹니다.</p><p className="leading-8"><strong>기여:</strong> 내적 기반 커밋먼트와 검증 누적을 연결합니다.</p><p className="leading-8"><strong>전제:</strong> 곡선과 이산로그, 논문의 누적 검증 조건을 사용합니다.</p><p className="leading-8"><strong>근거 범위:</strong> 해당 Halo 구성의 내적 기반 커밋먼트와 재귀 검증 누적 범위입니다. 모든 IPA 구현의 성능 비교를 제공하는 근거는 아닙니다.</p><p className="leading-8"><strong>일반화할 수 없는 결론:</strong> 모든 IPA 방식의 비용이나 양자 내성이 같다는 뜻은 아닙니다.</p></CitationBlock></div>
<p data-stage-bridge="schemes" className="text-sm leading-7 text-muted-foreground">접힌 내적의 11과 처음 평가 10을 잇는 교차항을 확인했습니다. 선택에 필요한 보안 차이를 정리합니다.</p>
</section>
<section id="selection" data-teach-level="7" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">10. 준비 방식·검증 비용·은닉을 같은 표에서 읽습니다</h2>
<p className="leading-8">KZG의 짧은 opening에는 구조화된 준비 자료와 페어링 가정이 붙습니다. IPA는 비밀 준비값 없이 생성자를 만들 수 있지만 이산로그 가정과 검증자의 군 연산 비용이 남습니다. 둘 다 이산로그 문제를 효율적으로 푸는 양자 공격에 그대로 안전한 방식은 아닙니다.</p>
<p className="leading-8">FRI 계열은 해시와 부호의 근접성 검사로 다른 가정을 택합니다. 해시를 쓴다고 모든 매개변수와 Fiat–Shamir 변환까지 양자 안전하다는 뜻은 아닙니다. 또한 낮은 차수 검사는 비밀 보호와 별개이며 실제 영지식 구성을 위한 가리기가 필요합니다.</p>
<p className="leading-8">같은 계수 수·질문 수·보안 목표에서 준비 자료 크기, 증명 크기, 생성 시간, 검증 시간과 최대 메모리를 비교합니다. y,z,차수,공개 입력을 각각 바꾸었을 때 거절되는지도 확인해야 합니다. 다음 <a href="/cs/crypto/fri">FRI 글</a>은 긴 평가표의 차수를 일부만 읽고 검사하는 방법을 계산합니다.</p>

<p data-stage-bridge="selection" className="text-sm leading-7 text-muted-foreground">한 평가값 10을 몫과 내적으로 각각 검사했고 각 방식의 비용과 가정도 구분했습니다.</p>
<ReviewPrompts questions={["답 10을 11로 바꾸면 나눗셈 나머지는 얼마인가요? (답: 7절)", "τ=7을 알고 있다면 거짓 답 11에 맞는 지수를 어떻게 구하나요? (답: 7절)", "벡터를 접은 내적 11이 처음 10과 달라도 어떤 교차항을 더하면 연결되나요? (답: 9절)"]} />
</section>
</article>; }
