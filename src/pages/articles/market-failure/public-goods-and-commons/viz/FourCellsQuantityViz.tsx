import type { ReactNode } from "react";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #excluding — 두 질문이 네 칸을 만들고 칸마다 수량이 어긋나는 방향이 다르다.
 * 점 하나가 가로등 한 개, 배 한 척, 사람 한 명이다. 숫자는 모두 본문의 예다.
 */
const FULL = "#2563eb";
const OVER = "#d97706";
const EMPTY = "#94a3b8";

function Dots({ on, off = 0, color = FULL }: { on: number; off?: number; color?: string }) {
  return (
    <svg viewBox={`0 0 ${(on + off) * 12} 12`} width={(on + off) * 12} height={12} className="block max-w-full" aria-hidden="true">
      {Array.from({ length: on + off }, (_, index) => (
        <circle
          key={index}
          cx={index * 12 + 6}
          cy={6}
          r={4}
          fill={index < on ? color : "none"}
          stroke={index < on ? color : EMPTY}
          strokeWidth={1}
        />
      ))}
    </svg>
  );
}

function Tally({ name, on, off, color }: { name: string; on: number; off?: number; color?: string }) {
  return (
    <div className="mt-1.5 min-w-0">
      <span className="block text-xs leading-5 text-muted-foreground">{name}</span>
      {on + (off ?? 0) > 0 && <Dots on={on} off={off} color={color} />}
    </div>
  );
}

function Cell({ goods, verdict, children }: { goods: string; verdict: string; children?: ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background p-2.5 sm:p-3">
      <p className="break-keep text-sm font-bold leading-5">{goods}</p>
      <p className="mt-1 break-keep text-xs font-bold leading-5 text-primary">{verdict}</p>
      {children}
    </div>
  );
}

function AxisHead({ children }: { children: ReactNode }) {
  return <p className="break-keep text-center text-xs font-bold leading-5 text-muted-foreground">{children}</p>;
}

export default function FourCellsQuantityViz() {
  return (
    <VizFrame
      eyebrow="네 칸의 어긋남"
      title="두 질문이 네 칸을 만들고 칸마다 어긋나는 방향이 다릅니다"
      description="가로는 내지 않은 사람을 빼놓을 수 있는지, 세로는 한 사람이 더 쓰면 남의 몫이 주는지입니다. 점은 이 글의 예에 나온 가로등 개수, 배 척수, 사람 수입니다."
      note="빵과 커피 칸은 앞 네 글의 계산이라 이 글의 숫자가 없습니다."
    >
      <div role="img" aria-label="빼놓을 수 있는지와 남의 몫이 주는지로 나눈 네 칸과 칸별 수량 어긋남" className="min-w-0">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <AxisHead>빼놓을 수 있음</AxisHead>
          <AxisHead>빼놓을 수 없음</AxisHead>

          <p className="col-span-2 border-t border-border pt-1.5 text-xs font-bold text-muted-foreground">남의 몫이 줌</p>
          <Cell goods="빵·커피" verdict="어긋나지 않음 · 값이 수량을 봉우리에서 멈춤">
            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">앞 네 글의 계산이 그대로 통합니다</p>
          </Cell>
          <Cell goods="호수" verdict="너무 많이 들어옴">
            <Tally name="맞는 척수 4" on={4} />
            <Tally name="실제 8척" on={8} color={OVER} />
          </Cell>

          <p className="col-span-2 border-t border-border pt-1.5 text-xs font-bold text-muted-foreground">남의 몫이 줄지 않음</p>
          <Cell goods="요금 받는 다리·이미 만들어진 지식" verdict="세워져도 들어올 사람이 빠짐">
            <Tally name="앞 예의 요금 7이면 셋 중 둘만" on={2} off={1} />
          </Cell>
          <Cell goods="가로등" verdict="덜 만들어짐">
            <Tally name="맞는 개수 2" on={2} />
            <Tally name="각자에게 맡기면 0개" on={0} off={2} />
          </Cell>
        </div>
      </div>
    </VizFrame>
  );
}
