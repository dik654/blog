import SceneShell from "./SceneShell";

/**
 * 본문 대응: #data-movement — 같은 8 KiB tile을 두 층의 상한으로 나눈 시간.
 * 128×32×2 B = 8,192 B. 3,350 GB/s ÷ 132 ≈ 25.4 GB/s → 약 0.32 µs.
 * 128 B × 1.7 GHz = 217.6 GB/s → 약 37.6 ns. 둘 다 측정값이 아니라 상한 계산.
 */
const BYTES = 128 * 32 * 2;
const GLOBAL_NS = BYTES / (3350 / 132);
const SHARED_NS = BYTES / (128 * 1.7);
const AXIS_NS = 340;

const SCENES = [
  { label: "tile의 크기", summary: "128 × 32 × 2 B = 8 KiB", note: "값이 128 × 32 = 4,096개이고 fp16 하나가 2 B이므로 8,192 B, 곧 8 KiB입니다. 아래 두 층은 모두 이 8 KiB를 옮기는 시간을 계산합니다." },
  { label: "Global 층", summary: "3.35 TB/s ÷ 132 → 약 0.32 µs", note: "Chip 전체 상한을 SM 132개에 똑같이 나눈 단순 장부에서 SM 하나의 몫은 약 25.4 GB/s입니다. 실제로 SM별로 고정 배분된다는 뜻은 아닙니다." },
  { label: "Shared memory 층", summary: "128 B × 1.7 GHz → 약 37.6 ns", note: "Bank conflict가 없는 이상 조건에서 SM 하나에 clock마다 128 B를 계속 공급한다고 놓으면 초당 217.6 GB이고, 같은 8 KiB가 약 37.6 ns입니다." },
  { label: "어느 층부터 의심할까", summary: "약 0.323 µs ÷ 약 37.6 ns ≈ 8.6배", note: "두 막대의 차이가 global 층을 먼저 의심하는 까닭입니다. 어느 kernel의 측정값도 아닌 상한 계산이고, register는 instruction의 operand가 놓이는 곳이라 같은 방식으로 나누지 않습니다." },
] as const;

function Row({ label, detail, ns, value }: { label: string; detail: string; ns: number | null; value: string }) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs sm:text-sm">
        <span className="font-semibold">{label}</span>
        <span className="font-mono font-bold">{value}</span>
      </div>
      <div className="mt-1 h-4 rounded-sm bg-muted/40">
        {ns !== null && <div className="h-full rounded-sm" style={{ width: `${(ns / AXIS_NS) * 100}%`, backgroundColor: "#2563eb" }} />}
      </div>
      <p className="mt-1 font-mono text-[11px] leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}

export default function TierTimeViz() {
  return (
    <SceneShell
      eyebrow="같은 tile, 다른 층"
      title="같은 8 KiB도 층마다 상한 시간이 다릅니다"
      description="Tile은 한 번에 다루는 행렬 조각이고 fp16은 값 하나가 2 B인 형식입니다. SM은 GPU 안의 연산 단위로 이 예에는 132개가 있습니다. 막대 길이는 같은 축의 시간입니다."
      ariaLabel="8 KiB tile을 global 층과 shared memory 층의 상한으로 옮기는 시간 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox="0 0 340 62" className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label="128 곱하기 32 tile 하나">
            <text x={170} y={11} textAnchor="middle" fontSize={11} fill="#64748b">128</text>
            <text x={18} y={38} textAnchor="middle" fontSize={11} fill="#64748b">32</text>
            <rect x={30} y={16} width={280} height={44} rx={3} fill={active === 0 ? "#2563eb" : "#94a3b8"} fillOpacity={0.25} stroke={active === 0 ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
            <text x={170} y={42} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">tile 하나 · 8 KiB</text>
          </svg>
          <div className="mt-4 space-y-3">
            <Row label="Global → shared" detail={active >= 1 ? "8,192 B ÷ 약 25.4 GB/s" : "아직 계산 전"} ns={active >= 1 ? GLOBAL_NS : null} value={active >= 1 ? "약 0.32 µs" : "−"} />
            <Row label="Shared → register" detail={active >= 2 ? "8,192 B ÷ 217.6 GB/s" : "아직 계산 전"} ns={active >= 2 ? SHARED_NS : null} value={active >= 2 ? "약 37.6 ns" : "−"} />
          </div>
        </div>
      )}
    />
  );
}
