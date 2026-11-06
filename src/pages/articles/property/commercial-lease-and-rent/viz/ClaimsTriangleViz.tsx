import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 권리금·시설값과 보증금은 서로 다른 사람 사이의 청구이며, 시설을 팔아도 기존 점주의 의무는 남는다.
 * 금액은 본문에 없으므로 적지 않습니다.
 */
const W = 360;
const H = 262;
const TOP = { x: 180, y: 8, w: 96, h: 34 };
const LEFT = { x: 6, y: 218, w: 96, h: 34 };
const RIGHT = { x: 258, y: 218, w: 96, h: 34 };

const TEXT = "#64748b";
const AXIS = "#cbd5e1";
const DEPOSIT = "#2563eb";
const GOODWILL = "#d97706";
const CONSENT = "#16a34a";
const DUTY = "#dc2626";

const SCENES = [
  { label: "보증금", summary: "기존 점주 ↔ 임대인", note: "임대인에게 맡긴 돈이고, 정산 뒤 돌려받을 때도 임대인에게 청구합니다." },
  { label: "권리금과 시설값", summary: "새 점주 → 기존 점주", note: "두 점주 사이를 오가는 돈입니다. 임대인에게 낸 보증금이 아니며, 제10조의4가 보호하는 것도 회수 기회이지 받을 금액 자체가 아닙니다." },
  { label: "새 임대차", summary: "임대인 ↔ 새 점주", note: "시설을 샀어도 공간을 쓰는 권리가 따라오지는 않습니다. 임대인이 새 임대차를 거절할 수 있는 조건과 법적 제한을 따로 봅니다." },
  { label: "그래도 남는 의무", summary: "기존 점주 → 임대인", note: "새 점주에게 시설을 팔았다는 사실만으로 기존 점주의 임대차 채무나 복구 의무가 모두 사라지지는 않습니다." },
] as const;

function Node({ box, text }: { box: { x: number; y: number; w: number; h: number }; text: string }) {
  const x = box.x === 180 ? box.x - box.w / 2 : box.x;
  return (
    <g>
      <rect x={x} y={box.y} width={box.w} height={box.h} rx={8} fill="none" stroke={TEXT} strokeWidth={1} />
      <text x={x + box.w / 2} y={box.y + 22} textAnchor="middle" fontSize={14} fontWeight={700} fill={TEXT}>{text}</text>
    </g>
  );
}

function Edge({ x1, y1, x2, y2, color, dashed }: { x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a = 9;
  const ax = (s: number) => x2 - a * Math.cos(angle + s * 0.45);
  const ay = (s: number) => y2 - a * Math.sin(angle + s * 0.45);
  return (
    <g fill="none" stroke={color} strokeWidth={1.25}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} strokeDasharray={dashed ? "4 3" : undefined} />
      <path d={`M${ax(1)} ${ay(1)} L${x2} ${y2} L${ax(-1)} ${ay(-1)}`} />
    </g>
  );
}

export default function ClaimsTriangleViz() {
  return (
    <SceneShell
      eyebrow="세 사람, 세 청구"
      title="같은 가게의 돈인데 누가 누구에게 청구할까요"
      description="네모가 사람이고 화살표가 돈이나 의무의 방향입니다. 지금 장면의 선만 진하게 그립니다."
      note="이 글의 한국 사례 설명을 그린 것으로 금액은 넣지 않았고, 개별 계약의 권리를 판정하지 않습니다."
      ariaLabel="임대인, 기존 점주, 새 점주 사이의 보증금, 권리금과 시설값, 새 임대차, 남는 의무"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <g stroke={AXIS} strokeWidth={1} strokeDasharray="2 3">
            <line x1={54} y1={216} x2={146} y2={44} />
            <line x1={306} y1={216} x2={214} y2={44} />
            <line x1={104} y1={235} x2={256} y2={235} />
          </g>
          <Node box={TOP} text="임대인" />
          <Node box={LEFT} text="기존 점주" />
          <Node box={RIGHT} text="새 점주" />

          {active === 0 && (
            <g>
              <Edge x1={62} y1={216} x2={150} y2={48} color={DEPOSIT} />
              <Edge x1={150} y1={72} x2={84} y2={198} color={DEPOSIT} />
              <text x={130} y={148} fontSize={13} fontWeight={700} fill={DEPOSIT}>보증금 맡김</text>
              <text x={130} y={166} fontSize={13} fontWeight={700} fill={DEPOSIT}>정산 뒤 반환</text>
            </g>
          )}
          {active === 1 && (
            <g>
              <Edge x1={256} y1={235} x2={106} y2={235} color={GOODWILL} />
              <text x={180} y={209} textAnchor="middle" fontSize={13} fontWeight={700} fill={GOODWILL}>권리금 · 시설값</text>
              <text x={180} y={226} textAnchor="middle" fontSize={12} fill={GOODWILL}>임대인을 거치지 않음</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <Edge x1={298} y1={216} x2={210} y2={48} color={CONSENT} dashed />
              <text x={234} y={130} textAnchor="end" fontSize={13} fontWeight={700} fill={CONSENT}>새 임대차는</text>
              <text x={234} y={148} textAnchor="end" fontSize={13} fontWeight={700} fill={CONSENT}>따로 확인</text>
              <text x={180} y={228} textAnchor="middle" fontSize={12} fill={GOODWILL}>시설값을 냈어도</text>
            </g>
          )}
          {active === 3 && (
            <g>
              <Edge x1={62} y1={216} x2={150} y2={48} color={DUTY} />
              <text x={130} y={148} fontSize={13} fontWeight={700} fill={DUTY}>임대차 채무</text>
              <text x={130} y={166} fontSize={13} fontWeight={700} fill={DUTY}>복구 의무</text>
              <text x={180} y={228} textAnchor="middle" fontSize={12} fill={GOODWILL}>시설을 팔았어도</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
