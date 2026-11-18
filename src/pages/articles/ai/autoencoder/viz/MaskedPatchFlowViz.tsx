import SceneShell from "./SceneShell";

/**
 * 본문 대응: #masking — 전체 patch N에서 mask set M을 빼 visible set V를 만들고,
 * V만 무거운 encoder에, V의 표현과 mask token을 원래 자리 순서로 가벼운 decoder에 보내며,
 * loss는 M 위치에서만 평균한다. N=16, |M|=12, |V|=4는 설명용 가정이다.
 */
const N = 16;
const VISIBLE: readonly number[] = [1, 6, 8, 15];

const SCENES = [
  {
    label: "patch로 나누기",
    summary: "N = 16 (가정)",
    note: "이미지를 작은 정사각형 조각(patch) 16개로 나눴다고 합시다 (가정). 번호는 각 조각의 원래 자리이며, 뒤 단계에서도 이 순서를 그대로 씁니다.",
  },
  {
    label: "mask set M 고르기",
    summary: "|M| = 12 · V = 16 − 12 = 4",
    note: "숨길 자리 12개를 M으로 고릅니다 (가정). 전체에서 M을 뺀 나머지 4개가 보이는 자리 V입니다. 어느 자리를 얼마나 숨길지는 재현 가능한 규칙으로 정해야 합니다.",
  },
  {
    label: "무거운 encoder는 V만",
    summary: "encoder 입력 4개 (16개가 아님)",
    note: "MAE는 보이는 patch 4개만 무거운 encoder에 보냅니다. 숨긴 12자리는 encoder 계산에 들어가지 않으므로 encoder가 처리할 양이 V의 크기로 줄어듭니다.",
  },
  {
    label: "가벼운 decoder는 16자리 전부",
    summary: "표현 4개 + mask token 12개",
    note: "가벼운 decoder는 encoder가 낸 표현 4개와, 숨긴 자리를 표시하는 mask token 12개를 원래 자리 순서대로 받아 빠진 내용을 복원합니다. 순서가 어긋나면 엉뚱한 자리의 정답과 비교하게 됩니다.",
  },
  {
    label: "loss는 M에서만",
    summary: "L = (1/12) × 숨긴 12자리 오차의 합",
    note: "복원 오차는 숨긴 12자리에서만 더하고 12로 나눠 patch당 크기로 맞춥니다. 보이던 4자리는 이 loss에 들어가지 않습니다.",
  },
] as const;

type Kind = "plain" | "visible" | "masked" | "loss" | "skip";

function cellKind(active: number, idx: number): Kind {
  const vis = VISIBLE.includes(idx);
  if (active === 0) return "plain";
  if (active === 4) return vis ? "skip" : "loss";
  return vis ? "visible" : "masked";
}

const KIND_CLASS: Record<Kind, string> = {
  plain: "border-border bg-background text-foreground",
  visible: "border-blue-600 bg-blue-600/15 text-blue-800 dark:text-blue-300 font-bold",
  masked: "border-dashed border-slate-400 bg-slate-400/10 text-muted-foreground",
  loss: "border-red-600 bg-red-600/10 text-red-700 dark:text-red-400 font-bold",
  skip: "border-dashed border-border/60 text-muted-foreground/50",
};

function Tile({ idx, kind }: { idx: number; kind: Kind }) {
  return (
    <div className={`flex aspect-square min-w-0 items-center justify-center rounded border text-[10px] sm:text-xs ${KIND_CLASS[kind]}`}>
      {kind === "masked" ? "□" : idx + 1}
    </div>
  );
}

function Lane({ title, sub, on, slots, tiles }: { title: string; sub: string; on: boolean; slots: number; tiles: readonly { idx: number; kind: Kind; text?: string }[] }) {
  return (
    <div className={`rounded-lg border p-2 ${on ? "border-border" : "border-dashed border-border/50"}`}>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
        <span className={`font-semibold ${on ? "" : "text-muted-foreground/50"}`}>{title}</span>
        <span className="text-muted-foreground">{on ? sub : "아직 없음"}</span>
      </div>
      <div className="grid grid-cols-8 gap-1 sm:grid-cols-16">
        {Array.from({ length: slots }, (_, slot) => {
          const tile = on ? tiles[slot] : undefined;
          if (!tile) return <div key={slot} className="aspect-square min-w-0 rounded border border-dashed border-border/30" />;
          return (
            <div key={slot} className={`flex aspect-square min-w-0 items-center justify-center rounded border text-[9px] sm:text-[10px] ${KIND_CLASS[tile.kind]}`}>
              {tile.text ?? tile.idx + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MaskedPatchFlowViz() {
  return (
    <SceneShell
      eyebrow="MAE 계산 흐름"
      title="encoder는 보이는 4조각만, loss는 숨긴 12조각만 봅니다"
      description="4×4 격자는 원래 이미지의 patch 자리입니다. 파란 칸은 보이는 patch, □는 숨긴 patch, 붉은 칸은 loss를 계산하는 자리입니다. 16개와 12개는 설명용 가정입니다."
      ariaLabel="patch 분할, mask 선택, encoder 입력, decoder 입력, masked loss 순서"
      scenes={SCENES}
      render={(active) => {
        const encoderTiles = VISIBLE.map((idx) => ({ idx, kind: "visible" as Kind }));
        const decoderTiles = Array.from({ length: N }, (_, idx) =>
          VISIBLE.includes(idx) ? { idx, kind: "visible" as Kind, text: `z${idx + 1}` } : { idx, kind: "masked" as Kind, text: "m" },
        );
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-start">
            <div className="mx-auto w-full max-w-[7.5rem] sm:max-w-[9rem]">
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: N }, (_, idx) => (
                  <Tile key={idx} idx={idx} kind={cellKind(active, idx)} />
                ))}
              </div>
              <p className="mt-1 text-center text-[11px] text-muted-foreground">원래 자리 1–16</p>
            </div>
            <div className="min-w-0 space-y-2">
              <Lane title="무거운 encoder 입력" sub="V의 patch 4개 · 숨긴 12개는 보내지 않음" on={active >= 2} slots={VISIBLE.length} tiles={encoderTiles} />
              <Lane title="가벼운 decoder 입력" sub="z = encoder 표현 · m = mask token" on={active >= 3} slots={N} tiles={decoderTiles} />
            </div>
          </div>
        );
      }}
    />
  );
}
