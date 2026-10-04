import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import ModernSparseViz from "./viz/ModernSparseViz";
import { codeRefs, fileTrees } from "./codeRefs";
export default function ModernSparseMultiplicationArticle(){const sidebar=useCodeSidebar();return <article className="space-y-14">
<section id="overview" data-teach-level="S" className="space-y-5"><h2 className="text-2xl font-bold">1. 네 칸 중 두 칸이 0이면 그 열의 곱셈을 생략합니다</h2>
<p>A=1+2w+3w²+4w³에 B=5+7w²를 곱합시다. 두 값을 각각 네 칸의 계수로 적으면 [1,2,3,4]와 [5,0,7,0]입니다. 모든 칸끼리 곱하면 열여섯 쌍이지만 둘째 입력의 0인 두 열은 계산하지 않아도 됩니다.</p>
<p>남은 여덟 곱으로 같은 답을 만드는 것부터 확인하겠습니다. 이어 같은 값을 실제 확장체 코드에 넣습니다. 이때 함수 이름의 숫자가 다항식의 지수 순서와 같지 않다는 점이 중요한 확인 대상입니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="space-y-5"><h2 className="text-2xl font-bold">2. 입력의 빈 위치를 알고도 일반 곱과 같은 값을 내야 합니다</h2>
<p>입력은 두 계수 배열과 각 칸이 뜻하는 w의 거듭제곱입니다. 출력은 곱의 계수입니다. 처음에는 보통 다항식으로 계산하므로 최대 w⁵까지 생깁니다. 두 번째 입력의 1·3번 칸이 정확히 0이라는 조건을 알고 있습니다.</p>
<p>빈 칸을 생략하는 함수가 원래 값을 바꾸어서는 안 됩니다. 그 자리에 나중에 11 같은 값이 들어오면 기존 계산으로 충분한지 다시 확인해야 합니다. 생략한 자리와 실제 입력이 같은지부터 검사하는 이유입니다.</p>
</section>
<section id="concrete" data-teach-level="0" className="space-y-5"><h2 className="text-2xl font-bold">3. 같은 여덟 곱을 출력의 여섯 자리에 모읍니다</h2>
<p>설명용 입력은 앞의 A와 B로 정합니다(가정). A에 5를 곱하면 5+10w+15w²+20w³입니다. A에 7w²를 곱하면 7w²+14w³+21w⁴+28w⁵입니다. 앞에는 계수를 5배 한 네 항, 뒤에는 7배 한 뒤 두 자리 옮긴 네 항이 생깁니다.</p>
<p>같은 지수끼리 더하면 5+10w+22w²+34w³+21w⁴+28w⁵입니다. 예를 들어 w²의 22는 15+7이고 w³의 34는 20+14입니다. 여덟 곱이 여덟 출력 칸을 뜻하지는 않습니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-5"><h2 className="text-2xl font-bold">4. 빈 열과 이동한 두 행을 같은 결과로 연결합니다</h2>
<ModernSparseViz />
<p>각 장면에서 입력 A는 같습니다. 곱한 뒤 생기는 위치가 바뀌므로 값과 위치를 함께 읽습니다. 마지막 장면은 두 행을 같은 지수끼리 더한 결과입니다.</p>
</section>
<section id="need" data-teach-level="2" className="space-y-5"><h2 className="text-2xl font-bold">5. 반복해서 같은 빈 칸이 생기면 전용 계산을 만들 수 있습니다</h2>
<p>0을 곱해 더하는 결과는 언제나 0입니다. 같은 빈 칸을 가진 값을 여러 번 곱한다면 그 계산을 처음부터 만들지 않는 편이 유리할 수 있습니다. 페어링의 Miller 계산에서는 선의 값을 곱할 때 이런 정해진 모양이 반복됩니다.</p>
<p>다만 입력마다 0을 찾아다니는 일과 위치가 미리 정해진 일은 다릅니다. 전자는 위치 목록과 분기, 메모리 접근이 필요할 수 있습니다. 후자는 정해진 위치의 계수만 인자로 받아 같은 연산 순서를 실행할 수 있습니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-5"><h2 className="text-2xl font-bold">6. 계수의 값과 0 아닌 위치 집합에 이름을 붙입니다</h2>
<p>w² 앞의 7처럼 각 거듭제곱에 붙은 숫자는 계수입니다. 0인 칸까지 전부 저장하면 밀집 표현, 0 아닌 위치와 값만 저장하면 희소 표현이라고 합니다. 영어 sparse는 여기서 희소하다는 뜻입니다.</p>
<p>0 아닌 계수의 위치 집합을 support라고 부릅니다. 지금 A의 support는 0·1·2·3이고 B는 0·2입니다. B의 차수는 2이지만 예시의 저장 공간은 네 칸입니다. 최고 지수와 확보한 배열 길이를 구분합니다.</p>
<p>두 입력의 지수를 더해 같은 출력 위치에 곱을 모으는 계산은 계수의 합성곱입니다. 확장체에서는 높은 지수를 정해진 관계식으로 되돌리는 축약도 필요합니다. 앞 글의 <Link className="text-primary hover:underline" to="/cs/crypto/extension-fields#layout">기저와 계수 배열</Link>이 그 위치의 의미를 정합니다.</p>
</section>
<section id="why-sparse" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">7. 곱할 쌍의 수와 출력의 0 아닌 칸 수를 구분합니다</h2>
<ExplainedFormula question="어느 두 입력 계수를 어느 출력에 더하나요?" idea="wⁱ와 wʲ를 곱하면 wⁱ⁺ʲ가 됩니다. 0 아닌 두 위치를 골라 곱하고 지수 합이 같은 출력에 모읍니다."
formula={String.raw`c_k=\sum_{i\in S_A,\ j\in S_B,\ i+j=k}a_i b_j`}
annotatedFormula={String.raw`\begin{gathered}c_k=\sum_{\substack{i\in S_A,\ j\in S_B\\i+j=k}}a_i b_j\\N_{\rm pairs}=|S_A||S_B|\\c_2=3\cdot5+1\cdot7=22\\N_{\rm pairs}=4\cdot2=8\end{gathered}`}
operations={[{expression:String.raw`i+j=k`,annotation:["두 항의 지수를 더해 출력 칸을 정합니다."]},{expression:String.raw`c_3=4\cdot5+2\cdot7=34`,annotation:["같은 출력에 도착한 두 곱을 합합니다."]}]}
terms={[{symbol:"S_A,S_B",name:"0 아닌 계수의 위치 집합",description:"지금 크기는 각각 4와 2입니다."},{symbol:"c_k",name:"wᵏ의 출력 계수",description:"같은 지수 합을 가진 모든 부분 곱을 더합니다."},{symbol:"a_i,b_j",name:"선택한 두 입력 계수",description:"A의 i번 칸과 B의 j번 칸에 저장된 값입니다."},{symbol:"N_{\\mathrm{pairs}}",name:"곱할 위치 쌍의 수",description:"두 support의 크기를 곱합니다. 출력 칸 수나 실측 시간이 아닙니다."}]}
assumptions={["계수의 0 여부가 정확하고 두 배열이 같은 지수 순서를 사용합니다.","여기서는 곱할 위치 쌍을 세며 덧셈·축약·메모리 비용은 따로 봅니다."]} interpretation="네 칸씩 모두 순회하는 16쌍과 0 아닌 8쌍을 비교한 것입니다. 결과는 여섯 칸이며 실행 시간이 정확히 절반이라는 뜻은 아닙니다." />
<p>서로 다른 곱이 같은 자리에 도착하면 합쳐집니다. 서로 지워질 수도 있습니다. 예를 들어 보통 다항식에서 (1+w)(1−w)는 네 쌍을 곱하지만 가운데 w 항이 사라져 1−w²만 남습니다. 계수의 덧셈과 나머지 규칙까지 적용한 뒤에야 출력 support를 알 수 있습니다.</p>
</section>
<section id="how-sparse" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">8. 같은 다항식을 실제 여섯 칸의 순서로 옮깁니다</h2>
<p>이제 실제 BN254의 체에서 같은 A와 B를 계산합니다. 규칙은 u²=−1, v³=9+u, w²=v입니다. 각 칸은 a+bu인 Fq2 원소이고 이번 작은 정수 계수는 b=0인 특별한 경우입니다. 큰 바탕 소수는 앞의 확장체 구현 글과 같습니다.</p>
<p>코드의 여섯 칸 순서는 1,v,v²,w,vw,v²w입니다. w만으로 쓰면 지수 순서는 0·2·4·1·3·5입니다. 따라서 A의 코드 배열은 [1,3,0,2,4,0]입니다. B=5+7w²=5+7v는 [5,7,0,0,0,0]이 됩니다.</p>
<p>같은 출력도 w의 순서로는 [5,10,22,34,21,28]이지만 코드 순서로는 [5,22,21,10,34,28]입니다. 숫자를 바꾼 것이 아니라 같은 값의 계수 위치를 바꾼 것입니다. 아직 w⁶ 이상의 항이 없어서 축약이 결과를 섞지는 않습니다.</p>
</section>
<section id="source" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">9. 원본 014 함수에 같은 5·7·0을 넣습니다</h2>
<p>arkworks algebra의 commit 7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c를 고정합니다. ark-ff와 ark-ec는 0.5.0이고 별도 curves workspace의 ark-bn254는 0.5.0-alpha.0입니다. 함수 mul_by_014는 여섯 칸 중 0·1·4번의 계수를 인자로 받습니다.</p>
<CodeViewButton label="원본 mul_by_014 · 93–112행" onClick={()=>sidebar.open("014",codeRefs["014"])} />
<p>같은 A를 두 묶음 A0=[1,3,0], A1=[2,4,0]으로 나눕니다. 이번 인자는 c0=5, c1=7, c4=0입니다. 원문의 aa는 A0(5+7v)=[5,22,21]이고 bb는 A1·0v=0입니다.</p>
<p>다음 합의 곱은 (A0+A1)(5+7v)=[3,7,0](5+7v)=[15,56,49]입니다. 여기서 aa와 bb를 빼면 위 묶음 [10,34,28]을 얻습니다. 아래 묶음은 aa 그대로입니다. 따라서 여덟 손계산과 같은 [5,22,21,10,34,28]이 나옵니다.</p>
<CodeViewButton label="원본 아래층 mul_by_01 · 111–152행" onClick={()=>sidebar.open("01",codeRefs["01"])} />
<CodeViewButton label="이 글에서 실제 실행한 비교 프로그램" onClick={()=>sidebar.open("experiment",codeRefs.experiment)} />
<p>이는 이 BN254 체에서 014 함수가 올바른 곱을 계산한다는 예입니다. 이 숫자들이 실제 Miller 선의 계수라거나 BN254 Miller가 014를 선택한다는 뜻은 아닙니다. 실제 호출의 선택은 12절에서 별도로 확인합니다.</p>
<div id="paper-arkworks-sparse-source"><CitationBlock source="arkworks algebra · 7ad88c46 · 같은 계수의 희소 곱" citeKey={1} href="https://github.com/arkworks-rs/algebra/blob/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ff/src/fields/models/fp12_2over3over2.rs">두 위층 함수와 아래층 함수를 원문 그대로 보존했습니다. 같은 입력의 중간 aa·bb·합의 곱과 최종 출력을 직접 다항식 전개 및 일반 곱에 대조해 실행했습니다.</CitationBlock></div>
</section>
<section id="reduction" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">10. 빈 칸 하나에 11을 넣으면 높은 항이 되돌아옵니다</h2>
<p>A를 유지하고 B에 11w³만 더해 봅시다. 이제 코드의 4번 칸인 vw의 계수가 11입니다. 함수 인자는 014(5,7,11)이 됩니다. 원래 출력에 11w³A=11w³+22w⁴+33w⁵+44w⁶을 더해야 합니다.</p>
<ExplainedFormula question="w⁶의 44는 사라지나요?" idea="높은 항을 버리지 않고 같은 체의 관계식으로 낮은 항에 더합니다. w⁶=v³=9+u이므로 첫 출력 계수에 기여합니다."
formula={String.raw`w^6=\xi=9+u`}
annotatedFormula={String.raw`\begin{gathered}w^2=v,\quad v^3=\xi=9+u\\44w^6=44(9+u)=396+44u\\5+44w^6=401+44u\end{gathered}`}
operations={[{expression:String.raw`(34+11)w^3=45w^3`,annotation:["원래 출력과 새 부분 곱의 같은 지수를 더합니다."]},{expression:String.raw`(21+22)w^4+(28+33)w^5`,annotation:["나머지 두 계수는 43과 61이 됩니다."]}]}
terms={[{symbol:"ξ",name:"v³을 되돌리는 값",description:"이 고정 BN254 구성에서는 9+u입니다."}]}
assumptions={["같은 u·v·w와 계수 순서를 유지합니다.","11이 생긴 입력을 예전 c4=0으로 계산하면 다른 값을 곱한 것입니다."]} interpretation="새 출력의 코드 배열은 [401+44u,22,43,10,45,61]입니다. 실수 부분만 있던 입력에서도 축약 뒤 u 계수가 생겼습니다." />
<p>원문에서도 aa=[5,22,21]은 그대로입니다. bb=A1·11v=[0,22,44]이고 합의 곱은 [3,7,0](5+18v)=[15,89,126]입니다. 이 합에서 aa와 bb를 빼 위 묶음 [10,45,61]을 얻습니다.</p>
<p>아래 묶음은 aa에 v·bb를 더합니다. v를 곱하면 [C0,C1,C2]는 [ξC2,C0,C1]이 됩니다. 이번 v·bb는 [44ξ,0,22]라서 아래 묶음이 [401+44u,22,43]으로 완성됩니다.</p>
<CodeViewButton label="원본 한 자리 곱 mul_by_1 · 83–109행" onClick={()=>sidebar.open("1",codeRefs["1"])} />
<CodeViewButton label="원본 v를 곱하는 자리 이동 · 26–36행" onClick={()=>sidebar.open("shift",codeRefs.shift)} />
</section>
<section id="twist" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">11. 같은 세 인자를 034에 넣으면 다른 값을 곱합니다</h2>
<p>014(5,7,11)은 5+7v+11vw입니다. 034(5,7,11)은 5+7w+11vw입니다. 두 번째 인자 7이 놓이는 칸이 다릅니다. 함수가 같은 Fq2 인자 세 개를 받는다는 사실만으로 서로 바꿀 수 없습니다.</p>
<CodeViewButton label="원본 mul_by_034 · 70–91행" onClick={()=>sidebar.open("034",codeRefs["034"])} />
<p>같은 A에 034의 값을 곱하면 a=A0·5=[5,15,0], b=A1(7+11v)=[14,50,44]입니다. 합의 곱 e=(A0+A1)(12+11v)=[36,117,77]에서 a와 b를 빼면 위 묶음 [17,52,33]을 얻습니다.</p>
<p>아래 묶음은 a+vb=[401+44u,29,50]입니다. 따라서 034의 출력은 [401+44u,29,50,17,52,33]입니다. 014의 출력과 다른 이유는 최적화의 오차가 아니라 곱한 값 자체가 다르기 때문입니다.</p>
</section>
<section id="in-miller" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">12. 실제 BN254의 선 곱셈은 D형과 034로 연결됩니다</h2>
<p>Miller 계산은 누적값을 제곱하고 선의 값을 곱하는 과정을 반복합니다. 선의 계수는 곡선 위 점을 두 배로 하거나 다른 점을 더하는 계산에서 나옵니다. 누적값은 일반적인 여섯 계수지만 선의 값은 선택한 곡선 표현에서 일부 위치만 채웁니다.</p>
<ExplainedFormula question="희소 곱셈이 Miller의 어느 계산을 바꾸나요?" idea="누적값의 제곱을 유지하면서 선을 곱하는 한 단계를 같은 값의 전용 함수로 계산합니다. 점 갱신과 마지막 지수 계산은 별도입니다."
formula={String.raw`f_{i+1}=f_i^2\ell_i(P)`}
annotatedFormula={String.raw`\begin{gathered}f_{i+1}=f_i^2\ell_i(P)\\\ell_i(P)=c_0+c_3w+c_4vw\\f_{i+1}=\operatorname{mul\_by\_034}\\(f_i^2;c_0,c_3,c_4)\end{gathered}`}
operations={[{expression:String.raw`c_0\gets c_0 P_y,\quad c_3\gets c_3 P_x`,annotation:["고정 BN 원문의 D형 경로는 선의 앞 두 계수에 G1 점의 y·x를 곱합니다."]}]}
terms={[{symbol:"f_i",name:"지금까지의 누적값",description:"각 반복에서 선의 값을 누적한 확장체 원소입니다."},{symbol:"ℓ_i(P)",name:"점 P에서 계산한 선의 값",description:"표시한 034 위치는 이 원문의 D형 표현에 해당합니다."}]}
assumptions={["실제 곡선·기저·계수 순서와 선 계산이 같은 구성을 사용합니다.","추가 선을 곱하는 반복과 시작·마지막 처리는 원문의 전체 반복문을 따릅니다."]} interpretation="원문의 signed loop에서는 비트에 따라 선 하나를 더 곱합니다. 희소 곱 하나를 바꾼다고 반복 횟수나 부분군 검사·final exponentiation이 없어지지 않습니다." />
<p>원본 bn.rs는 M형이면 014, D형이면 034를 선택합니다. 같은 commit의 BN254 설정은 D형입니다. 따라서 앞의 014 손계산은 유효한 산술 예이지만 이 곡선의 실제 선 호출은 034입니다.</p>
<CodeViewButton label="원본 선의 D/M 분기 · 183–201행" onClick={()=>sidebar.open("ell",codeRefs.ell)} />
<CodeViewButton label="원본 BN254의 D형 설정 · 15–36행" onClick={()=>sidebar.open("config",codeRefs.config)} />
<CodeViewButton label="원본 Miller 누적 반복 · 51–102행" onClick={()=>sidebar.open("miller",codeRefs.miller)} />
<p>실제 검증에는 표준 생성원 G1=(1,2)와 G2를 넣었습니다. 라이브러리가 준비한 같은 선 87개를 사용하되 각 희소 곱을 독립적인 w 다항식 곱으로 바꾸어 누적했습니다. 그 누적값이 원본 multi_miller_loop와 같은지 확인했습니다. 선의 생성 공식 자체는 공통 원문을 사용하므로 그 부분까지 독립 구현한 검증은 아닙니다.</p>
</section>
<section id="paper-comparison" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">13. 논문의 같은 세 위치를 원문 중간값에 대입합니다</h2>
<p>Grewal·Azarderakhsh·Longa·Hu·Jao의 ARM 프로세서 페어링 논문에서 Algorithm 5는 a0+a1w+a2vw 형태를 다룹니다. 이는 여기의 034 위치입니다. 같은 5·7·11과 A를 넣으면 첫 세 곱의 묶음 [5,15,0], 아래 희소 곱 [14,50,44], 합의 곱 [36,117,77]이 대응합니다.</p>
<p>Algorithm 6의 아래층 예에서는 (7+11v)(2+4v)를 계산합니다. 직접 곱 14와 44, 합의 곱 (7+11)(2+4)=108로 가운데 계수 108−14−44=50을 얻습니다. 다른 두 계수는 14와 44여서 앞의 [14,50,44]와 같습니다.</p>
<p>원문의 전용 함수도 같은 대수 결과를 만들지만 덧셈과 축약 순서까지 논문과 같다는 뜻은 아닙니다. 논문의 계수체·축약 방식·기기별 수치를 현재 코드나 기기의 시간으로 옮기지 않습니다.</p>
<div id="paper-efficient-bilinear-pairings"><CitationBlock source="Grewal et al. · Efficient Implementation of Bilinear Pairings on ARM Processors · Algorithms 5·6" citeKey={2} href="https://eprint.iacr.org/2012/408">공식 PDF의 3.1절과 Algorithms 5·6을 읽고 같은 034 입력의 중간 곱을 대응시켰습니다. 이 글의 계수 순서와 알고리즘의 입력을 대응했으며 논문의 기기별 시간 측정을 재현한 것은 아닙니다.</CitationBlock></div>
</section>
<section id="cost-saving" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">14. 여덟 부분 곱, 열세 함수 호출, 전체 시간은 다른 장부입니다</h2>
<p>첫 사례의 8은 다항식의 0 아닌 위치 쌍입니다. 고정 원문의 014는 mul_by_01 두 번과 mul_by_1 한 번을 사용합니다. 아래 함수에 적힌 일반 Fq2 곱은 각각 5회와 3회이므로 합은 5+3+5=13회입니다. 034도 직접 세 곱과 아래 함수 두 번으로 3+5+5=13회입니다.</p>
<p>일반 Fq12 곱은 위층의 세 Fq6 곱과 각 Fq6의 여섯 Fq2 곱으로 18회를 호출합니다. 이는 여섯 칸을 모두 곱한 36쌍과도 다른 알고리즘입니다. 전용 함수의 인자가 우연히 0이라고 이 호출 장부에서 해당 곱을 자동으로 지우지는 않습니다.</p>
<p>이 장부에는 ξ 같은 상수 곱과 덧셈·축약·메모리 접근 비용이 따로 남습니다. 컴파일된 명령이나 실제 시간은 또 확인해야 합니다. 이 글에서는 속도를 측정하지 않았습니다.</p>
<ExplainedFormula question="한 부분이 두 배 빨라지면 전체도 두 배 빨라지나요?" idea="기준 시간을 100으로 두고 바뀌지 않는 60과 최적화 대상 40을 나누어 계산합니다. 대상만 절반이면 새 시간은 60+20입니다."
formula={String.raw`S=\frac{1}{(1-f)+f/s}`}
annotatedFormula={String.raw`\begin{gathered}T_{\rm new}=T((1-f)+f/s)\\S=T/T_{\rm new}\\S=\frac1{(1-f)+f/s}\\f=0.4,\quad s=2\\S=100/80=1.25\end{gathered}`}
operations={[{expression:String.raw`100(1-0.4)=60`,annotation:["변경하지 않은 구간의 시간입니다."]},{expression:String.raw`100\cdot0.4/2=20`,annotation:["가정상 두 배 빨라진 구간의 새 시간입니다."]}]}
terms={[{symbol:"T,T_{\\mathrm{new}}",name:"기준 시간과 변경 후 시간",description:"같은 작업을 처리할 때의 두 시간을 뜻합니다. 여기서는 가정한 100과 80입니다."},{symbol:"f",name:"기준 시간 중 대상 비율",description:"여기서는 설명용 0.4이며 실제 프로파일 측정값이 아닙니다."},{symbol:"s",name:"대상 구간의 속도 배수",description:"가정은 2입니다. 전체 속도 배수 S와 다릅니다."}]}
assumptions={["나머지 구간과 처리할 작업량이 그대로이고 추가 비용이 없는 모형입니다.","그 밖에 추가 비용만 생긴다면 1.25는 상한입니다. 다른 구간도 빨라지면 이 모형으로 그 변화까지 설명하지 못합니다."]} interpretation="부분 곱 개수가 줄었다는 사실만으로 s를 알 수는 없습니다. 정확성이 같은 구현을 같은 기기에서 측정한 뒤 전체 시간을 비교해야 합니다." />
</section>
<section id="boundaries" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">15. 0을 찾는 분기와 사라진 입력은 별도로 확인합니다</h2>
<p>전용 함수의 세 인자에는 나머지 세 칸이 없습니다. 따라서 0이어야 할 칸에 실제 값이 생겼어도 함수가 자동으로 발견해 주지는 않습니다. 검증에서는 014 입력의 2번 칸에 1을 추가한 일반 곱과 세 인자만 받은 결과가 다름을 확인했습니다.</p>
<p>비밀 계수의 0 여부에 따라 곱을 건너뛰면 실행 경로나 시간이 그 위치를 드러낼 수 있습니다. 수학적 출력이 같다는 검사만으로 이런 누출을 검증할 수는 없습니다. 공개된 고정 위치를 같은 순서로 처리하는 설계와 비밀 값마다 실행을 바꾸는 설계를 구분해야 합니다.</p>
<p>이 글의 비교는 계수 산술과 호출 위치를 확인한 것입니다. 실제 보안 판단에는 입력 검증, 상수 시간 구현과 생성된 기계어의 검토가 추가됩니다. 정해진 호출 순서만 보았다고 구현 전체의 상수 시간을 증명했다고 말하지 않습니다.</p>
</section>
<section id="release" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">16. 같은 값과 위치를 맞춘 뒤 전체 계산을 비교합니다</h2>
<p>실제 Rust에서는 두 패턴에 대해 36개 기저 곱과 32개 추가 밀집 입력을 일반 곱·직접 w 다항식 곱에 대조했습니다. 0·1 입력 네 경우와 잘못된 위치 두 경우도 확인했습니다. 같은 작은 A의 두 중간 계산은 별도 assertion으로 보존했습니다.</p>
<p>생성원의 Miller 누적 비교는 선 곱셈을 바꿨을 때 같은 결과인지 확인합니다. 마지막 지수 계산과 전체 페어링은 실행하지 않았습니다. 성능 측정도 하지 않았으므로 13회와 18회의 호출 수를 실제 속도 비율로 읽지 않습니다.</p>
<ReviewPrompts questions={["같은 B의 마지막 0을 11로 바꾸면 w⁶의 항은 어디로 가나요? 예전 출력에서 어느 계수가 달라지나요? (답: 10절)","같은 5·7·11을 014와 034에 넣으면 각각 어떤 값을 곱하나요? 실제 BN254의 선 호출은 어느 쪽인가요? (답: 11·12절)","부분 곱 16쌍이 8쌍이 되었는데 왜 전용 함수 장부에는 13회가 나오고 전체 시간은 두 배가 아닐 수 있나요? (답: 7·14절)"]} />
<ContentBoundary article="sparse-multiplication" />
</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{ark:{id:"ark",label:"arkworks · 7ad88c46 원문",badgeClass:"bg-sky-50 border-sky-300 text-sky-800"},check:{id:"check",label:"본문의 실제 산술 검증",badgeClass:"bg-emerald-50 border-emerald-300 text-emerald-800"}}} />
</article>}
