import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-cbow — cat 경로의 세 내부 노드가 neu1e의 한 자리씩을 채웁니다.
 * 표 번호 = (점수 + 6) × 83, 점수 0 → 498, 점수 1 → 581. g = (1 − code − f) × 0.1.
 * 내부 벡터가 단위 벡터라 내부 3 → 첫 자리, 내부 2 → 셋째 자리, 내부 1 → 둘째 자리입니다.
 * 소수를 버리지 않는다면 1000/12를 곱하므로 점수 0은 500번, 점수 1은 약 583번입니다.
 */
const F0 = 0.494000256;
const F1 = 0.725517869;
const STEPS = [
  { node: 3, vec: "[1,0,0]", score: 0, index: 498, ideal: 500, f: F0, code: 0, g: 0.050599974, slot: 0, place: "첫째" },
  { node: 2, vec: "[0,0,1]", score: 1, index: 581, ideal: 583, f: F1, code: 0, g: 0.027448213, slot: 2, place: "셋째" },
  { node: 1, vec: "[0,1,0]", score: 1, index: 581, ideal: 583, f: F1, code: 1, g: -0.072551787, slot: 1, place: "둘째" },
];
const signed = (v: number) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(6)}`;

const SCENES = [
  { label: "내부 3 · 주소 0", summary: "g ≈ +0.050600", note: "1000/6/2는 정수 나눗셈이라 소수를 버린 83입니다. 그래서 점수 0은 표의 498번을 읽어 f ≈ 0.494000입니다. 이상적인 0.5와의 차이가 여기서 생깁니다. 주소가 0이므로 g는 양수입니다." },
  { label: "내부 2 · 주소 0", summary: "g ≈ +0.027448", note: "점수 1은 581번을 읽어 f ≈ 0.725518입니다. 이 노드의 벡터는 셋째 자리만 1이라 g가 neu1e의 셋째 자리로 갑니다." },
  { label: "내부 1 · 주소 1", summary: "g ≈ −0.072552", note: "점수와 f는 앞과 같지만 cat의 마지막 주소가 1입니다. (1−1−f)×0.1이 되어 g의 부호가 뒤집힙니다." },
  { label: "모은 결과", summary: "neu1e ≈ [0.0506, −0.0726, 0.0274]", note: "세 칸이 모두 찼습니다. 가정한 내부 벡터가 한 자리만 1이어서 한 칸씩 채워졌을 뿐, 벡터의 다른 자리가 0이 아니면 g는 그 자리에도 더해집니다. 이 값은 학습률 0.1과 감소 방향의 부호까지 포함한 변화량입니다. 손실 기울기 자체가 아닙니다." },
] as const;

function Ruler({ index, ideal }: { index: number; ideal: number }) {
  const from = 480;
  const to = 600;
  const x = (i: number) => 14 + ((i - from) / (to - from)) * 332;
  return (
    <svg viewBox="0 0 360 58" className="block h-auto w-full max-w-[460px]" aria-hidden="true">
      <line x1={14} x2={346} y1={30} y2={30} stroke="#94a3b8" strokeWidth={1} />
      {[480, 500, 520, 540, 560, 580, 600].map((tick) => (
        <line key={tick} x1={x(tick)} x2={x(tick)} y1={26} y2={34} stroke="#94a3b8" strokeWidth={1} />
      ))}
      <circle cx={x(index)} cy={30} r={5} fill="#2563eb" />
      <text x={x(index) - 2} y={16} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">{`읽은 칸 ${index}`}</text>
      <circle cx={x(ideal)} cy={30} r={5} fill="none" stroke="#d97706" strokeWidth={1} />
      <text x={ideal > 550 ? x(ideal) + 40 : x(ideal)} y={50} textAnchor={ideal > 550 ? "end" : "middle"} fontSize={12} fill="#b45309">{ideal > 550 ? `버림 없으면 약 ${ideal}` : `버림 없으면 ${ideal}`}</text>
    </svg>
  );
}

export default function PathErrorViz() {
  return (
    <SceneShell
      eyebrow="실제 CBOW 분기 한 번"
      title="세 갈림길이 neu1e의 세 칸을 하나씩 채웁니다"
      description="가정한 값을 넣은 한 중심 관찰입니다. neu1e는 경로 노드들의 기여를 모으는 변수, f는 sigmoid 표에서 읽은 값, code는 주소 비트입니다. 눈금은 표 번호 480~600만 확대했습니다."
      ariaLabel="cat 경로의 세 내부 노드에서 표 조회와 g 계산을 거쳐 neu1e가 채워지는 장면"
      scenes={SCENES}
      render={(active) => {
        const step = STEPS[Math.min(active, 2)];
        const done = active === 3;
        const filled = STEPS.filter((_, i) => i <= active);
        return (
          <div className="min-w-0 space-y-3" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <div className="grid grid-cols-3 gap-2">
              {STEPS.map((s, i) => (
                <div key={s.node} className={`rounded-lg border px-2 py-1.5 text-center text-xs leading-5 ${!done && i === active ? "border-blue-600 font-bold" : "border-border"} ${!done && i > active ? "opacity-40" : ""}`}>
                  내부 {s.node}
                  <span className="block font-mono">{s.vec}</span>
                </div>
              ))}
            </div>
            <div className={done ? "invisible" : ""}>
              <Ruler index={step.index} ideal={step.ideal} />
              <div className="mt-1 space-y-0.5 font-mono text-xs leading-5 sm:text-sm">
                <div>({step.score}+6)×83 = {step.index}번 → f ≈ {step.f.toFixed(6)}</div>
                <div>(1−{step.code}−{step.f.toFixed(6)})×0.1 ≈ {signed(step.g)}</div>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold text-muted-foreground">neu1e</p>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((slot) => {
                  const hit = filled.find((s) => s.slot === slot);
                  return (
                    <div key={slot} className={`rounded-lg border px-1 py-2 text-center font-mono text-xs font-bold sm:text-sm ${hit ? "" : "border-dashed text-muted-foreground"}`} style={hit ? { borderColor: hit.g < 0 ? "#d97706" : "#2563eb", color: hit.g < 0 ? "#b45309" : "#2563eb" } : undefined}>
                      {hit ? signed(hit.g) : "0"}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
