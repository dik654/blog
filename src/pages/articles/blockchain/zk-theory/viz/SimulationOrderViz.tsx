import SceneShell from "./SceneShell";

/**
 * 본문 대응: #simulation — 실제 대화는 10을 고르고 12를 보낸 뒤 질문 2를 받아 답 7을 만든다.
 * 시뮬레이터는 질문 2와 답 7을 먼저 고르고 처음 값을 2⁷×16⁻²로 계산한다.
 * 23으로 나눈 나머지: 2⁷≡13, 16²=256≡3, 3×8=24≡1이므로 3⁻¹≡8, 13×8=104≡12. 두 기록 모두 (12, 2, 7).
 */

interface Step {
  who: string;
  text: string;
  secret?: boolean;
}

const REAL: readonly Step[] = [
  { who: "증명자", text: "10을 고름" },
  { who: "증명자 → 검증자", text: "2¹⁰ ≡ 12 전송" },
  { who: "검증자 → 증명자", text: "질문 2" },
  { who: "증명자", text: "답 10 + 2×4 ≡ 7", secret: true },
];

const SIM: readonly Step[] = [
  { who: "시뮬레이터", text: "질문 2를 먼저 고름" },
  { who: "시뮬레이터", text: "답 7을 고름" },
  { who: "시뮬레이터", text: "2⁷ ≡ 13, 16² ≡ 3, 3⁻¹ ≡ 8" },
  { who: "시뮬레이터", text: "처음 값 13 × 8 ≡ 12" },
];

const SCENES = [
  { label: "실제 대화의 순서", summary: "12 → 질문 2 → 답 7", note: "실제 대화에서는 처음 값 12를 보낸 뒤에야 상대가 질문을 정합니다. 마지막 답을 만들 때 비밀 4가 쓰입니다.", focus: "real" },
  { label: "시뮬레이터의 역순", summary: "질문 2, 답 7 → 처음 값 12", note: "비밀 4를 쓰지 않고 질문과 답을 먼저 정한 뒤 처음 값을 2⁷×16⁻²로 거꾸로 계산합니다. 3과 곱해 1이 되는 수가 8이므로(3×8=24≡1) 16⁻²≡8이고, 13×8=104≡12입니다.", focus: "sim" },
  { label: "같은 기록, 다른 순서", summary: "둘 다 (12, 2, 7)", note: "남는 기록은 둘 다 (12, 2, 7)입니다. 시뮬레이터는 보안 정의 속 가상 알고리즘이라 질문을 먼저 고를 수 있습니다. 이 계산은 정직한 검증자에 대한 시뮬레이션을 설명할 뿐, 악의적 검증자나 비대화형 변환의 보장까지 증명하지는 않습니다.", focus: "both" },
] as const;

function Lane({ title, steps, dim, highlightRecord }: { title: string; steps: readonly Step[]; dim: boolean; highlightRecord: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border border-border p-3 transition-opacity duration-300 motion-reduce:transition-none ${dim ? "opacity-40" : ""}`}>
      <p className="text-sm font-bold">{title}</p>
      <ol className="mt-2 space-y-2">
        {steps.map((step, i) => (
          <li key={step.text} className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-start gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border font-mono text-xs">{i + 1}</span>
            <span className="min-w-0">
              <span className="block text-[11px] text-muted-foreground">{step.who}</span>
              <span className={`block font-mono text-sm ${step.secret ? "font-semibold text-blue-700 dark:text-blue-300" : ""}`}>
                {step.text}
                {step.secret ? " · 비밀 4 사용" : ""}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <p className={`mt-3 rounded-md border px-2 py-1 text-center font-mono text-sm ${highlightRecord ? "border-primary/50 font-bold text-primary" : "border-border text-muted-foreground"}`}>
        기록 (12, 2, 7)
      </p>
    </div>
  );
}

export default function SimulationOrderViz() {
  return (
    <SceneShell
      eyebrow="시뮬레이션"
      title="같은 대화 기록을 거꾸로 만들 수 있습니다"
      description="왼쪽(위)은 실제 대화, 오른쪽(아래)은 비밀 없이 대화 기록을 만드는 가상의 절차인 시뮬레이터입니다. 번호는 계산하는 순서이고, 계산은 23으로 나눈 나머지(지수는 11로 나눈 나머지)입니다."
      ariaLabel="실제 Schnorr 대화와 시뮬레이터가 같은 기록 12, 2, 7을 서로 다른 순서로 만드는 모습"
      scenes={SCENES}
      render={(active) => {
        const focus = SCENES[active].focus;
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <Lane title="실제 대화" steps={REAL} dim={focus === "sim"} highlightRecord={focus === "both"} />
            <Lane title="시뮬레이터 (비밀 없음)" steps={SIM} dim={focus === "real"} highlightRecord={focus === "both"} />
          </div>
        );
      }}
    />
  );
}
