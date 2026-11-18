import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture (4절), 백업 복구 시험은 #limits (10절).
 * 수집 → 판단 → 사건번호 연결 → 열람 → 보존 근거 종료 → 법적 보류 분기 → 파기 추적.
 * 기간·일수는 본문이 자료별로 다르다고만 하므로 그리지 않습니다.
 */
const STAGES = ["수집", "판단", "연결", "열람", "보존 종료", "파기"] as const;

interface Scene {
  label: string;
  summary: string;
  note: string;
  stage: number;
  panel: "items" | "branch" | "copies";
  items?: readonly string[];
}

const SCENES: readonly Scene[] = [
  { label: "받을 때 목적을 정합니다", summary: "목적 + 항목", stage: 0, panel: "items", items: ["받는 목적", "받는 항목"], note: "고객 정보를 받기 전에 어떤 목적으로 어떤 항목을 받는지 정합니다. 뒤에서 보존 근거를 따질 때 이 목적이 기준이 됩니다." },
  { label: "판단에 씁니다", summary: "적합성·적정성 판단", stage: 1, panel: "items", items: ["적합성 판단", "적정성 판단"], note: "받은 고객 정보는 이 상품을 권해도 되는지(적합성), 고객이 스스로 고른 거래가 맞는지(적정성)를 판단하는 데 씁니다." },
  { label: "한 사건으로 묶습니다", summary: "같은 사건번호 + 변조 방지", stage: 2, panel: "items", items: ["설명서", "손실표", "녹취", "주문"], note: "설명서·손실표·녹취·주문을 같은 사건번호로 연결하고, 나중에 바뀌지 않도록 변조를 막는 통제를 둡니다." },
  { label: "열람 요청에 답합니다", summary: "본인 자료 → 사본 또는 청취 경로", stage: 3, panel: "items", items: ["본인 자료 찾기", "사본 제공", "청취 경로 제공"], note: "민원이나 소송을 위해 고객이 열람을 요청하면 묶어 둔 사건에서 본인 자료를 찾아 사본이나 청취 경로를 제공합니다." },
  { label: "보존 근거가 끝나면 갈립니다", summary: "법적 보류 있음 / 없음", stage: 4, panel: "branch", note: "법적 보류는 소송·조사 등 때문에 자료를 지우지 말고 남겨 두라는 조치입니다. 보존 근거가 끝나도 이것부터 확인한 뒤 파기로 넘어갑니다." },
  { label: "파기는 사본까지 추적합니다", summary: "원본 · 검색색인 · 내보낸 사본", stage: 5, panel: "copies", note: "원본 하나만 지우면 끝나지 않습니다. 검색색인과 밖으로 내보낸 사본까지 파기를 추적하고, 10절처럼 복구한 백업에서 지운 자료가 되살아나는지도 시험합니다." },
];

function Rail({ stage }: { stage: number }) {
  return (
    <ol className="grid grid-cols-3 gap-x-1 gap-y-2 sm:grid-cols-6">
      {STAGES.map((name, i) => (
        <li key={name} className="min-w-0">
          <div className={`h-1.5 rounded-sm ${i <= stage ? "bg-sky-600" : "bg-muted"}`} />
          <span className={`mt-1 block truncate text-center text-[11px] sm:text-xs ${i === stage ? "font-bold" : "text-muted-foreground"}`}>
            {i + 1}. {name}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Panel({ scene }: { scene: Scene }) {
  if (scene.panel === "branch") {
    return (
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-lg border border-amber-600 px-3 py-2 text-sm">
          <span className="block font-semibold text-amber-700 dark:text-amber-400">법적 보류 있음</span>
          <span className="block text-xs leading-5 text-muted-foreground">파기하지 않고 계속 보존</span>
        </div>
        <div className="rounded-lg border border-border px-3 py-2 text-sm">
          <span className="block font-semibold">법적 보류 없음</span>
          <span className="block text-xs leading-5 text-muted-foreground">파기 진행 → 다음 장면</span>
        </div>
      </div>
    );
  }
  if (scene.panel === "copies") {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {["원본", "검색색인", "내보낸 사본"].map((name) => (
          <div key={name} className="rounded-lg border border-emerald-600 px-2 py-2 text-center text-xs leading-5">
            <span className="block font-semibold">{name}</span>
            <span className="block text-emerald-700 dark:text-emerald-400">파기 완료 증거</span>
          </div>
        ))}
        <div className="rounded-lg border border-dashed border-red-600 px-2 py-2 text-center text-xs leading-5">
          <span className="block font-semibold">복구한 백업</span>
          <span className="block text-red-700 dark:text-red-400">되살아나는지 시험</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {(scene.items ?? []).map((item) => (
        <span key={item} className={`rounded-lg border px-3 py-1.5 text-sm ${scene.stage === 2 ? "border-primary bg-primary/10" : "border-border"}`}>
          {item}
        </span>
      ))}
      {scene.stage === 2 ? <span className="self-center font-mono text-xs text-primary">= 사건번호 1개</span> : null}
    </div>
  );
}

export default function RecordLifecycleViz() {
  return (
    <SceneShell
      eyebrow="기록의 생애"
      title="판매가 끝난 뒤에도 기록은 열람과 파기까지 이어집니다"
      description="위 띠는 4절의 순서이고, 아래 칸은 그 단계에서 다루는 자료입니다. 보존 기간은 자료별로 달라 길이로 그리지 않았습니다."
      ariaLabel="고객 정보 수집부터 판단, 사건번호 연결, 열람, 보존 종료 뒤 법적 보류 분기와 파기 추적까지"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-4">
            <Rail stage={scene.stage} />
            <Panel scene={scene} />
          </div>
        );
      }}
    />
  );
}
