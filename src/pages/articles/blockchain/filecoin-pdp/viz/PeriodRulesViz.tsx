import SceneShell from "./SceneShell";

/**
 * 본문 대응: #period-state — PDPVerifier가 leaf·path를 검증한 뒤 listener(SimplePDPService)의 possessionProven을 부른다.
 * listener는 같은 period 중복 제출, 필요한 수보다 적은 challenge, 시작 전·너무 이른·deadline 뒤 제출을 거부한다.
 * 다음 period로 이동할 때 이전 proof가 없었거나 여러 period를 건너뛰었다면 FaultRecord를 남긴다.
 * 시간축 구간 폭은 비례가 아닌 도식이다.
 */
type Mark = { x: number; kind: "ok" | "reject"; tag?: string };
type Stage = { label: string; tone: "ok" | "bad" | "none" };

const SCENES = [
  {
    label: "제때, 필요한 수만큼",
    summary: "Merkle 통과 + 일정 통과",
    note: "허용 구간 안에서, 이번 period의 첫 제출로, 필요한 수의 challenge를 모두 담았습니다. 두 판단이 모두 통과해야 이번 period가 성공합니다.",
    marks: [{ x: 120, kind: "ok" }] as readonly Mark[],
    merkle: { label: "leaf·path가 root에 열림", tone: "ok" } as Stage,
    listener: { label: "일정 통과", tone: "ok" } as Stage,
    fault: null as null | { from: number; to: number; text: string },
  },
  {
    label: "같은 period에 또 제출",
    summary: "Merkle 통과, 일정 거부",
    note: "두 번째 제출의 proof가 암호적으로 맞아도 listener는 같은 period의 중복 제출로 보고 거부합니다.",
    marks: [{ x: 112, kind: "ok", tag: "1차" }, { x: 130, kind: "reject", tag: "2차" }] as readonly Mark[],
    merkle: { label: "leaf·path가 root에 열림", tone: "ok" } as Stage,
    listener: { label: "거부 · 중복 제출", tone: "bad" } as Stage,
    fault: null,
  },
  {
    label: "challenge 수가 모자람",
    summary: "Merkle 통과, 개수 거부",
    note: "제출한 leaf는 모두 열렸어도 필요한 수보다 적은 challenge만 담았다면 listener가 거부합니다.",
    marks: [{ x: 120, kind: "reject" }] as readonly Mark[],
    merkle: { label: "낸 것은 열림 · 개수 부족", tone: "ok" } as Stage,
    listener: { label: "거부 · challenge 부족", tone: "bad" } as Stage,
    fault: null,
  },
  {
    label: "시작 전 · 너무 이름 · deadline 뒤",
    summary: "시점이 틀리면 거부",
    note: "proving이 시작되기 전, 허용 구간보다 이른 때, deadline이 지난 뒤의 제출은 proof가 맞아도 listener가 거부합니다.",
    marks: [{ x: 20, kind: "reject" }, { x: 66, kind: "reject" }, { x: 160, kind: "reject", tag: "deadline 뒤" }] as readonly Mark[],
    merkle: { label: "leaf·path가 root에 열림", tone: "ok" } as Stage,
    listener: { label: "거부 · 제출 시점", tone: "bad" } as Stage,
    fault: null,
  },
  {
    label: "proof 없이 다음 period로",
    summary: "FaultRecord",
    note: "period 1에 proof가 없었는데 다음 period로 이동하면 listener가 FaultRecord를 남깁니다. 제출이 없으니 Merkle 검증도 일어나지 않습니다.",
    marks: [] as readonly Mark[],
    merkle: { label: "제출 없음", tone: "none" } as Stage,
    listener: { label: "FaultRecord", tone: "bad" } as Stage,
    fault: { from: 34, to: 142, text: "proof 없음" },
  },
  {
    label: "여러 period를 건너뜀",
    summary: "FaultRecord",
    note: "period 여러 개를 건너뛰고 이동해도 listener가 FaultRecord를 남깁니다.",
    marks: [] as readonly Mark[],
    merkle: { label: "제출 없음", tone: "none" } as Stage,
    listener: { label: "FaultRecord", tone: "bad" } as Stage,
    fault: { from: 34, to: 250, text: "여러 period 건너뜀" },
  },
] as const;

const PERIODS = [
  { start: 34, window: 100, end: 142, name: "period 1" },
  { start: 142, window: 142, end: 250, name: "period 2" },
  { start: 250, window: 250, end: 358, name: "period 3" },
] as const;

const TONE = {
  ok: "border-[#16a34a] text-[#15803d] dark:text-[#4ade80]",
  bad: "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]",
  none: "border-dashed border-border text-muted-foreground",
} as const;

