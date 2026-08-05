import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes, StopRule } from '@/components/learning/ArticleLearning';
import { SpeechGenerationExplorer } from './speech-audio-core/viz/SpeechSystemExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-7 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function NativeSpeechGenerationArticle() {
  return (
    <>
      <section id="two-system-contracts" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Cascade와 native는 중간 정보의 형태와 책임이 다르다</h2>
        <BeginnerBridge title="통역 내용을 글로 적었다가 읽는 방식과 듣고 바로 말하는 방식은 중간 통로가 다르다">
          Cascade는 음성을 글로 바꾸고, 글로 답을 만든 뒤, 다시 음성으로 읽는 여러 모듈의 연결이다. Native speech system은 입력 음성과 출력 음성을 하나의 학습 흐름에서 다루지만, 내부에 의미를 담은 token이나 글자 상태가 전혀 없다는 뜻은 아니다.
        </BeginnerBridge>
        <QuestionLead question="Native speech-to-speech는 정말 text를 전혀 만들지 않고 바로 소리만 내는가?" answer="그럴 수도 있지만 필수 조건은 아니다. Native의 핵심은 입출력 audio를 하나의 학습·추론 graph에서 다루며 text transcript만을 유일한 정보 병목으로 강제하지 않는다는 점이다. 실제 구조는 semantic token, time-aligned text 또는 Thinker state를 두고 acoustic Talker가 speech token을 생성할 수 있다." />
        <ConceptPrimer items={[
          { term: 'Cascade', meaning: 'ASR → text reasoning → TTS를 명시적인 module로 연결한 system이다.', why: '각 boundary를 감사·교체·fallback하기 쉽지만 transcript가 버린 비언어 cue를 복구하기 어렵다.' },
          { term: 'Native speech-to-speech', meaning: 'Audio input에서 audio output까지 공동 학습하거나 shared latent로 잇는 system이다.', why: '억양·감정·겹침 같은 cue를 보존할 수 있지만 failure ownership이 합쳐진다.' },
          { term: 'Thinker · Talker', meaning: '내용·추론 state와 acoustic token 생성을 분리한 native architecture 역할이다.', why: '말할 내용과 소리를 같은 rate로 autoregressive 생성하는 병목을 줄인다.' },
          { term: 'Inner Monologue', meaning: 'Audio token보다 먼저 time-aligned text token을 예측해 linguistic state를 보강하는 방식이다.', why: 'Native path도 text knowledge와 audit trace를 활용할 수 있음을 보여 준다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Cascade의 장점은 명확한 contract다. ASR transcript를 고치고, text LLM을 바꾸고, TTS voice를 교체할 수 있다. 금융 숫자나 금지 문구도 text boundary에서 검사한다. 대신 ASR이 한숨, 웃음, 화자의 망설임을 transcript에서 버리면 reasoning과 TTS는 그 정보를 모른다.</p>
          <p>Native system은 audio encoder가 만든 state에 비언어 정보를 남길 수 있다. 하지만 “감정을 이해한다”와 “speaker voice를 안전하게 생성한다”는 다른 능력이다. Content factuality, prosody, voice identity, codec artifact와 realtime scheduling을 별도 gate로 다시 나누어야 한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{q_\theta(z)}_{\text{의미 상태 분포}}&=p_\theta(z\mid x_a,c)\\[0.45em]\underbrace{y_a\sim p_\phi(y_a\mid z,c)}_{\text{상태에서 음성 생성}}&\\[0.45em]\underbrace{p(y_a\mid x_a,c)}_{\text{응답 음성 분포}}&=\mathbb E_{\,z\sim q_\theta}\!\left[\underbrace{p_\phi(y_a\mid z,c)}_{\text{상태별 말소리 확률}}\right]\end{aligned}`}
          meaning="숨은 state z를 명시적 transcript 하나로 제한하면 cascade에 가깝다. Native model은 text, continuous semantic latent 또는 discrete semantic token을 z로 둘 수 있다. 기대값 표기는 두 경우를 함께 다룬다. z가 discrete면 이 기대값은 상태별 합이고, continuous면 density에 대한 적분이다. 실제 decoder는 한 state sequence를 autoregressive 또는 streaming 방식으로 근사한다."
          symbols={[[String.raw`x_a`, '사용자 입력 audio sequence'], [String.raw`y_a`, 'system이 생성할 응답 audio'], [String.raw`c`, 'system prompt, speaker, tool result 같은 condition'], [String.raw`z`, 'text 또는 learned semantic response state'], [String.raw`q_\theta`, '현재 입력과 조건에서 가능한 response state의 분포'], [String.raw`p_\theta`, '입력을 이해하고 response state를 만드는 Thinker 측'], [String.raw`p_\phi`, 'state를 acoustic token과 waveform으로 만드는 Talker 측']]} />
      </section>

      <section id="codec-language-model" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Speech LM은 한 text token 대신 여러 acoustic code를 예측한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Neural codec은 연속적인 소리를 몇 개의 정수 code 조합으로 근사한다. 이 변환을 quantization(양자화), 선택 가능한 정수 code의 목록을 codebook이라고 한다. 한 audio time step을 여러 codebook이 차례로 보정하는 residual quantization에서는 가장 앞 codebook이 coarse 또는 semantic structure를 담고, 뒤 codebook이 음색·미세 파형을 보정할 수 있다. 모든 index를 긴 1차원 sequence로 직렬 생성하면 초당 결정 수가 매우 커진다.</p>
          <p>Hierarchical generator는 temporal model이 time step의 coarse state를 만들고 depth model이 같은 time step 안의 codebook을 순서대로 채운다. Acoustic delay는 coarse code가 나온 뒤 refinement code를 약간 늦춰 streaming packet을 먼저 시작하게 한다. Multi-codebook prediction은 “모든 code가 독립”이라는 뜻이 아니라 dependency를 다른 축으로 재배치한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{c_{t,q}}_{\text{code를 고를 때의 문맥}}&=\left(\underbrace{A_{<t,:}}_{\text{이전 audio}},\underbrace{A_{t,<q}}_{\text{앞 codebook}},\underbrace{z_{\le t}}_{\text{의미 state}}\right)\\[0.35em]\underbrace{p(A)}_{\text{전체 acoustic code 확률}}&=\prod_{t=1}^{T}\prod_{q=1}^{Q}\underbrace{p(A_{t,q}\mid c_{t,q})}_{\text{다음 acoustic code 확률}}\end{aligned}`}
          meaning="z_{≤t}는 첫 번째 수식의 전체 response state z 가운데 t 시점까지 사용할 수 있는 prefix다. A_{t,q}는 time step t의 q번째 codebook index다. Model은 이전 audio time 전체와 현재 time의 앞 refinement code, semantic state에 조건화해 다음 code를 낸다. 구현은 일부 codebook을 병렬화하거나 delayed pattern을 쓸 수 있지만, 조건 관계와 first-packet schedule을 model card에서 확인해야 한다."
          symbols={[[String.raw`T`, '생성할 codec time step 수'], [String.raw`Q`, '한 time step의 codebook 수'], [String.raw`A_{t,q}`, 't 시점 q번째 acoustic code index'], [String.raw`c_{t,q}`, '이전 time, 현재 depth와 semantic state를 묶은 조건'], [String.raw`A_{<t,:}`, '이전 모든 time step의 acoustic codes'], [String.raw`A_{t,<q}`, '현재 step에서 이미 생성한 coarse/refinement codes'], [String.raw`z_{\le t}`, '현재까지의 text·semantic condition']]} />
        <SpeechGenerationExplorer />
      </section>

      <section id="thinker-talker" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Thinker와 Talker를 나누는 이유는 rate와 책임이 다르기 때문이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Text reasoning은 수 token/s로도 의미가 이어지지만 acoustic codec은 수십 frame/s에 여러 codebook을 낸다. 하나의 큰 model이 모든 acoustic code를 같은 depth로 처리하면 첫 audio packet과 throughput이 무거워진다. Qwen3-Omni는 MoE(Mixture of Experts, 입력마다 일부 expert만 활성화하는 구조) 기반 Thinker–Talker와 multi-codebook speech generation을 공개했고, Moshi는 temporal Transformer와 depth Transformer를 나누어 semantic·acoustic stream을 계층적으로 생성한다.</p>
          <p>하지만 두 이름을 같은 architecture라고 가정하면 안 된다. 공개된 input/output contract, state sharing, codebook schedule와 serving implementation을 각각 확인한다. Qwen repository도 Transformers path와 vLLM serving의 지원 범위가 다름을 명시한다. “Model weight가 열려 있다”와 “동일한 realtime product가 재현된다”는 다른 주장이다.</p>
        </div>
        <div className="not-prose my-8 min-w-0 divide-y divide-border border-y border-border">
          {[
            ['01', 'Understand', 'Audio encoder가 speech content, prosody와 environment cue를 state로 만든다.', '잘못 들은 내용·speaker confusion'],
            ['02', 'Plan content', 'Thinker가 답변 의미, tool call과 safety decision을 낮은 semantic rate로 만든다.', 'hallucination·stale tool result'],
            ['03', 'Plan voice', 'Speaker, language, emotion, pace와 pronunciation condition을 고정한다.', 'voice drift·style leakage'],
            ['04', 'Generate codec', 'Talker가 coarse semantic code 뒤 acoustic refinement를 streaming 생성한다.', 'gibberish·buzz·silence noise'],
            ['05', 'Decode · play', 'Codec decoder와 jitter buffer가 waveform packet을 speaker clock에 맞춘다.', 'underrun·late cancel·packet artifact'],
          ].map(([index, title, role, failure]) => <div key={index} className="grid gap-2 py-5 sm:grid-cols-[3rem_8rem_minmax(0,1fr)_10rem]"><span className="font-mono text-xs font-black text-muted-foreground">{index}</span><strong className="text-sm">{title}</strong><span className="text-xs leading-relaxed text-muted-foreground">{role}</span><span className="text-[10px] leading-relaxed text-rose-700 dark:text-rose-300">{failure}</span></div>)}
        </div>
      </section>

      <section id="streaming-schedule" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">First packet은 문장 전체 품질과 다른 최적화 문제다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Offline TTS는 문장 전체를 보고 자연스러운 prosody를 계획할 수 있다. Streaming speech는 앞부분을 먼저 확정하므로 뒤 문장의 질문 억양이나 숫자 발음을 아직 모를 수 있다. Semantic look-ahead를 늘리면 자연스럽지만 first packet이 늦고, 너무 빨리 말하면 뒤에서 의미가 바뀌어도 이미 재생한 소리를 되돌릴 수 없다.</p>
          <p>First codec token time, first decodable packet, first audible sample을 구분한다. Token이 나와도 codec frame을 채우고 network packet, receiver jitter buffer와 audio device callback을 지나야 귀에 들린다. 모델 논문의 theoretical latency와 제품 p95 first-audio를 같은 칸에 쓰지 않는다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{T_{first\ audio}}_{\text{첫 소리가 들릴 때}}={}&\underbrace{T_{semantic}}_{\text{내용 prefix 확정}}+\underbrace{T_{codec}}_{\text{첫 code 묶음}}\\&+\underbrace{T_{packet}}_{\text{전송·buffer}}+\underbrace{T_{decode}}_{\text{파형 복원}}+\underbrace{T_{device}}_{\text{speaker 대기}}\end{aligned}`}
          meaning="첫 audio latency는 model token 하나의 시간으로 끝나지 않는다. Content prefix가 확정되고 decoder가 복원 가능한 codebook·frame 묶음이 생긴 뒤 packet과 playback clock을 지나야 한다. 각 항을 같은 monotonic session clock으로 trace해야 어느 최적화가 실제 귀에 들리는 시간을 줄였는지 안다."
          symbols={[[String.raw`T_{semantic}`, '응답 semantic prefix를 시작할 수 있을 때까지의 시간'], [String.raw`T_{codec}`, 'codec decoder가 쓸 최소 code group 생성 시간'], [String.raw`T_{packet}`, 'network와 receiver jitter buffer 대기'], [String.raw`T_{decode}`, 'codec token에서 PCM waveform으로 복원하는 시간'], [String.raw`T_{device}`, 'OS audio queue와 hardware callback 대기'], [String.raw`T_{first\ audio}`, 'input 기준 첫 audible sample timestamp']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>예를 들어 의미 prefix 80 ms, 첫 codec 묶음 40 ms, 전송·buffer 25 ms, 파형 복원 15 ms, speaker 대기 20 ms라면 첫 소리는 <strong>80 + 40 + 25 + 15 + 20 = 180 ms</strong> 뒤에 들린다. Codec 생성만 10 ms 줄여도 전체는 170 ms이므로, 가장 큰 항과 실제 사용자 구간을 함께 재야 한다.</p>
        </div>
      </section>

      <section id="generation-evaluation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">자연스러운 목소리와 올바른 응답을 같은 점수로 합치지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>MOS(Mean Opinion Score, 여러 청취자가 매긴 품질 점수의 평균)는 사람이 들은 전반적인 quality를 요약하지만, text가 틀렸는지, 목표 speaker를 유지했는지, 특정 accent에서 intelligibility가 떨어지는지 원인을 분리하지 않는다. MUSHRA(Multiple Stimuli with Hidden Reference and Anchor)는 기준 음원과 의도적으로 낮춘 anchor를 숨겨 여러 결과를 함께 비교하는 청취 평가다. 같은 sample에 ASR intelligibility, speaker embedding similarity, prosody·emotion human rating, acoustic artifact detector와 factuality를 함께 둔다.</p>
          <p>Voice cloning과 native speech에는 별도 안전 문제가 있다. Input speaker identity를 output이 따라 해도 되는지, system voice가 session 중 바뀌는지, watermark·provenance, biometric retention과 disallowed voice request를 release blocker로 둔다.</p>
        </div>
        <div className="not-prose my-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ['내용', 'ASR intelligibility · factuality', '그럴듯한 오답'],
            ['음질', 'MOS 평균 청취 점수 · MUSHRA 비교 청취 평가 · artifact', 'buzz·noise·gibberish'],
            ['화자', 'speaker similarity · drift', 'identity leakage'],
            ['표현', 'pace · pitch · emotion', 'flat·과장된 prosody'],
            ['시간', 'first-audio · realtime factor', 'late packet·underrun'],
          ].map(([title, metric, failure]) => <div key={title} className="min-h-32 rounded-md border border-border p-4"><strong className="text-sm">{title}</strong><p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">{metric}</p><p className="mt-3 border-t border-border pt-3 text-[10px] font-semibold text-rose-700 dark:text-rose-300">{failure}</p></div>)}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>생성 model이 내보내는 acoustic code를 실제 파형과 bitrate로 검산하려면 <InternalLink slug="audio-representation-neural-codecs">Audio Representation · Neural Codec</InternalLink>으로 내려간다. 여기서 codebook 수, frame rate, 복원 품질과 first-packet latency의 물리적 비용을 계산한다.</p>
        </div>
        <Misconception>Native speech-to-speech는 cascade를 항상 대체하는 상위호환이 아니다. 규제·감사·고유명사 정확도가 우선이면 cascade가 더 나을 수 있고, overlap·prosody cue와 자연스러운 상호작용이 핵심이면 native path의 이점이 커질 수 있다.</Misconception>
        <StopRule>
          Cascade와 native가 정보를 잇는 방식, Thinker와 Talker의 책임, codebook depth가 생성량과 지연시간을 바꾸는 이유,
          내용·음질·화자·표현·시간을 따로 검증해야 하는 이유를 설명할 수 있으면 여기서 멈춘다.
          Codec의 bitrate와 복원 오차를 직접 계산해야 할 때만 <InternalLink slug="audio-representation-neural-codecs">Audio Representation · Neural Codec</InternalLink>으로 내려간다.
        </StopRule>
        <CapabilityCheck items={[
          'Cascade와 native speech path에서 보존·손실되는 정보와 audit boundary를 구분한다.',
          'Thinker, semantic state, Talker, codec decoder의 실행 책임을 순서대로 설명한다.',
          'Time step과 codebook depth를 가진 acoustic token factorization을 읽는다.',
          'Codebook 수를 바꿀 때 초당 생성 decision, bitrate와 first packet 부담을 함께 계산한다.',
          'First codec token과 first audible sample 사이 latency 항을 trace한다.',
          '내용, 음질, speaker identity, prosody, latency와 voice safety gate를 분리한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'QwenLM · Qwen3-Omni', href: 'https://github.com/QwenLM/Qwen3-Omni', note: 'Thinker–Talker MoE, multi-codebook speech output, 공개 model/runtime 범위의 공식 repository.' },
          { label: 'Défossez et al. · Moshi', href: 'https://arxiv.org/abs/2410.00037', note: 'Mimi codec, temporal/depth Transformer, Inner Monologue와 parallel speech stream의 1차 근거.' },
          { label: 'OpenAI · Next-generation audio models', href: 'https://openai.com/index/introducing-our-next-generation-audio-models/', note: 'Speech-to-text, text-to-speech와 production voice-agent interface의 공식 release 경계.' },
          { label: 'Défossez et al. · EnCodec', href: 'https://arxiv.org/abs/2210.13438', note: 'Streaming neural codec, perceptual reconstruction와 subjective listening evaluation의 기반.' },
        ]} />
      </section>
    </>
  );
}
