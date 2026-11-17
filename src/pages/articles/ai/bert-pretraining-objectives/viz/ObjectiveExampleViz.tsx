import ObjectiveSceneShell from "./ObjectiveSceneShell";

/**
 * 본문 대응: #nsp-sop(pair 만들기), #rtd(위치별 label).
 * 1) NSP: A→B positive, A→R negative / SOP: A→B positive, B→A negative. y=1이 positive.
 * 2) RTD: 문장·선택 위치·교체 token은 설명용 가정. eligible 5곳 중 교체 1곳만 r=0, MLM은 선택 2곳만 loss.
 */

const DOC1 = "#2563eb";
const DOC2 = "#d97706";

interface Seg {
  key: string;
  doc: 1 | 2 | 0;
}

function Chip({ seg }: { seg: Seg }) {
  if (seg.doc === 0) {
    return <span className="inline-flex h-10 min-w-0 items-center justify-center rounded-md border border-border px-2 font-mono text-xs text-muted-foreground">{seg.key}</span>;
  }
  const color = seg.doc === 1 ? DOC1 : DOC2;
  return (
    <span className="inline-flex h-10 min-w-0 flex-col items-center justify-center rounded-md border px-2 leading-4" style={{ borderColor: color }}>
      <span className="text-sm font-bold">{seg.key}</span>
      <span className="text-[10px] font-semibold" style={{ color }}>
        문서 {seg.doc}
      </span>
    </span>
  );
}

interface PairRow {
  name: string;
  segs: readonly Seg[];
  y: string;
  hint: string;
}

const CLS: Seg = { key: "[CLS]", doc: 0 };
const A: Seg = { key: "A", doc: 1 };
const B: Seg = { key: "B", doc: 1 };
const R: Seg = { key: "R", doc: 2 };

interface PairScene {
  label: string;
  summary: string;
  note: string;
  rows: readonly PairRow[];
}

const PAIR_SCENES: readonly PairScene[] = [
  {
    label: "재료",
    summary: "문서 1의 A→B · 다른 문서의 R",
    note: "문서 1에서 실제로 이어지는 segment A·B를, corpus의 다른 문서에서 segment R을 꺼냅니다. 색과 '문서 1·2' 표시가 출처입니다.",
    rows: [
      { name: "문서 1", segs: [A, B], y: "", hint: "A 다음에 실제로 B가 옵니다" },
      { name: "문서 2", segs: [R], y: "", hint: "A와 다른 문서의 segment입니다" },
    ],
  },
  {
    label: "NSP",
    summary: "negative = A 뒤에 다른 문서 R",
    note: "NSP는 B가 A의 실제 다음 segment(y=1)인지 random segment(y=0)인지 [CLS]에서 분류합니다. Negative에 다른 문서가 섞여 topic 차이만으로도 풀릴 수 있습니다.",
    rows: [
      { name: "positive · next", segs: [CLS, A, B], y: "y = 1", hint: "같은 문서 · 실제 순서" },
      { name: "negative · random", segs: [CLS, A, R], y: "y = 0", hint: "다른 문서 → topic 단서 가능" },
    ],
  },
  {
    label: "SOP",
    summary: "negative = 같은 A·B를 뒤집기",
    note: "SOP는 같은 문서의 A→B(y=1)와 B→A(y=0)를 분류합니다. Topic은 같고 discourse order만 바뀝니다. Loss 식이 NSP와 같아도 label을 만드는 pair가 다릅니다.",
    rows: [
      { name: "positive · 정상", segs: [CLS, A, B], y: "y = 1", hint: "같은 문서 · 실제 순서" },
      { name: "negative · 역순", segs: [CLS, B, A], y: "y = 0", hint: "같은 문서 · 순서만 뒤집음" },
    ],
  },
];

