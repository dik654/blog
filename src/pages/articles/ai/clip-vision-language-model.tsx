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
import { ClipAlignmentLab, RetrievalFailureLab } from './clip-vision-language-model/viz/ClipAlignmentLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div data-formula-pair className="not-prose my-6 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><M display className="my-0 text-[12px] sm:text-base">{latex}</M></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function ClipVisionLanguageModelArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">CLIP은 문장을 만드는 모델이 아니라 비교 좌표를 만드는 모델이다</h2>
        <QuestionLead
          question="학습할 때 고정 class head에 ‘fine scratch’를 넣지 않았는데, 실행할 때 이 문장으로 이미지를 분류하거나 찾을 수 있는 이유는 무엇일까?"
          answer="Image encoder와 text encoder가 대응하는 image-caption 쌍을 같은 embedding 방향으로 보내도록 함께 학습했기 때문이다. 실행할 때 새 image vector와 ‘fine scratch’ text vector를 같은 규칙으로 만들고 방향을 비교한다."
        />
        <ConceptPrimer items={[
          { term: 'Encoder', meaning: '이미지 또는 text를 고정 길이 vector로 바꾸는 함수.', why: '서로 다른 입력을 같은 차원의 비교 가능한 표현으로 만든다.' },
          { term: 'Embedding', meaning: '입력의 비교에 필요한 특징을 담은 숫자 vector.', why: '문자열 일치 대신 의미와 시각 패턴의 가까움을 계산한다.' },
          { term: 'Contrastive learning', meaning: '맞는 pair는 가깝게, 틀린 pair는 멀게 만드는 학습.', why: '별도 class ID 대신 image-text 대응 자체가 supervision이 된다.' },
          { term: 'Zero-shot', meaning: '현재 task의 labeled training example 없이 text label로 예측하는 설정.', why: '새 label을 text prototype으로 만들 수 있지만 domain 검증은 여전히 필요하다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>CLIP의 출력은 caption이나 bounding box가 아니라 vector다. 이미지 전체를 나타내는 vector와 문장을 나타내는 vector를 비교해 zero-shot classification과 text-to-image retrieval을 같은 연산으로 바꾼다.</p>
          <CitationBlock source="CLIP · Radford et al." citeKey={1} href="https://arxiv.org/abs/2103.00020"><p>원 논문은 자연어 supervision과 image-text contrastive objective로 학습한 representation의 zero-shot transfer를 보고한다. 여기서는 universal accuracy가 아니라 학습·추론 계약의 근거로 사용한다.</p></CitationBlock>
        </div>
        <Misconception>CLIP이 문장과 이미지를 비교할 수 있다는 말은 이미지 안의 각 문구나 객체 위치를 정확히 안다는 뜻이 아니다. Global image embedding과 region grounding은 다른 출력 계약이다.</Misconception>
      </section>

      <section id="training" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Batch 전체를 image↔text 맞추기 문제로 만든다</h2>
        <ClipAlignmentLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Batch에 <M>N</M>개의 image-caption pair가 있다면 이미지 encoder는 <M>u_i</M>, text encoder는 <M>v_j</M>를 만든다. 모든 <M>N\times N</M> 조합을 비교하면 대각선 <M>(i=i)</M>가 실제 pair이고 나머지는 batch 안의 negative candidate가 된다.</p>
          <p><strong>Softmax</strong>는 한 행 또는 열의 score를 합이 1인 선택 비율로 바꾼다. 아래 <M>{String.raw`\tau`}</M>는 cosine score 차이를 확대·축소하는 학습 가능한 logit scale이며 흔히 inverse temperature로 해석한다. 두 방향의 softmax cross-entropy를 평균한 목적을 <strong>symmetric InfoNCE</strong>라고 부른다.</p>
        </div>
        <Formula
          latex={String.raw`S_{ij}=\underbrace{\tau}_{\text{점수 크기 조절}}\,\underbrace{\frac{\overbrace{u_i^\top v_j}^{\text{두 표현의 방향 일치}}}{\underbrace{\lVert u_i\rVert_2\lVert v_j\rVert_2}_{\text{vector 길이 제거}}}}_{\text{정규화한 cosine similarity}}`}
          meaning="이 식은 image i와 text j의 방향 일치를 score로 만든다. Vector 길이를 제거해 activation 크기보다 방향을 비교하고, 학습 가능한 scale로 softmax가 구분할 정도를 조절한다."
          symbols={[["S_{ij}", 'image i와 text j의 logit'], ["u_i", 'image encoder 출력'], ["v_j", 'text encoder 출력'], [String.raw`\tau`, '학습되는 logit scale'], [String.raw`\lVert\cdot\rVert_2`, 'vector의 L2 길이']]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{\ell_i^{I\to T}}_{\text{image에서 정답 text 찾기}}
&=-\log\frac{e^{S_{ii}}}{\sum_j e^{S_{ij}}}\\
\underbrace{\ell_i^{T\to I}}_{\text{text에서 정답 image 찾기}}
&=-\log\frac{e^{S_{ii}}}{\sum_j e^{S_{ji}}}\\
\underbrace{\mathcal L}_{\text{두 방향을 batch 평균}}
&=\frac{1}{2N}\sum_{i=1}^{N}
\left(\ell_i^{I\to T}+\ell_i^{T\to I}\right)
\end{aligned}`}
          meaning="이 식은 각 image가 자기 caption을 고르는 분류와 각 caption이 자기 image를 고르는 분류를 함께 학습한다. 대각선 score가 다른 후보보다 커지도록 두 encoder가 동시에 업데이트된다."
          symbols={[[String.raw`\mathcal L`, 'image→text와 text→image loss를 평균한 symmetric InfoNCE'], [String.raw`\ell_i^{I\to T}`, 'image i가 자기 text를 고르는 cross-entropy'], [String.raw`\ell_i^{T\to I}`, 'text i가 자기 image를 고르는 cross-entropy'], ["N", 'batch의 image-text pair 수'], ["S_{ii}", '실제 대응 pair의 score'], [String.raw`\sum_j e^{S_{ij}}`, 'image i가 비교할 모든 text 후보'], [String.raw`\sum_j e^{S_{ji}}`, 'text i가 비교할 모든 image 후보']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>In-batch negative는 싸게 많은 비교를 만들지만 언제나 진짜 오답은 아니다. 같은 제품을 다른 각도에서 찍은 두 이미지, 비슷한 caption 두 개가 batch에 있으면 의미상 positive인데 loss는 서로 밀어낼 수 있다. Dataset deduplication, caption 품질, batch 구성과 false-negative 정책은 모델 구조 밖의 핵심 변수다.</p>
          <p>OpenAI reference code는 image/text feature를 normalize한 뒤 learned <code>logit_scale</code>을 곱해 logits를 만든다. 논문의 수식만이 아니라 preprocessing, tokenizer, checkpoint와 code revision을 함께 pin해야 같은 점수가 나온다.</p>
        </div>
      </section>

      <section id="embedding-space" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">공유 좌표는 “같은 축 이름”이 아니라 비교 가능한 geometry다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Shared embedding space라는 말은 실제 축 17번이 scratch, 축 42번이 색상이라는 뜻이 아니다. 학습 결과 두 modality의 방향과 거리가 pair matching에 유용해졌다는 뜻이다. 2D scatter plot은 높은 차원을 projection한 설명 그림일 뿐이다.</p>
          <p>이 방향 비교를 <strong>cosine similarity</strong>라고 부른다. Image encoder와 text encoder의 vector norm이 달라도 직접 비교할 수 있지만, 가까움의 의미는 학습 data 분포가 결정한다. 시각적으로 닮았지만 공정 원인이 다른 결함은 같은 neighborhood에 놓일 수 있다.</p>
        </div>
        <div className="not-prose grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {[
            ['정렬됨', 'Image와 text를 같은 similarity 함수로 비교할 수 있다.'],
            ['해석 가능과 다름', '각 embedding dimension의 인간 친화적 의미가 자동으로 보장되지 않는다.'],
            ['Domain truth와 다름', '가까운 image가 같은 원인·조치라는 보장은 별도 label과 검증이 필요하다.'],
          ].map(([title, body]) => <div key={title} className="min-w-0 bg-background p-5"><p className="text-sm font-bold">{title}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <StopRule>Representation learning 역사를 word2vec 이전까지 필수로 내려가지 않는다. Normalize한 vector의 dot product, positive pair와 in-batch negative를 설명할 수 있으면 CLIP을 읽는 최소 수학 바닥에 도달했다.</StopRule>
      </section>

      <section id="use-cases" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Zero-shot label은 prompt prototype으로 만든다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>새 class마다 “fine scratch” 하나만 넣으면 wording에 따라 score가 흔들릴 수 있다. “a close-up photo of fine scratch”, “surface defect: fine scratch”처럼 여러 template로 text embedding을 만들고 평균한 뒤 다시 normalize해 class prototype을 만든다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{c_k}_{\text{k번째 class prototype}}=\operatorname{norm}\!\left(\underbrace{\frac{1}{T}\sum_{t=1}^{T}f_{text}(p_t(k))}_{\text{여러 한글·영문 prompt 표현의 평균}}\right)`}
          meaning="이 글의 구현용 prototype 규칙이다. 먼저 template vector를 평균해 공통 방향을 구하고 마지막에 다시 normalize하면 prototype의 길이가 template 수나 문장 간 합의 정도를 별도 confidence처럼 섞지 않는다. Cosine 비교에 필요한 방향만 남기는 선택이며, 모든 CLIP 구현이 반드시 이 순서를 쓴다는 뜻은 아니다. Holdout에서 wording 민감도가 실제로 줄었는지 검증해야 한다."
          symbols={[["c_k", 'k번째 class의 normalized prototype'], ["T", '사용한 prompt template 수'], ["p_t(k)", 'class k를 t번째 문장 틀에 넣은 text'], ["f_{text}", 'CLIP text encoder'], [String.raw`\operatorname{norm}`, 'L2 길이를 1로 만드는 정규화']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Inference에서는 새 image vector와 모든 class prototype의 similarity를 비교한다. 그러나 similarity softmax가 실제 확률로 calibration됐다고 가정하면 안 된다. Unknown class, 여러 결함이 같이 있는 image, domain shift와 class prior가 달라지면 threshold가 흔들린다.</p>
          <p>공정 label이 40개라면 class별 confusion, near-synonym, 정상 hard negative와 unseen lighting holdout을 만든다. Prompt template와 tokenizer, class order를 config로 version한다. 사람이 문구를 조금 다듬었다는 이유로 production score 의미가 바뀔 수 있기 때문이다.</p>
        </div>
      </section>

      <section id="image-rag" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Image retrieval은 false neighbor를 드러내야 한다</h2>
        <RetrievalFailureLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Image RAG에서는 query image 또는 text를 vector로 만들고 nearest-neighbor index에서 Top-K를 찾는다. 결과에는 image ID만 넣지 않고 source URI, crop coordinates, lot·camera·timestamp, encoder revision과 similarity를 함께 보존한다.</p>
          <p><strong>Precision@K</strong>에서 K는 사용자가 확인할 상위 결과 개수이고, <strong>mean reciprocal rank</strong>는 query마다 첫 정답 순위의 역수를 평균한다. 여기에 현장 판정자 만족도와 <strong>false neighbor taxonomy</strong>를 붙인다. Texture는 비슷하지만 원인과 조치가 다른 사례가 실제 의사결정을 가장 크게 망칠 수 있기 때문이다.</p>
          <p>Text와 image 검색을 같은 index에 넣더라도 query type별 metric을 나눈다. English prompt가 좋은 결과를 낸다고 Korean terminology가 같은 neighborhood를 만든다는 보장은 없다.</p>
        </div>
      </section>

      <section id="limits" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Global alignment가 box·mask를 대신하지 않는다</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['CLIP', 'Text interface와 global image-text similarity가 필요할 때 기준점. Zero-shot class와 retrieval을 먼저 검증한다.'],
            ['SigLIP', 'Pairwise sigmoid objective의 image-text encoder 대안. Batch negative 구성과 scale 조건을 바꿔 비교한다.'],
            ['DINOv2', 'Text interface 없이 self-supervised visual neighborhood가 필요할 때 비교한다. Texture·shape·patch quality를 별도 평가한다.'],
            ['Domain encoder', '병리·위성·산업 defect처럼 일반 web pair와 분포가 먼 경우 도메인 pretraining/fine-tuning 후보를 둔다.'],
            ['Grounding detector', '문장이 가리키는 region box가 필요하면 CLIP global score가 아니라 Grounding DINO 같은 localization 계약을 쓴다.'],
            ['Promptable segmenter', 'Box보다 정확한 pixel boundary가 필요하면 detector box나 prompt를 SAM 계열 mask로 넘긴다.'],
          ].map(([title, body]) => <div key={title} className="grid gap-2 py-4 sm:grid-cols-[10rem_minmax(0,1fr)]"><p className="text-sm font-bold">{title}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Region box가 필요하면 <InternalLink slug="object-detection-systems">객체 탐지 시스템 글</InternalLink>로, mask와 video identity가 필요하면 <InternalLink slug="vision-promptable-segmentation-tracking">SAM 3.1 글</InternalLink>로 올라간다. Image token과 encoder 구조가 막히면 <InternalLink slug="vision-transformer">Vision Transformer</InternalLink>를 연다.</p>
        </div>
      </section>

      <section id="release" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Release는 평균 top-1이 아니라 사용 실패를 닫는다</h2>
        <QuestionLead
          question="새 encoder가 평균 top-1은 3% 올렸지만 ‘scratch↔연마 무늬’ false neighbor가 두 배가 됐다. 검색 시스템을 교체해도 될까?"
          answer="현장 사용에서 그 두 원인이 다른 조치를 요구한다면 교체하면 안 된다. Alignment benchmark, prompt calibration, critical retrieval slice와 source provenance가 모두 통과해야 한다. 평균 score가 critical false neighbor를 상쇄하지 못한다."
        />
        <Formula
          latex={String.raw`\begin{aligned}\operatorname{release}&=\underbrace{G_{align}}_{\text{image-text 정렬}}\land\underbrace{G_{cal}}_{\text{prompt·threshold 검증}}\\&\quad\land\underbrace{G_{retr}}_{\text{중요 false-neighbor slice}}\land\underbrace{G_{src}}_{\text{원본·모델 provenance}}\end{aligned}`}
          meaning="이 식은 CLIP 계열 encoder를 바꿀 때 정렬, prompt calibration, 실제 검색 실패와 source trace를 모두 통과해야 한다는 fail-closed 조건이다. 한 평균 metric으로 critical retrieval 오류를 숨기지 않는다."
          symbols={[[String.raw`\operatorname{release}`, '네 검증 gate가 모두 참일 때만 내리는 배포 결정'], ["G_{align}", '고정 split의 zero-shot·pair retrieval gate'], ["G_{cal}", 'template·언어·unknown threshold gate'], ["G_{retr}", 'domain false-neighbor와 reviewer gate'], ["G_{src}", 'image crop·encoder·preprocess revision gate']]}
        />
        <CapabilityCheck items={[
          'CLIP이 caption generator가 아니라 dual-encoder alignment model임을 설명한다.',
          'Batch similarity matrix에서 diagonal positive와 in-batch negative를 구분한다.',
          'L2 normalization, learned scale과 symmetric contrastive loss의 역할을 설명한다.',
          '여러 prompt template로 class prototype을 만들고 holdout에서 calibration한다.',
          'Global similarity, region grounding과 promptable mask를 구분한다.',
          'P@K, MRR, false neighbor와 reviewer slice로 Image RAG를 평가한다.',
          'Model·tokenizer·preprocess·prompt set·source crop을 version한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'CLIP paper', href: 'https://arxiv.org/abs/2103.00020', note: 'Natural-language supervision, symmetric contrastive learning과 zero-shot transfer의 1차 근거.' },
          { label: 'OpenAI CLIP repository', href: 'https://github.com/openai/CLIP', note: 'Public reference preprocessing, tokenization, model loading과 zero-shot example.' },
          { label: 'SigLIP paper', href: 'https://arxiv.org/abs/2303.15343', note: 'Pairwise sigmoid loss를 사용하는 image-text pretraining 대안.' },
          { label: 'DINOv2 paper', href: 'https://arxiv.org/abs/2304.07193', note: 'Text alignment과 다른 self-supervised visual feature 비교 후보.' },
          { label: 'Grounding DINO paper', href: 'https://arxiv.org/abs/2303.05499', note: 'Global alignment에 region query와 localization을 추가하는 open-set detector의 기준점.' },
        ]} />
      </section>
    </>
  );
}
