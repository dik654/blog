import XmlSceneShell from "./XmlSceneShell";

/**
 * 본문 대응: #basic-tags — proper nesting.
 * 올바른 순서: <request><input>환불</input></request> → 짝이 안쪽부터 닫힌다.
 * 교차: <request><input>환불</request></input> → 마지막에 연 input보다 request가 먼저 닫혀 parser가 거부한다.
 * 위 줄 = 토큰 다섯 칸, 아래 선 = 여는 태그와 닫는 태그의 짝, 오른쪽 = 아직 닫히지 않은 상자 목록.
 */
type Step = {
  label: string;
  summary: string;
  note: string;
  tokens: readonly string[];
  /** 지금까지 읽은 토큰 수 */
  read: number;
  /** 아직 닫히지 않은 상자, 마지막에 연 것이 끝 */
  open: readonly string[];
  verdict: "reading" | "ok" | "reject";
};

const GOOD = ["<request>", "<input>", "환불", "</input>", "</request>"] as const;
const CROSSED = ["<request>", "<input>", "환불", "</request>", "</input>"] as const;

const STEPS: readonly Step[] = [
  {
    label: "상자 두 개를 엽니다",
    summary: "열린 상자: request → input",
    note: "<request>를 열고 그 안에서 <input>을 엽니다. ‘환불’은 마지막에 연 input 상자의 내용입니다. 지금 먼저 닫아야 할 상자는 마지막에 연 input입니다.",
    tokens: GOOD,
    read: 3,
    open: ["request", "input"],
    verdict: "reading",
  },
  {
    label: "마지막에 연 input을 먼저 닫습니다",
    summary: "</input> = 마지막에 연 상자",
    note: "</input>은 가장 최근에 연 input과 이름이 같으므로 짝이 맞습니다. 이제 열린 상자는 request 하나입니다.",
    tokens: GOOD,
    read: 4,
    open: ["request"],
    verdict: "reading",
  },
  {
    label: "바깥 request를 닫으면 끝납니다",
    summary: "짝이 서로 안쪽에 들어감 · 통과",
    note: "</request>로 마지막 상자까지 닫힙니다. 아래 선처럼 input의 짝이 request의 짝 안에 완전히 들어가면 proper nesting, 즉 마지막에 연 상자를 먼저 닫는 순서입니다.",
    tokens: GOOD,
    read: 5,
    open: [],
    verdict: "ok",
  },
  {
    label: "순서를 바꾸면 짝이 교차합니다",
    summary: "</request> ≠ 마지막에 연 input · 거부",
    note: "같은 토큰에서 닫는 순서만 바꿨습니다. input이 아직 열려 있는데 </request>가 먼저 오므로 두 element가 교차하고, parser는 이 문서를 거부합니다.",
    tokens: CROSSED,
    read: 4,
    open: ["request", "input"],
    verdict: "reject",
  },
];

/** 토큰 다섯 칸의 중심 x (viewBox 폭 500 기준) */
const cx = (slot: number) => 50 + slot * 100;

function PairLines({ crossed, read }: { crossed: boolean; read: number }) {
  const pairs = crossed
    ? [
        { from: 0, to: 3, depth: 38, name: "request" },
        { from: 1, to: 4, depth: 20, name: "input" },
      ]
    : [
        { from: 0, to: 4, depth: 38, name: "request" },
        { from: 1, to: 3, depth: 20, name: "input" },
      ];
  return (
    <svg viewBox="0 0 500 48" preserveAspectRatio="none" className="block h-12 w-full" aria-hidden="true">
      {pairs.map((pair) => {
        const closed = read > pair.to;
        const bad = crossed && pair.name === "request";
        const color = bad ? "#dc2626" : closed ? "#2563eb" : "#94a3b8";
        const end = closed || bad || crossed ? cx(pair.to) : cx(Math.max(pair.from, read - 1));
        return (
          <path
            key={pair.name}
            d={`M ${cx(pair.from)} 2 V ${pair.depth} H ${end}${closed || bad ? " V 2" : ""}`}
            fill="none"
            stroke={color}
            strokeWidth={1.25}
            strokeDasharray={closed || bad ? undefined : "4 3"}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

export default function NestingOrderViz() {
  return (
    <XmlSceneShell
      eyebrow="Proper nesting"
      title="닫는 태그는 가장 최근에 연 상자와 짝이 맞아야 합니다"
      description="본문의 두 예를 왼쪽부터 한 토큰씩 읽습니다. 토큰 아래 선은 여는 태그와 닫는 태그의 짝이고, ‘아직 닫히지 않은 상자’ 목록은 지금 열려 있는 element입니다."
      ariaLabel="올바른 중첩과 교차한 중첩을 토큰 순서대로 읽는 네 장면"
      scenes={STEPS}
      render={(index) => {
        const step = STEPS[index];
        const crossed = step.tokens === CROSSED;
        return (
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem] sm:items-start">
            <div className="min-w-0">
              <div className="grid grid-cols-5 gap-1">
                {step.tokens.map((token, slot) => {
                  const done = slot < step.read;
                  const culprit = step.verdict === "reject" && slot === step.read - 1;
                  return (
                    <code
                      key={`${token}-${slot}`}
                      className={`flex min-h-10 min-w-0 items-center justify-center whitespace-nowrap border px-0 text-center font-mono text-[9px] font-bold leading-4 tracking-tighter sm:text-[11px] sm:tracking-normal ${
                        culprit
                          ? "border-red-600 text-red-700 dark:text-red-400"
                          : done
                            ? "border-primary/60 text-foreground"
                            : "border-dashed border-border text-muted-foreground"
                      }`}
                    >
                      {token}
                    </code>
                  );
                })}
              </div>
              <PairLines crossed={crossed} read={step.read} />
              <p className="text-[11px] leading-5 text-muted-foreground">
                {crossed ? "빨간 선: request의 짝이 아직 열린 input의 선(점선)과 교차" : "파란 선: 짝이 닫힘 · 점선: 아직 열려 있음"}
              </p>
            </div>
            <div className="min-w-0 border-l border-border pl-3">
              <p className="text-[10px] font-bold text-muted-foreground">아직 닫히지 않은 상자</p>
              <p className="text-[10px] text-muted-foreground">(아래가 마지막에 연 것)</p>
              <ol className="mt-2 min-h-[4.5rem] space-y-1">
                {step.open.map((name, i) => (
                  <li
                    key={name}
                    className={`border px-2 py-1 font-mono text-xs ${
                      i === step.open.length - 1 ? "border-primary/60 font-bold" : "border-border text-muted-foreground"
                    }`}
                  >
                    {name}
                  </li>
                ))}
                {step.open.length === 0 ? <li className="text-xs text-muted-foreground">없음</li> : null}
              </ol>
              <p
                className={`mt-2 text-xs font-bold ${
                  step.verdict === "ok"
                    ? "text-green-700 dark:text-green-400"
                    : step.verdict === "reject"
                      ? "text-red-700 dark:text-red-400"
                      : "text-muted-foreground"
                }`}
              >
                {step.verdict === "ok" ? "✓ 올바른 중첩" : step.verdict === "reject" ? "✕ 교차 · parser 거부" : "… 읽는 중"}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
