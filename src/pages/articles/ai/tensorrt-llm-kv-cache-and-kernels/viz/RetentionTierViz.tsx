import { LayoutGroup, motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 재사용 block 다섯 개가 GPU에 남아 있을 때 새 빈칸이 필요하면 어느 block이 어디로 가는지 따라간다.
 * TensorRT-LLM: 낮은 우선순위 queue부터, 같은 queue 안은 오래된 것부터 꺼낸다.
 * 꺼낸 block이 offload 하한(C++ 기본 30) 이상이면 호스트로 내려 tree에 남기고, 낮으면 지운다.
 * 한 mechanism: 같은 "꺼냄"이 우선순위에 따라 호스트 이동과 삭제로 갈린다.
 */
type Place = "gpu" | "host" | "trash";
interface Block {
  id: string;
  name: string;
  priority: number;
  age: number;
}

const BLOCKS: readonly Block[] = [
  { id: "A", name: "system A", priority: 90, age: 1 },
  { id: "B", name: "대화 B", priority: 35, age: 2 },
  { id: "D", name: "생성 D", priority: 10, age: 3 },
  { id: "C", name: "대화 C", priority: 35, age: 4 },
  { id: "E", name: "생성 E", priority: 10, age: 5 },
];

interface Scene {
  label: string;
  places: Record<string, Place>;
  fresh: number;
  reload?: boolean;
  lru?: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "남아 있는 block 5개",
    places: { A: "gpu", B: "gpu", C: "gpu", D: "gpu", E: "gpu" },
    fresh: 0,
    note: "아무 요청에도 묶이지 않은 재사용 block 다섯 개가 GPU에 있습니다. 칸의 작은 숫자는 마지막 사용 순서로, 1이 가장 오래됐습니다. A는 가장 오래됐지만 우선순위 90입니다.",
  },
  {
    label: "빈칸 1 · D를 지움",
    places: { A: "gpu", B: "gpu", C: "gpu", D: "trash", E: "gpu" },
    fresh: 1,
    note: "가장 낮은 우선순위 10의 queue에서 더 오래된 D를 꺼냅니다. 10은 하한 30보다 낮아 호스트로 내리지 않고 지웁니다. 빈 자리는 새 block이 씁니다.",
  },
  {
    label: "빈칸 2 · E를 지움",
    places: { A: "gpu", B: "gpu", C: "gpu", D: "trash", E: "trash" },
    fresh: 2,
    note: "다음 빈칸도 우선순위 10의 E에서 나옵니다. 역시 하한보다 낮아 지워집니다. 이제 우선순위 10의 queue는 비었습니다.",
  },
  {
    label: "빈칸 3·4 · B·C를 호스트로",
    places: { A: "gpu", B: "host", C: "host", D: "trash", E: "trash" },
    fresh: 4,
    note: "두 칸이 더 필요하면 우선순위 35의 queue에서 오래된 B, 그다음 C를 꺼냅니다. 35는 하한 30 이상이라 호스트로 복사되고 tree에 남습니다. A는 여전히 GPU에 있습니다.",
  },
  {
    label: "B를 다시 찾음",
    places: { A: "gpu", B: "host", C: "host", D: "trash", E: "trash" },
    fresh: 4,
    reload: true,
    note: "다음 요청이 B의 앞부분을 찾으면 호스트에서 GPU로 다시 복사합니다. 9절처럼 block 하나가 80층을 한 덩어리로 담으므로 복사는 block마다 한 번입니다. 지워진 D·E는 다시 계산해야 합니다.",
  },
  {
    label: "비교 · vLLM 한 줄 LRU",
    places: { A: "trash", B: "trash", C: "gpu", D: "gpu", E: "gpu" },
    fresh: 2,
    lru: true,
    note: "우선순위 칸이 없는 free queue는 가장 오래된 A, 그다음 B부터 꺼냅니다. 같은 두 칸 요청에서 system prompt A가 먼저 사라집니다.",
  },
];

