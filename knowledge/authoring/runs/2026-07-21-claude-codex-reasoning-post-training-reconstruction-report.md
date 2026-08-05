# Claude-Codex reasoning post-training reconstruction report

이 문서는 Reasoning/Post-training 경로를 왜 현재 문제부터 다시 배치했는지, 본문만 읽고 낯선 반례를 풀 수 있는지 어떻게 검사했는지, 같은 작업을 4B·9B급 작은 모델에 어떻게 분해할지를 보존하는 판단 기록이다.

## 1. 출발점에서 확인한 실패

기존 구성은 `Pretraining`, `RLHF`, `PPO`, `GRPO`, `RLVR`, `CoT` 같은 이름을 나열했지만 다음 인과를 한 경로에서 만들지 못했다.

1. 정답 reward가 있는데도 왜 긴 문제에서 학습이 멈추는가.
2. 더 많은 rollout, 더 긴 horizon, 더 많은 update는 서로 어떤 compute 축인가.
3. 결과 reward와 과정 reward는 각각 어떤 실패를 잡고 어떤 실패를 놓치는가.
4. PPO와 GRPO는 모두 advantage를 쓰는데 baseline이 정확히 어떻게 다른가.
5. 공개 구현의 reward 함수와 실제 trainer 설정이 본문의 설명과 일치하는가.

또한 `RL Compute Scaling`을 모델 크기 scaling과 같은 말로 읽거나, 정답 검증기가 있으면 visible chain of thought도 충실하다고 가정할 위험이 있었다.

## 2. 선택한 current-first 경로

가장 오래된 RL 논문부터 시작하지 않았다. 2026년 reasoning 모델에서 실제로 남은 병목을 먼저 보여 주고, 그 병목을 해석하는 데 필요한 최소 바닥까지만 내려갔다.

```text
Reasoning post-training의 현재 병목
-> prompt당 rollout / horizon / update라는 세 compute 축
-> sparse credit, exploration collapse, overthinking, monitorability
-> Post-training 전체 신호 지도
-> InstructGPT의 reward model과 PPO 최소 기반
-> policy optimization이 필요할 때만 상세 기반
-> Open-R1 코드에서 GRPO와 reward verifier 확인
```

`reasoning-post-training-frontier`는 현재 문제, `post-training-rlvr`는 전체 신호 지도, `rlhf`는 InstructGPT/PPO 최소 기반, `rl-ppo-continuous-control`은 선택 심화, `open-r1`은 구현 검증을 소유한다. 같은 설명을 여러 글에 복제하지 않고 앞 글의 결론을 다음 글의 전제로 사용한다.

## 3. 새 개념 목록의 소유권 판단

사용자가 제시한 용어를 한 키워드당 한 글로 만들지 않는다. 독립 글은 새로운 실행 계약, 학습 신호, 위협 모델 중 하나를 실제로 소유할 때만 만든다.

- `RL / Reasoning`: 이번 경로에 흡수했다. Pretraining, Post-training RL, RL compute scaling, CoT, search, policy optimization을 하나의 인과로 연결했다.
- `Interpretability`: 다음 독립 경로다. observation에서 intervention으로 올라가는 순서로 attention, activation, logit, hidden representation, SAE, circuit을 묶는다.
- `Tokenization`: 기존 tokenizer 경로가 BPE, SentencePiece, Unicode, vocabulary, next-token distribution을 소유한다. 새 글보다 연결 감사가 우선이다.
- `Mamba / SSM`, `Transformer 효율화`, `Hybrid`: 직전 LLM architecture 경로가 state contract, KV contract, linear/hybrid attention을 소유한다.
- `CUDA / GPU`: 기존 GPU와 serving 경로가 kernel, memory hierarchy, coalescing, occupancy, fusion을 소유한다. 모델 구조 글에서는 병목 handoff만 연결한다.
- `제어, 비디오, Object Detection, HTML table parsing`: 기존 Robot AI, video, OCR/Document AI 경로에 귀속한다. 누락된 실행 단계만 해당 경로에서 보강한다.
- `SSS / MPC / TSS / Serverless Wallet`: 기존 MPC 수학 글과 wallet 보안 글 사이의 제품 위협 모델이 비어 있다. 별도 current-first custody 경로가 필요하다.

## 4. 가장 어려운 비공개 전이 문제

본문을 쓰기 전에 세 문제를 만들고 구현 후 Claude가 독립적으로 답이 본문에서 도출되는지 검사했다.

### A. 결합 reward 악용

형식과 tag는 완벽하지만 정답이 틀린 출력, 정답은 맞지만 visible CoT가 실제 결론과 단절된 출력을 각각 구성한다. 현재 verifier 중 무엇이 잡고 무엇을 통과시키는지 설명한다.

도달해야 할 insight는 `format/tag reward는 학습 신호의 일부일 뿐 진실성 증명이 아니며`, 결과 검증과 과정 monitor는 서로 다른 실패를 소유한다는 것이다.

### B. 전부 정답 또는 전부 오답인 그룹

같은 prompt의 모든 sample reward가 같을 때 GRPO의 standardized group advantage를 계산한다. 각 reward가 평균과 같으므로 분자는 0이고 모든 advantage가 0이다. `epsilon_std`는 0으로 나누는 수치 오류만 막으며 학습 신호를 만들지 않는다. 따라서 curriculum은 모델이 가끔 성공하고 가끔 실패하는 경계에 문제를 유지해야 한다.

