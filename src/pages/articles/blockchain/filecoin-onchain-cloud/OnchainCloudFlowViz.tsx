import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const stateRows = [
  {
    id: "open",
    label: "open",
    question: "아직 증명할 시간이 남았는가?",
    meaning: "판정 전 상태입니다. 성공도 실패도 아니므로 정산은 여기서 멈춥니다.",
    effect: "지급 0으로 확정하지 않음 · cursor 정지",
  },
  {
    id: "proven",
    label: "proven",
    question: "마감 전에 유효한 proof가 받아들여졌는가?",
    meaning: "해당 기간에 데이터를 보유했다는 판정이 끝난 상태입니다.",
    effect: "기간의 epoch가 지급 계산에 참여",
  },
  {
    id: "faulted",
    label: "faulted",
    question: "마감까지 유효한 proof가 없었는가?",
    meaning: "증명 기회를 놓친 판정 상태입니다. open과 달리 결과가 확정됐습니다.",
    effect: "지급 기여 0 · 다음 기간으로 cursor 전진",
  },
] as const;

export function PeriodStateViz() {
  const [active, setActive] = useState<(typeof stateRows)[number]["id"]>("open");
  const [playing, setPlaying] = useState(false);
  const reduceMotion = useReducedMotion();
  const selected = stateRows.find((state) => state.id === active) ?? stateRows[0];

  useEffect(() => {
    if (!playing || reduceMotion) return;
    const sequence = ["open", "proven", "open", "faulted"] as const;
    let cursor = Math.max(sequence.indexOf(active), 0);
    const timer = window.setInterval(() => {
      cursor = (cursor + 1) % sequence.length;
      setActive(sequence[cursor]);
    }, 1900);
    return () => window.clearInterval(timer);
  }, [active, playing, reduceMotion]);

  return (
    <figure
      data-viz="period-state-shape"
      className="not-prose overflow-hidden rounded-xl border border-border bg-card"
      aria-label="PDP period state의 세 가지 형태"
    >
      <figcaption className="flex flex-col gap-3 border-b border-border/70 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-bold text-foreground">Period state의 형태</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            하나의 period는 정해진 epoch 구간과 proof deadline을 가진 기록이며, 판정은
            아래 세 상태 중 하나입니다.
          </p>
        </div>
        <button
          data-viz-play
          type="button"
          disabled={Boolean(reduceMotion)}
          onClick={() => setPlaying((current) => !current)}
          className="shrink-0 rounded-md border border-primary/35 bg-primary/[0.045] px-3 py-1.5 text-xs font-bold text-primary disabled:opacity-50"
        >
          {reduceMotion ? "모션 줄이기 적용됨" : playing ? "일시정지" : "판정 흐름 재생"}
        </button>
      </figcaption>
      <div data-viz-canvas className="min-w-0 p-5 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Period 상태">
          {stateRows.map((state) => {
            const isActive = state.id === active;
            return (
              <button
                key={state.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setPlaying(false);
                  setActive(state.id);
                }}
                className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "border-primary/55 bg-primary/[0.055]"
                    : "border-border/70 bg-background hover:border-primary/30"
                }`}
              >
                <span className="font-mono text-xs font-black text-primary">
                  {state.label.toUpperCase()}
                </span>
                <span className="mt-1 block text-xs leading-5 text-foreground/75">
                  {state.question}
                </span>
              </button>
            );
          })}
        </div>

        <motion.div
          key={selected.id}
          role="tabpanel"
          className="mt-4 grid gap-4 rounded-lg border border-border/70 bg-muted/15 p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:p-5"
          initial={reduceMotion ? false : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28 }}
        >
          <div>
            <p className="text-[11px] font-bold text-primary">이 상태가 뜻하는 것</p>
            <p className="mt-1 text-sm leading-6 text-foreground/80">{selected.meaning}</p>
          </div>
          <span className="hidden text-muted-foreground sm:block" aria-hidden="true">
            →
          </span>
          <div className="border-t border-border/60 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
            <p className="text-[11px] font-bold text-foreground">정산에 미치는 영향</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{selected.effect}</p>
          </div>
        </motion.div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="rounded border border-border/70 px-2 py-1">period 시작</span>
          <span aria-hidden="true">→</span>
          <span className="rounded border border-border/70 px-2 py-1">proof 제출 기회</span>
          <span aria-hidden="true">→</span>
          <span className="rounded border border-border/70 px-2 py-1">deadline</span>
          <span aria-hidden="true">→</span>
          <span className="rounded border border-border/70 px-2 py-1">proven 또는 faulted 확정</span>
        </div>
      </div>
    </figure>
  );
}

const railFields = [
  ["deposit", "실제로 rail에 잠긴 payer의 자금"],
  ["operator allowance", "operator가 이 payer 대신 rail에 배정할 수 있는 한도"],
  ["variable rate", "검증된 epoch 하나가 늘 때마다 증가하는 지급 속도"],
  ["fixed lockup", "종료·정리 같은 고정 비용을 위해 따로 예약한 금액"],
  ["settledUpTo", "어느 epoch 직전까지 이미 계산했는지를 가리키는 cursor"],
] as const;

export function PaymentRailViz() {
  const [active, setActive] = useState<(typeof railFields)[number][0]>("deposit");
  const [playing, setPlaying] = useState(false);
  const reduceMotion = useReducedMotion();
  const description =
    railFields.find(([field]) => field === active)?.[1] ?? railFields[0][1];

  useEffect(() => {
    if (!playing || reduceMotion) return;
    const current = railFields.findIndex(([field]) => field === active);
    const timer = window.setInterval(() => {
      const next = (current + 1) % railFields.length;
      setActive(railFields[next][0]);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [active, playing, reduceMotion]);

  return (
    <figure
      data-viz="payment-rail-ledger"
      className="not-prose overflow-hidden rounded-xl border border-border bg-card"
      aria-label="Payment rail의 별도 ledger 필드"
    >
      <figcaption className="flex flex-col gap-3 border-b border-border/70 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-bold text-foreground">Payment rail은 지급 규칙이 붙은 원장 한 줄입니다</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            payer에서 payee로 돈이 이동하는 통로에 잔액·권한·속도·예약금·정산 위치를
            함께 기록합니다. 자동이체 한 건과 달리 각 필드가 독립적으로 바뀝니다.
          </p>
        </div>
        <button
          data-viz-play
          type="button"
          disabled={Boolean(reduceMotion)}
          onClick={() => setPlaying((current) => !current)}
          className="shrink-0 rounded-md border border-primary/35 bg-primary/[0.045] px-3 py-1.5 text-xs font-bold text-primary disabled:opacity-50"
        >
          {reduceMotion ? "모션 줄이기 적용됨" : playing ? "일시정지" : "원장 갱신 재생"}
        </button>
      </figcaption>
      <div data-viz-canvas className="min-w-0 p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-border/70 bg-muted/10 p-4">
            <div className="flex items-center justify-between gap-3 text-xs font-bold">
              <span className="rounded border border-border/70 bg-background px-2 py-1">payer</span>
              <span className="text-muted-foreground" aria-hidden="true">→ rail →</span>
              <span className="rounded border border-border/70 bg-background px-2 py-1">payee</span>
            </div>
            <div className="mt-4 divide-y divide-border/60 border-y border-border/60">
              {railFields.map(([field]) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    setActive(field);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-2 py-2.5 text-left text-xs transition-colors ${
                    active === field ? "bg-primary/[0.055] text-primary" : "text-foreground/75"
                  }`}
                >
                  <span className="font-mono font-bold">{field}</span>
                  <span aria-hidden="true">{active === field ? "●" : "○"}</span>
                </button>
              ))}
            </div>
          </div>
          <motion.div
            key={active}
            className="rounded-lg border border-primary/25 bg-primary/[0.035] p-4 sm:p-5"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26 }}
          >
            <p className="font-mono text-xs font-black text-primary">{active}</p>
            <p className="mt-2 text-base font-bold leading-7 text-foreground">{description}</p>
            <p className="mt-4 border-t border-border/60 pt-4 text-xs leading-6 text-muted-foreground">
              이 값 하나만 보고 지급 가능 여부를 정하지 않습니다. 잔액, 허용 한도,
              필요한 lockup과 proof가 끝난 구간을 함께 확인한 뒤에만 정산합니다.
            </p>
          </motion.div>
        </div>
      </div>
    </figure>
  );
}

