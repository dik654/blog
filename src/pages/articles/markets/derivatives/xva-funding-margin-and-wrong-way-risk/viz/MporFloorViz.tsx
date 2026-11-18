import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — CRE53.24 위험기간 감독 하한: 환매조건부 거래만 있는 상계집합 5영업일,
 * 그 밖의 상계집합 10영업일, 거래 5,000건 초과·유동성 낮은 담보·대체하기 어려운 장외파생상품이
 * 들어 있는 상계집합 20영업일. CRE53.25: 직전 두 분기에 위험기간보다 오래 끈 마진콜 분쟁이
 * 두 번을 넘으면 다음 두 분기 동안 하한의 두 배 이상. 상계집합 예시는 설명용 가정이다.
 */
type Floor = 5 | 10 | 20;

const SCENES = [
  { label: "예시 A · 환매조건부 거래만", floor: 5, disputes: 0, summary: "하한 5영업일", note: "환매조건부 거래만 모인 상계집합(가정)입니다. 분쟁 조건에 걸리지 않으면 하한은 5영업일입니다." },
  { label: "예시 B · 일반 상계집합", floor: 10, disputes: 0, summary: "하한 10영업일", note: "20영업일 조건에 해당하지 않는 장외파생 상계집합(가정)입니다. 그 밖의 상계집합이라 하한은 10영업일입니다." },
  { label: "예시 C · 거래 5,000건 초과", floor: 20, disputes: 0, summary: "하한 20영업일", note: "거래가 5,000건을 넘는 상계집합(가정)입니다. 유동성이 낮은 담보나 대체하기 어려운 장외파생상품이 들어 있어도 같은 20영업일 칸으로 갑니다." },
  { label: "예시 D · 분쟁 2번", floor: 10, disputes: 2, summary: "두 번 → 하한 그대로 10", note: "예시 B와 같은 상계집합에서 직전 두 분기에 위험기간보다 오래 끈 마진콜 분쟁이 두 번 있었다고 놓았습니다(가정). '두 번을 넘으면'이 조건이라 하한은 바뀌지 않습니다." },
  { label: "예시 E · 분쟁 3번", floor: 10, disputes: 3, summary: "두 번 초과 → 20영업일 이상", note: "분쟁이 세 번이면(가정) 두 번을 넘었으므로 다음 두 분기 동안 하한 10의 두 배 이상, 곧 20영업일 이상을 씁니다." },
] as const;

const FLOORS: readonly { days: Floor; rule: string }[] = [
  { days: 5, rule: "환매조건부 거래만 있는 상계집합" },
  { days: 10, rule: "그 밖의 상계집합" },
  { days: 20, rule: "거래 5,000건 초과 · 유동성 낮은 담보 · 대체하기 어려운 장외파생상품이 든 상계집합" },
];

export default function MporFloorViz() {
  return (
    <SceneShell
      eyebrow="위험기간 하한"
      title="상계집합 종류로 하한을 고르고, 분쟁 횟수로 두 배를 확인합니다"
      description="위험기간은 담보를 다시 요구하고 받아 거래를 대체할 때까지 노출이 열려 있는 기간입니다. 상계집합은 서로 상계할 수 있는 거래 묶음입니다. 예시 A~E는 설명용 가정입니다."
      ariaLabel="바젤 CRE53.24와 CRE53.25의 위험기간 감독 하한 결정 순서"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const doubled = scene.disputes > 2;
        const final = doubled ? `${scene.floor * 2}영업일 이상` : `${scene.floor}영업일`;
        return (
          <div className="min-w-0 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground">① 상계집합 종류로 기본 하한 (CRE53.24)</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {FLOORS.map((item) => {
                const on = item.days === scene.floor;
                return (
                  <div key={item.days} className={`grid grid-cols-[4.25rem_minmax(0,1fr)] items-baseline gap-2 rounded-lg border px-3 py-1.5 text-xs leading-5 sm:block sm:py-2 ${on ? "border-[#2563eb] bg-[#2563eb]/10" : "border-border text-muted-foreground"}`}>
                    <span className={`block font-mono text-sm font-bold ${on ? "text-[#2563eb]" : ""}`}>{item.days}영업일</span>
                    <span className="block">{item.rule}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs font-semibold text-muted-foreground">② 직전 두 분기 위험기간보다 오래 끈 마진콜 분쟁 (CRE53.25)</p>
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
              <div className="flex gap-1" aria-label={`분쟁 ${scene.disputes}번`}>
                {[0, 1, 2].map((slot) => (
                  <span
                    key={slot}
                    className={`h-6 w-6 rounded-md border text-center text-xs leading-6 ${slot < scene.disputes ? (slot >= 2 ? "border-[#dc2626] bg-[#dc2626]/15 font-bold" : "border-[#d97706] bg-[#d97706]/15") : "border-dashed border-border"}`}
                  >
                    {slot < scene.disputes ? slot + 1 : ""}
                  </span>
                ))}
              </div>
              <span className="text-xs leading-5">{doubled ? "두 번을 넘음 → 다음 두 분기 하한 × 2 이상" : "두 번 이하 → 기본 하한 그대로"}</span>
            </div>
            <div className={`rounded-lg border px-3 py-2 text-sm ${doubled ? "border-[#dc2626]" : "border-[#2563eb]"}`}>
              <span className="text-xs text-muted-foreground">이 상계집합의 감독 하한 </span>
              <strong className="font-mono">{final}</strong>
            </div>
          </div>
        );
      }}
    />
  );
}
