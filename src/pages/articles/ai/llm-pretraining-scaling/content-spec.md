# LLM Pre-training과 학습 예산 content spec

## 독자의 출발 상태

- `Pre-training`이 학습 순서의 첫 단계라는 것만 알고 구체적으로 무엇을 하는지는 모른다.
- 4B·9B, token, parameter, FLOPs, scaling law를 아직 정의하지 못한다.
- 수식 유도보다 "어떤 선택이 왜 다른 비용을 만드는지"를 이해하고 싶다.

## 첫 화면 서사 계약

```text
경로의 첫 글이라는 짧은 안내
→ 빈칸 맞히기라는 익숙한 장면
→ 글을 token으로 나누기
→ 다음 token 예측
→ 예측과 정답 비교
→ parameter 조정
→ 이 반복을 Pre-training이라고 이름 붙이기
→ 4B·9B 학습 예산 질문
```

공통 경로 헤더에서 `model·token·compute`를 압축한 질문을 먼저 보여 주지 않는다. 정의되지 않은 4B·9B를 첫 `QuestionLead`에 두지 않으며, `QuestionLead`는 token, parameter, pre-training과 학습 예산을 정의한 뒤에 놓는다. 질문의 답도 처음에는 `같은 시간에 볼 수 있는 문장 수`와 `사용할 때 반복해서 드는 비용`이라는 일상어로 설명하고, `memory traffic·test-time sampling`은 뒤 절에서 이름 붙인다.

## 이 글이 닫을 질문

1. LLM의 pre-training은 입력을 받고 어떤 정답을 만들며 무엇을 바꾸는가?
2. Parameter 수 `N`, 학습 token `D`, 학습 계산 `C`는 서로 어떤 trade-off를 만드는가?
3. 같은 training compute에서 4B와 9B는 얼마나 다른 token 수를 볼 수 있는가?
4. 왜 Chinchilla의 대표 비율을 모든 model·data·배포 조건에 고정값으로 쓰면 안 되는가?
5. 사용자 호출량과 test-time sampling이 커질 때 왜 작은 model을 더 오래 학습하는 선택이 유리할 수 있는가?
6. 고유 data가 고정된 상태에서 반복 token이 언제부터 새 학습 신호가 아닌지 무엇으로 판정하는가?

## 출처 의도와 경계

| 출처 | 사용 의도 | 이 글이 과장하지 않을 경계 |
|---|---|---|
| Kaplan et al. (2020) | Model·data·compute와 loss의 power-law 관찰을 첫 스케일 기준으로 사용 | 현재 제품의 고정 exponent로 취급하지 않음 |
| Hoffmann et al. (2022) | IsoFLOP으로 고정 training compute의 `N`·`D` 균형을 비교한 canonical anchor | 대표 token/parameter 비율을 보편 법칙으로 취급하지 않음 |
| Sardana et al. (2024) | Training과 대규모 inference demand를 합친 생애 비용 판단 | 항상 작은 model이 이긴다는 결론으로 확대하지 않음 |
| Muennighoff et al. (2023) | 제한된 고유 data의 반복 가치를 실험적으로 설명 | 특정 반복 횟수를 모든 corpus의 정지점으로 고정하지 않음 |
| Roberts et al. (2026) | Pre-training과 test-time sample 수를 한 예산에서 보는 현재 연구 | Preprint을 확립된 production 기본값으로 승격하지 않음 |
| Xu et al. (2026) | 반복 data 구간에서 model·data interaction을 다시 검토 | 재현 전에 보편 scaling law로 단정하지 않음 |

## Hard-transfer oracle

1. 같은 `C_max`에서 4B가 160B token을 볼 수 있다면 9B가 볼 수 있는 token을 `C ≈ 6ND`로 비교한다.
2. 학습 loss가 내려가도 clean held-out loss가 멈추고 암기 probe가 오르면 추가 epoch을 승인하지 않는다.
3. 9B가 한 번 답할 때는 좋지만 4B가 같은 생애 예산에서 후보를 더 많이 생성할 수 있다면, task 성공률과 전체 생애 비용으로 다시 비교한다.
4. Pilot 결과가 다른 tokenizer·data mixture·optimizer에서 나왔다면 Chinchilla 비율을 복사하지 않고 자신의 IsoFLOP curve를 다시 맞춘다.

## 완료 조건

- 사전지식 없는 독자가 Pre-training, token, parameter와 4B·9B 표기를 첫 섹션에서 자기 말로 설명한다.
- `BeginnerOpening → 평이한 설명 → ConceptPrimer → QuestionLead`의 DOM 순서를 테스트로 유지한다.
- 공통 경로 헤더는 첫 글에서 도달 질문을 반복하지 않고 `여기서 시작 → 첫 장면`만 안내한다.
- 360·390·768·1440px에서 수식, lab과 첫 화면에 clipping이 없다.
- 종료 시점은 Chinchilla 2022로 자르고 data engine과 training run으로 이어진다.
