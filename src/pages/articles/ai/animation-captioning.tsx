import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { CaptionContractViz } from './animation-production/viz/ProductionDecisionViz';

export default function AnimationCaptioningArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">캡션은 영상 설명이 아니라 condition과 영상의 정렬 계약이다</h2>
        <QuestionLead
          question="VLM이 'anime girl jumping, dynamic camera'라고 길게 설명하면 좋은 학습 캡션일까?"
          answer="길이만으로는 알 수 없다. Camera가 실제로 고정인데 character 이동을 camera motion으로 적었다면 잘못된 supervision이다. 무엇이 보였는지, 어떤 연출 의도인지, audio에서 무엇이 들렸는지, 누가 검수했는지를 분리해야 오류를 고치고 ablation할 수 있다."
        />
        <ConceptPrimer items={[
          { term: 'Observable', meaning: 'Frame과 audio에서 직접 확인할 수 있는 사람·행동·카메라·대사다.', why: '자동 caption이 사실을 왜곡했는지 source timecode로 확인한다.' },
          { term: 'Directorial intent', meaning: 'Anticipation, smear, impact, hold처럼 shot이 의도한 표현 규칙이다.', why: '물리적 움직임과 animation 문법을 구분한다.' },
          { term: 'Condition field', meaning: 'Content, style, motion, camera, VFX, audio처럼 독립적으로 바꿔 볼 수 있는 입력 축이다.', why: '어떤 단어가 어떤 결과를 바꿨는지 실험한다.' },
          { term: 'Review state', meaning: '자동 생성, 수정 필요, 승인과 근거 timecode를 나타내는 상태다.', why: 'VLM·ASR 초안을 정답 label처럼 학습하지 않는다.' },
        ]} />
        <CaptionContractViz />
      </section>

      <section id="schema" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">자연어와 구조화 필드는 서로 다른 일을 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            자연어는 모델의 text encoder가 읽는 실제 condition에 가깝다. 구조화 필드는 dataset을 검색하고 균형을 확인하며 특정 축만 바꾸는 실험에 유리하다.
            하나만 남기지 않는다. 구조화 field에서 검수한 사실과 의도를 자연어 render로 만들되, 원본 field와 renderer version을 함께 저장한다.
          </p>
          <M display>{String.raw`\begin{aligned}
            c_i=\operatorname{Render}\big(&
              \underbrace{c_i^{\text{content}}}_{\text{누가 무엇을 하는가}},
              \underbrace{c_i^{\text{style}}}_{\text{선·색·재질}},\\
              &\underbrace{c_i^{\text{motion}}}_{\text{동작·timing}},
              \underbrace{c_i^{\text{camera}}}_{\text{camera 경로}},
              \underbrace{c_i^{\text{vfx}}}_{\text{효과}},
              \underbrace{c_i^{\text{audio}}}_{\text{대사·소리}}\big)
          \end{aligned}`}</M>
          <FormulaNote
            meaning="Caption을 독립 field로 보존하면 camera만 제거하거나 motion 표현만 바꾸는 ablation이 가능하다. Render는 단순 문자열 결합이 아니라 순서·표현·누락 규칙을 가진 versioned 함수다."
            symbols={[
              [String.raw`c_i`, 'i번째 clip에 실제로 입력하는 자연어 condition'],
              [String.raw`c_i^{content}`, 'character, object, action과 scene의 관측 내용'],
              [String.raw`c_i^{motion},c_i^{camera}`, 'object timing과 camera motion을 분리한 field'],
              [String.raw`c_i^{style}`, '선, 색, 명암과 재질처럼 화면 표현을 지시하는 field'],
              [String.raw`c_i^{vfx}`, 'speed streak, dust, glow처럼 후경·전경 효과를 지시하는 field'],
              [String.raw`c_i^{audio}`, '대사, 효과음, 음악과 그 시간 위치를 나타내는 field'],
              [String.raw`\operatorname{Render}`, '구조화 field를 model input 문장으로 만드는 versioned 규칙'],
            ]}
          />
          <pre><code>{`{
  "clip_id": "seriesA_ep03_shot017_v2",
  "character_ids": ["heroA"],
  "observable": {
    "content": "hero jumps left to right over a rail",
    "camera": "locked camera; background parallax only",
    "audio": "no speech; short landing impact at 00:04.03"
  },
  "intent": {
    "motion": "two-beat anticipation, one smear drawing, one-frame impact",
    "style": "clean cel line, flat shadow, no texture crawl",
    "vfx": "speed streaks before impact; dust burst after landing"
  },
  "review": {
    "vlm_draft": true,
    "changes": ["dolly-in -> locked camera", "landing direction corrected"],
    "status": "approved",
    "timecodes": ["00:02.40-00:04.30"]
  }
}`}</code></pre>
        </div>
      </section>

      <section id="learning-signal" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">빠진 단어보다 틀린 대응이 더 위험할 수 있다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Conditional model은 clip <M>{String.raw`x_i`}</M>를 condition <M>{String.raw`c_i`}</M>와 함께 보며 학습한다. Diffusion·flow model의 정확한 loss는 다르지만,
            핵심 supervision은 “이 condition에서 이 target state가 나와야 한다”는 pair다. Camera가 고정인데 pan이라고 적으면 model은 잘못된 대응을 강화한다.
          </p>
          <M display>{String.raw`\begin{aligned}
            c_i'&=\underbrace{m_i\odot c_i}_{\text{필드별 조건 마스킹}}\\
            \mathcal L_{\text{cond}}(\theta)&=
              \mathbb E_{\xi_i}\!\left[
              \underbrace{\lVert u_i- f_\theta(z_{i,t},t,c_i')\rVert_2^2}_{\text{마스킹된 조건의 예측 오차}}\right]\\
            \xi_i&=\underbrace{(x_i,c_i,m_i,t,\epsilon)}_{\text{clip·caption·mask·noise 표본}}
          \end{aligned}`}</M>
          <FormulaNote
            meaning="식은 특정 공개 model의 비공개 loss를 복제한 것이 아니라 conditional video training의 공통 pair 관계를 나타낸다. Field dropout은 일부 condition이 없을 때도 동작하게 만들 수 있지만 확률과 null 표현은 trainer 계약을 따라야 한다."
            symbols={[
              [String.raw`x_i,z_{i,t}`, '원본 clip과 noise time t에서의 latent state'],
              [String.raw`\xi_i`, 'clip, caption, noise time과 noise를 한 번에 나타낸 학습 표본'],
              [String.raw`u_i`, '모델이 맞혀야 하는 noise, velocity 또는 flow target'],
              [String.raw`f_\theta`, 'condition을 받아 target update를 예측하는 video model'],
              [String.raw`m_i`, 'content·motion·camera 같은 field를 유지하거나 비우는 mask'],
              [String.raw`c_i'`, 'mask 적용 뒤 실제로 모델에 들어가는 condition'],
            ]}
          />
          <p>
            모든 것을 길게 쓰면 중요한 signal이 강해진다고 단정할 수도 없다. Model context, tokenizer와 training distribution에 따라 rare production term이 무시될 수 있다.
            Field coverage와 결과 control을 함께 측정한다. Caption token 수가 아니라 “camera field를 바꿨을 때 camera만 바뀌는가”가 더 강한 검사다.
          </p>
          <CitationBlock source="AniMatrix paper" citeKey={1} href="https://arxiv.org/abs/2605.03652">
            <p>AniMatrix는 free-form narrative와 Style·Motion·Camera·VFX taxonomy를 분리하고, categorical directive가 희석되지 않도록 별도 encoding·injection을 제안한다. 이는 모든 base model이 같은 dual path를 지원한다는 뜻은 아니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="asr-vlm" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">VLM·ASR은 초안을 만들고 사람은 오류 유형을 닫는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>자동화는 다음 순서로 쓴다.</p>
          <ol>
            <li>VLM이 frame sample과 audio를 보고 visual content, motion, camera, text를 초안으로 만든다.</li>
            <li>ASR이 word timestamp와 speaker 후보를 만든다. Music·SFX와 speech를 같은 transcript에 섞지 않는다.</li>
            <li>Rule checker가 허용 taxonomy, 누락 field, impossible timecode와 고유명사를 표시한다.</li>
            <li>Reviewer가 원본을 재생하며 object/camera 혼동, left/right, negation, identity와 animation timing을 확인한다.</li>
            <li>승인된 field에서 자연어 caption을 다시 render하고 model input hash를 저장한다.</li>
          </ol>
          <p>
            Reviewer는 문장을 예쁘게 다듬는 사람이 아니다. Source와 label의 불일치를 수정한다. 특히 빠른 smear를 “blurred frame”으로, held drawing을 “video is frozen”으로,
            camera zoom을 character scale change로 오해하는 자동 caption은 animation intent를 반대로 가르칠 수 있다.
          </p>
          <CitationBlock source="LTX-2 Dataset Preparation Guide" citeKey={2} href="https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-trainer/docs/dataset-preparation.md">
            <p>공식 captioner도 visual content, speech, sound와 on-screen text를 구조화하지만 자동 caption에 부정확성이나 hallucination이 있을 수 있어 dataset preprocessing 전에 검수·수정을 권고한다.</p>
          </CitationBlock>
          <Misconception>ASR transcript는 lip-sync 정답이 아니다. Word timestamp, phoneme timing, speaker visibility와 mouth pose는 서로 다른 정렬 층이다.</Misconception>
        </div>
      </section>

      <section id="ablation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Caption 실험은 길이 비교가 아니라 control 분리 검사다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>같은 train clip, seed와 training budget에서 다음 네 variant를 만든다.</p>
          <ol>
            <li>content만 있는 짧은 caption</li>
            <li>content + motion</li>
            <li>content + motion + camera + VFX</li>
            <li>전체 field지만 VLM 오류를 수정하지 않은 noisy caption</li>
          </ol>
          <p>
            평가 때 motion verb만 바꾸고 identity·camera가 유지되는지, camera field만 바꾸고 object path가 유지되는지 본다. 상세 caption이 전체 평균을 높였어도 서로 다른 field가 같이 움직이면
            control은 분리되지 않은 것이다. Noisy variant가 더 잘 나오면 즉시 자동 caption을 신뢰하지 말고 dataset bias, prompt distribution과 metric을 재검사한다.
          </p>
        </div>
        <CapabilityCheck items={[
          '관측 사실, 연출 의도, camera와 audio transcript를 서로 다른 field로 기록할 수 있다.',
          'VLM의 object/camera 혼동과 ASR의 고유명사·timestamp 오류를 source timecode로 검수할 수 있다.',
          'Caption 길이가 아니라 field별 controllability를 ablation으로 평가할 수 있다.',
          '구조화 metadata와 실제 model input 자연어를 renderer version으로 연결할 수 있다.',
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 <InternalLink slug="animation-lora-training">Adaptation·Control</InternalLink> 글에는 approved condition, renderer version과 field ablation 결과를 넘긴다. Control failure와 weight adaptation 필요성을 이 증거로 분리한다.
          </p>
        </div>
        <SourceNotes sources={[
          { label: 'AniMatrix paper', href: 'https://arxiv.org/abs/2605.03652', note: 'Style·Motion·Camera·VFX taxonomy, AniCaption과 dual-channel conditioning의 1차 근거.' },
          { label: 'LTX-2 dataset preparation', href: 'https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-trainer/docs/dataset-preparation.md', note: 'Multimodal caption field, 자동 caption 오류 경고와 preprocessing 실행 계약.' },
        ]} />
      </section>
    </div>
  );
}
