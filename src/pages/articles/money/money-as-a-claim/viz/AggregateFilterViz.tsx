import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #aggregation-procedure — 본문에 나온 다섯 가지 잔액을 절차의 세 단계(발행자 → 보유자 → 유동성 문턱)에 통과시켜
 * 어떤 것이 M1, M2에 남고 어떤 것이 어느 단계에서 빠지는지 같은 칸 위에서 보여 준다.
 * 은행 간 예금 장면의 100·30은 두 번 세는 모양을 보이려는 가정 숫자다.
 */
type Fate = "keep" | "out" | "m1" | "m2";

interface Item {
  name: string;
  issuer: string;
  holder: string;
  liquidity: string;
}

const ITEMS: readonly Item[] = [
  { name: "현금(한국은행권)", issuer: "중앙은행", holder: "가계", liquidity: "즉시" },
  { name: "바로 꺼내 쓰는 예금", issuer: "은행", holder: "가계·기업", liquidity: "즉시" },
  { name: "2년 미만 정기예적금", issuer: "은행", holder: "가계·기업", liquidity: "2년 미만" },
  { name: "은행 A가 B에 맡긴 예금", issuer: "은행 B", holder: "은행 A", liquidity: "즉시" },
  { name: "교통카드 잔액", issuer: "교통카드사", holder: "가계", liquidity: "즉시" },
];

interface Scene {
  label: string;
  summary: string;
  note: string;
  fates: readonly Fate[];
  reasons: readonly string[];
  focus: "issuer" | "holder" | "liquidity" | null;
}

const SCENES: readonly Scene[] = [
  {
    label: "다섯 줄",
    summary: "발행자·보유자·꺼내기 쉬운 정도",
    note: "본문에 나온 잔액 다섯 가지를 올려놓습니다. 줄마다 누가 갚아야 하는 빚인지(발행자), 누가 들고 있는지(보유자), 얼마나 빨리 현금으로 바꿀 수 있는지를 적었습니다.",
    fates: ["keep", "keep", "keep", "keep", "keep"],
    reasons: ["", "", "", "", ""],
    focus: null,
  },
  {
    label: "1 발행자",
    summary: "예금취급기관의 빚인가",
    note: "예금취급기관은 예금을 받는 금융기관과 중앙은행을 묶어 부르는 통계 분류입니다. 교통카드 잔액은 발행자의 빚이지만 발행자가 여기에 들지 않아 첫 단계에서 갈립니다.",
    fates: ["keep", "keep", "keep", "keep", "out"],
    reasons: ["", "", "", "", "1단계: M1·M2 밖"],
    focus: "issuer",
  },
  {
    label: "2 보유자",
    summary: "130을 세면 30이 두 번 (가정)",
    note: "가계가 은행 A에 100을, 은행 A가 그중 30을 은행 B에 맡겼다면(가정) 둘을 다 세어 130이 되지만 가계가 쥔 돈은 100입니다. 같은 돈이 두 번 잡히지 않게 은행끼리의 30을 뺍니다.",
    fates: ["keep", "keep", "keep", "out", "out"],
    reasons: ["", "", "", "2단계: 제외", "1단계: M1·M2 밖"],
    focus: "holder",
  },
  {
    label: "3 문턱: 즉시",
    summary: "M1 = 현금 + 바로 꺼내 쓰는 예금",
    note: "문턱을 즉시 꺼내 쓸 수 있는 것으로 낮게 잡으면 현금과 바로 꺼내 쓰는 예금만 남습니다. 이것이 M1입니다. 2년 미만 정기예적금은 문턱을 넘지 못합니다.",
    fates: ["m1", "m1", "keep", "out", "out"],
    reasons: ["M1", "M1", "문턱 밖", "2단계: 제외", "1단계: M1·M2 밖"],
    focus: "liquidity",
  },
  {
    label: "3 문턱: 2년 미만",
    summary: "M2 = M1 + 2년 미만 정기예적금",
    note: "문턱을 2년 미만으로 높이면 정기예적금이 더해져 M2가 됩니다. 같은 목록도 문턱에 따라 숫자가 달라지므로 쓴 문턱을 지표 이름과 함께 적습니다. 더 넓히면 Lf와 L입니다.",
    fates: ["m1", "m1", "m2", "out", "out"],
    reasons: ["M1 ⊂ M2", "M1 ⊂ M2", "M2", "2단계: 제외", "1단계: M1·M2 밖"],
    focus: "liquidity",
  },
];

const FATE_STYLE: Record<Fate, string> = {
  keep: "border-border bg-background",
  out: "border-dashed border-border/60 opacity-45",
  m1: "border-[#2563eb] bg-[#2563eb]/10",
  m2: "border-[#0d9488] bg-[#0d9488]/10",
};

const REASON_COLOR: Record<Fate, string> = {
  keep: "text-muted-foreground",
  out: "text-[#dc2626]",
  m1: "font-bold text-[#2563eb]",
  m2: "font-bold text-[#0d9488]",
};

