import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview "문자열이 다음 token으로 바뀌는 경로" — tokenizer → hidden state → lm_head logit
 * → softmax(전체 후보를 한 분모로) → temperature·top-p decoding.
 * 후보 4개와 logit 값은 그림용 가정이다. softmax 계산:
 * logit 2.0·1.5·1.0·0.5 → 45.5·27.6·16.7·10.2%,
 * 因此만 1.0 낮춰 2.0·0.5·1.0·0.5 → 55.1·12.3·20.3·12.3%.
 */
const TOKENS = ["따라서", "因此", "그러므로", "즉"] as const;
const BEFORE = [2.0, 1.5, 1.0, 0.5] as const;
const AFTER = [2.0, 0.5, 1.0, 0.5] as const;

function softmax(values: readonly number[]) {
  const exps = values.map((value) => Math.exp(value));
  const total = exps.reduce<number>((sum, value) => sum + value, 0);
  return exps.map((value) => (value / total) * 100);
}

const P_BEFORE = softmax(BEFORE);
const P_AFTER = softmax(AFTER);

const STAGES = ["문자열", "token ID", "hidden state", "logit", "확률 · 선택"] as const;

const SCENES = [
  { label: "Tokenizer가 문자열을 ID 배열로 나눕니다", summary: "문자열 → [id, id, …]", stage: 1, note: "모델은 글자를 통째로 읽지 않습니다. Tokenizer가 문자열을 vocabulary의 token ID 배열로 바꿉니다. 몇 조각으로 나뉘는지는 tokenizer 규칙이 정하므로 그림에는 개수를 적지 않았습니다." },
  { label: "Transformer가 문맥을 hidden state로 요약합니다", summary: "[id…] → h", stage: 2, note: "Hidden state는 지금까지의 문맥을 요약한 숫자 벡터입니다. 앞서 생성한 문맥이 달라지면 이 벡터도 달라지고, 다음 단계의 점수도 따라 바뀝니다." },
  { label: "lm_head가 모든 후보에 logit을 줍니다", summary: "h → 후보별 점수", stage: 3, note: "Logit은 softmax 이전의 정규화되지 않은 점수입니다. 실제로는 vocabulary 전체 후보가 점수를 받지만, 여기서는 후보가 4개뿐이라고 가정했습니다(값도 가정)." },
  { label: "Softmax는 한 분모에서 비교합니다", summary: "합계 100%", stage: 4, note: "각 logit을 따로 확률로 바꾸지 않습니다. 모든 후보의 exp(logit)을 더한 값 하나로 나누므로, 확률은 후보끼리의 상대 비교입니다. 2.0·1.5·1.0·0.5는 45.5·27.6·16.7·10.2%가 됩니다." },
  { label: "因此 하나만 낮춰도 모두 움직입니다", summary: "因此 27.6% → 12.3%", stage: 4, note: "因此의 logit만 1.5에서 0.5로 낮췄습니다. 분모가 줄어 나머지 세 후보의 확률이 모두 올라갑니다(45.5→55.1, 16.7→20.3, 10.2→12.3%). 한 token만 사라지는 계산이 아닙니다." },
  { label: "Decoding 설정을 거쳐 하나가 뽑힙니다", summary: "확률 + temperature·top-p", stage: 4, note: "실제 다음 token은 이 확률에 temperature·top-p 같은 decoding 설정을 적용해 선택됩니다. 확률이 가장 높은 후보가 매번 뽑힌다는 뜻은 아닙니다." },
] as const;

function Bar({ label, value, scale, unit, ghost, color }: { label: string; value: number; scale: number; unit: string; ghost?: number; color: string }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_6.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className="font-semibold">{label}</span>
      <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
        {ghost !== undefined && (
          <div className="absolute inset-y-0 left-0 rounded-sm border border-dashed" style={{ width: `${(ghost / scale) * 100}%`, borderColor: "#94a3b8" }} />
        )}
        <div className="h-full rounded-sm" style={{ width: `${(value / scale) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">
        {ghost !== undefined ? `${ghost.toFixed(1)}→` : ""}
        {value.toFixed(1)}
        {unit}
      </span>
    </div>
  );
}

export default function NextTokenPathViz() {
  return (
    <SceneShell
      eyebrow="다음 token 하나가 정해지는 길"
      title="Logit 하나를 낮추면 다른 후보의 확률도 같이 움직입니다"
      description="고정 사례의 계산 설명 “…3,200이다.” 다음에 올 token을 고르는 상황입니다. 후보 4개와 점수는 계산을 보이기 위한 가정입니다."
      ariaLabel="tokenizer, hidden state, logit, softmax, decoding 순서와 logit 변경의 효과"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-5 gap-1 text-center text-[11px] leading-4 sm:text-xs">
              {STAGES.map((stage, index) => (
                <li
                  key={stage}
                  className={`min-w-0 rounded-md border px-1 py-1.5 [overflow-wrap:anywhere] ${
                    index === scene.stage ? "border-primary font-bold text-primary" : index < scene.stage ? "border-border text-foreground" : "border-border/40 text-muted-foreground/60"
                  }`}
                >
                  {stage}
                </li>
              ))}
            </ol>
            <div className="mt-4 min-h-[8.5rem] min-w-0">
              {active === 0 && (
                <div className="space-y-3 text-sm">
                  <p className="font-mono">“9,600을 3으로 나누면 3,200이다.”</p>
                  <p className="text-muted-foreground">↓ tokenizer</p>
                  <p className="font-mono text-primary">[ id₁, id₂, id₃, …, idₙ ]</p>
                </div>
              )}
              {active === 1 && (
                <div className="space-y-3 text-sm">
                  <p className="font-mono">[ id₁, id₂, …, idₙ ]</p>
                  <p className="text-muted-foreground">↓ Transformer</p>
                  <p className="font-mono text-primary">h <span className="font-sans text-muted-foreground">(문맥을 요약한 숫자 벡터 하나)</span></p>
                </div>
              )}
              {active === 2 && (
                <div className="space-y-2">
                  {TOKENS.map((token, index) => (
                    <Bar key={token} label={token} value={BEFORE[index]} scale={2.2} unit="" color="#64748b" />
                  ))}
                  <p className="pt-1 text-xs text-muted-foreground">logit · 나머지 vocabulary는 생략(가정)</p>
                </div>
              )}
              {active >= 3 && (
                <div className="space-y-2">
                  {TOKENS.map((token, index) => (
                    <Bar
                      key={token}
                      label={token}
                      value={active === 3 ? P_BEFORE[index] : P_AFTER[index]}
                      ghost={active === 4 ? P_BEFORE[index] : undefined}
                      scale={60}
                      unit="%"
                      color={active >= 4 && index === 1 ? "#d97706" : "#2563eb"}
                    />
                  ))}
                  <p className="pt-1 text-xs text-muted-foreground">
                    {active === 3 ? "softmax 확률 · 네 값의 합 100%" : active === 4 ? "점선 = 낮추기 전 확률 · 因此 logit 1.5 → 0.5" : "이 분포에 temperature·top-p를 적용해 한 token을 뽑음"}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
