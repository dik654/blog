import SceneShell from "./SceneShell";

/**
 * 본문 대응: #forkchoice-updated — forkchoiceUpdated 한 호출 안의 처리 순서.
 * ① fork-choice state(세 pointer)를 먼저 적용 → ② head가 VALID일 때만 attributes 처리.
 * Attributes가 잘못돼 build가 없어도 ①의 pointer update를 되돌린다고 명세가 규정하지 않음.
 */
type Tone = "idle" | "on" | "off" | "warn";

const SCENES = [
  {
    label: "한 호출에 두 가지",
    summary: "FCU(E₀, safe, finalized, attrs)",
    pointer: "idle",
    gate: "idle",
    build: "idle",
    pointerText: "아직 처리 전",
    gateText: "아직 판정 전",
    buildText: "아직 처리 전",
    reply: "응답 대기",
    note: "Prysm은 세 pointer(head·safe·finalized)와 payload attributes(timestamp·randomness·fee recipient 등)를 한 forkchoiceUpdated 호출에 담습니다. Execution client는 둘을 한 덩어리로 처리하지 않고 순서를 둡니다.",
  },
  {
    label: "① pointer 먼저",
    summary: "head = E₀ · safe · finalized",
    pointer: "on",
    gate: "idle",
    build: "idle",
    pointerText: "head = E₀ 적용",
    gateText: "아직 판정 전",
    buildText: "아직 처리 전",
    reply: "응답 대기",
    note: "Execution APIs v1.0.0-beta.7은 fork-choice state를 먼저 적용하도록 정합니다. 이 단계에서는 attributes를 아직 보지 않습니다.",
  },
  {
    label: "② head VALID → build",
    summary: "VALID + P₁",
    pointer: "on",
    gate: "on",
    build: "on",
    pointerText: "head = E₀ 적용",
    gateText: "VALID",
    buildText: "build 시작 · P₁ 발급",
    reply: "VALID + P₁",
    note: "Head가 VALID일 때만 attributes를 처리합니다. E₀ 위에서 build가 시작되면 응답에 8-byte payloadId P₁이 담깁니다.",
  },
  {
    label: "attributes가 잘못되면",
    summary: "build 없음 ≠ pointer 취소",
    pointer: "on",
    gate: "on",
    build: "warn",
    pointerText: "되돌린다는 규정 없음",
    gateText: "VALID",
    buildText: "build 시작 안 됨",
    reply: "P₁ 없음",
    note: "Attributes가 잘못돼 build가 시작되지 않아도, 명세는 ①에서 성공한 pointer update를 없던 일로 되돌린다고 규정하지 않습니다. P₁이 없다는 것과 pointer가 어떻게 됐는지는 따로 봐야 합니다.",
  },
  {
    label: "head가 VALID가 아니면",
    summary: "attributes 처리 안 함",
    pointer: "idle",
    gate: "off",
    build: "off",
    pointerText: "이 글은 다루지 않음",
    gateText: "VALID 아님",
    buildText: "처리하지 않음",
    reply: "P₁ 없음",
    note: "Attributes 처리는 head가 VALID일 때로 한정됩니다. 그래서 head가 VALID로 판정되지 않으면 build도 시작되지 않습니다. 이 경우의 pointer 처리는 이 글이 다루지 않으므로 비워 두었습니다.",
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  pointer: Tone;
  gate: Tone;
  build: Tone;
  pointerText: string;
  gateText: string;
  buildText: string;
  reply: string;
  note: string;
}[];

const TONE: Record<Tone, string> = {
  idle: "border-border text-muted-foreground",
  on: "border-primary text-foreground ring-1 ring-inset ring-primary",
  off: "border-dashed border-border text-muted-foreground opacity-70",
  warn: "border-dashed border-amber-600 text-amber-700 dark:text-amber-400",
};

function Box({ step, title, text, tone }: { step: string; title: string; text: string; tone: Tone }) {
  return (
    <div className={`min-w-0 rounded-lg border bg-background p-3 ${TONE[tone]}`}>
      <span className="block font-mono text-[10px] font-black text-primary">{step}</span>
      <strong className="mt-1 block break-keep text-xs leading-5 text-foreground sm:text-sm">{title}</strong>
      <span className="mt-1 block break-keep text-xs leading-5">{text}</span>
    </div>
  );
}

function Arrow() {
  return (
    <div className="-my-1 flex items-center justify-center text-xs leading-3 text-muted-foreground sm:my-0 sm:text-base" aria-hidden>
      <span className="sm:hidden">↓</span>
      <span className="hidden sm:inline">→</span>
    </div>
  );
}

export default function FcuOrderViz() {
  return (
    <SceneShell
      eyebrow="forkchoiceUpdated 처리 순서"
      title="Pointer를 먼저 적용하고, build는 그다음에 따로 판정합니다"
      description="한 forkchoiceUpdated 호출이 execution client 안에서 두 단계로 나뉘는 모습입니다. Pointer는 head·safe·finalized 세 block hash, attributes는 다음 block을 만들 조건입니다. 순서는 Execution APIs v1.0.0-beta.7 기준입니다."
      ariaLabel="forkchoiceUpdated가 pointer 적용 후 head VALID일 때만 attributes를 처리하는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="min-w-0 rounded-lg border border-border bg-background p-2">
                <span className="font-mono text-[10px] font-black text-muted-foreground">REQUEST · POINTERS</span>
                <span className="mt-1 block break-keep leading-5">head E₀ · safe · finalized</span>
              </div>
              <div className="min-w-0 rounded-lg border border-border bg-background p-2">
                <span className="font-mono text-[10px] font-black text-muted-foreground">REQUEST · ATTRS</span>
                <span className="mt-1 block break-keep leading-5">timestamp · randomness · fee recipient</span>
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)_1.25rem_minmax(0,1fr)]">
              <Box step="①" title="Fork-choice state" text={scene.pointerText} tone={scene.pointer} />
              <Arrow />
              <Box step="판정" title="Head가 VALID?" text={scene.gateText} tone={scene.gate} />
              <Arrow />
              <Box step="②" title="Payload attributes" text={scene.buildText} tone={scene.build} />
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs">
              <span className="font-mono text-[10px] font-black text-muted-foreground">RESPONSE → PRYSM</span>
              <strong className="break-keep text-primary">{scene.reply}</strong>
            </div>
          </div>
        );
      }}
    />
  );
}
