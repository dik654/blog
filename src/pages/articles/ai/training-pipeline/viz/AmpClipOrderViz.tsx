import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #loop의 AMP 소절 — loss를 s배 → backward → s로 나눠 복원 → clip → update.
 * 수치는 모두 가정: 실제 gradient norm 0.5, s = 1024, clip threshold 1.0.
 * 올바른 순서: 0.5×1024 = 512 → 512÷1024 = 0.5 → 0.5 ≤ 1.0 그대로.
 * 잘못된 순서: 512 > 1.0 → 1.0으로 줄임 → 1.0÷1024 ≈ 0.00098.
 */
type RowState = "on" | "off" | "bad" | "skip";
type Row = readonly [step: string, value: string, state: RowState];

const LOSS: Row = ["loss × s", "s = 1024 (가정)", "on"];
const BACKWARD: Row = ["backward", "‖g_scaled‖ = 1024 × 0.5 = 512", "on"];

const SCENES = [
  {
    label: "Loss를 s배 해 backward",
    summary: "‖g‖ 0.5 → 512",
    rows: [
      LOSS,
      BACKWARD,
      ["unscale (÷ s)", "", "off"],
      ["clip (threshold 1.0, 가정)", "", "off"],
      ["overflow 검사", "", "off"],
      ["optimizer step", "", "off"],
    ],
    note: "실제 gradient norm을 0.5로 가정합니다. Loss를 s배 하고 backward하면 gradient도 정확히 s배가 되어 512가 됩니다. FP16에서 0으로 사라질 작은 값을 표현 범위 안으로 올리려는 단계입니다.",
  },
  {
    label: "s로 나눈 뒤 clip",
    summary: "clip은 실제 값 0.5를 봄",
    rows: [
      LOSS,
      BACKWARD,
      ["unscale (÷ s)", "512 ÷ 1024 = 0.5", "on"],
      ["clip (threshold 1.0, 가정)", "0.5 ≤ 1.0 → 그대로", "on"],
      ["overflow 검사", "", "off"],
      ["optimizer step", "", "off"],
    ],
    note: "Optimizer가 쓰기 전에 s로 나누면 원래 gradient 0.5가 돌아옵니다. Clip은 이 복원된 값에 threshold 1.0을 적용하므로 threshold가 의도한 의미를 유지합니다.",
  },
  {
    label: "Overflow가 없으면 update",
    summary: "복원된 gradient로 update",
    rows: [
      LOSS,
      BACKWARD,
      ["unscale (÷ s)", "512 ÷ 1024 = 0.5", "on"],
      ["clip (threshold 1.0, 가정)", "0.5 ≤ 1.0 → 그대로", "on"],
      ["overflow 검사", "Inf·NaN 없음", "on"],
      ["optimizer step", "gradient 0.5로 update", "on"],
    ],
    note: "Inf나 NaN이 없으면 optimizer가 복원된 gradient로 update합니다. s배 했다가 다시 s로 나눴으므로 learning rate는 바꾸지 않습니다.",
  },
  {
    label: "Overflow가 생긴 batch",
    summary: "update 건너뜀 · s 축소 가능",
    rows: [
      LOSS,
      ["backward", "g_scaled에 Inf 발생 (가정)", "bad"],
      ["unscale (÷ s)", "Inf ÷ 1024 = Inf", "bad"],
      ["clip (threshold 1.0, 가정)", "—", "off"],
      ["overflow 검사", "Inf 발견", "bad"],
      ["optimizer step", "update 건너뜀 · s를 줄일 수 있음", "skip"],
    ],
    note: "Scaled gradient가 overflow해 Inf가 되었다고 가정합니다. 이때는 update를 건너뛰고 scale s를 줄일 수 있습니다.",
  },
  {
    label: "잘못된 순서: 나누기 전에 clip",
    summary: "0.5 대신 ≈ 0.00098",
    rows: [
      LOSS,
      BACKWARD,
      ["clip (threshold 1.0, 가정)", "512 > 1.0 → 1.0으로 줄임", "bad"],
      ["unscale (÷ s)", "1.0 ÷ 1024 ≈ 0.00098", "bad"],
      ["overflow 검사", "Inf·NaN 없음", "on"],
      ["optimizer step", "gradient ≈ 0.00098로 update", "bad"],
    ],
    note: "Scaled 값 512에 threshold 1.0을 적용하면 clip이 걸립니다. 나중에 1024로 나누면 gradient는 0.5가 아니라 약 0.00098입니다. Threshold의 실제 의미가 s에 따라 바뀌어 training dynamics가 의도와 달라집니다.",
  },
] as const satisfies readonly { label: string; summary: string; rows: readonly Row[]; note: string }[];

const STATE_STYLE: Record<RowState, { box: string; tag: string; tagText: string }> = {
  on: { box: "border-[#2563eb]/60 bg-[#2563eb]/5", tag: "text-[#2563eb]", tagText: "적용" },
  off: { box: "border-border/60 text-muted-foreground/70", tag: "text-muted-foreground/70", tagText: "대기" },
  bad: { box: "border-[#dc2626]/70 bg-[#dc2626]/5", tag: "text-[#dc2626]", tagText: "문제" },
  skip: { box: "border-dashed border-[#d97706] bg-[#d97706]/5", tag: "text-[#b45309]", tagText: "건너뜀" },
};

function Figure({ sceneIndex }: { sceneIndex: number }) {
  const rows: readonly Row[] = SCENES[sceneIndex].rows;
  return (
    <ol className="space-y-1 sm:space-y-1.5" aria-label={SCENES[sceneIndex].summary}>
      {rows.map(([step, value, state], index) => {
        const style = STATE_STYLE[state];
        return (
          <li
            key={`${step}-${index}`}
            className={`grid grid-cols-[1.25rem_minmax(0,1fr)_2.75rem] items-center gap-2 rounded-lg border px-2 py-1 text-xs sm:py-1.5 sm:grid-cols-[1.5rem_11rem_minmax(0,1fr)_3rem] sm:px-3 sm:text-sm ${style.box}`}
          >
            <span className="font-mono text-[10px] text-muted-foreground">{index + 1}</span>
            <span className="min-w-0 sm:contents">
              <span className="block font-semibold sm:inline">{step}</span>
              <span className="block min-h-[1rem] break-keep font-mono text-[11px] leading-4 sm:min-h-0 sm:leading-5 sm:text-xs">{value || " "}</span>
            </span>
            <span className={`text-right text-[10px] font-bold ${style.tag}`}>{style.tagText}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function AmpClipOrderViz() {
  return (
    <SceneShell
      eyebrow="Loss scaling 순서"
      title="s로 나눈 뒤 clip해야 threshold가 실제 gradient를 봅니다"
      description="Clip은 gradient norm ‖g‖이 threshold를 넘으면 norm이 threshold가 되도록 gradient 전체를 줄이는 단계입니다. 수치는 모두 설명용 가정입니다:실제 gradient norm 0.5, loss scale s = 1024, clip threshold 1.0. 실제 s는 동적으로 바뀝니다."
      ariaLabel="AMP loss scaling에서 backward, unscale, clip, overflow 검사, optimizer step의 순서와 잘못된 순서 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene, index) => <Figure key={scene.label} sceneIndex={index} />)}
        />
      )}
    />
  );
}
