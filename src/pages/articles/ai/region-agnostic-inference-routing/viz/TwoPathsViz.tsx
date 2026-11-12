import StackedSceneShell from "./StackedSceneShell";

/**
 * 본문 대응: two-paths 절 — 요청 경로와 결정 경로를 가르면 컨트롤러가 죽어도 요청은 흐르고,
 * 요청 경로 안에 무엇을 더 넣으면 그것이 곧 장애 의존성이 된다.
 */
const SCENES = [
  {
    label: "두 길이 따로 있습니다",
    summary: "요청: 밀리초 · 결정: 15분마다",
    note: "요청은 게이트웨이를 지나 클러스터의 파드로 갑니다. 어느 리전에 어떤 모델을 몇 개 띄울지는 컨트롤러가 15분에 한 번 다시 계산해 설정으로 밀어 넣을 뿐, 요청이 지나는 길에 서 있지 않습니다. 모델 선택기도 처음에는 게이트웨이 안의 논리 모듈로 둡니다.",
  },
  {
    label: "컨트롤러가 죽으면",
    summary: "요청 정상 · 배치 갱신만 멈춤",
    note: "게이트웨이는 마지막으로 받은 설정으로 요청을 계속 보냅니다. 멈추는 것은 배치 갱신뿐이고, 그래서 갱신이 멈춘 것을 알아차릴 관측이 따로 필요합니다.",
  },
  {
    label: "DB가 요청 경로 안에 있으면",
    summary: "DB 장애 = 라우팅 전체 정지",
    note: "라우팅 메타데이터를 담은 데이터베이스를 요청마다 거치게 두면, 그 데이터베이스가 죽는 순간 라우팅 전체가 멈춥니다. 글이 사고 기록으로 남아 있다고 적는 경우입니다. 요청 경로에 있는 것은 전부 장애 의존성입니다.",
  },
  {
    label: "선택기를 별도 서비스로 떼면",
    summary: "네트워크 왕복 +1 · 장애 의존성 +1",
    note: "모델 선택기를 게이트웨이 밖의 서비스로 만들면 요청마다 그 서비스에 다녀와야 합니다. 요청 경로에 네트워크 왕복과 장애 의존성이 하나씩 늘어나므로, 처음에는 게이트웨이 안에 둡니다.",
  },
];

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";
const INK = "#64748b";

const STATUS = [
  { text: "컨트롤러는 요청이 지나는 길 밖에 있습니다", color: INK },
  { text: "갱신만 멈추고 요청은 계속 흐릅니다", color: OK },
  { text: "DB가 멈추면 라우팅 전체가 멈춥니다", color: WARN },
  { text: "왕복 하나, 장애 의존성 하나가 늘어납니다", color: WARN },
];

const GW_SUB = ["선택기 · 내부 모듈", "마지막 설정으로 동작", "선택기 · 내부 모듈", "선택기를 밖으로 뗌"];

function Box({ x, y, w, h, color, dashed = false }: { x: number; y: number; w: number; h: number; color: string; dashed?: boolean }) {
  return (
    <rect x={x} y={y} width={w} height={h} rx={4} fill={color} fillOpacity={0.1} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
  );
}

