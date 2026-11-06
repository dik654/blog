import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #late-interaction — 세 방식이 언제 무엇을 계산하는지.
 * 토큰 예는 MaxSim 예시의 질의 3개·문서 5개. 지연 상호작용의 내적 수 3 × 5 = 15.
 */
const QUERY_COUNT = 3;
const DOC_COUNT = 5;
const QUERY_TOKENS = `질의 토큰 ${QUERY_COUNT}개`;
const DOC_TOKENS = `문서 토큰 ${DOC_COUNT}개`;
const COST = ["내적 1번", `내적 ${QUERY_COUNT * DOC_COUNT}번`, "전체 순전파"] as const;
const COST_INDEX = [0, 2, 1] as const;

const SCENES = [
  { label: "이중 인코더", summary: "후보당 내적 1번", note: "빠르지만 여러 토큰의 의미를 뭉치는 과정에서 세부 신호가 흐려질 수 있습니다." },
  { label: "교차 인코더", summary: "후보마다 전체 순전파", note: "토큰 사이의 상호작용을 그대로 보지만 문서 표현이 질의에 따라 달라집니다. 순전파는 모델 전체를 한 번 실행하는 일입니다." },
  { label: "지연 상호작용", summary: `3 × 5 = ${QUERY_COUNT * DOC_COUNT}번 내적`, note: "비용은 두 방식 사이에 있습니다. 대신 이중 인코더보다 훨씬 큰 색인 공간을 씁니다." },
] as const;

function Tokens({ children, tone }: { children: ReactNode; tone: "q" | "d" }) {
  return <span className={`rounded border px-1.5 py-1 text-xs ${tone === "q" ? "border-amber-600 text-amber-800 dark:text-amber-300" : "border-border bg-background text-foreground"}`}>{children}</span>;
}

function Result({ children, strong = false }: { children: ReactNode; strong?: boolean }) {
  return <span className={`inline-block rounded-md border px-2 py-1 text-xs font-semibold ${strong ? "border-primary bg-primary/10 text-primary" : "border-border bg-background"}`}>{children}</span>;
}

function Arrow() {
  return <span aria-hidden className="text-sm text-muted-foreground">→</span>;
}

function Phase({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg border border-border/70 p-2">
      <p className="mb-1 text-xs font-bold text-muted-foreground">{title}</p>
      <div className="flex min-w-0 flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export default function EncoderCompareViz() {
  return (
    <SceneShell
      eyebrow="세 가지 비교 방식"
      title="무엇을 미리 계산해 두느냐가 세 방식을 가릅니다"
      description="토큰은 문장을 나눈 조각, 내적은 두 벡터로 유사도 숫자 하나를 얻는 계산입니다. 질의 토큰 3개·문서 토큰 5개는 예시입니다."
      ariaLabel="이중 인코더, 교차 인코더, 지연 상호작용이 미리 계산하는 것과 질의 시점에 계산하는 것"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          <Phase title="미리 계산 · 문서를 색인할 때">
            {active === 1 ? (
              <span className="text-xs text-muted-foreground">미리 계산할 수 있는 것 없음</span>
            ) : (
              <>
                <Tokens tone="d">{DOC_TOKENS}</Tokens>
                <Arrow />
                <Result strong={active === 2}>{active === 0 ? "문서 벡터 1개로 뭉침" : "토큰 벡터 5개 그대로 캐시"}</Result>
              </>
            )}
          </Phase>
          <Phase title="질의가 들어온 뒤">
            {active === 1 ? (
              <>
                <Tokens tone="q">{QUERY_TOKENS}</Tokens>
                <span aria-hidden className="text-xs font-bold text-muted-foreground">+</span>
                <Tokens tone="d">{DOC_TOKENS}</Tokens>
                <Arrow />
                <Result strong>Transformer → 점수</Result>
              </>
            ) : (
              <>
                <Tokens tone="q">{QUERY_TOKENS}</Tokens>
                <Arrow />
                <Result>{active === 0 ? "질의 벡터 1개" : "토큰 벡터 3개"}</Result>
                <Arrow />
                <Result strong>{active === 0 ? "문서 벡터와 내적" : "문서 토큰 5개와 각각 내적"}</Result>
              </>
            )}
          </Phase>
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">후보 하나당 비용 · 왼쪽일수록 작음</p>
            <div className="grid grid-cols-3 gap-1">
              {COST.map((cost, index) => (
                <span key={cost} className={`rounded-md border px-1 py-1.5 text-center text-xs ${index === COST_INDEX[active] ? "border-primary font-bold text-primary" : "border-border/60 text-muted-foreground/70"}`}>
                  {cost}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    />
  );
}
