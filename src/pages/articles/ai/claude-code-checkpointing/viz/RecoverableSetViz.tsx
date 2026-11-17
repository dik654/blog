import SceneShell from "./SceneShell";

/**
 * 본문 대응: #coverage — 1절의 세 effect(auth.ts·generated.ts·INC-81)를
 * R = E_file ∩ T_direct 집합에 하나씩 넣어 본다.
 * auth.ts = direct Edit, generated.ts = Bash formatter, INC-81 = API ticket.
 * 마지막 장면 설명의 복구 수단은 #recovery-plan 목록을 그대로 쓴다.
 */
const SCENES = [
  {
    label: "세 effect를 펼칩니다",
    summary: "effect 3개",
    note: "1절의 session에서 생긴 세 변화와, 각각을 만든 경로(direct Edit, Bash formatter, API)입니다. 회색 경계는 아직 판정 전이며 다음 두 장면에서 하나씩 확인합니다.",
  },
  {
    label: "E_file: file 변화인가",
    summary: "E_file = {auth.ts, generated.ts}",
    note: "E_file은 session 동안 생긴 모든 file content 변화입니다. auth.ts와 generated.ts는 file이라 안에 들고, INC-81 ticket은 machine 밖에 남는 remote effect(E_remote)라 바깥에 놓입니다.",
  },
  {
    label: "T_direct: direct edit로 기록됐나",
    summary: "T_direct = {auth.ts}",
    note: "T_direct는 Claude Code가 direct edit 전에 snapshot으로 기록한 것입니다. generated.ts도 file이지만 Bash formatter가 다시 썼으므로 이 안에 들지 않습니다. Symlink·hard link를 거친 file은 이 그림처럼 단정하지 말고 따로 시험합니다.",
  },
  {
    label: "Rewind가 돌려놓는 것",
    summary: "R = {auth.ts}, E_remote ∩ R = ∅",
    note: "두 경계가 겹친 auth.ts만 checkpoint로 복원됩니다. generated.ts는 command log·Git·backup, INC-81은 transaction·stable operation ID·status lookup·compensation이 따로 맡습니다.",
  },
] as const;

const ITEMS = [
  { name: "auth.ts", via: "direct Edit", x: 104, y: 146, w: 88 },
  { name: "generated.ts", via: "Bash formatter", x: 214, y: 112, w: 106 },
  { name: "INC-81", via: "API ticket", x: 339, y: 132, w: 80 },
] as const;

const BORDER = "#94a3b8";
const ACCENT = "#2563eb";
const REMOTE = "#d97706";
const MUTED = "#64748b";

function inR(index: number) {
  return index === 0;
}

export default function RecoverableSetViz() {
  return (
    <SceneShell
      eyebrow="복구 집합"
      title="세 effect 중 rewind가 돌려놓는 것은 하나입니다"
      description="1절의 auth.ts·generated.ts·INC-81을 두 경계에 차례로 넣어 봅니다. E_file은 session 동안 생긴 file 변화, T_direct는 Claude Code가 direct edit 전에 snapshot으로 기록한 것, E_remote는 database·API처럼 machine 밖에 남는 변화, R은 checkpoint만으로 복원되는 집합입니다."
      ariaLabel="auth.ts, generated.ts, INC-81을 E_file, T_direct, E_remote 집합에 배치해 R을 찾는 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox="0 0 400 240" role="img" aria-label={SCENES[active].summary} className="mx-auto block h-auto w-full max-w-md">
            <rect x="6" y="6" width="388" height="228" rx="10" fill="none" stroke={BORDER} strokeWidth="1" />
            <text x="18" y="27" fontSize="13" fill={MUTED}>
              session 동안 생긴 effect
            </text>
            <ellipse
              cx="152"
              cy="138"
              rx="128"
              ry="84"
              fill={active >= 1 ? "#2563eb14" : "none"}
              stroke={active >= 1 ? ACCENT : BORDER}
              strokeWidth={active >= 1 ? 1.25 : 1}
            />
            <text x="152" y="74" fontSize="15" textAnchor="middle" fontWeight="700" fill={active >= 1 ? ACCENT : MUTED}>
              E_file
            </text>
            <ellipse
              cx="104"
              cy="152"
              rx="60"
              ry="46"
              fill={active >= 3 ? "#16a34a26" : "none"}
              stroke={active >= 2 ? "#16a34a" : BORDER}
              strokeWidth={active >= 2 ? 1.25 : 1}
              strokeDasharray={active >= 2 ? undefined : "4 4"}
            />
            <text x="104" y="124" fontSize="14" textAnchor="middle" fontWeight="700" fill={active >= 2 ? "#15803d" : MUTED}>
              {active >= 3 ? "R" : "T_direct"}
            </text>
            <rect
              x="294"
              y="40"
              width="90"
              height="184"
              rx="10"
              fill="none"
              stroke={active >= 1 ? REMOTE : BORDER}
              strokeWidth="1"
              strokeDasharray="5 4"
            />
            <text x="339" y="62" fontSize="14" textAnchor="middle" fontWeight="700" fill={active >= 1 ? REMOTE : MUTED}>
              E_remote
            </text>
            {ITEMS.map((item, index) => {
              const restored = active >= 3 && inR(index);
              const dimmed = active >= 3 && !inR(index);
              return (
                <g key={item.name} opacity={dimmed ? 0.55 : 1}>
                  <rect
                    x={item.x - item.w / 2}
                    y={item.y - 15}
                    width={item.w}
                    height="30"
                    rx="6"
                    fill="#ffffff"
                    stroke={restored ? "#16a34a" : "#475569"}
                    strokeWidth={restored ? 1.25 : 1}
                  />
                  <text x={item.x} y={item.y + 5} fontSize="14" textAnchor="middle" fontWeight="700" fill="#0f172a">
                    {item.name}
                  </text>
                  <text x={item.x} y={item.y + 32} fontSize="12" textAnchor="middle" fill={MUTED}>
                    {item.via}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    />
  );
}
