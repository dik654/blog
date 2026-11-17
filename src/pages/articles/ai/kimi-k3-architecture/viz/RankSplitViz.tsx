import SceneShell from "./SceneShell";

/**
 * 본문 대응: #serving — TP는 MLA KV를 rank마다 복제하고, DCP는 token 축으로 나누며, KDA state는 head로 나뉜다.
 * MLA KV: 24층 × 576 × 2byte = 27,648byte = 27KiB/token, × 1,048,576 token = 27GiB.
 * TP16: rank마다 27GiB(16벌 → 합 432GiB). DCP16: 27 ÷ 16 = 1.6875 ≈ 1.7GiB.
 * KDA: 69 × 96 × 128 × 128 × 4byte = 434,110,464byte ≈ 414MiB, 96 head ÷ 16 = 6 head ≈ 25.9MiB.
 */
const RANKS = 16;
const KDA_HEADS = 96;

const MLA_COLOR = "#1d4ed8";
const KDA_COLOR = "#0e7490";

const SCENES = [
  {
    label: "MLA KV 전체",
    summary: "27KiB × 1,048,576 = 27GiB",
    note: "MLA 24층이 token 하나마다 576개씩 남기면 27KiB입니다. 공개 최대 문맥 1,048,576 token을 채우면 27GiB가 됩니다. 아직 16장의 rank 어디에도 놓기 전입니다.",
  },
  {
    label: "TP16만 쓰면",
    summary: "rank마다 27GiB",
    note: "TP(tensor parallel)는 head를 여러 rank에 나눠 맡기는데, MLA cache는 KV head 1개로 등록되어 TP로 나눌 head가 없습니다. 16장 모두 같은 27GiB를 들고, 16장을 합치면 같은 latent가 16벌, 432GiB입니다.",
  },
  {
    label: "DCP16을 켜면",
    summary: "27GiB ÷ 16 ≈ 1.7GiB",
    note: "decode context parallel(DCP)은 복제되던 MLA KV를 token 축으로 다시 나눕니다. token을 16장에 번갈아 놓아 각 rank가 16분의 1만 들고, 16장을 합치면 27GiB 한 벌입니다.",
  },
  {
    label: "KDA state는 head로",
    summary: "96 head ÷ 16 = 6 head",
    note: "KDA state는 request당 약 414MiB이고 문맥 길이와 무관합니다. head 96개를 TP16으로 나누면 rank마다 head 6개, 약 26MiB입니다.",
  },
] as const;

const TOTAL_LINE = [
  "아직 배치 전",
  "16장 합계 432GiB · 같은 27GiB가 16벌",
  "16장 합계 27GiB · 한 벌을 나눠 가짐",
  "16장 합계 약 414MiB · 문맥 길이와 무관",
] as const;

const DETAIL_LINE = [
  "rank 16장이 모두 비어 있음",
  "rank마다 27GiB · 16장 모두 같은 latent 전체를 듦",
  "rank마다 ≈1.7GiB · rank 0은 token 0, 16, 32, …, rank 1은 token 1, 17, …",
  `rank마다 ≈26MiB · KDA head ${KDA_HEADS / RANKS}개`,
] as const;

function RankCard({ rank, active }: { rank: number; active: number }) {
  const kda = active === 3;
  const fraction = active === 1 ? 1 : active >= 2 ? 1 / RANKS : 0;
  const value = active === 1 ? "27GiB" : active === 2 ? "≈1.7GiB" : active === 3 ? "≈26MiB" : "—";
  return (
    <div className="min-w-0 rounded-md border border-border bg-background px-1 py-1.5 md:px-1.5">
      <div className="flex items-baseline justify-center gap-1 text-[10px] leading-4 md:justify-between md:text-[11px]">
        <span className="text-muted-foreground">r{rank}</span>
        <span className="hidden font-mono font-bold md:inline">{value}</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-sm bg-muted/60">
        <div
          className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${fraction * 100}%`, backgroundColor: kda ? KDA_COLOR : MLA_COLOR, minWidth: fraction > 0 ? 3 : 0 }}
        />
      </div>
    </div>
  );
}

export default function RankSplitViz() {
  return (
    <SceneShell
      eyebrow="rank 16장에 놓기"
      title="TP는 MLA KV를 복제하고, DCP는 token으로 나눕니다"
      description="칸 하나가 GPU rank 한 장(r0~r15)이고, 막대는 그 rank가 드는 몫을 request 하나의 전체(MLA KV 27GiB 또는 KDA state 약 414MiB)에 대한 비율로 그립니다. 파랑은 MLA KV, 청록은 KDA state입니다."
      note="1M token request 하나, MLA KV BF16·KDA float32 가정의 계산이며 측정값이 아닙니다. 파랑과 청록은 전체 크기가 달라 막대끼리 길이를 비교하지 않습니다. token을 rank에 번갈아 놓는 순서(token 0은 rank 0, 1은 rank 1 …)는 '번갈아'를 그림으로 옮긴 설명용 배치입니다(가정). Convolution state와 block padding은 뺐습니다."
      ariaLabel="MLA KV와 KDA state가 rank 16장에 복제되거나 나뉘는 방식"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-8 gap-1 sm:gap-2">
            {Array.from({ length: RANKS }, (_, rank) => (
              <RankCard key={rank} rank={rank} active={active} />
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground sm:text-sm">{DETAIL_LINE[active]}</p>
          <p className="mt-1 font-mono text-xs font-bold sm:text-sm" style={{ color: active === 3 ? KDA_COLOR : MLA_COLOR }}>
            {TOTAL_LINE[active]}
          </p>
        </div>
      )}
    />
  );
}
