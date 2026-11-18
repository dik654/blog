import { Arrow, Box } from "./FlowParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 첫 문단(과 #black-box 첫 문단의 여름 고지·겨울 저지 경로).
 * 약도다. 위치·거리·집단 수는 설명용 가정이며, 막히는 지점과 생존 변화의 크기는 글에 없다.
 */
const ROUTE = "#2563eb";
const DEAL = "#7c3aed";
const FENCE = "#64748b";
const CUT = "#dc2626";

const SCENES = [
  { label: "계절마다 다른 풀밭을 씁니다", summary: "여름 고지 ↔ 겨울 저지", note: "여름에는 높은 풀밭, 겨울에는 바람을 피할 낮은 목초지를 씁니다. 한곳에 오래 두면 풀과 물이 빠르게 줄기 때문입니다. 위치와 거리는 설명용 약도입니다(가정)." },
  { label: "누가 어느 계절에 쓰는지 정합니다", summary: "관습과 협상", note: "계절 목초지는 가구·씨족·정치 연합의 관습과 협상으로 나눌 수 있습니다. 그림의 두 집단은 '여럿이 나눠 쓴다'를 보이려는 가정입니다." },
  { label: "현대식 토지 경계와 비교합니다", summary: "한 사람 · 모든 계절 · 배타적", note: "현대식 토지 경계는 울타리 친 한 땅을 한 사람이 모든 계절에 배타적으로 쓰는 소유권입니다. 계절 목초지의 권리는 땅 한 장보다 언제 어느 길로 갈 수 있는지에 가깝습니다." },
  { label: "가뭄·전쟁이 경로를 막으면", summary: "가축 수는 그대로, 생존 가능성은 달라짐", note: "길이 막히면 겨울 목초지에 닿지 못할 수 있습니다. 무리의 가축 수가 같아도 생존 가능성이 달라지는 이유입니다. 얼마나 달라지는지는 글에 수치가 없어 크기로 그리지 않았습니다." },
] as const;

function Herd({ x, y, on }: { x: number; y: number; on: boolean }) {
  return (
    <g opacity={on ? 1 : 0.5}>
      {[0, 1, 2, 3].map((index) => (
        <circle key={index} cx={x + (index % 2) * 10} cy={y + Math.floor(index / 2) * 9} r={3.5} fill={ROUTE} fillOpacity={0.3} stroke={ROUTE} strokeWidth={1} />
      ))}
    </g>
  );
}

function RouteMap({ active }: { active: number }) {
  const deal = active === 1;
  const cut = active === 3;
  return (
    <svg viewBox="0 0 360 220" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <Box x={196} y={10} w={156} h={46} title="여름 · 높은 풀밭" sub="고지" color={ROUTE} on={active === 0 || deal} />
      <Box x={8} y={164} w={156} h={46} title="겨울 · 낮은 목초지" sub="바람을 피하는 저지" color={ROUTE} on={active === 0 || deal || cut} />

      <path d="M 196 46 C 120 70, 200 130, 120 162" fill="none" stroke={ROUTE} strokeWidth={1.25} strokeDasharray="5 3" opacity={cut ? 0.45 : 1} />
      <Arrow x1={128} y1={152} x2={118} y2={162} color={ROUTE} on={!cut} />
      <Arrow x1={185} y1={49.5} x2={195} y2={46.5} color={ROUTE} on={!cut} />
      <text x={190} y={112} fontSize={11.5} fontWeight={600} fill={ROUTE}>계절 경로</text>
      <Herd x={cut ? 158 : 150} y={cut ? 64 : 92} on />

      {deal && (
        <g>
          <text x={274} y={74} textAnchor="middle" fontSize={11} fontWeight={700} fill={DEAL}>집단 가·나 (가정)</text>
          <text x={274} y={88} textAnchor="middle" fontSize={10.5} fill="currentColor">관습·협상으로 나눔</text>
          <text x={86} y={152} textAnchor="middle" fontSize={11} fontWeight={700} fill={DEAL}>집단 가·나 (가정)</text>
          <text x={190} y={127} fontSize={10.5} fill="currentColor">통행도 협상</text>
        </g>
      )}

      {cut && (
        <g>
          <g stroke={CUT} strokeWidth={1.25}>
            <line x1={160} y1={110} x2={176} y2={126} />
            <line x1={160} y1={126} x2={176} y2={110} />
          </g>
          <text x={184} y={140} fontSize={11.5} fontWeight={700} fill={CUT}>가뭄·전쟁으로 막힘</text>
          <text x={184} y={155} fontSize={10.5} fill="currentColor">겨울 목초지에 못 닿을 수 있음</text>
          <text x={176} y={72} fontSize={10.5} fill="currentColor">무리: 가축 수 그대로</text>
        </g>
      )}
    </svg>
  );
}

function Compare() {
  return (
    <svg viewBox="0 0 360 220" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[2].label}: ${SCENES[2].summary}`}>
      <text x={90} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">현대식 토지 경계</text>
      <rect x={24} y={34} width={132} height={110} rx={4} fill={FENCE} fillOpacity={0.1} stroke={FENCE} strokeWidth={1.25} />
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <line key={index} x1={24 + index * 26.4} y1={30} x2={24 + index * 26.4} y2={38} stroke={FENCE} strokeWidth={1} />
      ))}
      <text x={90} y={84} textAnchor="middle" fontSize={11.5} fontWeight={600} fill="currentColor">한 사람</text>
      <text x={90} y={100} textAnchor="middle" fontSize={10.5} fill="currentColor">봄·여름·가을·겨울</text>
      <text x={90} y={116} textAnchor="middle" fontSize={10.5} fill="currentColor">배타적으로 씀</text>
      <text x={90} y={170} textAnchor="middle" fontSize={10.5} fill="currentColor">권리 = 땅 한 장</text>

      <text x={270} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">계절 목초지</text>
      <Box x={204} y={34} w={132} h={36} title="여름 고지" color={ROUTE} on />
      <Box x={204} y={108} w={132} h={36} title="겨울 저지" color={ROUTE} on />
      <Arrow x1={270} y1={72} x2={270} y2={106} color={ROUTE} on dashed />
      <Arrow x1={286} y1={106} x2={286} y2={72} color={ROUTE} on dashed />
      <text x={270} y={170} textAnchor="middle" fontSize={10.5} fill="currentColor">권리 = 언제·어느 길로</text>
      <text x={270} y={186} textAnchor="middle" fontSize={10.5} fill="currentColor">갈 수 있는지 (관습·협상)</text>
    </svg>
  );
}

export default function SeasonalRouteViz() {
  return (
    <SceneShell
      eyebrow="목초지 접근"
      title="목초지 권리는 땅 한 장보다 경로에 달렸습니다"
      description="계절 이동을 단순하게 그린 약도입니다(가정). 칸의 위치와 선 길이는 실제 지형이나 거리를 뜻하지 않습니다."
      ariaLabel="여름 고지와 겨울 저지를 잇는 계절 경로, 관습과 협상에 따른 사용, 현대식 소유권과의 차이, 경로가 막힐 때의 변화"
      scenes={SCENES}
      render={(active) => (active === 2 ? <Compare /> : <RouteMap active={active} />)}
    />
  );
}
