import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case (#comparison 포함) — 고객이 FCM에 현금 100을 맡기고 선물 증거금으로 20이 필요하다.
 * 남은 80도 회사 자기 돈이나 대출 재원이 되지 않고, 100 전체가 고객 분리 계정에 표시된다.
 * 9절: 은행·청산소도 FCM 채무와 상계할 수 없다는 확인. 3·9절: 파산 때 분리 풀이 부족하면 전액 즉시 반환 보장은 없다.
 * 부족분의 크기는 본문에 없어 칸으로 그리지 않는다.
 */
const DEPOSIT = 100;
const MARGIN = 20;
const CELLS = Array.from({ length: DEPOSIT }, (_, index) => index);

const SCENES = [
  { label: "현금 100을 맡깁니다", summary: "고객 분리 계정 100", note: "고객이 FCM(선물중개회사)에 현금 100을 맡깁니다. 이 돈은 FCM 자기 자산 칸이 아니라 고객을 위한 분리 계정 칸에 표시됩니다." },
  { label: "증거금 20이 쓰입니다", summary: "증거금 20 · 남은 80", note: "선물 증거금으로 20이 필요합니다. 나머지 80은 당장 쓰이지 않지만 여전히 고객 계정 안에 있습니다. 칸 하나가 1입니다." },
  { label: "남은 80은 회사 돈이 아닙니다", summary: "운영자금·대출·상계 ✕", note: "쓰이지 않은 80도 회사의 자기 돈으로 바뀌거나 다른 사람에게 빌려 줄 재원이 되지 않습니다. 은행이나 청산소도 고객자금을 FCM 채무와 상계할 수 없다는 확인을 제공해야 합니다." },
  { label: "회사가 파산하면", summary: "전액 즉시 반환 보장은 없음", note: "분리 자금 풀이 부족하면 고객 청구가 전액 즉시 돌아온다는 보장은 없고, 부족분 처리와 파산 절차를 봐야 합니다. 분리는 시장 손실을 되돌리는 장치도 아닙니다. 부족분은 크기가 본문에 없어 칸으로 그리지 않았습니다." },
] as const;

const BLOCKED = ["남은 80 → 회사 자기 돈으로", "남은 80 → 다른 사람에게 대출", "고객 돈 → 은행·청산소가 FCM 채무와 상계"] as const;

export default function SegregatedHundredViz() {
  return (
    <SceneShell
      eyebrow="분리 장부"
      title="증거금 20만 쓰여도 100 전체가 고객 칸에 남습니다"
      description="왼쪽은 FCM 자기 자산, 오른쪽은 고객 분리 계정입니다. 분리 계정은 고객이 맡긴 돈과 재산을 회사 자산에서 떼어 고객을 위해 표시하는 계정입니다. 100과 20은 3절의 설명용 숫자입니다."
      ariaLabel="고객 현금 100 중 증거금 20이 쓰이고 남은 80도 고객 분리 계정에 남으며, 회사 파산 때 분리 풀 부족이면 전액 즉시 반환이 보장되지 않는 그림"
      scenes={SCENES}
      render={(active) => {
        const marginOn = active >= 1;
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-2 sm:gap-4">
              <div className={`flex min-w-0 flex-col justify-between rounded-lg border px-2 py-2 text-xs leading-5 ${active === 3 ? "border-red-600" : "border-border"}`}>
                <div>
                  <span className="block font-bold">FCM 자기 자산</span>
                  <span className="block text-muted-foreground">회사의 운영자금·채무</span>
                </div>
                <span className={`mt-2 block font-semibold ${active === 3 ? "text-red-700 dark:text-red-400" : "text-transparent"}`} aria-hidden={active !== 3}>회사 파산</span>
              </div>
              <div className="min-w-0 rounded-lg border border-blue-600 px-2 py-2">
                <p className="mb-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">고객 분리 계정 · 100</p>
                <svg viewBox="0 0 100 100" className="mx-auto block h-auto w-full max-w-[132px] sm:max-w-[180px]" role="img" aria-label={marginOn ? "100칸 중 20칸 증거금, 80칸 남은 잔액" : "100칸 모두 고객 현금"}>
                  {CELLS.map((cell) => {
                    const col = cell % 10;
                    const row = Math.floor(cell / 10);
                    const isMargin = marginOn && cell < MARGIN;
                    return <rect key={cell} x={col * 10 + 1} y={row * 10 + 1} width={8} height={8} rx={1} fill={isMargin ? "#d97706" : "#2563eb"} fillOpacity={isMargin ? 0.85 : 0.55} />;
                  })}
                </svg>
                <div className="mt-1.5 flex flex-wrap justify-center gap-x-3 text-[11px] leading-5">
                  <span className={marginOn ? "font-semibold text-amber-700 dark:text-amber-400" : "text-transparent"}>■ 증거금 {MARGIN}</span>
                  <span className="font-semibold text-blue-700 dark:text-blue-300">■ {marginOn ? `남은 ${DEPOSIT - MARGIN}` : `현금 ${DEPOSIT}`}</span>
                </div>
              </div>
            </div>
            <div className="grid min-w-0 [&>*]:col-start-1 [&>*]:row-start-1">
              <ul className={`grid grid-cols-1 content-start gap-1.5 sm:grid-cols-3 ${active === 3 ? "invisible" : active === 2 ? "" : "opacity-30"}`} aria-hidden={active === 3}>
                {BLOCKED.map((item) => (
                  <li key={item} className="rounded-lg border border-border px-2 py-1 text-[11px] leading-5">
                    <span className="mr-1 font-bold text-red-700 dark:text-red-400">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className={`self-start rounded-lg border border-red-600 px-3 py-2 text-xs leading-5 ${active === 3 ? "" : "invisible"}`} aria-hidden={active !== 3}>
                <span className="font-bold">분리 자금 풀이 부족하면</span>
                <span className="text-muted-foreground"> → 전액 즉시 반환 보장 없음 · 부족분 처리와 파산 절차 확인 · 시장 손실은 되돌리지 않음</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
