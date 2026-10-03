import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import ZkCaseDiagram from "../ZkCaseDiagram";

/** 원문 확인: 2026-10-04. 작은 수치는 별도 가정입니다. */
export default function Article() { return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">1. 비밀을 보내지 않고 알고 있다는 사실을 보이려면</h2>
<p className="leading-8">접속할 때마다 비밀 번호 자체를 보내면 받는 사람이 그 번호를 보관하거나 다시 쓸 수 있습니다. 비밀을 가진 사람만 제대로 답할 수 있는 질문을 보내되, 오간 답에서는 비밀이 더 드러나지 않도록 만들고 싶습니다.</p>
<p className="leading-8">이 글에서는 손으로 계산할 수 있는 작은 숫자로 그 순서를 확인합니다. 작은 숫자는 안전한 암호가 아니라 설명용 가정입니다. 실제 보안은 훨씬 큰 수와 올바른 무작위 선택을 필요로 합니다.</p>

<p data-stage-bridge="overview" className="text-sm leading-7 text-muted-foreground">알고 있다는 사실과 비밀 공개를 나눴습니다. 먼저 세 번의 대화를 봅니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">2. 먼저 약속하고 질문을 받은 뒤 답합니다</h2>
<p className="leading-8">비밀을 가진 쪽이 먼저 이번 대화에 쓸 값을 보냅니다. 확인하는 쪽은 그 뒤에 예측하기 어려운 질문을 정합니다. 마지막 답이 처음 값과 공개 정보에 맞는지 검사합니다.</p>
<p className="leading-8">처음 값을 질문 뒤에 정할 수 있다면 질문에 맞춰 꾸민 답을 만들기 쉽습니다. 따라서 보내는 값의 종류만큼이나 순서가 중요합니다.</p>

<p data-stage-bridge="black-box" className="text-sm leading-7 text-muted-foreground">첫 메시지와 질문의 순서를 고정했습니다. 모든 메시지를 실제 숫자로 채웁니다.</p>
</section>
<section id="case" data-teach-level="0" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">3. 12를 보낸 뒤 질문 2에 답 7을 보냅니다</h2>
<p className="leading-8">2를 거듭제곱한 뒤 23으로 나눈 나머지를 사용합니다. 지수는 11마다 되돌아오므로 지수 계산은 11로 나눈 나머지로 합니다. 비밀 4에서 공개값은 2⁴=16입니다. 이번 대화용 숫자 10을 골라 2¹⁰의 나머지 12를 먼저 보냅니다. 모두 가정입니다.</p>
<p className="leading-8">질문 2를 받으면 10+2×4=18을 11로 나눈 7을 답합니다. 확인하는 사람은 2⁷의 나머지 13과 12×16²의 나머지 13이 같은지 봅니다. 실제 비밀 4를 직접 받지 않아도 등식은 맞습니다.</p>

<p data-stage-bridge="case" className="text-sm leading-7 text-muted-foreground">12→2→7의 대화를 계산했습니다. 공개값 16이 양쪽 계산에 어떻게 들어가는지 봅니다.</p>
</section>
<section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">4. 처음 보낸 12와 마지막 답 7이 공개 16으로 이어집니다</h2>
<p className="leading-8">비밀 4는 마지막 답 7을 만들 때 쓰입니다. 받는 쪽은 공개 16을 질문 2만큼 거듭제곱해 처음 받은 12와 곱합니다. 비밀이 들어간 두 경로가 같은 13에 도착하는지를 확인하는 구조입니다.</p>
<p className="leading-8">한 번의 통과에서 곧바로 비밀 4를 계산하는 공식은 주어지지 않습니다. 다만 이 장난감 숫자는 후보가 11개뿐이므로 공개 16만으로도 모든 후보를 쉽게 시도할 수 있습니다.</p>
<ZkCaseDiagram title="첫 메시지 뒤 질문이 정해지는 순서" steps={["공개 16 · 먼저 12 전송", "질문 2 → 답 7", "2⁷ = 12×16² = 13"]} arrows={["질문 도착", "mod 23 검사"]} />
<p data-stage-bridge="picture" className="text-sm leading-7 text-muted-foreground">그림의 양쪽 결과가 13으로 만났습니다. 같은 처음 값을 두 번 쓰면 왜 위험한지 준비합니다.</p>
</section>
<section id="need" data-teach-level="2" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">5. 새 질문마다 처음 고른 수를 새로 써야 합니다</h2>
<p className="leading-8">질문이 2일 때 답 7을 보냈는데 같은 처음 값 12로 질문 5에도 답한다고 합시다. 답은 10+5×4=30의 나머지 8입니다. 두 답을 빼면 처음 고른 10이 없어지고 비밀 4만 남습니다.</p>
<p className="leading-8">정상 대화 하나가 비밀을 더 알려 주지 않는다는 성질과, 서로 다른 두 질문에 답할 수 있는 사람에게서 비밀을 추출할 수 있다는 성질이 함께 작동합니다. 전자는 개인정보 보호를, 후자는 알고 있다는 주장을 뒷받침합니다.</p>

<p data-stage-bridge="need" className="text-sm leading-7 text-muted-foreground">대화 한 번의 비밀성과 두 답의 추출을 구분했습니다. 그 역할에 이름을 붙입니다.</p>
</section>
<section id="names" data-teach-level="3" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">6. 세 메시지·추출기·시뮬레이터를 구분합니다</h2>
<p className="leading-8">먼저 보내는 값을 commitment, 뒤의 질문을 challenge, 마지막 답을 response라고 합니다. 이 세 메시지 구조가 Sigma protocol입니다. 여기서는 비밀 지수의 지식을 보이는 Schnorr 방식을 사용합니다.</p>
<p className="leading-8">같은 첫 메시지에 대한 서로 다른 두 응답에서 비밀을 구하는 절차는 추출기, extractor입니다. 비밀 없이 실제 대화처럼 보이는 자료를 만드는 가상의 절차는 시뮬레이터, simulator입니다. 시뮬레이터가 있다는 것이 영지식 정의의 중심입니다.</p>
<p className="leading-8">값을 나중에 바꾸기 어렵게 묶는 성질은 binding, 값이 무엇인지 드러내지 않는 성질은 hiding입니다. Pedersen commitment는 두 성질이 서로 다른 전제에 기대는 예입니다. 대화 전체의 영지식은 개별 자료 하나의 hiding보다 더 넓은 조건입니다.</p>

<p data-stage-bridge="names" className="text-sm leading-7 text-muted-foreground">메시지와 보안 도구에 이름을 붙였습니다. 두 응답에서 4가 나오는 계산을 끝냅니다.</p>
</section>
<section id="sigma" data-teach-level="4" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">7. 두 답의 차이에서 처음 고른 10을 지웁니다</h2>
<p className="leading-8">같은 12에 대해 (질문 2,답 7)과 (질문 5,답 8)을 얻었다고 합시다. 응답 차이는 −1이고 질문 차이는 −3입니다. 11로 나눈 나머지에서 −3의 역수는 7이므로 (−1)×7=−7≡4입니다. 역수는 곱했을 때 1이 되는 수이며 8×7=56≡1로 검산할 수 있습니다.</p>
<p className="leading-8">이것이 special soundness의 핵심입니다. 추출기의 보안 분석은 같은 첫 메시지에서 다른 질문을 얻는 가상 실행을 사용합니다. 실제 운영에서 같은 무작위 수 10을 재사용하면 공격자도 이 계산을 할 수 있습니다. 첫 메시지가 서로 다르면 지워야 할 수가 달라져 이 식을 그대로 적용할 수 없습니다.</p>
<ExplainedFormula question="왜 두 응답이면 비밀 지수를 구할 수 있나요?" idea="s=r+ew와 s′=r+e′w를 빼서 같은 r을 없앱니다. 남은 질문 차이로 나누면 w가 됩니다." formula={String.raw`w=(s-s^{\prime})(e-e^{\prime})^{-1}\pmod q`} annotatedFormula={String.raw`w=(s-s^{\prime})(e-e^{\prime})^{-1}\pmod q`} operations={[{"expression": "s-s^{\\prime}", "annotation": ["같은 첫 메시지의 무작위 수가 소거됩니다."]}, {"expression": "(e-e^{\\prime})^{-1}", "annotation": ["질문 차이와 곱하면 1이 되는 수를 곱합니다."]}]} terms={[{"symbol": "w", "name": "비밀 지수", "description": "공개 Y=gʷ를 만든 수입니다."}, {"symbol": "s,s′", "name": "두 응답", "description": "7과 8입니다."}, {"symbol": "e,e′", "name": "두 질문", "description": "2와 5입니다."}, {"symbol": "q", "name": "군의 원소 수", "description": "예제에서는 11입니다."}]} interpretation="(7−8)(2−5)⁻¹≡(−1)×7≡4 mod11입니다." assumptions={["같은 첫 메시지와 서로 다른 질문이어야 합니다.", "알려진 소수 차수의 군을 사용하고 원소가 그 군에 속하는지 확인합니다."]} /><AlgorithmBlock title="두 Schnorr 응답의 추출 (의사코드)" input={["같은 R, 서로 다른 e,e′, 검증된 s,s′, 소수 q"]} steps={[{"code": "d ← (e − e′) mod q; d=0이면 중단", "note": "역수가 없는 질문 쌍을 거절합니다."}, {"code": "d_inv ← inverse_mod(d,q)", "note": "작은 예에서는 inverse_mod(8,11)=7입니다."}, {"code": "w ← ((s − s′) × d_inv) mod q", "note": "반환 전에 gʷ=Y도 검산할 수 있습니다."}]} output="w=4" />
<p data-stage-bridge="sigma" className="text-sm leading-7 text-muted-foreground">4를 추출하는 이유를 뺄셈으로 확인했습니다. 비밀 없는 시뮬레이션은 역순으로 계산합니다.</p>
</section>
<section id="simulation" data-teach-level="5" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">8. 역순 계산은 실제 대화의 순서와 다릅니다</h2>
<p className="leading-8">비밀 4를 쓰지 않고 질문 2와 답 7을 먼저 고르면 처음 값을 2⁷×16⁻²로 계산할 수 있습니다. 16²≡3이고 3의 역수는 8이므로 13×8≡12입니다. 실제 대화와 같은 (12,2,7)이 나옵니다. 균일한 질문과 응답을 고르는 이 구성은 정직한 검증자에 대한 시뮬레이션을 설명합니다.</p>
<p className="leading-8">실제 대화에서는 처음 값 12를 보낸 뒤 상대가 질문을 정합니다. 시뮬레이터는 보안 정의 속 가상 알고리즘이므로 질문을 먼저 고를 수 있습니다. 악의적 검증자 전체나 비대화형 변환의 보장은 이 한 계산만으로 증명되지 않습니다.</p>
<p className="leading-8">RFC8235는 부호가 반대인 응답 표기를 씁니다. 원문에서 a=4, v=10, c=2를 넣으면 r=2이며 V=2²×16²≡12입니다. 이 글의 더하기 응답 7과 원문의 빼기 응답 2는 각각의 검증 식에 맞춰 사용해야 합니다.</p>
<div id="source-schnorr-rfc"><CitationBlock source="RFC8235 §2.2, pp.4–5 · 원문의 응답·검증 표기" citeKey={1} href="https://www.rfc-editor.org/rfc/rfc8235"><p className="leading-8">원문: <q>r = v - a * c mod q</q></p><p className="leading-8">a=4,v=10,c=2이면 r=2. V=gʳAᶜ에서 4×3≡12 mod23입니다.</p></CitationBlock></div>
<p data-stage-bridge="simulation" className="text-sm leading-7 text-muted-foreground">같은 대화의 분포와 실제 전송 순서를 분리했습니다. 이제 한 commitment의 두 보장을 확인합니다.</p>
</section>
<section id="source" data-teach-level="6" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">9. 숨겨도 바꿀 수 있으면 약속이 되지 않습니다</h2>
<p className="leading-8">Pedersen 방식에서 C=gᵐhʳ을 사용합니다. 같은 작은 군에서 g=2,h=8,m=4,r=10이면 C=2입니다. 이 예에서는 h=2³인 관계를 모두 알고 있으므로 (m,r)를 (7,9)로 바꾸어도 2⁷×8⁹≡2가 됩니다. 숨김과 별개로 약속을 바꿀 수 있는 경우입니다.</p>
<p className="leading-8">서로 다른 두 열림이 같다면 m+ar=m′+ar′이므로 a=(m−m′)/(r′−r)입니다. 위 값은 (4−7)/(9−10)=3을 줍니다. 여기서 a=log_g h는 군의 지수를 찾는 이산로그이며 일반 실수 로그나 계산 비용의 로그 변환을 뜻하지 않습니다.</p>
<p className="leading-8">실제 생성자에서는 이 관계를 아무도 알지 못하도록 정하고 각 r을 균일하게 새로 뽑습니다. r이 균일하면 모든 m에 대해 C가 같은 균일 분포여서 hiding이 성립합니다. binding은 생성자 사이 이산로그를 구하기 어렵다는 계산 가정에 기댑니다.</p>
<div id="source-pedersen"><CitationBlock source="Kate·Zaverucha·Goldberg · Constant-Size Commitments to Polynomials, PDF p.1" citeKey={1} href="https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf"><p className="leading-8">원문: <q>Pedersen commitments</q></p><p className="leading-8">원문의 C=gᵐhʳ 구조에 (g,h,m,r)=(2,8,4,10)을 넣으면 2이며 알려진 log₂8=3 때문에(7,9)로도 열립니다.</p></CitationBlock></div><div id="paper-gmr"><CitationBlock source="Goldwasser·Micali·Rackoff · The Knowledge Complexity of Interactive Proof Systems" citeKey={2} href="https://doi.org/10.1137/0218012"><p className="leading-8"><strong>문제:</strong> 검증자가 얻는 추가 정보를 형식화하는 문제입니다.</p><p className="leading-8"><strong>기여:</strong> 실제 대화와 시뮬레이션을 비교하는 정의의 토대입니다.</p><p className="leading-8"><strong>전제:</strong> 확률적 검증자와 정의된 view·모델을 사용합니다.</p><p className="leading-8"><strong>근거 범위:</strong> 정의와 원 논문의 프로토콜 범위입니다.</p><p className="leading-8"><strong>일반화할 수 없는 결론:</strong> 현대 구현의 부채널이나 무작위 수 재사용까지 자동으로 막는다는 결론은 아닙니다.</p></CitationBlock></div>
<p data-stage-bridge="source" className="text-sm leading-7 text-muted-foreground">숨김과 변경 방지가 다른 전제에 놓인다는 것을 확인했습니다. 마지막으로 해시와 구현의 경계를 봅니다.</p>
</section>
<section id="noninteractive-boundary" data-teach-level="7" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">10. 해시가 질문을 대신해도 입력과 순서를 지켜야 합니다</h2>
<p className="leading-8">Fiat–Shamir는 공개값 16과 처음 값 12, 프로토콜 이름과 맥락을 해시에 넣어 질문을 만듭니다. RFC8235 §2.3은 g,V,A,UserID,OtherInfo를 순서대로 연결하고 각 항목의 경계를 명확히 정하도록 설명합니다. 문자열 ab와 c, a와 bc를 단순 연결하면 같은 abc가 되므로 길이와 인코딩도 정해야 합니다.</p>
<p className="leading-8">공개 문제를 해시에서 빼거나 서로 다른 서비스의 맥락을 구별하지 않으면 다른 대화에 재사용되는 틈이 생길 수 있습니다. 무작위 오라클 모델에서의 분석을 임의 해시 사용 전체의 안전성으로 확대하지 않습니다. 공개 입력, 시간, 메모리 접근에서 새는 정보도 별도 문제입니다.</p>
<p className="leading-8">이산로그를 쓰는 Schnorr와 Pedersen의 계산 가정은 양자 공격에 그대로 안전한 가정이 아닙니다. <a href="/cs/crypto/discrete-log">이산로그 정본</a>에서 공격 모델을, <a href="/cs/crypto/snark-overview#security">증명의 보안 성질</a>에서 존재·지식·비밀성의 차이를 이어 볼 수 있습니다.</p>

<div id="paper-fiat-shamir"><CitationBlock source="Fiat·Shamir · How To Prove Yourself (1986)" citeKey={3} href="https://doi.org/10.1007/3-540-47721-7_12"><p className="leading-8"><strong>문제:</strong> 신원 확인의 대화를 공개 검증 가능한 서명으로 바꿉니다.</p><p className="leading-8"><strong>기여:</strong> 검증자가 고르던 질문을 앞선 공개 자료의 해시로 정합니다.</p><p className="leading-8"><strong>전제:</strong> 원래 프로토콜의 구조와 해시를 사용하는 모델을 함께 봅니다.</p><p className="leading-8"><strong>근거 범위:</strong> 역사적 변환의 구성입니다. 여기의 16·12를 묶는 실제 인코딩은 RFC8235로 대조했습니다.</p><p className="leading-8"><strong>일반화할 수 없는 결론:</strong> 임의의 다단계 대화나 양자 공격자에게 같은 보안 결론을 자동 적용하지 않습니다.</p></CitationBlock></div>
<p data-stage-bridge="noninteractive-boundary" className="text-sm leading-7 text-muted-foreground">메시지 순서부터 비밀성 가정까지 연결했습니다. 같은 숫자를 바꾸어 결과를 예측해 봅니다.</p>
<ReviewPrompts questions={["같은 12에 질문 2와 5를 받아 답 7과 8을 보내면 비밀은 어떻게 드러나나요? (답: 7절)", "시뮬레이터가 비밀 없이 12를 만들 수 있는데도 실제 대화가 무의미하지 않은 이유는 무엇인가요? (답: 8절)", "h=2³인 관계를 알면 commitment2를 어떻게 다르게 열 수 있나요? (답: 9절)"]} />
</section>
</article>; }
