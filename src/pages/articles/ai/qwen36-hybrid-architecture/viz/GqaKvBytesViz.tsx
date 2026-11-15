import SceneShell from "./SceneShell";

/**
 * 본문 대응: #attention-kv GQA TermBreakdown → #kv-bytes 식.
 * Query head 24 ÷ KV head 4 = 6. token 하나·layer 하나: (K 4×256 + V 4×256) = 2,048 원소 × 2 byte = 4,096 byte = 4 KiB.
 * 64층 중 Attention 16층만 이 4 KiB를 남김 → 16 × 4 KiB = 64 KiB. DeltaNet 48층은 K/V를 붙이지 않음.
 */
const Q_HEADS = 24;
const KV_HEADS = 4;
const GROUP = Q_HEADS / KV_HEADS;
const GROUP_COLORS = ["#2563eb", "#059669", "#d97706", "#7c3aed"] as const;

const SCENES = [
  {
    label: "Query head 24개",
    summary: "현재 token의 관점 24개",
    note: "현재 token은 24개 Query head로 과거를 바라봅니다. Query는 이번 step의 score 계산에만 쓰고 다음 step을 위해 저장하지 않습니다.",
  },
  {
    label: "여섯 개씩 공유",
    summary: "24 ÷ 4 = 6",
    note: "GQA(grouped-query attention)는 Query head 여섯 개가 KV head 하나를 함께 읽게 묶습니다. 그래서 과거 token마다 남기는 기록은 24개가 아니라 KV head 4개분입니다.",
  },
  {
    label: "한 layer · 한 token",
    summary: "(4×256)×2 원소 × 2 byte = 4 KiB",
    note: "Attention layer 하나는 token 하나마다 K 4×256개와 V 4×256개, 합 2,048개 원소를 남깁니다. BF16 2 byte를 곱하면 4,096 byte, 4 KiB입니다.",
  },
  {
    label: "64층 중 16층만",
    summary: "16 × 4 KiB = 64 KiB / token",
    note: "64층 가운데 K/V를 남기는 것은 Attention 16층뿐이라 token 하나에 64 KiB가 늘어납니다. DeltaNet 48층은 K/V 줄을 붙이지 않고 고정 state를 갱신합니다. 64층을 모두 넣으면 256 KiB로 네 배 과대계산됩니다.",
  },
] as const;

export default function GqaKvBytesViz() {
  return (
    <SceneShell
      eyebrow="KV per token"
      title="24개 관점이 4개 기록을 나눠 읽고, 16층만 기록을 남긴다"
      description="위 칸은 Query head, 가운데 칸은 KV head, 아래 띠는 64개 layer입니다. 같은 색은 같은 KV head를 공유하는 묶음입니다. BF16·batch 1·unsharded logical KV 기준입니다."
      ariaLabel="Query head 24개가 KV head 4개를 공유하고 attention 16층만 token당 KV를 남기는 계산"
      scenes={SCENES}
      render={(active) => {
        const grouped = active >= 1;
        const bytesShown = active >= 2;
        const layersShown = active === 3;
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground">Query head 24 · 저장 안 함</p>
              <div className="mt-1 grid grid-cols-12 gap-1">
                {Array.from({ length: Q_HEADS }, (_, i) => {
                  const color = grouped ? (GROUP_COLORS as readonly string[])[Math.floor(i / GROUP)] : "#64748b";
                  return (
                    <span
                      key={i}
                      className="flex h-6 items-center justify-center rounded-[3px] border font-mono text-[10px]"
                      style={{ borderColor: color, color, opacity: active === 0 || grouped ? 1 : 0.5 }}
                    >
                      Q{i + 1}
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted-foreground">KV head 4 · token마다 K와 V 각 256 원소 저장</p>
              <div className="mt-1 grid grid-cols-4 gap-2">
                {GROUP_COLORS.map((color, g) => (
                  <span
                    key={color}
                    className="flex h-9 flex-col items-center justify-center rounded border text-[11px] leading-4"
                    style={{ borderColor: grouped ? color : "#cbd5e1", color: grouped ? color : "#94a3b8", borderWidth: bytesShown ? 1.25 : 1 }}
                  >
                    <span className="font-bold">KV{g + 1}</span>
                    <span className="font-mono">{grouped ? `Q${g * GROUP + 1}–Q${g * GROUP + GROUP}` : "—"}</span>
                  </span>
                ))}
              </div>
              <p className="mt-1 min-h-[2.5rem] text-xs leading-5 sm:min-h-[1.25rem]">
                {bytesShown ? "한 layer: (4×256 K + 4×256 V) × 2 byte = 4,096 byte" : ""}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted-foreground">64 layer · 하늘색 DeltaNet 3칸 + 주황 Attention 1칸 × 16</p>
              <div className="mt-1 grid gap-[3px]" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
                {Array.from({ length: 64 }, (_, i) => {
                  const isAttn = i % 4 === 3;
                  const on = layersShown && isAttn;
                  return (
                    <span
                      key={i}
                      className="h-4 rounded-[2px] border"
                      style={{
                        borderColor: isAttn ? "#d97706" : "#7dd3fc",
                        backgroundColor: on ? "#fcd34d" : "transparent",
                        opacity: layersShown ? 1 : 0.45,
                      }}
                    />
                  );
                })}
              </div>
              <p className="mt-1 min-h-[2.5rem] text-xs leading-5 sm:min-h-[1.25rem]">
                {layersShown ? "채운 칸 16개 × 4 KiB = 64 KiB · 하늘색 48칸은 K/V 없음" : ""}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
