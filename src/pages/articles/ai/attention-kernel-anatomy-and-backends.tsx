import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import NumericPath from "@/pages/articles/world-systems/NumericPath";
import SourceApplication from "@/pages/articles/world-systems/SourceApplication";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import AttentionKernelAnatomyAndBackendsViz from "./attention-kernel-anatomy-and-backends/viz/AttentionKernelAnatomyAndBackendsViz";
import AttentionScaleViz from "./attention-kernel-anatomy-and-backends/viz/AttentionScaleViz";
import AttentionArithmeticViz from "./attention-kernel-anatomy-and-backends/viz/AttentionArithmeticViz";
import AttentionTrafficViz from "./attention-kernel-anatomy-and-backends/viz/AttentionTrafficViz";
import AutotuneCandidateViz from "./attention-kernel-anatomy-and-backends/viz/AutotuneCandidateViz";
import {codeRefs,fileTrees,projectMetas} from "./attention-kernel-anatomy-and-backends/codeRefs";
const prose="prose prose-neutral max-w-none dark:prose-invert";
export default function Article(){
 const sidebar=useCodeSidebar();
 const code=(key:string,label:string)=><CodeViewButton label={label} onClick={()=>sidebar.open(key,codeRefs[key])}/>;
 return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">1 · 여덟 위치의 값을 섞되 미래는 보지 않는다</h2><div className={prose}>
<p>
            (가정) 문장 속 위치가 여덟 개이고 각 위치에서 가져올 값의 첫 성분은 차례로 1, 2, 3, 4, 5, 6, 7, 8이라고 해 봅시다. 어느 위치를 더 중요하게 볼지 정하는
            점수는 모두 0으로 맞춥니다. 허용한 위치의 중요도가 같으므로 출력은 그 값들의 단순한 평균입니다.
          </p>
<p>마지막 위치는 여덟 값을 모두 참고해 36÷8=4.5를 얻습니다. 두 번째 위치는 자기 앞과 자기 자신인 1, 2만 참고하므로 1.5를 얻습니다. 여기서 미래를 허용하면 두 번째 위치도 4.5가 됩니다. 계산을 빠르게 만드는 동안 이 차이가 사라지면 안 됩니다.</p>
<p>이 글은 같은 여덟 위치를 여러 작업자가 나눠 처리하는 과정을 따라갑니다. 어느 조각을 건너뛸지, 나눈 평균을 어떻게 합칠지, 같은 배열을 몇 번 다시 읽는지 확인합니다. 마지막에는 서빙 프로그램이 실제 구현을 고르는 코드까지 이 조건을 가져갑니다.</p>
</div>

</section>
<section id="black-box" data-teach-level="B" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">2 · 허용한 위치와 입력 값이 출력의 계약을 정한다</h2><div className={prose}>
<p>
            입력은 관심 위치를 나타내는 수, 비교할 위치의 수, 가져올 값입니다. 각 위치의 수는 두 성분으로 두겠습니다. 관심 위치의 수는 전부 [0,0]이고 비교 대상과 가져올 값은
            [1,0]부터 [8,0]까지입니다. 곱해 더한 점수가 모두 0이 되는 구체적인 입력입니다.
          </p>
<p>출력도 두 성분입니다. 뒤의 성분은 늘 0이므로 앞으로는 첫 성분만 쓰겠습니다. 자기보다 뒤를 가리면 출력은 [1,1.5,2,2.5,3,3.5,4,4.5]입니다. 위치 번호를 0부터 세므로 마지막 위치의 번호는 7입니다.</p>
<p>새로 계산할 관심 위치가 마지막 한 개만 남아도 그 위치의 번호가 0으로 바뀌지는 않습니다. 기존 여덟 위치 중 7번을 계산하는 것이므로 여전히 여덟 값을 읽고 4.5를 내야 합니다. 입력 배열의 행 번호와 문장 전체에서의 위치를 구별하겠습니다.</p>
<p>계약을 확인하려면 마지막 값만 8에서 80으로 바꿔 보는 작은 반례가 유용합니다. 두 번째 위치는 여전히 1과 2만 보므로 1.5를 유지해야 합니다. 마지막 위치는 합이 108로 바뀌어 13.5를 냅니다. 둘째 출력까지 13.5로 바뀌었다면 미래를 가리는 조건을 잃은 것입니다. 이 반례를 확인한 뒤 원래 값 8로 돌아가겠습니다.</p>
</div>

</section>
<section id="case" data-teach-level="0" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">3 · 같은 여덟 값을 둘씩 묶어 처리한다</h2><div className={prose}>
<p>먼저 미래까지 모두 허용한 비교용 계산을 봅니다. 관심 위치 두 개와 비교 대상 두 개를 묶으면 점수 네 개가 생깁니다. 전체 여덟 위치를 둘씩 나누면 가로 네 묶음, 세로 네 묶음, 총 16조각입니다. 모든 출력은 4.5입니다.</p>
<p>미래를 가리면 첫 두 위치 묶음은 첫 비교 묶음만 읽습니다. 그다음 묶음은 앞의 두 묶음, 세 번째는 세 묶음, 마지막은 네 묶음을 읽습니다. 따라서 1+2+3+4=10조각만 처리하고 나머지 6조각은 건너뛸 수 있습니다.</p>
<p>
            대각선에 있는 네 조각은 통째로 허용된 것이 아닙니다. 첫 조각을 보면 0번 위치가 1번 위치를 보는 한 칸은 가려야 합니다. 각 대각선 조각에 이런 칸이 하나씩 있어
            10조각의 40칸 가운데 허용한 연결은 36개입니다. 읽을 조각 수와 실제로 허용한 연결 수는 서로 다른 장부입니다.
          </p>
<p>
            각 관심 위치가 읽는 값은 달라도 답을 만드는 원리는 같습니다. 허용한 값의 합을 허용한 개수로 나눕니다. 6번 위치는 1부터 7까지 더한 28을 7로 나눠 4를 얻고 7번
            위치는 값 8을 더해 4.5를 얻습니다.
          </p>
</div>

</section>
<section id="picture" data-teach-level="1" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">4 · 저장 공간, 작업 조각, 남길 상태를 나눈다</h2><div className={prose}>
<p>
            전체 입력은 큰 저장 공간에 둡니다. 계산기 가까운 작은 공간에는 지금 처리할 두 위치씩만 가져옵니다. 점수 네 개를 만든 다음 평균 계산에 반영하고 그 조각의 점수는 버릴 수
            있습니다. 다음 조각까지 남길 것은 지금까지의 가중합과 정규화에 필요한 상태입니다.
          </p>
<p>여덟 값을 세 작업으로 나누어 [1,2,3], [4,5,6], [7,8]을 처리한다고 해 보겠습니다. 세 작업이 낸 평균은 2, 5, 7.5입니다. 이것을 똑같이 삼등분해 섞으면 4.833333이 되어 원래 답 4.5와 어긋납니다. 각 작업이 맡은 개수 3, 3, 2도 함께 남겨야 합니다.</p>
<p>그림은 같은 입력의 전체 조각, 미래를 가린 조각, 마지막 위치의 분할 계산을 차례로 보여 줍니다. 그림에서 굵은 선으로 나눈 네 행 묶음은 네 개의 일감입니다. 실제 GPU의 물리 실행 장치 네 개를 뜻하지 않습니다.</p>
<p>같은 행의 계산을 조각마다 이어 가는 모습도 적어 보겠습니다. 마지막 위치가 첫 두 값 1, 2를 읽으면 값의 합 3과 개수 2를 남깁니다. 다음 두 값 3, 4를 읽으면 합 10과 개수 4가 됩니다. 이어 5, 6을 읽으면 합 21과 개수 6, 마지막 7, 8까지 읽으면 합 36과 개수 8입니다. 끝에서 나누면 4.5입니다.</p>
<p>
            중간에 얻은 평균 1.5, 2.5, 3.5, 4.5는 서로 다른 범위의 평균입니다. 지금까지의 값이 몇 개였는지 버리고 평균만 다음 조각의 평균과 반씩 섞으면 같은 계산이
            이어지지 않습니다. 이번에는 중요도가 모두 같아 개수만 필요하지만 점수가 다르면 개수 자리에 중요도의 합이 필요합니다. 뒤에서 그 합을 안전하게 저장하는 방법을 코드로
            확인합니다.
          </p>
</div>
<AttentionKernelAnatomyAndBackendsViz/>
</section>
<section id="why" data-teach-level="2" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">5 · 나누는 목적과 나눈 뒤의 비용을 함께 본다</h2><div className={prose}>
<p>여러 관심 위치를 동시에 계산할 때는 서로 다른 출력 행을 나누면 됩니다. 서로 다른 행의 정규화 상태는 독립적이어서 작업끼리 최종 평균을 합칠 필요가 없습니다. 하지만 마지막 위치 하나만 계산한다면 출력 행으로 나눌 일감이 부족할 수 있습니다.</p>
<p>
            이때 비교 대상을 나눠 같은 한 행의 부분 결과를 만들면 일감을 늘릴 수 있습니다. 대신 세 부분 평균을 다시 합치는 단계와 임시 저장 공간이 생깁니다. 나누기 전의 연산 수가
            같아도 나눈 뒤의 이동과 합치기 비용 때문에 항상 빨라지는 것은 아닙니다.
          </p>
<p>미래 조각을 건너뛰는 것도 모든 작업의 길이를 같게 만들지는 않습니다. 앞의 묶음은 1조각, 마지막 묶음은 4조각을 처리합니다. 총량 10뿐 아니라 가장 늦게 끝나는 작업도 봐야 합니다. 구현을 비교할 때 출력, 계산량, 이동량, 작업 길이를 따로 기록하는 이유입니다.</p>
<p>가까운 공간을 쓰는 목적은 저장량을 세면 더 분명합니다. 숫자 하나를 2바이트에 둔다는 가정에서 여덟 행·두 성분의 입력 표 하나는 32바이트입니다. 관심 표, 비교 표, 가져올 값의 표와 출력 표를 모두 두면 네 표가 128바이트를 차지합니다. 한 표를 네 번 읽어도 차지한 자리의 크기는 여전히 32바이트지만 이동한 양은 128바이트가 됩니다.</p>
<p>조각을 크게 잡으면 같은 자료를 다시 가져오는 횟수를 줄일 수 있지만 가까운 공간을 더 차지합니다. 반대로 조각을 작게 잡으면 한 작업의 저장 부담은 줄어도 반복해서 읽는 횟수가 늘 수 있습니다. 그래서 “배열이 작다”와 “이동이 적다”, “작업이 많다”와 “빨리 끝난다”를 각각 구별해 놓고 구현을 읽겠습니다.</p>
</div>

</section>
<section id="names" data-teach-level="3" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">6 · 이미 계산한 역할에 이름을 붙인다</h2><div className={prose}>
<p>
            앞에서 본 수와 동작을 코드의 이름에 대응해 보겠습니다. 새로운 약자를 한꺼번에 외우기보다 여덟 위치에서 무엇을 담았던 자리인지 확인하면 됩니다.
          </p>
</div>
<TermBreakdown title="입력과 작업의 역할을 코드 이름에 연결합니다" items={[
{term:"관심 위치의 수 → query Q",description:"이번에 출력을 구할 행입니다. 사례에서는 모든 행이 [0,0]이고 성분 수 d는 2입니다."},
{term:"비교 대상의 수 → key K",description:"Q와 곱해 점수를 만듭니다. 사례에서는 [1,0]부터 [8,0]까지입니다."},
{term:"섞어 가져올 수 → value V",description:"점수로 정한 가중치에 곱할 값입니다. 우연히 이번에는 K와 같은 수를 넣었습니다."},
{term:"양수 가중치를 합 1로 바꾸기 → softmax",description:"점수가 모두 0이면 지수도 모두 1이므로 허용한 위치의 균등 평균이 됩니다."},
{term:"미래 위치를 가리기 → causal mask",description:"문장 전체 위치에서 자기 뒤의 연결을 금지합니다. 마지막 위치 하나만 계산해도 원래 위치 7을 유지합니다."},
{term:"한 번에 처리할 조각 → tile",description:"관심 행 B_r개와 비교 행 B_c개를 묶습니다. 사례에서는 둘 다 2입니다."},
{term:"GPU에서 실행할 함수 → kernel",description:"조각을 읽고 계산해 출력이나 부분 결과를 남기는 코드입니다. Attention 한 번에 여러 kernel을 실행할 수도 있습니다."},
{term:"여러 입력 위치 / 다음 한 위치 → prefill · decode",description:"입력 묶음을 처리할 때와 새 위치를 처리할 때를 구분합니다. 누적된 K와 V의 저장을 KV cache라고 부릅니다."},
{term:"큰 저장 공간 / 가까운 작업 공간 → HBM · on-chip memory",description:"연산 칩 바깥의 고대역폭 메모리와 칩 내부 자원을 구분합니다. 칩 내부의 register·shared memory·TMEM은 서로 다른 자원입니다."}
]}/>
</section>
<section id="anatomy" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">7 · 곱셈 두 번과 지수 호출을 별도로 센다</h2><div className={prose}>
<p>QK 곱은 2×2의 점수 조각을 만듭니다. 성분이 2개이고 곱셈과 덧셈을 각각 한 연산으로 세는 관례를 쓰면 2×2×2×2=16 FLOP입니다. softmax가 쓸 지수는 점수 네 칸에 네 번 적용합니다. 가중치와 V의 곱인 PV도 16 FLOP입니다.</p>
<p>따라서 조각 하나에는 행렬곱 32 FLOP와 지수 호출 4회가 있습니다. 지수 호출 하나를 보통 덧셈 한 번과 같은 1 FLOP로 더하지 않습니다. 서로 다른 연산기를 쓰고 처리량 단위도 다르기 때문입니다. 최대값, 합산, 마스크와 주소 계산도 별도 비용입니다.</p>
<p>전체 비인과 16조각은 행렬곱 512 FLOP입니다. 미래 조각을 건너뛰되 대각선 조각의 네 칸을 모두 행렬곱으로 처리하는 모형에서는 10×32=320 FLOP입니다. 허용한 연결 36개만 정확히 계산하는 이상적 산술은 36×4d=288 FLOP입니다. 이후 어느 장부를 쓰는지 함께 표시하겠습니다.</p>
<p>기존의 큰 조각 예도 같은 식입니다. B_r=B_c=d=128이면 QK와 PV가 각각 4,194,304 FLOP이고 지수는 16,384회입니다. B_r=B_c=64, d=128이면 두 곱이 각각 1,048,576 FLOP, 지수는 4,096회입니다.</p>
</div>
<AttentionArithmeticViz />
<ExplainedFormula question="같은 조각의 두 종류 비용은 어떻게 기록하나요?" idea="행렬곱의 곱셈·덧셈 수와 지수 호출 수를 각각 셉니다. 서로 다른 단위를 임의로 합치지 않습니다." formula={String.raw`F_{\rm mm}=4B_rB_cd,\quad E_{\exp}=B_rB_c`} annotatedFormula={String.raw`\begin{aligned}F_{\rm mm}&=\underbrace{4B_rB_cd}_{\text{두 행렬곱}}\\E_{\exp}&=\underbrace{B_rB_c}_{\text{점수 칸 수}}\\B_r&=B_c=d=2\\F_{\rm mm}&=32,\quad E_{\exp}=4\end{aligned}`} operations={[{expression:String.raw`2B_rB_cd`,annotation:["각 결과 칸의 d개 곱·합을 세어","한 행렬곱 비용을 얻음"]},{expression:String.raw`B_rB_c`,annotation:["점수 칸마다 필요한","지수 호출을 별도로 셈"]}]} terms={[{symbol:"B_r,B_c",name:"조각의 두 변",description:"관심 위치 수와 비교 위치 수입니다."},{symbol:"d",name:"행의 성분 수",description:"사례에서는 2입니다."},{symbol:"F_mm, E_exp",name:"연산 수와 호출 수",description:"FLOP와 지수 호출이라는 서로 다른 단위입니다."}]} assumptions={["곱셈·덧셈을 각각 1 FLOP로 세는 통상 행렬곱 장부입니다.","마스크·최대·합산·주소 계산·시작 비용을 포함한 전체 실행시간이 아닙니다."]} interpretation="동일한 조각을 처리해도 어떤 연산기를 기다리는지에 따라 최적의 배치가 달라집니다."/>
</section>
<section id="causal" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">8 · 10조각과 36개 연결을 원문 범위에 대입한다</h2><div className={prose}>
<p>같은 길이의 입력을 같은 크기로 나눈 경우, 0부터 센 관심 묶음 i는 비교 묶음 0부터 i까지 읽습니다. 대각선 아래는 전부 허용되고 대각선 조각만 원소별로 가립니다. 하지만 길이가 다르거나 조각 크기가 다르면 이 간단한 삼각형 설명만으로는 부족합니다.</p>
<p>고정 FlashAttention 소스는 범위 계산에 실제 key 길이−실제 query 길이를 더합니다. 마지막 한 위치의 decode에서는 이 차이가 8−1=7입니다. 관심 행의 로컬 번호 0에 원래 위치 7이 대응하므로 여덟 key를 읽는 범위가 나옵니다. 로컬 번호끼리만 비교하면 첫 key만 남기는 잘못된 마스크가 됩니다.</p>
<p>원문은 query 조각 번호를 blockIdx.x에서 직접 읽고, 내부 key 조각은 뒤에서 앞으로 순회합니다. 이것을 “무거운 query 조각부터 GPU에 배정한다”는 뜻으로 읽으면 안 됩니다. key 순회 방향, 실행할 block의 번호, 물리 실행 장치의 배정 순서는 다른 문제입니다.</p>
<p>N=4,096, B=128의 기존 예에서는 총 1,024조각 중 528조각을 처리하고 496조각을 건너뜁니다. 대각선은 32조각입니다. 조각을 밀집 곱으로 세면 8,650,752칸이고 실제 허용 연결은 8,390,656개입니다. N=2,048이면 총 256조각 중 136개를 처리하고 120개를 건너뜁니다.</p>
</div>
{code("causal-range","원문: 길이 차이를 포함한 범위")}{code("block-index","원문: query 번호와 key 순회")}
<SourceApplication source="flash_fwd_kernel.h · e9515d5" excerpt="const int m_block = blockIdx.x;" application="가정한 관심 묶음 번호는 그대로 행 조각을 고릅니다. 별도의 역순 query 배정은 이 문장에 없습니다."/>
</section>
<section id="split-merge" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">9 · 부분 평균에 그 부분의 비중을 곱해 합친다</h2><div className={prose}>
<p>다시 마지막 위치 7의 출력으로 돌아옵니다. 서로 겹치지 않는 세 부분 [1,2,3], [4,5,6], [7,8]의 값 합은 6, 15, 15이고 가중치 합은 3, 3, 2입니다. 모두 점수 0이므로 기준을 맞추는 배율은 1입니다. 합들을 더해 36÷8=4.5를 얻습니다.</p>
<p>부분 평균을 먼저 저장했다면 2×3/8+5×3/8+7.5×2/8로 합쳐야 합니다. 단순 평균 (2+5+7.5)/3=29/6은 틀립니다. 중복된 key가 두 부분에 들어가면 그 값의 비중도 중복되므로, 이 합치기는 서로 겹치지 않는 분할이라는 조건이 필요합니다.</p>
<p>일반 점수에서는 개수만으로 비중을 알 수 없습니다. 각 부분의 지수합을 로그로 저장한 LSE와 부분 평균 O를 사용합니다. 전체 LSE를 구한 뒤 exp(부분 LSE−전체 LSE)를 각 부분 평균에 곱합니다. 이번 점수 0 사례의 LSE는 ln3, ln3, ln2이고 전체는 ln8이라 비중이 3/8, 3/8, 2/8로 돌아옵니다.</p>
</div>
<ExplainedFormula question="점수가 서로 다른 부분도 어떻게 같은 평균으로 합치나요?" idea="서로 겹치지 않는 부분이 전체 지수합에서 차지하는 비율을 구해 부분 평균에 곱합니다." formula={String.raw`L=\log\sum_j e^{L_j},\quad O=\sum_j e^{L_j-L}O_j`} annotatedFormula={String.raw`\begin{aligned}L&=\log\underbrace{\sum_j e^{L_j}}_{\text{부분 지수합을 합침}}\\O&=\sum_j\underbrace{e^{L_j-L}}_{\text{부분의 비중}}O_j\\O&=\tfrac68+\tfrac{15}8+\tfrac{15}8\\&=\tfrac{36}8=4.5\end{aligned}`} operations={[{expression:String.raw`e^{L_j-L}`,annotation:["부분 지수합을 전체로 나눈","정규화 비중을 계산"]},{expression:String.raw`\sum_j e^{L_j-L}O_j`,annotation:["부분 평균마다 비중을 곱해","전체 평균을 복원"]}]} terms={[{symbol:"L_j",name:"부분 LSE",description:"부분 j에 속한 점수들의 지수합에 자연로그를 취한 값입니다."},{symbol:"L",name:"전체 LSE",description:"모든 부분의 지수합을 합친 뒤 자연로그를 취한 값입니다."},{symbol:"O_j",name:"부분 출력",description:"부분 안에서 이미 정규화한 가중평균입니다."}]} assumptions={["부분들은 서로 겹치지 않고 모든 허용 key를 덮습니다.","비어 있거나 전부 가린 행은 별도 처리해야 하며 실수 동치가 비트 동일성을 보장하지 않습니다."]} interpretation="부분 출력만 있으면 비중이 사라집니다. LSE와 출력이 함께 있어야 같은 한 행의 계산을 나눴다가 합칠 수 있습니다."/>
</section>
<section id="split-source" data-teach-level="5" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">10 · 실제 구현은 부분 결과를 쓰고 다른 커널로 합친다</h2><div className={prose}>
<p>FlashAttention의 고정 split-KV 경로는 num_splits가 1보다 크면 별도의 combine kernel을 실행합니다. 부분 출력을 담은 oaccum_ptr와 부분 LSE를 담은 softmax_lseaccum_ptr를 거쳐 최종 O와 LSE를 만듭니다. 따라서 attention 호출 하나를 언제나 GPU kernel 하나라고 정의할 수 없습니다.</p>
<p>합치기 원문은 부분 LSE의 최대를 먼저 빼고 지수를 더해 전체 LSE를 구합니다. 이어 exp(부분 LSE−전체 LSE)를 만들고 부분 출력에 곱해 누적합니다. 앞 절의 3/8, 3/8, 2/8이 바로 이 비중입니다. 다만 원문의 실제 분할 단위는 key 조각이므로 교육용 3/3/2 분할이 그대로 실행되는 GPU 모양이라고 주장하지 않습니다.</p>
<p>일반적인 융합 경로도 최종 출력만 쓰는 것은 아닙니다. 역전파 등에 쓸 LSE를 남기고, 선택한 기능에 따라 추가 결과를 저장할 수 있습니다. fusion은 전체 점수·확률 행렬을 단계 사이에 따로 남기는 왕복을 줄인다는 뜻입니다. 임시 결과와 모든 보조 저장이 없어진다는 뜻은 아닙니다.</p>
</div>
{code("split-launch","원문: 두 커널을 실행하는 조건")}{code("split-combine","원문: LSE와 부분 출력 합치기")}
<NumericPath title="가정한 한 행의 분할 장부" steps={[{label:"세 부분",value:"3 / 3 / 2개",detail:"서로 겹치지 않는 key"},{label:"부분 출력",value:"2 / 5 / 7.5",detail:"각 부분 안에서 정규화"},{label:"합치기 비중",value:"3/8 · 3/8 · 2/8",detail:"LSE에서 계산"},{label:"전체 출력",value:"4.5",detail:"원래 여덟 값의 평균"}]}/>
</section>
<section id="regimes" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">11 · 배열 모양에서 실제 이동량까지 한 줄씩 센다</h2><div className={prose}>
<p><strong>이 절의 한 문장 답은 이렇습니다.</strong> FLOP/B는 같은 일을 끝내는 계산량을 그 일을 하며 실제로 옮긴 바이트로 나눈 값이므로, 배열의 크기만 세지 말고 그 배열을 몇 번 읽고 썼는지까지 세어야 합니다.</p>
<p>먼저 비교 범위를 고정하겠습니다. 7절에서 계산한 미래를 가리지 않는 전체 작업은 2×2 조각 16개를 처리하며, 조각마다 QK와 PV 두 행렬곱에 32 FLOP를 씁니다. 따라서 두 장부 모두 분자는 512 FLOP입니다. 지금 비교할 것은 같은 답을 만들 때 자료를 한 번만 가져오는 경우와 K·V를 되읽는 경우입니다.</p>
</div>
<AttentionTrafficViz />
<CalculationWalkthrough
  title="장부 A · 모든 배열을 한 번만 옮기는 이상적인 하한"
  question="128바이트와 4 FLOP/B는 어디에서 나오나요?"
  scope="여덟 query의 비인과 출력을 모두 계산합니다. Q·K·V는 한 번씩 읽고 O는 한 번 씁니다."
  steps={[
    {label:"전체 행렬곱 수",expression:"16조각 × 조각마다 32 FLOP",result:"512 FLOP",reason:"가로 4조각과 세로 4조각이 만나 16조각이며, 각 조각은 QK 16 FLOP와 PV 16 FLOP를 수행합니다."},
    {label:"배열 하나의 원소 수",expression:"8행 × 행마다 2개",result:"16개",reason:"Q·K·V·O는 모두 여덟 위치를 두 성분으로 표현합니다."},
    {label:"배열 하나의 저장 크기",expression:"16개 × 값마다 2바이트",result:"32바이트",reason:"한 숫자를 2바이트에 저장한다는 이 글의 가정을 적용합니다."},
    {label:"한 번 이동할 때의 총량",expression:"Q 읽기 32 + K 읽기 32 + V 읽기 32 + O 쓰기 32",result:"128바이트",reason:"입력 세 배열은 한 번씩 읽고, 결과 배열은 한 번 쓰는 이상적인 장부입니다."},
    {label:"바이트당 계산량",expression:"512 FLOP ÷ 128바이트",result:"4 FLOP/B",reason:"분자와 분모가 모두 여덟 query의 전체 작업을 가리킵니다."},
  ]}
  conclusion="자료를 완벽히 재사용해 Q·K·V를 한 번씩만 읽는다면 기준값은 4 FLOP/B입니다."
  caveats={["K·V 재읽기, LSE, 임시 결과, 주소 계산과 정렬에 따른 추가 이동을 세지 않은 하한입니다.","128바이트는 Q·K·V·O가 차지하는 합계 크기이면서, 이 특별한 한 번 읽기·쓰기 가정에서만 이동량과 같은 숫자입니다."]}
/>
<div className={prose}>
<p>이제 K와 V를 재사용하지 못하는 경우를 보겠습니다. query 행은 둘씩 묶으므로 <strong>8행을 묶음마다 2행으로 나눠 query 묶음 네 개</strong>가 생깁니다. 각 묶음은 자기 출력 두 행을 계산하려고 K 전체와 V 전체를 다시 훑는다고 가정합니다. 반면 Q의 각 행은 한 묶음에만 속하고 O의 각 행도 한 번만 완성되므로 Q 읽기와 O 쓰기에는 반복 횟수 4를 붙이지 않습니다.</p>
</div>
<CalculationWalkthrough
  title="장부 B · query 묶음 사이에서 K·V를 재사용하지 못하는 경우"
  question="같은 512 FLOP인데 왜 320바이트와 1.6 FLOP/B가 되나요?"
  scope="장부 A와 같은 여덟 query의 비인과 출력입니다. 다만 query 두 행짜리 묶음마다 K·V 전체를 다시 읽습니다."
  steps={[
    {label:"query 묶음 수",expression:"8 query행 ÷ 묶음마다 2행",result:"4묶음",reason:"각 query 묶음이 K·V를 몇 번 훑는지 정하려면 먼저 반복 횟수를 만들어야 합니다."},
    {label:"묶음 하나가 읽는 K·V",expression:"K 32바이트 + V 32바이트",result:"묶음마다 64바이트",reason:"query 묶음 하나가 비교 대상 여덟 행과 가져올 값 여덟 행을 모두 사용합니다."},
    {label:"네 묶음의 K·V 이동량",expression:"4묶음 × 묶음마다 64바이트",result:"256바이트",reason:"이 장부에서는 한 묶음이 읽은 K·V가 다음 묶음의 읽기를 줄여 주지 않는다고 가정합니다."},
    {label:"한 번만 옮기는 Q·O",expression:"Q 읽기 32 + O 쓰기 32",result:"64바이트",reason:"각 query 행은 한 묶음에서만 읽고 그 행의 출력도 한 번만 씁니다."},
    {label:"전체 이동량",expression:"K·V 256 + Q·O 64",result:"320바이트",reason:"같은 전체 작업에 필요한 두 종류의 이동을 합칩니다."},
    {label:"바이트당 계산량",expression:"512 FLOP ÷ 320바이트",result:"1.6 FLOP/B",reason:"계산량은 같고, 되읽기 때문에 분모만 128바이트에서 320바이트로 늘었습니다."},
  ]}
  conclusion="같은 답을 계산해도 K·V를 query 묶음마다 다시 읽으면 바이트당 계산량은 4에서 1.6으로 내려갑니다."
  caveats={["이 320바이트는 query 묶음 사이의 cache 재사용이 전혀 없다는 비교용 장부입니다.","실제 HBM traffic은 cache 적중으로 줄 수도 있고, LSE·임시 결과·정렬 때문에 이 장부보다 늘 수도 있으므로 profiler로 확인해야 합니다."]}
/>
<ExplainedFormula question="4와 1.6의 차이를 식 한 줄에서 어떻게 읽나요?" idea="분자의 전체 작업은 그대로 두고, 분모에서 K·V가 네 query 묶음마다 반복된다는 사실만 바꿉니다." formula={String.raw`I=F/T`} annotatedFormula={String.raw`I=\frac{\underbrace{512\ \mathrm{FLOP}}_{\text{여덟 query의 같은 전체 계산}}}{\underbrace{4(32+32)}_{\text{묶음마다 K·V 재읽기}}+\underbrace{32+32}_{\text{Q 읽기·O 쓰기 한 번}}\ \mathrm{B}}=1.6\ \mathrm{FLOP/B}`} operations={[{expression:String.raw`4(32+32)`,annotation:["query 묶음 네 개가", "K 32B와 V 32B를 각각 다시 읽음"]},{expression:String.raw`32+32`,annotation:["모든 Q행 읽기와 O행 쓰기는", "전체 작업에서 각각 한 번만 셈"]},{expression:String.raw`\frac{512}{320}`,annotation:["같은 전체 작업의 계산량을", "그 작업의 이동량으로 나눔"]}]} terms={[{symbol:"I",name:"연산 강도",description:"실제로 옮긴 1바이트마다 수행한 FLOP입니다."},{symbol:"F",name:"같은 작업의 계산량",description:"여덟 query 전체의 QK와 PV를 합친 512 FLOP입니다."},{symbol:"T",name:"같은 작업의 이동량",description:"여기서는 K·V를 네 번 읽는 비교 장부의 320바이트입니다."}]} assumptions={["미래를 가리지 않는 전체 16조각의 행렬곱만 FLOP로 셉니다.","query 묶음 사이의 K·V cache 재사용은 없고, LSE와 임시 결과는 제외합니다."]} interpretation="4와 1.6은 서로 다른 계산을 비교한 값이 아닙니다. 같은 512 FLOP에서 자료를 얼마나 되읽는지만 바꾼 두 기준값입니다."/>
<div className={prose}>
<p>이 차이가 저장 크기와 이동량의 차이입니다. K 배열은 네 번 읽어도 어느 한 시점에 차지하는 자리인 <strong>footprint가 32바이트</strong>인 채로 남습니다. 그러나 읽을 때마다 32바이트가 실제 메모리 경계를 건넜다면 <strong>traffic은 128바이트</strong>가 됩니다. 따라서 Q·K·V·O의 합계 크기 128바이트를 아무 조건 없이 실제 HBM 이동량이라고 부를 수는 없습니다.</p>
<p>마지막으로 새 토큰 하나만 만드는 decode에서는 작업 범위가 달라집니다. 새 query와 새 출력은 한 행뿐이지만, 이미 쌓인 K와 V의 여덟 행은 모두 읽습니다. 원래 문단의 <code>4×8×2</code>는 이 두 행렬곱을 한 줄로 합쳐 쓴 표기라서, 아래에서는 QK와 PV를 나눠 셉니다.</p>
</div>
<CalculationWalkthrough
  title="장부 C · 마지막 query 한 행을 계산하는 decode"
  question="64 FLOP와 72바이트는 각각 무엇을 센 값인가요?"
  scope="새 query 한 행이 기존 key·value 여덟 행을 읽어 출력 한 행을 만듭니다."
  steps={[
    {label:"QK 행렬곱",expression:"2 FLOP/곱·합 × 1 query × 8 key × 2성분",result:"32 FLOP",reason:"query 한 행과 key 여덟 행의 점수 여덟 개를 만듭니다."},
    {label:"PV 행렬곱",expression:"2 FLOP/곱·합 × 1 query × 8 value × 2성분",result:"32 FLOP",reason:"점수 여덟 개로 value 여덟 행을 섞어 출력 한 행을 만듭니다."},
    {label:"decode 계산량",expression:"QK 32 + PV 32",result:"64 FLOP",reason:"같은 query 한 행을 끝내는 두 행렬곱을 합칩니다."},
    {label:"K·V 읽기",expression:"2배열 × 배열마다 8행 × 행마다 2개 × 값마다 2바이트",result:"64바이트",reason:"과거 여덟 위치의 K와 V는 그대로 남아 있어 둘 다 전체를 읽습니다."},
    {label:"Q 읽기와 O 쓰기",expression:"2배열 × 배열마다 1행 × 행마다 2개 × 값마다 2바이트",result:"8바이트",reason:"새 query와 새 출력은 각각 한 행이라 4바이트씩입니다."},
    {label:"decode 전체 이동량",expression:"K·V 64 + Q·O 8",result:"72바이트",reason:"한 query의 계산을 끝내는 데 포함한 네 배열의 이동을 합칩니다."},
    {label:"decode의 바이트당 계산량",expression:"64 FLOP ÷ 72바이트",result:"8/9 ≈ 0.889 FLOP/B",reason:"한 query라는 같은 범위의 계산량과 이동량을 나눕니다."},
  ]}
  conclusion="Q와 O까지 포함하면 8/9 FLOP/B입니다. KV만 분모로 세면 64÷64=1 FLOP/B가 됩니다."
  caveats={["KV만 세어 1 FLOP/B라고 쓰는 값은 문맥이 길어 Q·O의 8바이트가 작다고 보는 근사입니다.","Softmax, cache line, page table, metadata와 다른 보조 이동은 이 작은 장부에 넣지 않았습니다."]}
/>
</section>
<section id="large-ledger" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">12 · 큰 입력도 같은 계산 장부로 확장한다</h2><div className={prose}>
<p>숫자가 커져도 순서는 바뀌지 않습니다. 먼저 같은 작업의 FLOP를 세고, 그다음 어떤 배열을 몇 번 옮기는지 세며, 마지막에 둘을 나눕니다. 여기서는 길이 4,096, 성분 수 128, 값마다 2바이트인 한 attention head를 기준으로 잡겠습니다.</p>
</div>
<AttentionScaleViz />
<CalculationWalkthrough
  title="큰 장부 A · 길이 4,096의 비인과 prefill"
  question="8,589,934,592 FLOP와 4MiB는 어떻게 만들어지나요?"
  scope="query 4,096행이 key 4,096행을 모두 보는 한 head입니다. Q·K·V는 한 번씩 읽고 O는 한 번 쓴다는 이상적 하한을 사용합니다."
  steps={[
    {label:"QK 행렬곱",expression:"2 FLOP/곱·합 × 4,096 query × 4,096 key × 128성분",result:"4,294,967,296 FLOP",reason:"모든 query-key 쌍의 점수를 만들며, 곱셈과 덧셈을 각각 1 FLOP로 셉니다."},
    {label:"PV 행렬곱",expression:"2 FLOP/곱·합 × 4,096 query × 4,096 value × 128성분",result:"4,294,967,296 FLOP",reason:"점수로 value를 섞는 두 번째 행렬곱의 모양이 같습니다."},
    {label:"전체 계산량",expression:"QK 4,294,967,296 + PV 4,294,967,296",result:"8,589,934,592 FLOP",reason:"같은 prefill 작업을 끝내는 두 행렬곱을 합칩니다."},
    {label:"배열 하나의 크기",expression:"4,096행 × 행마다 128개 × 값마다 2바이트",result:"1,048,576바이트 = 1MiB",reason:"Q·K·V·O 네 배열은 이 사례에서 같은 모양입니다."},
    {label:"한 번 이동 장부",expression:"배열마다 1MiB × Q·K·V·O 네 배열",result:"4MiB = 4,194,304바이트",reason:"입력 세 배열을 한 번 읽고 출력 한 배열을 한 번 쓰는 하한입니다."},
    {label:"바이트당 계산량",expression:"8,589,934,592 FLOP ÷ 4,194,304바이트",result:"2,048 FLOP/B",reason:"분자와 분모가 같은 한 head의 전체 prefill을 셉니다."},
  ]}
  conclusion="2,048 FLOP/B는 배열을 한 번씩만 옮기는 기준값이며 모든 prefill의 실제 비율이 아닙니다."
  caveats={["점수·확률 전체 배열은 쓰지 않는다고 보며 K·V 재읽기, LSE, 임시 결과와 cache line 이동을 제외합니다.","실제 HBM traffic을 profiler로 재면 분모가 달라지고 연산 강도도 함께 달라집니다."]}
/>
<div className={prose}>
<p>Decode에서는 새 query가 한 행뿐이므로 query끼리 짝을 만드는 4,096×4,096 계산이 사라집니다. 대신 과거 K와 V의 4,096행은 계속 읽어야 합니다. 여러 query head가 같은 K·V를 함께 쓰면 계산량은 head 수만큼 늘지만 K·V 읽기는 한 번으로 재사용할 수 있어 비율이 달라집니다.</p>
</div>
<CalculationWalkthrough
  title="큰 장부 B · decode 한 head와 GQA 여덟 head"
  question="왜 한 head는 약 1이고, K·V를 여덟 head가 공유하면 약 8 FLOP/B인가요?"
  scope="길이 4,096의 K·V를 새 query가 읽습니다. 먼저 한 head를 세고, 이어 같은 K·V를 query head 여덟 개가 실제로 공유해 읽는 경우만 바꿉니다."
  steps={[
    {label:"한 head의 계산량",expression:"QK와 PV 2회 × 2 FLOP/곱·합 × 4,096위치 × 128성분",result:"2,097,152 FLOP",reason:"새 query 한 행이 과거 4,096행을 점수 계산과 값 혼합에 한 번씩 사용합니다."},
    {label:"한 head의 K·V 읽기",expression:"K·V 2배열 × 4,096행 × 행마다 128개 × 값마다 2바이트",result:"2,097,152바이트 = 2MiB",reason:"과거 기록 두 종류의 전체 길이를 읽습니다."},
    {label:"한 head의 Q·O",expression:"Q·O 2배열 × 1행 × 행마다 128개 × 값마다 2바이트",result:"512바이트",reason:"새 입력과 출력은 각각 한 행뿐입니다."},
    {label:"한 head의 정확한 기준 비율",expression:"2,097,152 FLOP ÷ (2,097,152 + 512)바이트",result:"약 0.9998 FLOP/B",reason:"KV만 분모로 두면 정확히 1이고, Q·O까지 넣으면 조금 작아집니다."},
    {label:"query head 여덟 개의 계산량",expression:"한 head 2,097,152 FLOP × 8 head",result:"16,777,216 FLOP",reason:"각 query head는 자기 출력을 계산하므로 두 행렬곱을 각각 수행합니다."},
    {label:"공유한 K·V와 각 head의 Q·O",expression:"K·V 2,097,152 + (Q·O 512 × 8 head)",result:"2,101,248바이트",reason:"K·V는 한 번만 읽어 여덟 head가 쓰되 Q와 O는 head마다 따로 있습니다."},
    {label:"GQA의 기준 비율",expression:"16,777,216 FLOP ÷ 2,101,248바이트",result:"약 7.9844 FLOP/B",reason:"KV가 분모 대부분을 차지한다고 근사하면 8 FLOP/B입니다."},
  ]}
  conclusion="GQA의 약 8은 head가 여덟 개라서 자동으로 생기지 않습니다. 한 번 읽은 K·V를 여덟 query head가 실제로 공유한다는 조건이 필요합니다."
  caveats={["문맥 길이를 8,192로 두 배 늘리면 한 head의 계산량과 K·V가 함께 두 배가 되어 KV 중심 근사 1은 유지됩니다.","요청마다 서로 다른 K·V를 읽으면 batch를 늘려도 요청 사이의 재사용은 생기지 않습니다."]}
/>
<div className={prose}>
<p>마지막 장부는 비율을 시간 하한과 비교 기준으로 바꿉니다. 저장된 K·V 16GiB가 있다는 사실만으로 전송 시간을 정할 수는 없습니다. 그 16GiB를 이번 step에서 HBM으로부터 실제로 한 번 모두 읽는다는 가정까지 있어야 대역폭으로 나눌 수 있습니다.</p>
</div>
<CalculationWalkthrough
  title="큰 장부 C · 16GiB 읽기와 roofline 기준선"
  question="5.128ms와 295 FLOP/B는 무엇을 뜻하나요?"
  scope="Batch 32, layer 32, KV head 8이 각각 2MiB를 한 step에서 HBM으로부터 한 번 읽는다고 가정합니다. 비교 장치는 계산 989TFLOP/s, HBM 3.35TB/s의 기준 성능을 냅니다."
  steps={[
    {label:"한 step의 KV 이동량",expression:"32요청 × 32층 × 층마다 8 KV head × head마다 2MiB",result:"16,384MiB = 16GiB",reason:"저장 용량이 아니라 이번 step에서 이 전부를 한 번 읽는다는 이동 가정을 붙였습니다."},
    {label:"대역폭만 본 시간 하한",expression:"17,179,869,184바이트 ÷ 3.35×10¹²바이트/초",result:"약 0.005128초 = 5.128ms",reason:"이동량을 초당 이동 가능량으로 나누며, 계산과 시작 비용이 완전히 겹친 이상적인 하한입니다."},
    {label:"장치의 균형점",expression:"989×10¹² FLOP/초 ÷ 3.35×10¹²바이트/초",result:"약 295 FLOP/B",reason:"초 단위가 서로 지워져 장치가 계산과 메모리를 같은 시간에 소진하는 연산 강도가 남습니다."},
    {label:"앞 장부와 비교",expression:"decode 약 1 또는 GQA 약 8 < 장치 기준 약 295",result:"이동량을 먼저 측정할 후보",reason:"기준선보다 훨씬 낮으므로 이상 모형에서는 HBM 이동이 먼저 제한될 가능성이 큽니다."},
  ]}
  conclusion="5.128ms는 16GiB 전송만의 처리량 하한이고, 295 FLOP/B는 장치 기준선입니다. 둘 다 실제 step 지연을 단독으로 보장하지 않습니다."
  caveats={["989TFLOP/s와 3.35TB/s는 가정한 H100의 최고 기준이며 실제 달성 처리량은 kernel과 설정에 따라 낮습니다.","Cache 적중, 시작 비용, 작업 수, 다른 연산과의 겹침을 측정한 뒤 최종 병목을 판단해야 합니다."]}
/>
</section>
<section id="generations" data-teach-level="5" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">13 · 출력 행을 나누면 부분 출력을 합치는 일이 줄어든다</h2><div className={prose}>
<p>GPU의 thread들이 함께 실행되는 작은 묶음을 warp라고 합니다. 여러 warp가 협력하는 thread block은 실행 일감이고, 그것을 처리하는 물리 장치가 SM입니다. 관심 행 묶음 네 개를 만들었다고 SM 네 개를 지정한 것은 아닙니다.</p>
<p>FA2 논문 §3.3은 K/V 쪽을 warp에 나눈 이전 배치와 Q 행을 나눈 배치를 비교합니다. 앞의 배치는 warp별 PV 부분 출력을 합치기 위한 통신이 필요합니다. Q 행을 나누면 각 warp가 자기 출력 행을 맡아 그 부분 출력 reduction을 피합니다. 논문이 설명한 대상은 부분 점수 64KiB의 고정 왕복이 아닙니다.</p>
<p>이번 사례로 보면 0·1번 출력과 2·3번 출력을 각각 맡으면 평균끼리 합칠 필요가 없습니다. 하지만 같은 7번 출력을 key 범위로 나누면 9절처럼 부분 평균의 비중을 합쳐야 합니다. 이것이 행을 나누는 방식과 합산할 축을 나누는 방식의 차이입니다.</p>
<p>부분 출력 reduction을 피했다고 shared memory 접근이나 모든 동기화가 0이 되지는 않습니다. 원문의 forward와 backward도 요구가 다릅니다. Sequence 축을 더 나누는 설계 역시 일감을 늘릴 뿐, block 하나가 물리 SM 하나와 일대일로 대응한다는 뜻은 아닙니다.</p>
<p>기존 큰 예의 batch 1, head 8, 관심 조각 32개라면 launch grid에는 256개 block이 생깁니다. 실제 동시 실행 수는 자원 한도와 하드웨어 배정에 달려 있습니다. 고정 FA2 소스의 d=128 선택표에는 조건에 따라 128×32, 64×64, 128×64도 있어 “항상 두 변이 64 또는 128”이라고 일반화할 수 없습니다.</p>
</div>
{code("manual-config","원문: d=128의 수동 선택표")}
<div id="paper-flashattention-2" className="scroll-mt-24"><CitationBlock source="Dao · FlashAttention-2 v1, §3.2–3.3와 §4" citeKey={1} href="https://arxiv.org/html/2307.08691v1">A100 80GB SXM4의 저자 실험에서 이전 구현 대비 약 2배, 최고 73%의 이론 처리량 비율을 보고합니다. Causal 비교 1.7–1.8배와 GPT 학습 72% MFU도 각 논문의 설정에 속한 측정입니다. 본문의 여덟 위치는 성능 재현 실험이 아닙니다.</CitationBlock></div>
</section>
<section id="pipeline" data-teach-level="5" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">14 · 한 조각의 의존성과 여러 조각의 겹치기를 나눈다</h2><div className={prose}>
<p>같은 조각에서는 QK 점수가 나와야 softmax를 계산하고, 그 가중치가 있어야 PV를 계산합니다. 이 의존성을 지운 채 세 단계가 동시에 끝난다고 할 수 없습니다. 다른 행이나 다음 조각의 독립적인 작업을 준비해야 서로 다른 연산기의 일을 겹칠 수 있습니다.</p>
<p>가정한 여러 일감의 총 행렬곱 처리량 예산이 2시간 단위, 지수 처리량 예산이 1단위라면 직렬 합은 3입니다. 서로 다른 장치에서 완전히 겹친다는 이상적인 자원 하한은 max(2,1)=2입니다. 시작과 종료 구간, 의존성, 버퍼와 다른 연산을 포함한 실제 완료시간이 2라는 보장은 없습니다.</p>
<p>FA3 논문은 H100의 FP16 행렬곱 989TFLOP/s와 지수 약 3.9조 회/s를 비교합니다. d=128의 점수 한 칸당 행렬곱 512 FLOP를 전자로 나누면 약 0.518ps, 지수 한 호출을 후자로 나누면 약 0.256ps입니다. GPU 전체 최고 처리량으로 나눈 자원 예산이며 개별 지수 명령의 지연시간이 아닙니다.</p>
<p>두 예산을 직렬로 더하면 지수 항의 비중이 약 1/3입니다. d=64에서는 행렬곱 항이 절반이 되어 두 항이 거의 같아집니다. 최대값·합산·이동·실제 활용률을 뺀 이 비교는 겹치기를 시도할 이유를 설명하며, softmax가 항상 실행시간의 정확한 1/3이라는 측정이 아닙니다.</p>
</div>
<TermBreakdown title="FA3가 여러 조각의 일을 겹치는 수단" items={[
{term:"복사를 맡기는 장치 → TMA",description:"Hopper의 비동기 데이터 이동 수단입니다. 복사 담당과 계산 담당의 역할을 나눌 수 있습니다."},
{term:"여러 warp가 함께 맡는 비동기 행렬곱 → WGMMA",description:"결과를 기다리는 구간에 다른 독립 작업을 배치할 여지를 줍니다."},
{term:"두 계산 묶음이 번갈아 다른 일을 하기 → pingpong scheduling",description:"한 묶음의 softmax와 다른 묶음의 행렬곱을 겹칩니다. 버퍼와 순서 제약은 남습니다."}
]}/><div id="paper-flashattention-3" className="scroll-mt-24"><CitationBlock source="Shah 외 · FlashAttention-3 v2, §3.2와 실험 부록" citeKey={2} href="https://arxiv.org/html/2407.08608v2">저자는 Hopper 경로의 비동기 배치와 FP8 기법을 제안합니다. H100 80GB SXM5의 설정에서 FP16 최고 약 740TFLOP/s, FP8 약 1.2PFLOP/s를 보고하며 이전 구현 대비 1.5–2배를 제시합니다. 겹치기만의 비교와 전체 결과를 구별해야 합니다.</CitationBlock></div>
</section>
<section id="scheduling" data-teach-level="5" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">15 · 긴 일감부터 놓는 설명은 배정 주체를 밝혀야 한다</h2><div className={prose}>
<p>가정한 동일 작업자 세 명에게 길이 [1,2,3,4]의 일을 현재 누적량이 가장 작은 작업자부터 배정하겠습니다. 오름차순으로 주면 마지막 길이 4가 길이 1 뒤에 붙어 종료시각이 5입니다. 내림차순으로 주면 4, 3, 2를 먼저 맡기고 길이 1을 2 뒤에 붙여 종료시각이 4입니다.</p>
<p>이 계산은 이상적인 일감 배정 모형입니다. FlashInfer 논문 Algorithm 1에서는 긴 KV 조각들을 정렬하고 추정 비용이 작은 CTA 작업 큐에 넣습니다. CTA는 thread block에 해당하는 소프트웨어 일감 묶음입니다. CPU가 실제 SM 번호를 고정해 배정한다고 해석하지 않습니다.</p>
<p>논문의 plan 단계는 길이 정보를 받아 작업 큐와 부분 출력의 합치기 위치를 만듭니다. GPU workspace에 계획과 부분 결과를 두고 attention과 contraction kernel이 사용합니다. run을 CUDA Graph에 담을 수 있지만 CPU의 plan 자체를 그 그래프 안에서 실행하는 것은 아닙니다. 같은 길이 조건의 여러 층에서 계획을 재사용할 수 있습니다.</p>
</div>
<div id="paper-flashinfer" className="scroll-mt-24"><CitationBlock source="Ye 외 · FlashInfer v1, §3.3–3.4와 §4" citeKey={3} href="https://arxiv.org/html/2501.01005v1">Block-sparse·조합 가능한 KV 형식과 JIT 변형, 계획 후 실행을 함께 다룹니다. v0.2 실험은 A100 40GB/H100 80GB, CUDA 12.4, PyTorch 2.4의 범위를 적습니다. SGLang의 Triton 경로 대비 ITL 29–69% 감소, 별도 긴 문맥 지연 28–30% 감소와 병렬 생성 13–17% 가속은 각각 저자 측정입니다. 모든 백엔드의 동일 작업 비교를 대신하지 않습니다.</CitationBlock></div>
</section>
<section id="backends" data-teach-level="4" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">16 · 먼저 가능한 구현을 찾고 그 안의 설정을 고른다</h2><div className={prose}>
<p>서빙 엔진이 attention을 실행하는 구현 경로를 backend라고 부릅니다. 같은 평균을 계산해도 지원하는 GPU, 숫자 형식, head 크기와 KV 배치가 다를 수 있습니다. 구현 안에서 조각 크기나 warp 수를 고르는 일은 그다음 결정입니다.</p>
<p>설명용 후보 A와 B가 있고 우선순위는 A가 먼저라고 해 보겠습니다. 현재 입력을 A는 지원하지 않고 B는 지원한다면 자동 선택은 B를 고를 수 있습니다. 하지만 사용자가 A를 명시했을 때 조용히 B로 바꿀지는 구현의 계약을 읽어야 합니다. 다음 절의 vLLM은 오류를 냅니다.</p>
<p>작은 d=2 사례는 의미와 계산량을 따라가기 위한 가정입니다. 모든 backend가 이 모양을 지원한다고 가정하지 않습니다. 큰 GPU 이름만 같아도 충분하지 않고, 실제 사용한 dtype·head 크기·마스크·KV 형식·버전을 함께 확인해야 합니다.</p>
</div>

</section>
<section id="backend-source" data-teach-level="5" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">17 · vLLM은 명시한 부적합 구현을 예외로 처리한다</h2><div className={prose}>
<p>vLLM v0.27.1의 selector는 head_size, dtype, KV cache 형식, 마스크 관련 조건 등을 묶어 현재 플랫폼에 넘깁니다. CUDA 경로의 validate_configuration은 지원하지 않는 항목의 이유를 모읍니다. 고정한 commit은 6e448d0이며 원문 파일 전체를 보존했습니다.</p>
<p>CUDA 선택 함수는 selected_backend가 있으면 그 후보만 검사합니다. 부적합 이유가 있으면 ValueError를 냅니다. 지정이 없을 때에만 후보 목록을 검사하고 통과한 후보 중 priority가 가장 작은 것을 고릅니다. 전부 부적합하면 이때도 예외입니다.</p>
<p>원문 함수 몸체를 CPU에서 실행하되 실제 GPU 능력과 후보의 지원 판정은 가짜 값으로 넣어 제어 흐름을 확인했습니다. A=FLASH_ATTN은 head_size 미지원, B=FLASHINFER는 지원으로 두자 자동 선택은 B, A 명시 선택은 예외였습니다. 이것은 실제 설치된 두 backend의 지원 여부나 속도 실험이 아닙니다.</p>
<p>같은 원문의 비-MLA 우선순위에서 capability major=10이고 causal이면 FLASHINFER가 먼저입니다. 같은 major라도 non-causal이면 FLASH_ATTN이 먼저입니다. 우선순위 목록은 버전과 조건에 묶인 정책이며 매 요청마다 모든 후보의 속도를 재는 절차가 아닙니다. 함수 중간 주석보다 실제 예외와 반환 분기를 따라야 합니다.</p>
</div>
{code("selector","원문: 선택 조건 모으기")}{code("validate","원문: 지원하지 않는 이유")}{code("backend-select","원문: 명시 선택과 자동 선택")}{code("priorities","원문: 조건별 우선순위")}
<SourceApplication source="vLLM cuda.py · get_attn_backend_cls" excerpt="if invalid_reasons:" application="A를 명시하고 A가 조건을 만족하지 못하면 B로 넘어가기 전에 종료합니다. 자동 선택과 강제 선택의 결과가 다릅니다."/>
</section>
<section id="autotune-source" data-teach-level="5" data-calculation-explained className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">18 · Triton은 36개 실행법을 만들고, 9개만 재서 하나를 고른다</h2><div className={prose}>
<p><strong>이 절의 한 문장 답부터 잡겠습니다.</strong> Triton의 autotune은 가장 빠른 실행법을 미리 아는 기능이 아닙니다. 같은 계산을 하는 여러 작업 지시서를 만들고, 조건에 맞지 않는 지시서를 먼저 버린 뒤, 남은 지시서의 실행 시간을 재 가장 빠른 하나를 고릅니다.</p>
<p>그러면 작업 지시서 한 장에는 무엇이 적힐까요? 한 번에 맡을 query 행 수, 한 번에 훑을 key 열 수, 다음 자료를 미리 준비할 단계 수, 함께 일할 warp 묶음 수가 적힙니다. 출력의 뜻은 그대로 두고 GPU에 일을 나누는 모양만 바꾸는 네 손잡이입니다.</p>
</div>
<AutotuneCandidateViz />
<div className={prose}>
<p>이제 원문의 이름을 붙이겠습니다. Query 행 수는 <code>BLOCK_M</code>, key 열 수는 <code>BLOCK_N</code>입니다. 준비 단계 수는 <code>num_stages</code>, warp 묶음 수는 <code>num_warps</code>입니다. 고정 commit 7c56a5e의 CUDA 일반 경로는 각 손잡이에 2개·3개·3개·2개의 값을 두므로 <code>2×3×3×2=36</code>개 후보를 만듭니다.</p>
<p>첫 필터는 CUDA 장치 능력의 첫 숫자가 9일 때, 조각 면적이 <code>128×128</code>보다 작으면서 warp가 8인 후보를 버립니다. 이 조건에 걸리는 조각 모양은 5개이고 각 모양에는 stage가 3개씩 있습니다. 따라서 15개가 사라지고 21개가 남습니다.</p>
<p>두 번째 필터에는 실제 입력 길이가 들어갑니다. <code>N_CTX=64</code>이면 한 번에 128개 query 행을 맡겠다는 <code>BLOCK_M=128</code> 후보는 모두 버립니다. 첫 필터를 통과한 후보 중 <code>BLOCK_M=64</code>인 것은 <code>BLOCK_N</code> 세 값, stage 세 값, warp 4 한 값의 조합이라 정확히 9개입니다. <code>HEAD_DIM=128</code>에서는 이 아홉 후보의 <code>BLOCK_N</code>이 모두 128 이하라 더 줄지 않습니다.</p>
<p>여기까지는 빠른 후보를 고른 과정이 아닙니다. 실행하지 않을 후보만 지운 과정입니다. 그다음 autotune이 남은 후보를 실제로 실행해 시간을 비교합니다. 공식 API에서 <code>key</code>는 어떤 인자 값이 바뀌었을 때 후보들을 다시 평가할지 정합니다. 이 원문의 key는 <code>N_CTX</code>, <code>HEAD_DIM</code>, <code>FP8_OUTPUT</code>, <code>warp_specialize</code>입니다.</p>
<p>이 글에서는 후보 생성식과 두 필터의 Python 몸체만 의존성을 바꾼 CPU 실행으로 확인했습니다. GPU에서 후보 9개를 컴파일하거나 시간을 재지는 않았으므로 최종 승자와 첫 호출 시간을 주장하지 않습니다. <code>N_CTX=8</code>을 넣으면 가장 작은 <code>BLOCK_M=64</code>도 길이보다 커서 이 필터는 후보를 0개 돌려줍니다. 앞의 여덟 위치 사례는 계산 원리를 설명하지만 이 튜토리얼 설정의 실행 가능한 입력 예는 아닙니다.</p>
<p>테스트 환경에 <code>PYTEST_VERSION</code>이 있으면 원문은 탐색 전에 후보 목록 자체를 한 개로 바꿉니다. 따라서 후보 수와 첫 호출 비용은 실행 환경과 입력 key를 확인한 뒤에만 말할 수 있습니다. 더 깊은 Triton 실행 모델은 <Link to="/cs/gpu/triton-kernel-programming-and-compiler#launch-and-autotune">Triton kernel과 autotune 글</Link>에서 같은 방식으로 이어집니다.</p>
<p>마지막으로 선택의 층을 나눠야 합니다. vLLM의 backend 선택은 어느 attention 구현을 쓸지 고릅니다. 지금 본 autotune은 선택된 Triton kernel 안에서 어떤 작업 지시서를 쓸지 고릅니다. 컴파일 결과를 다시 쓰는 cache는 이미 고른 코드를 반복 호출할 때의 일입니다. 이 세 시간을 섞지 않아야 첫 호출과 반복 호출을 올바르게 비교할 수 있습니다.</p>
</div>
{code("autotune","원문: 후보와 필터, 실제 key")}{code("observation","검증: 원문 분기의 CPU 관찰 범위")}
</section>
<section id="triton-trace" data-teach-level="5" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">19 · 튜토리얼은 대각선과 그 아래를 다른 구간으로 처리한다</h2><div className={prose}>
<p>Triton의 _attn_fwd_inner는 STAGE=1에서 현재 관심 묶음 앞의 key 범위를, STAGE=2에서 대각선 범위를 처리합니다. STAGE=2에서만 행과 열을 비교해 미래 칸을 가립니다. 앞의 10조각 그림으로 보면 아래쪽 6조각과 대각선 4조각의 차이를 코드로 나눈 것입니다.</p>
<p>원문은 점수를 log₂e 배율로 조정해 exp2를 사용합니다. 가리는 값도 이 튜토리얼에서는 유한한 −1e6을 더합니다. 이를 모든 입력에서 수학적 −∞와 완전히 같다고 바꿔 적지 않습니다. 실제 지원 형식과 값의 범위 안에서 참조 계산과 오차를 비교해야 합니다.</p>
<p>끝에서는 출력과 함께 M에 log₂ 지수합을 저장합니다. 10절의 FA2 합치기에서 읽은 자연로그 LSE와 로그 밑까지 구별해야 합니다. 같은 “LSE”라는 이름만으로 서로 다른 구현의 저장값을 그대로 섞을 수는 없습니다.</p>
</div>
{code("triton-loop","원문: 구간, 마스크와 지수")}{code("triton-output","원문: 출력과 log₂ 지수합 저장")}
</section>
<section id="limits" data-teach-level="6" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">20 · 새 구현의 이름보다 같은 입력의 결과를 비교한다</h2><div className={prose}>
<p>학습이나 서빙에 적용할 때는 같은 입력, 마스크, 위치 정렬, KV 배치를 고정합니다. 출력 오차 허용 범위와 실행 조건을 기록하고, warmup·컴파일·계획 만들기와 반복 kernel 시간을 구별합니다. 실제 HBM 이동량과 부분 결과 workspace도 함께 측정해야 저장량 추정과 시간 측정이 연결됩니다.</p>
<p>FA3의 FP8 결과에는 block별 scale과 Q/K의 outlier를 분산하는 기법이 함께 들어갑니다. 보고한 약 2.6배 오차 감소는 비교한 기본 per-tensor FP8 설정의 범위입니다. 모든 입력이나 다른 양자화 방식에 같은 비율을 보장하지 않습니다.</p>
<p>Blackwell의 FA4 경로는 또 다른 내부 자원과 지수 처리 방식을 씁니다. 이전 글의 같은 네 점수 계산으로 조건부 기준 갱신을 확인할 수 있습니다. 세대 번호만 올랐다고 현재 모델의 모든 shape에 맞는 구현이 선택되는 것은 아닙니다.</p>
<p>이 글에서 직접 확인한 실행은 작은 산술과 원문 Python 제어 몸체의 CPU 관찰입니다. FA2·FA3·FlashInfer의 성능 수치는 원 논문의 저자 측정이며 이 컴퓨터에서 GPU 성능을 재현한 값이 아닙니다. 실제 운영 조건의 선택은 정확성과 완료시간을 함께 측정해 마무리합니다.</p>
</div>
<div className={prose}><p><Link to="/cs/ai/flash-attention-io-aware-kernel#comparison">같은 출력으로 FA4의 기준 갱신을 읽기</Link>와 <Link to="/cs/ai/speculative-decoding-variants">한 번에 확정하는 token 수를 바꾸는 방법</Link>으로 이어집니다. 앞은 한 번의 계산을, 뒤는 생성 과정에서 필요한 단계 수를 다룹니다.</p></div><ContentBoundary article="attention-kernel-anatomy-and-backends"/>
</section>
<section id="review" data-teach-level="7" className="scroll-mt-24"><h2 className="mb-6 text-2xl font-bold">21 · 마지막 위치의 결과를 다시 예측한다</h2><div className={prose}>
<p>여덟 위치의 마지막 답은 끝까지 4.5였습니다. 조각을 건너뛰거나 계산을 나눌 수 있어도 위치 정렬과 부분 결과의 비중은 보존해야 합니다. 다음 질문을 먼저 풀고 해당 절의 장부와 대조해 보세요.</p>
</div>
<ReviewPrompts questions={["새 query가 한 행뿐일 때 왜 첫 key만 남기면 안 되나요? 10조각의 40칸과 허용 연결 36개는 왜 다른가요? (답: 8절)","세 부분 평균 2, 5, 7.5를 똑같이 더해 나누면 얼마이며, 원래 출력 4.5를 복구하려면 무엇이 더 필요한가요? (답: 9절)","A가 미지원이고 B가 지원일 때 자동 선택과 A 명시 선택은 어떻게 달라지나요? 후보 선택이 매 요청의 속도 측정이라는 뜻인가요? (답: 17절)"]}/>
</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={projectMetas}/></div>;}
