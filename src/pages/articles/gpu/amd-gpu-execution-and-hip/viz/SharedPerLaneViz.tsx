import CellRow, { type CellTone } from "./CellRow";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 명령은 묶음이 함께, 값은 작업마다, 모두 같은 값은 따로, 함께 쓰는 공간은 재사용이 있을 때.
 * 이 절은 아직 AMD 이름을 붙이기 전이라 역할 이름만 씁니다. 다음 절의 이름과 그대로 이어집니다.
 */
const SCENES = [
  { label: "명령은 함께", summary: "덧셈 명령 1개 → 작업 64개", note: "한 묶음이 같은 동작을 수행하면 명령을 가져오고 해석하는 일을 함께할 수 있습니다." },
  { label: "값은 각자", summary: "작업마다 저장 칸 하나", note: "각 작업은 입력과 중간값이 다릅니다. 37번은 37번 칸의 값을 쓰므로 이 값들은 작업 수만큼 칸이 필요합니다." },
  { label: "같은 값은 한 칸", summary: "64벌 복제 → 한 칸", note: "모든 작업에 같은 값까지 작업마다 두면 불필요한 복제입니다. 두 저장소를 구별하면 이 복제를 줄일 수 있습니다." },
  { label: "함께 쓰는 공간", summary: "재사용 없음 → 바로 읽기 먼저", note: "같은 입력 조각을 여러 번 쓸 때는 함께 쓰는 공간이 필요합니다. 이번 덧셈은 재사용이 없어 옮기는 명령과 대기만 더할 가능성이 있으므로, 바로 읽고 쓰는 경로를 먼저 측정합니다." },
] as const;

const box = "rounded border px-3 py-2 text-center text-xs font-semibold leading-5";

function Route({ name, steps, muted = false }: { name: string; steps: readonly string[]; muted?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold">{name}</p>
      <ol className="mt-1 flex flex-wrap items-center gap-1 text-xs">
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-1">
            {index > 0 && <span aria-hidden className="text-muted-foreground">→</span>}
            <span className={`rounded border px-2 py-1 leading-5 ${muted && index === 1 ? "border-dashed border-amber-600 text-amber-700 dark:text-amber-400" : "border-border"}`}>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Lanes({ tone = () => "on" }: { tone?: (id: number) => CellTone }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-semibold">작업 0–63</p>
      <CellRow count={64} tone={tone} />
    </div>
  );
}

const mark37 = (id: number): CellTone => (id === 37 ? "hot" : "on");

export default function SharedPerLaneViz() {
  return (
    <SceneShell
      eyebrow="함께 쓰는 것과 각자 두는 것"
      title="64개 작업은 무엇을 나누고 무엇을 따로 가질까요"
      description="띠의 칸 하나가 작업 하나입니다. 칸 수는 이 글의 64개 작업이며, 실제 저장소의 크기를 그린 것은 아닙니다."
      ariaLabel="명령은 함께, 값은 작업마다, 같은 값은 한 칸에 두고 함께 쓰는 공간은 재사용이 있을 때 쓰는 구조"
      scenes={SCENES}
      render={(index) => {
        if (index === 0) {
          return (
            <div className="space-y-2">
              <p className={`${box} border-primary bg-primary/15`}>덧셈 명령 1개를 가져와 해석</p>
              <p aria-hidden className="text-center text-muted-foreground">↓ 64개 작업이 함께 진행</p>
              <Lanes />
            </div>
          );
        }
        if (index === 1) {
          return (
            <div className="space-y-2">
              <Lanes tone={mark37} />
              <p className="text-xs font-semibold">입력 값 · 작업마다 다름</p>
              <CellRow count={64} tone={mark37} />
              <p className="text-xs font-semibold">중간값 · 작업마다 다름</p>
              <CellRow count={64} tone={mark37} />
            </div>
          );
        }
        if (index === 2) {
          return (
            <div className="space-y-2">
              <Lanes />
              <p className="text-xs font-semibold text-red-700 dark:text-red-400">같은 값을 작업마다 두면</p>
              <CellRow count={64} tone={() => "dim"} />
              <p className="text-xs font-semibold">묶음에 한 칸만 두면</p>
              <p className={`${box} border-primary bg-primary/15`}>모든 작업에 같은 값</p>
            </div>
          );
        }
        return (
          <div className="space-y-3">
            <Route name="바로 읽고 쓰기 · 이번 덧셈" steps={["입력", "작업", "결과"]} />
            <Route name="함께 쓰는 공간 거치기" muted steps={["입력", "공간으로 옮기는 명령·대기", "작업", "결과"]} />
          </div>
        );
      }}
    />
  );
}
