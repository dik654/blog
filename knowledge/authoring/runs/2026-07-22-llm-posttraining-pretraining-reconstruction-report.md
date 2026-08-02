# LLM Post-training·Pre-training 학습 경로 재구성 보고서

이 문서는 완성 글의 요약이 아니라, `LLM`이라는 큰 주제를 배포 목표에서 학습 신호와 계산 예산까지 역으로 내려가는 학습 시스템으로 바꾼 판단 기록이다. 같은 이름의 JSON은 4B·9B 작업 packet과 기계 검증값을 보존한다.

## 1. Post-training과 Pre-training을 한 목록에서 분리했다

기존 목록은 RLHF, RLVR, PPO, scaling law, data pipeline, serving이 비슷한 깊이의 용어처럼 이어져 있었다. 그러나 독자가 풀어야 하는 질문은 서로 다르다.

- Post-training: 이미 학습된 policy에 어떤 feedback을 주고, 그 신호가 탐색과 update를 어떻게 바꾸는가.
- Pre-training: 배포할 모델 크기와 token 수를 어떤 계산 예산 안에서 고르고, 데이터 반복과 품질을 어떻게 감시하는가.
- Serving: 만들어진 checkpoint를 어떤 memory·latency·throughput 계약으로 운영하는가.

따라서 `Reasoning · Post-training`은 `현재 병목 -> Feedback 계약 -> 구현·검산`으로 묶고, `데이터 · Pre-training`, `LLM 해석`, `효율 추론 · On-device`, `서빙 · 인프라`는 서로 독립된 가지로 남겼다. 한 가지를 배웠다고 나머지를 안다고 착각하지 않게 하는 분리다.

## 2. Post-training은 새 요약 글을 만들지 않고 기존 깊은 글을 경로로 묶었다

기존 글을 감사한 결과 `reasoning-post-training-frontier`, `post-training-rlvr`, `rlhf`, `rl-ppo-continuous-control`, `open-r1`은 각각 독립 질문과 충분한 본문·Viz·수식 근거를 이미 갖고 있었다. 같은 내용을 더 짧게 복제하면 글 수만 늘고 연결은 더 흐려진다.

기본 경로는 다음과 같다.

1. Reasoning frontier에서 reward·exploration·test-time compute라는 현재 병목을 본다.
2. RLVR에서 검증기가 어떤 답을 보상할 수 있는지 신호 계약을 정한다.
3. RLHF에서 사람 선호와 reward model이 필요한 경우를 구분한다.
4. PPO에서 rollout, advantage, clipping, update의 실제 순서를 계산한다.
5. Open-R1에서 dataset, reward, GRPO config, distributed execution을 하나의 구현으로 검산한다.

이 판단은 “모든 주제마다 새 글 추가”가 아니라 “독립 질문이 있으면 유지하고, 중복이면 경로에서 역할을 재지정한다”는 원칙의 사례다.

## 3. Pre-training에는 실제로 빠진 계산 축이 있었다

데이터 정제 글과 training pipeline 글은 있었지만, 그 앞에서 `4B와 9B 중 무엇을 왜 선택하는가`, `unique token이 부족할 때 반복 학습을 어디까지 허용하는가`, `training FLOPs가 같아도 serving 총비용 때문에 결론이 왜 바뀌는가`를 계산하는 글이 없었다.

과거 Transformer 구현 폴더의 사용되지 않는 `ScalingLaws.tsx`는 새 글의 근거로 재사용하지 않았다. 특정 모델의 token/parameter 비율을 일반 법칙처럼 읽게 만들고, 현재 route에서 렌더되지 않으며, 배포 비용·데이터 제약·pilot gate를 연결하지 못하기 때문이다.

새 경로는 `모델·Token 예산 -> 데이터 신호 -> 실행`이다.

1. `llm-pretraining-scaling`: 파라미터·token·training/serving FLOPs를 하나의 수명 주기 예산으로 고른다.
2. `llm-data-engine`: 중복, 오염, domain mix, dedup, evaluation leakage를 데이터 신호로 감사한다.
3. `training-pipeline`: pilot 결과를 full run의 실제 optimizer·checkpoint·distributed execution으로 옮긴다.

