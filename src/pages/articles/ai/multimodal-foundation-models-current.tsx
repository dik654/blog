import FormulaNote from '@/components/ui/formula-note';
import Math from '@/components/ui/math';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  ModalityContractLab,
  MultimodalBudgetEvidenceLab,
  MultimodalRouteChooser,
} from './multimodal-foundation/viz/ContractLabs';

function Formula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: Array<[string, string]>;
}) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <Math display className="my-0 text-[13px] sm:text-base">{latex}</Math>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

const modelStories = [
  {
    marker: 'CURRENT · 2026-07',
    title: 'Gemma 4는 같은 family 안에서도 입력 경계가 다르다',
    body: 'E2B·E4B·31B·MoE variant는 별도 encoder를 사용하지만 12B Unified는 image patch와 audio waveform을 가벼운 projection으로 decoder hidden space에 넣는다. 여기서 encoder-free는 modality 전처리와 token 계산이 없다는 뜻이 아니다. 복잡한 전용 encoder를 없애고 shared decoder가 더 많은 표현 책임을 맡았다는 뜻이다.',
    boundary: '공식 model card는 text output을 명시한다. “Unified”라는 이름만 보고 image·audio를 생성한다고 확대하지 않는다.',
  },
  {
    marker: 'EARLY FUSION · 2025-04',
    title: 'Llama 4는 vision encoder를 유지하면서 text와 일찍 합친다',
    body: 'Meta는 MetaCLIP 기반 vision encoder를 frozen Llama와 별도로 적응 학습한 뒤, backbone 공동 사전학습 단계에서 visual token과 text token을 early fusion했다고 설명한다. Native multimodality는 encoder-free나 모든 구성 요소를 처음부터 끝까지 한 번에 학습했다는 뜻이 아니다.',
    boundary: 'Early fusion과 encoder-free는 다른 계약이다. Video data를 함께 학습했다는 말도 곧바로 video generation을 뜻하지 않는다.',
  },
  {
    marker: 'SPATIOTEMPORAL INPUT · 2025-11',
    title: 'Qwen3-VL은 interleaving만이 아니라 위치 의미까지 다룬다',
    body: 'Image와 video는 text처럼 한 줄의 순서만 갖지 않는다. Qwen3-VL은 Vision Transformer(ViT)의 여러 층 feature를 DeepStack으로 결합하고 시간·높이·너비 좌표를 position에 반영한다. 긴 video를 받는다는 capability 뒤에는 visual token 수, timestamp alignment와 context budget이 있다.',
    boundary: 'Qwen3-VL의 이해 구조와 Qwen VLo preview의 image generation product를 한 architecture라고 추정하지 않는다.',
  },
  {
    marker: 'PRODUCT PREVIEW · 2025-06',
    title: 'Qwen VLo는 보이는 capability와 공개되지 않은 내부를 나눠 읽는다',
    body: '공식 preview에서는 text prompt와 reference image를 받아 image를 생성·편집하고, 위에서 아래·왼쪽에서 오른쪽으로 결과가 점진적으로 나타난다. 이것은 실제 product가 image를 출력한다는 강한 사용 증거다. 하지만 공개 글만으로 training objective, tensor path나 weight를 재현할 수 있다는 뜻은 아니다.',
    boundary: 'Qwen3-VL의 공개 이해 구조를 Qwen VLo 내부 architecture로 복사하지 않는다. Product evidence와 architecture evidence를 별도 칸에 기록한다.',
  },
  {
    marker: 'UNDERSTAND + GENERATE · 2025-01',
    title: 'Janus-Pro는 transformer를 공유하되 visual encoding을 나눈다',
    body: '이미지를 이해할 때는 semantic vision encoder가 유리하다. 이미지를 만들 때는 decoder가 복원할 수 있는 visual code가 필요하다. Janus는 이 충돌을 억지로 한 표현에 맡기지 않고 두 visual path를 분리한 뒤 autoregressive transformer를 공유한다.',
    boundary: 'Shared backbone, shared tokenizer, shared output head는 서로 다른 주장이다. Janus는 첫 번째만 강하게 공유한다.',
  },
  {
    marker: 'DISCRETE EVERYTHING · 2024-09',
    title: 'Emu3는 visual data도 next-token 문제로 바꾼다',
    body: 'Emu3 framework는 text·image·video를 discrete token sequence로 바꿔 decoder-only transformer의 한 next-token objective로 이해와 생성을 연결한다. 다만 framework 수준의 통합과 배포 artifact의 경계는 다르다. 공식 repository는 이해용 Emu3-Chat과 생성용 Emu3-Gen을 별도로 제공한다.',
    boundary: '“하나의 objective”가 곧 “하나의 공개 post-trained checkpoint가 모든 입출력을 수행한다”는 뜻은 아니다.',
  },
  {
    marker: 'MIXED OBJECTIVE · 2024-09',
    title: 'Transfusion은 token loss와 image-span loss를 결합한다',
    body: 'Text는 discrete token이므로 각 token 위치에서 다음 ID의 확률을 높인다. Image는 continuous patch span으로 남겨, 그 여러 patch에 걸친 image-level diffusion loss로 noise 제거 방향을 회귀한다. 한 transformer가 mixed sequence를 처리해도 두 objective의 계산 단위와 decoder는 같지 않다.',
    boundary: '논문은 구조와 실험 근거다. 공식 implementation이 공개되지 않았으므로 production runtime을 재현된 사실처럼 쓰지 않는다.',
  },
] as const;

