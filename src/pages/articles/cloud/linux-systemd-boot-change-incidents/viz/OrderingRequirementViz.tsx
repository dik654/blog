import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ordering — 순서 관계(After=)와 요구 관계(Wants=·Requires=)는 서로 독립이다.
 * After=b: 둘 다 시작할 때 b가 시작을 마친 뒤 a, 멈출 때는 a 먼저, b를 시작시키지는 않음.
 * Wants=b: a를 시작할 때 b도 시작, 동시에 시작, b가 실패해도 a는 시작.
 * Requires=b: After=b가 없으면 b의 실패를 기다리지 않음, After=b가 있으면 b 실패 시 a를 시작하지 않음.
 * 마지막 장면은 network-online.target을 Wants=+After=로 함께 적는 패턴.
 * 가로축은 순서만 보이며 길이는 가정이다.
 */
type Kind = "starting" | "up" | "stopping";

interface Lane {
  name: string;
  segments: readonly { from: number; to: number; kind: Kind }[];
  end?: "fail" | "skip" | "idle";
  endAt?: number;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  lines: readonly string[];
  request: string;
  b: Lane;
  a: Lane;
  wait?: number;
}

const B = "b.service";
const A = "a.service";

const SCENES: readonly Scene[] = [
  {
    label: "After=b · 둘 다 시작",
    summary: "b가 시작을 마친 뒤 a",
    note: "After=는 순서만 정합니다. a와 b를 둘 다 시작할 때 b가 시작을 마친 다음 a를 시작합니다.",
    lines: ["After=b.service"],
    request: "a와 b를 함께 시작",
    b: { name: B, segments: [{ from: 0, to: 3, kind: "starting" }, { from: 3, to: 10, kind: "up" }] },
    a: { name: A, segments: [{ from: 3, to: 5, kind: "starting" }, { from: 5, to: 10, kind: "up" }] },
    wait: 3,
  },
  {
    label: "After=b · 둘 다 멈춤",
    summary: "멈출 때는 a 먼저",
    note: "멈출 때는 순서가 거꾸로입니다. 같은 After=b 한 줄 때문에 a를 먼저 멈추고 그다음 b를 멈춥니다.",
    lines: ["After=b.service"],
    request: "a와 b를 함께 멈춤",
    b: { name: B, segments: [{ from: 0, to: 5, kind: "up" }, { from: 5, to: 7, kind: "stopping" }] },
    a: { name: A, segments: [{ from: 0, to: 3, kind: "up" }, { from: 3, to: 5, kind: "stopping" }] },
    wait: 5,
  },
  {
    label: "After=b · a만 시작",
    summary: "b는 꺼진 채로",
    note: "순서 관계는 둘 다 시작하는 경우에만 의미가 있고 b를 시작시키지 않습니다. a만 시작하면 b는 그대로 꺼져 있습니다.",
    lines: ["After=b.service"],
    request: "a만 시작",
    b: { name: B, segments: [], end: "idle", endAt: 0 },
    a: { name: A, segments: [{ from: 0, to: 2, kind: "starting" }, { from: 2, to: 10, kind: "up" }] },
  },
  {
    label: "Wants=b · b 실패",
    summary: "동시에 시작, a는 계속",
    note: "Wants=는 a를 시작할 때 b도 시작합니다. 순서는 정하지 않으므로 둘이 동시에 시작하고, b가 실패해도 a는 시작합니다.",
    lines: ["Wants=b.service"],
    request: "a만 시작",
    b: { name: B, segments: [{ from: 0, to: 3, kind: "starting" }], end: "fail", endAt: 3 },
    a: { name: A, segments: [{ from: 0, to: 2, kind: "starting" }, { from: 2, to: 10, kind: "up" }] },
  },
  {
    label: "Requires=b · After 없음",
    summary: "b의 실패를 기다리지 않음",
    note: "Requires=는 더 강한 요구지만 순서를 정하지 않습니다. After=가 없으면 a와 b가 동시에 시작하고 a는 b의 실패를 기다리지 않습니다.",
    lines: ["Requires=b.service"],
    request: "a만 시작",
    b: { name: B, segments: [{ from: 0, to: 3, kind: "starting" }], end: "fail", endAt: 3 },
    a: { name: A, segments: [{ from: 0, to: 2, kind: "starting" }, { from: 2, to: 10, kind: "up" }] },
  },
  {
    label: "Requires=b + After=b",
    summary: "b 실패 → a 시작 안 함",
    note: "After=b도 함께 적어야 a가 b의 결과를 기다립니다. b가 실패하면 a를 시작하지 않습니다.",
    lines: ["Requires=b.service", "After=b.service"],
    request: "a만 시작",
    b: { name: B, segments: [{ from: 0, to: 3, kind: "starting" }], end: "fail", endAt: 3 },
    a: { name: A, segments: [], end: "skip", endAt: 3 },
    wait: 3,
  },
  {
    label: "네트워크 뒤에 설 서비스",
    summary: "online target 뒤에 api",
    note: "네트워크가 실제로 설정된 뒤에 떠야 하는 서비스는 두 줄을 함께 적습니다. Wants=로 network-online.target을 끌어오고 After=로 그 뒤에 섭니다.",
    lines: ["Wants=network-online.target", "After=network-online.target"],
    request: "api.service 시작",
    b: { name: "network-online.target", segments: [{ from: 0, to: 4, kind: "starting" }, { from: 4, to: 10, kind: "up" }] },
    a: { name: "api.service", segments: [{ from: 4, to: 6, kind: "starting" }, { from: 6, to: 10, kind: "up" }] },
    wait: 4,
  },
];

