import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import ZkCaseDiagram from "../ZkCaseDiagram";

/** 원문 확인: 2026-10-04. 작은 수치는 별도 가정입니다. */
export default function Article() { return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">1. 계산한 사람을 믿지 않고 결과를 확인하려면</h2>
<p className="leading-8">다른 컴퓨터가 계산을 대신해 주었을 때, 답이 맞는지 확인하려고 같은 일을 처음부터 반복하면 맡긴 이점이 줄어듭니다. 계산한 사람이 작은 증거를 보내고 받는 사람이 더 적은 일로 확인할 수 있다면 검증의 비용을 나눌 수 있습니다.</p>
<p className="leading-8">이 글은 무엇을 증명하는지, 무엇을 공개하는지, 어떤 조건에서 믿을 수 있는지를 구분합니다. 짧은 증거가 계산 내용의 비밀까지 자동으로 지켜 주는지는 별도의 질문입니다.</p>

<p data-stage-bridge="overview" className="text-sm leading-7 text-muted-foreground">계산과 검사의 역할을 나눴습니다. 먼저 양쪽이 주고받는 것만 봅니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">2. 계산에 쓴 값과 확인에 필요한 값은 다릅니다</h2>
<p className="leading-8">만드는 쪽은 공개된 문제와 자신이 가진 답을 함께 사용합니다. 확인하는 쪽은 공개된 문제와 전달받은 증거만 받습니다. 양쪽은 어떤 규칙으로 만든 증거인지에도 합의해야 합니다.</p>
<p className="leading-8">확인 결과가 통과여도 현실의 계약이나 데이터 출처까지 옳다는 뜻은 아닙니다. 예를 들어 입력한 재고 수량이 실제 창고와 다르면 그 수량으로 정확히 계산했다는 증거도 재고 조작을 잡아내지 못합니다.</p>

<p data-stage-bridge="black-box" className="text-sm leading-7 text-muted-foreground">증거가 검사하는 범위를 계산 규칙으로 좁혔습니다. 작은 곱셈에 숫자를 넣습니다.</p>
</section>
<section id="case" data-teach-level="0" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">3. 3에 어떤 수를 곱해 12를 만들었다고 합시다</h2>
<p className="leading-8">17로 나눈 나머지로 계산하며 공개된 값은 3과 12이고 만드는 사람이 넣는 값은 4라고 합시다. 숫자는 설명용 가정입니다. 3×4=12이므로 정상 계산입니다. 5를 넣으면 3×5=15여서 같은 등식을 만족하지 못합니다.</p>
<p className="leading-8">그러나 공개된 3과 12만 봐도 4를 계산할 수 있습니다. 이 사례는 역할과 오류를 구분하기 위한 작은 예이며 비밀 보호가 유용한 업무를 보여 주는 예는 아닙니다. 공개값을 0과 1로 바꾸면 어떤 수를 넣어도 0×그 수=1이 될 수 없습니다.</p>

<p data-stage-bridge="case" className="text-sm leading-7 text-muted-foreground">잘못 넣은 5와 답 자체가 없는 문제를 구별했습니다. 세 종류의 값이 이동하는 그림을 봅니다.</p>
</section>
<section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">4. 문제는 그대로 두고 증거만 전달합니다</h2>
<p className="leading-8">양쪽에 3과 12가 놓여 있습니다. 계산하는 쪽에만 4를 놓고 증거를 만듭니다. 확인하는 쪽에서는 그 증거를 같은 3과 12에 대해 검사합니다. 도중에 공개값을 바꾸면 처음과 다른 문제입니다.</p>
<p className="leading-8">이 흐름에서 비공개 값이 전달되지 않는다는 사실만으로 비밀성이 증명되지는 않습니다. 증거의 다른 부분에서 4를 새로 알려 줄 수도 있기 때문입니다.</p>
<ZkCaseDiagram title="공개 문제와 개인이 넣는 값의 경로" steps={["공개 3,12 · 개인 값 4", "같은 규칙으로 증거 생성", "3,12에 대해 검사"]} arrows={["계산", "증거 전달"]} />
<p data-stage-bridge="picture" className="text-sm leading-7 text-muted-foreground">입력과 전달 경로를 분리했습니다. 각 역할이 필요한 이유를 연결합니다.</p>
</section>
<section id="need" data-teach-level="2" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">5. 세 가지 실패를 따로 막아야 합니다</h2>
<p className="leading-8">정상적인 4를 사용했는데 통과하지 못하면 쓸 수 없는 시스템입니다. 답이 없는 0×?=1을 통과시킬 수 있어도 쓸 수 없습니다. 정상 계산을 증명하면서 공개된 문제에서 알 수 없던 개인 정보까지 드러내는 경우에는 비밀 보호 목적을 이루지 못합니다.</p>
<p className="leading-8">또 하나는 누가 답을 알고 있는가입니다. 단순히 답이 존재한다는 사실과, 증거를 만든 사람에게서 그 답을 추출할 수 있다는 보장은 다릅니다. 공개 문제만으로 답이 쉬운 이번 사례에서는 이 차이가 작지만 어려운 문제에서는 핵심 조건이 됩니다.</p>

<p data-stage-bridge="need" className="text-sm leading-7 text-muted-foreground">실패 질문을 나눴으므로 이제 각 질문에 쓰는 이름을 붙입니다.</p>
</section>
<section id="interface" data-teach-level="3" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">6. 관계·증인·증거를 이름으로 연결합니다</h2>
<p className="leading-8">맞아야 할 조건은 관계, relation입니다. 공개 문제는 명제 또는 instance이고 이를 만족시키는 개인 값은 증인, witness입니다. 전달하는 자료는 증거, proof입니다. 사례에서는 관계가 xw=y, 공개 명제가 (3,12), 증인이 4입니다.</p>
<p className="leading-8">Setup은 사용할 규칙과 공개 매개변수를 준비하고 Prove는 명제와 증인으로 증거를 만들며 Verify는 공개 명제와 증거를 검사합니다. 구현마다 Setup의 입력과 출력은 다르므로 모든 방식에 회로별 비밀 준비 과정이 있다고 가정하면 안 됩니다.</p>
<p className="leading-8">SNARK의 S는 Succinct, 짧은 증거와 효율적인 검증을 뜻합니다. N은 Non-interactive로 준비 뒤 증거 하나를 보냅니다. AR은 Argument로 계산 능력이 제한된 공격자를 다루고 K는 Knowledge로 증인 추출에 관한 보장을 뜻합니다. 영지식은 ZK라는 별도 성질이며 모든 SNARK에 자동으로 따라오지 않습니다.</p>

<p data-stage-bridge="interface" className="text-sm leading-7 text-muted-foreground">이름을 공개 문제와 알고리즘에 대응시켰습니다. 같은 숫자로 보안 조건을 검사합니다.</p>
</section>
<section id="security" data-teach-level="4" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">7. 참인 명제·거짓 명제·잘못된 증인을 구별합니다</h2>
<p className="leading-8">완전성은 정상 증인 4로 만든 증거가 통과해야 한다는 요구입니다. 건전성은 증인이 하나도 없는 명제 (0,1)를 공격자가 통과시키기 어려워야 한다는 요구입니다. (3,12)에 5를 넣는 것은 잘못된 증인 입력이지만 공개 명제는 여전히 참입니다. 증명 생성 함수가 입력을 거절하는 검사와 거짓 명제에 관한 보안 정의를 섞지 않습니다.</p>
<p className="leading-8">지식 건전성은 통과하는 증거를 만드는 공격자로부터 해당 명제의 증인을 얻는 추출기를 논할 수 있어야 한다는 더 강한 요구입니다. 영지식은 증거를 보아도 공개 명제에서 이미 알 수 있는 것에 더해 증인 정보가 새로 늘지 않는다는 성질입니다. 이번 예에서 4를 알아낼 수 있는 이유는 공개값 3과 12에 있으며 영지식이 공개 정보의 수학적 결과를 지울 수는 없습니다.</p>
<p className="leading-8">비대화형 검사 번호를 해시로 만들 때는 문제, 규칙 식별자와 앞선 메시지를 함께 넣습니다. 이를 Fiat–Shamir 변환이라고 합니다. 먼저 검사 번호를 알려 주면 그 번호에서만 맞는 답을 만들 여지가 생기므로 자료를 고정한 다음 번호를 정하는 순서가 필요합니다.</p>
<AlgorithmBlock title="세 입력 사례의 의미 확인 (의사코드)" input={["공개값 (x,y), 후보 w, 17로 나눈 나머지"]} steps={[{"code": "relation_ok ← (x × w − y) mod 17 = 0", "note": "(3,12,4)는 참, (3,12,5)는 거짓입니다."}, {"code": "false_instance ← (x = 0 and y ≠ 0)", "note": "이 관계에서 증인이 없는 공개 문제를 구별합니다."}, {"code": "검증 함수에는 (x,y,proof)를 넘긴다", "note": "후보 w의 직접 검사는 증거 검증 알고리즘을 대체하지 않습니다."}]} output="관계 만족 여부와 공개 명제의 참·거짓을 분리한 결과" />
<p data-stage-bridge="security" className="text-sm leading-7 text-muted-foreground">무엇이 참인지와 무엇을 안다는지를 분리했습니다. 이 구별을 원 논문의 정의에 대입합니다.</p>
</section>
<section id="source" data-teach-level="5" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">8. 원 논문도 증인이 없는 명제를 따로 정의합니다</h2>
<p className="leading-8">Groth16 원 논문의 보안 정의는 증인이 존재하지 않는 명제를 통과시키는 사건을 건전성의 실패로 셉니다. 작은 사례에서 이 조건에 해당하는 것은 (0,1)입니다. (3,12)에 5를 넣었다는 사정만으로 그 조건이 성립하지는 않습니다.</p>
<p className="leading-8">원문의 공개 명제 기호 φ에 (3,12)를, w에 4를 넣으면 Prove가 받는 입력이 됩니다. 검증 식에는 w가 없고 공개 명제와 증거가 들어갑니다. 따라서 이 인터페이스를 구현할 때도 공개값의 순서와 규칙 식별자가 양쪽에서 같아야 합니다.</p>
<div id="source-groth16-interface"><CitationBlock source="Groth · On the Size of Pairing-based Non-interactive Arguments, §2.2, PDF pp.7–8" citeKey={1} href="https://eprint.iacr.org/2016/260.pdf"><p className="leading-8">원문: <q>if no witness exists</q></p><p className="leading-8">(0,1)은 증인이 없고 (3,12)는 증인 4가 있습니다. 이 문구는 두 경우를 가릅니다.</p></CitationBlock></div><ExplainedFormula question="논문에 적힌 증거 생성의 입력은 무엇인가요?" idea="원문의 φ는 공개 명제, w는 개인 증인입니다. σ는 Setup으로 준비한 공개 자료입니다." formula={String.raw`\pi\leftarrow\mathsf{Prove}(R,\sigma,\phi,w)`} annotatedFormula={String.raw`\pi\leftarrow\mathsf{Prove}(R,\sigma,\phi,w)`} operations={[{"expression": "\\mathsf{Prove}(R,\\sigma,\\phi,w)", "annotation": ["R은 xw=y, φ는 (3,12), w는 4로 고정합니다.", "화살표는 확률적 알고리즘의 출력을 받는다는 뜻입니다."]}]} terms={[{"symbol": "R", "name": "관계", "description": "어떤 등식이 참이어야 하는지 정합니다."}, {"symbol": "\\sigma", "name": "공개 준비 자료", "description": "같은 검증 규칙에 사용합니다."}, {"symbol": "\\phi,w", "name": "공개 명제와 증인", "description": "문제와 이를 만족시키는 값을 나눕니다."}, {"symbol": "\\pi", "name": "증거", "description": "검증자에게 전달합니다."}]} interpretation="이 식은 API를 설명합니다. 실제 증거를 계산하는 곡선 연산은 Groth16 정본에서 이어집니다." assumptions={["원문 §2.2의 표기를 그대로 사용합니다.", "원문의 시뮬레이션용 비밀 τ는 일상적인 검증 입력이 아닙니다."]} />
<p data-stage-bridge="source" className="text-sm leading-7 text-muted-foreground">정의의 조건에 실제 값을 넣었습니다. 다음에는 비밀성 정의가 무엇을 숨기지 않는지 확인합니다.</p>
</section>
<section id="comparison" data-teach-level="6" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">9. 증거가 새로 주는 정보와 이미 공개된 정보를 나눕니다</h2>
<p className="leading-8">같은 논문은 영지식에서 명제의 참이라는 사실 외의 추가 정보가 새지 않는다고 정의합니다. 3과 12로부터 4가 결정되는 사례에서는  4를 알 수 있다는 것 자체가 증거의 정보 유출은 아닙니다. 공개 입력을 어떻게 정할지는 애플리케이션이 먼저 결정해야 합니다.</p>
<p className="leading-8">개인 값이 비밀이어야 한다면 공개값만으로 그 값이 바로 결정되는 문제를 쓰지 않아야 합니다. 예를 들어 특정 공개 암호값의 생성에 쓰인 비밀 수를 안다는 관계에서는  공개값에서 그 수를 찾기 어렵다는 별도 가정이 필요합니다. 그 구조는 <a href="/cs/crypto/zk-theory#sigma">작은 군의 응답 예제</a>에서 계산합니다.</p>
<div id="source-groth16-zk"><CitationBlock source="Groth · §2.2, PDF p.8 · Perfect zero-knowledge" citeKey={1} href="https://eprint.iacr.org/2016/260.pdf"><p className="leading-8">원문: <q>besides the truth of the statement</q></p><p className="leading-8">공개 (3,12)가 이미 알려 주는 4와 proof가 추가로 누설하는 정보를 구분합니다.</p></CitationBlock></div><div id="paper-snarks-for-c"><CitationBlock source="Ben-Sasson et al. · SNARKs for C (2013)" citeKey={2} href="https://eprint.iacr.org/2013/507"><p className="leading-8"><strong>문제:</strong> 일반 프로그램 실행을 짧게 공개 검증하려는 문제입니다.</p><p className="leading-8"><strong>기여:</strong> TinyRAM 실행을 대수 조건과 짧은 증명으로 연결합니다.</p><p className="leading-8"><strong>전제:</strong> 유계 실행과 컴파일러, 해당 setup·암호 가정을 사용합니다.</p><p className="leading-8"><strong>근거 범위:</strong> 당시 구현과 논문의 프로그램 평가 범위입니다.</p><p className="leading-8"><strong>일반화할 수 없는 결론:</strong> 현재 모든 SNARK의 동일 비용이나 임의 프로그램의 올바른 제약 생성을 보장하지 않습니다.</p></CitationBlock></div>
<p data-stage-bridge="comparison" className="text-sm leading-7 text-muted-foreground">비밀성을 공개 정보와 비교해 읽었습니다. 마지막으로 비용과 보안 가정을 함께 선택합니다.</p>
</section>
<section id="selection" data-teach-level="7" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">10. 짧은 증거를 만드는 비용은 별도로 남습니다</h2>
<p className="leading-8">Groth16은 회로별 준비와 페어링 가정을 사용합니다. KZG를 쓰는 PLONK 계열은 여러 회로에 재사용할 수 있는 준비 자료를 택할 수 있습니다. 해시 기반 STARK 계열은 비밀 준비 자료를 없애는 대신 다른 증거 크기와 검증 작업을 갖습니다. 실제 방식은 같은 프로그램·공개 입력·보안 목표에서 비교해야 합니다.</p>
<p className="leading-8">가령 증거가 1 KiB라는 사실만으로 1 GiB의 작업 메모리나 10초의 생성 시간을 알 수는 없습니다. 이 숫자는 비용 축이 독립적임을 보이는 가정입니다. 공개 입력이 늘어 검증 연산이 늘어나는 경우도 있으므로 증거 바이트, 생성 시간, 검증 시간, 최대 메모리를 따로 기록합니다.</p>
<p className="leading-8">증거가 정확히 검증돼도 빠진 조건을 복원하지는 않습니다. 나이 계산에서 실제 생년월일의 신뢰성을 확인하지 않았거나 금액 범위를 빼먹었다면 정확한 암호 연산은 그 누락까지 통과시킵니다. 다음 <a href="/cs/crypto/constraint-systems">제약 시스템 글</a>은 계산 규칙을 빠짐없이 옮기는 일을 다룹니다.</p>

<p data-stage-bridge="selection" className="text-sm leading-7 text-muted-foreground">증명의 효율·비밀성·업무 조건을 각각 확인할 수 있게 됐습니다. 아래 사례를 다시 판정해 봅니다.</p>
<ReviewPrompts questions={["(3,12)에 5를 넣은 경우와 (0,1)의 차이는 무엇인가요? (답: 7절)", "공개값만으로 4를 알 수 있으면 영지식이 반드시 실패한 것인가요? (답: 9절)", "증거가 작다는 사실만으로 생성 메모리도 작다고 할 수 있나요? (답: 10절)"]} />
</section>
</article>; }
