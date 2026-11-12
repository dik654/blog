import SceneShell from "./SceneShell";

/**
 * 본문 대응: #best-of-n — pass@N=1-(1-p)^N, Acc(N)=q·pass@N.
 * 식 해석의 예시 값 p=0.3, q=0.9를 그대로 쓴다.
 * N=1: 0.300/0.270 · N=4: 0.760/0.684 · N=8: 0.942/0.848 · N=16: 0.997/0.897 → q=0.9 아래에 머문다.
 */
const P = 0.3;
const Q = 0.9;
const MAX_N = 16;
const NS = Array.from({ length: MAX_N }, (_, index) => index + 1);
const passAt = (n: number) => 1 - (1 - P) ** n;

const W = 320;
const H = 196;
const X0 = 38;
const X1 = 302;
const Y0 = 162;
const Y1 = 18;
const xOf = (n: number) => X0 + ((n - 1) / (MAX_N - 1)) * (X1 - X0);
const yOf = (value: number) => Y0 - value * (Y0 - Y1);
const pathOf = (fn: (n: number) => number) => NS.map((n, index) => `${index === 0 ? "M" : "L"}${xOf(n).toFixed(1)} ${yOf(fn(n)).toFixed(1)}`).join(" ");
const PASS_PATH = pathOf(passAt);
const ACC_PATH = pathOf((n) => Q * passAt(n));

const SCENES = [
  { label: "후보 1개", n: 1, summary: "pass@1 0.300 · 기대 정답률 0.270", note: "후보가 하나면 그 후보가 정답일 확률 p=0.3이 곧 pass@1입니다. 식은 여기에 verifier 가 정답을 고를 확률 q=0.9를 곱해 0.270을 냅니다." },
  { label: "후보 4개", n: 4, summary: "pass@4 0.760 · 기대 정답률 0.684", note: "네 후보가 모두 틀릴 확률은 0.7⁴=0.240입니다. 1에서 빼면 적어도 하나가 정답일 확률 0.760이고, q를 곱하면 0.684입니다." },
  { label: "후보 8개", n: 8, summary: "pass@8 0.942 · 기대 정답률 0.848", note: "pass@8=0.942는 정답 후보가 있으면 반드시 골라내는 이상적 verifier(오라클)의 상한입니다. q=0.9인 verifier 로는 0.848에 그쳐 0.094를 놓칩니다." },
  { label: "후보를 더 늘리면", n: 16, summary: "pass@16 0.997 · 기대 정답률 0.897", note: "16개면 pass@N은 1에 붙지만 기대 정답률은 q=0.9 점선 아래에 머뭅니다. N을 늘려도 q를 넘지 못합니다." },
] as const;

export default function BestOfNCeilingViz() {
  return (
    <SceneShell
      eyebrow="Best-of-N · p=0.3 · q=0.9"
      title="후보를 늘려도 verifier 정확도 위로는 오르지 않습니다"
      description="pass@N은 N개 후보 중 정답이 하나라도 있을 확률이고, q는 정답 후보가 있을 때 verifier 가 그것을 최고 점수로 고를 확률입니다. p=0.3·q=0.9는 아래 식 해석의 예시 값입니다."
      note="후보가 서로 독립이고 같은 p를 공유한다는 식의 가정을 따릅니다."
      ariaLabel="후보 수 N에 따른 pass@N과 기대 정답률, 그리고 q 상한"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const pass = passAt(scene.n);
        const acc = Q * pass;
        const x = xOf(scene.n);
        const labelLeft = scene.n > 10;
        return (
          <div className="min-w-0">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-0.5 w-4" style={{ backgroundColor: "#64748b" }} />pass@N (정답 후보가 있을 확률)</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-0.5 w-4" style={{ backgroundColor: "#2563eb" }} />기대 정답률 q·pass@N</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 border-t border-dashed" style={{ borderColor: "#94a3b8" }} />q = 0.9</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-2 h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {[0, 0.5, 1].map((tick) => (
                <g key={tick}>
                  <line x1={X0} x2={X1} y1={yOf(tick)} y2={yOf(tick)} stroke="#e2e8f0" strokeWidth={1} />
                  <text x={X0 - 6} y={yOf(tick) + 3} textAnchor="end" fontSize={11} fill="#64748b">{tick.toFixed(1)}</text>
                </g>
              ))}
              <line x1={X0} x2={X1} y1={yOf(Q)} y2={yOf(Q)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
              <text x={X0 - 6} y={yOf(Q) + 3} textAnchor="end" fontSize={11} fill="#64748b">0.9</text>
              <path d={PASS_PATH} fill="none" stroke="#64748b" strokeWidth={1.25} />
              <path d={ACC_PATH} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <line x1={x} x2={x} y1={Y0} y2={yOf(pass)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
              <line x1={x} x2={x} y1={yOf(pass)} y2={yOf(acc)} stroke="#d97706" strokeWidth={1.25} />
              <circle cx={x} cy={yOf(pass)} r={3.5} fill="#64748b" />
              <circle cx={x} cy={yOf(acc)} r={3.5} fill="#2563eb" />
              <text x={labelLeft ? x - 7 : x + 7} y={yOf(pass) - 5} textAnchor={labelLeft ? "end" : "start"} fontSize={12} fontWeight={700} fill="#64748b">{pass.toFixed(3)}</text>
              <text x={labelLeft ? x - 7 : x + 7} y={yOf(acc) + 14} textAnchor={labelLeft ? "end" : "start"} fontSize={12} fontWeight={700} fill="#2563eb">{acc.toFixed(3)}</text>
              {[1, 4, 8, 16].map((n) => (
                <text key={n} x={xOf(n)} y={Y0 + 16} textAnchor="middle" fontSize={11} fill={n === scene.n ? "#2563eb" : "#64748b"} fontWeight={n === scene.n ? 700 : 400}>{n}</text>
              ))}
              <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
              <text x={(X0 + X1) / 2} y={H - 4} textAnchor="middle" fontSize={11} fill="#64748b">후보 수 N</text>
            </svg>
          </div>
        );
      }}
    />
  );
}
