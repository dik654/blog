import ExplainedFormula from "@/components/ui/explained-formula";
import TermBreakdown from "@/components/articles/term-breakdown";
import BlockAddressViz from "./viz/BlockAddressViz";
import FragmentationViz from "./viz/FragmentationViz";
const BLOCK_TERMS = [
  {
    symbol: "n_r",
    name: "Request token 수",
    description: "Request r에서 현재 KV state를 보관해야 하는 token 수입니다.",
  },
  {
    symbol: "B",
    name: "Block size",
    description: "Physical KV block 하나가 담는 token slot 수입니다.",
  },
  {
    symbol: "m_r",
    name: "필요한 block 수",
    description: "n_r token을 담기 위해 request r에 연결해야 하는 fixed-size block 수입니다.",
  },
  {
    symbol: "w_r",
    name: "마지막 block의 빈 slot",
    description: "할당한 마지막 block에서 아직 쓰지 않은 token slot 수입니다.",
  },
] as const;

const ADDRESS_TERMS = [
  {
    symbol: "j",
    name: "Logical token position",
    description: "Request sequence 안에서 찾고 싶은 token의 0-based 위치입니다.",
  },
  {
    symbol: "T_r[i]",
    name: "Block table entry",
    description: "Request r의 i번째 logical block이 연결된 physical block ID입니다.",
  },
  {
    symbol: String.raw`\phi_r(j)`,
    name: "Physical block",
    description: "Logical position j의 KV를 실제로 담고 있는 GPU physical block입니다.",
  },
  {
    symbol: "o(j)",
    name: "Block 내부 offset",
    description: "선택한 physical block 안에서 j번째 token이 놓인 slot입니다.",
  },
] as const;


