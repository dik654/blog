import SceneShell from "./SceneShell";

/**
 * 본문 대응: #attestation-creation "고정 사례: reorg와 늦은 block이 겹친 slot".
 * D1→D2 dependent root 변경, due time 전/후 block 도착, 늦은 더 좋은 head에 재서명 금지.
 * 시간선의 due time과 사건 위치는 순서만 나타낸다(가정). 초 단위 값은 preset·클라이언트 설정에 따른다.
 */
const W = 360;
const H = 172;
const LINE_Y = 118;
const X_START = 24;
const X_END = 340;
const X_DUE = 196;

type Mark = { x: number; text: string; color: string; cross?: boolean; up?: boolean };

const SCENES: readonly {
  label: string;
  summary: string;
  root: "d1" | "d2" | "fixed";
  marks: readonly Mark[];
  note: string;
}[] = [
  {
    label: "D1 기준 duty",
    summary: "slot 352 · committee 2 · position 17",
    root: "d1",
    marks: [],
    note: "Dependent root D1에서 validator 17이 slot 352, committee 2, position 17 duty를 받았습니다. Dependent root는 duty 배정이 기대고 있는 chain의 root이므로, 이 값이 바뀌면 배정도 다시 봐야 합니다.",
  },
  {
    label: "서명 전에 D2로",
    summary: "D1 duty 폐기 → D2에서 다시 구함",
    root: "d2",
    marks: [],
    note: "서명 전에 dependent root가 D2로 바뀌면 D1의 duty와 bit position을 버리고 D2에서 assignment와 head·source·target을 다시 구합니다. 같은 epoch라는 이유로 D1 기준 cache를 재사용하지 않습니다.",
  },
  {
    label: "block이 제때 도착",
    summary: "due time 전 도착 → 그때의 head를 관찰",
    root: "fixed",
    marks: [
      { x: 110, text: "block 도착", color: "#2563eb", up: true },
      { x: 150, text: "그때의 head 관찰", color: "#16a34a" },
    ],
    note: "Expected block이 protocol due time 전에 도착하면 그때의 head를 관찰해 표를 만듭니다. 이 head가 표의 head root가 됩니다.",
  },
  {
    label: "block이 늦음",
    summary: "due time의 현재 view로 서명",
    root: "fixed",
    marks: [
      { x: X_DUE, text: "현재 view로 서명 1회", color: "#16a34a" },
      { x: 280, text: "늦은 block", color: "#64748b", up: true },
    ],
    note: "Due time까지 block이 오지 않으면 기다리지 않고 due time의 현재 view로 slashing check와 signing intent 저장을 거쳐 한 번 서명합니다.",
  },
  {
    label: "더 좋은 head가 뒤늦게",
    summary: "같은 target epoch로 다시 서명하지 않음",
    root: "fixed",
    marks: [
      { x: X_DUE, text: "서명 1회", color: "#16a34a" },
      { x: 290, text: "더 좋은 head 수신", color: "#2563eb", up: true },
      { x: 318, text: "재서명 ×", color: "#dc2626", cross: true },
    ],
    note: "서명한 뒤 더 좋은 head를 받았더라도 같은 target epoch의 conflicting attestation을 다시 서명하지 않습니다. 다시 서명하면 slashing protection의 double vote에 해당합니다.",
  },
];

export default function DutyTimingViz() {
  return (
    <SceneShell
      eyebrow="Validator 17 · slot 352"
      title="서명 전에는 duty를 다시 구할 수 있지만, 서명한 뒤에는 같은 target으로 다시 서명하지 않습니다"
      description="위 띠는 duty가 기대는 dependent root, 아래 선은 slot 352 안의 시간 순서입니다. Due time과 사건의 위치는 순서만 보이며 실제 초 단위 간격이 아닙니다(가정)."
      note="Due time의 실제 값은 slot duration과 intervals-per-slot 설정에 따릅니다."
      ariaLabel="Dependent root 변경과 due time 전후 block 도착에 따른 attestation 서명 시점"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X_START} y={18} fontSize={10} fill="#64748b">
              dependent root
            </text>
            <rect x={X_START} y={26} width={84} height={30} rx={6} fill="none" stroke={scene.root === "d1" ? "#2563eb" : "#94a3b8"} strokeWidth={scene.root === "d1" ? 1.25 : 1} strokeOpacity={scene.root === "fixed" ? 0.5 : 1} />
            <text x={X_START + 42} y={45} textAnchor="middle" fontSize={11} fontWeight={700} fill={scene.root === "d2" ? "#dc2626" : "#475569"} textDecoration={scene.root === "d2" ? "line-through" : undefined} opacity={scene.root === "fixed" ? 0.5 : 1}>
              D1
            </text>
            <rect x={X_START + 96} y={26} width={84} height={30} rx={6} fill="none" stroke={scene.root === "d2" ? "#2563eb" : "#94a3b8"} strokeWidth={scene.root === "d2" ? 1.25 : 1} strokeDasharray={scene.root === "d1" ? "3 3" : undefined} strokeOpacity={scene.root === "fixed" ? 0.5 : 1} />
            <text x={X_START + 138} y={45} textAnchor="middle" fontSize={11} fontWeight={700} fill={scene.root === "d2" ? "#2563eb" : "#94a3b8"} opacity={scene.root === "fixed" ? 0.5 : 1}>
              D2
            </text>
            <text x={X_START} y={78} fontSize={10.5} fontWeight={700} fill={scene.root === "fixed" ? "#94a3b8" : scene.root === "d1" ? "#2563eb" : "#dc2626"}>
              {scene.root === "d1"
                ? "duty: slot 352 · committee 2 · position 17"
                : scene.root === "d2"
                  ? "D1 duty·bit 폐기 → D2에서 다시 계산"
                  : "duty를 정한 뒤, slot 안에서 언제 서명하나"}
            </text>

            <line x1={X_START} x2={X_END} y1={LINE_Y} y2={LINE_Y} stroke="#94a3b8" strokeWidth={1} />
            <text x={X_START} y={LINE_Y + 18} fontSize={10.5} fill="#64748b">slot 352 시작</text>
            <line x1={X_DUE} x2={X_DUE} y1={LINE_Y - 34} y2={LINE_Y + 6} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
            <text x={X_DUE} y={LINE_Y + 18} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#d97706">due time</text>
            <text x={X_END} y={LINE_Y + 18} textAnchor="end" fontSize={10.5} fill="#64748b">시간 →</text>
            {scene.marks.map((mark) => (
              <g key={mark.text}>
                {mark.cross ? (
                  <g stroke={mark.color} strokeWidth={1.25}>
                    <line x1={mark.x - 4} x2={mark.x + 4} y1={LINE_Y - 4} y2={LINE_Y + 4} />
                    <line x1={mark.x - 4} x2={mark.x + 4} y1={LINE_Y + 4} y2={LINE_Y - 4} />
                  </g>
                ) : (
                  <circle cx={mark.x} cy={LINE_Y} r={4} fill={mark.color} />
                )}
                <text
                  x={mark.x}
                  y={mark.up ? LINE_Y - 22 : LINE_Y + 34}
                  textAnchor={mark.x > 290 ? "end" : "middle"}
                  fontSize={10}
                  fontWeight={700}
                  fill={mark.color}
                >
                  {mark.text}
                </text>
              </g>
            ))}
            {scene.marks.length === 0 && (
              <text x={(X_START + X_DUE) / 2} y={LINE_Y - 14} textAnchor="middle" fontSize={10} fill="#94a3b8">
                아직 서명 전
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
