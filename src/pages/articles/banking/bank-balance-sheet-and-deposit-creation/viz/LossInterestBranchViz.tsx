import LedgerCell from "./LedgerCell";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #loss-interest — 원금 상환·손실 인식·제각·이자 수취가 서로 다른 칸을 바꾼다.
 * 상환 14+90=96+8 → 14+86=92+8, 손실 14+83=92+5, 이자 14+86=91+9.
 * 제각 숫자: 손실 3이 충당금으로 쌓였다고 둔 가정. 총대출 86→83, 충당금 3→0, 순대출 83 그대로.
 */
const SCENES = [
  { label: "갚은 원금 4", summary: "대출 −4 · 예금 −4", loan: "대출 원금", from: [14, 90, 96, 8], to: [14, 86, 92, 8], equation: "14 + 86 = 92 + 8", inner: "공장이 자기 예금으로 갚은 경우입니다. 대출 원금 90 → 86", note: "실제로 돈을 낸 거래라 받을 돈과 고객 통장이 함께 줄어듭니다. 8절에서 본 움직임이고, 나머지 장면과 비교할 기준입니다." },
  { label: "못 받을 손실 3", summary: "순대출 −3 · 자본 −3", loan: "순대출", from: [14, 86, 92, 8], to: [14, 83, 92, 5], equation: "14 + 83 = 92 + 5", inner: "순대출은 대출에서 인식한 손실을 뺀 금액입니다. 아직 비용에 반영하지 않은 손실을 상환 뒤 장부에서 새로 인식합니다.", note: "차주가 예금 3을 지급한 거래가 없으므로 예금 92를 지울 이유가 없습니다. 줄어드는 곳은 순대출과 자본입니다." },
  { label: "이미 쌓은 충당금을 제각 (가정)", summary: "순대출·자본 그대로", loan: "순대출", from: [14, 83, 92, 5], to: [14, 83, 92, 5], equation: "14 + 83 = 92 + 5", inner: "손실 장면에 이어집니다. 총대출 86 → 83 · 충당금 3 → 0 · 순대출 83 그대로", note: "충당금은 예상 손실을 미리 비용으로 적어 대출에서 차감하는 금액이고, 제각은 회수 기대가 없는 금액을 총대출에서 지우는 일입니다. 위의 3이 전부 충당금에 있었다고 가정하면 자본을 5에서 2로 또 빼는 것은 이중 계산입니다." },
  { label: "다른 차주의 이자 1", summary: "예금 −1 · 자본 +1", loan: "대출 원금", from: [14, 86, 92, 8], to: [14, 86, 91, 9], equation: "14 + 86 = 91 + 9", inner: "손실이 없던 상환 뒤 장부로 돌아갑니다. 미수이자·비용·세금을 생략한 현금 기준이며 대출 원금 86은 그대로", note: "잔액이 0인 공장 대신 예금 1 이상을 가진 다른 차주가 낸다고 둡니다. 은행이 이후 급여나 배당을 지급하면 수취인의 예금은 다시 늘 수 있습니다." },
] as const;


export default function LossInterestBranchViz() {
  return (
    <SceneShell
      eyebrow="네 가지 사건"
      title="같은 ‘줄었다’도 사건마다 줄어드는 칸이 다릅니다"
      description="단위는 억 원입니다. 왼쪽 두 칸은 자산, 오른쪽 두 칸은 부채와 자본입니다. 손실과 이자는 상환 뒤 장부 14 + 86 = 92 + 8에서 따로 갈라지는 분기이고, 제각만 손실 장면에 이어집니다."
      ariaLabel="원금 상환, 손실 인식, 제각, 이자 수취의 장부 변화 비교"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[0, 2, 1, 3].map((i) => {
                const name = ["준비금", s.loan, "예금", "자본"][i];
                return <LedgerCell key={name} name={name} before={s.from[i]} after={s.to[i]} />;
              })}
            </div>
            <p className="mt-3 text-center font-mono text-sm font-bold">{s.equation}</p>
            <p className="mt-2 rounded-lg border border-border/60 px-3 py-2 text-xs leading-5 text-muted-foreground">{s.inner}</p>
          </div>
        );
      }}
    />
  );
}
