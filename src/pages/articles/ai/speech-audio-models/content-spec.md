# Speech · Audio AI 질문 선택 허브 content spec

## Goal

- 독자는 음성 제품의 증상을 모델 이름으로 바로 연결하지 않고, 관측 시각과 경계 증거를 이용해 interaction, generation, recognition, representation 중 첫 고장 책임을 고른다.
- 이 글은 네 분기를 모두 선행 학습시키는 백과사전이 아니라, 현재 문제에 필요한 한 분기와 최소 기반만 여는 유한 진단 절차를 증명한다.

## Article role and stopping boundary

| Item | Contract |
|---|---|
| Current top | 2026년 음성 agent의 업무 결과, 정책, 권한, escalation, production evaluation |
| Mechanism entry | Continuous full-duplex interaction, foreground conversation과 background delegation |
| Public canonical anchor | Moshi의 parallel audio streams, Mimi codec clock, Temporal·Depth generation, Inner Monologue |
| Four failure owners | Interaction runtime, generation, recognition, representation |
| Shared lower bound | Sampling, spectrum, filter와 delay가 실제 blocker일 때만 Signals and Systems |
| Stop rule | 첫 비정상 경계와 소유 분기를 고르고 측정 가능한 성공 기준을 만들면 허브에서 멈춤 |
| Deferred | 각 모델의 학습법, codec·CTC 수식 상세, WebRTC protocol 세부는 child article이 소유 |

## Source anchors

| Area | Primary source | Why it matters | Claim ceiling |
|---|---|---|---|
| Production contract | OpenAI Presence, 2026-07-22 | 정책, 권한, approved action, simulation·grader, human escalation을 현재 상단으로 둔다. | 내부 speech architecture를 추정하지 않는다. |
| Continuous interaction | OpenAI GPT-Live, 2026-07-08 | 듣기·말하기·멈춤·중단·tool invocation을 초당 여러 번 판단하고 깊은 작업을 위임한다는 공개 제품 설명이다. | 비공개 token, codec, training 구조를 단정하지 않는다. |
| Public mechanism | Défossez et al., Moshi, 2024 | Parallel user/model audio stream과 공개 full-duplex speech-to-speech 구조를 복원한다. | GPT-Live나 다른 vendor의 구현과 동일하다고 보지 않는다. |
| Media evidence | RFC 8834 | RTCP packet loss와 jitter를 transport 증거로 관측할 수 있다. | Packet metric만으로 turn policy 실패를 증명하지 않는다. |

## Full-scope map

| Topic | Must cover | Depth | Risk if omitted |
|---|---|---|---|
| Product outcome versus model metric | 해결률·정책·escalation과 음질·WER·latency를 다른 층으로 둔다. | deep | 자연스러운 demo를 production 성공으로 오판한다. |
| Symptom versus owner | 같은 “느림”도 recognition commit, interaction decision, generation, transport·playback이 원인일 수 있다. | deep | 유명 모델이나 codec을 먼저 바꾼다. |
| Boundary clock subtraction | 인접 event 시각의 차이로 구간 비용을 계산하고 첫 비정상 구간을 찾는다. | deep | 누적 timestamp나 전체 latency만 보고 downstream 증상을 첫 원인으로 오판한다. |
| Streaming overlap | 단순 구간 합은 critical path와 겹침 때문에 전체 지연과 다를 수 있다. | brief | 모든 모듈 시간을 더해 잘못된 budget을 만든다. |
| Four branches | Interaction, generation, recognition, representation의 질문·증거·출구를 분리한다. | deep | Architecture, objective, runtime, evaluation을 같은 표에 섞는다. |
| Shared foundation trigger | Window, hop, sample rate, filter delay가 blocker일 때만 신호 기반을 연다. | brief | 기초를 끝없이 과거로 내려간다. |
| Evidence provenance | Current product claim, public paper, protocol standard, 저자 synthesis를 분리한다. | deep | 한 source의 주장을 다른 시스템에 일반화한다. |

## Hidden transfer check

8 kHz 한국어·영어 고객 상담에서 사용자가 agent 발화 중 “아니요”라고
정정한다. ASR partial은 80 ms에 정정을 포착했고 interaction policy는
120 ms에 cancel을 발행했지만 speaker는 560 ms 뒤에 멈춘다. Final WER는
낮고 음질 sample도 자연스럽다.

본문만으로 다음을 판정할 수 있어야 한다.

1. 낮은 final WER와 자연스러운 음질은 이 실패의 반증이 아니다.
2. 첫 비정상 구간은 cancel 발행 뒤 실제 playout 정지까지의 440 ms다.
3. 우선 읽을 글은 `realtime-duplex-voice-systems`다.
4. Codec과 CTC 상세는 이 trace만으로는 열지 않는다.
5. Success criterion은 end-to-end interruption stop p95와 stale playback 제거다.

문제 문장은 본문에 시험 형태로 노출하지 않고 실행 trace와 capability
check로 흡수한다.

## Section 1: 현재 상단 -- 무엇을 잘하는 음성 제품인가?

