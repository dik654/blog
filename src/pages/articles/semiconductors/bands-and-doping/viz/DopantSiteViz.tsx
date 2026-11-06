import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dopants — 실리콘 자리 하나를 인 또는 붕소로 바꾼 격자.
 * 인: 네 전자는 결합, 하나는 풀리기 쉬움 → 풀리면 제자리에 양전하 도너 이온.
 * 1 cm³ 장부(가정): 전자 약 10¹⁶, 도너 이온 약 10¹⁶, 순전하 거의 0.
 * 붕소: 바깥 전자가 하나 적어 결합의 빈자리를 만들기 쉽다.
 */
const W = 340;
const H = 176;
const COLS = 5;
const ROWS = 3;
const px = (col: number) => 34 + col * 52;
const py = (row: number) => 30 + row * 58;
const CX = px(2);
const CY = py(1);
const LABEL_X = 266;

type Stage = "pure" | "donor" | "ionized" | "acceptor";

interface SiteState {
  stage: Stage;
  electrons: string;
  ions: string;
  net: string;
}

const STATES: readonly SiteState[] = [
  { stage: "pure", electrons: "—", ions: "—", net: "—" },
  { stage: "donor", electrons: "풀리기 전", ions: "풀리기 전", net: "—" },
  { stage: "ionized", electrons: "1개", ions: "1개", net: "−1 + 1 = 0" },
  { stage: "ionized", electrons: "약 10¹⁶개", ions: "약 10¹⁶개", net: "거의 0" },
  { stage: "acceptor", electrons: "—", ions: "—", net: "—" },
];

const SCENES = [
  { label: "실리콘만 있는 자리", summary: "가운데 자리의 전자 4개가 결합", note: "가운데 원자의 바깥 전자는 이웃과의 결합 넷에 하나씩 들어갑니다." },
  { label: "인을 넣은 자리", summary: "결합 4 + 남은 전자 1", note: "바깥 전자가 하나 더 있는 인을 넣습니다. 네 전자는 결합하고 남은 하나는 풀리기 쉽습니다. 전자를 내놓는 이런 원자가 도너입니다." },
  { label: "전자가 풀려난 뒤", summary: "움직이는 전자 + 고정된 양전하", note: "전자는 떠나 움직이지만 원자는 제자리에 남아 움직이지 않는 양전하 도너 이온이 됩니다." },
  { label: "1 cm³의 장부로 늘리면", summary: "−10¹⁶ + 10¹⁶ ≈ 0", note: "도너 10¹⁶개가 거의 모두 이온화한다고 가정합니다. 전자가 백만 배로 늘어도 멀리 떨어진 균일한 재료의 순전하는 거의 0입니다." },
  { label: "반대로 붕소를 넣으면", summary: "결합 3 + 결합의 빈자리", note: "바깥 전자가 하나 적은 붕소는 결합의 빈자리를 만들기 쉽습니다. 이런 원자가 억셉터이고, 수치는 9절에서 계산합니다." },
] as const;

const BOND_DOTS: readonly { x: number; y: number }[] = [
  { x: CX - 26, y: CY },
  { x: CX + 26, y: CY },
  { x: CX, y: CY - 29 },
  { x: CX, y: CY + 29 },
];

const CENTER_LABEL: Record<Stage, string> = { pure: "Si", donor: "P", ionized: "P⁺", acceptor: "B" };

