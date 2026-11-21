import SceneShell from "./SceneShell";

/**
 * 본문 대응: #peer-scoring "합계와 bad 판정이 따로 있는 이유".
 * 장면 1: 앞 식의 예시 — bad -3.3333×0.3=-1.0000, block ×0.0=0, status 0.9×0.3=0.27, gossip -2×0.4=-0.8, 합 -1.53.
 * 장면 2: aggregate가 좋다고 가정한 경우에도 wrong fork 같은 peer status 오류는 IsBadPeer에서 따로 걸린다.
 */
const ROWS = [
  { name: "bad response", sub: "−3.3333", weight: "0.3", value: -1.0, color: "#dc2626" },
  { name: "block provider", sub: "값과 무관", weight: "0.0", value: 0, color: "#94a3b8" },
  { name: "peer status", sub: "0.9", weight: "0.3", value: 0.27, color: "#16a34a" },
  { name: "gossip", sub: "−2", weight: "0.4", value: -0.8, color: "#d97706" },
] as const;

const TOTAL = Math.round(ROWS.reduce<number>((sum, row) => sum + row.value, 0) * 10000) / 10000;
const SCALE = 1.6;

const CHECKS = [
  { name: "bad response threshold", hit: false },
  { name: "peer status 오류: wrong fork · invalid finalized root · invalid request", hit: true },
  { name: "gossip threshold (기능이 켜졌을 때)", hit: false },
] as const;

const SCENES = [
  {
    label: "가중치를 곱해 더함",
    summary: `S = −1 + 0 + 0.27 − 0.8 = ${TOTAL}`,
    note: "앞 식의 예시 N42입니다. 하위 점수에 가중치를 곱한 몫만 합계에 들어갑니다. block provider는 기록이 있어도 기본 가중치 0이라 막대가 없습니다. 합계 −1.53은 피어 운영 판단용 신호이며 합의 투표 가중치가 아닙니다.",
  },
  {
    label: "terminal 오류는 따로",
    summary: "aggregate가 좋아도 IsBadPeer = bad",
    note: "이번에는 aggregate가 좋은 값이라고 가정한 다른 상황입니다. IsBadPeer는 합계를 보지 않고 세 검사를 따로 확인하므로(scorers/service.go의 IsBadPeerNoLock은 ScoreNoLock을 호출하지 않습니다), Status가 wrong fork를 보냈다면 좋은 합계로 상쇄되지 않고 bad가 됩니다.",
  },
] as const;

function Contribution({ row }: { row: (typeof ROWS)[number] }) {
  const width = (Math.abs(row.value) / SCALE) * 50;
  const left = row.value < 0 ? 50 - width : 50;
  return (
    <div className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs">
      <span className="min-w-0 break-keep leading-4">
        <span className="block font-semibold">{row.name}</span>
        <span className="block font-mono text-[10px] text-muted-foreground">
          {row.sub} × {row.weight}
        </span>
      </span>
      <div className="relative h-4 min-w-0">
        <div className="absolute inset-y-0 left-1/2 w-px bg-slate-400" />
        {row.value !== 0 && <div className="absolute inset-y-0 rounded-sm" style={{ left: `${left}%`, width: `${width}%`, backgroundColor: row.color }} />}
      </div>
      <span className="text-right font-mono">{row.value === 0 ? "0" : `${row.value > 0 ? "+" : "−"}${Math.abs(row.value).toFixed(2)}`}</span>
    </div>
  );
}

export default function ScoreVsBadPeerViz() {
  return (
    <SceneShell
      eyebrow="합계와 bad 판정"
      title="합계 점수와 bad 판정은 서로 다른 길로 계산됩니다"
      description="첫 장면의 막대는 하위 점수 × 가중치이며 가운데 세로선이 0입니다. 둘째 장면은 bad peer 여부를 정하는 IsBadPeer가 합계와 별개로 세 검사를 확인하는 모습입니다."
      note="가중치 0.3·0.0·0.3·0.4는 Prysm v7.3.1 기본값입니다. status 0.9, gossip −2와 둘째 장면의 ‘좋은 합계’는 설명용 가정입니다."
      ariaLabel="peer score 가중 합계와 별도 IsBadPeer 검사 비교"
      scenes={SCENES}
      render={(active) =>
        active === 0 ? (
          <div className="min-h-[13.5rem] min-w-0 space-y-2.5">
            {ROWS.map((row) => (
              <Contribution key={row.name} row={row} />
            ))}
            <div className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3.5rem] items-center gap-2 border-t border-border pt-2.5 text-xs">
              <span className="font-bold">합계 S</span>
              <div className="relative h-4 min-w-0">
                <div className="absolute inset-y-0 left-1/2 w-px bg-slate-400" />
                <div className="absolute inset-y-0 rounded-sm bg-[#2563eb]" style={{ left: `${50 - (Math.abs(TOTAL) / SCALE) * 50}%`, width: `${(Math.abs(TOTAL) / SCALE) * 50}%` }} />
              </div>
              <span className="text-right font-mono font-bold">−{Math.abs(TOTAL).toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <div className="grid min-h-[13.5rem] min-w-0 gap-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="rounded-lg border border-dashed border-border p-3">
              <p className="text-xs font-bold">aggregate S</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">좋은 값이라고 가정</p>
              <p className="mt-3 text-[11px] leading-5 text-muted-foreground">IsBadPeer는 이 합계로 판정하지 않습니다.</p>
            </div>
            <div className="rounded-lg border border-[#dc2626] p-3">
              <p className="text-xs font-bold">IsBadPeer의 별도 검사</p>
              <ul className="mt-2 space-y-1.5">
                {CHECKS.map((check) => (
                  <li key={check.name} className={`flex gap-2 text-[11px] leading-5 ${check.hit ? "font-semibold text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>
                    <span className="font-mono">{check.hit ? "✕" : "·"}</span>
                    <span className="min-w-0 break-keep">
                      {check.name}
                      {check.hit && " ← Status가 wrong fork (가정)"}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-bold text-red-700 dark:text-red-400">결과: bad peer · 좋은 합계로 상쇄 안 됨</p>
            </div>
          </div>
        )
      }
    />
  );
}
