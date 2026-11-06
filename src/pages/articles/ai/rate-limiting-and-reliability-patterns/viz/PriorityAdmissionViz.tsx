import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #load-shedding-and-admission — llm-d InferenceObjective의 priority와 admission 코드.
 * 포화도 1.0 이상이면 priority < 0 거절, 0 이상은 검사를 건너뜀, 대기 중에는 높은 priority 먼저,
 * EnableEviction(기본 꺼짐)을 켜면 막힌 높은 priority를 위해 실행 중인 음수 priority를 끊는다.
 * priority 값 5·0·−1과 포화도 0.8은 가정이다.
 */
type Tone = "ok" | "bad" | "wait";
type Row = { check: string; result: string; tone: Tone };

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  saturation: number;
  gauge: string;
  checkHead: string;
  rows: readonly [Row, Row, Row];
}[] = [
  {
    label: "포화도 1.0 미만",
    summary: "이 검사에서는 아무도 거절되지 않음",
    note: "포화도는 요청을 받는 서버 묶음(pool)이 얼마나 찼는지를 나타내며 1.0이 기준입니다. 이 값 아래에서는 음수도 이 검사에 걸리지 않습니다.",
    saturation: 0.8,
    gauge: "포화도 0.8 (가정)",
    checkHead: "포화 검사",
    rows: [
      { check: "건너뜀", result: "거절 안 됨", tone: "ok" },
      { check: "건너뜀", result: "거절 안 됨", tone: "ok" },
      { check: "통과", result: "거절 안 됨", tone: "ok" },
    ],
  },
  {
    label: "포화도 1.0 이상",
    summary: "음수 priority만 바로 거절",
    note: "음수는 버려도 되는 요청으로 보아 바로 거절하고, 0 이상은 이 검사를 건너뜁니다.",
    saturation: 1,
    gauge: "포화도 1.0 이상",
    checkHead: "포화 검사",
    rows: [
      { check: "건너뜀", result: "거절 안 됨", tone: "ok" },
      { check: "건너뜀", result: "거절 안 됨", tone: "ok" },
      { check: "걸림", result: "바로 거절", tone: "bad" },
    ],
  },
  {
    label: "자원이 모자라 대기할 때",
    summary: "높은 priority가 항상 먼저",
    note: "값이 큰 priority부터 내보냅니다. 공정성은 같은 priority 안에서만 맞추므로 5가 기다리는 동안 0은 앞서지 못합니다.",
    saturation: 1,
    gauge: "포화도 1.0 이상",
    checkHead: "대기 줄",
    rows: [
      { check: "맨 앞", result: "먼저 나감", tone: "ok" },
      { check: "그 뒤", result: "5 다음에 나감", tone: "wait" },
      { check: "줄에 없음", result: "이미 거절됨", tone: "bad" },
    ],
  },
  {
    label: "EnableEviction을 켜면",
    summary: "음수를 끊어 자리 확보 · 기본은 꺼짐",
    note: "높은 priority가 포화로 막혔을 때 이미 실행 중인 음수 요청을 끊어 자리를 돌려받습니다. 끊기는 대상은 음수뿐입니다.",
    saturation: 1,
    gauge: "포화도 1.0 이상",
    checkHead: "지금 상태",
    rows: [
      { check: "포화로 막힘", result: "자리를 돌려받음", tone: "ok" },
      { check: "끊는 대상 아님", result: "그대로", tone: "wait" },
      { check: "실행 중", result: "끊김", tone: "bad" },
    ],
  },
];

const PRIORITIES = ["5", "0", "−1"];
const TONE: Record<Tone, string> = {
  ok: "border-green-600 text-green-700 dark:text-green-400",
  bad: "border-dashed border-red-600 font-bold text-red-700 dark:text-red-400",
  wait: "border-border text-muted-foreground",
};

export default function PriorityAdmissionViz() {
  return (
    <SceneShell
      eyebrow="Priority와 포화"
      title="같은 포화에서도 priority 부호에 따라 요청의 길이 갈립니다"
      description="llm-d는 요청마다 정수 priority를 붙이며 값이 클수록 중요합니다. 5, 0, −1은 부호별 예시(가정)이고, 동작은 2026-10-13 기준 코드입니다."
      ariaLabel="포화도와 priority에 따라 요청이 거절, 대기, 실행되는 경로"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label}>
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <div className="h-4 min-w-0 flex-1 rounded-sm bg-muted/40">
                  <div className="h-full rounded-sm" style={{ width: `${scene.saturation * 100}%`, backgroundColor: scene.saturation >= 1 ? "#dc2626" : "#64748b" }} />
                </div>
                <span className="w-32 shrink-0 text-right font-mono font-bold">{scene.gauge}</span>
              </div>
              <div className="mt-4 grid grid-cols-[4.25rem_minmax(0,1fr)_minmax(0,1fr)] items-stretch gap-2 text-xs sm:text-sm">
                <span className="font-bold text-muted-foreground">priority</span>
                <span className="font-bold text-muted-foreground">{scene.checkHead}</span>
                <span className="font-bold text-muted-foreground">결과</span>
                {scene.rows.map((row, index) => (
                  <div key={index} className="contents">
                    <span className="flex items-center justify-center rounded-lg border border-border bg-background py-1.5 font-mono font-bold">{PRIORITIES[index]}</span>
                    <span className="flex items-center rounded-lg border border-border px-2 py-1.5 leading-5">{row.check}</span>
                    <span className={`flex items-center rounded-lg border px-2 py-1.5 leading-5 ${TONE[row.tone]}`}>{row.result}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        />
      )}
    />
  );
}
