import SceneShell from "./SceneShell";

/**
 * 본문 대응: #network-segmentation — 여섯 zone, default deny, 외부 운영자 경로, 경계를 우회할 수 있는 길.
 * zone 배치와 bastion·HTTPS flow·control plane 이 그림에서 놓인 자리는 설명용 가정이다.
 */
type Zone = { id: string; name: string; x: number; y: number };
const ZW = 104;
const ZH = 78;
const ZONES: readonly Zone[] = [
  { id: "user", name: "user", x: 8, y: 30 },
  { id: "internet", name: "internet", x: 128, y: 30 },
  { id: "mgmt", name: "management", x: 248, y: 30 },
  { id: "db", name: "database", x: 8, y: 150 },
  { id: "prod", name: "production", x: 128, y: 150 },
  { id: "wallet", name: "wallet", x: 248, y: 150 },
];

const SCENES = [
  {
    label: "구간과 default deny",
    summary: "승인된 flow만 열림",
    stage: 0,
    note: "trust와 영향이 다른 구간을 나누고, 구간 사이는 기본으로 막습니다. 예외 flow는 source identity·zone, destination, protocol·port, 업무 목적, owner, expiry를 적은 inventory 항목으로만 승인합니다.",
  },
  {
    label: "외부 운영자의 경로",
    summary: "VPN·MFA → 단말 확인 → bastion → target",
    stage: 1,
    note: "외부 운영자는 MFA가 적용된 VPN으로 들어와 관리되는 device인지 확인받은 뒤, bastion을 거쳐 승인된 production target에 짧은 session으로 접속하게 할 수 있습니다. bastion을 management 구간에 둔 것은 그림의 가정입니다.",
  },
  {
    label: "경계를 우회할 수 있는 길",
    summary: "벽 안·허용 flow·벽 밖",
    stage: 2,
    note: "같은 zone 안의 감염된 host는 구간 경계를 지나지 않고 옆 host로 갈 수 있고, 허용된 HTTPS tunnel은 열린 flow를 타며, cloud control plane과 service credential은 network 경계 밖에서 들어올 수 있습니다. 그래서 workload identity, application authorization, endpoint detection을 함께 두고 내부 주체를 자동으로 신뢰하지 않습니다.",
  },
] as const;

function ZoneBox({ zone, dim }: { zone: Zone; dim: boolean }) {
  return (
    <g opacity={dim ? 0.55 : 1}>
      <rect x={zone.x} y={zone.y} width={ZW} height={ZH} rx={8} fill="#94a3b8" fillOpacity={0.08} stroke="#64748b" strokeWidth={1} />
      <text x={zone.x + 8} y={zone.y + 16} fontSize={11} fontWeight={700} className="fill-foreground">
        {zone.name}
      </text>
    </g>
  );
}

const Arrow = ({ x1, y1, x2, y2, color, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} markerEnd={`url(#zp-${color.slice(1)})`} />
  </g>
);

