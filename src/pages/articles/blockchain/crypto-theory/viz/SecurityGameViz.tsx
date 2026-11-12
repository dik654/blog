import SceneShell from "./SceneShell";

/**
 * 본문 대응: #security-game — 같은 사용처·같은 길이의 30원/90원 지시 중 하나를 균등하게 골라 보호하고,
 * 공격자가 어느 쪽인지 맞힙니다. 정보가 없으면 1/2, 성공확률 0.51(본문 가정)이면 격차 |0.51 − 0.5| = 0.01.
 */
const BASE = 0.5;
const SUCCESS = 0.51;
const GAP = Math.round(Math.abs(SUCCESS - BASE) * 100) / 100;

const SCENES = [
  {
    label: "두 후보",
    summary: "pay=30 · pay=90, 사용처와 길이 같음",
    note: "공격자에게 두 지시를 미리 보여 줍니다. 사용처 shop=A와 길이를 같게 맞춰, 길이나 사용처만 보고 맞히는 일이 없게 합니다.",
  },
  {
    label: "하나를 몰래 보호",
    summary: "동전 b → 고른 쪽만 묶음 C로",
    note: "게임 진행자가 b를 같은 확률로 정해 그 지시만 보호하고, 묶음 C만 넘깁니다. 키 K와 b는 공격자에게 보이지 않습니다.",
  },
  {
    label: "공격자의 추측",
    summary: "정해 둔 범위 안에서 b′를 냄",
    note: "공격자는 미리 정한 관찰 범위·추가 암호화/복호화 요청·시간과 메모리 한도 안에서만 계산하고 추측 b′를 냅니다. 범위를 정하지 않으면 공정한 비교가 되지 않습니다.",
  },
  {
    label: "기준과의 격차",
    summary: `|${SUCCESS} − 1/2| = ${GAP}`,
    note: "아무 정보 없이 찍어도 1/2은 맞습니다. 성공확률이 0.51이라고 가정하면 기준을 넘는 부분 0.01이 advantage(공격자의 이득)입니다. 100번 중 51번 맞힌 실험 한 번으로 실제 확률이 0.51이라고 확정하지는 못합니다.",
  },
] as const;

const BOX = "rounded-lg border px-3 py-2 text-xs";

function Stage({ active }: { active: number }) {
  const hideB = active < 1;
  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className={`${BOX} border-border`}>
        <p className="font-bold">게임 진행자</p>
        <div className="mt-2 grid grid-cols-2 gap-2 font-mono">
          {["pay=30", "pay=90"].map((m, i) => {
            const picked = active >= 1 && i === 1;
            return (
              <div key={m} className={`rounded-md border px-2 py-1.5 text-center ${picked ? "border-indigo-600 font-bold text-indigo-700 dark:text-indigo-300" : "border-border text-muted-foreground"}`}>
                <span className="block">{m}</span>
                <span className="block text-[11px]">shop=A · b={i}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-muted-foreground">{hideB ? "아직 고르지 않음" : "b를 같은 확률로 고름 (그림은 b=1인 경우, 가정)"}</p>
      </div>
      <div className={`${BOX} ${active === 2 ? "border-amber-600" : "border-border"}`}>
        <p className="font-bold">공격자</p>
        <p className="mt-2 text-muted-foreground">보는 것: {active >= 1 ? "두 후보 + 묶음 C" : "두 후보"}</p>
        <p className="mt-1 text-muted-foreground">못 보는 것: 키 K, b</p>
        <p className="mt-1 text-muted-foreground">한도: 추가 질의 · 시간 · 메모리 (게임이 정함)</p>
        <p className={`mt-2 font-semibold ${active >= 2 ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/60"}`}>{active >= 2 ? "추측 b′ ∈ {0, 1} 제출" : "추측 전"}</p>
      </div>
    </div>
  );
}

function Meter() {
  const pct = (v: number) => `${v * 100}%`;
  return (
    <div className="min-w-0">
      <div className="relative h-5 w-full rounded-sm bg-muted/40">
        <div className="absolute inset-y-0 left-0 rounded-l-sm" style={{ width: pct(BASE), backgroundColor: "#94a3b8" }} />
        <div className="absolute inset-y-0" style={{ left: pct(BASE), width: pct(GAP), backgroundColor: "#d97706" }} />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
        <span>0</span>
        <span>맞힐 확률</span>
        <span>1</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: "#94a3b8" }} />찍어도 맞는 1/2</span>
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: "#d97706" }} />그 위의 격차 {GAP} (가정)</span>
      </div>
    </div>
  );
}

export default function SecurityGameViz() {
  return (
    <SceneShell
      eyebrow="구분 게임"
      title="두 지시 중 무엇이 보호됐는지 맞히는 게임"
      description="인물·금액은 본문의 설명용 예이고, 성공확률 0.51은 본문이 든 가정입니다. 마지막 장면 막대의 주황 칸은 실제 길이(0.01)라 아주 얇습니다."
      ariaLabel="30원과 90원 지시를 구분하는 보안 게임의 진행과 advantage 계산"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <Stage active={active} />
          <div className={active === 3 ? "" : "invisible"} aria-hidden={active !== 3}>
            <Meter />
          </div>
        </div>
      )}
    />
  );
}
