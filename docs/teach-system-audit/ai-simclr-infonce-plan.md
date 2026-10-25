# ai/simclr-infonce 재작성 계획

## 분류

- 트랙: concept
- 형식: explanation
- 매체: article
- 직속 부모: `/cs/ai/contrastive-learning#return-map`
- 현재 영역: SimCLR·NT-Xent
- 독자: 대조 학습의 pair 의미와 encoder/projection 경계를 이해한 뒤 NT-Xent 계산을 처음 따라가는 학습자
- 답할 질문: N개 원본에서 만든 2N개 view가 어떻게 2N개의 분류 loss가 되고, temperature가 후보 가중치와 hidden-positive 오류를 어떻게 바꾸는가?
- 범위 밖: 특정 환경의 batch size·temperature 선택, 학습 클러스터 구성, 제품 비교, 배포·운영 Runbook

## 한 문장 답

SimCLR은 각 view가 자기 자신을 뺀 2N−1개 후보에서 같은 원본의 다른 view를 고르게 하며, NT-Xent는 이 2N개 방향별 softmax loss를 평균합니다.

## 이어지는 질문

Temperature를 낮춰 후보 점수 차이를 키우면, 실제로 같은 의미인 hidden positive까지 더 강하게 밀어내지 않을까요?

## 대표 사례

- 원본: A·B·C, `N=3`
- view: A₁·A₂·B₁·B₂·C₁·C₂, `2N=6`
- 추적 anchor: A₁
- 후보: A₂·B₁·B₂·C₁·C₂, `2N−1=5`
- positive: A₂
- negative로 취급되는 후보: B₁·B₂·C₁·C₂
- 설명용 cosine: `[0.8, 0.4, 0.1, −0.1, 0.0]`
- temperature: `τ=0.5`
- logit: `[1.6, 0.8, 0.2, −0.2, 0.0]`
- 지수 점수 합: `Z=10.219`
- positive 확률: `0.485`
- 한 방향 loss: `0.724`
- temperature 경계 사례: similarity gap `0.1`, `τ=1 → 1.11배`, `τ=0.1 → 2.72배`

위 수치는 계산 구조를 설명하기 위한 fixture이며 논문의 측정 결과가 아닙니다.

## 독자 순서

1. 부모 지도에서 SimCLR 영역을 찾습니다.
2. 원본 3개가 view 6개로 펼쳐지는 구조를 셉니다.
3. A₁→A₂와 A₂→A₁이 서로 다른 anchor loss라는 점을 확인합니다.
4. A₁ 한 방향의 cosine→logit→exp→probability→loss를 계산합니다.
5. 같은 similarity gap에서 temperature만 바꿉니다.
6. 다른 source ID가 같은 상품인 hidden-positive 반례를 넣습니다.
7. 2N view·self mask·양방향 평균·후보 품질이라는 결론을 부모 지도에 반환합니다.

## 시각화

### Batch shape

- 질문: 원본 3개가 왜 view 6개와 anchor당 후보 5개가 되는가?
- 장면: source 선택 → view 생성 → A₁ anchor → self 제외 candidate set
- 상태 변화: source count·view count·anchor 역할·candidate membership

### NT-Xent 계산

- 질문: 다섯 cosine이 어떻게 positive 확률과 loss가 되는가?
- 장면: cosine → temperature logit → 지수 점수와 partition → probability와 negative log
- 상태 변화: 같은 후보 행의 활성 열과 계산 결과

### Temperature 경계

- 질문: 같은 similarity gap에서 temperature와 hidden positive가 어떤 오류를 만드는가?
- 장면: gap 고정 → τ=1 → τ=0.1 → semantic duplicate 반례
- 상태 변화: 상대 점수 비와 후보 관계 판정

모든 시각화는 사용자 동작 후 한 번만 재생하고 마지막 상태에 멈춥니다. reduced motion에서는 마지막 장면을 보여주며, JavaScript가 꺼진 상태에서는 같은 순서와 결론을 번호 목록으로 제공합니다.

## 근거

- 공식 PMLR 논문 페이지: https://proceedings.mlr.press/v119/chen20j.html
- 공식 논문 PDF: https://proceedings.mlr.press/v119/chen20j/chen20j.pdf
- 적용 범위: 2.1절과 Algorithm 1의 2N view, self mask, 양방향 loss, normalized projection, temperature 정의
- 비주장: 논문 설정의 batch size·temperature·augmentation이 모든 domain의 기본값이라는 주장

## 검증

- [ ] 학습 계약과 concept graph 등록
- [ ] 기존 주장 보존과 표현 정리
- [ ] 수치 fixture를 코드와 본문이 함께 사용
- [ ] 수식 의미·치환·경계 조건 확인
- [ ] 계산 설명 audit
- [ ] 개별 글 audit
- [ ] 전체 lint와 build
- [ ] 데스크톱 1440×1000
- [ ] 모바일 390×844
- [ ] 키보드 이전·다음
- [ ] reduced motion 마지막 상태
- [ ] JavaScript 비활성 정적 순서
- [ ] 페이지 가로 넘침 없음
- [ ] 공개 경로 확인
