import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-update — W[3] = [0,1,1]에 neu1e를 두 번 더하는 원본과, 평균의 미분을 맞춘 계산.
 * neu1e ≈ [0.050600, −0.072552, 0.027448].
 * 원본 관찰 결과 ≈ [0.1012, 0.8549, 1.0549]. 맞춘 계산 = 시작값 + neu1e ≈ [0.0506, 0.9274, 1.0274](산술, 실행 결과 아님).
 */
const NEU1E = [0.050599974, -0.072551787, 0.027448213];
const START = [0, 1, 1];
const LOW = -0.16;
const HIGH = 0.12;
const pos = (v: number) => ((v - LOW) / (HIGH - LOW)) * 100;
const AMBER = "#d97706";
const BLUE = "#2563eb";

const SCENES = [
  { label: "시작", summary: "W[3] = [0, 1, 1]", original: 0, fixed: 0, note: "두 saw가 가리키는 같은 행입니다. 막대는 시작값에서 얼마나 움직였는지를 나타내고, 가운데 세로선이 움직임 0입니다." },
  { label: "원본: 첫 번째 출현", summary: "+ neu1e", original: 1, fixed: 0, note: "원본은 이웃 위치를 순회하며 행에 neu1e를 그대로 더합니다. 평균을 만들 때의 cw로 다시 나누지 않습니다." },
  { label: "원본: 두 번째 출현", summary: "+ neu1e → ≈ [0.1012, 0.8549, 1.0549]", original: 2, fixed: 0, note: "같은 saw가 또 나오므로 같은 행에 neu1e가 한 번 더 더해집니다. 실행에서 관찰한 결과와 같습니다." },
  { label: "평균의 미분만 맞춘다면", summary: "neu1e/2 × 2 → ≈ [0.0506, 0.9274, 1.0274]", original: 2, fixed: 1, note: "같은 확률 표의 변화량을 쓰면서 평균의 미분만 맞추면 각 출현에 neu1e/2를 더해 순변화는 neu1e 한 번입니다. 이 줄은 산술로 구한 값이며 실행 결과가 아닙니다." },
  { label: "입력 쪽 배율", summary: "이 사례 C = 2 → 2배", original: 2, fixed: 1, note: "두 줄의 차이는 반올림이나 정확한 sigmoid와의 차이로 설명되지 않습니다. 출력 내부 노드 갱신은 경로 항마다 한 번이라 이 배율은 입력 쪽에만 있고, 문맥 개수 C가 달라지면 배율도 사례마다 달라집니다." },
] as const;

function Track({ label, value, color, text }: { label: string; value: number; color: string; text: string }) {
  const zero = pos(0);
  const end = pos(value);
  const left = Math.min(zero, end);
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="relative h-3.5 min-w-0 rounded-sm bg-muted/40">
        <div className="absolute inset-y-0" style={{ left: `${left}%`, width: `${Math.abs(end - zero)}%`, backgroundColor: color }} />
        <div className="absolute inset-y-[-2px] w-px" style={{ left: `${zero}%`, backgroundColor: "#64748b" }} />
      </div>
      <span className="text-right font-mono font-bold">{text}</span>
    </div>
  );
}

export default function DoubleUpdateViz() {
  return (
    <SceneShell
      eyebrow="입력 갱신의 크기"
      title="같은 행에 neu1e를 두 번 더하면 평균의 미분보다 두 배 움직입니다"
      description="성분마다 위 막대는 원본 실행, 아래 막대는 평균의 미분을 맞춘 계산입니다. 오른쪽 수는 갱신 뒤의 값입니다. neu1e는 앞 절에서 모은 변화량이고, 입력과 내부 벡터는 가정한 값입니다."
      ariaLabel="saw 입력 행의 세 성분이 원본과 평균 미분 계산에서 각각 얼마나 움직이는지 비교하는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {NEU1E.map((value, c) => (
              <div key={c} className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground">{c + 1}번째 성분 · 시작 {START[c]}</p>
                <Track label="원본" value={value * scene.original} color={AMBER} text={(START[c] + value * scene.original).toFixed(4)} />
                <Track label="미분 맞춤" value={value * scene.fixed} color={BLUE} text={scene.fixed ? (START[c] + value).toFixed(4) : "−"} />
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
