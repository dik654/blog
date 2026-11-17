import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ice — Trickle ICE는 candidate를 찾는 즉시 상대에게 추가해 checks를 일찍 시작하게 한다.
 * 바뀌는 것은 candidate 공급 시점이고 pair 검사·nomination 기준은 같다.
 * 칸은 순서만 뜻하며 실제 시간 길이가 아니다. host → srflx → relay 발견 순서는 설명용 가정.
 */
const STEPS = ["host 발견", "srflx 발견", "relay 발견", "그 다음"] as const;

type Cell = { text: string; tone: "idle" | "send" | "check" };

const WAIT: readonly Cell[] = [
  { text: "아직 보내지 않음", tone: "idle" },
  { text: "아직 보내지 않음", tone: "idle" },
  { text: "세 후보를 한꺼번에 보냄", tone: "send" },
  { text: "그제야 첫 check", tone: "check" },
];

const TRICKLE: readonly Cell[] = [
  { text: "host 바로 보냄 · check 시작 가능", tone: "check" },
  { text: "srflx 추가 · check 계속", tone: "check" },
  { text: "relay 추가 · check 계속", tone: "check" },
  { text: "check 계속", tone: "check" },
];

const SCENES = [
  {
    label: "후보는 하나씩 생깁니다",
    summary: "host → srflx → relay (순서 가정)",
    reveal: 0,
    note: "Host candidate는 내 interface에 있고, srflx는 STUN 응답이, relay는 TURN Allocate가 와야 생깁니다. 여기서는 이 순서로 하나씩 생긴다고 둡니다(가정).",
  },
  {
    label: "모두 모은 뒤 보내면",
    summary: "마지막 후보까지 기다림",
    reveal: 1,
    note: "모든 후보를 모은 뒤 signaling으로 보내면 마지막 후보가 생길 때까지 상대에게 아무것도 가지 않고, 첫 connectivity check도 그 뒤로 밀립니다.",
  },
  {
    label: "Trickle은 찾는 즉시 보냅니다",
    summary: "check가 더 이른 칸에서 시작",
    reveal: 2,
    note: "Trickle ICE는 새 candidate를 찾는 즉시 상대에게 추가합니다. 먼저 도착한 후보로 pair를 만들 수 있으니 나머지 후보를 모으는 동안에도 checks를 시작할 수 있습니다.",
  },
  {
    label: "판정 기준은 그대로",
    summary: "STUN check → valid → nominate",
    reveal: 3,
    note: "두 줄 모두 pair를 STUN check로 검사하고, 성공한 valid pair를 controlling agent가 nominate합니다. Trickle이 바꾸는 것은 후보 공급 시점뿐이며 direct path 성공이나 고정된 연결 시간을 보장하지 않습니다.",
  },
] as const;

const TONE: Record<Cell["tone"], string> = {
  idle: "border-dashed border-border text-muted-foreground",
  send: "border-[#2563eb] bg-[#2563eb]/10 font-semibold text-[#1d4ed8] dark:text-[#93c5fd]",
  check: "border-[#16a34a] bg-[#16a34a]/10 font-semibold text-[#15803d] dark:text-[#86efac]",
};

function LaneCell({ cell, show }: { cell: Cell; show: boolean }) {
  return (
    <div
      className={`flex min-h-[2.75rem] min-w-0 items-center rounded-md border px-2 py-1.5 text-xs leading-5 ${show ? TONE[cell.tone] : "border-border/50 text-transparent"}`}
    >
      {cell.text}
    </div>
  );
}

export default function TrickleTimingViz() {
  return (
    <SceneShell
      eyebrow="Trickle ICE"
      title="후보를 보내는 시점만 앞당깁니다"
      description="위에서 아래로 한 칸이 한 사건이며, 칸 높이는 시간 길이가 아니라 순서만 뜻합니다. 파란 칸은 후보를 보내기만 하는 때, 초록 칸은 connectivity check가 돌 수 있는 때입니다. Trickle 쪽 초록 칸은 후보를 보내면서 check도 함께 돕니다."
      ariaLabel="모든 후보를 모은 뒤 보내는 방식과 trickle 방식의 check 시작 시점 비교"
      scenes={SCENES}
      render={(active) => {
        const reveal = SCENES[active].reveal;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[4.75rem_minmax(0,1fr)_minmax(0,1fr)] gap-2">
              <p className="text-xs font-bold text-muted-foreground">사건</p>
              <p className="text-xs font-bold">모두 모은 뒤</p>
              <p className="text-xs font-bold">Trickle</p>
              {STEPS.map((step, index) => (
                <div key={step} className="contents">
                  <div className={`flex items-center text-xs ${index < 3 ? "font-semibold" : "text-muted-foreground"}`}>
                    {index + 1}. {step}
                  </div>
                  <LaneCell cell={WAIT[index]} show={reveal >= 1} />
                  <LaneCell cell={TRICKLE[index]} show={reveal >= 2} />
                </div>
              ))}
            </div>
            <div
              className={`mt-3 rounded-md border px-3 py-2 text-center text-xs leading-5 ${reveal >= 3 ? "border-[#64748b] font-semibold" : "border-border/50 text-transparent"}`}
            >
              두 방식 모두: STUN check 성공 → valid pair → nominate
            </div>
          </div>
        );
      }}
    />
  );
}
