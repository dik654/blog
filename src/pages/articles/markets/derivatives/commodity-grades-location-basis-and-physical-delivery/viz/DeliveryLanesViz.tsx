import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 물건·권리표(증서)·돈이 서로 다른 길로 움직인다.
 * 열 = 승인 시설 / 매도자 / 청산 장부 / 매수자, 행 = 물건 / 증서 / 돈.
 * 2절: 청산 장부가 인도 통지·대금·증서 이동을 맞춘다. 9절: 증서를 받아도 곧바로 적재된 것은 아니다.
 */
const W = 360;
const H = 210;
const COLS = [
  { x: 92, label: "승인 시설" },
  { x: 172, label: "매도자" },
  { x: 252, label: "청산 장부" },
  { x: 326, label: "매수자" },
] as const;
const ROWS = [
  { y: 70, label: "물건" },
  { y: 122, label: "증서" },
  { y: 174, label: "돈" },
] as const;
const ROW_Y = { goods: 70, cert: 122, cash: 174 } as const;

const SCENES = [
  { label: "보관과 검사", summary: "곡물은 승인 시설에", note: "곡물은 거래소가 승인한 시설에 보관되고 등급과 무게를 확인받습니다. 아직 증서도 돈도 움직이지 않았습니다." },
  { label: "증서 발행", summary: "시설 → 내줄 의무를 적은 증서", note: "시설이 발행해 등록한 증서는 정해진 장소에서 계약 품질의 곡물을 내줄 의무를 나타냅니다. 증서는 낱알 더미 자체가 아니라 그 의무를 가리키는 권리표입니다." },
  { label: "청산으로 인도", summary: "증서는 매수자로, 대금은 매도자로", note: "선물 매도자는 청산 절차로 증서를 넘기고 매수자는 대금을 지급합니다. 청산 장부가 인도 통지와 대금·증서 이동을 맞춥니다. 이 순간에도 곡물은 시설에 그대로 있습니다." },
  { label: "출고 요청", summary: "증서 보유자 → 시설 → 운송·적재", note: "증서를 가진 사람이 발행 시설에 출고를 요구하면 그때부터 운송 수단, 공식 무게와 실제 적재 일정이 이어집니다. 증서를 받은 것과 트럭에 곡물이 실린 것은 다른 시점입니다." },
] as const;

function Token({ x, y, text, color, dashed = false }: { x: number; y: number; text: string; color: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x - 33} y={y - 13} width={66} height={26} rx={8} fill="#ffffff" stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{text}</text>
    </g>
  );
}

function Arrow({ x1, x2, y, color, label, dashed = false }: { x1: number; x2: number; y: number; color: string; label?: string; dashed?: boolean }) {
  const dir = x2 > x1 ? 1 : -1;
  return (
    <g>
      <line x1={x1} x2={x2 - dir * 4} y1={y} y2={y} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <path d={`M ${x2} ${y} l ${-dir * 7} -4 v 8 z`} fill={color} />
      {label && <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" fontSize={12} fill={color}>{label}</text>}
    </g>
  );
}

export default function DeliveryLanesViz() {
  return (
    <SceneShell
      eyebrow="실물 인도의 세 갈래"
      title="곡물·증서·대금은 서로 다른 때에 움직입니다"
      description="가로줄은 움직이는 것(물건, 증서, 돈), 세로줄은 그것을 가진 쪽입니다. 증서는 승인 시설이 계약 품질의 곡물을 내주겠다는 의무를 나타내는 문서로, 6절에서 선적증서라는 이름을 붙입니다."
      ariaLabel="승인 시설, 매도자, 청산 장부, 매수자 사이에서 곡물, 증서, 대금이 움직이는 순서"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {COLS.map((col) => (
            <g key={col.label}>
              <text x={col.x} y={22} textAnchor="middle" fontSize={13} fontWeight={700} fill="#334155">{col.label}</text>
              <line x1={col.x} x2={col.x} y1={32} y2={196} stroke="#e2e8f0" strokeWidth={1} />
            </g>
          ))}
          {ROWS.map((row) => (
            <g key={row.label}>
              <text x={8} y={row.y + 4} fontSize={13} fontWeight={700} fill="#64748b">{row.label}</text>
              <line x1={44} x2={W - 4} y1={row.y + 22} y2={row.y + 22} stroke="#f1f5f9" strokeWidth={1} />
            </g>
          ))}

          {active < 3 && <Token x={COLS[0].x} y={ROW_Y.goods} text={active === 0 ? "곡물 검사" : "곡물"} color="#475569" />}
          {active === 3 && (
            <g>
              <Token x={COLS[0].x} y={ROW_Y.goods} text="곡물" color="#475569" dashed />
              <Arrow x1={COLS[0].x + 35} x2={COLS[3].x - 35} y={ROW_Y.goods} color="#475569" label="운송·공식 무게·적재" />
              <Token x={COLS[3].x} y={ROW_Y.goods} text="운송" color="#475569" />
            </g>
          )}

          {active === 1 && (
            <g>
              <Token x={COLS[0].x} y={ROW_Y.cert} text="증서 발행" color="#2563eb" />
              <line x1={COLS[0].x} x2={COLS[0].x} y1={ROW_Y.cert - 13} y2={ROW_Y.goods + 13} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
            </g>
          )}
          {active === 2 && (
            <g>
              <Token x={COLS[1].x} y={ROW_Y.cert} text="증서" color="#2563eb" dashed />
              <Arrow x1={COLS[1].x + 35} x2={COLS[3].x - 35} y={ROW_Y.cert} color="#2563eb" label="청산 절차로" />
              <Token x={COLS[3].x} y={ROW_Y.cert} text="증서" color="#2563eb" />
              <Token x={COLS[3].x} y={ROW_Y.cash} text="대금" color="#16a34a" dashed />
              <Arrow x1={COLS[3].x - 35} x2={COLS[1].x + 35} y={ROW_Y.cash} color="#16a34a" label="대금 지급" />
              <Token x={COLS[1].x} y={ROW_Y.cash} text="대금" color="#16a34a" />
            </g>
          )}
          {active === 3 && (
            <g>
              <Token x={COLS[3].x} y={ROW_Y.cert} text="증서" color="#2563eb" />
              <Arrow x1={COLS[3].x - 35} x2={COLS[0].x + 35} y={ROW_Y.cert} color="#2563eb" label="출고 요청" dashed />
              <Token x={COLS[1].x} y={ROW_Y.cash} text="대금" color="#16a34a" />
            </g>
          )}
        </svg>
      )}
    />
  );
}