## 4. 원문 근거와 허용한 주장 경계

- Kaplan et al. 2020: model·data·compute에 따른 경험적 power law와 undertraining 문제의 출발점으로만 사용했다.
- Hoffmann et al. 2022, Chinchilla: 고정 compute에서 model과 training token을 함께 늘리는 compute-optimal 관점을 최소 기준점으로 삼았다. 특정 모델에 고정된 만능 token/parameter 비율로 쓰지 않았다.
- Muennighoff et al. 2023: 데이터가 제한될 때 반복 token의 이득이 계속 같지 않다는 근거로 썼다. 반복 횟수 하나를 보편적 cutoff로 만들지 않았다.
- Sardana et al. 2024: inference demand까지 포함하면 training-only optimum과 선택이 달라질 수 있다는 근거로 썼다.
- Roberts et al. 2026과 Xu et al. 2026: test-time scaling과 data-constrained scaling의 최신 확장으로만 표기했다. 2026 preprint 결과를 확정된 보편 법칙으로 서술하지 않았다.

최소 바닥은 scaling-law 역사를 끝까지 거슬러 가는 것이 아니라 `N=parameter`, `D=training token`, `C=train compute`, `U=unique token`, `Q=served token`, `k=samples per answer`를 구분하고 `C_train ≈ 6ND`를 장부로 사용할 수 있는 지점이다.

## 5. 본문만으로 풀어야 하는 비공개 전이 문제

가상의 팀은 training compute 8 ZFLOPs, 중복 제거 뒤 140B unique 한국어·코드 token, 배포 memory 8GB, 평생 생성량 100B token, 일부 요청에서 best-of-4를 사용한다. 독자는 본문만으로 다음을 판단해야 한다.

1. 4B와 9B 후보의 허용 가능한 training token 수와 `D/N`, `D/U`를 계산한다.
2. training loss만 낮추는 선택과 100B served token까지 포함한 lifetime compute 선택이 다를 수 있음을 설명한다.
3. 데이터 반복이 필요한 후보에 dedup·held-out contamination·domain mix 감사를 gate로 넣는다.
4. 2·8·32 ZFLOPs pilot에서 여러 model size를 실제로 돌려 IsoFLOP envelope를 측정하고, 한 개 power law를 맹신하지 않는다.
5. pilot loss가 좋아도 deployment memory, tokenizer, post-training, serving load test를 통과하지 못하면 full run을 승인하지 않는다.

이 문제의 목적은 특정 숫자를 외우는 것이 아니라, 최신 논문의 scaling 주장을 자기 데이터와 배포 조건으로 옮길 수 있는지 검사하는 것이다.

## 6. 수식과 Viz를 설명이 아니라 검산 도구로 만들었다

표시 수식 다섯 개는 `training compute`, `data repetition`, `empirical loss`, `constrained choice`, `lifetime compute`를 담당한다. 각 수식 안에는 한글 `underbrace`가 있고 바로 뒤 `FormulaNote`가 기호 뜻과 그 연산이 필요한 이유를 설명한다. 모바일에서 긴 한 줄을 강제로 축소하지 않고 인과 순서에 맞춰 여러 줄로 나눴다. 최종 360px 실제 최소 글자는 `13.6993px`, 수식 overflow는 0이다.

세 Viz의 책임도 겹치지 않는다.

- `PretrainingBudgetLab`: 4B·9B, D, U, Q, k를 바꿔 training·inference·total compute, tokens/parameter, repetition을 직접 검산한다. 기본값 4B·160B·120B·10B·1에서 `3.84 + 0.08 = 3.92 ZFLOPs`, `D/N=40`, `D/U=1.3`이다.
- `IsoFlopPilotLab`: 2·8·32 ZFLOPs에서 1·4·9·18B 후보를 비교한다. 시각화를 위한 loss 계수는 교육용 synthetic 값임을 명시하며 demo optimum은 `4B -> 9B -> 18B`로 이동한다.
- `PretrainingRunGate`: 목표, pilot curve, 데이터 감사, end-to-end gate가 full run 승인 전에 모두 필요함을 보여 준다.

