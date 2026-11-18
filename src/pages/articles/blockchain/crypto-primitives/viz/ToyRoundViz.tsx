import SceneShell from "./SceneShell";

/**
 * 본문 대응: #poseidon — F₁₇ 두 칸 모형.
 * (3,4)+(1,2)=(4,6) → full: (4³,6³)=(13,12) → 행렬 [[1,2],[3,4]] → (3,2)
 *                    → partial: (4³,6)=(13,6) → 같은 행렬 → (8,12)
 */
const P = 17;
const mod = (x: number) => ((x % P) + P) % P;
const mix = (a: number, b: number) => [mod(a + 2 * b), mod(3 * a + 4 * b)] as const;

const START = [3, 4] as const;
const ADDED = [mod(START[0] + 1), mod(START[1] + 2)] as const;
const FULL_SBOX = [mod(ADDED[0] ** 3), mod(ADDED[1] ** 3)] as const;
const FULL_OUT = mix(FULL_SBOX[0], FULL_SBOX[1]);
const PART_SBOX = [mod(ADDED[0] ** 3), ADDED[1]] as const;
const PART_OUT = mix(PART_SBOX[0], PART_SBOX[1]);

type Pair = readonly [number, number];
type Stage = { name: string; full: Pair | null; part: Pair | null; changed: readonly [boolean, boolean] };

const STAGES_BY_SCENE: readonly (readonly Stage[])[] = [
  [{ name: "입력", full: START, part: START, changed: [false, false] }, { name: "+ 상수 (1,2)", full: ADDED, part: ADDED, changed: [true, true] }],
  [{ name: "입력", full: START, part: START, changed: [false, false] }, { name: "+ 상수 (1,2)", full: ADDED, part: ADDED, changed: [false, false] }, { name: "세제곱", full: FULL_SBOX, part: null, changed: [true, true] }],
  [{ name: "입력", full: START, part: START, changed: [false, false] }, { name: "+ 상수 (1,2)", full: ADDED, part: ADDED, changed: [false, false] }, { name: "세제곱", full: FULL_SBOX, part: null, changed: [false, false] }, { name: "행렬 혼합", full: FULL_OUT, part: null, changed: [true, true] }],
  [{ name: "입력", full: START, part: START, changed: [false, false] }, { name: "+ 상수 (1,2)", full: ADDED, part: ADDED, changed: [false, false] }, { name: "세제곱", full: FULL_SBOX, part: PART_SBOX, changed: [true, false] }, { name: "행렬 혼합", full: FULL_OUT, part: null, changed: [false, false] }],
  [{ name: "입력", full: START, part: START, changed: [false, false] }, { name: "+ 상수 (1,2)", full: ADDED, part: ADDED, changed: [false, false] }, { name: "세제곱", full: FULL_SBOX, part: PART_SBOX, changed: [false, false] }, { name: "행렬 혼합", full: FULL_OUT, part: PART_OUT, changed: [true, true] }],
];

const SCENES = [
  { label: "상수 더하기", summary: "(3,4)+(1,2)=(4,6)", note: "두 라운드 모두 같은 출발점입니다. 모든 계산은 17로 나눈 나머지로 합니다." },
  { label: "full: 두 칸 세제곱", summary: "4³=64≡13 · 6³=216≡12", note: "full round는 두 칸 모두에 비선형 연산인 세제곱을 씁니다. 64=3×17+13, 216=12×17+12입니다." },
  { label: "full: 행렬로 섞기", summary: "(13,12) → (3,2)", note: "첫 줄 (1,2): 13+2×12=37≡3. 둘째 줄 (3,4): 3×13+4×12=87≡2. 한 칸의 값이 두 칸 모두에 퍼집니다." },
  { label: "partial: 첫 칸만 세제곱", summary: "(4,6) → (13,6)", note: "partial round는 첫 칸에만 세제곱을 씁니다. 둘째 칸 6은 그대로 내려옵니다." },
  { label: "partial: 행렬은 두 칸에", summary: "(13,6) → (8,12)", note: "뒤의 선형 혼합은 두 칸 모두에 적용합니다. 13+2×6=25≡8, 3×13+4×6=63≡12. 같은 입력이 full과 다른 결과 (3,2)와 (8,12)로 갈립니다." },
] as const;

function Cells({ pair, changed, color }: { pair: Pair | null; changed: readonly [boolean, boolean]; color: string }) {
  return (
    <div className="grid grid-cols-2 gap-1">
      {[0, 1].map((i) => (
        <span
          key={i}
          className="flex h-8 items-center justify-center rounded-md border font-mono text-sm"
          style={{
            borderColor: pair ? (changed[i] ? color : "#94a3b8") : "#cbd5e1",
            borderStyle: pair ? "solid" : "dashed",
            backgroundColor: pair && changed[i] ? `${color}1f` : "transparent",
            fontWeight: pair && changed[i] ? 700 : 500,
            color: pair ? (changed[i] ? color : undefined) : "transparent",
          }}
        >
          {pair ? pair[i] : "·"}
        </span>
      ))}
    </div>
  );
}

export default function ToyRoundViz() {
  return (
    <SceneShell
      eyebrow="F₁₇ 두 칸 모형"
      title="같은 (4,6)도 세제곱할 칸 수에 따라 결과가 갈립니다"
      description="한 줄이 한 단계, 칸 두 개가 상태의 두 원소입니다. full round는 두 칸 모두, partial round는 첫 칸만 세제곱합니다. 상수 (1,2)·행렬 (1,2 / 3,4)·17은 본문의 설명용 값이며 실제 Poseidon 매개변수가 아닙니다."
      ariaLabel="F17 두 칸 모형에서 full round와 partial round의 계산"
      scenes={SCENES}
      render={(active) => {
        const stages = STAGES_BY_SCENE[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-3 gap-y-2 text-xs sm:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)]">
              <span />
              <span className="text-center font-bold text-[#2563eb]">full round</span>
              <span className="text-center font-bold text-[#d97706]">partial round</span>
              {[0, 1, 2, 3].map((row) => {
                const stage = stages[row];
                return [
                  <span key={`n${row}`} className={stage ? "font-semibold" : "text-transparent"}>{stage ? stage.name : "·"}</span>,
                  <Cells key={`f${row}`} pair={stage ? stage.full : null} changed={stage && stage.full && active <= 2 ? stage.changed : [false, false]} color="#2563eb" />,
                  <Cells key={`p${row}`} pair={stage ? stage.part : null} changed={stage && stage.part && (active === 0 || active >= 3) ? stage.changed : [false, false]} color="#d97706" />,
                ];
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
