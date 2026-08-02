import { useState } from 'react';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';

type Goal = 'retrieval' | 'multilingual' | 'dense' | 'self-supervised';

const choices: Record<Goal, {
  label: string;
  output: string;
  start: string;
  reason: string;
  verify: string[];
}> = {
  retrieval: {
    label: '검색 · 분류',
    output: '이미지 전체를 나타내는 normalized vector',
    start: 'SigLIP 2 또는 CLIP 기준선',
    reason: '문장과 이미지 전체를 같은 방향 좌표에서 비교하는 계약이 먼저 필요하다.',
    verify: ['held-out image-text recall', 'prompt paraphrase 안정성', 'embedding latency와 index 비용'],
  },
  multilingual: {
    label: '다국어 의미',
    output: '언어가 달라도 같은 시각 개념에 가까운 vector',
    start: 'SigLIP 2 multilingual checkpoint',
    reason: '다국어 mixture와 de-biasing을 포함한 공개 recipe가 현재 요구에 직접 맞는다.',
    verify: ['언어별 recall', '번역문과 원문 간 격차', '지역·집단별 slice'],
  },
  dense: {
    label: '검출 · 추적 · 깊이',
    output: '위치가 보존된 patch 또는 feature-map tensor',
    start: 'PE intermediate layer 또는 DINOv3 dense feature',
    reason: '마지막 global vector보다 중간 spatial feature와 alignment head가 실제 출력 계약에 가깝다.',
    verify: ['해상도별 localization', '작은 객체·경계 slice', 'feature stride와 memory'],
  },
  'self-supervised': {
    label: '텍스트 없는 도메인',
    output: '라벨 없이 학습한 dense visual representation',
    start: 'DINOv3 계열',
    reason: '텍스트 정렬보다 도메인 이미지 자체의 반복 구조와 dense feature 보존이 우선이다.',
    verify: ['frozen linear probe', 'dense transfer', 'domain shift와 nearest-neighbor failure'],
  },
};

