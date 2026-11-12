import SceneShell from "./SceneShell";

/**
 * 본문 대응: #zone-flow-policy 첫 문단 — Payroll web→API 443, API service identity→DB 5432만 명시하고
 * 나머지는 default deny. ‘내부망 전체 허용’은 lateral movement의 blast radius를 키운다.
 * web→DB 직접 접속과 뚫린 web 서버는 이 그림이 고른 예(가정)이다.
 */
const SCENES = [
  {
    label: "승인된 flow 두 줄",
    summary: "web→API 443 · API→DB 5432",
    note: "점선 상자가 zone입니다. Zone은 신뢰를 저절로 주는 색깔이 아니라 policy를 적용하는 관리 단위입니다. 화살표 하나가 flow 기록 한 줄이고, 각 줄에 source·destination·protocol/service·identity·purpose·owner·expiry를 적습니다. DB로 가는 줄의 source는 API의 service identity입니다.",
  },
  {
    label: "적히지 않은 flow는 기본 거부",
    summary: "web→DB 직접: 목록에 없음 → 거부",
    note: "Default deny는 명시하지 않은 flow를 막는 기본값입니다. web이 DB에 바로 붙는 줄은 위 두 줄에 없으므로 막힙니다(이 예는 가정). 막았다는 결과도 관측해 기록으로 남깁니다.",
  },
  {
    label: "‘내부망 전체 허용’이면",
    summary: "뚫린 한 곳에서 닿는 범위가 커짐",
    note: "Lateral movement는 한 시스템에 들어온 공격자가 내부의 다른 시스템으로 옮겨 가는 것이고, blast radius는 그때 피해가 닿는 범위입니다. web 한 대가 뚫렸다고 가정하면, 두 줄만 열린 첫 장면에서는 API 443까지만 닿지만 내부망 전체를 열면 DB까지 어떤 port로든 닿습니다.",
  },
] as const;

const INK = "#475569";
const MUTED = "#94a3b8";
const OK = "#2563eb";
const BAD = "#dc2626";

const NODES = [
  { key: "web", zone: "Web zone", x: 18 },
  { key: "API", zone: "Application zone", x: 136 },
  { key: "DB", zone: "DB zone", x: 254 },
] as const;
const ZW = 92;
const NODE_Y = 96;
const NODE_H = 34;

function Arrow({ x1, x2, y, color, label, dashed = false }: { x1: number; x2: number; y: number; color: string; label: string; dashed?: boolean }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - 6} y2={y} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <polygon points={`${x2},${y} ${x2 - 7},${y - 4} ${x2 - 7},${y + 4}`} fill={color} />
      <text x={(x1 + x2) / 2} y={y - 6} fontSize={11.5} fontWeight={700} fill={color} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

export default function ZoneFlowViz() {
  return (
    <SceneShell
      eyebrow="Zone과 flow"
      title="열어 둘 flow만 줄로 긋고 나머지는 기본으로 막습니다"
      description="점선 상자는 zone, 상자 안은 급여 서비스의 web·API·DB, 화살표는 승인된 flow 한 줄입니다."
      note="web→DB 직접 접속과 ‘web 한 대가 뚫림’은 기본 거부와 피해 범위를 보이려고 이 그림이 고른 예(가정)입니다."
      ariaLabel="급여 web, API, DB 사이의 승인 flow, 기본 거부, 내부망 전체 허용 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {NODES.map((n) => {
            const breached = active === 2 && n.key === "web";
            const exposed = active === 2 && n.key !== "web";
            return (
              <g key={n.key}>
                <rect x={n.x - 6} y={60} width={ZW} height={100} rx={8} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
                <text x={n.x - 6 + ZW / 2} y={152} fontSize={10.5} fill={INK} textAnchor="middle">
                  {n.zone}
                </text>
                <rect
                  x={n.x}
                  y={NODE_Y}
                  width={ZW - 12}
                  height={NODE_H}
                  rx={6}
                  fill={breached || exposed ? BAD : OK}
                  fillOpacity={0.1}
                  stroke={breached || exposed ? BAD : OK}
                  strokeWidth={1}
                />
                <text x={n.x + (ZW - 12) / 2} y={NODE_Y + 21} fontSize={12.5} fontWeight={700} fill={breached || exposed ? BAD : INK} textAnchor="middle">
                  {n.key}
                </text>
              </g>
            );
          })}

          {active !== 2 && (
            <>
              <Arrow x1={98} x2={136} y={113} color={OK} label="443" />
              <Arrow x1={216} x2={254} y={113} color={OK} label="5432" />
            </>
          )}

          {active === 1 && (
            <g>
              {/* 거부된 시도는 ✕ 상자에서 끝나고 DB에 닿지 않는다(장면 3의 ‘닿음’ 곡선과 구분). */}
              <path d="M 58 96 C 58 63, 117 46.5, 176 46" fill="none" stroke={BAD} strokeWidth={1.25} strokeDasharray="4 3" />
              <rect x={150} y={30} width={60} height={20} rx={4} fill="#fef2f2" stroke={BAD} strokeWidth={1} />
              <text x={180} y={44} fontSize={11.5} fontWeight={700} fill={BAD} textAnchor="middle">
                ✕ 거부
              </text>
              <text x={180} y={20} fontSize={11.5} fill={BAD} textAnchor="middle">
                web→DB 5432: 목록에 없음
              </text>
            </g>
          )}

          {active === 2 && (
            <g>
              <Arrow x1={98} x2={136} y={113} color={BAD} label="" dashed />
              <Arrow x1={216} x2={254} y={113} color={BAD} label="" dashed />
              <path d="M 58 96 C 58 30, 294 30, 294 92" fill="none" stroke={BAD} strokeWidth={1.25} strokeDasharray="4 3" />
              <polygon points="294,96 290,88 298,88" fill={BAD} />
              <text x={180} y={20} fontSize={11.5} fill={BAD} textAnchor="middle">
                내부망 전체 허용 · 모든 port
              </text>
              <text x={294} y={178} fontSize={11.5} fontWeight={700} fill={BAD} textAnchor="middle">
                여기까지 닿음
              </text>
              <text x={58} y={178} fontSize={11.5} fontWeight={700} fill={BAD} textAnchor="middle">
                뚫림(가정)
              </text>
            </g>
          )}

          {active === 0 && (
            <text x={180} y={34} fontSize={11.5} fill={INK} textAnchor="middle">
              화살표 하나 = flow 기록 한 줄
            </text>
          )}
          {active === 1 && (
            <text x={180} y={178} fontSize={11.5} fill={INK} textAnchor="middle">
              거부 결과도 log로 관측
            </text>
          )}
        </svg>
      )}
    />
  );
}
