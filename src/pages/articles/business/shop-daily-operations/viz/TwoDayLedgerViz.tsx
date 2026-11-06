import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 주문 자료는 판매를, 결제업체 자료는 차감액과 송금 대상을, 은행 자료는 실제 도착을 증명한다.
 * 160,000 + 156,800 = 316,800은 입금을 매출로 다시 더했을 때의 잘못된 값입니다. 막대 전체 폭 = 320,000원.
 */
const SCALE = 320_000;

const SCENES = [
  {
    label: "판매일",
    summary: "매출 160,000 · 은행 0",
    sales: 160_000,
    pending: 156_800,
    bank: 0,
    note: "판매 기록은 생겼지만 은행에는 아직 오지 않았습니다. 결제업체 자료의 정산 예정액은 은행 도착을 확인하기 전까지 미입금으로 남습니다.",
  },
  {
    label: "이틀 뒤",
    summary: "매출 160,000 · 은행 156,800",
    sales: 160_000,
    pending: 0,
    bank: 156_800,
    note: "은행에 15만6천800원이 도착해도 매출 줄은 그대로입니다. 16만 원과의 차이 3천200원은 수수료로 설명됩니다.",
  },
  {
    label: "입금을 매출로 또 적으면",
    summary: "160,000 + 156,800 = 316,800",
    sales: 316_800,
    pending: 0,
    bank: 156_800,
    note: "은행에 들어왔다고 매출을 다시 추가로 기록하면 한 번 판 물건을 두 번 판 셈이 됩니다. 빨간 부분이 실제로 없었던 판매입니다.",
  },
] as const;

function Row({ name, proof, value, color, extra = 0 }: { name: string; proof: string; value: number; color: string; extra?: number }) {
  const base = value - extra;
  return (
    <div className="text-xs sm:text-sm">
      <div className="flex items-baseline justify-between gap-2 leading-5">
        <span className="font-semibold">{name}</span>
        <span className="font-mono font-bold">{value.toLocaleString("en-US")}원</span>
      </div>
      <div className="relative mt-1 h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="absolute inset-y-0 left-0 rounded-sm" style={{ width: `${(base / SCALE) * 100}%`, backgroundColor: color }} />
        {extra > 0 && <div className="absolute inset-y-0" style={{ left: `${(base / SCALE) * 100}%`, width: `${(extra / SCALE) * 100}%`, backgroundColor: "#dc2626" }} />}
      </div>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{proof}</p>
    </div>
  );
}

export default function TwoDayLedgerViz() {
  return (
    <SceneShell
      eyebrow="이틀의 빈칸"
      title="같은 판매가 세 자료에 다른 날짜로 나타납니다"
      description="세 줄의 축척이 같습니다. 이 판매 한 묶음만 놓고 본 금액이며, 2%와 이틀은 이 글의 가정입니다."
      ariaLabel="판매일과 이틀 뒤의 매출, 미입금, 은행 도착 금액과 입금을 매출로 다시 적었을 때의 오류"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        return (
          <div className="space-y-3">
            <Row name="매출 기록" proof="주문 자료 · 판매를 증명" value={item.sales} color="#64748b" extra={scene === 2 ? 156_800 : 0} />
            <Row name="미입금 정산 예정" proof="결제업체 자료 · 차감액과 송금 대상을 증명" value={item.pending} color="#d97706" />
            <Row name="은행 도착" proof="은행 자료 · 실제 도착을 증명" value={item.bank} color="#2563eb" />
          </div>
        );
      }}
    />
  );
}
