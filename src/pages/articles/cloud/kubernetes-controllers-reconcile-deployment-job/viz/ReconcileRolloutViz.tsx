import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * replicas 3인 Deployment `web` 하나를 따라간다. 한 mechanism: 컨트롤러는 "현재 Pod 수 − 목표 수"라는 차이 하나만 보고
 * 그 차이를 한 걸음 줄인다. Pod 삭제 복구와 v1 → v2 롤아웃이 같은 식(diff, maxSurge 1, maxUnavailable 0)으로 움직인다.
 * 숫자는 pkg/apis/apps/v1/defaults.go(25%)와 deployment_util.go ResolveFenceposts(올림·내림)에서 손으로 계산했다.
 * 장면마다 길이가 다른 diff 줄과 설명은 같은 셀에 겹쳐 두고 비활성을 invisible로 둬 높이가 움직이지 않게 한다.
 */
type Cell = "ready" | "creating" | "terminating" | "empty";

interface Row {
  spec: number;
  cells: readonly Cell[];
}

interface Scene {
  label: string;
  old: Row;
  neu: Row | null;
  diffLine: string;
  note: string;
}

const SLOTS = 4;

const SCENES: readonly Scene[] = [
  {
    label: "평소 3 = 3",
    old: { spec: 3, cells: ["ready", "ready", "ready", "empty"] },
    neu: null,
    diffLine: "diff = 3 − 3 = 0 → 아무 일도 안 함",
    note: "ReplicaSet web-5c6d는 selector에 맞고 자기가 소유한 활성 Pod를 세어 3을 얻습니다. spec.replicas 3과 같으니 이번 reconcile은 아무 요청도 보내지 않고 끝납니다.",
  },
  {
    label: "Pod 하나 삭제",
    old: { spec: 3, cells: ["ready", "ready", "creating", "empty"] },
    neu: null,
    diffLine: "diff = 2 − 3 = −1 → Pod 1개 생성",
    note: "운영자가 Pod 하나를 지우자 삭제 event가 ReplicaSet key를 workqueue에 넣습니다. 다시 센 값은 2, 차이 −1이므로 template으로 새 Pod를 만듭니다. 이름과 UID가 새것이라 지운 Pod가 돌아온 것이 아닙니다.",
  },
  {
    label: "v2 롤아웃 시작",
    old: { spec: 3, cells: ["ready", "ready", "ready", "empty"] },
    neu: { spec: 1, cells: ["creating", "empty", "empty", "empty"] },
    diffLine: "전체 3 < 상한 4 → 새 RS 0 → 1",
    note: "image를 v2로 바꾸면 template 해시가 달라져 새 ReplicaSet web-7d4f가 생깁니다. maxSurge 25%는 올림이라 1, 전체 Pod 상한은 4이므로 새 ReplicaSet을 1로 올립니다. 옛 Pod는 아직 건드리지 않습니다.",
  },
  {
    label: "새 Pod Ready → 옛 3 → 2",
    old: { spec: 2, cells: ["ready", "ready", "terminating", "empty"] },
    neu: { spec: 1, cells: ["ready", "empty", "empty", "empty"] },
    diffLine: "maxScaledDown = 4 − 3 − 0 = 1 → 옛 RS 3 → 2",
    note: "새 Pod가 Ready가 되기 전에는 4 − 3 − 1 = 0이라 옛 Pod를 하나도 못 줄였습니다. Ready가 되자 미가용 수가 0이 되어 1개를 줄일 수 있습니다. maxUnavailable 25%는 내림이라 0, 가용 Pod는 3 아래로 내려가지 않습니다.",
  },
  {
    label: "새 1 → 2",
    old: { spec: 2, cells: ["ready", "ready", "empty", "empty"] },
    neu: { spec: 2, cells: ["ready", "creating", "empty", "empty"] },
    diffLine: "전체 3 < 상한 4 → 새 RS 1 → 2",
    note: "옛 Pod가 하나 사라져 전체가 3이 되자 다시 상한 4까지 여유가 생겼습니다. 한 reconcile은 한 방향만 움직입니다. 늘릴 수 있으면 늘리고 끝, 못 늘리면 줄일 수 있는지 봅니다.",
  },
  {
    label: "옛 2 → 1",
    old: { spec: 1, cells: ["ready", "terminating", "empty", "empty"] },
    neu: { spec: 2, cells: ["ready", "ready", "empty", "empty"] },
    diffLine: "maxScaledDown = 4 − 3 − 0 = 1 → 옛 RS 2 → 1",
    note: "두 번째 새 Pod가 Ready가 되어 가용 Pod가 4가 되었으니 옛 Pod를 하나 더 줄입니다. 지울 Pod는 미배치 → Pending → NotReady 순으로 고르고, 모두 Ready면 pod-deletion-cost와 노드 분포로 정합니다.",
  },
  {
    label: "새 2 → 3",
    old: { spec: 1, cells: ["ready", "empty", "empty", "empty"] },
    neu: { spec: 3, cells: ["ready", "ready", "creating", "empty"] },
    diffLine: "전체 3 < 상한 4 → 새 RS 2 → 3",
    note: "새 ReplicaSet이 목표 3에 도달합니다. Deployment의 spec.replicas는 롤아웃 내내 3이었고, 바뀐 것은 두 ReplicaSet 사이의 배분뿐입니다.",
  },
  {
    label: "옛 1 → 0 완료",
    old: { spec: 0, cells: ["terminating", "empty", "empty", "empty"] },
    neu: { spec: 3, cells: ["ready", "ready", "ready", "empty"] },
    diffLine: "새 RS 3 = 3, 옛 RS 0 → Progressing=True · NewReplicaSetAvailable",
    note: "마지막 옛 Pod가 사라지면 롤아웃이 끝납니다. 옛 ReplicaSet은 replicas 0으로 남아 롤백 대상이 되고, revisionHistoryLimit 10을 넘는 것부터 cleanupDeployment가 지웁니다.",
  },
];

