import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ContentBoundary from "@/components/articles/content-boundary";
import { Link } from "react-router-dom";
import { codeRefs } from "./codeRefs";
import { fileTrees } from "./fileTree";
import TreeTraceViz from "./viz/TreeTraceViz";
import MtpCostViz from "./viz/MtpCostViz";
import MaskTable from "./MaskTable";
import TermBreakdown from "@/components/articles/term-breakdown";
import ProgressiveDetail from "@/components/articles/progressive-detail";

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return <>
    <section id="overview" data-teach-level="S" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">1. 결론부터: 큰 모델의 한 번 검증으로 여러 토큰을 확정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8"><strong>이 글의 범위:</strong> 공통 검증 원리를 짧게 복습한 뒤, 후보를 만드는 방법과 후보 모양이 달라질 때 비용이 어떻게 바뀌는지 비교합니다. 첫 거부 뒤 후보를 버리는 이유, 원래 분포를 지키는 계산, vLLM의 KV 갱신부터 보려면 <Link to="/cs/ai/vllm-spec-decode">추측 디코딩 기본 원리와 vLLM 구현</Link>부터 읽으면 됩니다.</p>
        <p className="leading-8"><strong>이 기술은 작은 모델이 답을 대신 쓰는 기술이 아닙니다. 작은 부품이 미리 쓴 후보를 큰 모델이 한 번에 검사하고, 맞은 토큰 여러 개를 확정해 큰 모델의 순차 생성 횟수를 줄이는 기술입니다.</strong></p>
        <p className="leading-8">이 한 문장은 곧 질문을 낳습니다. 큰 모델은 앞 토큰을 알아야 다음 토큰을 고를 수 있는데, 후보가 있다고 어떻게 여러 단계를 한꺼번에 확인할 수 있을까요? 2절에서 생성 순서가 바뀌는 이유를 보고, 3절에서 R·A·Y 세 토큰을 실제 한 회차에 넣어 보겠습니다.</p>
        <p className="leading-8">그다음에는 후보가 틀릴 때 무엇이 버려지는지, 후보를 만드는 시간까지 넣어도 정말 빨라지는지 묻겠습니다. 여러 변형은 이 두 문제에 답하려고 생겼습니다.</p>
      </div>
    </section>

    <section id="black-box" data-teach-level="B" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2. 왜 여러 토큰을 확정하면 생성 횟수가 줄어들까요?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">세 토큰을 평소대로 만들면 큰 모델 실행이 세 번 이어집니다. 첫 실행의 결과가 둘째 실행의 입력이 되고, 둘째 결과가 셋째 입력이 되기 때문입니다. 앞 실행이 끝나기 전에는 뒤 실행을 시작할 수 없습니다.</p>
        <p className="leading-8">후보를 미리 준비하면 순서가 달라집니다. 먼저 값싼 부품이 세 토큰을 씁니다. 큰 모델은 후보가 가정한 세 위치를 한꺼번에 계산합니다. 마지막으로 앞에서부터 큰 모델의 선택과 같은 토큰만 문장에 붙입니다.</p>
        <p className="leading-8">큰 모델이 세 토큰을 모두 승인하면 비싼 실행 한 번으로 세 토큰이 확정됩니다. 둘째 토큰에서 어긋나면 첫 토큰까지만 남기므로 다음 회차가 더 필요합니다. 결국 속도는 한 번에 몇 토큰이 살아남는지와 그 한 번에 든 전체 시간으로 정해집니다.</p>
        <p className="leading-8">한 번의 검증 안에는 세 위치의 계산이 들어가므로 계산량은 한 위치보다 큽니다. 그래도 짧은 생성에서는 거대한 모델 가중치를 GPU 메모리에서 읽어 오는 시간이 큰 몫을 차지합니다. 여러 위치를 작은 묶음으로 계산하면 한 층의 가중치를 가져온 뒤 여러 위치에 사용할 수 있어, 세 위치를 따로 세 번 실행할 때보다 벽시계 시간이 덜 늘어날 수 있습니다.</p>
        <p className="leading-8">이미 많은 요청을 한꺼번에 처리해 GPU 계산 자리가 차 있거나 후보 갈래가 너무 넓으면, 추가 위치가 거의 그대로 추가 시간으로 바뀝니다. 따라서 “검증 한 번”을 “한 토큰과 같은 비용”으로 놓지 않고, 실제 batch와 후보 수에서 검증 시간을 다시 재야 합니다.</p>
        <p className="leading-8">따라서 핵심은 “작은 모델이 얼마나 빨리 글을 쓰는가” 하나가 아닙니다. <strong>후보 준비 → 큰 모델 검증 → 승인한 기록 정리</strong>의 합이, 같은 수의 토큰을 큰 모델이 차례로 만드는 시간보다 짧아야 합니다.</p>
      </div>
      <figure data-viz className="not-prose my-8 min-w-0 border-y border-border/70 py-6">
        <figcaption className="text-base font-bold">세 토큰을 만들 때 큰 모델이 가중치를 읽는 순서</figcaption>
        <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
          <article className="min-w-0 rounded-xl border border-border/70 bg-card p-4">
            <p className="text-xs font-bold text-primary">평소 생성 · 세 번 기다림</p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              <li>1. 가중치를 읽고 R 한 자리를 계산</li>
              <li>2. 가중치를 다시 읽고 A 한 자리를 계산</li>
              <li>3. 가중치를 다시 읽고 Y 한 자리를 계산</li>
            </ol>
          </article>
          <article className="min-w-0 rounded-xl border border-border/70 bg-card p-4">
            <p className="text-xs font-bold text-primary">후보 검증 · 한 번 기다림</p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              <li>1. 값싼 부품이 R·A·Y 후보를 준비</li>
              <li>2. 가중치를 읽어 세 위치를 한 묶음으로 계산</li>
              <li>3. 앞에서부터 맞은 토큰만 확정</li>
            </ol>
          </article>
        </div>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">한 묶음의 계산량은 늘지만 가중치를 읽고 실행을 시작하는 일을 덜 반복할 수 있습니다. 실제 이득은 12절의 전체 시간 장부로 확인합니다.</p>
      </figure>
    </section>

    <section id="small-case" data-teach-level="0" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">3. R·A·Y 세 토큰을 한 번의 큰 모델 실행으로 확인합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">이미 네 토큰을 확정했다고 합시다. 값싼 부품은 다음 세 토큰으로 R·A·Y를 제안합니다. 평소 방식이라면 큰 모델은 R을 고르는 실행, R 뒤의 A를 고르는 실행, RA 뒤의 Y를 고르는 실행을 차례로 해야 합니다. 이 글에서 <strong>가정</strong> 표시는 논문 측정값이 아니라 설명을 위해 정한 입력과 숫자라는 뜻입니다.</p>
        <p className="leading-8">인과 언어 모델은 마지막으로 읽은 자리에서 다음 토큰의 점수를 냅니다. 앞 회차가 네 번째 토큰을 처리했을 때 이미 다섯 번째 자리의 점수를 만들었고, 생성 loop는 그 값을 다음 회차까지 보관합니다. 그래서 새 검증은 그 점수로 첫 후보 R부터 확인할 수 있습니다.</p>
        <p className="leading-8">이번에는 R·A·Y를 한 입력에 놓고 큰 모델을 한 번 실행합니다. 보관한 점수는 R을 확인하고, 이번 실행에서 R 자리의 계산은 A를, A 자리의 계산은 Y를 확인합니다. 셋이 연속으로 맞으면 큰 모델이 R·A·Y를 읽은 계산 기록도 함께 얻으므로 세 토큰을 문장에 붙일 수 있습니다.</p>
        <p className="leading-8">여기서 <strong>계산 기록</strong>은 앞 토큰을 다시 처음부터 계산하지 않도록 각 층이 남긴 key와 value입니다. 다음 회차는 이 기록을 앞 문장으로 삼아 이어서 계산합니다. 틀린 후보의 기록을 넘기면 실제로 확정되지 않은 문장을 읽게 되므로 승인한 경로의 기록만 남겨야 합니다. 이 기록의 정식 이름은 6절에서 붙이겠습니다.</p>
        <p className="leading-8">만약 큰 모델이 R 다음에는 A를 고르지만 RA 다음에는 X를 고른다면 R과 A까지만 남깁니다. 틀린 Y 뒤의 후보는 맞더라도 사용할 수 없습니다. 문장은 앞에서부터 이어지므로 첫 불일치 뒤를 건너뛰어 확정할 수 없기 때문입니다.</p>
        <p className="leading-8">여기서 첫 번째 한계가 드러납니다. 후보를 길게 준비하면 잘 맞을 때는 이득이 크지만, 앞부분이 틀리면 뒤에서 계산한 후보가 함께 버려집니다.</p>
      </div>
    </section>

    <section id="structure" data-teach-level="1" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">4. 후보를 길게 쓸수록 첫 오답 뒤가 모두 버려집니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">한 줄 R·A·X만 준비했는데 큰 모델의 선택이 R·A·Y라면 마지막 자리에서 멈춥니다. R 뒤에 A와 B를 모두 준비하고, 두 갈래 아래에 X와 Y를 준비했다면 같은 검증에서 R·A·Y 경로를 찾을 수 있습니다. 첫 후보 하나에 모든 다음 계산을 거는 위험을 여러 갈래로 나눈 셈입니다.</p>
        <p className="leading-8">하지만 갈래를 넓히면 큰 모델이 확인할 자리도 늘어납니다. 한 줄 세 자리 대신 시작점 하나, 다음 후보 둘, 그다음 후보 넷을 놓으면 새로 계산할 자리가 일곱 개가 됩니다. 세 토큰을 얻으려고 일곱 자리를 계산하는 셈입니다. (가정)</p>
        <p className="leading-8">그래서 후보를 많이 만드는 것 자체가 목표는 아닙니다. 적은 추가 비용으로 큰 모델이 승인할 가능성을 높여야 합니다. 이 문제 때문에 구현들은 후보를 만드는 곳과 후보를 펼치는 모양을 서로 다르게 고릅니다.</p>
      </div>
    </section>

    <section id="why-components" data-teach-level="2" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">5. 바꿀 수 있는 곳은 후보의 출처와 후보의 모양 두 곳입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">첫 번째 선택은 <strong>누가 후보를 쓰는가</strong>입니다. 별도의 작은 모델을 쓸 수도 있고, 큰 모델의 앞부분만 먼저 쓸 수도 있습니다. 학습할 때 붙인 예측 부품이나 이전 출력에서 찾은 반복 구간도 후보를 만들 수 있습니다.</p>
        <p className="leading-8">두 번째 선택은 <strong>후보를 어떤 모양으로 준비하는가</strong>입니다. 한 줄로 길게 쓸 수도 있고 여러 갈래로 펼칠 수도 있습니다. 한 줄은 확인할 자리가 적지만 첫 오답 뒤를 잃습니다. 여러 갈래는 맞는 길을 포함할 가능성이 커지지만 확인 비용도 커집니다.</p>
        <p className="leading-8">어떤 방법을 쓰더라도 큰 모델의 확인은 남습니다. 후보가 싸다는 이유로 그대로 출력하면 큰 모델이 만들 답과 달라질 수 있습니다. 승인한 경로의 계산 기록만 다음 회차에 넘기는 일도 필요합니다.</p>
        <p className="leading-8">이제 전체 그림이 생겼습니다. 여러 변형은 서로 다른 마법이 아니라, 후보의 출처와 모양을 바꿔 <strong>한 번의 큰 모델 실행에서 살아남는 토큰 수</strong>를 늘리려는 선택입니다.</p>
      </div>
    </section>

    <section id="names" data-teach-level="3" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">6. 이 과정을 추측 디코딩이라고 부릅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">지금까지는 이름 없이 동작부터 보았습니다. 후보를 싸게 만드는 단계는 <strong className="whitespace-nowrap">초안(draft)</strong>입니다. 최종 결정을 내리는 큰 모델은 <strong className="whitespace-nowrap">기준 모델(target)</strong>입니다. 후보가 검사를 통과하면 <strong className="whitespace-nowrap">수락(acceptance)</strong>했다고 합니다. 이 전체 방식은 <strong className="whitespace-nowrap">추측 디코딩(speculative decoding)</strong>입니다.</p>
        <p className="leading-8">4절에서 본 여러 갈래 후보는 <strong className="whitespace-nowrap">후보 트리(token tree)</strong>입니다. 각 자리가 자기 앞 경로만 읽게 하는 표는 <strong className="whitespace-nowrap">어텐션 마스크(attention mask)</strong>입니다. 3절의 키·값 계산 기록은 <strong className="whitespace-nowrap">KV 캐시(cache)</strong>입니다.</p>
        <p className="leading-8">각 이름의 작은 예와 구분할 경계는 아래에 모았습니다. 새 원리를 더하는 목록이 아니라, R·A·Y 사례에서 이미 본 부분을 짧게 가리키는 손잡이입니다.</p>
      </div>
      <ProgressiveDetail title="R·A·Y 사례의 용어를 한 번에 확인하기" preview="draft·target·acceptance·후보 갈래·읽기 허용 표·앞 계산 기록을 사례와 연결합니다." label="용어가 필요할 때 펼쳐 읽기">
      <TermBreakdown title="앞에서 본 역할에 이름을 붙입니다" description="각 용어가 R·A·Y 사례의 어느 부분을 가리키는지 함께 읽으세요." items={[
        { term: "speculative decoding · 추측 디코딩", description: "값싼 방법이 다음 토큰 후보를 먼저 만들고 target model이 여러 후보를 함께 검증하는 생성 방식입니다.", example: "R·A·Y를 미리 제안하고 큰 모델 한 번으로 연속 일치를 확인합니다.", boundary: "후보를 그대로 출력하는 방식이 아닙니다." },
        { term: "draft · 후보 생성", description: "큰 모델보다 싸게 다음 토큰 후보를 만드는 단계나 부품입니다.", example: "작은 모델, 앞쪽 layer, MTP module, 과거 출력 검색이 이 역할을 맡을 수 있습니다." },
        { term: "target · 최종 기준 모델", description: "실제로 내보낼 토큰을 승인하는 큰 모델입니다.", example: "R 다음 A, RA 다음 Y가 맞는지 확인합니다." },
        { term: "acceptance · 수락", description: "draft 후보가 target의 선택 규칙을 통과해 확정되는 일입니다.", example: "RAY에서 세 토큰이 연속으로 살아남습니다." },
        { term: "token tree · 후보 갈래", description: "한 위치에 후보를 여러 개 두고 다음 후보까지 부모와 자식으로 연결한 구조입니다.", example: "R 아래 A·B, 그 아래 X·Y를 둡니다." },
        { term: "attention mask · 읽기 허용 표", description: "한꺼번에 계산한 각 후보가 자기 앞 경로만 읽도록 제한합니다.", example: "RA 뒤의 Y는 RB의 B를 읽지 않습니다." },
        { term: "KV cache · 앞 계산 기록", description: "다음 토큰 계산에 다시 쓸 key와 value를 위치별로 보관합니다.", example: "승인한 R·A·Y의 기록만 연속 위치로 모읍니다." },
      ]} />
      <ContentBoundary article="speculative-decoding-variants" />
      </ProgressiveDetail>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">이 이름을 사용해 다음 절에서는 후보 일곱 자리를 한 번 검증하고, 승인된 R·A·Y의 계산 기록만 다음 회차로 넘기는 과정을 따라갑니다.</p>
      </div>
    </section>

    <section id="request-trace" data-teach-level="4" className="mb-16 scroll-mt-20">
      <span id="tree" />
      <span id="tree-verify" />
      <h2 className="mb-6 text-2xl font-bold">7. 일곱 후보에서 RAY 한 경로만 확정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">처음 네 자리의 계산은 끝났고, R은 이번 회차에 새로 확인할 시작 토큰이며, 중간에 종료 신호는 없다고 두겠습니다. 후보를 [R,A,B,X,Y,X,Y] 순서로 펼치면 큰 모델이 실제로 고른 경로는 R→A→Y입니다. 저장 목록에서는 [0,1,4]에 떨어져 있지만 문장에서는 연속된 세 자리입니다. (가정)</p>
        <p className="leading-8">큰 모델은 일곱 자리를 한 번 계산하되 각 자리가 자기 조상만 보게 합니다. A 아래의 Y는 R과 A를 읽고, B 아래의 Y는 R과 B를 읽습니다. 글자 Y가 같아도 앞 문장이 다르므로 두 계산 기록은 서로 바꿔 쓸 수 없습니다.</p>
        <p className="leading-8">확인이 끝나면 [0,1,4]에 해당하는 기록만 꺼내 기존 문장 뒤의 연속된 세 칸에 놓습니다. 이 과정을 거쳐야 다음 회차가 RAY를 실제 앞 문장으로 읽습니다. 나머지 갈래는 계산했어도 문장과 기록에서 버립니다.</p>
        <p className="leading-8"><strong>중간 결론은 간단합니다.</strong> 여러 후보를 함께 계산하는 이유는 모두 출력하려는 것이 아니라, 큰 모델 실행 한 번에서 연속으로 승인할 경로 하나를 길게 찾기 위해서입니다.</p>
      </div>
      <TreeTraceViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">후보 트리를 넓히면 RAY처럼 살아남는 경로를 포함할 가능성은 커집니다. 동시에 큰 모델이 확인할 입력 수도 늘어납니다. 깊이 3에서 폭을 3·2·2로 잡으면 후보는 21개이고 시작점까지 22자리를 확인합니다. 따라서 확정 길이와 전체 검증 시간을 함께 재야 하며, 아래 원문 추적 뒤 12절에서 같은 시간 장부에 넣습니다. (가정)</p>
      </div>
      <ProgressiveDetail title="실제 Medusa 배열·mask·KV 이동까지 보기" preview="7×7 표의 17칸, 후보 행 선택, KV [4,5,8]→[4,5,6]을 원문 코드와 맞춥니다.">
        <span id="mask" />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            같은 RAY에서 A쪽 Y는 root R, A, 자신만 봅니다. B나 B쪽 Y를 허용하면 서로 다른 문장을 섞습니다. 앞의 네 자리 기록은 별도로 읽을 수 있다고 두고 새
            입력끼리의 7×7 표부터 확인합니다.
          </p>