function EncoderDecisionLab() {
  const [goal, setGoal] = useState<Goal>('dense');
  const selected = choices[goal];

  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border" data-encoder-decision-lab>
      <header className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <p className="text-xs font-black uppercase text-muted-foreground">Task → representation contract</p>
        <p className="mt-2 text-base font-bold">모델 이름보다 downstream이 읽을 tensor를 먼저 고른다</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">추천은 논문 순위가 아니라 출력 계약을 설명하는 시작점이다. 실제 채택은 같은 split과 device에서 다시 측정한다.</p>
      </header>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <fieldset className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          <legend className="col-span-full mb-1 text-xs font-bold text-muted-foreground">현재 제품이 필요한 출력</legend>
          {(Object.entries(choices) as [Goal, (typeof choices)[Goal]][]).map(([key, value]) => (
            <button
              key={key}
              type="button"
              aria-pressed={goal === key}
              onClick={() => setGoal(key)}
              className={`min-h-11 rounded-md border px-3 py-2 text-left text-xs font-bold transition-colors ${
                goal === key ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted/40'
              }`}
            >
              {value.label}
            </button>
          ))}
        </fieldset>
        <div className="min-w-0" role="status" aria-live="polite">
          <div className="mb-5 grid grid-cols-[minmax(0,0.8fr)_1.25rem_minmax(0,1fr)_1.25rem_minmax(0,0.8fr)] items-center gap-1" aria-label="이미지에서 제품 출력까지의 데이터 흐름">
            <div className="min-w-0 border-y border-border py-3 text-center">
              <span className="block text-xs font-bold text-muted-foreground">입력</span>
              <span className="mt-1 block text-xs font-black">IMAGE</span>
            </div>
            <span aria-hidden className="text-center text-sm text-muted-foreground">→</span>
            <div className="min-w-0 border-y-2 border-emerald-600/60 py-3 text-center">
              <span className="block text-xs font-bold text-muted-foreground">선택 지점</span>
              <span className="mt-1 block text-xs font-black">LAYER · TENSOR</span>
            </div>
            <span aria-hidden className="text-center text-sm text-muted-foreground">→</span>
            <div className="min-w-0 border-y border-border py-3 text-center">
              <span className="block text-xs font-bold text-muted-foreground">소비자</span>
              <span className="mt-1 block text-xs font-black">TASK HEAD</span>
            </div>
          </div>
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
            <div className="min-w-0 bg-background p-4">
              <p className="text-xs font-bold text-muted-foreground">필요한 representation</p>
              <p className="mt-2 text-sm font-bold leading-relaxed">{selected.output}</p>
            </div>
            <div className="min-w-0 bg-background p-4">
              <p className="text-xs font-bold text-muted-foreground">첫 비교점</p>
              <p className="mt-2 text-sm font-bold leading-relaxed">{selected.start}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{selected.reason}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {selected.verify.map((item, index) => (
              <div key={item} className="min-w-0 border-t-2 border-emerald-600/60 pt-3">
                <p className="font-mono text-xs font-black text-muted-foreground">검증 {index + 1}</p>
                <p className="mt-1 text-xs leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VisionRepresentationEncodersCurrentArticle() {
  return (
    <>
      <section id="current-question" className="mb-16 scroll-mt-20">
        <div className="not-prose mb-5 flex items-end gap-4 border-b border-border pb-4">
          <span className="font-mono text-4xl font-black leading-none text-muted-foreground/45 sm:text-5xl">2025</span>
          <div className="min-w-0 pb-0.5">
            <p className="text-xs font-black uppercase text-muted-foreground">Vision representation checkpoint</p>
            <p className="mt-1 text-sm font-bold">한 encoder 순위가 아니라 필요한 출력 좌표를 고르는 현재 지도</p>
          </div>
        </div>
        <h2 className="mb-6 text-2xl font-bold">사진을 한 줄로 요약하는 것과 위치를 남기는 것은 왜 다를까?</h2>
        <BeginnerOpening
          title="이미지 전체의 뜻과 각 물체의 위치는 서로 다른 출력이다"
          description={<>이미지를 숫자로 바꾸는 모델을 <strong>encoder</strong>라고 하고, 그 숫자 표현을 representation이라고 한다. 사진 전체를 한 줄의 숫자 묶음으로 요약한 것이 global embedding이고, 사진 속 위치마다 숫자를 남긴 격자 지도가 dense feature다.</>}
          familiarScene={<>사진 앱에서 “바닷가 사진을 찾아 줘”라고 검색할 때는 사진 전체의 뜻을 요약하면 된다. 하지만 사진 속 작은 사람 모두에게 상자를 그리려면 어느 위치에 무엇이 있었는지 남아 있어야 한다. 같은 사진이라도 뒤에서 할 일이 다르면 필요한 숫자 출력도 달라진다.</>}
          steps={[
            { label: '뒤에서 할 일을 먼저 고른다', detail: '검색·분류인지 검출·추적·깊이 추정인지 구분한다.' },
            { label: '필요한 숫자 모양을 고른다', detail: '전체 vector 또는 위치가 남은 feature grid를 선택한다.' },
            { label: '같은 조건에서 비교한다', detail: '모델 이름보다 실제 데이터·장치·실패 구간에서 출력 품질을 잰다.' },
          ]}
        />
        <QuestionLead
          question="이미지 검색, 다국어 분류, 작은 객체 검출과 텍스트가 없는 산업 영상에 같은 마지막 embedding을 써도 될까?"
          answer="아니다. 검색은 global image-text direction, 검출은 spatial feature, 텍스트가 없는 도메인은 self-supervised visual structure가 먼저다. PE는 중간 layer의 표현과 별도 alignment를, SigLIP 2는 다국어 image-text 정렬을, DINOv3는 dense self-supervised feature를 강하게 만든다. 따라서 모델 이름보다 어느 layer의 어떤 tensor를 누가 읽는지 먼저 고정해야 한다."
        />
        <ConceptPrimer
          items={[
            { term: 'Global embedding', meaning: '이미지 전체를 한 vector로 압축한 표현이다.', why: '검색과 분류에는 편하지만 작은 물체의 위치는 잃을 수 있다.' },
            { term: 'Dense feature', meaning: 'patch나 pixel 위치마다 남긴 feature grid다.', why: '검출·분할·추적·깊이처럼 위치가 필요한 head가 읽는다.' },
            { term: 'Alignment', meaning: '서로 다른 표현을 downstream이 비교하거나 읽을 좌표로 옮기는 학습 단계다.', why: '좋은 내부 feature가 마지막 output에 자동으로 나타난다고 가정하지 않는다.' },
            { term: 'Frozen transfer', meaning: 'Encoder weight를 고정하고 작은 head만 학습해 표현을 평가한다.', why: '전체 fine-tuning 성능과 representation 자체의 재사용성을 분리한다.' },
          ]}
        />
        <EncoderDecisionLab />
      </section>

      <section id="shared-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">세 모델을 같은 좌표계에서 비교하는 최소 계약</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Encoder <M>{String.raw`f_\theta`}</M>는 image <M>x</M>를 하나의 값으로 바꾸지 않는다. Global token, intermediate patch grid,
            여러 resolution의 feature map 중 어느 것을 꺼내는지가 output의 일부다. 그 뒤 projection 또는 task head <M>g_\phi</M>가 검색, 분류,
            검출과 분할에 필요한 좌표로 옮긴다.
          </p>
        </div>
        <M display>{String.raw`
          \underbrace{z^{(\ell)}}_{\text{선택한 층의 표현}}
          =
          \underbrace{f_\theta^{(\ell)}(x)}_{\text{이미지를 층 }\ell\text{까지 계산}},
          \qquad
          \underbrace{\hat y}_{\text{제품이 쓰는 출력}}
          =
          \underbrace{g_\phi\!\left(z^{(\ell)}\right)}_{\text{정렬 또는 task head}}
        `}</M>
        <FormulaNote
          meaning="왜 layer와 head를 식에 함께 쓰나: 같은 checkpoint도 마지막 global vector와 중간 dense feature가 다른 정보를 보존하며, downstream head가 그 표현을 다시 바꾸기 때문이다. 논문의 encoder 점수를 제품 성능으로 옮기려면 layer, preprocessing, head, resolution과 split을 함께 고정해야 한다."
          symbols={[
            [String.raw`f_\theta^{(\ell)}`, 'Image를 선택한 layer ℓ의 representation으로 바꾸는 encoder'],
            [String.raw`z^{(\ell)}`, 'Global vector 또는 위치가 남은 dense tensor'],
            [String.raw`g_\phi`, 'Language·spatial alignment 또는 downstream task head'],
            [String.raw`\hat y`, '검색 score, class, box, mask, depth 등 실제 소비자가 쓰는 출력'],
          ]}
        />
      </section>

      <section id="pe" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">PE: 가장 좋은 표현이 마지막 layer에 없을 수 있다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Perception Encoder는 contrastive vision-language training으로 image·video encoder를 키우되, downstream에 가장 유용한 feature가 network
            output이 아니라 <strong>intermediate layer</strong>에 숨어 있을 수 있음을 전면에 둔다. Language modeling에는 language alignment,
            detection·tracking·depth에는 spatial alignment를 붙인다. “중간 feature가 좋다”와 “아무 layer나 꺼내면 된다”는 같은 말이 아니다.
          </p>
          <p>
            구현에서는 후보 layer마다 feature shape, frozen transfer와 latency를 측정한다. 최종 layer 하나만 비교하면 objective가 압축한 정보를
            encoder 전체의 한계로 오판할 수 있다. 반대로 downstream별 alignment를 크게 학습하면 encoder 자체보다 head capacity가 성능을 만든 것일 수 있다.
          </p>
        </div>
      </section>

      <section id="siglip2" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">SigLIP 2: 다국어 global 정렬과 dense transfer를 함께 넓힌다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            SigLIP 2는 image-text pair를 같은 batch의 단일 softmax 경쟁으로만 보지 않고 pair별 sigmoid objective를 사용한 계열 위에 captioning,
            self-distillation, masked prediction과 online data curation을 결합한다. 여러 크기와 native aspect ratio variant가 있으므로 이름이 같아도
            input contract와 비용은 checkpoint마다 다르다.
          </p>
        </div>
        <M display>{String.raw`
          \begin{aligned}
          \underbrace{s_{ij}}_{\text{image-text 쌍 점수}}
          &=\tau\,u_i^\top v_j+b\\
          \underbrace{\mathcal L_{\mathrm{pair}}}_{\text{batch의 pair 손실}}
          &=-\frac{1}{B^2}\sum_{i=1}^{B}\sum_{j=1}^{B}
          \underbrace{\log \sigma(y_{ij}s_{ij})}_{\text{양성은 올리고 음성은 내림}}
          \end{aligned}
        `}</M>
        <FormulaNote
          meaning="왜 pair마다 sigmoid를 쓰나: 한 batch의 각 image-text 관계를 독립적인 양성·음성 판정으로 학습하기 위해서다. 이 식만으로 SigLIP 2의 개선이 모두 설명되지는 않는다. Captioning, self-supervised loss, data curation과 resolution recipe도 함께 바뀌므로 ablation과 checkpoint card를 같이 읽어야 한다."
          symbols={[
            [String.raw`u_i,v_j`, '정규화된 image i와 text j embedding'],
            [String.raw`s_{ij}`, 'Scale과 bias를 적용한 image i와 text j의 pair score'],
            [String.raw`y_{ij}\in\{-1,+1\}`, '짝이 맞으면 +1, 아니면 -1인 label'],
            [String.raw`\tau,b`, 'Similarity scale과 bias'],
            [String.raw`B^2`, 'Batch 안에서 비교하는 모든 image-text pair 수'],
          ]}
        />
      </section>

      <section id="dinov3" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">DINOv3: 텍스트 없이 dense feature가 오래 무너지지 않게 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            DINOv3는 self-supervised image training을 크게 확장하면서 긴 학습에서 dense feature map의 품질이 악화되는 문제를 <strong>Gram anchoring</strong>으로
            다룬다. 검색 문장과 바로 cosine similarity를 계산하는 모델이 아니라, dense visual task에 재사용할 representation을 먼저 만드는 분기다.
          </p>
          <p>
            따라서 “CLIP보다 좋다”처럼 한 줄로 순위를 만들지 않는다. Text query가 필수라면 별도 text alignment가 필요하고, 산업 영상처럼 language label이
            빈약하다면 self-supervised dense transfer가 더 직접적인 기준이 된다. 해상도, feature layer와 task head를 고정한 뒤 비교해야 한다.
          </p>
        </div>
        <Misconception>
          Foundation encoder의 평균 benchmark 1위는 모든 제품의 backbone 1위가 아니다. Global retrieval, multilingual prompt, dense localization과
          domain-specific frozen transfer는 서로 다른 output·data·cost 계약이다.
        </Misconception>
      </section>

      <section id="release" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">채택은 이름이 아니라 layer·head·split 영수증으로 닫는다</h2>
        <CapabilityCheck
          items={[
            '제품 소비자가 global vector와 dense tensor 중 무엇을 읽는지 shape와 좌표로 쓴다.',
            '동일 preprocessing·resolution·head capacity·split에서 encoder 후보를 비교한다.',
            '평균 score 외에 작은 객체, 언어, 조명, domain과 latency slice를 따로 기록한다.',
            '공개 checkpoint·license·commit과 실제로 꺼낸 layer 이름을 artifact manifest에 남긴다.',
            'PE·SigLIP 2·DINOv3를 한 계보로 직렬 선행하지 않고 현재 output에 필요한 분기 하나만 고른다.',
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>막힐 때만 내려갈 바닥</h3>
          <p>
            Image-text similarity 계산이 막히면 <InternalLink slug="clip-vision-language-model" learningPathId="ai-vision-language-alignment-foundation">CLIP</InternalLink>, patch sequence와 attention 비용이 막히면
            <InternalLink slug="vision-transformer" learningPathId="ai-vision-patch-backbone-foundation">Vision Transformer</InternalLink>, local feature·stride가 막히면 <InternalLink slug="cnn" learningPathId="ai-vision-conv-backbone-foundation">CNN</InternalLink>으로
            내려간다. ViT와 ResNet을 서로의 필수 선수로 읽지 않는다.
          </p>
        </div>
        <StopRule>
          현재 최소 바닥은 CLIP의 image-text alignment와 선택한 backbone 계산에서 멈춘다. 모든 representation 논문과 모든 CNN 계보를 선행하지 않는다.
          새 encoder가 올라오면 output schema, 공개 artifact, 같은 조건의 transfer와 실패 slice가 실제 선택을 바꾸는지부터 본다.
        </StopRule>
        <SourceNotes
          sources={[
            { label: 'Perception Encoder (2025)', href: 'https://arxiv.org/abs/2504.13181', note: 'Intermediate feature, language·spatial alignment와 공개 code/model 범위를 확인한 1차 출처.' },
            { label: 'SigLIP 2 (2025)', href: 'https://arxiv.org/abs/2502.14786', note: 'Multilingual mixture, sigmoid 계열 recipe, dense localization과 native-resolution variant의 1차 출처.' },
            { label: 'DINOv3 (2025)', href: 'https://arxiv.org/abs/2508.10104', note: 'Self-supervised scaling, Gram anchoring과 dense feature transfer 범위의 1차 출처.' },
            { label: 'CLIP (2021)', href: 'https://arxiv.org/abs/2103.00020', note: 'Image-text global alignment의 최소 공개 기준점.' },
          ]}
        />
      </section>
    </>
  );
}
