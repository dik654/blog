import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tp-split — Delta state는 value head 48개를 TP로 나누고, full attention KV는 KV head 4개까지만 나뉜다.
 * TP4: rank마다 value head 12개(144÷4=36 MiB), KV head 1개(64÷4=16 KiB/token).
 * TP8: rank마다 value head 6개(144÷8=18 MiB), KV head는 4개뿐이라 두 rank가 같은 head를 복제(16 KiB/token 그대로).
 * 합계 장면: Delta 18×8=144 MiB(복제 없음), KV 16×8=128 KiB/token = 64 KiB의 두 벌.
 * 어느 두 rank가 같은 KV head를 드는지는 본문이 정하지 않아 이웃한 rank로 그렸다(가정).
 */
const SLOTS = 8;
const V_HEADS = 48;
const KV_HEADS = 4;

const SCENES = [
  {
    label: "TP4",
    summary: "rank당 Delta 36 MiB · KV 16 KiB",
    tp: 4,
    totals: false,
    note: "GPU 네 장이면 value head 48개를 12개씩 나눠 rank마다 Delta state 36 MiB를 둡니다. KV head도 4개라 rank마다 서로 다른 head 하나를 들고, token 하나의 KV는 rank당 16 KiB입니다.",
  },
  {
    label: "TP8",
    summary: "rank당 Delta 18 MiB · KV 16 KiB",
    tp: 8,
    totals: false,
    note: "GPU를 여덟 장으로 늘리면 value head는 6개씩이라 Delta state가 18 MiB로 절반이 됩니다. KV head는 4개뿐이라 더 나눌 head가 없어 rank 두 개가 같은 head를 복제하고, rank당 KV는 16 KiB 그대로입니다.",
  },
  {
    label: "TP8 전체 합",
    summary: "Delta 144 MiB · KV 128 KiB",
    tp: 8,
    totals: true,
    note: "여덟 rank를 더하면 Delta state는 144 MiB로 복제가 없지만, KV는 16 KiB × 8 = 128 KiB로 token 하나의 KV 64 KiB가 두 벌 놓입니다(계산).",
  },
] as const;

function ownedKvHead(rank: number, tp: number) {
  return tp <= KV_HEADS ? rank : Math.floor(rank / (tp / KV_HEADS));
}

export default function TpRankSplitViz() {
  return (
    <SceneShell
      eyebrow="Tensor parallel 분할"
      title="Delta state는 GPU 수만큼 줄고 KV는 head 4개에서 멈춥니다"
      description="한 줄이 rank 하나(GPU 한 장)입니다. 왼쪽 48칸은 Delta state의 value head로, head마다 128×128 행렬 state가 하나씩 있고 칠한 칸이 그 rank가 가진 몫입니다. 오른쪽 4칸은 full attention이 K/V를 저장하는 KV head입니다. 한 request의 Delta state와 token 하나의 KV를 64층 중 linear 48층·full 16층 기준으로 셉니다."
      note="본문 계산과 같이 Delta state float32, KV BF16이며 convolution state·MTP 여분 칸·block padding은 뺐습니다. 같은 KV head를 드는 두 rank를 이웃으로 그린 것은 그림을 위한 가정입니다."
      ariaLabel="TP4와 TP8에서 rank마다 맡는 value head와 KV head"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const share = V_HEADS / scene.tp;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[3.25rem_minmax(0,1fr)_4.75rem] items-end gap-x-2 pb-1 text-[11px] text-muted-foreground sm:grid-cols-[4rem_minmax(0,1fr)_6.5rem] sm:gap-x-3">
              <span>rank</span>
              <span>value head 48 (Delta)</span>
              <span>KV head 4</span>
            </div>
            <div className="space-y-1">
              {Array.from({ length: SLOTS }, (_, rank) => {
                const used = rank < scene.tp;
                const kv = used ? ownedKvHead(rank, scene.tp) : -1;
                return (
                  <div
                    key={rank}
                    className={`grid grid-cols-[3.25rem_minmax(0,1fr)_4.75rem] items-center gap-x-2 sm:grid-cols-[4rem_minmax(0,1fr)_6.5rem] sm:gap-x-3 ${used ? "" : "opacity-40"}`}
                  >
                    <span className={`font-mono text-xs ${used ? "font-bold" : "text-muted-foreground"}`}>{used ? `r${rank}` : "없음"}</span>
                    <div className="flex h-4 min-w-0 gap-px" aria-hidden>
                      {Array.from({ length: V_HEADS }, (_, head) => {
                        const own = used && Math.floor(head / share) === rank;
                        return <span key={head} className="h-full min-w-0 flex-1 rounded-[1px]" style={{ backgroundColor: own ? "#0284c7" : "#cbd5e1", opacity: own ? 1 : 0.45 }} />;
                      })}
                    </div>
                    <div className="flex h-4 gap-0.5" aria-hidden>
                      {Array.from({ length: KV_HEADS }, (_, head) => {
                        const own = head === kv;
                        return (
                          <span
                            key={head}
                            className="h-full flex-1 rounded-[2px] border"
                            style={{
                              backgroundColor: own ? "#d97706" : "transparent",
                              borderColor: own ? "#d97706" : "#cbd5e1",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-border px-3 py-2">
                <span className="block text-muted-foreground">{scene.totals ? "Delta state 8 rank 합" : "rank당 Delta state"}</span>
                <span className="font-mono font-bold" style={{ color: "#0284c7" }}>
                  {scene.totals ? "18 × 8 = 144 MiB" : `144 ÷ ${scene.tp} = ${144 / scene.tp} MiB`}
                </span>
              </div>
              <div className="rounded-lg border border-border px-3 py-2">
                <span className="block text-muted-foreground">{scene.totals ? "token당 KV 8 rank 합" : "rank당 token KV"}</span>
                <span className="font-mono font-bold" style={{ color: "#b45309" }}>
                  {scene.totals ? "16 × 8 = 128 KiB" : scene.tp > KV_HEADS ? "head 1개 = 16 KiB (2 rank 복제)" : "64 ÷ 4 = 16 KiB"}
                </span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
