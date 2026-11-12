import SceneShell from "./SceneShell";

/**
 * 본문 대응: #request-trace — 잔액 100원에서 7번 지시(30원)를 처리하며 잔액과 처리 이력을 기록합니다.
 * 두 기록을 따로 저장하다 사이에서 장애가 나면 같은 7번을 다시 실행해 100 − 30 − 30 = 40원이 됩니다.
 * 원자적으로 묶으면 장애 시 둘 다 취소(100원, 이력 없음)되고, 재도착한 7번은 한 번만 처리돼 70원입니다.
 * 장애가 두 기록 사이에서 났다는 시점은 설명용 가정입니다.
 */
type Store = { balance: number; log: string; status: string; tone: "plain" | "pending" | "bad" | "ok" };

const SCENES = [
  {
    label: "7번 도착",
    summary: "잔액 100원 · 이력 비어 있음",
    note: "복호화와 권한 확인을 통과한 7번 지시가 저장 단계에 들어옵니다. 두 방식 모두 출발점은 같습니다.",
    split: { balance: 100, log: "없음", status: "처리 전", tone: "plain" },
    atomic: { balance: 100, log: "없음", status: "처리 전", tone: "plain" },
  },
  {
    label: "잔액부터 기록",
    summary: "따로: 70원 저장됨 · 원자적: 확정 전",
    note: "따로 저장하는 쪽은 잔액 70원이 이미 디스크에 남았습니다. 원자적 저장은 전부 반영하거나 전부 취소하는 방식이라, 확정하기 전까지 바뀐 잔액은 아직 반영되지 않았습니다.",
    split: { balance: 70, log: "없음", status: "잔액만 저장", tone: "pending" },
    atomic: { balance: 100, log: "없음", status: "작업 진행 중 (확정 전)", tone: "pending" },
  },
  {
    label: "그 사이 장애",
    summary: "이력 기록 직전에 멈춤 (가정)",
    note: "7번을 처리했다는 기록을 남기기 직전에 장애가 났다고 가정합니다. 따로 저장한 쪽은 70원과 빈 이력이 엇갈려 남고, 원자적 저장은 작업 전체가 취소되어 100원과 빈 이력으로 일관됩니다.",
    split: { balance: 70, log: "없음", status: "잔액과 이력이 어긋남", tone: "bad" },
    atomic: { balance: 100, log: "없음", status: "전부 취소됨", tone: "ok" },
  },
  {
    label: "같은 7번 재도착",
    summary: "따로: 40원 · 원자적: 70원",
    note: "같은 7번이 다시 오면 두 쪽 모두 이력에서 7번을 찾지 못합니다. 따로 저장한 쪽은 이미 뺀 30원을 또 빼 40원이 되고, 원자적 저장은 이번에 처음 처리하므로 70원과 7번 기록을 함께 남깁니다.",
    split: { balance: 40, log: "7번", status: "30원을 두 번 뺌", tone: "bad" },
    atomic: { balance: 70, log: "7번", status: "한 번만 처리", tone: "ok" },
  },
] as const satisfies readonly { label: string; summary: string; note: string; split: Store; atomic: Store }[];

const TONE: Record<Store["tone"], string> = {
  plain: "border-border",
  pending: "border-amber-600 border-dashed",
  bad: "border-red-600",
  ok: "border-emerald-600",
};
const TONE_TEXT: Record<Store["tone"], string> = {
  plain: "text-muted-foreground",
  pending: "text-amber-700 dark:text-amber-400",
  bad: "text-red-700 dark:text-red-400",
  ok: "text-emerald-700 dark:text-emerald-400",
};

function Column({ title, store }: { title: string; store: Store }) {
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-2.5 ${TONE[store.tone]}`}>
      <p className="text-xs font-bold">{title}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-md bg-muted/40 px-2 py-1.5">
          <p className="text-[11px] text-muted-foreground">잔액</p>
          <p className="font-mono text-base font-bold sm:text-lg">{store.balance}원</p>
        </div>
        <div className="rounded-md bg-muted/40 px-2 py-1.5">
          <p className="text-[11px] text-muted-foreground">처리 이력</p>
          <p className="font-mono text-base font-bold sm:text-lg">{store.log}</p>
        </div>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${store.balance}%`, backgroundColor: store.tone === "bad" ? "#dc2626" : "#2563eb" }} />
      </div>
      <p className={`mt-2 text-xs font-semibold ${TONE_TEXT[store.tone]}`}>{store.status}</p>
    </div>
  );
}

export default function AtomicStoreViz() {
  return (
    <SceneShell
      eyebrow="처리 이력 저장"
      title="잔액과 처리 이력을 따로 쓰면 장애 한 번에 30원이 두 번 빠집니다"
      description="왼쪽은 두 기록을 따로 저장하고, 오른쪽은 두 기록을 하나의 원자적 저장 작업(전부 반영하거나 전부 취소)으로 묶습니다. 막대 길이는 잔액(100원 기준)이며, 잔액 100원은 본문의 가정입니다."
      ariaLabel="잔액과 처리 이력을 따로 저장할 때와 원자적으로 저장할 때 장애 후 재전송 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        return (
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <Column title="따로 저장" store={scene.split} />
            <Column title="원자적 저장 (한 작업으로 묶음)" store={scene.atomic} />
          </div>
        );
      }}
    />
  );
}
