export const C = {
  enc: '#6366f1',
  dec: '#10b981',
  seq: '#f59e0b',
  arch: '#0ea5e9',
  trend: '#8b5cf6',
  muted: 'var(--muted-foreground)',
};

export const STEPS = [
  {
    label: '① Encoder-only -- BERT 계열, 이해 중심',
    body: 'BERT (2018, 110M): MLM(Masked Language Model) 사전학습.\nRoBERTa (2019, 125M): NSP 제거, 더 많은 데이터.\nALBERT (12M): 파라미터 공유로 경량화.\nDeBERTa: disentangled attention — 위치와 내용 분리.\nELECTRA: replaced token detection — 효율적 사전학습.\n분류, NER, QA 등 이해 태스크에 강점.',
  },
  {
    label: '② Decoder-only -- GPT 계열, 생성 중심',
    body: 'GPT-1 (2018, 117M) → GPT-2 (1.5B) → GPT-3 (175B).\nGPT-4 (추정 1.7T): 멀티모달, few-shot 극대화.\nLLaMA (7B~65B) → LLaMA-2 → LLaMA-3 (8B~405B).\nMistral / Mixtral: MoE(Mixture of Experts) 구조.\nClaude 3 (Anthropic), Gemini (Google).\nautoregressive 생성이 핵심 — 범용 텍스트 생성.',
  },
  {
    label: '③ 아키텍처 혁신 -- Attention 최적화',
    body: 'Sparse MoE (Switch Transformer, Mixtral): 활성 파라미터 절감.\nFlash Attention: IO-aware 알고리즘 — 메모리 O(N) 달성.\nGQA (Grouped Query Attention, LLaMA-2): KV cache 절감.\nSliding Window Attention (Mistral): 긴 시퀀스 효율.\nState Space Models (Mamba, 2023): 선형 시간 대안.\nRoPE (Rotary Positional Embedding): 상대 위치 인코딩.',
  },
  {
    label: '④ 2024 트렌드 -- 긴 문맥과 효율 추론',
    body: '긴 문맥: 1M tokens (Gemini), 200K (Claude).\n효율 추론: speculative decoding, Medusa 등.\nOpen-source 경쟁: LLaMA-3, Mixtral, Qwen.\nAgent / Tool Use: 외부 도구 호출 능력.\nMulti-step Reasoning: o1, Claude thinking 모드.\n"Attention Is All You Need" — 100,000+ 인용, 역대 최다.',
  },
];
