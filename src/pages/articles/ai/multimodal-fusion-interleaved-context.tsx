import FormulaNote from '@/components/ui/formula-note';
import Math from '@/components/ui/math';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  SpecialistEntry,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { FusionTopologyLab, InterleavedSequenceLab, PositionCoordinateLab, VisualTokenBudgetLab } from './multimodal-foundation/viz/FusionLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <Math display className="my-0 text-[13px] sm:text-base">{latex}</Math>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

export default function MultimodalFusionInterleavedContextArticle() {
  return (
    <>
      <SpecialistEntry
        title="Image와 text가 같은 context에서 만나는 위치를 추적하는 글"
        description="Image 한 장이 visual token 여러 개로 바뀐 뒤 projector, resampler와 attention을 통과하는 경로를 다룬다. 멀티모달의 목적과 visual token의 출발점이 낯설다면 아래 두 글을 먼저 읽는다."
        prerequisites={[
          'Image가 patch feature 또는 visual token sequence로 바뀐다는 뜻을 안다.',
          'Transformer context가 순서가 있는 token 묶음이라는 점을 안다.',
          'Projector가 서로 다른 vector 폭을 맞추는 작은 변환이라는 점을 안다.',
        ]}
        links={[
          { slug: 'multimodal-foundation-models-current', title: '멀티모달 모델의 전체 흐름', reason: '이해, 생성과 interleaved input이 왜 필요한지 먼저 본다.' },
          { slug: 'multimodal-visual-tokenization', title: '시각 tokenization', reason: 'Pixel이 patch와 discrete code로 바뀌는 두 경로를 구분한다.' },
          { slug: 'transformer-architecture', title: 'Transformer architecture', reason: 'Sequence와 attention이 visual token을 읽는 계산 기반을 잡는다.' },
        ]}
      />
      <section id="entry-pipeline" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Image는 한 번에 transformer로 들어가지 않는다</h2>
        <QuestionLead
          question="896×896 image 한 장을 넣으면 context에는 token 하나가 추가될까?"
          answer="아니다. 일반적인 vision path는 image를 작은 patch grid로 나누고, 각 patch를 feature로 바꾼 뒤 projector와 optional merge·resampler를 거쳐 수백~수천 visual token을 만든다. 이 token이 text와 같은 sequence budget을 쓴다."
        />
        <ConceptPrimer items={[
          { term: 'Patch', meaning: 'Image를 일정한 높이·너비의 작은 격자로 나눈 단위다.', why: '2D image를 transformer가 다룰 sequence item으로 바꾼다.' },
          { term: 'Projector', meaning: 'Vision feature의 폭을 language model hidden width에 맞추는 layer다.', why: '서로 다른 encoder 좌표를 같은 residual stream에서 읽게 한다.' },
          { term: 'Resampler', meaning: '가변 개수 visual feature를 더 적거나 고정된 수로 요약하는 모듈이다.', why: '고해상도 입력의 context 비용에 상한을 만들지만 세부 정보를 압축한다.' },
          { term: 'Interleaving', meaning: 'Text와 image·audio token을 실제 대화 순서대로 같은 sequence에 섞는 방식이다.', why: '“첫 image”, “그 뒤 지시”, “두 번째 image”의 관계를 순서로 보존한다.' },
        ]} />
        <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4" data-viz-canvas>
          {[
            ['01', 'Raw input', 'Pixel · waveform'],
            ['02', 'Feature', 'Encoder 또는 direct patch projection'],
            ['03', 'Width 맞춤', 'Projector · merge · resampler'],
            ['04', 'Shared sequence', 'Text 사이 visual embedding'],
          ].map(([order, title, body]) => (
            <div key={order} className="min-w-0 bg-background p-4">
              <p className="font-mono text-[12px] font-bold text-muted-foreground">{order}</p>
              <p className="mt-2 text-sm font-bold">{title}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{V}_{\text{vision feature}}&\in\mathbb R^{B\times N_v\times D_v}\\\underbrace{V_p}_{\text{projector 출력}}&=\underbrace{VP}_{D_v\to D_{\mathrm{lm}}}\in\mathbb R^{B\times N_v\times D_{\mathrm{lm}}}\\\underbrace{V_r}_{\text{optional resampler}}&\in\mathbb R^{B\times K\times D_{\mathrm{lm}}}\end{aligned}`}
          meaning="Vision encoder는 B장의 image를 N_v개 feature로 만들지만 그 폭 D_v는 language model 폭과 다를 수 있다. Projector P는 token 수를 바꾸지 않고 마지막 feature 축만 D_lm으로 맞춘다. Optional resampler가 있을 때만 N_v 자리가 K개 요약 자리로 바뀐다."
          symbols={[
            [String.raw`B`, 'Batch size'],
            [String.raw`N_v,D_v`, 'Vision feature의 token 수와 폭'],
            [String.raw`P`, 'D_v를 D_lm으로 바꾸는 projection matrix'],
            [String.raw`K`, 'Resampler가 내보내는 고정 또는 축소 token 수'],
            [String.raw`D_{\mathrm{lm}}`, 'Language backbone의 hidden width'],
          ]}
        />
        <QuestionLead
          question="[B,576,1024] ViT feature를 1024→4096 projector에 넣으면 output shape은 무엇이며, context가 576자리 늘었다고 바로 말할 수 있을까?"
          answer="Projector output은 [B,576,4096]이다. 마지막 feature 폭만 바뀌고 token 수는 그대로다. 하지만 context가 576자리 늘어나는지는 fusion topology에 달려 있다. Early interleaving이면 text sequence에 576자리가 추가되고, cross-attention이면 text 길이는 유지한 채 별도 visual K/V memory 576자리를 읽는다."
        />
        <Misconception>Gemma 4 12B처럼 전용 vision encoder가 없더라도 raw pixel 하나가 바로 LLM token 하나가 되는 것은 아니다. Patch 분해, projection, position과 attention 계산은 남는다.</Misconception>
      </section>

      <section id="token-ledger" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2D grid를 visual token 장부로 바꾼다</h2>
        <Formula
          latex={String.raw`\begin{aligned}
            \underbrace{N_h}_{\text{세로 patch 수}}&=\left\lceil\frac{H}{P_h}\right\rceil\\
            \underbrace{N_w}_{\text{가로 patch 수}}&=\left\lceil\frac{W}{P_w}\right\rceil\\
            \underbrace{N_{\mathrm{patch}}}_{\text{전체 patch 수}}&=N_hN_w
          \end{aligned}`}
          meaning="Image의 세로와 가로를 patch 크기로 각각 나눈 뒤 두 축의 개수를 곱한다. 2D 격자의 모든 위치가 하나씩 sequence item이 되기 때문에 더하기가 아니라 곱셈을 쓴다. 나누어떨어지지 않는 가장자리 patch도 포함하려고 올림한다."
          symbols={[
            [String.raw`H,W`, '입력 image의 pixel 높이와 너비'],
            [String.raw`P_h,P_w`, 'Patch 하나의 pixel 높이와 너비'],
            [String.raw`\lceil\cdot\rceil`, '남은 가장자리도 patch 하나로 포함하는 올림'],
            [String.raw`N_hN_w`, '세로 각 위치와 가로 각 위치의 모든 조합 수'],
          ]}
        />
        <Formula
          latex={String.raw`\underbrace{N_{\mathrm{vis}}=\left\lceil\frac{N_h}{m_h}\right\rceil\left\lceil\frac{N_w}{m_w}\right\rceil}_{\text{spatial merge 뒤 visual token 수}}`}
          meaning="Spatial merge는 이웃 patch를 세로 m_h개, 가로 m_w개씩 묶는다. 각 축에서 남는 그룹 수를 따로 구한 뒤 모든 2D 그룹 조합을 곱한다. 이 계산은 token 수를 줄이지만 작은 글자와 경계가 같은 그룹 안에서 섞일 수 있다."
          symbols={[
            [String.raw`m_h,m_w`, '한 visual token으로 묶는 세로·가로 patch 개수'],
            [String.raw`N_{\mathrm{vis}}`, 'Transformer sequence에 실제로 넣는 visual token 수'],
            ['곱셈', '세로 그룹마다 모든 가로 그룹이 하나씩 존재하기 때문에 사용'],
          ]}
        />
        <VisualTokenBudgetLab />
      </section>

      <section id="fusion-topology" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Early fusion과 cross-attention은 같은 context 식을 쓰지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Early interleaving</strong>은 projected visual vector를 text token과 같은 residual stream에 넣는다. 따라서 visual token 수가 self-attention sequence 길이에 직접 더해진다. <strong>Cross-attention</strong>은 text query stream과 visual key/value memory를 분리한다. Text context 자리는 늘지 않지만 vision encoder output, visual K/V 저장과 text-to-vision attention 비용은 남는다.</p>
          <p><strong>Fixed-query resampler</strong>는 topology와 압축을 함께 바꾸는 선택이다. 576개 feature를 64개 query로 요약해 prefix로 넣으면 self-attention 길이를 줄일 수 있지만, 작은 글자나 정확한 patch 위치가 64개 vector 안에 압축된다. “Context를 덜 쓴다”와 “시각 계산이 공짜다”는 같은 말이 아니다.</p>
        </div>
        <FusionTopologyLab />
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{S_{\mathrm{early}}}_{\text{공유 self-attention 길이}}&=\underbrace{N_t+N_v}_{\text{text와 visual 자리 합}}\\\underbrace{S_{\mathrm{cross}}}_{\text{text self-attention 길이}}&=\underbrace{N_t}_{\text{text 자리만}}\\\underbrace{M_{\mathrm{cross}}}_{\text{별도 visual memory}}&=\underbrace{N_v}_{\text{visual K/V 자리}}\end{aligned}`}
          meaning="Early fusion은 text와 visual vector가 같은 sequence를 만들기 때문에 길이를 더한다. Cross-attention은 text self-attention 길이와 visual memory 길이를 분리해 기록한다. Visual token이 text context에서 빠졌다고 해서 N_v에 비례하는 memory·cross-attention 연산까지 사라지는 것은 아니다."
          symbols={[
            [String.raw`N_t,N_v`, 'Text token 수와 projected visual token 수'],
            [String.raw`S_{\mathrm{early}}`, 'Early-fusion self-attention sequence 길이'],
            [String.raw`S_{\mathrm{cross}}`, 'Cross-attention 구조의 text sequence 길이'],
            [String.raw`M_{\mathrm{cross}}`, 'Text query가 읽는 별도 visual K/V memory 길이'],
          ]}
        />
      </section>

      <section id="interleaved-sequence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">결합은 순서를 보존하고 budget을 공유한다</h2>
        <Formula
          latex={String.raw`\begin{aligned}
            \underbrace{X}_{\text{backbone 입력}}=\big[&
            \underbrace{E_t(t_1),\ldots}_{\text{text embedding}},
            \underbrace{P_vF_v(I_1)}_{\text{첫 image}},\\
            &\underbrace{E_t(t_k),\ldots}_{\text{사이 지시}},
            \underbrace{P_vF_v(I_2)}_{\text{둘째 image}}\big]
          \end{aligned}`}
          meaning="Text token은 text embedding E_t로, image는 visual feature F_v와 projector P_v를 거쳐 같은 hidden width의 vector가 된다. 대괄호는 단순한 목록이 아니라 attention이 보는 실제 순서를 뜻한다. Image를 모두 앞에 모으지 않고 언급된 위치에 넣어 지시와 image의 상대 순서를 보존한다."
          symbols={[
            [String.raw`E_t`, 'Text token ID를 model hidden vector로 바꾸는 embedding'],
            [String.raw`F_v`, 'Image를 visual feature sequence로 바꾸는 encoder 또는 patch path'],
            [String.raw`P_v`, 'Visual feature 폭을 language hidden width에 맞추는 projection'],
            [String.raw`X`, 'Text와 visual vector가 interleaved된 최종 input sequence'],
          ]}
        />
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{N_{\mathrm{ctx}}}_{\text{early-fusion 전체 길이}}&=\underbrace{N_{\mathrm{text}}}_{\text{text}}+\underbrace{\sum_iN_{\mathrm{vis},i}}_{\text{모든 image}}\\&\quad+\underbrace{\sum_jN_{\mathrm{aud},j}}_{\text{모든 audio}}\end{aligned}`}
          meaning="이 합산식은 각 modality가 같은 self-attention sequence window를 쓰는 early-fusion·interleaving 구조에 적용한다. 합 기호는 image와 audio가 여러 개일 수 있기 때문에 사용한다. Cross-attention 구조에서는 text length와 modality별 K/V memory를 별도 장부로 기록한다."
          symbols={[
            [String.raw`N_{\mathrm{text}}`, 'System prompt, 대화와 생성 전 text token 수'],
            [String.raw`N_{\mathrm{vis},i}`, 'i번째 image가 만든 visual token 수'],
            [String.raw`N_{\mathrm{aud},j}`, 'j번째 audio segment가 만든 token 수'],
            [String.raw`N_{\mathrm{ctx}}`, 'Early-fusion backbone이 한 sequence로 처리하는 총 길이'],
          ]}
        />
        <InterleavedSequenceLab />
      </section>

      <section id="position-and-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 sequence index라도 위치의 뜻은 다르다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Text는 보통 앞뒤 순서 하나로 충분하다. Image patch에는 높이와 너비가 있고, video patch에는 시간까지 있다. 이 좌표를 모두 하나의 증가하는 숫자로만 압축하면 서로 다른 frame의 같은 위치와 같은 frame의 다른 위치를 구분하기 어려워질 수 있다.</p>
          <p>Qwen3-VL의 Interleaved-MRoPE는 rotary position의 주파수 채널을 시간·높이·너비 좌표에 배분한다. DeepStack은 ViT 마지막 층 하나만 쓰지 않고 여러 깊이의 feature를 language model 여러 층에 결합해 세부와 의미를 함께 전달하려 한다. 이 두 설계는 같은 문제가 아니다. 하나는 <strong>어디에 있는가</strong>, 다른 하나는 <strong>어느 수준의 visual feature를 전달하는가</strong>를 다룬다.</p>
          <p>Llama 4 early fusion은 visual token을 text backbone에서 함께 학습하는 경계다. Gemma 4 12B Unified는 dedicated encoder를 없애고 raw input projection 책임을 decoder 쪽으로 옮긴 비교점이다. 어떤 방식이 항상 낫다고 말할 수 없다. 동일한 input resolution, token budget, latency와 task accuracy를 함께 측정해야 한다.</p>
        </div>
        <PositionCoordinateLab />
        <StopRule>
          이제 image가 몇 token이 되고 어디에 놓이는지 계산할 수 있다면 fusion 경로는 끝이다.
          Image를 다시 생성해야 할 때는 <InternalLink slug="multimodal-visual-tokenization">시각 tokenization</InternalLink>으로,
          video의 시간 token이 context를 빠르게 소모하는 문제가 남았다면 <InternalLink slug="video-long-context-memory">긴 비디오의 context와 memory</InternalLink>로 이동한다.
        </StopRule>
        <CapabilityCheck items={[
          'Image 크기, patch와 spatial merge에서 visual token 수를 계산한다.',
          'Fixed resampler가 context 상한과 detail 손실을 동시에 만드는 이유를 설명한다.',
          'Projector는 feature 폭을, resampler는 token 축을 바꾼다는 차이를 shape으로 추적한다.',
          'Early fusion의 self-attention 길이와 cross-attention의 visual K/V 장부를 구분한다.',
          'Text·image·audio가 같은 context budget을 더해 쓰는 조건을 명시한다.',
          'Early fusion, direct projection, resampling과 spatiotemporal position을 서로 다른 축으로 구분한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Gemma 4 Technical Report', href: 'https://arxiv.org/abs/2607.02770', note: '12B Unified의 encoder-free raw image·audio path와 family architecture의 1차 연구 근거.' },
          { label: 'Gemma 4 model card', href: 'https://ai.google.dev/gemma/docs/core/model_card_4', note: '12B Unified의 encoder-free direct projection과 다른 family variant의 dedicated encoder 경계.' },
          { label: 'Llama 4 official release', href: 'https://ai.meta.com/blog/llama-4-multimodal-intelligence/', note: 'MetaCLIP 기반 vision encoder와 visual·text token early fusion의 공식 설명.' },
          { label: 'Qwen3-VL paper', href: 'https://arxiv.org/abs/2511.21631', note: 'DeepStack, Interleaved-MRoPE, timestamp alignment와 long multimodal context의 논문 근거.' },
          { label: 'Vision Transformer', href: 'https://arxiv.org/abs/2010.11929', note: 'Image를 fixed-size patch sequence로 바꾸는 최소 기준점.' },
        ]} />
      </section>
    </>
  );
}
