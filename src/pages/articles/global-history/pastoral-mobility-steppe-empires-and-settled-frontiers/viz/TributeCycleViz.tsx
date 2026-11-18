import { Arrow, Box } from "./FlowParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 봄 뒤 110마리 가운데 내보낸 20마리(3절 가정)가 시장과 공납으로 갈라지고,
 * 행정 중심이 전령·군대·장인과 역참에 나누어 다음 이동과 통치로 돌아오는 순환.
 * 두 갈래 몫(시장 몇 마리, 공납 몇 마리)은 글에 없어 화살표 굵기를 같게 둔다.
 * "공납 가축을 역참과 군대의 물자로 배분합니다"는 6절 용어 예시에서 왔다.
 */
const HERD = "#2563eb";
const MARKET = "#0f766e";
const TRIBUTE = "#7c3aed";
const ADMIN = "#d97706";
const COND = "#64748b";
const SHAKE = "#dc2626";

const SCENES = [
  { label: "봄 뒤 무리에서 20마리가 나갑니다", summary: "110 − 20 = 90 (가정)", note: "3절의 설명용 장부에서 봄 뒤 110마리 가운데 20마리를 내보냅니다. 글은 '일부'를 시장으로, '일부'를 공납과 의례로 보낸다고만 해서 두 갈래의 마릿수는 적지 않았습니다." },
  { label: "시장에서 곡물과 직물로 바꿉니다", summary: "가축 → 곡물·직물", note: "일부를 시장으로 몰아 곡물과 직물을 삽니다. 가축은 나가고 곡물과 직물이 가구로 돌아옵니다." },
  { label: "정치 연합에 공납하고 의례에 냅니다", summary: "가축 → 공납·의례", note: "일부는 정치 연합의 공납과 의례에 냅니다. 공납은 연합에 대한 의무로 바치는 가축입니다." },
  { label: "행정 중심이 다시 나눕니다", summary: "전령·군대·장인 · 역참", note: "행정 중심은 모인 가축과 물자를 전령·군대·장인에게 나눕니다. 역참은 전령이 말을 갈아타며 소식을 잇는 거점이며, 공납 가축이 역참과 군대의 물자로 배분될 수 있습니다(6절 예시)." },
  { label: "역참이 다음 이동과 통치를 돕습니다", summary: "순환이 닫힘", note: "역참은 다음 이동과 통치를 돕습니다. 내보낸 20마리는 사라진 것이 아니라 곡물·직물과 공납 의무로 바뀌고, 공납은 역참을 거쳐 다음 이동과 통치를 받칩니다. 가구가 같은 가축을 돌려받는다는 뜻은 아닙니다." },
  { label: "순환이 유지되려면", summary: "네 조건", note: "이 순환에는 목초지의 회복, 안전한 통행, 시장의 교환비, 정치 연합의 신뢰가 필요합니다. 각 조건을 그것이 걸리는 자리 옆에 적었습니다." },
  { label: "가뭄으로 여러 지역이 함께 줄면", summary: "가격·세입·동원이 흔들림", note: "가뭄으로 여러 지역의 가축이 동시에 줄면 시장 가격과 세입, 군사 동원도 함께 흔들립니다. 얼마나 흔들리는지는 글에 수치가 없어 크기로 그리지 않았습니다." },
] as const;

function Tag({ x, y, text, color, anchor = "middle" }: { x: number; y: number; text: string; color: string; anchor?: "start" | "middle" | "end" }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={10.5} fontWeight={700} fill={color}>{text}</text>;
}

export default function TributeCycleViz() {
  return (
    <SceneShell
      eyebrow="가축 20마리의 길"
      title="내보낸 가축 20마리가 곡물·공납·역참으로 바뀌는 길을 따라갑니다"
      description="3절 가정 장부의 20마리를 따라가는 흐름도입니다. 화살표 굵기와 길이는 마릿수나 거리를 뜻하지 않습니다."
      ariaLabel="가축 20마리가 시장과 공납으로 갈라져 행정 중심, 전령과 군대, 역참을 거쳐 다음 이동으로 돌아오는 순환과 그 조건"
      scenes={SCENES}
      render={(active) => {
        const conditions = active === 5;
        const drought = active === 6;
        const market = active === 1 || active >= 5;
        const tribute = active === 2 || active >= 5;
        const admin = active === 3 || active >= 5;
        const relay = active === 4 || active >= 5;
        return (
          <svg viewBox="0 0 360 252" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={8} y={100} w={96} h={52} title="가구의 무리" sub={active === 0 ? "110 → 90" : "가축"} color={drought ? SHAKE : HERD} on dashed={drought} />

            <Box x={132} y={8} w={100} h={44} title="시장" sub={drought ? "가격 흔들림" : "곡물·직물"} color={MARKET} on={market} />
            <Arrow x1={70} y1={98} x2={140} y2={54} color={MARKET} on={market || active === 0} />
            <Arrow x1={176} y1={54} x2={92} y2={98} color={MARKET} on={market} dashed />
            <g opacity={market ? 1 : 0.4}><Tag x={124} y={92} text="곡물·직물" color={MARKET} anchor="start" /></g>

            <Box x={132} y={200} w={100} h={44} title="공납·의례" sub="정치 연합" color={TRIBUTE} on={tribute} />
            <Arrow x1={70} y1={154} x2={140} y2={198} color={TRIBUTE} on={tribute || active === 0} />

            <Box x={262} y={128} w={90} h={44} title="행정 중심" sub={drought ? "세입 흔들림" : undefined} color={ADMIN} on={admin} />
            <Arrow x1={234} y1={210} x2={280} y2={174} color={TRIBUTE} on={tribute || admin} />

            <Box x={262} y={200} w={90} h={44} title="전령·군대" sub={drought ? "동원 흔들림" : "장인"} color={ADMIN} on={admin} />
            <Arrow x1={318} y1={174} x2={318} y2={198} color={ADMIN} on={admin} />

            <Box x={262} y={56} w={90} h={44} title="역참" color={ADMIN} on={relay || admin} />
            <Arrow x1={300} y1={126} x2={300} y2={102} color={ADMIN} on={relay || admin} />
            <path d="M 262 84 C 200 96, 150 120, 108 124" fill="none" stroke={ADMIN} strokeWidth={relay ? 1.25 : 1} strokeDasharray="4 3" opacity={relay ? 1 : 0.4} />
            <polygon points="106,124 113,120 113,128" fill={ADMIN} opacity={relay ? 1 : 0.4} />
            <Tag x={196} y={128} text="다음 이동·통치" color={ADMIN} />

            {conditions && (
              <g>
                <Tag x={8} y={172} text="목초지 회복" color={COND} anchor="start" />
                <Tag x={184} y={70} text="시장의 교환비" color={COND} />
                <Tag x={146} y={182} text="연합의 신뢰" color={COND} anchor="start" />
                <Tag x={196} y={142} text="안전한 통행" color={COND} />
              </g>
            )}
            {drought && (
              <g>
                <Tag x={8} y={170} text="여러 지역이" color={SHAKE} anchor="start" />
                <Tag x={8} y={184} text="함께 줄어듦" color={SHAKE} anchor="start" />
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
