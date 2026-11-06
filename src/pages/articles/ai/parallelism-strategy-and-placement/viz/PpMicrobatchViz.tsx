import SceneShell from "./SceneShell";

/**
 * 본문 대응: #placement 후보 B — 한 token이 두 stage를 직렬로 지나므로 요청 a의 token 간격은 그대로 10.4 ms.
 * microbatch 둘을 겹치면 stage가 쉬지 않아 한 묶음의 token이 5.2 ms마다 나옵니다(처음 채우는 한 칸 제외).
 * 칸 하나 = stage 하나의 weight 읽기 5.2 ms. 통신 1.1 ms와 경계 35 μs는 생략합니다.
 */
const SLOTS = 6;
const ONE = { s0: ["a", "", "a", "", "a", ""], s1: ["", "a", "", "a", "", "a"] };
const TWO = { s0: ["a", "b", "a", "b", "a", "b"], s1: ["", "a", "b", "a", "b", "a"] };

const SCENES = [
  { label: "요청 묶음이 하나일 때", summary: "10.4 ms마다 a의 token", note: "microbatch는 함께 처리하는 요청 묶음입니다. 묶음 a가 stage 0을 지나는 동안 stage 1은 놀고, 그다음은 반대입니다. token 하나에 5.2 ms가 두 번 들고, 통신까지 더하면 글의 TPOT 약 11.6 ms입니다.", lanes: ONE, dim: false },
  { label: "묶음 둘을 겹치면", summary: "5.2 ms마다 한 묶음의 token", note: "a가 stage 1로 넘어간 자리에 b가 들어옵니다. 맨 앞 빈칸을 채운 뒤에는 두 stage가 쉬지 않아 나오는 token이 두 배입니다.", lanes: TWO, dim: false },
  { label: "그래도 a는 빨라지지 않습니다", summary: "a의 간격 10.4 ms 그대로", note: "a만 보면 token 간격이 첫 장면과 같습니다. throughput만 늘고 한 요청의 latency는 줄지 않으며, microbatch가 찰 때만 이득입니다.", lanes: TWO, dim: true },
] as const;

function Lane({ name, cells, dim }: { name: string; cells: readonly string[]; dim: boolean }) {
  return (
    <div className="grid grid-cols-[3.75rem_repeat(6,minmax(0,1fr))] items-center gap-1">
      <span className="text-xs font-semibold">{name}</span>
      {cells.map((cell, slot) => {
        const tone = cell === "a" ? "border-[#2563eb] bg-[#2563eb]/15 text-[#2563eb]" : cell === "b" ? `border-[#d97706] bg-[#d97706]/15 text-[#b45309] ${dim ? "opacity-25" : ""}` : "border-dashed border-border text-muted-foreground/60";
        return <span key={slot} className={`flex h-9 items-center justify-center rounded border font-mono text-sm font-bold ${tone}`}>{cell || "쉼"}</span>;
      })}
    </div>
  );
}

export default function PpMicrobatchViz() {
  return (
    <SceneShell
      eyebrow="후보 B의 시간표"
      title="PP 2는 왜 token을 두 배로 내면서 한 요청을 빠르게 하지 못하나"
      description="TP 8 × PP 2인 후보 B입니다. 가로 칸 하나가 stage 하나의 weight 읽기 5.2 ms입니다. a·b는 요청 묶음이며, 통신 시간은 빼고 그렸습니다."
      ariaLabel="두 stage 위에 microbatch 하나 또는 둘이 흐르는 시간표"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-1.5">
            <Lane name="stage 0" cells={scene.lanes.s0} dim={scene.dim} />
            <Lane name="stage 1" cells={scene.lanes.s1} dim={scene.dim} />
            <div className="grid grid-cols-[3.75rem_repeat(6,minmax(0,1fr))] items-center gap-1 pt-1">
              <span className="text-xs text-muted-foreground">token</span>
              {Array.from({ length: SLOTS }, (_, slot) => {
                const done = scene.lanes.s1[slot];
                const shown = done && !(scene.dim && done === "b");
                return <span key={slot} className="text-center font-mono text-xs font-semibold">{shown ? `${done} ↓` : ""}</span>;
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
