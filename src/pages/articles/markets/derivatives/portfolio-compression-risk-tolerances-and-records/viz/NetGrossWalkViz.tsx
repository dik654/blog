import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 수취 +100, 지급 −60·−40.
 * 순액 = 100 − 60 − 40 = 0 (수직선 위를 걸어 0으로 돌아옴), 총 명목 = 100 + 60 + 40 = 200 (걸은 거리).
 * 조건이 모두 같으면 세 계약을 종료해 200 → 0. 만기·금리가 다르면 대체계약이 필요할 수 있고 그 규모는 본문에 없습니다.
 */
const W = 360;
const H = 168;
const LEFT = 24;
const RIGHT = 24;
const MIN = -70;
const MAX = 110;
const AXIS_Y = 142;
const ROW_Y = [34, 70, 106] as const;
const x = (value: number) => LEFT + ((value - MIN) / (MAX - MIN)) * (W - LEFT - RIGHT);

const TRADES = [
  { label: "수취 +100", amount: 100, color: "#16a34a" },
  { label: "지급 −60", amount: -60, color: "#dc2626" },
  { label: "지급 −40", amount: -40, color: "#dc2626" },
] as const;

const SCENES = [
  { label: "세 계약", summary: "+100 · −60 · −40", chained: false, closed: false, net: null, gross: null, replace: false, note: "같은 상대방·통화·만기에서 고정금리를 받는 계약 100은 양수, 내는 계약 60과 40은 음수로 둡니다. 화살표 길이가 각 계약의 명목원금입니다." },
  { label: "순액", summary: "100 − 60 − 40 = 0", chained: true, closed: false, net: 0, gross: null, replace: false, note: "화살표를 이어 붙이면 0에서 출발해 100까지 갔다가 40, 다시 0으로 돌아옵니다. 도착점이 순 고정금리 노출이고 값은 0입니다." },
  { label: "총 명목", summary: "100 + 60 + 40 = 200", chained: true, closed: false, net: 0, gross: 200, replace: false, note: "도착점은 0이지만 걸어온 거리는 100 + 60 + 40 = 200입니다. 부호를 떼고 더한 이 값이 절대 명목원금의 합, 곧 총 명목입니다." },
  { label: "세 계약 종료", summary: "총 명목 200 → 0", chained: true, closed: true, net: 0, gross: 0, replace: false, note: "나머지 조건이 모두 같다면 세 계약을 합의해 종료해도 순 노출 0은 그대로이고 총 명목만 0이 됩니다. 이 절차가 포트폴리오 압축입니다." },
  { label: "조건이 다르면", summary: "대체계약이 필요할 수 있음", chained: true, closed: true, net: null, gross: null, replace: true, note: "세 계약의 만기나 금리가 서로 다르면 그냥 지우는 대신 현금흐름과 민감도를 보존하는 대체계약이 필요할 수 있습니다. 대체계약의 규모와 조건은 본문에 없어 칸만 그렸습니다." },
] as const;

function Arrow({ from, to, y, color, label, faded }: { from: number; to: number; y: number; color: string; label: string; faded: boolean }) {
  const x1 = x(from);
  const x2 = x(to);
  const dir = to > from ? 1 : -1;
  const head = `${x2},${y} ${x2 - dir * 7},${y - 5} ${x2 - dir * 7},${y + 5}`;
  return (
    <g opacity={faded ? 0.35 : 1}>
      <line x1={x1} x2={x2 - dir * 6} y1={y} y2={y} stroke={color} strokeWidth={faded ? 1 : 1.25} strokeDasharray={faded ? "4 3" : undefined} />
      <polygon points={head} fill={faded ? "none" : color} stroke={color} strokeWidth={1} />
      <circle cx={x1} cy={y} r={2.5} fill={color} />
      <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
        {faded ? `${label} 종료` : label}
      </text>
    </g>
  );
}

function Bar({ label, value, text }: { label: string; value: number | null; text: string }) {
  const width = value === null ? 0 : (value / 200) * 100;
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_6.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm bg-[#2563eb]" style={{ width: `${width}%` }} />
      </div>
      <span className="text-right font-mono">{text}</span>
    </div>
  );
}

export default function NetGrossWalkViz() {
  return (
    <SceneShell
      eyebrow="순액과 총 명목"
      title="도착점은 0인데 걸어온 거리는 200입니다"
      description="명목원금은 이자를 계산하는 기준 금액입니다. 아래 수직선에서 화살표 길이가 계약 하나의 명목원금이고, 이어 붙인 도착점이 순 노출, 걸어온 거리가 총 명목입니다. 세 계약은 본문의 교육용 사례입니다."
      ariaLabel="수취 100, 지급 60과 40을 수직선 위에 이어 붙여 순액 0과 총 명목 200을 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const starts = scene.chained ? [0, 100, 40] : [0, 0, 0];
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {TRADES.map((trade, row) => (
                <Arrow key={trade.label} from={starts[row]} to={starts[row] + trade.amount} y={ROW_Y[row]} color={trade.color} label={trade.label} faded={scene.closed} />
              ))}
              <line x1={x(MIN)} x2={x(MAX)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {[-60, -40, 0, 40, 100].map((tick) => (
                <g key={tick}>
                  <line x1={x(tick)} x2={x(tick)} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(tick)} y={AXIS_Y + 18} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>
                </g>
              ))}
              <line x1={x(0)} x2={x(0)} y1={16} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
              {scene.chained && !scene.closed ? (
                <circle cx={x(0)} cy={AXIS_Y} r={5} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              ) : null}
            </svg>
            {scene.replace ? (
              <div className="rounded-lg border border-dashed border-[#d97706] px-3 py-2 text-center text-xs leading-5">
                <strong className="block text-[#b45309] dark:text-amber-400">대체계약</strong>
                <span className="text-muted-foreground">현금흐름·민감도를 참여자의 허용오차 안에 두도록 설계 · 규모는 본문에 없음</span>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-transparent px-3 py-2 text-center text-xs leading-5" aria-hidden="true">
                <strong className="block">&nbsp;</strong>
                <span>&nbsp;</span>
              </div>
            )}
            <div className="space-y-2">
              <Bar label="순 노출" value={scene.net === null ? null : Math.abs(scene.net)} text={scene.net === null ? (scene.replace ? "보존 목표" : "−") : String(scene.net)} />
              <Bar label="총 명목" value={scene.gross} text={scene.gross === null ? (scene.replace ? "본문에 없음" : "−") : String(scene.gross)} />
            </div>
          </div>
        );
      }}
    />
  );
}
