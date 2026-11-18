import FieldSceneShell from "./FieldSceneShell";

/**
 * 본문 대응: #carry — p=17, 정규 값 16+16=32 (답 15).
 * 32 = 100000₂: 5비트 칸 밖으로 1이 넘침.
 * 넘친 1을 버리면 00000=0 → 0<17이라 빼지 않음 → 0 (틀림).
 * 넘친 1을 기억하면 32 ≥ 17 → 32−17 = 15 (맞음).
 */
const BITS = 6;
const toBits = (value: number): number[] => Array.from({ length: BITS }, (_, i) => (value >> (BITS - 1 - i)) & 1);

const SCENES = [
  { label: "16 + 16 = 32", summary: "100000₂: 1이 다섯 칸 밖으로 넘침", kept: null, note: "16은 10000₂입니다. 둘을 더한 32는 여섯 번째 자리에 1이 생겨 다섯 비트 저장 공간 밖으로 넘칩니다." },
  { label: "넘친 1을 버리면", summary: "00000₂ = 0 → 0 < 17 → 0", kept: false, note: "다섯 칸만 남기면 0입니다. 0은 17보다 작아 p를 빼지 않고 그대로 0을 돌려줍니다. 답 15와 다릅니다." },
  { label: "넘친 1을 함께 보면", summary: "32 ≥ 17 → 32 − 17 = 15", kept: true, note: "올림 비트까지 비교하면 합은 32이고 17 이상이므로 한 번 뺍니다. 정규 값 두 개의 합은 2p보다 작아 한 번이면 충분합니다." },
] as const;

const ROWS = [
  { name: "16", value: 16 },
  { name: "+ 16", value: 16 },
  { name: "= 32", value: 32 },
] as const;

export default function CarryDropViz() {
  return (
    <FieldSceneShell
      eyebrow="넘친 비트"
      title="합의 넘친 비트를 버리면 p와 비교하기 전에 값이 바뀝니다"
      description="한 줄이 이진수이며 실선 칸 다섯 개가 5비트 저장 공간입니다. 맨 왼쪽 점선 칸이 저장 공간 밖으로 넘친 올림 비트 자리입니다. p=17입니다."
      ariaLabel="16 더하기 16에서 올림 비트를 버린 경우와 보존한 경우의 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const result = scene.kept === null ? null : scene.kept ? 15 : 0;
        return (
          <div className="min-w-0">
            <div className="space-y-1.5">
              {ROWS.map((row) => (
                <div key={row.name} className="grid grid-cols-[3.25rem_repeat(6,minmax(0,1fr))_2.5rem] items-center gap-1">
                  <span className="font-mono text-xs font-semibold">{row.name}</span>
                  {toBits(row.value).map((bit, i) => {
                    const carry = i === 0;
                    const dropped = carry && scene.kept === false && row.value === 32;
                    return (
                      <span
                        key={i}
                        className={`rounded-sm border py-1 text-center font-mono text-sm ${
                          carry ? "border-dashed" : ""
                        } ${dropped ? "border-red-600 text-red-700 line-through dark:text-red-400" : carry && bit === 1 ? "border-amber-600 font-bold text-amber-700 dark:text-amber-400" : bit === 1 ? "border-primary/60 font-bold" : "border-border/60 text-muted-foreground"}`}
                      >
                        {carry && bit === 0 ? "·" : bit}
                      </span>
                    );
                  })}
                  <span className="text-right font-mono text-sm font-bold">{row.value === 32 && scene.kept === false ? 0 : row.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-1">
              <span className="font-mono text-xs font-semibold">결과</span>
              <div
                className={`rounded-lg border px-3 py-2 text-sm ${
                  result === null ? "border-dashed border-border/50 text-muted-foreground" : result === 15 ? "border-emerald-600" : "border-red-600"
                }`}
              >
                {result === null ? (
                  "아직 p와 비교 전"
                ) : (
                  <>
                    <span className={`font-mono font-bold ${result === 15 ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>{result}</span>
                    <span className="ml-2 text-muted-foreground">{result === 15 ? "답 15와 같음" : "답 15와 다름"}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
