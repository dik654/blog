import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ContentBoundary from "@/components/articles/content-boundary";
import { Link } from "react-router-dom";
import {codeRefs} from "./codeRefs";
import {fileTrees} from "./fileTree";
import TreeTraceViz from "./viz/TreeTraceViz";
import MtpCostViz from "./viz/MtpCostViz";
import MaskTable from "./MaskTable";
import TermBreakdown from "@/components/articles/term-breakdown";
import ProgressiveDetail from "@/components/articles/progressive-detail";
export default function ModernArticle(){const sidebar=useCodeSidebar();return <>
<section id="overview" data-teach-level="S" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 같은 다음 글을 여러 갈래로 준비할 수 있습니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">언어 모델이 다음 글자를 하나씩 고르고 있습니다. 빠른 부품이 미리 쓴 후보를 큰 모델이 확인하면 한 번에 여러 글자를 확정할 수 있습니다. 그런데 처음 후보 하나가 틀리면 그 뒤에 준비한 글도 대부분 쓰지 못합니다. 첫 선택을 두 개 준비하면 이 낭비를 줄일 수 있을까요?</p>
<p className="leading-8">이번에는 다음 글이 R로 시작한다고 두겠습니다. R 뒤에는 A와 B를 준비하고 두 경우 모두 그 뒤에 X와 Y를 준비합니다. 큰 모델의 선택은 R 다음 A, 그 다음 Y입니다. 한 줄 RAX만 준비했다면 마지막 후보가 틀리지만 두 갈래를 두면 RAY가 이미 있습니다. (가정)</p>
<p className="leading-8">갈래가 늘면 확인할 자리도 늘어납니다. 후보를 준비하는 부품을 싸게 바꾸는 일과 확인할 글의 모양을 바꾸는 일은 서로 다른 선택입니다. 같은 RAY를 확정하는 과정을 따라가며 두 선택이 계산 기록과 시간에 무엇을 더하는지 보겠습니다.</p>
<p className="leading-8">앞 글의 한 줄 후보는 첫 거부 뒤를 잘랐습니다. 이 글에서는 다른 갈래의 기록을 섞지 않으면서 한 경로를 남겨야 합니다. 마지막에는 앞부분만 쓰는 모델, 보조 예측 부품, 과거 글 검색을 같은 시간 장부에 올려 비교합니다.</p>
</div>
<p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p><ol className="list-decimal space-y-2 pl-6"><li>Root 1개, 다음 갈래 2개, 그다음 갈래 4개면 준비한 자리는 모두 7개일까요?</li><li>RAY 경로가 펼친 목록 [R,A,B,X,Y,X,Y]에서 고르는 위치는 [0,1,4]일까요?</li><li>RA 뒤의 Y와 RB 뒤의 Y는 글자가 같으므로 KV 기록도 서로 바꿔 쓸 수 있을까요?</li></ol><p>답은 <strong>예, 예, 아니요</strong>입니다. Tree는 후보의 부모 관계를 보존하고 target이 승인한 한 경로의 기록만 연속 위치로 모읍니다.</p><TreeTraceViz/><ContentBoundary article="speculative-decoding-variants" />
</section>
<section id="black-box" data-teach-level="B" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 준비한 갈래를 확인하고 한 경로의 기록을 모읍니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">입력은 이미 확정한 글과 바로 다음 글을 고르는 점수입니다. 준비 담당자는 시작 R 뒤의 두 자리마다 후보 두 개를 붙입니다. 확인 담당자는 각 자리가 가정하는 앞 글만 읽고 다음 선택을 계산합니다. 기록 담당자는 확정 경로의 중간 계산만 다음 바퀴에 넘깁니다.</p>
<p className="leading-8">외부에 내보내는 결과는 모든 갈래의 글이 아닙니다. 이번에는 RAY 한 줄입니다. 다른 경로 RAX나 RBX에서 얻은 중간 계산을 RAY의 기록으로 남기면 다음 선택부터 다른 글을 읽게 됩니다.</p>
<p className="leading-8">후보를 누가 만들었는지는 확인의 기준과 별개입니다. 모델의 일부를 쓰거나 별도 예측 부품을 붙이거나 지난 출력에서 이어질 내용을 찾아도, 이번 출력은 정해진 확인 규칙을 통과해야 합니다. 후보가 빠르게 나왔다는 사실만으로 그 글을 확정하지 않습니다.</p>
<p className="leading-8">시간도 세 부분을 합쳐 봅니다. 후보를 준비한 시간, 여러 갈래를 확인한 시간, 선택한 기록을 모으는 시간입니다. 세 글자를 한꺼번에 확정했어도 이 합이 원래 세 글자를 만드는 시간보다 길면 이득이 없습니다.</p>
</div>

</section>
<section id="small-case" data-teach-level="0" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 일곱 자리를 준비해 RAY 세 글자를 남깁니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">이미 확정한 글이 네 자리이고 그 네 자리의 중간 계산도 모두 끝났다고 합시다. 그 계산에서 나온 다음 선택은 R입니다. R은 아직 출력 목록에 붙이지 않았으며 R 자체를 입력으로 처리한 기록도 없습니다. 이 시작 상태는 뒤에서 읽을 고정 구현에 맞춘 가정입니다.</p>
<p className="leading-8">준비한 목록은 [R,A,B,X,Y,X,Y]입니다. R은 하나, 그 뒤 첫 후보는 A와 B 두 개, 둘째 후보는 각 갈래에 X와 Y 두 개씩입니다. 그래서 새로 계산할 자리는 1+2+4=7개입니다. R 뒤에 붙인 후보만 세면 여섯 개입니다.</p>
<p className="leading-8">같은 Y가 두 번 나와도 서로 바꿔 쓰지 않습니다. 목록의 다섯째 Y는 앞에 RA가 있고 일곱째 Y는 앞에 RB가 있습니다. 글자의 이름은 같지만 그 글자를 읽기까지의 문장이 다릅니다. 중간 계산도 같다고 놓을 수 없습니다.</p>
<p className="leading-8">큰 모델이 R 다음에는 A, RA 다음에는 Y를 고른다고 합시다. RAY 뒤의 다음 선택은 C라고 두겠습니다. 모두 작은 경로를 확인하기 위한 값이며 실제 학습 모델에서 측정한 문장이나 점수는 아닙니다. (가정)</p>
<p className="leading-8">확인 결과 남는 위치는 목록의 첫째 R, 둘째 A, 다섯째 Y입니다. 컴퓨터가 0부터 번호를 붙이면 [0,1,4]입니다. 먼저 A를 고른 뒤 Y를 고르는 순서는 그대로지만 일렬로 저장한 목록에서는 서로 떨어진 칸을 골라야 합니다.</p>
<p className="leading-8">이미 있던 네 자리 뒤에 임시 계산 일곱 자리를 놓으면 새 기록의 번호는 4부터 10까지입니다. 그중 R·A·Y의 기록은 [4,5,8]에 있습니다. 다음 바퀴에서 연속된 글처럼 읽도록 이 기록을 [4,5,6]으로 모읍니다.</p>
<p className="leading-8">이번 출력 목록에는 RAY 세 글자를 붙입니다. 원래 네 자리와 합쳐 일곱 자리가 되고 유효한 계산 기록도 일곱 자리입니다. C를 고르는 점수는 보관하지만 이 구현의 현재 갱신 단계에서 C까지 출력에 붙이지는 않습니다. C는 다음 바퀴의 시작 후보가 됩니다.</p>
<p className="leading-8">후보 준비를 한 줄 RAX로 줄였다면 큰 모델은 R 다음 A까지는 같은 선택을 합니다. RA 뒤에서는 X 대신 Y를 고를 수 있지만 Y를 입력으로 처리한 기록은 아직 없습니다. 두 갈래를 준비했을 때는 Y의 기록까지 이미 계산했다는 차이가 생깁니다.</p>
<p className="leading-8">같은 목록에서 큰 모델이 첫 선택만 B로 바꾸고 그 뒤에는 Y를 고른다면 남길 자리는 [0,2,6]이 됩니다. 기존 네 자리 뒤의 기록 [4,6,10]을 [4,5,6]으로 모아 RBY를 이어 씁니다. 준비한 일곱 자리가 같아도 남는 세 자리는 선택에 따라 달라집니다. (가정)</p>
<p className="leading-8">첫 선택이 준비하지 않은 Z라면 어떨까요? 시작 R만 남기고 그 뒤의 후보는 모두 버립니다. R은 이미 큰 모델의 점수에서 고른 글이므로 출력할 수 있습니다. Z의 점수는 다음 바퀴로 넘기지만 Z의 계산 기록을 미리 얻었다고 셀 수는 없습니다. (가정)</p>
<p className="leading-8">따라서 버리는 가지가 많다는 말은 전체 입력을 처음부터 다시 계산한다는 뜻이 아닙니다. 원래 네 자리와 이번에 남긴 R의 기록은 유효합니다. 반대로 임시 일곱 자리를 계산했다는 이유만으로 기록 길이를 열한 자리로 늘리면 버린 후보까지 다음 문장의 일부로 읽게 됩니다.</p>
<p className="leading-8">복사할 목록과 복사할 목적지도 따로 적어야 합니다. RAY에서는 원래 기록의 8번을 새 6번으로 옮깁니다. 먼저 모든 선택 위치의 값을 모은 뒤 목적지에 쓰면 옮기는 도중 다른 원본을 덮어쓰는 문제를 피할 수 있습니다. 뒤의 실제 코드는 이 순서까지 확인합니다.</p>
<p className="leading-8">어느 경우에도 RAY라는 글자가 같다는 사실과 그 글자의 계산을 어디까지 끝냈는지는 구분해야 합니다. 여러 구현의 “세 개 확정”을 비교할 때는 첫 자리와 마지막 자리를 어느 바퀴에서 세는지도 맞춰야 합니다. 작은 상태를 고정했으니 이제 그림에서 그 자리를 찾을 수 있습니다.</p>
</div>

</section>
<section id="structure" data-teach-level="1" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 글자는 같아도 가지가 다르면 다른 자리입니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">그림의 맨 위 R에서 아래로 내려가면 A와 B로 갈라집니다. A 아래의 Y로 내려간 경로만 남깁니다. 오른쪽 B 아래의 Y는 같은 글자이지만 다른 문장을 가정하므로 이번 계산 기록으로 사용하지 않습니다.</p>
<p className="leading-8">그림을 한 줄로 펼친 순서는 [R,A,B,X,Y,X,Y]입니다. 연결선을 없애고 이 순서만 읽으면 RB가 실제 문장의 일부라고 착각하기 쉽습니다. 어떤 자리가 어느 앞 글을 읽어야 하는지는 연결 관계로 따로 보존합니다.</p>
<p className="leading-8">각 자리의 문장상 위치도 저장 순서와 다릅니다. R은 다섯째 자리이고 A와 B는 둘 다 여섯째 자리입니다. 네 개의 X·Y는 각각 자기 경로에서 일곱째 자리입니다. 저장 번호가 뒤에 있다고 더 먼 미래의 글자는 아닙니다.</p>
<p className="leading-8">일곱 자리 모두를 확인해도 일곱 글자를 내보내지는 않습니다. 경로 선택과 기록 정리가 끝나야 세 글자 RAY를 이어 쓸 수 있습니다. 아래 장면에서는 다른 가지를 흐리게 하고 실제로 모을 세 자리만 남깁니다.</p>
</div>
</section>
<section id="why-components" data-teach-level="2" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 읽을 곳을 가리는 장치와 기록을 모으는 장치가 필요합니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">RA 뒤의 Y를 계산할 때 RB의 B를 읽게 하면 어떤 일이 생길까요? 그 Y는 더 이상 RAY라는 문장의 계산 결과가 아닙니다. 여러 후보를 한 번에 넣으면서도 각 자리가 자기 앞 글만 읽도록 허용된 연결을 표시해야 합니다.</p>
<p className="leading-8">이 표시는 현재 자기 자리도 포함합니다. R은 R 하나를, A와 B는 각각 R과 자신 두 자리를 읽습니다. 네 끝자리는 R·자기 부모·자신의 세 자리를 읽습니다. 새 일곱 자리 안에서 허용된 칸의 합은 1+2×2+4×3=17개입니다.</p>
<p className="leading-8">R 행과 열을 떼고 후보 여섯 자리끼리의 연결만 보면 2×1+4×2=10개입니다. 처음 네 자리의 기존 글은 별도로 모두에게 제공됩니다. 17과 10은 같은 그림에서 무엇을 포함해 셌는지가 다른 수입니다.</p>
<p className="leading-8">읽을 곳을 올바르게 가려도 기록은 일렬로 흩어져 있습니다. [4,5,8]을 계속 세 개의 연속 자리라고 읽으려면 주소를 바꾸거나 실제 값을 옮겨야 합니다. 뒤에서 볼 구현은 값을 복사합니다. 어느 구현이나 기록의 주소만 바꾼다고 단정할 수 없습니다.</p>
<p className="leading-8">후보의 점수만 높아도 충분하지 않습니다. 실제 앞 글을 지키는 읽기 제한, 연속해서 맞은 경로의 선택, 그 경로에 대응한 기록 갱신이 함께 필요합니다. 이 역할들을 알았으니 다음 절에서 이름을 붙이겠습니다.</p>
</div>

</section>
<section id="names" data-teach-level="3" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 여러 후보의 연결을 tree, 읽기 제한을 mask라고 부릅니다</h2>
<TermBreakdown title="앞에서 본 역할에 이름을 붙입니다" items={[{"term": "token tree · 후보의 연결", "description": "부모와 자식으로 이어진 후보들의 구조입니다. tree는 나무처럼 가지가 나뉜다는 뜻입니다.", "example": "R 뒤의 A와 B 아래에 X와 Y가 이어집니다.", "boundary": "일렬 저장 순서가 실제 문장의 순서는 아닙니다."}, {"term": "node · 한 자리", "description": "그 구조의 한 자리를 node라고 부릅니다.", "example": "RA 뒤의 Y와 RB 뒤의 Y는 다른 node입니다."}, {"term": "root · 시작점", "description": "맨 위의 시작점입니다. 뒤에 붙인 후보와 시작점을 구별해 셉니다.", "example": "R 하나와 후보 여섯 자리로 모두 일곱 자리를 계산합니다."}, {"term": "attention mask · 읽기 허용 표", "description": "각 자리가 어느 기록을 읽을 수 있는지 표시합니다.", "example": "A쪽 Y는 R·A·자신을 읽습니다.", "boundary": "허용된 칸 수가 실제 GPU 연산 수와 같지는 않습니다."}, {"term": "tree attention · 경로별 읽기", "description": "한 자리에서 자기 경로의 앞 글을 읽도록 제한한 계산입니다.", "example": "RAY의 Y는 다른 가지의 B를 읽지 않습니다."}, {"term": "KV cache · 앞 계산의 기록", "description": "앞 계산을 재사용하려고 남긴 key와 value입니다. 각 층에서 문장 위치마다 기록합니다.", "example": "선택한 [4,5,8]의 기록을 [4,5,6]으로 모읍니다."}, {"term": "greedy · 가장 높은 점수의 선택", "description": "다음 점수가 가장 높은 글자를 택하는 규칙입니다.", "example": "이번 경로 추적에서는 R 다음 A, 그다음 Y를 고릅니다."}, {"term": "sampling · 확률에 따른 선택", "description": "분포의 확률에 따라 다음 글자를 뽑습니다.", "boundary": "여러 갈래를 한꺼번에 계산하는 구조만으로 확률 분포의 보존이 증명되지는 않습니다."}]}/>

</section>
<section id="request-trace" data-teach-level="4" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 부모의 점수로 다음 자리를 확인합니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">표시된 글자를 실제 token ID로 바꿔 R=0, A=1, B=2, X=3, Y=4, C=5로 두겠습니다. 기존 네 자리 뒤에서 이미 얻은 target 점수의 최댓값은 ID 0입니다. 이 값으로 새 root R을 고릅니다.</p>
<p className="leading-8">R을 입력으로 계산한 점수는 그 다음 A를 평가합니다. A 자리의 점수는 그 다음 Y를 평가합니다. Y 자리의 점수는 다음 C를 고릅니다. 자기 자리에 붙은 글자가 자기 자리의 출력 점수와 같아야 한다고 비교하면 한 칸이 어긋납니다.</p>
<p className="leading-8">경로별 목록은 RBY, RBX, RAY, RAX입니다. 원문이 만드는 순서를 그대로 적었습니다. RAY에서는 R의 점수와 A, A의 점수와 Y가 연속으로 맞아 후보 일치 길이가 2입니다. RAX는 첫 A만 맞고 RBY·RBX는 첫 B에서 막힙니다.</p>
<p className="leading-8">원문은 가장 긴 RAY를 고르고 root까지 세 개를 출력에 붙입니다. 기록 [4,5,8]을 [4,5,6]으로 모으며 Y의 다음 점수도 보관합니다. 다른 갈래의 KV는 유효 길이에 포함하지 않습니다. 이제 같은 번호를 실제 배열 생성과 비교하겠습니다.</p>
</div>

</section>
<span id="tree-verify"/><section id="mask" data-teach-level="5" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 7×7 표의 17개 칸만 새 기록을 읽습니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            같은 RAY에서 A쪽 Y는 root R, A, 자신만 봅니다. B나 B쪽 Y를 허용하면 서로 다른 문장을 섞습니다. 앞의 네 자리 기록은 별도로 읽을 수 있다고 두고 새
            입력끼리의 7×7 표부터 확인합니다.
          </p>
<p className="leading-8">일반적인 일곱 자리 문장을 한 줄로 읽으면 아래 삼각형의 1+2+⋯+7=28칸을 엽니다. 이번 가지 구조는 깊이별로 1, 2, 3칸만 열어 총 17칸입니다. root를 제외한 6×6 영역은 10칸이며 일반 여섯 자리의 21칸과 다릅니다.</p>
<p className="leading-8">마스크의 허용 칸 수는 실제 GPU 연산 수가 아닙니다. 0인 칸을 가려도 구현이 조밀한 행렬곱을 그대로 수행할 수 있습니다. 메모리 접근·kernel 방식·이미 있던 prefix 길이를 함께 보아야 비용을 알 수 있습니다.</p>
</div>
<MaskTable/><CodeViewButton label="실제 읽기 제한 적용 코드" onClick={() => sidebar.open("mask-apply", codeRefs["mask-apply"])}/>
</section>
<section id="buffers" data-teach-level="5" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 실제 배열은 깊이와 후보 순위에서 만들어집니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">Medusa commit e2a5d20의 generate_medusa_buffers에 선택 경로 [0], [1], [0,0], [0,1], [1,0], [1,1]을 넣습니다. 대괄호의 값은 글자 ID가 아니라 각 예측 부품이 낸 후보의 순위입니다. A·B와 X·Y를 각각 첫째·둘째 후보라고 둔 사례입니다.</p>
<p className="leading-8">함수는 길이와 순위로 정렬한 뒤 root 한 칸을 더합니다. 자기 칸을 열고 모든 node의 root 칸을 연 뒤 조상 번호를 찾아 추가합니다. 그 결과가 앞의 17칸입니다. 원본 함수 AST를 작은 CPU 배열 대역과 실행해 같은 표를 확인했습니다.</p>
<p className="leading-8">상대 위치 번호는 [0,1,1,2,2,2,2]입니다. tree_decoding은 여기에 이미 확정한 길이 4를 더해 [4,5,5,6,6,6,6]을 사용합니다. 같은 깊이의 A와 B가 같은 문장 위치를 받는 이유가 코드에 드러납니다.</p>
<p className="leading-8">고정 코드의 TOPK는 10입니다. 후보를 모아 둔 배열에서 꺼낼 번호는 [0,1,2,11,12,11,12]가 됩니다. 마지막 네 node가 같은 두 head 출력을 재사용해도 target에서 읽을 경로와 KV는 서로 다릅니다. 이 10을 이 예의 tree 크기나 모든 Medusa 설정의 한도로 읽지 않습니다.</p>
</div>
<CodeViewButton label="mask·위치·경로 배열을 만드는 실제 함수" onClick={() => sidebar.open("buffers", codeRefs["buffers"])}/><CodeViewButton label="새 root와 후보를 모으는 원문" onClick={() => sidebar.open("root", codeRefs["root"])}/><CodeViewButton label="같은 깊이의 위치 번호를 적용하는 원문" onClick={() => sidebar.open("tree-forward", codeRefs["tree-forward"])}/>
</section>
<section id="greedy" data-teach-level="5" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 연속 일치만 세어 RAY 행을 고릅니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">evaluate_posterior의 temperature 0 분기는 candidates의 둘째 칸부터 부모 위치의 argmax와 비교합니다. RAY 행의 비교 결과는 [1,1]이고 RAX는 [1,0]입니다. 처음이 B인 두 행은 [0,1]이어도 첫 실패 뒤를 확정할 수 없습니다.</p>
<p className="leading-8">각 행의 비교값을 앞에서부터 곱하는 cumprod를 적용하면 [0,1]은 [0,0]이 됩니다. 이후 합으로 연속 일치 길이를 구합니다. RAY의 2가 최대이므로 원문 순서의 행 번호 2를 선택합니다.</p>
<p className="leading-8">이 검산은 가정한 점수를 넣어 실제 함수의 greedy 분기를 실행한 것입니다. PyTorch 대신 작은 Python 배열 대역을 사용했으며 모델 forward나 GPU를 실행하지 않았습니다. 함수 제어와 인덱스를 확인한 결과를 실제 언어 모델의 성능 재현이라고 부르지 않습니다.</p>
</div>
<CodeViewButton label="첫 불일치 뒤를 제외하는 실제 함수" onClick={() => sidebar.open("greedy", codeRefs["greedy"])}/>
</section>
<section id="commit" data-teach-level="5" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 기록 4·5·8을 4·5·6으로 복사합니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">update_inference_inputs는 선택 행의 retrieve_indices에서 accept_length+1개를 꺼냅니다. root를 포함하기 때문에 2+1입니다. [0,1,4]에 기존 길이 4를 더해 실제 KV 위치 [4,5,8]을 얻습니다.</p>
<p className="leading-8">그 위치의 값을 임시로 읽은 뒤 기존 글 바로 뒤의 [4,5,6]에 copy_합니다. current_length도 7로 갱신합니다. 이번 구현은 block table만 바꾸는 방식이 아니며 서로 떨어진 경로의 기록을 실제로 모읍니다.</p>
<p className="leading-8">출력 목록에 RAY를 붙인 길이와 유효 KV 길이가 둘 다 7입니다. 함수는 Y 자리의 logits를 남겨 다음 바퀴에서 C를 고르게 합니다. 여기서 C를 이번 bonus로 추가했다고 적으면 출력과 저장 시점이 모두 한 칸 어긋납니다.</p>
<p className="leading-8">SpecInfer의 논문 Algorithm 2는 이미 확인된 root에서 자식 경로를 따라가고 마지막 선택을 붙이는 서술을 사용합니다. root를 새로 선택해 출력에 포함하는 이 Medusa 함수와 한 바퀴의 경계가 다릅니다. 같은 생성 원리를 비교할 때도 root·bonus·유효 KV의 포함 범위를 먼저 맞춥니다.</p>
</div>
<CodeViewButton label="선택한 KV를 복사하고 길이를 갱신하는 원문" onClick={() => sidebar.open("commit", codeRefs["commit"])}/><CitationBlock citeKey={11} source="SpecInfer v4 — Algorithm 2, VerifyGreedy" href="https://arxiv.org/html/2305.09781v4">논문 17–22행의 root와 마지막 추가 위치를 작은 RAY 경로에 대응하면 구현별 회차 경계를 구별할 수 있습니다.</CitationBlock>
</section>
<section id="sampling-boundary" data-teach-level="6" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">12. 그럴듯한 후보를 고르는 것과 같은 분포를 만드는 것은 다릅니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">greedy에서는 같은 조건의 최고 점수 글자를 따라가면 됩니다. sampling에서는 여러 번 생성할 때 각 글자가 나오는 확률까지 지켜야 합니다. 후보가 어느 문장을 읽었는지와 어떤 확률 규칙으로 확정됐는지는 서로 다른 정확성 조건입니다.</p>
<p className="leading-8">확인 분포가 A .7, B .3이라고 합시다. 확률이 .2보다 큰 후보를 그대로 받는 규칙에서 항상 B를 제안하면 B가 매번 나옵니다. B가 충분히 그럴듯하다는 판단은 통과하지만 원래 .3의 비중은 보존되지 않습니다. (가정)</p>
<p className="leading-8">Medusa의 typical·fast 분기는 후보 확률을 entropy에 따른 문턱과 비교하고 가장 긴 경로를 고릅니다. 논문도 이 방식에서 target 분포 일치를 필수 목표로 두지 않습니다. 본문의 작은 반례가 이 선택의 경계를 보여 줍니다. 품질 평가가 비슷했다는 보고를 확률 분포의 항등식으로 바꾸지 않습니다.</p>
<p className="leading-8">SpecInfer의 Algorithm 2는 거부한 형제의 제안 분포를 현재 남은 분포에서 빼고 양수 부분을 다시 정규화합니다. 다음 형제를 확인할 때도 그 갱신된 분포를 씁니다. 예를 들어 target (.7,.3), 첫 제안 (.4,.6)에서 거부하면 잔여 분포는 (1,0)입니다. 다음 형제에서도 원래 (.7,.3)을 그대로 쓰는 절차와 다릅니다.</p>
<p className="leading-8">이 보장은 논문의 제안 선택·조건부 분포·중복 처리와 검증 규칙을 함께 지켰을 때 읽습니다. 서로 다른 sampler를 쓴 임의의 tree에 p/q 한 줄만 붙인다고 증명되지 않습니다. 같은 분포인 두 확률 모델에서는 정확한 단일 후보 수락률이 1이라는 앞 글의 결과도 유지됩니다.</p>
</div>
<CodeViewButton label="Medusa의 실제 typical·fast 분기" onClick={() => sidebar.open("typical", codeRefs["typical"])}/><CitationBlock citeKey={12} source="Medusa v3 — §2.3.1 Typical Acceptance" href="https://arxiv.org/html/2401.10774v3">작은 B 반례를 확률 문턱 방식에 적용해 분포 일치와 품질 평가를 구분합니다.</CitationBlock><CitationBlock citeKey={13} source="SpecInfer v4 — Algorithm 2 lines 29–43" href="https://arxiv.org/html/2305.09781v4">거부할 때마다 잔여 분포를 갱신하는 순서가 여러 형제의 검증을 연결합니다.</CitationBlock>
</section>
<span id="tree"/><section id="tree-cost" data-teach-level="6" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">13. 가지가 넓어지면 확정 길이와 확인 비용이 함께 늘어납니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">후보 폭을 첫째 3, 둘째 2, 셋째 2로 늘리면 후보 수는 3+6+12=21입니다. root 한 자리를 포함해 입력하면 22개입니다. 깊이 3의 한 줄 후보는 3개이며 같은 root 경계에서는 입력 4개입니다. 후보 수와 입력 수를 혼용하지 않습니다.</p>
<p className="leading-8">각 깊이에서 앞 경로가 맞았다는 조건 아래 다음 선택을 포함할 확률을 .89, .85, .8로 가정합시다. 첫 자리까지 맞을 확률은 .89, 둘째까지는 .89×.85=.7565, 셋째까지는 .6052입니다. 기본 한 출력까지 더한 평균은 3.2517입니다. (가정)</p>
<p className="leading-8">이 곱셈은 조건부 확률의 연결이므로 깊이 사이의 독립을 추가로 가정하지 않습니다. 반면 그냥 각 자리의 주변 포함률 세 개만 알 때는 같은 곱을 사용할 수 없습니다. 한 줄에서 iid 수락률 .7을 가정한 평균 1+.7+.49+.343=2.533과도 조건이 다릅니다.</p>
<p className="leading-8">평균이 3.2517로 길어도 더 빠르다고 결정할 수 없습니다. 기준 한 글자 시간을 1로 놓고 tree 회차 비용 4.2, chain 비용 1.7을 따로 가정하면 시간 개선 비는 .7742와 1.49입니다. 더 많이 확정한 tree 쪽이 오히려 느립니다. 원문이 논의하는 후보 폭의 절충을 숫자로 확인한 예입니다.</p>
</div>
<ExplainedFormula question="후보 수와 평균 확정 길이는 어떻게 다를까요?" idea="깊이별 후보 수는 폭을 곱하고 평균 길이는 그 깊이까지 맞을 확률을 더합니다." formula={String.raw`\begin{aligned}N&=\sum_{j=1}^{K}\prod_{i=1}^{j}s_i\\\mathbb E[Y]&=1+\sum_{j=1}^{K}\prod_{i=1}^{j}\beta_i\end{aligned}`} annotatedFormula={String.raw`\begin{aligned}N&=\sum_{j=1}^{K}\prod_{i=1}^{j}s_i\\\mathbb E[Y]&=1+\sum_{j=1}^{K}\prod_{i=1}^{j}\beta_i\end{aligned}`} terms={[{"symbol": "s_i", "name": "해당 깊이의 후보 폭", "description": "작은 확장 예에서는 3,2,2입니다."}, {"symbol": "\\beta_i", "name": "앞 경로가 맞았을 때의 포함률", "description": "해당 조건을 붙인 .89,.85,.8입니다."}]} operations={[{"expression": "3+3\\times2+3\\times2\\times2", "annotation": ["후보 21개에 root를 더하면 입력 22개입니다."]}, {"expression": "1+.89+.7565+.6052", "annotation": ["평균 확정 수 3.2517입니다."]}]} assumptions={["종료로 회차가 잘리지 않는 greedy 경로 포함률 모형입니다.", "조건부 포함률이며 독립인 주변확률이라고 놓지 않습니다."]} interpretation="시간 비는 각각 3.2517/4.2=.7742와 2.533/1.7=1.49입니다."/><CitationBlock citeKey={14} source="SpecInfer v4 — §3 expansion, Table 1" href="https://arxiv.org/html/2305.09781v4">논문의 폭 확장 방식에 3·2·2를 넣었습니다. .89/.85/.8 전체는 별도 가정이며 논문의 한 행을 깊이별 측정값으로 바꾼 것이 아닙니다.</CitationBlock>
</section>
<section id="self-speculative" data-teach-level="6" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">14. 같은 모델의 앞부분으로 후보를 만들 수도 있습니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">후보를 준비하는 부품을 바꾸어 보겠습니다. LayerSkip은 한 모델의 앞쪽 층에서 먼저 빠져나와 후보를 만든 뒤 뒤쪽 층으로 확인하는 self-speculative decoding을 사용합니다. 별도 모델 가중치를 두 벌 둘 필요를 줄이는 접근입니다.</p>
<p className="leading-8">아무 checkpoint에서 앞 층의 출력을 바로 읽으면 정확한 후보가 된다고 보장하지 않습니다. LayerSkip은 뒤 층일수록 더 자주 건너뛰는 학습과 중간 층의 출력에도 적용하는 학습 목표를 사용합니다. 읽을 수 있는 중간 상태와 유용한 후보를 내는 중간 상태는 다릅니다.</p>
<p className="leading-8">RAY라는 같은 글을 이어 쓰되 이 구현의 회차 시작을 맞추겠습니다. 이번에는 R을 이미 출력했지만 R의 KV는 아직 없다고 둡니다. 기존 네 자리 기록 뒤에서 앞 층이 R을 읽어 A를, 다시 A를 읽어 Y를 제안합니다. 그 과정의 중간 상태를 저장해 뒤 층에서 재사용합니다.</p>
</div>
<CitationBlock citeKey={15} source="LayerSkip v4 — §4.1–4.3" href="https://arxiv.org/html/2404.16710v4">같은 R·A·Y의 앞 층 상태를 저장하는 이유를 논문의 self-drafting·verification·cache reuse에 연결합니다.</CitationBlock>
</section>
<section id="self-source" data-teach-level="6" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">15. 마지막 후보의 앞 층 계산도 남아 있습니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">고정 LayerSkip 494752e5의 forward_early는 앞 층의 hidden state를 exit_query_cache에 이어 붙입니다. 이름은 query cache이지만 여기서 보관하는 변수는 그 지점의 hidden_states입니다. 이 저장 공간까지 없다는 뜻으로 “추가 메모리 0”이라고 부를 수 없습니다.</p>
<p className="leading-8">
            4층 중 첫 1층에서 두 후보 A·Y를 만든다고 합시다. 앞 층은 R과 A를 각각 처리해 두 상태를 쌓습니다. 검증의 forward_remainder는 마지막 Y의 앞 층도
            처리한 뒤 세 상태를 합쳐 나머지 3층으로 보냅니다. 앞 층 계산 3자리와 뒤 층 계산 3×3자리로 총 12개의 층·자리 작업입니다. (가정)
          </p>
<p className="leading-8">후보를 만들 때 처리한 앞 층 결과를 다시 계산하지 않는 장점이 있습니다. 동시에 마지막 후보를 입력으로 처리하는 일과 exit 상태 저장, 서로 다른 길이의 KV를 맞추는 일이 남습니다. 각 층의 계산량이 같다는 가정조차 실제 벽시계 시간의 비례 관계를 보장하지는 않습니다.</p>
<p className="leading-8">
            실제 single_step_speculation은 일치한 A·Y와 새로 고른 C를 출력하고 전체 출력 길이보다 하나 짧게 KV를 자릅니다. 이 시작 상태에서는 글 길이 8,
            계산 길이 7이며 C가 다음 입력입니다. Medusa 갱신의 글 7·KV 7과 한 바퀴 경계가 다르지만 읽은 문장과 기록을 맞추어야 한다는 원리는 같습니다.
          </p>
</div>
<CodeViewButton label="앞 층 상태를 저장하고 이어 쓰는 원문" onClick={() => sidebar.open("self-cache", codeRefs["self-cache"])}/><CodeViewButton label="확정 출력과 다음 입력을 나누는 원문" onClick={() => sidebar.open("self-loop", codeRefs["self-loop"])}/>
</section>
<section id="self-cost" data-teach-level="6" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">16. 층 수의 비율을 시간으로 바꾸려면 추가 가정이 필요합니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">32층 중 8층을 쓰면 층 수의 비율은 .25입니다. 그러나 후보 네 개의 실제 시간을 4×.25로 정하려면 층별 비용, 메모리 읽기, 마지막 입력 처리, 병렬 검증 비용까지 별도로 가정해야 합니다. 앞 절의 원문만으로 검증 시간이 .75라고 결론낼 수 없습니다.</p>
<p className="leading-8">
            기존의 간단한 비교를 시간 가정으로 다시 읽어 보겠습니다. 후보 전체 비용 1, 검증 비용 .75, 그 밖의 비용 0을 명시적으로 둡니다. iid 수락률 .75와 깊이 4이면
            평균 출력은 3.05078125이고 이를 1.75로 나눈 개선 비는 약 1.7433입니다. (가정)
          </p>
<p className="leading-8">
            같은 비용에서 수락률 .7이면 평균 2.7731로 약 1.5846배, .8이면 3.3616으로 1.9209배입니다. 정확한 산술 예지만 LayerSkip 실행 시간을 측정한
            결과는 아닙니다. 실제 선택에서는 exit 깊이를 바꿀 때의 후보 시간과 수락 길이, 검증 시간 모두를 다시 잽니다.
          </p>
</div>

</section>
<section id="mtp" data-teach-level="6" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">17. 다음 글자를 함께 넣는 보조 예측 부품입니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">DeepSeek-V3의 MTP는 학습 중 더 먼 미래도 예측하도록 붙인 순차 모듈입니다. 이전 깊이의 상태와 바로 다음 token의 embedding을 각각 정규화해 이어 붙이고 선형 투영으로 합칩니다. 그 결과를 Transformer block에 넣은 뒤 공유 output head로 그다음 글자의 분포를 만듭니다.</p>
<p className="leading-8">기존 네 자리의 마지막 상태가 다음 R을 고른 경우를 생각해 보세요. 첫 MTP 모듈은 그 상태와 R의 embedding을 함께 받아 다음 A를 예측합니다. 둘째 깊이가 있다면 앞 깊이의 상태와 A를 함께 받아 더 뒤를 예측합니다. 다음 글자의 정체를 주지 않고 같은 상태에서 여러 독립 미래를 고르는 구조와 다릅니다.</p>
<p className="leading-8">보고서의 식(21)은 두 d차원 벡터를 이어 2d로 만든 뒤 d×2d 행렬로 다시 d차원으로 보냅니다. 식(22)의 block과 식(23)의 공유 head가 이어집니다. 이 차원을 맞추면 네 부품의 역할과 다음 token 정보가 들어가는 위치를 실제 수식에서 찾을 수 있습니다.</p>
<p className="leading-8">
            Medusa의 여러 head는 같은 마지막 hidden state에서 서로 다른 미래 위치의 후보를 냅니다. DeepSeek-V3의 순차 모듈과 학습·입력 관계가 같다고 읽으면
            안 됩니다. MTP라는 학습 목표를 추론의 후보 생성에 재사용할 때도 정확한 모델 구조를 확인해야 합니다.
          </p>
</div>
<ExplainedFormula question="앞 상태와 다음 token은 어디서 만날까요?" idea="보고서의 순차 깊이 k에서 두 상태를 정규화하고 이어 붙여 새 모듈에 넣습니다." formula={String.raw`\begin{aligned}h_i^{\prime k}&=M_k[\operatorname{RMSNorm}(h_i^{k-1});\operatorname{RMSNorm}(\operatorname{Emb}(t_{i+k}))]\\h^k&=\operatorname{TRM}_k(h^{\prime k})\\P_{i+k+1}^k&=\operatorname{OutHead}(h_i^k)\end{aligned}`} annotatedFormula={String.raw`\begin{aligned}h_i^{\prime k}&=M_k[\operatorname{RMSNorm}(h_i^{k-1});\operatorname{RMSNorm}(\operatorname{Emb}(t_{i+k}))]\\h^k&=\operatorname{TRM}_k(h^{\prime k})\\P_{i+k+1}^k&=\operatorname{OutHead}(h_i^k)\end{aligned}`} terms={[{"symbol": "h_i^{k-1}", "name": "이전 깊이의 상태", "description": "k=1이면 기존 네 자리의 main model 상태입니다."}, {"symbol": "t_{i+k}", "name": "이미 지정한 다음 token", "description": "작은 사례의 첫 깊이에서는 R입니다."}, {"symbol": "M_k", "name": "두 입력을 합치는 투영", "description": "d×2d 행렬이 2d차원 입력을 d차원으로 만듭니다."}]} operations={[{"expression": "[h;\\operatorname{Emb}(R)]", "annotation": ["각각 정규화한 두 d차원 입력을 이어 붙입니다."]}, {"expression": "\\operatorname{OutHead}(h_i^1)", "annotation": ["그다음 A를 포함한 후보의 점수를 만듭니다."]}]} assumptions={["DeepSeek-V3 report v2의 식 21–23 구조입니다.", "모듈을 반복 실행하는 모든 구현의 비용이나 수락률을 이 식만으로 알 수는 없습니다."]} interpretation="공유 embedding·공유 head와 별도 block·projection을 구분합니다."/><CitationBlock citeKey={18} source="DeepSeek-V3 Technical Report v2 — §2.2 equations 21–23" href="https://arxiv.org/html/2412.19437v2">네 자리의 마지막 상태와 R을 식에 넣어 A의 예측이 생기는 경로를 확인합니다.</CitationBlock>
</section>
<section id="mtp-cost" data-teach-level="6" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">18. 한 후보가 이득일 조건은 검증 비용까지 포함합니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            MTP 후보가 하나이고 수락률이 .85라면, 기본 출력 하나와 받아들인 후보의 평균 .85를 합쳐 1.85개를 확정하는 모형을 둘 수 있습니다. 기준 한 글자 시간을 1로 놓고
            후보 비용을 .016이라고 따로 가정하겠습니다. 이 .016은 측정 시간의 가정이며 61층과 모듈 1개라는 개수만으로 얻은 사실은 아닙니다.
          </p>
<p className="leading-8">
            검증 비용 v가 1이면 1.85/1.016≈1.8209입니다. v=1.5이면 약 1.2203, v=2이면 약 .9177입니다. 같은 후보와 수락률에서도 검증이 비싸지면 단독
            생성보다 느려집니다. (가정)
          </p>
<p className="leading-8">
            이득일 조건은 1.85&gt;v+.016, 곧 v&lt;1.834입니다. v=2에서 이득을 얻으려면 수락률이 1.016보다 커야 하므로 확률의 범위 안에서는 불가능합니다.
            수락률과 비용을 함께 넣은 결론이지 batch 하나가 경계를 정한다는 법칙은 아닙니다.
          </p>
</div>
<ExplainedFormula question="후보 한 개는 어느 검증 비용까지 이득일까요?" idea="같은 확정 출력의 단독 비용 1+α를 후보 비용 c와 검증 비용 v의 합과 비교합니다." formula={String.raw`S=\frac{1+\alpha}{c+v},\qquad S>1\iff v<1+\alpha-c`} annotatedFormula={String.raw`S=\frac{1+\alpha}{c+v},\qquad S>1\iff v<1+\alpha-c`} terms={[{"symbol": "\\alpha", "name": "한 후보의 수락 확률", "description": "이 시간 모형에서는 .85입니다."}, {"symbol": "c,v", "name": "기준 한 글자 시간에 대한 비", "description": "후보 .016과 별도 검증 비용입니다."}]} operations={[{"expression": "1+.85-.016", "annotation": ["검증 비용의 엄격한 경계 1.834를 얻습니다."]}, {"expression": "1.85/(2+.016)", "annotation": ["v=2의 개선 비는 약 .9177입니다."]}]} assumptions={["직렬 비용을 서로 중복 없이 세고 추가 runtime 비용은 0으로 둡니다.", "EOS·길이 제한이 평균 출력을 먼저 자르지 않는 한 후보 모형입니다."]} interpretation="v=1.834는 같은 시간이며 더 작을 때만 이득입니다."/>
</section>
<section id="batch-boundary" data-teach-level="6" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">19. batch 모형도 단독 기준부터 같은 단위로 맞춥니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">batch가 커질 때의 모양을 보려고 별도 장난감 시간 모형을 두겠습니다. x=B/B*라 쓰고 단독 시간은 max(1,x), 두 자리 검증은 max(1,2x)에 비례한다고 가정합니다. B*는 이 모형의 두 비용이 만나는 위치이며 실제 GPU에서 측정한 한도가 아닙니다.</p>
<p className="leading-8">
            검증의 상대 비용은 두 수의 비 max(1,2x)/max(1,x)입니다. 분모를 항상 1로 두면 단독 생성도 비싸진 x&gt;1 구간에서 비교 기준이 달라집니다. 후보 비용
            c=.016은 이 비교에서 일정한 비라고 추가로 가정합니다.
          </p>
<p className="leading-8">x≤.5에서는 v=1입니다. .5&lt;x≤1에서는 v=2x이고 x≥1에서는 v=2입니다. 앞의 v&lt;1.834를 넣으면 양의 x에서 이득 구간은 x&lt;.917입니다. 따라서 ridge의 절반 .5를 넘었다는 사실만으로 곧바로 이득이 사라지지는 않습니다.</p>
<p className="leading-8">실제 연산·KV 읽기·통신·스케줄링은 이 단순 max 곡선에 모두 들어 있지 않습니다. 이 그래프를 실제 성능 하한이나 지연 보장으로 사용하지 않습니다. 같은 모델과 장치에서 단독 시간과 검증 시간을 측정한 뒤 앞 절의 비교식을 적용해야 합니다.</p>
</div>
<ExplainedFormula question="단독 생성도 느려지면 어떤 분모를 써야 할까요?" idea="같은 batch의 단독 시간을 분모로 두어 검증 비용을 정규화합니다." formula={String.raw`v(x)=\frac{\max(1,2x)}{\max(1,x)}=\begin{cases}1&0<x\le.5\\2x&.5<x\le1\\2&x\ge1\end{cases}`} annotatedFormula={String.raw`v(x)=\frac{\max(1,2x)}{\max(1,x)}=\begin{cases}1&0<x\le.5\\2x&.5<x\le1\\2&x\ge1\end{cases}`} terms={[{"symbol": "x", "name": "batch의 상대 크기", "description": "장난감 경계 B*로 나눈 양의 B입니다."}, {"symbol": "v(x)", "name": "정규화한 검증 시간", "description": "절대 시간이나 roofline 하한이 아닌 가정한 시간 비입니다."}]} operations={[{"expression": "2x<1.834", "annotation": ["중간 구간에서는 x<.917이 됩니다."]}, {"expression": "\\max(1,2x)/\\max(1,x)=2", "annotation": ["x≥1에서는 v=2로 후보 이득이 없습니다."]}]} assumptions={["단독과 검증에 같은 max 시간 모형을 정확한 값으로 가정한 설명용 곡선입니다.", "실제 GPU peak 수치에서 이 등식을 보장한 것이 아닙니다."]} interpretation="같은 α와 c라도 실제 v 곡선이 다르면 경계도 바뀝니다."/><MtpCostViz/>
</section>
<section id="suffix" data-teach-level="6" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">20. 과거의 R 뒤에서 A와 Y를 찾습니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            이제 후보를 만드는 일을 과거 출력 검색으로 바꾸겠습니다. 저장한 글 8개에서 R 뒤 A가 6번, B가 2번 나왔다고 합시다. A 뒤에는 Y가 5번, X가 1번이고 B 뒤에는
            두 번 모두 Y가 나왔습니다. 같은 RAY 후보를 학습 모델 대신 기록에서 얻는 예입니다. (가정)
          </p>
<p className="leading-8">
            R 다음 A의 빈도 비중은 6/8=.75입니다. RAY 전체 경로의 비중은 .75×5/6=.625입니다. RB는 .25이고 RBY도 .25입니다. 네 후보를 이 순서로 꺼내면
            부모 번호는 [-1,0,-1,2]이고 경로 비중의 합은 1.875입니다.
          </p>
<p className="leading-8">
            최근 token 열의 끝부분과 같은 기록을 찾는 자료 구조를 suffix tree라고 합니다. SuffixDecoding은 현재 요청의 글과 과거 출력에서 후보를 찾고 관찰
            빈도로 후보를 점수화합니다. 이 빈도는 현재 target의 진짜 확률을 직접 측정한 값이 아닙니다.
          </p>
<p className="leading-8">
            SuffixDecoding v3의 식 C(N)은 부모 아래 자식의 관찰 비중, D(N)은 그 비중을 경로를 따라 곱한 값입니다. SCORE는 선택한 node들의 D 합입니다.
            작은 사례의 .75와 .625를 넣으면 두 자리 경로의 점수 1.375를 얻습니다. 여러 갈래를 더한 1.875와 실제 target이 받아들인 수는 별도의 양입니다.
          </p>
</div>
<CitationBlock citeKey={21} source="SuffixDecoding v3 — §3 conditional counts and SCORE" href="https://arxiv.org/html/2411.04975v3">과거 8개 글의 빈도를 원문의 C·D·SCORE에 대응했습니다. 이 추정치를 새 요청의 실제 수락 확률이라고 보장하지 않습니다.</CitationBlock>
</section>
<section id="suffix-source" data-teach-level="6" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">21. 고정 원문은 네 후보와 부모 번호를 실제로 반환합니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            ArcticInference aca5d9a8의 C++ 원문을 그대로 컴파일해 앞의 8개 기록을 넣었습니다. ID는 R0·A1·B2·X3·Y4이고 기록 앞에는 9를 붙였습니다.
            조회 문맥 [99,9,0], 후보 한도 4, 길이 계수 2를 사용했습니다. 99는 일치하지 않는 앞부분을 표시하는 가정값입니다.
          </p>
<p className="leading-8">
            원문은 최근 길이 1과 2를 조회합니다. 길이 1이면 최대 2개, 길이 2이면 최대 4개를 제안할 수 있습니다. 경로 비중이 큰 후보부터 꺼내는 실제 priority
            queue의 반환은 [1,4,2,4], 부모 [-1,0,-1,2], 점수 1.875, 일치 길이 2였습니다.
          </p>
<p className="leading-8">
            한 줄만 선택하는 분기를 사용하면 [1,4]와 점수 1.375를 얻습니다. 서로 다른 출력들이 같은 R 뒤의 A·Y를 자주 공유했기 때문입니다. 어떤 후보를 만들었는지와 최종
            target 검증을 통과했는지는 이 실행에서도 구분했습니다. 여기서는 CPU 자료 구조만 실행했으며 모델이나 GPU는 실행하지 않았습니다.
          </p>
<p className="leading-8">이 코드의 자식 확률 분모는 부모 node의 count입니다. 어떤 기록이 부모에서 끝나면 자식 count의 합보다 부모 count가 클 수 있습니다. 종료된 기록이 없는 앞의 작은 분기에서는 논문의 자식 합과 같지만 모든 경우에 같은 식이라고 단정하지 않습니다.</p>
</div>
<CodeViewButton label="일치 길이와 후보 한도를 고르는 실제 원문" onClick={() => sidebar.open("suffix-lengths", codeRefs["suffix-lengths"])}/><CodeViewButton label="빈도로 네 후보를 확장하는 실제 C++ 원문" onClick={() => sidebar.open("suffix-tree", codeRefs["suffix-tree"])}/>
</section>
<section id="suffix-boundary" data-teach-level="6" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">22. 조회가 빗나가도 수행한 일은 남습니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            고정 C++ 함수의 반복 조건은 match_len&lt;context.size()입니다. 그래서 길이 1인 [0] 조회에서는 반복에 들어가지 않아 후보가 없습니다. [9,0]만
            주면 길이 1만 검사해 후보 [1,4]와 점수 1.375를 얻습니다. 가장 긴 입력 전체를 언제나 조회한다고 설명하면 실제 분기를 놓칩니다.
          </p>
<p className="leading-8">
            Python wrapper는 local과 global tree를 모두 조회한 뒤 점수가 높은 쪽을 고릅니다. 같은 점수면 local이 남습니다. max_spec_tokens를
            생략한 None 경로는 고정 버전에 없는 self.max_depth를 읽어 AttributeError가 났습니다. 본문의 호출은 4를 명시합니다. 이 확인은 원본 wrapper
            AST와 native 호출 대역에서 수행했고 실제 tree 계산은 별도 C++ 실행으로 확인했습니다.
          </p>
<p className="leading-8">
            현재 요청이 끝나면 local 기록은 제거되지만 그 출력의 global 기록은 별도 반환 때까지 남습니다. 원문은 새로 확정한 출력을 양쪽에 추가하고 global 한도를 넘기면
            기록을 제거합니다. 이런 저장·조회·정리의 CPU 시간과 메모리는 후보가 없다고 사라지지 않습니다.
          </p>
<p className="leading-8">
            실제 C++ 실행에서도 없는 끝부분을 조회하거나 8개 기록을 모두 지운 뒤에는 점수 0과 빈 후보를 얻었습니다. 이 결과는 제안할 글이 없다는 뜻입니다. 다음 절에서 이 경우의
            작은 비용까지 시간 장부에 남기겠습니다.
          </p>
</div>
<CodeViewButton label="현재 요청과 전역 기록의 실제 조회" onClick={() => sidebar.open("suffix-wrapper", codeRefs["suffix-wrapper"])}/><CodeViewButton label="요청 종료와 출력 기록 반환의 원문" onClick={() => sidebar.open("suffix-state", codeRefs["suffix-state"])}/>
</section>
<section id="hybrid-cost" data-teach-level="6" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">23. 조회 후 다른 모델로 넘어가면 앞 비용도 더합니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            후보가 없는 경우를 단독 생성과 비교하겠습니다. 원래 한 글자에 25ms, 검색에 .02ms가 들고 그 밖의 일이 같다고 가정하면 새 시간은 25.02ms입니다. 개선 비
            25/25.02≈.9992이므로 아주 작지만 손해입니다. cache miss를 자동으로 무비용이라고 부를 수 없습니다. (가정)
          </p>
<p className="leading-8">논문은 suffix 점수가 문턱보다 높으면 그 후보를 쓰고 그렇지 않으면 모델 기반 후보로 넘어가는 hybrid 방법도 설명합니다. 후자에서는 이미 쓴 검색 시간과 새 draft 시간을 함께 포함해야 합니다. 점수가 실제 수락 길이를 얼마나 잘 예상하는지도 부하와 입력 분포에서 확인합니다.</p>
<p className="leading-8">
            두 종류의 회차가 60%와 40% 있다고 합시다. 첫 종류는 10ms에 4개, 둘째는 20ms에 2개를 확정합니다. 평균 출력은 3.2개, 평균 시간은 14ms입니다. 단독
            25ms를 기준으로 한 전체 개선 비는 3.2×25/14≈5.7143입니다. (가정)
          </p>
<p className="leading-8">
            각 회차의 개선 비 10과 2.5를 비중대로 평균하면 7이지만 전체 처리 시간의 비와는 다릅니다. 실제 합산 시간과 실제 확정 수를 비교해야 합니다. 종료·대기·조회
            갱신·fallback 비용이 다르면 그 항목을 포함해 같은 장부를 다시 만듭니다.
          </p>
</div>

</section>
<section id="paper-evidence" data-teach-level="6" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">24. 논문의 배율은 해당 모델과 입력에서 읽습니다</h2>
<p className="leading-8">앞에서 가정한 시간과 논문의 실험 배율은 따로 읽습니다. 모델·입력·생성 규칙이 다르면 같은 방법이라도 배율이 달라집니다. 특히 한 글자 생성 시간과 외부 작업까지 포함한 전체 실행 시간은 비교 분모가 다릅니다.</p>
<ProgressiveDetail title="각 논문의 보고 배율은 어떤 조건에서 나왔을까요?" preview="모델과 입력별 실험 수치를 그대로 보존했습니다. 이 결과를 층 수나 후보 수만으로 유도한 보편 배율로 쓰지 않습니다."><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            LayerSkip v4는 학습 방법을 적용한 Llama 계열에서 CNN/DM 요약 최대 2.16배, 코드 1.82배, TOPv2 의미 분석 2.0배를 보고합니다. 저자
            자기보고이며 층 수 비율로 유도한 배율이 아닙니다. 별도 가중치 부담을 줄이고 앞 층의 상태를 재사용하는 기여와 어느 checkpoint에서 유효한지를 함께 읽습니다.
          </p>
<p className="leading-8">
            DeepSeek-V3 v2의 5.4.3절은 추가로 예측한 둘째 token의 수락률 85~90%와 TPS 1.8배를 보고합니다. 이 보고를 앞의 가정 c=.016과 숫자가
            비슷하다는 이유로 검증 비용 1의 증거로 사용할 수 없습니다. 모듈 구조·학습 목표와 실제 배치의 시간을 별도로 확인해야 합니다.
          </p>
<p className="leading-8">
            Medusa v3는 별도 draft 모델의 부담을 줄이는 head와 tree 검증을 제시합니다. Medusa-1은 backbone을 고정하고 Medusa-2는 함께 조정합니다.
            Table 2의 Vicuna-7B 속도 비 2.18과 2.83은 해당 학습·생성·평가 설정의 보고이며 typical acceptance의 품질 결과를 포함합니다.
          </p>
<p className="leading-8">
            SpecInfer v4의 작은 제안 모델을 뜻하는 SSM은 여기서 state-space model이라는 다른 구조의 약어가 아닙니다. 논문은 tree 확장·병합과 위상에 맞는
            검증을 제시하며 분산 추론 1.5~2.8배, offloading 2.6~3.5배를 보고합니다. Table 1의 70→89%는 CIP의 greedy top-1→top-5 행이며
            모든 깊이의 보편 수락률이 아닙니다.
          </p>
<p className="leading-8">
            SuffixDecoding v3는 2025년 10월 7일 수정본입니다. Figure 4의 Llama-3.1-8B-Instruct, 단일 H100, batch 1에서
            AgenticSQL 평균 5.3배와 평균 수락 6.3개를 보고합니다. Spec-Bench처럼 반복이 적은 입력에서는 suffix 단독보다 모델 기반 방법이 더 나은 결과도 함께
            제시합니다.
          </p>
<p className="leading-8">
            SWE-Bench의 4.5배는 OpenHands를 실제 실행하고 prefill·생성·외부 작업까지 포함한 별도 end-to-end 평가의 최대 개선입니다. Figure 4의
            decode 비교 2.5배와 같은 측정 범위가 아닙니다. token당 약 20µs의 후보 준비 보고도 가정한 25ms와 조합해 실제 전체 상한 6.2배가 증명된 것처럼 쓰지
            않습니다.
          </p>
</div></ProgressiveDetail>
<span id="paper-layerskip"/><span id="paper-deepseek-v3-mtp"/><span id="paper-medusa"/><span id="paper-specinfer"/><span id="paper-suffix-decoding"/><CitationBlock citeKey={25} source="Medusa v3 — §3.3 and Table 2" href="https://arxiv.org/html/2401.10774v3">가정한 RAY의 정확성과 저자 보고의 생성 품질·속도는 서로 다른 확인 대상입니다.</CitationBlock><CitationBlock citeKey={26} source="SuffixDecoding v3 — Figure 4 and §4.3" href="https://arxiv.org/html/2411.04975v3">같은 논문 안에서도 decode 시간과 전체 agent 작업 시간이 다른 분모를 사용합니다.</CitationBlock>
</section>
<section id="boundary" data-teach-level="7" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">25. 같은 출력 규칙과 같은 시간 범위에서 선택합니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            후보의 출처와 tree의 모양을 독립 축으로 보세요. 앞 층을 재사용한다고 언제나 빠르지 않고 후보를 넓힌다고 언제나 많이 확정하지도 않습니다. 같은 RAY를 만들면서 어느
            입력과 기록을 추가했는지부터 세면 비용과 정확성을 따로 확인할 수 있습니다.
          </p>
<p className="leading-8">같은 sampler·checkpoint·어휘·위치 처리와 수치 정밀도를 고정해야 검증 결과를 비교할 수 있습니다. tree mask가 수학적으로 같은 앞 글을 보여 주어도 부동소수점 연산 경로까지 bitwise로 같다는 보장은 별도입니다. 길이 제한과 종료 신호가 오면 평균 확정 길이도 잘립니다.</p>
<p className="leading-8">여기서는 원문 Medusa의 배열·greedy 함수 AST와 작은 배열 대역, Arctic의 실제 C++ 자료 구조, 별도 Python wrapper 분기를 실행했습니다. LayerSkip의 전체 모델 forward와 GPU 성능은 실행하지 않았습니다. 원문 코드와 가정 수치의 역할을 나누어 기록했습니다.</p>
<p className="leading-8">실제 배포에서는 단독 생성과 후보 준비·확인·기록 정리의 시간을 같은 요청 분포에서 재어 비교합니다. 가중치 읽기의 공유, 늘어난 계산·KV·동기화와 대기열을 함께 봅니다. 하나의 평균 배율만으로 처리량이나 최악 지연의 개선을 보장하지 않습니다.</p>
</div>
<p className="leading-8">한 줄 후보의 정확한 수락·잔여 분포 유도는 <Link to="/cs/ai/vllm-spec-decode#distribution-proof">추측 디코딩의 확률 복원</Link>에서 이어집니다. 계산 기록 한 자리의 크기는 <Link to="/cs/ai/kv-cache-fundamentals">KV cache의 구조</Link>, 연산과 읽기 비용의 차이는 <Link to="/cs/ai/prefill-decode-phase-dynamics">입력 처리와 생성의 비용</Link>에서 더 살펴볼 수 있습니다.</p>
</section>
<section id="prediction-questions" data-teach-level="review" className="mb-16 scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">26. 같은 RAY에서 조건을 하나씩 바꿔 보세요</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            왜 일곱 자리의 읽기 표에는 17개, root를 뺀 여섯 자리에는 10개의 허용 칸이 있을까요? 이 수가 실제 GPU 연산 수와 같지 않을 수 있는 이유도 설명해 보세요.
            (답: 8절)
          </p>
<p className="leading-8">원문 Medusa에서 경로 [0,1,4]를 골랐습니다. 왜 KV는 [4,5,8]에서 [4,5,6]으로 옮기고 이번 출력에는 다음 C를 붙이지 않을까요? (답: 11절)</p>
<p className="leading-8">
            수락률 .85와 후보 비용 .016이 같아도 검증 비용이 2로 늘면 왜 손해일까요? batch 모형에서 .5가 이득의 마지막 경계가 아닌 이유도 예상해 보세요. (답: 18절)
          </p>
</div>

</section><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{medusa:{id:"medusa",label:"Medusa e2a5d20",badgeClass:"bg-primary/10 border-primary text-primary"},layerskip:{id:"layerskip",label:"LayerSkip 494752e5",badgeClass:"bg-primary/10 border-primary text-primary"},arctic:{id:"arctic",label:"ArcticInference aca5d9a8",badgeClass:"bg-primary/10 border-primary text-primary"}}}/></>;}
