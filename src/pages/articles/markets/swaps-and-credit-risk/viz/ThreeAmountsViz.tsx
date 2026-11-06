import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 10억 원(명목원금)과 2000만 원(당기 순수취)을 같은 눈금에 놓는다.
 * 2000만 ÷ 10억 = 2%. 현재 시가는 글이 금액을 주지 않으므로 눈금 위에 올리지 않는다.
 */
const NOTIONAL = 100000;
const NET = 2000;

const SCENES = [
  { label: "명목원금 10억 원", summary: "이자 계산의 기준", focus: 0, note: "10억 원은 이자를 계산하는 기준입니다. 같은 통화 금리 스왑이라면 보통 이 돈 자체가 오가지 않습니다." },
  { label: "당기 순수취 2000만 원", summary: "10억 원의 2%", focus: 1, note: "실제로 이번 기간에 받은 차액은 2000만 원입니다. 같은 눈금에 놓으면 막대가 2% 길이입니다." },
  { label: "현재 시가", summary: "남은 지급들의 현재가치", focus: 2, note: "계약을 오늘 대체하는 비용은 앞으로 남은 지급들의 현재가치로 계산하므로 앞의 두 금액과 다시 다릅니다. 이 글은 금액을 정하지 않아 눈금에 올리지 않았습니다." },
  { label: "따로 집계하는 까닭", summary: "BIS의 세 집계는 서로 다릅니다", focus: 3, note: "BIS는 명목원금·총시가(현재 시가를 모은 값)·상계 후 신용노출을 따로 집계합니다. 당기 순수취는 그 셋이 아니라 흐리게 두었습니다. 신용노출은 상대가 지급하지 못할 때 잃을 수 있는 금액입니다." },
] as const;

function Row({ title, value, lit, children }: { title: string; value: string; lit: boolean; children: ReactNode }) {
  return (
    <div className={`transition-opacity duration-300 motion-reduce:transition-none ${lit ? "" : "opacity-40"}`}>
      <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
        <span className="font-semibold">{title}</span>
        <span className="font-mono font-bold">{value}</span>
      </div>
      {children}
    </div>
  );
}

export default function ThreeAmountsViz() {
  return (
    <SceneShell
      eyebrow="같은 10억 원, 다른 금액"
      title="10억 원과 2000만 원을 같은 눈금에 놓으면 차이가 보입니다"
      description="(가정) 10억 원 사례입니다. 위 두 막대는 같은 눈금이고, 점선 칸은 금액을 정하지 않아 길이에 뜻이 없습니다."
      ariaLabel="명목원금, 당기 순수취, 현재 시가의 크기 비교"
      scenes={SCENES}
      render={(active) => {
        const focus = SCENES[active].focus;
        return (
          <div className="min-w-0 space-y-2">
            <Row title="명목원금" value="10억 원" lit={focus === 0 || focus === 3}>
              <div className="h-7 rounded-sm bg-[#64748b]/60" />
            </Row>
            <Row title="당기 순수취" value="2000만 원" lit={focus === 1}>
              <div className="h-7 rounded-sm bg-muted/40">
                <div className="h-full rounded-sm bg-[#2563eb]" style={{ width: `${(NET / NOTIONAL) * 100}%` }} />
              </div>
            </Row>
            <Row title="현재 시가" value="글에 금액 없음" lit={focus === 2 || focus === 3}>
              <div className="flex h-7 items-center justify-center rounded-sm border border-dashed border-[#d97706] text-[11px] text-muted-foreground">눈금 없음</div>
            </Row>
            <Row title="상계 후 신용노출" value="글에 금액 없음" lit={focus === 3}>
              <div className="flex h-7 items-center justify-center rounded-sm border border-dashed border-[#d97706] text-[11px] text-muted-foreground">눈금 없음</div>
            </Row>
          </div>
        );
      }}
    />
  );
}
