import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overlap AlgorithmBlock — S=3, T=5(가정)로 prologue와 loop 앞부분을 손으로 돌린 장부.
 * load(k, k%S), wait(full[k%S]), wait(empty[(k+S−1)%S]), load(k+S−1), compute(k), arrive(empty[k%S]).
 */
type SlotState = "empty" | "requested" | "computing";
interface Slot { tile: number | null; state: SlotState }

const e: Slot = { tile: null, state: "empty" };
const r = (tile: number): Slot => ({ tile, state: "requested" });
const c = (tile: number): Slot => ({ tile, state: "computing" });

const SLOTS: readonly (readonly Slot[])[] = [
  [r(0), r(1), e],
  [c(0), r(1), r(2)],
  [e, r(1), r(2)],
  [r(3), c(1), r(2)],
  [r(3), e, r(2)],
  [r(3), r(4), c(2)],
];
const DONE: readonly number[] = [0, 0, 1, 1, 2, 2];

const SCENES = [
  { label: "Prologue", summary: "load(0,0)  load(1,1)", note: "S개 칸 가운데 S−1개만 채웁니다. 칸 2를 비워 두어야 loop 첫 회에 다음 tile을 중복 없이 요청할 수 있습니다." },
  { label: "k = 0 · 요청하고 계산", summary: "load(2,2)  mma(0)", note: "wait(full[0])로 tile 0의 도착을, wait(empty[2])로 칸 2가 빈 것을 확인한 뒤 S−1개 뒤인 tile 2를 요청하고 tile 0을 계산합니다." },
  { label: "k = 0 · 칸 돌려주기", summary: "arrive(empty[0])", note: "다 읽은 칸 0을 load를 내는 쪽(producer)에게 돌려줍니다. 이 도착이 늦으면 다음 load가 멈춥니다." },
  { label: "k = 1 · 칸이 돌아옵니다", summary: "load(3,0)  mma(1)", note: "(1+2) % 3 = 0이므로 tile 3은 방금 비운 칸 0에 들어갑니다. 칸 번호가 k % S로 돌기 때문에 tile 번호는 늘어도 칸은 3개면 됩니다." },
  { label: "k = 1 · 칸 돌려주기", summary: "arrive(empty[1])", note: "칸 1이 비고 다음 회의 요청이 그 칸을 씁니다. 계산이 다음 tile로 넘어갈 때마다 빈 칸도 한 칸씩 옮겨 갑니다." },
  { label: "k = 2 · 같은 일의 반복", summary: "load(4,1)  mma(2)", note: "(2+2) % 3 = 1이므로 tile 4가 칸 1로 갑니다. T = 5이면 k + S − 1 < T가 여기까지 참이라 이후로는 새 요청 없이 남은 tile을 계산합니다. Store와 fragment 적재는 그리지 않았습니다." },
] as const;

const STATE_LABEL: Record<SlotState, string> = { empty: "빈 칸", requested: "요청함", computing: "계산 중" };
const STATE_CLASS: Record<SlotState, string> = {
  empty: "border-dashed border-border text-muted-foreground",
  requested: "border-amber-600 bg-amber-500/15",
  computing: "border-blue-600 bg-blue-600/15",
};

export default function StageRingViz() {
  return (
    <SceneShell
      eyebrow="Stage ring 손으로 돌리기"
      title="칸 3개를 돌려 쓰며 tile이 앞서 들어옵니다"
      description="아래 알고리즘을 칸 수 S = 3, tile 수 T = 5로 놓고(가정) 앞부분만 돌렸습니다. Stage는 tile 하나를 받는 shared memory 칸이고, barrier는 full(도착함)·empty(비었음)를 알리는 신호입니다. load(k, s)는 tile k를 칸 s로 옮기는 요청, mma(k)는 tile k의 계산입니다."
      ariaLabel="stage 3개짜리 ring에서 tile이 요청, 계산, 반환되는 순서"
      scenes={SCENES}
      render={(active) => {
        const slots = SLOTS[active];
        const statusOf = (tile: number) => {
          const slot = slots.find((item) => item.tile === tile);
          if (slot) return STATE_LABEL[slot.state];
          return tile < DONE[active] ? "완료" : "대기";
        };
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot, index) => (
                <div key={index} className={`rounded-lg border px-1 py-3 text-center text-xs leading-5 sm:text-sm ${STATE_CLASS[slot.state]}`}>
                  <span className="block text-muted-foreground">{`칸 ${index}`}</span>
                  <span className="block text-base font-bold">{slot.tile === null ? "−" : `tile ${slot.tile}`}</span>
                  <span className="block font-semibold">{STATE_LABEL[slot.state]}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs font-semibold text-muted-foreground">Tile 차례</p>
            <div className="mt-2 grid grid-cols-5 gap-1.5">
              {[0, 1, 2, 3, 4].map((tile) => {
                const status = statusOf(tile);
                return (
                  <div key={tile} className={`rounded-md border px-0.5 py-1.5 text-center text-[11px] leading-4 sm:text-xs ${status === "대기" ? "border-dashed border-border text-muted-foreground" : "border-border bg-background"}`}>
                    <span className="block font-bold">{tile}</span>
                    <span className="block">{status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