export function PairConstructionViz() {
  return (
    <ObjectiveSceneShell
      eyebrow="Pair 만들기"
      title="NSP와 SOP는 negative pair를 만드는 재료가 다릅니다"
      description="A·B·R은 문장 묶음(segment) 하나를 뜻합니다. y=1은 positive construction, y=0은 negative construction이고, [CLS]는 pair 전체를 대표하는 위치입니다."
      ariaLabel="NSP와 SOP의 positive와 negative pair 구성 비교"
      scenes={PAIR_SCENES}
      render={(active) => (
        <div className="space-y-3">
          {PAIR_SCENES[active].rows.map((row) => (
            <div key={row.name} className="rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-xs font-semibold text-muted-foreground">{row.name}</span>
                <span className="text-xs text-muted-foreground">{row.hint}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {row.segs.map((seg, index) => (
                  <Chip key={`${seg.key}-${index}`} seg={seg} />
                ))}
                {row.y && <span className="ml-auto font-mono text-sm font-bold text-primary">{row.y}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    />
  );
}

/* ── RTD ─────────────────────────────────────────────────────── */

const TOKENS = ["[CLS]", "고양이", "가", "생선", "을", "먹었다", "[SEP]", "[PAD]"] as const;
const SPECIAL = new Set([0, 6, 7]);
const SELECTED = new Set([3, 5]);
const REPLACED: Record<number, string> = { 3: "우유", 5: "먹었다" };

const RTD_SCENES = [
  {
    label: "MLM: 고른 위치만",
    summary: "loss 위치 2곳",
    note: "MLM은 고른 위치 집합 M에서만 원래 단어를 vocabulary 전체 중에서 맞힙니다. 이 예에서는 '생선'과 '먹었다' 두 곳을 골랐다고 가정합니다.",
  },
  {
    label: "Generator가 바꿈",
    summary: "생선 → 우유 · 먹었다 → 먹었다",
    note: "Generator는 고른 위치에 그럴듯한 token을 제안합니다. '생선'은 '우유'로 바뀌고, '먹었다' 자리는 우연히 원래 token이 나왔다고 가정합니다. 이 자리를 무엇으로 볼지가 label convention입니다.",
  },
  {
    label: "Discriminator의 위치별 label",
    summary: "RTD 5곳 · MLM 2곳",
    note: "Discriminator는 eligible 위치마다 원본(r=1)인지 바뀜(r=0)인지 맞힙니다. 특수 token·PAD를 빼면 5곳입니다. Label이 많다고 representation이 자동으로 좋아지지는 않습니다.",
  },
] as const;

function Cell({ text, tone }: { text: string; tone: "plain" | "muted" | "pick" | "bad" | "warn" | "good" }) {
  const style =
    tone === "bad"
      ? { borderColor: "#dc2626", color: "#dc2626" }
      : tone === "warn"
        ? { borderColor: "#d97706", color: "#d97706" }
        : tone === "pick" || tone === "good"
          ? { borderColor: "#2563eb" }
          : undefined;
  return (
    <span
      className={`flex h-8 min-w-0 items-center justify-center rounded-md border px-0.5 text-center text-[10px] font-semibold leading-3 sm:text-xs ${
        tone === "muted" ? "border-dashed border-border text-muted-foreground/70" : tone === "plain" ? "border-border" : ""
      } ${tone === "pick" || tone === "good" ? "border-[1.25px]" : ""}`}
      style={style}
    >
      {text}
    </span>
  );
}

export function RtdLabelViz() {
  return (
    <ObjectiveSceneShell
      eyebrow="RTD · 위치별 label"
      title="MLM은 고른 자리만, RTD discriminator는 입력의 모든 eligible 자리를 채점합니다"
      description="칸 하나가 token 위치입니다. 문장, 고른 두 위치, 교체 token은 설명용 가정입니다."
      ariaLabel="MLM의 선택 위치 loss와 RTD discriminator의 위치별 original/replaced label 비교"
      scenes={RTD_SCENES}
      render={(active) => {
        const lossRow = TOKENS.map((_, index) => {
          if (active === 0) return SELECTED.has(index) ? { text: "✓", tone: "pick" as const } : { text: "·", tone: "muted" as const };
          if (active === 1) return { text: "—", tone: "muted" as const };
          if (SPECIAL.has(index)) return { text: "제외", tone: "muted" as const };
          if (index === 3) return { text: "r=0", tone: "bad" as const };
          if (index === 5) return { text: "r=1*", tone: "warn" as const };
          return { text: "r=1", tone: "good" as const };
        });
        const inputRow = TOKENS.map((token, index) => {
          if (active === 0) return { text: "—", tone: "muted" as const };
          if (index === 3) return { text: REPLACED[3], tone: "bad" as const };
          if (index === 5) return { text: REPLACED[5], tone: "warn" as const };
          return { text: token, tone: SPECIAL.has(index) ? ("muted" as const) : ("plain" as const) };
        });
        const rows = [
          { name: "원문 x", cells: TOKENS.map((token, index) => ({ text: token, tone: SELECTED.has(index) && active === 0 ? ("pick" as const) : SPECIAL.has(index) ? ("muted" as const) : ("plain" as const) })) },
          { name: "Discriminator 입력 x̃ (generator가 바꾼 문장)", cells: inputRow },
          { name: active === 0 ? "Loss 위치 · MLM" : "Loss 위치 · RTD label r", cells: lossRow },
        ];
        return (
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.name}>
                <p className="mb-1 text-xs font-semibold text-muted-foreground">{row.name}</p>
                <div className="grid grid-cols-8 gap-1">
                  {row.cells.map((cell, index) => (
                    <Cell key={index} text={cell.text} tone={cell.tone} />
                  ))}
                </div>
              </div>
            ))}
            <p className="text-xs leading-5 text-muted-foreground">
              {active === 2 ? "* 우연히 원래 token: 식 1[x̃=x] 기준 r=1 · 구현별 convention 확인" : " "}
            </p>
          </div>
        );
      }}
    />
  );
}
