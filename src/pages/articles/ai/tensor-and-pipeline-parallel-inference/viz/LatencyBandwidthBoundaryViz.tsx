import SceneShell from "./SceneShell";

/**
 * 본문 대응: #collectives — collective 한 번 = α + n/B. 두 항이 같아지는 n = αB 가 경계.
 * NVLink 900 GB/s · 5 μs → 4.5 MB, inter-node 50 GB/s · 15 μs → 0.75 MB.
 * decode 1 MB: 1.1 μs / 20 μs, prefill 33.6 MB: 37 μs / 672 μs (본문 경계처럼 c_alg 는 넣지 않음).
 */
const LINKS = {
  nv: { name: "NVLink", alpha: 5, gbps: 900 },
  ib: { name: "inter-node link", alpha: 15, gbps: 50 },
} as const;

const SCENES = [
  { label: "NVLink · decode 1 MB", link: "nv", mb: 1, summary: "α 5 μs > n/B 약 1.1 μs", note: "경계 αB 는 4.5 MB 이고 1 MB 는 그 왼쪽입니다. byte 를 옮기는 시간보다 시작하고 끝을 맞추는 고정 비용 α 가 더 큽니다. 이것이 latency 영역입니다." },
  { label: "NVLink · prefill 33.6 MB", link: "nv", mb: 33.6, summary: "α 5 μs < n/B 약 37 μs", note: "33.6 MB 는 경계 4.5 MB 의 오른쪽입니다. 전송 시간 n/B 가 대부분을 차지하는 bandwidth 영역입니다." },
  { label: "Inter-node · decode 1 MB", link: "ib", mb: 1, summary: "α 15 μs ≈ n/B 20 μs", note: "대역폭이 낮고 α 가 큰 link 에서는 경계가 0.75 MB 로 내려옵니다. 같은 1 MB 가 경계 가까이에 놓여 두 항이 비슷해집니다." },
  { label: "Inter-node · prefill 33.6 MB", link: "ib", mb: 33.6, summary: "α 15 μs ≪ n/B 672 μs", note: "prefill 의 큰 all-reduce 는 어느 link 에서든 bandwidth 영역입니다. 이 link 에서는 전송 시간이 거의 전부입니다." },
] as const;

const AX_L = 24;
const AX_W = 312;
/** 0.1 MB ~ 100 MB 를 log 축으로 놓는다. */
const logX = (mb: number) => AX_L + ((Math.log10(mb) + 1) / 3) * AX_W;
const TICKS = [0.1, 1, 10, 100] as const;
const fmt = (us: number) => (Number.isInteger(us) ? String(us) : `약 ${us < 10 ? us.toFixed(1) : Math.round(us)}`);

export default function LatencyBandwidthBoundaryViz() {
  return (
    <SceneShell
      eyebrow="α 와 n/B"
      title="Message 가 경계 αB 보다 작으면 고정 latency 가, 크면 전송 시간이 지배합니다"
      description="위 축은 message 크기(MB, 눈금 하나에 10배)이고 아래 막대는 collective 한 번의 시간을 두 항으로 나눈 몫입니다. α 는 byte 가 0 이어도 남는 고정 시간, n/B 는 byte 를 대역폭으로 나눈 전송 시간입니다. 본문의 경계 n = αB 처럼 알고리즘 배수는 넣지 않았습니다."
      ariaLabel="두 link 에서 1 MB 와 33.6 MB message 가 latency 영역과 bandwidth 영역 중 어디에 놓이는지"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const link = LINKS[scene.link];
        const boundaryMb = (link.alpha * link.gbps) / 1000;
        const transfer = (scene.mb * 1000) / link.gbps;
        const total = link.alpha + transfer;
        const alphaW = (link.alpha / total) * AX_W;
        const bx = logX(boundaryMb);
        return (
          <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={AX_L} y={14} fontSize={11} fontWeight={700} fill="#475569">
              {link.name} · {link.gbps} GB/s · α {link.alpha} μs
            </text>
            <rect x={AX_L} y={24} width={bx - AX_L} height={36} fill="#fef3c7" />
            <rect x={bx} y={24} width={AX_L + AX_W - bx} height={36} fill="#dbeafe" />
            <text x={AX_L + 4} y={36} fontSize={10.5} fill="#b45309">latency 영역</text>
            <text x={AX_L + AX_W - 4} y={36} textAnchor="end" fontSize={10.5} fill="#1d4ed8">bandwidth 영역</text>
            <line x1={bx} x2={bx} y1={20} y2={66} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />
            <text x={bx} y={78} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#dc2626">αB = {boundaryMb} MB</text>
            <line x1={AX_L} x2={AX_L + AX_W} y1={60} y2={60} stroke="#94a3b8" strokeWidth={1} />
            {TICKS.map((tick) => (
              <g key={tick}>
                <line x1={logX(tick)} x2={logX(tick)} y1={60} y2={64} stroke="#94a3b8" strokeWidth={1} />
                <text x={logX(tick)} y={92} textAnchor={tick === 0.1 ? "start" : tick === 100 ? "end" : "middle"} fontSize={10} fill="#64748b">
                  {tick} MB
                </text>
              </g>
            ))}
            <circle cx={logX(scene.mb)} cy={50} r={5} fill="#475569" />
            <text x={scene.mb > 10 ? logX(scene.mb) - 8 : logX(scene.mb) + 8} y={48} fontSize={11} fontWeight={700} fill="#475569" textAnchor={scene.mb > 10 ? "end" : "start"}>
              {scene.mb} MB
            </text>
            <text x={AX_L} y={116} fontSize={11} fontWeight={700} fill="#475569">collective 한 번 = α + n/B</text>
            <rect x={AX_L} y={124} width={alphaW} height={16} fill="#d97706" />
            <rect x={AX_L + alphaW} y={124} width={AX_W - alphaW} height={16} fill="#2563eb" />
            <text x={AX_L} y={158} fontSize={11} fill="#b45309">α {link.alpha} μs</text>
            <text x={AX_L + AX_W} y={158} textAnchor="end" fontSize={11} fill="#1d4ed8">n/B {fmt(transfer)} μs</text>
            <text x={AX_L + AX_W / 2} y={172} textAnchor="middle" fontSize={10.5} fill="#64748b">합 {fmt(total)} μs 중 α {Math.round((link.alpha / total) * 100)}%</text>
          </svg>
        );
      }}
    />
  );
}