export default function ZonePathViz() {
  return (
    <SceneShell
      eyebrow="망분리"
      title="구간을 나눠도 이동 경로가 모두 닫히지는 않습니다"
      description="본문이 예로 든 여섯 zone입니다. 상자의 위치와 bastion·HTTPS flow·control plane의 자리는 그림을 위한 가정입니다."
      ariaLabel="여섯 network zone 사이의 default deny, 외부 운영자 접속 경로, 경계를 우회할 수 있는 경로"
      scenes={SCENES}
      render={(active) => {
        const stage = SCENES[active].stage;
        return (
          <svg viewBox="0 0 360 318" className="mx-auto block w-full max-w-[34rem]" role="img" aria-label="network zone 지도">
            <defs>
              {["2563eb", "dc2626", "64748b"].map((c) => (
                <marker key={c} id={`zp-${c}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L8,4 L0,8 z" fill={`#${c}`} />
                </marker>
              ))}
            </defs>
            {ZONES.map((z) => (
              <ZoneBox key={z.id} zone={z} dim={stage === 1 && z.id !== "internet" && z.id !== "mgmt" && z.id !== "prod"} />
            ))}

            {stage === 0 && (
              <g>
                {[
                  [112, 69, 128, 69],
                  [232, 69, 248, 69],
                  [60, 108, 60, 150],
                  [180, 108, 180, 150],
                  [300, 108, 300, 150],
                  [112, 189, 128, 189],
                  [232, 189, 248, 189],
                ].map(([x1, y1, x2, y2]) => (
                  <g key={`${x1}-${y1}`}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth={1} strokeDasharray="2 2" />
                    <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">
                      ×
                    </text>
                  </g>
                ))}
                <text x={180} y={258} textAnchor="middle" fontSize={11} className="fill-foreground">
                  구간 사이는 기본 deny(×)
                </text>
                <text x={180} y={276} textAnchor="middle" fontSize={11} className="fill-muted-foreground">
                  예외 = source·destination·port·목적·owner·expiry가 적힌 flow
                </text>
              </g>
            )}

            {stage === 1 && (
              <g>
                <Arrow x1={200} y1={84} x2={262} y2={84} color="#2563eb" />
                <text x={231} y={100} textAnchor="middle" fontSize={11} fill="#2563eb">VPN·MFA</text>
                <rect x={256} y={50} width={88} height={20} rx={4} fill="#2563eb" fillOpacity={0.12} stroke="#2563eb" strokeWidth={1} />
                <text x={300} y={64} textAnchor="middle" fontSize={11} className="fill-foreground">단말 확인</text>
                <rect x={256} y={78} width={88} height={20} rx={4} fill="#2563eb" fillOpacity={0.12} stroke="#2563eb" strokeWidth={1} />
                <text x={300} y={92} textAnchor="middle" fontSize={11} className="fill-foreground">bastion (가정)</text>
                <Arrow x1={290} y1={100} x2={214} y2={176} color="#2563eb" />
                <rect x={140} y={176} width={80} height={22} rx={4} fill="#2563eb" fillOpacity={0.12} stroke="#2563eb" strokeWidth={1} />
                <text x={180} y={191} textAnchor="middle" fontSize={11} className="fill-foreground">승인된 target</text>
                <circle cx={160} cy={64} r={8} fill="#2563eb" fillOpacity={0.2} stroke="#2563eb" strokeWidth={1} />
                <text x={176} y={68} fontSize={11} className="fill-foreground">외부 운영자</text>
                <text x={180} y={258} textAnchor="middle" fontSize={11} className="fill-foreground">
                  짧은 session으로 승인된 대상에만
                </text>
                <text x={180} y={276} textAnchor="middle" fontSize={11} className="fill-muted-foreground">
                  나머지 구간 사이는 여전히 deny
                </text>
              </g>
            )}

            {stage === 2 && (
              <g>
                <rect x={140} y={176} width={34} height={22} rx={4} fill="#dc2626" fillOpacity={0.15} stroke="#dc2626" strokeWidth={1} />
                <text x={157} y={191} textAnchor="middle" fontSize={11} className="fill-foreground">감염</text>
                <rect x={188} y={176} width={34} height={22} rx={4} fill="#94a3b8" fillOpacity={0.15} stroke="#64748b" strokeWidth={1} />
                <text x={205} y={191} textAnchor="middle" fontSize={11} className="fill-foreground">host</text>
                <Arrow x1={174} y1={187} x2={187} y2={187} color="#dc2626" />
                <text x={180} y={216} textAnchor="middle" fontSize={11} fill="#dc2626">같은 zone 안 이동</text>

                <line x1={112} y1={69} x2={128} y2={69} stroke="#64748b" strokeWidth={1} />
                <Arrow x1={60} y1={78} x2={168} y2={78} color="#dc2626" dashed />
                <text x={60} y={96} fontSize={11} fill="#dc2626">허용 HTTPS flow 안의 tunnel (가정 위치)</text>

                <rect x={8} y={242} width={160} height={26} rx={6} fill="#dc2626" fillOpacity={0.08} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
                <text x={88} y={259} textAnchor="middle" fontSize={11} className="fill-foreground">cloud control plane</text>
                <rect x={192} y={242} width={160} height={26} rx={6} fill="#dc2626" fillOpacity={0.08} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
                <text x={272} y={259} textAnchor="middle" fontSize={11} className="fill-foreground">service credential</text>
                <Arrow x1={88} y1={242} x2={88} y2={230} color="#dc2626" dashed />
                <Arrow x1={272} y1={242} x2={272} y2={230} color="#dc2626" dashed />
                <text x={180} y={298} textAnchor="middle" fontSize={11} className="fill-muted-foreground">
                  network 경계 밖에서 들어올 수 있는 길 (대상 위치는 가정)
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
