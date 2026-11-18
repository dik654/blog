import SceneShell from "./SceneShell";

/**
 * 본문 대응: #inner-product — 길이 8 vector를 round마다 좌우로 나누고,
 * L·R을 transcript에 넣은 뒤 challenge u를 얻어 절반으로 접는다. 8→4→2→1, 3=log₂8 rounds.
 * Proof에는 L/R pair 3개와 마지막 scalar a, b가 남는다.
 */
const LENGTHS: readonly number[] = [8, 4, 2, 1];
const PRIMES: readonly string[] = ["", "′", "″", "‴"];

type Scene = {
  label: string;
  summary: string;
  note: string;
  /** 이 장면에서 보이는 마지막 줄 */
  shownLevel: number;
  /** 좌우로 나눠 칠하는 줄, 없으면 null */
  splitLevel: number | null;
  /** transcript에 들어간 round 수 */
  rounds: number;
  proofView: boolean;
};

const SCENES: readonly Scene[] = [
  {
    label: "가운데에서 나누기",
    summary: "a = (a_L | a_R), 길이 4 + 4",
    shownLevel: 0,
    splitLevel: 0,
    rounds: 0,
    proofView: false,
    note: "길이 8인 witness a를 앞 4칸 a_L과 뒤 4칸 a_R로 나눕니다. b, G, H도 같은 가운데에서 나눠야 칸끼리 좌표가 맞습니다.",
  },
  {
    label: "L·R 먼저, u는 그 뒤",
    summary: "append L₁, R₁ → u₁",
    shownLevel: 0,
    splitLevel: 0,
    rounds: 1,
    proofView: false,
    note: "접을 때 생기는 교차항 c_L=⟨a_L,b_R⟩, c_R=⟨a_R,b_L⟩을 L₁, R₁ point로 만들어 transcript에 먼저 넣습니다. challenge u₁은 그다음에 나오므로 prover가 u₁을 보고 L₁·R₁을 바꿀 수 없습니다.",
  },
  {
    label: "round 1: 8 → 4",
    summary: "a′ = u·a_L + u⁻¹·a_R",
    shownLevel: 1,
    splitLevel: null,
    rounds: 1,
    proofView: false,
    note: "앞 칸과 뒤 칸을 u와 u⁻¹로 섞어 한 칸으로 만듭니다. 예를 들어 a′₁ = u·a₁ + u⁻¹·a₅입니다. generator는 반대 계수 G′ = u⁻¹·G_L + u·G_R로 접어 같은 관계를 유지합니다.",
  },
  {
    label: "round 2: 4 → 2",
    summary: "append L₂, R₂ → u₂ → 접기",
    shownLevel: 2,
    splitLevel: 1,
    rounds: 2,
    proofView: false,
    note: "길이 4인 a′에 같은 순서를 반복합니다. 다시 가운데에서 나누고, L₂·R₂를 넣은 뒤 u₂를 얻어 길이 2로 접습니다.",
  },
  {
    label: "round 3: 2 → 1",
    summary: "append L₃, R₃ → u₃ → scalar a",
    shownLevel: 3,
    splitLevel: 2,
    rounds: 3,
    proofView: false,
    note: "세 번째 round에서 길이가 1이 됩니다. log₂8 = 3이므로 round는 세 번이고, 마지막에는 scalar a와 b가 하나씩 남습니다.",
  },
  {
    label: "proof에 남는 것",
    summary: "L/R pair 3개 + 마지막 a, b",
    shownLevel: 3,
    splitLevel: null,
    rounds: 3,
    proofView: true,
    note: "Proof에는 round별 L·R과 마지막 scalar만 들어가 크기가 O(log n)입니다. 그러나 처음 8칸 전체를 다루는 일까지 3번의 연산으로 줄어드는 것은 아니어서 전체 MSM(multiscalar multiplication) work는 여전히 n 규모입니다.",
  },
];

const SUB = ["₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈"];

function cellLabel(level: number, index: number, length: number) {
  if (length === 1) return "a";
  return `a${PRIMES[level]}${SUB[index]}`;
}

export default function IpaFoldViz() {
  return (
    <SceneShell
      eyebrow="Inner-product argument · n=8"
      title="길이 8 vector가 세 round 만에 한 칸이 되는 순서"
      description="한 줄이 한 round의 witness vector a이고 칸 하나가 원소 하나입니다. 파란 칸은 왼쪽 절반, 주황 칸은 오른쪽 절반입니다. 옆(좁은 화면에서는 아래) 상자는 transcript(지금까지 주고받은 값을 순서대로 흡수해 challenge를 뽑는 기록)입니다."
      ariaLabel="길이 8 vector를 L, R 고정과 challenge u로 세 번 절반씩 접는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
            <div className="min-w-0 space-y-2">
              {LENGTHS.map((length, level) => {
                const visible = level <= scene.shownLevel;
                const split = scene.splitLevel === level;
                return (
                  <div key={length} className={`flex items-center gap-2 ${visible ? "" : "opacity-0"}`} aria-hidden={!visible}>
                    <span className="w-9 shrink-0 text-right font-mono text-[11px] text-muted-foreground">n={length}</span>
                    <div className="grid min-w-0 flex-1 gap-1" style={{ gridTemplateColumns: "repeat(8, minmax(0, 1fr))" }}>
                      {Array.from({ length }, (_, index) => {
                        const left = index < length / 2;
                        const tone = split
                          ? left
                            ? "border-blue-600 bg-blue-600/10"
                            : "border-amber-600 bg-amber-600/10"
                          : scene.proofView && length === 1
                            ? "border-emerald-600 bg-emerald-600/10"
                            : "border-border bg-background";
                        return (
                          <div
                            key={index}
                            className={`min-w-0 rounded border px-0.5 py-1.5 text-center font-mono text-[11px] sm:text-xs ${tone}`}
                            style={{ gridColumn: `span ${8 / length} / span ${8 / length}` }}
                          >
                            {cellLabel(level, index, length)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <p className="pt-1 text-[11px] leading-5 text-muted-foreground">
                {scene.proofView
                  ? "처음 8칸 전체를 처리하는 prover·verifier work는 줄지 않습니다."
                  : "칸 폭은 섞인 원래 칸 수일 뿐 위치는 아닙니다. a′₁은 바로 위 a₁·a₂가 아니라 a₁과 a₅를 섞습니다."}
              </p>
            </div>
            <div className="min-w-0 rounded-lg border border-border bg-background p-2">
              <p className="text-[11px] font-bold text-muted-foreground">transcript 순서</p>
              <p className="mt-1 px-1 font-mono text-[11px]">statement</p>
              <ol className="mt-1 space-y-1 font-mono text-[11px]">
                {[0, 1, 2].map((round) => {
                  const shown = round < scene.rounds;
                  return (
                    <li key={round} className={`grid grid-cols-3 gap-1 ${shown ? "" : "invisible"}`} aria-hidden={!shown}>
                      <span className={`rounded px-1 py-0.5 ${scene.proofView ? "bg-emerald-600/15 font-bold" : ""}`}>L{SUB[round]}</span>
                      <span className={`rounded px-1 py-0.5 ${scene.proofView ? "bg-emerald-600/15 font-bold" : ""}`}>R{SUB[round]}</span>
                      <span className="px-1 py-0.5 text-primary">→ u{SUB[round]}</span>
                    </li>
                  );
                })}
              </ol>
              <p className={`mt-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 ${scene.proofView ? "" : "invisible"}`}>
                proof = L/R 3쌍 + a, b
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
