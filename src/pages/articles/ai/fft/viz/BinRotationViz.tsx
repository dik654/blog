import SceneShell from "./SceneShell";
import { Arrow } from "./VectorPath";

/**
 * 본문 대응: #nyquist-boundary — 표본률 8 Hz, 길이 4에서 bin 간격 2 Hz.
 * 표본 네 개가 원 위에 닿는 자리를 그립니다. 6 Hz로 적은 자리와 −2 Hz는 닿는 자리가 같습니다.
 */
const DIRECTIONS: [number, number][] = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // 오른쪽, 아래, 왼쪽, 위 (화면 좌표)
const SCENES: { label: string; summary: string; note: string; bin: number; stepQuarter: number }[] = [
  { label: "자리 0", summary: "0 Hz · 돌지 않음", bin: 0, stepQuarter: 0, note: "첫 자리는 회전이 없어 네 표본이 모두 오른쪽에 닿습니다. 일정한 기록이 남는 자리입니다." },
  { label: "자리 1", summary: "1×2 Hz = 2 Hz", bin: 1, stepQuarter: 1, note: "표본 사이마다 90도, 곧 3절의 둘째 규칙입니다. 표본률 8 Hz에 길이 4면 인접한 자리의 간격은 8/4=2 Hz이므로 이 자리를 2 Hz로 읽습니다." },
  { label: "자리 2", summary: "−4 Hz와 +4 Hz가 같은 회전", bin: 2, stepQuarter: 2, note: "표본 사이마다 반 바퀴라 어느 쪽으로 돌았는지 표본에서 구별되지 않습니다. 짝수 길이의 가운데 자리는 두 독립 bin이 아니라 하나입니다. 표기는 규약이며 실수 입력의 절반 스펙트럼은 +4 Hz로 적을 수 있습니다." },
  { label: "자리 3", summary: "6 Hz로 적어도 −2 Hz와 같음", bin: 3, stepQuarter: 3, note: "아래로 270도 도는 것과 위로 90도 도는 것은 표본이 닿는 자리가 같습니다. 그래서 흔한 규약은 이 자리를 −2 Hz로 읽고, 6 Hz는 별개로 구별한 성분이 아닙니다." },
];

const CX = 108;
const CY = 98;
const R = 66;
const READS = ["0", "2", "−4", "−2"];

export default function BinRotationViz() {
  return (
    <SceneShell
      eyebrow="bin과 진동수"
      title="자리 번호는 표본 사이의 회전량이고, Hz는 그 회전을 시간으로 읽은 값입니다"
      description="표본률 8 Hz, 길이 4의 가정입니다. 숫자 0~3은 표본 네 개가 원의 어디에 닿는지 보여 줍니다. bin은 출력의 자리 번호입니다."
      ariaLabel="네 bin에서 표본이 원 위에 닿는 자리와 진동수 읽기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const hits = [0, 1, 2, 3].map((n) => (n * scene.stepQuarter) % 4);
        const groups = [0, 1, 2, 3].map((slot) => hits.flatMap((hit, n) => (hit === slot ? [n] : [])));
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#94a3b8" strokeWidth={1} />
            {groups.map((samples, slot) => {
              const [dx, dy] = DIRECTIONS[slot];
              if (samples.length === 0) return null;
              return (
                <g key={slot}>
                  <Arrow x1={CX} y1={CY} x2={CX + dx * R} y2={CY + dy * R} color="#2563eb" />
                  <text x={dx > 0 ? CX + R + 5 : dx < 0 ? CX - R - 5 : CX + 12} y={dy > 0 ? CY + R - 2 : dy < 0 ? CY - R + 10 : CY + 4} textAnchor={dx < 0 ? "end" : "start"} fontSize={11} fontWeight={700} fill="#2563eb">{samples.join("·")}</text>
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r={2.5} fill="#64748b" />
            {READS.map((read, bin) => {
              const on = bin === scene.bin;
              return (
                <g key={bin}>
                  <rect x={232} y={18 + bin * 36} width={116} height={30} rx={8} fill={on ? "#2563eb" : "none"} fillOpacity={on ? 0.12 : 0} stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  <text x={242} y={37 + bin * 36} fontSize={11} fill="#64748b">자리 {bin}</text>
                  <text x={340} y={38 + bin * 36} textAnchor="end" fontSize={13} fontWeight={700} fill={on ? "#2563eb" : "#64748b"}>{read} Hz</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
