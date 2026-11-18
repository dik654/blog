import SceneShell from "./SceneShell";

/**
 * 본문 대응: 도입부 "8채널에 16개 module이면 채널당 두 개입니다".
 * 균등 배치 2×8 = 16. 한 채널을 비우고 총수 16을 지키려면 0 + 3 + 3 + 2×5 = 16(세 개짜리 채널 둘, 가정).
 */
const EVEN = [2, 2, 2, 2, 2, 2, 2, 2] as const;
const SKEWED = [2, 2, 2, 3, 2, 0, 3, 2] as const;
const ROWS = [0, 1, 2] as const;

const SCENES = [
  {
    label: "균등하게 놓은 16개",
    summary: "8채널 × 2개 = 16개",
    layout: EVEN,
    note: "(가정) 8채널에 module 16개를 고르게 놓으면 채널마다 두 개입니다. Processor는 요청 주소를 여덟 통로 모두에 나눠 보냅니다.",
  },
  {
    label: "한 채널을 비운 16개",
    summary: "0 + 3 + 3 + 2×5 = 16개",
    layout: SKEWED,
    note: "총수는 16개 그대로지만 module이 꽂힌 채널은 일곱입니다. 빈 채널의 두 개를 다른 두 채널에 하나씩 더해 세 개짜리 채널이 둘인 경우를 그렸습니다(가정). 이렇게 비대칭이면 일부 통로만 붐비고 지원 속도가 내려갈 수 있습니다.",
  },
] as const;

const MODULE = "#2563eb";
const HEAVY = "#d97706";

export default function ChannelPopulationViz() {
  return (
    <SceneShell
      eyebrow="채널 배치"
      title="같은 16개라도 어느 채널에 꽂느냐가 다릅니다"
      description="세로 한 줄이 채널 하나, 칸 하나가 module 하나입니다. 채널은 processor의 memory controller가 DRAM에 접근하는 독립 통로입니다."
      note="배치 숫자는 본문의 가정 사례입니다. 실제 slot 순서와 채널당 허용 module 수는 CPU·board 문서가 정합니다."
      ariaLabel="8채널에 module 16개를 균등하게 놓은 배치와 한 채널을 비운 배치 비교"
      scenes={SCENES}
      render={(active) => {
        const layout: readonly number[] = SCENES[active].layout;
        const populated = layout.filter((count) => count > 0).length;
        const total = layout.reduce<number>((sum, count) => sum + count, 0);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
              {layout.map((count, channel) => (
                <div key={channel} className="flex min-w-0 flex-col items-stretch gap-1">
                  <div
                    className={`flex h-[7.25rem] flex-col-reverse gap-1 rounded-md border p-1 ${
                      count === 0 ? "border-dashed border-red-600/70" : "border-border"
                    }`}
                  >
                    {ROWS.map((row) => (
                      <div
                        key={row}
                        className="h-8 rounded-sm border"
                        style={
                          row < count
                            ? { borderColor: count > 2 ? HEAVY : MODULE, backgroundColor: `${count > 2 ? HEAVY : MODULE}26` }
                            : { borderColor: "transparent" }
                        }
                      />
                    ))}
                  </div>
                  <span className="text-center font-mono text-[10px] text-muted-foreground sm:text-xs">CH{channel}</span>
                  <span
                    className={`text-center font-mono text-xs font-bold ${
                      count === 0 ? "text-red-700 dark:text-red-400" : count > 2 ? "text-amber-700 dark:text-amber-400" : ""
                    }`}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <p className="rounded-md border border-border px-3 py-2">
                <span className="block text-xs text-muted-foreground">module 총수</span>
                <span className="font-mono font-bold">{total}개</span>
              </p>
              <p className="rounded-md border border-border px-3 py-2">
                <span className="block text-xs text-muted-foreground">module이 꽂힌 채널</span>
                <span className={`font-mono font-bold ${populated < 8 ? "text-red-700 dark:text-red-400" : ""}`}>{populated} / 8</span>
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