<p className="leading-8">일반적인 일곱 자리 문장을 한 줄로 읽으면 아래 삼각형의 1+2+⋯+7=28칸을 엽니다. 이번 가지 구조는 깊이별로 1, 2, 3칸만 열어 총 17칸입니다. root를 제외한 6×6 영역은 10칸이며 일반 여섯 자리의 21칸과 다릅니다.</p>
<p className="leading-8">마스크의 허용 칸 수는 실제 GPU 연산 수가 아닙니다. 0인 칸을 가려도 구현이 조밀한 행렬곱을 그대로 수행할 수 있습니다. 메모리 접근·kernel 방식·이미 있던 prefix 길이를 함께 보아야 비용을 알 수 있습니다.</p>
</div>
<MaskTable/><CodeViewButton label="실제 읽기 제한 적용 코드" onClick={() => sidebar.open("mask-apply", codeRefs["mask-apply"])}/>
        <span id="buffers" />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">Medusa commit e2a5d20의 generate_medusa_buffers에 선택 경로 [0], [1], [0,0], [0,1], [1,0], [1,1]을 넣습니다. 대괄호의 값은 글자 ID가 아니라 각 예측 부품이 낸 후보의 순위입니다. A·B와 X·Y를 각각 첫째·둘째 후보라고 둔 사례입니다.</p>
