import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const vllmTree: FileNode = d('vllm', [
  d('v1/engine', [
    f('core.py', 'vllm/v1/engine/core.py', 'engine-core'),
  ]),
  d('v1/core', [
    d('sched', [
      f('scheduler.py', 'vllm/v1/core/sched/scheduler.py', 'scheduler'),
    ]),
    f('kv_cache_manager.py', 'vllm/v1/core/kv_cache_manager.py', 'kv-cache-mgr'),
    f('kv_cache_coordinator.py', 'vllm/v1/core/kv_cache_coordinator.py', 'kv-coordinator'),
    f('block_pool.py', 'vllm/v1/core/block_pool.py', 'block-pool'),
  ]),
  d('v1/spec_decode', [
    f('eagle.py', 'vllm/v1/spec_decode/eagle.py', 'spec-eagle-proposer'),
    f('draft_model.py', 'vllm/v1/spec_decode/draft_model.py', 'spec-draft-model'),
  ]),
  d('v1/sample', [
    f('sampler.py', 'vllm/v1/sample/sampler.py'),
    f('rejection_sampler.py', 'vllm/v1/sample/rejection_sampler.py', 'spec-rejection-sampler'),
  ]),
  d('v1/worker', [
    f('gpu_worker.py', 'vllm/v1/worker/gpu_worker.py'),
  ]),
  d('v1', [
    f('request.py', 'vllm/v1/request.py'),
  ]),
  d('entrypoints/openai', [
    f('api_server.py', 'vllm/entrypoints/openai/api_server.py', 'api-server'),
  ]),
]);
