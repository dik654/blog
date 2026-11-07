import SceneShell from "./SceneShell";

/**
 * 본문 대응: #wesolowski 의사코드 — T=4, ℓ=5로 네 번 돌린 값.
 * b=floor(2r/5), r←2r mod 5, π←π²·g^b. r: 1→2→4→3→1, b: 0,0,1,1, 지수: 0,0,0,1,3, π(mod 17): 1,1,1,3,10.
 */
const SCENES = [
  { label: "시작", summary: "π=1 · r=1", doubled: 0, r: 1, bits: 0, exponent: 0, pi: 1, note: "증명 원소는 군의 항등원(곱해도 값이 그대로인 원소) 1, 현재 나머지는 1에서 시작합니다." },
  { label: "1회", summary: "2r=2 < 5 → b=0", doubled: 2, r: 2, bits: 1, exponent: 0, pi: 1, note: "2r=2는 ℓ=5에 못 미치므로 몫의 bit는 0이고 나머지는 2입니다. π²·g⁰은 그대로 1입니다." },
  { label: "2회", summary: "2r=4 < 5 → b=0", doubled: 4, r: 4, bits: 2, exponent: 0, pi: 1, note: "2r=4도 5에 못 미칩니다. bit는 다시 0이고 나머지는 4입니다." },
  { label: "3회", summary: "2r=8 ≥ 5 → b=1", doubled: 8, r: 3, bits: 3, exponent: 1, pi: 3, note: "2r=8이 5를 넘습니다. bit는 1이고 나머지는 8−5=3입니다. π=1²·g=3, 곧 g¹입니다." },
  { label: "4회", summary: "2r=6 ≥ 5 → b=1", doubled: 6, r: 1, bits: 4, exponent: 3, pi: 10, note: "2r=6에서 bit는 1, 나머지는 1입니다. π=3²·3=27, mod 17로 10이고 g³입니다. 모인 bit 0011은 몫 q=3이며, 정수 q를 따로 저장하지 않았습니다." },
] as const;

const BITS = [0, 0, 1, 1];
const CELLS = Array.from({ length: 10 }, (_, index) => index);
const ACCENT = "#2563eb";

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-border px-2 py-2 text-center">
      <span className="block text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-base font-bold">{value}</span>
    </div>
  );
}

export default function ProofLongDivisionViz() {
  return (
    <SceneShell
      eyebrow="아래 의사코드를 네 번 돌리기 · g=3 · T=4 · ℓ=5 · mod 17"
      title="큰 몫을 저장하지 않고 π를 쌓습니다"
      description="칸 줄은 이번 회차의 2r입니다. 세로 경계선 ℓ=5를 넘으면 몫의 다음 bit b가 1이 되고, 넘은 부분이 새 나머지 r로 남습니다. 회차마다 π는 π²·g^b로 바뀝니다."
      ariaLabel="T=4, 소수 5로 의사코드를 네 번 돌리는 동안 나머지, 몫의 비트, 증명 원소의 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="mx-auto min-w-0 max-w-[560px] space-y-4">
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">{active === 0 ? "2r: 아직 계산 전" : `2r = ${scene.doubled}`}</p>
              <div className="grid grid-cols-10 gap-1">
                {CELLS.map((cell) => {
                  const filled = cell < scene.doubled;
                  const over = filled && cell >= 5;
                  return (
                    <div
                      key={cell}
                      className={`h-7 rounded-sm border ${cell === 5 ? "relative" : ""}`}
                      style={{ borderColor: filled ? (over ? "#d97706" : ACCENT) : "#cbd5e1", backgroundColor: filled ? (over ? "#d97706" : ACCENT) : "transparent" }}
                    >
                      {cell === 5 && <span aria-hidden="true" className="absolute -inset-y-1 -left-[3px] w-px bg-foreground" />}
                    </div>
                  );
                })}
              </div>
              <div className="mt-1 grid grid-cols-10 gap-1 text-xs text-muted-foreground">
                <span className="col-span-5 text-right">ℓ=5</span>
                <span className="col-span-5" style={{ color: "#d97706" }}>넘으면 b=1</span>
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">몫 q의 bit (왼쪽부터 채움)</p>
              <div className="grid grid-cols-4 gap-1">
                {BITS.map((bit, index) => (
                  <div key={index} className="flex h-9 items-center justify-center rounded-sm border border-border font-mono text-base font-bold">
                    {index < scene.bits ? bit : ""}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Tile label="나머지 r" value={String(scene.r)} />
              <Tile label="지금 π" value={`g^${scene.exponent}`} />
              <Tile label="π mod 17" value={String(scene.pi)} />
            </div>
          </div>
        );
      }}
    />
  );
}
