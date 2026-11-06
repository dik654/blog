import SceneShell from "./SceneShell";

/**
 * 본문 대응: #verifier-filtering — 문제 하나의 후보 100칸이 verifier·중복 제거·threshold로 줄어듭니다.
 * 100은 RFT 수치, 통과 40·중복 제거 후 25는 가정, 25 × 20% = 5는 글의 상위 20% 예시를 적용한 계산입니다.
 * GSM8K 35.9% → 49.3%는 +13.4%p입니다.
 */
const TOTAL = 100;
const PASSED = 40;
const UNIQUE = 25;
const TOP = Math.round(UNIQUE * 0.2);

/** 37은 100과 서로소라 칸마다 값이 달라, 통과 칸이 고르게 흩어집니다. */
const passOrder = Array.from({ length: TOTAL }, (_, cell) => cell)
  .filter((cell) => (cell * 37) % TOTAL < PASSED);
const rankOf = new Map(passOrder.map((cell, rank) => [cell, rank]));

const SCENES = [
  { label: "문제 하나에 후보 100개", summary: "k = 100, 온도 0.7", note: "RFT(rejection sampling fine-tuning)는 문제 하나당 추론 경로(reasoning path) 100개를 온도 0.7로 만듭니다. 온도는 답변의 무작위성을 정하는 값입니다." },
  { label: "verifier가 틀린 경로를 지웁니다", summary: "100 → 40 (가정)", note: "정답과 어긋나거나 계산이 틀린 경로를 제거합니다. 40은 그림을 위한 가정이며, 지워진 칸은 점선으로 남겼습니다." },
  { label: "같은 풀이는 하나만", summary: "40 → 25 (가정)", note: "같은 방정식 리스트를 쓰는 경로는 하나만 남깁니다. = 표시가 중복으로 빠지는 칸입니다. 25도 가정입니다." },
  { label: "모아서 다시 학습한 결과", summary: "35.9% → 49.3%", note: "문제들에서 거른 약 10만 개 샘플로 다시 학습한 LLaMA-7B의 정확도입니다. GSM8K는 수학 문제 벤치마크입니다. 13.4%p 차이입니다." },
  { label: "기준선을 조이면", summary: `25 × 20% = ${TOP}개`, note: "quality thresholding은 상위 몇 퍼센트만 남길지 정하는 기준선입니다. 테두리만 남은 칸이 빠지고, 남는 양은 줄어도 평균 품질은 올라갑니다. RFT 수치와는 별개의 예시입니다." },
] as const;

function Cell({ cell, scene }: { cell: number; scene: number }) {
  const rank = rankOf.get(cell);
  if (scene === 0) return <span className="aspect-square rounded-[3px] border border-[#64748b] bg-[#64748b]/40" />;
  if (rank === undefined) return <span className="aspect-square rounded-[3px] border border-dashed border-border/70" />;
  if (scene === 1) return <span className="aspect-square rounded-[3px] border border-[#2563eb] bg-[#2563eb]/70" />;
  if (rank >= UNIQUE) return <span className="flex aspect-square items-center justify-center rounded-[3px] border border-border text-[9px] leading-none text-muted-foreground">=</span>;
  if (scene === 4 && rank % 5 !== 0) return <span className="aspect-square rounded-[3px] border border-[#2563eb]/50" />;
  return <span className="aspect-square rounded-[3px] border border-[#2563eb] bg-[#2563eb]/70" />;
}

function CountRow({ label, value, on }: { label: string; value: string; on: boolean }) {
  return (
    <div className={`flex flex-wrap items-baseline justify-between gap-x-3 border-b border-border/60 py-0.5 text-xs leading-4 sm:py-1 sm:text-sm ${on ? "" : "text-muted-foreground/40"}`}>
      <span>{label}</span>
      <span className="font-mono font-semibold">{on ? value : "−"}</span>
    </div>
  );
}

function AccuracyBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[3rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-3.5 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm bg-[#16a34a]" style={{ width: `${value}%` }} />
      </div>
      <span className="text-right font-mono">{value}%</span>
    </div>
  );
}

export default function RftFunnelViz() {
  return (
    <SceneShell
      eyebrow="Best-of-N 필터링"
      title="문제 하나의 후보 100칸이 거름을 지나며 몇 칸으로 줄어드는가"
      description="칸 하나가 후보 하나입니다. 점선 칸은 verifier 탈락, = 칸은 중복 제거, 채운 칸이 남은 후보입니다."
      ariaLabel="후보 100개가 verifier, 중복 제거, 기준선을 지나며 줄어드는 과정"
      scenes={SCENES}
      render={(index) => (
        <div className="grid min-w-0 grid-cols-[8.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-x-6">
          <div className="grid w-full grid-cols-10 content-start gap-[2px] sm:gap-[3px]" aria-hidden="true">
            {Array.from({ length: TOTAL }, (_, cell) => <Cell key={cell} cell={cell} scene={index} />)}
          </div>
          <div className="min-w-0">
            <CountRow label="생성" value={String(TOTAL)} on />
            <CountRow label="verifier 통과" value={`${PASSED} (가정)`} on={index >= 1} />
            <CountRow label="중복 제거 후" value={`${UNIQUE} (가정)`} on={index >= 2} />
            <CountRow label="상위 20% 기준선" value={`${TOP} (가정)`} on={index === 4} />
          </div>
          <div className={`col-span-2 space-y-1 ${index === 3 ? "" : "invisible"}`}>
            <AccuracyBar label="이전" value={35.9} />
            <AccuracyBar label="이후" value={49.3} />
          </div>
        </div>
      )}
    />
  );
}
