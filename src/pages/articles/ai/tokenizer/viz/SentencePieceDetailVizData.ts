export const C = {
  em: '#6366f1',
  prune: '#ef4444',
  sp: '#10b981',
  meta: '#0ea5e9',
  model: '#f59e0b',
  muted: 'var(--muted-foreground)',
};

export const UNIGRAM_STEPS = [
  {
    label: '① 초기 어휘 생성 -- 모든 가능 서브워드 후보 추출',
    body: '목표 크기의 수십 배로 큰 초기 어휘 집합 생성.\n"internationalization" → "i", "in", "int", ..., "ization" 등.\n보통 100만+ 개의 서브워드 후보에서 출발.\nBPE와 반대: BPE는 작은 어휘에서 쌓아올리고,\nUnigram은 큰 어휘에서 깎아내림 (top-down).',
  },
  {
    label: '② EM 알고리즘 -- E-step과 M-step으로 확률 추정',
    body: 'E-step: 각 단어의 최적 분할을 Viterbi로 탐색.\nP(segmentation) = P(x1) * P(x2) * ... * P(xn).\n확률이 가장 높은 분할을 선택.\nM-step: P(v) = count(v) / total_subword_count.\n각 토큰의 출현 빈도에 따라 확률을 재추정.',
  },
  {
    label: '③ 가지치기(Pruning) -- 손실 증가가 적은 토큰 제거',
    body: '각 토큰 v를 제거했을 때 전체 코퍼스 손실 변화 계산.\nloss_increase = loss_without_v - current_loss.\n손실 증가가 작은 토큰 = 없어도 되는 토큰 → 제거.\n상위 (1-n) 비율만 유지 (예: 80%, 20% 제거).\n목표 크기 도달까지 EM + Pruning 반복.',
  },
  {
    label: '④ 추론: Viterbi 또는 샘플링',
    body: 'Viterbi: 확률 최대 분할 탐색 (결정론적).\ndynamic programming으로 모든 가능 분할 중 최적 선택.\n샘플링: 확률에 비례한 랜덤 분할 (확률론적).\n"Hello" → ["He","llo"] or ["H","ell","o"] 랜덤.\nSubword Regularization: 샘플링으로 훈련 시 데이터 증강.',
  },
];

export const SP_STEPS = [
  {
    label: '① Raw text 직접 처리 -- 공백을 ▁로 치환',
    body: '공백도 일반 문자로 취급, ▁(U+2581)로 변환.\n언어별 전처리(형태소 분석 등) 완전히 불필요.\n"Hello world" → "▁Hello▁world"\n일본어, 한국어, 아랍어 등 어떤 언어든 동일 파이프라인.\n역변환 완전 가능: decode(encode(text)) == text.',
  },
  {
    label: '② 4가지 알고리즘 모드 -- BPE/Unigram/Char/Word',
    body: '--model_type=bpe: BPE 모드 (LLaMA, Mistral 채택).\n--model_type=unigram: Unigram 모드 (T5, ALBERT 채택, 기본값).\n--model_type=char: 문자 단위.\n--model_type=word: 단어 단위.\ncharacter_coverage=0.9995 (다국어는 1.0 근처 권장).',
  },
  {
    label: '③ 채택 모델 계보 -- T5에서 LLaMA까지',
    body: 'T5/mT5: Unigram, 32K/250K.\nALBERT, XLNet: Unigram, 30K/32K.\nLLaMA/LLaMA-2: BPE 모드, 32K.\nLLaMA-3: Tiktoken으로 전환, 128K (SentencePiece 탈피).\nGemma: SentencePiece, 256K. Mistral/Mixtral: BPE 모드, 32K.',
  },
];
