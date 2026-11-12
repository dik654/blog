import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bm25-saturation-and-length-norm — 한 term의 기여 idf·f/(f+k1·B).
 * idf=0.4700, k1=1.2, B(D1)=0.8125, B(D3)=1.375.
 * D1: f=1 0.2380, f=2 0.3160, f=10 0.4282 · D3: f=1 0.1774, f=2 0.2575, f=10 0.4034.
 * D3에 충전 한 번 더(길이 고정): 충전 기여 0.2575 < 2×0.1774=0.3547, 총점 0.2575+0.1774=0.4349.
 * TF-IDF(3절, idf=ln 1.5=0.4055)는 반복마다 같은 0.4055를 더한다.
 */
const IDF = Math.log(1 + 1.5 / 2.5);
const K1 = 1.2;
const B_D1 = 0.8125;
const B_D3 = 1.375;
const MAX_F = 10;
const contribution = (f: number, lengthB: number) => (IDF * f) / (f + K1 * lengthB);

const W = 320;
const H = 198;
const X0 = 40;
const X1 = 302;
const Y0 = 164;
const Y1 = 18;
const Y_MAX = 0.5;
const xOf = (f: number) => X0 + (f / MAX_F) * (X1 - X0);
const yOf = (value: number) => Y0 - (value / Y_MAX) * (Y0 - Y1);
const STEPS = Array.from({ length: MAX_F * 4 + 1 }, (_, index) => index / 4);
const pathOf = (lengthB: number) => STEPS.map((f, index) => `${index === 0 ? "M" : "L"}${xOf(f).toFixed(1)} ${yOf(contribution(f, lengthB)).toFixed(1)}`).join(" ");
const D1_PATH = pathOf(B_D1);
const D3_PATH = pathOf(B_D3);

interface Mark {
  f: number;
  lengthB: number;
  color: string;
  below?: boolean;
}

const D1_COLOR = "#2563eb";
const D3_COLOR = "#d97706";

const SCENES = [
  { label: "D1의 충전 1회 → 2회", summary: "0.2380 → 0.3160", showD3: false, marks: [{ f: 1, lengthB: B_D1, color: D1_COLOR, below: true }, { f: 2, lengthB: B_D1, color: D1_COLOR }] as readonly Mark[], note: "충전이 한 번이면 0.2380, 두 번이면 0.3160입니다. 두 번째 반복은 0.0780만 더합니다. 3절의 TF-IDF였다면 두 번째 반복도 첫 번째와 같은 0.4055를 더했습니다." },
  { label: "같은 1회, 다른 길이", summary: "D1 0.2380 · D3 0.1774", showD3: true, marks: [{ f: 1, lengthB: B_D1, color: D1_COLOR }, { f: 1, lengthB: B_D3, color: D3_COLOR, below: true }] as readonly Mark[], note: "같은 TF 1이라도 길이 6인 D3는 B=1.375로 분모가 커져 0.1774, 길이 3인 D1은 0.2380입니다. 같은 TF에서 주황 곡선은 늘 파란 곡선 아래에 있습니다." },
  { label: "D3에 충전 한 번 더", summary: "충전 0.1774 → 0.2575 · 두 배(0.3547) 아님", showD3: true, marks: [{ f: 1, lengthB: B_D3, color: D3_COLOR, below: true }, { f: 2, lengthB: B_D3, color: D3_COLOR, below: true }] as readonly Mark[], note: "D3 길이를 6으로 둔 채 충전을 한 번 더 넣으면 충전의 기여는 0.1774→0.2575로 오르지만, 한 번일 때의 두 배인 0.3547에는 못 미칩니다. 오류 0.1774를 더한 D3 총점은 0.3547→0.4349입니다." },
  { label: "반복이 열 번이면", summary: "D1 0.4282 · D3 0.4034", showD3: true, marks: [{ f: 10, lengthB: B_D1, color: D1_COLOR }, { f: 10, lengthB: B_D3, color: D3_COLOR, below: true }] as readonly Mark[], note: "TF가 10이어도 두 곡선은 점선 idf=0.4700 아래에 머뭅니다. TF-IDF에서는 반복 열 번이 기여 열 배(0.4055×10=4.055)입니다. 실제로는 반복이 늘면 문서 길이도 함께 늘어납니다." },
] as const;

