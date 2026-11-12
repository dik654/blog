import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — Deployment 세 층(Deployment → ReplicaSet → Pod)과 Job 두 층(Job → Pod).
 * 아래로는 label selector로 찾고, 위로는 ownerReferences에 상위를 적는다. 층마다 맞추는 숫자가 하나다.
 * 세 장면 모두 위 칸·가운데 칸·Pod 칸의 세 줄을 같은 자리에 두어 높이가 움직이지 않는다.
 */
const OLD = "#2563eb";
const NEW = "#16a34a";
const JOB = "#7c3aed";
const MUTED = "#94a3b8";

interface Box {
  name: string;
  detail: string;
  tone: string;
}

interface Layer {
  top: Box;
  middle: readonly Box[];
  pods: readonly { tone: string; label: string }[];
  topController: string;
  middleController: string;
}

const LAYERS: readonly Layer[] = [
  {
    top: { name: "Deployment web", detail: "목표: 이 template으로 Pod 3개", tone: "#334155" },
    middle: [{ name: "web-5c6d", detail: "ReplicaSet · template 한 벌 · 개수 3", tone: OLD }],
    pods: [
      { tone: OLD, label: "Pod" },
      { tone: OLD, label: "Pod" },
      { tone: OLD, label: "Pod" },
    ],
    topController: "Deployment 컨트롤러: ReplicaSet의 replicas 숫자만 정함",
    middleController: "ReplicaSet 컨트롤러: 소유한 Pod 수만 맞춤",
  },
  {
    top: { name: "Deployment web", detail: "template을 v2로 바꿈 · replicas 3", tone: "#334155" },
    middle: [
      { name: "web-5c6d", detail: "ReplicaSet · v1 template · 개수 2", tone: OLD },
      { name: "web-7d4f8c9b", detail: "ReplicaSet · v2 template · 개수 1", tone: NEW },
    ],
    pods: [
      { tone: OLD, label: "v1" },
      { tone: OLD, label: "v1" },
      { tone: NEW, label: "v2" },
    ],
    topController: "Deployment 컨트롤러: 두 ReplicaSet 사이 배분만 옮김",
    middleController: "각 ReplicaSet 컨트롤러: 자기 개수만 맞춤",
  },
  {
    top: { name: "Job backup", detail: "목표: 성공 횟수가 completions에 닿기", tone: JOB },
    middle: [],
    pods: [{ tone: JOB, label: "Pod" }],
    topController: "Job 컨트롤러: Pod를 직접 만듦",
    middleController: "가운데 층 없음",
  },
];

const SCENES = [
  {
    label: "Deployment는 세 층",
    summary: "Deployment → ReplicaSet → Pod",
    note: "맨 위는 목표만 들고, 가운데 ReplicaSet이 template 한 벌과 개수 하나를 들고 Pod 수를 맞춥니다. 아래 층은 ownerReferences에 위 층을 적고, 위 층은 label selector로 아래 층을 찾습니다.",
  },
  {
    label: "template이 바뀌면 ReplicaSet이 둘",
    summary: "template 한 벌마다 ReplicaSet 하나",
    note: "Deployment 컨트롤러는 Pod를 만들지 않고 두 ReplicaSet의 replicas 숫자만 바꿉니다. 여기 2와 1은 롤아웃 도중 한 순간을 고른 예입니다(가정).",
  },
  {
    label: "Job은 두 층",
    summary: "Job → Pod",
    note: "Job 컨트롤러는 중간 층 없이 Pod를 직접 만듭니다. 목표 상태는 성공 수가 completions에 닿는 것이고, 실패한 Pod는 10초부터 두 배씩 늦춰 다시 만들다가, 실패 수가 backoffLimit(기본 6)을 넘으면 Job을 실패로 적고 멈춥니다.",
  },
] as const;

function ObjectBox({ box }: { box: Box }) {
  return (
    <div className="min-w-0 rounded-lg border bg-background px-3 py-2" style={{ borderColor: box.tone }}>
      <p className="truncate font-mono text-xs font-bold sm:text-sm" style={{ color: box.tone }}>
        {box.name}
      </p>
      <p className="text-xs leading-5 text-muted-foreground">{box.detail}</p>
    </div>
  );
}

function Link({ mode }: { mode: "layer" | "job" | "none" }) {
  return (
    <div className={`grid grid-cols-2 gap-2 py-1 text-[11px] leading-4 text-muted-foreground sm:text-xs ${mode === "none" ? "invisible" : ""}`} aria-hidden={mode === "none"}>
      <span className="text-left">{mode === "job" ? "↓ Pod를 직접 만듦" : "↓ label selector로 찾음"}</span>
      <span className="text-right">{mode === "job" ? "↑ ownerReferences에 Job을 적음" : "↑ ownerReferences에 위 층을 적음"}</span>
    </div>
  );
}

export default function ControllerLayersViz() {
  return (
    <SceneShell
      eyebrow="세 층과 두 층"
      title="층마다 숫자 하나만 맞추고, 아래 층이 위 층을 적어 둡니다"
      description="상자는 API 객체, 작은 칸은 Pod입니다. 파랑은 v1 template, 초록은 v2 template, 보라는 Job입니다. 글의 replicas 3 사례를 씁니다."
      ariaLabel="Deployment, ReplicaSet, Pod 세 층과 Job, Pod 두 층의 관계"
      scenes={SCENES}
      render={(active) => {
        const layer = LAYERS[active];
        const isJob = layer.middle.length === 0;
        return (
          <div className="min-w-0">
            <ObjectBox box={layer.top} />
            <p className="mt-1 text-xs font-semibold text-foreground">{layer.topController}</p>
            <Link mode={isJob ? "none" : "layer"} />
            <div className="grid min-h-[3.75rem] grid-cols-2 gap-2">
              {layer.middle.length === 0 ? (
                <div className="flex items-center justify-center rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground col-span-2" style={{ borderColor: MUTED }}>
                  ReplicaSet 층 없음
                </div>
              ) : (
                layer.middle.map((box) => <ObjectBox key={box.name} box={box} />)
              )}
            </div>
            <p className="mt-1 text-xs font-semibold text-foreground">{layer.middleController}</p>
            <Link mode={isJob ? "job" : "layer"} />
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((slot) => {
                const pod = layer.pods[slot];
                return pod ? (
                  <div key={slot} className="flex h-9 items-center justify-center rounded-md text-xs font-bold text-white" style={{ backgroundColor: pod.tone }}>
                    {pod.label}
                  </div>
                ) : (
                  <div key={slot} className="h-9 rounded-md border border-dashed" style={{ borderColor: MUTED }} aria-hidden />
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
