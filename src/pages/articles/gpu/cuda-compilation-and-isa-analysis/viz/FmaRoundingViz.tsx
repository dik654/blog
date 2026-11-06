import SceneShell from "./SceneShell";

/**
 * 본문 대응: #floating-options — Floating Point 문서 §2.3의 예. A=1+2⁻²³, B=−(1+2⁻²²).
 * A×A = 1+2⁻²²+2⁻⁴⁶. 단정도는 1 뒤로 소수 23자리까지 담으므로 2⁻⁴⁶은 곱을 먼저 반올림하면 사라진다.
 */
const HEAD = ["1", "2⁻²²", "2⁻²³", "⋯", "2⁻⁴⁶"];
type Row = { name: string; digits: string[]; strong?: boolean; lost?: boolean };

const SCENES: readonly { label: string; summary: string; note: string; rows: readonly Row[] }[] = [
  {
    label: "정확한 곱",
    summary: "1 + 2⁻²² + 2⁻⁴⁶",
    note: "A×A를 전개하면 세 항이 나옵니다. 마지막 항 2⁻⁴⁶은 1 뒤로 소수 23자리까지 담는 단정도의 경계 밖에 있습니다.",
    rows: [
      { name: "A×A", digits: ["1", "1", "0", "", "1"], strong: true },
      { name: "B", digits: ["", "", "", "", ""] },
      { name: "결과", digits: ["", "", "", "", ""] },
    ],
  },
  {
    label: "곱을 먼저 반올림",
    summary: "최종값 0",
    note: "곱을 먼저 단정도로 반올림하면 경계 밖의 2⁻⁴⁶을 잃습니다. 남은 1+2⁻²²에 B를 더하면 모두 지워져 0이 됩니다. 반올림을 두 번 하는 경로입니다.",
    rows: [
      { name: "반올림한 곱", digits: ["1", "1", "0", "", "✕"], lost: true },
      { name: "B", digits: ["−1", "−1", "0", "", ""] },
      { name: "결과", digits: ["0", "0", "0", "", "0"], strong: true },
    ],
  },
  {
    label: "더한 뒤 한 번 반올림",
    summary: "최종값 2⁻⁴⁶",
    note: "FMA는 곱을 정확한 채로 B와 더한 뒤 한 번만 반올림합니다. 큰 항이 먼저 지워지고 남은 2⁻⁴⁶은 단독으로 표현할 수 있어 그대로 남습니다. 이 사례만으로 다른 kernel의 결과까지 판단할 수는 없습니다.",
    rows: [
      { name: "정확한 곱", digits: ["1", "1", "0", "", "1"] },
      { name: "B", digits: ["−1", "−1", "0", "", ""] },
      { name: "결과", digits: ["0", "0", "0", "", "1"], strong: true },
    ],
  },
];

export default function FmaRoundingViz() {
  return (
    <SceneShell
      eyebrow="반올림 횟수"
      title="곱을 먼저 반올림하면 맨 끝 자리가 사라집니다"
      description="A=1+2⁻²³, B=−(1+2⁻²²)로 A×A+B를 계산합니다. 칸은 값의 자릿수이고 2⁻²³ 오른쪽의 진한 세로선이 1 근처 크기의 수를 단정도로 담을 때의 경계입니다. 가운데 ⋯는 자리를 줄인 표시입니다."
      ariaLabel="A 곱하기 A 더하기 B를 두 번 반올림하면 0, 한 번 반올림하면 2의 마이너스 46승이 되는 자릿수 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 overflow-x-auto">
            <div className="grid min-w-[17rem] grid-cols-[4.75rem_repeat(3,minmax(0,1fr))_1.25rem_minmax(0,1fr)] gap-1 text-center font-mono text-xs">
              <span />
              {HEAD.map((head, index) => (
                <span key={head} className={`py-1 text-muted-foreground ${index === 2 ? "border-r border-foreground/70" : ""}`}>{head}</span>
              ))}
              {scene.rows.map((row) => (
                <div key={row.name} className="contents">
                  <span className={`self-center text-left font-sans leading-4 break-keep ${row.strong ? "font-bold" : "text-muted-foreground"}`}>{row.name}</span>
                  {row.digits.map((digit, index) => {
                    if (index === 3) return <span key={index} className="self-center text-muted-foreground">⋯</span>;
                    const crossed = row.lost && index === 4;
                    return (
                      <span
                        key={index}
                        className={`flex h-9 items-center justify-center rounded border ${index === 2 ? "border-r-foreground/70" : ""} ${
                          crossed ? "border-dashed border-red-600 font-bold text-red-700 dark:text-red-400" : digit && digit !== "0" ? "border-primary bg-primary/10 font-bold" : "border-border bg-background"
                        }`}
                      >
                        {digit}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
