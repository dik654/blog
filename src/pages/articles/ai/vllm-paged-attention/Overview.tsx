import ExplainedFormula from "@/components/ui/explained-formula";
import { Link } from "react-router-dom";
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

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PagedAttention은 attention 식이 아니라 길이 모를 KV memory에서 출발합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Autoregressive decode는 과거 token의 K·V를 다시 계산하지 않도록 request별
          KV cache에 남깁니다. 문제는 output이 몇 token에서 끝날지 admission 시점에
          알 수 없다는 점입니다. 최대 context 길이만큼 연속 GPU memory를 미리
          예약하면 실제로 쓰지 않는 공간이 커지고, 크기가 다른 요청을 반복해서
          넣고 빼면 남은 free memory가 여러 조각으로 갈라집니다.
        </p>
        <p className="leading-8">
          PagedAttention은 sequence의 KV를 고정 크기 <em>logical block</em>으로
          나누고, request마다 가진 block table이 이를 GPU의 <em>physical block</em>
          에 연결합니다. Token이 늘 때 필요한 block만 추가하므로 최대 길이의 연속
          영역을 미리 잡을 필요가 없습니다. Physical block ID가 흩어져 있어도
          logical 순서는 block table이 보존합니다.
        </p>
      </div>

      <FragmentationViz />

      <ExplainedFormula
        question="Fixed-size block을 쓰면 request 하나가 낭비할 수 있는 마지막 공간은 얼마나 될까요?"
        idea={
          <>
            Token 수를 block size로 나누어 올림하면 필요한 block 수가 나옵니다.
            Request별 내부 낭비는 마지막 block 하나의 남은 slot뿐이므로 B보다 작습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
m_r &= \left\lceil\frac{n_r}{B}\right\rceil \\
w_r &= m_rB-n_r, \qquad 0\le w_r < B
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
m_r &= \underbrace{\left\lceil\frac{n_r}{B}\right\rceil}_{\text{기준량당 비율}} \\
w_r &= \underbrace{m_rB-n_r, \qquad 0\le w_r < B}_{\text{허용 경계 판정}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\left\lceil\frac{n_r}{B}\right\rceil`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Token 수를 block size로 나누어 올림하면 필요한","block 수가 나옵니다."] },
          { expression: String.raw`m_rB-n_r, \qquad 0\le w_r < B`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","Token 수를 block size로 나누어 올림하면 필요한","block 수가 나옵니다."] },
        ]}
        terms={BLOCK_TERMS}
        assumptions={[
          "한 cache group 안에서 모든 physical block이 같은 token block size B를 사용합니다.",
          "식은 token slot의 내부 fragmentation만 셉니다. KV tensor byte·metadata·alignment·workspace는 별도입니다.",
          "Block sharing이 있다면 physical capacity 계산에서 request별 m_r을 단순 합산하면 중복 계산됩니다.",
        ]}
        interpretation="B=16, n=35이면 3개 block에 48 slot을 할당하고 마지막 13 slot이 비어 있습니다. 최대 context 8,192 slot을 미리 잡는 방식보다 request 길이에 가깝게 늘어나지만 낭비가 0이라는 뜻은 아닙니다."
        title="Block allocation과 내부 fragmentation 상한"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="fragmentation-kinds" className="scroll-mt-20">
          Block 단위 paging은 두 종류의 fragmentation을 다르게 줄입니다
        </h3>
        <p className="leading-8">
          Internal fragmentation은 request에 배정했지만 그 request가 끝내 쓰지 않는
          공간입니다. 연속 예약에서는 최대 길이와 실제 길이의 차이 전체가 이 낭비가
          됩니다. 최대 2,048 token을 잡고 1,000 token에서 끝나면 1,048 slot, 절반이
          넘는 예약이 한 번도 쓰이지 않은 채 request 수명 내내 잠깁니다.
        </p>
        <p className="leading-8">
          Fixed-size block에서는 이 낭비가 마지막 block 하나의 빈 slot으로 줄어듭니다.
          B=16에서 1,000 token request는 63 block, 1,008 slot을 받고 8 slot만
          비어 있으므로 낭비율은 0.8%입니다. 길이에 관계없이 request당 낭비는 B보다
          작고, 평균으로 보면 B의 절반 정도입니다.
        </p>
        <p className="leading-8">
          External fragmentation은 남은 공간의 합은 충분한데 연속된 조각이 없어서
          새 request를 못 받는 상태입니다. 2,048·512·1,024 slot을 연속으로 잡은 세
          request 중 가운데 512가 끝나면 그 자리는 512보다 큰 요청을 담지 못합니다.
          앞뒤의 free 조각과 합칠 수 없기 때문입니다.
        </p>
        <p className="leading-8">
          Paging에서는 이 문제가 block 단위에서 사라집니다. 어느 physical block이든
          크기가 같고, block table이 logical 순서를 보존하므로 어떤 free block도 어떤
          logical block 자리에 들어갈 수 있습니다. 흩어진 free block 3개는 3 block이
          필요한 어느 request에게나 쓸모가 있어 free block 수가 유일한 admission
          조건이 됩니다.
        </p>
        <p className="leading-8">
          vLLM 논문의 profiling은 기존 system에서 실제 token state가 KV memory의
          20.4%에서 38.2%만 차지한다고 보고합니다. 나머지는 앞으로 쓸 reserved slot,
          internal fragmentation, external fragmentation이 나눠 갖습니다. 논문
          저자의 자기보고 수치이며 model과 workload에 따라 비율은 달라집니다.
        </p>
        <p className="leading-8">
          Block size는 두 낭비 사이의 조절 손잡이입니다. B를 키우면 block table과
          hash 항목은 줄지만 마지막 block의 평균 빈 slot이 커지고, prefix 공유
          단위도 거칠어집니다. vLLM의 기본값 16은 이 균형에서 나온 값이며, 다른
          kernel이나 hardware는 다른 값을 요구할 수 있습니다.
        </p>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="logical-physical-address" className="scroll-mt-20">
          Block table은 page table처럼 sequence 위치를 physical 주소로 바꿉니다
        </h3>
        <p className="leading-8">
          예를 들어 block size가 16이고 token position이 37이라면 logical block은
          2, block 내부 offset은 5입니다. Request의 block table에서 세 번째 entry를
          찾아 physical block ID를 얻고 그 안의 5번 slot을 읽습니다. Attention
          kernel은 이 mapping을 따라 과거 K·V를 모으므로 physical memory가
          연속일 필요가 없습니다.
        </p>
      </div>

      <BlockAddressViz />

      <ExplainedFormula
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
\phi_r(j) &= \underbrace{T_r\!\left[\left\lfloor j/B\right\rfloor\right]}_{\text{기준량당 비율}} \\
o(j) &= \underbrace{j \bmod B}_{\text{오른쪽 항으로 결과 계산}}
\end{aligned}`}
        operations={[
          { expression: String.raw`T_r\!\left[\left\lfloor j/B\right\rfloor\right]`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","j를 block size로 나눈 몫이 logical block","index이고 나머지가 block 내부 offset입니다."] },
          { expression: String.raw`j \bmod B`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","j를 block size로 나눈 몫이 logical block","index이고 나머지가 block 내부 offset입니다."] },
        ]}
        terms={ADDRESS_TERMS}
        assumptions={[
          "Token position은 0부터 시작하고 block table entry 순서가 request의 logical 순서입니다.",
          "실제 tensor address에는 layer·K/V·KV head·head dimension·dtype stride가 추가됩니다.",
          "Hybrid attention은 cache group마다 block table과 보존 규칙이 달라질 수 있습니다.",
        ]}
        interpretation="B=16, j=37, T_r=[P7,P2,P9]라면 floor(37/16)=2이므로 P9를 선택하고 offset 5를 읽습니다. P7·P2·P9의 숫자 순서는 sequence 순서와 무관합니다."
        title="Logical token position의 address translation"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="paper-pagedattention" className="scroll-mt-20">
          vLLM 논문의 핵심: OS paging의 indirection을 KV cache에 적용합니다
        </h3>
        <p className="leading-8">
          <a href="https://arxiv.org/abs/2309.06180">
            Efficient Memory Management for Large Language Model Serving with PagedAttention
          </a>
          은 request별 연속 KV 예약이 만드는 internal·external fragmentation과
          parallel sampling·beam search의 중복 KV를 문제로 삼았습니다.
        </p>
        <p className="leading-8">
          Logical
          block과 non-contiguous physical block을 분리하고 reference count와
          copy-on-write를 이용해 block을 안전하게 공유하는 memory manager, 그리고
          block table을 읽는 attention kernel을 함께 제안했습니다.
        </p>
        <p className="leading-8">
          논문의 throughput 배수는 당시 model·GPU·workload·scheduler에서 나온
          system 결과입니다. “Paging을 쓰면 언제나 같은 배수로 빨라진다”는 보편
          정리가 아닙니다. 현재 V1 구현은 더 많은 model type과 prefix cache를
          다루므로 source revision과 runtime metric을 다시 확인해야 합니다.
        </p>

        <h3 id="memory-kernel-boundary" className="scroll-mt-20">
          Paged KV manager와 paged attention kernel은 책임이 다릅니다
        </h3>
        <p className="leading-8">
          Memory manager는 block allocation, reference count, free, cache lookup과
          eviction을 맡습니다. Block을 누가 언제까지 소유하는지를 아는 유일한
          계층이므로, 다른 계층은 block ID를 받아 읽기만 하고 수명은 건드리지
          않습니다.
        </p>
        <p className="leading-8">
          Attention kernel은 block table과 slot mapping을 읽어 Q가 참조할 K·V를
          찾아 dot-product attention을 계산합니다. Kernel이 보는 것은 주소뿐이므로
          block이 공유되었는지, 언제 free될지는 kernel 성능이나 정확도와 무관합니다.
        </p>
        <p className="leading-8">
          Scheduler는 필요한 slot을 manager에 요청하고 실패하면 request를 줄이거나
          preempt합니다. 자세한 전이는
          <Link to="/ai/vllm-scheduler#preemption"> scheduler 글</Link>이 소유합니다.
        </p>
      </div>
    </section>
  );
}
