import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 마지막 초록불 바로 다음의 첫 빨간불을 찾는다.
 * 여섯 전환과 owner·증거는 mechanism 절 장부(kubernetesData.ts ledger)에서, 네 증상과 조사 대상은 picture 절 두 문단에서 가져왔다.
 */
const TRANSITIONS = [
  { step: "요청 → 저장된 의도", owner: "API front door와 저장소", evidence: "kubectl 응답·object generation" },
  { step: "미배치 → node 선택", owner: "배치 담당(scheduler)", evidence: "PodScheduled condition·event" },
  { step: "node 선택 → sandbox", owner: "node 안 실행 담당(kubelet)·container runtime", evidence: "kubelet journal·runtime status" },
  { step: "sandbox → network·volume", owner: "network·storage plugin", evidence: "Pod IP·mount event·plugin log" },
  { step: "process → Ready", owner: "애플리케이션 준비 확인(probe)", evidence: "container log·readiness condition" },
  { step: "Ready → client", owner: "Service·DNS·Gateway 경로", evidence: "EndpointSlice·DNS·request trace" },
] as const;

const SCENES = [
  {
    label: "Pod에 node 이름이 없음",
    summary: "첫 빨간불 · 2번 전환",
    red: 1,
    look: "배치 condition과 event",
    note: "아직 실행할 자리를 고르지 못했으므로 container log를 볼 때가 아닙니다. 뒤의 Pending Pod 추적 실습 예시 출력(실측 아님)에서 세 번째 checkout Pod는 PodScheduled=False와 Insufficient cpu로 이 전환에서 멈춥니다.",
  },
  {
    label: "node는 정해졌지만 실행 공간이 없음",
    summary: "첫 빨간불 · 3번 전환",
    red: 2,
    look: "node 안의 실행 담당자",
    note: "배치까지는 성공했습니다. sandbox는 container가 돌 실행 공간이며, 이것이 없으면 node 안의 실행 담당자와 runtime을 봅니다.",
  },
  {
    label: "container는 돌지만 준비 확인 실패",
    summary: "첫 빨간불 · 5번 전환",
    red: 4,
    look: "애플리케이션과 그 의존 서비스",
    note: "process가 실행됐다는 사실과 요청을 받을 준비가 됐다는 사실은 다릅니다. 준비 확인을 통과하지 못한 Pod 주소는 요청 대상 목록에 들어가지 않습니다.",
  },
  {
    label: "Pod는 Ready인데 사용자 요청만 실패",
    summary: "첫 빨간불 · 6번 전환",
    red: 5,
    look: "요청 대상 목록 → 이름 해석 → Service 경로 → 통신 허용 규칙",
    note: "Pod 쪽 전환은 모두 초록불입니다. 이제는 요청 대상 목록, 이름 해석, Service 경로, 통신 허용 규칙을 이 순서대로 봅니다.",
  },
] as const;

type Light = "green" | "red" | "unknown";

const LIGHT_STYLE: Record<Light, { mark: string; ring: string; text: string; word: string }> = {
  green: { mark: "✓", ring: "border-[#16a34a] text-[#15803d] dark:text-[#4ade80]", text: "text-foreground", word: "통과" },
  red: { mark: "✕", ring: "border-[#dc2626] bg-[#dc2626]/10 text-[#b91c1c] dark:text-[#f87171]", text: "font-bold text-foreground", word: "첫 실패" },
  unknown: { mark: "–", ring: "border-dashed border-border text-muted-foreground", text: "text-muted-foreground", word: "아직 판단 못 함" },
};

export default function FirstRedLightViz() {
  return (
    <SceneShell
      eyebrow="첫 빨간불 찾기"
      title="증상마다 마지막 초록불이 다른 자리에 섭니다"
      description="Pod 하나가 요청을 받기까지의 여섯 전환을 위에서 아래로 놓고, 이 절이 드는 네 증상에서 어디까지 통과했는지 표시했습니다. 모든 장애의 정답표가 아니라 조사 범위를 먼저 줄이는 지도입니다."
      ariaLabel="네 가지 증상별로 여섯 전환 가운데 통과한 전환과 첫 실패 전환"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const red = scene.red;
        const failed = TRANSITIONS[red];
        return (
          <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start md:gap-6">
            <ol className="min-w-0 space-y-1">
              {TRANSITIONS.map((item, index) => {
                const light: Light = index < red ? "green" : index === red ? "red" : "unknown";
                const style = LIGHT_STYLE[light];
                return (
                  <li key={item.step} className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-3">
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border text-sm font-bold ${style.ring}`}
                    >
                      {style.mark}
                    </span>
                    <div className="min-w-0">
                      <p className={`flex flex-wrap items-baseline gap-x-2 text-sm leading-6 ${style.text}`}>
                        <span>
                          {index + 1}. {item.step}
                        </span>
                        <span className="text-xs font-normal text-muted-foreground">{style.word}</span>
                      </p>
                      <p className="text-xs leading-5 text-muted-foreground">{item.owner}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <StableSceneStack
              active={active}
              scenes={SCENES.map((item) => (
                <div key={item.label} className="rounded-lg border border-dashed border-[#dc2626] p-3 text-sm leading-6">
                  <p>
                    <span className="font-bold text-foreground">먼저 볼 곳 · </span>
                    {item.look}
                  </p>
                  <p className="text-xs leading-5 text-muted-foreground">증거 · {TRANSITIONS[item.red].evidence}</p>
                </div>
              ))}
            />
            <p className="sr-only">
              현재 장면의 첫 실패 전환은 {red + 1}번 {failed.step}입니다.
            </p>
          </div>
        );
      }}
    />
  );
}