첫 시각 회귀에서 IsoFLOP 막대의 `margin-top` 백분율이 부모의 높이가 아니라 폭을 기준으로 계산되어 막대가 아래로 밀리는 결함을 발견했다. 막대를 `flex items-end` 정렬로 바꾸고 높이만 수치에 맡겨 네 후보가 모든 viewport에서 보이게 했다. 색 변경만으로 Viz 개선을 주장하지 않고 layout, 읽는 순서, 수치 상태, 실패 상태를 함께 검사한 사례다.

## 7. 4B·9B 모델로 같은 작업을 좁혀 재현하는 방법

4B 모델에는 한 번에 하나의 검증 가능한 packet만 준다.

```text
source claim 1개
-> 허용되는 해석과 금지되는 과장
-> 수식 1개 또는 Viz state 1개
-> 입력 숫자와 기대 oracle
-> 허용 파일
-> viewport/selector/overflow acceptance
```

9B 모델에는 한 인과 section 또는 한 학습 단계 전체를 맡긴다.

```text
current deployment question
-> missing decision
-> minimum foundation
-> source evidence
-> derivation and intuition
-> failure boundary
-> transfer-test coverage
-> responsive Viz contract
```

오케스트레이터는 전체 경로 순서, 최소 바닥의 중단점, source conflict, 비공개 전이 문제, 공통 기호, browser QA, 배포를 유지한다. 모델 출력은 prose부터 받지 않고 `claim/evidence/boundary/equation/viz-state/test` IR로 받은 뒤 렌더한다. 실패는 “더 깊게 써라”가 아니라 observed value와 expected invariant가 있는 결함 packet으로 되돌린다.

## 8. Claude 협업과 독립 검증 기록

Context-manager의 `ai-researcher`와 `curator`에게 원문·커리큘럼 감사를 각각 새 세션으로 요청했다. 배포 뒤 다음 `효율 추론·On-device / 서빙·인프라` 배치의 독립 리서치도 `ai-researcher`에 다시 요청했다. 세 요청 모두 `Provider error: All providers failed` 500으로 종료됐다. 사용자가 지정한 경계를 지켜 direct Claude CLI로 우회하지 않았고, 실패를 숨기지 않은 채 원 논문·공식 publication page를 직접 대조하고 Playwright 수치 oracle으로 독립 검증했다.

## 9. 검증과 배포 기준

- 새 scaling 글은 표가 0개이고 세 Viz가 360·390·768·1440px에서 모두 읽힌다.
- 표시 수식 5개와 바로 뒤 한글 설명 5개가 대응한다.
- Data 하위 경로는 `00 · 모델·Token 예산 -> 01 · 데이터 신호` 순서다.
- 전체 Pre-training 경로는 scaling -> data engine -> training pipeline 순서다.
- Post-training은 현재 병목 -> feedback -> 구현·검산 순서다.
- focused Playwright 31개와 narrative 6개, targeted ESLint, `git diff --check`, production build가 통과해야 한다.
- local production과 public URL에서 article, chunk, 수식 최소 크기, overflow, 수치 oracle을 다시 확인한 뒤에만 배포 완료로 기록한다.

## 10. 최종 배포 결과

Targeted ESLint, `git diff --check`, production build가 통과했다. 개발 서버에서 수행한 관련 회귀는 31/31, narrative audit은 6/6이며 runtime error와 overflow는 0이다. 새 production build를 제공하도록 `cm-blog.service`를 2026-07-23 00:02:40 KST에 재시작했다.

운영 포트 `http://127.0.0.1:14010`과 공개 도메인 `https://heru.ragdoll-bigeye.ts.net`에서 새 contract test를 각각 5/5 통과했다. 360·390·768·1440px의 세 Viz, 수식 5개·설명 5개, 수치 oracle, Data 하위 경로, 표 0개, document overflow와 console error를 같은 방식으로 재검사했다. Article과 chunk는 양쪽 모두 HTTP 200이다. 배포 chunk는 `llm-pretraining-scaling-CeWSeeOD.js`, 크기는 `30,200 bytes`, SHA-256은 `0f11e9c95620a18e9d25aab92669db198717e19de5352e7860778271d114048a`다.
