import { useState } from "react";
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton } from "@/components/code";
import NumericPath from "@/pages/articles/world-systems/NumericPath";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import SourceApplication from "@/pages/articles/world-systems/SourceApplication";
import AllocationPackingViz, { RegisterOccupancyCurve } from "./viz/AllocationPackingViz";
import TailOccupancyViz from "./viz/TailOccupancyViz";
import { codeRefs, fileTrees } from "./codeRefs";
const PRACTICES="https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-best-practices-guide/index.html#calculating-occupancy";
const GUIDE="https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-programming-guide/index.html";
const PTX="https://docs.nvidia.com/cuda/archive/13.0.2/parallel-thread-execution/index.html#pragma-strings-enable-smem-spilling";
const NCU="https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#sections-and-rules";
export default function Article(){const [codeKey,setCodeKey]=useState<string|null>(null);return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 동시에 붙잡는 값이 많아지면 함께 일할 자리도 줄어듭니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">중간 계산값을 가까이 보관하면 다시 가져오는 일을 줄일 수 있습니다. 하지만 여러 사람이 동시에 일하려면 각자의 중간값을 함께 둘 공간이 필요합니다. 한 사람에게 넉넉히 내어 준 공간이 다른 사람을 들이지 못하는 이유가 될 수 있습니다.</p>
<p className="leading-8">
            GPU에서도 이런 선택이 생깁니다. 이 글은 필요한 저장칸을 세는 일에서 출발해 동시에 배치할 수 있는 일의 수를 구하고 실제로 빨라졌는지를 별도로 확인하는 순서로 이어집니다.
          </p>
</div></section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 필요한 저장량을 세고 작업 묶음이 들어갈 수 있는지 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">
            입력은 한 사람이 붙잡아야 할 값의 수, 함께 움직여야 하는 사람의 수, 장치가 가진 전체 공간입니다. 먼저 묶음별 예약량을 구하고 그 묶음이 통째로 몇 개 들어가는지
            계산합니다.
          </p>
<p className="leading-8">
            이렇게 계산하면 함께 배치할 수 있는 일의 상한을 알 수 있습니다. 그 일을 끝내는 데 걸리는 시간은 아직 나오지 않습니다. 공간이 충분해도 필요한 값의 도착을 기다릴 수 있기
            때문입니다.
          </p>
</div><NumericPath title="함께 배치할 수 있는 일을 구하는 과정" steps={[{label:"필요한 칸",value:"한 사람의 보존할 값"},{label:"예약",value:"정해진 단위로 묶음 확보"},{label:"입장 가능",value:"통째로 들어가는 묶음 수"}]}/></section>
<section id="case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 한 사람당 37칸을 쓰는 같은 일을 128명 또는 320명씩 묶습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">한 작업 구역에 저장칸 65,536개가 있고 한 사람당 37칸을 쓴다고 놓습니다. 32명분을 예약할 때는 37×32=1,184칸이 필요하지만, 공간을 256칸 단위로 내어 주므로 1,280칸을 예약합니다. 96칸은 배정 단위 때문에 남습니다.</p>
<p className="leading-8">
            같은 일을 128명씩 묶으면 32명분이 4개이고 320명씩 묶으면 10개입니다. 함께 움직이는 한 묶음의 사람을 둘로 나눠 빈 공간에 넣지는 못합니다. 이 숫자는 공식 문서의
            계산 사례이며 실제 프로그램의 속도 측정값은 아닙니다. 정확한 대상과 원문은 8절에서 확인합니다.
          </p>
</div></section>
<section id="picture" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 작은 묶음은 빈자리에 들어가지만 큰 묶음은 통째로 기다립니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">저장 공간은 안쪽의 네 공간으로 나뉘어 있습니다. 각 공간의 16,384칸에는 1,280칸 예약을 12개까지 넣습니다. 따라서 32명분의 자리는 총 48개입니다.</p>
<p className="leading-8">4자리씩 묶은 일은 12묶음이 들어갑니다. 10자리씩 묶은 일은 4묶음을 넣고 나면 8자리만 남습니다. 다음 10자리 묶음을 들일 수 없어 그 자리는 비어 있습니다. 그림의 마지막 장면에서는 사람당 필요한 칸을 늘려 같은 원리로 비교합니다.</p>
</div><AllocationPackingViz/></section>
<section id="why" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 같이 실행할 사람들의 값도 함께 보관해야 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">한 사람의 계산 결과를 기다리는 동안 다른 사람의 일을 진행하려면 기다리는 사람의 값도 보존해야 합니다. 대기한다고 저장 공간까지 바로 반납하면 돌아왔을 때 계산을 이어 갈 수 없습니다.</p>
<p className="leading-8">묶음은 함께 쓰는 공간과 서로 기다리는 규칙을 가집니다. 그래서 빈자리 수를 모두 더한 값만으로 입장 여부를 정하지 않습니다. 한 묶음을 함께 놓을 수 있는지가 필요합니다. 이제 저장칸과 작업 묶음을 실제 GPU 용어로 부릅니다.</p>
</div></section>
<section id="names" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 저장칸과 작업 묶음에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">계산을 따라가는 최소 작업 단위를 thread라고 합니다. NVIDIA GPU는 32개 thread를 warp로 묶고, 여러 warp를 포함하는 block을 한 SM에 배치합니다. SM은 이 작업들을 실행하며 저장 자원을 제공하는 처리 구역입니다.</p>
<p className="leading-8">
            한 thread의 값을 가까이 보관하는 32-bit 저장칸이 register이고 SM이 제공하는 전체 칸이 register file입니다. 한 값을 만든 뒤 마지막으로 사용할
            때까지 보존해야 하는 구간을 live range라고 합니다. 다음 표에서 앞서 본 역할과 이름을 짝지어 봅니다.
          </p>
</div><TermBreakdown title="역할에서 이름으로" items={[
{term:"Thread · warp · block · SM",description:"한 사람·32명 묶음·함께 배치할 일·처리 구역에 대응하는 NVIDIA 실행 단위입니다.",example:"128-thread block은 4 warps이며 같은 SM에 놓입니다.",boundary:"Warp의 32와 배치 규칙을 AMD의 다른 세대에 그대로 옮기지 않습니다."},
{term:"Register · register file",description:"계산값을 두는32-bit 칸과SM의 전체 저장 공간입니다.",example:"64-bit double이 register에 놓이면 표현에 최소 2칸이 필요합니다.",boundary:"소스 변수 하나가 언제나 물리 register 하나가 되는 것은 아닙니다."},
{term:"Live range · register pressure",description:"마지막 사용까지 값을 보존하는 구간과, 겹치는 구간이 만드는 저장 수요입니다.",example:"일찍 만든 중간값을 나중에 쓰는 동안 다른 중간값이 생기면 함께 보존해야 합니다.",boundary:"실제 배정에는 최적화·주소 계산·대상 제약이 함께 들어갑니다."}]}/><ContentBoundary article="cuda-register-pressure"/></section>
<section id="trace" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 같은 37개에서 묶음 크기만 바꿔 끝까지 계산합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">처음의 37 registers/thread로 돌아갑니다. 한 warp의 원래 요구량은 1,184개이고 예약량은 1,280개입니다. 네 구역 각각에 12 warps 분량이 들어가 register 한도는 48 warps입니다.</p>
<p className="leading-8">128-thread block은 4 warps입니다. 48÷4=12 blocks를 놓고 48 warps가 배치됩니다. 이 대상의 최대 64 warps로 나누면 75%입니다. 320-thread block은 10 warps이므로 4 blocks, 40 warps만 놓아 62.5%입니다. 공식 문서의 63%는 이를 반올림한 값입니다.</p>
<p className="leading-8">필요한 register 수를 줄이지 않아도 block 크기로 배치 결과가 달라졌습니다. 그렇다고 75%인 설정이 62.5%인 설정보다 반드시 빠르다는 결론은 나오지 않습니다. 두 숫자가 알려 주는 것은 배치 가능한 비율입니다.</p>
</div><NumericPath title="37개와128-thread block의 같은 사례" steps={[{label:"warp 예약",value:"1184 → 1280개"},{label:"네 구역",value:"12 × 4 = 48 warps"},{label:"block 배치",value:"12 × 4 / 64 = 75%"}]}/></section>
<section id="register-file" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 배정 단위와 다른 자원 한도를 차례로 적용합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">여기까지의 대상은 compute capability 7.0입니다. CUDA Best Practices 13.0.2 §11.1.1은 65,536개의 32-bit register, warp당 256개 배정 단위, 37개·128/320-thread 예를 함께 제시합니다. 65,536×4 bytes는 262,144 bytes, 즉 256 KiB입니다. 다음 식은 이 사례의 register 제약을 풀어 쓴 모형입니다.</p>
<p className="leading-8">한 thread당 최대 255개라는 제한과 SM 전체 65,536개는 단위가 다릅니다. 한 thread가 한도 아래에 있어도 block 전체가 들어가지 않을 수 있습니다. 또한 모든 GPU의 최대 warp 수를 64로 고정할 수 없습니다. 대상 GPU의 속성과 컴파일된 함수의 사용량을 확인해야 합니다.</p>
</div><SourceApplication source="CUDA Best Practices13.0.2 §11.1.1" excerpt="rounded up to the nearest 256 registers per warp" application="37×32=1184를256의 배수1280으로 올립니다. 128-thread block12개는48warps라75%이고,320-thread block4개는40warps라62.5%입니다."/>
<ExplainedFormula question="배정 단위가 있는 register 공간에 몇 block이 들어갈까요?" idea="warp 하나의 예약량을 먼저 올림하고, 네 구역별로 들어갈 warp 수를 내림합니다. 마지막에 block당 warp 수로 나눠 통째로 들어가는 block만 셉니다." formula={String.raw`\begin{aligned}A&=256\lceil32R/256\rceil\\W_R&=4\lfloor16384/A\rfloor\\B_R&=\lfloor W_R/\lceil T/32\rceil\rfloor\end{aligned}`} annotatedFormula={String.raw`\begin{aligned}A&=\underbrace{256\lceil32R/256\rceil}_{\text{warp 예약량 올림}}\\[3pt]W_R&=\underbrace{4\lfloor16384/A\rfloor}_{\text{네 구역별 수용량 합}}\\[3pt]B_R&=\underbrace{\lfloor W_R/\lceil T/32\rceil\rfloor}_{\text{온전한 block 수}}\end{aligned}`} operations={[{expression:String.raw`256\lceil32R/256\rceil`,annotation:["32명 요구량을","256칸 단위로 예약"]},{expression:String.raw`4\lfloor16384/A\rfloor`,annotation:["한 구역에서 내린 뒤","네 구역을 합침"]},{expression:String.raw`\lfloor W_R/\lceil T/32\rceil\rfloor`,annotation:["block당 warp 수로 나눠","완전한 묶음만 남김"]}]} terms={[{symbol:"R",name:"thread당 register 수",description:"이 사례는37입니다. 소스 변수 개수 대신 실제 배정 보고의 수를 입력합니다."},{symbol:"A",name:"warp당 예약량",description:"256개 단위로 올린32-bit칸 수입니다."},{symbol:"W_R",name:"register만 본 warp 용량",description:"배정 가능한 최대warp 용량이며 block을 놓은 실제warp 수와 다릅니다."},{symbol:"T",name:"block의 thread 수",description:"128 또는320입니다."},{symbol:"B_R",name:"register만 본 block 수",description:"이 제약만 허용하는 수이며 다른 자원이 더 낮출 수 있습니다."}]} assumptions={["CC7.0의 네 구역·256개 배정 단위를 사용하는 설명 모형입니다.","Block/thread 최대치, block당 register 검사, shared memory 등 나머지 launch 조건은 별도입니다."]} interpretation="37개에서A=1280,W_R=48입니다. T=128이면B_R=12,T=320이면B_R=4입니다. 범용GPU occupancy API의 전체 구현을 대체하지 않습니다."/>
<AlgorithmBlock title="자원 제약을 순서대로 계산하는 의사코드" input={["대상GPU 속성·컴파일된 함수의 사용량","T threads/block과 동적shared memory"]} steps={[{code:"launch 제한을 검사하고 대상의 배정 단위를 적용한다",note:"Thread/block/register 한도를 넘는 설정은 실행할 수 없습니다."},{code:"각 자원이 허용하는 block 수를 계산한다",note:"Register·shared memory·warp·block 한도를 같은block 단위로 바꿉니다. 대상에 따라 추가 제한도 있습니다."},{code:"B = 모든 block 한도의 최솟값",note:"하나의 자원이라도 먼저 부족하면 그 수까지만 놓습니다."},{code:"W = B × ceil(T / warpSize)",note:"대상의 최대warp 수로 나눠 theoretical occupancy를 구합니다."}]} output="배치 가능한 상한. 실제 시간은 별도로 측정합니다."/>
<RegisterOccupancyCurve/>
<div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            64 registers/thread는 warp당 2048개라 32 warps, 128개는 4096개라 16 warps의 단순 register 상한입니다. 96개는 warp당
            3072개이고 구역별 5개씩 총 20 warps입니다. 이를 256-thread block의 8 warps씩 묶으면 2 blocks·16 warps, 25%가 됩니다. 반올림을
            생략한 21 warps를 실제 배치 수로 쓰면 안 됩니다.
          </p></div></section>
<section id="live-range" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 값을 언제까지 보존하느냐가 자리 재사용을 바꿉니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">
            실제 물리 register 수를 변수 선언문에서 그대로 세기는 어렵습니다. 값을 다 읽었다면 같은 칸에 다음 값을 놓을 수 있고 상수나 짧은 계산은 보관 대신 다시 계산할 수도
            있습니다. 앞의 선택은 레지스터 재사용(register reuse)입니다. 뒤의 선택은 재계산(rematerialization)입니다.
          </p>
<p className="leading-8">예를 들어 x=7에서 a=x+1=8, y=2a=16을 차례로 계산하고 x를 다시 쓰지 않는다고 가정합니다. 설명용 값 배치에서는 x의 마지막 사용 뒤 그 칸을 a에 줄 수 있습니다. 이와 달리 마지막에 a+x를 구하려면 x=7을 계속 보존해야 합니다. 실제 명령 선택과 인자·주소 register까지 포함한 배정 수는 대상 컴파일 결과로 확인합니다.</p>
<p className="leading-8">base+i×stride 주소를 다시 만드는 선택도 입력들이 아직 남아 있어야 가능합니다. 재계산은 추가 명령과 의존을 만들므로 무조건 싸지 않습니다. 부동소수점 계산을 옮기거나 합치는 최적화는 반올림과 프로그램 의미의 제약도 지켜야 합니다.</p>
<p className="leading-8">Kernel 여러 개를 합치면 중간 메모리 왕복을 줄일 수 있지만, 앞 결과를 뒤 계산까지 보존하며 다른 중간값과 구간이 겹칠 수 있습니다. 각 kernel의 register 수를 더하거나 최댓값만 취해 합친 kernel의 배정을 정할 수는 없습니다. <Link to="/cs/gpu/cuda-compilation-and-isa-analysis#ptxas-optimizations">컴파일과 실제 명령의 대응</Link>에서 그 결과를 읽는 방법을 이어 봅니다.</p>
</div></section>
<section id="residency" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 배치 가능한 상한과 실제 활동량을 구별합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">자원 한도로 계산한 최대 배치 비율이 theoretical occupancy입니다. 실행 중에는 실제로 남아 있는 active warp 수를 같은 하드웨어 최대치와 비교해 achieved occupancy를 관측합니다. 수집 구간과 cycle 분모는 profiler metric 정의를 따라야 합니다.</p>
<p className="leading-8">배치된 warp가 있어도 다음 입력을 기다리면 명령을 내지 못합니다. 따라서 active warp와 지금 명령을 낼 수 있는 eligible warp는 다릅니다. <Link to="/cs/gpu/sm-warp-scheduling-and-issue#issue-scoreboard">명령 발행 글의 준비 조건</Link>을 함께 보면 높은 occupancy인데도 발행이 비는 상황을 설명할 수 있습니다.</p>
<p className="leading-8">낮은 theoretical 값은 가능한 배치 수를 제한하지만 언제나 고쳐야 하는 결함은 아닙니다. 값의 재사용이나 독립된 계산이 충분한 kernel은 낮은 occupancy에서도 필요한 처리율을 얻을 수 있습니다. 조정의 목적은 주어진 일을 더 빨리 끝내는 것입니다.</p>
</div></section>
<section id="occupancy-wave" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 마지막 일감이 적으면 자리가 남아도 채울 수 없습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">앞의 96 registers/thread·256-thread block 설정은 한 SM에 block 2개, warp 16개를 허용합니다. 이 설정을 SM 4개에 적용하고 block 10개가 같은 시간 동안 일한다고 가정합니다. 첫 회차에는 8개, 다음 회차에는 남은 2개를 배치합니다(가정).</p>
<p className="leading-8">하드웨어 분모는 4×64=256 warps입니다. 첫 회차의 64 warps는 25%, 다음의 16 warps는 6.25%입니다. 두 회차의 시간이 같고 모든 SM을 전체 경과 시간으로 평균 내면 (25+6.25)/2=15.625%입니다. 이를 특정 Nsight metric의 출력값이라고 부르지는 않습니다. SM이 활동한 cycle만 분모로 삼으면 비어 있는 시간의 취급이 달라집니다.</p>
<p className="leading-8">
            원래의 큰 예도 같은 방식입니다. 132 SM에 2 blocks씩이면 264개 자리이고 grid 300 blocks는 두 번째에 36개를 남깁니다. 36/264=13.636%는
            그 회차의 block 자리 이용률입니다. 그것만으로 하드웨어 최대 warp 대비 occupancy가 13.636%라고 할 수는 없습니다.
          </p>
<p className="leading-8">또 block 안에서 warp 8개 중 5개가 먼저 끝나면 남은 warp는 3개입니다. block은 아직 끝나지 않았지만 active warp 수는 줄어듭니다. 시간이 어떻게 분배되는지와 block 안 일감 차이를 보고 원인을 좁혀야 합니다.</p>
</div><TailOccupancyViz/></section>
<section id="spill-path" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 내려놓은 값의 읽기량과 실제 외부 전송량은 다릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">
            Compiler가 register에 계속 둘 수 없는 값을 다른 저장 공간에 내려놓는 일을 spill이라고 합니다. 기본 local-memory 경로에서는 thread별 주소로
            저장하지만 실제 저장 공간은 device memory에 있습니다. 이름의 local은 thread의 주소 범위를 가리킵니다.
          </p>
<p className="leading-8">각 thread가 반복마다 4-byte 값 하나를 정확히 한 번 저장하고 한 번 읽는다고 가정합니다. 2²⁰ threads가 1,000번 반복하면 한 방향의 요청량은 1,048,576×1,000×4=4,194,304,000 bytes이고 양방향 합은 8,388,608,000 bytes입니다. 8.388608 GB 또는 7.8125 GiB입니다(가정).</p>
<p className="leading-8">이 합은 실행한 local 읽기·쓰기의 논리 byte입니다. L1에서 처리한 접근도 명령과 내부 대역폭을 쓰지만 모든 byte가 DRAM으로 내려가지는 않습니다. L1 miss가 L2에서 처리될 수도 있습니다. 실제 전송량은 메모리 계층별로 따로 확인합니다.</p>
<p className="leading-8">가령 양방향 8.388608 GB가 모두 DRAM을 통과하고 그 전송에 유효 3 TB/s를 얻는다고 추가 가정하면 전송량÷대역폭은 약 2.7962 ms입니다. 다른 계산과 겹치거나 실제 전송량·대역폭이 달라질 수 있으므로 kernel에 그 시간만큼 추가된다는 보장은 없습니다.</p>
<p className="leading-8">
            SASS의 local load/store와 compiler 보고는 출발점입니다. 하지만 local 배열이나 stack도 그 주소 공간을 사용할 수 있어 모든 local 접근이
            spill은 아닙니다. 정적 보고의 byte 수에 thread 수만 곱해 동적 실행량을 정하지 말고 반복·분기·실제 실행 횟수와 profiler 결과를 확인합니다.
          </p>
</div></section>
<section id="shared-spill" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">13. 지원되는 새 컴파일러는 공유 공간에 값을 내릴 수도 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">
            CUDA 13은 opt-in으로 spill을 shared memory에 먼저 놓는 경로를 추가했습니다. 가까운 공간을 활용하면 local 경로의 비용을 줄일 기회가 생기지만
            block당 shared memory 사용량이 늘어 다른 block의 입장을 막을 수 있습니다.
          </p>
<p className="leading-8">고정한 PTX ISA 9.0 §12.3의 지시문은 .pragma "enable_smem_spilling";입니다. shared 공간이 부족하면 남은 spill은 local 경로로 갑니다. 따라서 local spill 보고가 0이어도 모든 값이 register에 있다는 뜻은 아닙니다.</p>
<p className="leading-8">이 버전의 대상 조건은 sm_75 이상입니다. 앞서 계산한 CC 7.0 사례에는 이 기능을 그대로 켤 수 없습니다. 함수별 분리 컴파일, device debug, 재귀가 있는 해당 모드, 동적 shared memory, setmaxnreg 사용에는 제한이 있습니다. Launch bounds는 공간 추정을 위해 권장되며 문법상의 필수 입력이라고 바꾸어 말하지 않습니다.</p>
<p className="leading-8">예를 들어 지원 대상에서 비어 있던 shared 공간을 spill에 쓰는 선택을 검토한다면 새 shared 사용량으로 occupancy를 다시 계산해야 합니다. local 전송이 줄어든 이득과 동시 배치가 줄어든 비용을 실제 실행 시간으로 비교합니다.</p>
</div><SourceApplication source="PTX ISA9.0 §12.3 · Target ISA Notes" excerpt="Requires sm_75 or higher." application="처음 사례는CC7.0이므로 지원 조건을 충족하지 않습니다. 지원GPU로 옮기면 그GPU의 자원 속성과 새shared 사용량으로 계산해야 합니다."/></section>
<section id="implementation" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">14. 실제 원문 함수에 같은 배치 숫자를 넣습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">
            배치 비율을 실제 코드에서는 어떻게 구할까요? NVIDIA cuda-samples v13.0의 simpleOccupancy.cu는 reportPotentialOccupancy
            함수에서 장치 속성을 읽고 kernel·blockSize·dynamicSMem을 occupancy API에 넘깁니다. API의 출력 numBlocks는 동시에 놓을 block
            수입니다.
          </p>
<p className="leading-8">같은 37개 사례에서 API가 12를 돌려주고 blockSize=128, warpSize=32, maxThreadsPerMultiProcessor=2048이라고 놓습니다. 원문의 78행은 12×128/32=48, 79행은 2048/32=64를 계산하고 81행은 0.75를 반환합니다. 320명 사례의 numBlocks=4를 넣으면 40/64=0.625입니다. 실제 sample을 37 registers로 컴파일했다는 주장이 아니라 원문 함수에 조건부 입력을 대입한 결과입니다.</p>
<p className="leading-8">이 함수의 정수 나눗셈은 여기처럼 blockSize가 32의 배수일 때 쓰는 변환입니다. 일반적인 부분 warp까지 설명하려면 ceil(blockSize/warpSize)를 먼저 계산해야 합니다. 실제 원문과 범용 식의 적용 범위를 구별합니다.</p>
<p className="leading-8">
            같은 파일의 square kernel은 정수 배열을 제곱합니다. block 0·thread 3·blockSize 128이면 idx=3이고 범위 안의 값 7을 49로 바꿉니다.
            소스의 계산이 짧다는 사실로 register 배정 수를 알 수는 없습니다.
          </p>
<p className="leading-8">
            launchConfig 함수는 자동 추천 크기 또는 수동 32를 선택하고 event 사이에서 kernel을 실행합니다. 뒤에서 occupancy와 elapsedTime을 따로
            보고합니다. 원문 자체가 추천 크기와 실제 시간 확인을 분리한 구조입니다. 이 세 함수를 고정 원문에서 직접 열 수 있습니다.
          </p>
</div><div className="my-6 flex flex-wrap gap-3"><CodeViewButton onClick={()=>setCodeKey("occupancy")} label="실제 배치 비율 함수 · 62–84행"/><CodeViewButton onClick={()=>setCodeKey("square")} label="실제 square · 41–49행"/><CodeViewButton onClick={()=>setCodeKey("launch")} label="추천과 측정 · 119–156행"/></div></section>
<section id="release-gate" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">15. 자리 수를 늘린 뒤 처리 시간이 어떻게 바뀌었는지 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">
            먼저 원래 결과와 조정 뒤 결과가 같은지 확인합니다. 그 뒤 GPU·compiler·입력 크기·block 크기를 고정하고 실제 배정 register와 local/shared
            사용량을 기록합니다. 같은 설정의 theoretical occupancy와 실행 중 active·eligible 상태, 메모리 계층별 전송량을 연결해 봅니다.
          </p>
<p className="leading-8">
            Register 상한을 낮추면 배치가 늘 기회가 있지만 spill이나 재계산이 늘 수 있습니다. __launch_bounds__는 thread/block 제약을
            compiler에 알리는 방법이고 -maxrregcount와 __maxnreg__는 register 사용을 제어합니다. 서로의 제약과 우선순위는 사용 버전의 문서를 확인해야
            하며 이를 속도 보장 옵션으로 읽지 않습니다.
          </p>
<p className="leading-8">반례를 만들 수 있습니다. register를 줄여 배치 비율이 올라갔지만 매 반복의 읽기와 재계산이 늘어 kernel이 더 오래 걸릴 수 있습니다. 반대로 register를 더 써도 반복 중 값을 재사용하여 전체 시간이 줄 수 있습니다. 두 경우를 가르는 것은 실제 경과 시간과 병목의 변화입니다.</p>
<p className="leading-8">비교할 때는 준비 실행과 반복 측정을 하고, profiler 재실행이나 cache 상태가 시간을 바꾸는지도 기록합니다. Kernel 시간과 사용자가 기다리는 전체 시간은 따로 확인합니다. 효과가 없는 설정은 원래 설정으로 돌아가고, <Link to="/cs/gpu/cuda-kernel-fusion">kernel fusion</Link>에서는 이 자원 비용을 줄어든 중간 전송과 함께 비교합니다.</p>
</div></section>
<section id="evidence" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">16. 문서 예제와 직접 실행한 계산의 범위를 구별합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">
            문서의 수치 예와 원문 함수에 넣은 조건부 계산을 확인하고, 계산기를 직접 실행한 결과도 따로 확인했습니다. CUDA 13.0.96에 포함된 standalone
            occupancy calculator를 CPU에서 실행하며 명시한 CC 7.0 속성을 입력했고 (37,128)→12 blocks, (37,320)→4 blocks,
            (96,256)→2 blocks를 확인했습니다. 이는 실제 GPU에서 장치 속성을 조회하거나 kernel 시간을 측정한 실행은 아닙니다.
          </p>
<p className="leading-8">소스 패널에는 BSD 라이선스의 cuda-samples 원문 전체와 commit을 고정했습니다. CPU 계산을 확인하는 작성 예제에는 입력한 장치 속성을 함께 남겼습니다. 설치된 계산기 header를 참조해 같은 숫자를 다시 확인할 수 있습니다. 실제 장비에서 얻을 register 수와 시간은 그 장비의 컴파일·측정으로 채워야 합니다.</p>
</div><div id="paper-cuda-best-practices-occupancy"><CitationBlock type="code" citeKey={1} source="CUDA Best Practices13.0.2 §11.1.1" href={PRACTICES}><p>
            Register 수만 나누어 잘못된 입장 수를 얻는 문제를 배정 단위와 block 크기로 설명합니다. 근거는 CC 7.0의 37개 예이며 세대별 상수나 속도 증가율을 일반화하지
            않습니다.
          </p></CitationBlock></div>
<div id="paper-cuda-register-memory"><CitationBlock type="code" citeKey={2} source="CUDA Programming Guide13.0.2 · Hardware Multithreading / Occupancy / Local Memory" href={GUIDE}><p>Thread별 상태를 보존하며 여러warp를 배치하는 방식과 자원·주소 공간의 경계를 제공합니다. Local은 thread별 주소이고 다른 계층의 전송량은 별도입니다. 공식API의 예측은 실제 실행 시간의 보장이 아닙니다.</p></CitationBlock></div>
<div id="paper-nsight-compute-registers"><CitationBlock type="code" citeKey={3} source="Nsight Compute Profiling Guide · 확인2026-10-04" href={NCU}><p>Occupancy와 scheduler·memory 관측을 나눠 해석하도록 연결합니다. Metric 이름·분모·대상·replay 설정을 함께 확인합니다. 큰 theoretical/achieved 차이는 불균형을 살펴볼 단서이며 원인 하나를 확정하는 증거가 아닙니다.</p></CitationBlock></div>
<div id="paper-cuda-occupancy-source"><CitationBlock type="code" citeKey={4} source="NVIDIA cuda-samples v13.0 · commit3f1c509" href="https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/simpleOccupancy/simpleOccupancy.cu"><p>
            62–84행은 block 수를 warp 비율로 바꾸고 119–156행은 추천과 시간을 따로 다룹니다. 같은 37개 사례의 조건부 숫자를 함수에 대입했습니다. Sample의 실제
            register 수나 GPU 속도를 측정했다는 뜻은 아닙니다.
          </p></CitationBlock></div>
<div id="paper-shared-register-spilling"><CitationBlock type="code" citeKey={5} source="PTX ISA9.0 §12.3 · enable_smem_spilling" href={PTX}><p>
            Spill의 일부를 shared 공간으로 옮기는 선택을 규정합니다. 이 버전의 sm75+ 조건과 compilation mode 제한을 보존하며 7.0 주사례에는 적용하지
            않습니다. Local traffic 감소만으로 전체 속도 개선을 보장하지 않습니다.
          </p></CitationBlock></div></section>
<section id="review" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">17. 입력 조건을 바꾸고 결과를 예측합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">필요한 값을 어디에 얼마나 오래 보존하는지에서 시작하면, 예약량과 함께 배치할 작업 수를 계산할 수 있습니다. 그 상한과 실제 기다림·전송·시간을 구분한 채 다음 조건을 바꿔 봅니다.</p>
</div><ReviewPrompts questions={["같은 37 registers/thread에서 block을 128명에서 320명으로 바꾸면 왜 75%가 62.5%가 될까요? (답: 7절)","양방향local 요청량이 8.388608GB라고 알면 kernel에 2.7962ms가 추가된다고 말할 수 있을까요? (답: 12절)","Local spill 보고가 0이면 모든 값이 register에 있고 더 빠르다고 결론낼 수 있을까요? (답: 13절)" ]}/></section>
{codeKey&&<CodeSidebar codeRefKey={codeKey} codeRef={codeRefs[codeKey]} onClose={()=>setCodeKey(null)} onNavigate={setCodeKey} codeRefs={codeRefs} fileTrees={fileTrees}/>}
</div>}
