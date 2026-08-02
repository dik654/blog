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
import { NlpSection } from './nlp-shared';
import FormulaPair from './practical-training/FormulaPair';
import {
  CompressionGateLab,
  MemoryEnvelopeLab,
} from './practical-compression/viz/CompressionDecisionLabs';

const releaseRows = [
  ['품질', '대표 평균 하나가 아니라 핵심 task, 긴 출력, 희귀 class, 언어·domain과 안전 slice를 baseline과 같은 evaluator로 비교한다.'],
  ['지연', 'TTFT, TPOT, end-to-end request latency와 동시 요청별 tail latency를 분리한다.'],
  ['처리량', 'Token/s 한 숫자 대신 request distribution, batch policy, input·output 길이와 성공한 출력당 비용을 함께 기록한다.'],
  ['메모리', 'Checkpoint 크기, load 후 weight, KV cache, activation·workspace와 allocator peak를 따로 측정한다.'],
  ['운영', 'Cold start, compile time, artifact load, unsupported op fallback, crash·OOM과 rollback 가능성을 검증한다.'],
];

export default function CompressionPipelineArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="deployment-contract"
        marker="00"
        tone="blue"
        question="모델 파일이 작아지면 배포도 자동으로 좋아질까?"
        title="경량화는 압축률이 아니라 배포 계약을 만족시키는 일이다"
      >
        <BeginnerOpening
          title="모델 파일을 작게 만드는 것과 실제 서비스를 가볍게 만드는 것은 다르다"
          description={<>모델 <strong>경량화</strong>는 저장 공간, 실행 중 메모리, 속도나 전력 사용량을 줄이는 여러 방법을 묶어 부르는 말이다. <strong>INT4</strong>는 많은 가중치를 4비트 숫자로 저장하는 방식이고, <strong>OOM</strong>은 실행 중 필요한 메모리가 부족해 작업이 중단됐다는 뜻이다.</>}
          familiarScene={<>여행 가방을 진공 압축해 부피를 네 배 줄였다고 하자. 가방은 작아졌지만 무게가 그대로면 들고 걷는 속도는 빨라지지 않는다. 자주 꺼내야 할 물건을 깊이 넣었다면 사용은 오히려 느려질 수도 있다.</>}
          steps={[
            { label: '무엇이 큰지 나눈다', detail: '다운로드 파일, 실행 중 가중치, 대화 기록과 임시 작업 공간을 따로 잰다.' },
            { label: '현재 병목에 맞는 방법을 고른다', detail: '숫자 표현, 구조 제거나 작은 모델 학습 중 실제 병목을 줄이는 가지를 선택한다.' },
            { label: '같은 요청으로 다시 검증한다', detail: '품질, 첫 응답 시간, 생성 속도, 최대 메모리와 비용을 원본과 비교한다.' },
          ]}
        />
        <QuestionLead
          question="INT4로 파일이 네 배 작아졌는데 긴 대화에서는 여전히 메모리 부족으로 멈추고 응답도 느리다면, 경량화에 성공한 것일까?"
          answer="아니다. 저장 크기는 한 축일 뿐이다. 어떤 요청을 어떤 hardware와 runtime에서 처리하며, 품질·지연·처리량·메모리·비용 중 무엇을 얼마나 지켜야 하는지 먼저 고정해야 한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글은 <strong>양자화·프루닝·증류를 모두 차례로 적용하는 레시피</strong>가 아니다.
            세 기법은 서로 다른 것을 바꾼다. <InternalLink slug="quantization">양자화</InternalLink>는
            숫자의 표현과 실행 dtype을, <InternalLink slug="pruning">프루닝</InternalLink>은 값 또는
            구조를, <InternalLink slug="knowledge-distillation">증류</InternalLink>는 teacher 신호로
            학습한 새 student를 만든다. 지금의 병목과 허용 가능한 작업에 따라 서로 다른 가지를 선택한다.
          </p>
          <p>
            시작 문서는 모델 이름이 아니라 workload manifest다. Hardware·driver·runtime version,
            model revision, prompt template, input·output 길이 분포, 동시성, batch scheduler,
            품질 slice와 목표 SLO를 적는다. 같은 모델도 짧은 interactive chat과 긴 offline
            summarization에서 전혀 다른 병목을 가진다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'TTFT', meaning: '요청이 들어온 뒤 첫 token이 나오기까지의 시간', why: 'Queue, input 처리와 prefill이 섞이며 interactive 체감에 직접 연결된다.' },
          { term: 'TPOT / ITL', meaning: '첫 token 뒤 다음 token 사이의 시간', why: 'Decode와 memory bandwidth 병목을 보는 축이다.' },
          { term: 'Throughput', meaning: '고정 workload에서 단위 시간에 완료한 request 또는 생성 token', why: 'Batch와 동시성을 숨긴 token/s 숫자를 피한다.' },
          { term: 'MHA · GQA · MQA', meaning: 'MHA는 query head마다 K·V head를 두고, GQA와 MQA는 더 적은 K·V head를 여러 query head가 공유하는 attention 구조다.', why: 'GQA·MQA는 요청별 KV cache를 줄이지만 전체 weight와 다른 memory 항까지 같은 비율로 줄이지는 않는다.' },
          { term: 'Quality floor', meaning: '출시 후에도 내려가면 안 되는 task·slice별 최소 성능', why: '평균 점수가 유지돼도 핵심 언어·길이·안전 행동이 무너질 수 있다.' },
        ]} />
      </NlpSection>

      <NlpSection
        id="memory-envelope"
        marker="01"
        tone="violet"
        question="Peak memory는 왜 모델 parameter 수만으로 계산할 수 없을까?"
        title="가중치, KV cache와 실행 여유를 서로 다른 항으로 센다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Decoder LLM의 메모리는 적어도 weight, KV cache, activation·temporary workspace,
            runtime·allocator reserve로 나뉜다. Weight-only INT4는 첫 항을 줄이지만, 요청 수와
            context length에 비례하는 KV 항은 그대로일 수 있다. 반대로 작은 batch의 CNN에서는 KV가
            없고 activation이나 operator workspace가 더 중요할 수 있다.
          </p>
          <p>
            아래 식은 full MHA가 아니라 <strong>KV head 수를 따로 쓰는 GQA/MQA까지 포함</strong>한다.
            실제 runtime은 paged allocation, prefix sharing, KV dtype과 fragmentation을 더하므로 식은
            capacity planning의 시작이고 profiler peak가 최종 근거다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
