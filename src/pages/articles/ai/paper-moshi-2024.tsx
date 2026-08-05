import FormulaNote from '@/components/ui/formula-note';
import MathFormula from '@/components/ui/math';
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
import {
  DelayLab,
  DuplexStreamLab,
  HierarchyLab,
  MoshiEvidenceLab,
} from './paper-moshi-2024/viz/MoshiSourceLabs';

function Formula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <MathFormula display className="my-0 text-[12px] sm:text-[15px]">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

export default function PaperMoshi2024Article() {
  return (
    <>
      <section id="two-stream-dialogue" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Full duplex는 빨리 답하는 모델이 아니라 두 음성 stream을 동시에 유지하는 구조다</h2>
        <QuestionLead
          question="모델이 말하는 도중 사용자가 “아니, 잠깐”이라고 끼어들면 왜 전통적인 ASR → LLM → TTS 직렬 파이프라인은 자연스럽게 대응하기 어려울까?"
          answer="직렬 cascade가 사용자 발화의 끝을 기다린 뒤 transcript를 확정하고, 답 전체를 만든 뒤 TTS를 시작하면 듣기와 말하기가 서로 다른 구간으로 잘린다. Moshi는 사용자 audio와 모델 audio를 같은 codec clock의 두 stream으로 계속 모델링해 silence·overlap·turn transition을 한 sequence 안에 남긴다."
        />
        <ConceptPrimer items={[
          {
            term: 'Half duplex',
            meaning: '한쪽이 전송하는 동안 다른 쪽은 기다리는 무전기 같은 상호작용이다.',
            why: '“한 번에 한 사람”이라는 endpoint 가정이 overlap과 interruption을 어디서 버리는지 보인다.',
          },
          {
            term: 'Full duplex',
            meaning: '사용자 입력과 모델 출력을 동시에 유지하고 같은 시간축에서 갱신하는 방식이다.',
            why: 'Latency가 짧다는 뜻만이 아니라 두 speaker state를 병렬로 표현한다는 뜻이다.',
          },
          {
            term: 'Codec frame',
            meaning: '연속 waveform을 일정 시간 폭의 discrete token 묶음으로 바꾼 한 시점이다.',
            why: 'Text token이 아니라 audio frame이 대화 model의 기본 clock이 된다.',
          },
          {
            term: 'Interaction policy',
            meaning: '언제 말하고, 멈추고, 양보하고, tool을 호출할지 정하는 제품 행동 규칙이다.',
            why: '두 stream을 생성할 수 있다는 논문 claim과 안전한 production 행동을 분리한다.',
          },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Moshi 이전에도 speech-to-speech system은 만들 수 있었다. 보통은 사용자의 말을 ASR로 글로 바꾸고,
            text LLM이 답을 쓴 뒤 TTS가 소리로 읽는다. 각 부품을 따로 평가하고 교체하기 쉽다는 장점이 있지만,
            transcript가 확정되기 전의 억양·머뭇거림·겹침을 중간 text contract가 지울 수 있다. 답을 시작하는 시점도
            endpoint detector, text generation과 TTS buffer가 차례로 끝난 뒤가 된다.
          </p>
          <p>
            2024년 Moshi의 핵심 연구 질문은 “음성을 text로 바꾸지 않고도 잘 말할 수 있는가”보다 넓다.
            <strong>사용자와 system의 두 audio stream을 한 autoregressive state에서 계속 읽고, system 쪽 text와 audio를
            같은 frame clock에서 함께 생성할 수 있는가</strong>다. Figure 4에서 사용자 token은 model input으로 들어오고,
            Moshi stream의 token은 sampling된다. 두 stream이 같은 열에 있으므로 한 frame에서 둘 다 발화할 수 있다.
          </p>
        </div>
        <DuplexStreamLab />
        <Misconception>
          Full-duplex architecture가 곧바로 완성된 barge-in 제품을 뜻하지는 않는다. Model이 새 사용자 token을 보더라도
          이미 network·jitter buffer·speaker queue에 들어간 audio를 취소하는 책임, tool 실행을 중단하는 권한, 사용자의
          재확인 정책은 별도 runtime이 구현하고 검증해야 한다.
        </Misconception>
      </section>

      <section id="mimi-codec-clock" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Mimi는 24,000개의 초당 sample을 12.5개의 semantic-acoustic frame으로 줄인다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Raw audio는 24 kHz라서 한 초에 24,000개의 waveform sample이 들어온다. 이를 그대로 language model token처럼
            생성하면 너무 길다. Mimi는 causal convolution encoder와 bottleneck Transformer로 waveform을 초당 12.5개의
            latent timestep으로 줄이고, 각 timestep을 8개 codebook index로 양자화한다. 첫 latent timestep은 80 ms audio에
            대응하며 decoder도 그 80 ms를 복원할 수 있다.
          </p>
          <p>
            첫 codebook은 WavLM representation을 distillation해 phonetic·semantic 정보를 담도록 학습하고, 나머지 7개
            RVQ level은 acoustic residual을 담는다. 원문은 이를 split RVQ로 구성해 semantic quantizer가 reconstruction에 필요한
            모든 정보를 자기 residual에 억지로 남기는 충돌을 줄였다. RVQ의 nearest-code와 residual 계산은{' '}
            <InternalLink slug="audio-representation-neural-codecs" learningPathId="ai-speech-audio-representation">
              Neural Codec 글
            </InternalLink>
            에서 바닥부터 내려간다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{f_{\mathrm{frame}}}_{\text{초당 codec frame}}
&=12.5\ \mathrm{Hz}\\
\underbrace{\Delta t_{\mathrm{frame}}}_{\text{frame 하나의 시간}}
&=\frac{1}{12.5}=0.08\ \mathrm{s}=80\ \mathrm{ms}\\
\underbrace{24{,}000\cdot0.08}_{\text{첫 frame이 받은 waveform sample}}
&=1{,}920
\end{aligned}`}
          meaning="왜 frame rate의 역수를 구하나: 초당 12.5번 갱신한다는 빈도를 한 번 갱신할 때 기다려야 하는 시간으로 바꾸기 위해서다. 왜 24,000을 0.08초와 곱하나: 첫 latent token 묶음이 만들어지기 전에 causally 받아야 하는 waveform sample 수를 확인하기 위해서다."
          symbols={[
            [String.raw`f_{\mathrm{frame}}`, 'Mimi가 1초에 내는 latent timestep 수'],
            [String.raw`\Delta t_{\mathrm{frame}}`, 'Codec clock의 한 칸이 차지하는 시간'],
            [String.raw`24{,}000`, '입력 waveform의 초당 sample 수'],
            [String.raw`1{,}920`, '80 ms 동안 들어오는 waveform sample 수'],
          ]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
f_{\text{초당 frame}}&=12.5\\
q_{\text{frame당 index}}&=8\\
b_{\text{index당 bit}}&=\log_2 2048=11\\
R_{\mathrm{index}}&=f_{\text{초당 frame}}q_{\text{frame당 index}}b_{\text{index당 bit}}\\
&=1{,}100\ \mathrm{bit/s}=1.1\ \mathrm{kbps}
\end{aligned}`}
          meaning="왜 frame rate·codebook 수·index bit를 곱하나: 매초 12.5개 frame마다 8개 정수 index를 보내고, 2,048개 후보 중 하나를 구분하려면 index마다 11 bit가 필요하기 때문이다. 이 값은 codec index payload이며 packet header, 오류 복구, network overhead는 포함하지 않는다."
          symbols={[
            [String.raw`Q=8`, 'Frame마다 나오는 semantic 1개와 acoustic 7개의 codebook index'],
            [String.raw`V=2048`, '각 codebook에서 선택할 수 있는 centroid 수'],
            [String.raw`\log_2V=11`, '2,048개 index를 고정 길이 binary로 구분하는 bit 수'],
            [String.raw`R_{\mathrm{index}}`, '압축·framing overhead 전의 theoretical index bitrate'],
          ]}
        />
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['01', 'Capture', '24 kHz mono waveform에서 causal convolution이 과거와 현재 sample만 읽는다.', '80 ms 첫 입력 frame'],
            ['02', 'Encode', 'Stride를 거쳐 초당 12.5개의 512차원 latent로 줄인다.', '긴 waveform → 낮은 frame clock'],
            ['03', 'Split quantize', 'Semantic VQ 1개와 acoustic RVQ 7개가 같은 frame을 표현한다.', '8개 discrete index'],
            ['04', 'Generate', 'Moshi가 두 stream의 index를 frame별로 조건화하고 system 쪽 token을 sample한다.', '사용자 input + model output token'],
            ['05', 'Decode', 'Causal decoder가 system index를 24 kHz waveform으로 복원한다.', '첫 80 ms audio block'],
          ].map(([number, title, body, artifact]) => (
            <div key={number} className="grid gap-2 py-5 sm:grid-cols-[3rem_7rem_minmax(0,1fr)] sm:gap-4">
              <p className="font-mono text-xl font-black text-muted-foreground">{number}</p>
              <p className="text-sm font-black">{title}</p>
              <div className="min-w-0">
                <p className="text-sm leading-relaxed">{body}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Artifact · {artifact}</p>
              </div>
            </div>
          ))}
        </div>
        <Misconception>
          Mimi의 첫 80 ms frame은 end-to-end 응답 지연이 아니다. 입력 capture가 시작된 뒤 첫 latent를 만들 수 있는 codec
          granularity다. Moshi scheduling, model compute, 전송과 playback이 모두 0 ms일 때에만 이 값과 첫 audible sample이 같다.
        </Misconception>
      </section>

      <section id="temporal-depth-hierarchy" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Temporal Transformer는 긴 시간축을, Depth Transformer는 한 frame 안 codebook축을 맡는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            8개 codebook을 한 줄로 펼치면 초당 <code>12.5 × 8 = 100</code>개의 audio token step이 생긴다.
            5분이면 30,000 step이다. 이 전체를 7B급 Temporal Transformer가 순차 처리하면 streaming generation 비용이 커진다.
            Moshi는 RQ-Transformer hierarchy를 사용해 긴 대화 history는 frame 수 <code>S</code>만큼만 큰 model에 통과시키고,
            현재 frame 안의 codebook 순서는 작은 Depth Transformer가 최대 <code>K</code> step 처리하게 한다.
          </p>
          <p>
            Temporal context <code>z_s</code>는 이전 frame들의 모든 substream을 요약한다. 현재 frame의 첫 token은 이
            context에서 바로 예측하고, 두 번째 이후 token은 <code>z_s</code>와 같은 frame에서 이미 생성한 앞 codebook token을
            함께 본다. 그래서 시간 의존성과 같은 frame의 semantic-acoustic 의존성을 서로 다른 축에서 유지한다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{z_s}_{\text{현재 frame의 시간 context}}
&=\underbrace{\operatorname{Tr}_{\mathrm{Temp}}
\!\left(V_0,\ldots,V_{s-1}\right)}_{\text{이전 frame 묶음을 큰 model로 읽음}}\\
\underbrace{\ell_{s,k}}_{\text{현재 codebook의 logits}}
&=\underbrace{\operatorname{Tr}_{\mathrm{Depth}}
\!\left(z_s,V_{s,1},\ldots,V_{s,k-1}\right)}_{\text{시간 context와 같은 frame의 앞 token을 결합}}
\end{aligned}`}
          meaning="왜 Transformer를 두 축으로 나누나: 대화 전체 history를 이해하는 큰 계산은 frame마다 한 번만 하고, 같은 80 ms 안의 semantic·acoustic index 의존성은 짧고 작은 model로 풀기 위해서다. Depth model은 token 수를 없애지 않고 큰 model이 보는 sequence 길이를 줄인다."
          symbols={[
            [String.raw`s`, '12.5 Hz clock에서 현재 audio frame index'],
            [String.raw`V_s=(V_{s,1},\ldots,V_{s,K})`, '한 frame의 text·user audio·model audio substream token 묶음'],
            [String.raw`z_s`, '이전 frame history에서 만든 Temporal Transformer context'],
            [String.raw`k`, '현재 frame 안에서 생성 중인 substream 또는 codebook 위치'],
            [String.raw`\ell_{s,k}`, 'k번째 token의 vocabulary별 점수'],
          ]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{T}_{\text{5초의 frame 수}}
&=12.5\cdot5=62.5\\
\underbrace{N_{\mathrm{audio\ positions}}}_{\text{두 stream에서 처리할 audio index 위치}}
&=2\cdot8\cdot T\\
\underbrace{L_{\mathrm{large}}}_{\text{큰 model의 시간 길이}}
&:\quad K T\ \longrightarrow\ T
\end{aligned}`}
          meaning="왜 62.5가 정수가 아닌가: 5초 경계가 codec frame 경계와 반드시 맞지 않으므로 실제 구현은 62개 또는 63개 frame으로 자르거나 padding하는 규칙을 정해야 한다. 왜 두 stream·8 level·frame 수를 곱하나: 사용자 관측 stream과 모델 생성 stream 각각의 매 frame에 8개 audio index 위치가 있기 때문이다. User index는 model이 새로 sample하는 output decision이 아니므로, 이 값은 생성 decision 수가 아니라 처리하는 위치 수다. Hierarchy는 이 위치를 지우지 않고 큰 Temporal model의 길이만 KT에서 T로 바꾼다."
          symbols={[
            [String.raw`T`, '주어진 duration 안의 codec frame 수. 실제 batching은 rounding rule이 필요하다.'],
            [String.raw`N_{\mathrm{audio\ positions}}`, 'user 입력과 model 출력 두 stream에서 처리하는 audio index 위치 수'],
            [String.raw`K`, 'Temporal model에서 함께 묶는 substream 수'],
            [String.raw`L_{\mathrm{large}}`, '큰 Temporal Transformer가 순차적으로 처리하는 길이'],
          ]}
        />
        <HierarchyLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Moshi의 실제 multi-stream step에는 사용자 audio 8개와 system audio 8개가 있다. Inner Monologue를 켜면 system text
            token 하나가 앞에 추가되어 한 temporal timestep에서 16개 대신 17개 token을 생성·조건화한다. 다만 사용자 transcript
            stream은 두지 않는다. 원문은 외부 online ASR에 의존하면 end-to-end speech-to-speech 목표와 충돌한다고 설명한다.
          </p>
        </div>
      </section>

      <section id="inner-monologue-delay" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Inner Monologue는 system text를 audio보다 앞선 언어 scaffold로 둔다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Audio token만으로도 말소리를 만들 수 있지만, 긴 사실 관계와 문장 구조를 acoustic state에만 보존하기는 어렵다.
            Inner Monologue는 Moshi가 말할 system transcript를 SentencePiece token으로 만들고 12.5 Hz audio clock에 정렬한다.
            Word 시작 timestamp에 text token을 놓고 다음 word까지는 PAD를 채우며, EPAD로 padding 종료와 다음 word 선택을 분리한다.
            이 text token이 semantic·acoustic token보다 앞에서 생성되어 언어적 scaffold가 된다.
          </p>
          <p>
            Acoustic delay는 first semantic codebook과 나머지 acoustic codebook의 상대 위치를 바꾼다. Delay 1이면 현재 frame의
            semantic token을 보고 acoustic token을 한 frame 뒤에 생성하므로 이론 schedule은 <code>현재 frame 80 ms + 지연
            frame 80 ms = 160 ms</code>다. Moshi는 pre-training에서 delay 2, fine-tuning에서 delay 1을 사용했다.
            원문은 이 160 ms를 10개 언어의 자연 대화에서 측정된 평균 230 ms 응답 간격과 비교한다. 다만 230 ms는 사람 대화의
            평균 문맥값이지 모든 화자·상황의 고정 deadline이나 device p95 목표가 아니다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{\tau_{\mathrm{schedule}}}_{\text{codec·acoustic 이론 지연}}
