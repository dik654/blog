import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 첫 공연에서 지루함을 적고, 두 번째에는 리듬만 따라가고, 세 번째에는 다른 연주와 비교 →
 * 전에는 하나의 반복으로 들었던 구간에서 속도와 강약의 차이를 찾을 수 있음 →
 * 새 차이를 들었다고 반드시 좋아하게 되지는 않고, 변형이 충분하지 않다는 더 구체적인 비판이 생길 수도 있음.
 * 구간을 몇 칸으로 나누고 어느 칸에 어떤 차이를 두는지는 그림을 위한 가정입니다.
 */
const PASSES = ["1회", "2회", "3회"] as const;
const PARTS = ["속도", "강약", "속도", "강약"] as const;

const SCENES = [
  {
    label: "첫 번째: 느낀 것을 적습니다",
    summary: "기록: 지루함",
    pass: 0,
    focus: "첫 반응 — 지루함을 적어 둠",
    split: false,
    compare: false,
    note: "첫 공연에서 느낀 지루함을 적어 둡니다. 이때 문제의 구간은 하나의 반복으로 들립니다.",
  },
  {
    label: "두 번째: 리듬만 따라갑니다",
    summary: "주의: 리듬 하나",
    pass: 1,
    focus: "리듬만 따라감",
    split: false,
    compare: false,
    note: "두 번째에는 다른 요소를 내려놓고 리듬만 따라가며 같은 구간을 듣습니다.",
  },
  {
    label: "세 번째: 다른 연주와 비교합니다",
    summary: "주의: 비교",
    pass: 2,
    focus: "같은 곡의 다른 연주와 나란히 듣기",
    split: false,
    compare: true,
    note: "세 번째에는 같은 구간을 다른 연주와 비교합니다. 비교할 기준이 생기면 어디가 다른지 물을 수 있습니다.",
  },
  {
    label: "한 덩어리가 차이로 나뉩니다",
    summary: "속도·강약의 차이를 찾을 수 있음",
    pass: 2,
    focus: "세 번의 주의와 비교가 쌓인 뒤",
    split: true,
    compare: true,
    note: "감상자는 전에는 하나의 반복으로 들었던 구간에서 속도와 강약의 차이를 찾을 수 있습니다. 칸을 넷으로 나누고 차이를 번갈아 둔 것은 그림을 위한 가정입니다.",
  },
  {
    label: "찾은 차이가 정할 결론은 하나가 아닙니다",
    summary: "좋아짐 · 더 구체적인 비판",
    pass: 2,
    focus: "새로 들은 차이를 평가하기",
    split: true,
    compare: false,
    note: "새 차이를 들었다고 반드시 좋아하게 되지는 않습니다. 변형이 충분하지 않다는 더 구체적인 비판이 생길 수도 있습니다. 훈련은 정답 취향을 주입하지 않고, 관찰할 특징과 비교할 이유를 늘려 자기 판단을 고칠 가능성을 엽니다.",
  },
] as const;

export default function ListeningPassesViz() {
  return (
    <SceneShell
      eyebrow="7절 반복 감상"
      title="세 번의 감상이 한 덩어리 반복을 나눕니다"
      description="위 칸은 몇 번째 감상인지, 가운데 띠는 문제의 반복 구간이 감상자에게 어떻게 들리는지입니다. 구간 안을 나눈 개수와 배치는 그림을 위한 가정입니다."
      ariaLabel="첫 감상에서 지루함을 적고 두 번째에 리듬만 따라가고 세 번째에 다른 연주와 비교한 뒤, 하나로 들리던 반복 구간에서 속도와 강약의 차이를 찾고, 결론이 호감 또는 더 구체적인 비판으로 갈리는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
              {PASSES.map((pass, index) => (
                <span
                  key={pass}
                  className={`rounded-md border px-2 py-1 ${index === scene.pass ? "border-[#2563eb] font-bold text-blue-700 dark:text-blue-400" : index < scene.pass ? "border-border text-muted-foreground" : "border-dashed border-border/60 text-muted-foreground/50"}`}
                >
                  감상 {pass}
                </span>
              ))}
            </div>
            <div className="rounded-md border border-border px-3 py-1.5 text-sm">
              <span className="mr-2 text-xs text-muted-foreground">주의</span>
              {scene.focus}
            </div>
            <div className="space-y-1">
              <span className="block text-xs text-muted-foreground">문제의 반복 구간 — 이 연주</span>
              {scene.split ? (
                <div className="grid grid-cols-4 gap-1">
                  {PARTS.map((part, index) => (
                    <span key={`${part}-${index}`} className={`rounded-md border px-1 py-2 text-center text-xs font-semibold ${part === "속도" ? "border-[#d97706] text-amber-700 dark:text-amber-400" : "border-[#2563eb] text-blue-700 dark:text-blue-400"}`}>
                      {part} 차이
                    </span>
                  ))}
                </div>
              ) : (
                <span className="block rounded-md border border-[#94a3b8] px-2 py-2 text-center text-xs text-muted-foreground">하나의 반복으로 들림</span>
              )}
            </div>
            <div className="space-y-1">
              <span className={`block text-xs ${scene.compare ? "text-muted-foreground" : "text-transparent"}`}>같은 구간 — 다른 연주</span>
              <span className={`block rounded-md border px-2 py-2 text-center text-xs ${scene.compare ? "border-dashed border-[#64748b] text-muted-foreground" : "border-transparent text-transparent"}`}>비교 기준</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs leading-5 sm:text-sm">
              <span className={`rounded-md border px-2 py-1.5 ${active === 4 ? "border-[#16a34a] font-semibold" : "border-dashed border-border/40 text-muted-foreground/40"}`}>갈래 1 · 좋아하게 될 수 있음</span>
              <span className={`rounded-md border px-2 py-1.5 ${active === 4 ? "border-[#dc2626] font-semibold" : "border-dashed border-border/40 text-muted-foreground/40"}`}>갈래 2 · “변형이 충분하지 않다”</span>
            </div>
          </div>
        );
      }}
    />
  );
}
