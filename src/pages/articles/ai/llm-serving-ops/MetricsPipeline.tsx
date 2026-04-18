export default function MetricsPipeline() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Prometheus 메트릭 파이프라인</h3>

      {/* Metrics Collection */}
      <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4 mb-3">
        <div className="text-xs font-semibold text-sky-400 mb-2">ServiceMonitor — 메트릭 수집</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/70">대상</span>
            <span className="font-mono text-xs">app: vllm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/70">엔드포인트</span>
            <span className="font-mono text-xs">/metrics</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/70">수집 주기</span>
            <span className="font-mono text-xs">15s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/70">포트</span>
            <span className="font-mono text-xs">http</span>
          </div>
        </div>
        <p className="text-xs text-foreground/60 mt-2">app: vllm 라벨로 Pod 자동 탐지, 15초 간격 스크래핑</p>
      </div>

      {/* Key PromQL Queries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4">
          <div className="text-xs font-semibold text-rose-400 mb-2">TTFT P95</div>
          <p className="font-mono text-[11px] text-foreground/70 leading-relaxed">
            histogram_quantile(0.95,<br />
            &nbsp;&nbsp;rate(vllm_time_to_first<br />
            &nbsp;&nbsp;_token_seconds_bucket[5m]))
          </p>
          <p className="text-xs text-foreground/60 mt-2">사용자 체감 레이턴시의 핵심 지표 — 500ms 초과 시 알럿</p>
        </div>

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="text-xs font-semibold text-amber-400 mb-2">GPU 캐시 사용률</div>
          <p className="font-mono text-[11px] text-foreground/70 leading-relaxed">
            avg(vllm_gpu_cache<br />
            &nbsp;&nbsp;_usage_perc)<br />
            &nbsp;&nbsp;by (pod) {'>'} 0.9
          </p>
          <p className="text-xs text-foreground/60 mt-2">KV 캐시 포화 → OOM 직전 경고</p>
        </div>

        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="text-xs font-semibold text-emerald-400 mb-2">클러스터 TPS</div>
          <p className="font-mono text-[11px] text-foreground/70 leading-relaxed">
            sum(rate(vllm_generation<br />
            &nbsp;&nbsp;_tokens_total[1m]))
          </p>
          <p className="text-xs text-foreground/60 mt-2">클러스터 전체 처리량 — 용량 계획의 기준</p>
        </div>
      </div>
    </>
  );
}
