import SceneShell from "./SceneShell";

/**
 * 본문 대응: #router — v0.4.15 route() 확인 순서: model → task → (켠 경우) 업무 자동 선택 → lang
 * → 애플리케이션 언어 힌트 → 내장 문자·언어 분석. 먼저 일치한 규칙을 쓴다.
 * 영어 라틴 문자 → English, 다른 문자·언어 → multilingual, 확정 못 하면 기본값 multilingual(0.4.0부터).
 */
const RULES = [
  "model",
  "task",
  "업무 자동 선택 (켠 경우)",
  "lang",
  "애플리케이션의 언어 힌트",
  "내장 문자·언어 분석",
] as const;

const SCENES = [
  { label: "model을 직접 지정", summary: "1번 규칙에서 멈춤", hit: 0, result: "지정한 checkpoint", note: "호출자가 model을 적으면 첫 규칙이 일치하므로 아래 규칙은 보지 않습니다." },
  { label: "지정 없는 영어 문의", summary: "6번 규칙 → English", hit: 5, result: "English", note: "위 다섯 규칙에 해당하는 값이 없으면(가정) 내장 분석까지 내려갑니다. 청구 문의처럼 영어 라틴 문자이면 English로 보냅니다." },
  { label: "지정 없는 다른 문자", summary: "6번 규칙 → multilingual", hit: 5, result: "multilingual", note: "다른 문자나 다른 언어이면 multilingual로 보냅니다. 카드는 English checkpoint가 크메르어에서 정답률 0.000에 확신 0.952였다고 적으므로, 확신 문턱 대신 forward 전에 이렇게 고릅니다." },
  { label: "짧거나 모호한 글", summary: "확정 못 함 → multilingual", hit: 5, result: "multilingual (기본값)", note: "내장 분석이 언어를 확정하지 못하면 0.4.0부터 기본값인 multilingual로 보냅니다. route()는 모델을 올리지 않고 고른 model과 reason을 먼저 돌려줍니다." },
] as const;

export default function RouterCascadeViz() {
  return (
    <SceneShell
      eyebrow="Laya v0.4.15 route()"
      title="Router는 위에서부터 확인하고 처음 일치한 규칙을 씁니다"
      description="한 줄이 규칙 하나입니다. 회색은 확인했지만 값이 없어 지나친 규칙, 파랑은 결정한 규칙, 흐린 줄은 보지 않은 규칙입니다. 요청 네 개는 설명을 위한 예입니다. (가정)"
      ariaLabel="checkpoint를 고르는 여섯 규칙과 요청별로 멈추는 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <ol className="space-y-1.5">
              {RULES.map((rule, index) => {
                const state = index < scene.hit ? "pass" : index === scene.hit ? "hit" : "skip";
                return (
                  <li
                    key={rule}
                    className={`grid min-h-9 grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-2 rounded-md border px-2 py-1 text-sm ${
                      state === "hit" ? "border-[#2563eb] bg-[#2563eb]/10" : state === "pass" ? "border-border bg-muted/40" : "border-dashed border-border/60 opacity-40"
                    }`}
                  >
                    <span className="font-mono text-xs text-muted-foreground">{index + 1}</span>
                    <span className={`min-w-0 break-keep ${state === "hit" ? "font-bold" : ""}`}>{rule}</span>
                    <span className={`whitespace-nowrap text-xs ${state === "hit" ? "font-bold text-[#2563eb]" : "text-muted-foreground"}`}>
                      {state === "pass" ? "값 없음 ↓" : state === "hit" ? "여기서 결정" : "보지 않음"}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 rounded-md border border-[#2563eb] px-3 py-2">
              <span className="text-xs text-muted-foreground">실행할 checkpoint</span>
              <span className="font-mono text-sm font-bold text-[#2563eb]">{scene.result}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
