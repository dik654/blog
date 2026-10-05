import {Link} from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import {CitationBlock} from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import {CodeSidebar,CodeViewButton,useCodeSidebar} from "@/components/code";
import {codeRefs,fileTrees,projectMetas} from "./codeRefs";
import OptimizationBudgetViz from "./viz/OptimizationBudgetViz";
const prose="prose prose-neutral max-w-none dark:prose-invert";
export default function OptimizationLayersArticle(){const sidebar=useCodeSidebar();const code=(key:string,label:string)=><div className="my-6"><CodeViewButton label={label} onClick={()=>sidebar.open(key,codeRefs[key])}/></div>;return <><div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">1. 무엇을 줄였는지부터 확인합니다</h2><div className={prose}>
<p>계산 하나를 두 배 빠르게 만들었다는 소식을 들으면 서비스의 답도 두 배 빨리 나올 것 같습니다. 그러나 그 계산 앞뒤에서 하는 일이 그대로 남아 있다면 전체 시간은 조금만 줄 수 있습니다. 빨라진 요청을 더 많이 처리해도 빌린 장치 수와 시간이 같다면 이번 달 청구액은 그대로일 수도 있습니다.</p>
<p>최적화를 선택하려면 세 질문을 나누어야 합니다. 사용자가 기다리는 시간은 얼마나 줄었는가, 장치가 같은 기간에 처리할 수 있는 일은 얼마나 늘었는가, 실제로 지불하는 비용은 얼마나 달라졌는가입니다. 세 숫자를 하나로 대신하면 작은 개선을 과장하거나 가치 있는 개선을 놓치게 됩니다.</p>
<p>이 글은 한 요청에 걸린 100 ms를 따라갑니다. 그중 한 계산을 줄이고 다른 계산과 함께 바꾸며 여러 요청이 같은 일을 나누어 쓰는 경우까지 살펴보겠습니다. 마지막에는 실제 설정과 측정 함수가 무엇을 바꾸고 무엇을 세는지 대조합니다. 특정 기법의 이름보다 먼저 효과를 계산하는 기준을 세우는 것이 목표입니다.</p>
</div></section>
<section id="black-box" data-teach-level="B" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">2. 요청에서 결과와 청구까지 이어 봅니다</h2><div className={prose}>
<p>큰 흐름의 입구에는 처리할 입력과 요구하는 답의 조건이 있습니다. 안쪽에서는 입력을 확인하고 관계를 계산한 뒤 값을 바꾸어 결과를 보냅니다. 출구에서 확인할 것은 답의 내용과 도착 시각입니다. 계산 장치를 얼마나 오래 확보했는지는 별도의 사용 기록과 청구서에서 확인합니다.</p>
<p>안쪽 계산을 바꾸었다면 같은 입력이 여전히 허용한 답을 만드는지 먼저 봅니다. 답을 대충 만들어 시간이 줄었다면 그것은 조건을 바꾼 비교입니다. 일정한 오차를 허용하기로 했다면 그 허용 범위를 변경 전에 정해 두어야 합니다. 계산을 빨리 끝내는 일과 문제를 덜 푸는 일을 같은 개선으로 세지 않기 위해서입니다.</p>
<p>시간을 재는 시작과 끝도 필요합니다. 요청을 보낸 때부터 결과를 모두 받은 때까지 잴 수도 있고 안쪽 계산만 잴 수도 있습니다. 앞에서 기다린 시간을 빼거나 아직 끝나지 않은 일을 제출한 시점에 시계를 멈추면 다른 숫자가 나옵니다. 하나의 비교 안에서는 같은 시작과 끝을 지켜야 합니다.</p>
<p>비용에는 또 다른 경계가 있습니다. 다른 요청과 계산을 함께 했다면 요청마다 같은 장치 시간을 전부 배정할 수 없습니다. 사용하지 않은 시간이 생겨도 장치를 계속 빌리고 있으면 그 시간의 요금은 남습니다. 먼저 요청의 경로를 정확히 읽고 그다음 사용 기록과 연결하겠습니다.</p>
</div></section>
<section id="case" data-teach-level="0" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">3. 100 ms에서 40 ms만 바꿔 봅니다</h2><div className={prose}>
<p>(가정) 입력 확인에 15 ms, 관계 계산에 40 ms, 값 변환에 35 ms, 결과 전송에 10 ms가 듭니다. 네 일이 이 순서대로 겹치지 않고 이어집니다. 다른 요청을 기다리는 시간은 없고 모든 출력 조건은 고정합니다. 이 합이 100 ms이며 특정 모델이나 장치에서 측정한 수치는 아닙니다.</p>
<p>관계 계산만 두 배 빠르게 만들면 40 ms가 20 ms로 줄어듭니다. 입력 확인은 15 ms에 끝나고 새 관계 계산은 35 ms에 끝납니다. 값 변환까지 70 ms, 전송까지 80 ms입니다. 계산 한 부분의 두 배와 요청 전체의 100/80=1.25 배는 다른 값입니다.</p>
<p>같은 부분을 열 배 빠르게 하면 4 ms만 들지만 나머지 60 ms는 남습니다. 끝나는 시각은 64 ms입니다. 그 계산을 거의 공짜로 만들어도 60 ms 아래로 내려갈 수 없습니다. 다른 일을 손대지 않는다는 조건에서 어떤 개선이 가장 크게 작용할지 미리 가늠할 수 있습니다.</p>
<p>이 계산에는 숨기면 안 되는 약속이 있습니다. 새 방식 때문에 별도 준비 5 ms가 생기면 두 배 개선의 결과는 80 ms가 아니라 85 ms입니다. 답이 틀려 같은 요청을 다시 처리해야 한다면 반복된 일도 더해야 합니다. 빨라진 부분만 기록해서는 전체 개선을 계산할 수 없습니다.</p>
<p>다른 후보가 마지막 전송 10 ms를 100배 빠르게 해서 0.1 ms로 만든다고 합시다. 전송만 보면 훨씬 큰 개선이지만 요청 전체는 90.1 ms입니다. 관계 계산을 두 배 빠르게 만든 80 ms보다 오래 걸립니다. 같은 100 ms에서 어느 부분이 차지한 시간이 큰지도 비교해야 하는 이유입니다.</p>
</div></section>
<section id="picture" data-teach-level="1" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">4. 줄어든 칸과 남은 칸을 같은 축에 놓습니다</h2><div className={prose}>
<p>그림의 각 막대는 같은 한 요청을 나타냅니다. 시작점은 0이고 네 칸의 길이를 더한 오른쪽 끝이 결과 도착 시각입니다. 둘째 칸만 줄일 때 나머지 세 칸을 그대로 두면 전체 20 ms가 어디서 사라졌는지 눈으로 확인할 수 있습니다.</p>
<p>둘째 칸이 절반이 되어도 첫째·셋째·넷째 칸이 함께 줄지는 않습니다. 반대로 새 준비가 붙으면 막대의 끝이 다시 오른쪽으로 이동합니다. 이름이 유명한 기법인지와 관계없이 이 두 변화를 모두 기록해야 합니다. 그림은 가장 단순한 순차 실행의 장부이며 동시 실행은 뒤에서 별도로 그립니다.</p>
<p>이 막대 하나는 요청 하나가 겪은 순서를 보여 줍니다. 여러 요청이 같은 계산을 함께 사용하는 경우에는 요청별 막대를 복사해도 계산 자체가 그만큼 늘어나는 것은 아닙니다. 기다림을 합할 것인지 실제로 수행한 일을 셀 것인지를 정해야 합니다. 뒤에서 같은 100→80 ms를 20개 요청이 공유하는 경우를 이 구별에 적용합니다.</p>
<p>바뀐 뒤에는 비율의 기준도 달라집니다. 관계 계산의 새 20 ms는 전체 80 ms의 25%입니다. 원래 값 40을 새 전체 80으로 나누어 50%라고 하면 변경 전후의 시간을 섞은 셈입니다. 다음 개선을 계산할 때는 바뀐 시간표에서 각 칸을 다시 읽습니다.</p>
</div><OptimizationBudgetViz /></section>
<section id="why" data-teach-level="2" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">5. 분류표와 시간표는 서로 다른 일을 합니다</h2><div className={prose}>
<p>일을 맡길 때는 바꿀 대상을 나누는 분류가 유용합니다. 계산 규칙을 바꾸는 사람, 같은 규칙을 장치에서 실행하는 사람, 여러 요청의 차례를 정하는 사람, 여러 장치에 일을 배치하는 사람이 함께 일할 수 있습니다. 이 분류는 누구와 무엇을 고칠지 찾는 지도입니다.</p>
<p>그 지도에서 같은 칸에 놓인 두 방법이 같은 시간을 줄인다는 보장은 없습니다. 실행 방법 하나가 관계 계산과 값 변환을 모두 바꿀 수 있고 요청을 묶는 방법은 계산량과 기다림을 동시에 바꿀 수 있습니다. 담당 영역의 이름만으로 앞의 40 ms가 정해지지는 않습니다.</p>
<p>변경 전후를 비교하는 시간표가 따로 필요한 이유가 여기 있습니다. 이번에는 정확히 어느 일이 바뀌었는지, 다른 일이 늘었는지, 동시에 하던 일이 있었는지를 기록합니다. 같은 20 ms 감소라도 어느 기록에서 나온 숫자인지 알아야 다른 요청과 합칠 수 있습니다.</p>
<p>결과를 받아들이는 기준도 미리 정합니다. 답의 허용 오차와 기다림의 한계가 있고 비용을 줄일 목표 기간이 있습니다. 지연이 이미 허용 범위 안이라는 이유만으로 더 빠른 응답의 가치가 사라지는 것은 아닙니다. 그 가치를 돈으로 환산하려면 사용자의 행동이나 업무 결과와 연결한 별도 근거가 필요합니다.</p>
<p>이제 작은 사례의 비교는 분명합니다. 같은 입력과 답 조건을 유지하고 전체 시간표에서 40 ms만 20 ms로 바꾸었습니다. 다음부터는 이런 변경 위치와 전체 시간의 관계에 이름을 붙입니다. 이름을 붙인 뒤에도 계산의 출발점은 같은 100 ms입니다.</p>
</div></section>
<section id="names" data-teach-level="3" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">6. 바꾸는 위치와 측정값에 이름을 붙입니다</h2><div className={prose}>
<p>학습된 모델로 답을 계산하는 일이 inference, 추론입니다. 요청을 보낸 뒤 답을 받기까지의 경과시간을 이 글에서는 end-to-end latency라고 부릅니다. 입력과 측정 경계를 고정했을 때 앞 사례의 100 ms와 80 ms가 여기에 해당합니다.</p>
</div><TermBreakdown title="역할 → 이름 → 사용 범위" items={[
{term:"Model · 모델",description:"계산 구조와 저장된 가중치 표현을 바꾸는 위치입니다.",example:"양자화·구조 변경",boundary:"출력 품질·메모리·실제 연산 경로가 함께 바뀔 수 있습니다."},
{term:"Kernel · 커널",description:"계산을 장치에서 실행하는 구현입니다. GPU는 여기서 그 계산 장치입니다.",example:"관계 계산 40→20 ms를 만드는 구현 교체",boundary:"여러 연산을 합치는 fusion은 한 시간 구간만 바꾸지 않을 수 있습니다."},
{term:"Runtime · 런타임",description:"실행할 작업의 제출·차례·요청 묶음·기록 관리를 맡습니다.",example:"batching은 여러 요청을 묶어 처리합니다.",boundary:"런타임 변경은 대기뿐 아니라 계산량과 장치 사용도 바꿉니다."},
{term:"System · 시스템",description:"여러 장치와 서비스 복사본에 요청과 데이터를 배치하는 범위입니다.",example:"replica는 독립적으로 요청을 처리하는 서비스 복사본입니다.",boundary:"한 복사본이 여러 GPU를 쓸 수 있고 전송·최소 복제수 제약이 있습니다."},
{term:"CUDA Graph · 작업 그래프",description:"미리 기록한 작업 목록을 재실행하는 제출 방식입니다.",example:"각각 제출하는 비용을 줄일 수 있습니다.",boundary:"기록의 주소·수명·크기와 지원 조건이 맞아야 합니다."},
{term:"PagedAttention · 블록별 기록",description:"앞서 계산한 기록을 고정 크기 블록에 나누어 관리하는 방식입니다.",example:"필요한 블록을 주소표로 찾습니다.",boundary:"마지막 블록의 빈자리와 주소표 비용은 남습니다."},
{term:"Prefix caching · 공통 입력 재사용",description:"같은 앞부분의 입력을 계산한 기록을 다음 요청에서도 사용합니다.",example:"반복된 입력의 일부 계산을 건너뜁니다.",boundary:"정확히 재사용할 수 있는 범위와 일치 조건을 지켜야 합니다."},
{term:"Speedup · 가속 배수",description:"같은 일의 변경 전 시간을 변경 후 시간으로 나눕니다.",example:"100/80=1.25 배",boundary:"처리량과 비용의 배수가 자동으로 같아지지는 않습니다."},
{term:"ROI · 투자수익률",description:"같은 기간의 편익에서 비용을 뺀 순편익을 그 비용으로 나눕니다.",example:"비용만큼 편익을 얻으면 0%입니다.",boundary:"편익/비용 비율은 1이며 두 정의를 구별합니다."}
]}/></section>
<section id="layers" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">7. 네 층은 변경 위치를 찾는 지도입니다</h2><div className={prose}>
<p>모델 층은 가중치의 정밀도나 계산 구조를 바꿉니다. 읽을 바이트와 연산량이 줄 수도 있지만 새 변환 연산이 생기거나 출력 품질이 달라질 수 있습니다. <Link to="/cs/ai/quantized-model-deployment">양자화 모델 배포</Link>에서는 작은 파일 크기와 실제 실행 성능을 나누어 확인합니다.</p>
<p>커널 층은 연산 하나의 구현을 바꾸거나 여러 연산을 합칩니다. 앞 사례에서는 관계 계산을 담당하는 attention 구현을 바꾸었다고 생각할 수 있습니다. 값 변환의 행렬곱도 같은 층에서 바꿀 수 있으므로 커널 층을 곧 40 ms라고 정의하면 안 됩니다. 연산 순서와 정밀도가 바뀌면 같은 수학식이어도 수치 결과를 확인합니다.</p>
<p>런타임 층은 제출 방식, 요청 묶음, 저장 공간과 이전 계산의 재사용을 바꿉니다. <Link to="/cs/ai/cuda-graph-capture">CUDA Graph</Link>는 기록한 작업의 재제출 비용을 줄일 수 있습니다. 제출 비용이 완전히 없어지는 것은 아니며 작업 자체의 시간과 주소·크기·수명 조건은 남습니다.</p>
<p><Link to="/cs/ai/vllm-paged-attention">PagedAttention</Link>의 고정 크기 블록에는 마지막 블록의 빈자리와 주소표 비용이 있습니다. <Link to="/cs/ai/prefix-caching-radix-attention">공통 입력 재사용</Link>은 중복 계산을 줄일 수 있습니다. GPU가 바빴다는 사실만으로 이런 런타임 개선의 가능성을 모두 배제할 수 없습니다.</p>
<p>시스템 층은 요청과 데이터를 어느 복사본에 보낼지 정합니다. <Link to="/cs/ai/disaggregated-prefill-decode-serving">입력 처리와 다음 토큰 계산을 분리</Link>하면 간섭이 줄 수 있지만 기록 전송과 양쪽 용량 배분이 새 조건이 됩니다. 분리했다는 사실만으로 특정 메모리 병목이나 성능 개선을 확정하지 않습니다.</p>
<p>네 층은 이 글의 설명을 위한 분류이며 물리적으로 분리된 네 시간 칸이 아닙니다. 한 기법이 여러 층의 결정을 요구할 수 있습니다. 무엇을 고칠지 찾은 뒤에는 실제 실행 경로에서 바뀌는 구간과 추가 비용을 따로 기록합니다.</p>
</div><ContentBoundary article="inference-optimization-layers" /></section>
<section id="amdahl" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">8. 남겨 둔 60 ms가 전체 개선을 제한합니다</h2><div className={prose}>
<p>전체 시간 T에서 바꿀 구간의 비율을 p라고 쓰겠습니다. 앞 사례에서는 40/100=0.4입니다. 그 구간을 s배 빠르게 하면 시간은 pT/s가 되고 나머지는 (1−p)T로 남습니다. 둘을 더해 새 시간을 얻고 원래 시간을 나누면 전체 가속 배수가 나옵니다. 이 고정 작업량의 관계를 Amdahl의 법칙으로 부릅니다.</p>
<p>s=2이면 새 시간은 60+20=80 ms입니다. s=10이면 60+4=64 ms입니다. 아무리 큰 s를 넣어도 바꾸지 않은 60 ms는 남습니다. p=0.4인 이 사례의 극한은 100/60=5/3 배입니다. p가 1이면 남는 구간이 없어 같은 유한 상한을 적용할 수 없습니다.</p>
</div><ExplainedFormula question="부분의 개선은 전체를 얼마나 바꾸나요?" idea="변하지 않은 시간과 빨라진 시간만 더합니다. 이 합을 사용할 수 있는 직렬·고정 비용 조건이 계산의 핵심입니다."
formula={String.raw`T'=T((1-p)+p/s),\quad S=T/T'`}
annotatedFormula={String.raw`\begin{gathered}T'=T\left(\underbrace{1-p}_{\text{남는 비율}}+\underbrace{p/s}_{\text{바뀐 비율}}\right)\\ S=\frac{T}{T'}=\frac{1}{1-p+p/s}\\ \lim_{s\to\infty}S=\frac{1}{1-p}\quad(p<1)\end{gathered}`}
operations={[{expression:"1-p",annotation:["원래 전체에서 바꿀 비율을 빼","변하지 않는 시간의 비율 계산"]},{expression:"p/s",annotation:["바꿀 비율을 개선 배수로 나눠","개선 뒤 시간의 비율 계산"]},{expression:"1/(1-p+p/s)",annotation:["새 시간의 비율을 역수로 바꿔","전체 가속 배수 계산"]}]}
terms={[{symbol:"T,T'",name:"전체 시간",description:"같은 요청·시작·끝에 대한 변경 전후의 시간입니다."},{symbol:"p",name:"변경 대상 비율",description:"원래 직렬 시간 중 바꾸는 구간의 비율로 0≤p≤1입니다."},{symbol:"s,S",name:"부분과 전체의 배수",description:"s는 양수이며 빨라지는 경우 s>1입니다. S는 전체 시간의 비입니다."}]}
assumptions={["구간이 겹치지 않고 직렬로 이어집니다. 남은 시간과 작업량이 그대로이며 추가 비용이 없습니다.","측정 경로·batch·shape·출력 조건이 바뀌면 기존 p와 s를 그대로 재사용하지 않습니다."]}
interpretation="100 ms 중 40 ms를 2배로 줄이면 80 ms·1.25배이고 10배여도 64 ms·1.5625배입니다. 미세 성능 측정은 부분의 근거이며 전체 효과에는 그 부분의 비중과 경로가 추가로 필요합니다." />
<div className={prose}><p>부분의 가속 배수만으로 후보의 우열을 정할 수도 없습니다. p=0.1인 구간을 100 배로 줄이면 전체는 1/0.901≈1.110 배입니다. p=0.5인 구간을 1.5 배로 줄이면 1/0.8333…=1.2 배입니다. p와 s를 함께 보아야 하며 어느 한쪽이 언제나 더 중요하다는 규칙은 없습니다.</p></div></section>
<section id="interactions" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">9. 두 개선을 더하려면 서로 바꾸는 조건을 봅니다</h2><div className={prose}>
<p>앞의 관계 계산을 40→20 ms로 줄이는 변경을 A라고 하겠습니다. 별도의 변경 B는 값 변환을 35→21 ms로 줄였다고 가정합니다. 두 변경이 서로 영향을 주지 않으면 15+20+21+10=66 ms입니다. 이 35→21은 설명용 관찰 가정이며 읽기와 계산의 시간을 임의로 더해 얻은 결과가 아닙니다.</p>
<p>둘을 함께 쓰려고 데이터 표현을 바꾸는 작업 8 ms가 새로 필요하다면 전체는 74 ms입니다. A와 B를 따로 잰 숫자를 더해 66 ms라고 보고하면 이 비용을 빠뜨립니다. A 적용 뒤 B의 대상 비율도 원래 35/100에서 35/80으로 달라집니다. 두 번째 변경의 출발점은 새 시간표입니다.</p>
<p>하드웨어가 읽기와 계산을 수행하는 방식에 맞춰 알고리즘과 구현을 함께 정하는 것을 hardware-aware co-design이라고 부릅니다. <Link to="/cs/ai/flash-attention-io-aware-kernel">FlashAttention</Link>은 필요한 값을 작은 작업 공간에서 재사용하도록 계산 순서를 설계한 예입니다. 그 상세 원리와 실제 커널은 정본 글에서 이어 읽습니다.</p>
<p>양자화는 바이트를 줄이는 동시에 변환 연산·커널 선택·품질을 바꿀 수 있습니다. 분리 서빙은 간섭과 기록 전송을 함께 바꿉니다. 같은 입력을 가진 요청을 모으는 배치는 재사용을 늘리지만 기다림을 늘릴 수도 있습니다. 기술 이름 하나마다 이득 하나가 고정되어 있지 않습니다.</p>
</div></section>
<section id="overlap" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">10. 동시에 한 일의 시간을 그대로 더하면 안 됩니다</h2><div className={prose}>
<p>(다른 가정) 계산 80 ms와 준비 20 ms가 동시에 시작하고 둘 다 끝나야 결과를 보낸다고 합시다. 전체는 100 ms가 아니라 max(80,20)=80 ms입니다. 준비를 10 ms로 줄여도 max(80,10)=80 ms로 같습니다. 이 경우 준비 시간 20을 전체에서 줄일 수 있는 직렬 구간이라고 넣으면 잘못된 예측이 나옵니다.</p>
<p>결과를 가장 늦게 준비시키는 의존 경로를 critical path, 임계 경로라고 부릅니다. 겹침이 있으면 각 일의 시작·끝과 의존 관계를 그려야 합니다. 어떤 가지를 줄이면 다른 가지가 새로 마지막이 될 수 있으므로 단순히 가장 긴 커널 하나만 찾는 문제도 아닙니다.</p>
<p>메모리에서 값을 읽는 최소 시간 28 ms와 계산에 필요한 최소 시간 7 ms도 자동으로 35 ms가 되지 않습니다. 서로 겹칠 수 있는 자원의 하한을 비교하는 <Link to="/cs/gpu/gpu-memory-hierarchy-and-roofline#roofline-bound">roofline</Link> 관점에서는 더 큰 28 ms가 하한입니다. 읽을 양만 절반이 되고 처리 능력은 그대로라면 새 하한은 max(14,7)=14 ms입니다. 둘 다 실제 실행시간을 보장하는 값은 아닙니다.</p>
<p>계산량·정밀도·변환 비용까지 바뀌는 양자화에는 위의 ‘읽기만 절반’ 가정을 다시 확인해야 합니다. 전송을 계산과 겹치는 분리 서빙도 같은 주의가 필요합니다. 하한 두 개, 커널 시간의 합, 사용자가 기다린 시간은 각각 무엇을 세는지 구분합니다.</p>
</div></section>
<section id="work-and-cost" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">11. 요청 20개의 기다림과 한 번의 계산을 구별합니다</h2><div className={prose}>
<p>이번에는 20개 요청을 한 번에 처리하는 별도 묶음 작업을 가정하겠습니다. 한 GPU가 묶음 전체를 처리하는 독점 작업 시간이 100→80 ms로 줄고 모든 요청의 결과 도착 시각도 그만큼 빨라집니다. 각 요청은 20 ms를 아꼈으므로 기다림 감소의 합은 20×20=400 request-ms입니다.</p>
<p>GPU가 덜 일한 시간은 묶음당 20 GPU-ms입니다. 같은 20 ms를 요청마다 하나씩 배정해 더하면 작업 시간을 20 배 크게 셉니다. 하루 200만 요청이 늘 20개씩 묶인다면 10만 묶음이고 절감된 독점 작업 시간은 2,000 GPU초입니다. 요청 지연에 요청 수를 곱한 40,000 초와 단위의 뜻이 다릅니다.</p>
<p>이렇게 구한 독점 작업 감소도 현금 절감과는 다릅니다. GPU를 하루 종일 같은 수만큼 확보한다면 비어 있는 시간이 늘어도 임대료는 그대로일 수 있습니다. 남은 공간으로 더 많은 일을 처리하는 가치와 장치를 반납해 청구가 줄어드는 가치를 따로 기록합니다.</p>
</div></section>
<section id="capacity" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">12. 복사본 수는 정수로 줄어듭니다</h2><div className={prose}>
<p>(별도 용량 가정) 같은 출력과 지연 조건에서 한 복사본의 처리 용량이 100→125 요청/s로 검증됐다고 합시다. 앞의 100 ms를 단순히 뒤집어 얻은 수가 아닙니다. 복사본당 GPU 하나를 쓰고 계획상 그 용량의 80%만 사용합니다. 복사본들이 서로 독립이고 메모리·최소 복제수 제약이 없다고 둡니다.</p>
<p>부하가 180 요청/s라면 변경 전 한 복사본에 80 요청/s를 배정할 수 있어 세 개가 필요합니다. 변경 후에는 한 복사본에 100 요청/s를 배정해 두 개면 됩니다. 필요한 수를 계산한 뒤 올림한 결과입니다. 부하가 160 요청/s라면 변경 전후 모두 두 개이므로 같은 개선이 복사본 수를 줄이지 않습니다.</p>
<p>부하가 하루 내내 같고 반납한 GPU 한 개의 요금이 실제로 사라지며 단가가 시간당 2 달러라고 가정하면 180 요청/s 사례는 하루 24×2=48 달러를 줄입니다. 160 요청/s 사례는 이 청구 기준에서 0 달러입니다. 시간당 2 달러는 설명용 값이며 특정 상품의 가격이 아닙니다.</p>
<p>계획 이용률 80%는 지연 목표를 보장하는 법칙이 아닙니다. 요청 길이와 도착의 쏠림, 장애 대비 최소 수, 복사본 하나에 필요한 여러 GPU, 예약 계약이 있으면 필요한 수와 청구를 다시 계산합니다. 이미 낸 요금과 새 지출을 피한 금액도 같은 절감으로 중복 계산하지 않습니다.</p>
</div></section>
<section id="roi" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">13. 비용 회수는 실제로 줄어든 청구에서 계산합니다</h2><div className={prose}>
<p>기존의 요청당 20 ms를 비용으로 바꾸려면 조건을 더 강하게 정해야 합니다. (별도 가정) 요청 하나마다 중복 배정되지 않은 독점 GPU 작업이 20 ms 줄고 그만큼의 청구량도 실제로 줄어든다고 하겠습니다. 하루 요청은 200만 건, 단가는 시간당 2 달러입니다. 이때에만 20 ms×200만=40,000 GPU초라는 계산을 사용합니다.</p>
<p>하루 절감액은 40,000/3,600×2=약 22.22 달러입니다. 365일이면 약 8,111.11 달러입니다. 구현과 검증에 처음 40,000 달러를 쓰고 추가 유지비·할인·성장·잔존가치를 모두 0으로 둔다면 단순 회수에는 1,800일이 필요합니다. 같은 조건에서 트래픽만 100 배면 18일이지만 실제로 그 규모에서도 묶음과 단가가 같은지는 따로 확인해야 합니다.</p>
<p>한 해 편익/비용은 약 0.2028입니다. 투자수익률은 순편익을 나누므로 (8,111.11−40,000)/40,000≈−79.72%입니다. 이 둘을 같은 ROI라는 이름으로 표시하면 손익분기 기준이 1인지 0인지 혼동됩니다. 기간과 비용 범위를 식 옆에 남깁니다.</p>
<p>이 계산만으로 최적화를 하거나 하지 말아야 한다고 단정하지 않습니다. 더 빠른 응답의 업무 가치, 품질, 예상 유지 기간과 위험도 선택에 영향을 줍니다. 화폐로 환산할 근거가 없는 편익은 별도 지표로 남기고 임의의 GPU 단가를 곱하지 않습니다. 설정 하나를 바꾸는 작업도 검증·운영·되돌림 비용이 0이라고 가정할 수 없습니다.</p>
</div></section>
<section id="source-amdahl" data-teach-level="5" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">14. 원 논문은 남는 일의 한계를 지적합니다</h2><div className={prose}>
<p>같은 100→80 ms 계산을 원문과 연결해 보겠습니다. Amdahl의 1967년 논문 483쪽은 당시 계산에서 자료 관리가 차지하는 일을 논하고 “The nature of this overhead appears to be sequential”이라고 적습니다. 그대로 남는 순차 작업이 전체 향상을 제한한다는 논증입니다.</p>
<p>483–485쪽과 484쪽 Figure 1을 실제로 확인했습니다. 앞에서 사용한 p와 s의 일반식은 그 지면에 인쇄된 식을 옮긴 것이 아니라, 같은 논리를 한 구간의 고정 시간 개선에 적용해 이 글에서 유도한 식입니다. 따라서 논문의 식 번호를 붙이지 않습니다.</p>
<p>우리 사례에 대응하는 남은 일은 입력 확인 15·값 변환 35·전송 10 ms입니다. 이 60 ms가 그대로면 관계 계산을 아무리 줄여도 결과를 60 ms보다 빨리 받을 수 없습니다. 원문의 당시 명령어 비율이나 기계 비교를 오늘날 GPU 요청의 실측 비율로 사용한 것은 아닙니다.</p>
</div><CitationBlock source="Gene M. Amdahl · AFIPS 1967, pp.483–485" citeKey={1} href="https://www.cs.cmu.edu/~18742/papers/Amdahl1967.pdf" type="paper">순차로 남는 자료 관리와 불규칙성의 비용을 논한 원문입니다. 이 글의 100 ms와 p·s 식은 명시한 가정의 자체 적용입니다.</CitationBlock></section>
<section id="source-profile" data-teach-level="5" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">15. 측정 도구의 백분율도 분모부터 읽습니다</h2><div className={prose}>
<p>원래 사례에서 GPU 커널이 관계 계산 40·값 변환 35 ms 두 개뿐이라고 가정해 보겠습니다. 두 커널 시간만 합친 표에서 관계 계산의 비율은 40/75≈53.33%입니다. 요청 전체 100 ms에서의 40%와 같지 않습니다.</p>
<p>NVIDIA Nsight Systems의 Analysis Guide에서 <code>cuda_gpu_kern_sum</code>의 <code>Time</code>은 표시된 커널의 <code>Total Time</code> 합을 분모로 삼습니다. 응용 프로그램의 전체 경과시간 비율이 아니라는 설명을 확인했습니다. 그 열을 그대로 Amdahl의 p로 가져오면 앞 사례에서도 분모가 틀립니다.</p>
<p>실제 추적에서는 다른 요청의 커널과 동시에 실행한 작업까지 구별해야 합니다. 시작·끝과 의존 관계를 가진 시간표를 보고 대상 요청이 기다린 경로를 확인합니다. 합계표는 많이 실행된 일을 찾는 데 도움이 되지만 그것만으로 줄일 수 있는 전체 시간을 정하지 않습니다.</p>
</div><CitationBlock source="NVIDIA Nsight Systems · Analysis Guide, cuda_gpu_kern_sum" citeKey={2} href="https://docs.nvidia.com/nsight-systems/AnalysisGuide/index.html#cuda-gpu-kern-sum-nvtx-name-base-mangled-cuda-gpu-kernel-summary">2026-10-05 확인한 공식 표 정의에 40/75와 40/100의 가정 사례를 적용했습니다. 실제 GPU 프로파일을 수집한 결과는 아닙니다.</CitationBlock></section>
<section id="source-config" data-teach-level="6" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">16. 설정 하나가 실제로 두 경로를 바꿉니다</h2><div className={prose}>
<p>설정 비교에서 무엇을 끄는지 실제 분기를 확인해 보겠습니다. vLLM v0.27.1의 커밋 <code>6e448d0e</code>를 고정했습니다. <code>enforce_eager=True</code>인 분기는 <code>CompilationMode.NONE</code>과 <code>CUDAGraphMode.NONE</code>을 모두 설정합니다. 컴파일과 그래프 재실행을 함께 끄는 비교입니다.</p>
</div>{code("eager","두 모드를 끄는 원문")}
<div className={prose}><p>이 설정으로 100 ms가 되돌아왔다는 관찰만으로 20 ms가 전부 CUDA Graph의 효과라고 할 수 없습니다. 지원되는 조건에서 컴파일을 유지하고 그래프만 바꾸는 비교가 필요합니다. 최종 설정과 실제 선택한 실행 경로까지 확인해야 합니다. 시작 준비 시간과 반복 실행 시간도 따로 잽니다.</p>
<p>같은 원문의 O1·O2 설정은 그래프 방식뿐 아니라 여러 결합 연산과 조율 설정의 기본값을 묶습니다. <code>_apply_optimization_level_defaults</code>는 아직 None인 필드에만 기본값을 적용합니다. 명시한 사용자 값, 하드웨어 조건, 뒤의 호환성 검사가 최종 설정에 영향을 줍니다. O2라는 이름만으로 모든 내부 기법이 켜졌다고 읽지 않습니다.</p>
</div>{code("levels","최적화 단계의 설정 묶음")}{code("defaults","None인 필드에 기본값 적용")}{code("compatibility","컴파일과 그래프 호환성 분기")}
<div className={prose}><p>별도 관찰에서는 원문의 해당 if 문과 두 enum을 AST 그대로 실행했습니다. 시작 상태를 컴파일·그래프 활성으로 정했을 때 False는 그 상태를 유지하고 True는 두 모드를 NONE으로 바꿨습니다. 전체 설정 초기화나 GPU 실행을 수행한 관찰은 아니므로 이것으로 최종 배포 설정이나 성능을 검증했다고 주장하지 않습니다.</p></div>
<CitationBlock source="vLLM v0.27.1 · config/vllm.py와 config/compilation.py" citeKey={3} href="https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/config/vllm.py#L1193-L1200" type="code">원문 전체와 라이선스를 보존했습니다. 공식 Optimization and Tuning 문서의 enforce-eager 설명도 같은 버전으로 대조했습니다.</CitationBlock></section>
<section id="source-metrics" data-teach-level="6" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">17. 측정 함수는 요청을 세며 GPU 청구를 세지 않습니다</h2><div className={prose}>
<p>11절의 요청 20개가 함께 끝나는 가정 기록을 원문 <code>calculate_metrics</code>에 넣었습니다. 성공한 요청은 모두 한 토큰을 반환하고 결과 도착은 100 ms라고 둡니다. 호출자가 넘기는 전체 관측 기간도 0.1 초라면 처리량은 20/0.1=200 요청/s입니다. 80 ms와 0.08 초의 기록에서는 250 요청/s가 됩니다.</p>
</div>{code("metrics-shape","측정 결과 구조체")}{code("metrics-count","성공한 요청과 지연 수집")}{code("metrics-rate","관측 기간으로 처리량 계산")}
<div className={prose}><p>원문은 완료한 요청 수를 호출자가 넘긴 <code>dur_s</code>로 나눕니다. 개별 요청 지연을 모두 더한 값을 분모로 사용하지 않습니다. 실제 서버를 평가할 때에는 부하 생성과 대기가 포함된 어떤 기간을 넘겼는지도 확인해야 합니다. 여기의 0.1·0.08 초는 제공한 가정값이며 새로 측정한 성능이 아닙니다.</p>
<p>완료 지연의 허용값을 90 ms로 주면 원문은 성공한 요청 중 그 조건을 만족한 수만 다시 셉니다. 100 ms 기록에서는 0개, 80 ms 기록에서는 20개가 통과합니다. 90 ms는 경계를 포함하는 비교로 통과합니다. 여러 지연 조건을 지정하면 모두 만족해야 합니다.</p>
</div>{code("metrics-goodput","지정한 지연 조건을 모두 검사")}
<div className={prose}><p>이 함수의 성공 표시와 지연 통과는 답의 의미가 옳다는 평가가 아닙니다. 가정 기록 중 하나의 답 문자열을 WRONG으로 바꾸고 성공 표시·길이·시각은 그대로 두었더니 같은 지표가 나왔습니다. 품질 평가와 실패·재시도 집계가 별도로 필요한 이유입니다. GPU초나 비용을 읽는 필드도 이 계산에는 없습니다.</p>
<p>CPython 3.12.13과 NumPy 2.2.6에서 원문의 구조체와 함수 AST를 바꾸지 않고 실행했습니다. 요청 기록은 별도 코드가 만든 가정이며 네트워크·모델·GPU를 실행하지 않았습니다. 원문 함수가 숫자를 어떻게 집계하는지 확인한 범위를 유지합니다.</p>
</div>{code("observation","가정 기록을 넣은 실제 관찰 코드")}
<CitationBlock source="vLLM v0.27.1 · benchmarks/serve.py calculate_metrics" citeKey={4} href="https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/benchmarks/serve.py#L556-L762" type="code">성공한 요청·지연 통과·기간당 처리량을 따로 확인했습니다. 지연이나 성공 수를 GPU 작업량과 청구량으로 바꾸는 함수는 아닙니다.</CitationBlock></section>
<section id="source-cost" data-teach-level="6" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">18. 편익과 비용의 식에 같은 숫자를 넣습니다</h2><div className={prose}>
<p>FinOps Foundation의 Unit Economics 문서는 자원 효율의 단위와 업무 결과의 단위를 구분합니다. 같은 페이지의 Value for AI Initiatives에는 ‘Return On Investment = (Financial Benefits – Costs) / Costs * 100’이라는 식이 있습니다. 13절에서 계산한 한 해 편익과 초기 비용을 이 식에 넣겠습니다.</p>
</div><ExplainedFormula question="편익/비용과 투자수익률은 어떻게 다른가요?" idea="비용을 회수한 뒤 남는 편익을 계산하면 투자수익률의 분자가 됩니다. 단순 비율은 비용을 빼기 전의 편익을 사용합니다."
formula={String.raw`\mathrm{ROI}=\frac{B-C}{C},\qquad \mathrm{BCR}=\frac{B}{C}`}
annotatedFormula={String.raw`\begin{gathered}\mathrm{ROI}=\frac{\underbrace{B-C}_{\text{같은 기간의 순편익}}}{\underbrace{C}_{\text{같은 범위의 비용}}}\\ \mathrm{BCR}=B/C=\mathrm{ROI}+1\\ B=\frac{73000}{9},\quad C=40000\\ \mathrm{ROI}=-\frac{287}{360}\approx-79.72\%\end{gathered}`}
operations={[{expression:"B-C",annotation:["편익에서 비용을 빼","순편익 계산"]},{expression:"(B-C)/C",annotation:["순편익을 투입 비용으로 나눠","투자수익률 계산"]},{expression:"B/C",annotation:["비용을 빼기 전 편익을 나눠","편익/비용 비율과 구별"]}]}
terms={[{symbol:"B",name:"편익",description:"이 사례에서는 실제로 줄어든 365일 GPU 청구액만 포함합니다."},{symbol:"C",name:"비용",description:"같은 개선을 구현·검증한 초기 40,000 달러입니다. 사례의 추가 유지비는 0입니다."},{symbol:String.raw`\mathrm{BCR}`,name:"편익/비용 비율",description:"이 글의 표기이며 비용을 회수한 때 값이 1입니다."}]}
assumptions={["요청당 독점 20 ms가 중복 없이 절감되고 청구가 그만큼 감소한다는 13절의 별도 가정입니다.","성장·할인·세금·잔존가치·추가 유지비는 넣지 않은 단순 예입니다. 실제 사업의 비용·기간과 구분합니다."]}
interpretation="원문 ROI 식의 퍼센트 표기에는 마지막에 100을 곱합니다. 이 사례의 편익/비용은 약 .2028, ROI는 약 −79.72%입니다. 20개가 한 계산을 공유하는 11절 사례에 요청당 20 GPU-ms를 적용하면 안 됩니다." />
<div className={prose}><p>자원 사용이 줄어든 양, 앞으로 사지 않아도 될 용량, 지금 줄어든 청구액은 서로 관계가 있지만 같은 지표는 아닙니다. ‘성공한 업무 한 건당 비용’을 비교한다면 성공의 정의와 반복 시도에 든 비용을 함께 정합니다. 비용 분모를 요청 수로 정할지 완료한 업무 수로 정할지도 명시합니다.</p></div>
<CitationBlock source="FinOps Foundation · Unit Economics, Value for AI Initiatives" citeKey={5} href="https://www.finops.org/framework/capabilities/unit-economics/">2026-10-05 원문 식과 자원·업무 단위의 구별을 확인했습니다. 예시 금액은 원문의 성능·가격 주장이 아니라 이 글의 가정입니다.</CitationBlock></section>
<section id="regression-gate" data-teach-level="6" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">19. 허용한 악화와 측정 불확실성을 따로 봅니다</h2><div className={prose}>
<p>변경 뒤 성능이 나빠지는 일을 regression이라고 부릅니다. 허용할 악화의 크기는 제품의 요구로 정하고 실제 차이를 얼마나 정확히 알 수 있는지는 반복 측정으로 판단합니다. 두 기준을 ‘잡음의 두 배’라는 한 숫자로 합칠 보편 규칙은 없습니다.</p>
<p>(가정) 다섯 조건을 짝지어 같은 요청 집합의 평균 완료시간을 비교했습니다. 기준은 98·100·102·99·101 ms, 변경 후는 100·103·104·102·103 ms입니다. 각 짝에서 변경 후−기준을 빼면 2·3·2·3·2 ms이며 평균 차이는 2.4 ms입니다. 이 다섯 값은 개별 요청의 꼬리 지연 표본이라고 바꾸어 부르지 않습니다.</p>
<p>NIST e-Handbook 7.3.1.2의 paired observations 식은 짝차이의 평균에서 t값×차이 표준편차/√N만큼 더하고 뺍니다. 서로 독립인 정규 분포의 짝차이를 가정하고 N=5를 넣으면 표본분산 0.3, 표준오차√0.06≈0.24495 ms입니다. 자유도 4의 95% 양측 구간은 약 1.72–3.08 ms입니다.</p>
</div><ExplainedFormula question="평균 2.4 ms 악화라는 추정에는 어느 범위의 불확실성이 있나요?" idea="같은 조건 안의 차이를 먼저 구한 뒤 그 차이들의 퍼짐으로 평균 차이의 불확실성을 계산합니다."
formula={String.raw`\bar d\pm t_{1-\alpha/2,N-1}\frac{s_d}{\sqrt N}`}
annotatedFormula={String.raw`\begin{gathered}\underbrace{\bar d}_{\text{짝차이 평균}}\ \pm\ \underbrace{\Delta}_{\text{오차 폭}}\\ \Delta=\underbrace{t_{1-\alpha/2,N-1}}_{\text{신뢰수준의 값}}\underbrace{\frac{s_d}{\sqrt N}}_{\text{표준오차}}\\ 2.4\pm2.776445\sqrt{0.3/5}\\ \approx[1.72,3.08]\ \mathrm{ms}\end{gathered}`}
operations={[{expression:"d_i=Y_i-Z_i",annotation:["같은 조건의 변경 후에서 기준을 빼","짝차이 계산"]},{expression:String.raw`s_d/\sqrt N`,annotation:["차이들의 표준편차를 표본수의 제곱근으로 나눠","평균 차이의 표준오차 계산"]},{expression:String.raw`\bar d\pm t s_d/\sqrt N`,annotation:["t값만큼의 오차 폭을 양쪽에 적용해","평균 차이의 신뢰구간 구성"]}]}
terms={[{symbol:"Y_i,Z_i",name:"짝지은 관측",description:"같은 조건 i의 변경 후와 기준 실행에서 잰 평균 완료시간입니다."},{symbol:String.raw`N,\bar d,s_d`,name:"차이 표본의 통계",description:"짝은 5개이고 평균 2.4 ms·표본분산 0.3 ms²입니다."},{symbol:String.raw`\alpha,t`,name:"신뢰수준과 t값",description:"α=.05, 자유도 4의 양측값 2.776445를 사용합니다."}]}
assumptions={["짝차이들이 서로 독립인 정규 분포 표본이라는 설명용 가정입니다. 시간 자기상관과 실행 순서 편향을 자동으로 해결하지 않습니다.","평균 차이의 구간이며 개별 요청 p99의 구간이 아닙니다. 여러 지표와 조건을 동시에 판단할 때는 그 선택과 오류 관리도 설계합니다."]}
interpretation="허용 악화가 3 ms라면 상한 3.08 ms가 3을 넘으므로 이 구간으로 3 ms 이내라고 확인할 수 없습니다. 0보다 큰 차이의 근거와 허용 범위 내라는 근거는 서로 다른 판정입니다." />
<div className={prose}><p>허용 악화를 3 ms로 미리 정했다면 상한 3.08 ms가 넘는 이 자료만으로는 허용 범위 안이라고 입증하지 못합니다. 평균이 3보다 작다는 이유만으로 통과시키지 않습니다. 더 많은 적절한 반복이나 개선이 필요할 수 있습니다. 반대로 통계적으로 차이를 찾지 못했다는 사실만으로 두 구현이 동등하다고 결론 내리지도 않습니다.</p></div>
<CitationBlock source="NIST/SEMATECH e-Handbook · 7.3.1.2 paired observations" citeKey={6} href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc312.htm">원문의 짝차이 평균 신뢰구간 식에 가정한 다섯 차이를 적용했습니다. 실행 순서·꼬리 지연·동등성의 상세 실험 설계는 별도로 다룹니다.</CitationBlock></section>
<section id="limits" data-teach-level="7" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">20. 한 조건의 성공을 모든 요청으로 넓히지 않습니다</h2><div className={prose}>
<p>작은 묶음과 큰 묶음을 모두 비교하면 서로 다른 병목을 찾는 데 도움이 됩니다. 그러나 특정 회귀가 반드시 낮은 묶음에서만 나타나거나 다른 회귀가 높은 묶음에서만 나타나는 것은 아닙니다. 실제 입력 길이·동시 요청·도착률·출력 길이·캐시 상태·장치 조합에서 중요한 조건을 고릅니다.</p>
<p>시작 준비와 충분히 반복한 실행을 나누고 오류·취소·재시도를 분모에서 숨기지 않습니다. 같은 입력과 버전, 드라이버, 전력·클럭 조건을 기록합니다. 실행 순서를 교차하거나 무작위화하고 독립 반복을 확보해 시간에 따른 변화가 한쪽에만 몰리지 않게 합니다. 측정 도구 자체의 오버헤드도 따로 확인합니다.</p>
<p>시간표에서 늘어난 구간은 원인 후보입니다. 그 구간의 분류 이름이 곧 근본 원인은 아닙니다. CPU 시간이 늘어도 다른 요청의 대기나 GPU 동기화가 원인일 수 있습니다. 변경을 하나씩 되돌리는 대조와 실제 선택 경로를 통해 가설을 확인합니다.</p>
<ProgressiveDetail title="자주 쓰는 기법의 경계도 함께 확인합니다" preview="그래프의 지원 조건, 입력 재사용, 분리 서빙의 이득은 실제 경로와 부하에 달려 있습니다."><p>GPU 커널 내부의 데이터 분기를 모두 CUDA Graph 금지로 묶지 않습니다. 캡처 중 CPU에서 값을 읽어 경로를 바꾸는 경우와 기록된 커널 내부의 실행을 구분합니다. 구체적인 주소·수명·동적 크기 조건은 그래프 정본 글에서 확인합니다.</p><p>같은 입력을 한 복사본에 모으면 재사용이 늘 수 있지만 이를 위한 별도 라우터가 없다고 재사용이 불가능한 것은 아닙니다. 한 복사본에서 반복된 입력도 재사용할 수 있습니다. 비어 있는 캐시의 정적 적중률 정렬만으로 미래의 묶음 순서가 정해지는 것도 아닙니다.</p><p>입력 처리와 다음 토큰 계산을 분리해도 모든 묶음 크기에서 가중치 읽기가 병목으로 남지는 않습니다. 계산량·기록 읽기·전송·양쪽 큐와 배치를 새로 재야 합니다. 이 비교는 각 구현의 최대 수치 하나를 더해 얻지 않습니다.</p></ProgressiveDetail>
</div></section>
<section id="decision" data-teach-level="7" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">21. 다음 변경은 새 시간표에서 시작합니다</h2><div className={prose}>
<p>먼저 같은 입력에서 지킬 답의 조건과 지연 목표를 정하고 현재 요청 경로를 기록합니다. 후보마다 바뀌는 일, 추가되는 일, 겹침과 필요한 메모리를 적습니다. 직렬 가정이 맞으면 Amdahl식으로 기대 범위를 구하고 그렇지 않으면 의존 시간표를 다시 계산합니다.</p>
<p>그다음 같은 조건의 대조로 지연·목표 안 처리량·품질을 확인합니다. 비용 판단에는 중복 없는 장치 작업량과 실제 청구 규칙을 연결합니다. 설정 이름이나 한 커널의 배수로 나머지 숫자를 대신하지 않습니다. 작은 시험에서 통과한 범위와 아직 확인하지 않은 부하를 남깁니다.</p>
<p>변경마다 직전 버전만 비교하면 작은 악화를 쌓을 수 있습니다. 5%씩 세 번 느려지면 고정한 처음 기준보다 1.05³−1=15.7625% 나빠집니다. 매번 10% 이내라는 조건만으로는 이 누적을 막지 못합니다. 마지막 승인 기준과 비교하는 규칙도 함께 유지합니다.</p>
<p>배포한 뒤에도 실제 부하와 청구, 성공한 업무의 단위를 다시 봅니다. 이전 버전으로 돌아갈 설정·모델·코드를 보존합니다. 앞의 100 ms 사례에서 배운 핵심은 한 가지입니다. 줄어든 20 ms의 위치와 단위를 알고 나서 다음 개선과 비용을 계산해야 합니다. 실제 부하 생성과 지표 검증은 <Link to="/cs/ai/serving-benchmark-methodology">서빙 벤치마크</Link>에서 이어갑니다.</p>
</div></section>
<section id="review" data-teach-level="review" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">22. 같은 사례를 바꾸어 예측해 봅니다</h2><ReviewPrompts questions={[
"관계 계산 40 ms를 2 배 빠르게 했지만 새 준비 5 ms가 생겼다면 100 ms 요청은 언제 끝나나요? (답: 3절)",
"20개 요청이 함께 100→80 ms에 끝났습니다. 요청의 기다림 감소를 합한 400 ms를 GPU 작업 절감으로 써도 되나요? (답: 11절)",
"허용 악화 3 ms에 대해 평균 2.4 ms, 양측 95% 구간 1.72–3.08 ms를 얻었습니다. 평균만 보고 통과시키면 안 되는 이유는 무엇인가요? (답: 19절)"
]}/></section>
</div><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={projectMetas}/></>;}
