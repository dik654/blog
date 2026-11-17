import FdsSceneShell from "./FdsSceneShell";

/**
 * 본문 대응: #signal-case-pipeline 첫 문단 — 한울무역의 24시간 송금 횟수는 판단 시각 이전 거래만 포함하고,
 * 나중에 도착한 record를 과거 score에 몰래 넣지 않는다.
 * 위 줄 = event time, 아래 줄 = ingestion time. 송금 건수와 시각은 모두 가정이다.
 * window 안·T 이전 도착 5건 → feature 5. T 뒤 거래 1건과 T 뒤 도착 1건은 그 score에 들어가지 않는다.
 */
const W = 400;
const H = 196;
const X_START = 84;
const X_T = 282;
const Y_EVENT = 62;
const Y_INGEST = 128;

type Kind = "in" | "future" | "late";
const TXS: readonly { event: number; ingest: number; kind: Kind }[] = [
  { event: 102, ingest: 112, kind: "in" },
  { event: 136, ingest: 146, kind: "in" },
  { event: 170, ingest: 180, kind: "in" },
  { event: 204, ingest: 214, kind: "in" },
  { event: 238, ingest: 248, kind: "in" },
  { event: 262, ingest: 322, kind: "late" },
  { event: 342, ingest: 364, kind: "future" },
];
const IN_COUNT = TXS.filter((tx) => tx.kind === "in").length;

const SCENES = [
  { label: "24시간 window", summary: `송금 횟수 = ${IN_COUNT}`, note: "판단 시각 T에서 거꾸로 24시간을 잡고, 그 안에서 일어나 T 전에 도착한 송금만 셉니다. 그림의 5건과 시각은 설명을 위한 가정입니다." },
  { label: "T 뒤에 일어난 거래", summary: "window 밖 → 세지 않음", note: "T 뒤에 일어난 송금은 T 시점에 존재하지 않던 미래 거래입니다. 이것이 과거 window에 들어가면 판단 시각에 있던 자료만 붙이는 point-in-time join이 실패한 것으로 보고, 그 feature를 만든 계산 버전(feature generation)을 되돌립니다." },
  { label: "늦게 도착한 record", summary: "T의 score는 5건 기준", note: "이 송금은 window 안에서 일어났지만 FDS에는 T 뒤에 도착했습니다. T에 계산한 score는 그때 도착해 있던 5건으로 만든 것이므로, 늦게 온 record를 그 과거 score에 몰래 넣지 않습니다." },
  { label: "같은 판단을 다시 재생", summary: "ID를 함께 보존", note: "Customer·transaction·rule/model generation·alert·case ID를 함께 남겨야 나중에 같은 입력과 같은 규칙으로 T의 판단을 재생할 수 있습니다." },
] as const;

const IDS = ["customer", "transaction", "rule/model generation", "alert", "case"] as const;

function color(kind: Kind, active: number) {
  if (kind === "in") return active === 0 || active === 3 ? "#2563eb" : "#94a3b8";
  if (kind === "future") return active === 1 ? "#dc2626" : "#cbd5e1";
  return active === 2 ? "#d97706" : "#cbd5e1";
}

export default function PointInTimeWindowViz() {
  return (
    <FdsSceneShell
      eyebrow="Point-in-time feature"
      title="24시간 송금 횟수는 판단 시각에 이미 있던 거래로만 셉니다"
      description="선 하나가 한울무역의 송금 한 건입니다. 위 점은 event time(송금이 실제로 일어난 시각), 아래 점은 ingestion time(그 record가 FDS에 도착한 시각)입니다. 건수와 시각은 가정입니다."
      ariaLabel="event time과 ingestion time으로 본 24시간 송금 window"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={X_START} y={40} width={X_T - X_START} height={108} rx={6} fill="#2563eb" fillOpacity={0.06} stroke="#2563eb" strokeOpacity={0.5} strokeWidth={1} strokeDasharray="4 3" />
            <text x={X_START} y={32} fontSize={13} fill="#64748b">T − 24시간</text>
            <line x1={X_T} x2={X_T} y1={20} y2={160} stroke="#0f766e" strokeWidth={1.25} />
            <text x={X_T} y={14} fontSize={13} fill="#0f766e" textAnchor="middle" fontWeight={700}>판단 시각 T</text>
            <text x={4} y={Y_EVENT + 4} fontSize={12} fill="#64748b">event time</text>
            <text x={4} y={Y_INGEST - 4} fontSize={12} fill="#64748b">ingestion</text>
            <text x={4} y={Y_INGEST + 11} fontSize={12} fill="#64748b">time</text>
            <line x1={72} x2={W - 8} y1={Y_EVENT} y2={Y_EVENT} stroke="#94a3b8" strokeWidth={1} />
            <line x1={72} x2={W - 8} y1={Y_INGEST} y2={Y_INGEST} stroke="#94a3b8" strokeWidth={1} />
            {TXS.map((tx) => {
              const c = color(tx.kind, active);
              return (
                <g key={`${tx.event}-${tx.kind}`}>
                  <line x1={tx.event} x2={tx.ingest} y1={Y_EVENT} y2={Y_INGEST} stroke={c} strokeWidth={1.25} />
                  <circle cx={tx.event} cy={Y_EVENT} r={5} fill={c} />
                  <circle cx={tx.ingest} cy={Y_INGEST} r={5} fill="#ffffff" stroke={c} strokeWidth={1.25} />
                </g>
              );
            })}
            {active === 1 && (
              <text x={342} y={Y_EVENT - 12} fontSize={13} fill="#dc2626" textAnchor="middle" fontWeight={700}>T 뒤 거래</text>
            )}
            {active === 2 && (
              <text x={322} y={Y_INGEST + 22} fontSize={13} fill="#d97706" textAnchor="middle" fontWeight={700}>T 뒤 도착</text>
            )}
            <text x={X_START + (X_T - X_START) / 2} y={182} fontSize={14} fill="#2563eb" textAnchor="middle" fontWeight={700}>
              T의 24시간 송금 횟수 = {IN_COUNT}
            </text>
          </svg>
          <div className="mt-3 flex min-h-[3.5rem] flex-wrap items-start gap-1.5">
            {IDS.map((id) => (
              <span
                key={id}
                className={`rounded-md border px-2 py-1 font-mono text-[11px] leading-4 ${active === 3 ? "border-primary/60 text-foreground" : "border-border/50 text-muted-foreground/50"}`}
              >
                {id} ID
              </span>
            ))}
          </div>
        </div>
      )}
    />
  );
}
