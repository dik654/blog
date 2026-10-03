import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import ZkCaseDiagram from "../ZkCaseDiagram";

/** 원문 확인: 2026-10-04. 작은 수치는 별도 가정입니다. */
export default function Article() { return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">1. 긴 표를 다 읽지 않고 일정한 규칙을 따르는지 확인하려면</h2>
<p className="leading-8">길이가 매우 긴 숫자 표가 주어졌을 때 모든 칸을 다시 계산하는 대신 일부만 확인하고 싶습니다. 하지만 몇 칸이 맞는다는 이유만으로 나머지까지 믿을 수는 없습니다. 표 전체가 단순한 규칙에 가깝다는 추가 구조가 필요합니다.</p>
<p className="leading-8">이 글은 긴 평가표를 절반 크기의 표로 계속 줄이는 방법을 계산합니다. 검사 대상은 표의 대수적 모양이며 그 표가 어떤 프로그램 실행에서 나왔는지는 다음 단계에서 연결해야 합니다.</p>

<p data-stage-bridge="overview" className="text-sm leading-7 text-muted-foreground">부분 검사에 필요한 구조를 정했습니다. 먼저 표를 줄이는 흐름을 봅니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">2. 표를 고정하고 줄인 표와 일부 위치를 대조합니다</h2>
<p className="leading-8">만드는 쪽이 현재 표를 먼저 고정합니다. 그 뒤 받은 숫자로 두 칸씩 섞어 길이가 절반인 새 표를 만들고 다시 고정합니다. 마지막 표가 충분히 작아지면 직접 확인할 수 있습니다.</p>
<p className="leading-8">확인하는 쪽은 원래 표의 두 칸과 다음 표의 한 칸이 약속한 계산으로 연결되는지 일부 위치에서 검사합니다. 각 칸이 처음 고정한 표에 있던 값이라는 확인도 필요합니다.</p>

<p data-stage-bridge="black-box" className="text-sm leading-7 text-muted-foreground">표 고정·크기 축소·부분 대조의 순서를 잡았습니다. 첫 두 칸을 계산합니다.</p>
</section>
<section id="case" data-teach-level="0" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">3. 위치 4와 13의 값 10과 11을 하나로 합칩니다</h2>
<p className="leading-8">17로 나눈 나머지에서 f(X)=X²+2X+3을 위치 1부터 16까지 계산한다고 합시다. 모든 숫자는 가정입니다. 위치 4의 값은 10, 위치 13의 값은 11입니다. 13은−4와 같으므로 두 위치를 제곱하면 모두 16입니다.</p>
<p className="leading-8">두 값의 합을 2로 나누면(10+11)÷2≡2입니다. 두 값의 차이를 2×4로 나누면(10−11)÷8≡2입니다. 표를 고정한 뒤 받은 숫자 5로 둘을 섞으면 2+5×2=12입니다. 두 칸 10과 11이 새 표의 한 칸 12로 이어졌습니다.</p>

<p data-stage-bridge="case" className="text-sm leading-7 text-muted-foreground">두 칸에서 한 칸을 얻었습니다. 제곱한 위치로 표가 줄어드는 모양을 봅니다.</p>
</section>
<section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">4. 서로 반대인 위치가 같은 새 위치로 모입니다</h2>
<p className="leading-8">1과 16, 2와 15처럼 서로 반대인 위치를 한 쌍으로 잡습니다. 각 쌍을 제곱하면 같은 위치가 되므로 16개의 칸이 8개로 줄어듭니다. 값은 단순 평균이 아니라 앞서 구한 두 부분을 나중에 받은 숫자로 섞어 만듭니다.</p>
<p className="leading-8">위치 4와 13은 새 위치 16에서 만납니다. 다음 검사에서는 두 입력값 10·11과 결과 12를 함께 읽고 동일한 계산이 성립하는지 확인합니다.</p>
<ZkCaseDiagram title="16칸의 두 위치를 8칸의 한 위치로" steps={["4↦10 · 13↦11", "짝수 부분 2 · 홀수 부분 2", "16↦2+5×2=12"]} arrows={["합·차로 분리", "나중에 받은 5"]} />
<p data-stage-bridge="picture" className="text-sm leading-7 text-muted-foreground">위치 축소와 값 계산을 연결했습니다. 왜 무작위로 섞는지 살펴봅니다.</p>
</section>
<section id="need" data-teach-level="2" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">5. 미리 알려 준 섞기 숫자에는 속임수를 맞출 수 있습니다</h2>
<p className="leading-8">섞는 숫자 5를 표를 만들기 전에 알려 주면 두 부분의 오류를 서로 상쇄하도록 꾸밀 수 있습니다. 한 부분에 5를 더하고 다른 부분에서 1을 빼면 합쳐진 값은 그대로이기 때문입니다.</p>
<p className="leading-8">그래서 현재 표를 먼저 고정한 뒤 섞는 숫자를 정합니다. 표 고정이 잘됐다는 사실만으로 단순한 규칙을 따른다고 판정하지도 않습니다. 고정한 잘못된 표를 반복해서 대조하는 검사가 필요합니다.</p>

<p data-stage-bridge="need" className="text-sm leading-7 text-muted-foreground">순서와 부분 대조가 필요한 이유를 확인했습니다. 표와 접기 방법에 이름을 붙입니다.</p>
</section>
<section id="names" data-teach-level="3" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">6. 낮은 차수의 평가표와 근접성을 검사합니다</h2>
<p className="leading-8">낮은 차수 다항식을 여러 위치에서 계산한 값들의 모음을 Reed–Solomon 부호라고 합니다. 받은 표를 이 부호의 한 표로 바꾸려면 몇 칸을 고쳐야 하는지가 거리입니다. 완전히 같은지와 가까운지는 다른 주장입니다.</p>
<p className="leading-8">FRI는 Fast Reed–Solomon Interactive Oracle Proof of Proximity의 약자입니다. oracle는 필요한 위치의 값만 읽을 수 있는 큰 표, proximity는 올바른 표까지의 가까움을 뜻합니다. 표를 절반으로 줄이는 연산은 folding이라고 합니다.</p>
<p className="leading-8">Merkle root는 큰 표의 내용을 묶는 짧은 해시값이고 열어 보인 값이 그 표에 있었는지는 인증 경로로 확인합니다. root는 값의 변경을 어렵게 만들지만 낮은 차수 여부나 비밀 보호를 혼자 보장하지 않습니다.</p>

<p data-stage-bridge="names" className="text-sm leading-7 text-muted-foreground">값 인증과 차수 검사를 구분했습니다. 같은 12를 계수 분해로 다시 만듭니다.</p>
</section>
<section id="folding" data-teach-level="4" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">7. 짝수 차수와 홀수 차수를 나누면 차수가 줄어듭니다</h2>
<p className="leading-8">f(X)=X²+2X+3에서 짝수 차수 부분은 T+3, 홀수 차수 부분은 2입니다. X²=T로 두고 홀수 부분 앞에 X를 붙이면 원래 함수를 복원합니다. 나중에 받은 β=5로 두 부분을 섞은 새 함수는 g(T)=T+3+5×2=T+13입니다.</p>
<p className="leading-8">T=16에서 g(16)=29≡12로 앞서 표의 두 칸에서 계산한 값과 같습니다. 차수 2의 함수가 차수 1로 줄었습니다. 새 표를 고정한 뒤 다음 숫자를 3으로 잡으면 13+3×1=16인 상수로 한 번 더 줄일 수 있습니다.</p>
<p className="leading-8">값만 가지고 짝수 부분을 구할 때는 f(x)+f(−x)에서 홀수 항이 지워집니다. 차이를 구하면 짝수 항이 지워집니다. 이 설명은 2와x의 역수가 있어야 하므로 특성 2의 체나 x=0에는 그대로 쓸 수 없습니다.</p>
<ExplainedFormula question="두 평가값에서 접힌 값을 어떻게 구하나요?" idea="합은 짝수 항을, 차이는 홀수 항을 분리합니다. 현재 표를 고정한 뒤 받은 β로 둘을 합칩니다." formula={String.raw`g(x^2)=\frac{f(x)+f(-x)}2+\beta\frac{f(x)-f(-x)}{2x}`} annotatedFormula={String.raw`g(x^2)=\frac{f(x)+f(-x)}2+\beta\frac{f(x)-f(-x)}{2x}`} operations={[{"expression": "\\frac{f(x)+f(-x)}2", "annotation": ["홀수 항이 상쇄돼 짝수 부분만 남습니다."]}, {"expression": "\\frac{f(x)-f(-x)}{2x}", "annotation": ["짝수 항을 지우고 홀수 부분 앞의 x를 나눕니다."]}]} terms={[{"symbol": "x", "name": "짝의 한 위치", "description": "4이며 다른 위치는−4=13입니다."}, {"symbol": "\\beta", "name": "나중에 정한 숫자", "description": "가정한 값 5입니다."}, {"symbol": "g", "name": "줄인 함수", "description": "T+13으로 차수가 1입니다."}]} interpretation="(10+11)/2+5(10−11)/8≡2+5×2=12입니다." assumptions={["특성 2가 아니고 x≠0이어야 합니다.", "현재 표의 고정이 β보다 먼저여야 합니다."]} /><AlgorithmBlock title="한 단계의 FRI 접기 (의사코드)" input={["x와−x를 묶을 수 있는 표 f, 표 고정 뒤 받은 β"]} steps={[{"code": "각 쌍: even ← (f(x)+f(−x)) × inverse(2)", "note": "체 연산으로 계산합니다."}, {"code": "odd ← (f(x)−f(−x)) × inverse(2x)", "note": "0위치는 이 방식에서 제외합니다."}, {"code": "g(x²) ← even + β×odd; 새 표 g를 고정", "note": "검사 위치는 필요한 root들을 고정한 뒤 선택합니다."}]} output="크기가 절반인 평가표와 그 고정값" />
<p data-stage-bridge="folding" className="text-sm leading-7 text-muted-foreground">표의 12와 함수의 12가 같음을 검산했습니다. 원문이 검사하는 정확한 주장을 확인합니다.</p>
</section>
<section id="soundness" data-teach-level="5" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">8. 원문은 부호와의 거리를 기준으로 거절 확률을 정의합니다</h2>
<p className="leading-8">FRI 원문은 차수 d가 ρN보다 작은 다항식의 평가표를 정의합니다. 사례에서는 N=16, ρ=3/16으로 놓으면 차수 2가 2&lt;3을 만족합니다. 모든 칸이 같은 낮은 차수 함수에서 나온 정상 표는 받아들여야 합니다.</p>
<p className="leading-8">거짓 표의 네 칸이 틀렸다고 고정하고 16칸 중 독립적으로 세 번 뽑는 단순 검사를 상상해 봅시다. 세 번 모두 틀린 칸을 놓칠 확률은(12/16)³=27/64입니다. 같은 위치를 세 번 반복하면 12/16일 뿐입니다. 이 계산은 고정된 오류 집합의 표본추출 예이며 FRI 전체 건전성 정리가 아닙니다.</p>
<p className="leading-8">실제 FRI에서는 여러 단계의 접기, 부호까지의 거리, 질문들의 상관관계와 마지막 차수 검사까지 함께 분석합니다. 따라서 한 줄의(1−δ)ᵠ만으로 구현의 보안 비트를 선언할 수 없습니다.</p>
<div id="source-fri-definition"><CitationBlock source="Fast Reed–Solomon IOP of Proximity · §1, PDF p.2" citeKey={1} href="https://drops.dagstuhl.de/storage/00lipics/lipics-vol107-icalp2018/LIPIcs.ICALP.2018.14/LIPIcs.ICALP.2018.14.pdf"><p className="leading-8">원문: <q>degree d &lt; ρN</q></p><p className="leading-8">N=16,ρ=3/16이면 2&lt;3이므로 예제 f의 평가표는 정의한 부호에 속합니다.</p></CitationBlock></div><div id="paper-fri"><CitationBlock source="Fast Reed–Solomon IOP of Proximity (ICALP2018)" citeKey={2} href="https://drops.dagstuhl.de/storage/00lipics/lipics-vol107-icalp2018/LIPIcs.ICALP.2018.14/LIPIcs.ICALP.2018.14.pdf"><p className="leading-8"><strong>문제:</strong> 긴 평가표가 낮은 차수 부호에 가까운지 적게 읽고 검사합니다.</p><p className="leading-8"><strong>기여:</strong> 재귀적인 표 축소와 근접성 분석을 제공합니다.</p><p className="leading-8"><strong>전제:</strong> 정의한 체·평가 영역·거리·질문 모델을 사용합니다.</p><p className="leading-8"><strong>근거 범위:</strong> 원문의 정리와 매개변수별 분석입니다.</p><p className="leading-8"><strong>일반화할 수 없는 결론:</strong> 프로그램 의미, 영지식 또는 단순 독립표본 식만으로 전체 보안을 보장하지 않습니다.</p></CitationBlock></div>
<p data-stage-bridge="soundness" className="text-sm leading-7 text-muted-foreground">단순 표본 계산의 적용 범위를 정했습니다. 이후 연구가 추가하는 질문 구조를 봅니다.</p>
</section>
<section id="source" data-teach-level="6" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">9. WHIR는 값에 대한 제약도 같은 낮은 차수 검사와 연결합니다</h2>
<p className="leading-8">낮은 차수에 가깝다는 사실만으로 f(4)=10이라는 특정 평가가 고정되지는 않습니다. 예제 함수에서 f(2)=11도 알면 두 평가를 묶은 f(4)+2f(2)=10+22≡15 같은 선형 질문을 만들 수 있습니다. 함수의 모양과 이런 질문의 답을 함께 묶어야 사용자가 원하는 평가 증명이 됩니다.</p>
<p className="leading-8">WHIR의 원문은 constrained Reed–Solomon codes를 대상으로 삼습니다. 낮은 차수 조건에 평가나 선형 함수에 관한 제약을 결합하고 접기와 sumcheck로 남은 주장을 줄여 검증 작업을 바꿉니다. 여기서 15 계산은 그 제약의 의미를 보여 주는 작은 예이며 전체 WHIR 프로토콜이나 보안 매개변수를 구현한 예는 아닙니다.</p>
<p className="leading-8">확인한 원문은 2024-11-21 개정본입니다. 원 논문의 빠른 검증 수치는 저자 구현과 보안 목표의 자기보고이며 다른 체·해시·하드웨어나 EVM 가스 비용으로 바로 옮길 수 없습니다. 브랜드 이름 대신 어떤 평가 제약을 연결하고 검증자가 무엇을 읽는지 비교해야 합니다.</p>
<div id="source-whir"><CitationBlock source="WHIR · Abstract 및 §1, 2024-11-21 개정본" citeKey={1} href="https://eprint.iacr.org/2024/1586.pdf"><p className="leading-8">원문: <q>constrained Reed–Solomon codes</q></p><p className="leading-8">예제의 낮은 차수 조건과 f(4)+2f(2)=15라는 평가 제약을 별개의 주장으로 적은 뒤 함께 결속해야 합니다.</p></CitationBlock></div><div id="paper-whir"><CitationBlock source="WHIR: Reed–Solomon Proximity Testing with Super-Fast Verification" citeKey={2} href="https://eprint.iacr.org/2024/1586.pdf"><p className="leading-8"><strong>문제:</strong> 해시 기반 증명에서 평가 질문을 처리하는 검증 비용을 줄입니다.</p><p className="leading-8"><strong>기여:</strong> 제약된 부호의 근접성 검사와 sumcheck 기반 연결을 결합합니다.</p><p className="leading-8"><strong>전제:</strong> 논문의 체·부호율·오류 경계·해시 모델을 사용합니다.</p><p className="leading-8"><strong>근거 범위:</strong> 2024-11-21 개정 논문과 저자 평가 조건입니다.</p><p className="leading-8"><strong>일반화할 수 없는 결론:</strong> 모든 FRI 구현을 같은 보안과 비용으로 대체하거나 온체인 가스가 자동 감소한다는 결론은 아닙니다.</p></CitationBlock></div>
<p data-stage-bridge="source" className="text-sm leading-7 text-muted-foreground">새 방식이 더하는 것은 평가 제약과 검증 작업이라는 점을 잡았습니다. 실행 증명과의 경계를 마무리합니다.</p>
</section>
<section id="stark-boundary" data-teach-level="7" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">10. 표의 차수와 프로그램의 실행은 서로 다른 검사입니다</h2>
<p className="leading-8">FRI가 정상으로 판정해도 표에 담긴 값이 원래 계산과 연결되지 않았다면 실행의 정확성은 증명되지 않습니다. <a href="/cs/crypto/stark-theory">STARK 정본</a>은 같은 f(4)=10을 실제 중간 상태와 경계 조건으로 옮기는 일을 맡습니다.</p>
<p className="leading-8">평가표의 값을 열어 주는 과정은 개인 정보를 누설할 수 있습니다. 영지식이 필요하면 가리기와 시뮬레이션 분석을 포함해야 합니다. 투명한 준비 방식과 해시 사용은 그 자체로 영지식이나 모든 양자 공격에 대한 보장이 아닙니다.</p>
<p className="leading-8">질문 수와 평가 영역을 늘리면 보안 여유에 도움이 될 수 있지만 표·해시·메모리 비용도 늘어납니다. 매개변수를 바꿀 때는 전체 오류 분석과 생성·검증 비용을 함께 다시 계산합니다.</p>

<p data-stage-bridge="stark-boundary" className="text-sm leading-7 text-muted-foreground">16→8의 접기 계산과 그 계산이 보장하지 않는 범위를 함께 확인했습니다.</p>
<ReviewPrompts questions={["위치 4와 13의 10·11을β=5로 접으면 왜 12가 되나요? (답: 7절)", "독립 검사 세 번과 같은 위치 세 번의 누락 확률은 어떻게 다른가요? (답: 8절)", "낮은 차수가 맞아도 f(4)=10이나 실제 프로그램 실행이 자동으로 증명되지 않는 이유는 무엇인가요? (답: 10절)"]} />
</section>
</article>; }
