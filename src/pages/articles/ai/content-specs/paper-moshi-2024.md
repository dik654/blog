# Moshi (2024) canonical source content spec

## Goal
- 독자가 cascade turn-taking과 Moshi의 continuous two-stream modeling 차이를 실행 순서로 설명한다.
- 24 kHz waveform이 Mimi의 12.5 Hz·8-level RVQ token이 되고, Temporal Transformer와 Depth Transformer가 긴 시간축과 한 frame 안 codebook 축을 나눠 생성하는 이유를 계산한다.
- Inner Monologue, acoustic delay pattern, theoretical 160 ms와 practical 200 ms를 분리하고 원문 evidence·negative result·미검증 production claim을 구분한다.

## Ownership
| Article | Owns | Does not own |
|---|---|---|
| `realtime-duplex-voice-systems` | Presence/GPT-Live product interaction, cancellation, delegation, WebRTC and release evidence | Moshi paper reconstruction |
| `paper-moshi-2024` | Moshi two-stream token graph, Mimi-to-hierarchical generation, Inner Monologue delay, source ablations and limits | General codec derivation, current product policy |
| `native-speech-generation` | General cascade/native and Thinker-Talker generation decision | Moshi paper-wide evidence |
| `audio-representation-neural-codecs` | Sampling, STFT, RVQ and bitrate foundations | Multi-stream dialogue model |
| `speech-recognition-objectives` | CTC/RNN-T/attention alignment objectives | Moshi-derived ASR as a state-of-the-art claim |

## Why this remains a separate source article
The existing branch articles intentionally answer different product questions. None reconstructs one Moshi forward pass across:

`two waveforms -> Mimi tokens -> stream-aligned frame -> Temporal Transformer -> Depth Transformer -> text/audio outputs -> delay/evidence`.

The source article is therefore a compact paper spine and hands off each responsibility to the existing branch instead of duplicating their full tutorials.

## Source anchors
| Area | Primary source address | Why |
|---|---|---|
| Research question | Abstract, Section 1 | Full duplex, text bottleneck, theoretical/practical latency |
| System map | Figure 1, Sections 3.1-3.4 | Helium, Mimi, hierarchical generation, Inner Monologue |
| Mimi | Sections 3.3 and 5.2, Tables 3-4 | 24 kHz, 12.5 Hz, 8 RVQ, 1.1 kbps, causal 80 ms frame, metric disagreement |
| Hierarchy | Sections 3.4.1-3.4.3 | Temporal length S versus K·S, Depth length K, multi-stream delay |
| Inner Monologue | Section 3.4.4, Tables 6 and 8 | Time-aligned text, ASR/TTS delay interpretation, spoken QA effect |
| Latency | Abstract, Sections 5.3 and 5.8 | 80/160/240/640 ms theoretical delay, 200 ms practical headline |
| Limits | Sections 5.7-5.8 and conclusion | ASR/TTS are flexibility demonstrations; model size and evaluation scope |

## Section plan
1. Full-duplex means two streams remain live
   - Cascade endpoint boundaries versus continuous user/model audio.
   - User and model streams are aligned at the same codec frame rate.
   - Viz: state trace for silence, overlap, interruption and response.
2. Mimi turns waveform into a low-rate semantic-acoustic clock
   - 24 kHz input, causal encoder/decoder, 12.5 frame/s, Q=8, 1.1 kbps.
   - First latent step corresponds to 80 ms audio; do not call this end-to-end response latency.
   - Hand off RVQ derivation to the codec article.
3. Temporal and Depth Transformers divide two axes
   - Flattened K·S generation is too expensive for streaming.
   - Temporal Transformer advances once per 80 ms frame over S.
   - Depth Transformer generates up to K tokens inside that frame.
   - Multi-stream input carries user and model audio token columns.
   - Viz: step a frame and inspect Temporal versus Depth calls and token ownership.
4. Inner Monologue and delay
   - Text token aligned to 12.5 Hz provides a linguistic state without external online ASR.
   - Audio/text relative delay can derive streaming ASR or TTS behavior.
   - Final Moshi pretrains acoustic delay 2 and fine-tunes delay 1 for theoretical 160 ms.
   - Practical 200 ms is an abstract-level end result, not a decomposed hardware latency receipt.
   - Viz: select 80/160/240/640 ms patterns and see quality/compute claims.
