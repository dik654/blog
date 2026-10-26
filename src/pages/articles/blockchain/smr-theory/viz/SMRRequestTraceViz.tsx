import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "요청 접수",
  "로그 제안",
  "과반 저장",
  "순서대로 적용",
  "응답 유실",
  "재시도 판별",
] as const;

const NOTES = [
  "클라이언트가 요청 식별자 r-17과 출금 3을 보냅니다. 아직 어느 로그 위치에도 결정되지 않았으므로 복제본 상태는 모두 10입니다.",
  "리더가 r-17을 로그 42번 후보로 기록하고 다른 복제본에 보냅니다. 로컬 append는 아직 commit이나 고객 성공이 아닙니다.",
  "A와 B가 같은 term·index·command를 durable log에 기록해 과반이 됩니다. 리더는 42번까지 commit됐음을 알 수 있습니다.",
  "각 복제본은 commit된 prefix만 앞에서부터 적용합니다. r-17의 결과 7도 요청 식별자와 함께 저장합니다.",
  "로그와 결과는 commit됐지만 성공 응답이 클라이언트에 도착하지 않았습니다. 응답 유실은 명령 실패와 같은 뜻이 아닙니다.",
  "클라이언트가 r-17을 다시 보내면 복제본은 저장된 결과 7을 돌려줍니다. 출금 명령을 다시 적용하지 않습니다.",
] as const;

const CLIENT = [
  "r-17 전송",
  "응답 대기",
  "응답 대기",
  "응답 대기",
  "결과 모름",
  "7 확인",
] as const;

const REPLICAS = [
  ["상태 10 · 빈 슬롯", "상태 10 · 빈 슬롯", "상태 10 · 빈 슬롯"],
  ["42:r-17 · 제안", "42 · 수신 중", "42 · 수신 중"],
  ["42:r-17 · commit", "42:r-17 · 저장", "42 · 지연"],
  ["상태 7 · 적용", "상태 7 · 적용", "42:r-17 · 따라잡기"],
  ["결과 7 · 보존", "결과 7 · 보존", "상태 7 · 적용"],
  ["r-17 → 결과 7", "재실행 없음", "재실행 없음"],
] as const;

const LOG_STATE = [
  "아직 결정된 로그가 없습니다.",
  "index 42는 후보입니다.",
  "index 42가 commit됐습니다.",
  "commit 42 · applied 42",
  "commit은 응답 유실 뒤에도 남습니다.",
  "같은 request ID는 기존 결과를 찾습니다.",
] as const;

function replicaClass(active: number, index: number) {
  const highlighted =
    (active === 1 && index === 0) ||
    (active === 2 && index < 2) ||
    (active === 3 && index < 2) ||
    (active >= 4 && index <= 2);

  return `min-w-0 border px-2 py-2 transition-colors sm:px-4 sm:py-3 ${
    highlighted
      ? "border-primary/60 bg-primary/[0.06] text-foreground"
      : "border-border bg-background text-muted-foreground"
  }`;
}

export default function SMRRequestTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="한 요청 추적 · r-17"
      title="출금 3이 로그에 한 번만 들어가고, 응답 유실 뒤에도 다시 실행되지 않는 과정"
      description="잔액 10을 가진 세 복제본에서 요청 하나를 끝까지 따라갑니다. 저장·커밋·적용·응답은 서로 다른 사건입니다."
      note="잔액, 로그 42번과 복제본 수는 동작을 설명하기 위한 예시입니다. 그림의 과반 규칙은 crash-fault 고정 membership을 가정합니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-smr-scene={active}
        tabIndex={0}
        role="group"
        aria-label="상태 머신 복제 요청 r-17의 로그와 상태 변화"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-[5.6rem_minmax(0,1fr)] gap-2 md:grid-cols-[minmax(0,0.55fr)_minmax(0,1.7fr)] md:gap-3">
          <div className="border border-border bg-background p-2 sm:p-4">
            <p className="text-[9px] font-black text-primary sm:text-[10px]">클라이언트</p>
            <p className="mt-2 font-mono text-[10px] font-bold sm:mt-3 sm:text-xs">r-17</p>
            <p className="mt-1 break-keep text-xs font-bold sm:text-sm">출금 3</p>
            <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:text-xs sm:leading-5">
              {CLIENT[active]}
            </p>
          </div>

          <div className="min-w-0 border border-border bg-background p-2 sm:p-4">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2" aria-label="복제본별 로그와 상태">
              {(["A · 리더", "B · 복제본", "C · 복제본"] as const).map((label, index) => (
                <div key={label} className={replicaClass(active, index)}>
                  <p className="text-[9px] font-black text-primary sm:text-[10px]">{label}</p>
                  <p className="mt-1 break-keep text-[10px] font-bold leading-4 sm:mt-2 sm:text-sm sm:leading-5">
                    {REPLICAS[active][index]}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-2 border-y border-border px-1 py-2 sm:mt-3 sm:px-2 sm:py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[9px] font-black text-primary sm:text-[10px]">결정된 로그 경계</span>
                <span className="font-mono text-[9px] text-muted-foreground sm:text-[11px]">
                  {active < 2 ? "commitIndex=41" : "commitIndex=42"}
                </span>
              </div>
              <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
                {LOG_STATE[active]}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-4 gap-px bg-border p-px text-center text-[9px] leading-4 sm:mt-4 sm:text-[11px] sm:leading-5">
          {[
            ["append", active >= 1],
            ["commit", active >= 2],
            ["apply", active >= 3],
            ["reply", active >= 5],
          ].map(([label, done]) => (
            <div key={String(label)} className={`min-w-0 bg-background px-1 py-2 ${done ? "text-foreground" : "text-muted-foreground"}`}>
              <strong className="block text-primary">{done ? "✓" : "·"}</strong>
              {label}
            </div>
          ))}
        </div>

        <div className="mt-2 border-l-2 border-primary/50 pl-3 sm:mt-4 sm:pl-4">
          <p className="text-[10px] font-black text-primary">
            {String(active + 1).padStart(2, "0")} · {SCENES[active]}
          </p>
          <p className="mt-1 min-h-20 break-keep text-xs leading-5 text-muted-foreground sm:min-h-12 sm:text-sm sm:leading-6">
            {NOTES[active]}
          </p>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["접수", "제안", "과반", "적용", "유실", "재시도"]}
          playLabel="요청 흐름 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
