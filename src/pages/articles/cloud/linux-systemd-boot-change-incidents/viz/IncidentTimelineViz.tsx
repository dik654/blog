import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * Datadog 2023-03-08 장애를 2020년의 기본값 변경부터 2023-03-10 복구까지 사건 순서로 놓는다.
 * 한 mechanism: 같은 networkd 동작이 Datadog의 22.04 노드에서 '부팅 경로'로는 넉 달 동안 아무 일도 하지 않다가 '재시작 경로'가 처음 열린 날 터졌다.
 */
const LABELS = ["v248", "v249", "22.04 배포", "패치 공개", "06시 설치", "클라우드 반응", "복구"] as const;

type Path = "부팅 경로" | "재시작 경로" | "변경" | "복구";

const EVENTS: readonly { when: string; title: string; path: Path; note: string }[] = [
  {
    when: "2020-12",
    title: "networkd가 시작할 때 모르는 IP 규칙을 지우기 시작",
    path: "변경",
    note: "systemd v248에서 systemd-networkd가 시작할 때 자기가 모르는 IP 규칙을 지우도록 바뀌었습니다. 이 변경은 v247까지 backport됐습니다.",
  },
  {
    when: "2021 (v249)",
    title: "ManageForeignRoutingPolicyRules= 추가, 기본 yes",
    path: "변경",
    note: "약 다섯 달 뒤 v249에서 이 동작을 끌 수 있는 설정이 생겼습니다. 기본값은 계속 지우는 쪽(yes)입니다.",
  },
  {
    when: "2022-04 ~ 11",
    title: "Ubuntu 22.04(systemd 249) 시험 뒤 운영 배포",
    path: "부팅 경로",
    note: "22.04는 2022년 4월에 나왔고 Datadog은 6월에 시험, 11월에 운영 배포를 시작했습니다. 새 노드는 networkd가 Cilium보다 먼저 떠서 지울 규칙이 없었습니다. 2023-03-08에는 22.04가 함대의 90% 이상이었습니다.",
  },
  {
    when: "2023-03-07",
    title: "USN-5928-1, systemd 249.11-0ubuntu3.7 공개",
    path: "변경",
    note: "systemd CVE 패치가 Ubuntu 저장소에 올라왔습니다. apt-daily.timer가 06·18시에 최대 12시간 무작위 지연으로 내려받습니다. Google Cloud 노드에는 18:50 UTC쯤 보였을 것으로 Datadog은 추정합니다.",
  },
  {
    when: "2023-03-08 06:00–07:00",
    title: "unattended-upgrade가 패치 설치 → networkd 재시작",
    path: "재시작 경로",
    note: "apt-daily-upgrade.timer는 매일 06:00 UTC에 최대 60분 무작위 지연으로 실행됩니다. 패치 설치가 systemd 구성 요소를 재시작했고 networkd가 Cilium 규칙을 지웠습니다. 내부 모니터링이 3분 뒤 알렸고 06:31에 공개 장애가 됐습니다.",
  },
  {
    when: "06:00–08:00",
    title: "AWS는 노드를 교체, GCP·Azure는 그대로 둠",
    path: "재시작 경로",
    note: "AWS는 상태 검사에 실패한 인스턴스를 종료하고 교체해 06–07시에 10분마다 8% 넘게, 08:00까지 약 60%를 바꿨습니다. 로컬 디스크 데이터도 함께 사라졌습니다. GCP·Azure는 망만 끊긴 인스턴스를 그대로 둬 재부팅으로 복구했습니다.",
  },
  {
    when: "03-08 09:13 → 03-10 06:25",
    title: "웹 접속 → 첫 주요 서비스 → 전 서비스 → backfill",
    path: "복구",
    note: "09:13 UTC에 웹 접속이 돌아왔고 16:44에 첫 주요 서비스, 3월 9일 08:58에 모든 지역의 모든 서비스가 정상화됐습니다. 과거 데이터 backfill까지 끝난 것은 3월 10일 06:25입니다.",
  },
];

const PATH_STYLE: Record<Path, string> = {
  변경: "border-border",
  "부팅 경로": "border-emerald-600/60",
  "재시작 경로": "border-rose-600/70",
  복구: "border-sky-600/60",
};

export default function IncidentTimelineViz() {
  const scenes = useAnimatedScenes(EVENTS.length, 4500);
  const active = scenes.active;
  const event = EVENTS[active];

  return (
    <VizFrame
      eyebrow="Incident timeline"
      title="부팅 경로로는 넉 달 무사했고 재시작 경로는 한 시간 만에 터졌습니다"
      description="행 하나가 사건 하나입니다. 테두리는 그 사건이 바꾼 코드, 부팅 때 실행된 경로, 실행 중 재시작 경로, 복구 중 무엇에 속하는지 나타냅니다."
      note="날짜·시각은 Datadog 사후 보고서 두 편(2023-05-16, 2023-05-24)과 Ubuntu USN-5928-1에서 옮겼습니다. 시각은 모두 UTC입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="systemd-networkd 장애 사건 순서"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <p className="text-[11px] font-black text-primary">Scene · {String(active + 1).padStart(2, "0")}</p>
          <ol className="mt-2 space-y-1.5" aria-label="사건 목록">
            {EVENTS.map((item, index) => (
              <li
                key={item.when}
                aria-current={index === active ? "step" : undefined}
                className={`grid grid-cols-1 gap-1 rounded-md border-l-2 px-3 py-1.5 sm:grid-cols-[10rem_minmax(0,1fr)_6rem] sm:items-center ${PATH_STYLE[item.path]} ${
                  index === active ? "bg-primary/[0.07] font-semibold" : index > active ? "text-muted-foreground opacity-60" : "text-muted-foreground"
                }`}
              >
                <span className="font-mono text-[11px]">{item.when}</span>
                <span className="min-w-0 break-words text-xs">{item.title}</span>
                <span className="text-[11px] sm:text-right">{item.path}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 min-h-[12rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[10.5rem] sm:min-h-[5.25rem]">
            {event.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} />
      </div>
    </VizFrame>
  );
}
