import SceneShell from "./SceneShell";

/**
 * 본문 대응: #spill-path — 2²⁰ threads × 1,000회 × 4 B × 2방향 = 8,388,608,000 B는 논리 byte다.
 * L1, L2, DRAM에서 각각 얼마가 처리되는지는 본문이 정하지 않았으므로 크기를 그리지 않는다.
 * 추가 가정(전부 DRAM, 유효 3 TB/s)에서만 ÷ 계산 2.7962 ms가 나온다.
 */
const ONE_WAY = 2 ** 20 * 1000 * 4;
const TOTAL = ONE_WAY * 2;
const MS = (TOTAL / 3e12) * 1000;

const SCENES = [
  { label: "실행한 읽기·쓰기의 합", summary: "8,388,608,000 B", note: `저장 ${ONE_WAY.toLocaleString("en-US")} B와 읽기 같은 양을 더한 값입니다(가정). 실행한 local 읽기·쓰기를 byte로 더했을 뿐이라 논리 byte라 부릅니다. local은 thread별 주소 범위를 가리키며, 실제 저장 공간은 device memory에 있습니다.` },
  { label: "L1에서 처리되면", summary: "DRAM까지 안 내려감", note: "L1에서 처리한 접근도 명령과 내부 대역폭을 씁니다. 그래도 그 byte는 DRAM으로 내려가지 않습니다. 얼마가 여기서 처리되는지는 이 계산만으로 알 수 없습니다." },
  { label: "L2에서 처리되면", summary: "L1 miss도 DRAM 전에 멈출 수 있음", note: "L1 miss가 L2에서 처리될 수도 있습니다. 그래서 논리 byte만 보고 DRAM 전송량을 정할 수 없습니다." },
  { label: "DRAM까지 내려온 양", summary: "실제 전송량 = 따로 확인", note: "실제 전송량은 메모리 계층별로 따로 확인합니다. 칸의 크기를 양에 맞추지 않은 이유도 그 값이 아직 없기 때문입니다." },
  { label: "전부 DRAM이라고 추가 가정하면", summary: `÷ 3 TB/s ≈ ${MS.toFixed(4)} ms`, note: "양방향 8.388608 GB가 모두 DRAM을 통과하고 유효 3 TB/s를 얻는다고 추가 가정한 계산입니다. 다른 계산과 겹치거나 전송량·대역폭이 달라질 수 있어 kernel에 그 시간만큼 더해진다는 보장은 없습니다." },
] as const;

const LEVELS = [
  { name: "L1", exit: "여기서 처리 · 양은 미지정" },
  { name: "L2", exit: "L1 miss를 처리 · 양은 미지정" },
  { name: "DRAM", exit: "실제 전송량 · 따로 확인" },
] as const;

export default function SpillHierarchyViz() {
  return (
    <SceneShell
      eyebrow="논리 byte와 실제 전송"
      title="계산한 8.388608 GB는 위에서 들어온 양이지 DRAM을 지난 양이 아닙니다"
      description="위에서 아래로 메모리 계층을 따라 내려갑니다. L1·L2는 DRAM 앞의 캐시 계층입니다. 칸 크기는 양과 무관하며, 각 계층이 처리하는 비율은 그리지 않았습니다."
      note="4-byte 값을 thread마다 반복당 한 번씩 저장·읽는다는 본문의 가정에서 나온 숫자입니다."
      ariaLabel="논리 byte가 L1, L2, DRAM으로 내려가는 경로"
      scenes={SCENES}
      render={(active) => {
        const allDram = active === 4;
        return (
          <div className="space-y-1.5 text-sm">
            <div className={`border px-3 py-2 ${active === 0 ? "border-primary bg-primary/15" : "border-border bg-background"}`}>
              <p className="font-semibold">local 읽기·쓰기 (논리 byte)</p>
              <p className="font-mono text-xs">8,388,608,000 B = 8.388608 GB = 7.8125 GiB</p>
            </div>
            {LEVELS.map((level, index) => {
              const lit = !allDram && active === index + 1;
              const dramLit = allDram && index === 2;
              const reached = allDram || active > index;
              const passOnly = allDram && index < 2;
              return (
                <div key={level.name}>
                  <p aria-hidden className={`pl-3 text-xs leading-5 ${reached ? "text-foreground" : "text-muted-foreground/40"}`}>↓{index === 1 ? " L1 miss" : ""}</p>
                  <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
                    <div className={`flex h-11 items-center justify-center border font-semibold ${lit || dramLit ? "border-primary bg-primary/15" : "border-border bg-background"} ${reached ? "" : "opacity-50"}`}>{level.name}</div>
                    <div className={`flex h-11 items-center border-l-2 pl-2 text-xs leading-4 ${lit || dramLit ? "border-primary font-semibold" : "border-border text-muted-foreground"} ${reached ? "" : "opacity-50"}`}>
                      {passOnly ? "처리 없이 통과(추가 가정)" : dramLit ? "8.388608 GB 전부(추가 가정)" : level.exit}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
