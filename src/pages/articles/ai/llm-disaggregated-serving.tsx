import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  BeginnerOpening,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  DisaggregatedFlowLab,
  ServingPressureLab,
  ServingReleaseGate,
} from './llm-disaggregated-serving/viz/DisaggregatedServingLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-6 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-[13px] sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function LlmDisaggregatedServingArticle() {
  return (
    <>
      <section id="slo-first" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">첫 답을 기다리는 시간과 답이 이어지는 속도는 다르다</h2>
        <BeginnerOpening
          title="언어 모델의 한 요청에는 성격이 다른 두 계산 단계가 있다"
          description={<>먼저 사용자가 보낸 글 전체를 읽고 재사용할 중간값을 만드는 단계를 <strong>Prefill</strong>, 그 뒤 답을 한 토큰씩 이어 만드는 단계를 <strong>Decode</strong>라고 한다. <strong>처리량(throughput)</strong>은 서버 전체가 단위 시간에 처리한 양이라서 한 사용자가 느끼는 기다림을 그대로 말해 주지 않는다.</>}
          familiarScene={<>식당에서 열 명의 주문서를 한꺼번에 읽고 재료를 준비하는 일과, 각 접시에 음식을 한 번에 하나씩 올려 내보내는 일을 생각해 보자. 주방 전체 생산량이 늘어도 어떤 손님의 첫 접시는 늦을 수 있고, 음식 사이 간격이 들쭉날쭉할 수도 있다.</>}
          steps={[
            { label: '입력을 한꺼번에 읽는다', detail: 'Prefill이 긴 질문을 처리하고 이후 생성에 쓸 KV 상태를 만든다.' },
            { label: '출력을 한 조각씩 만든다', detail: 'Decode가 저장된 상태를 읽으며 새 토큰을 반복해서 생성한다.' },
            { label: '사용자 시간으로 나눠 잰다', detail: '첫 토큰 시간, 토큰 사이 간격과 요청 대기열을 각각 측정한다.' },
          ]}
        />
        <QuestionLead
          question="GPU 서버의 전체 처리량은 올랐는데, 왜 어떤 사용자는 첫 답을 오래 기다리고 어떤 사용자는 답이 중간중간 끊길까?"
          answer="한 요청에는 서로 다른 시간 분포가 있기 때문이다. Prefill은 첫 token까지의 TTFT를 크게 좌우한다. Decode에서는 요청별로 첫 token 뒤 평균 시간을 낸 TPOT와, 실제 연속 token 간격을 하나씩 모은 ITL을 구분해야 한다. 평균 tokens/s는 이 분포와 queue tail을 한 숫자로 섞어 버린다."
        />
        <ConceptPrimer items={[
          { term: 'TTFT · Time To First Token', meaning: '요청을 보낸 뒤 첫 output token을 받기까지의 시간이다.', why: 'Queue, prompt prefill, KV handoff와 첫 decode가 모두 들어가므로 입력이 긴 workload의 체감 시작점을 보여 준다.' },
          { term: 'TPOT · Time Per Output Token', meaning: '각 request에서 첫 token을 제외한 생성 시간을 남은 output token 수로 나눈 요청별 평균이다.', why: 'Request마다 평균 stream 속도를 비교하지만 순간적인 token 간 jitter는 평균에 가려질 수 있다.' },
          { term: 'ITL · Inter-Token Latency', meaning: '연속한 output token 두 개가 도착한 실제 시간 간격의 표본이다.', why: '모든 token interval의 p95·p99를 보면 preemption과 stream 끊김의 tail이 드러난다.' },
          { term: 'Prefill', meaning: 'Prompt token을 병렬로 처리해 각 layer의 K·V state를 만드는 단계다.', why: '긴 prompt의 큰 matrix 연산이 decode batch를 방해할 수 있고, 분리하면 이 state를 다른 worker로 넘겨야 한다.' },
          { term: 'Decode', meaning: '이전 KV를 읽어 새 token 하나와 그 token의 KV를 추가하는 반복 단계다.', why: '출력이 길고 동시 요청이 많을수록 HBM capacity와 bandwidth가 서비스 한계를 만든다.' },
          { term: 'GEMM · General Matrix Multiplication', meaning: '큰 행렬 곱을 한 번에 계산하는 GPU의 대표 연산이다.', why: '긴 prompt를 묶어 처리하는 prefill이 GPU 연산기를 얼마나 잘 채우는지 설명한다.' },
          { term: 'Roofline', meaning: '연산량과 memory 이동량 중 어느 쪽이 성능 상한을 만드는지 비교하는 성능 모델이다.', why: 'Prefill·decode라는 이름만으로 compute-bound와 bandwidth-bound를 단정하지 않게 한다.' },
          { term: 'GQA · Grouped-Query Attention', meaning: '여러 query head가 더 적은 수의 key·value head를 함께 쓰는 attention 구조다.', why: '저장할 KV head 수 H_KV가 줄어 같은 context의 KV byte와 handoff payload가 작아진다.' },
          { term: 'MLA · Multi-head Latent Attention', meaning: '각 token의 key·value 정보를 더 좁은 latent 표현으로 압축해 저장하고 attention 계산에 재사용하는 구조다.', why: '전체 head별 KV 대신 압축 state를 보존하므로 모델별 KV layout과 전송 폭이 달라진다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>요청은 <strong>도착 → queue → prefill → 첫 token → 반복 decode → stream 종료</strong> 순서로 흐른다. 짧은 채팅과 32K 문서 요약을 같은 평균으로 합치면 어느 구간이 느린지 사라진다. 먼저 입력 길이, 출력 길이, 동시성, prefix 재사용률과 취소율의 분포를 고정한다. 그 뒤 TTFT, request-level TPOT와 token-interval ITL의 p50·p95·p99를 서로 다른 histogram으로 본다.</p>
          <p>Disaggregated serving은 이 요청을 prefill pool과 decode pool에 나눠 맡기는 구조다. 목적은 “서버를 많이 쓴다”가 아니다. 서로 다른 phase를 독립적으로 scale하고, 긴 prefill이 이미 진행 중인 decode를 흔드는 간섭을 줄이는 것이다. 대신 prefill이 만든 거대한 KV state를 decode 쪽에 전달하는 새 critical path가 생긴다.</p>
        </div>
        <ServingPressureLab />
        <Misconception>Throughput이 2배가 되었다는 실험이 TTFT와 TPOT를 모두 2배 개선했다는 뜻은 아니다. Admission policy가 더 많은 요청을 받아 throughput은 오르면서 tail latency나 rejection이 나빠질 수도 있다. 같은 workload와 같은 SLO에서 비교해야 한다.</Misconception>
      </section>

      <section id="phase-pressure" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Prefill과 decode는 무엇을 두고 경쟁할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Prefill에서는 prompt token이 한꺼번에 들어와 큰 GEMM을 만들기 쉽다. 긴 prompt와 충분한 batch가 있으면 GPU compute를 잘 채울 수 있지만, 한 번의 iteration이 길어진다. Decode에서는 active request마다 보통 새 token 하나만 계산한다. 작은 batch에서는 매 step model weight와 긴 KV를 읽는 시간이 커져 memory bandwidth에 묶이기 쉽다.</p>
          <p>이 설명은 보편적인 하드웨어 법칙이 아니라 출발점이다. MoE의 expert communication, MLA·GQA의 KV width, chunked prefill, tensor parallel 크기, kernel fusion과 batch가 roofline 위치를 바꾼다. 따라서 phase 이름으로 resource를 단정하지 말고 profiler에서 achieved FLOPs, HBM traffic, iteration duration과 queue time을 확인한다.</p>
          <p>한 pool에서는 scheduler가 prefill과 decode를 같은 iteration에 섞거나 번갈아 처리한다. 이 방식은 KV를 다른 process로 옮기지 않아 단순하다. 하지만 긴 prefill이 들어오면 이미 답을 생성 중인 request의 다음 token이 늦어질 수 있다. Orca가 request 전체가 아니라 iteration 단위로 batch를 다시 구성한 이유도 autoregressive request의 길이가 서로 다르고 매 token마다 완료 상태가 달라지기 때문이다.</p>
        </div>
        <DisaggregatedFlowLab />
        <Misconception>Prefill은 언제나 compute-bound이고 decode는 언제나 bandwidth-bound라는 문장을 topology 결정식으로 쓰면 안 된다. 이것은 후보 가설이다. 실제 model·kernel·batch·parallelism에서 profiler와 SLO trace로 확인해야 한다.</Misconception>
      </section>

      <section id="kv-handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">분리하면 어떤 KV 이동 빚이 생길까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>KV cache는 “과거 문장을 저장한다”는 추상적인 메모리가 아니다. 각 layer에서 attention이 다음 token에 재사용할 state다. Explicit K/V head tensor를 저장하는 MHA·GQA에서는 token 하나가 늘 때 layer 수, KV head 수, head dimension과 dtype에 비례해 byte가 늘어난다. MLA는 compressed latent, decoupled RoPE key와 구현별 auxiliary state를 저장하므로 아래 head 식에 H<sub>KV</sub>만 대입하지 않고 실제 cache layout의 component byte를 합산한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{m_{KV/token}^{MHA/GQA}}_{\text{MHA·GQA token당 KV}}
&=\underbrace{2}_{\text{K와 V}}\times\underbrace{L}_{\text{층}}\times\underbrace{H_{KV}}_{\text{KV head}}\\[0.55em]
&\quad\times\underbrace{d_h}_{\text{head 폭}}\times\underbrace{\frac{b_{KV}}{8}}_{\text{원소 byte}}
\end{aligned}`}
          meaning="Explicit K와 V를 모두 저장하므로 2를 곱한다. 그 뒤 실제 layer, KV head, head 폭과 원소 byte를 차례로 곱하면 token 하나가 추가하는 cache byte가 된다. MLA에는 이 식을 적용하지 않고 compressed latent와 RoPE·auxiliary cache의 실제 layout을 합산한다."
          symbols={[[String.raw`L`, 'Transformer layer 수'], [String.raw`H_{KV}`, 'MHA·GQA에서 실제 저장하는 KV head 수'], [String.raw`d_h`, '저장되는 head 하나의 channel 수'], [String.raw`b_{KV}`, 'KV element의 bit 수'], [String.raw`m_{KV/token}^{MHA/GQA}`, 'MHA·GQA request에서 token 하나가 추가할 explicit K/V byte']]}
        />
        <Formula
          latex={String.raw`\underbrace{2\times32\times8\times128\times2}_{\text{K·V × 층 × KV head × 폭 × byte}}
=\underbrace{128\ \mathrm{KiB/token}}_{\text{예제 결과}}`}
          meaning="32-layer, 8 KV-head, head dimension 128, BF16인 MHA·GQA 예제의 수치를 위 식에 대입하면 token 하나가 128 KiB를 만든다. KV quantization을 쓰면 마지막 byte가 달라지지만 kernel 지원과 품질 조건을 다시 검증해야 한다."
          symbols={[[String.raw`32`, 'Transformer layer 수'], [String.raw`8`, 'KV head 수'], [String.raw`128`, 'head dimension'], [String.raw`2\ \mathrm{byte}`, 'BF16 원소 하나의 크기']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>8,192-token prompt는 이 예제에서 정확히 1 GiB의 KV를 만든다. Aggregated worker는 같은 process 안에서 이 state를 계속 쓰지만, P/D 분리에서는 decode worker가 이를 볼 수 있어야 한다. 직접 GPU-to-GPU transfer를 쓰든 remote cache에서 불러오든 이 byte가 사라지는 것은 아니다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{M_{handoff}}_{\text{넘겨야 할 prompt KV}}&=\underbrace{N_{prompt}}_{\text{입력 token 수}}\times m_{KV/token}\\[0.45em]
\underbrace{T_{handoff}}_{\text{전송 시간의 하한}}&\ge\underbrace{\frac{M_{handoff}}{BW_{effective}}}_{\text{payload 이동}}+\underbrace{T_{coord}}_{\text{등록·동기화·queue}}
\end{aligned}`}
          meaning="100 Gb/s는 12.5 GB/s의 line rate이고 payload 효율을 80%로 가정하면 10 GB/s다. 1 GiB는 약 1.074 GB이므로 순수 이동 하한만 약 107 ms다. 실제 TTFT에는 block registration, route, queue, protocol, synchronization과 fallback 비용이 더해진다."
          symbols={[[String.raw`N_{prompt}`, 'Prefill이 처리한 prompt token 수'], [String.raw`M_{handoff}`, 'Decode worker가 이어받아야 할 KV payload'], [String.raw`BW_{effective}`, 'Protocol과 access pattern을 포함해 측정한 실제 payload 대역폭'], [String.raw`T_{coord}`, '전송 전후 metadata, queue와 완료 동기화 시간']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Dynamo는 NIXL을 이용해 가능한 transport에서 GPU memory 간 비동기 KV 이동을 조정하고, vLLM·SGLang·TensorRT-LLM 같은 engine을 그 아래 backend로 둔다. 여기서 중요한 경계는 <strong>orchestrator가 engine을 대체하지 않는다</strong>는 점이다. Model runner와 attention kernel은 engine이, worker discovery·routing·KV transfer coordination은 상위 runtime이 맡는다.</p>
          <p>Cross-node에서는 InfiniBand, RoCE, EFA 같은 <strong>RDMA(Remote Direct Memory Access)</strong> 지원 fabric이 중요하다. RDMA는 CPU의 일반 network stack과 memory copy를 줄여 remote memory로 data를 옮기는 경로다. <strong>UCX</strong>와 <strong>libfabric</strong>은 application이 이런 transport를 선택·사용하게 하는 communication 계층이다. 설정이 잘못되어 TCP로 조용히 fallback하면 기능 테스트는 통과해도 handoff가 TTFT를 지배할 수 있다. Port-forwarding으로 잰 benchmark도 실제 cluster data path를 우회하므로 release evidence가 아니다.</p>
        </div>
      </section>

      <section id="routing-state" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Router는 load와 재사용 state를 어떻게 함께 볼까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>일반 load balancer는 queue가 짧은 worker를 고르면 된다. LLM worker에는 이미 계산한 prefix KV라는 state가 있다. 같은 system prompt나 긴 document prefix를 가진 요청을 그 state가 있는 worker로 보내면 prefill 계산을 줄일 수 있다. 그러나 cache overlap만 좇으면 인기 prefix를 가진 한 worker가 hot spot이 된다. 따라서 router는 <strong>재사용 가능한 token 수와 현재 queue·KV capacity</strong>를 함께 본다.</p>
          <p>서로 비슷해 보이는 기술의 책임을 분리해야 한다. Prefix caching은 한 engine 안에서 동일 prefix KV를 공유하는 memory mechanism이다. KV-aware routing은 그 cache가 있는 worker를 선택하는 control decision이다. P/D disaggregation은 phase ownership을 다른 pool로 나누는 topology다. KV offload는 GPU 밖 DRAM·SSD 같은 tier에 state를 보관하는 capacity mechanism이다. 하나를 켠다고 나머지가 자동으로 생기지 않는다.</p>
          <p>Mooncake는 long-context Kimi workload를 위해 prefill과 decode cluster를 분리하고 CPU DRAM·SSD까지 KV cache 계층으로 활용한다. 핵심은 cache가 많다는 사실보다 SLO 안에서 실제 처리할 수 있는 <em>effective capacity</em>를 scheduler가 계산하고, overload에서는 모든 요청을 받아 tail을 무너뜨리는 대신 일찍 reject하는 정책까지 포함했다는 점이다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{M_{used}}_{\text{KV 외 상주 memory}}&=M_W+M_{workspace}\\
\underbrace{M_{free}}_{\text{KV에 쓸 수 있는 HBM}}&=M_{HBM}-M_{used}\\
\underbrace{N_{request}}_{\text{request당 예상 token}}&=N_{prompt}+E[N_{out}]\\
\underbrace{M_{request}}_{\text{request당 예상 KV}}&=N_{request}m_{KV/token}\\
\underbrace{B_{max}}_{\text{동시 request 상한}}&\lesssim\frac{M_{free}}{M_{request}}
\end{aligned}`}
          meaning="동시성 상한은 weight가 들어간 뒤 남은 HBM을 request당 예상 KV로 나눈 첫 근사다. 실제 scheduler는 길이가 다른 sequence, block fragmentation, prefix sharing, preemption, CUDA graph와 temporary buffer를 고려한다. 따라서 이 값은 admission의 낙관적 상한이지 곧바로 max-num-seqs 설정값이 아니다."
          symbols={[[String.raw`M_{free}`, 'Weight와 workspace를 빼고 KV가 사용할 수 있는 memory'], [String.raw`M_{request}`, 'Prompt와 예상 output을 합친 request 하나의 KV memory'], [String.raw`E[N_{out}]`, 'Workload trace에서 얻은 예상 output token 수'], [String.raw`B_{max}`, 'KV capacity만 본 동시 request의 낙관적 상한']]}
        />
        <Misconception>Cache hit ratio가 높으면 항상 좋은 router가 아니다. Hit를 위해 queue가 긴 worker로 보내 TTFT가 더 늘 수 있다. Cache overlap으로 절약한 prefill 시간과 추가 queue time을 같은 요청 단위로 비교해야 한다.</Misconception>
      </section>

      <section id="aggregation-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">언제 한 pool이 더 나을까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>분리는 phase별 GPU를 독립적으로 늘릴 수 있고 긴 prefill이 decode를 막는 간섭을 줄인다. 하지만 worker pool이 두 개가 되고, model revision과 KV layout을 맞춰야 하며, request가 worker 경계를 한 번 더 건넌다. 작은 모델, 짧은 prompt, 낮은 동시성에서는 이 고정 비용이 절약할 간섭보다 클 수 있다. 앞서 계산한 KV handoff가 느린 fabric에서 TTFT를 지배하거나 connector가 불안정해 TCP fallback이 반복되는 경우도 aggregated baseline을 유지할 직접적인 거부 조건이다.</p>
          <p>다음 순서로 결정한다. 먼저 aggregated mode에서 chunked prefill과 scheduler token budget을 조정한다. 그래도 긴 prompt burst가 request-level p99 TPOT와 token-level p99 ITL을 흔드는지 각각 본다. 그다음 동일 trace에서 P/D를 나누고, KV handoff span을 분리해 잰다. 분리 뒤 TTFT가 좋아졌더라도 decode GPU가 놀거나 total GPU 수가 크게 늘어 TCO가 악화되면 제품 목표에 실패할 수 있다.</p>
          <p>4B·9B처럼 한 device나 한 GPU에 여유 있게 들어가는 모델은 특히 aggregated baseline이 강하다. On-device 목적이라면 network handoff 자체가 offline·privacy 목표와 충돌한다. 이 경우 <InternalLink slug="efficient-inference-on-device">효율 추론·On-device 예산</InternalLink>에서 weight, KV, backend partition과 thermal budget을 먼저 판단한다.</p>
        </div>
        <StopRule>짧은 prompt·낮은 concurrency·작은 model에서 aggregated가 SLO와 cost를 만족하거나, 실측 fabric·connector가 KV handoff를 SLO 안에 안정적으로 끝내지 못하면 분리하지 않는다. “최신 stack”이라는 이유로 KV transfer와 두 pool의 운영 복잡도를 추가하지 않는다.</StopRule>
      </section>

      <section id="release-gate" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">어떤 증거가 있어야 production에 올릴까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Release 비교의 입력은 같은 model revision, tokenizer, quantization, prompt/output 분포, arrival trace와 SLO다. Aggregated와 disaggregated에 서로 다른 synthetic request를 주면 topology 효과를 분리할 수 없다. Warm cache와 cold cache도 따로 replay한다.</p>
          <p>Metric은 평균 throughput 하나가 아니다. p50·p95·p99 TTFT, request-level TPOT, token-level ITL, end-to-end latency, admission, SLO attainment, SLO-goodput, active KV·eviction, prefix hit, queue, handoff byte·time, effective bandwidth, GPU utilization과 cost/request를 함께 본다. 이유는 한 최적화가 다른 queue로 비용을 옮길 수 있기 때문이다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{p99(TTFT)}_{\text{첫 token의 tail}}&\le\underbrace{S_{first}}_{\text{시작 응답 SLO}}\\[0.45em]
\underbrace{p99(TPOT_{req})}_{\text{요청별 평균 생성 시간의 tail}}&\le\underbrace{S_{TPOT}}_{\text{요청 stream SLO}}\\[0.45em]
\underbrace{p99(ITL_{token})}_{\text{개별 token 간격의 tail}}&\le\underbrace{S_{ITL}}_{\text{jitter SLO}}
\end{aligned}`}
          meaning="TPOT는 각 request의 평균 decode 속도이고 ITL은 개별 token 간격이다. 둘의 p99는 서로 다른 표본 분포다. 평균 stream 속도가 좋아도 일부 token interval이 길게 끊길 수 있으므로 둘을 따로 통과시킨다."
          symbols={[[String.raw`S_{first}`, '제품이 허용한 p99 first-token 시간'], [String.raw`TPOT_{req}`, '첫 token 뒤 request별 평균 output-token 시간'], [String.raw`ITL_{token}`, '연속 output token 사이의 개별 시간 간격'], [String.raw`S_{TPOT},S_{ITL}`, '요청 평균 속도와 순간 jitter에 각각 정한 SLO']]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{R_{admit}}_{\text{도착 요청 중 수용 비율}}&=\frac{N_{admit}}{N_{arrive}}\\[0.45em]
\underbrace{R_{SLO}}_{\text{수용 요청의 SLO 달성률}}&=\frac{N_{SLO}}{N_{admit}}\\[0.45em]
\underbrace{G_{SLO}}_{\text{SLO-goodput}}&=\frac{N_{SLO}}{\Delta t}
\end{aligned}`}
          meaning="Admission은 얼마나 거절했는지, attainment는 받아들인 요청 중 얼마나 SLO 안에 끝났는지, goodput은 단위 시간에 실제로 몇 건을 SLO 안에서 완료했는지 답한다. 세 값을 합치면 대량 reject로 latency만 좋아 보이는 실험을 막을 수 있다."
          symbols={[[String.raw`N_{arrive}`, '측정 구간에 도착한 전체 요청 수'], [String.raw`N_{admit}`, 'Load shedding 뒤 실행을 받아들인 요청 수'], [String.raw`N_{SLO}`, '정한 latency 조건을 모두 만족해 완료한 요청 수'], [String.raw`\Delta t`, '동일 workload를 재생한 측정 시간']]}
        />
        <ServingReleaseGate />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Failure test에서는 prefill worker loss, decode worker loss, KV transfer timeout, discovery의 stale member, cache miss storm, RDMA device 누락과 overload를 만든다. Failover가 성공했다는 로그만 보지 말고 in-flight request가 중복 생성되거나 잘못된 KV를 이어받지 않는지, 얼마 동안 SLO를 벗어났는지 확인한다.</p>
          <p>그 뒤 <InternalLink slug="vllm-serving">vLLM 전체 실행</InternalLink>에서 request와 model runner의 경계를 보고, <InternalLink slug="vllm-paged-attention">PagedAttention</InternalLink>에서 KV block ownership을, <InternalLink slug="vllm-scheduler">Scheduler</InternalLink>에서 iteration budget과 preemption을 코드로 검산한다. 이어 <InternalLink slug="vllm-spec-decode">Speculative Decoding</InternalLink>에서 draft를 검증된 token으로 commit하고, <InternalLink slug="vllm-vlm-serving">VLM Serving</InternalLink>에서 media encoder state가 같은 budget에 들어오는 경계까지 닫는다. 이 여섯 단계의 runtime 선택이 끝난 뒤에만 <InternalLink slug="llm-serving-ops">서빙 운영 제어면</InternalLink>으로 넘어가 release·fleet·gateway·observability를 다룬다.</p>
        </div>
        <CapabilityCheck items={[
          'TTFT, request-level TPOT와 token-interval ITL을 서로 다른 분포로 계산한다.',
          'MHA·GQA는 layer·KV head·head dimension·dtype에서 KV/token을 계산하고 MLA는 실제 cache component를 합산한다.',
          '100·200·400 Gb/s line rate를 effective GB/s와 handoff lower bound로 바꾼다.',
          'Prefix caching, KV-aware routing, P/D split과 KV offload의 책임을 구분한다.',
          'Aggregated baseline보다 분리가 나은 workload 조건과 나쁜 조건을 설명한다.',
          '같은 trace에서 admission, SLO attainment, SLO-goodput, transport, capacity와 failure recovery를 검증한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'NVIDIA Dynamo · Disaggregated Serving', href: 'https://github.com/ai-dynamo/dynamo/blob/main/docs/fern/pages/developer-guide/knowledge-base/concepts/system-architecture/disaggregated-serving.md', note: 'Prefill·decode ownership, KV transfer metadata와 현재 공개 구현 경계.' },
          { label: 'NVIDIA Dynamo · Repository', href: 'https://github.com/ai-dynamo/dynamo', note: 'Engine 위에서 routing, planning, memory, transport와 failure를 나누는 현재 source tree.' },
          { label: 'Mooncake · KVCache-centric Disaggregated Architecture', href: 'https://arxiv.org/abs/2407.00079', note: 'Kimi의 long-context workload에서 P/D cluster, multi-tier KV cache와 SLO-aware scheduler를 연결한 production 기준.' },
          { label: 'Orca · Iteration-level Scheduling', href: 'https://www.usenix.org/conference/osdi22/presentation/yu', note: 'Autoregressive request를 request 전체가 아니라 iteration 단위로 다시 batch하는 최소 scheduler 기준.' },
          { label: 'PagedAttention · vLLM', href: 'https://arxiv.org/abs/2309.06180', note: '동적으로 늘고 줄어드는 request KV를 block으로 할당·공유해 batching capacity를 높이는 기준.' },
          { label: 'vLLM · Disaggregated Serving Example', href: 'https://docs.vllm.ai/en/stable/examples/disaggregated/disaggregated_serving/', note: 'vLLM backend에서 KV connector와 push/pull handoff를 구성하는 version-sensitive 공식 예제.' },
        ]} />
        <StopRule>필수 역사 하향은 Mooncake 2024에서 멈춘다. Orca 2022는 iteration scheduler의 선행 아이디어를 확인하는 참고 원문이지 이 경로를 읽기 위한 숨은 선행 과제가 아니다. Queueing·virtual memory·RDMA 원문도 실제 profiler나 failure trace가 그 기반을 요구할 때만 연다. 새 runtime은 speedup 표가 아니라 request phase, KV ownership, transport와 SLO gate가 바뀌는지로 승격한다.</StopRule>
      </section>
    </>
  );
}
