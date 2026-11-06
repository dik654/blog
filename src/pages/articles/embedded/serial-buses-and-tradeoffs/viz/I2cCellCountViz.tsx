import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 일곱 묶음 × 9칸 = 63칸, 한 칸 2.5 µs면 157.5 µs.
 * 가로줄 하나가 한 묶음이고 칸 하나가 클록 한 번입니다. 네모 칸이 데이터 8칸, "응" 칸이 응답 1칸입니다.
 */
const ROWS = ["장치·쓰기", "읽을 위치", "장치·읽기", "결과 1", "결과 2", "결과 3", "결과 4"] as const;
const CELLS = Array.from({ length: 9 }, (_, cell) => cell);

type Mode = "request" | "result" | "all" | "payload" | "time";

const SCENES: readonly { label: string; summary: string; note: string; mode: Mode }[] = [
  { label: "먼저 세 묶음을 보냅니다", summary: "3 × 9 = 27칸", mode: "request", note: "센서와 쓰기 방향을 고르고, 읽을 위치를 알리고, 같은 센서와 읽기 방향을 다시 고릅니다. 결과는 아직 한 비트도 오지 않았습니다." },
  { label: "그 뒤 결과 네 묶음을 받습니다", summary: "4 × 9 = 36칸", mode: "result", note: "결과 한 바이트도 데이터 8칸으로 끝나지 않습니다. 응답 1칸이 붙어 묶음마다 9칸입니다." },
  { label: "일곱 묶음을 모두 셉니다", summary: "(3 + 4) × 9 = 63칸", mode: "all", note: "세 묶음의 27칸과 네 묶음의 36칸을 더하면 63칸입니다." },
  { label: "읽으려던 32비트는 그중 일부입니다", summary: "32칸 / 63칸", mode: "payload", note: "진하게 칠한 칸이 결과 데이터 4 × 8 = 32칸입니다. 나머지 31칸은 앞 세 묶음 27칸과 결과의 응답 4칸입니다." },
  { label: "칸 수에 시간을 곱합니다", summary: "63 × 2.5 µs = 157.5 µs", mode: "time", note: "한 칸이 2.5 µs라면 순수 클록 시간은 157.5 µs입니다. 32칸만 세면 80 µs로 앞뒤 절차가 빠집니다. 157.5 µs도 대기까지 포함한 완료 시간의 보장은 아닙니다." },
];

function lit(mode: Mode, row: number, cell: number) {
  if (mode === "request") return row < 3;
  if (mode === "result") return row >= 3;
  if (mode === "payload") return row >= 3 && cell < 8;
  return true;
}

export default function I2cCellCountViz() {
  return (
    <SceneShell
      eyebrow="네 바이트 읽기의 칸 수"
      title="네 바이트를 읽는 데 왜 63칸을 쓰는가"
      description="칸 하나가 박자(클록) 한 번입니다. 가로줄 하나가 한 묶음이고, 데이터 8칸 뒤에 상대의 응답 1칸(응)이 붙습니다. 묶음의 구성과 한 칸 2.5 µs는 설명용 가정입니다."
      ariaLabel="일곱 묶음을 9칸씩 세어 63칸과 157.5 마이크로초를 얻는 과정"
      scenes={SCENES}
      render={(active) => {
        const { mode } = SCENES[active];
        return (
          <div className="mx-auto max-w-[560px] space-y-1">
            {ROWS.map((row, rowIndex) => (
              <div key={row} className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-2">
                <span className={`text-xs ${lit(mode, rowIndex, 0) ? "font-semibold" : "text-muted-foreground"}`}>{row}</span>
                <div className="grid grid-cols-9 gap-0.5">
                  {CELLS.map((cell) => {
                    const on = lit(mode, rowIndex, cell);
                    const reply = cell === 8;
                    return (
                      <span
                        key={cell}
                        className="flex h-5 items-center justify-center rounded-sm border text-[10px] font-bold leading-none"
                        style={{
                          backgroundColor: on ? (reply ? "#d97706" : "#2563eb") : "transparent",
                          borderColor: on ? (reply ? "#d97706" : "#2563eb") : "#94a3b8",
                          color: on ? "#ffffff" : "#94a3b8",
                          opacity: on ? 1 : 0.45,
                        }}
                      >
                        {reply ? "응" : ""}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
