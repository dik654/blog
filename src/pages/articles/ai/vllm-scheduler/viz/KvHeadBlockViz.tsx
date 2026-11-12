import SceneShell from "./SceneShell";

/**
 * 본문 대응: #priority-order 셋째 문단 — 빈 KV 블록 200, 앞 요청 500, 뒤 요청 20.
 * 앞 요청의 할당 실패에서 순회가 멈추는 경로라면 뒤 요청 20도 기다립니다. (가정)
 * 마지막 장면은 5절의 "건너뛰는 정책" 비교이며 원문 경로가 아닙니다.
 * 막대 길이는 블록 수에 비례합니다(1블록 = 0.48 단위).
 */
const FREE = 200;
const FRONT = 500;
const BACK = 20;
const UNIT = 0.48;
const X0 = 84;

type Status = "wait" | "fail" | "blocked" | "admit";

const SCENES = [
  {
    label: "대기열과 빈 칸",
    summary: "빈 KV 블록 200",
    front: "wait" as Status,
    back: "wait" as Status,
    freeAfter: FREE,
    note: "KV 블록은 과거 위치의 계산 기록을 담는 저장 칸입니다. 대기열 앞 요청은 500칸, 뒤 요청은 20칸이 필요합니다. 막대 길이는 칸 수에 비례합니다. (가정)",
  },
  {
    label: "앞 요청 할당 실패",
    summary: "500 > 200",
    front: "fail" as Status,
    back: "wait" as Status,
    freeAfter: FREE,
    note: "앞 요청의 500칸은 빈 200칸에 들어가지 않아 할당이 실패합니다. 우선순위가 앞서도 이 공간 검사는 건너뛰지 못합니다.",
  },
  {
    label: "순회가 멈추는 경로",
    summary: "20 ≤ 200인데 대기",
    front: "fail" as Status,
    back: "blocked" as Status,
    freeAfter: FREE,
    note: "앞의 할당 실패에서 순회가 멈추는 경로라면 뒤 요청은 검토되지 않아 둘 다 기다립니다. 뒤 요청은 200칸에 충분히 들어가는데도 기다리는 것이 head-of-line blocking입니다. 다른 상태를 건너뛰는 분기도 있으므로 모든 대기 원인을 이 경로로 일반화하지 않습니다.",
  },
  {
    label: "비교 · 건너뛰는 정책",
    summary: "뒤 20 수용, 빈 칸 180",
    front: "fail" as Status,
    back: "admit" as Status,
    freeAfter: FREE - BACK,
    note: "5절의 다른 정책 선택입니다. 앞 요청을 건너뛰면 뒤 요청 20칸이 들어가고 180칸이 남습니다. 앞 요청은 여전히 500칸을 기다리며, 건너뛰기가 반복되면 큰 요청이 시작하지 못할 수도 있습니다.",
  },
] as const;

const STATUS_TEXT: Record<Status, string> = {
  wait: "대기",
  fail: "할당 실패",
  blocked: "검토 안 됨",
  admit: "수용",
};

const STATUS_COLOR: Record<Status, string> = {
  wait: "#64748b",
  fail: "#dc2626",
  blocked: "#d97706",
  admit: "#16a34a",
};

function RequestRow({ y, name, need, status }: { y: number; name: string; need: number; status: Status }) {
  const color = STATUS_COLOR[status];
  return (
    <g>
      <text x={8} y={y + 13} fontSize={12} fontWeight={700} fill="#334155">{name}</text>
      <rect x={X0} y={y} width={need * UNIT} height={18} rx={2} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1} strokeDasharray={status === "blocked" ? "4 3" : undefined} />
      <text x={X0 + 4 + need * UNIT} y={y + 13} fontSize={11} fill="#334155">
        {need}칸
      </text>
      <text x={8} y={y + 30} fontSize={11} fontWeight={700} fill={color}>{STATUS_TEXT[status]}</text>
    </g>
  );
}

export default function KvHeadBlockViz() {
  return (
    <SceneShell
      eyebrow="Head-of-line blocking"
      title="앞 요청이 들어가지 못하면 들어갈 수 있는 뒤 요청도 기다릴 수 있습니다"
      description="위 막대가 빈 KV 블록, 아래 두 막대가 대기열 순서대로 놓인 요청의 필요량입니다. 모든 막대는 같은 축척이며 수치는 본문의 가정입니다."
      ariaLabel="빈 KV 블록 200에 앞 요청 500과 뒤 요청 20을 넣는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const used = FREE - scene.freeAfter;
        return (
          <svg viewBox="0 0 360 160" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={8} y={27} fontSize={12} fontWeight={700} fill="#334155">빈 KV 칸</text>
            <rect x={X0} y={14} width={FREE * UNIT} height={18} rx={2} fill="#2563eb" fillOpacity={0.12} stroke="#2563eb" strokeWidth={1} />
            {used > 0 && <rect x={X0} y={14} width={used * UNIT} height={18} fill="#16a34a" fillOpacity={0.45} />}
            <text x={X0 + FREE * UNIT + 6} y={27} fontSize={11} fill="#1d4ed8" fontWeight={700}>
              {used > 0 ? `${scene.freeAfter} 남음` : `${FREE}`}
            </text>
            <line x1={X0 + FREE * UNIT} x2={X0 + FREE * UNIT} y1={8} y2={152} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
            <text x={8} y={62} fontSize={10} fill="#64748b">대기열 순서 ↓</text>
            <RequestRow y={70} name="① 앞 요청" need={FRONT} status={scene.front} />
            <RequestRow y={116} name="② 뒤 요청" need={BACK} status={scene.back} />
          </svg>
        );
      }}
    />
  );
}
