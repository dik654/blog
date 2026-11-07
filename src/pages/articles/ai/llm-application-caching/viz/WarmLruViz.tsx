import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #warming-eviction — 용량 4칸(가정)의 cache. 왼쪽이 최근 조회, 오른쪽이 가장 오래 안 쓰인 항목.
 * 시작 비어 있음 → warming 질문1~4 → 질문1 조회 → 새 요청 저장으로 질문2 밀려남.
 */
type Slot = { name: string; warm: boolean } | null;

const SCENES = [
  { label: "배포 직후", summary: "빈 칸 4 · 요청은 miss", note: "캐시가 비어 있으면 처음 몇 분간 모든 요청이 miss가 됩니다.", slots: [null, null, null, null], evicted: null },
  { label: "Warming", summary: "질문1~4를 미리 실행", note: "트래픽이 몰리기 전에 자주 묻는 질문을 먼저 실행해 넣어 둡니다. 채운 순서는 설명용입니다(가정). 마지막에 넣은 질문4가 왼쪽입니다.", slots: [{ name: "질문4", warm: true }, { name: "질문3", warm: true }, { name: "질문2", warm: true }, { name: "질문1", warm: true }], evicted: null },
  { label: "질문1 조회", summary: "hit · 맨 왼쪽으로", note: "질문1이 hit하면 가장 최근에 쓰인 항목이 되어 맨 왼쪽으로 옮겨 갑니다. 이제 맨 오른쪽 질문2가 가장 오래 조회되지 않은 항목입니다.", slots: [{ name: "질문1", warm: true }, { name: "질문4", warm: true }, { name: "질문3", warm: true }, { name: "질문2", warm: true }], evicted: null },
  { label: "새 요청 저장", summary: "miss · 질문2가 밀려남", note: "새 요청이 miss여서 결과를 넣으려는데 칸이 가득 찼습니다. LRU는 가장 오래 조회되지 않은 질문2를 지웁니다. Warming으로 채운 항목도 예외가 아닙니다.", slots: [{ name: "새 요청", warm: false }, { name: "질문1", warm: true }, { name: "질문4", warm: true }, { name: "질문3", warm: true }], evicted: "질문2" },
] as const satisfies readonly { label: string; summary: string; note: string; slots: readonly Slot[]; evicted: string | null }[];

function SlotPanel({ slots, evicted }: { slots: readonly Slot[]; evicted: string | null }) {
  return (
    <div className="min-w-0">
      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
        <span>최근 조회</span>
        <span>가장 오래 안 쓰임</span>
      </div>
      <div className="mt-1.5 grid grid-cols-4 gap-1.5">
        {slots.map((slot, index) => (
          <div
            key={index}
            className={`flex h-16 flex-col items-center justify-center rounded-lg border text-center ${
              slot ? (slot.warm ? "border-primary/60 bg-primary/10" : "border-border bg-background") : "border-dashed border-border/60"
            }`}
          >
            <span className="text-xs font-bold leading-5 sm:text-sm">{slot ? slot.name : "빈 칸"}</span>
            <span className="text-[11px] leading-4 text-muted-foreground">{slot ? (slot.warm ? "warming" : "요청") : ""}</span>
          </div>
        ))}
      </div>
      <p className={`mt-3 text-right text-sm font-bold ${evicted ? "text-red-700 dark:text-red-400" : "text-transparent"}`}>{`지움: ${evicted ?? "없음"}`}</p>
    </div>
  );
}

export default function WarmLruViz() {
  return (
    <SceneShell
      eyebrow="채우기와 비우기"
      title="Warming이 채운 칸도 오래 안 쓰이면 LRU가 밀어냅니다"
      description="용량을 4칸으로 줄인 설명용 cache입니다(가정). 칸의 왼쪽일수록 최근에 쓰였고, 칸이 가득 차면 맨 오른쪽부터 지웁니다."
      ariaLabel="cache warming으로 채운 뒤 LRU가 항목을 지우는 순서"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={SCENES.map((scene) => <SlotPanel key={scene.label} slots={scene.slots} evicted={scene.evicted} />)} />}
    />
  );
}
