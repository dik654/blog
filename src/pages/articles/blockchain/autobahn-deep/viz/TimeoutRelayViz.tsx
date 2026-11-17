import AutobahnSceneShell from "./AutobahnSceneShell";

/**
 * 본문 대응: #commit-recovery Timeout 문단 — 진행이 없으면 f+1개 Timeout이 모이고(그중 적어도 하나는 정상),
 * 다른 복제본도 같은 view의 Timeout을 퍼뜨리며, 2f+1개가 모이면 TC가 다음 view를 연다.
 * n=4, f=1: f+1=2, 2f+1=3. 누가 먼저 보내는지는 가정이다.
 */
const N = 4;
const RELAY = 2; // f+1
const TC = 3; // 2f+1

interface TimeoutScene {
  label: string;
  summary: string;
  note: string;
  /** 복제본별 상태: 0 없음, 1 스스로 Timeout, 2 보고 따라 퍼뜨림 */
  states: readonly number[];
  tc: boolean;
}

const SCENES: readonly TimeoutScene[] = [
  {
    label: "진행 없음 · 첫 Timeout",
    summary: "1개 < f+1",
    note: "R1이 view 진행이 멈췄다고 보고 Timeout을 보냅니다(누가 먼저인지는 가정). 한 개뿐이면 Byzantine 한 명의 거짓 불만일 수도 있습니다.",
    states: [1, 0, 0, 0],
    tc: false,
  },
  {
    label: "f+1개 → 정상 불만 확인",
    summary: "2개 = f+1",
    note: "Timeout이 둘(f+1)이 되면 Byzantine은 많아야 하나이므로 적어도 하나는 정상 복제본의 불만입니다. 이를 본 다른 복제본도 같은 view의 Timeout을 퍼뜨릴 근거가 생깁니다.",
    states: [1, 1, 0, 0],
    tc: false,
  },
  {
    label: "퍼뜨림 → 2f+1개 → TC",
    summary: "3개 = 2f+1 → TC",
    note: "R3가 f+1개를 보고 Timeout을 퍼뜨려 셋(2f+1)이 모이면 타임아웃 인증서(TC)가 됩니다. R4는 이 예에서 보내지 않는다고 둡니다(가정).",
    states: [1, 1, 2, 0],
    tc: true,
  },
  {
    label: "TC로 다음 view",
    summary: "새 주 노드가 후보 선택",
    note: "TC가 다음 view를 여는 표가 됩니다. 새 주 노드는 TC 안의 가장 높은 PrepareQC와 f+1개 보고서에 반복해 나타난 가장 높은 제안을 비교하고, 논문의 우선순위 규칙으로 안전한 후보를 고릅니다.",
    states: [1, 1, 2, 0],
    tc: true,
  },
];

const STATE_LABEL: readonly string[] = ["보내지 않음", "Timeout", "따라 퍼뜨림"];
const STATE_CLASS: readonly string[] = [
  "border-dashed border-border/60 text-muted-foreground/50",
  "border-primary bg-primary text-primary-foreground",
  "border-primary bg-primary/15 text-primary",
];

export default function TimeoutRelayViz() {
  return (
    <AutobahnSceneShell
      eyebrow="view 교체 · n=4, f=1"
      title="Timeout이 2개면 퍼지기 시작하고 3개면 다음 view를 엽니다"
      description="칸 하나가 복제본 하나입니다. 막대의 두 기준선은 f+1=2(정상 불만이 적어도 하나)와 2f+1=3(타임아웃 인증서 TC)입니다."
      ariaLabel="Timeout 메시지가 f+1개, 2f+1개를 넘어 TC와 다음 view가 되는 네 장면"
      playLabel="view 교체 과정 재생"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const count = scene.states.filter((state) => state > 0).length;
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {scene.states.map((state, index) => (
                <div key={index} className={`min-w-0 rounded-lg border px-1 py-2 text-center ${STATE_CLASS[state] ?? STATE_CLASS[0]}`}>
                  <p className="text-sm font-black">R{index + 1}</p>
                  <p className="break-keep text-[10px] font-semibold leading-4 sm:text-[11px]">{STATE_LABEL[state] ?? STATE_LABEL[0]}</p>
                </div>
              ))}
            </div>
            <div className="min-w-0">
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: N }, (_, index) => (
                  <span key={index} className={`h-3 rounded-sm ${index < count ? "bg-primary" : "bg-muted"}`} />
                ))}
              </div>
              <div className="mt-1 grid grid-cols-4 gap-1 text-[10px] font-semibold text-muted-foreground sm:text-[11px]">
                {Array.from({ length: N }, (_, index) => (
                  <span key={index} className={`text-right ${index + 1 === RELAY || index + 1 === TC ? "text-amber-700 dark:text-amber-400" : ""}`}>
                    {index + 1 === RELAY ? "f+1 ▲" : index + 1 === TC ? "2f+1 ▲" : ""}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <p className={`rounded-lg border px-2 py-2 font-bold ${scene.tc ? "border-primary text-primary" : "border-dashed border-border text-muted-foreground"}`}>
                {scene.tc ? "TC 생성 ✓" : `TC까지 ${TC - count}개 남음`}
              </p>
              <p className={`rounded-lg border px-2 py-2 font-bold ${active === 3 ? "border-primary text-primary" : "border-dashed border-border text-muted-foreground"}`}>
                {active === 3 ? "다음 view 시작" : "현재 view 유지"}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
