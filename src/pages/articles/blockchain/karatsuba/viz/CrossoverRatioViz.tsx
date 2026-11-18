import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cost-comparison — 비교 모형(가정): 학교식 n², 한 단계 Karatsuba 3(n/2)²+4n.
 * 비율 = (3(n/2)²+4n)/n² = 3/4 + 4/n → n=8: 80/64=1.25, n=16: 256/256=1, n=32: 896/1024=0.875.
 */
const school = (n: number) => n * n;
const kara = (n: number) => 3 * (n / 2) ** 2 + 4 * n;
const ratio = (n: number) => kara(n) / school(n);

const W = 360;
const H = 190;
const LEFT = 40;
const RIGHT = 14;
const TOP = 16;
const BOTTOM = 156;
const N_MIN = 4;
const N_MAX = 64;
const R_MIN = 0.7;
const R_MAX = 1.8;
const px = (n: number) => LEFT + ((n - N_MIN) / (N_MAX - N_MIN)) * (W - LEFT - RIGHT);
const py = (r: number) => BOTTOM - ((r - R_MIN) / (R_MAX - R_MIN)) * (BOTTOM - TOP);
const CURVE = Array.from({ length: N_MAX - N_MIN + 1 }, (_, index) => N_MIN + index)
  .map((n, index) => `${index === 0 ? "M" : "L"}${px(n).toFixed(1)},${py(ratio(n)).toFixed(1)}`)
  .join(" ");
const X_TICKS = [4, 8, 16, 32, 64] as const;
const Y_TICKS = [0.75, 1, 1.25, 1.5, 1.75] as const;

const SCENES = [
  { label: "n = 8", n: 8, summary: "64 대 80 → 1.25배", note: "학교식은 8²=64, 한 단계 Karatsuba는 3×4²+32=80입니다. 절약한 곱보다 추가 합산 비용 4n이 커서 Karatsuba가 더 비쌉니다." },
  { label: "n = 16", n: 16, summary: "256 대 256 → 1배", note: "학교식 256, Karatsuba 3×8²+64=256으로 같습니다. 이 모형에서는 여기가 전환점입니다." },
  { label: "n = 32", n: 32, summary: "1024 대 896 → 0.875배", note: "학교식 1024, Karatsuba 3×16²+128=896으로 순서가 바뀝니다. 다만 4n은 측정값이 아닌 가정이라, 이 전환점 16을 실제 라이브러리 임계값으로 옮기면 안 됩니다." },
] as const;

export default function CrossoverRatioViz() {
  return (
    <SceneShell
      eyebrow="비용 비율"
      title="1보다 아래로 내려가는 크기부터 Karatsuba가 쌉니다"
      description="가로축은 자리 수 n, 세로축은 한 단계 Karatsuba 비용을 학교식 비용으로 나눈 비율입니다. 두 비용은 13절의 비교 모형 n²과 3(n/2)²+4n이며(가정), CPU에서 잰 값이 아닙니다."
      ariaLabel="자리 수 8, 16, 32에서 한 단계 Karatsuba와 학교식 비용 모형의 비율"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const r = ratio(scene.n);
        const cheaper = r < 1;
        const color = r > 1 ? "#d97706" : cheaper ? "#2563eb" : "#475569";
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <rect x={LEFT} y={TOP} width={W - LEFT - RIGHT} height={py(1) - TOP} fill="#f59e0b" opacity={0.08} />
              <text x={W - RIGHT - 4} y={TOP + 12} textAnchor="end" fontSize={10} fill="#b45309">Karatsuba가 더 비쌈</text>
              <text x={LEFT + 4} y={BOTTOM - 6} fontSize={10} fill="#1d4ed8">Karatsuba가 더 쌈</text>
              {Y_TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={LEFT} x2={W - RIGHT} y1={py(tick)} y2={py(tick)} stroke={tick === 1 ? "#475569" : "#cbd5e1"} strokeWidth={1} strokeDasharray={tick === 1 ? undefined : "2 3"} />
                  <text x={LEFT - 6} y={py(tick) + 3} textAnchor="end" fontSize={10} fill="#64748b">{tick}</text>
                </g>
              ))}
              {X_TICKS.map((tick) => (
                <text key={tick} x={px(tick)} y={BOTTOM + 16} textAnchor="middle" fontSize={10} fill="#64748b">{tick}</text>
              ))}
              <text x={W - RIGHT} y={BOTTOM + 30} textAnchor="end" fontSize={10} fill="#64748b">자리 수 n</text>
              <path d={CURVE} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <line x1={px(scene.n)} x2={px(scene.n)} y1={TOP} y2={BOTTOM} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={px(scene.n)} cy={py(r)} r={4.5} fill={color} />
              <text x={px(scene.n) + 7} y={py(r) - 7} fontSize={11} fontWeight={700} fill={color}>{r}배</text>
            </svg>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-md border border-border bg-background px-2 py-2">
                <span className="block text-muted-foreground">학교식 n²</span>
                <span className="block font-mono text-sm font-bold">{school(scene.n)}</span>
              </div>
              <div className="rounded-md border px-2 py-2" style={{ borderColor: color }}>
                <span className="block text-muted-foreground">3(n/2)²+4n</span>
                <span className="block font-mono text-sm font-bold" style={{ color }}>{kara(scene.n)}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
