export const C = {
  dec: '#6366f1',
  enc: '#10b981',
  attn: '#f59e0b',
  layer: '#0ea5e9',
  model: '#8b5cf6',
  muted: 'var(--muted-foreground)',
};

export const STEPS = [
  {
    label: '① Q/K/V 출처 분리 -- Q는 디코더, K/V는 인코더',
    body: 'Self-Attention은 Q, K, V 전부 같은 시퀀스에서 생성.\nCross-Attention은 Q만 디코더, K/V는 인코더 출력에서 생성.\nQ = H_dec · W_Q (T_tgt x d_k), K = H_enc · W_K (T_src x d_k).\nV = H_enc · W_V (T_src x d_v).\n번역 "나는 학생이다" → "I am a student"에서\n"I"의 Q가 "나는"의 K와 높은 점수 → 정렬(alignment).',
  },
  {
    label: '② 직사각형 어텐션 행렬 -- T_tgt x T_src',
    body: 'Self-Attention 행렬은 정사각형 (T x T).\nCross-Attention 행렬은 직사각형 (T_tgt x T_src).\nscores = Q · K^T / sqrt(d_k) → (T_tgt, T_src) 크기.\nattn = softmax(scores), output = attn · V → (T_tgt, d_v).\n각 target 토큰이 모든 source 토큰을 참조 가능.\nBahdanau attention의 진화형 — 병렬 계산 가능.',
  },
  {
    label: '③ 디코더 레이어 3단 구조 -- Masked → Cross → FFN',
    body: '디코더 레이어 내부: 3개 서브레이어를 순서대로 통과.\n1. Masked Self-Attention: 미래 토큰 차단, 자기 참조만.\n2. Cross-Attention: 인코더 출력 H_enc 참조.\n3. FFN: 토큰별 독립 변환.\n각 서브레이어마다 LayerNorm + 잔차 연결 적용.\nH_enc는 모든 디코더 레이어의 Cross-Attention에 공유.',
  },
  {
    label: '④ 사용 모델과 Decoder-only 차이',
    body: 'Encoder-Decoder 모델: Transformer 원본, T5, BART, FLAN-T5.\n이들은 Cross-Attention으로 인코더-디코더 연결.\nDecoder-only 모델: GPT, LLaMA, Mistral.\n이들은 Cross-Attention 없음 — 단일 시퀀스 내 Self-Attention만.\n프롬프트 자체가 인코더 역할을 겸하는 셈.\nSeq2Seq 태스크(번역, 요약)에는 Encoder-Decoder가 유리.',
  },
];
