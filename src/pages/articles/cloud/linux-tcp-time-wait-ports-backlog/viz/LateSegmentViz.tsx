import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why-time-wait — 같은 4-tuple의 옛 연결에서 늦게 온 segment가 새 연결에 섞일 수 있는 경우와
 * TIME_WAIT가 재사용을 늦추는 경우. 앞의 세 장면의 시각은 그림용이며, 마지막 장면만 2×2분=4분과 60초의 실제 비율이다.
 */
const W = 360;
const H = 170;
const LEFT = 14;
const OLD_Y = 34;
const NET_Y = 80;
const NEW_Y = 126;
const BAR_H = 20;
const OLD_END = 110;
const ARRIVE = 200;

function Bar({ x, y, w, color, label, dashed = false }: { x: number; y: number; w: number; color: string; label: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={BAR_H} rx={3} fill={dashed ? "none" : color} fillOpacity={dashed ? undefined : 0.85} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "3 3" : undefined} />
      <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={dashed ? "currentColor" : "#ffffff"}>{label}</text>
    </g>
  );
}

const SCENES = [
  { label: "옛 연결이 끝날 때", summary: "segment 하나가 아직 네트워크에", note: "연결은 닫혔는데 그 연결의 segment 하나가 네트워크 어딘가에 남아 늦게 도착할 수 있습니다." },
  { label: "바로 같은 4-tuple로 다시 열면", summary: "새 연결 데이터로 잘못 받을 수 있음", note: "주소 네 값이 같으니 늦게 온 segment는 새 연결의 것과 구별되지 않을 수 있습니다. 그러면 옛 데이터가 새 연결의 데이터로 잘못 받아들여질 수 있습니다." },
  { label: "TIME_WAIT로 재사용을 늦추면", summary: "늦은 segment가 올 때 새 연결 없음", note: "RFC 9293의 표현대로 TIME_WAIT는 같은 연결의 재사용 속도를 제한합니다. 이 그림처럼 늦은 segment가 대기 중에 오면 새 연결의 데이터로 섞일 일이 없습니다." },
  { label: "기다리는 길이", summary: "RFC 4분 · Linux 60초", note: "MSL은 segment가 네트워크에 살아 있을 수 있다고 보는 최대 시간이고 RFC는 이를 2분으로 둡니다. Linux는 4분 대신 60초 상수를 씁니다." },
] as const;

export default function LateSegmentViz() {
  return (
    <SceneShell
      eyebrow="옛 연결과 새 연결"
      title="주소 네 값이 같으면 옛 연결의 늦은 segment가 새 연결에 섞일 수 있습니다"
      description="가로로 시간이 흐릅니다. 위 줄이 옛 연결, 가운데 줄이 네트워크, 아래 줄이 같은 4-tuple(출발·목적 주소 네 값)로 새로 여는 연결입니다."
      note="앞의 세 장면에서 막대 길이와 도착 시각은 그림용입니다(가정). 마지막 장면만 4분과 60초의 길이 비율을 맞췄습니다."
      ariaLabel="늦게 도착한 옛 segment가 새 연결에 섞이는 경우와 TIME_WAIT가 재사용을 늦추는 경우"
      scenes={SCENES}
      render={(active) => {
        if (active === 3) {
          const unit = (W - 2 * LEFT) / 240;
          return (
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={LEFT} y={OLD_Y - 8} fontSize={11} fontWeight={700} fill="currentColor">RFC 9293: 2 × MSL = 2 × 2분</text>
              <Bar x={LEFT} y={OLD_Y} w={240 * unit} color="#64748b" label="4분" />
              <text x={LEFT} y={NET_Y + 8} fontSize={11} fontWeight={700} fill="currentColor">Linux: TCP_TIMEWAIT_LEN 상수</text>
              <Bar x={LEFT} y={NET_Y + 16} w={60 * unit} color="#2563eb" label="60초" />
            </svg>
          );
        }
        const reuseNow = active === 1;
        const withWait = active === 2;
        const showArrive = reuseNow || withWait;
        const newStart = withWait ? 262 : OLD_END + 8;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={OLD_Y - 8} fontSize={11} fontWeight={700} fill="currentColor">옛 연결</text>
            <Bar x={LEFT} y={OLD_Y} w={OLD_END - LEFT} color="#64748b" label="연결 중" />
            {withWait && <Bar x={OLD_END} y={OLD_Y} w={newStart - OLD_END} color="#2563eb" label="TIME_WAIT" />}

            <text x={LEFT} y={NET_Y - 8} fontSize={11} fontWeight={700} fill="currentColor">네트워크</text>
            <line x1={LEFT} x2={W - LEFT} y1={NET_Y + 8} y2={NET_Y + 8} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 4" />
            <line x1={70} x2={showArrive ? ARRIVE : OLD_END + 26} y1={NET_Y + 8} y2={NET_Y + 8} stroke="#d97706" strokeWidth={1.25} />
            <rect x={(showArrive ? ARRIVE : OLD_END + 26) - 5} y={NET_Y + 3} width={10} height={10} fill="#d97706" />
            {!showArrive && <text x={OLD_END + 40} y={NET_Y + 3} fontSize={11} fill="currentColor">늦게 도는 옛 segment</text>}

            <text x={LEFT} y={NEW_Y - 8} fontSize={11} fontWeight={700} fill="currentColor">같은 4-tuple의 새 연결</text>
            {showArrive && <Bar x={newStart} y={NEW_Y} w={W - LEFT - newStart} color="#64748b" label={withWait ? "새 연결" : "새 연결 중"} />}

            {showArrive && (
              <g>
                <line x1={ARRIVE} x2={ARRIVE} y1={NET_Y + 14} y2={withWait ? OLD_Y + BAR_H + 2 : NEW_Y - 2} stroke={reuseNow ? "#dc2626" : "#d97706"} strokeWidth={1.25} />
                {reuseNow && <text x={ARRIVE + 6} y={NEW_Y + BAR_H + 16} fontSize={11} fontWeight={700} fill="#dc2626">↑ 섞일 수 있음</text>}
                {withWait && <text x={ARRIVE + 6} y={NET_Y + 3} fontSize={11} fontWeight={700} fill="currentColor">대기 중에 도착</text>}
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
