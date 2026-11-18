import SceneShell from "./SceneShell";

/**
 * 본문 대응: #key-boundary — 0을 암호화하면 g⁰=1이라 암호문은 rⁿ mod n²만 남는다.
 * n=15: unit 8개 → r¹⁵ mod 225 = 1,143,199,118,107,26,82,224 (8개 모두 다름).
 * n=21: unit 12개 → r²¹ mod 441 ∈ {1,197,244,440}, 각 출력에 난수 3개씩.
 */
const KEYS = [
  {
    n: 15,
    pairs: [[1, 1], [2, 143], [4, 199], [7, 118], [8, 107], [11, 26], [13, 82], [14, 224]],
    outputs: [1, 143, 199, 118, 107, 26, 82, 224],
  },
  {
    n: 21,
    pairs: [[1, 1], [2, 197], [4, 1], [5, 440], [8, 197], [10, 244], [11, 197], [13, 244], [16, 1], [17, 440], [19, 244], [20, 440]],
    outputs: [1, 197, 244, 440],
  },
] as const;

const SCENES = [
  { label: "n=15 · 정상 키", summary: "난수 8개 → 서로 다른 출력 8개", note: "0을 암호화하면 메시지 성분은 1이고 난수 성분 r¹⁵ mod 225만 남습니다. 8개 unit이 모두 다른 암호문으로 갑니다. 본문의 120개 메시지·난수 쌍 중 0의 8개만 그렸습니다." },
  { label: "n=21 · gcd(λ,n)=3", summary: "난수 12개 → 출력 4개", note: "λ=6과 n=21이 서로소가 아닌 키에서는 12개 unit이 1, 197, 244, 440 네 값에 세 개씩 몰립니다. 그런데도 이 키에서 원문 CRT 경로는 252개 조합을 모두 올바르게 복호했으므로, 왕복 성공만으로는 이 차이를 알 수 없습니다." },
] as const;

const TOP = 22;
const STEP = 17;
const LX = 120;
const RX = 250;

export default function EncZeroCollapseViz() {
  return (
    <SceneShell
      eyebrow="난수 분포"
      title="조건을 어긴 키에서는 난수 12개가 암호문 4개로 겹칩니다"
      description="왼쪽은 0을 암호화할 때 고른 unit 난수 r, 오른쪽은 나온 암호문 rⁿ mod n²입니다(0을 암호화하면 g⁰=1이라 난수 성분만 남습니다). 선 하나가 한 번의 암호화입니다."
      ariaLabel="n=15와 n=21에서 0을 암호화한 난수와 암호문의 대응"
      scenes={SCENES}
      render={(active) => {
        const key = KEYS[active];
        const rows = key.pairs.length;
        const outs: readonly number[] = key.outputs;
        const outGap = (STEP * (12 - 1)) / Math.max(outs.length - 1, 1);
        const outY = (value: number) => TOP + outs.indexOf(value) * (outs.length === rows ? STEP : outGap);
        return (
          <svg viewBox="40 0 300 250" className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LX} y={12} textAnchor="end" fontSize={11} fill="#64748b">난수 r</text>
            <text x={RX - 10} y={12} fontSize={11} fill="#64748b">r<tspan dy={-4} fontSize={9}>{key.n}</tspan><tspan dy={4}>{` mod ${key.n * key.n}`}</tspan></text>
            {key.pairs.map(([r, out], index) => {
              const y = TOP + index * STEP;
              return (
                <g key={r}>
                  <text x={LX} y={y + 4} textAnchor="end" fontSize={12} fill="#334155">{r}</text>
                  <line x1={LX + 6} y1={y} x2={RX - 8} y2={outY(out)} stroke={active === 0 ? "#2563eb" : "#d97706"} strokeWidth={1} strokeOpacity={0.7} />
                </g>
              );
            })}
            {outs.map((value) => (
              <g key={value}>
                <circle cx={RX - 4} cy={outY(value)} r={3} fill={active === 0 ? "#2563eb" : "#d97706"} />
                <text x={RX + 4} y={outY(value) + 4} fontSize={12} fontWeight={700} fill="#334155">{value}</text>
              </g>
            ))}
            <text x={190} y={244} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">
              {`난수 ${rows}개 → 서로 다른 암호문 ${outs.length}개`}
            </text>
          </svg>
        );
      }}
    />
  );
}
