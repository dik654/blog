import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 2문단·#names 2문단 — 내륙에서 나온 바다 조개 한 점(대리 지표)이
 * 직접 운반·여러 손을 거친 전달·선물·거래 가운데 무엇인지 물건만으로 정하지 못하고,
 * 다른 가능한 이동 경로와 연대를 맞춰 본 뒤에야 위험 분담망을 말할 수 있다.
 * 해안·유적·중간 집단의 위치는 설명용 가정이다.
 */
const W = 360;
const H = 200;
const COAST_X = 64;
const SHORE = { x: 78, y: 150 };
const SITE = { x: 300, y: 60 };
const RELAY = [
  { x: 150, y: 148 },
  { x: 228, y: 104 },
] as const;

const SCENES = [
  { label: "남은 것은 조개 한 점", summary: "대리 지표", note: "바닷가 조개가 내륙 유적에서 나왔습니다. 이렇게 직접 남지 않은 행동을 물건·퇴적층·뼈의 흔적으로 추정하게 하는 자료가 고고학적 대리 지표입니다. 위치와 거리는 설명용 가정입니다." },
  { label: "누군가 직접 걸어 왔을 수 있습니다", summary: "경로 ① 직접 운반", note: "바닷가를 다녀온 사람이 직접 들고 왔다면 이동의 흔적입니다." },
  { label: "여러 손을 거쳤을 수도 있습니다", summary: "경로 ② 집단 사이 전달", note: "이웃 집단을 차례로 거쳐 넘어왔다면 같은 조개가 교환이 이어진 흔적이 됩니다. 조개 하나만으로는 ①과 ② 가운데 무엇인지, 몇 번의 손을 거쳤는지 알 수 없습니다." },
  { label: "선물인지 거래인지도 갈립니다", summary: "뜻은 물건에 없음", note: "경로를 알아도 그 조개가 선물이었는지 거래였는지는 물건에 적혀 있지 않습니다. 조개를 교환으로 설명하는 것은 가설입니다." },
  { label: "다른 흔적과 맞춰 봅니다", summary: "대리 지표 → 가설 → 검토", note: "다른 가능한 이동 경로와 연대가 맞는지 확인해야 위험 분담망, 곧 교환과 의무로 한곳의 실패를 여러 관계에 나누는 구조를 말할 수 있습니다." },
] as const;

function Arrow({ points, color, on, dashed = false }: { points: readonly { x: number; y: number }[]; color: string; on: boolean; dashed?: boolean }) {
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
  const tip = { x: last.x - 12 * Math.cos(angle), y: last.y - 12 * Math.sin(angle) };
  const head = [0.45, -0.45].map((turn) => `${tip.x - 7 * Math.cos(angle + turn)},${tip.y - 7 * Math.sin(angle + turn)}`);
  const path = [...points.slice(0, -1), tip].map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <g opacity={on ? 1 : 0.28}>
      <polyline points={path} fill="none" stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={dashed ? "5 3" : undefined} />
      <polygon points={`${tip.x},${tip.y} ${head[0]} ${head[1]}`} fill={color} />
    </g>
  );
}

export default function ShellEvidenceViz() {
  return (
    <SceneShell
      eyebrow="흔적에서 관계로"
      title="내륙의 바다 조개 한 점이 말해 주는 것과 못 하는 것"
      description="왼쪽 띠가 바다, 오른쪽 위 점이 조개가 나온 내륙 유적입니다. 위치와 중간 집단은 설명용 가정입니다."
      ariaLabel="내륙 유적의 바다 조개가 직접 운반과 집단 사이 전달 두 경로로 모두 설명될 수 있고, 다른 경로와 연대를 맞춰 봐야 하는 과정"
      scenes={SCENES}
      render={(active) => {
        const relay = active >= 2;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={0} y={0} width={COAST_X} height={H} fill="#0ea5e9" fillOpacity={0.12} />
              <line x1={COAST_X} y1={0} x2={COAST_X} y2={H} stroke="#0284c7" strokeWidth={1} />
              <text x={COAST_X / 2} y={22} textAnchor="middle" fontSize={12} fill="#0369a1">바다</text>
              <text x={COAST_X + 8} y={190} fontSize={11} fill="#64748b">해안</text>
              <text x={W - 10} y={190} textAnchor="end" fontSize={11} fill="#64748b">내륙</text>
              {active >= 1 && (
                <Arrow points={[SHORE, { x: 190, y: 40 }, SITE]} color="#2563eb" on={active === 1 || active === 3} />
              )}
              {relay && <Arrow points={[SHORE, ...RELAY, SITE]} color="#7c3aed" on={active === 2 || active === 3} dashed />}
              {relay &&
                RELAY.map((group, index) => (
                  <g key={index} opacity={active === 2 || active === 3 ? 1 : 0.4}>
                    <circle cx={group.x} cy={group.y} r={7} fill="#7c3aed" fillOpacity={0.18} stroke="#7c3aed" strokeWidth={1} />
                    <text x={group.x} y={index === 0 ? group.y - 14 : group.y + 22} textAnchor="middle" fontSize={11} fill="currentColor">이웃 집단</text>
                  </g>
                ))}
              {active >= 1 && (
                <text x={168} y={30} textAnchor="middle" fontSize={11.5} fontWeight={600} fill="#2563eb" opacity={active === 1 || active === 3 ? 1 : 0.4}>① 직접 운반</text>
              )}
              {relay && (
                <text x={112} y={172} textAnchor="middle" fontSize={11.5} fontWeight={600} fill="#7c3aed" opacity={active === 2 || active === 3 ? 1 : 0.4}>② 여러 손을 거침</text>
              )}
              <circle cx={SHORE.x} cy={SHORE.y} r={4} fill="#0284c7" />
              <circle cx={SITE.x} cy={SITE.y} r={10} fill="#f59e0b" fillOpacity={0.25} stroke="#b45309" strokeWidth={1.25} />
              <text x={SITE.x} y={SITE.y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#92400e">조개</text>
              <text x={SITE.x} y={SITE.y - 18} textAnchor="middle" fontSize={11.5} fontWeight={600} fill="currentColor">내륙 유적</text>
              {active === 3 && (
                <g>
                  <rect x={240} y={138} width={108} height={40} rx={6} fill="none" stroke="#b45309" strokeWidth={1} strokeDasharray="4 3" />
                  <text x={294} y={154} textAnchor="middle" fontSize={11.5} fontWeight={600} fill="currentColor">선물? 거래?</text>
                  <text x={294} y={170} textAnchor="middle" fontSize={10.5} fill="#64748b">물건만으로 모름</text>
                </g>
              )}
            </svg>
            <ol className="grid min-w-0 grid-cols-3 gap-2 text-center text-xs leading-5 sm:text-sm">
              {[
                { name: "대리 지표", detail: "내륙의 조개", lit: true },
                { name: "가설", detail: "교환으로 설명", lit: active >= 3 },
                { name: "검토", detail: "다른 경로·연대", lit: active >= 4 },
              ].map((step) => (
                <li key={step.name} className={`rounded-lg border px-2 py-2 ${step.lit ? "border-primary/60" : "border-dashed border-border/60 opacity-40"}`}>
                  <span className="block font-bold">{step.name}</span>
                  <span className="block text-muted-foreground">{step.detail}</span>
                </li>
              ))}
            </ol>
          </div>
        );
      }}
    />
  );
}
