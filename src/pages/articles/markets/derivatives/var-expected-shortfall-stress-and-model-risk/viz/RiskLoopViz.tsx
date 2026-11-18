import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 장부→위험요인→시장 자료→시나리오 재평가→손익분포(VaR·ES)→다음 날 실제 손익 비교→예외 기록,
 * 반복되면 모형 수정 또는 별도 한도로 되돌아갑니다. 스트레스 손실이 자본·현금·담보 한도를 넘으면 축소·헤지·자금 확보,
 * 그 전에 위기 때 거래 가능 여부와 부서 간 중복 계산을 검증합니다.
 * 한도 값과 실제 다음 날 손익은 본문에 없어 숫자를 적지 않습니다. VaR 4·ES 8·스트레스 18은 3·4절 값입니다.
 */
const MEASURE = ["거래 장부를 위험요인에 연결", "시장 자료 정리", "시나리오마다 재평가", "손익분포 → VaR 4 · ES 8"] as const;
const CHECK = ["실제 다음 날 손익과 비교", "예외 기록", "반복되면 모형 수정 또는 별도 한도"] as const;
const ACTION = ["스트레스 손실 18 vs 자본·현금·담보 한도", "넘으면 포지션 축소 · 헤지 · 자금 확보", "검증: 위기 때 거래가 가능한가 · 부서 간 중복 계산은 없는가"] as const;

const SCENES = [
  { label: "측정", summary: "장부 → 재평가 → VaR·ES", lit: { measure: 4, check: 0, action: 0 }, loop: false, note: "거래 장부를 금리·환율·주가·변동성 같은 위험요인에 연결하고 시장 자료를 정리한 뒤 시나리오마다 다시 평가합니다. 모은 손익분포에서 VaR와 ES를 구합니다." },
  { label: "사후 비교", summary: "모형 숫자 vs 실제 손익", lit: { measure: 4, check: 2, action: 0 }, loop: false, note: "계산한 VaR를 실제 다음 날 손익과 비교하고, 실제 손실이 문턱을 넘은 날을 예외로 기록합니다. 비교할 실제 손익 값은 본문에 없어 적지 않았습니다." },
  { label: "고쳐서 다시", summary: "반복 예외 → 모형 수정 또는 별도 한도", lit: { measure: 4, check: 3, action: 0 }, loop: true, note: "모형이 놓친 요인이 반복되면 모형을 고치거나 별도 한도를 둡니다. 모형을 고치면 다시 재평가 단계로 돌아가 숫자를 새로 구하는 순환이 되고, 별도 한도는 모형을 고치는 대신 그 요인에 따로 거는 다른 길입니다." },
  { label: "한도와 행동", summary: "스트레스 18 > 한도? → 행동", lit: { measure: 4, check: 3, action: 2 }, loop: false, note: "스트레스 손실이 자본·현금·담보 한도를 넘으면 포지션 축소, 헤지, 자금 확보 같은 행동을 정합니다. 한도 값은 본문에 없어 비교 결과를 정해 두지 않았습니다." },
  { label: "함께 검증할 것", summary: "위기 때 가능한가 · 중복은 없는가", lit: { measure: 4, check: 3, action: 3 }, loop: false, note: "위기 때 그 거래가 실제로 가능한지, 여러 부서가 같은 포지션을 중복 계산하지 않는지도 검증해야 합니다." },
] as const;

function Column({ title, items, lit, tone, latest }: { title: string; items: readonly string[]; lit: number; tone: string; latest: boolean }) {
  return (
    <div className="min-w-0 rounded-lg border border-border p-2">
      <p className="mb-1.5 text-xs font-bold" style={{ color: tone }}>{title}</p>
      {latest ? null : <p className="text-xs text-muted-foreground sm:hidden">{lit === 0 ? "아직 이 단계에 오지 않음" : `${lit}단계 지남`}</p>}
      <ol className={`space-y-1 ${latest ? "" : "hidden sm:block"}`}>
        {items.map((item, itemIndex) => {
          const on = itemIndex < lit;
          const current = latest && itemIndex === lit - 1;
          return (
            <li key={item} className={`rounded-md border px-2 py-1 text-xs leading-5 ${on ? "" : "text-muted-foreground/50"} ${current ? "font-semibold" : ""}`} style={{ borderColor: current ? tone : on ? "#cbd5e1" : "transparent" }}>
              {item}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function RiskLoopViz() {
  return (
    <SceneShell
      eyebrow="숫자에서 행동까지"
      title="위험 숫자는 사후 비교로 고쳐지고 한도에서 행동이 됩니다"
      description="① 측정, ② 실제 손익과의 사후 비교, ③ 한도와 행동의 세 묶음입니다. VaR 4·ES 8·스트레스 18은 3·4절의 설명용 숫자이며, 한도와 실제 다음 날 손익은 본문에 값이 없습니다."
      ariaLabel="위험 측정, 사후 비교와 모형 수정 순환, 스트레스 손실과 한도 비교 후 행동과 검증의 순서"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const latestColumn = index === 0 ? 0 : index <= 2 ? 1 : 2;
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid min-w-0 gap-2 sm:grid-cols-3">
              <Column title="① 측정" items={MEASURE} lit={scene.lit.measure} tone="#2563eb" latest={latestColumn === 0} />
              <Column title="② 사후 비교" items={CHECK} lit={scene.lit.check} tone="#b45309" latest={latestColumn === 1} />
              <Column title="③ 한도와 행동" items={ACTION} lit={scene.lit.action} tone="#7c3aed" latest={latestColumn === 2} />
            </div>
            <p className={`rounded-md border border-dashed px-2 py-1 text-center text-xs ${scene.loop ? "border-[#b45309] font-semibold text-[#b45309]" : "border-transparent text-muted-foreground/40"}`}>
              ↺ 모형을 고치면 ① 재평가부터 다시 · 또는 그 요인에 별도 한도
            </p>
          </div>
        );
      }}
    />
  );
}
