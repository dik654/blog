import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 사건은 workqueue에 key만 넣고, 꺼낸 뒤 캐시의 현재 상태를 다시 센다(level-triggered).
 * Pod 생성 요청 직후 캐시에는 새 Pod가 아직 없으므로 expectations로 다시 세지 않는다. 못 보면 5분 뒤 기대값을 버린다.
 * 마지막 장면의 "꺼진 사이 Pod 둘 삭제"는 지침의 이유(꺼졌다 돌아와도 같은 결과)를 보이려는 가정이다.
 * 네 칸(사건 · workqueue · 캐시 · expectations)과 판정 줄을 모든 장면이 같은 자리에 둔다.
 */
interface Step {
  event: string;
  queue: string;
  cached: number;
  expect: string;
  verdict: string;
  warn?: boolean;
}

const REPLICAS = 3;

const STEPS: readonly Step[] = [
  { event: "Pod 하나 삭제", queue: "web-5c6d", cached: 2, expect: "없음", verdict: "key만 들어감 · 아직 아무것도 세지 않음" },
  { event: "—", queue: "꺼냄 → 비어 있음", cached: 2, expect: "생성 1개 기대", verdict: "diff = 2 − 3 = −1 → Pod 1개 생성 요청" },
  { event: "(가정) 같은 key가 다시 들어옴", queue: "web-5c6d", cached: 2, expect: "생성 1개 기대 · 아직 못 봄", verdict: "그냥 세면 또 −1 · 기대가 남아 있어 세지 않음", warn: true },
  { event: "새 Pod가 캐시에 보임", queue: "web-5c6d", cached: 3, expect: "충족 → 다시 셈", verdict: "diff = 3 − 3 = 0 → 아무 요청 없음" },
  { event: "(가정) 꺼진 사이 Pod 둘 삭제", queue: "web-5c6d", cached: 1, expect: "재시작으로 비어 있음 → 생성 2개 기대", verdict: "사건 수와 무관 · diff = 1 − 3 = −2 → 2개 생성" },
];

const SCENES = [
  {
    label: "사건은 key만 넣습니다",
    summary: "사건 → workqueue에 key",
    note: "Pod 삭제 사건은 '하나 만들어라'라는 명령이 아니라 ReplicaSet web-5c6d를 다시 보라는 신호입니다. workqueue에는 객체의 key만 들어갑니다.",
  },
  {
    label: "꺼낸 뒤 통째로 다시 셉니다",
    summary: "2 − 3 = −1 → 1개 생성",
    note: "꺼낸 컨트롤러는 informer 캐시(API server의 객체를 지켜보며 컨트롤러 곁에 복사해 둔 저장소)에서 소유한 Pod를 다시 세어 목표와 비교합니다. 만들라고 요청한 수는 expectations에 적어 둡니다.",
  },
  {
    label: "캐시가 아직 못 봤을 때",
    summary: "또 −1? → 세지 않음",
    note: "요청 직후 캐시에는 새 Pod가 아직 없어서 다시 세면 또 −1이 나옵니다. 그래서 informer가 기대한 수를 볼 때까지 이 ReplicaSet을 다시 세지 않습니다. 끝내 못 보면 5분 뒤 기대값을 버립니다.",
  },
  {
    label: "캐시가 따라잡음",
    summary: "3 − 3 = 0 → 끝",
    note: "새 Pod가 캐시에 보이면 기대가 채워지고, 다시 센 값이 목표와 같아 이번 reconcile은 아무 요청도 보내지 않습니다.",
  },
  {
    label: "꺼졌다 돌아와도 같은 결과",
    summary: "현재 상태만 보면 됨",
    note: "컨트롤러가 꺼진 사이 사건 둘을 놓쳤어도, 돌아와 현재 상태를 다시 세면 차이 −2를 보고 같은 3에 도달합니다. 커뮤니티 지침이 'Level driven, not edge driven'을 요구하며 드는 이유가 이것입니다.",
  },
] as const;

function Cell({ title, children, tone }: { title: string; children: ReactNode; tone?: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-border px-3 py-2" style={tone ? { borderColor: tone } : undefined}>
      <p className="text-[11px] font-semibold text-muted-foreground sm:text-xs">{title}</p>
      <div className="mt-1 min-h-[2.5rem] text-xs font-semibold leading-5 sm:text-sm">{children}</div>
    </div>
  );
}

export default function LevelTriggeredViz() {
  return (
    <SceneShell
      eyebrow="Level-triggered"
      title="사건은 다시 보라는 신호일 뿐, 판단은 현재 상태를 다시 세서 합니다"
      description="replicas 3인 ReplicaSet web-5c6d 하나를 따라갑니다. 칸 네 개는 왼쪽부터 들어온 사건, workqueue, 캐시에 보이는 Pod, expectations(만들라고 요청했지만 아직 캐시에 안 보인 수)입니다."
      note="장면 3의 '같은 key가 다시 들어옴'과 장면 5의 '꺼진 사이 Pod 둘 삭제'는 설명을 위한 가정입니다."
      ariaLabel="사건이 workqueue에 key만 넣고 컨트롤러가 캐시를 다시 세는 순서"
      scenes={SCENES}
      render={(active) => {
        const step = STEPS[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              <Cell title="1 · 들어온 사건">{step.event}</Cell>
              <Cell title="2 · workqueue">
                <span className="font-mono">{step.queue}</span>
              </Cell>
              <Cell title={`3 · 캐시의 Pod (목표 ${REPLICAS})`}>
                <span className="flex gap-1" aria-label={`Pod ${step.cached}개`}>
                  {[0, 1, 2].map((slot) => (
                    <span
                      key={slot}
                      className="inline-block h-4 w-4 rounded-sm border"
                      style={slot < step.cached ? { backgroundColor: "#2563eb", borderColor: "#2563eb" } : { borderColor: "#94a3b8", borderStyle: "dashed" }}
                    />
                  ))}
                  <span className="ml-1 font-mono">{step.cached}</span>
                </span>
              </Cell>
              <Cell title="4 · expectations" tone={step.warn ? "#d97706" : undefined}>
                {step.expect}
              </Cell>
            </div>
            <p className={`mt-3 rounded-lg border px-3 py-2 font-mono text-xs font-bold leading-5 sm:text-sm ${step.warn ? "border-[#d97706] text-[#b45309]" : "border-border text-foreground"}`}>
              판정: {step.verdict}
            </p>
          </div>
        );
      }}
    />
  );
}
