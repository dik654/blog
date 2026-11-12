import SceneShell from "./SceneShell";

/**
 * 본문 대응: #scale-out — 매개변수 1,000개 사례를 자료 병렬 GPU 네 장에 균등하게 나눈 이상적인 모델 상태 장부.
 * 가중치 2,000B · 기울기 2,000B · Adam 상태(FP32 원본·m·v) 12,000B.
 * 분할 없음 16,000 / 1단계 7,000 / 2단계 5,500 / 3단계 4,000 (GPU당).
 */
const GPUS = 4;
const PARTS = [
  { key: "weight", name: "계산용 가중치", bytes: 2_000, color: "#64748b" },
  { key: "gradient", name: "기울기", bytes: 2_000, color: "#d97706" },
  { key: "adam", name: "Adam 상태(원본·m·v)", bytes: 12_000, color: "#2563eb" },
] as const;
type PartKey = (typeof PARTS)[number]["key"];

const SCENES = [
  {
    label: "분할 없음",
    summary: "GPU당 16,000B",
    split: [] as readonly PartKey[],
    note: "같은 학습기를 네 장에 복제하면 GPU마다 16,000B 장부를 그대로 가질 수 있습니다. 그러면 네 장에 같은 장부가 네 벌 있습니다.",
  },
  {
    label: "ZeRO 1단계",
    summary: "2,000 + 2,000 + 12,000÷4 = 7,000B",
    split: ["adam"] as readonly PartKey[],
    note: "Adam 상태 12,000B(FP32 원본·m·v 세 장부)만 네 곳에 나눕니다. GPU마다 3,000B씩 맡고, 가중치와 기울기는 여전히 전부 가집니다.",
  },
  {
    label: "ZeRO 2단계",
    summary: "2,000 + 2,000÷4 + 12,000÷4 = 5,500B",
    split: ["gradient", "adam"] as readonly PartKey[],
    note: "기울기도 나눕니다. 기울기 몫이 2,000B에서 500B로 줄어 GPU당 5,500B가 됩니다.",
  },
  {
    label: "ZeRO 3단계",
    summary: "16,000 ÷ 4 = 4,000B",
    split: ["weight", "gradient", "adam"] as readonly PartKey[],
    note: "가중치까지 모든 모델 상태를 나눕니다. GPU당 4,000B이고 네 장을 합치면 장부가 한 벌인 16,000B로 돌아옵니다.",
  },
] as const;

const W = 360;
const COL_W = 54;
const COL_GAP = (W - 2 * 22 - GPUS * COL_W) / (GPUS - 1);
const BASE_Y = 196;
const TOP_Y = 36;
const SCALE = (BASE_Y - TOP_Y) / 16_000;
const MUTED = "#94a3b8";
const INK = "#64748b";

export default function ZeroShardingViz() {
  return (
    <SceneShell
      eyebrow="GPU 네 장의 모델 상태"
      title="단계가 올라갈 때마다 Adam 상태, 기울기, 가중치 순으로 나눠 갖습니다"
      description="자료 병렬은 같은 모델을 GPU마다 복제해 서로 다른 자료를 처리하는 방식이고, ZeRO는 그렇게 반복 저장된 모델 상태를 단계별로 나눠 갖게 합니다. 기둥 하나가 GPU 한 장이며, 회색 점선 테두리는 분할 전 16,000B 높이입니다."
      note="1,000개 사례를 네 장에 균등하게 나눈 이상적인 장부입니다. 활성값, 통신 버퍼와 순간적인 모으기 공간은 넣지 않았습니다."
      ariaLabel="ZeRO 단계별로 GPU 네 장이 각각 들고 있는 모델 상태"
      scenes={SCENES}
      render={(active) => {
        const split = new Set<PartKey>(SCENES[active].split);
        const segments = PARTS.map((part) => ({
          ...part,
          shown: split.has(part.key) ? part.bytes / GPUS : part.bytes,
          isSplit: split.has(part.key),
        }));
        const tops = segments.reduce<number[]>((acc, seg) => [...acc, (acc[acc.length - 1] ?? 0) + seg.shown], []);
        const perGpu = tops[tops.length - 1];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 232`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${SCENES[active].label}: GPU당 ${perGpu.toLocaleString("en-US")}B`}>
              {Array.from({ length: GPUS }, (_, gpu) => {
                const x = 22 + gpu * (COL_W + COL_GAP);
                return (
                  <g key={gpu}>
                    <rect x={x} y={TOP_Y} width={COL_W} height={BASE_Y - TOP_Y} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="2 3" />
                    {segments.map((seg, i) => {
                      const top = tops[i];
                      const h = seg.shown * SCALE;
                      const y = BASE_Y - top * SCALE;
                      return (
                        <g key={seg.key}>
                          <rect
                            x={x}
                            y={y}
                            width={COL_W}
                            height={h}
                            fill={seg.color}
                            stroke={seg.isSplit ? "#ffffff" : seg.color}
                            strokeWidth={1}
                            strokeDasharray={seg.isSplit ? "3 2" : undefined}
                          />
                          {h >= 14 && (
                            <text x={x + COL_W / 2} y={y + h / 2 + 3.5} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#ffffff">
                              {seg.shown.toLocaleString("en-US")}
                            </text>
                          )}
                        </g>
                      );
                    })}
                    <text x={x + COL_W / 2} y={BASE_Y - perGpu * SCALE - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK}>
                      {perGpu.toLocaleString("en-US")}B
                    </text>
                    <text x={x + COL_W / 2} y={BASE_Y + 16} textAnchor="middle" fontSize={11.5} fill={INK}>
                      GPU {gpu + 1}
                    </text>
                  </g>
                );
              })}
              <line x1={14} x2={W - 14} y1={BASE_Y} y2={BASE_Y} stroke={MUTED} strokeWidth={1} />
            </svg>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {PARTS.map((part) => (
                <span key={part.key}>
                  <span className="font-semibold" style={{ color: part.color }}>■</span> {part.name} {part.bytes.toLocaleString("en-US")}B
                </span>
              ))}
              <span>흰 점선 테두리: 네 GPU가 1/4씩 나눠 맡은 몫</span>
            </div>
          </div>
        );
      }}
    />
  );
}
