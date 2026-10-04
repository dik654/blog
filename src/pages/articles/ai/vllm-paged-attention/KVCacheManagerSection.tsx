import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import AllocationContractViz from "./viz/AllocationContractViz";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
const ALLOC_TERMS = [
  {
    symbol: "n^{computed}",
    name: "기존 계산 token",
    description: "Request가 현재까지 KV state를 만든 token 수입니다.",
  },
  {
    symbol: "n^{new}",
    name: "이번 scheduled token",
    description: "Scheduler가 이번 iteration에 새로 계산하려는 token 수입니다.",
  },
  {
    symbol: "n^{look}",
    name: "Lookahead token",
    description: "Speculative decoding 등에서 미리 확보해야 하는 추가 slot 수입니다.",
  },
  {
    symbol: "m^{owned}",
    name: "현재 연결된 block 수",
    description: "Prefix hit와 기존 allocation을 포함해 request block table이 이미 가진 block 수입니다.",
  },
  {
    symbol: "m^{alloc}",
    name: "새로 필요한 block 수",
    description: "이번 실행을 안전하게 담기 위해 free pool에서 더 가져와야 하는 block 수입니다.",
  },
] as const;


export default function KVCacheManagerSection({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) { return <div className="space-y-16"><section id="kv-cache-manager" data-teach-level="5" className="scroll-mt-20"><span id="allocation-failure" className="scroll-mt-20" /><h2 className="mb-6 text-2xl font-bold">11. 35에서 38은 추가 0개, 49는 추가 1개입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            사례처럼 full attention 한 group, 전용 tail, lookahead=0인 진행 요청을 생각합니다. Manager는 보존할 최종 길이를 block 수로 올림한
            뒤 현재 table 길이를 뺍니다. 38은 ceil(38/16)=3이라 기존 3개로 충분하고 49는 ceil(49/16)=4라 1개를 더 가져옵니다. (가정)
          </p><p>실제 single_type_kv_cache_manager.py의 get_num_blocks_to_allocate 178행은 cdiv로 필요한 수를 구합니다. 194–200행의 진행 요청 경로는 이미 가진 길이를 빼고 0 아래를 자릅니다. 이것이 바로 A의 3−3=0, 다음의 4−3=1에 대응합니다.</p><p>
            처음 받는 요청은 더 복잡합니다. 220–230행은 hit했지만 ref=0이어서 free 목록에서 빼야 하는 block도 용량에 넣고 partial local hit에는
            CoW용 block 하나를 더 예약합니다. 따라서 단순한 차이 식을 모든 신규 요청에 그대로 적용할 수 없습니다.
          </p><p>Block이 부족하면 manager의 실패를 받은 scheduler가 요청 선택과 선점을 결정합니다. Pool이 다른 요청의 중요도를 임의로 정하지는 않습니다. 또한 엔진 시작 때 정한 전체 block 용량과 매 순간 달라지는 free 개수를 구분합니다. 전체 8,000개 중 6,300개가 쓰이고 다른 제약이 없다면 free는 1,700개입니다. (가정)</p></div><AllocationContractViz /><ExplainedFormula
        question="기존 마지막 block의 빈 slot까지 고려해 새로 가져올 block 수를 어떻게 계산할까요?"
        idea={
          <>
            실행 뒤 보존해야 할 전체 token 위치를 block 수로 올림한 다음 이미 연결된
            block 수를 뺍니다. 결과가 0이면 기존 partial block 안에 들어가며,
            양수이면 그만큼 free pool에서 더 필요합니다.
          </>
        }
        formula={String.raw`m^{alloc}=\max\!\left(
0,\;
\left\lceil\frac{n^{computed}+n^{new}+n^{look}}{B}\right\rceil
-m^{owned}
\right)`}
        annotatedFormula={String.raw`m^{alloc}=\underbrace{\max\!\left(
0,\;
\left\lceil\frac{n^{computed}+n^{new}+n^{look}}{B}\right\rceil
-m^{owned}
\right)}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\max\!\left(
0,\;
\left\lceil\frac{n^{computed}+n^{new}+n^{look}}{B}\right\rceil
-m^{owned}
\right)`, annotation: ["관심 token 수를 한 block의 slot 수 또는 전체 조회량과 비교합니다.","실행 뒤 보존해야 할 전체 token 위치를 block 수로","올림한 다음 이미 연결된 block 수를 뺍니다."] },
        ]}
        terms={ALLOC_TERMS}
        assumptions={[
          "단일 full-attention cache group을 설명하는 개념 식이며 실제 manager는 cached token·block alignment·encoder/Mamba state를 추가로 다룹니다.",
          "마지막 partial block이 이 요청의 전용 공간이고 쓰기 가능하다는 전제입니다. 공유 tail의 CoW 예약은 따로 더합니다.",
          "필요 block 수가 free block보다 크면 allocation은 실패하고 scheduler가 batch를 줄이거나 preempt합니다.",
        ]}
        interpretation="B=16, computed=35, new=3, lookahead=0이면 38 slot에 3 block이 필요합니다. 이미 3개를 가져 추가 0개입니다. 이어 11 token을 더 보존하면 49 slot에 4개가 필요해 1개를 추가합니다."
        title="Scheduled token에서 physical block demand로"
      /><CodeViewButton label="진행 요청과 신규 hit의 실제 수요 계산" onClick={() => onCodeRef("block-demand", codeRefs["block-demand"])}/><AlgorithmBlock title="단일 group의 단순 할당 순서 — 원문 필드를 연결한 의사코드" input={["계획한 최종 token 위치, 현재 table, free queue", "캐시 및 복사 예약 조건"]} steps={[{"code": "required ← ceil(target_tokens / block_size)", "note": "A의 38은 3개, 49는 4개입니다."}, {"code": "needed ← max(0, required − owned) + extra_reservations", "note": "신규 hit·CoW·group 규칙의 추가 예약을 별도로 셉니다."}, {"code": "check capacity before popping; allocate missing blocks", "note": "확보할 수 없는 수량을 일부만 꺼내고 성공으로 처리하지 않습니다."}, {"code": "remove old cache identity; retain and attach new blocks", "note": "이전 hash로 잘못 hit하지 않게 한 뒤 table을 연결합니다."}, {"code": "on release: decrement refs; enqueue only eligible zero-ref blocks", "note": "실제 원문은 hash 없는 block을 앞에, 있는 block을 뒤에 둡니다."}]} output="확보한 block 목록 또는 scheduler가 처리할 실패" /></section><section id="hybrid-cache-groups" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 같은 16칸 계산으로 모든 모델을 재지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>앞의 사례는 과거 위치를 모두 보존하는 한 group입니다. 가까운 일부 위치만 보는 sliding-window attention이나 다른 형태의 상태를 유지하는 Mamba가 섞이면 필요 길이와 회수 시점이 다릅니다. Compatible한 층을 group으로 묶고 각각의 계산을 맞춰야 합니다.</p><p>고정 원문에는 physical block보다 hash 단위를 작게 두는 경로도 있습니다. 132–142행의 _has_partial_local_hit는 재사용한 길이가 block 경계 중간에서 끝나는지 봅니다. 348–357행은 이 공유 tail을 전용 CoW block으로 바꿉니다. 현재 prefix caching에는 CoW가 전혀 없다는 단정은 맞지 않습니다.</p><p>405–426행의 _apply_cow는 table을 전용 block으로 바꾸면서 복사 출발·도착 공간을 모두 붙잡습니다. 도착 block에는 요청의 참조 외에 ref 하나를 더 둡니다. 따라서 앞의 ref=table 참조 수 식은 추가 pin이 없는 단순 모형이며 실제 ref 값을 설명할 때는 복사 대기도 포함해야 합니다.</p><p>이 세분화 경로의 지원은 manager 종류에 따라 다릅니다. 같은 파일은 sliding-window 경로에서 partial hit를 지원하지 않는 조건을 명시합니다. <a href="/cs/ai/hybrid-kv-cache-allocation">Hybrid KV Cache 글</a>에서 layer별 byte와 group 조합을 이어서 계산합니다.</p></div><CodeViewButton label="partial-hit CoW와 복사 수명 원문" onClick={() => onCodeRef("partial-hit-cow", codeRefs["partial-hit-cow"])}/></section></div>; }
