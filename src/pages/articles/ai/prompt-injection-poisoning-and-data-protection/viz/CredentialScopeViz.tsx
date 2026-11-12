import SceneShell from "./SceneShell";

/**
 * 본문 대응: #secret-leakage — 조직 전체 토큰 하나 vs 작업별(고객 A 조회, 티켓 B 요약)로 좁힌 credential.
 * 티켓 B 처리 중 injection이 성공했을 때 닿는 자원 범위를 칸으로 센다. 자원 8칸은 설명용 가정.
 */
const CELLS = ["고객 A", "티켓 B", "기타 자원", "기타 자원", "기타 자원", "기타 자원", "기타 자원", "기타 자원"] as const;
const CELL_COUNT = CELLS.length;

const SCENES = [
  { label: "조직 전체 토큰 하나", summary: `토큰 1개 → ${CELL_COUNT}칸 전부`, note: "agent 하나에 조직 전체 API 토큰 하나만 줍니다. 이 토큰은 어떤 작업을 하든 조직의 모든 자원에 닿습니다(점선 범위)." },
  { label: "티켓 B 처리 중 injection 성공", summary: `닿는 범위 ${CELL_COUNT}/${CELL_COUNT}칸`, note: "티켓 B를 요약하다 injection이 성공하면, 그 agent가 쥔 토큰이 허용하는 범위 전체가 유출 경로가 됩니다. 처리 중인 문서가 티켓 B 하나여도 조직 전체 자원에 접근할 수 있습니다." },
  { label: "작업마다 좁힌 credential", summary: "토큰 A → 고객 A · 토큰 B → 티켓 B", note: "작업 단위로 credential을 따로 발급합니다. 고객 A 조회 작업에는 고객 A만 허용하는 토큰 A를, 지금 하는 티켓 B 요약에는 티켓 B만 허용하는 토큰 B를 줍니다." },
  { label: "같은 injection, 좁아진 범위", summary: `닿는 범위 1/${CELL_COUNT}칸`, note: "티켓 B 처리 중 같은 injection이 성공해도 유출 범위는 토큰 B가 허용한 티켓 B로 줄어듭니다. Injection 자체를 막은 것은 아니며, 성공했을 때 번지는 범위만 줄어듭니다." },
] as const;
const ARIA: readonly string[] = SCENES.map((scene) => `${scene.label}: ${scene.summary}`);

const BLUE = "#2563eb";
const GRAY = "#94a3b8";
const MUTED = "#64748b";
const RED = "#dc2626";

const COL_W = 84;
const ROW_H = 40;
const cellX = (i: number) => 14 + (i % 4) * (COL_W + 6);
const cellY = (i: number) => 112 + Math.floor(i / 4) * (ROW_H + 8);

export default function CredentialScopeViz() {
  return (
    <SceneShell
      eyebrow="Credential isolation"
      title="같은 injection이 성공해도 쥔 토큰의 범위만큼만 번집니다"
      description="칸 하나가 조직 자원 하나입니다. 고객 A와 티켓 B는 본문의 예이고, 나머지 여섯 칸과 전체 칸 수는 설명용 가정입니다."
      ariaLabel="조직 전체 토큰과 작업별 credential에서 티켓 B injection이 닿는 자원 범위 비교"
      scenes={SCENES}
      render={(active) => {
        const scoped = active >= 2;
        const breached = active === 1 || active === 3;
        const reach = (i: number) => (scoped ? i === 1 : true);
        return (
          <svg viewBox="0 0 380 216" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={ARIA[active]}>
            <rect x={110} y={8} width={160} height={36} rx={6} fill="none" stroke={breached ? RED : GRAY} strokeWidth={breached ? 1.25 : 1} />
            <text x={190} y={24} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">agent · 티켓 B 처리 중</text>
            <text x={190} y={39} textAnchor="middle" fontSize={11} fill={breached ? RED : MUTED}>{breached ? "injection 성공" : "정상 처리"}</text>
            <text x={190} y={68} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>
              {scoped ? "이 작업에 발급: 토큰 B (티켓 B 요약만)" : "조직 전체 API 토큰 1개"}
            </text>
            <line x1={190} y1={44} x2={190} y2={54} stroke={GRAY} strokeWidth={1} />

            {!scoped && <rect x={8} y={100} width={364} height={108} rx={8} fill="none" stroke={BLUE} strokeWidth={1} strokeDasharray="4 3" />}
            {scoped && (
              <>
                <rect x={cellX(0) - 5} y={cellY(0) - 5} width={COL_W + 10} height={ROW_H + 10} rx={7} fill="none" stroke={GRAY} strokeWidth={1} strokeDasharray="4 3" />
                <rect x={cellX(1) - 5} y={cellY(1) - 5} width={COL_W + 10} height={ROW_H + 10} rx={7} fill="none" stroke={BLUE} strokeWidth={1} strokeDasharray="4 3" />
                <text x={cellX(0) - 4} y={96} fontSize={10} fill={MUTED}>토큰 A · 다른 작업용</text>
                <text x={cellX(1) + COL_W / 2} y={96} textAnchor="middle" fontSize={11} fill={BLUE}>토큰 B</text>
              </>
            )}
            {!scoped && <text x={14} y={92} fontSize={11} fill={BLUE}>토큰 범위 = 조직 전체</text>}

            {CELLS.map((name, i) => {
              const hit = breached && reach(i);
              return (
                <g key={i}>
                  <rect x={cellX(i)} y={cellY(i)} width={COL_W} height={ROW_H} rx={5} fill="none" stroke={hit ? RED : GRAY} strokeWidth={hit ? 1.25 : 1} />
                  <text x={cellX(i) + COL_W / 2} y={cellY(i) + 18} textAnchor="middle" fontSize={12} fontWeight={i < 2 ? 700 : 400} fill={i < 2 ? "currentColor" : MUTED}>{name}</text>
                  <text x={cellX(i) + COL_W / 2} y={cellY(i) + 33} textAnchor="middle" fontSize={11} fontWeight={hit ? 700 : 400} fill={hit ? RED : MUTED}>
                    {hit ? "유출 가능" : breached ? "닿지 않음" : ""}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
