import SceneShell from "./SceneShell";

/** 본문 대응: #comparison — 달러 지급은 같고 통화 제도에 따라 볼 곳이 다르다. 금액은 3절의 가정, 제도 설명은 본문의 범위만. */
const LANES = [
  { head: "원화 수입 회사 (3절 가정)", line1: "환율이 1000원 → 1200원으로 움직임", line2: "갚을 원화 금액이 바뀜" },
  { head: "유로 수입 회사", line1: "유로·달러 비율은 여전히 중요", line2: "회원국 단독 금리 변경은 가정 못 함" },
  { head: "연계환율제 아래 회사 (홍콩)", line1: "달러 비율을 정해진 범위에서 유지", line2: "은행 자금·금리 조정 경로를 함께 봄" },
] as const;

const SCENES = [
  { label: "원화 변동 가정", summary: "움직이는 것: 환율", note: "3절의 가정입니다. 교환 비율이 움직여서 같은 달러 빚을 갚는 데 필요한 원화가 달라집니다." },
  { label: "유로 지역", summary: "금리 권한: 공동 체계", note: "회원국의 통화정책 권한이 공동 체계로 이전되어 있어, 회사가 속한 나라의 독립 금리 변경을 가정할 수 없습니다. 달러 지급 부담은 여전히 집니다." },
  { label: "홍콩", summary: "환율 움직임: 제한", note: "환율 움직임이 제한되는 대신 은행 자금과 금리의 조정 경로를 함께 봐야 합니다. 원화가 움직이는 가정과 다른 정책 반응입니다." },
  { label: "같은 빚, 다른 조정 경로", summary: "나라 이름보다 제도와 장부", note: "세 경우 모두 달러를 갚아야 하지만 조정이 보이는 자리가 다릅니다. 어느 쪽이 더 안전한지를 비교한 그림은 아닙니다." },
] as const;

const LANE_H = 62;
const LANE_W = 262;
const laneY = (i: number) => 4 + i * (LANE_H + 6);

export default function RegimeLanesViz() {
  return (
    <SceneShell
      eyebrow="같은 달러 빚, 세 제도"
      title="달러 지급은 같아도 조정을 살필 자리가 다릅니다"
      description="오른쪽의 1억 달러 지급은 세 줄 모두 같은 가정입니다. 왼쪽은 본문이 말한 범위까지만 적었습니다."
      ariaLabel="원화 변동, 유로 지역, 홍콩 연계환율제에서 같은 달러 빚의 조정 경로 비교"
      scenes={SCENES}
      render={(active) => {
        const isLit = (i: number) => active === 3 || active === i;
        return (
          <svg viewBox="0 0 360 208" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={290} y={4} width={64} height={198} rx={6} fill="#64748b" fillOpacity={0.12} stroke="#64748b" strokeWidth={1} />
            <text x={322} y={92} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">달러 지급</text>
            <text x={322} y={110} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">1억 달러</text>
            {LANES.map((lane, i) => {
              const lit = isLit(i);
              const y = laneY(i);
              const mid = y + LANE_H / 2;
              return (
                <g key={lane.head} opacity={lit ? 1 : 0.3} className="transition-opacity duration-300 motion-reduce:transition-none">
                  <rect x={6} y={y} width={LANE_W} height={LANE_H} rx={6} fill={lit ? "#2563eb" : "none"} fillOpacity={lit ? 0.08 : 0} stroke={lit ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  <text x={16} y={y + 19} fontSize={11} fontWeight={700} className="fill-foreground">{lane.head}</text>
                  <text x={16} y={y + 36} fontSize={10.5} className="fill-foreground">{lane.line1}</text>
                  <text x={16} y={y + 52} fontSize={10.5} fill="#b45309">{lane.line2}</text>
                  <line x1={6 + LANE_W} x2={284} y1={mid} y2={mid} stroke={lit ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  <path d={`M284,${mid - 3.5} L290,${mid} L284,${mid + 3.5} Z`} fill={lit ? "#2563eb" : "#94a3b8"} />
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
