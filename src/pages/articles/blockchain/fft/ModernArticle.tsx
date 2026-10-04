import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import FlowRail from "../../world-systems/FlowRail";
import ReviewPrompts from "../../world-systems/ReviewPrompts";

export default function ModernNTT() { return <article className="space-y-14">
 <section id="overview" data-teach-level="S" className="space-y-5"><h2 className="text-2xl font-bold">1. 같은 계산 규칙을 여러 위치에서 빠르게 읽으려면</h2>
  <p>규칙 f(x)=1+2x+3x²+4x³을 네 위치에서 계산하려고 합니다. 위치마다 네 항을 처음부터 계산하면 같은 중간 계산이 반복됩니다. 위치를 적절히 고르면 짝수 차수 항과 홀수 차수 항의 결과를 나눠 계산한 뒤 재사용할 수 있습니다.</p>
  <p>NTT는 유한한 수의 세계에서 이런 규칙적인 위치의 평가값을 구하는 변환입니다. 빠른 알고리즘은 같은 답을 적은 연산으로 계산합니다. 네 계수 1·2·3·4가 네 결과 10·7·15·6으로 바뀌고 다시 원래 계수로 돌아오는 과정을 보겠습니다.</p><ContentBoundary article="crypto-fft" />
 </section>
 <section id="black-box" data-teach-level="B" className="space-y-5"><h2 className="text-2xl font-bold">2. 계수 목록을 받아 정한 위치의 값 목록을 돌려줍니다</h2>
  <p>입력은 규칙의 계수와 계산 범위, 평가할 위치의 순서입니다. 출력의 각 칸은 그 위치에 규칙을 넣은 값입니다. 역변환은 같은 위치 순서의 결과를 받아 원래 계수 목록을 되찾습니다.</p>
  <p>출력은 계수와 다른 표현입니다. 두 규칙을 같은 위치에서 평가해 놓았다면 그 위치의 결과끼리 곱할 수 있습니다. 곱한 결과를 다시 계수로 바꾸면 두 규칙을 곱한 식을 얻을 수 있지만 결과를 담을 만큼 위치가 충분해야 합니다.</p>
 </section>
 <section id="case" data-teach-level="0" className="space-y-5"><h2 className="text-2xl font-bold">3. 네 계수를 17 안에서 계산합니다</h2>
  <p>모든 결과는 17로 나눈 나머지로 정합니다(가정). 계수 목록 [1,2,3,4]는 낮은 차수부터 적었으므로 f(x)=1+2x+3x²+4x³입니다. 평가 위치는 순서대로 1·4·16·13입니다.</p>
  <p>이 위치는 1에 4를 반복해서 곱하면 나옵니다. 4²의 나머지는 16, 4³의 나머지는 13, 4⁴의 나머지는 1입니다. 16은 −1, 13은 −4와 같으므로 위치가 1·4·−1·−4의 두 쌍을 이룹니다.</p>
  <p>직접 넣으면 f(1)=10, f(4)=313 mod17=7, f(−1)=−2 mod17=15, f(−4)=−215 mod17=6입니다. 앞으로 빠른 계산과 되돌리기 모두 이 네 결과와 비교합니다.</p>
 </section>
 <section id="picture" data-teach-level="1" className="space-y-5"><h2 className="text-2xl font-bold">4. 짝수 항과 홀수 항을 계산한 뒤 두 쌍으로 합칩니다</h2>
  <FlowRail title="같은 네 계수에서 같은 네 값으로" steps={[{actor:"계수",movement:"짝수 위치 1·3과 홀수 위치 2·4를 나눕니다.",receives:"1+3z, 2+4z"},{actor:"작은 계산",movement:"z=1과 z=−1에서 두 식을 각각 계산합니다.",receives:"짝수 결과 4·15, 홀수 결과 6·15"},{actor:"결합",movement:"홀수 결과에 원래 위치를 곱한 뒤 더하고 뺍니다.",receives:"원래 위치 순서의 10·7·15·6"}]} />
 </section>
 <section id="need" data-teach-level="2" className="space-y-5"><h2 className="text-2xl font-bold">5. 반대 위치에서는 홀수 항의 부호만 바뀝니다</h2>
  <p>f(1)과 f(−1)을 따로 계산해 봅시다. 상수항과 x² 항은 두 위치에서 같고 x와 x³ 항만 부호가 바뀝니다. 짝수 항의 합 1+3=4, 홀수 항의 합 2+4=6을 한 번 구하면 4+6=10과 4−6=15를 함께 얻습니다.</p>
  <p>4와 −4도 제곱하면 둘 다 −1입니다. 두 위치의 짝수 항 결과가 같으므로 작은 계산을 공유할 수 있습니다. 아무 네 위치를 고르면 이런 반복 구조가 없어질 수 있습니다. 빠른 방법은 위치의 구조를 사용합니다.</p>
 </section>
 <section id="names" data-teach-level="3" className="space-y-5"><h2 className="text-2xl font-bold">6. 반복 주기의 길이와 변환 알고리즘을 구분합니다</h2>
  <p>정확히 n번 곱했을 때 처음 1로 돌아오는 값 ω를 원시 n차 단위근이라고 합니다. 사례의 ω=4는 위수가 4이고 평가 위치는 ω⁰·ω¹·ω²·ω³입니다. 모든 연산을 하는 계산 공간은 유한체 F₁₇입니다.</p>
  <p>계수를 이 위치들의 값으로 바꾸는 변환이 NTT입니다. 큰 변환을 두 작은 변환으로 나눠 계산하는 방법은 radix-2 Cooley–Tukey 알고리즘입니다. 공유한 두 결과를 더하고 빼서 출력 두 개를 만드는 계산 묶음을 버터플라이라고 합니다.</p>
  <p>복소수 DFT도 비슷한 분할 구조로 빠르게 계산할 수 있습니다. 여기서는 신호의 Hz나 복소수 위상을 해석하지 않고 유한체의 정확한 값과 다항식 표현을 다룹니다. 신호 해석은 <Link to="/cs/ai/fft">복소수 FFT 글</Link>에서 이어집니다.</p>
 </section>
 <section id="dft" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">7. 각 출력은 같은 식을 다른 위치에서 읽은 값입니다</h2>
  <ExplainedFormula question="출력의 두 번째 값 7은 무엇을 계산한 것인가요?" idea="출력 인덱스 k가 평가 위치 ωᵏ를 정합니다. 각 계수에 그 위치의 거듭제곱을 곱해 더합니다." formula={String.raw`y_k=\sum_{j=0}^{n-1}a_j\omega^{jk}`} annotatedFormula={String.raw`\begin{gathered}y_1=\underbrace{1+2\cdot4+3\cdot16+4\cdot13}_{\text{위치 4의 거듭제곱을 곱함}}\\=109\bmod17=7\end{gathered}`} operations={[{expression:String.raw`(1,4,16,13)\cdot(1,2,3,4)`,annotation:["행 벡터는 위치 4의 0·1·2·3제곱입니다.","계수와 대응하는 항끼리 곱해 더합니다."]}]} terms={[{symbol:"aⱼ",name:"j차 계수",description:"낮은 차수부터 [1,2,3,4]를 저장합니다."},{symbol:"ω",name:"평가 위치를 만드는 값",description:"사례의 4는 정확히 네 번 곱해 처음 1로 돌아옵니다."},{symbol:"yₖ",name:"k번째 평가값",description:"계수 aₖ가 아니라 위치 ωᵏ의 계산 결과입니다."},{symbol:"n",name:"변환 길이",description:"사례는 서로 다른 네 위치를 사용합니다."}]} assumptions={["ω의 위수가 정확히 n이며 위치 순서를 공유합니다.","계수는 길이 n으로 맞추고 각 연산은 같은 체에서 합니다."]} interpretation="이 변환을 행렬로 적으면 k행 j열은 ω^(kj)입니다. 서로 다른 위치를 가진 Vandermonde 행렬이므로 계수 표현으로 되돌릴 수 있습니다. 직접 계산은 출력마다 n개 항을 합칩니다." />
 </section>
 <section id="butterfly" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">8. 작은 결과 한 쌍으로 두 출력을 만듭니다</h2>
  <p>짝수 차수의 계수를 모아 E(z)=1+3z, 홀수 차수의 계수를 모아 O(z)=2+4z라 놓습니다. 그러면 f(x)=E(x²)+xO(x²)입니다. 길이 n의 경우에도 계수 인덱스의 짝수·홀수를 이렇게 나눌 수 있습니다.</p>
  <ExplainedFormula question="위치 4와 −4의 결과는 어떤 중간값을 공유하나요?" idea="두 위치의 제곱이 같아 E와 O의 결과를 한 번씩만 구합니다. 홀수 부분에 곱하는 위치의 부호가 달라져 합과 차로 두 출력을 만듭니다." formula={String.raw`y_k=E_k+\omega^kO_k,\qquad y_{k+n/2}=E_k-\omega^kO_k`} annotatedFormula={String.raw`\begin{gathered}E(-1)=15,\quad O(-1)=15\\t=\underbrace{4\cdot15\bmod17}_{\text{홀수 부분의 배율 적용}}=9\\y_1=15+9=7\pmod{17}\\y_3=15-9=6\end{gathered}`} operations={[{expression:String.raw`t=\omega^kO_k`,annotation:["홀수 차수 항에서 밖으로 꺼냈던 x를 다시 곱합니다.","이 배율을 twiddle factor라 합니다."]},{expression:String.raw`E_k+t,\quad E_k-t`,annotation:["같은 중간값에서 원래 위치와 반대 위치의 결과를 함께 만듭니다."]}]} terms={[{symbol:"Eₖ, Oₖ",name:"절반 크기의 결과",description:"ω²의 거듭제곱 위치에서 E와 O를 평가합니다."},{symbol:"t",name:"배율을 곱한 홀수 부분",description:"사례의 k=1에서는 4×15 mod17=9입니다."}]} assumptions={["n은 짝수이고 ω의 위수가 정확히 n입니다. ω^(n/2)=−1이 됩니다.","두 갈래로 끝까지 나누는 radix-2는 n이 2의 거듭제곱일 때 사용합니다."]} interpretation="ω²의 위수는 n/2이므로 각 작은 문제도 같은 종류의 변환입니다. 짝수 길이의 원시 단위근이 존재하면 체의 특성은 2가 아니어서 1과 −1이 구분됩니다." />
 </section>
 <section id="trace" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">9. 네 계수를 나누고 합쳐 같은 네 결과를 확인합니다</h2>
  <AlgorithmBlock title="F₁₇의 길이 4 변환 한 번을 끝까지 계산하기" input={["계수 [1,2,3,4], 원시 단위근 4, 출력 위치 순서 [1,4,16,13]"]} steps={[{code:"even=[1,3]; odd=[2,4]",note:"짝수·홀수 계수로 나눕니다. 작은 변환의 근은 4²=16입니다."},{code:"E=[1+3,1-3]=[4,15]; O=[2+4,2-4]=[6,15]",note:"각 길이 2 변환은 합과 차를 계산합니다."},{code:"k=0: t=1*6; y[0]=4+t=10; y[2]=4-t=15",note:"위치 1과 −1의 출력을 얻습니다."},{code:"k=1: t=4*15 mod17=9; y[1]=15+t=7; y[3]=15-t=6",note:"위치 4와 −4의 출력을 얻습니다."}]} output="[10,7,15,6]. 3절에서 각 위치에 직접 넣은 결과와 같습니다." />
  <p>길이 2 계산 두 개에서 버터플라이 두 번, 마지막 결합에서 두 번으로 모두 네 번입니다. 일반적인 길이 n에서는 단계마다 n/2개의 묶음이 있고 단계는 log₂n개입니다. 길이 8이면 단계마다 네 번씩 세 단계, 모두 12번입니다.</p>
  <p>따라서 T(n)=2T(n/2)+O(n)=O(n log n)입니다. 버터플라이 수와 정확한 곱셈 명령 수는 구분합니다. 배율이 1일 때 곱셈을 생략하거나 여러 단계를 합치는 구현에 따라 실제 연산 수가 달라집니다.</p>
 </section>
 <section id="source" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">10. 원 논문의 합과 보조 배열에 같은 수를 넣습니다</h2>
  <p>Pollard의 1971년 원문 식 (1)은 Aᵢ=Σaⱼrⁱʲ입니다. 원문의 길이 d에 4, 근 r에 4, 계수 a에 [1,2,3,4]를 넣으면 이 글의 출력 [10,7,15,6]입니다. 원문의 체 GF(pⁿ)는 여기서 p=17, n=1입니다. 원문의 n은 확장 차수이므로 이 글의 변환 길이 n과 다릅니다.</p>
  <p>원문 식 (2)~(3)은 역변환 앞에 −d′를 곱하며 d′d=pⁿ−1로 d′를 정합니다. 이 사례는 d′=4여서 −d′=−4 mod17=13입니다. 이는 변환 길이 4의 역원입니다. 같은 원문을 읽더라도 d′ 자체를 곱하면 부호가 틀립니다.</p>
  <div id="paper-pollard-ntt"><CitationBlock source="Pollard (1971) · 식 (1)–(3), §2" citeKey={1} href="https://doi.org/10.1090/S0025-5718-1971-0301966-0">순방향 합과 역변환 배율을 같은 F₁₇ 사례에 대응했습니다. 원문의 기호를 이 글의 길이와 체 크기에 구분해 넣었습니다.</CitationBlock></div>
  <p>Cooley–Tukey의 1965년 원문 식 (3), (6), (7)은 N=r₁r₂로 길이를 나누고 작은 합을 보조 배열 A₁에 저장해 다시 합칩니다. N=4와 r₁=r₂=2를 넣으면 입력 인덱스 k=2k₁+k₀에서 k₀가 짝수·홀수 선택에 대응합니다.</p>
  <p>유한체의 근 4로 같은 구조를 계산하면 A₁의 두 행은 [4,6]과 [15,15]입니다. 원문 식 (7)에서 첫 행은 10·15, 둘째 행은 배율 4를 사용해 7·6을 만듭니다. 원래 출력 인덱스로 놓으면 [10,7,15,6]입니다. 원문은 복소수 계산이며 같은 분할을 유한체에 적용할 조건은 Pollard의 원시 단위근과 역원에서 확인합니다.</p>
  <div id="paper-cooley-tukey"><CitationBlock source="Cooley & Tukey (1965) · pp. 297–298, 식 (3), (6)–(7)" citeKey={2} href="https://doi.org/10.1090/S0025-5718-1965-0178586-1">원문의 보조 배열을 같은 짝수·홀수 결과에 대응했습니다. 원문에서 세는 복소수 연산 수를 현대 유한체 커널의 명령 수나 실행 시간으로 옮기지 않습니다.</CitationBlock></div>
 </section>
 <section id="unit-root" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">11. 길이에 맞는 반복 주기가 체 안에 있어야 합니다</h2>
  <p>F₁₇의 0 아닌 값은 16개입니다. 이 곱셈군의 부분군 크기는 16의 약수이므로 평가 주기의 길이도 16을 나눠야 합니다. 4번 만에 돌아오는 근 4를 길이 8에 쓰면 위치가 두 번 반복되어 여덟 계수를 구별할 수 없습니다.</p>
  <ExplainedFormula question="길이 8을 원하면 어떤 근을 만들 수 있나요?" idea="전체 0 아닌 값을 방문하는 생성원에서 일정한 간격으로 이동하면 더 작은 정확한 주기를 만듭니다." formula={String.raw`n\mid(p-1),\qquad\omega=g^{(p-1)/n}`} annotatedFormula={String.raw`\begin{gathered}p=17,\quad g=3,\quad n=8\\\omega=3^{16/8}=9\\9^4=16\ne1,\quad9^8=1\end{gathered}`} operations={[{expression:String.raw`1,9,13,15,16,8,4,2`,annotation:["9를 반복해서 곱하면 이 여덟 위치를 방문한 뒤 1로 돌아옵니다.","4제곱이 1이 아니므로 위수가 8의 더 작은 약수일 수 없습니다."]}]} terms={[{symbol:"g",name:"전체 곱셈군의 생성원",description:"사례의 3은 위수가 16입니다."},{symbol:"ω",name:"선택한 길이의 근",description:"길이 8의 사례에서는 9입니다. 본문 길이 4의 근 4와 구분합니다."},{symbol:"s",name:"2의 인수가 들어간 횟수",description:"p−1=2ˢq에서 q가 홀수일 때의 s를 2-adicity라 합니다."}]} assumptions={["p는 소수이며 g의 위수가 p−1임을 확인합니다.","길이가 p−1을 나눠야 하고 실제 구현이 그 길이의 알고리즘을 지원해야 합니다."]} interpretation="17−1=16=2⁴이므로 F₁₇의 2-adicity는 4입니다. 이 체의 곱셈 부분군을 사용하는 radix-2 길이는 최대 16입니다. 4²=16, 4⁴=1은 길이 4만 확인하며 길이 8의 근이 되지는 않습니다." />
  <p>생성원 g의 위수가 p−1이면 g^((p−1)/n)을 d번 곱해 1이 될 조건은 p−1이 d(p−1)/n을 나누는 것입니다. 가장 작은 양의 d가 n이므로 원하는 위수를 얻습니다. 일반 유한체 Fq에서는 같은 조건의 p−1을 q−1로 바꿉니다.</p>
 </section>
 <section id="intt" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">12. 반대 근으로 계산한 뒤 길이의 역원을 곱합니다</h2>
  <p>4의 역원은 13입니다. 출력 [10,7,15,6]을 근 13으로 다시 변환하면 [4,8,12,16]입니다. 원래 계수의 네 배이므로 여기에 길이 4의 역원 13을 곱해 [1,2,3,4]로 돌아옵니다. 이 사례에서는 근과 길이가 모두 4라 두 역원이 같지만 일반적으로는 서로 다른 값입니다.</p>
  <ExplainedFormula question="왜 반대 근을 사용하면 원하는 계수만 남나요?" idea="서로 다른 계수의 배율은 단위근의 한 주기를 더하며 0이 됩니다. 같은 계수의 배율은 모두 1이라 n이 남고 마지막 역원 곱이 이를 지웁니다." formula={String.raw`a_j=n^{-1}\sum_{k=0}^{n-1}y_k\omega^{-jk}`} annotatedFormula={String.raw`\begin{gathered}\mathrm{NTT}_{13}(10,7,15,6)\\=\underbrace{(4,8,12,16)}_{\text{원래 계수의 네 배}}\\13\cdot(4,8,12,16)\\=(1,2,3,4)\pmod{17}\end{gathered}`} operations={[{expression:String.raw`\begin{gathered}1+4+16+13=34\\=0\pmod{17}\end{gathered}`,annotation:["서로 다른 계수 사이의 배율을 더하면 0이 되는 사례입니다."]},{expression:String.raw`1+1+1+1=4`,annotation:["같은 계수에서는 길이 4가 남습니다.","4×13 mod17=1이므로 마지막에 13을 곱합니다."]}]} terms={[{symbol:"ω⁻¹",name:"반대 순서의 근",description:"같은 평가 주기를 반대 방향으로 돕니다."},{symbol:"n⁻¹",name:"길이의 역원",description:"남은 n배를 되돌립니다. 실수 나눗셈이 아닙니다."}]} assumptions={["체의 특성이 n을 나누지 않아 n의 역원이 존재합니다.","입력은 순방향에서 정한 평가점 순서와 일치해야 합니다."]} interpretation="i≠j이면 z=ω^(i−j)는 1이 아니고 zⁿ=1입니다. (z−1)(1+z+…+zⁿ⁻¹)=zⁿ−1=0에서 z−1의 역원을 곱하면 합은 0입니다. i=j이면 각 항이 1이라 합은 n입니다." />
  <p>메모리 배열의 순서도 맞아야 합니다. 한 반복형 radix-2 구현은 입력 인덱스의 이진 자릿수를 뒤집어 [0,2,1,3] 순서로 놓습니다. 계수 배열은 [1,3,2,4], 첫 단계 결과는 [4,15,6,15], 둘째 단계 결과는 [10,7,15,6]입니다. 다른 구현은 순방향 출력 쪽에 이 재배열이 남을 수 있으므로 근의 부호와 배열 순서, 정규화 위치를 함께 정합니다.</p>
 </section>
 <section id="zk-usage" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">13. 곱의 길이를 확보한 뒤 같은 위치끼리 곱합니다</h2>
  <p>A=1+x²와 B=1+x를 곱하면 1+x+x²+x³입니다. 결과 계수 네 개가 필요하므로 두 입력을 길이 4로 맞춰 [1,0,1,0]과 [1,1,0,0]으로 적습니다. 같은 근 4로 변환하면 [2,0,2,0]과 [2,5,0,14]입니다.</p>
  <ExplainedFormula question="평가값끼리 곱한 뒤 원래 계수로 돌아올 수 있나요?" idea="같은 위치에서 A(x)B(x)는 두 평가값의 곱입니다. 충분한 위치를 확보했다면 역변환으로 곱의 계수를 구합니다." formula={String.raw`n\ge L_A+L_B-1,\qquad c=\mathrm{INTT}(\mathrm{NTT}(a)\odot\mathrm{NTT}(b))`} annotatedFormula={String.raw`\begin{gathered}(2,0,2,0)\odot(2,5,0,14)\\=\underbrace{(4,0,0,0)}_{\text{같은 위치의 값끼리 곱함}}\\\mathrm{INTT}(4,0,0,0)\\=\underbrace{(1,1,1,1)}_{\text{곱의 네 계수}}\end{gathered}`} operations={[{expression:String.raw`L_A+L_B-1=3+2-1=4`,annotation:["곱의 최고차수는 2+1=3이라 네 계수가 필요합니다.","체가 지원하는 길이 중 결과를 모두 담는 길이를 고릅니다."]}]} terms={[{symbol:"L_A, L_B",name:"입력 계수 개수",description:"사례의 원래 입력 길이는 3과 2입니다."},{symbol:"⊙",name:"위치별 곱",description:"같은 근과 같은 순서로 얻은 평가값을 곱합니다."}]} assumptions={["두 입력과 역변환은 체·근·배열 순서·정규화를 공유합니다.","길이는 결과를 담기에 충분하고 실제 체에 그 위수의 근이 있어야 합니다."]} interpretation="원문의 Pollard §3(i)도 곱의 차수 합보다 큰 변환 길이를 고르고 남은 입력 계수를 0으로 채웁니다. 식 (4)~(5)의 위치별 곱은 일반적으로 순환 곱이며 길이가 충분할 때 원하는 다항식 곱과 같아집니다." />
  <p>같은 F₁₇에서 길이 2의 위치 1·−1만 사용하면 A의 값은 [2,2], B의 값은 [2,0]입니다. 곱 [4,0]을 되돌리면 [2,2], 즉 2+2x입니다. 이 두 위치에서는 x²=1이라 x² 항이 상수항에, x³ 항이 x 항에 합쳐집니다. 빠르게 계산해도 잃어버린 계수 구분은 돌아오지 않습니다.</p>
  <p>길이 3에서 x³=1로 줄인다는 대수적 예도 만들 수 있습니다. 같은 곱은 2+x+x²로 줄어듭니다. 다만 3은 16을 나누지 않으므로 F₁₇ 안에는 필요한 3차 단위근이 없습니다. 이 나머지 식을 F₁₇에서 길이 3 NTT를 실행한 결과라고 부르면 안 됩니다.</p>
  <p>정확하다는 말은 체 안에서의 정확성입니다. 정수 8×3=24를 mod17로 계산하면 7이므로 원래 정수 24와는 다릅니다. 정수 곱까지 복원하려면 결과 계수의 절댓값 상한을 알고 충분히 큰 소수나 여러 소수의 <Link to="/cs/crypto/crt">중국인의 나머지 정리</Link>를 사용해야 합니다. Pollard §3(ii)는 이 범위를 별도로 다룹니다.</p>
 </section>
 <section id="release" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">14. 같은 값이 나오는지 확인한 뒤 전체 비용을 봅니다</h2>
  <p>작은 입력에서는 모든 위치에 직접 대입한 값과 빠른 변환을 비교합니다. 역변환으로 원래 계수를 되찾고 다항식 곱은 계수끼리 직접 곱한 결과와 비교합니다. 단위근의 위수, 입력 길이, 배열 순서와 정규화가 틀린 사례도 함께 확인합니다.</p>
  <p>증명 시스템은 계수와 평가값 사이를 오가며 몫 계산이나 더 큰 도메인의 평가를 수행합니다. 이동한 도메인 hH에서 평가하려면 f(hx)의 계수 aⱼhʲ를 변환할 수 있습니다. h는 0이 아니어야 하며 평가값을 다시 계수로 바꿀 때 이 배율을 되돌려야 합니다.</p>
  <p>처리 시간은 변환 횟수 외에도 데이터를 재배열하는 횟수, 배율 표를 읽는 비용, 메모리 접근과 CPU·GPU 사이의 전송에 달려 있습니다. 같은 입력과 체, 길이, 방향, 묶음 크기에서 계산 커널 시간과 전체 요청 시간을 각각 측정해야 합니다. 특정 프로버의 비율이나 속도를 보편적인 수치로 사용하지 않습니다.</p>
  <p>본문의 작은 사례는 정수의 나머지 연산으로 직접 변환, 빠른 변환, 역변환과 곱셈을 검산했습니다. 현대 암호 라이브러리나 GPU 커널을 실행한 성능 측정은 아닙니다.</p>
  <ReviewPrompts questions={["근 4를 길이 8에 그대로 쓰면 위치 목록과 복원 가능성에 어떤 문제가 생기나요? (답: 11절)","역변환에서 근만 13으로 바꾸고 마지막 배율 13을 빠뜨리면 어떤 계수 목록이 나오나요? (답: 12절)","A=1+x²와 B=1+x를 길이 2에서 곱하면 왜 2+2x가 되며 길이 4에서는 무엇이 달라지나요? (답: 13절)"]} />
 </section>
 </article>; }
