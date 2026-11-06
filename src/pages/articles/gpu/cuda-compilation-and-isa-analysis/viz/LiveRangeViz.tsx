import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ptxas-optimizations — 문서 SASS에서 값을 쓴 명령부터 마지막으로 읽은 명령까지를 막대로 그린다.
 * 가로축은 명령 주소 순서(0010~00f0)이며 시간이 아니다. 막대 경계는 출력 예시의 피연산자에서 센 것이다.
 */
const SEGMENTS = [
  { row: 0, from: 4, to: 7, text: "4", group: 3 },
  { row: 1, from: 5, to: 10, text: "A 주소", group: 0 },
  { row: 1, from: 10, to: 14, text: "값 7", group: 1 },
  { row: 2, from: 5, to: 10, text: "A 주소", group: 0 },
  { row: 3, from: 6, to: 12, text: "B 주소", group: 2 },
  { row: 4, from: 6, to: 12, text: "B 주소", group: 2 },
  { row: 4, from: 12, to: 14, text: "값 5", group: 5 },
  { row: 5, from: 8, to: 15, text: "C 주소", group: 3 },
  { row: 6, from: 1, to: 7, text: "번호 3", group: 4 },
  { row: 6, from: 7, to: 13, text: "위치 3", group: 4 },
  { row: 6, from: 14, to: 15, text: "12", group: 4 },
] as const;
const ROW_NAMES = ["R0", "R2", "R3", "R4", "R5", "R6·R7", "R9"];
const TICKS = [
  { at: 1, text: "0010" },
  { at: 5, text: "0050" },
  { at: 10, text: "00a0" },
  { at: 12, text: "00c0" },
  { at: 15, text: "00f0" },
];
const LEFT = 48;
const STEP = 19;
const ROW_H = 24;
const TOP = 8;
const x = (at: number) => LEFT + (at - 1) * STEP + STEP / 2;

const SCENES = [
  { label: "A 주소가 차지한 자리", summary: "R2·R3 = R2.64", note: "R2.64는 인접한 32비트 자리 두 개로 주소 하나를 나타냅니다. 막대는 값을 쓴 명령부터 마지막으로 읽은 명령까지, 곧 live range입니다.", groups: [0], mark: null },
  { label: "주소가 끝난 자리", summary: "00a0: R2 ← 7", note: "00a0의 LDG.E가 주소를 마지막으로 읽는 바로 그 명령에서 R2가 값 7을 받습니다. 두 막대가 겹치지 않아 한 자리를 나눠 쓸 수 있습니다.", groups: [0, 1], mark: 10 },
  { label: "B 쪽도 같은 방식", summary: "00c0: R5 ← 5", note: "B의 주소 쌍 R4·R5에서는 R5가 값 5를 받습니다. 이번에는 쌍의 위쪽 번호가 목적지로 쓰였습니다. 두 값은 00e0의 FADD가 읽을 때까지 함께 살아 있습니다.", groups: [1, 2, 5], mark: 12 },
  { label: "번호만으로는 셀 수 없음", summary: "R9만으로 10개 확정 불가", note: "R9 한 자리에 번호 3, 위치 3, 합 12가 차례로 놓입니다. R9가 등장한다는 사실만으로 실제 할당량이 10개라고 확정할 수 없고, 장치의 배정 단위와 자원 보고를 함께 봐야 합니다.", groups: [4], mark: null },
] as const;

export default function LiveRangeViz() {
  return (
    <SceneShell
      eyebrow="저장 자리의 재사용"
      title="앞 값의 막대가 끝난 자리에서 다음 값의 막대가 시작합니다"
      description="가로는 문서 SASS의 명령 순서이고 세로는 저장 자리입니다. 가로 길이는 명령 순서만 나타내며 clock이나 시간이 아닙니다. R1·UR 계열은 생략했습니다."
      ariaLabel="SASS 예시에서 R0부터 R9까지 각 저장 자리에 어떤 값이 어느 명령 구간 동안 살아 있는지 그린 막대"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const on = new Set<number>(scene.groups);
        const height = TOP + ROW_NAMES.length * ROW_H + 26;
        return (
          <svg viewBox={`0 0 ${LEFT + 15 * STEP + 4} ${height}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {ROW_NAMES.map((name, row) => (
              <g key={name}>
                <text x={LEFT - 6} y={TOP + row * ROW_H + 15} textAnchor="end" fontSize={11} fontFamily="monospace" fill="#64748b">{name}</text>
                <line x1={LEFT} x2={LEFT + 15 * STEP} y1={TOP + row * ROW_H + 21.5} y2={TOP + row * ROW_H + 21.5} stroke="#94a3b8" strokeWidth={1} opacity={0.3} />
              </g>
            ))}
            {SEGMENTS.map((segment) => {
              const bright = on.has(segment.group);
              const left = x(segment.from);
              const width = x(segment.to) - left;
              const y = TOP + segment.row * ROW_H;
              return (
                <g key={`${segment.row}-${segment.from}`}>
                  <rect x={left + 1} y={y + 1} width={Math.max(width - 2, 14)} height={18} rx={2} fill={segment.group === 1 || segment.group === 5 ? "#d97706" : "#2563eb"} fillOpacity={bright ? 0.9 : 0.14} />
                  <text x={left + Math.max(width, 16) / 2} y={y + 14} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={bright ? "#ffffff" : "#64748b"}>{segment.text}</text>
                </g>
              );
            })}
            {scene.mark !== null && (
              <line x1={x(scene.mark)} x2={x(scene.mark)} y1={TOP} y2={TOP + ROW_NAMES.length * ROW_H} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="3 2" />
            )}
            {TICKS.map((tick) => (
              <text key={tick.at} x={x(tick.at)} y={height - 8} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={scene.mark === tick.at ? "#dc2626" : "#64748b"} fontWeight={scene.mark === tick.at ? 700 : 400}>{tick.text}</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
