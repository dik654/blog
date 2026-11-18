import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 8점 보고와 위치를 듣고 걷기·표정을 관찰 → 맥박·영상으로 위험 신호와 원인 후보 →
 * 진통 뒤 보고 8→5, 걸음·맥박도 함께 나아지면 같은 설명을 지지하는 증거가 늘어남 →
 * 불안이 맥박을 높이거나 약물이 표정만 줄일 수 있음 → 하나의 지표를 의식 검출기로 쓰지 않고 경로·다른 원인을 기록.
 * 맥박 +20회/분, 걷기 평소의 50%, 작은 손상은 3절 수치. 진통 뒤 걸음·맥박의 크기는 본문에 없어 방향만 적습니다.
 */
type Status = "idle" | "heard" | "risk" | "support" | "other";

const LANES = ["자기 보고", "걷기", "표정", "맥박", "영상"] as const;

const STATUS_TEXT: Readonly<Record<Status, string>> = {
  idle: "아직 안 봄",
  heard: "듣고 관찰",
  risk: "위험·원인 확인",
  support: "같은 설명 지지",
  other: "다른 경로 가능",
};

const STATUS_CLASS: Readonly<Record<Status, string>> = {
  idle: "border-dashed border-border/60 text-muted-foreground/60",
  heard: "border-border text-foreground",
  risk: "border-sky-600/70 text-sky-700 dark:text-sky-400",
  support: "border-emerald-600/70 font-semibold text-emerald-700 dark:text-emerald-400",
  other: "border-dashed border-amber-600/80 font-semibold text-amber-700 dark:text-amber-400",
};

interface Lane {
  value: string;
  status: Status;
}

const SCENES: readonly { label: string; summary: string; note: string; lanes: readonly Lane[]; verdict: string }[] = [
  {
    label: "먼저 듣고 봅니다",
    summary: "보고 8/10 · 걷기·표정",
    note: "환자의 8점 보고와 통증 위치를 먼저 듣고, 걷기와 표정 변화를 관찰합니다. 맥박과 영상은 이 장면에서 아직 쓰지 않았습니다.",
    lanes: [
      { value: "8 / 10 · 위치", status: "heard" },
      { value: "평소의 50%", status: "heard" },
      { value: "변화 관찰", status: "heard" },
      { value: "—", status: "idle" },
      { value: "—", status: "idle" },
    ],
    verdict: "말과 행동으로 통증이라는 설명 후보를 세웁니다.",
  },
  {
    label: "맥박과 영상은 위험과 원인을 찾습니다",
    summary: "+20회/분 · 작은 손상",
    note: "맥박과 영상은 위험 신호와 가능한 원인을 찾는 데 씁니다. 3절처럼 8이라는 느낌을 맥박 20이나 손상 크기로 바꾸어 계산하지는 않습니다.",
    lanes: [
      { value: "8 / 10 · 위치", status: "heard" },
      { value: "평소의 50%", status: "heard" },
      { value: "변화 관찰", status: "heard" },
      { value: "+20회/분", status: "risk" },
      { value: "작은 손상", status: "risk" },
    ],
    verdict: "위험 신호와 원인 후보가 생겼지만 8의 환산값은 아닙니다.",
  },
  {
    label: "진통 뒤 함께 나아진다면",
    summary: "보고 8 → 5 · 걸음·맥박도 나아짐",
    note: "진통 뒤 보고가 8에서 5로 내려가고 걸음과 맥박도 함께 나아지면, 여러 자료가 같은 설명을 지지하므로 증거가 늘어납니다. 걸음과 맥박이 얼마나 나아졌는지는 본문에 없어 방향만 적었습니다.",
    lanes: [
      { value: "8 → 5", status: "support" },
      { value: "나아짐", status: "support" },
      { value: "변화 관찰", status: "heard" },
      { value: "나아짐", status: "support" },
      { value: "작은 손상", status: "risk" },
    ],
    verdict: "보고·걷기·맥박 세 자료가 함께 나아지면 통증이라는 같은 설명을 지지하는 증거가 늘어납니다.",
  },
  {
    label: "불안이 맥박을 높일 수 있습니다",
    summary: "맥박 ↑ ← 통증? 불안?",
    note: "자료가 늘 함께 움직이는 것은 아닙니다. 불안도 맥박을 높일 수 있으므로, 맥박이 올랐다는 사실 하나만으로 통증이 커졌다고 읽지 않습니다.",
    lanes: [
      { value: "8 / 10 · 위치", status: "heard" },
      { value: "평소의 50%", status: "heard" },
      { value: "변화 관찰", status: "heard" },
      { value: "높음 ← 불안?", status: "other" },
      { value: "작은 손상", status: "risk" },
    ],
    verdict: "맥박이 생긴 경로가 둘일 수 있어 따로 기록합니다.",
  },
  {
    label: "약물이 표정만 줄일 수 있습니다",
    summary: "표정 ↓ · 다른 자료는 그대로일 수 있음",
    note: "약물이 표정만 줄일 수도 있습니다. 표정이 평온해졌다는 자료 하나로 통증이 줄었다고 결론 내리지 않고, 다른 자료가 함께 움직였는지와 그 경로를 확인합니다.",
    lanes: [
      { value: "8 / 10 · 위치", status: "heard" },
      { value: "평소의 50%", status: "heard" },
      { value: "줄어듦 ← 약물?", status: "other" },
      { value: "+20회/분", status: "risk" },
      { value: "작은 손상", status: "risk" },
    ],
    verdict: "표정 하나만 움직였다면 통증 감소의 증거로 세지 않습니다.",
  },
  {
    label: "지표 하나를 검출기로 쓰지 않습니다",
    summary: "경로·다른 원인 기록 + 대화",
    note: "그래서 하나의 지표를 의식 검출기로 쓰기보다 각 자료가 생기는 경로와 다른 원인을 기록하고, 당사자와의 대화를 계속 고칩니다.",
    lanes: [
      { value: "대화로 고침", status: "heard" },
      { value: "경로 기록", status: "heard" },
      { value: "약물 영향 기록", status: "other" },
      { value: "불안 영향 기록", status: "other" },
      { value: "원인 후보", status: "risk" },
    ],
    verdict: "자료마다 생긴 길을 적어 두고 판단을 계속 고칩니다.",
  },
];

