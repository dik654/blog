import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 10시간 사례를 세 도구로 차례로 읽는다.
 * ① 문답: '연습량만 늘리면 좋다'에 부상·수면 부족 반례 → ② 덕: 용기·절제·실천적 판단이 6·2·2 배분에서
 * 함께 작동하는지 묻는다 → ③ 경기 뒤 승패를 인격 점수로 바꾸지 않고, 고칠 선택과 바꿀 수 없던 조건을 나눈다
 * → ④ 다음 훈련의 판단을 수정한다. 6 + 2 + 2 = 10시간(3절), 승리는 보장 불가(상대·날씨·우연, 4절 장부).
 */
const TOOLS: readonly string[] = ["문답", "덕", "통제 구분"];

const BLOCKS: readonly { label: string; hours: number; cell: string }[] = [
  { label: "연습", hours: 6, cell: "bg-sky-600/80" },
  { label: "수면·식사", hours: 2, cell: "bg-emerald-600/80" },
  { label: "회복", hours: 2, cell: "bg-amber-500/80" },
];

const TOTAL = BLOCKS.reduce<number>((sum, block) => sum + block.hours, 0);

const SCENES = [
  { label: "문답: 정의에 반례를 냅니다", summary: "주장 1 · 반례 2", tool: 0, note: "‘연습량만 늘리면 좋다’는 정의에 부상과 수면 부족이라는 반례를 냅니다. 이 단계에서는 아직 시간을 다시 나누지 않고, 숨은 전제를 드러냅니다." },
  { label: "덕: 배분 전체를 함께 봅니다", summary: `6 + 2 + 2 = ${TOTAL}시간`, tool: 1, note: "용기·절제·실천적 판단(상황에 맞게 무엇을 할지 가리는 능력)이 6·2·2시간 배분에서 어떻게 함께 작동하는지 묻습니다. 덕 하나를 칸 하나에 짝짓는 그림이 아닙니다." },
  { label: "경기 뒤: 결과와 장부를 나눕니다", summary: "고칠 선택 | 바꿀 수 없던 조건", tool: 2, note: "승패를 곧바로 인격 점수로 바꾸지 않습니다. 준비 과정에서 고칠 선택은 내 장부에, 상대·날씨·우연처럼 바꿀 수 없었던 조건은 장부 밖에 둡니다." },
  { label: "다음 훈련의 판단을 고칩니다", summary: "고칠 선택 → 다음 계획", tool: 2, note: "준비 과정에서 찾은 고칠 선택을 바탕으로 다음 훈련의 판단을 수정합니다. 다음 배분이 몇 시간씩일지는 글이 정하지 않았으므로 칸을 비워 둡니다." },
] as const;

function Ledger({ dim = false, blank = false }: { dim?: boolean; blank?: boolean }) {
  const cells = BLOCKS.flatMap((block) => Array.from({ length: block.hours }, (_, index) => ({ key: `${block.label}-${index}`, cell: block.cell })));
  return (
    <div className={`min-w-0 ${dim ? "opacity-40" : ""}`}>
      <div className="grid grid-cols-10 gap-0.5">
        {cells.map((item) => (
          <span key={item.key} className={`h-6 rounded-sm ${blank ? "border border-dashed border-border" : item.cell}`} />
        ))}
      </div>
      <div className="mt-1 grid grid-cols-10 gap-0.5 text-[11px] leading-4 text-muted-foreground sm:text-xs">
        {blank ? (
          <span className="col-span-10">자리 표시일 뿐, 칸 수도 용도도 글은 정하지 않았습니다</span>
        ) : (
          BLOCKS.map((block) => (
            <span key={block.label} style={{ gridColumn: `span ${block.hours} / span ${block.hours}` }} className="min-w-0 truncate">
              {`${block.label} ${block.hours}`}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function Box({ title, children, tone = "plain" }: { title: string; children: ReactNode; tone?: "plain" | "alert" | "muted" }) {
  const border = tone === "alert" ? "border-dashed border-red-600/70" : tone === "muted" ? "border-dashed border-border" : "border-border";
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-2 ${border}`}>
      <span className="block text-xs text-muted-foreground">{title}</span>
      <div className="text-sm font-semibold leading-6">{children}</div>
    </div>
  );
}

function Detail({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="space-y-3">
        <Box title="검사할 정의">‘연습량만 늘리면 좋다’</Box>
        <div className="grid grid-cols-2 gap-2">
          <Box title="반례 1" tone="alert">부상</Box>
          <Box title="반례 2" tone="alert">수면 부족</Box>
        </div>
        <Ledger dim />
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-primary/60 px-3 py-2 text-center text-sm font-semibold">용기 · 절제 · 실천적 판단</div>
        <p className="text-center text-xs text-muted-foreground">세 덕이 아래 배분 전체에서 함께 작동하는지 묻습니다</p>
        <Ledger />
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <Box title="내 장부 · 준비 과정에서 고칠 선택">
            <div className="pt-1">
              <Ledger />
            </div>
          </Box>
          <Box title="장부 밖 · 바꿀 수 없었던 조건" tone="muted">
            상대 · 날씨 · 우연
            <span className="block text-xs font-normal text-muted-foreground">그래서 승리는 보장할 수 없습니다</span>
          </Box>
        </div>
        <div className="rounded-lg border border-dashed border-red-600/70 px-3 py-2 text-center text-sm">
          <span className="line-through decoration-red-600">승패 → 인격 점수</span>
          <span className="ml-2 text-xs text-muted-foreground">이렇게 바로 바꾸지 않습니다</span>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <Box title="이번 장부">고칠 선택을 찾음</Box>
        <span aria-hidden className="text-lg text-primary">→</span>
        <Box title="다음 훈련">판단을 수정</Box>
      </div>
      <Box title="다음 훈련의 배분 (글에서 정하지 않음)" tone="muted">
        <div className="pt-1">
          <Ledger blank />
        </div>
      </Box>
    </div>
  );
}

export default function TenHourThreeToolsViz() {
  return (
    <SceneShell
      eyebrow="세 도구를 차례로"
      title="10시간 계획을 문답·덕·통제 구분으로 읽는 순서"
      description="위 띠의 진한 칸이 지금 쓰는 도구입니다. 아래 10칸은 3절의 10시간이며 한 칸이 1시간입니다."
      ariaLabel="연습 6시간, 수면과 식사 2시간, 회복 2시간 계획을 문답, 덕, 통제 구분 순서로 검토하는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <ol className="grid grid-cols-3 gap-1">
              {TOOLS.map((tool, index) => (
                <li
                  key={tool}
                  className={`rounded-md border px-1 py-2 text-center text-sm font-semibold ${index === scene.tool ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}
                >
                  {tool}
                </li>
              ))}
            </ol>
            <Detail index={active} />
          </div>
        );
      }}
    />
  );
}
