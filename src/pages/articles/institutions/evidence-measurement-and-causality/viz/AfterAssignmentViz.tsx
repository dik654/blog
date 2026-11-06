import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison·#limits — 무작위 배정은 한 시점의 절차다. 배정 뒤의 탈락·누락과
 * 사후 선택은 배정이 막지 못하며(ICH E8(R1) §5.5), 미리 적은 계획으로 드러낸다.
 */
const SCENES = [
  { label: "배정이 맡는 일", summary: "그 시점의 나누기", note: "무작위 절차는 개인의 선택과 담당자의 선호가 A와 B를 정하지 않게 합니다. 표에서 이 일을 맡는 줄은 하나입니다." },
  { label: "배정해도 남는 우연", summary: "작은 집단은 우연히 다름", note: "무작위로 나눠도 10가구씩의 작은 집단은 우연히 다를 수 있습니다. 앞의 그림에서 다시 뽑을 때 개수가 달라진 것과 같은 이야기입니다." },
  { label: "배정 뒤의 일", summary: "탈락 · 측정 누락", note: "배정 뒤에 빠지는 집과 측정이 빠진 값은 배정 시점의 절차가 다루지 못합니다. 그래서 누가 빠졌는지를 기록합니다." },
  { label: "결과를 본 뒤", summary: "골라서 다시 내면 근거가 바뀜", note: "잘 나온 가구만 골라 평균을 다시 내면 처음의 비교 근거가 달라집니다. 어떤 결과를 분석할지 미리 적어 둔 계획이 이 행동을 드러냅니다." },
] as const;

type Tone = "idle" | "good" | "warn";

const ROWS: readonly { name: string; states: readonly (readonly [Tone, string])[] }[] = [
  { name: "20가구 모임", states: [["idle", "이미 끝남"], ["idle", "이미 끝남"], ["idle", "이미 끝남"], ["idle", "이미 끝남"]] },
  { name: "분석 계획", states: [["idle", "미리 정함"], ["idle", "미리 정함"], ["good", "빠진 집을 기록할 틀"], ["good", "무엇을 분석할지 고정"]] },
  { name: "무작위 배정", states: [["good", "선호가 배정을 안 정함"], ["warn", "우연한 차이는 남음"], ["idle", "이미 끝남"], ["idle", "이미 끝남"]] },
  { name: "탈락·누락", states: [["idle", "아직 안 생김"], ["idle", "아직 안 생김"], ["warn", "배정이 막지 못함"], ["warn", "배정이 막지 못함"]] },
  { name: "결과 분석", states: [["idle", "아직 안 함"], ["idle", "아직 안 함"], ["idle", "아직 안 함"], ["warn", "잘 나온 가구만 고르면?"]] },
];

const TONE: Record<Tone, string> = {
  idle: "text-muted-foreground",
  good: "font-bold text-primary",
  warn: "font-bold text-amber-700 dark:text-amber-400",
};

export default function AfterAssignmentViz() {
  return (
    <SceneShell
      eyebrow="배정 앞뒤의 순서"
      title="무작위 배정은 긴 시간표의 한 줄입니다"
      description="위에서 아래로 시간이 흐르고 오른쪽 글은 그 줄의 상태입니다. 20가구를 10가구씩 나누는 본문의 가정 사례입니다."
      ariaLabel="실험 순서에서 무작위 배정이 맡는 지점과 그 뒤에 생기는 문제를 보는 과정"
      scenes={SCENES}
      render={(active) => (
        <ol className="relative mx-auto max-w-[520px] space-y-2">
          <span aria-hidden="true" className="absolute bottom-5 left-[5px] top-5 border-l border-border" />
          {ROWS.map((row) => {
            const tone = row.states[active][0];
            return (
              <li key={row.name} className="relative grid grid-cols-[12px_minmax(0,1fr)] items-start gap-3">
                <span aria-hidden="true" className={`mt-1.5 block h-3 w-3 rounded-full border ${tone === "idle" ? "border-border bg-background" : tone === "good" ? "border-primary bg-primary" : "border-amber-600 bg-background"}`} />
                <div className="grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)] gap-2 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-3">
                  <p className="text-sm font-semibold leading-6">{row.name}</p>
                  <StableSceneStack
                    active={active}
                    scenes={row.states.map(([stateTone, text], index) => (
                      <p key={index} className={`text-sm leading-6 ${TONE[stateTone]}`}>{text}</p>
                    ))}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      )}
    />
  );
}
