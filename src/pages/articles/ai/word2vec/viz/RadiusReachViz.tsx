import SceneShell from "./SceneShell";

/**
 * 본문 대응: #window — 뽑은 반경 r이 거리 δ에 닿는 경우를 격자로 센다. P(r ≥ δ) = (c − δ + 1) / c.
 * c=2: 1, 1/2. c=5: 1, 4/5, 3/5, 2/5, 1/5.
 */
const AXIS = [1, 2, 3, 4, 5] as const;

const SCENES = [
  { label: "최대 반경 2", summary: "거리 1: 1 · 거리 2: 1/2", c: 2, focus: 0, note: "cat 바로 옆 saw(거리 1)는 어느 반경에서도 들어오고, 두 칸 떨어진 red와 dog(거리 2)는 반경 2를 뽑을 때만 들어옵니다." },
  { label: "최대 반경 5", summary: "1 · 4/5 · 3/5 · 2/5 · 1/5", c: 5, focus: 0, note: "거리가 한 칸 멀어질 때마다 닿는 반경이 하나씩 줄어 포함 확률이 1/5씩 내려갑니다." },
  { label: "거리 3만 세어 봅니다", summary: "(5 − 3 + 1) ÷ 5 = 3/5", c: 5, focus: 3, note: "거리 3에 닿는 반경은 3, 4, 5의 세 개이고 전체는 다섯 개입니다. 분자 c − δ + 1이 이 칠한 칸의 수입니다." },
] as const;

const GRID = { gridTemplateColumns: "3.25rem repeat(5, minmax(0, 1fr))" };

function fraction(c: number, distance: number) {
  if (distance > c) return "";
  return distance === 1 ? "1" : `${c - distance + 1}/${c}`;
}

export default function RadiusReachViz() {
  return (
    <SceneShell
      eyebrow="반경과 거리"
      title="뽑은 반경이 닿는 칸을 세면 포함 확률이 나옵니다"
      description="행은 이번에 뽑을 반경 r, 열은 이웃까지의 거리 δ입니다. ● 칸은 그 반경이 그 거리에 닿는다는 뜻입니다."
      note="1부터 최대 반경까지 같은 확률로 뽑는 모형입니다. 모든 구현의 난수열이 그렇다는 주장은 아니며 문장 밖의 가상 이웃에는 적용하지 않습니다."
      ariaLabel="반경과 거리 격자로 본 이웃 포함 확률"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="mx-auto min-w-0 max-w-[480px] space-y-1 font-mono text-xs">
            <div className="grid items-center gap-1 text-center text-muted-foreground" style={GRID}>
              <span />
              {AXIS.map((distance) => (
                <span key={distance}>거리 {distance}</span>
              ))}
            </div>
            {AXIS.map((radius) => (
              <div key={radius} className="grid items-center gap-1" style={GRID}>
                <span className={radius > scene.c ? "text-muted-foreground/40" : "font-semibold"}>r = {radius}</span>
                {AXIS.map((distance) => {
                  const valid = radius <= scene.c && distance <= scene.c;
                  const reach = valid && radius >= distance;
                  const dim = scene.focus !== 0 && distance !== scene.focus;
                  return (
                    <div
                      key={distance}
                      className="flex h-6 items-center justify-center rounded-sm border text-white sm:h-8"
                      style={{ borderColor: valid ? "#94a3b8" : "transparent", backgroundColor: reach ? (dim ? "#93c5fd" : "#2563eb") : "transparent" }}
                    >
                      {reach ? "●" : ""}
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="grid items-center gap-1 border-t border-border pt-2 text-center font-bold" style={GRID}>
              <span className="text-left">포함</span>
              {AXIS.map((distance) => (
                <span key={distance}>{fraction(scene.c, distance)}</span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
