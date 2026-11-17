import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #artifact-handoff — node 27이 TreeR 계산 직후 종료된 뒤,
 * scheduler는 DB 행만 믿지 않고 artifact digest → message CID → Lotus receipt를 차례로 대조해
 * 누락된 첫 단계부터 다시 시작한다. #release-gate의 "이미 chain에 포함된 메시지는 다시 제출하지 않는다"와 이어진다.
 * 어떤 증거가 빠졌는지는 장면마다 다른 가정이다.
 */

type Evidence = "있음" | "없음" | "보지 않음";

const CHECKS = [
  { key: "digest", name: "저장 경로", evidence: "artifact digest", step: "계산" },
  { key: "cid", name: "제출 기록", evidence: "message CID", step: "제출" },
  { key: "receipt", name: "Lotus", evidence: "receipt", step: "체인 영수증" },
] as const;

const SCENES: readonly {
  label: string;
  summary: string;
  marks: readonly [Evidence, Evidence, Evidence];
  restart: number | null;
  verdict: string;
  note: string;
}[] = [
  {
    label: "DB 행만 보기",
    summary: "판단 금지",
    marks: ["보지 않음", "보지 않음", "보지 않음"],
    restart: null,
    verdict: "DB 행만으로 proof와 체인 메시지가 끝났다고 판단하지 않습니다",
    note: "Node 27이 TreeR 계산을 마친 직후 종료됐습니다. 재시작한 scheduler가 HarmonyDB 행만 보면 저장 경로와 체인에서 실제로 무엇이 끝났는지 알 수 없습니다. 그래서 세 증거를 왼쪽부터 차례로 대조합니다.",
  },
  {
    label: "digest 없음",
    summary: "계산부터 재개",
    marks: ["없음", "보지 않음", "보지 않음"],
    restart: 0,
    verdict: "첫 번째 증거가 빠졌으므로 계산 단계부터 다시 시작합니다",
    note: "저장 경로에서 artifact digest를 확인하지 못했다고 둡니다(가정). 누락된 첫 단계가 계산이므로 그 뒤의 message CID와 receipt는 따질 필요 없이 계산부터 다시 시작합니다.",
  },
  {
    label: "CID 없음",
    summary: "제출부터 재개",
    marks: ["있음", "없음", "보지 않음"],
    restart: 1,
    verdict: "계산은 끝났고 제출 기록이 없으므로 제출 단계부터 이어갑니다",
    note: "Digest는 확인됐지만 제출한 message CID가 없다고 둡니다(가정). 이미 확인한 계산 결과는 반복하지 않고, 누락된 첫 단계인 제출부터 이어갑니다.",
  },
  {
    label: "receipt 없음",
    summary: "receipt 확인부터",
    marks: ["있음", "있음", "없음"],
    restart: 2,
    verdict: "제출 기록은 있고 receipt가 없으므로 체인 영수증 단계부터 이어갑니다",
    note: "Digest와 message CID는 있지만 같은 CID의 Lotus receipt를 아직 찾지 못했다고 둡니다(가정). 제출 응답만으로는 체인 반영이 아니므로 누락된 첫 단계는 체인 영수증입니다.",
  },
  {
    label: "셋 다 있음",
    summary: "재제출 없음",
    marks: ["있음", "있음", "있음"],
    restart: null,
    verdict: "이미 chain에 포함된 메시지는 다시 제출하지 않습니다",
    note: "세 증거가 모두 같은 sector 42와 message를 가리킨다고 둡니다(가정). 그 메시지는 이미 chain에 포함됐으므로 다시 제출하지 않습니다. 다시 내면 중복 외부 효과가 생길 수 있고, 남은 일이 있다면 확인되지 않은 로컬 단계만 영수증에서 재개합니다.",
  },
];

function markClass(mark: Evidence, isRestart: boolean) {
  if (isRestart) return "border-red-600 bg-red-600/10";
  if (mark === "있음") return "border-primary bg-primary/10";
  if (mark === "없음") return "border-red-600/60 bg-background";
  return "border-dashed border-border bg-background";
}

export default function RecoveryCheckViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200, { loop: false });
  const labels = SCENES.map((scene) => scene.label);

  return (
    <VizFrame
      eyebrow="node 27 종료 뒤 재개 · sector 42"
      title="세 증거를 왼쪽부터 대조해 처음 빠진 단계에서 다시 시작합니다"
      description="칸 하나가 증거 하나입니다. 빨간 칸이 재개 지점이고, 그 오른쪽은 아직 따지지 않습니다."
      note="어떤 증거가 빠졌는지는 장면마다 둔 가정입니다. 대조 순서와 재제출 금지는 본문 02·04절의 설명을 따릅니다."
      documentFlow
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        role="group"
        aria-label="종료된 작업을 재개할 때 세 증거를 대조하는 분기"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="space-y-3">
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-1.5 sm:gap-3">
                {CHECKS.map((check, index) => {
                  const mark = scene.marks[index];
                  const isRestart = scene.restart === index;
                  return [
                    <div key={check.key} className={`min-w-0 rounded-lg border p-2 sm:p-3 ${markClass(mark, isRestart)}`}>
                      <p className="text-[10px] text-muted-foreground sm:text-[11px]">{index + 1}. {check.name}</p>
                      <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{check.evidence}</strong>
                      <p className={`mt-1 text-xs font-bold ${mark === "있음" ? "text-primary" : mark === "없음" ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>{mark}</p>
                      <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:text-[11px]">{isRestart ? `여기서 재개 · ${check.step}` : `단계: ${check.step}`}</p>
                    </div>,
                    index < CHECKS.length - 1 ? <span key={`${check.key}-arrow`} aria-hidden="true" className="self-center text-sm text-muted-foreground">→</span> : null,
                  ];
                })}
              </div>
              <p className={`rounded-lg border px-3 py-2 text-sm font-semibold leading-6 ${scene.restart === null ? "border-border" : "border-red-600/60"}`}>{scene.verdict}</p>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{scene.note}</p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
