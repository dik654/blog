import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture·#comparison·#black-box — 교역 방향이 시기마다 바뀐다.
 * 대상로: 중국·남아시아·이란·러시아 사이 연결(2절). 1500년 이후 해상운송 우위(4·9절).
 * 러시아 제국·소련: 북쪽 중심 철도(4절, ADB "all the trade links ran north").
 * 독립 뒤: 중국·유럽·카스피해를 잇는 파이프라인·새 회랑, 2010년대 중국·유럽 철도(4·9절).
 * 마지막: 선로가 있어도 국경 절차·환적·운행 빈도가 실제 이용을 정한다(9절). 국경 개수는 가정.
 * 방위만 맞춘 개략도이고 거리·국경선·노선 위치는 실제가 아니다.
 */
const ON = "#2563eb";
const NORTH = "#7c3aed";
const SEA = "#0284c7";
const NEW = "#16a34a";
const DIM = "#94a3b8";
const BORDER = "#dc2626";

const SCENES = [
  { label: "대상로: 네 방향의 이웃", summary: "중국·남아시아·이란·러시아", note: "초원과 오아시스의 도시와 대상로는 중국·남아시아·이란·러시아 사이의 상품·세금·지식을 연결했습니다. 목축과 관개 농업, 도시 교역은 서로 보완하고 충돌했습니다." },
  { label: "1500년 이후: 바다가 앞섭니다", summary: "해상운송의 우위", note: "16세기 이후 해상무역이 커지며 대륙을 가로지르는 교역의 상대적 위치가 바뀌었습니다. 육로가 사라졌다는 뜻이 아니라 비중이 달라졌다는 뜻이어서 육로를 흐리게만 그렸습니다." },
  { label: "러시아 제국과 소련: 북쪽으로", summary: "북향 철도와 원료 생산", note: "러시아 제국과 소련은 북쪽 중심 철도와 원료 생산을 강화했습니다. ADB 연구는 이 시기를 '모든 교역 연결이 북쪽으로 달렸다'고 요약합니다." },
  { label: "1991년 뒤: 파이프라인과 새 회랑", summary: "중국·카스피해·유럽", note: "독립 뒤 에너지 파이프라인이, 2010년대에는 중국·유럽 철도가 늘었습니다. 새 회랑은 선택지를 넓히지만 통과국·항만·관세·부채 의존도 만듭니다. 흐린 선은 앞 장면의 연결이며, 없어졌다는 뜻은 아닙니다." },
  { label: "선로가 있어도 국경마다 멈춥니다", summary: "최단거리 ≠ 문전 비용", note: "바다에 직접 닿지 않는 나라의 화물은 여러 국경·철도·항만·관세 체계를 거칩니다. 빨간 표시는 국경 절차·검사·환적이 겹치는 자리이며 개수는 가정입니다. 지도 위 최단거리와 기업이 실제로 지불하는 문전 비용은 다릅니다." },
] as const;

const CX = 180;
const CY = 112;

function Place({ x, y, label, on, color = ON }: { x: number; y: number; label: string; on: boolean; color?: string }) {
  const w = label.length * 12 + 16;
  return (
    <g opacity={on ? 1 : 0.45}>
      <rect x={x - w / 2 + 0.5} y={y - 11.5} width={w - 1} height={23} rx={8} fill={on ? color : "none"} fillOpacity={0.12} stroke={on ? color : DIM} strokeWidth={1} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 500} fill="currentColor">{label}</text>
    </g>
  );
}

function Route({ d, color, on, dashed }: { d: string; color: string; on: boolean; dashed?: boolean }) {
  return <path d={d} fill="none" stroke={on ? color : DIM} strokeWidth={on ? 1.25 : 1} strokeDasharray={dashed ? "5 3" : undefined} opacity={on ? 1 : 0.5} />;
}

export default function CorridorDirectionViz() {
  return (
    <SceneShell
      eyebrow="교역 방향의 변화"
      title="중앙아시아의 교역로는 시기마다 다른 쪽을 향했습니다"
      description="방위만 맞춘 개략도입니다. 거리, 국경선, 노선의 실제 위치는 그리지 않았고 선 굵기는 교역량이 아니며, 흐린 선은 그 장면의 초점이 아닌 연결입니다."
      ariaLabel="대상로, 해상운송 우위, 러시아 제국과 소련의 북향 연결, 독립 뒤 새 회랑, 국경 절차로 이어지는 교역 방향 변화"
      scenes={SCENES}
      render={(active) => {
        const caravan = active === 0;
        const sea = active === 1;
        const north = active === 2;
        const corridor = active >= 3;
        const borders = active === 4;
        return (
          <svg viewBox="0 0 360 230" className="mx-auto h-auto w-full max-w-[440px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Route d={`M${CX},${CY - 14} L${CX},44`} color={north ? NORTH : ON} on={caravan || north} />
            <Route d={`M${CX + 46},${CY} L296,${CY}`} color={ON} on={caravan} />
            <Route d={`M${CX - 20},${CY + 14} L118,170`} color={ON} on={caravan} />
            <Route d={`M${CX + 20},${CY + 14} L242,170`} color={ON} on={caravan} />

            <Route d="M14,204 C120,224 240,224 346,204" color={SEA} on={sea} dashed />
            <text x={180} y={226} textAnchor="middle" fontSize={11} fill={sea ? SEA : "currentColor"} opacity={sea ? 1 : 0.5}>바다 항로(대륙 밖)</text>

            {corridor && (
              <>
                <Route d={`M${CX + 46},${CY} L296,${CY}`} color={NEW} on />
                <Route d={`M${CX - 46},${CY} L94,${CY}`} color={NEW} on />
                <text x={248} y={CY - 12} textAnchor="middle" fontSize={10.5} fill={NEW}>철도·파이프라인</text>
              </>
            )}

            {borders &&
              [108, 122, 236, 262].map((x) => (
                <g key={x} stroke={BORDER} strokeWidth={1.25}>
                  <line x1={x} y1={CY - 9} x2={x} y2={CY + 9} />
                </g>
              ))}
            {borders && <text x={CX} y={CY + 30} textAnchor="middle" fontSize={11} fontWeight={700} fill={BORDER}>| 국경 절차·검사·환적(개수 가정)</text>}

            <Place x={CX} y={CY} label="중앙아시아" on />
            <Place x={CX} y={32} label="러시아" on={caravan || north} color={north ? NORTH : ON} />
            <Place x={316} y={CY} label="중국" on={caravan || corridor} color={corridor ? NEW : ON} />
            {corridor && <Place x={50} y={CY} label="카스피해·유럽" on color={NEW} />}
            <Place x={100} y={180} label="이란" on={caravan} />
            <Place x={258} y={180} label="남아시아" on={caravan} />
          </svg>
        );
      }}
    />
  );
}
