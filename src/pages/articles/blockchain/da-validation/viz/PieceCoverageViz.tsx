import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #baseline·#experiment — 설명용 (8,4) fixture에서 D1·P4·P6·P7 네 표본이
 * 복원 임계값 4를 채우는 기준선과, 숨김·늦은 응답·bad proof·중복 응답이 각각 몇 칸을 빼는지 센다.
 * 어떤 조각을 숨기거나 늦추거나 오염시키는지는 설명용 가정이다.
 */

type SlotState = "idle" | "valid" | "missing" | "late" | "badProof" | "duplicate";

interface Scene {
  label: string;
  summary: string;
  note: string;
  slots: Record<string, SlotState>;
  outcome: string;
  forbidden: string;
}

const PIECES = ["D0", "D1", "D2", "D3", "P4", "P5", "P6", "P7"] as const;
const THRESHOLD = 4;

const SCENES: readonly Scene[] = [
  {
    label: "정상 기준선",
    summary: "서로 다른 유효 조각 4 / 4",
    note: "서로 다른 peer가 D1·P4·P6·P7을 마감 전에 돌려주고 네 proof가 모두 통과합니다. 서로 다른 유효 조각이 임계값 4를 채우므로 D0~D3을 복원하고, 복원한 digest가 원본과 같아야 기준선 receipt가 됩니다.",
    slots: { D1: "valid", P4: "valid", P6: "valid", P7: "valid" },
    outcome: "authenticity·encoding·availability PASS",
    forbidden: "—",
  },
  {
    label: "숨김",
    summary: "3 / 4 → 임계값 아래",
    note: "P7을 돌려주지 않는다고 가정합니다. 남은 D1·P4·P6은 proof가 통과해도 세 개뿐이라 임계값 4에 못 미칩니다. 기대 결과는 UNAVAILABLE과 복원 실패이며, proof 통과만 보고 AVAILABLE receipt를 남기면 기각합니다.",
    slots: { D1: "valid", P4: "valid", P6: "valid", P7: "missing" },
    outcome: "UNAVAILABLE · 복원 실패",
    forbidden: "AVAILABLE receipt",
  },
  {
    label: "늦은 응답",
    summary: "마감 안 3 / 4 · P7 late",
    note: "P7은 올바른 조각이지만 마감 뒤에 도착한다고 가정합니다. 기대 결과는 TIMEOUT이고 늦은 P7은 late로 따로 기록합니다. 이 늦은 조각을 다음 run의 표본으로 재사용하면 안 됩니다.",
    slots: { D1: "valid", P4: "valid", P6: "valid", P7: "late" },
    outcome: "TIMEOUT · late 분리",
    forbidden: "다음 run에 재사용",
  },
  {
    label: "잘못된 proof",
    summary: "P6 제외 → decoder 입력 3",
    note: "P6의 KZG·Merkle proof가 틀렸다고 가정합니다. 기대 결과는 INVALID_PROOF이고 P6은 decoder에 들어가면 안 됩니다. 그러면 decoder가 받을 수 있는 유효 조각은 D1·P4·P7 세 개입니다.",
    slots: { D1: "valid", P4: "valid", P6: "badProof", P7: "valid" },
    outcome: "INVALID_PROOF",
    forbidden: "P6을 decoder 입력으로",
  },
  {
    label: "중복 응답",
    summary: "응답 4개 · 서로 다른 조각 3",
    note: "P7 대신 P4가 두 번 도착한다고 가정합니다. 응답은 네 개지만 서로 다른 조각 번호는 D1·P4·P6 세 개뿐입니다. 중복을 새 coverage로 세어 4 / 4라고 적으면 coverage 과다 계산이고, 기대 결과는 DUPLICATE rejection입니다.",
    slots: { D1: "valid", P4: "duplicate", P6: "valid" },
    outcome: "INDEX/DUPLICATE rejection",
    forbidden: "coverage 4로 계산",
  },
];

const STATE_STYLE: Record<SlotState, { box: string; text: string; tag: string }> = {
  idle: { box: "border-dashed border-border/60", text: "text-muted-foreground/60", tag: "표본 아님" },
  valid: { box: "border-primary bg-primary/10", text: "", tag: "유효" },
  missing: { box: "border-dashed border-red-600", text: "text-red-700 dark:text-red-400", tag: "응답 없음" },
  late: { box: "border-dashed border-amber-600", text: "text-amber-700 dark:text-amber-400", tag: "마감 뒤" },
  badProof: { box: "border-red-600", text: "text-red-700 dark:text-red-400", tag: "proof 실패" },
  duplicate: { box: "border-primary bg-primary/10", text: "", tag: "유효 · 2회" },
};

