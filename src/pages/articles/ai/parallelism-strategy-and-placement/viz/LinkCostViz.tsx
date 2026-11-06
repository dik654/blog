import SceneShell from "./SceneShell";

/**
 * 본문 대응: #placement 후보 A·B·C의 통신 숫자가 나오는 계산.
 * 64 × 8192 × 2 byte = 1,048,576 byte ≈ 1 MB.
 * 전송 시간 = α + 계수 × 1 MB / B. all-reduce 계수는 2(TP−1)/TP (절차 절의 T_comm 식).
 * NVSwitch TP 8: 5 + 1.75 × 1.11 ≈ 7 μs, InfiniBand 1회: 15 + 20 = 35 μs, InfiniBand TP 16: 15 + 1.875 × 20 = 52.5 μs.
 * token 당 160회(80 layer × 2): 7 → 1.1 ms, 52.5 → 8.4 ms.
 */
const MB = 1e6;
const BYTE_NV = MB / 900e9 * 1e6;
const BYTE_IB = MB / 50e9 * 1e6;

const ROWS = [
  { name: "NVSwitch all-reduce (TP 8)", alpha: 5, bytes: 1.75 * BYTE_NV, shown: "약 7 μs" },
  { name: "InfiniBand 1회 전송", alpha: 15, bytes: BYTE_IB, shown: "35 μs" },
  { name: "InfiniBand all-reduce (TP 16)", alpha: 15, bytes: 1.875 * BYTE_IB, shown: "약 52 μs" },
] as const;

const MAX_US = 60;

const SCENES = [
  { label: "1 MB는 어디서 나오나", summary: "64 × 8192 × 2 byte ≈ 1 MB", note: "decode batch 64, hidden 8192, FP16은 값 하나에 2 byte입니다. layer를 지나는 tensor 하나가 약 1 MB입니다.", visible: 0 },
  { label: "node 안에서 한 번", summary: "5 + 1.75 × 1.1 ≈ 7 μs", note: "시간은 α(크기와 무관한 고정 latency)와 byte 항의 합입니다. all-reduce는 byte를 2(TP−1)/TP배 옮기므로 TP 8이면 1.75배입니다.", visible: 1 },
  { label: "node 경계를 한 번", summary: "15 + 1 × 20 = 35 μs", note: "같은 1 MB가 InfiniBand에서는 20 μs가 걸립니다. stage 사이 activation을 한 번 보내는 후보 B(TP 8 × PP 2)의 값입니다.", visible: 2 },
  { label: "ring이 node를 건너면", summary: "15 + 1.875 × 20 = 52.5 μs", note: "ring은 rank들이 고리처럼 이어 값을 돌리는 all-reduce 경로입니다. TP 16의 ring은 node 경계를 두 번 지나므로 InfiniBand로 셉니다. 글은 이를 약 52 μs로 적습니다.", visible: 3 },
  { label: "token 하나로 곱하면", summary: "× 160 = 1.1 ms vs 8.4 ms", note: "layer 80개마다 all-reduce가 두 번이라 token당 160번입니다. 한 번의 차이가 8.4 ms와 1.1 ms로 벌어집니다. α·B는 계산 예시이며 실제 값은 nccl-tests로 잽니다.", visible: 3 },
] as const;

export default function LinkCostViz() {
  return (
    <SceneShell
      eyebrow="통신 한 번의 값"
      title="같은 1 MB가 link와 횟수에 따라 7 μs도 되고 8.4 ms도 됩니다"
      description="진한 부분은 α(고정 latency), 옅은 부분은 byte 항입니다. NVSwitch 900 GB/s·α 5 μs, InfiniBand 50 GB/s·α 15 μs를 쓴 글의 계산 예시입니다."
      ariaLabel="1 MB 통신의 시간을 고정 latency와 byte 항으로 나눈 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        if (index === 0) {
          return (
            <div className="space-y-2 py-4 text-center text-xs sm:text-sm">
              <div className="flex items-center justify-center gap-1.5">
                {["batch 64", "hidden 8192", "2 byte"].map((part, position) => (
                  <span key={part} className="flex items-center gap-1.5">
                    {position > 0 && <span aria-hidden="true" className="text-primary">×</span>}
                    <span className="rounded-lg border border-border bg-background px-2 py-1.5 font-semibold">{part}</span>
                  </span>
                ))}
              </div>
              <p className="font-mono font-semibold">= 1,048,576 byte ≈ 1 MB</p>
            </div>
          );
        }
        return (
          <div className="min-w-0 space-y-2">
            {ROWS.map((row, position) => {
              const on = position < scene.visible;
              return (
                <div key={row.name} className={on ? "" : "invisible"}>
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span>{row.name}</span>
                    <span className="font-mono font-semibold">{row.shown}</span>
                  </div>
                  <div className="mt-0.5 flex h-4 min-w-0 rounded-sm bg-muted/40">
                    <div className="h-full bg-[#2563eb]" style={{ width: `${(row.alpha / MAX_US) * 100}%` }} />
                    <div className="h-full bg-[#2563eb]/35" style={{ width: `${(row.bytes / MAX_US) * 100}%` }} />
                  </div>
                </div>
              );
            })}
            <div className={`grid grid-cols-2 gap-2 pt-1 text-center text-xs ${index === 4 ? "" : "invisible"}`}>
              <span className="rounded-md border border-border px-2 py-1">NVSwitch 7 μs × 160<strong className="block font-mono text-sm">1.1 ms</strong></span>
              <span className="rounded-md border border-[#dc2626] px-2 py-1 text-[#dc2626]">InfiniBand 52.5 μs × 160<strong className="block font-mono text-sm">8.4 ms</strong></span>
            </div>
          </div>
        );
      }}
    />
  );
}
