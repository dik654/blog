import type { ReactNode } from "react";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #names — SM 안의 block, block 안의 warp, warp 안의 thread, thread가 붙잡는 register.
 * 숫자는 이 글의 CC 7.0 사례: 65,536칸, 최대 64 warps, 128-thread block = 4 warps, 37 registers/thread.
 */
const WARP_SEATS = 64;
const BLOCK_WARPS = 128 / 32;
const WARP_THREADS = 32;
const THREAD_REGISTERS = 37;

function Tier({ name, detail, children }: { name: string; detail: string; children: ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-center sm:gap-6">
      <div>
        <p className="text-sm font-bold">{name}</p>
        <p className="text-xs leading-5 text-muted-foreground">{detail}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Zoom() {
  return <p aria-hidden className="text-xs text-muted-foreground">▼ 표시한 부분을 펼칩니다</p>;
}

export default function ExecutionNestingViz() {
  return (
    <VizFrame
      eyebrow="이름의 포함 관계"
      title="SM을 펼치면 block, warp, thread, register 순서로 들어갑니다"
      description="위에서 아래로 한 단계씩 확대합니다. 숫자는 이 글의 compute capability 7.0 사례입니다."
      note="색칠한 칸의 위치는 설명용입니다(가정). 실제 칸 번호를 뜻하지 않습니다."
    >
      <div className="space-y-3">
        <Tier name="SM · 처리 구역" detail="전체 register 칸(register file) 65,536개. 네모 하나는 칸이 아니라 warp 자리이고, 최대 64 warps 중 표시한 4자리가 block 하나입니다">
          <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-[3px]" aria-label="warp 자리 64개 중 block 하나가 4자리 차지">
            {Array.from({ length: WARP_SEATS }, (_, seat) => (
              <span key={seat} className={`h-3 border ${seat < BLOCK_WARPS ? "border-primary bg-primary/40" : "border-border bg-background"}`} />
            ))}
          </div>
        </Tier>
        <Zoom />
        <Tier name="Block · 함께 배치할 일" detail="128-thread block은 4 warps이며 같은 SM에 놓입니다">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: BLOCK_WARPS }, (_, warp) => (
              <span key={warp} className={`border px-1 py-1 text-center text-xs ${warp === 0 ? "border-primary bg-primary/15 font-semibold" : "border-border bg-background text-muted-foreground"}`}>warp</span>
            ))}
          </div>
        </Tier>
        <Zoom />
        <Tier name="Warp · 32명 묶음" detail="thread 32개를 하나로 묶습니다">
          <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-[3px]" aria-label="warp 안의 thread 32개">
            {Array.from({ length: WARP_THREADS }, (_, thread) => (
              <span key={thread} className={`h-3 rounded-full border ${thread === 0 ? "border-primary bg-primary/40" : "border-border bg-background"}`} />
            ))}
          </div>
        </Tier>
        <Zoom />
        <Tier name="Thread · 최소 작업 단위" detail="이 사례는 값을 두는 32-bit 칸(register)을 37개 씁니다">
          <div className="grid grid-cols-[repeat(19,minmax(0,1fr))] gap-[3px]" aria-label="thread 하나의 register 37칸">
            {Array.from({ length: THREAD_REGISTERS }, (_, register) => (
              <span key={register} className="h-3 border border-primary/60 bg-primary/15" />
            ))}
          </div>
        </Tier>
      </div>
    </VizFrame>
  );
}
