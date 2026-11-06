import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 은 100 경로(가정)의 시장 장부 옆에 수치를 모르는 네 항목을 적습니다.
 * 빈칸의 크기와 칸 순서는 손실의 크기나 구간을 뜻하지 않습니다. 본문에 수치가 없으므로 어떤 값도 그리지 않습니다.
 */
const SCENES = [
  { label: "시장 장부만 보면", summary: "모든 칸이 숫자로 찹니다", note: "채굴·운반·정련·주조를 거친 은 100의 길입니다. 칸이 다 차 있어 이 표만으로 끝난 것처럼 보입니다. 숫자는 모두 가정입니다." },
  { label: "같은 경로 옆에 적을 항목", summary: "항목 넷 추가", note: "노동일수, 사망과 부상, 농촌의 일손 부족, 수은 오염을 같은 경로 옆에 기록하면 이익표가 달라집니다." },
  { label: "모른다고 0을 적으면", summary: "하지 말아야 할 기록", note: "0은 모른다는 표시가 아니라 그 값이 0이라는 수치입니다. 본문은 정확한 수치를 모를 때 0으로 놓지 말라고 합니다." },
  { label: "자료의 빈칸으로 두면", summary: "정확한 수치를 모름 = 빈칸", note: "정확한 수치를 모르면 자료의 빈칸으로 표시합니다. 빈칸의 크기는 손실의 크기가 아닙니다." },
] as const;

const MARKET = [
  { name: "광산", value: "100" },
  { name: "현지에 남음 / 세금·운송·손실로 빠짐", value: "15 / 25" },
  { name: "대서양 건넘", value: "60" },
  { name: "그중 아시아 상품 대금으로 보낼 수 있음", value: "40" },
] as const;

const OUTSIDE = ["노동일수", "사망과 부상", "농촌의 일손 부족", "수은 오염"] as const;

export default function TwoLedgersViz() {
  return (
    <SceneShell
      eyebrow="두 장부"
      title="모르는 손실은 0이 아니라 빈칸입니다"
      description="위 칸은 은 100 경로의 가정 숫자이고, 아래 칸은 같은 경로 옆에 적어야 할 항목입니다. 아래 칸에 값을 그리지 않은 것은 본문에 수치가 없기 때문입니다."
      ariaLabel="은의 시장 장부와, 수치를 모르는 네 항목을 0이 아닌 빈칸으로 적는 기록 장부"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <p className="text-xs font-bold leading-5 sm:text-sm">시장 장부 (가정)</p>
          <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {MARKET.map((cell) => (
              <div key={cell.name} className="rounded-lg border border-border bg-background px-2 py-1.5 text-center">
                <span className="block text-xs leading-4 text-muted-foreground">{cell.name}</span>
                <span className="mt-1 block font-mono text-base font-bold">{cell.value}</span>
              </div>
            ))}
          </div>
          <p className={`mt-4 text-xs font-bold leading-5 sm:text-sm ${active === 0 ? "opacity-30" : ""}`}>기록 밖 장부 (이 글에 수치 없음)</p>
          <div className={`mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4 ${active === 0 ? "opacity-30" : ""}`}>
            {OUTSIDE.map((item) => (
              <div key={item} className="rounded-lg border border-border bg-background px-2 py-1.5 text-center">
                <span className="block text-xs leading-4 text-muted-foreground">{item}</span>
                <span
                  className="mt-1 flex h-7 items-center justify-center rounded border border-dashed text-xs font-bold"
                  style={{ borderColor: active === 2 ? "#dc2626" : "#94a3b8", color: active === 2 ? "#dc2626" : "#64748b" }}
                >
                  {active === 2 ? <s className="font-mono text-base">0</s> : active === 3 ? "빈칸" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
