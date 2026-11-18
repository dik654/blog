import SceneShell from "./SceneShell";

/**
 * 본문 대응: rectifier-activations #parts — 두 입력이 곱셈 값 w 하나를 공유할 때,
 * 닫힌 길(−2)은 기여 0이어도 열린 길(3)이 w를 1 → −0.2로 옮겨 두 길의 열림이 뒤바뀐다.
 * 뒤 변화율 4, 이동 크기 0.1은 본문의 가정. 숫자: 4×3=12, 1−0.1×12=−0.2, −2×(−0.2)=0.4, 3×(−0.2)=−0.6.
 */
const OPEN = "#16a34a";
const CLOSED = "#94a3b8";
const AXIS = "#64748b";
const MARK = "#2563eb";

interface Lane {
  z: string;
  open: boolean;
  out: string;
  grad: string;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  w: number;
  lanes: readonly [Lane, Lane];
}

const BEFORE: readonly [Lane, Lane] = [
  { z: "1 × (−2) = −2", open: false, out: "0", grad: "—" },
  { z: "1 × 3 = 3", open: true, out: "3", grad: "—" },
];

const WITH_GRAD: readonly [Lane, Lane] = [
  { z: "1 × (−2) = −2", open: false, out: "0", grad: "4 × 0 = 0" },
  { z: "1 × 3 = 3", open: true, out: "3", grad: "4 × 3 = 12" },
];

const SCENES: readonly Scene[] = [
  {
    label: "공유 값 w = 1로 앞 계산",
    summary: "(−2, 3) → 출력 (0, 3)",
    note: "두 입력이 같은 곱셈 값 w 하나를 쓰고, 더하는 값은 0입니다. w=1이라 ReLU 앞의 값은 −2와 3 그대로입니다. −2 쪽 문은 닫혀 0을 내고, 3 쪽 문은 열려 3을 냅니다.",
    w: 1,
    lanes: BEFORE,
  },
  {
    label: "각 길이 w에 보내는 기여",
    summary: "0 + 12 = 12",
    note: "출력 뒤에서 각 칸에 변화율 4가 온다고 정했습니다(가정). 닫힌 길은 문의 기울기 0을 곱해 기여가 0입니다. 열린 길은 4에 입력 3을 곱해 12를 보냅니다. 두 기여를 더하면 12입니다.",
    w: 1,
    lanes: WITH_GRAD,
  },
  {
    label: "w를 한 번 고치기",
    summary: "1 − 0.1 × 12 = −0.2",
    note: "이동 크기를 0.1로 정하면(가정) w는 1에서 −0.2가 됩니다. 닫힌 길은 아무것도 보내지 않았지만 열린 길이 같은 w를 움직였습니다.",
    w: -0.2,
    lanes: WITH_GRAD,
  },
  {
    label: "같은 두 입력을 다시 넣기",
    summary: "(−2, 3) → ReLU 앞 (0.4, −0.6)",
    note: "−2×(−0.2)=0.4라 닫혔던 길이 열리고, 3×(−0.2)=−0.6이라 열렸던 길이 닫힙니다. 이 큰 이동이 좋은 학습이라는 뜻은 아닙니다. 한 입력의 출력 0만 보고 w가 영원히 안 바뀐다고 판단할 수 없다는 계산입니다.",
    w: -0.2,
    lanes: [
      { z: "−0.2 × (−2) = 0.4", open: true, out: "0.4", grad: "—" },
      { z: "−0.2 × 3 = −0.6", open: false, out: "0", grad: "—" },
    ],
  },
];

const INPUTS = ["−2", "3"] as const;
const W_MIN = -0.5;
const W_MAX = 1.25;
const toX = (w: number) => 20 + ((w - W_MIN) / (W_MAX - W_MIN)) * 280;

