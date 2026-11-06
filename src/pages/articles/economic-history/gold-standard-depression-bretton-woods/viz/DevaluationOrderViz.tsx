import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — Eichengreen·Sachs(1985) 초록: 먼저 절하한 나라의 이득, 이웃에 준 부정적 영향, 함께 절하했을 때의 상호 이득 가능성.
 * 나라 A·B는 설명용 이름이고 화살표는 방향만 보입니다.
 */
const SCENES = [
  { label: "A가 먼저 절하", summary: "A: 이득", a: "up", b: "none", note: "1930년대의 통화 절하는 먼저 시작한 나라에 이득이 됐습니다. 3절로 읽으면 A는 금을 지키려는 긴축의 제약에서 먼저 벗어난 쪽입니다." },
  { label: "같은 절하가 이웃에", summary: "B: 부정적 영향", a: "up", b: "down", note: "같은 개별 절하가 이웃 B에 준 영향은 부정적이었습니다. 한 나라의 이득과 이웃의 손실이 같은 사건에 함께 붙습니다." },
  { label: "함께 절하했다면", summary: "A·B: 서로 이득 가능", a: "up", b: "up", note: "여러 나라가 함께 절하했다면 서로에게 이득이 될 수 있었다고 이 연구는 봅니다. 실제로 일어난 일이 아니라 비교의 가정입니다." },
] as const;

const W = 320;
const H = 136;
const MUTED = "#64748b";
const IDLE = "#94a3b8";
const GOOD = "#16a34a";
const BAD = "#dc2626";

function Country({ x, name, state, devalued }: { x: number; name: string; state: "up" | "down" | "none"; devalued: boolean }) {
  const cx = x + 60;
  const color = state === "up" ? GOOD : state === "down" ? BAD : IDLE;
  const word = state === "up" ? "이득" : state === "down" ? "부정적" : "변화 전";
  return (
    <g>
      <rect x={x} y={2} width={120} height={130} rx={8} fill="none" stroke={MUTED} strokeWidth={1} />
      <text x={cx} y={24} textAnchor="middle" fontSize={14} fontWeight={700} fill={MUTED}>{name}</text>
      <text x={cx} y={44} textAnchor="middle" fontSize={12} fill={devalued ? "#2563eb" : MUTED} fontWeight={devalued ? 700 : 400}>{devalued ? "절하함" : "절하 안 함"}</text>
      {state === "up" && <polygon points={`${cx},58 ${cx - 16},88 ${cx + 16},88`} fill={GOOD} />}
      {state === "down" && <polygon points={`${cx},88 ${cx - 16},58 ${cx + 16},58`} fill={BAD} />}
      {state === "none" && <line x1={cx - 16} x2={cx + 16} y1={73} y2={73} stroke={IDLE} strokeWidth={1.25} strokeDasharray="3 3" />}
      <text x={cx} y={114} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{word}</text>
    </g>
  );
}

export default function DevaluationOrderViz() {
  return (
    <SceneShell
      eyebrow="절하의 순서"
      title="혼자 먼저 절하할 때와 함께 절하할 때 이웃의 결과가 갈립니다"
      description="한 나라의 절하는 다른 나라에 무엇을 줄까요? 세모의 위아래가 이득과 부정적 영향의 방향입니다."
      note="Eichengreen·Sachs(1985) 초록의 요지입니다. 이 글은 초록만 확인했고, 나라별 추정치는 옮기지 않았습니다. A·B는 설명용 이름입니다."
      ariaLabel="한 나라가 먼저 절하할 때와 여러 나라가 함께 절하할 때의 결과 방향"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Country x={2} name="나라 A" state={scene.a} devalued />
            <Country x={198} name="나라 B" state={scene.b} devalued={index === 2} />
            {index === 1 && (
              <>
                <line x1={124} x2={190} y1={68} y2={68} stroke={BAD} strokeWidth={1.25} />
                <polygon points="190,63 190,73 197,68" fill={BAD} />
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
