import SceneShell from "./SceneShell";

/**
 * 본문 대응: #scope-population-sample 셋째 문단 — 재현한 모집단에서 목적별 표본을 고르고,
 * 표본 하나를 request→approval→enforcement→log→business outcome으로 잇고, 표본 20건 정상 ≠ 모집단 정상.
 * 모집단 200건은 아래 식의 "배포 200건" 예를 빌린 가정, 표본 20건은 본문 숫자.
 * 표본이 어느 칸에 있고 세 종류가 몇 건씩인지는 그림용 가정입니다. 200 − 20 = 180.
 */
type Kind = "random" | "risk" | "exception";

const TOTAL = 200;
const SAMPLE: Readonly<Partial<Record<number, Kind>>> = {
  3: "random", 17: "risk", 26: "random", 41: "random", 48: "exception", 59: "random", 66: "risk",
  83: "random", 95: "random", 102: "exception", 117: "random", 124: "risk", 138: "random",
  146: "random", 157: "exception", 163: "random", 171: "risk", 182: "random", 190: "random", 197: "risk",
};
const TRACED = 66;
const TRACED_KIND: Kind = "risk";
const SAMPLE_COUNT = Object.keys(SAMPLE).length;

const CHAIN = ["request", "approval", "enforcement", "log", "outcome"] as const;

const SCENES = [
  {
    label: "모집단 재현",
    summary: "배포 200건 (가정)",
    note: "Population(모집단)은 심사기간에 일어난 같은 종류의 모든 건입니다. 여기서는 아래 식의 예처럼 7월 배포 200건이라고 가정합니다. Query·export time·source digest·누락 조건이 남아 있어야 누가 다시 뽑아도 같은 200건이 나옵니다.",
  },
  {
    label: "목적별 표본",
    summary: "20건 = random + risk-based + exceptional",
    note: "표본은 무작위로 뽑은 건, 위험이 커서 일부러 고른 건, 예외 처리를 거친 건을 목적에 따라 섞습니다. 어느 칸이 뽑혔고 종류별로 몇 건인지는 그림을 위한 가정입니다.",
  },
  {
    label: "표본 하나를 끝까지",
    summary: "같은 ID로 다섯 고리 연결",
    note: "고른 표본 하나를 요청에서 업무 결과까지 따라갑니다. 다섯 증거가 같은 stable ID(바뀌지 않는 식별자)를 가리켜야 같은 사건의 사슬이라고 말할 수 있습니다. ID 값은 가정입니다.",
  },
  {
    label: "20건 정상이어도",
    summary: "180건은 직접 보지 않음",
    note: "표본 20건이 모두 정상이라고 해도 200 − 20 = 180건은 직접 확인하지 않았습니다. 그래서 모집단 전체가 정상이라고 단정하지 않고, 설계한 sampling risk(표본에서 내린 결론이 모집단 전체와 다를 위험)와 결함이 나왔을 때 넓혀 조사하는 절차를 함께 적습니다.",
  },
] as const;

const KIND_LABEL: Record<Kind, string> = { random: "무작위", risk: "위험 기반", exception: "예외 건" };
const KIND_MARK: Record<Kind, string> = { random: "R", risk: "H", exception: "E" };

export default function SampleTraceViz() {
  return (
    <SceneShell
      eyebrow="모집단 → 표본 → 추적"
      title="표본 20건은 200건 중 무엇을 보여 주고 무엇을 못 보여 주나"
      description="칸 하나가 7월 배포 한 건입니다(200건은 가정). R은 무작위, H는 위험 기반, E는 예외 건 표본이며, 어느 칸이 뽑혔는지는 그림용 가정입니다."
      ariaLabel="배포 200건 모집단에서 표본 20건을 고르고 한 건을 다섯 단계로 추적한 뒤 나머지 180건이 미확인으로 남는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="mx-auto grid max-w-lg grid-cols-[repeat(20,minmax(0,1fr))] gap-[2px]" aria-hidden>
            {Array.from({ length: TOTAL }, (_, index) => {
              const kind = SAMPLE[index];
              const picked = active >= 1 && kind !== undefined;
              const traced = active === 2 && index === TRACED;
              const unseen = active === 3 && kind === undefined;
              const base = picked
                ? traced
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-primary bg-primary/15 text-primary"
                : unseen
                  ? "border-dashed border-muted-foreground/40 bg-transparent"
                  : "border-border bg-muted/50";
              return (
                <div
                  key={index}
                  className={`flex aspect-square min-w-0 items-center justify-center rounded-[2px] border text-[8px] font-bold leading-none sm:text-[10px] ${base}`}
                >
                  {picked && kind ? KIND_MARK[kind] : ""}
                </div>
              );
            })}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] leading-4 sm:text-xs">
            <div className="rounded-md border border-border px-2 py-1.5">
              <p className="text-muted-foreground">모집단</p>
              <p className="font-mono font-bold">{TOTAL}건</p>
            </div>
            <div className={`rounded-md border px-2 py-1.5 ${active >= 1 ? "border-primary/60" : "border-border"}`}>
              <p className="text-muted-foreground">표본</p>
              <p className="font-mono font-bold">{active >= 1 ? `${SAMPLE_COUNT}건` : "−"}</p>
            </div>
            <div className={`rounded-md border px-2 py-1.5 ${active === 3 ? "border-dashed border-amber-600" : "border-border"}`}>
              <p className="text-muted-foreground">직접 안 본 건</p>
              <p className={`font-mono font-bold ${active === 3 ? "text-amber-700 dark:text-amber-400" : ""}`}>{active === 3 ? `${TOTAL - SAMPLE_COUNT}건` : "−"}</p>
            </div>
          </div>

          <div className="mt-3 min-h-[5.5rem] rounded-lg border border-border px-3 py-2">
            <p className="text-[11px] font-semibold text-muted-foreground sm:text-xs">
              {active === 2 ? `표본 하나 · ${KIND_LABEL[TRACED_KIND]} · ID DEP-0731-07 (가정)` : active === 1 ? "표본 종류: R 무작위 · H 위험 기반 · E 예외 건" : "증거 사슬"}
            </p>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {CHAIN.map((step) => (
                <div
                  key={step}
                  className={`min-w-0 rounded-md border px-1 py-1.5 text-center text-[10px] leading-4 sm:text-xs ${
                    active === 2 ? "border-primary bg-primary/[0.06] font-semibold" : "border-dashed border-border/60 text-muted-foreground/60"
                  }`}
                >
                  <span className="block break-all">{step}</span>
                  <span className="block font-mono text-[9px] sm:text-[10px]">{active === 2 ? "ID 일치" : "·"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    />
  );
}
