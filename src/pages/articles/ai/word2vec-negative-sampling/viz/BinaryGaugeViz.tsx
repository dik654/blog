import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why — 이전 방식은 후보 전체에 확률을 나누고, 지금은 짝마다 이진 질문을 묻는다.
 * σ(1)≈0.731059, 세 값의 합≈2.193176. 이전 방식의 칸 크기는 본문이 정하지 않아 나누지 않고 이름만 적는다.
 */
const P = 0.731059;
const SUM = 2.193176;
const AXIS = 3;
const PAIRS = ["cat", "red", "dog"];
const CANDIDATES = ["문장 끝", "red", "cat", "saw", "dog"];

const SCENES = [
  { label: "이전 질문", summary: "합 = 1을 나눔", note: "이전 방식은 이 입력 뒤에서 어떤 단어를 고를지 후보 전체에 확률을 나눕니다. 한 후보가 커지면 나머지 몫이 줄어듭니다. 나눈 크기는 여기서 정하지 않았습니다." },
  { label: "지금 질문", summary: "짝마다 약 0.731059", note: "각 짝이 관찰 쪽인지 추첨 쪽인지 따로 묻습니다. 점수 1을 6절에서 정의할 변환에 넣으면 약 0.731059입니다. cat이 높아도 red·dog가 그만큼 줄도록 묶는 나눗셈은 없습니다." },
  { label: "더해 보면", summary: "약 2.193176 > 1", note: "합이 1을 넘어도 계산이 틀린 것이 아닙니다. 서로 다른 세 이진 질문의 값을 더했기 때문입니다." },
] as const;

export default function BinaryGaugeViz() {
  return (
    <SceneShell
      eyebrow="질문이 바뀝니다"
      title="값 하나를 나눠 갖던 후보가 각자의 눈금을 갖습니다"
      description="위 띠는 후보 전체가 나눠 갖는 합, 아래 눈금은 짝마다 따로 있는 0~1 값입니다."
      ariaLabel="후보 전체가 합 1을 나누는 방식과 세 짝이 각각 약 0.731을 갖고 합이 2.193이 되는 방식 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className={active === 0 ? "" : "opacity-40"}>
            <p className="mb-1 text-xs font-semibold text-muted-foreground">이전: 다섯 후보가 함께 나눔 (합 1)</p>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 rounded border border-primary/60 bg-primary/10 px-2 py-2 text-xs">
              {CANDIDATES.map((word) => <span key={word}>{word}</span>)}
            </div>
          </div>
          <div className={active === 0 ? "opacity-40" : ""}>
            <p className="mb-1 text-xs font-semibold text-muted-foreground">지금: 세 짝이 따로 (각각 0~1)</p>
            <div className="space-y-1.5">
              {PAIRS.map((word) => (
                <div key={word} className="grid grid-cols-[4.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs">
                  <span>saw→{word}</span>
                  <span className="h-3 min-w-0 rounded-sm bg-muted/50"><span className="block h-full rounded-sm" style={{ width: `${P * 100}%`, backgroundColor: "#2563eb" }} /></span>
                  <span className="text-right font-mono">{P.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={active === 2 ? "" : "opacity-40"}>
            <p className="mb-1 text-xs font-semibold text-muted-foreground">세 값을 이어 붙이면</p>
            <div className="relative h-5 rounded-sm bg-muted/50">
              {PAIRS.map((word, index) => (
                <span key={word} className="absolute top-0 h-full border-r border-background" style={{ left: `${((index * P) / AXIS) * 100}%`, width: `${(P / AXIS) * 100}%`, backgroundColor: "#2563eb" }} />
              ))}
              <span className="absolute -top-1 h-7 w-px bg-[#dc2626]" style={{ left: `${(1 / AXIS) * 100}%` }} />
            </div>
            <div className="relative mt-1 h-4 font-mono text-xs text-muted-foreground">
              <span className="absolute -translate-x-1/2 font-bold text-[#dc2626]" style={{ left: `${(1 / AXIS) * 100}%` }}>1</span>
              <span className="absolute -translate-x-1/2 font-bold text-primary" style={{ left: `${(SUM / AXIS) * 100}%` }}>2.193</span>
            </div>
          </div>
        </div>
      )}
    />
  );
}
