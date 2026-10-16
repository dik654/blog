import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * (가정) 1,000대 fleet에 같은 OS 패키지 변경을 두 방식으로 넣는다.
 * 한 mechanism: 타이머는 한 시간 안에 전부 바꾸고 비교 대상이 없지만,
 * 단계적 롤아웃은 canary ↔ control 비교라는 문(gate)을 통과해야 다음 단계로 간다.
 * drift 감지기는 파이프라인 밖에서 바뀐 노드(desired ≠ actual)를 따로 표시한다.
 */
const CELLS = 100; // 칸 하나 = 10대

type CellState = "idle" | "changed" | "bad" | "drift" | "rolledback";

interface Scene {
  label: string;
  changed: number; // 변경 칸 수(앞에서부터)
  bad?: boolean; // 변경 칸이 나쁜 상태
  drift?: readonly number[];
  gate: string;
  gateOk: boolean | null;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "타이머 방식 · 06:00~07:00",
    changed: CELLS,
    gate: "문 없음 — 비교 대상 없음",
    gateOk: null,
    note: "apt-daily-upgrade.timer는 06:00에 최대 60분 무작위 지연으로 돕니다. 1,000대가 한 시간 안에 모두 바뀌고, 바뀌지 않은 비교 대상이 없어 '패치 때문인지'를 지표로 가를 수 없습니다. Datadog는 이렇게 06:00~07:00 UTC에 전 지역 노드의 60% 이상이 네트워크를 잃었습니다.",
  },
  {
    label: "1단계 · canary 1%",
    changed: 1,
    gate: "canary 오류율 0.9% vs control 1.0% — 통과",
    gateOk: true,
    note: "같은 변경을 10대(1%)에만 넣고 하루를 재웁니다(bake). 나머지 990대가 control입니다. 비교하는 지표는 사용자 쪽 증상(오류율·p99 지연)과 노드 쪽 원인(재시작·PSI·drop)입니다. 차이가 없으면 다음 단계로 갑니다.",
  },
  {
    label: "2단계 · 10%",
    changed: 10,
    gate: "canary 1.1% vs control 1.0% — 통과",
    gateOk: true,
    note: "100대로 넓힙니다. 표본이 10배라 1%에서는 안 보이던 드문 결함(특정 커널·특정 인스턴스 타입)이 드러날 수 있습니다. SRE workbook은 단계마다 '이 단계에서 가장 확실히 보이는 지표'를 고르라고 적습니다.",
  },
  {
    label: "3단계 · 50% — 문이 막음",
    changed: 50,
    bad: true,
    gate: "canary 오류율 20% vs control 1% — 중단·롤백",
    gateOk: false,
    note: "500대에서 오류율이 20%로 뛰었습니다. 전체로 보면 0.5 × 20% + 0.5 × 1% = 10.5%지만 canary와 control을 나눠 보면 차이가 선명합니다. 롤아웃은 여기서 멈추고 500대를 되돌립니다. 영향 범위(blast radius)가 50%에서 끝난 것이 이 방식의 값어치입니다.",
  },
  {
    label: "drift 감지 · 파이프라인 밖 변경",
    changed: 0,
    drift: [23, 57, 81],
    gate: "desired ≠ actual 3칸 — unattended-upgrades 흔적",
    gateOk: false,
    note: "롤아웃을 다 되돌렸는데 세 칸(30대)의 systemd 버전이 나머지와 다릅니다. 파이프라인이 아니라 노드 안의 타이머가 바꾼 것입니다. 구성 관리 도구가 '원하는 상태'와 '실제 상태'를 주기적으로 비교해 이런 drift를 찾아내야 두 번째 변경 경로를 닫을 수 있습니다.",
  },
];

const COLOR: Record<CellState, string> = {
  idle: "#e2e8f0",
  changed: "#2563eb",
  bad: "#dc2626",
  drift: "#f59e0b",
  rolledback: "#cbd5e1",
};

export default function StagedRolloutViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const scene = SCENES[scenes.active];
  const stateOf = (i: number): CellState => {
    if (scene.drift?.includes(i)) return "drift";
    if (i < scene.changed) return scene.bad ? "bad" : "changed";
    if (scene.drift) return "rolledback";
    return "idle";
  };
  const gateColor = scene.gateOk === null ? "#64748b" : scene.gateOk ? "#16a34a" : "#dc2626";

  return (
    <VizFrame
      eyebrow="Staged rollout · 1,000 nodes"
      title="한 시간에 전부 바꾸는 타이머와, 문을 통과해야 넓어지는 단계적 롤아웃은 영향 범위가 다릅니다"
      description="칸 하나가 노드 10대입니다. 파랑은 변경이 들어간 노드, 빨강은 변경 뒤 나빠진 노드, 주황은 파이프라인 밖에서 바뀐 노드(drift)입니다. 아래 문(gate)은 canary와 control의 지표 비교입니다."
      note="(가정) 1,000대·오류율 수치는 설명용입니다. 단계 비율 1 → 10 → 50 → 100%와 하루 bake는 흔한 예시이지 표준이 아닙니다. canary·control 정의는 SRE workbook 16장을 따랐습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="1,000대 fleet의 타이머 방식과 단계적 롤아웃 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="grid">
            {SCENES.map((s, i) => (
              <h4 key={s.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 text-base font-bold ${i === scenes.active ? "" : "invisible"}`}>
                {s.label}
              </h4>
            ))}
          </div>

          {/* 100칸 격자는 넓은 화면에서 커지지 않도록 폭을 묶는다(1440에서 세로 공간을 먹지 않게) */}
          <div className="mx-auto mt-3 grid w-full max-w-[26rem] grid-cols-[repeat(20,minmax(0,1fr))] gap-[2px]" role="img" aria-label={`변경 ${scene.changed}칸, drift ${scene.drift?.length ?? 0}칸`}>
            {Array.from({ length: CELLS }, (_, i) => (
              <div
                key={i}
                className="aspect-square rounded-[2px] transition-colors duration-300"
                style={{ backgroundColor: COLOR[stateOf(i)] }}
              />
            ))}
          </div>

          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            {(["idle", "changed", "bad", "drift"] as const).map((k) => (
              <li key={k} className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLOR[k] }} />
                {k === "idle" ? "control(미변경)" : k === "changed" ? "변경됨" : k === "bad" ? "변경 뒤 오류" : "drift"}
              </li>
            ))}
          </ul>

          {/* 문(gate) 문구는 장면마다 길이가 달라 같은 칸에 겹쳐 둔다 */}
          <div className="mt-3 grid rounded-sm border px-3 py-2 font-mono text-xs transition-colors duration-300" style={{ borderColor: gateColor }}>
            {SCENES.map((s, i) => {
              const c = s.gateOk === null ? "#64748b" : s.gateOk ? "#16a34a" : "#dc2626";
              return (
                <div key={s.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 flex items-center gap-2 ${i === scenes.active ? "" : "invisible"}`}>
                  <span className="font-black" style={{ color: c }}>
                    {s.gateOk === null ? "—" : s.gateOk ? "PASS" : "STOP"}
                  </span>
                  <span className="min-w-0 text-foreground">{s.gate}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 grid border-l border-primary/50 pl-4">
            {SCENES.map((s, i) => (
              <p key={s.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 text-sm leading-6 text-muted-foreground ${i === scenes.active ? "" : "invisible"}`}>
                {s.note}
              </p>
            ))}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
