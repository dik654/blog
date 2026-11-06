import SceneShell from "./SceneShell";
import { Arrow, Box } from "./SvgParts";

/**
 * 본문 대응: #source — 같은 운용 손실이 DC와 DB에서 지나가는 경로.
 * DC 적립금 1000만 → 900만은 본문의 가정입니다. DB의 금액은 본문에 없어 적지 않습니다.
 */
const SCENES = [
  { label: "DC(확정기여)", summary: "1000만 → 900만 원", note: "계좌 적립액과 운용 결과가 중심입니다. 가정한 적립금이 900만 원으로 줄면 미래 지급 재원이 그대로 줄어듭니다." },
  { label: "DB(확정급여)", summary: "약속한 급여는 산식대로", note: "산식으로 약속한 급여가 중심이라 같은 운용 손실만큼 자동으로 줄지는 않습니다. 대신 적립 부족과 지급 주체의 건전성을 봐야 합니다." },
  { label: "두 경로를 나란히", summary: "내 계좌 대 적립 부족", note: "DC에서는 손실이 계좌 적립액을 바로 줄입니다. DB에서는 약속한 급여가 자동으로 줄지 않는 대신 적립 부족과 지급 주체의 건전성이 질문으로 남습니다." },
] as const;

const ACCENT = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const MUTED = "#94a3b8";

export default function DcDbLossViz() {
  return (
    <SceneShell
      eyebrow="연금의 손실 경로"
      title="같은 운용 손실이 DC와 DB에서 어디로 가는지 봅니다"
      description="위 줄이 DC, 아래 줄이 DB입니다. 왼쪽의 운용 손실이 화살표를 따라 어디에 닿는지 봅니다."
      note="금액은 설명용 가정이며 미국 노동부(DOL)의 DB·DC 구분을 따라 읽은 것입니다."
      ariaLabel="운용 손실이 DC 계좌와 DB 지급 주체에 미치는 경로 비교"
      scenes={SCENES}
      render={(active) => {
        const dc = active !== 1;
        const db = active !== 0;
        return (
          <svg viewBox="0 0 340 176" className="mx-auto h-auto w-full max-w-[540px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <g opacity={dc ? 1 : 0.28}>
              <text x={0} y={14} fontSize={12} fontWeight={700} fill={ACCENT}>DC</text>
              <Box x={0} y={22} w={88} h={52} lines={["운용 손실"]} tone={RED} />
              <Arrow x1={88} y1={48} x2={122} y2={48} tone={RED} />
              <Box x={124} y={22} w={98} h={52} lines={["계좌 적립액", "1000만 → 900만"]} tone={ACCENT} />
              <Arrow x1={222} y1={48} x2={250} y2={48} tone={RED} />
              <Box x={252} y={22} w={88} h={52} lines={["미래 지급", "재원 감소"]} tone={RED} />
            </g>
            <g opacity={db ? 1 : 0.28}>
              <text x={0} y={102} fontSize={12} fontWeight={700} fill={AMBER}>DB</text>
              <Box x={0} y={110} w={88} h={58} lines={["같은", "운용 손실"]} tone={RED} />
              <Arrow x1={88} y1={139} x2={122} y2={139} tone={RED} />
              <Box x={124} y={110} w={98} h={58} lines={["적립 부족", "지급 주체 건전성"]} tone={AMBER} />
              <line x1={222} y1={139} x2={250} y2={139} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
              <Box x={252} y={110} w={88} h={58} lines={["약속한 급여", "자동 감소 아님"]} tone={MUTED} />
            </g>
          </svg>
        );
      }}
    />
  );
}
