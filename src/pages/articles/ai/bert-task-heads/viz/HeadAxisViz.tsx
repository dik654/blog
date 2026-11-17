import SceneShell from "./SceneShell";

/**
 * 본문 대응: #task-head, #token-span — 같은 encoder output H[B,L,H]를 head마다 다른 축으로 읽는다.
 * 그림은 batch 안의 sequence 하나(L=8, 가정)만 그린다. 가로 칸은 hidden 축 H의 일부만 그린 것이다.
 * Sequence head: CLS row 하나 → 3 logits ([B,3]). Token head: 모든 row → C logits ([B,L,C], 그림은 C=4 가정).
 * Span head: 모든 row → start·end scalar 두 개 ([B,L] 두 개). 마지막 장면: PAD·special token loss 제외.
 */
const TOKENS = ["[CLS]", "w1", "w2", "w3", "w4", "w5", "[SEP]", "[PAD]"] as const;
const SPECIAL = new Set<string>(["[CLS]", "[SEP]", "[PAD]"]);
const HIDDEN_CELLS = 6;
const LABEL_CELLS = 4;

const ACCENT = "#2563eb";
const SPAN_START = "#16a34a";
const SPAN_END = "#d97706";
const MASKED = "#dc2626";

const SCENES = [
  {
    label: "Encoder output",
    summary: "[B,L,H]",
    note: "한 줄이 token 위치 하나의 contextual state이고, 가로 칸은 hidden 축 H입니다. Batch에는 이런 판이 B장 쌓여 있습니다. 아래 장면은 같은 판을 head마다 다른 방식으로 읽습니다.",
  },
  {
    label: "Sequence head",
    summary: "[B,L,H] → [B,H] → [B,3]",
    note: "각 sequence에서 CLS 줄(H[:,0,:]) 하나만 꺼내 [B,H]를 만들고, linear projection으로 3-class logits [B,3]을 만든 뒤 softmax합니다. 나머지 줄은 이 head가 직접 읽지 않으므로 length 축 L이 출력에서 사라집니다.",
  },
  {
    label: "Token head (NER)",
    summary: "[B,L,H] → [B,L,C]",
    note: "모든 줄을 같은 linear projection 하나로 C개 label logits로 바꿉니다. Length 축은 그대로 남고 hidden 축만 label 축으로 바뀝니다. Subword 줄과 word label을 맞추는 alignment가 따로 필요합니다.",
  },
  {
    label: "Span head (extractive QA)",
    summary: "start [B,L] · end [B,L]",
    note: "모든 줄을 서로 다른 vector 두 개로 읽어 각각 scalar 하나씩으로 줄입니다. 위치마다 start score와 end score가 따로 생기므로 [B,L] tensor가 두 개입니다. 답 span이 truncation 뒤 input 안에 남아 있어야 이 두 score로 가리킬 수 있습니다.",
  },
  {
    label: "Loss mask",
    summary: "PAD·special token loss 제외",
    note: "H는 PAD까지 포함한 고정 길이 tensor라 token head도 PAD 줄에 logits를 만듭니다. 그 줄과 special token 줄은 loss에서 빼야 합니다. Prediction unit이 바뀌면 head 축과 label 구성, loss mask가 함께 바뀝니다.",
  },
] as const;

function Cell({ color, filled, dashed = false, text, wideOnly = false }: { color: string; filled: boolean; dashed?: boolean; text?: string; wideOnly?: boolean }) {
  return (
    <span
      className={`${wideOnly ? "hidden sm:flex" : "flex"} h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border text-[9px] font-bold leading-none sm:h-6 sm:w-6 sm:text-[10px]`}
      style={{
        borderColor: color,
        borderStyle: dashed ? "dashed" : "solid",
        backgroundColor: filled ? `${color}26` : "transparent",
        color,
      }}
    >
      {text}
    </span>
  );
}

function OutputCells({ scene, row }: { scene: number; row: number }) {
  const token = (TOKENS as readonly string[])[row];
  if (scene === 0) return null;
  if (scene === 1) {
    if (row !== 0) return null;
    return (
      <span className="flex items-center gap-1">
        {[0, 1, 2].map((c) => (
          <Cell key={c} color={ACCENT} filled text={String(c + 1)} />
        ))}
        <span className="ml-0.5 whitespace-nowrap text-[11px] text-muted-foreground">softmax</span>
      </span>
    );
  }
  if (scene === 3) {
    return (
      <span className="flex items-center gap-1">
        <Cell color={SPAN_START} filled text="s" />
        <Cell color={SPAN_END} filled text="e" />
      </span>
    );
  }
  const masked = scene === 4 && SPECIAL.has(token);
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: LABEL_CELLS }, (_, c) => (
        <Cell key={c} color={masked ? MASKED : ACCENT} filled={!masked} dashed={masked} />
      ))}
      {masked ? <span className="ml-0.5 whitespace-nowrap text-[11px] font-semibold" style={{ color: MASKED }}>제외</span> : null}
    </span>
  );
}

export default function HeadAxisViz() {
  return (
    <SceneShell
      eyebrow="같은 output, 다른 축"
      title="Head마다 [B,L,H]의 어느 줄을 읽고 어느 축을 남기는지"
      description="Batch 안의 sequence 하나만 그렸습니다. w1–w5는 일반 token 자리이고, 길이 L=8과 label 수 C=4는 그림을 위한 가정이고, hidden 축 H는 앞쪽 몇 칸만 그렸습니다. 빨간 점선 칸은 loss에서 제외되는 줄입니다."
      ariaLabel="Encoder output을 sequence, token, span head가 각각 다른 축으로 읽는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-[3rem_auto_0.75rem_minmax(0,1fr)] items-center gap-x-1.5 gap-y-1 sm:grid-cols-[4rem_auto_2rem_minmax(0,1fr)] sm:gap-x-2">
            <span className="whitespace-nowrap text-[11px] font-semibold text-muted-foreground">위치 L</span>
            <span className="whitespace-nowrap text-[11px] font-semibold text-muted-foreground">hidden H →</span>
            <span />
            <span className="whitespace-nowrap text-[11px] font-semibold text-muted-foreground">
              {active === 0 ? "head 없음" : active === 3 ? "start · end" : active === 1 ? "class 3개" : active === 4 ? "C칸 · loss" : "label C칸"}
            </span>
            {TOKENS.map((token, row) => {
              const read = active === 0 || active >= 2 || row === 0;
              const masked = active === 4 && SPECIAL.has(token);
              const rowColor = active === 0 ? "#64748b" : read ? ACCENT : "#94a3b8";
              return (
                <div key={token} className="contents">
                  <span
                    className="font-mono text-xs"
                    style={{ color: masked ? MASKED : read ? undefined : "#94a3b8", fontWeight: active === 1 && row === 0 ? 700 : 400 }}
                  >
                    {token}
                  </span>
                  <span className="flex gap-0.5" style={{ opacity: read ? 1 : 0.35 }}>
                    {Array.from({ length: HIDDEN_CELLS }, (_, c) => (
                      <Cell key={c} color={rowColor} filled={read && active !== 0} wideOnly={c >= 4} />
                    ))}
                    <span className="self-center pl-0.5 text-[10px] text-muted-foreground">…</span>
                  </span>
                  <span className="text-center text-xs" style={{ color: ACCENT, visibility: active > 0 && read ? "visible" : "hidden" }}>
                    →
                  </span>
                  <span className="flex min-h-4 min-w-0 items-center sm:min-h-6">
                    <OutputCells scene={active} row={row} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
