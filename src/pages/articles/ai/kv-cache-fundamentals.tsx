import FactorStructureViz from "@/components/articles/factor-structure-viz";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./kv-cache-fundamentals/codeRefs";
import { kvCacheFundamentalsTree, kvCacheFundamentalsVllmTree } from "./kv-cache-fundamentals/fileTree";
import { SHAPE_TERMS, BYTE_TERMS } from "./kv-cache-fundamentals/formulaTerms";
import KVCacheLifecycleViz from "./kv-cache-fundamentals/viz/KVCacheLifecycleViz";
import KvHeadSharingViz from "./kv-cache-fundamentals/viz/KvHeadSharingViz";
import MlaAbsorbViz from "./kv-cache-fundamentals/viz/MlaAbsorbViz";
import TpKvPlacementViz from "./kv-cache-fundamentals/viz/TpKvPlacementViz";
import KvLayerCountViz from "./kv-cache-fundamentals/viz/KvLayerCountViz";
import KvRetentionCurveViz from "./kv-cache-fundamentals/viz/KvRetentionCurveViz";
import GemmaRetentionAreaViz from "./kv-cache-fundamentals/viz/GemmaRetentionAreaViz";
import GemmaKvPathViz from "./kv-cache-fundamentals/viz/GemmaKvPathViz";
import LatentStorageViz from "./kv-cache-fundamentals/viz/LatentStorageViz";
import RecordByteTraceViz from "./kv-cache-fundamentals/viz/RecordByteTraceViz";
import AttentionReadViz from "./kv-cache-fundamentals/viz/AttentionReadViz";
import PositionKeyPathViz from "./kv-cache-fundamentals/viz/PositionKeyPathViz";
import CapacityBandwidthViz from "./kv-cache-fundamentals/viz/CapacityBandwidthViz";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import { Link } from "react-router-dom";
import {
  KVCacheSeriesLocator,
  KVCacheSeriesMapReturn,
} from "./shared/KVCacheSeriesLocator";

export default function Article() {
  const sidebar = useCodeSidebar();
  return <><KVCacheSeriesLocator current="fundamentals" /><div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 앞에서 계산한 결과를 남겨 답변을 이어 씁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>문장을 한 조각씩 이어 쓸 때 모델은 앞의 문장을 참고합니다. 이미 읽은 부분을 매번 처음부터 계산하면 같은 일을 반복합니다. 앞에서 만든 계산 결과를 남겨 두면 새 위치를 처리할 때 재사용할 수 있습니다.</p><p>보관량은 문장의 길이뿐 아니라 무엇을 몇 벌 남기는지에 달려 있습니다. 이 글은 작은 저장 배열 하나가 늘어나고 읽히는 과정을 따라간 뒤 실제 구현과 모델 설정에서 같은 수를 셉니다.</p></div></section>

<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 새 위치 하나와 과거 기록을 받아 다음 계산으로 넘깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>입력은 지금 처리할 위치 하나와 이미 계산한 과거 기록입니다. 현재 위치의 조회용 숫자와 저장할 숫자를 만들고 새 기록을 과거 뒤에 붙입니다. 그 전체를 참고해 현재 위치의 출력을 계산합니다.</p><p>출력에는 다음 층으로 넘길 계산 결과와 다음 실행에도 남길 저장 기록이 있습니다. 모델 전체가 마지막 층까지 계산하고 새 문장 조각을 골랐다면 그 조각은 다음 실행의 입력이 됩니다. 방금 고른 조각의 저장 결과는 아직 생기지 않았습니다.</p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>현재 위치의 숫자를 만든다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>새 기록을 과거 뒤에 붙인다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>현재 질문으로 기록을 읽는다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>기록은 남기고 다음 위치로 간다</span></li></ol></section>

<section id="small-case" data-calculation-explained data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 세 위치의 기록 48byte에 한 위치를 더합니다</h2><KVCacheLifecycleViz /><div className="prose prose-neutral max-w-none dark:prose-invert"><p>모델의 층 하나에 이미 처리한 위치가 3개 있다고 합시다. 위치마다 두 묶음의 기록이 있고 각 묶음은 찾는 데 쓰는 숫자 2개와 합칠 내용 숫자 2개를 담습니다. 숫자 하나는 2byte입니다. 모든 숫자는 설명용 가정입니다. (가정)</p><p>지금 남은 기록은 3위치 × 위치마다 2묶음 × 묶음마다 K·V 2종류 × 종류마다 숫자 2개 × 숫자마다 2byte = 48byte입니다. 네 번째 위치를 처리하면 같은 모양의 16byte를 붙여 64byte가 됩니다. 뒤에서도 이 3→4위치와 48→64byte를 그대로 사용합니다.</p><p>현재 위치에는 조회 관점이 4개 있고 각 관점도 숫자 2개로 표현합니다. 현재 조회용 Q는 4개 head × head마다 숫자 2개 × 숫자마다 2byte = 16byte이며, 이 실행에만 필요합니다. 과거 기록에 더한 16byte와 크기만 같을 뿐 역할은 다릅니다.</p></div></section>

<section id="inside-cache" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 현재 질문과 남길 기록의 수명을 나눕니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>현재 질문은 어느 과거 위치를 얼마나 참고할지 정하는 데 씁니다. 보관하는 기록의 첫 부분은 그 질문과 비교할 숫자이고 두 번째 부분은 비율에 따라 합칠 내용입니다. 실제 주소를 검색해 문장 원문을 꺼내는 사전과는 다릅니다.</p><p>조회 관점 4개가 기록 묶음 2개를 나눠 읽을 수 있습니다. 첫 두 관점은 묶음 0을 쓰고 나머지 두 관점은 묶음 1을 씁니다. 같은 기록을 보더라도 질문 숫자가 다르면 읽는 비율이 달라질 수 있습니다.</p></div></section>

<section id="why-cache" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 과거 질문은 다음 위치에서 다시 쓰지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>한 위치가 자기 위치와 그보다 앞선 위치만 참고하는 모델에서는 뒤에 새 위치를 붙여도 과거 위치의 계산 결과가 달라지지 않습니다. 모델 가중치와 앞부분·위치 조건이 같다면 이미 만든 기록을 다시 계산할 이유가 없습니다.</p><p>다음 위치가 묻는 질문은 새 입력에서 만들어집니다. 과거의 질문으로 이미 끝난 과거 출력을 다시 만들지 않으므로 과거 질문까지 남길 필요는 없습니다. 입력 전체를 한꺼번에 처리하거나 뒤쪽까지 함께 참고하는 모델은 이 실행 조건과 구별해야 합니다.</p></div></section>

<section id="kv-shape" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 조회와 기록에 Q·K·V라는 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>현재 조회용 벡터가 Query(Q), 비교할 기록이 Key(K), 비율에 따라 합칠 내용이 Value(V)입니다. 벡터는 여기서 숫자 2개를 나란히 둔 것입니다. 이전에 계산한 K와 V를 남긴 저장 공간이 KV cache입니다.</p><p>이 숫자들은 각 층이 입력에서 계산한 결과입니다. 문장 조각의 식별 번호인 token ID나 모든 요청이 함께 쓰는 모델 가중치 자체가 아닙니다. 아래 표에서 앞서 본 역할을 이름과 연결합니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "Token", "description": "문장을 모델이 처리하도록 나눈 단위입니다. 이 사례는 이미 처리한 3위치 뒤에 한 위치를 더합니다.", "boundary": "한 token이 항상 단어 하나이거나 글자 하나인 것은 아닙니다."}, {"term": "Head", "description": "같은 입력을 별도의 학습된 변환으로 보는 통로입니다. 현재 Q head는 4개, 저장할 KV head는 2개입니다.", "boundary": "Q head 수와 KV head 수를 구분합니다."}, {"term": "Head dimension", "description": "통로 하나가 한 위치를 표현하는 숫자 개수입니다. 이 사례는 2입니다.", "boundary": "전체 모델의 폭이나 head 개수와 다른 축입니다."}, {"term": "KV cache", "description": "이전 위치에서 계산한 K와 V를 다음 실행에 재사용하도록 남기는 상태입니다.", "boundary": "가중치·입력 원문과 다르며 요청·위치·모델 조건이 맞아야 재사용할 수 있습니다."}, {"term": "Decode", "description": "출력을 이어 쓰기 위해 새 위치를 처리하는 단계입니다. 이 글은 한 번에 한 위치를 처리합니다.", "boundary": "입력 여러 위치를 한꺼번에 계산하는 prefill에서는 현재 Q의 위치 축도 여러 칸입니다."}]} /></section>

