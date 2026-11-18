import SceneShell from "./SceneShell";

/**
 * 본문 대응: #process-slot — ProcessSlot은 ① 현재 state root 계산 → ② header.state_root가 zero면 backfill
 * → ③ 완성 header root 기록 순서를 지킨다. 두 기록은 같은 ring index i = s mod 8,192에 들어간다.
 * 30 mod 8,192 = 30, 8,222 mod 8,192 = 30. Slot 31·32에는 block이 없어 latest header가 그대로다.
 */
type Step = -1 | 0 | 1 | 2;

interface HeaderScene {
  label: string;
  summary: string;
  note: string;
  step: Step;
  wrongOrder: boolean;
  header: string;
  stateRoots: readonly [string, string, string];
  blockRoots: readonly [string, string, string];
  focus: number;
  rows: "state" | "block" | "both" | "none";
}

const SCENES: readonly HeaderScene[] = [
  {
    label: "Block 30 적용 직후",
    summary: "header.state_root = zero",
    note: "Slot 30의 state는 block 30을 적용한 뒤의 state입니다. 그 안의 latest block header는 state_root 칸이 zero로 비어 있습니다. Header와 state root가 서로를 담는 순환 의존성을 피하려고 비워 둔 칸이며, 다음 ProcessSlot에서 채웁니다.",
    step: -1,
    wrongOrder: false,
    header: "zero",
    stateRoots: ["", "", ""],
    blockRoots: ["", "", ""],
    focus: -1,
    rows: "none",
  },
  {
    label: "① State root 계산",
    summary: "state_roots[30] = S₃₀",
    note: "현재 slot 30 state의 root S₃₀를 계산해 state_roots의 index 30에 씁니다. Index는 30 mod 8,192 = 30입니다.",
    step: 0,
    wrongOrder: false,
    header: "zero",
    stateRoots: ["S₃₀", "", ""],
    blockRoots: ["", "", ""],
    focus: 30,
    rows: "state",
  },
  {
    label: "② Zero라서 backfill",
    summary: "header.state_root ← S₃₀",
    note: "Header의 state_root가 zero이므로 방금 계산한 S₃₀로 채웁니다. 이제 header는 빈칸 없는 완성본입니다.",
    step: 1,
    wrongOrder: false,
    header: "S₃₀",
    stateRoots: ["S₃₀", "", ""],
    blockRoots: ["", "", ""],
    focus: -1,
    rows: "none",
  },
  {
    label: "③ Header root 기록",
    summary: "block_roots[30] = B",
    note: "채운 header 전체의 root B를 block_roots의 같은 index 30에 씁니다. 두 배열은 한 slot의 값을 같은 칸 번호에 나란히 둡니다.",
    step: 2,
    wrongOrder: false,
    header: "S₃₀",
    stateRoots: ["S₃₀", "", ""],
    blockRoots: ["B", "", ""],
    focus: 30,
    rows: "block",
  },
  {
    label: "순서를 바꾸면",
    summary: "zero header를 hash → B′ ≠ B",
    note: "②보다 ③을 먼저 하면 state_root가 아직 zero인 header를 hash합니다. 그 결과 B′는 완성 header의 root B와 다른 block root입니다.",
    step: 2,
    wrongOrder: true,
    header: "zero",
    stateRoots: ["S₃₀", "", ""],
    blockRoots: ["B′ ≠ B", "", ""],
    focus: 30,
    rows: "block",
  },
  {
    label: "Slot 31: backfill 없음",
    summary: "block_roots[31] = 같은 B",
    note: "Slot 31에는 block이 없어 latest header가 그대로입니다. state_root가 이미 zero가 아니므로 ②를 건너뛰고, 같은 header의 root B를 block_roots[31]에 씁니다. state_roots[31]에는 slot 31 state의 root S₃₁이 들어갑니다.",
    step: 2,
    wrongOrder: false,
    header: "S₃₀",
    stateRoots: ["S₃₀", "S₃₁", ""],
    blockRoots: ["B", "B", ""],
    focus: 31,
    rows: "both",
  },
  {
    label: "8,192 slot 뒤",
    summary: "8,222 mod 8,192 = 30",
    note: "Slot 32까지 같은 방식으로 기록한 뒤 시간이 흘러 slot 8,222가 되면, index가 다시 30이므로 slot 30의 두 값을 덮습니다. 이 배열은 최근 8,192개 slot의 조회 창이지 영구 기록이 아닙니다.",
    step: -1,
    wrongOrder: false,
    header: "이 사례 밖 (생략)",
    stateRoots: ["slot 8,222 값", "S₃₁", "S₃₂"],
    blockRoots: ["slot 8,222 값", "B", "B"],
    focus: 30,
    rows: "both",
  },
];

