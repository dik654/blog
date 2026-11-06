import SceneShell from "./SceneShell";

/**
 * 본문 대응: #node-envelope — 여섯 입력을 묶은 G를 두 node가 비교한다. 하나라도 다르면 새 generation.
 * 값 91342, op-node v1.19.5, op-reth v2.3.3은 본문. G₁·G₂는 실제 digest가 아닌 설명용 이름.
 */
const ROWS = [
  { key: "chain", name: "chain ID", base: "91342", other: "91342" },
  { key: "genesis", name: "genesis(시작 상태)", base: "같은 파일", other: "같은 파일" },
  { key: "rollup", name: "rollup config", base: "기준 규칙", other: "다른 규칙" },
  { key: "l1", name: "L1 원천", base: "Sepolia", other: "Sepolia" },
  { key: "node", name: "op-node", base: "v1.19.5", other: "이전 버전" },
  { key: "reth", name: "op-reth", base: "v2.3.3", other: "v2.3.3" },
] as const;

const SCENES = [
  { label: "여섯 칸이 모두 같습니다", summary: "G₁ = G₁ · 같은 세대", diff: "", digest: "G₁", note: "같은 세대라고 말할 수 있습니다. 다만 digest가 같아도 L1 endpoint의 정직성이나 binary의 무결점까지 증명하지는 않습니다." },
  { label: "rollup config만 다릅니다", summary: "G₁ ≠ G₂ · 새 세대", diff: "rollup", digest: "G₂", note: "Chain ID와 genesis가 같아도 L1 batch를 L2 payload로 바꾸는 규칙이 다르면 새 generation입니다. Process health나 chain 이름으로는 가릴 수 없습니다." },
  { label: "op-node 버전만 다릅니다", summary: "G₁ ≠ G₂ · 새 세대", diff: "node", digest: "G₂", note: "이전 op-node는 Glamsterdam 뒤 추가된 L1 header를 검증하지 못해 derivation(L1에서 payload 재구성)이 멈추고 safe·finalized head가 멈출 수 있습니다." },
] as const;

export default function GenerationCompareViz() {
  return (
    <SceneShell
      eyebrow="두 node 비교"
      title="여섯 입력 중 한 칸만 달라도 다른 세대입니다"
      description="왼쪽은 기준 node, 오른쪽은 비교할 node입니다. G₁·G₂는 입력을 해시한 지문(digest)에 붙인 설명용 이름입니다."
      ariaLabel="기준 node와 비교 node의 여섯 입력을 한 칸씩 대조해 generation digest를 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="text-xs">
            <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-2 gap-y-0.5">
              <span />
              <span className="font-bold">기준 node</span>
              <span className="font-bold">비교 node</span>
              {ROWS.map((row) => {
                const differs = scene.diff === row.key;
                return (
                  <div key={row.key} className="contents">
                    <span className="self-center break-keep text-muted-foreground">{row.name}</span>
                    <span className="rounded border border-border/70 bg-background px-2 py-0.5">{row.base}</span>
                    <span className={`rounded border px-2 py-0.5 ${differs ? "border-red-600 font-bold text-red-700 dark:text-red-400" : "border-border/70 bg-background"}`}>
                      {differs ? `${row.other} ≠` : row.base}
                    </span>
                  </div>
                );
              })}
              <span className="mt-1 self-center font-bold">digest G</span>
              <span className="mt-1 rounded border border-primary px-2 py-0.5 font-mono font-bold text-primary">G₁</span>
              <span className={`mt-1 rounded border px-2 py-0.5 font-mono font-bold ${scene.diff ? "border-red-600 text-red-700 dark:text-red-400" : "border-primary text-primary"}`}>{scene.digest}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
