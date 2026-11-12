import SceneShell from "./SceneShell";

/**
 * 본문 대응: #space-authorization — 서명·issuer/audience·만료·proof chain을 먼저 보고,
 * 그다음 요청한 Space(resource)와 ability가 상위 위임 범위 안에 있는지 본다.
 * 본문 예: parent가 space/blob/add만 갖는데 child에 admin을 넣으면 A_c⊄A_p로 거절.
 * 로그인에 성공해도 다른 Space의 space/blob/add는 생기지 않는다. Space A라는 이름은 그림용 가정.
 */
const SCENES = [
  {
    label: "상위 위임이 가진 범위",
    summary: "Space A × space/blob/add",
    note: "상위 위임이 Space A의 space/blob/add 한 칸만 가졌다고 합시다(가정). 범위보다 먼저 서명·issuer와 audience·만료·proof chain을 확인합니다.",
    request: [] as readonly string[],
    verdict: "",
  },
  {
    label: "같은 칸을 요청하면",
    summary: "요청 ⊆ 상위 범위 → 통과",
    note: "같은 칸만 요청하면 요청이 모두 상위 범위 안입니다. caveat도 같거나 더 엄격하다면(가정) 범위가 넓어지지 않았으므로 통과합니다.",
    request: ["A-add"],
    verdict: "통과",
  },
  {
    label: "admin을 더하면",
    summary: "ability가 범위 밖 → 거절",
    note: "admin ability를 더하면 칸 하나가 상위 범위 밖으로 나갑니다. 위임은 범위를 넓힐 수 없어 거절합니다.",
    request: ["A-add", "A-admin"],
    verdict: "거절",
  },
  {
    label: "다른 Space를 요청하면",
    summary: "Space가 범위 밖 → 거절",
    note: "같은 space/blob/add라도 다른 Space 칸은 범위 밖입니다. 로그인에 성공해도 이 칸은 생기지 않습니다.",
    request: ["B-add"],
    verdict: "거절",
  },
] as const;

const W = 360;
const H = 218;
const ACCENT = "#2563eb";
const DENY = "#dc2626";
const OK = "#16a34a";
const MUTED = "#64748b";
const LINE = "#94a3b8";

const COLS = [
  { key: "A", label: "Space A (가정)", x: 128 },
  { key: "B", label: "다른 Space", x: 242 },
] as const;
const ROWS = [
  { key: "add", label: "space/blob/add", y: 74 },
  { key: "admin", label: "admin", y: 128 },
] as const;
const CELL_W = 106;
const CELL_H = 46;
const PRECHECKS = [
  { name: "서명", x: 8, w: 52 },
  { name: "issuer·audience", x: 66, w: 118 },
  { name: "만료", x: 190, w: 52 },
  { name: "proof chain", x: 248, w: 104 },
] as const;

export default function UcanScopeViz() {
  return (
    <SceneShell
      eyebrow="UCAN 위임 · 범위는 좁아질 수만 있음"
      title="요청한 칸이 하나라도 상위 범위 밖이면 거절합니다"
      description="가로는 resource(어느 Space), 세로는 ability(어떤 작업)입니다. 파란 테두리는 상위 위임이 가진 칸, 채운 칸은 하위 위임이 요청한 칸입니다. 위 네 가지 확인은 통과했다고 가정합니다."
      ariaLabel="상위 위임 범위 안팎으로 요청한 Space와 ability 칸을 비교해 통과와 거절을 판정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const requested = new Set<string>(scene.request);
        const verdictColor = scene.verdict === "통과" ? OK : DENY;
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto h-auto w-full max-w-[460px]"
            role="img"
            aria-label={`${scene.label}: ${scene.summary}`}
          >
            {/* 먼저 보는 네 가지 */}
            {PRECHECKS.map((check) => (
              <g key={check.name}>
                <rect x={check.x} y={6} width={check.w} height={24} rx={5} fill={OK} fillOpacity={0.06} stroke={LINE} strokeWidth={1} />
                <text x={check.x + check.w / 2} y={22} textAnchor="middle" fontSize={10} fill="currentColor">{check.name} ✓</text>
              </g>
            ))}
            <text x={8} y={46} fontSize={10} fill={MUTED}>그다음 범위 검사</text>

            {COLS.map((col) => (
              <text key={col.key} x={col.x + CELL_W / 2} y={66} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{col.label}</text>
            ))}
            {ROWS.map((row) => (
              <text key={row.key} x={116} y={row.y + 27} textAnchor="end" fontSize={11} fill="currentColor">{row.label}</text>
            ))}

            {COLS.flatMap((col) =>
              ROWS.map((row) => {
                const id = `${col.key}-${row.key}`;
                const inParent = id === "A-add";
                const isRequested = requested.has(id);
                const outside = isRequested && !inParent;
                const fill = isRequested ? (outside ? DENY : OK) : "none";
                return (
                  <g key={id}>
                    <rect
                      x={col.x}
                      y={row.y}
                      width={CELL_W}
                      height={CELL_H}
                      rx={6}
                      fill={fill}
                      fillOpacity={isRequested ? 0.14 : 0}
                      stroke={inParent ? ACCENT : outside ? DENY : LINE}
                      strokeWidth={inParent || outside ? 1.25 : 1}
                      strokeDasharray={inParent || outside ? undefined : "4 3"}
                    />
                    {inParent && (
                      <text x={col.x + 8} y={row.y + 15} fontSize={10} fill={ACCENT}>상위 범위</text>
                    )}
                    {isRequested && (
                      <text x={col.x + CELL_W / 2} y={row.y + 33} textAnchor="middle" fontSize={11} fontWeight={700} fill={outside ? DENY : OK}>
                        {outside ? "요청 · 범위 밖" : "요청"}
                      </text>
                    )}
                  </g>
                );
              }),
            )}

            <text x={180} y={204} textAnchor="middle" fontSize={13} fontWeight={700} fill={scene.verdict ? verdictColor : MUTED}>
              {scene.verdict ? `범위 검사 ${scene.verdict}` : "아직 요청 없음"}
            </text>
          </svg>
        );
      }}
    />
  );
}
