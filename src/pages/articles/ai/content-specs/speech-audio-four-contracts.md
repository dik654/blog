# Speech · Audio 네 판단 단위 content spec

## 1. 현재 목표

2026년 7월의 상단 질문은 “음성을 text로 바꾸는가?”가 아니라 “실시간 voice agent를 어떤 업무 권한·정책·평가·escalation 계약으로 신뢰하고 배포할 것인가?”다. OpenAI Presence의 production contract를 최상단에, GPT-Live의 full-duplex interaction과 background delegation을 현재 mechanism으로, Moshi를 공개 canonical paper로 둔다.

부모 허브는 다음 네 책임을 독립 분기로 보여 준다.

1. Realtime duplex voice system
2. Native speech generation
3. Speech recognition objectives
4. Audio representation and neural codec

각 분기는 필요할 때만 Audio representation과 Signals and systems foundation을 공통 최소 기반으로 연다. 네 글 모두를 필수 직렬 선행으로 강제하지 않는다.

Transformer와 edge runtime은 재사용 기반 또는 구현 확장이지 모든 독자의 필수 직렬 단계가 아니다.

## 2. 비공개 전이 문제

8 kHz 전화망에서 한국어·영어가 섞인 고객 상담 assistant를 출시한다. 사용자는 모델이 말하는 중간에 정정하고, 짧은 “네”와 생각 중 침묵을 번갈아 사용한다. Network에는 2% packet loss와 가변 jitter가 있고, 제품은 first audible response p95 650 ms, interruption stop p95 180 ms, intent success 95%를 요구한다. 민감 숫자는 local redaction 전에는 cloud로 보내면 안 된다.

작성된 네 글과 기존 신호 기반만으로 다음을 판정할 수 있어야 한다.

- 8 kHz에서 보존 가능한 주파수와 sample/frame/token rate
- log-Mel, learned latent, semantic token, acoustic codec token 중 작업별 표현 선택
- CTC, RNN-T, encoder-decoder 중 partial transcript와 latency에 맞는 objective
- cascade와 native speech-to-speech의 정보·감사·latency 경계
- multi-codebook token의 bitrate와 hierarchical generation order
- turn-based, half-duplex, full-duplex를 구분하는 stream/state contract
- barge-in 시 output cancel, echo leakage, stale tool result의 처리 순서
- capture, packet, jitter, model, decode, playback budget과 release gates
- 8 kHz narrowband input을 16 kHz interface에 맞출 때 복원되지 않는 대역과 front-end adaptation
- 2% loss에서 FEC·PLC 적용 구간, random·burst loss와 ASR/output degradation의 연결
- local partial PII redaction, stable-prefix masking과 cloud·trace boundary

문제 문항은 본문에 그대로 노출하지 않고 section coverage와 capability check에만 사용한다.

## 3. 글별 ownership

### A. `realtime-duplex-voice-systems`

**독립 판단:** turn-based demo가 실제 full-duplex product인지, 대화·transport·delegation evidence로 판정한다.

소유 범위:

- continuous input/output stream과 interaction decisions
- listen/speak/pause/interrupt/tool state
- echo cancellation, barge-in, stale output cancellation
- foreground interaction model과 background reasoning delegation
- geo-steered entry, Global Relay의 first-packet·ufrag routing, transceiver의 ICE·DTLS·SRTP·session lifecycle
- WebRTC/RTP, jitter buffer, packet loss, route-change reconnect, first-audio·stop latency
- policy trigger, freeze, verified-state package, human acknowledgement와 timeout fallback의 handoff receipt
- FEC·PLC, missing-frame timestamp와 ASR·output evaluation handoff
- local partial PII masking, stable-prefix commit과 외부 전송 경계
- conversational flow, interruption, task, safety release gates

소유하지 않음:

- RVQ 내부 계산
- CTC/RNN-T alignment objective
- TTS acoustic decoder architecture 세부

Viz가 제거할 오해:

