import { FlowArrow, FlowBox } from "./FlowParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 둘째 문단. 1875→1312.5는 −30%.
 * 인정 비율 50%는 그림용 가정이고 어떤 비율이든 같은 30%입니다: 937.5→656.25(−281.25).
 * 강제 매각과 추가 매도는 "이 가격을 담보로 쓰고 대출자가 재평가한다"는 조건 아래의 가능성입니다.
 */
const SCENES = [
  { label: "전망을 낮추면", summary: "1875 → 1312.5 · 30% 감소", note: "요구 수익률 8%에 그대로 두고 매년 현금 전망만 150에서 105로 낮춘 값입니다. 점선 칸이 줄어든 562.5입니다." },
  { label: "같은 인정 비율이면", summary: "937.5 → 656.25 · 역시 30%", note: "인정 비율은 담보 가치 가운데 빌려줄 수 있다고 보는 비율입니다. 여기서는 50%로 그렸지만(가정) 비율이 같게 유지되면 얼마이든 빌릴 수 있는 돈도 30% 줄어듭니다." },
  { label: "조건이 맞을 때 이어지는 길", summary: "담보·재평가 → 강제 매각 가능", note: "이 가격을 실제로 담보로 쓰고 대출자가 재평가할 때 이어질 수 있는 경로입니다. 자금 축소가 추가 매도를 부르면 앞으로 돌아가는 고리가 됩니다." },
] as const;

const X0 = 12;
const SCALE = 336 / 1875;
const BLUE = "#2563eb";
const RED = "#dc2626";
const GRAY = "#64748b";

function ValueRow({ y, label, value, showLoan }: { y: number; label: string; value: number; showLoan: boolean }) {
  const width = value * SCALE;
  return (
    <g>
      <text x={X0} y={y - 6} fontSize={12} fontWeight={700} fill={GRAY}>{label} · 가치 {value}</text>
      <rect x={X0} y={y} width={width} height={30} fill="#64748b" opacity={0.28} />
      {value < 1875 && <rect x={X0 + width} y={y} width={(1875 - value) * SCALE} height={30} fill="none" stroke={RED} strokeWidth={1} strokeDasharray="4 3" />}
      {showLoan && (
        <>
          <rect x={X0} y={y} width={width * 0.5} height={30} fill={BLUE} opacity={0.8} />
          <text x={X0 + 8} y={y + 20} fontSize={12} fontWeight={700} fill="#ffffff">빌릴 돈 {value * 0.5}</text>
        </>
      )}
    </g>
  );
}

export default function CollateralChainViz() {
  return (
    <SceneShell
      eyebrow="담보로 이어지는 통로"
      title="평가가 담보로 쓰이고 재평가되면 하락이 자금 축소로 번질 수 있습니다"
      description="막대 두 줄은 같은 축척입니다. 금액은 이 글의 가정값이고, 마지막 장면의 경로는 조건부 가능성입니다."
      ariaLabel="평가 하락이 인정 비율을 거쳐 빌릴 수 있는 돈과 강제 매각으로 이어지는 조건부 경로"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 186" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 2 ? (
            <>
              <ValueRow y={26} label="전망 매년 150" value={1875} showLoan={active === 1} />
              <ValueRow y={104} label="전망 매년 105" value={1312.5} showLoan={active === 1} />
              {active === 0 && <text x={X0 + 1312.5 * SCALE + (562.5 * SCALE) / 2} y={124} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>−562.5</text>}
              {active === 1 && <text x={X0} y={160} fontSize={12} fontWeight={700} fill={BLUE}>인정 비율 50%(가정)</text>}
            </>
          ) : (
            <>
              <FlowBox x={38} y={6} w={106} h={40} lines={["담보 가격 하락", "1875 → 1312.5"]} color={GRAY} />
              <FlowBox x={166} y={6} w={186} h={40} lines={["이 가격을 담보로 쓰고", "대출자가 재평가하나?"]} color={RED} dashed />
              <FlowArrow points={[[144, 26], [166, 26]]} color={GRAY} />
              <FlowArrow points={[[186, 46], [186, 60], [120, 60], [120, 72]]} color={GRAY} />
              <FlowBox x={56} y={72} w={136} h={38} lines={["아니오: 이 경로 아님"]} color={GRAY} />
              <FlowArrow points={[[300, 46], [300, 72]]} color={BLUE} />
              <text x={308} y={64} fontSize={12} fontWeight={700} fill={BLUE}>예</text>
              <FlowBox x={210} y={72} w={142} h={38} lines={["같은 인정 비율이면", "빌릴 돈 30% 감소"]} color={BLUE} />
              <FlowArrow points={[[300, 110], [300, 130]]} color={BLUE} dashed />
              <FlowBox x={210} y={130} w={142} h={44} lines={["강제 매각이", "이어질 수 있음"]} color={BLUE} />
              <FlowArrow points={[[210, 152], [192, 152]]} color={BLUE} dashed />
              <FlowBox x={38} y={130} w={154} h={44} lines={["추가 매도가", "하락을 키울 수 있음"]} color={BLUE} />
              <FlowArrow points={[[38, 152], [18, 152], [18, 26], [38, 26]]} color={BLUE} dashed />
            </>
          )}
        </svg>
      )}
    />
  );
}
