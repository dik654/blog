import SceneShell from "./SceneShell";

/**
 * 본문 대응: #fault-boundary — m1만 3→4로 틀리면 h=1, m=9.
 * 9^5 mod 35=4 ≠ 18, gcd(4−18, 35)=7. 아래 값은 모두 직접 계산한다.
 */
const P = 5;
const Q = 7;
const N = P * Q;
const E = 5;
const C = 18;
const Q_INV = 3;
const M2 = 2;

const powMod = (base: number, exp: number, mod: number) =>
  Array.from({ length: exp }).reduce<number>((acc) => (acc * base) % mod, 1);
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const mod = (a: number, m: number) => ((a % m) + m) % m;

const runs = [3, 4].map((m1) => {
  const h = mod((m1 - M2) * Q_INV, P);
  const m = M2 + Q * h;
  const back = powMod(m, E, N);
  return { m1, h, m, back };
});
const GOOD = runs[0];
const BAD = runs[1];
const DIFF = BAD.back - C;
const FACTOR = gcd(DIFF, N);

const ROWS = [
  { label: "작은 결과", good: `m₁=${GOOD.m1} · m₂=${M2}`, bad: `m₁=${BAD.m1} · m₂=${M2}` },
  { label: "합친 값", good: `h=${GOOD.h} → ${GOOD.m}`, bad: `h=${BAD.h} → ${BAD.m}` },
  { label: "공개 지수 되계산", good: `${GOOD.m}⁵ mod 35 = ${GOOD.back}`, bad: `${BAD.m}⁵ mod 35 = ${BAD.back}` },
  { label: "18과의 차이", good: "0", bad: `${DIFF}, gcd = ${FACTOR}` },
] as const;

const SCENES = [
  { label: "한쪽 계산만 틀림", summary: "m₁: 3 → 4", note: "기준 5 쪽 결과 m₁만 3 대신 4가 됐습니다. 기준 7 쪽 m₂=2는 그대로입니다." },
  { label: "합친 값도 범위 안", summary: "23 대신 9", note: "h=(4−2)×3 mod 5=1이라 2+7×1=9입니다. 9도 0~34 안에 있어 범위 검사만으로는 오류가 보이지 않습니다." },
  { label: "공개 지수로 되계산", summary: "9⁵ mod 35 = 4 ≠ 18", note: "정상 결과 23은 입력 c=18로 돌아가지만 9는 4가 됩니다. 이 차이로 오류를 알 수 있습니다." },
  { label: "차이에서 인수 7", summary: "gcd(4−18, 35) = 7", note: "9는 7로 나누면 23과 같은 2라서 4와 18도 7에서는 맞고, 5에서만 어긋납니다. 차이 −14는 7의 배수이고 5의 배수가 아니므로 gcd가 인수 7을 드러냅니다." },
] as const;

export default function FaultFactorViz() {
  return (
    <SceneShell
      eyebrow="재결합 오류"
      title="틀린 결과 하나와 공개값으로 인수가 드러납니다"
      description="왼쪽은 정상 계산, 오른쪽은 m₁만 틀린 계산입니다. 9절의 교육용 수 n=35, e=5, c=18, qInv=3을 그대로 씁니다(가정)."
      ariaLabel="m1이 3에서 4로 틀릴 때 합친 값 9, 되계산 4, gcd(4−18,35)=7"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-2 px-2 pb-2 text-muted-foreground sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)]">
            <span className="hidden sm:block" />
            <span className="font-semibold">정상</span>
            <span className="font-semibold text-red-700 dark:text-red-400">m₁만 틀림</span>
          </div>
          <div className="space-y-2">
            {ROWS.map((row, index) => {
              const shown = index <= active;
              const current = index === active;
              return (
                <div
                  key={row.label}
                  className={`grid min-h-[3.25rem] grid-cols-2 items-center gap-x-2 gap-y-1 rounded-lg border px-2 py-1.5 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] ${
                    current ? "border-primary/60 bg-background" : shown ? "border-border bg-background" : "border-dashed border-border/40"
                  }`}
                >
                  <span className={`col-span-2 sm:col-span-1 ${shown ? "font-semibold" : "text-muted-foreground/50"}`}>{row.label}</span>
                  <span className={`min-w-0 break-words font-mono ${shown ? "" : "invisible"}`}>{row.good}</span>
                  <span className={`min-w-0 break-words font-mono font-bold text-red-700 dark:text-red-400 ${shown ? "" : "invisible"}`}>{row.bad}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { m: P, same: false },
              { m: Q, same: true },
            ].map(({ m, same }) => (
              <div
                key={m}
                className={`rounded-lg border px-2 py-2 text-center ${active === 3 ? (same ? "border-emerald-600/60" : "border-red-600/60") : "border-dashed border-border/40"}`}
              >
                <span className={active === 3 ? "" : "invisible"}>
                  ÷{m}: 4→{4 % m}, 18→{C % m} · <strong>{same ? "같음" : "다름"}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
