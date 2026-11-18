import UpdateSceneShell from "./UpdateSceneShell";

/**
 * 본문 대응: #best-update — is_better_update의 비교 순서.
 * 2/3 경계: N=512에서 3p ≥ 1,024 → 342는 이상, 341은 미달(본문 수치).
 * 두 후보 A·B의 나머지 값은 비교 순서를 보이려는 가정이다.
 */

interface Rung {
  name: string;
  a: string;
  b: string;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  rungs: readonly Rung[];
  decide: number;
  winner: "A" | "B" | "";
}

const RUNG_NAMES = [
  "2/3 이상 여부",
  "둘 다 미달 → 참여 수",
  "Relevant next committee",
  "Finality 유무",
  "같은 period finality",
  "참여 수",
  "Attested slot · 오래된 쪽",
  "Signature slot · 이른 쪽",
] as const;

const DASH = "—";

function rungs(values: readonly (readonly [string, string])[]): readonly Rung[] {
  return RUNG_NAMES.map((name, i) => ({ name, a: values[i]?.[0] ?? DASH, b: values[i]?.[1] ?? DASH }));
}

const SAME = ["같음", "같음"] as const;

const SCENES: readonly Scene[] = [
  {
    label: "비교 순서",
    summary: "위 칸부터, 처음 갈리는 칸에서 결정",
    note: "검증을 통과한 update 두 개를 위 칸부터 비교합니다. 어떤 칸에서 값이 갈리면 그 칸이 승자를 정하고 아래 칸은 보지 않습니다. 둘째 칸은 두 후보가 모두 2/3에 못 미칠 때만 씁니다.",
    rungs: rungs([]),
    decide: -1,
    winner: "",
  },
  {
    label: "2/3에서 갈림",
    summary: "342 vs 341 → A, slot은 B가 더 높음",
    note: "A는 342/512로 3×342=1,026≥1,024라 2/3 이상이고, B는 341/512로 1,023<1,024라 미달입니다. B의 attested slot 8,200(가정)이 A의 8,192보다 높아도 첫 칸에서 A가 이깁니다. Best update가 가장 높은 slot과 같지 않은 이유입니다.",
    rungs: rungs([["342 이상", "341 미달"]]),
    decide: 0,
    winner: "A",
  },
  {
    label: "둘 다 미달",
    summary: "300 vs 320 → B",
    note: "두 후보가 모두 2/3 아래(가정: 300과 320)이면 참여가 많은 쪽을 고릅니다. 둘째 칸에서 B가 이기므로 아래 기준은 비교하지 않습니다.",
    rungs: rungs([["300 미달", "320 미달"], ["300", "320"]]),
    decide: 1,
    winner: "B",
  },
  {
    label: "Attested slot",
    summary: "8,192 vs 8,200 → A (더 오래된 쪽)",
    note: "두 후보가 2/3 이상이고 next committee·finality·참여 수까지 같다고 가정합니다. 그러면 더 오래된 attested slot을 선호해 8,192인 A가 남습니다. 같은 품질의 후보가 계속 바뀌는 일을 줄이려는 tie-break입니다.",
    rungs: rungs([["342 이상", "342 이상"], [DASH, DASH], SAME, SAME, SAME, ["342", "342"], ["8,192", "8,200"]]),
    decide: 6,
    winner: "A",
  },
  {
    label: "Signature slot",
    summary: "8,193 vs 8,194 → A (더 이른 쪽)",
    note: "Attested slot까지 8,192로 같다면(가정) 더 이른 signature slot을 선호합니다. 8,193인 A가 남습니다. 이 순서는 보존할 light-client 후보를 고를 뿐 full node의 canonical chain fork choice가 아닙니다.",
    rungs: rungs([["342 이상", "342 이상"], [DASH, DASH], SAME, SAME, SAME, ["342", "342"], ["8,192", "8,192"], ["8,193", "8,194"]]),
    decide: 7,
    winner: "A",
  },
];

const GRID = "grid grid-cols-[1.1rem_minmax(0,1fr)_3.9rem_3.9rem] items-center gap-x-1.5 sm:grid-cols-[1.4rem_minmax(0,1fr)_6rem_6rem] sm:gap-x-2";

function Ladder({ scene }: { scene: Scene }) {
  return (
    <div className="min-w-0" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      <div className={`${GRID} px-1.5 pb-1 text-[11px] font-bold text-muted-foreground`}>
        <span />
        <span>기준 (위부터)</span>
        <span className="text-center">후보 A</span>
        <span className="text-center">후보 B</span>
      </div>
      <div className="space-y-1">
        {scene.rungs.map((rung, i) => {
          const decided = i === scene.decide;
          const after = scene.decide >= 0 && i > scene.decide;
          const skippedSecond = i === 1 && scene.decide > 1;
          const muted = after || skippedSecond;
          return (
            <div
              key={rung.name}
              className={`${GRID} min-h-[1.85rem] rounded-md border px-1.5 ${
                decided ? "border-primary bg-primary/[0.06]" : "border-border bg-background"
              } ${muted ? "opacity-45" : ""}`}
            >
              <span className="text-center font-mono text-[11px] text-muted-foreground">{i + 1}</span>
              <span className="min-w-0 break-keep text-xs leading-4">
                {rung.name}
                {after && <span className="ml-1 text-[10px] text-muted-foreground">(안 봄)</span>}
                {skippedSecond && <span className="ml-1 text-[10px] text-muted-foreground">(건너뜀)</span>}
              </span>
              {(["a", "b"] as const).map((side) => {
                const win = decided && scene.winner === (side === "a" ? "A" : "B");
                return (
                  <span
                    key={side}
                    className={`rounded-sm py-0.5 text-center font-mono text-[11px] leading-4 ${
                      win ? "border border-primary font-black text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {after ? DASH : rung[side]}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BestUpdateLadderViz() {
  return (
    <UpdateSceneShell
      eyebrow="Best update 순서"
      title="두 후보는 위 칸부터 비교하고, 처음 갈리는 칸이 승자를 정합니다"
      description="Committee position 512개 예시입니다. 342·341은 본문의 2/3 경계 수치이고, 나머지 참여 수와 slot은 비교 순서를 보이려는 가정입니다. 테두리 친 값이 선택된 후보, 흐린 칸은 비교하지 않은 기준입니다."
      ariaLabel="검증된 light-client update 두 개를 2/3 여부부터 signature slot까지 차례로 비교하는 순서"
      scenes={SCENES}
      render={(active) => <Ladder scene={SCENES[active]} />}
    />
  );
}
