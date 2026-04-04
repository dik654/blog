export const STEPS = [
  {
    label: '① 토큰 → 임베딩 벡터',
    body: '문장의 각 단어를 토큰으로 분리 후, 임베딩 행렬에서 고정 길이 벡터로 변환. Gemma 2B 기준 길이 2304.',
  },
  {
    label: '② Attention + MLP 블록 통과',
    body: '각 레이어는 Attention(문맥 파악)과 MLP(비선형 변환) 블록으로 구성. 입력과 동일한 크기의 행렬 출력.',
  },
  {
    label: '③ 잔차 누적(Residual Stream)',
    body: '블록 출력을 이전 입력에 더함 = 잔차 흐름. 26개 레이어를 거치며 정보가 누적.',
  },
  {
    label: '④ 최종 예측',
    body: '마지막 벡터 × 임베딩 행렬 → softmax → 다음 단어 확률 분포. 가장 높은 확률의 토큰이 출력.',
  },
];

export const C = {
  embed: '#3b82f6',
  attn: '#8b5cf6',
  mlp: '#f59e0b',
  res: '#10b981',
  pred: '#ef4444',
  muted: 'var(--muted-foreground)',
};
