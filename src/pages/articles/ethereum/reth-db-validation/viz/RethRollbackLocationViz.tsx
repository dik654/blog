import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #recovery — "Rollback은 binary만 낮추는 작업이 아닙니다".
 * 행 = migration이 옮기는 자료 묶음(본문 #experiment 02·03·04)과 StorageSettings, 열 = 세 backend.
 * 장면마다 각 묶음이 어느 저장소에 있는지 보여 주고, cleanup 뒤 binary만 낮춘 상태와
 * 세 저장소를 같은 시점 snapshot으로 함께 되돌린 상태를 비교한다.
 */
type Cell = "has" | "orig" | "copied" | "cleared" | "none" | "missing";

const GROUPS = [
  { name: "Account changesets", dest: "static" },
  { name: "Storage changesets", dest: "static" },
  { name: "Receipts", dest: "static" },
  { name: "Transaction hash", dest: "rocks" },
  { name: "Account history", dest: "rocks" },
  { name: "Storage history", dest: "rocks" },
] as const;

const SCENES = [
  { label: "V1 원본", summary: "여섯 묶음 모두 MDBX", binary: "이전 검증 binary", settings: "V1", step: 0, note: "V1 oracle은 모든 자료가 MDBX에 있는 보존 snapshot입니다. 그림은 migration이 옮기는 여섯 묶음과 StorageSettings만 표시합니다. Static files는 block 범위(segment)별 파일 묶음, RocksDB는 별도의 key-value 저장소입니다." },
  { label: "Static 이관", summary: "02·03 · changesets·receipts", binary: "v2.8.1 · migrate-to-v2", settings: "V1", step: 1, note: "Account·storage changesets와 receipts를 static files로 씁니다. 본문 순서상 MDBX 옛 table을 지우는 것은 06 cleanup이므로 이 시점에는 두 곳에 모두 있습니다." },
  { label: "RocksDB 이관", summary: "04 · hash·history", binary: "v2.8.1 · migrate-to-v2", settings: "V1", step: 2, note: "Transaction hash와 account/storage history를 RocksDB로 옮깁니다. 이 단계까지도 StorageSettings는 V1입니다." },
  { label: "Version flip", summary: "05 · StorageSettings V1 → V2", binary: "v2.8.1 · migrate-to-v2", settings: "V2", step: 3, note: "자료 이동이 끝난 뒤에 MDBX의 StorageSettings를 V2로 바꿉니다. 자료 위치는 앞 장면과 같고 버전 표시만 바뀝니다." },
  { label: "Cleanup", summary: "06 · MDBX 옛 table clear·compact", binary: "v2.8.1 · migrate-to-v2", settings: "V2", step: 4, note: "옮긴 묶음의 MDBX 옛 table을 지우고 compact한 뒤 pipeline이 남은 자료를 rebuild합니다. 이제 여섯 묶음은 static files와 RocksDB에만 있습니다." },
  { label: "Binary만 낮추기", summary: "자료 위치는 그대로", binary: "이전 검증 binary", settings: "V2", step: 5, note: "Cleanup까지 끝난 뒤 binary만 이전 검증 binary로 바꿔도 저장소 안의 자료는 움직이지 않습니다. V1 oracle처럼 MDBX에 있어야 할 여섯 묶음의 table은 이미 지워졌고 StorageSettings도 V2로 남습니다. 본문이 rollback을 binary만 낮추는 작업이 아니라고 하는 이유입니다." },
  { label: "같은 시점으로 함께 복원", summary: "세 저장소 snapshot 동시 복원", binary: "이전 검증 binary", settings: "V1", step: 6, note: "Migration 전 MDBX snapshot과 그 시점의 static/RocksDB directories를 함께 복원하면 첫 장면과 같은 배치로 돌아갑니다. 다른 길은 검증된 chain source에서 재구축하는 것입니다. 어느 쪽이든 전체 parity를 확인한 뒤 재진입합니다." },
] as const;

const LABELS = SCENES.map((scene) => scene.label);
const NOTES = SCENES.map((scene) => scene.note);

function cellsFor(step: number, dest: "static" | "rocks"): [Cell, Cell, Cell] {
  const copiedAt = dest === "static" ? 1 : 2;
  if (step === 0 || step === 6) return ["has", "none", "none"];
  const copied = step >= copiedAt;
  const mdbx: Cell = step === 5 ? "missing" : step >= 4 ? "cleared" : copied ? "orig" : "has";
  const target: Cell = copied ? "copied" : "none";
  return dest === "static" ? [mdbx, target, "none"] : [mdbx, "none", target];
}

const CELL_STYLE: Record<Cell, { text: string; cls: string }> = {
  has: { text: "있음", cls: "border-foreground/60 font-semibold" },
  orig: { text: "옛 table 남음", cls: "border-border text-muted-foreground" },
  copied: { text: "옮겨짐", cls: "border-primary font-semibold text-primary" },
  cleared: { text: "지움", cls: "border-dashed border-border text-muted-foreground" },
  missing: { text: "비어 있음", cls: "border-dashed border-amber-600 font-semibold text-amber-700 dark:text-amber-400" },
  none: { text: "—", cls: "border-transparent text-muted-foreground/50" },
};

const COLUMNS = ["MDBX", "Static files", "RocksDB"] as const;

function Matrix({ active }: { active: number }) {
  const scene = SCENES[active];
  const warn = scene.step === 5;
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className={`min-w-0 border px-2 py-1.5 ${warn ? "border-amber-600" : "border-border"}`}>
          <span className="block text-[10px] text-muted-foreground">Binary</span>
          <strong className="block break-keep">{scene.binary}</strong>
        </div>
        <div className={`min-w-0 border px-2 py-1.5 ${warn ? "border-amber-600" : scene.settings === "V2" ? "border-primary" : "border-border"}`}>
          <span className="block text-[10px] text-muted-foreground">MDBX StorageSettings</span>
          <strong className="block">{scene.settings}</strong>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-[minmax(0,1.25fr)_repeat(3,minmax(0,1fr))] gap-1 text-[10px] leading-4 sm:gap-2 sm:text-xs">
        <span />
        {COLUMNS.map((column) => (
          <strong key={column} className="break-keep text-center">{column}</strong>
        ))}
        {GROUPS.map((group) => {
          const cells = cellsFor(scene.step, group.dest);
          return [
            <span key={`${group.name}-label`} className="self-center break-keep">{group.name}</span>,
            ...cells.map((cell, column) => (
              <span key={`${group.name}-${column}`} className={`flex min-h-7 items-center justify-center break-keep rounded border px-1 text-center ${CELL_STYLE[cell].cls}`}>
                {CELL_STYLE[cell].text}
              </span>
            )),
          ];
        })}
      </div>
    </div>
  );
}

export default function RethRollbackLocationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6400, { loop: false });
  const active = scenes.active;
  return (
    <VizFrame
      eyebrow="Rollback · 자료 위치"
      title="Binary만 낮추면 옮겨진 자료의 위치는 돌아오지 않습니다"
      description="행은 migration이 옮기는 자료 묶음, 열은 세 저장소입니다. 장면마다 각 묶음이 어디에 있는지 표시합니다."
      note="본문 #experiment의 공식 순서를 따른 구조 설명이며, 대상 환경에서 측정한 복구 결과는 없습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="V1에서 V2로 migration하는 동안 자료 묶음의 저장 위치와 rollback 방식 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <div className="mt-3 min-w-0">
          <Matrix active={active} />
        </div>
        <StableSceneStack
          active={active}
          className="mt-3"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={["V1", "Static", "Rocks", "Flip", "Cleanup", "Binary만", "복원"]} playLabel="자료 위치 변화 재생" />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
