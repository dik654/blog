import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 앞 결과에 2를 곱하는 일은 결과 자리와 순서만 전달하면 되고,
 * 앞 결과가 18이면 멈추는 결정을 준비하는 쪽에서 하면 18인지 알 때까지 다음 작업을 확정할 수 없다.
 */
interface Box {
  title: string;
  body: string;
  hot?: boolean;
}
const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  boxes: readonly Box[];
  arrows: readonly string[];
  valueMove: string;
}[] = [
  {
    label: "다음 일이 ‘앞 결과 × 2’",
    summary: "숫자 없이 지시 전달",
    note: "지시에는 결과가 놓일 자리와 앞 일 뒤에 실행하라는 순서만 있으면 됩니다. 준비하는 쪽이 앞 결과의 숫자를 직접 알 필요는 없습니다.",
    boxes: [
      { title: "준비하는 쪽", body: "‘그 자리의 값에 2를 곱하라’를 전달", hot: true },
      { title: "순서를 기다리는 일", body: "앞 일 → ×2" },
      { title: "계산하는 쪽", body: "앞 일을 계산 중" },
    ],
    arrows: ["지시", "순서대로"],
    valueMove: "값의 이동 없음",
  },
  {
    label: "계산할 때 값을 읽습니다",
    summary: "값을 읽는 쪽은 계산하는 쪽",
    note: "앞 일이 끝나면 계산하는 쪽이 그 자리의 값을 읽어 2를 곱합니다. 계산에 데이터가 필요한 때입니다. 이 데이터가 준비하는 쪽으로 돌아올 필요는 없습니다.",
    boxes: [
      { title: "준비하는 쪽", body: "값을 모른 채 다음 일을 준비할 수 있음" },
      { title: "순서를 기다리는 일", body: "×2 차례가 옴" },
      { title: "계산하는 쪽", body: "자리의 값을 읽어 × 2", hot: true },
    ],
    arrows: ["", "순서대로"],
    valueMove: "값은 계산하는 쪽에서 읽힘",
  },
  {
    label: "다음 일이 ‘18이면 멈춤’",
    summary: "18인지 알 때까지 확정 불가",
    note: "이 결정을 준비하는 쪽에서 한다면 값이 돌아와야 다음 지시를 고를 수 있습니다. 계산이 아니라 다음 지시를 고르기 위해 데이터가 필요한 때입니다.",
    boxes: [
      { title: "준비하는 쪽", body: "값을 받을 때까지 다음 지시를 정하지 못함", hot: true },
      { title: "순서를 기다리는 일", body: "다음 지시가 아직 없음" },
      { title: "계산하는 쪽", body: "앞 결과를 만듦" },
    ],
    arrows: ["", ""],
    valueMove: "계산하는 쪽의 값 → 준비하는 쪽으로 돌아와야 함",
  },
];

function Arrow({ label }: { label: string }) {
  return (
    <div className="flex min-h-[1.5rem] items-center justify-center gap-1 text-xs font-bold text-muted-foreground sm:flex-col sm:gap-0">
      <span aria-hidden="true" className={`font-mono text-base ${label ? "text-[#2563eb]" : "opacity-0"}`}>
        <span className="sm:hidden">↓</span>
        <span className="hidden sm:inline">→</span>
      </span>
      <span>{label}</span>
    </div>
  );
}

export default function ValueNeedBranchViz() {
  return (
    <SceneShell
      eyebrow="값이 필요한 곳"
      title="계산에 필요한 값과 다음 지시를 고르는 데 필요한 값은 다릅니다"
      description="첫 칸이 일을 정해 전달하고 마지막 칸이 실행합니다. 화살표는 지시가 움직이는 방향이고, 맨 아래 줄은 값이 어디로 움직이는지입니다."
      ariaLabel="앞 결과에 곱하는 일과 앞 결과로 분기하는 일의 차이"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
          <div className="grid min-w-0 gap-1 sm:grid-cols-[minmax(0,1fr)_4.25rem_minmax(0,1fr)_4.25rem_minmax(0,1fr)] sm:items-stretch">
            {scene.boxes.map((box, boxIndex) => (
              <div key={box.title} className="contents">
                {boxIndex > 0 ? <Arrow label={scene.arrows[boxIndex - 1]} /> : null}
                <div className={`rounded-lg border bg-background p-3 ${box.hot ? "border-[#2563eb]" : "border-border"}`}>
                  <p className="text-sm font-bold">{box.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{box.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className={`mt-3 rounded-lg border px-3 py-2 text-center text-sm font-bold ${scene.arrows[0] === "" && scene.arrows[1] === "" ? "border-dashed border-[#d97706] text-[#b45309]" : "border-border text-muted-foreground"}`}>{scene.valueMove}</p>
          </div>
        );
      }}
    />
  );
}
