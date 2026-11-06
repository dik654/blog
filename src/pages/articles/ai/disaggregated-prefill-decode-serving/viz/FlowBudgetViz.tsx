import SceneShell from "./SceneShell";

/**
 * 본문 대응: #transfer-budget — 초당 10요청 × 512MiB = 42.95 Gbit/s.
 * 25 Gbit/s(3.125 GB/s)는 한 건 171.8 ms라 100 ms 간격을 못 따라간다. 50 GB/s는 10.74 ms.
 * 100 ms 간격 도착, 한 통로의 순차 처리는 그림을 위한 가정이다.
 */
const SLOW = 536870912 / 3.125e9 * 1000;
const FAST = 536870912 / 50e9 * 1000;
const X0 = 14;
const SCALE = 0.332;
const x = (ms: number) => X0 + ms * SCALE;

const seg = (start: (k: number) => number, width: number) =>
  Array.from({ length: 10 }, (_, k) => ({ from: start(k), to: Math.min(start(k) + width, 1000) })).filter((s) => s.from < 1000);

const SCENES = [
  { label: "25 Gbit/s 통로", summary: "유입 42.95 > 25 Gbit/s", arrivals: Array.from({ length: 10 }, (_, k) => k * 100), segs: seg((k) => k * SLOW, SLOW), caption: "1초 끝: 도착 10건 · 완료 5건 · 6번째 복사 중", color: "#dc2626", note: "한 건에 171.8 ms가 걸리는데 다음 요청은 100 ms마다 옵니다. 1초에 약 5.8건만 처리되어 나머지가 쌓이므로 이 흐름을 계속 처리할 수 없습니다." },
  { label: "400 Gbit/s(50 GB/s) 통로", summary: "유입 42.95 < 400 Gbit/s", arrivals: Array.from({ length: 10 }, (_, k) => k * 100), segs: seg((k) => k * 100, FAST), caption: "한 건 10.74 ms · 다음 도착 전에 끝남", color: "#16a34a", note: "고르게 온다면 한 건이 끝나고 다음 도착까지 통로가 비어 있습니다. 400 Gbit/s는 프로토콜·공유·혼잡에 따른 감소를 뺀 이상화 값입니다." },
  { label: "같은 통로에 한꺼번에 몰리면", summary: "평균은 같아도 마지막 107.4 ms", arrivals: [0], segs: seg((k) => k * FAST, FAST), caption: "10건 동시 도착: 10 × 10.74 = 107.4 ms", color: "#d97706", note: "초당 평균 흐름은 앞 장면과 같아 통로 아래입니다. 그래도 몰린 요청은 앞 요청이 끝나기를 기다리므로 지연이 길어질 수 있습니다. 평균 흐름이 통로 아래라는 것은 필요 조건일 뿐입니다." },
] as const;

export default function FlowBudgetViz() {
  return (
    <SceneShell
      eyebrow="(가정) 초당 10요청 × 512MiB"
      title="한 요청의 시간과 초당 흐름은 다른 질문입니다"
      description="가로축은 1초입니다. 눈금은 요청 도착(100 ms 간격, 가정), 막대는 복사 구간이고 색이 바뀌는 곳이 요청의 경계입니다. 통로 하나가 한 건씩 순서대로 옮긴다고 가정했습니다."
      ariaLabel="통로 속도와 요청 도착 간격에 따른 복사 대기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg key={scene.label} viewBox="0 0 360 136" className="mx-auto h-auto w-full max-w-[600px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.caption}`}>
            <text x={X0} y={14} fontSize={12} fill="currentColor">{active === 2 ? "도착 · 0 ms에 10건" : "도착"}</text>
            {scene.arrivals.map((ms) => <line key={ms} x1={x(ms)} x2={x(ms)} y1={20} y2={34} stroke="currentColor" strokeWidth={1.25} />)}
            <text x={X0} y={52} fontSize={12} fill="currentColor">복사</text>
            <rect x={x(0)} y={58} width={x(1000) - x(0)} height={22} fill="#94a3b8" fillOpacity={0.12} />
            {scene.segs.map((s, index) => (
              <rect key={index} x={x(s.from)} y={58} width={Math.max(x(s.to) - x(s.from), 1)} height={22} fill={index % 2 === 0 ? "#2563eb" : "#60a5fa"} />
            ))}
            <line x1={x(0)} x2={x(1000)} y1={86} y2={86} stroke="#94a3b8" strokeWidth={1} />
            {[0, 500, 1000].map((ms) => (
              <text key={ms} x={x(ms)} y={99} textAnchor={ms === 0 ? "start" : ms === 1000 ? "end" : "middle"} fontSize={11.5} fill="#64748b">{ms} ms</text>
            ))}
            <text x={180} y={124} textAnchor="middle" fontSize={13} fontWeight={700} fill={scene.color}>{scene.caption}</text>
          </svg>
        );
      }}
    />
  );
}
