import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 7절 — 같은 10회 기록(10/10)을 데카르트·흄·칸트의 질문으로 다시 쓰고,
 * 현대 실험은 세 질문과 별도로 장비 오차·재현·모형의 예측 범위를 검증한다.
 * 위 띠 = 관찰 1~10회와 11번째. 아래 칸 = 각 질문이 그 기록의 어디를 보는지.
 */
type Focus = "record" | "doubt" | "habit" | "order" | "test";

const SCENES: readonly { label: string; summary: string; note: string; focus: Focus }[] = [
  {
    label: "같은 기록",
    summary: "10/10 · 11번째는 비어 있음",
    note: "A가 B를 친 10회 모두 B가 움직였습니다. 눈에 보인 것, 곧 감각에 들어온 두 인상은 매번 ‘충돌’과 ‘움직임’이라는 두 사건의 연속이고, 11번째 칸은 아직 관찰되지 않았습니다.",
    focus: "record",
  },
  {
    label: "데카르트식 질문",
    summary: "기록 전체를 잠시 보류",
    note: "감각 기록 10회가 꿈이나 오류여도 남는 확실성이 무엇인지 묻습니다. 기록을 거짓으로 확정하지 않고, 흔들릴 수 있으니 출발점에서 잠시 보류합니다.",
    focus: "doubt",
  },
  {
    label: "흄식 질문",
    summary: "두 인상 사이 · 반복 → 습관 → 기대",
    note: "충돌과 움직임 말고 둘을 묶는 필연적 연결을 실제 인상에서 찾을 수 있는지 묻습니다. 흄은 10회 반복이 마음에 습관을 만들고, 그 습관이 11번째 움직임을 기대하게 한다고 설명합니다.",
    focus: "habit",
  },
  {
    label: "칸트식 질문",
    summary: "주관적 연속 → 객관적 사건 순서",
    note: "내 마음에 두 인상이 차례로 들어온 것과 ‘충돌 뒤 움직임’이라는 사건 순서를 판단하는 것은 다릅니다. 칸트는 뒤의 판단에 인과 범주라는 이해의 규칙이 필요하다고 봅니다. 그렇다고 ‘A가 치면 B가 움직인다’ 같은 구체적 법칙까지 경험 없이 안다는 뜻은 아닙니다.",
    focus: "order",
  },
  {
    label: "현대 실험",
    summary: "세 질문과 별도의 검증",
    note: "실험은 세 철학적 질문과 따로 장비 오차, 재현, 모형의 예측 범위를 검증합니다. 3절의 말처럼 실험자는 법칙을 개선할 수 있고, 그 법칙이 무엇에 근거하는지는 철학자가 따로 묻습니다.",
    focus: "test",
  },
];

const OBSERVED = Array.from({ length: 10 }, (_, index) => index + 1);

function Strip({ focus }: { focus: Focus }) {
  const dimmed = focus === "doubt";
  return (
    <div className={`relative rounded-lg p-2 ${dimmed ? "border border-dashed border-amber-600" : "border border-transparent"}`}>
      <div className="grid grid-cols-11 gap-1">
        {OBSERVED.map((n) => (
          <div
            key={n}
            className={`flex flex-col items-center rounded border py-1 text-[10px] leading-4 ${
              dimmed ? "border-border/50 text-muted-foreground/60" : focus === "habit" ? "border-primary/60" : "border-border"
            }`}
          >
            <span className="font-mono">{n}</span>
            <span className="font-bold">✓</span>
          </div>
        ))}
        <div className="flex flex-col items-center rounded border border-dashed border-border py-1 text-[10px] leading-4 text-muted-foreground">
          <span className="font-mono">11</span>
          <span className="font-bold">?</span>
        </div>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {dimmed ? "보류: 꿈이나 오류일 수도 있는 감각 기록" : "칸 하나 = A가 B를 친 관찰 한 번, ✓ = B가 움직임"}
      </p>
    </div>
  );
}

