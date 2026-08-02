import { Link } from 'react-router-dom';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import {
  CapabilityCheck,
  BeginnerOpening,
  ComparisonTable,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { MemoryTierViz, MoeRoutingViz, StreamingTimelineViz } from './moe-ssd-streaming/viz/MoeStreamingViz';

export default function MoeSsdStreamingArticle() {
  return (
    <>
      <section id="three-numbers" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">전체 크기와 지금 책상 위에 필요한 양은 다르다</h2>
        <BeginnerOpening
          title="거대한 창고의 물건을 모두 작업대에 올릴 필요는 없다"
          description={<>모델의 <strong>파라미터</strong>는 학습으로 정해진 수많은 숫자다. <strong>744B</strong>는 그 숫자가 약 7,440억 개라는 뜻이고, <strong>RAM</strong>은 실행 중 바로 꺼내 쓰는 작업대, SSD는 더 크지만 느린 창고에 가깝다.</>}
          familiarScene={<>도서관에 책 37만 권이 있어도 한 사람이 지금 읽는 책은 몇 권뿐이다. 자주 찾는 책은 책상에 두고, 나머지는 서가에서 필요할 때 가져오면 전체 도서관보다 훨씬 작은 책상으로도 일할 수 있다.</>}
          steps={[
            { label: '전체를 SSD에 저장한다', detail: '모든 파라미터가 차지하는 저장 공간을 먼저 계산한다.' },
            { label: '이번 계산에 쓸 일부를 고른다', detail: 'MoE의 선택기(router)가 입력마다 필요한 전문가 묶음을 고른다.' },
            { label: '자주 쓰는 일부만 RAM에 둔다', detail: '나머지는 SSD에서 읽고, 다시 쓸 가능성이 큰 것은 임시 저장한다.' },
          ]}
        />
        <QuestionLead
          question="7,440억 개 파라미터를 가진 모델을 25GB RAM에서 실행했다면 모델 전체가 RAM에 들어간 것일까?"
          answer="아니다. 744B는 저장된 전체 parameter, 약 40B는 token 하나가 지나며 계산에 참여하는 active parameter, 25GB는 runtime이 허용한 resident RAM budget이다. Colibri case는 dense 공통 weight와 cache만 RAM에 두고 routed expert 대부분을 SSD에서 필요할 때 읽는다."
        />
        <ConceptPrimer
          items={[
            { term: 'Total parameter', meaning: 'Model checkpoint에 존재하는 모든 dense와 expert weight 수다.', why: 'Disk capacity와 전체 model capacity를 설명한다.' },
            { term: 'Active parameter', meaning: 'Token 하나의 forward에서 실제 matmul에 참여하는 parameter 수다.', why: 'FLOPs/token의 큰 부분을 설명하지만 RAM residency와 같지는 않다.' },
            { term: 'Resident weight', meaning: '현재 VRAM이나 RAM에 계속 남아 즉시 읽을 수 있는 weight다.', why: 'Memory capacity와 cache hit, 실제 latency를 설명한다.' },
            { term: 'Working set', meaning: '짧은 실행 구간에서 반복적으로 접근하는 weight와 runtime buffer의 집합이다.', why: '전체 model보다 작으면 cache와 tiering으로 capacity 문제를 바꿀 수 있다.' },
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            4-bit로 단순 계산하면 744B weight의 raw payload는 약 372GB다. 실제 file에는 quantization scale, alignment, metadata가 더해지고
            일부 tensor는 다른 precision을 쓸 수 있으므로 정확한 크기는 container를 읽어야 한다.
          </p>
          <M display>{'744\\times10^9\\ \\mathrm{parameters}\\times\\frac{4\\ \\mathrm{bits}}{8\\ \\mathrm{bits/byte}}\\approx372\\ \\mathrm{GB}'}</M>
          <FormulaNote
            meaning="왜 4/8을 곱하나: parameter 하나를 4 bit로 저장하고 1 byte가 8 bit이므로 parameter당 0.5 byte가 필요하기 때문이다. 이 값은 weight payload의 근사치이며 quantization scale, mixed precision tensor, file alignment는 별도다."
            symbols={[
              ['744×10^9', '전체 parameter 수의 근사치'],
              ['4 bits', '가정한 parameter당 quantized storage'],
              ['8 bits/byte', 'bit를 byte로 변환하는 단위'],
              ['372 GB', 'metadata를 제외한 decimal GB 기준 근사 payload'],
            ]}
          />
          <p>
            2026년 7월 Colibri 저장소는 GLM-5.2의 dense part 약 17B를 int4 약 9.9GB로 resident하게 두고,
            routed expert 19,456개를 약 370GB SSD store에 둔다고 설명한다. Token마다 바뀌는 routed expert read는 cold 상태에서 약 11GB/token으로 보고한다.
            이 숫자는 MoE 일반 법칙이 아니라 해당 model, quantization, runtime의 author-reported case다.
          </p>
        </div>
        <Misconception>
          “Active 40B”는 40B weight를 한 번 SSD에서 읽으면 token이 끝난다는 뜻이 아니다. Active compute에는 resident dense path도 포함되고,
          routed expert는 layer마다 다른 file range에서 선택된다. FLOPs와 memory traffic을 따로 계산해야 한다.
        </Misconception>
      </section>

      <section id="router-working-set" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Router는 어떤 weight가 필요한지 어떻게 정할까?</h2>
        <MoeRoutingViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Dense Transformer의 FFN은 모든 token이 같은 weight를 사용한다. Sparse MoE는 FFN을 expert bank로 바꾸고,
            router <M>g(x)</M>가 현재 hidden state <M>x</M>에서 expert score를 만든 뒤 Top-k를 선택한다.
          </p>
          <M display>{'y=\\sum_{i\\in\\operatorname{TopK}(g(x))}p_i(x)E_i(x)+E_{shared}(x)'}</M>
          <FormulaNote
            meaning="왜 TopK를 쓰나: 많은 expert가 model capacity를 나눠 갖되 token당 계산량은 k개 expert로 제한하기 위해서다. 왜 p_i를 곱하나: 선택된 expert를 모두 동일하게 더하지 않고 router confidence에 따라 출력 기여도를 조절하기 위해서다. Shared expert는 routing과 무관하게 공통 패턴을 처리한다."
            symbols={[
              ['x', '현재 layer에 들어온 token hidden state'],
              ['g(x)', '각 expert의 router score 또는 logit'],
              ['TopK', 'score가 높은 k개 expert index 선택'],
              ['p_i(x)', '선택된 expert i에 적용하는 normalized router weight'],
              ['E_i(x)', 'routed expert i의 FFN output'],
              ['E_shared(x)', '모든 token이 통과하는 공통 expert output'],
            ]}
          />
          <p>
            Runtime은 router가 낸 expert id를 file offset에 매핑할 수 있다. 그래서 OS page fault가 생길 때까지 기다리는 것보다
            어떤 block을 읽을지 명시적으로 schedule하고, layer별 cache와 asynchronous readahead를 구성할 수 있다.
          </p>
        </div>
      </section>

      <section id="memory-tiers" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">VRAM·RAM·SSD를 한 계층으로 쓰면 무슨 일이 일어날까?</h2>
        <MemoryTierViz />
        <ComparisonTable
          headers={['Tier', '무엇을 두나?', '좋은 점', '비용']}
          rows={[
            ['VRAM / GPU tier', '가장 뜨거운 expert · compute buffer', '가장 빠른 matmul과 높은 bandwidth', '용량이 작고 비쌈'],
            ['RAM resident', 'attention · embedding · shared expert · LRU cache', 'SSD보다 빠르고 CPU가 바로 계산', '큰 model 전체를 담기 어려움'],
            ['OS page cache', '최근 읽은 file page', '추가 구현 없이 재사용', 'model semantics와 eviction 우선순위를 모름'],
            ['NVMe SSD', 'cold routed expert 전체', '수백 GB capacity를 저렴하게 확보', 'random-read latency와 bandwidth가 낮음'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <code>mmap</code>도 file page를 필요할 때 RAM에 올리고 OS page cache가 재사용한다. Expert-aware runtime의 차이는 router와 layer 구조를 알고
            per-layer cache, pinned hot set, readahead를 더 명시적으로 제어할 수 있다는 점이다. 둘은 완전히 배타적이지 않으며 runtime이 OS cache를 함께 활용할 수도 있다.
          </p>
        </div>
      </section>

      <section id="cache-prefetch" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Cache와 prefetch는 대기를 얼마나 숨길 수 있을까?</h2>
        <StreamingTimelineViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Cache hit rate를 <M>h</M>, token에서 요청한 routed expert byte를 <M>{'B_{routed}'}</M>라고 하면 단순한 miss byte 근사는
            <M>{'B_{miss}=B_{routed}(1-h)'}</M>다. 실제로는 layer별 expert 크기, duplicate selection, batch union,
            OS page cache 때문에 더 복잡하지만 RAM이 속도를 높이는 방향은 이 식에서 보인다.
          </p>
          <M display>{'B_{miss}\\approx B_{routed}(1-h)'}</M>
          <FormulaNote
            meaning="왜 1-h를 곱하나: 요청 byte 중 cache hit 비율 h는 SSD를 읽지 않고 재사용하고, 나머지 miss 비율만 storage에서 가져온다고 단순화한 것이다. 이 근사는 expert 크기가 비슷하다는 가정이 있으며 실제 runtime은 byte-weighted hit rate를 측정해야 한다."
            symbols={[
              ['B_miss', 'token당 SSD에서 실제 읽어야 하는 routed expert byte 근사'],
              ['B_routed', 'cache를 고려하기 전 요청된 routed expert 총 byte'],
              ['h', '0과 1 사이의 byte-weighted cache hit rate'],
            ]}
          />
          <p>
            Hot expert는 workload에 의존한다. Coding prompt로 만든 usage histogram이 다른 언어와 domain에서도 같은 hit rate를 보장하지 않는다.
            다음 layer routing을 예측하는 prefetch도 맞으면 compute 뒤에 I/O를 숨기지만, 틀리면 random read와 cache eviction을 늘린다.
          </p>
          <p>
            Speculative decoding 역시 무조건 빠르지 않다. 한 forward에서 여러 draft token을 검증하면 batch 전체가 요청한 unique expert의 합이 커질 수 있다.
            Cold cache에서는 줄인 forward 수보다 늘어난 expert read가 더 비쌀 수 있으므로 acceptance와 expert-load/token을 함께 측정해야 한다.
          </p>
        </div>
      </section>

      <section id="honest-throughput" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">왜 빠른 SSD에서도 대화 속도는 느릴까?</h2>
        <QuestionLead
          question="SSD가 14GB/s라면 11GB/token을 1초 안에 읽어 1 token/s 이상 나오지 않을까?"
          answer="그 숫자는 보통 큰 연속 file의 sequential read다. Expert streaming은 거대한 container 곳곳의 작은 block을 layer 순서로 읽는 random-read workload다. Queue depth, file layout, page cache, compute overlap, cache miss가 실제 effective rate를 정한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Overlap되지 않은 miss byte를 <M>{'B_{miss}'}</M>, 실제 random-read 처리량을 <M>{'R_{random}'}</M>,
            숨기지 못한 계산 시간을 <M>{'T_{compute}'}</M>라고 두면 token latency의 하한을 다음처럼 생각할 수 있다.
          </p>
          <M display>{'T_{token}\\gtrsim\\frac{B_{miss}}{R_{random}}+T_{compute,nonoverlap},\\quad \\mathrm{TPS}\\lesssim\\frac{1}{T_{token}}'}</M>
          <FormulaNote
            meaning="왜 byte를 throughput으로 나누나: 전송해야 할 데이터 양을 초당 처리 가능한 byte로 나누면 최소 I/O 시간이 되기 때문이다. 왜 nonoverlap compute만 더하나: prefetch로 I/O와 동시에 실행된 계산은 critical path에 두 번 더하면 안 된다. TPS는 token 한 개의 초 단위 latency의 역수다."
            symbols={[
              ['T_token', 'decode token 하나의 wall-clock latency'],
              ['B_miss', 'cache와 prefetch 뒤에도 critical path에서 읽어야 하는 byte'],
              ['R_random', '해당 access pattern에서 측정한 effective random-read byte/s'],
              ['T_compute,nonoverlap', 'I/O와 겹치지 못한 attention, dequant, matmul 시간'],
              ['TPS', '초당 생성 token 수의 상한 근사'],
            ]}
          />
          <p>
            Colibri README의 25GB RAM reference 환경은 cold decode를 약 0.05~0.1 token/s로 보고한다.
            이는 독립 benchmark가 아니라 author-reported measurement이며 SSD, filesystem, RAM cache, CPU, prompt에 따라 달라진다.
            Headline은 “interactive assistant가 됐다”가 아니라 <strong>model storage capacity와 fast-memory capacity를 sparse routing으로 분리했다</strong>는 proof of concept다.
          </p>
          <p>
            Read 중심 workload는 NAND write endurance를 크게 쓰지 않지만 위험이 0은 아니다. RAM 부족으로 swap이 발생하면 write가 늘고,
            sustained read는 NVMe 온도를 올려 thermal throttling을 만들 수 있다. Memory budget과 drive temperature를 함께 관측해야 한다.
          </p>
        </div>
      </section>

      <section id="fit-check" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">어떤 작업에 쓸 수 있고 무엇을 먼저 계산해야 할까?</h2>
        <ComparisonTable
          headers={['작업', '적합성', '이유']}
          rows={[
            ['실시간 chat assistant', '낮음', '첫 token과 decode latency가 사용자 interaction 기준에 너무 큼'],
            ['밤새 batch 분석', '조건부 가능', 'latency보다 model quality와 local execution이 중요할 수 있음'],
            ['Air-gapped 검증', '조건부 가능', 'data를 외부에 보내지 않는 대신 긴 처리 시간을 수용'],
            ['Runtime 연구 / proof of concept', '높음', 'routing locality, tiering, prefetch를 실험하는 좋은 대상'],
            ['일반 개인 local AI', '대개 작은 resident model 우선', 'RAM에 맞는 model이 수십~수백 배 더 빠르고 운영이 단순'],
          ]}
        />
        <CapabilityCheck
          title="실행 전 계산할 것"
          items={[
            'Quantization scale을 포함한 전체 disk footprint를 확인한다.',
            'Dense resident weight와 KV/cache/runtime buffer의 peak RAM을 합친다.',
            'Layer 수 × Top-k × expert byte로 cold read/token을 근사한다.',
            'SSD sequential spec 대신 실제 random access pattern을 benchmark한다.',
            'Cache hit, expert-load/token, read GB/token을 함께 기록한다.',
            '원하는 response 길이에서 wall-clock 완료 시간을 계산한다.',
            'Speculation을 켜기 전후 acceptance와 unique expert load를 비교한다.',
            'Swap과 thermal throttling이 없는지 관측한다.',
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            MoE 자체의 model 구조가 더 필요하면 <Link to={articlePath('ai', 'llm-architecture-sparse-moe')}>Sparse MoE 구조 글</Link>로,
            memory와 I/O 병목 계산은 <Link to={articlePath('gpu', 'hw-bandwidth-deep-dive')}>Bandwidth Deep Dive</Link>로 이어가면 된다.
          </p>
        </div>
        <SourceNotes
          sources={[
            { label: 'Colibri repository', href: 'https://github.com/JustVugg/colibri', note: 'GLM-5.2 expert streaming, resident weight, cache, prefetch, author-reported throughput의 구현 정본.' },
            { label: 'GLM-5.2 model config', href: 'https://huggingface.co/zai-org/GLM-5.2/blob/main/config.json', note: 'Expert count, Top-k, layer와 architecture field를 확인하는 model metadata.' },
            { label: 'AirLLM', href: 'https://github.com/lyogavin/airllm', note: 'Dense layer를 storage에서 순차 streaming하는 prior-art 비교 대상.' },
          ]}
        />
      </section>
    </>
  );
}
