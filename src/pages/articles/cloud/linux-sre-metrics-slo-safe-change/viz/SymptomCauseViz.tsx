import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * (가정) 서버 100대 위의 API 서비스에서 한 장애가 진행되는 동안 '원인 지표'와 '증상 지표'가 각각 언제 움직이는지 그린다.
 * 한 mechanism: 호출(page)은 사용자가 겪는 증상(SLI가 SLO를 깎는 속도)에 걸고,
 * 노드 지표(PSI·디스크·OOM)는 호출된 사람이 '왜'를 찾는 대시보드로 쓴다.
 */
interface Cause {
  name: string;
  value: string;
  hot: boolean;
}

interface Scene {
  label: string;
  minute: string;
  sli: number; // 성공률 %
  p99: string;
  page: boolean;
  causes: readonly Cause[];
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "평상시",
    minute: "T+0",
    sli: 99.95,
    p99: "180 ms",
    page: false,
    causes: [
      { name: "노드 PSI cpu some", value: "3%", hot: false },
      { name: "디스크 사용률", value: "61%", hot: false },
      { name: "OOM kill", value: "0", hot: false },
      { name: "재시작 수", value: "0", hot: false },
    ],
    note: "SLI는 성공한 요청의 비율과 p99 지연입니다. SLO가 30일 99.9%라면 지금은 budget을 거의 쓰지 않는 상태입니다. 원인 지표 네 개는 대시보드에만 있고 아무것도 호출하지 않습니다.",
  },
  {
    label: "원인만 움직임",
    minute: "T+5분",
    sli: 99.94,
    p99: "190 ms",
    page: false,
    causes: [
      { name: "노드 PSI cpu some", value: "3%", hot: false },
      { name: "디스크 사용률", value: "94%", hot: true },
      { name: "OOM kill", value: "0", hot: false },
      { name: "재시작 수", value: "0", hot: false },
    ],
    note: "한 노드의 로그 디스크가 94%까지 찼습니다. 아직 사용자는 아무것도 못 느낍니다. 여기서 호출하면 새벽에 사람을 깨우고도 할 일이 '지켜보기'뿐이라 경보 피로가 쌓입니다. SRE 책은 '임박하고 확실한' 원인만 호출 대상으로 삼으라고 적습니다. 디스크는 '4시간 뒤 가득 찬다'는 예측이 있으니 ticket으로 보냅니다.",
  },
  {
    label: "증상이 나타남 · 호출",
    minute: "T+40분",
    sli: 98.5,
    p99: "2,400 ms",
    page: true,
    causes: [
      { name: "노드 PSI cpu some", value: "3%", hot: false },
      { name: "디스크 사용률", value: "100%", hot: true },
      { name: "OOM kill", value: "0", hot: false },
      { name: "재시작 수", value: "12", hot: true },
    ],
    note: "디스크가 가득 차자 그 노드의 앱이 로그를 못 써 죽고 재시작을 반복합니다. 성공률이 98.5%로 떨어져 오류율 1.5% ÷ 0.1% = 소진율 15가 1시간 창 임계 14.4를 넘었고, 이때 호출이 울립니다. 호출 문구는 '디스크 꽉 참'이 아니라 'API 성공률 SLO 소진'입니다. 원인이 무엇이든 사용자가 겪는 일이 기준이기 때문입니다.",
  },
  {
    label: "호출받은 사람이 원인 보드로",
    minute: "T+42분",
    sli: 98.5,
    p99: "2,400 ms",
    page: true,
    causes: [
      { name: "노드 PSI cpu some", value: "3%", hot: false },
      { name: "디스크 사용률", value: "100%", hot: true },
      { name: "OOM kill", value: "0", hot: false },
      { name: "재시작 수", value: "12", hot: true },
    ],
    note: "on-call은 증상 경보에서 출발해 원인 대시보드로 내려갑니다. 네 지표 가운데 디스크와 재시작이 빨갛고 PSI·OOM은 조용하니, 리눅스 디스크 글의 '지운 파일을 붙잡은 프로세스' 진단으로 바로 갑니다. 원인 지표가 '왜'를 빨리 찾게 해 주는 자리가 여기입니다.",
  },
  {
    label: "한 층의 증상은 다른 층의 원인",
    minute: "T+60분",
    sli: 99.91,
    p99: "210 ms",
    page: false,
    causes: [
      { name: "노드 PSI cpu some", value: "3%", hot: false },
      { name: "디스크 사용률", value: "58%", hot: false },
      { name: "OOM kill", value: "0", hot: false },
      { name: "재시작 수", value: "12 (멈춤)", hot: false },
    ],
    note: "복구됐습니다. 이 서비스 팀에게 '노드 디스크 100%'는 원인이었지만, 노드를 운영하는 플랫폼 팀에게는 그것이 자기 SLI(노드 가용 디스크)의 증상입니다. SRE 책이 말하는 '한 사람의 증상은 다른 사람의 원인'이고, 층마다 자기 사용자가 겪는 것을 SLI로 삼으면 됩니다.",
  },
];

export default function SymptomCauseViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const scene = SCENES[scenes.active];
  const sliColor = scene.sli < 99.9 ? "#dc2626" : "#16a34a";

  return (
    <VizFrame
      eyebrow="Symptom vs cause"
      title="호출은 사용자가 겪는 증상에 걸고, 서버 지표는 왜를 찾는 자리에 둡니다"
      description="왼쪽은 사용자 쪽 SLI(성공률·p99)와 호출 여부, 오른쪽은 같은 시각의 노드 원인 지표입니다. 빨간 칩은 임계를 넘은 지표입니다."
      note="(가정) 서버 100대 위의 API, 30일 SLO 99.9%. 소진율 14.4(1시간 창)·6(6시간)·1(3일)의 다중 창 경보 표는 Kubernetes SRE 글에서 다룹니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="장애 진행 중 증상 지표와 원인 지표의 움직임"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3rem] items-baseline justify-between gap-3 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-xs text-muted-foreground">{scene.minute}</span>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]">
            <div className="rounded-sm border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">증상 · 사용자가 겪는 것</p>
              <dl className="mt-2 space-y-2 font-mono text-xs">
                <div>
                  <dt className="text-muted-foreground">성공률 (SLI)</dt>
                  <dd className="text-lg font-black tabular-nums" style={{ color: sliColor }}>
                    {scene.sli.toFixed(2)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">p99 지연</dt>
                  <dd className="font-bold tabular-nums text-foreground">{scene.p99}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">SLO 99.9% · 호출</dt>
                  <dd className="font-black" style={{ color: scene.page ? "#dc2626" : "#64748b" }}>
                    {scene.page ? "PAGE" : "조용"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-sm border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">원인 · 서버가 보여 주는 것 (대시보드)</p>
              <ul className="mt-2 grid grid-cols-2 gap-2">
                {scene.causes.map((c) => (
                  <li
                    key={c.name}
                    className="rounded-sm border px-2 py-1.5 transition-colors duration-300"
                    style={{ borderColor: c.hot ? "#dc2626" : "#e2e8f0", backgroundColor: c.hot ? "#fee2e2" : "transparent" }}
                  >
                    <p className="text-[10px] leading-tight text-muted-foreground">{c.name}</p>
                    <p className="font-mono text-sm font-bold tabular-nums" style={{ color: c.hot ? "#991b1b" : undefined }}>
                      {c.value}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-4 min-h-[16rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[13rem] sm:min-h-[7rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
