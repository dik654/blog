import SceneShell from "./SceneShell";

/**
 * 본문 대응: #manager-delivery, #backpressure — 공용 manager buffer(기본 최대 1,024개)는 모든 ExEx가 받을 때까지
 * notification을 보존하고, ExEx마다 capacity-1 channel이 앞에 있다. B가 멈추면 B channel → buffer → upstream 순서로 막힌다.
 * buffer의 8칸은 1,024칸을 줄여 그린 설명용 표시다.
 */
const SCENES = [
  {
    label: "정상 흐름",
    summary: "두 ExEx가 받으면 buffer에서 제거",
    note: "Manager는 notification을 공용 buffer에 두고 A와 B의 channel에 차례로 넣습니다. 두 extension이 모두 받아 가야 그 notification을 buffer에서 지울 수 있습니다.",
  },
  {
    label: "B 멈춤",
    summary: "B channel 1칸이 참",
    note: "B가 읽지 않으면 한 개만 담는 B channel이 먼저 찹니다. A는 계속 받아 가지만, B에 보내지 못한 notification은 buffer에서 지울 수 없어 쌓이기 시작합니다.",
  },
  {
    label: "buffer 가득",
    summary: "최대 크기 도달 → capacity 0",
    note: "B에 보내지 못한 notification이 최대 크기까지 쌓이면 manager의 current capacity가 0이 됩니다. A가 이미 받은 항목도 B가 받기 전까지는 자리를 비우지 않습니다.",
  },
  {
    label: "upstream 대기",
    summary: "send_async가 ready까지 대기",
    note: "Capacity가 0이면 node 쪽의 send_async는 manager가 다시 ready가 될 때까지 기다립니다. 메모리를 무한히 늘리는 대신 느린 consumer의 속도가 생산자까지 전달되는 것이 backpressure입니다.",
  },
  {
    label: "channel 닫힘",
    summary: "skip이 아니라 manager 오류",
    note: "Backpressure는 느린 처리 자체를 고치지 않습니다. B의 channel이 닫히면 manager는 이를 건너뛰어도 되는 경우로 보지 않고 오류를 반환합니다.",
  },
] as const;

const SLOT_X = [30, 66, 102, 138, 174, 210, 246, 282] as const;
const FILLED = [1, 4, 8, 8, 0] as const;
const OK = "#16a34a";
const STUCK = "#d97706";
const BAD = "#dc2626";
const LINE = "#64748b";
const INK = "currentColor";

