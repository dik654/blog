import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case(3절)와 #overview(1절).
 * 하루 86,400건 × 0.2초 = 17,280초 = 4.8시간(24시간의 20%).
 * 동시 실행 수 = 초당 요청 × 평균 처리 시간(8절 근거 자료의 Lambda 정의): 평균 1 × 0.2 = 0.2, 피크 100 × 0.2 = 20.
 * 피크 1분 = 100 × 60 = 6,000건. 첫 응답은 0.1초 안에 시작해야 함(가정, 본문).
 * 그림의 피크는 100건이 1초 안에 0.01초 간격으로 고르게 도착한다고 가정합니다.
 */
const PER_DAY = 86400;
const SERVICE = 0.2;
const TOTAL_SEC = PER_DAY * SERVICE;
const TOTAL_HOURS = TOTAL_SEC / 3600;
const PEAK_RATE = 100;
const PEAK_CONC = Math.round(PEAK_RATE * SERVICE);
const AVG_CONC = 1 * SERVICE;
const PEAK_MINUTE = PEAK_RATE * 60;

const W = 360;
const H = 216;
const LEFT = 30;
const RIGHT = 12;
const TOP = 22;
const LANE_H = 6;
const LANE_GAP = 1.4;
const AXIS_Y = TOP + PEAK_CONC * (LANE_H + LANE_GAP) + 6;
const T_MAX = 1.2;
const tx = (t: number) => LEFT + (t / T_MAX) * (W - LEFT - RIGHT);
const laneY = (lane: number) => TOP + lane * (LANE_H + LANE_GAP);

/** 피크 1초 동안 0.01초마다 한 건: k번째 요청은 k % 20번 단위가 맡습니다. */
const PEAK_REQUESTS = Array.from({ length: PEAK_RATE }, (_, k) => ({ start: k / PEAK_RATE, lane: k % PEAK_CONC }));

const SCENES = [
  {
    label: "하루 중 실제로 실행하는 시간",
    summary: `86,400 × 0.2초 = ${TOTAL_HOURS}시간`,
    note: "실행 시간을 한쪽으로 모으면 하루 24시간 중 4.8시간, 20%입니다. 요청은 하루 내내 초당 한 건꼴로 오지만, 서버 한 대를 하루 종일 켜 두면 건과 건 사이에 쉬는 시간을 모두 더해 19.2시간이 됩니다. 그래서 사용량 기반 실행이 싸 보입니다.",
  },
  {
    label: "평균의 1초: 한 건이 0.2초 실행",
    summary: `동시 실행 1 × 0.2 = ${AVG_CONC}건`,
    note: "동시 실행 수는 같은 순간에 처리 중인 요청 수이고, 초당 요청 × 평균 처리 시간으로 셉니다. 평균이면 1초에 한 건이 0.2초만 실행되므로 동시에 도는 요청은 평균 0.2건입니다. 실행 단위 하나도 대부분 쉬고 있습니다.",
  },
  {
    label: "점심 피크의 1초: 100건이 겹칩니다",
    summary: `동시 실행 100 × 0.2 = ${PEAK_CONC}건`,
    note: "초당 100건이 오면 한 건이 끝나기 전 0.2초 동안 다음 19건이 더 도착합니다. 0.2초 뒤부터는 어느 순간을 잘라도 20건이 동시에 실행 중이고, 이 상태가 점심 1분, 즉 6,000건 동안 이어집니다(도착 간격이 고르다고 가정).",
  },
  {
    label: "새 실행 단위가 제때 뜨는가",
    summary: `필요 단위 0.2 → ${PEAK_CONC}`,
    note: "(가정) 평소 단위 하나가 켜져 있다면 피크에는 19개를 새로 띄워야 합니다. 첫 응답을 0.1초 안에 시작해야 하므로 새 단위의 시작 지연이 그보다 길면 그 요청은 목표를 놓칩니다. 동시 실행 한도가 20보다 낮아도 피크를 한꺼번에 받지 못합니다. 평균 비용이 싸도 피크를 못 받으면 탈락입니다.",
  },
] as const;

