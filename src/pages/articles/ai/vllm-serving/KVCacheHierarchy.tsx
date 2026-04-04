import CodePanel from '@/components/ui/code-panel';

export default function KVCacheHierarchy() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">KV 캐시 계층 구조 (V1)</h3>
      <CodePanel title="Hierarchical KV Cache (V1)" code={`Hierarchical KV Cache (V1):

GPU HBM (Hot)
  ↕ 자동 스왑
CPU DRAM (Warm)
  ↕ KV Connector
외부 저장소 (Cold) — Redis, LMCache 등

KV Cache Manager (V1):
  - 블록 할당/해제 + Prefix Caching 통합
  - GPU 메모리 부족 시 CPU로 자동 스왑
  - KV Connector로 외부 캐시 시스템 연동
  → 세션 간 KV 캐시 공유, 장기 캐싱 가능

KV Cache 양자화:
  FP16 → FP8 KV 캐시 (NVIDIA Hopper+)
  → KV 캐시 메모리 50% 절약
  → 품질 손실 최소 (perplexity ~0.01 증가)
  → --kv-cache-dtype fp8 으로 활성화`} annotations={[
        { lines: [3, 7], color: 'sky', note: '3계층 캐시 구조: Hot → Warm → Cold' },
        { lines: [15, 19], color: 'emerald', note: 'FP8 양자화로 메모리 50% 절약' },
      ]} />
    </>
  );
}
