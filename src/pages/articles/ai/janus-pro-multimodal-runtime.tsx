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
import { ClassifierFreeGuidanceLab, JanusModuleOwnershipLab, JanusRuntimeTraceLab } from './multimodal-foundation/viz/JanusRuntimeLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div data-formula-pair className="not-prose my-7 min-w-0"><div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4"><Math display className="my-0 text-[13px] sm:text-base">{latex}</Math></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

const revision = '1daa72fa409002d40931bd7b36a9280362469ead';

export default function JanusProMultimodalRuntimeArticle() {
  return (
    <>
      <SpecialistEntry
        title="Janus 논문의 설계를 실제 tensor 경로에서 검산하는 글"
        description="이 글은 멀티모달을 처음 소개하지 않는다. 이해용 image encoder와 생성용 visual code 경로가 왜 갈라지는지 배운 뒤, official code에서 processor, aligner, transformer와 cache의 소유권을 확인한다."
        prerequisites={[
          'Image가 patch 또는 visual code의 sequence로 바뀐다는 뜻을 안다.',
          'Transformer가 text와 visual representation을 같은 hidden width에서 처리할 수 있음을 안다.',
          'Autoregressive generation과 KV cache의 기본 실행 순서를 안다.',
        ]}
        links={[
          { slug: 'paper-janus-2024', title: 'Janus 원 논문 재구성', reason: '이해와 생성의 visual encoding을 분리한 연구 질문부터 잡는다.' },
          { slug: 'multimodal-visual-tokenization', title: '시각 tokenization', reason: 'Pixel, patch, discrete code와 decoder의 역할을 먼저 구분한다.' },
          { slug: 'multimodal-unified-generation-objectives', title: '통합 생성 objective', reason: '한 backbone을 공유해도 loss와 output head가 달라질 수 있음을 배운다.' },
        ]}
      />
      <section id="runtime-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">논문 그림을 official code의 두 실행 경로로 내린다</h2>
        <QuestionLead
          question="Janus-Pro가 transformer 하나로 이해와 생성을 한다면 왜 model class에는 vision_model과 gen_vision_model이 따로 있을까?"
          answer="공유되는 것은 language transformer의 sequence reasoning이다. 이해 입력은 CLIP 계열 semantic encoder와 aligner를 거치고, image 생성 출력은 VQ code embedding·generation head·VQ decoder를 거친다. 서로 다른 정보 보존 목표를 앞뒤 모듈에서 분리한다."
        />
        <ConceptPrimer items={[
          { term: 'Processor', meaning: '대화 text, image placeholder와 pixel을 tensor·mask로 조립하는 입력 단계다.', why: 'Image feature가 들어갈 sequence 위치와 실제 pixel batch를 정확히 맞춘다.' },
          { term: 'Aligner', meaning: 'Vision feature 또는 visual code embedding을 language hidden width로 바꾸는 projector다.', why: '서로 다른 visual module의 vector를 같은 transformer가 읽게 한다.' },
          { term: 'Generation head', meaning: 'Transformer hidden을 visual code vocabulary logit으로 바꾸는 출력층이다.', why: 'Text vocabulary와 image code vocabulary를 혼동하지 않는다.' },
          { term: 'KV cache', meaning: '이미 계산한 autoregressive token의 K·V를 다음 step에서 재사용하는 state다.', why: '576 visual code를 만들 때 prompt와 이전 code를 매번 처음부터 계산하지 않는다.' },
        ]} />
        <p className="not-prose mb-4 rounded-md border border-border bg-muted/20 px-4 py-3 font-mono text-xs break-all">검산한 official repository revision · {revision}</p>
        <p className="prose prose-neutral mb-6 max-w-none dark:prose-invert">
          이 글은 architecture를 처음 소개하는 글이 아니라 설계 주장을 실행 tensor로 검산하는 글이다. 왜 visual encoding을 둘로 나눴는지 먼저 확인하려면 <InternalLink slug="paper-janus-2024">Janus 원 논문 재구성</InternalLink>으로,
          VQ code·codebook·decoder가 낯설면 <InternalLink slug="multimodal-visual-tokenization">시각 tokenization 기반</InternalLink>으로 내려간다. 두 질문에 답할 수 있다면 아래 trace에서 processor가 만든 입력과 model class의 실제 경계만 따라가면 된다.
        </p>
        <JanusModuleOwnershipLab />
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{\ell_{\mathrm{text}}}_{\text{text vocabulary logit}}&=\underbrace{W_{\mathrm{text}}h}_{\text{이해·대화 출력 head}}\\\underbrace{\ell_{\mathrm{img}}}_{\text{visual code logit}}&=\underbrace{W_{\mathrm{gen}}h}_{\text{생성 전용 head}}\end{aligned}`}
          meaning="같은 transformer hidden h를 읽더라도 이해·대화 출력은 text vocabulary head를, image 생성은 별도 visual-code vocabulary head를 사용한다. Shared transformer와 shared output head는 다른 주장이다."
          symbols={[
            [String.raw`h`, '공유 language transformer가 만든 hidden state'],
            [String.raw`W_{\mathrm{text}}`, 'Text token vocabulary로 보내는 language-model head'],
            [String.raw`W_{\mathrm{gen}}`, 'Visual code vocabulary로 보내는 generation head'],
            [String.raw`\ell_{\mathrm{text}},\ell_{\mathrm{img}}`, '서로 다른 vocabulary 위의 logits'],
          ]}
        />
        <JanusRuntimeTraceLab />
        <Misconception>`trust_remote_code=True`로 model을 불러와 demo가 실행됐다는 사실은 production serving이 검증됐다는 뜻이 아니다. Weight, CUDA memory, dependency, batching, latency와 license를 별도 release gate로 확인한다.</Misconception>
      </section>

      <section id="understanding-path" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">이해 경로: placeholder 자리를 visual embedding으로 교체한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><code>VLChatProcessor.process_one</code>은 대화 template를 tokenize하고 image placeholder를 begin token, 고정 수 image token, end token으로 확장한다. <code>batchify</code>는 <code>input_ids</code>, <code>attention_mask</code>, <code>pixel_values</code>, <code>images_seq_mask</code>와 <code>images_emb_mask</code>를 만든다.</p>
          <p><code>prepare_inputs_embeds</code>는 pixel tensor의 image 축을 batch 축과 합쳐 <code>vision_model</code>과 <code>aligner</code>를 실행한다. 그 결과를 다시 image별 sequence로 펴고, text embedding을 만든 뒤 <code>images_seq_mask</code>가 가리키는 자리에 visual embedding을 대입한다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{\sum_{b,t}\mathbf 1[M_{\mathrm{seq}}(b,t)]}_{\text{sequence의 image 자리 수}}=\underbrace{\sum_{b,n,r}\mathbf 1[M_{\mathrm{emb}}(b,n,r)]}_{\text{실제 visual embedding 수}}`}
          meaning="Sequence에서 image placeholder로 예약한 자리 수와 vision encoder가 제공하는 유효 embedding 수가 같아야 boolean 대입이 가능하다. Official code의 docstring은 이 count invariant를 예시로 명시하지만 실행 경로에 별도 assert나 비교 검사는 없다. 실제 assignment가 두 mask의 참 값 개수 일치에 의존하므로, 불일치하면 shape 대입이 실패한다."
          symbols={[
            [String.raw`M_{\mathrm{seq}}`, 'Batch×sequence에서 visual embedding으로 교체할 위치 mask'],
            [String.raw`M_{\mathrm{emb}}`, 'Batch×image×visual-token에서 실제로 사용할 feature mask'],
            [String.raw`\mathbf 1[\cdot]`, '조건이 참이면 1로 세는 indicator'],
            ['같음', 'Boolean indexing의 왼쪽 자리 수와 오른쪽 값 수가 일치해야 하기 때문'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>이후 <code>language_model.generate</code>는 이미 섞인 <code>inputs_embeds</code>와 attention mask를 받아 text answer를 만든다. Vision encoder가 answer token을 직접 만드는 것이 아니다. Shared language model이 visual embedding을 context로 읽어 text vocabulary를 생성한다.</p>
          <p>이 경로의 output head는 model에 내장된 text LM head다. <code>gen_head</code>와 VQ decoder는 image를 이해해 text를 답하는 동안 호출되지 않는다. 같은 class 안에 object가 함께 있다는 사실과 한 요청에서 모두 실행된다는 주장을 구분한다.</p>
        </div>
      </section>

      <section id="generation-path" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">생성 경로: 576개 visual code를 되먹인 뒤 한 번에 decode한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>먼저 경계를 하나 고정한다.</strong> 논문 그림의 generation encoder 또는 VQ tokenizer는 학습 target image를 정답 code ID로 바꿀 때 필요하다. Text-to-image 추론에서는 아직 target pixel이 없으므로 image를 encode하지 않는다. Prompt에서 시작해 visual code를 예측하고, 마지막에 <code>decode_code</code>만 실행한다.</p>
          <p>Official example은 prompt 뒤에 <code>image_start_tag</code>를 붙이고, sample 수가 <code>B</code>라면 token batch를 <code>[2B,L]</code>로 만든다. 각 sample의 conditional row를 짝수 index <code>2k</code>에, prompt 내용만 pad로 바꾼 unconditional row를 바로 다음 홀수 index <code>2k+1</code>에 둔다. 즉 layout은 <code>[c₀,u₀,c₁,u₁,…]</code>인 인접한 쌍이다.</p>
          <p>이 두 row를 따로 두 번 실행하는 것이 아니다. 각 visual step에서 하나의 batched language-model forward가 <code>2B</code>개 hidden을 만들고, <code>gen_head</code> 뒤의 <code>logits[0::2]</code>와 <code>logits[1::2]</code>가 conditional·unconditional logit을 다시 짝짓는다. CFG로 합친 분포에서는 sample마다 code ID 하나만 뽑는다.</p>
          <p>뽑은 ID는 conditional·unconditional 두 row에 똑같이 복제된다. <code>prepare_gen_img_embeds</code>가 <code>gen_embed</code>와 <code>gen_aligner</code>를 거쳐 두 row의 다음 input embedding을 만들기 때문에, 두 row의 generated visual-code 이력은 같고 prompt context만 다르다. 이 loop를 576번 반복한 뒤 <code>gen_vision_model.decode_code</code>가 code를 8×24×24 latent shape로 보고 384×384 RGB image로 복원한다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{\ell_{\mathrm{cfg}}}_{\text{guided visual logit}}=\underbrace{\ell_{\varnothing}}_{\text{prompt 없는 기준}}+\underbrace{w\left(\ell_c-\ell_{\varnothing}\right)}_{\text{prompt가 만든 방향을 강조}}`}
          meaning="한 번의 batched forward에서 인접한 conditional·unconditional row의 logit을 꺼낸다. Conditional logit에서 unconditional logit을 빼면 prompt 때문에 달라진 방향만 남는다. 그 차이에 weight를 곱하고 기준 logit에 더해 prompt 충실도를 높인다. 단순히 conditional logit에 weight를 곱하면 model의 공통 prior까지 함께 과장되므로 차이를 사용한다."
          symbols={[
            [String.raw`\ell_c`, 'Text prompt가 있는 conditional row의 visual vocabulary logit'],
            [String.raw`\ell_{\varnothing}`, 'Prompt 내용이 pad된 unconditional row의 logit'],
            [String.raw`w`, 'Classifier-free guidance 강도'],
            [String.raw`\ell_{\mathrm{cfg}}`, 'Softmax와 sampling에 넣는 최종 logit'],
          ]}
        />
        <ClassifierFreeGuidanceLab />
        <Misconception>여기서 “pair”는 두 generation loop를 번갈아 돌린다는 뜻이 아니다. 같은 step의 conditional·unconditional row를 하나의 <code>2B</code> batch로 함께 forward하고, guided distribution에서 뽑은 같은 code ID를 두 row 모두의 다음 입력으로 되먹인다는 뜻이다.</Misconception>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>같은 autoregressive 형식이어도 감독 위치와 head가 다르다</h3>
          <p>이해·대화 학습은 text 위치에서 text token 정답을 <code>W_text</code>로 감독하고, image generation 학습은 visual-code 위치에서 VQ code 정답을 <code>gen_head</code>로 감독한다. “둘 다 next-token loss다”라는 문장은 같은 head·같은 vocabulary·같은 data mask를 뜻하지 않는다.</p>
          <p>CFG 추론도 아무 근거 없이 생긴 trick이 아니다. Training에서 일부 condition을 drop해 unconditional branch를 학습했기 때문에 inference에서 conditional과 unconditional logit 차이를 사용할 수 있다. Repository loop는 이 실행 순서를 보여 주지만 dropout 비율의 효과, benchmark 우열, production latency까지 증명하지 않는다.</p>
        </div>
      </section>

      <section id="reproduction-gates" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">최소 재현은 image 한 장보다 tensor 영수증을 남긴다</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['01 · Artifact', 'Model ID, exact revision, model·code license, weight hash와 dependency lock을 기록한다.'],
            ['02 · Input', 'Prompt template, image resize·normalize, placeholder 수와 pixel tensor shape를 저장한다.'],
            ['03 · Understanding', 'Image token count, sequence mask count, embedding shape, text output와 fixed evaluation item을 남긴다.'],
            ['04 · Generation', 'Seed, temperature, CFG, visual token count, sampled ID shape와 decoded image shape를 남긴다.'],
            ['05 · Runtime', 'GPU model, dtype, peak VRAM, prompt prefill, visual token/s와 decode 시간을 분리한다.'],
            ['06 · Failure', 'OOM, mask mismatch, NaN, missing code, decoder artifact와 content safety failure를 유형별로 남긴다.'],
          ].map(([label, body]) => <div key={label} className="grid gap-2 py-5 sm:grid-cols-[9rem_minmax(0,1fr)]"><strong className="text-xs">{label}</strong><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <p className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          여기서 확인한 discrete visual-code loop를 모든 통합 생성 model의 기본형으로 일반화하면 안 된다. Autoregressive image token, continuous image span과 diffusion loss가 실행 계약을 어떻게 바꾸는지는 <InternalLink slug="multimodal-unified-generation-objectives">통합 생성 objective 비교</InternalLink>에서 분기해 읽는다.
        </p>
        <StopRule>Janus-Pro 한 구현에서 확인한 class와 loop를 Emu3·Transfusion의 공통 runtime이라고 일반화하지 않는다. 다른 architecture는 각 official code가 공개될 때 별도 trace를 만든다.</StopRule>
        <CapabilityCheck items={[
          'Understanding path의 placeholder, mask와 visual embedding 대입 순서를 추적한다.',
          'Generation path의 gen_head, CFG, visual code feedback와 decoder 순서를 추적한다.',
          'Shared transformer, 이해 전용, 생성 전용과 학습 전용 object를 구분한다.',
          'Generation encoder는 target-code 학습에만, decoder는 생성 추론 끝에 쓰인다는 경계를 설명한다.',
          '같은 autoregressive objective와 같은 output head를 혼동하지 않는다.',
          'Demo image가 아니라 revision·shape·latency·failure를 재현 영수증으로 남긴다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Pinned Janus-Pro README generation loop', href: `https://github.com/deepseek-ai/Janus/blob/${revision}/README.md#L193-L233`, note: `검산 revision ${revision}. 576-step CFG generation example의 실행 근거. Root generation_inference.py는 Janus-1.3B 예제이므로 Janus-Pro 전용 근거로 쓰지 않는다.` },
          { label: 'Pinned processing_vlm.py', href: `https://github.com/deepseek-ai/Janus/blob/${revision}/janus/models/processing_vlm.py#L200-L240`, note: 'Image placeholder 확장, sequence mask와 embedding mask 조립의 code 근거.' },
          { label: 'Pinned modeling_vlm.py', href: `https://github.com/deepseek-ai/Janus/blob/${revision}/janus/models/modeling_vlm.py#L178-L245`, note: 'Shared language transformer와 understanding·generation object ownership의 code 근거.' },
          { label: 'Janus-Pro-7B official model card', href: 'https://huggingface.co/deepseek-ai/Janus-Pro-7B', note: 'Model artifact, input resolution과 license boundary 확인. Hosted production runtime의 근거로 확대하지 않는다.' },
          { label: 'Janus-Pro paper', href: 'https://arxiv.org/abs/2501.17811', note: 'Training strategy, data·model scaling과 understanding·generation 평가의 저자 보고.' },
          { label: 'Janus paper', href: 'https://arxiv.org/abs/2410.13848', note: 'Visual encoding을 분리하면서 transformer를 공유한 원 설계 의도.' },
          { label: '시각 tokenization 기반', href: 'https://arxiv.org/abs/1711.00937', note: 'VQ code와 decoder가 왜 generation path에 필요한지 설명하는 최소 기반.' },
        ]} />
      </section>
    </>
  );
}
