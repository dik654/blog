# Checkpoint 395 plan · vLLM speculative decoding

## Article card

- Reader: 추측 디코딩의 이름은 들었지만 vLLM이 후보·분포·KV 상태를 어떻게 함께 맞추는지 모르는 개발자
- Type: 고정한 실제 코드와 한 요청을 함께 추적하는 메커니즘 글
- Question: 후보 네 개를 큰 모델 한 번으로 검사하면서 어떻게 원래 모델의 출력 규칙과 다음 회차의 상태를 지키는가
- One-sentence answer: vLLM은 빠른 부품이 낸 후보를 큰 모델이 한 번에 채점하고, 첫 거부 전 후보와 그 자리의 교체 토큰만 확정한 뒤 유효한 KV만 남겨 순차 실행 횟수를 줄인다.
- Decision: 원래 분포와 상태를 보존한 구현인지, 후보·검증·정리 시간을 모두 넣어 실제로 빠른지 판정한다.
- Out of scope: 모든 proposer 구조의 상세, 모든 GPU와 부하에서의 보편 처리량, tree 검증의 전체 구현

## Causal spine

1. 한 문장 답: 후보를 큰 모델 한 번에 채점해 여러 토큰을 확정한다.
2. 꼬리 질문: 후보가 틀리면 큰 모델의 원래 선택 비중은 어떻게 지키는가.
3. 병목: 첫 거부 뒤의 후보와 KV는 달라진 앞 문장을 가정한다.
4. 해결 발상: 공통 확률 비중은 수락하고 부족분으로 교체한 뒤 뒤쪽을 자른다.
5. 그대로는 막히는 이유: 출력 길이와 계산된 KV 길이가 다르며 후보 검증 비용도 든다.
6. 구현 메커니즘: rejection sampler, logits index, computed-token rollback을 같은 요청으로 잇는다.
7. 선택 기준: 같은 출력량의 target-only 시간보다 후보 준비·검증·정리의 전체 시간이 짧아야 한다.

## Running case and fact ledger

| Fact | Value | Status | Used for |
|---|---:|---|---|
| target distribution | `p=(0.7, 0.3)` | 설명용 가정 | 원래 선택 비중 |
| proposer distribution | `q=(0.4, 0.6)` | 설명용 가정 | 수락·교체 장부 |
| candidates | `A·B·B·A` | 설명용 가정 | 전체 추적 |
| uniforms | `0.6, 0.4, 0.8, 0.2` | 설명용 가정 | 첫 거부 위치 |
| committed output | `A·B·A` | 위 가정의 계산 결과 | 출력·상태 추적 |
| accepted/output length | `A=2, Y=3` | 위 가정의 계산 결과 | 길이 구분 |
| history/computed | `4→7, 3→8→6` | 설명용 상태와 고정 코드 적용 | KV rollback |
| iid expected output | `2.7731` at `alpha=.7, K=4` | 단순 비용 모형 | 손익 계산 |
| fast cycle | `2+12+1=15 ms`, ratio `1.848733` | 설명용 가정 | 이득 사례 |
| slow verify | `2+30+1=33 ms`, ratio `.840333` | 설명용 가정 | 반례 |
| implementation | vLLM v0.27.1 commit `6e448d0` | pinned source | CodeSidebar evidence |

## Planned visible sections

1. 결론: 큰 모델 한 번의 채점으로 여러 토큰을 확정한다.
2. 여러 토큰 확정이 순차 실행을 줄이는 이유.
3. A·B·B·A에서 A·B·A가 남는 작은 사례.
4. 첫 거부 뒤 후보를 계속 쓸 수 없는 이유.
5. 원래 선택 비중과 KV 길이를 함께 보존해야 하는 이유.
6. draft·target·수락·교체·KV rollback 이름 붙이기.
7. 같은 요청을 후보 준비부터 다음 회차까지 추적.
8. 수락과 교체가 target 분포를 복원하는 식과 실제 sampler.
9. 출력 7자리와 유효 KV 6자리의 차이.
10. 평균 확정 수가 후보 깊이·수락 꼬리에서 나오는 과정.
11. 실제 이득을 정하는 전체 시간 장부.
12. proposer·dynamic depth·측정 조건의 경계.
13. 예측 질문.

## Preservation map

- 24개 기존 절의 사실·수식·코드 버튼·인용은 삭제하지 않는다.
- 핵심 답에 필요한 분포 보존, 첫 거부, logits index, KV rollback, 손익 장부는 기본 화면에 둔다.
- residual sampling 세부, output parse, iid 유도, 원 논문 단순 모형, weight traffic, benchmark, EAGLE·MTP, dynamic lookup은 관련 절의 `ProgressiveDetail`로 옮긴다.
- 기존 학습 계약과 canonical href가 가리키는 anchor는 새 절 또는 내부 `span`으로 보존한다.
- 모든 주요 `ExplainedFormula`의 `annotatedFormula`에 도메인 의미를 직접 붙인다.

## Recursive teaching closure

- 설명 단위는 `Teach(C) = 한 문장 답 → 꼬리 질문 → 병목 → 작동 경로 → 같은 사례 → 남는 비용 → 선택 기준 + Σ Teach(선수 개념)`으로 반복한다.
- 용어 행·비교 카드·링크는 종료 조건이 아니다. 입문 수치 사례나 일상 관찰에 닿아야 경로가 닫힌다.
- 주요 변형은 접힌 원문 근거와 별개로 기본 화면에서 하나의 작은 글처럼 읽혀야 한다.
- 이관한 글은 `recursiveTeaching: true`와 개념별 `causalTrace`를 learning audit에서 강제한다.
