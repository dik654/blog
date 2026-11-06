import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 셋째 문단(#case 둘째 문단의 중간값 포함) — 같은 칸을 쓰는 두 거래와 별도 칸을 쓰는 두 거래.
 * 100−10=90, 90+5=95 / X: 100−10=90, Y: 50+5=55.
 */
const W = 360;
const H = 140;

function Node({ x, y, w = 72, label, tone }: { x: number; y: number; w?: number; label: string; tone: "value" | "tx" | "ghost" }) {
  const stroke = tone === "tx" ? "#2563eb" : "#94a3b8";
  return (
    <g>
      <rect x={x} y={y} width={w} height={34} rx={6} fill={tone === "tx" ? "#2563eb" : "none"} fillOpacity={tone === "tx" ? 0.1 : 0} stroke={stroke} strokeWidth={1} strokeDasharray={tone === "ghost" ? "3 3" : undefined} />
      <text x={x + w / 2} y={y + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">{label}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color = "#64748b", dash }: { x1: number; y1: number; x2: number; y2: number; color?: string; dash?: string }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a = 6;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} strokeDasharray={dash} />
      <path d={`M${x2},${y2} L${x2 - a * Math.cos(angle - 0.45)},${y2 - a * Math.sin(angle - 0.45)} L${x2 - a * Math.cos(angle + 0.45)},${y2 - a * Math.sin(angle + 0.45)} Z`} fill={color} />
    </g>
  );
}

const SCENES = [
  { label: "같은 칸을 쓰는 원래 사례", summary: "T2의 입력 = T1의 결과", note: "T2는 처음 값 100이 아니라 T1 뒤의 90에 5를 더합니다. T2가 100을 읽어 105를 제출하면 앞 거래를 반영하지 않은 오류입니다." },
  { label: "중간값 90을 안다면", summary: "나눌 여지가 생깁니다", note: "같은 칸을 쓰더라도 중간값 90을 알면 준비와 검증을 나눌 여지가 생깁니다. 다만 그 90이 맞는지가 T2 쪽 결과의 전제이므로 의존성을 관리해야 합니다." },
  { label: "별도 칸을 쓰는 경우", summary: "X=90 · Y=55", note: "T2가 별도 칸 Y=50에 5를 더하면 저장 칸 기준 결과는 X=90·Y=55입니다. 두 거래 사이의 저장 칸 의존이 없어 독립 작업을 찾기 쉽습니다." },
  { label: "생략했던 공유 상태", summary: "그림의 독립이 전부는 아닙니다", note: "실제 병렬성에는 공통 수수료 수령 계정 등 이 사례에서 생략한 상태도 영향을 줍니다. 그래서 칸이 다르다고 곧바로 두 배 빠르다고 말할 수 없습니다." },
] as const;

export default function SlotDependencyViz() {
  return (
    <SceneShell
      eyebrow="의존성"
      title="두 거래가 같은 칸을 쓰는지가 나눌 수 있는 일을 바꿉니다"
      description="네모는 저장 값, 파란 네모는 거래, 화살표는 값이 넘어가는 길입니다. 수치는 3절과 9절의 가정입니다."
      ariaLabel="같은 저장 칸을 쓰는 두 거래와 별도 칸을 쓰는 두 거래의 의존 관계"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && (
            <>
              <Node x={4} y={52} w={62} label="X=100" tone="value" />
              <Arrow x1={66} y1={69} x2={82} y2={69} />
              <Node x={82} y={52} w={46} label="T1" tone="tx" />
              <Arrow x1={128} y1={69} x2={144} y2={69} />
              <Node x={144} y={52} w={56} label="X=90" tone="value" />
              <Arrow x1={200} y1={69} x2={216} y2={69} color="#dc2626" />
              <Node x={216} y={52} w={46} label="T2" tone="tx" />
              <Arrow x1={262} y1={69} x2={278} y2={69} />
              <Node x={278} y={52} w={62} label="X=95" tone="value" />
              <text x={208} y={40} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">이 값이 T2의 입력</text>
            </>
          )}
          {active === 1 && (
            <>
              <text x={4} y={16} fontSize={12} fontWeight={700} fill="#2563eb">T1 쪽 검증</text>
              <Node x={4} y={24} w={62} label="X=100" tone="value" />
              <Arrow x1={66} y1={41} x2={82} y2={41} />
              <Node x={82} y={24} w={46} label="T1" tone="tx" />
              <Arrow x1={128} y1={41} x2={144} y2={41} />
              <Node x={144} y={24} w={56} label="X=90" tone="value" />
              <text x={4} y={92} fontSize={12} fontWeight={700} fill="#2563eb">T2 쪽 검증</text>
              <Node x={144} y={100} w={56} label="X=90" tone="ghost" />
              <Arrow x1={200} y1={117} x2={216} y2={117} />
              <Node x={216} y={100} w={46} label="T2" tone="tx" />
              <Arrow x1={262} y1={117} x2={278} y2={117} />
              <Node x={278} y={100} w={62} label="X=95" tone="value" />
              <Arrow x1={172} y1={58} x2={172} y2={100} color="#dc2626" dash="3 3" />
              <text x={180} y={84} fontSize={12} fontWeight={700} fill="#dc2626">이 90이 맞아야 함</text>
            </>
          )}
          {active >= 2 && (
            <>
              <Node x={24} y={8} w={62} label="X=100" tone="value" />
              <Arrow x1={86} y1={25} x2={120} y2={25} />
              <Node x={120} y={8} w={60} label="T1" tone="tx" />
              <Arrow x1={180} y1={25} x2={214} y2={25} />
              <Node x={214} y={8} w={62} label="X=90" tone="value" />
              <Node x={24} y={62} w={62} label="Y=50" tone="value" />
              <Arrow x1={86} y1={79} x2={120} y2={79} />
              <Node x={120} y={62} w={60} label="T2" tone="tx" />
              <Arrow x1={180} y1={79} x2={214} y2={79} />
              <Node x={214} y={62} w={62} label="Y=55" tone="value" />
              {active === 2 && <text x={150} y={122} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">두 줄 사이에 저장 칸 화살표 없음</text>}
              {active === 3 && (
                <>
                  <rect x={288} y={8} width={68} height={88} rx={6} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
                  <text x={322} y={46} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">공통 수수료</text>
                  <text x={322} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">수령 계정</text>
                  <line x1={150} y1={42} x2={150} y2={62} stroke="#d97706" strokeWidth={1.25} strokeDasharray="3 3" />
                  <Arrow x1={150} y1={52} x2={288} y2={52} color="#d97706" dash="3 3" />
                  <text x={150} y={122} textAnchor="middle" fontSize={12} fill="#b45309">생략한 상태도 영향을 줌</text>
                </>
              )}
            </>
          )}
        </svg>
      )}
    />
  );
}
