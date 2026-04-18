export const C = {
  mlm: '#6366f1',
  nsp: '#10b981',
  loss: '#f59e0b',
  trend: '#0ea5e9',
  muted: 'var(--muted-foreground)',
};

export const STEPS = [
  {
    label: '① MLM 손실 함수 — 마스킹 위치만 역전파',
    body: 'MLM(Masked Language Model) 목표: 마스킹된 15% 토큰의 원본을 예측.\n각 마스킹 위치 i에서 BERT 출력 h_i → Linear(768, 30522) → logits → softmax.\n손실: L_MLM = -Sigma_{i in masked} log P(x_i | context). 마스킹 위치만 계산.\nP(x_i) = softmax(W * h_i + b)[x_i]. W는 vocab_size x hidden 투영 행렬.\n왜 15%? 너무 적으면 한 문장당 학습 신호 부족, 너무 많으면 문맥 자체가 깨짐.\n15%가 경험적 최적점(논문 Table 6에서 10%~25% 비교 실험).',
  },
  {
    label: '② 80/10/10 마스킹 규칙 — train/test 불일치 해소',
    body: '80% → [MASK] 토큰으로 교체: 모델이 예측해야 할 대상 명시적으로 표시.\n10% → 랜덤 토큰으로 교체: 노이즈를 주입해 모든 입력에 대한 예측 능력 학습.\n10% → 원본 유지: 실제 단어에 대한 표현도 학습시킴.\n왜 100% [MASK] 아닌가? 파인튜닝 시 [MASK] 토큰이 등장하지 않음.\n100% [MASK]로만 학습하면 train/test mismatch 발생 — 모델이 [MASK] 의존성 생김.\n10% 랜덤 + 10% 원본으로 모든 위치의 표현을 정확히 학습시킴.',
  },
  {
    label: '③ NSP + 전체 손실 — 두 목적함수 조합',
    body: 'NSP(Next Sentence Prediction): [CLS] 토큰의 hidden → Dense(2) → Softmax.\n50% IsNext(실제 연속 문장), 50% NotNext(랜덤 문장). 이진 분류.\n손실: L_NSP = -log P(y | h_CLS). y는 IsNext 또는 NotNext.\n전체 손실: L_total = L_MLM + L_NSP. 가중치 없이 단순 합산.\n왜? MLM은 토큰 수준, NSP는 문장 수준 — 서로 다른 규모의 의미를 동시에 학습.\n두 목적함수가 서로 보완: MLM → 단어 문맥, NSP → 문장 간 관계.',
  },
  {
    label: '④ NSP 제거 트렌드 — RoBERTa 이후',
    body: 'RoBERTa(2019) 발견: NSP 제거해도 성능 향상. 오히려 방해가 될 수 있음.\n이유: NSP 학습 데이터가 너무 쉬움(랜덤 문장은 주제부터 다름) → 유의미한 학습 신호 부족.\nALBERT: NSP 대신 SOP(Sentence Order Prediction) — 같은 문서의 문장 순서 맞추기.\n2019년 이후 표준: NSP 삭제 + 동적 마스킹(매 epoch 다른 위치) + 긴 시퀀스 고정 512.\n데이터 규모: BERT 16GB → RoBERTa 160GB → 최근 수 TB.\n학습 비용: TPU v3 Pod 64 chips 4일 → 약 $6,000. 현재 기준 수 시간 복제 가능.',
  },
];