1. “Full-duplex는 microphone과 speaker를 동시에 켠 상태다.”
2. “Model time만 줄이면 대화 latency가 줄어든다.”
3. “말을 빨리 시작하면 interruption도 잘 처리한다.”

### B. `native-speech-generation`

**독립 판단:** cascade와 native speech-to-speech 중 어느 경계를 제품에 사용할지, 그리고 acoustic token generation이 실제 first packet과 음성 품질을 어떻게 정하는지 판정한다.

소유 범위:

- ASR→LLM→TTS cascade와 audio-native path
- semantic state, acoustic state, text audit path
- codec language model과 multi-codebook hierarchy
- Thinker–Talker, Inner Monologue의 역할 경계
- streaming decode, voice identity, prosody, intelligibility, safety

소유하지 않음:

- audio codec의 RVQ 학습 상세
- full-duplex transport state machine
- ASR alignment lattice 상세

Viz가 제거할 오해:

1. “Native는 중간 text나 semantic state가 전혀 없다.”
2. “여러 codebook은 전부 같은 시점에 독립적으로 생성된다.”
3. “한 장의 MOS 또는 자연스러운 demo가 사실성·identity·latency를 보장한다.”

### C. `speech-recognition-objectives`

**독립 판단:** frame 수와 label 수가 다른 audio-to-text 문제에서 CTC, RNN-T, encoder-decoder objective를 streaming·context·alignment 요구에 맞게 고른다.

소유 범위:

- frame-label length mismatch와 latent alignment
- CTC blank/repeat collapse와 path sum
- RNN-T encoder, prediction network, joint lattice
- attention encoder-decoder의 full-context dependency
- partial hypothesis stability, endpoint, timestamp, WER/CER/semantic slot

소유하지 않음:

- STFT와 RVQ의 상세
- speech synthesis
- WebRTC transport

Viz가 제거할 오해:

1. “CTC blank는 space 문자다.”
2. “낮은 final WER이면 partial transcript도 안정적이다.”
3. “RNN-T의 prediction network는 일반 외부 language model과 같다.”

### D. `audio-representation-neural-codecs`

**독립 판단:** 어떤 acoustic 정보를 보존하고 어떤 시간·bitrate·latency 비용을 감수할지 representation 계약으로 고른다.

소유 범위:

- sampling, frame, hop, receptive field
- 8 kHz narrowband capture, resampling adapter와 유효 대역 mask
- STFT, power, mel filterbank
- continuous learned latent, semantic token, acoustic token
- encoder→RVQ→decoder, residual refinement
- token rate × codebook × vocabulary bitrate
- causal receptive field, reconstruction, codebook collapse, streamability

소유하지 않음:

- ASR target alignment
- language reasoning
- dialogue state

Viz가 제거할 오해:

1. “16 kHz audio를 80-bin mel로 바꾸면 80 token이다.”
2. “Codebook 수를 늘리면 품질만 좋아지고 생성 비용은 그대로다.”
3. “좋은 offline reconstruction codec은 자동으로 low-latency streaming codec이다.”

## 4. 수식 계약

모든 display 수식은 수식 내부의 `underbrace`에 한글 항 역할을 쓰고 바로 아래 FormulaNote에서 계산 의도와 기호를 다시 설명한다.

- Representation: Nyquist, frame count, STFT/mel energy, RVQ residual, bitrate
- ASR: CTC path collapse and sum, RNN-T joint probability, WER and partial revision
- Generation: latent factorization, codebook autoregression, first-packet schedule
- Duplex: interaction decision, latency sum, interruption stop, multi-gate release

모바일에서 한 줄 식이 0.80 아래로 축소되면 의미 단위 `aligned` 여러 줄로 나눈다.

## 5. source anchors

