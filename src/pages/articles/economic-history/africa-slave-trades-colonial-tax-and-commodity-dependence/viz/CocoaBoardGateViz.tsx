import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names 셋째·넷째 문단 — 가나 코코아보드의 수출 관문과 두 가격.
 * 1984년 PNDC Law 81 4조 6항: 보드 소유이거나, 보드 인증기관이 등급·봉인 뒤 서면으로 수출을 허가한 코코아가 아니면 유통·수출 불가.
 * 2000년 10월부터: 면허 민간 구매회사가 사들인 코코아의 일부를 직접 수출.
 * 가격: 평균 선적가격(FOB) 2,538달러/톤(2020/21), 생산자가격 10,560세디 = 1,769달러/톤(2021/22).
 * 연도·환산 시점이 달라 두 값의 뺄셈을 보드 몫으로 적지 않는다.
 */
const BOARD = "#7c3aed";
const OK = "#16a34a";
const NO = "#dc2626";
const LBC = "#2563eb";
const SLATE = "#64748b";

const AXIS_MAX = 3000;
const FOB = 2538;
const PRODUCER = 1769;

const SCENES = [
  { label: "수출로 가는 관문은 보드에 있습니다", summary: "1984년 법 4조 6항", note: "1984년 가나 코코아보드법(PNDC Law 81) 4조 6항입니다. 보드 소유 코코아이거나, 보드의 인증기관이 등급을 매기고 봉인한 뒤 서면으로 수출을 허가한 코코아만 유통·수출할 수 있습니다. 그 밖의 코코아는 누구도 유통·수출할 수 없어 보드가 수출을 독점하는 구조가 됩니다." },
  { label: "2000년 10월부터 길이 하나 더", summary: "면허 구매회사의 일부 직접 수출", note: "2000년 10월부터는 면허를 받은 민간 구매회사가 사들인 코코아의 일부를 직접 수출할 수 있게 됐습니다(보드의 코코아 수출 규정, 확인일 2026-10-10). 이 길이 위 관문의 등급·봉인·서면 허가를 거치는지, 나머지 몫이 어디로 가는지는 글에 없어 선을 긋지 않았습니다. 따로 그린 줄은 관문을 건너뛴다는 뜻이 아닙니다." },
  { label: "두 끝의 가격 사이", summary: "세계가격 2,538 · 생산자가격 1,769", note: "농가에 가지 않은 몫에서 운송·가공·보드 운영비와 안정화기금이 나온다는 구조를 읽는 그림입니다. 두 숫자는 연도와 환산 시점이 달라 그 차이가 정확한 보드 몫은 아닙니다. 3절의 매출 20·세금 10 장부로 옮기면 이 차이는 세금 10과 같은 자리에 들어옵니다." },
] as const;

function Box({ x, y, w, h, lines, color, dashed = false }: { x: number; y: number; w: number; h: number; lines: readonly string[]; color: string; dashed?: boolean }) {
  const top = y + h / 2 - ((lines.length - 1) * 14) / 2 + 4;
  return (
    <g>
      <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} rx={8} fill={color} fillOpacity={0.1} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={top + index * 14} textAnchor="middle" fontSize={11} fontWeight={index === 0 ? 700 : 500} fill="currentColor">{line}</text>
      ))}
    </g>
  );
}

function Arrow({ d, color, head }: { d: string; color: string; head: string }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={1.25} markerEnd={`url(#${head})`} />;
}

