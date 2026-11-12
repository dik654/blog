import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case·#why-scale·#scale — 0.00001~0.1을 보통 자와 로그 좌표에 놓으면
 * 같은 중간 위치가 0.050005와 0.001로 갈리고, 10배 구간 네 개의 추첨 비중이 약 0.09·0.9·9·90%와 25%씩으로 갈린다.
 * 모든 수는 본문 범위에서 계산합니다. 25%는 균등 로그 추첨 가정에서만 성립합니다.
 */
const EDGES: readonly number[] = [0.00001, 0.0001, 0.001, 0.01, 0.1];
const EDGE_TEXT: readonly string[] = ["0.00001", "0.0001", "0.001", "0.01", "0.1"];
const SPAN = 0.1 - 0.00001;
const BANDS = [0, 1, 2, 3].map((i) => ({
  mark: ["①", "②", "③", "④"][i],
  range: `${EDGE_TEXT[i]}~${EDGE_TEXT[i + 1]}`,
  linShare: (EDGES[i + 1] - EDGES[i]) / SPAN,
}));

const SCENES = [
  {
    label: "보통 자 · 중간 위치는 0.050005",
    summary: "(0.00001 + 0.1) ÷ 2 = 0.050005",
    log: false,
    note: "0.00001부터 0.1까지를 보통 자로 잰 축입니다. 한가운데 위치는 두 끝의 평균 0.050005입니다. ①~③ 세 구간(0.00001~0.01)은 합쳐도 왼쪽 약 10% 폭에 몰려 있습니다.",
  },
  {
    label: "보통 균등 추첨 · ④가 약 90%",
    summary: "0.09 ÷ 0.00009 = 1,000배",
    log: false,
    note: "보통 균등 추첨에서는 구간에 뽑힐 비중이 그 구간의 길이에 비례합니다. 0.01~0.1(④)은 0.00001~0.0001(①)보다 1,000배 길어서 전체의 약 90%를 가져가고 ①은 약 0.09%에 그칩니다.",
  },
  {
    label: "로그 좌표 · 중간 위치는 0.001",
    summary: "−5 + 0.5 × 4 = −3 → 10⁻³ = 0.001",
    log: true,
    note: "로그 좌표는 값 대신 10의 몇 제곱인지(지수)를 축에 놓습니다. 두 끝은 −5와 −1이고 상대 위치 u=0.5는 −3, 원래 단위로 돌리면 0.001입니다. 같은 범위, 같은 중간 위치인데 값이 다릅니다.",
  },
  {
    label: "균등 로그 추첨 · 네 구간 각 25%",
    summary: "로그 길이 1 × 4 → 각 1/4",
    log: true,
    note: "네 구간은 로그 길이가 1로 같으므로 로그 좌표에서 균등하게 뽑으면 각각 25%입니다. 양의 범위와 균등 로그 추첨이라는 가정에 기댄 계산입니다. 로그 축을 쓰는 모든 탐색기가 균등 추첨을 하는 것은 아니므로, 로그 좌표 설정만으로 25%가 보장되지는 않습니다.",
  },
] as const;

const X0 = 24;
const W = 296;
const BAND_FILL = ["#2563eb", "#94a3b8", "#2563eb", "#94a3b8"] as const;
const MID = "#d97706";

function pct(share: number) {
  const value = share * 100;
  return `약 ${value < 0.1 ? value.toFixed(2) : value.toFixed(1)}%`;
}