const STEPS = ["① HashTreeRoot", "② zero면 backfill", "③ header root"] as const;
const INDEXES: readonly number[] = [30, 31, 32];

function RootCell({ value, focus, wrong }: { value: string; focus: boolean; wrong: boolean }) {
  const tone = wrong ? "border-red-600 text-red-700 dark:text-red-400" : focus ? "border-primary text-primary" : "border-border";
  return (
    <div className={`flex min-h-10 min-w-0 items-center justify-center rounded-md border px-1 text-center font-mono text-[11px] font-bold leading-4 sm:text-xs ${tone}`}>
      {value === "" ? <span className="font-normal text-muted-foreground/60">비어 있음</span> : value}
    </div>
  );
}

export default function HeaderBackfillViz() {
  return (
    <SceneShell
      eyebrow="ProcessSlot 한 번"
      title="Header root는 빈 state_root를 채운 뒤에 계산합니다"
      description="S₃₀는 slot 30 state의 root, B는 state_root를 채운 header의 root입니다. 칸 번호는 slot을 8,192로 나눈 나머지입니다."
      ariaLabel="ProcessSlot의 state root 계산, header backfill, block root 기록 순서와 ring index 덮어쓰기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {STEPS.map((step, index) => {
                const on = scene.step === index;
                const wrong = on && scene.wrongOrder;
                return (
                  <div
                    key={step}
                    className={`min-h-12 min-w-0 rounded-md border px-1.5 py-1.5 text-center text-[11px] leading-4 sm:text-xs ${
                      wrong ? "border-red-600 font-bold text-red-700 dark:text-red-400" : on ? "border-primary font-bold text-primary" : "border-border text-muted-foreground"
                    }`}
                  >
                    {step}
                    <span className="block text-[10px] font-normal">{wrong ? "②보다 먼저 실행" : on ? "지금 실행" : " "}</span>
                  </div>
                );
              })}
            </div>

            <div className="rounded-md border border-border px-3 py-2">
              <span className="block text-[11px] text-muted-foreground">state 안의 latest_block_header{active < SCENES.length - 1 ? " (block 30)" : " (slot 8,222 시점)"}</span>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2 font-mono text-xs sm:text-sm">
                <span>state_root:</span>
                <strong className={scene.header === "zero" ? "text-amber-700 dark:text-amber-400" : "text-primary"}>{scene.header === "zero" ? "0x00…00 (zero)" : scene.header}</strong>
              </div>
            </div>

            <div className="grid grid-cols-[5.5rem_repeat(3,minmax(0,1fr))] items-center gap-1.5 sm:grid-cols-[7rem_repeat(3,minmax(0,1fr))]">
              <span />
              {INDEXES.map((index) => (
                <span key={index} className={`text-center font-mono text-[11px] ${scene.focus === index ? "font-bold text-primary" : "text-muted-foreground"}`}>
                  index {index}
                </span>
              ))}
              <span className="font-mono text-[11px] sm:text-xs">state_roots</span>
              {scene.stateRoots.map((value, slot) => (
                <RootCell key={`s${INDEXES[slot]}`} value={value} focus={scene.focus === INDEXES[slot] && (scene.rows === "state" || scene.rows === "both")} wrong={false} />
              ))}
              <span className="font-mono text-[11px] sm:text-xs">block_roots</span>
              {scene.blockRoots.map((value, slot) => (
                <RootCell key={`b${INDEXES[slot]}`} value={value} focus={scene.focus === INDEXES[slot] && (scene.rows === "block" || scene.rows === "both")} wrong={scene.wrongOrder && slot === 0} />
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
