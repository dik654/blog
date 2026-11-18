import FrobSceneShell from "./FrobSceneShell";

/**
 * 본문 대응: #why-free — 일반 pow는 결과 1에서 시작해 지수의 첫 1비트부터 비트마다 제곱하고, 비트가 1이면 입력을 곱한다.
 * 지수 3 = 이진수 11 → 제곱 2회, 곱 2회. 입력 x=1+u(F₉)이면 1 → 1 → 1+u → 2u → 1+2u (3절의 x²=2u, x³=1+2u).
 * BN254 바탕 소수 p: 254비트, 1비트 111개 → 코드 수준 제곱 254회, 곱 111회.
 */
const BITS = ["1", "1"] as const;

const SCENES = [
  { label: "시작", summary: "결과 = 1", bit: -1, value: "1", squares: 0, mults: 0, note: "결과를 1로 두고 지수 3을 이진수 11로 읽습니다. 아직 아무 연산도 하지 않았습니다." },
  { label: "첫째 비트 1", summary: "1² = 1 → ×x = 1+u", bit: 0, value: "1+u", squares: 1, mults: 1, note: "비트마다 먼저 제곱합니다. 결과가 1이라 제곱해도 1이지만 코드는 이 제곱을 그대로 호출합니다. 비트가 1이므로 입력 x=1+u를 곱합니다." },
  { label: "둘째 비트 1", summary: "(1+u)² = 2u → ×x = 1+2u", bit: 1, value: "1+2u", squares: 2, mults: 2, note: "다시 제곱해 2u를 얻고, 비트가 1이라 x를 한 번 더 곱해 1+2u가 됩니다. 3절의 직접 세제곱과 같은 답이며 장부는 제곱 두 번, 곱 두 번입니다." },
  { label: "BN254의 장부", summary: "제곱 254회 · 곱 111회", bit: 2, value: "", squares: 254, mults: 111, note: "254비트에 1비트가 111개인 p로 같은 반복문을 돌리면 코드 수준에서 제곱 254회와 곱 111회를 호출합니다. 기계어 명령 수나 측정 시간이 아니며, 표 변환에 남는 일의 비용은 이 글에서 재지 않았습니다." },
] as const;

function Counter({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-3 min-w-0 rounded-sm bg-muted/50">
        <div className="h-full rounded-sm bg-[#2563eb]" style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className="text-right font-mono font-bold">{value}</span>
    </div>
  );
}

function Picture({ scene }: { scene: number }) {
  const s = SCENES[scene];
  const big = scene === 3;
  const max = big ? 254 : 2;
  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground">{big ? "지수 p의 비트" : "지수 3의 비트"}</span>
        {big ? (
          <span className="rounded-md border border-border px-3 py-2 font-mono text-sm">254비트 · 그중 1이 111개</span>
        ) : (
          BITS.map((bit, index) => (
            <span
              key={index}
              className={`flex h-10 w-10 items-center justify-center rounded-md border font-mono text-base font-bold ${index === s.bit ? "border-[#2563eb] bg-[#dbeafe] text-[#1e3a8a]" : index < s.bit ? "border-border text-muted-foreground" : "border-dashed border-border text-muted-foreground"}`}
            >
              {bit}
            </span>
          ))
        )}
      </div>
      <div className="rounded-lg border border-border bg-background p-4">
        <p className="text-xs text-muted-foreground">{big ? "같은 반복문" : "결과 칸 (x = 1+u, 3의 나머지, u² = 2)"}</p>
        <p className="mt-1 min-h-8 font-mono text-xl font-bold">{big ? "비트마다 제곱, 1이면 곱" : s.value}</p>
      </div>
      <div className="space-y-2">
        <Counter label="제곱" value={s.squares} max={max} />
        <Counter label="곱" value={s.mults} max={max} />
        <p className="text-xs leading-5 text-muted-foreground">막대 끝 = {big ? "254회" : "2회"} (장면마다 기준이 다릅니다)</p>
      </div>
    </div>
  );
}

export default function PowLoopViz() {
  return (
    <FrobSceneShell
      eyebrow="일반 거듭제곱의 장부"
      title="지수의 비트마다 제곱하고 1이면 한 번 더 곱합니다"
      description="원문 pow가 x=1+u의 세제곱을 계산하는 순서입니다. 숫자는 3절의 F₉ 계산을 그대로 씁니다. 마지막 장면은 같은 반복문을 BN254의 바탕 소수 p에 쓸 때의 호출 횟수입니다."
      ariaLabel="지수 3의 두 비트를 읽으며 제곱과 곱을 세는 과정과 BN254 지수의 호출 횟수"
      scenes={SCENES}
      render={(index) => <Picture scene={index} />}
    />
  );
}
