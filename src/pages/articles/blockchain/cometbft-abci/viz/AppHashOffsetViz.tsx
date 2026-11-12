import SceneShell from "./SceneShell";

/**
 * 본문 대응: #finalize-commit "A41은 B41이 아니라 다음 block header에 들어갑니다".
 * S_h = F(S_{h-1}, B_h), A_h = C(S_h), A_h는 B_{h+1} header의 AppHash.
 * h=41: S40+B41 → S41 → A41 → B42 header. 같은 규칙을 h=40에 적용하면 B41 header에는 A40이 들어 있다.
 */
const SCENES = [
  { label: "B41을 실행", summary: "S41 = F(S40, B41)", note: "결정된 B41을 이전 committed state S40에 결정적으로 실행해 S41을 얻습니다. 이 순간 B41 header는 이미 확정돼 있습니다." },
  { label: "A41을 계산", summary: "A41 = C(S41)", note: "S41의 commitment가 A41이고 FinalizeBlock response로 돌아옵니다. 아직 application disk에 영속화됐다는 뜻은 아닙니다." },
  { label: "B42 header에 기록", summary: "A41 → B42.AppHash", note: "A41은 다음 block인 B42 header의 AppHash 칸에 들어갑니다. 같은 규칙을 h=40에 적용하면 B41 header의 AppHash 칸에는 A40이 들어 있습니다." },
  { label: "한 높이 어긋난 읽기", summary: "B41.AppHash ≠ B41의 결과", note: "B41 header의 AppHash를 B41 실행 결과로 읽으면 실제로는 A40을 보고 있습니다. 그래서 로그에 decided height, response의 A41, committed height, 다음 header의 AppHash를 따로 남깁니다." },
] as const;

const W = 320;
const H = 210;
const C = {
  line: "#94a3b8",
  text: "#334155",
  muted: "#64748b",
  accent: "#2563eb",
  warn: "#dc2626",
  fill: "#f1f5f9",
  accentFill: "#dbeafe",
};

function Block({ x, name, appHash, highlight, warn }: { x: number; name: string; appHash: string; highlight: boolean; warn: boolean }) {
  const stroke = warn ? C.warn : highlight ? C.accent : C.line;
  return (
    <g>
      <rect x={x} y={18} width={135} height={66} rx={8} fill="#ffffff" stroke={C.line} strokeWidth={1} />
      <text x={x + 10} y={34} fontSize={11} fontWeight={700} fill={C.text}>{name}</text>
      <rect x={x + 8} y={42} width={119} height={20} rx={4} fill={highlight ? C.accentFill : C.fill} stroke={stroke} strokeWidth={highlight || warn ? 1.25 : 1} />
      <text x={x + 14} y={56} fontSize={11} fill={warn ? C.warn : C.text} fontWeight={highlight || warn ? 700 : 400}>AppHash = {appHash}</text>
      <text x={x + 10} y={76} fontSize={10} fill={C.muted}>transactions</text>
    </g>
  );
}

export default function AppHashOffsetViz() {
  return (
    <SceneShell
      eyebrow="AppHash · 한 높이 차이"
      title="B41을 실행한 결과는 B42 header에 실립니다"
      description="위는 체인의 block 두 개, 아래는 application 쪽 state입니다. AppHash는 결과 state를 식별하는 commitment입니다."
      note="B41·B42·A40·A41은 설명용 이름입니다. B41 header의 A40은 본문 식 A_h → B_{h+1} header를 h=40에 적용한 값입니다."
      ariaLabel="B41 실행 결과 A41이 B42 header의 AppHash로 들어가는 한 높이 차이"
      scenes={SCENES}
      render={(active) => {
        const show = (from: number) => active >= from;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Block x={10} name="B41 (결정됨)" appHash="A40" highlight={false} warn={active === 3} />
            <Block x={175} name="B42 (다음 block)" appHash={show(2) ? "A41" : "?"} highlight={active === 2} warn={false} />
            <line x1={145} x2={175} y1={51} y2={51} stroke={C.line} strokeWidth={1} />

            <rect x={10} y={136} width={60} height={40} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1} />
            <text x={40} y={161} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.text}>S40</text>
            <rect x={110} y={136} width={70} height={40} rx={8} fill={C.accentFill} stroke={active === 0 ? C.accent : C.line} strokeWidth={1} />
            <text x={145} y={161} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.text}>S41</text>
            <line x1={70} x2={110} y1={156} y2={156} stroke={C.accent} strokeWidth={1.25} />
            <text x={90} y={150} textAnchor="middle" fontSize={10} fill={C.accent}>F</text>
            <line x1={40} x2={84} y1={84} y2={140} stroke={active === 0 ? C.accent : C.line} strokeWidth={1} strokeDasharray="3 3" />
            <text x={14} y={112} fontSize={10} fill={C.muted}>B41 입력</text>

            {show(1) && (
              <g>
                <line x1={180} x2={220} y1={156} y2={156} stroke={C.accent} strokeWidth={1.25} />
                <text x={200} y={150} textAnchor="middle" fontSize={10} fill={C.accent}>C</text>
                <rect x={220} y={136} width={90} height={40} rx={8} fill={active === 1 ? C.accentFill : C.fill} stroke={active === 1 ? C.accent : C.line} strokeWidth={1} />
                <text x={265} y={155} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.text}>A41</text>
                <text x={265} y={169} textAnchor="middle" fontSize={9} fill={C.muted}>response</text>
              </g>
            )}
            {show(2) && <line x1={265} x2={250} y1={136} y2={62} stroke={C.accent} strokeWidth={1.25} strokeDasharray="4 3" />}
            {active === 3 && (
              <g>
                <line x1={80} x2={145} y1={62} y2={136} stroke={C.warn} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={122} y={104} fontSize={11} fontWeight={700} fill={C.warn}>A40 ≠ B41의 결과</text>
              </g>
            )}
            <text x={10} y={200} fontSize={10} fill={C.muted}>application state</text>
          </svg>
        );
      }}
    />
  );
}
