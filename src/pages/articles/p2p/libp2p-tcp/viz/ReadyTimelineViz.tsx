import TcpSceneShell from "./TcpSceneShell";

/**
 * 본문 대응: #upgrade-chain — 설명용 고정 trace(실제 benchmark 아님).
 * socket 준비 0.4ms → TCP connect 28ms(누적 28.4) → Noise 17ms(45.4) → Yamux 4ms(49.4).
 */
const SEGMENTS = [
  { name: "socket 준비", ms: 0.4, color: "#94a3b8" },
  { name: "TCP connect", ms: 28, color: "#64748b" },
  { name: "Noise", ms: 17, color: "#2563eb" },
  { name: "Yamux", ms: 4, color: "#16a34a" },
] as const;

const ENDS = SEGMENTS.map((_, index) => SEGMENTS.slice(0, index + 1).reduce<number>((sum, item) => sum + item.ms, 0));
const STARTS = ENDS.map((end, index) => end - SEGMENTS[index].ms);
const TOTAL = ENDS[ENDS.length - 1];

const W = 320;
const H = 150;
const LEFT = 16;
const RIGHT = 16;
const BAR_Y = 44;
const BAR_H = 26;
const x = (ms: number) => LEFT + (ms / TOTAL) * (W - LEFT - RIGHT);

const SCENES = [
  { label: "Socket 준비", summary: "0.4ms", note: "주소 parse와 option 적용입니다. 아직 SYN을 보내 연결을 확정하지 않았습니다.", upto: 0 },
  { label: "Raw TCP", summary: "0.4 + 28 = 28.4ms", note: "Ordered byte stream이 생겼고 TCP 지표는 여기서 끝납니다. 하지만 Bob의 PeerId는 아직 인증되지 않았습니다.", upto: 1 },
  { label: "Noise 인증", summary: "28.4 + 17 = 45.4ms", note: "Noise가 expected Bob PeerId와 identity binding을 검증한 시점입니다. 아직 substream을 열 multiplexer는 없습니다.", upto: 2 },
  { label: "Swarm-ready", summary: "45.4 + 4 = 49.4ms", note: "Yamux까지 끝나야 PeerId와 StreamMuxer를 connection pool로 넘길 수 있습니다. 28.4ms와 49.4ms를 같은 'connect latency'로 부르면 병목이 어느 단계인지 찾을 수 없습니다.", upto: 3 },
] as const;

export default function ReadyTimelineViz() {
  return (
    <TcpSceneShell
      eyebrow="두 개의 완료 시점"
      title="TCP가 끝난 시각과 connection을 쓸 수 있는 시각은 다릅니다"
      description="가로축은 dial 시작부터의 시간입니다. 0.4·28·17·4ms는 순차 실행을 가정한 설명용 숫자이며 실제 benchmark가 아닙니다(가정). 점선 칸은 아직 지나지 않은 단계입니다."
      ariaLabel="socket 준비, TCP connect, Noise, Yamux가 이어져 28.4ms와 49.4ms에 각각 완료되는 시간 막대"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {SEGMENTS.map((segment, index) => {
              const done = index <= scene.upto;
              const x0 = x(STARTS[index]);
              const width = Math.max(x(ENDS[index]) - x0, 2);
              return (
                <g key={segment.name}>
                  <rect
                    x={x0}
                    y={BAR_Y}
                    width={width}
                    height={BAR_H}
                    fill={done ? segment.color : "#ffffff"}
                    fillOpacity={done ? 0.9 : 0}
                    stroke={done ? segment.color : "#94a3b8"}
                    strokeWidth={1}
                    strokeDasharray={done ? undefined : "3 3"}
                  />
                </g>
              );
            })}
            <text x={(x(STARTS[1]) + x(ENDS[1])) / 2} y={BAR_Y + 18} textAnchor="middle" fontSize={13} fontWeight={600} fill={scene.upto >= 1 ? "#ffffff" : "#64748b"}>TCP connect 28</text>
            <text x={(x(STARTS[2]) + x(ENDS[2])) / 2} y={BAR_Y + 18} textAnchor="middle" fontSize={13} fontWeight={600} fill={scene.upto >= 2 ? "#ffffff" : "#64748b"}>Noise 17</text>
            <text x={x(TOTAL)} y={BAR_Y - 8} textAnchor="end" fontSize={12} fill="#64748b">Yamux 4</text>
            <text x={x(0)} y={BAR_Y - 8} textAnchor="start" fontSize={12} fill="#64748b">socket 준비 0.4</text>

            <line x1={x(ENDS[1])} x2={x(ENDS[1])} y1={BAR_Y - 2} y2={BAR_Y + BAR_H + 30} stroke="#64748b" strokeWidth={1} strokeDasharray={scene.upto >= 1 ? undefined : "2 3"} />
            <text x={x(ENDS[1])} y={BAR_Y + BAR_H + 44} textAnchor="middle" fontSize={13} fontWeight={scene.upto >= 1 ? 700 : 400} fill={scene.upto >= 1 ? "#475569" : "#94a3b8"}>TCP 지표 끝 28.4ms</text>

            <line x1={x(TOTAL)} x2={x(TOTAL)} y1={BAR_Y - 2} y2={BAR_Y + BAR_H + 56} stroke="#16a34a" strokeWidth={1} strokeDasharray={scene.upto >= 3 ? undefined : "2 3"} />
            <text x={x(TOTAL)} y={BAR_Y + BAR_H + 68} textAnchor="end" fontSize={13} fontWeight={scene.upto >= 3 ? 700 : 400} fill={scene.upto >= 3 ? "#15803d" : "#94a3b8"}>Swarm-ready 49.4ms</text>
          </svg>
        );
      }}
    />
  );
}
