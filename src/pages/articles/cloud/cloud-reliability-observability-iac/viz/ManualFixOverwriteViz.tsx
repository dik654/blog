import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 손으로 바꾼 설정은 기록이 남지 않고, 선언 파일과 실제 환경이 어긋난다.
 * #overview의 "급한 수동 수정은 다음 배포에서 다시 덮였습니다"를 시간 순서로 푼다.
 * 설정 값 A·B는 설명용 가정이다.
 */
type Cell = { value: string; tone: "same" | "diff" | "lost" | "fixed" };

const SCENES = [
  {
    label: "파일과 환경이 같습니다",
    summary: "선언 A = 실제 A",
    file: { value: "설정 A", tone: "same" },
    env: { value: "설정 A", tone: "same" },
    log: ["선언 파일 v1 검토·적용"],
    note: "자원의 원하는 상태를 파일에 적고 그대로 적용한 상태입니다. 이 설정은 파일만 봐도 실제 값을 알 수 있습니다.",
  },
  {
    label: "장애 중 운영 화면에서 손으로 수정",
    summary: "선언 A ≠ 실제 B",
    file: { value: "설정 A", tone: "diff" },
    env: { value: "설정 B", tone: "diff" },
    log: ["선언 파일 v1 검토·적용", "(운영 화면에서 손으로 A → B)"],
    note: "급히 운영 화면에서 B로 바꿨습니다. 누가 무엇을 바꿨는지 파일에 남지 않았고, 선언(A)과 실제(B)가 어긋났습니다. 이 어긋남을 드리프트(drift)라고 부릅니다.",
  },
  {
    label: "다음 배포가 파일대로 다시 적용하면",
    summary: "실제 B → 다시 A, 수정이 사라짐",
    file: { value: "설정 A", tone: "same" },
    env: { value: "설정 A", tone: "lost" },
    log: ["선언 파일 v1 검토·적용", "(운영 화면에서 손으로 A → B)", "다음 배포: 파일의 A를 다시 적용"],
    note: "다음 배포가 이 설정을 파일에 적힌 A로 다시 적용하면, 파일에 없던 B는 덮입니다. 1절 사건에서 수동 수정이 덮인 순서입니다. 도구가 추적하지 못하는 속성이라면 수동 변경이 그대로 남을 수도 있습니다(8절).",
  },
  {
    label: "수정을 파일에 넣고 계획을 검토",
    summary: "선언 B = 실제 B",
    file: { value: "설정 B", tone: "fixed" },
    env: { value: "설정 B", tone: "fixed" },
    log: ["선언 파일 v2: A → B 검토", "변경 계획 확인: 수정 1건", "작은 환경 시험 뒤 적용"],
    note: "수정을 파일에 적어 검토·버전 관리하면 다음 배포도 B를 유지합니다. 적용 전에는 변경 계획을 검토하고 작은 환경에서 시험합니다. 코드로 만들었다고 저절로 안전해지지는 않습니다.",
  },
] as const satisfies readonly { label: string; summary: string; file: Cell; env: Cell; log: readonly string[]; note: string }[];

const TONE: Record<Cell["tone"], string> = {
  same: "border-border text-foreground",
  diff: "border-[#d97706] bg-[#d97706]/10 text-[#b45309] dark:text-[#fbbf24]",
  lost: "border-[#dc2626] bg-[#dc2626]/10 text-[#b91c1c] dark:text-[#f87171]",
  fixed: "border-[#16a34a] bg-[#16a34a]/10 text-[#15803d] dark:text-[#4ade80]",
};

const LOG_SLOTS = 3;

function StateBox({ title, cell }: { title: string; cell: Cell }) {
  return (
    <div className={`min-w-0 rounded-lg border p-3 ${TONE[cell.tone]}`}>
      <p className="text-xs font-semibold text-muted-foreground">{title}</p>
      <p className="mt-1 font-mono text-lg font-bold">{cell.value}</p>
    </div>
  );
}

export default function ManualFixOverwriteViz() {
  return (
    <SceneShell
      eyebrow="선언과 실제"
      title="손으로 고친 설정은 다음 배포에서 덮일 수 있습니다"
      description="왼쪽은 검토·버전 관리되는 선언 파일, 오른쪽은 실제 운영 환경입니다. 설정 A·B는 설명용 가정입니다."
      ariaLabel="수동 수정이 선언 파일과 어긋난 뒤 다음 배포에서 덮이는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const log: readonly string[] = scene.log;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-3">
              <StateBox title="선언 파일(코드)" cell={scene.file} />
              <StateBox title="실제 환경" cell={scene.env} />
            </div>
            <p className="mt-4 text-xs font-semibold text-muted-foreground">일어난 순서 (점선 = 파일에 남지 않은 변경)</p>
            <ol className="mt-2 space-y-1">
              {Array.from({ length: LOG_SLOTS }, (_, index) => {
                const entry = log[index];
                return (
                  <li
                    key={index}
                    className={`min-h-[2rem] rounded-md border px-3 py-1 text-xs leading-5 ${
                      entry ? (entry.startsWith("(") ? "border-dashed border-[#d97706] text-muted-foreground" : "border-border text-foreground") : "border-dashed border-border/40"
                    }`}
                  >
                    {entry ?? " "}
                  </li>
                );
              })}
            </ol>
          </div>
        );
      }}
    />
  );
}
