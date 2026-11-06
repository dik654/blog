import SceneShell from "./SceneShell";

/**
 * 본문 대응: #other-creation — 대출이 아닌 네 거래가 은행 장부의 어느 칸을 움직이는지.
 * 칸 순서: 채권, 준비금 / 고객 예금, 다른 부채. 모든 장면에서 자산 증감 합 = 부채 증감 합.
 */
const SCENES = [
  { label: "은행이 고객 채권을 삼", summary: "고객 예금 +6", flow: "비은행 고객의 채권 6 → 은행", d: [6, 0, 6, 0], check: "+6 = +6", note: "새 대출이 없어도 예금이 늘 수 있습니다. 고객은 채권을 예금으로 바꿨을 뿐이므로 이것만으로 순재산이 6 늘지는 않습니다." },
  { label: "중앙은행이 은행 채권을 삼", summary: "고객 예금 변화 없음", flow: "은행의 채권 6 → 중앙은행", d: [-6, 6, 0, 0], check: "−6 + 6 = 0", note: "은행의 채권이 준비금으로 바뀔 수 있습니다. 고객 예금의 변화는 이 거래 자체에 없습니다." },
  { label: "중앙은행이 고객 채권을 삼", summary: "준비금 +6 · 고객 예금 +6", flow: "비은행 고객의 채권 6 → 은행을 통해 → 중앙은행", d: [0, 6, 6, 0], check: "+6 = +6", note: "앞 장면과 사는 쪽이 같아도 파는 쪽이 고객이면 은행의 준비금과 그 고객 예금이 함께 늘 수 있습니다." },
  { label: "고객이 은행 장기 채권을 삼", summary: "고객 예금 −6 · 다른 부채 +6", flow: "고객 예금 6 → 은행이 발행한 장기 채권", d: [0, 0, -6, 6], check: "0 = −6 + 6", note: "은행의 예금 부채 6이 다른 종류의 부채 6으로 바뀔 수 있습니다." },
] as const;

function Delta({ name, value }: { name: string; value: number }) {
  return (
    <div className={`rounded-lg border px-3 py-2 ${value === 0 ? "border-border/50" : "border-primary bg-primary/5"}`}>
      <p className="text-xs leading-5 text-muted-foreground">{name}</p>
      <p className={`font-mono text-lg font-bold ${value === 0 ? "text-muted-foreground/60" : "text-primary"}`}>{value === 0 ? "0" : `${value > 0 ? "+" : "−"}${Math.abs(value)}`}</p>
    </div>
  );
}

export default function AssetPurchasePathsViz() {
  return (
    <SceneShell
      eyebrow="대출 밖의 경로"
      title="거래 상대에 따라 고객 예금은 늘 수도, 그대로일 수도, 줄 수도 있습니다"
      description="모두 6(억 원)의 별도 거래이며 앞 장면에 이어지지 않습니다. 칸의 숫자는 은행 장부의 증감입니다."
      note="네 거래는 ‘될 수 있다’는 경로입니다. 통화지표마다 포함하는 범위가 다르므로 전체 통계는 자산 거래, 상대방 부문, 현금 전환, 포함 상품을 함께 확인해야 합니다."
      ariaLabel="대출 없이 은행 장부를 바꾸는 네 거래"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0">
            <p className="rounded-lg border border-border/60 px-3 py-2 text-sm font-semibold leading-6">{s.flow}</p>
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
              <p className="text-xs font-bold">은행의 자산</p>
              <p className="text-xs font-bold">은행의 부채</p>
              <Delta name="채권" value={s.d[0]} />
              <Delta name="고객 예금" value={s.d[2]} />
              <Delta name="준비금" value={s.d[1]} />
              <Delta name="다른 부채" value={s.d[3]} />
            </div>
            <p className="mt-3 text-center font-mono text-sm font-bold">{s.check}</p>
          </div>
        );
      }}
    />
  );
}
