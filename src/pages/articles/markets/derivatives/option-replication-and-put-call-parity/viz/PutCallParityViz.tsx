import SceneShell from "./SceneShell";
import type { ShellScene } from "./SceneShell";

/**
 * 본문 대응: #names — 배당 없고 금리 0, K=100.
 * 콜+현금 100 = max(S−100,0)+100 = max(S,100), 주식+풋 = S+max(100−S,0) = max(S,100).
 * 사례 상태: S=120 → 120, S=80 → 100. 오늘: C 10 + K 100 = S 100 + P → P = 10.
 * 가로축 60~140은 그리기 범위 선택(가정)입니다.
 */
const K = 100;
const S_MIN = 60;
const S_MAX = 140;
const V_MAX = 150;

const W = 360;
const H = 236;
const LEFT = 40;
const RIGHT = 344;
const TOP = 26;
const BOTTOM = 196;
const sx = (s: number) => LEFT + ((s - S_MIN) / (S_MAX - S_MIN)) * (RIGHT - LEFT);
const vy = (v: number) => BOTTOM - (v / V_MAX) * (BOTTOM - TOP);
const path = (f: (s: number) => number) => [S_MIN, K, S_MAX].map((s) => `${sx(s)},${vy(f(s))}`).join(" ");

const call = (s: number) => Math.max(s - K, 0);
const put = (s: number) => Math.max(K - s, 0);
const bundle = (s: number) => Math.max(s, K);

const SCENES: readonly ShellScene[] = [
  { label: "묶음 ①: 콜 + 현금 100", summary: "만기에 max(주가, 100)", note: "콜은 주가가 100을 넘은 만큼만 줍니다. 여기에 행사가격만큼의 현금 100을 더하면, 주가 80에서는 0+100=100, 120에서는 20+100=120입니다. 바닥은 100이고 그 위로는 주가를 따라갑니다." },
  { label: "묶음 ②: 주식 + 풋", summary: "만기에 max(주가, 100)", note: "풋은 행사가격 100에 주식을 팔 수 있는 권리라서 주가가 100보다 낮은 만큼 줍니다. 주가 80이면 주식 80+풋 20=100, 120이면 주식 120+풋 0=120입니다." },
  { label: "두 묶음의 선이 겹칩니다", summary: "80 → 100 · 120 → 120", note: "어느 주가에서 끝나도 두 묶음이 같은 날짜에 같은 돈을 줍니다. 그래서 5절의 원리대로 오늘 가격도 같아야 하고, 이것이 C+행사가격의 현재가치=S+P입니다." },
  { label: "오늘 가격으로 풋 구하기", summary: "10 + 100 = 100 + P → P = 10", note: "금리가 0이라 행사가격의 현재가치는 100 그대로입니다. 콜 10과 현금 100의 합 110이 주식 100과 풋의 합과 같아야 하므로 풋은 10입니다. 배당·미국형 행사·거래비용이 있으면 항이 달라집니다." },
];

