import { useState } from "react";
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton } from "@/components/code";
import NumericPath from "@/pages/articles/world-systems/NumericPath";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import SourceApplication from "@/pages/articles/world-systems/SourceApplication";
import OrderedPipelineViz from "./viz/OrderedPipelineViz";
import { codeRefs,fileTrees } from "./codeRefs";
const GUIDE="https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-programming-guide/index.html";
const API="https://docs.nvidia.com/cuda/archive/13.0.2/cuda-runtime-api/";
const PTX="https://docs.nvidia.com/cuda/archive/13.0.2/parallel-thread-execution/index.html#parallel-synchronization-and-communication-instructions-bar";
export default function Article(){const [codeKey,setCodeKey]=useState<string|null>(null);return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 기다려야 할 일만 기다리면 다른 일을 함께 진행할 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">계산 장치가 빠르더라도 데이터를 보내고 결과를 가져오는 동안 다음 일을 시작하지 못하면 전체 시간은 길어집니다. 반대로 기다림을 무턱대고 없애면 아직 도착하지 않은 입력을 읽거나 가져오던 결과를 덮어쓸 수 있습니다.</p>
<p className="leading-8">
            이 글은 같은 두 작업의 시작과 끝을 그리는 데서 출발합니다. 값을 넘겨주는 순간과 저장 공간을 다시 쓰는 순간에 필요한 순서를 정한 뒤 실제 CUDA 코드가 그 순서를 어떻게
            표현하는지 읽습니다.
          </p>
</div></section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 값을 보내고 바꾼 뒤 돌아온 결과를 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">입력으로 받은 숫자를 계산 장치에 보내고 1을 더해 돌려받는다고 합시다. 계산은 입력 도착 뒤에 시작하고, 결과를 읽는 쪽은 돌아오는 일이 끝난 뒤에 접근해야 합니다.</p>
<p className="leading-8">서로 다른 저장 공간을 사용하는 두 작업이라면 한쪽을 계산하는 동안 다른 쪽을 보낼 수 있습니다. 전체 구조는 먼저 끝나야 할 일을 화살표로 연결하고 나머지 일을 겹칠 수 있는지 확인하는 과정입니다.</p>
<p className="leading-8">
            여기서 끝났다는 말도 누구의 관점인지 정해야 합니다. 요청한 사람이 지시를 모두 적고 손을 놓았어도 실제로 숫자를 옮기고 계산하는 일은 남아 있을 수 있습니다. 요청을 받았다는
            확인과 결과를 사용해도 된다는 확인을 같은 신호로 취급하면 너무 이르게 읽게 됩니다. 이 글에서는 작업을 맡긴 시점과 그 값이 도착한 시점을 따로 표시합니다.
          </p>
<p className="leading-8">두 결과를 한꺼번에 사용하는 사람도 있고 먼저 온 결과부터 사용하는 사람도 있습니다. 전자는 A와 B가 모두 돌아와야 일을 이어 갑니다. 후자는 A가 돌아왔을 때 A에 대한 일을 먼저 시작할 수 있습니다. 어떤 사람이 무엇을 기다리는지 적어야 필요한 기다림의 범위가 정해집니다. 지금은 둘 다 돌아오는 시점을 전체 작업의 끝으로 삼겠습니다.</p>
</div><NumericPath title="한 값이 오가는 경로" steps={[{label:"입력 보내기",value:"7을 계산할 곳으로"},{label:"값 바꾸기",value:"7 + 1 = 8"},{label:"결과 가져오기",value:"8을 읽어도 되는 시점"}]}/></section>
<section id="case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 두 묶음이 각각 2·5·2ms를 쓰는 경우를 놓습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">같은 크기의 입력 묶음 A와 B가 있고 각 묶음에 보내기 2ms, 계산 5ms, 가져오기 2ms가 든다고 가정합니다. A 안의 한 숫자는 7이고 결과는 8입니다. 두 묶음은 서로의 결과를 사용하지 않으며 저장 공간도 따로 둡니다(가정).</p>
<p className="leading-8">계산 자리는 하나이고 보내기와 가져오기는 서로 독립된 통로를 쓸 수 있다고 놓습니다. 시작 비용과 다른 작업의 간섭은 빼겠습니다. A를 완전히 끝낸 뒤 B를 시작하면 9+9=18ms입니다. 이 수치는 성능 측정값이 아니라 순서와 자원 제약을 설명하는 모형입니다.</p>
<p className="leading-8">
            시간의 단위는 천분의 일 초인 ms입니다. A의 숫자 하나를 바꾸는 데 반드시 5ms가 든다는 뜻은 아닙니다. 실제로는 많은 숫자를 함께 담은 묶음 전체를 옮기고 계산한다고
            가정했고 그중 7 하나를 골라 값의 행방을 따라갑니다. 시간표는 묶음의 시작과 끝을 나타내고 7→8은 그 안에서 일어나는 계산을 나타냅니다.
          </p>
<p className="leading-8">각 단계의 시간은 바로 앞 단계가 끝난 뒤 그 단계가 자원을 사용하는 길이입니다. B를 보내는 데 2ms가 든다고 해서 요청한 순간부터 2ms 뒤에 언제나 끝나는 것은 아닙니다. 보내는 통로가 아직 사용 중이면 시작부터 늦어집니다. 계산의 5ms도 도착을 기다린 시간까지 합친 값은 아닙니다. 시작할 조건이 갖춰진 뒤 5ms를 사용하는 것으로 놓았습니다.</p>
<p className="leading-8">순서대로 처리하는 18ms부터 직접 나눠 봅시다. A가 돌아오는 시각은 2+5+2=9ms입니다. 그때 B를 보내기 시작하면 도착은 11ms, 계산 완료는 16ms, 결과 도착은 18ms입니다. 입력과 출력이 맞는 안전한 시간표지만, A를 계산하는 동안 보내는 통로는 비어 있습니다. 다음 그림에서는 이 빈 시간을 B가 쓰게 합니다.</p>
</div></section>
<section id="picture" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 같은 시간축에서 비어 있는 곳을 채웁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">A는 0–2ms에 도착하고 2–7ms에 계산하며 7–9ms에 돌아옵니다. B는 비어 있는 보내기 통로로 2–4ms에 먼저 도착할 수 있습니다. 계산 자리는 A가 쓰므로 B의 계산은 7–12ms이고 결과는 12–14ms에 돌아옵니다.</p>
<p className="leading-8">그림의 세 번째 장면은 같은 조건에서 두 저장 자리를 번갈아 쓰며 C와 D까지 처리합니다. 이미 값을 읽거나 옮기는 자리를 덮지 않는다는 규칙은 그대로입니다.</p>
<p className="leading-8">그림의 가로 방향은 공통된 시계입니다. 서로 다른 줄에서 같은 가로 위치에 놓인 상자는 같은 시간에 진행하는 일을 뜻합니다. 같은 줄의 상자가 겹치면 하나뿐이라고 가정한 자원을 동시에 두 작업에 준 셈이 됩니다. 각 상자의 글자는 그 단계가 어느 묶음의 일인지 나타냅니다. A와 B를 바꿔 읽으면 입력이 준비되었는지를 잘못 판단할 수 있습니다.</p>
<p className="leading-8">B가 4ms에 도착했더라도 그 즉시 계산 상자를 놓을 수는 없습니다. 4–7ms에는 A가 계산 자리를 사용합니다. 그래서 B는 도착한 상태로 3ms를 기다립니다. 이 기다림을 지운 그림은 이번 조건에서 가능한 시간표가 아닙니다. 보내기를 계산과 겹쳤다는 사실을 계산끼리도 겹쳤다는 뜻으로 넓히지 않습니다.</p>
<p className="leading-8">7–9ms에는 A의 결과를 가져오는 동안 B를 계산합니다. A의 8은 7ms에 계산할 곳에 있지만 읽는 사람 쪽에 완전히 돌아오는 시점은 9ms입니다. 결과가 어디에 준비되었는지까지 적어야 합니다. B의 결과는 같은 경로를 따라 12ms에 계산되고 14ms에 돌아옵니다. 앞선 줄의 완료와 마지막 줄의 완료를 각각 찾아 보세요.</p>
</div><OrderedPipelineViz/></section>
<section id="why" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 작업 순서와 저장 공간의 사용 시간을 함께 정해야 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">B를 먼저 보내도 A의 계산이 끝나기 전에는 같은 계산 자리를 쓸 수 없습니다. 일을 일찍 요청했다는 사실과 실제로 동시에 수행할 수 있다는 사실은 다릅니다. 필요한 순서와 장치가 허용하는 겹침을 각각 확인해야 합니다.</p>
<p className="leading-8">A의 결과를 가져오는 중에 A가 쓰던 출력을 C로 덮어도 안 됩니다. 재사용은 앞 사용자의 마지막 읽기가 끝난 뒤에 가능합니다. 따라서 작업마다 순서를 기억할 줄과 특정 지점의 완료를 알릴 표식이 필요합니다. 이제 이 역할에 이름을 붙입니다.</p>
<p className="leading-8">작업마다 입력과 출력을 둘 자리를 한 벌씩 준비했다고 합시다. A와 B의 두 벌은 서로 겹치지 않으므로 A의 값을 옮기면서 B의 값을 쓸 수 있습니다. 하지만 이 두 벌을 계속 쓰려면 다음 작업이 언제 들어올지 정해야 합니다. 자리를 두 벌 갖는 것과 매번 새 자리를 끝없이 만드는 것은 다른 운영 방식입니다. 그림은 두 벌을 돌려 쓰는 경우입니다.</p>
<p className="leading-8">A가 쓰던 자리에 C를 넣는 시점은 A의 마지막 사용을 따라 정합니다. A의 계산이 끝나는 7ms만 보고 결과 공간을 C에 주면 7–9ms에 가져가던 8을 덮을 수 있습니다. 이번 그림은 그 한 벌 전체를 9ms까지 보관한 뒤 C에 줍니다. 입력과 출력의 공간을 따로 관리하면 더 이른 재사용이 가능한 부분도 있지만, 어느 사용이 끝났는지 각각 증명해야 합니다.</p>
<p className="leading-8">기다림을 너무 크게 잡아도 기회를 잃습니다. A가 돌아오는 9ms까지 아무 다음 작업도 보내지 않으면 B의 도착이 11ms로 늦어집니다. B가 A의 결과를 쓰지 않고 자기 공간을 가진 이번 조건에서는 그렇게 기다릴 이유가 없습니다. 반대로 B가 A의 8을 반드시 써야 하는 작업으로 바뀌면 두 작업 사이에도 순서가 생깁니다. 같은 시간표를 그대로 쓸 수 없는 조건입니다.</p>
<p className="leading-8">줄을 더 만들거나 저장 자리를 네 벌로 늘려도 계산 자리 하나라는 가정은 그대로입니다. 입력을 일찍 준비해 두는 일과 동시에 계산할 수 있는 양을 늘리는 일은 구분해야 합니다. 그림의 네 묶음은 9·14·19·24ms에 돌아오므로 두 자리를 잘 재사용해도 계산 자리를 채울 수 있습니다. 추가 공간이 필요한지는 값의 크기와 기다림의 길이까지 보고 결정합니다.</p>
</div></section>
<section id="names" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 순서 있는 줄은 stream이고 완료 표식은 event입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">
            명령을 제출하는 CPU 쪽을 host, 계산하는 GPU 쪽을 device라고 부릅니다. GPU에서 실행하는 함수는 kernel이며 데이터를 잠시 두는 저장 영역은
            buffer입니다. 앞의 보내기와 가져오기는 각각 host-to-device와 device-to-host라 줄여서 H2D와 D2H라고 합니다.
          </p>
<p className="leading-8">
            한 stream 안에 제출한 작업은 정해진 순서를 따릅니다. 다른 stream 사이에 필요한 순서는 event로 연결할 수 있습니다. 다음 표에서 같은 사례의 역할과 이름을
            짝지어 봅니다.
          </p>
</div><TermBreakdown title="역할과 CUDA 이름" items={[
{term:"Stream · 순서 있는 명령 줄",description:"같은 줄의 앞 작업이 뒤 작업보다 먼저 완료되도록 순서를 표현합니다.",example:"A의 H2D→kernel→D2H를 같은 stream에 넣습니다.",boundary:"줄을 두 개 만들었다고 물리 계산 자리가 늘어나지는 않습니다."},
{term:"Event · 특정 지점의 완료 표식",description:"기록 시점까지의 작업을 붙잡아 다른 줄이나 host가 완료를 확인하게 합니다.",example:"A의 D2H 뒤 표식이 끝나면 host가 결과 8을 읽습니다.",boundary:"event handle과 그 handle의 어느 기록을 기다리는지는 구별해야 합니다."},
{term:"Synchronization · 필요한 순서 맞추기",description:"결과를 읽기 전에 쓰기가 끝나도록 참여자와 범위를 정하는 일입니다.",example:"A를 읽는 사람은 A만 기다리고 독립된 B는 진행할 수 있습니다.",boundary:"기다림·메모리 순서·여러 동작의 원자성은 서로 다른 보장입니다."}]}/><ContentBoundary article="cuda-sync-streams"/></section>
<section id="streams" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. A의 7이 돌아와 8이 될 때까지 같은 줄을 따라갑니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">A의 host 입력 7을 H2D에 넘깁니다. 복사가 끝나는 2ms 이후 kernel이 그 값을 읽어 8을 쓰고, 계산이 끝나는 7ms 이후 D2H가 결과를 가져옵니다. Host가 8을 읽을 수 있는 시점은 A의 D2H 완료를 확인한 9ms 이후입니다.</p>
<p className="leading-8">B는 별도 buffer와 stream을 사용합니다. H2D는 A의 계산과 겹치지만 이번 가정에서 kernel끼리는 같은 자원을 쓰므로 차례대로 실행합니다. 두 결과가 모두 필요한 요청은 14ms에 끝납니다. 첫 결과 지연 9ms, 두 결과의 전체 시간 14ms, 긴 반복의 결과 간격 5ms를 섞지 않아야 합니다.</p>
<p className="leading-8">같은 조건에서 네 묶음의 결과는 9·14·19·24ms에 도착합니다. A가 사용한 자리는 9ms 뒤 C가, B의 자리는 14ms 뒤 D가 다시 사용합니다. 장치가 허용하는 겹침을 확인하기 전에는 이 시간표를 실제 GPU의 보장으로 읽을 수 없습니다.</p>
</div><ExplainedFormula question="N개 묶음의 전체 시간과 결과 간격은 어떻게 다를까요?" idea="첫 결과는 세 단계를 모두 지나야 합니다. 뒤 결과는 같은 조건의 충분한 작업과 버퍼가 있을 때 가장 오래 걸리는 단계의 간격으로 나옵니다." formula={String.raw`T_N=H+K+D+(N-1)\max(H,K,D)`} annotatedFormula={String.raw`\begin{aligned}\tau&=\underbrace{\max(H,K,D)}_{\text{독립 단계의 반복 간격}}\\T_N&=H+K+D+(N-1)\tau\\T_2&=2+5+2+5=14\ \mathrm{ms}\end{aligned}`} operations={[{expression:String.raw`\max(H,K,D)`,annotation:["통로별 부하를 비교해","반복 간격의 하한 선택"]},{expression:String.raw`H+K+D`,annotation:["첫 결과는","세 단계를 모두 통과"]}]} terms={[{symbol:"H,K,D",name:"단계 시간",description:"같은 묶음의 H2D 2ms, kernel 5ms, D2H 2ms입니다."},{symbol:"N",name:"묶음 수",description:"같은 크기의 서로 독립된 작업 수입니다."},{symbol:String.raw`\tau`,name:"결과 간격",description:"이 이상화에서 달성 가능한 정상상태 간격 5ms입니다."}]} assumptions={["독립된 양방향 복사 통로와 한 계산 자원, 충분한 buffer·명령 제출, 자원 경합과 시작 비용 무시.","식은 이 시간표 모형입니다. 실제 장치의 copy engine 수와 동작·제출 순서를 확인해야 합니다."]} interpretation="두 묶음은 14ms, 네 묶음은 24ms입니다. 5ms는 전체 지연이 아닙니다. 양방향 복사가 한 자원을 공유하면 복사 부하 H+D도 별도로 비교합니다."/></section>
<section id="source-pipeline" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 공식 예제의 배열과 반복문에 같은 값을 넣습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">NVIDIA cuda-samples v13.0의 simpleMultiCopy를 고정 commit 3f1c5096에서 읽겠습니다. 원문 전체와 저작권 고지는 코드 패널에 보존했습니다. 예제는 네 slot에 입력·출력 buffer와 stream을 만들고 processWithStreams의 인자로 사용하는 수를 정합니다. 본문의 두 자리 사례는 streams_used=2라는 조건을 대입한 추적입니다.</p>
<p className="leading-8">
            실제 incKernel은 입력에 1을 더해 출력에 씁니다. g_in[idx]=7이라는 입력을 대입하면 g_out[idx]=8입니다. inner_reps=5여도 매번 같은
            입력+1을 다시 쓰므로 결과는 12가 되지 않습니다. 원문 기본 초기값은 0이라 자체 검사에서는 출력 1을 기대합니다. 7은 동작을 읽기 위한 입력이며 예제를 실행한 측정값이
            아닙니다.
          </p>
<p className="leading-8">현재 slot이 0이면 next=(0+1)%2=1입니다. 루프는 cycleDone[1]을 host에서 기다린 뒤 현재 slot 0을 계산하고 slot 1에 다음 입력을 보냅니다. slot 0의 D2H 뒤에는 cycleDone[0]을 기록합니다. 다음 반복은 current=1,next=0이므로 slot 0을 재사용하기 전에 그 기록의 완료를 기다립니다.</p>
<p className="leading-8">앞의 2·5·2ms 시간표는 이 재사용 원리를 설명하는 모형입니다. 원문의 첫 회차는 미리 준비된 입력과 warmup을 포함하며 시간표의 시작점과 같지 않습니다. 예제의 옛 주석에 나오는 모든 메모리 명령의 제출 순서 설명도 모든 현대 장치의 전역 실행 순서로 일반화하지 않습니다.</p>
<p className="leading-8">꺼져 있는 SIMULATE_IO를 켜면 host memcpy가 cycleDone 대기보다 앞에 놓입니다. 입력 덮어쓰기와 출력 읽기까지 응용하려면 각 복사 완료를 확인한 뒤 host가 접근하도록 옮겨야 합니다. 원문에 있는 코드를 그대로 쓴다는 사실만으로 새 응용의 buffer 수명이 맞아지는 것은 아닙니다.</p>
</div><div className="flex flex-wrap gap-3"><CodeViewButton onClick={()=>setCodeKey("kernel")} label="실제 7→8 연산 · 58–67행"/><CodeViewButton onClick={()=>setCodeKey("pipeline")} label="실제 slot 교대 · 286–342행"/></div></section>
<section id="host-memory" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. Async 호출이 돌아왔어도 입력과 출력의 사용자는 남아 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">계산 장치가 host 메모리를 옮기는 동안 주소가 안정적으로 유지되도록 확보한 메모리를 pinned memory라고 합니다. 원문은 cudaHostAlloc으로 입력과 출력을 각각 확보합니다. 이 조건은 비동기 이동과 계산의 겹침을 준비하지만 겹침 자체를 보장하지는 않습니다.</p>
<p className="leading-8">
            일반적인 pageable host 메모리는 중간 pinned 영역으로 복사하는 준비가 필요할 수 있습니다. CUDA Runtime 13.0.2의 API
            synchronization behavior는 device와 pageable host 사이의 Async 복사가 host 관점에서 동기적으로 동작할 수 있고 준비 과정에서
            stream을 기다릴 수도 있다고 규정합니다. Async라는 접미사만으로 모든 인자와 상황에서 즉시 반환한다고 말할 수 없습니다.
          </p>
<p className="leading-8">A를 보내는 동안 CPU가 같은 입력 7을 9로 덮으면 어느 값을 보냈는지에 대한 계약을 깨뜨립니다. A의 출력을 가져오는 중에 읽거나 같은 공간을 해제해도 안 됩니다. H2D 뒤 event의 완료는 입력 재사용을, D2H 뒤 event의 완료는 출력 읽기를 판단하는 지점이 됩니다.</p>
<p className="leading-8">완료 확인은 cudaEventQuery 또는 cudaStreamQuery의 성공을 확인하거나 해당 event·stream의 동기화가 끝난 뒤에 합니다. cudaErrorNotReady와 실제 오류를 구분합니다. 기다리지 않고 끝났는지 묻는 호출과 host를 기다리게 하는 호출을 용도에 맞게 선택합니다.</p>
</div><CodeViewButton onClick={()=>setCodeKey("buffers")} label="실제 host·device buffer 확보 · 172–184행"/><SourceApplication source="CUDA Runtime13.0.2 · API synchronization behavior" excerpt="might be synchronous with respect to host" application="A의 입력이 pageable이면 cudaMemcpyAsync 호출이 준비·대기 때문에 host를 붙잡을 수 있습니다. 호출 반환과 결과 8의 도착은 별도로 확인합니다."/></section>
<section id="default-stream" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 이름을 쓰지 않은 줄도 다른 줄과 연결될 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">stream 인자를 0으로 두는 기본 줄에는 두 모드가 있습니다. legacy default stream은 같은 CUDA context의 일반 blocking stream들과 암묵적인 순서를 만듭니다. 일반 stream A에 작업을 넣고 기본 줄에 작업을 넣은 뒤 일반 stream B에 넣으면 가운데 기본 작업이 앞뒤를 연결할 수 있습니다.</p>
<p className="leading-8">cudaStreamNonBlocking으로 만든 줄은 이 legacy 기본 줄과의 암묵적인 동기화에서 빠집니다. 여기서 NonBlocking은 그 관계에 대한 설정입니다. 모든 API 호출이 host를 절대 기다리게 하지 않는다는 뜻으로 읽으면 안 됩니다.</p>
<p className="leading-8">per-thread default stream은 host thread마다 갖는 일반 줄입니다. legacy와 같은 전역 연결을 기대할 수 없습니다. --default-stream per-thread 설정과 헤더보다 앞선 CUDA_API_PER_THREAD_DEFAULT_STREAM 정의가 관련되며, nvcc의 자동 헤더 포함 때문에 소스 안 define만으로 바꾸는 방식은 주의가 필요합니다.</p>
<p className="leading-8">기본 줄의 암묵적 연결에 기대던 예제를 NonBlocking이나 per-thread 모드로 바꾸면 정확성이나 계측이 달라질 수 있습니다. A의 입력·계산·출력을 명시한 줄에 두고 필요한 교차 관계만 event로 적으면 의도를 추적하기 쉽습니다.</p>
</div></section>
<section id="events" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. Event가 붙잡는 것은 기록 당시까지의 작업입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">독립된 A와 B를 겹치는 경우에는 둘 사이의 event가 필요하지 않습니다. 이제 B가 A의 결과 8을 입력으로 사용하도록 조건을 바꿔 봅시다. A의 생산 작업 뒤 ready를 record하고 B의 소비 작업 앞에 cudaStreamWaitEvent를 제출하면 B는 그 생산이 끝난 뒤 진행합니다. 이 wait는 host의 완료 대기와 구별되는 device 쪽 의존 관계입니다.</p>
<p className="leading-8">cudaEventRecord는 그 호출 때까지 해당 stream에 제출한 작업을 기록합니다. 나중에 같은 stream에 추가한 작업은 이전 기록에 자동으로 들어가지 않습니다. 따라서 A의 계산 뒤에 기록하면 8이 device에 준비된 지점을, D2H 뒤에 기록하면 host 출력까지 도착한 지점을 기다리게 됩니다.</p>
<p className="leading-8">기록하지 않은 event는 아직 미래의 작업을 기다리는 약속이 아닙니다. 처음에는 빈 작업 집합입니다. B가 먼저 기다리기를 제출한 뒤 A가 record하면 기존 wait를 고쳐 주지 않으므로 안전한 연결이 생기지 않습니다.</p>
<p className="leading-8">같은 handle을 세대1에 기록하고 B가 기다린 뒤 세대2에 다시 기록해도 B의 기존 wait는 세대1을 붙잡습니다. 반대로 B의 wait 호출 전에 세대2를 기록하면 가장 최근인 세대2를 사용합니다. Host thread가 여러 개면 record와 wait를 제출하는 순서 자체도 프로그램에서 맞춰야 합니다.</p>
<p className="leading-8">검토할 때는 buffer 주소에 세대 번호를 붙이고 쓰기→기록→대기→읽기→재사용을 연결합니다. A가 B의 미래 결과를 기다리면서 B도 A의 미래 결과를 기다리는 구조를 만들면 진행할 수 없습니다. 미기록 event의 wait로 이 순환을 안전하게 표현할 수도 없습니다.</p>
</div><AlgorithmBlock title="같은 8을 넘기는 순서의 의사코드" input={["서로 다른 stream A와 B","같은 device buffer를 읽을 consumer"]} steps={[{code:"produce(buffer, A)",note:"A가 결과 8을 만듭니다."},{code:"record(ready, A)",note:"생산 작업까지의 기록을 만듭니다."},{code:"wait(B, ready)",note:"이 호출 당시의 기록이 B의 뒤 작업에 연결됩니다."},{code:"consume(buffer, B); record(consumed, B)",note:"재사용하는 쪽은 마지막 소비까지 기다려야 합니다."}]} output="정확한 생산 세대의 8을 읽은 뒤 buffer를 다음 입력에 재사용합니다."/></section>
<section id="event-time" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 명령을 제출한 시간과 장치에서 끝난 시간을 따로 잽니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">CPU 시계로 kernel 호출 전후만 재면 비동기 작업의 완료 시간을 재지 못합니다. 같은 stream에 start event, 작업, stop event를 차례로 넣고 stop의 완료를 확인한 뒤 cudaEventElapsedTime으로 장치 시각의 차이를 구합니다. Timing을 끈 event는 순서 연결에는 쓸 수 있지만 이 시간 계산에는 쓸 수 없습니다.</p>
<p className="leading-8">여러 stream의 전체 완료를 재려면 시작 표식을 각 worker가 기다리게 하고, 각 worker의 마지막 표식을 한 join stream이 기다리게 합니다. 그 줄에 stop을 기록하면 모든 작업이 stop보다 앞에 놓입니다. 같은 device의 timing event 두 개를 사용하고 실제 오류 반환도 검사합니다.</p>
<p className="leading-8">공식 simpleMultiCopy는 기본 줄에 start와 stop을 기록하고 일반 stream을 만듭니다. 이 계측은 legacy 기본 줄의 암묵적 연결을 이용합니다. per-thread 기본 모드로 옮기거나 worker를 NonBlocking으로 바꾸면 나중의 cudaDeviceSynchronize가 끝났더라도 이미 찍힌 stop 시각이 늦춰지지는 않습니다.</p>
<p className="leading-8">Event 구간에는 다른 작업의 경합과 해당 작업이 기다린 시간도 반영될 수 있습니다. CPU의 입력 준비부터 결과 소비까지 잰 전체 시간, 장치 event 시간, 타임라인의 실제 겹침을 함께 비교해야 합니다. 시작 비용·chunk 크기·반복 횟수와 warmup 조건도 기록합니다.</p>
</div><CodeViewButton onClick={()=>setCodeKey("timing")} label="실제 종료 계측 · 330–339행"/></section>
<section id="block-sync" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">13. 한 계산 안에서도 쓰는 사람과 읽는 사람의 순서가 필요합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">
            지금까지는 kernel 사이의 순서를 보았습니다. Kernel 안의 최소 실행 단위를 thread라고 하며, 함께 배치되어 공간을 공유하는 thread 묶음을 block이라고
            합니다. 한 block의 thread0이 공유 칸에 7을 쓰고 thread1이 그 값을 읽어 8을 만드는 경우에도 앞선 쓰기가 필요합니다.
          </p>
<p className="leading-8">
            __syncthreads()는 block의 참여 thread들이 같은 동기화 지점에 도달하도록 기다리고 앞선 shared·global 메모리 접근이 뒤의 참여 thread에게
            올바른 순서로 볼 수 있게 합니다. thread0의 쓰기→block barrier→thread1의 읽기라는 경로로 7을 넘길 수 있습니다.
          </p>
<p className="leading-8">이 호출은 다른 block의 도착을 모으지 않습니다. 두 thread가 같은 값에 x++를 하는 연산을 하나의 원자적 동작으로 만들지도 않습니다. 읽기와 쓰기가 겹치는 갱신에는 atomic 연산이나 서로 다른 출력 영역과 후속 결합처럼 별도의 설계가 필요합니다.</p>
<p className="leading-8">조건문 안의 barrier는 block에서 조건이 동일하게 평가되도록 사용합니다. 참여해야 하는 아직 종료하지 않은 thread가 다른 경로로 빠져 같은 지점에 오지 않으면 프로그램 동작이 정의되지 않습니다. 모든 조건문이 금지된다는 뜻과는 다릅니다. 전체가 같은 분기를 타는 조건은 구별해야 합니다.</p>
</div></section>
<section id="warp-sync" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">14. 같은 32명 안의 값 교환과 메모리 전달도 구별합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">NVIDIA는 32개 thread를 warp라는 실행 묶음으로 구성하고 각 위치를 lane이라고 부릅니다. lane0이 가진 register 값 7을 lane1로 직접 가져오는 __shfl_sync와, 각 lane의 참·거짓을 bit 집합으로 모으는 __ballot_sync가 있습니다. 이 호출의 _sync가 임의의 메모리 쓰기를 공개하는 barrier라는 뜻은 아닙니다.</p>
<p className="leading-8">공유 메모리에 쓴 7을 다른 lane이 읽는다면 __syncwarp(mask)가 참여 lane 사이의 도착과 memory ordering을 제공합니다. mask의 각 bit는 참여 lane을 가리키며 호출자는 자신의 bit가 포함되어야 합니다. 지정된 아직 종료하지 않은 lane들은 같은 mask로 대응하는 호출을 수행해야 합니다.</p>
<p className="leading-8">예를 들어 lane0과 lane1만 통신하고 두 lane이 해당 호출을 실행한다면 mask=0x3입니다. lane0의 쓰기 뒤 두 lane이 __syncwarp(0x3)를 지나고 lane1이 읽게 합니다. Shuffle로 값을 받을 때에도 값을 내주는 lane이 실제로 참여해야 하며, 빠진 lane의 값을 정상값으로 취급할 수 없습니다.</p>
<p className="leading-8">Independent thread scheduling이 있는 장치에서 한 warp의 모든 lane이 언제나 같은 명령 위치에 있다는 가정은 안전하지 않습니다. 반대로 오래된 sm_6x 이하의 syncwarp에는 수렴과 active mask에 추가 제약이 있습니다. 대상에 맞는 규칙을 사용해야 하며 block 사이 통신으로 넓힐 수 없습니다.</p>
</div></section>
<section id="memory-fence" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">15. Fence는 순서를 정하지만 상대방을 도착시키지는 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">Fence는 호출 thread의 메모리 접근 순서를 정하는 기능입니다. __threadfence_block, __threadfence, __threadfence_system은 각각 block·device·system 범위의 순서에 대응합니다. 주소가 shared인지 global인지와 관측 범위는 별개의 축입니다.</p>
<p className="leading-8">Producer가 data=7을 쓴 뒤 fence를 실행해도 consumer가 그 지점까지 도착한 것은 아닙니다. Fence만으로 다른 thread에 대한 visibility나 원자적 갱신까지 모두 얻지도 못합니다. 보통의 flag를 동시에 읽고 쓰는 코드를 덧붙이면 data race가 남아 동작이 정의되지 않을 수 있습니다.</p>
<p className="leading-8">
            한 번 전달하는 사례라면 data=7 뒤 atomic flag를 release로 1에 저장하고 consumer가 같은 범위의 acquire load로 그 1을 관측한 뒤
            data를 읽는 식으로 순서를 구성할 수 있습니다. Flag는 처음 0이고 다른 쓰기와 충돌하지 않으며 producer가 7을 덮어쓰지 않는 조건이 필요합니다. 반복 재사용에는
            소비 완료와 다음 세대까지 연결해야 합니다.
          </p>
<p className="leading-8">이 설명은 release/acquire 통신의 의사코드 원리입니다. 일반 flag나 volatile을 같은 것으로 바꿔 읽지 않습니다. Fence가 barrier보다 언제나 빠르다는 결론도 없습니다. 두 기능의 보장과 실제 명령·메모리 대기 비용을 먼저 비교합니다.</p>
</div><SourceApplication source="CUDA Guide13.0.2 · Memory Fence Functions" excerpt="only affect the ordering of memory operations" application="data=7 뒤 fence만 두면 consumer가 읽을 시점까지 정해지지는 않습니다. 같은 범위의 atomic publication이나 적절한 barrier가 필요합니다."/></section>
<section id="named-async-barrier" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">16. 도착을 알리는 일과 기다리는 일을 나눌 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">한 block 안에 생산 완료와 소비 완료처럼 서로 다른 대기점이 필요할 수 있습니다. PTX의 named barrier는 0–15의 논리적 자원 번호로 구별합니다. 명시한 thread 수는 warp 크기의 배수여야 하며, 번호가 다르면 같은 완료를 기다리는 것이 아닙니다.</p>
<p className="leading-8">PTX 9.0의 생산자·소비자 예는 64명을 같은 barrier 0에 모읍니다. 생산자 쪽은 쓰기 뒤 bar.arrive 0,64로 도착만 알리고 소비자 쪽은 bar.sync 0,64 뒤 읽습니다. 소비가 끝난 뒤에는 barrier 1로 반대 방향의 완료를 알려 덮어쓰기를 막습니다. 생산자와 소비자가 서로 다른 번호에 혼자 도착하는 구조가 아닙니다.</p>
<p className="leading-8">C++의 cuda::barrier는 초기화한 기대 도착 수와 phase를 사용해 arrive와 wait를 나눕니다. 두 참여자가 각자 한 번 도착한다면 기대 수 2에서 1, 0으로 줄어 그 회차가 끝납니다. 이는 C++ barrier의 작은 예이며 PTX named barrier에 thread 수 2를 넣는 예가 아닙니다.</p>
<p className="leading-8">각자는 공유할 값을 쓴 뒤 arrive에서 token을 얻고, 상대 값에 의존하지 않는 계산을 하다가 wait(token) 뒤 읽습니다. 초기화가 모든 참여보다 먼저 끝나야 합니다. Token이 나타내는 회차와 현재 또는 바로 이전 phase에 대한 사용 조건을 지켜야 하며, 참가자가 빠지면 필요한 도착 수가 채워지지 않습니다.</p>
<p className="leading-8">CUDA Guide의 표준 패턴은 arrive 이전 쓰기가 해당 wait 이후 참여자에게 보이는 순서를 설명합니다. Compute capability 8.0 이상은 관련 barrier 연산에 하드웨어 가속을 제공합니다. 전체 block 또는 warp를 맞추는 단순한 경우에는 공식 가이드가 __syncthreads와 __syncwarp를 권장합니다. 도착·대기 분리가 필요한지를 먼저 판단합니다.</p>
</div><SourceApplication source="PTX ISA9.0 · bar 생산자/소비자 예" excerpt="bar.arrive 0,64; … bar.sync 0,64;" application="producer가 7을 쓴 뒤 barrier 0 도착을 알리면 consumer는 같은 barrier 0을 지나 읽습니다. 소비 뒤 barrier 1이 다음 덮어쓰기를 막습니다."/></section>
<section id="sync-overhead-divergence" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">17. 늦은 참여자를 기다리는 비용과 잘못된 참여를 구별합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">두 참여자가 같은 barrier에 3μs와 8μs에 도착한다고 가정하면 먼저 온 쪽은 적어도 5μs를 기다립니다. 이것은 작업 불균형에서 생긴 대기이며 barrier 명령 자체의 고정 비용이라고 부를 수 없습니다. 명령 처리량과 memory ordering 때문에 생기는 비용은 별도로 있습니다.</p>
<p className="leading-8">정상적인 불균형은 작업 분배나 필요 없는 동기화 제거로 줄일 수 있습니다. 참여해야 하는 thread가 끝나지 않은 채 다른 경로를 반복하며 해당 barrier에 오지 않는 경우는 정확성 문제입니다. 단순히 더 오래 기다리게 하거나 더 빠른 barrier로 바꾸는 방식으로 해결되지 않습니다.</p>
<p className="leading-8">Fence만 사용한 실패에서는 읽기와 쓰기의 순서 및 publication을 확인합니다. Barrier 실패에서는 참여 집합·분기·반복 회차·기대 도착 수를 확인합니다. 두 문제를 분리해야 어떤 수정이 필요한지 정할 수 있습니다.</p>
<p className="leading-8">Host의 cudaDeviceSynchronize는 해당 device에서 앞서 요청한 작업의 완료를 기다립니다. 이미 제출된 독립 작업의 겹침을 소급해서 없애지는 않습니다. 다만 A마다 이 호출을 하고 나서 B를 제출하면 B의 제출 자체가 늦어져 앞의 18ms 순차 모양이 될 수 있습니다. 전체 완료 확인과 중간마다 세우는 대기의 위치를 구별합니다.</p>
</div></section>
<section id="multi-gpu" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">18. 다른 GPU의 표식을 기다릴 수 있지만 모든 handle을 섞을 수는 없습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">GPU가 둘이면 host thread의 current device를 cudaSetDevice로 정합니다. cudaMalloc으로 확보하는 device 메모리와 새 stream·event는 그 장치에 연결됩니다. 번호만 보고 추측하지 않도록 pointer·stream·event가 어느 장치에 속하는지 기록합니다.</p>
<p className="leading-8">Kernel launch는 current device와 stream의 장치가 같아야 합니다. GPU1을 선택한 채 GPU0의 stream으로 kernel을 제출하면 실패합니다. cudaEventRecord 역시 event와 stream이 서로 다른 장치에 속하면 실패하고, cudaEventElapsedTime도 두 event가 서로 다른 장치면 사용할 수 없습니다.</p>
<p className="leading-8">그러나 cudaStreamWaitEvent는 다른 장치의 event를 기다릴 수 있습니다. cudaEventQuery와 cudaEventSynchronize도 event 장치가 current device와 달라도 사용할 수 있습니다. 공식 가이드는 메모리 복사에도 kernel launch와 다른 허용 조건이 있음을 명시합니다. 따라서 모든 handle API에 같은 제한을 덮어씌우면 잘못된 설명이 됩니다.</p>
<p className="leading-8">GPU0에서 만든 8을 GPU1이 쓴다고 합시다. GPU0의 생산 완료를 record하고 GPU1의 복사 줄이 그 event를 기다리게 합니다. 복사 뒤 GPU1의 consumer를 놓고 마지막 소비 또는 필요한 복사의 완료까지 원본 공간의 수명을 유지합니다. GPU마다 기본 줄이 따로 있으므로 두 기본 줄이 자동으로 서로를 기다리지는 않습니다.</p>
</div></section>
<section id="peer-copy" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">19. 접근 허용 방향과 데이터를 옮기는 방향을 따로 적습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">GPU1의 kernel이 GPU0의 메모리를 직접 읽으려면 1이 0에 접근할 수 있는지 cudaDeviceCanAccessPeer로 묻고, GPU1을 선택한 상태에서 cudaDeviceEnablePeerAccess(0,0)을 호출합니다. 이는 1→0의 접근 허용입니다. 결과 데이터가 0에서 1로 전달된다는 말과 화살표의 뜻이 다릅니다.</p>
<p className="leading-8">P2P 가능성은 실제 PCIe·NVLink 연결과 플랫폼에 따라 달라집니다. 반대 방향의 허용이 필요하면 별도로 조회하고 설정합니다. Device 수가 2 이상인지부터 확인하며 불가능한 경로에서는 host staging 같은 다른 전송 경로를 준비합니다. 같은 서버에 있다는 사실만으로 원격 접근이나 특정 대역폭이 보장되지 않습니다.</p>
<p className="leading-8">cudaMemcpyPeerAsync로 GPU0의 결과를 GPU1로 옮길 때도 생산→복사→소비의 event 관계가 필요합니다. 복사 완료 전 원본을 덮거나 목적지를 읽으면 안 됩니다. 주소가 어디에 있는지, 누가 읽고 쓰는지, 어느 복사나 소비가 끝나면 재사용할지를 각각 기록합니다.</p>
<p className="leading-8">같은 전체 일을 GPU 하나로 20ms에 끝내던 경우를 놓습니다. 두 개로 나눠 계산이 10ms가 되어도 그 뒤 통신 12ms를 반드시 차례로 수행한다면 전체는 22ms로 더 느립니다(가정). 계산과 통신을 겹칠 수 있으면 시간표가 바뀌지만 어떤 결과가 다음 통신에 필요한지 먼저 따져야 합니다. 두 장치라는 개수만으로 2배 속도를 결론내리지 않습니다.</p>
</div></section>
<section id="limits" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">20. 겹침이 없을 때는 순서·메모리·자원을 차례로 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">
            우선 결과 8이 맞는지와 buffer 재사용이 마지막 읽기 뒤인지 확인합니다. 그다음 host 입력이 pinned인지, 제출한 stream이 무엇인지, 기본 줄이나 event가
            추가 순서를 만들었는지 봅니다. 정확성을 확인한 뒤에야 없애도 되는 기다림을 찾을 수 있습니다.
          </p>
<p className="leading-8">
            그다음 실제 복사 통로의 지원과 자원 사용을 확인합니다. 계산이 메모리 대역폭을 이미 채운 경우에는 복사와 실행이 겹쳐도 서로 느려질 수 있습니다. 작은 chunk는 제출
            비용이 커지고 큰 chunk는 겹칠 기회나 buffer 여유를 줄일 수 있으므로 같은 전체 입력으로 비교합니다.
          </p>
<p className="leading-8">Nsight Systems의 host API와 device 타임라인을 함께 보면 제출 간격인지, 의존 관계의 대기인지, 자원 경합인지 구분하는 데 도움이 됩니다. 이 글의 14ms는 가정한 모형의 결과입니다. 특정 GPU에서 재현한 수치나 CUDA sample 전체를 실행한 benchmark로 제시하지 않습니다.</p>
<p className="leading-8">CPU 계산으로 18·14·24ms와 slot 재사용 조건, 7→8의 대입을 별도로 검산했습니다. 실제 장치의 driver·Toolkit·GPU·메모리 종류·기본 stream 모드를 고정해 측정하는 일은 남는 경계입니다. 계산 내부의 자원 경쟁은 <Link to="/cs/gpu/cuda-register-pressure">레지스터와 배치 한도</Link>에서 이어집니다.</p>
</div></section>
<section id="evidence" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">21. 원문의 규칙이 같은 사례에 어떻게 적용되는지 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">설명 기준은 2026-10-04에 확인한 CUDA 13.0.2 문서와 PTX ISA 9.0, cuda-samples v13.0의 고정 원문입니다. API 규칙과 설명 모형의 숫자를 구별해 읽습니다. 최신 장치에 적용할 때에는 해당 Toolkit과 대상 장치가 같은 규칙을 지원하는지 다시 확인합니다.</p>
</div><div id="paper-cuda-streams"><CitationBlock type="paper" citeKey={1} source="CUDA Runtime13.0.2 · API와 stream 동기화 규칙" href={API+"api-sync-behavior.html"}><p>Async 접미사와 host 대기, pageable 준비 과정, legacy/per-thread 기본 줄이 해결하는 문제를 나누어 읽습니다. 같은 A의 buffer를 언제 다시 만질 수 있는지에 적용합니다. 문서는 임의의 장치에서 14ms를 보장하지 않습니다.</p><a href={API+"stream-sync-behavior.html"}>기본 stream 모드의 별도 정의</a></CitationBlock></div>
<div id="paper-cuda-events"><CitationBlock type="paper" citeKey={2} source="CUDA Runtime13.0.2 · Event와 Stream API" href={API+"group__CUDART__EVENT.html"}><p>기록 시점의 작업 집합과 wait 호출 시점의 기록 선택을 세대1·2에 적용합니다. 빈 event 대기는 미래 생산을 예약하지 않습니다. 시간 계측은 완료·timing 설정과 같은 장치 조건을 확인합니다.</p><a href={API+"group__CUDART__STREAM.html"}>cudaStreamWaitEvent의 교차 장치 규칙</a></CitationBlock></div>
<div id="paper-cuda-source"><CitationBlock type="code" citeKey={3} source="NVIDIA cuda-samples v13.0 · simpleMultiCopy" href="https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/simpleMultiCopy/simpleMultiCopy.cu"><p>
            slot 배열과 cycleDone을 통해 재사용 순서를 읽고, 실제 kernel의 입력+1에 7을 대입합니다. 원문 기본값 0·출력 1과 설명 입력 7·출력 8을 구별합니다.
            SIMULATE_IO와 기본 줄을 바꾸는 경우에는 host 수명과 계측을 다시 검토합니다.
          </p></CitationBlock></div>
<div id="paper-cuda-warp-sync"><CitationBlock type="paper" citeKey={4} source="CUDA Guide13.0.2 · Synchronization·Warp Functions" href={GUIDE+"#synchronization-functions"}><p>
            동작 범위를 block과 warp로 좁혀 같은 7의 전달을 설명합니다. Syncwarp의 memory ordering과 shuffle·vote의 값 교환을 구별하고 참여
            mask·종료·분기 조건을 확인합니다.
          </p></CitationBlock></div>
<div id="paper-cuda-memory-fence"><CitationBlock type="paper" citeKey={5} source="CUDA Guide13.0.2 · Memory Fence Functions" href={GUIDE+"#memory-fence-functions"}><p>접근 순서와 상대의 도착·visibility·atomicity를 분리합니다. 7을 공개하는 과정에서 fence만으로 data race를 해결했다고 주장하지 않으며 범위가 맞는 publication이 필요함을 확인합니다.</p></CitationBlock></div>
<div id="paper-cuda-async-barrier"><CitationBlock type="paper" citeKey={6} source="CUDA Guide13.0.2 · Asynchronous Barrier와 PTX9.0 bar" href={GUIDE+"#asynchronous-barrier"}><p>
            기대 도착 수2의 C++ barrier와 PTX의 64명 named barrier를 구별합니다. Arrive 뒤 독립 작업과 wait 이후 읽기를 나누고 phase 사용 조건을
            확인합니다. 분리가 언제나 더 빠르다는 주장으로 넓히지 않습니다.
          </p><a href={PTX}>PTX의 생산자·소비자 원문</a></CitationBlock></div>
<div id="paper-cuda-multi-gpu"><CitationBlock type="paper" citeKey={7} source="CUDA Guide13.0.2 · Multi-Device System" href={GUIDE+"#multi-device-system"}><p>
            Kernel·record·elapsedTime과 cross-device wait의 서로 다른 규칙을 GPU0의 8이 GPU1로 가는 경로에 적용합니다. P2P 접근 허용 방향과
            복사 방향을 나누며 토폴로지에 따른 지원 조건을 보존합니다.
          </p></CitationBlock></div></section>
<section id="review" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">22. 같은 작업에서 기다림의 위치를 바꿔 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">필요한 결과가 언제 준비되는지에서 출발하면 stream 수보다 먼저 그려야 할 것이 보입니다. 같은 buffer의 생산과 소비, 완료와 재사용을 연결한 뒤 아래 조건을 바꿔 예측해 봅니다.</p>
</div><ReviewPrompts questions={["두 묶음의 단계 시간이 2·5·2ms일 때 5ms가 전체 완료 시간이 될 수 없는 이유는 무엇인가요? (답: 7절)","B가 아직 기록하지 않은 event를 기다리고 나서 A가 기록하면, B는 A의 8을 안전하게 읽을 수 있나요? (답: 11절)","GPU1을 선택했을 때 GPU0의 event를 기다리는 호출도 모두 실패할까요? (답: 18절)" ]}/></section>
{codeKey&&<CodeSidebar codeRefKey={codeKey} codeRef={codeRefs[codeKey]} onClose={()=>setCodeKey(null)} onNavigate={setCodeKey} codeRefs={codeRefs} fileTrees={fileTrees}/> }</div>}
