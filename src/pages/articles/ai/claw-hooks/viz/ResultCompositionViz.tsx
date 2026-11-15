import SceneShell from "./HookSceneShell";

/**
 * 본문 대응: #result-composition — override·reason은 뒤 값이 앞 값을 덮고,
 * Deny에서 즉시 멈춘다. 마지막 장면은 2번 hook이 Allow를 냈다고 가정한 대조로,
 * "덮어쓰기"와 "가장 엄격한 값" 규칙이 갈라지는 자리를 보인다.
 */
type HookState = "wait" | "done" | "stop" | "skip";

interface Scene {
  label: string;
  summary: string;
  note: string;
  hooks: readonly { state: HookState; value: string }[];
  override: string;
  overrideFrom: string;
  reason: string;
  executor: string;
  strictest?: string;
  strictSame?: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "시작",
    summary: "저장된 override 없음",
    note: "Matching hook 세 개가 등록 순서대로 기다립니다. 아직 어느 hook도 결과를 내지 않아 override와 reason 칸이 비어 있습니다.",
    hooks: [
      { state: "wait", value: "대기" },
      { state: "wait", value: "대기" },
      { state: "wait", value: "대기" },
    ],
    override: "없음",
    overrideFrom: "",
    reason: "없음",
    executor: "아직 판단 전",
  },
  {
    label: "Hook 1 · Ask",
    summary: "Ask 저장 → 다음 hook",
    note: "Ask는 실행을 멈추는 결과가 아닙니다. override와 reason만 저장하고 2번 hook으로 넘어갑니다. 사용자에게 바로 묻지 않습니다.",
    hooks: [
      { state: "done", value: "Ask · 티켓 필요" },
      { state: "wait", value: "다음 차례" },
      { state: "wait", value: "대기" },
    ],
    override: "Ask",
    overrideFrom: "hook 1",
    reason: "변경 티켓 필요",
    executor: "아직 판단 전 (hook 2·3 남음)",
  },
  {
    label: "Hook 2 · Deny",
    summary: "Ask를 덮고 즉시 중단",
    note: "Deny는 override와 reason을 갱신한 뒤 그 자리에서 흐름을 끊습니다. 3번 hook은 실행되지 않고 Bash executor도 호출되지 않습니다.",
    hooks: [
      { state: "done", value: "Ask · 티켓 필요" },
      { state: "stop", value: "Deny · main push 금지" },
      { state: "skip", value: "도달하지 않음" },
    ],
    override: "Deny",
    overrideFrom: "hook 2가 Ask를 덮음",
    reason: "main push 금지",
    executor: "호출 안 함",
    strictSame: "Deny · 이 장면은 같은 결과",
  },
  {
    label: "대조 (가정) · Hook 2가 Allow",
    summary: "덮어쓰기: Allow · 엄격 규칙이었다면: Ask",
    note: "2번 hook이 Deny 대신 Allow를 냈다고 가정하면 중단이 없어 3번 hook까지 실행되고, 뒤 값이 앞 값을 덮어 override는 Allow로 남습니다. 모든 결과 중 가장 엄격한 값을 고르는 규칙이었다면 Ask가 남았을 자리입니다. 이 override가 기본 permission과 어떻게 합쳐지는지는 이 그림에서 다루지 않습니다.",
    hooks: [
      { state: "done", value: "Ask · 티켓 필요" },
      { state: "done", value: "Allow (가정)" },
      { state: "done", value: "Allow (표의 예정값)" },
    ],
    override: "Allow",
    overrideFrom: "hook 3이 마지막으로 덮음",
    reason: "hook 2·3이 reason을 보냈다면 마지막 값으로 덮임",
    executor: "다음 판정 단계로 넘어감 (그림 밖)",
    strictest: "Ask",
  },
];

const HOOK_STYLE: Record<HookState, string> = {
  wait: "border-dashed border-border text-muted-foreground",
  done: "border-border bg-background text-foreground",
  stop: "border-red-600 bg-background text-foreground",
  skip: "border-dashed border-border/50 text-muted-foreground/60 line-through",
};

const HOOK_TAG: Record<HookState, string> = {
  wait: "대기",
  done: "실행됨",
  stop: "실행됨 · 중단",
  skip: "미실행",
};

export default function ResultCompositionViz() {
  return (
    <SceneShell
      eyebrow="결과 합성"
      title="뒤 hook의 값이 앞 값을 덮고, Deny에서 멈춘다"
      description="로그인 401 예시의 git push origin main 요청입니다. 위 칸은 등록 순서대로 실행되는 matching hook 셋, 아래 칸은 합성 중 저장되는 값입니다. override는 hook이 돌려준 allow·ask·deny 판정을 뜻합니다."
      note="message와 diagnostic은 덮지 않고 모아 둡니다. 이 예시에는 해당 출력이 없어 칸을 그리지 않았습니다."
      ariaLabel="hook 결과 합성 순서와 덮어쓰기, 조기 중단"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {scene.hooks.map((hook, index) => (
                <div key={index} className={`min-w-0 rounded-lg border px-2 py-2 sm:px-3 ${HOOK_STYLE[hook.state]}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-[11px] sm:text-xs">
                    <span className="font-semibold">hook {index + 1}</span>
                    <span className="text-muted-foreground no-underline">{HOOK_TAG[hook.state]}</span>
                  </div>
                  <p className="mt-1 break-keep text-xs font-semibold sm:text-sm">{hook.value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="min-w-0 rounded-lg border border-border px-3 py-2">
                <p className="text-xs text-muted-foreground">override (덮어쓰는 칸)</p>
                <p className="mt-1 text-base font-bold">{scene.override}</p>
                <p className="text-xs text-muted-foreground">{scene.overrideFrom || "아직 저장된 값 없음"}</p>
              </div>
              <div className="min-w-0 rounded-lg border border-border px-3 py-2">
                <p className="text-xs text-muted-foreground">reason (덮어쓰는 칸)</p>
                <p className="mt-1 break-keep text-sm font-bold">{scene.reason}</p>
              </div>
              <div className="min-w-0 rounded-lg border border-border px-3 py-2">
                <p className="text-xs text-muted-foreground">Bash executor</p>
                <p className="mt-1 break-keep text-sm font-bold">{scene.executor}</p>
              </div>
              <div className={`min-w-0 rounded-lg border px-3 py-2 ${scene.strictest ? "border-amber-600" : "border-dashed border-border/50"}`}>
                <p className="text-xs text-muted-foreground">“가장 엄격한 값” 규칙이었다면</p>
                <p className="mt-1 text-sm font-bold">{scene.strictest ? `${scene.strictest} (실제 합성과 다름)` : scene.strictSame ?? "아직 최종값 전 · 비교 안 함"}</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
