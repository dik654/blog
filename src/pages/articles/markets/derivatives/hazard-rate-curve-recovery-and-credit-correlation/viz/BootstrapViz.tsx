import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 첫 문단·#mechanism 첫 문단 — 1년·3년·5년 보호료로 앞 구간부터 차례로 세기를 푼다.
 * 1년 구간은 1절의 단순값 2%(보호료 1.2%÷손실률 60%). 3년·5년 보호료와 그 구간 값은 본문에 없으므로 숫자를 적지 않는다.
 * 칸의 가로 길이만 기간(1·2·2년)에 비례하고, 칸 높이는 값의 크기를 뜻하지 않는다.
 */
type Status = "solved" | "solving" | "waiting";

const SEGMENTS = [
  { name: "0~1년", from: 0, to: 1 },
  { name: "1~3년", from: 1, to: 3 },
  { name: "3~5년", from: 3, to: 5 },
] as const;

const SCENES = [
  {
    label: "1년 보호료 1.2%로 첫 구간",
    summary: "0~1년 세기 = 1.2% ÷ 60% = 2%",
    contract: 1,
    status: ["solving", "waiting", "waiting"],
    values: ["2%", "아직", "아직"],
    note: "1년 계약은 0~1년만 덮습니다. 할인곡선과 회수 40%를 고정하고 1년 보호료 1.2%에 맞는 첫 구간의 세기를 풉니다. 단순값은 2%입니다.",
  },
  {
    label: "3년 보호료로 1~3년",
    summary: "0~1년은 고정 · 1~3년만 새로 풂",
    contract: 3,
    status: ["solved", "solving", "waiting"],
    values: ["2% 고정", "?", "아직"],
    note: "3년 계약은 0~3년을 덮지만 그중 0~1년의 생존확률은 앞 단계에서 이미 풀었습니다. 그 값을 그대로 쓰고, 3년 보호료에 맞도록 1~3년 구간의 세기 하나만 풉니다. 본문에 3년 보호료 숫자가 없어 결과는 ?로 둡니다.",
  },
  {
    label: "5년 보호료로 3~5년",
    summary: "0~3년은 고정 · 3~5년만 새로 풂",
    contract: 5,
    status: ["solved", "solved", "solving"],
    values: ["2% 고정", "앞서 푼 값", "?"],
    note: "같은 방식으로 5년 계약은 앞의 두 구간을 고정한 채 3~5년만 풉니다. 이렇게 이은 만기별 세기가 6절의 위험강도곡선입니다. 보호료가 만기마다 다르면 구간마다 다른 값이 나옵니다.",
  },
] as const satisfies readonly { label: string; summary: string; contract: number; status: readonly Status[]; values: readonly string[]; note: string }[];

const W = 360;
const H = 150;
const X0 = 24;
const X1 = 340;
const PER_YEAR = (X1 - X0) / 5;
const x = (year: number) => X0 + year * PER_YEAR;

const STYLE: Record<Status, { fill: string; stroke: string; text: string; dash?: string }> = {
  solved: { fill: "#64748b", stroke: "#64748b", text: "#ffffff" },
  solving: { fill: "#fef3c7", stroke: "#d97706", text: "#92400e", dash: "4 3" },
  waiting: { fill: "none", stroke: "#cbd5e1", text: "#94a3b8", dash: "2 3" },
};

export default function BootstrapViz() {
  return (
    <SceneShell
      eyebrow="만기별로 차례로 풀기"
      title="앞 구간을 고정한 채 다음 구간 하나씩 풉니다"
      description="가로축은 0~5년입니다. 위 띠는 이번 단계에 쓰는 보호 계약이 덮는 기간, 아래 칸은 구간별 부도 도착 세기입니다. 칸 높이는 값의 크기가 아니며, 본문에 없는 3년·5년 값은 숫자 대신 ?로 둡니다."
      ariaLabel="1년, 3년, 5년 보호료로 0~1년, 1~3년, 3~5년 구간의 세기를 차례로 푸는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={x(0)} y={18} width={x(scene.contract) - x(0)} height={16} rx={3} fill="#2563eb" fillOpacity={0.15} stroke="#2563eb" strokeWidth={1} />
            <text x={x(0) + 6} y={30} fontSize={10} fontWeight={700} fill="#1e40af">{scene.contract}년 계약이 덮는 기간</text>
            {SEGMENTS.map((segment, index) => {
              const status = (scene.status as readonly Status[])[index];
              const style = STYLE[status];
              const left = x(segment.from) + 2;
              const width = x(segment.to) - x(segment.from) - 4;
              return (
                <g key={segment.name}>
                  <rect x={left} y={52} width={width} height={42} rx={4} fill={style.fill} stroke={style.stroke} strokeWidth={1} strokeDasharray={style.dash} />
                  <text x={left + width / 2} y={77} textAnchor="middle" fontSize={11} fontWeight={700} fill={style.text}>{(scene.values as readonly string[])[index]}</text>
                </g>
              );
            })}
            <line x1={X0} x2={X1} y1={108} y2={108} stroke="#94a3b8" strokeWidth={1} />
            {[0, 1, 3, 5].map((year) => (
              <g key={year}>
                <line x1={x(year)} x2={x(year)} y1={105} y2={111} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(year)} y={124} textAnchor="middle" fontSize={10} fill="#64748b">{year}년</text>
              </g>
            ))}
            <g fontSize={10} fill="#64748b">
              <rect x={X0} y={134} width={10} height={10} rx={2} fill="#64748b" />
              <text x={X0 + 14} y={143}>고정</text>
              <rect x={X0 + 54} y={134} width={10} height={10} rx={2} fill="#fef3c7" stroke="#d97706" strokeWidth={1} strokeDasharray="3 2" />
              <text x={X0 + 68} y={143}>이번에 푸는 칸</text>
              <rect x={X0 + 150} y={134} width={10} height={10} rx={2} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 2" />
              <text x={X0 + 164} y={143}>아직 안 푼 칸</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
