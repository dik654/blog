import SceneShell from "./SceneShell";

/**
 * 본문 대응: measure 절의 둘째 버그 — 완료 요청만 세면 창 경계에 걸친 긴 요청의 출력이 빠진다.
 * 요청 4개와 30초 창은 그림용 가정. A 150(2→8), B 150(10→16), C 600(12→36), D 800(20→40).
 * 겹친 몫: C 600×18/24 = 450, D 800×10/20 = 400. 합계: 완료만 300 ÷ 30 = 10, 겹친 몫 1,150 ÷ 30 ≈ 38.3 tok/s.
 */
const WINDOW = 30;
const REQUESTS = [
  { name: "A", tokens: 150, start: 2, end: 8 },
  { name: "B", tokens: 150, start: 10, end: 16 },
  { name: "C", tokens: 600, start: 12, end: 36 },
  { name: "D", tokens: 800, start: 20, end: 40 },
] as const;

const counted = (r: (typeof REQUESTS)[number], fixed: boolean) => {
  if (r.end <= WINDOW) return r.tokens;
  if (!fixed) return 0;
  return (r.tokens * (WINDOW - r.start)) / (r.end - r.start);
};

const SCENES = [
  { label: "완료된 요청만", summary: "300토큰 ÷ 30초 = 10 tok/s", note: "창 안에서 끝난 A와 B만 셉니다. C와 D는 창 안에서 토큰을 만들고 있었는데도 끝나지 않았다는 이유로 빠집니다. 동시 수가 클수록 창 경계에 걸친 긴 요청이 많아 합계가 더 낮게 잡힙니다." },
  { label: "창과 겹친 몫만", summary: "1,150토큰 ÷ 30초 ≈ 38.3 tok/s", note: "요청별 출력에 창과 겹친 생성 시간의 비율을 곱합니다. C는 24초 중 18초가 겹쳐 450토큰, D는 20초 중 10초가 겹쳐 400토큰입니다. 이 합계가 다음 절의 비용 계산에 분모로 들어갑니다." },
] as const;

const W = 360;
const NAME_W = 68;
const VALUE_W = 48;
const RAIL = W - NAME_W - VALUE_W;
const MAX_T = 40;
const x = (t: number) => NAME_W + (t / MAX_T) * RAIL;
const ROW = 30;
const TOP = 24;

export default function WindowOverlapViz() {
  return (
    <SceneShell
      eyebrow="창 경계"
      title="창에 걸친 요청을 빼면 서버 합계가 낮게 잡힙니다"
      description="가로축은 시간, 음영이 측정창 30초, 막대 하나가 요청 하나가 토큰을 만드는 구간입니다. 오른쪽 숫자가 합계에 들어간 토큰입니다."
      note="요청 4개와 창 길이는 그림용 가정이며 차이의 크기도 실제 측정이 아닙니다."
      ariaLabel="측정창과 요청 구간의 겹침에 따라 달라지는 합계 출력"
      scenes={SCENES}
      render={(active) => {
        const fixed = active === 1;
        return (
          <svg viewBox={`0 0 ${W} 170`} className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={x(0)} y={14} width={x(WINDOW) - x(0)} height={TOP + ROW * 4 - 14} fill="#2563eb" opacity={0.08} />
            <line x1={x(WINDOW)} x2={x(WINDOW)} y1={14} y2={TOP + ROW * 4} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
            <text x={x(0) + 3} y={11} fontSize={11} fontWeight={600} fill="#2563eb">측정창</text>
            <text x={W - 2} y={11} textAnchor="end" fontSize={11} fill="#64748b">센 토큰</text>
            {REQUESTS.map((r, i) => {
              const y = TOP + i * ROW + 6;
              const value = counted(r, fixed);
              const overlapEnd = Math.min(r.end, WINDOW);
              return (
                <g key={r.name}>
                  <text x={2} y={y + 12} fontSize={11} fontWeight={600} fill="#64748b">{r.name} {r.tokens}토큰</text>
                  <rect x={x(r.start)} y={y} width={x(r.end) - x(r.start)} height={16} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} />
                  {value > 0 && <rect x={x(r.start)} y={y} width={x(overlapEnd) - x(r.start)} height={16} rx={2} fill="#2563eb" opacity={0.7} />}
                  <text x={W - 2} y={y + 12} textAnchor="end" fontSize={12} fontWeight={700} fill={value > 0 ? "#2563eb" : "#b45309"}>{value}</text>
                </g>
              );
            })}
            <line x1={x(0)} x2={x(MAX_T)} y1={TOP + ROW * 4 + 2} y2={TOP + ROW * 4 + 2} stroke="#94a3b8" strokeWidth={1} />
            {[0, 10, 20, 30, 40].map((t) => (
              <text key={t} x={x(t)} y={TOP + ROW * 4 + 16} textAnchor="middle" fontSize={11} fill="#64748b">{t}초</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
