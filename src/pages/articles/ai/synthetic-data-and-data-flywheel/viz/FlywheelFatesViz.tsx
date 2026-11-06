import SceneShell from "./SceneShell";

/**
 * 본문 대응: #flywheel-loop — 라운드마다 약점이 옮겨 가는 회전과, 회전이 멈추거나 빗나가는 두 경우.
 * 약점 ①②③의 개수와 이름은 순서를 보이려는 가정이며 Arena Learning의 실제 측정이 아닙니다.
 */
const WEAK = ["약점 ①", "약점 ②", "약점 ③"] as const;
const WEAK_ROUNDS: readonly (readonly string[])[] = [
  ["드러남", "가려짐", "가려짐"],
  ["메워짐", "드러남", "가려짐"],
  ["메워짐", "메워짐", "드러남"],
];

const SCENES = [
  { label: "돌 때: 이번 라운드의 약점", summary: "진 사례 → 다음 데이터", note: "배틀에 진 사례가 드러낸 약점을 다음 SFT·RL 데이터로 씁니다. 약점 번호와 개수는 순서를 보이려는 가정입니다.", kind: "spin", round: 0 },
  { label: "돌 때: 다음 라운드", summary: "메워진 자리에서 새 약점", note: "학습하면 다음 라운드 배틀에서는 이전 약점이 메워진 자리에서 새로운 약점이 드러나고, 그 약점이 다시 다음 라운드 데이터가 됩니다.", kind: "spin", round: 1 },
  { label: "멈출 때: 초기 모델이 너무 약함", summary: "전부 0/8 → curriculum 빔", note: "pass rate가 모두 0%에 가까우면 verifier 신호가 없고, difficulty filtering이 전부 걸러 curriculum에 남는 데이터가 사라집니다. 세 줄 8칸은 가정입니다.", kind: "stall", round: 0 },
  { label: "빗나갈 때: teacher 없이 혼자", summary: "편향 증폭 가능 → 정지 기준", note: "teacher 없이 혼자 도는 loop는 원래 편향을 매 라운드 증폭시킬 수 있어 student-only 검증(teacher 없이 모델만 재는 검증) 같은 독립적인 정지 기준이 필요합니다.", kind: "bias", round: 0 },
] as const;

function Spin({ round }: { round: number }) {
  return (
    <div className="grid min-w-0 gap-2">
      {WEAK_ROUNDS.slice(0, round + 2).map((row, rowIndex) => (
        <div key={rowIndex} className={`grid grid-cols-[3.75rem_repeat(3,minmax(0,1fr))] items-center gap-1.5 ${rowIndex === round ? "" : "opacity-60"}`}>
          <span className="text-xs font-semibold">라운드 {rowIndex + 1}</span>
          {row.map((state, cell) => (
            <span
              key={cell}
              className={`rounded-md border px-1 py-1.5 text-center text-[11px] leading-4 ${
                state === "드러남" ? "border-[#dc2626] font-semibold text-[#dc2626]" : state === "메워짐" ? "border-[#16a34a] text-[#16a34a]" : "border-dashed border-border text-muted-foreground"
              }`}
            >
              {WEAK[cell]}<span className="block">{state}</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Stall() {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,10rem)] sm:items-center">
      <div className="space-y-1.5" aria-hidden="true">
        {[0, 1, 2].map((row) => (
          <div key={row} className="grid grid-cols-8 gap-1">
            {Array.from({ length: 8 }, (_, cell) => (
              <span key={cell} className="flex h-6 items-center justify-center rounded border border-dashed border-border text-xs text-muted-foreground">✕</span>
            ))}
          </div>
        ))}
      </div>
      <span aria-hidden="true" className="text-center text-primary">→</span>
      <div className="rounded-lg border border-dashed border-[#dc2626] px-3 py-5 text-center text-xs font-semibold text-[#dc2626]">curriculum<span className="block font-normal">남는 데이터 없음</span></div>
    </div>
  );
}

function Bias() {
  return (
    <div className="space-y-2 text-xs">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-lg border border-border bg-background px-3 py-2">모델 혼자 생성</span>
        <span aria-hidden="true" className="text-primary">→</span>
        <span className="rounded-lg border border-border bg-background px-3 py-2">그 출력으로 학습</span>
      </div>
      <p className="text-center text-muted-foreground"><span aria-hidden="true" className="text-primary">↻ </span>라운드마다 반복</p>
      <div className="flex flex-col items-center gap-1">
        <span className="rounded-lg border border-dashed border-[#dc2626] px-3 py-2 font-semibold text-[#dc2626]">원래 편향이 증폭될 수 있음</span>
        <span aria-hidden="true" className="text-primary">↓</span>
        <span className="rounded-lg border border-primary bg-primary/10 px-3 py-2 font-semibold">독립적인 정지 기준 필요</span>
      </div>
    </div>
  );
}

export default function FlywheelFatesViz() {
  return (
    <SceneShell
      eyebrow="Flywheel의 라운드"
      title="잘 돌 때는 약점이 옮겨 가고, 조건이 어긋나면 멈추거나 빗나갑니다"
      description="한 바퀴의 단계는 글 첫 그림에 있습니다. 여기서는 여러 번 돌 때의 상태를 봅니다."
      ariaLabel="라운드마다 옮겨 가는 약점, 신호가 없어 멈추는 경우, 편향 증폭과 정지 기준"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="flex min-h-[9rem] min-w-0 flex-col justify-center">
            {scene.kind === "spin" && <Spin round={scene.round} />}
            {scene.kind === "stall" && <Stall />}
            {scene.kind === "bias" && <Bias />}
          </div>
        );
      }}
    />
  );
}