export default function ScaleShareViz() {
  return (
    <SceneShell
      eyebrow="같은 범위, 다른 자"
      title="보통 자와 로그 좌표에서 같은 범위가 다르게 나뉩니다"
      description="학습률 범위 0.00001~0.1을 10배씩 커지는 네 구간 ①~④로 나눠, 두 가지 축에서 중간 위치와 구간별 추첨 비중을 비교합니다. 범위와 추첨 방식은 본문의 가정입니다(가정)."
      ariaLabel="0.00001부터 0.1까지를 보통 축과 로그 축에 놓아 중간 위치와 네 구간의 추첨 비중을 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const shares = BANDS.map((band) => (scene.log ? 0.25 : band.linShare));
        const starts = shares.map((_, i) => shares.slice(0, i).reduce<number>((sum, s) => sum + s, 0));
        const showMid = active === 0 || active === 2;
        const showShare = active === 1 || active === 3;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 344 112" role="img" aria-label={scene.label} className="mx-auto block h-auto w-full max-w-xl">
              {scene.log ? null : (
                <g>
                  <line x1={X0} y1={34} x2={X0 + W * (starts[3])} y2={34} stroke="#2563eb" strokeWidth={1.25} />
                  <line x1={X0} y1={30} x2={X0} y2={38} stroke="#2563eb" strokeWidth={1} />
                  <line x1={X0 + W * starts[3]} y1={30} x2={X0 + W * starts[3]} y2={38} stroke="#2563eb" strokeWidth={1} />
                  <text x={X0} y={24} fontSize={12} fontWeight={700} fill="#2563eb">
                    ①②③ = 0.00001~0.01, 폭 약 10%
                  </text>
                </g>
              )}
              {BANDS.map((band, i) => {
                const x = X0 + W * starts[i];
                const width = W * shares[i];
                return (
                  <g key={band.mark}>
                    <rect x={x} y={44} width={width} height={20} fill={BAND_FILL[i]} fillOpacity={0.35} stroke={BAND_FILL[i]} strokeWidth={1} />
                    {width > 30 ? (
                      <text x={x + width / 2} y={58} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">
                        {band.mark}
                      </text>
                    ) : null}
                  </g>
                );
              })}
              {scene.log
                ? EDGE_TEXT.map((text, i) => {
                    const x = X0 + (W * i) / 4;
                    const anchor = i === 0 ? "start" : i === 4 ? "end" : "middle";
                    const strong = active === 2 && i === 2;
                    return (
                      <g key={text}>
                        <line x1={x} y1={64} x2={x} y2={70} stroke="#64748b" strokeWidth={1} />
                        <text x={x} y={84} textAnchor={anchor} fontSize={12} fontWeight={700} fill={strong ? MID : "#64748b"}>
                          {`${i - 5}`.replace("-", "−")}
                        </text>
                        <text x={x} y={100} textAnchor={anchor} fontSize={11} fill={strong ? MID : "#64748b"}>
                          {text}
                        </text>
                      </g>
                    );
                  })
                : [
                    { x: X0, text: "0.00001", anchor: "start" as const },
                    { x: X0 + W / 2, text: "0.050005", anchor: "middle" as const },
                    { x: X0 + W, text: "0.1", anchor: "end" as const },
                  ].map((tick) => (
                    <g key={tick.text}>
                      <line x1={tick.x} y1={64} x2={tick.x} y2={70} stroke="#64748b" strokeWidth={1} />
                      <text
                        x={tick.x}
                        y={86}
                        textAnchor={tick.anchor}
                        fontSize={12}
                        fontWeight={700}
                        fill={active === 0 && tick.text === "0.050005" ? MID : "#64748b"}
                      >
                        {tick.text}
                      </text>
                    </g>
                  ))}
              <g opacity={showMid ? 1 : 0}>
                <line x1={X0 + W / 2} y1={40} x2={X0 + W / 2} y2={68} stroke={MID} strokeWidth={1.25} />
                <text x={X0 + W / 2 + 4} y={24} fontSize={12} fontWeight={700} fill={MID} opacity={scene.log ? 1 : 0}>
                  중간 위치 u=0.5
                </text>
              </g>
            </svg>
            <div className="mt-3 space-y-2">
              {BANDS.map((band, i) => (
                <div key={band.mark} className="grid grid-cols-[8.5rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs sm:grid-cols-[10rem_minmax(0,1fr)_4.5rem] sm:text-sm">
                  <span className="font-mono text-muted-foreground">
                    {band.mark} {band.range}
                  </span>
                  <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                    <div
                      className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                      style={{ width: `${shares[i] * 100}%`, backgroundColor: BAND_FILL[i], opacity: showShare ? 0.85 : 0.35 }}
                    />
                  </div>
                  <span className={`text-right font-mono ${showShare ? "font-bold" : "text-muted-foreground"}`}>
                    {scene.log ? "25%" : pct(shares[i])}
                  </span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">막대 = 그 구간에 추첨이 떨어질 비중</p>
            </div>
          </div>
        );
      }}
    />
  );
}