<p className="leading-8">함수는 길이와 순위로 정렬한 뒤 root 한 칸을 더합니다. 자기 칸을 열고 모든 node의 root 칸을 연 뒤 조상 번호를 찾아 추가합니다. 그 결과가 앞의 17칸입니다. 원본 함수 AST를 작은 CPU 배열 대역과 실행해 같은 표를 확인했습니다.</p>
<p className="leading-8">상대 위치 번호는 [0,1,1,2,2,2,2]입니다. tree_decoding은 여기에 이미 확정한 길이 4를 더해 [4,5,5,6,6,6,6]을 사용합니다. 같은 깊이의 A와 B가 같은 문장 위치를 받는 이유가 코드에 드러납니다.</p>
<p className="leading-8">고정 코드의 TOPK는 10입니다. 후보를 모아 둔 배열에서 꺼낼 번호는 [0,1,2,11,12,11,12]가 됩니다. 마지막 네 node가 같은 두 head 출력을 재사용해도 target에서 읽을 경로와 KV는 서로 다릅니다. 이 10을 이 예의 tree 크기나 모든 Medusa 설정의 한도로 읽지 않습니다.</p>
</div>
<CodeViewButton label="mask·위치·경로 배열을 만드는 실제 함수" onClick={() => sidebar.open("buffers", codeRefs["buffers"])}/><CodeViewButton label="새 root와 후보를 모으는 원문" onClick={() => sidebar.open("root", codeRefs["root"])}/><CodeViewButton label="같은 깊이의 위치 번호를 적용하는 원문" onClick={() => sidebar.open("tree-forward", codeRefs["tree-forward"])}/>
        <span id="greedy" />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">evaluate_posterior의 temperature 0 분기는 candidates의 둘째 칸부터 부모 위치의 argmax와 비교합니다. RAY 행의 비교 결과는 [1,1]이고 RAX는 [1,0]입니다. 처음이 B인 두 행은 [0,1]이어도 첫 실패 뒤를 확정할 수 없습니다.</p>
<p className="leading-8">각 행의 비교값을 앞에서부터 곱하는 cumprod를 적용하면 [0,1]은 [0,0]이 됩니다. 이후 합으로 연속 일치 길이를 구합니다. RAY의 2가 최대이므로 원문 순서의 행 번호 2를 선택합니다.</p>
<p className="leading-8">이 검산은 가정한 점수를 넣어 실제 함수의 greedy 분기를 실행한 것입니다. PyTorch 대신 작은 Python 배열 대역을 사용했으며 모델 forward나 GPU를 실행하지 않았습니다. 함수 제어와 인덱스를 확인한 결과를 실제 언어 모델의 성능 재현이라고 부르지 않습니다.</p>
</div>
<CodeViewButton label="첫 불일치 뒤를 제외하는 실제 함수" onClick={() => sidebar.open("greedy", codeRefs["greedy"])}/>
        <span id="commit" />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">update_inference_inputs는 선택 행의 retrieve_indices에서 accept_length+1개를 꺼냅니다. root를 포함하기 때문에 2+1입니다. [0,1,4]에 기존 길이 4를 더해 실제 KV 위치 [4,5,8]을 얻습니다.</p>
