import SceneShell from "./SceneShell";

/**
 * 본문 대응: #data의 loss mask 식 — 100 token 중 assistant target 30개만 m=1이면 그 30개 NLL의 평균.
 * 답변 token 하나의 NLL을 모두 1.0으로 둔다(가정).
 * Z로 나누기: 30×1.0/30 = 1.0. T로 나누기: 30/100 = 0.30.
 * prompt가 짧은 example(prompt 10 + 답변 30 = 40, 가정): Z 기준 1.0, T 기준 30/40 = 0.75.
 */
const NLL = 1.0;

const SCENES = [
  {
    label: "mask로 나누기",
    summary: "T=100 = prompt 70 (m=0) + 답변 30 (m=1)",
    note: "칸 하나가 chat template으로 직렬화한 token 하나입니다. Prompt 70개는 context로 읽지만 mask가 0이라 채점하지 않고, assistant 답변 30개만 mask가 1입니다. 그래서 Z=30입니다.",
    prompt: 70,
    answer: 30,
    show: "none",
  },
  {
    label: "Z로 나누기",
    summary: "30 × 1.0 ÷ 30 = 1.0",
    note: "답변 token 하나의 NLL을 모두 1.0으로 두면(가정) 채점한 NLL 합은 30입니다. 채점한 token 수 Z=30으로 나누면 답변 token 평균 1.0이 나옵니다.",
    prompt: 70,
    answer: 30,
    show: "z",
  },
  {
    label: "T로 나누면",
    summary: "30 ÷ 100 = 0.30",
    note: "같은 합 30을 전체 길이 T=100으로 나누면 0.30입니다. 채점하지 않은 prompt 70개가 분모에만 들어가 답변을 맞힌 정도와 무관하게 값이 작아집니다.",
    prompt: 70,
    answer: 30,
    show: "both",
  },
  {
    label: "prompt가 짧은 example",
    summary: "T=40: Z 기준 1.0 · T 기준 0.75",
    note: "답변 30개와 NLL은 그대로 두고 prompt만 10개로 줄이면(가정) T=40입니다. Z로 나눈 값은 여전히 1.0이지만 T로 나눈 값은 0.75로 바뀝니다. 분모로 Z를 써야 prompt 길이가 평균 scale을 바꾸지 않습니다.",
    prompt: 10,
    answer: 30,
    show: "both",
  },
] as const;

const SLOTS = 100;
const PROMPT = "#94a3b8";
const ANSWER = "#2563eb";
const T_COLOR = "#d97706";

function Bar({ label, value, color }: { label: string; value: number | null; color: string }) {
  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${value === null ? 0 : value * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono font-bold">{value === null ? "−" : value.toFixed(2)}</span>
    </div>
  );
}

export default function MaskDenominatorViz() {
  return (
    <SceneShell
      eyebrow="Loss mask와 분모"
      title="채점한 token 수로 나눠야 prompt 길이가 평균을 흔들지 않습니다"
      description="NLL(negative log-likelihood)은 정답 token에 준 probability의 −log로, 작을수록 잘 맞힌 것입니다. 100 token 중 답변 30개만 채점하는 본문의 예를 칸으로 그렸고, token별 NLL 1.0과 둘째 example의 길이는 설명용 가정입니다."
      ariaLabel="loss mask가 1인 token 수와 전체 길이로 나눈 평균 NLL 비교"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const total = s.prompt + s.answer;
        const sum = s.answer * NLL;
        return (
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: PROMPT }} />prompt · m=0</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: ANSWER }} />답변 · m=1</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm border border-dashed border-border" />token 없음</span>
            </div>
            <div className="mx-auto grid max-w-[30rem] grid-cols-20 gap-[3px]" role="img" aria-label={`전체 ${total} token 중 prompt ${s.prompt}, 답변 ${s.answer}`}>
              {Array.from({ length: SLOTS }, (_, i) => {
                const kind = i < s.prompt ? "prompt" : i < total ? "answer" : "empty";
                return (
                  <span
                    key={i}
                    className={`aspect-square rounded-[2px] ${kind === "empty" ? "border border-dashed border-border" : ""}`}
                    style={kind === "empty" ? undefined : { backgroundColor: kind === "prompt" ? PROMPT : ANSWER }}
                  />
                );
              })}
            </div>
            <p className="text-center font-mono text-xs text-muted-foreground">
              T = {total} · Z = {s.answer} · 채점한 NLL 합 = {sum.toFixed(0)}
            </p>
            <div className="space-y-2">
              <Bar label={`÷ Z (${s.answer})`} value={s.show === "none" ? null : sum / s.answer} color={ANSWER} />
              <Bar label={`÷ T (${total})`} value={s.show === "both" ? sum / total : null} color={T_COLOR} />
            </div>
          </div>
        );
      }}
    />
  );
}
