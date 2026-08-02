import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, ConceptPrimer, LearningHandoff, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { InferenceBudgetExplorer, StopRule } from './current-flows/viz/CurrentFlowExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-6 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

function DecisionCards({ title, items }: {
  title: string;
  items: Array<{ name: string; timing: string; condition: string; risk: string }>;
}) {
  return (
    <div className="not-prose my-6">
      <p className="mb-3 text-sm font-semibold">{title}</p>
      <dl className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.name} className="min-w-0 bg-background p-4">
            <dt className="text-sm font-black">{item.name}</dt>
            <dd className="mt-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">적용 시점.</strong> {item.timing}</dd>
            <dd className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">유리한 조건.</strong> {item.condition}</dd>
            <dd className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong className="text-amber-700 dark:text-amber-300">먼저 확인할 실패.</strong> {item.risk}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function EfficientInferenceOnDeviceArticle() {
  return (
    <>
      <section id="budget-first" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">왜 FLOPs보다 이동 byte가 먼저일까?</h2>
        <QuestionLead question="4B 모델이 8GB device에 들어간다는 사실만으로 실시간 속도를 보장할 수 있을까?" answer="아니다. Model file, 실행 중 resident weight, KV(Key-Value) cache, activation·workspace와 OS 여유를 합쳐야 memory fit을 판단할 수 있다. Decode에서는 token마다 weight를 다시 읽는 경우가 많아 memory bandwidth가 속도의 상한을 만들고, prefill에서는 큰 matrix multiplication 때문에 compute가 더 중요해진다." />
        <ConceptPrimer items={[
          { term: 'Prefill', meaning: '입력 prompt의 모든 token을 병렬로 처리해 첫 KV cache를 만드는 단계다.', why: 'Prompt가 길수록 TTFT(Time To First Token, 첫 token까지 걸린 시간)가 늘고 compute utilization이 높아진다.' },
          { term: 'Decode', meaning: '새 token을 하나 만들고 그 token의 KV를 cache에 추가하는 반복 단계다.', why: '작은 batch에서는 매 step weight를 읽는 bandwidth-bound가 되기 쉽다.' },
          { term: 'Resident memory', meaning: '추론 순간 RAM·VRAM에 동시에 살아 있어야 하는 weight, KV와 buffer의 합이다.', why: '다운로드 파일 크기만 보고 device fit을 판단하는 오류를 막는다.' },
          { term: 'NPU · Neural Processing Unit', meaning: '지원되는 neural-network 연산을 저전력으로 실행하도록 설계한 가속기다.', why: 'Peak 수치보다 실제 operator·dtype·shape 지원 범위를 먼저 확인해야 한다.' },
          { term: 'TOPS · Tera Operations Per Second', meaning: '초당 1조 번의 연산을 기준으로 표시한 peak 처리량 단위다.', why: '특정 정밀도와 sparsity 조건의 상한이지 end-to-end token 속도는 아니다.' },
          { term: 'On-device', meaning: '핵심 추론과 data가 사용자의 local CPU·GPU·NPU 안에서 실행되는 배치다.', why: 'offline·privacy 장점과 thermal·battery·hardware fragmentation 비용을 함께 본다.' },
        ]} />
        <InferenceBudgetExplorer />
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{T_{work}}_{\text{data 이동·연산 시간}}&=\max\left(\underbrace{\frac{B_{move}}{BW_{eff}}}_{\text{byte를 옮기는 시간}},\underbrace{\frac{F_{token}}{P_{eff}}}_{\text{연산하는 시간}}\right)\\[0.55em]\underbrace{T_{token}}_{\text{token 하나의 최소 시간}}&\gtrsim T_{work}+\underbrace{T_{launch}+T_{sync}}_{\text{kernel·동기화 overhead}}\end{aligned}`}
          meaning="Memory 이동과 compute가 완전히 겹친다고 보는 낙관적 하한은 두 시간 중 큰 값이다. 실제 runtime은 kernel launch, synchronization, sampling과 framework overhead가 더해진다. 따라서 peak TOPS가 높아도 effective bandwidth와 kernel support가 낮으면 decode가 느릴 수 있다."
          symbols={[[String.raw`T_{work}`, 'memory 이동과 compute가 겹칠 때 둘 중 더 오래 걸리는 core work 시간'], [String.raw`T_{token}`, 'overhead까지 더한 token 하나의 최소 생성 시간'], [String.raw`T_{launch}, T_{sync}`, 'kernel 실행 요청과 device 동기화에 드는 추가 시간'], [String.raw`B_{move}`, 'decode step에서 실제 읽고 쓰는 weight·KV·activation byte'], [String.raw`BW_{eff}`, '해당 access pattern의 유효 memory bandwidth'], [String.raw`F_{token}`, 'token당 연산량'], [String.raw`P_{eff}`, 'kernel이 실제 달성한 연산 처리량']]}
        />
      </section>

      <section id="weight-precision" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">양자화와 native low-bit는 무엇이 다른가?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Post-Training Quantization(PTQ)은 이미 FP16(16-bit floating point)·BF16(brain floating point 16-bit)으로 학습된 weight를 calibration data와 scale을 이용해 낮은 integer 표현으로 바꾼다. Quantization-Aware Training(QAT)은 forward에서 quantization noise를 모사해 모델이 그 오차에 적응하게 한다. Native low-bit는 처음부터 사용할 값의 집합과 연산을 training recipe에 넣는다. BitNet b1.58의 핵심은 FP model을 마지막에 1.58-bit로 압축했다는 말이 아니라 ternary weight를 전제로 학습했다는 점이다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{W_{bytes}}_{\text{전체 weight 저장량}}\approx\underbrace{P\frac{b_w}{8}}_{\text{순수 quantized weight}}+\underbrace{B_{aux}}_{\text{scale·packing 추가 byte}}`}
          meaning="단순 P×bits/8은 하한이다. 실제 quantized file과 resident memory에는 group별 scale, zero point, tensor metadata, alignment와 일부 고정밀 layer가 추가된다. 4B·4-bit가 정확히 2.00GB일 것이라고 가정하면 runtime buffer 여유를 놓친다."
          symbols={[[String.raw`P`, '전체 parameter 수'], [String.raw`b_w`, 'weight 한 개의 목표 bit 수'], [String.raw`B_{aux}`, 'group scale, zero point, packing, alignment와 tensor metadata의 합']]}
        />
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{q}_{\text{저장 integer}}&\in\underbrace{\{q_{min},\ldots,q_{max}\}}_{\text{low-bit로 표현 가능한 범위}}\\[0.55em]\underbrace{\hat w}_{\text{복원된 근사 weight}}&=\underbrace{s_g}_{\text{group scale}}\left(q-\underbrace{z_g}_{\text{zero point}}\right)\end{aligned}`}
          meaning="실제 matmul은 저장된 integer q를 group scale로 해석한다. Group을 작게 하면 local range를 더 잘 맞추지만 scale metadata와 kernel 복잡도가 늘어난다. Outlier channel은 넓은 scale을 요구해 나머지 값의 양자화 간격을 거칠게 만들 수 있다."
          symbols={[[String.raw`q`, '낮은 bit로 저장한 정수 값'], [String.raw`s_g`, 'group g의 실수 간격'], [String.raw`z_g`, '0을 정수 범위에 맞추는 offset'], [String.raw`\hat w`, '연산에서 사용하는 근사 weight']]}
        />
        <DecisionCards title="Low-bit를 넣는 네 경로" items={[
          { name: 'PTQ', timing: 'FP16·BF16 학습이 끝난 뒤 calibration sample로 변환한다.', condition: '원본 checkpoint를 다시 학습하지 않고 빠르게 배포 후보를 만들 때.', risk: 'Outlier와 domain shift가 큰 layer에서 정확도가 갑자기 떨어진다.' },
          { name: 'QAT', timing: 'Fine-tuning forward에서 quantization noise를 모사한다.', condition: 'PTQ 품질 손실이 크고 추가 학습 data·compute를 감당할 수 있을 때.', risk: 'Fake quantization과 실제 target kernel의 rounding·packing이 다를 수 있다.' },
          { name: 'Native low-bit', timing: 'Pretraining 처음부터 값의 집합과 연산 제약을 넣는다.', condition: 'Architecture·optimizer·kernel까지 함께 설계할 수 있을 때.', risk: '기존 FP checkpoint를 단순 변환할 수 없고 학습 recipe 전체가 새 계약이 된다.' },
          { name: 'Mixed precision', timing: 'Sensitivity를 측정해 layer·tensor마다 bit를 다르게 둔다.', condition: '일부 outlier layer만 높은 정밀도가 필요하고 backend가 조합을 지원할 때.', risk: 'Unsupported dtype 경계의 dequantize와 copy가 memory·latency 이득을 지운다.' },
        ]} />
      </section>

      <section id="token-parallelism" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Multi-token prediction(MTP)과 speculative decoding은 시간을 어떻게 줄일까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Autoregressive decode의 근본 제약은 다음 token이 나와야 그다음 입력을 알 수 있다는 순차성이다. Multi-token prediction은 training 때 현재 hidden state에서 여러 미래 token을 예측하는 auxiliary head를 붙여 representation에 더 많은 미래 신호를 준다. 이 자체가 runtime acceleration을 자동 보장하지는 않는다. 실제 속도를 내려면 MTP head를 draft로 사용하거나 별도 draft model의 여러 후보를 target model이 한 번에 검증해야 한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{\ell_{t,k}}_{\text{k번째 미래 token의 손실}}
&=-\log p_\theta(x_{t+k}\mid h_t,k)\\[0.55em]
\underbrace{\mathcal L_{MTP}}_{\text{여러 미래 위치의 학습 손실}}
&=\sum_{k=1}^{K}\underbrace{\lambda_k}_{\text{k-step 비중}}\ell_{t,k}
\end{aligned}`}
          meaning="기존 next-token loss는 K=1만 본다. MTP는 같은 위치의 hidden state가 여러 미래 token에 유용한 표현을 만들도록 보조한다. 먼 미래일수록 불확실성이 크므로 λ_k나 head 구조를 조절한다. Training objective와 runtime acceptance algorithm은 별도 구성요소다."
          symbols={[[String.raw`\mathcal L_{MTP}`, '여러 미래 위치의 개별 손실을 가중 합한 전체 MTP 학습 손실'], [String.raw`K`, '동시에 예측할 미래 token 수'], [String.raw`h_t`, '현재 위치의 hidden state'], [String.raw`\ell_{t,k}`, '현재 위치에서 k칸 뒤 token을 맞히는 개별 손실'], [String.raw`\lambda_k`, 'k-step auxiliary loss weight'], [String.raw`x_{t+k}`, '현재에서 k칸 뒤의 실제 token']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Speculative decoding은 draft가 낸 K개 token을 target이 병렬 검증한다. Draft가 자주 맞고 target verification의 추가 비용이 K번의 독립 decode보다 작을 때 이득이다. Acceptance가 낮거나 draft model까지 memory를 차지하거나 mobile kernel이 큰 verification batch를 효율적으로 처리하지 못하면 오히려 느려질 수 있다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{S}_{\text{spec decode speedup}}\approx\frac{\underbrace{E[A]+1}_{\text{target call당 확정 token 수}}}{\underbrace{T_{verify}/T_{target}}_{\text{검증 call의 상대 비용}}+\underbrace{T_{draft}/T_{target}}_{\text{draft 생성의 상대 비용}}}`}
          meaning="한 verification에서 평균 A개 draft token이 채택되고 bonus token까지 얻는다고 보면 분자는 call당 진전량이다. 분모는 target 1-step 시간으로 정규화한 draft와 verification 비용이다. Acceptance 숫자 하나만 보고 speedup을 예측하면 안 된다."
          symbols={[[String.raw`S`, '기준 target 단독 decode와 비교한 speculative decoding의 근사 speedup'], [String.raw`E[A]`, '한 target verification에서 평균 채택된 draft token 수'], [String.raw`T_{verify}`, 'K개 후보를 target이 검증하는 시간'], [String.raw`T_{draft}`, 'draft 후보 생성 시간'], [String.raw`T_{target}`, '기준 target 1-token decode 시간']]}
        />
      </section>

      <section id="device-stack" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">CPU·GPU·NPU에는 무엇을 배치할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>On-device runtime은 한 chip의 TOPS 비교가 아니라 operator coverage와 memory ownership 문제다. Tokenizer, sampling과 control flow는 CPU가 편하고, 큰 matmul·attention은 GPU/NPU가 유리하다. 하지만 지원하지 않는 activation이나 dynamic shape가 생길 때 tensor가 accelerator와 CPU 사이를 왕복하면 복사와 synchronization이 이득을 지운다.</p>
          <p>Gemma 3n의 PLE(Per-Layer Embeddings)는 layer별 embedding 일부를 CPU에서 효율적으로 처리해 accelerator에 상주할 핵심 weight와 전체 raw parameter를 분리한다. MatFormer는 nested submodel을 선택할 수 있게 한다. 이런 구조적 기법은 file을 4-bit로 줄이는 것과 다른 축이다. 실제 제품에서는 model choice, compiler graph partition, prompt cache, thermal governor와 battery policy가 함께 결정된다.</p>
        </div>
        <DecisionCards title="Device 자원에 일을 배치하는 기준" items={[
          { name: 'CPU', timing: 'Tokenizer, sampler, control flow와 작은 fallback op를 맡긴다.', condition: 'Branch가 많거나 tensor가 작아 accelerator launch보다 CPU 실행이 쌀 때.', risk: '큰 matmul·attention이 조용히 fallback해 token latency가 폭증한다.' },
          { name: 'GPU', timing: 'Prefill matmul, attention과 범용 병렬 kernel을 맡긴다.', condition: '유효 bandwidth가 높고 target shader·kernel이 성숙했을 때.', risk: 'Display와 memory bandwidth를 경쟁하고 장시간 실행에서 발열이 누적된다.' },
          { name: 'NPU', timing: 'Compiler가 지원하는 정적·low-bit subgraph를 맡긴다.', condition: 'Dtype, shape, layout과 operator가 target SDK 계약에 정확히 맞을 때.', risk: 'Unsupported op 하나가 graph를 나누고 CPU 왕복과 synchronization을 만든다.' },
          { name: 'Unified memory', timing: 'CPU와 accelerator가 같은 physical memory를 공유하는 경로를 쓴다.', condition: '실제 zero-copy와 cache 정책이 trace에서 확인될 때.', risk: 'Page migration, cache coherence와 wait가 주소 복사가 없다는 장점을 지운다.' },
        ]} />
        <Misconception>“NPU 40 TOPS”는 LLM이 40조 연산을 그대로 달성한다는 뜻이 아니다. 해당 정밀도, sparsity, operator와 batch 조건의 peak 수치이며 end-to-end token latency는 memory와 unsupported op를 포함해 직접 측정해야 한다.</Misconception>
      </section>

      <section id="measurement" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">실제 속도를 어떤 숫자로 검증할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>한 개의 tokens/s는 부족하다. Cold start model load, prompt 길이별 TTFT, steady-state inter-token latency, p95 jitter, peak resident memory, energy/token, 5분 이후 thermal throttling을 분리한다. Quality도 같은 prompt set에서 유지되는지 확인한다. Quantization이 속도를 높여도 tool JSON이나 한국어가 크게 깨지면 목표 workload에는 실패다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{M_{KV}}_{\text{전체 KV cache}}&=BNM_{KV/token}\\[0.45em]
\underbrace{M_{model}}_{\text{모델 소유 memory}}&=M_W+M_{KV}\\[0.45em]
\underbrace{M_{buffer}}_{\text{연산 중 임시 memory}}&=M_{act}+M_{workspace}\\[0.45em]
\underbrace{M_{resident}}_{\text{실행 중 총 memory}}&=M_{model}+M_{buffer}+M_{runtime}
\end{aligned}`}
          meaning="Weight가 들어가도 KV와 workspace가 남은 memory를 넘으면 긴 prompt나 동시 요청에서 OOM(Out Of Memory, 메모리 부족)이 난다. B는 batch 또는 동시 sequence 수, N은 각 sequence의 context token 수다. 실제 device에서는 OS와 다른 app의 여유까지 별도로 남긴다."
          symbols={[[String.raw`M_{KV}`, '모든 동시 sequence가 보유한 전체 Key-Value cache'], [String.raw`M_{model}`, 'weight와 KV cache를 합친 model-owned memory'], [String.raw`M_W`, 'quantization metadata를 포함한 resident weight'], [String.raw`M_{buffer}`, 'activation과 kernel workspace의 합'], [String.raw`M_{act}`, '현재 graph 실행에 살아 있는 activation memory'], [String.raw`M_{workspace}`, 'kernel과 compiler가 임시로 요구하는 workspace'], [String.raw`M_{runtime}`, 'allocator, graph metadata와 backend가 보유한 runtime memory'], [String.raw`M_{resident}`, '실행 중 동시에 상주하는 model, buffer와 runtime memory의 합'], [String.raw`B`, '동시에 처리하는 sequence 수'], [String.raw`N`, 'sequence당 context 길이'], [String.raw`M_{KV/token}`, '모델 구조와 dtype으로 정해지는 token당 KV byte']]}
        />
      </section>

      <section id="small-model" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4B·9B 배포 설계는 어디서 시작할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>4B에서는 FP16→8-bit→4-bit 순으로 quality와 latency를 측정하고, 2K·8K·16K context에서 memory curve를 만든다. 그다음 GPU/NPU full offload와 partial fallback trace를 비교한다. 9B는 weight만으로 device budget을 압박하므로 context cap, KV quantization, layer offload 또는 server fallback을 제품 요구와 함께 결정한다.</p>
          <p>작은 모델은 범위를 좁힐수록 강해질 수 있다. 모든 대화를 처리하려 하지 말고 local intent classification, structured command, private document retrieval처럼 verifier가 있는 workload를 선택한다. 어려운 요청은 larger remote model로 넘기되 privacy class와 offline fallback을 명시한다.</p>
        </div>
        <StopRule>모델 leaderboard에서 시작하지 않는다. Target device의 RAM·bandwidth·지원 dtype, 목표 context, TTFT와 energy budget을 먼저 적은 뒤 후보를 benchmark한다.</StopRule>
        <CapabilityCheck items={[
          'Parameter와 bit 수에서 weight 하한을 계산하고 metadata·buffer 여유를 추가한다.',
          'Model file, resident memory와 KV cache 증가량을 서로 다른 표로 만든다.',
          'PTQ, QAT, native low-bit training의 변경 시점과 위험을 구분한다.',
          'MTP training objective와 speculative decoding runtime을 구분한다.',
          'TTFT, inter-token latency, throughput, p95 jitter와 energy/token을 측정한다.',
          '4B·9B model의 local/remote routing과 privacy fallback을 workload 기준으로 설계한다.',
        ]} />
        <LearningHandoff
          description="On-device 설계의 산출물은 작은 model file이 아니라 context 길이, KV·workspace, operator fallback, TTFT·energy와 thermal 지속 성능을 함께 만족하는 실행 계약이다."
          items={[
            { label: '막히면', slug: 'llm-architecture-kv-long-context', title: 'KV Cache · Long Context', reason: 'Token마다 늘어나는 KV byte와 attention 구조가 context budget을 어떻게 결정하는지 계산한다.' },
            { label: '막히면', slug: 'quantization', title: 'Quantization', reason: 'Weight·activation·KV quantization과 packed format·kernel 지원을 분리해 확인한다.' },
            { label: '되짚기', slug: 'on-device-llm-runtime', title: 'On-device LLM Runtime', reason: 'Model export, graph partition, cache ownership와 thermal governor의 기본 실행 경계가 막힐 때 돌아간다.' },
            { label: '적용하기', slug: 'llm-disaggregated-serving', title: '분리형 LLM Serving', reason: '같은 byte movement와 SLO 문제를 server의 prefill/decode 분리, network transfer와 fleet scheduling 경계에서 비교한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'BitNet b1.58 2B4T', href: 'https://arxiv.org/abs/2504.12285', note: 'ternary weight를 전제로 처음부터 학습한 native low-bit 공개 모델.' },
          { label: 'Better & Faster LLMs via Multi-token Prediction', href: 'https://arxiv.org/abs/2404.19737', note: '여러 미래 token을 예측하는 training objective와 효율 효과를 다룬 원문.' },
          { label: 'Google Developers · Gemma 3n', href: 'https://developers.googleblog.com/en/introducing-gemma-3n-developer-guide/', note: 'PLE, MatFormer, KV sharing과 mobile-first multimodal 설계.' },
          { label: 'vLLM · Speculative Decoding', href: 'https://docs.vllm.ai/en/latest/features/spec_decode/', note: 'draft·MTP 계열을 runtime에서 구성하고 측정하는 공식 문서.' },
        ]} />
      </section>
    </>
  );
}
