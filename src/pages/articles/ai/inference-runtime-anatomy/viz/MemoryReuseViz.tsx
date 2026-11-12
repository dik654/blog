import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #memory-plan — memory reuse 문단.
 * 장면 1: layer 1 의 출력 주소를 layer 3 이 다시 씀.
 * 장면 2: caching allocator 는 free 된 block 을 driver 에 돌려주지 않음(allocated ≠ reserved).
 * 장면 3·4: 작은 shape 를 먼저 돌리면 큰 shape 가 들어갈 block 이 없어 새로 잡고,
 * 큰 shape 를 먼저 돌리면 작은 shape 가 그 block 을 쪼개 씀. 칸 수(3·5)는 설명용 가정.
 */
const SCENES = [
  {
    label: "주소를 돌려 씁니다",
    summary: "layer 3 → layer 1 의 자리",
    note: "layer 2 는 layer 1 의 출력을 읽어 자기 출력을 다른 주소에 씁니다. layer 2 가 끝나면 layer 1 의 출력은 더 필요 없으므로 layer 3 이 그 주소를 다시 씁니다. 이 그림에서는 layer 가 늘어도 새 주소 없이 두 주소만 번갈아 쓰므로 peak 가 작게 유지됩니다.",
  },
  {
    label: "free 해도 쥐고 있습니다",
    summary: "allocated 0 · reserved 5칸",
    note: "PyTorch 의 caching allocator 는 tensor 가 free 되어도 그 block 을 cudaFree 로 driver 에 돌려주지 않고 보관합니다. 그래서 tensor 가 실제 쓰는 memory_allocated 는 줄어도 allocator 가 쥔 memory_reserved 는 그대로이고, 다음 요청은 synchronization 없이 그 block 을 받습니다.",
  },
  {
    label: "작은 shape 를 먼저 돌리면",
    summary: "reserved 3 + 5 = 8칸",
    note: "3칸짜리 block 을 먼저 잡았다가 free 하면 5칸이 필요한 다음 shape 는 그 안에 들어가지 못합니다. allocator 는 5칸을 새로 잡고, 3칸 block 은 쓰이지 않은 채 남습니다. 한 번에 5칸만 쓰는데 8칸을 쥐게 됩니다.",
  },
  {
    label: "큰 shape 를 먼저 돌리면",
    summary: "reserved 5칸 그대로",
    note: "5칸 block 이 먼저 잡혀 있으면 뒤의 3칸 shape 는 그 block 을 쪼개 앞부분을 쓰고 나머지 2칸은 보관됩니다. 새로 잡는 block 이 없어 reserved 가 5칸에 머뭅니다. vLLM 이 warmup 에서 큰 shape 를 먼저 돌리는 까닭이 이것입니다.",
  },
] as const;

const LABELS = SCENES.map((scene) => scene.label);
const NOTES = SCENES.map((scene) => scene.note);

const W = 360;
const H = 168;
const X0 = 112;
const CELL = 28;
const ROW_H = 26;
const ROWS = [22, 70, 118] as const;

const USED = "#2563eb";
const NEW = "#d97706";
const MUTED = "#64748b";
const LINE = "#94a3b8";

type Block = { start: number; size: number; used: number; tone: "used" | "new"; label: string };

function RowLabel({ y, top, bottom }: { y: number; top: string; bottom: string }) {
  return (
    <g>
      <text x={8} y={y + 10} fontSize={13} fontWeight={700} fill="currentColor">
        {top}
      </text>
      <text x={8} y={y + 25} fontSize={12} fill={MUTED}>
        {bottom}
      </text>
    </g>
  );
}