const distinctValid = (scene: Scene) =>
  PIECES.filter((piece) => {
    const state = scene.slots[piece];
    return state === "valid" || state === "duplicate";
  }).length;

const responses = (scene: Scene) =>
  PIECES.reduce<number>((sum, piece) => {
    const state = scene.slots[piece];
    if (state === "duplicate") return sum + 2;
    if (state === undefined || state === "missing") return sum;
    return sum + 1;
  }, 0);

function Coverage({ index }: { index: number }) {
  const scene = SCENES[index];
  const valid = distinctValid(scene);
  const reached = valid >= THRESHOLD;
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8 sm:gap-2">
        {PIECES.map((piece) => {
          const state = scene.slots[piece] ?? "idle";
          const style = STATE_STYLE[state];
          return (
            <div key={piece} className={`flex min-h-16 flex-col items-center justify-center rounded border px-0.5 text-center ${style.box}`}>
              <span className="text-[8px] leading-3 text-muted-foreground sm:text-[9px]">{piece.startsWith("D") ? "원본" : "복원용"}</span>
              <span className={`font-mono text-sm font-bold ${style.text}`}>{piece}</span>
              <span className={`break-keep text-[8px] leading-3 sm:text-[9px] ${style.text || "text-primary"}`}>{style.tag}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-[6.5rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-[10px] sm:grid-cols-[8rem_minmax(0,1fr)_3rem] sm:text-xs">
        <span className="text-muted-foreground">받은 응답</span>
        <div className="grid grid-cols-4 gap-0.5">
          {[0, 1, 2, 3].map((slot) => (
            <div key={slot} className={`h-3 rounded-sm ${slot < responses(scene) ? "bg-muted-foreground/50" : "bg-muted/40"}`} />
          ))}
        </div>
        <span className="text-right font-mono">{responses(scene)}</span>
        <span className="font-bold">서로 다른 유효 조각</span>
        <div className="grid grid-cols-4 gap-0.5">
          {[0, 1, 2, 3].map((slot) => (
            <div key={slot} className={`h-3 rounded-sm ${slot < valid ? (reached ? "bg-primary" : "bg-amber-600") : "border border-dashed border-border bg-transparent"}`} />
          ))}
        </div>
        <span className="text-right font-mono font-bold">{valid} / {THRESHOLD}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px text-[10px] leading-4 sm:text-xs sm:leading-5">
        <div className="min-w-0 bg-background px-2 py-2">
          <span className="block text-muted-foreground">기대 결과</span>
          <strong className={`block break-keep ${reached ? "text-primary" : "text-amber-700 dark:text-amber-400"}`}>{scene.outcome}</strong>
        </div>
        <div className="min-w-0 bg-background px-2 py-2">
          <span className="block text-muted-foreground">금지할 잔류 상태</span>
          <strong className="block break-keep">{scene.forbidden}</strong>
        </div>
      </div>
    </div>
  );
}

export default function PieceCoverageViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const labels = SCENES.map((scene) => scene.label);
  return (
    <VizFrame
      eyebrow="설명용 (8,4) fixture"
      title="응답 수가 아니라 서로 다른 유효 조각 수가 임계값 4를 채워야 합니다"
      description="(8,4)는 원본 D0~D3에 복원용 P4~P7을 더해 조각 8개를 만들고, 그중 서로 다른 유효 조각 4개로 원본을 되살리는 설정입니다. 이 4가 복원 임계값이고, 4개째에서 통과합니다. 칸 하나가 조각 하나입니다."
      note="어느 조각을 숨기거나 늦추거나 오염시키는지는 설명용 가정입니다. 한 run에서는 한 경계만 바꿉니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="정상, 숨김, 늦은 응답, 잘못된 proof, 중복 응답에서 서로 다른 유효 조각 수를 세는 다섯 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-sm font-bold sm:text-base">{scene.label}</h4>
              <span className="font-mono text-xs font-bold text-primary sm:text-sm">{scene.summary}</span>
            </div>
          ))}
        />
        <div className="mt-3 min-w-0">
          <Coverage index={scenes.active} />
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-3"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-3 text-xs leading-6 text-muted-foreground sm:pl-4 sm:text-sm sm:leading-7">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} controlLabels={["정상", "숨김", "늦음", "bad proof", "중복"]} playLabel="조각 수 세기 재생" />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