export default function ExExBackpressureViz() {
  return (
    <SceneShell
      eyebrow="Backpressure"
      title="B 하나가 멈추면 막힘이 channel에서 upstream으로 거슬러 갑니다"
      description="가운데가 모든 ExEx가 함께 쓰는 manager buffer, 오른쪽이 ExEx마다 한 개만 담는 channel입니다. buffer의 8칸은 기본 최대 1,024개를 설명용으로 줄여 그린 것이고, 칸 수는 실제 점유량이 아닙니다."
      ariaLabel="느린 Extension B 때문에 channel, manager buffer, upstream이 차례로 막히는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const filled = FILLED[active];
        const bStuck = active >= 1 && active <= 3;
        const bClosed = active === 4;
        const upstreamWait = active === 3;
        const full = active === 2 || active === 3;
        return (
          <svg viewBox="0 0 340 318" className="mx-auto block h-auto w-full max-w-[20rem] text-foreground" role="img" aria-label={SCENES[active].summary}>
            <defs>
              <marker id="exex-bp-ok" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={6} markerHeight={6} orient="auto"><path d="M0 0 L8 4 L0 8 z" fill={OK} /></marker>
              <marker id="exex-bp-line" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={6} markerHeight={6} orient="auto"><path d="M0 0 L8 4 L0 8 z" fill={LINE} /></marker>
              <pattern id="exex-bp-hatch" width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1={0} y1={0} x2={0} y2={6} stroke="#94a3b8" strokeWidth={1.5} /></pattern>
              <marker id="exex-bp-bad" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={6} markerHeight={6} orient="auto"><path d="M0 0 L8 4 L0 8 z" fill={BAD} /></marker>
            </defs>

            {/* upstream */}
            <rect x={50} y={8} width={140} height={40} rx={6} fill="none" stroke={upstreamWait ? BAD : LINE} strokeWidth={upstreamWait ? 1.25 : 1} />
            <text x={120} y={33} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>node · upstream</text>
            <line x1={120} y1={48} x2={120} y2={72} stroke={upstreamWait ? BAD : LINE} strokeWidth={1} strokeDasharray={upstreamWait ? "3 3" : undefined} markerEnd={upstreamWait ? "url(#exex-bp-bad)" : "url(#exex-bp-line)"} />
            {upstreamWait ? (
              <text x={200} y={33} fontSize={12} fontWeight={700} fill={BAD}>send_async 대기</text>
            ) : null}

            {/* manager buffer */}
            <rect x={20} y={74} width={300} height={62} rx={6} fill="none" stroke={full ? BAD : LINE} strokeWidth={full ? 1.25 : 1} opacity={bClosed ? 0.4 : 1} />
            <text x={30} y={92} fontSize={13} fontWeight={700} fill={INK} opacity={bClosed ? 0.4 : 1}>manager buffer</text>
            <text x={310} y={92} textAnchor="end" fontSize={12} fill={full ? BAD : LINE}>
              {active === 0 ? "모두 받으면 제거" : active === 1 ? "B 미전달분 보존" : full ? "가득 참 · capacity 0" : "manager 오류"}
            </text>
            {SLOT_X.map((x, index) => {
              const on = index < filled;
              const color = active === 0 ? OK : STUCK;
              return <rect key={x} x={x} y={100} width={30} height={28} rx={3} fill={bClosed ? "url(#exex-bp-hatch)" : on ? color : "none"} fillOpacity={bClosed ? 1 : on ? 0.8 : 0} stroke={on ? color : "#cbd5e1"} strokeWidth={1} opacity={bClosed ? 0.4 : 1} />;
            })}

            {/* fan-out */}
            <line x1={120} y1={136} x2={88} y2={184} stroke={OK} strokeWidth={1} markerEnd="url(#exex-bp-ok)" />
            <line x1={220} y1={136} x2={252} y2={184} stroke={bStuck || bClosed ? BAD : OK} strokeWidth={1} strokeDasharray={bStuck || bClosed ? "3 3" : undefined} markerEnd={bStuck || bClosed ? "url(#exex-bp-bad)" : "url(#exex-bp-ok)"} />
            <text x={170} y={168} textAnchor="middle" fontSize={11} fill={LINE}>fan-out</text>

            {/* A channel + extension */}
            <text x={62} y={206} textAnchor="end" fontSize={11} fill={LINE}>channel</text>
            <text x={62} y={220} textAnchor="end" fontSize={11} fill={LINE}>1칸</text>
            <rect x={68} y={188} width={34} height={30} rx={4} fill="none" stroke={LINE} strokeWidth={1} />
            <line x1={85} y1={218} x2={85} y2={240} stroke={OK} strokeWidth={1} markerEnd="url(#exex-bp-ok)" />
            <rect x={25} y={242} width={120} height={46} rx={6} fill="none" stroke={OK} strokeWidth={1} />
            <text x={85} y={262} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>Extension A</text>
            <text x={85} y={279} textAnchor="middle" fontSize={12} fill={OK}>계속 읽음</text>

            {/* B channel + extension */}
            <text x={278} y={206} fontSize={11} fill={LINE}>channel</text>
            <text x={278} y={220} fontSize={11} fill={LINE}>1칸</text>
            <rect x={238} y={188} width={34} height={30} rx={4} fill={bStuck ? STUCK : "none"} fillOpacity={bStuck ? 0.8 : 0} stroke={bStuck || bClosed ? BAD : LINE} strokeWidth={bStuck || bClosed ? 1.25 : 1} />
            {bClosed ? <path d="M244 194 L266 212 M266 194 L244 212" stroke={BAD} strokeWidth={1.25} /> : null}
            <line x1={255} y1={218} x2={255} y2={240} stroke={bStuck || bClosed ? BAD : OK} strokeWidth={1} strokeDasharray={bStuck || bClosed ? "3 3" : undefined} />
            <rect x={195} y={242} width={120} height={46} rx={6} fill="none" stroke={bStuck || bClosed ? BAD : OK} strokeWidth={1} />
            <text x={255} y={262} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>Extension B</text>
            <text x={255} y={279} textAnchor="middle" fontSize={12} fill={bStuck || bClosed ? BAD : OK}>
              {bClosed ? "channel 닫힘" : bStuck ? "처리 중단" : "계속 읽음"}
            </text>
            {bClosed ? (
              <text x={170} y={310} textAnchor="middle" fontSize={13} fontWeight={700} fill={BAD}>manager: 오류 반환 (skip 아님)</text>
            ) : null}
          </svg>
        );
      }}
    />
  );
}
