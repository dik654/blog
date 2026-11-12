import StackedSceneShell from "./StackedSceneShell";

/**
 * 본문 대응: order-matters 절 — 최근 처리 토큰으로 나눈 평균 원가는 몰린 풀을 싸 보이게 해
 * 더 몰리게 하고, 원가가 실제로 결정을 바꾸는 자리는 확보 용량이 다 찬 경계다.
 * 고정비 100, 토큰 60:40, 한 번에 10씩 이동은 고리를 보이려는 가정(단위 없음).
 * 100÷60 = 1.67, 100÷40 = 2.50 → 100÷70 = 1.43, 100÷30 = 3.33 → 100÷80 = 1.25, 100÷20 = 5.00
 */
const FIXED = 100;
const ROUNDS: readonly (readonly [number, number])[] = [
  [60, 40],
  [70, 30],
  [80, 20],
];

const fmt = (tokens: number) => (FIXED / tokens).toFixed(2);

const SCENES = [
  {
    label: "평균 원가는 많이 쓴 풀을 싸 보이게 합니다",
    summary: `A ${fmt(60)} · B ${fmt(40)}`,
    note: "두 풀의 고정비를 똑같이 100으로 두고(가정) 최근 처리한 토큰으로 나누면, 토큰을 60 처리한 A가 40 처리한 B보다 싸 보입니다. 두 풀의 비용 구조는 같은데도 그렇습니다.",
  },
  {
    label: "싸 보이니 더 몰립니다",
    summary: `A ${fmt(70)} · B ${fmt(30)}`,
    note: "원가를 앞쪽 기준으로 쓰면 싸 보이는 A로 요청이 더 갑니다. 10만큼 옮겨 갔다고 두면(가정) A는 더 싸 보이고 B는 더 비싸 보입니다.",
  },
  {
    label: "고리가 다시 돕니다",
    summary: `A ${fmt(80)} · B ${fmt(20)}`,
    note: "한 번 더 옮겨 가면 격차가 1.25 대 5.00까지 벌어집니다. 트래픽이 몰린 풀이 싸 보이고, 싸 보이니까 더 몰리는 되먹임입니다.",
  },
  {
    label: "요청 하나를 더 보낼 때 늘어나는 것",
    summary: "전력·물·회선뿐",
    note: "장비 값과 상면 임대료는 이미 확정되어 어느 쪽을 골라도 같고, 요청 하나가 늘리는 것은 전력과 물과 회선뿐입니다. 그래서 글은 확보된 용량끼리의 원가 차이가 라우팅을 좌우할 만큼 크지 않다고 봅니다.",
  },
  {
    label: "용량이 다 찬 경계에서는 다릅니다",
    summary: "탄력 임대·외부 API → 청구액 증가",
    note: "확보한 용량이 다 차서 탄력 임대를 더 돌리거나 외부 API로 넘겨야 하는 경계에서는 요청 하나가 청구액을 실제로 늘립니다. 원가가 결정을 바꾸는 자리는 여기입니다.",
  },
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";
const INK = "#64748b";

const BAR_X = 48;
const BAR_MAX = 170;
const SLOTS = 10;

function Feedback({ round }: { round: number }) {
  const [a, b] = ROUNDS[round];
  const prev = round > 0 ? ROUNDS[round - 1] : null;
  const rows = [
    { name: "풀 A", tokens: a, before: prev ? prev[0] : null, y: 42 },
    { name: "풀 B", tokens: b, before: prev ? prev[1] : null, y: 78 },
  ];
  return (
    <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`풀 A 토큰 ${a}, 평균 원가 ${fmt(a)}; 풀 B 토큰 ${b}, 평균 원가 ${fmt(b)}`}>
      <text x={6} y={14} fontSize={10.5} fill={INK}>
        고정비 {FIXED}(가정) ÷ 최근 처리 토큰 = 평균 원가
      </text>
      <text x={BAR_X} y={34} fontSize={10} fontWeight={700} fill={MUTED}>최근 처리 토큰</text>
      <text x={354} y={34} textAnchor="end" fontSize={10} fontWeight={700} fill={MUTED}>평균 원가</text>
      {rows.map((r) => {
        const cheap = r.tokens > 50;
        const color = cheap ? OK : WARN;
        return (
          <g key={r.name}>
            <text x={6} y={r.y + 13} fontSize={11} fontWeight={700} fill={INK}>{r.name}</text>
            {r.before !== null && (
              <rect x={BAR_X} y={r.y} width={(r.before / 100) * BAR_MAX} height={18} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="3 2" />
            )}
            <rect x={BAR_X} y={r.y} width={(r.tokens / 100) * BAR_MAX} height={18} fill={ACCENT} fillOpacity={0.3} stroke={ACCENT} strokeWidth={1} />
            <text x={BAR_X + BAR_MAX + 6} y={r.y + 13} fontSize={11} fontWeight={700} fill={ACCENT}>{r.tokens}</text>
            <text x={354} y={r.y + 13} textAnchor="end" fontSize={11} fontWeight={700} fill={color}>
              {FIXED}÷{r.tokens} = {fmt(r.tokens)}
            </text>
          </g>
        );
      })}
      {round > 0 && (
        <text x={BAR_X} y={116} fontSize={10} fill={MUTED}>점선 = 직전 분배</text>
      )}
      <text x={6} y={140} fontSize={10.5} fontWeight={700} fill={round === 0 ? OK : WARN}>
        {round === 0
          ? "많이 처리한 A가 싸 보입니다"
          : round === 1
            ? "싸 보이는 A로 10이 옮겨 갑니다 (가정)"
            : "다시 10이 옮겨 가고 격차가 벌어집니다"}
      </text>
      <text x={6} y={158} fontSize={10} fill={INK}>
        평균 원가 격차 {fmt(a)} 대 {fmt(b)}
      </text>
    </svg>
  );
}

