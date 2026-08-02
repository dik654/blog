import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CitationBlock } from '@/components/ui/citation';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { PatchBudgetLab, VisionBackboneLab, ViTShapeReadoutLab } from './vision-foundations/viz/FoundationLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div data-formula-pair className="not-prose my-6 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><M display className="my-0 text-[12px] sm:text-base">{latex}</M></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function VisionTransformerArticle() {
  return <>
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">ViT는 image를 “문장처럼 본다”가 아니라 비교할 단위로 다시 자른다</h2>
      <QuestionLead
        question="224×224 RGB image가 Transformer에 들어가기 직전의 tensor shape은 어떻게 바뀌어야 할까?"
        answer="16×16 patch라면 14×14=196개의 patch가 생긴다. 각 patch의 16×16×3 값을 펼쳐 D차원으로 projection하고, 위치 정보와 필요하면 class token을 더해 197×D sequence를 만든다."
      />
      <ConceptPrimer items={[
        { term: 'Patch', meaning: 'Image를 겹치지 않는 P×P 구역으로 자른 입력 단위.', why: 'Pixel 수를 Transformer가 처리할 token 수로 줄인다.' },
        { term: 'Patch embedding', meaning: '각 patch 값을 D차원 vector로 바꾸는 projection.', why: '모든 patch를 같은 model dimension의 token으로 만든다.' },
        { term: 'Position embedding', meaning: '각 token이 원래 image의 어느 위치였는지 더하는 값.', why: 'Self-attention 자체는 token 순서를 자동으로 알지 못한다.' },
        { term: 'Class token', meaning: '분류를 위해 sequence 앞에 두는 학습 가능한 token.', why: '모든 patch에서 모은 global representation을 head에 전달한다.' },
      ]} />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>ViT의 핵심은 Transformer라는 이름보다 <strong>input contract</strong>에 있다. Image grid를 patch sequence로 바꾸면 language Transformer와 같은 self-attention block을 적용할 수 있다. 대신 patch 크기가 detail과 memory cost를 동시에 결정한다.</p>
        <p><InternalLink slug="resnet">ResNet</InternalLink>에서 배운 residual update는 사라지지 않는다. 달라지는 것은 update를 만드는 operator다. CNN은 2D feature map의 가까운 이웃을 같은 convolution weight로 섞고, ViT는 patch token의 관계를 attention으로 학습한다. Locality·translation equivariance가 layer마다 강제되던 부분은 약해지고, patchify와 position이 공간 계약을 맡는다.</p>
        <CitationBlock source="An Image is Worth 16x16 Words · Dosovitskiy et al." citeKey={1} href="https://arxiv.org/abs/2010.11929"><p>원 논문은 image patch sequence에 pure Transformer를 적용하고, 대규모 사전학습 뒤 여러 image recognition task로 transfer하는 구성을 제시한다. 여기서는 특정 accuracy 숫자가 아니라 patch-to-sequence 실행 계약의 1차 근거로 사용한다.</p></CitationBlock>
      </div>
      <Misconception>모든 patch가 서로 attention한다고 해서 model이 자동으로 2D geometry를 정확히 이해하는 것은 아니다. Position encoding, pretraining data, resolution, objective와 dense-task decoder가 공간 표현의 품질을 함께 결정한다.</Misconception>
    </section>

    <section id="patch-embedding" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Patch 크기는 전처리 옵션이 아니라 모델의 token budget이다</h2>
      <PatchBudgetLab />
      <Formula
        latex={String.raw`\begin{aligned}\underbrace{N}_{\text{patch token 수}}&=\underbrace{\frac{H}{P}\frac{W}{P}}_{\text{세로 수와 가로 수의 곱}}\\\underbrace{X_p}_{\text{batch patch tensor}}&\in\mathbb R^{\underbrace{B\times N\times P^2C}_{\text{batch·위치·raw patch 값}}}\end{aligned}`}
        meaning="이 식은 B장의 H×W image를 P×P patch로 자른 뒤 batch, patch 위치, patch 내부 pixel·channel의 세 축으로 재배열한다. H와 W가 P로 나누어지지 않으면 resize·crop·padding 정책을 먼저 정해야 하며, 그 정책은 원본 좌표 변환과 함께 저장한다."
        symbols={[["B", '한 번에 처리하는 image 수'], ["H,W", '입력 image 높이와 너비'], ["P", '정사각 patch 한 변'], ["C", '입력 channel 수'], ["N", 'class token을 제외한 patch token 수']]}
      />
      <Formula
        latex={String.raw`\begin{aligned}\underbrace{X_pE}_{\text{projected patch}}&\in\mathbb R^{B\times N\times D}\\\underbrace{Z_0}_{\text{encoder 입력}}&=\underbrace{[x_{\mathrm{cls}};\,X_pE]}_{\text{S=N+1 자리}}+\underbrace{E_{\mathrm{pos}}}_{\text{위치 정보}}\end{aligned}`}
        meaning="Raw patch 마지막 축 P²C에 같은 projection E를 곱해 model width D로 맞춘다. 분류형 원 ViT는 CLS 한 자리를 앞에 붙여 S=N+1 sequence를 만들고 position embedding을 더한다. Dense task나 일부 modern encoder는 CLS 없이 patch 전체를 유지할 수 있다."
        symbols={[["E", 'Shape [P²C,D]인 학습 projection'], ["x_{cls}", '분류용 학습 token'], ["S", 'Encoder가 읽는 총 sequence 길이'], ["E_{pos}", 'Shape [S,D]인 위치 embedding'], ["Z_0", '첫 Transformer block 입력']]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Patch embedding은 <code>Conv2d(C, D, kernel_size=P, stride=P)</code>로 구현할 수 있다. 겹치지 않는 patch마다 같은 linear projection을 적용한다는 점에서 <InternalLink slug="cnn">convolution의 weight sharing</InternalLink>과 연결된다.</p>
        <p>Raster order는 위에서 아래, 왼쪽에서 오른쪽처럼 2D patch grid를 1D sequence로 펴는 약속이다. 230×346처럼 P=16으로 나누어떨어지지 않는 입력은 자동으로 “280개 token”이 되지 않는다. Crop이면 가장자리를 버리고, padding이면 가상 pixel과 mask를 추가하며, ceil patching이면 partial patch 처리 규칙이 필요하다.</p>
        <p>Checkpoint의 학습 resolution과 다른 resolution을 넣으면 position embedding 길이가 바뀐다. 224→384라면 14×14 patch position만 24×24로 2D 보간하고 CLS 한 자리는 따로 보존한다. Tensor shape을 맞췄다는 사실만으로 좌표 의미와 성능이 유지됐다고 결론내리면 안 된다.</p>
      </div>
      <ViTShapeReadoutLab />
    </section>

    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Encoder block은 token을 섞는 길과 각 token을 바꾸는 길을 번갈아 쓴다</h2>
      <div className="not-prose grid gap-px overflow-hidden rounded-md border border-border sm:grid-cols-3 lg:grid-cols-6">
        {[
          ['01', 'Normalize', '각 token의 feature scale을 정리한다.'],
          ['02', 'Attention', 'token 사이에서 가져올 정보를 계산한다.'],
          ['03', 'Residual', 'attention update를 이전 token에 더한다.'],
          ['04', 'Normalize', 'MLP에 넣기 전 feature scale을 다시 정리한다.'],
          ['05', 'MLP · 다층 퍼셉트론', 'Multi-Layer Perceptron. 각 token 내부 channel을 변환한다.'],
          ['06', 'Residual', 'MLP update도 이전 표현에 더한다.'],
        ].map(([index, title, body]) => <div key={index} className="min-w-0 bg-background p-4"><p className="font-mono text-[10px] font-black text-primary">{index}</p><p className="mt-2 text-sm font-black">{title}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p></div>)}
      </div>
      <Formula
        latex={String.raw`\begin{aligned}\underbrace{A}_{\text{token 간 가져올 비율}}&=\operatorname{softmax}\!\left(\underbrace{\frac{QK^\top}{\sqrt{d_h}}}_{\text{query-key 방향 점수 안정화}}\right)\\\underbrace{O}_{\text{섞인 token}}&=\underbrace{AV}_{\text{value의 가중합}}\end{aligned}`}
        meaning="각 token query가 모든 key와 점수를 만들고, softmax 비율로 value를 합치는 한 attention head의 흐름이다. √d_h로 나누는 이유는 dot product의 분산이 head 폭과 함께 커져 softmax가 너무 일찍 포화되는 것을 줄이기 위해서다."
        symbols={[["Q,K,V", 'token에서 만든 query·key·value'], ["d_h", '한 attention head의 차원'], ["A", 'token-to-token attention matrix'], ["O", '다른 token 정보를 섞은 출력']]}
      />
      <Formula
        latex={String.raw`\begin{aligned}\underbrace{Q,K,V}_{\text{head별 tensor}}&\in\mathbb R^{B\times h\times S\times d_h}\\\underbrace{A}_{\text{attention score}}&\in\mathbb R^{B\times h\times S\times S}\end{aligned}`}
        meaning="Model width D를 h개 head로 나눠 d_h=D/h로 reshape한다. Score tensor는 각 batch와 head에서 query 자리 S와 key 자리 S의 모든 조합을 저장하므로 token 수가 두 축에 반복된다."
        symbols={[["B", 'Batch size'], ["h", 'Attention head 수'], ["S", 'CLS·register를 포함한 sequence 길이'], ["d_h", '한 head의 feature 폭'], ["A", 'Softmax 전후의 token-pair tensor']]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>QKV 계산 자체가 막히면 <InternalLink slug="attention-theory">Attention 기초</InternalLink>를 연다. 여기서 중요한 것은 image token 수 <M>N</M>이 attention matrix의 두 축 모두에 들어간다는 점이다.</p>
      </div>
      <VisionBackboneLab />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <CitationBlock source="Swin Transformer · Liu et al." citeKey={2} href="https://arxiv.org/abs/2103.14030"><p>Swin은 non-overlapping local window로 attention 범위를 제한하고 shifted window로 이웃 window를 연결하며, stage별 hierarchical representation을 만든다. Global ViT의 단순한 최신 버전이 아니라 dense vision용 다른 정보 흐름이다.</p></CitationBlock>
      </div>
    </section>

    <section id="tradeoff" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">해상도를 두 배로 올리면 global attention은 네 배가 아니라 열여섯 배가 될 수 있다</h2>
      <Formula
        latex={String.raw`\begin{aligned}\underbrace{N}_{\text{patch 수}}&=\underbrace{\frac{HW}{P^2}}_{\text{pixel 면적을 patch 면적으로 나눔}}\\\underbrace{C_{\mathrm{pair}}}_{\text{token 쌍}}&=\underbrace{S^2}_{\text{query 수와 key 수의 곱}}\end{aligned}`}
        meaning="Patch 크기 P를 고정한 채 H와 W를 각각 두 배로 만들면 patch 수 N이 네 배가 된다. CLS 등을 포함한 sequence S의 모든 query-key 조합은 S²이므로 global attention의 pair 수는 거의 열여섯 배가 된다."
        symbols={[["N", 'Image patch token 수'], ["S", 'Special token을 포함한 총 길이'], ["H,W", '입력 해상도'], ["P", 'Patch 크기']]}
      />
      <Formula
        latex={String.raw`\begin{aligned}
\underbrace{C_{\mathrm{block}}}_{\text{한 block 연산}}
&\approx C_{\mathrm{proj}}+C_{\mathrm{pair}}+C_{\mathrm{MLP}}\\
\underbrace{C_{\mathrm{proj}}}_{\text{QKV·출력 projection}}&=4SD^2\\
\underbrace{C_{\mathrm{pair}}}_{\text{score·value mixing}}&=2S^2D\\
\underbrace{C_{\mathrm{MLP}}}_{\text{두 linear layer}}&=8SD^2\\
\underbrace{M_{\mathrm{score}}}_{\text{score 저장 byte}}
&=\underbrace{BhS^2b}_{\text{batch·head·token 쌍·dtype}}
\end{aligned}`}
        meaning="한 ViT block의 비용은 token-pair 항만 있는 것이 아니다. Width가 큰 구간에서는 projection·MLP의 SD² 항이 지배할 수 있고, sequence가 길어지면 S²D와 score memory가 빠르게 커진다. FlashAttention은 score 전체를 HBM에 materialize하지 않는 실행 전략이지 S² 관계 계산 자체를 없애는 것은 아니다."
        symbols={[["D", 'Model hidden width'], ["h", 'Head 수'], ["b", '한 score element의 byte 수'], ["4SD²", 'Q·K·V와 output projection'], ["8SD²", '확장 비율 4인 MLP의 두 linear layer']]}
      />
      <QuestionLead
        question="1024×1024 image를 P=16 global ViT에 넣으면 token 수와 한 head의 attention score 수는 얼마인가? P=8로 바꾸면 무엇이 달라질까?"
        answer="P=16이면 64×64=4,096 token이고 score matrix는 약 1,678만 칸이다. P=8이면 128×128=16,384 token, score는 약 2억 6,844만 칸으로 16배가 된다. 작은 결함 detail은 늘지만 memory와 latency 때문에 crop, window attention, hierarchical backbone 중 하나를 함께 검토해야 한다."
      />
      <div className="not-prose divide-y divide-border border-y border-border">
        {[
          ['Global ViT', '모든 patch 관계가 즉시 필요하고 token budget이 허용될 때 기준점으로 둔다.'],
          ['Window·hierarchy', '고해상도 dense task에서 local cost와 multi-scale output이 필요할 때 검토한다.'],
          ['Self-supervised ViT', 'Text label 없이 범용 visual feature가 필요하면 DINOv2 같은 pretraining contract를 비교한다.'],
          ['Vision-language', 'Natural-language query가 필요하면 architecture만 보지 말고 CLIP objective와 data pair를 함께 본다.'],
        ].map(([title, body]) => <div key={title} className="grid gap-2 py-4 sm:grid-cols-[10rem_minmax(0,1fr)]"><p className="text-sm font-bold">{title}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
      </div>
      <div className="prose prose-neutral mt-7 max-w-none dark:prose-invert">
        <h3>데이터가 많으면 ViT가 이긴다는 문장을 법칙처럼 외우지 않는다</h3>
        <p>원 논문은 ImageNet 1.3M, ImageNet-21k 14M, JFT 303M이라는 특정 사전학습 규모와 optimizer·regularization 조건에서 ResNet(BiT), pure ViT, hybrid를 비교했다. 작은 데이터 조건에서는 CNN의 locality·translation equivariance가 유리했고, 큰 사전학습 조건에서는 ViT가 더 잘 확장되는 관찰을 보고했다.</p>
        <p>이것은 임의의 domain에 적용되는 보편적 crossover 숫자가 아니다. 의료 영상 10만 장과 자연 영상 10만 장은 같은 데이터가 아니며, augmentation·self-supervision·label quality도 다르다. 새 system에서는 동일한 data split과 compute budget에서 CNN, ViT 또는 hybrid baseline을 다시 비교한다.</p>
      </div>
      <CitationBlock source="DINOv2 · Oquab et al." citeKey={3} href="https://arxiv.org/abs/2304.07193"><p>DINOv2는 curated data와 self-supervised training을 확장해 image·pixel level에서 재사용할 visual feature를 목표로 한다. ViT architecture와 pretraining objective·data pipeline은 별개의 선택 축이다.</p></CitationBlock>
      <StopRule>ViT 이전의 모든 attention 논문과 image architecture 역사를 필수로 내려가지 않는다. Patch sequence shape, position, QKV attention, N² 비용과 global·window·hierarchical output 차이를 계산할 수 있으면 현재 vision backbone을 읽는 최소 바닥에 도달했다.</StopRule>
    </section>

    <section id="practice" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Production에서는 model name보다 입력·출력 manifest를 고정한다</h2>
      <div className="not-prose divide-y divide-border border-y border-border">
        {[
          ['Input', 'Decode library, color order, resize·crop·padding, normalization과 source transform.'],
          ['Tokenization', 'Patch size, input resolution, class/register token, position interpolation policy.'],
          ['Encoder', 'Architecture revision, weight digest, precision, attention implementation과 feature stage.'],
          ['Task head', 'Global class token, pooled token, dense patch grid 중 무엇을 소비하는지.'],
          ['Evidence', 'Accuracy만이 아니라 scale·condition slice, p95 latency, peak memory와 coordinate round-trip.'],
        ].map(([title, body], index) => <div key={title} className="grid gap-2 py-4 sm:grid-cols-[3rem_9rem_minmax(0,1fr)]"><span className="font-mono text-xs font-black text-primary">0{index + 1}</span><p className="text-sm font-bold">{title}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
      </div>
      <div className="prose prose-neutral mt-7 max-w-none dark:prose-invert">
        <h3>ViT 출력 하나라는 말도 downstream마다 뜻이 다르다</h3>
        <p>분류는 마지막 CLS <M>z_L[:,0,:]</M>나 patch 평균처럼 하나의 pooled vector를 쓸 수 있다. CLIP은 이 global image representation을 text representation과 대조 학습해 같은 의미 공간에 정렬한다. Detection·segmentation은 좌표별 patch grid를 보존해야 한다.</p>
        <p><InternalLink slug="multimodal-fusion-interleaved-context">멀티모달 LLM 결합</InternalLink>에서는 pooled vector 하나보다 <M>[B,N,D_v]</M> patch feature를 유지하고 projector로 language width <M>{String.raw`D_{\mathrm{lm}}`}</M>에 맞추는 경우가 많다. 따라서 “ViT를 쓴다”보다 어떤 layer의 몇 token을 누가 소유하고 다음 context에 몇 자리로 넘기는지를 기록해야 한다.</p>
        <CitationBlock source="Visual Instruction Tuning · Liu et al." citeKey={4} href="https://arxiv.org/abs/2304.08485"><p>LLaVA는 pretrained CLIP visual encoder의 grid feature를 projection matrix로 language embedding width에 연결한다. 분류용 pooled readout과 multimodal용 patch-token handoff를 구분하는 구현 기준점으로 사용한다.</p></CitationBlock>
      </div>
      <Misconception>“timm에서 accuracy가 높은 model”을 고르는 것은 release decision이 아니다. Pretrained config와 실제 preprocess가 다르거나 dense head가 기대하는 feature scale이 다르면 checkpoint 자체가 좋아도 system은 실패한다.</Misconception>
      <CapabilityCheck items={[
        'H×W×C image를 P×P patch와 N×D token sequence로 변환한다.',
        'Batch 축, projection matrix shape와 CLS 포함 sequence 길이를 추적한다.',
        'Resolution 변경에서 CLS를 제외한 2D position grid만 보간한다.',
        'CLS·mean pooling·dense patch readout의 출력 shape를 구분한다.',
        'QKᵀ, softmax, V 가중합의 tensor 의미를 image token 관점에서 말한다.',
        'Patch·resolution·width 변화가 연산 항과 score byte에 미치는 영향을 계산한다.',
        'Attention 범위와 hierarchical stage를 독립 축으로 구분한다.',
        '원 논문의 data-regime 관찰을 보편 법칙으로 확대하지 않는다.',
        '분류 CLS, CLIP pooled vector와 multimodal patch handoff를 구분한다.',
        'Pretraining objective와 backbone architecture를 같은 개념으로 섞지 않는다.',
        'Weight·preprocess·tokenization·feature output을 하나의 manifest로 version한다.',
      ]} />
      <SourceNotes sources={[
        { label: 'An Image is Worth 16x16 Words', href: 'https://arxiv.org/abs/2010.11929', note: 'Patch sequence와 pure Transformer image classification의 canonical 기준점.' },
        { label: 'Swin Transformer', href: 'https://arxiv.org/abs/2103.14030', note: 'Shifted local windows와 hierarchical dense-vision backbone의 1차 근거.' },
        { label: 'DINOv2', href: 'https://arxiv.org/abs/2304.07193', note: 'Self-supervised general-purpose visual feature와 curated data pipeline의 비교 기준.' },
        { label: 'CLIP', href: 'https://arxiv.org/abs/2103.00020', note: '같은 ViT backbone을 language-aligned representation으로 학습하는 별도 objective 기준.' },
        { label: 'Visual Instruction Tuning (LLaVA)', href: 'https://arxiv.org/abs/2304.08485', note: 'CLIP patch-grid feature를 language width로 projection하는 multimodal handoff 기준.' },
      ]} />
    </section>
  </>;
}
