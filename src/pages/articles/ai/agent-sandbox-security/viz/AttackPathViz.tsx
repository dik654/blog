import SceneShell from "./SceneShell";

/**
 * 본문 대응: #attack-path — 경로의 edge availability a(e)를 곱하면 0/1 AND가 되고,
 * 완성 경로가 하나라도 있으면 impact가 reachable이다.
 * 경로 A = 본문 예(metadata IP → token 응답 → control-plane write → 외부 POST).
 * 경로 B = 해석 문장의 "mounted secret을 읽는 다른 경로". B의 나머지 edge는 본문에 없어 열림으로 가정한다.
 */
type Gate = 0 | 1 | null;

interface PathRow {
  name: string;
  edges: readonly string[];
}

const PATHS: readonly PathRow[] = [
  { name: "경로 A", edges: ["metadata route · token 응답", "control-plane write 권한", "외부 POST"] },
  { name: "경로 B", edges: ["mounted secret 읽기", "나머지 edge (가정)"] },
];

const SCENES = [
  {
    label: "경로 후보 모으기",
    summary: "P_I = {경로 A, 경로 B}",
    note: "Signal s에서 impact I까지 갈 수 있는 경로 후보를 모읍니다. Edge e마다 a(e)는 현재 정책에서 가능하면 1, 차단되면 0입니다. 아직 확인 전이라 ?로 둡니다.",
    gates: [[null, null, null], [null, null]] as const,
    verdict: "아직 판정 전",
  },
  {
    label: "경로 A의 곱",
    summary: "A(p_A) = 1·1·1 = 1",
    note: "Metadata IP 접근 신호가 있고 token 응답·control-plane write 권한·외부 POST가 모두 가능하면 곱이 1이 되어 credential theft 경로가 완성됩니다.",
    gates: [[1, 1, 1], [null, null]] as const,
    verdict: "reachable",
  },
  {
    label: "Metadata route 차단",
    summary: "A(p_A) = 0·1·1 = 0",
    note: "Edge 하나가 0이면 곱 전체가 0입니다. 곱은 확률이 아니라 0/1 gate의 AND 표기라서, 나머지 두 edge가 열려 있어도 경로 A는 impact까지 이어지지 않습니다.",
    gates: [[0, 1, 1], [null, null]] as const,
    verdict: "경로 B 확인 전",
  },
  {
    label: "다른 경로 다시 탐색",
    summary: "A(p_B) = 1·1 = 1 (가정)",
    note: "Mounted secret을 읽는 다른 경로가 남을 수 있습니다. 여기서는 경로 B의 edge가 모두 열려 있다고 가정했습니다. 완성 경로가 하나라도 있으면 reachable이므로 경로별로 끊고 다시 탐색합니다.",
    gates: [[0, 1, 1], [1, 1]] as const,
    verdict: "reachable",
  },
] as const;

function GateChip({ label, gate }: { label: string; gate: Gate }) {
  const tone =
    gate === 1
      ? "border-emerald-600/70 bg-emerald-500/10"
      : gate === 0
        ? "border-dashed border-red-600 bg-red-500/10"
        : "border-border";
  return (
    <div className={`flex min-w-0 items-baseline justify-between gap-3 rounded-lg border px-2 py-1 text-xs leading-5 sm:block sm:py-1.5 ${tone}`}>
      <span className="block min-w-0 break-words">{label}</span>
      <span className="block shrink-0 font-mono font-bold">a(e) = {gate === null ? "?" : gate}</span>
    </div>
  );
}

function ProductBadge({ value }: { value: string }) {
  return (
    <div
      className={`rounded-lg border px-2 py-1 text-center font-mono text-sm font-bold sm:py-2 ${
        value === "1" ? "border-emerald-600 text-emerald-700 dark:text-emerald-400" : value === "0" ? "border-red-600 text-red-700 dark:text-red-400" : "border-border text-muted-foreground"
      }`}
    >
      A = {value}
    </div>
  );
}

function product(gates: readonly Gate[]): string {
  if (gates.some((g) => g === null)) return "?";
  return String(gates.reduce<number>((acc, g) => acc * (g ?? 0), 1));
}

export default function AttackPathViz() {
  return (
    <SceneShell
      eyebrow="Edge availability AND"
      title="Edge 하나를 막으면 그 경로는 0이 되지만 다른 경로가 남을 수 있습니다"
      description="가로줄 하나가 signal s에서 impact I(예: credential theft)까지의 경로입니다. 칸 하나가 edge이고, 오른쪽 끝은 그 경로의 곱 A(p)입니다. 경로 B의 나머지 edge는 본문에 나오지 않아 열려 있다고 가정했습니다."
      ariaLabel="두 공격 경로의 edge availability 곱과 reachable 판정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="rounded-lg border border-border px-3 py-2 text-xs">
              <b>signal s</b> <span className="text-muted-foreground">처음 관찰한 file read·scan·request</span>
            </div>
            {PATHS.map((path, pi) => {
              const gates = (scene.gates as readonly (readonly Gate[])[])[pi];
              const value = product(gates);
              return (
                <div key={path.name} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 sm:hidden">
                    <span className="text-xs font-bold">{path.name}</span>
                    <ProductBadge value={value} />
                  </div>
                  <div className="grid items-center gap-2 sm:grid-cols-[3.25rem_minmax(0,1fr)_4.25rem]">
                    <span className="hidden text-xs font-bold sm:block">{path.name}</span>
                    <div className="grid min-w-0 grid-cols-1 gap-1.5 sm:grid-cols-3">
                      {[0, 1, 2].map((slot) =>
                        slot < path.edges.length ? (
                          <GateChip key={slot} label={path.edges[slot]} gate={gates[slot]} />
                        ) : (
                          <div key={slot} aria-hidden className="hidden sm:block" />
                        ),
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <ProductBadge value={value} />
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              className={`rounded-lg border px-3 py-2 text-xs ${
                scene.verdict === "reachable" ? "border-red-600 bg-red-500/10" : "border-border"
              }`}
            >
              <b>impact I</b>{" "}
              <span className="font-mono">
                reachable(I) = {scene.verdict === "reachable" ? "참 · 완성 경로 있음" : scene.verdict}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