<p className="leading-8">그 위치의 값을 임시로 읽은 뒤 기존 글 바로 뒤의 [4,5,6]에 copy_합니다. current_length도 7로 갱신합니다. 이번 구현은 block table만 바꾸는 방식이 아니며 서로 떨어진 경로의 기록을 실제로 모읍니다.</p>
<p className="leading-8">출력 목록에 RAY를 붙인 길이와 유효 KV 길이가 둘 다 7입니다. 함수는 Y 자리의 logits를 남겨 다음 바퀴에서 C를 고르게 합니다. 여기서 C를 이번 bonus로 추가했다고 적으면 출력과 저장 시점이 모두 한 칸 어긋납니다.</p>
<p className="leading-8">SpecInfer의 논문 Algorithm 2는 이미 확인된 root에서 자식 경로를 따라가고 마지막 선택을 붙이는 서술을 사용합니다. root를 새로 선택해 출력에 포함하는 이 Medusa 함수와 한 바퀴의 경계가 다릅니다. 같은 생성 원리를 비교할 때도 root·bonus·유효 KV의 포함 범위를 먼저 맞춥니다.</p>
</div>
<CodeViewButton label="선택한 KV를 복사하고 길이를 갱신하는 원문" onClick={() => sidebar.open("commit", codeRefs["commit"])}/><CitationBlock citeKey={11} source="SpecInfer v4 — Algorithm 2, VerifyGreedy" href="https://arxiv.org/html/2305.09781v4">논문 17–22행의 root와 마지막 추가 위치를 작은 RAY 경로에 대응하면 구현별 회차 경계를 구별할 수 있습니다.</CitationBlock>
      </ProgressiveDetail>
    </section>

    <section id="variants" data-teach-level="5" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">8. 변형마다 어느 비용을 줄이고 무엇을 더 내는지 따로 봅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">기본 방식은 별도의 작은 초안 모델이 후보를 씁니다. 모델을 두 벌 올리면 가중치와 운영 부담이 늘고, 초안 모델의 선택이 기준 모델과 자주 다르면 첫 오답 뒤 후보를 버립니다. 그래서 변형은 후보의 출처나 모양을 바꿉니다.</p>
        <p className="leading-8">이름만 모아 놓으면 무엇이 달라졌는지 알기 어렵습니다. 다음 세 절은 모두 앞의 R·A·Y 사례로 돌아갑니다. LayerSkip은 같은 모델의 앞층을 초안으로 쓰고, MTP는 학습 때 붙인 미래 예측 부품을 다시 쓰며, SuffixDecoding은 과거 출력에서 반복 구간을 찾습니다.</p>
        <p className="leading-8">각 절에서 후보를 만든 경로, 큰 모델이 그대로 해야 하는 일, 새로 생기는 상태와 실패 비용을 끝까지 확인합니다. 이 내용을 알아야 마지막 시간 장부에서 세 방법을 같은 기준으로 비교할 수 있습니다.</p>
      </div>
    </section>

    <section id="layer-skip" data-teach-level="5" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">9. LayerSkip은 모델 두 벌 대신 같은 모델의 앞층과 뒷층을 나눕니다</h2>
      <span id="self-speculative" />
      <span id="self-source" />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8"><strong>LayerSkip은 별도 초안 모델 대신 같은 모델의 앞층에서 후보를 만들고 뒷층에서 검증합니다.</strong> 그래서 모델 가중치를 두 벌 올리는 부담을 줄일 수 있습니다.</p>
<p className="leading-8">그러면 아무 모델이나 중간층에서 빠져나오면 될까요? 일반 체크포인트는 중간층이 좋은 토큰을 내도록 학습되지 않았습니다. LayerSkip은 뒤쪽 층을 더 자주 건너뛰게 학습하고, 중간층 출력에도 학습 목표를 줍니다. 읽을 수 있는 중간 상태와 쓸 만한 후보를 내는 중간 상태는 다릅니다.</p>
<p className="leading-8">RAY라는 같은 글을 이어 쓰되 이 구현의 회차 시작을 맞추겠습니다. 이번에는 R을 이미 출력했지만 R의 KV는 아직 없다고 둡니다. 기존 네 자리 기록 뒤에서 앞 층이 R을 읽어 A를, 다시 A를 읽어 Y를 제안합니다. 그 과정의 중간 상태를 저장해 뒤 층에서 재사용합니다.</p>
</div>
<CitationBlock citeKey={15} source="LayerSkip v4 — §4.1–4.3" href="https://arxiv.org/html/2404.16710v4">같은 R·A·Y의 앞 층 상태를 저장하는 이유를 논문의 self-drafting·verification·cache reuse에 연결합니다.</CitationBlock>
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
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">32층 가운데 8층에서 후보를 낸다고 해서 후보 시간이 자동으로 전체의 25%가 되지는 않습니다. 앞층 상태 저장, 마지막 후보 입력, 나머지 24층의 병렬 검증과 KV 정리가 남기 때문입니다. exit 깊이를 고를 때는 후보 시간·연속 수락 길이·검증 시간·추가 상태 메모리를 함께 재야 합니다.</p>
        <p className="leading-8"><strong>선택 경계는 분명합니다.</strong> 별도 초안 모델의 가중치와 운영 비용이 부담이고, 중간층에서도 잘 예측하도록 학습된 체크포인트가 있으며, 저장한 앞층 상태를 재사용한 전체 회차가 더 짧을 때 LayerSkip이 후보가 됩니다.</p>
      </div>
    </section>

    <section id="mtp" data-teach-level="5" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">10. MTP는 이미 고른 토큰과 앞 상태로 다음 후보를 만듭니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8"><strong>DeepSeek-V3의 MTP는 앞 깊이의 상태와 방금 고른 토큰을 합쳐 그다음 후보를 차례로 만듭니다.</strong> 학습할 때 더 먼 미래도 예측하도록 붙인 순차 모듈을 추론 때 다시 쓰는 방식입니다.</p>
<p className="leading-8">왜 같은 마지막 상태에서 미래 여러 자리를 바로 읽지 않고 방금 고른 토큰을 다시 넣을까요? 둘째 미래 토큰은 첫째 미래 토큰에 따라 달라집니다. 기존 네 자리의 마지막 상태가 R을 골랐다면 첫 모듈은 그 상태와 R의 embedding을 함께 받아 A를 예측합니다. 둘째 깊이는 앞 깊이의 상태와 A를 받아 더 뒤를 예측합니다.</p>
<p className="leading-8">실제 모듈은 이전 깊이의 상태와 바로 다음 토큰의 embedding을 각각 정규화해 이어 붙인 뒤 선형 투영으로 합칩니다. 그 결과를 Transformer block에 넣고 공유 output head로 그다음 글자의 분포를 만듭니다.</p>
<p className="leading-8">보고서의 식(21)은 두 d차원 벡터를 이어 2d로 만든 뒤 d×2d 행렬로 다시 d차원으로 보냅니다. 식(22)의 block과 식(23)의 공유 head가 이어집니다. 이 차원을 맞추면 네 부품의 역할과 다음 토큰 정보가 들어가는 위치를 실제 수식에서 찾을 수 있습니다.</p>
<p className="leading-8">
            Medusa의 여러 head는 같은 마지막 hidden state에서 서로 다른 미래 위치의 후보를 냅니다. DeepSeek-V3의 순차 모듈과 학습·입력 관계가 같다고 읽으면
            안 됩니다. MTP라는 학습 목표를 추론의 후보 생성에 재사용할 때도 정확한 모델 구조를 확인해야 합니다.
          </p>
