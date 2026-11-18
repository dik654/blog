import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview 1문단 — (가정) 두 지역에 복구 가능한 구조를 만들었지만 같은 pipeline이 잘못된 설정을 두 지역에 동시에 배포했다.
 * 구조를 고른 사람은 배포 ring과 승인 단계를 정하지 않았고, 전달을 맡은 사람은 지역별 복구 목표를 몰랐다.
 * 지역 이름(지역 A·B)은 그림용 가정이다. 복구 시간 숫자는 1절에 없으므로 적지 않는다.
 */
const ACCENT = "#2563eb";
const RED = "#dc2626";
const GREEN = "#16a34a";
const AMBER = "#d97706";
const MUTED = "#94a3b8";
const LABEL = "#475569";

type Step = "recover" | "push" | "both" | "gaps";

const SCENES = [
  {
    label: "복구 구조는 맞았습니다",
    summary: "한 지역이 멈추면 다른 지역이 받음",
    step: "recover",
    note: "두 지역에 같은 서비스를 두고, 한 지역에 장애가 나면 다른 지역으로 넘어가 복구하는 구조입니다. 지역 하나만 망가지는 경우에는 이 구조가 버팁니다.",
  },
  {
    label: "같은 pipeline이 동시에 배포",
    summary: "잘못된 설정 → 지역 A·B 동시",
    step: "push",
    note: "pipeline은 변경을 빌드·시험·배포까지 자동으로 흘려보내는 절차입니다. 이 사건에서는 한 pipeline이 잘못된 설정을 두 지역에 같은 때 내보냈습니다.",
  },
  {
    label: "두 지역이 함께 망가짐",
    summary: "넘어갈 지역이 남지 않음",
    step: "both",
    note: "두 지역이 같은 잘못된 설정을 받았으므로 둘 다 실패합니다. 복구 구조는 다른 지역이 살아 있다는 전제에 기대는데, 그 전제가 같은 배포 한 번에 무너졌습니다.",
  },
  {
    label: "비어 있던 두 결정",
    summary: "ring·승인 미정 · 복구 목표 모름",
    step: "gaps",
    note: "배포 ring은 변경을 한꺼번에 보내지 않고 묶음별로 차례로 넓혀 가는 배포 단위입니다. 1절은 구조를 고른 사람이 ring과 승인 단계를 정하지 않았고, 전달을 맡은 사람은 지역별 복구 목표를 몰랐다고 적습니다.",
  },
] as const satisfies readonly { label: string; summary: string; step: Step; note: string }[];

function Region({ x, name, state }: { x: number; name: string; state: "ok" | "down" | "bad" }) {
  const color = state === "ok" ? GREEN : RED;
  return (
    <g>
      <rect x={x} y={104} width={130} height={58} rx={8} fill="none" stroke={color} strokeWidth={state === "ok" ? 1 : 1.25} />
      <text x={x + 65} y={124} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="currentColor">{name}</text>
      <text x={x + 65} y={146} textAnchor="middle" fontSize={11} fontWeight={700} fill={state === "ok" ? "#15803d" : RED}>
        {state === "ok" ? "✓ 정상" : state === "down" ? "✕ 지역 장애" : "✕ 잘못된 설정"}
      </text>
    </g>
  );
}

export default function TwoRegionsOneDeployViz() {
  return (
    <SceneShell
      eyebrow="배포 한 번, 두 지역"
      title="복구 구조가 있어도 같은 배포가 두 지역을 함께 멈출 수 있습니다"
      description="1절의 가정 사건입니다. 위가 배포 pipeline, 아래 두 칸이 서비스를 둔 두 지역이며 '지역 A·B'는 그림용 이름입니다."
      ariaLabel="두 지역 복구 구조와, 같은 pipeline의 동시 배포로 두 지역이 함께 실패하는 과정"
      scenes={SCENES}
      render={(active) => {
        const step: Step = SCENES[active].step;
        const pushing = step !== "recover";
        const aState = step === "recover" ? "down" : step === "push" ? "ok" : "bad";
        const bState = step === "both" || step === "gaps" ? "bad" : "ok";
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              {[ACCENT, RED, GREEN, AMBER].map((color) => (
                <marker key={color} id={`tr-${color.slice(1)}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
                  <path d="M0 0 L8 4 L0 8 z" fill={color} />
                </marker>
              ))}
            </defs>

            <g opacity={pushing ? 1 : 0.3}>
              <rect x={115} y={8} width={130} height={40} rx={8} fill="none" stroke={ACCENT} strokeWidth={1} />
              <text x={180} y={25} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="currentColor">pipeline</text>
              <text x={180} y={40} textAnchor="middle" fontSize={10} fill={LABEL}>{pushing ? "잘못된 설정 1건" : "배포 대기"}</text>
            </g>
            {pushing ? (
              <>
                <line x1={150} y1={48} x2={90} y2={102} stroke={RED} strokeWidth={1.25} markerEnd={`url(#tr-${RED.slice(1)})`} />
                <line x1={210} y1={48} x2={270} y2={102} stroke={RED} strokeWidth={1.25} markerEnd={`url(#tr-${RED.slice(1)})`} />
                <text x={180} y={78} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={RED}>같은 때 두 곳으로</text>
              </>
            ) : null}

            <Region x={20} name="지역 A" state={aState} />
            <Region x={210} name="지역 B" state={bState} />

            {step === "recover" ? (
              <>
                <line x1={152} y1={133} x2={206} y2={133} stroke={GREEN} strokeWidth={1.25} markerEnd={`url(#tr-${GREEN.slice(1)})`} />
                <text x={180} y={182} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#15803d">A가 멈추면 B로 넘어가 복구</text>
              </>
            ) : null}
            {step === "both" ? (
              <>
                <line x1={152} y1={133} x2={206} y2={133} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
                <text x={180} y={182} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={RED}>넘어갈 곳이 없음</text>
              </>
            ) : null}
            {step === "gaps" ? (
              <>
                <rect x={2} y={50} width={100} height={34} rx={6} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
                <text x={52} y={64} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b45309">ring·승인 단계</text>
                <text x={52} y={78} textAnchor="middle" fontSize={9.5} fill="#b45309">구조 담당이 안 정함</text>
                <rect x={60} y={166} width={240} height={26} rx={6} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
                <text x={180} y={183} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b45309">지역별 복구 목표 · 전달 담당이 모름</text>
              </>
            ) : null}
          </svg>
        );
      }}
    />
  );
}