function Axis() {
  return (
    <g>
      <line x1={LEFT} x2={W - RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
      {[0, 0.2, 0.5, 1, 1.2].map((t) => (
        <g key={t}>
          <line x1={tx(t)} x2={tx(t)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
          <text x={tx(t)} y={AXIS_Y + 15} textAnchor="middle" fontSize={10} fill="#64748b">
            {t}초
          </text>
        </g>
      ))}
      <text x={LEFT - 4} y={TOP + 6} textAnchor="end" fontSize={9} fill="#64748b">
        단위1
      </text>
      <text x={LEFT - 4} y={laneY(PEAK_CONC - 1) + 6} textAnchor="end" fontSize={9} fill="#64748b">
        {PEAK_CONC}
      </text>
    </g>
  );
}

function DayBar() {
  const x0 = 16;
  const width = W - 32;
  const busy = (TOTAL_HOURS / 24) * width;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label="하루 24시간 중 실행 4.8시간, 쉬는 19.2시간">
      <text x={x0} y={60} fontSize={11} fill="#64748b">
        하루 24시간 (실행 시간을 한쪽으로 모은 그림)
      </text>
      <rect x={x0} y={72} width={width} height={34} rx={4} fill="none" stroke="#94a3b8" strokeWidth={1} />
      <rect x={x0} y={72} width={busy} height={34} rx={4} fill="#2563eb" />
      <text x={x0 + busy / 2} y={94} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
        4.8h
      </text>
      <text x={x0 + busy + (width - busy) / 2} y={94} textAnchor="middle" fontSize={11} fill="#64748b">
쉬는 시간 합계 19.2h
      </text>
      {[0, 6, 12, 18, 24].map((hour) => (
        <text key={hour} x={x0 + (hour / 24) * width} y={124} textAnchor={hour === 0 ? "start" : hour === 24 ? "end" : "middle"} fontSize={10} fill="#64748b">
          {hour}h
        </text>
      ))}
      <text x={x0} y={156} fontSize={11} fill="#475569">
        {`17,280초 ÷ 3,600 = ${TOTAL_HOURS}시간 = 24시간의 20%`}
      </text>
    </svg>
  );
}

function Lanes({ mode }: { mode: "avg" | "peak" | "start" }) {
  const probe = 0.5;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={mode === "avg" ? "1초 동안 요청 한 건이 0.2초 실행" : "1초 동안 100건이 0.2초씩 겹쳐 20개 단위가 동시에 실행"}>
      {Array.from({ length: PEAK_CONC }, (_, lane) => (
        <rect key={lane} x={LEFT} y={laneY(lane)} width={W - LEFT - RIGHT} height={LANE_H} fill="#94a3b8" opacity={0.12} />
      ))}
      {mode === "avg" ? (
        <rect x={tx(0)} y={laneY(0)} width={tx(SERVICE) - tx(0)} height={LANE_H} rx={1} fill="#2563eb" />
      ) : (
        PEAK_REQUESTS.map((request) => (
          <rect
            key={request.start}
            x={tx(request.start) + 0.4}
            y={laneY(request.lane)}
            width={tx(request.start + SERVICE) - tx(request.start) - 0.8}
            height={LANE_H}
            rx={1}
            fill={mode === "start" && request.lane > 0 ? "#d97706" : "#2563eb"}
          />
        ))
      )}
      {mode === "start" && (
        <g>
          {PEAK_REQUESTS.slice(1, PEAK_CONC).map((request) => (
            <rect key={request.start} x={tx(request.start) - 1} y={laneY(request.lane) - 1} width={2.5} height={LANE_H + 2} fill="#dc2626" />
          ))}
          <text x={LEFT} y={TOP - 8} fontSize={11} fill="#dc2626">
            빨간 표시 = 새 단위의 첫 요청 도착 → 0.1초 안에 시작
          </text>
        </g>
      )}
      {mode === "start" && (
        <text x={LEFT} y={H - 4} fontSize={11} fill="#b45309">
          주황 줄 = 피크에 새로 띄워야 할 단위 19개(가정)
        </text>
      )}
      {mode === "peak" && (
        <g>
          <line x1={tx(probe)} x2={tx(probe)} y1={TOP - 4} y2={AXIS_Y} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 2" />
          <text x={tx(probe) + 3} y={TOP - 8} fontSize={11} fill="#334155">
            이 순간 실행 중 {PEAK_CONC}건
          </text>
          <text x={LEFT} y={H - 4} fontSize={11} fill="#475569">
            {`그림은 첫 1초만: 이 1초가 60번 이어져 ${PEAK_MINUTE.toLocaleString("en-US")}건`}
          </text>
        </g>
      )}
      {mode === "avg" && (
        <text x={tx(SERVICE) + 6} y={laneY(0) + 6} fontSize={11} fill="#334155">
          0.2초 실행, 나머지 0.8초는 쉼
        </text>
      )}
      <Axis />
    </svg>
  );
}

export default function PeakConcurrencyViz() {
  return (
    <SceneShell
      eyebrow="평균과 피크"
      title="평균 0.2건이던 동시 실행이 피크에 20건이 됩니다"
      description={`가로줄 하나가 실행 단위 하나, 막대 하나가 0.2초짜리 요청 한 건입니다. 하루 ${PER_DAY.toLocaleString("en-US")}건·건당 0.2초·피크 초당 100건은 3절의 가정이고, 도착 간격이 고르다는 것은 그림을 위한 가정입니다. 피크 1분은 ${PEAK_MINUTE.toLocaleString("en-US")}건입니다.`}
      ariaLabel="하루 실행량, 평균의 1초, 피크의 1초, 새 실행 단위의 시작 지연을 차례로 비교"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) return <DayBar />;
        return <Lanes mode={active === 1 ? "avg" : active === 2 ? "peak" : "start"} />;
      }}
    />
  );
}
