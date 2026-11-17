import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #prover-rounds permutation ExplainedFormula —
 * Z(ω^{i+1}) = Z(ω^i) · Π (w + β·원래 위치 + γ)/(w + β·copy 위치 + γ), Z(1)=1, 맞으면 Z(ω^n)=1.
 * 축소 예(가정): 실제 field 대신 정수, 위치표 k_jω^i 대신 번호 1–4, β=2, γ=1.
 * copy로 묶인 칸만 그림: ①행1·c ②행2·a ③행3·a ④행3·b, 모두 12. σ: ①↔③, ②↔④.
 * 분자 15,17,19,21 / 분모 19,21,15,17 → 행1 15/19, 행2 85/133, 행3 1.
 * ④를 11로 바꾸면 분자 20, 분모 16 → 행3 85/84 ≠ 1.
 */
const BETA = 2;
const GAMMA = 1;

type Cell = { id: number; pos: string; row: number; sigma: number };
const CELLS: readonly Cell[] = [
  { id: 1, pos: "행1 · c", row: 1, sigma: 3 },
  { id: 2, pos: "행2 · a", row: 2, sigma: 4 },
  { id: 3, pos: "행3 · a", row: 3, sigma: 1 },
  { id: 4, pos: "행3 · b", row: 3, sigma: 2 },
];

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

function factors(broken: boolean) {
  return CELLS.map((cell) => {
    const w = broken && cell.id === 4 ? 11 : 12;
    return { ...cell, w, num: w + BETA * cell.id + GAMMA, den: w + BETA * cell.sigma + GAMMA };
  });
}

function zAfter(broken: boolean, row: number) {
  const used = factors(broken).filter((cell) => cell.row <= row);
  const num = used.reduce<number>((acc, cell) => acc * cell.num, 1);
  const den = used.reduce<number>((acc, cell) => acc * cell.den, 1);
  const g = gcd(num, den);
  return { text: num === den ? "1" : `${num / g}/${den / g}`, value: num / den };
}

const SCENES = [
  { label: "Copy로 묶인 칸", summary: "①↔③ · ②↔④", upto: 0, broken: false, note: "같은 변수 12가 네 칸에 나타납니다. ①행1·c와 ③행3·a, ②행2·a와 ④행3·b가 copy constraint로 묶여 있어, 각 칸의 copy 위치 σ는 짝의 번호입니다. 원래 위치는 자기 번호입니다." },
  { label: "행 1까지 누적", summary: "Z = 1 × 15/19", upto: 1, broken: false, note: "Z는 1에서 시작합니다. 행 1의 칸 ①은 분자 12+2·1+1=15, 분모 12+2·3+1=19를 곱합니다. copy가 없는 칸은 원래 위치와 copy 위치가 같아 비율이 1이므로 그림에서 뺐습니다." },
  { label: "행 2까지 누적", summary: "Z = 15/19 × 17/21 = 85/133", upto: 2, broken: false, note: "행 2의 칸 ②는 분자 17, 분모 21을 곱합니다. 아직 짝이 나오지 않아 분자와 분모가 서로 다른 수로 남아 있습니다." },
  { label: "행 3에서 상쇄", summary: "× 19/15 × 21/17 = 1", upto: 3, broken: false, note: "행 3의 ③과 ④가 분자 19·21, 분모 15·17을 가져옵니다. 앞에서 남은 분모 19·21과 분자 15·17이 정확히 지워져 Z가 1로 돌아옵니다. 분자 묶음과 분모 묶음이 같은 multiset이기 때문입니다." },
  { label: "Copy가 틀리면 (가정)", summary: "④=11 → Z = 85/84 ≠ 1", upto: 3, broken: true, note: "④에 12 대신 11을 넣으면 ④의 분자는 11+2·4+1=20, 분모는 11+2·2+1=16이 됩니다. ②의 분모 21은 그대로라 짝이 맞지 않고, 마지막 Z는 1이 아닌 85/84가 됩니다." },
] as const;

const STEPS = [0, 1, 2, 3] as const;

function Scene({ upto, broken }: { upto: number; broken: boolean }) {
  const cells = factors(broken);
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))] gap-px overflow-hidden rounded-lg border border-border bg-border text-center font-mono text-[11px] leading-5 sm:text-xs">
        {["칸", "값 w", "σ", "분자", "분모"].map((head) => (
          <span key={head} className="bg-background px-1 py-1.5 font-sans font-bold text-muted-foreground">{head}</span>
        ))}
        {cells.map((cell) => {
          const on = cell.row <= upto;
          const wrong = broken && cell.id === 4;
          const tone = on ? "" : "text-muted-foreground/50";
          return (
            <div key={cell.id} className="contents">
              <span className={`bg-background px-1 py-1.5 font-sans ${tone}`}>{"①②③④"[cell.id - 1]} {cell.pos}</span>
              <span className={`bg-background px-1 py-1.5 ${wrong ? "font-bold text-red-700 dark:text-red-400" : tone}`}>{cell.w}</span>
              <span className={`bg-background px-1 py-1.5 ${tone}`}>{"①②③④"[cell.sigma - 1]}</span>
              <span className={`bg-background px-1 py-1.5 ${on ? "font-bold" : tone}`}>{upto === 0 ? "·" : cell.num}</span>
              <span className={`bg-background px-1 py-1.5 ${on ? "font-bold" : tone}`}>{upto === 0 ? "·" : cell.den}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] leading-5 text-muted-foreground sm:text-xs">분자 = w + 2·(자기 번호) + 1 · 분모 = w + 2·(σ 번호) + 1</p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {STEPS.map((row) => {
          const z = row === 0 ? { text: "1", value: 1 } : zAfter(broken, row);
          const shown = row <= upto;
          const end = row === 3 && shown;
          const color = end ? (broken ? "#dc2626" : "#16a34a") : "#2563eb";
          return (
            <div key={row} className="min-w-0 text-center">
              <svg viewBox="0 0 60 56" className="mx-auto h-auto w-full max-w-[90px]" aria-hidden>
                <line x1={4} x2={56} y1={10} y2={10} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
                {shown && <rect x={18} y={54 - z.value * 44} width={24} height={z.value * 44} rx={2} fill={color} fillOpacity={0.8} />}
                <line x1={4} x2={56} y1={54} y2={54} stroke="#94a3b8" strokeWidth={1} />
              </svg>
              <p className="text-[10px] text-muted-foreground">{row === 0 ? "시작" : `행 ${row} 뒤`}</p>
              <p className={`font-mono text-xs font-bold ${shown ? "" : "text-transparent"}`}>{z.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PermutationProductViz() {
  return (
    <SceneShell
      eyebrow="누적곱 Z가 1로 돌아오는 과정"
      title="짝이 맞는 칸의 비율은 뒤에서 서로 지워집니다"
      description="축소 예입니다(가정): 실제 field 원소 대신 정수, 위치표 kⱼωⁱ 대신 칸 번호, β=2·γ=1을 씁니다. σ는 각 칸이 copy로 연결된 짝의 번호입니다. 아래 막대의 점선 높이가 1입니다."
      ariaLabel="permutation 누적곱 Z가 행마다 곱해지고 copy 짝이 맞으면 1로 돌아오는 축소 예"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <Scene key={scene.label} upto={scene.upto} broken={scene.broken} />
          ))}
        />
      )}
    />
  );
}