function MarkGlyph({ mark }: { mark: Mark }) {
  const y = 56;
  if (mark.kind === "reject") {
    return (
      <g>
        <g stroke="#dc2626" strokeWidth={1.25}>
          <line x1={mark.x - 5} y1={y - 5} x2={mark.x + 5} y2={y + 5} />
          <line x1={mark.x - 5} y1={y + 5} x2={mark.x + 5} y2={y - 5} />
        </g>
        {mark.tag && <text x={mark.x} y={y - 9} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b91c1c">{mark.tag}</text>}
      </g>
    );
  }
  return (
    <g>
      <circle cx={mark.x} cy={y} r={5} fill="#16a34a" />
      {mark.tag && <text x={mark.x} y={y - 9} textAnchor="middle" fontSize={11} fontWeight={700} fill="#15803d">{mark.tag}</text>}
    </g>
  );
}

export default function PeriodRulesViz() {
  return (
    <SceneShell
      eyebrow="암호 검증과 일정 판정"
      title="proof가 맞아도 언제, 몇 개를 냈는지에서 다시 걸러집니다"
      description="위 두 칸은 한 transaction 안의 두 판단입니다. 아래 시간축에서 ●는 받아들여진 제출, ✕는 거부된 제출입니다. 구간 폭은 비례가 아닌 도식이며, period 2·3의 안쪽 구간은 생략했습니다."
      ariaLabel="PDP 제출이 Merkle 검증과 listener 일정 판정을 거치는 경우들"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-2 text-xs">
              <div className={`rounded-lg border px-3 py-2 ${TONE[scene.merkle.tone]}`}>
                <span className="block text-[11px] text-muted-foreground">① PDPVerifier · Merkle 검증</span>
                <span className="block font-bold">{scene.merkle.label}</span>
              </div>
              <span className="self-center text-muted-foreground">→</span>
              <div className={`rounded-lg border px-3 py-2 ${TONE[scene.listener.tone]}`}>
                <span className="block text-[11px] text-muted-foreground">② listener · 일정 판정</span>
                <span className="block font-bold">{scene.listener.label}</span>
              </div>
            </div>
            <svg viewBox="0 0 368 118" className="mx-auto block h-auto w-full max-w-[620px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <rect x={6} y={44} width={28} height={24} fill="#f1f5f9" />
              <text x={20} y={84} textAnchor="middle" fontSize={11} className="fill-muted-foreground">시작 전</text>
              {PERIODS.map((p, i) => (
                <g key={p.name}>
                  {i === 0 ? (
                    <>
                      <rect x={p.start} y={44} width={p.window - p.start} height={24} fill="#e2e8f0" />
                      <rect x={p.window} y={44} width={p.end - p.window} height={24} fill="#bbf7d0" />
                    </>
                  ) : (
                    <rect x={p.start + 1} y={44} width={p.end - p.start - 1} height={24} fill="#f1f5f9" />
                  )}
                  <line x1={p.end} y1={38} x2={p.end} y2={74} stroke="#475569" strokeWidth={1} />
                  <text x={(p.start + p.end) / 2} y={30} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">{p.name}</text>
                  {i === 0 && (
                    <>
                      <text x={(p.start + p.window) / 2} y={84} textAnchor="middle" fontSize={11} className="fill-muted-foreground">너무 이름</text>
                      <text x={(p.window + p.end) / 2} y={84} textAnchor="middle" fontSize={11} className="fill-[#15803d] dark:fill-[#4ade80]">허용 구간</text>
                      <text x={p.end} y={100} textAnchor="middle" fontSize={11} className="fill-muted-foreground">deadline</text>
                    </>
                  )}
                </g>
              ))}
              <line x1={34} y1={38} x2={34} y2={74} stroke="#475569" strokeWidth={1} strokeDasharray="2 2" />
              {scene.marks.map((mark) => (
                <MarkGlyph key={mark.x} mark={mark} />
              ))}
              {scene.fault && (
                <g>
                  <line x1={scene.fault.from + 6} y1={110} x2={scene.fault.to - 6} y2={110} stroke="#dc2626" strokeWidth={1} />
                  <polygon points={`${scene.fault.to},110 ${scene.fault.to - 6},107 ${scene.fault.to - 6},113`} fill="#dc2626" />
                  <text x={scene.fault.from} y={14} textAnchor="start" fontSize={12} fontWeight={700} fill="#dc2626">이동 시 FaultRecord · {scene.fault.text}</text>
                  <line x1={scene.fault.to} y1={22} x2={scene.fault.to} y2={106} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />
                </g>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