</div>
<ExplainedFormula question="앞 상태와 다음 토큰은 어디서 만날까요?" idea="보고서의 순차 깊이 k에서 두 상태를 정규화하고 이어 붙여 새 모듈에 넣습니다." formula={String.raw`\begin{aligned}h_i^{\prime k}&=M_k[\operatorname{RMSNorm}(h_i^{k-1});\operatorname{RMSNorm}(\operatorname{Emb}(t_{i+k}))]\\h^k&=\operatorname{TRM}_k(h^{\prime k})\\P_{i+k+1}^k&=\operatorname{OutHead}(h_i^k)\end{aligned}`} annotatedFormula={String.raw`\begin{aligned}\underbrace{a_i^k}_{\text{앞 상태}}&=\operatorname{RMSNorm}(h_i^{k-1})\\\underbrace{u_i^k}_{\text{다음 토큰}}&=\operatorname{Emb}(t_{i+k})\\\underbrace{e_i^k}_{\text{정규화한 토큰}}&=\operatorname{RMSNorm}(u_i^k)\\\underbrace{h_i^{\prime k}}_{\text{합친 상태}}&=M_k[a_i^k;e_i^k]\\\underbrace{h_i^k}_{\text{후보 상태}}&=\operatorname{TRM}_k(h_i^{\prime k})\\\underbrace{P_{i+k+1}^k}_{\text{다음 분포}}&=\operatorname{OutHead}(h_i^k)\end{aligned}`} terms={[{"symbol": "h_i^{k-1}", "name": "이전 깊이의 상태", "description": "k=1이면 기존 네 자리의 main model 상태입니다."}, {"symbol": "t_{i+k}", "name": "이미 지정한 다음 토큰", "description": "작은 사례의 첫 깊이에서는 R입니다."}, {"symbol": "M_k", "name": "두 입력을 합치는 투영", "description": "d×2d 행렬이 2d차원 입력을 d차원으로 만듭니다."}]} operations={[{"expression": "[h;\\operatorname{Emb}(R)]", "annotation": ["각각 정규화한 두 d차원 입력을 이어 붙입니다."]}, {"expression": "\\operatorname{OutHead}(h_i^1)", "annotation": ["그다음 A를 포함한 후보의 점수를 만듭니다."]}]} assumptions={["DeepSeek-V3 report v2의 식 21–23 구조입니다.", "모듈을 반복 실행하는 모든 구현의 비용이나 수락률을 이 식만으로 알 수는 없습니다."]} interpretation="공유 embedding·공유 head와 별도 block·projection을 구분합니다."/><CitationBlock citeKey={18} source="DeepSeek-V3 Technical Report v2 — §2.2 equations 21–23" href="https://arxiv.org/html/2412.19437v2">네 자리의 마지막 상태와 R을 식에 넣어 A의 예측이 생기는 경로를 확인합니다.</CitationBlock>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">후보 하나의 수락 확률이 .85라도 검증이 단독 생성의 두 배라면 후보 비용을 .016으로 가정한 시간 비는 1.85/2.016≈.9177입니다. 잘 맞는 후보라는 사실만으로는 이득이 되지 않습니다. 모듈 실행 시간과 기준 모델의 여러 자리 검증 시간을 같은 부하에서 재야 합니다. (가정)</p>
        <p className="leading-8"><strong>MTP를 고를 조건은 두 가지입니다.</strong> 해당 모델이 실제로 호환되는 MTP 가중치와 실행 경로를 제공해야 하고, MTP를 추론 때 켰을 때의 전체 회차 시간이 확정 토큰 수에 비해 짧아야 합니다.</p>
      </div>
    </section>

    <section id="suffix" data-teach-level="5" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">11. SuffixDecoding은 과거 문장이 반복될 때 후보를 검색합니다</h2>
      <span id="suffix-source" />
      <span id="suffix-boundary" />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            <strong>SuffixDecoding은 현재 문장 끝과 같은 과거 구간을 찾아 그 뒤에 자주 나온 글자를 후보로 냅니다.</strong> 저장한 글 8개에서 R 뒤 A가 6번, B가 2번 나왔다고 합시다. A 뒤에는 Y가 5번, X가 1번이고 B 뒤에는
            두 번 모두 Y가 나왔습니다. 같은 RAY 후보를 학습 모델 대신 기록에서 얻는 예입니다. (가정)
          </p>
<p className="leading-8">검색이 모델 실행보다 싸다면 왜 모든 요청에서 먼저 찾아보지 않을까요? 처음 보는 문장에는 맞는 과거 구간이 없고, 구간을 찾더라도 과거에 자주 나온 글자가 기준 모델의 현재 선택과 같다는 보장이 없기 때문입니다.</p>
<p className="leading-8">
            R 다음 A의 빈도 비중은 6/8=.75입니다. RAY 전체 경로의 비중은 .75×5/6=.625입니다. RB는 .25이고 RBY도 .25입니다. 네 후보를 이 순서로 꺼내면
            부모 번호는 [-1,0,-1,2]이고 경로 비중의 합은 1.875입니다.
          </p>
<p className="leading-8">
            최근 토큰 열의 끝부분과 같은 기록을 찾는 자료 구조를 suffix tree라고 합니다. SuffixDecoding은 현재 요청의 글과 과거 출력에서 후보를 찾고 관찰
            빈도로 후보를 점수화합니다. 이 빈도는 현재 target의 진짜 확률을 직접 측정한 값이 아닙니다.
          </p>
<p className="leading-8">
            SuffixDecoding v3의 식 C(N)은 부모 아래 자식의 관찰 비중, D(N)은 그 비중을 경로를 따라 곱한 값입니다. SCORE는 선택한 node들의 D 합입니다.
            작은 사례의 .75와 .625를 넣으면 두 자리 경로의 점수 1.375를 얻습니다. 여러 갈래를 더한 1.875와 실제 target이 받아들인 수는 별도의 양입니다.
          </p>
