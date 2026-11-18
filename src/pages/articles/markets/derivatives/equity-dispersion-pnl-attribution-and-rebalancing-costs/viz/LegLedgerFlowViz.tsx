import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 종목 옵션 두 줄(매수)과 지수 옵션 한 줄(매도)이 델타 재조정 주문을 거쳐
 * 평가손익 장부와 비용 장부로 나뉜 뒤 합쳐집니다.
 * 숫자(가정, 3·7절): 평가 쪽 +13천(변동성 변화) +7천(실제 움직임) −4천(시간) = +16천,
 * 비용 쪽 −2천(주식 재조정 체결) −1천(옵션·주식 수수료) = −3천, 합계 +13천.
 */
const SCENES = [
  {
    label: "세 다리가 받는 것",
    summary: "종목 두 줄 매수 · 지수 한 줄 매도",
    focus: "legs",
    note: "종목 옵션 두 줄은 각각의 가격 변화와 실제 움직임을 받습니다. 지수 옵션 한 줄은 종목들이 함께 움직인 정도까지 포함한 지수 변화를 반대 방향으로 받습니다.",
  },
  {
    label: "델타를 주식 주문으로 맞춤",
    summary: "세 줄의 델타 → 중립에 가깝게",
    focus: "hedge",
    note: "델타는 주가가 조금 움직일 때 옵션 가격이 따라 움직이는 정도입니다. 세 줄의 델타를 주식을 사고팔아 중립에 가깝게 맞춥니다. 이 주문에서 비용이 생깁니다.",
  },
  {
    label: "주문 비용은 따로 남김",
    summary: "−2천 − 1천 = −3천",
    focus: "cost",
    note: "주식 재조정 체결의 미끄러짐 2천 달러와 옵션·주식 수수료 1천 달러는 옵션 평가손익과 섞지 않고 비용 장부에 따로 적습니다(가정).",
  },
  {
    label: "두 장부를 합침",
    summary: "+1만6천 − 3천 = +1만3천",
    focus: "sum",
    note: "평가 장부의 변동성 변화 1만3천·실제 움직임 7천·시간가치 −4천을 더한 1만6천에 비용 −3천을 붙이면 1만3천 달러입니다(가정). 둘을 나눠 두었기 때문에 다음 날 같은 전략을 계속할지 판단할 수 있습니다.",
  },
] as const;

type Focus = (typeof SCENES)[number]["focus"];

const ORDER: readonly Focus[] = ["legs", "hedge", "cost", "sum"];

function Box({ title, children, tone, on, strong }: { title: string; children: ReactNode; tone: string; on: boolean; strong: boolean }) {
  return (
    <div
      className="rounded-lg border bg-background px-3 py-2 text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none"
      style={{ borderColor: strong ? tone : "#cbd5e1", opacity: on ? 1 : 0.35 }}
    >
      <span className="block text-sm font-bold" style={{ color: strong ? tone : undefined }}>{title}</span>
      {children}
    </div>
  );
}

function Link({ on }: { on: boolean }) {
  return (
    <div className="flex items-center justify-center text-base font-bold" style={{ color: on ? "#475569" : "#cbd5e1" }} aria-hidden>
      <span className="sm:hidden">↓</span>
      <span className="hidden sm:inline">→</span>
    </div>
  );
}

export default function LegLedgerFlowViz() {
  return (
    <SceneShell
      eyebrow="다리와 장부"
      title="세 줄의 옵션이 두 장부를 거쳐 하루 손익이 됩니다"
      description="왼쪽은 옵션 다리, 가운데는 델타를 맞추는 주식 주문, 오른쪽은 평가손익과 비용을 따로 적는 두 장부입니다. 평가손익은 옵션 다리에서, 비용은 주문에서 옵니다. 숫자는 3·7절의 가정 장부입니다."
      ariaLabel="종목 옵션 두 줄과 지수 옵션 한 줄이 델타 재조정 주문을 거쳐 평가 장부와 비용 장부로 나뉘고 합계 1만3천 달러가 되는 흐름"
      scenes={SCENES}
      render={(active) => {
        const focus = SCENES[active].focus;
        const reached = (step: Focus) => ORDER.indexOf(step) <= active;
        return (
          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,0.9fr)_1.25rem_minmax(0,1fr)] sm:items-center">
            <div className="space-y-2">
              <Box title="A 옵션 · 매수" tone="#16a34a" on strong={focus === "legs"}>
                <span className="block text-muted-foreground">A의 가격 변화·실제 움직임</span>
              </Box>
              <Box title="B 옵션 · 매수" tone="#16a34a" on strong={focus === "legs"}>
                <span className="block text-muted-foreground">B의 가격 변화·실제 움직임</span>
              </Box>
              <Box title="지수 옵션 · 매도" tone="#dc2626" on strong={focus === "legs"}>
                <span className="block text-muted-foreground">함께 움직임을 포함한 지수 변화를 반대 방향으로</span>
              </Box>
            </div>
            <Link on={reached("hedge")} />
            <Box title="주식 주문" tone="#2563eb" on={reached("hedge")} strong={focus === "hedge"}>
              <span className="block text-muted-foreground">세 줄의 델타를 중립에 가깝게 맞춤</span>
            </Box>
            <Link on={reached("cost")} />
            <div className="space-y-2">
              <Box title="평가손익 장부" tone="#16a34a" on={reached("sum")} strong={focus === "sum"}>
                <span className="block text-muted-foreground">← 세 옵션 다리에서</span>
                <span className="block font-mono">변동성 변화 +1만3천</span>
                <span className="block font-mono">실제 움직임 +7천</span>
                <span className="block font-mono">시간가치 −4천</span>
                <span className="block font-mono font-bold">소계 +1만6천</span>
              </Box>
              <Box title="비용 장부(따로)" tone="#dc2626" on={reached("cost")} strong={focus === "cost"}>
                <span className="block text-muted-foreground">← 주식·옵션 주문에서</span>
                <span className="block font-mono">재조정 체결 −2천</span>
                <span className="block font-mono">옵션·주식 수수료 −1천</span>
                <span className="block font-mono font-bold">소계 −3천</span>
              </Box>
              <div
                className="rounded-lg border px-3 py-2 text-center text-sm font-bold transition-opacity duration-300 motion-reduce:transition-none"
                style={{ borderColor: focus === "sum" ? "#2563eb" : "#cbd5e1", opacity: reached("sum") ? 1 : 0.35 }}
              >
                하루 손익 <span className="font-mono">+1만3천 달러</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
