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
import { SparsityRealizationLab } from './practical-compression/viz/CompressionDecisionLabs';

export default function PruningArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="zero-vs-skip"
        marker="00"
        tone="blue"
        question="Weight의 70%를 0으로 만들면 연산도 70% 사라질까?"
        title="0을 만드는 것과 0의 계산을 건너뛰는 것은 다르다"
      >
        <QuestionLead
          question="Dense tensor의 값만 0으로 바꾼 뒤 checkpoint 크기와 latency가 그대로라면 프루닝은 실패한 것일까?"
          answer="Mask 생성에는 성공했지만 배포 압축은 아직 아니다. Dense kernel은 0도 읽고 곱할 수 있다. Sparse encoding·지원 kernel 또는 실제 tensor shape 제거까지 연결해야 한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pruning은 중요하지 않다고 판단한 parameter, channel, head, neuron 또는 layer를 제거하는
            방법이다. 가장 단순한 mask pruning은 원래 weight <em>W</em>에 0·1 mask <em>M</em>을
            곱한다. 이때 parameter의 값은 0이 되지만 tensor shape와 dense execution graph는 그대로다.
          </p>
          <p>
            따라서 세 숫자를 따로 기록한다. <strong>논리 sparsity</strong>는 0의 비율,
            <strong>물리 크기</strong>는 sparse encoding 또는 rewrite 뒤 artifact byte,
            <strong>실현 성능</strong>은 target runtime에서 측정한 latency·throughput이다.
            하나가 좋아졌다고 다른 둘을 추론하지 않는다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