export default function Bm25SaturationViz() {
  return (
    <SceneShell
      eyebrow="BM25 · term 하나의 기여"
      title="반복은 갈수록 덜 더해지고, 긴 문서는 덜 받습니다"
      description="곡선은 query term 하나가 점수에 더하는 값 idf × TF ÷ (TF + k1×B)입니다. B는 문서 길이를 평균 길이 4와 비교한 길이 보정값으로 D1(길이 3)은 0.8125, D3(길이 6)은 1.375이고, k1=1.2는 Lucene 기본값입니다."
      note="idf=0.4700은 세 문서 중 두 문서에 나온 충전·오류의 값입니다. D1의 TF 1·2와 D3의 TF 1만 글의 사례이고, 나머지 지점은 길이를 고정하고 TF만 바꾼 설명용 값입니다(가정)."
      ariaLabel="TF와 문서 길이에 따른 BM25 한 term 기여 곡선"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-0.5 w-4" style={{ backgroundColor: D1_COLOR }} />D1 길이 3 · B=0.8125</span>
              <span className={`inline-flex items-center gap-1.5 ${scene.showD3 ? "" : "opacity-40"}`}><span className="inline-block h-0.5 w-4" style={{ backgroundColor: D3_COLOR }} />D3 길이 6 · B=1.375</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 border-t border-dashed" style={{ borderColor: "#94a3b8" }} />idf 0.4700</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-2 h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {[0, 0.2, 0.4].map((tick) => (
                <g key={tick}>
                  <line x1={X0} x2={X1} y1={yOf(tick)} y2={yOf(tick)} stroke="#e2e8f0" strokeWidth={1} />
                  <text x={X0 - 6} y={yOf(tick) + 3} textAnchor="end" fontSize={11} fill="#64748b">{tick.toFixed(1)}</text>
                </g>
              ))}
              <line x1={X0} x2={X1} y1={yOf(IDF)} y2={yOf(IDF)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
              <text x={X0 - 6} y={yOf(IDF) + 3} textAnchor="end" fontSize={11} fill="#64748b">0.47</text>
              <path d={D1_PATH} fill="none" stroke={D1_COLOR} strokeWidth={1.25} />
              <path d={D3_PATH} fill="none" stroke={D3_COLOR} strokeWidth={1.25} opacity={scene.showD3 ? 1 : 0.15} />
              {scene.marks.map((mark) => {
                const value = contribution(mark.f, mark.lengthB);
                const x = xOf(mark.f);
                const y = yOf(value);
                const anchorEnd = mark.f >= 8;
                return (
                  <g key={`${mark.f}-${mark.lengthB}`}>
                    <line x1={x} x2={x} y1={Y0} y2={y} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
                    <circle cx={x} cy={y} r={3.5} fill={mark.color} />
                    <text x={anchorEnd ? x - 7 : x + 7} y={mark.below ? y + 15 : y - 7} textAnchor={anchorEnd ? "end" : "start"} fontSize={12} fontWeight={700} fill={mark.color}>{value.toFixed(4)}</text>
                  </g>
                );
              })}
              {[0, 1, 2, 5, 10].map((f) => (
                <text key={f} x={xOf(f)} y={Y0 + 16} textAnchor="middle" fontSize={11} fill="#64748b">{f}</text>
              ))}
              <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
              <text x={(X0 + X1) / 2} y={H - 2} textAnchor="middle" fontSize={11} fill="#64748b">문서 안 반복 횟수 TF</text>
            </svg>
          </div>
        );
      }}
    />
  );
}
