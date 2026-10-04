import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ContentBoundary from "@/components/articles/content-boundary";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import TowerCaseViz from "./viz/TowerCaseViz";
import { codeRefs, fileTrees } from "./codeRefs";

export default function ModernArticle(){const sidebar=useCodeSidebar();return <article className="space-y-14">
<section id="overview" data-teach-level="S" className="space-y-5"><h2 className="text-2xl font-bold">1. 문자 세 개가 붙은 곱을 숫자 열두 칸에 담습니다</h2>
<p>두 값 A=(1+u)v²w와 B=(2+u)v²w를 곱한다고 합시다. 문자가 많아 보여도 할 일은 항을 곱하고 정해 둔 규칙으로 높은 거듭제곱을 줄이는 것입니다. 이번 규칙은 u²=−1, v³=9+u, w²=v이며 답은 (6+28u)v²입니다.</p>
<p>이 계산을 먼저 손으로 풀고 실제 BN254 구현에 같은 값을 넣습니다. 숫자 열두 칸을 어떤 순서로 저장하는지, 곱셈이 아래층의 계산을 어떻게 부르는지, 바이트로 내보낼 때 무엇이 달라지는지 한 결과를 끝까지 따라가겠습니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="space-y-5"><h2 className="text-2xl font-bold">2. 두 입력과 세 규칙을 받아 같은 모양으로 돌려줍니다</h2>
<p>계산기에 들어가는 것은 두 입력과 계수의 나머지 기준 p, 세 문자에 대한 규칙입니다. 각 계수는 0부터 p−1 사이의 숫자입니다. 곱한 뒤에도 u의 지수는 0·1, v의 지수는 0·1·2, w의 지수는 0·1 중 하나가 되도록 정리합니다.</p>
<p>따라서 계수가 놓일 자리는 2×3×2=12개입니다. 이번 두 입력은 v²w와 uv²w 자리만 사용합니다. 출력에서는 v²와 uv² 자리의 계수가 각각 6과 28이고 나머지 열 자리는 0이 됩니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-5"><h2 className="text-2xl font-bold">3. 같은 두 입력의 곱에서 6과 28이 나옵니다</h2>
<p>먼저 (1+u)(2+u)=2+3u+u²=1+3u입니다. 바깥의 문자들은 v²w·v²w=v⁴w²입니다. w²를 v로 바꾸면 v⁵이고 v³를 9+u로 바꾸면 (9+u)v²입니다.</p>
<p>남은 계수를 곱하면 (1+3u)(9+u)=9+28u+3u²=6+28u입니다. 따라서 전체 결과는 (6+28u)v²입니다. 이번 양의 계수 6과 28은 p보다 작아서 그대로 쓰지만 음수나 큰 값은 항상 p로 나눈 나머지로 저장합니다.</p>
<p>입력은 설명을 위해 고른 값입니다(가정). 나머지 기준과 세 규칙은 뒤에서 확인할 고정 BN254 설정을 사용합니다. p는 <code className="break-all">21888242871839275222246405745257275088696311157297823662689037894645226208583</code>입니다. 앞의 작은 F₃ 사례와 달리 3u를 0으로 지우지 않습니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-5"><h2 className="text-2xl font-bold">4. 높은 항을 줄일 때 값이 다른 칸으로 이동합니다</h2>
<TowerCaseViz />
<p>그림의 열두 칸은 십진수 열두 자리가 아닙니다. 각 칸은 1이나 uv²w처럼 정해진 항에 붙는 계수입니다. 높은 항을 버리는 대신 규칙에 따라 다른 칸으로 옮겨야 처음의 곱과 같은 값을 보존합니다.</p>
</section>
<section id="need" data-teach-level="2" className="space-y-5"><h2 className="text-2xl font-bold">5. 큰 계산을 작은 계산의 조합으로 다룹니다</h2>
<p>
            페어링 계산에는 원래 숫자 공간보다 큰 공간이 필요합니다. 열두 계수의 연산을 한 번에 새로 만들 수도 있지만 두 계수씩 묶고 그 묶음 세 개를 다시 묶은 뒤 마지막으로 둘을
            묶으면 이미 만든 연산을 재사용할 수 있습니다.
          </p>
<p>이 구조에서 윗층의 곱셈 한 번은 아랫층의 곱셈 여러 번입니다. 따라서 코드에 곱셈이 세 번 보인다고 원래 숫자의 곱셈도 세 번이라는 뜻은 아닙니다. 계수가 어느 층의 값인지와 높은 항을 어디로 보내는지 함께 읽어야 합니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-5"><h2 className="text-2xl font-bold">6. 층별 계수와 확장 차수에 이름을 붙입니다</h2>
<p>소수 p의 나머지로 계산하는 체를 Fₚ라고 합니다. u를 붙여 두 계수를 쓰는 공간이 Fₚ², 그 위에 v를 붙여 세 묶음을 쓰는 공간이 Fₚ⁶, 다시 w를 붙여 두 묶음을 쓰는 공간이 Fₚ¹²입니다. 이렇게 여러 확장을 쌓은 구성을 tower, 즉 확장체의 탑이라고 부릅니다.</p>
<p>각 단계의 확장 차수는 바로 아래 체를 기준으로 필요한 계수 수입니다. 2차·3차·2차를 곱하면 원래 Fₚ 위 차수 12를 얻습니다. 이는 원소가 열두 개라는 말이 아닙니다. 열두 계수마다 p가지 선택이 있어 전체 원소 수는 p¹²입니다.</p>
<p>높은 항을 줄이는 β=−1, ξ=9+u 같은 상수를 non-residue라고 부릅니다. 여기서는 아래 체에서 각각 제곱이나 세제곱으로 나타낼 수 없는 상수라는 조건이 필요합니다. 이 조건이 새 다항식의 기약성과 연결되어 0 아닌 값의 나눗셈을 유지합니다. 수학적 이유는 <Link className="text-primary hover:underline" to="/cs/crypto/extension-field-theory#minimal-polynomial">기약식과 역원</Link>에서 이어 읽을 수 있습니다.</p>
</section>
<section id="layout" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">7. 두 묶음 안의 세 묶음 안에 숫자 두 개를 둡니다</h2>
<p>가장 안쪽은 a₀+a₁u입니다. 가운데는 C₀+C₁v+C₂v²이며 각 C가 이런 두 계수 값입니다. 가장 바깥은 D₀+D₁w이며 각 D가 가운데의 여섯 계수 값입니다. 소스에서는 각각 Fq2, Fq6, Fq12라고 부릅니다. 이 라이브러리의 q 이름과 본문의 바탕 소수 p가 같은 숫자임을 확인해야 합니다.</p>
<div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className="p-3 text-left">바깥 묶음</th><th className="p-3 text-left">계수 순서</th><th className="p-3 text-left">A / 출력</th></tr></thead><tbody><tr><td className="p-3">D₀</td><td className="p-3">1, u, v, uv, v², uv²</td><td className="p-3">모두 0 / 끝 두 칸 6·28</td></tr><tr><td className="p-3">D₁</td><td className="p-3">w, uw, vw, uvw, v²w, uv²w</td><td className="p-3">끝 두 칸 1·1 / 모두 0</td></tr></tbody></table></div>
<ExplainedFormula question="실제 저장 칸은 왜 열두 개가 되나요?" idea="바깥 두 계수 각각이 가운데 세 계수를 갖고 그 각각이 원래 숫자 두 개를 갖습니다."
formula={String.raw`[F_{p^{12}}:F_p]=2\cdot3\cdot2=12`}
annotatedFormula={String.raw`\begin{gathered}[F_{p^{12}}:F_p]\\=\underbrace{2}_{\text{D 묶음}}\cdot\underbrace{3}_{\text{각 D의 C 묶음}}\cdot\underbrace{2}_{\text{각 C의 숫자}}=12\end{gathered}`}
operations={[{expression:"a_0+a_1u",annotation:["C 하나에는 원래 숫자 두 개가 들어갑니다."]},{expression:"C_0+C_1v+C_2v^2",annotation:["D 하나에는 C 세 개, 원래 숫자 여섯 개가 들어갑니다."]},{expression:"D_0+D_1w",annotation:["D 두 개를 펼치면 같은 열두 계수가 됩니다."]}]}
terms={[{symbol:"[K:F]",name:"확장 차수",description:"F의 계수로 K 원소를 표현할 때 필요한 기저의 개수입니다."}]}
assumptions={["각 층의 다항식이 바로 아래 체에서 기약입니다.","계수 순서는 이 글에서 고정한 BN254 소스의 순서입니다."]} interpretation="차수의 곱은 저장할 계수 개수를 알려 줍니다. 계수가 같은 순서로 전송되는지와 내부 limb 표현은 별도의 형식입니다." />
<p>A의 정확한 접근 경로는 c1.c2.c0=1, c1.c2.c1=1입니다. B는 같은 두 경로가 2와 1입니다. 출력에서는 c0.c2.c0=6, c0.c2.c1=28입니다. 같은 c0라는 이름이 어느 층에 속하는지 끝까지 따라가면 계수의 의미를 잃지 않습니다.</p>
</section>
<section id="fp2" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">8. 안쪽의 두 계수는 네 항을 두 항으로 모읍니다</h2>
<p>일반적인 u²=β에서 (a₀+a₁u)(b₀+b₁u)를 펼치면 상수항은 a₀b₀+βa₁b₁이고 u의 계수는 a₀b₁+a₁b₀입니다. 이를 그대로 계산하면 두 입력의 계수끼리 곱하는 항은 네 개입니다.</p>
<ExplainedFormula question="교차항 두 개를 세 번째 곱 하나로 얻을 수 있나요?" idea="같은 두 직접 곱을 저장하고 합끼리 곱한 값에서 그 두 항을 뺍니다."
formula={String.raw`\begin{gathered}z_0=a_0b_0,\quad z_1=a_1b_1\\c_0=z_0+\beta z_1\\c_1=(a_0+a_1)(b_0+b_1)-z_0-z_1\end{gathered}`}
annotatedFormula={String.raw`\begin{gathered}z_0=a_0b_0,\quad z_1=a_1b_1\\s=(a_0+a_1)(b_0+b_1)\\c_0=z_0+\beta z_1\\c_1=s-z_0-z_1\\z_0=2,\ z_1=1,\ s=6\\c_0=2-1=1\\c_1=6-2-1=3\end{gathered}`}
operations={[{expression:"(a_0+a_1)(b_0+b_1)",annotation:["네 항이 모두 든 합의 곱을 한 번 계산합니다."]},{expression:"-z_0-z_1",annotation:["이미 계산한 두 직접 곱을 빼면 교차항 둘만 남습니다."]},{expression:String.raw`\beta z_1`,annotation:["u²가 붙은 항을 상수항으로 되돌립니다."]}]}
terms={[{symbol:"s",name:"합의 곱",description:"두 계수의 합을 각각 구한 뒤 곱한 값입니다."},{symbol:"β",name:"이차식의 상수",description:"이 사례는 u²=−1이므로 β=−1입니다."},{symbol:"z₀,z₁",name:"다시 쓰는 두 곱",description:"교차항 복원에 재사용합니다."}]}
assumptions={["덧셈·뺄셈과 β를 곱하는 비용은 세 번의 일반 곱셈 수에서 별도로 셉니다.","이 식이 맞다는 사실과 실제 코드가 이 순서로 실행한다는 주장은 다릅니다."]} interpretation="이 세 곱의 방법이 Karatsuba입니다. 같은 입력의 결과는 1+3u입니다. 뒤에서 볼 고정 Fq2 코드는 다른 합산 분기를 쓰며 Fq12의 위층에는 이 Karatsuba 분기를 씁니다." />
<p>작은 F₃로 바꾸면 같은 1+3u는 1이 됩니다. 원래 글의 F₃ 예에서 나온 결과와 이번 BN254 결과가 다른 이유는 계수의 나머지 기준이 다르기 때문입니다. β의 기호만 같다고 같은 체로 계산해서는 안 됩니다.</p>
</section>
<section id="inverse" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">9. 역원은 켤레에 남은 배율까지 나누어 만듭니다</h2>
<p>(a₀+a₁u)(a₀−a₁u)=a₀²−βa₁²입니다. 오른쪽에는 u가 없어 바탕 체의 숫자 하나입니다. 이 숫자 N의 역원을 구한 뒤 a₀−a₁u에 곱하면 처음 값의 역원이 됩니다.</p>
<p>이번 β=−1에서 1+u의 N은 2입니다. 2의 역원을 h=(p+1)/2라고 쓰면 답은 h−hu입니다. 실제 Rust에서 inverse가 이 두 계수를 반환하고 곱해서 1이 되는지 확인했습니다. 켤레 1−u만 곱하면 2가 남으므로 켤레 자체를 역원으로 부르면 틀립니다.</p>
<p>기약식으로 만든 체에서는 0 아닌 값의 N이 0일 수 없습니다. 하지만 F₅에서 같은 u²=−1을 쓰면 u²+1=(u−2)(u+2)입니다. 두 인수는 0이 아닌데 곱은 0이고 u−2의 N=4+1=0입니다. 이때는 0 아닌 값도 역원이 없으므로 구성부터 고쳐야 합니다.</p>
<p>올바른 구성에서도 0의 inverse는 실패해야 합니다. 이번 실행의 Fq12::ZERO.inverse()는 None이었고 A의 inverse는 A와 곱해 1이 되었습니다. 실패가 입력 0 때문인지 잘못된 다항식 때문인지 구분합니다.</p>
</section>
<section id="fp6" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">10. 가운데 곱에서는 v⁴가 v 자리로 돌아옵니다</h2>
<p>바깥 곱셈이 호출할 두 가운데 값은 A₁=(1+u)v²와 B₁=(2+u)v²입니다. 이 둘의 곱은 (1+3u)v⁴이고 v⁴=(9+u)v이므로 (6+28u)v입니다. 이 단계에서는 아직 v²가 아닙니다. 바깥 w²를 처리할 때 v가 한 번 더 붙습니다.</p>
<p>일반적인 세 계수 곱에서는 차수 0부터 4까지 아홉 항이 생깁니다. v³ 항은 ξ를 곱해 상수항으로 보내고 v⁴ 항은 ξ를 곱해 v항으로 보냅니다. 이번 ξ는 9+u입니다. 항을 버리면 곱셈이 달라집니다.</p>
<AlgorithmBlock title="같은 가운데 값에 원문의 여섯 곱을 대입하기" input={["왼쪽 계수 (d,e,f)=(0,0,1+u)","오른쪽 계수 (a,b,c)=(0,0,2+u)"]} steps={[{code:"ad=0; be=0; cf=1+3u",note:"대각선의 직접 곱 세 개입니다."},{code:"x=(e+f)(b+c)-be-cf=0",note:"v³에 모일 두 교차항을 복원합니다."},{code:"y=(d+e)(a+b)-ad-be=0",note:"v항의 교차항을 복원합니다."},{code:"z=(d+f)(a+c)-ad+be-cf=0",note:"v²항에는 가운데 직접 곱 be도 들어갑니다."},{code:"[ad+ξx, y+ξcf, z]=[0,6+28u,0]",note:"v⁴를 낮춘 항은 가운데 계수에 들어갑니다."}]} output="A₁B₁=(6+28u)v이며 여섯 곱은 Fq2 값 사이의 곱입니다." />
<p>세 직접 곱과 세 합의 곱을 사용하므로 일반 곱셈은 여섯 번입니다. 다만 이번 입력에는 0이 많습니다. 이를 보고 항상 같은 시간만큼 빨라진다고 말할 수는 없습니다. 이 글은 일반 연산의 코드 경로를 따라가며 특정 희소 곱셈 함수를 선택한 실행이 아닙니다.</p>
</section>
<section id="fp12" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">11. 마지막 w²가 v를 한 번 더 곱하게 합니다</h2>
<p>바깥 값은 A=0+A₁w와 B=0+B₁w입니다. 이차 Karatsuba 식에 넣으면 z₀=0, z₁=A₁B₁=(6+28u)v입니다. w의 계수는 합의 곱에서 z₁을 빼므로 0이고 상수 쪽은 w²=v 때문에 v·z₁입니다.</p>
<p>따라서 출력은 (6+28u)v²+0w입니다. v를 곱하는 일반 규칙은 [C₀,C₁,C₂]를 [ξC₂,C₀,C₁]로 바꾸는 것입니다. 이번에는 [0,6+28u,0]을 [0,0,6+28u]로 옮깁니다. 세 계수를 그냥 순환시키기만 하면 마지막 항의 ξ를 놓칠 수 있습니다.</p>
<p>위층의 세 번 곱셈은 Fq6 곱셈 세 번입니다. 각 곱셈이 다시 Fq2 연산을 부릅니다. 원래 Fₚ의 곱 세 번으로 전체 Fq12 계산이 끝난다는 해석은 맞지 않습니다.</p>
</section>
<section id="source" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">12. 실제 설정과 분기에 같은 입력을 넣습니다</h2>
<p>원문은 arkworks algebra의 commit 7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c로 고정했습니다. 이 시점의 ark-ff는 0.5.0이고 별도 curves workspace의 ark-bn254는 0.5.0-alpha.0입니다. 실제 Cargo.lock과 실행에서도 이 조합을 확인했습니다. 두 패키지를 모두 정식 0.5.0이라고 표시하지 않습니다.</p>
<p>fq2.rs는 NONRESIDUE를 −1로 정합니다. fq6.rs는 Fq2::new(9,1), 즉 9+u를 정합니다. fq12.rs의 NONRESIDUE는 Fq6::new(0,1,0), 즉 v입니다. 같은 파일 안의 Frobenius 표도 이 구성과 함께 사용합니다.</p>
<CodeViewButton label="실제 Fq2 설정 · u²=−1" onClick={()=>sidebar.open("params2",codeRefs.params2)} />
<CodeViewButton label="실제 Fq6 설정 · v³=9+u" onClick={()=>sidebar.open("params6",codeRefs.params6)} />
<CodeViewButton label="실제 Fq12 설정 · w²=v" onClick={()=>sidebar.open("params12",codeRefs.params12)} />
<p>quadratic_extension.rs의 652행은 바로 아래 층에 대한 차수가 아니라 소수체 위 전체 차수가 2인지 묻습니다. Fq2는 2이므로 sum_of_products 분기로 들어갑니다. 첫 출력은 1×2+(−1)×1=1, 두 번째는 저장한 [1,1]과 [1,2]의 대응 곱을 더한 3입니다.</p>
<p>Fq12의 전체 차수는 12이므로 같은 함수의 else 분기로 들어갑니다. 663–673행이 앞 절의 z₀, z₁과 합의 곱을 계산하는 부분입니다. 모든 이차 모양 타입이 같은 분기를 사용한다고 추측하면 실제 곱셈 횟수와 축약 방식이 달라집니다.</p>
<CodeViewButton label="원본 곱셈의 두 분기 · 649–675행" onClick={()=>sidebar.open("quad",codeRefs.quad)} />
<p>가운데 Fq6는 cubic_extension.rs의 569–593행을 사용합니다. 원문의 ad·be·cf·x·y·z에 앞의 값들을 넣으면 c1=ξ(1+3u)이고 나머지는 0입니다. ξ를 곱하는 실제 전용 함수는 세 번의 두 배 연산으로 8배를 만든 다음 원래 값을 더해 9배를 얻습니다.</p>
<p>그 함수에 c0=1, c1=3을 넣으면 새 첫 계수는 −3+8+1=6, 둘째는 24+3+1=28입니다. 위층의 v 곱셈 함수는 앞서 설명한 [ξC₂,C₀,C₁]의 이동을 그대로 구현합니다. 이 함수들을 실제 실행해 같은 두 중간 결과를 확인했습니다.</p>
<CodeViewButton label="원본 세 계수 곱 · 569–593행" onClick={()=>sidebar.open("cubic",codeRefs.cubic)} />
<CodeViewButton label="원본 9+u 곱 · 92–104행" onClick={()=>sidebar.open("xi",codeRefs.xi)} />
<CodeViewButton label="원본 v 곱과 계수 이동 · 26–36행" onClick={()=>sidebar.open("top",codeRefs.top)} />
<p>별도의 검증 프로그램은 실제 A·B의 곱과 역원, 12개 기저 사이의 144개 곱을 확인했습니다. 비교 계산은 계수 열두 개를 직접 전개한 뒤 세 규칙으로 낮추는 방식입니다. 추가로 모든 칸을 사용하는 입력 16쌍도 비교했습니다. 이는 검산이며 실행 시간 측정이 아닙니다.</p>
<CodeViewButton label="실제 실행한 BN254 검증 프로그램" onClick={()=>sidebar.open("experiment",codeRefs.experiment)} />
<div id="paper-ark-bn254-source"><CitationBlock source="arkworks algebra · 7ad88c46 · BN254 설정과 공통 연산" citeKey={1} href="https://github.com/arkworks-rs/algebra/tree/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/curves/bn254/src/fields">동일 commit의 설정 파일과 ff 연산을 함께 읽고 실제 Rust 의존성으로 실행했습니다. 코드 패널의 원문은 전체 파일이며 자체 검증 프로그램과 구분합니다. 바탕 계수 연산은 라이브러리를 재사용하고 확장체의 비교 계산 순서는 독립적으로 작성했습니다.</CitationBlock></div>
</section>
<section id="frobenius-optimization" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">13. 큰 p제곱을 층별 계수와 미리 구한 배율로 바꿉니다</h2>
<p>Frobenius는 x를 xᵖ로 보내는 연산입니다. Fₚ의 숫자는 p제곱해도 그대로입니다. 이번 p는 4로 나눈 나머지가 3이고 u²=−1이므로 uᵖ=−u입니다. 안쪽 값 a+bu에는 a−bu를 적용하면 됩니다.</p>
<p>하지만 v와 w는 더 큰 공간의 원소입니다. 이 둘까지 그대로 둔 채 u만 부호를 바꾸면 일반적인 p제곱과 다릅니다. 실제 코드는 아래층에 Frobenius를 먼저 적용하고 위층 계수에 정해진 표의 배율을 곱합니다. Fq6에서는 두 표를, Fq12에서는 power를 12로 나눈 나머지에 해당하는 표 항목을 씁니다.</p>
<ExplainedFormula question="같은 A를 여섯 번과 열두 번 p제곱하면 어떻게 되나요?" idea="여섯 번이면 Fq6 계수는 원복되고 w에는 −1이 붙습니다. 다시 여섯 번 적용하면 그 부호도 원복됩니다."
formula={String.raw`\begin{gathered}\varphi(x)=x^p\\\varphi^{12}(x)=x^{p^{12}}=x\end{gathered}`}
annotatedFormula={String.raw`\begin{gathered}\varphi(x)=x^p,\quad\varphi^{12}(x)=x\\A=(1+u)v^2w\\\varphi^6(A)=-A\\\varphi^{12}(A)=A\end{gathered}`}
operations={[{expression:String.raw`\varphi^6(D)=D`,annotation:["Fq6에 속하는 계수 D는 여섯 번 p제곱하면 돌아옵니다."]},{expression:String.raw`\varphi^6(w)=-w`,annotation:["이 고정 구성의 위층 표에서 index 6의 배율은 −1입니다."]},{expression:"(-1)^2=1",annotation:["같은 여섯 단계를 두 번 적용하면 A의 부호도 원복됩니다."]}]}
terms={[{symbol:"φ",name:"Frobenius",description:"p제곱이며 유한체의 덧셈과 곱셈을 보존합니다."},{symbol:"12",name:"전체 차수",description:"모든 원소에 대해 열두 번 적용한 사상은 항등입니다. 개별 원소의 최소 주기는 더 작을 수 있습니다."}]}
assumptions={["같은 소수·기저·기약식의 표를 사용합니다.","주기 검사만으로 표의 정확성이 증명되지는 않습니다."]} interpretation="이번 A는 여섯 번 뒤 −A이고 열두 번 뒤 A입니다. Fₚ의 숫자는 한 번 뒤부터 그대로이므로 모든 원소의 최소 주기가 12라는 뜻은 아닙니다." />
<CodeViewButton label="원본 위층 배율 선택 · 40–59행" onClick={()=>sidebar.open("frob",codeRefs.frob)} />
<p>실제 검증에서는 12개 기저와 A·B·출력, 총 15개 값의 빠른 사상을 직접 pow(p)와 비교했습니다. A의 여섯 번 적용 결과와 열두 번 원복도 확인했습니다. u 계수만 부호를 바꾸는 잘못된 계산은 두 번이면 돌아오므로 열두 번 원복도 통과하지만 A의 실제 p제곱과는 달랐습니다.</p>
</section>
<section id="wire" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">14. 같은 6+28u도 전송 규칙에 따라 순서가 달라집니다</h2>
<p>이번 출력은 논리 계수의 0번부터 세었을 때 4번에 6, 5번에 28이 있습니다. 실제 ark 직렬화는 아래 계수 c0부터 c1 순서로 쓰며 각 Fq는 32바이트입니다. 실행 결과의 길이는 384바이트이고 128번 바이트가 6, 160번 바이트가 28입니다. 이 작은 값들이 각 묶음 첫 바이트에 있는 것은 작은 쪽부터 쓰는 형식이기 때문입니다.</p>
<CodeViewButton label="원본 두 계수의 직렬화 순서 · 689–700행" onClick={()=>sidebar.open("bytes",codeRefs.bytes)} />
<p>반면 EIP-197은 Fₚ²의 a·i+b를 (a,b) 순서로 보내며 각 숫자는 32바이트의 큰 쪽부터 쓰는 형식입니다. 따라서 같은 6+28u를 그 규칙으로 적으면 28의 32바이트가 먼저, 6의 32바이트가 다음입니다. 첫 묶음의 마지막 바이트가 28이고 다음 묶음의 마지막 바이트가 6입니다.</p>
<p>여기서 u와 EIP의 i가 같은 제곱 관계를 쓰도록 대응시켰습니다. 이 64바이트는 계수 하나의 형식 예시입니다. 유효한 G2 점 전체나 EVM 호출을 실행한 결과가 아닙니다. 원문의 규격은 G2 좌표와 페어링 판정의 입력을 정하며 내부 Fq12의 384바이트 출력을 표준화하지 않습니다.</p>
<p>순서만 바꾸어 [28,6]을 내부 계수로 읽으면 28+6u가 됩니다. 길이와 타입 모양은 같지만 출력은 다른 값입니다. 왕복 직렬화만 통과해도 양쪽이 함께 같은 잘못된 순서를 쓸 수 있으므로 규격의 고정 예와 비교해야 합니다.</p>
<div id="paper-eip197-extension"><CitationBlock source="EIP-197 · Definition of groups와 Encoding" citeKey={2} href="https://eips.ethereum.org/EIPS/eip-197">Fₚ²의 관계 i²+1, (a,b) 순서와 32바이트 big-endian 규칙을 읽고 6+28u에 적용했습니다. G2에는 좌표 범위·곡선·부분군 조건도 필요합니다. 내부 확장체의 표현이나 라이브러리 실행 속도를 정하는 규격으로 확대하지 않습니다.</CitationBlock></div>
</section>
<section id="target" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">15. 열두 계수 타입이 곧 페어링의 목표 군은 아닙니다</h2>
<p>BN254에서 곡선 부분군의 위수 r은 바탕 소수 p와 다릅니다. r이 pᵏ−1을 나누는 가장 작은 양의 k를 embedding degree라고 합니다. 이 구성에서는 k=12입니다. 실제 프로그램에서 k=1부터 11까지는 나누어떨어지지 않고 k=12에서는 나누어떨어지는지 확인했습니다.</p>
<p>페어링의 목표 군 GT는 Fₚ¹²의 0 아닌 원소들 중 위수가 r을 나누는 부분군입니다. 임의의 Fq12 값이나 이번 A·B의 곱을 만들었다고 자동으로 그 부분군의 원소가 되지는 않습니다. 0에는 곱셈군의 역원조차 없습니다.</p>
<p>페어링 구현은 Miller loop의 결과에 final exponentiation을 적용해 목표 부분군의 값을 얻습니다. 이 과정과 G1·G2 입력의 부분군 검사는 <Link className="text-primary hover:underline" to="/cs/crypto/pairing#final-exp">페어링 글</Link>에서 따로 다룹니다. 이번 프로그램은 확장체 산술을 실행했으며 페어링이나 Ethereum precompile을 실행하지 않았습니다.</p>
</section>
<section id="cost" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">16. 연산 횟수에는 어느 층의 곱인지 적습니다</h2>
<p>일반적인 학교식 전개와 앞의 식을 비교하면 이차 층은 아래층 곱 4회에서 3회로, 삼차 층은 아래층 곱 9회에서 6회로 줄일 수 있습니다. 그러나 고정한 Fq2 원문은 두 sum_of_products를 사용합니다. 이 호출 안의 곱 합산과 나머지 처리를 세 개의 독립 Fq 곱으로 바꾸어 세면 실제 경로를 설명하지 못합니다.</p>
<p>이번 Fq12의 일반 경로에는 Fq6 곱 3회가 있고 각 Fq6 곱에는 Fq2 곱 6회가 있습니다. 여기에 ξ나 v를 곱하는 전용 함수, 덧셈과 뺄셈도 있습니다. 3×6이라는 수는 계수 곱의 호출 구조를 세는 장부이며 18번의 기계어 곱이나 실행 시간 비율이 아닙니다.</p>
<p>페어링의 일부 항은 0이 많아 희소 곱셈을 쓸 수 있습니다. 제곱에도 별도 공식을 쓸 수 있습니다. 어느 함수를 호출했는지와 실제 입력 모양을 기록한 뒤 같은 기기에서 측정해야 합니다. 이 글에서는 곱셈·제곱·Frobenius의 성능 우열이나 부채널 안전성을 측정하지 않았습니다.</p>
</section>
<section id="boundaries" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">17. 같은 크기의 배열도 다른 계산 공간일 수 있습니다</h2>
<p>새 구성을 만들 때는 p와 r을 먼저 구분하고 각 층의 다항식과 계수 순서를 확인합니다. 이번 실제 실행에서는 ξ의 (p²−1)/3제곱이 1이 아님을 확인했습니다. Fₚ²의 곱셈군 크기는 p²−1이고 3의 배수이므로 이는 ξ가 세제곱이 아님을 확인하는 방법입니다. 따라서 X³−ξ는 근이 없는 3차식으로 기약입니다.</p>
<p>위층에서는 v의 (p⁶−1)/2제곱이 −1이므로 v가 제곱이 아님을 확인했습니다. 이것이 X²−v의 기약성과 연결됩니다. 같은 열두 칸을 만들었다는 사실이나 NONRESIDUE라는 변수명만으로 이런 조건이 확인되었다고 보지는 않습니다.</p>
<p>계수 순서를 바꾸는 오류는 6+28u가 28+6u가 되는 비교로 드러났습니다. Frobenius 표 오류는 주기 검사에 직접 p제곱 비교를 더해야 잡을 수 있었습니다. 입력이 원래 Fₚ에만 있으면 둘째 계수가 0이라 부호 오류를 놓칠 수 있으므로 각 기저를 따로 넣어 봅니다.</p>
</section>
<section id="extension-release-gate" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">18. 같은 곱의 값·저장·전송을 각각 확인합니다</h2>
<p>이번 검증은 고정한 실제 설정에서 A·B의 곱, 중간 계수, 역원과 기저 곱을 확인했습니다. 직접 다항식 전개와 최적화된 연산의 결과를 비교했고 Frobenius를 직접 거듭제곱과 대조했습니다. 직렬화에서는 같은 출력의 384바이트와 계수 순서를 확인했습니다.</p>
<p>새 구현을 페어링에 연결하려면 G2 좌표와 부분군 검사, 공식 규격의 유효·무효 입력 및 전체 페어링 결과까지 추가로 대조해야 합니다. 산술이 맞아도 그 연결이 틀릴 수 있기 때문입니다. 성능은 이 정확성 조건을 맞춘 구현끼리 비교합니다.</p>
<ReviewPrompts questions={["같은 A·B를 곱할 때 가운데 결과가 (6+28u)v인데 최종 결과는 왜 v²에 붙나요? (답: 10·11절)","Frobenius를 열두 번 적용해 원복되었는데도 왜 표가 틀릴 수 있나요? (답: 13·17절)","내부의 [6,28]을 그대로 EIP-197의 두 숫자로 보내면 같은 원소인가요? (답: 14절)"]} />
<ContentBoundary article="extension-fields" />
</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{ark:{id:"ark",label:"arkworks · 고정 commit 7ad88c46",badgeClass:"bg-sky-50 border-sky-300 text-sky-800"},check:{id:"check",label:"본문의 실제 BN254 검증",badgeClass:"bg-emerald-50 border-emerald-300 text-emerald-800"}}} />
</article>;}
