import SceneShell from "./SceneShell";

/**
 * 본문 대응: #contract — validateTransaction → accumulateAndNullifyTransaction → insertLeaves.
 * require가 하나라도 실패하면 EVM transaction 전체가 revert되어 부분 성공이 남지 않아야 한다.
 * 같은 N₂₃을 다시 내면 첫 require에서 "Note already spent"로 거절된다.
 */
type Mark = "wait" | "pass" | "fail" | "skip";

interface Scene {
  label: string;
  summary: string;
  note: string;
  checks: readonly [Mark, Mark, Mark, Mark];
  nullifier: "false" | "true" | "true→revert";
  leaves: "none" | "added" | "revert";
  wallet: "same" | "lag";
}

const SCENES: readonly Scene[] = [
  {
    label: "먼저 검사만 합니다",
    summary: "validateTransaction",
    note: "gas price 조건, adapt sender, 현재 EVM chain ID를 확인하고, 이어서 historical root, unshield와 암호문 배열 길이, proof를 검사합니다. 오른쪽의 nullifier와 tree는 아직 그대로입니다.",
    checks: ["pass", "pass", "wait", "wait"],
    nullifier: "false",
    leaves: "none",
    wallet: "same",
  },
  {
    label: "사용 표시를 남깁니다",
    summary: "N₂₃: false → true",
    note: "accumulateAndNullifyTransaction이 N₂₃이 아직 없음을 require로 확인한 뒤 사용됨으로 기록하고, 새 commitment C₆·C₄와 암호문을 모읍니다.",
    checks: ["pass", "pass", "pass", "wait"],
    nullifier: "true",
    leaves: "none",
    wallet: "same",
  },
  {
    label: "새 leaf를 넣습니다",
    summary: "insertLeaves(C₆, C₄)",
    note: "모든 검사가 끝난 뒤 insertLeaves가 tree를 갱신합니다. 같은 EVM transaction 안에서 N₂₃ 기록과 두 leaf 추가가 함께 남습니다.",
    checks: ["pass", "pass", "pass", "pass"],
    nullifier: "true",
    leaves: "added",
    wallet: "same",
  },
  {
    label: "중간 실패 (가정)",
    summary: "revert → 둘 다 원래대로",
    note: "N₂₃을 기록한 뒤 이어지는 require 하나가 실패했다고 가정합니다. EVM transaction 전체가 revert되므로 N₂₃ 기록도 되돌려지고 leaf도 들어가지 않습니다. nullifier만 남거나 commitment만 들어가는 부분 성공은 없어야 합니다.",
    checks: ["pass", "pass", "pass", "skip"],
    nullifier: "true→revert",
    leaves: "revert",
    wallet: "same",
  },
  {
    label: "같은 N₂₃을 다시 낼 때",
    summary: "Note already spent",
    note: "‘새 leaf를 넣습니다’ 장면이 성공한 뒤 같은 N₂₃을 다시 제출하면 proof가 같아도 첫 require가 nullifiers[treeNumber][N₂₃]이 이미 true인 것을 보고 거절합니다. 같은 note의 두 번째 사용이 여기서 막힙니다.",
    checks: ["pass", "pass", "fail", "skip"],
    nullifier: "true",
    leaves: "added",
    wallet: "same",
  },
  {
    label: "Wallet mirror는 별도 (가정)",
    summary: "on-chain ≠ 로컬 잔액",
    note: "On-chain 상태는 ‘새 leaf를 넣습니다’ 장면 그대로입니다. Wallet이 event를 중간까지만 읽었다고 가정하면 로컬 잔액이 이 상태와 다르게 보일 수 있습니다. 이 문제는 계약의 원자성으로 막는 것이 아니라 wallet이 event를 다시 읽어 맞춰야 합니다.",
    checks: ["pass", "pass", "pass", "pass"],
    nullifier: "true",
    leaves: "added",
    wallet: "lag",
  },
];

const CHECKS = [
  ["gas price · adapt sender · chain ID", "validateTransaction"],
  ["historical root · 배열 길이 · proof", "validateTransaction"],
  ["N₂₃ 미사용 확인 → 기록", "accumulateAndNullify"],
  ["C₆·C₄ tree 추가", "insertLeaves"],
] as const;

