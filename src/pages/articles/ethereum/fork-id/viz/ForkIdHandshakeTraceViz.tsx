import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["주소 발견", "식별자 계산", "요약 교환", "양방향 판정", "호환 피어 유지"] as const;

const NOTES = [
  "로컬 노드는 원격 주소를 찾았지만 같은 genesis와 fork 이력을 따르는지는 아직 모릅니다. 주소 발견은 피어 신뢰나 체인 호환성 판정이 아닙니다.",
  "로컬은 head 12라서 fork 5와 10을 모두 누산합니다. 원격은 head 9라서 fork 5까지만 누산하고 다음 fork 10을 함께 알립니다.",
  "두 노드는 각자의 FORK_HASH와 FORK_NEXT를 네트워크 프로토콜의 항목으로 전달합니다. EIP-2124는 ENR이나 eth handshake처럼 삽입할 위치를 하나로 제한하지 않습니다.",
  "로컬은 원격을 과거 접두 이력으로, 원격은 로컬을 자신이 아는 다음 fork를 적용한 미래 이력으로 재현합니다. 양쪽 모두 서로를 단순히 동기화 위치가 다른 피어로 설명합니다.",
  "호환성 검사는 통과하지만 블록과 거래를 믿는다는 뜻은 아닙니다. 이후 세션·프로토콜·헤더·실행 검증이 각각 남아 있습니다.",
] as const;

const LOCAL_STATUS = [
  "주소 후보를 확인하는 중",
  "head 12 · H₁₀ · next 0",
  "(H₁₀, 0) 전송",
  "원격 H₅는 로컬 과거 접두",
  "호환 가능 · 자료 검증은 별도",
] as const;

const REMOTE_STATUS = [
  "체인 이력은 아직 모름",
  "head 9 · H₅ · next 10",
  "(H₅, 10) 전송",
  "로컬 H₁₀은 알려진 fork 10 뒤 값",
  "호환 가능 · 동기화 계속",
] as const;

function nodeClass(active: number, side: "local" | "remote") {
  const highlighted = active >= 1 || (active === 0 && side === "local");
  return `min-w-0 border px-2 py-2 transition-colors sm:px-5 sm:py-4 ${
    highlighted ? "border-primary/55 bg-primary/[0.055]" : "border-border bg-background"
  }`;
}

export default function ForkIdHandshakeTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4400, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="한 피어 연결 추적"
      title="head 12와 head 9가 서로를 받아들이는 과정"
      description="서로 다른 Fork ID를 각자의 schedule로 설명할 수 있는지 양쪽에서 확인합니다."
      note="H₅와 H₁₀은 fork 5와 10까지 CRC32를 누산한 설명용 기호입니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-fork-id-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Fork ID를 이용한 피어 호환성 판정 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] items-stretch gap-1.5 sm:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] sm:gap-2">
          <div className={nodeClass(active, "local")}>
            <p className="text-[9px] font-black text-primary sm:text-[10px]">로컬 노드 A</p>
            <p className="mt-1 break-keep text-[10px] font-bold leading-4 sm:mt-2 sm:text-sm sm:leading-5">fork · 5 → 10</p>
            <p className="mt-1 min-h-10 break-keep font-mono text-[9px] leading-4 text-muted-foreground sm:mt-2 sm:min-h-12 sm:text-xs sm:leading-5">
              {LOCAL_STATUS[active]}
            </p>
          </div>

          <div className="flex min-h-0 items-center justify-center border-x border-border text-center">
            <span className={`text-[9px] font-bold transition-colors sm:text-[10px] ${active >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              {active < 2 ? "발견" : active === 2 ? "교환" : active === 3 ? "검증" : "유지"}
            </span>
          </div>

          <div className={nodeClass(active, "remote")}>
            <p className="text-[9px] font-black text-primary sm:text-[10px]">원격 노드 B</p>
            <p className="mt-1 break-keep text-[10px] font-bold leading-4 sm:mt-2 sm:text-sm sm:leading-5">fork · 5 → 10</p>
            <p className="mt-1 min-h-10 break-keep font-mono text-[9px] leading-4 text-muted-foreground sm:mt-2 sm:min-h-12 sm:text-xs sm:leading-5">
              {REMOTE_STATUS[active]}
            </p>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-4 sm:mt-4 sm:text-[11px] sm:leading-5">
          {[
            ["같은 genesis", active >= 1],
            ["알려진 일정으로 설명", active >= 3],
            ["자료 유효성", false],
          ].map(([label, done], index) => (
            <div key={String(label)} className={`min-w-0 bg-background px-1 py-2 ${done ? "text-foreground" : "text-muted-foreground"}`}>
              <strong className="block text-primary">{done ? "✓" : index === 2 && active === 4 ? "다음" : "·"}</strong>
              {label}
            </div>
          ))}
        </div>

        <div className="mt-2 border-l-2 border-primary/50 pl-3 sm:mt-4 sm:pl-4">
          <p className="text-[10px] font-black text-primary">
            {String(active + 1).padStart(2, "0")} · {SCENES[active]}
          </p>
          <p className="mt-1 min-h-24 break-keep text-xs leading-5 text-muted-foreground sm:min-h-16 sm:text-sm sm:leading-6">
            {NOTES[active]}
          </p>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["발견", "계산", "교환", "판정", "유지"]}
          playLabel="호환성 판정 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