| Source | 글 | claim boundary |
|---|---|---|
| OpenAI Presence, 2026-07-22 | Duplex | voice·chat agent의 업무별 지식·system access, 승인·escalation, simulation·grader와 배포 후 개선 contract. 내부 speech architecture로 확대하지 않는다. |
| OpenAI, GPT-Live, 2026-07-08 | Duplex | full-duplex continuous interaction과 background delegation의 공개 claim. 내부 token architecture는 추정하지 않는다. |
| OpenAI, low-latency voice at scale, 2026-05-04 | Duplex | Geo-steered entry, Global Relay의 first-packet·ufrag routing, transceiver의 ICE·DTLS·SRTP·session lifecycle. 모든 vendor의 내부 구조나 제품 latency 수치로 일반화하지 않는다. |
| RFC 8834 | Duplex | WebRTC RTP, RTCP packet-loss·jitter 관측의 protocol 근거. AI turn policy는 다루지 않는다. |
| RFC 8854 | Duplex | WebRTC FEC와 Opus in-band FEC의 single-frame 보호 범위. 잃은 의미를 완전히 복원한다고 확대하지 않는다. |
| Moshi, 2024 | Generation·Duplex | parallel user/system stream, Mimi codec, Inner Monologue와 공개 latency setting. GPT-Live 내부 구현으로 확대하지 않는다. |
| Qwen3-Omni technical report/repository, 2025 | Generation | Thinker–Talker와 multi-codebook 공개 구조. API와 local runtime capability를 구분한다. |
| EnCodec, 2022 / SoundStream, 2021 | Representation | streaming neural codec, RVQ와 bitrate-quality evidence. speech LM의 semantic quality를 보장하지 않는다. |
| CTC, 2006 | ASR | alignment-free path sum and collapse. streaming product behavior 전체를 보장하지 않는다. |
| RNN Transducer, 2012 | ASR | transcription/prediction/joint network와 output-conditioned alignment. 현재 production variant 전체로 일반화하지 않는다. |
| Whisper, 2022 | ASR | log-Mel encoder-decoder, multilingual weak supervision와 OOD robustness. causal streaming ASR의 canonical 구현은 아니다. |
| Conformer, 2020 | ASR | local convolution과 global attention backbone. alignment objective와 별도 축이다. |

## 6. 기존 글 migration

`speech-audio-models` slug는 유지하고 부모 카테고리의 필수 질문 선택 허브로 둔다. 동시 대화·생성·인식·표현은 child subcategory로 나눠 각 페이지에 소유 글 하나만 보이고, 부모가 child article을 다시 평탄화하지 않는다.

## 7. 완료 조건

- 네 글이 서로 다른 reader decision과 capability check를 가진다.
- current-first path는 5단계이고 역사 하향은 신호와 시스템에서 멈춘다.
- 각 Viz는 interaction에 따라 하나의 오해를 눈으로 반증한다.
- 390·768·1440px에서 document, figure, formula overflow가 0이다.
- 현재 source와 canonical source가 내부 article link와 중복되지 않는다.
- 비공개 전이 문제의 모든 판정 항목을 네 글만으로 재구성할 수 있다.

## 8. 협업 검토와 판정

- 넓은 Claude Sonnet 검토는 예산 상한 USD 0.407322에서 결과 없이 종료했다. Bare fable 재시도는 인증되지 않아 시작하지 못했다. 두 시도는 성공 검토로 계산하지 않는다.
- 완성된 책임 계약만 전달한 bounded Claude Sonnet 검토는 USD 0.179151에서 완료됐다.
- 8 kHz, 2% packet loss, local PII의 책임자가 불명확하다는 세 지적을 실제 본문과 대조했다.
- 8 kHz Nyquist 설명은 이미 있었지만 model-interface adaptation이 부족해 Representation에 추가했다.
- Packet loss와 PII는 지표만 있고 실행 handoff가 없었으므로 Duplex runtime에 FEC·PLC trace와 stable-prefix local redaction을 추가했다.
- Claude 제안을 그대로 옮기지 않고 기존 source, article ownership과 private transfer problem에 실제 공백이 있는 경우만 반영했다.
