export const VLLM_CURRENT_RELEASE = {
  tag: 'v0.26.0',
  commit: '568afb3a13806beb53bb2e6bd518269357b237c0',
  releasedAt: '2026-07-27',
} as const;

export const VLLM_EXCERPT_SET = {
  'vllm/v1/engine/core.py': {
    commit: '7afe0faab1eb2ab84cda5cab29b24046e516f7b8',
    date: '2026-03-13',
  },
  'vllm/v1/core/sched/scheduler.py': {
    commit: '35bdca5431e652b4c00267489a632c1bf5522103',
    date: '2026-03-11',
  },
  'vllm/v1/core/kv_cache_manager.py': {
    commit: '4ff8c3c8f9ece010a1d0e376f5cc1b468b95f366',
    date: '2026-03-10',
  },
  'vllm/v1/core/kv_cache_coordinator.py': {
    commit: '97fa8f65909d4d8f2eb0edc2137fb22f576a5b25',
    date: '2026-02-10',
  },
  'vllm/v1/core/block_pool.py': {
    commit: 'a0fe7ea2f052bb44820bc06a5635456b8d1383af',
    date: '2026-02-21',
  },
  'vllm/v1/worker/gpu_worker.py': {
    commit: '747b0681364aa53235b71a30488f450652cc316a',
    date: '2026-03-16',
  },
  'vllm/entrypoints/openai/api_server.py': {
    commit: '6682c231fa97f33d3b3f4d788da4e14959989a67',
    date: '2026-03-16',
  },
  'vllm/v1/spec_decode/eagle.py': {
    commit: '494636b29d3b3a7b35020e4becb6c6995e200f9d',
    date: '2026-03-30',
  },
  'vllm/v1/spec_decode/draft_model.py': {
    commit: 'cd7643015e583c1e78d437118a6ce8282cb85663',
    date: '2026-03-25',
  },
  'vllm/v1/sample/sampler.py': {
    commit: 'd707678dfb9a1f616d174022ebc74065d1011863',
    date: '2026-02-13',
  },
  'vllm/v1/sample/rejection_sampler.py': {
    commit: '9e0f44bec449df17d30ed9abef7aeedc059ddfde',
    date: '2026-03-04',
  },
  'vllm/v1/request.py': {
    commit: '1bf2ddd0ee24cf878a87b643536b749676e8f902',
    date: '2026-03-25',
  },
} as const;

export type VllmExcerptPath = keyof typeof VLLM_EXCERPT_SET;

export function vllmExcerptUrl(path: VllmExcerptPath) {
  return `https://github.com/vllm-project/vllm/blob/${VLLM_EXCERPT_SET[path].commit}/${path}`;
}
