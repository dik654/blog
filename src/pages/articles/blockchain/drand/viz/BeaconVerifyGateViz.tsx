import SceneShell from "./ExplainSceneShell";

/**
 * 본문 대응: #verification — relay 응답을 받은 클라이언트가 고정한 chain info로 거치는 순서.
 * expected round 비교 → scheme별 message 재구성 → BLS 검증 → SHA-256(signature)와 randomness 비교.
 * 응답 사례 다섯 개는 설명용이며, 각 사례가 어느 단계에서 멈추는지만 보인다.
 */
type GateState = "pass" | "fail" | "computed" | "stop";

const GATES = [
  { title: "① round 비교", detail: "expected 42 = received?" },
  { title: "② message 재구성", detail: "" },
  { title: "③ BLS 검증", detail: "collective public key" },
  { title: "④ randomness 확인", detail: "SHA-256(signature)" },
] as const;

const STATE_TEXT: Record<GateState, string> = {
  pass: "✓ 통과",
  fail: "✕ 불일치",
  computed: "＝ 직접 계산",
  stop: "– 진행 안 함",
};

const STATE_COLOR: Record<GateState, string> = {
  pass: "#16a34a",
  fail: "#dc2626",
  computed: "#2563eb",
  stop: "#94a3b8",
};

const SCENES = [
  {
    label: "정상 응답 · unchained",
    summary: "네 단계 통과 → verified beacon",
    response: ["round 42", "signature σ₄₂", "randomness 포함"],
    message: "round 42에서 만든 message",
    gates: ["pass", "pass", "pass", "pass"],
    verdict: "사용 가능",
    note: "Unchained scheme은 round만으로 message를 만듭니다. 고정한 public key로 signature를 검증하고, 직접 계산한 SHA-256(σ₄₂)가 응답의 randomness와 같으면 이 beacon을 씁니다.",
  },
  {
    label: "다른 round가 온 응답",
    summary: "expected 42 ≠ received 41",
    response: ["round 41", "signature σ₄₁", "randomness 포함"],
    message: "round 비교에서 멈춤",
    gates: ["fail", "stop", "stop", "stop"],
    verdict: "사용 안 함",
    note: "Round 41의 beacon은 그 자체로 유효할 수 있습니다. 하지만 앱이 고정한 것은 round 42이므로 첫 비교에서 멈추고, 뒤의 서명 검증으로 넘어가지 않습니다.",
  },
  {
    label: "정상 응답 · chained",
    summary: "message에 이전 signature 포함",
    response: ["round 42", "signature σ₄₂", "randomness 포함"],
    message: "이전 signature σ₄₁ + round 42",
    gates: ["pass", "pass", "pass", "pass"],
    verdict: "사용 가능",
    note: "Chained scheme은 이전 signature도 message에 넣습니다. 같은 BLS라도 unchained와 message가 다르고, scheme에 따라 signature가 놓이는 curve group(G1 또는 G2)도 다를 수 있어 ②에서 scheme을 먼저 가립니다.",
  },
  {
    label: "randomness만 다른 응답",
    summary: "σ는 유효 · H(σ) ≠ randomness",
    response: ["round 42", "signature σ₄₂", "randomness 다른 값"],
    message: "round 42에서 만든 message",
    gates: ["pass", "pass", "pass", "fail"],
    verdict: "사용 안 함",
    note: "Signature가 유효해도 relay가 붙인 randomness field를 그대로 믿지 않습니다. 직접 계산한 SHA-256(σ₄₂)와 다르면 그 randomness는 이 signature에서 나온 값이 아닙니다.",
  },
  {
    label: "randomness를 생략한 V2 응답",
    summary: "생략돼도 SHA-256(σ₄₂)로 결정",
    response: ["round 42", "signature σ₄₂", "randomness 없음"],
    message: "round 42에서 만든 message",
    gates: ["pass", "pass", "pass", "computed"],
    verdict: "사용 가능",
    note: "V2 relay가 randomness field를 생략해도 값은 signature에서 결정적으로 나옵니다. 클라이언트가 SHA-256(σ₄₂)를 계산하면 비교할 field 없이도 같은 난수를 얻습니다.",
  },
] as const;

export default function BeaconVerifyGateViz() {
  return (
    <SceneShell
      eyebrow="Relay 응답 · 클라이언트 검증"
      title="Relay가 보낸 응답은 네 단계를 차례로 통과해야 쓸 수 있습니다"
      description="클라이언트는 미리 고정한 기준으로 relay 응답을 ①→④ 순서로 검사하고, 한 칸이라도 어긋나면 그 응답을 쓰지 않습니다. ②의 칸에는 scheme에 맞춰 다시 만든 message가 보입니다. 응답 다섯 개는 설명용 사례입니다."
      note="Round 42와 응답 사례는 설명용입니다. 실제 chain hash·public key·scheme·genesis time·period는 신뢰한 chain info에서 고정합니다."
      ariaLabel="relay 응답 다섯 사례가 round 비교, message 재구성, BLS 검증, randomness 확인 중 어디서 멈추는지"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const gates = scene.gates as readonly GateState[];
        const accepted = scene.verdict === "사용 가능";
        return (
          <div className="min-w-0 space-y-3">
            <p className="break-keep rounded-md border border-border px-3 py-2 text-[11px] leading-5">
              <span className="font-bold">미리 고정 · </span>
              chain hash · public key · scheme · genesis time · period · 사용할 round 42
            </p>
            <div className="flex min-w-0 items-stretch gap-2">
              <p className="min-w-0 flex-1 break-keep rounded-md border border-dashed border-border px-3 py-2 text-[11px] leading-5">
                <span className="font-bold">relay 응답 · </span>
                <span className="font-mono">{scene.response.join(" · ")}</span>
              </p>
              <p className="flex shrink-0 items-center rounded-md border px-3 text-xs font-bold" style={{ borderColor: accepted ? "#16a34a" : "#dc2626", color: accepted ? "#16a34a" : "#dc2626" }}>
                {accepted ? "✓ " : "✕ "}
                {scene.verdict}
              </p>
            </div>
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {GATES.map((gate, index) => {
                const state = gates[index];
                const detail = index === 1 ? scene.message : gate.detail;
                return (
                  <li key={gate.title} className="min-w-0 rounded-md border p-2.5" style={{ borderColor: STATE_COLOR[state] }}>
                    <p className="text-xs font-bold">{gate.title}</p>
                    <p className={`mt-0.5 break-keep text-[11px] leading-4 text-muted-foreground ${index === 1 ? "" : "hidden sm:block"}`}>{detail}</p>
                    <p className="mt-1.5 text-xs font-bold" style={{ color: STATE_COLOR[state] }}>{STATE_TEXT[state]}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      }}
    />
  );
}
