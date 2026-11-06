import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 가맹사업법 제12조의4. 계약서의 영업지역 "매장 반경 500m"(가정) 안에
 * 300m 떨어진 같은 업종 매장(본문 예)은 정당한 사유가 없는 한 금지된다. 700m는 경계 밖을 보이려는 가정.
 * 축척: 100m = 20 SVG 단위.
 */
const CX = 130;
const CY = 118;
const UNIT = 0.2;
const R = 500 * UNIT;

const SCENES = [
  { label: "계약서에 적힌 경계", summary: "영업지역 = 반경 500m(가정)", distance: null, who: "", note: "본부는 계약을 맺을 때 점주의 영업지역을 정해 계약서에 적어야 합니다. 이 원이 그 약속의 범위이며, 반경 500m는 예로 놓은 값입니다." },
  { label: "경계 안 300m, 같은 업종", summary: "정당한 사유가 없는 한 금지", distance: 300, who: "본부 매장", note: "계약기간 중 영업지역 안에 같은 업종의 직영점이나 가맹점을 내는 일을 막습니다. 정당한 사유가 있으면 이 그림의 결론은 달라질 수 있습니다." },
  { label: "같은 자리, 계열회사 매장", summary: "계열회사 것도 포함", distance: 300, who: "계열회사 매장", note: "매장을 내는 쪽의 이름이 달라도 결론은 같습니다. 조문은 같은 업종의 직영점·가맹점에 계열회사 것을 포함합니다." },
  { label: "경계 밖 700m(가정)", summary: "이 금지가 말하는 범위 밖", distance: 700, who: "본부 매장", note: "이 조항의 금지는 영업지역 안을 말합니다. 다만 가까운 새 점포로 손님이 나뉠 수 있다는 앞 문단의 문제까지 원 밖에서 사라진다는 뜻은 아닙니다." },
] as const;

export default function TerritoryMapViz() {
  return (
    <SceneShell
      eyebrow="영업지역 지도"
      title="새 매장이 원 안에 있느냐가 금지를 가릅니다"
      description="가운데가 기존 점포이고 거리는 축척에 맞췄습니다. 반경 500m와 거리 700m는 가정입니다. 한국 가맹사업법 2026-10-02 시행본, 2026-10-09 확인 기준입니다."
      ariaLabel="반경 500미터 영업지역과 새 매장의 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const inside = scene.distance !== null && scene.distance < 500;
        const x = scene.distance === null ? 0 : CX + scene.distance * UNIT;
        const color = inside ? "#dc2626" : "#64748b";
        const labelX = inside ? x - 32 : x;
        return (
          <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <circle cx={CX} cy={CY} r={R} fill="#2563eb" fillOpacity={0.07} stroke="#2563eb" strokeWidth={1} strokeDasharray="5 4" />
            <text x={CX} y={CY - R - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">영업지역 경계 · 반경 500m(가정)</text>
            <rect x={CX - 9} y={CY - 9} width={18} height={18} rx={3} fill="#2563eb" />
            <text x={CX - 14} y={CY + 4} textAnchor="end" fontSize={12} fontWeight={700} fill="currentColor">기존 점포</text>
            {scene.distance !== null && (
              <>
                <line x1={CX + 9} x2={x - 8} y1={CY} y2={CY} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
                <text x={x} y={CY - 16} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{scene.distance}m{scene.distance === 700 ? "(가정)" : ""}</text>
                <path d={`M ${x} ${CY - 9} L ${x + 9} ${CY} L ${x} ${CY + 9} L ${x - 9} ${CY} Z`} fill={color} />
                <text x={labelX} y={CY + 26} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{scene.who}</text>
                <text x={labelX} y={CY + 42} textAnchor="middle" fontSize={12} fill={color}>{inside ? "원 안 · 금지" : "원 밖"}</text>
                {inside && <text x={labelX} y={CY + 57} textAnchor="middle" fontSize={11} fill={color}>정당한 사유가 없는 한</text>}
              </>
            )}
            <line x1={CX} x2={CX + R} y1={CY + 118 - 8} y2={CY + 118 - 8} stroke="#94a3b8" strokeWidth={1} />
            <text x={CX + R / 2} y={CY + 118 - 13} textAnchor="middle" fontSize={11} fill="#64748b">500m</text>
          </svg>
        );
      }}
    />
  );
}
