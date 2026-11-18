import SceneShell from "./SceneShell";

/**
 * 본문 대응: #selector — 상태는 "선택한 블록의 실행이 끝난 뒤"를 뜻한다.
 * 블록 1,000을 다시 실행하려면 999 실행 뒤 상태를 고른다. 번호를 그대로 쓰면 한 블록 어긋난다.
 * 동그라미 = 상태(어느 블록 실행 뒤), 네모 = 블록(상태를 다음 상태로 바꾸는 실행).
 */
const SCENES = [
  {
    label: "블록 1,000을 지정한 조회",
    summary: "→ 1,000 실행 뒤 상태",
    note: "StateProvider가 블록 1,000을 가리키면 그 상태는 블록 1,000의 실행이 끝난 뒤입니다. 계정 A의 잔액이나 slot K를 이 시점의 값으로 읽습니다.",
  },
  {
    label: "블록 1,000을 다시 실행",
    summary: "입력 = 999 실행 뒤 상태",
    note: "블록 1,000을 다시 실행하려면 실행의 입력이 될 부모 상태, 즉 999 실행 뒤 상태를 선택합니다. 그 위에서 블록 1,000을 실행하면 1,000 실행 뒤 상태가 나옵니다.",
  },
  {
    label: "번호를 그대로 고르면",
    summary: "한 블록 어긋남",
    note: "‘블록 1,000을 실행하니 1,000을 고르자’고 하면 블록 1,000의 결과가 이미 들어 있는 상태가 입력이 됩니다. 부모 상태보다 한 블록 뒤에서 출발하는 셈입니다.",
  },
] as const;

const BLUE = "#2563eb";
const RED = "#dc2626";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

const STATES = [
  { x: 40, label: "998 실행 뒤" },
  { x: 180, label: "999 실행 뒤" },
  { x: 320, label: "1,000 실행 뒤" },
] as const;
const BLOCKS = [
  { x: 110, label: "블록 999" },
  { x: 250, label: "블록 1,000" },
] as const;
const Y = 70;

export default function ParentStateViz() {
  return (
    <SceneShell
      eyebrow="상태와 블록 번호"
      title="상태는 블록과 블록 사이에 놓입니다"
      description="동그라미는 ‘어느 블록 실행 뒤’의 상태, 네모는 그 상태를 다음 상태로 바꾸는 블록 실행입니다. 블록 번호는 본문 예시를 그대로 씁니다."
      ariaLabel="블록 1,000 조회는 1,000 실행 뒤 상태, 블록 1,000 재실행은 999 실행 뒤 상태를 입력으로 쓰는 관계"
      scenes={SCENES}
      render={(active) => {
        const target = active === 0 ? 2 : active === 1 ? 1 : 2;
        const wrong = active === 2;
        const showRun = active >= 1;
        const runFrom = STATES[target].x;
        return (
          <svg viewBox="0 0 360 146" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={40} x2={320} y1={Y} y2={Y} stroke={MUTED} strokeWidth={1} />
            {BLOCKS.map((block, index) => {
              const hot = showRun && index === 1;
              return (
                <g key={block.label}>
                  <rect x={block.x - 33} y={Y - 14} width={66} height={28} rx={4} fill="#ffffff" stroke={hot ? (wrong ? RED : BLUE) : MUTED} strokeWidth={hot ? 1.25 : 1} />
                  <text x={block.x} y={Y + 4.5} textAnchor="middle" fontSize={12} fontWeight={hot ? 700 : 400} fill={hot ? (wrong ? RED : BLUE) : TEXT}>{block.label}</text>
                </g>
              );
            })}
            {STATES.map((state, index) => {
              const hot = index === target;
              const color = hot ? (wrong ? RED : BLUE) : MUTED;
              return (
                <g key={state.label}>
                  <circle cx={state.x} cy={Y} r={9} fill={hot ? color : "#ffffff"} stroke={color} strokeWidth={hot ? 1.25 : 1} />
                  <text x={state.x} y={Y + 28} textAnchor="middle" fontSize={12} fontWeight={hot ? 700 : 400} fill={hot ? color : TEXT}>{state.label}</text>
                </g>
              );
            })}
            {active === 0 && (
              <g>
                <text x={320} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>조회가 읽는 곳</text>
                <line x1={320} x2={320} y1={36} y2={Y - 12} stroke={BLUE} strokeWidth={1} />
              </g>
            )}
            {showRun && (
              <g>
                <text x={wrong ? 300 : runFrom} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={wrong ? RED : BLUE}>{wrong ? "잘못 고른 입력" : "실행 입력"}</text>
                <path d={`M ${runFrom} ${Y - 12} Q ${(runFrom + 250) / 2} 22 250 ${Y - 16}`} fill="none" stroke={wrong ? RED : BLUE} strokeWidth={1} strokeDasharray={wrong ? "3 3" : undefined} />
              </g>
            )}
            {active === 1 && (
              <text x={180} y={130} textAnchor="middle" fontSize={12} fill={BLUE}>999 실행 뒤 + 블록 1,000 = 1,000 실행 뒤</text>
            )}
            {wrong && (
              <text x={180} y={130} textAnchor="middle" fontSize={12} fill={RED}>입력에 블록 1,000의 결과가 이미 들어 있음</text>
            )}
          </svg>
        );
      }}
    />
  );
}
