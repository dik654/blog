import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 시장가 6 채권(할인 가치 5.4)을 현금 5.4로 바꿀 때 순서.
 * 옛 채권을 먼저 돌려주면 현금 도착 전 받은 쪽 보유 담보가 0이 된다(무담보 구간).
 * 새 현금을 받은 뒤 돌려주면 보유 담보가 5.4 아래로 내려가지 않는다. 결제 실패 장면은 6절 경계 문장.
 */
type Holding = { bond: boolean; cash: boolean; caption: string; bad?: boolean };

const MAX = 10.8;
const UNIT = 5.4;
const CALL = 5;
const BAR_H = 84;

const SLOT_TITLES = ["교체 전", "1단계", "2단계"] as const;

const BEFORE: Holding = { bond: true, cash: false, caption: "채권 보유" };

const WRONG_OK: readonly Holding[] = [BEFORE, { bond: false, cash: false, caption: "옛 채권 반환", bad: true }, { bond: false, cash: true, caption: "현금 5.4 도착" }];
const SAFE_OK: readonly Holding[] = [BEFORE, { bond: true, cash: true, caption: "현금 5.4 도착 확인" }, { bond: false, cash: true, caption: "옛 채권 반환" }];
const WRONG_FAIL: readonly Holding[] = [BEFORE, { bond: false, cash: false, caption: "옛 채권 반환", bad: true }, { bond: false, cash: false, caption: "현금 결제 실패", bad: true }];
const SAFE_FAIL: readonly Holding[] = [BEFORE, { bond: true, cash: false, caption: "현금 결제 실패" }, { bond: true, cash: false, caption: "채권 반환 보류" }];

const SCENES = [
  { label: "교체 전", summary: "받은 쪽이 채권(인정 5.4)을 보유", shown: 1, fail: false, note: "받은 쪽은 시장가 6인 채권을 할인 가치 5.4로 인정해 들고 있습니다. 제공자는 이 채권을 되찾고 현금 5.4로 바꾸고 싶어 합니다." },
  { label: "1단계에서 갈립니다", summary: "먼저 반환하면 이 몫이 0", shown: 2, fail: false, note: "옛 채권을 먼저 돌려주면 새 현금이 도착하기 전까지 이 몫을 덮던 담보가 받은 쪽 손에 없습니다. 반대로 현금부터 받으면 잠시 두 자산을 함께 들고 있습니다." },
  { label: "2단계 뒤에는 같아 보입니다", summary: "두 순서 모두 현금 5.4", shown: 3, fail: false, note: "결제가 정상이면 두 순서 모두 현금 5.4로 끝납니다. 끝 상태는 같아도 중간에 무담보 구간이 있었는지가 다릅니다." },
  { label: "현금 결제가 실패하면", summary: "먼저 반환한 쪽만 무담보", shown: 3, fail: true, note: "현금이 도착하지 않으면 채권을 먼저 돌려준 쪽은 채권이 덮던 몫을 담보 없이 떠안습니다. 새 담보를 받은 뒤 반환하기로 했다면 채권을 아직 들고 있습니다." },
] as const;

function Slot({ holding, visible }: { holding: Holding; visible: boolean }) {
  const h = (UNIT / MAX) * BAR_H;
  const empty = visible && !holding.bond && !holding.cash;
  return (
    <div className="flex min-w-0 flex-col items-center gap-1">
      <div className="relative w-full max-w-[5.5rem] border-b" style={{ height: BAR_H, borderColor: "#94a3b8" }}>
        <div className="absolute inset-x-0 border-t border-dashed" style={{ bottom: (CALL / MAX) * BAR_H, borderColor: "#d97706" }} />
        {visible && holding.bond ? (
          <div className="absolute inset-x-2 flex items-center justify-center rounded-sm text-[11px] font-semibold" style={{ bottom: 0, height: h, backgroundColor: "#64748b", color: "#ffffff" }}>채권 5.4</div>
        ) : null}
        {visible && holding.cash ? (
          <div className="absolute inset-x-2 flex items-center justify-center rounded-sm text-[11px] font-semibold" style={{ bottom: holding.bond ? h : 0, height: h, backgroundColor: "#16a34a", color: "#ffffff" }}>현금 5.4</div>
        ) : null}
        {empty ? <div className="absolute inset-x-0 bottom-1 text-center text-[11px] font-bold" style={{ color: "#dc2626" }}>이 몫 0</div> : null}
      </div>
      <span className={`min-h-[2rem] text-center text-[11px] leading-4 ${visible ? (holding.bad ? "font-bold text-red-700 dark:text-red-400" : "text-foreground") : "text-muted-foreground/40"}`}>
        {visible ? holding.caption : "·"}
      </span>
    </div>
  );
}

function Lane({ title, row, shown }: { title: string; row: readonly Holding[]; shown: number }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-bold sm:text-sm">{title}</p>
      <div className="grid grid-cols-3 gap-2">
        {row.map((holding, slot) => (
          <Slot key={SLOT_TITLES[slot]} holding={holding} visible={slot < shown} />
        ))}
      </div>
    </div>
  );
}

export default function SubstitutionOrderViz() {
  return (
    <SceneShell
      eyebrow="담보 교체 순서"
      title="옛 채권을 언제 돌려주느냐가 무담보 구간을 만듭니다"
      description="칸 하나가 한 시점에서 받은 쪽이 교체 대상 몫으로 들고 있는 담보이고, 막대 높이는 인정 가치입니다. 그 전에 받아 둔 담보 5는 그대로라 그리지 않았습니다. 주황 점선은 이 채권이 채우던 호출액 5입니다."
      ariaLabel="담보 교체 때 옛 채권을 먼저 반환하는 순서와 새 현금을 먼저 받는 순서의 보유 담보 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-muted-foreground">
              {SLOT_TITLES.map((title) => <span key={title}>{title}</span>)}
            </div>
            <Lane title="옛 채권을 먼저 반환" row={scene.fail ? WRONG_FAIL : WRONG_OK} shown={scene.shown} />
            <Lane title="새 현금을 받은 뒤 반환" row={scene.fail ? SAFE_FAIL : SAFE_OK} shown={scene.shown} />
          </div>
        );
      }}
    />
  );
}
