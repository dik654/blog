# 2026-07 AI 최신 흐름 공백 감사와 보강 명세

## 1. 작업 의도

입력 영상의 내용을 별도 아티클로 요약하지 않는다. 영상은 기존 current-first curriculum을 검사하는 외부 관측값으로만 사용한다. 각 주장을 기존 아티클과 대조하고, 최신 논문·회사 연구를 읽는 데 필요한 독립적인 계산 계약이 없을 때만 새 경로를 만든다.

## 2. 공백 판정

| 영상에서 관측한 흐름 | 기존 범위 | 판정 | 조치 |
|---|---|---|---|
| Sparse MoE, hybrid attention | LLM Architecture Gallery, Sparse MoE, Hybrid & Linear | 충분 | 추가 없음 |
| Reasoning RL, RLVR, distillation | RLHF, Open-R1, RLVR, Knowledge Distillation | 충분 | 추가 없음 |
| Agent, RAG, harness engineering | Agentic Patterns, RAG, LLM Harness, Claw Code | 충분 | 추가 없음 |
| GPU serving, KV cache, speculative decode | vLLM, PagedAttention, Spec Decode, GPU HPC | 부분 충분 | device budget 관점만 새 글에서 연결 |
| Web 정제, 데이터 mixture, synthetic data engine | training pipeline과 RL 글에 산재 | 공백 | `LLM 데이터 엔진` 추가 |
| Native low-bit, MTP, on-device accelerator placement | quantization과 serving에 산재 | 공백 | `효율 추론 · On-device` 추가 |
| Native audio model, realtime duplex voice | 신호 글과 VLM에 일부 언급 | 공백 | `음성 · 오디오 AI` 추가 |
| Current video world model, action-conditioned planning | 고전 model-based RL과 robot 글은 존재 | 현대 연결 공백 | `World Model · Physical AI` 추가 |

## 3. 배치 규칙

- `LLM 데이터 엔진`, `효율 추론 · On-device`는 LLM의 하위 경로다.
- `음성 · 오디오 AI`는 입력 표현과 latency 계약이 text와 다르므로 목표 분야의 독립 경로다.
- `World Model · Physical AI`는 생성 영상과 robot control 사이의 독립 경계이므로 목표 분야의 독립 경로다.
- 영상 이름, 발표자 이름, 영상의 서사 순서는 공개 curriculum IA에 노출하지 않는다.
- 새 원문이 나와도 기존 기반으로 설명되면 current source만 교체한다. 새 계산·표현·검증 계약이 생길 때만 하단 개념을 추가한다.

## 4. 독자가 풀 수 있어야 하는 전이 문제

### 4.1 LLM 데이터 엔진

서로 다른 두 corpus A와 B가 있다. A는 중복이 많지만 전문 영역 coverage가 높고, B는 교육 품질 점수가 높지만 특정 방언을 과도하게 제거한다. 제한된 30B token budget에서 dedup threshold, source mixture, sampling temperature를 선택하고 contamination 없이 실제 개선인지 검증해야 한다.

본문만 읽고 다음을 할 수 있어야 한다.

- 문서 수와 token 수를 구분한다.
- quality filter가 단순 정답 판정이 아니라 target distribution을 바꾸는 선택임을 설명한다.
- near-duplicate와 benchmark contamination을 별도로 검사한다.
- synthetic data의 generator, verifier, diversity, provenance를 분리한다.
- 4B·9B 모델에서 넓은 저품질 corpus보다 목적에 맞는 고신호 mixture가 유리한 조건을 판단한다.

### 4.2 효율 추론 · On-device

RAM 8GB, memory bandwidth 60GB/s인 device에 4B 또는 9B model을 올린다. 4-bit weight, context 8K, KV cache, draft model을 포함할 때 file size가 아니라 resident memory와 decode upper bound를 계산하고 CPU/GPU/NPU 배치를 선택해야 한다.

본문만 읽고 다음을 할 수 있어야 한다.