const OLD = "#2563eb";
const NEW = "#16a34a";

function PodCell({ state, tone, reduced, delay }: { state: Cell; tone: string; reduced: boolean; delay: number }) {
  const base = "flex h-8 items-center justify-center rounded-sm border text-[10px] font-bold sm:text-[11px]";
  if (state === "empty") return <div className={`${base} border-dashed border-border text-transparent`}>·</div>;
  if (state === "creating") {
    return (
      <motion.div
        className={`${base} border-dashed`}
        style={{ borderColor: "#f59e0b", color: "#b45309" }}
        initial={{ opacity: 0.2 }}
        animate={{ opacity: reduced ? 1 : [0.4, 1, 0.4] }}
        transition={{ delay, duration: 1.4, repeat: reduced ? 0 : Infinity }}
      >
        생성 중
      </motion.div>
    );
  }
  if (state === "terminating") {
    return (
      <motion.div
        className={`${base} border-[#94a3b8] text-[#64748b] line-through`}
        initial={{ opacity: 1 }}
        animate={{ opacity: reduced ? 0.45 : 0.35 }}
        transition={{ delay, duration: reduced ? 0 : 0.5 }}
      >
        종료 중
      </motion.div>
    );
  }
  return (
    <motion.div
      className={`${base} text-white`}
      style={{ borderColor: tone }}
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ backgroundColor: tone }}
      transition={{ delay, duration: reduced ? 0 : 0.3 }}
    >
      Ready
    </motion.div>
  );
}

