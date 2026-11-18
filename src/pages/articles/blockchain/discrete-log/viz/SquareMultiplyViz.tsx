import SceneShell from "./SceneShell";

/**
 * 본문 대응: #forward-cost — 비밀 지수를 아는 쪽은 제곱 사다리에서 필요한 칸만 곱한다.
 * 모두 mod 17: 3¹=3, 3²=9, 3⁴=81→13, 3⁸=169→16.
 * x=5=101₂: 3·13=39→5 (제곱 2번 + 곱셈 1번 = 3번, 하나씩이면 5번).
 * x=13=1101₂: 3·13=39→5, 5·16=80→12 (제곱 3번 + 곱셈 2번 = 5번, 하나씩이면 13번). 7절 표의 x=13 값 12와 같다.
 */
const LADDER = [
  { power: "3¹", value: 3, calc: "출발" },
  { power: "3²", value: 9, calc: "3×3=9" },
  { power: "3⁴", value: 13, calc: "9²=81→13" },
  { power: "3⁸", value: 16, calc: "13²=169→16" },
] as const;

type Scene = {
  label: string;
  summary: string;
  note: string;
  rungs: number;
  bits: readonly number[];
  naive: number;
  squarings: number;
  mults: number;
  product: string;
};

const SCENES: readonly Scene[] = [
  {
    label: "하나씩 곱하면",
    summary: "x=5 → 곱셈 5번",
    note: "3절처럼 1에서 3을 한 번씩 곱하면 반복 횟수만큼 곱셈이 필요합니다. 횟수가 커지면 이 줄도 그만큼 길어집니다.",
    rungs: 0,
    bits: [],
    naive: 5,
    squarings: 0,
    mults: 0,
    product: "1→3→9→10→13→5",
  },
  {
    label: "제곱 사다리",
    summary: "3 → 9 → 13",
    note: "직전 값을 제곱하면 지수가 두 배가 됩니다. 3², 3⁴를 두 번의 제곱으로 얻었습니다. 각 칸도 바로 17로 나눈 나머지만 남깁니다.",
    rungs: 3,
    bits: [],
    naive: 5,
    squarings: 2,
    mults: 0,
    product: "아직 곱하지 않음",
  },
  {
    label: "5 = 101₂",
    summary: "3¹ × 3⁴ = 3×13 → 5",
    note: "5=4+1이므로 1인 자리의 3¹과 3⁴만 곱합니다. 39를 17로 나눈 나머지 5가 공개 값입니다. 제곱 2번과 곱셈 1번, 모두 3번의 연산입니다.",
    rungs: 3,
    bits: [1, 0, 1],
    naive: 5,
    squarings: 2,
    mults: 1,
    product: "3×13=39→5",
  },
  {
    label: "13 = 1101₂",
    summary: "3¹ × 3⁴ × 3⁸ → 12",
    note: "사다리를 한 칸 더 올려 3⁸=16을 얻고 3¹·3⁴·3⁸을 곱합니다. 7절 표의 x=13 자리 값 12와 같습니다. 하나씩 곱하면 13번이지만 여기서는 5번입니다(연산 횟수이며 시간 측정이 아닙니다).",
    rungs: 4,
    bits: [1, 0, 1, 1],
    naive: 13,
    squarings: 3,
    mults: 2,
    product: "3×13=39→5, 5×16=80→12",
  },
];

const MAX_OPS = 13;

function OpsBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-3 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / MAX_OPS) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono font-semibold">{value}번</span>
    </div>
  );
}

export default function SquareMultiplyViz() {
  return (
    <SceneShell
      eyebrow="정방향 계산"
      title="제곱을 쌓아 두고 필요한 칸만 곱합니다"
      description="모든 값은 17로 나눈 나머지입니다. 위 칸은 3을 계속 제곱한 사다리이고, 아래 칸의 1·0은 비밀 지수를 이진수로 쓴 자릿값이며 낮은 자리부터 왼쪽에 놓았습니다. 1인 칸의 값만 곱합니다."
      ariaLabel="지수 5와 13을 이진수로 나눠 3의 제곱 사다리에서 필요한 값만 곱하는 계산"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {LADDER.map((rung, index) => {
                const built = index < scene.rungs;
                const bit = scene.bits.length > index ? scene.bits[index] : null;
                const picked = bit === 1;
                return (
                  <div key={rung.power} className="min-w-0 text-center">
                    <div className={`rounded-lg border px-1 py-2 ${picked ? "border-blue-600" : built ? "border-border bg-background" : "border-dashed border-border/50"}`}>
                      <div className="font-mono text-xs text-muted-foreground">{rung.power}</div>
                      <div className={`font-mono text-lg font-bold ${picked ? "text-blue-700 dark:text-blue-400" : built ? "" : "text-muted-foreground/40"}`}>{built ? rung.value : "·"}</div>
                      <div className="whitespace-nowrap font-mono text-[10px] leading-4 text-muted-foreground">{built ? rung.calc : "아직"}</div>
                    </div>
                    <div className={`mt-1 font-mono text-sm ${bit === null ? "text-muted-foreground/40" : picked ? "font-bold text-blue-700 dark:text-blue-400" : "text-muted-foreground"}`}>
                      {bit === null ? "–" : `자리 ${bit}`}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-lg border border-border px-3 py-2 text-center font-mono text-sm font-semibold">{scene.product}</div>
            <div className="space-y-2">
              <OpsBar label="하나씩 곱하기" value={scene.naive} color="#94a3b8" />
              <OpsBar label="제곱+곱하기" value={scene.squarings + scene.mults} color="#2563eb" />
            </div>
          </div>
        );
      }}
    />
  );
}
