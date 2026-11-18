import SceneShell from "./ForkIdSceneShell";

/**
 * 본문 대응: #release 둘째 문단 — 같은 미래 block에서 서로 다른 규칙을 고른 3-way fork를
 * EIP-2124만으로 완전히 구분할 수 없다. Fork ID에는 규칙 이름이 아니라 fork 숫자가 들어간다.
 * 예시: 공통 fork 5, block 10에서 규칙 A·규칙 B로 갈라지고, C는 10을 schedule에 넣지 않음(가정).
 * head 9: A (H₅,10), B (H₅,10), C (H₅,0). head 12: A (H₁₀,0), B (H₁₀,0), C (H₅,0).
 */

const W = 360;
const H = 168;
const X0 = 20;
const STEP = 16;
const TRUNK_Y = 84;
const bx = (block: number) => X0 + block * STEP;
const SPLIT = 10;
const END = 16;

const BRANCHES = [
  { key: "A", label: "규칙 A", y: 34, color: "#2563eb" },
  { key: "C", label: "fork 10 없음", y: TRUNK_Y, color: "#64748b" },
  { key: "B", label: "규칙 B", y: 134, color: "#7c3aed" },
] as const;

const SCENES = [
  {
    label: "갈라지기 전 · head 9",
    summary: "A (H₅, 10) = B (H₅, 10)",
    head: 9,
    tuples: { A: "(H₅, 10)", B: "(H₅, 10)", C: "(H₅, 0)" },
    note: "세 노드 모두 fork 5까지 같은 이력을 지나 hash는 H₅입니다. A와 B는 block 10에서 서로 다른 규칙을 적용할 예정이지만 FORK_NEXT에는 숫자 10만 들어가므로 두 tuple이 똑같습니다. C만 next 0으로 다르지만 hash가 같고 fork 10은 아직 오지 않았으므로, 지금은 서로 거절하지 않습니다.",
  },
  {
    label: "갈라진 뒤 · head 12",
    summary: "A (H₁₀, 0) = B (H₁₀, 0)",
    head: 12,
    tuples: { A: "(H₁₀, 0)", B: "(H₁₀, 0)", C: "(H₅, 0)" },
    note: "A와 B는 모두 CRC32(H₅ ∥ BE₈(10))을 계산해 같은 H₁₀을 얻습니다. 규칙 이름은 계산에 들어가지 않으므로 이미 다른 블록을 만들고 있어도 Fork ID는 같습니다.",
  },
  {
    label: "Fork ID가 거르는 쌍과 못 거르는 쌍",
    summary: "A↔C 거절 · A↔B 통과",
    head: 12,
    tuples: { A: "(H₁₀, 0)", B: "(H₁₀, 0)", C: "(H₅, 0)" },
    note: "A가 C의 (H₅, 0)을 받으면 H₅는 과거 값이지만 다음 fork 10과 next 0이 맞지 않아 거절합니다. 숫자가 다른 경우는 이렇게 걸러지지만, 같은 숫자 10을 쓴 A와 B는 구분하지 못합니다. 그래서 peer identity나 추가 식별을 따로 다뤄야 합니다.",
  },
] as const;

export default function ThreeWayForkViz() {
  return (
    <SceneShell
      eyebrow="EIP-2124의 한계"
      title="같은 block 10에서 다른 규칙을 골라도 Fork ID는 같습니다"
      description="3-way fork는 한 지점에서 체인이 세 갈래로 나뉘는 경우입니다. 공통 fork 5 뒤 block 10에서 A와 B가 서로 다른 규칙을 택하고, C는 10을 schedule에 넣지 않았다고 가정합니다. H₅·H₁₀은 fork 5·10까지 CRC32를 누산한 기호입니다."
      ariaLabel="같은 fork 숫자에서 갈라진 두 체인의 Fork ID가 같아지는 세 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const headX = bx(scene.head);
        const pairView = active === 2;
        return (
          <div className="min-w-0 lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-center lg:gap-5">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mx-auto h-auto w-full max-w-[440px]"
              role="img"
              aria-label={`${scene.label}: A ${scene.tuples.A}, B ${scene.tuples.B}, C ${scene.tuples.C}`}
            >
              <line x1={X0} x2={bx(SPLIT)} y1={TRUNK_Y} y2={TRUNK_Y} stroke="#475569" strokeWidth={1.25} />
              {BRANCHES.map((branch) => (
                <g key={branch.key}>
                  <path
                    d={`M ${bx(SPLIT)} ${TRUNK_Y} C ${bx(SPLIT) + 18} ${TRUNK_Y}, ${bx(SPLIT) + 14} ${branch.y}, ${bx(SPLIT) + 32} ${branch.y} L ${bx(END)} ${branch.y}`}
                    fill="none"
                    stroke={branch.color}
                    strokeWidth={1.25}
                    strokeDasharray={scene.head < SPLIT ? "4 3" : undefined}
                  />
                  <text x={bx(END) + 6} y={branch.y - 4} fontSize={13} fontWeight={700} fill={branch.color}>
                    {branch.key}
                  </text>
                  <text x={bx(END) + 6} y={branch.y + 12} fontSize={11} fill="#64748b">
                    {branch.label}
                  </text>
                </g>
              ))}
              {[
                { block: 0, label: "genesis" },
                { block: 5, label: "fork 5" },
                { block: SPLIT, label: "block 10" },
              ].map((tick) => (
                <g key={tick.block}>
                  <circle cx={bx(tick.block)} cy={TRUNK_Y} r={3.5} fill="#475569" />
                  <text x={bx(tick.block) - (tick.block === 0 ? 4 : 0)} y={TRUNK_Y + 20} textAnchor={tick.block === 0 ? "start" : "middle"} fontSize={12} fill="#475569">
                    {tick.label}
                  </text>
                </g>
              ))}
              <line x1={headX} x2={headX} y1={14} y2={scene.head < SPLIT ? TRUNK_Y + 6 : H - 6} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
              <text
                x={headX + (scene.head < SPLIT ? -4 : 4)}
                y={12}
                textAnchor={scene.head < SPLIT ? "end" : "start"}
                fontSize={12}
                fontWeight={700}
                fill="#b45309"
              >
                head {scene.head}
              </text>
            </svg>
            <div className="mt-3 grid grid-cols-3 lg:mt-0 lg:grid-cols-1 gap-px bg-border p-px">
              {BRANCHES.map((branch) => {
                const same = branch.key !== "C";
                return (
                  <div key={branch.key} className="min-w-0 bg-background px-2 py-2 sm:px-3">
                    <div className="text-[10px] font-semibold text-muted-foreground sm:text-[11px]">
                      {branch.key} · {branch.label}
                    </div>
                    <div className="mt-1 font-mono text-xs font-bold sm:text-sm">{scene.tuples[branch.key]}</div>
                    <div
                      className={`mt-1 break-keep text-[10px] leading-4 sm:text-[11px] ${
                        pairView
                          ? same
                            ? "font-semibold text-amber-700 dark:text-amber-400"
                            : "font-semibold text-red-700 dark:text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {pairView
                        ? same
                          ? "A·B 서로 구분 불가"
                          : "A가 거절"
                        : same
                          ? "A·B 값이 같음"
                          : scene.head < SPLIT
                            ? "next만 다름 · 아직 통과"
                            : "hash가 다름"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
