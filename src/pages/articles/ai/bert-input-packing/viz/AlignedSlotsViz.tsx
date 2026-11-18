import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #aligned-tensors — 네 tensor는 같은 slot에 줄을 맞추지만 쓰이는 곳이 다르다.
 * input_ids·position_ids·token_type_ids는 row를 조회해 더하고(e_i), attention_mask는 score 단계에서 PAD key를 닫는다.
 * slot 수 6은 글의 fixture [CLS] A [SEP] B [SEP] [PAD]에서 왔고, A·B를 token 하나로 줄인 것은 가정이다.
 */
const TOKENS: readonly string[] = [
  "[CLS]",
  "A",
  "[SEP]",
  "B",
  "[SEP]",
  "[PAD]",
];
const POSITIONS: readonly number[] = [0, 1, 2, 3, 4, 5];
const TYPES: readonly string[] = ["0", "0", "0", "1", "1", "0*"];
const MASK: readonly number[] = [1, 1, 1, 1, 1, 0];
const PAD_SLOT = 5;
const FOCUS_SLOT = 3;
const STRIP_CELLS = [0, 1, 2, 3, 4, 5, 6, 7];

const SCENES = [
  {
    label: "네 줄, 같은 여섯 칸",
    summary: "4줄 × 6 slot",
    note: "같은 세로 열이 같은 slot입니다. input_ids 칸에는 token 글자가 아니라 tokenizer config에서 확인한 vocabulary row 번호가 들어갑니다. A·B는 각각 token 하나로 줄여 그렸습니다(가정).",
  },
  {
    label: "slot 3 하나의 입력 vector",
    summary: "E_tok + E_pos + E_seg",
    note: "slot 3(B)은 세 표에서 row를 하나씩 조회합니다. 세 vector의 hidden width가 같아서 좌표별로 더할 수 있고, 그 합 e_3이 첫 encoder layer로 들어갑니다. attention_mask 줄은 이 합에 들어가지 않습니다.",
  },
  {
    label: "PAD는 score 단계에서 닫힘",
    summary: "mask 0 → key 열 제거",
    note: "attention_mask가 0인 slot 5는 어느 query 행에서도 key로 읽히지 않습니다. 그 열의 logit에 −∞를 더해 weight가 0이 됩니다. mask는 embedding 합에 더하는 값이 아니라 score 단계의 control tensor입니다.",
  },
] as const;

type Tone = "plain" | "focus" | "closed" | "dim";

function toneClass(tone: Tone) {
  if (tone === "focus")
    return "border-[#2563eb] bg-[#2563eb]/10 font-bold text-foreground";
  if (tone === "closed")
    return "border-dashed border-[#dc2626] font-bold text-[#b91c1c] dark:text-[#f87171]";
  if (tone === "dim") return "border-border/50 text-muted-foreground/60";
  return "border-border bg-background text-foreground";
}

function TensorRow({
  name,
  hint,
  cells,
  toneAt,
}: {
  name: string;
  hint: string;
  cells: readonly string[];
  toneAt: (slot: number) => Tone;
}) {
  return (
    <div className="min-w-0">
      <p className="flex flex-wrap items-baseline gap-x-2 text-xs">
        <span className="font-mono font-bold text-foreground">{name}</span>
        <span className="text-muted-foreground">{hint}</span>
      </p>
      <div className="mt-1 grid grid-cols-6 gap-1">
        {cells.map((cell, slot) => (
          <span
            key={slot}
            className={`flex h-7 min-w-0 items-center justify-center rounded-md border px-0.5 font-mono text-[11px] sm:text-xs ${toneClass(toneAt(slot))}`}
          >
            {cell}
          </span>
        ))}
      </div>
    </div>
  );
}

function Strip({ label, fill }: { label: string; fill: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[8rem_minmax(0,1fr)]">
      <span className="font-mono text-xs text-foreground">{label}</span>
      <div className="grid grid-cols-8 gap-0.5">
        {STRIP_CELLS.map((cell) => (
          <span
            key={cell}
            className="h-4 rounded-sm border border-border"
            style={{ backgroundColor: fill }}
          />
        ))}
      </div>
    </div>
  );
}

