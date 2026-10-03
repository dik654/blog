import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import ZkCaseDiagram from "../ZkCaseDiagram";

/** 원문 확인: 2026-10-04. 작은 수치는 별도 가정입니다. */
export default function Article() { return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">1. 긴 계산을 이어 갈 때 지난 검사를 다시 쌓지 않으려면</h2>
<p className="leading-8">매 단계의 실행이 맞다는 자료를 계속 덧붙이면 계산이 길수록 전달할 증거도 늘어납니다. 이전까지의 계산과 이번 계산을 하나의 남은 확인 과제로 합칠 수 있다면 이어지는 계산의 관리가 쉬워집니다.</p>
<p className="leading-8">이 글은 두 산술 조건을 하나로 합칠 때 생기는 교차항을 직접 계산합니다. 합치기, 전체 실행 연결, 최종 증거 압축은 서로 다른 단계라는 점도 구분합니다.</p>

<p data-stage-bridge="overview" className="text-sm leading-7 text-muted-foreground">긴 계산을 누적하는 목적을 잡았습니다. 두 과제를 하나로 묶는 흐름을 봅니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">2. 이전 과제와 새 과제를 하나의 같은 형식으로 만듭니다</h2>
<p className="leading-8">입력에는 이미 누적한 조건과 새로 계산한 조건이 있습니다. 만드는 쪽은 두 조건에서 생기는 추가 항을 계산해 먼저 고정합니다. 그 뒤 정해진 숫자로 두 조건을 섞고 하나의 새 조건을 만듭니다.</p>
<p className="leading-8">새 조건을 만들었다고 검사가 사라진 것은 아닙니다. 마지막에 그 조건이 정말 만족되는지 확인할 수 있어야 하며 중간 단계가 앞 단계의 결과를 이어받았다는 관계도 보존해야 합니다.</p>

<p data-stage-bridge="black-box" className="text-sm leading-7 text-muted-foreground">합치기는 검사의 연기와 축소라는 점을 잡았습니다. 작은 두 곱셈을 합쳐 봅니다.</p>
</section>
<section id="case" data-teach-level="0" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">3. 3×4=12와 2×5=10을 두 배로 섞습니다</h2>
<p className="leading-8">17로 나눈 나머지에서 3×4=12와 2×5=10이라는 두 조건을 놓습니다. 숫자는 설명용 가정입니다. 두 번째 값을 2배해서 더하면 왼쪽 입력은 7과 14, 결과는 12+2×10≡15입니다.</p>
<p className="leading-8">그런데 7×14≡13으로 15와 같지 않습니다. 단순히 각 숫자를 같은 비율로 더하는 것만으로 곱셈 등식이 보존되지 않는 것입니다. 두 입력이 서로 곱해지는 과정에서 새로운 항이 생겼습니다.</p>

<p data-stage-bridge="case" className="text-sm leading-7 text-muted-foreground">단순 합치기가 깨지는 13과 15를 확인했습니다. 추가 항을 남기는 경로를 봅니다.</p>
</section>
<section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">4. 없애려던 차이를 별도 항으로 정확히 기록합니다</h2>
<p className="leading-8">왼쪽은 두 입력을 각각 합친 뒤 곱하므로 서로 다른 원본 입력이 곱해진 항이 생깁니다. 오른쪽의 결과에도 같은 방식으로 배율을 주고 남는 차이는 별도 칸에 기록합니다.</p>
<p className="leading-8">배율 3과 차이 2를 쓰면 7×14≡3×15+2≡13이 됩니다. 차이를 아무 때나 임의로 고르는 것은 허용하지 않고 원래 두 조건에서 어떻게 나왔는지 고정해야 합니다.</p>
<ZkCaseDiagram title="교차항을 버리지 않고 다음 조건에 남기기" steps={["3×4=12 · 2×5=10", "입력 7,14 · 결과 15", "7×14 = 3×15+2"]} arrows={["두 번째에 2배", "모두 mod17"]} />
<p data-stage-bridge="picture" className="text-sm leading-7 text-muted-foreground">새 형식에서 등식이 다시 13으로 맞았습니다. 실행 순서와 이 합치기의 관계를 봅니다.</p>
</section>
<section id="ivc" data-teach-level="2" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">5. 실행을 이어 붙이는 조건은 별도로 필요합니다</h2>
<p className="leading-8">두 산술 조건을 합칠 수 있어도 서로 연속된 실행이라는 뜻은 아닙니다. 예를 들어 같은 규칙 4배를 반복할 때 3→12→14가 맞으려면 두 번째 시작값이 첫 번째 끝값 12와 같아야 합니다. 이 연결이 없으면 서로 무관한 계산 둘을 묶을 수 있습니다.</p>
<p className="leading-8">계산 횟수, 시작 상태, 현재 상태와 사용할 규칙을 함께 묶어야 누적 실행의 의미가 생깁니다. 앞 절의 두 곱셈은 합치기의 대수를 보여 주는 예이며 그 자체가 3→12→14 전체 실행을 증명하는 회로는 아닙니다.</p>

<p data-stage-bridge="ivc" className="text-sm leading-7 text-muted-foreground">산술 합치기와 실행 연속성을 나눴습니다. 각각의 이름을 붙입니다.</p>
</section>
<section id="names" data-teach-level="3" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">6. 완화된 등식·폴딩·누적 실행을 구별합니다</h2>
<p className="leading-8">일반 R1CS의 곱셈 등식에 배율 u와 오차 벡터 E를 더한 형식이 relaxed R1CS입니다. 보통 u=1,E=0인 원래 조건에서 시작합니다. 여기서 오차는 부정확하게 계산해도 된다는 허가가 아니라 합칠 때 생긴 항의 기록입니다.</p>
<p className="leading-8">두 조건을 하나의 같은 형식으로 줄이는 작업은 folding입니다. NIFS는 Non-Interactive Folding Scheme, 대화 없이 수행하는 폴딩 방식입니다. IVC는 Incrementally Verifiable Computation으로 반복 계산 전체를 계속 검증할 수 있게 잇는 구조입니다.</p>
<p className="leading-8">마지막 누적 조건을 짧은 증거로 다시 만드는 작업은 compression입니다. Nova는 완화된 조건의 폴딩을 사용해 IVC를 구성합니다. 폴딩의 대수, IVC의 상태 연결, 압축과 영지식의 보안 조건을 각각 읽어야 합니다.</p>

<p data-stage-bridge="names" className="text-sm leading-7 text-muted-foreground">각 이름이 맡는 단계가 정해졌습니다. 교차항 1과 최종 오차 2를 전개합니다.</p>
</section>
<section id="relaxed-r1cs" data-teach-level="4" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">7. 곱을 전개하면 교차항이 왜 필요한지 드러납니다</h2>
<p className="leading-8">두 원본 조건의 배율은u₁=u₂=1, 오차는 E₁=E₂=0입니다. 교차항 T는 3×5+2×4−1×10−1×12=1입니다. 섞는 숫자 r=2를 넣으면 u′=1+2=3, E′=0+2×1+4×0=2입니다. 입력 7과 14, 결과 15에 적용하면 13=13이 됩니다.</p>
<p className="leading-8">일반적으로 왼쪽 곱을 전개하면 원본 첫 곱, r배의 두 교차 곱, r²배의 둘째 곱이 나옵니다. 오른쪽 배율과 결과를 함께 전개했을 때의 교차항을 빼면 T가 남습니다. 따라서 E′=E₁+rT+r²E₂가 되어야 같은 형식이 유지됩니다.</p>
<p className="leading-8">E′를 검증 없이 자유롭게 바꾸면 어떤 틀린 곱도 맞출 수 있습니다. 원래 값과 T의 commitment를 먼저 고정하고 그 뒤 r을 정해 새 commitment까지 같은 선형 조합으로 묶어야 합니다.</p>
<ExplainedFormula question="두 완화된 조건을 어떤 오차로 합쳐야 하나요?" idea="곱을 r의 차수별로 정리합니다. 상수항은 E₁, 일차 교차항은 T, 이차항은 E₂가 맡습니다." formula={String.raw`E^{\prime}=E_1+rT+r^2E_2,\quad T=AZ_1\circ BZ_2+AZ_2\circ BZ_1-u_1CZ_2-u_2CZ_1`} annotatedFormula={String.raw`E^{\prime}=E_1+rT+r^2E_2,\quad T=AZ_1\circ BZ_2+AZ_2\circ BZ_1-u_1CZ_2-u_2CZ_1`} operations={[{"expression": "rT", "annotation": ["서로 다른 원본에서 온 두 곱의 차이를 보존합니다."]}, {"expression": "r^2E_2", "annotation": ["두 번째 입력끼리의 곱에서 r이 두 번 나오므로 제곱합니다."]}]} terms={[{"symbol": "A,B,C", "name": "공통 선형 변환", "description": "두 원본은 같은 계수표를 사용합니다."}, {"symbol": "Z_1,Z_2", "name": "두 값 벡터", "description": "개인·공개값과 배율을 담습니다."}, {"symbol": "T", "name": "교차항", "description": "작은 예에서는 1입니다."}, {"symbol": "r", "name": "나중에 정한 숫자", "description": "작은 예에서는 2입니다."}, {"symbol": "E_1,E_2", "name": "원본 오차", "description": "작은 예에서는 둘 다 0입니다."}]} interpretation="E′=0+2×1+4×0=2이므로 7×14≡3×15+2가 맞습니다." assumptions={["같은 체와 계수표를 사용합니다.", "원본과 교차항 고정 뒤 r을 정해야 합니다."]} /><AlgorithmBlock title="완화된 R1CS 폴딩 (의사코드)" input={["공통 A,B,C, 두 Z,u,E와 그 commitment"]} steps={[{"code": "T ← AZ₁∘BZ₂ + AZ₂∘BZ₁ − u₁CZ₂ − u₂CZ₁", "note": "원본에서 교차항을 계산해 먼저 commit합니다."}, {"code": "r ← transcript_challenge(규칙, 두 원본, T의 commitment)", "note": "일치하는 직렬화와 맥락을 포함합니다."}, {"code": "Z′←Z₁+rZ₂; u′←u₁+ru₂; E′←E₁+rT+r²E₂", "note": "commitment도 대응하는 선형결합으로 갱신합니다."}]} output="새 완화된 조건과 이를 만족시키는 증인" />
<p data-stage-bridge="relaxed-r1cs" className="text-sm leading-7 text-muted-foreground">숫자 2를 임의 오차가 아닌 유도된 교차항으로 확인했습니다. 원 논문 식에 그대로 대입합니다.</p>
</section>
<section id="source" data-teach-level="5" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">8. 원문의 배율·오차 갱신이 같은 숫자를 보존합니다</h2>
<p className="leading-8">Nova Construction1은 교차항을 먼저 commit하고 검증자의 r을 받은 뒤 새 u와 E를 계산합니다. 원문의 E←E₁+r·T+r²·E₂에(0,0,1,2)를 넣으면 2입니다. 원문의 u←u₁+r·u₂에는(1,1,2)를 넣어 3을 얻습니다.</p>
<p className="leading-8">정상 입력이 정상 출력으로 이어지는 완전성은 앞 절의 전개로 검산할 수 있습니다. 거짓 원본이 우연히 통과하는 위험을 제한하는 보안 분석에는 commitment의 binding과 무작위 질문 모델이 추가로 필요합니다. 이 작은 체 17은 실제 보안에 충분하지 않습니다.</p>
<p className="leading-8">예를 들어 고정된 거짓 차이가 r의 차수 2 이하 다항식이라면 우연히 0이 되는 단순 상한은 2/17입니다. 처음부터 r=0만 쓰면 두 번째 원본이 아예 사라질 수 있습니다. 이 예는 질문의 필요성을 설명하며 Nova 전체 보안 정리의 대체물이 아닙니다.</p>
<div id="paper-nova-source"><CitationBlock source="Nova §4.1, Construction1, PDF p.15" citeKey={1} href="https://eprint.iacr.org/2021/370.pdf"><p className="leading-8">원문: <q>E ← E₁ + r · T + r² · E₂</q></p><p className="leading-8">E₁=E₂=0,T=1,r=2이면 E=2이며 동시에 u=3으로 갱신해야 등식이 유지됩니다.</p></CitationBlock></div>
<p data-stage-bridge="source" className="text-sm leading-7 text-muted-foreground">원문의 갱신과 단순 오류 상한의 범위를 나눴습니다. 누적 조건을 압축하는 다음 층을 확인합니다.</p>
</section>
<section id="compression-security" data-teach-level="6" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">9. 폴딩 후 남은 확인 과제를 마지막 증거로 만듭니다</h2>
<p className="leading-8">원 논문은 누적 조건의 만족을 더 짧은 영지식 증명으로 압축하는 별도 구성을 둡니다. 앞 절에서 얻은u′=3,E′=2는 “이미 검사가 끝난 증거”가 아니라 계속 유지할 관계의 일부입니다. 마지막 검증자는 그 누적 관계가 올바른 증인으로 만족됨을 확인해야 합니다.</p>
<p className="leading-8">논문의 복잡도에서 반복 횟수와 한 단계 크기는 서로 다른 변수입니다. 반복을 많이 해도 최종 크기가 단계 수에 비례해 늘지 않는다는 주장이, 각 단계가 큰 경우의 생성 메모리까지 작다는 뜻은 아닙니다. 폴딩 시간과 마지막 압축 시간·증거 크기·검증 시간을 따로 봅니다.</p>
<p className="leading-8">원 논문에는 hiding commitment와 가정 아래 영지식인 폴딩 구성이 있지만 값만 선형 결합한 산술 예 자체가 영지식은 아닙니다. 전체 IVC와 마지막 공개 증거의 개인정보 보장은 사용하는 구성과 무작위화에 맞춰 확인해야 합니다.</p>
<div id="source-nova-compression"><CitationBlock source="Nova §1.2, Theorem2, PDF p.4" citeKey={1} href="https://eprint.iacr.org/2021/370.pdf"><p className="leading-8">원문: <q>Succinct zero-knowledge proofs of valid IVC proofs</q></p><p className="leading-8">앞의 u′=3,E′=2가 속한 누적 관계를 만족하는 증인이 있다는 증명을 압축하는 단계입니다. 폴딩의 숫자 계산만으로 최종 proof가 완성되지는 않습니다.</p></CitationBlock></div><div id="paper-nova"><CitationBlock source="Nova: Recursive Zero-Knowledge Arguments from Folding Schemes" citeKey={2} href="https://eprint.iacr.org/2021/370.pdf"><p className="leading-8"><strong>문제:</strong> 오래 이어지는 계산을 매 단계 효율적으로 갱신하며 검증합니다.</p><p className="leading-8"><strong>기여:</strong> 완화된 R1CS의 폴딩으로 IVC를 구성하고 압축을 별도로 연결합니다.</p><p className="leading-8"><strong>전제:</strong> 동형 commitment·곡선·무작위 오라클 등 원문의 조건을 사용합니다.</p><p className="leading-8"><strong>근거 범위:</strong> 원 논문의 구성과 저자 실험 환경에서의 평가입니다.</p><p className="leading-8"><strong>일반화할 수 없는 결론:</strong> 특정 구현의 모든 회로·재시작 기능·양자 안전성을 보장하지는 않습니다.</p></CitationBlock></div>
<p data-stage-bridge="compression-security" className="text-sm leading-7 text-muted-foreground">누적 관계와 최종 증거를 구분했습니다. 이어서 실행 경계와 재시작 조건을 확인합니다.</p>
</section>
<section id="release" data-teach-level="7" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">10. 상태가 이어지고 가정이 유지되는지 마지막까지 확인합니다</h2>
<p className="leading-8">3→12를 확인한 후 다음 단계가 11에서 시작하면 같은 실행이 아닙니다. 저장했다가 이어 갈 때도 규칙 식별자·시작 상태·현재 상태·계산 횟수를 함께 읽어야 합니다. 누적 자료 파일을 불러왔다는 사실만으로 연속성 검사를 대신할 수는 없습니다.</p>
<p className="leading-8">새 T나 E를 바꾸거나 다른 계수표의 조건을 섞으면 원래 전개를 적용할 수 없습니다. 무작위 질문의 생성 순서와 commitment의 개인정보 보호 조건도 유지해야 합니다. 투명한 준비가 가능한 곡선 기반 구성이라도 이산로그 가정이 양자 공격에 그대로 안전한 것은 아닙니다.</p>
<p className="leading-8">여러 단계를 합치는 이유는 검증 관리 비용을 줄이기 위해서입니다. 한 단계의 회로 크기, 압축 빈도, 보관 중인 증인과 중간 자료의 양에 따라 실제 비용은 달라집니다. <a href="/cs/crypto/prover-memory-and-verifier-cost">메모리와 검증 비용 정본</a>에서 이 항목을 다시 분리합니다.</p>

<p data-stage-bridge="release" className="text-sm leading-7 text-muted-foreground">두 곱셈의 교차항에서 장기 실행의 연결까지 따라왔습니다. 같은 조건을 바꿔 결과를 예측해 봅니다.</p>
<ReviewPrompts questions={["두 곱셈을 r=2로 섞을 때 T=1과 E′=2는 어떻게 나오나요? (답: 7절)", "r을 항상 0으로 두면 어느 원본 조건이 사라질 수 있나요? (답: 8절)", "폴딩 결과의 등식이 맞다는 사실과 최종 짧은 영지식 증거를 구별해야 하는 이유는 무엇인가요? (답: 9절)"]} />
</section>
</article>; }
