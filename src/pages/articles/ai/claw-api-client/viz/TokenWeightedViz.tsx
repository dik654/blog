import ApiSceneShell from "./ApiSceneShell";

/**
 * 본문 대응: #prompt-cache "hit rate보다 token-weighted 비용을 본다".
 * 짧은 prefix 10번 hit(각 2,000 token, 가정)와 긴 prefix 1번 miss(80,000 token, 가정).
 * 요청 수: 10/11 ≈ 91% hit. Token: read 20,000 / 전체 100,000 = 20%.
 */
const HITS = 10;
const HIT_TOKENS = 2000;
const MISS_TOKENS = 80000;
const READ_TOTAL = HITS * HIT_TOKENS;
const ALL_TOKENS = READ_TOTAL + MISS_TOKENS;
const REQUEST_RATE = Math.round((HITS / (HITS + 1)) * 100);
const TOKEN_RATE = Math.round((READ_TOTAL / ALL_TOKENS) * 100);
const fmt = (value: number) => value.toLocaleString("en-US");

const SCENES = [
  {
    label: "요청 수로 세면",
    summary: `hit ${HITS}/${HITS + 1} ≈ ${REQUEST_RATE}%`,
    note: `칸 하나가 요청 하나입니다. 11번 중 10번이 hit이므로 request hit rate는 약 ${REQUEST_RATE}%로 매우 좋아 보입니다. 하지만 이 숫자는 요청마다 prefix 길이가 얼마인지 보지 않습니다.`,
  },
  {
    label: "token으로 세면",
    summary: `cache read ${fmt(READ_TOTAL)} / ${fmt(ALL_TOKENS)} = ${TOKEN_RATE}%`,
    note: `같은 11번을 token 너비로 다시 그립니다. 짧은 hit 10번은 합쳐도 ${fmt(READ_TOTAL)} token이고, 긴 miss 한 번이 ${fmt(MISS_TOKENS)} token입니다. Cache read로 처리된 몫은 ${TOKEN_RATE}%뿐입니다.`,
  },
  {
    label: "비용은 종류별 단가를 곱해서",
    summary: "p_r·R + p_w·W 또는 p_u·U",
    note: "실제 비용은 cache read(R), cache write(W), 일반 input(U), output token을 provider usage field에서 따로 모아 같은 가격표 version의 단가를 곱해야 나옵니다. 긴 miss가 write였는지 uncached였는지에 따라 단가도 다르므로, 고정 배율 대신 실제 usage로 계산합니다.",
  },
] as const;

export default function TokenWeightedViz() {
  return (
    <ApiSceneShell
      eyebrow="hit rate vs token"
      title="열 번의 짧은 hit보다 한 번의 긴 miss가 더 클 수 있습니다"
      description={`짧은 prefix ${fmt(HIT_TOKENS)} token으로 10번 hit, 긴 prefix ${fmt(MISS_TOKENS)} token으로 1번 miss한 workload를 가정했습니다(숫자는 모두 가정). suffix·output token은 빼고 prefix token만 셉니다. 같은 11개 요청을 두 가지 방식으로 셉니다.`}
      ariaLabel="request hit rate와 token 가중 cache read 비율 비교"
      scenes={SCENES}
      render={(active) => {
        const byToken = active > 0;
        return (
          <div className="min-w-0 space-y-3">
            <div className="flex h-14 min-w-0 gap-0.5" aria-hidden>
              {Array.from({ length: HITS + 1 }, (_, index) => {
                const miss = index === HITS;
                const share = byToken ? ((miss ? MISS_TOKENS : HIT_TOKENS) / ALL_TOKENS) * 100 : 100 / (HITS + 1);
                return (
                  <div
                    key={index}
                    className="flex h-full min-w-[2px] items-center justify-center overflow-hidden rounded-sm text-[10px] font-bold text-white transition-[width] duration-300 motion-reduce:transition-none"
                    style={{ width: `${share}%`, backgroundColor: miss ? "#dc2626" : "#16a34a" }}
                  >
                    {miss ? "miss" : "hit"}
                  </div>
                );
              })}
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-3 text-xs">
              <div className="min-w-0 rounded-md border border-[#16a34a] px-2 py-1.5">
                <p className="font-bold text-green-700 dark:text-green-400">hit 10번 {active === 2 ? "· R" : ""}</p>
                <p className="font-mono">{byToken ? `${fmt(READ_TOTAL)} token (${TOKEN_RATE}%)` : `요청 10개`}</p>
                <p className="text-[11px] text-muted-foreground">{active === 2 ? "cache read 단가 p_r" : "각 2,000 token"}</p>
              </div>
              <div className="min-w-0 rounded-md border border-[#dc2626] px-2 py-1.5">
                <p className="font-bold text-red-700 dark:text-red-400">miss 1번 {active === 2 ? "· W 또는 U" : ""}</p>
                <p className="font-mono">{byToken ? `${fmt(MISS_TOKENS)} token (${100 - TOKEN_RATE}%)` : `요청 1개`}</p>
                <p className="text-[11px] text-muted-foreground">{active === 2 ? "write 단가 p_w 또는 일반 단가 p_u" : "80,000 token"}</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
