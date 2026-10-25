# 비디오 클립 샘플링 재작성 계획

## 문서 카드

- 트랙: `concept`
- 형식: `explanation`
- 매체: `article`
- 독자: 비디오 시간 관측 글을 읽었고, 여러 clip이 실제로 어느 시간을 보았는지 계산하려는 독자
- 질문: 겹치는 clip의 실제 관측 범위를 어떻게 세고, 같은 평가 입력과 판정을 어떻게 다시 확인할까요?
- 한 문장 답: clip을 timestamp interval로 기록해 합집합 길이를 구하고, 선택·decode·crop·model·reducer의 revision을 한 receipt에 남겨야 합니다.
- 다음 질문: interval 합집합은 어떤 순서로 계산하며, replay가 달라졌을 때 어느 단계부터 확인할까요?
- 범위 밖: 특정 제품 선택, 운영 SLO, release 승인 절차, dataset split 정책, 장애 대응 runbook

## 고정 사례

10초 영상에서 각 4장인 clip 세 개를 `[0,2]`, `[1,3]`, `[8,10]`초에서 읽습니다. 총 frame budget은 12장이며 clip 길이의 단순합은 6초입니다. 앞의 두 clip이 `[1,2]`에서 1초 겹치므로 interval union은 `[0,3] ∪ [8,10]`, 길이는 5초, temporal coverage는 `5초 ÷ 10초 = 0.5`입니다.

## 독자 순서

1. 부모 지도에서 현재 영역을 찾고 12장 사례의 전체 경로를 봅니다.
2. Timeline에서 clip 길이의 단순합과 interval union을 구분합니다.
3. 정렬·병합 알고리즘을 한 줄씩 실행해 coverage 0.5를 얻습니다.
4. TSN과 TensorFlow 공식 API에서 학습의 무작위 선택과 평가의 중앙 선택을 확인합니다.
5. Source identity부터 최종 reducer까지 receipt를 따라가며 replay 불일치의 첫 지점을 찾습니다.
6. 확인한 사실을 부모 지도에 돌려놓고 다음 convolution 글로 이동합니다.

## 근거 장부

| ID | 주장 | 근거 | 본문 위치 |
| --- | --- | --- | --- |
| F1 | TSN은 긴 영상을 여러 segment로 나누고 sparse snippet을 모아 video-level prediction을 만듭니다. | Wang et al., arXiv:1608.00859 | `sampling` |
| F2 | TensorFlow Models 2.16.1의 `sample_segment_sequence`는 학습에서 segment별 무작위 frame, 평가에서 중앙 frame을 선택합니다. | TensorFlow 2.16.1 공식 API | `sampling` |
| F3 | 세 interval의 합집합 길이는 정렬 후 겹치는 구간을 병합해 계산할 수 있습니다. | 실행 가능한 본문 TypeScript와 단위 사례 | `algorithm` |
| F4 | 같은 평가를 다시 확인하려면 입력 선택뿐 아니라 decode·crop·model·reducer revision도 같은 비교 경계에 있어야 합니다. | 재현 receipt의 설명용 schema와 단계별 checksum 비교 | `replay` |

## 보존과 이동

- 유지: interval union coverage, training random과 evaluation fixed의 구분, TSN의 sparse segment sampling, receipt의 주요 필드
- 교체: 카드 나열을 10초 영상 한 사례의 causal trace로 교체
- 이동: group split·budget parity·release gate는 실무 글의 후보로 남기고 이 개념 글의 본문에서는 제외
- 추가: 부모 locator, interval 병합 step-through, official API evidence, replay failure localization, return map
