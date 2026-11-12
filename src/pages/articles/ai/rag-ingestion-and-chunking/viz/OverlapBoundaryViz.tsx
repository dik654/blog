import SceneShell from "./SceneShell";

/**
 * 본문 대응: #chunking — 1,000 token 문서를 size 500으로 자를 때 overlap이 경계 문장을 살리는지 본다.
 * overlap 50: 시작점 0·450·900 → [0,500) [450,950) [900,1000), 480~530 문장은 둘째 chunk에 온전히 들어감.
 * overlap 0: [0,500) [500,1000), 같은 문장이 둘로 갈림.
 * 430~560 span은 경계 500 앞쪽(70 token)이 overlap 50보다 길어 어느 chunk에도 온전히 들지 않는 예(가정).
 * 같은 길이라도 450 이후에 시작하면 둘째 chunk에 들어가므로 'span 길이 > overlap'만으로는 실패하지 않는다.
 */
const W = 360;
const L = 8;
const R = 352;
const x = (token: number) => L + (token / 1000) * (R - L);
const COLORS = ["#2563eb", "#0d9488", "#7c3aed"] as const;

const SCENES = [
  {
    label: "size 500 · overlap 50",
    summary: "480~530 → 둘째 chunk에 온전히",
    chunks: [[0, 500], [450, 950], [900, 1000]],
    span: [480, 530],
    whole: 1,
    note: "시작점이 450씩 전진해 0·450·900이 됩니다. 이웃 chunk가 50 token씩 겹치므로 480~530 문장은 [450,950) 안에 처음부터 끝까지 들어갑니다.",
  },
  {
    label: "size 500 · overlap 0",
    summary: "480~530 → 두 chunk에 나뉨",
    chunks: [[0, 500], [500, 1000]],
    span: [480, 530],
    whole: -1,
    note: "겹침이 없으면 시작점은 0·500이고 chunk는 2개입니다. 같은 문장이 500에서 잘려 480~500은 첫째, 500~530은 둘째 chunk로 갈립니다.",
  },
  {
    label: "경계 앞쪽이 overlap보다 긴 span",
    summary: "430~560 → 어느 chunk에도 온전히 없음",
    chunks: [[0, 500], [450, 950], [900, 1000]],
    span: [430, 560],
    whole: -1,
    note: "overlap 50인 같은 분할에 span 430~560을 놓았습니다(가정). 첫 chunk는 500에서 끝나 뒤쪽 60 token을 놓치고, 둘째는 450에서 시작해 앞쪽 20 token을 놓칩니다. 경계 500 앞쪽 430~500이 70 token으로 overlap 50보다 길기 때문입니다. 같은 130 token이라도 450 뒤에서 시작했다면 둘째 chunk에 들어갔습니다. overlap은 경계 손실을 줄이지만 없애지는 않습니다.",
  },
] as const;

export default function OverlapBoundaryViz() {
  return (
    <SceneShell
      eyebrow="고정 길이 분할"
      title="겹치는 50 token이 경계에 걸린 문장을 살리기도, 못 살리기도 합니다"
      description="가로축은 1,000 token 문서의 위치입니다. 색 막대 하나가 chunk 하나이고, 아래 주황 막대가 따라가는 문장(span)입니다."
      note="1,000 token 문서와 480~530 문장은 본문 예이고, 430~560 span은 설명용 가정입니다."
      ariaLabel="chunk 경계와 overlap에 따라 문장이 한 chunk에 온전히 들어가는지 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const chunks: readonly (readonly number[])[] = scene.chunks;
        const [s0, s1] = scene.span;
        return (
          <svg viewBox={`0 0 ${W} 170`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {chunks.map(([a, b], index) => {
              const y = 10 + index * 30;
              const whole = index === scene.whole;
              return (
                <g key={`${a}-${b}`}>
                  <rect x={x(a)} y={y} width={x(b) - x(a)} height={20} rx={3} fill={COLORS[index]} fillOpacity={whole ? 0.75 : 0.35} stroke={COLORS[index]} strokeWidth={whole ? 1.25 : 1} />
                  <text x={b - a < 200 ? x(b) - 6 : x(a) + 6} y={y + 14} textAnchor={b - a < 200 ? "end" : "start"} fontSize={13} fontWeight={700} fill={whole ? "#ffffff" : "#1e293b"}>
                    [{a},{b === 1000 ? "1,000" : b})
                  </text>
                </g>
              );
            })}
            <line x1={x(s0)} x2={x(s0)} y1={6} y2={124} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={x(s1)} x2={x(s1)} y1={6} y2={124} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
            <rect x={x(s0)} y={104} width={x(s1) - x(s0)} height={16} rx={2} fill="#d97706" fillOpacity={0.8} />
            <text x={x(s1) + 6} y={117} fontSize={13} fontWeight={700} fill="#b45309">
              span {s0}~{s1}
            </text>
            <line x1={L} x2={R} y1={140} y2={140} stroke="#94a3b8" strokeWidth={1} />
            {[0, 500, 1000].map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={137} y2={143} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(tick)} y={158} textAnchor={tick === 0 ? "start" : tick === 1000 ? "end" : "middle"} fontSize={13} fill="#64748b">
                  {tick === 1000 ? "1,000" : tick}
                </text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
