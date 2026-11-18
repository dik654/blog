import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 복제·백업·버전 기록은 서로 다른 실패를 막습니다.
 * 세 칸 = 원본 · 복제본 · 백업(과거 시점). 칩 = 주문 기록.
 * 주문 3은 백업을 만든 뒤에 생겼다고 가정합니다.
 */
type ChipState = "ok" | "gone" | "absent" | "ghost";
type Column = { title: string; status: string; tone: "ok" | "bad" | "keep"; chips: readonly ChipState[] };

const ORDERS = ["주문 1", "주문 2", "주문 3"] as const;

const SCENES = [
  {
    label: "평소",
    summary: "복제본은 지금, 백업은 과거 시점",
    note: "복제본은 원본과 같은 지금의 상태를 따라갑니다. 백업은 별도 보존 주기로 만든 과거 시점의 사본이라 그 뒤에 생긴 주문 3이 없습니다(가정).",
    columns: [
      { title: "원본", status: "서비스 중", tone: "ok", chips: ["ok", "ok", "ok"] },
      { title: "복제본", status: "같은 상태", tone: "ok", chips: ["ok", "ok", "ok"] },
      { title: "백업 (과거 시점)", status: "보존 중", tone: "keep", chips: ["ok", "ok", "absent"] },
    ],
  },
  {
    label: "장치 고장",
    summary: "복제본으로 서비스 계속",
    note: "원본 장치나 장소가 고장 나면 복제본으로 서비스를 계속하거나 빨리 전환합니다. 복제가 막는 실패가 이것입니다.",
    columns: [
      { title: "원본", status: "고장", tone: "bad", chips: ["gone", "gone", "gone"] },
      { title: "복제본", status: "서비스 이어받음", tone: "ok", chips: ["ok", "ok", "ok"] },
      { title: "백업 (과거 시점)", status: "보존 중", tone: "keep", chips: ["ok", "ok", "absent"] },
    ],
  },
  {
    label: "잘못된 삭제",
    summary: "삭제도 복제되면 두 곳 모두 없음",
    note: "주문 2를 실수로 지웠고 그 삭제가 즉시 복제되면 원본과 복제본 모두에서 사라질 수 있습니다. 백업은 지운 시점보다 앞선 사본이라 주문 2가 남아 있습니다.",
    columns: [
      { title: "원본", status: "주문 2 삭제", tone: "bad", chips: ["ok", "gone", "ok"] },
      { title: "복제본", status: "삭제가 따라옴", tone: "bad", chips: ["ok", "gone", "ok"] },
      { title: "백업 (과거 시점)", status: "주문 2 남음", tone: "keep", chips: ["ok", "ok", "absent"] },
    ],
  },
  {
    label: "백업으로 되돌리기",
    summary: "과거 시점 복원 · 손실량은 따로",
    note: "백업의 과거 시점으로 돌아가면 주문 2를 되찾습니다. 그 시점 뒤에 생긴 주문 3은 백업에 없어 잃을 수 있습니다. 실제로 얼마를 잃고 복원에 몇 분이 걸리는지는 복원을 시험해야 압니다.",
    columns: [
      { title: "원본", status: "주문 2 없음", tone: "bad", chips: ["ok", "gone", "ok"] },
      { title: "복제본", status: "주문 2 없음", tone: "bad", chips: ["ok", "gone", "ok"] },
      { title: "백업에서 복원", status: "주문 3은 백업에 없음", tone: "keep", chips: ["ok", "ok", "absent"] },
    ],
  },
  {
    label: "버전 기록",
    summary: "이전 버전 · 조건 확인 필요",
    note: "버전 기록이나 휴지통이 있으면 지운 주문 2의 이전 버전을 같은 저장소에서 꺼낼 수 있어 실수 복구에 도움이 됩니다. 다만 보존 기간, 잠금, 계정 침해 범위를 따로 확인해야 합니다.",
    columns: [
      { title: "원본", status: "이전 버전 보관", tone: "keep", chips: ["ok", "ghost", "ok"] },
      { title: "복제본", status: "원본을 따라감", tone: "keep", chips: ["ok", "ghost", "ok"] },
      { title: "백업 (과거 시점)", status: "보존 중", tone: "keep", chips: ["ok", "ok", "absent"] },
    ],
  },
] as const satisfies readonly { label: string; summary: string; note: string; columns: readonly Column[] }[];

function Chip({ name, state }: { name: string; state: ChipState }) {
  const base = "flex min-h-8 min-w-0 items-center justify-center rounded-md border px-1 py-1 text-center text-xs font-semibold leading-4";
  if (state === "ok") return <span className={`${base} border-blue-600/60 bg-blue-600/10 text-blue-800 dark:text-blue-300`}>{name}</span>;
  if (state === "ghost") return <span className={`${base} border-dashed border-blue-600/60 text-blue-800 dark:text-blue-300`}>{name} 이전 버전</span>;
  if (state === "gone") return <span className={`${base} border-dashed border-red-600/60 text-red-700 line-through dark:text-red-400`}>{name}</span>;
  return <span className={`${base} border-dashed border-border text-muted-foreground/70`}>{name} 없음</span>;
}

function Diagram({ columns }: { columns: readonly Column[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {columns.map((column) => (
        <div key={column.title} className="min-w-0 rounded-lg border border-border bg-background p-2 sm:p-3">
          <p className="min-h-10 text-xs font-bold leading-5 sm:text-sm">{column.title}</p>
          <div className="mt-2 grid gap-1.5">
            {ORDERS.map((name, index) => (
              <Chip key={name} name={name} state={(column.chips as readonly ChipState[])[index]} />
            ))}
          </div>
          <p
            className={`mt-2 min-h-10 text-xs font-semibold leading-5 ${
              column.tone === "bad" ? "text-red-700 dark:text-red-400" : column.tone === "ok" ? "text-blue-800 dark:text-blue-300" : "text-muted-foreground"
            }`}
          >
            {column.tone === "bad" ? "✕ " : "● "}
            {column.status}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function ReplicaBackupViz() {
  return (
    <SceneShell
      eyebrow="복제와 백업"
      title="데이터가 두 곳에 있어도 잘못된 삭제는 함께 퍼질 수 있습니다"
      description="칸 하나가 사본 하나, 칩 하나가 주문 기록입니다. 주문 세 건과 백업 시점은 그림용 가정입니다."
      ariaLabel="원본, 복제본, 백업이 장치 고장과 잘못된 삭제에서 어떻게 달라지는지 보여 주는 다섯 장면"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={SCENES.map((scene) => <Diagram key={scene.label} columns={scene.columns} />)} />
      )}
    />
  );
}
