export const C = {
  tok: '#6366f1',
  spec: '#ef4444',
  enc: '#10b981',
  vocab: '#f59e0b',
  model: '#0ea5e9',
  muted: 'var(--muted-foreground)',
};

export const STEPS = [
  {
    label: '① 텍스트 수집 + 토큰화 -- 코퍼스에서 어휘 추출',
    body: '코퍼스 수집: ["나는 학생이다", "나는 책을 읽는다", ...].\n토큰화: 단어 단위 또는 서브워드(BPE, WordPiece, SentencePiece).\ntokens = ["나는", "학생이다", "나는", "책을", "읽는다", ...].\n빈도 계산: freq = {"나는": 150, "이다": 100, ..., "저자": 3}.\n상위 N개를 선택하여 어휘(vocabulary) 구축.\n어휘 크기가 임베딩 테이블 크기를 결정.',
  },
  {
    label: '② 특수 토큰 -- 시퀀스 경계 표시',
    body: 'PAD (ID=0): 패딩용, 배치 내 시퀀스 길이 통일.\nUNK (ID=1): 미등록 단어 대체.\nSOS/BOS (ID=2): 시퀀스 시작 표시.\nEOS (ID=3): 시퀀스 종료 표시.\n"나는 학생이다" → ids: [2, 4, 5, 3] (SOS, 나는, 학생이다, EOS).\n특수 토큰 없이는 모델이 시퀀스 경계를 인식 불가.',
  },
  {
    label: '③ 토큰 ↔ ID 매핑 -- 양방향 변환',
    body: 'word2idx: {"나는": 4, "학생": 5, "이다": 6, ...}.\nidx2word: {4: "나는", 5: "학생", 6: "이다", ...}.\n인코딩: 문장 → 토큰 → ID 시퀀스.\n디코딩: ID 시퀀스 → 토큰 → 문장.\n추론 시 모델 출력(ID) → idx2word로 텍스트 복원.\n전체 파이프라인: 텍스트 → 토큰 → ID → 임베딩.',
  },
  {
    label: '④ 실무 Vocabulary 크기 비교',
    body: 'BERT-base: 30,522 (WordPiece 기반).\nGPT-2: 50,257 (Byte-level BPE).\nLLaMA: 32,000 (SentencePiece BPE).\nGPT-4: 100,277 (tiktoken, cl100k_base).\nGemma: 256,000 (대규모 다국어).\n어휘 크기 x d_model = 임베딩 파라미터 수.',
  },
];
