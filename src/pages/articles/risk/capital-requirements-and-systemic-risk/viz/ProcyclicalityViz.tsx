import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundary — 나쁠 때 분자(자본)는 줄고 분모(위험가중자산)는 커져 비율이 이중으로 눌린다.
 * 같은 충격(손실 1, 가중치 상승으로 위험가중자산 100 → 110)을 두 은행에 준다(전부 가정).
 * 완충 없음: 8/100 = 8.0% → 7/110 = 6.4% → 기준 8%를 맞추려면 위험가중자산 7 ÷ 0.08 = 87.5, 22.5를 줄여야 한다.
 * 완충 있음: 10/100 = 10.0%(기준 8 + 완충 2) → 9/110 = 8.2%, 완충을 풀어 기준이 8%로 내려가면 줄일 필요가 없다.
 */
const CAP_MAX = 12;
const RWA_MAX = 120;
const RATIO_MAX = 12;

const COLORS = {
  capital: "#10b981",
  rwa: "#6366f1",
  ok: "#2563eb",
  warn: "#ef4444",
  line: "#64748b",
} as const;

interface Scene {
  label: string;
  summary: string;
  note: string;
  capital: number;
  rwa: number;
  required: number;
  action: string;
  loop: boolean;
}

const SCENES: readonly Scene[] = [
  {
    label: "평상시",
    summary: "8 ÷ 100 = 8.0%",
    note: "자본 8, 위험가중자산 100이면 비율은 8%로 최저 기준 8%(가정)에 딱 맞습니다. 이 은행은 기준 위로 더 쌓아 둔 몫이 없습니다.",
    capital: 8,
    rwa: 100,
    required: 8,
    action: "기준을 맞추고 있어 따로 할 일이 없습니다",
    loop: false,
  },
  {
    label: "나빠지면 양쪽이 함께 움직입니다",
    summary: "7 ÷ 110 = 6.4%",
    note: "자산이 깎여 자본이 1 줄고, 같은 시기에 대출의 위험 가중치가 올라 위험가중자산이 110이 됩니다(가정). 분자는 작아지고 분모는 커지니 비율이 두 방향에서 동시에 내려갑니다.",
    capital: 7,
    rwa: 110,
    required: 8,
    action: "비율 6.4%가 기준 8%(가정) 아래로 내려갔습니다",
    loop: false,
  },
  {
    label: "맞추려면 대출을 줄여야 합니다",
    summary: "7 ÷ 0.08 = 87.5 → 22.5 축소",
    note: "자본 7로 8%를 맞추려면 위험가중자산이 87.5여야 하므로 110에서 22.5를 줄여야 합니다. 대출을 줄이거나 자산을 팔면 경기가 더 나빠지고, 그것이 다시 손실과 가중치 상승으로 돌아옵니다. 이 되먹임을 경기순응성이라 부릅니다.",
    capital: 7,
    rwa: 87.5,
    required: 8,
    action: "위험가중자산 110 → 87.5, 대출 축소·자산 매각",
    loop: true,
  },
  {
    label: "좋을 때 완충을 더 쌓아 둔 은행",
    summary: "10 ÷ 100 = 10.0%",
    note: "완충자본은 최저 기준 위에 따로 더 쌓게 하는 몫입니다. 좋을 때 기준 8%에 완충 2%p를 얹어 10%를 요구받아(가정) 자본 10을 쌓아 둔 은행입니다.",
    capital: 10,
    rwa: 100,
    required: 10,
    action: "최저 8% + 완충 2%p = 10%를 맞추고 있습니다(가정)",
    loop: false,
  },
  {
    label: "나쁠 때 완충을 풀어 줍니다",
    summary: "9 ÷ 110 = 8.2% ≥ 8%",
    note: "같은 충격(손실 1, 위험가중자산 110)을 받아도 비율은 8.2%입니다. 규제가 완충 요구를 풀어 기준이 8%로 내려가면 이 은행은 대출을 줄이지 않아도 되므로, 앞 장면의 되먹임이 시작되지 않습니다. 쌓아 둔 2%p가 이 크기의 충격을 받아 냈기 때문이며, 충격이 더 크면 완충을 풀어도 8% 아래로 내려갈 수 있습니다.",
    capital: 9,
    rwa: 110,
    required: 8,
    action: "완충 요구 해제 → 기준 8%, 줄일 필요 없음",
    loop: false,
  },
];

