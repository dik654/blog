import ArrowHead from "./ArrowHead";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 만들기·보내기·쓰기의 세 확인, 돈은 반대 방향으로 흐른다.
 * 이 절은 숫자를 주지 않으므로 금액을 적지 않는다.
 */
const BOXES = [
  { x: 10, name: "만드는 곳", check: "① 낼 수 있는 양" },
  { x: 135, name: "보내는 길", check: "② 통과할 양" },
  { x: 260, name: "쓰는 곳", check: "③ 도착한 양" },
];
const BOX_W = 90;

const SCENES = [
  { label: "전기가 가는 방향", summary: "만들기 → 보내기 → 쓰기", note: "전기는 만드는 곳에서 길을 지나 쓰는 곳으로 갑니다." },
  { label: "세 번의 확인", summary: "그 시간의 양을 곳곳에서 확인", note: "만드는 곳은 그 시간에 내보낼 수 있는 양을, 보내는 쪽은 안전하게 통과할 양을 알려 줍니다. 쓰는 곳은 도착한 양으로 기계를 돌리고, 부족하면 다른 공급이나 생산 연기를 선택합니다." },
  { label: "돈은 반대로", summary: "쓰는 곳 → 길·생산", note: "쓰는 사람이 내는 돈으로 생산과 길의 유지 비용을 갚습니다. 어느 기관이 나누어 맡든 이 세 기능은 모두 필요합니다." },
];

export default function TwoWayFlowViz() {
  return (
    <SceneShell
      eyebrow="큰 흐름"
      title="전기는 오른쪽으로, 돈은 왼쪽으로 흐릅니다"
      description="기관 이름 대신 기능만 놓았습니다. 금액은 뒤의 사례에서 붙입니다."
      ariaLabel="만드는 곳, 보내는 길, 쓰는 곳으로 가는 전기와 반대로 흐르는 돈"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {BOXES.map((box) => (
            <g key={box.name}>
              <rect x={box.x} y={50} width={BOX_W} height={46} rx={8} fill="#64748b" fillOpacity={0.1} stroke="#64748b" strokeWidth={1} />
              <text x={box.x + BOX_W / 2} y={78} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">{box.name}</text>
              {active === 1 && <text x={box.x + BOX_W / 2} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">{box.check}</text>}
            </g>
          ))}
          <g opacity={active === 2 ? 0.35 : 1}>
            <line x1={100} x2={135} y1={73} y2={73} stroke="#2563eb" strokeWidth={1.25} />
            <ArrowHead x={135} y={73} color="#2563eb" />
            <line x1={225} x2={260} y1={73} y2={73} stroke="#2563eb" strokeWidth={1.25} />
            <ArrowHead x={260} y={73} color="#2563eb" />
          </g>
          {active === 0 && <text x={180} y={28} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">전기 →</text>}
          {active === 2 && (
            <g>
              <text x={180} y={28} textAnchor="middle" fontSize={12} fontWeight={700} fill="#16a34a">← 돈</text>
              <path d="M 285 96 V 118 H 180 V 103" fill="none" stroke="#16a34a" strokeWidth={1.25} />
              <ArrowHead x={180} y={96} angle={-90} color="#16a34a" />
              <path d="M 325 96 V 146 H 55 V 103" fill="none" stroke="#16a34a" strokeWidth={1.25} />
              <ArrowHead x={55} y={96} angle={-90} color="#16a34a" />
              <text x={232} y={113} textAnchor="middle" fontSize={11} fontWeight={700} fill="#16a34a">길 유지 비용</text>
              <text x={190} y={141} textAnchor="middle" fontSize={11} fontWeight={700} fill="#16a34a">생산 비용</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
