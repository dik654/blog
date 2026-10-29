import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "Bundle 고정",
  "Fixture 고정",
  "경로별 실행",
  "값·오류 대조",
  "실패 주입",
  "채택·복구",
] as const;

const NOTES = [
  "먼저 package 0.1.0-alpha.13, commit b4ad096e, peer dependency, endpoint 역할, bypass flag와 signer wiring을 한 manifest로 고정합니다.",
  "같은 chain ID·block hash·address·filter·transaction hash를 모든 adapter에 넣습니다. latest처럼 실행마다 움직이는 입력은 비교 기준으로 쓰지 않습니다.",
  "raw RPC, Helios 기본, Helios getLogs 우회와 실제로 평가할 adapter를 각각 실행합니다. 각 결과에 adapter·backend·bypass·block identity를 붙입니다.",
  "공통 타입으로 바꾼 값뿐 아니라 unsupported·timeout·RPC error를 같은 분류로 대조합니다. 값이 같아도 요구한 검증 경로가 아니면 통과가 아닙니다.",
  "Stalled receipt RPC, reverted receipt, verified 경로 오류와 우회 설정 오염을 별도 fixture로 넣습니다. Timeout은 transaction 실패로 바꾸지 않고, 이미 진행 중인 RPC도 취소됐다고 기록하지 않습니다.",
  "정확성·오류·신뢰 경로·rollback이 모두 통과한 run만 후보가 됩니다. 대상 환경 측정이 없으면 proposed로 남기고 이전 bundle과 signer wiring으로 되돌립니다.",
] as const;

const ROWS = [
  { name: "고정 입력", values: ["version·commit", "chain·block", "같음", "같음", "같음", "manifest"] },
  { name: "실제 경로", values: ["아직 없음", "아직 없음", "adapter별", "receipt에 기록", "오류 경로", "승인 기록"] },
  { name: "판정", values: ["준비", "준비", "실행 중", "대조", "중단 조건", "proposed"] },
] as const;

export default function KohakuValidationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="한 bundle의 검증 경로"
      title="버전을 고정한 뒤 같은 입력을 재생하고, 실패까지 통과해야 채택 후보가 됩니다"
      description="검증 순서를 여섯 장면으로 나눕니다. 값 비교 전에 입력과 실제 데이터 경로를 먼저 고정합니다."
      note="표의 상태는 실험 절차를 설명하는 예시입니다. 대상 환경에서 얻은 측정 결과가 아닙니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-kohaku-validation-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Kohaku Provider bundle을 고정하고 같은 fixture와 실패를 재생해 채택 또는 rollback을 판단하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3 lg:grid-cols-6">
          {SCENES.map((scene, index) => (
            <div key={scene} className={index === active ? "min-w-0 bg-background p-3 ring-2 ring-inset ring-primary" : "min-w-0 bg-background p-3"}>
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-xs leading-5">{scene}</strong>
            </div>
          ))}
        </div>

        <div
          data-viz-mobile-table
          className="mt-3 grid min-w-0 grid-cols-3 gap-px bg-border p-px sm:hidden"
          aria-label={`현재 검증 단계: ${SCENES[active]}`}
        >
          {ROWS.map((row) => (
            <article key={row.name} className="min-w-0 bg-background p-3">
              <p className="break-keep text-[9px] font-semibold text-muted-foreground">{row.name}</p>
              <p className="mt-1 break-words text-xs font-bold leading-5 [overflow-wrap:anywhere]">
                {row.values[active]}
              </p>
            </article>
          ))}
        </div>

        <div className="hidden sm:block" aria-label="검증 단계별 상태">
          <ResponsiveVizTable
            className="mt-3"
            columns={["확인 대상", ...SCENES]}
            rows={ROWS.map((row) => [row.name, ...row.values])}
            desktopMinWidthClassName="min-w-[680px]"
          />
        </div>

        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">
          {NOTES[active]}
        </p>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["Bundle", "입력", "실행", "대조", "실패", "결정"]}
          playLabel="Provider 검증 과정 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
