# LLM Data Engine content spec

## 독자의 출발 상태

- 앞 경로에서 pre-training이 다음 token 예측이고, `D`가 모델이 소비할 token 수라는 점까지 배웠다.
- `corpus`, provenance, dedup, mixture, contamination은 아직 구분하지 못할 수 있다.
- 직접 URL로 들어오는 독자를 위해 첫 질문 전에 corpus와 data engine을 일상 장면으로 정의한다.

## 서사 계약

```text
같은 분량의 식재료도 중복·상태·비율에 따라 결과가 달라지는 장면
→ token budget은 분량일 뿐이라는 연결
→ corpus와 data engine 정의
→ 같은 30B token의 학습 신호가 다른 이유 질문
→ source → extraction → normalization → dedup → mixture → synthetic → clean evaluation
→ versioned manifest를 training run으로 인계
```

## 이 글이 닫을 질문

1. 문서 수, byte 수, raw token, unique token과 sampled token은 왜 서로 다른가?
2. Parser 실패가 quality score처럼 보이는 현상을 어떻게 찾아내는가?
3. Exact duplicate, near duplicate와 benchmark contamination은 왜 별도 검사인가?
4. 공백 분절이 다른 언어에서 n-gram Jaccard threshold를 그대로 복사하면 왜 안 되는가?
5. Filter와 mixture가 원본 분포를 어떤 train distribution으로 바꾸는가?
6. 합성 sample이 verifier, novelty와 provenance를 모두 통과해야 하는 이유는 무엇인가?
7. 같은 model·compute에서 data recipe의 효과만 분리하는 ablation을 어떻게 설계하는가?

## 출처 의도와 경계

| 출처 | 사용 의도 | 과장하지 않을 경계 |
|---|---|---|
| DataComp-LM | 모델·코드·평가를 고정한 controlled data competition | 특정 filter가 모든 언어·목표에서 최적이라고 일반화하지 않음 |
| FineWeb | Common Crawl extraction·filter·dedup 선택과 공개 ablation | 15T 규모 자체를 품질 증거로 사용하지 않음 |
| C4Corpus | character n-gram 기반 다국어 near-duplicate 설계 | 서로 다른 shingling 단위의 Jaccard 값을 직접 비교하지 않음 |
| Textbooks Are All You Need II | 작은 모델에서 합성 textbook-quality data가 주는 가능성 | 교과서·합성 data만 있으면 된다는 법칙으로 확대하지 않음 |
| Nemotron 3 data releases | 2025~2026 web·code·specialized synthetic data의 versioned product 사례 | 공개 benchmark 성능을 개별 data component의 인과 효과로 단정하지 않음 |

## Hard-transfer oracle

1. 한국어·영어·중국어 corpus에서 같은 word 5-gram MinHash를 썼을 때 생길 언어별 recall 왜곡을 찾고, 분절 단위와 사람 검증 sample을 다시 설계한다.
2. 합성 code 5B token이 unit test를 통과했지만 seed clone이 train·test 양쪽에 퍼진 경우, verifier 성공과 contamination 실패를 동시에 판정한다.
3. Recipe B가 전체 평균을 올렸지만 한국어와 rare-domain held-out loss를 악화시켰을 때, filter recall·mixture weight·proxy transfer 중 어느 실험을 먼저 분기할지 결정한다.
4. 120B unique token을 360B sampled token으로 학습할 때 `D/U=3`만으로 승인하지 않고 source별 repetition, clean loss와 memorization curve를 함께 요구한다.

## 완료 조건

- `BeginnerBridge`가 첫 `QuestionLead`보다 DOM에서 먼저 온다.
- 모든 수식은 KaTeX와 한국어 FormulaNote를 짝으로 가진다.
- 360·390·768·1440px에서 DataEngineExplorer, audit rail과 수식이 잘리지 않는다.
- 마지막 handoff가 data manifest, tokenizer와 sampling recipe를 `llm-pretraining-run`에 명시적으로 넘긴다.
