import { CitationBlock } from '../../../../components/ui/citation';

export default function ContinuousBatching() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Continuous Batching</h3>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Static Batching */}
        <div className="rounded-lg border border-border bg-card px-3 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#f43f5e' }} />
            <span className="font-semibold text-sm">Static Batching</span>
          </div>
          <svg viewBox="0 0 220 90" className="w-full mb-2">
            {/* Req1 — 짧은 요청 */}
            <rect x="10" y="8" width="80" height="16" rx="3" fill="#fecdd3" stroke="#f43f5e" strokeWidth="1" />
            <text x="50" y="19" textAnchor="middle" fontSize="8" fill="#9f1239">Req1</text>
            {/* Req1 idle */}
            <rect x="90" y="8" width="100" height="16" rx="3" fill="#fef2f2" stroke="#fecdd3" strokeWidth="1" strokeDasharray="3,2" />
            <text x="140" y="19" textAnchor="middle" fontSize="7" fill="#d1d5db">idle</text>

            {/* Req2 — 긴 요청 */}
            <rect x="10" y="32" width="180" height="16" rx="3" fill="#fecdd3" stroke="#f43f5e" strokeWidth="1" />
            <text x="100" y="43" textAnchor="middle" fontSize="8" fill="#9f1239">Req2 (long)</text>

            {/* Req3 — 중간 요청 */}
            <rect x="10" y="56" width="120" height="16" rx="3" fill="#fecdd3" stroke="#f43f5e" strokeWidth="1" />
            <text x="70" y="67" textAnchor="middle" fontSize="8" fill="#9f1239">Req3</text>
            {/* Req3 idle */}
            <rect x="130" y="56" width="60" height="16" rx="3" fill="#fef2f2" stroke="#fecdd3" strokeWidth="1" strokeDasharray="3,2" />
            <text x="160" y="67" textAnchor="middle" fontSize="7" fill="#d1d5db">idle</text>

            <text x="110" y="86" textAnchor="middle" fontSize="7" fill="#9ca3af">모든 요청 완료까지 배치 유지 → GPU 유휴</text>
          </svg>
          <p className="text-xs text-muted-foreground leading-relaxed">
            배치 내 모든 요청이 완료될 때까지 대기. 짧은 요청이 먼저 끝나도 GPU를 점유
          </p>
        </div>

        {/* Continuous Batching */}
        <div className="rounded-lg border border-border bg-card px-3 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#10b981' }} />
            <span className="font-semibold text-sm">Continuous Batching</span>
          </div>
          <svg viewBox="0 0 220 90" className="w-full mb-2">
            {/* Req1 → Req4 교체 */}
            <rect x="10" y="8" width="80" height="16" rx="3" fill="#d1fae5" stroke="#10b981" strokeWidth="1" />
            <text x="50" y="19" textAnchor="middle" fontSize="8" fill="#065f46">Req1</text>
            <rect x="95" y="8" width="95" height="16" rx="3" fill="#a7f3d0" stroke="#10b981" strokeWidth="1" />
            <text x="142" y="19" textAnchor="middle" fontSize="8" fill="#065f46">Req4</text>

            {/* Req2 — 긴 요청 */}
            <rect x="10" y="32" width="180" height="16" rx="3" fill="#d1fae5" stroke="#10b981" strokeWidth="1" />
            <text x="100" y="43" textAnchor="middle" fontSize="8" fill="#065f46">Req2 (long)</text>

            {/* Req3 → Req5 교체 */}
            <rect x="10" y="56" width="120" height="16" rx="3" fill="#d1fae5" stroke="#10b981" strokeWidth="1" />
            <text x="70" y="67" textAnchor="middle" fontSize="8" fill="#065f46">Req3</text>
            <rect x="135" y="56" width="55" height="16" rx="3" fill="#a7f3d0" stroke="#10b981" strokeWidth="1" />
            <text x="162" y="67" textAnchor="middle" fontSize="8" fill="#065f46">Req5</text>

            <text x="110" y="86" textAnchor="middle" fontSize="7" fill="#9ca3af">완료 즉시 새 요청 투입 → GPU 활용률 극대화</text>
          </svg>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Iteration 단위로 요청을 동적으로 추가/제거. 완료 즉시 새 요청 투입
          </p>
        </div>
      </div>

      <CitationBlock source="Yu et al., OSDI 2022 — Orca" citeKey={6} type="paper">
        <p className="italic">
          "Orca proposes iteration-level scheduling, where the serving system makes scheduling
          decisions at each generation iteration instead of at the request level. This enables
          continuous batching — requests can join and leave a running batch at any iteration."
        </p>
        <p className="mt-2 text-xs">
          Continuous Batching의 원천 — Orca 논문(OSDI 2022). vLLM은 이 개념을
          PagedAttention과 결합하여 메모리 효율 + 배칭 효율 동시 달성.
          V1의 Chunked Prefill은 더 나아가 Prefill과 Decode를 인터리빙
        </p>
      </CitationBlock>
    </>
  );
}
