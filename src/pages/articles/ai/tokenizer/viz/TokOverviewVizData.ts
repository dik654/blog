export const C = {
  norm: '#6366f1',
  pre: '#8b5cf6',
  model: '#10b981',
  post: '#f59e0b',
  vocab: '#0ea5e9',
  muted: 'var(--muted-foreground)',
};

export const PIPELINE_STEPS = [
  {
    label: '① Normalization -- 유니코드 정규화 + 대소문자 + 악센트 제거',
    body: '입력 텍스트의 표면 형태를 통일하는 첫 단계.\nNFC/NFD/NFKC/NFKD 중 하나를 선택해 유니코드를 정규화하고,\nlowercase 변환, 악센트 제거(cafe → cafe) 등을 적용.\n중복 공백도 이 단계에서 정리.\nHugging Face: normalizer=NFD() + StripAccents()로 구성.',
  },
  {
    label: '② Pre-tokenization -- 공백/구두점으로 초벌 분리',
    body: '서브워드 분할 전에 문장을 단어 단위로 쪼개는 단계.\n"The cat sits." → ["The", "cat", "sits", "."]\nWhitespace / Metaspace / ByteLevel 등 방식이 있으며,\nSentencePiece는 이 단계를 생략하고 raw text를 직접 처리.\n이 단계의 선택이 서브워드 경계에 큰 영향.',
  },
  {
    label: '③ Model -- BPE / WordPiece / Unigram 서브워드 분할',
    body: '핵심 알고리즘이 작동하는 단계.\n각 단어를 어휘집의 서브워드 토큰으로 분할.\n예: "unhappiness" → ["un", "##happy", "##ness"] (WordPiece)\n알고리즘마다 학습 방향, 병합 기준, 분할 전략이 다름.\nBPE=빈도 상향식, WordPiece=우도 상향식, Unigram=확률 하향식.',
  },
  {
    label: '④ Post-processing -- 특수 토큰 + 패딩 + 마스크 생성',
    body: '모델 입력 형식에 맞게 후처리.\n[CLS], [SEP] (BERT) 또는 <|bos|>, <|eos|> (GPT) 등 특수 토큰 추가.\nmax_length에 맞춰 패딩/자르기.\nattention_mask를 생성하여 패딩 위치를 모델에 알림.\nTemplateProcessing으로 "[CLS] {A} [SEP] {B} [SEP]" 형태 구성.',
  },
];

export const VOCAB_STEPS = [
  {
    label: '① vocab -- 토큰-ID 매핑 테이블 (= 임베딩 행렬 크기)',
    body: 'vocab 크기가 곧 임베딩 행렬의 행 수.\nBERT=30K, GPT-4=~100K, LLaMA=32K, Gemma=256K.\n큰 vocab은 토큰 수를 줄이지만 메모리 비용 증가.\n출력 softmax도 vocab 크기에 비례 -- 실질적 모델 크기 요소.\n적정 크기 = 커버리지와 효율의 트레이드오프.',
  },
  {
    label: '② BOS/EOS/UNK/PAD -- 특수 토큰의 역할',
    body: 'BOS(Beginning of Sequence): 시퀀스 시작 표시.\nEOS(End of Sequence): 생성 멈춤 신호 (GPT-2: <|endoftext|> = 50256).\nUNK(Unknown): 어휘집에 없는 토큰. byte-level BPE는 UNK 불발생.\nPAD(Padding): 배치 내 길이 맞추기. attention_mask로 마스킹.\n[CLS]: 분류용(BERT), <|system|>/<|user|>: chat template용.',
  },
  {
    label: '③ Compression Ratio -- 문자 수 / 토큰 수',
    body: '높을수록 같은 텍스트를 적은 토큰으로 표현 = 효율적.\n영어 GPT-4: 약 4.0 (4자/토큰).\n한국어 GPT-4: 약 1.2 (1.2자/토큰) -- 매우 비효율.\n한국어 LLaMA-ko: 약 3.5 (한국어 vocab 추가로 개선).\n같은 문장이라도 토크나이저에 따라 2~3배 토큰 수 차이.',
  },
];