export default function Overview() { return <div className="space-y-16"><section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 길이를 모르는 답의 기록을 조금씩 늘립니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>모델이 답을 이어 쓸 때는 앞에서 계산한 기록을 다시 읽습니다. 처음 요청이 들어온 순간에는 답이 얼마나 길어질지 모릅니다. 가능한 최대 길이만큼 한 덩어리를 미리 잡으면 짧게 끝난 답에도 큰 공간이 묶입니다.</p><p>
            기록의 순서를 유지하면서 늘어난 만큼 저장 공간을 붙여야 합니다. 같은 앞부분을 가진 두 요청이 있으면 이미 만든 기록을 함께 쓰고 싶습니다. 이 글에서는 35개 기록이
            38개, 49개로 늘어나는 한 요청을 따라갑니다.
          </p></div></section><section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 위치 목록과 저장 공간과 계산기를 연결합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>입력 쪽은 이번에 보존할 기록이 몇 개인지 알려 줍니다. 가운데 관리자는 기록의 순서와 실제 저장 위치를 연결하는 목록을 유지합니다. 계산기는 그 목록을 따라 필요한 내용을 읽고 새 내용을 씁니다.</p><p>
            요청이 끝나면 연결을 놓지만 다른 요청이 같은 내용을 읽고 있을 수 있습니다. 끝났다는 알림 하나로 공간을 바로 덮어쓰지 않도록 누가 아직 사용하는지도 관리해야 합니다.
          </p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>이번에 보존할 길이를 받는다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>순서와 저장 위치를 연결한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>연결 목록으로 기록을 읽고 쓴다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>마지막 사용이 끝난 공간을 다시 쓴다</span></li></ol></section><section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 35개 기록은 16칸짜리 공간 3개에 들어갑니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>요청 A의 기록이 35개이고 저장 공간 하나에 16개씩 담는다고 합시다. 16+16+3으로 나뉘므로 공간 3개가 필요하고 마지막 공간의 13칸은 비어 있습니다. 세 공간의 번호는 7, 2, 9로 정합니다. 번호 순서와 기록 순서는 다릅니다. (가정)</p><p>처음 기록의 위치를 0으로 세면 현재 읽을 수 있는 위치는 0부터 34까지입니다. 위치 34는 세 번째 공간 9의 세 번째 칸, 즉 내부 위치 2에 있습니다. 아직 만들지 않은 위치 37을 지금 읽을 수는 없습니다. (가정)</p><p>기록이 3개 더 생기면 길이는 38이 됩니다. 마지막 공간의 빈칸에 들어가므로 새 공간은 필요 없습니다. 이때부터 위치 37이 유효해지고 공간 9의 내부 위치 5에서 읽습니다. 일반적인 한 종류의 전체 기록 보존만 가정하고 미리 확보할 여분은 두지 않습니다. (가정)</p></div></section><section id="inside-blocks" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 순서표와 사용 중 표시를 따로 둡니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>A의 순서표는 [7, 2, 9]입니다. 첫 16개는 7번 공간, 다음 16개는 2번 공간, 그다음은 9번 공간이라는 뜻입니다. 7번과 2번 공간이 실제 메모리에서 붙어 있을 필요는 없습니다.</p><p>별도로 각 공간의 사용 중 표시와 다시 줄 수 있는 공간 목록을 둡니다. 다른 요청 B가 A와 같은 앞의 32개 기록을 재사용하면 B의 순서표 앞에도 7, 2가 들어갑니다. 이 두 공간의 사용자는 각각 2개가 됩니다. (가정)</p><p>저장 위치를 찾는 목록, 빈 공간을 고르는 목록, 같은 내용인지 찾는 색인은 다른 질문에 답합니다. 하나의 번호가 같다는 이유만으로 내용이나 수명이 같다고 판단하면 안 됩니다.</p></div></section><section id="why-blocks" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 연속된 큰 빈자리와 중복 기록을 줄입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>공간 3개가 필요할 때 빈 공간이 여기저기 흩어져 있어도 순서표로 연결하면 됩니다. 35개 기록을 위해 가능한 최대 길이 전체가 비는 자리를 기다리지 않아도 됩니다. 다만 마지막 공간의 13칸은 아직 쓰지 않았으므로 낭비가 완전히 없어지지는 않습니다.</p><p>A와 B가 7번 공간을 함께 읽는데 A가 끝났다는 이유로 그 공간을 다른 내용으로 덮어쓰면 B의 계산이 깨집니다. 반대로 이미 모두 사용을 끝낸 기록은 같은 입력이 다시 올 때까지 남겨 둘 수도 있습니다. 사용 중인 상태와 내용이 남은 상태를 구분해야 하는 이유입니다.</p><p>이제 저장 공간을 나누는 단위와 순서표, 재사용을 찾는 방식에 이름을 붙이겠습니다.</p></div></section><section id="block-names" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 기록과 주소와 소유권에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>앞에서 센 기록의 단위는 모델의 token입니다. 앞선 위치에서 계산한 key와 value를 남긴 기록이 KV cache입니다. PagedAttention은 이런 기록을 흩어진 고정 크기 공간에 두고 순서표로 찾아 계산하는 방식을 제안했습니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "Logical block / physical block", "description": "요청의 연속된 token 구간과 실제 KV 저장 공간입니다.", "boundary": "Logical 순서와 physical 번호 순서는 다릅니다."}, {"term": "Block table / offset", "description": "요청 순서에서 physical ID를 찾는 목록과 block 안의 위치입니다.", "boundary": "아직 계산하지 않은 slot에 주소가 있어도 유효한 KV는 아닙니다."}, {"term": "Internal / external fragmentation", "description": "할당한 공간 안의 빈칸과 연속된 빈자리가 부족해서 못 쓰는 공간입니다.", "boundary": "한 group의 고정 block 가정 밖에는 추가 제약이 있습니다."}, {"term": "Reference count / pin", "description": "공간을 보유한 참조 수와 복사·전송 등이 끝날 때까지 추가로 붙잡는 참조입니다.", "boundary": "요청 수만 세면 실제 구현의 모든 보유 이유를 설명할 수 없습니다."}, {"term": "BlockPool / free queue", "description": "physical block의 참조와 재사용을 관리하는 부분, 다시 줄 수 있는 block 목록입니다.", "boundary": "Free에 예전 내용과 hash가 남아 있을 수 있습니다."}, {"term": "KVCacheManager / cache group", "description": "요청 길이를 할당 요구로 바꾸는 부분과 같은 보존 규칙으로 묶은 층들입니다.", "boundary": "다른 attention·상태 종류에는 서로 다른 수량 계산이 필요합니다."}, {"term": "Copy-on-write / fork", "description": "공유 내용을 바꾸기 전에 자기 공간으로 복사하는 방식과 같은 이력에서 갈라지는 실행입니다.", "boundary": "부모-자식 table 복사 모형과 현재 prefix-hit 코드는 같은 API가 아닙니다."}, {"term": "Automatic Prefix Caching / hash chain", "description": "같은 앞부분의 KV를 재사용하는 기능과 이전 구간의 hash를 다음 구간에 잇는 키입니다.", "boundary": "문자열이 비슷하다는 뜻이나 모든 모델 사이의 공유가 아닙니다."}, {"term": "Cache locality / replica", "description": "재사용할 기록이 요청이 도착한 장소와 시점에 남아 있는 성질과 모델 복제본입니다.", "boundary": "복제본을 늘리면 저장 기록과 대기열도 나뉩니다."}, {"term": "Radix tree / beam search", "description": "공통 앞부분을 경로로 합치는 자료 구조와 여러 출력 후보를 유지하는 탐색입니다.", "boundary": "자료 구조, 요청 선택 정책, 출력 탐색은 서로 다른 역할입니다."}]} /></section><section id="logical-physical-address" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 38개로 늘어난 A의 위치 37을 찾아갑니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>A의 길이가 35일 때는 마지막 유효 위치 34를 읽습니다. floor(34/16)=2이므로 table[2]=P9, 34 mod 16=2입니다. 뒤에 3 token의 KV를 만든 다음에는 길이 38이 되어 위치 37을 읽을 수 있습니다. (가정)</p><p>
            이때 floor(37/16)=2와 37 mod 16=5를 계산해 P9[5]를 선택합니다. 주소를 찾았어도 그 위치의 KV가 유효한지 따로 확인해야 합니다. 요청의 유효 길이와
            실행 완료 상태, 올바른 model·layer의 기록인지도 맞아야 합니다. (가정)
          </p><p>이어서 11 token을 더 보존하면 길이는 49입니다. 48칸을 넘기므로 P5 하나를 붙여 table=[P7,P2,P9,P5]로 만듭니다. 위치 48은 P5[0]입니다. 처음의 P7·P2·P9를 연속 공간으로 옮길 필요가 없습니다. (가정)</p></div><BlockAddressViz /><ExplainedFormula
        question="Request의 j번째 token KV를 흩어진 physical block에서 어떻게 찾을까요?"
        idea={
          <>
            j를 block size로 나눈 몫이 logical block index이고 나머지가 block 내부
            offset입니다. Block table은 logical index를 physical block ID로 번역합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
\phi_r(j) &= T_r\!\left[\left\lfloor j/B\right\rfloor\right] \\
o(j) &= j \bmod B
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\phi_r(j) &= \underbrace{T_r}_{\text{block table}}\!\left[\underbrace{\left\lfloor j/B\right\rfloor}_{\text{logical block index}}\right] \\
o(j) &= \underbrace{j \bmod B}_{\text{block 안 slot offset}}
\end{aligned}`}
        operations={[
          { expression: String.raw`T_r\!\left[\left\lfloor j/B\right\rfloor\right]`, annotation: ["token 위치 j를 block size B로 나눈 몫이 logical","index이고, block table이 그것을 physical ID로","번역합니다. B=16, j=37, T_r=[P7,P2,P9]면 P9"] },
          { expression: String.raw`j \bmod B`, annotation: ["나머지가 그 physical block 안의 slot입니다.","37 mod 16=5이므로 P9의 5번 slot을 읽습니다.","P7·P2·P9 숫자 순서는 sequence 순서와 무관합니다"] },
        ]}
        terms={ADDRESS_TERMS}
        assumptions={[
          "Token position은 0부터 시작하고 0≤j<n인 이미 계산한 위치만 읽습니다. 사례는 n=38로 늘어난 뒤입니다.",
          "실제 tensor address에는 layer·K/V·KV head·head dimension·dtype stride가 추가됩니다.",
          "Hybrid attention은 cache group마다 block table과 보존 규칙이 달라질 수 있습니다.",
        ]}
        interpretation="B=16, j=37, T_r=[P7,P2,P9]라면 floor(37/16)=2이므로 P9를 선택하고 offset 5를 읽습니다. P7·P2·P9의 숫자 순서는 sequence 순서와 무관합니다."
        title="Logical token position의 address translation"
      /></section><section id="fragmentation-kinds" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 마지막 빈칸과 연속 공간 부족은 다릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>A의 길이 35에는 ceil(35/16)=3개, 총 48칸이 필요해 13칸이 비어 있습니다. 길이 38에서는 10칸, 길이 49에서는 4개 block의 15칸이 비어 있습니다. 빈칸은 0 이상 16 미만이며 길이가 한 칸 늘 때 새 block을 받으면 잠깐 많아질 수 있습니다. (가정)</p><p>
            큰 입력도 같은 식으로 셉니다. 길이 1,000에 최대 2,048칸을 연속 예약하면 1,048칸이 비지만 16칸씩 필요한 만큼 받으면 63개 block의 1,008칸 중 8칸이
            비어 약 0.79%입니다. 평균 빈칸이 대략 절반이라는 설명은 길이의 나머지가 고르게 분포할 때의 근사이며 모든 부하의 법칙이 아닙니다. (가정)
          </p><p>전체 빈 공간은 충분해도 한 덩어리가 없으면 연속 할당에 실패할 수 있습니다. 같은 group의 고정 block을 연결하면 이 제약을 줄일 수 있습니다. 그래도 다른 group의 용량, 실행 token 상한, 요청 수, 복사 대기 등은 남습니다. Free block 개수 하나가 시스템 전체의 유일한 수용 조건은 아닙니다.</p><p>Block을 크게 하면 표와 관리 항목은 줄고 마지막 빈칸과 공유 단위는 커집니다. 여기의 16은 사례 값이며 모든 장치·kernel의 보편 기본값으로 사용하지 않습니다. 실제 byte에는 layer, KV head, head 크기, dtype, 정렬과 관리 공간이 더 들어갑니다.</p></div><FragmentationViz /><ExplainedFormula
        question="Fixed-size block을 쓰면 request 하나가 낭비할 수 있는 마지막 공간은 얼마나 될까요?"
        idea={
          <>
            Token 수를 block size로 나누어 올림하면 필요한 block 수가 나옵니다.
            하나의 full-attention group에서 길이만큼 할당할 때 빈 slot은 마지막 block에만 남고 B보다 작습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
m_r &= \left\lceil\frac{n_r}{B}\right\rceil \\
w_r &= m_rB-n_r, \qquad 0\le w_r < B
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
m_r &= \underbrace{\left\lceil\frac{n_r}{B}\right\rceil}_{\text{필요한 block 수(올림)}} \\
w_r &= \underbrace{m_rB-n_r}_{\text{마지막 block의 빈 slot}}, \qquad \underbrace{0\le w_r < B}_{\text{낭비는 한 block 미만}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\left\lceil\frac{n_r}{B}\right\rceil`, annotation: ["token 수를 block size로 나눠 올림하면 request가","차지할 block 수입니다. B=16, n=35면 ⌈35/16⌉=3"] },
          { expression: String.raw`m_rB-n_r`, annotation: ["할당한 slot 수에서 실제 token 수를 뺀","빈 slot입니다. 3×16−35=13 slot이 마지막","block에만 남고, B=16보다 작습니다"] },
          { expression: String.raw`0\le w_r < B`, annotation: ["빈 slot은 항상 한 block 미만이라 최대 context","8,192 slot을 미리 잡는 방식보다 낭비가 작지만","0은 아닙니다"] },
        ]}
        terms={BLOCK_TERMS}
        assumptions={[
          "한 cache group 안에서 모든 physical block이 같은 token block size B를 사용합니다.",
          "식은 token slot의 내부 fragmentation만 셉니다. KV tensor byte·metadata·alignment·workspace는 별도입니다.",
          "Block sharing이 있다면 physical capacity 계산에서 request별 m_r을 단순 합산하면 중복 계산됩니다.",
        ]}
        interpretation="B=16, n=35이면 3개 block에 48 slot을 할당하고 마지막 13 slot이 비어 있습니다. 최대 context 8,192 slot을 미리 잡는 방식보다 request 길이에 가깝게 늘어나지만 낭비가 0이라는 뜻은 아닙니다."
        title="Block allocation과 내부 fragmentation 상한"
      /></section></div>; }
