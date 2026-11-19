import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #prompt-template — 고정 template의 두 자리표시자를 요청마다 채워 최종 prompt를 만든다.
 * 장면 0 = 빈 template, 1 = 예시 1개로 채운 요청, 2 = 같은 뼈대에 예시 3개를 이어 붙여 4개로 늘린 요청.
 * 1개 → 4개는 본문 "예시 3개를 더 이어 붙이면 ... few-shot 조건을 1개에서 4개로 늘릴 수 있습니다"를 따른다.
 * 예시 세 개와 query 문장은 이 글 첫 Viz의 sentiment 예시이고, 넷째 예시는 내용을 정하지 않은 자리다.
 */
const SCENES = [
  {
    label: "빈 template",
    summary: "자리표시자 2곳",
    note: "Template은 고정 문자열입니다. system 규칙과 문장 뼈대는 그대로 두고, 이름 붙은 자리표시자 {{examples}}와 {{query}}만 요청마다 채웁니다.",
  },
  {
    label: "조건 A · 예시 1개",
    summary: "변수 치환 → 최종 prompt",
    note: "치환을 거치면 {{examples}}에는 고른 demonstration이, {{query}}에는 실제 사용자 입력이 들어가 최종 prompt가 완성됩니다. 보이지 않는 system 메시지도 이 request와 함께 다시 전송됩니다.",
  },
  {
    label: "조건 B · 예시 4개",
    summary: "3개를 이어 붙여 1 → 4개",
    note: "Template 코드는 그대로 두고 {{examples}} 자리에 예시 3개를 더 이어 붙여 1개를 4개로 늘렸습니다. 같은 query로 A와 B를 비교하면 차이를 예시 조건 하나로 좁힐 수 있습니다. 넷째 예시의 내용은 정하지 않았습니다.",
  },
] as const;

const EXAMPLES = [
  ["broken", "negative"],
  ["thanks", "positive"],
  ["refund", "negative"],
  ["예시 ④ (내용 미정)", "…"],
] as const;

const QUERY = "배송이 늦지만 상담은 친절했다";

function RoleTag({ role }: { role: string }) {
  return <span className="shrink-0 font-mono text-[10px] font-bold text-muted-foreground">role={role}</span>;
}

function Slot({ name }: { name: string }) {
  return (
    <span className="inline-block rounded-md border border-dashed border-violet-500 px-2 py-0.5 font-mono text-xs font-bold text-violet-700 dark:text-violet-300">
      {name}
    </span>
  );
}

function Drawing({ step }: { step: number }) {
  const filled = step > 0;
  const shown = step === 0 ? 0 : step === 1 ? 1 : 4;
  return (
    <div className="grid min-w-0 gap-2 text-xs sm:text-sm">
      <div className="rounded-lg border border-border bg-background px-3 py-2">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <RoleTag role="system" />
          <span className={`text-[10px] font-semibold ${filled ? "text-primary" : "text-muted-foreground/60"}`}>
            {filled ? "이번 request에도 재전송 · 화면엔 안 보임" : "고정 규칙"}
          </span>
        </div>
        <p className="mt-1 break-keep leading-6">세션 전체에 적용할 고정 규칙 (예: 출력 형식은 감정 label 하나, 가정)</p>
      </div>

      <div className="rounded-lg border border-border bg-background px-3 py-2">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span className="font-mono text-[10px] font-bold text-muted-foreground">예시 대화쌍 (입력 → 출력)</span>
          {step === 0 ? <Slot name="{{examples}}" /> : <span className="text-[10px] font-semibold text-primary">{shown}개 채움</span>}
        </div>
        <div className="mt-2 grid gap-1.5">
          {EXAMPLES.map(([input, label], index) => {
            const visible = index < shown;
            return (
              <div
                key={input}
                className={`flex items-center justify-between gap-2 rounded-md border px-2 py-1 ${
                  visible ? "border-sky-500 bg-sky-500/10" : "border-dashed border-border/60"
                }`}
              >
                <span className={visible ? "" : "invisible"}>{label === "…" ? input : <>입력 “{input}”</>}</span>
                <span className={visible ? "font-bold" : "invisible"}>→ {label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-background px-3 py-2">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <RoleTag role="user" />
          <span className="text-[10px] font-semibold text-muted-foreground">이번 turn의 가변 입력</span>
        </div>
        <p className="mt-1 break-keep leading-6">
          {step === 0 ? <Slot name="{{query}}" /> : <strong>“{QUERY}”</strong>}
        </p>
      </div>
    </div>
  );
}

export default function TemplateFillViz() {
  return (
    <SceneShell
      eyebrow="Prompt template"
      title="같은 뼈대에 예시와 입력만 갈아 끼웁니다"
      description="위에서 아래로 한 request에 실려 가는 메시지 순서입니다. 점선 칸은 아직 채우지 않은 자리표시자, 파란 칸은 채워 넣은 예시(demonstration, 입력→출력 견본)입니다."
      ariaLabel="Prompt template의 자리표시자를 요청마다 채워 예시 1개와 4개 조건을 만드는 과정"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={SCENES.map((scene, index) => <Drawing key={scene.label} step={index} />)} />
      )}
    />
  );
}
