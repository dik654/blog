import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import ZkCaseDiagram from "../ZkCaseDiagram";

/** 원문 확인: 2026-10-04. 작은 수치는 별도 가정입니다. */
export default function Article() { return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">1. 실행한 코드와 증명한 규칙을 같게 만들어야 합니다</h2>
<p className="leading-8">계산 결과에 붙은 증거가 통과했더라도 프로그램의 중요한 조건이 검사에서 빠졌다면 원하는 보장을 얻지 못합니다. 숫자를 계산하는 일과 그 숫자들이 지켜야 할 규칙을 쓰는 일은 서로 다른 작업입니다.</p>
<p className="leading-8">이 글은 작은 계산 두 번을 모두 검사할 수 있는 등식으로 옮깁니다. 이후 긴 등식 목록을 하나의 다항식 조건으로 묶되, 원래 의미가 사라지지 않는지 끝까지 확인합니다.</p>

<p data-stage-bridge="overview" className="text-sm leading-7 text-muted-foreground">계산과 규칙 작성의 차이를 잡았습니다. 입력부터 검사까지의 큰 흐름을 봅니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">2. 계산기는 값을 채우고 검사기는 모든 줄을 확인합니다</h2>
<p className="leading-8">계산하는 쪽은 입력값에서 중간값과 최종값을 만듭니다. 검사하는 규칙은 중간값이 이전 계산과 맞는지, 마지막 값이 공개한 답과 같은지를 묻습니다. 값이 기록돼 있다는 것과 값 사이 관계가 강제됐다는 것은 다릅니다.</p>
<p className="leading-8">마지막 덧셈 검사를 빼면 어떤 답을 써도 그 누락된 줄에서는 거절되지 않습니다. 뒤에 붙일 암호 장치가 아니라 지금 만드는 규칙에서 고쳐야 할 문제입니다.</p>

<p data-stage-bridge="black-box" className="text-sm leading-7 text-muted-foreground">모든 줄의 관계를 검사한다는 목표를 정했습니다. 두 줄을 수치로 채웁니다.</p>
</section>
<section id="case" data-teach-level="0" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">3. 3×4=12를 만든 뒤 4를 더해 16을 얻습니다</h2>
<p className="leading-8">공개 입력 3과 공개 출력 16 사이에 개인 값 4와 중간값 12가 있다고 합시다. 첫 계산은 3×4=12, 둘째는 12+4=16입니다. 모든 계산은 17로 나눈 나머지에서 하며 숫자는 가정입니다.</p>
<p className="leading-8">입력 3, 출력 16, 개인 값 4, 중간값 12를 같은 한 묶음에 기록합니다. 두 번째 줄에서만 개인 값을 5로 바꾸면 12+5≡0으로 바뀌므로 출력 16과 맞지 않습니다. 두 줄이 같은 개인 값을 읽어야 합니다.</p>

<p data-stage-bridge="case" className="text-sm leading-7 text-muted-foreground">두 계산과 공유값을 정했습니다. 값 선택과 곱셈 한 번의 구조를 봅니다.</p>
</section>
<section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">4. 각 줄은 두 값을 골라 곱하고 세 번째와 비교합니다</h2>
<p className="leading-8">첫 줄은 3과 4를 골라 곱한 뒤 12와 비교합니다. 둘째 줄은 12+4를 한쪽에 놓고 1을 곱한 뒤 16과 비교합니다. 덧셈도 1과의 곱으로 같은 형식에 담을 수 있습니다.</p>
<p className="leading-8">중간값 12를 첫 줄의 결과와 둘째 줄의 입력에 같은 자리로 연결해야 합니다. 두 위치를 독립된 값으로 두면 첫 계산을 통과한 12와 전혀 다른 숫자를 다음 줄에 넣을 수 있습니다.</p>
<ZkCaseDiagram title="같은 값 묶음에서 읽는 두 줄" steps={["값 묶음 (1,3,16,4,12)", "3×4=12 · (12+4)×1=16", "두 등식을 모두 만족"]} arrows={["같은 자리 읽기", "동시 검사"]} />
<p data-stage-bridge="picture" className="text-sm leading-7 text-muted-foreground">두 줄을 같은 검사 모양으로 바꿨습니다. 왜 상수 1과 공유 위치가 필요한지 확인합니다.</p>
</section>
<section id="need" data-teach-level="2" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">5. 변수의 이름보다 같은 자리를 읽는 것이 중요합니다</h2>
<p className="leading-8">상수 1이 있어야 상수를 더하거나 곱셈 없는 등식을 같은 형식으로 쓸 수 있습니다. 값을 담는 순서도 고정해야 합니다. 입력 3과 출력 16의 자리를 바꾸면 계수표는 다른 관계를 읽습니다.</p>
<p className="leading-8">17로 나눈 나머지에서는 12+5=0입니다. 일반 정수에서의 금액이나 나이를 표현하려면 이런 되돌아옴을 허용할지 먼저 정해야 합니다. 허용하지 않을 경우 범위를 제한하는 별도의 조건이 필요합니다.</p>

<p data-stage-bridge="need" className="text-sm leading-7 text-muted-foreground">표현 방식이 업무 의미를 바꿀 수 있음을 확인했습니다. 표준 이름을 붙입니다.</p>
</section>
<section id="names" data-teach-level="3" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">6. 행의 등식과 다항식 조건을 구별합니다</h2>
<p className="leading-8">검사할 조건은 관계(relation)입니다. 공개 입력과 출력은 공개 사례(instance)입니다. 개인 값과 중간값은 비공개 증거(witness)입니다. 이 글에서는 공개값(3,16), 개인값(4,12)이며 모두 합친 벡터를 z=(1,3,16,4,12)로 적습니다.</p>
<p className="leading-8">두 선형식의 곱과 다른 선형식을 같게 두는 행들의 모음은 R1CS, Rank-1 Constraint System입니다. 각 행의 계수 세 묶음을 A,B,C로 둡니다. 선형식은 각 자리의 값에 계수를 곱해 더한 것입니다.</p>
<p className="leading-8">여러 행을 서로 다른 점에서의 값으로 옮긴 다항식 조건은 QAP, Quadratic Arithmetic Program입니다. 정해진 모든 점에서 0이 되는 다항식은 소멸 다항식(vanishing polynomial)입니다. 이를 나누어 얻는 다항식은 몫 다항식(quotient)입니다.</p>

<p data-stage-bridge="names" className="text-sm leading-7 text-muted-foreground">계수표와 다항식의 역할에 이름을 붙였습니다. 계수표를 실제로 곱합니다.</p>
</section>
<section id="r1cs" data-teach-level="4" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">7. 두 계수 행이 같은 값 묶음을 읽습니다</h2>
<p className="leading-8">z의 순서는(1,x,y,w,v)입니다. 첫 행 A=(0,1,0,0,0), B=(0,0,0,1,0), C=(0,0,0,0,1)을 곱하면 3,4,12가 나옵니다. 둘째 행 A=(0,0,0,1,1), B=(1,0,0,0,0), C=(0,0,1,0,0)에서는 16,1,16이 나옵니다.</p>
<p className="leading-8">출력만 15로 바꾸면 첫 행은 통과하지만 둘째 행의 차이가 1이 됩니다. 둘째 행을 아예 만들지 않았다면 이 오류는 잡히지 않습니다. 증명 생성 성공보다 제약의 의미를 먼저 점검해야 하는 이유입니다.</p>
<p className="leading-8">0또는 1이어야 하는 값 b에는 b(b−1)=0을 넣을 수 있습니다. 체에는 영인자가 없으므로 둘 중 하나가 0이어야 합니다. 이 줄이 없으면 b=2도 가능한 값이며 선택 연산을 기대한 회로에서 의미가 달라질 수 있습니다.</p>
<ExplainedFormula question="각 행은 값 묶음에 어떤 검사를 하나요?" idea="계수와 값의 내적으로 두 입력과 비교할 결과를 만든 뒤 곱셈 등식을 확인합니다." formula={String.raw`\langle A_i,z\rangle\langle B_i,z\rangle-\langle C_i,z\rangle=0`} annotatedFormula={String.raw`\langle A_i,z\rangle\langle B_i,z\rangle-\langle C_i,z\rangle=0`} operations={[{"expression": "\\langle A_i,z\\rangle", "annotation": ["A행이 필요한 자리만 선택하거나 더합니다."]}, {"expression": "\\langle B_i,z\\rangle", "annotation": ["곱할 다른 입력을 만듭니다."]}, {"expression": "\\langle C_i,z\\rangle", "annotation": ["기록된 결과와의 차이가 0이어야 합니다."]}]} terms={[{"symbol": "i", "name": "행 번호", "description": "첫 계산과 둘째 계산을 나눕니다."}, {"symbol": "z", "name": "공유 값 벡터", "description": "(1,3,16,4,12)입니다."}, {"symbol": "A_i,B_i,C_i", "name": "세 계수 행", "description": "변수 순서와 함께 고정됩니다."}]} interpretation="첫 행 3×4−12=0, 둘째 행 16×1−16=0입니다." assumptions={["17로 나눈 나머지에서 계산합니다.", "정수 범위와 비트 조건은 필요한 경우 별도 행으로 강제합니다."]} /><AlgorithmBlock title="R1CS 행 검사 (의사코드)" input={["A,B,C와 같은 순서의 z, 소수 p"]} steps={[{"code": "각 행 i: a←Σ A[i,j]z[j], b←Σ B[i,j]z[j], c←Σ C[i,j]z[j]", "note": "합과 곱마다 p로 나눈 나머지를 사용합니다."}, {"code": "(a×b−c) mod p ≠ 0이면 거절", "note": "한 행이라도 틀리면 전체가 실패합니다."}, {"code": "모든 행이 맞으면 만족으로 반환", "note": "이 검사는 암호 증거의 비밀성·압축을 만들지는 않습니다."}]} output="두 행 모두 0일 때만 만족" />
<p data-stage-bridge="r1cs" className="text-sm leading-7 text-muted-foreground">두 행의 만족과 빠진 줄의 위험을 계산했습니다. 같은 행을 원 논문의 다항식 조건으로 옮깁니다.</p>
</section>
<section id="qap" data-teach-level="5" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">8. 두 점에서 0이면 두 인수로 나누어떨어집니다</h2>
<p className="leading-8">첫 행을 X=1, 둘째 행을 X=2에 놓습니다. 앞서 얻은 왼쪽 값은 3과 16, 오른쪽 값은 4와 1, 결과값은 12와 16입니다. 각 두 점을 잇는 일차식은 A(X)=13X+7, B(X)=−3X+7, C(X)=4X+8입니다. 모두 17로 나눈 나머지에서 해석합니다.</p>
<p className="leading-8">A(X)B(X)−C(X)를 전개하면 12X²+15X+7입니다. 두 행의 점을 0으로 만드는 t(X)=(X−1)(X−2)에 12를 곱하면 같은 식이 됩니다. 따라서 몫 h=12입니다. 두 등식의 만족을 하나의 정확한 다항식 나눗셈으로 옮겼습니다.</p>
<p className="leading-8">이는 임의의 실수 비율을 구한 것이 아닙니다. X=1,2에서 각각 0이라는 사실로부터 서로 다른 두 인수 X−1과 X−2가 나누어떨어집니다. 반대로 두 인수의 곱으로 나누어떨어지면 두 점에서 0이므로 원래 두 행을 복원할 수 있습니다.</p>
<div id="source-qap"><CitationBlock source="Pinocchio §2.2.1, Definition2, PDF p.3" citeKey={1} href="https://eprint.iacr.org/2013/279.pdf"><p className="leading-8">원문: <q>h(x)·t(x) = p(x)</q></p><p className="leading-8">원문의 p에 12X²+15X+7, t에(X−1)(X−2), h에 12를 넣으면 양쪽이 같습니다. 원문의 소문자 x는 다항식의 변수이며 이 글의 공개 입력 3과 다른 역할입니다.</p></CitationBlock></div>
<p data-stage-bridge="qap" className="text-sm leading-7 text-muted-foreground">행 만족과 정확한 나눗셈의 동치를 확인했습니다. 원문의 다른 기호 순서에도 같은 사례를 적용합니다.</p>
</section>
<section id="source" data-teach-level="6" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">9. 원문에서 벡터 순서가 다르면 계수도 함께 옮깁니다</h2>
<p className="leading-8">Nova 논문의 R1CS 정의는 Z=(W,x,1) 순서를 씁니다. 이 글의(1,x,y,w,v)와 다릅니다. 같은 사례를 원문 순서로 적으면 W=(4,12), 공개 x=(3,16), Z=(4,12,3,16,1)입니다.</p>
<p className="leading-8">첫 행은 A가 세 번째 자리 3, B가 첫 번째 자리 4, C가 두 번째 자리 12를 읽습니다. 둘째 행은 A가 첫째와 둘째 자리를 더하고 B는 마지막 1, C는 네 번째 16을 읽습니다. 표기만 바꾸어도 계수를 같이 바꾸면 결과는 0,0으로 유지됩니다.</p>
<div id="source-r1cs"><CitationBlock source="Nova §4, Definition10, PDF p.13" citeKey={1} href="https://eprint.iacr.org/2021/370.pdf"><p className="leading-8">원문: <q>Z = (W, x, 1)</q></p><p className="leading-8">Z=(4,12,3,16,1)로 재배열하고 계수 위치도 옮기면 3×4=12와(4+12)×1=16이 보존됩니다.</p></CitationBlock></div><div id="paper-pinocchio-qap"><CitationBlock source="Pinocchio: Nearly Practical Verifiable Computation (2013)" citeKey={2} href="https://eprint.iacr.org/2013/279.pdf"><p className="leading-8"><strong>문제:</strong> 긴 계산을 공개 검증할 때 같은 계산을 반복하는 비용을 줄입니다.</p><p className="leading-8"><strong>기여:</strong> 산술 회로의 관계를 QAP와 암호 검증으로 연결합니다.</p><p className="leading-8"><strong>전제:</strong> 정확한 컴파일과 논문의 회로별 준비·암호 가정을 사용합니다.</p><p className="leading-8"><strong>근거 범위:</strong> 논문의 당시 구현과 애플리케이션 평가입니다.</p><p className="leading-8"><strong>일반화할 수 없는 결론:</strong> 빠진 범위 조건을 발견하거나 모든 구현의 동일 속도를 보장하지 않습니다.</p></CitationBlock></div>
<p data-stage-bridge="source" className="text-sm leading-7 text-muted-foreground">원문 기호와 실제 데이터 순서를 맞췄습니다. 마지막으로 압축과 업무 의미의 경계를 봅니다.</p>
</section>
<section id="verification" data-teach-level="7" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">10. 다항식으로 옮겼다고 비밀이나 정수 의미가 생기지 않습니다</h2>
<p className="leading-8">R1CS와 QAP는 무엇이 참이어야 하는지를 적는 형식입니다. 증인을 숨기거나 증거를 작게 만드는 암호 계층은 <a href="/cs/crypto/groth16">Groth16</a>이나 <a href="/cs/crypto/plonk">PLONK</a> 등에서 붙습니다. 계수와 중간값을 모두 공개한 지금 계산 자체는 영지식 증명이 아닙니다.</p>
<p className="leading-8">검증자가 임의의 한 점에서 다항식 두 개를 비교하는 방식으로 줄인다면 거짓인 차이가 우연히 0이 될 확률과 최대 차수도 통제해야 합니다. 자료를 고정한 뒤 점을 선택하며 차수 d의 0이 아닌 다항식이 체에서 갖는 근은 최대 d개라는 원리를 사용합니다.</p>
<p className="leading-8">입력 범위가 0부터 10이라고 가정했는데 이를 강제하지 않거나, 공개값의 순서를 잘못 넘기거나, 둘째 행을 빼면 다른 문제를 증명하게 됩니다. 정수 의미·행 연결·공개 입력을 확인한 다음 증거 생성 시간과 메모리를 비교합니다.</p>

<p data-stage-bridge="verification" className="text-sm leading-7 text-muted-foreground">작은 계산을 행과 다항식으로 옮겼고 의미를 잃는 조건도 확인했습니다.</p>
<ReviewPrompts questions={["출력 16을 15로 바꾸면 어느 행에서 어떤 차이가 나나요? (답: 7절)", "왜 12X²+15X+7은(X−1)(X−2)로 정확히 나누어지나요? (답: 8절)", "원문 Z=(W,x,1)에 사례를 넣을 때 값과 계수의 자리는 어떻게 바뀌나요? (답: 9절)"]} />
</section>
</article>; }
