import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import PrefixHashViz from "./viz/PrefixHashViz";
import PrefixScopeViz from "./viz/PrefixScopeViz";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
const HASH_TERMS = [
  {
    symbol: "H_i",
    name: "i번째 block hash",
    description: "현재 token block까지의 prefix identity를 나타내는 cache key입니다.",
  },
  {
    symbol: "H_{i-1}",
    name: "Parent block hash",
    description: "바로 앞 full block까지의 prefix identity로 token 순서와 ancestry를 연결합니다.",
  },
  {
    symbol: "x_i",
    name: "현재 block token IDs",
    description: "Tokenizer와 chat template를 거친 i번째 full block의 실제 token ID sequence입니다.",
  },
  {
    symbol: "e_i",
    name: "Extra identity",
    description: "LoRA ID·multimodal hash·cache salt처럼 같은 token이라도 KV 계산을 달라지게 하는 조건입니다.",
  },
] as const;

const HIT_TERMS = [
  {
    symbol: "n^{query}_q",
    name: "Query q의 조회 token 수",
    description: "새 request q가 cache에 물어본 prompt token 수입니다. vLLM은 query마다 이 값을 기록합니다.",
  },
  {
    symbol: "n^{hit}_q",
    name: "Query q의 hit token 수",
    description: "사례의 full-block 경로에서 시작부터 연속으로 재사용한 token 수입니다.",
  },
  {
    symbol: "h_{tok}",
    name: "Token hit rate",
    description: "일정 구간의 hit token 합을 조회 token 합으로 나눈 값입니다. vLLM log와 Prometheus counter가 쓰는 정의입니다.",
  },
  {
    symbol: "h_{req}",
    name: "Request hit rate",
    description: "한 token이라도 hit한 request의 비율입니다. 절감량을 말해 주지 않습니다.",
  },
] as const;

const SAVING_TERMS = [
  {
    symbol: "n_{prompt}",
    name: "Prompt token",
    description: "새 request가 원래 prefill해야 하는 전체 prompt 길이입니다.",
  },
  {
    symbol: "n_{hit}",
    name: "Cached full-block token",
    description: "Hash chain이 연속으로 일치해 prefill을 건너뛸 수 있는 prefix token 수입니다.",
  },
  {
    symbol: "n_{miss}",
    name: "새로 prefill할 token",
    description: "Prompt에서 cached prefix를 제외한 suffix token 수입니다.",
  },
] as const;


