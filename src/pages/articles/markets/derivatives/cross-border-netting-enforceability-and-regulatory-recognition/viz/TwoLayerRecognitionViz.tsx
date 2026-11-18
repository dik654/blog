import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 감독 의무의 중복(본점 국가·지점 국가 증거금)과 상호인정은
 * 사법상 상계가 파산관재인에게도 유효한지와 별개의 층이다(5·6·9절).
 * 3·4장면의 '현지법이 인정한다/불확실하다'는 두 층이 따로 움직임을 보이려는 가정입니다.
 */
type Tone = "idle" | "warn" | "ok" | "bad";

const TONE: Record<Tone, string> = {
  idle: "border-dashed border-border/70 text-muted-foreground",
  warn: "border-amber-600 text-amber-800 dark:text-amber-300",
  ok: "border-blue-600 text-blue-800 dark:text-blue-300",
  bad: "border-red-600 text-red-800 dark:text-red-300",
};

const SCENES = [
  {
    label: "감독 규칙이 겹칩니다",
    summary: "같은 위험 · 두 증거금 규칙",
    reg: { home: "본점 국가 증거금 규칙", host: "지점 국가 증거금 규칙", result: "같은 위험에 두 규칙이 겹칠 수 있음", tone: "warn" as Tone },
    law: { question: "부도 때 세 거래를 한 순액으로 묶을 수 있나?", result: "아직 판단하지 않음", tone: "idle" as Tone },
    note: "은행 본점 국가와 지점 국가가 모두 비청산 증거금(청산소를 거치지 않는 파생상품에 쌓는 담보)을 요구하면 같은 위험에 두 규칙이 겹칠 수 있습니다. 사법상 상계 층의 질문은 아직 건드리지 않았습니다.",
  },
  {
    label: "상호인정으로 중복을 줄입니다",
    summary: "한 체계 준수로 다른 의무 대신",
    reg: { home: "본점 국가 증거금 규칙", host: "지점 국가 증거금 규칙", result: "충분히 비슷한 외국 규칙을 인정 → 한 체계 준수로 대신", tone: "ok" as Tone },
    law: { question: "부도 때 세 거래를 한 순액으로 묶을 수 있나?", result: "여전히 별도 질문: 현지법 확인 필요", tone: "idle" as Tone },
    note: "감독기관은 대체준수나 동등성 인정으로 감독 의무의 중복을 줄일 수 있습니다. 하지만 이 결정은 사법상 상계 층의 답을 채우지 않습니다. 상계가 파산관재인에게도 유효한지는 별도의 현지법 문제입니다.",
  },
  {
    label: "규제 인정 + 상계 불확실 (가정)",
    summary: "감독 중복 해소 · 노출은 받을 돈 12",
    reg: { home: "본점 국가 증거금 규칙", host: "지점 국가 증거금 규칙", result: "충분히 비슷한 외국 규칙을 인정 → 한 체계 준수로 대신", tone: "ok" as Tone },
    law: { question: "부도 때 세 거래를 한 순액으로 묶을 수 있나?", result: "불확실 → 받을 돈 +12를 먼저 볼 수 있음", tone: "bad" as Tone },
    note: "규제 인정이 있어도 현지 도산법 아래 상계가 불확실하다면, 3절처럼 받을 거래 +12와 지급 −9가 따로 집행될 수 있어 노출 계산은 +12에서 출발할 수 있습니다. 두 층의 조합은 설명용 가정입니다.",
  },
  {
    label: "규제 인정 + 상계 유효 (가정)",
    summary: "감독 중복 해소 · 노출 순액 3",
    reg: { home: "본점 국가 증거금 규칙", host: "지점 국가 증거금 규칙", result: "충분히 비슷한 외국 규칙을 인정 → 한 체계 준수로 대신", tone: "ok" as Tone },
    law: { question: "부도 때 세 거래를 한 순액으로 묶을 수 있나?", result: "현지법이 인정 → 순수취 3에서 출발", tone: "ok" as Tone },
    note: "순액 3을 쓰게 해 주는 것은 사법상 상계 층, 곧 관련 국가의 계약법·도산법·은행 정리 제도입니다. 감독 규칙 층의 상호인정은 계약상 받을 돈 3을 법원에서 집행할 수 있다는 보증서가 아닙니다.",
  },
] as const;

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg border border-border p-3">
      <p className="mb-2 text-xs font-bold">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Cell({ text, tone, small = false }: { text: string; tone: Tone; small?: boolean }) {
  return <div className={`${small ? "min-h-[2.5rem]" : "min-h-[3.25rem] sm:min-h-[4.5rem]"} rounded-md border px-2 py-1.5 text-xs leading-5 transition-colors duration-300 motion-reduce:transition-none ${TONE[tone]}`}>{text}</div>;
}

export default function TwoLayerRecognitionViz() {
  return (
    <SceneShell
      eyebrow="두 개의 층"
      title="감독 규칙의 상호인정과 상계의 법적 효력은 따로 판단합니다"
      description="감독 규칙 층은 감독기관끼리 의무 중복을 조정하는 곳이고, 사법상 상계 층은 거래상대가 파산했을 때 상계가 법원과 파산관재인에게도 통하는지 묻는 곳입니다. 금액은 1·3절의 +12·−7·−2(설명용 단위)입니다."
      ariaLabel="규제 상호인정 층과 사법상 상계 집행가능성 층이 서로 독립적으로 결론 나는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4">
            <Panel title="감독 규칙 층 · 규제 상호인정">
              <div className="grid grid-cols-2 gap-2">
                <Cell text={scene.reg.home} tone={active === 0 ? "warn" : "idle"} small />
                <Cell text={scene.reg.host} tone={active === 0 ? "warn" : "idle"} small />
              </div>
              <Cell text={scene.reg.result} tone={scene.reg.tone} />
            </Panel>
            <Panel title="사법상 상계 층 · 현지 계약법·도산법">
              <p className="text-xs leading-5 text-muted-foreground">{scene.law.question}</p>
              <Cell text={scene.law.result} tone={scene.law.tone} />
            </Panel>
          </div>
        );
      }}
    />
  );
}