const flow = [
  ["01", "bytes", "provider가 받은 파일 조각"],
  ["02", "dataset record", "누구의 어떤 조각인지 묶은 chain 기록"],
  ["03", "period state", "기간별 보유 증명의 판정"],
  ["04", "payment rail", "판정 결과로 움직이는 지급 원장"],
] as const;

export function OnchainCloudFlowViz() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!playing || reduceMotion) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % flow.length),
      2100,
    );
    return () => window.clearInterval(timer);
  }, [playing, reduceMotion]);

  return (
    <figure
      data-viz="onchain-cloud-composition"
      className="not-prose overflow-hidden rounded-xl border border-border bg-card"
      aria-label="이 글에서 배운 개념의 최종 조합"
    >
      <figcaption className="flex flex-col gap-3 border-b border-border/70 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-bold text-foreground">이제 네 개념을 하나의 서비스 흐름으로 합칩니다</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            앞에서 각각의 형태를 이해했으므로, 여기서 처음으로 upload부터 settlement까지 연결합니다.
          </p>
        </div>
        <button
          data-viz-play
          type="button"
          disabled={Boolean(reduceMotion)}
          onClick={() => setPlaying((current) => !current)}
          className="shrink-0 rounded-md border border-primary/35 bg-primary/[0.045] px-3 py-1.5 text-xs font-bold text-primary disabled:opacity-50"
        >
          {reduceMotion ? "모션 줄이기 적용됨" : playing ? "일시정지" : "서비스 흐름 재생"}
        </button>
      </figcaption>
      <div data-viz-canvas className="grid min-w-0 gap-3 p-5 sm:p-6 lg:grid-cols-4">
        {flow.map(([number, title, text], index) => (
          <motion.button
            key={title}
            type="button"
            onClick={() => {
              setPlaying(false);
              setActive(index);
            }}
            animate={
              reduceMotion
                ? undefined
                : { y: active === index ? -3 : 0, opacity: index <= active ? 1 : 0.58 }
            }
            transition={{ duration: 0.28 }}
            className={`relative rounded-lg border p-4 text-left transition-colors ${
              active === index
                ? "border-primary/55 bg-primary/[0.055]"
                : "border-border/70 bg-background"
            }`}
          >
            <p className="font-mono text-[11px] font-black text-primary">{number}</p>
            <p className="mt-1 text-sm font-bold text-foreground">{title}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
            {index < flow.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 rounded border border-border bg-card px-1.5 text-[10px] text-muted-foreground lg:-right-3 lg:bottom-auto lg:left-auto lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0"
              >
                →
              </span>
            )}
          </motion.button>
        ))}
      </div>
      <motion.p
        key={flow[active][1]}
        className="border-t border-border/70 px-5 py-3 text-xs leading-5 text-muted-foreground sm:px-6"
        initial={reduceMotion ? false : { opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        지금 장면: <strong className="text-foreground">{flow[active][1]}</strong> — {flow[active][2]}
      </motion.p>
    </figure>
  );
}
