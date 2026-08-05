# Claude-Codex LLM interpretability reconstruction report

이 문서는 Attention Map, hidden representation, activation, logit, token distribution, SAE와 circuit analysis를 왜 하나의 증거 사다리로 재구성했는지 보존한다. 목표는 용어를 많이 아는 것이 아니라, 내부 신호를 보고도 관찰과 원인을 혼동하지 않는 것이다.

## 1. 시작점과 중단선

최상단은 2025-2026년의 Gemma Scope 2, attribution graph와 Jacobian Lens로 잡았다. 바닥은 residual stream, unembedding, softmax와 국소 미분까지로 제한했다. 모든 신경망 해석 논문의 역사를 선행 과제로 만들지 않았다.

```text
현재 도구가 무엇을 볼 수 있는가
-> attention·activation·logit readout은 관찰이다
-> SAE는 dense activation을 sparse feature 가설로 바꾼다
-> attribution은 개입할 후보를 좁힌다
-> patching·ablation·control이 causal claim을 닫는다
```

## 2. 글의 소유권

- `llm-interpretability-frontier`: output에서 intervention까지의 주장 강도와 최신 연구 지도
- `llm-interpretability-readouts`: attention, hidden state, logits, vocabulary filtering, Logit/Tuned/Jacobian Lens
- `sparse-autoencoder`: reconstruction-sparsity tradeoff, feature labeling, steering과 한계
- `llm-circuit-analysis`: clean/corrupted run, activation patching, attribution approximation, replacement fidelity와 control

이 네 글을 분리한 이유는 읽히는 신호, 사람이 붙인 feature 이름, 계산 경로 가설과 원 모델의 인과 효과가 서로 대체 불가능하기 때문이다.

## 3. 비공개 전이 문제

1. Logit Lens에서 강한 token이 보이지만 patching과 ablation에서 효과가 사라질 때 이를 mechanism이라 부를 수 있는가.
2. SAE feature가 refusal과 상관될 때 어떤 intervention, dose-response, sign reversal, random direction과 unrelated-task control이 있어야 causal language를 쓸 수 있는가.
3. Attribution graph threshold를 높였을 때 graph에 보인 edge mass와 replacement model fidelity 중 무엇이 변해야 하는가.

본문은 1을 correlational readout, 2를 control이 필요한 intervention hypothesis, 3을 display pruning과 model fidelity의 분리로 답하게 만들었다.

## 4. 출처와 의도

- Google DeepMind Gemma Scope 2: Gemma 3 전 크기의 공개 SAE·transcoder 범위. Feature label의 완전성은 증명하지 않는다.
- Anthropic Circuit Tracing와 Attention QK tracing: replacement model과 attribution graph의 계산 계약. 원 모델의 완전한 회로도는 아니다.
- Anthropic Jacobian Lens 2026: context 평균 downstream Jacobian을 이용한 vocabulary-disposed readout. 숨은 문장을 그대로 읽는 장치는 아니다.
- Tuned Lens와 attention counterexample 연구: layer geometry 보정과 attention weight의 비인과성을 설명하는 기준점.

## 5. Claude 반례 검토와 수정

Claude는 prose가 비공개 문제를 풀기에 충분하다고 판정했지만 Viz 두 오류를 찾았다.

- graph 표시 threshold가 replacement fidelity를 바꾸던 오류를 제거했다. Fidelity는 84%로 고정하고 shown/omitted edge mass만 움직이게 했다.
- clean과 corrupted 예시가 같은 subject에서 서로 다른 답을 보여 주던 모순을 `France -> Paris`, `Italy -> Rome`으로 고쳤다.

J-Lens와 Gemma Scope 2의 현재 링크와 날짜는 공식 연구 글에서 다시 확인했다.

## 6. 검증 결과

- 변경 파일 ESLint 통과
- production build 통과
- 4개 경로, desktop/mobile 8회 검사: runtime error 0, document/article overflow 0, KaTeX error 0
- 모바일 최소 수식 scale: readouts 0.83, SAE 0.83, circuits 1.00
- Tuned Lens, attention counterexample, SAE K, patching layer와 graph threshold 조작 모두 상태 전환 확인
- 통합 Viz/narrative audit의 desktop/tablet/mobile 검사에서 errors 0, warnings 0

## 7. 작은 모델 재현 packet

4B 모델에는 한 evidence rung만 준다. 입력은 `claim, observable, intervention, control, source boundary` JSON이고, 출력은 한 수식과 한 반례다. 9B 모델에는 네 글의 ownership graph와 세 비공개 문제를 함께 주고 중복 설명과 끊긴 handoff를 검사시킨다. Orchestrator는 최신 출처 검증, 브라우저 렌더, 수식 크기와 최종 deploy를 소유한다.