export default function PrefixCaching({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) { return <div className="space-y-16"><section id="prefix-caching" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">13. 같은 앞의 32 token을 다시 읽지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>다시 길이 35인 A와 B의 사례입니다. 이 절에서는 hash 단위와 physical block이 모두 16이고 앞의 32 token이 완전히 같다고 가정합니다. A가 만든 P7·P2를 B가 hit하고 touch하면 B는 남은 3 token을 새로 처리합니다. 두 요청이 동시에 살아 있다면 P7·P2의 참조 수는 2입니다. (가정)</p><p>현재 구간의 token만 같아서는 부족합니다. 앞 문맥이 달라지면 같은 token의 KV도 달라질 수 있어 이전 구간의 hash를 현재 키에 넣습니다. LoRA나 이미지 등의 추가 조건도 실제 KV 의미가 달라지면 구분되어야 합니다. 모델 자체의 다른 버전을 이 함수가 자동으로 전부 알아서 구분한다고 해석해서는 안 됩니다.</p><p>kv_cache_utils.py 596–624행의 hash_block_tokens는 parent hash, token tuple, extra keys를 묶습니다. 100–114행은 첫 parent에 쓸 NONE_HASH를 초기화하며 환경의 hash seed가 없으면 임의 byte를 사용합니다. 모든 프로세스에서 같은 고정 sentinel이라는 설명은 틀립니다.</p><p>v0.27.1 공식 문서에서는 sha256이 기본이며 sha256_cbor는 다른 언어에서도 재현할 직렬화 선택입니다. 첫 hash에 넣는 cache salt는 재사용 영역을 나누는 데 쓰입니다. 같은 문자열처럼 보여도 template·특수 token·공백이 token ID를 바꾸면 같은 키가 아닐 수 있습니다.</p></div><PrefixHashViz /><ExplainedFormula
        question="같은 token block이 다른 위치나 다른 adapter의 KV와 잘못 섞이지 않게 cache key를 어떻게 만들까요?"
        idea={
          <>
            현재 block token만 hash하지 않고 parent hash를 함께 넣어 앞선 전체 prefix
            순서를 연결합니다. 같은 token이라도 KV를 바꾸는 adapter·multimodal input·
            tenant salt 같은 identity도 key에 포함합니다.
          </>
        }
        formula={String.raw`H_i=\operatorname{Hash}\!\left(H_{i-1},\;x_i,\;e_i\right)`}
        annotatedFormula={String.raw`H_i=\underbrace{\operatorname{Hash}\!\left(H_{i-1},\;x_i,\;e_i\right)}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`\operatorname{Hash}\!\left(H_{i-1},\;x_i,\;e_i\right)`, annotation: ["이 식에 적힌 경계와 전제가 맞는지 함께 확인합니다.","현재 block token만 hash하지 않고 parent","hash를 함께 넣어 앞선 전체 prefix 순서를","연결합니다."] },
        ]}
        terms={HASH_TERMS}
        assumptions={[
          "같은 cache namespace에서 model·position·KV 계산 조건이 일치해야 합니다. 아래 hash 함수가 model version을 자동으로 모두 넣는다는 뜻은 아닙니다.",
          "v0.27.1 문서의 기본 hash는 sha256입니다. hash 선택과 cache salt는 충돌·격리 조건을 함께 검토합니다.",
          "사례는 hash 단위와 physical block이 모두 16인 full-block 경로입니다. 세분화한 partial-hit 경로에는 별도 CoW가 있습니다.",
        ]}
        interpretation="현재 block token이 같아도 parent hash가 다르면 앞 문맥이 다르므로 hit가 아닙니다. LoRA나 image가 달라 KV가 바뀐다면 extras가 달라져야 하며, 그렇지 않으면 잘못된 state를 재사용합니다."
        title="Prefix block의 chained cache key"
      /><CodeViewButton label="hash 입력과 NONE_HASH 초기화 원문" onClick={() => onCodeRef("block-hash-chain", codeRefs["block-hash-chain"])}/><div id="full-block-boundary" className="prose prose-neutral max-w-none dark:prose-invert scroll-mt-20"><p>여기서는 문서의 full-block 기본 모형을 적용했습니다. 12절의 더 작은 hash 단위와 partial-hit CoW가 켜진 경로까지 “마지막 block은 언제나 재계산한다”라고 일반화하지 않습니다. 공간 단위, hash 단위, manager 종류를 함께 확인합니다.</p></div><PrefixScopeViz /><ExplainedFormula
        question="Prefix hit가 생기면 새 request가 실제로 prefill할 token은 몇 개 남을까요?"
        idea={
          <>
            Prompt 전체에서 연속으로 hit한 full-block prefix를 뺍니다. 이 절감은
            prompt prefill에만 적용되고 새 답을 생성할 계산 전체를 없애 주지는 않습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
n_{miss} &= n_{prompt}-n_{hit} \\
0 &\le n_{hit}\le n_{prompt}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
n_{miss} &= \underbrace{n_{prompt}-n_{hit}}_{\text{오른쪽 항으로 결과 계산}} \\
0 &\le \underbrace{n_{hit}\le n_{prompt}}_{\text{허용 경계 판정}}
\end{aligned}`}
        operations={[
          { expression: String.raw`n_{prompt}-n_{hit}`, annotation: ["오른쪽에 사례의 값을 대입해 왼쪽 값을 계산합니다.","Prompt 전체에서 연속으로 hit한 full-block","prefix를 뺍니다."] },
          { expression: String.raw`n_{hit}\le n_{prompt}`, annotation: ["이 식에 적힌 경계와 전제가 맞는지 함께 확인합니다.","Prompt 전체에서 연속으로 hit한 full-block","prefix를 뺍니다."] },
        ]}
        terms={SAVING_TERMS}
        assumptions={[
          "Hit block의 KV가 eviction되지 않았고 request가 scheduling될 때 touch·reference count 갱신에 성공합니다.",
          "n_hit은 첫 block부터 연속으로 일치한 prefix 길이이며 중간 block만 같은 경우를 더하지 않습니다.",
          "TTFT 절감은 token 수에 정확히 선형이지 않으므로 cached token histogram과 실제 prefill span을 함께 측정합니다.",
        ]}
        interpretation="35-token 입력에서 앞의 32 token을 재사용하면 3 token이 남습니다. 일반 순차 생성에서는 prefill에서 첫 출력이 나올 수 있으므로 출력 N개를 무조건 decode N회로 세지는 않습니다."
        title="APC가 줄이는 prefill 범위"
      /></section><section id="prefix-sharing" data-teach-level="5" className="scroll-mt-20"><span id="prefix-operations" className="scroll-mt-20" /><h2 className="mb-6 text-2xl font-bold">14. 계산 생략과 저장 공간 절약을 각각 셉니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>앞 32 token을 공유한 A와 B는 3개씩의 table 항목을 가지지만 실제 공간은 4개입니다. B는 35−32=3 token의 입력을 새로 처리합니다. 공유로 줄인 공간과 생략한 입력 계산은 같은 사건에서 나오는 서로 다른 양입니다. 출력 답 전체가 저장돼 있는 것은 아닙니다. (가정)</p><p>길이 1,000의 앞부분을 10개 요청이 재사용하는 더 큰 예에서는 62개 full block이 992 token을 담고 각 요청은 8-token tail block 하나를 가집니다. 모든 hit가 유효한 뒤 함께 실행된다면 공유 없이 63×10=630개, 공유하면 62+10=72개입니다. 처음부터 동시에 들어와 아직 계산이 끝나지 않은 경우까지 자동으로 이 수치를 보장하지는 않습니다. (가정)</p><p>10개 요청이 각각 35 token을 조회하고 그중 9개가 32 token을 hit하면 조회는 350, hit는 288입니다. Token hit 비율은 약 82.29%, 한 번이라도 hit한 요청 비율은 90%입니다. 전자는 재사용한 token 비중이고 어느 쪽도 실제 시간 절감률과 같지는 않습니다. (가정)</p><p>기존의 1,200-token 입력 10개 중 9개가 992개를 hit하는 예도 계산하면 8,928/12,000=74.4%입니다. 요청 비율 90%와 차이는 15.6%p, 상대 차이는 약 21.0%입니다. 이를 25% 과대평가로 쓰거나 prefill 시간이 정확히 74.4% 줄었다고 해석하면 안 됩니다. (가정)</p></div><ExplainedFormula
        question="같은 traffic에서 request hit rate와 token hit rate가 다르게 나오는 이유는 무엇일까요?"
        idea={
          <>
            Token hit rate는 hit한 token 합을 조회 token 합으로 나눕니다. Request
            hit rate는 한 token이라도 hit한 request 수를 셉니다. 앞은 재사용 token의 비중이고 뒤는 hit 길이를 반영하지 않습니다. 시간 절감률은 둘만으로 알 수 없습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
h_{tok} &= \frac{\sum_{q\in Q} n^{hit}_q}{\sum_{q\in Q} n^{query}_q} \\
h_{req} &= \frac{\left|\{q\in Q : n^{hit}_q>0\}\right|}{|Q|}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
h_{tok} &= \underbrace{\frac{\sum_{q\in Q} n^{hit}_q}{\sum_{q\in Q} n^{query}_q}}_{\text{기준량당 비율}} \\
h_{req} &= \underbrace{\frac{\left|\{q\in Q : n^{hit}_q>0\}\right|}{|Q|}}_{\text{기준량당 비율}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\frac{\sum_{q\in Q} n^{hit}_q}{\sum_{q\in Q} n^{query}_q}`, annotation: ["관심 token 수를 한 block의 slot 수 또는 전체 조회량과 비교합니다.","구간 Q의 hit token 합을 조회 token 합으로 나눈","값이며 재사용한 token의 비중입니다."] },
          { expression: String.raw`\frac{\left|\{q\in Q : n^{hit}_q>0\}\right|}{|Q|}`, annotation: ["관심 token 수를 한 block의 slot 수 또는 전체 조회량과 비교합니다.","한 token이라도 hit한 request 수를 전체 request","수로 나눈 값이며 hit 길이를 반영하지 않습니다."] },
        ]}
        terms={HIT_TERMS}
        assumptions={[
          "Q는 동일하게 정한 조회 집합입니다. 로그 창과 Prometheus 집계 창이 다르면 값도 다를 수 있습니다.",
          "여기서는 full-block 조회 사례만 셉니다. 다른 조회 경로는 실제 counter가 무엇을 기록하는지 확인합니다.",
          "Hit로 기록된 block이 실행 전에 evict되면 counter는 hit이지만 실제 prefill 절감은 일어나지 않을 수 있습니다.",
        ]}
        interpretation="10 request × 35 token 중 9 request가 32 token을 hit하면 h_tok=288/350≈82.29%, h_req=90%입니다. 두 값의 차이는 약 7.71%p이며 시간 절감률의 차이를 뜻하지 않습니다."
        title="Token hit rate와 request hit rate"
      /></section><section id="cache-locality" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">15. 반복 입력이 같은 저장소에 남아 있어야 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>동일한 입력이 다시 와도 다른 replica로 가거나 이전 block이 이미 재사용됐다면 hit가 나지 않습니다. 같은 앞부분을 같은 복제본으로 보내면 재사용 기회가 커질 수 있지만 요청이 한곳에 몰려 대기 시간이 길어질 수도 있습니다.</p><p>길이 35인 같은 입력 10개를 하나씩 처리하고 매 복제본의 첫 요청만 miss하며 이후에는 캐시가 남는다고 합시다. 복제본 1개면 9/10, 2개에 번갈아 보내면 8/10, 8개를 순환하면 2/10이 request hit입니다. 이는 순차로 캐시를 준비하는 가정의 결과이며 동시에 들어온 요청이나 eviction이 있으면 달라집니다. (가정)</p><p>시간이 지난 뒤 같은 복제본으로 와도 내용이 남았는지 확인해야 합니다. Free queue의 순서, hash 없는 block의 우선 사용, 중간 touch, 아직 살아 있는 참조가 결과를 바꿉니다. 총 8,000개 pool에서 다른 요청이 누적 8,500개를 할당했다는 사실 하나로 특정 62개 prefix가 반드시 사라졌다고 증명할 수는 없습니다.</p><p>운영에서는 cached token 분포, 조회와 실행 시점, replica 경로, free 수량, 재할당·전송 기록, 첫 출력까지 시간을 같은 요청 ID로 연결합니다. Hit 길이 histogram 하나만으로 routing 문제와 eviction 문제를 확정하지 않습니다.</p></div></section><section id="paper-pagedattention" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">16. 원 논문의 범위와 현재 구현을 연결합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>PagedAttention 원 논문의 §4는 흩어진 block을 연결하는 표와 그 표를 읽는 attention 계산을 함께 설명합니다. §4.4는 parallel sampling과 beam search에서 공유 관계를 유지하는 방법을 다룹니다. 이 글의 P7·P2·P9와 두 갈래의 tail은 그 구조를 작게 만든 예입니다.</p><p>논문은 당시 프로파일에서 유효 token state가 KV 공간의 20.4–38.2%를 차지했다고 보고했습니다. 나머지 예약·내부·외부 낭비를 줄이는 것이 출발점입니다. 논문의 Alpaca 조건 parallel sampling block 절감 6.1–9.8%, ShareGPT 조건 16.2–30.5%, Alpaca 조건 beam search 37.6–55.2%와 ShareGPT 44.3–66.3%도 저자들의 해당 설정 측정값입니다. 현재 장비와 부하의 보장값으로 옮기지 않습니다.</p><p>현재 코드 패널은 vLLM v0.27.1 commit 6e448d0ea9bf3d88d898b65449ca6dc2aec170ac의 전체 파일입니다. 원문을 축약하거나 번역 주석으로 대체하지 않았습니다. 논문 당시 알고리즘, 공식 설명의 단순화, 이 commit의 추가 경로를 구분해 읽어야 합니다.</p></div><div id="paper-pagedattention-original" className="mt-8 scroll-mt-20"><CitationBlock source="PagedAttention — §4 memory management" citeKey={1} href="https://arxiv.org/abs/2309.06180"><q>non-contiguous</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>사례에서 P7·P2·P9가 연속 번호일 필요 없이 table로 연결되는 부분입니다. 표를 바꿨을 때 실제 계산기가 같은 위치를 읽어야 하므로 메모리 관리와 kernel의 주소 규약은 함께 맞아야 합니다.</p></div></div><div id="paper-radixattention" className="mt-8 scroll-mt-20"><CitationBlock source="SGLang — §3.1 RadixAttention" citeKey={1} href="https://papers.nips.cc/paper_files/paper/2024/file/724be4472168f31ba1c9ac630f15dec8-Paper-Conference.pdf"><q>longest-shared-prefix-first</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>SGLang 논문은 공통 prefix를 radix tree 경로에 모으고 긴 공유 prefix를 우선하는 요청 선택을 함께 다룹니다. A와 B의 앞 32 token을 찾는 목적은 같지만 vLLM의 chained hash와 같은 자료 구조는 아닙니다. 논문의 offline 최적성은 cache 용량 등 전제를 둔 정리이며 모든 online traffic의 지연 최적성을 보장하지 않습니다.</p></div></div></section><section id="memory-kernel-boundary" data-teach-level="7" className="scroll-mt-20"><span id="block-invariants" className="scroll-mt-20" /><h2 className="mb-6 text-2xl font-bold">17. 주소가 맞아도 내용과 수명이 틀리면 실패합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>Manager는 어떤 block을 누가 보유하는지와 hash lookup·할당·반환을 관리합니다. Kernel은 block table과 tensor 배치 규약으로 K·V를 찾아 attention을 계산합니다. 주소의 형태가 맞더라도 읽기 전에 재사용되거나 복사가 끝나지 않았으면 결과가 잘못됩니다. 수명이 kernel 정확도와 무관하다는 설명은 틀립니다.</p><p>확인할 조건은 세 가지입니다. 첫째, 아직 읽거나 복사할 일반 block을 free 후보로 돌려 덮어쓰지 않습니다. 둘째, 새 내용으로 재사용한 block에 예전 hash가 hit하지 않게 합니다. 셋째, table의 논리 순서와 유효 길이, 실제 KV 내용과 실행 순서를 맞춥니다.</p><p>앞의 slot 식은 token 단위 단순 모형입니다. 여러 group, lookahead, 다른 dtype, 분산 전송, 후보 검증을 켜면 필요한 byte와 추가 참조를 다시 계산합니다. Prefix hit가 늘어도 검색·복사 비용이나 대기가 커지면 첫 출력 시간이 나빠질 수 있어 실제 실행 구간을 함께 측정해야 합니다.</p></div></section><section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">18. 같은 사례에서 다음 값을 예상해 보세요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>A가 35 token이고 table=[P7,P2,P9]일 때 위치 37을 읽어도 될까요? 길이 38이 된 뒤에는 어디서 읽나요? (답: 7절)</p><p>
            A의 길이가 38에서 49로 늘고 마지막 공간은 A 전용입니다. B=16일 때 추가 block은 몇 개이며 공유 tail의 partial hit라면 왜 같은 식만으로
            부족할까요? (답: 11절)
          </p><p>A와 B가 P7을 공유한 뒤 A가 끝났습니다. P7의 hash를 지우는 동작과 그 공간을 다른 내용으로 덮어쓰는 동작은 어떤 차이가 있나요? (답: 9절)</p></div></section></div>; }
