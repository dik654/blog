import SceneShell from "./SceneShell";

/**
 * 본문 대응: #grammar-constrained-decoding — 사후 판정과 decoding-time 제약의 차이.
 * 본문 예: prefix [0 다음 후보는 ]나 , 정도로 줄고 나머지 alphabet symbol은 지운다.
 * 모델 선호 순서와 고른 symbol은 설명용 가정이다.
 */
const CANDIDATES = [
  { sym: "1", keep: false },
  { sym: "]", keep: true },
  { sym: ",", keep: true },
  { sym: "[", keep: false },
  { sym: "0", keep: false },
] as const;

const SCENES = [
  {
    label: "사후 판정은 다 만든 뒤에 묻습니다",
    summary: "][ → reject",
    note: "Derivation과 parser 판정은 완성된 string을 받습니다. 모델이 ][를 냈다면(가정) 첫 symbol부터 틀렸어도 다 만든 뒤에야 language 밖이라고 판정됩니다.",
  },
  {
    label: "생성 중에는 고르기 전에 후보를 지웁니다",
    summary: "prefix [0 → ] · , 만 남김",
    note: "본문 예처럼 [0까지 만든 상태라면 다음 후보는 ]나 , 정도로 줄어듭니다. 나머지 alphabet symbol은 나오면 language 밖으로 나가므로 고르기 전에 지웁니다.",
  },
  {
    label: "남은 후보의 순서는 그대로입니다",
    summary: "허용 집합 안에서만 고름",
    note: "모델이 금지된 1을 가장 선호했더라도(가정) 그 후보만 빠질 뿐, 남은 ]와 , 사이의 순서는 바뀌지 않습니다. Constrained sampling은 이 남은 집합 안에서 고릅니다.",
  },
  {
    label: "고른 symbol을 붙이고 다음 step으로 갑니다",
    summary: "[0 + ] = [0]",
    note: "]가 뽑혔다면(가정) prefix는 [0]이 되고, 앞 절의 accept 예와 같은 string입니다. 생성이 이어지는 동안 매 step이 새 prefix에서 같은 거름을 반복합니다.",
  },
] as const;

function Sym({ text, tone }: { text: string; tone: "plain" | "keep" | "drop" | "bad" }) {
  const toneClass = {
    plain: "border-border text-foreground",
    keep: "border-primary text-primary",
    drop: "border-dashed border-border text-muted-foreground/60 line-through",
    bad: "border-red-600 text-red-700 dark:text-red-400",
  }[tone];
  return (
    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-md border font-mono text-sm font-bold ${toneClass}`}>
      {text}
    </span>
  );
}

export default function DecodingMaskStepViz() {
  return (
    <SceneShell
      eyebrow="사후 판정 vs 생성 시점 제약"
      title="Grammar가 다음 symbol 후보를 고르기 전에 걸러냅니다"
      description="칸 하나가 symbol 하나입니다. 실선 강조 칸은 남은 후보, 취소선 칸은 지운 후보입니다. 모델의 선호 순서와 뽑힌 symbol은 설명용 가정입니다."
      ariaLabel="사후 판정과 prefix [0에서의 후보 거름, 남은 후보 안의 선택"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          return (
            <div className="grid min-h-[13rem] content-center gap-3">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-muted-foreground">모델 출력 전체</span>
                <Sym text="]" tone="plain" />
                <Sym text="[" tone="plain" />
                <span className="px-1 text-muted-foreground" aria-hidden>
                  →
                </span>
                <span className="rounded-md border border-border px-3 py-2 text-xs">parser: L에 속하나?</span>
                <span className="px-1 text-muted-foreground" aria-hidden>
                  →
                </span>
                <span className="rounded-md border border-red-600 px-3 py-2 text-xs font-bold text-red-700 dark:text-red-400">reject</span>
              </div>
              <p className="text-center text-xs text-muted-foreground">판정 시점: 생성이 끝난 뒤 한 번</p>
            </div>
          );
        }
        const showRank = active >= 2;
        const picked = active === 3;
        return (
          <div className="grid min-h-[13rem] content-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">지금까지의 prefix</span>
              <Sym text="[" tone="plain" />
              <Sym text="0" tone="plain" />
              {picked && <Sym text="]" tone="keep" />}
              {!picked && <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-dashed border-primary font-mono text-sm text-primary">?</span>}
            </div>
            <div className="mx-auto w-full max-w-md">
              <p className="mb-2 text-xs text-muted-foreground">
                다음 symbol 후보{showRank ? " · 왼쪽부터 모델 선호 순서(가정)" : ""}
              </p>
              <ol className="grid grid-cols-5 gap-2">
                {CANDIDATES.map((candidate, index) => (
                  <li key={candidate.sym} className="flex flex-col items-center gap-1">
                    <Sym
                      text={candidate.sym}
                      tone={candidate.keep ? (picked && candidate.sym !== "]" ? "plain" : "keep") : "drop"}
                    />
                    <span className="font-mono text-[11px] text-muted-foreground">{showRank ? `${index + 1}위` : " "}</span>
                    <span className={`text-[11px] ${candidate.keep ? "font-bold text-primary" : "text-muted-foreground"}`}>
                      {candidate.keep ? (picked && candidate.sym === "]" ? "뽑힘" : "남음") : "지움"}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {showRank ? "남은 두 후보: ]가 ,보다 앞 — 원래 순서 그대로" : "판정 시점: 매 step, 고르기 직전"}
            </p>
          </div>
        );
      }}
    />
  );
}