function Gate({ open }: { open: boolean }) {
  const color = open ? OPEN : CLOSED;
  return (
    <svg width="44" height="20" viewBox="0 0 44 20" aria-hidden="true" className="shrink-0">
      <line x1="2" y1="10" x2="14" y2="10" stroke={color} strokeWidth="1.25" />
      <line x1="30" y1="10" x2="42" y2="10" stroke={color} strokeWidth="1.25" strokeDasharray={open ? undefined : "2 3"} />
      {open ? (
        <line x1="14" y1="10" x2="30" y2="10" stroke={color} strokeWidth="1.25" />
      ) : (
        <line x1="14" y1="10" x2="27" y2="2" stroke={color} strokeWidth="1.25" />
      )}
      <circle cx="14" cy="10" r="2" fill={color} />
    </svg>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 border-t border-border/60 py-1.5 text-xs sm:flex-row sm:items-baseline sm:justify-between sm:gap-2 sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`whitespace-nowrap text-[11px] sm:text-right sm:text-sm font-mono ${strong ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

export default function SharedWeightFlipViz() {
  return (
    <SceneShell
      eyebrow="공유 값의 갱신"
      title="닫힌 길 밖의 열린 길이 같은 값을 움직입니다"
      description="두 칸은 곱셈 값 w 하나를 함께 씁니다. 칸마다 'ReLU 앞 값 → 문 → 출력' 순서이고, 마지막 줄은 그 칸이 w를 고치는 데 보내는 변화율(w를 조금 바꿀 때 결과가 바뀌는 비율)입니다. 뒤 변화율 4와 이동 크기 0.1은 본문의 가정입니다."
      ariaLabel="공유 값 w가 1에서 −0.2로 바뀌며 두 입력의 열림과 닫힘이 뒤바뀌는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const moved = scene.w !== 1;
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {scene.lanes.map((lane, index) => (
                <div key={INPUTS[index]} className="min-w-0 rounded-lg border border-border px-2 py-2 sm:px-3">
                  <p className="text-sm font-bold">
                    입력 <span className="font-mono">{INPUTS[index]}</span>
                  </p>
                  <Row label="ReLU 앞" value={lane.z} />
                  <div className="flex flex-col gap-0.5 border-t border-border/60 py-1.5 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-sm">
                    <span className="text-muted-foreground">문</span>
                    <span className="flex items-center gap-1.5">
                      <Gate open={lane.open} />
                      <span className={lane.open ? "font-semibold text-green-700 dark:text-green-400" : "text-muted-foreground"}>
                        {lane.open ? "열림" : "닫힘"}
                      </span>
                    </span>
                  </div>
                  <Row label="출력" value={lane.out} />
                  <Row label="w로 보낼 기여" value={lane.grad} strong={lane.grad !== "—"} />
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-border px-3 py-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-sm font-bold">공유 값 w</p>
                <p className="font-mono text-sm font-bold text-primary">{moved ? "1 → −0.2" : "1"}</p>
              </div>
              <svg viewBox="0 0 320 44" className="mt-1 w-full max-w-md" role="img" aria-label={`w의 위치 ${moved ? "−0.2" : "1"}`}>
                <line x1="20" y1="20" x2="300" y2="20" stroke={AXIS} strokeWidth="1" />
                {[
                  { v: -0.2, t: "−0.2" },
                  { v: 0, t: "0" },
                  { v: 1, t: "1" },
                ].map((tick) => (
                  <g key={tick.t}>
                    <line x1={toX(tick.v)} y1="16" x2={toX(tick.v)} y2="24" stroke={AXIS} strokeWidth="1" />
                    <text x={toX(tick.v)} y="38" textAnchor="middle" fontSize="11" fill={AXIS}>
                      {tick.t}
                    </text>
                  </g>
                ))}
                {moved ? (
                  <>
                    <circle cx={toX(1)} cy="20" r="5" fill="none" stroke={MARK} strokeWidth="1" strokeDasharray="2 2" />
                    <line x1={toX(1) - 8} y1="8" x2={toX(-0.2) + 8} y2="8" stroke={MARK} strokeWidth="1" />
                    <path d={`M ${toX(-0.2) + 8} 8 l 6 -3 v 6 z`} fill={MARK} />
                  </>
                ) : null}
                <circle cx={toX(scene.w)} cy="20" r="5" fill={MARK} />
              </svg>
            </div>
          </div>
        );
      }}
    />
  );
}
