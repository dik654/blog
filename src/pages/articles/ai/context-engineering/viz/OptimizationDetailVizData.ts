import type { StepDef } from '@/components/ui/step-viz';

export const BUDGET_C = '#6366f1';
export const COMPRESS_C = '#10b981';
export const CACHE_C = '#f59e0b';
export const SAVE_C = '#ef4444';

export const BUDGET_STEPS: StepDef[] = [
  { label: 'Token Budget 분배 전략', body: 'Total Budget: 128K (GPT-4-turbo) 기준\nSystem Prompt 5K (고정) | Current Query 1K | History 10K (동적)\nRAG Results 30K (동적) | Tool Outputs 5K | Scratchpad 3K\nOutput Buffer 4K (예약) | Safety Margin 5K (예약)\n총 사용 63K, 여유 65K' },
  { label: '초과 시 대응 + Compression 기법', body: '초과 시 대응:\n1. Truncate oldest history → 2. Summarize middle\n3. Compress RAG results → 4. Drop low-relevance items\n\nCompression 기법:\n① Summarization (LLM): 10K→1K, 품질 높음\n② Extractive: 핵심 문장만, 비용 낮음\n③ Semantic: 임베딩 기반 중복 제거\n④ LLMLingua: 토큰 수준 3-4x 압축 (논문)' },
  { label: 'Lost in the Middle 완화', body: '현상: 긴 컨텍스트의 중간부 정보를 LLM이 잘 참조하지 못함\n\n완화 전략:\n중요 정보는 start/end에 배치 (U자 커브)\nKey facts 반복 — 앞뒤에 중복 배치\nExplicit referencing — "위의 3번 문서에 따르면..."\nAttention sink tokens — 첫 몇 토큰이 attention 기준점 역할' },
];

export const CACHE_STEPS: StepDef[] = [
  { label: 'Prompt Caching 원리', body: 'Anthropic Prompt Caching (2024):\n아이디어 — 공통 프롬프트 prefix 캐싱\n첫 호출: 전체 처리 (비싸고 느림)\n이후 호출: 공통 부분 재사용 (싸고 빠름)\n\nCache writes: 1.25x base cost\nCache reads: 0.1x base cost (90% 할인!)\nTTL: 5분, 최소 1024 tokens' },
  { label: '비용 절감 시뮬레이션', body: '예시: System 5K + RAG 20K (캐시 가능) + Query 100 (변동)\n\nWithout cache: 25.1K × $3/M = $0.075/req\nWith cache write (1회): 25K × $3.75/M = $0.094\nWith cache hit (N회): 25K × $0.30/M + 100 × $3/M = $0.008/req\n\n100 queries: $7.50 → $0.88 = 88% 비용 절감!' },
  { label: '캐시 활용 조건 + KV Cache', body: '캐시 효과적인 경우:\n같은 system prompt 반복 사용\n같은 RAG context 다중 쿼리\nFew-shot examples 고정\n\nOpenAI (자동): 1024+ prefix 자동 캐싱, 50% 할인, 1시간 TTL\n\nKV Cache (모델 내부): Transformer K,V 저장 → 같은 prefix 재사용\n실무 팁: 정적 앞쪽, 동적 뒤쪽 배치' },
];
