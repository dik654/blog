import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source 첫·둘째 문단 — 4MiB read가 지나는 Linux 층과 관측 지점.
 * 위에서 아래로 process → page cache(address_space) → filesystem(bio) → blk-mq(request·두 queue) → driver·장치.
 * 관측: 위 strace(syscall·fsync 시간), 아래 iostat -x(await·queue·utilization). shared filesystem이면 client·NIC·server를 사이에 넣는다.
 */
const LAYERS = [
  { name: "학습 process", detail: "pread64(fd, buffer, 4MiB, offset)" },
  { name: "page cache · address_space", detail: "cached page·page 수·writeback 위치·error" },
  { name: "filesystem", detail: "file offset → data 위치, bio 생성" },
  { name: "blk-mq", detail: "bio → request, CPU 쪽 queue → hardware queue" },
  { name: "driver · local NVMe", detail: "data를 돌려주면 완료가 위로 올라감" },
] as const;

/** shared filesystem일 때 3~5층 자리에 들어가는 원격 경로(본문: client protocol·NIC·server). */
const REMOTE = [
  { name: "shared filesystem client", detail: "file offset을 원격 요청으로 바꾸는 client protocol" },
  { name: "NIC · network", detail: "요청과 data가 network를 오감" },
  { name: "storage server", detail: "server 쪽 queue와 장치가 응답" },
] as const;

const SCENES = [
  {
    label: "Cache hit",
    summary: "2층에서 반환",
    depth: 2,
    watch: false,
    remote: false,
    note: "같은 내용이 page cache에 있으면 요청은 장치까지 내려가지 않고 돌아옵니다. 그래서 pread64가 빨리 끝났다는 사실만으로 NVMe가 빨랐다고 말할 수 없습니다.",
  },
  {
    label: "Cache miss",
    summary: "bio → request → queue → driver",
    depth: 5,
    watch: false,
    remote: false,
    note: "Miss면 filesystem이 offset을 data 위치로 바꾸고 bio(장치·동작·data 위치·완료 상태를 든 block 요청)를 만듭니다. blk-mq가 이를 request로 묶어 두 queue를 거쳐 driver에 넘깁니다.",
  },
  {
    label: "위·아래 동시 관측",
    summary: "strace ↔ iostat -x",
    depth: 5,
    watch: true,
    remote: false,
    note: "strace로 4MiB 요청과 fsync 시간을, 같은 시각의 iostat -x로 await·queue·utilization을 봅니다. 같은 창에서 함께 늘어나는지 맞춰야 처음 기다린 곳이 보입니다.",
  },
  {
    label: "Shared filesystem",
    summary: "+ client protocol·NIC·server",
    depth: 5,
    watch: true,
    remote: true,
    note: "Shared filesystem이면 아래쪽이 client protocol·NIC·server로 바뀌므로 그 지표를 사이에 넣습니다. 목표는 ‘어느 요청이 어느 queue에서 기다렸다’고 말하는 것입니다.",
  },
] as const;

export default function ReadPathLayersViz() {
  return (
    <SceneShell
      eyebrow="한 요청의 kernel 경로"
      title="4MiB read는 page cache에서 끝나거나 장치 queue까지 내려갑니다"
      description="칸 하나가 Linux의 한 층이고 위에서 아래로 요청이 내려갑니다. 파란 칸이 이번 요청이 지나간 층, 오른쪽이 그 층을 보는 도구입니다."
      ariaLabel="4MiB read가 process, page cache, filesystem, blk-mq, driver를 지나는 경로와 관측 도구"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_9.5rem]">
            <ol className="min-w-0 space-y-1.5">
              {LAYERS.map((layer, index) => {
                const reached = index < scene.depth;
                const turn = index === scene.depth - 1;
                const remote = scene.remote && index >= 2 ? (REMOTE as readonly { name: string; detail: string }[])[index - 2] : null;
                return (
                  <li
                    key={layer.name}
                    className={`min-w-0 rounded-lg border px-3 py-1.5 transition-opacity duration-300 motion-reduce:transition-none ${
                      reached ? "border-[#2563eb] bg-background opacity-100" : "border-border/50 opacity-40"
                    }`}
                  >
                    <div className="flex min-w-0 items-baseline justify-between gap-2">
                      <p className="min-w-0 break-words text-sm font-semibold">{remote ? remote.name : layer.name}</p>
                      <span className="shrink-0 font-mono text-[11px] text-[#2563eb] dark:text-[#93c5fd]">{turn ? "↩ 반환" : reached ? "↓" : ""}</span>
                    </div>
                    <p className="mt-0.5 break-words text-xs leading-5 text-muted-foreground">
                      {remote ? remote.detail : layer.detail}
                    </p>
                  </li>
                );
              })}
            </ol>
            <div className={`grid min-w-0 grid-cols-2 gap-2 transition-opacity duration-300 motion-reduce:transition-none sm:grid-cols-1 sm:content-between ${scene.watch ? "opacity-100" : "opacity-35"}`}>
              <div className="rounded-lg border border-dashed border-[#d97706] px-3 py-2">
                <p className="font-mono text-xs font-bold text-[#b45309] dark:text-[#fbbf24]">strace</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">1층 · syscall과 fsync 시간</p>
              </div>
              <div className="rounded-lg border border-dashed border-[#d97706] px-3 py-2">
                <p className="font-mono text-xs font-bold text-[#b45309] dark:text-[#fbbf24]">iostat -x</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">장치 · await·queue·utilization</p>
              </div>
              <div className={`col-span-2 rounded-lg border border-dashed px-3 py-2 sm:col-span-1 ${scene.remote ? "border-[#d97706]" : "border-border/50 opacity-40"}`}>
                <p className="font-mono text-xs font-bold text-[#b45309] dark:text-[#fbbf24]">client·NIC·server</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">shared일 때 사이에 넣는 지표</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