const MARK_TEXT: Record<Mark, string> = { wait: "대기", pass: "통과", fail: "실패", skip: "실행 안 됨" };
const MARK_TONE: Record<Mark, string> = {
  wait: "border-border text-muted-foreground",
  pass: "border-emerald-600/60 text-emerald-700 dark:text-emerald-400",
  fail: "border-red-600 bg-red-600/[0.06] text-red-700 dark:text-red-400",
  skip: "border-dashed border-border text-muted-foreground",
};

export default function ContractCommitViz() {
  return (
    <SceneShell
      eyebrow="계약의 상태 변경"
      title="검사가 모두 끝나야 nullifier와 새 leaf가 함께 남습니다"
      description="왼쪽은 계약이 차례로 지나가는 검사, 오른쪽은 남는 on-chain 상태입니다. revert는 실패한 EVM transaction이 바꾼 상태를 모두 되돌립니다."
      note="tree 0·leaf 23·N₂₃·C₆·C₄는 이 글의 설명용 값입니다. 실패와 wallet 지연 장면은 경계를 보이려는 가정입니다."
      ariaLabel="Railgun 계약의 검사 순서, revert, 재제출 거절과 wallet mirror 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const reverted = scene.nullifier === "true→revert";
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <ol className="min-w-0 space-y-1.5">
              {CHECKS.map(([what, fn], index) => {
                const mark = scene.checks[index];
                return (
                  <li key={what} className={`grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-2 rounded-md border px-2 py-1.5 ${MARK_TONE[mark]}`}>
                    <span className="min-w-0">
                      <span className="block break-keep text-xs font-semibold text-foreground">{index + 1}. {what}</span>
                      <span className="block font-mono text-[10px] text-muted-foreground">{fn}</span>
                    </span>
                    <span className="text-right text-xs font-bold">{MARK_TEXT[mark]}</span>
                  </li>
                );
              })}
              <li className={`rounded-md border px-2 py-1.5 text-xs font-semibold ${reverted ? "border-red-600 text-red-700 dark:text-red-400" : active === 4 ? "border-red-600 text-red-700 dark:text-red-400" : "border-border/50 text-muted-foreground"}`}>
                {reverted ? "N₂₃ 기록 뒤 require 실패 → 전체 revert" : active === 4 ? "require(!nullifiers[0][N₂₃]) → ‘Note already spent’" : "revert 없음"}
              </li>
            </ol>

            <div className="min-w-0 space-y-2">
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="font-mono text-[10px] font-bold text-muted-foreground">nullifiers[0][N₂₃]</span>
                <strong className={`mt-1 block font-mono text-sm ${reverted ? "text-red-700 dark:text-red-400" : scene.nullifier === "true" ? "text-primary" : ""}`}>
                  {reverted ? <><span className="line-through">true</span> → false</> : scene.nullifier}
                </strong>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="font-mono text-[10px] font-bold text-muted-foreground">commitment tree 0</span>
                <div className="mt-1.5 flex flex-wrap gap-1 font-mono text-[11px]">
                  <span className="rounded border border-border px-1.5 py-0.5 text-muted-foreground">… C₁₀ (leaf 23) …</span>
                  {(["C₆", "C₄"] as const).map((leaf) => (
                    <span
                      key={leaf}
                      className={`rounded border px-1.5 py-0.5 ${
                        scene.leaves === "added" ? "border-primary text-primary" : scene.leaves === "revert" ? "border-dashed border-red-600 text-red-700 line-through dark:text-red-400" : "border-dashed border-border text-muted-foreground"
                      }`}
                    >
                      {leaf}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`rounded-lg border p-3 ${scene.wallet === "lag" ? "border-amber-600" : "border-border/60"}`}>
                <span className="font-mono text-[10px] font-bold text-muted-foreground">wallet mirror (로컬 사본)</span>
                <span className={`mt-1 block text-xs ${scene.wallet === "lag" ? "font-semibold text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>
                  {scene.wallet === "lag" ? "event 일부 누락 → 잔액이 on-chain과 다를 수 있음" : "on-chain event를 따라 읽음"}
                </span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
