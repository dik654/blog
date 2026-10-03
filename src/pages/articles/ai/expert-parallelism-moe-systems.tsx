import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import NumericPath from "@/pages/articles/world-systems/NumericPath";
import SourceApplication from "@/pages/articles/world-systems/SourceApplication";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import PaperReading from "./research-audit-sources/PaperReading";
import { codeRefs, fileTrees, projectMetas } from "./research-audit-sources/codeRefs";

export default function Article(){
  const sidebar=useCodeSidebar();
  return <div className="space-y-16">
    <section id="overview" data-teach-level="S" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">1 · 선택한 계산기가 다른 GPU에 있으면 입력을 옮겨야 한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">64개 expert를 GPU 8개에 8개씩 나누겠습니다. GPU 0의 token 37이 expert 13과 42를 선택했습니다. 두 expert가 있는 GPU 1과 5로 값을 보내고 결과를 돌려받아 합칩니다.</p>
        <p className="leading-8">Expert 수를 늘려 모델의 저장 능력을 키울 수 있어도, 이 왕복이 계산보다 오래 걸리면 기다림이 커집니다. 이 글은 token 37의 이동에서 시작해 같은 경로 2048개의 바이트, 부하 쏠림과 최신 DeepEP API까지 추적합니다.</p>
      </div>

      <ContentBoundary article="expert-parallelism-moe-systems" />
      <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">작업과 목적지를 정했습니다. 입출력과 완료 조건을 먼저 봅니다.</p>
    </section>
    <section id="black-box" data-teach-level="B" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2 · 입력·expert 번호·가중치를 받아 결합 결과를 돌려준다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">입력은 각 token의 hidden vector, top-k expert 번호, 결합 가중치입니다. 출력은 선택한 expert가 계산한 결과의 가중합입니다. 같은 expert weight와 routing을 유지해야 장치 배치 변경 전후의 결과를 비교할 수 있습니다.</p>
        <p className="leading-8">여기서는 hidden 폭 4096, FP16, top-2를 가정합니다. Expert 내부 계산과 router 학습은 <Link to="/cs/ai/mixture-of-experts">MoE 구조</Link>와 <Link to="/cs/ai/moe-routing-and-load-balancing">routing·부하 균형 정본</Link>에서 이어집니다. 이 글의 책임은 정해진 배정이 장치와 통신을 통과하는 경로입니다.</p>
      </div>

      <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">결과의 계약을 정했습니다. token 하나의 바이트를 셉니다.</p>
    </section>
    <section id="case" data-teach-level="0" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">3 · token 37은 8192바이트를 두 곳에 보낸다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">4096개 값 × 2B = 8192B, 즉 8KiB입니다. Expert 13과 42가 서로 다른 GPU에 있으므로 token 37의 입력은 각각 8KiB씩 총 16KiB 이동합니다. 결과 폭이 같으면 돌아오는 값도 합계 16KiB입니다.</p>
        <p className="leading-8">가령 결합 가중치가 0.25와 0.75라면 같은 출력 좌표에서 0.25×y₁₃+0.75×y₄₂를 구합니다. 두 결과가 도착하기 전에 결합을 끝낼 수 없습니다. 이 token의 왕복 32KiB는 header·routing metadata 등을 제외한 유효 데이터입니다.</p>
      </div>
<NumericPath title="token 37의 왕복" steps={[{"label": "GPU 0", "value": "8KiB 입력", "detail": "expert 13·42를 선택"}, {"label": "Dispatch", "value": "GPU 1과 5로 각각 전송", "detail": "논리 payload 합계 16KiB"}, {"label": "Expert 계산", "value": "각각 8KiB 출력", "detail": "weight가 있는 장치에서 계산"}, {"label": "Combine", "value": "GPU 0에서 가중합", "detail": "둘의 완료를 확인한 뒤 결합"}]} />
      <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">하나의 token에 필요한 두 왕복을 셌습니다. 장치 사이 순서를 그려봅니다.</p>
    </section>
    <section id="picture" data-teach-level="1" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">4 · 입력을 보내고 결과를 원래 위치로 돌려놓는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">GPU g에 expert 8g부터 8g+7을 두면 expert 번호를 8로 나눈 몫이 목적 GPU입니다. 13은 1, 42는 5입니다. Dispatch는 목적지별로 입력을 모으고, 도착한 입력을 expert별 연속 구간으로 배치합니다.</p>
        <p className="leading-8">각 expert가 자기 구간을 계산한 뒤 combine이 원래 token 위치로 결과를 돌려보냅니다. 입력 순서를 섞었다면 원래 위치로 되돌릴 metadata가 필요합니다. 잘못된 handle을 재사용하면 바이트 수가 맞아도 다른 token의 결과를 합칠 수 있습니다.</p>
      </div>

      <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">값뿐 아니라 돌아갈 위치도 옮겨야 합니다. 이 비용이 생기는 이유를 봅니다.</p>
    </section>
    <section id="need" data-teach-level="2" className="scroll-mt-20">
      <span id="problem" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">5 · weight를 나눈 절약과 token 이동을 함께 계산한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">폭 4096, 중간 폭 11008인 expert의 행렬 3개를 FP16으로 저장하면 약 258MiB입니다. 64개는 16.125GiB이고 8개 GPU에 나누면 각 2.016GiB 정도입니다. 이 계산은 expert weight만 세며 attention과 runtime 공간은 별도입니다.</p>
        <p className="leading-8">모든 weight를 복제하는 대신 입력을 움직이면 저장 부담이 줄지만 선택된 expert가 원격에 있을 때마다 통신이 생깁니다. 같은 GPU나 node의 expert로 제한하면 이동을 줄일 수 있으나 router의 선택 자유와 품질, 부하 쏠림도 바뀝니다.</p>
      </div>

      <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">저장 절약의 대가가 입력 이동임을 확인했습니다. 각 병렬화의 역할을 이름으로 나눕니다.</p>
    </section>
    <section id="names" data-teach-level="3" className="scroll-mt-20">
      <span id="sharding" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">6 · Expert parallelism은 expert의 배치 축을 나눈다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">Expert parallelism은 expert를 장치에 나누는 방식입니다. Expert 하나가 너무 크면 그 내부 행렬을 tensor parallel로 다시 나눌 수도 있습니다. Data parallel은 다른 입력을 처리하는 복제 실행의 축입니다. 실제 배치는 이 축들을 조합하므로 EP와 DP 숫자를 무조건 곱해 GPU 수로 읽지 않습니다.</p>
        <p className="leading-8">서로 다른 목적지에 서로 다른 입력을 보내는 교환을 all-to-all이라고 부릅니다. MoE의 실제 payload는 routing에 따라 크기가 달라질 수 있고 라이브러리가 고정 collective 한 번으로만 구현해야 하는 것은 아닙니다. expert 배치와 node 연결 방식이 물리 전송을 정합니다.</p>
      </div>

      <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">배치와 교환의 이름을 정했습니다. 같은 token 경로를 2048개로 늘려 계산합니다.</p>
    </section>
    <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
      <span id="all-to-all" className="scroll-mt-20" />
      <span id="bottleneck" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">7 · 평균 바이트와 가장 늦은 GPU를 함께 본다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">GPU마다 2048개 token을 처리하면 dispatch의 논리 payload는 2048×2×4096×2B=32MiB이고 combine까지 64MiB입니다. 균등 배정에서 1/8이 로컬이라는 가정이면 기대 remote 왕복은 56MiB입니다. 실제 routing count와 node별 전송 공유로 이 기대값을 검증해야 합니다.</p>
        <p className="leading-8">56MiB를 가정한 유효 단방향 50GB/s로 나누면 1.174ms입니다. 450GB/s라면 약 0.130ms입니다. 양방향 합산 peak를 단방향 수치로 대입하면 안 됩니다. FP8 dispatch와 BF16 combine도 서로 같은 바이트라는 가정을 깨므로 scale·metadata까지 따로 셉니다.</p>
        <p className="leading-8">균형이면 GPU 하나가 4096개 expert 입력을 받습니다. 세 행렬의 연산은 입력 하나당 6×4096×11008 FLOP이므로 합계 약 1.108TFLOP입니다. 가정한 유효 600TFLOP/s에서는 약 1.847ms입니다. 가장 바쁜 GPU가 1.75배를 받으면 그 계산만 약 3.232ms로 늘어납니다.</p>
        <p className="leading-8">한 token의 dispatch→계산→combine은 의존하는 순서입니다. 많은 chunk의 서로 다른 단계를 겹치면 처리량이 좋아질 수 있지만 통신도 SM·메모리 자원을 씁니다. 두 시간의 max는 이상적인 겹침의 하한이며 실제 한 layer의 완료 시간을 보장하지 않습니다.</p>
      </div>
<ExplainedFormula question={"8개 GPU 중 한 개가 이 layer에서 몇 바이트를 보내는가?"} idea={"token마다 top-k개의 expert 입력을 만들고 계산 뒤 같은 폭의 결과를 받습니다. 로컬 복사본은 외부 link의 전송량에서 뺍니다."} formula={"B_{logical}=2mkdb,\\qquad E[B_{remote}]=2mkdb(1-1/G)"} annotatedFormula={"B_{logical}=\\underbrace{2}_{\\text{보내기와 되돌리기}}\\underbrace{m k}_{\\text{expert 입력 수}}\\underbrace{d b}_{\\text{입력 하나의 바이트}}"} operations={[{"expression": "mk", "annotation": ["2048개 token 각각을 expert 두 개에 배정합니다."]}, {"expression": "db", "annotation": ["hidden 4096개 × 원소당 2B = 8192B입니다."]}, {"expression": "1-1/G", "annotation": ["균등 배정 가정에서 8개 중 다른 GPU 7개의 몫을 셉니다."]}]} terms={[{"symbol": "m,k", "name": "token과 선택 수", "description": "GPU당 2048개, top-2입니다."}, {"symbol": "d,b", "name": "폭과 저장 단위", "description": "4096개와 FP16 2바이트입니다."}, {"symbol": "G", "name": "GPU 수", "description": "각각 expert 8개를 가진 GPU 8개입니다."}]} assumptions={["균등 routing을 가정한 기대값입니다.", "서로 다른 expert에 대한 논리 복사본 기준이며 node별 전송 공유·압축·padding·metadata는 별도입니다."]} interpretation={"논리 왕복은 64MiB, 기대 remote 왕복은 56MiB입니다. 이를 가정한 유효 50GB/s로 나누면 약 1.174ms이며 고정 지연과 경합은 추가됩니다."} />
<AlgorithmBlock title={"한 token의 두 목적지를 보존해 결과를 합칩니다 (의사코드)"} input={["token 37의 x: FP16 원소 4096개=8KiB", "expert=[13,42], weight=[.25,.75], expert당 GPU=floor(expert/8)"]} steps={[{"code": "for (e, w) in [(13,.25), (42,.75)]: dispatch(token=37, expert=e, payload=x)", "note": "GPU 1과 GPU 5로 같은 입력을 보내되 expert 식별자를 함께 보존합니다."}, {"code": "on destination GPU: y_e = expert_FFN[e](x)", "note": "목적 GPU 안에서도 선택한 expert의 weight를 써야 합니다."}, {"code": "return_to_origin(token=37, expert=e, payload=y_e)", "note": "반환 결과를 원래 token과 연결합니다."}, {"code": "wait until both y_13 and y_42 arrive; y = .25*y_13 + .75*y_42", "note": "한 경로가 늦으면 결합 완료도 늦어집니다."}]} output={"폭 4096인 결과 y. 두 입력과 두 반환의 논리 payload는 32KiB이며 metadata는 제외합니다."} />
      <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">평균 전송량과 끝을 늦추는 부하를 분리했습니다. 실제 API의 수신 개수 계약을 봅니다.</p>
    </section>
    <section id="source" data-teach-level="5" className="scroll-mt-20">
      <span id="evidence" className="scroll-mt-20" />
      <span id="paper-deepep" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">8 · EPBuffer는 배정 결과와 유효 수신 범위를 함께 전달한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">2026-09-30 commit 93eb6eb의 DeepEP V2.5는 학습·prefill·decode에 공통 EPBuffer의 dispatch/combine API를 제공합니다. do_cpu_sync=True이면 CPU에서 정확한 수신 개수를 얻고, False이면 설정한 용량 안에서 GPU의 유효 수신 범위로 계산해야 합니다.</p>
        <p className="leading-8">token 37의 새 top-2가 [13,42]에서 [14,42]로 바뀌면 목적 GPU가 같아도 expert별 구간은 달라집니다. decode라는 이유만으로 옛 routing handle을 재사용할 수 없습니다. 원문을 열어 topk_idx·handle·count가 실제 입력과 출력에서 어떻게 연결되는지 확인합니다.</p>
      </div>
<CodeViewButton label="공식 소스 · EPBuffer.dispatch" onClick={() => sidebar.open("dispatch", codeRefs.dispatch)} /><SourceApplication source={"DeepEP V2.5의 handle 계약"} excerpt={"A new routing decision needs a fresh dispatch"} application={"token 37의 expert가 13에서 14로 바뀌면 같은 목적 GPU라도 새 배정으로 dispatch해야 합니다."} /><CitationBlock source={"DeepEP V2.5의 handle 계약"} citeKey={2} href={"https://github.com/deepseek-ai/DeepEP/blob/93eb6eb238127e96c6d7a4a625a6dad158348509/README.md"}>2026-10-04에 고정한 공식 원문입니다.</CitationBlock><PaperReading id="paper-deepep-current" title={"DeepEP V2.5 · 93eb6eb"} href={"https://github.com/deepseek-ai/DeepEP/blob/93eb6eb238127e96c6d7a4a625a6dad158348509/README.md"} problem={"크기와 지연 조건이 다른 MoE 교환"} idea={"공통 EPBuffer, count·완료·통신 자원 계약"} assumption={"모든 rank의 공통 용량과 지원 topology·dependency version"} experiment={"이 글에서는 공식 API와 README를 대조했으며 GPU benchmark는 수행하지 않음"} boundary={"V1의 normal/low-latency API와 zero-SM 설명을 이 commit에 일반화하지 않는다."} />
      <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">바이트 배열의 유효 범위를 코드로 확인했습니다. 이전 버전과 routing 제한을 비교합니다.</p>
    </section>
    <section id="comparison" data-teach-level="6" className="scroll-mt-20">
      <span id="locality" className="scroll-mt-20" />
      <span id="paper-gshard" className="scroll-mt-20" />
      <span id="paper-switch" className="scroll-mt-20" />
      <span id="paper-deepspeed-moe" className="scroll-mt-20" />
      <span id="paper-deepseek-v3" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">9 · 전송 공유와 expert 복제는 서로 다른 비용을 바꾼다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">8개 node에 top-8을 독립 균등 배정한다고 단순화하면 방문 node의 기대 개수는 8×(1−(7/8)⁸)≈5.251입니다. 같은 node의 expert들에게 한 입력을 공유할 수 있다면 node 간 입력 복사 수가 expert 수 8보다 작아질 수 있습니다. 선택을 node 4개 이내로 제한하면 이 상한도 줄지만 동일 품질은 별도 검증입니다.</p>
        <p className="leading-8">뜨거운 expert를 복제하면 입력을 다른 GPU로 나눌 수 있습니다. 대신 weight 메모리와 복제 계획, 학습 시 weight·gradient 일치 비용이 생깁니다. 반면 capacity를 넘긴 token을 버리는 방식은 계산 대상 자체를 바꾸므로 같은 의미의 최적화가 아닙니다. Factor 2라는 숫자만으로 실제 buffer 절반이 항상 padding이라고 단정할 수도 없습니다.</p>
        <p className="leading-8">최신 V2.5 README는 EP dispatch/combine에 SM이 필요하며 zero-SM RDMA EP를 지원하지 않는다고 명시합니다. 1.847ms 계산과 통신을 겹치는 설계에서도 통신에 할당한 SM이 계산 자원을 줄이는지 확인합니다. 새로운 이름보다 이 자원 분배가 실제 시간을 정합니다.</p>
      </div>
<SourceApplication source={"DeepEP V2.5의 통신 자원 경계"} excerpt={"zero-SM RDMA EP is not supported"} application={"통신이 0개의 SM을 쓴다고 놓고 600TFLOP/s 계산 상한을 그대로 겹칠 수 없습니다."} /><CitationBlock source={"DeepEP V2.5의 통신 자원 경계"} citeKey={2} href={"https://github.com/deepseek-ai/DeepEP/blob/93eb6eb238127e96c6d7a4a625a6dad158348509/README.md"}>2026-10-04에 고정한 공식 원문입니다.</CitationBlock><PaperReading id="paper-deepseek-reading" title={"DeepSeek-V3 Technical Report"} href={"https://arxiv.org/abs/2412.19437"} problem={"MoE routing과 대규모 교환 비용"} idea={"node 제한 routing과 부하 균형·통신 계산 겹침"} assumption={"해당 모델의 topology·expert 배치와 workload"} experiment={"보고서의 학습·추론 구성에 대한 저자 측정"} boundary={"이 글의 64 expert·8GPU 수치는 설명용이며 V3의 실제 제품 구성을 옮긴 것이 아니다."} />
      <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">제한·복제·겹침이 각각 무엇을 바꾸는지 확인했습니다. 마지막으로 측정 조건을 고정합니다.</p>
    </section>
    <section id="limits" data-teach-level="7" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">10 · 작은 decode에서는 고정 지연이 남는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">2048개를 32개 token으로 줄이면 논리 dispatch는 512KiB입니다. 전송량과 expert 계산은 줄어도 count 교환·launch·동기화의 고정 비용은 같은 비율로 줄지 않습니다. 단지 batch가 절반이 됐다는 이유만으로 메모리 병목이 됐다고 판정하지 말고 실제 분해 시간을 확인합니다.</p>
        <p className="leading-8">측정에는 모델·routing 분포·dtype·padding, GPU·node·NIC, 단방향 유효 대역폭, 라이브러리 commit, 평균과 p99 완료시간을 남깁니다. 평균 균형이 좋아도 순간 hot expert가 꼬리를 늦출 수 있습니다. <Link to="/cs/gpu/gpu-collective-network">collective 통신 정본</Link>과 <Link to="/cs/ai/serving-benchmark-methodology">서빙 측정 정본</Link>에서 이어집니다.</p>
        <p className="leading-8">예측해 보세요. token 37의 두 expert를 모두 GPU 0으로 옮기면 무엇이 사라질까요? 그 token의 원격 왕복은 줄지만 weight 저장과 expert 계산 및 결합 자체는 남습니다. 3절에서 센 바이트의 경계로 답할 수 있습니다.</p>
      </div>

      <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">바이트, routing 의미, 자원 경합과 완료 시간을 함께 확인하면 추적이 끝납니다.</p>
    </section>
    <ReviewPrompts questions={["token 37의 두 expert를 모두 로컬로 옮기면 어떤 비용이 사라질까요? (답: 3절)", "평균 payload가 같아도 한 GPU의 쏠림이 시간을 늘리는 이유는 무엇일까요? (답: 7절)", "같은 목적 GPU라도 routing handle을 다시 만들어야 하는 경우는 언제일까요? (답: 8절)"]} />
    <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={projectMetas} />
  </div>;
}
