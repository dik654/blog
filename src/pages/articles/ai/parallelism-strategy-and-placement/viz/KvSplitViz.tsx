import SceneShell from "./SceneShell";

/**
 * 본문 대응: #procedure Model 구조 문단과 g_min 식의 K_rank.
 * K=200 GB, weight 140 GB, TP 8은 앞 예시 숫자를 구조만 바꿔 넣은 가정입니다. rank당 weight는 17.5 GB.
 * GQA head 8: 200/8=25, GQA head 4: 200/4=50, MLA DCP 1: 200, MLA DCP 8: 25.
 */
const K = 200;
const WEIGHT_PER_RANK = 140 / 8;
const BUDGET = 72;
const RANKS = Array.from({ length: 8 }, (_, rank) => rank);

const SCENES = [
  { label: "GQA · KV head 8개 (가정)", summary: "200 / min(8, 8) = 25 GB", note: "GQA는 여러 query head가 더 적은 KV head를 나눠 쓰는 구조입니다. KV head 수까지는 TP로 나뉩니다.", kv: K / 8, split: "TP로 나뉨" },
  { label: "GQA · KV head 4개 (가정)", summary: "200 / min(8, 4) = 50 GB", note: "KV head가 4개면 TP를 8로 올려도 KV는 4로만 나뉩니다. 나뉘는 한계가 KV head 수입니다.", kv: K / 4, split: "head 수까지만 나뉨" },
  { label: "MLA · DCP 없이", summary: "200 / 1 = 200 GB", note: "MLA는 KV를 압축해 저장하는 구조이며, 압축 KV가 TP rank마다 복제됩니다. TP 8이어도 rank마다 K 전체를 들어 예산 72 GB를 넘습니다.", kv: K, split: "rank마다 복제" },
  { label: "MLA · DCP 8", summary: "200 / 8 = 25 GB", note: "DCP(decode context parallel)는 KV를 sequence 축으로 나눕니다. 그래서 MLA model은 DCP를 함께 켭니다.", kv: K / 8, split: "sequence 축으로 나뉨" },
] as const;

export default function KvSplitViz() {
  return (
    <SceneShell
      eyebrow="KV 예산 K"
      title="TP를 올려도 KV가 나뉘는지는 attention 구조가 정합니다"
      description="칸 하나가 TP 8의 rank 하나이고, 칸을 채운 높이가 rank가 드는 KV입니다. K 200 GB·weight 140 GB·예산 72 GB는 앞 예시를 구조만 바꿔 넣은 가정입니다."
      ariaLabel="GQA와 MLA에서 KV 예산이 TP rank에 나뉘는 방식"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const total = WEIGHT_PER_RANK + scene.kv;
        const over = total > BUDGET;
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid grid-cols-8 gap-1" aria-hidden="true">
              {RANKS.map((rank) => (
                <div key={rank} className="flex h-24 flex-col justify-end rounded border border-border">
                  <div className={over ? "bg-[#dc2626]/50" : "bg-[#2563eb]/50"} style={{ height: `${(scene.kv / K) * 100}%` }} />
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground">{scene.split} · rank당 KV {scene.kv} GB</p>
            <p className={`rounded-md border px-2 py-1 text-center font-mono text-xs font-semibold ${over ? "border-[#dc2626] text-[#dc2626]" : "border-border"}`}>
              {WEIGHT_PER_RANK} + {scene.kv} = {total} GB {over ? ">" : "≤"} {BUDGET} GB
            </p>
          </div>
        );
      }}
    />
  );
}