<section id="request-trace" data-calculation-explained data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 새 K와 V를 먼저 붙이고 네 위치를 읽습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>이름을 붙였으니 3절의 실행을 숫자 칸 단위로 다시 따라갑니다. 새 위치 하나를 처리하는 동안 byte는 어디에 생기고, 무엇이 다음 실행까지 남을까요?</p></div><RecordByteTraceViz /><div className="prose prose-neutral max-w-none dark:prose-invert"><p>실행 전 K와 V는 각각 3위치 × 위치마다 KV head 2개 × head마다 숫자 2개 = 12개 숫자입니다. 숫자마다 2byte이므로 K 24byte와 V 24byte입니다.</p><p>현재 위치에서 Q 8개, K 4개, V 4개 숫자를 만듭니다. 현재 K와 V를 붙이면 저장은 각각 16개 숫자, 32byte가 되어 합계 64byte입니다. (가정)</p><p>순서도 중요합니다. 새 K와 V를 먼저 붙이기 때문에 현재 Q는 과거 3위치와 방금 붙인 자기 위치까지 읽습니다. 현재 Q의 16byte는 이 실행의 조회에 쓰고 다음 실행용 KV에는 남기지 않습니다. 다음 위치를 처리하면 같은 방식으로 KV가 다시 16byte 늘어납니다.</p><p>그래서 한 실행에서 메모리에 함께 있는 양과 다음 실행으로 넘어가는 양은 다릅니다. 읽는 동안에는 K/V 64byte와 Q 16byte를 합쳐 80byte가 있지만 넘어가는 것은 64byte입니다. 여기서 80byte는 세 배열만 더한 값이며 점수와 출력을 담는 다른 일시 배열은 넣지 않았습니다.</p><p>3절 장면의 기록 묶음은 계속 2개입니다. 조회 관점이 4개라는 이유로 저장된 두 묶음을 네 묶음으로 바꾸지 않습니다. 계산할 때의 펼친 모양은 실제 코드에서 따로 확인하겠습니다.</p></div></section>

<section id="attention-read" data-calculation-explained data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 같은 네 기록에서 출력 (2.5, 5)를 얻습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>저장한 네 줄을 어떻게 읽으면 숫자 하나의 출력이 될까요? 첫 Q head 하나만 골라 끝까지 계산합니다.</p></div><AttentionReadViz /><div className="prose prose-neutral max-w-none dark:prose-invert"><p>첫 Q head의 질문을 (1,0)으로 둡니다. 이 head가 읽는 K는 위치 순서대로 (0,1), (0,2), (0,3), (0,4)이고 V는 (1,2), (2,4), (3,6), (4,8)입니다. 다른 KV head의 값은 이 계산에 들어오지 않습니다. (가정)</p><p>먼저 질문과 각 K를 같은 자리끼리 곱해 더합니다. 세 번째 위치라면 1×0 + 0×3 = 0으로, 점수는 모두 0입니다. 폭에 따른 1/√2를 곱해도 0입니다.</p><p>점수를 양수로 바꿔 합계 1인 비율로 만드는 softmax에 같은 점수 네 개를 넣으면 각 비율은 1/4입니다. 어느 위치도 더 중요하다고 판단하지 못했으니 똑같이 나눠 읽는 셈입니다.</p><p>그 비율로 V를 합치면 첫 성분은 (1+2+3+4)/4=2.5, 둘째는 (2+4+6+8)/4=5입니다. 이것이 현재 head의 출력입니다. 다음 token 번호를 바로 고른 결과는 아니며 나머지 head와 층의 계산이 이어집니다.</p><p>비율이 늘 1/4은 아닙니다. 질문을 (0,1)로 바꾸면 점수가 c에 비례해 1/√2·2/√2·3/√2·4/√2가 되고, 비율은 약 0.065·0.131·0.266·0.539로 뒤쪽 위치에 몰립니다. 출력은 약 (3.28, 6.56)입니다. 같은 기록도 질문에 따라 다르게 읽히며, K는 이 비율을 정하는 데만 쓰이고 출력에 더해지는 값은 V입니다. (가정)</p></div></section>

<section id="kv-shape-sharing" data-calculation-explained data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. Q 4개를 유지하며 기록을 4·2·1벌로 나눕니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>Q head마다 별도 KV head를 두는 MHA라면 3위치 × KV head 4개 × K·V 2종류 × head마다 숫자 2개 × 숫자마다 2byte = 96byte입니다. 지금처럼 두 Q head가 한 KV head를 공유하는 GQA는 48byte입니다. 네 Q가 한 KV head를 모두 공유하는 MQA는 24byte입니다.</p><p>Q 4개는 세 경우 모두 남습니다. GQA의 묶음 크기는 4/2=2이고 Q head 0·1은 KV head 0, Q head 2·3은 KV head 1을 읽습니다. MQA는 기록을 가장 적게 남기지만 표현을 공유하므로 품질이 같다는 보장은 없습니다.</p></div><KvHeadSharingViz /><div className="prose prose-neutral max-w-none dark:prose-invert"><p>이 비교는 head 수만 바꾸고 위치 수·폭·숫자당 byte를 고정했습니다. 실제 모델을 바꾸면 학습과 다른 구조도 달라집니다. 다음은 지금의 GQA 사례를 배열 축과 코드로 옮기는 단계입니다.</p></div></section>

