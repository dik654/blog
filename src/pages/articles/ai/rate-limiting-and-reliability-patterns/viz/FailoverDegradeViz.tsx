import SceneShell from "./SceneShell";

/**
 * 본문 대응: #graceful-degradation-and-failover — 중복 구성(HA), 주 → 예비 failover와 전환 지연,
 * failover로도 전체 기능을 유지할 수 없을 때의 graceful degradation(개인화 추천 → 인기 항목).
 */
const W = 360;
const H = 170;
const SLATE = "#64748b";
const BLUE = "#2563eb";
const RED = "#dc2626";
const AMBER = "#d97706";

const SCENES = [
  { label: "평소 · 중복 구성", summary: "HA: 예비가 대기 중", note: "한 구성 요소가 죽어도 서비스가 계속 응답하게 하는 목표가 high availability(HA)이고, 같은 역할을 둘 이상 두는 중복 구성이 그 바탕입니다. 다만 중복만으로는 장애 때 자동으로 복구되지 않습니다. 트래픽을 실제로 옮기는 절차가 따로 있어야 합니다." },
  { label: "주 구성 요소 장애", summary: "전환 지연 동안 실패할 수 있음", note: "주 구성 요소가 죽은 뒤 트래픽을 옮기는 데에도 시간이 걸립니다. 그 사이 도착한 요청은 여전히 실패할 수 있습니다." },
  { label: "Failover 완료", summary: "예비가 트래픽을 받음", note: "대기 중이던 예비로 트래픽이 옮겨 갔습니다. 구성 요소 일부가 죽어도 시스템이 계속 정상 동작하는 능력을 fault tolerance라 하며, 이 장면이 그것이 작동한 모습입니다." },
  { label: "그래도 일부 기능이 죽으면", summary: "낮은 품질로라도 계속 응답", note: "Failover로도 전체 기능을 유지할 수 없을 때의 선택지가 graceful degradation입니다. 추천 기능이 죽으면 개인화 추천 대신 인기 항목 목록을 보여 주는 식으로 서비스를 멈추지 않습니다." },
] as const;

function Box({ x, y, w, h, label, sub, color, dashed = false, faded = false }: { x: number; y: number; w: number; h: number; label: string; sub?: string; color: string; dashed?: boolean; faded?: boolean }) {
  return (
    <g opacity={faded ? 0.5 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 4)} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={color}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize={10.5} fill={SLATE}>{sub}</text>}
    </g>
  );
}

function Link({ d, color, dashed = false }: { d: string; color: string; dashed?: boolean }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />;
}

export default function FailoverDegradeViz() {
  return (
    <SceneShell
      eyebrow="장애가 난 뒤"
      title="한 구성 요소가 죽으면 트래픽과 응답 내용이 차례로 바뀝니다"
      description="주 구성 요소는 평소 트래픽을 받는 쪽, 예비 구성 요소는 대기하는 쪽입니다. 오른쪽 칸은 사용자가 받는 응답입니다. 마지막 장면은 failover로도 전체 기능을 유지할 수 없는 경우이고, 추천 기능은 글의 예시입니다."
      ariaLabel="주 구성 요소 장애에서 failover를 거쳐 graceful degradation으로 이어지는 상태 변화"
      scenes={SCENES}
      render={(active) => {
        const primaryDead = active > 0;
        const onStandby = active >= 2;
        const degraded = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={8} y={58} w={62} h={40} label="트래픽" color={SLATE} />
            <Box x={112} y={14} w={104} h={50} label="주 구성 요소" sub={primaryDead ? "죽음" : "처리 중"} color={primaryDead ? RED : BLUE} dashed={primaryDead} />
            <Box x={112} y={92} w={104} h={50} label="예비 구성 요소" sub={degraded ? "추천 기능 죽음" : onStandby ? "처리 중" : "대기"} color={degraded ? AMBER : onStandby ? BLUE : SLATE} faded={!onStandby} />
            {active === 0 && <Link d="M70 70L112 44M216 39H258" color={BLUE} />}
            {active === 1 && (
              <>
                <Link d="M70 70L100 52" color={RED} dashed />
                <path d="M99 45L109 55M109 45L99 55" stroke={RED} strokeWidth={1.25} />
              </>
            )}
            {onStandby && <Link d="M70 86L112 112M216 117H258" color={BLUE} />}

            <rect x={258} y={30} width={94} height={96} rx={6} fill="none" stroke={active === 1 ? RED : degraded ? AMBER : BLUE} strokeWidth={1} strokeDasharray={active === 1 ? "4 3" : undefined} />
            <text x={305} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={SLATE}>응답</text>
            {active === 1 && <text x={305} y={82} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={RED}>실패할 수 있음</text>}
            {(active === 0 || active === 2) && (
              <>
                <text x={305} y={72} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={BLUE}>전체 기능</text>
                <text x={305} y={90} textAnchor="middle" fontSize={11} fill={SLATE}>개인화 추천</text>
              </>
            )}
            {degraded && (
              <>
                <text x={305} y={66} textAnchor="middle" fontSize={11} fill={SLATE} textDecoration="line-through">개인화 추천</text>
                <text x={305} y={84} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={AMBER}>인기 항목 목록</text>
                <text x={305} y={102} textAnchor="middle" fontSize={10.5} fill={SLATE}>낮은 품질로 응답</text>
              </>
            )}
            <text x={8} y={162} fontSize={12} fontWeight={700} fill={active === 1 ? RED : degraded ? AMBER : BLUE}>
              {["HA: 한 구성 요소가 죽어도 응답하려는 목표", "전환 지연: 트래픽을 옮기는 중", "Failover: 예비로 트래픽을 옮김", "Graceful degradation: 일부 기능을 줄임"][active]}
            </text>
          </svg>
        );
      }}
    />
  );
}
