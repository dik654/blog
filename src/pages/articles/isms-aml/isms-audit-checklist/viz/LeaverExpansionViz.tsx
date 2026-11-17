import SceneShell from "./SceneShell";

/**
 * 본문 대응: #trace-findings-remediation 첫 문단 — 살아 있는 퇴직자 계정 하나에서
 * HR termination feed·IAM disable job·exception queue·관리자 override와 전체 퇴직자 population으로 넓힌다.
 * Finding 칸: condition, violated criterion, cause, risk/effect, affected population, owner, due date.
 * 원인이 어느 단계인지, 영향 모집단이 몇 명인지는 본문에 없으므로 값을 정하지 않습니다.
 */
const PATH = [
  { id: "feed", label: "HR termination feed", sub: "퇴직 사실 전달" },
  { id: "job", label: "IAM disable job", sub: "계정 비활성화" },
] as const;
const SIDE = [
  { id: "queue", label: "exception queue", sub: "처리 못 한 건" },
  { id: "override", label: "관리자 override", sub: "수동 예외" },
] as const;

const FIELDS = ["condition", "criterion", "cause", "risk/effect", "affected population", "owner", "due date"] as const;

const SCENES = [
  {
    label: "발견",
    summary: "퇴직자 계정 1개가 살아 있음",
    note: "표본을 추적하다 이미 퇴직한 사람의 계정이 활성 상태인 것을 찾았습니다. 이것이 finding의 condition(관찰된 사실)입니다.",
  },
  {
    label: "그 계정만 지우면",
    summary: "사실 하나는 닫혀도 경로는 그대로",
    note: "계정 하나를 삭제하면 눈앞의 사실은 사라집니다. 하지만 그 계정이 왜 남았는지는 모르는 채이고, 같은 경로를 거친 다른 퇴직자 계정도 남아 있을 수 있습니다.",
  },
  {
    label: "경로 거슬러 확인",
    summary: "feed · job · queue · override",
    note: "퇴직 사실이 계정 비활성화까지 이어지는 길을 거슬러 갑니다. HR feed와 IAM disable job, 그리고 옆길인 exception queue와 관리자 override를 모두 확인합니다. 어느 칸이 원인인지는 확인 결과로 정하며 이 그림은 미리 정하지 않습니다.",
  },
  {
    label: "영향 모집단",
    summary: "같은 원인을 거친 퇴직자 전체",
    note: "기간 안의 퇴직자 population 전체를 query로 확인하고, 그중 원인이 된 칸을 지난 퇴직자가 affected population입니다. ? 원 모두가 영향 대상이라는 뜻은 아니며, 몇 명인지 본문에 없으므로 그림은 사람 수를 적지 않습니다.",
  },
  {
    label: "finding 일곱 칸",
    summary: "앞 장면이 채운 칸",
    note: "Finding은 condition, 어긴 기준(criterion), cause, risk/effect, affected population, owner, due date를 따로 적습니다. 앞 장면들이 condition·cause·affected population을 채웠고, criterion·risk/effect·owner·due date도 같은 finding에 구분해 적습니다.",
  },
] as const;

const FILLED_BY_SCENE: Record<(typeof FIELDS)[number], number | null> = {
  condition: 0,
  criterion: null,
  cause: 2,
  "risk/effect": null,
  "affected population": 3,
  owner: null,
  "due date": null,
};

function Node({ label, sub, on, side = false }: { label: string; sub: string; on: boolean; side?: boolean }) {
  return (
    <div
      className={`min-w-0 rounded-md border px-2 py-1.5 text-center text-[11px] leading-4 sm:text-xs ${
        `${side ? "border-dashed" : ""} ${on ? "border-primary bg-primary/[0.06]" : "border-border"}`
      }`}
    >
      <p className="break-keep font-semibold">{label}</p>
      <p className="text-muted-foreground">{on ? "확인" : sub}</p>
    </div>
  );
}

export default function LeaverExpansionViz() {
  return (
    <SceneShell
      eyebrow="finding 넓히기"
      title="퇴직자 계정 하나에서 영향 모집단까지"
      description="위 줄은 퇴직 사실이 계정 비활성화까지 가는 길, 점선 칸은 그 옆길입니다. 아래 칸이 finding에 적을 일곱 항목입니다."
      ariaLabel="살아 있는 퇴직자 계정 하나에서 처리 경로를 거슬러 원인을 찾고 같은 원인의 퇴직자 전체로 조사를 넓히는 과정"
      scenes={SCENES}
      render={(active) => {
        const tracing = active >= 2;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1">
              {PATH.map((node) => (
                <div key={node.id} className="contents">
                  <Node label={node.label} sub={node.sub} on={tracing} />
                  <span className="text-xs text-muted-foreground" aria-hidden>→</span>
                </div>
              ))}
              <div
                className={`min-w-0 rounded-md border px-2 py-1.5 text-center text-[11px] leading-4 sm:text-xs ${
                  active === 1 ? "border-dashed border-border" : "border-red-600"
                }`}
              >
                <p className="font-semibold">퇴직자 계정</p>
                <p className={active === 1 ? "text-muted-foreground line-through" : "font-semibold text-red-700 dark:text-red-400"}>
                  {active === 1 ? "삭제됨" : "활성"}
                </p>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {SIDE.map((node) => (
                <Node key={node.id} label={node.label} sub={node.sub} on={tracing} side />
              ))}
            </div>

            <div className={`mt-3 rounded-lg border px-3 py-2 ${active === 3 ? "border-amber-600" : "border-border"}`}>
              <p className="text-[11px] font-semibold text-muted-foreground sm:text-xs">같은 기간의 퇴직자 population</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1" aria-hidden>
                {Array.from({ length: 9 }, (_, index) => (
                  <span
                    key={index}
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                      index === 0 && active !== 1
                        ? "border-red-600 font-bold text-red-700 dark:text-red-400"
                        : active === 3
                          ? "border-amber-600 text-amber-700 dark:text-amber-400"
                          : "border-border text-muted-foreground/60"
                    }`}
                  >
                    {index === 0 ? "1" : "?"}
                  </span>
                ))}
                <span className="text-xs text-muted-foreground">…</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-4 text-muted-foreground sm:text-xs">
                {active === 3 ? "기간 내 퇴직자 전체를 query로 확인 → 그중 원인 칸을 지난 사람이 영향 모집단 (인원수는 본문에 없음)" : active === 1 ? "나머지 퇴직자는 아직 보지 않음" : "발견된 계정은 이 중 하나"}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-1 sm:grid-cols-4">
              {FIELDS.map((field) => {
                const by = FILLED_BY_SCENE[field];
                const filled = active === 4 ? by !== null : by === active;
                const shown = active === 4 || by === active;
                return (
                  <div
                    key={field}
                    className={`min-w-0 rounded-md border px-2 py-1 text-[11px] leading-4 sm:text-xs ${
                      filled ? "border-primary bg-primary/[0.06] font-semibold" : shown ? "border-border" : "border-dashed border-border/50 text-muted-foreground/60"
                    }`}
                  >
                    {field}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
