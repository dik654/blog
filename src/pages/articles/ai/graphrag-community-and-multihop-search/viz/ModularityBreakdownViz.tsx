import type { ReactNode } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #community — Q = Σ[l_c/m − (d_c/2m)²]를 community마다 한 줄씩 풀어 둔다.
 * kg-v43(무방향): U-42 deg 3, A-17 1, tenant-a 1, E401 2, 모바일 앱 1 → degree 합 8 = 2m, m = 4.
 * 원래 분할: C-A (2, 5) → 0.5 − 0.390625 = 0.109375, C-B (1, 3) → 0.25 − 0.140625 = 0.109375, Q = 0.21875.
 * E401 이동: 큰 묶음 (3, 7) → 0.75 − 0.765625 = −0.015625, 모바일 앱 (0, 1) → 0 − 0.015625 = −0.015625, Q = −0.03125.
 */
const M = 4;

const NODES = [
  { name: "U-42", degree: 3 },
  { name: "A-17", degree: 1 },
  { name: "tenant-a", degree: 1 },
  { name: "E401", degree: 2 },
  { name: "모바일 앱", degree: 1 },
] as const;

const EDGES = [
  { label: "U-42 ─ A-17", ends: ["U-42", "A-17"] },
  { label: "U-42 ─ tenant-a", ends: ["U-42", "tenant-a"] },
  { label: "U-42 ─ E401", ends: ["U-42", "E401"] },
  { label: "E401 ─ 모바일 앱", ends: ["E401", "모바일 앱"] },
] as const;

type Partition = { title: string; groups: readonly (readonly string[])[] };

const ORIGINAL: Partition = {
  title: "원래 분할",
  groups: [["U-42", "A-17", "tenant-a"], ["E401", "모바일 앱"]],
};
const MOVED: Partition = {
  title: "E401을 C-A로 옮긴 분할",
  groups: [["U-42", "A-17", "tenant-a", "E401"], ["모바일 앱"]],
};

const GROUP_COLORS = ["#2563eb", "#d97706"] as const;
const GROUP_NAMES = ["C-A", "C-B"] as const;

function groupOf(partition: Partition, node: string) {
  return partition.groups.findIndex((group) => group.includes(node));
}

function stats(partition: Partition, index: number) {
  const members = partition.groups[index];
  const inside = EDGES.filter((edge) => members.includes(edge.ends[0]) && members.includes(edge.ends[1])).length;
  const degree = NODES.filter((node) => members.includes(node.name)).reduce<number>((sum, node) => sum + node.degree, 0);
  const share = inside / M;
  const expected = (degree / (2 * M)) ** 2;
  return { inside, degree, share, expected, term: share - expected };
}

function q(partition: Partition) {
  return partition.groups.reduce<number>((sum, _group, index) => sum + stats(partition, index).term, 0);
}

function fmt(value: number) {
  const text = Math.abs(value).toString();
  return value < 0 ? `−${text}` : text;
}

const SCENES = [
  { label: "원래 분할 · C-A", summary: "0.5 − 0.390625 = +0.109375", note: "C-A 안쪽 edge는 4개 중 2개라 안쪽 비율은 0.5입니다. C-A node의 degree 합은 3+1+1=5이므로, 같은 degree로 edge를 무작위로 이을 때 기대되는 비율은 (5/8)²=0.390625입니다. 실제가 기대보다 0.109375 높습니다." },
  { label: "원래 분할 · C-B", summary: "Q = 0.109375 × 2 = 0.21875", note: "C-B는 안쪽 edge 1개로 0.25, degree 합 2+1=3으로 기대 0.140625입니다. 차이 0.109375를 C-A의 값과 더하면 본문의 Q=0.21875가 나옵니다." },
  { label: "E401 이동 · 큰 묶음", summary: "0.75 − 0.765625 = −0.015625", note: "E401을 C-A로 옮기면 안쪽 edge는 3개로 늘어 0.75가 됩니다. 하지만 degree 합도 5+2=7로 커져 기대 비율이 (7/8)²=0.765625로 더 빨리 오릅니다. 안쪽 edge를 하나 더 얻고도 차이는 음수입니다." },
  { label: "E401 이동 · 모바일 앱", summary: "Q = −0.015625 × 2 = −0.03125", note: "혼자 남은 모바일 앱은 안쪽 edge가 0개라 안쪽 비율이 0이고, 기대 비율 (1/8)²=0.015625만 빠집니다. 두 차이를 더하면 Q=−0.03125입니다." },
  { label: "두 분할 비교", summary: "0.21875 > −0.03125", note: "두 분할 모두 같은 4개 edge와 degree 8을 나눠 가질 뿐입니다. U-42 ─ E401(reported) edge 하나만 경계에 둔 원래 분할이 이 작은 예에서는 점수가 높습니다. Q는 같은 graph 안의 분할끼리 비교하는 값이며 절대 합격선이 아닙니다." },
] as const;

