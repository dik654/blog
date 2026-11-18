import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-decrypt — 원문 raw_decrypt의 CRT 경로, p=3, q=5, hp=1, hq=3, p⁻¹ mod q = 2.
 * c=92: 92² mod 9 = 4 → Lp=1 → mp=1 / 92⁴ mod 25 = 21 → Lq=4 → mq=4×3 mod 5=2 / u=(2−1)×2 mod 5=2 → 1+2×3=7.
 * c=173: 173² mod 9 = 4 → 1 → mp=1 / 173⁴ mod 25 = 16 → Lq=3 → mq=3×3 mod 5=4 / u=(4−1)×2 mod 5=1 → 1+1×3=4.
 */
const CASES = {
  92: { p: ["4", "1", "1"], q: ["21", "4", "2"], u: 2, m: 7, mp: 1, mq: 2 },
  173: { p: ["4", "1", "1"], q: ["16", "3", "4"], u: 1, m: 4, mp: 1, mq: 4 },
} as const;

const P_STEPS = ["c² mod 9", "Lp = (x−1)/3", "× hp(1) mod 3"] as const;
const Q_STEPS = ["c⁴ mod 25", "Lq = (x−1)/5", "× hq(3) mod 5"] as const;
const CANDIDATES = [1, 4, 7, 10, 13] as const;

const SCENES = [
  { label: "p²=9 갈래", summary: "92 → 4 → 1 → mp = 1", c: 92, note: "p=3 쪽에서는 c를 p−1=2제곱해 9로 나눈 나머지 4를 얻습니다. (4−1)/3=1이고, 미리 계산한 hp=1을 곱해 mod 3 값 mp=1이 나옵니다." },
  { label: "q²=25 갈래", summary: "92 → 21 → 4 → mq = 2", c: 92, note: "q=5 쪽에서는 c를 q−1=4제곱해 25로 나눈 나머지 21을 얻습니다. (21−1)/5=4에 hq=3을 곱하면 12, mod 5로 mq=2입니다." },
  { label: "두 나머지 합치기", summary: "u = (2−1)×2 mod 5 = 2 → 7", c: 92, note: "mod 3에서 1인 수는 1, 4, 7, 10, 13입니다. 1에서 p=3씩 u번 건너가 mod 5도 2가 되는 자리를 찾습니다. 2는 3의 mod 5 역원(3×2=6≡1)이고 u=2번 건너간 7이 답입니다." },
  { label: "173도 같은 길", summary: "mp = 1, mq = 4, u = 1 → 4", c: 173, note: "첫 암호문 173은 9 쪽에서 4 → 1 → 1, 25 쪽에서 16 → 3 → 4를 거칩니다. u=(4−1)×2 mod 5=1이므로 1+1×3=4를 반환합니다." },
] as const;

function Lane({ title, steps, values, on }: { title: string; steps: readonly string[]; values: readonly string[]; on: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${on ? "border-blue-600" : "border-border"}`}>
      <p className={`text-xs font-bold ${on ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground"}`}>{title}</p>
      <ol className="mt-2 grid grid-cols-3 gap-2">
        {steps.map((step, index) => (
          <li key={step} className="min-w-0 rounded-md border border-border/70 bg-background px-1.5 py-1.5 text-center">
            <span className="block text-[11px] leading-4 text-muted-foreground">{step}</span>
            <span className={`mt-1 block font-mono text-sm font-bold ${on ? "text-blue-700 dark:text-blue-400" : ""}`}>{values[index]}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function CrtDecryptViz() {
  return (
    <SceneShell
      eyebrow="CRT 복호"
      title="92를 9와 25 두 갈래로 복호한 뒤 하나로 합칩니다"
      description="원문 raw_decrypt는 n²=225에서 한 번에 풀지 않고 p²=9와 q²=25에서 따로 풉니다. hp=1, hq=3은 원문이 키를 만들 때 미리 계산해 둔 역원으로, 각 소수 쪽에서 복호 배율을 되돌립니다."
      ariaLabel="합산 암호문 92와 첫 암호문 173을 CRT 경로로 복호하는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const data = CASES[scene.c];
        const merge = active >= 2;
        return (
          <div className="min-w-0 space-y-3">
            <p className="text-sm">
              암호문 <span className="font-mono font-bold">c = {scene.c}</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Lane title={`p=3 갈래 → mp = ${data.mp}`} steps={P_STEPS} values={data.p} on={active === 0 || active === 3} />
              <Lane title={`q=5 갈래 → mq = ${data.mq}`} steps={Q_STEPS} values={data.q} on={active === 1 || active === 3} />
            </div>
            <div className={`rounded-lg border p-3 ${merge ? "border-amber-600" : "border-border"}`}>
              <p className={`text-xs font-bold ${merge ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>
                mod 3에서 {data.mp}인 후보 · 1에서 3씩 u번 건너감
              </p>
              <div className="mt-2 grid grid-cols-5 gap-1.5">
                {CANDIDATES.map((value, index) => {
                  const hit = merge && index === data.u;
                  return (
                    <div
                      key={value}
                      className={`rounded-md border px-1 py-1.5 text-center ${hit ? "border-amber-600 bg-amber-500/10" : "border-border/70 bg-background"}`}
                    >
                      <span className="block text-[11px] text-muted-foreground">u={index}</span>
                      <span className={`block font-mono text-base font-bold ${hit ? "text-amber-700 dark:text-amber-400" : merge ? "" : "text-muted-foreground/60"}`}>{value}</span>
                      <span className="block text-[11px] text-muted-foreground">mod 5 = {value % 5}</span>
                    </div>
                  );
                })}
              </div>
              <p className={`mt-2 font-mono text-sm ${merge ? "font-bold" : "text-muted-foreground/60"}`}>
                {merge ? `m = ${data.mp} + ${data.u}×3 = ${data.m}` : "m = mp + u×3"}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