function Rows({ scene }: { scene: Scene }) {
  const cell = (key: Scene["focus"]) => (scene.focus === key ? "font-bold text-foreground underline decoration-1 underline-offset-2" : "text-muted-foreground");
  return (
    <div className="grid gap-1.5">
      {ITEMS.map((item, i) => {
        const fate = scene.fates[i];
        return (
          <div key={item.name} className={`grid grid-cols-[minmax(0,1fr)_6rem] items-center gap-x-3 rounded-lg border px-3 py-1.5 md:py-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_7rem] ${FATE_STYLE[fate]}`}>
            <div className="min-w-0 md:contents">
              <p className={`text-sm font-semibold leading-6 ${fate === "out" ? "line-through decoration-1" : ""}`}>{item.name}</p>
              <p className="flex flex-wrap gap-x-3 text-xs leading-5 md:contents">
                <span className={cell("issuer")}>발행 {item.issuer}</span>
                <span className={cell("holder")}>보유 {item.holder}</span>
                <span className={cell("liquidity")}>현금화 {item.liquidity}</span>
              </p>
            </div>
            <span className={`text-right text-xs leading-5 ${REASON_COLOR[fate]}`}>{scene.reasons[i] || "·"}</span>
          </div>
        );
      })}
    </div>
  );
}

function DoubleCount() {
  return (
    <svg viewBox="0 0 340 50" className="h-auto w-full max-w-[22rem]" role="img" aria-label="가계가 은행 A에 100, 은행 A가 은행 B에 30을 맡긴 가정에서 두 번 세는 모습">
      <rect x={4} y={4} width={70} height={26} rx={8} fill="none" stroke="#64748b" strokeWidth={1} />
      <text x={39} y={21} textAnchor="middle" fontSize={11} className="fill-foreground">가계</text>
      <rect x={134} y={4} width={70} height={26} rx={8} fill="none" stroke="#64748b" strokeWidth={1} />
      <text x={169} y={21} textAnchor="middle" fontSize={11} className="fill-foreground">은행 A</text>
      <rect x={264} y={4} width={70} height={26} rx={8} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />
      <text x={299} y={21} textAnchor="middle" fontSize={11} className="fill-foreground">은행 B</text>
      <line x1={76} y1={17} x2={128} y2={17} stroke="#2563eb" strokeWidth={1.25} />
      <path d="M128 13 L134 17 L128 21 Z" fill="#2563eb" />
      <text x={104} y={11} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">100</text>
      <line x1={206} y1={17} x2={258} y2={17} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="3 2" />
      <path d="M258 13 L264 17 L258 21 Z" fill="#dc2626" />
      <text x={234} y={11} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">30</text>
      <text x={104} y={44} textAnchor="middle" fontSize={10} className="fill-muted-foreground">셈에 넣음</text>
      <text x={234} y={44} textAnchor="middle" fontSize={10} fill="#dc2626">빼야 함</text>
    </svg>
  );
}

const GATES = ["1 발행자", "2 보유자", "3 문턱"] as const;
const GATE_OF_SCENE: readonly (number | null)[] = [null, 0, 1, 2, 2];

function Nested({ wide }: { wide: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 rounded-lg border px-2 py-1.5 text-xs leading-5 ${wide ? "border-[#0d9488]" : "border-dashed border-border"}`}>
      <span className={`font-bold ${wide ? "text-[#0d9488]" : "text-muted-foreground"}`}>M2</span>
      <span className="rounded-lg border border-[#2563eb] px-2 py-0.5">
        <b className="text-[#2563eb]">M1</b> 현금 · 바로 꺼내 쓰는 예금
      </span>
      <span className={wide ? "" : "text-muted-foreground line-through decoration-1"}>+ 2년 미만 정기예적금</span>
    </div>
  );
}

function Side({ index }: { index: number }) {
  const gate = GATE_OF_SCENE[index];
  return (
    <div className="grid content-start gap-3 md:grid-cols-[14rem_minmax(0,1fr)] md:items-center">
      <div className="grid grid-cols-3 gap-1.5 self-start text-center text-xs">
        {GATES.map((g, i) => (
          <span key={g} className={`rounded-lg border px-1 py-1 ${gate === i ? "border-primary font-bold text-foreground" : gate !== null && i < gate ? "border-border text-muted-foreground" : "border-dashed border-border/60 text-muted-foreground/70"}`}>
            {g}
          </span>
        ))}
      </div>
      {index === 2 ? <DoubleCount /> : null}
      {index >= 3 ? <Nested wide={index === 4} /> : null}
      {index < 2 ? <p className="text-xs leading-5 text-muted-foreground">{index === 0 ? "아직 아무 단계도 적용하지 않았습니다." : "발행자가 예금취급기관이 아닌 줄이 빠집니다."}</p> : null}
    </div>
  );
}

export default function AggregateFilterViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const labels = SCENES.map((s) => s.label);
  return (
    <VizFrame
      eyebrow="통화지표 거르기"
      title="같은 잔액 목록이 세 번 걸러져 M1과 M2가 됩니다"
      description="줄 하나가 하나의 잔액입니다. 장면마다 절차의 한 단계를 적용하고, 밑줄 친 칸이 그 단계가 보는 항목입니다. 흐린 줄은 빠진 잔액이고 오른쪽에 어느 단계에서 빠졌는지 적었습니다."
      note="다섯 줄은 본문에 나온 예를 고른 것이며 실제 통화지표의 전체 구성이 아닙니다. 100과 30은 설명을 위한 가정 숫자입니다. Lf와 L에 무엇이 더해지는지는 이 글이 다루지 않습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="금융상품 다섯 가지를 발행자, 보유자, 유동성 문턱으로 걸러 M1과 M2를 만드는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((s) => (
            <div key={s.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{s.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{s.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-3"
          scenes={SCENES.map((s, i) => (
            <div key={s.label} className="grid gap-3">
              <Rows scene={s} />
              <Side index={i} />
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((s) => (
            <p key={s.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {s.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((s) => s.note)} />
      </div>
    </VizFrame>
  );
}