W'
&=\underbrace{M\odot W}_{\text{mask로 남긴 weight}}\\
\rho
&=\underbrace{1-\frac{\lVert M\rVert_0}{\lvert M\rvert}}_{\text{논리 sparsity}}\\
T_{\mathrm{real}}
&=\underbrace{T(W',\,\text{shape},\,\text{kernel},\,\text{hardware})}_{\text{실제 실행 시간}}
\end{aligned}`}
          meaning="Sparsity rho는 mask에서 0이 된 비율일 뿐이다. 실제 시간은 sparse pattern, tensor shape, encoding, kernel과 hardware가 함께 결정한다."
          symbols={[
            [String.raw`W,W'`, '원래 weight와 pruning 후 weight'],
            [String.raw`M`, '남길 위치는 1, 제거할 위치는 0인 mask'],
            [String.raw`\lVert M\rVert_0`, 'Mask에서 1인 원소 수'],
            [String.raw`\lvert M\rvert`, 'Mask의 전체 원소 수'],
            [String.raw`T_{\mathrm{real}}`, 'Target runtime에서 측정한 end-to-end 또는 kernel 시간'],
          ]}
        />
        <ConceptPrimer items={[
          { term: 'Mask', meaning: '어떤 weight를 남길지 표시하는 0·1 구조', why: '학습·평가에서 제거 상태를 재현하고 artifact lineage를 남긴다.' },
          { term: 'Sparse pattern', meaning: '0이 임의 위치인지, N:M·block처럼 규칙적인지 나타내는 모양', why: 'Hardware와 kernel이 건너뛸 수 있는 단위를 결정한다.' },
          { term: 'Structural pruning', meaning: 'Channel, head, neuron 또는 layer를 graph와 tensor shape에서 실제 제거', why: '일반 dense kernel에서도 더 작은 shape가 계산되게 할 수 있다.' },
          { term: 'Calibration data', meaning: 'Weight를 다시 학습하기보다 어떤 입력에서 자주 쓰이는지 관찰하려고 미리 흘려보는 작은 대표 sample 묶음', why: 'Activation-aware score와 layer reconstruction은 이 입력에서 본 반응을 근거로 제거 순서를 정하므로 실제 사용 분포를 대표해야 한다.' },
          { term: 'GQA와 KV head', meaning: '여러 query head가 더 적은 수의 key·value head를 함께 쓰는 attention 구조', why: 'Head 하나를 지울 때 공유되는 KV head와 projection shape까지 함께 바뀔 수 있어 단순 행 삭제로 끝나지 않는다.' },
          { term: 'Recovery', meaning: 'Mask 또는 작은 구조를 고정·완화한 뒤 품질을 되찾는 학습', why: '어떤 데이터와 objective로 회복했는지 없으면 compression 결과를 재현할 수 없다.' },
        ]} />
      </NlpSection>

      <NlpSection
        id="pattern-runtime"
        marker="01"
        tone="violet"
        question="같은 50% sparsity라도 왜 어떤 pattern만 빨라질까?"
        title="Runtime이 소비할 수 있는 단위로 제거한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Unstructured pruning은 위치 제약 없이 개별 weight를 제거해 품질 선택의 자유가 크지만,
            index와 irregular memory access 비용이 생긴다. N:M semi-structured sparsity는 연속된
            M개 중 N개만 남기는 규칙으로 자유도를 줄이는 대신 hardware path를 얻는다. NVIDIA
            Ampere 이후 sparse Tensor Core의 대표 계약은 2:4이며, dtype·shape·library 지원까지
            맞아야 한다.
          </p>
          <p>
            Block pruning은 tile 단위로 지워 vectorized access를 쉽게 한다. Channel·neuron·head·layer
            pruning은 tensor dimension을 줄여 dense operator를 다시 만들 수 있지만, residual path,
            hidden size divisibility, normalization, attention grouping과 checkpoint compatibility를
            함께 바꾼다. 특히 GQA에서는 여러 query head가 더 적은 KV head를 공유하므로 query head만
            지웠는지, 공유 KV head와 projection까지 함께 줄였는지를 구분해야 한다. Head 수만 줄여도
            hidden projection shape를 그대로 두면 FLOP가 기대만큼 줄지 않을 수 있다.
          </p>
        </div>
        <SparsityRealizationLab />
        <Misconception>
          “A100의 2:4는 두 배 빠르다”는 hardware peak 설명을 end-to-end SLO로 옮긴 문장이다.
          Sparse가 적용되는 operator 비율, memory·launch·attention·communication과 request shape가
          전체 latency를 결정하므로 같은 workload에서 직접 측정한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="importance-evidence"
        marker="02"
        tone="teal"
        question="작은 weight가 곧 중요하지 않은 weight일까?"
        title="값, activation과 손실 변화를 서로 다른 중요도 증거로 본다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Magnitude pruning은 절댓값이 작은 weight부터 제거한다. 싸고 명확한 baseline이지만,
            작은 weight가 큰 activation과 곱해지거나 여러 경로에서 반복 사용되면 output 영향은 클 수
            있다. Global threshold는 layer별 scale 차이를 섞고, layer-wise threshold는 민감도 차이를
            숨길 수 있으므로 둘 다 검증 대상이다.
          </p>
          <p>
            Activation-aware score는 calibration data에서 입력 activation을 관찰한다. Gradient·Taylor
            score는 제거가 loss에 줄 local 변화를 근사하고, approximate second-order 방식은 weight
            사이 보상까지 고려한다. 더 복잡한 score가 언제나 더 좋은 것은 아니다. Calibration
            distribution이 deployment를 못 덮으면 정교하게 그 distribution에만 맞춘 mask가 된다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Magnitude', 'Weight 값만 필요하다. 강한 baseline이지만 input-dependent 영향은 보지 못한다.'],
            ['Weight × activation', '실제 input에서 사용되는 정도를 반영한다. Calibration coverage가 새 의존성이 된다.'],
            ['Gradient / Taylor', 'Loss 변화의 local 근사를 쓴다. Objective·batch와 backprop 비용을 기록한다.'],
            ['Second order', 'Weight 간 curvature·보상을 근사한다. 계산·memory와 approximation error가 늘어난다.'],
            ['Structural search', 'Channel·head·layer 단위의 실제 latency·quality를 직접 비교한다. Search cost와 shape constraint가 생긴다.'],
          ].map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </NlpSection>

      <NlpSection
        id="llm-one-shot"
        marker="03"
        tone="amber"
        question="SparseGPT와 Wanda는 무엇을 증명했고 어디까지 일반화할 수 있을까?"
        title="논문의 모델·pattern·metric 경계 안에서 one-shot pruning을 읽는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            SparseGPT는 layer output reconstruction을 기준으로 approximate inverse-Hessian
            information을 사용해 weight를 제거하고 남은 weight를 보상한다. ICML 2023 논문은
            <strong>OPT-175B와 BLOOM-176B</strong>를 포함한 decoder-only autoregressive open
            model에서 one-shot
            pruning을 대규모로 수행했다. 이를 “GPT-3 175B를 프루닝했다”로 바꾸면 모델 attribution이
            틀린다.
          </p>
          <p>
            Wanda는 weight magnitude와 input activation norm을 결합한 단순 score로, weight update나
            inverse Hessian 없이 layer별 mask를 만든다. 논문 발표는 <strong>ICLR 2024</strong>다.
            두 방법의 특정 perplexity 숫자와 우열은 model, sparsity pattern, dataset, calibration과
            implementation 안에서만 의미가 있다. 글에서는 보편 ranking 대신 필요한 관측과 비용의
            차이를 남긴다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