function Marginal() {
  const pools = [
    { name: "풀 A", y: 10 },
    { name: "풀 B", y: 66 },
  ];
  return (
    <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label="요청 하나를 어느 풀에 보내도 확정된 비용은 같고 전력·물·회선만 늘어남">
      <rect x={6} y={46} width={64} height={30} rx={4} fill={INK} fillOpacity={0.1} stroke={INK} strokeWidth={1} />
      <text x={38} y={65} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK}>요청 하나 더</text>
      {pools.map((p) => (
        <g key={p.name}>
          <line x1={70} y1={61} x2={118} y2={p.y + 22} stroke={MUTED} strokeWidth={1} />
          <rect x={118} y={p.y} width={152} height={44} rx={4} fill={MUTED} fillOpacity={0.12} stroke={MUTED} strokeWidth={1} />
          <text x={126} y={p.y + 17} fontSize={11} fontWeight={700} fill={INK}>{p.name}</text>
          <text x={126} y={p.y + 34} fontSize={10} fill={INK}>장비 값·상면 임대료 · 확정</text>
          <rect x={276} y={p.y + 8} width={78} height={28} rx={4} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1} strokeDasharray="4 3" />
          <text x={315} y={p.y + 26} textAnchor="middle" fontSize={10} fontWeight={700} fill={OK}>+전력·물·회선</text>
        </g>
      ))}
      <text x={6} y={136} fontSize={10.5} fontWeight={700} fill={INK}>확정된 비용은 어느 쪽을 골라도 같습니다</text>
      <text x={6} y={154} fontSize={10.5} fontWeight={700} fill={OK}>요청 하나가 늘리는 것은 전력·물·회선뿐입니다</text>
      <text x={354} y={168} textAnchor="end" fontSize={10} fill={MUTED}>상자 크기는 금액에 비례하지 않음</text>
    </svg>
  );
}

function Boundary() {
  return (
    <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label="확보 용량이 다 차면 다음 요청은 탄력 임대나 외부 API로 가서 청구액을 늘림">
      <text x={6} y={14} fontSize={10.5} fill={INK}>확보한 용량 · 칸 {SLOTS}개 (가정) · 모두 사용 중</text>
      {Array.from({ length: SLOTS }, (_, i) => (
        <rect key={i} x={6 + i * 28} y={24} width={24} height={26} rx={3} fill={ACCENT} fillOpacity={0.3} stroke={ACCENT} strokeWidth={1} />
      ))}
      <rect x={6} y={84} width={100} height={36} rx={4} fill="none" stroke={INK} strokeWidth={1} strokeDasharray="4 3" />
      <text x={56} y={106} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={INK}>다음 요청</text>
      <line x1={106} y1={102} x2={148} y2={102} stroke={WARN} strokeWidth={1.25} />
      <polygon points="148,98 156,102 148,106" fill={WARN} />
      <rect x={158} y={80} width={196} height={44} rx={4} fill={WARN} fillOpacity={0.1} stroke={WARN} strokeWidth={1} />
      <text x={256} y={98} textAnchor="middle" fontSize={11} fontWeight={700} fill={WARN}>탄력 임대 · 외부 API</text>
      <text x={256} y={115} textAnchor="middle" fontSize={10} fill={WARN}>청구액이 실제로 늘어남</text>
      <text x={6} y={148} fontSize={10.5} fontWeight={700} fill={WARN}>원가가 결정을 바꾸는 자리는 이 경계입니다</text>
      <text x={6} y={165} fontSize={10} fill={INK}>평균 원가가 아니라 그 요청이 늘리는 청구액을 씁니다</text>
    </svg>
  );
}

export default function CostFeedbackViz() {
  return (
    <StackedSceneShell
      eyebrow="원가를 앞에 두면 생기는 일"
      title="평균 원가는 되먹임을 만들고, 원가가 갈리는 곳은 경계입니다"
      description="막대는 각 풀이 최근 처리한 토큰입니다. 고정비 100, 처음 분배 60:40, 한 번에 10씩 옮겨 가는 것은 고리를 보이려는 가정이고 단위는 없습니다."
      note="글은 이 절을 가장 약한 부분이라 밝히며, 라우팅 순서 자체는 측정으로 확인해야 한다고 적습니다."
      ariaLabel="평균 원가의 되먹임 고리와 확보 용량 경계에서의 추가 비용"
      scenes={SCENES}
      render={(s) => (s < 3 ? <Feedback round={s} /> : s === 3 ? <Marginal /> : <Boundary />)}
    />
  );
}
