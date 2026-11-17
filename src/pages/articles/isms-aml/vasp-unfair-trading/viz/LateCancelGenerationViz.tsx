import SceneShell from "./SurveillanceSceneShell";

/**
 * 본문 대응: #information-order-boundary 둘째 문단 — event time과 ingestion time, 늦게 도착한 event는
 * 원래 시점에 몰래 끼워 넣지 않고 correction generation으로 남긴다.
 * 시각은 모두 가정: 신규 주문 event 0초·도착 0초, 취소 event 3초·도착 40초, gen 1 재구성 10초.
 */
const ORDER_E = 0;
const CANCEL_E = 3;
const CANCEL_I = 40;
const GEN1_AT = 10;
const LIFE = CANCEL_E - ORDER_E;

const SCENES = [
  { label: "두 시계", summary: "event 3초 · 도착 40초", note: "(가정) 대량 매수 주문이 0초에 들어오고 3초에 취소됐습니다. 그런데 취소 event는 40초에야 감시 시스템에 도착했습니다. event time은 일이 일어난 시각, ingestion time은 시스템이 받은 시각입니다." },
  { label: "gen 1: 10초에 재구성", summary: "취소 아직 없음", note: "10초에 만든 재구성(gen 1)에는 취소가 아직 없어 주문이 살아 있는 것처럼 보입니다. 취소까지 걸린 시간도 알 수 없습니다." },
  { label: "몰래 끼워 넣으면", summary: "gen 1 입력이 사라짐", note: "40초에 도착한 취소를 gen 1 기록 속 3초 자리에 조용히 덮어쓰면, gen 1이 무엇을 보고 후보를 만들었는지 같은 입력으로 다시 재현할 수 없습니다." },
  { label: "correction generation", summary: `gen 2: 주문 생존 ${LIFE}초`, note: "gen 1은 그대로 두고 취소를 반영한 gen 2를 새로 만듭니다. gen 2에서는 주문이 3초 만에 취소된 것으로 재구성되어, 체결할 뜻 없는 주문을 띄웠다 거두는 spoofing·layering 후보를 다시 계산할 수 있고, 두 세대를 나란히 비교할 수 있습니다." },
] as const;

const W = 360;
const H = 220;
const X0 = 66;
const X1 = 344;
const MAX_S = 45;
const tx = (s: number) => X0 + (s / MAX_S) * (X1 - X0);
const EY = 34;
const IY = 82;

function GenBox({ x, label, lines, state }: { x: number; label: string; lines: readonly string[]; state: "on" | "off" | "struck" }) {
  const stroke = state === "on" ? "#2563eb" : "#cbd5e1";
  return (
    <g opacity={state === "off" ? 0.3 : 1}>
      <rect x={x} y={112} width={160} height={92} rx={8} fill="#ffffff" stroke={stroke} strokeWidth={1} />
      <text x={x + 10} y={130} fontSize={10} fontWeight={700} fill="#1e293b">{label}</text>
      {lines.map((line, i) => (
        <text key={line} x={x + 10} y={150 + i * 16} fontSize={9} fill="#475569">{line}</text>
      ))}
      {state === "struck" && (
        <>
          <line x1={x + 6} x2={x + 154} y1={118} y2={198} stroke="#dc2626" strokeWidth={1.25} />
          <text x={x + 80} y={198} textAnchor="middle" fontSize={9} fontWeight={700} fill="#dc2626">재현 불가</text>
        </>
      )}
    </g>
  );
}

export default function LateCancelGenerationViz() {
  return (
    <SceneShell
      eyebrow="Late event"
      title="늦게 도착한 취소는 덮어쓰지 않고 새 세대로 남깁니다"
      description="위 두 줄은 같은 주문의 두 시계입니다. 아래 상자는 감시 시스템이 만든 재구성 세대(generation)입니다. 초 단위 시각은 모두 가정입니다."
      ariaLabel="취소 event가 늦게 도착했을 때 gen 1을 보존하고 gen 2를 만드는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={4} y={EY + 4} fontSize={10} fontWeight={700} fill="#334155">event time</text>
          <text x={4} y={IY + 4} fontSize={10} fontWeight={700} fill="#334155">도착 시각</text>
          <line x1={X0} x2={X1} y1={EY} y2={EY} stroke="#94a3b8" strokeWidth={1} />
          <line x1={X0} x2={X1} y1={IY} y2={IY} stroke="#94a3b8" strokeWidth={1} />
          {[0, 10, 20, 30, 40].map((s) => (
            <text key={s} x={tx(s)} y={IY + 14} textAnchor="middle" fontSize={8} fill="#94a3b8">{s}초</text>
          ))}
          <line x1={tx(ORDER_E)} x2={tx(ORDER_E)} y1={EY} y2={IY} stroke="#2563eb" strokeWidth={1} />
          <circle cx={tx(ORDER_E)} cy={EY} r={4} fill="#2563eb" />
          <circle cx={tx(ORDER_E)} cy={IY} r={4} fill="#2563eb" />
          <text x={tx(ORDER_E) + 6} y={EY - 8} fontSize={9} fill="#1d4ed8">주문</text>
          <line x1={tx(CANCEL_E)} x2={tx(CANCEL_I)} y1={EY} y2={IY} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
          <circle cx={tx(CANCEL_E)} cy={EY} r={4} fill="#d97706" />
          <circle cx={tx(CANCEL_I)} cy={IY} r={4} fill="#d97706" />
          <text x={tx(CANCEL_E) + 8} y={EY - 8} fontSize={9} fill="#b45309">취소 (3초)</text>
          <text x={tx(CANCEL_I)} y={IY - 8} textAnchor="middle" fontSize={9} fill="#b45309">취소 도착 40초</text>
          {active >= 1 && (
            <>
              <line x1={tx(GEN1_AT)} x2={tx(GEN1_AT)} y1={IY - 24} y2={IY + 4} stroke="#475569" strokeWidth={1.25} />
              <text x={tx(GEN1_AT) + 4} y={IY - 16} fontSize={9} fontWeight={700} fill="#475569">gen 1 재구성</text>
            </>
          )}
          <GenBox
            x={8}
            label="gen 1 (10초 시점)"
            lines={["주문 0초 · 살아 있음", "취소 event 없음", "생존 시간: 알 수 없음"]}
            state={active === 0 ? "off" : active === 2 ? "struck" : "on"}
          />
          <GenBox
            x={192}
            label="gen 2 (correction)"
            lines={["주문 0초 · 취소 3초", `생존 시간 ${LIFE}초`, "gen 1과 나란히 보존"]}
            state={active === 3 ? "on" : "off"}
          />
        </svg>
      )}
    />
  );
}
