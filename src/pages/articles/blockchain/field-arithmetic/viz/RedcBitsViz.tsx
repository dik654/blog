import FieldSceneShell from "./FieldSceneShell";

/**
 * 본문 대응: #redc — p=17, R=32=2⁵, p′=15, T=21.
 * m = 21×15 mod 32 = 315 mod 32 = 27, mp = 459.
 * T + mp = 480 = 111100000₂ → 낮은 다섯 비트 0 → 480/32 = 15 (= 오른쪽으로 다섯 칸).
 * 15 < 17이라 보정 뺄셈 없음.
 */
const BITS = 9;
const LOW = 5;
const toBits = (value: number): number[] => Array.from({ length: BITS }, (_, i) => (value >> (BITS - 1 - i)) & 1);

const ROWS = [
  { name: "T", value: 21, from: 0 },
  { name: "+ m·p", value: 459, from: 1 },
  { name: "= T+mp", value: 480, from: 2 },
  { name: "÷ 32", value: 15, from: 3 },
] as const;

const SCENES = [
  { label: "T=21의 낮은 다섯 비트", summary: "21 = 10101₂", note: "R=32는 2의 다섯제곱이므로 32로 정확히 나누려면 오른쪽 다섯 비트가 모두 0이어야 합니다. 21은 그렇지 않습니다." },
  { label: "17의 배수 459를 더합니다", summary: "m = 21·15 mod 32 = 27, 27·17 = 459", note: "p′=15로 m=27을 고르고 17의 27배인 459를 더합니다. 17의 배수를 더했으므로 17로 나눈 나머지의 의미는 그대로입니다." },
  { label: "합 480의 낮은 다섯 비트가 0", summary: "480 = 111100000₂", note: "m을 이렇게 고른 덕분에 T+mp의 오른쪽 다섯 비트가 모두 0입니다. 이제 32로 나누어떨어집니다." },
  { label: "32로 나누기 = 다섯 칸 밀기", summary: "480 / 32 = 15", note: "낮은 다섯 비트를 버리고 나머지를 오른쪽으로 다섯 칸 옮기면 1111₂=15입니다. 15는 17보다 작아 마지막 뺄셈 없이 결과입니다." },
] as const;

export default function RedcBitsViz() {
  return (
    <FieldSceneShell
      eyebrow="REDC의 비트"
      title="17의 배수를 더해 낮은 다섯 비트를 비운 뒤 다섯 칸 밉니다"
      description="한 줄이 9비트 이진수이며 오른쪽이 가장 낮은 자리입니다. 음영 칸이 R=32로 나눌 때 0이어야 하는 낮은 다섯 비트입니다."
      ariaLabel="T=21에 459를 더해 480을 만들고 32로 나눠 15를 얻는 비트 계산"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-[4.25rem_repeat(9,minmax(0,1fr))_2.75rem] items-center gap-0.5 text-[10px] text-muted-foreground">
            <span />
            {Array.from({ length: BITS }, (_, i) => (
              <span key={i} className="text-center">2<sup>{BITS - 1 - i}</sup></span>
            ))}
            <span className="text-right">값</span>
          </div>
          <div className="mt-1 space-y-1.5">
            {ROWS.map((row) => {
              const shown = active >= row.from;
              const bits = toBits(row.value);
              const leading = bits.findIndex((bit) => bit === 1);
              return (
                <div key={row.name} className={`grid grid-cols-[4.25rem_repeat(9,minmax(0,1fr))_2.75rem] items-center gap-0.5 ${shown ? "" : "opacity-0"}`} aria-hidden={!shown}>
                  <span className="font-mono text-xs font-semibold">{row.name}</span>
                  {bits.map((bit, i) => {
                    const low = i >= BITS - LOW;
                    const lowZero = row.value === 480 && low;
                    return (
                      <span
                        key={i}
                        className={`rounded-sm border py-1 text-center font-mono text-sm ${
                          low && row.value !== 15 ? "bg-muted/60" : ""
                        } ${lowZero ? "border-emerald-600 font-bold text-emerald-700 dark:text-emerald-400" : bit === 1 ? "border-primary/60 font-bold" : "border-border/60 text-muted-foreground"}`}
                      >
                        {i < leading ? "·" : bit}
                      </span>
                    );
                  })}
                  <span className="text-right font-mono text-sm font-bold">{row.value}</span>
                </div>
              );
            })}
          </div>
          <p className={`mt-3 text-xs leading-5 text-muted-foreground ${active === 3 ? "" : "opacity-0"}`}>
            480의 앞쪽 비트 1111이 오른쪽 끝으로 옮겨져 15가 됩니다.
          </p>
        </div>
      )}
    />
  );
}
