import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 둘째·셋째 문단 — 포겔(1964)의 반사실 추정과 피시로(1965)의 다른 질문.
 * 포겔: 실제 경제 vs 철도 없이 다른 운송수단이 대신한 가상 경제 → 철도가 GNP 성장에 준 효과 3% 미만.
 * 피시로: 1860년 이전에도 순수익·운송비 절감만으로 투자 정당화, 수익 = 투자액의 연 15%.
 *   운하·증기선이 먼저 운송비를 크게 낮춰 1859년 이전 철도의 직접 이득은 크지 않음.
 * 두 계산 모두 노선이 지나간 땅을 누가 잃었는지는 담지 않습니다.
 */
const SCENES = [
  { label: "포겔 · 1964", summary: "실제 경로 − 가상 경로 = 3% 미만", note: "포겔은 철도가 없었다면 다른 운송수단이 그 일을 대신했을 가상의 경제를 세워 실제 경로와 비교했습니다. 일어나지 않은 경로를 기준으로 삼는 이 계산이 반사실 추정입니다. 두 경로의 차이, 곧 철도가 GNP 성장에 준 효과를 그는 3% 미만으로 계산했습니다." },
  { label: "피시로 · 1965 ①", summary: "철도 투자 수익 = 연 15%", note: "피시로는 질문을 바꿔 철도가 얼마나 큰 자극을 어떤 경로로 줬는지 물었습니다. 1860년 이전에도 순수익과 운송비 절감만으로 투자가 정당화됐고, 그 수익이 투자액의 연 15%였다는 것이 그의 결론입니다. 투자 100이면 해마다 15라는 뜻입니다(100은 가정)." },
  { label: "피시로 · 1965 ②", summary: "운하·증기선이 먼저 낮춤", note: "동시에 피시로는 운하와 증기선이 먼저 운송비를 크게 낮춰 놓았기 때문에 1859년 이전 철도의 직접 이득은 크지 않았다고 봤습니다. 철도가 들어온 시점에 운송비는 이미 내려가 있었다는 순서가 이 판단의 근거입니다." },
  { label: "두 계산에 없는 것", summary: "노선이 지나간 땅을 누가 잃었나", note: "두 계산 모두 철도가 성장을 혼자 만들었다는 말을 받치지 않습니다. 그리고 노선이 지나간 땅을 누가 잃었는지는 어느 계산에도 들어 있지 않습니다." },
] as const;

function dim(on: boolean) {
  return `transition-opacity duration-300 motion-reduce:transition-none ${on ? "opacity-100" : "opacity-35"}`;
}

export default function RailroadCounterfactualViz() {
  return (
    <SceneShell
      eyebrow="철도의 몫을 재는 두 방법"
      title="포겔은 철도 없는 가상 경제와 비교했고, 피시로는 수익과 경로를 물었습니다"
      description="위 갈래 그림이 포겔의 반사실 추정, 가운데 칸이 피시로의 계산, 맨 아래 점선 칸이 두 계산 밖에 남은 질문입니다. 갈래 그림의 길이와 각도는 설명용이며 크기를 뜻하지 않습니다(가정)."
      ariaLabel="포겔의 반사실 추정, 피시로의 철도 투자 수익과 운하 효과, 두 계산이 담지 않은 토지 상실"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className={`rounded-lg border px-3 py-2 ${active === 0 ? "border-primary" : "border-border"} ${dim(active === 0)}`}>
            <p className="text-xs font-bold">포겔: 일어나지 않은 경로와 비교</p>
            <svg viewBox="0 0 340 112" className="mt-1 h-auto w-full max-w-[520px]" role="img" aria-label="같은 출발점에서 실제 경제와 철도 없는 가상 경제로 갈라지는 두 경로, 그 차이는 GNP 성장의 3% 미만">
              <circle cx={18} cy={56} r={4} fill="#64748b" />
              <text x={18} y={78} textAnchor="middle" fontSize={11} fill="#64748b">출발</text>
              <line x1={22} y1={54} x2={120} y2={20} stroke="#2563eb" strokeWidth={1.25} />
              <line x1={22} y1={58} x2={120} y2={92} stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
              <circle cx={122} cy={20} r={4} fill="#2563eb" />
              <circle cx={122} cy={92} r={4} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
              <text x={132} y={24} fontSize={12} fontWeight={700} fill="#2563eb">실제 경제 · 철도 있음</text>
              <text x={132} y={96} fontSize={12} fill="#64748b">가상 경제 · 다른 운송수단이 대신</text>
              <line x1={122} y1={28} x2={122} y2={84} stroke="#d97706" strokeWidth={1} strokeDasharray="2 2" />
              <text x={132} y={54} fontSize={11} fill="#64748b">차이 = 철도가 GNP 성장에 준 효과</text>
              <text x={132} y={69} fontSize={13} fontWeight={700} fill="#d97706">3% 미만</text>
            </svg>
          </div>
          <div className={`rounded-lg border px-3 py-2 ${active === 1 || active === 2 ? "border-primary" : "border-border"} ${dim(active === 1 || active === 2)}`}>
            <p className="text-xs font-bold">피시로: 얼마나 큰 자극을, 어떤 경로로</p>
            <div className={`mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-xs ${dim(active !== 2)}`}>
              <span className="rounded-md border border-border px-2 py-1.5 text-center">투자 100 (가정)</span>
              <span aria-hidden className="text-muted-foreground">→</span>
              <span className="rounded-md border border-border px-2 py-1.5 text-center font-mono font-bold">해마다 15 · 연 15%</span>
            </div>
            <div className={`mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-xs ${dim(active !== 1)}`}>
              <span className="rounded-md border border-border px-2 py-1.5 text-center">운하·증기선이 먼저 운송비를 크게 낮춤</span>
              <span aria-hidden className="text-muted-foreground">→</span>
              <span className="rounded-md border border-border px-2 py-1.5 text-center">1859년 이전 철도의 직접 이득은 크지 않음</span>
            </div>
          </div>
          <div className={`rounded-lg border border-dashed px-3 py-2 text-xs ${active === 3 ? "border-red-600" : "border-border"} ${dim(active === 3)}`}>
            <span className={`font-bold ${active === 3 ? "text-red-700 dark:text-red-400" : ""}`}>어느 계산에도 없음:</span> 노선이 지나간 땅을 누가 잃었는가
          </div>
        </div>
      )}
    />
  );
}
