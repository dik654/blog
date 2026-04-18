export const C = {
  bpe: '#0ea5e9',
  wp: '#10b981',
  uni: '#f59e0b',
  ko: '#6366f1',
  guide: '#8b5cf6',
  warn: '#ef4444',
  muted: 'var(--muted-foreground)',
};

export const COMPARE_STEPS = [
  {
    label: '① 학습 방향 -- bottom-up vs top-down',
    body: 'BPE: 문자 → 조합 → 단어 (빈도 기반 상향식 병합).\nWordPiece: 문자 → 조합 → 단어 (우도 기반 상향식 병합).\nUnigram: 큰 집합 → 제거 → 최적 집합 (확률 기반 하향식 가지치기).\n분할 방식도 다름: BPE/WP = longest-match greedy, Unigram = Viterbi DP.\n다중 분할(같은 단어의 여러 분할): BPE/WP 불가, Unigram 가능.',
  },
  {
    label: '② OOV 처리와 분할 전략',
    body: 'BPE (byte-level): 바이트 분해로 OOV 완전 차단.\nWordPiece: 어휘에 없으면 [UNK] 토큰 발생 가능.\nUnigram: 낮은 확률로 분할 -- 이론상 OOV 매우 드뭄.\n분할: BPE/WP는 "unhappy" → "un"+"happy" greedy.\nUnigram: 모든 가능 분할 중 확률 최대 선택 (DP).',
  },
  {
    label: '③ 채택 모델과 성능 특성',
    body: 'BPE: GPT 계열, RoBERTa. 빠르고 단순, byte-level로 범용.\nWordPiece: BERT 계열. 의미 이해에 강점, ## 접두사.\nUnigram: T5, LLaMA(SP). 다국어 강점, Subword Regularization.\n속도: BPE(Tiktoken) > Unigram > WordPiece.\n다국어: Unigram(SP) >= BPE(byte) > WordPiece.',
  },
];

export const KO_STEPS = [
  {
    label: '① 모델별 한국어 토큰 수 비교',
    body: '"인공지능 모델이 한국어를 자연스럽게 처리합니다." (25자)\nGPT-4 (cl100k): ~23 토큰 -- 한글을 바이트 단위로 세분화.\nGPT-4o (o200k): ~15 토큰 -- 다국어 vocab 확대 효과.\nBERT multilingual (119K): ~18 토큰.\nGemma-2 (256K): ~12 토큰 -- 가장 효율적.',
  },
  {
    label: '② 한국어 특화 모델의 효율',
    body: 'KoGPT (한국어 특화 tokenizers): ~10 토큰.\nKoBERT (8K 한국어 vocab): ~14 토큰.\nHyperCLOVA (네이버): ~9 토큰 -- 한국어 최적화.\nLLaMA-2 (32K, 한국어 vocab 부족): ~21 토큰 -- 비효율.\nLLaMA-3 (128K, 다국어 확장): ~14 토큰 -- 개선.',
  },
];

export const GUIDE_STEPS = [
  {
    label: '① 처음부터 학습 -- 목표 언어와 도메인에 맞게',
    body: '다국어 목표: SentencePiece (Unigram) 권장.\n영어 중심: BPE (byte-level) 권장.\n도메인 특화(의학/법률): 해당 코퍼스로 Unigram 학습.\nvocab_size: 32K(단일) ~ 256K(대규모 다국어).\ncharacter_coverage: 0.9995 (다국어는 1.0).',
  },
  {
    label: '② fine-tuning -- 원본 토크나이저 유지 원칙',
    body: '원본 토크나이저 변경 금지 -- 임베딩 재학습 필요.\n어휘 추가 가능: add_tokens + resize_token_embeddings.\n한국어 fine-tuning: Ko-LLaMA 계열 (vocab 이미 확장).\n평가: compression ratio(높을수록), fertility(낮을수록),\nunknown ratio(0 근처) 세 지표로 토크나이저 품질 판단.',
  },
  {
    label: '③ 비용 -- API 과금은 토큰 단위',
    body: 'OpenAI API: 토큰 단위 과금.\n한국어는 영어 대비 2~3배 토큰 → 2~3배 비용.\nGPT-4o로 한국어 비용 크게 절감 (~40% 토큰 감소).\nGemma 기반: 256K vocab으로 한국어 최적, 오픈소스.\n결론: 한국어 프로젝트는 GPT-4o 또는 Gemma 기반이 비용 유리.',
  },
];
