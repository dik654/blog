import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import FlowRail from "../../world-systems/FlowRail";
import ReviewPrompts from "../../world-systems/ReviewPrompts";

export default function ModernReedSolomon() { return <article className="space-y-14">
 <section id="overview" data-teach-level="S" className="space-y-5"><h2 className="text-2xl font-bold">1. 기록 두 개가 사라져도 원본을 되찾으려면</h2>
  <p>두 숫자 2·3을 보냈는데 저장 장치나 통신 경로에서 일부 기록이 사라질 수 있다고 합시다. 두 숫자를 그대로 한 번씩 저장하면 하나만 없어져도 원본을 알 수 없습니다. 대신 두 숫자에서 만든 네 기록 2·5·1·4를 서로 다른 위치에 저장합니다.</p>
  <p>이 네 기록은 아무 숫자나 덧붙인 목록이 아닙니다. 같은 계산 규칙으로 묶여 있어서 어느 두 위치의 정확한 기록이 남아도 원래 2·3을 되찾습니다. Reed–Solomon 부호는 이런 여분의 기록을 만들고 복원하는 방법입니다. 기록이 사라진 경우와 틀린 값으로 바뀐 경우는 복원 조건이 다릅니다.</p><ContentBoundary article="reed-solomon" />
 </section>
 <section id="black-box" data-teach-level="B" className="space-y-5"><h2 className="text-2xl font-bold">2. 위치가 붙은 기록을 만들고 남은 기록으로 되돌립니다</h2>
  <p>보내는 쪽은 원본과 계산 규칙을 받아 위치가 붙은 더 긴 목록을 만듭니다. 받는 쪽은 남은 위치와 값, 같은 계산 규칙을 받아 원본 후보를 복원합니다. 기록이 부족하거나 형식이 맞지 않으면 계산을 멈춥니다.</p>
  <p>복원된 후보가 보낸 사람이 의도한 원본인지는 추가 확인이 필요합니다. 충분히 많은 값이 바뀌면 다른 원본의 정상 기록처럼 보일 수 있기 때문입니다. 계산 규칙과 원본을 확인할 신뢰할 수 있는 근거도 함께 전달해야 합니다.</p>
 </section>
 <section id="case" data-teach-level="0" className="space-y-5"><h2 className="text-2xl font-bold">3. 원본 2·3을 네 기록 2·5·1·4로 바꿉니다</h2>
  <p>작은 사례에서는 모든 계산을 7로 나눈 나머지로 정합니다(가정). 원본의 첫 숫자를 시작값, 둘째 숫자를 증가량으로 두어 p(x)=2+3x라는 규칙을 만듭니다. 위치 0·1·2·3을 넣으면 2·5·8·11이고 나머지는 2·5·1·4입니다.</p>
  <p>위치 0·2의 기록이 없어지면 (1,5)와 (3,4)가 남습니다. 두 위치 사이에서 값은 4−5=−1, 위치는 3−1=2만큼 달라졌습니다. 이 범위에서 2의 역원은 4이므로 증가량은 −1×4 mod7=3입니다. 시작값은 5−3×1=2입니다.</p>
 </section>
 <section id="picture" data-teach-level="1" className="space-y-5"><h2 className="text-2xl font-bold">4. 같은 규칙을 여러 위치에서 읽어 여유를 만듭니다</h2>
  <FlowRail title="원본 2·3이 일부 누락을 지나 돌아오는 과정" steps={[{actor:"원본",movement:"두 숫자를 시작값과 증가량으로 사용합니다.",receives:"규칙 2+3x"},{actor:"여러 기록",movement:"위치 0·1·2·3에서 읽은 값을 따로 저장합니다.",receives:"2·5·1·4"},{actor:"남은 기록",movement:"위치 1의 5와 위치 3의 4에서 증가량과 시작값을 구합니다.",receives:"원본 2·3 복원"}]} />
 </section>
 <section id="need" data-teach-level="2" className="space-y-5"><h2 className="text-2xl font-bold">5. 값의 개수와 함께 위치와 계산 범위를 알아야 합니다</h2>
  <p>남은 값 5·4만 받고 위치를 모르면 같은 계산을 할 수 없습니다. 이를 위치 0·1의 값으로 오해하면 시작값 5, 증가량 6이라는 다른 원본이 나옵니다. 위치 1의 기록을 두 번 받는 것도 서로 다른 두 위치를 받은 것과 같지 않습니다.</p>
  <p>실수 계산으로 증가량을 −1/2라고 해석해도 틀립니다. 이 사례는 7 안의 계산이며 2×4 mod7=1을 사용합니다. 양쪽이 숫자를 해석하는 범위와 위치 순서, 원본을 규칙으로 바꾸는 방법을 함께 알아야 합니다.</p>
 </section>
 <section id="names" data-teach-level="3" className="space-y-5"><h2 className="text-2xl font-bold">6. 원본의 크기와 보낸 기록의 크기를 구분합니다</h2>
  <p>한 번에 계산하는 값 하나를 심벌이라 합니다. 원본 심벌 수는 k입니다. 만든 기록 수는 n이며 사례는 k=2, n=4입니다. 올바른 규칙에서 나온 전체 목록을 부호어라고 합니다. 7 안의 계산 공간은 유한체 F₇, 위치들은 평가점입니다.</p>
  <p>위치를 알지만 값이 없는 경우는 소실(erasure)입니다. 위치를 모르는 잘못된 값은 오류(error)입니다. 같은 부호를 쓰기 위해 정한 체·평가점·원본 배치·바이트 표현의 묶음은 프로파일이라고 부르겠습니다. 이름이 같은 RS(4,2)라도 프로파일이 다르면 호환되지 않습니다.</p>
 </section>
 <section id="encoding" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">7. 원본을 계수로 놓고 네 위치에서 계산합니다</h2>
  <ExplainedFormula question="두 원본 숫자가 어떻게 네 기록을 정하나요?" idea="원본을 하나의 낮은 차수 다항식의 계수로 놓습니다. 서로 다른 위치에서 같은 식을 평가하면 원본을 되찾을 여러 관측값이 생깁니다." formula={String.raw`p(x)=\sum_{j=0}^{k-1}m_jx^j,\qquad c_i=p(\alpha_i)`} annotatedFormula={String.raw`\begin{gathered}p(x)=\underbrace{2+3x}_{\text{원본을 계수로 배치}}\\(p(0),p(1),p(2),p(3))\\=\underbrace{(2,5,1,4)}_{\text{각 결과를 mod7로 정리}}\end{gathered}`} operations={[{expression:String.raw`p(2)=2+3\cdot2=8\equiv1`,annotation:["위치 2에서 같은 규칙을 계산합니다.","8을 7로 나눈 나머지 1을 저장합니다."]}]} terms={[{symbol:"mⱼ",name:"원본 계수",description:"사례의 순서 있는 두 숫자는 2·3입니다."},{symbol:"αᵢ",name:"평가 위치",description:"서로 다른 0·1·2·3을 같은 순서로 사용합니다."},{symbol:"cᵢ",name:"만든 기록",description:"위치와 연결된 계산 결과입니다."}]} assumptions={["평가점이 서로 다르고 n은 체의 원소 수를 넘지 않습니다.","원본을 계수로 해석하는 방식을 정했습니다. 원본을 앞부분에 그대로 두는 방식은 9절에서 따로 계산합니다."]} interpretation="전체 기록 중 정보 차원의 비율은 k/n=2/4=1/2입니다. 원본 대비 추가 저장량은 (n−k)/k=2/2=100%입니다. 두 비율의 분모가 다릅니다." />
  <AlgorithmBlock title="같은 네 기록을 만드는 교육용 절차" input={["원본 [2,3], 위치 [0,1,2,3], 연산 mod7"]} steps={[{code:"p(x) = 2 + 3*x",note:"원본의 순서를 다항식 계수에 대응합니다."},{code:"values = [p(x) mod7 for x in [0,1,2,3]]",note:"같은 식에서 네 값 [2,5,1,4]를 얻습니다."},{code:"pair each value with its position and object identity",note:"다른 물건의 기록이나 다른 위치를 섞지 않도록 식별 정보를 연결합니다."}]} output="위치 0·1·2·3의 기록 2·5·1·4. 실제 라이브러리의 코드가 아닌 계산 절차입니다." />
  <p>일반적인 (10,6)에서는 비율이 6/10=0.6이고 추가 저장량은 4/6, 약 66.7%입니다. 네 심벌까지의 소실을 견디는 성질은 평가점이 서로 다르고 남은 값이 정확하다는 전제에서 나옵니다.</p>
 </section>
 <section id="trace" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">8. 남은 두 기록에서 계수 2·3을 다시 구합니다</h2>
  <p>위치 1·3에서 받은 5·4를 같은 물건의 기록인지 확인합니다. a+b=5와 a+3b=4를 세우고 두 식을 빼면 2b=−1=6입니다. 역원 4를 곱해 b=24 mod7=3, 첫 식에 넣어 a=2를 얻습니다.</p>
  <p>복원한 2+3x를 남은 두 위치에 다시 넣으면 5·4가 됩니다. 없어진 위치 0·2의 값도 2·1로 재생성합니다. 어느 두 위치를 골라도 다른 위치의 차이가 0이 아니므로 이렇게 풀 수 있습니다. k개의 정확한 기록에서 차수 k 미만인 식을 복원하는 일반 방법이 <Link to="/cs/crypto/lagrange">Lagrange 보간</Link>입니다.</p>
  <p>정확하다는 전제가 중요합니다. 위치 2의 값이 1에서 6으로 바뀌었는데 이를 모른 채 위치 0·2만 고르면 a=2, 2b=4이므로 b=2라는 잘못된 답이 나옵니다. 누락을 복원하는 절차에 틀린 값을 그대로 넣어서는 안 됩니다.</p>
 </section>
 <section id="source" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">9. 원문 식과 행렬에 같은 네 기록을 대응합니다</h2>
  <p>Reed–Solomon의 1960년 원문 300~301쪽은 원본 계수를 P의 계수로 놓고 여러 체 원소에서 P를 읽습니다. 원문의 계수 개수 m에 이 글의 k=2, 계수 a₀·a₁에 2·3을 대응하면 같은 평가 규칙이 됩니다. 서로 다른 위치의 연립방정식이 풀린다는 Vandermonde 행렬 논리도 위치 1·3의 두 식에 대응합니다.</p>
  <p>원문은 이진 확장체의 모든 원소를 사용합니다. 이 글의 F₇와 네 위치는 계산을 쉽게 보이기 위한 일반 유한체 사례입니다. 원문의 특정 바이트 형식이나 원문과 똑같은 매개변수를 실행했다는 뜻은 아닙니다.</p>
  <div id="paper-reed-solomon-1960"><CitationBlock source="Reed & Solomon (1960) · pp. 300–301" citeKey={1} href="https://doi.org/10.1137/0108018">원본 계수를 평가값 목록으로 보내는 정의와 서로 다른 위치에서 계수를 복원하는 선형독립성을 같은 사례에 연결했습니다.</CitationBlock></div>
  <p>실제 전송 규격 RFC 5510 §8.2.1은 먼저 평가 행렬 V를 만든 뒤 앞 k개 열의 역행렬을 곱해 원본이 앞에 그대로 남도록 만듭니다. 이를 systematic 방식이라 합니다. 같은 F₇ 사례에서 V의 두 행은 [1,1,1,1]과 [0,1,2,3]입니다.</p>
  <ExplainedFormula question="같은 기록을 원본이 앞에 남는 방식으로도 만들 수 있나요?" idea="앞 두 평가값을 새 입력으로 삼고 행렬의 앞 두 열을 단위행렬로 바꿉니다. 원본 계수와 원본 평가값 중 무엇을 입력으로 부르는지 구분해야 합니다." formula={String.raw`G=V_{k,k}^{-1}V_{k,n},\qquad e=sG`} annotatedFormula={String.raw`\begin{gathered}G=\begin{pmatrix}1&0&6&5\\0&1&2&3\end{pmatrix}\\\underbrace{(2,5)}_{\text{앞 두 평가값}}G=(2,5,1,4)\end{gathered}`} operations={[{expression:String.raw`V_{2,2}^{-1}=\begin{pmatrix}1&6\\0&1\end{pmatrix}`,annotation:["앞 두 열 [[1,1],[0,1]]의 역행렬입니다.","곱하면 G의 앞 두 열이 단위행렬이 됩니다."]},{expression:String.raw`(2,3)G=(2,3,4,5)`,annotation:["같은 숫자 2·3을 앞 두 평가값으로 해석하면 출력이 달라집니다.","계수 입력 방식과 혼용하면 원본의 의미가 바뀝니다."]}]} terms={[{symbol:"V",name:"평가 행렬",description:"각 위치에서 계수의 영향을 열 하나로 모읍니다."},{symbol:"G",name:"생성 행렬",description:"앞 두 입력을 그대로 보존하도록 V를 변환합니다."},{symbol:"s, e",name:"입력과 출력 행 벡터",description:"이 경우 입력은 계수 2·3이 아닌 평가값 2·5입니다."}]} assumptions={["RFC의 행렬 변환을 F₇의 같은 사례로 계산한 것입니다. RFC는 GF(2^m)와 생성원의 거듭제곱 위치를 정합니다.","이 작은 계산은 RFC의 실제 패킷 규격과 호환되는 시험 벡터가 아닙니다."]} interpretation="RFC §8.3.1의 복원처럼 G의 위치 1·3 열을 고르면 [[0,5],[1,3]]입니다. 역행렬 [[5,1],[3,0]]에 받은 행 벡터 [5,4]를 곱하면 [2,5]가 돌아옵니다. 이를 계수로 바꾸면 다시 2·3입니다." />
  <div id="paper-rfc5510-reed-solomon"><CitationBlock source="RFC 5510 · §§8.2.1–8.3.1, 9.2.2" citeKey={2} href="https://www.rfc-editor.org/rfc/rfc5510.html#section-8.2.1">행렬을 변환해 원본을 보존하고 받은 열만 골라 역변환하는 구조를 대응했습니다. 규격은 패킷 소실 채널을 전제로 하며 데이터의 진위 확인은 별도 기능으로 다룹니다.</CitationBlock></div>
 </section>
 <section id="error-correction" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">10. 위치를 모르는 오류는 여유를 두 칸씩 씁니다</h2>
  <p>서로 다른 두 원본의 규칙을 빼면 0 아닌 차수 k 미만의 다항식입니다. 그 식의 근은 많아야 k−1개이므로 두 정상 목록이 같은 위치도 많아야 k−1개입니다. 따라서 적어도 n−k+1곳에서 다릅니다. k−1개 평가점에서 0이 되는 식을 택하면 이 차이를 실제로 달성하므로 최소 거리는 정확히 n−k+1입니다.</p>
  <ExplainedFormula question="네 기록에서는 오류와 소실을 몇 개까지 함께 복원하나요?" idea="소실 s곳을 제외하면 서로 다른 정상 목록은 적어도 d−s곳에서 다릅니다. 받은 목록과 각각 e곳 이내인 두 후보가 있다면 둘 사이의 차이는 많아야 2e곳이므로 2e가 d−s보다 작을 때 두 후보가 공존할 수 없습니다." formula={String.raw`d_{\min}=n-k+1,\qquad2e+s\le n-k`} annotatedFormula={String.raw`\begin{gathered}d_{\min}=4-2+1=3\\\underbrace{2e+s}_{\text{필요한 여유}}\le\underbrace{4-2}_{\text{가진 여유 2}}\end{gathered}`} operations={[{expression:String.raw`(e,s)=(0,2)\quad\text{or}\quad(1,0)`,annotation:["소실 두 개 또는 위치를 모르는 오류 한 개를 복원할 수 있습니다.","오류 한 개와 소실 한 개를 함께 보장하려면 여유 세 칸이 필요합니다."]}]} terms={[{symbol:"e",name:"오류 수",description:"위치와 값을 함께 찾아야 하는 잘못된 기록 수입니다."},{symbol:"s",name:"소실 수",description:"위치는 알지만 값이 없는 기록 수입니다."},{symbol:"dₘᵢₙ",name:"최소 거리",description:"서로 다른 정상 목록 사이에서 값이 다른 위치의 최소 개수입니다."}]} assumptions={["같은 체와 서로 다른 평가점으로 만든 같은 부호입니다.","이 경계는 하나의 정답 복원을 보장하는 범위입니다. 범위 밖에서 항상 오류를 탐지한다는 뜻은 아닙니다."]} interpretation="(10,6)의 여유는 4입니다. 오류 1개와 소실 2개는 2×1+2=4로 경계 안입니다. 오류 2개와 소실 1개는 5가 되어 원본의 유일한 복원을 보장하지 않습니다." />
 </section>
 <section id="berlekamp-welch" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">11. 틀린 위치에서 0이 되는 식을 함께 찾습니다</h2>
  <p>받은 목록이 [2,5,6,4]라면 위치 2의 값만 틀렸습니다. 그러나 복원기는 처음부터 그 위치를 알지 못합니다. 오류 위치에서 0이 되는 식 E와 곱 N=Ep를 함께 찾으면 틀린 관측의 영향이 사라집니다. 이 방법이 Berlekamp–Welch 복원입니다.</p>
  <ExplainedFormula question="오류 위치도 모르는 상황에서 무엇을 미지수로 두나요?" idea="오류가 최대 하나라고 정하면 E=x+b로 놓고 N을 2차 이하의 식으로 둡니다. 각 받은 값이 만드는 N(x)=rE(x)는 이 네 계수에 대한 일차식입니다." formula={String.raw`N(\alpha_i)=r_iE(\alpha_i),\quad\deg E=t,\quad\deg N<k+t`} annotatedFormula={String.raw`\begin{gathered}E(x)=\underbrace{x+5}_{\text{위치 2에서 0}}\\N(x)=3+3x+3x^2\\N/E=\underbrace{2+3x}_{\text{복원한 규칙}}\end{gathered}`} operations={[{expression:String.raw`N(2)=0=6\cdot E(2)`,annotation:["틀린 값 6이 있어도 E(2)=0이므로 같은 식이 성립합니다."]},{expression:String.raw`N(1)=2=5\cdot6\pmod7`,annotation:["정상 위치에서는 받은 값과 E의 곱이 N의 값과 맞습니다."]}]} terms={[{symbol:"E",name:"오류 위치 다항식",description:"최고차항 계수를 1로 고정합니다. 사례의 미지수는 상수 b입니다."},{symbol:"N",name:"곱을 나타내는 다항식",description:"사례는 N=u+vx+wx²이며 세 계수를 찾습니다."},{symbol:"t",name:"허용할 오류 수",description:"사례는 1이며 n≥k+2t를 만족해야 합니다."}]} assumptions={["받은 위치가 서로 다르고 실제 오류가 t개 이하라는 보장 범위에서 설명합니다.","계수를 푼 뒤 나머지 없는 나눗셈, 차수, 받은 목록과 다른 위치 수를 확인합니다."]} interpretation="E=x+5와 N=3+3x+3x²를 네 위치에 넣으면 양변이 각각 3·2·0·4로 같습니다. 나눗셈 결과를 다시 평가하면 [2,5,1,4]이며 받은 목록과는 한 곳만 다릅니다." />
  <AlgorithmBlock title="네 관측에서 오류 위치와 원본을 함께 구하기" input={["받은 값 [2,5,6,4], 위치 [0,1,2,3], k=2, t=1, mod7"]} steps={[{code:"E=x+b; N=u+v*x+w*x*x",note:"미지수 b,u,v,w를 둡니다."},{code:"N(i)=received[i]*(i+b) for i=0,1,2,3",note:"예를 들어 i=0에서는 u=2b, i=1에서는 u+v+w=5+5b입니다. 네 식을 같은 체에서 풉니다."},{code:"b=5; (u,v,w)=(3,3,3)",note:"정수의 나머지 연산으로 연립방정식을 풀어 얻는 해입니다."},{code:"divide N by E; check degree and all mismatches",note:"몫 2+3x, 나머지 0, 차수 1, 다른 위치 한 곳을 확인합니다."}]} output="원본 후보 [2,3]과 교정한 목록 [2,5,1,4]. 이 후보의 출처 확인은 별도입니다." />
  <p>실제 오류가 e개라면 그 위치마다 인수 하나를 둔 식의 차수는 e입니다. e가 t보다 작으면 최고차항 계수가 1인 임의의 t−e차식을 더 곱해 정확히 t차인 E를 만들 수 있습니다. 여기에 원래 p를 곱한 N은 모든 관측의 연립방정식을 만족하므로 보장 범위 안에서는 해가 존재합니다.</p>
  <p>일반적으로 오류가 e≤t개이면 올바른 위치 n−e곳에서 N−Ep가 0입니다. 이 식의 차수는 k+t 미만인데 n−e≥k+t개의 근이 있으므로 영다항식입니다. 따라서 N=Ep이고 나누면 같은 p가 나옵니다. 실제 오류가 t보다 적으면 E의 선택은 여러 개일 수 있습니다. 모든 보조 계수가 유일해야 원본이 유일한 것은 아닙니다.</p>
 </section>
 <section id="misdecode" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">12. 복원기가 성공해도 다른 원본일 수 있습니다</h2>
  <p>원래 목록 [2,5,1,4]에서 두 값이 바뀌어 [2,6,3,4]를 받았다고 합시다. 다른 정상 규칙 2+4x의 목록은 [2,6,3,0]입니다. 받은 목록은 실제 원본과 두 곳, 이 다른 정상 목록과 한 곳만 다릅니다.</p>
  <p>오류 한 개를 고치는 복원기는 정상적으로 동작해도 원본을 2·4로 반환할 수 있습니다. 받은 목록만으로는 2·3에서 두 오류가 났는지, 2·4에서 한 오류가 났는지 알 수 없습니다. 경계를 넘으면 반드시 TooManyErrors가 나온다고 약속할 수 없는 이유입니다.</p>
  <p>실패 상태는 확인한 사실을 표현해야 합니다. 서로 다른 유효 위치가 k개 미만이면 InsufficientSymbols, 규칙 식별자가 다르면 ProfileMismatch, 길이나 값 표현이 잘못되면 MalformedSymbol로 구분할 수 있습니다. 복원 후보를 찾지 못한 상태도 따로 낼 수 있지만 모든 초과 오류의 탐지를 보장하지는 않습니다.</p>
  <p>원본을 신뢰할 수 있는 서명이나 사전에 확인한 해시값과 비교하면 잘못된 후보를 거절할 근거가 생깁니다. 공격자가 데이터와 해시를 함께 바꿀 수 있다면 새 해시가 일치해도 진위 확인이 되지 않습니다. 전체 물건의 불일치만 확인한 경우 어느 조각이 틀렸는지까지 알 수 있는 것도 아닙니다.</p>
 </section>
 <section id="profile" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">13. 같은 부호 이름만으로 구현을 섞지 않습니다</h2>
  <p>프로파일은 체의 연산과 평가점 순서를 정합니다. 이진 확장체라면 기약 다항식과 원소 표현, 생성원을 쓰는 경우 그 선택도 맞춰야 합니다. 원본을 계수로 볼지 앞부분의 평가값으로 볼지는 9절의 두 출력 차이로 확인할 수 있습니다.</p>
  <p>바이트 단위에서는 심벌 크기와 바이트 순서, 원본 길이와 채움 규칙도 정합니다. 각 조각에는 어떤 물건의 몇 번째 위치인지 연결합니다. 다른 물건의 조각을 섞거나 같은 위치를 중복해서 세면 충분한 독립 기록이 남았다는 판단부터 틀립니다.</p>
  <p>순환 부호에서 쓰는 syndrome·Berlekamp–Massey·Chien·Forney 절차는 그 부호의 생성 다항식, 연속된 근의 시작점, 길이를 줄이는 규칙에 맞춰야 합니다. 임의의 평가점 목록에 순환 부호의 조건 c(αʲ)=0을 그대로 적용할 수 없습니다. 복원 알고리즘을 바꿀 때는 같은 부호를 다른 표현으로 적은 것인지 먼저 확인합니다.</p>
 </section>
 <section id="zk-connection" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">14. 증명에서는 정상 목록과의 거리를 묻기도 합니다</h2>
  <p>같은 네 위치에서 모든 1차 이하 규칙을 평가한 목록들의 집합을 생각해 봅시다. [2,5,1,4]는 이 집합 안에 있습니다. [2,5,6,4]는 그 자체로 정상 목록이 아니지만 한 곳을 바꾸면 정상 목록이 됩니다. 가장 가까운 정상 목록까지 다른 위치의 비율은 1/4입니다.</p>
  <p>FRI 원문 §1은 이 집합을 RS[F,S,ρ]로 적고 허용 차수를 ρN 미만으로 정합니다. 네 위치의 사례는 N=4, ρ=1/2이므로 차수 2 미만입니다. 거리 0인 소속과 거리 1/4인 근접성을 구분하는 정의에 같은 두 목록을 대입할 수 있습니다. 이 작은 평가점 목록 자체가 FRI의 접기 절차에 필요한 도메인이라는 주장은 아닙니다.</p>
  <ExplainedFormula question="한 곳이 다르면 왜 낮은 차수라고 바로 결론 내릴 수 없나요?" idea="정상 목록의 집합과 받은 목록 사이에서 바꿔야 할 위치 수를 셉니다. 적은 수정으로 정상 목록이 되는 것과 이미 정상 목록인 것은 다른 조건입니다." formula={String.raw`\Delta(f,\mathrm{RS})=\min_{c\in\mathrm{RS}}\frac{\#\{i:f_i\ne c_i\}}{n}`} annotatedFormula={String.raw`\begin{gathered}f=(2,5,6,4)\\c=(2,5,1,4)\\\Delta(f,\mathrm{RS})=\underbrace{1/4}_{\text{네 곳 중 한 곳을 바꿈}}\end{gathered}`} operations={[{expression:String.raw`\Delta(c,\mathrm{RS})=0`,annotation:["정상 목록 자체는 수정할 위치가 없습니다."]}]} terms={[{symbol:"f",name:"검사할 목록",description:"증명에서는 필요한 위치의 값을 요청할 수 있는 대상으로 봅니다."},{symbol:"c",name:"정상 후보",description:"정한 차수보다 낮은 다항식의 전체 평가값입니다."},{symbol:"Δ",name:"상대 거리",description:"가장 가까운 정상 목록과 다른 좌표 수를 전체 위치 수로 나눕니다."}]} assumptions={["체와 평가 도메인, 차수 제한을 먼저 정합니다.","거리 정의만으로 검사의 거짓 통과 확률이나 암호 보안 수준은 정해지지 않습니다."]} interpretation="위치가 16개이고 k=4이면 비율은 1/4입니다. 정상 목록에서 한 좌표만 바꾸면 상대 거리는 1/16이며 최소 거리 13 때문에 다른 정상 목록이 될 수 없습니다." />
  <p>증명 프로토콜은 검사할 목록이 나중에 바뀌지 않도록 고정하고 도전값과 질의 응답을 연결해야 합니다. 도메인 구조, 체 크기, 비율, 반복 횟수도 건전성 분석의 전제입니다. 원문의 상호작용형 계산량을 실제 해시·전송까지 포함한 처리 속도로 읽을 수는 없습니다. 구체적인 접기는 <Link to="/cs/crypto/fri">FRI 글</Link>에서 이어집니다.</p>
  <div id="paper-fri-2018"><CitationBlock source="FRI (ICALP 2018) · §1의 RS 집합과 근접성" citeKey={3} href="https://doi.org/10.4230/LIPIcs.ICALP.2018.14">원문의 N·ρ·평가 목록을 같은 네 기록에 대응했습니다. 목록의 소속과 근접성 정의를 확인하는 사례이며 실제 FRI 실행이나 특정 보안 비트의 검증 결과는 아닙니다.</CitationBlock></div>
 </section>
 <section id="reed-solomon-release-gate" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">15. 성공 사례와 잘못된 성공 사례를 함께 확인합니다</h2>
  <p>구현 검사는 고정한 프로파일에서 같은 원본이 같은 바이트를 만드는지부터 시작합니다. 누락이 없는 경우와 허용한 최다 누락, 복원 경계 안팎의 오류를 확인합니다. 12절의 잘못된 성공도 포함해 인증된 원본 확인 단계가 이를 거절하는지 검사해야 합니다.</p>
  <p>중복 위치와 범위를 벗어난 위치, 다른 물건의 조각, 잘못된 길이도 각각 확인합니다. 시간 초과나 재시작으로 처리하지 못한 상태를 복원 성공으로 바꾸지 않습니다. 부호 규칙과 원본 확인이 맞은 뒤 처리량, 최대 메모리, 복원에 전송한 데이터 양을 비교합니다.</p>
  <p>이 글은 F₇의 작은 정수 계산을 직접 검산했습니다. 네 기록의 모든 두 위치 복원, 한 오류 교정, 행렬 변환과 잘못된 성공 반례를 확인했습니다. 특정 저장 시스템이나 RFC 패킷 구현, FRI 증명기를 실행한 성능·보안 시험은 아닙니다.</p>
  <ReviewPrompts questions={["같은 원본 숫자 2·3을 계수로 해석할 때와 앞 두 평가값으로 해석할 때 네 기록이 어떻게 달라지나요? (답: 9절)","네 기록 중 오류 한 개와 소실 한 개가 함께 있으면 왜 유일한 복원을 보장하지 못하나요? (답: 10절)","[2,6,3,4]를 받은 복원기가 원본을 2·4로 반환해도 내부 계산은 맞을 수 있는 이유는 무엇인가요? (답: 12절)"]} />
 </section>
 </article>; }
