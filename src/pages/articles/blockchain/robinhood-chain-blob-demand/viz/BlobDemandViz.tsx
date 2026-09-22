const AXIS_MAX = 20;
const scale = (value: number) => Math.min(1, value / AXIS_MAX) * 560;

const bars = [
  { label: "3일 평균", value: 6.4, tone: "fill-sky-500/15 stroke-sky-600", note: "누적 사용량 지표 — 지속 여부를 판단하는 기준선" },
  { label: "타겟", value: 15, tone: "fill-transparent stroke-foreground/70", note: "이 위로 쌓이면 excess가 늘고, 아래면 줄어드는 기준값" },
  { label: "간헐적 피크 블록", value: 17, tone: "fill-amber-500/15 stroke-amber-600", note: "가끔 관측된 개별 블록 — 지속 평균이 아님" },
];

export function BlobDemandGapViz() {
  return (
    <figure className="space-y-3" aria-labelledby="blob-demand-gap-caption">
      <div className="overflow-x-auto rounded-xl border bg-muted/20 p-4">
        <svg viewBox="0 0 640 190" className="min-w-[600px]" role="img" aria-label="3일 평균, 타겟, 간헐적 피크 블록의 블롭 개수를 나란히 비교">
          <line x1="60" y1="20" x2="60" y2="160" className="stroke-foreground/30" />
          <line x1="60" y1="160" x2="620" y2="160" className="stroke-foreground/30" />
          {bars.map((bar, index) => {
            const y = 40 + index * 44;
            const width = scale(bar.value);
            return (
              <g key={bar.label}>
                <text x="55" y={y + 14} textAnchor="end" className="fill-foreground text-[12px] font-semibold">{bar.label}</text>
                <rect x="60" y={y} width={width} height="24" rx="4" className={bar.tone} />
                <text x={60 + width + 8} y={y + 16} className="fill-foreground text-[12px] font-mono">{bar.value}</text>
              </g>
            );
          })}
          <line x1={60 + scale(15)} y1="20" x2={60 + scale(15)} y2="160" className="stroke-foreground/50" strokeDasharray="4 4" />
          <text x="620" y="176" textAnchor="end" className="fill-muted-foreground text-[11px]">단위: 블록당 블롭 개수</text>
        </svg>
      </div>
      <figcaption id="blob-demand-gap-caption" className="text-sm text-muted-foreground">
        평균은 타겟에 못 미치고, 개별 블록만 가끔 타겟을 넘습니다. 셋을 하나의 숫자로 합치면 지속 수요와 순간 피크가 뒤섞입니다.
      </figcaption>
    </figure>
  );
}

const flow = [
  { x: 10, label: "수요 압력", sub: "지속적 target 초과 관측", tone: "fill-amber-500/10 stroke-amber-600" },
  { x: 195, label: "BPO 포크", sub: "target·max 파라미터만 조정", tone: "fill-sky-500/10 stroke-sky-600" },
  { x: 380, label: "블롭풀 부담", sub: "대기 중인 blob 전체를 보관", tone: "fill-rose-500/10 stroke-rose-600" },
  { x: 565, label: "sparse 최적화", sub: "중복 저장을 줄여 여유 확보", tone: "fill-emerald-500/10 stroke-emerald-600" },
];

export function BlobpoolPipelineViz() {
  return (
    <figure className="space-y-3" aria-labelledby="blobpool-pipeline-caption">
      <div className="overflow-x-auto rounded-xl border bg-muted/20 p-4">
        <svg viewBox="0 0 760 190" className="min-w-[680px]" role="img" aria-label="수요 압력이 BPO 포크와 블롭풀 부담을 거쳐 sparse blobpool 최적화로 이어지는 흐름">
          <defs>
            <marker id="bp-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0L8 4L0 8Z" className="fill-foreground/60" />
            </marker>
          </defs>
          {flow.map((box, index) => (
            <g key={box.label}>
              <rect x={box.x} y="48" width="150" height="78" rx="10" className={box.tone} />
              <text x={box.x + 75} y="78" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">{box.label}</text>
              <text x={box.x + 75} y="103" textAnchor="middle" className="fill-muted-foreground text-[11px]">{box.sub}</text>
              {index < flow.length - 1 && <path d={`M ${box.x + 154} 87 H ${box.x + 184}`} className="stroke-foreground/60" fill="none" markerEnd="url(#bp-arrow)" />}
            </g>
          ))}
          <text x="380" y="160" textAnchor="middle" className="fill-muted-foreground text-[12px]">target을 올리는 결정과 그 target을 감당할 자원을 줄이는 작업은 같은 포크가 아니다.</text>
        </svg>
      </div>
      <figcaption id="blobpool-pipeline-caption" className="text-sm text-muted-foreground">
        BPO가 파라미터를 바꿔도, 노드가 늘어난 대기열을 값싸게 들고 있을 방법이 먼저 있어야 그 숫자가 지속 가능합니다.
      </figcaption>
    </figure>
  );
}
