import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ButterflyCaseViz from "./viz/ButterflyCaseViz";
import { fftCodeRefs } from "./codeRefs";
const CT="https://web.stanford.edu/class/cme324/classics/cooley-tukey.pdf";
export default function FFTArticle(){const sidebar=useCodeSidebar();return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6"><h2 className="text-2xl font-bold">1 · 네 숫자를 다시 쓰면서 같은 계산을 덜 한다</h2>
<p className="text-lg leading-8">
            일정한 간격으로 기록한 네 값이 1, 2, 3, 4입니다. 이 기록을 그대로 보관할 수도 있고 네 가지 회전 규칙에 얼마나 맞는지 계산해 보관할 수도 있습니다. 두 번째
            표현에서도 원래 네 값을 되찾을 수 있습니다. 값이 수백만 개가 되면 이 표현을 만드는 계산을 어떻게 나눌지가 중요해집니다.
          </p>
<p>
            이 글에서는 네 값을 바꾸지 않고 끝까지 따라갑니다. 먼저 직접 계산해 답을 확인하고 두 묶음의 작은 계산으로 같은 답을 만듭니다. 실제 C 구현은 어떤 묶음을 선택하는지
            확인한 뒤 음성 입력과 언어 모델에서 이 계산이 맡는 서로 다른 역할을 살펴봅니다.
          </p></section>
<section id="black-box" data-teach-level="B" className="space-y-6"><h2 className="text-2xl font-bold">2 · 순서가 있는 값들을 받아 회전별 합을 돌려준다</h2>
<p>입력은 순서가 정해진 네 값입니다. 출력도 네 자리지만 각 자리에는 가로와 세로 성분을 함께 적습니다. 첫 출력은 값을 모두 그대로 더한 합입니다. 다른 출력에서는 각 위치의 값을 정해진 방향으로 돌려 놓고 더합니다. 같은 입력에 같은 회전 규칙을 쓰면 출력은 하나로 정해집니다.</p>
<p>계산에 필요한 것은 네 값과 그 순서입니다. 기록을 초당 몇 번 했는지는 나중에 출력의 자리를 물리적인 진동수로 읽을 때 필요합니다. 숫자 배열만 변환할 때는 초라는 단위가 없어도 됩니다. 문장의 위치를 섞는 계산에서도 이 구분이 유용합니다.</p>
<p>되돌릴 때는 반대 방향으로 돌려 더하고 네 값의 개수로 나눕니다. 출력의 가로 성분만 남기거나 길이만 저장하면 그 되돌리기가 일반적으로 불가능합니다. 이 글에서 처음 계산하는 출력은 두 성분을 모두 보존한 것입니다.</p>
<p>계산을 더 빠르게 나누는 일은 출력의 정의를 바꾸지 않습니다. 다만 컴퓨터는 유한한 자리수로 계산하므로 덧셈 순서가 달라지면 마지막 자리의 반올림은 달라질 수 있습니다. 수학적으로 같은 변환을 계산한다는 말과 모든 비트가 같다는 말은 따로 확인해야 합니다.</p></section>
<section id="case" data-teach-level="0" className="space-y-6"><h2 className="text-2xl font-bold">3 · 1, 2, 3, 4에 네 가지 방향 규칙을 적용한다</h2>
<p>초당 8번 기록해 1, 2, 3, 4를 얻었다고 합시다(가정). 첫 값의 시각을 0초로 잡으면 나머지는 1/8초, 2/8초, 3/8초에 기록했습니다. 네 칸에 배정한 시간 폭은 4/8=0.5초이고 첫 표본과 마지막 표본의 시각 차이는 3/8초입니다. 이 두 길이를 혼동하지 않겠습니다.</p>
<p>첫 번째 규칙은 아무것도 돌리지 않습니다. 네 값은 모두 오른쪽을 향하므로 가로 합은 1+2+3+4=10이고 세로 합은 0입니다. 결과를 두 성분으로 적으면 (10,0)입니다.</p>
<p>두 번째 규칙은 위치가 한 칸 늘 때마다 오른쪽에서 아래쪽으로 90도씩 돌립니다. 네 값의 방향은 오른쪽, 아래쪽, 왼쪽, 위쪽입니다. 가로에서는 1−3=−2, 세로에서는 −2+4=2가 남습니다. 결과는 (−2,2)입니다.</p>
<p>세 번째 규칙은 한 칸마다 180도씩 돌립니다. 방향은 오른쪽과 왼쪽을 번갈아 가므로 가로 합은 1−2+3−4=−2이고 세로 합은 0입니다. 네 번째 규칙은 한 칸마다 270도씩 돌립니다. 가로 합은 다시 −2지만 세로 합이 2−4=−2가 되어 (−2,−2)입니다.</p>
<p>이렇게 얻은 네 결과는 (10,0), (−2,2), (−2,0), (−2,−2)입니다. 같은 네 입력에 네 규칙을 적용해 얻은 실제 결과입니다. 둘째와 넷째 결과는 가로가 같고 세로의 부호만 반대입니다.</p>
<p>비교를 위해 입력이 모두 1이었다고 해 봅시다. 첫 합은 4입니다. 두 번째 규칙에서는 오른쪽과 왼쪽, 위쪽과 아래쪽이 각각 상쇄됩니다. 세 번째와 네 번째도 상쇄되어 나머지 합은 모두 0입니다. 일정한 기록은 첫 자리에만 남는다는 사실을 직접 확인했습니다.</p>
<p>첫 합 10만 저장해서는 원래 네 값을 되찾지 못합니다. 4, 3, 2, 1도 같은 합을 만들기 때문입니다. 나머지 세 출력은 위치별 차이를 기록합니다. 전체 합과 위치별 차이를 함께 보관해야 입력의 순서를 구별할 수 있습니다.</p>
<p>되돌리는 계산도 첫 위치부터 해 보겠습니다. 네 출력의 가로 성분을 그대로 더하면 10−2−2−2=4입니다. 세로 성분은 0+2+0−2=0으로 상쇄됩니다. 이 가로 합 4를 출력 개수 4로 나누면 첫 입력 1이 돌아옵니다. 다른 입력의 기여를 없애고 첫 입력만 네 번 모은 결과입니다.</p>
<p>둘째 입력을 되찾을 때는 출력의 순서가 한 칸 늘 때마다 이번에는 위 방향으로 90도씩 돌립니다. 첫 출력은 (10,0)을 유지하고 둘째는 (−2,2)에서 (−2,−2)로 바뀝니다. 셋째는 반 바퀴 돌아 (2,0)이 되고 넷째는 세 번 돌아 (−2,2)가 됩니다. 네 가로 성분의 합은 8이고 세로 합은 0이라 4로 나누면 둘째 입력 2입니다.</p>
<p>같은 방식으로 한 칸마다 반 바퀴 돌려 더하면 셋째 입력에 해당하는 가로 합 12가 남습니다. 한 칸마다 위 방향으로 270도씩 돌리면 넷째 입력의 가로 합 16이 남습니다. 각각 4로 나누면 3과 4입니다. 한 출력만 읽어 원래 한 위치를 얻는 것이 아니라 네 출력을 함께 사용합니다.</p>
<p>이 복원에서 출력의 세로 성분을 빼 버리면 둘째 입력은 달라집니다. 둘째 출력과 넷째 출력에서 회전 후 생겨야 할 가로 −2가 각각 0이 되어 가로 합이 12가 됩니다. 나누기까지 마치면 2 대신 3입니다. 출력의 길이나 가로 막대만 보는 요약과 두 성분을 보관하는 계산을 구별해야 하는 이유입니다.</p>
<p>측정한 값이 실수인데 출력에 세로 성분을 추가했다고 해서 독립 정보가 갑자기 두 배가 되는 것도 아닙니다. 이번 출력에서 둘째와 넷째의 세로 성분은 서로 반대이고 첫째와 셋째의 세로 성분은 0입니다. 원래 네 값을 담는 다른 표현 안에 이런 관계가 함께 들어 있습니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-6"><h2 className="text-2xl font-bold">4 · 두 묶음의 합과 차이를 만든 뒤 함께 쓴다</h2>
<p>같은 네 값을 이번에는 위치 0과 2의 묶음, 위치 1과 3의 묶음으로 나눕니다. 첫 묶음의 값은 1과 3이라 합 4, 차 −2입니다. 둘째 묶음은 2와 4라 합 6, 차 −2입니다. 네 결과를 처음부터 따로 구하는 대신 이 중간값들을 나눠 씁니다.</p>
<ButterflyCaseViz />
<p>전체 합은 두 묶음의 합을 더한 4+6=10입니다. 세 번째 출력은 같은 두 합을 뺀 4−6=−2입니다. 두 출력을 위해 1+3과 2+4를 다시 계산할 필요가 없습니다.</p>
<p>둘째 출력에서는 첫 묶음의 차 −2를 가로에 놓습니다. 둘째 묶음의 차 −2는 아래 방향으로 90도 돌려 세로 +2로 놓습니다. 더하면 (−2,2)이고 같은 두 값을 빼면 넷째 출력 (−2,−2)입니다. 한 번 돌린 값을 더하기와 빼기에 함께 썼습니다.</p>
<p>그림의 선은 서로 다른 계산 사이에서 값을 전달하는 관계를 나타냅니다. 선이 교차한다고 두 값이 곱해지는 것은 아닙니다. 중간값 하나가 두 출력으로 가는 곳이 바로 다시 계산하지 않고 재사용하는 곳입니다.</p></section>
<section id="why" data-teach-level="2" className="space-y-6"><h2 className="text-2xl font-bold">5 · 반 바퀴 떨어진 두 출력은 같은 중간값을 공유한다</h2>
<p>재사용은 우연한 숫자 덕분이 아닙니다. 한 출력에서 두 칸 떨어진 출력으로 옮기면 위치가 짝수인 값의 방향은 그대로이고 홀수인 값의 방향만 반대로 됩니다. 그래서 앞서 만든 두 묶음에서 한쪽은 유지하고 다른 쪽만 더하기에서 빼기로 바꿀 수 있습니다.</p>
<p>우리 입력에서 1이나 4를 다른 수로 바꾸어도 이 방향 관계는 유지됩니다. 값이 달라지면 중간 합과 차는 달라지지만 같은 중간값을 두 출력에 쓰는 규칙은 그대로입니다. 정해진 회전의 주기에서 얻은 계산 절약입니다.</p>
<p>입력이 여덟 개라면 짝수 위치 네 개와 홀수 위치 네 개를 각각 처리합니다. 각 네 개의 계산도 앞에서 본 두 묶음으로 나눌 수 있습니다. 길이가 절반이 되는 단계를 반복하고 마지막에 결과를 결합하면 됩니다. 두 입력을 완전히 따로 저장해야 하는지, 어느 순서로 읽을지는 실제 구현이 정합니다.</p>
<p>작은 묶음으로 나누었다고 모든 비용이 사라지지는 않습니다. 각 단계에서 값을 읽고 회전시키고 더해야 합니다. 데이터 이동과 작업 공간도 필요합니다. 작은 입력에서는 준비 비용이 더 클 수 있으므로 계산 횟수의 증가율만으로 실제 시간 배율을 말하지 않습니다.</p>
<p>이제 세 가지 역할을 구별할 수 있습니다. 회전별 합이라는 결과의 정의, 중간값을 재사용하는 계산 방법, 시간 단위를 붙여 결과를 해석하는 측정 조건입니다. 다음 절에서 이름을 붙이고 일반식과 실제 코드를 같은 네 값으로 확인하겠습니다.</p></section>
<section id="names" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">6 · 표현, 계산 방법, 측정 조건에 이름을 붙인다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">앞에서 본 역할</th><th className="p-3">이름과 표기</th></tr></thead><tbody>{[
["각 시각에 기록한 값 / 회전별로 얻은 값","표본 x[n] / 주파수 계수 X[k]"],["가로와 세로를 함께 보관한 수","복소수 a+bi; i²=−1"],["N개의 값을 N개의 회전별 합으로 변환","이산 푸리에 변환, DFT"],["같은 DFT를 중간값 재사용으로 계산","고속 푸리에 변환, FFT"],["짝수·홀수 묶음을 더하고 빼서 결합","radix-2 분할과 butterfly"],["결합할 때 방향을 맞추는 회전값","twiddle factor, ω_N^k"],["초당 표본 수 / 결과의 자리","표본률 f_s / 주파수 bin k"],["유한 구간에 곱하는 가중치 / 구간을 옮기는 간격","창 window / hop H"],["유한 관측의 한 성분이 여러 bin에 퍼짐 / 창 스펙트럼의 중심과 주변","spectral leakage / main lobe와 side lobe"],
].map((r,i)=><tr key={i} className="border-t border-border">{r.map((v,j)=><td key={j} className="p-3 align-top">{v}</td>)}</tr>)}</tbody></table></div>
<p>우리 네 출력은 X=[10,−2+2i,−2,−2−2i]입니다. 이 글은 순방향 지수의 부호를 음수로, 역변환의 배율을 1/N으로 정합니다. 다른 규약을 쓰는 원문이나 라이브러리에서는 부호와 배율을 따로 맞춥니다.</p></section>
<section id="fourier" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">7 · 모든 복소 계수를 보관하면 네 값을 되찾는다</h2>
<p>일반 DFT는 입력에 길이 1인 회전값을 곱해 더합니다. k=1, N=4이면 회전값은 1, −i, −1, i입니다. 따라서 1−2i−3+4i=−2+2i가 됩니다. 복소 지수는 앞에서 사용한 네 방향을 짧게 적은 것입니다.</p>
<ExplainedFormula question="회전별 합에서 원래 값을 어떻게 복원하나요?" idea="반대 회전으로 다시 더하면 목표 위치의 기여는 N번 모이고 다른 위치의 기여는 상쇄됩니다. 마지막에 N으로 나눕니다." formula={String.raw`X[k]=\sum_{n=0}^{N-1}x[n]e^{-2\pi i kn/N}`}
annotatedFormula={String.raw`\begin{gathered}X[k]=\sum_{n=0}^{N-1}x[n]e^{-2\pi i kn/N}\\x[n]=\frac1N\sum_{k=0}^{N-1}X[k]e^{2\pi i kn/N}\\X[1]=1-2i-3+4i=-2+2i\\x[0]=\tfrac14(10-2+2i-2-2-2i)=1\end{gathered}`}
operations={[{expression:String.raw`\sum_{k=0}^{N-1}e^{2\pi i k(n-m)/N}=\begin{cases}N&n=m\\0&n\ne m\end{cases}`,annotation:["0부터 N−1 사이의 위치를 비교합니다. 같은 위치는 모두 1을 더하고 다른 위치는 원 위의 회전들이 상쇄됩니다."]}]}
terms={[{symbol:"n,k",name:"위치와 bin",description:"둘 다 0부터 N−1까지의 정수입니다."}]}
assumptions={["N은 양의 정수이며 모든 N개 복소 계수를 보관합니다.","가역성은 정확한 산술의 성질입니다. 구현에는 반올림 오차가 있습니다."]} interpretation="이 유한 벡터의 역변환은 원래의 연속 신호가 무엇이었는지와 무관하게 정의됩니다. 연속 신호 복원에는 9절의 별도 측정 조건이 필요합니다." />
<ProgressiveDetail title="서로 다른 회전의 합이 0인 이유와 연속 변환" preview="유한 등비급수로 역변환을 확인하고 연속 시간의 적분식은 별도 조건에서 읽습니다."><p>n≠m이면 r=exp(2πi(n−m)/N)은 1이 아니지만 rᴺ=1입니다. 등비급수의 합 (1−rᴺ)/(1−r)이 0이므로 원하지 않는 위치가 사라집니다. 역변환 식에 X의 정의를 넣고 두 유한 합의 순서를 바꾸면 이 합이 나타나 원래 x[n]만 남습니다.</p>
<ExplainedFormula question="연속 시간의 푸리에 변환은 무엇이 다른가요?" idea="유한한 N개 위치의 합 대신 전체 시간과 전체 각주파수에 대한 적분을 사용합니다. 적분이 성립하는 조건도 추가됩니다." formula={String.raw`\widehat x(\omega)=\int_{\mathbb R}x(t)e^{-i\omega t}\,dt`}
annotatedFormula={String.raw`\widehat x(\omega)=\int_{\mathbb R}x(t)e^{-i\omega t}\,dt,\qquad x(t)=\frac1{2\pi}\int_{\mathbb R}\widehat x(\omega)e^{i\omega t}\,d\omega`}
operations={[{expression:String.raw`\omega=2\pi f`,annotation:["초당 회전 수 f를 라디안 단위의 각주파수 ω로 바꾸면 역식에 1/(2π)가 붙는 규약입니다."]}]}
terms={[{symbol:String.raw`\omega`,name:"각주파수",description:"단위는 rad/s입니다. 유한 배열의 정수 bin과 구별합니다."}]}
assumptions={["예를 들어 x와 그 변환이 모두 절대 적분 가능하면 역식은 x의 연속점에서 성립합니다.","일반 제곱 적분 함수는 L² 의미의 극한으로, 순수 정현파 등은 분포의 틀로 다룹니다."]} interpretation="연속 변환의 모든 신호에 적분식을 점별로 무조건 적용하거나, 유한 DFT가 연속 신호 전체를 유일하게 정한다고 해석하지 않습니다." /></ProgressiveDetail>
</section>
<section id="phase" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">8 · 막대 높이만 남기면 위치 정보가 사라진다</h2>
<p>계수의 길이는 진폭 크기인 magnitude이고 방향은 phase입니다. −2+2i의 길이는 √8이고 방향은 3π/4입니다. −2−2i는 같은 길이에 방향만 다릅니다. 실수 입력에서는 X[N−k]가 X[k]의 켤레이므로 이 두 값이 짝을 이룹니다.</p>
<p>입력을 [1,4,3,2]로 바꾸면 출력은 [10,−2−2i,−2,−2+2i]입니다. 네 길이는 원래와 완전히 같지만 입력 순서는 다릅니다. 따라서 높이만 보이는 스펙트럼 그림은 유용한 요약이어도 일반적인 입력 복원에 충분하지 않습니다. 제곱한 길이인 power도 같은 정보를 잃습니다.</p>
<ExplainedFormula question="표현을 바꿔도 제곱합은 어떻게 대응하나요?" idea="우리 순방향 변환은 정규화하지 않았으므로 계수의 제곱 크기 합에 1/N을 곱해야 입력의 제곱합과 같습니다." formula={String.raw`\sum_n|x[n]|^2=\frac1N\sum_k|X[k]|^2`}
annotatedFormula={String.raw`\sum_{n=0}^{N-1}|x[n]|^2=\frac1N\sum_{k=0}^{N-1}|X[k]|^2,\qquad 1+4+9+16=\frac{100+8+4+8}{4}=30`}
operations={[{expression:String.raw`|-2+2i|^2=(-2)^2+2^2=8`,annotation:["복소수의 두 성분을 각각 제곱해 더합니다. 실수 부분만 제곱한 4와 다릅니다."]}]}
terms={[{symbol:"|X[k]|^2",name:"계수의 제곱 크기",description:"물리적 전력의 단위로 읽으려면 표본률과 정규화 규약까지 밝혀야 합니다."}]}
assumptions={["7절의 DFT 배율을 유지합니다."]} interpretation="이 Parseval 관계는 에너지 장부가 맞는지 확인하는 방법입니다. 제곱합 하나만 같다고 두 입력이 같아지는 것은 아닙니다." />
</section>
<section id="nyquist-boundary" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">9 · bin의 번호와 실제 진동수를 구별한다</h2>
<p>표본률 8 Hz, 길이 4라면 인접한 bin의 간격은 8/4=2 Hz입니다. 전체 복소 출력을 음수 주파수까지 표기하는 흔한 규약에서는 네 bin을 0, 2, −4, −2 Hz로 읽습니다. 마지막 자리를 6 Hz라고 적어도 표본 위의 회전은 −2 Hz와 같으므로 별개로 구별한 성분이 아닙니다.</p>
<p>짝수 길이의 가운데 bin은 −4 Hz와 +4 Hz가 같은 표본 회전입니다. 실수 입력의 절반 스펙트럼은 이를 +4 Hz로 표시할 수 있습니다. 두 독립 bin이 있는 것은 아닙니다. 홀수 길이에는 정확히 표본률의 절반인 bin이 없습니다. 실수 입력의 DC와 짝수 길이의 이 가운데 계수는 실수입니다.</p>
<ExplainedFormula question="서로 다른 연속 진동이 왜 같은 표본을 만들 수 있나요?" idea="정수 표본 시각에서 회전 수가 정수만큼 더해져도 같은 위치로 돌아옵니다. 표본률만큼 떨어진 주파수는 같은 복소 표본을 만듭니다." formula={String.raw`e^{2\pi i(f+mf_s)n/f_s}=e^{2\pi i fn/f_s}`}
annotatedFormula={String.raw`\begin{gathered}e^{2\pi i(f+mf_s)n/f_s}=e^{2\pi i fn/f_s},\quad m,n\in\mathbb Z\\f_s=8000:\quad\cos(2\pi\cdot7000n/8000)\\=\cos(2\pi n-2\pi n/8)=\cos(2\pi\cdot1000n/8000)\end{gathered}`}
operations={[{expression:String.raw`\sin(\pi n)=0\quad(n\in\mathbb Z)`,annotation:["정확히 표본률의 절반인 사인파는 위상에 따라 표본이 모두 0이 됩니다. 경계를 무조건 포함한 복원 주장은 성립하지 않습니다."]}]}
terms={[{symbol:"f_s/2",name:"Nyquist 주파수",description:"일반적인 저역 신호 표집에서 구별 가능한 대역의 경계입니다."}]}
assumptions={["기본 복원 정리는 신호의 대역이 엄격히 |f|<f_s/2에 있고, 이상적인 양방향 무한 균일 표본을 안다는 조건으로 읽습니다.","실제 측정은 표집 전에 높은 주파수를 줄이는 anti-alias 필터와 여유 대역이 필요합니다."]} interpretation="이미 같은 표본으로 겹친 1 kHz와 7 kHz는 FFT를 더 정확히 계산해도 구별하지 못합니다. 네 표본만으로 측정 전의 연속 신호 전체가 유일하게 정해지지도 않습니다." />
</section>
<section id="window" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">10 · 창은 입력을 바꾸고 0 채우기는 평가 자리를 늘린다</h2>
<p>긴 신호에서 유한한 구간을 선택하는 일은 그 밖의 값을 0으로 만드는 창을 곱하는 일입니다. 이 곱은 주파수 쪽에서 창의 스펙트럼과 섞입니다. 한 진동이 여러 bin에 퍼져 보이는 spectral leakage는 이런 유한 관측에서 생깁니다. 구간을 주기적으로 이어 붙였을 때의 불연속은 이를 이해하는 한 방법이지만 모든 경우를 끝점 값 하나로 판정할 수는 없습니다.</p>
<p>양 끝의 비중을 줄이는 Hann 창은 직사각 창보다 먼 쪽으로 새는 side lobe를 낮추는 대신 중심의 main lobe를 넓힙니다. 가까운 두 진동을 구별하는 능력과 약한 성분을 보는 능력이 함께 달라집니다. 창을 바꿨다면 진폭 보정도 따로 확인해야 합니다.</p>
<ExplainedFormula question="같은 네 표본에 창을 곱하면 무엇이 달라지나요?" idea="길이 4의 주기형 Hann을 각 위치에 곱합니다. 이 정의의 마지막 가중치는 0이 아니라 1/2입니다." formula={String.raw`w[n]=\tfrac12\left(1-\cos\frac{2\pi n}{N}\right)`}
annotatedFormula={String.raw`\begin{gathered}w[n]=\tfrac12(1-\cos(2\pi n/N)),\quad 0\le n<N\\N=4:\quad w=[0,1/2,1,1/2],\quad xw=[0,1,3,2]\\\operatorname{DFT}(xw)=[6,-3+i,0,-3-i]\end{gathered}`}
operations={[{expression:String.raw`2\cdot\tfrac12=1,\qquad4\cdot\tfrac12=2`,annotation:["두 번째와 네 번째 표본의 비중을 절반으로 줄입니다. 원래 입력의 무손실 표현을 계산한 것이 아닙니다."]}]}
terms={[{symbol:"w[n]",name:"창 가중치",description:"분모 N−1을 쓰는 대칭형 Hann과 구별합니다."}]}
assumptions={["여기서는 주기형 정의를 사용합니다."]} interpretation="주 입력의 합 10이 창을 곱한 뒤 6이 됩니다. 창을 붙여도 원래 계수가 그대로라는 설명은 틀립니다." />
<p>반면 [1,2,3,4] 뒤에 0 네 개를 붙여 길이 8로 계산하면 같은 유한 기록의 스펙트럼을 1 Hz 간격에서 평가합니다. 원래 2 Hz 간격보다 촘촘하지만 새로 측정한 값은 없습니다. 실제 관측창의 폭은 여전히 0.5초입니다. 가까운 두 성분의 구별 능력이 새 관측을 두 배 얻은 것처럼 좋아지지는 않습니다.</p>
</section>
<section id="algorithm" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">11 · 짝수와 홀수 위치의 변환을 재사용한다</h2>
<p>ω_N=exp(−2πi/N)으로 적겠습니다. 길이 N이 짝수이면 짝수 위치와 홀수 위치의 길이 N/2 변환을 각각 E와 O라고 할 수 있습니다. 주 사례에서는 E=[4,−2], O=[6,−2]이며 ω₄=−i입니다.</p>
<ExplainedFormula question="같은 두 중간값으로 어떻게 두 출력을 만드나요?" idea="짝수 위치의 회전은 길이 절반의 회전이 됩니다. 홀수 위치에서는 그 회전 밖으로 ω_N^k 하나가 빠져나옵니다." formula={String.raw`X[k]=E[k]+\omega_N^kO[k]`}
annotatedFormula={String.raw`\begin{gathered}E[k]=\sum_{r=0}^{N/2-1}x[2r]\omega_{N/2}^{kr},\quad O[k]=\sum_{r=0}^{N/2-1}x[2r+1]\omega_{N/2}^{kr}\\X[k]=E[k]+\omega_N^kO[k],\quad X[k+N/2]=E[k]-\omega_N^kO[k]\\X[1]=-2+(-i)(-2)=-2+2i,\quad X[3]=-2-2i\end{gathered}`}
operations={[{expression:String.raw`\omega_N^{2kr}=\omega_{N/2}^{kr},\qquad\omega_N^{k+N/2}=-\omega_N^k`,annotation:["첫 식은 두 작은 변환을 만들고 둘째 식은 같은 회전곱을 더하기와 빼기에 함께 쓰게 합니다."]}]}
terms={[{symbol:"E[k],O[k]",name:"두 작은 DFT",description:"짝수·홀수 위치를 따로 모은 입력의 변환입니다."}]}
assumptions={["0≤k<N/2입니다. 이 분할을 길이 1까지 반복하는 radix-2는 N=2ᵐ을 가정합니다."]} interpretation="k=0에서도 X[0]=4+6=10과 X[2]=4−6=−2를 함께 만듭니다. 입력을 버리는 근사가 아니라 같은 유한 합의 재배열입니다." />
<ProgressiveDetail title="반 칸 떨어진 출력에서 왜 빼기가 나오는가" preview="E와 O의 주기와 회전값의 부호를 각각 확인합니다."><p>원래 합에서 n=2r와 n=2r+1을 분리하면 홀수 항은 ω_N^k를 공통 인자로 꺼낼 수 있습니다. k에 N/2를 더해도 E와 O는 자신의 길이 N/2만큼 한 주기를 돌아 같은 값입니다. 바깥 인자만 exp(−πi)=−1을 더 곱하므로 덧셈이 뺄셈으로 바뀝니다.</p></ProgressiveDetail>
</section>
<section id="paper-cooley-tukey" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">12 · 원 논문의 분해식에 같은 네 값을 넣는다</h2>
<p>Cooley–Tukey의 1965년 논문 297쪽 식 (1)·(2)는 W=exp(+2πi/N)을 사용합니다. 여기의 순방향 부호와 반대입니다. 같은 실수 입력 A=[1,2,3,4]를 그대로 넣으면 X=[10,−2−2i,−2,−2+2i]가 나옵니다. 부호를 맞추면 앞의 결과와 일치하며 서로 다른 답이라고 오해하지 않을 수 있습니다.</p>
<CitationBlock source="Cooley–Tukey 1965, 297–298쪽 식 (3)–(8)" href={CT} citeKey={1}>
<p>논문은 N=r₁r₂로 두고 입력과 출력의 인덱스를 두 자리로 나눕니다. 298쪽 식 (6)의 중간 배열을 식 (7)에서 다시 사용하며 식 (8)은 T=N(r₁+r₂)로 연산 장부를 적습니다. 이 장부의 한 연산은 복소 곱 뒤의 덧셈입니다.</p></CitationBlock>
<p>N=4, r₁=r₂=2를 대입하면 식 (6)의 두 열은 [4,−2]와 [6,−2]입니다. 식 (7)에서 j₀=1에 붙는 회전이 +i이므로 −2+(+i)(−2)=−2−2i가 됩니다. 우리가 사용한 −i 규약으로 바꾸면 −2+2i입니다. 같은 중간 배열을 원문의 인덱스와 부호에 맞춰 읽은 것입니다.</p>
<p>이 작은 길이에서 원문 장부는 4(2+2)=16이고 직접 계산의 4²=16과 같습니다. 크기가 커질 때의 증가율이 핵심이며 길이 4부터 그 장부의 횟수가 반드시 줄어드는 것은 아닙니다. 실제 코드는 1이나 ±i와의 곱을 생략하거나 더하기로 바꾸기도 합니다.</p>
</section>
<section id="complexity" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">13 · 단계마다 N만큼 일하고 단계는 log₂N개다</h2>
<p>radix-2는 길이 절반인 두 변환을 계산하고 길이 N에 비례하는 결합을 수행합니다. 각 단계 전체의 결합량은 N에 비례하고 길이가 1이 될 때까지 단계 수는 log₂N입니다. 그래서 직접 합산의 N² 증가율이 NlogN으로 바뀝니다.</p>
<ExplainedFormula question="분할했는데 계산이 다시 N²개로 늘지 않는 이유는 무엇인가요?" idea="각 깊이에서 모든 작은 문제의 길이를 합하면 N입니다. 그 깊이가 log₂N개라 총 결합량은 Nlog₂N에 비례합니다." formula={String.raw`T(N)=2T(N/2)+cN`}
annotatedFormula={String.raw`\begin{gathered}T(N)=2T(N/2)+cN,\quad N=2^m\\T(N)=\Theta(N\log_2N),\quad T(1)=\Theta(1)\\N=2^{20}:\quad N^2=2^{40},\quad N\log_2N=20\cdot2^{20}\end{gathered}`}
operations={[{expression:String.raw`\underbrace{N+N+\cdots+N}_{\log_2N\ \text{단계}}=N\log_2N`,annotation:["각 단계에서 합산한 길이를 셉니다. 초 단위 시간이나 모든 종류의 기계 명령을 센 값은 아닙니다."]}]}
terms={[{symbol:"c",name:"결합 비용 상수",description:"가정한 연산 단위에서 길이 하나당 드는 비용입니다."}]}
assumptions={["radix-2와 상수 시간 산술 모형을 사용합니다.","작업 공간 할당, 캐시, 병렬 장치와 정밀도에 따른 시간 차이는 별도 측정합니다."]} interpretation="N=2²⁰의 두 수는 증가율 비교입니다. 둘을 나눠 실제 장치의 속도 향상 배율이라고 보고할 수는 없습니다." />
<p>반복형 radix-2의 일부 구현은 이진 인덱스를 뒤집는 bit reversal 순서를 사용합니다. 예를 들어 길이 8에서 001은 100으로 바뀌어 위치 1과 4가 대응합니다. 모든 FFT가 같은 재배열을 하거나 진짜 제자리 계산을 하는 것은 아닙니다. 혼합 radix는 다른 작은 인수를 함께 쓰고, 소수 길이를 처리하는 Rader·Bluestein 계열도 있습니다. 길이가 2의 거듭제곱이어야 한다는 조건은 모든 FFT의 조건이 아닙니다.</p>
</section>
<section id="implementation" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">14 · 실제 KISS FFT는 네 갈래 계산을 한 번 선택한다</h2>
<p>고정한 KISS FFT commit e5e3fac46e0d94a8f8170c06706b7a4218828333의 C 원문에 같은 네 입력을 넣었습니다. 기본 float 형식을 쓰고 FIXED_POINT와 USE_SIMD는 정의하지 않았습니다. 공개 헤더의 한 복소 값은 r과 i 두 필드이고 내부 상태에는 길이, 역방향 여부, 분해 기록, 회전값 표가 있습니다.</p>
<p><a href="https://github.com/mborgerding/kissfft/blob/e5e3fac46e0d94a8f8170c06706b7a4218828333/kiss_fft.c" className="text-primary underline">고정한 KISS FFT C 원문</a>과 헤더의 원본 파일, 라이선스를 아래 코드 패널과 함께 보존했습니다.</p>
<CodeViewButton label="실제 상태와 배율 매크로" onClick={()=>sidebar.open("state",fftCodeRefs.state)} />
<p>kiss_fft_alloc(4,0,...)은 길이 4와 순방향을 저장하고 회전표를 만듭니다. kf_factor는 인수 4부터 시도하므로 분해 기록은 [4,1]입니다. kf_work는 p=4, m=1을 읽고 입력 네 값을 복사한 뒤 kf_bfly4를 부릅니다. 설명에서 사용한 두 단계의 radix-2 경로를 실제로 실행했다고 말하면 틀립니다.</p>
<CodeViewButton label="실제 인수 선택과 분기" onClick={()=>sidebar.open("factor",fftCodeRefs.factor)} />
<p>이 경로는 m=1이라 첫 회전값이 모두 1입니다. scratch[0], scratch[1], scratch[2]에는 2, 3, 4가 들어갑니다. 이어 scratch[5]=1−3=−2, 첫 출력의 임시 값은 1+3=4, scratch[3]=2+4=6, scratch[4]=2−4=−2가 됩니다.</p>
<p>원문의 다음 연산은 세 번째 출력을 4−6=−2로, 첫 출력을 4+6=10으로 만듭니다. 순방향 분기에서 둘째 출력의 실수부는 −2+0=−2, 허수부는 0−(−2)=2입니다. 넷째는 −2−2i가 됩니다. 계산 그래프는 다르지만 같은 네 복소 출력입니다.</p>
<CodeViewButton label="radix-4 원문에 네 값을 대입" onClick={()=>sidebar.open("butterfly",fftCodeRefs.butterfly)} />
<p>원문을 수정하지 않고 글의 C 호출 예제와 함께 CPU에서 컴파일해 이 출력을 확인했습니다. 테스트는 실수부와 허수부를 각각 10⁻⁵ 허용오차로 비교합니다. 이 네 값의 실행 결과를 확인한 것이며 모든 길이·정밀도의 정확성이나 GPU 성능을 측정한 결과는 아닙니다.</p>
<CodeViewButton label="실제로 실행한 호출 예제" onClick={()=>sidebar.open("run",fftCodeRefs.run)} />
</section>
<section id="implementation-boundary" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">15 · 역변환 배율과 메모리 약속도 원문에서 확인한다</h2>
<p>같은 계수를 역방향 상태에 넣으면 이 float 경로의 원시 출력은 [4,8,12,16]입니다. inverse 플래그는 회전 방향을 바꾸지만 자동으로 1/4를 곱하지 않습니다. 호출자가 네 값을 각각 4로 나누면 [1,2,3,4]로 돌아옵니다. 함수 이름에 inverse가 있다는 사실만으로 배율 규약을 알 수는 없습니다.</p>
<p>butterfly에 보이는 C_FIXDIV(...,4)는 현재 float 빌드에서 아무 연산도 하지 않는 매크로입니다. 고정소수점 빌드는 다른 정의를 사용합니다. 코드 한 줄을 읽을 때 실제 전처리 조건을 생략하면 이 나눗셈을 잘못 설명하게 됩니다.</p>
<p>입력과 출력에 같은 포인터를 주는 실험도 같은 결과를 냈습니다. 그러나 원문은 이 경우 임시 배열을 할당해 계산한 뒤 memcpy로 돌아와 복사합니다. 같은 배열을 API에 전달할 수 있다는 사실과 추가 배열 없는 제자리 알고리즘이라는 사실은 다릅니다. 원문 자체의 주석도 이 차이를 명시합니다.</p>
<CodeViewButton label="같은 포인터일 때 임시 배열 사용" onClick={()=>sidebar.open("alias",fftCodeRefs.alias)} />
<p>실제 제품에서는 배열 길이와 할당 성공, 정밀도 범위, 입출력 배율과 메모리 한도를 함께 확인합니다. 수학의 가역성은 버퍼 범위를 벗어난 접근이나 유한 형식의 overflow까지 막아 주지 않습니다.</p>
</section>
<section id="convolution" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">16 · 필터를 적용할 때는 꼬리가 앞쪽으로 돌아오지 않게 한다</h2>
<p>같은 입력 [1,2,3,4]에 현재 값에서 직전 값을 빼는 필터 h=[1,−1]을 적용해 봅시다(가정). 입력 밖은 0으로 놓으면 전체 선형 합성곱은 [1,1,1,1,−4]입니다. 마지막 −4는 입력이 끝난 다음 위치에 남은 필터의 기여입니다.</p>
<p>길이 4 DFT끼리 곱하고 역변환하면 길이 4의 원형 합성곱 [-3,1,1,1]이 나옵니다. 마지막 −4가 첫 값 1에 돌아와 더해졌기 때문입니다. 이 결과는 원형 연산에는 맞지만 원하는 선형 연산에는 틀립니다.</p>
<ExplainedFormula question="주파수별 곱셈으로 선형 합성곱을 계산하려면 무엇이 필요한가요?" idea="DFT의 기본 곱셈 정리는 원형 합성곱입니다. 선형 출력 전체가 들어갈 만큼 0을 채워야 앞뒤가 겹치지 않습니다." formula={String.raw`\operatorname{DFT}_M(x\circledast_Mh)=XH`}
annotatedFormula={String.raw`\begin{gathered}(x\circledast_Mh)[n]=\sum_{m=0}^{M-1}x[m]h[(n-m)\bmod M]\\\operatorname{DFT}_M(x\circledast_Mh)[k]=X[k]H[k]\\M\ge L_x+L_h-1:\quad x*h=\operatorname{IDFT}_M(XH)\ \text{의 앞 }L_x+L_h-1\text{개}\\L_x=4,\ L_h=2:\quad M\ge5\end{gathered}`}
operations={[{expression:String.raw`4+2-1=5,\qquad5+3-1=7`,annotation:["주 사례와 별도의 길이 5·3 사례에서 선형 출력의 최소 공간을 셉니다. 실행에 빠른 길이를 골라 더 크게 채워도 됩니다."]}]}
terms={[{symbol:String.raw`\circledast_M`,name:"길이 M의 원형 합성곱",description:"인덱스가 끝을 넘으면 나머지 위치로 돌아옵니다."}]}
assumptions={["두 입력을 같은 길이 M까지 0으로 채우고 7절과 맞는 역배율을 사용합니다.","신경망 라이브러리의 correlation, 커널 뒤집기, stride와 crop 규약은 따로 맞춰야 합니다."]} interpretation="주 사례는 M=8로 계산한 뒤 앞 5개를 골라도 됩니다. 인과적 길이 4 출력만 원하면 그 다음에 앞 4개를 고릅니다. 먼저 길이 4 원형 연산을 해서는 같은 결과가 되지 않습니다." />
<ProgressiveDetail title="곱셈 정리를 합의 순서로 확인하기" preview="원형 인덱스를 바꿔 두 독립된 유한 합으로 분리합니다."><p>DFT 정의에 원형 합성곱을 넣으면 n과 m의 이중 합이 됩니다. r=(n−m) mod M으로 바꾸면 n은 m+r과 같은 나머지를 가지므로 회전값은 ω_M^(k(m+r))=ω_M^(km)ω_M^(kr)입니다. 두 유한 합을 분리하면 (Σx[m]ω_M^(km))(Σh[r]ω_M^(kr))=X[k]H[k]가 됩니다. 0 채우기 길이가 충분하면 이 원형 연산에서 꼬리가 앞쪽으로 겹치지 않아 선형 연산과 일치합니다.</p></ProgressiveDetail>
<p>직접 연산은 대략 입력 길이와 필터 길이의 곱에 비례하고 FFT 방식은 변환과 역변환, 임시 복소 배열을 필요로 합니다. 짧은 필터나 작은 입력은 직접 연산이 빠를 수 있습니다. 긴 신호를 블록으로 처리하는 방법에서도 블록 경계의 겹침을 정확히 처리해야 합니다.</p>
</section>
<section id="ai-usage" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">17 · 긴 음성은 짧은 구간을 옮겨 가며 변환한다</h2>
<p>한 번의 DFT는 그 구간 전체를 섞습니다. 긴 음성에서 어느 시각에 어떤 소리가 났는지를 보려면 창을 옮기며 구간마다 계산합니다. 이 시간별 변환이 STFT입니다. 창의 길이는 한 번에 보는 범위를, hop은 다음 구간으로 옮기는 간격을 정합니다.</p>
<ExplainedFormula question="25 ms를 보면서 10 ms씩 옮긴다는 말은 무엇인가요?" idea="표본 수를 표본률로 나누면 시간입니다. 서로 다른 두 표본 수 N과 H가 서로 다른 역할을 합니다." formula={String.raw`S[m,k]=\sum_{n=0}^{N-1}x[mH+n]w[n]e^{-2\pi i kn/N}`}
annotatedFormula={String.raw`\begin{gathered}S[m,k]=\sum_{n=0}^{N-1}x[mH+n]w[n]e^{-2\pi i kn/N}\\f_s=16000,\quad N=400,\quad H=160\\N/f_s=25\ \mathrm{ms},\quad H/f_s=10\ \mathrm{ms},\quad f_s/N=40\ \mathrm{Hz}\end{gathered}`}
operations={[{expression:String.raw`1/16000=62.5\ \mathrm{\mu s},\qquad f_s/2=8000\ \mathrm{Hz}`,annotation:["표본 사이 시간과 이상적인 저역 표집의 경계를 함께 계산합니다. 40 Hz의 bin 간격과 8 kHz의 경계는 다른 양입니다."]}]}
terms={[{symbol:"m",name:"구간 번호",description:"이 식에서는 구간의 왼쪽을 mH에 둡니다. 라이브러리의 중심 정렬과 가장자리 padding은 별도 규약입니다."}]}
assumptions={["각 구간에 같은 창을 곱합니다.","전체 파형으로 되돌리려면 복소 계수, 겹침, 창의 합성 조건과 경계 처리가 맞아야 합니다."]} interpretation="구간 길이가 길수록 주파수 구조를 자세히 볼 여지는 늘지만 시간에 따른 짧은 변화가 한 구간에 섞입니다. hop을 줄이는 것과 실제 주파수 구별 능력을 높이는 것은 같지 않습니다." />
</section>
<section id="paper-whisper-frontend" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">18 · Whisper 원문은 복소 계수 뒤에서 정보를 더 줄인다</h2>
<p>Whisper 논문 3쪽 §2.2는 16 kHz 입력과 25 ms 창, 10 ms 이동, 당시 80개 Mel 채널을 설명합니다. 앞 절의 400과 160은 이 시간을 표본 수로 바꾼 값입니다. 공식 구현에서 이 설정 다음에 이어지는 연산까지 확인하겠습니다.</p>
<CitationBlock source="Whisper 논문 §2.2와 고정한 공식 구현" href="https://cdn.openai.com/papers/whisper.pdf" citeKey={2}><p>논문의 시간 설정을 그대로 대입하면 400/16000=0.025초, 160/16000=0.01초입니다. 공식 audio.py의 commit 86098128c0b4f24f0e2aa2994de830614b474227에는 N_FFT=400과 HOP_LENGTH=160이 있고 Mel 필터는 80개 또는 128개를 허용합니다.</p></CitationBlock>
<CodeViewButton label="Whisper의 실제 창·제곱 크기·Mel·로그" onClick={()=>sidebar.open("whisper",fftCodeRefs.whisper)} />
<p>원문은 Hann 창으로 torch.stft를 호출하고 abs() ** 2를 계산합니다. 변수 이름 magnitudes만 보고 길이 자체라고 읽으면 안 됩니다. 실제 값은 길이의 제곱입니다. 우리 작은 Hann 결과 [6,−3+i,0,−3−i]에서 전체 복소 배열의 제곱 크기는 [36,10,0,10]입니다. 실수 입력의 한쪽 스펙트럼만 쓰면 [36,10,0]입니다. 이는 길이 4에 연산 의미를 대입한 예이며 Whisper가 길이 4를 사용한다는 뜻은 아닙니다.</p>
<p>stft[..., :-1]은 마지막 시간 구간을 제외합니다. 주파수 축의 마지막 bin을 없애는 코드가 아닙니다. PyTorch의 복소 STFT 출력에서 마지막 축은 시간 구간입니다. 입력 가장자리의 중심 정렬과 padding까지 포함한 형식은 사용하는 PyTorch 버전의 API와 함께 확인합니다.</p>
<p><a href="https://docs.pytorch.org/docs/2.14/generated/torch.stft.html" className="text-primary underline">PyTorch 2.14 STFT 문서</a>는 복소 출력의 마지막 두 축을 주파수와 시간으로 정의합니다. 고정한 Whisper 원문은 중심 정렬과 정규화 인자를 따로 지정하지 않으므로 해당 실행 환경의 기본값도 함께 읽어야 합니다.</p>
<p>다음 filters @ magnitudes는 여러 주파수의 제곱 크기를 Mel 필터별로 합칩니다. 이어 값의 하한을 10⁻¹⁰으로 놓고 상용로그를 취하며 최댓값보다 8 이상 낮은 로그값을 잘라 냅니다. 마지막은 (log_spec+4)/4입니다. 이런 특징값은 원래의 모든 복소 계수를 보관한 배열이 아니므로 일반적으로 파형으로 유일하게 돌아갈 수 없습니다.</p>
<p>여기서는 고정한 Python 원문을 읽어 연산 순서와 작은 수치 대입을 확인했습니다. Whisper 전체 모델이나 이 STFT 호출을 실행한 성능 실험은 하지 않았습니다.</p>
</section>
<section id="paper-fnet" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">19 · FNet은 같은 변환을 학습 가능한 선택 대신 섞기에 쓴다</h2>
<p>FNet 논문 4299쪽 식 (3)은 입력의 숨은 차원과 위치 차원에 DFT를 차례로 적용한 뒤 실수 부분만 취합니다. 두 변환을 모두 끝낸 다음 실수 부분을 남긴다는 순서도 원문에 명시되어 있습니다. 입력에 따라 달라지는 attention 가중치를 계산하는 연산과는 다른 구조입니다.</p>
<ExplainedFormula question="DFT가 가역이라면 FNet의 이 부분도 가역인가요?" idea="복소 변환 뒤의 실수 부분 선택은 별도의 정보 손실 연산입니다. 숨은 차원이 1인 작은 입력으로 그 차이를 확인합니다." formula={String.raw`y=\operatorname{Re}\!\left(\mathcal F_{seq}(\mathcal F_h(x))\right)`}
annotatedFormula={String.raw`\begin{gathered}y=\operatorname{Re}\!\left(\mathcal F_{seq}(\mathcal F_h(x))\right)\\x=[1,2,3,4]^\top\in\mathbb R^{4\times1}:\quad y=[10,-2,-2,-2]^\top\\\operatorname{IDFT}_4(y)=[1,3,3,3]^\top\ne x\end{gathered}`}
operations={[{expression:String.raw`\operatorname{Re}(-2+2i)=-2`,annotation:["허수 성분 +2를 버립니다. 이를 다시 0으로 채워 역변환해도 원래 입력을 되찾지 못합니다."]}]}
terms={[{symbol:String.raw`\mathcal F_h,\mathcal F_{seq}`,name:"두 축의 변환",description:"작은 4×1 예에서는 길이 1인 숨은 축의 변환이 항등입니다."}]}
assumptions={["논문 식 (3)의 mixer만 계산한 가정입니다.","실제 블록의 잔차 연결, 정규화와 feed-forward 층은 이 예에 포함하지 않았습니다."]} interpretation="원문 각주 4도 실수 부분만 쓴 변환은 가역이 아님을 구별합니다. 이 계산만으로 전체 FNet 블록의 정보 보존이나 품질을 단정하지 않습니다." />
<p><a href="https://aclanthology.org/2022.naacl-main.319.pdf" className="text-primary underline">FNet §3.2–3.3</a>은 고정 Fourier 섞기와 실제 구현을 함께 설명합니다. 당시 실험에서는 장치와 길이에 따라 FFT 대신 DFT 행렬곱을 택하기도 했습니다. 점근적으로 연산이 적다는 사실이 모든 장치·길이에서 가장 빠른 실행법을 정해 주지는 않습니다.</p>
</section>
<section id="paper-hyena" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">20 · Hyena는 긴 필터의 계산과 입력별 조절을 번갈아 적용한다</h2>
<p>Hyena v3 논문 6쪽 정의 3.1의 식 (4)는 필터 합성곱의 결과에 입력에서 만든 가중치를 위치별로 곱합니다. 8쪽 Algorithm 3은 이 과정을 반복합니다. FFT는 그 안의 긴 합성곱을 계산하는 수단이고 입력별 gate가 별도로 결과를 조절합니다.</p>
<ExplainedFormula question="같은 필터 결과도 입력별 gate가 다르면 무엇이 달라지나요?" idea="먼저 합성곱을 계산한 뒤 각 위치의 비중을 곱합니다. 필터를 빠르게 계산하는 방법과 결과를 조절하는 모델 구조를 분리합니다." formula={String.raw`z^{j+1}_t=g^j_t(h^j*z^j)_t`}
annotatedFormula={String.raw`\begin{gathered}z^1=v,\quad z^{j+1}_t=g^j_t(h^j*z^j)_t,\quad y=z^{J+1}\\v=[1,2,3,4],\quad h=[1,-1],\quad (h*v)_{0:4}=[1,1,1,1]\\g=[1,0,2,1]:\quad y=[1,0,2,1]\end{gathered}`}
operations={[{expression:String.raw`g_t(h*v)_t`,annotation:["각 위치에서 gate 값 하나를 곱합니다. 두 번째 위치는 0이 되고 세 번째 위치는 2배가 됩니다."]}]}
terms={[{symbol:"J",name:"반복 차수",description:"원문은 이 수를 N으로 쓰지만 이 글의 DFT 길이 N과 구별하려고 J로 적었습니다."}]}
assumptions={["원문 xʲ를 여기서는 gʲ로 옮겨 적었습니다. 일반 Hyena는 입력의 투영과 학습한 필터를 사용합니다.","숫자 예는 임의의 gate와 필터를 정한 한 단계이며 학습한 Hyena 실행이 아닙니다."]} interpretation="인과적 길이 4를 고를 때도 16절처럼 먼저 선형 합성곱을 정확히 계산합니다. FFT라는 이름만으로 gate나 학습된 긴 필터가 생기지는 않습니다." />
<p><a href="https://arxiv.org/pdf/2302.10866v3" className="text-primary underline">Hyena §3.1–3.4</a>의 필터는 위치를 받아 값을 만드는 작은 신경망과 창으로 매개화됩니다. FFT를 사용해도 모델의 필터와 투영은 학습합니다. 논문의 처리 시간은 정해진 차수·길이·장치와 비교 구현의 결과이며 모든 attention을 같은 품질로 대체한다는 보장은 아닙니다.</p>
</section>
<section id="limits" data-teach-level="7" className="space-y-6"><h2 className="text-2xl font-bold">21 · 어떤 것을 유지하고 어떤 것을 바꿨는지 먼저 묻는다</h2>
<p>
            같은 네 값의 DFT를 radix-2나 radix-4로 계산하면 목표 변환은 같습니다. 반면 창을 곱하면 입력이 바뀌고 크기나 실수 부분만 남기면 출력 정보를 줄입니다. 관측
            전에 생긴 alias는 더 좋은 FFT로 없앨 수 없습니다. 이 네 상황을 모두 빠른 주파수 변환이라는 말로 묶으면 결과를 잘못 해석하기 쉽습니다.
          </p>
<p>AI에서의 역할도 나눠 보겠습니다. STFT와 Mel은 입력 특징을 만듭니다. FFT 합성곱은 조건을 맞추어 동일한 선형 연산을 계산합니다. FNet은 고정된 변환과 실수 투영으로 위치를 섞습니다. Hyena는 학습 필터와 데이터에 따른 gate를 갖는 모델 구조 안에서 FFT를 사용합니다. 어느 역할인지 정한 뒤 품질, 정확성, 메모리, 지연 시간을 각각 확인합니다.</p>
<p>복소수와 위상은 <a className="text-primary underline" href="/cs/ai/math-complex-numbers-oscillations">복소수와 회전 글</a>에서, 반올림과 연산 순서의 차이는 <a className="text-primary underline" href="/cs/ai/math-numerical-precision-stability">수치 안정성 글</a>에서 이어 볼 수 있습니다. 이 글은 같은 유한 입력을 변환하고 실제 구현에 대입하는 경계를 담당합니다.</p>
</section>
<section id="review" data-teach-level="7" className="space-y-6"><h2 className="text-2xl font-bold">22 · 조건을 바꾸고 결과를 먼저 예상해 본다</h2>
<ol className="list-decimal space-y-4 pl-5"><li>입력을 [1,4,3,2]로 바꾸면 원래 입력과 계수의 길이만 보고 구별할 수 있을까요? 서로 다른 입력이 같은 막대 높이를 만드는 이유를 설명하세요. (답: 8절)</li><li>같은 네 계수에 KISS FFT의 float 역방향 함수를 호출하면 바로 [1,2,3,4]가 나올까요? 입력과 출력 포인터가 같으면 작업용 배열도 필요 없을까요? (답: 15절)</li><li>길이 4 입력과 길이 2 필터를 길이 4 FFT로 곱한 첫 출력은 왜 1이 아니라 −3인가요? 길이 8로 늘려 계산한 뒤 어디까지 골라야 전체 선형 출력을 얻나요? (답: 16절)</li></ol>
</section><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={fftCodeRefs} fileTrees={{kissfft:{name:"kissfft",type:"dir",children:[{name:"kiss_fft.c",type:"file",path:"kissfft/kiss_fft.c",codeKey:"butterfly"},{name:"_kiss_fft_guts.h",type:"file",path:"kissfft/_kiss_fft_guts.h",codeKey:"state"}]},article:{name:"article",type:"dir",children:[{name:"verify_kiss.c",type:"file",path:"article/verify_kiss.c",codeKey:"run"}]},whisper:{name:"whisper",type:"dir",children:[{name:"audio.py",type:"file",path:"whisper/whisper/audio.py",codeKey:"whisper"}]}}} projectMetas={{kissfft:{id:"kissfft",label:"KISS FFT e5e3fac4",badgeClass:"border-border"},article:{id:"article",label:"실행한 호출 예제",badgeClass:"border-border"},whisper:{id:"whisper",label:"Whisper 86098128",badgeClass:"border-border"}}}/></article>;}