&=\underbrace{(1+\delta_{\mathrm{acoustic}})}_{\text{현재 frame과 추가 delay frame}}
\underbrace{\Delta t_{\mathrm{frame}}}_{80\ \mathrm{ms}}\\
\delta_{\mathrm{acoustic}}=1
&\Rightarrow\tau_{\mathrm{schedule}}=160\ \mathrm{ms}
\end{aligned}`}
          meaning="왜 delay에 1을 더하나: acoustic token을 한 frame 늦추기 전에도 현재 semantic frame 80 ms를 먼저 받아야 하기 때문이다. 이 식은 token 배치 순서의 lower-bound schedule만 계산한다. 실제 first-audio p95에는 capture, model runtime, network와 playback 시간이 더해진다."
          symbols={[
            [String.raw`\delta_{\mathrm{acoustic}}`, 'Semantic level보다 나머지 acoustic level을 늦추는 frame 수'],
            [String.raw`\Delta t_{\mathrm{frame}}=80\ \mathrm{ms}`, 'Mimi frame 하나가 차지하는 시간'],
            [String.raw`\tau_{\mathrm{schedule}}`, 'Paper architecture에서 생기는 theoretical scheduling latency'],
            ['practical 200 ms', 'Abstract가 보고한 실용 지연 headline. Hardware별 구성 항 breakdown은 원문에 없다.'],
          ]}
        />
        <DelayLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Text와 audio의 delay 방향을 바꾸면 같은 framework를 streaming TTS나 ASR로 유도할 수도 있다. Text를 teacher-force하고
            audio를 2초 늦추면 text look-ahead를 가진 TTS가 되고, audio를 teacher-force하고 text를 2초 늦추면 먼저 듣고 쓰는
            ASR이 된다. 이것은 별도 encoder를 없애는 흥미로운 통일이지만, 일반 ASR·TTS objective의 장단점은{' '}
            <InternalLink slug="speech-recognition-objectives" learningPathId="ai-speech-audio-recognition">
              Speech Recognition Objectives
            </InternalLink>
            와 <InternalLink slug="native-speech-generation" learningPathId="ai-speech-audio-generation">Native Speech Generation</InternalLink>
            이 각각 소유한다.
          </p>
        </div>
      </section>

      <section id="source-evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">좋은 demo를 설명하려면 codec·hierarchy·text scaffold의 증거를 따로 읽어야 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Moshi의 구성 요소는 한 leaderboard 숫자로 검증되지 않는다. Mimi의 청취 품질은 codec objective를 바꾼 ablation,
            low-latency hierarchy는 같은 delay pattern 안의 perplexity, Inner Monologue는 matched configuration과 spoken QA에서
            확인한다. 생성 대화의 pause·gap·overlap은 다시 별도 Table 9에서 본다. Delay pattern이 다르면 조건부 분포 자체가
            달라지므로 Table 5의 perplexity는 같은 pattern 안에서만 비교한다. Table 6은 같은 delay pattern·matched setting에서
            Inner Monologue 유무를 생성 transcript의 external-LM NLL과 길이 proxy로 비교한다.
          </p>
          <p>
            아래 source receipt는 표 하나씩만 연다. 특히 Mimi에서는 VisQOL이 높은 조건과 사람이 MUSHRA에서 선호한 조건의
            순서가 뒤집힌다. “객관 metric 상승 = 사람이 듣는 품질 상승”이라는 shortcut을 버려야 한다.
          </p>
        </div>
        <MoshiEvidenceLab />
        <CitationBlock source="Défossez et al. · Moshi · Tables 4–9" citeKey={1} href="https://arxiv.org/abs/2410.00037">
          Codec objective metric과 MUSHRA, 같은 delay 안의 RQ-Transformer perplexity, matched Inner Monologue ablation,
          spoken QA, 생성 대화의 pause·gap·overlap과 파생 ASR·TTS는 서로 다른 질문의 근거다. 이 글은 이를 하나의
          보편 성능 점수로 합치지 않는다.
        </CitationBlock>
      </section>

      <section id="limits-current-handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Moshi는 공개 full-duplex 원문 바닥이고 production voice agent의 끝은 아니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            원문 abstract는 theoretical latency 160 ms와 practical 200 ms를 보고한다. 그러나 practical 숫자를 microphone
            capture, codec, Temporal·Depth compute, network, packet, jitter buffer와 speaker callback으로 분해한 hardware별
            p95 receipt는 제공하지 않는다. 따라서 Mimi 80 ms, schedule 160 ms와 practical 200 ms를 같은 의미의 숫자로 쓰면 안 된다.
          </p>
          <p>
            Evidence 범위도 제한된다. Spoken QA의 개선은 세 합성 audio benchmark에서 측정됐고, text-only Helium보다 여전히
            약한 영역이 있었다. ASR 5.7% WER와 TTS 4.7% WER는 LibriSpeech test-clean의 제한된 실험이다. 저자들은 이를
            state of the art 경쟁, 특히 ASR 경쟁이 아니라 Inner Monologue가 여러 task를 한 framework로 표현하는 유연성
            demonstration이라고 명시했다.
          </p>
          <p>
            현재 voice agent로 올라갈 때는 책임을 다시 나눈다.{' '}
            <InternalLink slug="realtime-duplex-voice-systems" learningPathId="ai-speech-audio-current-first">
              Realtime Duplex Voice Systems
            </InternalLink>
            는 barge-in cancellation, permission, WebRTC와 release evidence를 검증한다.{' '}
            <InternalLink slug="native-speech-generation" learningPathId="ai-speech-audio-generation">
              Native Speech Generation
            </InternalLink>
            은 cascade와 native generation 선택을,{' '}
            <InternalLink slug="speech-recognition-objectives" learningPathId="ai-speech-audio-recognition">
              Speech Recognition Objectives
            </InternalLink>
            는 frame과 transcript alignment·partial commit을,{' '}
            <InternalLink slug="audio-representation-neural-codecs" learningPathId="ai-speech-audio-representation">
              Neural Codec
            </InternalLink>
            은 bitrate·복원·streaming 물리를 맡는다. Sample rate와 filter delay가 막힐 때만{' '}
            <InternalLink slug="signals-systems-convolution">신호와 시스템</InternalLink>으로 더 내려간다.
          </p>
        </div>
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['Source가 증명한 것', 'Mimi, two-stream hierarchy, Inner Monologue와 delay를 결합해 공개 benchmark에서 streaming speech-text dialogue를 구성한 결과.'],
            ['Source가 증명하지 않은 것', '모든 hardware의 200 ms p95, production barge-in cancellation, tool permission, arbitrary domain의 factuality와 ASR·TTS SOTA.'],
            ['현재 구현이 추가할 것', 'Stage timestamp, cancel propagation, playback drain, permission gate, network impairment, device별 p95·p99와 human escalation receipt.'],
          ].map(([label, body]) => (
            <div key={label} className="grid gap-2 py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-5">
              <p className="text-sm font-black">{label}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <CapabilityCheck items={[
          'Cascade endpoint와 Moshi의 continuous two-stream audio modeling을 구분한다.',
          '24 kHz waveform이 Mimi 12.5 Hz·8-level index가 되고 1.1 kbps가 되는 계산을 설명한다.',
          'Temporal Transformer의 S축과 Depth Transformer의 K축 책임을 한 frame에서 추적한다.',
          'Inner Monologue text token이 system audio의 semantic scaffold가 되는 위치를 말한다.',
          '80 ms codec frame, 160 ms theoretical schedule, 200 ms practical headline과 product p95를 구분한다.',
          'Table 4·5·6·8의 ablation 질문과 production에서 아직 필요한 증거를 분리한다.',
        ]} />
        <StopRule>
          Two-stream frame, Mimi bitrate, Temporal·Depth hierarchy, Inner Monologue, acoustic delay와 source limitation을 설명할 수
          있으면 full-duplex speech의 최소 원문 바닥은 끝이다. 더 오래된 codec·audio LM 계보를 전부 읽지 않고, 현재 막힌
          책임에 따라 interaction·generation·recognition·representation 중 한 글만 연다.
        </StopRule>
        <SourceNotes sources={[
          {
            label: 'Défossez et al. · Moshi: a speech-text foundation model for real-time dialogue',
            href: 'https://arxiv.org/abs/2410.00037',
            note: 'Mimi, RQ-Transformer, two-stream modeling, Inner Monologue, latency, Tables 3–10과 appendix의 1차 원문.',
          },
          {
            label: 'Kyutai Labs · Moshi official repository',
            href: 'https://github.com/kyutai-labs/moshi',
            note: '공개 inference code, model weights와 runtime entry point. 논문 표의 독립 재현 결과로 간주하지 않는다.',
          },
          {
            label: 'Kyutai · Moshi research page',
            href: 'https://kyutai.org/moshi',
            note: '공식 demo와 research overview. Product permission·cancellation contract의 근거는 아니다.',
          },
        ]} />
      </section>
    </>
  );
}