- Concept:
  - 음성 agent의 최상단은 자연스러운 목소리가 아니라 승인된 업무 결과, 정책 준수, human handoff다.
  - GPT-Live의 full-duplex는 현재 interaction mechanism이고 Presence의 production contract와 같은 층이 아니다.
- Execution flow:
  1. 사용자가 업무 요청을 말한다.
  2. Interaction system이 대화를 유지하고 필요하면 background reasoning을 위임한다.
  3. Agent가 approved action 또는 escalation을 선택한다.
  4. Simulation·grader와 production outcome이 성공을 판정한다.
- Failure modes:
  - 자연스러운 demo지만 잘못된 action을 실행한다.
  - Voice latency는 낮지만 interruption 후 stale tool result가 재생된다.
  - Product claim을 공개 architecture evidence로 오해한다.
- Viz plan:
  - 이 절에서는 별도 장면을 두지 않고 짧은 product-to-mechanism prose로 다음 trace Viz를 준비한다.

## Section 2: 경계 시각 -- 같은 “느림”을 어떻게 분해할까?

- Concept:
  - 증상은 관측 결과이고 책임자는 원인을 바꿀 수 있는 boundary owner다.
  - 인접 event 시각을 빼서 구간 duration을 만들고, 처음 비정상인 구간을 찾는다.
- Key variables:
  - `t_i`: 사용자 interruption을 포착한 시각.
  - `t_h`: recognition이 정정 발화를 stable partial로 확정한 시각.
  - `t_d`: interaction policy가 cancel을 발행한 시각.
  - `t_s`: speaker playout이 실제로 멈춘 시각.
- Equation contract:
  - `T_stop = (t_h-t_i) + (t_d-t_h) + (t_s-t_d)`.
  - 각 괄호에 “정정 감지”, “중단 판단”, “취소 전달·버퍼 비우기” 한글 underbrace를 둔다.
  - FormulaNote는 왜 절대 시각이 아니라 차이를 쓰는지, 합이 유효하려면 같은 critical path여야 한다는 경계를 설명한다.
- Viz plan:
  - Step 0: 사용자가 interrupt했는데 560 ms 동안 agent 음성이 남는 증상.
  - Step 1: 네 event clock과 각 boundary owner를 세로·가로 반응형 timeline으로 표시.
  - Step 2: 80/40/440 ms delta를 비교하고 첫 비정상 구간을 강조.
  - Step 3: Interaction runtime branch를 선택하고 CTC·codec 조정은 보류.
  - Step 4: stop p95와 stale playback을 release evidence로 고정.

## Section 3: 네 분기 -- 어떤 증거가 어떤 글을 여는가?

- Concept:
  - 네 branch는 모델 taxonomy가 아니라 서로 다른 failure owner다.
- Branch contracts:
  - Interaction: interruption, endpoint, media transport, delegation.
  - Generation: content, speaker identity, prosody, first packet.
  - Recognition: partial revision, commit delay, final WER/CER.
  - Representation: frame rate, bitrate, reconstruction, causal delay.
- Interaction:
  - `SpeechRouteExplorer`에서 branch를 누르면 질문, 먼저 남길 evidence, 출구 글이 동시에 바뀐다.
  - 색만 바뀌지 않고 narrative와 evidence owner가 실제로 바뀌어야 한다.

## Section 4: 내려갈 때와 멈출 때

- Concept:
  - “바닥부터”는 모든 역사 원문을 읽는 것이 아니라 현재 failure에 필요한 최소 물리·수학 기반까지 내려가 다시 trace로 올라오는 것이다.
- Stop rules:
  1. 첫 비정상 boundary를 지목할 수 있다.
  2. 소유 branch의 success metric을 쓸 수 있다.
  3. 다음 실험에서 바꿀 state와 고정할 state를 구분한다.
  4. 이 셋이 되면 sibling branch와 더 오래된 원문은 열지 않는다.
- Handoff:
  - 네 child branch와 shared signals foundation을 `LearningHandoff`로 명시한다.

## Prose-to-viz visual standard

- SVG나 축소된 한 장 전체 구조를 쓰지 않는다.
- Desktop은 event clock을 가로로, mobile은 세로로 전환한다.
- 모든 event label은 11 px 이상이며 active delta의 원인·소유자·판정이 한 화면에 보인다.
- 두꺼운 색 테두리, gradient, 중첩 카드, 장식 아이콘 grid를 피한다.
- Semantic accent는 input, decision, cancellation, playout 네 상태에만 사용한다.
- Scene 전에 반드시 prose로 “무엇을 확인할 장면인지” 설명한다.
- 내부 가로 스크롤을 만들지 않는다.

## Coverage recheck

| Scope item | Covered by | Gap |
|---|---|---|
| Current product contract | Section 1 + SourceNotes | none |
| Symptom/owner distinction | Sections 2–3 | none |
| Boundary delta math | Section 2 formula + FormulaNote | none |
| Controlled causal Viz | Section 2 StepViz | none |
| Four branch selection | Section 3 explorer | none |
| Minimal foundation and stop rule | Section 4 | none |
| Source intent and ceiling | SourceNotes + source anchors | none |
| Hidden transfer check | Trace values + capability check | none |
