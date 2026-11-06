import SceneShell from "./SceneShell";

/**
 * 본문 대응: #rate-limiting-algorithms ProgressiveDetail — 초당 요청 수가 낮아도 오래 걸리면 동시 진행 건수가 쌓인다.
 * 초당 1건, 처리 시간 1초·30초, 동시 상한 20건은 모두 가정이다.
 * t=35초의 진행 중 건수: 1초 처리 1건, 30초 처리 30건, 상한 20건.
 */
const W = 360;
const H = 170;
const REQUESTS = 40;
const END = 45;
const CUT = 35;
const x = (t: number) => 16 + (Math.min(t, END) / END) * 328;
const laneY = (index: number) => 22 + index * 2.9;

function simulate(duration: number, limit: number) {
  const accepted: number[] = [];
  const rejected: number[] = [];
  for (let start = 0; start < REQUESTS; start++) {
    const running = accepted.filter((other) => other + duration > start).length;
    if (running < limit) accepted.push(start);
    else rejected.push(start);
  }
  const atCut = accepted.filter((start) => start <= CUT && start + duration > CUT).length;
  return { accepted, rejected, atCut };
}

const SCENES = [
  { label: "요청이 1초 만에 끝나면", summary: "초당 1건 · 진행 중 1건", duration: 1, limit: Infinity, note: "막대 하나가 요청 하나이고 길이가 처리 시간입니다. 앞 요청이 끝난 뒤 다음 요청이 오므로 어느 순간을 잘라도 진행 중인 요청은 1건입니다." },
  { label: "같은 건수가 30초씩 걸리면", summary: "초당 1건 · 진행 중 30건", duration: 30, limit: Infinity, note: "초당 건수는 그대로인데 막대가 길어져 겹칩니다. 초당 건수를 세는 rate limit의 눈에는 앞 장면과 같아 보여도, 자원은 30건이 함께 쓰고 있습니다." },
  { label: "동시 상한을 두면", summary: "초당 1건 · 진행 중 최대 20건", duration: 30, limit: 20, note: "Concurrency limit은 겹친 막대의 수 자체를 셉니다. 20건이 차면 앞 요청이 끝날 때까지 새 요청을 막습니다. 회색 눈금이 막힌 요청입니다." },
] as const;

export default function ConcurrencyPileViz() {
  return (
    <SceneShell
      eyebrow="겹치는 요청"
      title="초당 건수가 같아도 요청이 길면 동시에 진행되는 수가 쌓일 수 있습니다"
      description="가로축은 시간입니다. 초당 1건이 도착한다고 두었고(가정), 처리 시간과 동시 상한도 그림을 위한 가정입니다. 세로 점선이 35초 시점을 자른 단면이고, 파란 막대가 그 단면에 걸린 요청입니다. 오른쪽 끝에 닿은 막대는 45초 뒤에도 이어집니다."
      ariaLabel="요청 처리 시간에 따라 동시 진행 건수가 달라지는 막대 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const { accepted, rejected, atCut } = simulate(scene.duration, scene.limit);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={x(CUT) - 5} y={12} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">35초 시점 진행 중 {atCut}건</text>
            {accepted.map((start) => (
              <rect key={start} x={x(start)} y={laneY(start)} width={Math.max(x(start + scene.duration) - x(start), 2)} height={2} fill={start <= CUT && start + scene.duration > CUT ? "#2563eb" : "#94a3b8"} />
            ))}
            {rejected.map((start) => (
              <rect key={start} x={x(start)} y={laneY(start)} width={3} height={2} fill="#94a3b8" opacity={0.7} />
            ))}
            <line x1={x(CUT)} x2={x(CUT)} y1={16} y2={140} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={x(0)} x2={x(END)} y1={141} y2={141} stroke="#94a3b8" strokeWidth={1} />
            {[0, 10, 20, 30, 40].map((tick) => (
              <text key={tick} x={x(tick)} y={156} textAnchor="middle" fontSize={11} fill="#64748b">{tick}초</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
