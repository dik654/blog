import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cbow, #case — 점수 [0,1,1,3,1]을 지수값과 비율로 바꿉니다.
 * e^s = 1, 2.718, 2.718, 20.086, 2.718, 합 29.240. 비율 0.034, 0.093, 0.093, 0.687, 0.093.
 * cat: p ≈ 0.0929633, −ln p ≈ 2.375551. 모든 점수가 같으면 각 1/5(3절).
 */
const WORDS = ["문장 끝", "red", "cat", "saw", "dog"];
const SCORES = [0, 1, 1, 3, 1];
const EXPS = SCORES.map((s) => Math.exp(s));
const SUM = EXPS.reduce((a, b) => a + b, 0);
const SHARES = EXPS.map((v) => v / SUM);
const COLORS = ["#94a3b8", "#94a3b8", "#2563eb", "#d97706", "#94a3b8"];

const SCENES = [
  { label: "점수가 모두 같다면", summary: "각각 1/5", note: "(가정) 다섯 점수가 같으면 어느 단어를 더 선호할 근거가 없어 각각 1/5을 받습니다. cat을 정답으로 표시해도 cat의 확률이 저절로 1이 되지는 않습니다." },
  { label: "실제 점수", summary: "[0, 1, 1, 3, 1]", note: "이번에는 평균 입력에서 나온 점수입니다. 점수 자체는 확률이 아닙니다. 다섯 값을 더해도 1이 되지 않습니다." },
  { label: "양수로 바꿉니다", summary: `합 ≈ ${SUM.toFixed(3)}`, note: "각 점수 s를 e의 s제곱으로 바꿉니다. e는 약 2.718인 수입니다. 모두 양수가 되고, 점수 차이는 더 큰 비로 벌어집니다. 다섯 값의 합이 공통 분모입니다." },
  { label: "합으로 나눕니다", summary: "0.034+0.093×3+0.687 = 1", note: "각 값을 합으로 나누면 전체 합이 1인 비율이 됩니다. 아래 띠 하나가 전체 확률이고 한 후보의 몫이 커지면 다른 후보의 몫은 작아집니다." },
  { label: "정답 cat의 몫", summary: "−ln 0.0929633 ≈ 2.3756", note: "정답 cat의 몫은 약 0.0929633입니다. 이 몫이 클수록 작아지는 값으로 음의 로그를 취하면 손실 약 2.375551입니다. saw가 띠의 대부분을 가져가서 cat의 몫이 작습니다." },
] as const;

export default function SoftmaxShareViz() {
  return (
    <SceneShell
      eyebrow="점수에서 확률로"
      title="다섯 후보의 점수가 합 1인 띠로 바뀌는 과정"
      description="막대 하나가 후보 하나이고 가정한 표에서 나온 값입니다. 막대 길이는 장면마다 그 장면의 가장 큰 값에 맞춥니다. 아래 띠는 전체 확률 1이고 ✓는 관찰한 정답입니다."
      ariaLabel="점수를 지수값으로 바꾸고 합으로 나누어 확률 띠를 만드는 장면"
      scenes={SCENES}
      render={(active) => {
        const values = active === 0 ? WORDS.map(() => 0.2) : active === 1 ? SCORES : active === 2 ? EXPS : SHARES;
        const max = Math.max(...values);
        const text = (v: number) => (active === 0 ? "1/5" : active === 1 ? String(v) : v.toFixed(3));
        const stripOn = active === 0 || active >= 3;
        const strip = active === 0 ? WORDS.map(() => 0.2) : SHARES;
        return (
          <div className="min-w-0" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <div className="space-y-1.5">
              {WORDS.map((word, i) => (
                <div key={word} className={`grid grid-cols-[3.25rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm ${active === 4 && i !== 2 ? "opacity-50" : ""}`}>
                  <span className={i === 2 ? "font-bold" : ""}>{word}{i === 2 ? " ✓" : ""}</span>
                  <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                    <div className="h-full rounded-sm" style={{ width: `${(values[i] / max) * 100}%`, backgroundColor: COLORS[i] }} />
                  </div>
                  <span className="text-right font-mono font-bold">{text(values[i])}</span>
                </div>
              ))}
            </div>
            <div className={`mt-4 ${stripOn ? "" : "opacity-25"}`}>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>전체 확률 띠</span>
                <span className="font-mono">합 = 1</span>
              </div>
              <div className="flex h-6 min-w-0 gap-px overflow-hidden rounded-sm bg-muted/40">
                {stripOn && strip.map((share, i) => (
                  <div key={WORDS[i]} className="flex items-center justify-center text-[11px] font-bold text-white" style={{ width: `${share * 100}%`, backgroundColor: i === 2 ? COLORS[2] : i === 3 ? COLORS[3] : "#64748b" }}>
                    {i === 2 || i === 3 ? WORDS[i] : ""}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