export default function TwoPathsViz() {
  return (
    <StackedSceneShell
      eyebrow="요청 경로와 결정 경로"
      title="컨트롤러는 요청이 지나는 길에 서 있지 않습니다"
      description="위 줄은 요청 하나마다 지나가는 길, 아래 줄은 주기적으로 계산해 설정을 밀어 넣는 길입니다. 컨트롤러는 어느 리전에 어떤 모델을 몇 개 띄울지 계산하는 쪽입니다."
      note="길의 개수와 상자 크기는 구조를 보이려는 그림이며, 특정 배포의 구성도가 아닙니다."
      ariaLabel="요청 경로와 결정 경로를 나눴을 때 각 장애가 요청에 미치는 영향"
      scenes={SCENES}
      render={(s) => {
        const ctrlDown = s === 1;
        const dbInPath = s === 2;
        const selectorOut = s === 3;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[s].label}: ${STATUS[s].text}`}>
            <text x={6} y={14} fontSize={10.5} fontWeight={700} fill={ACCENT}>
              요청 경로 · 요청마다 · 밀리초
            </text>

            <Box x={6} y={24} w={50} h={40} color={INK} />
            <text x={31} y={48} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK}>요청</text>

            <line x1={56} y1={44} x2={78} y2={44} stroke={OK} strokeWidth={1.25} />

            <Box x={78} y={24} w={110} h={40} color={ACCENT} />
            <text x={133} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>게이트웨이</text>
            <text x={133} y={56} textAnchor="middle" fontSize={10} fill={selectorOut ? WARN : INK}>{GW_SUB[s]}</text>

            {dbInPath ? (
              <>
                <line x1={188} y1={44} x2={204} y2={44} stroke={OK} strokeWidth={1.25} />
                <Box x={204} y={24} w={58} h={40} color={WARN} />
                <text x={233} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={WARN}>메타데이터</text>
                <text x={233} y={56} textAnchor="middle" fontSize={10} fontWeight={700} fill={WARN}>DB · 멈춤</text>
                <line x1={262} y1={44} x2={276} y2={44} stroke={WARN} strokeWidth={1.25} strokeDasharray="3 2" />
                <text x={269} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill={WARN}>×</text>
              </>
            ) : (
              <line x1={188} y1={44} x2={276} y2={44} stroke={OK} strokeWidth={1.25} />
            )}

            <Box x={276} y={24} w={78} h={40} color={dbInPath ? WARN : INK} />
            <text x={315} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill={dbInPath ? WARN : INK}>클러스터</text>
            <text x={315} y={56} textAnchor="middle" fontSize={10} fill={dbInPath ? WARN : INK}>{dbInPath ? "요청 안 옴" : "파드"}</text>

            {selectorOut && (
              <>
                <polyline points="178,64 178,93 222,93" fill="none" stroke={WARN} strokeWidth={1} strokeDasharray="3 2" />
                <Box x={222} y={78} w={92} h={30} color={WARN} dashed />
                <text x={268} y={97} textAnchor="middle" fontSize={10} fontWeight={700} fill={WARN}>선택기 서비스</text>
                <text x={184} y={88} fontSize={10} fill={WARN}>왕복</text>
              </>
            )}

            <line x1={160} y1={64} x2={160} y2={142} stroke={ctrlDown ? MUTED : ACCENT} strokeWidth={1} strokeDasharray="4 3" opacity={ctrlDown ? 0.4 : 1} />
            <text x={154} y={100} textAnchor="end" fontSize={10} fill={ctrlDown ? MUTED : ACCENT}>설정 밀어 넣기</text>
            {ctrlDown && (
              <text x={166} y={100} fontSize={11} fontWeight={700} fill={WARN}>×</text>
            )}

            <line x1={6} y1={118} x2={354} y2={118} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.6} />
            <text x={6} y={134} fontSize={10.5} fontWeight={700} fill={INK}>
              결정 경로 · 15분에 한 번
            </text>

            <Box x={78} y={142} w={110} h={34} color={ctrlDown ? WARN : INK} />
            <text x={133} y={157} textAnchor="middle" fontSize={11} fontWeight={700} fill={ctrlDown ? WARN : INK}>
              {ctrlDown ? "컨트롤러 · 멈춤" : "컨트롤러"}
            </text>
            <text x={133} y={170} textAnchor="middle" fontSize={10} fill={INK}>배치·가중치 계산</text>

            <text x={6} y={194} fontSize={10.5} fontWeight={700} fill={STATUS[s].color}>
              {STATUS[s].text}
            </text>
          </svg>
        );
      }}
    />
  );
}