5. Source evidence
   - Table 4 objective metric disagreement: adversarial-only Mimi VisQOL 1.84 but MUSHRA 81.0±1.3; non-adversarial-only VisQOL 2.82 but MUSHRA 58.8±1.8.
   - Table 5 RQ-Transformer is marginal at diagonal 640 ms pattern (42.2→40.3 PPL) but critical at reduced 240 ms pattern (135.4→36.8).
   - Table 6 Inner Monologue row NLL 2.77 and transcript length 1920 versus matched depthwise/semantic-weight row 3.65 and 602.
   - Table 8 spoken QA Moshi 26.6/62.3/22.8 versus without Inner Monologue 9.2/21.0/7.3, with exact benchmark scope.
   - Table 9 pause·gap·overlap receipts show generated-dialogue dynamics, not real-user barge-in success.
   - Derived ASR/TTS WER must be labeled flexibility demonstrations, not SOTA.
   - Viz: one evidence receipt at a time, never a flat leaderboard.
6. Limits and current handoff
   - 160 ms theoretical scheduling delay is not microphone-to-playback p95.
   - Mimi 80 ms first frame is not full system latency.
   - Full-duplex benchmark and conversational dynamics do not prove production permission/cancellation behavior.
   - Hand off interaction to `realtime-duplex-voice-systems`, generation to `native-speech-generation`, codec to `audio-representation-neural-codecs`, signal floor to `signals-systems-convolution`.

## Display equations

```latex
\begin{aligned}
f_{\mathrm{frame}}&=12.5\ \mathrm{Hz}\\
\Delta t_{\mathrm{frame}}&=1/f_{\mathrm{frame}}=80\ \mathrm{ms}\\
R_{\mathrm{index}}&=f_{\mathrm{frame}}Q\log_2V
\end{aligned}
```

```latex
\begin{aligned}
T&=12.5\cdot\mathrm{duration}\\
\text{flat steps}&=K\cdot T\\
\text{hierarchical steps}&=T\ \text{Temporal calls}+K\ \text{Depth positions per frame}
\end{aligned}
```

```latex
\begin{aligned}
\tau_{\mathrm{theory}}
&=(1+\delta_{\mathrm{acoustic}})\Delta t_{\mathrm{frame}}\\
\delta_{\mathrm{acoustic}}=1
&\Rightarrow \tau_{\mathrm{theory}}=160\ \mathrm{ms}
\end{aligned}
```

Every display formula needs Korean operation labels and a nearby FormulaNote explaining why the operation exists. Do not place a long fixed-width equation and shrink it below 12 px.

## Authoring-only transfer problem
Do not publish verbatim.

> A five-second conversation window has two live audio streams. Each stream is encoded at 12.5 frames/s with 8 RVQ levels and vocabulary 2048. The system uses one time-aligned text token per frame and acoustic delay 1. Compute the approximate frame count, audio token decisions, index bitrate per stream, hierarchical versus naive flattened sequence pressure and theoretical scheduling delay. Then explain why none of these numbers alone certifies microphone-to-playback p95 or correct barge-in cancellation.

The article is sufficient only if the reader can derive:
1. Five seconds is about 62.5 codec frames; implementation must define rounding/padding.
2. Audio decisions are `2 streams × 8 levels × frames`, while Inner Monologue adds a text stream at the temporal clock.
3. `12.5×8×11=1100 bit/s` is index payload per stream before framing/protocol overhead.
4. Temporal calls advance with frames while Depth handles codebook positions inside a frame; hierarchy avoids sending K·S steps through the large Temporal Transformer.
5. Delay 1 adds one 80 ms acoustic step to the current frame for 160 ms theoretical delay.
6. Capture, feature buffering, network, queue, model runtime, packetization, jitter and playback remain outside that theoretical schedule.
7. Full-duplex generation does not by itself guarantee cancellation, tool permission or production policy.

## Viz contract
- DOM/CSS only for visible labels and controls; no fixed-width SVG text.
- Prose appears before every Viz.
- Stable at 390/768/1440 with visible text >=12 px.
- Blue = temporal/shared model state, emerald = accepted evidence, amber = latency/heuristic, red = unsupported production claim.
- Paper numbers and educational fixtures must be visibly distinct.
- User-controlled step transition only; no decorative autoplay.

## Stop rule
Stop at Moshi as the first required public full-duplex speech-text source. Do not descend through every codec, audio LM or dialogue paper. Open the existing codec, generation, interaction or signal article only when that responsibility blocks the current question.
