import { Arrow, Box } from "./FlowParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 둘째 문단 — 장부와 실물을 한 사람이 쥘 때와 나눌 때.
 * 걷은 100, 손실 10 → 쓰임에 닿은 90 = 30 + 25 + 20 + 15. 90 / 100 = 90%.
 * 손실 10이 장부에서 빠진 경우는 '숨길 수 있다'를 보이려는 가정이다.
 */
const LEDGER = "#2563eb";
const GRAIN = "#16a34a";
const GAP = "#dc2626";

const SCENES = [
  { label: "한 사람이 장부와 실물을 쥐면", summary: "장부 100 · 실물 90", note: "3절의 손실 10자루가 생겼다고 해 봅니다. 계량·운송·기록을 한 담당자가 함께 쥐면 장부에 그대로 100을 적어 누락을 숨길 수 있습니다. 그러면 수도가 받아 보는 숫자는 100입니다(가정)." },
  { label: "계량·운송·감사를 나누면", summary: "차이 10이 드러날 수 있음", note: "걷은 양과 전달된 양을 다른 사람이 적고, 또 다른 사람이 맞춰 보면 차이 10이 보일 수 있습니다. 중앙이 더 잘 볼 수 있다는 것이지 누락이 사라진다는 뜻은 아닙니다." },
  { label: "대신 늘어나는 것", summary: "행정 비용·문서량 증가", note: "더 잘 보이는 대가로 사람과 문서가 늘어납니다. 그림의 3명·3권은 나눈 일의 가짓수이고(가정), 비용이 몇 자루인지는 글에 수치가 없어 적지 않았습니다." },
  { label: "총세입과 실제 전달률", summary: "90 / 100 = 90%", note: "가정 장부에서 걷은 100 가운데 쓰임에 닿은 것은 30 + 25 + 20 + 15 = 90입니다. 제국의 힘은 총세입과 실제 전달률 사이에서 결정됩니다." },
] as const;

function Figures({ count, x, y, color }: { count: number; x: number; y: number; color: string }) {
  return (
    <g>
      {Array.from({ length: count }, (_, index) => (
        <rect key={index} x={x + index * 22} y={y} width={16} height={22} rx={2} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1} />
      ))}
    </g>
  );
}

export default function LedgerVsGrainViz() {
  return (
    <SceneShell
      eyebrow="장부와 실물"
      title="장부의 100과 실제로 닿은 90이 언제 드러날까요"
      description="3절의 가정 장부로 그린 경우입니다. 숫자는 곡물 자루 수입니다."
      ariaLabel="한 담당자가 장부와 실물을 함께 쥘 때와 나눌 때 누락이 보이는 정도, 비용, 전달률"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && (
            <g>
              <rect x={56} y={6} width={190} height={178} rx={8} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
              <text x={151} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">한 담당자가 함께 쥠</text>
              <text x={96} y={42} textAnchor="middle" fontSize={10.5} fill="currentColor">걷을 때</text>
              <text x={206} y={42} textAnchor="middle" fontSize={10.5} fill="currentColor">닿은 뒤</text>
              <text x={8} y={72} fontSize={12} fontWeight={700} fill={LEDGER}>장부</text>
              <text x={8} y={142} fontSize={12} fontWeight={700} fill={GRAIN}>실물</text>
              <Box x={66} y={48} w={60} h={36} title="100" color={LEDGER} on />
              <Box x={176} y={48} w={60} h={36} title="100" color={LEDGER} on />
              <Arrow x1={128} y1={66} x2={174} y2={66} color={LEDGER} on />
              <Box x={66} y={118} w={60} h={36} title="100" color={GRAIN} on />
              <Box x={176} y={118} w={60} h={36} title="90" color={GRAIN} on />
              <Arrow x1={128} y1={136} x2={174} y2={136} color={GRAIN} on />
              <text x={151} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill={GAP}>10 사라짐</text>
              <Arrow x1={238} y1={66} x2={284} y2={66} color={LEDGER} on />
              <Box x={286} y={44} w={66} h={44} title="수도" sub="100으로 봄" on />
            </g>
          )}
          {active === 1 && (
            <g>
              <Box x={6} y={14} w={104} h={52} title="계량 담당" sub="걷은 양 100" color={LEDGER} on />
              <Box x={6} y={124} w={104} h={52} title="운송 담당" sub="전달된 양 90" color={GRAIN} on />
              <Box x={136} y={69} w={88} h={52} title="감사 담당" sub="둘을 맞춰 봄" color={GAP} on />
              <Box x={244} y={69} w={112} h={52} title="수도" sub="차이 10을 볼 수 있음" on />
              <Arrow x1={112} y1={40} x2={134} y2={84} color={LEDGER} on />
              <Arrow x1={112} y1={150} x2={134} y2={106} color={GRAIN} on />
              <Arrow x1={226} y1={95} x2={242} y2={95} color={GAP} on />
            </g>
          )}
          {active === 2 && (
            <g>
              <text x={92} y={32} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">나누기 전</text>
              <text x={268} y={32} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">나눈 뒤</text>
              <line x1={180} x2={180} y1={18} y2={176} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
              <text x={14} y={72} fontSize={11} fill="currentColor">담당</text>
              <text x={14} y={122} fontSize={11} fill="currentColor">장부</text>
              <Figures count={1} x={60} y={56} color="#64748b" />
              <Figures count={1} x={60} y={106} color={LEDGER} />
              <text x={196} y={72} fontSize={11} fill="currentColor">담당</text>
              <text x={196} y={122} fontSize={11} fill="currentColor">장부</text>
              <Figures count={3} x={236} y={56} color="#64748b" />
              <Figures count={3} x={236} y={106} color={LEDGER} />
              <text x={268} y={162} textAnchor="middle" fontSize={11} fontWeight={700} fill={GAP}>행정 비용·문서량 늘어남</text>
            </g>
          )}
          {active === 3 && (
            <g>
              <text x={8} y={50} fontSize={12} fontWeight={700} fill="currentColor">총세입</text>
              <rect x={64} y={36} width={260} height={22} rx={3} fill={LEDGER} fillOpacity={0.3} stroke={LEDGER} strokeWidth={1} />
              <text x={330} y={52} fontSize={12} fontWeight={700} fill="currentColor">100</text>
              <text x={8} y={102} fontSize={12} fontWeight={700} fill="currentColor">전달</text>
              <rect x={64} y={88} width={234} height={22} rx={3} fill={GRAIN} fillOpacity={0.3} stroke={GRAIN} strokeWidth={1} />
              <rect x={298} y={88} width={26} height={22} rx={3} fill="none" stroke={GAP} strokeWidth={1} strokeDasharray="3 2" />
              <text x={330} y={104} fontSize={12} fontWeight={700} fill="currentColor">90</text>
              <text x={311} y={130} textAnchor="middle" fontSize={11} fontWeight={700} fill={GAP}>손실 10</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
