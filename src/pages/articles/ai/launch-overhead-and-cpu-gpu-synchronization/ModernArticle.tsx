import {Link} from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import {CitationBlock} from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import {CodeSidebar,CodeViewButton,useCodeSidebar} from "@/components/code";
import {codeRefs,fileTrees,projectMetas} from "./codeRefs";
import SubmissionTimelineViz from "./viz/SubmissionTimelineViz";
const prose="prose prose-neutral max-w-none dark:prose-invert";
export default function LaunchOverheadArticle(){const sidebar=useCodeSidebar();const code=(key:string,label:string)=><div className="my-6"><CodeViewButton label={label} onClick={()=>sidebar.open(key,codeRefs[key])}/></div>;return <><div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">1. 계산이 빨라도 다음 일을 기다릴 수 있습니다</h2><div className={prose}>
<p>빠른 계산 장치를 붙였는데도 결과가 기대만큼 빨리 나오지 않을 때가 있습니다. 일을 정하고 전달하는 쪽이 다음 지시를 준비하는 동안 계산하는 쪽이 비어 있기 때문일 수 있습니다. 반대로 계산이 길면 전달을 빨리 해도 마지막 결과가 나오는 시각은 거의 달라지지 않습니다. 어느 쪽이 기다리는지를 먼저 보아야 바꿀 곳을 찾을 수 있습니다.</p>
<p>이 글은 준비하는 쪽과 계산하는 쪽의 시계를 나란히 놓습니다. 일을 전달한 시각, 계산이 끝난 시각, 다음 결과가 나올 때까지의 간격을 따로 읽겠습니다. 같은 연산을 세 번 반복하면서 기다리는 위치만 바꾸면 세 시간의 차이가 드러납니다.</p>
<p>목표는 기다림을 무조건 없애는 것이 아닙니다. 이미 정해진 다음 일을 미리 전달해도 되는지, 앞의 답을 실제로 읽어야 다음 일을 고를 수 있는지 구분해야 합니다. 마지막에는 이 구분이 라이브러리의 어떤 호출로 표현되는지 확인합니다.</p>
</div></section>
<section id="black-box" data-teach-level="B" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">2. 전달한 일과 끝난 일을 따로 기록합니다</h2><div className={prose}>
<p>
            큰 흐름은 세 부분입니다. 준비하는 쪽이 다음 작업을 정하고 전달한 작업은 순서를 기다리며 계산하는 쪽이 앞의 결과를 이용해 실행합니다. 작업 지시를 받은 것만으로 답이
            생기지는 않습니다. 답을 읽으려는 쪽은 그 답을 만드는 계산까지 끝났는지 확인해야 합니다.
          </p>
<p>다음 작업이 앞 결과에 2를 곱하는 일이라고 해 보겠습니다. 준비하는 쪽이 앞 결과의 숫자를 직접 알 필요는 없습니다. 어디에 결과가 놓일지와 그 뒤에 실행하라는 순서를 전달하면 됩니다. 계산하는 쪽은 실제로 2를 곱할 때 앞 결과를 읽습니다.</p>
<p>앞 결과가 18이면 멈추고 아니면 계속하라는 결정은 다릅니다. 그 결정을 준비하는 쪽에서 한다면 18인지 알 때까지 다음 작업을 확정할 수 없습니다. 계산에 데이터가 필요한 때와 다음 지시를 고르기 위해 데이터가 필요한 때를 나누면 어떤 기다림을 겹칠 수 있는지 보입니다.</p>
</div></section>
<section id="case" data-teach-level="0" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">3. 같은 두 연산을 세 회 반복합니다</h2><div className={prose}>
<p>(가정) 처음 값 3에 1을 더하고 2를 곱합니다. 첫 회는 3 → 4 → 8입니다. 같은 두 연산을 다시 하면 8 → 9 → 18, 세 번째는 18 → 19 → 38이 됩니다. 세 회를 모두 하기로 미리 정했으며 준비하는 쪽이 중간 숫자를 읽지 않아도 다음 지시를 고를 수 있다고 가정합니다.</p>
<p>
            한 회의 준비에는 2 μs가 들고 연산 하나의 지시를 전달하는 데는 3 μs가 든다고 둡니다. 각 계산 자체는 2 μs입니다. 지시가 완전히 전달된 뒤에만 계산을 시작할 수
            있습니다. 두 계산은 앞뒤 관계가 있어 동시에 실행하지 않지만 전달과 계산은 겹칠 수 있습니다.
          </p>
<p>첫 회에서 준비는 0–2 μs, 첫 지시 전달은 2–5 μs입니다. 첫 계산은 5–7 μs에 실행되어 4를 만듭니다. 두 번째 지시는 5–8 μs에 전달하므로 첫 계산과 겹칩니다. 8 μs에 두 번째 계산을 시작해 10 μs에 답 8을 얻습니다.</p>
<p>전달하는 쪽은 두 번째 지시를 보낸 8 μs부터 다음 회를 준비할 수 있습니다. 앞 계산은 10 μs에 끝나지만 다음 계산이 쓸 결과의 자리는 미리 정해져 있습니다. 아직 값 8을 직접 읽지 못했다는 이유만으로 다음 지시를 만들 수 없는 것은 아닙니다.</p>
<p>여기서 8이라는 숫자는 두 번 등장합니다. 데이터 8은 첫 회의 답이고 8 μs는 두 번째 지시를 다 보낸 시각입니다. 우연히 숫자가 같을 뿐이며 데이터 8을 사용할 수 있는 시각은 10 μs입니다. 값의 변화와 시간표를 따로 따라가겠습니다.</p>
</div></section>
<section id="picture" data-teach-level="1" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">4. 빈 구간을 보면 기다림의 위치가 보입니다</h2><div className={prose}>
<p>세 회의 지시를 미리 보내면 각 회의 답은 10·18·26 μs에 나옵니다. 준비하는 쪽은 24 μs에 일을 모두 전달했고 계산하는 쪽은 26 μs에 끝납니다. 계산 여섯 개에 실제로 쓴 시간의 합은 12 μs입니다. 세 숫자는 각각 다른 구간을 셉니다.</p>
<p>매회 답을 확인한 뒤 다음 준비를 시작하면 완료 시각은 10·20·30 μs가 됩니다. 첫 회의 8 μs부터 다음 준비를 하던 구간이 사라지고 10 μs부터 준비합니다. 두 번째 회가 끝난 20 μs에도 같은 일이 반복됩니다. 연산과 답은 같지만 마지막 완료는 4 μs 늦습니다.</p>
<p>이미 정해진 두 연산의 목록을 한 번에 전달할 수도 있다고 가정해 보겠습니다. 목록 전달 비용만 1 μs로 바꾸면 첫 회 준비 0–2 μs 뒤 목록을 2–3 μs에 전달합니다. 계산은 3–5·5–7 μs에 이어집니다. 계산 두 개가 하나로 합쳐진 것은 아닙니다.</p>
<p>그 목록을 미리 보내는 세 회는 7·11·15 μs에 끝납니다. 매회 끝날 때까지 기다리면 7·14·21 μs입니다. 기다림이 남아 있어도 하나씩 전달하며 기다리던 30 μs보다는 빠릅니다. 어떤 비용을 줄였는지 보려면 기다림의 유무와 전달 방식 두 조건을 따로 바꾸어야 합니다.</p>
</div><SubmissionTimelineViz /></section>
<section id="why" data-teach-level="2" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">5. 두 시계를 맞추는 규칙이 필요합니다</h2><div className={prose}>
<p>계산을 시작하는 조건은 두 가지입니다. 지시가 도착해야 하고 앞 계산도 끝나야 합니다. 첫 회 두 번째 계산에서는 앞 결과가 7 μs에 준비되지만 지시는 8 μs에 도착합니다. 늦은 쪽인 8 μs까지 기다리는 규칙이 결과를 올바르게 만듭니다.</p>
<p>목록을 함께 전달한 경우에는 두 지시가 모두 3 μs에 도착해 있습니다. 그래도 두 번째 계산은 첫 결과가 나오는 5 μs부터 시작합니다. 빨리 전달한다는 것이 앞뒤 계산 순서를 없앤다는 뜻은 아닙니다. 전달이 충분히 빠르면 기다림의 원인이 계산 쪽으로 이동합니다.</p>
<p>준비하는 쪽이 답을 읽을 때도 규칙이 필요합니다. 첫 회의 답 8을 8 μs에 읽으려 하면 아직 계산이 끝나지 않았습니다. 10 μs까지 기다려야 올바른 값을 읽습니다. 읽는 일을 줄이려면 그 값 없이 다음 일을 결정할 수 있는지부터 확인해야 합니다.</p>
<p>모든 지시를 끝없이 앞서 보낼 수 있다고 가정한 것도 한계입니다. 실제 프로그램에는 처리 중인 요청과 그 요청이 사용하는 공간을 남겨 둘 수 있는 양이 정해져 있습니다. 너무 많은 일을 미리 보냈다면 완료를 기다려 자리를 돌려받아야 합니다. 이 기다림은 계산 순서를 어겨도 된다는 허가가 아닙니다.</p>
<p>작은 사례에서 필요한 부품의 역할은 이제 정해졌습니다. 일을 전달하는 경로, 순서를 보존하는 실행열, 완료를 확인하는 지점입니다. 다음부터는 각각을 실제 이름으로 부르며 같은 여섯 계산이 언제 실행되는지 다시 추적합니다.</p>
</div></section>
<section id="names" data-teach-level="3" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">6. 역할에 CPU와 GPU의 이름을 붙입니다</h2><div className={prose}>
<p>준비하고 지시를 전달하는 쪽이 이 사례의 CPU이고 실제 연산을 실행하는 쪽이 GPU입니다. GPU에 전달하는 실행 단위를 kernel이라고 부릅니다. CPU에서 호출이 돌아온 것과 GPU kernel이 끝난 것은 별개의 사건입니다.</p>
</div><TermBreakdown title="역할 → 이름 → 이 글의 숫자" items={[
{term:"Host launch overhead",description:"Host는 여기서 CPU 쪽입니다. Kernel 실행을 요청하는 호출 경로가 소비하는 시간을 가리키며 측정 경계를 먼저 정해야 합니다.",example:"가정한 kernel당 전달 시간 3 μs",boundary:"Python 준비·dispatcher·driver 중 무엇을 포함했는지에 따라 값이 달라집니다. 모든 크기와 환경에서 일정한 상수는 아닙니다."},
{term:"CUDA stream",description:"GPU 작업의 앞뒤 실행 순서를 표현하는 실행열입니다. 같은 stream의 뒤 작업은 앞 작업의 결과를 이어 사용할 수 있습니다.",example:"+1 뒤에 ×2, 세 회를 같은 순서로 제출",boundary:"서로 다른 stream에는 필요한 데이터 의존성을 따로 연결해야 합니다."},
{term:"CPU–GPU synchronization",description:"이번 글에서는 CPU가 GPU 작업의 완료를 확인하며 기다리는 지점을 가리킵니다. GPU 작업끼리 순서를 연결하는 동기화도 있으므로 주체를 함께 말합니다.",example:"매회 답을 읽고 다음 준비를 시작",boundary:"Stream 하나를 기다리는 호출과 장치 전체를 기다리는 호출은 범위가 다릅니다."},
{term:"CPU submission bottleneck",description:"CPU가 다음 작업을 전달하는 속도가 전체 반복의 진행 속도를 제한하는 상태입니다.",example:"한 회 준비·전달 8 μs, GPU 계산 합계 4 μs",boundary:"첫 결과 지연과 장기 반복 간격은 별도로 계산합니다."},
{term:"GPU starvation",description:"필요한 다음 작업이 아직 준비되지 않아 GPU 실행열이 비는 현상입니다.",example:"첫 회 7–8 μs에는 다음 지시가 아직 도착하지 않음",boundary:"관측한 GPU 빈 시간만으로 CPU가 원인이라고 확정할 수는 없습니다."},
{term:"CUDA Graph replay",description:"미리 준비한 작업과 의존성의 기록을 다시 제출하는 실행입니다. 이 사례에서는 두 kernel의 제출을 묶습니다.",example:"가정한 목록 제출 1 μs와 실제 계산 두 개",boundary:"기록과 주소의 계약은 CUDA Graph 글에서 다룹니다. Replay가 kernel fusion을 자동으로 뜻하지는 않습니다."}
]}/><ContentBoundary article="launch-overhead-and-cpu-gpu-synchronization"/></section>
<section id="async-trace" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">7. 같은 세 회를 CPU와 GPU에서 추적합니다</h2><div className={prose}>
<p>첫 회의 CPU 준비와 두 launch는 0–2·2–5·5–8 μs입니다. GPU는 5–7 μs에 4를 만들고 8–10 μs에 8을 만듭니다. CPU는 8–10 μs에 다음 회를 준비할 수 있습니다. 준비하는 내용은 어디에 1을 더하고 어느 결과에 2를 곱할지이며 아직 값 8을 CPU로 가져오지 않습니다.</p>
<p>두 번째 회의 launch는 10–13·13–16 μs입니다. GPU는 13–15 μs에 9를, 16–18 μs에 18을 만듭니다. 세 번째 회의 CPU 준비는 16–18 μs, launch는 18–21·21–24 μs입니다. GPU가 21–23 μs에 19를 만들고 24–26 μs에 38을 만들면 끝납니다.</p>
<p>CPU가 한 회를 제출하는 데 걸리는 시간은 준비 2에 launch 3을 두 번 더한 8 μs입니다. 이 사례의 완료 간격도 8 μs입니다. GPU 계산 두 개의 합계 4 μs만으로는 다음 회가 언제 시작할지 알 수 없습니다. 다음 지시가 도착하기를 기다리는 빈 구간이 있기 때문입니다.</p>
</div></section>
<section id="waiting-trace" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">8. 값을 읽는 위치가 다음 준비를 늦춥니다</h2><div className={prose}>
<p>첫 회 뒤 CPU가 답을 읽도록 바꾸겠습니다. 추가 복사 비용과 대기 호출 자체의 비용을 0으로 둔 이 모형에서도 CPU는 10 μs까지 기다립니다. 다음 회 준비는 10–12 μs로 밀리고 launch는 12–15·15–18 μs가 됩니다. GPU 계산은 15–17·18–20 μs입니다.</p>
<p>두 번째 답을 읽은 뒤 세 번째 준비를 하면 마지막 결과는 30 μs에 나옵니다. CPU에서 보이는 대기 시간 일부는 GPU가 필요한 계산을 마치는 시간입니다. 대기 호출 한 줄을 지웠다고 그 계산 자체가 사라지지는 않습니다. 다음 준비를 그 계산과 겹칠 수 있을 때 전체 시간이 줄어듭니다.</p>
<p>추론 실행기를 생각하면 요청을 고르는 일과 결과를 전달할 형태로 바꾸는 일에도 CPU 시간이 듭니다. 이런 작업이 실행을 제한하는 상태를 runtime CPU bottleneck이라고 합니다. 각 실행기가 샘플링을 CPU와 GPU 중 어디서 수행하는지는 다를 수 있으므로 모든 sampler 시간을 CPU 비용으로 넣으면 안 됩니다.</p>
</div></section>
<section id="graph-comparison" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">9. 묶어서 제출해도 남는 비용을 셉니다</h2><div className={prose}>
<p>CUDA Graph로 두 kernel을 묶어 제출하는 시간을 1 μs로 둡니다. 첫 준비 0–2 μs와 제출 2–3 μs 뒤 GPU는 3–5·5–7 μs에 계산합니다. CPU는 3–5 μs에 다음 회를 준비하고 5–6 μs에 다음 기록을 제출합니다. 두 번째 회는 앞 계산이 끝나는 7 μs부터 11 μs까지 실행됩니다.</p>
<p>세 번째 기록은 8–9 μs에 제출되고 GPU는 11–15 μs에 계산합니다. CPU 제출 종료 9 μs를 전체 완료시간으로 보고하면 아직 실행하지 않은 구간을 빠뜨립니다. Graph replay latency라고 쓸 때도 host 호출의 길이인지 마지막 GPU 작업 완료까지인지 경계를 적어야 합니다.</p>
<p>매회 완료를 기다리는 graph 실행은 7·14·21 μs에 끝납니다. 동기화가 있어도 eager의 10·20·30 μs보다 빠릅니다. 다만 미리 제출한 graph의 마지막 완료 15 μs까지 줄이지는 못합니다. CPU 준비, 제출, 결과 대기를 따로 보아야 남은 비용을 찾을 수 있습니다.</p>
<p>Fusion은 kernel을 합쳐 전달 횟수와 중간 데이터 이동 등을 바꾸고 batch는 한 작업에 넣는 데이터 양을 바꿉니다. Graph는 이 사례처럼 kernel을 그대로 두고 반복 제출 경로를 줄일 수 있습니다. 셋을 모두 “kernel당 CPU 비용은 같고 분모만 커진다”로 설명하면 바뀐 실행 내용과 새 비용을 놓칩니다.</p>
</div></section>
<section id="finite-and-steady" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">10. 첫 완료시간과 반복 간격은 다른 식입니다</h2><div className={prose}>
<p>같은 일을 여러 번 하는 경우에도 첫 결과는 첫 launch를 기다려야 합니다. 준비 시간 S, kernel 수 N, kernel당 제출 시간 L과 실행 시간 E를 가정하겠습니다. j번째 제출 완료가 S+jL이라면 그 계산은 이 시각과 앞 계산 완료 중 늦은 때에 시작합니다.</p>
</div><ExplainedFormula question="빈 실행열에 제출한 한 회는 정확히 언제 끝날까요?" idea="첫 계산은 준비와 첫 제출 뒤에 시작합니다. 이후 계산의 간격은 제출 L과 실행 E 중 긴 쪽입니다." formula={String.raw`r_j=S+jL,\quad e_j=\max(r_j,e_{j-1})+E,\quad T_1=S+L+E+(N-1)\max(L,E)`} annotatedFormula={String.raw`\begin{aligned}r_j&=S+jL\\e_0&=0\\e_j&=\max(r_j,e_{j-1})+E\\T_1&=\underbrace{S+L+E}_{\text{첫 계산 완료}}\\&\quad +(N-1)\max(L,E)\end{aligned}`} operations={[{expression:String.raw`\max(r_j,e_{j-1})`,annotation:"지시와 앞 결과가 모두 준비된 때를 선택"},{expression:String.raw`S+L+E+(N-1)\max(L,E)`,annotation:"첫 완료에 나머지 동일 계산의 간격을 더함"}]} terms={[{symbol:"S,L,E",name:"세 시간",description:"회별 CPU 준비, kernel당 CPU 제출, kernel당 GPU 실행 시간입니다. 모두 같은 시간 단위를 씁니다."},{symbol:"N,j",name:"계산 개수와 순서",description:"N은 양의 정수이고 j는 1부터 N까지입니다."},{symbol:"r_j,e_j,T_1",name:"제출과 완료",description:"j번째 제출 완료, j번째 실행 완료, 빈 실행열에서 첫 회 전체 완료입니다."}]} assumptions={["같은 실행시간 E인 N개 kernel이 단일 stream에 순서대로 들어갑니다.","지시가 제출 완료 때 도착하며 초기화·복사·동기화 호출 자체의 추가 비용은 제외합니다."]} interpretation="S=2, L=3, E=2, N=2이면 첫 완료는 2+3+2+3=10 μs입니다. 매회 이 완료를 기다린다면 같은 10 μs를 다시 씁니다."/>
<div className={prose}><p>미리 정해진 일을 무한히 앞서 제출할 수 있는 이상 모형의 장기 평균 완료 간격은 max(S+NL, NE)입니다. CPU 한 회 제출량과 GPU 한 회 실행량 중 큰 값이 처리율을 제한하기 때문입니다. 이 식은 첫 결과 지연을 뜻하지 않습니다. 시간의 변동, 다음 답을 보고 고르는 분기, 유한한 미완료 작업 한도가 생기면 그대로 적용하지 않습니다.</p>
<p>우리 사례에서는 CPU 8 μs와 GPU 4 μs를 비교해 간격 8 μs입니다. Graph의 장기 간격은 max(S+G, NE)이며 G=1이면 max(3,4)=4 μs입니다. 첫 graph 완료는 S+G+NE=7 μs입니다. 그래서 세 회 완료가 7·11·15 μs로 나옵니다.</p>
</div><ProgressiveDetail title="300개 kernel 사례에서는 첫 실행도 항상 빨라질까요?" preview="가정한 graph 제출 비용이 첫 eager 제출보다 크면 첫 결과는 늦고 반복 간격은 짧아질 수 있습니다.">
<p>(가정) S=1 ms, N=300, L=0.005 ms이며 각 kernel의 E는 2/300 ms로 같습니다. E가 L보다 크므로 첫 완료는 1+0.005+2=3.005 ms입니다. 미리 제출한 반복 간격은 max(2.5,2)=2.5 ms이고 세 회 완료는 3.005·5.505·8.005 ms입니다.</p>
<p>Graph 제출 G를 0.06 ms로 두면 첫 완료는 1+0.06+2=3.06 ms입니다. 첫 결과는 0.055 ms 늦지만 반복 간격은 max(1.06,2)=2 ms여서 세 회 완료가 3.06·5.06·7.06 ms입니다. 매회 완료를 기다리는 경우에는 eager 3.005 ms와 graph 3.06 ms가 반복되므로 이 조건에서 graph가 더 느립니다.</p>
<p>처음부터 GPU 계산 합계를 4 ms로 바꾸면 첫 eager 완료는 5.005 ms입니다. 제출 비용 1.5 ms가 장기 처리율을 제한하지 않는다고 해서 첫 제출 지연까지 모두 숨는 것은 아닙니다. 실제 token 간격에는 샘플링과 전송 등도 들어갈 수 있어 이 모형의 완료 간격을 그대로 사용자의 TPOT라고 부르지 않습니다.</p>
</ProgressiveDetail></section>
<section id="measurement" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">11. 측정 시작과 끝을 먼저 표시합니다</h2><div className={prose}>
<p>기본 eager 세 회에서 동기화 없는 CPU 타이머를 제출 직전부터 마지막 호출 반환까지 재면 24 μs입니다. 마지막 결과 완료까지 기다려 재면 26 μs입니다. GPU kernel 시간의 합은 12 μs입니다. 더 작은 숫자를 얻었다는 것만으로 같은 작업을 더 빨리 마쳤다고 주장할 수 없습니다.</p>
<p>전체 0–26 μs 범위에서 GPU가 계산한 비율은 12/26=6/13, 약 46.15%입니다. 첫 준비의 영향을 뺀 이 모형의 반복 구간에서는 회마다 4/8=50%입니다. 단순히 제출 L=5 μs·실행 E=4 μs만 반복하고 다른 준비가 없는 별도 모형의 장기 비율은 4/5=80%입니다. 서로 다른 구간과 조건의 비율을 섞지 않습니다.</p>
<p>CUDA event는 실행열에 기록한 두 시점 사이의 경과시간을 재는 데 쓸 수 있습니다. 그 사이에 GPU가 다음 지시나 의존성을 기다린 시간도 들어갈 수 있으므로 kernel 실행시간의 합과 같다고 가정하지 않습니다. 완료 확인을 한 뒤 시간을 읽고 CPU 벽시계와 event가 각각 어느 범위를 측정하는지 기록합니다.</p>
<p>실제 비교는 초기화와 준비 실행을 마친 뒤 같은 입력·같은 batch·같은 출력 조건에서 합니다. 첫 graph 준비와 첫 replay는 반복 replay와 따로 재고 필요한 반복 횟수도 기록합니다. Profiler는 호출과 빈 구간의 관계를 보여 주지만 짧은 호출 자체를 느리게 만들 수 있어 전체 완료시간 측정과 함께 해석합니다.</p>
</div><CitationBlock type="code" citeKey={1} source="NVIDIA CUDA Runtime 13.4 · Event Management / PyTorch 2.14 CUDA semantics" href="https://docs.nvidia.com/cuda/cuda-runtime-api/cuda_runtime_api/group__CUDART__EVENT.html">Event는 기록 사이의 경과시간을 계산합니다. 이 글의 24·26·12 μs는 실측이 아닌 설명용 시간표이며 event API로 측정한 결과가 아닙니다.</CitationBlock></section>
<section id="source-item" data-teach-level="5" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">12. 한 값을 읽는 호출은 어디서 기다릴까요?</h2><div className={prose}>
<p>실제 PyTorch 2.14.0의 <code>item</code>부터 읽겠습니다. 원문 revision은 <code>2b3ec34829036a65cd9d1398ea72a0167dc37470</code>으로 고정했습니다. 이 함수는 원소가 하나인지 검사한 뒤 일반 tensor를 <code>_local_scalar_dense</code>로 넘깁니다. 희소 tensor와 양자화 tensor에는 별도 분기가 있으므로 여기서는 일반 CUDA scalar 하나를 다룹니다.</p>
</div>{code("item","PyTorch · item에서 한 원소 확인과 분기")}<div className={prose}>
<p>CUDA 구현은 CPU에 원소 하나를 담을 공간을 만들고 현재 stream에서 GPU 값을 그곳으로 복사합니다. 이 CPU 공간은 복사에 쓰기 좋게 페이지를 고정한 pinned memory입니다. 원문의 size는 1이고 pin_memory는 true입니다. 복사 후 그 한 원소를 읽어 CPU 쪽 Scalar로 돌려줍니다.</p>
<p>핵심은 복사 helper의 이름만이 아니라 내부 두 줄입니다. CUDA 분기는 <code>cudaMemcpyAsync</code>를 호출한 다음 <code>cudaStreamSynchronize</code>를 호출합니다. 비동기 복사를 제출해도 곧바로 그 stream을 기다린 뒤 읽는 구조입니다. 원문의 앞쪽에는 ROCm 조건 분기도 있으며 일부 장치의 직접 읽기 경로 역시 stream 완료 확인을 거칩니다.</p>
</div>{code("scalar","PyTorch · 한 값을 옮기는 CPU 자리와 현재 stream")}{code("copy-sync","PyTorch · 비동기 복사 뒤 실제 완료 대기")}<div className={prose}>
<p>우리 사례의 첫 회를 같은 stream에 올린 뒤 8 μs에 <code>.item()</code>을 호출한다고 해 보겠습니다. 값 8은 10 μs에 만들어지므로 최소한 그 계산 완료까지 기다려야 합니다. 기본 모형은 복사와 호출 자체의 추가 비용을 0으로 두었습니다. 실제 호출 시간을 2 μs라고 측정했다는 뜻은 아닙니다.</p>
</div><CitationBlock type="code" citeKey={2} source="PyTorch v2.14.0 · Scalar.cpp, CUDAScalar.cu, CUDAFunctions.h" href="https://github.com/pytorch/pytorch/blob/2b3ec34829036a65cd9d1398ea72a0167dc37470/aten/src/ATen/native/cuda/CUDAScalar.cu#L57-L69">일반 CUDA scalar를 읽는 경로를 전체 원문 파일과 함께 보존했습니다. 현재 stream의 올바른 데이터 의존성이 이미 설정되어 있다고 가정합니다.</CitationBlock></section>
<section id="source-scope" data-teach-level="5" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">13. 기다리는 범위와 기다리는 주체를 나눕니다</h2><div className={prose}>
<p>(가정) 앞서 추적한 실행열 A의 마지막 계산은 26 μs에 끝나고 독립 실행열 B에는 50 μs에 끝나는 작업이 있습니다. 추가 호출 비용을 무시하면 A만 기다린 CPU는 26 μs에 진행할 수 있습니다. 장치 전체의 선행 작업을 기다리면 B 때문에 50 μs까지 기다립니다. A가 B에 의존한다면 A의 기다림에도 그 영향이 전파되므로 “독립” 조건이 필요합니다.</p>
<p><code>torch.cuda.synchronize()</code>의 Python 원문은 대상 장치를 선택해 native 함수를 부릅니다. 그 연결 함수는 <code>device_synchronize</code>로 내려가고 끝에는 <code>cudaDeviceSynchronize</code>가 있습니다. <code>.item()</code>에서 본 stream 단위 호출과 다른 범위입니다.</p>
</div>{code("device-python","PyTorch · 선택한 장치의 모든 stream 완료 대기")}{code("device-native","PyTorch · device_synchronize의 CUDA 호출")}<div className={prose}>
<p>반면 <code>A.wait_stream(B)</code>는 CPU가 B의 답을 읽는 호출이 아닙니다. B에 완료 표시인 event를 기록하고 A의 이후 작업이 그 표시를 기다리도록 연결합니다. CPU는 이후 코드를 계속 진행할 수 있습니다. 호출 이후 B에 새로 추가한 모든 미래 작업까지 자동으로 기다리는 뜻도 아닙니다.</p>
<p>따라서 “동기화가 queue를 모두 비운다”는 설명은 너무 넓습니다. 어떤 CPU 대기는 A의 선행 작업만 대상으로 하고 어떤 의존성은 CPU를 세우지 않고 GPU 실행열끼리 연결합니다. 같은 wait라는 단어를 만나면 누가 무엇의 완료를 기다리는지부터 확인합니다.</p>
</div>{code("stream-wait","PyTorch · wait_stream의 기록과 의존성 연결")}</section>
<section id="source-events" data-teach-level="6" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">14. wait와 synchronize는 다른 native 함수로 갑니다</h2><div className={prose}>
<p>Event는 어느 실행 지점까지 끝났는지 표시하는 객체입니다. Python <code>event.wait(A)</code>는 native의 wait에 A를 전달합니다. 연결된 C++ 함수는 <code>CUDAEvent.block(A)</code>를 호출하고 그 안에서는 <code>cudaStreamWaitEvent</code>로 A의 작업 순서를 연결합니다. block이라는 메서드 이름만 보고 CPU를 세운다고 판단하면 이 경로를 잘못 읽게 됩니다.</p>
</div>{code("event-python","PyTorch · Event의 record·wait·synchronize")}{code("event-native","PyTorch · Python 메서드와 C++ 연결")}{code("event-wait","PyTorch · block이 실행열에 넣는 의존성")}<div className={prose}>
<p><code>event.synchronize()</code>는 다른 경로입니다. 이미 생성한 event이면 <code>cudaEventSynchronize</code>를 불러 그 지점의 완료까지 CPU가 기다립니다. A의 마지막 작업 뒤 기록한 event는 이 가정에서 26 μs까지의 A를 나타냅니다. 별개의 B가 50 μs까지 실행 중이라는 이유만으로 그 event의 범위가 장치 전체로 넓어지지는 않습니다.</p>
<p>Event를 만들 때의 <code>blocking=True</code>는 이 host 대기의 방식을 선택하는 flag입니다. CUDA 문서는 CPU를 재우는 blocking 방식과 busy-wait 방식을 구별합니다. 이 옵션이 <code>event.wait(A)</code>를 결과를 읽는 CPU 대기로 바꾸는 것은 아닙니다. 고정한 Python class의 짧은 생성자 설명보다 실제 연결 함수와 CUDA API의 범위를 함께 읽어야 합니다.</p>
</div>{code("event-sync","PyTorch · CPU가 event 완료를 기다리는 경로")}<CitationBlock type="code" citeKey={3} source="CUDA Runtime 13.4 · cudaEventCreateWithFlags / cudaEventSynchronize" href="https://docs.nvidia.com/cuda/cuda-runtime-api/cuda_runtime_api/group__CUDART__EVENT.html">blocking flag는 cudaEventSynchronize를 호출한 host thread가 기다리는 방식을 정합니다. Stream 의존성과 host 완료 대기를 구분하는 근거입니다.</CitationBlock></section>
<section id="source-numpy" data-teach-level="6" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">15. CPU가 값을 읽는지 원문 분기로 확인합니다</h2><div className={prose}>
<p>CUDA tensor에서 기본 <code>.numpy()</code>를 호출하면 자동으로 CPU 값을 가져온다고 생각하기 쉽습니다. 고정한 원문의 <code>force=False</code> 분기는 tensor가 CPU에 있는지 검사합니다. CUDA tensor이면 여기서 오류가 나므로 이를 단순한 암묵적 동기화 호출 목록에 넣으면 동작을 잘못 설명하게 됩니다.</p>
<p><code>force=True</code>이면 그 검사를 건너뛰고 <code>detach().cpu().resolve_conj().resolve_neg()</code> 경로로 준비합니다. GPU 값 38을 NumPy에서 읽고 싶다면 그 값이 준비되고 CPU로 옮겨지는 과정이 필요합니다. 반환 배열이 항상 원래 CUDA tensor의 저장 공간을 공유하는 것도 아닙니다.</p>
</div>{code("numpy","PyTorch · NumPy의 기본 거부와 force 변환 경로")}<div className={prose}>
<p>값을 표시하려는 <code>print(tensor)</code>나 scalar의 참·거짓 판정도 데이터 읽기를 요구할 수 있습니다. 반면 shape처럼 이미 CPU에 있는 메타데이터를 확인하는 일을 모두 GPU 결과 읽기로 세면 안 됩니다. 같은 함수 이름만 나열하기보다 해당 입력의 값이 CPU로 넘어오는 경로를 확인하는 편이 정확합니다.</p>
</div><CitationBlock type="code" citeKey={4} source="PyTorch 2.14 · Tensor.numpy / pinned tensor_numpy.cpp" href="https://docs.pytorch.org/docs/2.14/generated/torch.Tensor.numpy.html">기본 변환의 CPU 조건과 force=True의 CPU 변환을 구별합니다. 공식 문서의 설명을 실제 tensor_to_numpy 분기와 대조했습니다.</CitationBlock></section>
<section id="copy-overlap" data-teach-level="6" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">16. 복사를 예약한 것과 복사가 끝난 것은 다릅니다</h2><div className={prose}>
<p>메모리 복사도 제출과 완료를 구분해야 합니다. <code>non_blocking=True</code>로 CPU가 일찍 돌아왔다고 GPU가 사용할 입력이 이미 다 도착한 것은 아닙니다. 같은 stream의 뒤 계산은 복사 순서를 지키지만 다른 stream에서 그 입력을 읽으려면 필요한 의존성을 연결해야 합니다.</p>
<p>복사와 독립 계산이 실제로 겹치려면 그 작업들을 함께 처리할 하드웨어 여유가 있어야 합니다. PyTorch 공식 예시는 pinned CPU 메모리, 별도 stream, 사용 가능한 복사 엔진 조건에서 겹침을 보여 줍니다. pinned와 non_blocking 두 옵션만 적는 것으로 모든 코드의 겹침이 보장되지는 않습니다.</p>
<p>수명도 중요합니다. CPU에서 GPU로 옮기는 pinned 원본을 복사 완료 전에 덮어쓰면 GPU가 잘못된 값을 받을 수 있습니다. GPU에서 CPU로 비동기 복사한 결과는 완료를 확인하기 전에 CPU 계산에 사용하면 안 됩니다. CPU 호출 반환이 각 버퍼를 안전하게 읽고 쓰는 시각을 대신하지 않습니다.</p>
<p>원래 pageable 메모리를 <code>pin_memory()</code>로 바꾸는 호출 자체에도 CPU 복사 비용이 있습니다. 매번 직전에 고정하는 작업이 이득을 없앨 수도 있으므로 미리 준비한 pinned 버퍼를 쓰는 경우와 비용을 나누어 잽니다. 이 역시 해당 입력과 실행 조건의 측정으로 판단합니다.</p>
</div><ProgressiveDetail title="cudaMemcpy는 언제 CPU에 돌아오나요?" preview="방향과 host 메모리 종류에 따라 반환 조건이 다릅니다. pageable 복사를 전부 같은 동작으로 설명할 수 없습니다.">
<p>CUDA 13.4 문서에서 동기 형태의 pageable host→device 복사는 먼저 stream을 동기화하고 staging 버퍼로 옮긴 뒤 반환할 수 있습니다. 최종 GPU 전송까지 항상 완료됐다는 뜻은 아닙니다. Pinned host→device의 동기 형태와 device→host의 동기 형태도 문서의 각 조건을 따로 확인합니다.</p>
<p>Async API도 pageable 메모리의 staging 때문에 host를 기다리게 할 수 있습니다. 함수명에 Async가 있으면 모든 조건에서 즉시 돌아온다는 전제가 틀린 이유입니다. 어떤 호출이 사용되었는지뿐 아니라 메모리 종류와 전송 방향을 같이 기록해야 합니다.</p>
</ProgressiveDetail><CitationBlock type="code" citeKey={5} source="PyTorch · pin_memory와 non_blocking 튜토리얼" href="https://docs.pytorch.org/tutorials/intermediate/pinmem_nonblock.html">별도 stream에서의 복사 겹침, pin_memory 호출 비용, 비동기 복사 중 원본 변경과 미완료 결과 읽기의 조건을 확인했습니다. 튜토리얼의 성능 수치를 다른 장치로 일반화하지 않습니다.</CitationBlock><CitationBlock type="code" citeKey={6} source="CUDA Runtime 13.4 · API synchronization behavior" href="https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html">동기·비동기 이름만으로 host 반환 조건을 단정하지 않고 방향과 pageable/pinned 조건을 대조하는 근거입니다.</CitationBlock></section>
<section id="source-observation" data-teach-level="6" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">17. 원문 Python 호출이 어디로 내려가는지 관찰합니다</h2><div className={prose}>
<p>고정한 <code>streams.py</code>의 Stream과 Event class 전체 AST를 변경 없이 추출해 CPython 3.12.13에서 실행했습니다. CUDA를 부르는 native base class는 호출을 기록하는 대체 객체입니다. 따라서 이 관찰은 Python 메서드가 어떤 인수를 어느 메서드로 넘기는지를 확인하며 GPU 완료 시각을 검증하는 실행은 아닙니다.</p>
<p><code>A.wait_stream(B)</code>를 부르면 기록에는 B의 native event record, A의 native event wait가 순서대로 남았습니다. 이어서 현재 stream을 A로 두고 <code>event.record()</code>를 부르면 A가 전달됐습니다. 이는 원문이 생략한 stream 인수에 현재 stream을 넣는 경로를 실제로 실행한 결과입니다.</p>
<p><code>blocking=True</code>로 만든 event에서도 <code>event.wait(A)</code>는 native event wait를 부르고 <code>event.synchronize()</code>는 native event synchronize를 불렀습니다. 대체 객체 자체가 GPU 대기를 구현한 것은 아니므로 네이티브 의미는 앞 절의 C++와 CUDA API에서 확인합니다. 가정한 26·50 μs를 이 관찰의 측정 결과로 붙이지 않습니다.</p>
</div>{code("observation","원문 호출 관찰 · 실제 실행과 대체한 경계")}</section>
<section id="queue-capacity" data-teach-level="7" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">18. 미완료 작업을 몇 회까지 남길지 정합니다</h2><div className={prose}>
<p>미리 제출하면 GPU가 기다리는 시간을 줄일 수 있지만 처리 중인 일의 수는 늘어납니다. (별도 가정) 프로그램이 다음 회를 준비하기 전에 미완료 회 수를 검사하고 최대 D개만 남긴다고 둡니다. 이 D는 실제 CUDA driver의 공통 queue 크기가 아니라 여기서 만든 프로그램의 제한입니다.</p>
<p>Graph 사례에서 D=1이면 첫 회가 7 μs에 끝나야 다음 준비를 합니다. 완료는 7·14·21 μs로 매회 기다리던 경우와 같고 마지막 제출은 17 μs에 끝납니다. 마지막에도 CPU가 결과를 읽도록 강제한 것은 아니므로 CPU 제출 종료 17과 전체 완료 21은 여전히 다릅니다.</p>
<p>D=2이면 두 회를 제출한 6 μs에 미완료 회가 둘입니다. 가장 이른 완료 7 μs까지 기다렸다가 세 번째를 준비합니다. 준비 7–9 μs와 제출 9–10 μs 뒤 GPU는 앞 회가 끝난 11 μs부터 실행하므로 최종 완료는 15 μs 그대로입니다. CPU 제출 종료는 제한 없는 9에서 10 μs로 늦지만 GPU 완료는 늦어지지 않는 사례입니다.</p>
<p>대기를 구현할 때 시계를 과거로 되돌리면 안 됩니다. 현재 시각과 가장 이른 완료 중 큰 값으로 전진하고 그 시각까지 완료한 항목을 제거합니다. 실행 시작 시각을 가져와 무조건 CPU 시각에 대입하는 방식으로는 이 제한을 올바르게 계산할 수 없습니다.</p>
</div></section>
<section id="eos" data-teach-level="7" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">19. 종료 판정을 늦추면 의미도 바뀔 수 있습니다</h2><div className={prose}>
<p>지금까지 세 회를 모두 하기로 미리 정했습니다. 이번에는 두 번째 답 18을 보면 끝내야 하는 요청이라고 가정해 보겠습니다. 세 번째까지 이미 제출했다면 38은 계산되지만 사용자에게 내보내면 안 됩니다. 38을 응답에 포함하지 않아도 세 번째 계산 자체와 그 영향은 남습니다.</p>
<p>추가 작업이 공유 상태를 갱신하거나 난수를 소비하거나 메모리를 계속 잡고 있을 수 있습니다. 종료를 한 회 늦게 읽는 설계라면 어떤 결과를 유효한 것으로 표시할지와 추가 작업의 부작용을 함께 통제해야 합니다. “판정을 GPU로 옮긴다”는 말도 그 판정이 이후 작업의 실행과 출력에 어떻게 연결되는지까지 설명해야 해결책이 됩니다.</p>
<p>따라서 불필요한 로그용 값 읽기는 빈도를 줄일 수 있지만 다음 행동을 결정하는 값 읽기는 의미를 보존하는 재설계가 필요할 수 있습니다. 앞 결과를 CPU가 알 필요가 없다는 기본 사례의 전제와 실제 서빙의 종료 조건을 먼저 대조합니다.</p>
</div></section>
<section id="replay-diagnosis" data-teach-level="7" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">20. 시간이 같아도 같은 경로라는 뜻은 아닙니다</h2><div className={prose}>
<p>Graph를 켰는데 시간이 같으면 먼저 측정 범위와 실제 경로를 확인합니다. (다른 가정) 준비 S=2 μs, 제출 L=1 μs, 계산 E=3 μs, 두 kernel, graph 제출 G=1 μs로 바꾸겠습니다. Eager와 graph 모두 세 회의 완료가 9·15·21 μs입니다. CPU 제출은 12에서 9 μs로 줄지만 GPU 계산이 진행 속도를 제한해 마지막 완료는 같습니다.</p>
<p>이 반례 때문에 “켜도 느리니 graph가 선택되지 않았다”고 확정할 수 없습니다. Host의 graph 제출 호출, 실제 선택한 실행 경로, GPU에서 실행한 작업, 결과 일치를 함께 봅니다. Graph 한 번에 여러 kernel이 들어갈 수 있으므로 GPU kernel 행이 여러 개라는 사실도 fallback의 증거가 아닙니다.</p>
<p>캡처 중 허용되지 않는 호출로 생긴 오류, 재생은 했지만 주소나 경로가 맞지 않아 잘못된 결과, 실행 조건이 맞지 않아 graph 경로를 선택하지 않은 경우를 구분합니다. 이 세 현상이 어떤 빈도로 발생하는지는 이 글에서 측정하지 않았습니다. 조건 불일치가 항상 조용한 fallback으로 끝나는 것도 아닙니다.</p>
<p>주소와 수명, 준비한 크기와 실제 입력, mode 선택의 구체적인 계약은 <Link to="/cs/ai/cuda-graph-capture#implementation">CUDA Graph의 실행 조건 추적</Link>에서 확인할 수 있습니다. 캡처 밖에서 만든 tensor도 유효한 주소와 수명을 유지하면 사용할 수 있습니다. CPU 분기 자체를 전부 금지한다고 쓰기보다 캡처 때 고른 경로가 다음 재생에도 맞는지 확인해야 합니다.</p>
</div><ProgressiveDetail title="2019년의 2.9·3.8·3.4 μs는 무엇을 측정했나요?" preview="완료 대기를 포함한 반복 평균입니다. 평균의 차이를 순수 host 호출시간으로 분해할 수 없습니다.">
<p>NVIDIA의 2019년 예시는 V100·CUDA 10.1에서 kernel 20개를 1,000회 반복합니다. 계산 자체 2.9 μs에 대해 kernel마다 기다리면 평균 9.6 μs, 회마다 기다리면 3.8 μs, graph를 회마다 기다리면 3.4 μs라고 보고합니다. 세 값의 차이는 완료 대기와 반복 준비 등을 포함한 그 실험의 결과입니다.</p>
<p>따라서 3.8−2.9=0.9 μs를 순수 CPU launch 호출시간으로 읽거나 20×(3.4−2.9)=10 μs를 순수 graph host 호출시간으로 읽을 수 없습니다. 저자가 보고한 준비 약 400 μs와 첫 launch의 약 33% 증가는 그 환경의 초기 비용입니다. 모든 최신 장치와 graph 크기의 법칙이 아닙니다.</p>
</ProgressiveDetail><CitationBlock type="code" citeKey={7} source="Alan Gray · Getting Started with CUDA Graphs, 2019" href="https://developer.nvidia.com/blog/cuda-graphs/">본문의 원 실험과 반복 loop의 대기 위치를 읽었습니다. 3.4 μs에는 graph 준비를 한 번 포함한 전체 반복 평균이 들어갑니다. 이 글의 가정 시간표와 해당 실측을 구분합니다.</CitationBlock></section>
<section id="limits" data-teach-level="7" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">21. 빈 시간의 원인과 바꿀 비용을 연결합니다</h2><div className={prose}>
<p>GPU가 비는 원인은 CPU 제출 외에도 데이터 의존성, 다른 장치와의 통신, 필요한 메모리 준비, 실행 자원 경쟁 등일 수 있습니다. CPU 호출과 GPU 실행을 같은 시간축에 놓고 빈 구간 전에 무엇이 아직 준비되지 않았는지 확인합니다. 짧은 kernel이 많다는 정보만으로 모든 빈틈을 launch 비용이라고 부르지 않습니다.</p>
<p>Host launch overhead를 잴 때는 Python 인수 준비를 포함하는지, dispatcher를 포함하는지, 낮은 수준의 API 호출만 재는지 적습니다. Kernel 데이터 크기를 바꾸며 고정되는 부분이 있어도 호출 경로, CPU 상태, 인수와 driver 조건에 따라 달라질 수 있습니다. 무조건 kernel 크기와 독립인 고정 상수라고 일반화하지 않습니다.</p>
<p>캡처 전에는 eager 실행으로 필요한 초기화를 마칩니다. 첫 실행 비용을 미리 치르는 절차가 graph warmup입니다. 기동 시의 준비 실행, graph 기록과 실행 객체 준비, 첫 replay, 반복 replay를 따로 남깁니다. 준비한 크기가 많아지면 기동 시간과 메모리 비용이 늘 수 있지만 모든 크기의 첫 replay를 어떤 시점에 수행하는지는 실제 실행기를 확인해야 합니다. <code>CUDA_LAUNCH_BLOCKING=1</code>은 오류 위치를 좁히는 디버깅 조건이며 그 상태의 시간을 정상 비동기 성능으로 보고하지 않습니다.</p>
<p>이 글의 시간표를 적용하기 전에 필요한 것은 같은 질문입니다. 다음 지시는 앞 값을 CPU로 가져오지 않고 만들 수 있는가, 어느 실행열의 완료를 기다리는가, 결과와 부작용이 보존되는가입니다. 이 조건을 확인한 뒤에야 <Link to="/cs/ai/inference-optimization-layers">추론 최적화의 각 층</Link>에서 줄일 비용과 추가된 비용을 비교할 수 있습니다.</p>
</div></section>
<section id="review" data-teach-level="review" className="scroll-mt-24"><h2 className="mb-5 text-2xl font-bold">22. 다음 실행을 예측해 봅니다</h2><ReviewPrompts questions={[
"기본 사례에서 매회 답을 읽어도 두 작업을 묶어 제출하면 마지막 완료가 30에서 21 μs로 줄어드는 이유는 무엇인가요? (답: 9절)",
"A의 답이 26 μs에 준비되고 독립 B는 50 μs까지 일합니다. A의 stream을 기다리는 것과 장치를 기다리는 것은 언제 다른가요? (답: 13절)",
"GPU가 계산을 더 오래 하는 반례에서 CPU 제출을 줄여도 마지막 완료 21 μs가 같은 이유는 무엇인가요? 이 결과로 graph fallback을 확정할 수 있나요? (답: 20절)"
]}/></section>
</div><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={projectMetas}/></>;}