function RouteMap({ withLbc }: { withLbc: boolean }) {
  const head = withLbc ? "cocoa-head-b" : "cocoa-head-a";
  return (
    <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={withLbc ? "보드 관문과 2000년 10월 이후 면허 민간 구매회사의 일부 직접 수출" : "보드 관문을 거친 코코아만 유통·수출 가능"}>
      <defs>
        <marker id={head} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" fill="#64748b" />
        </marker>
      </defs>
      <Box x={4} y={70} w={68} h={44} lines={["코코아", "생산"]} color={SLATE} />

      <Box x={102} y={6} w={156} h={76} lines={["보드 관문", "보드 소유 코코아", "또는 인증기관 등급·봉인", "+ 서면 수출 허가"]} color={BOARD} />
      <Box x={290} y={22} w={66} h={44} lines={["유통·", "수출 가능"]} color={OK} />
      <Arrow d="M72,84 L100,56" color={SLATE} head={head} />
      <Arrow d="M258,44 L287,44" color={OK} head={head} />

      <Box x={102} y={98} w={156} h={40} lines={["관문을 거치지 않은 코코아"]} color={NO} dashed />
      <Box x={290} y={96} w={66} h={44} lines={["유통·", "수출 불가"]} color={NO} dashed />
      <Arrow d="M72,100 L100,114" color={SLATE} head={head} />
      <g stroke={NO} strokeWidth={1.25}>
        <line x1={262} y1={118} x2={286} y2={118} />
        <line x1={268} y1={112} x2={280} y2={124} />
        <line x1={268} y1={124} x2={280} y2={112} />
      </g>

      <g opacity={withLbc ? 1 : 0}>
        <text x={102} y={162} fontSize={11} fontWeight={700} fill={LBC}>2000년 10월부터</text>
        <Box x={102} y={170} w={156} h={52} lines={["면허 민간 구매회사", "사들인 코코아의 일부", "관문과의 관계: 글에 없음"]} color={LBC} />
        <Box x={290} y={174} w={66} h={44} lines={["직접", "수출"]} color={LBC} />
        <Arrow d="M50,114 L50,196 L100,196" color={SLATE} head={head} />
        <Arrow d="M258,196 L287,196" color={LBC} head={head} />
      </g>
    </svg>
  );
}

function PriceBar({ label, sub, value, color }: { label: string; sub: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-sm">
        <span className="font-semibold">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">{sub}</span>
      </div>
      <div className="relative h-5 rounded-sm bg-muted/30">
        <div className="absolute inset-y-0 left-0 rounded-sm border" style={{ width: `${(value / AXIS_MAX) * 100}%`, backgroundColor: color, borderColor: color, opacity: 0.85 }} />
      </div>
    </div>
  );
}

function PriceGap() {
  const producerPct = (PRODUCER / AXIS_MAX) * 100;
  const fobPct = (FOB / AXIS_MAX) * 100;
  return (
    <div className="mx-auto max-w-[560px] space-y-4 py-2">
      <PriceBar label="세계시장 평균 선적가격(FOB)" sub="2,538달러/톤 · 2020/21 · 생활소득차액 포함" value={FOB} color={BOARD} />
      <div className="space-y-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-sm">
          <span className="font-semibold">농가 생산자가격</span>
          <span className="font-mono text-xs text-muted-foreground">10,560세디(1,769달러)/톤 · 2021/22</span>
        </div>
        <div className="relative h-5 rounded-sm bg-muted/30">
          <div className="absolute inset-y-0 left-0 rounded-sm border" style={{ width: `${producerPct}%`, backgroundColor: OK, borderColor: OK, opacity: 0.85 }} />
          <div className="absolute inset-y-0 rounded-sm border border-dashed" style={{ left: `${producerPct}%`, width: `${fobPct - producerPct}%`, borderColor: NO }} />
        </div>
      </div>
      <div className="relative h-4 text-[11px] text-muted-foreground">
        {[0, 1000, 2000, 3000].map((tick) => (
          <span key={tick} className={`absolute font-mono ${tick === 0 ? "" : tick === AXIS_MAX ? "-translate-x-full" : "-translate-x-1/2"}`} style={{ left: `${(tick / AXIS_MAX) * 100}%` }}>{tick.toLocaleString("ko-KR")}</span>
        ))}
      </div>
      <p className="rounded-lg border border-dashed border-red-600/70 px-3 py-2 text-sm leading-6">
        빨간 점선 칸: 운송·가공·보드 운영비와 안정화기금이 나오는 자리입니다. 연도와 환산 시점이 달라 이 칸의 길이를 보드 몫으로 읽지 않습니다.
      </p>
      <p className="text-xs leading-5 text-muted-foreground">생산자가격은 생산자가격심의위원회가 정합니다. 선적가격(FOB)은 수출항에서 배에 실을 때까지를 포함한 값입니다.</p>
    </div>
  );
}

export default function CocoaBoardGateViz() {
  return (
    <SceneShell
      eyebrow="가나 코코아보드"
      title="코코아가 수출되려면 보드의 관문을 지나야 했습니다"
      description="법 조문의 길을 상자와 화살표로, 두 가격을 같은 축의 막대로 그렸습니다. 마지막 장면의 축 단위는 톤당 달러입니다."
      ariaLabel="가나 코코아보드법의 수출 관문, 2000년 이후 민간 구매회사의 일부 직접 수출, 세계가격과 생산자가격"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={[<RouteMap key="a" withLbc={false} />, <RouteMap key="b" withLbc />, <PriceGap key="c" />]} />}
    />
  );
}
