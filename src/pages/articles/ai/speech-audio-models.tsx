import { useState } from 'react';
import {
  AudioLines,
  Ear,
  GitBranch,
  Mic2,
  RadioTower,
} from 'lucide-react';
import {
  BeginnerBridge,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import MathFormula from '@/components/ui/math';
import SpeechFailureRoutingViz from './speech-audio-models/SpeechFailureRoutingViz';

const routes = [
  {
    index: '01',
    icon: RadioTower,
    slug: 'realtime-duplex-voice-systems',
    pathId: 'ai-speech-audio-current-first',
    title: '동시 대화 시스템',
    question: '왜 말을 잘 만드는 모델만으로 자연스러운 통화가 되지 않을까?',
    signal: '중단 응답 시간 · first audio · packet loss',
    outcome: 'Interaction policy, barge-in과 WebRTC(브라우저 실시간 미디어 통신)를 읽고 필요한 생성·인식 계약만 연다.',
  },
  {
    index: '02',
    icon: AudioLines,
    slug: 'native-speech-generation',
    pathId: 'ai-speech-audio-generation',
    title: '음성 생성',
    question: '의미 state가 어떻게 억양과 음색을 가진 waveform이 될까?',
    signal: '내용 정확성 · 화자 일관성 · first packet',
    outcome: 'Cascade와 Thinker–Talker(의미 추론부와 발화 생성부)를 구분한 뒤 표현·신호로 내려간다.',
  },
  {
    index: '03',
    icon: Mic2,
    slug: 'speech-recognition-objectives',
    pathId: 'ai-speech-audio-recognition',
    title: '음성 인식',
    question: '긴 audio frame과 짧은 transcript를 어떻게 맞출까?',
    signal: '부분 전사 수정률 · commit delay · 최종 오류율',
    outcome: 'CTC, RNN-T, attention과 partial commit을 비교한 뒤 frame·sample 한계를 연다.',
  },
  {
    index: '04',
    icon: Ear,
    slug: 'audio-representation-neural-codecs',
    pathId: 'ai-speech-audio-representation',
    title: '오디오 표현',
    question: '파형을 어떤 model input과 output code로 바꿀까?',
    signal: 'frame rate · bitrate · reconstruction error',
    outcome: 'STFT·mel 주파수 표현, learned latent와 RVQ(잔차 벡터 양자화)를 계산하고 필요할 때 신호 기반을 연다.',
  },
] as const;

function SpeechRouteExplorer() {
  const [selected, setSelected] = useState(0);
  const current = routes[selected];
  const CurrentIcon = current.icon;

  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border" data-speech-route-lab>
      <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4" role="tablist" aria-label="음성 AI 실패 책임 선택">
        {routes.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={selected === index}
              onClick={() => setSelected(index)}
              className={`min-h-20 min-w-0 bg-background px-3 py-3 text-left transition-colors ${selected === index ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]' : 'text-muted-foreground hover:bg-muted/25'}`}
            >
              <span className="flex items-center gap-2"><Icon className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="font-mono text-[11px] font-black">{item.index}</span></span>
              <span className="mt-2 block break-words text-xs font-bold text-foreground">{item.title}</span>
            </button>
          );
        })}
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase text-muted-foreground">관측한 질문</p>
          <p className="mt-2 text-lg font-bold leading-snug">{current.question}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{current.outcome}</p>
        </div>
        <div className="min-w-0 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <CurrentIcon className="h-5 w-5" aria-hidden="true" />
          <p className="mt-3 text-[11px] font-black uppercase text-muted-foreground">먼저 남길 증거</p>
          <p className="mt-2 text-xs font-bold leading-relaxed">{current.signal}</p>
          <div className="mt-4">
            <InternalLink slug={current.slug} learningPathId={current.pathId}>
              {current.title}에서 진단 시작
            </InternalLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SpeechAudioModelsArticle() {
  return (
    <>
      <section id="why-split" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">음성 AI는 하나의 모델 이름이 아니라 네 실패 책임이다</h2>
        <BeginnerBridge title="전화 비서가 말을 잘못 들은 것과 늦게 끼어든 것, 어색하게 말한 것은 다른 고장이다">
          음성 AI에는 들은 소리를 글로 바꾸는 인식, 답할 내용을 정하는 대화, 소리로 말하는 생성, 상대가 말할 때 멈추고 이어 가는 실시간 제어가 함께 있다. 지금 겪는 실패가 어느 단계인지 고르면 필요한 기반만 내려갈 수 있다.
        </BeginnerBridge>
        <QuestionLead
          question="음성 AI를 이해하려면 sampling부터 순서대로 전부 공부해야 할까?"
          answer="아니다. 먼저 지금 해결하려는 실패를 고른다. 말 끊기가 늦으면 동시 대화 시스템에서 시작하고, 발음과 음색이 문제면 생성으로, transcript가 흔들리면 인식으로 내려간다. 수식이나 물리적 한계가 막히는 순간에만 오디오 표현과 신호 기반을 읽는다."
        />
        <ConceptPrimer items={[
          { term: 'ASR', meaning: 'Automatic Speech Recognition, 들어온 음성을 글자로 바꾸는 음성 인식이다.', why: '생성 모델·대화 정책과 인식 오류를 섞지 않는다.' },
          { term: 'Conformer', meaning: 'Convolution과 Transformer를 결합한 음성 encoder 구조다.', why: 'CTC 같은 학습 목표와 model 구조를 구분한다.' },
          { term: 'CTC', meaning: 'Connectionist Temporal Classification, frame과 글자 사이 여러 정렬 경로의 확률을 합치는 목표다.', why: '어느 시점의 소리가 어느 글자인지 미리 표시하지 않아도 학습한다.' },
          { term: 'Codec', meaning: '파형을 압축된 code로 바꾸고 다시 소리로 복원하는 장치 또는 모델이다.', why: '음질과 전송량·생성 속도의 경계를 만든다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>2026년 7월의 상단은 “목소리가 사람 같은가?”에서 끝나지 않는다. 실제 음성 agent는 회사 지식과 system에 접근하고, 허용된 행동만 실행하며, 불확실하거나 위험한 요청을 사람에게 넘겨야 한다. OpenAI Presence가 공개한 층은 바로 이 업무·정책·평가 계약이다. 반면 GPT-Live가 공개한 full-duplex와 background delegation은 그 제품을 가능하게 하는 interaction mechanism이다. 두 층을 같은 말로 부르면 자연스러운 대화를 곧 안전한 업무 완료로 오해한다.</p>
          <p>이전 글은 sample, ASR, codec, native speech, WebRTC와 평가를 한 번에 설명했다. 한 화면에서 범위는 보였지만 독자는 지금 자신의 실패가 어느 책임에 속하는지 찾기 어려웠다. 더 큰 문제는 서로 다른 비교가 섞이는 것이다. Conformer는 encoder 구조이고 CTC는 alignment objective다. 자연스러운 음성 sample은 codec 품질을 보여 주지만 interruption cancellation을 증명하지 않는다.</p>
          <p>그래서 이 경로는 기술 이름이 아니라 <strong>관측 가능한 실패와 실행 계약</strong>으로 나뉜다. 각 글은 하나의 어려운 문제를 끝까지 닫고, 바로 아래 기반 한 곳으로만 내려간다.</p>
        </div>
        <Misconception>“바닥부터”는 오래된 논문을 끝없이 먼저 읽는다는 뜻이 아니다. 현재 시스템의 failure를 설명하는 데 더는 쪼갤 필요가 없는 최소 개념에서 멈추고 다시 상단 문제로 올라오는 방식이다.</Misconception>
      </section>

      <section id="boundary-trace" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">모델을 고르기 전에 경계 시각부터 뺀다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>사용자가 “아니요”라고 끼어들었는데 agent가 계속 말한다고 하자. 이 증상만으로는 ASR, turn policy, audio generation, network와 speaker buffer 중 누구도 지목할 수 없다. 먼저 같은 trace ID로 네 시각을 남긴다. 사용자가 정정한 시각, recognition이 stable partial을 만든 시각, interaction policy가 cancel을 발행한 시각, 실제 speaker가 조용해진 시각이다.</p>
          <p>절대 시각은 순서만 알려 준다. 책임을 찾으려면 인접 시각을 빼야 한다. 예를 들어 stable partial이 80 ms, cancel 발행이 120 ms, 실제 무음이 560 ms라면 감지는 80 ms, 판단은 40 ms, 취소 뒤 출력 정지는 440 ms가 걸렸다. Final WER가 낮고 음질 sample이 자연스러워도 마지막 구간의 고장은 그대로 남는다.</p>
        </div>

        <MathFormula display minScale={0.82}>
          {String.raw`\begin{aligned}
T_{\mathrm{stop}}
&=
\underbrace{(t_h-t_i)}_{\text{정정 감지}}
+
\underbrace{(t_d-t_h)}_{\text{중단 판단}}
\\
&\quad+
\underbrace{(t_s-t_d)}_{\text{취소 전달·버퍼 비우기}}
\end{aligned}`}
        </MathFormula>
        <FormulaNote
          meaning="각 항은 같은 interruption trace에서 인접 경계 시각을 빼 만든 구간 시간이다. 뺄셈을 쓰는 이유는 절대 timestamp가 아니라 각 책임자가 소비한 시간을 분리하기 위해서다."
          items={[
            [String.raw`t_i`, '사용자 정정이 입력 stream에 들어온 기준 시각이다.'],
            [String.raw`t_h`, 'Recognition이 정정 발화를 stable partial로 확정한 시각이다.'],
            [String.raw`t_d`, 'Interaction policy가 현재 출력의 cancel을 발행한 시각이다.'],
            [String.raw`t_s`, 'Speaker playout에서 이전 출력이 실제로 사라진 시각이다.'],
            ['합을 쓰는 조건', '세 구간이 같은 critical path에 연속으로 놓일 때만 전체 stop 시간과 같다. 병렬 실행이나 다른 clock domain이 있으면 trace 동기화와 critical path를 다시 확인한다.'],
          ]}
        />

        <p className="not-prose mb-4 mt-8 text-sm leading-6 text-muted-foreground" data-viz-context>
          아래 장면은 같은 증상이 어떻게 event evidence, 첫 비정상 구간, 읽을 분기와 종료 조건으로 바뀌는지를 보여 준다.
        </p>
        <SpeechFailureRoutingViz />
        <Misconception>가장 큰 숫자가 언제나 첫 원인은 아니다. 앞 단계가 이미 늦어 downstream queue가 커졌다면 큰 buffer 시간은 연쇄 증상일 수 있다. 이 예에서는 detection과 decision이 목표 안에 있다는 증거가 있으므로 cancel 이후 구간을 먼저 연다.</Misconception>
      </section>

      <section id="route" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 줄이 아닌 네 갈래에서 지금 깨진 책임을 고른다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>경계 시각으로 첫 고장 위치를 좁혔다면 이제 그 위치를 소유한 글만 연다. Interaction은 듣기·말하기·멈춤·transport와 delegation을, generation은 의미에서 acoustic code와 waveform이 되는 순서를 소유한다. Recognition은 긴 frame과 짧은 label의 정렬·partial commit을, representation은 frame rate·bitrate·복원·causal delay를 소유한다.</p>
          <p>이 구분은 분류표가 아니다. 선택을 바꾸면 먼저 남길 evidence와 성공 판정도 달라져야 한다. 그래서 아래 Viz는 색만 바꾸지 않고 질문, 관측 신호와 다음 글을 함께 바꾼다.</p>
        </div>
        <SpeechRouteExplorer />
        <div className="not-prose my-8 grid gap-4 border-y border-border py-5 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted/20"><GitBranch className="h-4 w-4" aria-hidden="true" /></span>
          <div><strong className="text-sm">공통 최소 기반은 따로 두고 지연시간에 연다</strong><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Audio representation에서 sample·window·filter·delay가 막힐 때만 신호와 시스템으로 내려간다.</p></div>
          <InternalLink slug="signals-systems-convolution">신호 기반 열기</InternalLink>
        </div>
        <StopRule>다섯 글을 모두 읽는 것이 목표가 아니다. 현재 failure를 설명하고 측정식을 만들 수 있으면 멈춘다. Transformer 내부나 on-device 최적화는 architecture 또는 memory budget이 실제 blocker일 때 별도 경로에서 가져온다.</StopRule>
      </section>

      <section id="entry-choice" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">내 질문에는 어디서 시작해야 할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>아래 문장은 제품에서 자주 보이는 표면 증상이다. 각 행의 오른쪽은 그 증상을 설명하기 위해 가장 먼저 확인할 상태다. 한 번에 모든 행을 따라가지 않는다. 첫 실험에서 바꿀 책임 하나와 고정할 조건을 정하면 된다.</p>
        </div>
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['대화가 서로 끊기고 답이 늦다', 'realtime-duplex-voice-systems', '동시 대화에서 endpoint, interruption, buffer와 tool epoch를 추적한다.'],
            ['목소리가 자연스럽지만 내용·화자가 흔들린다', 'native-speech-generation', '의미, acoustic code, speaker identity와 safety gate를 분리한다.'],
            ['전사는 맞는 듯하지만 중간 자막이 계속 뒤집힌다', 'speech-recognition-objectives', 'Final WER 대신 partial revision과 commit delay를 측정한다.'],
            ['Codec을 바꾸자 속도와 음질이 함께 변했다', 'audio-representation-neural-codecs', 'Frame rate, codebook 수, bitrate와 reconstruction failure를 계산한다.'],
            ['왜 window와 hop이 latency를 바꾸는지 모르겠다', 'signals-systems-convolution', 'Sampling, frequency resolution과 filter delay로 내려간다.'],
          ].map(([symptom, slug, action], index) => (
            <div key={slug} className="grid gap-2 py-5 sm:grid-cols-[2rem_minmax(0,14rem)_minmax(0,1fr)]">
              <span className="font-mono text-[11px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <strong className="text-sm leading-snug">{symptom}</strong>
              <p className="text-xs leading-relaxed text-muted-foreground"><InternalLink slug={slug}>이 글에서 시작</InternalLink><span className="ml-2">{action}</span></p>
            </div>
          ))}
        </div>
        <CapabilityCheck items={[
          '같은 trace의 인접 경계 시각을 빼 첫 비정상 구간을 찾는다.',
          '현재 failure가 interaction, generation, recognition, representation 중 어디에 속하는지 고른다.',
          'Architecture, training objective, runtime과 evaluation을 같은 비교 축으로 섞지 않는다.',
          'Product claim, 공개 논문 architecture와 protocol evidence의 주장 범위를 구분한다.',
          '성공 metric을 만들면 sibling 글을 모두 읽지 않고 필요한 기반에서 멈춘다.',
        ]} />

        <LearningHandoff
          title="첫 비정상 경계가 정한 한 갈래만 연다"
          description="각 글은 독립 질문을 닫는다. 지금 trace가 요구하지 않는 sibling branch는 선택 자료로 남긴다."
          items={[
            { label: '이어 읽기', slug: 'realtime-duplex-voice-systems', title: '동시 대화 시스템', reason: '중단, endpoint, media transport, background delegation이 첫 blocker일 때 연다.', learningPathId: 'ai-speech-audio-current-first' },
            { label: '이어 읽기', slug: 'native-speech-generation', title: '음성 생성', reason: '내용, 화자 identity, 억양, acoustic code 또는 first packet이 흔들릴 때 연다.', learningPathId: 'ai-speech-audio-generation' },
            { label: '이어 읽기', slug: 'speech-recognition-objectives', title: '음성 인식', reason: 'Partial transcript, commit delay, alignment 또는 endpoint가 첫 blocker일 때 연다.', learningPathId: 'ai-speech-audio-recognition' },
            { label: '이어 읽기', slug: 'audio-representation-neural-codecs', title: '오디오 표현', reason: 'Frame rate, bitrate, reconstruction과 causal delay의 trade-off를 계산해야 할 때 연다.', learningPathId: 'ai-speech-audio-representation' },
            { label: '막히면', slug: 'signals-systems-convolution', title: '신호와 시스템', reason: 'Sample rate, window, spectrum, filter와 delay가 실제 물리적 blocker일 때만 내려간다.', learningPathId: 'ai-speech-audio-representation' },
          ]}
        />

        <SourceNotes sources={[
          {
            label: 'OpenAI · Introducing OpenAI Presence (2026-07-22)',
            href: 'https://openai.com/index/introducing-openai-presence/',
            note: '업무별 지식·system access, 정책·권한, simulation·grader와 human escalation을 현재 production contract로 사용한다. 내부 speech architecture 근거로 확대하지 않는다.',
          },
          {
            label: 'OpenAI · Introducing GPT-Live (2026-07-08)',
            href: 'https://openai.com/index/introducing-gpt-live/',
            note: 'Continuous full-duplex interaction과 foreground conversation·background delegation의 공개 설명만 사용한다. 비공개 codec이나 token 구조는 추정하지 않는다.',
          },
          {
            label: 'Défossez et al. · Moshi (2024)',
            href: 'https://kyutai.org/assets/pdfs/Moshi.pdf',
            note: 'Parallel user/model audio stream과 공개 full-duplex speech-to-speech architecture의 기준 원문이다. 다른 vendor 구조와 동일하다고 일반화하지 않는다.',
          },
          {
            label: 'IETF RFC 8834 · RTP in WebRTC',
            href: 'https://www.rfc-editor.org/rfc/rfc8834.html',
            note: 'RTCP의 packet-loss·jitter 관측과 실시간 media transport 경계를 뒷받침한다. 이 수치만으로 turn policy의 옳고 그름을 판정하지 않는다.',
          },
        ]} />
      </section>
    </>
  );
}