S_{ij}^{\mathrm{Wanda}}
&=\underbrace{|W_{ij}|}_{\text{weight 크기}}
\underbrace{\lVert X_j\rVert_2}_{\text{입력 channel 사용량}}\\
\mathcal E
&=\underbrace{\lVert WX-W'X\rVert_2^2}_{\text{layer 출력 재구성 오차}}
\end{aligned}`}
          meaning="Wanda score는 weight와 calibration activation을 곱해 local 중요도를 정한다. SparseGPT 계열은 pruning 전후 layer output의 재구성 오차를 줄이면서 weight 간 보상을 근사한다."
          symbols={[
            [String.raw`W_{ij}`, '출력 i, 입력 j를 잇는 weight'],
            [String.raw`X_j`, 'Calibration batch에서 입력 channel j의 activation'],
            [String.raw`S_{ij}^{\mathrm{Wanda}}`, 'Wanda가 mask 순서를 정할 때 쓰는 local score'],
            [String.raw`W'`, 'Pruning과 보상 update가 적용된 weight'],
            [String.raw`\mathcal E`, 'Calibration input에서 측정한 layer reconstruction error'],
          ]}
        />
      </NlpSection>

      <NlpSection
        id="recovery-order"
        marker="04"
        tone="blue"
        question="프루닝 후 fine-tuning은 언제 필요하고 다른 압축과는 어떤 순서로 섞을까?"
        title="Mask와 구조를 고정한 회복 run을 독립 실험으로 다룬다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            One-shot quality가 release floor를 넘으면 recovery training 없이 끝낼 수 있다. 부족하면
            낮은 learning rate의 dense recovery, mask를 고정한 sparse fine-tuning, 점진적으로
            sparsity를 올리는 schedule 또는 작은 구조의 full fine-tuning을 후보로 둔다. Optimizer가
            0 weight를 다시 살리지 않도록 mask 적용 시점과 gradient·optimizer state 처리까지 기록한다.
          </p>
          <p>
            Quantization과 결합하는 순서도 고정 법칙이 아니다. Quantized artifact에서 mask score를
            계산하면 ranking이 바뀔 수 있고, pruning 뒤 quantization은 새 distribution과 shape에 맞는
            calibration이 필요하다. Distillation은 pruning recovery objective가 될 수도, 처음부터
            작은 structured student를 학습해 pruning 자체를 피하는 대안이 될 수도 있다.
          </p>
          <p>
            최소 matrix는 dense baseline, pruning only, recovery only가 아니라
            <strong>pruning+recovery</strong>, quantization only, pruning→quantization,
            quantization→pruning이다. 같은 data·step budget·runtime에서 quality와 latency를 비교해
            실제로 둘 다 필요한 경우에만 조합한다.
          </p>
        </div>
        <StopRule>
          FLOP, zero ratio 또는 sparse checkpoint byte만 줄고 target runtime latency·capacity가
          개선되지 않으면 “가속 프루닝”이라고 부르지 않는다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="release-check"
        marker="05"
        tone="green"
        question="프루닝 artifact의 출시 증거는 무엇이어야 할까?"
        title="Mask, shape, kernel과 품질 회복을 하나의 lineage로 묶는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Artifact에는 source hash, score method, calibration manifest, target pattern, layer별
            sparsity, mask, recovery checkpoint, graph rewrite, sparse encoding과 runtime·kernel
            version을 포함한다. Structured pruning이면 hidden dimension, head·KV-head 관계,
            tokenizer·output head tie, residual과 tensor-parallel divisibility를 자동 검사한다.
          </p>
          <p>
            품질은 평균 benchmark뿐 아니라 긴 context, 희귀 token·class, safety, language·domain과
            calibration slice를 본다. Performance는 sparse 적용 operator만의 microbenchmark와 전체
            request를 함께 남긴다. 그래야 kernel은 빨랐지만 attention·I/O 때문에 서비스는 같았던
            경우를 분리할 수 있다.
          </p>
        </div>
        <CapabilityCheck items={[
          '논리 sparsity, 물리 artifact 크기와 실현 latency를 구분할 수 있다.',
          'Unstructured, N:M, block과 structural pruning의 runtime 조건을 설명할 수 있다.',
          'Magnitude, activation-aware, gradient·Taylor와 second-order score의 입력을 구분할 수 있다.',
          'SparseGPT와 Wanda의 모델·학회·방법 범위를 정확히 설명할 수 있다.',
          'Recovery training에서 mask, gradient와 optimizer state를 재현할 수 있다.',
          'Quantization·distillation과의 조합 순서를 보편 법칙이 아닌 ablation으로 검증할 수 있다.',
        ]} />
        <LearningHandoff
          description="Pruning의 산출물은 zero 비율이 아니라 target kernel이 소비할 수 있는 pattern과 회복된 품질을 갖춘 artifact다. 논리 sparsity를 실제 latency로 바꾸지 못하면 압축 실험은 끝나지 않았다."
          items={[
            { label: '막히면', slug: 'compression-pipeline', title: '압축 의사결정 파이프라인', reason: 'Model size, bandwidth, latency와 energy 중 pruning이 실제 병목을 겨냥하는지 다시 판단한다.' },
            { label: '이어 읽기', slug: 'quantization', title: 'Quantization', reason: 'Sparsity와 low-bit를 어느 순서로 결합할지 보편 규칙으로 가정하지 않고 calibration·recovery ablation을 설계한다.' },
            { label: '적용하기', slug: 'efficient-inference-on-device', title: '효율적 On-device 추론', reason: 'N:M·block·structural artifact가 target compiler와 kernel에서 wall-clock, memory와 energy 이득으로 실현되는지 확인한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'SparseGPT · ICML 2023', href: 'https://proceedings.mlr.press/v202/frantar23a.html', note: 'OPT-175B·BLOOM-176B, one-shot 50% 이상 sparsity와 semi-structured pattern을 포함한 원 논문 경계.' },
          { label: 'Wanda · ICLR 2024', href: 'https://openreview.net/forum?id=PxoFut3dWW', note: 'Weight magnitude와 activation norm을 결합하고 weight update 없이 mask를 만드는 원 논문.' },
          { label: 'NVIDIA · 2:4 structured sparsity', href: 'https://developer.nvidia.com/blog/accelerating-inference-with-sparsity-using-ampere-and-tensorrt/', note: 'Ampere sparse Tensor Core와 2:4 pattern의 공식 hardware·TensorRT 배경.' },
          { label: 'NVIDIA · INT8 sparsity workflow', href: 'https://developer.nvidia.com/blog/sparsity-in-int8-training-workflow-and-best-practices-for-tensorrt-acceleration/', note: '2:4 mask, retraining·export와 TensorRT execution이 이어지는 공식 workflow.' },
          { label: 'Lottery Ticket Hypothesis', href: 'https://openreview.net/forum?id=rJl-b3RcF7', note: 'Frankle와 Carbin의 dense network 안 trainable subnetwork 가설. Production speedup을 직접 보장하는 논문은 아니다.' },
        ]} />
      </NlpSection>
    </div>
  );
}
