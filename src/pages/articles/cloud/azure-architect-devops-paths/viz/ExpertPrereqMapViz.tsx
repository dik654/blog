import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — Solutions Architect Expert = AZ-305 + Azure Administrator Associate.
 * DevOps Engineer Expert = AZ-400 + (Administrator Associate 또는 Developer Associate).
 * AZ-204는 2026년 7월 31일 폐지 → 새로 준비하면 AZ-104가 현실적인 선행 경로. AI-200의 선행 자격 인정 여부는 공식 페이지 미갱신이라 접수 전 확인.
 * 용어 보충: AZ-104는 Administrator Associate, AZ-204는 Developer Associate를 얻는 시험이었다.
 */
const ACCENT = "#2563eb";
const RED = "#dc2626";
const GREEN = "#16a34a";
const AMBER = "#d97706";
const MUTED = "#94a3b8";
const LABEL = "#475569";

type Focus = "architect" | "devops" | "retired" | "ai200";

const SCENES = [
  {
    label: "Solutions Architect Expert",
    summary: "AZ-305 + Administrator Associate",
    focus: "architect",
    note: "AZ-305에 합격해도 Azure Administrator Associate가 없으면 Expert 자격이 나오지 않습니다. 두 조건을 모두 채워야 합니다.",
  },
  {
    label: "DevOps Engineer Expert",
    summary: "AZ-400 + 둘 중 하나",
    focus: "devops",
    note: "AZ-400 합격만으로는 나오지 않습니다. Administrator Associate나 Developer Associate 중 하나가 선행 자격입니다.",
  },
  {
    label: "AZ-204 폐지",
    summary: "2026-07-31 · 새로 준비하면 AZ-104",
    focus: "retired",
    note: "Developer Associate를 얻던 AZ-204가 2026년 7월 31일 폐지됐으므로, DevOps Engineer Expert를 지금 새로 준비한다면 AZ-104로 Administrator Associate를 얻는 길이 현실적인 선행 경로입니다.",
  },
  {
    label: "AI-200은 아직 확인 대기",
    summary: "선행 자격 인정 여부 미확인",
    focus: "ai200",
    note: "AI-200이 선행 자격으로 인정되는지는 공식 자격 페이지가 아직 갱신되지 않아 점선과 물음표로 두었습니다. 접수 전에 확인합니다.",
  },
] as const satisfies readonly { label: string; summary: string; focus: Focus; note: string }[];

function Node({ x, y, w, h, lines, color, on, strike = false }: { x: number; y: number; w: number; h: number; lines: readonly string[]; color: string; on: boolean; strike?: boolean }) {
  const top = y + h / 2 - ((lines.length - 1) * 13) / 2 + 4;
  return (
    <g opacity={on ? 1 : 0.28}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={strike ? "4 3" : undefined} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={top + index * 13} textAnchor="middle" fontSize={index === 0 ? 11 : 10} fontWeight={index === 0 ? 700 : 400} fill={index === 0 ? "currentColor" : LABEL}>
          {line}
        </text>
      ))}
    </g>
  );
}

function Edge({ x1, y1, x2, y2, color, on, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color: string; on: boolean; dashed?: boolean }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={on ? 1.25 : 1}
      strokeDasharray={dashed ? "4 3" : undefined}
      opacity={on ? 1 : 0.25}
      markerEnd={`url(#ep-${color.slice(1)})`}
    />
  );
}

export default function ExpertPrereqMapViz() {
  return (
    <SceneShell
      eyebrow="Expert 자격의 선행 조건"
      title="Expert 자격은 시험 하나가 아니라 두 조건을 함께 채워야 나옵니다"
      description="왼쪽은 시험, 가운데는 Associate 자격, 오른쪽은 Expert 자격입니다. AZ-104는 Administrator Associate를 얻는 시험이고, AZ-204는 Developer Associate를 얻던 시험입니다. 6절 기준이며 조건은 바뀔 수 있습니다."
      ariaLabel="Solutions Architect Expert와 DevOps Engineer Expert의 선행 자격, AZ-204 폐지와 AI-200 확인 대기"
      scenes={SCENES}
      render={(active) => {
        const focus: Focus = SCENES[active].focus;
        const arch = focus === "architect";
        const dev = focus === "devops";
        const retired = focus === "retired";
        const ai = focus === "ai200";
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              {[ACCENT, RED, GREEN, AMBER, MUTED].map((color) => (
                <marker key={color} id={`ep-${color.slice(1)}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
                  <path d="M0 0 L8 4 L0 8 z" fill={color} />
                </marker>
              ))}
            </defs>

            <Node x={4} y={20} w={76} h={40} lines={["AZ-104"]} color={retired ? GREEN : ACCENT} on={arch || dev || retired} />
            <Node x={4} y={86} w={76} h={40} lines={retired ? ["AZ-204", "폐지됨"] : ["AZ-204"]} color={retired ? RED : ACCENT} on={dev || retired} strike={retired} />
            <Node x={4} y={152} w={76} h={40} lines={ai ? ["AI-200", "인정 여부 ?"] : ["AI-200"]} color={AMBER} on={ai} strike />

            <Node x={110} y={20} w={106} h={40} lines={["Administrator", "Associate"]} color={ACCENT} on={arch || dev || retired} />
            <Node x={110} y={86} w={106} h={40} lines={["Developer", "Associate"]} color={ACCENT} on={dev} />

            <Node x={250} y={4} w={106} h={64} lines={["Solutions", "Architect Expert", "+ AZ-305 합격"]} color={ACCENT} on={arch} />
            <Node x={250} y={100} w={106} h={64} lines={["DevOps Engineer", "Expert", "+ AZ-400 합격"]} color={ACCENT} on={dev || retired || ai} />

            <Edge x1={80} y1={40} x2={108} y2={40} color={retired ? GREEN : ACCENT} on={arch || dev || retired} />
            <Edge x1={80} y1={106} x2={108} y2={106} color={retired ? RED : ACCENT} on={dev || retired} dashed={retired} />
            {retired ? (
              <text x={94} y={100} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>✕</text>
            ) : null}
            <Edge x1={216} y1={36} x2={248} y2={36} color={ACCENT} on={arch} />
            <Edge x1={216} y1={50} x2={248} y2={118} color={retired ? GREEN : ACCENT} on={dev || retired} />
            <Edge x1={216} y1={110} x2={248} y2={132} color={ACCENT} on={dev} />
            <Edge x1={80} y1={172} x2={248} y2={154} color={AMBER} on={ai} dashed />

            {arch ? <text x={303} y={86} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={ACCENT}>둘 다 필수</text> : null}
            {dev ? <text x={290} y={182} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={ACCENT}>Associate 둘 중 하나</text> : null}
            {retired ? <text x={163} y={76} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#15803d">새로 준비하면 이 길</text> : null}
            {ai ? <text x={190} y={194} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#b45309">? 접수 전 공식 페이지 확인</text> : null}
          </svg>
        );
      }}
    />
  );
}
