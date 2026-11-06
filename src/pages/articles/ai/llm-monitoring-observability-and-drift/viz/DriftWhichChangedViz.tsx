import SceneShell from "./SceneShell";

/**
 * 본문 대응: #drift-taxonomy — 세 칸(입력 분포, 입력→정답 관계, 결과 지표) 중 어디가 변했는지로 drift를 가른다.
 * 평균 200→600 token과 “한 문장 요약”→“단계별 설명”은 본문 예시, 분포의 곡선 모양은 설명용 가정이다.
 */
const W = 320;
const H = 72;
const BASE = 56;
const xOf = (token: number) => 12 + (token / 800) * (W - 24);

function bump(mean: number) {
  const points = Array.from({ length: 41 }, (_, i) => {
    const token = mean - 180 + i * 9;
    const y = BASE - 36 * Math.exp(-((token - mean) ** 2) / (2 * 60 ** 2));
    return `${xOf(token).toFixed(1)},${y.toFixed(1)}`;
  });
  return `M${points.join(" L")}`;
}

const SCENES = [
  { label: "기준: 지난달", summary: "세 칸 모두 기준 상태", mean: 200, answer: "한 문장 요약", xChanged: false, yChanged: false, metric: "기준선", note: "입력 분포 p(X), 같은 입력에 기대하는 정답 p(y|X), 실제로 잰 품질 지표를 세 칸으로 따로 놓습니다." },
  { label: "Data drift", summary: "평균 prompt 200 → 600 token", mean: 600, answer: "한 문장 요약", xChanged: true, yChanged: false, metric: "떨어질 수도, 그대로일 수도", note: "입력 분포만 옮겨 갔습니다. 모델이 넓은 입력 범위를 이미 잘 처리한다면 품질은 그대로일 수 있습니다." },
  { label: "Concept drift", summary: "기대 답 형식이 바뀜", mean: 200, answer: "단계별 설명", xChanged: false, yChanged: true, metric: "결과로 나타날 수 있음", note: "질문 형식은 같은데 사용자가 맞다고 보는 답이 바뀌었습니다. 입력 분포는 그대로이고 관계 칸만 바뀝니다." },
  { label: "Performance drift", summary: "결과 쪽 · 따로 관측", mean: 200, answer: "한 문장 요약", xChanged: false, yChanged: false, metric: "측정값이 흔들림", note: "위 두 칸의 결과일 수 있고, 두 칸이 그대로여도 evaluator(품질 채점 절차) noise나 계절적 패턴만으로 정답률이 흔들릴 수 있어 따로 관측합니다." },
] as const;

function Tag({ changed }: { changed: boolean }) {
  return <span className={`text-xs font-bold ${changed ? "text-primary" : "text-muted-foreground"}`}>{changed ? "바뀜" : "그대로"}</span>;
}

export default function DriftWhichChangedViz() {
  return (
    <SceneShell
      eyebrow="어느 칸이 변했나"
      title="세 drift는 같은 그림에서 서로 다른 칸을 움직입니다"
      description="위 칸은 prompt 길이의 분포이고, 곡선 모양은 설명용(가정)입니다."
      ariaLabel="입력 분포, 입력과 정답의 관계, 결과 지표 세 칸 중 data, concept, performance drift가 바꾸는 칸"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="space-y-2">
            <div className={`rounded-lg border bg-background p-2 ${scene.xChanged ? "border-primary" : "border-border/70"}`}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-bold">원인 쪽 · 입력 분포 p(X)</p>
                <Tag changed={scene.xChanged} />
              </div>
              <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 h-auto w-full" role="img" aria-label={`prompt 길이 분포의 평균 ${scene.mean} token`}>
                {scene.xChanged && <path d={bump(200)} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />}
                <path d={bump(scene.mean)} fill="none" stroke={scene.xChanged ? "#2563eb" : "#64748b"} strokeWidth={1.25} />
                <line x1={12} x2={W - 12} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
                <text x={xOf(200)} y={BASE + 14} textAnchor="middle" fontSize={11} fill="#64748b">200</text>
                <text x={xOf(600)} y={BASE + 14} textAnchor="middle" fontSize={11} fill="#64748b">600 token</text>
                <line x1={xOf(scene.mean)} x2={xOf(scene.mean)} y1={BASE - 40} y2={BASE} stroke={scene.xChanged ? "#2563eb" : "#64748b"} strokeWidth={1} />
                <text x={xOf(scene.mean)} y={BASE - 43} textAnchor="middle" fontSize={11} fontWeight={700} fill={scene.xChanged ? "#2563eb" : "#64748b"}>평균</text>
              </svg>
            </div>
            <div className={`rounded-lg border bg-background p-2 ${scene.yChanged ? "border-primary" : "border-border/70"}`}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-bold">원인 쪽 · 관계 p(y|X)</p>
                <Tag changed={scene.yChanged} />
              </div>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span>같은 질문 형식</span>
                <span aria-hidden="true" className="text-muted-foreground">→</span>
                <span className={`font-bold ${scene.yChanged ? "text-primary" : ""}`}>{scene.answer}</span>
              </p>
            </div>
            <div className={`rounded-lg border p-2 ${active === 3 ? "border-primary" : "border-dashed border-border"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-xs font-bold">결과 쪽 · 품질 지표</p>
                <span className={`text-xs font-bold ${active === 3 ? "text-primary" : "text-muted-foreground"}`}>{scene.metric}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