function Balls() {
  const stroke = "#64748b";
  return (
    <svg viewBox="0 0 120 40" className="h-10 w-[120px] shrink-0" aria-hidden="true">
      <circle cx={20} cy={20} r={10} fill="none" stroke={stroke} strokeWidth={1.25} />
      <text x={20} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill={stroke}>A</text>
      <line x1={32} x2={52} y1={20} y2={20} stroke={stroke} strokeWidth={1} />
      <path d="M52 16 L58 20 L52 24 Z" fill={stroke} />
      <circle cx={72} cy={20} r={10} fill="none" stroke={stroke} strokeWidth={1.25} />
      <text x={72} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill={stroke}>B</text>
      <line x1={86} x2={108} y1={20} y2={20} stroke={stroke} strokeWidth={1} strokeDasharray="3 2" />
      <path d="M108 16 L114 20 L108 24 Z" fill={stroke} />
    </svg>
  );
}

function Box({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "accent" | "empty" }) {
  const cls =
    tone === "accent"
      ? "border-primary bg-primary/10 font-semibold"
      : tone === "empty"
        ? "border-dashed border-border text-muted-foreground"
        : "border-border";
  return <div className={`min-w-0 rounded-lg border px-2 py-1.5 text-center text-xs leading-5 sm:px-3 sm:py-2 sm:text-sm sm:leading-6 ${cls}`}>{children}</div>;
}

function Arrow() {
  return <span aria-hidden="true" className="shrink-0 text-muted-foreground">→</span>;
}

function Panel({ focus }: { focus: Focus }) {
  if (focus === "record") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <Balls />
        <Box>인상 1 · 충돌</Box>
        <Arrow />
        <Box>인상 2 · B의 움직임</Box>
      </div>
    );
  }
  if (focus === "doubt") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <Box tone="empty">감각 기록 10회 · 잠시 보류</Box>
        <Arrow />
        <Box tone="accent">그래도 남는 확실성은 무엇인가?</Box>
      </div>
    );
  }
  if (focus === "habit") {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Box>충돌</Box>
          <Box tone="empty">필연적 연결의 인상?</Box>
          <Box>움직임</Box>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Box>반복 10회</Box>
          <Arrow />
          <Box>마음의 습관</Box>
          <Arrow />
          <Box tone="accent">11번째 움직임 기대</Box>
        </div>
      </div>
    );
  }
  if (focus === "order") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <Box>
          <span className="block text-xs text-muted-foreground">주관적 연속</span>
          인상 1, 인상 2가 차례로
        </Box>
        <div className="flex shrink-0 flex-col items-center text-xs text-primary">
          <span className="rounded border border-primary px-2 py-0.5 font-bold">인과 범주</span>
          <span aria-hidden="true" className="text-base">→</span>
        </div>
        <Box tone="accent">
          <span className="block text-xs font-normal text-muted-foreground">객관적 사건 순서</span>
          충돌 뒤 움직임
        </Box>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <Box>장비 오차</Box>
      <Box>재현</Box>
      <Box>모형의 예측 범위</Box>
    </div>
  );
}

export default function SameRecordQuestionsViz() {
  return (
    <SceneShell
      eyebrow="같은 기록, 세 질문"
      title="10/10 기록에서 데카르트·흄·칸트는 서로 다른 곳을 봅니다"
      description="위 띠는 3절의 관찰 10회와 아직 오지 않은 11번째입니다. 장면마다 아래 칸이 그 기록의 어느 부분을 묻는지 보여 줍니다."
      ariaLabel="같은 10회 관찰 기록에 데카르트, 흄, 칸트의 질문과 현대 실험의 검증을 차례로 적용"
      scenes={SCENES}
      render={(index) => (
        <div className="min-w-0 space-y-4">
          <Strip focus={SCENES[index].focus} />
          <Panel focus={SCENES[index].focus} />
        </div>
      )}
    />
  );
}
