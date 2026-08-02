# Speech · Audio current-first reconstruction report

## Observed

`speech-audio-models` 한 글이 sampling, spectrum, ASR, native speech, WebRTC, evaluation과 edge deployment를 모두 소유했다. 범위는 넓었지만 reader failure의 책임자가 보이지 않았고, `signals → tokenizer → Transformer → edge`를 모두 필수로 강제했다. 현재 full-duplex 연구를 읽으려는 독자가 CTC와 codec, turn policy와 model latency를 같은 비교 축으로 섞을 위험이 있었다.

## Inferred

음성 시스템은 최소 네 독립 판단으로 나뉜다.

1. Interaction runtime은 듣기·말하기·중단·위임과 media transport를 소유한다.
2. Generation은 semantic state에서 acoustic code와 waveform을 만드는 순서를 소유한다.
3. Recognition은 acoustic frame과 transcript label의 alignment·partial commit을 소유한다.
4. Representation은 파형에서 feature·latent·codec code로 바뀔 때의 정보·bitrate를 소유한다.

`signals-systems-convolution`은 더 아래의 최소 과학 기반이고, Transformer·edge runtime은 blocker가 생길 때 여는 선택 경로다.

## Decided

- 기존 slug는 12분짜리 경로 허브로 보존하고 중복 본문은 네 새 글에 흡수했다.
- 필수 경로를 `Realtime duplex → Native generation → ASR objectives → Audio representation → Signals and systems`로 고정했다.
- 현재 기준점은 OpenAI GPT-Live, 공개 canonical full-duplex 기준점은 Moshi로 두었다.
- 비공개 전이 문제는 8 kHz 한국어·영어 전화, 2% packet loss, first-audio p95 650 ms, stop p95 180 ms, intent 95%, local PII redaction으로 두었다.
- 역사 하향은 신호와 시스템에서 끊고, 오래된 음향학·speech 논문을 필수 경로에 계속 추가하지 않는다.

## Changed

- `src/pages/articles/ai/realtime-duplex-voice-systems.tsx`
- `src/pages/articles/ai/native-speech-generation.tsx`
- `src/pages/articles/ai/speech-recognition-objectives.tsx`
- `src/pages/articles/ai/audio-representation-neural-codecs.tsx`
- `src/pages/articles/ai/speech-audio-core/viz/SpeechSystemExplorers.tsx`
- `src/pages/articles/ai/speech-audio-models.tsx`
- `src/pages/articles/ai/content-specs/speech-audio-four-contracts.md`
- `src/content/ai/articlesCurrentFlows.ts`
- `src/content/learning-paths.ts`
- `src/content/ai/topdownResearchTracks.ts`
- `src/components/learning/ArticleLearning.tsx`
- `tests/ai-current-flow-gaps.spec.ts`
- `tests/ai-authored-topic-paths.spec.ts`

## Formula and Viz reasoning

긴 한 줄 수식은 container scale을 낮추는 대신 의미 state, 조건 context, latency 항 묶음으로 재정의해 여러 줄로 나눴다. 각 underbrace에는 한글 역할을 두고 FormulaNote에는 기호와 그 연산을 쓰는 이유를 남겼다. 특히 acoustic factorization은 `c_{t,q}`, AED는 `c_u`, RVQ는 `d_j(e)`, bitrate는 `B_frame`을 도입해 한 줄 폭을 줄이면서 실행 순서를 더 분명히 했다.

다섯 Viz는 장식이 아니라 다음 오해를 반증한다.

- 같은 1초 audio라도 representation마다 길이·보존 정보가 다르다.
- CTC, RNN-T, AED는 backbone 이름이 아니라 alignment 책임이 다르다.
- Native speech도 semantic state와 acoustic refinement 순서가 있다.
- Device가 동시에 켜진 상태와 continuous interaction policy는 다르다.
- Model latency가 통과해도 turn, media, safety gate가 실패하면 release할 수 없다.

## Claude collaboration

- Wide Sonnet medium: USD 0.407322에서 budget 종료, review text 없음.
- Bare fable: 인증 실패, 비용 없음.
- Bounded Sonnet low: USD 0.179151, 완료.
- 반환된 8 kHz adaptation, packet-loss PLC/FEC, local partial PII ownership 세 공백을 본문과 대조해 모두 유효한 범위만 반영했다.
- 8 kHz의 물리적 상한은 이미 있었으므로 누락이라고 기록하지 않고 16 kHz model-interface adaptation만 추가했다.

## Verified

- Focused ESLint 통과.
- Production build 통과. 기존 large chunk warning만 남는다.
- Speech 네 글의 360·390·768·1440px 16개 조합 Playwright 통과.
- 학습 경로 첫 글과 5단계 링크 검사 통과.
- 모든 새 KaTeX 식에 parse error·raw command·가로 overflow가 없고 mobile rendered font는 9.5px 이상이다.
- 다섯 Viz의 mobile·desktop screenshot 10장을 직접 검토했다.
- Document와 figure overflow는 0px이며 내부 가로 scroll이 없다.
- Audio Viz 수치는 실제 model benchmark가 아니라 구조 설명용 가상 조건임을 명시했다.

## 4B · 9B handoff

4B worker는 한 글에서 `reader_question`, `owned_state`, `not_owned`, `formula_operation`, `visual_misconception`, `source_boundary`만 추출한다. 9B reviewer는 네 packet과 private transfer problem을 받고 ownership 공백을 찾는다. Orchestrator만 path 등록, shared notation, responsive screenshot, formula scale과 build를 검증한다. 외부 reviewer의 문장은 바로 반영하지 않고 반드시 기존 본문과 대조해 `missing`, `already_present`, `partially_present`로 판정한다.
