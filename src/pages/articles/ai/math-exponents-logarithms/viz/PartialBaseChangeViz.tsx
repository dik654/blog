import SceneShell from "./SceneShell";

/**
 * 본문 대응: #log-bases ProgressiveDetail — 설명용 모형 q(θ)=exp(−(θ−1)²)(가정).
 * A(θ)=(θ−1)²+θ² → 최소 θ=1/2, 값 0.5
 * 전체 ÷ln2: A/ln2 → 최소 θ=1/2, 값 ≈0.721348
 * 첫 항만 ÷ln2: (θ−1)²/ln2+θ² → 최소 θ=1/(1+ln2)≈0.590616, 값 ≈0.590616
 */
const LN2 = Math.log(2);
const natural = (t: number) => (t - 1) ** 2 + t ** 2;
const wholeBits = (t: number) => natural(t) / LN2;
const firstOnly = (t: number) => (t - 1) ** 2 / LN2 + t ** 2;
const SHIFTED = 1 / (1 + LN2);

const SCENES = [
  { label: "자연로그 비용 + θ²", summary: "최소 위치 θ = 0.5", note: "가정 모형에서 자연로그 비용 (θ−1)²에 추가 비용 θ²를 더한 곡선입니다. 미분 2(θ−1)+2θ가 0이 되는 θ=1/2에서 가장 낮습니다." },
  { label: "식 전체를 1/ln2배", summary: "최소 위치 그대로 θ = 0.5", note: "두 항에 같은 양수 1/ln2를 곱하면 곡선 전체가 같은 배수로 높아질 뿐입니다. 함수값은 커지지만 가장 낮은 위치는 그대로 θ=1/2입니다." },
  { label: "첫 항만 1/ln2배", summary: "최소 위치 θ ≈ 0.5906", note: "첫 항만 밑 2로 바꾸면 그 항의 비중만 커져 두 항의 균형이 바뀝니다. 가장 낮은 위치가 θ=1/(1+ln2)≈0.590616으로 옮겨집니다." },
] as const;

const W = 360;
const H = 210;
const LEFT = 34;
const RIGHT = 344;
const TOP = 16;
const BOTTOM = 176;
const Y_MAX = 1.6;
const px = (t: number) => LEFT + t * (RIGHT - LEFT);
const py = (v: number) => BOTTOM - (v / Y_MAX) * (BOTTOM - TOP);
const curve = (f: (t: number) => number) =>
  Array.from({ length: 101 }, (_, i) => {
    const t = i / 100;
    return `${i === 0 ? "M" : "L"}${px(t).toFixed(1)},${py(f(t)).toFixed(1)}`;
  }).join(" ");

const ACCENT = "#2563eb";
const BASE = "#64748b";
const MUTED = "#94a3b8";

export default function PartialBaseChangeViz() {
  return (
    <SceneShell
      eyebrow="한 항만 단위를 바꾸면"
      title="전체를 같은 배수로 키우면 최저점이 그대로, 한 항만 키우면 옮겨집니다"
      description="가로축은 조정하는 값 θ, 세로축은 비용입니다. 아래 펼침 글의 설명용 모형 q(θ)=exp(−(θ−1)²)을 씁니다(가정)."
      ariaLabel="자연로그 비용 곡선과 전체 또는 첫 항만 1/ln2배 한 곡선의 최소 위치 비교"
      scenes={SCENES}
      render={(active) => {
        const target = active === 0 ? natural : active === 1 ? wholeBits : firstOnly;
        const minT = active === 2 ? SHIFTED : 0.5;
        const minV = target(minT);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={LEFT} x2={RIGHT} y1={BOTTOM} y2={BOTTOM} stroke={MUTED} strokeWidth={1} />
            <line x1={LEFT} x2={LEFT} y1={TOP} y2={BOTTOM} stroke={MUTED} strokeWidth={1} />
            {[0, 0.5, 1].map((t) => (
              <g key={t}>
                <line x1={px(t)} x2={px(t)} y1={BOTTOM} y2={BOTTOM + 4} stroke={MUTED} strokeWidth={1} />
                <text x={px(t)} y={BOTTOM + 16} textAnchor="middle" fontSize={11} fill={BASE}>{t}</text>
              </g>
            ))}
            {[0.5, 1, 1.5].map((v) => (
              <text key={v} x={LEFT - 5} y={py(v) + 4} textAnchor="end" fontSize={10} fill={BASE}>{v}</text>
            ))}
            <text x={RIGHT} y={BOTTOM + 30} textAnchor="end" fontSize={11} fill={BASE}>θ</text>
            <path d={curve(natural)} fill="none" stroke={active === 0 ? ACCENT : MUTED} strokeWidth={active === 0 ? 1.25 : 1} strokeDasharray={active === 0 ? undefined : "4 3"} />
            {active > 0 && <path d={curve(target)} fill="none" stroke={ACCENT} strokeWidth={1.25} />}
            <line x1={px(0.5)} x2={px(0.5)} y1={TOP} y2={BOTTOM} stroke={MUTED} strokeWidth={1} strokeDasharray="2 3" />
            <line x1={px(minT)} x2={px(minT)} y1={py(minV)} y2={BOTTOM} stroke={ACCENT} strokeWidth={1} />
            <circle cx={px(minT)} cy={py(minV)} r={4.5} fill={ACCENT} />
            <text x={px(minT) + 6} y={BOTTOM - 8} fontSize={11} fontWeight={700} fill={ACCENT}>
              최저 θ={active === 2 ? "0.5906" : "0.5"}
            </text>
            {active > 0 && (
              <text x={px(0.03)} y={py(0.25)} fontSize={11} fill={BASE}>점선: 원래 곡선</text>
            )}
          </svg>
        );
      }}
    />
  );
}