function SlotPanel() {
  return (
    <div className="space-y-2 text-sm leading-6 text-muted-foreground">
      <p>
        token_type_ids는 [CLS]·A·첫 [SEP]을 A 구간 0, B·둘째 [SEP]을 B 구간 1로
        둡니다(관례적 배치, 가정).
      </p>
      <p>
        * PAD 칸의 type 값은 이 글이 정하지 않아 0으로 채웠습니다(가정).
        position 5는 slot 순서를 그대로 적은 값입니다.
      </p>
    </div>
  );
}

function SumPanel() {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        칸 8개는 hidden width d를 줄여 그린 것입니다(가정). 색은 출처 표만
        구분합니다.
      </p>
      <Strip label="E_tok[ID(B)]" fill="#dbeafe" />
      <Strip label="E_pos[3]" fill="#dcfce7" />
      <Strip label="E_seg[1]" fill="#fef3c7" />
      <div className="border-t border-border pt-2">
        <Strip label="= e_3" fill="#bfdbfe" />
      </div>
      <p className="text-xs text-muted-foreground">
        attention_mask[3] = 1은 이 합에 쓰지 않습니다.
      </p>
    </div>
  );
}

function ScorePanel() {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">
        attention score 표 · 행 = query slot, 열 = key slot
      </p>
      <div className="mt-1 grid grid-cols-[2.75rem_repeat(6,minmax(0,1fr))] gap-0.5 font-mono text-[10px] sm:text-[11px]">
        <span />
        {TOKENS.map((token, key) => (
          <span
            key={`k-${key}`}
            className={`truncate text-center ${key === PAD_SLOT ? "font-bold text-[#b91c1c] dark:text-[#f87171]" : "text-muted-foreground"}`}
          >
            {token}
          </span>
        ))}
        {TOKENS.map((query, row) => [
          <span key={`q-${row}`} className="truncate text-muted-foreground">
            {query}
          </span>,
          ...TOKENS.map((_, key) => (
            <span
              key={`c-${row}-${key}`}
              className={`flex h-5 items-center justify-center rounded-sm border ${
                key === PAD_SLOT
                  ? "border-dashed border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              {key === PAD_SLOT ? "−∞" : "·"}
            </span>
          )),
        ])}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        PAD 열의 weight = 0 · 나머지 다섯 열 사이에서만 weight가 나뉩니다.
      </p>
    </div>
  );
}

export default function AlignedSlotsViz() {
  return (
    <SceneShell
      eyebrow="같은 slot, 다른 쓰임"
      title="네 줄은 같은 칸에 맞추지만 쓰이는 단계가 다릅니다"
      description="[CLS] A [SEP] B [SEP] [PAD] 여섯 slot에 네 tensor를 세로로 맞춘 표입니다. 세 줄은 embedding row를 조회해 더하고, attention_mask 한 줄은 attention score에서 PAD key를 닫습니다."
      ariaLabel="BERT 입력 네 tensor를 여섯 slot에 맞춘 표와 각 줄이 쓰이는 단계"
      scenes={SCENES}
      render={(active) => {
        const lookupTone = (slot: number): Tone =>
          active === 1
            ? slot === FOCUS_SLOT
              ? "focus"
              : "dim"
            : active === 2
              ? "dim"
              : "plain";
        const maskTone = (slot: number): Tone =>
          active === 1
            ? "dim"
            : active === 2
              ? slot === PAD_SLOT
                ? "closed"
                : "focus"
              : "plain";
        return (
          <div className="grid min-w-0 gap-4 md:grid-cols-2 md:gap-6">
            <div className="min-w-0 space-y-2">
              <TensorRow
                name="input_ids"
                hint="vocabulary row 번호 · 칸에는 token 이름으로 표시"
                cells={TOKENS}
                toneAt={lookupTone}
              />
              <TensorRow
                name="position_ids"
                hint="slot 순서"
                cells={POSITIONS.map(String)}
                toneAt={lookupTone}
              />
              <TensorRow
                name="token_type_ids"
                hint="A·B 소속"
                cells={TYPES}
                toneAt={lookupTone}
              />
              <TensorRow
                name="attention_mask"
                hint="실제 내용 1 · PAD 0"
                cells={MASK.map(String)}
                toneAt={maskTone}
              />
            </div>
            <StableSceneStack
              active={active}
              className="border-t border-border pt-3 md:border-l md:border-t-0 md:pl-6 md:pt-0"
              scenes={[
                <SlotPanel key="slot" />,
                <SumPanel key="sum" />,
                <ScorePanel key="score" />,
              ]}
            />
          </div>
        );
      }}
    />
  );
}
