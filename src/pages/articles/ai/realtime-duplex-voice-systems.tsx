import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, ConceptPrimer, InternalLink, LearningHandoff, Misconception, QuestionLead, SourceNotes, StopRule } from '@/components/learning/ArticleLearning';
import { DuplexTimelineExplorer, MediaOwnershipExplorer, VoiceReleaseGate } from './speech-audio-core/viz/SpeechSystemExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-7 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function RealtimeDuplexVoiceSystemsArticle() {
  return (
    <>
      <section id="current-top" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2026년의 상단은 “잘 말하는 모델”에서 “신뢰할 수 있는 업무 에이전트”로 옮겨갔다</h2>
        <QuestionLead question="Microphone과 speaker를 동시에 켜 두면 full-duplex voice AI인가?" answer="아니다. Full-duplex system은 system이 말하는 중에도 user audio를 계속 해석하고, 여러 번의 interaction decision으로 계속 듣기·말하기·멈추기·끼어들기·도구 위임을 갱신한다. Echo로 되돌아온 자기 목소리와 실제 user interruption을 구분하고, 이미 queue에 들어간 audio와 tool result까지 취소할 수 있어야 한다." />
        <ConceptPrimer items={[
          { term: 'Turn-based', meaning: '사용자 발화를 하나의 message로 닫은 뒤 system이 한 응답을 만드는 방식이다.', why: '구현과 감사는 쉽지만 overlap, backchannel과 자연스러운 interruption을 표현하기 어렵다.' },
          { term: 'Full-duplex', meaning: 'Input과 output stream을 동시에 처리하며 interaction action을 연속 갱신한다.', why: '사람처럼 듣는 중 말하고, 말하는 중 새 evidence에 반응하게 한다.' },
          { term: 'Backchannel', meaning: '“음”, “네”처럼 turn을 빼앗지 않고 듣고 있음을 보이는 짧은 반응이다.', why: '단순 silence/non-silence VAD(Voice Activity Detection, 음성 활동 감지)만으로는 응답인지 계속 듣기 신호인지 구분하기 어렵다.' },
          { term: 'Barge-in', meaning: 'System 발화 중 user가 끼어들어 output을 중단하고 새 input을 우선하는 사건이다.', why: '감지 시간뿐 아니라 queued audio, decoder와 tool side effect 취소가 필요하다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>OpenAI Presence는 2026년 7월 22일 voice·chat agent를 특정 업무에 배치할 때의 상단 계약을 공개했다. Agent가 받는 지식과 system access를 작업 범위로 제한하고, 승인 필요 행동과 사람에게 넘길 조건을 정한다. 배포 전에는 simulation·grader로 outcome, policy, tool use와 escalation을 검증하고, 배포 후에는 production session과 handoff에서 개선 후보를 만든다. 즉 음성 모델의 자연스러움만으로는 release를 정당화할 수 없다.</p>
          <p>OpenAI가 2026년 7월 공개한 GPT-Live는 full-duplex continuous interaction을 전면에 두고, speak·listen·pause·interrupt·tool invocation을 초당 여러 번 판단한다고 설명한다. 또 foreground의 빠른 interaction과 background의 frontier reasoning을 분리한다. 이 공개 contract는 현재 상단으로 유용하지만 내부 acoustic token, scheduler나 training objective는 공개 claim 이상으로 추정하지 않는다.</p>
          <p>한편 Moshi는 user와 model의 audio token stream을 병렬로 모델링하고 explicit turn boundary 없이 동시에 듣고 말하는 공개 연구 기준점을 제공한다. 두 system이 같은 내부 구조라는 뜻이 아니라, full-duplex를 검증할 때 필요한 stream·decision contract를 비교할 수 있다는 뜻이다.</p>
        </div>
      </section>

      <section id="continuous-policy" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">대화는 token 생성 위에 놓인 interaction policy다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>매 audio chunk마다 system은 user speech state, 자기 output state, tool state와 conversation state를 갱신한다. Action은 단순 next token이 아니라 계속 듣기, 답변 시작, backchannel, output pause, cancel, clarification, tool delegate처럼 여러 종류다. 같은 acoustic input도 system이 지금 말하는 중인지, user가 문장을 끝냈는지에 따라 다른 action이 맞다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{s_t}_{\text{현재 대화 상태}}&=\left(\underbrace{o^{u}_{\le t}}_{\text{사용자 음성}},\underbrace{o^{self}_{\le t}}_{\text{재생 중 음성}}\right)\\&\quad\oplus\left(\underbrace{s^{tool}_t}_{\text{도구 상태}},\underbrace{h_t}_{\text{대화 기억}}\right)\\[0.35em]\underbrace{a_t}_{\text{듣기·말하기·중단·위임}}&\sim\underbrace{\pi_\theta(a\mid s_t)}_{\text{상태를 action으로 바꾸는 policy}}\end{aligned}`}
          meaning="Interaction policy는 user audio만 보지 않는다. Speaker에서 나온 자기 audio의 echo와 실제 playback 위치, background tool의 version, 대화 memory를 함께 보고 action을 고른다. Model이 직접 policy를 학습할 수도 있고 deterministic state machine, VAD와 model score를 조합할 수도 있다. 중요한 것은 action과 근거 state를 trace에 남기는 것이다."
          symbols={[[String.raw`a_t`, 'listen, speak, pause, cancel, delegate 같은 현재 action'], [String.raw`o^{u}`, 'microphone에서 관측한 user-side audio evidence'], [String.raw`o^{self}`, 'system이 생성·재생 중인 output과 echo reference'], [String.raw`s^{tool}_t`, '진행 중인 tool request와 result version'], [String.raw`h_t`, 'transcript, semantic state와 turn history'], [String.raw`\pi_\theta`, 'interaction action distribution 또는 policy']]} />
        <DuplexTimelineExplorer />
        <Misconception>Backchannel을 생성할 수 있다는 사실만으로 turn-taking이 해결되지 않는다. 잘못된 타이밍의 “네”는 user를 끊고, 의료·금융 문장에서 동의로 오해될 수 있다. Domain별 허용 action과 의미를 따로 제한한다.</Misconception>
      </section>

      <section id="interruption-cancel" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Barge-in은 VAD event가 아니라 end-to-end cancellation이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>System이 말할 때 microphone에는 user voice와 speaker echo가 함께 들어온다. Acoustic echo cancellation(AEC)은 known playback reference를 사용해 자기 음성을 줄이지만 완벽하지 않다. Residual echo, keyboard noise와 짧은 “아니요”를 구분해야 한다.</p>
          <p>Interruption이 확정되면 audio generation을 멈추는 것만으로 부족하다. Server output queue, network에 이미 보낸 packet, browser jitter buffer, OS speaker queue를 가능한 범위에서 비우고 새 response epoch를 연다. 이전 epoch의 늦은 tool result가 도착해 새 대화에 삽입되지 않도록 version을 검사한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{T_{stop}}_{\text{끼어든 뒤 실제 무음까지}}={}&\underbrace{T_{detect}}_{\text{사용자 음성 판정}}+\underbrace{T_{cancel}}_{\text{model·tool 취소}}\\&+\underbrace{T_{drain}}_{\text{남은 audio 제거}}+\underbrace{T_{device}}_{\text{speaker 정지}}\end{aligned}`}
          meaning="Interruption latency는 VAD detect time 하나가 아니다. 이미 receiver와 device buffer에 들어간 audio가 길면 server를 즉시 멈춰도 사용자는 한동안 system 목소리를 듣는다. 각 항을 동일한 session clock에서 측정하고 p95를 release gate로 둔다."
          symbols={[[String.raw`T_{detect}`, '새 user speech가 residual echo가 아님을 확정하는 시간'], [String.raw`T_{cancel}`, 'generation과 side-effect 작업에 cancel을 전달하는 시간'], [String.raw`T_{drain}`, '송신·수신 jitter buffer의 stale audio를 제거하는 시간'], [String.raw`T_{device}`, 'OS와 speaker가 stop을 반영하는 시간'], [String.raw`T_{stop}`, 'user가 말한 시점부터 실제 playback이 멈춘 시간']]} />
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{\operatorname{accept}(r)}_{\text{도착 결과를 사용할지}}=\mathbb 1\!\big[{}&\underbrace{r.session=s_{now}}_{\text{현재 대화가 맞음}}\\[-0.1em]&\land\underbrace{r.epoch=e_{now}}_{\text{현재 응답 세대가 맞음}}\big]\end{aligned}`}
          meaning="Barge-in 뒤에도 network에는 이전 response가 시작한 tool result가 늦게 도착할 수 있다. Session ID만 같다고 받아들이면 user가 취소한 답이 새 response에 섞인다. Response epoch 또는 causal version을 함께 비교해 stale result를 폐기한다."
          symbols={[[String.raw`r`, '비동기로 도착한 tool result'], [String.raw`r.session`, 'result가 속한 conversation session'], [String.raw`r.epoch`, 'tool call을 만든 response generation 번호'], [String.raw`s_{now}`, '현재 열린 session ID'], [String.raw`e_{now}`, '마지막 interruption 이후 현재 response epoch'], [String.raw`\mathbb 1`, '조건이 참일 때만 1인 indicator']]} />
      </section>

      <section id="delegation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">빠른 대화와 깊은 추론을 분리하면 무엇을 동기화해야 할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Foreground interaction model은 짧은 acknowledgement, clarification과 turn policy를 낮은 latency로 처리한다. Search나 긴 reasoning은 background model·agent에 위임할 수 있다. 이렇게 하면 user가 기다리는 동안 silence 대신 대화를 유지할 수 있지만, foreground가 아직 모르는 답을 아는 것처럼 말하면 안 된다.</p>
          <p>Delegation request에는 immutable user intent, input evidence range, safety scope와 response epoch를 붙인다. Background result가 오면 provenance와 freshness를 확인하고, 현재 user가 이미 주제를 바꾸지 않았는지 검사한 뒤 speech plan에 반영한다. “찾아보겠습니다”와 verified result를 말하는 action을 분리한다.</p>
        </div>
        <div className="not-prose my-8 min-w-0 divide-y divide-border border-y border-border">
          {[
            ['01', 'Foreground capture', 'Partial audio·text와 turn state를 계속 갱신한다.', '아직 모르는 사실을 확정하지 않는다.'],
            ['02', 'Delegate snapshot', '질문, source scope, response epoch와 cancellation token을 고정한다.', '새 질문과 이전 task를 섞지 않는다.'],
            ['03', 'Keep interaction', '짧은 확인·clarification을 하되 background result를 날조하지 않는다.', 'Backchannel과 최종 답변을 구분한다.'],
            ['04', 'Validate result', 'Source, tool status, freshness, session·epoch를 검사한다.', '취소되거나 낡은 result는 폐기한다.'],
            ['05', 'Speak verified state', '새 semantic plan과 acoustic output을 현재 turn에 연결한다.', '이미 재생한 주장과 충돌하면 명시적으로 정정한다.'],
          ].map(([index, title, action, guard]) => <div key={index} className="grid gap-2 py-5 sm:grid-cols-[3rem_10rem_minmax(0,1fr)_12rem]"><span className="font-mono text-xs font-black text-muted-foreground">{index}</span><strong className="text-sm">{title}</strong><span className="text-xs leading-relaxed text-muted-foreground">{action}</span><span className="text-[10px] font-semibold leading-relaxed text-amber-800 dark:text-amber-200">{guard}</span></div>)}
        </div>
        <h3 id="human-handoff" className="mb-4 mt-10 scroll-mt-20 text-xl font-bold">사람에게 넘기는 순간도 하나의 상태 전이로 기록한다</h3>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Human handoff는 “모델이 자신 없어 보이면 상담원 연결”이라는 문구 하나로 끝나지 않는다. 승인 필수 행동, 정책 위반 가능성, tool 결과 충돌, 반복된 오해처럼 미리 정한 trigger가 발생하면 자동화가 더 이상 어떤 action을 소유하지 않는지 먼저 정해야 한다. Interruption이 동시에 들어왔다면 새 response epoch를 열고, 이전 tool과 audio를 취소한 다음 verified state만 넘긴다.</p>
        </div>
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['01 · Trigger', 'policy reason code와 risk slice를 남긴다.', '근거 없는 “불확실함” 대신 approval_required, tool_conflict, repeated_misunderstanding처럼 재현 가능한 조건을 기록한다.'],
            ['02 · Freeze', '새 side effect를 막고 response epoch를 올린다.', 'Tool cancel acknowledgement, output queue drain과 아직 취소되지 않은 action을 receipt로 남긴다.'],
            ['03 · Package', '현재 목표와 검증된 사실만 handoff packet으로 묶는다.', 'Stable transcript, source receipt, pending action, consent와 PII masking 상태를 포함하고 추정은 분리한다.'],
            ['04 · Accept', '사람 owner의 acknowledgement 뒤에만 소유권을 넘긴다.', 'Session·epoch·human owner·accept timestamp가 없거나 SLA를 넘기면 safe fallback으로 종료하고 자동 action을 재개하지 않는다.'],
          ].map(([step, action, evidence]) => (
            <div key={step} className="grid min-w-0 gap-2 py-5 sm:grid-cols-[7rem_minmax(0,14rem)_minmax(0,1fr)] sm:gap-5">
              <span className="font-mono text-xs font-black text-muted-foreground">{step}</span>
              <strong className="text-sm leading-snug">{action}</strong>
              <p className="text-xs leading-relaxed text-muted-foreground">{evidence}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="media-latency" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">WebRTC(Web Real-Time Communication)는 model 밖의 실시간 media system이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Browser voice는 PCM 배열을 API에 한 번 POST하는 것과 다르다. Capture frame이 codec packet이 되고, ICE(Interactive Connectivity Establishment)가 찾은 route를 통해 RTP(Real-time Transport Protocol)로 전송되며, receiver가 out-of-order와 jitter를 흡수해 playback clock을 만든다. RTCP(RTP Control Protocol) report의 packet loss와 jitter는 network evidence이고, AI trace의 chunk·decision·token timestamp와 연결해야 한다.</p>
          <p>OpenAI가 2026년 5월 공개한 운영 구조는 이 경로의 소유자를 더 잘게 나눈다. Entry와 signaling은 geo steering으로 가까운 Global Relay를 고른다. Relay는 첫 WebRTC packet의 <code>ufrag</code>를 이용해 그 session을 맡을 transceiver로 packet을 보낸다. Transceiver가 ICE 연결 상태, DTLS(Datagram Transport Layer Security) handshake, SRTP(Secure Real-time Transport Protocol) media와 session lifecycle을 소유하고, 그 뒤에서 model과 orchestration backend가 대화 action을 만든다. 이는 공개된 OpenAI production boundary를 설명하는 것이며, 모든 vendor의 내부 배치가 같거나 GPT-Live의 비공개 model 구조가 이렇다고 추정하는 문장이 아니다.</p>
          <p>따라서 route change는 “network가 느려졌다” 한 줄로 진단하지 않는다. Entry가 새 region을 골랐는지, relay가 새 <code>ufrag</code>를 올바른 transceiver로 보냈는지, transceiver가 ICE·DTLS·SRTP state를 다시 열었는지, model의 response epoch와 tool result가 여전히 현재 것인지, receiver가 낡은 audio를 비웠는지를 각각 확인한다.</p>
          <p>Jitter buffer를 크게 하면 packet 변동을 잘 흡수하지만 audible latency와 barge-in drain이 늘어난다. 너무 작으면 underrun과 click이 늘어난다. Average RTT가 같아도 tail jitter와 route change가 p95 대화를 망칠 수 있다.</p>
          <p>Packet loss concealment(PLC)는 잃은 packet의 waveform을 추정해 click과 gap을 줄이지만, 사라진 숫자·고유명사까지 복원하지는 않는다. Media runtime은 missing sequence, FEC(Forward Error Correction, 손실 복구용 중복 정보) recovery, PLC 적용 구간을 timestamp와 함께 ASR(Automatic Speech Recognition, 자동 음성 인식)·evaluation에 넘긴다. 공개 예제에서는 3% random loss와 연속 burst loss를 나눠 partial stability, intent accuracy와 output artifact를 다시 잰다. Opus in-band FEC도 바로 앞 frame 보호에는 유용하지만 여러 packet이 연속으로 빠지는 경우까지 완전히 복구하지 못한다.</p>
        </div>
        <MediaOwnershipExplorer />
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{T_{first}^{(complete)}}_{\text{첫 소리 지연}}={}&\underbrace{T_{turn}}_{\text{발화 끝 판단}}+\underbrace{T_{queue}}_{\text{대기}}+\underbrace{T_{model}}_{\text{첫 음성 code}}\\&+\underbrace{T_{down}}_{\text{출력 전송}}+\underbrace{T_{jitter}}_{\text{재생 buffer}}\\&+\underbrace{T_{decode+play}}_{\text{복원·재생}}\\&+\underbrace{\mathbb 1_{route}T_{reconnect}}_{\text{경로 변경 때만}}\\[0.55em]\underbrace{T_{turn}}_{\text{중복 없이 측정}}={}&\underbrace{t_{endpoint}-t_{complete}}_{\text{같은 시계의 차이}}\end{aligned}`}
          meaning="원점을 사용자의 의미상 발화 완료 시각으로 고정한다. Uplink와 endpoint detector가 겹쳐 실행될 수 있으므로 둘을 임의로 더하지 않고, 같은 session clock에서 완료 시각부터 endpoint 결정 시각까지의 차이를 T_turn으로 한 번만 센다. Route가 유지되면 reconnect 항은 사라진다. Full-duplex에서는 고정된 발화 종료가 없을 수 있으므로 user semantic completion, system speak decision과 first audible timestamp를 함께 남긴다."
          symbols={[[String.raw`T_{first}^{(complete)}`, '사용자의 의미상 발화 완료부터 첫 응답이 speaker에서 들릴 때까지의 시간'], [String.raw`T_{turn}`, '입력 전송과 endpoint 판단의 겹침을 포함한 공통 timestamp 차이'], [String.raw`t_{complete}`, '사용자 발화가 의미상 끝난 session timestamp'], [String.raw`t_{endpoint}`, 'system이 응답 시작을 허용한 endpoint decision timestamp'], [String.raw`T_{queue}`, 'admission과 accelerator queue 대기'], [String.raw`T_{model}`, '첫 decodable speech code까지의 model 시간'], [String.raw`T_{down}`, '첫 output audio packet이 receiver에 도착하는 시간'], [String.raw`T_{jitter}`, 'packet 변동을 흡수하는 receiver buffer'], [String.raw`T_{decode+play}`, 'codec decode와 audio device callback'], [String.raw`\mathbb 1_{route}`, 'transport route를 다시 열어야 할 때만 1인 indicator'], [String.raw`T_{reconnect}`, '새 ICE·DTLS·SRTP state가 media를 다시 전달할 때까지의 추가 시간']]} />
        <VoiceReleaseGate />
      </section>

      <section id="release-evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">좋은 음성 demo를 대화 system evidence로 바꾸는 방법</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>한 문장의 자연스러운 sample은 output codec과 voice quality만 일부 보여 준다. Full-duplex release에는 5–10분 matched conversation, interruption timing, backchannel appropriateness, task success, correction, tool delegation, long silence, overlap speech와 network impairment를 포함한다.</p>
          <p>Human preference도 질문을 분리한다. Pleasantness, listening behavior, interruption, conversational flow와 factual task success를 한 점수로 합치면 예쁜 목소리가 잘못된 tool action을 가린다. Automated user simulator는 반복 regression에 쓰되 실제 사람의 timing·accent·hesitation distribution을 완전히 대체하지 않는다.</p>
          <p>다음 Local PII(Personally Identifiable Information, 개인 식별 정보) redaction은 OpenAI가 공개한 내부 구조가 아니라, 앞의 공개 media boundary 위에 이 글이 제안하는 transfer design이다. 최종 transcript를 cloud에서 지우는 후처리가 아니라 device-side streaming recognizer가 partial span을 감지하고, 여러 update에서 안정된 prefix만 masking한 뒤 외부 model과 trace sink로 보낸다. 아직 불안정한 숫자·이름 구간은 local buffer에 머물며 tool call을 commit하지 않는다. Redaction 시간을 endpoint 뒤에 더하지 않도록 ASR과 병렬로 실행하고, trace에는 raw PII 대신 span type, masking decision과 latency만 남긴다.</p>
          <p>하단 기반이 필요하면 <InternalLink slug="native-speech-generation">Native Speech Generation</InternalLink>에서 response audio가 만들어지는 구조, <InternalLink slug="speech-recognition-objectives">Speech Recognition Objectives</InternalLink>에서 partial transcript, <InternalLink slug="audio-representation-neural-codecs">Audio Representation</InternalLink>에서 frame·codec rate로 내려간다.</p>
        </div>
        <Misconception>Full-duplex 모델의 benchmark reasoning score가 높아도 대화가 자연스럽다는 뜻은 아니다. Reasoning, turn-taking, media latency와 safety는 다른 failure를 잡는 독립 gate다.</Misconception>
        <CapabilityCheck items={[
          'Turn-based, half-duplex와 full-duplex를 device 상태가 아니라 interaction policy로 구분한다.',
          'Listen, speak, pause, interrupt와 delegate action이 참조하는 state를 설계한다.',
          'Barge-in을 echo detection부터 model·tool·buffer·device cancellation까지 추적한다.',
          'Response epoch로 interruption 이전의 늦은 tool result를 폐기한다.',
          'Endpoint, network, queue, model, jitter, decode와 playback의 first-audio budget을 만든다.',
          'Packet loss, FEC·PLC 적용 구간을 ASR partial stability와 output artifact까지 연결한다.',
          '불안정한 PII partial은 local에 보류하고 stable masked prefix만 외부로 보낸다.',
          'Task, turn, audio, latency와 safety gate를 독립적으로 통과시킨 뒤 release한다.',
        ]} />
        <LearningHandoff
          title="현재 실패의 소유자 하나만 골라 이어 읽는다"
          description="모든 음성 논문을 직렬로 읽지 않는다. 공개 full-duplex 원문, 생성, 인식, 표현 또는 edge runtime 중 지금 trace가 막힌 한 갈래만 연다."
          items={[
            { label: '원문으로', slug: 'paper-moshi-2024', title: 'Moshi 원문 복원', reason: '두 audio stream, Mimi codec clock, Temporal·Depth hierarchy와 Inner Monologue의 공개 근거를 확인한다.', learningPathId: 'ai-speech-audio-current-first' },
            { label: '이어 읽기', slug: 'native-speech-generation', title: 'Native Speech Generation', reason: '내용 state, speaker condition과 multi-codebook acoustic output의 생성 책임이 막힐 때 연다.', learningPathId: 'ai-speech-audio-generation' },
            { label: '이어 읽기', slug: 'speech-recognition-objectives', title: 'Speech Recognition Objectives', reason: 'Partial transcript, stable prefix와 frame-label alignment가 막힐 때 연다.', learningPathId: 'ai-speech-audio-recognition' },
            { label: '막히면', slug: 'audio-representation-neural-codecs', title: 'Audio Representation · Neural Codec', reason: 'Sample, frame, codec rate, bitrate와 reconstruction 한계를 계산해야 할 때만 내려간다.', learningPathId: 'ai-speech-audio-representation' },
            { label: '적용하기', slug: 'efficient-inference-on-device', title: 'On-device Inference', reason: 'Local redaction, capture와 작은 latency budget이 실제 device memory·compute에서 막힐 때 구현 경로로 간다.' },
          ]}
        />
        <StopRule>Interaction action, relay·transceiver, model·tool epoch, buffer·device와 human handoff 중 failure owner를 찾고 acceptance receipt를 쓸 수 있으면 이 글의 목표는 끝이다. 그다음에는 그 owner를 설명하는 한 갈래만 연다.</StopRule>
        <SourceNotes sources={[
          { label: 'OpenAI · Introducing OpenAI Presence', href: 'https://openai.com/index/introducing-openai-presence/', note: '2026-07-22 voice·chat agent의 업무 권한, 정책, 승인·escalation, simulation·grader와 배포 후 개선 loop에 대한 현재 production contract.' },
          { label: 'OpenAI · Introducing GPT-Live', href: 'https://openai.com/index/introducing-gpt-live/', note: '2026-07-08 full-duplex continuous interaction, 여러 interaction decision과 background frontier-model delegation의 현재 공개 contract.' },
          { label: 'OpenAI · Low-latency voice at scale', href: 'https://openai.com/index/delivering-low-latency-voice-ai-at-scale/', note: 'Geo-steered entry, Global Relay의 first-packet·ufrag routing, transceiver의 ICE·DTLS·SRTP·session lifecycle과 production media path의 공식 운영 근거.' },
          { label: 'IETF · RFC 8834', href: 'https://www.rfc-editor.org/rfc/rfc8834.html', note: 'WebRTC media transport, RTP/RTCP와 packet-loss·jitter monitoring의 protocol 근거.' },
          { label: 'IETF · RFC 8854', href: 'https://www.rfc-editor.org/rfc/rfc8854.html', note: 'WebRTC audio FEC와 Opus in-band FEC의 single-frame 보호 범위, 연속 loss 한계의 protocol 근거.' },
          { label: 'Défossez et al. · Moshi', href: 'https://arxiv.org/abs/2410.00037', note: 'Parallel user/model audio stream, explicit turn boundary 없는 full-duplex speech LM의 공개 연구 기준점.' },
          { label: 'OpenAI · Advancing voice intelligence', href: 'https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/', note: 'GPT-Realtime-2, live translation과 streaming transcription을 분리한 2026 API product evidence.' },
        ]} />
      </section>
    </>
  );
}
