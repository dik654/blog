import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism (+ #black-box·#source) — 민수의 운영 저장소 삭제 요청.
 * 7절 판정 순서: 자격 검증 → 상위 경계(조직 ∩ 계정·구독) → 명시적 거부 → 명시적 허용 → 감사 기록.
 * 상위 정책은 최대 범위만 줄이고 권한을 주지 않는다. 허용이 없으면 기본적으로 닫힌다.
 */
type Mark = "pass" | "stop" | "skip" | "log";

const GATES = [
  { name: "신원 확인", detail: "로그인·다중 인증(MFA)·자격 만료" },
  { name: "상위 경계", detail: "조직·계정 정책이 허용 가능한 최대 범위 안인가" },
  { name: "명시적 거부", detail: "이 행동을 콕 집어 막는 문장이 있는가" },
  { name: "실제 허용", detail: "현재 역할의 정책이 삭제를 허용하는가" },
  { name: "감사 기록", detail: "주체·행동·대상·결과를 남김" },
] as const;

const SCENES = [
  {
    label: "허용 정책이 없을 때",
    summary: "거부도 없지만 거절",
    note: "로그인도 됐고 상위 경계 안이며 명시적 거부도 없습니다. 그래도 민수의 역할에 운영 저장소 삭제 허용이 없으면 요청은 통과하지 않습니다. 허용이 없으면 기본적으로 닫히기 때문입니다.",
    marks: ["pass", "pass", "pass", "stop", "log"],
    result: "거절 · 허용 없음",
    allowed: false,
  },
  {
    label: "명시적 거부가 있을 때",
    summary: "허용이 있어도 거절",
    note: "명시적 거부를 먼저 적용합니다. 거부 문장이 걸리면 역할에 허용이 있든 없든 거절됩니다.",
    marks: ["pass", "pass", "stop", "skip", "log"],
    result: "거절 · 명시적 거부",
    allowed: false,
  },
  {
    label: "상위 정책이 금지한 행동",
    summary: "역할이 허용해도 막힐 수 있음",
    note: "조직의 상위 규칙이 금지한 행동은 아래 팀이 역할에 허용을 넣어도 막힐 수 있습니다. 상위 정책은 허용 가능한 최대 범위를 줄이는 장치입니다.",
    marks: ["pass", "stop", "skip", "skip", "log"],
    result: "거절 · 상위 경계 밖",
    allowed: false,
  },
  {
    label: "모든 관문을 지날 때",
    summary: "허용 · 그래도 기록",
    note: "(가정) 민수의 역할에 삭제 허용이 있고 위의 어떤 제한에도 걸리지 않으면 통과합니다. 허용된 요청도 감사 로그에 남겨 사고 뒤 경로를 복원할 수 있게 합니다.",
    marks: ["pass", "pass", "pass", "pass", "log"],
    result: "허용",
    allowed: true,
  },
] as const satisfies readonly { label: string; summary: string; note: string; marks: readonly Mark[]; result: string; allowed: boolean }[];

const MARK_STYLE: Record<Mark, { box: string; tag: string; text: string }> = {
  pass: { box: "border-border", tag: "text-blue-700 dark:text-blue-300", text: "통과" },
  stop: { box: "border-red-600 bg-red-600/10", tag: "text-red-700 dark:text-red-400", text: "여기서 막힘" },
  skip: { box: "border-dashed border-border/60 opacity-45", tag: "text-muted-foreground", text: "결과와 무관" },
  log: { box: "border-border bg-muted/30", tag: "text-foreground", text: "항상 남김" },
};

export default function DecisionGateViz() {
  return (
    <SceneShell
      eyebrow="권한 판정"
      title="민수의 삭제 요청은 관문 하나만 막혀도 거절됩니다"
      description="요청: 주체=민수, 행동=삭제, 대상=운영 저장소, 조건=다중 인증(MFA) 사용. 위에서 아래로 7절의 판정 순서를 따르며, 감사 기록은 결과와 상관없이 남깁니다."
      ariaLabel="권한 판정 관문별로 민수의 운영 저장소 삭제 요청이 통과하거나 막히는 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const marks: readonly Mark[] = scene.marks;
        return (
          <div className="mx-auto max-w-xl">
            <ol className="space-y-1.5">
              {GATES.map((gate, index) => {
                const mark = marks[index];
                return (
                  <li key={gate.name} className={`grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-md border px-2.5 py-1.5 ${MARK_STYLE[mark].box}`}>
                    <span className="font-mono text-xs text-muted-foreground">{index + 1}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{gate.name}</span>
                      <span className="block text-xs leading-5 text-muted-foreground">{gate.detail}</span>
                    </span>
                    <span className={`shrink-0 text-xs font-bold ${MARK_STYLE[mark].tag}`}>{MARK_STYLE[mark].text}</span>
                  </li>
                );
              })}
            </ol>
            <p
              className={`mt-3 rounded-md border px-3 py-2 text-center text-sm font-bold ${
                scene.allowed ? "border-blue-600 text-blue-700 dark:text-blue-300" : "border-red-600 text-red-700 dark:text-red-400"
              }`}
            >
              결과: {scene.result}
            </p>
          </div>
        );
      }}
    />
  );
}