<section id="shape-layout" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 현재 Q와 저장 K/V의 길이를 구분합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>고정한 Transformers Mixtral 구현은 Q·K·V를 만든 뒤 head 축을 앞으로 옮깁니다. 요청 수가 1일 때 현재 Q의 모양은 (1,4,1,2)입니다.</p><p>갱신한 K와 V의 모양은 각각 (1,2,4,2)입니다. 네 숫자는 차례로 요청 수, head 수, 위치 수, head 폭을 뜻합니다.</p><p>원문의 forward L310~318에서 현재 Q·K·V 변환 뒤 cache.update를 호출합니다. 사례의 새 K/V는 (1,2,1,2)이고 저장된 (1,2,3,2) 뒤에 붙어 길이 4가 됩니다. 아래 식은 읽기 편하도록 요청 축을 생략하고 위치 축을 앞에 쓴 논리적 모양입니다.</p></div><CodeViewButton label="원문: 현재 Q/K/V와 cache.update" onClick={() => sidebar.navigate("current-projection", codeRefs["current-projection"])} /><ExplainedFormula
        question="왜 GQA는 attention의 Q 계산을 유지하면서도 KV cache를 줄일 수 있을까요?"
        idea={
          <>
            각 token에는 Q·K·V가 모두 생기지만 decode 뒤에도 남는 것은 K와
            V입니다. 따라서 Q head 수는 유지하고 여러 Q head가 같은 K/V head를
            읽도록 만들면, 현재 조회 관점은 여러 개로 유지하면서 과거 기록의
            사본 수만 줄일 수 있습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
Q &\in \mathbb{R}^{T_q \times H_Q \times D_{head}} \\
K,V &\in \mathbb{R}^{T_{KV} \times H_{KV} \times D_{head}}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}Q&\in\mathbb R^{\underbrace{T_q}_{\text{현재 위치}}\times\underbrace{H_Q}_{\text{질문 관점}}\times\underbrace{D_{head}}_{\text{head 폭}}}\\[4pt]K,V&\in\mathbb R^{\underbrace{T_{KV}}_{\text{저장 위치}}\times\underbrace{H_{KV}}_{\text{공유 보관함}}\times\underbrace{D_{head}}_{\text{head 폭}}}\end{aligned}`}
        operations={[
          {
            expression: String.raw`T_q\times H_Q\times D_{head}`,
            annotation: ["현재 조회에 필요한", "token·query-head·head-width 축을 만듦"],
          },
          {
            expression: String.raw`T_{KV}\times H_{KV}\times D_{head}`,
            annotation: ["과거 기록은 더 적은 KV heads로", "여러 Query가 공유하도록 저장"],
          },
          {
            expression: String.raw`H_Q/H_{KV}`,
            annotation: ["Query head 수를 KV head 수로 나눠", "보관함 하나를 공유할 Query 수를 계산"],
          },
        ]}
        terms={SHAPE_TERMS}
        assumptions={[
          "한 요청의 논리적 모양입니다. Batch 축을 생략하고 위치·head·폭 순서로 썼습니다. 실제 원문의 저장 순서는 batch·head·위치·폭입니다.",
          "현재 한 위치를 계산하는 decode는 T_q=1이고 저장된 K/V는 새 위치까지 T_KV=4입니다. 두 위치 축은 일반적으로 다릅니다.",
          "이 식은 tensor의 모양을 나타내며 실제 memory에는 dtype·alignment·block metadata가 더 필요합니다.",
        ]}
        interpretation="MHA는 H_Q=H_KV, GQA는 1<H_KV<H_Q, MQA는 H_KV=1입니다. Cache의 head 축은 H_Q가 아니라 H_KV이므로 같은 저장 길이와 D_head에서 H_KV를 8에서 2로 줄이면 K/V 원소 수도 4분의 1이 됩니다."
        title="Q와 K/V shape의 각 축"
      /></section>

<section id="source-repeat-kv" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. repeat_kv는 head를 0·0·1·1로 짝지읍니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>Transformers v5.15.0의 repeat_kv에 (1,2,4,2)와 n_rep=2를 넣습니다. L252의 expand는 중간 축을 넣어 (1,2,2,4,2)로 보고 L253의 reshape는 (1,4,4,2)로 만듭니다. 계산용 head 순서는 0·0·1·1입니다.</p><p>이 함수가 돌려준 배열을 eager_attention_forward가 점수 계산에 씁니다. cache.update에 저장한 K/V를 네 head로 다시 저장하는 코드가 아닙니다. 따라서 다음 실행까지 남는 사례의 KV는 여전히 64byte입니다.</p><p>expand 자체는 기존 저장 공간을 바라보는 view지만 이어지는 reshape는 배치된 모양에 따라 복사할 수 있습니다. 함수 전체가 항상 무복사라고 말할 수는 없습니다. 다른 attention backend는 실제로 네 벌 배열을 만들지 않고 공유 head를 직접 읽을 수도 있습니다.</p></div><CodeViewButton label="원문: repeat_kv 전체 함수" onClick={() => sidebar.navigate("repeat-kv-heads", codeRefs["repeat-kv-heads"])} /><CodeViewButton label="원문: 펼친 K/V로 점수와 출력 계산" onClick={() => sidebar.navigate("eager-read", codeRefs["eager-read"])} /><div id="expand-doc" className="mt-8 scroll-mt-20"><CitationBlock source="PyTorch 2.14 · expand / reshape" citeKey={1} href="https://docs.pytorch.org/docs/2.14/generated/torch.reshape.html"><q>Otherwise, it will be a copy.</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>PyTorch reshape 문서의 조건입니다. 펼친 뒤 축을 합칠 때도 이 조건을 확인해야 하므로 현재 사례의 일시 배열 용량을 무조건 0으로 셀 수 없습니다.</p></div></div></section>

<section id="source-cache-update" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 실제 DynamicLayer는 위치 축에 새 기록을 잇습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>같은 버전의 DynamicLayer.update는 L144~145에서 기존 keys와 새 key_states, 기존 values와 새 value_states를 torch.cat으로 잇습니다. dim=-2는 head 폭 바로 앞인 위치 축입니다. 사례의 길이 3과 새 길이 1이 합쳐져 4가 됩니다.</p><p>이 경로는 torch.cat으로 새 결과 텐서를 만드는 방식입니다. 저장 용량이 48→64byte라는 계산이 물리 주소를 그대로 유지하며 16byte만 쓰는 구현을 뜻하지는 않습니다. 실제 복사량과 최대 순간 사용량은 별도로 봐야 합니다.</p><p>Mixtral의 eager 경로는 갱신한 K/V를 받은 뒤 Q와 K의 곱, softmax, V의 가중합을 계산합니다. 평가 모드에서 dropout이 적용되지 않는 사례로 8절의 값들을 넣으면 점수 0 네 개와 출력 (2.5,5)가 같은 순서로 나옵니다.</p></div><CodeViewButton label="원문: DynamicLayer.update의 두 torch.cat" onClick={() => sidebar.navigate("dynamic-update", codeRefs["dynamic-update"])} /><div id="source-read-order" className="mt-8 scroll-mt-20"><CitationBlock source="Transformers v5.15.0 · eager_attention_forward" citeKey={1} href="https://github.com/huggingface/transformers/blob/5eddc12edfaf8cafde8c9bae4ccb12f8a139b4f9/src/transformers/models/mixtral/modeling_mixtral.py#L269-L275"><q>attn_output = torch.matmul(attn_weights, value_states)</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>각 weight가 1/4인 행과 네 V를 곱하면 (2.5,5)입니다. 여기서는 위치 변환을 끝낸 K를 위 숫자로 가정하며 GPU 성능을 측정한 결과는 아닙니다.</p></div></div></section>

<section id="paper-mqa" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">13. MQA 원문은 K/V의 head 축을 없앱니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>Multi-Query Attention 논문의 §2.4는 새 K/V를 과거 기록에 붙이는 점진적 계산을 다룹니다. §3은 이 기록과 K/V 변환에서 여러 head 축을 없애고 Q의 여러 head는 유지합니다. 우리 사례에서 KV head 2를 1로 바꾸면 저장은 48→24byte입니다.</p><p>해결하려는 문제는 매 실행마다 과거 기록을 읽는 비용입니다. 작은 batch와 긴 기록에서 저장 장치와 계산 장치 사이의 전송이 오래 걸릴 수 있습니다. 논문의 속도와 품질 결과는 해당 학습·작업·장비 조건의 증거이며 모든 decode가 전송에 지배된다는 법칙은 아닙니다.</p></div><div id="mqa-original" className="mt-8 scroll-mt-20"><CitationBlock source="MQA v1 · Abstract / §3" citeKey={1} href="https://arxiv.org/html/1911.02150v1#S3"><q>the keys and values are shared across all of the different attention &quot;heads&quot;</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            네 Q head가 하나의 KV head를 공유한다면 3위치×1head×2종류×폭 2×2byte=24byte입니다. 원문의 head 축 제거를 작은 사례에 적용한 계산입니다.
          </p></div></div></section>

<section id="paper-gqa" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">14. GQA 원문은 묶음별 평균 뒤 다시 학습합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>GQA 논문의 §2.2는 여러 Q head를 중간 개수의 묶음으로 나눕니다. 기존 MHA에서 바꿀 때는 같은 묶음의 K/V 변환 가중치를 평균낸 뒤 추가 학습합니다. 4개를 2개로 바꾸는 사례라면 0·1과 2·3의 가중치를 각각 평균내어 두 KV head를 시작합니다.</p><p>실제로 평균내는 대상은 이미 계산한 요청의 KV 배열이 아니라 모델의 변환 가중치입니다. 두 숫자 가중치가 2와 4라면 시작 평균은 3이지만 그 변환을 쓴 품질은 다시 평가해야 합니다. 단순히 cache 절반을 버리는 절차가 아닙니다. (가정)</p><p>논문은 T5 계열에 원래 학습 step의 5%를 추가하는 조건을 사용했습니다. Table 1의 XXL 비교에서는 MHA의 샘플당·TPU 칩당 시간 1.51초·평균 점수 47.2와 GQA-8 0.28초·47.1을 보고합니다. 8 TPU v4와 모델별 가능한 batch 설정의 결과이며 우리 4-head 사례의 측정값은 아닙니다.</p></div><div id="gqa-original" className="mt-8 scroll-mt-20"><CitationBlock source="GQA v3 §2.2" citeKey={1} href="https://arxiv.org/html/2305.13245v3#S2.SS2"><q>mean-pooling all the original heads within that group.</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>4→2 묶음의 출발점을 만드는 연산입니다. 저장량 96→48byte는 이 사례의 모양 계산이고 품질 유지는 원문의 추가 학습과 평가 범위에서 판단해야 합니다.</p></div></div></section>

<section id="kv-shape-formula" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">15. 같은 셈을 모든 층에 더해 토큰당 byte를 구합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>지금 사례는 한 층에서 새 위치 하나에 16byte를 남겼습니다. 같은 구조의 층이 32개라면 32×16=512byte입니다. 모든 층이 같을 때는 곱하고 층마다 head 수나 폭이 다르면 각 층의 byte를 합합니다.</p><p>Llama 3 논문 Table 3의 8B는 32층·모델 폭 4096·Q head 32·KV head 8입니다. head 폭은 4096/32=128입니다. cache를 BF16의 원소당 2byte로 가정하면 32×8×128×2×2=131072byte, 즉 128KiB입니다.</p><p>같은 나머지 조건에서 KV head도 32개인 MHA를 가정하면 524288byte, 512KiB로 네 배입니다. 이 비교는 모델 전체의 논리적 기록 크기이며 현재 GPU 한 장에 이만큼 그대로 배정됐다는 관측은 아닙니다.</p></div>
<FactorStructureViz
  eyebrow="token 하나가 남기는 KV"
  title="층마다 K와 V의 8개 head를 남기므로 네 축이 모두 저장량에 들어갑니다"
  description="각 묶음은 layer, KV head, head 안의 숫자, K·V 두 벌, 원소 byte 가운데 한 축입니다. Q head 32개는 저장 축에 넣지 않습니다."
  factors={[
    {label:"KV layer",value:"32",detail:"같은 저장 모양을 가진 층 수입니다.",marks:8},
    {label:"layer마다 KV head",value:"8",detail:"Q head 32가 아닌 저장 head입니다.",marks:8,accent:true},
    {label:"head 폭",value:"128",detail:"4096÷Q head 32입니다.",marks:8},
    {label:"K·V와 dtype",value:"2벌 × 2B",detail:"K와 V 각각을 BF16으로 둡니다.",marks:4},
  ]}
  equation="32 layer × 8 KV head × 128원소 × 2벌 × 2B"
  result="131,072B = 128KiB/token"
  note="논리적인 tensor payload입니다. block metadata, 정렬, allocator 여유와 tensor parallel 배치는 포함하지 않습니다."
/>
<ExplainedFormula
        question="과거 token 하나를 cache에 더 넣을 때 GPU memory는 몇 byte 늘어날까요?"
        idea={
          <>
            한 layer에서 K/V tensor의 head 수와 head당 원소 수를 세고, K와 V의
            tensor 수와 원소당 byte를 곱합니다. 모든 KV layer가 같은 shape라면
            마지막으로 layer 수를 곱하면 됩니다.
          </>
        }
        formula={String.raw`\begin{aligned}
