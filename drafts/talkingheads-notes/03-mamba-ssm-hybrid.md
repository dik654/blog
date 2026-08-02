# 03 · Mamba·SSM·하이브리드 — 기존 글 보강 소스

- **상태**: **기존 글 보강** (신규 글 만들지 말 것)
- **위치**: ai/articlesLLMArchitectures.ts — "Hybrid·Linear Attention: state 메모리부터 Qwen3.6까지" (overview/memory-ledger/recurrence-duality/delta-update/parallel-runtime/lineage/takeaway 섹션 보유). 대화 소재는 주로 **lineage(계보)와 "왜 Mamba가 못 떴나"** 서사에 들어감.

## 원 대화 핵심

- ✅ Mamba = Transformer 대신 SSM 사용. 대표 논문 Mamba/Mamba2. 장점: O(n)·긴 문장·메모리 적음·추론 빠름.
- ✅ 단점: scaling이 Transformer만큼 안 됨, 초대형에서 성능 유지 어려움 — 현재까지의 일반적 평가.
- ✅ 최근 추세 = Transformer + SSM + Linear Attention 하이브리드.
- ⚠️ "Kimi·Qwen이 Mamba 파생"은 과장 — 정확히는 일부 모델이 SSM/선형 어텐션 계열 아이디어를 일부 채택한 하이브리드.
- **왜 Mamba가 못 떴나** (기존 글 lineage 섹션에 붙일 서사):
  Transformer가 너무 강함 + FlashAttention 등장 + KV Cache 최적화 + GPU 최적화
  → Transformer의 최대 약점(attention 비용)이 보완되면서 Mamba의 상대적 장점이 축소.
- ✅ SSM의 수학적 유래 = 제어공학: 미분방정식 → 상태방정식(x' = Ax + Bu) → State Space.
  단, LLM용 Mamba는 여기에 딥러닝 학습 구조를 결합한 것이지 PID 제어를 쓰는 게 아님 — 이 오해 정정 자체가 좋은 한 단락.

## 보강 포인트

1. lineage 섹션: "FlashAttention·KV cache 최적화가 Mamba의 기회비용을 잠식했다"는 반대편 계보 한 단락 — KV Cache 글(GQA/MLA/SWA)과 상호 링크.
2. overview 또는 takeaway: "X가 Mamba 파생"류 보도 표현을 판독하는 법 — 실제 채택 범위(레이어 비율, 어떤 축)를 숫자로 확인하라는 프로토콜. 기존 글의 "현재 보고서 판독법" 섹션과 정확히 결이 맞음.
3. recurrence-duality 도입부: 제어공학 x'=Ax+Bu 유래 + "PID는 아니다" 경계.

## 채우기 전 확인

- 기존 글이 이미 SSD/KDA/Qwen3.6까지 다루므로 중복 서술 확인 후 **비어 있는 서사만** 추가.