function Blocks({ y, blocks }: { y: number; blocks: readonly Block[] }) {
  return (
    <g>
      {blocks.map((block) => {
        const color = block.tone === "new" ? NEW : USED;
        const x = X0 + block.start * CELL;
        return (
          <g key={`${block.start}-${block.label}`}>
            <rect
              x={x}
              y={y}
              width={block.size * CELL}
              height={ROW_H}
              rx={3}
              fill="none"
              stroke={block.used === 0 ? MUTED : color}
              strokeWidth={1}
              strokeDasharray={block.used === 0 ? "3 2" : undefined}
            />
            {block.used > 0 && (
              <rect x={x} y={y} width={block.used * CELL} height={ROW_H} rx={3} fill={color} fillOpacity={0.28} />
            )}
            {block.used > 0 && block.used < block.size && (
              <line x1={x + block.used * CELL} x2={x + block.used * CELL} y1={y} y2={y + ROW_H} stroke={color} strokeWidth={1} />
            )}
            {block.used > 0 && block.used < block.size ? (
              block.label.split(" · ").map((part, i) => {
                const cx = i === 0 ? x + (block.used * CELL) / 2 : x + block.used * CELL + ((block.size - block.used) * CELL) / 2;
                return (
                  <text key={part} x={cx} y={y + 17} textAnchor="middle" fontSize={12} fill="currentColor">
                    {part}
                  </text>
                );
              })
            ) : (
              <text x={x + (block.size * CELL) / 2} y={y + 17} textAnchor="middle" fontSize={12} fill="currentColor">
                {block.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

function Scale() {
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={X0 + i * CELL} x2={X0 + i * CELL} y1={158} y2={163} stroke={LINE} strokeWidth={1} />
      ))}
      <line x1={X0} x2={X0 + 8 * CELL} y1={160} y2={160} stroke={LINE} strokeWidth={1} />
      <text x={X0 - 6} y={164} textAnchor="end" fontSize={12} fill={MUTED}>
        칸(가정)
      </text>
    </g>
  );
}

function ReuseScene() {
  const colA = 120;
  const colB = 236;
  const cw = 110;
  const rows = [
    { top: "layer 1 실행", a: "L1 출력 쓰기", b: "비어 있음", aOn: true, bOn: false, aNew: false },
    { top: "layer 2 실행", a: "L1 출력 읽기", b: "L2 출력 쓰기", aOn: true, bOn: true, aNew: false },
    { top: "layer 3 실행", a: "L3 출력 덮어쓰기", b: "L2 출력 읽기", aOn: true, bOn: true, aNew: true },
  ] as const;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="layer 3 이 layer 1 의 출력 주소를 다시 쓰는 순서">
      <text x={colA + cw / 2} y={12} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">
        주소 A
      </text>
      <text x={colB + cw / 2} y={12} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">
        주소 B
      </text>
      {rows.map((row, i) => {
        const y = ROWS[i];
        return (
          <g key={row.top}>
            <RowLabel y={y} top={row.top} bottom={`시간 ${i + 1}`} />
            <rect x={colA} y={y} width={cw} height={ROW_H} rx={3} fill={USED} fillOpacity={row.aOn ? 0.25 : 0} stroke={USED} strokeWidth={row.aNew ? 2 : 1} />
            <text x={colA + cw / 2} y={y + 17} textAnchor="middle" fontSize={12} fill="currentColor">
              {row.a}
            </text>
            <rect x={colB} y={y} width={cw} height={ROW_H} rx={3} fill={USED} fillOpacity={row.bOn ? 0.25 : 0} stroke={row.bOn ? USED : MUTED} strokeWidth={1} strokeDasharray={row.bOn ? undefined : "3 2"} />
            <text x={colB + cw / 2} y={y + 17} textAnchor="middle" fontSize={12} fill={row.bOn ? "currentColor" : MUTED}>
              {row.b}
            </text>
          </g>
        );
      })}
      <text x={colA} y={162} fontSize={12} fill={MUTED}>
        새 주소 없이 두 칸만 번갈아 씁니다
      </text>
    </svg>
  );
}

function CacheScene() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="free 뒤에도 allocator 가 block 을 쥐고 있어 allocated 와 reserved 가 갈라짐">
      <RowLabel y={ROWS[0]} top="실행 중" bottom="allocated 5" />
      <Blocks y={ROWS[0]} blocks={[{ start: 0, size: 5, used: 5, tone: "used", label: "reserved 5 · 사용 중" }]} />
      <RowLabel y={ROWS[1]} top="free 뒤" bottom="allocated 0" />
      <Blocks y={ROWS[1]} blocks={[{ start: 0, size: 5, used: 0, tone: "used", label: "reserved 5 · 보관" }]} />
      <RowLabel y={ROWS[2]} top="다음 요청" bottom="allocated 5" />
      <Blocks y={ROWS[2]} blocks={[{ start: 0, size: 5, used: 5, tone: "used", label: "cudaMalloc 없이 재사용" }]} />
      <Scale />
    </svg>
  );
}

function OrderScene({ largeFirst }: { largeFirst: boolean }) {
  const first: Block = largeFirst
    ? { start: 0, size: 5, used: 5, tone: "used", label: "큰 shape 5" }
    : { start: 0, size: 3, used: 3, tone: "used", label: "작은 shape 3" };
  const second: readonly Block[] = largeFirst
    ? [{ start: 0, size: 5, used: 3, tone: "used", label: "3 사용 · 2 보관" }]
    : [
        { start: 0, size: 3, used: 0, tone: "used", label: "3 · 너무 작음" },
        { start: 3, size: 5, used: 5, tone: "new", label: "새로 잡은 5" },
      ];
  const reserved = largeFirst ? 5 : 8;
  const usedStart = largeFirst ? 0 : 3;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto h-auto w-full max-w-[560px]"
      role="img"
      aria-label={largeFirst ? "큰 shape 를 먼저 돌리면 작은 shape 가 같은 block 안에 들어감" : "작은 shape 를 먼저 돌리면 큰 shape 용 block 을 새로 잡아 reserved 가 커짐"}
    >
      <RowLabel y={ROWS[0]} top="1. 첫 shape" bottom={largeFirst ? "5칸 block 잡기" : "3칸 block 잡기"} />
      <Blocks y={ROWS[0]} blocks={[first]} />
      <RowLabel y={ROWS[1]} top="2. 다음 shape" bottom={largeFirst ? "3칸 필요" : "5칸 필요"} />
      <Blocks y={ROWS[1]} blocks={second} />
      <RowLabel y={ROWS[2]} top="결과" bottom={`reserved ${reserved}칸`} />
      {/* 결과 칸의 색은 위 행과 같은 뜻을 유지합니다. 작은 shape 를 먼저 돌리면 앞 3칸은 남는 옛 block(회색), 뒤 5칸만 새로 잡은 block(주황)입니다. */}
      {largeFirst ? (
        <rect x={X0} y={ROWS[2]} width={5 * CELL} height={ROW_H} rx={3} fill={USED} fillOpacity={0.18} stroke={USED} strokeWidth={1} />
      ) : (
        <g>
          <rect x={X0} y={ROWS[2]} width={3 * CELL} height={ROW_H} rx={3} fill={MUTED} fillOpacity={0.14} stroke={MUTED} strokeWidth={1} />
          <rect x={X0 + 3 * CELL} y={ROWS[2]} width={5 * CELL} height={ROW_H} rx={3} fill={NEW} fillOpacity={0.18} stroke={NEW} strokeWidth={1} />
        </g>
      )}
      {/* 실제로 쓰이는 5칸 위치에 점선을 둡니다. 작은 shape 를 먼저 돌리면 앞 3칸은 놀고 뒤의 새 5칸만 씁니다. */}
      <rect x={X0 + usedStart * CELL} y={ROWS[2]} width={5 * CELL} height={ROW_H} rx={3} fill="none" stroke="currentColor" strokeWidth={1} strokeDasharray="3 2" />
      <text x={X0 + usedStart * CELL + 6} y={ROWS[2] + 17} fontSize={12} fill="currentColor">
        한 번에 쓰는 최대 5칸
      </text>
      <Scale />
    </svg>
  );
}

function Picture({ index }: { index: number }) {
  if (index === 0) return <ReuseScene />;
  if (index === 1) return <CacheScene />;
  return <OrderScene largeFirst={index === 3} />;
}

export default function MemoryReuseViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);

  return (
    <VizFrame
      eyebrow="Memory reuse"
      title="같은 주소를 다시 쓰고, 큰 block 을 먼저 잡습니다"
      description="Caching allocator 는 free 된 block 을 driver 에 돌려주지 않고 보관했다가 다음 tensor 에 다시 내주는 PyTorch 의 GPU memory 관리자입니다. 칸 하나는 설명을 위한 단위이며 실제 byte 가 아닙니다(가정)."
      note="block 을 쪼개고 고르는 세부 규칙은 allocator 구현에 따라 다르며, 이 그림은 본문이 말한 방향만 보여 줍니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="activation 주소 재사용과 caching allocator 의 block 보관, shape 순서에 따른 reserved 크기"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene, index) => (
            <Picture key={scene.label} index={index} />
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={LABELS} />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
