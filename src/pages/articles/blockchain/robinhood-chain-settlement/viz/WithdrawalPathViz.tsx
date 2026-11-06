import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — A의 10 전송, batch 게시·확정, B의 5 인출 시작, 약 7일 대기, L1 claim.
 * 잔액: 90·10·0·0 → 같음 → 90·5·5·0 → 같음 → 90·5·0·5. 수량은 글의 교육용 가정이고 gas는 별도다.
 */
const W = 360;
const H = 176;
const SLATE = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";
const COLS = ["A L2", "B L2", "인출 중", "B L1"] as const;

const SCENES = [
  { label: "A가 서명, L2가 실행", summary: "A 90 · B 10", hot: "seq", balances: [90, 10, 0, 0], note: "A가 서명한 거래를 L2가 실행합니다. 거래 hash가 나온 것만으로 판단하지 않고 실행 영수증의 status와 transfer 결과, 잔액을 대조합니다." },
  { label: "batch 게시와 확정", summary: "잔액은 그대로", hot: "batch", balances: [90, 10, 0, 0], note: "그 거래를 담은 batch가 inbox에 게시되고 해당 L1 블록이 확정됐는지 추적합니다. 잔액 숫자는 바뀌지 않습니다." },
  { label: "B가 인출 시작", summary: "B L2 5 · 인출 중 5", hot: "wd", balances: [90, 5, 5, 0], note: "별도의 L2 인출 사건에서 메시지를 얻습니다. 5는 아직 L1에 지급되지 않은 같은 수량이며 새 자산이 아닙니다." },
  { label: "약 7일 대기", summary: "아직 인출 중 5", hot: "wait", balances: [90, 5, 5, 0], note: "공식 안내의 약 7일을 거쳐 메시지가 실행 가능해집니다. 실행 가능해졌을 뿐 지급은 아직 일어나지 않았습니다." },
  { label: "L1에서 claim", summary: "B L1 5", hot: "claim", balances: [90, 5, 0, 5], note: "L1 outbox에서 메시지를 실행해 지급받는 claim 거래를 보내고 영수증과 수령 5를 확인합니다. 이 마지막 단계에는 L1 gas가 듭니다." },
] as const;

function Node({ x, y, label, sub, on }: { x: number; y: number; label: string; sub: string; on: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={124} height={42} rx={6} fill="none" stroke={on ? BLUE : "#94a3b8"} strokeWidth={on ? 1.25 : 1} />
      <text x={x + 62} y={y + 17} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={on ? BLUE : SLATE}>{label}</text>
      <text x={x + 62} y={y + 32} textAnchor="middle" fontSize={10.5} fill={SLATE}>{sub}</text>
    </g>
  );
}

export default function WithdrawalPathViz() {
  return (
    <SceneShell
      eyebrow="두 체인을 오가는 길"
      title="A의 10개 전송과 B의 5개 인출이 지나는 자리"
      description="왼쪽 길은 A의 전송이 L1에 게시되는 길, 오른쪽 길은 B의 인출이 지급되는 길입니다. 숫자는 교육용 가상 TOK의 수량이며 gas는 별도입니다."
      ariaLabel="L2 실행, batch 게시, 인출 시작, 대기, L1 claim과 단계별 잔액"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <rect x={1} y={1} width={W - 2} height={72} rx={8} fill="none" stroke="#94a3b8" strokeWidth={0.75} opacity={0.6} />
              <text x={10} y={14} fontSize={10.5} fontWeight={700} fill={SLATE}>L2</text>
              <rect x={1} y={103} width={W - 2} height={72} rx={8} fill="none" stroke="#94a3b8" strokeWidth={0.75} opacity={0.6} />
              <text x={10} y={116} fontSize={10.5} fontWeight={700} fill={SLATE}>Ethereum (L1)</text>
              <Node x={28} y={22} label="sequencer·실행" sub="A → B 10" on={scene.hot === "seq"} />
              <Node x={208} y={22} label="인출 거래" sub="B의 5, 메시지" on={scene.hot === "wd"} />
              <Node x={28} y={122} label="inbox" sub="batch 게시" on={scene.hot === "batch"} />
              <Node x={208} y={122} label="outbox" sub="claim 실행" on={scene.hot === "claim"} />
              <g stroke={scene.hot === "batch" ? BLUE : "#94a3b8"} strokeWidth={scene.hot === "batch" ? 1.25 : 1} fill="none">
                <path d="M90 64V122M86 116L90 122L94 116" />
              </g>
              <text x={98} y={92} fontSize={10.5} fontWeight={scene.hot === "batch" ? 700 : 400} fill={scene.hot === "batch" ? BLUE : SLATE}>batch</text>
              <g stroke={scene.hot === "wait" ? AMBER : "#94a3b8"} strokeWidth={scene.hot === "wait" ? 1.25 : 1} fill="none" strokeDasharray="4 3">
                <path d="M270 64V122" />
                <path d="M266 116L270 122L274 116" strokeDasharray="none" />
              </g>
              <text x={278} y={92} fontSize={10.5} fontWeight={scene.hot === "wait" ? 700 : 400} fill={scene.hot === "wait" ? AMBER : SLATE}>약 7일</text>
            </svg>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
              {COLS.map((col, index) => {
                const changed = active > 0 && SCENES[active - 1].balances[index] !== scene.balances[index];
                return (
                  <div key={col} className={`rounded-lg border px-1 py-2 ${changed ? "border-primary" : "border-border"} bg-background`}>
                    <span className="block text-xs text-muted-foreground">{col}</span>
                    <span className={`block font-mono text-base ${changed ? "font-bold text-primary" : "font-semibold"}`}>{scene.balances[index]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
