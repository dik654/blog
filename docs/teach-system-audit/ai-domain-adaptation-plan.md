# 도메인 적응 묶음 재작성 계획

## 문서 카드

- 현재 글: `ai/domain-finetuning`
- 트랙: concept
- 형식: explanation
- 매체: article
- 직속 부모: 도메인 임베딩·적응
- 독자: 도메인 성능 저하를 보고 RAG·continued pretraining·SFT 가운데 무엇을 검토해야 하는지 처음 판단하는 ML 엔지니어
- 독자의 현재 작업: 실패 사례를 잘못된 상태의 위치로 분해하고, 필요한 상태만 바꾸는 개입을 고릅니다.
- 한 문장 답: 최신 사실은 외부 문서, 반복되는 언어 패턴은 모델 가중치, 원하는 출력 행동은 supervised example, 지연·메모리 문제는 실행 환경에서 고칩니다.
- 범위 밖: 특정 조직의 도입 결정, 실제 비용·성능 우위, 제품별 배포 절차, 운영 장애 runbook
- 진실 상태: 각 방법의 원래 메커니즘은 [O], 방법을 한 지도로 묶는 경계와 수치 사례는 [A], 대상 환경의 실제 지표와 임계값은 [?]

## 이어지는 사례

고객이 “2026년 환불 규정의 최신 조항을 근거와 함께 알려 달라”고 묻습니다. Base model은 이전 규정을 답하고 출처를 내지 못합니다. 이 실패는 모델이 전문 문체를 못 읽어서가 아니라 현재 사실과 근거가 요청 시점의 입력에 없어서 생겼다고 가정합니다.

1. 요청 계약은 `현재 revision`과 `근거 문서`를 모두 요구합니다.
2. 가중치만 읽은 baseline은 오래된 답을 내고 근거를 연결하지 못합니다.
3. 검색된 문서 revision을 context에 넣으면 가중치를 바꾸지 않고 현재 사실과 근거를 제공합니다.
4. 검색 결과가 없으면 오래된 기억으로 추측하지 않고 `근거 없음` 상태로 끝냅니다.

이 사례와 별도로 특허 문장 구조를 계속 잘못 읽는 실패는 continued pretraining 후보, 사실은 맞지만 JSON schema를 반복해서 어기는 실패는 SFT 후보, 품질은 맞지만 VRAM과 지연이 한도를 넘는 실패는 실행 환경 문제로 둡니다.

## 설명용 후보

| 후보 | 현재 근거 연결 | target gain | general change | cost | 판정 |
|---|---:|---:|---:|---:|---|
| Prompt only | 실패 | +1 | 0 | 1 | 근거 조건 탈락 |
| RAG | 통과 | +3 | 0 | 2 | 선택 |
| Continued pretraining | 실패 | +4 | -2 | 4 | 근거·회귀·예산 탈락 |
| SFT | 실패 | +2 | -0.5 | 2 | 근거·target 탈락 |
| RAG+SFT | 통과 | +5 | -0.5 | 4 | 예산 탈락 |

모든 값은 선택 절차를 설명하기 위한 가정 [A]입니다. `target gain ≥ 3`, `general change ≥ -1`, `cost ≤ 3`을 결과를 보기 전에 정했다고 가정합니다. 실제 임계값과 비용 단위는 [?]입니다.

## 독자 순서

1. 도메인 적응 묶음에서 현재 위치와 이후 세부 글을 봅니다.
2. 최신 규정 질문 하나가 실패하고 RAG로 회복되는 경로를 추적합니다.
3. 관찰한 실패를 현재 사실·언어 패턴·출력 행동·실행 제약으로 분해합니다.
4. 각 상태가 어디에 저장되고 어떤 개입이 그 상태를 바꾸는지 연결합니다.
5. 후보를 먼저 만들고 hard requirement·회귀·예산·target threshold로 탈락시킵니다.
6. 근거가 없을 때 시스템이 추측하지 않고 멈추는 실패 동작을 확인합니다.
7. 확인한 경계를 부모 지도에 반환하고 continued pretraining 글로 이동합니다.

## 그림 질문

1. `DomainAdaptationTraceViz`: 최신 정책 질문이 가중치만 읽을 때 왜 실패하고, 외부 문서를 넣으면 어떤 상태가 바뀝니까?
2. `GapOwnershipMap`: 네 실패는 각각 어느 상태의 문제이며 어떤 개입이 그 상태를 바꿉니까?
3. `InterventionFunnelViz`: 네 후보 중 어떤 조건에서 RAG만 남습니까?
4. `EvidenceMissingViz`: 현재 사실의 근거를 찾지 못했을 때 시스템은 무엇을 출력해야 합니까?

## 근거 장부

| 주장 | 근거 | 범위 |
|---|---|---|
| RAG는 parametric memory와 검색한 non-parametric memory를 결합합니다. | Lewis et al. [O] | 논문의 Wikipedia index·retriever·generation tasks |
| DAPT·TAPT는 target domain·task의 unlabeled corpus에서 pretraining을 이어 갑니다. | Gururangan et al. [O] | RoBERTa, 네 domain, 여덟 classification tasks |
| SFT는 desired output demonstration으로 행동을 학습할 수 있습니다. | Ouyang et al. [O] | 논문의 prompt·annotator·model pipeline |
| LoRA는 frozen weight에 저랭크 trainable update를 붙입니다. | Hu et al. [O] | 논문의 target modules·models·tasks |
| 실패를 네 상태 위치로 분해하는 지도 | 편집·설계 분석 [A] | 모든 도메인에서 완전한 분류라는 뜻이 아님 |
| 후보 표의 gain·회귀·cost | 설명용 가정 [A] | 실제 측정값이 아님 |

## 묶음 경계

```text
도메인 적응 지도
├─ Continued pretraining: corpus mixture와 forgetting
├─ Task fine-tuning: demonstration, loss mask, update scope
└─ Data governance: group/time split, rights lineage, claim boundary
```

`ai/domain-finetuning`은 이 묶음의 개념 루트입니다. 세부 글이 아직 `reviewed`가 아니므로 루트도 묶음 검증 전까지 `pending`으로 유지합니다.

## 완료 조건

- 한 요청이 current fact 저장 위치를 바꾸어 회복되는 경로가 보입니다.
- RAG·continued pretraining·SFT·PEFT를 같은 축의 경쟁 제품처럼 나열하지 않습니다.
- PEFT는 업데이트 범위이고 SFT는 학습 목표라는 차이를 분명히 합니다.
- 후보 생성, hard requirement 탈락, 회귀·예산 탈락, 최종 선택이 화면에서 구분됩니다.
- 근거가 없을 때의 designed failure를 설명합니다.
- 데스크톱, 390×844, 키보드, reduced-motion, JavaScript 비활성 상태를 검증합니다.
- 세부 글의 closure가 루트 지도에 돌아오기 전에는 묶음 완료로 표시하지 않습니다.