export default function EvidencePathViz() {
  return (
    <SceneShell
      eyebrow="7절 진료 순서"
      title="다섯 자료가 한 설명으로 모이고 어긋나는 순서"
      description="줄 하나가 진료표의 자료 하나입니다. 오른쪽 칸은 그 자료가 지금 판단에서 하는 일입니다. 수치는 3절 사례이고, 진통 뒤 걸음·맥박은 본문대로 방향만 적었습니다."
      ariaLabel="자기 보고, 걷기, 표정, 맥박, 영상 다섯 자료가 진료 순서에 따라 같은 설명을 지지하거나 다른 경로로 어긋나는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            {LANES.map((lane, index) => {
              const item = scene.lanes[index];
              return (
                <div key={lane} className="grid grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,6.75rem)] items-center gap-2 text-xs sm:grid-cols-[6rem_minmax(0,1fr)_9rem] sm:text-sm">
                  <span className="font-semibold">{lane}</span>
                  <span className={`min-w-0 rounded-md border px-2 py-1.5 font-mono ${item.status === "idle" ? "border-dashed border-border/60 text-muted-foreground/60" : "border-border"}`}>{item.value}</span>
                  <span className={`min-w-0 rounded-md border px-2 py-1.5 text-center leading-5 ${STATUS_CLASS[item.status]}`}>{STATUS_TEXT[item.status]}</span>
                </div>
              );
            })}
            <div className="mt-3 rounded-lg border border-border px-3 py-2 text-sm leading-6">
              <span className="mr-2 text-xs text-muted-foreground">판단</span>
              {scene.verdict}
            </div>
          </div>
        );
      }}
    />
  );
}