function PayoffPlot({ scene }: { scene: number }) {
  const showA = scene === 0 || scene === 2;
  const showB = scene === 1 || scene === 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
      <line x1={LEFT} x2={RIGHT} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
      <line x1={LEFT} x2={LEFT} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
      {[0, 50, 100, 150].map((v) => (
        <text key={v} x={LEFT - 6} y={vy(v) + 4} textAnchor="end" fontSize={10} fill="#64748b">{v}</text>
      ))}
      {[60, 80, 100, 120, 140].map((s) => (
        <text key={s} x={sx(s)} y={BOTTOM + 14} textAnchor="middle" fontSize={10} fill="#64748b">{s}</text>
      ))}
      <text x={RIGHT} y={BOTTOM + 30} textAnchor="end" fontSize={11} fill="#475569">만기 주가 →</text>
      <text x={LEFT} y={TOP - 10} fontSize={11} fill="#475569">만기에 받는 돈</text>
      {[80, 120].map((s) => (
        <line key={s} x1={sx(s)} x2={sx(s)} y1={TOP} y2={BOTTOM} stroke="#e2e8f0" strokeWidth={1} />
      ))}
      {scene === 0 && (
        <>
          <polyline points={path(call)} fill="none" stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
          <line x1={LEFT} x2={RIGHT} y1={vy(K)} y2={vy(K)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
          <text x={sx(136)} y={vy(call(136)) + 14} textAnchor="end" fontSize={11} fill="#1d4ed8">콜</text>
          <text x={sx(64)} y={vy(K) + 14} fontSize={11} fill="#64748b">현금 100</text>
        </>
      )}
      {scene === 1 && (
        <>
          <polyline points={path((s) => s)} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="2 3" />
          <polyline points={path(put)} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="1.5 3" />
          <text x={sx(64)} y={vy(put(64)) - 8} fontSize={11} fill="#b45309">풋</text>
          <text x={sx(136)} y={vy(136) + 16} textAnchor="end" fontSize={11} fill="#64748b">주식</text>
        </>
      )}
      {showA && <polyline points={path(bundle)} fill="none" stroke="#2563eb" strokeWidth={1.25} />}
      {showB && <polyline points={path(bundle)} fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="6 5" />}
      {[80, 120].map((s) => (
        <g key={s}>
          <circle cx={sx(s)} cy={vy(bundle(s))} r={4} fill={scene === 1 ? "#d97706" : "#2563eb"} />
          <text x={sx(s)} y={vy(bundle(s)) - 9} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">{bundle(s)}</text>
        </g>
      ))}
      <g fontSize={10} fill="#475569">
        <line x1={150} x2={166} y1={14} y2={14} stroke="#2563eb" strokeWidth={1.25} />
        <text x={170} y={18}>① 콜+현금</text>
        <line x1={238} x2={254} y1={14} y2={14} stroke="#d97706" strokeWidth={1.25} strokeDasharray="6 5" />
        <text x={258} y={18}>② 주식+풋</text>
      </g>
    </svg>
  );
}

function StackBar({ parts, label }: { parts: readonly { name: string; value: number; color: string }[]; label: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-semibold">{label}</p>
      <div className="flex h-10 min-w-0">
        {parts.map((part) => (
          <div key={part.name} className="flex items-center justify-center border border-background text-xs font-bold text-white" style={{ flexGrow: part.value, flexBasis: 0, minWidth: "3.5rem", backgroundColor: part.color }}>
            {`${part.name} ${part.value}`}
          </div>
        ))}
      </div>
    </div>
  );
}

function TodayBars() {
  return (
    <div className="min-w-0 space-y-4 py-4" role="img" aria-label="콜 10과 현금 100의 합 110이 주식 100과 풋 10의 합 110과 같음">
      <StackBar label="① 오늘 콜 + 현금(행사가격의 현재가치)" parts={[{ name: "콜", value: 10, color: "#2563eb" }, { name: "현금", value: 100, color: "#64748b" }]} />
      <StackBar label="② 오늘 주식 + 풋" parts={[{ name: "주식", value: 100, color: "#475569" }, { name: "풋 P", value: 10, color: "#d97706" }]} />
      <p className="text-xs text-muted-foreground">두 막대의 길이가 같아야 합니다. 콜 쪽 합이 110이므로 풋 칸은 110 − 100 = 10입니다.</p>
    </div>
  );
}

export default function PutCallParityViz() {
  return (
    <SceneShell
      eyebrow="풋콜 등식"
      title="콜+현금과 주식+풋은 만기에 같은 선을 그립니다"
      description="같은 기초자산·행사가격 100·만기의 유럽형 콜과 풋입니다. 유럽형은 만기에만 행사할 수 있는 옵션입니다. 금리 0·배당 없음은 본문 가정이고, 가로축 60~140은 그리기 범위(가정)입니다."
      ariaLabel="콜과 현금 묶음, 주식과 풋 묶음의 만기 지급이 같고 오늘 가격도 같음"
      scenes={SCENES}
      render={(index) => (index === 3 ? <TodayBars /> : <PayoffPlot scene={index} />)}
    />
  );
}