export default function MultimodalFoundationModelsCurrentArticle() {
  return (
    <>
      <section id="contract-first" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">“멀티모달”이라는 한 단어를 먼저 해체한다</h2>
        <BeginnerOpening
          title="멀티모달 모델은 글뿐 아니라 image, video, audio 같은 여러 형식을 다루는 모델입니다."
          description={<>여러 형식을 다룬다는 말에는 서로 다른 능력이 섞여 있다. Image를 보고 글로 설명하는 것, 글을 듣고 image를 만드는 것, video와 audio를 함께 이해하는 것은 입력과 출력이 서로 다른 작업이다. 먼저 <strong className="text-foreground">무엇을 받고 무엇을 내보내는지</strong>를 나눠야 한다.</>}
          familiarScene={<>사람이 그림을 보고 “강아지가 뛴다”고 말할 수 있어도 같은 장면을 직접 그리는 능력이 자동으로 생기지는 않는다. 보는 능력에는 의미를 읽는 경로가, 그리는 능력에는 다시 pixel을 만드는 경로가 필요하기 때문이다.</>}
          steps={[
            { label: '입력과 출력을 따로 적는다', detail: 'Text·image·audio·video를 받을 수 있는지와 만들 수 있는지를 별도 칸으로 본다.' },
            { label: '내부 표현 경로를 찾는다', detail: 'Encoder, projection, tokenizer와 shared backbone이 어느 형식을 맡는지 따라간다.' },
            { label: '공개 근거의 경계를 확인한다', detail: 'Model card의 기능, 논문의 구조, 공개 code와 weight를 같은 수준의 증거로 섞지 않는다.' },
          ]}
        />
        <QuestionLead
          question="이미지를 이해하는 모델은 왜 이미지를 바로 생성하지 못할까?"
          answer="입력 modality와 출력 modality는 별도 계약이기 때문이다. Image를 의미 feature로 읽는 encoder가 있어도 pixel을 복원할 tokenizer·decoder와 생성 objective가 없다면 text만 출력한다. 먼저 모델 이름이 아니라 입력, 출력, 표현, objective와 근거를 확인한다."
        />
        <ConceptPrimer items={[
          { term: 'Modality', meaning: 'Text, image, video, audio처럼 정보가 표현되는 형식이다.', why: '입력으로 받을 수 있는 형식과 출력으로 만들 수 있는 형식을 분리한다.' },
          { term: 'Encoder', meaning: 'Raw input을 backbone이 사용할 feature로 바꾸는 앞단 모델이다.', why: '전용 encoder가 있는 모델과 patch를 직접 projection하는 모델의 계산 책임이 다르다.' },
          { term: 'Projection', meaning: '한 vector 폭을 model hidden 폭에 맞추는 learned linear transform이다.', why: '서로 다른 modality를 같은 transformer가 읽을 수 있는 좌표계로 옮긴다.' },
          { term: 'Reconstructable token', meaning: 'Decoder가 다시 image나 audio로 복원하도록 학습된 code 또는 latent다.', why: '의미 이해용 feature와 실제 생성용 표현을 구분한다.' },
          { term: 'Resampler', meaning: '많은 visual feature를 더 적고 일정한 수의 token으로 다시 모으는 learned module이다.', why: 'Image detail을 얼마나 남길지와 context·prefill 비용을 함께 결정한다.' },
          { term: 'DeepStack', meaning: 'Qwen3-VL이 Vision Transformer의 마지막 층 하나가 아니라 여러 층 feature를 language model 쪽에 결합하는 방식의 이름이다.', why: '낮은 층의 세부와 높은 층의 의미를 함께 전달하려는 입력 경계를 읽는다.' },
          { term: 'Interleaved-MRoPE', meaning: 'Qwen3-VL이 text 순서와 visual time·height·width 위치를 나누어 반영하는 position encoding 방식의 이름이다.', why: '여러 image와 긴 video에서 어느 frame·공간 위치인지 잃지 않도록 한다.' },
        ]} />
        <ModalityContractLab />
        <Misconception>“Omni”, “native”, “unified”는 표준 architecture 이름이 아니다. Model card와 code에서 입력·출력·encoder·loss를 다시 펼쳐야 한다. 이름이 같아도 한 모델은 text만 출력하고 다른 모델은 image까지 생성할 수 있다.</Misconception>
      </section>

      <section id="current-models" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">현재 모델은 하나씩 끝까지 읽는다</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {modelStories.map((story) => (
            <article key={story.title} className="grid gap-3 py-6 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
              <p className="font-mono text-[12px] font-bold text-muted-foreground">{story.marker}</p>
              <div className="min-w-0">
                <h3 className="text-base font-bold leading-snug">{story.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{story.body}</p>
                <p className="mt-4 border-l-2 border-amber-600/50 pl-3 text-xs font-semibold leading-relaxed">{story.boundary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="deployment-transfer" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">지원한다는 표시를 배포 가능한 요청으로 바꾼다</h2>
        <QuestionLead
          question="256K context가 있는 모델이라면 image 220장을 최고 detail로 한 번에 읽혀도 될까?"
          answer="입력 지원과 요청 적합성은 다른 판정이다. Gemma 4의 visual budget 예시처럼 image당 280 token이면 들어가던 요청도 1,120 token이면 context를 넘을 수 있다. 먼저 모든 modality와 답변 여유를 같은 token 장부에 더하고, 그다음 현재 주장에 필요한 근거가 공개됐는지 확인한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Visual token은 무료 첨부 파일이 아니다.</strong> Image encoder나 direct projection이 만든 token은 text와 같은 context window에 들어간다. Detail을 높이면 작은 글자와 경계를 더 남길 수 있지만, 같은 문서 묶음의 sequence 길이와 prefill 계산도 함께 늘어난다.</p>
          <p><strong>Token 수만으로 latency를 확정하지 않는다.</strong> Dedicated encoder, direct projection, attention 구현, hardware memory bandwidth와 batch가 다르면 같은 길이도 시간이 달라진다. Token 장부는 불가능한 요청을 먼저 제거하는 상한 검사다. 통과한 요청의 latency와 memory는 실제 runtime trace로 측정한다.</p>
          <p><strong>알 수 없는 값은 0으로 넣지 않는다.</strong> Product preview가 image generation을 보여 줘도 visual representation, token 수와 공개 weight가 없다면 구조 재현 예산은 계산할 수 없다. 이 경우 결과는 “저렴할 것”이 아니라 <strong>계산 보류</strong>다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
            \underbrace{N_{\mathrm{total}}}_{\text{요청 전체 길이}}
            ={}&\underbrace{N_{\mathrm{text}}}_{\text{지시와 대화}}
            +\underbrace{\sum_i N_{\mathrm{image},i}}_{\text{모든 image}}\\
            &+\underbrace{\sum_j N_{\mathrm{audio},j}}_{\text{모든 audio}}
            +\underbrace{\sum_k N_{\mathrm{video},k}}_{\text{모든 video}}
            +\underbrace{N_{\mathrm{out}}}_{\text{답변 여유}}
          \end{aligned}`}
          meaning="Backbone이 한 shared sequence로 처리하는 항목은 modality가 달라도 같은 context 한도를 쓴다. 그래서 text, 각 image·audio·video가 만든 token과 아직 생성하지 않은 답변 여유를 모두 더한다. 합 기호는 첨부가 여러 개일 수 있기 때문에 사용하며, 알 수 없는 token 수는 0이 아니라 미확정으로 남긴다."
          symbols={[
            [String.raw`N_{\mathrm{text}}`, 'System prompt, 사용자 지시와 이전 대화의 text token 수'],
            [String.raw`N_{\mathrm{image},i}`, 'i번째 image가 해당 모델의 전처리 뒤 만든 visual token 수'],
            [String.raw`N_{\mathrm{audio},j},N_{\mathrm{video},k}`, '각 audio segment와 video가 만든 sequence token 수'],
            [String.raw`N_{\mathrm{out}}`, '답변이 잘리지 않도록 미리 비워 두는 생성 위치'],
          ]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
            \underbrace{N_{\mathrm{margin}}}_{\text{남은 context}}
            &=
            \underbrace{N_{\mathrm{limit}}}_{\text{검증된 한도}}
            -
            \underbrace{N_{\mathrm{total}}}_{\text{요청 전체 길이}}\\[2pt]
            \underbrace{G_{\mathrm{release}}}_{\text{배포 후보}}
            &=
            \underbrace{\mathbf{1}[N_{\mathrm{margin}}\ge 0]}_{\text{예산 통과}}
            \\[-1pt]
            &\quad\land
            \underbrace{C_{\mathrm{I/O}}}_{\text{입출력 계약 일치}}
            \land
            \underbrace{E_{\mathrm{claim}}}_{\text{주장에 필요한 근거 확보}}
          \end{aligned}`}
          meaning="Context 한도에서 요청 길이를 빼면 여유가 양수인지 바로 판정할 수 있다. 배포 후보에는 곱셈이 아니라 논리 AND를 쓴다. 예산, 입출력 계약, 근거 중 하나라도 거짓이거나 미확정이면 전체 판정을 닫아야 하기 때문이다. 이 식은 production 승인을 자동으로 내리지 않는다. 통과 뒤에도 실제 latency, memory와 품질 trace가 필요하다."
          symbols={[
            [String.raw`N_{\mathrm{limit}}`, 'Model card나 검증된 runtime 설정에서 확인한 context 한도'],
            [String.raw`\mathbf{1}[\cdot]`, '괄호 안 조건이 참일 때만 1이 되는 판정 함수'],
            [String.raw`C_{\mathrm{I/O}}`, '요청한 입력과 출력 modality가 공개 계약에 맞는지 여부'],
            [String.raw`E_{\mathrm{claim}}`, '사용, 구조 재현, production 배포처럼 현재 하려는 주장에 필요한 증거가 있는지 여부'],
            [String.raw`\land`, '모든 gate를 동시에 만족해야 통과시키는 논리 AND'],
          ]}
        />
        <MultimodalBudgetEvidenceLab />
        <Misconception>Context 계산이 통과했다고 production latency와 품질까지 통과한 것은 아니다. 반대로 preview의 내부 token 수가 공개되지 않았다고 product capability가 거짓인 것도 아니다. 계산 가능한 주장과 관찰 가능한 주장을 각각 그 증거 수준에서 멈춘다.</Misconception>
      </section>

      <section id="six-questions" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">새 모델은 여섯 질문으로 판독한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>첫째, 입력과 출력의 modality를 각각 쓴다.</strong> Image input과 image output을 같은 체크 표시로 합치지 않는다. Gemma 4 12B Unified와 Llama 4는 대표적인 multimodal input·text output 계약이고, Janus-Pro는 text와 image output branch를 함께 가진다.</p>
          <p><strong>둘째, 입력이 backbone에 들어오는 경계를 찾는다.</strong> Dedicated vision encoder, lightweight projector, resampler와 raw patch projection은 서로 다른 계산이다. “한 모델”이라는 제품 설명만으로는 visual token이 어디서 만들어지는지 알 수 없다.</p>
          <p><strong>셋째, 표현이 무엇을 보존하는지 묻는다.</strong> Semantic feature는 object 이름과 관계를 잘 남길 수 있지만 정확한 색·texture·pixel 위치를 버릴 수 있다. Image generation은 decoder가 복원 가능한 code나 continuous latent가 필요하다.</p>
          <p><strong>넷째, 각 modality에 어떤 단위의 objective가 작동하는지 본다.</strong> Emu3와 Janus는 discrete visual code를 autoregressive하게 예측한다. Transfusion은 text token별 LM loss와 continuous image patch span 전체의 image-level diffusion loss를 결합한다.</p>
          <p><strong>다섯째, sequence와 memory 비용을 계산한다.</strong> Image 한 장은 하나의 token이 아니다. Patch·merge·resampler 뒤 수백~수천 visual token이 되어 text와 같은 context window와 prefill 계산을 사용한다.</p>
          <p><strong>여섯째, 증거의 종류를 기록한다.</strong> Product preview는 실제 사용 capability를 보여 준다. Paper는 저자의 설계와 실험을 보여 준다. Open weight와 official code는 tensor path를 확인하게 한다. 독립 재현 전에는 vendor benchmark를 일반적인 우열로 바꾸지 않는다.</p>
        </div>
        <StopRule>지금 모델이 text·image input에서 text answer만 내고, visual token budget만 계산하면 되는 상황이라면 여기서 objective·generation 역사까지 내려가지 않는다. 필요한 질문 하나만 다음 글에서 연다.</StopRule>
      </section>

      <section id="route" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">막힌 질문에 필요한 가지 하나를 연다</h2>
        <QuestionLead
          question="입력·출력 계약은 적었지만 다음에 어느 글을 읽어야 할까?"
          answer="아래 탭에서 지금 막힌 질문 하나만 고른다. 탭을 누르면 그 질문의 판단 기준과 권장 다음 글이 함께 바뀐다. 여섯 경로를 전부 읽는 목록이 아니라, 현재 막힘 하나에서 더 내려가고 멈추기 위한 분기기다."
        />
        <MultimodalRouteChooser />
        <CapabilityCheck items={[
          '처음 보는 모델의 input modality와 output modality를 따로 적는다.',
          'Early fusion, encoder-free와 shared transformer를 서로 바꾸어 말하지 않는다.',
          'Semantic feature와 reconstructable visual token 중 필요한 표현을 고른다.',
          'Text·visual token과 output reserve를 더해 context margin을 계산한다.',
          '예산 계산이 통과한 뒤 latency·memory를 실제 runtime trace로 측정해야 하는 이유를 설명한다.',
          'Model card, paper, repository와 product preview의 증거 강도를 구분한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Gemma 4 Technical Report', href: 'https://arxiv.org/abs/2607.02770', note: '2026-07-02 공개. Family architecture, 개선된 vision·audio encoder와 12B Unified encoder-free direct projection의 1차 연구 근거.' },
          { label: 'Gemma 4 model card', href: 'https://ai.google.dev/gemma/docs/core/model_card_4', note: '공개 input modality, text output, weight와 model별 사용 경계의 공식 제품 근거.' },
          { label: 'Meta · Llama 4', href: 'https://ai.meta.com/blog/llama-4-multimodal-intelligence/', note: 'MetaCLIP 기반 vision encoder와 text·vision early fusion의 공식 설명. Vendor benchmark는 독립 재현과 분리한다.' },
          { label: 'Qwen3-VL official repository', href: 'https://github.com/QwenLM/Qwen3-VL', note: 'DeepStack, Interleaved-MRoPE, timestamp alignment와 공개 inference interface의 근거.' },
          { label: 'Janus official repository', href: 'https://github.com/deepseek-ai/Janus', note: '이해·생성 visual encoding 분리, shared transformer와 두 inference path의 구현 근거.' },
          { label: 'Meta · Transfusion', href: 'https://ai.meta.com/research/publications/transfusion-predict-the-next-token-and-diffuse-images-with-one-multi-modal-model/', note: 'Text next-token과 continuous image diffusion loss를 한 transformer에 결합한 논문 근거.' },
          { label: 'Emu3 · Nature', href: 'https://www.nature.com/articles/s41586-025-10041-x', note: 'Text·image·video를 discrete token과 next-token prediction으로 통합한 peer-reviewed 연구 근거.' },
          { label: 'Qwen VLo preview', href: 'https://qwenlm.github.io/blog/qwen-vlo/', note: '생성·편집 capability와 progressive output의 product evidence. 내부 training objective는 확정하지 않는다.' },
        ]} />
      </section>
    </>
  );
}