### C. Reward hacking과 단절된 CoT

숨은 테스트를 속이는 checker exploit과, 최종 답은 맞지만 설명이 실제 계산의 원인이 아닌 경우를 구분한다. 전자는 더 강한 verifier와 adversarial test가 잡을 수 있다. 후자는 결과 테스트를 모두 통과해도 독립적인 process/CoT monitor가 없으면 남는다.

Claude의 최종 판정은 세 문제 모두 새 본문만으로 풀 수 있다는 것이었다.

## 5. 본문과 Viz 설계 의도

현재 글에는 네 개의 explorer를 두었다.

- `ReasoningComputeExplorer`: rollout 수, horizon, update가 같은 compute budget을 서로 다르게 쓰는 것을 관찰한다.
- `CreditAssignmentExplorer`: 마지막 결과 reward와 중간 과정 reward가 credit을 어디에 배분하는지 비교한다.
- `ExplorationEntropyExplorer`: policy entropy가 너무 빨리 줄 때 다양한 풀이 경로가 사라지는 과정을 보여 준다.
- `MonitorabilityExplorer`: outcome correctness와 visible reasoning faithfulness를 두 축으로 분리한다.

Open-R1의 14개 rollout과 reward pipeline은 작은 SVG를 축소하지 않고 반응형 HTML 단계로 다시 만들었다. 모바일은 4열까지로 제한하고 각 label이 geometry보다 먼저 읽히게 했다. 모든 핵심 수식에는 한글 underbrace와 `FormulaNote`를 붙여 기호뿐 아니라 평균을 빼는 이유, 표준편차로 나누는 이유, stabilizer가 신호를 만들지 못하는 이유까지 설명했다.

## 6. Claude와 Codex의 역할 분리

Claude Sonnet은 구현 후 read-only critic으로 경로 연결, 사실 정확성, 비공개 문제의 답 가능성, 모바일 위험을 검사했다. 다음 오류를 찾았다.

- mirror `grpo.py`가 script arguments를 선언만 하고 실제로 생성하지 않음
- reward pipeline Viz가 exact tag match를 `0.75`로 잘못 표시
- PPO와 GRPO가 advantage 사용 여부로 다른 것처럼 읽히는 설명
- 390px에서 7열 rollout box와 6px SVG text가 실질적으로 읽히지 않음
- PPO clip epsilon과 group standardization stabilizer가 같은 기호로 겹침

Codex는 코드, 공식 TRL 설정, 브라우저 렌더를 다시 확인한 뒤 수정했다. `reward_weights`를 실제 `GRPOConfig`에 연결하고, invalid gold parse는 fail-closed 0으로 바꾸고, format regex를 anchor/fullmatch로 고정했다. 기호는 `epsilon_clip`과 `epsilon_std`로 분리했다.

## 7. 검증 결과

- 변경 파일 ESLint 통과
- production build 통과
- Python mirror `py_compile` 통과
- Reasoning 4개 경로 Viz audit: 8 checks, 30 surfaces, 30 SVG, errors 0, warnings 0
- Reasoning 4개 경로 narrative audit: 8 checks, 36 StepViz, 31 surfaces, errors 0, warnings 0
- Open-R1 GRPO step 3, reward step 5, frontier monitor를 390px에서 직접 확인
- 검사한 text element clipping 0, document horizontal overflow 0
- 공개 도메인 4개 경로를 390px·1440px에서 재검사: 8 checks, Viz와 narrative errors 0, warnings 0
- 공개 Open-R1에서 GRPO step 3과 reward step 5로 전환되고, frontier의 `답과 분리된 trace + CoT monitor`가 `monitor alert = ON`으로 바뀌는 것을 확인
- `cm-blog.service`를 2026-07-21 11:11:51 KST에 재시작하고 active 상태를 확인
- `build:tsc`는 이번 변경과 무관한 기존 Viz/type debt에서 실패하며 별도 backlog로 유지

## 8. 4B·9B 모델 재현 프로토콜

작은 모델에는 전체 블로그를 한 번에 맡기지 않는다. 다음 IR을 먼저 고정한 뒤 하나의 소유권 묶음만 준다.

```text
inventory
-> existing ownership map
-> current research anchors
-> bounded minimum foundation
-> private transfer questions
-> prose contract
-> prose-derived Viz contract
-> code/source fact audit
-> responsive + KaTeX audit
-> deploy + public acceptance
```

### 4B packet

- 한 개념의 `problem -> signal -> failure -> evidence`
- 한 수식의 직관, 기호, 연산 선택 이유
- 한 Viz의 input, state transition, observable, counterexample
- 한 코드 claim과 실제 line anchor의 일치 여부
- 출력은 prose 이전에 JSON IR로 제출

### 9B packet

- 한 경로의 3~5개 article ownership
- current target에서 최소 foundation까지의 중단 조건
- 세 개 이하의 비공개 전이 문제와 answerability 판정
- critic 반례, 산술 검사, 모바일 acceptance 포함

### Orchestrator가 유지할 것

- 최신 연구의 날짜와 primary source provenance
- 키워드를 article로 무한 분해하지 않는 ownership 규칙
- 결과 reward, 과정 reward, monitorability처럼 서로 대체 불가능한 경계
- 코드가 본문을 실제로 뒷받침하는지 확인하는 실행 검사
- build, visual audit, deploy, public URL 확인

기계가 재사용할 수 있는 결정과 검사 수치는 인접 JSON에 보존한다.