- weight byte, KV byte, runtime buffer를 별도로 계산한다.
- PTQ와 native low-bit training을 구분한다.
- MTP 학습과 speculative decoding runtime을 구분한다.
- TTFT, inter-token latency, throughput, energy/token을 분리해 측정한다.
- 작은 모델이 항상 더 빠르지 않은 hardware/kernel 반례를 설명한다.

### 4.3 Speech · Audio AI

모바일 음성 비서를 설계한다. 16kHz microphone, 불안정한 network, interruption, speaker accent와 background noise가 있다. Cascade ASR→LLM→TTS와 native speech-to-speech 중 하나를 선택하고 end-to-end latency budget과 평가표를 만든다.

본문만 읽고 다음을 할 수 있어야 한다.

- sample, frame, spectrogram, acoustic/semantic token의 정보 손실을 비교한다.
- algorithmic latency와 network jitter를 분리한다.
- WER가 낮아도 turn-taking이 나쁜 시스템의 반례를 만든다.
- barge-in, streaming decode, codec output과 transport를 하나의 timeline으로 설계한다.

### 4.4 World Model · Physical AI

로봇이 책상 위 물체를 옮긴다. 한 번에 찍은 video로 plausible future를 생성하는 모델과 action-conditioned latent model이 있다. 어느 모델이 planning에 쓸 수 있는지 판단하고 rollout horizon, objective, replanning interval과 real-world 검증을 설계해야 한다.

본문만 읽고 다음을 할 수 있어야 한다.

- video generator, representation learner, world model, VLA policy를 구분한다.
- observation-only prediction과 action-conditioned transition을 구분한다.
- pixel fidelity와 control-relevant state accuracy를 분리한다.
- open-loop rollout error가 누적되는 이유와 receding-horizon replanning을 설명한다.
- simulator benchmark와 real closed-loop success 사이의 근거 경계를 표시한다.

## 5. 본문 구조 계약

각 글은 다음 순서를 지킨다.

1. 독자가 실제로 판단해야 하는 질문으로 시작한다.
2. 용어를 정의한 뒤 전체 실행 흐름 Viz를 먼저 보여 준다.
3. 핵심 식은 한글 `underbrace` 또는 바로 아래 `FormulaNote`로 각 항의 역할을 설명한다.
4. 숫자 headline이 아니라 가정과 단위를 포함한 budget 식으로 전환한다.
5. 현재 1차 출처가 무엇을 보여 줬는지와 무엇을 보여 주지 않았는지 분리한다.
6. 4B·9B 모델에서 축소 구현할 수 있는 최소 실험을 제시한다.
7. 마지막 capability check는 위 전이 문제를 풀 수 있는 판단 항목으로 구성한다.

## 6. Viz 계약

- 가로 고정 canvas를 쓰지 않는다. `minmax(0, 1fr)` grid와 mobile 1열을 사용한다.
- text가 도형 안에서 잘리지 않도록 최소 높이를 고정하고 `overflow-wrap:anywhere`를 허용한다.
- 색만 바꾸는 상태 표현을 금지한다. label, 위치, 숫자, pattern을 같이 바꾼다.
- animation은 장식이 아니라 pipeline step, budget 변화, rollout 선택을 보여 줘야 한다.
- 모든 control은 keyboard focus와 label을 가진다.
- 360px에서 수평 문서 스크롤이 없어야 한다.

## 7. 출처와 의도 기록

- Data: DataComp-LM, FineWeb, Microsoft Phi, NVIDIA Nemotron 공개 자료.
- Efficiency: BitNet b1.58, Multi-token Prediction, Gemma 3n, vLLM 공식 자료.
- Audio: Qwen3-Omni, OpenAI Realtime model·infrastructure, 신호 처리 기반.
- World model: V-JEPA 2, Genie 3, Cosmos 3, Gemini Robotics 공개 자료.

각 출처는 숫자를 장식하기 위해 인용하지 않는다. 어떤 단계의 계약을 입증하는지 기록한다. 회사 블로그의 자체 측정은 독립 검증으로 표현하지 않고 author-reported evidence로 제한한다.
