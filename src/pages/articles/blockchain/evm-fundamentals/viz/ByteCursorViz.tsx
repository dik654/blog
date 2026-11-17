import SceneShell from "./EvmSceneShell";

/**
 * 본문 대응: #why-parts — '한 바이트 숫자를 올려라' 뒤에는 숫자 한 바이트가 붙으므로 두 칸을 건너뛴다.
 * 코드 60 02 60 03 01 00(7절)을 위치 0~5에 놓고, 읽는 위치가 0 → 2 → 4 → 5로 가는 길과
 * 한 칸만 옮겨 숫자 02를 명령으로 읽는 잘못된 길을 비교한다.
 */
const BYTES = ["60", "02", "60", "03", "01", "00"] as const;
const ROLES = ["명령", "숫자", "명령", "숫자", "명령", "명령"] as const;

const W = 360;
const H = 156;
const CELL_W = 48;
const GAP = 6;
const LEFT = (W - (BYTES.length * CELL_W + (BYTES.length - 1) * GAP)) / 2;
const TOP = 56;
const CELL_H = 40;
const cx = (index: number) => LEFT + index * (CELL_W + GAP) + CELL_W / 2;

const CMD = "#1d4ed8";
const NUM = "#64748b";
const BAD = "#dc2626";

interface Step {
  pc: number;
  read: readonly number[];
  next: number | null;
  wrong: boolean;
}

const STEPS: readonly Step[] = [
  { pc: 0, read: [0, 1], next: 2, wrong: false },
  { pc: 0, read: [0], next: 1, wrong: true },
  { pc: 2, read: [2, 3], next: 4, wrong: false },
  { pc: 4, read: [4], next: 5, wrong: false },
  { pc: 5, read: [5], next: null, wrong: false },
];

const SCENES = [
  {
    label: "위치 0에서 읽기",
    summary: "60 + 02 → 두 칸 이동",
    note: "60은 '한 바이트 숫자를 올려라'입니다. 바로 뒤의 02가 올릴 숫자라서 이 명령은 두 바이트를 차지하고, 다음에 읽을 위치는 2입니다.",
  },
  {
    label: "한 칸만 옮기면",
    summary: "위치 1 → 숫자 02를 명령으로 읽음",
    note: "명령 바이트만 보고 한 칸만 옮기면 다음 위치가 1이 되어, 올릴 숫자였던 02를 다음 명령으로 잘못 읽습니다.",
  },
  {
    label: "위치 2에서 읽기",
    summary: "60 + 03 → 두 칸 이동",
    note: "다시 '한 바이트 숫자를 올려라'입니다. 뒤의 03까지 함께 읽고 위치 4로 건너뜁니다.",
  },
  {
    label: "위치 4: 더하기",
    summary: "01 → 한 칸 이동",
    note: "01은 덧셈입니다. 뒤따르는 숫자가 없으므로 한 칸만 옮겨 위치 5로 갑니다.",
  },
  {
    label: "위치 5: 멈추기",
    summary: "00 → 실행 끝",
    note: "00은 '멈춰라'입니다. 읽는 위치는 0 → 2 → 4 → 5로 움직였고, 숫자 바이트 02와 03은 명령으로 읽힌 적이 없습니다.",
  },
] as const;

export default function ByteCursorViz() {
  return (
    <SceneShell
      eyebrow="명령 바이트와 숫자 바이트"
      title="숫자가 붙은 명령 뒤에서는 두 칸을 건너뜁니다"
      description="칸 하나가 코드 1바이트(16진수)이고 칸 위 숫자가 위치입니다. 60은 '한 바이트 숫자를 올려라', 01은 '더하라', 00은 '멈춰라'입니다. 6절에서 이 위치를 pc, 명령을 PUSH1·ADD·STOP이라고 부릅니다."
      ariaLabel="코드 바이트 60 02 60 03 01 00에서 읽는 위치가 움직이는 순서"
      scenes={SCENES}
      render={(active) => {
        const step = STEPS[active];
        const arcFrom = step.pc;
        const arcTo = step.next;
        const arcColor = step.wrong ? BAD : CMD;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {arcTo !== null && (
              <g>
                <path
                  d={`M ${cx(arcFrom)} ${TOP - 4} Q ${(cx(arcFrom) + cx(arcTo)) / 2} ${TOP - 40} ${cx(arcTo)} ${TOP - 4}`}
                  fill="none"
                  stroke={arcColor}
                  strokeWidth={1.25}
                  strokeDasharray={step.wrong ? "4 3" : undefined}
                />
                <path d={`M ${cx(arcTo) - 4} ${TOP - 11} L ${cx(arcTo)} ${TOP - 4} L ${cx(arcTo) + 4} ${TOP - 11}`} fill="none" stroke={arcColor} strokeWidth={1.25} />
                <text x={(cx(arcFrom) + cx(arcTo)) / 2} y={TOP - 26} textAnchor="middle" fontSize={12} fontWeight={700} fill={arcColor}>
                  {`+${arcTo - arcFrom}${step.wrong ? " (잘못)" : ""}`}
                </text>
              </g>
            )}
            {BYTES.map((byte, index) => {
              const x = LEFT + index * (CELL_W + GAP);
              const isRead = step.read.includes(index);
              const misread = step.wrong && index === 1;
              const role = misread ? "명령?" : ROLES[index];
              const roleColor = misread ? BAD : ROLES[index] === "명령" ? CMD : NUM;
              const stroke = misread ? BAD : isRead ? (ROLES[index] === "명령" ? CMD : NUM) : "#cbd5e1";
              return (
                <g key={index}>
                  <text x={x + CELL_W / 2} y={TOP - 44} textAnchor="middle" fontSize={11} fill="#64748b">
                    {index}
                  </text>
                  <rect
                    x={x}
                    y={TOP}
                    width={CELL_W}
                    height={CELL_H}
                    rx={6}
                    fill={isRead || misread ? "#ffffff" : "#f1f5f9"}
                    stroke={stroke}
                    strokeWidth={isRead || misread ? 1.25 : 1}
                    strokeDasharray={misread ? "4 3" : undefined}
                  />
                  <text x={x + CELL_W / 2} y={TOP + 25} textAnchor="middle" fontSize={15} fontWeight={700} fontFamily="ui-monospace, monospace" fill={isRead || misread ? "#0f172a" : "#94a3b8"}>
                    {byte}
                  </text>
                  <text x={x + CELL_W / 2} y={TOP + CELL_H + 15} textAnchor="middle" fontSize={11} fontWeight={misread ? 700 : 400} fill={roleColor}>
                    {role}
                  </text>
                </g>
              );
            })}
            <g>
              <path
                d={`M ${cx(step.wrong ? 1 : step.pc)} ${TOP + CELL_H + 22} l -6 10 h 12 z`}
                fill={step.wrong ? BAD : CMD}
              />
              <text x={cx(step.wrong ? 1 : step.pc)} y={TOP + CELL_H + 48} textAnchor="middle" fontSize={12} fontWeight={700} fill={step.wrong ? BAD : CMD}>
                {`지금 위치 ${step.wrong ? 1 : step.pc}`}
              </text>
            </g>
          </svg>
        );
      }}
    />
  );
}
