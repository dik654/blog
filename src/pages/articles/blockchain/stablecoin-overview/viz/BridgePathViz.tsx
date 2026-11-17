import SceneShell from "./SceneShell";

/**
 * 본문 대응: #failure-boundaries bridge 문단.
 * 원본 S를 bridge 보관 주소에 잠그고 다른 체인에 대체 토큰을 발행 → 권리 경로가 하나 더 생긴다.
 * 원본 S 준비금이 충분해도 bridge가 잠긴 S를 돌려주지 못하면 대체 토큰 보유자는 상환 경로를 잃을 수 있다.
 */
type Edge = "redeem" | "lock" | "mint" | "back" | "release";

const SCENES = [
  { label: "원본 S의 경로", summary: "S → 발행자 → 준비금", edges: ["redeem"] as readonly Edge[], broken: false, note: "원본 체인에서 S를 가진 보유자는 자격이 있으면 발행자에게 토큰을 돌려주고 준비금에서 지급받는 경로 하나를 갖습니다." },
  { label: "bridge로 옮기기", summary: "S 잠금 → 대체 토큰 발행", edges: ["lock", "mint"] as readonly Edge[], broken: false, note: "Bridge를 쓰면 원본 S는 bridge 보관 주소에 잠기고, 메시지가 확인·확정되면 다른 체인에 대체 토큰이 발행됩니다." },
  { label: "대체 토큰으로 돌아가기", summary: "대체 토큰 → 잠긴 S → 발행자", edges: ["back", "release", "redeem"] as readonly Edge[], broken: false, note: "대체 토큰 보유자가 달러까지 가려면 먼저 bridge가 잠긴 S를 풀어 줘야 하고, 그다음에야 발행자의 상환 경로에 닿습니다." },
  { label: "bridge가 멈추면", summary: "준비금 충분 · 경로는 끊김", edges: ["back", "release"] as readonly Edge[], broken: true, note: "원본 S 준비금이 충분해도 bridge가 잠긴 S를 돌려주지 못하면 대체 토큰 보유자는 상환 경로를 잃을 수 있습니다." },
] as const;

const W = 360;
const H = 200;

function Box({ x, y, w, title, sub, tone }: { x: number; y: number; w: number; title: string; sub: string; tone: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={40} rx={6} fill="#ffffff" stroke={tone} strokeWidth={1} />
      <text x={x + w / 2} y={y + 17} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">{title}</text>
      <text x={x + w / 2} y={y + 32} textAnchor="middle" fontSize={10} fill="#64748b">{sub}</text>
    </g>
  );
}

function Arrow({ d, head, on, broken }: { d: string; head: string; on: boolean; broken?: boolean }) {
  const color = broken ? "#dc2626" : on ? "#2563eb" : "#cbd5e1";
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={broken ? "3 3" : undefined} />
      <path d={head} fill="none" stroke={color} strokeWidth={on ? 1.25 : 1} />
    </g>
  );
}

export default function BridgePathViz() {
  return (
    <SceneShell
      eyebrow="Bridge와 상환 경로"
      title="대체 토큰은 발행자에게 닿기 전에 bridge를 한 번 더 거칩니다"
      description="왼쪽이 원본 S가 있는 체인, 오른쪽이 대체 토큰이 발행되는 다른 체인입니다. 금액과 수량은 그리지 않았습니다."
      ariaLabel="원본 체인의 발행자·준비금, bridge 보관 주소, 다른 체인의 대체 토큰 사이 상환 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const on = (edge: Edge) => scene.edges.includes(edge);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={8} y={14} fontSize={10} fontWeight={700} fill="#64748b">원본 체인</text>
            <text x={352} y={14} textAnchor="end" fontSize={10} fontWeight={700} fill="#64748b">다른 체인</text>
            <line x1={214} x2={214} y1={6} y2={194} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 4" />

            <Box x={14} y={22} w={150} title="발행자 · 준비금" sub="상환 요청 처리" tone="#16a34a" />
            <Box x={14} y={86} w={150} title="원본 S 보유자" sub="자격 있으면 직접 상환" tone="#64748b" />
            <Box x={14} y={150} w={150} title="bridge 보관 주소" sub="잠긴 원본 S" tone={scene.broken ? "#dc2626" : "#d97706"} />
            <Box x={226} y={150} w={126} title="대체 토큰" sub="잠긴 S를 가리킴" tone="#7c3aed" />

            <Arrow d="M89 86 V66" head="M85 70 L89 64 L93 70" on={on("redeem")} />
            <text x={96} y={80} fontSize={10} fill={on("redeem") ? "#2563eb" : "#94a3b8"}>상환</text>

            <Arrow d="M60 126 V146" head="M56 142 L60 148 L64 142" on={on("lock")} />
            <text x={30} y={140} textAnchor="end" fontSize={10} fill={on("lock") ? "#2563eb" : "#94a3b8"}>잠금</text>

            <Arrow d="M118 146 V130" head="M114 134 L118 128 L122 134" on={on("release")} broken={scene.broken} />
            <text x={128} y={142} fontSize={10} fill={scene.broken ? "#dc2626" : on("release") ? "#2563eb" : "#94a3b8"}>{scene.broken ? "반환 불가" : "반환"}</text>

            <Arrow d="M164 162 H222" head="M218 158 L224 162 L218 166" on={on("mint")} />
            <text x={194} y={156} textAnchor="middle" fontSize={10} fill={on("mint") ? "#2563eb" : "#94a3b8"}>발행</text>
            <Arrow d="M226 180 H168" head="M172 176 L166 180 L172 184" on={on("back")} />
            <text x={196} y={196} textAnchor="middle" fontSize={10} fill={on("back") ? "#2563eb" : "#94a3b8"}>되돌림</text>

            {scene.broken && (
              <g>
                <path d="M112 132 L124 144 M124 132 L112 144" stroke="#dc2626" strokeWidth={1.25} />
                <text x={289} y={120} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">상환 경로를 잃을 수 있음</text>
              </g>
            )}
            {!scene.broken && active === 0 && <text x={289} y={120} textAnchor="middle" fontSize={10} fill="#94a3b8">아직 쓰지 않음</text>}
          </svg>
        );
      }}
    />
  );
}
