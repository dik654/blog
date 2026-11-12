import SceneShell from "./SceneShell";

/**
 * 본문 대응: #finalize-commit "외부 side effect는 application state와 별도 receipt가 필요합니다".
 * 재시작 표의 둘째 줄(block h41 · response h41 · app h40)이면 FinalizeBlock을 다시 실행한다.
 * 호출 성공만으로 완료 처리하면 지급이 두 번, 의도·고유 key를 state에 남기고 worker가 receipt를 대조하면 한 번.
 * key K와 지급 사례는 설명용 가정이다.
 */
type Row = { step: string; detail: string; tone: "plain" | "warn" | "ok" | "dim" };

const SCENES: readonly { label: string; summary: string; note: string; rows: readonly [Row, Row, Row]; paid: number; paidTone: "warn" | "ok" | "plain" }[] = [
  {
    label: "호출 성공으로 완료 처리",
    summary: "FinalizeBlock 안에서 지급 1회",
    note: "FinalizeBlock이 B41을 실행하면서 외부 지급을 바로 호출하고, 호출이 성공했으니 완료라고 봅니다.",
    rows: [
      { step: "FinalizeBlock(B41)", detail: "외부 지급 호출 → 성공", tone: "plain" },
      { step: "Commit 전 crash", detail: "block h41 · response h41 · app h40", tone: "dim" },
      { step: "재시작", detail: "아직 일어나지 않음", tone: "dim" },
    ],
    paid: 1,
    paidTone: "plain",
  },
  {
    label: "replay가 다시 호출",
    summary: "같은 지급이 2회",
    note: "Application durable state가 h40이므로 재시작 때 FinalizeBlock을 다시 실행합니다. 같은 코드가 외부 지급을 한 번 더 부르고, 외부 시스템에는 지급이 두 번 남습니다. AppHash는 여전히 일치할 수 있습니다.",
    rows: [
      { step: "FinalizeBlock(B41)", detail: "외부 지급 호출 → 성공", tone: "plain" },
      { step: "Commit 전 crash", detail: "block h41 · response h41 · app h40", tone: "plain" },
      { step: "재시작 → FinalizeBlock 재실행", detail: "외부 지급 다시 호출", tone: "warn" },
    ],
    paid: 2,
    paidTone: "warn",
  },
  {
    label: "의도와 key만 state에",
    summary: "FinalizeBlock은 기록만",
    note: "다른 설계에서는 FinalizeBlock이 외부를 부르지 않고 deterministic state에 '지급 의도 · key K'만 기록합니다. replay해도 같은 B41은 같은 의도와 key를 다시 만들 뿐 외부에는 아무 일도 없습니다.",
    rows: [
      { step: "FinalizeBlock(B41)", detail: "state에 의도 · key K 기록", tone: "ok" },
      { step: "Commit 전 crash", detail: "block h41 · response h41 · app h40", tone: "plain" },
      { step: "재시작 → FinalizeBlock 재실행", detail: "같은 의도 · key K", tone: "ok" },
    ],
    paid: 0,
    paidTone: "plain",
  },
  {
    label: "worker가 receipt 대조",
    summary: "key K로 확인 → 지급 1회",
    note: "별도 worker가 key K의 외부 결과 receipt를 확인하고, 없을 때만 실행하거나 재시도합니다. 이미 receipt가 있으면 건너뜁니다. 중복을 막는 근거는 이 key·receipt 대조이지 AppHash가 아닙니다.",
    rows: [
      { step: "Commit 이후 state", detail: "의도 · key K", tone: "plain" },
      { step: "worker", detail: "key K receipt 없음 → 지급 실행", tone: "ok" },
      { step: "worker 재시도", detail: "key K receipt 있음 → 건너뜀", tone: "ok" },
    ],
    paid: 1,
    paidTone: "ok",
  },
];

const TONE: Record<Row["tone"], string> = {
  plain: "border-border bg-background",
  warn: "border-red-600 bg-red-600/10 text-red-700 dark:text-red-300",
  ok: "border-primary bg-primary/10",
  dim: "border-dashed border-border text-muted-foreground",
};

const PAID_TONE = {
  warn: "border-red-600 text-red-700 dark:text-red-300",
  ok: "border-primary text-primary",
  plain: "border-border",
} as const;

export default function SideEffectReplayViz() {
  return (
    <SceneShell
      eyebrow="외부 side effect · replay"
      title="재실행되는 FinalizeBlock에서 지급은 몇 번 나갈까요?"
      description="왼쪽은 node와 application의 단계, 오른쪽은 외부 시스템에 남은 지급 횟수입니다. 앞 표의 둘째 줄처럼 Commit 전에 멈춘 경우를 따라갑니다."
      note="지급과 key K는 설명용 가정입니다. receipt는 외부 시스템이 그 key의 처리 결과를 남긴 기록입니다."
      ariaLabel="FinalizeBlock replay에서 외부 지급이 중복되는 설계와 key·receipt 대조 설계 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid grid-cols-[minmax(0,1fr)_5.5rem] gap-3 text-xs sm:grid-cols-[minmax(0,1fr)_8rem] sm:text-sm">
            <ol className="grid gap-2">
              {scene.rows.map((row, index) => (
                <li key={index} className={`min-w-0 rounded-md border p-2.5 ${TONE[row.tone]}`}>
                  <span className="block font-mono text-[11px] font-bold">{row.step}</span>
                  <span className="mt-1 block break-keep">{row.detail}</span>
                </li>
              ))}
            </ol>
            <div className={`flex flex-col items-center justify-center rounded-md border p-2 text-center ${PAID_TONE[scene.paidTone]}`}>
              <span className="text-[10px] font-black text-muted-foreground">외부 지급</span>
              <strong className="mt-1 font-mono text-3xl">{scene.paid}</strong>
              <span className="text-[11px]">회</span>
            </div>
          </div>
        );
      }}
    />
  );
}
