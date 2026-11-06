import SceneShell from "./SceneShell";

/**
 * 본문 대응: #korea — 이자를 생략한 0.6억+0.5억 계산. 한도 1억은 금융기관별 1인당.
 * 같은 은행: 1.1억 중 한도 안 1억, 초과 0.1억. 다른 금융기관: 각각 한도와 비교.
 */
const SCALE = 1.25;
const pct = (value: number) => `${(value / SCALE) * 100}%`;
const LIMIT_LEFT = pct(1);

type Seg = { value: number; label: string; tone: 0 | 1 };
type Row = { name: string; segs: Seg[]; over?: boolean };

const SCENES: readonly { label: string; summary: string; rows: Row[]; note: string }[] = [
  {
    label: "같은 은행의 두 계좌",
    summary: "1.1억 중 한도 안 1억",
    rows: [{ name: "한 은행 · 계좌 두 개를 합산 0.6 + 0.5 = 1.1", segs: [{ value: 0.6, label: "0.6", tone: 0 }, { value: 0.5, label: "0.5", tone: 1 }], over: true }],
    note: "합계 1.1억 중 0.1억이 선을 넘습니다. 어느 계좌가 넘었는지가 아니라 합계로 따집니다. 그 0.1억이 곧바로 전액 손실이라는 뜻은 아니며, 한도 밖의 회수는 해당 절차와 자산 회수에 달립니다.",
  },
  {
    label: "서로 다른 금융기관",
    summary: "각각 한도와 비교",
    rows: [
      { name: "금융기관 ① (한도 1억)", segs: [{ value: 0.6, label: "0.6", tone: 0 }] },
      { name: "금융기관 ② (한도 1억)", segs: [{ value: 0.5, label: "0.5", tone: 1 }] },
    ],
    note: "합계는 같은 1.1억이어도 기관마다 따로 한도와 비교합니다. 0.6억과 0.5억 모두 1억 아래입니다.",
  },
  {
    label: "같은 은행의 다른 지점",
    summary: "기관은 하나 · 다시 합산",
    rows: [{ name: "한 은행 · 지점을 나눠 방문 0.6 + 0.5 = 1.1", segs: [{ value: 0.6, label: "0.6", tone: 0 }, { value: 0.5, label: "0.5", tone: 1 }], over: true }],
    note: "지점을 나눠 방문했다고 서로 다른 기관이 되지는 않으므로 첫 장면과 같은 계산입니다. 이 한도는 평소 송금 한도가 아니라 돌려줄 수 없을 때 적용하는 보호 범위입니다.",
  },
];

const FILL: Record<number, string> = { 0: "#2563eb", 1: "#0d9488" };

export default function DepositLimitViz() {
  return (
    <SceneShell
      eyebrow="보호 한도"
      title="한도 1억은 계좌가 아니라 금융기관별 1인당 합계에 걸립니다"
      description="단위는 억 원입니다. 일반적인 보호 대상 예·적금의 사례이고 이자는 생략했습니다. 2026년 10월 4일 확인한 금융위원회 안내의 2025년 9월 1일 시행 한도입니다."
      note="펀드 등 비보호 상품, 퇴직연금·연금저축·사고보험금, 상호금융은 이 합산 방식만으로 판단할 수 없습니다."
      ariaLabel="두 예금 0.6억과 0.5억을 한도 1억과 비교"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            {[0, 1].map((slot) => {
              const row = s.rows[slot];
              return (
                <div key={slot} className="min-h-[4.25rem]">
                  {row && (
                    <>
                      <p className="mb-1 text-xs font-semibold leading-5">{row.name}</p>
                      <div className="relative h-9 rounded bg-muted/40">
                        <div className="flex h-full">
                          {row.segs.map((seg, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-center border-r border-background font-mono text-xs font-bold text-white"
                              style={{ width: pct(seg.value), backgroundColor: FILL[seg.tone] }}
                            >
                              {seg.label}
                            </div>
                          ))}
                        </div>
                        {row.over && (
                          <>
                            <div aria-hidden="true" className="absolute inset-y-0 bg-red-600" style={{ left: pct(1), width: pct(0.1) }} />
                            <span className="absolute inset-y-0 flex items-center pl-1 font-mono text-xs font-bold text-red-700 dark:text-red-400" style={{ left: pct(1.1) }}>0.1</span>
                          </>
                        )}
                        <div aria-hidden="true" className="absolute -bottom-1 -top-1 w-px bg-foreground" style={{ left: LIMIT_LEFT }} />
                      </div>
                      <p className="relative mt-1 h-5 text-[11px] font-bold leading-5">
                        <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: LIMIT_LEFT }}>한도 1억</span>
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
