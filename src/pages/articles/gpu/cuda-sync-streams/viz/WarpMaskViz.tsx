import SceneShell from "./SceneShell";

/**
 * 본문 대응: #warp-sync — 32개 lane, register 직접 교환과 메모리 전달, mask=0x3의 bit.
 * 칸 하나 = lane 하나. mask의 bit 0·1이 lane 0·1을 가리키므로 2⁰ + 2¹ = 3 = 0x3입니다.
 */
type Flow = readonly (readonly [string, "plain" | "good" | "bad" | "sync"])[];

const SCENES: readonly { label: string; summary: string; note: string; on: readonly number[]; off?: readonly number[]; bits?: string; flow: Flow }[] = [
  { label: "warp 하나", summary: "lane 0–31", on: [], flow: [["thread 32개 = warp 1개", "plain"], ["칸의 위치 = lane", "plain"]], note: "NVIDIA는 thread 32개를 warp로 묶고 각 위치를 lane이라고 부릅니다." },
  { label: "register로 바로", summary: "lane 0의 7 → lane 1", on: [0, 1], flow: [["lane 0 register 7", "plain"], ["__shfl_sync", "sync"], ["lane 1 register 7", "good"]], note: "register는 thread가 계산에 바로 쓰는 작은 저장 칸입니다. 메모리를 거치지 않고 그 값을 직접 가져옵니다. _sync를 메모리 쓰기를 공개하는 barrier로 읽으면 안 됩니다." },
  { label: "조건을 bit로", summary: "lane마다 bit 하나", on: [0, 1], bits: "0000 … 0011", flow: [["각 lane의 참·거짓", "plain"], ["__ballot_sync", "sync"], ["bit 집합", "good"]], note: "각 lane의 참·거짓을 bit 집합으로 모읍니다. lane 0과 1만 참이면 아래 두 bit만 1입니다." },
  { label: "mask 0x3", summary: "2⁰ + 2¹ = 3 = 0x3", on: [0, 1], bits: "0000 … 0011", flow: [["bit 0 → lane 0", "good"], ["bit 1 → lane 1", "good"], ["호출자 자신의 bit 포함", "plain"]], note: "bit마다 참여 lane을 가리키고 호출자 자신의 bit가 포함되어야 합니다. lane 0과 1이면 0x3입니다." },
  { label: "메모리로 넘기기", summary: "쓰기 → __syncwarp(0x3) → 읽기", on: [0, 1], flow: [["lane 0: 공유 메모리에 7", "plain"], ["두 lane이 0x3으로 동기화", "sync"], ["lane 1: 7 읽기", "good"]], note: "공유 메모리를 거칠 때는 __syncwarp(mask)가 참여 lane의 도착과 memory ordering을 제공합니다. shuffle과 다른 경로입니다." },
  { label: "상대가 빠지면", summary: "짝 없는 호출", on: [0], off: [1], flow: [["lane 0만 0x3으로 호출", "plain"], ["lane 1: 호출 없음", "bad"], ["빠진 값을 정상값으로 못 씀", "bad"]], note: "mask의 lane 중 종료하지 않은 lane은 같은 mask로 대응 호출을 해야 합니다. Shuffle도 값을 내주는 lane이 참여해야 합니다." },
];

const FLOW_TONE = {
  plain: "border-border text-foreground",
  good: "border-primary bg-primary/15 text-foreground",
  bad: "border-dashed border-red-600 text-red-700 dark:text-red-400",
  sync: "border-amber-600 text-amber-700 dark:text-amber-400",
} as const;

const LANES = Array.from({ length: 32 }, (_, id) => id);

export default function WarpMaskViz() {
  return (
    <SceneShell
      eyebrow="32칸 세기"
      title="lane 0과 1만 통신할 때 값과 mask는 어디로 갈까요"
      description="칸 하나가 lane 하나이고 숫자는 lane 번호입니다. 진한 칸이 이 장면의 참여 lane, 점선 칸은 빠진 lane입니다."
      ariaLabel="warp 32개 lane에서 shuffle, ballot, mask 0x3, syncwarp로 값을 넘기는 경로"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-8 gap-1 sm:grid-cols-16">
              {LANES.map((id) => {
                const on = scene.on.includes(id);
                const off = scene.off?.includes(id);
                return (
                  <span
                    key={id}
                    className={`rounded-sm border py-0.5 text-center font-mono text-xs ${on ? "border-primary bg-primary font-bold text-primary-foreground" : off ? "border-dashed border-red-600 font-bold text-red-700 dark:text-red-400" : "border-border/70 text-muted-foreground"}`}
                  >
                    {id}
                  </span>
                );
              })}
            </div>
            <p className="mt-2 min-h-5 font-mono text-sm font-bold">{scene.bits ? `bit 31 → 0 : ${scene.bits}` : ""}</p>
            <ol className="mt-1 grid grid-cols-3 gap-1">
              {scene.flow.map(([text, tone]) => (
                <li key={text} className={`flex items-center justify-center rounded border px-1 py-1 text-center text-xs leading-4 ${FLOW_TONE[tone]}`}>{text}</li>
              ))}
            </ol>
          </div>
        );
      }}
    />
  );
}
