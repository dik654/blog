import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 임시 열쇠의 누적 한도 100.
 * 0+40=40 허용(남은 60) → 70만 보면 100 이하라 통과처럼 보임 → 40+70=110 > 100 거절.
 * #erc4337 마지막 문단: 접수 때 남은 한도 100이어도 먼저 포함된 요청이 80을 쓰면 80+40=120 > 100.
 */
const LIMIT = 100;
const SCALE = 125;

type Seg = { amount: number; label: string; color: string };

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  check: string;
  ok: boolean;
  totalLabel: string;
  verdict: string;
  segs: readonly Seg[];
}[] = [
  {
    label: "7번 요청 40",
    summary: "0 + 40 = 40 ≤ 100",
    check: "누적 사용량 0에 40을 더해도 한도 100 안",
    ok: true,
    totalLabel: "누적",
    verdict: "허용 · 남은 한도 60",
    segs: [{ amount: 40, label: "7번 40", color: "#2563eb" }],
    note: "임시 열쇠의 장부는 지금까지 보낸 총량(누적 사용량)을 셉니다. 처음 40을 보내면 누적 40, 남은 한도는 60입니다.",
  },
  {
    label: "요청 하나만 보면",
    summary: "70 ≤ 100 → 통과처럼 보임",
    check: "이번 금액 70만 한도와 비교",
    ok: true,
    totalLabel: "이번 요청만",
    verdict: "개별 검사로는 통과",
    segs: [{ amount: 70, label: "다음 요청 70", color: "#d97706" }],
    note: "다음 요청의 70을 따로 떼어 보면 100 이하입니다. 각 금액이 100 이하인지만 보는 검사는 이 요청을 통과시킵니다.",
  },
  {
    label: "누적으로 보면",
    summary: "40 + 70 = 110 > 100 → 거절",
    check: "이미 쓴 40 위에 70을 쌓아 한도와 비교",
    ok: false,
    totalLabel: "누적",
    verdict: "한도 10 초과 · 거절",
    segs: [
      { amount: 40, label: "7번 40", color: "#2563eb" },
      { amount: 70, label: "다음 70", color: "#d97706" },
    ],
    note: "같은 장부에 쌓으면 110으로 한도를 10 넘습니다. 서명이 맞아도 이 요청은 거절해야 합니다.",
  },
  {
    label: "다른 요청이 먼저 포함되면",
    summary: "80 + 40 = 120 > 100 → 거절",
    check: "실제로 처리되는 순서의 최종 상태에서 다시 비교",
    ok: false,
    totalLabel: "누적",
    verdict: "한도 20 초과 · 거절",
    segs: [
      { amount: 80, label: "먼저 처리된 80", color: "#64748b" },
      { amount: 40, label: "7번 40", color: "#2563eb" },
    ],
    note: "7번 요청을 처음 확인할 때는 남은 한도가 100이었어도, 다른 요청이 먼저 처리돼 80을 썼다면 40은 이제 초과입니다(7절의 예). 그래서 동시에 들어온 요청도 처리 순서대로 같은 누적 장부에서 검사합니다.",
  },
];

export default function CumulativeLimitViz() {
  return (
    <SceneShell
      eyebrow="누적 한도"
      title="한도 100은 요청 하나가 아니라 쌓인 합에 걸립니다"
      description="막대 길이는 그 검사가 한도와 비교하는 USDC 수량입니다. 세로 점선이 한도 100입니다. 금액은 본문의 가정입니다."
      ariaLabel="임시 열쇠의 누적 한도 100에 요청 금액을 쌓아 허용과 거절을 판정하는 도식"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const starts = scene.segs.map((_, index) => scene.segs.slice(0, index).reduce<number>((sum, seg) => sum + seg.amount, 0));
        const total = scene.segs.reduce<number>((sum, seg) => sum + seg.amount, 0);
        return (
          <div className="min-w-0">
            <div className="relative h-24">
              <div className="absolute inset-x-0 top-8 h-9 rounded-sm bg-muted/40" />
              {scene.segs.map((seg, index) => (
                <div
                  key={`${seg.label}-${index}`}
                  className="absolute top-8 flex h-9 items-center justify-center overflow-hidden border-r border-background text-[11px] font-semibold text-white sm:text-xs"
                  style={{ left: `${(starts[index] / SCALE) * 100}%`, width: `${(seg.amount / SCALE) * 100}%`, backgroundColor: seg.color }}
                >
                  <span className="truncate px-1">{seg.label}</span>
                </div>
              ))}
              {total > LIMIT && (
                <div
                  className="absolute top-6 h-[52px] rounded-sm border border-dashed border-red-600"
                  style={{ left: `${(LIMIT / SCALE) * 100}%`, width: `${((total - LIMIT) / SCALE) * 100}%` }}
                />
              )}
              <div className="absolute top-2 h-[84px] border-l border-dashed border-slate-500" style={{ left: `${(LIMIT / SCALE) * 100}%` }} />
              <span className="absolute top-0 -translate-x-1/2 font-mono text-[11px] text-muted-foreground" style={{ left: `${(LIMIT / SCALE) * 100}%` }}>
                한도 100
              </span>
              <span className="absolute bottom-0 left-0 font-mono text-[11px] text-muted-foreground">0</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">{scene.check}</span>
              <span className={`rounded-md border px-2 py-0.5 font-semibold ${scene.ok ? "border-emerald-600 text-emerald-700 dark:text-emerald-400" : "border-red-600 text-red-700 dark:text-red-400"}`}>
                {`${scene.totalLabel} ${total} · ${scene.verdict}`}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
