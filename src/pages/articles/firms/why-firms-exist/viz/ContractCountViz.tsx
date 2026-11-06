import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 여섯 사람이 모두 서로 계약하면 15개, 가운데 한 사람을 더 두면 6개.
 * 15 = 6 × 5 ÷ 2. 두 숫자는 "모든 쌍이 계약"과 "관리자 한 명 추가"라는 가정에 달려 있다.
 */
const CY = 90;
const R = 62;
const LEFT_X = 90;
const RIGHT_X = 270;

const ring = (cx: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 3;
    return { x: cx + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
  });
const LEFT = ring(LEFT_X);
const RIGHT = ring(RIGHT_X);
const PAIRS = LEFT.flatMap((_, a) => LEFT.flatMap((__, b) => (a < b ? [[a, b] as const] : [])));

const SCENES = [
  { label: "모두가 서로 계약", summary: "6 × 5 ÷ 2 = 15개", focus: "left", note: "한 사람에게서 다른 다섯 사람으로 선이 5개 나갑니다. 6 × 5 = 30이지만 선 하나를 양쪽 끝의 두 사람이 함께 세었으므로 2로 나눠 15개입니다." },
  { label: "가운데 한 사람을 더 둠", summary: "6명 + 관리자 1명 → 6개", focus: "right", note: "일곱째 사람인 관리자를 가운데 두고 여섯 사람이 그 사람과만 계약하면 선은 6개입니다. 사람은 한 명 늘었습니다." },
  { label: "두 숫자에 들어 있는 가정", summary: "증명이 아니라 가정의 계산", focus: "both", note: "15에는 모든 사람 쌍이 계약한다는 가정이, 6에는 관리자를 한 명 더 둔다는 가정이 들어 있습니다. 그래서 15와 6의 차이만으로 회사의 존재를 증명할 수는 없습니다." },
] as const;

function Node({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={11} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">{label}</text>
    </g>
  );
}

export default function ContractCountViz() {
  return (
    <SceneShell
      eyebrow="계약 수 세기"
      title="모두가 서로 계약하면 15개, 가운데 한 사람을 더 두면 6개"
      description="선 하나가 계약 하나입니다. 본문이 말하는 그림을 그대로 그린 것이며 회사의 존재를 증명하는 그림은 아닙니다."
      ariaLabel="여섯 사람의 쌍별 계약 15개와 관리자를 둔 계약 6개 비교"
      scenes={SCENES}
      render={(active) => {
        const { focus } = SCENES[active];
        const dashed = focus === "both" ? "4 3" : undefined;
        return (
          <svg viewBox="0 0 360 192" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <g opacity={focus === "right" ? 0.25 : 1}>
              {PAIRS.map(([a, b]) => (
                <line key={`${a}-${b}`} x1={LEFT[a].x} y1={LEFT[a].y} x2={LEFT[b].x} y2={LEFT[b].y} stroke="#2563eb" strokeWidth={1} strokeDasharray={dashed} />
              ))}
              {LEFT.map((p, i) => <Node key={i} x={p.x} y={p.y} label={String(i + 1)} />)}
              <text x={LEFT_X} y={182} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">모든 쌍이 계약 · 15개</text>
            </g>
            <g opacity={focus === "left" ? 0.25 : 1}>
              {RIGHT.map((p, i) => (
                <line key={i} x1={RIGHT_X} y1={CY} x2={p.x} y2={p.y} stroke="#2563eb" strokeWidth={1} strokeDasharray={dashed} />
              ))}
              {RIGHT.map((p, i) => <Node key={i} x={p.x} y={p.y} label={String(i + 1)} />)}
              <Node x={RIGHT_X} y={CY} label="관" />
              <text x={RIGHT_X} y={182} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">관리자 1명 추가 · 6개</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
