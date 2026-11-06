import SceneShell from "./SceneShell";

/**
 * 본문 대응: kv-residency 절 — 나누지 않으면 8장이 같은 KV를 복제해 한 장 몫만 남고, 나누면 풀이 커진다.
 * 200K 칸으로 세기: 190,000 ÷ 200,000 = 0.95칸, 3,621,504 ÷ 200,000 = 18.1 → 18칸 + 21,504토큰.
 * 약 19만 대 3,621,504는 약 19배(계산)이며 형식과 분할이 함께 바뀐 값이다.
 */
const SESSION = 200_000;
const CELLS = 19;
const POOLS = [190_000, 3_621_504] as const;

const SCENES = [
  { label: "나누지 않음 · BF16", summary: "약 19만 토큰 → 200K 세션 0개", note: "8장이 같은 KV를 한 벌씩 들고 있어 장수를 늘려도 용량은 한 장 몫입니다. 숫자당 2byte인 BF16으로 저장한 이 풀은 200K 세션 하나의 0.95칸이라 온전히 담지 못합니다. 위키는 약 1개로 적었습니다." },
  { label: "8장에 나눔 · FP8", summary: "3,621,504토큰 → 200K 세션 18개", note: "문맥을 8장에 나눠 담고 숫자당 1byte인 FP8로 저장한 풀입니다. 200K 칸 18개가 차고 21,504토큰이 남습니다. 남은 자리로는 세션을 상주시키지 못하고, 작은 풀과의 차이 약 19배는 형식과 분할을 함께 바꾼 값입니다." },
] as const;

export default function KvPoolLayoutViz() {
  return (
    <SceneShell
      eyebrow="KV 풀의 배치"
      title="GPU 8장이 KV를 어떻게 드느냐에 따라 세션 수가 0개와 18개로 갈립니다"
      description="위 칸 8개가 GPU 8장, 아래 칸 하나가 200K 세션 하나의 KV 자리입니다. 3절과 같은 8장 서버에서 Kimi K2.5의 가중치를 올리고 남은 풀이며, 두 장면의 칸 크기는 같습니다."
      note="풀 크기는 rtx6kpro 위키의 현장 경험 값입니다. GPU 안의 글자는 무엇을 담았는지를 나타낼 뿐 각 장의 실제 용량을 재지 않습니다."
      ariaLabel="문맥 분할 여부와 KV 저장 형식에 따른 KV 풀 크기와 200K 세션 수"
      scenes={SCENES}
      render={(active) => {
        const split = active === 1;
        const pool = POOLS[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }, (_, gpu) => (
                <div key={gpu} className={`rounded-lg border px-1 py-2 text-center text-xs leading-5 ${split ? "border-primary/60" : "border-dashed border-[#b45309]"}`}>
                  <span className="block font-mono text-muted-foreground">GPU {gpu + 1}</span>
                  <span className={`block font-semibold ${split ? "text-primary" : "text-[#b45309]"}`}>{split ? `조각 ${gpu + 1}/8` : "같은 KV"}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs font-bold text-foreground">
              KV 풀 <span className="font-mono font-normal text-muted-foreground">(칸 하나 = 200K 세션 하나)</span>
            </p>
            <div className="mt-2 grid grid-cols-10 gap-1 sm:grid-cols-[repeat(19,minmax(0,1fr))]" aria-hidden="true">
              {Array.from({ length: CELLS }, (_, cell) => {
                const fill = Math.max(0, Math.min(1, pool / SESSION - cell));
                return (
                  <span key={cell} className={`relative h-7 overflow-hidden rounded-sm border ${fill > 0 ? "border-primary/70" : "border-dashed border-border/60"}`}>
                    <span className="absolute inset-y-0 left-0 bg-primary/45" style={{ width: `${fill * 100}%` }} />
                  </span>
                );
              })}
            </div>
            <p className="mt-3 font-mono text-xs font-bold sm:text-sm">
              {split ? "3,621,504 ÷ 200,000 = 18.1 → 18개" : "190,000 ÷ 200,000 = 0.95 → 0개"}
            </p>
          </div>
        );
      }}
    />
  );
}