</div>
<CitationBlock citeKey={21} source="SuffixDecoding v3 — §3 conditional counts and SCORE" href="https://arxiv.org/html/2411.04975v3">과거 8개 글의 빈도를 원문의 C·D·SCORE에 대응했습니다. 이 추정치를 새 요청의 실제 수락 확률이라고 보장하지 않습니다.</CitationBlock>
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
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">반복 구간을 찾지 못하면 큰 모델은 평소처럼 한 토큰을 만듭니다. 그때도 조회와 자료 구조 갱신 시간은 이미 썼습니다. 단독 생성 25ms와 검색 .02ms를 가정하면 후보가 없는 회차는 25.02ms이고 시간 비는 25/25.02≈.9992입니다. (가정)</p>
        <p className="leading-8"><strong>따라서 로그·코드·구조화 문서처럼 반복이 많은 입력에서는 검토할 가치가 큽니다.</strong> 처음 보는 문장이 많은 입력에서는 적중률과 후보 길이가 낮아질 수 있으므로, 검색 실패율·검색 시간·fallback 시간을 포함한 전체 장부로 선택합니다.</p>
      </div>
    </section>

    <section id="cost" data-teach-level="6" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">12. 이득은 이름이 아니라 한 회차의 시간 장부로 결정됩니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">변형이 달라도 비교식은 같습니다. 한 회차의 평균 확정 수를 E[Y], 평소 한 토큰 시간을 T₁, 후보 준비·target 검증·기록 정리 시간을 각각 T_d·T_v·T_c라고 쓰겠습니다. 전체 회차 시간 T는 T_d+T_v+T_c이고, T₁=1로 놓으면 속도 비 S는 E[Y]/T가 됩니다. (가정)</p>
        <p className="leading-8">평균 1.85개를 확정해도 회차 시간이 1.016이면 약 1.82배지만, 검증이 무거워져 2.016이 되면 약 0.92배입니다. 수락률이 높다는 사실만으로 빠르다고 결론낼 수 없는 이유입니다. (가정)</p>
        <p className="leading-8">후보 tree를 넓히면 Y가 늘 수 있지만 T도 늘어납니다. 같은 모델이라도 batch가 커져 GPU 계산이 가득 차면 여러 후보를 함께 확인하는 비용이 빠르게 커질 수 있습니다. 그래서 논문 이름이나 head 수보다 실제 요청 분포의 Y와 T를 재야 합니다.</p>
      </div>
      <ExplainedFormula question="무엇을 재면 실제 이득을 판단할 수 있을까요?" idea="같은 출력 토큰 수를 단독 생성했을 시간과 후보·검증·정리의 전체 시간을 비교합니다." formula={String.raw`S=\frac{\mathbb E[Y]\,T_1}{T_d+T_v+T_c}`} annotatedFormula={String.raw`S=\frac{\underbrace{\mathbb E[Y]}_{\text{평균 확정 수}}\,\underbrace{T_{1}}_{\text{평소 한 토큰 시간}}}{\underbrace{T_{d}}_{\text{후보 준비}}+\underbrace{T_{v}}_{\text{큰 모델 검증}}+\underbrace{T_{c}}_{\text{기록 정리}}}`} terms={[
        { symbol: "\\mathbb E[Y]", name: "회차당 평균 확정 토큰", description: "첫 불일치 전까지 실제로 살아남은 토큰 수입니다." },
        { symbol: "T_1", name: "기준 시간", description: "같은 target과 batch에서 한 토큰을 평소 방식으로 만든 시간입니다." },
        { symbol: "T_d+T_v+T_c", name: "새 방식의 전체 회차 시간", description: "후보가 없거나 거절돼도 이미 쓴 시간을 포함합니다." },
      ]} operations={[
        { expression: "1.85/1.016", annotation: ["약 1.82이므로 같은 가정에서는 빨라집니다."] },
        { expression: "1.85/2.016", annotation: ["약 0.92이므로 수락률이 같아도 느려집니다."] },
      ]} assumptions={["비교할 두 방식의 target model·출력 규칙·요청 분포를 같게 둡니다.", "Y와 각 시간은 실제 배포 환경에서 다시 측정해야 합니다."]} interpretation="S가 1보다 클 때만 큰 모델의 순차 실행을 줄인 이득이 전체 시간에도 남습니다." />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">실제 배포에서는 이 세 시간을 같은 요청 분포와 batch에서 잽니다. 가중치 읽기의 공유, 늘어난 계산·KV·동기화와 대기열까지 포함하고, 평균 지연과 함께 처리량과 긴 꼬리 지연도 따로 확인합니다.</p>
        <p className="leading-8">두 구현이 같은 일을 하는지도 맞춰야 합니다. 토큰을 뽑는 규칙, 모델 가중치, 어휘표가 달라지면 기준 답이 달라지고, 위치 처리나 수치 정밀도가 달라지면 같은 식도 다른 반올림 경로를 지날 수 있습니다. 길이 제한과 종료 조건은 한 회차에 셀 수 있는 토큰 수를 바꾸므로 함께 고정합니다.</p>
      </div>
      <ProgressiveDetail title="Tree·LayerSkip·MTP·batch·hybrid 비용 계산" preview="기존 숫자 예와 경계식을 공통 시간 장부에 대입합니다.">
        <span id="tree-cost" />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">후보 폭을 첫째 3, 둘째 2, 셋째 2로 늘리면 후보 수는 3+6+12=21입니다. root 한 자리를 포함해 입력하면 22개입니다. 깊이 3의 한 줄 후보는 3개이며 같은 root 경계에서는 입력 4개입니다. 후보 수와 입력 수를 혼용하지 않습니다.</p>
<p className="leading-8">각 깊이에서 앞 경로가 맞았다는 조건 아래 다음 선택을 포함할 확률을 .89, .85, .8로 가정합시다. 첫 자리까지 맞을 확률은 .89, 둘째까지는 .89×.85=.7565, 셋째까지는 .6052입니다. 기본 한 출력까지 더한 평균은 3.2517입니다. (가정)</p>
<p className="leading-8">이 곱셈은 조건부 확률의 연결이므로 깊이 사이의 독립을 추가로 가정하지 않습니다. 반면 그냥 각 자리의 주변 포함률 세 개만 알 때는 같은 곱을 사용할 수 없습니다. 한 줄에서 iid 수락률 .7을 가정한 평균 1+.7+.49+.343=2.533과도 조건이 다릅니다.</p>
<p className="leading-8">평균이 3.2517로 길어도 더 빠르다고 결정할 수 없습니다. 기준 한 글자 시간을 1로 놓고 tree 회차 비용 4.2, chain 비용 1.7을 따로 가정하면 시간 개선 비는 .7742와 1.49입니다. 더 많이 확정한 tree 쪽이 오히려 느립니다. 원문이 논의하는 후보 폭의 절충을 숫자로 확인한 예입니다.</p>
</div>
<ExplainedFormula question="후보 수와 평균 확정 길이는 어떻게 다를까요?" idea="깊이별 후보 수는 폭을 곱하고 평균 길이는 그 깊이까지 맞을 확률을 더합니다." formula={String.raw`\begin{aligned}N&=\sum_{j=1}^{K}\prod_{i=1}^{j}s_i\\\mathbb E[Y]&=1+\sum_{j=1}^{K}\prod_{i=1}^{j}\beta_i\end{aligned}`} annotatedFormula={String.raw`\begin{aligned}\underbrace{N}_{\text{후보 수}}&=\sum_{j=1}^{K}\prod_{i=1}^{j}\underbrace{s_i}_{\text{후보 폭}}\\\underbrace{\mathbb E[Y]}_{\text{평균 확정 수}}&=1+\sum_{j=1}^{K}\prod_{i=1}^{j}\underbrace{\beta_i}_{\text{포함률}}\end{aligned}`} terms={[{"symbol": "s_i", "name": "해당 깊이의 후보 폭", "description": "작은 확장 예에서는 3,2,2입니다."}, {"symbol": "\\beta_i", "name": "앞 경로가 맞았을 때의 포함률", "description": "해당 조건을 붙인 .89,.85,.8입니다."}]} operations={[{"expression": "3+3\\times2+3\\times2\\times2", "annotation": ["후보 21개에 root를 더하면 입력 22개입니다."]}, {"expression": "1+.89+.7565+.6052", "annotation": ["평균 확정 수 3.2517입니다."]}]} assumptions={["종료로 회차가 잘리지 않는 greedy 경로 포함률 모형입니다.", "조건부 포함률이며 독립인 주변확률이라고 놓지 않습니다."]} interpretation="시간 비는 각각 3.2517/4.2=.7742와 2.533/1.7=1.49입니다."/><CitationBlock citeKey={14} source="SpecInfer v4 — §3 expansion, Table 1" href="https://arxiv.org/html/2305.09781v4">논문의 폭 확장 방식에 3·2·2를 넣었습니다. .89/.85/.8 전체는 별도 가정이며 논문의 한 행을 깊이별 측정값으로 바꾼 것이 아닙니다.</CitationBlock>
        <span id="self-cost" />
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
        <span id="mtp-cost" />
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
<ExplainedFormula question="후보 한 개는 어느 검증 비용까지 이득일까요?" idea="같은 확정 출력의 단독 비용 1+α를 후보 비용 c와 검증 비용 v의 합과 비교합니다." formula={String.raw`S=\frac{1+\alpha}{c+v},\qquad S>1\iff v<1+\alpha-c`} annotatedFormula={String.raw`\begin{aligned}S&=\frac{\underbrace{1+\alpha}_{\text{평균 확정 수}}}{\underbrace{c}_{\text{후보 준비}}+\underbrace{v}_{\text{모델 검증}}}\\\underbrace{S>1}_{\text{더 빠름}}&\iff\underbrace{v<1+\alpha-c}_{\text{검증 비용의 한계}}\end{aligned}`} terms={[{"symbol": "\\alpha", "name": "한 후보의 수락 확률", "description": "이 시간 모형에서는 .85입니다."}, {"symbol": "c,v", "name": "기준 한 글자 시간에 대한 비", "description": "후보 .016과 별도 검증 비용입니다."}]} operations={[{"expression": "1+.85-.016", "annotation": ["검증 비용의 엄격한 경계 1.834를 얻습니다."]}, {"expression": "1.85/(2+.016)", "annotation": ["v=2의 개선 비는 약 .9177입니다."]}]} assumptions={["직렬 비용을 서로 중복 없이 세고 추가 runtime 비용은 0으로 둡니다.", "EOS·길이 제한이 평균 출력을 먼저 자르지 않는 한 후보 모형입니다."]} interpretation="v=1.834는 같은 시간이며 더 작을 때만 이득입니다."/>
        <span id="batch-boundary" />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">batch가 커질 때의 모양을 보려고 별도 장난감 시간 모형을 두겠습니다. x=B/B*라 쓰고 단독 시간은 max(1,x), 두 자리 검증은 max(1,2x)에 비례한다고 가정합니다. B*는 이 모형의 두 비용이 만나는 위치이며 실제 GPU에서 측정한 한도가 아닙니다.</p>
