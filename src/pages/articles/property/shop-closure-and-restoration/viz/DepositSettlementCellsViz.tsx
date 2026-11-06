import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #case — 같은 복구비 600만 원이 누구에게 먼저 지급되느냐에 따라 통장 입금액이 달라지는 과정.
 * 칸 하나 = 100만 원. 보증금 3천만 원 = 30칸, 미납 월세 = 4칸, 복구비 = 6칸. 금액은 본문의 (가정)과 같습니다.
 */
const SCENES = [
  { label: "맡긴 돈", summary: "30칸 = 3천만 원", deposit: "—", vendor: "—", net: "—", note: "임대인에게 맡겨 둔 보증금입니다. 여기서 무엇을 빼는지 칸으로 셉니다." },
  { label: "미납 월세", summary: "30칸 − 4칸 = 26칸", deposit: "—", vendor: "—", net: "—", note: "확정된 미납 월세 400만 원을 뺍니다. 여기까지는 복구비를 누가 내든 같습니다." },
  { label: "임대인이 복구 처리", summary: "26칸 − 6칸 = 20칸", deposit: "2천만 원", vendor: "0원", net: "2천만 원", note: "임대인이 복구 비용을 처리하고 돌려줄 돈에서 600만 원을 빼기로 유효하게 합의한 경우입니다. 단지 견적이라면 이 6칸은 아직 확정이 아닙니다." },
  { label: "점주가 직접 지급", summary: "26칸 입금, 6칸은 따로 나감", deposit: "2천600만 원", vendor: "600만 원", net: "2천만 원", note: "점주가 업체에 600만 원을 내고 약정한 복구를 마쳤다면 같은 비용을 보증금에서 다시 빼지 못합니다. 입금은 2천600만 원으로 늘지만 순유입은 같습니다." },
] as const;

type CellKind = "held" | "rent" | "repair" | "paid";

function cellKind(index: number, scene: number): CellKind {
  if (scene >= 1 && index >= 26) return "rent";
  if (scene === 2 && index >= 20) return "repair";
  if (scene >= 2) return "paid";
  return "held";
}

const CELL_CLASS: Record<CellKind | "vendor", string> = {
  held: "border-border bg-background text-muted-foreground",
  rent: "border-dashed border-amber-600 text-amber-700 dark:text-amber-400",
  repair: "border-dashed border-red-600 text-red-700 dark:text-red-400",
  paid: "border-primary bg-primary/15 text-primary",
  vendor: "border-red-600 bg-background text-red-700 dark:text-red-400",
};

const CELL_TEXT: Record<CellKind | "vendor", string> = { held: "", rent: "월", repair: "복", paid: "입", vendor: "업" };

const LEGEND = [
  { kind: "rent", text: "미납 월세로 공제" },
  { kind: "repair", text: "복구비로 공제" },
  { kind: "paid", text: "점주 통장에 입금" },
  { kind: "vendor", text: "업체에 직접 지급" },
] as const;

const CELLS = Array.from({ length: 30 }, (_, index) => index);
const VENDOR_CELLS = Array.from({ length: 6 }, (_, index) => index);

function Cell({ kind }: { kind: CellKind | "vendor" }) {
  return (
    <span className={`flex aspect-square items-center justify-center rounded border text-[11px] font-semibold transition-colors ${CELL_CLASS[kind]}`}>
      {CELL_TEXT[kind]}
    </span>
  );
}

export default function DepositSettlementCellsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const scene = SCENES[active];

  return (
    <VizFrame
      documentFlow
      className="!h-auto !max-h-none"
      eyebrow="보증금 정산"
      title="같은 복구비 600만 원인데 통장에 들어오는 돈은 왜 다를까요"
      description="칸 하나가 100만 원입니다. 복구비는 공간을 약정한 상태로 돌려놓는 데 드는 돈이고, 순유입은 입금액에서 따로 낸 복구비를 뺀 금액입니다."
      note="금액과 정산 조건은 모두 (가정)입니다. 고객 환불·임금·세금·대출은 넣지 않았으므로 2천만 원이 폐업 뒤 최종적으로 남는 돈이라고 단정할 수 없습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="보증금 30칸에서 미납 월세와 복구비를 빼고 두 지급 경로의 입금액을 비교하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <div className="mx-auto mt-4 w-full max-w-[440px]">
          <p className="text-xs font-semibold text-muted-foreground">임대인이 맡아 둔 보증금</p>
          <div className="mt-2 grid grid-cols-10 gap-1">
            {CELLS.map((index) => (
              <Cell key={index} kind={cellKind(index, active)} />
            ))}
          </div>
          <div className={active === 3 ? "visible" : "invisible"} aria-hidden={active !== 3}>
            <p className="mt-3 text-xs font-semibold text-muted-foreground">보증금과 별도로 점주가 업체에 낸 돈</p>
            <div className="mt-2 grid grid-cols-10 gap-1">
              {VENDOR_CELLS.map((index) => (
                <Cell key={index} kind="vendor" />
              ))}
            </div>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {LEGEND.map((item) => (
              <li key={item.kind} className="flex items-center gap-1.5">
                <span className="w-5 shrink-0"><Cell kind={item.kind} /></span>
                {item.text}
              </li>
            ))}
          </ul>
          <dl className="mt-4 divide-y divide-border border-y border-border text-sm">
            <div className="flex items-baseline justify-between gap-3 py-1.5">
              <dt className="text-muted-foreground">통장에 들어오는 돈</dt>
              <dd className="font-mono font-semibold">{scene.deposit}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 py-1.5">
              <dt className="text-muted-foreground">따로 낸 복구비</dt>
              <dd className="font-mono font-semibold">{scene.vendor}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 py-1.5">
              <dt className="font-semibold">순유입</dt>
              <dd className="font-mono font-bold text-primary">{scene.net}</dd>
            </div>
          </dl>
        </div>
        <StableSceneStack
          active={active}
          className="mt-4"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((item) => item.label)} />
        <StaticSceneList labels={SCENES.map((item) => item.label)} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
