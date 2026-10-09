import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import BlockLifecycleViz from "./viz/BlockLifecycleViz";
import ForkCopyOnWriteViz from "./viz/ForkCopyOnWriteViz";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
const REF_TERMS = [
  {
    symbol: String.raw`\mathcal R`,
    name: "Live request 집합",
    description: "현재 block table로 block을 보유한 요청 집합입니다. 요청 종료 뒤 hash만 남은 cache 항목은 여기에 넣지 않습니다.",
  },
  {
    symbol: "T_r",
    name: "Request block table",
    description: "Request r이 logical 순서로 참조하는 physical block들의 목록입니다.",
  },
  {
    symbol: String.raw`\operatorname{ref}(b)`,
    name: "Block reference count",
    description: "단순 모형에서는 table 참조 수입니다. 실제 구현은 복사·전송을 위한 추가 pin도 유지할 수 있습니다.",
  },
  {
    symbol: String.raw`\mathbf1[\cdot]`,
    name: "Indicator",
    description: "조건이 참이면 1, 아니면 0을 더하는 표기입니다.",
  },
] as const;


export default function BlockPoolSection({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) { return <div className="space-y-16"><section id="block-pool" data-teach-level="5" className="scroll-mt-20"><span id="free-queue-eviction" className="scroll-mt-20" /><span id="block-allocator" className="scroll-mt-20" /><h2 className="mb-6 text-2xl font-bold">9. A가 끝나도 B가 읽는 P7은 덮어쓰지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>길이 35인 A와 B가 앞 32 token을 공유한다고 합시다. Table은 A=[P7,P2,P9], B=[P7,P2,P11]입니다. P7·P2의 ref는 2, P9·P11은 1이며 실제 block은 중복 없는 4개입니다. 각 table 길이를 단순히 더한 6개와 다릅니다. (가정)</p><p>A가 끝나 P7 참조를 놓으면 ref는 2에서 1로 줄어 B가 계속 읽습니다. B도 놓아 0이 되어야 다른 내용으로 재사용할 후보가 됩니다. 실제 복사·전송이 붙잡은 참조나 null block 등은 별도 조건이므로 ref=0만 확인하고 임의 시점에 덮어쓰면 안 됩니다.</p><p>고정 commit의 block_pool.py 702–715행에서 touch는 ref=0인 일반 block을 free queue에서 빼고 ref를 늘립니다. 731–742행의 반환은 ref를 내린 뒤 hash 없는 block을 앞에, hash 있는 block을 뒤에 넣습니다. 모든 반환을 무조건 tail에 붙이는 설명은 이 원문과 다릅니다.</p><p>647–668행의 새 할당은 수량이 충분한지 먼저 검사한 뒤 free queue에서 꺼내 이전 hash를 제거하고 ref를 올립니다. 744행의 evict_blocks는 사용 중인 block의 hash 조회 항목도 지울 수 있지만 그 물리 공간을 즉시 반환하지 않습니다. 조회 항목 제거와 공간 재사용을 구분해야 합니다.</p></div><BlockLifecycleViz /><ExplainedFormula
        question="Physical block을 안전하게 덮어써도 되는 시점을 어떤 불변식으로 확인할까요?"
        idea={
          <>
            외부 pin이 없는 단순 모형에서 live request의 block table을 보며 block b를 가리키는 entry 수를
            셉니다. 하나라도 참조하면 b의 저장 공간을 다른 내용으로 재사용할 수 없습니다. Hash 조회 항목만 지우는 동작과 구분합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
\operatorname{ref}(b)
&=\sum_{r\in\mathcal R}\sum_i \mathbf1[T_r[i]=b] \\
\operatorname{reusable}(b)
&\Longrightarrow \operatorname{ref}(b)=0
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\operatorname{ref}(b)
&=\underbrace{\sum_{r\in\mathcal R}\sum_i \mathbf1[T_r[i]=b]}_{\text{live request table에서 b를 가리키는 entry 수}} \\
\operatorname{reusable}(b)
&\Longrightarrow \underbrace{\operatorname{ref}(b)=0}_{\text{아무도 안 볼 때만 덮어쓰기}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{r\in\mathcal R}\sum_i \mathbf1[T_r[i]=b]`, annotation: ["live request r마다 block table T_r의 entry 중","physical block b를 가리키는 것을 세어 더합니다.","A와 B가 P7을 공유하면 ref(P7)=2"] },
          { expression: String.raw`\operatorname{ref}(b)=0`, annotation: ["A가 끝나도 ref=1이라 덮어쓸 수 없고 B도 참조를","놓아 0이 된 뒤에야 free queue에서 재사용합니다.","hash 조회 항목만 지우는 동작과는 다릅니다"] },
        ]}
        terms={REF_TERMS}
        assumptions={[
          "Block table entry의 추가·제거와 reference count 갱신이 같은 ownership 계약 안에서 일어납니다.",
          "ref=0은 물리 공간 재사용의 필요조건입니다. pinned/null block이나 별도 transfer state는 추가 조건을 가질 수 있습니다.",
          "Cache hash가 남은 ref=0 block은 free queue의 eviction 후보일 수 있지만 cache lookup 전까지 내용이 유효합니다.",
        ]}
        interpretation="A와 B가 P7을 공유하면 ref(P7)=2입니다. A가 끝나도 ref=1이라 덮어쓸 수 없고, B도 참조를 놓아 ref=0이 된 뒤에야 free queue에서 새 allocation 대상으로 재사용할 수 있습니다."
        title="Reference count와 물리 공간 재사용"
      /><CodeViewButton label="실제 touch·free·evict 원문" onClick={() => onCodeRef("ref-count-eviction", codeRefs["ref-count-eviction"])}/></section><section id="sequence-forking" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 공유한 마지막 block에 쓰기 전에 복사합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>원 논문의 fork 모형으로 돌아가 A의 길이 35에서 두 실행 갈래를 만든다고 합시다. 두 table이 [P7,P2,P9]를 가리키는 동안 새 block은 필요 없습니다. 하지만 두 갈래가 서로 다른 다음 token을 같은 P9[3]에 쓰면 충돌합니다. (가정)</p><p>첫 갈래가 P9의 ref=2를 보고 새 P3로 필요한 KV를 복사한 뒤 자신의 table만 바꿉니다. 이제 P9의 ref는 1이 되어 나머지 갈래가 원래 공간에 쓸 수 있습니다. 공유하는 앞 32 token의 두 block과 서로 다른 tail 두 개, 총 4개로 나뉩니다. GPU 복사와 쓰기 사이의 순서도 보장해야 합니다. (가정)</p><p>
            길이 1,000을 4갈래로 나누는 같은 모형에서는 각 63개를 복제한 252개 대신 기존 63개와 tail 사본 3개, 총 66개로 시작할 수 있습니다. 부모 참조가 따로 남지
            않고 각 tail에 이어 쓰는 시점이라는 전제입니다. 전체 요청 처리 속도가 같은 비율로 빨라진다는 뜻은 아닙니다. (가정)
          </p></div><ForkCopyOnWriteViz /><AlgorithmBlock title="논문의 fork와 쓰기 분리 모형 — 현 버전 API가 아닌 의사코드" input={["부모의 table, block별 ref, 현재 유효 길이", "복사·읽기·쓰기 완료를 보장하는 실행 순서"]} steps={[{"code": "fork: child.table ← copy(parent.table); retain(each block)", "note": "주소 목록을 복사하며 각 보유 참조를 올립니다."}, {"code": "if next slot starts a new block: append(allocate(1))", "note": "기존 tail이 꽉 찼으면 새 공간이 필요합니다."}, {"code": "else if tail is shared: allocate private tail; retain copy endpoints", "note": "공유 공간을 바꾸기 전에 복사 출발·도착 공간을 붙잡습니다."}, {"code": "copy valid KV; wait/order copy before write; redirect child tail", "note": "복사가 끝나기 전에 읽거나 덮어쓰지 않습니다."}, {"code": "release old ownership after safe transfer; write at n mod B", "note": "필요한 참조를 안전하게 놓고 자기 공간에 씁니다."}]} output="공유한 앞부분과 각 갈래의 독립된 tail" /><div id="beam-branch-sharing" className="prose prose-neutral max-w-none dark:prose-invert scroll-mt-20"><p>Beam search는 점수가 높은 후보만 남기므로 공유 관계가 반복해서 바뀝니다. 버린 후보의 table 참조를 내리되 살아남은 후보가 읽는 block은 유지합니다. 원 논문의 fork·beam 구현과 현재 엔진의 request API를 같은 것으로 보지 말고 실제 사용 버전의 지원 경로를 확인합니다.</p></div></section></div>; }
