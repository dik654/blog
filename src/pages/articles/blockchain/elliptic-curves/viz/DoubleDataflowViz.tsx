import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — Projective double_in_place의 일반(a≠0) 분기, 입력 (5,1,1), a=2, mod 17.
 * XX=25→8, YY=1, YYYY=1, ZZ=1
 * S=2((5+1)²−8−1)=54→3, M=3·8+2·1²=26→9
 * X'=81−6=75→7, Z'=2·1·1=2, Y'=9(3−7)−8=−44→7  → (7,7,2)
 * Z'⁻¹=9, 9²=81→13, 9³=117→15, x=7·13=91→6, y=7·15=105→3 → (6,3)=2P
 */
type Cell = { name: string; value: string; calc: string };

const LAYERS: readonly { title: string; cells: readonly Cell[] }[] = [
  { title: "입력", cells: [{ name: "X", value: "5", calc: "" }, { name: "Y", value: "1", calc: "" }, { name: "Z", value: "1", calc: "" }] },
  {
    title: "제곱",
    cells: [
      { name: "XX", value: "8", calc: "5²=25→8" },
      { name: "YY", value: "1", calc: "1²" },
      { name: "YYYY", value: "1", calc: "YY²" },
      { name: "ZZ", value: "1", calc: "1²" },
    ],
  },
  {
    title: "중간값",
    cells: [
      { name: "S", value: "3", calc: "2(6²−8−1)=54→3" },
      { name: "M", value: "9", calc: "3·8+2·1=26→9" },
    ],
  },
  {
    title: "원시 출력",
    cells: [
      { name: "새 X", value: "7", calc: "9²−2·3=75→7" },
      { name: "새 Z", value: "2", calc: "2·1·1=2" },
      { name: "새 Y", value: "7", calc: "9(3−7)−8=−44→7" },
    ],
  },
  {
    title: "9절처럼 읽기",
    cells: [
      { name: "x", value: "6", calc: "7·13=91→6" },
      { name: "y", value: "3", calc: "7·15=105→3" },
    ],
  },
];

const SCENES = [
  { label: "입력 (5,1,1)", summary: "P=(5,1)을 Z=1로 저장", note: "7절에서 손으로 두 배한 P=(5,1)을 Z=1인 세 수로 넣습니다. a=0 빠른 분기는 건너뛰고 a=2인 일반 분기를 읽습니다." },
  { label: "제곱 네 개", summary: "XX=8 · YY=1 · YYYY=1 · ZZ=1", note: "다음 줄에서 여러 번 쓰일 제곱부터 만들어 둡니다. 25를 17로 나눈 나머지가 8입니다." },
  { label: "S와 M", summary: "S=3 · M=9", note: "S=2((X+YY)²−XX−YYYY), M=3XX+a·ZZ²입니다. 앞 줄의 값만 써서 계산합니다." },
  { label: "원시 출력 (7,7,2)", summary: "새 X=7 · 새 Z=2 · 새 Y=7", note: "새 X=M²−2S, 새 Z=2YZ, 새 Y=M(S−새 X)−8YYYY입니다. 이 세 수는 아직 나누지 않은 저장 형태입니다." },
  { label: "나눠서 (6,3)", summary: "2⁻¹=9 → (6,3) = 2P", note: "Z=2의 역원 9로 9²≡13, 9³≡15를 곱하면 (6,3)입니다. 7절에서 손으로 계산한 2P와 같은 점입니다." },
] as const;

export default function DoubleDataflowViz() {
  return (
    <SceneShell
      eyebrow="원본 두 배 함수의 중간값"
      title="(5,1,1)이 네 단계를 거쳐 (7,7,2)가 되고, 나누면 (6,3)입니다"
      description="모든 계산은 17로 나눈 나머지입니다. 앞 단계부터 한 칸씩 채워지며, 각 단계는 그 앞 단계까지의 값만 씁니다. 곡선 계수는 a=2입니다."
      ariaLabel="Projective 두 배 함수에서 입력 5,1,1이 제곱, S와 M, 원시 출력 7,7,2를 거쳐 2P=(6,3)으로 읽히는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="space-y-1.5 sm:hidden">
            {LAYERS.map((layer, index) => {
              const filled = index <= active;
              const current = index === active;
              return (
                <div key={layer.title} className={`min-w-0 rounded-lg border px-2 py-1.5 ${current ? "border-blue-600" : filled ? "border-border bg-background" : "border-dashed border-border/50"}`}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className={`text-xs font-bold ${current ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground"}`}>
                      {index + 1}. {layer.title}
                    </span>
                    {layer.cells.map((cell) => (
                      <span key={cell.name} className="font-mono text-xs">
                        <span className="text-muted-foreground">{cell.name}=</span>
                        <span className={`font-bold ${filled ? "" : "text-muted-foreground/40"}`}>{filled ? cell.value : "·"}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="rounded-lg border border-border px-2 py-1.5 font-mono text-[11px] leading-5 text-muted-foreground">
              {LAYERS[active].cells.filter((cell) => cell.calc).map((cell) => (
                <div key={cell.name}>
                  {cell.name}: {cell.calc}
                </div>
              ))}
              {active === 0 && <div>P=(5,1)을 Z=1로 저장</div>}
            </div>
          </div>
          <div className="hidden min-w-0 grid-cols-5 gap-2 sm:grid">
            {LAYERS.map((layer, index) => {
              const filled = index <= active;
              const current = index === active;
              return (
                <div key={layer.title} className={`min-w-0 rounded-lg border p-2 ${current ? "border-blue-600" : filled ? "border-border bg-background" : "border-dashed border-border/50"}`}>
                  <div className={`text-xs font-bold ${current ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground"}`}>
                    {index + 1}. {layer.title}
                  </div>
                  <div className="mt-1 space-y-1">
                    {layer.cells.map((cell) => (
                      <div key={cell.name} className="min-w-0">
                        <div className="font-mono text-xs">
                          <span className="text-muted-foreground">{cell.name}=</span>
                          <span className={`font-bold ${filled ? "" : "text-muted-foreground/40"}`}>{filled ? cell.value : "·"}</span>
                        </div>
                        {cell.calc && <div className={`font-mono text-[11px] leading-4 text-muted-foreground ${filled ? "" : "invisible"}`}>{cell.calc}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