E_{KV} &= H_{KV}D_{head} \\
B_{token} &= L_{KV}E_{KV}N_{tensor}b_{dtype}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}E_{KV}&=\underbrace{H_{KV}}_{\text{KV heads}}\underbrace{D_{head}}_{\text{head 폭}}\\[4pt]A_{store}&=\underbrace{N_{tensor}}_{\text{K·V 수}}\underbrace{b_{dtype}}_{\text{원소 byte}}\\[4pt]B_{token}&=\underbrace{L_{KV}}_{\text{KV layers}}\underbrace{E_{KV}}_{\text{layer당 폭}}\underbrace{A_{store}}_{\text{저장 byte 계수}}\end{aligned}`}
        operations={[
          {
            expression: String.raw`H_{KV}D_{head}`,
            annotation: ["token 하나가 layer 하나에 남길", "K 또는 V의 원소 수를 계산"],
          },
          {
            expression: String.raw`N_{tensor}b_{dtype}`,
            annotation: ["K·V tensor 개수와 dtype byte를 곱해", "한 원소 폭을 실제 bytes로 변환"],
          },
          {
            expression: String.raw`L_{KV}E_{KV}N_{tensor}b_{dtype}`,
            annotation: ["각 KV layer의 기록 크기를 더해", "token 하나의 총 memory 증가량을 계산"],
          },
        ]}
        terms={BYTE_TERMS}
        assumptions={[
          "한 모델 전체의 논리 용량이며 모든 층에서 K/V 수·폭·dtype이 같은 경우입니다. GPU 한 장의 물리 할당량은 아닙니다.",
          "모든 위치를 보존하며 마지막 block 빈칸·정렬·scale·allocator metadata를 제외합니다. 실제 window 보존 길이는 별도로 넣습니다.",
          "Layer별 KV head 수나 head_dim이 다르면 한 번 곱하지 않고 layer별 byte를 합산합니다.",
        ]}
        interpretation="Q head 수나 전체 hidden size가 아니라 실제로 cache에 남기는 KV head의 수와 폭을 세어야 합니다. 같은 KV 예산에서는 이 값의 역수 방향으로 보관 가능한 token 수가 늘어납니다."
        title="KV cache 식에서 각 항이 맡는 역할"
      /><div id="llama-table" className="mt-8 scroll-mt-20"><CitationBlock source="The Llama 3 Herd v3 · §3.2 Table 3" citeKey={1} href="https://arxiv.org/html/2407.21783v3#S3.SS2"><q>32 · 4096 · 32 · 8</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>Table 3의 8B 열에서 층 수·모델 폭·Q head·KV head를 읽어 128KiB를 유도했습니다. BF16 cache 선택은 본문의 계산 가정입니다.</p></div></div></section>

<section id="model-configs" data-calculation-explained data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">16. 실제 설정에서 KV를 남기는 층을 셉니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>15절의 곱셈을 실제 모델에 옮기려면 층 수부터 정해야 합니다. 64층 모델이라면 64를 그대로 곱해도 될까요?</p></div><KvLayerCountViz /><div className="prose prose-neutral max-w-none dark:prose-invert"><p>2026-10-04에 확인한 Qwen3.6-27B 고정 config에는 64층 중 full attention 16개와 linear attention 48개가 있습니다. 그림의 채운 칸인 full attention층은 15절처럼 위치마다 K와 V를 쌓으므로 곱셈에 들어갑니다. 빈 칸인 linear attention층은 위치마다 기록을 쌓지 않고 요청마다 크기가 정해진 반복 상태를 쓰므로 이 곱셈에서 빠집니다.</p><p>이제 Qwen의 token 하나를 셀 수 있습니다. Full attention 16층 × 층마다 KV head 4개 × head마다 값 256개 × K·V 2종류 × BF16 값마다 2byte = token당 65,536byte, 곧 64KiB입니다. 64층을 그대로 곱했다면 네 배인 256KiB가 나왔을 것입니다.</p><p>빠진 48층의 메모리가 0이라는 뜻은 아닙니다. 그 상태는 토큰당 attention KV 계산에 들어 있지 않을 뿐이며 config의 mamba_ssm_dtype도 float32로 별도 지정됩니다. attention cache를 BF16으로 가정했다고 모든 내부 상태가 2byte가 되지는 않습니다.</p><p>Muse Glimmer는 층을 세는 방식이 다릅니다. 고정 config의 52층은 모두 KV head 2·폭 128이고 39층은 길이 2048의 window, 13층은 전체 문맥을 봅니다.</p><p>보는 범위는 달라도 모두 K와 V를 남기고 한 층의 모양이 같으므로, 모든 위치를 보존한다고 근사하면 52층을 한 번에 곱할 수 있습니다. 52층 × 층마다 KV head 2개 × head마다 값 128개 × K·V 2종류 × 값마다 2byte = token당 53,248byte, 곧 52KiB로 Qwen attention 몫의 81.25%입니다.</p><p>층은 Muse가 세 배 이상 많은데 결과가 더 작은 이유는 한 층의 크기에 있습니다. 한 층이 위치마다 남기는 양은 Qwen이 4×256×2×2=4,096byte이고 Muse는 2×128×2×2=1,024byte로 4분의 1입니다.</p></div><CalculationWalkthrough
 title="token 하나의 KV를 차례로 셉니다"
 question="두 모델은 token 하나를 처리할 때 attention KV를 몇 byte 남길까요?"
 scope="모델 전체의 논리 용량입니다. BF16 cache를 가정하고 모든 위치를 남긴다고 근사했습니다."
 steps={[
  {label:"Qwen에서 곱할 층",expression:"64층 − linear 48층",result:"16층",reason:"linear attention층은 위치마다 K와 V를 쌓지 않아 뺍니다."},
  {label:"Qwen의 값 개수",expression:"16층 × head 4개 × 값 256개",result:"16,384개",reason:"K 한 벌이 token 하나에 남기는 숫자 수입니다."},
  {label:"Qwen의 byte",expression:"16,384개 × K·V 2종류 × 2byte",result:"65,536byte = 64KiB",reason:"K와 V가 각각 있고 값마다 2byte입니다."},
  {label:"Muse의 값 개수",expression:"52층 × head 2개 × 값 128개",result:"13,312개",reason:"52층 모두 K와 V를 남기고 모양이 같습니다."},
  {label:"Muse의 byte",expression:"13,312개 × K·V 2종류 × 2byte",result:"53,248byte = 52KiB",reason:"window 층도 아직 줄이지 않은 근사입니다."},
  {label:"둘의 비율",expression:"52KiB ÷ 64KiB",result:"81.25%",reason:"분자와 분모 모두 attention KV만 셉니다."},
 ]}
 conclusion="Qwen attention 몫은 token당 64KiB이고, 모든 위치를 남긴다고 본 Muse는 52KiB입니다."
 caveats={["Qwen linear 48층의 반복 상태는 뺐습니다.","block 빈칸·정렬·allocator 여유와 GPU별 분할은 넣지 않았습니다."]}
/><div className="prose prose-neutral max-w-none dark:prose-invert"><p>token 하나의 크기를 구했지만 Muse의 52KiB에는 모든 위치를 보존한다는 근사가 남아 있습니다. window 층이 정말 오래된 기록을 지운다면 문맥이 길어질수록 이 곱셈은 어떻게 어긋날까요?</p></div><KvRetentionCurveViz /><div className="prose prose-neutral max-w-none dark:prose-invert"><p>Muse의 층 하나는 위치마다 1,024byte, 곧 1KiB를 남깁니다. 실제로 오래된 local 기록을 회수한다면 길이 2048을 넘긴 뒤 39층의 보존량은 계속 선형 증가하지 않습니다. 39층 × 층마다 1KiB × 2,048위치 = 79,872KiB, 곧 78MiB에서 멈추고 그 뒤로는 전체 문맥을 보는 13층만 token당 13KiB씩 늘어납니다. (가정)</p><p>8,192 token에서 비교해 보겠습니다. 13층은 13KiB × 8,192위치 = 104MiB이고 여기에 멈춘 78MiB를 더하면 182MiB입니다. 52KiB × 8,192위치로 곱한 416MiB와 두 배 넘게 차이 납니다. 따라서 52KiB를 임의의 긴 문맥에 곱한 값을 실제 할당량으로 단정하지 않습니다.</p><p>2048 안쪽에서는 두 계산이 같으므로 짧은 문맥이라면 52KiB로 어림해도 맞습니다. 다만 81.25%라는 비율도 이 구간에서만 유지되며, 회수를 가정하면 2048을 넘긴 뒤로 Qwen attention 몫 대비 비율이 계속 내려갑니다. 여기까지는 층 하나의 모양이 모델 안에서 같았습니다. 다음 절의 모델은 층 종류마다 모양까지 다릅니다.</p></div><CodeViewButton label="고정 config: 16 full + 48 linear" onClick={() => sidebar.navigate("qwen-config", codeRefs["qwen-config"])} /><CodeViewButton label="고정 config: 39 sliding + 13 full" onClick={() => sidebar.navigate("muse-config", codeRefs["muse-config"])} /></section>

<section id="kv-shape-runtime" data-calculation-explained data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">17. Gemma는 local과 global의 폭을 따로 셉니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>층마다 head 수와 폭, 남기는 길이까지 다르면 곱셈 한 번으로 셀 수 없습니다. 그러면 층 종류별로 어떻게 나눠 세고, 한 번에 곱했을 때와 얼마나 달라질까요?</p></div><GemmaRetentionAreaViz /><div className="prose prose-neutral max-w-none dark:prose-invert"><p>Gemma 4 31B의 고정 text config는 60층 중 50 local층에 KV head 16·폭 256·window 1024를, 10 global층에 KV head 4·폭 512를 둡니다. 그림의 첫 장면처럼 local층은 좁고 높으며 global층은 넓고 낮습니다. 층 전체를 60층 × 층마다 KV head 16개 × head마다 값 256개로 쓰면, local 모양을 global층까지 복제한 대용 계산이 됩니다.</p><p>층 모양을 byte로 옮기면 위치 하나의 높이가 나옵니다. Local층 하나는 16×256×2×2=16,384byte, 곧 16KiB이고 50층이면 800KiB입니다. Global층 하나는 4×512×2×2=8,192byte, 곧 8KiB이고 10층이면 80KiB입니다. 그림의 세로축 800과 80이 이 값이며, 여기에 남긴 위치 수를 곱하면 넓이, 곧 용량입니다.</p><p>4096위치를 처리했고 local은 정확히 1024위치까지 보존한다고 가정합시다. BF16 local cache는 50층 × head 16개 × 값 256개 × K·V 2종류 × 2byte × 1,024위치입니다. 결과는 800MiB입니다. Global cache는 10층 × head 4개 × 값 512개 × K·V 2종류 × 2byte × 4,096위치입니다. 결과는 320MiB이고, local과 합치면 1,120MiB입니다. (가정)</p><p>위치당 높이는 local이 열 배인데 전체 용량은 2.5배에 그칩니다. Local이 남기는 폭이 4분의 1이기 때문입니다.</p></div><CalculationWalkthrough
 title="두 층 종류를 따로 셉니다"
 question="4096위치를 처리한 Gemma의 KV는 얼마이고 uniform 대용 계산과 얼마나 다를까요?"
 scope="BF16 cache의 논리 용량입니다. local은 정확히 1024위치까지 남긴다고 가정합니다."
 steps={[
  {label:"local의 위치당 크기",expression:"50층 × 16 × 256 × 2 × 2byte",result:"800KiB",reason:"층 수·head·값·K·V 종류·값당 byte 순서입니다."},
  {label:"local 전체",expression:"800KiB × 1,024위치",result:"800MiB",reason:"window 안의 위치만 남깁니다."},
  {label:"global의 위치당 크기",expression:"10층 × 4 × 512 × 2 × 2byte",result:"80KiB",reason:"head는 적고 폭은 local의 두 배입니다."},
  {label:"global 전체",expression:"80KiB × 4,096위치",result:"320MiB",reason:"전체 문맥을 보므로 모든 위치를 남깁니다."},
  {label:"층별 합계",expression:"800MiB + 320MiB",result:"1,120MiB",reason:"모양이 다른 두 조각을 더합니다."},
  {label:"uniform 대용 계산",expression:"60층 × 16KiB × 4,096위치",result:"3,840MiB",reason:"모든 층을 local 모양으로 세고 모든 위치를 남깁니다."},
  {label:"모양만 바로잡기",expression:"(800 + 80)KiB × 4,096위치",result:"3,520MiB",reason:"global층의 폭을 바로잡아 320MiB 줄었습니다."},
  {label:"보존 길이까지 반영",expression:"3,520MiB − 800KiB × 3,072위치",result:"1,120MiB",reason:"local이 남기지 않는 3,072위치에서 2,400MiB가 줄었습니다."},
 ]}
 conclusion="층별 계산은 1,120MiB로 대용 계산 3,840MiB의 29.2%이고, 줄어든 2,720MiB 중 2,400MiB는 local의 보존 길이에서 나옵니다."
 caveats={["실제 엔진의 block 배정·padding·회수 시점은 측정하지 않았습니다.","GPU별 분할과 allocator 여유는 넣지 않았습니다."]}
/><div className="prose prose-neutral max-w-none dark:prose-invert"><p>장부의 마지막 두 줄이 이 절의 핵심입니다. 층 모양을 바로잡아 줄어드는 양은 320MiB뿐이고 2,400MiB는 보존 길이에서 나오므로, 이 조건에서 대용 계산을 크게 벌리는 쪽은 폭보다 window입니다. 다만 1120MiB는 층별 폭과 보존 길이를 반영한 논리 용량이며 실제 엔진의 block 배정·padding·회수 시점을 측정한 값은 아닙니다.</p><p>Global층의 ×2에는 확인할 점이 하나 더 남았습니다. config의 attention_k_eq_v=true를 보면 K와 V가 같으니 한 벌만 저장한다고 읽기 쉽습니다.</p></div><GemmaKvPathViz /><div className="prose prose-neutral max-w-none dark:prose-invert"><p>config의 attention_k_eq_v=true도 저장 텐서가 하나라는 뜻으로 바로 읽을 수 없습니다. 실제 구현은 global층에서 raw key 변환을 value의 출발값으로 쓰지만 K에는 별도 정규화와 위치 회전을, V에는 자체 정규화를 적용한 뒤 두 값을 cache.update에 넘깁니다. 같은 값이 두 번 저장되는 것도 아니고, 출발만 같을 뿐 도착한 K와 V는 서로 다른 값입니다.</p><p>그래서 global 계산에 K·V 2종류를 그대로 두었고 320MiB는 K 160MiB와 V 160MiB의 합입니다. 공유되는 것은 변환 가중치이므로 V 쪽 가중치는 줄어도, 위치마다 쌓이는 cache까지 함께 줄지는 않습니다. 여기까지가 head 수와 길이를 바꾸는 방법이었고, 다음 절은 기록을 적는 형태 자체를 바꿉니다.</p></div><CodeViewButton label="고정 config: 두 종류의 head와 window" onClick={() => sidebar.navigate("gemma-config", codeRefs["gemma-config"])} /><CodeViewButton label="원문: K/V가 함께 시작하는 조건" onClick={() => sidebar.navigate("gemma-shared-projection", codeRefs["gemma-shared-projection"])} /><CodeViewButton label="원문: 달라진 K/V를 둘 다 cache에 전달" onClick={() => sidebar.navigate("gemma-cache-write", codeRefs["gemma-cache-write"])} /></section>

<section id="cache-representation-design" data-calculation-explained data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">18. 같은 기록을 더 작은 공통 숫자로 나타낼 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>지금까지는 숫자의 개수를 정해 두고 몇 벌 남길지를 줄였습니다. 위치마다 적어 둔 네 숫자가 사실 한 숫자에서 나온다면 넷을 다 적어야 할까요?</p></div><LatentStorageViz /><div className="prose prose-neutral max-w-none dark:prose-invert"><p>8절의 첫 head를 다시 봅니다. K는 (0,1), (0,2), (0,3), (0,4)이고 V는 (1,2), (2,4), (3,6), (4,8)이어서 네 위치에 숫자 16개가 있습니다.</p><p>표를 세로로 읽으면 규칙이 보입니다. 이 head는 K=(0,c), V=(c,2c)로 쓸 수 있고, c가 1·2·3·4이면 8절의 네 K/V가 그대로 나옵니다. 이 사례는 위치마다 네 숫자를 따로 저장하는 대신 c 한 숫자를 남겨도 해당 K/V를 표현할 수 있게 정했습니다. (가정)</p><p>되살리는 방법은 곱셈 한 번입니다. 세 번째 위치라면 c=3에 K 쪽 열벡터 (0,1)을 곱해 (0,3)을, V 쪽 열벡터 (1,2)를 곱해 (3,6)을 얻습니다. 열벡터 두 개는 위치마다 저장하지 않고 모든 위치가 함께 쓰는 변환입니다. 저장은 숫자 16개 × 2byte = 32byte에서 숫자 4개 × 2byte = 8byte로 줄고, 7절의 64byte 가운데 이 head의 몫이 32byte입니다.</p><p>이렇게 큰 표현을 만드는 작은 공통 벡터가 latent입니다. MLA는 학습한 낮은 차원의 표현을 이용합니다. DeepSeek-V2 §2.1.2의 식 (9)는 입력을 작은 c로 만들고 식 (10)과 (11)은 c에서 K와 V를 만드는 선형 변환을 씁니다.</p><p>앞서 GQA는 같은 기록을 나눠 읽을 head 개수를 바꿨습니다. 여기서는 저장 표현 자체를 바꿉니다.</p><p>그림의 마지막 장면처럼 임의의 K/V 네 숫자를 항상 한 숫자로 손실 없이 줄일 수 있다는 주장은 아닙니다. K의 첫 칸은 c×0이므로 K=(1,0) 같은 기록은 어떤 c로도 만들 수 없습니다. (가정) 모델이 어떤 표현을 학습했는지가 전제이며, 8byte에는 위치 회전용 기록도 아직 들어 있지 않습니다. 저장이 줄어든 것은 확인했으니 다음 질문은 읽는 쪽입니다. 읽을 때마다 K와 V를 전부 되살려야 한다면 계산 비용이 남습니다.</p></div><div id="mla-original" className="mt-8 scroll-mt-20"><CitationBlock source="DeepSeek-V2 v5 · §2.1.2, equations (9)–(11)" citeKey={1} href="https://arxiv.org/html/2405.04434v5#S2.SS1.SSS2"><q>cₜᴷⱽ = Wᴰᴷⱽhₜ</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>사례의 cₜ=1·2·3·4와 K 쪽 열벡터 (0,1), V 쪽 열벡터 (1,2)를 넣으면 앞의 네 K/V를 만들 수 있습니다. 표기는 원문의 KV latent 경로를 읽기 쉽게 옮긴 것입니다.</p></div></div></section>

<section id="mla-vs-gqa" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">19. MLA는 매번 전체 K/V를 펼치지 않아도 됩니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>같은 질문 q=(1,0)에 K=(0,c)를 내적하면 모든 점수가 0입니다. K를 먼저 만들지 않고 K 변환의 전치를 q에 곱하면 변환된 질문도 0이므로 c와 바로 비교해 같은 점수를 얻습니다. 어느 쪽도 아직 위치 회전을 넣지 않은 계산입니다.</p><p>V도 각각 펼친 뒤 더할 필요가 없습니다. 비율 1/4로 latent 1·2·3·4를 먼저 평균내면 2.5입니다. 여기에 V 변환 (1,2)를 적용하면 (2.5,5)입니다. 8절과 같은 출력이지만 계산 순서가 다릅니다.</p><p>DeepSeek-V2는 식 (11) 뒤에서 K의 상향 변환을 query 변환에, V의 상향 변환을 output 변환에 흡수할 수 있다고 설명합니다. 따라서 MLA가 모든 과거 K/V를 매번 복원해야 한다고 일반화할 수 없습니다. 실제 query·출력 계산과 사용하는 kernel의 비용은 남습니다.</p></div><MlaAbsorbViz /><ExplainedFormula title="행렬을 곱하는 순서를 바꿔 latent를 바로 읽습니다"
 question="과거의 K와 V를 모두 펼치지 않고 같은 출력을 계산할 수 있을까요?"
 idea="선형 곱에서는 괄호 위치를 바꿀 수 있습니다. K 쪽 행렬은 현재 질문으로 옮기고 V 쪽 행렬은 latent를 합친 뒤 한 번 적용합니다."
 formula={String.raw`q^\top(W_Kc_t)=(W_K^\top q)^\top c_t,\qquad \sum_t a_t(W_Vc_t)=W_V\left(\sum_t a_tc_t\right)`}
 annotatedFormula={String.raw`\underbrace{(W_K^\top q)}_{\text{변환한 현재 질문}}^\top\underbrace{c_t}_{\text{저장 latent}},\qquad \underbrace{W_V}_{\text{출력 변환}}\underbrace{\left(\sum_t a_tc_t\right)}_{\text{먼저 합친 latent}}`}
 operations={[{expression:String.raw`W_K^\top q`,annotation:["K 복원 행렬을 현재 질문에 옮기면","이 사례의 변환 질문은 0입니다."]},{expression:String.raw`\sum_t a_tc_t`,annotation:["비율 1/4로 1·2·3·4를 합치면","2.5가 됩니다."]},{expression:String.raw`W_V(2.5)`,annotation:["합친 값에 (1,2)를 한 번 적용하면","원래 출력 (2.5,5)를 얻습니다."]}]}
 terms={[{symbol:"q",name:"현재 질문",description:"본 사례의 첫 Q head 벡터 (1,0)입니다."},{symbol:"c_t",name:"위치별 latent",description:"K와 V를 만드는 작은 공통 표현으로 여기서는 1·2·3·4입니다."},{symbol:"W_K",name:"K를 만드는 행렬",description:"본문의 W_UK 역할이며 이 사례에서는 열벡터 (0,1)입니다."},{symbol:"W_V",name:"V를 만드는 행렬",description:"본문의 W_UV 역할이며 이 사례에서는 열벡터 (1,2)입니다."},{symbol:"a_t",name:"읽을 비율",description:"점수로 정한 attention weight이며 이 사례는 모두 1/4입니다."}]}
 assumptions={["위치마다 같은 선형 W_K·W_V를 쓰며 이 식에는 위치 회전을 넣지 않았습니다.","임의의 K/V가 한 숫자로 압축된다는 주장이 아닙니다. 이 사례는 처음부터 해당 행렬로 만들 수 있게 정했습니다.","실제 MLA의 위치 관련 key는 별도 경로입니다. 출력·query 변환과 kernel의 실제 비용은 남습니다."]}
 interpretation="원문 식 (9)~(11)의 선형 경로에 사례를 적용한 결과입니다. 모든 과거 위치의 전체 K/V를 매번 복원해야 한다는 결론은 나오지 않습니다." /><div id="mla-absorption" className="mt-8 scroll-mt-20"><CitationBlock source="DeepSeek-V2 v5 · after equation (11)" citeKey={1} href="https://arxiv.org/html/2405.04434v5#S2.SS1.SSS2"><q>can be absorbed</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>원문이 설명한 행렬 흡수를 같은 작은 사례에서 전개했습니다. 이 재배치는 모든 입력의 attention 연산량을 GQA와 같게 만든다는 뜻은 아닙니다.</p></div></div></section>

<section id="position-key" data-calculation-explained data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">20. 위치 회전용 기록은 별도 경로에 남습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>19절의 계산에는 위치 정보가 없었습니다. 실제 attention은 내용뿐 아니라 위치 차이도 구별해야 하는데, 여기에 위치를 넣어도 K 변환을 질문 쪽으로 옮길 수 있을까요?</p></div><PositionKeyPathViz /><div className="prose prose-neutral max-w-none dark:prose-invert"><p>벡터를 위치에 따라 회전하는 RoPE를 앞의 K 경로에 그대로 섞으면 위치마다 다른 회전 행렬이 들어갑니다. 행렬 곱은 일반적으로 순서를 바꿀 수 없으므로 한 번 정한 query 변환에 전부 흡수하기 어려워집니다.</p><p>그림은 이 문제를 작은 숫자로 보여 줍니다. K 변환 (0,1)을 위치마다 0도, 90도, 180도, 270도 돌리면 (0,1), (-1,0), (0,-1), (1,0)이 되고 질문 (1,0)과 곱한 값은 0, -1, 0, 1입니다. 19절에서는 c 앞에 곱할 값이 0 하나였지만 이제 위치마다 달라서 값 하나로 미리 계산해 둘 수 없습니다. (가정)</p><p>DeepSeek-V2 §2.1.3은 위치 회전용 key를 내용 latent와 나눈 경로로 둡니다. 내용 쪽은 19절처럼 흡수하고 회전이 필요한 쪽만 따로 계산하는 구조입니다. 대신 저장할 숫자가 늘어나므로 Table 1의 MLA cache 원소 수는 층마다 latent 폭 dc와 별도 위치 key 폭 dR을 더한 (dc+dR)L입니다. c만 세는 계산보다 큽니다.</p><p>우리 toy에서 latent 폭 1 외에 위치 key 숫자 1개를 별도로 둔다면 한 위치에 (1+1)×2=4byte이고 네 위치는 16byte입니다. 위치 key까지 없는 8byte와 구별해야 합니다. 이 숫자는 실제 DeepSeek의 폭이나 성능이 아닌 식의 적용 예입니다. (가정)</p><p>정리하면 작은 표현의 실제 크기는 내용 latent만으로 셀 수 없습니다. 18절의 8byte는 위치 key를 뺀 값이고, 21절에서 층마다 512개가 아니라 576개를 세는 이유도 같습니다.</p></div><div id="mla-position" className="mt-8 scroll-mt-20"><CitationBlock source="DeepSeek-V2 v5 · §2.1.3 and Table 1" citeKey={1} href="https://arxiv.org/html/2405.04434v5#S2.SS1.SSS3"><q>Decoupled Rotary Position Embedding</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>내용 latent와 위치 key를 분리하는 원문 경로입니다. 추가 저장 항까지 포함해야 작은 표현이 실제로 차지하는 용량을 비교할 수 있습니다.</p></div></div></section>

<section id="parallel-budget" data-calculation-explained data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">21. GPU 한 장의 저장량과 모델 전체를 구분합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>여러 GPU로 head를 나누는 tensor parallel에서는 한 GPU가 담당한 KV head를 셉니다. KV head보다 GPU가 많아 일부 head를 복제하는 구현이라면 전체 byte를 GPU 수로 단순히 나누면 틀립니다. 층을 나누는 pipeline parallel에서는 담당 층 수를 셉니다.</p>
<p>vLLM의 GQA attention은 KV head 수가 TP 크기 이상이면 head를 나누고, 그보다 적으면 같은 head를 여러 rank에 복제합니다. 16절의 Qwen3.6-27B full attention층은 KV head가 4개라 TP4까지는 rank마다 다른 head를 들지만, TP8에서는 두 rank가 같은 head를 함께 듭니다.</p>
<p>MLA는 나눌 head가 처음부터 하나입니다. 19절의 흡수 뒤에는 모든 query head가 latent 512개와 위치 key 64개, 합쳐 576개 숫자를 KV head 하나처럼 함께 읽습니다. vLLM도 MLA 층의 cache를 KV head 1개, 폭 576으로 등록합니다.</p>
<p>그래서 TP rank마다 같은 latent 기록이 통째로 복제됩니다. GPU를 8장 쓰면 가중치는 8로 나뉘지만, MLA KV를 몇 token 담을 수 있는지는 GPU 한 장의 남은 공간이 정합니다.</p></div>
<TpKvPlacementViz />
<div className="prose prose-neutral max-w-none dark:prose-invert"><p>Kimi K2.5와 DeepSeek-V3 계열은 61층입니다. BF16 cache라면 토큰당 61층 × 576개 × 2byte = 70,272byte, 약 68.6KiB입니다. 20만 token 요청 하나면 약 14GB이고, 이 14GB가 rank마다 똑같이 놓입니다. (계산)</p></div>
<CalculationWalkthrough
 title="MLA KV를 rank 단위로 셉니다"
 question="Kimi K2.5 요청 하나의 20만 token KV는 GPU 한 장에 얼마나 놓일까요?"
 scope="BF16 latent cache, 61층, TP8, DCP 없음. block padding과 FP8 scale은 넣지 않은 논리 용량입니다."
 steps={[
  {label:"층마다 남기는 폭",expression:"512 + 64",result:"576개",reason:"내용 latent와 분리된 위치 key를 함께 저장합니다(20절)."},
  {label:"모든 층에 더하기",expression:"61 × 576",result:"35,136개",reason:"61층이 모두 MLA라 같은 폭을 층 수만큼 반복합니다."},
  {label:"byte로 바꾸기",expression:"35,136 × 2byte",result:"70,272byte ≈ 68.6KiB",reason:"BF16 숫자 하나가 2byte입니다."},
  {label:"요청 길이 곱하기",expression:"70,272byte × 200,000",result:"약 14.1GB",reason:"KV는 처리한 token마다 한 줄씩 늘어납니다."},
  {label:"GPU 한 장의 몫",expression:"KV head 1개 → 8로 나눌 수 없음",result:"장마다 약 14.1GB",reason:"GQA처럼 head 축으로 나눌 수 없어 8장이 같은 14.1GB를 듭니다."},
 ]}
 conclusion="TP8로 가중치를 8분의 1로 나눠도 MLA KV는 장마다 약 14.1GB입니다. 8장 합계 공간이 아니라 한 장의 남은 공간과 비교해야 합니다."
 caveats={["FP8 KV는 숫자당 1byte라 절반이 되지만 scale과 정렬 공간이 붙을 수 있습니다.","decode context parallel을 켜면 token 축으로 나뉘어 이 결론이 바뀝니다."]}
/>
<div className="prose prose-neutral max-w-none dark:prose-invert"><p>8×RTX PRO 6000에서 Kimi K2.5를 돌린 커뮤니티 기록(rtx6kpro 위키, 현장 경험)도 이 모양입니다. BF16 KV에 DCP 없이 잡히는 용량은 약 19만 token이라, 200K 요청 하나를 겨우 담습니다.</p>
<p>FP8 KV로 바꾸면 DCP 없이 약 44.9만 token입니다. 같은 FP8 KV에 DCP 8을 켜고 gpu-util을 0.93으로 두면 3,621,504 token입니다. 200K 문맥 에이전트로 치면 약 18개를 동시에 담는 크기입니다. (계산)</p>
<p>여기서 DCP(decode context parallel)는 같은 latent를 든 rank들이 token 축을 나눠 갖게 하는 설정입니다. 각 rank가 자기 몫의 token으로 부분 attention을 계산하고, 층마다 그 결과를 합칩니다. 부분 결과를 합치는 원리는 <Link to="/cs/ai/tensor-and-pipeline-parallel-inference#sequence-context-parallel">context parallel</Link>과 같습니다.</p>
<p>대가가 있습니다. 같은 위키에서 단일 요청 속도는 BF16 DCP1의 90 tok/s에서 FP8 DCP8의 65 tok/s로 내려갑니다. FP8 DCP1이 79 tok/s라 DCP만의 몫은 79→65입니다. 반대로 DCP 없이 150K 문맥에서는 6~7 tok/s로 무너졌다는 보고가 있습니다.</p>
<p>vLLM에는 DCP를 켰을 때 출력이 어긋나는 drift 버그(vllm#41623)가 2026-11-03 기준 열려 있습니다. 위키 수치도 디스코드 대화를 정리한 것이라 장비 조건이 일부 빠져 있습니다. rank별 배치와 용량 계산 전체는 <Link to="/cs/ai/mla-kv-replication-and-decode-context-parallel">MLA KV 복제와 decode context parallel 글</Link>에서 이어 갑니다.</p>
<p>구조마다 답이 다릅니다. GQA는 head 축으로 나뉘고 MLA는 token 축으로 나눠야 복제가 사라집니다. Qwen3.6의 linear attention층은 요청당 고정 크기 state를 두고, vLLM은 그 state를 value head 축으로 나눕니다(<Link to="/cs/ai/qwen36-hybrid-runtime#hybrid-runtime">hybrid runtime 글</Link>). sliding window층은 창 길이가 보존량의 상한입니다.</p>
<p>가중치를 작은 숫자로 저장하는 weight quantization은 먼저 차지하는 고정 용량을 줄여 KV에 남길 예산을 바꿉니다. KV 자체의 원소당 byte는 별도 cache dtype이 정합니다. 같은 설정 이름 아래 scale·정렬 공간이 더 필요한지도 확인합니다.</p><p>이 글의 48·64byte와 모델별 계산은 분할과 padding이 없는 논리 용량입니다. 실제 장비에서는 rank별 KV spec과 block 수를 확인해야 합니다. 보존 가능한 token 수는 같은 예산에서 토큰당 저장량이 작아지는 방향으로 늘지만 마지막 block의 빈칸까지 공짜가 되지는 않습니다.</p></div><CodeViewButton label="vLLM: KV head가 TP보다 적으면 복제" onClick={() => sidebar.navigate("vllm-gqa-tp-replicate", codeRefs["vllm-gqa-tp-replicate"])} /><CodeViewButton label="vLLM: MLA cache는 KV head 1개·폭 576" onClick={() => sidebar.navigate("vllm-mla-single-kv-head", codeRefs["vllm-mla-single-kv-head"])} /></section>

<section id="capacity-bandwidth" data-calculation-explained data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">22. 저장량이 4분의 1이어도 전체 시간은 따로 계산합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>KV를 4분의 1로 줄이면 실행도 네 배 빨라질까요? 줄어드는 것이 공간인지 전송인지부터 나눠 봅니다.</p></div><CapacityBandwidthViz /><div className="prose prose-neutral max-w-none dark:prose-invert"><p>고정된 공간에 더 많은 기록을 담는 것이 capacity saving입니다. 같은 기록이 100MB에서 25MB로 줄면 100MB 공간에 네 벌이 들어가므로 이쪽은 정말 4배입니다. 한 실행이 메모리에서 가져오는 byte를 줄이는 것은 bandwidth saving입니다.</p><p>전송은 다른 항과 함께 움직입니다. 한 실행이 가중치 100MB와 KV 100MB를 읽는다고 합시다. KV만 25MB로 줄이면 총전송은 200→125MB이고 비율은 0.625입니다. 같은 유효 대역폭에서 전송 시간만 지배한다는 조건을 추가해도 전체 시간의 예상 비율은 0.25가 아니라 0.625입니다. (가정)</p><p>0.25가 되려면 분모와 분자에 가중치가 없어야 합니다. 반대로 실제 시간에는 기록뿐 아니라 가중치 읽기·계산·GPU 사이 통신·실행 준비도 들어갑니다. KV와 무관한 시간이 더 있다면 비율은 0.625보다 1에 더 가까워집니다.</p><p>GQA의 작은 head 축과 MLA의 작은 표현은 저장 및 읽기 비용을 바꿀 수 있습니다. 어느 쪽이 얼마나 빠른지는 실제 읽은 byte·연산 경로·batch·문맥 길이를 함께 재야 합니다. 저장 byte 절감만으로 일정한 배수의 속도를 보장하지 않습니다.</p></div></section>

<section id="boundary" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">23. 재사용 조건과 실제 할당을 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>과거 KV는 같은 모델과 앞부분·위치 조건에서 만든 계산 상태입니다. 중간 입력이 달라졌거나 위치 처리 조건이 바뀌었다면 기존 기록을 그대로 쓰는 것이 맞는지 다시 확인해야 합니다. 여러 갈래 생성이나 추측 실행은 기록의 소유·확정 범위도 관리해야 합니다.</p><p>모든 층을 같은 head 수로 곱할 수 있는지, local 기록을 실제 회수하는지, 공통 변환을 쓴 K/V가 최종 텐서도 같은지 확인합니다. 작은 배열에서 이해한 저장 수명과 byte 계산을 실제 코드의 write 지점까지 따라가는 이유입니다.</p></div><ContentBoundary article="kv-cache-fundamentals" /></section>

<section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">24. 값을 바꾸기 전에 다음 결과를 예상해 보세요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>현재 Q head가 4개라서 eager 계산용 K/V를 4head로 펼쳤습니다. 다음 실행까지 남는 cache도 128byte로 바뀌었을까요? (답: 11절)</p><p>K=(0,c), V=(c,2c)인 네 기록을 c=1·2·3·4로 저장했습니다. 모든 K/V를 먼저 복원해야 출력 (2.5,5)를 얻을 수 있을까요? (답: 19절)</p><p>가중치 100MB와 KV 100MB 중 KV만 25MB로 줄였습니다. 같은 대역폭이라고 실행 전체가 네 배 빨라진다고 말할 수 있을까요? (답: 22절)</p></div></section>
<KVCacheSeriesMapReturn current="fundamentals" />
</div><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={{transformers:kvCacheFundamentalsTree,vllm:kvCacheFundamentalsVllmTree}} projectMetas={{transformers:{id:"transformers",label:"Transformers v5.15.0 · 고정 모델 config",badgeClass:"bg-yellow-500/10 border-yellow-500 text-yellow-700"},vllm:{id:"vllm",label:"vLLM main 4c45411 · 2026-11-03",badgeClass:"bg-sky-500/10 border-sky-500 text-sky-700"}}} /></>;
}