export default function DopantSiteViz() {
  return (
    <SceneShell
      eyebrow="결정 안의 한 자리"
      title="전자를 내놓은 원자는 양전하로 제자리에 남습니다"
      description="칸 하나가 결정 속 원자 자리입니다(Si 실리콘, P 인, B 붕소). 파란 점은 가운데 원자의 바깥 전자입니다."
      note="평면에 편 단순화입니다. 격자 크기와 전자 위치는 그림용이고 10¹⁶ 설정도 이 글의 가정입니다."
      ariaLabel="실리콘 자리를 인과 붕소로 바꾸었을 때의 전자와 고정 전하"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        const special = state.stage !== "pure";
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {Array.from({ length: ROWS }, (_, row) => (
                <line key={`h${row}`} x1={px(0)} x2={px(COLS - 1)} y1={py(row)} y2={py(row)} stroke="#94a3b8" strokeWidth={1} />
              ))}
              {Array.from({ length: COLS }, (_, col) => (
                <line key={`v${col}`} x1={px(col)} x2={px(col)} y1={py(0)} y2={py(ROWS - 1)} stroke="#94a3b8" strokeWidth={1} />
              ))}
              {Array.from({ length: ROWS * COLS }, (_, index) => {
                const row = Math.floor(index / COLS);
                const col = index % COLS;
                const isCenter = row === 1 && col === 2;
                return (
                  <g key={index}>
                    <rect
                      x={px(col) - 15}
                      y={py(row) - 15}
                      width={30}
                      height={30}
                      rx={6}
                      fill={isCenter && special ? "#7c3aed" : "#64748b"}
                      stroke={isCenter && special ? "#7c3aed" : "#64748b"}
                      strokeWidth={1}
                    />
                    <text x={px(col)} y={py(row) + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">
                      {isCenter ? CENTER_LABEL[state.stage] : "Si"}
                    </text>
                  </g>
                );
              })}
              {BOND_DOTS.map((dot, index) => {
                const missing = state.stage === "acceptor" && index === 2;
                return (
                  <circle
                    key={index}
                    cx={dot.x}
                    cy={dot.y}
                    r={6}
                    fill={missing ? "#ffffff" : "#2563eb"}
                    stroke={missing ? "#d97706" : "#ffffff"}
                    strokeWidth={1}
                    strokeDasharray={missing ? "2 2" : undefined}
                  />
                );
              })}
              {state.stage === "donor" && (
                <g>
                  <circle cx={CX + 26} cy={CY - 29} r={6} fill="#2563eb" stroke="#ffffff" strokeWidth={1} />
                  <line x1={CX + 34} x2={LABEL_X - 4} y1={CY - 29} y2={CY - 29} stroke="#94a3b8" strokeWidth={1} />
                  <text x={LABEL_X} y={CY - 25} fontSize={11} fontWeight={700} fill="currentColor">남은 전자</text>
                </g>
              )}
              {state.stage === "ionized" && (
                <g>
                  <line x1={CX + 18} y1={CY - 22} x2={CX + 70} y2={CY - 29} stroke="#2563eb" strokeWidth={1.25} strokeDasharray="3 3" />
                  <circle cx={CX + 78} cy={CY - 29} r={6} fill="#2563eb" stroke="#ffffff" strokeWidth={1} />
                  <line x1={CX + 86} x2={LABEL_X - 4} y1={CY - 29} y2={CY - 29} stroke="#94a3b8" strokeWidth={1} />
                  <text x={LABEL_X} y={CY - 25} fontSize={11} fontWeight={700} fill="currentColor">움직이는 전자</text>
                  <line x1={CX + 8} x2={LABEL_X - 4} y1={CY + 29} y2={CY + 29} stroke="#94a3b8" strokeWidth={1} />
                  <line x1={CX + 8} x2={CX + 8} y1={CY + 16} y2={CY + 29} stroke="#94a3b8" strokeWidth={1} />
                  <text x={LABEL_X} y={CY + 33} fontSize={11} fontWeight={700} fill="currentColor">고정된 이온</text>
                </g>
              )}
              {state.stage === "acceptor" && (
                <g>
                  <line x1={CX + 8} x2={LABEL_X - 4} y1={CY - 29} y2={CY - 29} stroke="#94a3b8" strokeWidth={1} />
                  <text x={LABEL_X} y={CY - 25} fontSize={11} fontWeight={700} fill="#d97706">결합의 빈자리</text>
                </g>
              )}
            </svg>
            <dl className="mt-2 grid grid-cols-3 gap-1.5 text-[11px] sm:text-xs">
              <div className="min-w-0 rounded-lg border border-border px-2 py-1.5">
                <dt className="text-muted-foreground">움직이는 전자</dt>
                <dd className="font-mono font-bold">{state.electrons}</dd>
              </div>
              <div className="min-w-0 rounded-lg border border-border px-2 py-1.5">
                <dt className="text-muted-foreground">고정된 양전하</dt>
                <dd className="font-mono font-bold">{state.ions}</dd>
              </div>
              <div className="min-w-0 rounded-lg border border-border px-2 py-1.5">
                <dt className="text-muted-foreground">합친 전하</dt>
                <dd className="font-mono font-bold">{state.net}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
