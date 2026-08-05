# 01 · 체스 = RL 연구의 통제환경

- **상태**: 신규 글 후보
- **위치**: ai/articlesReinforcementLearning.ts — 기존 "강화학습 적용 계약" 시리즈의 앞단(왜 통제환경인가) 또는 사례 글. 시리즈의 6섹션 골격(context/claim/mechanism/evidence/reproduction/legacy)을 그대로 쓸 수 있음.

## 원 대화 핵심

- ✅ LLM을 직접 RL 연구 대상으로 삼기 어려워(야생 데이터·수많은 변수·재현 곤란·"우연히 이미 학습" 오염) 체스처럼 통제 가능한 환경에서 먼저 실험하는 흐름이 실재한다.
- 체스가 선택되는 이유: state/action/reward가 명확하고 정답이 존재하며 변수 통제가 가능 → RL 알고리즘·reasoning·scaling law·pretrain vs RL 배분을 격리 실험할 수 있는 벤치마크.
- ✅ "pretrain loss ↔ RL compute 배분" scaling law 연구가 최근 논문 흐름으로 존재한다.
- 핵심 판별 문제: LLM에선 "RL이 정말 좋아진 건지 / 이미 pretrain에 있던 능력이 드러난 건지" 분리가 어렵다 — 체스는 이 confound를 제거한다.

## 글의 각도

블로그 RL 시리즈가 "실행 계약" 프레임이므로: **"환경 계약이 깨끗해야 RL 주장이 성립한다"**로 연결.
기존 1편("이 문제가 정말 RL인가", "환경과 feedback 계약")의 실전 판별 기준을 체스 연구 흐름이 정확히 예시한다 — 대화 소재가 기존 골격의 사례로 바로 들어감.
확장 훅: pretrain-vs-RL compute 배분 곡선은 topdownResearchTracks의 scaling 트랙과도 교차.

## 채우기 전 확인

- 구체 논문 특정 필요: 체스 RL testbed·pretrain/RL scaling 관련 최근 논문 2~3편 (대화에는 논문명 없음).
- "pretrain loss가 낮을수록 RL compute 효율이 어떻게 변하는가"의 실제 곡선 형태 — 대화는 관계의 존재만 언급.