function RsRow({ name, version, row, tone, reduced }: { name: string; version: string; row: Row | null; tone: string; reduced: boolean }) {
  const cells: readonly Cell[] = row ? row.cells : ["empty", "empty", "empty", "empty"];
  return (
    <div className="grid grid-cols-[5.6rem_repeat(4,minmax(0,1fr))] items-center gap-1 sm:grid-cols-[8rem_repeat(4,minmax(0,1fr))]">
      <div className="min-w-0">
        <div className="truncate font-mono text-[11px] font-bold" style={{ color: row ? tone : "#94a3b8" }}>
          {name}
        </div>
        <div className="text-[10px] text-muted-foreground">
          {version} · spec {row ? row.spec : "—"}
        </div>
      </div>
      {Array.from({ length: SLOTS }, (_, i) => (
        <PodCell key={i} state={cells[i] ?? "empty"} tone={tone} reduced={reduced} delay={reduced ? 0 : 0.15 + i * 0.08} />
      ))}
    </div>
  );
}

const count = (row: Row | null, s: Cell) => (row ? row.cells.filter((c) => c === s).length : 0);

/** 모든 장면의 내용을 같은 셀에 겹쳐 두고 활성 장면만 보이게 한다. 높이는 가장 긴 장면이 정한다. */
function Stack({ active, className, render }: { active: number; className?: string; render: (scene: Scene) => ReactNode }) {
  return (
    <div className={`grid ${className ?? ""}`}>
      {SCENES.map((s, i) => (
        <div key={s.label} aria-hidden={i !== active} className={`col-start-1 row-start-1 min-w-0 ${i === active ? "" : "invisible"}`}>
          {render(s)}
        </div>
      ))}
    </div>
  );
}

export default function ReconcileRolloutViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const total = count(scene.old, "ready") + count(scene.old, "creating") + count(scene.neu, "ready") + count(scene.neu, "creating");
  const available = count(scene.old, "ready") + count(scene.neu, "ready");

  return (
    <VizFrame
      eyebrow="Reconcile · Deployment web, replicas 3"
      title="컨트롤러는 현재 수와 목표 수의 차이 하나만 보고 한 걸음씩 움직입니다"
      description="두 줄은 Deployment가 거느린 ReplicaSet 두 개, 칸은 Pod입니다. 파랑은 v1 ReplicaSet의 Ready Pod, 초록은 v2, 점선은 만드는 중, 흐린 칸은 지우는 중입니다. 상한 4(3 + surge 1)와 하한 3(3 − unavailable 0)이 매 장면 유지됩니다."
      note="maxSurge·maxUnavailable 기본 25%를 replicas 3에 적용해 올림 1·내림 0으로 계산했습니다. 한 장면이 reconcile 한 번과 그 뒤 Pod 상태 변화 한 번입니다. 실제 클러스터를 돌려 잰 것이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Deployment 롤아웃과 Pod 복구의 reconcile 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <Stack
            active={scenes.active}
            render={(s) => (
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h4 className="text-base font-bold">{s.label}</h4>
                <span className="font-mono text-xs font-bold text-primary sm:text-sm">{s.diffLine}</span>
              </div>
            )}
          />

          <div key={scenes.active} className="mt-3 space-y-2 border-y border-border py-2">
            <RsRow name="web-5c6d" version="v1 template" row={scene.old} tone={OLD} reduced={reduced} />
            <RsRow name="web-7d4f" version="v2 template" row={scene.neu} tone={NEW} reduced={reduced} />
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">Deployment 목표</dt>
              <dd className="font-bold text-foreground">replicas 3</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">전체 Pod (상한 4)</dt>
              <dd className={`font-bold ${total > 4 ? "text-[#dc2626]" : "text-foreground"}`}>{total}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">가용 Pod (하한 3)</dt>
              <dd className={`font-bold ${available < 3 ? "text-[#dc2626]" : "text-foreground"}`}>{available}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">RS spec v1 / v2</dt>
              <dd className="font-bold text-foreground">
                <span style={{ color: OLD }}>{scene.old.spec}</span> / <span style={{ color: NEW }}>{scene.neu ? scene.neu.spec : "—"}</span>
              </dd>
            </div>
          </dl>

          <Stack
            active={scenes.active}
            className="mt-3"
            render={(s) => <p className="border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{s.note}</p>}
          />
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
