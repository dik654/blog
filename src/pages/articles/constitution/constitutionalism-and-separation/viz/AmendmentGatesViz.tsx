import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #entrenchment — 정족수 상향과 별도 동의 추가는 다른 손잡이다.
 * 100석은 칸을 세기 위한 가정이다. 과반은 51석, 3분의 2는 66.67을 올려 67석.
 */
interface Scene extends ShellScene {
  seats: number;
  rule: string;
  secondGate: boolean;
  bypass: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "일반 법률", summary: "문 1개 · 51석 이상", seats: 51, rule: "과반", secondGate: false, bypass: false, note: "일반 법률은 한 의회의 과반으로 바꿀 수 있습니다. 100석이라는 크기는 칸을 세려고 정한 가정이며, 과반이면 51석입니다." },
  { label: "정족수 상향", summary: "문 1개 · 67석 이상", seats: 67, rule: "3분의 2", secondGate: false, bypass: false, note: "문은 그대로 하나이고 같은 의회 안의 승인 규칙만 더 엄격해집니다. 100석의 3분의 2는 66.67석이므로 67석이 필요합니다." },
  { label: "별도 동의 추가", summary: "문 2개 · 과반은 그대로", seats: 51, rule: "과반", secondGate: true, bypass: false, note: "의회 안의 문턱은 그대로인데 문이 늘어납니다. 별도 동의를 더 요구하면 거부 지점이 늘 수 있습니다. 앞 장면과 같은 변수로 취급하면 안 됩니다." },
  { label: "너무 어려워지면", summary: "개정 대신 옆길로", seats: 67, rule: "3분의 2", secondGate: true, bypass: true, note: "두 장치가 있다고 곧 막히지는 않고, 너무 어려워진 경우를 가정한 그림입니다. 그러면 고쳐야 할 것도 못 고치고, 압력이 해석 변경이나 조문 무시로 빠져나갑니다." },
];

const SEATS = Array.from({ length: 100 }, (_, index) => index);

export default function AmendmentGatesViz() {
  return (
    <SceneShell
      eyebrow="개정 문턱"
      title="문턱을 높이는 일과 문을 늘리는 일은 다른 손잡이입니다"
      description="왼쪽은 한 의회의 찬성 칸(100석 가정)이고, 오른쪽은 의회 밖의 별도 동의입니다. 색칠한 칸은 그 문을 지나는 데 필요한 최소 찬성입니다."
      ariaLabel="정족수 상향과 별도 동의 추가의 차이, 그리고 문턱이 너무 높을 때 압력이 빠져나가는 통로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-5">
              <div className="min-w-0 rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-bold">문 1 · 의회</p>
                <p className="mt-1 whitespace-nowrap text-xs tabular-nums text-muted-foreground">{scene.rule} = {scene.seats}석 이상</p>
                <div className="mt-3 grid grid-cols-10 gap-[2px]" role="img" aria-label={`100칸 중 ${scene.seats}칸이 필요한 찬성`}>
                  {SEATS.map((seat) => (
                    <span
                      key={seat}
                      className="aspect-square rounded-[2px] border transition-colors duration-300 motion-reduce:transition-none"
                      style={seat < scene.seats ? { backgroundColor: "#2563eb", borderColor: "#2563eb" } : { backgroundColor: "transparent", borderColor: "#94a3b8" }}
                    />
                  ))}
                </div>
              </div>

              <div className={`flex min-w-0 flex-col rounded-lg border p-3 ${scene.secondGate ? "border-[#d97706] bg-background" : "border-dashed border-border"}`}>
                <p className={`text-xs font-bold ${scene.secondGate ? "" : "text-muted-foreground"}`}>문 2 · 의회 밖</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {scene.secondGate ? "여러 기관·지역·국민투표 같은 별도 동의" : "없음"}
                </p>
                {scene.secondGate && (
                  <p className="mt-auto pt-2 text-xs font-semibold leading-5 text-amber-700 dark:text-amber-400">필요한 찬성 크기는 정하지 않아 칸으로 그리지 않았습니다</p>
                )}
              </div>
            </div>

            <div className="mt-3 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 text-xs">
              <span className={`min-w-0 font-semibold ${scene.bypass ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>
                {scene.bypass ? "너무 어려워 개정이 막히면 →" : "개정 경로로 바꿀 수 있는 상태"}
              </span>
              {["해석 변경", "조문 무시"].map((path) => (
                <span
                  key={path}
                  className={`rounded-md border px-2 py-1.5 font-semibold ${scene.bypass ? "border-red-600 text-red-700 dark:text-red-400" : "border-dashed border-border/50 text-muted-foreground/50"}`}
                >
                  {path}
                </span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
