import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison(9절) 첫 문단 — node 8개에 top-8을 독립 균등 배정한다고 단순화하면
 * 방문 node 기대 개수는 8×(1−(7/8)⁸) ≈ 5.251이다. 같은 node의 expert들이 입력 한 벌을 공유하면
 * node 간 입력 복사 수가 8보다 작아질 수 있고, node 4개 이내로 제한하면 상한이 4가 된다.
 * (7/8)⁸ = 0.3436…, 1 − 0.3436 = 0.6564, 8 × 0.6564 = 5.2511.
 * 한 token의 실제 배정 예 두 개는 설명용 가정이다.
 */
const NODES = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const FREE_PICK = [0, 2, 2, 5, 1, 5, 7, 2] as const;
const LIMITED_PICK = [0, 2, 2, 5, 1, 5, 2, 0] as const;
const MISS = Math.pow(7 / 8, 8);
const HIT = 1 - MISS;
const EXPECTED = 8 * HIT;

const SCENES = [
  { label: "공유 없이 · expert마다 한 벌", summary: "입력 복사 8벌", note: "top-8이면 expert 8개를 고릅니다. expert마다 따로 보내면 같은 node로 가도 8벌입니다." },
  { label: "같은 node는 한 벌만", summary: "이 예: node 5곳 → 5벌", note: "같은 node의 expert들이 한 벌을 나눠 쓸 수 있다면 node마다 한 번이면 됩니다. 이 예(가정)는 8벌이 5벌로 줍니다." },
  { label: "한 node가 빠질 확률", summary: "(7/8)⁸ ≈ 0.344", note: "선택 하나가 node 3을 비켜 갈 확률은 7/8입니다. 독립인 선택 8번이 모두 비켜 가야 하므로 7/8을 8번 곱합니다." },
  { label: "기대 방문 node 수", summary: "8 × 0.656 ≈ 5.251", note: "각 node가 한 번 이상 방문될 확률은 0.656입니다. node 8개에 더하면 기대 방문 수, 곧 공유 시 기대 복사 수 5.251입니다." },
  { label: "node 4개 이내로 제한", summary: "복사 상한 4벌", note: "node 4개 안으로 묶으면 복사는 많아야 4벌입니다(이 예는 node 0·1·2·5). 선택 자유가 준 만큼 품질은 따로 검증합니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const MUTED = "#94a3b8";

export default function NodeVisitViz() {
  return (
    <SceneShell
      eyebrow="Node 공유"
      title="독립 균등으로 단순화하면 expert 8개를 골라도 방문 node는 기대값 5.251곳입니다"
      description="node는 GPU 여러 장을 묶은 서버 한 대입니다. 상자 안의 점이 그 node에서 고른 expert 수이며, 점의 배치는 설명용 가정입니다. 복사 수는 목적 node마다 1벌로 세고, token이 원래 있던 node인지는 구분하지 않습니다."
      note="실제 routing은 균등하지도 독립이지도 않을 수 있으며, 5.251은 이 단순화 아래의 기대값입니다."
      ariaLabel="top-8 expert 선택이 node 8개에 퍼질 때 방문 node 수와 입력 복사 수"
      scenes={SCENES}
      render={(active) => {
        const picks: readonly number[] = active === 4 ? LIMITED_PICK : FREE_PICK;
        const showProb = active === 2 || active === 3;
        const visited = new Set(picks);
        const copies = active === 0 ? 8 : active >= 2 && active <= 3 ? null : visited.size;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-1.5">
              {NODES.map((n) => {
                const count = picks.filter((p) => p === n).length;
                const focus = active === 2 && n === 3;
                const hit = !showProb && count > 0;
                return (
                  <div
                    key={n}
                    className="min-w-0 rounded-md border px-1.5 py-1.5"
                    style={{ borderColor: focus ? AMBER : hit ? BLUE : undefined, borderStyle: hit || focus ? "solid" : "dashed" }}
                  >
                    <p className="text-[11px] font-bold">node {n}</p>
                    <div className="mt-1 flex h-4 items-center gap-0.5">
                      {showProb ? (
                        <span className="font-mono text-[11px]" style={{ color: focus ? AMBER : active === 3 ? BLUE : MUTED }}>
                          {active === 3 ? `방문 ${HIT.toFixed(3)}` : focus ? `빠짐 ${MISS.toFixed(3)}` : "·"}
                        </span>
                      ) : (
                        Array.from({ length: count }, (_, k) => <span key={k} className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: BLUE }} />)
                      )}
                    </div>
                    <p className="mt-1 h-4 font-mono text-[10px] text-muted-foreground">
                      {!showProb && count > 0 ? (active === 0 ? `${count}벌` : "1벌") : ""}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex min-h-[2.5rem] flex-wrap items-center gap-1 font-mono text-xs">
              {active === 2 ? (
                <>
                  {Array.from({ length: 8 }, (_, k) => (
                    <span key={k} className="rounded-sm border px-1" style={{ borderColor: AMBER, color: AMBER }}>
                      7/8
                    </span>
                  ))}
                  <span className="font-bold">= {MISS.toFixed(3)}</span>
                </>
              ) : active === 3 ? (
                <span className="font-bold">
                  0.656 × 8 node = {EXPECTED.toFixed(3)} (기대 입력 복사)
                </span>
              ) : (
                <span className="font-bold">
                  node 간 입력 복사 {copies}벌{active === 4 ? " · 상한 4" : ""}
                </span>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
