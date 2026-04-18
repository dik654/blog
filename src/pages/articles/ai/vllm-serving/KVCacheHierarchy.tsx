export default function KVCacheHierarchy() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">KV 캐시 계층 구조 (V1)</h3>

      <div className="not-prose grid grid-cols-1 gap-2 mb-4 text-sm">
        {[
          { label: 'GPU HBM (Hot)', color: '#0ea5e9', desc: '활성 요청의 KV 캐시 저장. Attention 연산에 직접 사용되는 고속 메모리' },
          { label: 'CPU DRAM (Warm)', color: '#f59e0b', desc: 'GPU 메모리 부족 시 자동 스왑 대상. 재활성화 시 GPU로 복귀' },
          { label: '외부 저장소 (Cold)', color: '#6b7280', desc: 'Redis, LMCache 등 — KV Connector로 연동. 세션 간 KV 캐시 공유, 장기 캐싱' },
        ].map((tier, i) => (
          <div key={tier.label} className="rounded-lg border border-border bg-card px-3 py-2 flex items-start gap-3">
            <div className="flex flex-col items-center shrink-0 mt-0.5">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
              {i < 2 && <span className="text-[10px] text-muted-foreground mt-1">↕</span>}
            </div>
            <div>
              <span className="font-mono font-bold text-foreground text-xs">{tier.label}</span>
              <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tier.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <h4 className="text-base font-semibold mt-5 mb-2">KV Cache Manager (V1)</h4>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 text-sm">
        {[
          { title: '블록 할당/해제', desc: 'Prefix Caching 통합 관리. 동일 프롬프트 후속 요청에서 블록 재사용' },
          { title: '자동 스왑', desc: 'GPU 메모리 부족 시 CPU로 자동 이동. 확보 후 복귀' },
          { title: 'KV Connector', desc: '외부 캐시 시스템(Redis 등) 연동으로 세션 간 공유' },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-border bg-card px-3 py-2">
            <span className="font-mono font-bold text-foreground text-xs">{item.title}</span>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>

      <h4 className="text-base font-semibold mt-5 mb-2">KV Cache 양자화</h4>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 text-sm">
        {[
          { title: 'FP16 → FP8', desc: 'NVIDIA Hopper+ GPU에서 KV 캐시를 FP8로 양자화' },
          { title: '메모리 50% 절약', desc: 'KV 캐시 크기 절반으로 축소. 더 많은 동시 요청 처리 가능' },
          { title: '품질 손실 최소', desc: 'perplexity ~0.01 증가. --kv-cache-dtype fp8 으로 활성화' },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-border bg-card px-3 py-2">
            <span className="font-mono font-bold text-foreground text-xs">{item.title}</span>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
}
