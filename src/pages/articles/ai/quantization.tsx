import {
  CapabilityCheck,
  ConceptPrimer,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { NlpSection } from './nlp-shared';
import FormulaPair from './practical-training/FormulaPair';
import {
  KernelRealizationLab,
  RangeOutlierLab,
} from './practical-compression/viz/CompressionDecisionLabs';

export default function QuantizationArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="number-line"
        marker="00"
        tone="blue"
        question="실수 weight를 INT4로 바꾼다는 것은 정확히 무엇을 버리는 일일까?"
        title="연속된 값을 제한된 눈금에 가장 가깝게 놓는다"
      >
        <QuestionLead
          question="4bit라면 왜 무조건 메모리는 줄어도 속도는 반드시 네 배 빨라지지 않을까?"
          answer="저장할 눈금 수는 줄지만, 실제 연산은 packing을 풀고 scale을 적용한 뒤 높은 정밀도로 계산할 수도 있다. 저장 표현, 계산 dtype과 kernel을 분리해야 한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Quantization은 넓은 실수 범위를 적은 code로 표현하는 일이다. 가장 기본적인 affine
            quantization은 실수 <em>x</em>를 scale로 나누고 zero point를 더한 뒤 반올림·clipping해
            integer <em>q</em>를 만든다. 실행할 때는 scale을 다시 적용해 근사값을 얻거나, kernel이
            quantized value와 scale을 직접 읽어 계산한다.
          </p>
          <p>
            잃는 것은 저장 공간만이 아니다. Range 밖 값은 clipping되고, 눈금 사이 값은 rounding된다.
            Bit 수, symmetric·asymmetric range, scale 공유 범위와 outlier가 이 오차를 결정한다.
            따라서 “INT4”는 하나의 기법 이름이 아니라 여러 설계 선택을 감춘 축약어다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
q
&=\underbrace{\operatorname{clip}}_{\text{범위 제한}}
\left(
\underbrace{\operatorname{round}(x/s)}_{\text{눈금에 반올림}}
+\underbrace{z}_{\text{0의 코드}},
q_{\min},q_{\max}
\right)\\
\widehat{x}
&=\underbrace{s(q-z)}_{\text{실수 근사값 복원}}
\end{aligned}`}
          meaning="Quantization error는 원래 값 x와 복원값 x-hat의 차이다. Scale s가 너무 크면 작은 값의 눈금이 거칠고, 너무 작으면 큰 값이 범위 밖에서 잘린다."
          symbols={[
            [String.raw`x,\widehat{x}`, '원래 실수와 quantized code에서 복원한 근사값'],
            [String.raw`q`, '제한된 bit 수로 저장하는 integer code'],
            [String.raw`s`, '실수 간격 하나가 나타내는 scale'],
            [String.raw`z`, '실수 0을 표현하는 zero point'],
            [String.raw`q_{\min},q_{\max}`, '선택한 integer dtype이 표현하는 code 범위'],
          ]}
        />
        <ConceptPrimer items={[
          { term: 'Bit width', meaning: '하나의 값을 표현하는 bit 수', why: 'Code 수와 ideal storage를 정하지만 실행 속도를 혼자 결정하지는 않는다.' },
          { term: 'Granularity', meaning: 'Tensor, channel, row 또는 group 중 scale을 공유하는 범위', why: '세밀할수록 local range에 맞지만 scale metadata와 kernel 제약이 늘어난다.' },
          { term: 'Clipping', meaning: '선택한 range 밖 값을 경계 code로 보내는 것', why: 'Outlier를 버려 보통 값을 촘촘히 보존할지 결정한다.' },
          { term: 'Packing', meaning: '낮은 bit code를 byte·word와 kernel-friendly layout에 배치하는 방식', why: '같은 INT4라도 runtime이 읽을 수 있는 물리 형식이 다를 수 있다.' },
          { term: 'Calibration data', meaning: '학습을 다시 하지 않고 scale·zero point와 clipping range를 정하기 위해 미리 흘려보는 대표 입력', why: '배포 언어·길이·modality를 못 덮으면 잘못된 range를 정교하게 고정할 수 있다.' },
          { term: 'Observer', meaning: 'Calibration 중 tensor 분포를 모아 quantization parameter를 계산하는 도구', why: 'MinMax·percentile·entropy처럼 어떤 통계를 모았는지 재현해야 한다.' },
        ]} />
      </NlpSection>

      <NlpSection
        id="range-granularity"
        marker="01"
        tone="violet"
        question="Outlier 하나가 왜 나머지 값의 양자화까지 망칠 수 있을까?"
        title="Range, granularity와 민감한 값을 함께 본다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Per-tensor scale은 tensor 전체의 최댓값에 맞춰질 수 있다. 소수의 큰 outlier가 range를
            넓히면 대부분의 작은 값이 같은 code에 뭉친다. Per-channel 또는 group-wise scale은 공유
            범위를 좁혀 이를 완화하지만 scale metadata가 늘고, target kernel이 지원하는 group size와
            맞아야 한다.
          </p>
          <p>
            Activation은 input마다 분포가 바뀌므로 weight보다 어렵다. Dynamic quantization은 실행
            중 activation scale을 계산하고, static quantization은 대표 calibration data로 미리 정한다.
            SmoothQuant는 activation의 어려운 range를 algebraically weight 쪽으로 옮겨 W8A8
            실행을 쉽게 하는 접근이다. 어느 방식도 “outlier 0.1%” 같은 보편 임계값을 주지는 않는다.
          </p>
        </div>
        <RangeOutlierLab />
        <Misconception>
          Normal distribution을 가정해 설계한 NF4는 QLoRA에서 frozen base weight의 저장 memory를
          크게 줄인다. 하지만 forward·backward matmul은 weight를 BF16 같은 compute dtype으로
          dequantize해 수행하므로, “4bit storage = 학습 step 네 배 가속”이라고 해석하면 안 된다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="scheme-contract"
        marker="02"
        tone="teal"
        question="W4A16, W8A8, KV INT8과 NF4는 같은 문제를 푸는가?"
        title="무엇을 저장하고 무엇으로 계산하는지 이름에 드러낸다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            W4A16은 weight를 4bit로 저장하되 activation과 주 계산을 16bit 계열로 유지하는
            weight-only 경로다. Decode에서 weight memory traffic이 지배할 때 유리할 수 있지만,
            compute-bound prefill을 낮은 정밀도 GEMM으로 바꾸는 것은 아니다. W8A8은 weight와
            activation을 모두 낮춰 지원되는 INT8 matmul을 사용할 수 있으므로 다른 병목을 겨냥한다.
          </p>
          <p>
            KV-cache quantization은 요청마다 누적되는 K·V를 줄인다. Weight-only PTQ가 해결하지 못한
            긴 context·높은 concurrency를 겨냥하지만 attention kernel과 품질 검증이 따로 필요하다.
            NF4·double quantization은 QLoRA training memory를 위한 표현이고, serving용 GPTQ/AWQ
            artifact와 같은 실행 계약이 아니다. FP8은 affine integer code가 아니라 exponent와
            mantissa를 가진 floating-point code이므로 앞의 zero-point 수식을 그대로 적용하지 않는다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Weight-only', 'W4A16·W8A16 등. Weight capacity와 decode bandwidth를 겨냥하며 fused dequant/matmul 지원을 확인한다.'],
            ['Weight + activation', 'W8A8은 affine integer, FP8은 floating-point code다. 둘 다 activation scaling과 실제 low-precision GEMM 경로를 따로 확인한다.'],
            ['KV cache', 'K·V element와 scale을 낮춰 context·concurrency capacity를 겨냥한다. Attention quality와 kernel을 따로 검증한다.'],
            ['Training storage', 'QLoRA의 NF4처럼 frozen base를 작게 저장한다. Optimizer·adapter·activation과 compute dtype은 별도 항이다.'],
          ].map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </NlpSection>

      <NlpSection
        id="ptq-methods"
        marker="03"
        tone="amber"
        question="학습 없이 양자화할 때 RTN, GPTQ, AWQ와 SmoothQuant는 무엇이 다른가?"
        title="각 방법이 보존하려는 오차와 필요한 관측을 구분한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            단순 round-to-nearest는 정한 range와 scale에서 가장 가까운 code를 고른다. GPTQ는
            calibration input에 대한 layer output reconstruction을 approximate second-order
            information으로 줄이며 weight를 순차 quantize한다. AWQ는 activation을 관찰해
            <strong>salient weight, 즉 출력 영향이 크다고 판정한 weight</strong>를 찾고 per-channel
            scaling으로 보호하는 weight-only PTQ다. SmoothQuant는
            activation outlier의 난도를 weight로 이동해 W8A8을 가능하게 한다.
          </p>
          <p>
            이 이름은 품질 순위표가 아니다. Model family, layer, bit·group size, calibration
            distribution, kernel implementation과 evaluator에 따라 결과가 달라진다. Calibration
            set은 “100~1000개면 충분” 같은 숫자로 정하지 않는다. Production의 언어, 길이, prompt
            template, modality와 희귀 slice를 덮고, 추가 sample을 넣었을 때 observer·quality가
            안정되는지 본다.
          </p>
          <p>
            General CNN·Transformer PTQ에서는 MinMax, entropy·KL, percentile observer가 range를
            정할 수 있다. Observer는 calibration input의 범위 통계를 모아 scale·zero point를 정한다.
            ONNX Runtime은 MinMax·Entropy·Percentile을 지원하며, 어떤 것이
            “기본”인지와 operator coverage는 도구·version마다 확인한다. Quantization 전에 graph
            optimization을 분리해 debugging 가능한 float↔quantized tensor correspondence를 보존한다.
          </p>
        </div>
        <StopRule>
          Calibration loss 또는 perplexity 하나만 보고 방법을 고르지 않는다. Target task·language·길이
          slice와 generation behavior, 그리고 실제 runtime latency가 함께 통과해야 한다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="runtime-stack"
        marker="04"
        tone="blue"
        question="왜 GPTQ·AWQ와 GGUF를 같은 열에 놓으면 안 될까?"
        title="알고리즘, 포맷과 실행 kernel을 끝까지 연결한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            GPTQ와 AWQ는 weight를 어떤 code와 scale로 정할지 다루는 <strong>quantization
            method</strong>다. GGUF는 tensor와 metadata를 저장하는 <strong>model container
            format</strong>이다. GGUF 안에는 여러 ggml quantization type의 tensor가 들어갈 수 있고,
            llama.cpp는 CPU뿐 아니라 GPU offload도 지원한다. 따라서 “GPU는 AWQ, CPU는 GGUF”라는
            이분법은 category error다.
          </p>
          <p>
            배포 가능성은 method 이름만으로 결정되지 않는다. Quantized tensor representation,
            group size, scale·zero-point layout, packing, container, runtime loader, fused kernel과
            hardware capability가 모두 맞아야 한다. vLLM의 지원 표도 version에 따라 변하므로
            artifact manifest에 확인한 version과 kernel을 기록한다.
          </p>
        </div>
        <KernelRealizationLab />
      </NlpSection>

      <NlpSection
        id="qat-release"
        marker="05"
        tone="green"
        question="PTQ 품질이 부족하면 QAT를 바로 해야 할까?"
        title="Fake quantization으로 회복할 가치가 있을 때만 재학습한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            QAT는 forward에 clipping·rounding을 모사하는 fake-quant operator를 넣고, backward에서는
            근사 gradient로 weight가 quantization grid에 적응하게 학습한다. PTQ보다 training data,
            optimizer state, checkpoint lineage와 비용이 늘어난다. 먼저 granularity, calibration,
            sensitive layer 제외, mixed precision과 다른 PTQ method로 실패 원인을 좁힌다.
          </p>
          <p>
            QAT가 필요하면 float baseline에서 시작해 observer warm-up, scale freeze 시점,
            fake-quant insertion 위치와 final convert graph를 versioning한다. Training graph가 좋아도
            converted artifact가 runtime에서 다른 operator로 fallback할 수 있으므로 최종 container를
            reload해 bit layout, model output과 end-to-end latency를 다시 측정한다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Affine quantization의 scale, zero point, clipping과 rounding을 수식으로 설명할 수 있다.',
          'Per-tensor·channel·group granularity와 outlier의 trade-off를 설명할 수 있다.',
          'Weight-only, W8A8, KV-cache와 QLoRA storage quantization을 구분할 수 있다.',
          'RTN, GPTQ, AWQ와 SmoothQuant가 사용하는 관측과 목표를 구분할 수 있다.',
          'Quantization method, tensor packing, GGUF container, runtime과 kernel을 독립 축으로 추적할 수 있다.',
          'PTQ 실패를 진단한 뒤 QAT의 추가 비용이 필요한지 판단할 수 있다.',
        ]} />
        <LearningHandoff
          description="Quantization 결과는 bit 수 하나가 아니라 algorithm, packed tensor format, container, runtime operator와 hardware kernel의 합이다. 정확도와 byte 절감이 확인돼도 target runtime이 그 layout을 소비하지 못하면 배포 속도는 완료되지 않았다."
          items={[
            { label: '막히면', slug: 'compression-pipeline', title: '압축 의사결정 파이프라인', reason: 'Quality·artifact size·resident memory·latency·energy 중 어떤 제약 때문에 압축하는지 먼저 고정한다.' },
            { label: '이어 읽기', slug: 'efficient-inference-on-device', title: '효율적 On-device 추론', reason: 'Weight byte, KV cache, workspace와 unsupported-op fallback을 같은 device budget에서 계산한다.' },
            { label: '적용하기', slug: 'on-device-llm-runtime', title: 'On-device LLM Runtime', reason: '실제 mobile compiler·CPU/GPU/NPU partition과 thermal trace에서 선택한 dtype·packing이 end-to-end 이득을 내는지 검증한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'torchao · Quantization overview', href: 'https://docs.pytorch.org/ao/stable/contributing/quantization_overview.html', note: 'Affine primitive, quantized tensor·packing, algorithm과 kernel을 층으로 나눈 공식 설명.' },
          { label: 'torchao · Quantized inference', href: 'https://docs.pytorch.org/ao/stable/workflows/inference.html', note: 'Weight-only, dynamic activation, INT4·INT8·FP8 조합과 hardware requirement의 현재 공식 경계.' },
          { label: 'ONNX Runtime · Quantization', href: 'https://onnxruntime.ai/docs/how-to/quantization.html', note: 'Dynamic·static PTQ, MinMax·Entropy·Percentile calibration과 INT4 operator 지원.' },
          { label: 'GPTQ · Frantar et al.', href: 'https://arxiv.org/abs/2210.17323', note: 'Approximate second-order information을 쓰는 one-shot weight quantization 원 논문.' },
          { label: 'AWQ · MLSys 2024', href: 'https://proceedings.mlsys.org/paper_files/paper/2024/hash/42a452cbafa9dd64e9ba4aa95cc1ef21-Abstract-Conference.html', note: 'Activation-aware salient weight 보호와 weight-only INT4의 논문 범위.' },
          { label: 'SmoothQuant · ICML 2023', href: 'https://proceedings.mlr.press/v202/xiao23c.html', note: 'Activation difficulty를 weight로 이동하는 training-free W8A8 PTQ.' },
          { label: 'QLoRA · NeurIPS 2023', href: 'https://proceedings.neurips.cc/paper_files/paper/2023/hash/1feb87871436031bdc0f2beaa62a049b-Abstract-Conference.html', note: 'NF4, double quantization과 BF16 compute 경로를 포함한 memory-efficient fine-tuning 근거.' },
          { label: 'GGUF specification', href: 'https://github.com/ggml-org/ggml/blob/master/docs/gguf.md', note: 'GGUF가 inference model container format이라는 공식 경계.' },
          { label: 'llama.cpp', href: 'https://github.com/ggml-org/llama.cpp', note: 'GGUF loading, quantization tooling과 CPU·GPU offload를 포함한 현재 runtime 구현.' },
          { label: 'vLLM · Quantization', href: 'https://docs.vllm.ai/en/v0.16.0/features/quantization/', note: 'Quantization format과 hardware별 지원이 version-dependent임을 보여 주는 compatibility 표.' },
        ]} />
      </NlpSection>
    </div>
  );
}
