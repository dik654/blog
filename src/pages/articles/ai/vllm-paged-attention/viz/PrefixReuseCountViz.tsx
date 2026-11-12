import PagedSceneShell from "./PagedSceneShell";

/**
 * 본문 대응: #prefix-sharing 둘째~넷째 문단(모두 가정 사례).
 * 공간: 길이 1,000 = 62 full block(992 token) + 8-token tail. 공유 없이 63×10=630, 공유하면 62+10=72.
 * 35-token: 10개 중 9개가 32 hit → token 288/350≈82.29%, request 9/10=90%.
 * 1,200-token: 9개가 992 hit → 8,928/12,000=74.4%, request 90%, 차이 15.6%p, 상대 차이 15.6/74.4≈21.0%.
 */
const REQUESTS = 10;
const FULL = 62;
const PER_REQ = FULL + 1;
const NO_SHARE = PER_REQ * REQUESTS;
const SHARED = FULL + REQUESTS;

const SMALL = { len: 35, hit: 32 };
const LARGE = { len: 1200, hit: 992 };
const HIT_REQ = 9;
const MISS_INDEX = 0;

const pct = (value: number, digits: number) => (value * 100).toFixed(digits);
const smallTok = (SMALL.hit * HIT_REQ) / (SMALL.len * REQUESTS);
const largeTok = (LARGE.hit * HIT_REQ) / (LARGE.len * REQUESTS);
const reqRate = HIT_REQ / REQUESTS;

const SCENES = [
  { label: "공유 없음", summary: `63개 × 10 = ${NO_SHARE}개`, note: "길이 1,000은 16칸 block 62개(992 token)와 8-token tail 하나, 합쳐 63개입니다. 요청 10개가 각자 따로 담으면 630개가 필요합니다." },
  { label: "앞 62개 공유", summary: `62 + 10 = ${SHARED}개`, note: "앞 62개를 한 벌만 두고 tail만 요청마다 가지면 72개입니다. 모든 hit가 유효한 뒤 함께 실행된다는 전제이며, 처음부터 동시에 들어와 계산이 끝나지 않은 경우까지 이 수치를 보장하지는 않습니다." },
  { label: "35-token 조회 10개", summary: `token ${pct(smallTok, 2)}% · request ${pct(reqRate, 0)}%`, note: "9개가 32 token씩 hit하면 hit 288개를 조회 350개로 나눠 약 82.29%입니다. 한 번이라도 hit한 요청은 9/10 = 90%입니다. 막대 길이로 세는 값과 요청 수로 세는 값이 다릅니다." },
  { label: "1,200-token 조회 10개", summary: `token ${pct(largeTok, 1)}% · request ${pct(reqRate, 0)}%`, note: "9개가 992 token씩 hit하면 8,928/12,000 = 74.4%입니다. 요청 비율 90%와 15.6%p, 상대적으로 약 21.0% 차이가 납니다. 어느 쪽도 prefill 시간이 그만큼 줄었다는 뜻은 아닙니다." },
] as const;

const W = 360;

function BlockGrid({ shared }: { shared: boolean }) {
  const cell = (W - 70) / PER_REQ;
  const rowH = 9;
  const top = 18;
  return (
    <svg viewBox={`0 0 ${W} 150`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={shared ? "공유 block 62개와 tail 10개" : "요청마다 block 63개씩 10줄"}>
      <text x={0} y={10} fontSize={10} fill="#64748b">요청</text>
      <text x={W} y={10} textAnchor="end" fontSize={10} fill="#64748b">칸 하나 = block 1개</text>
      {Array.from({ length: REQUESTS }, (_, row) => {
        const y = top + row * (rowH + 3);
        return (
          <g key={row}>
            <text x={0} y={y + 8} fontSize={9} fill="#64748b">{row + 1}</text>
            {Array.from({ length: PER_REQ }, (_, col) => {
              const isTail = col === FULL;
              const exists = isTail || !shared || row === 0;
              const fill = isTail ? "#f59e0b" : shared ? "#2563eb" : "#94a3b8";
              return exists ? <rect key={col} x={18 + col * cell} y={y} width={Math.max(cell - 0.8, 1)} height={rowH} fill={fill} /> : <rect key={col} x={18 + col * cell} y={y} width={Math.max(cell - 0.8, 1)} height={rowH} fill="none" stroke="#e2e8f0" strokeWidth={0.5} />;
            })}
            <text x={W} y={y + 8} textAnchor="end" fontSize={9} fill="#475569">{shared ? (row === 0 ? "62+1" : "+1") : "63"}</text>
          </g>
        );
      })}
      <text x={18} y={top + REQUESTS * (rowH + 3) + 12} fontSize={11} fontWeight={700} fill={shared ? "#1d4ed8" : "#334155"}>
        {shared ? `공유 62개 + tail 10개 = ${SHARED}개` : `63개 × 10 = ${NO_SHARE}개`}
      </text>
    </svg>
  );
}

function HitBars({ len, hit, rate }: { len: number; hit: number; rate: number }) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="space-y-1">
        {Array.from({ length: REQUESTS }, (_, row) => {
          const isMiss = row === MISS_INDEX;
          const hitShare = isMiss ? 0 : hit / len;
          return (
            <div key={row} className="grid grid-cols-[1.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-[11px]">
              <span className="text-right text-muted-foreground">{row + 1}</span>
              <svg viewBox="0 0 100 6" preserveAspectRatio="none" className="h-3 w-full" aria-hidden="true">
                <rect x={0} y={0} width={100} height={6} fill="#e2e8f0" />
                <rect x={0} y={0} width={hitShare * 100} height={6} fill="#2563eb" />
              </svg>
              <span className={`font-mono ${isMiss ? "text-muted-foreground" : "font-semibold"}`}>{isMiss ? "miss" : `${hit}/${len.toLocaleString("en-US")}`}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
        <p className="rounded-md border border-primary/40 px-2 py-2"><span className="block text-muted-foreground">token hit</span><strong className="font-mono">{(hit * HIT_REQ).toLocaleString("en-US")} / {(len * REQUESTS).toLocaleString("en-US")} ≈ {pct(rate, rate === largeTok ? 1 : 2)}%</strong></p>
        <p className="rounded-md border px-2 py-2"><span className="block text-muted-foreground">request hit</span><strong className="font-mono">9 / 10 = 90%</strong></p>
      </div>
    </div>
  );
}

export default function PrefixReuseCountViz() {
  return (
    <PagedSceneShell
      eyebrow="공유 공간과 hit 비율"
      title="같은 재사용을 block 수, token 비율, 요청 비율로 세면 다른 숫자가 나옵니다"
      description="모두 14절의 가정 사례입니다. 파란색은 재사용한 부분, 주황색은 요청마다 따로 갖는 8-token tail block입니다. 어느 요청이 miss인지는 글에 없어 1번 줄에 두었습니다(가정)."
      note="막대는 요청마다 자기 길이를 같은 폭으로 그린 비율입니다. 35-token과 1,200-token 막대의 실제 길이는 다릅니다."
      ariaLabel="prefix 재사용의 block 수, token hit rate, request hit rate 비교"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) return <BlockGrid shared={false} />;
        if (active === 1) return <BlockGrid shared />;
        if (active === 2) return <HitBars len={SMALL.len} hit={SMALL.hit} rate={smallTok} />;
        return <HitBars len={LARGE.len} hit={LARGE.hit} rate={largeTok} />;
      }}
    />
  );
}
