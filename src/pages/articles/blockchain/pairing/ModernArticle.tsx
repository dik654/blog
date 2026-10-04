import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import PairingTraceViz from "./viz/PairingTraceViz";
import { codeRefs, fileTrees, projectMetas } from "./codeRefs";
const LYNN="https://crypto.stanford.edu/pbc/thesis.pdf";
const MILLER="https://crypto.stanford.edu/miller/miller.pdf";
const ARK="https://github.com/arkworks-rs/algebra/blob/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ec/src/models/bn/mod.rs";
export default function ModernArticle(){const sidebar=useCodeSidebar();return <div className="space-y-16 [overflow-wrap:anywhere]">
<section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 두 점 사이의 곱셈 관계를 작은 값으로 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            어떤 사람이 처음 점 P를 두 번 더한 점과 다른 점 Q를 세 번 더한 점을 보냈다고 합시다. 받은 점의 좌표만 곱해서 2×3을 확인할 수는 없습니다. 페어링은 정해진 두 점을
            받아 별도의 곱셈 세계에 값을 만들고 점을 반복해서 더한 횟수를 그 값의 거듭제곱으로 옮깁니다.
          </p>
<p className="leading-8">이번에는 숫자를 19로 나눈 나머지로 계산하겠습니다. 처음 점은 P=(5,4), 다른 쪽 점은 Q=(14,4u)이고 u²=−1입니다. 계산을 끝내면 7+3u를 얻습니다. 두 배의 P와 세 배의 Q를 넣으면 이 값의 여섯제곱을 얻는다는 관계를 실제로 확인할 것입니다.</p>
<p className="leading-8">
            이 작은 체계는 손으로 따라가기 위한 예입니다. 실제 BN254의 곡선이나 매개변수와 같지 않습니다. 먼저 작은 계산을 끝까지 이해한 뒤 고정한 arkworks 원문에서
            반복·선 평가·마지막 거듭제곱이 어느 구조로 구현되는지 보겠습니다.
          </p>
</div></section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 점 두 개가 들어와 체의 원소 하나가 나옵니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">입력은 허용된 두 군의 점입니다. 가운데에서는 현재 점 R을 두 배 하거나 처음 점을 더하면서 그때 생기는 선을 다른 입력 점에서 평가해 누적값 f에 곱합니다. 마지막에는 f를 정해진 횟수만큼 거듭제곱합니다. 출력은 새 곡선 점이 아니라 확장체의 원소입니다.</p>
<p className="leading-8">두 종류의 상태를 분리하면 계산을 잃어버리지 않습니다. R은 곡선 위에서 어디까지 더했는지 나타냅니다. f는 그 이동에 대응하는 함수 값을 모읍니다. R이 항등원 O에 도착해도 f가 0이 되는 것은 아닙니다. 이번 예에서는 R=O일 때 f=15+14u입니다.</p>
<p className="leading-8">이 구조가 제공하는 것은 곱셈 관계를 확인하는 수단입니다. 입력 점만으로 숨은 배수를 쉽게 복원해 주는 장치는 아닙니다. 서명이나 증명에서는 어떤 점을 허용하고 어떤 관계를 검사할지 별도의 규칙을 정합니다.</p>
</div></section>
<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 19로 나누는 곡선과 다섯 번 더하면 돌아오는 점</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">작은 곡선은 y²=x³+x입니다. P=(5,4)를 넣으면 왼쪽 16과 오른쪽 130의 나머지가 모두 16입니다. 곡선은 유한 좌표의 점 19개와 O를 합쳐 20개입니다. P를 반복해 더하면 (5,4) → (9,15) → (9,4) → (5,15) → O가 됩니다. 따라서 P의 위수는 5입니다.</p>
<p className="leading-8">
            19로 나누는 세계에서 −1은 제곱수가 아니므로 u²=−1인 기호를 붙여도 나눗셈 가능한 체를 만들 수 있습니다. 그 원소는 a+bu로 적고 곱한 뒤 u²을 −1로 바꿉니다.
            계수 a와 b는 각각 19로 나눕니다. 이 체에는 19²=361개의 원소가 있습니다.
          </p>
<p className="leading-8">곡선의 점 (x,y)를 (−x,uy)로 보내면 이 확장체에서도 곡선 위에 남습니다. P를 옮긴 Q=(14,4u)는 왼쪽 −16≡3, 오른쪽 14³+14≡3을 만족합니다. 이 변환은 여기서 사용할 두 번째 입력을 만듭니다. 두 쪽 모두 다섯 번 더하면 O가 됩니다.</p>
<p className="leading-8">앞 글의 점 덧셈과 확장체의 곱셈을 사용합니다. 좌표 계산이 낯설면 <Link to="/cs/crypto/elliptic-curves#concrete">점 덧셈</Link>과 <Link to="/cs/crypto/extension-field-theory#case">확장체의 작은 사례</Link>를 먼저 확인할 수 있습니다.</p>
</div></section>
<section id="picture" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 같은 점과 누적값이 함께 바뀌는 네 장면</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">반복 횟수 5를 이진수로 쓰면 101입니다. 맨 앞의 1은 처음 점 P와 누적값 1로 시작하는 데 사용합니다. 다음 0을 읽을 때는 두 배만 하고 마지막 1을 읽을 때는 두 배 뒤에 P를 한 번 더합니다.</p>
<p className="leading-8">그림에서는 점의 이동과 누적값을 두 줄로 나누었습니다. 처음에는 R=P, f=1입니다. 첫 두 배 뒤에는 R=2P, f=3+16u이고 다음 두 배 뒤에는 R=4P, f=8+10u입니다. 마지막 P를 더하면 R=O, f=15+14u가 됩니다. 아래 절에서 모든 곱과 나눗셈을 계산하겠습니다.</p>
</div><PairingTraceViz/></section>
<section id="why" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 함수를 통째로 전개하지 않고 필요한 값만 계산합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            P를 다섯 번 더하는 사례는 짧지만 실제 군의 위수는 매우 큽니다. 필요한 함수를 긴 다항식의 비로 전개하면 표현 자체가 커집니다. 두 배와 더하기를 따라 작은 선 함수의 값을
            곱하면 최종 함수를 한꺼번에 펼치지 않고 Q에서의 값만 얻을 수 있습니다.
          </p>
<p className="leading-8">
            마지막 거듭제곱에도 역할이 있습니다. 이번 확장체의 0 아닌 원소는 360개이고 원하는 출력은 다섯제곱하면 1이 되는 다섯 원소입니다. 360을 5로 나눈 72를 지수로 쓰면
            결과가 그 안에 들어갑니다. 처음 계산에서 남은 일부 배수도 이 과정에서 사라집니다.
          </p>
<p className="leading-8">하지만 아무 생략이나 허용되는 것은 아닙니다. 어떤 인자를 버렸다면 마지막 거듭제곱에서 정말 1이 되는지 증명해야 합니다. 같은 결과가 나오는 작은 예 하나만으로 모든 곡선과 모든 구현을 일반화할 수는 없습니다.</p>
</div></section>
<section id="names" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 지금 본 점·함수·출력에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">점을 따라 작은 선의 값을 곱하는 반복을 Miller 알고리즘이라고 부릅니다. 누적값 f는 Miller 값이며 그 자체로 아직 최종 페어링 출력이라고 부르지 않습니다. 마지막 거듭제곱은 final exponentiation입니다. 입력 군을 G₁·G₂, 출력 곱셈 군을 Gₜ라고 씁니다.</p>
<p className="leading-8">이 예의 입력 부분군 크기 r은 5, 바탕 체 크기 p는 19입니다. r이 pᵏ−1을 나누는 가장 작은 양의 k를 임베딩 차수라고 부릅니다. 5는 18을 나누지 않고 360을 나누므로 여기서는 k=2입니다. 입력을 다섯 번 더해 돌아오는 성질과 출력의 다섯제곱이 1인 성질이 연결됩니다.</p>
<p className="leading-8">여기서 계산하는 것은 점을 옮기는 변환과 결합한 축약 Tate 페어링입니다. Weil·Tate·Ate라는 이름은 입력 공간과 정의, 계산 순서까지 구분합니다. 뒤의 실제 BN254 구현은 optimal Ate 계열이므로 이 작은 Tate 반복의 5를 그대로 큰 r로 바꾼 코드라고 읽지 않습니다.</p>
</div></section>
<section id="miller-loop" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 101의 두 배와 더하기를 모두 계산합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">한 단계에서 선의 값 ℓ(Q)를 새 점을 지나는 수직선의 값 v(Q)로 나눈 비를 g라고 하겠습니다. 첫 두 배에서 g=3+16u입니다. f를 제곱해 g를 곱하므로 f₂=1²·(3+16u)=3+16u이고 R은 2P=(9,15)가 됩니다.</p>
<p className="leading-8">다음 두 배에서는 g=10+11u입니다. (3+16u)²을 계산하면 1의 계수는 9−256≡0, u의 계수는 96≡1이므로 u만 남습니다. 따라서 f₄=u(10+11u)=−11+10u=8+10u이고 R은 4P=(5,15)입니다.</p>
<p className="leading-8">마지막 비트가 1이므로 P를 더합니다. 4P와 P는 서로 반대 점이라 합이 O이며 선은 x−5인 수직선입니다. Q의 x=14를 넣은 값은 9입니다. f₅=(8+10u)·9=15+14u를 얻습니다. 점이 O가 된 사실과 누적값이 0이 아닌 사실을 구분해 두세요.</p>
</div></section>
<section id="line-values" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 선과 수직선의 비가 실제로 두 값을 만듭니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">유한한 두 점 U·V의 합이 O가 아닐 때, 기울기를 s라 쓰고 선을 ℓ(x,y)=y−yᵤ−s(x−xᵤ)로 고정하겠습니다. 수직선은 v(x,y)=x−xᵤ₊ᵥ입니다. 이 부호와 계수 선택을 끝까지 유지합니다. 합이 O일 때의 v는 1로 둡니다.</p>
<p className="leading-8">처음 P를 두 배 하는 기울기는 (3·5²+1)/(2·4)=76/8≡0입니다. 그래서 선에 Q를 넣으면 4u−4=15+4u이고, 새 점 2P의 x=9를 뺀 수직선 값은 14−9=5입니다. 5의 역원은 4이므로 (15+4u)/5=3+16u입니다.</p>
<p className="leading-8">2P=(9,15)를 두 배 하는 기울기는 (3·9²+1)/(2·15)≡16/11≡17입니다. 선의 값은 4u−15−17(14−9)=14+4u입니다. 새 점 4P의 x=5를 빼면 분모는 9이고, 역원은 17입니다. 따라서 (14+4u)/9=10+11u를 얻습니다.</p>
<p className="leading-8">
            분모가 0이면 이 나눗셈을 그대로 할 수 없습니다. 선의 값이 0인 중간 평가도 따로 다루어야 합니다. 이번 Q에서는 나온 분모 5·9가 모두 0이 아니며 마지막 수직선 값
            9도 0이 아닙니다. 일반 입력에서는 평가 위치와 함수의 영점·극점이 겹치지 않는 조건을 확인해야 합니다.
          </p>
</div></section>
<section id="divisor" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 점의 이동과 함수의 영점·극점이 같은 식을 유지합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">함수가 어디서 몇 번 0이 되거나 무한대로 커지는지를 기록한 형식적 합을 divisor라고 합니다. 여기서 괄호 (P)는 좌표나 곱셈이 아니라 그 위치의 표식입니다. 누적 함수 fₙ의 기록은 n(P)−(nP)−(n−1)(O)로 유지됩니다.</p>
<p className="leading-8">선과 수직선의 비 ℓᵤ,ᵥ/vᵤ₊ᵥ에는 (U)+(V)−(U+V)−(O)가 남습니다. fₘ과 fₙ을 곱하고 U=mP, V=nP인 이 비를 곱해 보세요. 기존의 −(mP)와 −(nP)가 새로 생긴 +(mP)와 +(nP)에 각각 상쇄됩니다. 결과는 (m+n)(P)−((m+n)P)−(m+n−1)(O)입니다.</p>
<p className="leading-8">두 배에서는 m=n이므로 fₙ²에 선의 비를 곱합니다. P를 더하는 단계에서는 f₁=1이므로 이미 쌓인 fₙ에 선의 비만 더 곱합니다. 이 상쇄가 점 R과 누적 함수 f를 함께 갱신하는 이유입니다.</p>
<p className="leading-8">
            영점과 극점 기록만으로 함수 값이 유일하게 정해지는 것은 아닙니다. 0 아닌 상수를 곱해도 같은 기록을 가집니다. 따라서 반복에서 사용하는 선의 정규화와 평가 규칙을 별도로
            정해야 합니다. 앞 절은 그 선택까지 고정한 직접 계산이며 임의의 확장체 상수가 마지막에 항상 사라진다고 주장하지 않습니다.
          </p>
</div><ExplainedFormula question="왜 두 배 때는 누적값도 제곱할까요?" idea="같은 함수의 기록을 두 번 더한 뒤 선의 비로 새 점을 연결합니다." formula={String.raw`f_{m+n}=f_m f_n\frac{\ell_{mP,nP}}{v_{(m+n)P}}`} annotatedFormula={String.raw`\begin{aligned}f_{m+n}(Q)&=f_m(Q)f_n(Q)\\&\quad\cdot\frac{\ell_{mP,nP}(Q)}{v_{(m+n)P}(Q)}\\f_4&=(3+16u)^2(10+11u)\\&=8+10u\end{aligned}`} operations={[{expression:"f_m f_n",annotation:"두 함수의 영점·극점 기록을 합합니다."},{expression:"ℓ/v",annotation:"중간 두 점의 항을 없애고 합의 점을 남깁니다."}]} terms={[{symbol:"m,n",name:"P를 더한 횟수",description:"두 배 단계는 m=n입니다."},{symbol:"Q",name:"함수를 평가할 점",description:"이번에는 (14,4u)이며 영점·극점 경계를 확인합니다."},{symbol:"ℓ/v",name:"선과 수직선의 비",description:"8절에서 계수와 부호를 고정한 함수입니다."}]} assumptions={["비가 정의되는 평가 위치와 일관된 함수 정규화를 사용합니다.","divisor의 일치만으로 상수까지 같은 함수라고 단정하지 않습니다."]} interpretation="현재 점과 누적값이 대응하는 불변식이므로 실제 점 갱신과 함수 갱신을 함께 대조합니다."/></section>
<section id="paper-miller" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 원문의 반복식에 같은 101과 두 누적값을 넣습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            Ben Lynn의 2007년 학위논문 3.9.2절 Algorithm 3은 처음 점과 누적값 1로 시작하고 맨 앞 비트를 제외한 각 비트에서 누적값을 제곱한 뒤 접선과 수직선의
            비를 곱합니다. 비트가 1이면 처음 점을 잇는 선의 비를 추가합니다. PDF 51쪽의 이 순서에 5=101을 넣으면 앞의 f₂·f₄·f₅가 됩니다.
          </p>
<p className="leading-8">원문은 바로 다음 절에서 중간 영점·극점의 문제를 다룹니다. 이 조건을 빼고 반복식만 복사하면 나눗셈 실패를 놓칠 수 있습니다. 원문의 별도 수치 예제는 59로 나누는 곡선을 사용합니다. 여기의 19와 P=(5,4)는 같은 알고리즘을 적용하려고 따로 정한 예입니다.</p>
<p className="leading-8">Miller의 저자 공개 PDF는 1986년의 Short Programs for functions on Curves입니다. 그 2절에서 작은 함수들을 조합하는 절차를 읽을 수 있습니다. 이 초기 원문만으로 현대 BN254의 매개변수나 최적화 지수가 정해지는 것은 아닙니다.</p>
</div><CitationBlock source="Ben Lynn (2007) · 3.9.2–3.9.3절, PDF 51–52쪽" href={LYNN} citeKey={1}>반복 순서와 중간 평가 조건을 같은 101 사례에 적용합니다.</CitationBlock><CitationBlock source="Victor S. Miller (1986) · Short Programs for functions on Curves" href={MILLER} citeKey={2}>공개 PDF의 실제 제목과 2절의 함수 조합을 대조했습니다.</CitationBlock></section>
<section id="final-exponent" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 72제곱으로 다섯제곱하면 1인 값에 들어갑니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            0 아닌 f에 대해 f³⁶⁰=1입니다. 따라서 g=f⁷²라 놓으면 g⁵=f³⁶⁰=1입니다. 실제 f₅=15+14u를 72제곱하면 7+3u를 얻으며 이 값은 1이 아니고
            다섯제곱은 1입니다. 5가 소수이므로 이 출력의 위수는 정확히 5입니다.
          </p>
<p className="leading-8">원소 360개를 전부 계산하면 다섯 출력에 각각 72개씩 대응합니다. 하지만 이 거듭제곱을 이미 나온 출력에 다시 적용해 같은 값이 된다고 생각하면 안 됩니다. 72≡2 mod 5이므로 g⁷²=g²=2+4u이고 처음 7+3u와 다릅니다. 여기서 부분군으로 보낸다는 말은 두 번 적용해도 같다는 뜻의 사영을 보장하지 않습니다.</p>
<p className="leading-8">0에는 이 논증을 적용하지 않습니다. 0의 72제곱은 0이며 곱셈 군의 원소가 아닙니다. 실제 구현이 마지막 계산에서 역원을 구하는 것도 이 경계와 연결됩니다. 뒤에서 0을 넣었을 때 반환값을 확인하겠습니다.</p>
</div><ExplainedFormula question="왜 지수가 72인가요?" idea="곱셈 군 크기를 원하는 출력 군 크기로 나눕니다." formula={String.raw`E=\frac{p^k-1}{r}`} annotatedFormula={String.raw`\begin{aligned}E&=\frac{p^k-1}{r}\\&=\frac{19^2-1}{5}=72\\g&=f^E=7+3u\\g^r&=f^{p^k-1}=1\end{aligned}`} operations={[{expression:"19²−1=360",annotation:"확장체에서 0을 제외한 원소 수입니다."},{expression:"360/5=72",annotation:"결과의 다섯제곱이 1이 되게 합니다."}]} terms={[{symbol:"p,k",name:"체 크기와 확장 차수",description:"작은 예는 p=19, k=2입니다."},{symbol:"r",name:"출력 군 크기",description:"여기서는 소수 5입니다."},{symbol:"f",name:"거듭제곱 전 값",description:"반드시 0 아닌 체 원소여야 합니다."}]} assumptions={["r이 pᵏ−1을 나누며 0 아닌 원소에서 계산합니다.","일반 지수와 특정 구현이 선택한 페어링 정규화는 구분합니다."]} interpretation="g가 군 안에 있다는 사실만으로 임의 입력에 대한 보안이나 올바른 함수 반복을 증명하지는 않습니다."/></section>
<section id="bilinearity" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 두 배와 세 배는 출력의 여섯제곱으로 옮겨집니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">같은 작은 곡선에서 e(P,Q)=g=7+3u입니다. 두 배의 P와 세 배의 Q를 넣어 전 과정을 다시 계산하면 g⁶을 얻습니다. g⁵=1이므로 이 경우 g⁶=g입니다. 출력이 같아졌다고 입력 점까지 같은 것은 아닙니다.</p>
<p className="leading-8">일반적인 관계는 e(aP,bQ)=e(P,Q)ᵃᵇ입니다. 입력에서는 군의 덧셈을 반복하고 출력에서는 곱셈을 반복합니다. 두 관계를 한 식에 연결하는 성질을 쌍선형성이라고 합니다. 어느 입력에도 항상 1만 나오는 함수라면 이 식은 만족해도 쓸모가 없으므로 비퇴화 조건도 필요합니다.</p>
<p className="leading-8">보존한 작은 검산 코드는 1부터 4까지의 a·b 16쌍을 모두 계산해 이 관계를 확인했습니다. 이 유한 사례의 전수검사는 큰 곡선에서의 일반 정리 증명을 대신하지 않습니다. 특히 Weil 함수 자체의 동일 입력 성질과 여기의 점을 옮긴 Tate 입력을 섞어 읽지 않습니다.</p>
</div></section>
<section id="denominators" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">13. 마지막 9를 빼도 최종값이 같은 이유를 설명합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">일부러 마지막 P 더하기의 선 값 9를 빼 보겠습니다. 원래 f₅=15+14u 대신 f₄=8+10u가 남고 현재 점도 4P에서 멈춥니다. 앞의 함수 불변식과 5P=O라는 경로는 달라집니다. 그런데 두 누적값을 각각 72제곱하면 모두 7+3u가 나옵니다.</p>
<p className="leading-8">이유는 9가 작은 바탕 체의 0 아닌 원소이고 9¹⁸=1이기 때문입니다. 72는 18의 배수이므로 9⁷²=1입니다. 앞서 나눈 수직선 값 5와 9도 같은 조건을 만족합니다. 이 예에서는 그 인자를 버려도 마지막 결과에 영향이 없습니다.</p>
<p className="leading-8">이런 조건을 이용하는 최적화를 분모 제거라고 합니다. 여기의 계산은 생략이 가능한 이유를 보여 줍니다. 모든 비트나 모든 선을 임의로 생략해도 된다는 증거는 아닙니다. 원시 Miller 값을 비교하는 검사와 마지막 페어링 값을 비교하는 검사가 서로 다른 오류를 발견할 수 있다는 점도 기억해 두세요.</p>
</div></section>
<section id="source-structure" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">14. 실제 BN254는 준비된 선 계수와 반복을 나눕니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">이제 arkworks algebra 저장소의 commit 7ad88c46을 고정해 읽습니다. ark-ec·ark-ff는 0.5.0, ark-bn254의 패키지 버전은 0.5.0-alpha.0입니다. 파일 이름이 비슷하다는 이유로 다른 릴리스의 좌표 배치나 매개변수를 섞지 않습니다.</p>
<p className="leading-8">
            G2Prepared는 한 입력 점에서 반복 중 사용할 선의 계수를 미리 모읍니다. 실제 계산 함수는 이 계수를 꺼내 다른 입력 점의 x·y에 대입합니다. 작은 예에서 선 ℓ를
            만들고 Q를 넣었던 역할에 대응하지만 실제 Ate 구현은 두 군의 역할과 twist 표현을 사용하므로 P·Q라는 기호만 보고 같은 방향으로 복사하지 않습니다.
          </p>
<p className="leading-8">BN254의 설정은 D형 twist입니다. 실제 ell 함수는 첫 계수에 평가점의 y, 둘째 계수에 x를 곱하고 mul_by_034를 부릅니다. 희소 확장체 곱으로 생략할 칸은 이 타입과 배치에서 결정됩니다. <Link to="/cs/crypto/sparse-multiplication#in-miller">희소 곱셈 글</Link>에서 이 호출과 여섯 계수의 대응을 이어 볼 수 있습니다.</p>
</div><CodeViewButton label="실제 BN254 매개변수" onClick={()=>sidebar.open("config",codeRefs["config"])}/><CodeViewButton label="점을 따라 선 계수를 모으는 원문" onClick={()=>sidebar.open("prepare",codeRefs["prepare"])}/><CodeViewButton label="같은 계수를 평가하는 D형 분기" onClick={()=>sidebar.open("ell",codeRefs["ell"])}/></section>
<section id="source-loop" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">15. 큰 r 대신 6z+2의 부호 있는 표현을 반복합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">고정 설정의 z는 4965661367192848881입니다. ATE_LOOP_COUNT에는 6z+2=29793968203157093288을 나타내는 65개의 −1·0·1 숫자가 낮은 자리부터 들어 있습니다. 처음 자리 뒤의 각 숫자에서 두 배를 하고, 1이면 원래 점을, −1이면 반대 점을 더하는 선 계수를 만듭니다.</p>
<p className="leading-8">이 설정의 단일 입력쌍에서는 두 배 선 64개와 추가 선 21개가 필요합니다. 끝에는 Frobenius로 옮긴 점을 사용하는 선 두 개가 더 붙어 총 87개의 선 평가를 합니다. 누적값은 처음 1이어서 첫 제곱을 건너뛰므로 코드의 square 호출은 63회입니다. 두 배 선 수와 제곱 함수 호출 수는 다릅니다.</p>
<p className="leading-8">원문의 준비 함수가 끝의 두 점을 만들고, Miller 함수가 그 계수 두 개를 마지막에 사용합니다. 이 마무리를 작은 5=101 반복의 비트로 오해하면 안 됩니다. 여기의 수는 고정 버전·한 쌍·양의 z에 대한 코드 경로 수이며 CPU 명령 수나 GPU 시간 측정값이 아닙니다.</p>
</div><CodeViewButton label="65자리 반복과 마지막 두 선" onClick={()=>sidebar.open("loop",codeRefs["loop"])}/><CitationBlock source="arkworks algebra · 고정 commit의 BN 구현" href={ARK} citeKey={3}>준비 계수의 순서, 반복의 63회 제곱 호출, 87개 선 평가를 실제 실행과 대조했습니다.</CitationBlock></section>
<section id="source-final" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">16. 이 버전의 마지막 지수는 일반식에 배수가 더 붙습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">일반 지수 E=(p¹²−1)/r는 (p⁶−1)(p²+1)과 H=(p⁴−p²+1)/r로 나눌 수 있습니다. 실제 원문의 앞부분은 켤레·역원·Frobenius를 사용해 먼저 (p⁶−1)(p²+1)승을 계산합니다. 0에는 역원이 없으므로 이 단계의 반환값은 None입니다.</p>
<p className="leading-8">하지만 뒤의 최적화 코드를 단순히 H승과 정확히 같은 값이라고 설명하면 이 버전에서는 틀립니다. 원문 주석이 정리한 지수는 cH이고 c=2z(6z²+3z+1)입니다. 앞부분까지 합친 출력은 일반 E승에 다시 c를 거듭제곱한 Mᶜᴱ입니다.</p>
<p className="leading-8">이 z에서 c는 1469306990098747947464455738335385361638823152381947992820이고 gcd(c,r)=1입니다. 출력 군에서 c제곱은 되돌릴 수 있는 변환입니다. 그래서 쌍선형성과 비퇴화, 여러 출력의 곱이 1인지 보는 판정은 유지됩니다. 그러나 출력 원소나 그 바이트가 일반 E승과 같다고 보장하지는 않습니다.</p>
<p className="leading-8">실제 원문의 이름이 final_exponentiation이라고 해서 다른 라이브러리의 중간 Miller 값과 끝 지수를 임의로 섞으면 안 됩니다. 비교하려면 곡선·입력 변환·선 정규화·끝 지수와 직렬화까지 맞추어야 합니다. Lynn의 6.15절은 군 크기와 서로소인 배수로 페어링을 거듭제곱해도 비퇴화를 유지하는 일반적인 이유를 설명합니다.</p>
</div><CodeViewButton label="실제 쉬운 부분과 0의 경계" onClick={()=>sidebar.open("easy",codeRefs["easy"])}/><CodeViewButton label="H가 아닌 cH를 계산한다는 원문" onClick={()=>sidebar.open("hard",codeRefs["hard"])}/><CitationBlock source="Ben Lynn (2007) · 6.15절, PDF 113쪽" href={LYNN} citeKey={4}>출력 군 크기와 서로소인 배수로 거듭제곱하는 경우의 성질을 대조합니다.</CitationBlock></section>
<section id="verification" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">17. 실제 실행에서 다른 값과 같은 판정을 각각 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">보존한 Rust 프로그램은 이 commit을 Cargo.lock으로 고정해 CPU에서 실제 실행했습니다. BN254의 생성점 두 개로 원시 Miller 값 M을 얻고 일반 정수 지수 E와 cE를 각각 거듭제곱했습니다. 실제 final_exponentiation의 결과는 Mᶜᴱ와 같고 Mᴱ와는 달랐습니다. 두 결과 모두 r제곱하면 1입니다.</p>
<p className="leading-8">c의 r에 대한 역수를 계산해 실제 출력에 거듭제곱하면 Mᴱ로 돌아오는 것도 확인했습니다. 이는 작은 곡선의 72승 계산과 실제 BN254 결과를 같은 숫자라고 주장하는 검사가 아닙니다. 일반 설명과 구현의 정규화 차이를 같은 실제 M으로 비교한 검사입니다.</p>
<p className="leading-8">선 평가에서는 같은 G2Prepared 계수를 사용하면서 희소 곱 대신 모든 칸을 채운 일반 확장체 곱으로 계산해 원시 M이 일치하는지 확인했습니다. 이 검사는 호출 순서와 희소 칸의 대응을 확인합니다. 선 생성식과 체 라이브러리를 공유하므로 독립적인 페어링 구현 두 개를 대조한 검사는 아닙니다.</p>
</div><CodeViewButton label="E승과 cE승을 비교한 실제 검산 코드" onClick={()=>sidebar.open("native",codeRefs["native"])}/></section>
<section id="multi-pairing" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">18. 여러 관계는 값을 곱한 뒤 한 번에 마무리합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">실제 생성점을 P·Q라 쓰면 e(2P,3Q)·e(−6P,Q)=1입니다. 앞 출력의 지수 6과 뒤 출력의 지수 −6이 상쇄되기 때문입니다. 여러 서명이나 증명 항을 검사할 때 이런 곱 관계가 나타납니다. 어떤 항을 넣을지는 각 프로토콜이 정합니다.</p>
<p className="leading-8">마지막 거듭제곱은 곱을 보존하므로 원시 Miller 값들을 먼저 곱하고 한 번만 마무리할 수 있습니다. 보존한 실행에서는 두 쌍을 합친 multi_miller_loop의 값이 각각 계산한 두 원시 값의 곱과 같았습니다. 한 번 마무리한 결과와 따로 마무리한 결과의 곱도 같고, 그 값은 체의 1이었습니다.</p>
<p className="leading-8">c가 r과 서로소이므로 일반 출력들의 곱이 1일 조건과 c제곱한 출력들의 곱이 1일 조건도 같습니다. 반대로 어느 라이브러리의 c가 다른데 원시 출력을 서로 같다고 비교하는 것은 별도 문제입니다. 마지막 계산을 공유한다는 구조를 확인했을 뿐, 이 실행에서는 처리 시간이나 배치 크기별 성능을 측정하지 않았습니다.</p>
</div><CodeViewButton label="두 쌍의 원시 값과 최종 곱을 대조하는 코드" onClick={()=>sidebar.open("fused",codeRefs["fused"])}/></section>
<section id="release" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">19. 입력 검사와 항등원 정책은 함수 바깥까지 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">점의 좌표가 곡선 위에 있는지와 필요한 부분군에 있는지는 별개의 검사입니다. 타입 이름 G1Affine·G2Affine만으로 외부 바이트가 이미 검증되었다고 생각하면 안 됩니다. 안전한 역직렬화나 명시적 검사를 어디서 수행했는지 확인해야 합니다. 이전 <Link to="/cs/crypto/elliptic-curves#subgroup">타원곡선 글</Link>은 이 경계를 실제 잘못된 점으로 확인합니다.</p>
<p className="leading-8">이 고정 Miller 함수는 항등원 입력쌍을 건너뜁니다. 실제 항등원과 정상 Q의 페어링은 체의 1이었습니다. 그러므로 “페어링 함수는 모든 항등원 입력을 거부한다”는 설명은 맞지 않습니다. 어떤 서명이나 증명이 항등원 공개키를 금지할지는 해당 프로토콜의 별도 입력 정책입니다.</p>
<p className="leading-8">PairingOutput은 결과 군을 덧셈 인터페이스로 노출합니다. 그래서 이 타입의 zero와 is_zero는 내부 확장체의 one과 is_one에 대응합니다. 반환값이 zero라는 표기만 보고 체 원소 0이라고 해석하지 마세요. 0인 Miller 값의 final_exponentiation은 None이고, 유효한 곱 판정의 성공값은 체의 1입니다.</p>
<p className="leading-8">이 글의 작은 체는 보안을 위한 크기가 아닙니다. 실제 보안 수준은 입력 곡선 군과 확장체에서의 이산로그 문제, 매개변수와 알려진 공격에 달립니다. 실행은 Rust CPU 계산이며 EVM 프리컴파일이나 네트워크 검증, 상수 시간성·부채널·현대 보안 비트 수준을 검증한 결과는 아닙니다.</p>
</div><CodeViewButton label="Miller와 최종 출력의 타입 경계" onClick={()=>sidebar.open("wrapper",codeRefs["wrapper"])}/><CodeViewButton label="결과 군의 zero와 체의 one" onClick={()=>sidebar.open("output",codeRefs["output"])}/></section>
<section id="review" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">20. 한 조건을 바꾼 뒤 다음 값을 먼저 예상해 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            이제 같은 사례의 단계를 되짚어 보세요. 점 R과 함수 값 f를 구분하고 마지막 거듭제곱 전후 어느 값을 비교하는지 표시하면 원문 최적화가 바꾼 것과 유지한 것을 스스로 설명할
            수 있습니다.
          </p>
</div><ReviewPrompts questions={["마지막 선의 값 9를 빼면 원시 Miller 값과 최종 72승은 각각 어떻게 달라질까요? (답: 13절)","이미 얻은 g=7+3u에 72승을 한 번 더 적용하면 같은 값일까요? (답: 11절)","실제 BN254 출력이 일반 E승과 달라도 여러 출력의 곱이 1인지 보는 판정이 같을 수 있는 조건은 무엇일까요? (답: 18절)"]}/></section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={projectMetas}/></div>;}
