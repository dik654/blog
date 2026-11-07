import SceneShell from "./SceneShell";

/**
 * 본문 대응: #vote-handling — A 40, B 35, C 25. +2/3는 100×2/3≈66.7 초과.
 * A+B=75 통과, B+C=60 미달(가정), 갈린 표는 BlockID별 집계. 다른 round도 합치지 않는다.
 */
const THRESHOLD = (100 * 2) / 3;
const COLOR: Record<string, string> = { A: "#334155", B: "#475569", C: "#64748b" };
const POWER: Record<string, number> = { A: 40, B: 35, C: 25 };

interface Bucket {
  name: string;
  voters: readonly string[];
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  buckets: readonly Bucket[];
  call: string;
  passed: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "A의 prevote", summary: "B41 40/100", buckets: [{ name: "h41/r1/prevote · B41", voters: ["A"] }], call: "문턱 아래 · 다음 함수 호출 없음", passed: false, note: "A 혼자서는 40이라 문턱에 못 미칩니다. +2/3는 전체 power 100의 3분의 2(약 66.7)를 넘는다는 뜻입니다." },
  { label: "B의 prevote 추가", summary: "40 + 35 = 75", buckets: [{ name: "h41/r1/prevote · B41", voters: ["A", "B"] }], call: "enterPrecommit 호출", passed: true, note: "B의 prevote가 더해지는 순간 75가 됩니다. 현재 round이고 proposal이 완성됐다면 addVote는 count만 돌려주지 않고 enterPrecommit을 호출합니다." },
  { label: "precommit 75", summary: "enterCommit → block bytes 확인", buckets: [{ name: "h41/r1/precommit · B41", voters: ["A", "B"] }], call: "enterCommit · bytes까지 있어야 tryFinalizeCommit", passed: true, note: "Commit certificate(+2/3 precommit 증거)가 있어도 block bytes가 없으면 즉시 실행하지 않고 받을 block 조각 틀(expected PartSet)을 설정해 먼저 받습니다. 증거와 data를 모두 가져야 다음 높이로 갑니다." },
  { label: "두 명이라도", summary: "B + C = 60 (가정)", buckets: [{ name: "같은 BlockID (가정)", voters: ["B", "C"] }], call: "문턱 아래", passed: false, note: "A와 B 두 명은 75로 넘지만, B와 C 두 명이라면 60으로 못 넘습니다. 이 조합은 비교를 위한 가정입니다. 세는 것은 사람 수가 아니라 power입니다." },
  { label: "표가 갈리면", summary: "B41 40 · nil 35 (가정)", buckets: [{ name: "B41", voters: ["A"] }, { name: "nil", voters: ["B"] }], call: "둘 다 문턱 아래 · C는 absent(표 없음)", passed: false, note: "서명한 power를 다 더하면 75지만 Commit이 아닙니다. 같은 BlockID에 모인 power만 세므로 nil과 absent를 B41에 더하지 않습니다. 표 배분은 가정입니다." },
  { label: "round가 다르면", summary: "r0 nil 75 · r1 B41 75", buckets: [{ name: "h41/r0/prevote · nil", voters: ["A", "B"] }, { name: "h41/r1/prevote · B41", voters: ["A", "B"] }], call: "각각 집계 · 합치지 않음", passed: true, note: "같은 A와 B의 표라도 round 0의 nil과 round 1의 B41은 다른 VoteSet입니다. 각 칸이 따로 문턱을 넘습니다." },
];

function Bar({ bucket }: { bucket: Bucket }) {
  const total = bucket.voters.reduce<number>((sum, voter) => sum + POWER[voter], 0);
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
        <span className="min-w-0 break-keep font-mono text-muted-foreground">{bucket.name}</span>
        <strong className="shrink-0 font-mono">{total}/100</strong>
      </div>
      <div className="relative h-8 rounded-sm bg-muted/60">
        <div className="flex h-full overflow-hidden rounded-sm">
          {bucket.voters.map((voter) => (
            <span key={voter} className="flex h-full items-center justify-center border-r border-background text-xs font-bold text-white" style={{ width: `${POWER[voter]}%`, backgroundColor: COLOR[voter] }}>
              {voter} {POWER[voter]}
            </span>
          ))}
        </div>
        <span className="absolute -bottom-1 -top-1 border-l border-dashed border-foreground" style={{ left: `${THRESHOLD}%` }} />
      </div>
    </div>
  );
}

export default function PowerThresholdViz() {
  return (
    <SceneShell
      eyebrow="A 40 · B 35 · C 25"
      title="같은 BlockID에 모인 power가 2/3 선을 넘어야 합니다"
      description="막대 전체가 voting power 100이고 점선이 2/3입니다. Validator와 power는 이 글의 설명용 예시입니다."
      ariaLabel="validator power가 문턱을 넘는 조합과 넘지 못하는 조합"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            {scene.buckets.map((bucket) => (
              <Bar key={bucket.name} bucket={bucket} />
            ))}
            <div className={`rounded-lg border px-2 py-2 text-center text-xs font-bold sm:text-sm ${scene.passed ? "border-amber-600 text-amber-700 dark:text-amber-400" : "border-dashed border-border text-muted-foreground"}`}>{scene.call}</div>
          </div>
        );
      }}
    />
  );
}
