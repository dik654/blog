import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gpu-mapping — multi-GPU에서 halo exchange와 interior cells 계산을 overlap할 수 있지만
 * partition boundary와 global reduction은 별도 communication critical path다.
 * GPU 두 개·partition당 cell 4개는 설명용 가정이다.
 */
type CellState = "idle" | "compute" | "done" | "wait";

interface Scene {
  label: string;
  summary: string;
  note: string;
  interior: CellState;
  boundary: CellState;
  halo: "none" | "flight" | "arrived";
  phase: number;
}

const SCENES: readonly Scene[] = [
  {
    label: "Partition 경계와 halo (가정)",
    summary: "A3 ↔ B0이 서로의 이웃",
    note: "Mesh를 GPU A와 B에 네 cell씩 나눴다고 가정합니다. A3의 오른쪽 face 이웃 B0은 다른 GPU에 있으므로, A는 B0 값의 복사본(halo)을 받아야 그 face flux를 계산할 수 있습니다. B도 A3의 복사본이 필요합니다.",
    interior: "idle",
    boundary: "idle",
    halo: "none",
    phase: -1,
  },
  {
    label: "Interior 계산과 halo 교환을 동시에",
    summary: "기다리지 않는 cell부터",
    note: "A0–A2와 B1–B3은 같은 GPU 안의 이웃만 읽으므로 halo를 기다릴 필요가 없습니다. 이 interior cells를 계산하는 동안 경계 cell 값을 보내고 받으면 두 일이 겹칩니다.",
    interior: "compute",
    boundary: "wait",
    halo: "flight",
    phase: 0,
  },
  {
    label: "받은 뒤 경계 cell 계산",
    summary: "A3·B0은 halo 도착 후",
    note: "A3과 B0은 halo가 도착해야 계산할 수 있습니다. 통신이 interior 계산보다 길면 경계 cell이 그만큼 기다릴 수 있어 partition boundary가 별도 critical path가 됩니다.",
    interior: "done",
    boundary: "compute",
    halo: "arrived",
    phase: 1,
  },
  {
    label: "Global reduction",
    summary: "두 GPU가 모두 모여야 끝",
    note: "Residual norm이나 CFL의 min처럼 모든 cell의 값을 하나로 줄이는 계산은 두 GPU의 결과가 다 모여야 끝납니다. 그래서 이것도 local flux kernel 밖의 critical path입니다.",
    interior: "done",
    boundary: "done",
    halo: "arrived",
    phase: 2,
  },
];

const PHASES = [
  ["interior 계산", "halo 보내기·받기"],
  ["경계 cell 계산", "—"],
  ["모든 GPU가 대기", "global reduction (min · norm)"],
] as const;

const TONE: Record<CellState, string> = {
  idle: "border-border bg-background text-foreground",
  compute: "border-primary bg-primary/[0.08] text-primary",
  done: "border-emerald-600/60 bg-background text-emerald-700 dark:text-emerald-400",
  wait: "border-amber-600 bg-amber-600/[0.06] text-amber-700 dark:text-amber-400",
};
const MARK: Record<CellState, string> = { idle: "", compute: "계산", done: "완료", wait: "대기" };

function Cell({ name, state, edge }: { name: string; state: CellState; edge?: boolean }) {
  return (
    <div className={`flex h-12 min-w-0 flex-col items-center justify-center rounded-md border text-xs ${TONE[state]} ${edge ? "border-[1.25px]" : ""}`}>
      <strong className="font-mono">{name}</strong>
      <span className="h-4 text-[10px] leading-4">{MARK[state]}</span>
    </div>
  );
}

function Halo({ name, halo }: { name: string; halo: Scene["halo"] }) {
  const text = halo === "none" ? "필요" : halo === "flight" ? "전송 중" : "도착";
  const tone = halo === "arrived" ? "border-emerald-600/60 text-emerald-700 dark:text-emerald-400" : halo === "flight" ? "border-amber-600 text-amber-700 dark:text-amber-400" : "border-border text-muted-foreground";
  return (
    <div className={`flex h-12 min-w-0 flex-col items-center justify-center rounded-md border border-dashed text-xs ${tone}`}>
      <span className="font-mono text-[11px]">{name}</span>
      <span className="text-[10px] leading-4">halo {text}</span>
    </div>
  );
}

export default function HaloOverlapViz() {
  return (
    <SceneShell
      eyebrow="Multi-GPU 한 step의 순서"
      title="Halo를 기다리는 cell과 기다리지 않는 cell을 나눠 겹칩니다"
      description="위는 두 GPU에 나눈 cell과 경계 복사본(halo, 점선 칸), 아래는 한 step 안의 작업 순서입니다. 칸 너비는 시간 길이가 아닙니다."
      note="GPU 두 개·partition당 cell 4개는 설명용 가정입니다. 실제로 얼마나 겹치는지는 interior 계산 시간과 통신 시간을 측정해야 알 수 있습니다."
      ariaLabel="두 GPU partition에서 interior 계산과 halo 교환을 겹치고 경계 cell과 global reduction이 뒤따르는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="min-w-0">
                <p className="mb-1 font-mono text-[10px] font-bold text-muted-foreground">GPU A</p>
                <div className="grid grid-cols-5 gap-1">
                  {["A0", "A1", "A2"].map((name) => <Cell key={name} name={name} state={scene.interior} />)}
                  <Cell name="A3" state={scene.boundary} edge />
                  <Halo name="B0 복사" halo={scene.halo} />
                </div>
              </div>
              <div className="min-w-0">
                <p className="mb-1 font-mono text-[10px] font-bold text-muted-foreground">GPU B</p>
                <div className="grid grid-cols-5 gap-1">
                  <Halo name="A3 복사" halo={scene.halo} />
                  <Cell name="B0" state={scene.boundary} edge />
                  {["B1", "B2", "B3"].map((name) => <Cell key={name} name={name} state={scene.interior} />)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[3.5rem_repeat(3,minmax(0,1fr))] gap-px bg-border p-px text-[11px] leading-4">
              <span className="bg-background px-1.5 py-1.5 font-semibold text-muted-foreground">순서</span>
              {PHASES.map((_, index) => (
                <span key={index} className={`px-1.5 py-1.5 text-center font-mono font-bold ${index === scene.phase ? "bg-primary/[0.08] text-primary" : "bg-background text-muted-foreground"}`}>{index + 1}</span>
              ))}
              <span className="bg-background px-1.5 py-1.5 font-semibold text-muted-foreground">계산</span>
              {PHASES.map(([compute], index) => (
                <span key={compute} className={`break-keep px-1.5 py-1.5 ${index === scene.phase ? "bg-primary/[0.08] text-foreground" : "bg-background text-muted-foreground"}`}>{compute}</span>
              ))}
              <span className="bg-background px-1.5 py-1.5 font-semibold text-muted-foreground">통신</span>
              {PHASES.map(([, comm], index) => (
                <span key={index} className={`break-keep px-1.5 py-1.5 ${index === scene.phase ? "bg-primary/[0.08] text-foreground" : "bg-background text-muted-foreground"}`}>{comm}</span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
