import type { Article } from '../types';

export const vllmServingArticles: Article[] = [
  {
    slug: 'vllm-serving',
    title: 'vLLM: 고성능 LLM 서빙 엔진',
    subcategory: 'ai-llm-serving',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'paged-attention', title: 'PagedAttention & KV 캐시 관리' },
      { id: 'serving-architecture', title: '서빙 아키텍처 & 최적화' },
    ],
    component: () => import('@/pages/articles/ai/vllm-serving'),
  },
  {
    slug: 'vllm-scheduler',
    title: 'vLLM Scheduler: Continuous Batching 구현 코드 분석',
    subcategory: 'ai-llm-serving',
    sections: [
      { id: 'overview', title: '스케줄러 개요' },
      { id: 'schedule-method', title: 'schedule() 메서드 분석' },
      { id: 'prefill-decode', title: 'Prefill/Decode 통합 모델' },
      { id: 'preemption', title: '프리엠션 메커니즘' },
    ],
    component: () => import('@/pages/articles/ai/vllm-scheduler'),
  },
  {
    slug: 'vllm-paged-attention',
    title: 'vLLM PagedAttention: KV 캐시 블록 관리 구현',
    subcategory: 'ai-llm-serving',
    sections: [
      { id: 'overview', title: 'KV 캐시 블록 관리 개요' },
      { id: 'block-pool', title: 'BlockPool: 물리 블록 관리' },
      { id: 'kv-cache-manager', title: 'KVCacheManager: 할당 전략' },
      { id: 'prefix-caching', title: 'Prefix Caching (APC)' },
    ],
    component: () => import('@/pages/articles/ai/vllm-paged-attention'),
  },
  {
    slug: 'vllm-spec-decode',
    title: 'vLLM Speculative Decoding: 투기적 추론 구현',
    subcategory: 'ai-llm-serving',
    sections: [
      { id: 'overview', title: 'Speculative Decoding 개요' },
      { id: 'draft-verify', title: 'Draft-Verify 파이프라인' },
      { id: 'eagle-mtp', title: 'EAGLE vs Draft Model vs MTP' },
    ],
    component: () => import('@/pages/articles/ai/vllm-spec-decode'),
  },
];
