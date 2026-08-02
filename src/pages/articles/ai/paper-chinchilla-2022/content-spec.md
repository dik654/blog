# Chinchilla 2022 원문 재구성 content spec

## 역할과 최소 하향선

이 글은 scaling law 역사를 모두 설명하지 않는다. 현재 pre-training 예산 결정을 검산하는 데 필요한 최소 원문으로 Chinchilla 2022에서 멈춘다. Pre-training, token, parameter와 compute를 모르는 독자는 `llm-pretraining-scaling`으로 먼저 보낸다.

## 논문 재구성 순서

```text
같은 compute에서 N과 D가 trade-off하는 연구 질문
→ 400개 이상 run을 세 단면으로 읽은 이유
→ fitted loss의 model/data 부족 항
→ allocation exponent 유도
→ 70B·1.4T matched-compute full run
→ 논문이 직접 인정한 외삽·epoch·downstream 한계
→ 현재 inference-aware 판단으로 복귀
```

## 저자 의도와 증거 소유권

- Approach 1은 training curve의 compute별 lower envelope가 근거다.
- Approach 2는 아홉 IsoFLOP budget에서 model size별 final-loss valley가 근거다.
- Approach 3은 `E+A/N^alpha+B/D^beta` parametric fit이 근거다.
- 세 접근의 근접한 exponent는 robustness evidence이지 정확한 보편 상수가 아니다.
- 70B·1.4T Chinchilla와 280B·300B Gopher는 방향을 검증한 matched-compute full run이다.
- Inference demand, 여러 epoch, 현재 architecture와 tokenizer는 원문 검증 범위 밖이다.

## Hard-transfer oracle

1. `alpha=.34`, `beta=.28`에서 `a=beta/(alpha+beta)`, `b=alpha/(alpha+beta)`를 계산하고 왜 반대편 loss exponent가 allocation을 정하는지 설명한다.
2. Compute가 16배일 때 .50/.50과 Kaplan .73/.27이 N·D를 얼마나 다르게 늘리는지 비교한다.
3. 20 token/parameter를 4B·9B에 복사한 계획이 왜 pilot fit과 inference demand를 누락하는지 반박한다.
4. Chinchilla가 일부 MMLU subject에서 Gopher를 이기지 못한 사실과 평균 개선을 동시에 보존해 결론 범위를 적는다.

## 완료 조건

- 논문의 세 접근, fitted constants, matched-compute 결과와 four limitations을 본문에서 각각 찾을 수 있다.
- 모든 수식 항은 한국어 underbrace와 FormulaNote로 역할을 설명한다.
- 360·390·768·1440px에서 Chinchilla labs와 수식이 잘리지 않는다.
- 글 끝에서 더 오래된 scaling 역사로 내려가지 않고 `llm-data-engine`과 현재 scaling 판단으로 다시 올라간다.
