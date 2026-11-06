import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tradeoffs — 일반 제출 14R과 재생 40+10R의 누적 시간. R=10에서 140으로 같고 R=11에서 154 대 150.
 * 모두 본문의 가정값이다.
 */
const CHOSEN = [1, 10, 11, 16] as const;
const SCENES = [
  { label: "한 번만 쓸 때", summary: "14 대 50 μs", note: "R=1이면 일반 제출 14 μs, 재생 40 + 10 = 50 μs입니다. 준비 비용 40 μs를 회수할 반복이 아직 없어 재생이 불리합니다." },
  { label: "열 번째에 동률", summary: "140 = 140 μs", note: "한 번 반복할 때마다 14 − 10 = 4 μs를 아낍니다. 40 ÷ 4 = 10이므로 10번째에 준비 비용을 겨우 갚습니다. 아직 순이득은 없습니다." },
  { label: "열한 번째부터 순이득", summary: "154 대 150 μs", note: "R=11에서 재생 쪽이 4 μs 빠릅니다. 나누어떨어지면 동률이 한 번 있으므로 '10번부터 빠르다'고 말하면 부정확합니다." },
  { label: "더 반복하면", summary: "224 대 200 μs", note: "R=16이면 차이는 (16 − 10) × 4 = 24 μs입니다. 이 값들은 가정이고 실제 판단에서는 입력 복사와 출력 보존까지 포함해 같은 경계에서 잰 반복 비용을 넣습니다." },
] as const;

const W = 340;
const H = 190;
const LEFT = 34;
const RIGHT = 12;
const BOTTOM = 158;
const TOP = 12;
const MAX_R = 18;
const MAX_T = 260;
const sx = (r: number) => LEFT + (r / MAX_R) * (W - LEFT - RIGHT);
const sy = (t: number) => BOTTOM - (t / MAX_T) * (BOTTOM - TOP);
const plain = (r: number) => 14 * r;
const replay = (r: number) => 40 + 10 * r;

export default function BreakEvenViz() {
  return (
    <SceneShell
      eyebrow="누적 시간"
      title="재생은 40 μs 뒤에서 출발해 한 번에 4 μs씩 따라잡습니다"
      description="가로축이 반복 횟수 R, 세로축이 그때까지의 전체 시간(μs)입니다. 캡처·준비 40 μs, 매회 14 μs와 10 μs는 모두 가정입니다."
      ariaLabel="일반 제출과 재생의 누적 시간 비교 그래프"
      scenes={SCENES}
      render={(active) => {
        const r = CHOSEN[active];
        const tied = plain(r) === replay(r);
        return (
          <div className="min-w-0">
            <p className="mb-1 text-center font-mono text-xs font-bold text-[#b45309]">R={r} · {tied ? `둘 다 ${plain(r)} μs` : `일반 ${plain(r)} · 재생 ${replay(r)} μs`}</p>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 100, 200].map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={W - RIGHT} y1={sy(tick)} y2={sy(tick)} stroke="#94a3b8" strokeWidth={1} strokeDasharray={tick === 0 ? undefined : "2 3"} />
                <text x={LEFT - 5} y={sy(tick) + 4} textAnchor="end" fontSize={11} className="fill-muted-foreground">{tick}</text>
              </g>
            ))}
            {[0, 5, 10, 15].map((tick) => (
              <text key={tick} x={sx(tick)} y={BOTTOM + 16} textAnchor="middle" fontSize={11} className="fill-muted-foreground">{tick}</text>
            ))}
            <text x={W - RIGHT} y={BOTTOM + 30} textAnchor="end" fontSize={11} className="fill-muted-foreground">반복 횟수 R</text>
            <line x1={sx(0)} y1={sy(plain(0))} x2={sx(MAX_R)} y2={sy(plain(MAX_R))} stroke="#64748b" strokeWidth={1.25} />
            <line x1={sx(0)} y1={sy(replay(0))} x2={sx(MAX_R)} y2={sy(replay(MAX_R))} stroke="#2563eb" strokeWidth={1.25} strokeDasharray="5 3" />
            <text x={sx(11.6)} y={sy(232)} fontSize={11} fontWeight={700} fill="#475569">일반 14R</text>
            <text x={sx(1.6)} y={sy(118)} fontSize={11} fontWeight={700} fill="#2563eb">재생 40+10R</text>
            <line x1={sx(r)} x2={sx(r)} y1={TOP} y2={BOTTOM} stroke="#b45309" strokeWidth={1} />
            <circle cx={sx(r)} cy={sy(plain(r))} r={3.5} fill="#64748b" />
            <circle cx={sx(r)} cy={sy(replay(r))} r={3.5} fill="#2563eb" />
          </svg>
          </div>
        );
      }}
    />
  );
}