const W = 360;
const H = 136;
const X0 = 14;
const X1 = 346;
const tx = (t: number) => X0 + (t / 10) * (X1 - X0);
const LANE_Y = { b: 34, a: 98 } as const;
const BAR_H = 16;

function LaneView({ lane, y }: { lane: Lane; y: number }) {
  return (
    <g>
      <text x={X0} y={y - 12} fontSize={12} fontWeight={700} fill="#334155">{lane.name}</text>
      <line x1={X0} x2={X1} y1={y + BAR_H / 2} y2={y + BAR_H / 2} stroke="#e2e8f0" strokeWidth={1} />
      {lane.segments.map((seg) => (
        <rect
          key={`${seg.from}-${seg.kind}`}
          x={tx(seg.from)}
          y={y}
          width={tx(seg.to) - tx(seg.from)}
          height={BAR_H}
          rx={2}
          fill={seg.kind === "up" ? "#2563eb" : seg.kind === "starting" ? "#bfdbfe" : "#ffffff"}
          stroke={seg.kind === "stopping" ? "#64748b" : "#2563eb"}
          strokeWidth={1}
          strokeDasharray={seg.kind === "stopping" ? "3 2" : undefined}
        />
      ))}
      {lane.end === "fail" && lane.endAt !== undefined && (
        <g>
          <text x={tx(lane.endAt) + 4} y={y + 13} fontSize={15} fontWeight={700} fill="#dc2626">×</text>
          <text x={tx(lane.endAt) + 18} y={y + 12} fontSize={12} fontWeight={700} fill="#dc2626">실패</text>
        </g>
      )}
      {lane.end === "skip" && lane.endAt !== undefined && (
        <g>
          <text x={tx(lane.endAt) - 5} y={y + 13} fontSize={15} fontWeight={700} fill="#dc2626">×</text>
          <text x={tx(lane.endAt) + 9} y={y + 12} fontSize={12} fontWeight={700} fill="#dc2626">시작하지 않음</text>
        </g>
      )}
      {lane.end === "idle" && lane.endAt !== undefined && (
        <text x={tx(lane.endAt)} y={y + 12} fontSize={12} fill="#64748b">시작 요청 없음 · 꺼진 채</text>
      )}
    </g>
  );
}

export default function OrderingRequirementViz() {
  return (
    <SceneShell
      eyebrow="After= / Wants= / Requires="
      title="순서 줄과 요구 줄은 따로 움직입니다"
      description="a.service 파일에 적은 줄에 따라 두 unit이 시작하고 멈추는 순서입니다. After=는 순서를, Wants=·Requires=는 요구를 적는 줄이고 b는 a가 가리키는 다른 unit입니다. 가로축은 순서만 보이며 막대 길이는 가정입니다."
      ariaLabel="After, Wants, Requires 조합별로 두 unit이 시작하고 멈추는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <pre className="h-[5rem] overflow-hidden rounded-md border border-border bg-background px-3 py-2 font-mono text-xs leading-5">
                {`# ${scene.a.name} [Unit]\n${scene.lines.join("\n")}`}
              </pre>
              <p className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">요청</span>
                <span className="rounded-md border border-border px-2 py-1 font-semibold">{scene.request}</span>
              </p>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {scene.wait !== undefined && (
                <line x1={tx(scene.wait)} x2={tx(scene.wait)} y1={LANE_Y.b - 4} y2={LANE_Y.a + BAR_H + 4} stroke="#475569" strokeWidth={1} strokeDasharray="2 3" />
              )}
              <LaneView lane={scene.b} y={LANE_Y.b} />
              <LaneView lane={scene.a} y={LANE_Y.a} />
              <text x={X1} y={H - 4} textAnchor="end" fontSize={10} fill="#64748b">시간 →</text>
            </svg>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5"><span className="inline-block h-3 w-5 rounded-sm border border-[#2563eb] bg-[#bfdbfe]" />시작 중</li>
              <li className="flex items-center gap-1.5"><span className="inline-block h-3 w-5 rounded-sm bg-[#2563eb]" />시작 완료</li>
              <li className="flex items-center gap-1.5"><span className="inline-block h-3 w-5 rounded-sm border border-dashed border-[#64748b]" />멈추는 중</li>
              <li className="flex items-center gap-1.5"><span className="font-bold text-[#dc2626]">×</span>실패 · 시작 안 함</li>
              <li className="flex items-center gap-1.5"><span className="inline-block h-0 w-5 border-t border-dashed border-[#475569]" />기다린 지점</li>
            </ul>
          </div>
        );
      }}
    />
  );
}
