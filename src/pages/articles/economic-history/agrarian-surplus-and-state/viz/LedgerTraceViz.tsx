import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 한 번의 수확이 측정·기록·배정·인계·실사로 이어지며 장부 줄이 늘어난다.
 * 100 × 12 = 1200, 100 + 50 + 1000 = 1150, 1200 − 1150 = 50, 1180 − 1150 = 30, 1200 − 1180 = 20.
 */
const STEPS = ["수확일", "배분 결정", "몇 달 뒤", "실사", "원인 조사"] as const;
const CAUSES = ["보관 손실", "측정 오차", "기록 오류", "승인되지 않은 반출"] as const;

const LINES = [
  { label: "납부 100가구 × 12자루", value: "1200", from: 0 },
  { label: "배정 종자 100 · 비상 50 · 지급 1000", value: "1150", from: 1 },
  { label: "장부 잔량", value: "50", from: 1 },
  { label: "실사 창고 총량", value: "1180", from: 3 },
  { label: "실물 잔량", value: "30", from: 3 },
  { label: "장부와의 차이", value: "20", from: 3 },
] as const;

const SCENES = [
  { label: "같은 용기로 잰 뒤 기록합니다", summary: "100 × 12 = 1200자루", note: "각 가구의 12자루를 같은 용기로 잽니다. 기록자는 가구별 납부와 창고 총량 1200을 연결합니다." },
  { label: "배분이 항목이 됩니다", summary: "100 + 50 + 1000 = 1150자루", note: "배분 결정 뒤에는 종자·비상·지급 항목이 생기고, 1200에서 1150을 뺀 장부 잔량 50이 나옵니다." },
  { label: "사람이 바뀌어도 장부는 남습니다", summary: "다음 관리자에게 인계", note: "이 숫자가 있어야 다음 관리자가 몇 달 뒤에도 약속을 이어 받을 수 있습니다. 장부 줄은 그대로이고 맡는 사람만 바뀝니다." },
  { label: "실제로 세어 봅니다", summary: "1180 − 1150 = 실물 잔량 30", note: "실사 결과가 1180이면 잔량은 50이 아니라 30입니다. 장부 잔량과 실물 잔량의 간격이 차이 20입니다." },
  { label: "차이 하나, 후보 원인 넷", summary: "차이 20 → 원인을 가립니다", note: "장부는 차이만 보여 줍니다. 원인마다 고칠 장치도 다르며, 이 사례에서 어느 하나로 정해지지 않았습니다." },
] as const;

export default function LedgerTraceViz() {
  return (
    <SceneShell
      eyebrow="한 번의 수확을 따라가기"
      title="수확일부터 실사까지 장부가 늘어납니다"
      description="단위는 자루입니다. 유물의 번역이 아니라 이 글의 가정 사례이며, 칸의 간격은 실제 기간이 아닙니다."
      ariaLabel="수확일, 배분 결정, 인계, 실사, 원인 조사에 따라 달라지는 장부"
      scenes={SCENES}
      render={(active) => {
        const shownStep = active;
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-5 gap-1">
              {STEPS.map((step, index) => (
                <li key={step} className={`rounded-md border px-0.5 py-2 text-center text-[11px] font-semibold sm:text-sm ${index === active ? "border-primary text-primary" : index < active ? "border-border text-foreground" : "border-border text-muted-foreground/60"}`}>
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-3 divide-y divide-border/60 rounded-md border border-border/70 px-3">
              {LINES.map((line) => {
                const on = line.from <= shownStep;
                const fresh = line.from === shownStep;
                return (
                  <div key={line.label} className={`flex items-baseline justify-between gap-3 py-1 text-xs sm:text-sm ${on ? "" : "opacity-25"}`}>
                    <span className={fresh ? "font-semibold" : "text-muted-foreground"}>{line.label}</span>
                    <span className={`font-mono font-semibold ${fresh ? "text-primary" : ""}`}>{on ? line.value : "−"}</span>
                  </div>
                );
              })}
            </div>
            <div className={`mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4 ${active === 4 ? "" : "opacity-25"}`}>
              {CAUSES.map((cause) => (
                <div key={cause} className="rounded-md border border-dashed px-1 py-1.5 text-center text-xs font-semibold" style={{ borderColor: active === 4 ? "#d97706" : "#94a3b8" }}>
                  {cause}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