M_{\mathrm{peak}}
&=\underbrace{M_W}_{\text{가중치}}
+\underbrace{M_{KV}}_{\text{요청별 캐시}}
+\underbrace{M_A+M_R}_{\text{작업·런타임 여유}}\\
M_W
&=\underbrace{P\,b_W/8}_{\text{파라미터 저장 바이트}}\\
M_{KV}
&=\underbrace{B\,T}_{\text{동시 token 수}}
\underbrace{\left(2L H_{KV}d_h b_{KV}/8\right)}_{\text{token당 K·V 바이트}}
\end{aligned}`}
          meaning="Peak memory를 바꾸려면 어느 항이 지배적인지 먼저 알아야 한다. b_W와 b_KV는 bit 단위이므로 8로 나눠 byte로 바꾼다. KV 항의 2는 각 layer와 token마다 Key와 Value 두 tensor를 모두 저장하기 때문에 붙는다. GQA는 H_KV가 query head 수보다 작아 KV를 줄이지만, 긴 문맥과 높은 동시성은 다시 이 항을 키운다."
          symbols={[
            [String.raw`P,b_W`, 'Parameter 수와 weight당 bit 수'],
            [String.raw`B,T`, '동시 sequence 수와 cache에 남는 token 수'],
            [String.raw`L,H_{KV},d_h`, 'Layer 수, KV head 수와 head dimension'],
            [String.raw`b_{KV}`, 'K·V element의 bit 수'],
            [String.raw`M_A,M_R`, 'Activation·workspace와 runtime·allocator reserve'],
          ]}
        />
        <MemoryEnvelopeLab />
        <Misconception>
          “24 GB GPU에는 7B INT4가 들어간다”는 deployment contract가 아니다. Model revision,
          KV layout, context, concurrency, speculative decoding, graph capture와 runtime reserve가
          빠진 문장이다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="baseline-profile"
        marker="02"
        tone="teal"
        question="어떤 기법을 쓸지 결정하기 전에 무엇을 측정해야 할까?"
        title="고정밀 baseline을 요청 단계별로 분해한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            먼저 production과 같은 runtime에서 dense BF16·FP16 또는 현재 기준 artifact를 닫는다.
            Warm-up, compile·graph capture, prompt template와 decoding 설정을 고정하고 짧음·중간·긴
            input, 짧음·긴 output, 낮음·높은 concurrency를 조합한다. 평균만 보지 않고 p50·p95와
            OOM·timeout을 남긴다.
          </p>
          <p>
            Profile은 queue, tokenize·serialize, H2D transfer, prefill, decode, collectives,
            detokenize로 나눈다. GPU utilization이 낮다고 곧 모델이 작은 것은 아니다. Scheduler,
            CPU, I/O, kernel launch 또는 분산 통신이 device를 기다리게 할 수 있다. 이 상태에서
            모델을 압축하면 원래 병목은 그대로이고 새 dequantization 비용만 더해질 수 있다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Weight / bandwidth bound', 'Decode에서 weight를 반복 읽는 시간이 크다. Weight-only quantization을 지원 kernel과 함께 시험할 이유가 생긴다.'],
            ['KV / capacity bound', '긴 context·높은 concurrency에서 KV와 paging이 지배한다. Weight-only 압축과 다른 intervention이 필요하다.'],
            ['Compute bound', 'Prefill·큰 batch의 matmul이 지배한다. W8A8·FP8처럼 실제 compute dtype을 바꾸는 경로 또는 shape 축소를 본다.'],
            ['Runtime bound', 'Queue·serialization·launch·fallback이 지배한다. Model compression보다 scheduler와 kernel graph가 먼저다.'],
            ['Capability bound', '원본도 target quality를 못 넘는다. 더 작은 표현이 아니라 model·data·objective를 재선택한다.'],
          ].map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <CompressionGateLab />
      </NlpSection>

      <NlpSection
        id="controlled-branches"
        marker="03"
        tone="amber"
        question="프루닝→증류→양자화 순서가 항상 최적이라는 말은 왜 위험할까?"
        title="기법마다 단독 효과를 증명한 뒤 상호작용을 측정한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            보편적인 적용 순서는 없다. 이미 학습한 모델만 있고 재학습할 수 없다면 PTQ(Post-Training Quantization, 재학습 없이 이미 학습된 weight를 양자화하는 방식) 또는 one-shot
            pruning이 출발점이다. Teacher output을 생성할 수 있고 작은 architecture가 필요하면
            distillation이 먼저일 수 있다. Target hardware가 2:4 sparse kernel을 지원하지 않으면
            프루닝을 앞에 두는 이유 자체가 사라질 수 있다.
          </p>
          <p>
            최소 실험은 baseline, 기법 A, 기법 B, A+B 네 칸이다. 각 run은 같은 checkpoint lineage,
            calibration·training data split, evaluator, request replay와 runtime version을 쓴다.
            A+B가 좋더라도 A와 B의 단독 결과가 없으면 어느 손실이 어디서 생겼고 조합이 실제로 필요한지
            알 수 없다. Order를 비교한다면 A→B와 B→A를 별도 artifact로 만든다.
          </p>
        </div>
        <div className="not-prose grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {[
            ['Quantization branch', '재학습 없이 시작 가능하지만 calibration, dtype·packing과 실행 kernel이 맞아야 한다.'],
            ['Pruning branch', '0을 만드는 것과 구조·연산을 줄이는 것을 분리한다. Sparse runtime 또는 실제 shape rewrite가 필요하다.'],
            ['Distillation branch', '새 student를 학습한다. Teacher access, tokenizer·feature contract와 data provenance 비용이 생긴다.'],
            ['Combination branch', '각 단독 run이 release gate를 통과하고 서로 다른 병목을 줄일 때만 조합한다.'],
          ].map(([label, text]) => (
            <div key={label} className="min-w-0 bg-background px-4 py-4">
              <p className="text-sm font-bold">{label}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <StopRule>
          첫 압축 artifact가 target hardware·runtime에서 baseline보다 end-to-end 목표를 개선하지 못하면
          다음 압축 기법을 덧붙이지 않는다. 먼저 profiler와 실행 경로를 다시 확인한다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="release-evidence"
        marker="04"
        tone="green"
        question="작아진 checkpoint를 production artifact라고 부르려면 무엇이 더 필요할까?"
        title="같은 workload에서 Pareto와 운영 실패까지 닫는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Release candidate는 baseline을 완전히 지배할 필요는 없지만, 합의한 trade-off 안에 있어야
            한다. 예를 들어 memory가 줄고 throughput이 늘었더라도 긴 한국어 instruction의 품질 하락이
            floor를 넘으면 탈락이다. 반대로 latency가 거의 같아도 한 GPU에 더 많은 replica가 들어가
            cost·availability 목표가 좋아질 수 있다.
          </p>
          <p>
            Artifact bundle에는 source checkpoint hash, method·config, calibration/training
            manifest, tokenizer·prompt template, container·packing, runtime·kernel·driver matrix,
            evaluator version, 결과 trace와 rollback artifact를 넣는다. Canary에서는 request shape별
            latency, fallback, OOM, 품질 proxy와 drift를 baseline과 나란히 관찰한다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {releaseRows.map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <CapabilityCheck items={[
          'Request shape, hardware, runtime, quality floor와 비용 목표를 경량화 전에 고정할 수 있다.',
          'Peak memory를 weight, KV, activation·workspace와 runtime reserve로 분해할 수 있다.',
          'TTFT, TPOT, throughput과 end-to-end latency가 답하는 질문을 구분할 수 있다.',
          '관측한 병목에 따라 quantization, pruning, distillation 또는 runtime 개선으로 분기할 수 있다.',
          '보편적인 적용 순서 대신 단독·조합·순서 ablation을 설계할 수 있다.',
          'Compressed checkpoint를 재현·rollback 가능한 production artifact로 묶을 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'torchao · Quantization overview', href: 'https://docs.pytorch.org/ao/stable/contributing/quantization_overview.html', note: 'Algorithm, quantized tensor·packing, primitive와 efficient kernel을 분리하는 공식 stack.' },
          { label: 'vLLM · Quantization compatibility', href: 'https://docs.vllm.ai/en/v0.16.0/features/quantization/', note: '방법별 hardware·kernel 지원이 version에 따라 달라지는 공식 compatibility 경계.' },
          { label: 'ONNX Runtime · Model quantization', href: 'https://onnxruntime.ai/docs/how-to/quantization.html', note: 'Dynamic·static quantization, calibration과 operator별 실행 형식의 공식 문서.' },
          { label: 'SparseGPT · ICML 2023', href: 'https://proceedings.mlr.press/v202/frantar23a.html', note: 'OPT-175B·BLOOM-176B를 포함한 one-shot pruning 결과와 quantization 호환성을 논문 범위 안에서 확인한다.' },
          { label: 'Hinton et al. · Knowledge distillation', href: 'https://arxiv.org/abs/1503.02531', note: 'Teacher distribution을 student training signal로 쓰는 고전적 출발점.' },
        ]} />
      </NlpSection>
    </div>
  );
}
