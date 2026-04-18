export const C = {
  qkv: '#6366f1',
  attn: '#10b981',
  head: '#f59e0b',
  pat: '#0ea5e9',
  muted: 'var(--muted-foreground)',
};

export const STEPS = [
  {
    label: '① Q, K, V 투영과 헤드 분리',
    body: '입력 X: (512, 768). 각 토큰이 768차원 벡터.\nW_Q, W_K, W_V: 각각 768x768 가중치 행렬.\nQ = X @ W_Q → (512, 768). K, V도 동일.\nReshape: (512, 768) → (12 heads, 512, 64). 각 헤드가 64차원 부분공간 담당.\nd_k = d_v = d_model / H = 768 / 12 = 64.\n왜 분리? 각 헤드가 서로 다른 관계(구문, 의미, 위치)를 독립적으로 학습.',
  },
  {
    label: '② Scaled Dot-Product Attention',
    body: '각 헤드 h에서: scores = Q_h @ K_h^T → (512, 512). 모든 토큰 쌍의 유사도.\n스케일링: scores / sqrt(64) = scores / 8. 차원이 클수록 dot product 값이 커짐.\n왜 sqrt(d_k)? 스케일링 없으면 softmax가 포화(극단적 0/1) → 기울기 소실.\nattn = softmax(scores) → 각 행의 합 = 1. 확률 분포로 변환.\nhead_h = attn @ V_h → (512, 64). 가중 합산으로 문맥 반영된 벡터 생성.\nBERT는 마스킹 없음(GPT와 차이) — 모든 위치가 모든 위치를 양방향 참조.',
  },
  {
    label: '③ 헤드 결합 및 출력 투영',
    body: 'concat = cat(head_1, ..., head_12) → (512, 768). 12개 헤드의 64차원 출력을 연결.\noutput = concat @ W_O → (512, 768). W_O: 768x768 투영 행렬.\n블록당 파라미터: 4 x 768 x 768 = 2,359,296 (W_Q + W_K + W_V + W_O).\nResidual: output = output + X (입력을 더함).\nLayerNorm: 각 토큰 벡터를 평균 0, 분산 1로 정규화.\n이후 FFN(768→3072→768)과 두 번째 Add&Norm을 거쳐 다음 층으로.',
  },
  {
    label: '④ Attention 헤드별 학습 패턴',
    body: 'Syntactic heads(구문): 주어-동사 일치, 수식어-피수식어, 동사-목적어 관계 감지.\nSemantic heads(의미): 공참조 해소(coreference), 명사구 경계, 의미 유사성.\nPositional heads(위치): 직전/직후 토큰 집중, 문장 시작/끝 패턴, 고정 거리 참조.\nBroad heads(전역): 문장 전체 요약, [CLS]와 [SEP]를 강하게 참조.\nContextualized embedding: "bank"(강둑) vs "bank"(은행) — 동일 단어도 문맥에 따라 다른 벡터.\nClark et al.(2019): bertviz로 144개(12 heads x 12 layers) 패턴 시각화 연구.',
  },
];
