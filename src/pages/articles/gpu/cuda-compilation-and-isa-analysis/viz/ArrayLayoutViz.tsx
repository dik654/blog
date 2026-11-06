import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 여덟 자리를 네 작업씩 두 묶음이 맡고, 첫 묶음의 3번 작업이 위치 3을 처리한다.
 * 위치 3 → 3×4 = 12바이트. 값은 A[3]=7, B[3]=5, C[3]=12만 본문에 있어 나머지 칸은 비워 둔다.
 */
const SLOTS = [0, 1, 2, 3, 4, 5, 6, 7];
const SCENES = [
  { label: "묶음 나누기", summary: "4작업 × 2묶음 = 8자리", note: "번호는 0부터 셉니다. 첫 묶음이 0~3번, 다음 묶음이 4~7번 자리를 맡습니다. 여덟 작업이 모두 유효한 자리를 맡는 사례입니다(가정)." },
  { label: "3번 작업", summary: "0×4 + 3 = 3", note: "첫 묶음(묶음 번호 0)의 3번 작업은 앞선 묶음 0개를 건너뛰고 자기 번호 3을 더해 세 배열의 3번 자리를 고릅니다." },
  { label: "바이트로 옮기기", summary: "3 × 4 = 12바이트", note: "맨 아래 숫자가 시작 주소에서 떨어진 바이트 수입니다. 수 하나가 4바이트이므로 3번 자리는 +12입니다. A·B·C의 시작 주소는 달라도 고른 번호는 모두 3입니다." },
  { label: "읽고 더해 쓰기", summary: "7 + 5 = 12", note: "7과 5를 더해 C의 3번 자리에 씁니다. 합 12와 앞 장면의 12바이트는 숫자만 같은 별개의 값입니다. 다른 자리의 값은 정하지 않아 비워 두었습니다." },
] as const;
const ROWS = [
  { name: "A", value: "7" },
  { name: "B", value: "5" },
  { name: "C", value: "12" },
] as const;

export default function ArrayLayoutViz() {
  return (
    <SceneShell
      eyebrow="여덟 자리와 두 묶음"
      title="작업 번호가 배열의 자리와 바이트 위치로 바뀝니다"
      description="칸 하나가 수 하나(4바이트)입니다. 위쪽 띠가 어느 묶음이 그 자리를 맡는지 보여 줍니다."
      ariaLabel="여덟 자리 배열 세 개에서 첫 묶음의 3번 작업이 3번 자리를 맡아 7과 5를 더해 12를 쓰는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          <div className="grid grid-cols-[1.5rem_repeat(8,minmax(0,1fr))] gap-1 text-center text-xs">
            <span />
            <span className="col-span-4 rounded border border-primary/60 py-1 font-semibold">첫 묶음</span>
            <span className="col-span-4 rounded border border-border py-1 text-muted-foreground">다음 묶음</span>
            <span />
            {SLOTS.map((slot) => (
              <span key={slot} className={`font-mono ${active >= 1 && slot === 3 ? "font-bold text-primary" : "text-muted-foreground"}`}>
                {slot}
              </span>
            ))}
          </div>
          {ROWS.map((row) => (
            <div key={row.name} className="grid grid-cols-[1.5rem_repeat(8,minmax(0,1fr))] gap-1">
              <span className="self-center font-mono text-sm font-bold">{row.name}</span>
              {SLOTS.map((slot) => {
                const on = active >= 1 && slot === 3;
                return (
                  <span
                    key={slot}
                    className={`flex h-9 items-center justify-center rounded border font-mono text-sm ${on ? "border-primary bg-primary/10 font-bold" : "border-border bg-background"}`}
                  >
                    {on && active === 3 ? row.value : ""}
                  </span>
                );
              })}
            </div>
          ))}
          <div className="grid grid-cols-[1.5rem_repeat(8,minmax(0,1fr))] gap-1 pt-1 text-center font-mono text-[11px]">
            <span />
            {SLOTS.map((slot) => (
              <span key={slot} className={active === 2 && slot === 3 ? "font-bold text-primary" : active === 2 ? "text-muted-foreground" : "text-transparent"}>
                +{slot * 4}
              </span>
            ))}
          </div>
        </div>
      )}
    />
  );
}