const priorityStyle = (p: number) =>
  p >= 90 ? "border-[#2563eb] bg-[#dbeafe] text-[#1e3a8a]" : p >= 30 ? "border-[#0d9488] bg-[#ccfbf1] text-[#134e4a]" : "border-[#d97706] bg-[#fef3c7] text-[#78350f]";

function Chip({ block, place, highlight }: { block: Block; place: Place; highlight?: boolean }) {
  return (
    <motion.div
      layoutId={`ret-${block.id}`}
      layout
      transition={{ duration: 0.6 }}
      className={`flex h-12 min-w-0 flex-col items-center justify-center rounded-sm border px-1 text-center font-mono text-[11px] font-bold ${
        place === "trash" ? "border-dashed border-[#dc2626] bg-transparent text-[#dc2626] line-through" : priorityStyle(block.priority)
      } ${highlight ? "outline outline-1 outline-offset-2 outline-[#2563eb]" : ""}`}
    >
      <span className="truncate">{block.name}</span>
      <span className="font-normal">
        우선 {block.priority} · {block.age}
      </span>
    </motion.div>
  );
}

export default function RetentionTierViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4400);
  const scene = SCENES[scenes.active];
  const at = (place: Place) => BLOCKS.filter((b) => scene.places[b.id] === place);
  const gpu = at("gpu");
  const freshSlots = 5 - gpu.length;

  return (
    <VizFrame
      eyebrow="Priority retention · host offload"
      title="꺼낸 block은 우선순위가 하한 이상이면 호스트로, 낮으면 휴지통으로 갑니다"
      description="위 줄은 GPU의 다섯 자리, 가운데 점선은 offload 하한 30, 아래는 호스트 메모리와 지운 block입니다."
      note="우선순위 90·10은 retention 설정으로 붙였다고 가정한 값이고 35는 기본값입니다. 하한 30은 고정 원문의 C++ 기본값이며 host_cache_size를 켠 경우입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="GPU와 호스트 사이의 재사용 block 이동"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <LayoutGroup id="retention-tier">
            <p className="mt-3 text-[11px] font-bold text-muted-foreground">GPU · 재사용 block 자리 5칸</p>
            <div className="mt-1 grid grid-cols-5 gap-1.5">
              {gpu.map((b) => (
                <Chip key={b.id} block={b} place="gpu" />
              ))}
              {Array.from({ length: freshSlots }, (_, i) => (
                <div
                  key={`fresh-${i}`}
                  className="flex h-12 items-center justify-center rounded-sm border border-[#475569] bg-[#475569] font-mono text-[11px] font-bold text-white"
                >
                  {scene.lru ? "새 요청" : "새 block"}
                </div>
              ))}
            </div>

            <div className="relative my-3 border-t border-dashed border-[#dc2626]">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-background px-2 font-mono text-[11px] font-bold text-[#dc2626]">
                {scene.lru ? "vLLM: 우선순위 없음" : "offload 하한 30"}
              </span>
            </div>

            <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-muted-foreground">
                  호스트 메모리 · tree에 남음
                  {scene.reload ? <span className="ml-1 text-[#2563eb]">· B ↑ GPU로 1회 복사</span> : null}
                </p>
                <div className="mt-1 grid min-h-[3.625rem] grid-cols-3 gap-1.5 rounded-sm border border-border p-1">
                  {at("host").map((b) => (
                    <Chip key={b.id} block={b} place="host" highlight={scene.reload && b.id === "B"} />
                  ))}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#dc2626]">지움 · 다시 계산</p>
                <div className="mt-1 grid min-h-[3.625rem] grid-cols-2 gap-1.5 rounded-sm border border-dashed border-[#dc2626]/60 p-1">
                  {at("trash").map((b) => (
                    <Chip key={b.id} block={b} place="trash" />
                  ))}
                </div>
              </div>
            </div>
          </LayoutGroup>

          <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">GPU에 남음</dt>
              <dd className="font-bold">{gpu.map((b) => b.id).join("·") || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">호스트로</dt>
              <dd className="font-bold">{at("host").length}개</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">지움</dt>
              <dd className="font-bold text-[#dc2626]">{at("trash").length}개</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[12rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[10.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
