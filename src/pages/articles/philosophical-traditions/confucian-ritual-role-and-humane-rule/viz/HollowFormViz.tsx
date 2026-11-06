import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 반복한 절차가 기대와 다음 판단을 바꾸는 경로, 그리고 형식만 남는 두 경우.
 * 확인할 네 곳(형식·배분·말할 권리·이후 관계)은 장면이 바뀌어도 같은 자리에 둡니다.
 */
type Status = "seen" | "off" | "open";

const CHECKS = ["행동의 형식", "실제 배분", "말할 권리", "이후 관계"] as const;

const SCENES = [
  {
    label: "기대한 경로",
    summary: "반복 → 기대 → 다음 위기",
    note: "운영 담당자가 자기 10자루를 먼저 확정하지 않고 취약한 가구의 말을 먼저 듣는 절차를 반복한다고 하겠습니다(글의 예). 다른 사람은 양보를 역할에 따른 책임으로 기대하게 되고, 다음 위기에는 정보를 숨길 이유가 줄어듭니다.",
    cells: [["seen", "먼저 듣는 절차를 반복"], ["open", "아직 확인 전"], ["seen", "취약한 가구가 먼저 말함"], ["seen", "정보를 숨길 이유가 줄어듦(기대)"]],
  },
  {
    label: "뒤에서 다른 배분",
    summary: "공개 양보 · 뒤에서 친족에게",
    note: "공개적으로는 양보하고 뒤에서 친족에게 더 줄 수 있습니다. 회의장에서 본 모습만으로는 드러나지 않고 실제 배분을 봐야 드러납니다.",
    cells: [["seen", "공개적으로는 양보함"], ["off", "뒤에서 친족에게 더 줌"], ["open", "아직 확인 전"], ["open", "아직 확인 전"]],
  },
  {
    label: "한쪽만 침묵",
    summary: "낮은 지위에게만 침묵 요구",
    note: "낮은 지위의 사람에게만 침묵을 요구할 수도 있습니다. 이때 어긋나는 곳은 말할 권리입니다.",
    cells: [["open", "아직 확인 전"], ["open", "아직 확인 전"], ["off", "낮은 지위의 사람에게만 침묵 요구"], ["open", "아직 확인 전"]],
  },
  {
    label: "네 곳을 함께",
    summary: "하나만 보면 놓칩니다",
    note: "반복이 항상 좋은 성품을 만들지는 않습니다. 그래서 행동의 형식, 실제 배분, 말할 권리와 이후 관계를 함께 확인해야 합니다.",
    cells: [["open", "어떤 절차를 반복하는가"], ["open", "실제로 누가 얼마를 받았는가"], ["open", "누가 말할 수 있는가"], ["open", "그 뒤 관계는 어떠한가"]],
  },
] as const;

const CHAIN = ["자기 10자루보다 취약한 가구의 말을 먼저 듣기를 반복", "양보를 역할에 따른 책임으로 기대", "다음 위기에 정보를 숨길 이유 감소"] as const;

const CELL_STYLE: Record<Status, string> = {
  seen: "border-border bg-background",
  off: "border-red-600 bg-background",
  open: "border-dashed border-border/70",
};

export default function HollowFormViz() {
  return (
    <SceneShell
      eyebrow="반복의 두 갈래"
      title="같아 보이는 양보도 네 곳을 봐야 구분됩니다"
      description="위 줄은 글이 기대하는 경로이고, 아래 네 칸은 그 경로가 실제로 일어나는지 확인할 자리입니다."
      ariaLabel="반복한 절차가 판단을 바꾸는 경로와 형식만 남는 두 경우, 확인할 네 곳"
      scenes={SCENES.map(({ label, summary, note }) => ({ label, summary, note }))}
      render={(active) => (
        <div className="min-w-0">
          <ol className={`grid min-w-0 gap-2 sm:grid-cols-3 ${active === 0 ? "" : "opacity-45"}`}>
            {CHAIN.map((step, index) => (
              <li key={step} className="rounded-lg border border-border bg-background px-3 py-2 text-xs leading-5">
                <span className="font-mono font-bold text-primary">{index + 1}</span> {step}
              </li>
            ))}
          </ol>
          <StableSceneStack
            active={active}
            className="mt-4"
            scenes={SCENES.map((scene) => (
              <ul key={scene.label} className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4">
                {CHECKS.map((check, index) => {
                  const [status, text] = scene.cells[index] as readonly [Status, string];
                  return (
                    <li key={check} className={`min-w-0 rounded-lg border px-2.5 py-2 text-xs leading-5 ${CELL_STYLE[status]}`}>
                      <span className="block font-bold">{check}</span>
                      <span className={status === "off" ? "font-semibold text-red-700 dark:text-red-400" : "text-muted-foreground"}>
                        {status === "off" ? "어긋남: " : ""}{text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ))}
          />
        </div>
      )}
    />
  );
}
