import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "A가 먼저 처리",
  "B에 전달",
  "C 메시지 지연",
  "타임아웃",
  "보장 판정",
] as const;

const NOTES = [
  "A는 잔액 10에서 3을 빼 7을 봅니다. B와 C는 아직 요청을 받지 않아 10을 봅니다.",
  "A가 같은 식별자 w-17과 값 7을 보냅니다. B는 적용했고 C의 메시지는 아직 이동 중입니다.",
  "C는 여전히 10을 봅니다. 이것이 오류인지는 허용한 지연과 읽기 규칙을 알아야 판단할 수 있습니다.",
  "200ms가 지나도 A가 멈췄는지 메시지가 늦는지 알 수 없습니다. 타임아웃은 다음 경로를 고르는 신호입니다.",
  "안전성은 서로 다른 최종값을 막는 약속이고, 진행성은 통신 회복 뒤 C도 결국 7을 결정한다는 약속입니다.",
] as const;

const NODE_STATE = [
  { a: "7 · 처리", b: "10 · 미수신", c: "10 · 미수신" },
  { a: "7 · 전송", b: "7 · 적용", c: "10 · 이동 중" },
  { a: "7 · 전송됨", b: "7 · 적용", c: "10 · 지연" },
  { a: "7 · 응답 없음", b: "7 · 적용", c: "10 · 의심" },
  { a: "7 · 후보", b: "7 · 후보", c: "10 · 확정 금지" },
] as const;

function nodeClass(active: boolean) {
  return `min-w-0 border px-2 py-2 transition-colors sm:px-4 sm:py-3 ${
    active
      ? "border-primary/60 bg-primary/[0.06] text-foreground"
      : "border-border bg-background text-muted-foreground"
  }`;
}

export default function ExecutionTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600, { loop: false });
  const active = scenes.active;
  const state = NODE_STATE[active];

  return (
    <VizFrame
      eyebrow="한 요청 추적 · w-17"
      title="출금 한 건이 세 노드에서 서로 다른 현재 상태를 만드는 과정"
      description="같은 요청을 보냈는데도 메시지 도착 순서가 달라 A·B·C가 다른 값을 봅니다. 그림을 한 장면씩 넘기며 타임아웃이 무엇을 알 수 있고 무엇을 알 수 없는지 확인합니다."
      note="잔액과 200ms는 동작을 설명하기 위한 예시입니다. 특정 데이터베이스나 합의 프로토콜의 설정값이 아닙니다."
      canvasClassName="px-2 py-1.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        tabIndex={0}
        role="group"
        aria-label="출금 요청 w-17의 메시지 전달과 상태 변화"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-[5.25rem_minmax(0,1fr)] items-stretch gap-2 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.55fr)] md:gap-3">
          <div className="border border-border bg-background p-2 sm:p-4" aria-label="클라이언트 요청">
            <p className="text-[9px] font-black text-primary sm:text-[10px]">요청</p>
            <p className="mt-2 font-mono text-[10px] font-bold sm:mt-3 sm:text-xs">w-17</p>
            <p className="mt-1 text-xs font-bold sm:text-sm">출금 3</p>
            <p className="mt-2 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:text-xs sm:leading-5">
              잔액<br />10 → 7
            </p>
          </div>

          <div className="min-w-0 border border-border bg-background p-2 sm:p-4" aria-label="복제본 세 개의 현재 상태">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <div className={nodeClass(active === 0 || active === 1)}>
                <p className="text-[9px] font-black text-primary sm:text-[10px]">노드 A</p>
                <p className="mt-1 break-keep text-[11px] font-bold sm:mt-2 sm:text-sm">{state.a}</p>
                <p className="mt-1 hidden text-[11px] leading-5 sm:block">요청을 받은 노드</p>
              </div>
              <div className={nodeClass(active === 1)}>
                <p className="text-[9px] font-black text-primary sm:text-[10px]">노드 B</p>
                <p className="mt-1 break-keep text-[11px] font-bold sm:mt-2 sm:text-sm">{state.b}</p>
                <p className="mt-1 hidden text-[11px] leading-5 sm:block">먼저 받은 복제본</p>
              </div>
              <div className={nodeClass(active >= 2)}>
                <p className="text-[9px] font-black text-primary sm:text-[10px]">노드 C</p>
                <p className="mt-1 break-keep text-[11px] font-bold sm:mt-2 sm:text-sm">{state.c}</p>
                <p className="mt-1 hidden text-[11px] leading-5 sm:block">메시지가 늦은 복제본</p>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px text-[9px] leading-4 sm:mt-3 sm:text-[11px] sm:leading-5">
              <div className="min-w-0 bg-background p-1.5 sm:p-3">
                <strong className="block text-foreground">A → B · w-17</strong>
                <span>{active === 0 ? "아직 보내지 않음" : "전달 완료 · value=7"}</span>
              </div>
              <div className="min-w-0 bg-background p-1.5 sm:p-3">
                <strong className="block text-foreground">A → C · w-17</strong>
                <span>{active < 1 ? "아직 보내지 않음" : active < 4 ? "전송 중 · 도착 시각 모름" : "충돌 확정 방지"}</span>
              </div>
              <div className="min-w-0 bg-background p-1.5 sm:p-3">
                <strong className="block text-foreground">C의 관측</strong>
                <span>{active < 3 ? "A의 상태를 알 수 없음" : "느림과 중단을 구별 못 함"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2 border-y border-border py-2 sm:mt-4 sm:gap-3 sm:py-3" aria-label="현재 장면을 해석하는 세 질문">
          <p className={`text-[10px] leading-4 sm:text-xs sm:leading-5 ${active >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
            <strong className="block text-primary">시간 가정</strong>
            메시지는 언제까지 와야 하나요?
          </p>
          <p className={`text-[10px] leading-4 sm:text-xs sm:leading-5 ${active >= 3 ? "text-foreground" : "text-muted-foreground"}`}>
            <strong className="block text-primary">고장 가정</strong>
            A는 멈췄나요, 거짓말할 수도 있나요?
          </p>
          <p className={`text-[10px] leading-4 sm:text-xs sm:leading-5 ${active >= 4 ? "text-foreground" : "text-muted-foreground"}`}>
            <strong className="block text-primary">보장</strong>
            충돌 방지와 최종 진행을 각각 약속하나요?
          </p>
        </div>

        <div className="mt-2 border-l-2 border-primary/50 pl-3 sm:mt-4 sm:pl-4">
          <p className="text-[10px] font-black text-primary">
            {String(active + 1).padStart(2, "0")} · {SCENES[active]}
          </p>
          <p className="mt-1 min-h-16 break-keep text-xs leading-5 text-muted-foreground sm:min-h-12 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          playLabel="요청 흐름 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