<p className="leading-8">
            검증의 상대 비용은 두 수의 비 max(1,2x)/max(1,x)입니다. 분모를 항상 1로 두면 단독 생성도 비싸진 x&gt;1 구간에서 비교 기준이 달라집니다. 후보 비용
            c=.016은 이 비교에서 일정한 비라고 추가로 가정합니다.
          </p>
<p className="leading-8">x≤.5에서는 v=1입니다. .5&lt;x≤1에서는 v=2x이고 x≥1에서는 v=2입니다. 앞의 v&lt;1.834를 넣으면 양의 x에서 이득 구간은 x&lt;.917입니다. 따라서 ridge의 절반 .5를 넘었다는 사실만으로 곧바로 이득이 사라지지는 않습니다.</p>
<p className="leading-8">실제 연산·KV 읽기·통신·스케줄링은 이 단순 max 곡선에 모두 들어 있지 않습니다. 이 그래프를 실제 성능 하한이나 지연 보장으로 사용하지 않습니다. 같은 모델과 장치에서 단독 시간과 검증 시간을 측정한 뒤 앞 절의 비교식을 적용해야 합니다.</p>
</div>
<ExplainedFormula question="단독 생성도 느려지면 어떤 분모를 써야 할까요?" idea="같은 batch의 단독 시간을 분모로 두어 검증 비용을 정규화합니다." formula={String.raw`v(x)=\frac{\max(1,2x)}{\max(1,x)}=\begin{cases}1&0<x\le.5\\2x&.5<x\le1\\2&x\ge1\end{cases}`} annotatedFormula={String.raw`\begin{aligned}\underbrace{x}_{\text{batch 상대 크기}}&=B/B^*\\\underbrace{t_v(x)}_{\text{두 자리 검증}}&=\max(1,2x)\\\underbrace{t_1(x)}_{\text{단독 생성}}&=\max(1,x)\\\underbrace{v(x)}_{\text{상대 검증 시간}}&=t_v(x)/t_1(x)\\v(x)&=\begin{cases}1&0<x\le.5\\2x&.5<x\le1\\2&x\ge1\end{cases}\end{aligned}`} terms={[{"symbol": "x", "name": "batch의 상대 크기", "description": "장난감 경계 B*로 나눈 양의 B입니다."}, {"symbol": "v(x)", "name": "정규화한 검증 시간", "description": "절대 시간이나 roofline 하한이 아닌 가정한 시간 비입니다."}]} operations={[{"expression": "2x<1.834", "annotation": ["중간 구간에서는 x<.917이 됩니다."]}, {"expression": "\\max(1,2x)/\\max(1,x)=2", "annotation": ["x≥1에서는 v=2로 후보 이득이 없습니다."]}]} assumptions={["단독과 검증에 같은 max 시간 모형을 정확한 값으로 가정한 설명용 곡선입니다.", "실제 GPU peak 수치에서 이 등식을 보장한 것이 아닙니다."]} interpretation="같은 α와 c라도 실제 v 곡선이 다르면 경계도 바뀝니다."/><MtpCostViz/>
        <span id="hybrid-cost" />
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
      </ProgressiveDetail>
    </section>

    <section id="correctness" data-teach-level="6" className="mb-16 scroll-mt-20">
      <span id="sampling-boundary" />
      <h2 className="mb-6 text-2xl font-bold">13. 빨라져도 원래 모델의 답을 바꾸면 괜찮을까요?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">앞 절의 시간 장부가 1보다 크다고 끝은 아닙니다. 빨라진 방법이 원래 큰 모델과 다른 규칙으로 글자를 고르면, 같은 일을 더 빨리 한 것이 아니기 때문입니다. 따라서 속도를 잰 다음에는 출력 규칙도 보존되는지 확인해야 합니다.</p>
<p className="leading-8">항상 가장 점수가 높은 글자를 고르는 greedy 방식은 같은 조건의 최고 점수 글자를 따라가면 됩니다. 확률에 따라 뽑는 sampling 방식은 여러 번 생성했을 때 각 글자가 나오는 비율까지 지켜야 합니다.</p>
<p className="leading-8">확인 분포가 A .7, B .3이라고 합시다. 확률이 .2보다 큰 후보를 그대로 받는 규칙에서 항상 B를 제안하면 B가 매번 나옵니다. B가 충분히 그럴듯하다는 판단은 통과하지만 원래 .3의 비중은 보존되지 않습니다. (가정)</p>
<p className="leading-8"><strong>그래서 실제 선택 조건은 두 개입니다.</strong> 시간 비가 1보다 커야 하고, 제품이 요구하는 출력 규칙도 지켜야 합니다. 아래에는 방법별로 두 번째 조건을 처리하는 방식이 왜 다른지 남겼습니다.</p>
</div>
<ProgressiveDetail title="분포 보존 규칙은 왜 방법마다 다를까요?" preview="Medusa의 빠른 수락과 SpecInfer의 잔여 분포 갱신이 보장하는 범위를 구분합니다.">
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">Medusa의 typical·fast 분기는 후보 확률을 entropy에 따른 문턱과 비교하고 가장 긴 경로를 고릅니다. 논문도 이 방식에서 target 분포 일치를 필수 목표로 두지 않습니다. 본문의 작은 반례가 이 선택의 경계를 보여 줍니다. 품질 평가가 비슷했다는 보고를 확률 분포의 항등식으로 바꾸지 않습니다.</p>
<p className="leading-8">SpecInfer의 Algorithm 2는 거부한 형제의 제안 분포를 현재 남은 분포에서 빼고 양수 부분을 다시 정규화합니다. 다음 형제를 확인할 때도 그 갱신된 분포를 씁니다. 예를 들어 target (.7,.3), 첫 제안 (.4,.6)에서 거부하면 잔여 분포는 (1,0)입니다. 다음 형제에서도 원래 (.7,.3)을 그대로 쓰는 절차와 다릅니다.</p>
<p className="leading-8">이 보장은 논문의 제안 선택·조건부 분포·중복 처리와 검증 규칙을 함께 지켰을 때 읽습니다. 서로 다른 sampler를 쓴 임의의 tree에 p/q 한 줄만 붙인다고 증명되지 않습니다. 같은 분포인 두 확률 모델에서는 정확한 단일 후보 수락률이 1입니다.</p>
</div>
<CodeViewButton label="Medusa의 실제 typical·fast 분기" onClick={() => sidebar.open("typical", codeRefs["typical"])}/><CitationBlock citeKey={12} source="Medusa v3 — §2.3.1 Typical Acceptance" href="https://arxiv.org/html/2401.10774v3">작은 B 반례를 확률 문턱 방식에 적용해 분포 일치와 품질 평가를 구분합니다.</CitationBlock><CitationBlock citeKey={13} source="SpecInfer v4 — Algorithm 2 lines 29–43" href="https://arxiv.org/html/2305.09781v4">거부할 때마다 잔여 분포를 갱신하는 순서가 여러 형제의 검증을 연결합니다.</CitationBlock>
      </ProgressiveDetail>
      <span id="paper-evidence" className="scroll-mt-20" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">여기까지 속도와 출력 규칙이라는 비교 기준을 세웠습니다. 논문에 나온 배율도 모델·입력·batch·생성 규칙과 측정 범위가 같을 때만 나란히 놓을 수 있습니다. 특히 한 토큰 생성 시간과 외부 작업까지 포함한 전체 실행 시간은 분모부터 다릅니다.</p>
      </div>