function NodeRow({ partition }: { partition: Partition }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {NODES.map((node) => {
        const group = groupOf(partition, node.name);
        return (
          <div key={node.name} className="min-w-0 rounded-md border px-1 py-1.5 text-center" style={{ borderColor: GROUP_COLORS[group] }}>
            <span className="block break-keep text-[11px] font-bold leading-4 sm:text-xs">{node.name}</span>
            <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">deg {node.degree}</span>
            <span className="block text-[10px] font-bold leading-4" style={{ color: GROUP_COLORS[group] }}>
              {GROUP_NAMES[group]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function EdgeRow({ partition }: { partition: Partition }) {
  return (
    <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono text-[11px] leading-5 sm:grid-cols-2">
      {EDGES.map((edge) => {
        const a = groupOf(partition, edge.ends[0]);
        const b = groupOf(partition, edge.ends[1]);
        const inside = a === b;
        return (
          <li key={edge.label} className="flex min-w-0 justify-between gap-2 border-b border-border py-0">
            <span className="truncate">{edge.label}</span>
            <span className="shrink-0 font-sans font-bold" style={{ color: inside ? GROUP_COLORS[a] : "#64748b" }}>
              {inside ? GROUP_NAMES[a] : "경계"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_4.75rem] items-center gap-2 text-[11px] sm:text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-3 min-w-0 rounded-sm bg-muted/50">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${value * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">{value}</span>
    </div>
  );
}

function CommunityRow({ partition, index, focus }: { partition: Partition; index: number; focus: boolean }) {
  const s = stats(partition, index);
  return (
    <section className={`rounded-md border p-3 ${focus ? "" : "hidden opacity-50 sm:block"}`} style={{ borderColor: focus ? GROUP_COLORS[index] : "#94a3b8" }}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-xs font-bold" style={{ color: GROUP_COLORS[index] }}>
          {GROUP_NAMES[index]} · {partition.groups[index].join(" · ")}
        </p>
        <p className="font-mono text-[11px] text-muted-foreground">
          l={s.inside} · d={s.degree} · <span className="font-bold text-foreground">차이 {fmt(s.term)}</span>
        </p>
      </div>
      <div className="mt-2 space-y-1.5">
        <Bar label={`안쪽 ${s.inside}/${M}`} value={s.share} color={GROUP_COLORS[index]} />
        <Bar label={`기대 (${s.degree}/8)²`} value={s.expected} color="#64748b" />
      </div>
    </section>
  );
}

function Picture({ active }: { active: number }) {
  const partition = active < 2 ? ORIGINAL : MOVED;
  const compare = active === 4;
  if (compare) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {[ORIGINAL, MOVED].map((p) => (
          <section key={p.title} className="min-w-0 rounded-md border border-border p-3">
            <p className="text-xs font-bold">{p.title}</p>
            <div className="mt-2">
              <NodeRow partition={p} />
            </div>
            <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
              {p.groups.map((_group, index) => fmt(stats(p, index).term)).join(" + ")}
            </p>
            <p className="mt-1 font-mono text-base font-bold">Q = {fmt(q(p))}</p>
          </section>
        ))}
      </div>
    );
  }
  const focus = active % 2;
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-bold">{partition.title} · m = 4 · degree 합 8</p>
      <NodeRow partition={partition} />
      <EdgeRow partition={partition} />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {[0, 1].map((index) => (
          <CommunityRow key={index} partition={partition} index={index} focus={index === focus} />
        ))}
      </div>
    </div>
  );
}

export default function ModularityBreakdownViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const labels = SCENES.map((scene) => scene.label);
  const headers: ReactNode[] = SCENES.map((scene) => (
    <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <h4 className="text-base font-bold">{scene.label}</h4>
      <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
    </div>
  ));
  const pictures: ReactNode[] = SCENES.map((scene, index) => <Picture key={scene.label} active={index} />);
  const notes: ReactNode[] = SCENES.map((scene) => (
    <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
      {scene.note}
    </p>
  ));
  return (
    <VizFrame
      eyebrow="Modularity · 한 줄씩 계산"
      title="두 분할의 Q를 community별 차이로 풀어 봅니다"
      description="community마다 ‘안쪽 edge 비율(l/m)’에서 ‘같은 degree로 무작위 연결할 때 기대되는 비율 (d/2m)²’을 빼고 모두 더합니다. degree는 node에 붙은 edge 수입니다."
      note="kg-v43의 node 5·edge 4는 설명용 그래프이며 edge 방향을 지운 무방향 graph로 셉니다. 실제 Leiden 결과는 resolution·가중치·graph 크기에 따라 달라집니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="원래 분할과 E401을 옮긴 분할의 modularity 계산"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack active={scenes.active} scenes={headers} />
        <StableSceneStack active={scenes.active} className="mt-4" scenes={pictures} />
        <StableSceneStack active={scenes.active} className="mt-4" scenes={notes} />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