function pct(value: number, max: number) {
  return `${Math.min(value / max, 1) * 100}%`;
}

function Row({ label, value, max, color, suffix }: { label: string; value: number; max: number; color: string; suffix: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.75rem] items-center gap-2 text-xs sm:grid-cols-[7.5rem_minmax(0,1fr)_4rem] sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: pct(value, max), backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">
        {value}
        {suffix}
      </span>
    </div>
  );
}

const LOOP = ["경기 악화", "자본↓ · 가중치↑", "비율↓", "대출 축소 · 매각"] as const;

export default function ProcyclicalityViz() {
  return (
    <SceneShell
      eyebrow="경기순응성"
      title="나쁠 때 비율이 양쪽에서 눌리고, 완충을 풀면 되먹임이 멈춥니다"
      description="위 두 막대가 비율의 분자(자본)와 분모(위험가중자산)이고, 아래 막대가 그 비율과 요구 기준(점선)입니다."
      note="자본 8·10, 손실 1, 위험가중자산 110, 최저 기준 8%와 완충 2%p는 계산이 보이도록 고른 가정이며 실제 규제 수치가 아닙니다."
      ariaLabel="경기가 나빠질 때 자본비율이 내려가는 과정과 완충자본을 풀어 줄 때의 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const ratio = (scene.capital / scene.rwa) * 100;
        const below = ratio < scene.required - 1e-9;
        const ratioColor = below ? COLORS.warn : COLORS.ok;
        return (
          <div className="min-w-0 space-y-3">
            <Row label="자본 (분자)" value={scene.capital} max={CAP_MAX} color={COLORS.capital} suffix="" />
            <Row label="위험가중자산 (분모)" value={scene.rwa} max={RWA_MAX} color={COLORS.rwa} suffix="" />
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.75rem] items-center gap-2 text-xs sm:grid-cols-[7.5rem_minmax(0,1fr)_4rem] sm:text-sm">
              <span className="font-bold">자본비율</span>
              <div className="relative h-6 min-w-0 rounded-sm bg-muted/40">
                <div
                  className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: pct(ratio, RATIO_MAX), backgroundColor: ratioColor }}
                />
                <div
                  className="absolute -top-1 -bottom-1 border-l border-dashed"
                  style={{ left: pct(scene.required, RATIO_MAX), borderColor: COLORS.line }}
                  aria-hidden
                />
              </div>
              <span className="text-right font-mono font-bold" style={{ color: ratioColor }}>
                {ratio.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              점선 = 요구 기준 {scene.required}%{scene.required > 8 ? " (최저 8% + 완충 2%p)" : ""} · 막대 끝 = 12%
            </p>
            <div className="rounded-lg border border-border/80 px-3 py-2">
              <p className="text-xs font-semibold sm:text-sm">{scene.action}</p>
              <ol className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1 text-[11px] sm:text-xs" aria-label="되먹임 고리">
                {LOOP.map((step, index) => (
                  <li key={step} className="flex items-center gap-1">
                    <span
                      className={`rounded-md border px-1.5 py-0.5 ${scene.loop ? "font-semibold" : "text-muted-foreground/50"}`}
                      style={{ borderColor: scene.loop ? COLORS.warn : "#cbd5e1" }}
                    >
                      {step}
                    </span>
                    <span className={scene.loop ? "" : "text-muted-foreground/40"} aria-hidden>
                      {index === LOOP.length - 1 ? "↺" : "→"}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        );
      }}
    />
  );
}
