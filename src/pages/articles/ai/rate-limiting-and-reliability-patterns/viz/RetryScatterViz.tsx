import SceneShell from "./SceneShell";

/**
 * 본문 대응: #retry-backoff — t_n = min(t_max, t0·2^n)·U(0,1), t0 = 200ms.
 * n=0..3 → 0.2, 0.4, 0.8, 1.6초. Jitter를 곱하면 n=3의 재시도가 0~1.6초로 흩어진다.
 * 상한 1초와 client 12개, 점의 위치는 그림을 위한 가정이다.
 */
const W = 360;
const H = 214;
const x = (seconds: number) => 16 + (seconds / 2) * 328;
const WAITS = [0.2, 0.4, 0.8, 1.6];
const CAP = 1;
const JITTER = [0.07, 0.62, 0.29, 0.91, 0.44, 0.16, 0.78, 0.36, 0.98, 0.53, 0.22, 0.7];

const SCENES = [
  { label: "바로 다시 보내면", summary: "12개 모두 0초", note: "기다리지 않으면 같은 순간 실패한 client가 같은 순간 다시 보냅니다. 이미 힘든 backend에 요청이 한꺼번에 돌아옵니다." },
  { label: "대기만 두 배씩 늘리면", summary: "200ms × 2³ = 1.6초", note: "대기는 길어졌지만 모두 같은 규칙을 따르면 1.6초 지점에서 다시 한꺼번에 도착합니다. 몰리는 시각이 뒤로 밀릴 뿐입니다." },
  { label: "Jitter를 곱하면", summary: "1.6초 × U(0,1) → 0~1.6초", note: "client마다 0과 1 사이 무작위 값을 새로 뽑아 곱합니다. 재시도가 0~1.6초 사이로 흩어져 한 순간에 몰리지 않습니다." },
  { label: "상한으로 자르면", summary: "min(1초, 1.6초) = 1초 (가정)", note: "1.6초가 1초로 잘려 재시도가 0~1초 사이에 놓입니다. 상한이 없으면 n이 커질수록 소수의 요청이 지나치게 오래 기다립니다." },
] as const;

export default function RetryScatterViz() {
  return (
    <SceneShell
      eyebrow="재시도 시점"
      title="같은 순간 실패한 client들이 언제 다시 보내는지 봅니다"
      description="가로축은 실패 뒤 흐른 시간, n은 지금까지 다시 시도한 횟수입니다. 아래 점 하나가 n=3 재시도를 보내는 client 하나입니다(12개, 위치는 무작위 예시, 가정)."
      ariaLabel="재시도 대기 시간이 두 배씩 늘어나는 막대와, jitter와 상한에 따라 client들의 재시도 시점이 흩어지는 모습"
      scenes={SCENES}
      render={(active) => {
        const times = JITTER.map((u) => (active === 0 ? 0 : active === 1 ? 1.6 : active === 2 ? 1.6 * u : CAP * u));
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={16} y={10} fontSize={11} fontWeight={700} fill="#64748b">재시도 대기 시간</text>
            {WAITS.map((wait, n) => {
              const y = 17 + n * 14;
              const capped = active === 3 && wait > CAP;
              const shown = capped ? CAP : wait;
              const highlight = active !== 0 && n === 3;
              return (
                <g key={n} opacity={active === 0 ? 0.3 : 1}>
                  <rect x={x(0)} y={y} width={x(shown) - x(0)} height={9} rx={2} fill={highlight ? "#2563eb" : "#94a3b8"} />
                  {capped && <rect x={x(CAP)} y={y} width={x(wait) - x(CAP)} height={9} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 2" />}
                  <text x={x(wait) + 5} y={y + 8} fontSize={10.5} fontWeight={highlight ? 700 : 400} fill={highlight ? "#2563eb" : "#64748b"}>
                    {`n=${n} · ${capped ? "1초" : `${wait}초`}`}
                  </text>
                </g>
              );
            })}
            <text x={16} y={85} fontSize={11} fontWeight={700} fill="#64748b">n=3 재시도가 도착하는 시각</text>
            {active === 3 && (
              <>
                <line x1={x(CAP)} x2={x(CAP)} y1={57} y2={190} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
                <text x={x(CAP) + 5} y={100} fontSize={10.5} fontWeight={700} fill="#d97706">상한 1초(가정)</text>
              </>
            )}
            {times.map((time, index) => (
              <circle key={index} cx={x(time)} cy={94 + index * 8} r={3.2} fill={active === 0 || active === 1 ? "#dc2626" : "#2563eb"} />
            ))}
            <line x1={x(0)} x2={W - 16} y1={191} y2={191} stroke="#94a3b8" strokeWidth={1} />
            {[0, 0.4, 0.8, 1.2, 1.6, 2].map((tick) => (
              <text key={tick} x={x(tick)} y={205} textAnchor="middle" fontSize={10.5} fill="#64748b">{tick}초</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
