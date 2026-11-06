import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tool-use-loop — c1·c2·c3 결과가 다른 순서로 와도 각 ID에 붙고, 거부도 그 ID에 남는다.
 * 줄 하나가 호출 하나다. 도착 순서(부산 먼저)는 본문의 가정이며 시각은 정하지 않았다.
 */
const ROWS = [
  { id: "c1", city: "서울" },
  { id: "c2", city: "부산" },
  { id: "c3", city: "제주" },
] as const;

/** 장면별로 각 줄 칸에 들어갈 결과. 빈 문자열은 아직 결과 없음 */
const RESULTS: readonly (readonly string[])[] = [
  ["", "", ""],
  ["", "부산 결과 · 1번째", ""],
  ["서울 결과 · 2번째", "부산 결과 · 1번째", "제주 결과 · 3번째"],
  ["서울 결과", "부산 결과", "제주 결과"],
  ["권한 거부", "부산 결과", "제주 결과"],
];

const SCENES = [
  { label: "세 호출을 제안합니다", summary: "c1 · c2 · c3", note: "모델이 도시마다 get_weather 호출을 하나씩 제안합니다(가정). 실행 환경은 각 입력과 권한을 확인한 뒤 세 조회를 시작합니다. 오른쪽 칸은 아직 비어 있습니다." },
  { label: "부산이 먼저 돌아옵니다", summary: "결과 → c2", note: "먼저 왔다고 맨 위 줄에 붙이지 않습니다. 부산 요청의 식별자인 c2에 붙입니다(도착 순서는 가정)." },
  { label: "나머지도 각자의 ID로", summary: "결과 → c1, c3", note: "서울 결과는 c1에, 제주 결과는 c3에 연결합니다. 도착 순서가 뒤섞여도 줄은 바뀌지 않습니다." },
  { label: "조회 구간만 약 400ms", summary: "전체 응답 ≠ 400ms", note: "모두 약 400ms에 끝난다는 가정에서 조회 구간은 약 400ms입니다. 전체 응답에는 호출 생성, 결과 읽기, 통신·스케줄링 시간도 더해지며, 이 세 칸의 폭은 길이를 뜻하지 않습니다." },
  { label: "서울이 거부되면", summary: "c1에 거부 결과", note: "c1에는 거부 결과를 남기고 부산·제주 값을 서울 값처럼 돌려주지 않습니다. 필요한 조건을 새로 확인하거나 그 도시를 조회하지 못했다고 알려 줍니다." },
] as const;

const EXTRAS = ["호출 생성", "결과 읽기", "통신·스케줄링"] as const;

export default function CallIdMatchViz() {
  return (
    <SceneShell
      eyebrow="호출 ID"
      title="결과는 도착 순서가 아니라 식별자를 따라 붙습니다"
      description="줄 하나가 호출 하나이고, 오른쪽 칸이 그 호출에 붙은 결과입니다. 값과 도착 순서는 설명을 위한 가정입니다."
      ariaLabel="세 호출의 결과가 다른 순서로 돌아와도 각 식별자에 연결되는 과정"
      scenes={SCENES}
      render={(active) => {
        const results = RESULTS[active];
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={8} y={14} fontSize={11} fill="#64748b">호출</text>
            <text x={112} y={14} fontSize={11} fill="#64748b">실행</text>
            <text x={210} y={14} fontSize={11} fill="#64748b">이 ID에 붙은 결과</text>
            {ROWS.map((row, index) => {
              const y = 24 + index * 44;
              const result = results[index];
              const denied = result === "권한 거부";
              const fresh = result !== "" && (active === 0 ? false : RESULTS[active - 1][index] !== result);
              return (
                <g key={row.id}>
                  <rect x={8} y={y} width={32} height={32} rx={6} fill="none" stroke="#64748b" strokeWidth={1} />
                  <text x={24} y={y + 20} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">{row.id}</text>
                  <text x={48} y={y + 20} fontSize={12} className="fill-foreground">{row.city}</text>
                  <line x1={88} x2={200} y1={y + 16} y2={y + 16} stroke={result ? (denied ? "#dc2626" : "#2563eb") : "#94a3b8"} strokeWidth={1} strokeDasharray={result ? undefined : "4 3"} />
                  <polygon points={`206,${y + 16} 200,${y + 12.5} 200,${y + 19.5}`} fill={result ? (denied ? "#dc2626" : "#2563eb") : "#94a3b8"} />
                  <rect x={208} y={y} width={144} height={32} rx={6} fill="none" stroke={denied ? "#dc2626" : result ? "#2563eb" : "#94a3b8"} strokeWidth={fresh ? 1.25 : 1} strokeDasharray={result && !denied ? undefined : "4 3"} />
                  <text x={280} y={y + 20} textAnchor="middle" fontSize={11.5} fontWeight={fresh ? 700 : 400} fill={denied ? "#dc2626" : result ? "#2563eb" : "#94a3b8"}>{result || "비어 있음"}</text>
                </g>
              );
            })}
            {active === 3 && (
              <g>
                <rect x={8} y={166} width={96} height={44} rx={6} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                <text x={56} y={184} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">조회 구간</text>
                <text x={56} y={200} textAnchor="middle" fontSize={11} fill="#2563eb">약 400ms</text>
                {EXTRAS.map((name, index) => {
                  const x = 120 + index * 82;
                  return (
                    <g key={name}>
                      <text x={index === 0 ? 112 : x - 5} y={192} textAnchor="middle" fontSize={12} fill="#64748b">+</text>
                      <rect x={x} y={166} width={72} height={44} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
                      <text x={x + 36} y={184} textAnchor="middle" fontSize={index === 2 ? 10.5 : 11} fill="#64748b">{name}</text>
                      <text x={x + 36} y={200} textAnchor="middle" fontSize={11} fill="#64748b">길이 미정</text>
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