<ProgressiveDetail title="각 논문의 보고 배율은 어떤 조건에서 나왔을까요?" preview="모델과 입력별 실험 수치를 그대로 보존했습니다. 이 결과를 층 수나 후보 수만으로 유도한 보편 배율로 쓰지 않습니다."><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            LayerSkip v4는 학습 방법을 적용한 Llama 계열에서 CNN/DM 요약 최대 2.16배, 코드 1.82배, TOPv2 의미 분석 2.0배를 보고합니다. 저자
            자기보고이며 층 수 비율로 유도한 배율이 아닙니다. 별도 가중치 부담을 줄이고 앞 층의 상태를 재사용하는 기여와 어느 checkpoint에서 유효한지를 함께 읽습니다.
          </p>
<p className="leading-8">
            DeepSeek-V3 v2의 5.4.3절은 추가로 예측한 둘째 토큰의 수락률 85~90%와 TPS 1.8배를 보고합니다. 이 보고를 앞의 가정 c=.016과 숫자가
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
            decode 비교 2.5배와 같은 측정 범위가 아닙니다. 토큰당 약 20µs의 후보 준비 보고도 가정한 25ms와 조합해 실제 전체 상한 6.2배가 증명된 것처럼 쓰지
            않습니다.
          </p>
</div><span id="paper-layerskip"/><span id="paper-deepseek-v3-mtp"/><span id="paper-medusa"/><span id="paper-specinfer"/><span id="paper-suffix-decoding"/><CitationBlock citeKey={25} source="Medusa v3 — §3.3 and Table 2" href="https://arxiv.org/html/2401.10774v3">가정한 RAY의 정확성과 저자 보고의 생성 품질·속도는 서로 다른 확인 대상입니다.</CitationBlock><CitationBlock citeKey={26} source="SuffixDecoding v3 — Figure 4 and §4.3" href="https://arxiv.org/html/2411.04975v3">같은 논문 안에서도 decode 시간과 전체 agent 작업 시간이 다른 분모를 사용합니다.</CitationBlock></ProgressiveDetail>
    </section>

    <section id="boundary" data-teach-level="7" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">14. 결국 줄여야 하는 것은 큰 모델의 순차 실행 횟수입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8"><strong>이 글의 결론으로 돌아오겠습니다.</strong> 추측 디코딩은 작은 모델이 답을 대신 쓰는 기술이 아닙니다. 후보를 먼저 준비하고 큰 모델이 여러 위치를 한 번에 검증해, 비싼 큰 모델을 차례로 실행하는 횟수를 줄이는 기술입니다.</p>
        <p className="leading-8">변형은 이 원리를 바꾸지 않습니다. 같은 모델의 앞 layer, 보조 head, 순차 MTP module, 과거 출력 검색은 모두 후보를 더 싸고 잘 맞게 만들려는 방법입니다. 한 줄과 tree는 그 후보를 어느 모양으로 검증할지 정합니다.</p>
        <p className="leading-8">따라서 선택할 때는 세 수를 봅니다. 한 회차에 실제로 확정한 토큰 수, 후보·검증·기록 정리에 든 전체 시간, 그리고 같은 target이 평소 한 토큰을 만드는 시간입니다. 이 세 수로 계산한 비가 1보다 커야 생성 횟수를 줄인 이득이 실제 지연 시간에도 남습니다.</p>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            후보의 출처와 tree의 모양을 독립 축으로 보세요. 앞 층을 재사용한다고 언제나 빠르지 않고 후보를 넓힌다고 언제나 많이 확정하지도 않습니다. 같은 RAY를 만들면서 어느
            입력과 기록을 추가했는지부터 세면 비용과 정확성을 따로 확인할 수 있습니다.
          </p>
</div>
<ProgressiveDetail title="이 글에서 직접 확인한 범위와 다음 읽을 글" preview="실행한 코드의 범위와 확률·KV·GPU 비용을 더 깊게 다루는 글을 모았습니다.">
<div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">이 글에서는 원문 Medusa의 배열·greedy 함수 AST와 작은 배열 대역, Arctic의 실제 C++ 자료 구조, 별도 Python wrapper 분기를 실행했습니다. LayerSkip의 전체 모델 forward와 GPU 성능은 실행하지 않았습니다. 원문 코드와 가정 수치의 역할을 나누어 기록했습니다.</p>
<p className="leading-8">한 줄 후보의 정확한 수락·잔여 분포 유도는 <Link to="/cs/ai/vllm-spec-decode#distribution-proof">추측 디코딩의 확률 복원</Link>에서 이어집니다. 계산 기록 한 자리의 크기는 <Link to="/cs/ai/kv-cache-fundamentals">KV cache의 구조</Link>, 연산과 읽기 비용의 차이는 <Link to="/cs/ai/prefill-decode-phase-dynamics">입력 처리와 생성의 비용</Link>에서 더 살펴볼 수 있습니다.</p>
</div>
</ProgressiveDetail>
    </section>

    <section id="prediction-questions" data-teach-level="review" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">15. 결론에서 생긴 꼬리 질문에 답해 보세요</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">왜 큰 모델이 토큰 세 개를 연속으로 승인하면 큰 모델의 생성 실행을 세 번에서 검증 한 번으로 줄일 수 있을까요? 줄어들지 않는 계산도 함께 설명해 보세요. (답: 2절)</p>
        <p className="leading-8">후보 [R,A,B,X,Y,X,Y]에서 RAY만 승인됐다면 왜 같은 글자 Y가 있는 다른 갈래의 계산 기록을 쓸 수 없을까요? (답: 7절)</p>
        <p className="leading-8">회차당 평균 확정 수가 1.85로 같아도 전체 회차 시간이 1.016에서 2.016으로 늘면 왜 이득이 손해로 바뀔까요? (답: 12절)</p>
      </div>
    </section>

    <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{
      medusa: { id: "medusa", label: "Medusa e2a5d20", badgeClass: "bg-primary/10 border-primary text-primary" },
      layerskip: { id: "layerskip", label: "LayerSkip 494752e5", badgeClass: "bg-primary/10 border-primary text-primary" },
      arctic: { id: "arctic", label: "ArcticInference aca5d9a8", badgeClass: "bg-primary/10 border-primary text-primary" },
    }} />
  </>;
}
