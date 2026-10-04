import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs, fileTrees, projectMetas } from "./codeRefs";
import CudaGraphTimelineViz from "./viz/CudaGraphTimelineViz";
import CaptureSizePaddingViz from "./viz/CaptureSizePaddingViz";
const prose="prose prose-neutral max-w-none dark:prose-invert";
export default function CudaGraphCaptureArticle(){const sidebar=useCodeSidebar();const code=(id:string,label:string)=><div className="my-6"><CodeViewButton label={label} onClick={()=>sidebar.open(id,codeRefs[id])}/></div>;return <><div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">1. 같은 계산을 시키는 준비도 반복됩니다</h2><div className={prose}>
<p>계산이 짧을 때는 계산을 시작시키는 일이 눈에 띄게 됩니다. 매번 같은 순서로 네 가지 일을 시킨다고 해 보겠습니다. 결과를 얻으려면 네 일을 모두 마쳐야 하지만 다음 일을 설명하고 전달하는 동안 계산 장치가 비어 있을 수 있습니다. 이 글은 이미 정해진 일을 다시 설명하는 비용을 줄이는 방법을 다룹니다.</p>
<p>목표는 답을 만드는 계산을 그대로 두면서 매회 필요한 준비를 줄이는 것입니다. 순서와 사용할 자리를 한 번 기록해 두면 다음에는 그 기록을 가리키는 짧은 요청으로 일을 시작할 수 있습니다. 대신 기록에 남은 자리와 실제 데이터가 어긋나지 않도록 관리하는 일이 생깁니다.</p>
<p>계산할 내용이 달라지는 문제와 같은 계산에 넣을 값이 달라지는 문제도 나누어 봅니다. 입력 3을 5로 바꾸는 일은 네 연산의 순서를 바꿀 필요가 없습니다. 계산 도중 결과를 보고 다섯 번째 연산을 추가하려는 일은 다른 조건을 요구합니다. 먼저 작은 반복을 끝까지 따라간 뒤 실제 라이브러리가 이 차이를 어떻게 처리하는지 읽겠습니다.</p>
</div></section>
<section id="black-box" data-teach-level="B" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">2. 입력·작업 목록·실행 결과를 나누어 봅니다</h2><div className={prose}>
<p>큰 흐름에는 새 값을 받는 자리, 순서를 보관하는 곳, 실제 계산하는 장치가 있습니다. 처음에는 준비하는 쪽이 작업 네 개를 하나씩 전달합니다. 반복할 때는 보관해 둔 목록을 한 번 지정합니다. 새 입력은 목록이 가리키는 자리에 미리 넣고 마지막 작업이 끝나면 결과를 읽습니다.</p>
<p>목록을 저장한 것과 계산이 끝난 것은 다른 사건입니다. 목록에는 무엇을 읽고 어떤 작업 다음에 무엇을 할지가 들어갑니다. 아직 계산하지 않았다면 결과 자리에 원하는 답이 있다고 볼 수 없습니다. 기록을 만드는 단계와 기록대로 실행하는 단계를 구분해야 첫 결과를 잘못 읽지 않습니다.</p>
<p>같은 목록을 여러 번 쓰려면 입력과 결과를 담는 자리가 살아 있어야 합니다. 다른 데이터를 담으려고 그 자리를 돌려주면 기록은 여전히 예전 자리를 가리킵니다. 준비 시간을 줄이는 대신 어떤 공간을 얼마 동안 남길지 정하는 비용을 지게 됩니다.</p>
</div></section>
<section id="case" data-teach-level="0" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">3. 입력 3을 네 번 바꾸면 22가 됩니다</h2><div className={prose}>
<p>(가정) 입력 하나에 1을 더하고 2를 곱하고 3을 더한 뒤 다시 2를 곱합니다. 값은 3 → 4 → 8 → 11 → 22로 변합니다. 네 작업은 각각 따로 실행되며 앞 작업의 결과가 다음 작업의 입력입니다. 연산을 합치는 별도의 최적화는 적용하지 않습니다.</p>
<p>준비하는 쪽은 작업 하나를 전달하는 데 3 μs, 계산하는 쪽은 작업 하나에 2 μs를 쓴다고 가정합니다. 두 쪽은 서로 다른 일을 동시에 할 수 있습니다. 첫 작업을 전달한 시각은 3 μs이고 첫 결과 4가 나오는 시각은 5 μs입니다. 그동안 준비하는 쪽은 두 번째 일을 전달하고 있습니다.</p>
<p>이 사례에는 값과 시각이라는 두 종류의 숫자가 있습니다. 첫 계산의 결과 4는 다음 계산에 넣을 데이터이고 5 μs는 그 값을 사용할 수 있게 된 때입니다. 다음 계산은 데이터 4에 2를 곱합니다. 시각 5에 2를 곱하는 것이 아니므로 두 숫자를 별도로 따라가야 합니다.</p>
<p>작업이 도착하는 시각은 3·6·9·12 μs입니다. 계산은 3–5, 6–8, 9–11, 12–14 μs에 이루어집니다. 마지막 답 22는 14 μs에 나옵니다. 네 번의 준비와 계산을 모두 더한 20 μs와 다른 이유는 준비와 계산이 겹치는 구간이 있기 때문입니다.</p>
<p>이번에는 네 작업의 기록을 한 번 전달하는 데 2 μs가 든다고 가정합니다. 2 μs부터 같은 네 계산을 연속으로 하면 결과는 4·6·8·10 μs에 차례로 나옵니다. 마지막 답은 여전히 22이고 완료만 14에서 10 μs로 앞당겨집니다. 이 숫자들은 실제 장치의 측정값이 아닌 시간표를 위한 가정입니다.</p>
</div></section>
<section id="picture" data-teach-level="1" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">4. 바뀌는 것은 계산 사이의 빈 시간입니다</h2><div className={prose}>
<p>두 실행을 같은 시간축에 놓으면 차이를 찾기 쉽습니다. 하나씩 전달할 때 계산 장치는 첫 일을 기다린 다음 작업 사이에도 1 μs씩 기다립니다. 목록을 한 번에 전달하면 첫 준비 뒤에는 네 작업이 순서대로 이어집니다. 계산 네 개에 쓰는 시간 8 μs는 이 사례에서 같습니다.</p>
<p>예를 들어 4 μs에는 첫 계산과 두 번째 작업의 전달이 동시에 진행됩니다. 준비하는 쪽은 첫 답 4가 아직 없어도 다음에 어느 결과를 읽을지 미리 전달할 수 있습니다. 계산하는 쪽은 두 번째 지시가 도착한 6 μs에 이미 만들어진 4를 읽습니다. 지시를 전달하는 때와 데이터를 사용하는 때가 같을 필요는 없습니다.</p>
<p>준비가 줄었다고 계산 네 개가 하나의 계산으로 합쳐진 것은 아닙니다. 4를 얻어야 8을 만들고 8을 얻어야 11을 만들 수 있다는 관계도 그대로입니다. 그림에서는 전달하는 횟수와 실제 계산하는 횟수를 따로 세어야 합니다.</p>
<p>그림의 빈 구간을 세면 첫 계산 전에 3 μs, 계산 사이에 1 μs씩 세 번입니다. 계산 8 μs에 이 6 μs를 더하면 끝 시각 14 μs가 됩니다. 목록을 함께 전달한 쪽에는 처음 2 μs만 남아 전체가 10 μs입니다. 준비 시간 전체를 뺀 것이 아니라 계산 장치가 기다리던 일부 시간을 줄인 셈입니다.</p>
<p>작업 하나를 전달한 뒤 그 작업이 끝날 때까지 준비하는 쪽도 기다리면 어떻게 될까요? 준비 3 μs와 계산 2 μs가 네 번 직렬로 이어져 20 μs가 됩니다. 이 세 번째 시간표를 함께 두면 같은 네 연산이라도 기다리는 위치에 따라 전체 시간이 달라진다는 점을 확인할 수 있습니다.</p>
</div><CudaGraphTimelineViz /></section>
<section id="why" data-teach-level="2" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">5. 순서와 주소를 함께 남기는 이유</h2><div className={prose}>
<p>목록에 연산 이름만 적으면 충분하지 않습니다. 첫 작업은 입력을 어디서 읽을지, 다음 작업은 앞의 어느 결과를 읽을지 알아야 합니다. 예를 들어 입력 자리 A에 3을 두고 마지막 결과 자리 Z에 22를 쓰기로 했다면 반복할 때도 A와 Z가 유효한 자리여야 같은 기록을 사용할 수 있습니다.</p>
<p>작업 순서를 생략하면 답도 달라집니다. 같은 입력 3에서 먼저 2를 곱하고 나서 1을 더한 뒤 나머지 두 일을 하면 3 → 6 → 7 → 10 → 20이 됩니다. 원래 답 22를 보존하려면 계산 네 번이라는 개수뿐 아니라 앞뒤 관계를 함께 남겨야 합니다.</p>
<p>새 입력 5가 별도의 자리 B에 도착했다고 가정해 봅니다. 프로그램에서 입력을 부르는 이름만 B로 바꾸어도 기존 목록에 적힌 A는 바뀌지 않습니다. A의 3을 5로 덮어쓴 뒤 실행해야 5 → 6 → 12 → 15 → 30을 얻습니다. 이 사례의 A와 B는 실제 주소 숫자를 대신하는 표지입니다.</p>
<p>입력 자리를 덮어쓰는 때도 정해야 합니다. 이전 실행이 아직 A를 읽지 않았는데 3을 5로 바꾸면 어느 입력의 답인지 불분명해집니다. 우리의 비교는 앞 실행이 필요한 값을 다 읽은 뒤 새 입력을 넣는다고 가정합니다. 같은 자리를 쓰는 편의에는 언제 값을 바꿔도 되는지 확인하는 책임이 따릅니다.</p>
<p>네 작업의 순서를 미리 확인해 두면 매번 같은 준비를 반복하는 일을 줄일 수 있습니다. 처음 기록하고 실행할 준비를 마치는 비용은 추가되므로 한 번만 쓸 목록에는 불리할 수 있습니다. 이제 반복 횟수, 입력 자리, 작업 순서가 함께 설계해야 할 대상임을 알 수 있습니다.</p>
</div></section>
<section id="names" data-teach-level="3" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">6. 기록과 재생에 이름을 붙입니다</h2><div className={prose}><p>실행할 GPU 작업을 묶어 보관한 것을 CUDA Graph라고 부릅니다. GPU로 작업을 보내는 쪽은 CPU이며 네 개의 계산은 이 글에서 네 개의 kernel로 가정했습니다. 앞에서 본 일에 용어를 대응시키면 다음과 같습니다.</p></div>
<TermBreakdown title="역할에서 이름으로" items={[
{term:"capture · 캡처",description:"지정한 구간에서 제출한 작업과 의존성을 실행 기록으로 남깁니다.",example:"+1, ×2, +3, ×2의 네 작업을 기록합니다.",boundary:"기록한 구간의 GPU 계산 결과가 이미 만들어졌다는 뜻은 아닙니다."},
{term:"replay · 재생",description:"준비한 기록으로 GPU 작업을 다시 제출합니다.",example:"같은 A의 값을 읽어 네 작업을 실행합니다.",boundary:"원래 Python 함수 전체를 다시 호출하는 것과 다릅니다."},
{term:"static address · 고정 주소",description:"일반적인 정적 재생이 다시 읽고 쓰는 메모리 자리입니다.",example:"A에 새 값 5를 복사하면 결과가 30으로 바뀝니다.",boundary:"CUDA의 별도 업데이트 API까지 모든 주소 변경을 금지하는 규칙은 아닙니다."},
{term:"node / edge · 작업과 의존 관계",description:"node는 할 일, edge는 앞 작업이 어떤 조건을 만족해야 뒤 작업을 할 수 있는지를 적습니다.",example:"네 계산의 결과 의존성을 세 연결로 표현합니다.",boundary:"연결이 없는 작업의 동시 실행이 보장되는 것은 아닙니다."},
{term:"instantiate · 실행 준비",description:"정의한 기록을 확인하고 반복 실행할 형태를 준비합니다.",example:"같은 네 작업을 재생하기 전에 한 번 치르는 준비입니다.",boundary:"첫 제출의 장치 업로드 비용과 매번의 재생 비용도 따로 남을 수 있습니다."}
]}/></section>
<section id="trace" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">7. 같은 입력을 끝까지 추적합니다</h2><div className={prose}>
<p>이 글의 네 kernel이 하나의 순서로 실행된다고 가정합니다. 일반 제출에서는 CPU가 첫 kernel을 3 μs에 준비시키고 GPU가 5 μs에 4를 만듭니다. 두 번째는 6 μs에 준비되어 8 μs에 8을 만들고 나머지 둘이 11과 22를 만듭니다. 마지막 완료 시각은 14 μs입니다.</p>
<p>재생에서는 준비된 graph를 2 μs에 제출한 뒤 같은 데이터 의존성을 따릅니다. 값 4, 8, 11, 22가 4, 6, 8, 10 μs에 만들어집니다. CPU의 graph 제출 한 번과 GPU의 kernel 네 번을 구분하면 그래프가 계산을 생략해서 빨라진다는 오해를 피할 수 있습니다.</p>
<p>각 kernel이 끝날 때마다 CPU도 기다리는 방식에서는 5·10·15·20 μs에 결과가 나옵니다. 이 방식의 차이는 graph 사용 여부에 앞서 동기화 위치에서 생깁니다. 비교할 때는 입력, 계산, 기다리는 지점을 함께 고정해야 합니다.</p>
</div></section>
<section id="timing" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">8. 겹치는 시간은 단순히 더하지 않습니다</h2><div className={prose}>
<p>시간표를 일반식으로 쓰면 각 작업은 제출이 끝나고 앞 작업도 끝난 뒤 시작합니다. 시작 조건 둘 중 늦은 시각을 택하는 이유입니다. rᵢ를 i번째 작업의 준비 완료, eᵢ를 계산 완료로 두면 다음 식으로 네 작업을 순서대로 계산할 수 있습니다.</p></div>
<ExplainedFormula question="다음 작업은 언제 끝날까요?" idea="작업이 도착해야 하고 앞 계산도 끝나야 합니다. 두 조건 중 늦은 시각에 계산 시간을 더합니다." formula={String.raw`r_i=iL,\quad e_i=\max(r_i,e_{i-1})+E`} annotatedFormula={String.raw`\begin{aligned}r_i&=iL,\quad e_0=0\\e_i&=\underbrace{\max(r_i,e_{i-1})}_{\text{두 조건을 기다림}}+E\\e_4&=\max(12,11)+2=14\end{aligned}`} operations={[{expression:String.raw`\max(r_i,e_{i-1})`,annotation:"제출 완료와 앞 작업 완료가 모두 충족되는 시각"},{expression:String.raw`+E`,annotation:"그 시각부터 현재 작업을 계산하는 시간"}]} terms={[{symbol:"L",name:"제출 시간",description:"가정한 작업 하나의 CPU 제출 완료 간격입니다."},{symbol:"E",name:"계산 시간",description:"이 모형에서 작업 하나가 GPU를 사용하는 시간입니다."},{symbol:"r_i,e_i",name:"준비와 완료",description:"i번째 작업이 도착한 시각과 결과가 나오는 시각입니다."}]} assumptions={["처음에는 빈 단일 실행열이고 네 작업이 직렬로 의존합니다.","CPU 제출은 서로 직렬이며 제출 종료 때 작업이 사용 가능해진다고 가정합니다. 실제 CUDA 내부의 시작 시각을 일반화하지 않습니다.","대기열 제한, 복사, 드라이버 변동과 다른 작업의 간섭을 생략합니다."]} interpretation="L=3, E=2이면 완료는 5·8·11·14 μs입니다. 매 작업 동기화할 때만 이 모형에서 N(L+E)=20 μs가 됩니다."/>
<div className={prose}><p>가정한 graph 제출 시간이 G이면 첫 계산을 G에서 시작해 G+NE에 마칩니다. CPU가 덜 바빠졌다고 완료도 반드시 빨라지는 것은 아닙니다. L=2, E=3, G=2로 바꾸면 일반 제출과 재생 모두 첫 계산을 2 μs에 시작하고 14 μs에 끝납니다. CPU 제출 시간은 8에서 2 μs로 줄지만 이미 GPU 계산이 빈틈없이 이어집니다.</p>
<p>큰 사례 N=200, L=5 μs, E=2 μs에서도 이 구별이 필요합니다. 같은 비동기 모형의 완료는 1,002 μs이고 매 작업 동기화하면 1,400 μs입니다. G=10 μs인 재생의 410 μs는 같은 단순 모형의 계산입니다. 이 비율을 실제 GPU에서 측정한 가속비로 사용할 수 없습니다.</p></div></section>
<section id="mechanics" data-teach-level="5" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">9. 새 값은 기록에 남은 자리에 넣습니다</h2><div className={prose}>
<p>PyTorch의 일반적인 정적 재생에서는 캡처한 kernel의 포인터 인수가 같은 가상 주소를 가리킵니다. 입력 A에 3이 있는 상태에서 캡처하고 재생했다면 답은 22입니다. Python 변수를 새 tensor B에 연결해도 저장된 인수 A는 자동으로 바뀌지 않습니다.</p>
<p>A에 <code>copy_</code>로 5를 복사하고 재생하면 같은 네 계산이 30을 만듭니다. 복사가 재생보다 먼저 끝나야 하며 입력의 크기와 배치도 캡처한 조건에 맞아야 합니다. 여기서 말하는 복사는 새 주소를 기록하는 일이 아니라 기존 주소의 내용을 갱신하는 일입니다.</p>
<p>출력 Z도 반복해서 덮어쓸 수 있습니다. 첫 답 22를 가리키는 참조를 보관한 뒤 다음 재생이 Z에 30을 쓰면 그 참조가 보는 내용도 30이 됩니다. 두 답을 따로 보관하려면 덮어쓰기 전에 별도 공간에 복사하는 비용까지 고려합니다.</p></div>{code("torch-replay","PyTorch · 재생은 저장한 실행 객체를 호출합니다")}</section>
<section id="graph-anatomy" data-teach-level="5" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">10. 작업 목록과 실행 가능한 기록을 구별합니다</h2><div className={prose}>
<p>CUDA의 <code>cudaGraph_t</code>는 node와 edge로 작업을 정의한 객체입니다. kernel뿐 아니라 복사 등의 작업도 node가 될 수 있습니다. 네 계산의 경우 앞 결과를 뒤에서 읽으므로 순서 의존성을 유지합니다. CUDA는 의존성을 지키며 작업을 실행하지만 독립 node를 항상 동시에 실행한다는 보장은 없습니다.</p>
<p><code>cudaGraphExec_t</code>는 그 정의를 반복 실행할 수 있도록 준비한 객체입니다. 정의와 실행 준비를 분리하면 네 작업의 공통 준비를 매번 반복할 필요가 줄어듭니다. 실제 계산 네 번과 매회 graph 제출은 여전히 필요합니다.</p>
<p>PyTorch 2.14의 기본 <code>keep_graph=False</code>에서는 캡처를 마칠 때 실행 준비를 합니다. True로 원래 정의를 남겨 두면 명시적으로 준비하거나 첫 재생에서 준비합니다. 원래 정의를 나중에 바꾼 경우 다시 준비해야 변경이 반영된다는 조건도 원문에 있습니다.</p></div>{code("torch-end","PyTorch · 캡처 종료와 실행 준비 분기")}
<CitationBlock type="code" citeKey={1} source="NVIDIA CUDA Programming Guide §4.2.2 · 정의, 실행 준비, 실행" href="https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html#building-and-running-graphs">준비하는 객체와 실행하는 객체를 구별합니다. 이 글의 네 작업은 그 수명과 데이터 의존성을 설명하기 위한 가정입니다.</CitationBlock></section>
<section id="stream-capture" data-teach-level="5" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">11. 캡처 중의 Python 실행과 GPU 기록은 다릅니다</h2><div className={prose}>
<p>작업 제출 순서를 유지하는 CUDA stream을 캡처 상태로 두면 그 stream에 제출한 작업이 기록됩니다. 우리의 함수는 Python에서 네 연산을 호출하지만 캡처한 GPU 작업 자체는 그 구간에서 실행하지 않습니다. 함수 안의 Python 카운터를 한 번 증가시켰다면 그 CPU 작업은 실행됩니다. 재생은 그 카운터를 자동으로 다시 증가시키지 않습니다.</p>
<p>PyTorch의 context manager는 사용할 stream을 선택하고 캡처 시작과 종료를 감쌉니다. 인수를 생략하면 별도의 캡처용 stream을 만들며 사용자가 stream을 명시하는 경로도 있습니다. 원문은 시작 전 동기화와 메모리 정리를 수행합니다. 이 준비 비용을 매회 재생 비용과 섞으면 반복 실행의 이득을 잘못 잴 수 있습니다.</p>
<p>처음 호출에서 필요한 초기화는 캡처 전에 실행해 둡니다. 다른 stream이 event를 통해 합류하면 캡처 종료 전에 원래 stream으로 다시 연결해야 합니다. 네 연산을 두 stream에 나누더라도 앞 결과를 읽는 관계는 event 의존성으로 보존해야 합니다.</p></div>{code("torch-context","PyTorch · stream 선택과 캡처 시작·종료")}
<CitationBlock type="code" citeKey={2} source="PyTorch 2.14 · CUDA Graphs / NVIDIA §4.2.2.2 Stream Capture" href="https://docs.pytorch.org/docs/2.14/notes/cuda.html#cuda-graphs">CPU 함수 실행, stream에 제출한 GPU 작업 기록, 이후 재생을 따로 봅니다. 이 글에서는 GPU 캡처를 직접 실행하지 않았습니다.</CitationBlock></section>
<section id="wrapper" data-teach-level="6" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">12. vLLM은 같은 실행 조건의 기록을 찾습니다</h2><div className={prose}>
<p>vLLM v0.27.1의 <code>CUDAGraphWrapper</code>는 전달받은 실행 조건을 키로 기록을 찾습니다. 조건이 맞는 첫 호출에서는 캡처할 수 있는 시점인지 검사하고 입력 주소를 저장합니다. 이미 기록이 있으면 원래 함수를 다시 호출하지 않고 저장한 graph를 재생한 뒤 출력 참조를 돌려줍니다.</p>
<p>입력 버퍼를 만들고 새 값을 복사하는 일은 이 wrapper 밖의 책임입니다. 따라서 A 대신 B를 인수로 넘기면 알아서 A로 복사해 준다고 해석할 수 없습니다. 이 버전의 주소 비교는 <code>VLLM_LOGGING_LEVEL=DEBUG</code>일 때 수행됩니다. 검사하지 않는 모드가 주소 변경을 올바르게 만들어 주는 것은 아닙니다.</p></div>
{code("wrapper-capture","vLLM · 첫 조건의 주소와 기록 저장")}{code("wrapper-replay","vLLM · DEBUG 주소 검사와 재생")}
<div className={prose}><p>원문 함수 몸체를 그대로 추출해 CPU에서 제어 분기를 실행했습니다. tensor와 graph는 대역 객체이며 GPU 호출은 하지 않았습니다. 같은 주소로 캡처 한 번과 재생 두 번을 요청하자 원래 함수 호출은 한 번, 재생 호출은 두 번이었습니다. 다른 주소는 DEBUG에서 거부됐고 검사를 끄면 재생 분기로 들어갔습니다. 이 관찰은 Python 분기만 확인하며 실제 장치의 메모리 안전성을 검증한 실행은 아닙니다.</p>
<p>실행 모드가 NONE이거나 wrapper의 모드와 다르면 원래 함수를 호출합니다. 기록할 조건 자체는 다음의 선택기가 정합니다. wrapper가 임의의 모양을 보고 항상 새 graph를 만들어 주는 구조로 읽으면 안 됩니다.</p></div>
{code("wrapper-bypass","vLLM · 캡처 경로를 통과하지 않는 조건")}{code("observation","원문 분기 CPU 관찰 · 대역 객체와 실제 실행 범위")}</section>
<section id="shape-padding" data-teach-level="6" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">13. 다섯 토큰은 여덟 자리로 맞춥니다</h2><div className={prose}>
<p>모든 입력 크기의 graph를 따로 준비하면 준비 시간과 메모리가 늘어납니다. (가정) 허용할 토큰 수를 [1, 2, 4, 8, 16, 24, 32]로 정해 보겠습니다. 5토큰은 8자리 graph를 사용하고 남는 3자리는 실제 요청에 속하지 않는 자리로 처리합니다. 이런 크기 맞추기를 padding이라고 부릅니다.</p>
<p>추가 자리 3을 할당된 8로 나누면 37.5%입니다. 유효한 5를 분모로 한 추가량은 60%이므로 두 비율을 혼동하지 않습니다. 이 수치만으로 지연 증가율을 정할 수는 없습니다. 행마다 하는 계산, 길이 정보, 주소 매핑과 kernel 선택에 따라 실제 비용이 달라집니다.</p>
<p>가짜 자리의 결과를 버리는 것만으로 충분하지 않을 수도 있습니다. 그 작업이 유효한 요청의 상태를 덮어쓰지 않도록 길이와 주소를 올바르게 준비해야 합니다. 공유하는 가중치 읽기 비용은 행 수에 비례하지 않을 수 있지만 패딩의 시간 손실이 항상 행 비율 이하라는 보장도 없습니다.</p></div>
<ExplainedFormula question="어떤 크기의 기록을 골라야 할까요?" idea="실제 토큰을 모두 담을 수 있는 준비된 크기 중 가장 작은 것을 고릅니다. 그런 크기가 없으면 이 선택식으로 실행할 graph가 없습니다." formula={String.raw`S(b)=\min\{s\in\mathcal C:s\ge b\},\quad w(b)=(S(b)-b)/S(b)`} annotatedFormula={String.raw`\begin{aligned}S(b)&=\min\{s\in\mathcal C:s\ge b\}\\w(b)&=\frac{\underbrace{S(b)-b}_{\text{추가 자리}}}{S(b)}\\S(5)&=8,\quad w(5)=3/8\end{aligned}`} operations={[{expression:String.raw`\min\{s\in\mathcal C:s\ge b\}`,annotation:"모든 실제 토큰을 담을 수 있는 가장 작은 크기"},{expression:String.raw`(S(b)-b)/S(b)`,annotation:"할당된 자리 가운데 실제 입력이 없는 비율"}]} terms={[{symbol:String.raw`\mathcal C`,name:"준비한 크기",description:"이 사례의 토큰 수는 [1, 2, 4, 8, 16, 24, 32]입니다."},{symbol:"b,S(b)",name:"실제와 할당",description:"실제 토큰 수와 선택한 graph의 토큰 수입니다."},{symbol:"w(b)",name:"추가 자리 비율",description:"분모는 할당된 크기이며 지연 증가율이 아닙니다."}]} assumptions={["b가 양수이고 집합 안에 b 이상인 크기가 있을 때만 S(b)가 정의됩니다.","실제 재생은 크기 외의 실행 조건과 가짜 자리 처리도 맞아야 합니다."]} interpretation="5→8은 3/8=37.5%, 17→24는 7/24≈29.17%입니다. 33은 최대 32를 넘어 선택할 크기가 없습니다."/>
<CaptureSizePaddingViz /><div className={prose}>
<p>기존의 성긴 목록 [1, 2, 4, 8, 16, 32]에서는 17을 32로 맞추어 15/32=46.875%가 됩니다. v0.27.1 설정 파일의 문서에는 8–248 구간의 8 간격과 256 이상 구간의 16 간격이 설명되어 있습니다. 그 규칙의 9→16은 43.75%, 65→72는 약 9.72%입니다. 실제 목록과 상한은 사용한 설정으로 확인합니다.</p>
<p>이 글의 32 상한은 관찰용으로 직접 정했습니다. 원문 docstring은 미지정 상한을 min(max_num_seqs×2,512)로 설명합니다. 다른 버전이나 플랫폼의 값을 섞어 모든 배포의 기본 상한이라고 단정하지 않습니다.</p></div>
{code("capture-config","vLLM · 캡처 크기의 설정 문서")}{code("padding-map","vLLM · 각 토큰 수를 준비된 크기로 대응")}</section>
<section id="implementation" data-teach-level="6" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">14. 크기 외의 조건도 함께 맞춥니다</h2><div className={prose}>
<p>선택기는 토큰 수와 함께 요청 수, 모든 요청이 같은 길이인지 등의 조건을 <code>BatchDescriptor</code>로 묶습니다. 같은 5토큰이라도 한 요청의 긴 입력인지 여러 요청의 한 토큰씩인지에 따라 전체를 재생할 조건이 달라집니다. 선택기의 키에는 추가 어댑터 사용 조건도 포함됩니다.</p>
<p>관찰 설정은 <code>FULL_AND_PIECEWISE</code>, 최대 요청 32개, 요청당 새 토큰 1개, 추가 어댑터 없음입니다. 입력과 생성이 섞일 수 있는 5토큰은 <code>PIECEWISE</code>의 토큰 8·요청 수 미지정 키를 찾았습니다. 길이가 균일한 생성 요청 5개는 <code>FULL</code>의 토큰 8·요청 8·균일함 키를 찾았습니다. 두 경로를 같은 5라는 숫자만으로 구분할 수 없습니다.</p></div>
{code("descriptor","vLLM · 실행 조건을 담는 실제 구조")}{code("dispatch-keys","vLLM · 전체와 부분 그래프의 키 준비")}{code("dispatch","vLLM · 허용 모드와 키를 차례로 검사")}
<div className={prose}><p>FULL을 제외하고 같은 균일 입력을 보내면 요청 수와 균일 조건을 완화한 PIECEWISE 키를 찾습니다. 33토큰은 최대 32보다 크므로 그 전에 NONE을 돌려줍니다. 최대 32 graph에 33을 넣는 경로는 아닙니다. 여기서 NONE은 이 선택 범위의 graph를 사용하지 않는다는 뜻입니다.</p>
<p>모든 실패가 자동으로 일반 실행으로 이어지지도 않습니다. 원문에서 mixed5를 보내면서 FULL만 허용하면 맞는 키가 없고 NONE도 허용되지 않아 assertion이 발생했습니다. 실제 원문 AST를 CPU에서 실행한 관찰은 키 초기화와 이 분기들을 포함합니다. kernel 지원 여부와 GPU 캡처 성공 여부는 별도의 조건입니다.</p></div></section>
<section id="graph-compatibility" data-teach-level="7" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">15. 일반 재생의 제약과 다른 기능을 구별합니다</h2><div className={prose}>
<p>우리의 일반 정적 재생은 주소, tensor 크기와 배치, 제출한 작업 구조가 유지된다는 조건을 사용했습니다. 캡처 중에 <code>.item()</code>으로 GPU 결과를 CPU로 읽어 다음 작업을 고르는 방식은 허용되지 않습니다. 캡처한 작업의 계산을 진행하는 단계가 아니므로 그 결과를 기다리는 방식으로 경로를 만들 수 없습니다.</p>
<p>Python에서 선택한 한 경로를 기록하고 재생할 때는 다음 입력이 다른 경로를 요구해도 그 Python 판단이 다시 실행되지 않습니다. 그러나 이것을 GPU kernel 내부의 모든 분기나 CUDA의 모든 동적 실행이 금지된다는 말로 확대하면 틀립니다.</p>
<p>CUDA는 미리 정의한 하위 그래프를 장치의 조건값에 따라 선택하거나 반복하는 conditional node를 제공합니다. PyTorch 2.14 공식 문서도 <code>torch.cond()</code>를 사용하는 예외를 설명하며 cudagraphs backend와 eager capture 예제를 제시합니다. 같은 문서는 Inductor backend의 해당 지원이 아직 없다고 명시합니다. 일반 Python if를 이 예외와 동일시할 수 없습니다.</p></div>
<ProgressiveDetail title="주소나 작업 크기를 직접 갱신할 수도 있나요?" preview="CUDA에는 노드 인수를 바꾸는 별도 API가 있습니다. 일반 replay에 새 tensor를 넘기는 것과는 다른 작업입니다.">
<p id="graph-update" className="scroll-mt-24">CUDA §4.2.3은 전체 graph의 같은 topology를 확인하는 업데이트와 개별 node 업데이트를 구분합니다. 허용된 kernel 인수나 실행 크기를 바꾸는 API가 있으므로 주소나 shape가 달라지면 무조건 새 캡처만 가능하다는 단정은 맞지 않습니다. context와 node 종류에 따른 제약을 충족하고 갱신 결과를 확인해야 합니다.</p>
<p>PyTorch의 일반 replay는 이런 갱신을 자동으로 수행하지 않습니다. 원래 graph를 남겨 raw 객체를 수정하는 경로에서도 실행 객체에 변경을 반영하는 준비가 필요합니다. 이 글의 A→B 재바인딩 실패는 자동 갱신 없는 정적 재생의 사례입니다.</p></ProgressiveDetail>
<CitationBlock type="code" citeKey={3} source="PyTorch 2.14 · Data Dependent Control Flow / CUDA §4.2.3–4.2.4" href="https://docs.pytorch.org/docs/2.14/notes/cuda.html#data-dependent-control-flow">정적 재생 계약, 명시적 업데이트, 미리 구성한 조건부 실행을 구별합니다. 최신 기능의 존재만으로 사용 중인 backend가 모두 지원한다고 가정하지 않습니다.</CitationBlock></section>
<section id="memory-pool" data-teach-level="7" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">16. 여러 기록이 같은 공간을 쓸 때의 조건</h2><div className={prose}>
<p>PyTorch는 캡처 중 할당한 공간의 가상 주소를 유지하려고 graph 전용 메모리 pool을 사용합니다. 기록 객체와 캡처에서 만든 tensor의 수명이 끝나기 전까지 필요한 주소가 살아 있어야 합니다. 입력 A처럼 밖에서 만든 tensor도 재생 전에 해제되지 않도록 관리합니다.</p>
<p>(가정) 세 graph의 임시 작업 공간이 16·24·32 KiB이고 별도로 잡으면 합계 72 KiB입니다. 서로 동시에 실행하지 않고 필요한 수명 조건을 지키며 그 임시 공간을 완전히 재사용할 수 있다는 모형에서는 최대 32 KiB로 충분합니다. 실제 예약 메모리에는 살아 있는 출력과 allocator의 배치 등이 더해지므로 이 max 계산을 보장된 사용량으로 읽을 수 없습니다.</p>
<p>공식 문서는 같은 캡처 순서로 재생하고 동시 실행하지 않는 공유 조건을 설명합니다. 서로의 출력에 의존하지 않는 별도 graph는 동시 실행하지 않는 조건으로 공간을 공유할 수도 있습니다. 따라서 크기별 그래프를 반드시 캡처 순서로만 골라야 한다는 설명도 불완전합니다.</p>
<p>공유한 공간의 출력은 다른 graph의 재생으로 덮일 수 있습니다. 앞 답 22를 남겨야 한다면 덮어쓰기 전에 별도 복사본이 필요합니다. 과거의 35개×200 MB=7 GB와 공유 후 200 MB 계산도 이런 임시 공간의 완전 재사용을 가정한 산술로만 성립합니다. 준비한 graph 수만으로 실제 메모리 절감량을 확정할 수 없습니다.</p></div>
<CitationBlock type="code" citeKey={4} source="PyTorch 2.14 · Sharing memory across captures" href="https://docs.pytorch.org/docs/2.14/notes/cuda.html#sharing-memory-across-captures">재생 순서, 동시 실행, 출력 수명은 서로 다른 조건입니다. vLLM 원문도 공유 pool과 출력 참조의 수명을 함께 관리합니다.</CitationBlock></section>
<section id="tradeoffs" data-teach-level="7" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">17. 반복할수록 준비 비용을 나눠 냅니다</h2><div className={prose}>
<p>(가정) 네 작업을 기록하고 준비하는 추가 비용이 40 μs라고 합시다. 일반 제출은 매회 14 μs, 재생은 매회 10 μs라면 R번의 총시간은 각각 14R과 40+10R입니다. 10번에서는 140 μs로 같고 11번에서는 154 μs와 150 μs이므로 재생 쪽이 4 μs 빠릅니다.</p>
<p>순이득을 원하면 준비 비용을 매회 실제 절감량으로 나눈 값보다 반복 횟수가 커야 합니다. 정확히 나누어떨어졌을 때 올림값은 동률이므로 그때부터 더 빠르다고 표현하면 부정확합니다. 또한 GPU 계산과 CPU 제출이 겹치므로 CPU 제출에서 없앤 시간 전체가 지연 절감량은 아닙니다.</p></div>
<ExplainedFormula question="언제 준비 비용보다 더 많이 아낄까요?" idea="같은 반복 횟수의 전체 완료 시간을 비교합니다. 추가 복사와 패딩을 포함한 매회 비용 차이를 분모에 넣습니다." formula={String.raw`C+RT_g<RT_e\iff R>C/(T_e-T_g)`} annotatedFormula={String.raw`\begin{aligned}C+RT_g&<RT_e\\R&>\frac{\underbrace{C}_{\text{추가 준비}}}{\underbrace{T_e-T_g}_{\text{매회 실제 절감}}}\\R&>40/(14-10)=10\end{aligned}`} operations={[{expression:String.raw`T_e-T_g`,annotation:"같은 측정 경계에서 일반 실행과 재생의 반복 비용 차이"},{expression:String.raw`R>C/(T_e-T_g)`,annotation:"누적 절감이 추가 준비 비용보다 커지는 조건"}]} terms={[{symbol:"C",name:"추가 준비",description:"비교 대상보다 추가로 드는 캡처·실행 준비 등 고정 비용입니다."},{symbol:"T_e,T_g",name:"반복 비용",description:"필요한 입력 복사와 출력 보존까지 포함해 같은 경계에서 잽니다."},{symbol:"R",name:"반복 횟수",description:"같은 준비를 재사용할 양의 정수 횟수입니다."}]} assumptions={["두 경로가 같은 결과를 만들고 반복 비용이 고정됩니다.","T_e가 T_g보다 클 때의 식입니다. 같거나 작으면 양의 준비 비용을 회수하지 못합니다."]} interpretation="가정한 40 μs와 4 μs 절감은 10회 동률·11회 순이득입니다. 가정한 400 μs와 8 μs 절감이라면 50회 동률·51회 순이득입니다."/>
<div className={prose}><p>크기를 60개 준비하고 크기당 준비에 100 ms가 든다는 별도 가정은 6초입니다. 준비 시간이 커지는지, 패딩을 줄여 매회 비용을 줄이는지 같은 요청 분포에서 함께 확인합니다. 전체를 하나로 묶는 FULL과 호환되는 일부만 묶는 PIECEWISE도 실제 지원 조건과 반복 비용으로 비교합니다.</p></div></section>
<section id="measurements" data-teach-level="7" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">18. 측정된 시간에서 무엇을 빼도 되는가</h2><div className={prose}>
<p>NVIDIA의 2019년 글은 V100·CUDA10.1에서 500,000개 원소를 처리하는 kernel을 20번씩 1,000회 반복했습니다. 장치 kernel 시간은 2.9 μs였고 CPU 벽시계 총시간을 kernel 수로 나눈 값은 매 kernel 동기화 9.6 μs, 반복 끝 동기화 3.8 μs, graph 사용 3.4 μs였습니다. 마지막 3.4에는 한 번의 생성·실행 준비 약 400 μs도 나누어 포함됩니다.</p>
<p>따라서 20×(3.4−2.9)=10 μs를 순수 CPU graph 호출 시간이라고 단정할 수 없습니다. 서로 다른 측정 경계의 차이에는 실행 간격과 동기화, 초기 비용 등이 섞입니다. 또한 400/8=50을 이 실험의 정확한 손익분기라고 계산하면 이미 평균에 들어간 준비 비용을 다시 더하는 문제가 생깁니다. 앞 절의 400과 8은 서로 독립적으로 정한 가정으로 구분했습니다.</p></div>
<CitationBlock type="code" citeKey={5} source="Alan Gray · Getting Started with CUDA Graphs · 2019" href="https://developer.nvidia.com/blog/cuda-graphs/">3.8과 3.4는 이 실험의 전체 시간을 나눈 값입니다. 원문도 측정 도구의 영향과 첫 제출의 추가 비용을 따로 설명합니다.</CitationBlock>
<div className={prose}><p>2024년의 별도 NVIDIA 측정은 CPU가 graph 호출에 들어가서 반환할 때까지의 시간을 정의합니다. RTX3060·Xeon Silver4208·CUDA12.6에서 이미 업로드된 직선형 kernel graph의 반복 호출은 10개 이상 node에서 약 2.5 μs+node당 1 ns였다고 보고합니다. 이것은 모든 그래프·모든 세대에서 비용이 N과 무관하다는 정리가 아닙니다.</p>
<p>그 원문은 첫 제출과 반복 제출, CPU 호출 구간과 장치 실행, 최종 완료 시간을 따로 비교합니다. 우리의 시간표도 어느 시각을 재는지 먼저 정하는 연습입니다. 실제 판단에서는 준비를 마친 반복과 첫 실행을 나누고 동일한 입력·동기화·결과 보존 범위로 비교합니다.</p></div>
<CitationBlock type="code" citeKey={6} source="Hoffman·Oh · Constant Time Launch for Straight-Line CUDA Graphs · 2024" href="https://developer.nvidia.com/blog/constant-time-launch-for-straight-line-cuda-graphs-and-other-performance-enhancements/">반복 CPU 호출의 거의 일정한 비용은 구조·장치 세대·버전·업로드 상태를 지정한 결과입니다.</CitationBlock></section>
<section id="research" data-teach-level="7" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">19. 복사 비용과 다시 시작하는 비용도 연구 대상입니다</h2><div className={prose}>
<p>2025년 PyGraph는 정적 자리에 큰 입력을 복사하는 비용이 graph의 이득을 줄일 수 있다는 문제를 다룹니다. 대응하는 kernel을 바꾸어 큰 데이터 대신 주소를 담은 작은 표를 갱신하는 parameter indirection을 사용하고 복사·관리 비용까지 측정해 graph를 쓸지 고릅니다. 우리의 A에 5를 복사하는 단계를 줄이려면 그 주소표를 읽도록 실제 kernel도 맞아야 합니다.</p>
<p>같은 수치 사례에 적용하면 주소표가 A를 가리킬 때 입력 3의 답은 22이고 B를 가리킬 때 입력 5의 답은 30입니다. 이 비교는 논문의 방법을 설명하는 가정입니다. 일반 replay의 인수가 저절로 B로 바뀐 결과가 아니며 주소표를 읽는 kernel과 그 표의 갱신이 함께 필요합니다.</p>
<p>논문의 PyTorch2.4·CUDA12.1·RTX A6000 실험은 183개 후보 중 graph의 이득을 받을 20개 과제를 선택했습니다. 작게 복사하는 경우에는 주소표를 옮기는 비용이 오히려 클 수 있다는 경계도 설명합니다. 이 연구 결과를 현재 PyTorch 모든 호출의 동작이나 모든 과제의 성능 보장으로 옮기지 않습니다.</p></div>
<CitationBlock type="paper" citeKey={7} source="PyGraph: Robust Compiler Support for CUDA Graphs in PyTorch · 2503.19779v1 §5.3–6" href="https://arxiv.org/html/2503.19779v1">정적 입력 복사와 선택 비용을 분리한 연구입니다. 이 글에서는 원문 설계와 실험 범위를 읽었으며 해당 컴파일러를 재실행하지 않았습니다.</CitationBlock>
<div className={prose}><p>2026년 Foundry는 새 프로세스를 띄울 때 graph를 다시 캡처하는 비용을 다룹니다. 네 작업의 연결만 저장해도 새 실행에서 A의 주소와 kernel 함수가 살아 있다는 보장은 없습니다. 논문은 주소 배치와 캡처 구간의 할당 기록, 필요한 kernel 바이너리를 함께 복원하고 같은 topology의 node 인수만 갱신합니다. 결과를 만드는 주소와 실행 문맥도 저장 대상입니다.</p>
<p>우리의 입력 5를 새 프로세스에서 처리하려면 기록된 A의 주소 공간을 다시 확보하고 그 주소에 5를 준비하며 네 작업의 실행 코드도 복원해야 합니다. 이 조건을 만족시키면 같은 연산의 답 30을 기대할 수 있습니다. 주소 확보나 실행 코드의 호환성을 보장하지 못하면 연결 목록만 복사한 것으로 재생을 보장할 수 없습니다.</p>
<p>§6의 주 실험은 H200, CUDA13.1, vLLM0.11.2, PyTorch2.9와 512개 크기입니다. Qwen3-235B-A22B의 EP8·BF16 사례에서 650초→3.9초를 보고하지만 환경 초기화와 가중치 적재 시간을 제외한 조건입니다. 이 수치를 새 서버의 전체 기동 시간으로 소개하면 범위를 넘습니다. 본문의 vLLM0.27.1 원문 분기와도 별도의 연구 구현입니다.</p></div>
<p className={prose}>두 연구를 앞선 조건과 연결해 봅시다. 15절의 일반 재생에서는 A에 값을 복사하고 명시적 CUDA 갱신은 허용된 인수를 직접 바꿉니다. PyGraph는 주소표를 읽게 kernel을 바꾸는 경로입니다. 새 값을 선택한다는 목적은 같아도 필요한 API와 실행 코드가 다릅니다.</p><p className={prose}>16절의 72→32 KiB는 같은 실행 환경에서 임시 공간을 재사용한다는 가정이었습니다. Foundry의 새 프로세스에서는 먼저 그 공간의 주소와 실행 문맥부터 복원해야 합니다. 어느 경우에도 앞 답 22가 덮이기 전에 보관하는 조건은 남으며 공간 재사용과 출력 보존 비용을 함께 계산합니다.</p>\n<CitationBlock type="paper" citeKey={8} source="Foundry: Template-Based CUDA Graph Context Materialization for Fast LLM Serving Cold Start · 2604.06664v1 §4–6" href="https://arxiv.org/html/2604.06664v1">같은 가상 주소와 kernel 복원, 고정한 KV 크기가 재시작 설계의 전제입니다. 원문 설계·평가를 검토했으며 Foundry의 실행이나 성능 재현을 주장하지 않습니다.</CitationBlock></section>
<section id="limits" data-teach-level="7" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">20. 같은 답과 같은 측정 범위를 먼저 확인합니다</h2><div className={prose}>
<p>Graph를 사용할 수 있는지와 사용하면 빠른지는 다른 판정입니다. 주소와 크기, 의존성, 출력 수명이 맞아야 같은 답을 얻습니다. 그 뒤 입력 복사·패딩·준비 횟수까지 포함한 시간을 비교해야 반복 실행의 이득을 알 수 있습니다. 이 글의 CPU 원문 관찰은 Python 선택 분기를 확인했으며 실제 GPU의 캡처 호환성과 지연은 확인하지 않았습니다.</p>
<p>재생으로 CPU 제출이 줄어도 스케줄링과 결과 판정이 남습니다. GPU 값을 CPU가 언제 기다리는지에 따라 다음 일을 미리 준비할 수 있는 범위가 달라집니다. <Link to="/cs/ai/launch-overhead-and-cpu-gpu-synchronization">제출과 동기화를 다루는 다음 글</Link>에서는 이 시간의 겹침을 더 자세히 살펴봅니다.</p></div><ContentBoundary article="cuda-graph-capture" /></section>
<section id="review" data-teach-level="review" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">21. 조건을 바꾸어 예측해 봅니다</h2><div className={prose}><p>기록을 재사용하는 이득은 네 계산을 없애는 데서 생기지 않았습니다. 같은 계산을 덜 준비하면서도 주소와 순서가 계속 맞게 유지하는 데서 생겼습니다. 다음 조건을 바꾸어 답과 시간을 각각 예측해 보세요.</p></div>
<ReviewPrompts questions={[
"A에는 3을 남기고 Python 변수만 B의 5로 바꾸면 일반 정적 재생 결과는 22와 30 중 무엇인가요? (답: 9절)",
"작업 전달 2 μs·계산 3 μs·graph 제출 2 μs라면 CPU 제출 횟수가 줄어도 완료가 14 μs인 까닭은 무엇인가요? (답: 8절)",
"준비한 최대 크기가 32일 때 33토큰을 보내면 32짜리 graph를 재생할까요? (답: 14절)"
]}/></section>
</div><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={projectMetas}/></>;}
