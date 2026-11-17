import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — Host 3개와 service 4개를 전용 연결하면 최대 3×4 = 12종,
 * 공통 protocol 경계에 각각 한 번씩 맞추면 단순 모델에서 3+4 = 7종.
 * MCP message를 해석할 수 있다고 파일 변경 권한이 생기지는 않는다(승인·격리는 host와 server가 별도 판정).
 */
const HOSTS = 3;
const SERVICES = 4;

const SCENES = [
  {
    label: "전용 adapter로 잇기",
    summary: `${HOSTS} × ${SERVICES} = ${HOSTS * SERVICES}종`,
    note: "모든 host가 모든 service를 쓴다고 단순화하면, host 하나가 service 넷과 각각 따로 연결되므로 선이 3×4 = 12개입니다. Host나 service가 하나 늘 때마다 상대편 수만큼 선이 늘어납니다.",
  },
  {
    label: "공통 protocol 경계에 맞추기",
    summary: `${HOSTS} + ${SERVICES} = ${HOSTS + SERVICES}종`,
    note: "각 host와 service가 가운데 protocol 경계에 한 번씩만 맞추면 선은 3+4 = 7개입니다. 줄어드는 것은 반복되는 연결 형식이며, integration마다 난이도와 보안 비용이 같다는 뜻은 아닙니다.",
  },
  {
    label: "형식이 통해도 권한은 따로",
    summary: "해석 가능 ≠ 실행 권한",
    note: "MCP message를 해석할 수 있다는 사실만으로 파일 변경 권한이 생기지는 않습니다. 실제 실행 권한과 승인·격리는 host와 server가 각각 판정합니다.",
  },
] as const;

const W = 360;
const H = 226;
const HOST_X = 48;
const SVC_X = 312;
const MID_X = 180;
const hostY = (i: number) => 50 + i * 55;
const svcY = (i: number) => 32 + i * 50;
const INK = "#334155";
const BLUE = "#2563eb";
const AMBER = "#b45309";

function Box({ x, y, label, dim = false }: { x: number; y: number; label: string; dim?: boolean }) {
  return (
    <g opacity={dim ? 0.45 : 1}>
      <rect x={x - 30} y={y - 15} width={60} height={30} rx={6} fill="none" stroke={INK} strokeWidth={1} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK} className="fill-foreground">{label}</text>
    </g>
  );
}

export default function AdapterCountViz() {
  return (
    <SceneShell
      eyebrow="연결 수"
      title="Host 3개 × service 4개: 12종에서 7종으로"
      description="왼쪽 H1~H3은 host(사용자가 쓰는 AI application), 오른쪽 S1~S4는 연결할 service입니다. 선 하나가 따로 만들고 유지해야 하는 연결 한 종류입니다. 모든 host가 모든 service를 쓴다고 단순화했습니다(가정)."
      ariaLabel="전용 연결 12종과 공통 protocol 7종, 그리고 권한이 별도라는 점을 비교하는 그림"
      scenes={SCENES}
      render={(active) => {
        const pairwise = active === 0;
        const hosts = Array.from({ length: HOSTS }, (_, i) => i);
        const services = Array.from({ length: SERVICES }, (_, i) => i);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {pairwise
              ? hosts.flatMap((h) =>
                  services.map((s) => (
                    <line key={`${h}-${s}`} x1={HOST_X + 30} y1={hostY(h)} x2={SVC_X - 30} y2={svcY(s)} stroke={BLUE} strokeWidth={1} opacity={0.75} />
                  )),
                )
              : (
                <g>
                  {hosts.map((h) => (
                    <line key={`h${h}`} x1={HOST_X + 30} y1={hostY(h)} x2={MID_X - 16} y2={hostY(h)} stroke={BLUE} strokeWidth={1} />
                  ))}
                  {services.map((s) => (
                    <line key={`s${s}`} x1={MID_X + 16} y1={svcY(s)} x2={SVC_X - 30} y2={svcY(s)} stroke={BLUE} strokeWidth={1} />
                  ))}
                  <rect x={MID_X - 16} y={14} width={32} height={176} rx={6} fill="none" stroke={BLUE} strokeWidth={1.25} />
                  <text x={MID_X} y={104} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE} transform={`rotate(-90 ${MID_X} 104)`}>MCP 경계</text>
                </g>
              )}
            {hosts.map((h) => (
              <Box key={`H${h}`} x={HOST_X} y={hostY(h)} label={`H${h + 1}`} dim={active === 2 && h !== 0} />
            ))}
            {services.map((s) => (
              <Box key={`S${s}`} x={SVC_X} y={svcY(s)} label={`S${s + 1}`} dim={active === 2 && s !== 0} />
            ))}
            {active === 2 && (
              <g>
                <text x={HOST_X} y={hostY(0) - 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>별도 판정</text>
                <text x={SVC_X} y={svcY(0) - 20} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>별도 판정</text>
              </g>
            )}
            <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK} className="fill-foreground">
              {active === 0 ? "선 12개" : active === 1 ? "선 7개" : "선이 이어져도 실행 여부는 양 끝에서"}
            </text>
          </svg>
        );
      }}
    />
  );
}
