import SceneShell from "./SceneShell";

/**
 * 본문 대응: #measurement-attestation — Realm token과 platform token은 서로 다른 signer·claim을 가지며,
 * challenge binding이 없거나 reference policy가 낡으면 서명이 맞아도 key를 지급할 수 없다.
 * TOKEN 단계(두 token의 challenge·public-key binding을 함께 appraisal)와 실패 표의 "Token challenge mismatch → key release 0회"를 따른다.
 * 다섯 검사는 본문의 CHECK 목록과 문장을 나눈 것이며, 각 장면에서 무엇이 어긋나는지는 설명용 가정이다.
 */
type State = "pass" | "fail";

const CHECKS = [
  "Realm token 서명 (issuer·algorithm)",
  "Platform token 서명 (issuer·algorithm)",
  "client challenge 일치 (freshness)",
  "두 token의 challenge·public-key binding",
  "Reference policy (measurement·RMM·platform TCB 기준)",
] as const;

const SCENES = [
  {
    label: "모두 통과",
    summary: "key 지급",
    states: ["pass", "pass", "pass", "pass", "pass"],
    released: true,
    note: "두 token의 서명이 각각 맞고, 이번 요청의 challenge가 들어 있으며, 두 token이 challenge·public-key binding으로 이어지고, measurement와 TCB claim이 현재 reference policy에 맞을 때만 key를 지급합니다.",
  },
  {
    label: "challenge 불일치",
    summary: "서명 ✓ · key 지급 0회",
    states: ["pass", "pass", "fail", "pass", "pass"],
    released: false,
    note: "서명이 맞는 token이라도 이번 요청의 client challenge와 다르면 freshness 실패입니다. 본문의 실패 표대로 key release는 0회입니다.",
  },
  {
    label: "binding 없음",
    summary: "서명 ✓ · 지급 불가",
    states: ["pass", "pass", "pass", "fail", "pass"],
    released: false,
    note: "Realm token과 platform token은 signer와 claim이 서로 다릅니다. 둘을 잇는 challenge·public-key binding이 없으면 두 서명이 모두 맞아도 key를 지급할 수 없습니다.",
  },
  {
    label: "reference policy가 낡음",
    summary: "서명 ✓ · 지급 불가",
    states: ["pass", "pass", "pass", "pass", "fail"],
    released: false,
    note: "Token은 신선하고 서로 이어져 있어도, 비교 기준인 reference policy가 낡았으면 지급할 수 없습니다.",
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  states: readonly State[];
  released: boolean;
  note: string;
}[];

const TOKENS = [
  { name: "Realm token", claims: "Realm initial·extensible measurement, personalization" },
  { name: "Platform token", claims: "RMM·platform TCB claim" },
] as const;

export default function TokenAppraisalViz() {
  return (
    <SceneShell
      eyebrow="CCA token appraisal"
      title="서명이 맞아도 다섯 검사 중 하나가 어긋나면 key는 나가지 않습니다"
      description="위 두 칸은 signer와 claim이 서로 다른 두 token입니다. 아래 다섯 줄은 본문의 CHECK 1~4와 TOKEN 단계를 key 지급 전 검사로 나눠 적은 것이며(서명 줄은 CHECK 4의 issuer·algorithm 확인), 장면마다 하나씩만 어긋나게 바꿨습니다(가정)."
      ariaLabel="Realm token과 platform token의 서명, challenge, binding, reference policy 검사 결과에 따른 key 지급 여부 네 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              {TOKENS.map((token) => (
                <div key={token.name} className="min-w-0 rounded-lg border border-border bg-background p-3">
                  <p className="text-sm font-bold">{token.name}</p>
                  <p className="mt-1 break-keep text-xs leading-5 text-muted-foreground">{token.claims}</p>
                </div>
              ))}
            </div>
            <ol className="min-w-0 rounded-lg border border-border bg-background">
              {CHECKS.map((check, index) => {
                const pass = scene.states[index] === "pass";
                return (
                  <li key={check} className="flex min-w-0 items-start gap-2 border-t border-border/60 px-3 py-2 text-sm first:border-t-0">
                    <span className="w-4 shrink-0 font-mono font-bold" style={{ color: pass ? "#15803d" : "#b91c1c" }}>{pass ? "✓" : "✕"}</span>
                    <span className={`min-w-0 break-keep ${pass ? "" : "font-bold"}`} style={pass ? undefined : { color: "#b91c1c" }}>{check}</span>
                  </li>
                );
              })}
            </ol>
            <div className="rounded-lg border px-3 py-2 text-sm font-bold" style={{ borderColor: scene.released ? "#16a34a" : "#dc2626", color: scene.released ? "#15803d" : "#b91c1c" }}>
              {scene.released ? "✓ key 지급" : "✕ key 지급 0회 — 서명은 맞았음"}
            </div>
          </div>
        );
      }}
    />
  );
}
